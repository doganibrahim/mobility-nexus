import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  Organisation,
  ReadinessScoreResponse,
} from '@mobility-nexus/types';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class OrganisationsService {
  // In-memory data store for Phase 1 prototype; easily mapped to PostgreSQL
  private organisations: Map<string, Organisation> = new Map();

  constructor(private readonly auditService: AuditService) {
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

    // Check slug uniqueness
    const existing = Array.from(this.organisations.values()).find(
      (o) => o.slug === slug || (dto.oid && o.oid === dto.oid),
    );
    if (existing) {
      throw new ConflictException(
        'Bu isim, slug veya OID ile kayıtlı bir kurum zaten mevcut.',
      );
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
    return Array.from(this.organisations.values());
  }

  async findOne(id: string): Promise<Organisation> {
    const org = this.organisations.get(id);
    if (!org) {
      throw new NotFoundException(`Kurum bulunamadı (ID: ${id})`);
    }
    return org;
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

  /**
   * Evaluates organisation readiness (0-100) based on accreditation,
   * OID validity, needs description, and Erasmus plan completeness.
   */
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
      accPoints += 7; // Non-accredited is valid for KA122
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
      needsPoints += 10; // For non-accredited, plan is optional
    }

    // 4. Operational readiness & settings (20 pts)
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
