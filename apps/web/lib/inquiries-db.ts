import fs from 'fs/promises';
import path from 'path';
import { MobilityInquiry } from './store';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'inquiries.json');

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
    // Dynamic import to prevent bundler crash when pg is not installed in web workspace
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

/**
 * Reads inquiries from persistent JSON storage
 */
async function readInquiriesFromFile(): Promise<MobilityInquiry[]> {
  try {
    const content = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [];
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      // Create empty file if not exists
      await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
      await fs.writeFile(DATA_FILE_PATH, '[]', 'utf-8');
      return [];
    }
    console.error('Error reading inquiries from file:', err);
    return [];
  }
}

/**
 * Writes inquiries to persistent JSON storage
 */
async function writeInquiriesToFile(inquiries: MobilityInquiry[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(inquiries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing inquiries to file:', err);
  }
}

export const InquiriesDb = {
  /**
   * Retrieves all inquiries (from Postgres if available, with file fallback)
   */
  async getAll(): Promise<MobilityInquiry[]> {
    try {
      const pool = await getPgPool();
      if (pool) {
        const res = await pool.query(
          `SELECT 
            id,
            created_at as "createdAt",
            is_mock as "isMock",
            school_name as "schoolName",
            school_city as "schoolCity",
            school_oid as "schoolOid",
            school_contact_name as "schoolContactName",
            school_contact_email as "schoolContactEmail",
            project_type as "projectType",
            host_id as "hostId",
            host_name as "hostName",
            host_country as "hostCountry",
            vet_field as "vetField",
            isced_code as "iscedCode",
            participant_count as "participantCount",
            accompanying_persons_count as "accompanyingPersonsCount",
            duration_days as "durationDays",
            target_start_date as "targetStartDate",
            target_end_date as "targetEndDate",
            logistics_required as "logisticsRequired",
            notes,
            status,
            host_reply_note as "hostReplyNote"
           FROM mobility_inquiries 
           ORDER BY created_at DESC`,
        );
        if (res.rows && res.rows.length > 0) {
          return res.rows;
        }
      }
    } catch (err: any) {
      // Graceful fallback to file
    }

    return await readInquiriesFromFile();
  },

  /**
   * Saves a new inquiry to persistent storage and Postgres
   */
  async create(inquiry: MobilityInquiry): Promise<MobilityInquiry> {
    // 1. Write to persistent JSON storage
    const currentList = await readInquiriesFromFile();
    const updatedList = [inquiry, ...currentList.filter((i) => i.id !== inquiry.id)];
    await writeInquiriesToFile(updatedList);

    // 2. Write to Postgres if connected
    try {
      const pool = await getPgPool();
      if (pool) {
        await pool.query(
          `INSERT INTO mobility_inquiries (
            id, created_at, is_mock, school_name, school_city, school_oid,
            school_contact_name, school_contact_email, project_type,
            host_id, host_name, host_country, vet_field, isced_code,
            participant_count, accompanying_persons_count, duration_days,
            target_start_date, target_end_date, logistics_required,
            notes, status, host_reply_note
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            host_reply_note = EXCLUDED.host_reply_note,
            updated_at = CURRENT_TIMESTAMP`,
          [
            inquiry.id,
            inquiry.createdAt || new Date().toISOString(),
            Boolean(inquiry.isMock),
            inquiry.schoolName,
            inquiry.schoolCity,
            inquiry.schoolOid,
            inquiry.schoolContactName || null,
            inquiry.schoolContactEmail || null,
            inquiry.projectType,
            inquiry.hostId,
            inquiry.hostName,
            inquiry.hostCountry,
            inquiry.vetField,
            inquiry.iscedCode || null,
            inquiry.participantCount,
            inquiry.accompanyingPersonsCount,
            inquiry.durationDays,
            inquiry.targetStartDate,
            inquiry.targetEndDate,
            JSON.stringify(inquiry.logisticsRequired || {}),
            inquiry.notes || null,
            inquiry.status || 'PENDING',
            inquiry.hostReplyNote || null,
          ],
        );
      }
    } catch {
      // Suppress Postgres errors since file persistence succeeded
    }

    return inquiry;
  },

  /**
   * Updates status and host reply note of an inquiry
   */
  async updateStatus(
    id: string,
    status: MobilityInquiry['status'],
    hostReplyNote?: string,
  ): Promise<MobilityInquiry | null> {
    // 1. Update in persistent JSON storage
    const list = await readInquiriesFromFile();
    let updatedInquiry: MobilityInquiry | null = null;

    const updatedList = list.map((item) => {
      if (item.id === id) {
        updatedInquiry = {
          ...item,
          status,
          hostReplyNote: hostReplyNote !== undefined ? hostReplyNote : item.hostReplyNote,
        };
        return updatedInquiry;
      }
      return item;
    });

    if (updatedInquiry) {
      await writeInquiriesToFile(updatedList);
    }

    // 2. Update in Postgres
    try {
      const pool = await getPgPool();
      if (pool) {
        await pool.query(
          `UPDATE mobility_inquiries 
           SET status = $1, host_reply_note = COALESCE($2, host_reply_note), updated_at = CURRENT_TIMESTAMP
           WHERE id = $3`,
          [status, hostReplyNote || null, id],
        );
      }
    } catch {
      // Suppress Postgres errors
    }

    return updatedInquiry;
  },

  /**
   * Deletes an inquiry
   */
  async delete(id: string): Promise<boolean> {
    const list = await readInquiriesFromFile();
    const filtered = list.filter((i) => i.id !== id);
    await writeInquiriesToFile(filtered);

    try {
      const pool = await getPgPool();
      if (pool) {
        await pool.query('DELETE FROM mobility_inquiries WHERE id = $1', [id]);
      }
    } catch {
      // Suppress Postgres errors
    }

    return true;
  },
};
