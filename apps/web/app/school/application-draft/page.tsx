'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import AppHeader from '../../../components/layout/AppHeader';
import AppFooter from '../../../components/layout/AppFooter';
import CookieBanner from '../../../components/ui/CookieBanner';
import LegalModal from '../../../components/ui/LegalModal';

import ContextSection from '../../../components/application-draft/sections/ContextSection';
import OrgProfileSection from '../../../components/application-draft/sections/OrgProfileSection';
import NeedsObjectivesSection from '../../../components/application-draft/sections/NeedsObjectivesSection';
import ActivityDetailsSection from '../../../components/application-draft/sections/ActivityDetailsSection';
import QualityTeamSection from '../../../components/application-draft/sections/QualityTeamSection';
import DeclarationsSection from '../../../components/application-draft/sections/DeclarationsSection';
import AiOfficialQuestionsSection from '../../../components/application-draft/sections/AiOfficialQuestionsSection';
import DraftSummaryCard from '../../../components/application-draft/DraftSummaryCard';
import Ka120ImportPreviewModal from '../../../components/application-draft/Ka120ImportPreviewModal';

import { useAppStore } from '../../../lib/store';
import { FormType, calculateDraftCompletion, Ka120ExtractedData } from '../../../lib/application-draft-schema';
import { DRAFT_DEMO_PRESETS } from '../../../lib/application-draft-demo-presets';
import { useTranslation } from '../../../lib/i18n';

export default function ApplicationDraftPage() {
  const { t, locale } = useTranslation();
  const store = useAppStore();

  const [activeSection, setActiveSection] = useState<string>('context');
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // KA120 VET PDF upload & preview state
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isKa120ModalOpen, setIsKa120ModalOpen] = useState(false);
  const [extractedKa120Data, setExtractedKa120Data] = useState<Ka120ExtractedData | null>(null);
  const [isUploadingKa120, setIsUploadingKa120] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  // Sync with store on mount
  useEffect(() => {
    setMounted(true);
    store.initFromStorage();
    const activeSchoolName = store.currentOrg?.name || store.schoolProfile?.schoolName;
    if (activeSchoolName && !store.applicationDraft.context.applicantName) {
      store.syncPipelineToDraft();
    }
  }, []);

  const draft = store.applicationDraft;
  const formType = draft.formType;
  const isKa121 = formType === 'KA121';

  const ad = t.applicationDraft;

  // Sections configuration based on formType
  const SECTIONS = isKa121
    ? [
        { id: 'context', label: ad.sectionContextKa121, icon: '🏛️' },
        { id: 'activityDetails', label: ad.sectionActivitiesKa121, icon: '✈️' },
        { id: 'declarations', label: ad.sectionDeclarationsKa121, icon: '⚖️' },
        { id: 'aiQuestions', label: ad.sectionAiQuestionsKa121, icon: '📝' },
      ]
    : [
        { id: 'context', label: ad.sectionContextKa122, icon: '🏛️' },
        { id: 'orgProfile', label: ad.sectionOrgProfileKa122, icon: '🏢' },
        { id: 'needsObjectives', label: ad.sectionNeedsObjectivesKa122, icon: '🎯' },
        { id: 'activityDetails', label: ad.sectionActivitiesKa122, icon: '✈️' },
        { id: 'qualityTeam', label: ad.sectionQualityTeamKa122, icon: '👥' },
        { id: 'declarations', label: ad.sectionDeclarationsKa122, icon: '⚖️' },
        { id: 'aiQuestions', label: ad.sectionAiQuestionsKa122, icon: '📝' },
      ];

  const currentSectionIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  const handleFormTypeChange = (newType: FormType) => {
    if (newType === formType) return;
    store.syncPipelineToDraft(newType);
    setActiveSection('context');
    triggerToast(`${newType} ${ad.templateLoadedToast}`);
  };

  const handleSyncPipeline = () => {
    store.syncPipelineToDraft();
    triggerToast(ad.syncSuccessToast);
  };

  const handleLoadPreset = (presetId: string) => {
    store.loadDraftDemoPreset(presetId);
    const preset = DRAFT_DEMO_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      triggerToast(
        locale === 'en'
          ? `✓ ${preset.name} (${preset.formType}) demo data loaded successfully!`
          : `✓ ${preset.name} (${preset.formType}) test verileri başarıyla yüklendi!`,
      );
    }
  };

  const handleResetDraft = () => {
    if (window.confirm(ad.resetConfirm)) {
      store.resetDraft(formType);
      setActiveSection('context');
      triggerToast(ad.resetToast);
    }
  };

  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(draft, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `ErasmusMobility_${draft.formType}_Draft_${new Date().toISOString().split('T')[0]}.json`,
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('JSON dosyası indirildi');
  };

  const handleKa120FileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset value so same file can be re-selected if needed
    e.target.value = '';

    setUploadError(null);

    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setUploadError(ad.uploadPdfOnly);
      return;
    }

    const MAX_BYTES = 8 * 1024 * 1024; // 8 MB limit
    if (file.size > MAX_BYTES) {
      setUploadError(ad.uploadSizeLimit);
      return;
    }

    setIsUploadingKa120(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const res = await fetch('/api/extract-ka120', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              base64Pdf: base64Data,
              fileName: file.name,
            }),
          });

          const json = await res.json();
          if (!res.ok || !json.success) {
            setUploadError(
              json.error || ad.uploadParseError,
            );
            setIsUploadingKa120(false);
            return;
          }

          setUploadedFileName(file.name);
          setExtractedKa120Data(json.data);
          setIsUploadingKa120(false);
          setIsKa120ModalOpen(true);
        } catch (apiErr: any) {
          setUploadError(apiErr.message || (locale === 'en' ? 'A network error occurred while analyzing the document.' : 'Belge analiz edilirken bir bağlantı hatası oluştu.'));
          setIsUploadingKa120(false);
        }
      };

      reader.onerror = () => {
        setUploadError(ad.uploadReadError);
        setIsUploadingKa120(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadError(err?.message || 'Dosya yükleme hatası.');
      setIsUploadingKa120(false);
    }
  };

  const handleConfirmKa120Import = (confirmedData: Ka120ExtractedData) => {
    store.applyKa120Data(confirmedData);
    setIsKa120ModalOpen(false);
    triggerToast('KA120 akreditasyon verileri taslağa başarıyla aktarıldı');
  };

  const triggerToast = (msg: string) => {
    setSaveToast(msg);
    setTimeout(() => setSaveToast(null), 3000);
  };

  const { sectionPercentages } = calculateDraftCompletion(draft);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <AppHeader />

      {/* Hero Breadcrumb / Navigation */}
      <section className="bg-slate-900 text-white py-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                <Link href="/" className="hover:text-white transition-colors">
                  Anasayfa
                </Link>
                <span>/</span>
                <Link href="/school/pipeline" className="hover:text-white transition-colors">
                  Hareket Planı (Pipeline)
                </Link>
                <span>/</span>
                <span className="text-blue-400 font-semibold">Başvuru Taslağı Modülü</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>📋</span>
                <span>Hizmet Alan Kuruluş Başvuru Taslağı</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl">
                Resmi KA121-VET ve KA122-VET soru ve karar matrislerine dayalı, hızlı seçenekli ve
                otomatik eşleştirmeli veri seti hazırlama ekranı.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/school/pipeline"
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white transition-all border border-slate-700 flex items-center gap-1.5"
              >
                <span>←</span> Pipeline'a Dön
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 1. Aktif Giriş Yapmış Okul Bildirim Paneli */}
        {mounted && (store.currentOrg?.name || store.schoolProfile?.schoolName) && (
          <div className="bg-emerald-50/90 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-950 shadow-xs">
            <div className="flex items-start sm:items-center gap-3">
              <span className="text-xl">🏛️</span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Aktif Giriş Yapan Okul
                  </span>
                  <strong className="text-sm font-bold text-emerald-950">
                    {store.currentOrg?.name || store.schoolProfile?.schoolName}
                  </strong>
                </div>
                <div className="text-emerald-800 text-[11px] mt-1 flex flex-wrap items-center gap-2">
                  <span>
                    <strong>OID:</strong>{' '}
                    <span className="font-mono">{store.currentOrg?.oid || store.schoolProfile?.oid || 'E10000000'}</span>
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Şehir:</strong> {store.currentOrg?.city || store.schoolProfile?.city}
                  </span>
                  <span>•</span>
                  <span>
                    <strong>Akreditasyon:</strong>{' '}
                    {(store.currentOrg?.accreditationStatus === 'YES' || store.schoolProfile?.accredited === 'yes')
                      ? 'KA120 Akredite'
                      : 'Akreditasyonsuz'}
                  </span>
                  <span>•</span>
                  <span className="text-emerald-700 font-semibold">✓ Bilgiler taslağa otomatik aktarıldı</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSyncPipeline}
              className="self-start sm:self-auto px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors whitespace-nowrap shadow-xs flex items-center gap-1.5"
              title="Giriş yapılan okulun ve pipeline'ın güncel verilerini taslağa aktarır"
            >
              <span>🔄</span> Okul Bilgilerini Yenile
            </button>
          </div>
        )}

        {/* 2. Hızlı Test & 3 Demo Senaryosu Toolbar */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <span className="text-base">⚡</span>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Test İçin Otomatik Doldurma (3 Farklı Okul Senaryosu)
              </h3>
            </div>
            <span className="text-[11px] text-slate-500">
              Tek tıkla tüm soruları ve okul profilini gerçekçi Erasmus+ verileriyle doldurun
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {DRAFT_DEMO_PRESETS.map((preset, idx) => {
              const isSelected =
                mounted &&
                (store.schoolProfile.oid === preset.schoolProfile.oid &&
                  draft.context.applicantOid === preset.schoolProfile.oid);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleLoadPreset(preset.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all hover:shadow-md hover:-translate-y-0.5 group relative ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-600 ring-2 ring-blue-600/20 shadow-xs'
                      : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">
                      Senaryo {idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                        preset.formType === 'KA121'
                          ? 'bg-blue-100 text-blue-900 border-blue-300'
                          : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5 font-medium line-clamp-1">
                    {preset.shortDesc}
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1.5 flex items-center gap-1.5 font-medium">
                    <span>📍 {preset.schoolProfile.city}</span>
                    <span>•</span>
                    <span>{preset.participantProfile.participantCount} Katılımcı</span>
                    <span>•</span>
                    <span>{preset.draftData.activityDetails.hostCountry}</span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px] font-bold text-blue-700 group-hover:text-blue-800">
                    <span>{isSelected ? '✓ Aktif Senaryo' : 'Bu Senaryoyu Yükle'}</span>
                    <span>→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form Seçimi ve Özet Kartı */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Sol Kolon: Form Type Selector */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
                HEDEF ERASMUS+ HİBE FORMU
              </span>
              <h2 className="text-sm font-bold text-slate-900 mb-3">
                Hangi resmi hibe formu için taslak hazırlıyorsunuz?
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFormTypeChange('KA122')}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    formType === 'KA122'
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">KA122-VET</span>
                    {formType === 'KA122' && (
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-1">
                    {locale === 'en' ? 'Short-term Projects' : 'Kısa Dönemli Projeler'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {locale === 'en' ? '74-question official web form for non-accredited VET schools' : 'Akreditasyonsuz okullar için 74 soruluk kapsamlı matris'}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFormTypeChange('KA121')}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    formType === 'KA121'
                      ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900">KA121-VET</span>
                    {formType === 'KA121' && (
                      <span className="h-2 w-2 rounded-full bg-blue-600"></span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium mt-1">
                    {locale === 'en' ? 'Accredited Grant Allocation' : 'Akredite Kurum Hibe Talebi'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {locale === 'en' ? '46-question direct grant request for KA120 accredited schools' : 'KA120 akreditasyonlu okullar için 46 soruluk doğrudan talep'}
                  </div>
                </button>
              </div>

              {/* KA121 Özel: KA120 VET Akreditasyon Formu Yükleme Kutusu */}
              {formType === 'KA121' && (
                <div className="mt-4 p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📄</span>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          KA120 VET Akreditasyon Belgesi (İsteğe Bağlı)
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Maks. 8 MB • PDF formatı
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded uppercase">
                      AI Aktarım
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Daha önce onaylanan KA120 VET formunuzu yüklerseniz; kurum bilgileriniz, kalite taahhütleriniz ve hedefleriniz taslağa otomatik aktarılır.
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleKa120FileSelect}
                    accept="application/pdf,.pdf"
                    className="hidden"
                  />

                  {isUploadingKa120 ? (
                    <div className="p-3 bg-white rounded-lg border border-blue-200 flex items-center justify-center gap-2 text-xs font-semibold text-blue-800">
                      <svg
                        className="animate-spin h-4 w-4 text-blue-600"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      <span>KA120 VET belgesi taranıyor ve veriler çıkarılıyor...</span>
                    </div>
                  ) : uploadError ? (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2">
                      <div className="flex items-start gap-2 text-xs text-rose-800 font-medium leading-tight">
                        <span className="text-rose-600 font-bold shrink-0">⚠️</span>
                        <span>{uploadError}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-1.5 px-3 bg-white hover:bg-rose-100/50 text-rose-800 border border-rose-300 rounded text-xs font-bold transition cursor-pointer"
                      >
                        Farklı Bir Dosya Seç
                      </button>
                    </div>
                  ) : uploadedFileName ? (
                    <div className="p-3 bg-white border border-emerald-200 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 truncate max-w-[200px]">
                          <span>✓</span> {uploadedFileName}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          Aktarıldı
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setIsKa120ModalOpen(true)}
                          className="py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-bold transition text-center shadow-xs cursor-pointer"
                        >
                          Önizle ve Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="py-1.5 px-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[11px] font-semibold transition text-center cursor-pointer"
                        >
                          Yeniden Yükle
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2.5 px-3 border border-dashed border-blue-400 hover:border-blue-600 bg-white hover:bg-blue-50/70 rounded-lg text-xs font-bold text-blue-700 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>📤</span>
                      <span>KA120 VET PDF Belgesi Yükle (Maks. 8 MB)</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span suppressHydrationWarning>
                Son Değişiklik:{' '}
                {mounted && draft.lastUpdated
                  ? new Date(draft.lastUpdated).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : 'Otomatik'}
              </span>
              <span className="text-emerald-700 font-semibold">✓ Otomatik Kayıt Açık</span>
            </div>
          </div>

          {/* Sağ Kolon: Summary Card */}
          <div className="lg:col-span-7">
            <DraftSummaryCard
              draft={draft}
              onResetDraft={handleResetDraft}
            />
          </div>
        </div>

        {/* Horizontal Wizard Stepper / Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-2 shadow-xs overflow-x-auto">
          <div className="flex items-center min-w-max gap-1">
            {SECTIONS.map((section, idx) => {
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setActiveSection(section.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>{section.icon}</span>
                  <span>{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Section Content Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          {activeSection === 'context' && (
            <ContextSection
              data={draft.context}
              formType={formType}
              onChange={(updated) =>
                store.setApplicationDraft({
                  context: { ...draft.context, ...updated },
                })
              }
              isPipelineSynced={!!store.schoolProfile.schoolName}
              ka120ImportedFields={draft.ka120ImportedFields}
            />
          )}

          {activeSection === 'orgProfile' && !isKa121 && (
            <OrgProfileSection
              data={draft.orgProfile}
              onChange={(updated) =>
                store.setApplicationDraft({
                  orgProfile: { ...draft.orgProfile, ...updated },
                })
              }
              ka120ImportedFields={draft.ka120ImportedFields}
            />
          )}

          {activeSection === 'needsObjectives' && !isKa121 && (
            <NeedsObjectivesSection
              needs={draft.needs}
              objectives={draft.objectives}
              priorityTopics={draft.qualityTeam.priorityTopics}
              onChangeNeeds={(needs) => store.setApplicationDraft({ needs })}
              onChangeObjectives={(objectives) => store.setApplicationDraft({ objectives })}
              onChangePriorityTopics={(priorityTopics) =>
                store.setApplicationDraft({
                  qualityTeam: { ...draft.qualityTeam, priorityTopics },
                })
              }
              ka120ImportedFields={draft.ka120ImportedFields}
            />
          )}

          {activeSection === 'activityDetails' && (
            <ActivityDetailsSection
              data={draft.activityDetails}
              formType={formType}
              onChange={(updated) =>
                store.setApplicationDraft({
                  activityDetails: { ...draft.activityDetails, ...updated },
                })
              }
            />
          )}

          {activeSection === 'qualityTeam' && !isKa121 && (
            <QualityTeamSection
              data={draft.qualityTeam}
              onChange={(updated) =>
                store.setApplicationDraft({
                  qualityTeam: { ...draft.qualityTeam, ...updated },
                })
              }
              ka120ImportedFields={draft.ka120ImportedFields}
            />
          )}

          {activeSection === 'declarations' && (
            <DeclarationsSection
              data={draft.declarations}
              formType={formType}
              onChange={(updated) =>
                store.setApplicationDraft({
                  declarations: { ...draft.declarations, ...updated },
                })
              }
            />
          )}

          {activeSection === 'aiQuestions' && (
            <AiOfficialQuestionsSection
              draft={draft}
              schoolProfile={store.schoolProfile}
              onChangeAnswers={(answers) =>
                store.setApplicationDraft({
                  generatedAnswers: answers,
                })
              }
            />
          )}

          {/* Stepper Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-200">
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => {
                if (currentSectionIndex > 0) {
                  setActiveSection(SECTIONS[currentSectionIndex - 1].id);
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }
              }}
              disabled={currentSectionIndex === 0}
              className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                currentSectionIndex === 0
                  ? 'opacity-40 cursor-not-allowed bg-slate-50 text-slate-400 border-slate-200'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              ← Önceki Bölüm
            </button>

            <span className="text-xs text-slate-500 font-semibold" suppressHydrationWarning>
              Bölüm {currentSectionIndex + 1} / {SECTIONS.length}
            </span>

            {currentSectionIndex < SECTIONS.length - 1 ? (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  setActiveSection(SECTIONS[currentSectionIndex + 1].id);
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-blue-700 text-white hover:bg-blue-800 transition-all shadow-xs"
              >
                Sonraki Bölüm →
              </button>
            ) : (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => {
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                  triggerToast('Tüm taslak bölümleri hazır. Resmi form sorularını yukarıdan inceleyebilirsiniz.');
                }}
                className="px-5 py-2 rounded-lg text-xs font-bold bg-emerald-700 text-white hover:bg-emerald-800 transition-all shadow-xs flex items-center gap-1.5"
              >
                <span>✓</span> Taslak Tamamlandı
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-in fade-in slide-in-from-bottom duration-200 flex items-center gap-2">
          <span>ℹ️</span>
          <span>{saveToast}</span>
        </div>
      )}

      <AppFooter />
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />

      {/* KA120 Preview & Edit Modal */}
      <Ka120ImportPreviewModal
        isOpen={isKa120ModalOpen}
        extractedData={extractedKa120Data}
        onClose={() => setIsKa120ModalOpen(false)}
        onConfirm={handleConfirmKa120Import}
      />
    </div>
  );
}
