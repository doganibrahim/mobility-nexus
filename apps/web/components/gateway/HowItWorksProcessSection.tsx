'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';

export interface HowItWorksStep {
  stepNumber: string;
  id: string;
  theme: 'blue' | 'indigo' | 'purple' | 'emerald' | 'amber';
  icon: string;
  shortLabelTr: string;
  shortLabelEn: string;
  titleTr: string;
  titleEn: string;
  subtitleTr: string;
  subtitleEn: string;
  deliverableBadgeTr: string;
  deliverableBadgeEn: string;
  featuresTr: string[];
  featuresEn: string[];
  primaryCtaTr: string;
  primaryCtaEn: string;
  primaryHref: string;
  secondaryCtaTr: string;
  secondaryCtaEn: string;
  secondaryHref: string;
}

const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    stepNumber: '01',
    id: 'submit-request',
    theme: 'blue',
    icon: '📝',
    shortLabelTr: '1. Talep Oluştur',
    shortLabelEn: '1. Submit Request',
    titleTr: '1. Hareketlilik Talebini Başlat',
    titleEn: '1. Submit a Mobility Request',
    subtitleTr:
      'Okulunuzun OID numarası ve hareketlilik hedefiyle (KA121 akredite bütçe veya KA122 kısa dönem proje çağrısı) resmi ön hazırlık talebinizi oluşturun.',
    subtitleEn:
      'Initiate your institutional mobility inquiry using your school OID and project format (KA121 accredited or KA122 short-term call).',
    deliverableBadgeTr: 'Resmi OID Doğrulaması & Proje Rotası',
    deliverableBadgeEn: 'Verified OID Profile & Project Route',
    featuresTr: [
      'Resmi OID (Organisation ID) numarasının otomatik doğrulanması',
      'Kurum akreditasyon durumuna (KA121 / KA122) göre başvuru kulvarı seçimi',
      'Türkiye Ulusal Ajansı formatında taslak soru ve veri havuzunun açılması',
      'İlk yıl %100 ücretsiz kurumsal kayıt güvencesi',
    ],
    featuresEn: [
      'Automated verification of official OID (Organisation ID)',
      'Smart pathway selection based on accreditation status (KA121 / KA122)',
      'Access to National Agency aligned questionnaire and data structures',
      '100% free institutional registration guarantee for the first year',
    ],
    primaryCtaTr: 'Hareketliliğinizi Planlayın',
    primaryCtaEn: 'Plan your mobility',
    primaryHref: '/school/pipeline',
    secondaryCtaTr: 'Kullanım Kılavuzu',
    secondaryCtaEn: 'Platform Guide',
    secondaryHref: '/guide',
  },
  {
    stepNumber: '02',
    id: 'describe-needs',
    theme: 'indigo',
    icon: '🎯',
    shortLabelTr: '2. İhtiyaçları Tanımla',
    shortLabelEn: '2. Describe Needs',
    titleTr: '2. Kurumsal ve Katılımcı İhtiyaçlarını Tanımla',
    titleEn: '2. Describe Your Needs & Participant Goals',
    subtitleTr:
      'Katılımcı sayısı, meslek alanı (ISCED-F), öncelikli beceri kazanımları (ESCO), hedef tarihler ve lojistik (konaklama, yemek, transfer) beklentilerini sisteme girin.',
    subtitleEn:
      'Define participant headcount, vocational domain (ISCED-F), target ESCO skills, dates, and logistics preferences (lodging, meals, transfers).',
    deliverableBadgeTr: 'S1-S8 İhtiyaç Analizi & Öncelik Karnesi',
    deliverableBadgeEn: 'S1-S8 Need Assessment & Priority Scorecard',
    featuresTr: [
      'S1-S8 kurumsal eksiklik analizi ve radar yetkinlik karnesi',
      'ISCED-F mesleki eğitim alan kodları ve ESCO yetkinlik eşleştirmesi',
      'Tarih aralığı, öğrenci yaş grubu (18 yaş altı / üstü) ve refakatçi tanımı',
      'Özel beslenme, erişilebilirlik veya lojistik şartlarının belirlenmesi',
    ],
    featuresEn: [
      'S1-S8 institutional gap analysis with radar competence scorecard',
      'ISCED-F vocational discipline code and ESCO skill mapping',
      'Dates, learner age groups (minors / adults), and accompanying staff',
      'Logistics criteria (accessibility, dietary requirements, transfers)',
    ],
    primaryCtaTr: 'İhtiyaç Analizine Başla',
    primaryCtaEn: 'Start Need Assessment',
    primaryHref: '/school/pipeline',
    secondaryCtaTr: 'Başvuru Taslağı Modülü',
    secondaryCtaEn: 'Application Draft Module',
    secondaryHref: '/school/application-draft',
  },
  {
    stepNumber: '03',
    id: 'compare-providers',
    theme: 'purple',
    icon: '🔍',
    shortLabelTr: '3. Sağlayıcıları Karşılaştır',
    shortLabelEn: '3. Compare Providers',
    titleTr: '3. Avrupa Ev Sahibi ve Sağlayıcıları Karşılaştır',
    titleEn: '3. Compare European Providers & Hosts',
    subtitleTr:
      '10 parametreli eşleştirme filtresiyle onaylanmış Avrupa işletmelerini ve mesleki merkezleri uygunluk skoru, kapasite, dil ve lojistik imkanlarına göre inceleyin.',
    subtitleEn:
      'Evaluate verified European companies and training centres using 10-parameter matching, suitability scores, capacity, and language compatibility.',
    deliverableBadgeTr: 'Şeffaf Uygunluk Skoru & Uyuşmazlık Analizi',
    deliverableBadgeEn: 'Transparent Suitability Scoring & Diagnostics',
    featuresTr: [
      'Ülke, faaliyet türü, süre ve kontenjan parametrelerine göre akıllı filtreleme',
      'Aday kurumlar için şeffaf Eğitim (%70) ve Lojistik (%30) uygunluk skoru',
      'Uyuşmazlık teşhisi (Mismatch): Karşılanan ve karşılanamayan şartların dökümü',
      'KYC doğrulaması yapılmış, sahte kurumlardan arındırılmış güvenli ev sahibi ağı',
    ],
    featuresEn: [
      'Smart filtering by country, activity format, duration, and group quota',
      'Two-tier transparent suitability score: Education (70%) & Logistics (30%)',
      'Mismatch diagnostics: Clear breakdown of satisfied and conflicting criteria',
      'KYC-verified host network free of fraudulent intermediaries',
    ],
    primaryCtaTr: 'Pazaryeri & Ev Sahipleri',
    primaryCtaEn: 'Explore Hosts & Offers',
    primaryHref: '/marketplace',
    secondaryCtaTr: 'İşbaşı Gözlem Kontenjanları',
    secondaryCtaEn: 'Job Shadowing Slots',
    secondaryHref: '/marketplace/job-shadowing',
  },
  {
    stepNumber: '04',
    id: 'request-offers',
    theme: 'emerald',
    icon: '✉️',
    shortLabelTr: '4. Teklif / Kontenjan İste',
    shortLabelEn: '4. Request Offers',
    titleTr: '4. Doğrudan Teklif ve Kontenjan Talebi Gönder',
    titleEn: '4. Request Direct Offers & Confirm Slots',
    subtitleTr:
      'Beğendiğiniz ev sahiplerine tek tıkla doğrudan resmi ön talep gönderin; aracı ajans komisyonu olmadan gelen teklifleri ve revizyonları panelinizden yönetin.',
    subtitleEn:
      'Send direct institutional inquiries to chosen hosts with zero agency commissions; review slot offers and revisions directly in your dashboard.',
    deliverableBadgeTr: 'Resmi Ön Talep & Doğrudan İletişim',
    deliverableBadgeEn: 'Formal Inquiry & Direct Dialogue',
    featuresTr: [
      '2 adımlı hızlı talep formuyla kurum OID ve hareketlilik detaylarını iletme',
      'Sıfır aracı komisyonu: Okul ile Avrupa işletmesi arasında doğrudan temas',
      'Ev sahibinin 48-72 saat içinde yanıtlaması ve teklif/tarih revizyonu iletmesi',
      'Okul panelinde gönderilen taleplerin anlık durum (Kabul / İnceleme / Revize) takibi',
    ],
    featuresEn: [
      'Concise 2-step inquiry form connecting school OID with target host',
      'Zero agency fee: 100% direct dialogue between sending school and EU host',
      'Guaranteed 48-72h response window with proposal and schedule options',
      'Real-time inquiry status tracking (Accepted / Pending / Revised) in dashboard',
    ],
    primaryCtaTr: 'Talep Formunu İncele',
    primaryCtaEn: 'Review Request Flow',
    primaryHref: '/school/pipeline',
    secondaryCtaTr: 'Okul Gösterge Paneli',
    secondaryCtaEn: 'School Dashboard',
    secondaryHref: '/?view=SCHOOL',
  },
  {
    stepNumber: '05',
    id: 'plan-mobility',
    theme: 'amber',
    icon: '🚀',
    shortLabelTr: '5. Hareketliliği Planla',
    shortLabelEn: '5. Plan the Mobility',
    titleTr: '5. Hibe Hesabı, Resmi Evraklar ve Hareketliliği Planla',
    titleEn: '5. Plan Mobility, Grants & Formal Documents',
    subtitleTr:
      'Avrupa Komisyonu mesafe bandı formülüyle seyahat/harcırah bütçenizi hesaplayın, niyet mektubunuzu (LoI) alın, Öğrenim Anlaşması ve Europass Hareketlilik Belgesi evraklarını ihraç edin.',
    subtitleEn:
      'Calculate travel and individual support grants via official EU distance formulas, secure your Letter of Intent (LoI), and export Learning Agreement & Europass dossiers.',
    deliverableBadgeTr: 'Doldurulmuş Resmi Hareketlilik Dosyası',
    deliverableBadgeEn: 'Ready-to-Sign Official Mobility Dossier',
    featuresTr: [
      'Avrupa Komisyonu resmi mesafe hesaplayıcısıyla yeşil/standart seyahat hibesi',
      'Onaylanan eşleşme sonrası otomatik üretilen resmi Niyet Mektubu (Letter of Intent)',
      'ESCO mesleki yetkinlik kazanımlı Öğrenim Anlaşması ve Europass Hareketlilik Belgesi Word/PDF çıktısı',
      '1. yıl ücretsiz model kapsamında sınırsız şablon ve resmi evrak ihracı',
    ],
    featuresEn: [
      'Official EU Commission distance band travel & subsistence grant calculation',
      'Automated Letter of Intent (LoI) generated immediately upon host acceptance',
      'Exportable Learning Agreement and Europass Mobility drafts in Word & PDF',
      'Unlimited official document export under the 100% free first-year model',
    ],
    primaryCtaTr: 'Resmi Evrak Masası',
    primaryCtaEn: 'Official Documents Desk',
    primaryHref: '/dossier',
    secondaryCtaTr: 'Öğrenci Hazırlık Portalı (LMS)',
    secondaryCtaEn: 'Preparation LMS',
    secondaryHref: '/preparation',
  },
];

export default function HowItWorksProcessSection() {
  const { locale } = useTranslation();
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const activeStep = HOW_IT_WORKS_STEPS[activeStepIndex] || HOW_IT_WORKS_STEPS[0];

  return (
    <section
      id="how-it-works"
      aria-label={locale === 'tr' ? 'Nasıl Çalışır? 5 Adımda Hareketlilik Süreci' : 'How it works: 5-Step Mobility Process'}
      className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 lg:p-10 shadow-sm space-y-8"
    >
      {/* 1. Header with Badge & Scope */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-900 border border-blue-200">
              <span>⚡</span>
              <span>
                {locale === 'tr'
                  ? 'Nasıl Çalışır? • 5 Adımlı Süreç Akışı'
                  : 'How It Works • 5-Step Workflow'}
              </span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300">
              <span>🇹🇷 ➔ 🇪🇺</span>
              <span>KA121 / KA122 VET</span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-950 tracking-tight m-0">
            {locale === 'tr'
              ? '5 Adımda Hareketliliğinizi Güvenle Planlayın'
              : 'Plan Your Mobility in 5 Clear Steps'}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0 font-normal">
            {locale === 'tr'
              ? 'Talebinizi oluşturmaktan Avrupa ev sahibiyle anlaşmaya ve resmi AB evraklarını almaya kadar olan süreci adım adım inceleyin:'
              : 'From submitting your inquiry to matching with verified European hosts and exporting official EU dossiers, explore every step:'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/school/pipeline"
            className="px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
          >
            <span>🚀</span>
            <span>{locale === 'tr' ? 'Hareketliliğinizi Planlayın' : 'Plan your mobility'}</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {/* 2. Step Selector Tabs (Horizontal 5 Pills with Mobile Horizontal Scroll) */}
      <div className="overflow-x-auto py-3 -my-3 -mx-2 px-2 no-scrollbar">
        <div className="flex items-center gap-2 sm:gap-3 min-w-[720px] lg:min-w-0">
          {HOW_IT_WORKS_STEPS.map((step, idx) => {
            const isActive = idx === activeStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStepIndex(idx)}
                className={`flex-1 py-3 px-3.5 rounded-xl text-xs font-bold border-2 transition-all flex items-center justify-between gap-2 text-left cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md translate-y-[-1px]'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="text-base shrink-0">{step.icon}</span>
                  <div className="truncate">
                    <span
                      className={`text-[10px] uppercase font-mono block ${
                        isActive ? 'text-blue-300' : 'text-slate-600 font-bold'
                      }`}
                    >
                      {step.stepNumber}
                    </span>
                    <span className="truncate block font-extrabold text-xs">
                      {locale === 'tr' ? step.shortLabelTr : step.shortLabelEn}
                    </span>
                  </div>
                </div>

                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-pulse"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Active Step Detailed Spotlight Card */}
      <div className="bg-slate-50 rounded-2xl border-2 border-slate-200 p-6 sm:p-8 space-y-6 animate-fadeIn">
        {/* Top Meta & Deliverable Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-xl bg-white border border-slate-300 flex items-center justify-center text-xl shadow-2xs shrink-0">
              {activeStep.icon}
            </span>
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-blue-700 block">
                {locale === 'tr' ? `ADIM ${activeStep.stepNumber} / 05` : `STEP ${activeStep.stepNumber} / 05`}
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-950 m-0">
                {locale === 'tr' ? activeStep.titleTr : activeStep.titleEn}
              </h3>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <span>🏆</span>
              <span>{locale === 'tr' ? 'Aşama Çıktısı:' : 'Deliverable:'}</span>
              <span className="font-extrabold">
                {locale === 'tr' ? activeStep.deliverableBadgeTr : activeStep.deliverableBadgeEn}
              </span>
            </span>
          </div>
        </div>

        {/* Subtitle explanation */}
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed m-0 font-medium">
          {locale === 'tr' ? activeStep.subtitleTr : activeStep.subtitleEn}
        </p>

        {/* 4 Value Checkpoints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {(locale === 'tr' ? activeStep.featuresTr : activeStep.featuresEn).map((feature, fIdx) => (
            <div
              key={fIdx}
              className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-start gap-2.5 shadow-2xs hover:border-slate-300 transition-colors"
            >
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                ✓
              </span>
              <span className="text-xs text-slate-800 leading-normal font-normal">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* Action Controls for Active Step */}
        <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Link
              href={activeStep.primaryHref}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
            >
              <span>{locale === 'tr' ? activeStep.primaryCtaTr : activeStep.primaryCtaEn}</span>
              <span>→</span>
            </Link>

            <Link
              href={activeStep.secondaryHref}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{locale === 'tr' ? activeStep.secondaryCtaTr : activeStep.secondaryCtaEn}</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end text-xs text-slate-500 font-mono">
            {activeStepIndex > 0 && (
              <button
                type="button"
                onClick={() => setActiveStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 text-xs transition-colors cursor-pointer"
              >
                ← {locale === 'tr' ? 'Önceki Adım' : 'Previous Step'}
              </button>
            )}
            {activeStepIndex < HOW_IT_WORKS_STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setActiveStepIndex((prev) =>
                    Math.min(HOW_IT_WORKS_STEPS.length - 1, prev + 1),
                  )
                }
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 text-xs transition-colors cursor-pointer"
              >
                {locale === 'tr' ? 'Sonraki Adım' : 'Next Step'} →
              </button>
            ) : (
              <Link
                href="/school/pipeline"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 text-xs transition-colors cursor-pointer"
              >
                {locale === 'tr' ? 'Hemen Başlayın' : 'Get Started'} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
