'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';

import HeroContrastSection from './HeroContrastSection';
import InteractiveProcessStepper from './InteractiveProcessStepper';
import EuropeanRouteNetwork from './EuropeanRouteNetwork';

export interface DualActionGatewaysProps {
  onSelectSchoolDemo: () => void;
  onSelectHostDemo: () => void;
}

export default function DualActionGateways({
  onSelectSchoolDemo,
  onSelectHostDemo,
}: DualActionGatewaysProps) {
  const { locale } = useTranslation();

  return (
    <div className="space-y-10 animate-fadeIn">
      {/* 1. Above-The-Fold: Unified Dark Hero with Direct 2 Action Doors */}
      <HeroContrastSection
        onStartSchoolDemo={onSelectSchoolDemo}
        onStartHostDemo={onSelectHostDemo}
      />

      {/* 2. Exploration Section: 3-Step Interactive Process Stepper */}
      <InteractiveProcessStepper />

      {/* 3. Exploration Section: Pure Vector European Mobility Route Network */}
      <EuropeanRouteNetwork />

      {/* 4. Bottom Knowledge Strip: Platform Guide & Official Library */}
      <div className="bg-slate-100 rounded-2xl border border-slate-300 p-5 sm:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl shrink-0">📖</span>
          <div>
            <h3 className="text-sm font-black text-slate-900 m-0">
              {locale === 'tr' ? 'Detaylı Platform Kullanım Kılavuzu & Mevzuat' : 'Full Platform Manual & EU Guidelines'}
            </h3>
            <p className="text-xs text-slate-600 m-0 mt-0.5">
              {locale === 'tr'
                ? 'Tüm modüller, hibe hesaplama formülleri ve resmi prosedürler bağımsız kılavuz sayfasında derlenmiştir.'
                : 'All modules, grant calculation formulas and procedures are documented in the standalone guide.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap shrink-0 w-full md:w-auto">
          <Link
            href="/guide"
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📖</span>
            <span>{locale === 'tr' ? 'Kılavuzu Aç (10 Bölüm)' : 'Open User Guide'}</span>
            <span>→</span>
          </Link>
          <Link
            href="/library"
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-white hover:bg-slate-200/80 text-slate-800 font-bold text-xs border border-slate-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>📚</span>
            <span>{locale === 'tr' ? 'Resmi Şablonlar & Kütüphane' : 'Library & Templates'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
