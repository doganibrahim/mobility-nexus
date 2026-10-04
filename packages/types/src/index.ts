/**
 * ErasmusMobility - Domain Types, Interfaces and DTOs
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

  // PKG-IMP-05: Comprehensive Provider Profiles & Policies
  cancellationPolicy?: HostCancellationPolicy;
  accessibilityFeatures?: HostAccessibilityFeatures;
  targetGroups?: TargetGroupType[];
  reviewsBreakdown?: HostReviewsBreakdownResponse;
  lastUpdatedAt?: string;

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

  // PKG-IMP-05 Form Fields
  cancellationPolicy?: HostCancellationPolicy;
  accessibilityFeatures?: HostAccessibilityFeatures;
  targetGroups?: TargetGroupType[];
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

export type MatchingCriterionKey =
  | 'country'
  | 'activityType'
  | 'targetGroup'
  | 'dates'
  | 'duration'
  | 'capacity'
  | 'logistics';

export type CriterionMatchStatus = 'MATCH' | 'PARTIAL' | 'MISMATCH';

export interface CriterionEvaluation {
  key: MatchingCriterionKey;
  labelTr: string;
  labelEn: string;
  weightPercent: number; // e.g. 15, 20, 15, 10, 10, 15, 15
  status: CriterionMatchStatus;
  scoreContribution: number; // 0-100
  weightedScore: number; // points contributed to total 100
  schoolRequested: string;
  hostProvided: string;
  messageTr: string;
  messageEn: string;
  actionableHintTr?: string;
  actionableHintEn?: string;
}

export interface SevenCriteriaDiagnostics {
  overallSuitabilityScore: number;
  grade: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'LOW';
  formulaExplanationTr: string;
  formulaExplanationEn: string;
  criteria: CriterionEvaluation[];
  matchedCount: number;
  partialCount: number;
  mismatchCount: number;
  primaryBlockersTr: string[];
  primaryBlockersEn: string[];
  actionableRecommendationsTr: string[];
  actionableRecommendationsEn: string[];
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

  // 7-criteria transparent diagnostics breakdown (PKG-IMP-03)
  sevenCriteria?: SevenCriteriaDiagnostics;
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

export interface EvaluateCriteriaRequestDto {
  criteria: MatchHostsRequestDto;
  hostId?: string;
  hostData?: Partial<HostMatchCandidate>;
}

export interface EvaluateCriteriaItemResult {
  hostId: string;
  hostName: string;
  countryCode: string;
  city: string;
  isEligible: boolean;
  suitabilityScore: number;
  educationScore: number;
  logisticsScore: number;
  compositeScore: number;
  matchGrade: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'LOW';
  diagnostics: SevenCriteriaDiagnostics;
}

export interface EvaluateCriteriaResponseDto {
  totalEvaluated: number;
  queryCriteria: MatchHostsRequestDto;
  results: EvaluateCriteriaItemResult[];
}

// ==============================================================================
// 6. KA121 Official Form Schema & Guidance Types
// ==============================================================================

export * from './ka121-form-schema';
export * from './ka122-form-schema';

// ==============================================================================
// 7. Training & Job Shadowing Marketplace Types (PKG-01)
// ==============================================================================

export type CourseSessionStatus = 'OPEN' | 'LIMITED' | 'FULL' | 'CANCELLED';
export type JobShadowingStatus = 'ACTIVE' | 'PAUSED' | 'FILLED';
export type MarketplaceApplicationType = 'COURSE' | 'JOB_SHADOWING';
export type MarketplaceApplicationStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED';
export type MarketplaceProjectType = 'KA121' | 'KA122' | 'NOT_YET_APPLIED';

export interface CourseLearningOutcome {
  id: string;
  courseId: string;
  outcomeTr: string;
  outcomeEn: string;
  escoSkillCode?: string | null;
  escoSkillLabel?: string | null;
  orderIndex: number;
}

export interface CourseSession {
  id: string;
  courseId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  city: string;
  country: string;
  capacity: number;
  enrolledCount: number;
  status: CourseSessionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  id: string;
  hostId: string;
  hostName: string;
  hostCountry: string;
  hostCity: string;
  hostOid?: string | null;
  titleTr: string;
  titleEn: string;
  slug: string;
  descriptionTr: string;
  descriptionEn: string;
  iscedCode: string;
  iscedName?: string | null;
  targetAudience: 'TEACHERS' | 'VET_STAFF' | 'TRAINERS' | 'MIXED';
  durationDays: number;
  dailyFeeEur: number; // Erasmus+ standard: 80 EUR/day
  language: string;
  minLanguageLevel: 'A2' | 'B1' | 'B2' | 'C1';
  isPublished: boolean;
  rating: number;
  reviewsCount: number;
  tags: string[];
  sessions?: CourseSession[];
  learningOutcomes?: CourseLearningOutcome[];
  // PKG-IMP-05 Additions
  cancellationPolicy?: HostCancellationPolicy | CancellationPolicyType;
  accessibilityFeatures?: HostAccessibilityFeatures;
  targetGroups?: TargetGroupType[];
  lastUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JobShadowingOffer {
  id: string;
  hostId: string;
  hostName: string;
  country: string;
  city: string;
  vetField: string;
  iscedCode?: string | null;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  eligibleStaffTypes: string[];
  durationDays: number;
  maxCapacityPerSlot: number;
  languages: string[];
  workingEnvironmentDetails?: string | null;
  status: JobShadowingStatus;
  // PKG-IMP-05 Additions
  cancellationPolicy?: HostCancellationPolicy | CancellationPolicyType;
  accessibilityFeatures?: HostAccessibilityFeatures;
  targetGroups?: TargetGroupType[];
  lastUpdatedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MarketplaceApplication {
  id: string;
  applicationType: MarketplaceApplicationType;
  courseId?: string | null;
  sessionId?: string | null;
  jobShadowingId?: string | null;
  hostId: string;
  hostName: string;
  // Beneficiary details
  schoolId?: string | null;
  schoolName: string;
  schoolOid: string;
  schoolCity?: string | null;
  contactName: string;
  contactEmail: string;
  contactPhone?: string | null;
  projectType: MarketplaceProjectType;
  participantCount: number;
  durationDays: number;
  totalGrantEur: number; // participantCount * durationDays * 80 (capped at 800 EUR/participant)
  specialNotes?: string | null;
  // Host review & decision
  status: MarketplaceApplicationStatus;
  hostDecisionNote?: string | null;
  // Associated references (populated in query)
  courseTitle?: string | null;
  sessionDates?: string | null;
  sessionLocation?: string | null;
  jobShadowingTitle?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourseFilterQuery {
  country?: string;
  iscedCode?: string;
  targetAudience?: string;
  minLanguageLevel?: string;
  search?: string;
}

export interface CreateCourseDto {
  hostId: string;
  hostName: string;
  hostCountry: string;
  hostCity: string;
  hostOid?: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  iscedCode: string;
  iscedName?: string;
  targetAudience?: 'TEACHERS' | 'VET_STAFF' | 'TRAINERS' | 'MIXED';
  durationDays?: number;
  dailyFeeEur?: number;
  language?: string;
  minLanguageLevel?: 'A2' | 'B1' | 'B2' | 'C1';
  tags?: string[];
  learningOutcomesTr?: string[];
  learningOutcomesEn?: string[];
}

export interface CreateCourseSessionDto {
  courseId: string;
  startDate: string;
  endDate: string;
  city: string;
  country: string;
  capacity: number;
}

export interface CreateJobShadowingOfferDto {
  hostId: string;
  hostName: string;
  country: string;
  city: string;
  vetField: string;
  iscedCode?: string;
  titleTr: string;
  titleEn: string;
  descriptionTr: string;
  descriptionEn: string;
  eligibleStaffTypes?: string[];
  durationDays?: number;
  maxCapacityPerSlot?: number;
  languages?: string[];
  workingEnvironmentDetails?: string;
}

export interface CreateMarketplaceApplicationDto {
  applicationType: MarketplaceApplicationType;
  courseId?: string;
  sessionId?: string;
  jobShadowingId?: string;
  hostId: string;
  hostName: string;
  schoolId?: string;
  schoolName: string;
  schoolOid: string;
  schoolCity?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  projectType: MarketplaceProjectType;
  participantCount: number;
  durationDays?: number;
  specialNotes?: string;
}

export interface UpdateApplicationStatusDto {
  status: 'CONFIRMED' | 'DECLINED' | 'CANCELLED';
  hostDecisionNote?: string;
}

// ==============================================================================
// 7. Admin CMS & Dynamic Content Console Types (PKG-02)
// ==============================================================================

export type LibraryCategoryCode = 'FORMS' | 'GUIDES' | 'TEMPLATES' | 'LEGAL' | 'OFFICIAL' | string;
export type LibraryFileFormat = 'PDF' | 'DOCX' | 'XLSX' | 'ZIP' | 'LINK';

export interface LibraryCategory {
  id: string;
  code: LibraryCategoryCode;
  nameTr: string;
  nameEn: string;
  slug: string;
  descriptionTr?: string | null;
  descriptionEn?: string | null;
  icon: string;
  colorBadge: string;
  orderIndex: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLibraryCategoryDto {
  code: string;
  nameTr: string;
  nameEn: string;
  slug: string;
  descriptionTr?: string;
  descriptionEn?: string;
  icon?: string;
  colorBadge?: string;
  orderIndex?: number;
  isActive?: boolean;
}

export interface LibraryResource {
  id: string;
  categoryId?: string | null;
  categoryCode: LibraryCategoryCode;
  titleTr: string;
  titleEn: string;
  slug?: string | null;
  descriptionTr: string;
  descriptionEn: string;
  fileFormat: LibraryFileFormat;
  fileSize: string;
  downloadUrl: string;
  tags: string[];
  isFeatured: boolean;
  isPublished: boolean;
  downloadCount: number;
  createdBy: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLibraryResourceDto {
  categoryCode: LibraryCategoryCode;
  titleTr: string;
  titleEn?: string;
  descriptionTr: string;
  descriptionEn?: string;
  fileFormat: LibraryFileFormat;
  fileSize?: string;
  downloadUrl: string;
  tags?: string[];
  isFeatured?: boolean;
  isPublished?: boolean;
}

export type CmsEntityType = 'COURSE' | 'COURSE_SESSION' | 'JOB_SHADOWING' | 'LIBRARY_RESOURCE' | 'CATEGORY';
export type CmsActionType = 'CREATE' | 'UPDATE' | 'DELETE' | 'PUBLISH' | 'ARCHIVE';

export interface CmsContentRevision {
  id: string;
  entityType: CmsEntityType;
  entityId: string;
  entityTitle: string;
  action: CmsActionType;
  authorId: string;
  authorName: string;
  authorRole: string;
  changesSummary: string;
  payloadBefore?: Record<string, unknown> | null;
  payloadAfter?: Record<string, unknown> | null;
  createdAt: string;
}

export interface CreateCmsRevisionDto {
  entityType: CmsEntityType;
  entityId: string;
  entityTitle: string;
  action: CmsActionType;
  authorId?: string;
  authorName?: string;
  authorRole?: string;
  changesSummary: string;
  payloadBefore?: Record<string, unknown> | null;
  payloadAfter?: Record<string, unknown> | null;
}

export interface AdminCreateCourseWithSessionsDto extends CreateCourseDto {
  sessions?: Array<{
    startDate: string;
    endDate: string;
    city: string;
    country: string;
    capacity: number;
  }>;
}

// ==============================================================================
// 8. School Support, Inquiry Tracking & Need Coordination Types (PKG-03)
// ==============================================================================

export type SchoolCoordinationStatusType =
  | 'NEW_REGISTRATION'
  | 'IN_REVIEW'
  | 'MEETING_SCHEDULED'
  | 'CONSORTIUM_MATCHED'
  | 'APPLICATION_READY'
  | 'MOBILITY_ACTIVE';

export interface NeedAssessmentScores {
  s1AccreditationAlignment: number; // 0 - 100
  s2HostMatchingGap: number;        // 0 - 100
  s3GrantBudgetCapacity: number;    // 0 - 100
  s4ParticipantPrepLevel: number;   // 0 - 100
  s5LearningAgreementQuality: number;// 0 - 100
  s6RiskAndInclusion: number;       // 0 - 100
  s7ConsortiumSynergy: number;      // 0 - 100
  s8GreenAndDigitalShift: number;   // 0 - 100
  overallReadinessScore: number;    // 0 - 100
  recommendedPath: string;          // e.g. KA121_BUDGET_REQUEST, KA122_SHORT_TERM, CONSORTIUM_PARTNER
  evaluationSummary: string;
}

export interface CoordinationActivityLog {
  id: string;
  schoolId: string;
  inquiryId?: string | null;
  coordinatorId: string;
  coordinatorName: string;
  activityType: 'PHONE_CALL' | 'ONLINE_MEETING' | 'NOTE' | 'CONSORTIUM_ASSIGNMENT' | 'STATUS_CHANGE';
  title: string;
  content: string;
  previousStatus?: SchoolCoordinationStatusType | null;
  newStatus?: SchoolCoordinationStatusType | null;
  followUpDate?: string | null;
  createdAt: string;
}

export interface SchoolCoordinationRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolOid?: string | null;
  schoolCity?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  accreditationStatus: 'YES' | 'NO' | 'UNKNOWN' | 'PENDING';
  status: SchoolCoordinationStatusType;
  assignedCoordinatorName: string;
  lastContactedAt?: string | null;
  needAssessment: NeedAssessmentScores;
  recentActivities: CoordinationActivityLog[];
  inquiriesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AddCoordinationNoteDto {
  schoolId: string;
  inquiryId?: string;
  activityType?: 'PHONE_CALL' | 'ONLINE_MEETING' | 'NOTE' | 'CONSORTIUM_ASSIGNMENT' | 'STATUS_CHANGE';
  title: string;
  content: string;
  newStatus?: SchoolCoordinationStatusType;
  followUpDate?: string;
}

export interface SchoolGuidanceRecommendation {
  schoolId: string;
  schoolName: string;
  accreditationStatus: string;
  overallScore: number;
  recommendedPath: string;
  primaryActionTitle: string;
  guidanceNotes: string[];
  recommendedHosts: Array<{
    country: string;
    field: string;
    matchReason: string;
  }>;
  eligibleConsortia: string[];
}

// ==============================================================================
// 9. Participant Mobility Preparation Portal Types (PKG-04 LMS)
// ==============================================================================

export type PrepModuleCategory =
  | 'CULTURAL_ADAPTATION'
  | 'LANGUAGE_PREP'
  | 'OHS_SAFETY'
  | 'TRAVEL_LOGISTICS'
  | 'ERASMUS_RIGHTS'
  | 'GREEN_DIGITAL'
  | 'ESCO_LEARNING'
  | 'CRISIS_INSURANCE'
  | 'MENTORSHIP_WORKPLACE'
  | 'DISSEMINATION';

export interface PrepModuleContentBlock {
  titleTr: string;
  titleEn: string;
  contentTr: string;
  contentEn: string;
  checklistTr?: string[];
  checklistEn?: string[];
}

export interface PrepQuizQuestion {
  id: string;
  questionTr: string;
  questionEn: string;
  optionsTr: string[];
  optionsEn: string[];
  correctOptionIndex: number;
  explanationTr: string;
  explanationEn: string;
}

export interface PrepModule {
  id: string;
  slug: string;
  titleTr?: string;
  titleEn?: string;
  title_tr?: string;
  title_en?: string;
  descriptionTr?: string;
  descriptionEn?: string;
  description_tr?: string;
  description_en?: string;
  category: PrepModuleCategory;
  estimatedDurationMinutes: number;
  orderIndex: number;
  requiredRole: 'STUDENT' | 'STAFF' | 'ALL';
  badgeName: string;
  badgeIcon: string;
  contentBlocks: PrepModuleContentBlock[];
  quizQuestions: PrepQuizQuestion[];
  isMandatory: boolean;
  isActive: boolean;
}

export type ParticipantRoleType = 'STUDENT' | 'TEACHER' | 'STAFF';

export type PrepAssignmentStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export interface PrepAssignment {
  id: string;
  participantId: string;
  participantName: string;
  participantEmail: string;
  participantRole: ParticipantRoleType;
  schoolId: string;
  schoolName: string;
  destinationCountry: string;
  destinationCity?: string;
  mobilityProjectCode: string;
  deadlineDate?: string;
  status: PrepAssignmentStatus;
  completionPercentage: number;
  completedModulesCount: number;
  totalModulesCount: number;
  certificateIssuedAt?: string;
  certificateNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PrepCompletion {
  id: string;
  assignmentId: string;
  participantId: string;
  moduleId: string;
  isCompleted: boolean;
  quizScore: number;
  completedAt: string;
  timeSpentMinutes?: number;
  notes?: string;
}

export interface ParticipantBadge {
  badgeName: string;
  badgeIcon: string;
  earnedAt: string;
  titleTr: string;
  titleEn: string;
}

export interface ParticipantProgressReport {
  assignment: PrepAssignment;
  completions: PrepCompletion[];
  completedModuleIds: string[];
  missingMandatoryModuleIds: string[];
  isReadyForMobility: boolean;
  badges: ParticipantBadge[];
  averageQuizScore: number;
}

export interface CompleteStepDto {
  assignmentId: string;
  participantId: string;
  moduleId: string;
  quizScore: number;
  timeSpentMinutes?: number;
  notes?: string;
}

// ==============================================================================
// 10. Official Mobility Dossier & Formal Document Export Types (PKG-05)
// ==============================================================================

export type DossierDocumentType =
  | 'LEARNING_AGREEMENT'
  | 'EUROPASS_MOBILITY'
  | 'INTER_INSTITUTIONAL_AGREEMENT'
  | 'QUALITY_COMMITMENT';

export type DossierDocumentStatus = 'DRAFT' | 'READY' | 'GENERATED' | 'SIGNED';

export interface MobilityDossier {
  id: string;
  schoolId: string;
  schoolName: string;
  schoolOid?: string;
  schoolCity?: string;
  hostId?: string;
  hostName: string;
  hostCountry: string;
  hostCity?: string;
  hostContactEmail?: string;
  mobilityCode: string;
  mobilityType: string;
  vetFieldName: string;
  iscedCode: string;
  escoSkills: string[];
  participantCount: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  status: 'ACTIVE' | 'EXPORTED' | 'ARCHIVED';
  documents?: DossierDocument[];
  createdAt: string;
  updatedAt: string;
}

export type DossierDocumentPayload =
  | LearningAgreementPayload
  | EuropassMobilityPayload
  | InterInstitutionalAgreementPayload
  | Record<string, any>;

export interface DossierDocument {
  id: string;
  dossierId: string;
  documentType: DossierDocumentType;
  titleTr: string;
  titleEn: string;
  status: DossierDocumentStatus;
  templateVersion: string;
  fileFormat: 'PDF' | 'DOCX' | 'JSON';
  documentPayload: DossierDocumentPayload;
  lastExportedAt?: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExportLogRecord {
  id: string;
  dossierId: string;
  documentType: DossierDocumentType;
  exporterUserId?: string;
  exporterName: string;
  exportFormat: string;
  fileName: string;
  fileSizeKb: number;
  exportedAt: string;
}

export interface LearningAgreementPayload {
  studentName: string;
  studentEmail: string;
  sendingInstitution: {
    name: string;
    oid: string;
    address: string;
    city: string;
    contactPerson: string;
    contactEmail: string;
  };
  hostOrganisation: {
    name: string;
    country: string;
    city: string;
    address: string;
    mentorName: string;
    mentorRole: string;
    mentorEmail: string;
  };
  mobilityProgramme: {
    field: string;
    isced: string;
    startDate: string;
    endDate: string;
    durationDays: number;
    workingHoursPerWeek: number;
  };
  learningOutcomes: {
    knowledge: string[];
    skills: string[];
    competencies: string[];
  };
  monitoringPlan: string;
  assessmentCriteria: string;
}

export interface EuropassMobilityPayload {
  europassId: string;
  certificateHolder: {
    fullName: string;
    dateOfBirth: string;
    nationality: string;
  };
  sendingPartner: {
    name: string;
    city: string;
    country: string;
  };
  hostPartner: {
    name: string;
    city: string;
    country: string;
  };
  mobilityDetails: {
    startDate: string;
    endDate: string;
    durationDays: number;
    titleOfTraining: string;
  };
  acquiredSkills: {
    jobRelatedSkills: string[];
    languageSkills: string[];
    digitalSkills: string[];
    organizationalSkills: string[];
  };
}

export interface InterInstitutionalAgreementPayload {
  agreementNumber: string;
  partnerA: {
    name: string;
    oid: string;
    country: string;
    address: string;
    legalRep: string;
    legalRepTitle: string;
  };
  partnerB: {
    name: string;
    country: string;
    city: string;
    address: string;
    legalRep: string;
    legalRepTitle: string;
  };
  durationYears: string;
  studentQuotaPerYear: number;
  commitments: string[];
  financialRules: string;
  signedDate: string;
}

export interface ExportDocumentDto {
  dossierId: string;
  documentType: DossierDocumentType;
  format?: 'PDF' | 'DOCX' | 'JSON';
  customPayload?: Record<string, unknown>;
  exporterName?: string;
}

// ==============================================================================
// 11. System QA Metrics, Production Deployment & Hardening Types (PKG-06)
// ==============================================================================

export type QaTestCategory =
  | 'SECURITY_AUDIT'
  | 'LOAD_PERFORMANCE'
  | 'DATA_INTEGRITY'
  | 'E2E_WORKFLOW'
  | 'ACCESSIBILITY';

export type QaTestStatus = 'PASSED' | 'WARNING' | 'FAILED' | 'RUNNING';

export interface QaTestAssertion {
  id: string;
  name: string;
  status: 'PASSED' | 'FAILED';
  latencyMs?: number;
  message?: string;
}

export interface QaTestRun {
  id: string;
  testSuiteName: string;
  testCategory: QaTestCategory;
  environment: string;
  status: QaTestStatus;
  durationMs: number;
  totalAssertions: number;
  passedAssertions: number;
  failedAssertions: number;
  p95LatencyMs: number;
  errorRatePercent: number;
  summaryReport: string;
  detailedResults: QaTestAssertion[];
  executedBy: string;
  executedAt: string;
}

export interface SystemMetric {
  id: string;
  endpointPath: string;
  httpMethod: string;
  p50LatencyMs: number;
  p95LatencyMs: number;
  p99LatencyMs: number;
  requestsPerSecond: number;
  errorCount: number;
  totalRequests: number;
  cpuUsagePercent: number;
  memoryUsageMb: number;
  dbPoolActiveConnections: number;
  recordedAt: string;
}

export interface CommercialMetricSnapshot {
  id: string;
  totalRegisteredSchools: number;
  totalHostOrganisations: number;
  activeMobilityMatches: number;
  totalParticipantsPrepared: number;
  totalDossiersExported: number;
  estimatedGrantVolumeEur: number;
  freeTierCostSavedEur: number;
  uptimePercentage: number;
  snapshotDate: string;
  createdAt: string;
}

export interface HardeningCheckItem {
  id: string;
  titleTr: string;
  titleEn: string;
  category: 'SECURITY' | 'ENV' | 'PERFORMANCE' | 'COMPLIANCE';
  status: 'VERIFIED' | 'WARNING' | 'ACTION_REQUIRED';
  detailsTr: string;
  detailsEn: string;
  verifiedAt: string;
}

export interface TriggerQaRunDto {
  testCategory?: QaTestCategory;
  suiteName?: string;
}

// ==============================================================================
// 12. Provider Profiles, Cancellation Policies & 5D Reviews (PKG-IMP-05)
// ==============================================================================

export type TargetGroupType = 'STUDENT' | 'APPRENTICE' | 'STAFF' | 'TEACHER' | 'MIXED';

export type CancellationPolicyType = 'FLEXIBLE' | 'MODERATE' | 'STRICT' | 'CUSTOM';

export interface HostCancellationPolicy {
  id?: string;
  hostId?: string;
  policyType: CancellationPolicyType;
  refundPercentageFull: number; // e.g. 100% full refund
  daysBeforeFullRefund: number; // e.g. 30 days before start
  refundPercentagePartial: number; // e.g. 50% partial refund
  daysBeforePartialRefund: number; // e.g. 14 days before start
  forceMajeureCovered: boolean; // NA/Erasmus+ grant or travel cancellation protection
  policyDetailsTr?: string;
  policyDetailsEn?: string;
}

export interface HostAccessibilityFeatures {
  wheelchairAccessible: boolean;
  specialDiet: boolean;
  visualAid?: boolean;
  hearingAid?: boolean;
  accessibilityDetailsTr?: string;
  accessibilityDetailsEn?: string;
}

export interface FiveDimensionalReviewMetrics {
  responseTime: number;      // 1.0 - 5.0 (Yanıt Süresi)
  communication: number;     // 1.0 - 5.0 (İletişim)
  serviceDelivery: number;   // 1.0 - 5.0 (Hizmet Tamamlama)
  programmeAlignment: number;// 1.0 - 5.0 (Program Uygunluğu)
  problemSolving: number;    // 1.0 - 5.0 (Sorun Çözme)
}

export interface HostReviewItem {
  id: string;
  hostId: string;
  schoolName: string;
  schoolOid?: string | null;
  projectType: string;
  mobilityYear: number;
  overallScore: number;
  metrics: FiveDimensionalReviewMetrics;
  comment: string;
  verifiedMobility: boolean;
  createdAt: string;
}

export interface HostReviewsBreakdownResponse {
  hostId: string;
  hostName: string;
  totalReviews: number;
  overallAverage: number;
  metricAverages: FiveDimensionalReviewMetrics;
  reviews: HostReviewItem[];
}

export interface CreateHostReviewDto {
  schoolName: string;
  schoolOid?: string;
  projectType?: 'KA121' | 'KA122' | 'OTHER';
  mobilityYear?: number;
  metrics: FiveDimensionalReviewMetrics;
  comment?: string;
}





