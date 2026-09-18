'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';
import { useAppStore, MobilityInquiry } from '../../lib/store';

interface MobilityInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetHost: {
    hostId?: string;
    hostName: string;
    hostCountry: string;
    organisationType?: string;
    oid?: string;
  };
  onSuccess?: (inquiry: MobilityInquiry) => void;
  onNavigateToSent?: () => void;
}

export default function MobilityInquiryModal({
  isOpen,
  onClose,
  targetHost,
  onSuccess,
  onNavigateToSent,
}: MobilityInquiryModalProps) {
  const { t, locale } = useTranslation();
  const store = useAppStore();
  const { isSignedIn } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isEn = locale === 'en';

  // Form State initialized from active store
  const schoolName = store.schoolProfile.schoolName || (isEn ? 'Kapadokya Technical High School [MOCK]' : 'Kapadokya Teknik Lisesi [MOCK]');
  const schoolCity = store.schoolProfile.city || 'Nevşehir';
  const schoolOid = store.schoolProfile.oid || 'E10999001';
  const projectType = store.schoolProfile.accredited === 'yes' ? 'KA121' : 'KA122';

  const [vetField, setVetField] = useState(
    store.escoIsced.vetField || (isEn ? 'Information Technologies' : 'Bilişim Teknolojileri'),
  );
  const [participantCount, setParticipantCount] = useState(
    store.participantProfile.participantCount || 6,
  );
  const [accompanyingCount, setAccompanyingCount] = useState(
    store.participantProfile.accompanyingPersonsCount || 1,
  );
  const [durationDays, setDurationDays] = useState(14);
  const [startDate, setStartDate] = useState(store.participantProfile.startDate || '2026-10-15');
  const [endDate, setEndDate] = useState(store.participantProfile.endDate || '2026-10-29');

  const [reqAccommodation, setReqAccommodation] = useState(true);
  const [reqMeals, setReqMeals] = useState(true);
  const [reqTransfers, setReqTransfers] = useState(false);

  const [contactName, setContactName] = useState('Proje Koordinatörü');
  const [contactEmail, setContactEmail] = useState('erasmus@kapadokyateknik.k12.tr');
  const [notes, setNotes] = useState(
    isEn
      ? 'Our school is seeking a 14-day vocational internship for selected students with hands-on workshop training.'
      : 'Okulumuz mesleki eğitim hareketliliği kapsamında seçilen öğrencilerimiz için 14 günlük uygulamalı işletme stajı talep etmekteyiz.',
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdInquiry, setCreatedInquiry] = useState<MobilityInquiry | null>(null);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const inquiry = store.sendInquiry({
        isMock: Boolean(targetHost.hostId?.startsWith('demo-')),
        schoolName,
        schoolCity,
        schoolOid,
        schoolContactName: contactName,
        schoolContactEmail: contactEmail,
        projectType: projectType as 'KA121' | 'KA122',
        hostId: targetHost.hostId || 'demo-host-berlin',
        hostName: targetHost.hostName,
        hostCountry: targetHost.hostCountry,
        vetField,
        iscedCode: store.escoIsced.iscedCode || '0613',
        participantCount: Number(participantCount),
        accompanyingPersonsCount: Number(accompanyingCount),
        durationDays: Number(durationDays),
        targetStartDate: startDate,
        targetEndDate: endDate,
        logisticsRequired: {
          accommodation: reqAccommodation,
          meals: reqMeals,
          transfers: reqTransfers,
        },
        notes,
      });

      setIsSubmitting(false);
      setIsSuccess(true);
      setCreatedInquiry(inquiry);
      if (onSuccess) onSuccess(inquiry);
    }, 400);
  };

  const handleSwitchToHost = () => {
    onClose();
    store.loadHostDemoData(locale);
  };

  const handleViewSentInquiries = () => {
    onClose();
    if (onNavigateToSent) {
      onNavigateToSent();
    } else {
      const el = document.getElementById('sent-inquiries');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border-2 border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-slate-800 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">✉️</span>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                {locale === 'tr' ? 'Resmi Ön Talep İletişimi' : 'Institutional Mobility Inquiry'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mt-1 m-0">
              {t.inquiry.modalTitle}
            </h3>
            <p className="text-xs text-slate-300 mt-1 m-0">
              {t.inquiry.modalSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-xl font-bold leading-none cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-800">
          {isSuccess ? (
            /* Success Feedback View */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 text-3xl font-black flex items-center justify-center mx-auto animate-bounce">
                ✓
              </div>
              <h4 className="text-lg font-bold text-slate-950 m-0">
                {t.inquiry.successTitle}
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                {t.inquiry.successMessage}
              </p>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl max-w-md mx-auto text-left space-y-2">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold">{locale === 'tr' ? 'Talep Numarası:' : 'Inquiry ID:'}</span>
                  <span className="font-mono font-bold text-blue-700">{createdInquiry?.id}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold">{locale === 'tr' ? 'Hedef Ev Sahibi:' : 'Target Host:'}</span>
                  <span className="font-bold text-slate-900">{targetHost.hostName}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-semibold">{locale === 'tr' ? 'Durum:' : 'Status:'}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                    ⏳ {t.inquiry.statusPending}
                  </span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleViewSentInquiries}
                  className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>📬</span>
                  <span>{t.sentInquiries.viewSentInquiriesBtn}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
                >
                  {t.inquiry.closeBtn}
                </button>
              </div>

              {/* Optional Demo Shortcut (Only for unauthenticated visitors) */}
              {!isSignedIn && (
                <div className="pt-3 text-center text-xs text-slate-500 border-t border-slate-100 mt-2">
                  <span className="text-[11px] font-medium text-slate-400 mr-1.5">{t.sentInquiries.demoSwitchNotice}</span>
                  <button
                    type="button"
                    onClick={handleSwitchToHost}
                    className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    {t.sentInquiries.demoSwitchBtn}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Inquiry Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Partner Overview Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
                  <span className="text-[10px] font-bold uppercase text-blue-800 block mb-1">
                    🏛️ {t.inquiry.senderOrgTitle}
                  </span>
                  <div className="font-bold text-slate-900 truncate">{schoolName}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {schoolCity} • OID: <span className="font-mono font-bold text-slate-800">{schoolOid}</span> ({projectType})
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                    🏢 {t.inquiry.targetHostTitle}
                  </span>
                  <div className="font-bold text-slate-900 truncate">{targetHost.hostName}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    {targetHost.hostCountry} • {targetHost.organisationType || 'Enterprise'} {targetHost.oid ? `• OID: ${targetHost.oid}` : ''}
                  </div>
                </div>
              </div>

              {/* Mobility Parameters */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                <span className="font-bold text-slate-900 block text-xs border-b border-slate-200 pb-2">
                  📋 {t.inquiry.mobilityDetailsTitle}
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-3">
                    <label className="font-semibold text-slate-700 block mb-1">
                      {t.inquiry.fieldLabel} *
                    </label>
                    <input
                      type="text"
                      value={vetField}
                      onChange={(e) => setVetField(e.target.value)}
                      required
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      👥 {t.inquiry.participantsLabel}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={participantCount}
                      onChange={(e) => setParticipantCount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      🧑‍🏫 {locale === 'tr' ? 'Refakatçi Personel' : 'Accompanying Staff'}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={accompanyingCount}
                      onChange={(e) => setAccompanyingCount(Number(e.target.value))}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      ⏱️ {t.inquiry.durationLabel}
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="number"
                        min={5}
                        max={90}
                        value={durationDays}
                        onChange={(e) => setDurationDays(Number(e.target.value))}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                      <span className="text-slate-500 font-bold">{locale === 'tr' ? 'Gün' : 'Days'}</span>
                    </div>
                  </div>

                  <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        📅 {locale === 'tr' ? 'Hedef Başlangıç' : 'Target Start Date'}
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">
                        📅 {locale === 'tr' ? 'Hedef Bitiş' : 'Target End Date'}
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Logistics Requirements */}
                <div className="pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-700 block mb-2">
                    🏨 {t.inquiry.logisticsLabel}:
                  </span>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqAccommodation}
                        onChange={(e) => setReqAccommodation(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span>🏨 {locale === 'tr' ? 'Konaklama Şartı' : 'Accommodation Required'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqMeals}
                        onChange={(e) => setReqMeals(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span>🍽️ {locale === 'tr' ? 'Yemek Hizmeti' : 'Meals Required'}</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={reqTransfers}
                        onChange={(e) => setReqTransfers(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                      />
                      <span>🚗 {locale === 'tr' ? 'Havalimanı Transferi ve Yerel Ulaşım' : 'Airport Transfer and Local Transport'}</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* School Coordinator Contact & Institutional Note */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="font-bold text-slate-900 block text-xs border-b border-slate-200 pb-2">
                  👤 {locale === 'tr' ? 'İletişim & Koordinatör Bilgileri' : 'Contact & Coordinator Info'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {locale === 'tr' ? 'Yetkili Adı / Unvanı' : 'Coordinator Name'}
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">
                      {locale === 'tr' ? 'İletişim E-Postası' : 'Contact Email'}
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    💬 {t.inquiry.notesLabel}
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.inquiry.notesPlaceholder}
                    className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {t.inquiry.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>{isSubmitting ? '⏳' : '✉️'}</span>
                  <span>{isSubmitting ? (locale === 'tr' ? 'İletiliyor...' : 'Sending...') : t.inquiry.submitBtn}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
