'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';
import HostPortfolioModal from '../host/HostPortfolioModal';
import HostVerificationModal from '../host/HostVerificationModal';
import HostInquiriesSection from './HostInquiriesSection';
import { useAppStore } from '../../lib/store';

interface HostDashboardViewProps {
  hostData: any;
  onUpdateHost?: (updated: any) => void;
  isSimulated?: boolean;
}

export default function HostDashboardView({
  hostData,
  onUpdateHost,
  isSimulated = false,
}: HostDashboardViewProps) {
  const { t, locale } = useTranslation();
  const store = useAppStore();
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);

  // Fallback demo values if hostData is minimal
  const host = hostData || {
    id: 'demo-host',
    name: 'Berlin VET Training Solutions GmbH',
    organisationType: 'Company',
    countryCode: 'DE',
    city: 'Berlin',
    registeredAddress: 'Friedrichstraße 120, 10117 Berlin',
    oid: 'E10345678',
    primarySector: 'ict',
    verificationStatus: 'PENDING',
    profileCompletenessScore: 40,
    maxLearnersPerTerm: 4,
    totalAnnualCapacity: 12,
    yearsOfExperience: 3,
    totalParticipantsHosted: 48,
    consentPublicDisplay: true,
  };

  const completeness = host.profileCompletenessScore || 40;
  const isVerified = host.verificationStatus === 'VERIFIED';
  const isUnderReview = host.verificationStatus === 'UNDER_REVIEW';
  const needsUpdate = host.verificationStatus === 'NEEDS_UPDATE';

  const handlePortfolioSaved = (updated: any) => {
    if (onUpdateHost) onUpdateHost(updated);
  };

  const handleVerificationSubmitted = (updated: any) => {
    if (onUpdateHost) onUpdateHost(updated);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Host Institutional Welcome Header (Flat, Zero Gradient) */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
                <span>🏢</span>
                <span>{t.hostDashboard.portalBadge}</span>
              </span>

              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span>✓</span>
                  <span>{t.hostDashboard.verifiedBadge}</span>
                </span>
              ) : isUnderReview ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                  <span>⏳</span>
                  <span>{t.hostDashboard.underReviewBadge}</span>
                </span>
              ) : needsUpdate ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-900 border border-rose-300">
                  <span>⚠️</span>
                  <span>{t.hostDashboard.needsUpdateBadge}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300">
                  <span>ℹ️</span>
                  <span>{t.hostDashboard.pendingBadge}</span>
                </span>
              )}

              {isSimulated && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  <span>👁️</span>
                  <span>{t.hostDashboard.simulatedBadge}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight m-0">
              {host.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
              {host.city}, {host.countryCode} • OID: <strong className="font-mono text-slate-900">{host.oid || 'E10XXXXXX'}</strong> • {locale === 'tr' ? 'Sektör' : 'Sector'}: <strong className="capitalize text-slate-900">{host.primarySector}</strong>
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => {
                store.clearOrg();
                store.loadDemoData(locale);
              }}
              className="px-4 py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 border-2 border-blue-200 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title={locale === 'tr' ? 'Okul / Gönderen Kurum Görünümüne Geç' : 'Switch to School View'}
            >
              <span>🏛️</span>
              <span>{locale === 'tr' ? 'Okul Moduna Geç' : 'Switch to School'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsPortfolioModalOpen(true)}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
            >
              <span>📁</span>
              <span>{locale === 'tr' ? 'Portföy & Tanıtım' : 'Portfolio & Showcase'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>🛡️</span>
              <span>{locale === 'tr' ? 'Resmi Evrak & KYC' : 'KYC Verification & Badge'}</span>
            </button>
          </div>
        </div>

        {/* Completeness Progress Bar (Flat) */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {t.hostDashboard.completenessTitle}
              </span>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                {t.hostDashboard.completenessDesc}
              </p>
            </div>
            <span className="text-2xl font-black text-slate-950">
              %{completeness}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                completeness >= 80 ? 'bg-emerald-600' : completeness >= 50 ? 'bg-blue-600' : 'bg-amber-500'
              }`}
              style={{ width: `${completeness}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* 2. Incoming Mobility Inquiries (Cross-Role Sync & Demo Requests) */}
      <HostInquiriesSection />

      {/* 3. Management Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Tier 2 Portfolio */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">📋</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                {locale === 'tr' ? 'Kamusal Vitrin' : 'Public Showcase'}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 m-0">
                {t.hostDashboard.stage2Title}
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t.hostDashboard.stage2Desc}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Erasmus+ Tecrübesi:' : 'Erasmus+ Experience:'}</span>
                <span className="font-bold text-slate-900">{host.yearsOfExperience || 0} {locale === 'tr' ? 'Yıl' : 'Years'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Ağırlanan Katılımcı:' : 'Participants Hosted:'}</span>
                <span className="font-bold text-slate-900">{host.totalParticipantsHosted || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Logo Durumu:' : 'Logo Status:'}</span>
                <span className={`font-bold ${host.logoUrl ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {host.logoUrl ? (locale === 'tr' ? '✓ Yüklendi' : '✓ Uploaded') : (locale === 'tr' ? 'Eksik' : 'Missing')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Program Taslağı:' : 'Syllabus Sample:'}</span>
                <span className={`font-bold ${host.sampleMobilityProgrammeUrl ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {host.sampleMobilityProgrammeUrl ? (locale === 'tr' ? '✓ Yüklendi' : '✓ Uploaded') : (locale === 'tr' ? 'Eksik' : 'Missing')}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsPortfolioModalOpen(true)}
            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
          >
            {t.hostDashboard.stage2Btn} →
          </button>
        </div>

        {/* Card 2: Tier 3 KYC Verification */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🔒</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-300">
                {locale === 'tr' ? 'Admin Onaylı' : 'Admin Audited'}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 m-0">
                {t.hostDashboard.stage3Title}
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {t.hostDashboard.stage3Desc}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Sicil Belgesi (PDF):' : 'Registration Doc (PDF):'}</span>
                <span className={`font-bold ${host.registrationDocumentUrl ? 'text-emerald-700' : 'text-slate-500'}`}>
                  {host.registrationDocumentUrl ? (locale === 'tr' ? '✓ Yüklendi' : '✓ Uploaded') : (locale === 'tr' ? 'Bekleniyor' : 'Pending')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Vergi / VAT No:</span>
                <span className="font-mono font-bold text-slate-900">
                  {host.taxVatNumber || (locale === 'tr' ? 'Belirtilmedi' : 'Not set')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? '7/24 Acil Durum:' : '24/7 Emergency:'}</span>
                <span className={`font-bold ${host.emergencyContactPhone ? 'text-emerald-700' : 'text-rose-700'}`}>
                  {host.emergencyContactPhone ? (locale === 'tr' ? '✓ Tanımlı' : '✓ Active') : (locale === 'tr' ? 'Eksik' : 'Missing')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Onay Durumu:' : 'Audit Status:'}</span>
                <span className="font-bold text-slate-900">
                  {host.verificationStatus || 'PENDING'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsVerificationModalOpen(true)}
            className="w-full mt-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-2xs"
          >
            {t.hostDashboard.stage3Btn} →
          </button>
        </div>

        {/* Card 3: Capacity & Sectors */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl">🎓</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                {locale === 'tr' ? 'Staj Kontenjanı' : 'Internship Capacity'}
              </span>
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-950 m-0">
                {locale === 'tr' ? 'Kapasite & Kabul Koşulları' : 'Capacity & Terms'}
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {locale === 'tr'
                  ? 'Dönem başına kabul edebileceğiniz maksimum öğrenci sayısı ve staj imkanı sunduğunuz teknik alanlar.'
                  : 'Maximum student quota per mobility term and technical domains offered for vocational internships.'}
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Dönemlik Öğrenci Sınırı:' : 'Term Learner Quota:'}</span>
                <span className="font-bold text-slate-900">{host.maxLearnersPerTerm || 4} {locale === 'tr' ? 'Öğrenci' : 'Learners'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Yıllık Toplam Kapasite:' : 'Annual Total Capacity:'}</span>
                <span className="font-bold text-slate-900">{host.totalAnnualCapacity || 12} {locale === 'tr' ? 'Öğrenci' : 'Learners'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Ana Sektör:' : 'Primary Sector:'}</span>
                <span className="font-bold text-slate-900 capitalize">{host.primarySector}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">{locale === 'tr' ? 'Çalışma Dilleri:' : 'Working Languages:'}</span>
                <span className="font-bold text-slate-900">
                  {host.languages ? host.languages.join(', ') : 'EN, DE'}
                </span>
              </div>
            </div>
          </div>

          <Link
            href="/onboarding"
            className="w-full mt-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl border border-slate-300 transition-colors text-center block"
          >
            {locale === 'tr' ? 'Kurum Ayarlarını Düzenle →' : 'Edit Institution Settings →'}
          </Link>
        </div>
      </div>

      {/* 3. Erasmus+ Mobility Matching Tips for Hosts */}
      <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 m-0">
          💡 {locale === 'tr' ? 'Türkiye\'deki Okullarla Eşleşme İpuçları' : 'Tips for Matching with Sending Schools'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs text-slate-600">
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">
              {locale === 'tr' ? '1. Doğrulanmış Rozet Kazanın' : '1. Get Verified Badge'}
            </strong>
            {locale === 'tr'
              ? 'Sicil belgenizi ve vergi numaranızı yükleyip yöneticiden onay aldığınızda arama algoritmasında ilk sıraya çıkarsınız.'
              : 'Upload your corporate registry certificate and VAT number to rank at the top of school search algorithms.'}
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">
              {locale === 'tr' ? '2. 150 Kelimelik Net Tanıtım' : '2. Concise 150-Word Profile'}
            </strong>
            {locale === 'tr'
              ? 'İşletmenizin hangi makineleri, yazılımları veya staj ortamlarını sunduğunu açıkça belirtin.'
              : 'Clearly describe your workshop machinery, software stack, and mentorship environment.'}
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200">
            <strong className="text-slate-900 block mb-1">
              {locale === 'tr' ? '3. Örnek Program Taslağı Ekleyin' : '3. Add Sample Syllabus PDF'}
            </strong>
            {locale === 'tr'
              ? 'Öğrencilerin haftalık staj programını içeren bir taslak PDF eklemek okul koordinatörlerinin karar vermesini %80 hızlandırır.'
              : 'A weekly training outline PDF accelerates institutional approval from sending school coordinators by 80%.'}
          </div>
        </div>
      </div>

      {/* Modals */}
      <HostPortfolioModal
        isOpen={isPortfolioModalOpen}
        onClose={() => setIsPortfolioModalOpen(false)}
        host={host}
        onSuccess={handlePortfolioSaved}
      />

      <HostVerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        host={host}
        onSuccess={handleVerificationSubmitted}
      />
    </div>
  );
}
