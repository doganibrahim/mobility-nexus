'use client';

import React from 'react';
import ThemeSwitcher from './ThemeSwitcher';
import FontSwitcher from './FontSwitcher';
import { useTranslation } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';

export default function AppHeader() {
  const { locale, setLocale, t } = useTranslation();
  const { themeConfig } = useTheme();

  return (
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Official EU Strip (Light & Crisp) */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-4 py-1.5 sm:px-6 text-xs text-slate-600 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span>🇪🇺</span>
            <span>Erasmus+ Programı • Mesleki Eğitim Hareketliliği Yönetim Sistemi</span>
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="text-slate-500 hidden sm:inline">
            KA121 / KA122 / ESCO & ISCED-F
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>2026 Çağrı Dönemi Aktif</span>
          </span>
        </div>
      </div>

      {/* Main Header Bar (Clean Light Background & Bold High-Contrast Text) */}
      <div className="max-w-[1440px] mx-auto px-4 py-3.5 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
        {/* Brand & Editorial Title */}
        <div className="flex items-center gap-3.5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg text-white shadow-xs shrink-0"
            style={{ backgroundColor: themeConfig.primary }}
          >
            C
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-950 m-0">
                {t.header.title}
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                {t.header.badge}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium m-0 mt-0.5 hidden sm:block">
              {t.header.subtitle}
            </p>
          </div>
        </div>

        {/* Action Controls: Theme Switcher, Font Switcher & Language Switcher */}
        <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
          {/* Color Theme Selector */}
          <ThemeSwitcher />

          {/* Typography Selector */}
          <FontSwitcher />

          {/* TR / EN Language Toggle */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200">
            <button
              type="button"
              onClick={() => setLocale('tr')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                locale === 'tr'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Türkçe"
            >
              🇹🇷 TR
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                locale === 'en'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              title="English"
            >
              🇬🇧 EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
