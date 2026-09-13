'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../lib/i18n';
import { useAppStore, MobilityInquiry } from '../../lib/store';

export default function HostInquiriesSection() {
  const { t, locale } = useTranslation();
  const store = useAppStore();
  const isEn = locale === 'en';

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'DECLINED'>('ALL');
  const [selectedInquiryForLoI, setSelectedInquiryForLoI] = useState<MobilityInquiry | null>(null);
  const [selectedInquiryForDetails, setSelectedInquiryForDetails] = useState<MobilityInquiry | null>(null);

  // Reply / Action Modal State
  const [replyModal, setReplyModal] = useState<{
    isOpen: boolean;
    inquiry: MobilityInquiry | null;
    status: 'ACCEPTED' | 'REVISED' | 'DECLINED';
    note: string;
  }>({
    isOpen: false,
    inquiry: null,
    status: 'ACCEPTED',
    note: '',
  });

  // Action toast / alert message
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const inquiries = store.inquiries || [];

  const filteredInquiries = inquiries.filter((inq) => {
    if (activeFilter === 'PENDING') return inq.status === 'PENDING';
    if (activeFilter === 'ACCEPTED') return inq.status === 'ACCEPTED';
    if (activeFilter === 'DECLINED') return inq.status === 'DECLINED';
    return true;
  });

  const pendingCount = inquiries.filter((inq) => inq.status === 'PENDING').length;
  const acceptedCount = inquiries.filter((inq) => inq.status === 'ACCEPTED').length;
  const declinedCount = inquiries.filter((inq) => inq.status === 'DECLINED').length;

  const triggerAlert = (msg: string) => {
    setActionAlert(msg);
    setTimeout(() => {
      setActionAlert(null);
    }, 4000);
  };

  const openReplyModal = (
    inquiry: MobilityInquiry,
    targetStatus: 'ACCEPTED' | 'REVISED' | 'DECLINED',
  ) => {
    let initialNote = inquiry.hostReplyNote || '';
    if (!initialNote) {
      if (targetStatus === 'ACCEPTED') {
        initialNote = t.inquiry.templateAccept1;
      } else if (targetStatus === 'REVISED') {
        initialNote = t.inquiry.templateRevise1;
      } else if (targetStatus === 'DECLINED') {
        initialNote = t.inquiry.templateDecline1;
      }
    }

    setReplyModal({
      isOpen: true,
      inquiry,
      status: targetStatus,
      note: initialNote,
    });
  };

  const handleStatusChangeInModal = (newStatus: 'ACCEPTED' | 'REVISED' | 'DECLINED') => {
    let defaultTemplate = '';
    if (newStatus === 'ACCEPTED') defaultTemplate = t.inquiry.templateAccept1;
    if (newStatus === 'REVISED') defaultTemplate = t.inquiry.templateRevise1;
    if (newStatus === 'DECLINED') defaultTemplate = t.inquiry.templateDecline1;

    // Check if the current note matches an existing default template or is empty
    const isCurrentDefault =
      !replyModal.note.trim() ||
      replyModal.note === t.inquiry.templateAccept1 ||
      replyModal.note === t.inquiry.templateAccept2 ||
      replyModal.note === t.inquiry.templateRevise1 ||
      replyModal.note === t.inquiry.templateRevise2 ||
      replyModal.note === t.inquiry.templateDecline1 ||
      replyModal.note === t.inquiry.templateDecline2;

    setReplyModal((prev) => ({
      ...prev,
      status: newStatus,
      note: isCurrentDefault ? defaultTemplate : prev.note,
    }));
  };

  const handleSaveReply = () => {
    if (!replyModal.inquiry) return;
    const trimmedNote = replyModal.note.trim();

    store.updateInquiryStatus(
      replyModal.inquiry.id,
      replyModal.status,
      trimmedNote,
    );

    const statusLabel =
      replyModal.status === 'ACCEPTED'
        ? t.inquiry.statusAccepted
        : replyModal.status === 'REVISED'
          ? t.inquiry.statusRevised
          : t.inquiry.statusDeclined;

    triggerAlert(
      locale === 'tr'
        ? `Talep güncellendi: "${statusLabel}". Notunuz okula iletildi.`
        : `Inquiry updated: "${statusLabel}". Note delivered to sending school.`,
    );

    setReplyModal({
      isOpen: false,
      inquiry: null,
      status: 'ACCEPTED',
      note: '',
    });
  };

  const handleRevertToPending = (inquiryId: string) => {
    store.updateInquiryStatus(inquiryId, 'PENDING');
    triggerAlert(t.inquiry.undoSuccessMsg);
  };

  return (
    <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Action Notification Banner */}
      {actionAlert && (
        <div className="p-3.5 bg-blue-50 border-2 border-blue-200 rounded-xl text-xs font-bold text-blue-900 flex items-center justify-between gap-3 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">ℹ️</span>
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

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xl">📬</span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
              {locale === 'tr' ? 'Hareketlilik Talep Havuzu' : 'Incoming Mobility Inquiries'}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
              {inquiries.length} {locale === 'tr' ? 'Talep' : 'Inquiries'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 m-0">
            {t.inquiry.hostSectionTitle}
          </h2>
          <p className="text-xs text-slate-600 mt-1 m-0 leading-relaxed">
            {t.inquiry.hostSectionSubtitle}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto flex-wrap">
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeFilter === 'ALL'
                ? 'bg-white text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.inquiry.tabAll} ({inquiries.length})
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
            ⏳ {t.inquiry.tabPending} ({pendingCount})
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
            ✓ {t.inquiry.tabAccepted} ({acceptedCount})
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
            ✕ {t.inquiry.tabDeclined} ({declinedCount})
          </button>
        </div>
      </div>

      {/* Inquiries Cards Grid */}
      {filteredInquiries.length === 0 ? (
        <div className="p-8 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50/50 space-y-2">
          <div className="text-3xl">📭</div>
          <p className="text-xs text-slate-600 m-0 font-medium">
            {t.inquiry.emptyInquiriesMsg}
          </p>
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
                className={`p-5 rounded-2xl border-2 transition-all duration-200 ${
                  isAccepted
                    ? 'border-emerald-300 bg-emerald-50/20'
                    : isDeclined
                      ? 'border-rose-200 bg-rose-50/20'
                      : isRevised
                        ? 'border-blue-200 bg-blue-50/20'
                        : 'border-amber-200 bg-amber-50/15 hover:border-amber-300 hover:shadow-xs'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  {/* Left: School & Mobility Core Info */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        🇹🇷 {inq.schoolCity}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-900 border border-blue-200">
                        {inq.projectType === 'KA121' ? 'KA121 Akredite' : 'KA122 Kısa Dönem'}
                      </span>
                      {inq.isMock && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                          <span>🧪</span>
                          <span>{t.inquiry.mockBadge}</span>
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-slate-500">
                        OID: <strong className="text-slate-900">{inq.schoolOid}</strong>
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-extrabold text-slate-950 m-0">
                        {inq.schoolName}
                      </h3>
                      <div className="text-xs text-slate-600 mt-1 flex items-center gap-2 flex-wrap">
                        <span>🎯 {locale === 'tr' ? 'Meslek Alanı:' : 'Field:'} <strong className="text-slate-900 font-semibold">{inq.vetField}</strong></span>
                        <span>•</span>
                        <span>👥 <strong className="text-slate-900 font-semibold">{inq.participantCount}</strong> {locale === 'tr' ? 'Öğrenci' : 'Learners'} {inq.accompanyingPersonsCount > 0 ? `(+${inq.accompanyingPersonsCount} ${locale === 'tr' ? 'Refakatçi' : 'Staff'})` : ''}</span>
                        <span>•</span>
                        <span>⏱️ <strong className="text-slate-900 font-semibold">{inq.durationDays}</strong> {locale === 'tr' ? 'Gün' : 'Days'}</span>
                        <span>•</span>
                        <span>📅 {inq.targetStartDate} — {inq.targetEndDate}</span>
                      </div>
                    </div>

                    {/* Logistics badges */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-semibold text-slate-600 mr-1">
                        {locale === 'tr' ? 'Lojistik:' : 'Logistics:'}
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

                    {/* Coordinator note snippet */}
                    {inq.notes && (
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 leading-relaxed italic">
                        &ldquo;{inq.notes}&rdquo;
                      </div>
                    )}

                    {/* Host reply note display according to status */}
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
                              ? locale === 'tr' ? 'Ev Sahibi Resmi Yanıtı (Ön Kabul):' : 'Host Response (Acceptance):'
                              : isDeclined
                                ? locale === 'tr' ? 'Ev Sahibi Ret Gerekçesi:' : 'Host Decline Reason:'
                                : isRevised
                                  ? locale === 'tr' ? 'Ev Sahibi Revizyon Teklifi:' : 'Host Revision Request:'
                                  : locale === 'tr' ? 'Ev Sahibi Notu:' : 'Host Note:'}
                          </span>
                          <p className="m-0 font-medium leading-relaxed">{inq.hostReplyNote}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right: Status & Actions */}
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
                      {/* PENDING: Action buttons */}
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => openReplyModal(inq, 'ACCEPTED')}
                            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                          >
                            <span>✓</span>
                            <span>{t.inquiry.acceptBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openReplyModal(inq, 'REVISED')}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>✏️</span>
                            <span>{t.inquiry.reviseBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => openReplyModal(inq, 'DECLINED')}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <span>✕</span>
                            <span>{t.inquiry.declineBtn}</span>
                          </button>
                        </>
                      )}

                      {/* ACCEPTED: LoI Button */}
                      {isAccepted && (
                        <button
                          type="button"
                          onClick={() => setSelectedInquiryForLoI(inq)}
                          className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <span>📄</span>
                          <span>{locale === 'tr' ? 'Ön Kabul Belgesi (LoI) Gör' : 'View Acceptance (LoI)'}</span>
                        </button>
                      )}

                      {/* NON-PENDING: Edit Note & Revert (Undo) buttons */}
                      {!isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => openReplyModal(inq, inq.status === 'PENDING' ? 'ACCEPTED' : inq.status)}
                            className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>💬</span>
                            <span>{t.inquiry.editReplyBtn}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRevertToPending(inq.id)}
                            className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl border border-amber-300 transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                            title={locale === 'tr' ? 'Kararı geri alarak talebi beklemede durumuna döndür' : 'Revert decision back to pending review'}
                          >
                            <span>↩️</span>
                            <span>{t.inquiry.undoBtn}</span>
                          </button>
                        </>
                      )}

                      {/* View School Details Button */}
                      <button
                        type="button"
                        onClick={() => setSelectedInquiryForDetails(inq)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        {t.inquiry.viewDetailsBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ============================================================ */}
      {/* HOST REPLY / ACTION MODAL (Custom reply input with templates) */}
      {/* ============================================================ */}
      {replyModal.isOpen && replyModal.inquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white border-2 border-slate-300 rounded-2xl shadow-2xl p-6 space-y-5 text-xs max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  {t.inquiry.replyModalTitle}
                </span>
                <h3 className="text-base font-black text-slate-950 m-0">
                  {replyModal.inquiry.schoolName}
                </h3>
                <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                  {t.inquiry.replyModalSubtitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyModal({ isOpen: false, inquiry: null, status: 'ACCEPTED', note: '' })}
                className="text-slate-400 hover:text-slate-900 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* School Request Summary Card */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>{locale === 'tr' ? 'Mesleki Alan:' : 'VET Field:'} <strong className="text-slate-900">{replyModal.inquiry.vetField}</strong></span>
                <span>OID: <strong className="text-slate-900 font-mono">{replyModal.inquiry.schoolOid}</strong></span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-600">
                <span>👥 {replyModal.inquiry.participantCount} {locale === 'tr' ? 'Öğrenci' : 'Learners'} • ⏱️ {replyModal.inquiry.durationDays} {locale === 'tr' ? 'Gün' : 'Days'}</span>
                <span>📅 {replyModal.inquiry.targetStartDate} — {replyModal.inquiry.targetEndDate}</span>
              </div>
            </div>

            {/* Decision Selector Tabs */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-800 text-xs block">
                {t.inquiry.replyModalDecisionLabel}
              </label>
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => handleStatusChangeInModal('ACCEPTED')}
                  className={`py-2 px-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    replyModal.status === 'ACCEPTED'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>✓</span>
                  <span>{locale === 'tr' ? 'Ön Kabul Ver' : 'Accept (LoI)'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChangeInModal('REVISED')}
                  className={`py-2 px-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    replyModal.status === 'REVISED'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>✏️</span>
                  <span>{locale === 'tr' ? 'Revizyon İste' : 'Request Rev.'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleStatusChangeInModal('DECLINED')}
                  className={`py-2 px-2.5 rounded-lg font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    replyModal.status === 'DECLINED'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>✕</span>
                  <span>{locale === 'tr' ? 'Reddet' : 'Decline'}</span>
                </button>
              </div>
            </div>

            {/* Quick Templates Buttons */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 block">
                {t.inquiry.replyModalTemplatesLabel}
              </span>
              <div className="flex flex-col gap-1.5">
                {replyModal.status === 'ACCEPTED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setReplyModal((prev) => ({ ...prev, note: t.inquiry.templateAccept1 }))}
                      className="text-left px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-[11px] text-slate-700 hover:text-emerald-950 transition-colors cursor-pointer truncate"
                    >
                      💡 {t.inquiry.templateAccept1}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyModal((prev) => ({ ...prev, note: t.inquiry.templateAccept2 }))}
                      className="text-left px-3 py-1.5 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-[11px] text-slate-700 hover:text-emerald-950 transition-colors cursor-pointer truncate"
                    >
                      💡 {t.inquiry.templateAccept2}
                    </button>
                  </>
                )}

                {replyModal.status === 'REVISED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setReplyModal((prev) => ({ ...prev, note: t.inquiry.templateRevise1 }))}
                      className="text-left px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-[11px] text-slate-700 hover:text-blue-950 transition-colors cursor-pointer truncate"
                    >
                      💡 {t.inquiry.templateRevise1}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyModal((prev) => ({ ...prev, note: t.inquiry.templateRevise2 }))}
                      className="text-left px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-[11px] text-slate-700 hover:text-blue-950 transition-colors cursor-pointer truncate"
                    >
                      💡 {t.inquiry.templateRevise2}
                    </button>
                  </>
                )}

                {replyModal.status === 'DECLINED' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setReplyModal((prev) => ({ ...prev, note: t.inquiry.templateDecline1 }))}
                      className="text-left px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-[11px] text-slate-700 hover:text-rose-950 transition-colors cursor-pointer truncate"
                    >
                      💡 {t.inquiry.templateDecline1}
                    </button>
                    <button
                      type="button"
                      onClick={() => setReplyModal((prev) => ({ ...prev, note: t.inquiry.templateDecline2 }))}
                      className="text-left px-3 py-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50/50 text-[11px] text-slate-700 hover:text-rose-950 transition-colors cursor-pointer truncate"
                    >
                      💡 {t.inquiry.templateDecline2}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Custom Host Reply Textarea */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-800 text-xs">
                  {t.inquiry.replyModalNoteLabel}
                </label>
                <span className="text-[10px] text-slate-400 font-mono">
                  {replyModal.note.length} {locale === 'tr' ? 'karakter' : 'characters'}
                </span>
              </div>
              <textarea
                rows={4}
                value={replyModal.note}
                onChange={(e) => setReplyModal((prev) => ({ ...prev, note: e.target.value }))}
                placeholder={t.inquiry.replyModalPlaceholder}
                className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-xs text-slate-900 leading-relaxed outline-none shadow-2xs resize-y"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setReplyModal({ isOpen: false, inquiry: null, status: 'ACCEPTED', note: '' })}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                {t.inquiry.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleSaveReply}
                disabled={!replyModal.note.trim()}
                className={`px-5 py-2 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-xs flex items-center gap-1.5 ${
                  !replyModal.note.trim()
                    ? 'bg-slate-400 cursor-not-allowed'
                    : replyModal.status === 'ACCEPTED'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : replyModal.status === 'REVISED'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                <span>💾</span>
                <span>{t.inquiry.replyModalSaveBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* LETTER OF INTENT (LoI) PREVIEW MODAL                         */}
      {/* ============================================================ */}
      {selectedInquiryForLoI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-xl bg-white border-2 border-slate-300 rounded-2xl shadow-2xl p-6 space-y-5 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  Erasmus+ VET Letter of Intent
                </span>
                <h3 className="text-base font-black text-slate-950 m-0">
                  {locale === 'tr' ? 'Hareketlilik Ön Kabul ve Kontenjan Belgesi' : 'Mobility Letter of Intent & Quota Allocation'}
                </h3>
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
                <strong>Berlin VET Training Solutions GmbH (OID: E10345678)</strong>,{' '}
                <strong>{selectedInquiryForLoI.schoolName} (OID: {selectedInquiryForLoI.schoolOid})</strong> tarafından iletilen{' '}
                <strong>{selectedInquiryForLoI.vetField}</strong> alanındaki mesleki eğitim staj talebini incelemiş ve{' '}
                <strong>{selectedInquiryForLoI.participantCount} öğrenci</strong> için{' '}
                <strong>{selectedInquiryForLoI.targetStartDate} — {selectedInquiryForLoI.targetEndDate}</strong> tarihleri arasında işletme kontenjanı ayırmıştır.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200 text-[11px] text-slate-600">
                <div>Ev Sahibi İrtibat: <strong>Klaus Weber</strong></div>
                <div>Durum: <strong className="text-emerald-700">✓ Onaylandı (LoI Aktif)</strong></div>
              </div>
              {selectedInquiryForLoI.hostReplyNote && (
                <div className="p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-800">
                  <strong className="text-emerald-800">Ev Sahibi Notu:</strong> {selectedInquiryForLoI.hostReplyNote}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                🖨️ {locale === 'tr' ? 'Yazdır / PDF Olarak Kaydet' : 'Print / Export PDF'}
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
        </div>
      )}

      {/* ============================================================ */}
      {/* SCHOOL CONTACT DETAILS MODAL                                 */}
      {/* ============================================================ */}
      {selectedInquiryForDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white border-2 border-slate-300 rounded-2xl shadow-2xl p-6 space-y-4 text-xs">
            <div className="flex justify-between items-start border-b border-slate-200 pb-3">
              <div>
                <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider">
                  {selectedInquiryForDetails.projectType} • OID: {selectedInquiryForDetails.schoolOid}
                </span>
                <h3 className="text-base font-bold text-slate-950 m-0">
                  {selectedInquiryForDetails.schoolName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiryForDetails(null)}
                className="text-slate-400 hover:text-slate-900 font-bold text-lg p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-slate-700">
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>{locale === 'tr' ? 'Şehir / Ülke:' : 'City / Country:'}</span>
                <strong className="text-slate-900">{selectedInquiryForDetails.schoolCity}, Türkiye</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>{locale === 'tr' ? 'Yetkili İrtibat:' : 'Coordinator:'}</span>
                <strong className="text-slate-900">{selectedInquiryForDetails.schoolContactName || 'Proje Koordinatörü'}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>{locale === 'tr' ? 'İletişim E-Postası:' : 'Contact Email:'}</span>
                <strong className="text-blue-700 font-mono">{selectedInquiryForDetails.schoolContactEmail || 'erasmus@kapadokyateknik.k12.tr'}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1.5">
                <span>{locale === 'tr' ? 'Talep Tarihi:' : 'Submission Date:'}</span>
                <span className="font-mono text-slate-500">{new Date(selectedInquiryForDetails.createdAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US')}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedInquiryForDetails(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                {t.inquiry.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
