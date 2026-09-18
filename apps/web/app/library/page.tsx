'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal, { LegalTabType } from '../../components/ui/LegalModal';
import ErasmusResultsWidget from '../../components/ui/ErasmusResultsWidget';
import MebSchoolsWidget from '../../components/ui/MebSchoolsWidget';
import { useTranslation } from '../../lib/i18n';

export default function LibraryPage() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'FORMS' | 'GUIDES' | 'DATA' | 'LEGAL'>('FORMS');
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType>('LEGAL');
  const [isHibeWidgetOpen, setIsHibeWidgetOpen] = useState(false);
  const [isMebWidgetOpen, setIsMebWidgetOpen] = useState(false);

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
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-8">
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
              onClick={() => setActiveTab('FORMS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'FORMS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              📝 {locale === 'tr' ? 'KA121 / KA122 Form Rehberleri' : 'KA121 / KA122 Guides'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('GUIDES')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'GUIDES'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              📘 {locale === 'tr' ? 'Program Rehberi & Standartlar' : 'Programme Guide & Standards'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('DATA')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'DATA'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              📊 {locale === 'tr' ? 'Açık Veri & Hibe Kataloğu' : 'Open Data & Grants'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('LEGAL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'LEGAL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              ⚖️ {locale === 'tr' ? 'Hukuki Metinler & KVKK/GDPR' : 'Legal & Compliance'}
            </button>
          </div>
        </section>

        {/* TAB 1: KA121 & KA122 Form Guides */}
        {(activeTab === 'FORMS' || activeTab === 'GUIDES') && (
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
                    <span><strong>Kurum ve OID Doğrulaması:</strong> Tüzel kişilik ve akreditasyon kodu teyidi.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span><strong>Erasmus Planı Hedefleri:</strong> Kurumsal gelişim hedefleriyle eşleştirme.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span><strong>Faaliyetler & Katılımcılar:</strong> Kısa/uzun dönem öğrenci stajı ve personel izleme.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-blue-600 font-bold">4.</span>
                    <span><strong>Bütçe Tahsisat Matrisi:</strong> Seyahat, harcırah ve kurumsal destek birim maliyetleri.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/school/pipeline"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>🚀</span>
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
                    <span><strong>Kurumsal İhtiyaç Analizi:</strong> Gelişim alanları ve yerel sektör ihtiyaçları.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">2.</span>
                    <span><strong>Proje Hedefleri (Objectives):</strong> SMART ilkelerine uygun ölçülebilir hedefler.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">3.</span>
                    <span><strong>Öğrenme Çıktıları:</strong> ESCO becerileriyle uyumlu teknik ve yabancı dil kazanımı.</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-700">
                    <span className="text-emerald-700 font-bold">4.</span>
                    <span><strong>Yaygınlaştırma ve Etki:</strong> Proje sonuçlarının yerel ve bölgesel görünürlüğü.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href="/school/pipeline"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>🚀</span>
                    <span>{locale === 'tr' ? 'KA122 Uygunluk Analizini Başlat' : 'Open KA122 Eligibility Tool'}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
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
                  ? '6698 sayılı KVKK ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) uyumluluk metinleri'
                  : 'Compliance documentation for GDPR and Turkish Law on Protection of Personal Data (KVKK)'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('LEGAL');
                  setIsLegalModalOpen(true);
                }}
                className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left space-y-1.5 transition-colors"
              >
                <div className="text-lg">⚖️</div>
                <h4 className="text-xs font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'Privacy Notice'}
                </h4>
                <p className="text-[11px] text-slate-500 m-0">
                  {locale === 'tr' ? 'Kişisel verilerin işlenme amaçları ve haklarınız' : 'Data processing purposes and rights'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('TERMS');
                  setIsLegalModalOpen(true);
                }}
                className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left space-y-1.5 transition-colors"
              >
                <div className="text-lg">📋</div>
                <h4 className="text-xs font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Kullanım Koşulları & Sözleşme' : 'Terms of Service'}
                </h4>
                <p className="text-[11px] text-slate-500 m-0">
                  {locale === 'tr' ? 'Platform kullanım kuralları ve sorumluluklar' : 'Terms, conditions and responsibilities'}
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLegalModalTab('COOKIES');
                  setIsLegalModalOpen(true);
                }}
                className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left space-y-1.5 transition-colors"
              >
                <div className="text-lg">🍪</div>
                <h4 className="text-xs font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Çerez Politikası & Tercihler' : 'Cookie Preferences'}
                </h4>
                <p className="text-[11px] text-slate-500 m-0">
                  {locale === 'tr' ? 'Zorunlu ve analitik çerez yönetim ayarları' : 'Manage essential and analytics cookies'}
                </p>
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
