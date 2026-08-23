'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { useTranslation } from '../../lib/i18n';

export default function SystemKpiCard() {
  const { t } = useTranslation();

  return (
    <NeoCard
      id="system-kpi"
      title={t.system.title}
      badge="Erasmus+ VET Modeli"
      badgeType="primary"
    >
      <div className="space-y-6">
        {/* 4-Step Process Pipeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-700">
                  Aşama 1
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                  1
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1.5">
                {t.system.step1Title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {t.system.step1Desc}
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200/60 text-[11px] font-medium text-slate-500">
              Çıktı: Kurum Profili & OID
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-700">
                  Aşama 2
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1.5">
                {t.system.step2Title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {t.system.step2Desc}
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200/60 text-[11px] font-medium text-slate-500">
              Çıktı: ESCO Eşleştirmesi & Boşluk
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-700">
                  Aşama 3
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                  3
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1.5">
                {t.system.step3Title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {t.system.step3Desc}
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200/60 text-[11px] font-medium text-slate-500">
              Çıktı: KA121 / KA122 Kararı
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:shadow-sm transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-blue-700">
                  Aşama 4
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                  4
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mb-1.5">
                {t.system.step4Title}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {t.system.step4Desc}
              </p>
            </div>
            <div className="mt-4 pt-2.5 border-t border-slate-200/60 text-[11px] font-medium text-slate-500">
              Çıktı: Başvuru Dosyası & PDF
            </div>
          </div>
        </div>

        {/* Warm Informative Notice Box */}
        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 leading-relaxed flex items-start gap-3">
          <span className="text-base leading-none">ℹ️</span>
          <div>
            <strong className="font-bold">{t.system.disclaimer.split(':')[0]}:</strong>{' '}
            <span className="text-amber-800">{t.system.disclaimer.split(':')[1]}</span>
          </div>
        </div>
      </div>
    </NeoCard>
  );
}
