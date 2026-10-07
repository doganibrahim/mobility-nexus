'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal, { LegalTabType } from '../../components/ui/LegalModal';
import ErasmusResultsWidget from '../../components/ui/ErasmusResultsWidget';
import MebSchoolsWidget from '../../components/ui/MebSchoolsWidget';
import { useTranslation } from '../../lib/i18n';
import DistinctSectionPurposeCard from '../../components/ui/DistinctSectionPurposeCard';
import KnowledgeLibrarySection from '../../components/library/KnowledgeLibrarySection';
import { FileText, Tag, ExternalLink } from 'lucide-react';

type LibraryTab = 'RESOURCES' | 'FORMS' | 'DATA' | 'LEGAL';

export default function LibraryPage() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<LibraryTab>('RESOURCES');
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType>('LEGAL');
  const [isHibeWidgetOpen, setIsHibeWidgetOpen] = useState(false);
  const [isMebWidgetOpen, setIsMebWidgetOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#knowledge-library') {
      setActiveTab('RESOURCES');
    }
  }, []);

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
              {locale === 'tr' ? 'Kütüphane & Resmi Başvuru Kaynakları' : 'Library & Official Guides'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>KA121 • KA122 • ESCO</span>
            <span>•</span>
            <span>2026-2027</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Canvas */}
      <main id="main-content" tabIndex={-1} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-8 focus:outline-hidden">
        {/* Header Hero */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>📚</span>
              <span>{locale === 'tr' ? 'Erasmus+ Dokümantasyon Merkezi' : 'Erasmus+ Documentation Center'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span>✓</span>
              <span>{locale === 'tr' ? 'Resmi Şablonlar & Rehberler' : 'Official Templates & Guides'}</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
              {locale === 'tr'
                ? 'Resmi Başvuru Form Rehberleri ve Açık Veri Kütüphanesi'
                : 'Official Application Form Guides & Open Data Library'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
              {locale === 'tr'
                ? 'Avrupa Komisyonu KA121 akredite bütçe talebi ve KA122 kısa dönemli hareketlilik web formları alan açıklamaları, resmi hibe dağılım istatistikleri ve MEB mesleki eğitim kurum katalogları.'
                : 'Section-by-section guidelines for European Commission KA121 and KA122 web forms, official grant distribution analytics, and national VET catalogs.'}
            </p>
          </div>

          {/* Library Tab Filter */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveTab('RESOURCES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'RESOURCES'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>🏛️</span>
              <span>{locale === 'tr' ? 'Bilgi Kütüphanesi & Kaynaklar' : 'Knowledge Library & Resources'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${activeTab === 'RESOURCES' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>34</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('FORMS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'FORMS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>📝</span>
              <span>{locale === 'tr' ? 'KA121 / KA122 Form Rehberleri' : 'KA121 / KA122 Guides'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('DATA')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'DATA'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>📊</span>
              <span>{locale === 'tr' ? 'Açık Veri & Hibe Kataloğu' : 'Open Data & Grants'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LEGAL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'LEGAL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>⚖️</span>
              <span>{locale === 'tr' ? 'Hukuki Metinler & KVKK/GDPR' : 'Legal & Compliance'}</span>
            </button>
          </div>
        </section>

        {/* Distinct Section Purpose & Top 3 Resources Card */}
        <DistinctSectionPurposeCard
          sectionKey="library"
          tag={locale === 'tr' ? 'Erasmus+ Dokümantasyon & Açık Veri' : 'Erasmus+ Documentation & Open Data'}
          tagColor="bg-emerald-50 text-emerald-900 border-emerald-200"
          title={
            locale === 'tr'
              ? 'Kütüphane Bölümünün Rolü ve En Çok Aranan Kaynaklar'
              : 'Library Section Role & Top Searched Resources'
          }
          purposeSentence={
            locale === 'tr'
              ? 'Avrupa Komisyonu standartlarında resmi form şablonları, hibe analizleri, ESCO/EQAVET standartları ve açık veri deposudur.'
              : 'Official repository for European Commission compliant form templates, grant analytics, ESCO/EQAVET standards and open datasets.'
          }
          topResourcesTitle={
            locale === 'tr'
              ? 'Kütüphanede En Çok Aranan 3 Kaynak ve Hızlı Erişim'
              : 'Top 3 Most Searched Resources & Direct Access'
          }
          resources={[
            {
              icon: '🏛️',
              title: locale === 'tr' ? 'ErasmusMobility Bilgi Kütüphanesi' : 'ErasmusMobility Knowledge Library',
              description:
                locale === 'tr'
                  ? '34 doğrulanmış resmi kaynak: AB rehberleri, Europass, ESCO becerileri, EQAVET kalite döngüsü ve Türkiye sektörel kurumları.'
                  : '34 verified resources: EU guides, Europass tools, ESCO taxonomy, EQAVET quality cycle and national VET directories.',
              href: '#knowledge-library',
              badge: locale === 'tr' ? '34 Resmi Kaynak' : '34 Verified Sources',
              onClick: () => setActiveTab('RESOURCES'),
            },
            {
              icon: '📝',
              title: locale === 'tr' ? 'KA121 & KA122 Form Soru Rehberleri' : 'KA121 / KA122 Form Question Guides',
              description:
                locale === 'tr'
                  ? 'Web form soru alanları, resmi puanlama kriterleri ve saha rehberliği.'
                  : 'Web form question breakdowns, scoring criteria and field execution guidelines.',
              href: '#forms',
              badge: locale === 'tr' ? 'Form Rehberi' : 'Form Guide',
              onClick: () => setActiveTab('FORMS'),
            },
            {
              icon: '📊',
              title: locale === 'tr' ? 'Erasmus+ Hibe Tahsisat & Dağılım Analizi' : 'Erasmus+ Grant Allocation Analytics',
              description:
                locale === 'tr'
                  ? 'Ulusal Ajans resmi hibe sonuçları, okul bazlı bütçe payları ve emsal veriler.'
                  : 'Official National Agency grant allocation results and historical benchmarking.',
              href: '#data',
              badge: locale === 'tr' ? 'Hibe Verisi' : 'Grant Data',
              onClick: () => setIsHibeWidgetOpen(true),
            },
          ]}
          footerNotice={
            locale === 'tr'
              ? 'Tüm rehber ve şablonlar 2026-2027 Erasmus+ Program Rehberi kurallarına göre güncel tutulmaktadır.'
              : 'All guidelines and templates are continuously synchronized with 2026-2027 Erasmus+ Programme criteria.'
          }
        />

        {/* TAB 0: ErasmusMobility Knowledge Library (34 Official Resources) */}
        {activeTab === 'RESOURCES' && (
          <KnowledgeLibrarySection />
        )}

        {/* TAB 1: KA121 & KA122 Form Guides */}
        {activeTab === 'FORMS' && (
          <section className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KA121 Guide Card */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300">
                    KA121-VET
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {locale === 'tr' ? 'Akredite Kurumlar' : 'Accredited Schools'}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950 m-0">
                    {locale === 'tr' ? 'KA121 Yıllık Bütçe ve Hibe Tahsisat Form Rehberi' : 'KA121 Annual Grant Allocation Form Guide'}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed m-0">
                    {locale === 'tr'
                      ? 'Erasmus Akreditasyonu sahibi mesleki eğitim kurumlarının her çağrı yılında resmi form üzerinde doldurduğu bölümler ve bütçe hesaplama kuralları.'
                      : 'Detailed field-by-field guidelines for accredited VET institutions requesting annual mobility grants under Erasmus Plan objectives.'}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Kurum ve OID Doğrulaması:' : 'Organisation and OID Verification:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Tüzel kişilik ve akreditasyon kodu teyidi.'
                        : 'Legal entity and accreditation code confirmation.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Erasmus Planı Hedefleri:' : 'Erasmus Plan Objectives:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Kurumsal gelişim hedefleriyle eşleştirme.'
                        : 'Alignment with institutional development goals.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Faaliyetler & Katılımcılar:' : 'Activities and Participants:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Kısa/uzun dönem öğrenci stajı ve personel izleme.'
                        : 'Short/long-term student internships and staff job shadowing.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Bütçe Tahsisat Matrisi:' : 'Budget Allocation Matrix:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Seyahat, harcırah ve kurumsal destek birim maliyetleri.'
                        : 'Travel, subsistence, and organizational support unit costs.'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/school/pipeline"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>{locale === 'tr' ? 'KA121 Planlama Aracına Git' : 'Open KA121 Planner'}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>

              {/* KA122 Guide Card */}
              <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    KA122-VET
                  </span>
                  <span className="text-xs font-bold text-slate-500 font-mono">
                    {locale === 'tr' ? 'Kısa Dönemli Projeler' : 'Short-term Projects'}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg font-bold text-slate-950 m-0">
                    {locale === 'tr' ? 'KA122 Kısa Dönemli Proje Başvuru Form Rehberi' : 'KA122 Short-term Project Application Guide'}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1.5 leading-relaxed m-0">
                    {locale === 'tr'
                      ? 'Akredite olmayan veya ilk kez Erasmus+ projesi yapacak meslek liseleri için puanlama kriterleri, ihtiyaç analizi ve proje hedefleri doldurma rehberi.'
                      : 'Guidance for first-time applicant schools on drafting needs analysis, project objectives, participant profiles, and quality standards.'}
                  </p>
                </div>

                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">1.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Kurumsal İhtiyaç Analizi:' : 'Institutional Needs Assessment:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Gelişim alanları ve yerel sektör ihtiyaçları.'
                        : 'Growth areas and local industry demands.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">2.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Proje Hedefleri:' : 'Project Objectives:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'SMART ilkelerine uygun ölçülebilir hedefler.'
                        : 'Measurable targets compliant with SMART criteria.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">3.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Öğrenme Çıktıları:' : 'Learning Outcomes:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'ESCO becerileriyle uyumlu teknik ve yabancı dil kazanımı.'
                        : 'Technical and language acquisition aligned with ESCO skills.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">4.</span>
                    <span>
                      <strong>{locale === 'tr' ? 'Yaygınlaştırma ve Etki:' : 'Dissemination and Impact:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Proje sonuçlarının yerel ve bölgesel görünürlüğü.'
                        : 'Local and regional visibility of project results.'}
                    </span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/school/pipeline"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>{locale === 'tr' ? 'KA122 Uygunluk Analizini Başlat' : 'Open KA122 Eligibility Tool'}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Cross-link to Knowledge Library */}
            <div className="p-5 rounded-2xl bg-blue-50/80 border-2 border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏛️</span>
                <div className="space-y-0.5">
                  <h4 className="text-xs sm:text-sm font-bold text-blue-950 m-0">
                    {locale === 'tr' ? 'Resmi Erasmus+ ve ESCO/EQAVET Kütüphanesini İnceleyin' : 'Explore Official Erasmus+ & ESCO/EQAVET Library'}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-blue-800 m-0">
                    {locale === 'tr'
                      ? '34 doğrulanmış resmi kaynak: Ulusal Ajans duyuruları, Europass şablonları, CEDEFOP raporları ve MEB/MYK portalleri.'
                      : '34 verified official sources: National Agency calls, Europass templates, CEDEFOP reports, and national VET directories.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('RESOURCES')}
                className="shrink-0 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {locale === 'tr' ? 'Bilgi Kütüphanesini Aç' : 'Open Knowledge Library'} →
              </button>
            </div>
          </section>
        )}



        {/* TAB 3: Data Catalogs */}
        {(activeTab === 'DATA' || activeTab === 'FORMS') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'İnteraktif Açık Veri ve Katalog Araçları' : 'Interactive Open Data Catalogs'}
              </h2>
              <p className="text-xs text-slate-500 m-0">
                {locale === 'tr'
                  ? 'Türkiye geneli hibe sonuçları ve meslek liseleri veri tabanı'
                  : 'Nationwide grant allocation analytics and VET school databases'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Tool 1: Hibe Dağılımı */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-lg">
                    📊
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 m-0">
                    {locale === 'tr' ? '2026 Hibe Dağılımı ve Analizi' : '2026 Grant Allocations & Analytics'}
                  </h3>
                  <p className="text-xs text-slate-600 m-0 leading-relaxed">
                    {locale === 'tr'
                      ? 'Türkiye geneli akredite kurumların hibe bütçeleri, il bazlı dağılım, kabul ve yedek sıralamalarını interaktif filtreleyin.'
                      : 'Interactive catalog of accredited institution grant budgets, city distributions, and rankings across Turkey.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsHibeWidgetOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  {locale === 'tr' ? 'Hibe Sonuçları Kataloğunu Aç' : 'Launch Grant Analytics'} →
                </button>
              </div>

              {/* Tool 2: MEB Atlas */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg">
                    🏛️
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 m-0">
                    {locale === 'tr' ? 'MEB Açık Veri Referans Kataloğu' : 'MEB Open Data Reference Directory'}
                  </h3>
                  <p className="text-xs text-slate-600 m-0 leading-relaxed">
                    {locale === 'tr'
                      ? '81 ildeki 3.700+ Mesleki ve Teknik Anadolu Lisesi, Halk Eğitimi Merkezleri ve Olgunlaşma Enstitüleri açık veri rehberi.'
                      : 'Explore over 3,700 Vocational High Schools, Adult Education Centers, and Institutes across 81 provinces.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMebWidgetOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-2xs"
                >
                  {locale === 'tr' ? 'Okul Kataloğunu Aç' : 'Launch School Directory'} →
                </button>
              </div>
            </div>
          </section>
        )}

        {/* TAB 4: Legal & Compliance */}
        {(activeTab === 'LEGAL' || activeTab === 'FORMS') && (
          <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4 animate-fadeIn">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'Hukuki Belgeler, Veri Güvenliği ve Aydınlatma Metinleri' : 'Legal Policies & Compliance Documents'}
              </h2>
              <p className="text-xs text-slate-500 m-0">
                {locale === 'tr'
                  ? '6698 sayılı KVKK ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) ile Platform Katılım Koşulları ve Açık Rıza Metni'
                  : 'Compliance documentation for GDPR/KVKK and Platform Participation Terms & Explicit Consent Declaration'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('LEGAL');
                  setIsLegalModalOpen(true);
                }}
                className="p-5 rounded-xl bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 text-left space-y-2 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl">⚖️</div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-mono">
                    {locale === 'tr' ? '6698 SK' : 'EU 2016/679'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950 m-0">
                    {locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'GDPR Privacy Notice'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 m-0 leading-relaxed">
                    {locale === 'tr' ? 'Veri sorumlusu sıfatı, işlenen kişisel veri grupları, hukuki sebepler ve kanuni haklar.' : 'Data controller identity, processing purposes, legal grounds and data subject rights.'}
                  </p>
                </div>
                <span className="text-blue-700 font-bold text-xs inline-flex items-center gap-1">
                  {locale === 'tr' ? 'Metni İncele' : 'View Notice'} →
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('TERMS');
                  setIsLegalModalOpen(true);
                }}
                className="p-5 rounded-xl bg-slate-50 hover:bg-slate-100 border-2 border-slate-200 hover:border-slate-300 text-left space-y-2 transition-all cursor-pointer shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="text-2xl">📋</div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                    {locale === 'tr' ? 'Koşullar & Açık Rıza' : 'Terms & Consent'}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-950 m-0">
                    {locale === 'tr' ? 'Kullanım Koşulları ve Açık Rıza' : 'Platform Participation Terms & Consent'}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 m-0 leading-relaxed">
                    {locale === 'tr' ? 'Platform katılım koşulları, isteğe bağlı tercihler, tanıtım izinleri ve kabul beyanı.' : 'Platform participation terms, optional consent preferences, promotional permissions and declaration.'}
                  </p>
                </div>
                <span className="text-blue-700 font-bold text-xs inline-flex items-center gap-1">
                  {locale === 'tr' ? 'Metni İncele' : 'View Terms'} →
                </span>
              </button>
            </div>
          </section>
        )}
      </main>

      {/* 4. Institutional Footer */}
      <AppFooter />

      {/* 5. Modals & Widgets */}
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalModalTab}
      />
      <ErasmusResultsWidget
        isOpen={isHibeWidgetOpen}
        onClose={() => setIsHibeWidgetOpen(false)}
      />
      <MebSchoolsWidget
        isOpen={isMebWidgetOpen}
        onClose={() => setIsMebWidgetOpen(false)}
      />
    </div>
  );
}
