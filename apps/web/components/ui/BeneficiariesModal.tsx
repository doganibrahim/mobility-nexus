'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';
import meslekLiseleriData from '../../lib/data/meslek_liseleri.json';
import halkEgitimData from '../../lib/data/halk_egitim.json';
import olgunlasmaData from '../../lib/data/olgunlasma_enstituleri.json';
import memData from '../../lib/data/milli_egitim_mudurlukleri.json';
import osbData from '../../lib/data/osb.json';
import ttsoData from '../../lib/data/ttso.json';
import esnafData from '../../lib/data/esnaf.json';

export type BeneficiaryCategory =
  | 'MESLEK_LISELERI'
  | 'HALK_EGITIM'
  | 'OLGUNLASMA'
  | 'MEM'
  | 'OSB'
  | 'TTSO'
  | 'ESNAF';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface BeneficiariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: BeneficiaryCategory;
}

export default function BeneficiariesModal({
  isOpen,
  onClose,
  initialCategory = 'MESLEK_LISELERI',
}: BeneficiariesModalProps) {
  const { t, locale } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<BeneficiaryCategory>(initialCategory);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Sync initialCategory when modal opens
  useEffect(() => {
    if (isOpen && initialCategory) {
      setActiveCategory(initialCategory);
    }
  }, [isOpen, initialCategory]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset pagination and filters when category changes
  const handleCategoryChange = (category: BeneficiaryCategory) => {
    setActiveCategory(category);
    setSearchTerm('');
    setSelectedCity('');
    setSelectedDistrict('');
    setSelectedType('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCity, selectedDistrict, selectedType, sortConfig, pageSize]);

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

  // Unique types if applicable (e.g. MTAL, ÇPAL)
  const uniqueTypes = useMemo(() => {
    const types = rawData.map((item: any) => item.okulTuru).filter(Boolean);
    return Array.from(new Set(types)).sort();
  }, [rawData]);

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

  // Filter and Sort
  const filteredAndSortedData = useMemo(() => {
    let result = [...rawData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item: any) =>
        (item.kurumAdi && item.kurumAdi.toLowerCase().includes(lowerSearch)) ||
        (item.il && item.il.toLowerCase().includes(lowerSearch)) ||
        (item.ilce && item.ilce.toLowerCase().includes(lowerSearch)) ||
        (item.kurumKodu && String(item.kurumKodu).toLowerCase().includes(lowerSearch)) ||
        (item.eposta && item.eposta.toLowerCase().includes(lowerSearch))
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

  // Pagination logic
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity z-0"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Window (Flat, Zero Gradient) */}
        <div className="relative z-10 inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 w-full sm:max-w-6xl sm:align-middle border-2 border-slate-300">
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="bg-slate-100 p-2.5 rounded-xl text-slate-800 border border-slate-300">
                <span className="text-xl">🏛️</span>
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-xl font-extrabold text-slate-950 tracking-tight m-0" id="modal-title">
                    {locale === 'tr' ? 'Yararlanıcılar Referans Kataloğu' : 'Beneficiaries Reference Catalog'}
                  </h2>
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-slate-100 text-slate-800 border border-slate-300">
                    MEB Açık Veri Referansı
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 mt-1 m-0">
                  {locale === 'tr'
                    ? 'Erasmus+ Mesleki ve Yetişkin Eğitimine uygun kurum kodları, iletişim bilgileri ve web siteleri (Sistem kullanıcı kaydı değildir, rehberlik amaçlıdır).'
                    : 'Institutional codes, contacts, and websites eligible for Erasmus+ VET & Adult Education (Reference directory).'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
              onClick={onClose}
              title="Kapat"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 5 Category Tabs (Flat, Clean) */}
          <div className="bg-slate-100 px-4 sm:px-6 pt-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => handleCategoryChange('MESLEK_LISELERI')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === 'MESLEK_LISELERI'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🏫</span>
              <span>{t.header.beneficiaries.meslekLiseleri}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {meslekLiseleriData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('HALK_EGITIM')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === 'HALK_EGITIM'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>📚</span>
              <span>{t.header.beneficiaries.halkEgitim}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {halkEgitimData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('OLGUNLASMA')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === 'OLGUNLASMA'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🏛️</span>
              <span>{t.header.beneficiaries.olgunlasma}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {olgunlasmaData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('MEM')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === 'MEM'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🏢</span>
              <span>{t.header.beneficiaries.mem}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {memData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('OSB')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === 'OSB'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🏭</span>
              <span>{t.header.beneficiaries.osb}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {osbData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('TTSO')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === 'TTSO'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🤝</span>
              <span>{t.header.beneficiaries.ttso}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {ttsoData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleCategoryChange('ESNAF')}
              className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeCategory === 'ESNAF'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🛠️</span>
              <span>{t.header.beneficiaries.esnaf}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300">
                {esnafData.length}
              </span>
            </button>

          </div>

          {/* Search & Filter Bar */}
          <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-b border-slate-200 flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-3.5 w-full">
                  {/* Search Input */}
                  <div className="relative w-full sm:w-80">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-slate-900 placeholder:text-slate-400 text-xs font-medium focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-shadow"
                      placeholder={locale === 'tr' ? 'Kurum adı, kod, il, ilçe veya e-posta...' : 'Search by name, code, city, email...'}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Filter Toggle & Quick Info */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className="text-xs font-semibold text-slate-600">
                      {filteredAndSortedData.length} <span className="font-normal text-slate-500">kayıt</span>
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                      className={`px-3 py-2 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                        isFiltersOpen || selectedCity || selectedType !== 'all'
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span>⚙️</span>
                      <span>{locale === 'tr' ? 'Filtrele' : 'Filter'}</span>
                      {(selectedCity || selectedDistrict || selectedType !== 'all') && (
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Collapsible Filters */}
                {isFiltersOpen && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
                    {/* City Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">İl</label>
                      <select
                        className="rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs text-slate-900 font-medium bg-white"
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          setSelectedDistrict('');
                        }}
                      >
                        <option value="">Tüm İller</option>
                        {uniqueCities.map((city: any) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* District Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">İlçe</label>
                      <select
                        className="rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs text-slate-900 font-medium bg-white disabled:opacity-50"
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedCity}
                      >
                        <option value="">{selectedCity ? 'Tüm İlçeler' : 'Önce İl Seçin'}</option>
                        {uniqueDistricts.map((dist: any) => (
                          <option key={dist} value={dist}>
                            {dist}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Type Select */}
                    <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Tür</label>
                      <select
                        className="rounded-lg border border-slate-300 py-1.5 px-2.5 text-xs text-slate-900 font-medium bg-white"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="all">Tüm Türler</option>
                        {uniqueTypes.map((t: any) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Data Table */}
              <div className="bg-white px-4 sm:px-6 pt-4 pb-2">
                <div className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="max-h-[50vh] overflow-y-auto overflow-x-auto">
                    <table className="min-w-[650px] w-full divide-y divide-slate-200">
                      <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
                        <tr>
                          <th
                            scope="col"
                            className="py-3 pl-5 pr-2 text-left text-[11px] font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                            onClick={() => handleSort('kurumKodu')}
                          >
                            Kurum Kodu {sortConfig?.key === 'kurumKodu' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                            onClick={() => handleSort('kurumAdi')}
                          >
                            Kurum Adı {sortConfig?.key === 'kurumAdi' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100"
                            onClick={() => handleSort('il')}
                          >
                            İl / İlçe {sortConfig?.key === 'il' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                          </th>
                          <th
                            scope="col"
                            className="px-4 py-3 text-left text-[11px] font-extrabold text-slate-600 uppercase tracking-wider"
                          >
                            İletişim & Web
                          </th>
                          <th
                            scope="col"
                            className="py-3 pr-5 pl-3 text-right text-[11px] font-extrabold text-slate-600 uppercase tracking-wider"
                          >
                            Kurum Türü
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        {paginatedData.map((item: any, idx: number) => (
                          <tr
                            key={(item.kurumKodu || item.kurumAdi) + idx}
                            className={`transition-colors hover:bg-slate-50 ${
                              idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
                            }`}
                          >
                            <td className="whitespace-nowrap py-3 pl-5 pr-2 text-xs font-mono font-bold text-slate-800">
                              {item.kurumKodu || '-'}
                            </td>

                            <td className="py-3 px-4 text-xs">
                              <div className="font-bold text-slate-950">{item.kurumAdi}</div>
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-xs font-semibold text-slate-800">
                              {item.il}
                              {item.ilce && (
                                <div className="text-[11px] text-slate-500 font-normal">{item.ilce}</div>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-4 py-3 text-xs">
                              <div className="flex items-center gap-2">
                                {item.eposta && (
                                  <button
                                    type="button"
                                    onClick={() => handleCopyEmail(item.eposta)}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium border border-slate-200 flex items-center gap-1 transition-colors"
                                    title="E-postayı kopyala"
                                  >
                                    <span>✉️</span>
                                    <span>{copiedEmail === item.eposta ? 'Kopyalandı!' : item.eposta}</span>
                                  </button>
                                )}

                                {(item.webSitesi || item.mebLink) && (
                                  <a
                                    href={item.webSitesi || item.mebLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-2 py-0.5 rounded-md bg-white hover:bg-slate-100 text-blue-700 text-[11px] font-bold border border-slate-300 inline-flex items-center gap-1 transition-colors"
                                  >
                                    <span>Web</span>
                                    <span>↗</span>
                                  </a>
                                )}
                              </div>
                            </td>

                            <td className="whitespace-nowrap py-3 pr-5 pl-3 text-right text-xs">
                              <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300">
                                {item.okulTuru}
                              </span>
                            </td>
                          </tr>
                        ))}

                        {filteredAndSortedData.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-slate-500">
                              <div className="text-2xl mb-2">🔍</div>
                              <p className="text-xs font-bold text-slate-900 m-0">Aramanıza uygun kurum bulunamadı.</p>
                              <p className="text-[11px] text-slate-500 mt-1 m-0">Farklı bir arama terimi veya il seçebilirsiniz.</p>
                              <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-3 px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg border border-slate-300"
                              >
                                Filtreleri Sıfırla
                              </button>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer Pagination */}
              <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="text-xs text-slate-600 font-medium">
                  Toplam <span className="font-bold text-slate-900">{filteredAndSortedData.length}</span> kayıttan{' '}
                  <span className="font-bold text-slate-900">{startIndex}</span> -{' '}
                  <span className="font-bold text-slate-900">{endIndex}</span> arası gösteriliyor
                </div>

                <div className="flex items-center gap-2">
                  <select
                    className="rounded-lg border border-slate-300 py-1 px-2 text-xs text-slate-700 bg-white font-medium"
                    value={pageSize}
                    onChange={(e) => {
                      setPageSize(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                  >
                    <option value={10}>10 / sayfa</option>
                    <option value={25}>25 / sayfa</option>
                    <option value={50}>50 / sayfa</option>
                    <option value={-1}>Tümünü Göster</option>
                  </select>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage <= 1 || pageSize === -1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      ←
                    </button>
                    <span className="px-2 text-xs font-bold text-slate-800">
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages || pageSize === -1}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
        </div>
      </div>
    </div>
  );
}
