import {
  Injectable,
  ConflictException,
  NotFoundException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../audit/audit.service';
import { RegisterHostDto } from './dto/register-host.dto';
import { UpdateHostPortfolioDto } from './dto/update-host-portfolio.dto';
import { SubmitHostVerificationDto } from './dto/submit-host-verification.dto';
import { ReviewHostVerificationDto } from './dto/review-host-verification.dto';
import { MatchHostsDto } from './dto/match-hosts.dto';
import {
  HostMatchCandidate,
  MatchHostsResponseDto,
  HostVerificationStatus,
} from '@mobility-nexus/types';

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

  // Logistics & Special Needs
  providesAccommodation?: boolean;
  accommodationDetails?: string | null;
  providesMeals?: boolean;
  mealsDetails?: string | null;
  providesTransfers?: boolean;
  transfersDetails?: string | null;
  acceptsUnder18?: boolean;
  minDurationDays?: number;
  maxDurationDays?: number;
  accessibilityFeatures?: {
    wheelchairAccessible?: boolean;
    specialDiet?: boolean;
    visualAid?: boolean;
  };
}

@Injectable()
export class HostsService implements OnModuleInit {
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

  onModuleInit() {
    if (this.hostsMemory.size === 0) {
      this.seedDefaultHosts();
    }
  }

  /**
   * Seeds 8 realistic European VET host enterprises into memory pool
   */
  seedDefaultHosts() {
    const demoHosts: HostOrganisation[] = [
      {
        id: 'host-de-technordic',
        name: '[MOCK] TechNordic Digital Solutions (Simülasyon)',
        legalName: '[MOCK / DEMO] TechNordic Digital Solutions GmbH',
        tradingName: 'TechNordic Demo Hub',
        organisationType: 'Company / SME',
        slug: 'mock-technordic-digital-solutions',
        countryCode: 'DE',
        city: 'Leipzig',
        registeredAddress: 'Karl-Liebknecht-Straße 144, 04277 Leipzig, Germany',
        operationalAddress: 'Technologiepark Leipzig, Spinnereistraße 7, 04179 Leipzig',
        yearEstablished: 2016,
        oid: 'E10394821',
        picNumber: '912837465',
        websiteUrl: 'https://technordic.demo.example.eu',
        generalEmail: 'erasmus@technordic.demo.example.eu',
        telephone: '+49 341 8920190',
        primarySector: 'software_dev',
        verificationStatus: 'VERIFIED',
        profileCompletenessScore: 95,
        contactPerson: 'Klaus Lindemann (Mock)',
        contactTitle: 'Head of VET Internships & Erasmus+',
        contactEmail: 'klaus.lindemann@demo.example.eu',
        contactDirectPhone: '+49 176 9928190',
        contactLanguages: ['EN', 'DE'],
        consentPublicDisplay: true,
        languages: ['EN', 'DE'],
        maxLearnersPerTerm: 12,
        totalAnnualCapacity: 36,
        activities: [
          'VET_SHORT_TERM',
          'VET_LONG_TERM_PRO',
          'JOB_SHADOWING',
          'TEACHING_ASSIGNMENT',
          'PREPARATORY_VISIT',
        ],
        isActive: true,
        createdAt: '2024-01-15T09:00:00Z',
        updatedAt: '2026-02-10T14:30:00Z',
        providesAccommodation: true,
        accommodationDetails: 'Partner 3-star campus hotel & student dorms in Leipzig Zentrum (Wi-Fi, 24/7 security)',
        providesMeals: true,
        mealsDetails: 'Breakfast at hotel and lunch meal vouchers provided (halal & vegan friendly)',
        providesTransfers: true,
        transfersDetails: 'Leipzig/Halle Airport shuttle & 30-day MDV public transportation pass',
        acceptsUnder18: true,
        minDurationDays: 10,
        maxDurationDays: 180,
        accessibilityFeatures: {
          wheelchairAccessible: true,
          specialDiet: true,
          visualAid: false,
        },
        hasKa121: true,
        hasKa122: true,
        hasVetLearner: true,
        hasStaffMobility: true,
        yearsOfExperience: 8,
        totalParticipantsHosted: 340,
        groupsHostedLast3Years: 24,
        turkishGroupsHosted: 5,
        turkishParticipantsHosted: 64,
        emergencyContactPerson: 'Dr. Anna Becker (Mock)',
        emergencyContactPhone: '+49 176 8839201',
        shortDescription: '[SİMÜLASYON VERİSİDİR] Almanya Leipzig merkezli yazılım, web geliştirme ve yapay zeka uygulamaları simülasyonu için oluşturulmuş örnek işletme profili.',
      },
      {
        id: 'host-es-iberia-vet',
        name: '[MOCK] Iberia EcoTech VET Hub (Simülasyon)',
        legalName: '[MOCK / DEMO] Iberia EcoTech Vocational Training S.L.',
        tradingName: 'Iberia EcoTech Demo Hub',
        organisationType: 'Training centre',
        slug: 'mock-iberia-ecotech-vet-hub',
        countryCode: 'ES',
        city: 'Valencia',
        registeredAddress: 'Carrer de Colon 28, 46004 Valencia, Spain',
        yearEstablished: 2018,
        oid: 'E10284719',
        websiteUrl: 'https://iberia-ecotech.demo.example.eu',
        generalEmail: 'mobility@iberia-ecotech.demo.example.eu',
        telephone: '+34 963 829100',
        primarySector: 'renewable_energy',
        verificationStatus: 'VERIFIED',
        profileCompletenessScore: 92,
        contactPerson: 'Elena Garcia Ortiz (Mock)',
        contactTitle: 'Erasmus Coordinator',
        contactEmail: 'elena.garcia@demo.example.eu',
        contactLanguages: ['EN', 'ES'],
        consentPublicDisplay: true,
        languages: ['EN', 'ES'],
        maxLearnersPerTerm: 16,
        totalAnnualCapacity: 48,
        activities: [
          'VET_SHORT_TERM',
          'VET_GROUP_MOBILITY',
          'VET_SKILLS_COMPETITION',
          'JOB_SHADOWING',
          'HOSTING_TEACHERS',
        ],
        isActive: true,
        createdAt: '2024-02-01T10:00:00Z',
        updatedAt: '2026-03-01T11:00:00Z',
        providesAccommodation: true,
        accommodationDetails: 'Erasmus student residence in central Valencia (Double/single rooms, self-catering kitchen)',
        providesMeals: true,
        mealsDetails: 'Full board: Breakfast at residence, lunch at partner company, dinner vouchers',
        providesTransfers: true,
        transfersDetails: 'Valencia Manises Airport pick-up and metro card included',
        acceptsUnder18: true,
        minDurationDays: 7,
        maxDurationDays: 90,
        accessibilityFeatures: {
          wheelchairAccessible: true,
          specialDiet: true,
          visualAid: false,
        },
        hasKa121: true,
        hasKa122: true,
        hasVetLearner: true,
        hasStaffMobility: true,
        yearsOfExperience: 6,
        totalParticipantsHosted: 280,
        groupsHostedLast3Years: 18,
        turkishGroupsHosted: 4,
        turkishParticipantsHosted: 52,
        emergencyContactPerson: 'Carlos Navarro (Mock)',
        emergencyContactPhone: '+34 612 345678',
        shortDescription: '[SİMÜLASYON VERİSİDİR] Güneş enerjisi, fotovoltaik sistemler ve temiz teknoloji stajı simülasyonu için oluşturulmuş örnek İspanyol eğitim merkezi profili.',
      },
      {
        id: 'host-it-meccatronica',
        name: '[MOCK] Bologna Meccatronica Hub (Simülasyon - Yalnızca 18+)',
        legalName: '[MOCK / DEMO] Consorzio Bologna Meccatronica Industriale SCARL',
        tradingName: 'Bologna Robotics Demo Lab',
        organisationType: 'Sectoral organisation',
        slug: 'mock-bologna-meccatronica-hub',
        countryCode: 'IT',
        city: 'Bologna',
        registeredAddress: 'Via dell\'Industria 42, 40138 Bologna, Italy',
        yearEstablished: 2014,
        oid: 'E10192847',
        websiteUrl: 'https://bologna-meccatronica.demo.example.eu',
        generalEmail: 'info@bologna-meccatronica.demo.example.eu',
        telephone: '+39 051 829100',
        primarySector: 'automation_robotics',
        verificationStatus: 'VERIFIED',
        profileCompletenessScore: 88,
        contactPerson: 'Marco Rossi (Mock)',
        contactTitle: 'Technical Director & VET Mentor',
        contactEmail: 'marco.rossi@demo.example.eu',
        contactLanguages: ['EN', 'IT'],
        consentPublicDisplay: true,
        languages: ['EN', 'IT'],
        maxLearnersPerTerm: 8,
        totalAnnualCapacity: 24,
        activities: [
          'VET_SHORT_TERM',
          'VET_LONG_TERM_PRO',
          'JOB_SHADOWING',
          'INVITED_EXPERT',
        ],
        isActive: true,
        createdAt: '2023-11-20T08:30:00Z',
        updatedAt: '2026-01-18T16:00:00Z',
        providesAccommodation: true,
        accommodationDetails: 'Partner hotel near central station',
        providesMeals: false,
        providesTransfers: true,
        transfersDetails: 'Bologna Marconi Airport shuttle',
        acceptsUnder18: false, // Disqualified if under 18 requested!
        minDurationDays: 14,
        maxDurationDays: 180,
        accessibilityFeatures: {
          wheelchairAccessible: false,
          specialDiet: false,
          visualAid: false,
        },
        hasKa121: true,
        hasKa122: true,
        hasVetLearner: true,
        hasStaffMobility: true,
        yearsOfExperience: 10,
        totalParticipantsHosted: 420,
        groupsHostedLast3Years: 30,
        turkishGroupsHosted: 6,
        turkishParticipantsHosted: 70,
        emergencyContactPerson: 'Matteo Conti (Mock)',
        emergencyContactPhone: '+39 340 8920192',
        shortDescription: '[SİMÜLASYON VERİSİDİR] İtalya Motor Vadisi bölgesinde endüstriyel robotik stajı simülasyonu için oluşturulmuş örnek sanayi konsorsiyumu (Yalnızca 18+ yetişkin stajyer kabul eder).',
      },
      {
        id: 'host-pl-silesia-green',
        name: '[MOCK] Silesia Green Manufacturing (Simülasyon - KA122 Only)',
        legalName: '[MOCK / DEMO] Silesia Green Manufacturing Sp. z o.o.',
        tradingName: 'Silesia GreenTech Demo',
        organisationType: 'Company / SME',
        slug: 'mock-silesia-green-manufacturing',
        countryCode: 'PL',
        city: 'Katowice',
        registeredAddress: 'ul. Francuska 34, 40-028 Katowice, Poland',
        yearEstablished: 2019,
        oid: 'E10482910',
        websiteUrl: 'https://silesia-green.demo.example.eu',
        generalEmail: 'office@silesia-green.demo.example.eu',
        telephone: '+48 32 8920190',
        primarySector: 'electrical_electronics',
        verificationStatus: 'UNDER_REVIEW',
        profileCompletenessScore: 78,
        contactPerson: 'Piotr Wisniewski (Mock)',
        contactTitle: 'Project Manager',
        contactEmail: 'p.wisniewski@demo.example.eu',
        contactLanguages: ['EN', 'PL'],
        consentPublicDisplay: true,
        languages: ['EN', 'PL'],
        maxLearnersPerTerm: 10,
        totalAnnualCapacity: 30,
        activities: [
          'VET_SHORT_TERM',
          'JOB_SHADOWING',
          'STAFF_COURSE_TRAINING',
        ],
        isActive: true,
        createdAt: '2024-05-10T12:00:00Z',
        updatedAt: '2026-02-25T15:00:00Z',
        providesAccommodation: true,
        accommodationDetails: 'Modern student hostel near the facility',
        providesMeals: true,
        mealsDetails: 'Canteen hot lunch & breakfast',
        providesTransfers: false,
        acceptsUnder18: true,
        minDurationDays: 10,
        maxDurationDays: 60,
        accessibilityFeatures: {
          wheelchairAccessible: true,
          specialDiet: false,
          visualAid: false,
        },
        hasKa121: false, // KA122 only!
        hasKa122: true,
        hasVetLearner: true,
        hasStaffMobility: true,
        yearsOfExperience: 4,
        totalParticipantsHosted: 110,
        groupsHostedLast3Years: 9,
        turkishGroupsHosted: 2,
        turkishParticipantsHosted: 24,
        emergencyContactPerson: 'Agnieszka Kowalska (Mock)',
        emergencyContactPhone: '+48 601 892019',
        shortDescription: '[SİMÜLASYON VERİSİDİR] Polonya Katowice sanayi bölgesinde elektronik devre tasarımı üzerine staj simülasyonu için oluşturulmuş örnek üretim tesisi (Yalnızca KA122).',
      },
      {
        id: 'host-nl-rotterdam-port',
        name: '[MOCK] Rotterdam Port Logistics Academy (Simülasyon)',
        legalName: '[MOCK / DEMO] Rotterdam Port Logistics Training B.V.',
        tradingName: 'SmartPort Demo Academy',
        organisationType: 'Training centre',
        slug: 'mock-rotterdam-port-logistics-academy',
        countryCode: 'NL',
        city: 'Rotterdam',
        registeredAddress: 'Wilhelminakade 955, 3072 AP Rotterdam, Netherlands',
        yearEstablished: 2015,
        oid: 'E10592837',
        websiteUrl: 'https://rotterdam-port.demo.example.eu',
        generalEmail: 'contact@rotterdam-port.demo.example.eu',
        telephone: '+31 10 8291020',
        primarySector: 'logistics_transport',
        verificationStatus: 'VERIFIED',
        profileCompletenessScore: 90,
        contactPerson: 'Jan van der Meer (Mock)',
        contactTitle: 'Director of International Mobility',
        contactEmail: 'jan.vandermeer@demo.example.eu',
        contactLanguages: ['EN', 'NL'],
        consentPublicDisplay: true,
        languages: ['EN', 'NL'],
        maxLearnersPerTerm: 20,
        totalAnnualCapacity: 60,
        activities: [
          'VET_SHORT_TERM',
          'VET_LONG_TERM_PRO',
          'JOB_SHADOWING',
          'PREPARATORY_VISIT',
        ],
        isActive: true,
        createdAt: '2023-09-12T09:00:00Z',
        updatedAt: '2026-03-05T10:30:00Z',
        providesAccommodation: false, // Self-managed logistics
        providesMeals: false,
        providesTransfers: false,
        acceptsUnder18: true,
        minDurationDays: 14,
        maxDurationDays: 120,
        accessibilityFeatures: {
          wheelchairAccessible: true,
          specialDiet: true,
          visualAid: true,
        },
        hasKa121: true,
        hasKa122: true,
        hasVetLearner: true,
        hasStaffMobility: true,
        yearsOfExperience: 9,
        totalParticipantsHosted: 510,
        groupsHostedLast3Years: 35,
        turkishGroupsHosted: 7,
        turkishParticipantsHosted: 95,
        emergencyContactPerson: 'Sanne de Jong (Mock)',
        emergencyContactPhone: '+31 6 82910291',
        shortDescription: '[SİMÜLASYON VERİSİDİR] Rotterdam liman lojistiği, gümrükleme yazılımları ve depo otomasyonu staj simülasyonu için oluşturulmuş örnek akademi profili (Kendi lojistiğini yöneten gruplar için).',
      },
      {
        id: 'host-cz-bohemia-mech',
        name: '[MOCK] Bohemia Precision Engineering (Simülasyon - Düşük Kontenjan)',
        legalName: '[MOCK / DEMO] Bohemia Precision Strojírenství s.r.o.',
        tradingName: 'Bohemia Precision Demo',
        organisationType: 'Factory / industrial company',
        slug: 'mock-bohemia-precision-engineering',
        countryCode: 'CZ',
        city: 'Brno',
        registeredAddress: 'Technologická 820, 612 00 Brno, Czech Republic',
        yearEstablished: 2017,
        oid: 'E10692817',
        websiteUrl: 'https://bohemia-precision.demo.example.eu',
        generalEmail: 'info@bohemia-precision.demo.example.eu',
        telephone: '+420 538 920190',
        primarySector: 'machinery_cnc',
        verificationStatus: 'UNDER_REVIEW',
        profileCompletenessScore: 82,
        contactPerson: 'Tomas Dvorak (Mock)',
        contactTitle: 'Senior Training Engineer',
        contactEmail: 'tomas.dvorak@demo.example.eu',
        contactLanguages: ['EN', 'CZ'],
        consentPublicDisplay: true,
        languages: ['EN', 'CZ'],
        maxLearnersPerTerm: 6, // Low capacity
        totalAnnualCapacity: 18,
        activities: [
          'VET_SHORT_TERM',
          'JOB_SHADOWING',
          'HOSTING_TEACHERS',
        ],
        isActive: true,
        createdAt: '2024-03-01T11:00:00Z',
        updatedAt: '2026-02-14T09:45:00Z',
        providesAccommodation: true,
        accommodationDetails: 'Technical university dorm with single & twin rooms',
        providesMeals: true,
        mealsDetails: 'Factory lunch included; self-catering kitchen for evening meals',
        providesTransfers: true,
        transfersDetails: 'Brno/Vienna Airport pick-up by institute van',
        acceptsUnder18: true,
        minDurationDays: 10,
        maxDurationDays: 60,
        accessibilityFeatures: {
          wheelchairAccessible: false,
          specialDiet: false,
          visualAid: false,
        },
        hasKa121: true,
        hasKa122: true,
        hasVetLearner: true,
        hasStaffMobility: true,
        yearsOfExperience: 5,
        totalParticipantsHosted: 130,
        groupsHostedLast3Years: 11,
        turkishGroupsHosted: 3,
        turkishParticipantsHosted: 30,
        emergencyContactPerson: 'Klara Novakova (Mock)',
        emergencyContactPhone: '+420 777 892019',
        shortDescription: '[SİMÜLASYON VERİSİDİR] Çekya Brno teknoloji vadisinde 5 eksenli CNC işleme ve hassas metroloji staj simülasyonu için oluşturulmuş örnek üretim işletmesi (6 kişilik butik kontenjan).',
      },
      {
        id: 'host-es-andalucia-gastro',
        name: '[MOCK] Andalucía Gastro & Hospitality Hub (Simülasyon - Yalnızca Öğrenci)',
        legalName: '[MOCK / DEMO] Centro Andaluz de Hostelería y Turismo S.L.',
        tradingName: 'Andalucía Gastro Demo',
        organisationType: 'Training centre',
        slug: 'mock-andalucia-gastro-hospitality',
        countryCode: 'ES',
        city: 'Sevilla',
        registeredAddress: 'Av. de la Constitución 18, 41004 Sevilla, Spain',
        yearEstablished: 2012,
        oid: 'E10782910',
        websiteUrl: 'https://andalucia-gastro.demo.example.eu',
        generalEmail: 'international@andalucia-gastro.demo.example.eu',
        telephone: '+34 954 829100',
        primarySector: 'tourism_hospitality',
        verificationStatus: 'VERIFIED',
        profileCompletenessScore: 94,
        contactPerson: 'Maria Jose Lopez (Mock)',
        contactTitle: 'Director of International Relations',
        contactEmail: 'mj.lopez@demo.example.eu',
        contactLanguages: ['EN', 'ES'],
        consentPublicDisplay: true,
        languages: ['EN', 'ES'],
        maxLearnersPerTerm: 14,
        totalAnnualCapacity: 42,
        activities: [
          'VET_SHORT_TERM',
          'VET_LONG_TERM_PRO',
          'VET_SKILLS_COMPETITION',
          'JOB_SHADOWING',
        ],
        isActive: true,
        createdAt: '2023-08-10T10:00:00Z',
        updatedAt: '2026-02-28T14:15:00Z',
        providesAccommodation: true,
        accommodationDetails: 'Partner hotel residence with 24/7 reception in historic center',
        providesMeals: true,
        mealsDetails: 'Full board: Training kitchen dining + partner restaurant dinners',
        providesTransfers: true,
        transfersDetails: 'Sevilla San Pablo Airport private transfer',
        acceptsUnder18: true,
        minDurationDays: 14,
        maxDurationDays: 180,
        accessibilityFeatures: {
          wheelchairAccessible: true,
          specialDiet: true,
          visualAid: false,
        },
        hasKa121: true,
        hasKa122: true,
        hasVetLearner: true,
        hasStaffMobility: false, // Students only! Staff mobility not accepted
        yearsOfExperience: 12,
        totalParticipantsHosted: 620,
        groupsHostedLast3Years: 42,
        turkishGroupsHosted: 8,
        turkishParticipantsHosted: 110,
        emergencyContactPerson: 'Alvaro Ruiz (Mock)',
        emergencyContactPhone: '+34 655 892019',
        shortDescription: '[SİMÜLASYON VERİSİDİR] Sevilla bölgesinde otel işletmeciliği ve mutfak sanatları staj simülasyonu için oluşturulmuş örnek gastronomi enstitüsü (Yalnızca öğrenci stajı).',
      },
      {
        id: 'host-de-bavaria-digital',
        name: '[MOCK] Bavaria EV Training Center (Simülasyon - Yalnızca Öğretmen)',
        legalName: '[MOCK / DEMO] Bayerisches Zentrum für Digitale Mobilität gGmbH',
        tradingName: 'Bavaria Digital Demo',
        organisationType: 'Training centre',
        slug: 'mock-bavaria-ev-training-center',
        countryCode: 'DE',
        city: 'Munich',
        registeredAddress: 'Frankfurter Ring 193, 80807 München, Germany',
        yearEstablished: 2020,
        oid: 'E10891029',
        websiteUrl: 'https://bavaria-ev.demo.example.eu',
        generalEmail: 'info@bavaria-ev.demo.example.eu',
        telephone: '+49 89 3291000',
        primarySector: 'automotive_ev',
        verificationStatus: 'PENDING',
        profileCompletenessScore: 70,
        contactPerson: 'Stefan Gruber (Mock)',
        contactTitle: 'Coordinator for Staff Mobilities',
        contactEmail: 'stefan.gruber@demo.example.eu',
        contactLanguages: ['EN', 'DE'],
        consentPublicDisplay: true,
        languages: ['EN', 'DE'],
        maxLearnersPerTerm: 4, // Very low capacity
        totalAnnualCapacity: 12,
        activities: [
          'JOB_SHADOWING',
          'STAFF_COURSE_TRAINING',
          'TEACHING_ASSIGNMENT',
        ],
        isActive: true,
        createdAt: '2024-06-15T08:00:00Z',
        updatedAt: '2026-01-20T12:00:00Z',
        providesAccommodation: false,
        providesMeals: false,
        providesTransfers: false,
        acceptsUnder18: true,
        minDurationDays: 2,
        maxDurationDays: 30,
        accessibilityFeatures: {
          wheelchairAccessible: false,
          specialDiet: false,
          visualAid: false,
        },
        hasKa121: true,
        hasKa122: true,
        hasVetLearner: false, // Staff only! Learners not accepted
        hasStaffMobility: true,
        yearsOfExperience: 3,
        totalParticipantsHosted: 65,
        groupsHostedLast3Years: 6,
        turkishGroupsHosted: 1,
        turkishParticipantsHosted: 8,
        emergencyContactPerson: 'Helena Wolf (Mock)',
        emergencyContactPhone: '+49 171 8920199',
        shortDescription: '[SİMÜLASYON VERİSİDİR] Münih merkezli, otomotiv yan sanayisi ve elektrikli araç batarya montajı alanında öğretmen işbaşı gözlem simülasyonu sunan örnek merkez (Yalnızca personel/öğretmen).',
      },
    ];

    for (const host of demoHosts) {
      this.hostsMemory.set(host.id, host);
    }
    this.logger.log(`✅ ${demoHosts.length} adet demo Avrupa ev sahibi kuruluşu (hosts pool) başarıyla hazırlandı.`);
  }

  /**
   * Evaluates mandatory eligibility criteria (Hard Filters).
   * If any filter fails, the host is disqualified.
   */
  evaluateHardFilters(
    host: HostOrganisation,
    dto: MatchHostsDto,
  ): { isEligible: boolean; disqualificationReasons: string[]; passedFilters: string[] } {
    const passedFilters: string[] = [];
    const disqualificationReasons: string[] = [];

    // 1. Project Type Match
    if (dto.projectType === 'KA121' && host.hasKa121 === false) {
      disqualificationReasons.push('Ev sahibi KA121 (Akredite) hareketlilik kabul etmemektedir.');
    } else if (dto.projectType === 'KA122' && host.hasKa122 === false) {
      disqualificationReasons.push('Ev sahibi KA122 (Kısa Dönem) hareketlilik kabul etmemektedir.');
    } else {
      passedFilters.push('project_type');
    }

    // 2. Country Match
    const requestedCountries = (dto.targetCountries || []).map((c) => c.toUpperCase());
    const isAnyCountry =
      requestedCountries.length === 0 ||
      requestedCountries.includes('ANY') ||
      requestedCountries.includes('TÜMÜ') ||
      requestedCountries.includes('ALL');

    if (!isAnyCountry && !requestedCountries.includes((host.countryCode || '').toUpperCase())) {
      disqualificationReasons.push(
        `Hedef ülke uyuşmazlığı: Ev sahibi ${host.countryCode} ülkesindedir. Tercih edilen: [${requestedCountries.join(', ')}].`,
      );
    } else {
      passedFilters.push('country');
    }

    // 3. Activity Type Match (10 official VET activities)
    const hostActivities = host.activities || [];
    if (!hostActivities.includes(dto.mobilityGoal)) {
      disqualificationReasons.push(
        `Faaliyet türü uyuşmazlığı: Ev sahibi seçilen faaliyeti (${dto.mobilityGoal}) sunmamaktadır.`,
      );
    } else {
      passedFilters.push('activity_type');
    }

    // 4. Participant Profile Match
    if (dto.participantType === 'student' && host.hasVetLearner === false) {
      disqualificationReasons.push('Ev sahibi meslek lisesi öğrencisi (stajyer) kabul etmemektedir.');
    } else if (
      (dto.participantType === 'teacher' || dto.participantType === 'staff') &&
      host.hasStaffMobility === false
    ) {
      disqualificationReasons.push('Ev sahibi öğretmen/eğitici personel hareketliliği kabul etmemektedir.');
    } else {
      passedFilters.push('participant_profile');
    }

    // 5. Capacity Check
    const totalNeeded = (dto.participantCount || 0) + (dto.accompanyingPersonsCount || 0);
    const maxCapacity = host.maxLearnersPerTerm || 4;
    if (totalNeeded > maxCapacity) {
      disqualificationReasons.push(
        `Kontenjan yetersizliği: Talep edilen ${totalNeeded} kişi (${dto.participantCount} asil + ${dto.accompanyingPersonsCount || 0} refakatçi), ev sahibi dönemlik azami kontenjanı ${maxCapacity} kişi.`,
      );
    } else {
      passedFilters.push('capacity');
    }

    // 6. Age Group (Under 18)
    if ((dto.ageGroup === 'under_18' || dto.ageGroup === 'mixed') && host.acceptsUnder18 === false) {
      disqualificationReasons.push('Ev sahibi yasal/kurumsal olarak 18 yaş altı (reşit olmayan) stajyer kabul etmemektedir.');
    } else {
      passedFilters.push('age_group');
    }

    // 7. Duration Check
    if (dto.durationDays && dto.durationDays > 0) {
      const minDays = host.minDurationDays || 2;
      const maxDays = host.maxDurationDays || 365;
      if (dto.durationDays < minDays || dto.durationDays > maxDays) {
        disqualificationReasons.push(
          `Süre uyuşmazlığı: Talep edilen ${dto.durationDays} gün, ev sahibi kabul sınırları [${minDays}–${maxDays}] gün.`,
        );
      } else {
        passedFilters.push('duration');
      }
    } else {
      passedFilters.push('duration');
    }

    // 8. Language Compatibility
    const hostLangs = (host.languages || ['EN']).map((l) => l.toUpperCase());
    const reqLangs = (dto.languages && dto.languages.length > 0 ? dto.languages : ['EN']).map((l) => l.toUpperCase());
    const hasLangOverlap = reqLangs.some((l) => hostLangs.includes(l)) || hostLangs.includes('EN');
    if (!hasLangOverlap) {
      disqualificationReasons.push(
        `Dil uyuşmazlığı: Ev sahibi dilleri [${hostLangs.join(', ')}], talep edilen [${reqLangs.join(', ')}].`,
      );
    } else {
      passedFilters.push('language');
    }

    // 9. Special Needs
    if (dto.specialNeeds?.wheelchairAccessible && !host.accessibilityFeatures?.wheelchairAccessible) {
      disqualificationReasons.push('Erişilebilirlik uyuşmazlığı: Ev sahibi tekerlekli sandalye erişimine uygun değildir.');
    } else if (dto.specialNeeds?.specialDiet && !host.accessibilityFeatures?.specialDiet) {
      disqualificationReasons.push('Özel diyet uyuşmazlığı: Ev sahibi talep edilen özel diyet/beslenme desteğini sağlayamamaktadır.');
    } else {
      passedFilters.push('special_needs');
    }

    return {
      isEligible: disqualificationReasons.length === 0,
      disqualificationReasons,
      passedFilters,
    };
  }

  /**
   * Tier 1: Calculates Education & Placement Quality Score (0 - 100)
   */
  calculateEducationQualityScore(
    host: HostOrganisation,
    dto: MatchHostsDto,
  ): { score: number; label: string; breakdown: any } {
    let sectorScore = 15;
    if (dto.vetField) {
      const vField = dto.vetField.toLowerCase();
      const pSector = (host.primarySector || '').toLowerCase();
      if (vField === pSector || pSector.includes(vField) || vField.includes(pSector)) {
        sectorScore = 25; // Exact sector match
      } else if (
        (vField.includes('software') && pSector.includes('automation')) ||
        (vField.includes('electric') && pSector.includes('energy')) ||
        (vField.includes('machinery') && pSector.includes('robotics'))
      ) {
        sectorScore = 20; // Cross-disciplinary STEM match
      }
    } else {
      sectorScore = 20;
    }

    let activityScore = 15;
    if (host.activities && host.activities.includes(dto.mobilityGoal)) {
      activityScore = 25;
    }

    let kycScore = 8;
    if (host.verificationStatus === 'VERIFIED') {
      kycScore = 20;
    } else if (host.verificationStatus === 'UNDER_REVIEW') {
      kycScore = 14;
    }

    let expScore = 8;
    const completeness = host.profileCompletenessScore || 50;
    expScore = Math.round((completeness / 100) * 10);
    if ((host.turkishGroupsHosted || 0) > 0) {
      expScore = Math.min(15, expScore + 5);
    }

    let langScore = 10;
    const hostLangs = (host.languages || ['EN']).map((l) => l.toUpperCase());
    if (hostLangs.includes('EN') && hostLangs.length > 1) {
      langScore = 15;
    }

    const total = Math.min(100, sectorScore + activityScore + kycScore + expScore + langScore);

    let label = 'Yetersiz Uyum';
    if (total >= 85) label = 'Mükemmel Eğitim Kalitesi (Excellent)';
    else if (total >= 70) label = 'Yüksek Eğitim Kalitesi (High)';
    else if (total >= 55) label = 'Yeterli Eğitim Kalitesi (Moderate)';

    return {
      score: total,
      label,
      breakdown: {
        sectorMatch: Math.round((sectorScore / 25) * 100),
        activityMatch: Math.round((activityScore / 25) * 100),
        kycTrust: Math.round((kycScore / 20) * 100),
        experience: Math.round((expScore / 15) * 100),
        languageMatch: Math.round((langScore / 15) * 100),
      },
    };
  }

  /**
   * Tier 2: Calculates Logistics Services Score (0 - 100)
   */
  calculateLogisticsScore(
    host: HostOrganisation,
    dto: MatchHostsDto,
  ): { score: number; label: string; breakdown: any } {
    const reqAccom = dto.logisticsRequired?.accommodation;
    const reqMeals = dto.logisticsRequired?.meals;
    const reqTransfers = dto.logisticsRequired?.transfers;

    let accomScore = 20;
    if (host.providesAccommodation) {
      accomScore = host.accommodationDetails ? 30 : 25;
    } else if (reqAccom) {
      accomScore = 0;
    }

    let mealsScore = 15;
    if (host.providesMeals) {
      mealsScore = host.mealsDetails ? 20 : 16;
    } else if (reqMeals) {
      mealsScore = 0;
    }

    let transferScore = 15;
    if (host.providesTransfers) {
      transferScore = host.transfersDetails ? 20 : 16;
    } else if (reqTransfers) {
      transferScore = 0;
    }

    let emergencyScore = 8;
    if (host.emergencyContactPerson && host.emergencyContactPhone) {
      emergencyScore = 15;
    } else if (host.emergencyContactPhone) {
      emergencyScore = 12;
    }

    let accompanyingScore = 10;
    const totalCount = (dto.participantCount || 0) + (dto.accompanyingPersonsCount || 0);
    const capacityHeadroom = (host.maxLearnersPerTerm || 4) - totalCount;
    if (capacityHeadroom >= 2) {
      accompanyingScore = 15;
    } else if (capacityHeadroom >= 0) {
      accompanyingScore = 12;
    }

    const total = Math.min(100, accomScore + mealsScore + transferScore + emergencyScore + accompanyingScore);

    let label = 'Temel Lojistik';
    if (total >= 85) label = 'Kapsamlı Lojistik Desteği (Comprehensive)';
    else if (total >= 70) label = 'İyi Düzeyde Lojistik (Good)';
    else if (total >= 50) label = 'Kısmi Lojistik Desteği (Partial)';
    else label = 'Lojistik Desteği Yok / Bağımsız (Self-Managed)';

    return {
      score: total,
      label,
      breakdown: {
        accommodation: Math.round((accomScore / 30) * 100),
        meals: Math.round((mealsScore / 20) * 100),
        transfers: Math.round((transferScore / 20) * 100),
        emergencySupport: Math.round((emergencyScore / 15) * 100),
        accompanyingSupport: Math.round((accompanyingScore / 15) * 100),
      },
    };
  }

  /**
   * Main Matching Engine Endpoint: Hard Filters + Two-Tier Scoring
   */
  async matchHosts(
    dto: MatchHostsDto,
    correlationId = 'match-req',
  ): Promise<MatchHostsResponseDto> {
    if (this.hostsMemory.size === 0) {
      this.seedDefaultHosts();
    }

    let allHosts: HostOrganisation[] = [];

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
            h.contact_person AS "contactPerson", h.contact_email AS "contactEmail",
            h.languages, h.is_active AS "isActive",
            h.provides_accommodation AS "providesAccommodation",
            h.accommodation_details AS "accommodationDetails",
            h.provides_meals AS "providesMeals",
            h.meals_details AS "mealsDetails",
            h.provides_transfers AS "providesTransfers",
            h.transfers_details AS "transfersDetails",
            h.accepts_under_18 AS "acceptsUnder18",
            h.accessibility_features AS "accessibilityFeatures",
            h.has_ka121 AS "hasKa121", h.has_ka122 AS "hasKa122",
            h.has_vet_learner AS "hasVetLearner", h.has_staff_mobility AS "hasStaffMobility",
            h.years_of_experience AS "yearsOfExperience",
            h.total_participants_hosted AS "totalParticipantsHosted",
            h.turkish_groups_hosted AS "turkishGroupsHosted",
            h.turkish_participants_hosted AS "turkishParticipantsHosted",
            h.emergency_contact_person AS "emergencyContactPerson",
            h.emergency_contact_phone AS "emergencyContactPhone",
            c.max_learners_per_term AS "maxLearnersPerTerm",
            c.total_annual_capacity AS "totalAnnualCapacity"
          FROM host_organisation h
          LEFT JOIN host_capacity c ON c.host_id = h.id
          WHERE h.is_active = TRUE`,
        );
        if (rows && rows.length > 0) {
          allHosts = rows.map((r: any) => ({
            ...r,
            maxLearnersPerTerm: r.maxLearnersPerTerm || 6,
            totalAnnualCapacity: r.totalAnnualCapacity || 18,
            activities: [
              'VET_SHORT_TERM',
              'JOB_SHADOWING',
              'VET_LONG_TERM_PRO',
              'TEACHING_ASSIGNMENT',
              'VET_SKILLS_COMPETITION',
              'VET_GROUP_MOBILITY',
              'STAFF_COURSE_TRAINING',
              'INVITED_EXPERT',
              'HOSTING_TEACHERS',
              'PREPARATORY_VISIT',
            ],
          }));
        }
      } catch (err: any) {
        this.logger.warn(`matchHosts DB error: ${err.message}. Memory fallback is being used.`);
      }
    }

    if (allHosts.length === 0) {
      allHosts = Array.from(this.hostsMemory.values()).filter((h) => h.isActive);
    }

    const matches: HostMatchCandidate[] = [];
    const disqualified: HostMatchCandidate[] = [];

    for (const host of allHosts) {
      const { isEligible, disqualificationReasons, passedFilters } = this.evaluateHardFilters(host, dto);
      const { score: educationScore, label: educationScoreLabel, breakdown: eduBreakdown } = this.calculateEducationQualityScore(host, dto);
      const { score: logisticsScore, label: logisticsScoreLabel, breakdown: logBreakdown } = this.calculateLogisticsScore(host, dto);

      const hasLogisticsRequest = Boolean(
        dto.logisticsRequired?.accommodation ||
        dto.logisticsRequired?.meals ||
        dto.logisticsRequired?.transfers,
      );

      const compositeScore = hasLogisticsRequest
        ? Math.round(educationScore * 0.7 + logisticsScore * 0.3)
        : educationScore;

      let matchGrade: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
      if (compositeScore >= 85) matchGrade = 'EXCELLENT';
      else if (compositeScore >= 70) matchGrade = 'HIGH';
      else if (compositeScore >= 55) matchGrade = 'MODERATE';

      const candidate: HostMatchCandidate = {
        hostId: host.id,
        hostName: host.name,
        legalName: host.legalName,
        countryCode: host.countryCode,
        city: host.city,
        oid: host.oid,
        primarySector: host.primarySector,
        organisationType: host.organisationType,
        verificationStatus: (host.verificationStatus as HostVerificationStatus) || 'PENDING',
        profileCompletenessScore: host.profileCompletenessScore || 50,
        logoUrl: host.logoUrl,
        shortDescription: host.shortDescription,
        websiteUrl: host.websiteUrl,
        providesAccommodation: host.providesAccommodation ?? false,
        accommodationDetails: host.accommodationDetails,
        providesMeals: host.providesMeals ?? false,
        mealsDetails: host.mealsDetails,
        providesTransfers: host.providesTransfers ?? false,
        transfersDetails: host.transfersDetails,
        acceptsUnder18: host.acceptsUnder18 ?? true,
        maxLearnersPerTerm: host.maxLearnersPerTerm || 4,
        supportedActivities: host.activities || [],
        workingLanguages: host.languages || ['EN'],
        isEligible,
        disqualificationReasons,
        passedFilters,
        educationScore,
        educationScoreLabel,
        logisticsScore,
        logisticsScoreLabel,
        compositeScore,
        matchGrade,
        scoreBreakdown: {
          sectorMatch: eduBreakdown.sectorMatch,
          activityMatch: eduBreakdown.activityMatch,
          kycTrust: eduBreakdown.kycTrust,
          experience: eduBreakdown.experience,
          languageMatch: eduBreakdown.languageMatch,
          accommodation: logBreakdown.accommodation,
          meals: logBreakdown.meals,
          transfers: logBreakdown.transfers,
          emergencySupport: logBreakdown.emergencySupport,
        },
      };

      if (isEligible) {
        matches.push(candidate);
      } else {
        disqualified.push(candidate);
      }
    }

    matches.sort((a, b) => b.compositeScore - a.compositeScore || b.educationScore - a.educationScore);
    disqualified.sort((a, b) => b.compositeScore - a.compositeScore);

    await this.auditService.logEvent({
      organisationId: undefined,
      action: 'HOST_MATCH_QUERY',
      resourceType: 'host_matching',
      resourceId: dto.projectType,
      payloadAfter: {
        totalEvaluated: allHosts.length,
        eligibleCount: matches.length,
        disqualifiedCount: disqualified.length,
        query: dto as unknown as Record<string, unknown>,
      },
      correlationId,
    });

    const totalParticipants = (dto.participantCount || 0) + (dto.accompanyingPersonsCount || 0);

    return {
      totalEvaluated: allHosts.length,
      eligibleCount: matches.length,
      disqualifiedCount: disqualified.length,
      matches,
      disqualified,
      queryCriteria: {
        projectType: dto.projectType,
        targetCountries: dto.targetCountries || [],
        mobilityGoal: dto.mobilityGoal,
        participantType: dto.participantType,
        totalParticipants,
        ageGroup: dto.ageGroup,
        vetField: dto.vetField,
      },
    };
  }
}

