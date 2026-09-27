'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';
import HostPortfolioModal from '../host/HostPortfolioModal';
import HostVerificationModal from '../host/HostVerificationModal';
import HostInquiriesSection from './HostInquiriesSection';
import StatHighlightBadge from '../ui/StatHighlightBadge';
import RoleThemedCard from '../ui/RoleThemedCard';
import StatusAccentBadge from '../ui/StatusAccentBadge';
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

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Host Institutional Welcome Header */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                <span>🏢</span>
                <span>{t.hostDashboard.portalBadge}</span>
              </span>

              {isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span>✓</span>
                  <span>
                    {isSimulated || host.id?.startsWith('demo-')
                      ? (locale === 'tr' ? 'Örnek Doğrulama (Demo)' : 'Sample Verification (Demo)')
                      : t.hostDashboard.verifiedBadge}
                  </span>
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
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  <span>👁️</span>
                  <span>{t.hostDashboard.simulatedBadge}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
              {host.name}
            </h1>
            <p className="text-sm text-slate-600 m-0 leading-relaxed font-medium">
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
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 border-2 border-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>📁</span>
              <span>{locale === 'tr' ? 'Portföy & Tanıtım' : 'Portfolio & Showcase'}</span>
            </button>
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(true)}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>🛡️</span>
              <span>{locale === 'tr' ? 'Resmi Evrak & KYC' : 'KYC Verification & Badge'}</span>
            </button>
          </div>
        </div>

        {/* Completeness Progress Bar */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                {t.hostDashboard.completenessTitle}
              </span>
              <p className="text-xs text-slate-500 m-0 mt-0.5">
                {t.hostDashboard.completenessDesc}
              </p>
            </div>
            <span className="text-3xl font-black text-slate-950">
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

      {/* 2. Key Host Metric Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatHighlightBadge
          value={`${host.maxLearnersPerTerm || 4}`}
          label={locale === 'tr' ? 'Dönemlik Öğrenci Kontenjanı' : 'Term Learner Quota'}
          sublabel={`${locale === 'tr' ? 'Yıllık Toplam Kapasite' : 'Annual Capacity'}: ${host.totalAnnualCapacity || 12} ${locale === 'tr' ? 'öğrenci' : 'students'}`}
          accent="emerald"
          icon="🎓"
          badgeText={host.primarySector ? host.primarySector.toUpperCase() : 'VET'}
          linkHref="/marketplace"
          linkLabel={locale === 'tr' ? 'Pazaryeri' : 'Marketplace'}
        />

        <StatHighlightBadge
          value={`${host.yearsOfExperience || 3} ${locale === 'tr' ? 'Yıl' : 'Yrs'}`}
          label={locale === 'tr' ? 'Erasmus+ Tecrübesi' : 'Erasmus+ Experience'}
          sublabel={`${locale === 'tr' ? 'Ağırlanan Katılımcı' : 'Hosted Participants'}: ${host.totalParticipantsHosted || 48} ${locale === 'tr' ? 'kişi' : 'persons'}`}
          accent="blue"
          icon="🌍"
          badgeText={locale === 'tr' ? 'Tecrübeli Partner' : 'Experienced'}
          linkHref="/about"
          linkLabel={locale === 'tr' ? 'Standartlar' : 'Standards'}
        />

        <StatHighlightBadge
          value={`%${completeness}`}
          label={locale === 'tr' ? 'Profil & KYC Durumu' : 'Profile & KYC Audit'}
          sublabel={`${locale === 'tr' ? 'Onay Durumu' : 'Status'}: ${host.verificationStatus || 'PENDING'}`}
          accent="amber"
          icon="🛡️"
          badgeText={isVerified ? (locale === 'tr' ? '✓ Onaylı' : '✓ Verified') : (locale === 'tr' ? 'Denetim Bekliyor' : 'Pending Audit')}
        />
      </div>

      {/* 3. Incoming Mobility Inquiries (Cross-Role Sync & Demo Requests) */}
      <HostInquiriesSection hostId={host.id} />

      {/* 4. Management Cards Grid (Color-Blocked Role Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Tier 2 Portfolio */}
        <RoleThemedCard
          theme="SCHOOL"
          variant="solid-header"
          title={t.hostDashboard.stage2Title}
          subtitle={t.hostDashboard.stage2Desc}
          icon="📋"
          badge={
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white text-blue-900 shadow-2xs">
              {locale === 'tr' ? 'Kamusal Vitrin' : 'Public Showcase'}
            </span>
          }
          footer={
            <button
              type="button"
              onClick={() => setIsPortfolioModalOpen(true)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              {t.hostDashboard.stage2Btn} →
            </button>
          }
        >
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
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
        </RoleThemedCard>

        {/* Card 2: Tier 3 KYC Verification */}
        <RoleThemedCard
          theme="GRANT"
          variant="solid-header"
          title={t.hostDashboard.stage3Title}
          subtitle={t.hostDashboard.stage3Desc}
          icon="🔒"
          badge={
            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white text-amber-950 shadow-2xs">
              {locale === 'tr' ? 'Admin Onaylı' : 'Admin Audited'}
            </span>
          }
          footer={
            <button
              type="button"
              onClick={() => setIsVerificationModalOpen(true)}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              {t.hostDashboard.stage3Btn} →
            </button>
          }
        >
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
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

          {/* Authentic Badge Conditions Callout */}
          <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl space-y-1.5 text-xs text-amber-950 leading-relaxed">
            <div className="font-extrabold flex items-center gap-1.5 text-amber-900 uppercase tracking-wider text-xs">
              <span>🛡️</span>
              <span>{locale === 'tr' ? 'Resmi Doğrulanmış Partner Koşulları' : 'Official Verified Badge Criteria'}</span>
            </div>
            <p className="m-0 text-xs">
              {locale === 'tr'
                ? 'Gerçek "Doğrulanmış Partner" rozeti için aşağıdaki 3 belgenin eksiksiz sunulması ve kurumsal KYC denetiminden geçilmesi şarttır:'
                : 'The authoritative "Verified Partner" badge strictly requires all 3 credentials below and Admin KYC audit:'}
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-xs text-amber-900 m-0">
              <li>{locale === 'tr' ? 'Resmi Ticaret Sicil Gazetesi / Faaliyet Belgesi' : 'Official Company Registration Certificate'}</li>
              <li>{locale === 'tr' ? 'Ulusal Vergi / VAT Kimlik Numarası Teyidi' : 'Valid Tax / VAT Identification Number'}</li>
              <li>{locale === 'tr' ? '7/24 Kesintisiz Acil Durum Yetkilisi' : '24/7 Dedicated Emergency Contact'}</li>
            </ul>
          </div>
        </RoleThemedCard>

        {/* Card 3: Capacity & Sectors */}
        <RoleThemedCard
          theme="HOST"
          variant="solid-header"
          title={locale === 'tr' ? 'Kapasite & Kabul Koşulları' : 'Capacity & Terms'}
          subtitle={
            locale === 'tr'
              ? 'Dönem başına kabul edebileceğiniz maksimum öğrenci sayısı ve staj imkanı sunduğunuz teknik alanlar.'
              : 'Maximum student quota per mobility term and technical domains offered for vocational internships.'
          }
          icon="🎓"
          badge={
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-white text-emerald-900 shadow-2xs">
              {locale === 'tr' ? 'Staj Kontenjanı' : 'Internship Capacity'}
            </span>
          }
          footer={
            <Link
              href="/onboarding"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors shadow-2xs text-center block cursor-pointer"
            >
              {locale === 'tr' ? 'Kapasiteyi Güncelle' : 'Update Capacity'} →
            </Link>
          }
        >
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 text-xs">
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
        </RoleThemedCard>
      </div>
    </div>
  );
}
