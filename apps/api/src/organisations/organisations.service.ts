import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Organisation,
  ReadinessScoreResponse,
} from '@mobility-nexus/types';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { AuditService } from '../audit/audit.service';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class OrganisationsService {
  private readonly logger = new Logger(OrganisationsService.name);
  private organisations: Map<string, Organisation> = new Map();

  constructor(
    private readonly auditService: AuditService,
    private readonly db: DatabaseService,
  ) {
    // Seed an initial demo organization
    const demoId = 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d';
    this.organisations.set(demoId, {
      id: demoId,
      name: 'Ankara Mesleki ve Teknik Anadolu Lisesi',
      slug: 'ankara-mtal',
      oid: 'E10123456',
      city: 'Ankara',
      countryCode: 'TR',
      accreditationStatus: 'YES',
      erasmusPlan:
        'Öğretmen ve öğrencilerin Industry 4.0, PLC ve dijital otomasyon yetkinliklerini Avrupa standartlarında geliştirmek.',
      institutionNeed:
        'Okul laboratuvarında yeni nesil endüstriyel haberleşme protokolleri ve robotik kodlama konusunda pratik uygulama açığı bulunması.',
      readinessScore: 92,
      isActive: true,
      settings: { theme: 'theme-01', locale: 'tr' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async create(
    dto: CreateOrganisationDto,
    correlationId: string,
    userId?: string,
  ): Promise<Organisation> {
    const slug =
      dto.slug ||
      dto.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    // Check slug or OID uniqueness
    if (this.db.isConnected) {
      try {
        const existing = await this.db.query(
          `SELECT id FROM organisation WHERE slug = $1 OR (oid IS NOT NULL AND oid = $2) LIMIT 1`,
          [slug, dto.oid || null],
        );
        if (existing.length > 0) {
          throw new ConflictException(
            'Bu isim, slug veya OID ile kayıtlı bir kurum zaten mevcut.',
          );
        }
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
      }
    } else {
      const existing = Array.from(this.organisations.values()).find(
        (o) => o.slug === slug || (dto.oid && o.oid === dto.oid),
      );
      if (existing) {
        throw new ConflictException(
          'Bu isim, slug veya OID ile kayıtlı bir kurum zaten mevcut.',
        );
      }
    }

    const id = uuidv4();
    const readiness = this.calculateReadiness({
      ...dto,
      id,
      slug,
      countryCode: dto.countryCode || 'TR',
      accreditationStatus: dto.accreditationStatus || 'UNKNOWN',
      isActive: true,
      settings: {},
      readinessScore: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const organisation: Organisation = {
      id,
      name: dto.name,
      slug,
      oid: dto.oid || null,
      city: dto.city || null,
      countryCode: dto.countryCode || 'TR',
      accreditationStatus: dto.accreditationStatus || 'UNKNOWN',
      erasmusPlan: dto.erasmusPlan || null,
      institutionNeed: dto.institutionNeed || null,
      readinessScore: readiness.score,
      isActive: true,
      settings: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 1. Write to PostgreSQL if connected
    if (this.db.isConnected) {
      try {
        await this.db.query(
          `INSERT INTO organisation (
            id, name, slug, oid, city, country_code, accreditation_status, 
            erasmus_plan, institution_need, readiness_score, is_active, settings, created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
          [
            organisation.id,
            organisation.name,
            organisation.slug,
            organisation.oid,
            organisation.city,
            organisation.countryCode,
            organisation.accreditationStatus,
            organisation.erasmusPlan,
            organisation.institutionNeed,
            organisation.readinessScore,
            organisation.isActive,
            JSON.stringify(organisation.settings || {}),
            organisation.createdAt,
            organisation.updatedAt,
          ],
        );
        this.logger.log(`[DB] Kurum PostgreSQL'e kaydedildi: ${organisation.name} (${organisation.id})`);

        // 2. Multi-tenant RBAC: create or find user account & membership
        if (userId) {
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userId);
          const clerkEmail = `${userId}@clerk.user`;
          const fullName = dto.userFullName || (dto.name + ' Yöneticisi');

          let actualUserId: string | null = null;
          try {
            const existingUsers = await this.db.query(
              `SELECT id, full_name FROM user_account WHERE email = $1 OR id::text = $2 LIMIT 1`,
              [clerkEmail, userId],
            );
            if (existingUsers && existingUsers.length > 0) {
              actualUserId = existingUsers[0].id;
              if (dto.userFullName && existingUsers[0].full_name !== dto.userFullName) {
                await this.db.query(
                  `UPDATE user_account SET full_name = $1 WHERE id = $2`,
                  [dto.userFullName, actualUserId],
                );
              }
            } else {
              const newId = isUuid ? userId : uuidv4();
              await this.db.query(
                `INSERT INTO user_account (id, email, full_name, is_active, email_verified)
                 VALUES ($1, $2, $3, TRUE, TRUE)
                 ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name`,
                [newId, clerkEmail, fullName],
              );
              actualUserId = newId;
            }

            if (actualUserId) {
              await this.db.query(
                `INSERT INTO membership (id, organisation_id, user_id, role, is_active)
                 VALUES ($1, $2, $3, 'ORG_ADMIN', TRUE)
                 ON CONFLICT (organisation_id, user_id) DO UPDATE SET is_active = TRUE`,
                [uuidv4(), organisation.id, actualUserId],
              );
              this.logger.log(`[DB] Kullanıcı-Kurum bağı (ORG_ADMIN) kuruldu: User ${actualUserId} -> Org ${organisation.id}`);
            }
          } catch (e: any) {
            this.logger.warn(`user_account / membership error: ${e.message}`);
          }
        }
      } catch (err: any) {
        this.logger.warn(`PostgreSQL kayıt hatası: ${err.message}`);
      }
    }

    // Mirror to in-memory map
    this.organisations.set(id, organisation);

    await this.auditService.logEvent({
      organisationId: id,
      userId,
      action: 'ORGANISATION_CREATED',
      resourceType: 'organisation',
      resourceId: id,
      payloadAfter: organisation as unknown as Record<string, unknown>,
      correlationId,
    });

    return organisation;
  }

  async findAll(): Promise<Organisation[]> {
    if (this.db.isConnected) {
      try {
        const rows = await this.db.query(`
          SELECT 
            id, name, slug, oid, city, country_code AS "countryCode", 
            accreditation_status AS "accreditationStatus", erasmus_plan AS "erasmusPlan", 
            institution_need AS "institutionNeed", readiness_score AS "readinessScore", 
            is_active AS "isActive", settings, created_at AS "createdAt", updated_at AS "updatedAt"
          FROM organisation
          WHERE is_active = TRUE
          ORDER BY created_at DESC
        `);
        return rows;
      } catch (err: any) {
        this.logger.warn(`PostgreSQL findAll hatası: ${err.message}`);
      }
    }
    return Array.from(this.organisations.values());
  }

  async findOne(id: string): Promise<Organisation> {
    if (this.db.isConnected) {
      try {
        const rows = await this.db.query(
          `SELECT 
            id, name, slug, oid, city, country_code AS "countryCode", 
            accreditation_status AS "accreditationStatus", erasmus_plan AS "erasmusPlan", 
            institution_need AS "institutionNeed", readiness_score AS "readinessScore", 
            is_active AS "isActive", settings, created_at AS "createdAt", updated_at AS "updatedAt"
          FROM organisation
          WHERE id = $1`,
          [id],
        );
        if (rows.length > 0) return rows[0];
      } catch (err: any) {
        this.logger.warn(`PostgreSQL findOne hatası: ${err.message}`);
      }
    }

    const org = this.organisations.get(id);
    if (!org) {
      throw new NotFoundException(`Kurum bulunamadı (ID: ${id})`);
    }
    return org;
  }

  async findByUser(
    userId: string,
  ): Promise<(Organisation & { role: string }) | null> {
    if (this.db.isConnected) {
      try {
        const emailPattern = `${userId}@clerk.user`;
        const rows = await this.db.query(
          `SELECT 
            o.id, o.name, o.slug, o.oid, o.city, o.country_code AS "countryCode", 
            o.accreditation_status AS "accreditationStatus", o.erasmus_plan AS "erasmusPlan", 
            o.institution_need AS "institutionNeed", o.readiness_score AS "readinessScore", 
            o.is_active AS "isActive", o.settings, o.created_at AS "createdAt", o.updated_at AS "updatedAt",
            m.role
          FROM organisation o
          JOIN membership m ON m.organisation_id = o.id
          JOIN user_account u ON u.id = m.user_id
          WHERE u.email = $1 OR u.id::text = $2
          ORDER BY m.created_at DESC
          LIMIT 1`,
          [emailPattern, userId],
        );
        if (rows.length > 0) return rows[0];
      } catch (err: any) {
        this.logger.warn(`PostgreSQL findByUser hatası: ${err.message}`);
      }
    }
    return null;
  }

  async update(
    id: string,
    dto: UpdateOrganisationDto,
    correlationId: string,
    userId?: string,
  ): Promise<Organisation> {
    const current = await this.findOne(id);
    const updated: Organisation = {
      ...current,
      ...dto,
      oid: dto.oid !== undefined ? dto.oid : current.oid,
      city: dto.city !== undefined ? dto.city : current.city,
      erasmusPlan:
        dto.erasmusPlan !== undefined ? dto.erasmusPlan : current.erasmusPlan,
      institutionNeed:
        dto.institutionNeed !== undefined
          ? dto.institutionNeed
          : current.institutionNeed,
      updatedAt: new Date().toISOString(),
    };

    // Recalculate readiness
    const readiness = this.calculateReadiness(updated);
    updated.readinessScore = readiness.score;

    if (this.db.isConnected) {
      try {
        await this.db.query(
          `UPDATE organisation SET 
            name = $1, oid = $2, city = $3, accreditation_status = $4,
            erasmus_plan = $5, institution_need = $6, readiness_score = $7, updated_at = $8
          WHERE id = $9`,
          [
            updated.name,
            updated.oid,
            updated.city,
            updated.accreditationStatus,
            updated.erasmusPlan,
            updated.institutionNeed,
            updated.readinessScore,
            updated.updatedAt,
            id,
          ],
        );
      } catch (err: any) {
        this.logger.warn(`PostgreSQL update hatası: ${err.message}`);
      }
    }

    this.organisations.set(id, updated);

    await this.auditService.logEvent({
      organisationId: id,
      userId,
      action: 'ORGANISATION_UPDATED',
      resourceType: 'organisation',
      resourceId: id,
      payloadBefore: current as unknown as Record<string, unknown>,
      payloadAfter: updated as unknown as Record<string, unknown>,
      correlationId,
    });

    return updated;
  }

  async remove(
    id: string,
    correlationId: string,
    userId?: string,
  ): Promise<{ success: boolean }> {
    const current = await this.findOne(id);

    if (this.db.isConnected) {
      try {
        await this.db.query(`UPDATE organisation SET is_active = FALSE WHERE id = $1`, [id]);
      } catch (err: any) {
        this.logger.warn(`PostgreSQL remove hatası: ${err.message}`);
      }
    }

    this.organisations.delete(id);

    await this.auditService.logEvent({
      organisationId: id,
      userId,
      action: 'ORGANISATION_DELETED',
      resourceType: 'organisation',
      resourceId: id,
      payloadBefore: current as unknown as Record<string, unknown>,
      correlationId,
    });

    return { success: true };
  }

  getReadiness(id: string): ReadinessScoreResponse {
    const org = this.organisations.get(id);
    if (!org) {
      throw new NotFoundException(`Kurum bulunamadı (ID: ${id})`);
    }
    return this.calculateReadiness(org);
  }

  private calculateReadiness(org: Organisation): ReadinessScoreResponse {
    const recommendations: string[] = [];

    // 1. Identity completeness (25 pts)
    let identityPoints = 0;
    if (org.name?.trim().length > 3) identityPoints += 15;
    if (org.city?.trim()) identityPoints += 10;
    if (identityPoints < 25) {
      recommendations.push('Kurum il ve temel kimlik bilgilerini tamamlayın.');
    }

    // 2. OID and Accreditation (25 pts)
    let accPoints = 0;
    const hasValidOid = Boolean(org.oid && /^E10[0-9]{5,7}$/.test(org.oid));
    if (hasValidOid) accPoints += 15;
    else recommendations.push('Geçerli bir Erasmus OID (E10XXXXXX) kodu tanımlayın.');

    if (org.accreditationStatus === 'YES') {
      accPoints += 10;
    } else if (org.accreditationStatus === 'NO') {
      accPoints += 7;
    } else {
      recommendations.push('Erasmus akreditasyon durumunuzu (Evet/Hayır) belirtin.');
    }

    // 3. Needs Analysis (30 pts)
    let needsPoints = 0;
    if (org.institutionNeed && org.institutionNeed.trim().length > 20) {
      needsPoints += 15;
    } else {
      recommendations.push('Somut bir kurumsal ihtiyaç / challenge açıklaması yazın.');
    }

    if (org.erasmusPlan && org.erasmusPlan.trim().length > 20) {
      needsPoints += 15;
    } else if (org.accreditationStatus === 'YES') {
      recommendations.push('Akreditasyon hedefleriyle uyumlu Erasmus Plan metnini girin.');
    } else {
      needsPoints += 10;
    }

    const operationalPoints = 20;
    const totalScore = Math.min(
      100,
      identityPoints + accPoints + needsPoints + operationalPoints,
    );

    return {
      score: totalScore,
      breakdown: {
        identity: {
          points: identityPoints,
          max: 25,
          passed: identityPoints >= 20,
          message: 'Temel kurum adı ve şehir bilgisi',
        },
        accreditation: {
          points: accPoints,
          max: 25,
          passed: accPoints >= 20,
          message: 'OID kodu ve akreditasyon durumu',
        },
        needsAnalysis: {
          points: needsPoints,
          max: 30,
          passed: needsPoints >= 20,
          message: 'Kurumsal ihtiyaç ve Erasmus plan hedefleri',
        },
        participantPreparation: {
          points: operationalPoints,
          max: 20,
          passed: true,
          message: 'Genel operasyonel hazırlık',
        },
      },
      recommendations,
    };
  }
}
