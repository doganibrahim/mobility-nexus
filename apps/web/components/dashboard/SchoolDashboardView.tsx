'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';
import { useAppStore } from '../../lib/store';
import SystemKpiCard from '../gateway/SystemKpiCard';

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
      {/* 1. School Institutional Welcome Header (Flat, Zero Gradient) */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                <span>🏛️</span>
                <span>{locale === 'tr' ? 'Okul / Gönderen Kurum Portalı' : 'School / Sending Org Portal'}</span>
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
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-300">
                  <span>👁️</span>
                  <span>{locale === 'tr' ? 'Simülasyon Modu' : 'Simulation Mode'}</span>
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight m-0">
              {displayName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 m-0 leading-relaxed">
              {displayCity}, Türkiye • OID: <strong className="font-mono text-slate-900">{displayOid}</strong> • {locale === 'tr' ? 'Alan' : 'VET Field'}: <strong className="text-slate-900">{vetField || 'Mekatronik & Otomasyon'}</strong>
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <Link
              href="/onboarding"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center gap-1.5"
            >
              <span>✏️</span>
              <span>{locale === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}</span>
            </Link>

            <Link
              href="/school/pipeline"
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              <span>🚀</span>
              <span>{locale === 'tr' ? '5 Adımlı Planlama Başlat' : 'Start 5-Step Pipeline'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Key Status Summary Cards (Flat, High Contrast) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Project Format */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {locale === 'tr' ? 'Proje Formatı & Hibe Yolu' : 'Project Format & Path'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              {accredited === 'yes' ? 'KA121 Akredite' : 'KA122 Kısa Dönem'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {accredited === 'yes'
                ? (locale === 'tr' ? 'Yıllık bütçe talebi ile doğrudan hibe' : 'Annual grant allocation path')
                : (locale === 'tr' ? 'Standart başvuru ve puanlama değerlendirmesi' : 'Competitive standard selection')}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-semibold text-blue-700">
            OID: {displayOid}
          </div>
        </div>

        {/* Card 2: Participants */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {locale === 'tr' ? 'Katılımcı Havuzu' : 'Participant Pool'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              {participantCount || 4} {locale === 'tr' ? 'Katılımcı' : 'Participants'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {participantType === 'staff'
                ? (locale === 'tr' ? 'VET Eğiticileri / Personel' : 'VET Staff / Teachers')
                : (locale === 'tr' ? 'Mesleki Eğitim Öğrencileri' : 'VET Learners')} • {mobilityGoal === 'JOB_SHADOWING' ? (locale === 'tr' ? 'İşbaşı İzleme' : 'Job Shadowing') : (locale === 'tr' ? 'Staj & Beceri Eğitimi' : 'Internship & VET Skills')}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-semibold text-slate-600">
            {locale === 'tr' ? 'Yaş Grubu: 16-18 Karma' : 'Age Group: 16-18 Mixed'}
          </div>
        </div>

        {/* Card 3: Host Inquiries */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {locale === 'tr' ? 'Host & Ortaklık Durumu' : 'Host & Inquiries'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              {inquiries.length} {locale === 'tr' ? 'Talep Gönderildi' : 'Inquiries Sent'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              <span className="text-emerald-700 font-bold">{acceptedInquiries.length} {locale === 'tr' ? 'Kabul Edildi' : 'Accepted'}</span> •{' '}
              <span className="text-amber-700 font-bold">{pendingInquiries.length} {locale === 'tr' ? 'Bekliyor' : 'Pending'}</span>
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100">
            <Link
              href="/school/pipeline"
              className="text-[11px] font-bold text-blue-700 hover:text-blue-900"
            >
              {locale === 'tr' ? 'Talepleri Yönet →' : 'Manage Inquiries →'}
            </Link>
          </div>
        </div>

        {/* Card 4: Readiness & Competence */}
        <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {locale === 'tr' ? 'Yetkinlik & Karar Skoru' : 'Competence & Readiness'}
            </div>
            <div className="text-lg font-extrabold text-slate-900 mt-1">
              {competenceScore !== null && competenceScore !== undefined ? `${competenceScore} / 100` : (locale === 'tr' ? '82 / 100 [Demo]' : '82 / 100 [Demo]')}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {locale === 'tr' ? 'Hedef Skor' : 'Target Score'}: {targetScore || 85} • {locale === 'tr' ? 'ISCED Kodu' : 'ISCED Code'}: {iscedCode || '0714'}
            </p>
          </div>
          <div className="pt-3 mt-3 border-t border-slate-100 text-[11px] font-semibold text-emerald-700">
            {locale === 'tr' ? '✓ AB Kalite Kriterlerine Uyumlu' : '✓ EU Quality Aligned'}
          </div>
        </div>
      </div>

      {/* 3. Quick Action Hub (4 Institutional Gateways) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 m-0">
          {locale === 'tr' ? 'Hızlı Aksiyonlar ve İş Akışları' : 'Quick Actions & Workflows'}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Action 1: Pipeline */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-lg">
                🎯
              </div>
              <h3 className="text-sm font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'Hareketlilik Planlama' : 'Mobility Planning'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? '5 adımlı karar pipeline\'ı ile okul profili, yetkinlik analizi, host eşleştirme ve hibe raporunu oluşturun.'
                  : 'Complete school profile, competence analysis, host matching and grant report via 5-step pipeline.'}
              </p>
            </div>
            <Link
              href="/school/pipeline"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors"
            >
              <span>{locale === 'tr' ? 'Pipeline\'a Git' : 'Open Pipeline'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Action 2: Host Finding */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-lg">
                🏢
              </div>
              <h3 className="text-sm font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'Host & Ortak Arama' : 'Host & Partner Search'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Almanya, İspanya, İtalya ve AB genelinde onaylı staj ve işbaşı ev sahiplerini inceleyin, talep gönderin.'
                  : 'Explore verified hosts across Germany, Spain, Italy and send direct mobility requests.'}
              </p>
            </div>
            <Link
              href="/school/pipeline"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors"
            >
              <span>{locale === 'tr' ? 'Hostları Eşleştir' : 'Match Hosts'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Action 3: Form Guide */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-lg">
                📝
              </div>
              <h3 className="text-sm font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'Resmi Başvuru Form Rehberi' : 'Application Form Guide'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'KA121 akredite bütçe talebi ve KA122 kısa dönemli proje resmi başvuru alanları için rehber desteği.'
                  : 'Guidance and automated assistance for KA121 and KA122 official Erasmus+ web application fields.'}
              </p>
            </div>
            <Link
              href="/school/pipeline"
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs transition-colors"
            >
              <span>{locale === 'tr' ? 'Form Raporunu Gör' : 'View Report'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* Action 4: Organization Setup */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-lg">
                ⚙️
              </div>
              <h3 className="text-sm font-bold text-slate-900 m-0">
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
              className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
            >
              <span>{locale === 'tr' ? 'Profili Düzenle' : 'Edit Profile'}</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Mobility Inquiries Tracker Summary */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900 m-0">
              {locale === 'tr' ? 'Son Hareketlilik Talepleri & Ortaklıklar' : 'Recent Mobility Inquiries & Partnerships'}
            </h2>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {locale === 'tr'
                ? 'Avrupa\'daki işletmelere gönderilen staj ve işbaşı izleme taleplerinizin güncel yanıt durumları.'
                : 'Status of internship and job-shadowing inquiries sent to European host organizations.'}
            </p>
          </div>

          <Link
            href="/school/pipeline"
            className="text-xs font-bold text-blue-700 hover:text-blue-900 inline-flex items-center gap-1 self-start sm:self-auto"
          >
            <span>{locale === 'tr' ? 'Tüm Eşleşmeleri İncele' : 'View All Matches'}</span>
            <span>→</span>
          </Link>
        </div>

        {inquiries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-3">{locale === 'tr' ? 'Host Kuruluş' : 'Host Organization'}</th>
                  <th className="py-2.5 px-3">{locale === 'tr' ? 'Ülke / Şehir' : 'Country / City'}</th>
                  <th className="py-2.5 px-3">{locale === 'tr' ? 'Alan' : 'VET Field'}</th>
                  <th className="py-2.5 px-3">{locale === 'tr' ? 'Katılımcı' : 'Participants'}</th>
                  <th className="py-2.5 px-3">{locale === 'tr' ? 'Durum' : 'Status'}</th>
                  <th className="py-2.5 px-3 text-right">{locale === 'tr' ? 'İşlem' : 'Action'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {inq.hostName}
                    </td>
                    <td className="py-3 px-3">
                      {inq.hostCountry}
                    </td>
                    <td className="py-3 px-3">
                      {inq.vetField}
                    </td>
                    <td className="py-3 px-3 font-mono">
                      {inq.participantCount} {locale === 'tr' ? 'kişi' : 'persons'} ({inq.durationDays} {locale === 'tr' ? 'gün' : 'days'})
                    </td>
                    <td className="py-3 px-3">
                      {inq.status === 'ACCEPTED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <span>✓</span>
                          <span>{locale === 'tr' ? 'Ön Kabul Onaylandı' : 'LoI Accepted'}</span>
                        </span>
                      ) : inq.status === 'DECLINED' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                          <span>✕</span>
                          <span>{locale === 'tr' ? 'Kapasite Yetersiz' : 'Declined'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          <span>⏳</span>
                          <span>{locale === 'tr' ? 'Yanıt Bekleniyor' : 'Pending Reply'}</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/school/pipeline"
                        className="text-blue-700 hover:text-blue-900 font-bold text-[11px]"
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
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
            <div className="text-3xl">📋</div>
            <div className="text-sm font-bold text-slate-800">
              {locale === 'tr' ? 'Henüz gönderilmiş bir hareketlilik talebi bulunmuyor.' : 'No mobility inquiries sent yet.'}
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {locale === 'tr'
                ? '5 adımlı planlama pipeline\'ında yer alan Host Eşleştirme adımını kullanarak Avrupa\'daki uygun işletmelere staj talebi gönderebilirsiniz.'
                : 'Use the Host Matching step in the 5-step pipeline to send mobility inquiries to suitable European partners.'}
            </p>
            <Link
              href="/school/pipeline"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
            >
              <span>🚀</span>
              <span>{locale === 'tr' ? 'İlk Eşleşmeyi Başlat' : 'Start First Matching'}</span>
            </Link>
          </div>
        )}
      </div>

      {/* 5. Institutional KPI Monitor */}
      <SystemKpiCard />
    </div>
  );
}
