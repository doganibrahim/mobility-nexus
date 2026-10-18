import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import type { Organisation, AccreditationStatus } from '@mobility-nexus/types';

function getDataFilePath(filename: string): string {
  const directPath = path.join(process.cwd(), 'data', filename);
  const webPath = path.join(process.cwd(), 'apps', 'web', 'data', filename);
  try {
    if (fsSync.existsSync(webPath)) return webPath;
    if (fsSync.existsSync(directPath)) return directPath;
    if (fsSync.existsSync(path.join(process.cwd(), 'apps', 'web'))) return webPath;
  } catch {}
  return directPath;
}

const ORGS_FILE_PATH = getDataFilePath('organisations.json');
const HOSTS_FILE_PATH = getDataFilePath('hosts.json');

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
    const match = records.find(
      (r) =>
        r.userId === userId ||
        (r.userEmail && r.userEmail.toLowerCase() === userId.toLowerCase()) ||
        (r.host.contactEmail && r.host.contactEmail.toLowerCase() === userId.toLowerCase()) ||
        r.host.id === userId
    );
    if (match) {
      const host = { ...match.host };
      if (typeof host.profileCompletenessScore !== 'number') {
        host.profileCompletenessScore = calculateCompletenessScore(host);
      }
      return host;
    }
    return null;
  },

  /**
   * Saves or updates a host organisation
   */
  async saveHost(payload: any, userId?: string): Promise<any> {
    const records = await readHostsFile();
    const existingIdx = records.findIndex(
      (r) =>
        (payload.id && r.host.id === payload.id) ||
        (userId && r.userId === userId) ||
        (payload.oid && r.host.oid && r.host.oid === payload.oid) ||
        (payload.contactEmail && r.host.contactEmail && r.host.contactEmail.toLowerCase() === payload.contactEmail.toLowerCase())
    );

    const existingHost = existingIdx >= 0 ? records[existingIdx].host : null;
    const hostId =
      payload.id ||
      existingHost?.id ||
      `host-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;

    const updatedHost = {
      ...existingHost,
      id: hostId,
      name: payload.name,
      tradingName: payload.tradingName || payload.name,
      organisationType: payload.organisationType || 'Company',
      countryCode: payload.countryCode || 'DE',
      city: payload.city,
      address: payload.registeredAddress || payload.address || null,
      registeredAddress: payload.registeredAddress || payload.address || null,
      operationalAddress: payload.operationalAddress || null,
      yearEstablished: Number(payload.yearEstablished) || 2018,
      oid: payload.oid || null,
      picNumber: payload.picNumber || null,
      websiteUrl: payload.websiteUrl || null,
      generalEmail: payload.generalEmail || null,
      telephone: payload.telephone || payload.contactPhone || null,
      primarySector: payload.primarySector,
      sectors: payload.sectors || (payload.primarySector ? [payload.primarySector] : ['ict']),
      verificationStatus: existingHost?.verificationStatus || 'PENDING',
      contactPerson: payload.contactPerson,
      contactTitle: payload.contactTitle || null,
      contactEmail: payload.contactEmail,
      contactPhone: payload.telephone || payload.contactPhone || null,
      consentPublicDisplay: payload.consentPublicDisplay ?? true,
      languages: payload.languages || payload.workingLanguages || ['EN'],
      workingLanguages: payload.workingLanguages || payload.languages || ['EN'],
      maxLearnersPerTerm: payload.maxLearnersPerTerm || 4,
      totalAnnualCapacity: payload.totalAnnualCapacity || 12,
      activities: payload.activities || ['VET_INTERNSHIP'],
      isActive: true,
      createdAt: existingHost?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      profileCompletenessScore: 40,
    };
    updatedHost.profileCompletenessScore = calculateCompletenessScore(updatedHost);

    const record: StoredHostRecord = {
      host: updatedHost,
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
    return updatedHost;
  },

  /**
   * Retrieves all registered host organisations
   */
  async getAllHosts(): Promise<any[]> {
    const records = await readHostsFile();
    return records.map((r) => {
      const h = { ...r.host };
      if (typeof h.profileCompletenessScore !== 'number') {
        h.profileCompletenessScore = calculateCompletenessScore(h);
      }
      return h;
    });
  },

  /**
   * Retrieves a host organisation by its ID
   */
  async getHostById(hostId: string): Promise<any | null> {
    const records = await readHostsFile();
    const match = records.find((r) => r.host.id === hostId);
    return match ? match.host : null;
  },

  /**
   * Updates host portfolio & recalculated completeness score
   */
  async updateHostPortfolio(hostId: string, payload: any): Promise<any> {
    const records = await readHostsFile();
    const idx = records.findIndex((r) => r.host.id === hostId);
    if (idx >= 0) {
      const mergedHost = {
        ...records[idx].host,
        ...payload,
        updatedAt: new Date().toISOString(),
      };
      mergedHost.profileCompletenessScore = calculateCompletenessScore(mergedHost);
      records[idx].host = mergedHost;
      await writeHostsFile(records);
      return mergedHost;
    }
    return null;
  },

  /**
   * Submits host official KYC verification documents
   */
  async submitHostVerification(hostId: string, payload: any): Promise<any> {
    const records = await readHostsFile();
    const idx = records.findIndex((r) => r.host.id === hostId);
    if (idx >= 0) {
      const mergedHost = {
        ...records[idx].host,
        ...payload,
        verificationStatus: 'UNDER_REVIEW',
        updatedAt: new Date().toISOString(),
      };
      mergedHost.profileCompletenessScore = calculateCompletenessScore(mergedHost);
      records[idx].host = mergedHost;
      await writeHostsFile(records);
      return mergedHost;
    }
    return null;
  },

  /**
   * Admin reviews verification request (VERIFIED, NEEDS_UPDATE, REJECTED)
   */
  async reviewHostVerification(
    hostId: string,
    status: 'VERIFIED' | 'NEEDS_UPDATE' | 'REJECTED',
    reviewerNotes?: string,
    criteriaChecklist?: Record<string, boolean>,
  ): Promise<any> {
    const records = await readHostsFile();
    const idx = records.findIndex((r) => r.host.id === hostId);
    if (idx >= 0) {
      const mergedHost = {
        ...records[idx].host,
        verificationStatus: status,
        reviewerNotes: reviewerNotes !== undefined ? reviewerNotes : records[idx].host.reviewerNotes,
        criteriaChecklist: criteriaChecklist !== undefined ? criteriaChecklist : records[idx].host.criteriaChecklist,
        reviewedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mergedHost.profileCompletenessScore = calculateCompletenessScore(mergedHost);
      records[idx].host = mergedHost;
      await writeHostsFile(records);
      return mergedHost;
    }
    return null;
  },
};

function calculateCompletenessScore(host: any): number {
  let score = 40; // Base Tier 1 (Registered with name, OID, city, address, contact)
  if (host.shortDescription && host.shortDescription.length > 20) score += 10;
  if (host.logoUrl) score += 5;
  if (host.sampleMobilityProgrammeUrl) score += 10;
  if (Number(host.yearsOfExperience) > 0 || Number(host.totalParticipantsHosted) > 0) score += 10;
  if (host.registrationDocumentUrl && host.taxVatNumber) {
    if (host.verificationStatus === 'VERIFIED') {
      score += 25; // Reaches 100%
    } else if (host.verificationStatus === 'UNDER_REVIEW') {
      score += 15; // Reaches 90%
    } else {
      score += 5;
    }
  } else if (host.verificationStatus === 'VERIFIED') {
    score += 25;
  }
  return Math.min(100, score);
}
