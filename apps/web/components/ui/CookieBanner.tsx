'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';

export interface CookieBannerProps {
  onManagePreferences: () => void;
}

export default function CookieBanner({ onManagePreferences }: CookieBannerProps) {
  const { locale, t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a cookie choice
    const saved = localStorage.getItem('cappinno_cookie_consent');
    if (!saved) {
      // Show banner after a slight hydration delay
      const timer = setTimeout(() => setIsVisible(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cappinno_cookie_consent', 'ALL');
    localStorage.setItem(
      'cappinno_cookie_prefs',
      JSON.stringify({ necessary: true, functional: true, analytics: true })
    );
    setIsVisible(false);
  };

  const handleRejectAll = () => {
    localStorage.setItem('cappinno_cookie_consent', 'NECESSARY');
    localStorage.setItem(
      'cappinno_cookie_prefs',
      JSON.stringify({ necessary: true, functional: false, analytics: false })
    );
    setIsVisible(false);
  };

  const handleManage = () => {
    onManagePreferences();
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label={locale === 'tr' ? 'Çerez ve Gizlilik Tercihleri' : 'Cookie & Privacy Preferences'}
      className="fixed bottom-0 inset-x-0 z-40 p-3 sm:p-4 bg-white border-t-2 border-slate-300 shadow-2xl animate-fadeIn"
    >
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Information text */}
        <div className="flex items-start gap-3 max-w-4xl">
          <div className="p-2 rounded-xl bg-slate-100 text-slate-800 border border-slate-300 shrink-0 text-lg">
            🍪
          </div>
          <div className="space-y-1">
            <h4 className="text-xs sm:text-sm font-extrabold text-slate-950 m-0">
              {locale === 'tr' ? 'Gizlilik Tercihlerinizi Siz Yönetin' : 'You Control Your Privacy Preferences'}
            </h4>
            <p className="text-xs text-slate-600 m-0 leading-relaxed font-normal">
              {locale === 'tr'
                ? 'Platformumuzun güvenli ve kesintisiz çalışması için zorunlu teknik çerezleri kullanıyoruz. Deneyimi geliştiren analitik ve işlevsel çerezleri yalnızca tercihiniz doğrultusunda çalıştırırız. Tercihlerinizi dilediğiniz zaman alt bilgideki bağlantıdan güncelleyebilirsiniz.'
                : 'We use strictly necessary technical cookies to operate the platform securely. Optional functional and analytics cookies are deployed only with your permission. You can review or adjust your preferences at any time.'}
            </p>
          </div>
        </div>

        {/* Action Buttons (Equal Visual Weight, Flat Corporate, Accessible) */}
        <div className="flex items-center gap-2 sm:gap-2.5 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            onClick={handleRejectAll}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors shadow-2xs text-center"
          >
            {locale === 'tr' ? 'Tümünü Reddet' : 'Reject All'}
          </button>

          <button
            type="button"
            onClick={handleManage}
            className="flex-1 sm:flex-none px-3 sm:px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 transition-colors shadow-2xs text-center"
          >
            {locale === 'tr' ? 'Tercihleri Yönet' : 'Manage Preferences'}
          </button>

          <button
            type="button"
            onClick={handleAcceptAll}
            className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs text-center"
          >
            {locale === 'tr' ? 'Tümünü Kabul Et' : 'Accept All'}
          </button>
        </div>
      </div>
    </aside>
  );
}
