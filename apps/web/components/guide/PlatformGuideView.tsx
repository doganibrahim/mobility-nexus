'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../lib/i18n';
import { useAppStore } from '../../lib/store';
import {
  PLATFORM_GUIDE_DATA,
  GuideAudience,
  GuideTopic,
  GuideCategory,
  GuideStepAction,
} from '../../lib/platform-guide-data';

export interface PlatformGuideViewProps {
  onSelectRole?: (role: 'SCHOOL' | 'HOST') => void;
  showHeaderBanner?: boolean;
}

interface QuickChip {
  id: string;
  icon: string;
  labelTr: string;
  labelEn: string;
  targetAudience: GuideAudience;
  targetTopicId: string;
}

const QUICK_CURIOSITY_CHIPS: QuickChip[] = [
  {
    id: 'free-model',
    icon: '🆓',
    labelTr: '%100 Ücretsiz Model',
    labelEn: '100% Free Model',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-free-model',
  },
  {
    id: 'ka121-vs-ka122',
    icon: '⚖️',
    labelTr: 'KA121 vs KA122 Farkı',
    labelEn: 'KA121 vs KA122',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-ka121-vs-ka122',
  },
  {
    id: 'grant-payment',
    icon: '💶',
    labelTr: 'Hibe Ödemesi & Harcamalar',
    labelEn: 'Grant Payment & Budget',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-grant-payment-flow',
  },
  {
    id: 'daily-subsistence',
    icon: '🏨',
    labelTr: 'Günlük Harcırah Tutarları',
    labelEn: 'Daily Subsistence',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-daily-subsistence-rates',
  },
  {
    id: 'loi-matching',
    icon: '🏢',
    labelTr: 'Ev Sahibi Bulma & LoI',
    labelEn: 'Host Match & LoI',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-loi-requirement',
  },
  {
    id: 'green-travel',
    icon: '🌱',
    labelTr: 'Yeşil Seyahat Primi',
    labelEn: 'Green Travel Bonus',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-green-travel',
  },
  {
    id: 'learning-agreement',
    icon: '📜',
    labelTr: 'Learning Agreement & Europass',
    labelEn: 'Learning Agreement',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-learning-agreement-europass',
  },
  {
    id: 'consortium',
    icon: '🤝',
    labelTr: 'Konsorsiyuma Katılım',
    labelEn: 'Consortium Guide',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-consortium-participation',
  },
  {
    id: 'oid-setup',
    icon: '🔑',
    labelTr: 'OID Alma & Doğrulama',
    labelEn: 'OID Registration',
    targetAudience: 'FAQ',
    targetTopicId: 'faq-oid-setup',
  },
];

export interface RoadmapStep {
  step: number;
  icon: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  targetAudience: GuideAudience;
  targetTopicId: string;
  directRoute?: string;
  directRouteLabelTr?: string;
  directRouteLabelEn?: string;
}

const SCHOOL_ROADMAP_STEPS: RoadmapStep[] = [
  {
    step: 1,
    icon: '🏛️',
    titleTr: 'Kurumunu Tanımla & Hibe Yolunu Seç',
    titleEn: 'Set School & Grant Route',
    descTr: 'MEB Atlası veya OID ile okulunu seç. KA121 (Akredite) veya KA122 (Kısa Dönemli) hibe yolunu belirle.',
    descEn: 'Select school via MEB Atlas or OID. Choose KA121 (Accredited) or KA122 (Short-term) grant route.',
    targetAudience: 'SCHOOL',
    targetTopicId: 'school-onboarding',
    directRoute: '/onboarding',
    directRouteLabelTr: 'Kurulumu Başlat',
    directRouteLabelEn: 'Start Setup',
  },
  {
    step: 2,
    icon: '🚀',
    titleTr: '5 Adımlı Planlayıcıyı Çalıştır',
    titleEn: 'Run 5-Step Pipeline',
    descTr: 'Öğrenci sayını ve meslek alanını gir. Sistem eksik becerileri analiz etsin, hedeflerini hazırlasın.',
    descEn: 'Define learner count and vocational field. System analyzes skill gaps and generates outcomes.',
    targetAudience: 'SCHOOL',
    targetTopicId: 'school-pipeline',
    directRoute: '/school/pipeline',
    directRouteLabelTr: 'Pipeline’ı Aç',
    directRouteLabelEn: 'Open Pipeline',
  },
  {
    step: 3,
    icon: '🏢',
    titleTr: 'Avrupa’dan Onaylı Ev Sahibi Bul',
    titleEn: 'Match Verified EU Host',
    descTr: 'Berlin, Viyana veya Madrid’deki işletmeleri incele, staj talebi gönder, referans alabileceğin örnek LoI taslağını indir.',
    descEn: 'Browse verified hosts in Berlin, Vienna, or Prague. Send inquiry and download sample reference LoI draft.',
    targetAudience: 'SCHOOL',
    targetTopicId: 'school-inquiry-loi',
    directRoute: '/marketplace',
    directRouteLabelTr: 'Pazaryeri & Hostlar',
    directRouteLabelEn: 'Marketplace',
  },
  {
    step: 4,
    icon: '📝',
    titleTr: 'Başvuru Formunu Hazırla & İndir',
    titleEn: 'Draft Proposal & Export',
    descTr: 'Otomatik harcırah bütçeni çıkar, yapay zeka ile anlatıları oluştur, kurumuna referans olacak başvuru taslak dosyanı indir.',
    descEn: 'Calculate subsistence budgets, draft narratives with AI, and export proposal working drafts.',
    targetAudience: 'SCHOOL',
    targetTopicId: 'school-application-draft',
    directRoute: '/school/application-draft',
    directRouteLabelTr: 'Taslak Sihirbazı',
    directRouteLabelEn: 'Draft Assistant',
  },
];

const HOST_ROADMAP_STEPS: RoadmapStep[] = [
  {
    step: 1,
    icon: '🏢',
    titleTr: 'İşletmeni Kaydet & Kontenjanını Belirle',
    titleEn: 'Register Company & Capacity',
    descTr: 'Şirket yasal adı, ülke, sektör ve dönemlik stajyer kapasiteni gir. Okul aramalarında listelen.',
    descEn: 'Enter legal name, country, sector, and trainee capacity to appear in school searches.',
    targetAudience: 'HOST',
    targetTopicId: 'host-onboarding-tier1',
    directRoute: '/onboarding',
    directRouteLabelTr: 'Host Kaydı Aç',
    directRouteLabelEn: 'Host Sign-up',
  },
  {
    step: 2,
    icon: '🛡️',
    titleTr: 'Güvenilirlik Rozetini Al (KYC)',
    titleEn: 'Gain Verified Partner Badge',
    descTr: 'Ticaret sicil belgeni ve atölye imkanlarını yükle, onaylı partner rozetiyle aramalarda en üste çık.',
    descEn: 'Upload registration documents and workshop showcase to earn the Verified Partner badge.',
    targetAudience: 'HOST',
    targetTopicId: 'host-kyc-tier3',
    directRoute: '/',
    directRouteLabelTr: 'Ev Sahibi Masası',
    directRouteLabelEn: 'Host Dashboard',
  },
  {
    step: 3,
    icon: '✉️',
    titleTr: 'Gelen Staj Başvurularını Yanıtla',
    titleEn: 'Accept Inquiries & Share Draft LoI',
    descTr: 'Okullardan gelen staj taleplerini gör, okulun referans alacağı örnek bir Ön Kabul Metni (LoI Taslağı) oluştur.',
    descEn: 'Review student internship requests from schools and provide a reference Letter of Intent draft.',
    targetAudience: 'HOST',
    targetTopicId: 'host-inquiries-loi',
    directRoute: '/',
    directRouteLabelTr: 'Talepleri Yönet',
    directRouteLabelEn: 'Manage Inquiries',
  },
];

export default function PlatformGuideView({
  onSelectRole,
  showHeaderBanner = true,
}: PlatformGuideViewProps) {
  const { locale } = useTranslation();
  const store = useAppStore();
  const router = useRouter();

  const [activeAudience, setActiveAudience] = useState<GuideAudience>('SCHOOL');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>('school-onboarding');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roadmapRole, setRoadmapRole] = useState<'SCHOOL' | 'HOST'>('SCHOOL');

  // Active category
  const currentCategory = useMemo(() => {
    return (
      PLATFORM_GUIDE_DATA.find((c) => c.id === activeAudience) ||
      PLATFORM_GUIDE_DATA[0]
    );
  }, [activeAudience]);

  // When audience changes, select the first topic of that audience
  const handleAudienceChange = (aud: GuideAudience) => {
    setActiveAudience(aud);
    if (aud === 'HOST') {
      setRoadmapRole('HOST');
    } else if (aud === 'SCHOOL') {
      setRoadmapRole('SCHOOL');
    }
    const cat = PLATFORM_GUIDE_DATA.find((c) => c.id === aud);
    if (cat && cat.topics.length > 0) {
      setSelectedTopicId(cat.topics[0].id);
    }
  };

  // Quick Chip trigger: jumps straight to the target audience & topic
  const handleQuickChipClick = (chip: QuickChip) => {
    setActiveAudience(chip.targetAudience);
    if (chip.targetAudience === 'HOST') setRoadmapRole('HOST');
    setSelectedTopicId(chip.targetTopicId);
    setSearchQuery('');
  };

  // Roadmap Step trigger: jumps straight to the target audience & topic, scrolls down to deep dive
  const handleRoadmapSelect = (step: RoadmapStep) => {
    setActiveAudience(step.targetAudience);
    if (step.targetAudience === 'HOST') setRoadmapRole('HOST');
    setSelectedTopicId(step.targetTopicId);
    setSearchQuery('');
    if (typeof window !== 'undefined') {
      const el = document.getElementById('topic-deep-dive');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Global Universal Search across ALL categories when search query is active
  const globalSearchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const q = searchQuery.toLowerCase().trim();

    const results: { topic: GuideTopic; category: GuideCategory }[] = [];

    for (const cat of PLATFORM_GUIDE_DATA) {
      for (const topic of cat.topics) {
        const title = (locale === 'en' ? topic.titleEn : topic.titleTr).toLowerCase();
        const summary = (locale === 'en' ? topic.summaryEn : topic.summaryTr).toLowerCase();
        const goal = (locale === 'en' ? topic.goalEn : topic.goalTr).toLowerCase();
        const highlights = (locale === 'en' ? topic.keyHighlightsEn : topic.keyHighlightsTr) || [];
        const hasHighlightMatch = highlights.some((h) => h.toLowerCase().includes(q));

        const hasStepMatch = topic.steps.some((step) => {
          const action = (locale === 'en' ? step.actionEn : step.actionTr).toLowerCase();
          const stepTitle = (locale === 'en' ? step.titleEn : step.titleTr).toLowerCase();
          const tip = (locale === 'en' ? step.expertTipEn : step.expertTipTr) || '';
          return action.includes(q) || stepTitle.includes(q) || tip.toLowerCase().includes(q);
        });

        if (title.includes(q) || summary.includes(q) || goal.includes(q) || hasHighlightMatch || hasStepMatch) {
          results.push({ topic, category: cat });
        }
      }
    }
    return results;
  }, [searchQuery, locale]);

  // Category topics (when not searching globally)
  const categoryTopics = useMemo(() => {
    return currentCategory.topics;
  }, [currentCategory]);

  // Current selected active topic
  const activeTopic = useMemo(() => {
    if (!selectedTopicId) return currentCategory.topics[0] || null;
    for (const cat of PLATFORM_GUIDE_DATA) {
      const found = cat.topics.find((t) => t.id === selectedTopicId);
      if (found) return found;
    }
    return currentCategory.topics[0] || null;
  }, [selectedTopicId, currentCategory]);

  // Find previous and next topic in the current category
  const { prevTopic, nextTopic } = useMemo(() => {
    if (!activeTopic) return { prevTopic: null, nextTopic: null };
    const idx = currentCategory.topics.findIndex((t) => t.id === activeTopic.id);
    return {
      prevTopic: idx > 0 ? currentCategory.topics[idx - 1] : null,
      nextTopic: idx < currentCategory.topics.length - 1 ? currentCategory.topics[idx + 1] : null,
    };
  }, [activeTopic, currentCategory]);

  const handleDemoLaunch = (role: 'SCHOOL' | 'HOST') => {
    if (role === 'HOST') {
      store.loadHostDemoData(locale);
    } else {
      store.loadDemoData(locale);
    }

    if (onSelectRole) {
      onSelectRole(role);
    } else {
      router.push('/');
    }
  };

  return (
    <div className="space-y-6 w-full animate-fadeIn">
      {/* HERO SECTION */}
      {showHeaderBanner && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-lg border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                <span>📖</span>
                <span>
                  {locale === 'en'
                    ? 'ErasmusMobility Operational Handbook & Practical Guide'
                    : 'ErasmusMobility Kullanım Kılavuzu & Pratik Süreç Rehberi'}
                </span>
                <span className="text-[10px] bg-blue-400/20 px-1.5 py-0.5 rounded text-blue-200">
                  2026/2027
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {locale === 'en'
                  ? 'Interactive Platform Operating Manual'
                  : 'Modüler Platform Kullanım & Operasyon Kılavuzu'}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                {locale === 'en'
                  ? 'Plain-language, step-by-step guidance for Vocational High Schools, European Host Enterprises, and Coordinators. Learn exact workflows, grant calculations, and Erasmus+ regulatory criteria without bureaucratic confusion.'
                  : 'Mesleki Eğitim Okulları, Avrupalı Ev Sahibi İşletmeler ve Koordinatörler için bürokratik karmaşadan uzak, adım adım ekran akışları, hibe hesaplamaları ve resmi mevzuat rehberi.'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap shrink-0">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-white hover:bg-slate-100 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                title={locale === 'en' ? 'Print Guide / Save PDF' : 'Kılavuzu Yazdır / PDF Olarak Kaydet'}
              >
                <span>🖨️</span>
                <span>{locale === 'en' ? 'Print / PDF' : 'Yazdır / PDF'}</span>
              </button>

              <Link
                href="/school/pipeline"
                className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5"
              >
                <span>🚀</span>
                <span>{locale === 'en' ? 'Open Pipeline' : 'Pipeline’a Git'}</span>
              </Link>
            </div>
          </div>

          {/* LEVEL 1: AUDIENCE ROLE TABS */}
          <div className="relative z-10 mt-8 flex items-center gap-2 overflow-x-auto no-scrollbar pt-3 border-t border-slate-800">
            {PLATFORM_GUIDE_DATA.map((cat) => {
              const isSelected = activeAudience === cat.id && !globalSearchResults;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    handleAudienceChange(cat.id);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
                  }`}
                >
                  <span className="text-base">{cat.icon}</span>
                  <span>{locale === 'en' ? cat.labelEn : cat.labelTr}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-md text-[10px] font-semibold ${
                      isSelected ? 'bg-blue-700 text-blue-100' : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {cat.topics.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 🧭 3 DAKİKADA HIZLI BAŞLANGIÇ YOL HARİTASI (INTERACTIVE WORKFLOW STEPPER) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span>🧭</span>
              <span>
                {locale === 'en'
                  ? '3-Minute Practical Start Map'
                  : '3 Dakikada Pratik Başlangıç Haritası'}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              {locale === 'en'
                ? 'How to Operate the Platform? Quick Step-by-Step Flow'
                : 'Platformu Nasıl Kullanırım? En Sade Süreç Akışı'}
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {locale === 'en'
                ? 'Choose your role to see the straightforward 3-4 steps from initial setup to formal proposal export.'
                : 'Rolünüzü seçin; kurulumdan hibe başvuru dosyasına kadar izlemeniz gereken 3-4 temel adımı tek bakışta görün.'}
            </p>
          </div>

          {/* Role Toggle Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80 shrink-0 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => {
                setRoadmapRole('SCHOOL');
                if (activeAudience !== 'SCHOOL') handleAudienceChange('SCHOOL');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                roadmapRole === 'SCHOOL'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏛️</span>
              <span>{locale === 'en' ? 'For Schools (4 Steps)' : 'Okullar İçin (4 Adım)'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRoadmapRole('HOST');
                if (activeAudience !== 'HOST') handleAudienceChange('HOST');
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                roadmapRole === 'HOST'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>🏢</span>
              <span>{locale === 'en' ? 'For European Hosts (3 Steps)' : 'Ev Sahipleri İçin (3 Adım)'}</span>
            </button>
          </div>
        </div>

        {/* Roadmap Cards Grid */}
        <div
          className={`grid grid-cols-1 ${
            roadmapRole === 'SCHOOL'
              ? 'md:grid-cols-2 xl:grid-cols-4'
              : 'md:grid-cols-3'
          } gap-4`}
        >
          {(roadmapRole === 'SCHOOL' ? SCHOOL_ROADMAP_STEPS : HOST_ROADMAP_STEPS).map(
            (step) => {
              const isTopicActive = selectedTopicId === step.targetTopicId && !searchQuery;
              return (
                <div
                  key={step.step}
                  className={`bg-slate-50/80 hover:bg-white border rounded-2xl p-4 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between group ${
                    isTopicActive
                      ? 'border-blue-500 bg-white ring-2 ring-blue-500/10'
                      : 'border-slate-200/80 hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-[11px] font-black flex items-center justify-center shrink-0 shadow-2xs">
                        {step.step}
                      </span>
                      <span className="text-xl">{step.icon}</span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-blue-900 transition-colors leading-snug">
                      {locale === 'en' ? step.titleEn : step.titleTr}
                    </h3>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {locale === 'en' ? step.descEn : step.descTr}
                    </p>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/70 flex items-center justify-between gap-1.5">
                    {step.directRoute ? (
                      <Link
                        href={step.directRoute}
                        className="px-2.5 py-1 text-[11px] font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors inline-flex items-center gap-1 shadow-2xs"
                      >
                        <span>
                          {locale === 'en'
                            ? step.directRouteLabelEn || 'Open'
                            : step.directRouteLabelTr || 'Aç'}
                        </span>
                        <span>→</span>
                      </Link>
                    ) : (
                      <div />
                    )}

                    <button
                      type="button"
                      onClick={() => handleRoadmapSelect(step)}
                      className="px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                      title={locale === 'en' ? 'Read in guide' : 'Kılavuz detayını oku'}
                    >
                      <span>📖</span>
                      <span>{locale === 'en' ? 'Guide' : 'Rehber'}</span>
                    </button>
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* MAIN TWO-COLUMN DOCUMENTATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIDEBAR: SEARCH, QUICK CHIPS & TOPIC LIST (4 COLS) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Universal Search Box & Quick Chips */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                {globalSearchResults
                  ? (locale === 'en' ? 'Global Search Results' : 'Genel Arama Sonuçları')
                  : (locale === 'en' ? currentCategory.badgeEn : currentCategory.badgeTr)}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {globalSearchResults ? `${globalSearchResults.length} ${locale === 'en' ? 'found' : 'bulundu'}` : `${categoryTopics.length} ${locale === 'en' ? 'topics' : 'konu'}`}
              </span>
            </div>

            {/* Input with Clear */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={locale === 'en' ? 'Search all topics, grant formulas, OID, rules...' : 'Tüm rehberde ara: Hibe, OID, yeşil seyahat, staj...'}
                className="w-full pl-8 pr-7 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 placeholder-slate-400"
              />
              <span className="absolute left-2.5 top-3 text-slate-400 text-xs">🔍</span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 text-xs cursor-pointer font-bold"
                  title="Aramayı Temizle"
                >
                  ✕
                </button>
              )}
            </div>

            {/* 🔥 En Çok Merak Edilen Konular (Quick Curiosity Chips) */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                {locale === 'en' ? '🔥 Frequently Asked Questions & Quick Shortcuts' : '🔥 En Çok Merak Edilen Konular'}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CURIOSITY_CHIPS.map((chip) => {
                  const isChipActive = selectedTopicId === chip.targetTopicId && !searchQuery;
                  return (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => handleQuickChipClick(chip)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                        isChipActive
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border-slate-200/80 hover:border-blue-300'
                      }`}
                    >
                      <span>{chip.icon}</span>
                      <span>{locale === 'en' ? chip.labelEn : chip.labelTr}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Topics Navigation Cards List */}
          <div className="space-y-2">
            {/* Case A: Global Search Results View */}
            {globalSearchResults !== null ? (
              globalSearchResults.length > 0 ? (
                globalSearchResults.map(({ topic, category }) => {
                  const isActive = activeTopic?.id === topic.id;
                  const categoryBadgeColor =
                    category.id === 'SCHOOL'
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : category.id === 'HOST'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : category.id === 'FAQ'
                      ? 'bg-amber-50 text-amber-800 border-amber-200'
                      : 'bg-purple-50 text-purple-700 border-purple-200';

                  return (
                    <div
                      key={topic.id}
                      onClick={() => {
                        setActiveAudience(category.id);
                        setSelectedTopicId(topic.id);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                        isActive
                          ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10'
                          : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                      }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center shrink-0 ${
                          isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {topic.icon}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${categoryBadgeColor}`}>
                            {category.icon} {locale === 'en' ? category.labelEn : category.labelTr}
                          </span>
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {topic.steps.length} {locale === 'en' ? 'steps' : 'adım'}
                          </span>
                        </div>
                        <h3
                          className={`text-xs font-bold truncate ${
                            isActive ? 'text-blue-900' : 'text-slate-900'
                          }`}
                        >
                          {locale === 'en' ? topic.titleEn : topic.titleTr}
                        </h3>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                          {locale === 'en' ? topic.summaryEn : topic.summaryTr}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-6 text-center text-xs text-slate-500 space-y-2">
                  <span className="text-2xl block">🔍</span>
                  <p className="font-semibold text-slate-700">
                    {locale === 'en'
                      ? `No results found for "${searchQuery}".`
                      : `"${searchQuery}" için sonuç bulunamadı.`}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {locale === 'en'
                      ? 'Try searching with shorter keywords like "grant", "host", "KA121", "visa".'
                      : 'Lütfen "hibe", "ev sahibi", "KA121", "vize", "staj" gibi daha kısa anahtar kelimeler deneyin.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="mt-2 text-xs font-bold text-blue-700 hover:underline cursor-pointer"
                  >
                    {locale === 'en' ? 'Clear search' : 'Aramayı Temizle'}
                  </button>
                </div>
              )
            ) : (
              /* Case B: Standard Category Topic List */
              categoryTopics.map((topic: GuideTopic) => {
                const isActive = activeTopic?.id === topic.id;
                return (
                  <div
                    key={topic.id}
                    onClick={() => setSelectedTopicId(topic.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isActive
                        ? 'bg-white border-blue-500 shadow-md ring-2 ring-blue-500/10'
                        : 'bg-white/80 hover:bg-white border-slate-200/80 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-lg text-lg flex items-center justify-center shrink-0 ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {topic.icon}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <h3
                          className={`text-xs font-bold truncate ${
                            isActive ? 'text-blue-900' : 'text-slate-900'
                          }`}
                        >
                          {locale === 'en' ? topic.titleEn : topic.titleTr}
                        </h3>
                        <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                          {topic.steps.length} {locale === 'en' ? 'steps' : 'adım'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {locale === 'en' ? topic.summaryEn : topic.summaryTr}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Demo Trigger Box in Sidebar */}
          <div className="bg-[#0B1930] text-white rounded-2xl p-5 shadow-xs space-y-3 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚡</span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-300">
                {locale === 'en' ? 'Live Interactive Demo' : 'Canlı İnteraktif Simülasyon'}
              </h4>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {locale === 'en'
                ? 'Test the platform without registration using realistic accredited school or European host datasets.'
                : 'Kayıt olmadan, gerçekçi KA121 okul veya Berlin ev sahibi işletme demo verisiyle tüm araçları canlı deneyimleyin.'}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => handleDemoLaunch('SCHOOL')}
                className="flex-1 text-center py-2 px-3 text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 rounded-lg transition-colors shadow-2xs cursor-pointer"
              >
                🏛️ {locale === 'en' ? 'School Demo' : 'Okul Demosu'}
              </button>
              <button
                type="button"
                onClick={() => handleDemoLaunch('HOST')}
                className="flex-1 text-center py-2 px-3 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors shadow-2xs border border-emerald-200 cursor-pointer"
              >
                🏢 {locale === 'en' ? 'Host Demo' : 'Host Demosu'}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: EXPANDED TOPIC DEEP-DIVE (8 COLS) */}
        <div id="topic-deep-dive" className="lg:col-span-8">
          {activeTopic ? (
            <div className="space-y-6">
              {/* Topic Header Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 shadow-xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 border border-blue-200 text-3xl flex items-center justify-center shrink-0 shadow-2xs">
                      {activeTopic.icon}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          {activeAudience}
                        </span>
                        {activeTopic.route && (
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {activeTopic.route}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {locale === 'en' ? activeTopic.titleEn : activeTopic.titleTr}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {locale === 'en' ? activeTopic.summaryEn : activeTopic.summaryTr}
                      </p>
                    </div>
                  </div>

                  {/* Target Route Link */}
                  {activeTopic.route && (
                    <Link
                      href={activeTopic.route}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-xs inline-flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
                    >
                      <span>
                        {locale === 'en'
                          ? activeTopic.routeLabelEn || 'Open Module'
                          : activeTopic.routeLabelTr || 'Modülü Aç'}
                      </span>
                      <span>→</span>
                    </Link>
                  )}
                </div>

                {/* Objective Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs sm:text-sm text-slate-800 space-y-1">
                  <span className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>🎯</span>
                    <span>{locale === 'en' ? 'Objective & Goal' : 'Amaç & Hedef'}:</span>
                  </span>
                  <p className="text-slate-700 leading-relaxed pl-6">
                    {locale === 'en' ? activeTopic.goalEn : activeTopic.goalTr}
                  </p>
                </div>

                {/* Key Highlights */}
                {activeTopic.keyHighlightsTr && (
                  <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                      <span>✨</span>
                      <span>{locale === 'en' ? 'Official Standards & Highlights' : 'Öne Çıkan Standartlar & Kurallar'}</span>
                    </span>
                    <ul className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700 list-disc list-inside pl-1">
                      {(locale === 'en'
                        ? activeTopic.keyHighlightsEn!
                        : activeTopic.keyHighlightsTr!
                      ).map((h, i) => (
                        <li key={i} className="leading-snug">
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Criteria & Parameters Table if available */}
                {activeTopic.parametersTable && (
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 block">
                      📊 {locale === 'en' ? 'Decision Criteria & Regulatory Parameters' : 'Karar Kriterleri & Mevzuat Parametreleri'}
                    </span>
                    <div className="overflow-x-auto rounded-xl border border-slate-200/90">
                      <table className="w-full text-left text-xs border-collapse">
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {activeTopic.parametersTable.map((param, i) => (
                            <tr key={i} className="hover:bg-slate-50/80">
                              <td className="py-2.5 px-3.5 font-bold text-slate-900 whitespace-nowrap bg-slate-50/50 w-1/3">
                                {locale === 'en' ? param.labelEn : param.labelTr}
                              </td>
                              <td className="py-2.5 px-3.5 text-slate-700 leading-relaxed">
                                {locale === 'en' ? param.valueEn : param.valueTr}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP-BY-STEP WORKFLOW LIST */}
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {locale === 'en'
                      ? `Step-by-Step Action Plan (${activeTopic.steps.length} Steps)`
                      : `Adım Adım Ekran & Buton Akışı (${activeTopic.steps.length} Adım)`}
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    {locale === 'en' ? 'Follow sequentially' : 'Sırayla takip edin'}
                  </span>
                </div>

                <div className="space-y-3.5">
                  {activeTopic.steps.map((step: GuideStepAction) => (
                    <div
                      key={step.stepNumber}
                      className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                    >
                      {/* Step Title Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-blue-700 text-white text-xs font-black flex items-center justify-center shrink-0 shadow-2xs">
                            {step.stepNumber}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">
                            {locale === 'en' ? step.titleEn : step.titleTr}
                          </h4>
                        </div>

                        {/* UI Target Pill & Direct Screen Link */}
                        <div className="flex items-center gap-2 flex-wrap shrink-0 self-start sm:self-auto">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <span className="text-blue-600">🖱️</span>
                            <span>{locale === 'en' ? step.uiTargetEn : step.uiTargetTr}</span>
                          </div>
                          {activeTopic.route && (
                            <Link
                              href={activeTopic.route}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition-colors shadow-2xs"
                            >
                              <span>{locale === 'en' ? 'Open Screen' : 'Bu Ekranı Aç'}</span>
                              <span>→</span>
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Step Action Description */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-11">
                        {locale === 'en' ? step.actionEn : step.actionTr}
                      </p>

                      {/* Callout Sub-Boxes */}
                      <div className="pl-11 grid gap-2 pt-1">
                        {step.expectedStateTr && (
                          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-3.5 py-2.5 text-xs text-emerald-900 flex items-start gap-2.5">
                            <span className="font-bold shrink-0 text-sm">⚙️</span>
                            <div>
                              <span className="font-bold mr-1">
                                {locale === 'en' ? 'System Output / Result:' : 'Beklenen Sistem Durumu:'}
                              </span>
                              <span className="leading-relaxed">
                                {locale === 'en' ? step.expectedStateEn : step.expectedStateTr}
                              </span>
                            </div>
                          </div>
                        )}

                        {step.expertTipTr && (
                          <div className="bg-amber-50 border border-amber-200/80 rounded-xl px-3.5 py-2.5 text-xs text-amber-900 flex items-start gap-2.5">
                            <span className="font-bold shrink-0 text-sm">💡</span>
                            <div>
                              <span className="font-bold mr-1">
                                {locale === 'en' ? 'Erasmus+ Coordinator Tip:' : 'Erasmus+ Koordinatör İpucu:'}
                              </span>
                              <span className="leading-relaxed">
                                {locale === 'en' ? step.expertTipEn : step.expertTipTr}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* BOTTOM TOPIC PAGINATION FOOTER */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex items-center justify-between gap-4">
                {prevTopic ? (
                  <button
                    type="button"
                    onClick={() => setSelectedTopicId(prevTopic.id)}
                    className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <span>←</span>
                    <span className="hidden sm:inline">
                      {locale === 'en' ? prevTopic.titleEn : prevTopic.titleTr}
                    </span>
                    <span className="sm:hidden">{locale === 'en' ? 'Previous' : 'Önceki'}</span>
                  </button>
                ) : (
                  <div />
                )}

                {nextTopic ? (
                  <button
                    type="button"
                    onClick={() => setSelectedTopicId(nextTopic.id)}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors cursor-pointer shadow-2xs flex items-center gap-1.5"
                  >
                    <span className="hidden sm:inline">
                      {locale === 'en' ? nextTopic.titleEn : nextTopic.titleTr}
                    </span>
                    <span className="sm:hidden">{locale === 'en' ? 'Next' : 'Sonraki'}</span>
                    <span>→</span>
                  </button>
                ) : (
                  <div />
                )}
              </div>

              {/* "SORUNUZ CEVAPSIZ MI KALDI?" INTERACTION BLOCK */}
              <div className="bg-slate-100 rounded-2xl border border-slate-300 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl shrink-0">💬</span>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 m-0">
                      {locale === 'en' ? 'Have a Specific Question Unanswered?' : 'Sorunuza Cevap Bulamadınız mı?'}
                    </h4>
                    <p className="text-xs text-slate-600 m-0 mt-0.5">
                      {locale === 'en'
                        ? 'Explore the live pipeline calculator, test live demo simulations, or ask the ErasmusAI assistant.'
                        : 'Canlı hareketlilik pipeline’ını test edin, hibe hesaplayıcıyı deneyin veya ErasmusAI mevzuat danışmanına sorun.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap shrink-0 w-full md:w-auto">
                  <Link
                    href="/school/pipeline"
                    className="flex-1 md:flex-initial px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5"
                  >
                    <span>🚀</span>
                    <span>{locale === 'en' ? 'Open Pipeline' : '5 Adımlı Pipeline'}</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="flex-1 md:flex-initial px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>🖨️</span>
                    <span>{locale === 'en' ? 'Print Guide' : 'Yazdır / PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
