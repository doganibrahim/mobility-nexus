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

export type ParticipantType = 'teacher' | 'student' | 'staff' | 'incoming' | 'project_team';

export type MobilityGoal =
  | 'VET_SKILLS_COMPETITION'
  | 'VET_GROUP_MOBILITY'
  | 'VET_SHORT_TERM'
  | 'VET_LONG_TERM_PRO'
  | 'JOB_SHADOWING'
  | 'TEACHING_ASSIGNMENT'
  | 'STAFF_COURSE_TRAINING'
  | 'INVITED_EXPERT'
  | 'HOSTING_TEACHERS'
  | 'PREPARATORY_VISIT';

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
  action:
    | 'KA121-VET'
    | 'KA122-VET'
    | 'KA120-VET Erasmus Accreditation Recommended'
    | 'Akreditasyon durumu doğrulanmalı';
  readiness: string;
  level?: 'good' | 'warn' | 'bad';
  rationale?: string;
}

export interface Ka122EligibilityState {
  accredited: 'yes' | 'no' | 'unknown';
  participantCount: number;
  projectDurationMonths: number;
  pastKa122GrantsCount: number;
  mobilityStrategy: 'ad_hoc' | 'regular_annual';
}

export interface Ka122EligibilityCheckItem {
  id: string;
  title: string;
  passed: boolean;
  status: 'eligible' | 'warning' | 'ineligible' | 'recommend_ka120' | 'recommend_ka121';
  message: string;
}

export interface Ka122EligibilityResult {
  isEligibleForKa122: boolean;
  recommendedPathway: 'KA121-VET' | 'KA122-VET' | 'KA120-VET' | 'NEEDS_VERIFICATION';
  summaryTitle: string;
  summaryMessage: string;
  checks: Ka122EligibilityCheckItem[];
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
  targetCountries: string[];
  startDate: string;
  endDate: string;
  participantCount: number;
  accompanyingPersonsCount: number;
  ageGroup: 'under_18' | '18_plus' | 'mixed';

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

// ==============================================================================
// 4. Host Organisation 3-Tier Profile Types & DTOs
// ==============================================================================

export type HostVerificationStatus =
  | 'PENDING'
  | 'UNDER_REVIEW'
  | 'VERIFIED'
  | 'NEEDS_UPDATE'
  | 'REJECTED'
  | 'SUSPENDED';

export interface HostOrganisationFull {
  id: string;
  name: string; // Full legal name
  legalName?: string;
  tradingName?: string | null;
  organisationType: string;
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
  workingLanguages: string[];
  logoUrl?: string | null;
  shortDescription?: string | null;
  detailedProfileUrl?: string | null;

  // Contact Person Details
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

  // Erasmus+ Experience (Public Portfolio)
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
  completedProjects?: Array<{
    title: string;
    referenceNumber: string;
    year: number;
    role: string;
  }>;
  projectResultsLinks?: string[];
  nationalAgencyExperience?: string | null;
  sampleMobilityProgrammeUrl?: string | null;

  // Verification Documents (Admin Only)
  participantEvidenceUrls?: string[];
  sampleDocumentsUrls?: string[];

  // Status & Metrics
  verificationStatus: HostVerificationStatus;
  profileCompletenessScore: number;
  primarySector: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Tier 1: Post-Registration Quick Onboarding DTO
export interface RegisterHostQuickDto {
  name: string;
  tradingName?: string;
  organisationType: string;
  countryCode: string;
  city: string;
  registeredAddress: string;
  yearEstablished: number;
  oid: string;
  picNumber?: string;
  websiteUrl: string;
  generalEmail: string;
  telephone: string;
  workingLanguages: string[];
  primarySector: string;
  contactPerson: string;
  contactTitle: string;
  contactEmail: string;
  consentPublicDisplay: boolean;
  userId?: string;
  userEmail?: string;
  userFullName?: string;
}

// Tier 2: Dashboard Profile & Erasmus+ Portfolio DTO
export interface UpdateHostPortfolioDto {
  operationalAddress?: string;
  logoUrl?: string;
  shortDescription?: string;
  detailedProfileUrl?: string;
  contactLinkedin?: string;
  contactLanguages?: string[];
  contactPhotoUrl?: string;
  turkeyContactPerson?: string;
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
  completedProjects?: Array<{
    title: string;
    referenceNumber: string;
    year: number;
    role: string;
  }>;
  projectResultsLinks?: string[];
  nationalAgencyExperience?: string;
  sampleMobilityProgrammeUrl?: string;
}

// Tier 3: Verification & KYC DTO (Admin Only Documents)
export interface SubmitHostVerificationDto {
  registrationNumber: string;
  registrationDocumentUrl: string;
  taxVatNumber: string;
  emergencyContactPerson: string;
  emergencyContactPhone: string;
  contactDirectPhone?: string;
  contactWhatsapp?: string;
  participantEvidenceUrls?: string[];
  sampleDocumentsUrls?: string[];
}

export interface HostVerificationReviewDto {
  status: 'VERIFIED' | 'NEEDS_UPDATE' | 'REJECTED';
  reviewerNotes?: string;
  criteriaChecklist?: Record<string, boolean>;
}

// ==============================================================================
// 5. Host Matching Engine Types & DTOs
// ==============================================================================

export interface MatchHostsRequestDto {
  projectType: 'KA121' | 'KA122';
  targetCountries: string[]; // e.g. ['DE', 'ES'] or ['ANY'] or empty
  preferredCity?: string;
  mobilityGoal: MobilityGoal;
  participantType: ParticipantType;
  participantCount: number;
  accompanyingPersonsCount?: number;
  durationDays?: number;
  ageGroup: 'under_18' | '18_plus' | 'mixed';
  vetField?: string;
  iscedCode?: string;
  languages?: string[];
  logisticsRequired?: {
    accommodation?: boolean;
    meals?: boolean;
    transfers?: boolean;
  };
  specialNeeds?: {
    wheelchairAccessible?: boolean;
    specialDiet?: boolean;
    visualAid?: boolean;
  };
}

export interface MatchScoreBreakdown {
  sectorMatch: number; // 0-100
  activityMatch: number; // 0-100
  kycTrust: number; // 0-100
  experience: number; // 0-100
  languageMatch: number; // 0-100
  accommodation: number; // 0-100
  meals: number; // 0-100
  transfers: number; // 0-100
  emergencySupport: number; // 0-100
}

export interface HostMatchCandidate {
  hostId: string;
  hostName: string;
  legalName?: string;
  countryCode: string;
  city: string;
  oid?: string;
  primarySector: string;
  organisationType: string;
  verificationStatus: HostVerificationStatus;
  profileCompletenessScore: number;
  logoUrl?: string | null;
  shortDescription?: string | null;
  websiteUrl?: string;

  // Logistics flags
  providesAccommodation?: boolean;
  accommodationDetails?: string | null;
  providesMeals?: boolean;
  mealsDetails?: string | null;
  providesTransfers?: boolean;
  transfersDetails?: string | null;
  acceptsUnder18?: boolean;

  // Capacity & Activities
  maxLearnersPerTerm: number;
  supportedActivities: string[];
  workingLanguages: string[];

  // Eligibility evaluation
  isEligible: boolean;
  disqualificationReasons: string[];
  passedFilters: string[];

  // Two-tier independent scores (0-100)
  educationScore: number;
  educationScoreLabel: string;
  logisticsScore: number;
  logisticsScoreLabel: string;
  compositeScore: number;
  matchGrade: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'LOW';

  scoreBreakdown: MatchScoreBreakdown;
}

export interface MatchHostsResponseDto {
  totalEvaluated: number;
  eligibleCount: number;
  disqualifiedCount: number;
  matches: HostMatchCandidate[];
  disqualified: HostMatchCandidate[];
  queryCriteria: {
    projectType: string;
    targetCountries: string[];
    mobilityGoal: string;
    participantType: string;
    totalParticipants: number;
    ageGroup: string;
    vetField?: string;
  };
}
