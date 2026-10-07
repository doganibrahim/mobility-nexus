'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import { useAppStore } from '../../lib/store';

import ProgrammesModal from '../ui/ProgrammesModal';
import BeneficiariesModal, { BeneficiaryCategory } from '../ui/BeneficiariesModal';
import ErasmusResultsWidget from '../ui/ErasmusResultsWidget';
import LegalModal, { LegalTabType } from '../ui/LegalModal';
import AdminVerificationQueueModal from '../admin/AdminVerificationQueueModal';
import AppointmentModal from '../ui/AppointmentModal';
import { DisplaySettingsDropdown } from './DisplaySettingsDropdown';

export default function AppHeader() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useTranslation();
  const isTr = locale === 'tr';
  const { themeConfig } = useTheme();
  const { currentOrg, currentHost, orgType, userRole } = useAppStore();
  const { user, isSignedIn } = useUser();

  // Modals state
  const [isProgrammesOpen, setIsProgrammesOpen] = useState(false);
  const [programmesTab, setProgrammesTab] = useState<'KA121' | 'KA122' | 'COMPARISON'>('COMPARISON');

  const [isBeneficiariesOpen, setIsBeneficiariesOpen] = useState(false);
  const [beneficiariesCategory, setBeneficiariesCategory] = useState<BeneficiaryCategory>('MESLEK_LISELERI');

  const [isHibeOpen, setIsHibeOpen] = useState(false);
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTabType>('LEGAL');
  const [isAdminQueueOpen, setIsAdminQueueOpen] = useState(false);
  const [isGuestTourOpen, setIsGuestTourOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  // Active Dropdown
  const [activeDropdown, setActiveDropdown] = useState<'PLATFORM' | 'LIBRARY' | 'NEWS' | 'CONTACT' | null>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Language Dropdown
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Mobile menu open state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click and Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        navContainerRef.current &&
        !navContainerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsLangDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Platform Admin verification check
  const adminEmails = (
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    'ibrahimdogan.js@gmail.com'
  )
    .toLowerCase()
    .split(',')
    .map((e) => e.trim());

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
  const userRoleMeta = (user?.publicMetadata?.role as string)?.toUpperCase();

  const isAdmin = Boolean(
    isSignedIn &&
    (userRoleMeta === 'SUPER_ADMIN' ||
      userRoleMeta === 'ADMIN' ||
      userRoleMeta === 'PLATFORM_ADMIN' ||
      user?.publicMetadata?.isAdmin === true ||
      (userEmail && adminEmails.includes(userEmail)))
  );

  return (
    <header role="banner" className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* WCAG 2.1 AA Keyboard Accessibility Skip Link */}
      <a
        href="#main-content"
        className="skip-to-content"
      >
        {locale === 'tr' ? 'Ana İçeriğe Atla (Klavye Odağı)' : 'Skip to main content (Keyboard Focus)'}
      </a>

      {/* Top EU-Standard Context Strip (Light & Crisp, Responsive) */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-3 py-1 sm:px-6 text-[11px] sm:text-xs text-slate-600 flex items-center justify-between flex-wrap gap-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span>🇪🇺</span>
            <span className="truncate max-w-[210px] sm:max-w-none">
              {locale === 'en' ? 'Erasmus+ VET Planning & Partner Network' : 'Erasmus+ Mesleki Eğitim Destek & Planlama Ağı'}
            </span>
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200/80 text-slate-700">
            {locale === 'en' ? 'Independent Support Platform' : 'Bağımsız Destek Platformu'}
          </span>
          <span className="text-slate-400 hidden md:inline">•</span>
          <span className="text-slate-500 hidden md:inline">
            KA121 / KA122 / ESCO & ISCED-F
          </span>
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            <span>
              {locale === 'tr'
                ? '2026 Projeleri: Uygulama Dönemi'
                : '2026 Projects: Implementation Phase'}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <span>
              {locale === 'tr'
                ? '2027 Çağrısı: Resmi Duyuru Bekleniyor'
                : '2027 Call: Awaiting Official Announcement'}
            </span>
          </span>
        </div>
      </div>

      {/* Main Single-Line Header Bar */}
      <div className="header-container max-w-[1440px] mx-auto px-3 sm:px-4 xl:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-2 xl:gap-3 2xl:gap-4">
        {/* 1. Left Brand Block (Official Branded Logo) */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src="/images/logo.png"
            alt="ErasmusMobility"
            className="h-8 sm:h-9 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
          <span className="hidden 2xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
            {locale === 'tr' ? 'Bağımsız Destek Portalı' : 'Support Portal'}
          </span>
        </Link>

        {/* 2. Center Nav Items (Single Line on Desktop, Fits xl/2xl) */}
        <nav
          ref={navContainerRef}
          role="navigation"
          aria-label={locale === 'tr' ? 'Ana Menü' : 'Main Menu'}
          className="header-nav hidden xl:flex items-center gap-0.5 2xl:gap-1.5 shrink min-w-0"
        >
          {/* 1. Home */}
          <Link
            href="/"
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${pathname === '/'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            title={t.header.nav.home}
            aria-label={t.header.nav.home}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
          </Link>

          {/* 2. Mobility Hub (with Dropdown) */}
          <div className="relative">
            <div
              className={`inline-flex items-stretch rounded-lg transition-all ${pathname === '/platform' || pathname.startsWith('/school')
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
            >
              <Link
                href="/platform"
                className={`px-2 2xl:px-2.5 py-1.5 text-xs font-bold rounded-l-lg transition-colors ${pathname === '/platform' || pathname.startsWith('/school')
                    ? 'hover:bg-slate-800 text-white'
                    : 'hover:bg-slate-200/60'
                  }`}
              >
                <span>{t.header.nav.platform.label}</span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'PLATFORM' ? null : 'PLATFORM')
                }
                className={`px-1.5 2xl:px-2 flex items-center justify-center rounded-r-lg transition-colors border-l cursor-pointer ${pathname === '/platform' || pathname.startsWith('/school')
                    ? 'border-slate-800 text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                aria-label={isTr ? 'Mobility Hub Alt Menü' : 'Mobility Hub submenu'}
                aria-expanded={activeDropdown === 'PLATFORM'}
                aria-controls="platform-dropdown-menu"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${activeDropdown === 'PLATFORM' ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {activeDropdown === 'PLATFORM' && (
              <div id="platform-dropdown-menu" className="absolute left-0 mt-2 w-88 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                {/* 1. Distinct Purpose Header */}
                <div className="p-3 bg-blue-50/60 border-b border-blue-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                      <span>⚡</span>
                      <span>{locale === 'tr' ? 'Mobility Hub Rolü & Amacı' : 'Mobility Hub Role & Purpose'}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-200/80 text-blue-900">
                      EMaaS
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug m-0">
                    {locale === 'tr'
                      ? 'Uçtan uca dijital hareketlilik planlama, akıllı ev sahibi eşleştirmesi ve resmi evrak ihracı operasyon merkezidir.'
                      : 'Operations hub for end-to-end digital mobility planning, smart host matching, and official dossier export.'}
                  </p>
                </div>

                {/* 2. Top 3 Most Searched Resources */}
                <div className="px-3 pt-2 pb-1 bg-slate-50/50">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{locale === 'tr' ? 'En Çok Aranan 3 Kaynak' : 'Top 3 Popular Resources'}</span>
                    </span>
                    <span className="text-[9px] font-bold text-blue-700">Hızlı Bağlantı</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/school/pipeline"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-900 font-extrabold">
                        <span>🚀</span>
                        <span>{t.header.nav.platform.pipeline}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.platform.pipelineDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/school/application-draft"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                        <span>📋</span>
                        <span>{locale === 'tr' ? 'Başvuru Taslağı Modülü' : 'Application Draft Module'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr'
                          ? 'Resmi KA121 & KA122 başvuru formu soru ve veri seti'
                          : 'Official KA121 & KA122 application draft questionnaire'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/marketplace"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-indigo-900 font-extrabold">
                        <span>🎓</span>
                        <span>{locale === 'tr' ? 'Eğitim & Fırsat Pazar Yeri' : 'Training & Opportunity Marketplace'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr'
                          ? 'Kurslar, işbaşı gözlem ve karşılıklı başvuru yönetimi'
                          : 'Courses, job shadowing slots & application management'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/preparation"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-950 font-extrabold">
                        <span>🚀</span>
                        <span>{locale === 'tr' ? 'Katılımcı Hazırlık Portalı (LMS)' : 'Participant Preparation Portal (LMS)'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr'
                          ? 'Öğrenci & personel mikro-öğrenme modülleri ve seyahat hazırlığı'
                          : 'Student & staff micro-learning LMS and pre-departure readiness'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/dossier"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900 font-extrabold">
                        <span>📁</span>
                        <span>{locale === 'tr' ? 'Resmi Evrak & Dosya İhracı' : 'Official Mobility Dossier & Export'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr'
                          ? 'Learning Agreement, Europass ve resmi ortaklık protokolleri'
                          : 'Learning Agreement, Europass & bilateral agreements'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <span>🏛️</span>
                        <span>{t.header.nav.platform.schoolDashboard}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.platform.schoolDashboardDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <span>🏢</span>
                        <span>{t.header.nav.platform.hostPortal}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.platform.hostPortalDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/admin/content-manager"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block border-t border-slate-100"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-purple-900 font-extrabold">
                        <span>⚙️</span>
                        <span>{locale === 'tr' ? 'Admin CMS & İçerik Konsolu' : 'Admin CMS Console'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr'
                          ? 'Kurslar, işbaşı gözlem ve kütüphane doküman yönetimi'
                          : 'Manage courses, job offers and library documents'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/admin/qa-dashboard"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block border-t border-slate-100"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-900 font-extrabold">
                        <span>🛡️</span>
                        <span>{locale === 'tr' ? 'Sistem Kalite & QA Paneli' : 'System QA & Health Dashboard'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr'
                          ? 'SLA p95 metrikleri, canlı güvenlik kilitleri ve test koşuları'
                          : 'SLA p95 metrics, hardening lock & automated test runs'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/onboarding"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <span>⚙️</span>
                        <span>{t.header.nav.platform.onboarding}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.platform.onboardingDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. Library (with Dropdown) */}
          <div className="relative">
            <div
              className={`inline-flex items-stretch rounded-lg transition-all ${pathname === '/library'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
            >
              <Link
                href="/library"
                className={`px-2 2xl:px-2.5 py-1.5 text-xs font-bold rounded-l-lg transition-colors ${pathname === '/library'
                    ? 'hover:bg-slate-800 text-white'
                    : 'hover:bg-slate-200/60'
                  }`}
              >
                <span>{t.header.nav.library.label}</span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'LIBRARY' ? null : 'LIBRARY')
                }
                className={`px-1.5 2xl:px-2 flex items-center justify-center rounded-r-lg transition-colors border-l cursor-pointer ${pathname === '/library'
                    ? 'border-slate-800 text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                aria-label={isTr ? 'Kütüphane Alt Menü' : 'Library submenu'}
                aria-expanded={activeDropdown === 'LIBRARY'}
                aria-controls="library-dropdown-menu"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${activeDropdown === 'LIBRARY' ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {activeDropdown === 'LIBRARY' && (
              <div id="library-dropdown-menu" className="absolute left-0 mt-2 w-88 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                {/* 1. Distinct Purpose Header */}
                <div className="p-3 bg-emerald-50/60 border-b border-emerald-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                      <span>📚</span>
                      <span>{locale === 'tr' ? 'Kütüphane Rolü & Amacı' : 'Library Role & Purpose'}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-200/80 text-emerald-900">
                      Açık Veri
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug m-0">
                    {locale === 'tr'
                      ? 'Avrupa Komisyonu standartlarında resmi form şablonları, hibe analizleri ve açık veri deposudur.'
                      : 'Official repository for European Commission compliant form templates, grant analytics and open dataset archives.'}
                  </p>
                </div>

                {/* 2. Top 3 Most Searched Resources */}
                <div className="px-3 pt-2 pb-1 bg-slate-50/50">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      <span>{locale === 'tr' ? 'En Çok Aranan 3 Kaynak' : 'Top 3 Popular Resources'}</span>
                    </span>
                    <span className="text-[9px] font-bold text-emerald-700">Hızlı Bağlantı</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/guide"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-blue-50/80 flex items-center justify-between group transition-colors cursor-pointer bg-blue-50/40 border-b border-slate-100 block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-900 font-extrabold">
                        <span>📖</span>
                        <span>{t.header.nav.library.userManual}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                          {locale === 'en' ? 'NEW' : 'YENİ'}
                        </span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.library.userManualDesc}
                      </div>
                    </div>
                    <span className="text-blue-600 group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>

                  <Link
                    href="/library"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-900">
                        <span>📝</span>
                        <span>{t.header.nav.library.ka121Guide}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.library.ka121GuideDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/library"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-900">
                        <span>📝</span>
                        <span>{t.header.nav.library.ka122Guide}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.library.ka122GuideDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setIsHibeOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <span>📊</span>
                        <span>{t.header.nav.library.grantResults}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.library.grantResultsDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBeneficiariesCategory('MESLEK_LISELERI');
                      setIsBeneficiariesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <span>🏛️</span>
                        <span>{t.header.nav.library.mebAtlas}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.library.mebAtlasDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLegalTab('LEGAL');
                      setIsLegalOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900">
                        <span>⚖️</span>
                        <span>{t.header.nav.library.legal}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.library.legalDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 4. Guide (Standalone User Manual - Displayed on 2xl to preserve compact nav) */}
          <Link
            href="/guide"
            className={`hidden 2xl:inline-flex px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${pathname === '/guide'
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-700 hover:text-blue-900 hover:bg-blue-50'
              }`}
          >
            <span>{locale === 'tr' ? 'Kılavuz' : 'User Guide'}</span>
          </Link>

          {/* 5. About (Displayed on 2xl to preserve compact nav) */}
          <Link
            href="/about"
            className={`hidden 2xl:inline-flex px-2.5 py-1.5 text-xs font-bold rounded-lg transition-all ${pathname === '/about'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
          >
            <span>{t.header.nav.about}</span>
          </Link>

          {/* 6. News & Events (with Dropdown) */}
          <div className="relative">
            <div
              className={`inline-flex items-stretch rounded-lg transition-all ${pathname === '/news-and-events'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
            >
              <Link
                href="/news-and-events"
                className={`px-2 2xl:px-2.5 py-1.5 text-xs font-bold rounded-l-lg transition-colors ${pathname === '/news-and-events'
                    ? 'hover:bg-slate-800 text-white'
                    : 'hover:bg-slate-200/60'
                  }`}
              >
                <span>{t.header.nav.newsAndEvents.label}</span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'NEWS' ? null : 'NEWS')
                }
                className={`px-1.5 2xl:px-2 flex items-center justify-center rounded-r-lg transition-colors border-l cursor-pointer ${pathname === '/news-and-events'
                    ? 'border-slate-800 text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                aria-label={isTr ? 'Haberler Alt Menü' : 'News & Events submenu'}
                aria-expanded={activeDropdown === 'NEWS'}
                aria-controls="news-dropdown-menu"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${activeDropdown === 'NEWS' ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {activeDropdown === 'NEWS' && (
              <div id="news-dropdown-menu" className="absolute right-0 xl:left-0 mt-2 w-88 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                {/* 1. Distinct Purpose Header */}
                <div className="p-3 bg-blue-50/60 border-b border-blue-100 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                      <span>📢</span>
                      <span>{locale === 'tr' ? 'Haberler & Takvim Rolü' : 'News & Calendar Role'}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-200/80 text-blue-900">
                      Duyuru
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug m-0">
                    {locale === 'tr'
                      ? 'Erasmus+ teklif çağrıları, hibe tahsisatları ve uluslararası mesleki eğitim etkinlik takvimidir.'
                      : 'Official information channel for Erasmus+ call announcements, grant allocations, and international VET event schedule.'}
                  </p>
                </div>

                {/* 2. Top 3 Most Searched Resources */}
                <div className="px-3 pt-2 pb-1 bg-slate-50/50">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{locale === 'tr' ? 'En Çok Aranan 3 Kaynak' : 'Top 3 Popular Resources'}</span>
                    </span>
                    <span className="text-[9px] font-bold text-blue-700">Hızlı Bağlantı</span>
                  </div>
                </div>

                <div className="py-1">
                  <Link
                    href="/news-and-events?filter=CALLS"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-900 font-extrabold">
                        <span>🗓️</span>
                        <span>{locale === 'tr' ? 'Resmi Çağrı Duyuruları & Hibe Tahsisatı' : 'Official Call Notices & Allocations'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr' ? 'Ulusal Ajans yıllık bütçe ve başvuru takvimi' : 'National Agency budget allocations & calendar'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/news-and-events?filter=EVENTS"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                        <span>🌍</span>
                        <span>{locale === 'tr' ? 'Uluslararası Çalıştaylar & Erasmus Days' : 'International Workshops & Erasmus Days'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr' ? 'Yeşil beceriler ve dijitalleşme seminerleri' : 'Green skills and digitalization workshops'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/news-and-events?filter=ARCHIVE"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-amber-950 hover:bg-amber-50 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-amber-900 font-extrabold">
                        <span>🗄️</span>
                        <span>{locale === 'tr' ? 'Geçmiş Çağrılar & Arşiv Deposu' : 'Concluded Calls & Content Archive'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr' ? 'Süresi dolmuş çağrı ve emsal denetim kayıtları' : 'Concluded calls & archival records'}
                      </div>
                    </div>
                    <span className="text-amber-600 group-hover:text-amber-800">→</span>
                  </Link>
                </div>

                <div className="p-2 bg-slate-50">
                  <Link
                    href="/news-and-events"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-center text-blue-700 hover:text-blue-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all block"
                  >
                    {locale === 'tr' ? 'Tüm Haber ve Etkinlikleri Gör →' : 'View All News & Events →'}
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 7. Contact (with Dropdown) */}
          <div className="relative">
            <div
              className={`inline-flex items-stretch rounded-lg transition-all ${pathname === '/contact'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
            >
              <Link
                href="/contact"
                className={`px-2 2xl:px-2.5 py-1.5 text-xs font-bold rounded-l-lg transition-colors ${pathname === '/contact'
                    ? 'hover:bg-slate-800 text-white'
                    : 'hover:bg-slate-200/60'
                  }`}
              >
                <span>{t.header.nav.contact.label}</span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'CONTACT' ? null : 'CONTACT')
                }
                className={`px-1.5 2xl:px-2 flex items-center justify-center rounded-r-lg transition-colors border-l cursor-pointer ${pathname === '/contact'
                    ? 'border-slate-800 text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                  }`}
                aria-label={isTr ? 'İletişim Alt Menü' : 'Contact submenu'}
                aria-expanded={activeDropdown === 'CONTACT'}
                aria-controls="contact-dropdown-menu"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${activeDropdown === 'CONTACT' ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            </div>

            {activeDropdown === 'CONTACT' && (
              <div id="contact-dropdown-menu" className="absolute right-0 mt-2 w-88 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                {/* 1. Distinct Purpose Header */}
                <div className="p-3 bg-slate-50 border-b border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <span>📬</span>
                      <span>{locale === 'tr' ? 'İletişim Masası Rolü' : 'Contact Desk Role'}</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-100 text-emerald-900">
                      Danışmanlık
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-700 font-medium leading-snug m-0">
                    {locale === 'tr'
                      ? 'Proje planlama, KA121/KA122 rehberliği ve ev sahibi işletme eşleşmeleri için doğrudan uzman desteği iletişim merkezidir.'
                      : 'Dedicated institutional contact center providing direct specialist consultation for project planning, KA121/KA122 guidance, and host matching.'}
                  </p>
                </div>

                {/* 2. Top 3 Most Searched Resources */}
                <div className="px-3 pt-2 pb-1 bg-slate-50/50">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                      <span>{locale === 'tr' ? 'En Çok Aranan 3 Kaynak' : 'Top 3 Popular Resources'}</span>
                    </span>
                    <span className="text-[9px] font-bold text-blue-700">Hızlı Bağlantı</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAppointmentOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-blue-900 font-extrabold">
                        <span>📅</span>
                        <span>{locale === 'tr' ? 'Ücretsiz 30 Dk Çevrimiçi Danışmanlık' : 'Free 30-Min Consultation Booking'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr' ? 'Google Meet üzerinden birebir uzman görüşmesi' : '1-on-1 video conference with VET specialists'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <Link
                    href="/contact#contact-form"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-emerald-900 font-extrabold">
                        <span>✉️</span>
                        <span>{locale === 'tr' ? 'Kurumsal Talep & İletişim Formu' : 'Institutional Inquiry Form'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr' ? 'Okul OID ve talep detaylarıyla doğrudan mesaj' : 'Submit direct inquiries with school OID'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/contact#faq-section"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-900 font-extrabold">
                        <span>❓</span>
                        <span>{locale === 'tr' ? 'İrtibat Noktaları & Çalışma Saatleri' : 'Liaison Desks & Operating Hours'}</span>
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {locale === 'tr' ? 'Destek masası ve yanıt taahhüdü detayları' : 'Support desk details and response SLA'}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>
                </div>

                <div className="p-2 bg-slate-50">
                  <Link
                    href="/contact"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-2.5 py-1.5 rounded-lg text-xs font-bold text-center text-blue-700 hover:text-blue-900 hover:bg-white border border-transparent hover:border-slate-200 transition-all block"
                  >
                    {locale === 'tr' ? 'İletişim & Destek Merkezine Git →' : 'Go to Contact Center →'}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* 3. Right Utility Bar (Single Line: Accessibility, Language, Admin Badge, Profile Link, Mobile Toggle) */}
        <div className="header-right-utility flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Görünüm & Okuma Ayarları (Accessibility Preferences) */}
          <DisplaySettingsDropdown />

          {/* TR / EN Language Dropdown List */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-1 sm:gap-1.5 shadow-2xs transition-all shrink-0 cursor-pointer"
              title={locale === 'tr' ? 'Dili Değiştir' : 'Change Language'}
            >
              <span>{locale === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}</span>
              <svg
                className={`w-3 h-3 text-slate-500 transition-transform ${isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1 z-50 animate-fadeIn divide-y divide-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setLocale('tr');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${locale === 'tr'
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🇹🇷</span>
                    <span>Türkçe (TR)</span>
                  </span>
                  {locale === 'tr' && <span className="text-blue-700 font-extrabold text-sm">✓</span>}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLocale('en');
                    setIsLangDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${locale === 'en'
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>English (EN)</span>
                  </span>
                  {locale === 'en' && <span className="text-blue-700 font-extrabold text-sm">✓</span>}
                </button>
              </div>
            )}
          </div>

          {/* Admin Verification Pool Button (Admin Only) */}
          {isAdmin && (
            <button
              onClick={() => setIsAdminQueueOpen(true)}
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs shrink-0 cursor-pointer"
              title="Admin Evrak İnceleme ve Onay Havuzu"
            >
              <span>🛡️</span>
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* User Profile Area (Navigates to /profile on click) */}
          {isSignedIn ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 sm:pr-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs group shrink-0"
              title="Kullanıcı Profilini ve Kurum Detaylarını Gör"
            >
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User'}
                  className="w-6 h-6 rounded-lg object-cover border border-slate-300"
                />
              ) : (
                <div className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                  {user?.firstName?.[0] || 'U'}
                </div>
              )}

              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-900">
                  {user?.firstName || user?.fullName || 'Profilim'}
                </span>
                <span className="text-[10px] text-slate-500 font-medium leading-none">
                  {isAdmin ? 'Yönetici' : orgType === 'HOST' ? 'Host' : 'Okul'}
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
              <Link
                href="/sign-up"
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 active:bg-blue-900 rounded-lg transition-all shadow-xs hover:shadow-sm cursor-pointer whitespace-nowrap"
              >
                {locale === 'en' ? 'Register' : 'Kayıt Ol'}
              </Link>
              <Link
                href="/sign-in"
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer whitespace-nowrap"
              >
                {locale === 'en' ? 'Sign In' : 'Giriş Yap'}
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Menu Toggle Button (Visible on screens < xl) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="xl:hidden p-1.5 sm:p-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs shrink-0 cursor-pointer"
            aria-label={isMobileMenuOpen ? (isTr ? 'Menüyü Kapat' : 'Close menu') : (isTr ? 'Menüyü Aç' : 'Open menu')}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu-panel"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Navigation Panel (Flat, Zero Gradient, xl:hidden) */}
      {isMobileMenuOpen && (
        <div
          id="mobile-menu-panel"
          ref={mobileMenuRef}
          className="xl:hidden bg-white border-t border-slate-200 shadow-xl max-h-[calc(100vh-100px)] overflow-y-auto divide-y divide-slate-100 animate-fadeIn"
        >
          {/* Quick Action: 5 Adımlı Pipeline */}
          <div className="p-3 bg-blue-50/60 border-b border-blue-100">
            <Link
              href="/school/pipeline"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>{locale === 'tr' ? '5 Adımlı Hareketlilik Planı' : '5-Step Mobility Planning'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* 1. Home */}
          <div className="p-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${pathname === '/' ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
            >
              <span>🏠</span>
              <span>{t.header.nav.home}</span>
            </Link>
          </div>

          {/* 2. About */}
          <div className="p-2">
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${pathname === '/about' ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'
                }`}
            >
              <span>ℹ️</span>
              <span>{t.header.nav.about}</span>
            </Link>
          </div>

          {/* 3. Mobility Hub */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                <span>⚡</span>
                <span>{t.header.nav.platform.label}</span>
              </span>
              <span className="text-[9px] font-extrabold bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded">EMaaS</span>
            </div>
            {/* Purpose Sentence */}
            <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-snug m-0">
              {locale === 'tr'
                ? 'Uçtan uca dijital hareketlilik planlama, akıllı ev sahibi eşleştirmesi ve resmi evrak ihracı operasyon merkezidir.'
                : 'Operations hub for end-to-end digital mobility planning, smart host matching, and official dossier export.'}
            </p>
            {/* Top 3 Quick Links */}
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/school/pipeline"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-blue-900 bg-blue-50/70 hover:bg-blue-100 flex items-center justify-between"
              >
                <span>🚀 1. {t.header.nav.platform.pipeline}</span>
                <span className="text-blue-600">→</span>
              </Link>
              <Link
                href="/marketplace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-indigo-900 bg-indigo-50/60 hover:bg-indigo-100 flex items-center justify-between"
              >
                <span>🎓 2. {locale === 'tr' ? 'Eğitim & Fırsat Pazar Yeri' : 'Opportunity Marketplace'}</span>
                <span className="text-indigo-600">→</span>
              </Link>
              <Link
                href="/school/application-draft"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100 flex items-center justify-between"
              >
                <span>📋 3. {locale === 'tr' ? 'Başvuru Taslağı Modülü' : 'Application Draft'}</span>
                <span className="text-emerald-600">→</span>
              </Link>
              <Link
                href="/platform"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{locale === 'tr' ? 'Platform Genel Bakış & Tüm Modüller' : 'Platform Overview & All Modules'}</span>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>

          {/* 4. Library */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <span>📚</span>
                <span>{t.header.nav.library.label}</span>
              </span>
              <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded">Açık Veri</span>
            </div>
            {/* Purpose Sentence */}
            <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-snug m-0">
              {locale === 'tr'
                ? 'Avrupa Komisyonu standartlarında resmi form şablonları, hibe analizleri ve açık veri deposudur.'
                : 'Official repository for European Commission compliant form templates, grant analytics and open dataset archives.'}
            </p>
            {/* Top 3 Quick Links */}
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/library"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-emerald-900 bg-emerald-50/70 hover:bg-emerald-100 flex items-center justify-between"
              >
                <span>📝 1. {locale === 'tr' ? 'KA121 / KA122 Form Soru Rehberleri' : 'KA121 / KA122 Form Guides'}</span>
                <span className="text-emerald-600">→</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsHibeOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-blue-900 bg-blue-50/60 hover:bg-blue-100 flex items-center justify-between cursor-pointer"
              >
                <span>📊 2. {t.header.nav.library.grantResults}</span>
                <span className="text-blue-600">→</span>
              </button>
              <Link
                href="/guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-purple-900 bg-purple-50/60 hover:bg-purple-100 flex items-center justify-between"
              >
                <span>📖 3. {t.header.nav.library.userManual}</span>
                <span className="text-purple-600">→</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setLegalTab('LEGAL');
                  setIsLegalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between cursor-pointer"
              >
                <span>⚖️ {t.header.nav.library.legal}</span>
                <span className="text-slate-400">→</span>
              </button>
            </div>
          </div>

          {/* 5. News & Events */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                <span>📢</span>
                <span>{t.header.nav.newsAndEvents.label}</span>
              </span>
              <span className="text-[9px] font-extrabold bg-blue-100 text-blue-900 px-1.5 py-0.2 rounded">Duyuru</span>
            </div>
            {/* Purpose Sentence */}
            <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-snug m-0">
              {locale === 'tr'
                ? 'Erasmus+ teklif çağrıları, hibe tahsisatları ve uluslararası mesleki eğitim etkinlik takvimidir.'
                : 'Official information channel for Erasmus+ call announcements, grant allocations, and international VET event schedule.'}
            </p>
            {/* Top 3 Quick Links */}
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/news-and-events?filter=CALLS"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-blue-900 bg-blue-50/60 hover:bg-blue-100 flex items-center justify-between"
              >
                <span>🗓️ 1. {locale === 'tr' ? 'Resmi Çağrı Duyuruları & Hibe Tahsisatı' : 'Call Notices & Allocations'}</span>
                <span className="text-blue-600">→</span>
              </Link>
              <Link
                href="/news-and-events?filter=EVENTS"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100 flex items-center justify-between"
              >
                <span>🌍 2. {locale === 'tr' ? 'Uluslararası Çalıştaylar & Erasmus Days' : 'Workshops & Events'}</span>
                <span className="text-emerald-600">→</span>
              </Link>
              <Link
                href="/news-and-events?filter=ARCHIVE"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-amber-950 bg-amber-50/70 hover:bg-amber-100 flex items-center justify-between"
              >
                <span>🗄️ 3. {locale === 'tr' ? 'Geçmiş Çağrılar & Arşiv Deposu' : 'Archive & Concluded Calls'}</span>
                <span className="text-amber-700">→</span>
              </Link>
              <Link
                href="/news-and-events"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{locale === 'tr' ? 'Tüm Haber ve Etkinlikler Akışı' : 'View Full Feed'}</span>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>

          {/* 6. Contact */}
          <div className="p-3 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span>📬</span>
                <span>{t.header.nav.contact.label}</span>
              </span>
              <span className="text-[9px] font-extrabold bg-emerald-100 text-emerald-900 px-1.5 py-0.2 rounded">Danışmanlık</span>
            </div>
            {/* Purpose Sentence */}
            <p className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-snug m-0">
              {locale === 'tr'
                ? 'Proje planlama, KA121/KA122 rehberliği ve ev sahibi işletme eşleşmeleri için doğrudan uzman desteği iletişim merkezidir.'
                : 'Dedicated institutional contact center providing direct specialist consultation for project planning, KA121/KA122 guidance, and host matching.'}
            </p>
            {/* Top 3 Quick Links */}
            <div className="grid grid-cols-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsAppointmentOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-blue-900 bg-blue-50/70 hover:bg-blue-100 flex items-center justify-between cursor-pointer"
              >
                <span>📅 1. {locale === 'tr' ? 'Ücretsiz 30 Dk Çevrimiçi Danışmanlık' : 'Free 30-Min Consultation Booking'}</span>
                <span className="text-blue-600">→</span>
              </button>
              <Link
                href="/contact#contact-form"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100 flex items-center justify-between"
              >
                <span>✉️ 2. {locale === 'tr' ? 'Kurumsal Talep & İletişim Formu' : 'Institutional Inquiry Form'}</span>
                <span className="text-emerald-600">→</span>
              </Link>
              <Link
                href="/contact#faq-section"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-2 rounded-lg text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 flex items-center justify-between"
              >
                <span>❓ 3. {locale === 'tr' ? 'İrtibat Noktaları & Çalışma Saatleri' : 'Desks & Working Hours'}</span>
                <span className="text-slate-600">→</span>
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{locale === 'tr' ? 'İletişim & Destek Merkezine Git' : 'Go to Contact Center'}</span>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>

          {/* Mobile Auth Actions */}
          {isSignedIn ? (
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <Link
                href="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center gap-2.5 p-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 transition-all"
              >
                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User'}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                )}
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900">
                    {user?.firstName || user?.fullName || 'Profilim'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isAdmin ? 'Yönetici' : orgType === 'HOST' ? 'Host' : 'Okul'}
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center gap-2">
              <Link
                href="/sign-up"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-all shadow-xs text-center cursor-pointer"
              >
                {locale === 'en' ? 'Register' : 'Kayıt Ol'}
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2.5 px-3 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 text-center transition-colors shadow-2xs cursor-pointer"
              >
                {locale === 'en' ? 'Sign In' : 'Giriş Yap'}
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Modals Container */}
      <ProgrammesModal
        isOpen={isProgrammesOpen}
        onClose={() => setIsProgrammesOpen(false)}
        initialTab={programmesTab}
      />

      <BeneficiariesModal
        isOpen={isBeneficiariesOpen}
        onClose={() => setIsBeneficiariesOpen(false)}
        initialCategory={beneficiariesCategory}
      />

      <ErasmusResultsWidget
        isOpen={isHibeOpen}
        onClose={() => setIsHibeOpen(false)}
      />

      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      <AdminVerificationQueueModal
        isOpen={isAdminQueueOpen}
        onClose={() => setIsAdminQueueOpen(false)}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </header>
  );
}
