'use client';

import React, { useState } from 'react';
import { useTheme } from '../../lib/theme-context';
import { FONT_PRESETS } from '../../lib/constants';

export default function FontSwitcher() {
  const { font, setFont, fontPreset } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block text-left z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-300 shadow-xs transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Yazı Tipini Değiştir"
      >
        <span className="text-slate-500 text-xs">Aa</span>
        <span className="truncate max-w-[110px]">{fontPreset.name.split('&')[0].trim()}</span>
        <span className="text-slate-400 text-[10px]">▼</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-slate-200 p-2 z-50 shadow-xl text-slate-800 animate-in fade-in zoom-in-95 duration-100">
            <div className="border-b border-slate-100 pb-1.5 mb-1 px-2">
              <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                <span>Yazı Tipi Kombinasyonu</span>
                <span className="text-[11px] font-normal text-slate-500">5 Seçenek</span>
              </div>
            </div>

            <div className="space-y-1">
              {Object.values(FONT_PRESETS).map((f) => {
                const isSelected = f.id === font;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      setFont(f.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold">{f.name}</div>
                      <div className="text-[10px] text-slate-500">
                        Başlık: {f.heading} • Gövde: {f.body}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-blue-600 text-xs font-bold">✓</span>
                    )}
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
