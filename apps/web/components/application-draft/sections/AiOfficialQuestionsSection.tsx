'use client';

import React, { useState } from 'react';
import {
  ApplicationDraftState,
  GeneratedQuestionAnswer,
  DEFAULT_OFFICIAL_QUESTIONS_KA122,
  DEFAULT_OFFICIAL_QUESTIONS_KA121,
} from '../../../lib/application-draft-schema';

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

  // 1. Temel Başvuru Bilgileri (Okul, Proje, Faaliyet)
  const directFields = [
    {
      id: 'df-applicant-name',
      category: 'Temel Bilgiler',
      label: 'Başvuran Kuruluş Yasal Adı (Applicant Legal Name)',
      value: draft.context.applicantName || schoolProfile?.schoolName || 'Belirtilmedi',
    },
    {
      id: 'df-applicant-oid',
      category: 'Temel Bilgiler',
      label: 'Kuruluş Kimlik Kodu (Organisation ID - OID)',
      value: draft.context.applicantOid || schoolProfile?.oid || 'Belirtilmedi',
    },
    {
      id: 'df-applicant-city',
      category: 'Temel Bilgiler',
      label: 'Şehir ve Ülke (City & Country)',
      value: `${draft.context.applicantCity || schoolProfile?.city || 'Türkiye'}, Türkiye`,
    },
    {
      id: 'df-project-title',
      category: 'Temel Bilgiler',
      label: 'Proje Tam Adı (İngilizce / Project name)',
      value: draft.context.projectTitle || `${draft.context.applicantName || schoolProfile?.schoolName || 'VET School'} Erasmus+ Project`,
    },
    {
      id: 'df-project-acronym',
      category: 'Temel Bilgiler',
      label: 'Proje Kısaltması / Akronim (Project acronym)',
      value: draft.context.projectAcronym || 'VET-MOBILITY',
    },
    {
      id: 'df-start-date',
      category: 'Temel Bilgiler',
      label: 'Proje Başlangıç Tarihi (Project Start Date)',
      value: draft.context.projectStartDate || '2026-10-01',
    },
    {
      id: 'df-duration-months',
      category: 'Temel Bilgiler',
      label: 'Proje Süresi (Duration)',
      value: `${draft.context.projectDurationMonths || 12} Ay`,
    },
    {
      id: 'df-language',
      category: 'Temel Bilgiler',
      label: 'Başvuru Dili (Language used to fill the form)',
      value: 'İngilizce (EN)',
    },
    {
      id: 'df-activity-type',
      category: 'Temel Bilgiler',
      label: 'Faaliyet Türü (Activity Type)',
      value: draft.activityDetails.activityType === 'VET_SHORT_TERM' ? 'Kısa Dönemli Mesleki Öğrenici Hareketliliği (Short-term learning mobility of VET learners)' : draft.activityDetails.activityType,
    },
    {
      id: 'df-participants-count',
      category: 'Temel Bilgiler',
      label: 'Öğrenici / Katılımcı Sayısı (Learners Count)',
      value: `${draft.activityDetails.totalParticipants || 0} Katılımcı`,
    },
    {
      id: 'df-duration-days',
      category: 'Temel Bilgiler',
      label: 'Faaliyet Süresi (Standard Duration)',
      value: `${draft.activityDetails.standardDurationDays || 0} Gün (+${draft.activityDetails.travelDaysPerPerson || 2} seyahat günü)`,
    },
    {
      id: 'df-target-country',
      category: 'Temel Bilgiler',
      label: 'Hedef Ülke (Destination Country)',
      value: (draft.activityDetails.targetCountries || []).join(', ') || draft.activityDetails.hostCountry || 'Almanya (DE)',
    },
    {
      id: 'df-host-name',
      category: 'Temel Bilgiler',
      label: 'Ev Sahibi Kuruluş (Hosting Organisation)',
      value: draft.activityDetails.hostName || 'European Vocational Training & Internship Center',
    },
    {
      id: 'df-travel-mode',
      category: 'Temel Bilgiler',
      label: 'Ulaşım Türü & Yeşil Seyahat (Travel Mode)',
      value: `${draft.activityDetails.mainTravelMode} (${draft.activityDetails.greenTravelParticipantsCount || 0} kişi Yeşil Seyahat Hibe Desteği)`,
    },
    {
      id: 'df-accompanying',
      category: 'Temel Bilgiler',
      label: 'Refakatçi Durumu (Accompanying Persons)',
      value: draft.activityDetails.accompanyingRequired
        ? `${draft.activityDetails.accompanyingCount} Refakatçi Öğretmen (${draft.activityDetails.accompanyingDays} gün - Gerekçe: ${draft.activityDetails.accompanyingReason})`
        : 'Refakatçi Talep Edilmedi',
    },
    {
      id: 'df-legal-rep',
      category: 'Temel Bilgiler',
      label: 'Yasal Temsilci (Legal Representative)',
      value: `${draft.qualityTeam.legalRepresentativeName || 'Okul Müdürü'} (${draft.qualityTeam.legalRepresentativeRole || 'Okul Müdürü'} - ${draft.qualityTeam.legalRepresentativeEmail || 'E-posta belirtilmedi'})`,
    },
    {
      id: 'df-coordinator',
      category: 'Temel Bilgiler',
      label: 'Proje Koordinatörü / İrtibat Kişisi (Contact Person)',
      value: `${draft.qualityTeam.coordinatorName || 'Proje Koordinatörü'} (${draft.qualityTeam.coordinatorRole || 'Koordinatör'} - ${draft.qualityTeam.coordinatorEmail || 'E-posta belirtilmedi'})`,
    },
  ];

  // Kategoriler (Temel Bilgiler + Anlatısal Sorular)
  const narrativeCategories = Array.from(new Set(answers.map((a) => a.category)));
  const allCategories = ['Temel Bilgiler', ...narrativeCategories];

  const handleCopySingle = async (id: string, text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleAnswerChange = (id: string, newText: string) => {
    const updated = answers.map((item) =>
      item.id === id ? { ...item, answer: newText } : item,
    );
    onChangeAnswers(updated);
  };

  const [generateProgress, setGenerateProgress] = useState<{ current: number; total: number } | null>(null);
  const stopRequestedRef = React.useRef(false);

  // Toplu Üretim (Soruları Sırayla Üreterek Ekrana Canlı Doldurur)
  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    setErrorMessage(null);
    stopRequestedRef.current = false;

    let currentAnswers = [...answers];
    let successCount = 0;

    try {
      for (let i = 0; i < defaultQuestions.length; i++) {
        if (stopRequestedRef.current) break;
        const q = defaultQuestions[i];
        setGenerateProgress({ current: i + 1, total: defaultQuestions.length });
        setGeneratingQuestionId(q.id);

        try {
          const res = await fetch('/api/generate-draft-narrative', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              draft: { ...draft, generatedAnswers: currentAnswers },
              schoolProfile,
              questionId: q.id,
            }),
          });

          const data = await res.json();
          if (res.ok && data.answers) {
            currentAnswers = data.answers;
            onChangeAnswers(currentAnswers);
            successCount++;
          } else if (data.error) {
            console.warn(`Question ${q.code} warning:`, data.error);
          }
        } catch (itemErr) {
          console.error(`Error generating question ${q.code}:`, itemErr);
        }
      }

      if (successCount > 0) {
        setShowSuccessBanner(true);
        showToast(`${successCount} / ${defaultQuestions.length} soru yanıtı başarıyla üretildi.`);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Üretim sırasında bir bağlantı hatası oluştu.');
    } finally {
      setIsGeneratingAll(false);
      setGeneratingQuestionId(null);
      setGenerateProgress(null);
    }
  };

  const handleStopGeneration = () => {
    stopRequestedRef.current = true;
    showToast('Üretim durduruldu.');
  };

  // Tekil Soru Üretimi
  const handleGenerateSingle = async (questionId: string) => {
    setGeneratingQuestionId(questionId);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/generate-draft-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          draft,
          schoolProfile,
          questionId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Soru yanıtı üretilemedi.');
      }

      if (data.answers) {
        onChangeAnswers(data.answers);
        showToast('Soru yanıtı güncellendi.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Bağlantı hatası oluştu.');
    } finally {
      setGeneratingQuestionId(null);
    }
  };

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Tüm Formu (Parametreler + Kompozisyon Yanıtları) Tek Dosyada İndir
  const handleExportTxt = () => {
    let content = `============================================================\n`;
    content += `OFFICIAL ERASMUS+ ${draft.formType} VET APPLICATION PROPOSAL & GUIDE\n`;
    content += `Generated on: ${new Date().toISOString()}\n`;
    content += `Applicant: ${draft.context.applicantName || schoolProfile?.schoolName || 'VET School'} (OID: ${draft.context.applicantOid || schoolProfile?.oid || 'N/A'})\n`;
    content += `Project: ${draft.context.projectTitle || 'Erasmus+ VET Project'} (${draft.context.projectAcronym || 'VET-MOBILITY'})\n`;
    content += `============================================================\n\n`;

    content += `*DISCLAIMER: This document serves as a structured draft and guidance model aligned with the European Commission Guide for Experts on Quality Assessment. Verify all institutional figures and operational data before final submission on the official EU portal.*\n\n`;

    content += `SECTION 0: DIRECT APPLICATION PARAMETERS (COPY DIRECTLY INTO FORM)\n`;
    content += `------------------------------------------------------------\n`;
    directFields.forEach((df) => {
      content += `${df.label}\n=> ${df.value}\n\n`;
    });

    content += `\nSECTION 1: OFFICIAL APPLICATION QUESTIONS & HIGH-SCORING ENGLISH NARRATIVE ANSWERS\n`;
    content += `------------------------------------------------------------\n`;
    answers.forEach((q) => {
      content += `CATEGORY: ${q.categoryEn || q.category}\n`;
      content += `QUESTION (EN): ${q.questionEn || q.question}\n`;
      if (q.question && q.questionEn !== q.question) {
        content += `QUESTION (TR): ${q.question}\n`;
      }
      if (q.evaluatorCriteria) {
        content += `EVALUATOR CRITERIA: ${q.evaluatorCriteria}\n`;
      }
      content += `\nOFFICIAL NARRATIVE ANSWER (ENGLISH):\n${q.answer || '(No answer generated yet. Click "Yapay Zeka Yanıtları Üret" in the dashboard.)'}\n\n`;
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
    showToast('Tam başvuru dosyası (İngilizce) indirildi.');
  };

  const answeredCount = answers.filter((a) => a.answer && a.answer.trim().length > 10).length;

  const showDirectFields =
    activeCategory === 'ALL' || activeCategory === 'Temel Bilgiler';
  const showNarrativeFields = activeCategory !== 'Temel Bilgiler';

  const filteredNarrativeAnswers =
    activeCategory === 'ALL'
      ? answers
      : answers.filter((a) => a.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* 1. Zorunlu Taslak / Örnek Mahiyeti Bildirimi */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-950 flex items-start gap-3 shadow-xs">
        <span className="text-xl leading-none">⚠️</span>
        <div className="space-y-1">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
            Resmi Form Doldurma Rehberi (Örnek Taslak Uyarısı)
          </h4>
          <p className="text-xs text-amber-800 leading-relaxed">
            Bu ekrandaki tüm alanlar ve soru yanıtları, resmi Avrupa Komisyonu Erasmus+ başvuru formunu doldururken 
            kurumunuza <strong>rehberlik etmek amacıyla oluşturulmuş örnek taslaklardır</strong>. 
            Ulusal Ajans'a resmi başvuru yapılmadan önce her alanı inceleyiniz ve okulunuzun gerçek verilerine göre doğrulayınız.
          </p>
        </div>
      </div>

      {/* 2. Üst Kontrol Çubuğu */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              Resmi Başvuru Formu Dosyası
            </h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {directFields.length} Temel Alan + {answeredCount} / {answers.length} Soru
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Resmi forma kopyalayacağınız temel kurum/proje bilgileri ve kompozisyon soruları tek bir derli toplu rehberdedir.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExportTxt}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 transition-colors"
          >
            Metin Olarak İndir
          </button>

          {isGeneratingAll && (
            <button
              type="button"
              onClick={handleStopGeneration}
              className="px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
              title="Üretimi durdur"
            >
              Durdur
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
                <span>Üretiliyor ({generateProgress.current}/{generateProgress.total})...</span>
              </>
            ) : (
              <span>Yapay Zeka Yanıtları Üret</span>
            )}
          </button>
        </div>
      </div>

      {/* Başarı Bildirimi (Tüm Sorular Üretildiğinde) */}
      {showSuccessBanner && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 text-emerald-950 flex items-start justify-between gap-3 shadow-xs animate-in fade-in duration-300">
          <div className="flex items-start gap-3">
            <span className="text-xl leading-none">✅</span>
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                Yapay Zeka Yanıtları Başarıyla Üretildi
              </h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Tüm sorular için Avrupa Komisyonu değerlendirme kriterlerine uygun resmi İngilizce yanıtlar üretildi.
                Yanıtları doğrudan inceleyebilir, düzenleyebilir veya tek tıkla kopyalayıp resmi formdaki kutucuklara yapıştırabilirsiniz.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowSuccessBanner(false)}
            className="text-emerald-700 hover:text-emerald-900 font-bold text-sm px-1.5 py-0.5"
            title="Kapat"
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
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveCategory('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
            activeCategory === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          Tüm Form ({directFields.length + answers.length})
        </button>

        {allCategories.map((cat) => {
          const isDirect = cat === 'Temel Bilgiler';
          const count = isDirect
            ? directFields.length
            : answers.filter((a) => a.category === cat).length;
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

      {/* 4. DOĞRUDAN FORM ALANLARI (Okul Adı, OID, Proje, Tarih, Katılımcı) */}
      {showDirectFields && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <span>🏛️</span>
              <span>Temel Başvuru Bilgileri</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Resmi formdaki kutucuklara doğrudan yapıştırılabilir
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
                    title="Bu alanı panoya kopyala"
                  >
                    {isCopied ? '✓ Kopyalandı' : 'Kopyala'}
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
                <span>Resmi Form Soruları ve Yanıtları</span>
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
                        {item.categoryEn || item.category}
                      </span>
                    </div>

                    {/* Resmi İngilizce Soru Başlığı */}
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {item.questionEn || item.question}
                    </h4>

                    {/* Türkçe Çeviri / Açıklama */}
                    {item.questionEn && item.question && item.questionEn !== item.question && (
                      <p className="text-[11px] text-slate-500 italic">
                        TR: {item.question}
                      </p>
                    )}

                    {/* Avrupa Komisyonu Değerlendirici Kriteri (Award Criteria) */}
                    {item.evaluatorCriteria && (
                      <div className="mt-2 p-2.5 rounded-lg bg-blue-50/70 border border-blue-100/90 text-[11px] text-blue-900 flex items-start gap-2">
                        <span className="font-bold shrink-0">🎯 Değerlendirici Kriteri (Award Criteria):</span>
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
                      {isGeneratingThis ? 'Üretiliyor...' : 'Yeniden Üret'}
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
                          <span>Kopyalandı</span>
                        </>
                      ) : (
                        <span>Kopyala</span>
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
                    placeholder="Bu soru için resmi İngilizce kompozisyon metni üretilir. 'Yeniden Üret' veya yukarıdaki 'Yapay Zeka Yanıtları Üret' butonuna tıklayarak Avrupa Komisyonu değerlendirme standartlarına uygun İngilizce yanıt oluşturabilir ya da doğrudan metin yazabilirsiniz..."
                    className="w-full text-xs sm:text-sm text-slate-800 bg-slate-50/50 border border-slate-200 rounded-lg p-3.5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all font-sans leading-relaxed resize-y"
                  />

                  {/* Karakter Sayacı ve Bilgilendirme */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>
                      {item.lastGeneratedAt ? (
                        <>Son güncelleme: {new Date(item.lastGeneratedAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</>
                      ) : (
                        'Düzenlenebilir taslak alan'
                      )}
                    </span>
                    <span className={currentLength > item.charLimit ? 'text-red-500 font-bold' : ''}>
                      {currentLength.toLocaleString()} / {item.charLimit.toLocaleString()} karakter
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Başarı Bildirimi */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg border border-slate-800 animate-in fade-in duration-200">
          {successToast}
        </div>
      )}
    </div>
  );
}
