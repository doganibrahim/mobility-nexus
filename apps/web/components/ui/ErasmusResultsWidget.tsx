'use client';

import React, { useState, useMemo, useEffect } from 'react';
import ka121Data from '../../lib/data/ka121_results.json';
import ka122Data from '../../lib/data/ka122_results.json';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface ErasmusResultsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ErasmusResultsWidget({ isOpen, onClose }: ErasmusResultsWidgetProps) {
  const [activeTab, setActiveTab] = useState<'ka121' | 'ka122'>('ka121');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'Kabul Listesi' | 'Yedek Listesi'>('all');
  const [selectedGrantRange, setSelectedGrantRange] = useState<string>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, selectedCity, selectedStatus, selectedGrantRange, sortConfig, pageSize]);

  const currentData = activeTab === 'ka121' ? ka121Data : ka122Data;

  const uniqueCities = useMemo(() => {
    const cities = currentData.map((item: any) => item.city).filter(Boolean);
    return Array.from(new Set(cities)).sort();
  }, [currentData]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleSortSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (!val) {
      setSortConfig(null);
      return;
    }
    const lastUnderscore = val.lastIndexOf('_');
    const key = val.substring(0, lastUnderscore);
    const direction = val.substring(lastUnderscore + 1) as 'asc' | 'desc';
    setSortConfig({ key, direction });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedStatus('all');
    setSelectedGrantRange('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCity !== '' || selectedStatus !== 'all' || selectedGrantRange !== 'all' || sortConfig !== null;
  const currentSortValue = sortConfig ? `${sortConfig.key}_${sortConfig.direction}` : '';

  const filteredAndSortedData = useMemo(() => {
    let result = [...currentData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item: any) => 
        (item.organisation_name && item.organisation_name.toLowerCase().includes(lowerSearch)) ||
        (item.city && item.city.toLowerCase().includes(lowerSearch)) ||
        (item.project_code && item.project_code.toLowerCase().includes(lowerSearch))
      );
    }

    if (selectedCity) {
      result = result.filter((item: any) => item.city === selectedCity);
    }

    if (selectedStatus !== 'all') {
      result = result.filter((item: any) => item.list_type === selectedStatus);
    }

    if (selectedGrantRange !== 'all') {
      if (selectedGrantRange === '0-50k') result = result.filter((i: any) => i.grant_amount_eur <= 50000);
      else if (selectedGrantRange === '50k-150k') result = result.filter((i: any) => i.grant_amount_eur > 50000 && i.grant_amount_eur <= 150000);
      else if (selectedGrantRange === '150k-300k') result = result.filter((i: any) => i.grant_amount_eur > 150000 && i.grant_amount_eur <= 300000);
      else if (selectedGrantRange === '300k+') result = result.filter((i: any) => i.grant_amount_eur > 300000);
    }

    if (sortConfig) {
      result.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [currentData, searchTerm, sortConfig, selectedCity, selectedStatus, selectedGrantRange]);

  // Dynamic KPI Stats
  const kpiStats = useMemo(() => {
    const totalCount = filteredAndSortedData.length;
    const totalGrant = filteredAndSortedData.reduce((acc, curr: any) => acc + (Number(curr.grant_amount_eur) || 0), 0);
    const avgGrant = totalCount > 0 ? totalGrant / totalCount : 0;
    const acceptedCount = filteredAndSortedData.filter((i: any) => i.list_type === 'Kabul Listesi').length;
    const backupCount = filteredAndSortedData.filter((i: any) => i.list_type === 'Yedek Listesi').length;

    return { totalCount, totalGrant, avgGrant, acceptedCount, backupCount };
  }, [filteredAndSortedData]);

  // Pagination Logic
  const totalPages = pageSize === -1 ? 1 : Math.max(1, Math.ceil(filteredAndSortedData.length / pageSize));
  const startIndex = filteredAndSortedData.length === 0 ? 0 : (currentPage - 1) * (pageSize === -1 ? filteredAndSortedData.length : pageSize) + 1;
  const endIndex = pageSize === -1 ? filteredAndSortedData.length : Math.min(currentPage * pageSize, filteredAndSortedData.length);

  const paginatedData = useMemo(() => {
    if (pageSize === -1) return filteredAndSortedData;
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        
        {/* Background backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity z-0" 
          aria-hidden="true" 
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">&#8203;</span>

        {/* Modal panel */}
        <div className="relative z-10 inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 w-full sm:max-w-6xl sm:align-middle border border-slate-200">
          
          {/* Header */}
          <div className="bg-white px-6 py-5 border-b border-slate-200 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600 border border-blue-100 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
               </div>
               <div>
                 <div className="flex items-center gap-2.5">
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight" id="modal-title">2026 Erasmus+ Hibe Sonuçları</h2>
                   <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                     Resmi Liste
                   </span>
                 </div>
                 <p className="text-sm font-medium text-slate-500 mt-0.5">Ulusal Ajans KA121 ve KA122 onaylanan ve yedek proje analiz tablosu</p>
               </div>
             </div>
             
             <button
               type="button"
               className="rounded-xl bg-white p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors border border-slate-200 shadow-sm"
               onClick={onClose}
             >
               <span className="sr-only">Kapat</span>
               <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
          </div>

          {/* Dynamic KPI Cards */}
          <div className="bg-slate-50/70 px-6 py-3.5 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3">
             <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Filtrelenen Kurum</div>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5">{kpiStats.totalCount} <span className="text-xs font-normal text-slate-400">kurum</span></div>
             </div>
             <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Toplam Hibe Hacmi</div>
                <div className="text-lg font-extrabold text-blue-700 mt-0.5 tabular-nums">{formatCurrency(kpiStats.totalGrant)}</div>
             </div>
             <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Ortalama Proje Hibesi</div>
                <div className="text-lg font-extrabold text-slate-900 mt-0.5 tabular-nums">{formatCurrency(kpiStats.avgGrant)}</div>
             </div>
             <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Dağılım Durumu</div>
                <div className="text-sm font-bold text-slate-800 mt-1 flex items-center gap-2">
                  <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-xs font-bold">{kpiStats.acceptedCount} Asil</span>
                  {kpiStats.backupCount > 0 && (
                    <span className="text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200 text-xs font-bold">{kpiStats.backupCount} Yedek</span>
                  )}
                </div>
             </div>
          </div>

          {/* Controls */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col gap-3.5">
             {/* Top row: Tabs & Search & Filter Toggle */}
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
               {/* Tabs */}
               <div className="flex p-1 bg-slate-100 rounded-xl w-full sm:w-auto shadow-inner border border-slate-200">
                  <button
                    onClick={() => { setActiveTab('ka121'); resetFilters(); }}
                    className={`flex-1 sm:flex-none px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'ka121' ? 'bg-white text-blue-700 shadow border border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                  >
                    KA121 Akreditasyon
                  </button>
                  <button
                    onClick={() => { setActiveTab('ka122'); resetFilters(); }}
                    className={`flex-1 sm:flex-none px-5 py-2 text-sm font-bold rounded-lg transition-all duration-200 ${activeTab === 'ka122' ? 'bg-white text-blue-700 shadow border border-slate-200' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'}`}
                  >
                    KA122 Kısa Dönemli
                  </button>
               </div>
               
               {/* Search & Filter Toggle & Clear */}
               <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative w-full sm:w-80">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-0 py-2.5 pl-11 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 shadow-sm transition-shadow font-medium"
                      placeholder="Kurum adı, şehir veya proje no..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>

                 {/* Advanced Filters Button */}
                 <button
                   type="button"
                   onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                   className={`relative p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${isFiltersOpen ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                   title="Gelişmiş Filtreler"
                 >
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H1.5M9 12h3.75M9 12a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H1.5m11.25 0h9.75" />
                   </svg>
                   <span className="hidden md:inline">Filtreler</span>
                   {(selectedCity || selectedStatus !== 'all' || selectedGrantRange !== 'all') && (
                     <span className="w-2 h-2 rounded-full bg-blue-600 absolute top-1.5 right-1.5"></span>
                   )}
                 </button>

                 {/* Clear All Filters */}
                 {hasActiveFilters && (
                   <button
                     type="button"
                     onClick={resetFilters}
                     className="px-2.5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors text-xs font-bold"
                     title="Filtreleri Sıfırla"
                   >
                     Temizle
                   </button>
                 )}
               </div>
             </div>

             {/* Expanded Advanced Filters Row */}
             {isFiltersOpen && (
               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 pt-3 border-t border-slate-200/80 mt-1 bg-slate-50/70 p-3.5 rounded-xl border">
                   {/* City Filter */}
                   <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Şehir</label>
                      <select 
                        className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-xs shadow-xs font-medium bg-white"
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                      >
                        <option value="">Tüm Şehirler ({uniqueCities.length})</option>
                        {uniqueCities.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                      </select>
                   </div>

                   {/* Status Filter */}
                   <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Başvuru Durumu</label>
                      <select 
                        className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-xs shadow-xs font-medium bg-white"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                      >
                        <option value="all">Tüm Durumlar (Kabul & Yedek)</option>
                        <option value="Kabul Listesi">Sadece Kabul Listesi</option>
                        <option value="Yedek Listesi">Sadece Yedek Listesi</option>
                      </select>
                   </div>

                   {/* Grant Amount Range */}
                   <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Hibe Tutarı Aralığı</label>
                      <select 
                        className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-xs shadow-xs font-medium bg-white"
                        value={selectedGrantRange}
                        onChange={(e) => setSelectedGrantRange(e.target.value)}
                      >
                        <option value="all">Tüm Tutarlar</option>
                        <option value="0-50k">0 - 50.000 €</option>
                        <option value="50k-150k">50.000 € - 150.000 €</option>
                        <option value="150k-300k">150.000 € - 300.000 €</option>
                        <option value="300k+">300.000 € ve Üzeri</option>
                      </select>
                   </div>
                   
                   {/* Sorting Select */}
                   <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Sıralama Kriteri</label>
                      <select 
                        className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-xs shadow-xs font-medium bg-white"
                        value={currentSortValue}
                        onChange={handleSortSelect}
                      >
                        <option value="">Varsayılan (Resmi Sıra)</option>
                        <option value="grant_amount_eur_desc">Hibe Tutarı (En Yüksek)</option>
                        <option value="grant_amount_eur_asc">Hibe Tutarı (En Düşük)</option>
                        <option value="organisation_name_asc">Kurum Adı (A-Z)</option>
                        <option value="organisation_name_desc">Kurum Adı (Z-A)</option>
                        <option value="city_asc">Şehir (A-Z)</option>
                        <option value="city_desc">Şehir (Z-A)</option>
                        <option value="project_code_asc">Proje No (A-Z)</option>
                        <option value="project_code_desc">Proje No (Z-A)</option>
                      </select>
                   </div>
               </div>
             )}
          </div>

          {/* Table Area */}
          <div className="bg-white px-6 pt-5 pb-3">
             <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm ring-1 ring-slate-900/5">
                <div className="max-h-[48vh] overflow-y-auto">
                   <table className="min-w-full divide-y divide-slate-200">
                     <thead className="bg-slate-50 sticky top-0 z-10 shadow-xs border-b border-slate-200">
                       <tr>
                         <th 
                           scope="col" 
                           className="py-3.5 pl-6 pr-3 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 group transition-colors"
                           onClick={() => handleSort('project_code')}
                         >
                           <div className="flex items-center gap-1.5">
                             Proje No
                             <span className="text-slate-400 group-hover:text-slate-600">
                               <svg className={`h-4 w-4 transition-transform ${sortConfig?.key === 'project_code' && sortConfig.direction === 'desc' ? 'rotate-180 text-blue-600' : sortConfig?.key === 'project_code' ? 'text-blue-600' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                               </svg>
                             </span>
                           </div>
                         </th>
                         <th 
                           scope="col" 
                           className="px-4 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 group transition-colors"
                           onClick={() => handleSort('organisation_name')}
                         >
                           <div className="flex items-center gap-1.5">
                             Kurum Bilgisi
                             <span className="text-slate-400 group-hover:text-slate-600">
                               <svg className={`h-4 w-4 transition-transform ${sortConfig?.key === 'organisation_name' && sortConfig.direction === 'desc' ? 'rotate-180 text-blue-600' : sortConfig?.key === 'organisation_name' ? 'text-blue-600' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                               </svg>
                             </span>
                           </div>
                         </th>
                         <th 
                           scope="col" 
                           className="px-4 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 group transition-colors"
                           onClick={() => handleSort('city')}
                         >
                           <div className="flex items-center gap-1.5">
                             Şehir
                             <span className="text-slate-400 group-hover:text-slate-600">
                               <svg className={`h-4 w-4 transition-transform ${sortConfig?.key === 'city' && sortConfig.direction === 'desc' ? 'rotate-180 text-blue-600' : sortConfig?.key === 'city' ? 'text-blue-600' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                               </svg>
                             </span>
                           </div>
                         </th>
                         <th 
                           scope="col" 
                           className="px-4 py-3.5 text-right text-[11px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 group transition-colors"
                           onClick={() => handleSort('grant_amount_eur')}
                         >
                           <div className="flex items-center justify-end gap-1.5">
                             Kabul Edilen Hibe (Euro)
                             <span className="text-slate-400 group-hover:text-slate-600">
                               <svg className={`h-4 w-4 transition-transform ${sortConfig?.key === 'grant_amount_eur' && sortConfig.direction === 'desc' ? 'rotate-180 text-blue-600' : sortConfig?.key === 'grant_amount_eur' ? 'text-blue-600' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                               </svg>
                             </span>
                           </div>
                         </th>
                         <th scope="col" className="py-3.5 pl-4 pr-6 text-center text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                           Durum
                         </th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 bg-white">
                       {paginatedData.map((item: any, idx: number) => (
                         <tr key={item.project_code} className={`transition-colors hover:bg-blue-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                           <td className="whitespace-nowrap py-3.5 pl-6 pr-3 text-sm font-semibold text-slate-900 font-mono">
                             {item.project_code}
                           </td>
                           <td className="py-3.5 px-4 text-sm max-w-[17rem]" title={item.organisation_name}>
                             <div className="font-bold text-slate-900 line-clamp-1">{item.organisation_name}</div>
                             {activeTab === 'ka122' && (
                               <div className="text-slate-500 text-xs mt-0.5 font-medium line-clamp-1">{item.project_title}</div>
                             )}
                           </td>
                           <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-slate-700">
                             {item.city}
                           </td>
                           <td className="whitespace-nowrap px-4 py-3.5 text-sm font-black text-slate-900 text-right tabular-nums tracking-tight">
                             {formatCurrency(item.grant_amount_eur)}
                           </td>
                           <td className="whitespace-nowrap py-3.5 pl-4 pr-6 text-center text-sm">
                             <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset shadow-xs ${
                               item.list_type === 'Kabul Listesi' 
                                 ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' 
                                 : 'bg-orange-50 text-orange-700 ring-orange-600/20'
                             }`}>
                               <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.list_type === 'Kabul Listesi' ? 'bg-emerald-500' : 'bg-orange-500'}`}></span>
                               {item.list_type}
                             </span>
                           </td>
                         </tr>
                       ))}
                       
                       {filteredAndSortedData.length === 0 && (
                         <tr>
                           <td colSpan={5} className="py-16 text-center text-slate-500">
                              <div className="mx-auto h-14 w-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-3">
                                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                              </div>
                              <h3 className="text-sm font-bold text-slate-900">Arama Kriterlerine Uygun Sonuç Bulunamadı</h3>
                              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">Farklı bir şehir, hibe aralığı veya anahtar kelime deneyebilir ya da filtreleri sıfırlayabilirsiniz.</p>
                              <button
                                onClick={resetFilters}
                                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors"
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

          {/* Footer: Pagination & Result Counter */}
          <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
             {/* Result Counter */}
             <div className="text-xs text-slate-600 font-medium">
               Toplam <span className="font-bold text-slate-900">{filteredAndSortedData.length}</span> kayıttan{' '}
               {filteredAndSortedData.length > 0 ? (
                 <>
                   <span className="font-bold text-slate-900">{startIndex}-{endIndex}</span> arası gösteriliyor
                 </>
               ) : (
                 '0 gösteriliyor'
               )}
             </div>

             {/* Pagination Controls & Page Size */}
             <div className="flex items-center gap-4 flex-wrap justify-center">
                {/* Page Size Selector */}
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                   <span>Sayfa Başına:</span>
                   <select
                     value={pageSize}
                     onChange={(e) => setPageSize(Number(e.target.value))}
                     className="rounded-lg border-0 py-1 pl-2 pr-6 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-blue-600 text-xs font-semibold bg-white"
                   >
                     <option value={10}>10</option>
                     <option value={25}>25</option>
                     <option value={50}>50</option>
                     <option value={-1}>Tümü</option>
                   </select>
                </div>

                {/* Page Navigation */}
                {pageSize !== -1 && totalPages > 1 && (
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Önceki Sayfa"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                      </svg>
                    </button>

                    <div className="px-3 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      {currentPage} / {totalPages}
                    </div>

                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      title="Sonraki Sayfa"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </button>
                  </div>
                )}
             </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
