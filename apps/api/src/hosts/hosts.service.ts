import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../audit/audit.service';
import { RegisterHostDto } from './dto/register-host.dto';

export interface HostOrganisation {
  id: string;
  name: string;
  slug: string;
  countryCode: string;
  city: string;
  address?: string | null;
  websiteUrl?: string | null;
  primarySector: string;
  verificationStatus: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone?: string | null;
  languages: string[];
  maxLearnersPerTerm: number;
  totalAnnualCapacity: number;
  activities: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

@Injectable()
export class HostsService {
  private readonly logger = new Logger(HostsService.name);
  private hostsMemory = new Map<string, HostOrganisation>();

  constructor(
    private readonly db: DatabaseService,
    private readonly auditService: AuditService,
  ) {}

  async register(
    dto: RegisterHostDto,
    correlationId: string,
  ): Promise<HostOrganisation> {
    const slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // 1. Duplicate check in DB
    if (this.db.isConnected) {
      try {
        const existing = await this.db.query(
          `SELECT id FROM host_organisation WHERE slug = $1 OR contact_email = $2 LIMIT 1`,
          [slug, dto.contactEmail.trim().toLowerCase()],
        );
        if (existing && existing.length > 0) {
          throw new ConflictException(
            'Bu kurum adı veya e-posta adresi ile kayıtlı bir ev sahibi işletme zaten mevcut.',
          );
        }
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
      }
    }

    const hostId = uuidv4();
    const languages = dto.languages && dto.languages.length > 0 ? dto.languages : ['EN'];
    const maxLearners = dto.maxLearnersPerTerm || 4;
    const totalAnnual = dto.totalAnnualCapacity || (maxLearners * 3);
    const activities = dto.activities && dto.activities.length > 0 
      ? dto.activities 
      : ['VET_INTERNSHIP', 'JOB_SHADOWING'];

    let actualUserId: string | null = null;

    if (this.db.isConnected) {
      try {
        // Resolve user if provided
        if (dto.userId) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(dto.userId);
          const clerkEmail = `${dto.userId}@clerk.user`;
          const fullName = dto.userFullName || `${dto.name} Temsilcisi`;

          const existingUsers = await this.db.query(
            `SELECT id FROM user_account WHERE email = $1 OR id::text = $2 LIMIT 1`,
            [clerkEmail, dto.userId],
          );
          if (existingUsers && existingUsers.length > 0) {
            actualUserId = existingUsers[0].id;
          } else {
            const newId = isUuid ? dto.userId : uuidv4();
            await this.db.query(
              `INSERT INTO user_account (id, email, full_name, is_active, email_verified)
               VALUES ($1, $2, $3, TRUE, TRUE)
               ON CONFLICT (email) DO NOTHING`,
              [newId, clerkEmail, fullName],
            );
            actualUserId = newId;
          }
        }

        // Insert host_organisation
        await this.db.query(
          `INSERT INTO host_organisation (
            id, name, slug, country_code, city, address, website_url, primary_sector,
            verification_status, contact_person, contact_email, contact_phone, languages,
            is_active, created_by_user_id, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'PENDING', $9, $10, $11, $12, TRUE, $13, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
          [
            hostId,
            dto.name.trim(),
            slug,
            dto.countryCode.trim().toUpperCase(),
            dto.city.trim(),
            dto.address?.trim() || null,
            dto.websiteUrl?.trim() || null,
            dto.primarySector.trim().toLowerCase(),
            dto.contactPerson.trim(),
            dto.contactEmail.trim().toLowerCase(),
            dto.contactPhone?.trim() || null,
            languages,
            actualUserId,
          ],
        );

        // Insert host_capacity
        await this.db.query(
          `INSERT INTO host_capacity (id, host_id, max_learners_per_term, total_annual_capacity)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (host_id) DO NOTHING`,
          [uuidv4(), hostId, maxLearners, totalAnnual],
        );

        // Insert host_activity records
        for (const act of activities) {
          const title = act === 'JOB_SHADOWING' 
            ? 'İşbaşı Gözlem ve Mesleki Ziyaret' 
            : 'VET Öğrenci Staj ve Beceri Eğitimi';
          await this.db.query(
            `INSERT INTO host_activity (id, host_id, activity_type, title, min_duration_days, max_duration_days)
             VALUES ($1, $2, $3, $4, 14, 90)`,
            [uuidv4(), hostId, act, title],
          );
        }

        // Insert initial host_verification record (Pending state)
        await this.db.query(
          `INSERT INTO host_verification (id, host_id, status)
           VALUES ($1, $2, 'PENDING')`,
          [uuidv4(), hostId],
        );

        this.logger.log(`[DB] Ev Sahibi Kurum (Host) kaydedildi: ${dto.name} (ID: ${hostId})`);
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
        this.logger.warn(`Host DB insert hatası: ${err.message}`);
      }
    }

    const hostOrg: HostOrganisation = {
      id: hostId,
      name: dto.name.trim(),
      slug,
      countryCode: dto.countryCode.trim().toUpperCase(),
      city: dto.city.trim(),
      address: dto.address?.trim() || null,
      websiteUrl: dto.websiteUrl?.trim() || null,
      primarySector: dto.primarySector.trim().toLowerCase(),
      verificationStatus: 'PENDING',
      contactPerson: dto.contactPerson.trim(),
      contactEmail: dto.contactEmail.trim().toLowerCase(),
      contactPhone: dto.contactPhone?.trim() || null,
      languages,
      maxLearnersPerTerm: maxLearners,
      totalAnnualCapacity: totalAnnual,
      activities,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.hostsMemory.set(hostId, hostOrg);

    await this.auditService.logEvent({
      organisationId: undefined,
      userId: dto.userId,
      action: 'HOST_REGISTERED',
      resourceType: 'host_organisation',
      resourceId: hostId,
      payloadAfter: hostOrg as unknown as Record<string, unknown>,
      correlationId,
    });

    return hostOrg;
  }

  async findByUser(userId: string): Promise<HostOrganisation | null> {
    if (this.db.isConnected) {
      try {
        const clerkEmail = `${userId}@clerk.user`;
        const rows = await this.db.query(
          `SELECT 
            h.id, h.name, h.slug, h.country_code AS "countryCode", h.city, 
            h.address, h.website_url AS "websiteUrl", h.primary_sector AS "primarySector",
            h.verification_status AS "verificationStatus", h.contact_person AS "contactPerson",
            h.contact_email AS "contactEmail", h.contact_phone AS "contactPhone",
            h.languages, h.is_active AS "isActive", h.created_at AS "createdAt", h.updated_at AS "updatedAt",
            c.max_learners_per_term AS "maxLearnersPerTerm", c.total_annual_capacity AS "totalAnnualCapacity"
          FROM host_organisation h
          LEFT JOIN host_capacity c ON c.host_id = h.id
          LEFT JOIN user_account u ON u.id = h.created_by_user_id
          WHERE u.email = $1 OR u.id::text = $2 OR h.created_by_user_id::text = $2
          ORDER BY h.created_at DESC
          LIMIT 1`,
          [clerkEmail, userId],
        );
        if (rows && rows.length > 0) {
          const row = rows[0];
          return {
            ...row,
            maxLearnersPerTerm: row.maxLearnersPerTerm || 4,
            totalAnnualCapacity: row.totalAnnualCapacity || 12,
            activities: ['VET_INTERNSHIP', 'JOB_SHADOWING'],
          };
        }
      } catch (err: any) {
        this.logger.warn(`findByUser Host error: ${err.message}`);
      }
    }
    return null;
  }

  async findOne(id: string): Promise<HostOrganisation> {
    if (this.db.isConnected) {
      try {
        const rows = await this.db.query(
          `SELECT 
            h.id, h.name, h.slug, h.country_code AS "countryCode", h.city, 
            h.address, h.website_url AS "websiteUrl", h.primary_sector AS "primarySector",
            h.verification_status AS "verificationStatus", h.contact_person AS "contactPerson",
            h.contact_email AS "contactEmail", h.contact_phone AS "contactPhone",
            h.languages, h.is_active AS "isActive", h.created_at AS "createdAt", h.updated_at AS "updatedAt",
            c.max_learners_per_term AS "maxLearnersPerTerm", c.total_annual_capacity AS "totalAnnualCapacity"
          FROM host_organisation h
          LEFT JOIN host_capacity c ON c.host_id = h.id
          WHERE h.id = $1`,
          [id],
        );
        if (rows && rows.length > 0) {
          const row = rows[0];
          return {
            ...row,
            maxLearnersPerTerm: row.maxLearnersPerTerm || 4,
            totalAnnualCapacity: row.totalAnnualCapacity || 12,
            activities: ['VET_INTERNSHIP', 'JOB_SHADOWING'],
          };
        }
      } catch (err: any) {
        this.logger.warn(`findOne Host error: ${err.message}`);
      }
    }

    const memory = this.hostsMemory.get(id);
    if (!memory) {
      throw new NotFoundException(`Ev sahibi kurum bulunamadı (ID: ${id})`);
    }
    return memory;
  }
}
