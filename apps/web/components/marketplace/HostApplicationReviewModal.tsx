'use client';

import React, { useState } from 'react';
import { MarketplaceApplication, MarketplaceApplicationStatus } from '@mobility-nexus/types';
import {
  X,
  ShieldCheck,
  Building2,
  Users,
  Euro,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Send,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface HostApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: MarketplaceApplication | null;
  onSuccess: () => void;
}

export function HostApplicationReviewModal({
  isOpen,
  onClose,
  application,
  onSuccess,
}: HostApplicationReviewModalProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  if (!isOpen || !application) return null;

  const defaultNote = isTr
    ? 'Başvurunuz ve OID numaranız incelenmiş olup kontenjanınız onaylanmıştır. Kabul belgesi taslağı hazırlanmaktadır.'
    : 'Your application and OID have been verified and your quota is confirmed. Acceptance draft documentation is in progress.';

  const [decisionNote, setDecisionNote] = useState(
    application.hostDecisionNote || defaultNote
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleUpdateStatus = async (status: 'CONFIRMED' | 'DECLINED') => {
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/marketplace/host/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: application.id,
          status,
          hostDecisionNote: decisionNote,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || (isTr ? 'Durum güncellenemedi.' : 'Failed to update status.'));
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || (isTr ? 'İşlem başarısız oldu.' : 'Action failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">{isTr ? 'Kurumsal Başvuru Değerlendirme' : 'Institutional Application Review'}</h2>
              <p className="text-xs text-slate-300">
                {isTr ? 'Başvuru No:' : 'Application ID:'} <span className="font-mono">{application.id}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* School & Application Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isTr ? 'Başvuran Gönderen Kurum (Beneficiary):' : 'Applicant Sending Institution (Beneficiary):'}
                </span>
                <h3 className="text-sm font-bold text-slate-900">{application.schoolName}</h3>
                <p className="text-slate-600 mt-0.5">
                  {application.schoolCity || (isTr ? 'Türkiye' : 'Turkey')} • {isTr ? 'Yetkili:' : 'Contact:'} <strong>{application.contactName}</strong> (
                  <a
                    href={`mailto:${application.contactEmail}`}
                    className="text-blue-600 hover:underline"
                  >
                    {application.contactEmail}
                  </a>
                  )
                </p>
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white border border-slate-300 text-slate-800 shadow-2xs">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                OID: {application.schoolOid}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-200 text-slate-700">
              <div>
                <span className="text-slate-500 block text-[11px]">{isTr ? 'Proje Türü:' : 'Project Type:'}</span>
                <strong className="text-blue-700 font-semibold">{application.projectType}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{isTr ? 'Katılımcı:' : 'Participants:'}</span>
                <strong>{application.participantCount} {isTr ? 'Öğretmen' : 'Staff'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{isTr ? 'Eğitim Süresi:' : 'Duration:'}</span>
                <strong>{application.durationDays} {isTr ? 'Gün' : 'Days'}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">{isTr ? 'Mevcut Durum:' : 'Current Status:'}</span>
                <strong
                  className={
                    application.status === 'CONFIRMED'
                      ? 'text-emerald-700'
                      : application.status === 'DECLINED'
                      ? 'text-rose-700'
                      : 'text-amber-700'
                  }
                >
                  {application.status === 'CONFIRMED'
                    ? (isTr ? 'Onaylandı' : 'CONFIRMED')
                    : application.status === 'DECLINED'
                    ? (isTr ? 'Reddedildi' : 'DECLINED')
                    : (isTr ? 'Onay Bekliyor' : 'PENDING')}
                </strong>
              </div>
            </div>
          </div>

          {/* Activity applied for */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {isTr ? 'Başvurulan Faaliyet:' : 'Applied Activity:'}
            </span>
            <div className="font-semibold text-slate-900 text-sm">
              {application.courseTitle || application.jobShadowingTitle}
            </div>
            {application.sessionDates && (
              <p className="text-slate-600 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                {isTr ? 'Seans:' : 'Session:'} {application.sessionDates} ({application.sessionLocation})
              </p>
            )}
          </div>

          {/* Erasmus+ Grant Value for Host */}
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Euro className="w-5 h-5 text-emerald-700" />
              <div>
                <span className="font-bold text-emerald-950 block">
                  {isTr ? 'Erasmus+ Bütçe Karşılığı (80 €/gün):' : 'Erasmus+ Budget Equivalent (80 €/day):'}
                </span>
                <span className="text-emerald-700 text-[11px]">
                  {application.participantCount} {isTr ? 'Katılımcı' : 'Participants'} × {application.durationDays} {isTr ? 'Gün' : 'Days'} × 80 €
                </span>
              </div>
            </div>
            <span className="text-base font-black text-emerald-900 bg-white px-3 py-1 rounded-lg border border-emerald-300">
              {application.totalGrantEur.toLocaleString(isTr ? 'tr-TR' : 'en-US')} €
            </span>
          </div>

          {/* School Special notes */}
          {application.specialNotes && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {isTr ? 'Okul Tarafından İletilen Notlar:' : 'Notes Provided by School:'}
              </label>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 italic">
                "{application.specialNotes}"
              </div>
            </div>
          )}

          {/* Host Decision Note */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {isTr ? 'Kurumsal Karar Notunuz (Okula İletilecek):' : 'Institutional Decision Note (Sent to School):'}
            </label>
            <textarea
              rows={3}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
              placeholder={isTr ? 'Onay gerekçesi, kabul belgesi takvimi veya ret açıklaması...' : 'Approval rationale, acceptance documentation timeline or decline note...'}
            />
          </div>

          {/* Decision Actions */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isTr ? 'Kapat' : 'Close'}
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleUpdateStatus('DECLINED')}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold transition-all shadow-2xs disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>{isTr ? 'Başvuruyu Reddet' : 'Decline Application'}</span>
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => handleUpdateStatus('CONFIRMED')}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isTr ? 'Başvuruyu Onayla' : 'Confirm Application'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
