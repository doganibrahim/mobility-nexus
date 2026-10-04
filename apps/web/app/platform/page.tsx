'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal from '../../components/ui/LegalModal';
import MatchingCriteriaExplainer from '../../components/platform/MatchingCriteriaExplainer';
import DistinctSectionPurposeCard from '../../components/ui/DistinctSectionPurposeCard';
import { useTranslation } from '../../lib/i18n';

export default function PlatformPage() {
  const { t, locale } = useTranslation();
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-150">
      {/* 1. Official Erasmus+ Header */}
      <AppHeader />

      {/* 2. Institutional Breadcrumb */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>{locale === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              {locale === 'tr' ? 'Platform Modülleri & EMaaS Mimarisi' : 'Platform Modules & EMaaS Architecture'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>EMaaS v1.0</span>
            <span>•</span>
            <span>{locale === 'tr' ? 'Hizmet Olarak Erasmus Hareketliliği (EMaaS)' : 'Erasmus Mobility as a Service'}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Canvas */}
      <main id="main-content" tabIndex={-1} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-12 focus:outline-hidden">
        {/* Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-xs space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>⚡</span>
              <span>{locale === 'tr' ? 'EMaaS Platform Mimarisi' : 'EMaaS Platform Architecture'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
              <span>⚖️</span>
              <span>{locale === 'tr' ? 'Bağımsız Planlama & Destek Platformu' : 'Independent Planning & Support Platform'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span>✓</span>
              <span>{locale === 'tr' ? 'Uçtan Uca Dijital İş Akışı' : 'End-to-End Digital Workflow'}</span>
            </span>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight m-0">
              {locale === 'tr'
                ? 'Mesleki Eğitim İçin Bütünleşik Karar, Eşleştirme ve Raporlama Platformu'
                : 'Integrated Decision, Matching and Reporting Platform for Vocational Education'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0">
              {locale === 'tr'
                ? 'ErasmusMobility; Türkiye\'den Avrupa\'ya hareketlilik planlayan okul yöneticileri, proje ekipleri ve doğrulanmış Avrupa işletmelerini tek bir dijital platformda buluşturan bağımsız bir karar, eşleştirme ve dosya hazırlık desteğidir. Resmi başvuru form rehberleri, 5 adımlı hareketlilik planlama süreç akışı ve hibe hesabı ile kurumların resmi Erasmus+ süreçlerine en yüksek hazırlık kalitesiyle başvurmasını sağlar.'
                : 'ErasmusMobility is an independent decision, host matching, and document preparation support platform connecting vocational schools planning Türkiye-to-Europe mobility with verified European hosts. Our guided workflows empower institutions to prepare for official Erasmus+ applications with maximum compliance and confidence.'}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/school/pipeline"
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>{locale === 'tr' ? '5 Adımlı Süreç Akışını Başlat' : 'Start 5-Step Pipeline'}</span>
              <span>→</span>
            </Link>

            <Link
              href="/onboarding"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-colors"
            >
              <span>🏛️</span>
              <span>{locale === 'tr' ? 'Kurumsal Kayıt & OID Kurulumu' : 'Institutional Setup & OID'}</span>
            </Link>

            <a
              href="#matching-criteria"
              className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <span>⚖️</span>
              <span>{locale === 'tr' ? 'Nasıl Eşleşir? 7 Kriter Kılavuzu' : 'How It Matches: 7 Criteria'}</span>
            </a>
          </div>
        </section>

        {/* Distinct Section Purpose & Top 3 Resources Card */}
        <DistinctSectionPurposeCard
          sectionKey="platform"
          tag={locale === 'tr' ? 'EMaaS Operasyon Merkezi' : 'EMaaS Operations Hub'}
          tagColor="bg-blue-50 text-blue-900 border-blue-200"
          title={
            locale === 'tr'
              ? 'Platform Bölümünün Rolü ve En Çok Aranan Kaynaklar'
              : 'Platform Section Role & Top Searched Resources'
          }
          purposeSentence={
            locale === 'tr'
              ? 'Uçtan uca dijital hareketlilik planlama, akıllı ev sahibi eşleştirmesi, başvuru taslağı ve resmi evrak ihracı operasyon merkezidir.'
              : 'Operations hub for end-to-end digital mobility planning, smart host matching, application drafting and official dossier generation.'
          }
          topResourcesTitle={
            locale === 'tr'
              ? 'Platformda En Çok Aranan 3 Kaynak ve Hızlı Erişim'
              : 'Top 3 Most Searched Resources & Direct Access'
          }
          resources={[
            {
              icon: '🚀',
              title: locale === 'tr' ? '5 Adımlı Hareketlilik Planı' : '5-Step Mobility Pipeline',
              description:
                locale === 'tr'
                  ? 'Okul profili, ESCO yetkinlik seçimi, akıllı filtreleme ve hibe fizibilitesi kararı.'
                  : 'Institutional profile, ESCO competencies, smart filtering and grant calculation.',
              href: '/school/pipeline',
              badge: locale === 'tr' ? 'Süreç Akışı' : 'Pipeline',
            },
            {
              icon: '🎓',
              title: locale === 'tr' ? 'Eğitim & Fırsat Pazar Yeri' : 'Training & Opportunity Marketplace',
              description:
                locale === 'tr'
                  ? 'Doğrulanmış kurslar, işbaşı gözlem ilanları ve doğrudan teklif/kontenjan talebi.'
                  : 'Verified European courses, job shadowing slots and direct offer inquiries.',
              href: '/marketplace',
              badge: locale === 'tr' ? 'Pazaryeri' : 'Marketplace',
            },
            {
              icon: '📋',
              title: locale === 'tr' ? 'KA121 & KA122 Başvuru Taslağı' : 'KA121 / KA122 Application Draft',
              description:
                locale === 'tr'
                  ? 'Resmi web form soru setleri, KA120 PDF aktarımı ve bütçe taslak hazırlığı.'
                  : 'Official web form questionnaires, KA120 PDF ingestion and draft preparation.',
              href: '/school/application-draft',
              badge: locale === 'tr' ? 'Taslak' : 'Draft',
            },
          ]}
          footerNotice={
            locale === 'tr'
              ? 'Platform modülleri hem bağımsız hem de tek bir akışta entegre biçimde çalışabilir.'
              : 'Platform modules can be utilized independently or cohesively across the mobility lifecycle.'
          }
        />

        {/* 6 Core Modules Grid */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 m-0">
              {locale === 'tr' ? 'Temel Platform Modülleri ve İşlevleri' : 'Core Platform Modules & Capabilities'}
            </h2>
            <p className="text-xs text-slate-500 m-0">
              {locale === 'tr'
                ? 'Her adımda bağımsız veya bütünleşik çalışan modüler altyapı'
                : 'Modular infrastructure functioning independently or in a unified pipeline'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Module 1 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-2xl">
                  🎯
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                  {locale === 'tr' ? 'Aşama 1-5' : 'Stages 1-5'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {locale === 'tr' ? '5 Adımlı Planlama Süreç Akışı' : '5-Step Planning Pipeline'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr'
                    ? 'Kurum profili, katılımcı analizi, ESCO taksonomisi, 10 kriterli ev sahibi kuruluş eşleştirmesi ve hibe tavsiye raporunu tek bir akışta tamamlayın.'
                    : 'Complete institutional profile, participant needs, ESCO taxonomy mapping, 10-parameter host scoring, and grant advisory dossiers in one seamless flow.'}
                </p>
              </div>
              <Link
                href="/school/pipeline"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs transition-colors"
              >
                <span>{locale === 'tr' ? 'Süreç Akışına Git' : 'Open Pipeline'}</span>
                <span>→</span>
              </Link>
            </div>

            {/* Module 2 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-2xl">
                  🏛️
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                  {locale === 'tr' ? 'Okul Portalı' : 'School Portal'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Okul Gösterge Paneli' : 'School Dashboard'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr'
                    ? 'OID verileriniz, gönderilen staj taleplerinin durumu, kabul mektupları (LoI) ve kurum akreditasyon durumunu tek ekrandan yönetin.'
                    : 'Manage organization OID, live tracking of sent mobility inquiries, Letters of Intent (LoI), and accreditation format at a glance.'}
                </p>
              </div>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition-colors"
              >
                <span>{locale === 'tr' ? 'Panele Git' : 'Open Dashboard'}</span>
                <span>→</span>
              </Link>
            </div>

            {/* Module 3 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-2xl">
                  🏢
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-900">
                  {locale === 'tr' ? 'Ev Sahibi Portföyü' : 'Host Portfolio'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Avrupa Ev Sahibi Kuruluş Portalı' : 'European Host Portal'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr'
                    ? 'Avrupa\'daki işletmelerin stajyer kontenjanları, lojistik imkanları ve gelen hareketlilik taleplerini onaylayıp yanıtladığı kurumsal alan.'
                    : 'Enterprise space where verified European hosts publish trainee capacities, offer mentoring, and confirm student mobility requests.'}
                </p>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold text-xs transition-colors"
              >
                <span>{locale === 'tr' ? 'Ev Sahibi Kuruluş Kaydı Yap' : 'Register Host'}</span>
                <span>→</span>
              </Link>
            </div>

            {/* Module 4 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-amber-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-2xl">
                  ⚖️
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                  {locale === 'tr' ? 'Hibe Yolu' : 'Grant Path'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {locale === 'tr' ? '8 Faktörlü Karar Motoru' : '8-Factor Decision Engine'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr'
                    ? 'Kurumun yıllık bütçe tahsisatı (KA121) mı yoksa ilk kez başvuru için kısa dönemli proje (KA122) mi seçmesi gerektiğini rasyonel analiz eder.'
                    : 'Analyzes past grant records and strategy to determine whether the school should apply via KA121 annual allocation or KA122 competitive call.'}
                </p>
              </div>
              <Link
                href="/school/pipeline"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-xs transition-colors"
              >
                <span>{locale === 'tr' ? 'Karar Motorunu Dene' : 'Test Decision Engine'}</span>
                <span>→</span>
              </Link>
            </div>

            {/* Module 5 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-slate-400 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-2xl">
                  📚
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-800">
                  {locale === 'tr' ? 'Form Rehberi' : 'Form Guide'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Resmi Başvuru Form Rehberleri' : 'Official Application Guides'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr'
                    ? 'Avrupa Komisyonu web başvuru formlarında (KA121 & KA122) yer alan alanları doldurmak için yapay zeka destekli rehberlik ve kontrol aracı.'
                    : 'Guided assistance and schema verification for official European Commission web application form sections (KA121 & KA122).'}
                </p>
              </div>
              <Link
                href="/library"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                <span>{locale === 'tr' ? 'Kütüphaneyi Aç' : 'Open Library'}</span>
                <span>→</span>
              </Link>
            </div>

            {/* Module 6 */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-rose-300 hover:shadow-md transition-all">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 font-bold flex items-center justify-center text-2xl">
                  🛡️
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
                  {locale === 'tr' ? 'Güvenilirlik' : 'Trust Audit'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {locale === 'tr' ? '15 Kriterli Kurumsal KYC' : '15-Point Institutional KYC'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr'
                    ? 'Şirket sicili, vergi numarası, OHS iş güvenliği ve 7/24 acil durum kontağı ile Doğrulanmış Ortak (Verified Partner) rozeti denetimi.'
                    : 'Rigorous vetting of company registration, tax status, emergency contacts, and trainee safeguards to grant Verified Partner badges.'}
                </p>
              </div>
              <Link
                href="/onboarding"
                className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-800 font-bold text-xs transition-colors"
              >
                <span>{locale === 'tr' ? 'Doğrulamayı İncele' : 'Review Audit'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 7 Core Matching Criteria & Mismatch Diagnostics (PKG-IMP-03) */}
        <section id="matching-criteria" className="space-y-4">
          <MatchingCriteriaExplainer />
        </section>

        {/* Role Comparison Table (Flat, High Contrast) */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 m-0">
              {locale === 'tr' ? 'Kullanıcı Rolleri ve Erişim Matrisi' : 'User Roles & Access Matrix'}
            </h2>
            <p className="text-xs text-slate-500 m-0">
              {locale === 'tr'
                ? 'Okul, ev sahibi işletme ve platform yöneticisi yetki sınırları'
                : 'Functional access boundaries for sending schools, host enterprises and platform admins'}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-200 text-slate-600 uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">{locale === 'tr' ? 'İşlev / Özellik' : 'Functionality / Feature'}</th>
                  <th className="py-3 px-4 text-center">{locale === 'tr' ? 'Okul / Gönderen Kurum' : 'Sending School'}</th>
                  <th className="py-3 px-4 text-center">{locale === 'tr' ? 'Ev Sahibi Kuruluş' : 'Host Enterprise'}</th>
                  <th className="py-3 px-4 text-center">{locale === 'tr' ? 'Platform Yöneticisi' : 'Platform Admin'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {locale === 'tr' ? '5 Adımlı Hareketlilik Süreç Akışı' : '5-Step Mobility Planning Pipeline'}
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {locale === 'tr' ? 'Avrupa Ev Sahibi Kuruluş Arama & Doğrudan Talep Gönderme' : 'European Host Search and Direct Request Submission'}
                  </td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {locale === 'tr' ? 'Staj Kontenjanı & Niyet Mektubu (LoI) Yönetimi' : 'Internship Capacity and Letter of Intent Management'}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {locale === 'tr' ? '15 Kriterli Kurumsal KYC Evrak Yükleme' : '15-Criterion Institutional KYC Document Upload'}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {locale === 'tr' ? 'Yönetici Doğrulama Havuzu & Onay Paneli' : 'Administrator Verification Pool and Approval Panel'}
                  </td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-slate-300">-</td>
                  <td className="py-3 px-4 text-center text-emerald-700 font-bold text-base">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* 4. Institutional Footer */}
      <AppFooter />

      {/* 5. Cookie Consent & Modals */}
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />
    </div>
  );
}
