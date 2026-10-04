'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility, FontSizeOption } from '@/lib/accessibility-context';
import { useTranslation } from '@/lib/i18n';
import {
  Type,
  Eye,
  RotateCcw,
  Sparkles,
  Check,
  ZapOff,
  Underline,
  SunMoon,
} from 'lucide-react';

export function DisplaySettingsDropdown() {
  const {
    fontSize,
    highContrast,
    underlineLinks,
    reducedMotion,
    setFontSize,
    setHighContrast,
    setUnderlineLinks,
    setReducedMotion,
    resetToDefault,
  } = useAccessibility();

  const { locale } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside and ESC key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const hasCustomSettings =
    fontSize !== 'normal' || highContrast || underlineLinks || reducedMotion;

  return (
    <div ref={containerRef} className="relative inline-block text-left z-40">
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={locale === 'tr' ? 'Görünüm ve Okuma Ayarları' : 'Display & Reading Settings'}
        title={locale === 'tr' ? 'Görünüm ve Okuma Ayarları' : 'Display & Reading Settings'}
        className={`inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border shadow-2xs focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden cursor-pointer shrink-0 ${
          hasCustomSettings
            ? 'bg-blue-50 text-blue-900 border-blue-300 font-bold'
            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
        }`}
      >
        <Type className="w-3.5 h-3.5 text-blue-700 shrink-0" aria-hidden="true" />
        <span className="hidden 2xl:inline">
          {locale === 'tr' ? 'Görünüm & Okuma' : 'Display & Reading'}
        </span>
        {hasCustomSettings && (
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" title={locale === 'tr' ? 'Özelleştirildi' : 'Customized'} />
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={locale === 'tr' ? 'Görünüm ve Okuma Ayarları Paneli' : 'Display & Reading Preferences'}
          className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-slate-200 shadow-2xl p-4 z-50 text-slate-800 animate-fadeIn space-y-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-md bg-blue-100 text-blue-800">
                <Type className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Görünüm & Okuma Tercihleri' : 'Display & Reading Options'}
                </h3>
                <p className="text-[10px] text-slate-500 m-0">
                  {locale === 'tr' ? 'Kişisel görsel ve okuma konforu' : 'Personal visual comfort'}
                </p>
              </div>
            </div>

            {hasCustomSettings && (
              <button
                type="button"
                onClick={resetToDefault}
                className="text-[10px] text-slate-500 hover:text-blue-700 font-bold flex items-center gap-1 p-1 rounded-md hover:bg-slate-100 transition-colors"
                title={locale === 'tr' ? 'Varsayılana Sıfırla' : 'Reset to Defaults'}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{locale === 'tr' ? 'Sıfırla' : 'Reset'}</span>
              </button>
            )}
          </div>

          {/* Warm Erasmus+ Inclusion Banner */}
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-50/90 to-indigo-50/90 border border-blue-100/90 text-slate-700 text-[11px] leading-relaxed flex items-start gap-2">
            <span className="text-sm shrink-0">🇪🇺</span>
            <div className="space-y-0.5">
              <span className="font-bold text-blue-950 block text-[11px]">
                {locale === 'tr'
                  ? 'Erasmus+ Kapsayıcılık & Çeşitlilik İlkeleri'
                  : 'Erasmus+ Inclusion & Diversity Priority'}
              </span>
              <p className="m-0 text-[10px] text-slate-600 leading-tight">
                {locale === 'tr'
                  ? 'Platformu kendi okuma, kontrast ve gezinme konforunuza göre özgürce ayarlayabilirsiniz. Tercihleriniz bu tarayıcıda saklanır.'
                  : 'Freely customize the platform to suit your reading, contrast, and navigation preferences. Your settings are preserved in this browser.'}
              </p>
            </div>
          </div>

          {/* 1. Font Size Scaling */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-800 flex items-center justify-between">
              <span>{locale === 'tr' ? 'Yazı Boyutu' : 'Text Size'}</span>
              <span className="text-[10px] text-slate-500 font-normal">
                {fontSize === 'normal'
                  ? locale === 'tr' ? 'Standart (%100)' : 'Standard (100%)'
                  : fontSize === 'large'
                  ? locale === 'tr' ? 'Büyük (%115)' : 'Large (115%)'
                  : locale === 'tr' ? 'Ekstra Büyük (%130)' : 'Extra Large (130%)'}
              </span>
            </label>

            <div className="grid grid-cols-3 gap-2">
              {(['normal', 'large', 'xlarge'] as FontSizeOption[]).map((size) => {
                const isSelected = fontSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFontSize(size)}
                    className={`py-2 px-2.5 rounded-xl border text-center transition-all flex items-center justify-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-700 text-white border-blue-700 font-bold shadow-xs'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <span className={size === 'normal' ? 'text-xs' : size === 'large' ? 'text-sm font-bold' : 'text-base font-black'}>
                      A
                    </span>
                    <span className="text-[10px]">
                      {size === 'normal' ? '100%' : size === 'large' ? '+15%' : '+30%'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. High Contrast Mode Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setHighContrast(!highContrast)}
              className={`w-full p-2.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                highContrast
                  ? 'bg-slate-950 text-white border-slate-900 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <SunMoon className={`w-4 h-4 ${highContrast ? 'text-amber-400' : 'text-slate-600'}`} />
                <div>
                  <div className="text-xs font-bold">
                    {locale === 'tr' ? 'Yüksek Kontrast Modu' : 'High Contrast Mode'}
                  </div>
                  <div className={`text-[10px] ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>
                    {locale === 'tr' ? 'Keskin ve belirgin renk düzeni' : 'Crisp and distinct color borders'}
                  </div>
                </div>
              </div>

              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  highContrast ? 'bg-amber-400' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    highContrast ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* 3. Underline Links Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setUnderlineLinks(!underlineLinks)}
              className={`w-full p-2.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                underlineLinks
                  ? 'bg-blue-50 text-blue-950 border-blue-300 shadow-2xs font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Underline className="w-4 h-4 text-blue-700" />
                <div>
                  <div className="text-xs font-bold">
                    {locale === 'tr' ? 'Bağlantıların Altını Çiz' : 'Underline All Links'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {locale === 'tr' ? 'Tıklanabilir linkleri daima belirgin yap' : 'Visually distinguish interactive links'}
                  </div>
                </div>
              </div>

              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  underlineLinks ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    underlineLinks ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>

          {/* 4. Reduced Motion Toggle */}
          <div>
            <button
              type="button"
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`w-full p-2.5 rounded-xl border transition-all flex items-center justify-between text-left cursor-pointer ${
                reducedMotion
                  ? 'bg-blue-50 text-blue-950 border-blue-300 shadow-2xs font-semibold'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <ZapOff className="w-4 h-4 text-blue-700" />
                <div>
                  <div className="text-xs font-bold">
                    {locale === 'tr' ? 'Hareketi Azalt' : 'Reduce Motion'}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {locale === 'tr' ? 'Animasyon ve görsel geçişleri durdur' : 'Disable animations and transitions'}
                  </div>
                </div>
              </div>

              <div
                className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                  reducedMotion ? 'bg-blue-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    reducedMotion ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
