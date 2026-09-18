'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal from '../../components/ui/LegalModal';
import { useTranslation } from '../../lib/i18n';

export default function AboutPage() {
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
              {locale === 'tr' ? 'Hakkımızda & Proje Misyonu' : 'About & Project Mission'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>EMaaS v1.0</span>
            <span>•</span>
            <span>Erasmus+ VET 2026-2027</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Canvas */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-12">
        {/* Hero Section (Flat, Zero Gradient, Authoritative) */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-10 shadow-xs space-y-5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>🇪🇺</span>
              <span>{locale === 'tr' ? 'ErasmusMobility Ekosistemi' : 'ErasmusMobility Ecosystem'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{locale === 'tr' ? 'Mesleki Eğitimde Dijital Eşleştirme' : 'Digital VET Matching Gateway'}</span>
            </span>
          </div>

          <div className="max-w-4xl space-y-3">
            <h1 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight m-0">
              {locale === 'tr'
                ? 'Avrupa Mesleki Eğitiminde Güvenilir Hareketlilik ve Doğrudan Eşleştirme Ekosistemi'
                : 'Trustworthy European Mobility and Direct Matching Ecosystem in Vocational Education'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0">
              {locale === 'tr'
                ? 'ErasmusMobility; Türkiye ve Avrupa genelindeki mesleki ve teknik eğitim kurumlarının (MTAL, ÇPAL, HEM) KA121 akredite bütçe taleplerini ve KA122 kısa dönemli hareketlilik projelerini uçtan uca planlamalarını, ESCO taksonomisiyle beceri açıklarını analiz etmelerini ve 33 AB ülkesindeki doğrulanmış işletmelerle doğrudan eşleşmelerini sağlayan kurumsal bir karar platformudur.'
                : 'ErasmusMobility is an institutional decision gateway enabling vocational education institutions across Turkey and Europe to plan KA121 and KA122 Erasmus+ mobilities, evaluate competence gaps via the ESCO taxonomy, and match directly with verified European enterprises across 33 Erasmus+ programme countries.'}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 flex-wrap">
            <Link
              href="/platform"
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
            >
              <span>🚀</span>
              <span>{locale === 'tr' ? 'Platform Modüllerini İncele' : 'Explore Platform Modules'}</span>
              <span>→</span>
            </Link>

            <Link
              href="/contact"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-colors"
            >
              <span>✉️</span>
              <span>{locale === 'tr' ? 'Bize Ulaşın & Randevu Alın' : 'Contact Us & Book Consultation'}</span>
            </Link>
          </div>
        </section>

        {/* 3 Core Pillars */}
        <section className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-900 m-0">
              {locale === 'tr' ? 'Temel Amaç ve Stratejik İlkeler' : 'Strategic Pillars & Objectives'}
            </h2>
            <p className="text-xs text-slate-500 m-0">
              {locale === 'tr'
                ? 'Erasmus+ Mesleki Eğitim Kalite Standartlarına tam uyumlu 3 ana sütun'
                : 'Three foundational pillars aligned with Erasmus+ VET Quality Standards'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 hover:border-blue-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-2xl">
                🎯
              </div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                {locale === 'tr' ? '1. Otomatik Karar & Uygunluk Motoru' : '1. Automated Decision Engine'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Kurumun akreditasyon OID durumu, geçmiş hibeleri ve stratejik hedeflerine göre KA121 mi yoksa KA122 projesinin mi daha uygun olduğunu 8 faktörlü karar motoruyla belirler; bürokratik ret riskini minimuma indirir.'
                  : 'Evaluates institutional accreditation, past grants, and capacity through an 8-factor rule engine to determine the optimal pathway (KA121 vs KA122), drastically reducing application risk.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 hover:border-emerald-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                {locale === 'tr' ? '2. 15 Kriterli Ev Sahibi Doğrulaması (KYC)' : '2. 15-Point Host Verification (KYC)'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Öğrencilerin ve personelin güvenliği için tüm Avrupa işletmeleri şirket sicili, vergi numarası, 7/24 acil durum kontağı ve iş sağlığı güvenliği (OHS) kriterleriyle idari denetimden geçer.'
                  : 'All European host enterprises are vetted through registration records, tax validity, 24/7 emergency protocols, and OHS standards to ensure total learner welfare and legal safety.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3 hover:border-indigo-300 hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-2xl">
                📊
              </div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                {locale === 'tr' ? '3. ESCO & ISCED-F Beceri Eşleştirmesi' : '3. ESCO & ISCED-F Taxonomy Matching'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Milli Eğitim Bakanlığı 27 meslek alanını Avrupa Birliği ESCO meslek profilleri ve ISCED kodlarıyla birebir haritalandırarak ölçülebilir teknik ve transversal öğrenme çıktıları üretir.'
                  : 'Maps national vocational curricula directly to European ESCO occupational skills and ISCED codes, generating transparent, measurable technical and transversal learning outcomes.'}
              </p>
            </div>
          </div>
        </section>

        {/* Quality Standards & Commitment */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900 m-0">
              {locale === 'tr' ? 'Erasmus+ Kalite Standartları ve Taahhüdümüz' : 'Erasmus+ Quality Standards & Commitments'}
            </h2>
            <p className="text-xs text-slate-500 m-0">
              {locale === 'tr'
                ? 'Avrupa Komisyonu ilkeleri doğrultusunda şeffaf, kapsayıcı ve çevre dostu ilkeler'
                : 'Principles aligned with European Commission guidelines for inclusion, green travel and excellence'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xl">🌿</div>
              <h4 className="text-xs font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'Yeşil Seyahat & Sürdürülebilirlik' : 'Green Travel & Sustainability'}
              </h4>
              <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                {locale === 'tr'
                  ? 'Demiryolu ve düşük karbonlu seyahat teşvikleri ile kağıtsız dijital hibe yönetimi.'
                  : 'Promotion of low-carbon rail journeys and completely paperless digital mobility files.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xl">🤝</div>
              <h4 className="text-xs font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'Kapsayıcılık & Fırsat Eşitliği' : 'Inclusion & Diversity'}
              </h4>
              <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                {locale === 'tr'
                  ? 'Özel gereksinimli, engelli ve imkanı kısıtlı öğrencilere tam erişilebilirlik ve ek hibe rehberliği.'
                  : 'Comprehensive support and supplementary grant guidelines for learners with fewer opportunities.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xl">🎓</div>
              <h4 className="text-xs font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'Europass & ECVET Uyumu' : 'Europass & ECVET Recognition'}
              </h4>
              <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                {locale === 'tr'
                  ? 'Staj sonrası Europass Hareketlilik Belgesi ve ulusal müfredata transfer edilebilir kredi tanınması.'
                  : 'Europass Mobility Certificate issuance and seamless credit transfer into national graduation tracks.'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="text-xl">⚖️</div>
              <h4 className="text-xs font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'KVKK & GDPR Uyumlu Veri Güvenliği' : 'GDPR & Privacy Compliance'}
              </h4>
              <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                {locale === 'tr'
                  ? 'Katılımcı ve kurum verileri 6698 sayılı KVKK ve AB GDPR standartlarında şifrelenerek korunur.'
                  : 'All institutional and learner records are securely encrypted in compliance with GDPR and KVKK.'}
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Banner */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl text-center sm:text-left">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white m-0">
              {locale === 'tr' ? 'Okulunuz İçin Hareketlilik Planı Hazırlamaya Başlayın' : 'Start Preparing Your Mobility Plan Today'}
            </h3>
            <p className="text-xs text-slate-300 m-0 leading-relaxed">
              {locale === 'tr'
                ? '5 adımlı interaktif pipeline ile kurum profilinizi girin, yetkinlik testini yapın ve uygun hostları hemen bulun.'
                : 'Experience the 5-step interactive pipeline to assess skills, match verified hosts, and generate grant files.'}
            </p>
          </div>

          <Link
            href="/school/pipeline"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs shrink-0"
          >
            <span>🚀</span>
            <span>{locale === 'tr' ? '5 Adımlı Pipeline\'ı Aç' : 'Launch 5-Step Pipeline'}</span>
            <span>→</span>
          </Link>
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
