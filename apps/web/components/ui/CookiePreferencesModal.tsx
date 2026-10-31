'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';

export interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
}

export interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (prefs: CookiePreferences) => void;
  onOpenPolicy?: () => void;
}

export default function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
  onOpenPolicy,
}: CookiePreferencesModalProps) {
  const { locale } = useTranslation();

  // All non-essential categories default to TRUE (enabled as requested)
  const [functional, setFunctional] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  // Sync state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem('em_cookie_prefs');
        if (raw) {
          const parsed = JSON.parse(raw);
          // If already saved, reflect previous user choices; otherwise default to true
          setFunctional(parsed.functional !== undefined ? Boolean(parsed.functional) : true);
          setAnalytics(parsed.analytics !== undefined ? Boolean(parsed.analytics) : true);
        } else {
          // If no previous preferences, default all to true (as requested)
          setFunctional(true);
          setAnalytics(true);
        }
      } catch {
        setFunctional(true);
        setAnalytics(true);
      }
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const commitPreferences = (functionalVal: boolean, analyticsVal: boolean) => {
    const prefs: CookiePreferences = {
      necessary: true,
      functional: functionalVal,
      analytics: analyticsVal,
    };

    localStorage.setItem('em_cookie_prefs', JSON.stringify(prefs));

    let consentTag = 'CUSTOM';
    if (functionalVal && analyticsVal) consentTag = 'ALL';
    else if (!functionalVal && !analyticsVal) consentTag = 'NECESSARY';

    localStorage.setItem('em_cookie_consent', consentTag);

    // Broadcast change so CookieBanner and any active trackers immediately sync
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('cookie-consent-updated', {
          detail: { ...prefs, consentTag },
        })
      );
    }

    if (onSave) onSave(prefs);
    onClose();
  };

  const handleSaveSelected = () => {
    commitPreferences(functional, analytics);
  };

  const handleAcceptAll = () => {
    setFunctional(true);
    setAnalytics(true);
    commitPreferences(true, true);
  };

  const handleRejectAll = () => {
    setFunctional(false);
    setAnalytics(false);
    commitPreferences(false, false);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-fadeIn"
      aria-labelledby="cookie-preferences-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Window */}
        <div className="relative z-10 inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 w-full sm:max-w-2xl sm:align-middle border-2 border-slate-300">
          {/* Header */}
          <div className="bg-white px-5 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2.5 rounded-xl text-blue-700 border border-blue-200 shrink-0 text-xl">
                🍪
              </div>
              <div>
                <h3
                  id="cookie-preferences-title"
                  className="text-base sm:text-lg font-extrabold text-slate-950 tracking-tight m-0"
                >
                  {locale === 'tr' ? 'Çerez ve Gizlilik Tercihleri' : 'Cookie & Privacy Preferences'}
                </h3>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  {locale === 'tr'
                    ? 'Kişiselleştirilmiş platform deneyiminizi ve gizlilik ayarlarınızı yönetin'
                    : 'Manage your personalized platform experience and privacy settings'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200 cursor-pointer"
              onClick={onClose}
              title={locale === 'tr' ? 'Kapat' : 'Close'}
              aria-label={locale === 'tr' ? 'Kapat' : 'Close'}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Informational callout */}
          <div className="px-5 sm:px-6 pt-4 pb-1">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex items-start gap-2.5">
              <span className="text-blue-700 text-sm mt-0.5">ℹ️</span>
              <p className="text-xs text-blue-950 m-0 leading-relaxed font-normal">
                {locale === 'tr'
                  ? 'Platformumuzdan en yüksek verim ve performansı alabilmeniz için tercihe bağlı çerezler varsayılan olarak açık sunulmaktadır. Dilediğiniz kategoriyi kapatabilir veya tümünü reddedebilirsiniz.'
                  : 'Optional cookies are pre-selected to provide optimal platform performance and localization. You may toggle off any category or reject all optional cookies below.'}
              </p>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-5 sm:px-6 space-y-3.5 max-h-[60vh] overflow-y-auto">
            {/* Category 1: Strictly Necessary */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 sm:max-w-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">🔒</span>
                  <span className="font-extrabold text-xs text-slate-900">
                    {locale === 'tr' ? 'Zorunlu ve Güvenlik Çerezleri' : 'Strictly Necessary Cookies'}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {locale === 'tr' ? 'Her Zaman Aktif' : 'Always Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 m-0 leading-relaxed font-normal">
                  {locale === 'tr'
                    ? 'Platformun temel çalışması, güvenli oturum açma (Clerk Auth), CSRF koruması ve veri güvenliği için teknik olarak zorunludur. Kapatılamaz.'
                    : 'Essential for secure platform operations, user authentication (Clerk Auth), CSRF defense, and data protection. Cannot be disabled.'}
                </p>
                <div className="text-[10px] font-mono text-slate-600 pt-0.5">
                  {locale === 'tr' ? 'Kullanılan: ' : 'Used: '}
                  <span className="text-slate-700 font-semibold">__session, __client_uat</span>
                </div>
              </div>

              {/* Locked Toggle */}
              <div className="shrink-0 self-end sm:self-center">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-200 text-slate-600 border border-slate-300 cursor-not-allowed select-none"
                  title={locale === 'tr' ? 'Zorunlu çerezler devre dışı bırakılamaz' : 'Strictly necessary cookies cannot be disabled'}
                >
                  <svg className="w-3.5 h-3.5 text-slate-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{locale === 'tr' ? 'Zorunlu' : 'Required'}</span>
                </span>
              </div>
            </div>

            {/* Category 2: Functional */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 sm:max-w-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">🌐</span>
                  <span className="font-extrabold text-xs text-slate-900">
                    {locale === 'tr' ? 'İşlevsel ve Tercih Çerezleri' : 'Functional & Preference Cookies'}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                    {locale === 'tr' ? 'Tercihe Bağlı' : 'Optional'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 m-0 leading-relaxed font-normal">
                  {locale === 'tr'
                    ? 'Seçtiğiniz arayüz dili (Türkçe / İngilizce), görsel tema ve form taslak tercihlerini hatırlayarak deneyiminizi kolaylaştırır.'
                    : 'Remembers language preference (Turkish / English), display themes, and draft settings for seamless user experience.'}
                </p>
                <div className="text-[10px] font-mono text-slate-600 pt-0.5">
                  {locale === 'tr' ? 'Kullanılan: ' : 'Used: '}
                  <span className="text-slate-700 font-semibold">em_locale, em_cookie_prefs</span>
                </div>
              </div>

              {/* Interactive Toggle */}
              <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={functional}
                  onClick={() => setFunctional(!functional)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    functional ? 'bg-blue-700' : 'bg-slate-300'
                  }`}
                  aria-label={locale === 'tr' ? 'İşlevsel çerezleri aç veya kapat' : 'Toggle functional cookies'}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      functional ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-800 w-12 text-left">
                  {functional ? (locale === 'tr' ? 'Açık' : 'Active') : (locale === 'tr' ? 'Kapalı' : 'Off')}
                </span>
              </div>
            </div>

            {/* Category 3: Analytics */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1 sm:max-w-md">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">📊</span>
                  <span className="font-extrabold text-xs text-slate-900">
                    {locale === 'tr' ? 'Analitik ve Performans Çerezleri' : 'Analytics & Performance Cookies'}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                    {locale === 'tr' ? 'Tercihe Bağlı' : 'Optional'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 m-0 leading-relaxed font-normal">
                  {locale === 'tr'
                    ? 'Sayfa yükleme hızları, sunucu yanıt performansı ve platform işleyişini anonim telemetri verileriyle iyileştirmemizi sağlar. Ticari profil oluşturmaz.'
                    : 'Helps us measure page speed and system efficiency using anonymous metrics. No commercial targeting or behavioral profiling is performed.'}
                </p>
                <div className="text-[10px] font-mono text-slate-600 pt-0.5">
                  {locale === 'tr' ? 'Kullanılan: ' : 'Used: '}
                  <span className="text-slate-700 font-semibold">em_analytics_perf</span>
                </div>
              </div>

              {/* Interactive Toggle */}
              <div className="shrink-0 self-end sm:self-center flex items-center gap-2">
                <button
                  type="button"
                  role="switch"
                  aria-checked={analytics}
                  onClick={() => setAnalytics(!analytics)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
                    analytics ? 'bg-blue-700' : 'bg-slate-300'
                  }`}
                  aria-label={locale === 'tr' ? 'Analitik çerezleri aç veya kapat' : 'Toggle analytics cookies'}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                      analytics ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs font-bold text-slate-800 w-12 text-left">
                  {analytics ? (locale === 'tr' ? 'Açık' : 'Active') : (locale === 'tr' ? 'Kapalı' : 'Off')}
                </span>
              </div>
            </div>
          </div>

          {/* Legal document link */}
          <div className="px-5 sm:px-6 py-2.5 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>
              {locale === 'tr'
                ? 'Haklarınız ve çerezlerin saklanma süreleri hakkında ayrıntılı bilgi:'
                : 'Detailed information regarding data retention and rights:'}
            </span>
            {onOpenPolicy ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenPolicy();
                }}
                className="font-bold text-blue-700 hover:text-blue-900 hover:underline cursor-pointer"
              >
                {locale === 'tr' ? 'Çerez Politikası Metni →' : 'Read Cookie Policy →'}
              </button>
            ) : (
              <a
                href="/cookies"
                className="font-bold text-blue-700 hover:text-blue-900 hover:underline"
              >
                {locale === 'tr' ? 'Çerez Politikası Metni →' : 'Read Cookie Policy →'}
              </a>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <button
              type="button"
              onClick={handleRejectAll}
              className="w-full sm:w-auto px-4 py-2 text-xs font-bold rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 transition-colors shadow-2xs text-center cursor-pointer"
            >
              {locale === 'tr' ? 'Tümünü Reddet' : 'Reject All'}
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveSelected}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl border border-blue-700 bg-white hover:bg-blue-50 text-blue-800 transition-colors shadow-2xs text-center cursor-pointer"
              >
                {locale === 'tr' ? 'Seçilenleri Kaydet' : 'Save Selected'}
              </button>

              <button
                type="button"
                onClick={handleAcceptAll}
                className="flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl bg-blue-700 hover:bg-blue-800 text-white transition-colors shadow-xs text-center cursor-pointer"
              >
                {locale === 'tr' ? 'Tümünü Kabul Et' : 'Accept All'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

