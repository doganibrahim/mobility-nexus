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
import { UpdateHostPortfolioDto } from './dto/update-host-portfolio.dto';
import { SubmitHostVerificationDto } from './dto/submit-host-verification.dto';
import { ReviewHostVerificationDto } from './dto/review-host-verification.dto';

export interface HostOrganisation {
  id: string;
  name: string;
  legalName?: string;
  tradingName?: string | null;
  organisationType: string;
  slug: string;
  countryCode: string;
  city: string;
  registeredAddress: string;
  operationalAddress?: string | null;
  yearEstablished: number;
  oid: string;
  picNumber?: string | null;
  websiteUrl: string;
  generalEmail: string;
  telephone: string;
  primarySector: string;
  verificationStatus: string;
  profileCompletenessScore: number;

  // Contact
  contactPerson: string;
  contactTitle?: string | null;
  contactEmail: string;
  contactDirectPhone?: string | null;
  contactWhatsapp?: string | null;
  contactLinkedin?: string | null;
  contactLanguages?: string[];
  contactPhotoUrl?: string | null;
  consentPublicDisplay: boolean;
  turkeyContactPerson?: string | null;

  // Emergency (Admin Only)
  emergencyContactPerson?: string | null;
  emergencyContactPhone?: string | null;

  // Legal / KYC (Admin Only)
  registrationNumber?: string | null;
  registrationDocumentUrl?: string | null;
  taxVatNumber?: string | null;

  // Erasmus+ Experience (Portfolio)
  yearsOfExperience?: number;
  totalParticipantsHosted?: number;
  groupsHostedLast3Years?: number;
  sendingCountries?: string[];
  turkishGroupsHosted?: number;
  turkishParticipantsHosted?: number;
  hasKa121?: boolean;
  hasKa122?: boolean;
  hasVetLearner?: boolean;
  hasStaffMobility?: boolean;
  completedProjects?: any[];
  projectResultsLinks?: string[];
  nationalAgencyExperience?: string | null;
  sampleMobilityProgrammeUrl?: string | null;
  logoUrl?: string | null;
  shortDescription?: string | null;
  detailedProfileUrl?: string | null;

  // Evidence (Admin Only)
  participantEvidenceUrls?: string[];
  sampleDocumentsUrls?: string[];

  // General & Capacity
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

  /**
   * Helper: Calculates profile completeness score (0 - 100)
   */
  calculateCompleteness(host: Partial<HostOrganisation>): number {
    let score = 30; // Base: Tier 1 Onboarding completed
    if (host.oid && host.oid.length >= 8) score += 10;
    if (host.logoUrl) score += 10;
    if (host.shortDescription && host.shortDescription.length > 20) score += 10;
    if (host.yearsOfExperience && host.yearsOfExperience > 0) score += 10;
    if (host.sampleMobilityProgrammeUrl) score += 10;
    if (host.hasKa121 || host.hasKa122 || host.hasVetLearner || host.hasStaffMobility) score += 5;
    if (host.taxVatNumber && host.registrationNumber) score += 10;
    if (host.registrationDocumentUrl) score += 5;
    return Math.min(100, score);
  }

  /**
   * Tier 1: Post-Registration Quick Onboarding (Fast Setup ~2-3 mins)
   */
  async register(
    dto: RegisterHostDto,
    correlationId: string,
  ): Promise<HostOrganisation> {
    const slug = dto.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    // Duplicate check in DB
    if (this.db.isConnected) {
      try {
        const existing = await this.db.query(
          `SELECT id FROM host_organisation WHERE slug = $1 OR contact_email = $2 OR (oid IS NOT NULL AND oid = $3) LIMIT 1`,
          [slug, dto.contactEmail.trim().toLowerCase(), dto.oid.trim().toUpperCase()],
        );
        if (existing && existing.length > 0) {
          throw new ConflictException(
            'Bu kurum adı, e-posta adresi veya OID numarası ile kayıtlı bir ev sahibi kurum zaten mevcut.',
          );
        }
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
      }
    }

    const hostId = uuidv4();
    const workingLangs = dto.workingLanguages && dto.workingLanguages.length > 0 ? dto.workingLanguages : ['EN'];
    const maxLearners = dto.maxLearnersPerTerm || 4;
    const totalAnnual = dto.totalAnnualCapacity || (maxLearners * 3);
    const activities = dto.activities && dto.activities.length > 0
      ? dto.activities
      : ['VET_INTERNSHIP', 'JOB_SHADOWING'];
    const initialScore = 40;

    let actualUserId: string | null = null;

    if (this.db.isConnected) {
      try {
        // Resolve or create user
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
            id, name, legal_name, trading_name, organisation_type, slug, country_code, city,
            registered_address, operational_address, year_established, oid, pic_number,
            website_url, general_email, telephone, primary_sector, verification_status,
            profile_completeness_score, contact_person, contact_title, contact_email,
            consent_public_display, languages, is_active, created_by_user_id, created_at, updated_at
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8,
            $9, $10, $11, $12, $13,
            $14, $15, $16, $17, 'PENDING',
            $18, $19, $20, $21,
            $22, $23, TRUE, $24, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
          )`,
          [
            hostId,
            dto.name.trim(),
            dto.name.trim(),
            dto.tradingName?.trim() || null,
            dto.organisationType.trim(),
            slug,
            dto.countryCode.trim().toUpperCase(),
            dto.city.trim(),
            dto.registeredAddress.trim(),
            dto.operationalAddress?.trim() || null,
            dto.yearEstablished,
            dto.oid.trim().toUpperCase(),
            dto.picNumber?.trim() || null,
            dto.websiteUrl.trim(),
            dto.generalEmail.trim().toLowerCase(),
            dto.telephone.trim(),
            dto.primarySector.trim().toLowerCase(),
            initialScore,
            dto.contactPerson.trim(),
            dto.contactTitle.trim(),
            dto.contactEmail.trim().toLowerCase(),
            dto.consentPublicDisplay,
            workingLangs,
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

        // Insert initial host_verification record
        await this.db.query(
          `INSERT INTO host_verification (id, host_id, status)
           VALUES ($1, $2, 'PENDING')`,
          [uuidv4(), hostId],
        );

        this.logger.log(`[DB] Ev Sahibi Kurum (Host) kaydedildi: ${dto.name} (OID: ${dto.oid})`);
      } catch (err: any) {
        if (err instanceof ConflictException) throw err;
        this.logger.warn(`Host DB insert hatası (in-memory dev fallback): ${err.message}`);
      }
    }

    const hostOrg: HostOrganisation = {
      id: hostId,
      name: dto.name.trim(),
      legalName: dto.name.trim(),
      tradingName: dto.tradingName?.trim() || null,
      organisationType: dto.organisationType,
      slug,
      countryCode: dto.countryCode.trim().toUpperCase(),
      city: dto.city.trim(),
      registeredAddress: dto.registeredAddress.trim(),
      operationalAddress: dto.operationalAddress?.trim() || null,
      yearEstablished: dto.yearEstablished,
      oid: dto.oid.trim().toUpperCase(),
      picNumber: dto.picNumber?.trim() || null,
      websiteUrl: dto.websiteUrl.trim(),
      generalEmail: dto.generalEmail.trim().toLowerCase(),
      telephone: dto.telephone.trim(),
      primarySector: dto.primarySector,
      verificationStatus: 'PENDING',
      profileCompletenessScore: initialScore,
      contactPerson: dto.contactPerson.trim(),
      contactTitle: dto.contactTitle.trim(),
      contactEmail: dto.contactEmail.trim().toLowerCase(),
      consentPublicDisplay: dto.consentPublicDisplay,
      languages: workingLangs,
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

  /**
   * Tier 2: Dashboard Profile & Erasmus+ Portfolio Update
   */
  async updatePortfolio(
    hostId: string,
    dto: UpdateHostPortfolioDto,
    correlationId: string,
  ): Promise<HostOrganisation> {
    const existing = await this.findOne(hostId);
    const updated = { ...existing, ...dto };
    const newCompleteness = this.calculateCompleteness(updated);
    updated.profileCompletenessScore = newCompleteness;
    updated.updatedAt = new Date().toISOString();

    if (this.db.isConnected) {
      try {
        await this.db.query(
          `UPDATE host_organisation SET
            operational_address = COALESCE($1, operational_address),
            logo_url = COALESCE($2, logo_url),
            short_description = COALESCE($3, short_description),
            detailed_profile_url = COALESCE($4, detailed_profile_url),
            contact_linkedin = COALESCE($5, contact_linkedin),
            contact_languages = COALESCE($6, contact_languages),
            contact_photo_url = COALESCE($7, contact_photo_url),
            turkey_contact_person = COALESCE($8, turkey_contact_person),
            years_of_experience = COALESCE($9, years_of_experience),
            total_participants_hosted = COALESCE($10, total_participants_hosted),
            groups_hosted_last_3_years = COALESCE($11, groups_hosted_last_3_years),
            sending_countries = COALESCE($12, sending_countries),
            turkish_groups_hosted = COALESCE($13, turkish_groups_hosted),
            turkish_participants_hosted = COALESCE($14, turkish_participants_hosted),
            has_ka121 = COALESCE($15, has_ka121),
            has_ka122 = COALESCE($16, has_ka122),
            has_vet_learner = COALESCE($17, has_vet_learner),
            has_staff_mobility = COALESCE($18, has_staff_mobility),
            completed_projects = COALESCE($19, completed_projects),
            project_results_links = COALESCE($20, project_results_links),
            national_agency_experience = COALESCE($21, national_agency_experience),
            sample_mobility_programme_url = COALESCE($22, sample_mobility_programme_url),
            profile_completeness_score = $23,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $24`,
          [
            dto.operationalAddress || null,
            dto.logoUrl || null,
            dto.shortDescription || null,
            dto.detailedProfileUrl || null,
            dto.contactLinkedin || null,
            dto.contactLanguages || null,
            dto.contactPhotoUrl || null,
            dto.turkeyContactPerson || null,
            dto.yearsOfExperience ?? null,
            dto.totalParticipantsHosted ?? null,
            dto.groupsHostedLast3Years ?? null,
            dto.sendingCountries || null,
            dto.turkishGroupsHosted ?? null,
            dto.turkishParticipantsHosted ?? null,
            dto.hasKa121 ?? null,
            dto.hasKa122 ?? null,
            dto.hasVetLearner ?? null,
            dto.hasStaffMobility ?? null,
            dto.completedProjects ? JSON.stringify(dto.completedProjects) : null,
            dto.projectResultsLinks || null,
            dto.nationalAgencyExperience || null,
            dto.sampleMobilityProgrammeUrl || null,
            newCompleteness,
            hostId,
          ],
        );
      } catch (err: any) {
        this.logger.warn(`updatePortfolio DB error: ${err.message}`);
      }
    }

    this.hostsMemory.set(hostId, updated);

    await this.auditService.logEvent({
      organisationId: undefined,
      action: 'HOST_PORTFOLIO_UPDATED',
      resourceType: 'host_organisation',
      resourceId: hostId,
      payloadAfter: updated as unknown as Record<string, unknown>,
      correlationId,
    });

    return updated;
  }

  /**
   * Tier 3: Submit Verification & KYC Documents (Admin Only)
   */
  async submitVerification(
    hostId: string,
    dto: SubmitHostVerificationDto,
    correlationId: string,
  ): Promise<HostOrganisation> {
    const existing = await this.findOne(hostId);
    const updated = {
      ...existing,
      ...dto,
      verificationStatus: 'UNDER_REVIEW',
      updatedAt: new Date().toISOString(),
    };
    const newCompleteness = this.calculateCompleteness(updated);
    updated.profileCompletenessScore = newCompleteness;

    if (this.db.isConnected) {
      try {
        await this.db.query(
          `UPDATE host_organisation SET
            registration_number = $1,
            registration_document_url = $2,
            tax_vat_number = $3,
            emergency_contact_person = $4,
            emergency_contact_phone = $5,
            contact_direct_phone = $6,
            contact_whatsapp = $7,
            participant_evidence_urls = $8,
            sample_documents_urls = $9,
            verification_status = 'UNDER_REVIEW',
            profile_completeness_score = $10,
            updated_at = CURRENT_TIMESTAMP
          WHERE id = $11`,
          [
            dto.registrationNumber.trim(),
            dto.registrationDocumentUrl.trim(),
            dto.taxVatNumber.trim(),
            dto.emergencyContactPerson.trim(),
            dto.emergencyContactPhone.trim(),
            dto.contactDirectPhone?.trim() || null,
            dto.contactWhatsapp?.trim() || null,
            dto.participantEvidenceUrls,
            dto.sampleDocumentsUrls || [],
            newCompleteness,
            hostId,
          ],
        );

        await this.db.query(
          `UPDATE host_verification SET
            status = 'UNDER_REVIEW',
            created_at = CURRENT_TIMESTAMP
          WHERE host_id = $1`,
          [hostId],
        );
      } catch (err: any) {
        this.logger.warn(`submitVerification DB error: ${err.message}`);
      }
    }

    this.hostsMemory.set(hostId, updated);

    await this.auditService.logEvent({
      organisationId: undefined,
      action: 'HOST_VERIFICATION_SUBMITTED',
      resourceType: 'host_organisation',
      resourceId: hostId,
      payloadAfter: { hostId, status: 'UNDER_REVIEW', registrationNumber: dto.registrationNumber },
      correlationId,
    });

    return updated;
  }

  /**
   * Admin: Review and verify/reject or request updates
   */
  async reviewVerification(
    hostId: string,
    dto: ReviewHostVerificationDto,
    reviewerId = 'admin',
    correlationId: string,
  ): Promise<HostOrganisation> {
    const existing = await this.findOne(hostId);
    existing.verificationStatus = dto.status;
    existing.updatedAt = new Date().toISOString();

    if (this.db.isConnected) {
      try {
        await this.db.query(
          `UPDATE host_organisation SET verification_status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
          [dto.status, hostId],
        );

        await this.db.query(
          `UPDATE host_verification SET
            status = $1,
            reviewer_notes = $2,
            criteria_checklist = COALESCE($3, criteria_checklist),
            reviewed_at = CURRENT_TIMESTAMP
          WHERE host_id = $4`,
          [
            dto.status,
            dto.reviewerNotes || null,
            dto.criteriaChecklist ? JSON.stringify(dto.criteriaChecklist) : null,
            hostId,
          ],
        );
      } catch (err: any) {
        this.logger.warn(`reviewVerification DB error: ${err.message}`);
      }
    }

    this.hostsMemory.set(hostId, existing);

    await this.auditService.logEvent({
      organisationId: undefined,
      userId: reviewerId,
      action: `HOST_VERIFICATION_${dto.status}`,
      resourceType: 'host_organisation',
      resourceId: hostId,
      payloadAfter: { status: dto.status, reviewerNotes: dto.reviewerNotes },
      correlationId,
    });

    return existing;
  }

  /**
   * Admin: Get all verification queue items
   */
  async getVerificationQueue(statusFilter?: string): Promise<any[]> {
    if (this.db.isConnected) {
      try {
        const queryText = statusFilter
          ? `SELECT 
              h.id, h.name, h.legal_name AS "legalName", h.organisation_type AS "organisationType",
              h.country_code AS "countryCode", h.city, h.oid, h.verification_status AS "verificationStatus",
              h.registration_number AS "registrationNumber", h.registration_document_url AS "registrationDocumentUrl",
              h.tax_vat_number AS "taxVatNumber", h.emergency_contact_person AS "emergencyContactPerson",
              h.emergency_contact_phone AS "emergencyContactPhone", h.contact_person AS "contactPerson",
              h.contact_email AS "contactEmail", h.contact_phone AS "contactPhone",
              h.participant_evidence_urls AS "participantEvidenceUrls", h.sample_documents_urls AS "sampleDocumentsUrls",
              h.created_at AS "createdAt", v.criteria_checklist AS "criteriaChecklist", v.reviewer_notes AS "reviewerNotes"
            FROM host_organisation h
            LEFT JOIN host_verification v ON v.host_id = h.id
            WHERE h.verification_status = $1
            ORDER BY h.updated_at DESC`
          : `SELECT 
              h.id, h.name, h.legal_name AS "legalName", h.organisation_type AS "organisationType",
              h.country_code AS "countryCode", h.city, h.oid, h.verification_status AS "verificationStatus",
              h.registration_number AS "registrationNumber", h.registration_document_url AS "registrationDocumentUrl",
              h.tax_vat_number AS "taxVatNumber", h.emergency_contact_person AS "emergencyContactPerson",
              h.emergency_contact_phone AS "emergencyContactPhone", h.contact_person AS "contactPerson",
              h.contact_email AS "contactEmail", h.contact_phone AS "contactPhone",
              h.participant_evidence_urls AS "participantEvidenceUrls", h.sample_documents_urls AS "sampleDocumentsUrls",
              h.created_at AS "createdAt", v.criteria_checklist AS "criteriaChecklist", v.reviewer_notes AS "reviewerNotes"
            FROM host_organisation h
            LEFT JOIN host_verification v ON v.host_id = h.id
            WHERE h.verification_status IN ('UNDER_REVIEW', 'PENDING', 'NEEDS_UPDATE', 'VERIFIED')
            ORDER BY CASE WHEN h.verification_status = 'UNDER_REVIEW' THEN 1 ELSE 2 END, h.updated_at DESC`;

        const rows = await this.db.query(queryText, statusFilter ? [statusFilter] : []);
        return rows || [];
      } catch (err: any) {
        this.logger.warn(`getVerificationQueue DB error: ${err.message}`);
      }
    }

    // Memory fallback
    return Array.from(this.hostsMemory.values()).filter((h) =>
      statusFilter ? h.verificationStatus === statusFilter : true,
    );
  }

  async findByUser(userId: string): Promise<HostOrganisation | null> {
    if (this.db.isConnected) {
      try {
        const clerkEmail = `${userId}@clerk.user`;
        const rows = await this.db.query(
          `SELECT 
            h.id, h.name, h.legal_name AS "legalName", h.trading_name AS "tradingName",
            h.organisation_type AS "organisationType", h.slug, h.country_code AS "countryCode",
            h.city, h.registered_address AS "registeredAddress", h.operational_address AS "operationalAddress",
            h.year_established AS "yearEstablished", h.oid, h.pic_number AS "picNumber",
            h.website_url AS "websiteUrl", h.general_email AS "generalEmail", h.telephone,
            h.primary_sector AS "primarySector", h.verification_status AS "verificationStatus",
            h.profile_completeness_score AS "profileCompletenessScore",
            h.contact_person AS "contactPerson", h.contact_title AS "contactTitle",
            h.contact_email AS "contactEmail", h.contact_direct_phone AS "contactDirectPhone",
            h.contact_whatsapp AS "contactWhatsapp", h.contact_linkedin AS "contactLinkedin",
            h.contact_languages AS "contactLanguages", h.contact_photo_url AS "contactPhotoUrl",
            h.consent_public_display AS "consentPublicDisplay", h.turkey_contact_person AS "turkeyContactPerson",
            h.emergency_contact_person AS "emergencyContactPerson", h.emergency_contact_phone AS "emergencyContactPhone",
            h.registration_number AS "registrationNumber", h.registration_document_url AS "registrationDocumentUrl",
            h.tax_vat_number AS "taxVatNumber", h.years_of_experience AS "yearsOfExperience",
            h.total_participants_hosted AS "totalParticipantsHosted", h.groups_hosted_last_3_years AS "groupsHostedLast3Years",
            h.sending_countries AS "sendingCountries", h.turkish_groups_hosted AS "turkishGroupsHosted",
            h.turkish_participants_hosted AS "turkishParticipantsHosted", h.has_ka121 AS "hasKa121",
            h.has_ka122 AS "hasKa122", h.has_vet_learner AS "hasVetLearner", h.has_staff_mobility AS "hasStaffMobility",
            h.completed_projects AS "completedProjects", h.project_results_links AS "projectResultsLinks",
            h.national_agency_experience AS "nationalAgencyExperience", h.sample_mobility_programme_url AS "sampleMobilityProgrammeUrl",
            h.logo_url AS "logoUrl", h.short_description AS "shortDescription", h.detailed_profile_url AS "detailedProfileUrl",
            h.participant_evidence_urls AS "participantEvidenceUrls", h.sample_documents_urls AS "sampleDocumentsUrls",
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
            h.id, h.name, h.legal_name AS "legalName", h.trading_name AS "tradingName",
            h.organisation_type AS "organisationType", h.slug, h.country_code AS "countryCode",
            h.city, h.registered_address AS "registeredAddress", h.operational_address AS "operationalAddress",
            h.year_established AS "yearEstablished", h.oid, h.pic_number AS "picNumber",
            h.website_url AS "websiteUrl", h.general_email AS "generalEmail", h.telephone,
            h.primary_sector AS "primarySector", h.verification_status AS "verificationStatus",
            h.profile_completeness_score AS "profileCompletenessScore",
            h.contact_person AS "contactPerson", h.contact_title AS "contactTitle",
            h.contact_email AS "contactEmail", h.contact_direct_phone AS "contactDirectPhone",
            h.contact_whatsapp AS "contactWhatsapp", h.contact_linkedin AS "contactLinkedin",
            h.contact_languages AS "contactLanguages", h.contact_photo_url AS "contactPhotoUrl",
            h.consent_public_display AS "consentPublicDisplay", h.turkey_contact_person AS "turkeyContactPerson",
            h.emergency_contact_person AS "emergencyContactPerson", h.emergency_contact_phone AS "emergencyContactPhone",
            h.registration_number AS "registrationNumber", h.registration_document_url AS "registrationDocumentUrl",
            h.tax_vat_number AS "taxVatNumber", h.years_of_experience AS "yearsOfExperience",
            h.total_participants_hosted AS "totalParticipantsHosted", h.groups_hosted_last_3_years AS "groupsHostedLast3Years",
            h.sending_countries AS "sendingCountries", h.turkish_groups_hosted AS "turkishGroupsHosted",
            h.turkish_participants_hosted AS "turkishParticipantsHosted", h.has_ka121 AS "hasKa121",
            h.has_ka122 AS "hasKa122", h.has_vet_learner AS "hasVetLearner", h.has_staff_mobility AS "hasStaffMobility",
            h.completed_projects AS "completedProjects", h.project_results_links AS "projectResultsLinks",
            h.national_agency_experience AS "nationalAgencyExperience", h.sample_mobility_programme_url AS "sampleMobilityProgrammeUrl",
            h.logo_url AS "logoUrl", h.short_description AS "shortDescription", h.detailed_profile_url AS "detailedProfileUrl",
            h.participant_evidence_urls AS "participantEvidenceUrls", h.sample_documents_urls AS "sampleDocumentsUrls",
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
