'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import { useTranslation } from '../../lib/i18n';
import { BeneficiaryCategory } from '../../components/ui/BeneficiariesModal';

import meslekLiseleriData from '../../lib/data/meslek_liseleri.json';
import halkEgitimData from '../../lib/data/halk_egitim.json';
import olgunlasmaData from '../../lib/data/olgunlasma_enstituleri.json';
import memData from '../../lib/data/milli_egitim_mudurlukleri.json';
import osbData from '../../lib/data/osb.json';
import ttsoData from '../../lib/data/ttso.json';
import esnafData from '../../lib/data/esnaf.json';
import { trSearchMatch } from '../../lib/locale-case';


interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

function DirectoryContent() {
  const searchParams = useSearchParams();
  const { t, locale } = useTranslation();

  const initialCat = (searchParams?.get('category')?.toUpperCase() as BeneficiaryCategory) || 'MESLEK_LISELERI';
  const initialSearch = searchParams?.get('search') || '';

  const [activeCategory, setActiveCategory] = useState<BeneficiaryCategory>(
    ['MESLEK_LISELERI', 'HALK_EGITIM', 'OSB', 'TTSO', 'ESNAF', 'MEM', 'OLGUNLASMA'].includes(initialCat)
      ? initialCat
      : 'MESLEK_LISELERI'
  );

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  useEffect(() => {
    document.title =
      locale === 'tr'
        ? 'MEB Açık Veri Referans Kataloğu • Türkiye VET Atlası | ErasmusMobility'
        : 'MEB Open Data Reference Directory • VET Atlas | ErasmusMobility';
  }, [locale]);

  // Synchronize state dynamically when query parameters change in URL
  useEffect(() => {
    const q = searchParams?.get('search');
    if (typeof q === 'string') {
      setSearchTerm(q);
    }
    const cat = searchParams?.get('category')?.toUpperCase() as BeneficiaryCategory;
    if (cat && ['MESLEK_LISELERI', 'HALK_EGITIM', 'OSB', 'TTSO', 'ESNAF', 'MEM', 'OLGUNLASMA'].includes(cat)) {
      setActiveCategory(cat);
    }
  }, [searchParams]);

  // Active raw dataset based on category
  const rawData = useMemo(() => {
    switch (activeCategory) {
      case 'MESLEK_LISELERI':
        return meslekLiseleriData;
      case 'HALK_EGITIM':
        return halkEgitimData;
      case 'OLGUNLASMA':
        return olgunlasmaData;
      case 'MEM':
        return memData;
      case 'OSB':
        return osbData;
      case 'TTSO':
        return ttsoData;
      case 'ESNAF':
        return esnafData;
      default:
        return meslekLiseleriData;
    }
  }, [activeCategory]);

  // Unique cities for dropdown
  const uniqueCities = useMemo(() => {
    const cities = rawData.map((item: any) => item.il).filter(Boolean);
    return Array.from(new Set(cities)).sort((a: any, b: any) =>
      a.localeCompare(b, 'tr')
    );
  }, [rawData]);

  // Unique districts for selected city
  const uniqueDistricts = useMemo(() => {
    if (!selectedCity) return [];
    const districts = rawData
      .filter((item: any) => item.il === selectedCity)
      .map((item: any) => item.ilce)
      .filter(Boolean);
    return Array.from(new Set(districts)).sort((a: any, b: any) =>
      a.localeCompare(b, 'tr')
    );
  }, [rawData, selectedCity]);

  // Unique school types
  const uniqueTypes = useMemo(() => {
    const types = rawData.map((item: any) => item.okulTuru).filter(Boolean);
    return Array.from(new Set(types)).sort();
  }, [rawData]);

  const handleCategoryChange = (category: BeneficiaryCategory) => {
    setActiveCategory(category);
    // Keep searchTerm active across categories so user does not lose query
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedType('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  // Match counts across all categories for active searchTerm
  const categoryCounts = useMemo(() => {
    if (!searchTerm.trim()) {
      return {
        MESLEK_LISELERI: meslekLiseleriData.length,
        HALK_EGITIM: halkEgitimData.length,
        OSB: osbData.length,
        TTSO: ttsoData.length,
        ESNAF: esnafData.length,
        MEM: memData.length,
        OLGUNLASMA: olgunlasmaData.length,
      };
    }
    const filterCat = (list: any[]) =>
      list.filter(
        (item: any) =>
          trSearchMatch(item.kurumAdi, searchTerm) ||
          trSearchMatch(item.il, searchTerm) ||
          trSearchMatch(item.ilce, searchTerm) ||
          trSearchMatch(item.kurumKodu, searchTerm) ||
          trSearchMatch(item.eposta, searchTerm)
      ).length;

    return {
      MESLEK_LISELERI: filterCat(meslekLiseleriData),
      HALK_EGITIM: filterCat(halkEgitimData),
      OSB: filterCat(osbData),
      TTSO: filterCat(ttsoData),
      ESNAF: filterCat(esnafData),
      MEM: filterCat(memData),
      OLGUNLASMA: filterCat(olgunlasmaData),
    };
  }, [searchTerm]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedType('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // Filter and Sort with Turkish diacritic and casing folding
  const filteredAndSortedData = useMemo(() => {
    let result = [...rawData];

    if (searchTerm) {
      result = result.filter(
        (item: any) =>
          trSearchMatch(item.kurumAdi, searchTerm) ||
          trSearchMatch(item.il, searchTerm) ||
          trSearchMatch(item.ilce, searchTerm) ||
          trSearchMatch(item.kurumKodu, searchTerm) ||
          trSearchMatch(item.eposta, searchTerm)
      );
    }

    if (selectedCity) {
      result = result.filter((item: any) => item.il === selectedCity);
    }

    if (selectedDistrict) {
      result = result.filter((item: any) => item.ilce === selectedDistrict);
    }

    if (selectedType !== 'all') {
      result = result.filter((item: any) => item.okulTuru === selectedType);
    }

    if (sortConfig) {
      result.sort((a: any, b: any) => {
        const valA = a[sortConfig.key] || '';
        const valB = b[sortConfig.key] || '';
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [rawData, searchTerm, selectedCity, selectedDistrict, selectedType, sortConfig]);


  // Export CSV
  const handleExportCsv = () => {
    if (filteredAndSortedData.length === 0) return;
    const headers = ['Kurum Kodu', 'Kurum Adi', 'Il', 'Ilce', 'Tur', 'E-posta', 'Web'];
    const rows = filteredAndSortedData.map((item: any) => [
      item.kurumKodu || '',
      `"${(item.kurumAdi || '').replace(/"/g, '""')}"`,
      `"${item.il || ''}"`,
      `"${item.ilce || ''}"`,
      `"${item.okulTuru || item.tur || ''}"`,
      item.eposta || '',
      item.web || '',
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${activeCategory}_catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination
  const totalPages =
    pageSize === -1
      ? 1
      : Math.max(1, Math.ceil(filteredAndSortedData.length / pageSize));
  const startIndex =
    filteredAndSortedData.length === 0
      ? 0
      : (currentPage - 1) * (pageSize === -1 ? filteredAndSortedData.length : pageSize) + 1;
  const endIndex =
    pageSize === -1
      ? filteredAndSortedData.length
      : Math.min(currentPage * pageSize, filteredAndSortedData.length);

  const paginatedData = useMemo(() => {
    if (pageSize === -1) return filteredAndSortedData;
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const categories = [
    { id: 'MESLEK_LISELERI' as BeneficiaryCategory, label: locale === 'tr' ? 'Meslek Liseleri' : 'VET Schools', icon: '🏫', count: categoryCounts.MESLEK_LISELERI },
    { id: 'HALK_EGITIM' as BeneficiaryCategory, label: locale === 'tr' ? 'Halk Eğitim' : 'Adult Centers', icon: '🎓', count: categoryCounts.HALK_EGITIM },
    { id: 'OSB' as BeneficiaryCategory, label: locale === 'tr' ? 'Organize Sanayi' : 'Industrial Zones', icon: '🏭', count: categoryCounts.OSB },
    { id: 'TTSO' as BeneficiaryCategory, label: locale === 'tr' ? 'Ticaret Odaları' : 'Chambers', icon: '💼', count: categoryCounts.TTSO },
    { id: 'ESNAF' as BeneficiaryCategory, label: locale === 'tr' ? 'Esnaf Odaları' : 'Artisans', icon: '🛠️', count: categoryCounts.ESNAF },
    { id: 'MEM' as BeneficiaryCategory, label: locale === 'tr' ? 'İl MEM' : 'Directorates', icon: '📍', count: categoryCounts.MEM },
    { id: 'OLGUNLASMA' as BeneficiaryCategory, label: locale === 'tr' ? 'Olgunlaşma' : 'Institutes', icon: '🧵', count: categoryCounts.OLGUNLASMA },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-slate-200">
      <AppHeader />

      {/* Breadcrumb Navigation Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>{locale === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              {locale === 'tr' ? 'MEB Açık Veri Referans Kataloğu' : 'MEB Open Data Reference Directory'}
            </span>
          </div>

          <div className="text-[11px] font-bold text-slate-500 hidden sm:block">
            {locale === 'tr' ? '81 İl Kapsamlı Resmi Paydaş Atlası' : '81 Provinces Comprehensive Directory'}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-6">
        {/* Title Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider">
              <span>🏛️</span>
              <span>{locale === 'tr' ? 'Doğrulanmış Referans Veri Tabanı' : 'Verified Open Directory'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight m-0">
              {locale === 'tr' ? 'MEB Açık Veri Referans Kataloğu' : 'MoNE Open Data Reference Directory'}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed m-0">
              {locale === 'tr'
                ? 'Erasmus+ Mesleki Eğitim (VET) ve Yetişkin Eğitimi için 81 ilde yer alan 4.800+ resmi okul, oda, birlik ve müdürlük iletişim atlası.'
                : 'Comprehensive directory of 4,800+ vocational schools, chambers, and provincial directorates eligible for Erasmus+ projects.'}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-4 shrink-0 flex-wrap">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-blue-700">4.825+</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {locale === 'tr' ? 'Toplam Kurum' : 'Institutions'}
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-center">
              <div className="text-2xl font-black text-slate-900">81</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {locale === 'tr' ? 'İl Kapsamı' : 'Provinces'}
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  activeCategory === cat.id
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {cat.count.toLocaleString('tr-TR')}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">
                🔍
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder={
                  locale === 'tr'
                    ? 'Kurum adı, ilçe, kod veya e-posta ile arayın...'
                    : 'Search by institution name, district, code, or email...'
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* City Selector */}
            <select
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                setSelectedDistrict('');
                setCurrentPage(1);
              }}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 font-semibold focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
            >
              <option value="">{locale === 'tr' ? 'Tüm İller (81 İl)' : 'All Provinces (81)'}</option>
              {uniqueCities.map((city: string) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* District Selector */}
            {uniqueDistricts.length > 0 && (
              <select
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 font-semibold focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="">{locale === 'tr' ? 'Tüm İlçeler' : 'All Districts'}</option>
                {uniqueDistricts.map((d: string) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            )}

            {/* Type Selector if Applicable */}
            {uniqueTypes.length > 0 && (
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 font-semibold focus:bg-white focus:border-blue-600 transition-all cursor-pointer"
              >
                <option value="all">{locale === 'tr' ? 'Tüm Türler' : 'All Types'}</option>
                {uniqueTypes.map((t: string) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            )}

            {/* Actions: Reset & Export */}
            <div className="flex items-center gap-2">
              {(searchTerm || selectedCity || selectedDistrict || selectedType !== 'all') && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  {locale === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
                </button>
              )}

              <button
                type="button"
                onClick={handleExportCsv}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>📥</span>
                <span>{locale === 'tr' ? 'CSV İndir' : 'Export CSV'}</span>
              </button>
            </div>
          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              {locale === 'tr' ? 'Gösterilen:' : 'Showing:'}{' '}
              <strong className="text-slate-900 font-bold">
                {filteredAndSortedData.length.toLocaleString('tr-TR')}
              </strong>{' '}
              {locale === 'tr' ? 'kurum kaydı bulundu' : 'records found'}
            </span>

            <div className="flex items-center gap-2">
              <span>{locale === 'tr' ? 'Sayfa Başına:' : 'Page size:'}</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 cursor-pointer"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={-1}>{locale === 'tr' ? 'Tümü' : 'All'}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">#</th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors"
                    onClick={() => handleSort('kurumKodu')}
                  >
                    <div className="flex items-center gap-1">
                      <span>{locale === 'tr' ? 'Kurum Kodu' : 'Code'}</span>
                      {sortConfig?.key === 'kurumKodu' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors"
                    onClick={() => handleSort('kurumAdi')}
                  >
                    <div className="flex items-center gap-1">
                      <span>{locale === 'tr' ? 'Kurum Adı' : 'Institution Name'}</span>
                      {sortConfig?.key === 'kurumAdi' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  <th
                    className="py-3 px-4 cursor-pointer hover:bg-slate-200/80 transition-colors"
                    onClick={() => handleSort('il')}
                  >
                    <div className="flex items-center gap-1">
                      <span>{locale === 'tr' ? 'İl / İlçe' : 'Location'}</span>
                      {sortConfig?.key === 'il' && (
                        <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                  {uniqueTypes.length > 0 && (
                    <th className="py-3 px-4">{locale === 'tr' ? 'Tür' : 'Type'}</th>
                  )}
                  <th className="py-3 px-4">{locale === 'tr' ? 'E-posta' : 'Email'}</th>
                  <th className="py-3 px-4 text-right">{locale === 'tr' ? 'İşlem' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="text-3xl mb-2">🔍</div>
                      <div className="font-bold text-slate-700 text-sm">
                        {locale === 'tr' ? 'Kayıt bulunamadı' : 'No records found'}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {locale === 'tr'
                          ? 'Arama kriterlerinizi değiştirip tekrar deneyin.'
                          : 'Try adjusting your search filters.'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedData.map((item: any, idx: number) => {
                    const rowNumber = startIndex + idx;
                    return (
                      <tr
                        key={item.kurumKodu || item.id || idx}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {rowNumber}
                        </td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 text-xs">
                          {item.kurumKodu ? (
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200">
                              {item.kurumKodu}
                            </span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-extrabold text-slate-900 max-w-sm">
                          <div>{item.kurumAdi || '-'}</div>
                          {item.adres && (
                            <div className="text-[11px] font-normal text-slate-500 truncate max-w-xs mt-0.5">
                              {item.adres}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-semibold whitespace-nowrap">
                          <span>{item.il || '-'}</span>
                          {item.ilce && (
                            <span className="text-slate-400 font-normal"> / {item.ilce}</span>
                          )}
                        </td>
                        {uniqueTypes.length > 0 && (
                          <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                              {item.okulTuru || item.tur || '-'}
                            </span>
                          </td>
                        )}
                        <td className="py-3 px-4 font-mono text-xs text-slate-700 whitespace-nowrap">
                          {item.eposta ? (
                            <button
                              type="button"
                              onClick={() => handleCopyEmail(item.eposta)}
                              title={locale === 'tr' ? 'E-postayı kopyala' : 'Copy email'}
                              className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                            >
                              <span>{copiedEmail === item.eposta ? '✓' : '✉️'}</span>
                              <span>{item.eposta}</span>
                            </button>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          {item.web ? (
                            <a
                              href={item.web.startsWith('http') ? item.web : `https://${item.web}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs transition-colors"
                            >
                              <span>{locale === 'tr' ? 'Web Sitesi' : 'Visit Web'}</span>
                              <span>↗</span>
                            </a>
                          ) : (
                            <span className="text-slate-300 text-xs">-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-slate-50 border-t border-slate-200 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-600 font-medium">
                {locale === 'tr' ? 'Kayıtlar:' : 'Records:'}{' '}
                <strong>{startIndex} - {endIndex}</strong> /{' '}
                <strong>{filteredAndSortedData.length}</strong>
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← {locale === 'tr' ? 'Önceki' : 'Prev'}
                </button>

                <span className="px-3 py-1.5 font-bold text-slate-800">
                  {currentPage} / {totalPages}
                </span>

                <button
                  type="button"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  {locale === 'tr' ? 'Sonraki' : 'Next'} →
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <AppFooter />
    </div>
  );
}

export default function DirectoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
