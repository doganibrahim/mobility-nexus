'use client';

import React, { useState } from 'react';
import { SignInButton, SignUpButton, Show, UserButton } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import ErasmusResultsWidget from '../ui/ErasmusResultsWidget';
import MebSchoolsWidget from '../ui/MebSchoolsWidget';

import Link from 'next/link';
import { useAppStore } from '../../lib/store';

export default function AppHeader() {
  const { locale, setLocale, t } = useTranslation();
  const { themeConfig } = useTheme();
  const { currentOrg, currentHost, orgType, userRole, isOnboarded } = useAppStore();
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const [isMebWidgetOpen, setIsMebWidgetOpen] = useState(false);

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

        {/* Action Controls: Language Switcher and Tools */}
        <div className="flex items-center gap-3 self-end md:self-auto flex-wrap">

          {/* MEB Okulları Button */}
          <button
            onClick={() => setIsMebWidgetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
            Tüm Meslek Liseleri
          </button>

          {/* Hibe Sonuçları Button */}
          <button
            onClick={() => setIsWidgetOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-xs"
          >
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            2026 Hibe Sonuçlarını İncele
          </button>

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

          {/* Clerk Auth Controls */}
          <div className="flex items-center gap-2 ml-1 border-l border-slate-200 pl-3">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">
                  Giriş Yap
                </button>
              </SignInButton>
              <SignUpButton
                mode="modal"
                fallbackRedirectUrl="/onboarding"
                forceRedirectUrl="/onboarding"
              >
                <button className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs">
                  Ücretsiz Kayıt Ol
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <div className="flex items-center gap-2">
                {isOnboarded && (currentOrg || currentHost) ? (
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-slate-50 text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition-colors shadow-2xs"
                    title="Kurum Profilini ve Detaylarını Gör"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="font-bold">
                      {orgType === 'HOST'
                        ? (currentHost?.name?.length > 22 ? currentHost.name.slice(0, 20) + '...' : currentHost?.name)
                        : (currentOrg?.name?.length > 22 ? currentOrg.name.slice(0, 20) + '...' : currentOrg?.name)}
                    </span>
                    <span className="text-[10px] bg-slate-200/80 text-slate-700 px-1.5 py-0.5 rounded font-medium hidden md:inline">
                      {orgType === 'HOST' ? 'Ev Sahibi Kurum' : (userRole === 'ORG_ADMIN' ? 'Okul Yöneticisi' : 'Ekip Üyesi')}
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-900 bg-amber-50 border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors shadow-2xs"
                  >
                    <span>Kurulumu Tamamla</span>
                  </Link>
                )}
                <UserButton />
              </div>
            </Show>
          </div>
        </div>
      </div>

      <ErasmusResultsWidget isOpen={isWidgetOpen} onClose={() => setIsWidgetOpen(false)} />
      <MebSchoolsWidget isOpen={isMebWidgetOpen} onClose={() => setIsMebWidgetOpen(false)} />
    </header>
  );
}
