'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';

export interface ProcessStep {
  stepNumber: string;
  theme: 'blue' | 'emerald' | 'amber';
  icon: string;
  tabLabelTr: string;
  tabLabelEn: string;
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  subtitleEn: string;
  deliverableBadgeTr: string;
  deliverableBadgeEn: string;
  featuresTr: string[];
  featuresEn: string[];
  ctaTextTr: string;
  ctaTextEn: string;
  ctaHref: string;
  secondaryTextTr: string;
  secondaryTextEn: string;
  secondaryHref: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    stepNumber: '01',
    theme: 'blue',
    icon: '🏛️',
    tabLabelTr: '1. Hazırlık & OID',
    tabLabelEn: '1. Setup & OID',
    titleTr: 'Kurumsal Hazırlık, OID & İhtiyaç Analizi',
    titleEn: 'Institutional Readiness, OID & Need Assessment',
    subtitleTr:
      'Okul OID numarasının doğrulanması, S1-S8 kurumsal eksiklik karnesinin çıkarılması ve resmi başvuru taslağının oluşturulması.',
    subtitleEn:
      'Verification of school OID, S1-S8 institutional gap analysis, and generation of formal application draft.',
    deliverableBadgeTr: 'Resmi Hazırlık Karnesi & Taslak',
    deliverableBadgeEn: 'Readiness Profile & Draft',
    featuresTr: [
      'OID doğrulama ve MEB mesleki kurum verisi teyidi',
      'S1-S8 Kurumsal İhtiyaç Analizi Radar Karnesi',
      'KA121 / KA122 akreditasyon durumuna göre otomatik rota rehberi',
      'Ulusal Ajans formatında doldurulabilir taslak soru seti',
    ],
    featuresEn: [
      'OID verification and institutional accreditation check',
      'S1-S8 Institutional Need Assessment Radar profile',
      'Automated pathway guide according to KA121/KA122 status',
      'Fillable questionnaire aligned with National Agency standards',
    ],
    ctaTextTr: '5 Adımlı Pipeline’ı Başlat',
    ctaTextEn: 'Start 5-Step Pipeline',
    ctaHref: '/school/pipeline',
    secondaryTextTr: 'Başvuru Taslağı Modülü',
    secondaryTextEn: 'Application Draft Module',
    secondaryHref: '/school/application-draft',
  },
  {
    stepNumber: '02',
    theme: 'emerald',
    icon: '🤝',
    tabLabelTr: '2. Eşleşme & Hareketlilik',
    tabLabelEn: '2. Match & Mobility',
    titleTr: 'Avrupa Ev Sahibi Eşleşmesi & Hibe Otomasyonu',
    titleEn: 'European Host Matching & Automated Grant Allocation',
    subtitleTr:
      'Onaylı Avrupa işletmeleri ve mesleki merkezlerle aracı komisyonsuz doğrudan temas kurulması ve seyahat bütçesinin hesaplanması.',
    subtitleEn:
      'Direct partner matching with verified European companies and instant calculation of Erasmus+ distance band budget.',
    deliverableBadgeTr: 'Onaylı Kontenjan & Bütçe Planı',
    deliverableBadgeEn: 'Confirmed Slot & Budget Plan',
    featuresTr: [
      'ISCED meslek alanına göre doğrulanmış host ve kurs filtreleme',
      'Avrupa Komisyonu mesafe bandı formülüyle seyahat ve harcırah hesabı',
      'Doğrudan randevu ve talep masası (Sıfır aracı ajans komisyonu)',
      'Çok dilli öğrenme çıktıları ve ESCO meslek profili uyumu',
    ],
    featuresEn: [
      'Filter verified hosts and courses by ISCED vocational domain',
      'Automated travel and subsistence budget calculation via EU distance formulas',
      'Direct inquiry and appointment scheduling (Zero intermediary fees)',
      'Multilingual learning outcomes and ESCO skill alignment',
    ],
    ctaTextTr: 'Pazaryeri & İlan Havuzu',
    ctaTextEn: 'Explore Marketplace',
    ctaHref: '/marketplace',
    secondaryTextTr: 'İşbaşı Gözlem Kontenjanları',
    secondaryTextEn: 'Job Shadowing Slots',
    secondaryHref: '/marketplace/job-shadowing',
  },
  {
    stepNumber: '03',
    theme: 'amber',
    icon: '📄',
    tabLabelTr: '3. Evrak & Şablon Taslağı',
    tabLabelEn: '3. Drafts & Templates',
    titleTr: 'Evrak Taslakları & Europass Hazırlığı',
    titleEn: 'Document Drafts & Europass Preparation',
    subtitleTr:
      'Hareketlilik hazırlığında referans alabileceğiniz Learning Agreement, Europass ve sözleşme taslaklarının doldurulmuş şablon olarak üretilmesi.',
    subtitleEn:
      'Generation of reference Learning Agreement, Europass, and partnership contract drafts pre-filled for institutional customization.',
    deliverableBadgeTr: 'Kapsamlı Hareketlilik Dosyası (Taslak)',
    deliverableBadgeEn: 'Mobility Dossier (Reference Draft)',
    featuresTr: [
      'Avrupa Komisyonu standartlarında örnek VET Learning Agreement taslağı (Word/PDF)',
      'ESCO mesleki yetkinlik kazanımlı örnek Europass Mobility şablonu',
      'Kurumların kendi antetli kağıdına uyarlayabileceği ortaklık protokolü taslağı',
      '1. yıl ücretsiz model kapsamında sınırsız şablon ve taslak ihracı',
    ],
    featuresEn: [
      'Commission-standard sample VET Learning Agreement template (Word/PDF)',
      'Sample Europass Mobility draft featuring ESCO competence outcomes',
      'Customizable inter-institutional partnership & internship draft',
      'Unlimited draft and template export under the 100% free first-year model',
    ],
    ctaTextTr: 'Kütüphane & Şablonlar',
    ctaTextEn: 'Library & Templates',
    ctaHref: '/library',
    secondaryTextTr: 'Kullanım Kılavuzu',
    secondaryTextEn: 'Platform Guide',
    secondaryHref: '/guide',
  },
];

export default function InteractiveProcessStepper() {
  const { locale } = useTranslation();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = PROCESS_STEPS[activeStepIndex] || PROCESS_STEPS[0];

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-slate-100 text-slate-800 border border-slate-300">
            <span>⚡</span>
            <span>{locale === 'tr' ? 'Adım Adım Platform Yaşam Döngüsü' : 'Interactive Lifecycle'}</span>
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 m-0">
            {locale === 'tr'
              ? '3 Adımda Tamamlanan Hareketlilik Süreci'
              : 'Complete Mobility Lifecycle in 3 Steps'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 m-0">
            {locale === 'tr'
              ? 'Okulun kayıt olmasından başvuru ve hazırlık taslaklarının oluşturulmasına kadar süreci adım adım inceleyin:'
              : 'Click any step to inspect the inputs, automated calculations, and resulting draft outputs:'}
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 self-start md:self-auto">
          {locale === 'tr' ? 'İlk Yıl %100 Ücretsiz' : '100% Free First Year'}
        </span>
      </div>

      {/* 3 Step Selector Buttons / Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PROCESS_STEPS.map((step, idx) => {
          const isActive = idx === activeStepIndex;
          const themeBorder =
            step.theme === 'blue'
              ? 'border-blue-500'
              : step.theme === 'emerald'
              ? 'border-emerald-500'
              : 'border-amber-500';

          const activeBg =
            step.theme === 'blue'
              ? 'bg-blue-600 text-white'
              : step.theme === 'emerald'
              ? 'bg-emerald-600 text-white'
              : 'bg-amber-600 text-white';

          return (
            <button
              key={step.stepNumber}
              type="button"
              onClick={() => setActiveStepIndex(idx)}
              className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isActive
                  ? `${themeBorder} ${activeBg} shadow-sm scale-[1.02]`
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="text-2xl shrink-0">{step.icon}</span>
                <div className="min-w-0">
                  <span
                    className={`text-[11px] font-mono font-black uppercase tracking-wider block ${
                      isActive ? 'text-white/80' : 'text-slate-500'
                    }`}
                  >
                    {locale === 'tr' ? `ADIM ${step.stepNumber}` : `STEP ${step.stepNumber}`}
                  </span>
                  <span
                    className={`text-sm font-black truncate block ${
                      isActive ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {locale === 'tr' ? step.tabLabelTr : step.tabLabelEn}
                  </span>
                </div>
              </div>
              <span
                className={`text-sm font-black shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}
              >
                {isActive ? '●' : '○'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Detailed Showcase Panel */}
      <div
        className={`rounded-2xl border-2 p-6 sm:p-7 space-y-6 transition-all ${
          activeStep.theme === 'blue'
            ? 'border-blue-500 bg-blue-50/30'
            : activeStep.theme === 'emerald'
            ? 'border-emerald-500 bg-emerald-50/30'
            : 'border-amber-500 bg-amber-50/30'
        }`}
      >
        {/* Title & Deliverable Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span
              className={`text-xs font-black uppercase tracking-wider block ${
                activeStep.theme === 'blue'
                  ? 'text-blue-700'
                  : activeStep.theme === 'emerald'
                  ? 'text-emerald-700'
                  : 'text-amber-800'
              }`}
            >
              {locale === 'tr' ? `AŞAMA ${activeStep.stepNumber} DETAYI` : `STAGE ${activeStep.stepNumber} OVERVIEW`}
            </span>
            <h3 className="text-xl font-black text-slate-950 m-0 mt-0.5">
              {locale === 'tr' ? activeStep.titleTr : activeStep.titleEn}
            </h3>
          </div>

          <span
            className={`px-3 py-1 rounded-full text-xs font-black border shadow-2xs self-start sm:self-auto ${
              activeStep.theme === 'blue'
                ? 'bg-blue-100 text-blue-900 border-blue-300'
                : activeStep.theme === 'emerald'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-amber-100 text-amber-950 border-amber-300'
            }`}
          >
            ✓ {locale === 'tr' ? activeStep.deliverableBadgeTr : activeStep.deliverableBadgeEn}
          </span>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed font-medium m-0">
          {locale === 'tr' ? activeStep.subtitleTr : activeStep.subtitleEn}
        </p>

        {/* 4 Key Deliverable Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {(locale === 'tr' ? activeStep.featuresTr : activeStep.featuresEn).map(
            (feat, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-2xs flex items-start gap-2.5 text-xs text-slate-800"
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                    activeStep.theme === 'blue'
                      ? 'bg-blue-100 text-blue-800'
                      : activeStep.theme === 'emerald'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  ✓
                </span>
                <span className="font-semibold leading-relaxed">{feat}</span>
              </div>
            )
          )}
        </div>

        {/* Actions for this Step */}
        <div className="pt-3 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href={activeStep.ctaHref}
            className={`w-full sm:w-auto py-3 px-5 rounded-xl text-white font-extrabold text-xs text-center shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer ${
              activeStep.theme === 'blue'
                ? 'bg-blue-600 hover:bg-blue-700'
                : activeStep.theme === 'emerald'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            <span>{locale === 'tr' ? activeStep.ctaTextTr : activeStep.ctaTextEn}</span>
            <span>→</span>
          </Link>

          <Link
            href={activeStep.secondaryHref}
            className="text-xs font-bold text-slate-700 hover:text-slate-950 hover:underline flex items-center gap-1"
          >
            <span>{locale === 'tr' ? activeStep.secondaryTextTr : activeStep.secondaryTextEn}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
