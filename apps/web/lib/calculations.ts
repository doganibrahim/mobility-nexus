/**
 * ErasmusMobility - Core Calculation Engine & Algorithms
 */

import {
  ASSESSMENT_QUESTIONS,
  HOST_METRIC_CONFIG,
  OFFICIAL_VET_ACTIVITIES,
  VET_FIELDS,
} from './constants';
import {
  DecisionResult,
  Ka122EligibilityCheckItem,
  Ka122EligibilityResult,
  Ka122EligibilityState,
  MobilityGoal,
  ParticipantType,
} from '@mobility-nexus/types';

export interface AssessmentResult {
  score: number;
  totalQuestions: number;
  answeredCount: number;
  missingQuestions: number[];
  readinessText: string;
  readinessType: 'good' | 'warn' | 'bad';
  gap: number;
}

export interface HostScoreResult {
  score: number;
  label: string;
  level: 'good' | 'warn' | 'bad';
}

export interface DecisionEngineResult {
  score: number;
  action:
    | 'KA121-VET'
    | 'KA122-VET'
    | 'KA120-VET Erasmus Accreditation Recommended'
    | 'Akreditasyon durumu doğrulanmalı';
  readiness: string;
  level: 'good' | 'warn' | 'bad';
  rationale: string;
}

export interface LearningOutcomesResult {
  technicalOutcome: string;
  transversalOutcome: string;
}

/**
 * Validates planned activity duration against official Erasmus+ rules
 */
export function validateActivityDuration(
  goal: string,
  days: number,
  locale: 'tr' | 'en' = 'tr',
): {
  isValid: boolean;
  minDays: number;
  maxDays: number;
  warning?: string;
  rule: string;
} {
  const config = OFFICIAL_VET_ACTIVITIES[goal];
  if (!config) {
    return {
      isValid: true,
      minDays: 1,
      maxDays: 365,
      rule: locale === 'en' ? 'Standard Erasmus+ rule' : 'Standart Erasmus+ kuralı',
    };
  }

  const { minDays, maxDays, ruleDescriptionTr, ruleDescriptionEn } = config;
  const activeRule = locale === 'en' ? ruleDescriptionEn : ruleDescriptionTr;

  if (days <= 0) {
    return {
      isValid: true,
      minDays,
      maxDays,
      rule: activeRule,
    };
  }

  if (days < minDays) {
    return {
      isValid: false,
      minDays,
      maxDays,
      warning:
        locale === 'en'
          ? `Selected duration (${days} days) is below the official Erasmus+ minimum duration (${minDays} days).`
          : `Seçilen süre (${days} gün), bu faaliyet için Erasmus+ asgari süresinden (${minDays} gün) düşüktür.`,
      rule: activeRule,
    };
  }

  if (days > maxDays) {
    return {
      isValid: false,
      minDays,
      maxDays,
      warning:
        locale === 'en'
          ? `Selected duration (${days} days) exceeds the official Erasmus+ maximum duration (${maxDays} days).`
          : `Seçilen süre (${days} gün), bu faaliyet için Erasmus+ azami süresini (${maxDays} gün) aşmaktadır.`,
      rule: activeRule,
    };
  }

  return {
    isValid: true,
    minDays,
    maxDays,
    rule: activeRule,
  };
}

/**
 * 1. Scores the 12-question competence assessment (1-5 scale)
 */
export function scoreAssessment(
  answers: Record<number, number>,
  targetScore = 80,
): AssessmentResult {
  const missingQuestions: number[] = [];
  let totalPoints = 0;
  let answeredCount = 0;

  ASSESSMENT_QUESTIONS.forEach((q) => {
    const val = answers[q.id];
    if (val && val >= 1 && val <= 5) {
      totalPoints += val;
      answeredCount++;
    } else {
      missingQuestions.push(q.id);
    }
  });

  if (missingQuestions.length > 0) {
    return {
      score: 0,
      totalQuestions: ASSESSMENT_QUESTIONS.length,
      answeredCount,
      missingQuestions,
      readinessText: `Eksik Sorular: ${missingQuestions.join(', ')} numaralı soruları yanıtlayın.`,
      readinessType: 'warn',
      gap: targetScore,
    };
  }

  const score = Math.round((totalPoints / (ASSESSMENT_QUESTIONS.length * 5)) * 100);
  const gap = Math.max(0, targetScore - score);

  let readinessText = '';
  let readinessType: 'good' | 'warn' | 'bad' = 'good';

  if (score >= 80) {
    readinessText = 'Strong readiness (Yüksek Hazırlık Seviyesi)';
    readinessType = 'good';
  } else if (score >= 65) {
    readinessText = 'Good readiness (Yeterli Seviye)';
    readinessType = 'good';
  } else if (score >= 50) {
    readinessText = 'Preparation recommended (Ön Hazırlık Önerilir)';
    readinessType = 'warn';
  } else {
    readinessText = 'Additional preparation strongly recommended (Kapsamlı Destek Gereklidir)';
    readinessType = 'bad';
  }

  return {
    score,
    totalQuestions: ASSESSMENT_QUESTIONS.length,
    answeredCount,
    missingQuestions: [],
    readinessText,
    readinessType,
    gap,
  };
}

/**
 * 2. Scores the Host Organization using 10 weighted metrics (h1-h10)
 */
export function scoreHost(metrics: Record<string, number>): HostScoreResult {
  let weightedSum = 0;

  HOST_METRIC_CONFIG.forEach((m) => {
    const val = Math.max(0, Math.min(100, metrics[m.id] ?? m.defaultVal));
    weightedSum += (val * m.weight) / 100;
  });

  const score = Math.round(weightedSum);

  let label = 'Weak match';
  let level: 'good' | 'warn' | 'bad' = 'bad';

  if (score >= 85) {
    label = 'Excellent host (Mükemmel Eşleşme)';
    level = 'good';
  } else if (score >= 70) {
    label = 'Suitable host (Uygun Kuruluş)';
    level = 'good';
  } else if (score >= 55) {
    label = 'Conditional shortlist (Şartlı Kısa Liste)';
    level = 'warn';
  } else {
    label = 'Weak match (Yetersiz Uyum)';
    level = 'bad';
  }

  return { score, label, level };
}

/**
 * KA122-VET Pre-Application Eligibility Gatekeeper
 * Evaluates accreditation, participant cap (30), project duration (6-18 months),
 * and past grants within 36 months (max 3).
 */
export function checkKa122Eligibility(
  params: Ka122EligibilityState,
): Ka122EligibilityResult {
  const checks: Ka122EligibilityCheckItem[] = [];

  // Check 1: Accreditation status
  if (params.accredited === 'yes') {
    checks.push({
      id: 'accreditation',
      title: 'Akreditasyon Durumu',
      passed: false,
      status: 'recommend_ka121',
      message:
        'Kurumunuz zaten Erasmus Akreditasyonuna (KA120) sahiptir. KA122 başvurusu yapamazsınız; garantili yıllık bütçe tahsisatı için doğrudan KA121-VET başvurusunda bulunmalısınız.',
    });
  } else if (params.accredited === 'unknown') {
    checks.push({
      id: 'accreditation',
      title: 'Akreditasyon Durumu',
      passed: true,
      status: 'warning',
      message:
        'Akreditasyon durumu teyit edilmemiştir. Akredite değilseniz KA122 uygundur.',
    });
  } else {
    checks.push({
      id: 'accreditation',
      title: 'Akreditasyon Durumu',
      passed: true,
      status: 'eligible',
      message:
        'Kurumun akreditasyonu bulunmamaktadır. KA122 kısa dönemli hareketlilik için uygundur.',
    });
  }

  // Check 2: Participant count limit (max 30 for KA122)
  const count = params.participantCount || 0;
  if (count > 30) {
    checks.push({
      id: 'participant_limit',
      title: 'Katılımcı Sınırı (Maks. 30)',
      passed: false,
      status: 'recommend_ka120',
      message: `Planlanan katılımcı sayısı (${count} kişi), KA122 azami kotası olan 30 kişiyi aşmaktadır. 30 üzeri katılımcı için KA120 Akreditasyonu veya konsorsiyum ortaklığı gereklidir.`,
    });
  } else {
    checks.push({
      id: 'participant_limit',
      title: 'Katılımcı Sınırı (Maks. 30)',
      passed: true,
      status: 'eligible',
      message: `Planlanan ${count} katılımcı, KA122 azami 30 kişi kuralına uygundur.`,
    });
  }

  // Check 3: Project duration (6 - 18 months for KA122)
  const duration = params.projectDurationMonths || 12;
  if (duration < 6 || duration > 18) {
    checks.push({
      id: 'project_duration',
      title: 'Proje Süresi (6–18 Ay)',
      passed: false,
      status: 'ineligible',
      message: `Belirtilen proje süresi (${duration} ay) kural dışıdır. Resmi Erasmus+ rehberine göre KA122-VET proje süresi 6 ile 18 ay arasında olmalıdır.`,
    });
  } else {
    checks.push({
      id: 'project_duration',
      title: 'Proje Süresi (6–18 Ay)',
      passed: true,
      status: 'eligible',
      message: `Proje süresi (${duration} ay), resmî 6 ila 18 ay uygunluk aralığındadır.`,
    });
  }

  // Check 4: Past grants in consecutive 36 months (max 3 grants for KA122)
  const pastGrants = params.pastKa122GrantsCount || 0;
  if (pastGrants >= 3) {
    checks.push({
      id: 'past_grants',
      title: 'Önceki Hibe Sayısı (36 Ayda Maks. 3)',
      passed: false,
      status: 'recommend_ka120',
      message: `Kurumunuz son 36 ayda azami 3 KA122 hibesi hakkına (${pastGrants} hibe) ulaşmıştır. Yeni KA122 başvurusu kural gereği elenir; doğrudan KA120 Akreditasyonu önerilir.`,
    });
  } else {
    checks.push({
      id: 'past_grants',
      title: 'Önceki Hibe Sayısı (36 Ayda Maks. 3)',
      passed: true,
      status: 'eligible',
      message: `Son 36 aydaki hibe sayısı (${pastGrants}), kural gereği 3 hakkı doldurmamıştır.`,
    });
  }

  // Check 5: Mobility Strategy
  if (params.mobilityStrategy === 'regular_annual') {
    checks.push({
      id: 'strategy',
      title: 'Hareketlilik Stratejisi',
      passed: true,
      status: 'recommend_ka120',
      message:
        'Kurumunuz her yıl düzenli ve garantili bütçeyle hareketlilik hedeflemektedir. Tek seferlik KA122 yerine KA120 Erasmus Akreditasyonu tavsiye edilir.',
    });
  } else {
    checks.push({
      id: 'strategy',
      title: 'Hareketlilik Stratejisi',
      passed: true,
      status: 'eligible',
      message: 'Kısa dönemli ve somut ihtiyaç odaklı proje yaklaşımı KA122 ile uyumludur.',
    });
  }

  // Determine overall recommendation
  if (params.accredited === 'yes') {
    return {
      isEligibleForKa122: false,
      recommendedPathway: 'KA121-VET',
      summaryTitle: 'KA121-VET Başvuru Yolu Önerilir',
      summaryMessage:
        'Kurumunuz akredite olduğundan KA122 yarışmalı teklif çağrısına katılamaz; garantili yıllık bütçe için KA121 tahsisatı kullanmalıdır.',
      checks,
    };
  }

  const hasKa120Drivers =
    params.mobilityStrategy === 'regular_annual' ||
    pastGrants >= 3 ||
    count > 30;

  if (hasKa120Drivers) {
    return {
      isEligibleForKa122: false,
      recommendedPathway: 'KA120-VET',
      summaryTitle: 'KA120-VET Erasmus Akreditasyonu Önerilir',
      summaryMessage:
        'Yıllık düzenli hareketlilik vizyonu, katılımcı sayısı kotası veya 36 aylık hibe limiti nedeniyle kurumunuz için en stratejik yol KA120-VET Akreditasyonudur.',
      checks,
    };
  }

  const hasIneligible = checks.some((c) => c.status === 'ineligible');
  if (hasIneligible) {
    return {
      isEligibleForKa122: false,
      recommendedPathway: 'NEEDS_VERIFICATION',
      summaryTitle: 'Uygunluk Kriteri Düzeltilmeli',
      summaryMessage:
        'Proje süresi veya temel kriterlerde Erasmus+ kurallarına aykırı parametreler bulunmaktadır.',
      checks,
    };
  }

  return {
    isEligibleForKa122: true,
    recommendedPathway: 'KA122-VET',
    summaryTitle: 'KA122-VET İçin Tam Uygunluk Sağlandı',
    summaryMessage:
      'Kurumunuz tüm KA122-VET uygunluk kontrollerini başarıyla geçmiştir.',
    checks,
  };
}

/**
 * 3. 8-Factor Decision Engine (KA121 vs KA122 vs KA120)
 */
export function makeDecision(params: {
  accredited: 'yes' | 'no' | 'unknown';
  institutionNeed: string;
  erasmusPlan: string;
  escoTerm: string;
  iscedCode: string;
  language: number;
  competenceScore: number | null;
  targetScore: number;
  hostScore: number | null;
  // Optional Eligibility Gatekeeper parameters
  participantCount?: number;
  projectDurationMonths?: number;
  pastKa122GrantsCount?: number;
  mobilityStrategy?: 'ad_hoc' | 'regular_annual';
}): DecisionEngineResult {
  const compScore = params.competenceScore ?? 65;
  const hScore = params.hostScore ?? 70;

  const needScore = params.institutionNeed.trim().length > 10 ? 85 : 55;
  const escoScore = params.escoTerm.trim() ? 90 : 40;
  const iscedScore = params.iscedCode.trim() ? 95 : 40;
  const langScore = Math.max(0, Math.min(100, params.language || 60));
  const inclusionScore = 75;
  const alignmentScore = params.erasmusPlan.trim()
    ? 90
    : params.accredited === 'no'
      ? 75
      : 45;

  const gap = Math.max(0, (params.targetScore || 80) - compScore);
  const gapPriority = Math.min(100, 50 + gap * 2);

  // 8 weighted criteria
  const score = Math.round(
    gapPriority * 0.25 +
      needScore * 0.2 +
      escoScore * 0.15 +
      iscedScore * 0.1 +
      hScore * 0.15 +
      langScore * 0.05 +
      inclusionScore * 0.05 +
      alignmentScore * 0.05,
  );

  let action:
    | 'KA121-VET'
    | 'KA122-VET'
    | 'KA120-VET Erasmus Accreditation Recommended'
    | 'Akreditasyon durumu doğrulanmalı' = 'Akreditasyon durumu doğrulanmalı';

  let rationale = '';

  if (params.accredited === 'yes') {
    action = 'KA121-VET';
    rationale =
      'Akredite okulda faaliyet mevcut Erasmus Plan hedeflerine bağlanmalı ve yıllık tahsisat (KA121) kapsamında yürütülmelidir.';
  } else if (params.accredited === 'unknown') {
    action = 'Akreditasyon durumu doğrulanmalı';
    rationale =
      'Kurumun OID ve Erasmus Akreditasyon durumu Ulusal Ajans nezdinde teyit edilmelidir.';
  } else {
    // accredited === 'no'
    const wantsRegular = params.mobilityStrategy === 'regular_annual';
    const hitCap = (params.pastKa122GrantsCount ?? 0) >= 3;
    const overParticipants = (params.participantCount ?? 0) > 30;

    if (wantsRegular || hitCap || overParticipants) {
      action = 'KA120-VET Erasmus Accreditation Recommended';
      rationale =
        'Kurumun düzenli/yıllık hareketlilik planı, 30 kişiyi aşan katılımcı talebi veya 36 aylık KA122 hibe kotasını doldurması nedeniyle, tek seferlik KA122 yerine kurumsal KA120-VET Erasmus Akreditasyonuna başvurması şiddetle tavsiye edilir.';
    } else {
      action = 'KA122-VET';
      rationale =
        'Akreditasyonu olmayan uygun VET kuruluşunda KA122 için ihtiyaç/challenge → hedef → faaliyet → etki ölçüm zinciri kurulmalıdır.';
    }
  }

  let readiness = 'Further preparation / needs review';
  let level: 'good' | 'warn' | 'bad' = 'bad';

  if (score >= 85) {
    readiness = 'Strongly Recommended (Kesinlikle Önerilir)';
    level = 'good';
  } else if (score >= 70) {
    readiness = 'Recommended (Önerilir)';
    level = 'good';
  } else if (score >= 55) {
    readiness = 'Recommended with Preparation (Ön Hazırlık ile Önerilir)';
    level = 'warn';
  } else if (score >= 40) {
    readiness = 'Preparation Before Mobility (Mobilite Öncesi Gelişim Gerektirir)';
    level = 'warn';
  }

  return { score, action, readiness, level, rationale };
}

/**
 * 4. Generates Role-Based Learning Outcomes
 */
export function generateOutcomes(
  participantType: ParticipantType,
  primaryGap: string,
  escoTerm: string,
): LearningOutcomesResult {
  const gap = primaryGap.trim() || escoTerm.trim() || 'belirlenen mesleki yetkinlik';

  let technicalOutcome = '';
  if (participantType === 'teacher' || participantType === 'staff') {
    technicalOutcome = `Mobilite sonunda teknik eğitici; ${gap} alanındaki güncel Avrupa iyi uygulamalarını ve endüstri standartlarını doğrudan gözlemleyebilecek, edindiği en az iki yenilikçi pedagojik/teknik yöntemi okulundaki atölye/laboratuvar ortamına entegre edebilecek ve sonuçları meslektaşlarıyla kurumsal yaygınlaştırma çalıştayında paylaşabilecektir.`;
  } else if (participantType === 'incoming') {
    technicalOutcome = `Faaliyet süresince kuruma gelen uzman / eğitici; ${gap} alanındaki ileri Avrupa bilgi birikimini ve endüstriyel standartları ev sahibi okulun öğretmen ve öğrencilerine doğrudan aktaracak, yerel müfredatı zenginleştirecek ortak eğitim materyalleri geliştirecektir.`;
  } else if (participantType === 'project_team') {
    technicalOutcome = `Hazırlık ziyareti sonunda proje ekibi; ev sahibi kurumla ${gap} odaklı pratik öğrenme anlaşmasını (Learning Agreement) detaylandıracak, katılımcıların işyeri güvenliği, mentorluk ve lojistik düzenlemelerini yerinde denetleyerek kalite taahhütlerini kesinleştirecektir.`;
  } else {
    // student / learner
    technicalOutcome = `Mobilite sonunda meslek lisesi öğrencisi; ${gap} ile ilgili tanımlanmış gerçek iş görevlerini ev sahibi kurumdaki mentor gözetiminde iş sağlığı ve güvenliği kurallarına uygun biçimde icra edebilecek, edindiği pratik becerileri kanıtlayan somut bir iş/ürün çıktısı sunabilecek ve kazanımlarını Europass Hareketlilik Belgesi ile belgelendirecektir.`;
  }

  const transversalOutcome =
    'Katılımcı; İş Sağlığı ve Güvenliği (İSG) kurallarını, çok kültürlü takım çalışmasını, mesleki yabancı dil terminolojisini, dijital iş araçlarını, yeşil/çevresel sürdürülebilirlik uygulamalarını ve kültürlerarası adaptasyon yetkinliğini gerçek bir Avrupa çalışma ortamında geliştirecektir.';

  return { technicalOutcome, transversalOutcome };
}

/**
 * 5. Calculates Organisation Profile Completeness (0-100)
 */
export function calculateReadinessScore(state: {
  schoolName: string;
  city: string;
  oid: string;
  accredited: string;
  erasmusPlan: string;
  institutionNeed: string;
}): { score: number; passed: boolean } {
  let score = 0;
  if (state.schoolName && state.schoolName.trim().length > 3) score += 20;
  if (state.city && state.city.trim().length > 1) score += 10;
  if (state.oid && /^E10[0-9]{5,7}$/.test(state.oid.trim())) score += 20;
  if (state.accredited && state.accredited !== 'unknown') score += 15;
  if (state.institutionNeed && state.institutionNeed.trim().length > 15) score += 20;
  if (state.erasmusPlan && state.erasmusPlan.trim().length > 15) score += 15;

  return { score: Math.min(100, score), passed: score >= 70 };
}
