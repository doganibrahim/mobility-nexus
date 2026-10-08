'use client';

import React, { useState } from 'react';
import { useTheme } from '../../lib/theme-context';
import { useTranslation } from '../../lib/i18n';
import { THEMES } from '../../lib/constants';

export default function ThemeSwitcher() {
  const { theme, setTheme, themeConfig } = useTheme();
  const { locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={locale === 'tr' ? 'Renk Temasını Değiştir' : 'Change Color Theme'}
      >
        <span
          className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shadow-xs shrink-0"
          style={{ backgroundColor: themeConfig.primary }}
        />
        <span className="truncate max-w-[130px] font-semibold">
          {themeConfig.name.split(':')[1]?.trim() || themeConfig.name}
        </span>
        <span className="text-slate-400 text-[10px]">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-88 rounded-xl bg-white border border-slate-200 p-2.5 z-50 shadow-xl text-slate-800 animate-in fade-in zoom-in-95 duration-100">
            <div className="border-b border-slate-100 pb-2 mb-1.5 px-2">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>{locale === 'tr' ? '4 Orijinal Renk Paleti' : '4 Original Color Themes'}</span>
                <span className="text-[11px] font-semibold text-blue-700">{locale === 'tr' ? 'Tasarımcı Seçimi' : 'Designer Choice'}</span>
              </div>
              <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                {locale === 'tr' ? 'Spesifikasyona uygun 4 renk matrisi:' : '4 compliant color matrices:'}
              </p>
            </div>

            <div className="space-y-1.5">
              {Object.values(THEMES).map((t) => {
                const isSelected = t.id === theme;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/80 border border-blue-200 text-slate-900 font-bold'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className="flex gap-1 mt-1 shrink-0">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: t.primary }}
                        title={`${locale === 'tr' ? 'Birincil' : 'Primary'}: ${t.primary}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: t.secondary }}
                        title={`${locale === 'tr' ? 'İkincil' : 'Secondary'}: ${t.secondary}`}
                      />
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs"
                        style={{ backgroundColor: t.accent }}
                        title={`${locale === 'tr' ? 'Aksan' : 'Accent'}: ${t.accent}`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold flex items-center justify-between">
                        <span className="truncate">{t.name}</span>
                        {isSelected && (
                          <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-md font-semibold">
                            {locale === 'tr' ? 'Seçili' : 'Active'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        HEX: {t.primary} | {t.secondary} | {t.accent}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
