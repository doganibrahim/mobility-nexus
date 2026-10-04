'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';
import { useAppStore, MobilityInquiry } from '../../lib/store';
import InquiryStepIndicator from './InquiryStepIndicator';
import PostSubmissionRoadmap from './PostSubmissionRoadmap';

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

  // Step Management: 1 = Mobility Type & Participants, 2 = Logistics & Contact
  const [step, setStep] = useState<1 | 2>(1);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form State initialized from active store
  const schoolName =
    store.schoolProfile.schoolName ||
    (isEn ? 'Kapadokya Technical High School [MOCK]' : 'Kapadokya Teknik Lisesi [MOCK]');
  const schoolCity = store.schoolProfile.city || 'Nevşehir';
  const schoolOid = store.schoolProfile.oid || 'E10999001';
  const projectType = store.schoolProfile.accredited === 'yes' ? 'KA121' : 'KA122';

  // Step 1: Mobility Parameters
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

  // Step 2: Logistics & Contact Info
  const [reqAccommodation, setReqAccommodation] = useState(true);
  const [reqMeals, setReqMeals] = useState(true);
  const [reqTransfers, setReqTransfers] = useState(false);
  const [reqInclusion, setReqInclusion] = useState(false);

  const [contactName, setContactName] = useState(
    isEn ? 'Mobility Coordinator' : 'Proje Koordinatörü',
  );
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

  // Validate step 1 before proceeding to step 2
  const handleNextStep = () => {
    if (!vetField || vetField.trim() === '') {
      setValidationError(
        locale === 'tr'
          ? 'Lütfen mesleki eğitim alanını / bölümünü belirtin.'
          : 'Please specify the vocational field / sector.',
      );
      return;
    }
    if (participantCount < 1) {
      setValidationError(
        locale === 'tr'
          ? 'Katılımcı sayısı en az 1 olmalıdır.'
          : 'Learner count must be at least 1.',
      );
      return;
    }
    if (durationDays < 1) {
      setValidationError(
        locale === 'tr'
          ? 'Hareketlilik süresi en az 1 gün olmalıdır.'
          : 'Mobility duration must be at least 1 day.',
      );
      return;
    }
    if (!startDate || !endDate) {
      setValidationError(
        locale === 'tr'
          ? 'Lütfen hedef başlangıç ve bitiş tarihlerini seçin.'
          : 'Please select both target start and end dates.',
      );
      return;
    }

    setValidationError(null);
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const fullNotes = reqInclusion
        ? `${notes}\n[${isEn ? 'Inclusion Support / Special Accessibility Requested' : 'Engelsiz Erişim / Inclusion Desteği Talep Edildi'}]`
        : notes;

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
        notes: fullNotes,
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
      } else if (typeof window !== 'undefined') {
        window.location.href = '/school/pipeline#sent-inquiries';
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
            <p className="text-xs text-slate-300 mt-1 m-0 leading-relaxed">
              {t.inquiry.modalSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 text-xl font-bold leading-none cursor-pointer"
            aria-label={t.inquiry.closeBtn}
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs text-slate-800">
          {isSuccess && createdInquiry ? (
            /* Post-Submission Visual 3-Phase Roadmap */
            <PostSubmissionRoadmap
              inquiry={createdInquiry}
              targetHost={targetHost}
              onClose={onClose}
              onNavigateToDashboard={handleViewSentInquiries}
              onSwitchToHost={handleSwitchToHost}
              isSignedIn={isSignedIn}
            />
          ) : (
            /* 2-Step Multi-Step Inquiry Form */
            <div className="space-y-5">
              {/* Interactive Step Indicator */}
              <InquiryStepIndicator
                currentStep={step}
                onStepClick={(targetStep) => {
                  if (targetStep === 1) {
                    setStep(1);
                  } else {
                    handleNextStep();
                  }
                }}
              />

              {/* Validation Warning Alert */}
              {validationError && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span>⚠️</span>
                    <span>{validationError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setValidationError(null)}
                    className="text-amber-700 hover:text-amber-950 font-bold ml-2 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              )}

              {/* STEP 1: Mobility Type, Dates & Participants */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Partner Overview Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/50">
                      <span className="text-[10px] font-bold uppercase text-blue-800 block mb-1">
                        🏛️ {t.inquiry.senderOrgTitle}
                      </span>
                      <div className="font-bold text-slate-900 truncate">{schoolName}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {schoolCity} • OID:{' '}
                        <span className="font-mono font-bold text-slate-800">{schoolOid}</span> (
                        {projectType})
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/50">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block mb-1">
                        🏢 {t.inquiry.targetHostTitle}
                      </span>
                      <div className="font-bold text-slate-900 truncate">
                        {targetHost.hostName}
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">
                        {targetHost.hostCountry} • {targetHost.organisationType || 'Enterprise'}{' '}
                        {targetHost.oid ? `• OID: ${targetHost.oid}` : ''}
                      </div>
                    </div>
                  </div>

                  {/* Mobility Parameters Card */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-4">
                    <span className="font-bold text-slate-900 block text-xs border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span>📋 {t.inquiry.mobilityDetailsTitle}</span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {t.inquiry.stepBadge} 1/2
                      </span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-3">
                        <label className="font-semibold text-slate-700 block mb-1">
                          {t.inquiry.fieldLabel} *
                        </label>
                        <input
                          type="text"
                          value={vetField}
                          onChange={(e) => {
                            setVetField(e.target.value);
                            if (validationError) setValidationError(null);
                          }}
                          placeholder={
                            locale === 'tr'
                              ? 'Örn: Bilişim Teknolojileri / CNC Torna / Gastronomi'
                              : 'e.g. Information Technologies / CNC Machining / Culinary Arts'
                          }
                          required
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                      </div>

                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          👥 {t.inquiry.participantsLabel} *
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
                          ⏱️ {t.inquiry.durationLabel} *
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min={1}
                            max={90}
                            value={durationDays}
                            onChange={(e) => setDurationDays(Number(e.target.value))}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <span className="text-slate-500 font-bold shrink-0">
                            {locale === 'tr' ? 'Gün' : 'Days'}
                          </span>
                        </div>
                      </div>

                      <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            📅 {locale === 'tr' ? 'Hedef Başlangıç' : 'Target Start Date'} *
                          </label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              if (validationError) setValidationError(null);
                            }}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-slate-700 block mb-1">
                            📅 {locale === 'tr' ? 'Hedef Bitiş' : 'Target End Date'} *
                          </label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              if (validationError) setValidationError(null);
                            }}
                            className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 1 Actions */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      {t.inquiry.cancelBtn}
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{t.inquiry.nextStepBtn}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Logistics Preferences & Contact */}
              {step === 2 && (
                <form onSubmit={handleSubmit} className="space-y-4 animate-fadeIn">
                  {/* Step 1 Recap Summary Banner */}
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 truncate">
                      <div className="font-bold text-slate-900 truncate">
                        <span>{vetField}</span>
                        <span className="text-slate-500 font-normal">
                          {' '}
                          • {participantCount} {locale === 'tr' ? 'Öğrenci' : 'Learners'}
                          {accompanyingCount > 0 &&
                            ` (+${accompanyingCount} ${locale === 'tr' ? 'refakatçi' : 'staff'})`}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 truncate">
                        📅 {startDate} → {endDate} ({durationDays} {locale === 'tr' ? 'Gün' : 'Days'})
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline shrink-0 cursor-pointer"
                    >
                      {locale === 'tr' ? '✏️ Değiştir' : '✏️ Edit'}
                    </button>
                  </div>

                  {/* Logistics Requirements */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <span className="font-bold text-slate-900 block text-xs border-b border-slate-200 pb-2 flex items-center justify-between">
                      <span>🏨 {t.inquiry.logisticsLabel}</span>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {t.inquiry.stepBadge} 2/2
                      </span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={reqAccommodation}
                          onChange={(e) => setReqAccommodation(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="font-medium text-slate-800">
                          🏨 {locale === 'tr' ? 'Konaklama Hizmeti Şartı' : 'Accommodation Required'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={reqMeals}
                          onChange={(e) => setReqMeals(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="font-medium text-slate-800">
                          🍽️ {locale === 'tr' ? 'Yemek Hizmeti Desteği' : 'Meals Required'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={reqTransfers}
                          onChange={(e) => setReqTransfers(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="font-medium text-slate-800">
                          🚗 {locale === 'tr' ? 'Transfer & Yerel Ulaşım' : 'Airport & Local Transfer'}
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors">
                        <input
                          type="checkbox"
                          checked={reqInclusion}
                          onChange={(e) => setReqInclusion(e.target.checked)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                        />
                        <span className="font-medium text-slate-800">
                          ♿ {t.inquiry.reqInclusionLabel}
                        </span>
                      </label>
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
                          {locale === 'tr' ? 'Yetkili Adı / Unvanı' : 'Coordinator Name'} *
                        </label>
                        <input
                          type="text"
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          required
                          className="w-full p-2.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">
                          {locale === 'tr' ? 'İletişim E-Postası' : 'Contact Email'} *
                        </label>
                        <input
                          type="email"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          required
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

                  {/* Step 2 Actions */}
                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2.5">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                    >
                      {t.inquiry.prevStepBtn}
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{isSubmitting ? '⏳' : '✉️'}</span>
                      <span>
                        {isSubmitting
                          ? locale === 'tr'
                            ? 'İletiliyor...'
                            : 'Sending...'
                          : t.inquiry.submitBtn}
                      </span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
