'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';
import { BeneficiaryCategory } from '../ui/BeneficiariesModal';
import { trSearchMatch } from '../../lib/locale-case';

import meslekLiseleriData from '../../lib/data/meslek_liseleri.json';
import halkEgitimData from '../../lib/data/halk_egitim.json';
import olgunlasmaData from '../../lib/data/olgunlasma_enstituleri.json';
import memData from '../../lib/data/milli_egitim_mudurlukleri.json';
import osbData from '../../lib/data/osb.json';
import ttsoData from '../../lib/data/ttso.json';
import esnafData from '../../lib/data/esnaf.json';

export interface MebCatalogStatsSectionProps {
  onSelectCategory?: (category: BeneficiaryCategory, initialSearch?: string) => void;
}

export default function MebCatalogStatsSection({
  onSelectCategory,
}: MebCatalogStatsSectionProps) {
  const { locale } = useTranslation();
  const [quickSearch, setQuickSearch] = useState('');

  // Total counts directly from source datasets
  const counts = {
    MESLEK_LISELERI: meslekLiseleriData.length,
    HALK_EGITIM: halkEgitimData.length,
    OSB: osbData.length,
    TTSO: ttsoData.length,
    ESNAF: esnafData.length,
    MEM: memData.length,
    OLGUNLASMA: olgunlasmaData.length,
  };

  const totalCount =
    counts.MESLEK_LISELERI +
    counts.HALK_EGITIM +
    counts.OSB +
    counts.TTSO +
    counts.ESNAF +
    counts.MEM +
    counts.OLGUNLASMA;

  // Real-time Turkish-aware match count across all 7 categories
  const liveMatchCounts = useMemo(() => {
    const q = quickSearch.trim();
    if (!q) return null;

    const filterList = (list: any[]) =>
      list.filter(
        (item: any) =>
          trSearchMatch(item.kurumAdi, q) ||
          trSearchMatch(item.il, q) ||
          trSearchMatch(item.ilce, q) ||
          trSearchMatch(item.kurumKodu, q) ||
          trSearchMatch(item.eposta, q)
      ).length;

    const res = {
      MESLEK_LISELERI: filterList(meslekLiseleriData),
      HALK_EGITIM: filterList(halkEgitimData),
      OSB: filterList(osbData),
      TTSO: filterList(ttsoData),
      ESNAF: filterList(esnafData),
      MEM: filterList(memData),
      OLGUNLASMA: filterList(olgunlasmaData),
    };

    const totalMatches =
      res.MESLEK_LISELERI +
      res.HALK_EGITIM +
      res.OSB +
      res.TTSO +
      res.ESNAF +
      res.MEM +
      res.OLGUNLASMA;

    return { ...res, totalMatches };
  }, [quickSearch]);

  const handleCardClick = (category: BeneficiaryCategory) => {
    if (onSelectCategory) {
      onSelectCategory(category, quickSearch.trim() || undefined);
    }
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = quickSearch.trim();

    // Determine the optimal initial category based on match distribution
    let targetCategory: BeneficiaryCategory = 'MESLEK_LISELERI';
    if (liveMatchCounts && liveMatchCounts.totalMatches > 0) {
      if (liveMatchCounts.MESLEK_LISELERI === 0) {
        const catKeys: BeneficiaryCategory[] = [
          'HALK_EGITIM',
          'OSB',
          'TTSO',
          'ESNAF',
          'MEM',
          'OLGUNLASMA',
        ];
        let maxCount = 0;
        for (const cat of catKeys) {
          if (liveMatchCounts[cat] > maxCount) {
            maxCount = liveMatchCounts[cat];
            targetCategory = cat;
          }
        }
      }
    }

    if (onSelectCategory) {
      onSelectCategory(targetCategory, query || undefined);
    }
  };


  const categories = [
    {
      id: 'MESLEK_LISELERI' as BeneficiaryCategory,
      titleTr: 'Meslek Liseleri & VET Merkezleri',
      titleEn: 'Vocational High Schools (VET)',
      count: counts.MESLEK_LISELERI,
      icon: '🏫',
      badgeTr: 'KA121 / KA122 Konsorsiyumları',
      badgeEn: 'KA121 / KA122 Consortia',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      descTr: '81 ildeki Anadolu Meslek (AML), Teknik Programlar (ATP) ve Çok Programlı Liseler.',
      descEn: 'Anatolian Vocational and Technical High Schools across 81 provinces in Turkey.',
    },
    {
      id: 'HALK_EGITIM' as BeneficiaryCategory,
      titleTr: 'Halk Eğitimi Merkezleri (HEM)',
      titleEn: 'Public & Adult Education Centres',
      count: counts.HALK_EGITIM,
      icon: '🎓',
      badgeTr: 'Yetişkin Eğitimi & Kurslar',
      badgeEn: 'Adult Education & Lifelong',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      descTr: 'Hayat boyu öğrenme kapsamında mesleki beceri, el sanatları ve yetişkin eğitimi merkezleri.',
      descEn: 'Lifelong learning institutions focused on adult skills, crafts and vocational re-skilling.',
    },
    {
      id: 'OSB' as BeneficiaryCategory,
      titleTr: 'Organize Sanayi Bölgeleri (OSB)',
      titleEn: 'Organized Industrial Zones (OIZ)',
      count: counts.OSB,
      icon: '🏭',
      badgeTr: 'İşletmede Beceri Eğitimi',
      badgeEn: 'Work-Based Apprenticeship',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      descTr: 'Sanayi-okul işbirlikleri, çıraklık protokolleri ve üretim tesislerinde staj imkanları.',
      descEn: 'Industrial parks collaborating with schools for student apprenticeships and hands-on training.',
    },
    {
      id: 'TTSO' as BeneficiaryCategory,
      titleTr: 'Ticaret ve Sanayi Odaları (TSO)',
      titleEn: 'Chambers of Commerce & Industry',
      count: counts.TTSO,
      icon: '💼',
      badgeTr: 'Konsorsiyum & İş Dünyası',
      badgeEn: 'Consortium & Enterprise Network',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      descTr: 'TOBB bünyesinde yerel iş dünyası, kurumsal ortaklıklar ve sektörel istihdam ağları.',
      descEn: 'Local business chambers enabling corporate networking, dual education, and regional partnerships.',
    },
    {
      id: 'ESNAF' as BeneficiaryCategory,
      titleTr: 'Esnaf ve Sanatkarlar Odaları (ESOB)',
      titleEn: 'Tradesmen & Craftsmen Associations',
      count: counts.ESNAF,
      icon: '🛠️',
      badgeTr: 'KOBİ & Zanaat Staj Ağı',
      badgeEn: 'SME Apprentice Network',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      descTr: 'TESK bünyesindeki 81 il birlikleri; geleneksel zanaat ve KOBİ çıraklık merkezleri.',
      descEn: 'Regional artisan and craft associations supporting micro-enterprise apprenticeships.',
    },
    {
      id: 'MEM' as BeneficiaryCategory,
      titleTr: 'İl Milli Eğitim Müdürlükleri (MEM)',
      titleEn: 'Provincial Directorates of Education',
      count: counts.MEM,
      icon: '📍',
      badgeTr: '81 İl Koordinasyon Lideri',
      badgeEn: '81 Province Leaders',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      descTr: 'İl akreditasyon konsorsiyum liderleri, AR-GE birimleri ve resmi Erasmus+ irtibat noktaları.',
      descEn: 'Provincial governing bodies leading accredited Erasmus+ consortia and project offices.',
    },
    {
      id: 'OLGUNLASMA' as BeneficiaryCategory,
      titleTr: 'Olgunlaşma Enstitüleri',
      titleEn: 'Traditional Craft & Design Institutes',
      count: counts.OLGUNLASMA,
      icon: '🧵',
      badgeTr: 'Geleneksel Tasarım & İhtisas',
      badgeEn: 'Design & Cultural Heritage',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      descTr: 'Kültürel miras, geleneksel el sanatları, moda ve tasarım alanında uzmanlaşmış 32 enstitü.',
      descEn: '32 specialized institutes safeguarding cultural textile heritage and traditional design crafts.',
    },
  ];

  return (
    <section className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 space-y-8">
      {/* 1. Header with Official Trust Badge */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-slate-200">
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
            <span>🏛️</span>
            <span>
              {locale === 'tr'
                ? 'MEB Açık Veri Referans Kataloğu • Türkiye VET Atlası'
                : 'MEB Open Data Reference Directory • Turkey VET Atlas'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 tracking-tight m-0">
            {locale === 'tr'
              ? '81 İl Resmi Kurum ve Mesleki Eğitim Ekosistemi'
              : 'Official VET Ecosystem Across 81 Provinces'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0 font-normal">
            {locale === 'tr'
              ? 'Erasmus+ KA121 ve KA122 projelerinde akreditasyon, konsorsiyum ortaklıkları ve staj operasyonları için taranmış doğrulanmış açık veri rehberi. Herhangi bir karta tıklayarak kurum detaylarına anında ulaşabilirsiniz.'
              : 'Verified open data directory for Erasmus+ KA121/KA122 school consortia, accreditation, and work placements. Click any category card to inspect full institutional records.'}
          </p>
        </div>

        {/* Global Summary Metric Callout */}
        <div className="bg-slate-900 text-white rounded-2xl p-5 shrink-0 flex items-center gap-5 shadow-sm border border-slate-800">
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {locale === 'tr' ? 'Toplam Kayıtlı Kurum' : 'Total Institutions'}
            </div>
            <div className="text-3xl font-black text-amber-400 tracking-tight mt-0.5">
              {totalCount.toLocaleString('tr-TR')}
            </div>
            <div className="text-[11px] text-slate-300 font-medium mt-0.5">
              {locale === 'tr' ? '81 il • 7 resmi kategori' : '81 provinces • 7 categories'}
            </div>
          </div>
          <div className="w-px h-12 bg-slate-700 hidden sm:block" />
          <div className="hidden sm:block">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {locale === 'tr' ? 'Coğrafi Kapsam' : 'Coverage'}
            </div>
            <div className="text-2xl font-black text-white tracking-tight mt-0.5">
              %100
            </div>
            <div className="text-[11px] text-emerald-400 font-medium mt-0.5">
              {locale === 'tr' ? 'Resmi Açık Veri' : 'Verified Directory'}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Quick Search Bar */}
      <div className="space-y-2">
        <form onSubmit={handleSearchSubmit} className="relative">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl p-2.5 sm:p-2 shadow-2xs">
            <div className="relative flex-1 flex items-center">
              <span className="absolute left-3.5 text-slate-400 text-base pointer-events-none">🔍</span>
              <input
                type="text"
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder={
                  locale === 'tr'
                    ? 'Okul adı, il, ilçe veya kurum kodu ile 4.800+ kurum arasında arayın (Örn: Kadıköy, Bilişim, E10...)'
                    : 'Search by institution name, city, or code across 4,800+ institutions...'
                }
                className="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
              {quickSearch && (
                <button
                  type="button"
                  onClick={() => setQuickSearch('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
                  title={locale === 'tr' ? 'Temizle' : 'Clear'}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="flex-1 sm:flex-initial px-5 py-2.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shrink-0"
              >
                <span>{locale === 'tr' ? 'Sonuçları Listele' : 'Search Directory'}</span>
                <span>→</span>
              </button>

              <Link
                href={
                  quickSearch.trim()
                    ? `/directory?search=${encodeURIComponent(quickSearch.trim())}`
                    : '/directory'
                }
                className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 shadow-2xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>📑</span>
                <span className="hidden sm:inline">
                  {locale === 'tr' ? 'Tam Sayfa Katalog' : 'Full Directory Page'}
                </span>
              </Link>
            </div>
          </div>
        </form>

        {/* Live Search Instant Match Notification */}
        {quickSearch.trim().length >= 2 && liveMatchCounts && (
          <div
            onClick={() => handleSearchSubmit()}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-between gap-3 cursor-pointer transition-all ${
              liveMatchCounts.totalMatches > 0
                ? 'bg-blue-50/80 border-blue-200 text-blue-950 hover:bg-blue-100'
                : 'bg-amber-50 border-amber-200 text-amber-900'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span>{liveMatchCounts.totalMatches > 0 ? '🎯' : '⚠️'}</span>
              <span className="truncate">
                {liveMatchCounts.totalMatches > 0
                  ? locale === 'tr'
                    ? `"${quickSearch.trim()}" için toplam ${liveMatchCounts.totalMatches} kayıt bulundu (Meslek Lisesi: ${liveMatchCounts.MESLEK_LISELERI}, HEM: ${liveMatchCounts.HALK_EGITIM}, OSB: ${liveMatchCounts.OSB}, MEM: ${liveMatchCounts.MEM}).`
                    : `Found ${liveMatchCounts.totalMatches} records matching "${quickSearch.trim()}".`
                  : locale === 'tr'
                  ? `"${quickSearch.trim()}" için kayıt bulunamadı. Lütfen il adı (örn: Kadıköy, İzmir) veya kurum kodu ile arayın.`
                  : `No records found matching "${quickSearch.trim()}".`}
              </span>
            </div>
            {liveMatchCounts.totalMatches > 0 && (
              <span className="shrink-0 font-bold text-blue-700 underline text-[11px]">
                {locale === 'tr' ? 'Sonuçları Aç →' : 'View Results →'}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 3. 7 Category Interactive Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        {categories.map((cat, idx) => {
          const isLargePrimary = idx === 0; // Meslek liseleri highlights as primary
          const displayCount = liveMatchCounts
            ? liveMatchCounts[cat.id]
            : cat.count;
          const isZeroMatch = liveMatchCounts && displayCount === 0;

          return (
            <div
              key={cat.id}
              onClick={() => handleCardClick(cat.id)}
              className={`group relative rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 cursor-pointer ${
                isZeroMatch
                  ? 'opacity-50 bg-slate-50 border-slate-200 hover:opacity-80'
                  : isLargePrimary
                  ? 'bg-blue-50/40 border-blue-200 hover:border-blue-400 hover:shadow-md md:col-span-2 lg:col-span-2 xl:col-span-2'
                  : 'bg-white border-slate-200/90 hover:border-slate-400 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                {/* Top Badge & Icon */}
                <div className="flex items-center justify-between gap-2">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-2xl flex items-center justify-center transition-colors shadow-2xs shrink-0">
                    {cat.icon}
                  </div>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${cat.badgeColor}`}
                  >
                    {locale === 'tr' ? cat.badgeTr : cat.badgeEn}
                  </span>
                </div>

                {/* Count & Title */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span
                      className={`text-3xl font-black tracking-tight transition-colors ${
                        liveMatchCounts && displayCount > 0
                          ? 'text-blue-700'
                          : 'text-slate-950 group-hover:text-blue-700'
                      }`}
                    >
                      {displayCount.toLocaleString('tr-TR')}
                    </span>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {liveMatchCounts
                        ? locale === 'tr'
                          ? 'Eşleşen Kurum'
                          : 'Matching'
                        : locale === 'tr'
                        ? 'Kayıtlı Kurum'
                        : 'Records'}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 mt-1 m-0 group-hover:text-blue-800 transition-colors">
                    {locale === 'tr' ? cat.titleTr : cat.titleEn}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed m-0 font-medium">
                  {locale === 'tr' ? cat.descTr : cat.descEn}
                </p>
              </div>

              {/* Action Trigger */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700 group-hover:text-blue-900 transition-colors">
                <span className="inline-flex items-center gap-1.5">
                  <span>{locale === 'tr' ? 'Kataloğu Aç & İncele' : 'Open Reference List'}</span>
                </span>
                <span className="w-6 h-6 rounded-lg bg-blue-50 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center transition-all text-xs font-black">
                  →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Footer Anchor Bar */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 text-slate-600">
          <span className="text-xl shrink-0">💡</span>
          <div>
            <strong className="text-slate-900 font-extrabold block">
              {locale === 'tr' ? 'Resmi Açık Veri Güvencesi' : 'Verified Open Reference Data'}
            </strong>
            <span className="text-slate-500">
              {locale === 'tr'
                ? 'Bu veri tabanı Milli Eğitim Bakanlığı, TOBB ve TESK açık veri kaynaklarından derlenmiş olup Erasmus+ başvuru ve ortaklık eşleştirmelerinde referans rehber olarak sunulmaktadır.'
                : 'Aggregated from official Ministry of National Education, TOBB, and TESK portals for Erasmus+ project preparation.'}
            </span>
          </div>
        </div>

        <Link
          href="/directory"
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-colors shadow-xs flex items-center gap-1.5 shrink-0 self-end sm:self-auto"
        >
          <span>{locale === 'tr' ? 'Tüm Atlası Görüntüle' : 'Browse Full Atlas'}</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
