/**
 * CAPPINNO Mobility Nexus - Core Calculation Engine & Algorithms
 */

import {
  ASSESSMENT_QUESTIONS,
  HOST_METRIC_CONFIG,
  VET_FIELDS,
} from './constants';

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
  action: 'KA121-VET' | 'KA122-VET' | 'Akreditasyon durumu doğrulanmalı';
  readiness: string;
  level: 'good' | 'warn' | 'bad';
  rationale: string;
}

export interface LearningOutcomesResult {
  technicalOutcome: string;
  transversalOutcome: string;
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
 * 3. 8-Factor KA121 / KA122 Decision Engine
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

  let action: 'KA121-VET' | 'KA122-VET' | 'Akreditasyon durumu doğrulanmalı' =
    'Akreditasyon durumu doğrulanmalı';
  if (params.accredited === 'yes') {
    action = 'KA121-VET';
  } else if (params.accredited === 'no') {
    action = 'KA122-VET';
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

  const rationale =
    params.accredited === 'yes'
      ? 'Akredite okulda faaliyet mevcut Erasmus Plan hedeflerine bağlanmalı ve yıllık tahsisat kapsamında yürütülmelidir.'
      : 'Akreditasyonu olmayan uygun VET kuruluşunda KA122 için ihtiyaç/challenge → hedef → faaliyet → etki ölçüm zinciri kurulmalıdır.';

  return { score, action, readiness, level, rationale };
}

/**
 * 4. Generates Role-Based Learning Outcomes
 */
export function generateOutcomes(
  participantType: 'teacher' | 'student',
  primaryGap: string,
  escoTerm: string,
): LearningOutcomesResult {
  const gap = primaryGap.trim() || escoTerm.trim() || 'belirlenen mesleki yetkinlik';

  const technicalOutcome =
    participantType === 'teacher'
      ? `Mobilite sonunda teknik öğretmen; ${gap} alanındaki güncel Avrupa iyi uygulamalarını ve endüstri standartlarını doğrudan gözlemleyebilecek, edindiği en az iki yenilikçi pedagojik/teknik yöntemi okulundaki atölye/laboratuvar ortamına entegre edebilecek ve sonuçları meslektaşlarıyla kurumsal yaygınlaştırma çalıştayında paylaşabilecektir.`
      : `Mobilite sonunda meslek lisesi öğrencisi; ${gap} ile ilgili tanımlanmış gerçek iş görevlerini ev sahibi kurumdaki mentor gözetiminde iş sağlığı ve güvenliği kurallarına uygun biçimde icra edebilecek, edindiği pratik becerileri kanıtlayan somut bir iş/ürün çıktısı sunabilecek ve kazanımlarını Europass Hareketlilik Belgesi ile belgelendirecektir.`;

  const transversalOutcome =
    'Katılımcı; İş Sağlığı ve Güvenliği (İSG) kurallarını, çok kültürlü takım çalışmasını, mesleki İngilizce terminolojisini, dijital iş araçlarını, yeşil/çevresel sürdürülebilirlik uygulamalarını ve kültürlerarası adaptasyon yetkinliğini gerçek bir Avrupa çalışma ortamında geliştirecektir.';

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
