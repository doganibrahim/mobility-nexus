/**
 * Erasmus+ KA121 & KA122 VET Başvuru Taslağı Veri Modeli ve Soru Şeması
 * Resmi Form Karar Matrisleri esas alınarak hızlı giriş (fast-input) tipinde tasarlanmıştır.
 */

export type FormType = 'KA121' | 'KA122';

export interface ApplicationDraftContext {
  formType: FormType;
  // CTX-01 / ORG-01
  applicantName: string;
  applicantOid: string;
  applicantCity: string;
  // CTX-02 / CTX-03
  projectTitle: string;
  projectAcronym: string;
  projectTitleEn?: string;
  // CTX-04 / CTX-05
  projectStartDate: string;
  projectDurationMonths: number; // KA122: 6 - 24 ay
  // CTX-07 / ORG-02
  applicationLanguage: 'tr' | 'en' | 'de' | 'fr';
  // KA121 ORG-03
  accreditationCode?: string;
  // KA122 CTX-06
  pastKa122Count: number; // 0, 1, 2
}

export interface ApplicationDraftOrgProfile {
  // ORG-01
  mainActivityType: 'VET_SCHOOL' | 'VET_PROVIDER' | 'COMPANY' | 'OTHER';
  // ORG-02
  vetProgramTypes: string[]; // e.g. ['Anadolu Meslek Programı (AMP)', 'Ustalık/Kalfalık (MEM)', 'Meslek Yüksekokulu']
  // ORG-03
  learnerProfileSummary: string; // e.g. '15-18 yaş bilişim/otomasyon öğrencileri'
  // ORG-04
  hasFewerOpportunitiesLearners: boolean;
  fewerOpportunitiesPercentage?: number; // %
  // ORG-05
  yearsOfVetExperience: number;
  // ORG-06, 07, 08
  totalVetLearnersCount: number;
  teachingStaffCount: number;
  nonTeachingStaffCount: number;
  // SUP-01, 02, 03
  hasSupportingOrg: boolean;
  supportingOrgName?: string;
  supportingOrgOid?: string;
  supportingOrgTasks?: string[]; // e.g. ['Lojistik ve Transfer', 'Konaklama Organizasyonu', 'Kültürel Rehberlik']
}

export interface ApplicationDraftNeedItem {
  id: string;
  title: string; // e.g. 'Endüstriyel PLC & Robotik Atölye Yetersizliği'
  evidence: string; // e.g. 'Okul-sanayi danışma kurulu anket sonuçları ve yerel sanayi raporu'
  targetGroup: string; // e.g. '11. ve 12. sınıf otomasyon öğrencileri ve meslek öğretmenleri'
}

export interface ApplicationDraftObjectiveItem {
  id: string;
  needIdRef?: string;
  title: string; // e.g. 'Öğrencilerin Endüstri 4.0 PLC Uygulama Becerilerini %40 Artırmak'
  targetIndicator: string; // e.g. 'Europass Hareketlilik Belgesi ve pratik sınav başarı notu'
  measurementTool: string; // e.g. 'İşletme mentoru değerlendirme formu ve beceri kontrol listesi'
}

export interface DurationGroup {
  id: string;
  participantCount: number;
  durationDays: number;
}

export interface ApplicationDraftActivityDetails {
  // ACT-01, 02
  activityType: 'VET_SHORT_TERM' | 'VET_LONG_TERM' | 'JOB_SHADOWING' | 'TEACHING_ASSIGNMENT';
  activityGoalSummary: string;
  contributedObjectiveId?: string; // KA122 ACT-03
  // ACT-04, 05, 06
  targetCountries: string[];
  hostKnown: boolean;
  hostName?: string;
  hostCountry?: string;
  // ACT-06, 07, 08, 09
  totalParticipants: number;
  standardDurationDays: number;
  allSameDuration: boolean;
  durationGroups?: DurationGroup[];
  // ACT-10, TRV-01, 02, 03
  includeTravelDays: boolean;
  travelDaysPerPerson: number; // 0, 1, 2, 3, 4
  greenTravelParticipantsCount: number;
  mainTravelMode: 'FLIGHT' | 'BUS' | 'TRAIN' | 'CARPOOL' | 'MIXED';
  // ACC-01, 02, 03, 04, 05
  accompanyingRequired: boolean;
  accompanyingCount: number;
  accompanyingDays: number;
  accompanyingReason: 'UNDERAGE' | 'SPECIAL_NEEDS' | 'SAFETY_LOGISTICS' | 'OTHER';
  accompanyingFullDuration: boolean;
  // BLD-01, 02, 03
  hasBlendedMobility: boolean;
  blendedParticipantsCount?: number;
  blendedVirtualActivities?: string;
  // INC-01 ~ 06
  hasInclusionSupport: boolean;
  inclusionCount?: number;
  inclusionCategories?: string[]; // ['Ekonomik Engeller', 'Coğrafi Engeller', 'Sosyal Engeller', 'Engellilik / Özel İhtiyaç']
  inclusionSupportType?: 'UNIT_COST' | 'REAL_COST';
  inclusionReasonNotes?: string;
  // EXC-01 ~ 04
  hasExceptionalCosts: boolean;
  exceptionalCostType?: 'VISA_RESIDENCE' | 'FINANCIAL_GUARANTEE' | 'EXPENSIVE_TRAVEL';
  exceptionalCostAmountEur?: number;
  exceptionalCostJustification?: string;
  // PRE-01 ~ 03
  hasPreparatoryVisit: boolean;
  preparatoryVisitPersons?: number;
  preparatoryVisitDays?: number;
  preparatoryVisitJustification?: string;
  // BUD-01, 02 (KA122)
  hasCourseFees: boolean;
  courseFeesEur?: number;
  linguisticSupportMode?: 'OLS' | 'EXTRA_FUNDING' | 'NONE';
}

export interface ApplicationDraftQualityTeam {
  // QLT-01 ~ 04 (Erasmus Kalite İlkeleri)
  inclusionApproach: string; // Kapsayıcılık yaklaşımı
  greenPractices: string; // Yeşil ve sürdürülebilirlik uygulaması
  digitalToolsUsage: string; // Dijital araçlar ve platformlar
  democraticParticipation: string; // Katılımcıların aktif katılımı
  // TEAM-01 ~ 07
  legalRepresentativeName: string;
  legalRepresentativeRole: string;
  legalRepresentativeEmail: string;
  coordinatorName: string;
  coordinatorRole: string;
  coordinatorEmail: string;
  selectionCriteriaSummary: string; // Şeffaf seçim kriterleri
  preparationPlanSummary: string; // Pedagojik, dilsel ve kültürel hazırlık
  recognitionMethod: 'EUROPASS_MOBILITY' | 'INSTITUTIONAL_CERTIFICATE' | 'BOTH';
  monitoringMentorshipPlan: string; // İzleme ve mentorluk
  emergencyCrisisProtocol: string; // Acil durum ve kriz protokolü
  // INT-01 (Kurumsallaşma)
  institutionalIntegrationPlan: string; // Okul müfredatına ve eğitimine entegrasyon
  // DIS-01 ~ 03 (Yaygınlaştırma)
  internalDissemination: string; // Kurum içi paylaşım
  externalDissemination: string; // Dış paydaşlar ve sektör toplantıları
  euVisibilityMeasures: string; // AB logosu, web sitesi, sosyal medya görünürlüğü
  // TOP-01 (Öncelikli Konular max 3)
  priorityTopics: string[];
}

export interface ApplicationDraftDeclarations {
  // FIN-01 ~ 06 & DEC-01 ~ 04
  confirmAccreditationOrPlan: boolean; // Akreditasyon veya KA122 kurallarına uygunluk onayı
  confirmAbsorptionCapacity: boolean; // Kurumsal kapasite ve katılımcı yönetimi teyidi
  confirmErasmusQualityStandards: boolean; // Erasmus Kalite Standartlarına tam bağlılık
  confirmNoConflictOfInterest: boolean; // Çıkar çatışması bulunmadığı beyanı
  confirmNoDoubleFunding: boolean; // Çifte finansman olmadığı beyanı
  confirmDeclarationOnHonour: boolean; // Resmi Doğruluk Beyanı (Declaration on Honour)
}

export interface GeneratedQuestionAnswer {
  id: string;
  category: string;
  categoryEn?: string;
  categoryKey: 'context_needs' | 'activities_logistics' | 'priorities' | 'quality_followup';
  code: string;
  question: string;
  questionEn?: string;
  evaluatorCriteria?: string;
  answer: string;
  charLimit: number;
  lastGeneratedAt?: string;
}

export interface ApplicationDraftState {
  formType: FormType;
  lastUpdated: string;
  isDraftCompleted: boolean;
  context: ApplicationDraftContext;
  orgProfile: ApplicationDraftOrgProfile;
  needs: ApplicationDraftNeedItem[];
  objectives: ApplicationDraftObjectiveItem[];
  activityDetails: ApplicationDraftActivityDetails;
  qualityTeam: ApplicationDraftQualityTeam;
  declarations: ApplicationDraftDeclarations;
  generatedAnswers?: GeneratedQuestionAnswer[];
  ka120ImportedFields?: Record<string, boolean>;
}

export interface Ka120ExtractedData {
  isRecognizedKa120: boolean;
  unrecognizedReason?: string;
  applicantName?: string;
  applicantOid?: string;
  applicantCity?: string;
  accreditationCode?: string;
  projectTitle?: string;
  projectAcronym?: string;
  mainActivityType?: 'VET_SCHOOL' | 'VET_PROVIDER' | 'COMPANY' | 'OTHER';
  yearsOfVetExperience?: number;
  learnerProfileSummary?: string;
  totalVetLearnersCount?: number;
  teachingStaffCount?: number;
  nonTeachingStaffCount?: number;
  needs?: Array<{
    id?: string;
    title: string;
    evidence?: string;
    targetGroup?: string;
  }>;
  objectives?: Array<{
    id?: string;
    title: string;
    targetIndicator?: string;
    measurementTool?: string;
  }>;
  qualityTeam?: {
    inclusionApproach?: string;
    greenPractices?: string;
    digitalToolsUsage?: string;
    democraticParticipation?: string;
    selectionCriteriaSummary?: string;
    preparationPlanSummary?: string;
    monitoringMentorshipPlan?: string;
    institutionalIntegrationPlan?: string;
    internalDissemination?: string;
    externalDissemination?: string;
    euVisibilityMeasures?: string;
    legalRepresentativeName?: string;
    legalRepresentativeRole?: string;
    legalRepresentativeEmail?: string;
    coordinatorName?: string;
    coordinatorRole?: string;
    coordinatorEmail?: string;
    priorityTopics?: string[];
  };
}

export const PRIORITY_TOPIC_OPTIONS = [
  'Mesleki Eğitimde Dijital Beceriler ve Endüstri 4.0',
  'Yeşil Beceriler ve Sürdürülebilir Kalkınma',
  'Kapsayıcılık, Çeşitlilik ve Fırsat Eşitliği',
  'İş Temelli Öğrenme ve Okul-Sektör İşbirliği',
  'Yabancı Dil Yetkinliği ve Kültürlerarası Diyalog',
  'Erken Okul Terkini Önleme ve Rehberlik',
  'Mesleki Mükemmeliyet ve Yenilikçi Pedagoji',
];

export const VET_PROGRAM_OPTIONS = [
  'Anadolu Meslek Programı (AMP)',
  'Anadolu Teknik Programı (ATP)',
  'Mesleki Eğitim Merkezi Programı (MEMP - Çıraklık/Kalfalık)',
  'Özel Mesleki Eğitim / Özel Gereksinimli Öğreniciler',
  'Meslek Yüksekokulu Ön Lisans Programı',
  'Yetişkin Sürekli Mesleki Eğitim ve Sertifikasyon',
];

export const SUPPORTING_ORG_TASK_OPTIONS = [
  'Seyahat, Transfer ve Lojistik Düzenlemeleri',
  'Konaklama ve Güvenli Yaşam Şartlarının Sağlanması',
  'Kültürel Oryantasyon ve Rehberlik Hizmetleri',
  'İşletme ve Atölye Eşleştirmesi',
  'Yerel İdari ve Yasal Süreç Desteği',
];

export const INCLUSION_CATEGORY_OPTIONS = [
  'Ekonomik Engeller (Düşük gelir, burs ihtiyacı)',
  'Coğrafi Engeller (Kırsal veya dezavantajlı bölge)',
  'Engellilik ve Özel Eğitim İhtiyacı',
  'Sosyal ve Kültürel Engeller (Göçmen, koruma altında)',
  'Eğitimsel Güçlükler (Öğrenme güçlüğü)',
];

export const DEFAULT_DRAFT_STATE: ApplicationDraftState = {
  formType: 'KA122',
  lastUpdated: new Date().toISOString(),
  isDraftCompleted: false,
  context: {
    formType: 'KA122',
    applicantName: '',
    applicantOid: '',
    applicantCity: '',
    projectTitle: '',
    projectAcronym: '',
    projectTitleEn: '',
    projectStartDate: '2026-10-01',
    projectDurationMonths: 12,
    applicationLanguage: 'en',
    pastKa122Count: 0,
    accreditationCode: '',
  },
  orgProfile: {
    mainActivityType: 'VET_SCHOOL',
    vetProgramTypes: ['Anadolu Meslek Programı (AMP)'],
    learnerProfileSummary: '',
    hasFewerOpportunitiesLearners: false,
    fewerOpportunitiesPercentage: 0,
    yearsOfVetExperience: 10,
    totalVetLearnersCount: 450,
    teachingStaffCount: 35,
    nonTeachingStaffCount: 8,
    hasSupportingOrg: false,
    supportingOrgTasks: [],
  },
  needs: [
    {
      id: 'need-1',
      title: '',
      evidence: '',
      targetGroup: '',
    },
  ],
  objectives: [
    {
      id: 'obj-1',
      needIdRef: 'need-1',
      title: '',
      targetIndicator: '',
      measurementTool: '',
    },
  ],
  activityDetails: {
    activityType: 'VET_SHORT_TERM',
    activityGoalSummary: '',
    targetCountries: ['DE'],
    hostKnown: true,
    hostName: '',
    hostCountry: 'DE',
    totalParticipants: 5,
    standardDurationDays: 14,
    allSameDuration: true,
    durationGroups: [],
    includeTravelDays: true,
    travelDaysPerPerson: 2,
    greenTravelParticipantsCount: 0,
    mainTravelMode: 'FLIGHT',
    accompanyingRequired: false,
    accompanyingCount: 0,
    accompanyingDays: 14,
    accompanyingReason: 'UNDERAGE',
    accompanyingFullDuration: true,
    hasBlendedMobility: false,
    blendedParticipantsCount: 0,
    blendedVirtualActivities: '',
    hasInclusionSupport: false,
    inclusionCount: 0,
    inclusionCategories: [],
    inclusionSupportType: 'UNIT_COST',
    inclusionReasonNotes: '',
    hasExceptionalCosts: false,
    exceptionalCostType: 'VISA_RESIDENCE',
    exceptionalCostAmountEur: 0,
    exceptionalCostJustification: '',
    hasPreparatoryVisit: false,
    preparatoryVisitPersons: 0,
    preparatoryVisitDays: 3,
    preparatoryVisitJustification: '',
    hasCourseFees: false,
    courseFeesEur: 0,
    linguisticSupportMode: 'OLS',
  },
  qualityTeam: {
    inclusionApproach: 'Tüm katılımcı adaylarına eşit fırsat sunulacak, şeffaf objektif puanlama ile seçim yapılacaktır.',
    greenPractices: 'Dijital dokümantasyon, atık azaltımı ve mümkün olan hatlarda çevre dostu ulaşım teşvik edilecektir.',
    digitalToolsUsage: 'Ön hazırlık ve iletişimde Erasmus+ OLS, Europass ve çevrim içi toplantı platformları kullanılacaktır.',
    democraticParticipation: 'Katılımcıların proje karar süreçlerinde aktif rol almaları ve AB yurttaşlığı bilinci desteklenecektir.',
    legalRepresentativeName: '',
    legalRepresentativeRole: 'Okul Müdürü',
    legalRepresentativeEmail: '',
    coordinatorName: '',
    coordinatorRole: 'Proje Koordinatörü / İngilizce Öğretmeni',
    coordinatorEmail: '',
    selectionCriteriaSummary: 'Akademik başarı (%30), Mesleki motivasyon (%30), Dil düzeyi (%20), Mülakat (%20).',
    preparationPlanSummary: '20 saat mesleki terimler yabancı dil eğitimi, 10 saat kültürel oryantasyon ve iş güvenliği eğitimi.',
    recognitionMethod: 'EUROPASS_MOBILITY',
    monitoringMentorshipPlan: 'Ev sahibi işletme mentoru ile haftalık değerlendirme oturumu ve refakatçi öğretmen takibi.',
    emergencyCrisisProtocol: '24/7 acil iletişim hattı, seyahat sağlık sigortası ve konsolosluk acil durum bildirimi.',
    institutionalIntegrationPlan: 'Hareketlilik çıktılarının zümre öğretmenler kurulu ile okul müfredatına ve atölye planlarına aktarımı.',
    internalDissemination: 'Okul genelinde bilgilendirme panosu, Erasmus Günleri (ErasmusDays) sunumu ve deneyim paylaşım atölyesi.',
    externalDissemination: 'İlçe MEM, yerel sanayi odası ve kardeş okulların katılımıyla proje sonuç çalıştayı düzenlenmesi.',
    euVisibilityMeasures: 'Okul web sitesi, sosyal medya hesapları ve basın bültenlerinde AB ve Erasmus+ logosu ile görünürlük.',
    priorityTopics: ['Mesleki Eğitimde Dijital Beceriler ve Endüstri 4.0'],
  },
  declarations: {
    confirmAccreditationOrPlan: true,
    confirmAbsorptionCapacity: true,
    confirmErasmusQualityStandards: true,
    confirmNoConflictOfInterest: true,
    confirmNoDoubleFunding: true,
    confirmDeclarationOnHonour: true,
  },
  ka120ImportedFields: {},
};

/**
 * Calculates completion percentage of the draft based on form type
 */
export function calculateDraftCompletion(draft: ApplicationDraftState): {
  overallPercentage: number;
  sectionPercentages: Record<string, number>;
} {
  const isKa121 = draft.formType === 'KA121';

  // 1. Context Section
  let contextScore = 0;
  const contextTotal = isKa121 ? 3 : 5;
  if (draft.context.applicantName) contextScore++;
  if (draft.context.applicantOid) contextScore++;
  if (isKa121) {
    if (draft.context.accreditationCode) contextScore++;
  } else {
    if (draft.context.projectTitle) contextScore++;
    if (draft.context.projectStartDate) contextScore++;
    if (draft.context.projectDurationMonths > 0) contextScore++;
  }
  const contextPct = Math.round((contextScore / contextTotal) * 100);

  // 2. Org Profile (KA122 only)
  let orgPct = 100;
  if (!isKa121) {
    let orgScore = 0;
    const orgTotal = 6;
    if (draft.orgProfile.mainActivityType) orgScore++;
    if (draft.orgProfile.vetProgramTypes.length > 0) orgScore++;
    if (draft.orgProfile.learnerProfileSummary) orgScore++;
    if (draft.orgProfile.yearsOfVetExperience > 0) orgScore++;
    if (draft.orgProfile.totalVetLearnersCount > 0) orgScore++;
    if (draft.orgProfile.teachingStaffCount > 0) orgScore++;
    orgPct = Math.round((orgScore / orgTotal) * 100);
  }

  // 3. Needs & Objectives (KA122 only)
  let needsPct = 100;
  if (!isKa121) {
    let needsScore = 0;
    const needsTotal = 4;
    if (draft.needs[0]?.title) needsScore++;
    if (draft.needs[0]?.evidence) needsScore++;
    if (draft.objectives[0]?.title) needsScore++;
    if (draft.objectives[0]?.targetIndicator) needsScore++;
    needsPct = Math.round((needsScore / needsTotal) * 100);
  }

  // 4. Activity Details
  let actScore = 0;
  const actTotal = 6;
  if (draft.activityDetails.activityType) actScore++;
  if (draft.activityDetails.targetCountries.length > 0) actScore++;
  if (draft.activityDetails.totalParticipants > 0) actScore++;
  if (draft.activityDetails.standardDurationDays > 0) actScore++;
  if (draft.activityDetails.mainTravelMode) actScore++;
  if (!draft.activityDetails.accompanyingRequired || draft.activityDetails.accompanyingCount > 0) actScore++;
  const actPct = Math.round((actScore / actTotal) * 100);

  // 5. Quality & Team (KA122 only)
  let qualityPct = 100;
  if (!isKa121) {
    let qScore = 0;
    const qTotal = 6;
    if (draft.qualityTeam.legalRepresentativeName) qScore++;
    if (draft.qualityTeam.coordinatorName) qScore++;
    if (draft.qualityTeam.selectionCriteriaSummary) qScore++;
    if (draft.qualityTeam.preparationPlanSummary) qScore++;
    if (draft.qualityTeam.internalDissemination) qScore++;
    if (draft.qualityTeam.priorityTopics.length > 0) qScore++;
    qualityPct = Math.round((qScore / qTotal) * 100);
  }

  // 6. Declarations
  let decScore = 0;
  const decTotal = 6;
  if (draft.declarations.confirmAccreditationOrPlan) decScore++;
  if (draft.declarations.confirmAbsorptionCapacity) decScore++;
  if (draft.declarations.confirmErasmusQualityStandards) decScore++;
  if (draft.declarations.confirmNoConflictOfInterest) decScore++;
  if (draft.declarations.confirmNoDoubleFunding) decScore++;
  if (draft.declarations.confirmDeclarationOnHonour) decScore++;
  const decPct = Math.round((decScore / decTotal) * 100);

  const overall = isKa121
    ? Math.round((contextPct + actPct + decPct) / 3)
    : Math.round((contextPct + orgPct + needsPct + actPct + qualityPct + decPct) / 6);

  return {
    overallPercentage: overall,
    sectionPercentages: {
      context: contextPct,
      orgProfile: orgPct,
      needsObjectives: needsPct,
      activityDetails: actPct,
      qualityTeam: qualityPct,
      declarations: decPct,
    },
  };
}

export const DEFAULT_OFFICIAL_QUESTIONS_KA122: GeneratedQuestionAnswer[] = [
  // Bölüm 1: Kurumsal Bilgiler ve İhtiyaçlar (Context & Needs)
  {
    id: 'q-bg-01',
    category: '1. Kurumsal Bilgiler ve İhtiyaçlar',
    categoryEn: '1. Background & Institutional Profile',
    categoryKey: 'context_needs',
    code: 'ORG-BG-01',
    question: 'Kuruluşunuzun arka planı, mesleki eğitimdeki yeri ve hizmet verdiği öğrenici/personel profili nedir?',
    questionEn: 'Please introduce your organisation, its main activities, and the profile of your learners and staff in vocational education and training (VET).',
    evaluatorCriteria: 'Award Criterion 1: Relevance of the project (Max 30 pts) - Assesses whether the institutional profile is clearly defined, authentic, and possesses operational capacity for VET mobilities.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-nd-01',
    category: '1. Kurumsal Bilgiler ve İhtiyaçlar',
    categoryEn: '1. Background & Institutional Profile',
    categoryKey: 'context_needs',
    code: 'NEED-01',
    question: 'Kurumunuz bu projeyi neden başlatmak istiyor? Belirlenen temel kurumsal ihtiyaçlar ve gerekçeler nelerdir?',
    questionEn: 'What are the most important needs and challenges your organisation is facing, and why do you want to start this mobility project?',
    evaluatorCriteria: 'Award Criterion 1: Relevance of the project (Max 30 pts) - Evaluates whether needs are grounded in concrete institutional evidence rather than generic statements, and directly linked to local industry skill shortages.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-obj-01',
    category: '1. Kurumsal Bilgiler ve İhtiyaçlar',
    categoryEn: '1. Background & Institutional Profile',
    categoryKey: 'context_needs',
    code: 'OBJ-01',
    question: 'Proje hedefleriniz nelerdir ve bu hedefler okulun kurumsal gelişimine nasıl katkı sağlayacaktır?',
    questionEn: 'What are the specific objectives you want to achieve through this project and how will they contribute to your organisation’s long-term development?',
    evaluatorCriteria: 'Award Criteria 1 & 2: Relevance & Project Design (Max 40 pts) - Verifies that objectives are SMART (Specific, Measurable, Achievable, Relevant, Time-bound) and directly address the identified needs.',
    answer: '',
    charLimit: 3000,
  },
  // Bölüm 2: Faaliyetler ve Katılımcılar (Activities & Participants)
  {
    id: 'q-act-01',
    category: '2. Faaliyetler ve Katılımcılar',
    categoryEn: '2. Activities & Participants',
    categoryKey: 'activities_logistics',
    code: 'ACT-01',
    question: 'Planlanan hareketlilik faaliyeti katılımcıların mesleki becerilerine ve öğrenme çıktılarına nasıl katkı sağlayacaktır?',
    questionEn: 'How will the proposed mobility activities contribute to the achievement of your project objectives and participants’ learning outcomes?',
    evaluatorCriteria: 'Award Criterion 2: Quality of project design and implementation (Max 40 pts) - Checks if learning outcomes are structured in terms of Knowledge, Skills, and Responsibility/Autonomy (ECVET/EQF principles).',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-sel-01',
    category: '2. Faaliyetler ve Katılımcılar',
    categoryEn: '2. Activities & Participants',
    categoryKey: 'activities_logistics',
    code: 'SEL-01',
    question: 'Katılımcıların seçimi hangi şeffaf, adil ve kapsayıcı kriterlere göre gerçekleştirilecektir?',
    questionEn: 'How will you select the participants for the mobility activities? Describe the selection procedure, criteria, and equal opportunity measures.',
    evaluatorCriteria: 'Award Criterion 2: Quality of project design (Max 40 pts) - Requires transparent, clearly weighted scoring criteria (academic, motivation, language, interview), clear appeals mechanism, and equal opportunity quotas.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-prep-01',
    category: '2. Faaliyetler ve Katılımcılar',
    categoryEn: '2. Activities & Participants',
    categoryKey: 'activities_logistics',
    code: 'PREP-01',
    question: 'Hareketlilik öncesi pedagojik, dilsel, kültürel ve iş güvenliği (OHS) hazırlıkları nasıl planlanmıştır?',
    questionEn: 'How will you prepare the participants pedagogically, linguistically, culturally, and in terms of occupational health and safety (OHS) before departure?',
    evaluatorCriteria: 'Award Criterion 2: Quality of project design (Max 40 pts) - Must demonstrate a comprehensive 4-pillar preparation (technical briefings, OLS language support, intercultural orientation, and workplace OHS induction).',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-host-01',
    category: '2. Faaliyetler ve Katılımcılar',
    categoryEn: '2. Activities & Participants',
    categoryKey: 'activities_logistics',
    code: 'HOST-01',
    question: 'Ev sahibi kuruluşla işbirliği, mentörlük, konaklama ve refakat süreçleri nasıl yönetilecektir?',
    questionEn: 'How will you organise practical arrangements, workplace mentoring, monitoring, and daily cooperation with the hosting partner?',
    evaluatorCriteria: 'Award Criterion 2: Quality of project design (Max 40 pts) - Evaluates practical arrangements, designated workplace mentor supervision, daily learner tracking logbooks, and safe accommodation.',
    answer: '',
    charLimit: 3000,
  },
  // Bölüm 3: Erasmus+ Öncelikleri (Erasmus+ Horizontal Priorities)
  {
    id: 'q-pri-01',
    category: '3. Erasmus+ Öncelikleri',
    categoryEn: '3. Erasmus+ Priorities',
    categoryKey: 'priorities',
    code: 'PRI-INC-01',
    question: 'Kapsayıcılık ve Çeşitlilik ilkesi projede nasıl uygulanacaktır? İhtiyaç sahibi veya dezavantajlı katılımcılara hangi destekler sağlanacaktır?',
    questionEn: 'How will you address the Erasmus+ priority of Inclusion and Diversity? What specific support will be provided to participants with fewer opportunities?',
    evaluatorCriteria: 'Award Criteria 1 & 2: Relevance & Design - Assesses concrete measures to identify and include learners with fewer opportunities (economic, geographical, educational barriers) with dedicated financial/pedagogical support.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-pri-02',
    category: '3. Erasmus+ Öncelikleri',
    categoryEn: '3. Erasmus+ Priorities',
    categoryKey: 'priorities',
    code: 'PRI-GRN-DIG-01',
    question: 'Yeşil seyahat, çevresel sürdürülebilirlik ve dijital araçların kullanımı faaliyetlere nasıl entegre edilmiştir?',
    questionEn: 'How will you incorporate Green Practices (environmental sustainability, green travel) and Digital Tools into the project activities?',
    evaluatorCriteria: 'Award Criterion 2: Quality of project design (Max 40 pts) - Checks tangible environmental measures (low-carbon travel modes, paperless workflow) and effective use of EU digital tools (OLS, Europass, online collaboration).',
    answer: '',
    charLimit: 3000,
  },
  // Bölüm 4: Yaygınlaştırma ve Güvenlik (Quality, Dissemination & Safety)
  {
    id: 'q-rec-01',
    category: '4. Yaygınlaştırma ve Güvenlik',
    categoryEn: '4. Follow-up, Recognition & Safety',
    categoryKey: 'quality_followup',
    code: 'REC-01',
    question: 'Kazanımların tanınması (Europass Hareketlilik Belgesi) ve çıktıların okul müfredatına/atölyelerine aktarımı nasıl sağlanacaktır?',
    questionEn: 'How will the learning outcomes acquired by participants be validated and formally recognized (e.g., Europass Mobility), and how will they be integrated into your curriculum?',
    evaluatorCriteria: 'Award Criterion 3: Quality of follow-up actions (Max 30 pts) - Looks for formal validation through Europass Mobility, institutional certification, and systematic transfer into school workshop syllabi and teaching practices.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-dis-01',
    category: '4. Yaygınlaştırma ve Güvenlik',
    categoryEn: '4. Follow-up, Recognition & Safety',
    categoryKey: 'quality_followup',
    code: 'DIS-01',
    question: 'Proje sonuçlarının kurum içinde, yerel sektörde ve ulusal düzeyde yaygınlaştırılması (dissemination) için neler planlanmıştır?',
    questionEn: 'How will you disseminate the project results within your organisation, to local industry stakeholders, and at regional/national levels?',
    evaluatorCriteria: 'Award Criterion 3: Quality of follow-up actions (Max 30 pts) - Multi-tiered dissemination plan targeting internal peers, regional education directorates, local chambers of commerce/industry, Erasmus Days, and EPALE/EPRP.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-rsk-01',
    category: '4. Yaygınlaştırma ve Güvenlik',
    categoryEn: '4. Follow-up, Recognition & Safety',
    categoryKey: 'quality_followup',
    code: 'RSK-01',
    question: 'Acil durumlar, kriz yönetimi, sigorta ve katılımcı güvenliği nasıl güvence altına alınacaktır?',
    questionEn: 'How will participant safety, risk prevention, crisis management, and insurance coverage be ensured throughout the project lifecycle?',
    evaluatorCriteria: 'Award Criterion 2: Quality of project design (Max 40 pts) - Requires a robust crisis management protocol, 24/7 emergency response contacts, comprehensive travel and liability insurance, and clear consular registration.',
    answer: '',
    charLimit: 3000,
  },
];

export const DEFAULT_OFFICIAL_QUESTIONS_KA121: GeneratedQuestionAnswer[] = [
  {
    id: 'q-ka121-01',
    category: '1. Akreditasyon Hedefleri ve Uyum',
    categoryEn: '1. Erasmus Plan Objectives & Alignment',
    categoryKey: 'context_needs',
    code: 'KA121-TGT-01',
    question: 'Talep edilen faaliyetlerin onaylanmış Erasmus Planı hedefleriniz ve kurumsal gelişim öncelikleriniz ile ilişkisi nedir?',
    questionEn: 'How do the requested mobility activities contribute to the specific targets and strategic priorities set in your approved Erasmus Plan?',
    evaluatorCriteria: 'Accreditation Review Criterion: Strategic coherence with approved multi-year Erasmus Plan targets and demonstrable institutional progression.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-ka121-02',
    category: '2. Faaliyet Dağılımı ve Katılımcılar',
    categoryEn: '2. Activity Distribution & Participants',
    categoryKey: 'activities_logistics',
    code: 'KA121-ACT-01',
    question: 'Bu dönem için talep edilen katılımcı sayıları, faaliyet türleri, hedef ülkeler ve sürelerin gerekçesi nedir?',
    questionEn: 'What is the rationale for the requested participant numbers, activity types, target countries, and duration in this grant allocation period?',
    evaluatorCriteria: 'Accreditation Review Criterion: Proportionality, absorption capacity, and realistic alignment between requested numbers and host workplace capacities.',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-ka121-03',
    category: '3. Erasmus+ Standartları ve Öncelikler',
    categoryEn: '3. Erasmus Quality Standards & Priorities',
    categoryKey: 'priorities',
    code: 'KA121-STD-01',
    question: 'Erasmus Kalite Standartları (kapsayıcılık, yeşil uygulamalar, şeffaf seçim, öğrenici güvenliği ve mentörlük) nasıl garanti altına alınmaktadır?',
    questionEn: 'How will you guarantee full adherence to the Erasmus Quality Standards across participant selection, mentoring, safety, and inclusion?',
    evaluatorCriteria: 'Accreditation Review Criterion: Rigorous compliance with core Erasmus Quality Standards (transparent selection, workplace mentoring, inclusion support, green & digital practices).',
    answer: '',
    charLimit: 3000,
  },
  {
    id: 'q-ka121-04',
    category: '4. Kurumsal Entegrasyon ve Yaygınlaştırma',
    categoryEn: '4. Curriculum Integration & Dissemination',
    categoryKey: 'quality_followup',
    code: 'KA121-INT-01',
    question: 'Hareketlilik çıktılarının okul müfredatına aktarımı ve kurumsal yaygınlaştırma faaliyetleri nasıl organize edilecektir?',
    questionEn: 'How will the acquired competences be integrated into your school curriculum and how will institutional dissemination be organised?',
    evaluatorCriteria: 'Accreditation Review Criterion: Long-term curriculum enhancement in vocational workshops, Europass validation, and regional dissemination footprint.',
    answer: '',
    charLimit: 3000,
  },
];

