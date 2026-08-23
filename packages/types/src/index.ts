/**
 * CAPPINNO Mobility Nexus - Domain Types, Interfaces and DTOs
 */

// ==============================================================================
// 1. Roles & Multi-tenant Entities
// ==============================================================================

export type Role = 'PLATFORM_ADMIN' | 'ORG_ADMIN' | 'MEMBER' | 'VIEWER';

export type AccreditationStatus = 'YES' | 'NO' | 'UNKNOWN' | 'PENDING';

export type InvitationStatus = 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED';

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  oid?: string | null;
  city?: string | null;
  countryCode: string;
  accreditationStatus: AccreditationStatus;
  erasmusPlan?: string | null;
  institutionNeed?: string | null;
  readinessScore: number;
  isActive: boolean;
  settings: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string | null;
  isActive: boolean;
  emailVerified: boolean;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  organisationId: string;
  userId: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user?: UserAccount;
  organisation?: Organisation;
}

export interface Invitation {
  id: string;
  organisationId: string;
  email: string;
  role: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER';
  token: string;
  status: InvitationStatus;
  expiresAt: string;
  createdBy?: string | null;
  acceptedBy?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  organisationId?: string | null;
  userId?: string | null;
  action: string;
  resourceType: string;
  resourceId: string;
  payloadBefore?: Record<string, unknown> | null;
  payloadAfter?: Record<string, unknown> | null;
  correlationId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
}

// ==============================================================================
// 2. Gateway / Mobility Profile Domain Types
// ==============================================================================

export type ParticipantType = 'teacher' | 'student';

export type MobilityGoal =
  | 'Job shadowing / observation'
  | 'Work-based learner mobility'
  | 'Skills training'
  | 'Teaching/training assignment'
  | 'Mixed / not decided';

export type HostType =
  | 'VET school'
  | 'Training centre'
  | 'Company / SME'
  | 'Factory / industrial company'
  | 'Sectoral organisation';

export interface VetFieldDefinition {
  isced: string;
  name: string;
  esco: string;
  skills: string;
}

export interface HostMetrics {
  h1: number; // Mesleki alan uyumu (20%)
  h2: number; // Learning outcomes kapasitesi (15%)
  h3: number; // Teknik altyapı (10%)
  h4: number; // Erasmus deneyimi (10%)
  h5: number; // İngilizce iletişim (10%)
  h6: number; // Öğrenci kabul kapasitesi (10%)
  h7: number; // Öğretmen job-shadowing (5%)
  h8: number; // Mentor kapasitesi (10%)
  h9: number; // OHS / safety altyapısı (5%)
  h10: number; // Uzun dönem işbirliği (5%)
}

export interface DecisionResult {
  score: number;
  action: 'KA121-VET' | 'KA122-VET' | 'Akreditasyon durumu doğrulanmalı';
  readiness: string;
  rationale?: string;
}

export interface MobilityGatewayState {
  // 1. School Profile
  schoolName: string;
  city: string;
  accredited: 'yes' | 'no' | 'unknown';
  oid: string;
  erasmusPlan: string;
  institutionNeed: string;

  // 2. Participant Profile
  participantType: ParticipantType;
  mobilityGoal: MobilityGoal;
  participantName: string;
  language: number;
  country: string;
  duration: string;

  // 3. ESCO - ISCED
  vetField: string;
  iscedCode: string;
  iscedName: string;
  escoTerm: string;
  iscoCode: string;
  escoUri: string;
  skills: string;

  // 4. Assessment & Gap
  assessmentAnswers: Record<number, number>;
  targetScore: number;
  externalScore?: number | null;
  competenceScore?: number | null;

  // 5. Host Matching
  hostName: string;
  hostCountry: string;
  hostType: HostType;
  hostMetrics: HostMetrics;
  hostScoreValue?: number | null;

  // 6. Decision & Outcomes
  currentDecision?: DecisionResult | null;
  primaryGap: string;
  technicalOutcome: string;
  transversalOutcome: string;
}

// ==============================================================================
// 3. DTOs for API
// ==============================================================================

export interface CreateOrganisationDto {
  name: string;
  slug?: string;
  oid?: string;
  city?: string;
  countryCode?: string;
  accreditationStatus?: AccreditationStatus;
  erasmusPlan?: string;
  institutionNeed?: string;
}

export interface UpdateOrganisationDto extends Partial<CreateOrganisationDto> {
  isActive?: boolean;
  settings?: Record<string, unknown>;
}

export interface CreateInvitationDto {
  email: string;
  role: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER';
}

export interface AcceptInvitationDto {
  token: string;
  fullName: string;
  password?: string;
}

export interface ReadinessScoreResponse {
  score: number;
  breakdown: {
    identity: { points: number; max: number; passed: boolean; message: string };
    accreditation: { points: number; max: number; passed: boolean; message: string };
    needsAnalysis: { points: number; max: number; passed: boolean; message: string };
    participantPreparation: { points: number; max: number; passed: boolean; message: string };
  };
  recommendations: string[];
}
