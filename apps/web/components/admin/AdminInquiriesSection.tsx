'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore, MobilityInquiry } from '../../lib/store';
import { useTranslation } from '../../lib/i18n';
import AdminInquiryDetailModal from './AdminInquiryDetailModal';

export default function AdminInquiriesSection() {
  const { locale } = useTranslation();
  const store = useAppStore();
  const isEn = locale === 'en';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REVISED' | 'DECLINED'>('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<MobilityInquiry | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const inquiries = store.inquiries || [];

  // Metrics
  const totalCount = inquiries.length;
  const pendingCount = inquiries.filter((i) => i.status === 'PENDING').length;
  const acceptedCount = inquiries.filter((i) => i.status === 'ACCEPTED').length;
  const revisedCount = inquiries.filter((i) => i.status === 'REVISED').length;
  const declinedCount = inquiries.filter((i) => i.status === 'DECLINED').length;

  // Filtered list
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      // Status filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSchool = item.schoolName?.toLowerCase().includes(q);
        const matchesCity = item.schoolCity?.toLowerCase().includes(q);
        const matchesOid = item.schoolOid?.toLowerCase().includes(q);
        const matchesHost = item.hostName?.toLowerCase().includes(q);
        const matchesCountry = item.hostCountry?.toLowerCase().includes(q);
        const matchesVet = item.vetField?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        const matchesReply = item.hostReplyNote?.toLowerCase().includes(q);
        return matchesSchool || matchesCity || matchesOid || matchesHost || matchesCountry || matchesVet || matchesNotes || matchesReply;
      }
      return true;
    });
  }, [inquiries, statusFilter, searchQuery]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await store.fetchInquiriesFromServer();
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handleOpenDetail = (inquiry: MobilityInquiry) => {
    setSelectedInquiry(inquiry);
    setIsDetailModalOpen(true);
  };

  const renderStatusBadge = (status: MobilityInquiry['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span>✅</span>
            <span>{isEn ? 'Accepted' : 'Kabul Edildi'}</span>
          </span>
        );
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <span>❌</span>
            <span>{isEn ? 'Declined' : 'Reddedildi'}</span>
          </span>
        );
      case 'REVISED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-800 border border-indigo-300">
            <span>🔄</span>
            <span>{isEn ? 'Revision Requested' : 'Revizyon Istendi'}</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300">
            <span>⏳</span>
            <span>{isEn ? 'Pending' : 'Onay Bekliyor'}</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-xs font-bold uppercase tracking-wider border border-blue-200 mb-1.5">
            <span>📩</span>
            <span>{isEn ? 'Central Communications & Placement Hub' : 'Merkezi Eslestirme ve Mesaj Yonetimi'}</span>
          </div>
          <h2 className="text-xl font-black text-slate-950 tracking-tight m-0">
            {isEn ? 'Mobility Placement Inquiries & Messages' : 'Okul - Host Hareketlilik Talepleri ve Mesaj Havuzu'}
          </h2>
          <p className="text-xs text-slate-600 m-0 mt-1 max-w-2xl">
            {isEn
              ? 'Review and manage placement inquiries, student quotas, full messages, and host responses across all schools and European hosts.'
              : 'Turkiye genelindeki meslek liselerinin Avrupa isletmelerine ilettigi staj talepleri, okul mesajlari, kontenjanlar ve ev sahibi yanitlari.'}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
            title={isEn ? 'Refresh inquiries from database' : 'Veritabanindan guncel talepleri cek'}
          >
            <span className={isRefreshing ? 'animate-spin' : ''}>🔄</span>
            <span>{isRefreshing ? (isEn ? 'Refreshing...' : 'Yenileniyor...') : (isEn ? 'Sync DB' : 'Veritabanini Yenile')}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {isEn ? 'Total Inquiries' : 'Toplam Talep'}
          </span>
          <div className="text-2xl font-black text-slate-950 mt-1">{totalCount}</div>
        </div>
        <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
            ⏳ {isEn ? 'Pending Review' : 'Onay Bekleyen'}
          </span>
          <div className="text-2xl font-black text-amber-950 mt-1">{pendingCount}</div>
        </div>
        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
            ✅ {isEn ? 'Accepted' : 'Kabul Edilen'}
          </span>
          <div className="text-2xl font-black text-emerald-950 mt-1">{acceptedCount}</div>
        </div>
        <div className="p-3.5 bg-rose-50/60 border border-rose-200 rounded-xl">
          <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
            ❌ {isEn ? 'Declined / Revision' : 'Reddedilen / Revizyon'}
          </span>
          <div className="text-2xl font-black text-rose-950 mt-1">{declinedCount + revisedCount}</div>
        </div>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-2">
        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-300 rounded-xl flex-wrap">
          <button
            type="button"
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              statusFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            {isEn ? 'All' : 'Tumu'} ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('PENDING')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              statusFilter === 'PENDING'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>⏳</span>
            <span>{isEn ? 'Pending' : 'Bekleyen'}</span> ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('ACCEPTED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              statusFilter === 'ACCEPTED'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>✅</span>
            <span>{isEn ? 'Accepted' : 'Kabul Edilen'}</span> ({acceptedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('REVISED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              statusFilter === 'REVISED'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🔄</span>
            <span>{isEn ? 'Revised' : 'Revizyon'}</span> ({revisedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('DECLINED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
              statusFilter === 'DECLINED'
                ? 'bg-rose-700 text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>❌</span>
            <span>{isEn ? 'Declined' : 'Reddedilen'}</span> ({declinedCount})
          </button>
        </div>

        {/* Search Box */}
        <div className="relative w-full lg:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isEn ? 'Search school, host, OID, message...' : 'Okul, host, OID, sehir veya mesaj ara...'}
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Inquiries List */}
      <div className="space-y-3">
        {filteredInquiries.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-3xl block mb-2">📭</span>
            <p className="text-xs font-bold text-slate-700 m-0">
              {isEn ? 'No placement inquiries matching your criteria.' : 'Secilen filtreye uygun hareketlilik talebi bulunamadi.'}
            </p>
            <p className="text-[11px] text-slate-500 m-0 mt-1">
              {isEn ? 'Try adjusting your search query or filter selection.' : 'Arama terimini veya durum filtresini degistirmeyi deneyebilirsiniz.'}
            </p>
          </div>
        ) : (
          filteredInquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="p-4 sm:p-5 bg-white hover:bg-slate-50/70 border border-slate-200 rounded-xl transition-all shadow-2xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-extrabold text-sm text-slate-950">
                    {inquiry.schoolName}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({inquiry.schoolCity})
                  </span>
                  <span className="font-mono text-[11px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {inquiry.schoolOid}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-slate-100 text-slate-800 border border-slate-200">
                    {inquiry.projectType}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {renderStatusBadge(inquiry.status)}
                  <span className="text-[11px] text-slate-400">
                    {new Date(inquiry.createdAt).toLocaleDateString(isEn ? 'en-US' : 'tr-TR')}
                  </span>
                </div>
              </div>

              {/* Body details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                {/* Hedef Host */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    {isEn ? 'Target European Host' : 'Hedef Ev Sahibi Kurum'}
                  </span>
                  <div className="font-bold text-slate-900">{inquiry.hostName}</div>
                  <div className="text-slate-500">{inquiry.vetField} ({inquiry.hostCountry})</div>
                </div>

                {/* Katilimci & Sure */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    {isEn ? 'Mobility Parameters' : 'Hareketlilik Kapsami'}
                  </span>
                  <div className="font-bold text-slate-900">
                    {inquiry.participantCount} {isEn ? 'Learners' : 'Ogrenci'} {inquiry.accompanyingPersonsCount > 0 ? `+ ${inquiry.accompanyingPersonsCount} Refakatci` : ''} • {inquiry.durationDays} {isEn ? 'Days' : 'Gun'}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    {inquiry.targetStartDate} → {inquiry.targetEndDate}
                  </div>
                </div>

                {/* Mesaj Ozeti */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-slate-500 uppercase block">
                    {isEn ? 'School Request Message' : 'Okul Talep Mesaji'}
                  </span>
                  <p className="text-slate-700 italic line-clamp-2 m-0 bg-slate-50 p-2 rounded border border-slate-200">
                    "{inquiry.notes || (isEn ? 'No message' : 'Mesaj girilmedi')}"
                  </p>
                </div>
              </div>

              {/* Host Reply Snippet if exists */}
              {inquiry.hostReplyNote && (
                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg text-xs flex items-start gap-2">
                  <span className="text-blue-700 font-bold shrink-0">🏢 {isEn ? 'Host Reply:' : 'Host Yaniti:'}</span>
                  <span className="text-slate-800 line-clamp-1">{inquiry.hostReplyNote}</span>
                </div>
              )}

              {/* Bottom bar with action */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-xs border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <span>{isEn ? 'Contact' : 'Iletisim'}: {inquiry.schoolContactName || '-'} ({inquiry.schoolContactEmail || '-'})</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenDetail(inquiry)}
                  className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-lg transition-colors shadow-2xs flex items-center justify-center gap-1.5 shrink-0"
                >
                  <span>🔎</span>
                  <span>{isEn ? 'Inspect Details & Full Message →' : 'Detaylari & Mesaji Gor →'}</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AdminInquiryDetailModal
        inquiry={selectedInquiry}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onStatusUpdated={(updated) => {
          setSelectedInquiry(updated);
        }}
      />
    </div>
  );
}
