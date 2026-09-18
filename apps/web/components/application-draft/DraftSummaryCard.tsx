'use client';

import React from 'react';
import {
  ApplicationDraftState,
  calculateDraftCompletion,
} from '../../lib/application-draft-schema';

interface DraftSummaryCardProps {
  draft: ApplicationDraftState;
  onResetDraft: () => void;
  onSyncPipeline?: () => void;
  onExportJson?: () => void;
  onGoToQuestions?: () => void;
}

const COUNTRY_MAP: Record<string, string> = {
  DE: 'Almanya',
  AT: 'Avusturya',
  ES: 'İspanya',
  IT: 'İtalya',
  PT: 'Portekiz',
  NL: 'Hollanda',
  FR: 'Fransa',
  BE: 'Belçika',
  PL: 'Polonya',
  CZ: 'Çekya',
};

export default function DraftSummaryCard({
  draft,
  onResetDraft,
}: DraftSummaryCardProps) {
  const isKa121 = draft.formType === 'KA121';
  const { overallPercentage } = calculateDraftCompletion(draft);

  const countryCode =
    draft.activityDetails.hostCountry ||
    draft.activityDetails.targetCountries?.[0] ||
    'DE';
  const countryLabel = COUNTRY_MAP[countryCode]
    ? `${COUNTRY_MAP[countryCode]} (${countryCode})`
    : countryCode;

  const accompanyingLabel = draft.activityDetails.accompanyingRequired
    ? `${draft.activityDetails.accompanyingCount} Öğretmen`
    : 'Gerekmiyor';

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        {/* Üst Başlık ve Sıfırla Aksiyonu */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
            BAŞVURU TASLAĞI DURUMU
          </span>

          <button
            type="button"
            onClick={onResetDraft}
            className="text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
            title="Taslak form verilerini sıfırla"
          >
            <span>🗑️</span>
            <span>Taslağı Sıfırla</span>
          </button>
        </div>

        {/* Proje / Form Başlığı ve Rozet */}
        <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
          <h2 className="text-sm font-bold text-slate-900 leading-normal">
            {isKa121
              ? '📑 KA121-VET Akredite Kurum Hibe Talebi'
              : '🚀 KA122-VET Kısa Dönemli Mesleki Hareketlilik'}
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
            {overallPercentage === 100 ? '✓ %100 Hazır' : `%{overallPercentage} Tamamlandı`}
          </span>
        </div>

        {/* İlerleme Çubuğu */}
        <div className="space-y-1.5 my-3.5">
          <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
            <span>Form Hazırlık Seviyesi</span>
            <span className="font-bold text-slate-700">%{overallPercentage}</span>
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
            Toplam Katılımcı
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {draft.activityDetails.totalParticipants} Kişi
          </strong>
        </div>

        <div className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium block">
            Faaliyet Süresi
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {draft.activityDetails.standardDurationDays} Gün
          </strong>
        </div>

        <div className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium block">
            Hedef Ülke
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {countryLabel}
          </strong>
        </div>

        <div className="p-2.5 bg-slate-50/90 border border-slate-100 rounded-lg">
          <span className="text-[10px] text-slate-500 font-medium block">
            Refakatçi
          </span>
          <strong className="text-slate-900 font-bold text-xs mt-0.5 block truncate">
            {accompanyingLabel}
          </strong>
        </div>
      </div>
    </div>
  );
}
