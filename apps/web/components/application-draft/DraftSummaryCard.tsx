'use client';

import React from 'react';
import {
  ApplicationDraftState,
  calculateDraftCompletion,
} from '../../lib/application-draft-schema';
import { getCountryFlagLabel } from '../../lib/countries';
import { useTranslation } from '../../lib/i18n';

interface DraftSummaryCardProps {
  draft: ApplicationDraftState;
  onResetDraft: () => void;
  onSyncPipeline?: () => void;
  onExportJson?: () => void;
  onGoToQuestions?: () => void;
}

export default function DraftSummaryCard({
  draft,
  onResetDraft,
}: DraftSummaryCardProps) {
  const { locale } = useTranslation();
  const isKa121 = draft.formType === 'KA121';
  const { overallPercentage } = calculateDraftCompletion(draft);

  const countryCode =
    draft.activityDetails.hostCountry ||
    draft.activityDetails.targetCountries?.[0] ||
    'DE';
  const countryLabel = getCountryFlagLabel(countryCode, locale) || countryCode;

  const accompanyingLabel = draft.activityDetails.accompanyingRequired
    ? `${draft.activityDetails.accompanyingCount} ${locale === 'tr' ? 'Öğretmen' : 'Staff'}`
    : (locale === 'tr' ? 'Gerekmiyor' : 'None');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Üst Başlık ve Sıfırla Aksiyonu */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            {locale === 'tr' ? 'BAŞVURU TASLAĞI DURUMU' : 'APPLICATION DRAFT STATUS'}
          </span>

          <button
            type="button"
            onClick={onResetDraft}
            className="text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            title={locale === 'tr' ? 'Taslak form verilerini sıfırla' : 'Reset draft form data'}
          >
            <span>🗑️</span>
            <span>{locale === 'tr' ? 'Taslağı Sıfırla' : 'Reset Draft'}</span>
          </button>
        </div>

        {/* Proje / Form Başlığı ve Rozet */}
        <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
          <h2 className="text-sm font-bold text-slate-900 leading-normal">
            {isKa121
              ? (locale === 'tr' ? '📑 KA121-VET Akredite Kurum Hibe Talebi' : '📑 KA121-VET Accredited Grant Allocation')
              : (locale === 'tr' ? '🚀 KA122-VET Kısa Dönemli Mesleki Hareketlilik' : '🚀 KA122-VET Short-term Mobility Project')}
          </h2>

          <span
            className={`text-xs px-2.5 py-0.5 rounded-full font-bold border transition-colors ${
              overallPercentage === 100
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : overallPercentage >= 50
                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {overallPercentage === 100
              ? (locale === 'tr' ? '✓ %100 Hazır' : '✓ 100% Ready')
              : (locale === 'tr' ? `%${overallPercentage} Tamamlandı` : `${overallPercentage}% Complete`)}
          </span>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="space-y-1.5 my-3.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>{locale === 'tr' ? 'Form Hazırlık Seviyesi' : 'Draft Readiness Level'}</span>
            <span className="font-bold text-slate-700">{locale === 'tr' ? `%${overallPercentage}` : `${overallPercentage}%`}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 transition-all duration-500 rounded-full ${
                overallPercentage === 100
                  ? 'bg-emerald-600'
                  : overallPercentage >= 50
                    ? 'bg-blue-600'
                    : 'bg-amber-500'
              }`}
              style={{ width: `${overallPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Hızlı Özet İstatistikleri (Kusursuz 4'lü Grid) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-slate-100 text-xs">
        <div className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium block">
            {locale === 'tr' ? 'Toplam Katılımcı' : 'Total Participants'}
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {draft.activityDetails.totalParticipants} {locale === 'tr' ? 'Kişi' : 'Pax'}
          </strong>
        </div>

        <div className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium block">
            {locale === 'tr' ? 'Faaliyet Süresi' : 'Duration'}
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {draft.activityDetails.standardDurationDays} {locale === 'tr' ? 'Gün' : 'Days'}
          </strong>
        </div>

        <div className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium block">
            {locale === 'tr' ? 'Hedef Ülke' : 'Destination'}
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {countryLabel}
          </strong>
        </div>

        <div className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium block">
            {locale === 'tr' ? 'Refakatçi' : 'Accompanying'}
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {accompanyingLabel}
          </strong>
        </div>
      </div>
    </div>
  );
}
