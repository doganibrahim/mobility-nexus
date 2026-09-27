'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';
import { useAppStore } from '../../lib/store';
import SystemKpiCard from '../gateway/SystemKpiCard';
import StatHighlightBadge from '../ui/StatHighlightBadge';
import RoleThemedCard from '../ui/RoleThemedCard';
import StatusAccentBadge from '../ui/StatusAccentBadge';

interface SchoolDashboardViewProps {
  isSimulated?: boolean;
}

export default function SchoolDashboardView({
  isSimulated = false,
}: SchoolDashboardViewProps) {
  const { t, locale } = useTranslation();
  const store = useAppStore();

  const {
    schoolName,
    city,
    accredited,
    oid,
    institutionNeed,
    erasmusPlan,
  } = store.schoolProfile;

  const {
    participantType,
    mobilityGoal,
    participantCount,
  } = store.participantProfile;

  const {
    vetField,
    iscedCode,
    escoTerm,
  } = store.escoIsced;

  const {
    competenceScore,
    targetScore,
  } = store.competence;

  const inquiries = store.inquiries || [];
  const acceptedInquiries = inquiries.filter((i) => i.status === 'ACCEPTED');
  const pendingInquiries = inquiries.filter((i) => i.status === 'PENDING');

  const displayName =
    schoolName ||
    store.currentOrg?.name ||
    (locale === 'tr' ? 'Mesleki ve Teknik Anadolu Lisesi' : 'Vocational & Technical High School');

  const displayCity = city || store.currentOrg?.city || (locale === 'tr' ? 'İstanbul' : 'Istanbul');
  const displayOid = oid || store.currentOrg?.oid || 'E10389241';

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. School Institutional Welcome Header */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
                <span>🏛️</span>
                <span>{locale === 'tr' ? 'Okul & Gönderen Kurum Masası' : 'School & Sending Org Portal'}</span>
              </span>

              {accredited === 'yes' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
                  <span>✓</span>
                  <span>{locale === 'tr' ? 'KA121 Akredite Kurum' : 'KA121 Accredited School'}</span>
                </span>
              ) : accredited === 'no' ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-800 border border-blue-300">
                  <span>📋</span>
                  <span>{locale === 'tr' ? 'KA122 Standart Başvuru Modu' : 'KA122 Short-Term Project Mode'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
                  <span>ℹ️</span>
                  <span>{locale === 'tr' ? 'Akreditasyon Belirlenmedi' : 'Accreditation Undefined'}</span>
                </span>
              )}

              {isSimulated && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  <span>👁️</span>
                  <span>{locale === 'tr' ? 'Simülasyon Modu' : 'Simulation Mode'}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
              {displayName}
            </h1>
            <p className="text-sm text-slate-600 m-0 leading-relaxed font-medium">
              {displayCity}, Türkiye • OID: <strong className="font-mono text-slate-900">{displayOid}</strong> • {locale === 'tr' ? 'Alan' : 'VET Field'}: <strong className="text-slate-900">{vetField || 'Mekatronik & Otomasyon'}</strong>
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              href="/onboarding"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>✏️</span>
              <span>{locale === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}</span>
            </Link>

            <Link
              href="/school/pipeline"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <span>🚀</span>
              <span>{locale === 'tr' ? '5 Adımlı Planlama Başlat' : 'Start 5-Step Pipeline'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Status Summary Badges (High Contrast, Bold Typography) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatHighlightBadge
          value={accredited === 'yes' ? 'KA121' : 'KA122'}
          label={locale === 'tr' ? 'Proje Formatı & Hibe Yolu' : 'Project Format & Path'}
          sublabel={
            accredited === 'yes'
              ? (locale === 'tr' ? 'Akredite yıllık bütçe tahsis yolu' : 'Annual grant allocation path')
              : (locale === 'tr' ? 'Standart teklif çağrısı ve rekabetçi hibe' : 'Competitive standard selection')
          }
          accent="blue"
          icon="🏛️"
          badgeText={`OID: ${displayOid}`}
          linkHref="/school/pipeline"
          linkLabel={locale === 'tr' ? 'Format Detayı' : 'Details'}
        />

        <StatHighlightBadge
          value={`${participantCount || 4}`}
          label={locale === 'tr' ? 'Katılımcı Havuzu' : 'Participant Pool'}
          sublabel={
            participantType === 'staff'
              ? (locale === 'tr' ? 'VET Eğiticileri / Personel' : 'VET Staff / Teachers')
              : (locale === 'tr' ? 'Mesleki Eğitim Öğrencileri (16-18 Yaş)' : 'VET Learners (Age 16-18)')
          }
          accent="purple"
          icon="👥"
          badgeText={mobilityGoal === 'JOB_SHADOWING' ? (locale === 'tr' ? 'İşbaşı İzleme' : 'Job Shadowing') : (locale === 'tr' ? 'Beceri Stajı' : 'Internship')}
          linkHref="/school/pipeline"
          linkLabel={locale === 'tr' ? 'Havuz' : 'Pool'}
        />

        <StatHighlightBadge
          value={`${inquiries.length}`}
          label={locale === 'tr' ? 'Host & Ortaklık Durumu' : 'Host Inquiries'}
          sublabel={
            acceptedInquiries.length > 0
              ? `${acceptedInquiries.length} ${locale === 'tr' ? 'kabul' : 'accepted'}, ${pendingInquiries.length} ${locale === 'tr' ? 'bekliyor' : 'pending'}`
              : (locale === 'tr' ? 'Henüz onaylanan ortaklık yok' : 'No confirmed partners yet')
          }
          accent="emerald"
          icon="🏢"
          badgeText={acceptedInquiries.length > 0 ? (locale === 'tr' ? 'Kabul Alındı' : 'Accepted') : (locale === 'tr' ? 'Eşleşme Bekliyor' : 'Pending')}
          linkHref="/school/pipeline"
          linkLabel={locale === 'tr' ? 'Talepleri Yönet' : 'Manage'}
        />

        <StatHighlightBadge
          value={competenceScore !== null && competenceScore !== undefined ? `${competenceScore} / 100` : '82 / 100'}
          label={locale === 'tr' ? 'Yetkinlik & Karar Skoru' : 'Competence & Readiness'}
          sublabel={`${locale === 'tr' ? 'Hedef Skor' : 'Target'}: ${targetScore || 85} • ISCED: ${iscedCode || '0714'}`}
          accent="amber"
          icon="📊"
          badgeText={locale === 'tr' ? 'AB Kalite Kriteri' : 'EU Quality Met'}
          linkHref="/school/pipeline"
          linkLabel={locale === 'tr' ? 'Analiz Raporu' : 'Report'}
        />
      </div>

      {/* 3. Quick Action Hub (4 Institutional Gateways) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 tracking-tight m-0">
            {locale === 'tr' ? 'Hızlı Aksiyonlar ve İş Akışları' : 'Quick Actions & Workflows'}
          </h2>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {locale === 'tr' ? 'Temel Erasmus+ hareketlilik operasyonları' : 'Core Erasmus+ mobility operations'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Action 1: Pipeline */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 font-black flex items-center justify-center text-lg">
                🎯
              </div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">
                {locale === 'tr' ? 'Hareketlilik Planlama' : 'Mobility Planning'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? '5 adımlı karar pipeline’ı ile okul profili, yetkinlik analizi, host eşleştirme ve hibe raporunu oluşturun.'
                  : 'Complete school profile, competence analysis, host matching and grant report via 5-step pipeline.'}
              </p>
            </div>
            <Link
              href="/school/pipeline"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs transition-colors shadow-2xs"
            >
              <span>{locale === 'tr' ? 'Pipeline’a Git' : 'Open Pipeline'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Action 2: Host Finding */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-lg">
                🏢
              </div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">
                {locale === 'tr' ? 'Host & Ortak Arama' : 'Host & Partner Search'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Almanya, İspanya, İtalya ve AB genelinde onaylı staj ve işbaşı ev sahiplerini inceleyin, talep gönderin.'
                  : 'Explore verified hosts across Germany, Spain, Italy and send direct mobility requests.'}
              </p>
            </div>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-colors shadow-2xs"
            >
              <span>{locale === 'tr' ? 'Pazaryeri & Hostlar' : 'Marketplace'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Action 3: Form Guide */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-indigo-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 font-black flex items-center justify-center text-lg">
                📝
              </div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">
                {locale === 'tr' ? 'Başvuru Taslağı Modülü' : 'Application Draft'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'KA121 akredite bütçe talebi ve KA122 kısa dönemli proje resmi başvuru alanları için taslak soru seti.'
                  : 'Guidance and automated assistance for KA121 and KA122 official Erasmus+ web application fields.'}
              </p>
            </div>
            <Link
              href="/school/application-draft"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs transition-colors shadow-2xs"
            >
              <span>{locale === 'tr' ? 'Taslak Formu Aç' : 'Open Draft Form'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Action 4: Organization Setup */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-slate-500 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 font-black flex items-center justify-center text-lg">
                ⚙️
              </div>
              <h3 className="text-base font-extrabold text-slate-900 m-0">
                {locale === 'tr' ? 'Kurumsal Profil & OID' : 'Org Profile & OID'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Kurum OID numarası, temas kişisi, kurum türü ve Erasmus Planı stratejik hedeflerinizi yönetin.'
                  : 'Manage organization OID, contact person, institution type, and strategic Erasmus Plan goals.'}
              </p>
            </div>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-2xs"
            >
              <span>{locale === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Mobility Inquiries Tracker Summary */}
      <RoleThemedCard
        theme="SCHOOL"
        variant="subtle-accent"
        title={locale === 'tr' ? 'Son Hareketlilik Talepleri & Ortaklıklar' : 'Recent Mobility Inquiries & Partnerships'}
        subtitle={
          locale === 'tr'
            ? 'Avrupa’daki işletmelere gönderilen staj ve işbaşı izleme taleplerinizin güncel yanıt durumları.'
            : 'Status of internship and job-shadowing inquiries sent to European host organizations.'
        }
        icon="📋"
        headerAction={
          <Link
            href="/school/pipeline"
            className="text-xs font-extrabold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1"
          >
            <span>{locale === 'tr' ? 'Tüm Eşleşmeleri İncele' : 'View All Matches'}</span>
            <span>→</span>
          </Link>
        }
      >
        {inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-600 uppercase tracking-wider text-xs font-bold bg-slate-50/60">
                  <th className="py-3 px-3">{locale === 'tr' ? 'Host Kuruluş' : 'Host Organization'}</th>
                  <th className="py-3 px-3">{locale === 'tr' ? 'Ülke / Şehir' : 'Country / City'}</th>
                  <th className="py-3 px-3">{locale === 'tr' ? 'Alan' : 'VET Field'}</th>
                  <th className="py-3 px-3">{locale === 'tr' ? 'Katılımcı' : 'Participants'}</th>
                  <th className="py-3 px-3">{locale === 'tr' ? 'Durum' : 'Status'}</th>
                  <th className="py-3 px-3 text-right">{locale === 'tr' ? 'İşlem' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {inq.hostName}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {inq.hostCountry}
                    </td>
                    <td className="py-3 px-3 font-medium">
                      {inq.vetField}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">
                      {inq.participantCount} {locale === 'tr' ? 'kişi' : 'persons'} ({inq.durationDays} {locale === 'tr' ? 'gün' : 'days'})
                    </td>
                    <td className="py-3 px-3">
                      {inq.status === 'ACCEPTED' ? (
                        <StatusAccentBadge status="APPROVED" label={t.inquiry.statusAccepted} />
                      ) : inq.status === 'DECLINED' ? (
                        <StatusAccentBadge status="REJECTED" label={t.inquiry.statusDeclined} />
                      ) : inq.status === 'REVISED' ? (
                        <StatusAccentBadge status="DRAFT" label={t.inquiry.statusRevised} />
                      ) : (
                        <StatusAccentBadge status="PENDING" label={t.inquiry.statusPending} />
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/school/pipeline"
                        className="text-blue-700 hover:text-blue-900 font-bold text-xs"
                      >
                        {locale === 'tr' ? 'Detay' : 'Details'} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200/80 space-y-3">
            <div className="text-3xl">📋</div>
            <div className="text-base font-extrabold text-slate-800">
              {locale === 'tr' ? 'Henüz gönderilmiş bir hareketlilik talebi bulunmuyor.' : 'No mobility inquiries sent yet.'}
            </div>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {locale === 'tr'
                ? '5 adımlı planlama pipeline’ında yer alan Host Eşleştirme adımını kullanarak Avrupa’daki uygun işletmelere staj talebi gönderebilirsiniz.'
                : 'Use the Host Matching step in the 5-step pipeline to send mobility inquiries to suitable European partners.'}
            </p>
            <Link
              href="/school/pipeline"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold rounded-xl transition-colors shadow-xs"
            >
              <span>🚀</span>
              <span>{locale === 'tr' ? 'İlk Eşleşmeyi Başlat' : 'Start First Matching'}</span>
            </Link>
          </div>
        )}
      </RoleThemedCard>

      {/* 5. Institutional KPI Monitor */}
      <SystemKpiCard />
    </div>
  );
}
