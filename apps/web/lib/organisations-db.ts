import fs from 'fs/promises';
import path from 'path';
import { Organisation, AccreditationStatus } from '@mobility-nexus/types';

const ORGS_FILE_PATH = path.join(process.cwd(), 'data', 'organisations.json');
const HOSTS_FILE_PATH = path.join(process.cwd(), 'data', 'hosts.json');

// Optional dynamic pg pool
let pgPool: any = null;
let pgChecked = false;

async function getPgPool(): Promise<any> {
  if (pgPool) return pgPool;
  if (pgChecked) return null;
  pgChecked = true;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  try {
    // @ts-ignore
    const { Pool } = await import('pg');
    const isSsl =
      process.env.DATABASE_SSL === 'true' ||
      connectionString.includes('sslmode=require') ||
      connectionString.includes('railway');

    pgPool = new Pool({
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
      connectionTimeoutMillis: 3000,
    });
    return pgPool;
  } catch {
    return null;
  }
}

export interface StoredOrgRecord {
  org: Organisation;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
  role: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface StoredHostRecord {
  host: any;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
}

// -----------------------------------------------------------------------------
// File persistence helpers
// -----------------------------------------------------------------------------

async function readOrgsFile(): Promise<StoredOrgRecord[]> {
  try {
    const content = await fs.readFile(ORGS_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(ORGS_FILE_PATH), { recursive: true });
      await fs.writeFile(ORGS_FILE_PATH, '[]', 'utf-8');
    }
    return [];
  }
}

async function writeOrgsFile(records: StoredOrgRecord[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(ORGS_FILE_PATH), { recursive: true });
    await fs.writeFile(ORGS_FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing organisations to file:', err);
  }
}

async function readHostsFile(): Promise<StoredHostRecord[]> {
  try {
    const content = await fs.readFile(HOSTS_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await fs.mkdir(path.dirname(HOSTS_FILE_PATH), { recursive: true });
      await fs.writeFile(HOSTS_FILE_PATH, '[]', 'utf-8');
    }
    return [];
  }
}

async function writeHostsFile(records: StoredHostRecord[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(HOSTS_FILE_PATH), { recursive: true });
    await fs.writeFile(HOSTS_FILE_PATH, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing hosts to file:', err);
  }
}

// -----------------------------------------------------------------------------
// Public Database Accessor
// -----------------------------------------------------------------------------

export const OrganisationsDb = {
  /**
   * Retrieves an organisation by User ID (from PostgreSQL with file fallback)
   */
  async getByUserId(userId: string): Promise<{ org: Organisation; role: string } | null> {
    // 1. Try PostgreSQL if available
    try {
      const pool = await getPgPool();
      if (pool) {
        const query = `
          SELECT 
            o.id,
            o.name,
            o.slug,
            o.oid,
            o.city,
            o.country_code as "countryCode",
            o.accreditation_status as "accreditationStatus",
            o.erasmus_plan as "erasmusPlan",
            o.institution_need as "institutionNeed",
            o.readiness_score as "readinessScore",
            o.is_active as "isActive",
            o.settings,
            o.created_at as "createdAt",
            o.updated_at as "updatedAt",
            COALESCE(m.role, 'ORG_ADMIN') as role
          FROM organisation o
          LEFT JOIN membership m ON m.organisation_id = o.id
          WHERE m.user_id = $1 OR o.settings->>'userId' = $1
          LIMIT 1
        `;
        const res = await pool.query(query, [userId]);
        if (res.rows.length > 0) {
          const row = res.rows[0];
          return {
            org: {
              id: row.id,
              name: row.name,
              slug: row.slug,
              oid: row.oid,
              city: row.city,
              countryCode: row.countryCode,
              accreditationStatus: row.accreditationStatus,
              erasmusPlan: row.erasmusPlan,
              institutionNeed: row.institutionNeed,
              readinessScore: row.readinessScore,
              isActive: row.isActive,
              settings: row.settings || {},
              createdAt: row.createdAt,
              updatedAt: row.updatedAt,
            },
            role: row.role,
          };
        }
      }
    } catch (err) {
      console.warn('[OrganisationsDb] PG lookup error, using file storage fallback:', err);
    }

    // 2. File fallback
    const records = await readOrgsFile();
    const match = records.find((r) => r.userId === userId);
    if (match) {
      return { org: match.org, role: match.role };
    }

    return null;
  },

  /**
   * Retrieves an organisation by ID
   */
  async getById(orgId: string): Promise<Organisation | null> {
    try {
      const pool = await getPgPool();
      if (pool) {
        const res = await pool.query(
          `SELECT id, name, slug, oid, city, country_code as "countryCode", 
                  accreditation_status as "accreditationStatus", erasmus_plan as "erasmusPlan",
                  institution_need as "institutionNeed", readiness_score as "readinessScore",
                  is_active as "isActive", settings, created_at as "createdAt", updated_at as "updatedAt"
           FROM organisation WHERE id = $1 LIMIT 1`,
          [orgId]
        );
        if (res.rows.length > 0) return res.rows[0];
      }
    } catch {}

    const records = await readOrgsFile();
    const match = records.find((r) => r.org.id === orgId);
    return match ? match.org : null;
  },

  /**
   * Creates or updates a school organisation in PostgreSQL and persistent file storage
   */
  async saveOrganisation(
    payload: {
      name: string;
      oid?: string;
      city?: string;
      countryCode?: string;
      accreditationStatus?: AccreditationStatus;
      erasmusPlan?: string;
      institutionNeed?: string;
      userId?: string;
      userEmail?: string;
      userFullName?: string;
    },
    role: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER' = 'ORG_ADMIN'
  ): Promise<Organisation> {
    const slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const orgId = `org-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const isValidOid = Boolean(payload.oid && /^E10[0-9]{5,7}$/i.test(payload.oid.trim()));
    let readinessScore = 0;
    if (payload.name && payload.name.trim().length >= 3 && payload.city && payload.city.trim().length >= 2) readinessScore += 30;
    if (payload.accreditationStatus === 'YES') readinessScore += 35;
    else if (payload.accreditationStatus === 'NO') readinessScore += 20;
    if (isValidOid) readinessScore += 35;

    const newOrg: Organisation = {
      id: orgId,
      name: payload.name,
      slug: slug || 'okul',
      oid: payload.oid || null,
      city: payload.city || null,
      countryCode: payload.countryCode || 'TR',
      accreditationStatus: payload.accreditationStatus || 'UNKNOWN',
      erasmusPlan: payload.erasmusPlan || null,
      institutionNeed: payload.institutionNeed || null,
      readinessScore,
      isActive: true,
      settings: {
        userId: payload.userId || null,
        userEmail: payload.userEmail || null,
        userFullName: payload.userFullName || null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Try PostgreSQL insertion
    try {
      const pool = await getPgPool();
      if (pool) {
        await pool.query(
          `INSERT INTO organisation (
            id, name, slug, oid, city, country_code, accreditation_status,
            erasmus_plan, institution_need, readiness_score, is_active, settings
          ) VALUES (
            gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, true, $10
          ) RETURNING id`,
          [
            newOrg.name,
            `${newOrg.slug}-${Date.now().toString(36)}`,
            newOrg.oid,
            newOrg.city,
            newOrg.countryCode,
            newOrg.accreditationStatus,
            newOrg.erasmusPlan,
            newOrg.institutionNeed,
            newOrg.readinessScore,
            JSON.stringify(newOrg.settings),
          ]
        );
      }
    } catch (err) {
      console.warn('[OrganisationsDb] PG insert failed, persisting to file:', err);
    }

    // 2. Persist to persistent file storage
    const records = await readOrgsFile();
    // Update existing user record or prepend
    const existingIndex = records.findIndex(
      (r) =>
        (payload.userId && r.userId === payload.userId) ||
        (payload.oid && r.org.oid && r.org.oid === payload.oid)
    );

    const record: StoredOrgRecord = {
      org: newOrg,
      userId: payload.userId,
      userEmail: payload.userEmail,
      userFullName: payload.userFullName,
      role,
    };

    if (existingIndex >= 0) {
      records[existingIndex] = record;
    } else {
      records.unshift(record);
    }

    await writeOrgsFile(records);
    return newOrg;
  },

  /**
   * Retrieves a host organisation by User ID
   */
  async getHostByUserId(userId: string): Promise<any | null> {
    try {
      const pool = await getPgPool();
      if (pool) {
        const query = `
          SELECT * FROM host_organisation 
          WHERE contact_email = (SELECT email FROM user_account WHERE id = $1)
             OR (SELECT email FROM user_account WHERE id = $1) = contact_email
          LIMIT 1
        `;
        const res = await pool.query(query, [userId]);
        if (res.rows.length > 0) return res.rows[0];
      }
    } catch {}

    const records = await readHostsFile();
    const match = records.find((r) => r.userId === userId);
    return match ? match.host : null;
  },

  /**
   * Saves a host organisation
   */
  async saveHost(payload: any, userId?: string): Promise<any> {
    const hostId = `host-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const newHost = {
      id: hostId,
      name: payload.name,
      tradingName: payload.tradingName || payload.name,
      organisationType: payload.organisationType || 'Company',
      countryCode: payload.countryCode || 'DE',
      city: payload.city,
      address: payload.registeredAddress || payload.address || null,
      websiteUrl: payload.websiteUrl || null,
      generalEmail: payload.generalEmail || null,
      primarySector: payload.primarySector,
      verificationStatus: 'PENDING',
      contactPerson: payload.contactPerson,
      contactEmail: payload.contactEmail,
      contactPhone: payload.telephone || payload.contactPhone || null,
      languages: payload.languages || payload.workingLanguages || ['EN'],
      maxLearnersPerTerm: payload.maxLearnersPerTerm || 4,
      totalAnnualCapacity: payload.totalAnnualCapacity || 12,
      activities: payload.activities || ['VET_INTERNSHIP'],
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const records = await readHostsFile();
    const existingIdx = records.findIndex(
      (r) => (userId && r.userId === userId) || (payload.oid && r.host.oid === payload.oid)
    );

    const record: StoredHostRecord = {
      host: newHost,
      userId,
      userEmail: payload.userEmail || payload.contactEmail,
      userFullName: payload.userFullName || payload.contactPerson,
    };

    if (existingIdx >= 0) {
      records[existingIdx] = record;
    } else {
      records.unshift(record);
    }

    await writeHostsFile(records);
    return newHost;
  },
};
