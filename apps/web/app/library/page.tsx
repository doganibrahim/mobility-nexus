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
import { LibraryDocument } from '../../lib/library-db';
import { Download, FileText, Sparkles, Tag, ExternalLink } from 'lucide-react';

export default function LibraryPage() {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'FORMS' | 'GUIDES' | 'DATA' | 'LEGAL'>('FORMS');
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalModalTab, setLegalModalTab] = useState<LegalTabType>('LEGAL');
  const [isHibeWidgetOpen, setIsHibeWidgetOpen] = useState(false);
  const [isMebWidgetOpen, setIsMebWidgetOpen] = useState(false);
  const [dynamicDocuments, setDynamicDocuments] = useState<LibraryDocument[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch('/api/admin/library/documents');
        if (res.ok) {
          const data = await res.json();
          setDynamicDocuments(data.data || []);
        }
      } catch (e) {
        console.error('Error loading library docs:', e);
      } finally {
        setIsDocsLoading(false);
      }
    }
    loadDocs();
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

        {/* DYNAMIC DOCUMENTS SECTION */}
        {(activeTab === 'FORMS' || activeTab === 'GUIDES') && (
          <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 m-0">
                    {locale === 'tr' ? 'Resmi Şablonlar ve İndirilebilir Doküman Havuzu' : 'Official Templates & Downloadable Document Pool'}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                    {dynamicDocuments.length} Belge
                  </span>
                </div>
                <p className="text-xs text-slate-600 m-0">
                  {locale === 'tr'
                    ? 'Avrupa Komisyonu ve Ulusal Ajans standartlarında resmi sözleşmeler, bütçe formülleri ve rehber dosyalar.'
                    : 'Official agreements, budget calculation templates, and compliance guides.'}
                </p>
              </div>

              <Link
                href="/admin/content-manager"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-colors self-start sm:self-auto"
              >
                <span>⚙️</span>
                <span>{locale === 'tr' ? 'CMS Doküman Yönetimi' : 'CMS Document Manager'}</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {dynamicDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300 transition-all flex flex-col justify-between space-y-3 shadow-2xs hover:shadow-xs"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-100 text-purple-900 border border-purple-200 font-mono">
                        {doc.fileFormat} • {doc.fileSize}
                      </span>
                      {doc.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-700" />
                          <span>{locale === 'tr' ? 'Öne Çıkan' : 'Featured'}</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 m-0 line-clamp-2">
                      {locale === 'tr' ? doc.titleTr : doc.titleEn || doc.titleTr}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 m-0 leading-relaxed">
                      {locale === 'tr' ? doc.descriptionTr : doc.descriptionEn || doc.descriptionTr}
                    </p>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {doc.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 text-[10px] font-medium"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{locale === 'tr' ? 'Dokümanı İndir / Görüntüle' : 'Download Document'}</span>
                  </a>
                </div>
              ))}
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
        initialTab="TERMS"
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
