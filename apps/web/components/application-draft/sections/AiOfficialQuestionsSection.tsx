'use client';

import React, { useState } from 'react';
import {
  ApplicationDraftState,
  GeneratedQuestionAnswer,
  DEFAULT_OFFICIAL_QUESTIONS_KA122,
  DEFAULT_OFFICIAL_QUESTIONS_KA121,
} from '../../../lib/application-draft-schema';
import { useTranslation } from '../../../lib/i18n';

interface AiOfficialQuestionsSectionProps {
  draft: ApplicationDraftState;
  schoolProfile?: any;
  onChangeAnswers: (answers: GeneratedQuestionAnswer[]) => void;
}

export default function AiOfficialQuestionsSection({
  draft,
  schoolProfile,
  onChangeAnswers,
}: AiOfficialQuestionsSectionProps) {
  const { locale } = useTranslation();
  const isKa121 = draft.formType === 'KA121';
  const defaultQuestions = isKa121
    ? DEFAULT_OFFICIAL_QUESTIONS_KA121
    : DEFAULT_OFFICIAL_QUESTIONS_KA122;

  // Initialize or fallback to existing generatedAnswers
  const answers: GeneratedQuestionAnswer[] =
    draft.generatedAnswers && draft.generatedAnswers.length > 0
      ? defaultQuestions.map((dq) => {
          const found = draft.generatedAnswers?.find((a) => a.id === dq.id);
          return found || dq;
        })
      : defaultQuestions;

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generatingQuestionId, setGeneratingQuestionId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);
  const [generateProgress, setGenerateProgress] = useState<{ current: number; total: number } | null>(null);
  const [showSourceQuestions, setShowSourceQuestions] = useState(false);
  const [expandedSourceCardIds, setExpandedSourceCardIds] = useState<Record<string, boolean>>({});

  // 1. Temel Başvuru Bilgileri (Okul, Proje, Faaliyet)
  const notSpecified = locale === 'tr' ? 'Belirtilmedi' : 'Not specified';
  const directFields = [
    {
      id: 'df-applicant-name',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Başvuran Kuruluş Yasal Adı (Applicant Legal Name)' : 'Applicant Legal Name',
      value: draft.context.applicantName || schoolProfile?.schoolName || notSpecified,
    },
    {
      id: 'df-applicant-oid',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Kuruluş Kimlik Kodu (Organisation ID - OID)' : 'Organisation ID (OID)',
      value: draft.context.applicantOid || schoolProfile?.oid || notSpecified,
    },
    {
      id: 'df-applicant-city',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Şehir ve Ülke (City & Country)' : 'City & Country',
      value: `${draft.context.applicantCity || schoolProfile?.city || (locale === 'tr' ? 'Türkiye' : 'Turkey')}, ${locale === 'tr' ? 'Türkiye' : 'Turkey'}`,
    },
    {
      id: 'df-project-title',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Proje Tam Adı (Project Title)' : 'Project Title',
      value: draft.context.projectTitle || `${draft.context.applicantName || schoolProfile?.schoolName || 'VET School'} Erasmus+ Project`,
    },
    {
      id: 'df-project-acronym',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Proje Kısaltması / Akronim (Project acronym)' : 'Project Acronym',
      value: draft.context.projectAcronym || 'VET-MOBILITY',
    },
    {
      id: 'df-start-date',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Proje Başlangıç Tarihi (Project Start Date)' : 'Project Start Date',
      value: draft.context.projectStartDate || '2026-10-01',
    },
    {
      id: 'df-duration-months',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Proje Süresi (Duration)' : 'Project Duration',
      value: `${draft.context.projectDurationMonths || 12} ${locale === 'tr' ? 'Ay' : 'Months'}`,
    },
    {
      id: 'df-language',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Başvuru Dili (Language used to fill the form)' : 'Application Form Language',
      value: locale === 'tr' ? 'İngilizce (EN)' : 'English (EN)',
    },
    {
      id: 'df-activity-type',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Faaliyet Türü (Activity Type)' : 'Activity Type',
      value: draft.activityDetails.activityType === 'VET_SHORT_TERM'
        ? (locale === 'tr' ? 'Kısa Dönemli Mesleki Öğrenici Hareketliliği (10-89 gün)' : 'Short-term learning mobility of VET learners (10-89 days)')
        : draft.activityDetails.activityType,
    },
    {
      id: 'df-participants-count',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Öğrenici / Katılımcı Sayısı (Learners Count)' : 'Learners / Participants Count',
      value: `${draft.activityDetails.totalParticipants || 0} ${locale === 'tr' ? 'Katılımcı' : 'Participants'}`,
    },
    {
      id: 'df-duration-days',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Faaliyet Süresi (Standard Duration)' : 'Activity Duration',
      value: `${draft.activityDetails.standardDurationDays || 0} ${locale === 'tr' ? 'Gün' : 'Days'} (${
        (draft.activityDetails.travelDaysPerPerson ?? 2) > 0
          ? `+${draft.activityDetails.travelDaysPerPerson ?? 2}`
          : '0'
      } ${locale === 'tr' ? 'seyahat günü' : 'travel days'})`,
    },
    {
      id: 'df-target-country',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Hedef Ülke (Destination Country)' : 'Destination Country',
      value: (draft.activityDetails.targetCountries || []).join(', ') || draft.activityDetails.hostCountry || 'Almanya (DE)',
    },
    {
      id: 'df-host-name',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Ev Sahibi Kuruluş (Hosting Organisation)' : 'Hosting Organisation',
      value: draft.activityDetails.hostName || 'European Vocational Training & Internship Center',
    },
    {
      id: 'df-travel-mode',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Ulaşım Türü & Yeşil Seyahat (Travel Mode)' : 'Travel Mode & Green Mobility',
      value: `${draft.activityDetails.mainTravelMode} (${draft.activityDetails.greenTravelParticipantsCount || 0} ${locale === 'tr' ? 'kişi Yeşil Seyahat Hibe Desteği' : 'participants Green Travel'})`,
    },
    {
      id: 'df-accompanying',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Refakatçi Durumu (Accompanying Persons)' : 'Accompanying Persons Status',
      value: draft.activityDetails.accompanyingRequired
        ? `${draft.activityDetails.accompanyingCount} ${locale === 'tr' ? 'Refakatçi Öğretmen' : 'Accompanying Staff'} (${draft.activityDetails.accompanyingDays} ${locale === 'tr' ? 'gün' : 'days'})`
        : (locale === 'tr' ? 'Refakatçi Talep Edilmedi' : 'No accompanying persons requested'),
    },
    {
      id: 'df-legal-rep',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Yasal Temsilci (Legal Representative)' : 'Legal Representative',
      value: `${draft.qualityTeam.legalRepresentativeName || (locale === 'tr' ? 'Okul Müdürü' : 'Principal')} (${draft.qualityTeam.legalRepresentativeRole || (locale === 'tr' ? 'Okul Müdürü' : 'Principal')} - ${draft.qualityTeam.legalRepresentativeEmail || (locale === 'tr' ? 'E-posta belirtilmedi' : 'Email not specified')})`,
    },
    {
      id: 'df-coordinator',
      category: locale === 'tr' ? 'Temel Bilgiler' : 'Core Details',
      label: locale === 'tr' ? 'Proje Koordinatörü / İrtibat Kişisi (Contact Person)' : 'Project Coordinator / Contact Person',
      value: `${draft.qualityTeam.coordinatorName || (locale === 'tr' ? 'Proje Koordinatörü' : 'Coordinator')} (${draft.qualityTeam.coordinatorRole || (locale === 'tr' ? 'Koordinatör' : 'Coordinator')} - ${draft.qualityTeam.coordinatorEmail || (locale === 'tr' ? 'E-posta belirtilmedi' : 'Email not specified')})`,
    },
  ];

  // Kategoriler (Temel Bilgiler + Anlatısal Sorular)
  const coreCategoryLabel = locale === 'tr' ? 'Temel Bilgiler' : 'Core Details';
  const narrativeCategories = Array.from(new Set(answers.map((a) => (locale === 'en' && a.categoryEn ? a.categoryEn : a.category))));
  const allCategories = [coreCategoryLabel, ...narrativeCategories];

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleCopySingle = async (id: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast(locale === 'tr' ? 'Panoya kopyalandı.' : 'Copied to clipboard.');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleAnswerChange = (id: string, newAnswer: string) => {
    const updated = answers.map((a) => (a.id === id ? { ...a, answer: newAnswer, lastGeneratedAt: new Date().toISOString() } : a));
    onChangeAnswers(updated);
  };

  const handleGenerateSingle = async (id: string) => {
    const q = answers.find((a) => a.id === id);
    if (!q) return;

    setGeneratingQuestionId(id);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/generate-draft-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: id,
          questionText: q.question,
          category: q.category,
          charLimit: q.charLimit,
          evaluatorCriteria: q.evaluatorCriteria,
          draft,
          schoolProfile,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || (locale === 'tr' ? 'Yapay zeka yanıtı üretilemedi' : 'Failed to generate AI response'));
      }

      handleAnswerChange(id, data.narrative);
      showToast(locale === 'tr' ? 'Yanıt başarıyla üretildi.' : 'Response generated successfully.');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setGeneratingQuestionId(null);
    }
  };

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    setErrorMessage(null);
    setShowSuccessBanner(false);

    try {
      for (let i = 0; i < answers.length; i++) {
        const q = answers[i];
        setGenerateProgress({ current: i + 1, total: answers.length });
        setGeneratingQuestionId(q.id);

        const res = await fetch('/api/generate-draft-narrative', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: q.id,
            questionText: q.question,
            category: q.category,
            charLimit: q.charLimit,
            evaluatorCriteria: q.evaluatorCriteria,
            draft,
            schoolProfile,
          }),
        });

        const data = await res.json();
        if (res.ok && data.success) {
          handleAnswerChange(q.id, data.narrative);
        }
      }
      setShowSuccessBanner(true);
      showToast(locale === 'tr' ? 'Tüm resmi soru yanıtları başarıyla üretildi!' : 'All official responses generated successfully!');
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsGeneratingAll(false);
      setGeneratingQuestionId(null);
      setGenerateProgress(null);
    }
  };

  const handleStopGeneration = () => {
    setIsGeneratingAll(false);
    setGeneratingQuestionId(null);
    setGenerateProgress(null);
  };

  const handleExportTxt = () => {
    let content = `============================================================\n`;
    content += `ERASMUS+ ${draft.formType}-VET OFFICIAL APPLICATION PROPOSAL DOSSIER\n`;
    content += `============================================================\n\n`;

    content += `PART 1: APPLICANT AND PROJECT DATA\n`;
    content += `------------------------------------------------------------\n`;
    directFields.forEach((f) => {
      content += `${f.label}: ${f.value}\n`;
    });
    content += `\n`;

    content += `PART 2: OFFICIAL PROPOSAL NARRATIVE (ENGLISH)\n`;
    content += `------------------------------------------------------------\n\n`;
    answers.forEach((q, idx) => {
      content += `[QUESTION ${idx + 1}/${answers.length}] ${q.categoryEn || q.category}\n`;
      content += `OFFICIAL QUESTION: ${q.questionEn || q.question}\n`;
      if ((locale === 'tr' || showSourceQuestions) && q.question && q.questionEn !== q.question) {
        content += `QUESTION (TR SOURCE): ${q.question}\n`;
      }
      if (q.evaluatorCriteria) {
        content += `EVALUATOR CRITERIA: ${q.evaluatorCriteria}\n`;
      }
      content += `\nOFFICIAL NARRATIVE ANSWER (ENGLISH):\n${q.answer || '(No answer generated yet.)'}\n\n`;
      content += `------------------------------------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Erasmus_${draft.formType}_English_Application_Proposal.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(locale === 'tr' ? 'Tam başvuru dosyası (İngilizce) indirildi.' : 'Application dossier (English) downloaded.');
  };

  const answeredCount = answers.filter((a) => a.answer && a.answer.trim().length > 10).length;

  const showDirectFields =
    activeCategory === 'ALL' || activeCategory === coreCategoryLabel;
  const showNarrativeFields = activeCategory !== coreCategoryLabel;

  const filteredNarrativeAnswers =
    activeCategory === 'ALL'
      ? answers
      : answers.filter((a) => (locale === 'en' && a.categoryEn ? a.categoryEn === activeCategory : a.category === activeCategory));

  return (
    <div className="space-y-6">
      {/* 1. Zorunlu Taslak / Örnek Mahiyeti Bildirimi */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-950 flex items-start gap-3 shadow-xs">
        <span className="text-xl leading-none">⚠️</span>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            {locale === 'tr'
              ? 'Resmi Form Doldurma Rehberi (Örnek Taslak Uyarısı)'
              : 'Official Application Drafting Guide (Sample Workspace Notice)'}
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            {locale === 'tr'
              ? 'Bu ekrandaki tüm alanlar ve soru yanıtları, resmi Avrupa Komisyonu Erasmus+ başvuru formunu doldururken kurumunuza rehberlik etmek amacıyla oluşturulmuş örnek taslaklardır. Ulusal Ajans\'a resmi başvuru yapılmadan önce her alanı inceleyiniz ve okulunuzun gerçek verilerine göre doğrulayınız.'
              : 'All data fields and narrative answers provided here are sample draft guidelines designed to assist your institution when filling out the official European Commission Erasmus+ form. Please review and verify all details against your school\'s records before official submission.'}
          </p>
        </div>
      </div>

      {/* 2. Üst Kontrol Çubuğu */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              {locale === 'tr' ? 'Resmi Başvuru Formu Dosyası' : 'Official Application Drafting Dossier'}
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {directFields.length} {locale === 'tr' ? 'Temel Alan' : 'Core Fields'} + {answeredCount} / {answers.length} {locale === 'tr' ? 'Soru' : 'Questions'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {locale === 'tr'
              ? 'Resmi forma kopyalayacağınız temel kurum/proje bilgileri ve kompozisyon soruları tek bir derli toplu rehberdedir.'
              : 'Consolidated dossier of institutional parameters and official narrative responses ready to paste into the official submission.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportTxt}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            {locale === 'tr' ? 'Metin Olarak İndir' : 'Download as Text'}
          </button>

          {isGeneratingAll && (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
              title={locale === 'tr' ? 'Üretimi durdur' : 'Stop generation'}
            >
              {locale === 'tr' ? 'Durdur' : 'Stop'}
            </button>
          )}

          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={isGeneratingAll || generatingQuestionId !== null}
            className="px-4 py-2 text-xs font-bold rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition-all shadow-xs flex items-center gap-2 disabled:opacity-50"
          >
            {isGeneratingAll && generateProgress ? (
              <>
                <span className="animate-spin text-sm">⏳</span>
                <span>
                  {locale === 'tr'
                    ? `Üretiliyor (${generateProgress.current}/${generateProgress.total})...`
                    : `Generating (${generateProgress.current}/${generateProgress.total})...`}
                </span>
              </>
            ) : (
              <span>{locale === 'tr' ? 'Yapay Zeka Yanıtları Üret' : 'Generate AI Responses'}</span>
            )}
          </button>
        </div>
      </div>

      {/* Başarı Bildirimi */}
      {showSuccessBanner && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-950 flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <span className="text-xl leading-none">✅</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                {locale === 'tr' ? 'Yapay Zeka Yanıtları Başarıyla Üretildi' : 'AI Narrative Answers Generated Successfully'}
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                {locale === 'tr'
                  ? 'Tüm sorular için Avrupa Komisyonu değerlendirme kriterlerine uygun resmi İngilizce yanıtlar üretildi. Yanıtları doğrudan inceleyebilir, düzenleyebilir veya tek tıkla kopyalayıp resmi formdaki kutucuklara yapıştırabilirsiniz.'
                  : 'Official English narrative answers aligned with European Commission award criteria have been generated. Review, edit, or copy directly into your submission.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessBanner(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-sm px-1.5 py-0.5"
            title={locale === 'tr' ? 'Kapat' : 'Close'}
          >
            ×
          </button>
        </div>
      )}

      {/* Hata Bildirimi */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 flex items-center justify-between">
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-red-500 hover:text-red-700 font-bold ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* 3. Bölüm Filtreleme Sekmeleri */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeCategory === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            {locale === 'tr' ? 'Tüm Form' : 'Full Dossier'} ({directFields.length + answers.length})
          </button>

          {allCategories.map((cat) => {
            const isDirect = cat === coreCategoryLabel;
            const count = isDirect
              ? directFields.length
              : answers.filter((a) => (locale === 'en' && a.categoryEn ? a.categoryEn === cat : a.category === cat)).length;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-blue-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>

        {locale === 'en' && (
          <button
            type="button"
            onClick={() => setShowSourceQuestions(!showSourceQuestions)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border cursor-pointer ${
              showSourceQuestions
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50 hover:text-slate-900'
            }`}
            title="Toggle Turkish source questions for reference"
          >
            <span>🌐</span>
            <span>{showSourceQuestions ? 'Hide Source Questions (TR)' : 'Show Source Question (TR)'}</span>
          </button>
        )}
      </div>

      {/* 4. DOĞRUDAN FORM ALANLARI */}
      {showDirectFields && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>🏛️</span>
              <span>{locale === 'tr' ? 'Temel Başvuru Bilgileri' : 'Core Application Parameters'}</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              {locale === 'tr' ? 'Resmi formdaki kutucuklara doğrudan yapıştırılabilir' : 'Directly copyable into official form fields'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {directFields.map((field) => {
              const isCopied = copiedId === field.id;
              return (
                <div
                  key={field.id}
                  className="bg-white border border-slate-200 rounded-xl p-3.5 flex items-start justify-between gap-2 shadow-xs hover:border-slate-300 transition-all"
                >
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-semibold text-slate-500 truncate">
                        {field.label}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 break-words pt-1">
                      {field.value}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySingle(field.id, field.value)}
                    className={`shrink-0 px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                      isCopied
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                    title={locale === 'tr' ? 'Bu alanı panoya kopyala' : 'Copy field to clipboard'}
                  >
                    {isCopied ? (locale === 'tr' ? '✓ Kopyalandı' : '✓ Copied') : (locale === 'tr' ? 'Kopyala' : 'Copy')}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. ANLATISAL / KOMPOZİSYON SORULARI VE CEVAPLARI */}
      {showNarrativeFields && (
        <div className="space-y-4 pt-2">
          {showDirectFields && (
            <div className="pt-3 border-t border-slate-200">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2 mb-3">
                <span>📝</span>
                <span>{locale === 'tr' ? 'Resmi Form Soruları ve Yanıtları' : 'Official Application Questions & Narrative Answers'}</span>
              </h4>
            </div>
          )}

          {filteredNarrativeAnswers.map((item) => {
            const isGeneratingThis = generatingQuestionId === item.id;
            const isCopied = copiedId === item.id;
            const currentLength = (item.answer || '').length;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs transition-all hover:border-slate-300 space-y-3"
              >
                {/* Soru Başlığı ve Aksiyonlar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {locale === 'en' ? (item.categoryEn || item.category) : item.category}
                      </span>
                    </div>

                    {/* Resmi İngilizce Soru Başlığı */}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {locale === 'en' ? (item.questionEn || item.question) : item.question}
                    </h4>

                    {/* Dil Desteği Çeviri / Açıklama */}
                    {locale === 'tr' && item.questionEn && item.question && item.questionEn !== item.question && (
                      <p className="text-[11px] text-slate-500 italic">
                        EN: {item.questionEn}
                      </p>
                    )}

                    {locale === 'en' && (showSourceQuestions || expandedSourceCardIds[item.id]) && item.question && item.questionEn && item.questionEn !== item.question && (
                      <div className="mt-1 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start justify-between gap-1.5 animate-fadeIn">
                        <div className="flex items-start gap-1.5 min-w-0">
                          <span className="font-bold text-slate-700 shrink-0">TR Source:</span>
                          <span className="italic break-words">{item.question}</span>
                        </div>
                        {!showSourceQuestions && (
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedSourceCardIds((prev) => ({
                                ...prev,
                                [item.id]: false,
                              }))
                            }
                            className="text-slate-400 hover:text-slate-700 text-xs font-bold px-1 shrink-0 cursor-pointer"
                            title="Hide"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    )}

                    {locale === 'en' && !showSourceQuestions && !expandedSourceCardIds[item.id] && item.question && item.questionEn && item.questionEn !== item.question && (
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedSourceCardIds((prev) => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                          className="text-[11px] text-slate-400 hover:text-blue-700 underline font-medium cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Show source question (TR)</span>
                        </button>
                      </div>
                    )}

                    {/* Değerlendirici Kriteri */}
                    {item.evaluatorCriteria && (
                      <div className="mt-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100/90 text-[11px] text-blue-900 flex items-start gap-2">
                        <span className="font-bold shrink-0">
                          {locale === 'tr' ? '🎯 Değerlendirici Kriteri (Award Criteria):' : '🎯 Award Criteria:'}
                        </span>
                        <span className="text-blue-800 leading-relaxed">{item.evaluatorCriteria}</span>
                      </div>
                    )}
                  </div>

                  {/* Aksiyon Butonları (Kopyala & Yeniden Üret) */}
                  <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => handleGenerateSingle(item.id)}
                      disabled={isGeneratingAll || isGeneratingThis}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors disabled:opacity-50"
                    >
                      {isGeneratingThis ? (locale === 'tr' ? 'Üretiliyor...' : 'Generating...') : (locale === 'tr' ? 'Yeniden Üret' : 'Regenerate')}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopySingle(item.id, item.answer)}
                      disabled={!item.answer}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
                        isCopied
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : item.answer
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            : 'opacity-40 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <span>✓</span>
                          <span>{locale === 'tr' ? 'Kopyalandı' : 'Copied'}</span>
                        </>
                      ) : (
                        <span>{locale === 'tr' ? 'Kopyala' : 'Copy'}</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Düzenlenebilir Cevap Alanı */}
                <div>
                  <textarea
                    rows={6}
                    value={item.answer || ''}
                    onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                    placeholder={
                      locale === 'tr'
                        ? "Bu soru için resmi İngilizce kompozisyon metni üretilir. 'Yeniden Üret' veya yukarıdaki 'Yapay Zeka Yanıtları Üret' butonuna tıklayarak Avrupa Komisyonu değerlendirme standartlarına uygun İngilizce yanıt oluşturabilir ya da doğrudan metin yazabilirsiniz..."
                        : "Official English narrative response will be generated here. Click 'Generate AI Responses' to synthesize responses aligned with EC award criteria, or write directly..."
                    }
                    className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans leading-relaxed resize-y"
                  />

                  {/* Karakter Sayacı ve Bilgilendirme */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>
                      {item.lastGeneratedAt ? (
                        <>
                          {locale === 'tr' ? 'Son güncelleme: ' : 'Last updated: '}
                          {new Date(item.lastGeneratedAt).toLocaleTimeString(locale === 'tr' ? 'tr-TR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                        </>
                      ) : (
                        locale === 'tr' ? 'Düzenlenebilir taslak alan' : 'Editable draft response'
                      )}
                    </span>
                    <span className={currentLength > item.charLimit ? 'text-red-500 font-bold' : ''}>
                      {currentLength.toLocaleString()} / {item.charLimit.toLocaleString()} {locale === 'tr' ? 'karakter' : 'chars'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Bildirim Toast */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-in fade-in duration-200">
          {successToast}
        </div>
      )}
    </div>
  );
}
