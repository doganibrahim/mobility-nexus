'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import NeoCard from '../ui/NeoCard';
import { useTranslation } from '../../lib/i18n';
import { useAppStore, MobilityInquiry } from '../../lib/store';

export default function SentInquiriesCard() {
  const { t, locale } = useTranslation();
  const store = useAppStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    store.fetchInquiriesFromServer();
  }, []);

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REVISED' | 'DECLINED'>('ALL');
  const [selectedInquiryForLoI, setSelectedInquiryForLoI] = useState<MobilityInquiry | null>(null);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const inquiries = store.inquiries || [];

  const filteredInquiries = inquiries.filter((inq) => {
    if (activeFilter === 'PENDING') return inq.status === 'PENDING';
    if (activeFilter === 'ACCEPTED') return inq.status === 'ACCEPTED';
    if (activeFilter === 'REVISED') return inq.status === 'REVISED';
    if (activeFilter === 'DECLINED') return inq.status === 'DECLINED';
    return true;
  });

  const pendingCount = inquiries.filter((inq) => inq.status === 'PENDING').length;
  const acceptedCount = inquiries.filter((inq) => inq.status === 'ACCEPTED').length;
  const revisedCount = inquiries.filter((inq) => inq.status === 'REVISED').length;
  const declinedCount = inquiries.filter((inq) => inq.status === 'DECLINED').length;

  const triggerAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => {
      setActionAlert(null);
    }, 4000);
  };

  const handleWithdraw = (inquiryId: string) => {
    if (typeof window !== 'undefined') {
      const confirmed = window.confirm(
        locale === 'tr'
          ? 'Bu hareketlilik talebini geri çekmek istediğinizden emin misiniz?'
          : 'Are you sure you want to withdraw this mobility inquiry?',
      );
      if (!confirmed) return;
    }

    store.removeInquiry(inquiryId);
    triggerAlert(t.sentInquiries.withdrawConfirmMsg);
  };

  const scrollToMatching = () => {
    const el = document.getElementById('matching');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <NeoCard
      id="sent-inquiries"
      title={t.sentInquiries.cardTitle}
      badge={`${inquiries.length} ${locale === 'tr' ? 'Talep' : 'Inquiries'}`}
      badgeType="primary"
    >
      <div className="space-y-6">
        {/* Subtitle & Filter Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <p className="text-xs text-slate-600 m-0 leading-relaxed max-w-2xl">
              {t.sentInquiries.cardSubtitle}
            </p>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 flex-wrap self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.sentInquiries.tabAll} ({inquiries.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'PENDING'
                  ? 'bg-amber-100 text-amber-950 font-extrabold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏳ {t.sentInquiries.tabPending} ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ACCEPTED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'ACCEPTED'
                  ? 'bg-emerald-100 text-emerald-950 font-extrabold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✓ {t.sentInquiries.tabAccepted} ({acceptedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('REVISED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'REVISED'
                  ? 'bg-blue-100 text-blue-950 font-extrabold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✏️ {t.sentInquiries.tabRevised} ({revisedCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('DECLINED')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'DECLINED'
                  ? 'bg-rose-100 text-rose-950 font-extrabold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ✕ {t.sentInquiries.tabDeclined} ({declinedCount})
            </button>
          </div>
        </div>

        {/* Action Alert Banner */}
        {actionAlert && (
          <div className="p-3 bg-blue-50 border-2 border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2">
              <span>ℹ️</span>
              <span>{actionAlert}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionAlert(null)}
              className="text-blue-700 hover:text-blue-950 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Inquiries List */}
        {filteredInquiries.length === 0 ? (
          <div className="p-8 text-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/60 space-y-3">
            <div className="text-4xl">📭</div>
            <h4 className="text-sm font-black text-slate-950 m-0">
              {t.sentInquiries.emptyTitle}
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto m-0 leading-relaxed">
              {t.sentInquiries.emptyDesc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={scrollToMatching}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>🚀</span>
                <span>{t.sentInquiries.emptyCtaBtn}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInquiries.map((inq) => {
              const isPending = inq.status === 'PENDING';
              const isAccepted = inq.status === 'ACCEPTED';
              const isRevised = inq.status === 'REVISED';
              const isDeclined = inq.status === 'DECLINED';

              return (
                <div
                  key={inq.id}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    isAccepted
                      ? 'border-emerald-300 bg-emerald-50/20 shadow-2xs'
                      : isDeclined
                        ? 'border-rose-200 bg-rose-50/20'
                        : isRevised
                          ? 'border-blue-200 bg-blue-50/20'
                          : 'border-amber-200 bg-amber-50/15 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    {/* Left Details */}
                    <div className="space-y-3 flex-1">
                      {/* Host Header Tags */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-900 text-white shadow-2xs">
                          🏢 {inq.hostCountry}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                          {inq.projectType === 'KA121' ? 'KA121 Akredite' : 'KA122 Kısa Dönem'}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          {t.sentInquiries.sentDateLabel} <strong className="text-slate-800">{new Date(inq.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}</strong>
                        </span>
                      </div>

                      {/* Target Host Name & Mobility Field */}
                      <div>
                        <div className="text-[11px] text-slate-500 font-semibold">
                          {t.sentInquiries.targetHostLabel}
                        </div>
                        <h3 className="text-base font-black text-slate-950 mt-0.5 m-0">
                          {inq.hostName}
                        </h3>
                        <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                          <span>🎯 <strong className="text-slate-900">{inq.vetField}</strong></span>
                          <span>•</span>
                          <span>👥 <strong className="text-slate-900">{inq.participantCount}</strong> {locale === 'tr' ? 'Öğrenci' : 'Learners'} {inq.accompanyingPersonsCount > 0 ? `(+${inq.accompanyingPersonsCount} ${locale === 'tr' ? 'Refakatçi' : 'Staff'})` : ''}</span>
                          <span>•</span>
                          <span>⏱️ <strong className="text-slate-900">{inq.durationDays}</strong> {locale === 'tr' ? 'Gün' : 'Days'}</span>
                          <span>•</span>
                          <span>📅 {inq.targetStartDate} — {inq.targetEndDate}</span>
                        </div>
                      </div>

                      {/* Logistics Badges */}
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                        <span className="font-semibold text-slate-600 mr-1">
                          {t.sentInquiries.logisticsLabel}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-medium border ${inq.logisticsRequired.accommodation ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          🏨 {locale === 'tr' ? 'Konaklama' : 'Lodging'} {inq.logisticsRequired.accommodation ? '✓' : '—'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-medium border ${inq.logisticsRequired.meals ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          🍽️ {locale === 'tr' ? 'Yemek' : 'Meals'} {inq.logisticsRequired.meals ? '✓' : '—'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-medium border ${inq.logisticsRequired.transfers ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          🚗 {locale === 'tr' ? 'Transfer' : 'Transfers'} {inq.logisticsRequired.transfers ? '✓' : '—'}
                        </span>
                      </div>

                      {/* School Note Snippet */}
                      {inq.notes && (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed italic">
                          <strong className="text-slate-900 not-italic block mb-0.5">{t.sentInquiries.schoolNoteLabel}</strong>
                          &ldquo;{inq.notes}&rdquo;
                        </div>
                      )}

                      {/* Host Reply Box */}
                      {inq.hostReplyNote && (
                        <div
                          className={`p-3 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5 ${
                            isAccepted
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                              : isDeclined
                                ? 'bg-rose-50 border-rose-200 text-rose-950'
                                : isRevised
                                  ? 'bg-blue-50 border-blue-200 text-blue-950'
                                  : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        >
                          <span className="text-base shrink-0">
                            {isAccepted ? '💬' : isDeclined ? '❌' : isRevised ? '✏️' : '📝'}
                          </span>
                          <div className="space-y-0.5 flex-1">
                            <span className="font-extrabold text-[11px] uppercase tracking-wider block opacity-80">
                              {isAccepted
                                ? locale === 'tr' ? 'Ev Sahibi Resmi Yanıtı (Ön Kabul):' : 'Official Host Reply (Acceptance):'
                                : isDeclined
                                  ? locale === 'tr' ? 'Ev Sahibi Ret Gerekçesi:' : 'Host Decline Reason:'
                                  : isRevised
                                    ? locale === 'tr' ? 'Ev Sahibi Revizyon Teklifi:' : 'Host Revision Request:'
                                    : t.sentInquiries.hostResponseLabel}
                            </span>
                            <p className="m-0 font-medium leading-relaxed">{inq.hostReplyNote}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Status Badge & Actions */}
                    <div className="flex flex-col sm:items-end justify-between gap-4 shrink-0">
                      <div>
                        {isAccepted ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
                            <span>✓</span>
                            <span>{t.inquiry.statusAccepted}</span>
                          </span>
                        ) : isDeclined ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300 shadow-2xs">
                            <span>✕</span>
                            <span>{t.inquiry.statusDeclined}</span>
                          </span>
                        ) : isRevised ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
                            <span>✏️</span>
                            <span>{t.inquiry.statusRevised}</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                            <span>⏳</span>
                            <span>{t.inquiry.statusPending}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2">
                        {/* ACCEPTED: View LoI Button */}
                        {isAccepted && (
                          <button
                            type="button"
                            onClick={() => setSelectedInquiryForLoI(inq)}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>📄</span>
                            <span>{t.sentInquiries.viewLoIBtn}</span>
                          </button>
                        )}

                        {/* PENDING: Withdraw / Cancel Button */}
                        {isPending && (
                          <button
                            type="button"
                            onClick={() => handleWithdraw(inq.id)}
                            className="px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-700 hover:text-rose-800 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                            title={locale === 'tr' ? 'Talebi iptal et ve sistemden kaldır' : 'Cancel and withdraw inquiry'}
                          >
                            <span>↩️</span>
                            <span>{t.sentInquiries.withdrawBtn}</span>
                          </button>
                        )}

                        {/* DECLINED: Find Alternative Host Button */}
                        {isDeclined && (
                          <button
                            type="button"
                            onClick={scrollToMatching}
                            className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs rounded-xl border border-blue-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>🔍</span>
                            <span>{t.sentInquiries.findAlternativeBtn}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* LETTER OF INTENT (LoI) PREVIEW MODAL (Portaled to document.body) */}
      {/* ============================================================ */}
      {mounted && selectedInquiryForLoI && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white border-2 border-slate-300 rounded-2xl shadow-2xl p-6 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Erasmus+ VET Letter of Intent
                </span>
                <h3 className="text-base font-black text-slate-950 m-0">
                  {t.sentInquiries.loiModalTitle}
                </h3>
                <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                  {t.sentInquiries.loiModalSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiryForLoI(null)}
                className="text-slate-400 hover:text-slate-900 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 leading-relaxed">
              <p className="m-0 text-slate-800">
                <strong>{selectedInquiryForLoI.hostName} ({selectedInquiryForLoI.hostCountry})</strong>,{' '}
                <strong>{selectedInquiryForLoI.schoolName} (OID: {selectedInquiryForLoI.schoolOid})</strong> tarafından iletilen{' '}
                <strong>{selectedInquiryForLoI.vetField}</strong> alanındaki mesleki eğitim hareketlilik talebini onaylamış ve{' '}
                <strong>{selectedInquiryForLoI.participantCount} öğrenci</strong> için{' '}
                <strong>{selectedInquiryForLoI.targetStartDate} — {selectedInquiryForLoI.targetEndDate}</strong> tarihleri arasında işletme kontenjanı ayırmıştır.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <div>Ev Sahibi Kurum: <strong className="text-slate-900">{selectedInquiryForLoI.hostName}</strong></div>
                <div>Durum: <strong className="text-emerald-700">✓ Onaylandı (LoI Aktif)</strong></div>
              </div>
              {selectedInquiryForLoI.hostReplyNote && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-950">
                  <strong className="text-emerald-900">Ev Sahibi Resmi Açıklaması:</strong> {selectedInquiryForLoI.hostReplyNote}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer flex items-center gap-1.5"
              >
                <span>🖨️</span>
                <span>{locale === 'tr' ? 'Yazdır / PDF Olarak Kaydet' : 'Print / Export PDF'}</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedInquiryForLoI(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl cursor-pointer"
              >
                {t.inquiry.closeBtn}
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </NeoCard>
  );
}
