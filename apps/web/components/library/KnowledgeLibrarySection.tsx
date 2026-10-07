'use client';

import React, { useState, useMemo } from 'react';
import { ExternalLink, Search, Sparkles, BookOpen, Filter, X } from 'lucide-react';
import {
  KNOWLEDGE_LIBRARY_CATEGORIES,
  KnowledgeCategory,
  KnowledgeResourceItem,
} from '../../lib/knowledge-library-data';
import { useTranslation } from '../../lib/i18n';

interface KnowledgeLibrarySectionProps {
  initialCategoryId?: string;
}

const BADGE_TRANSLATIONS: Record<string, { tr: string; en: string }> = {
  'Official Guide': { tr: 'Resmi Rehber', en: 'Official Guide' },
  'Standards': { tr: 'Standartlar', en: 'Standards' },
  'Database': { tr: 'Veri Tabanı', en: 'Database' },
  'Guide': { tr: 'Kılavuz', en: 'Guide' },
  'Templates': { tr: 'Şablonlar', en: 'Templates' },
  'Taxonomy': { tr: 'Taksonomi', en: 'Taxonomy' },
  'Integration': { tr: 'Entegrasyon', en: 'Integration' },
  'Directory': { tr: 'Dizin', en: 'Directory' },
  'Policy': { tr: 'Politika', en: 'Policy' },
  'Mobility': { tr: 'Hareketlilik', en: 'Mobility' },
  'Reports': { tr: 'Raporlar', en: 'Reports' },
  'Resources': { tr: 'Kaynaklar', en: 'Resources' },
  'Framework': { tr: 'Çerçeve', en: 'Framework' },
  'Cycle': { tr: 'Döngü', en: 'Cycle' },
  'Provider': { tr: 'Kurum Seviyesi', en: 'Provider Level' },
  'Virtual Library': { tr: 'Sanal Kütüphane', en: 'Virtual Library' },
  'Results': { tr: 'Sonuçlar', en: 'Results' },
  'Info': { tr: 'Bilgi', en: 'Info' },
  'FAQ': { tr: 'SSS', en: 'FAQ' },
};

export default function KnowledgeLibrarySection({ initialCategoryId }: KnowledgeLibrarySectionProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');

  // Total count of resources
  const totalResourceCount = useMemo(() => {
    return KNOWLEDGE_LIBRARY_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  }, []);

  // Filter categories and their items based on search and selected category
  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return KNOWLEDGE_LIBRARY_CATEGORIES.map((category) => {
      // If a specific category is selected and it doesn't match this one, skip items
      if (selectedCategory !== 'all' && category.id !== selectedCategory) {
        return { ...category, items: [] };
      }

      if (!query) {
        return category;
      }

      // Check if category title/description matches
      const catMatches =
        category.titleTr.toLowerCase().includes(query) ||
        category.titleEn.toLowerCase().includes(query) ||
        category.descriptionTr.toLowerCase().includes(query) ||
        category.descriptionEn.toLowerCase().includes(query);

      // Filter items
      const matchingItems = category.items.filter((item) => {
        if (catMatches) return true;
        return (
          item.titleTr.toLowerCase().includes(query) ||
          item.titleEn.toLowerCase().includes(query) ||
          (item.descriptionTr && item.descriptionTr.toLowerCase().includes(query)) ||
          (item.descriptionEn && item.descriptionEn.toLowerCase().includes(query)) ||
          (item.badge && item.badge.toLowerCase().includes(query)) ||
          item.url.toLowerCase().includes(query)
        );
      });

      return {
        ...category,
        items: matchingItems,
      };
    }).filter((category) => category.items.length > 0);
  }, [searchQuery, selectedCategory]);

  const activeResultsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);
  }, [filteredCategories]);

  return (
    <section id="knowledge-library" className="space-y-8 animate-fadeIn">
      {/* Header Container */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-blue-50 text-blue-900 border border-blue-200">
              {isTr ? 'ERASMUSMOBILITY KAYNAK MERKEZİ' : 'ERASMUSMOBILITY RESOURCE CENTRE'}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-200 font-mono">
              {totalResourceCount} {isTr ? 'Doğrulanmış Kaynak' : 'Verified Resources'}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
            {isTr ? 'ErasmusMobility Bilgi Kütüphanesi' : 'ErasmusMobility Knowledge Library'}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0">
            {isTr
              ? 'KA121 ve KA122 hareketlilik faaliyetlerinin planlanması, yürütülmesi ve değerlendirilmesi için resmi Erasmus+ kaynakları, hareketlilik rehberleri, VET standartları, beceri veri tabanları, proje çıktıları ve uygulama belgeleri.'
              : 'Explore official Erasmus+ resources, mobility guides, VET standards, skills databases, project examples and practical documents for planning, delivering and evaluating KA121 and KA122 mobility activities.'}
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-6 border-t border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-xl">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  isTr
                    ? 'Kaynak adı, kurum, ESCO, EQAVET veya anahtar kelime ara...'
                    : 'Search resource, organization, ESCO, EQAVET or keyword...'
                }
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-sm"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results counter indicator */}
            <div className="text-xs text-slate-500 font-semibold self-center sm:self-auto">
              {searchQuery ? (
                <span>
                  {isTr
                    ? `${activeResultsCount} sonuç bulundu`
                    : `${activeResultsCount} results found`}
                </span>
              ) : (
                <span>
                  {isTr ? `${totalResourceCount} bağlantı listeleniyor` : `Showing ${totalResourceCount} links`}
                </span>
              )}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
              }`}
            >
              {isTr ? 'Tümü' : 'All'} ({totalResourceCount})
            </button>

            {KNOWLEDGE_LIBRARY_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{isTr ? cat.titleTr : cat.titleEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id
                      ? 'bg-blue-800 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {cat.items.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* No results notice */}
      {filteredCategories.length === 0 && (
        <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 m-0">
            {isTr ? 'Aradığınız kriterlere uygun kaynak bulunamadı' : 'No matching resources found'}
          </h3>
          <p className="text-xs text-slate-500 m-0">
            {isTr
              ? 'Lütfen arama terimini değiştirin veya kategori filtresini sıfırlayın.'
              : 'Try adjusting your search keywords or clearing the category filter.'}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="mt-2 px-4 py-2 rounded-lg bg-blue-700 text-white text-xs font-bold hover:bg-blue-800 transition-colors"
          >
            {isTr ? 'Filtreleri Temizle' : 'Clear Filters'}
          </button>
        </div>
      )}

      {/* Grid of Categories and Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCategories.map((category) => (
          <article
            key={category.id}
            className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Category Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl" role="img" aria-label={category.titleEn}>
                    {category.icon}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-950 m-0 leading-snug">
                    {isTr ? category.titleTr : category.titleEn}
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
                  {category.items.length}
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-4 pb-3 border-b border-slate-100 leading-relaxed m-0">
                {isTr ? category.descriptionTr : category.descriptionEn}
              </p>

              {/* Items List */}
              <ul className="space-y-3.5 p-0 m-0 list-none">
                {category.items.map((item) => (
                  <li key={item.id} className="group/item">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2.5 -mx-2.5 rounded-xl hover:bg-blue-50/70 border border-transparent hover:border-blue-200 transition-all text-left"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-blue-700 group-hover/item:text-blue-900 group-hover/item:underline leading-snug">
                          {isTr ? item.titleTr : item.titleEn}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5 text-blue-500 opacity-70 group-hover/item:opacity-100 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all shrink-0 mt-0.5" />
                      </div>

                      {(item.descriptionTr || item.descriptionEn) && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed m-0">
                          {isTr ? item.descriptionTr : item.descriptionEn}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1.5">
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-slate-100 group-hover/item:bg-blue-100 text-slate-700 group-hover/item:text-blue-900 border border-slate-200 group-hover/item:border-blue-200 font-mono">
                            {isTr
                              ? (item.badgeTr || BADGE_TRANSLATIONS[item.badge || '']?.tr || item.badge)
                              : (item.badgeEn || BADGE_TRANSLATIONS[item.badge || '']?.en || item.badge)}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                          {item.url.replace(/^https?:\/\//, '').split('/')[0]}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Category Footer */}
            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium">
                {isTr ? 'Resmi Web Portali' : 'Official Portal'}
              </span>
              <span className="font-mono text-[10px] text-slate-400">
                HTTPS Verified
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
