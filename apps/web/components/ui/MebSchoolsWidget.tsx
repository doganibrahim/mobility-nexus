'use client';

import React, { useState, useMemo, useEffect } from 'react';
import mebSchoolsData from '../../lib/data/meslek_liseleri.json';

interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface MebSchoolsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MebSchoolsWidget({ isOpen, onClose }: MebSchoolsWidgetProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedType, setSelectedType] = useState('all');
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
  }, [searchTerm, selectedCity, selectedDistrict, selectedType, sortConfig, pageSize]);

  const uniqueCities = useMemo(() => {
    const cities = mebSchoolsData.map((item: any) => item.il).filter(Boolean);
    return Array.from(new Set(cities)).sort();
  }, []);

  const uniqueDistricts = useMemo(() => {
    if (!selectedCity) return [];
    const districts = mebSchoolsData
      .filter((item: any) => item.il === selectedCity)
      .map((item: any) => item.ilce)
      .filter(Boolean);
    return Array.from(new Set(districts)).sort();
  }, [selectedCity]);

  const uniqueTypes = useMemo(() => {
    const types = mebSchoolsData.map((item: any) => item.okulTuru).filter(Boolean);
    return Array.from(new Set(types)).sort();
  }, []);

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
    setSelectedDistrict('');
    setSelectedType('all');
    setSortConfig(null);
    setCurrentPage(1);
  };

  const hasActiveFilters = searchTerm !== '' || selectedCity !== '' || selectedDistrict !== '' || selectedType !== 'all' || sortConfig !== null;
  const currentSortValue = sortConfig ? `${sortConfig.key}_${sortConfig.direction}` : '';

  const filteredAndSortedData = useMemo(() => {
    let result = [...mebSchoolsData];

    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter((item: any) => 
        (item.kurumAdi && item.kurumAdi.toLowerCase().includes(lowerSearch)) ||
        (item.il && item.il.toLowerCase().includes(lowerSearch)) ||
        (item.ilce && item.ilce.toLowerCase().includes(lowerSearch)) ||
        (item.kurumKodu && String(item.kurumKodu).toLowerCase().includes(lowerSearch))
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
  }, [searchTerm, sortConfig, selectedCity, selectedDistrict, selectedType]);

  // Pagination Logic
  const totalPages = pageSize === -1 ? 1 : Math.max(1, Math.ceil(filteredAndSortedData.length / pageSize));
  const startIndex = filteredAndSortedData.length === 0 ? 0 : (currentPage - 1) * (pageSize === -1 ? filteredAndSortedData.length : pageSize) + 1;
  const endIndex = pageSize === -1 ? filteredAndSortedData.length : Math.min(currentPage * pageSize, filteredAndSortedData.length);

  const paginatedData = useMemo(() => {
    if (pageSize === -1) return filteredAndSortedData;
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

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
               <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600 border border-indigo-100 shadow-sm">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
               </div>
               <div>
                 <div className="flex items-center gap-2.5">
                   <h2 className="text-xl font-bold text-slate-900 tracking-tight" id="modal-title">MEB Mesleki Eğitim Kurumları</h2>
                   <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                     Resmi Liste (2026)
                   </span>
                 </div>
                 <p className="text-sm font-medium text-slate-500 mt-0.5">Türkiye genelindeki tüm MTAL ve ÇPAL okulları, kurum kodları ve detayları</p>
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
          <div className="bg-slate-50/70 px-6 py-3.5 border-b border-slate-200">
             <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between w-full max-w-sm">
                <div>
                   <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">MEB Resmî Kurum Sayısı</div>
                   <div className="text-lg font-extrabold text-slate-900 mt-0.5">{filteredAndSortedData.length} <span className="text-xs font-normal text-slate-400">okul</span></div>
                </div>
                <div className="h-10 w-10 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center border border-indigo-100">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                   </svg>
                </div>
             </div>
          </div>

          {/* Controls */}
          <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col gap-3.5">
             <div className="flex flex-col sm:flex-row justify-between items-center gap-4 w-full">
               
               <div className="flex items-center gap-2 w-full sm:w-auto">
                 <div className="relative w-full sm:w-80">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      className="block w-full rounded-xl border-0 py-2.5 pl-11 pr-4 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 shadow-sm transition-shadow font-medium"
                      placeholder="Kurum adı, kod, il veya ilçe..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                 </div>

                 {/* Advanced Filters Button */}
                 <button
                   type="button"
                   onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                   className={`relative p-2.5 rounded-xl border transition-colors flex items-center gap-1.5 text-xs font-semibold ${isFiltersOpen ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'}`}
                   title="Gelişmiş Filtreler"
                 >
                   <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H1.5M9 12h3.75M9 12a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0m-3.75 0H1.5m11.25 0h9.75" />
                   </svg>
                   <span className="hidden md:inline">Filtreler</span>
                   {(selectedCity || selectedDistrict || selectedType !== 'all') && (
                     <span className="w-2 h-2 rounded-full bg-indigo-600 absolute top-1.5 right-1.5"></span>
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
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">İl</label>
                      <select 
                        className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs shadow-xs font-medium bg-white"
                        value={selectedCity}
                        onChange={(e) => {
                          setSelectedCity(e.target.value);
                          setSelectedDistrict('');
                        }}
                      >
                        <option value="">Tüm Şehirler ({uniqueCities.length})</option>
                        {uniqueCities.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                      </select>
                   </div>

                   {/* District Filter (Conditional) */}
                   <div className="flex flex-col gap-1">
                      <label className={`text-[11px] font-bold uppercase tracking-wider ${selectedCity ? 'text-slate-600' : 'text-slate-400'}`}>İlçe</label>
                      <select 
                        className={`block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs shadow-xs font-medium ${selectedCity ? 'bg-white ring-slate-300' : 'bg-slate-100 ring-slate-200 text-slate-400 cursor-not-allowed'}`}
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                        disabled={!selectedCity}
                      >
                        <option value="">{selectedCity ? `Tüm İlçeler (${uniqueDistricts.length})` : 'Önce İl Seçiniz'}</option>
                        {uniqueDistricts.map(d => <option key={d as string} value={d as string}>{d as string}</option>)}
                      </select>
                   </div>

                   {/* Type Filter */}
                   <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Okul Türü</label>
                      <select 
                        className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs shadow-xs font-medium bg-white"
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value as any)}
                      >
                        <option value="all">Tüm Türler</option>
                        {uniqueTypes.map(c => <option key={c as string} value={c as string}>{c as string}</option>)}
                      </select>
                   </div>
                   
                   {/* Sorting Select */}
                   <div className="flex flex-col gap-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Sıralama</label>
                      <select 
                        className="block w-full rounded-lg border-0 py-2 pl-3 pr-8 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-xs shadow-xs font-medium bg-white"
                        value={currentSortValue}
                        onChange={handleSortSelect}
                      >
                        <option value="">Varsayılan</option>
                        <option value="kurumAdi_asc">Kurum Adı (A-Z)</option>
                        <option value="kurumAdi_desc">Kurum Adı (Z-A)</option>
                        <option value="il_asc">İl (A-Z)</option>
                        <option value="il_desc">İl (Z-A)</option>
                        <option value="kurumKodu_asc">Kurum Kodu (Artan)</option>
                        <option value="kurumKodu_desc">Kurum Kodu (Azalan)</option>
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
                           className="py-3.5 pl-6 pr-3 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 group transition-colors w-24"
                           onClick={() => handleSort('kurumKodu')}
                         >
                           <div className="flex items-center gap-1.5">
                             Kurum Kodu
                             <span className="text-slate-400 group-hover:text-slate-600">
                               <svg className={`h-4 w-4 transition-transform ${sortConfig?.key === 'kurumKodu' && sortConfig.direction === 'desc' ? 'rotate-180 text-indigo-600' : sortConfig?.key === 'kurumKodu' ? 'text-indigo-600' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                               </svg>
                             </span>
                           </div>
                         </th>
                         <th 
                           scope="col" 
                           className="px-4 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 group transition-colors"
                           onClick={() => handleSort('kurumAdi')}
                         >
                           <div className="flex items-center gap-1.5">
                             Kurum Adı
                             <span className="text-slate-400 group-hover:text-slate-600">
                               <svg className={`h-4 w-4 transition-transform ${sortConfig?.key === 'kurumAdi' && sortConfig.direction === 'desc' ? 'rotate-180 text-indigo-600' : sortConfig?.key === 'kurumAdi' ? 'text-indigo-600' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                               </svg>
                             </span>
                           </div>
                         </th>
                         <th 
                           scope="col" 
                           className="px-4 py-3.5 text-left text-[11px] font-extrabold text-slate-500 uppercase tracking-widest cursor-pointer hover:bg-slate-100 group transition-colors"
                           onClick={() => handleSort('il')}
                         >
                           <div className="flex items-center gap-1.5">
                             İl / İlçe
                             <span className="text-slate-400 group-hover:text-slate-600">
                               <svg className={`h-4 w-4 transition-transform ${sortConfig?.key === 'il' && sortConfig.direction === 'desc' ? 'rotate-180 text-indigo-600' : sortConfig?.key === 'il' ? 'text-indigo-600' : ''}`} fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                               </svg>
                             </span>
                           </div>
                         </th>
                         <th scope="col" className="py-3.5 pl-4 pr-6 text-center text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                           Okul Türü
                         </th>
                         <th scope="col" className="py-3.5 pl-4 pr-6 text-center text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">
                           Detay
                         </th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 bg-white">
                       {paginatedData.map((item: any, idx: number) => (
                         <tr key={item.kurumKodu + idx} className={`transition-colors hover:bg-indigo-50/50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                           <td className="whitespace-nowrap py-3.5 pl-6 pr-3 text-sm font-semibold text-slate-900 font-mono">
                             {item.kurumKodu}
                           </td>
                           <td className="py-3.5 px-4 text-sm max-w-[17rem]" title={item.kurumAdi}>
                             <div className="font-bold text-slate-900 line-clamp-2">{item.kurumAdi}</div>
                           </td>
                           <td className="whitespace-nowrap px-4 py-3.5 text-sm font-semibold text-slate-700">
                             {item.il}
                             <div className="text-xs text-slate-500 font-normal">{item.ilce}</div>
                           </td>
                           <td className="whitespace-nowrap py-3.5 pl-4 pr-6 text-center text-sm">
                             <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset shadow-xs bg-slate-100 text-slate-700 ring-slate-200`}>
                               {item.okulTuru}
                             </span>
                           </td>
                           <td className="whitespace-nowrap py-3.5 pl-4 pr-6 text-center text-sm">
                              {item.mebLink && (
                                 <a 
                                  href={item.mebLink} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold text-xs"
                                 >
                                    MEB Linki ↗
                                 </a>
                              )}
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
                              <h3 className="text-sm font-bold text-slate-900">Sonuç Bulunamadı</h3>
                              <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">Farklı bir kelime veya il seçerek tekrar deneyin.</p>
                              <button
                                onClick={resetFilters}
                                className="mt-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
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

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
             <div className="text-xs text-slate-600 font-medium">
               Toplam <span className="font-bold text-slate-900">{filteredAndSortedData.length}</span> okuldan{' '}
               {filteredAndSortedData.length > 0 ? (
                 <>
                   <span className="font-bold text-slate-900">{startIndex}-{endIndex}</span> arası gösteriliyor
                 </>
               ) : (
                 '0 gösteriliyor'
               )}
             </div>

             <div className="flex items-center gap-4 flex-wrap justify-center">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                   <span>Sayfa Başına:</span>
                   <select
                     value={pageSize}
                     onChange={(e) => setPageSize(Number(e.target.value))}
                     className="rounded-lg border-0 py-1 pl-2 pr-6 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-indigo-600 text-xs font-semibold bg-white"
                   >
                     <option value={10}>10</option>
                     <option value={25}>25</option>
                     <option value={50}>50</option>
                     <option value={-1}>Tümü</option>
                   </select>
                </div>

                {pageSize !== -1 && totalPages > 1 && (
                  <div className="inline-flex items-center gap-1">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Önceki
                    </button>
                    <div className="px-3 py-1 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg shadow-2xs">
                      {currentPage} / {totalPages}
                    </div>
                    <button
                      type="button"
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Sonraki
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
