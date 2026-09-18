'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignInButton, SignUpButton, Show, useUser } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import { useAppStore } from '../../lib/store';

import ProgrammesModal from '../ui/ProgrammesModal';
import BeneficiariesModal, { BeneficiaryCategory } from '../ui/BeneficiariesModal';
import ErasmusResultsWidget from '../ui/ErasmusResultsWidget';
import LegalModal, { LegalTabType } from '../ui/LegalModal';
import AdminVerificationQueueModal from '../admin/AdminVerificationQueueModal';
import GuestOnboardingModal from '../ui/GuestOnboardingModal';
import AppointmentModal from '../ui/AppointmentModal';

export default function AppHeader() {
  const pathname = usePathname();
  const { locale, setLocale, t } = useTranslation();
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
  const [activeDropdown, setActiveDropdown] = useState<'PLATFORM' | 'LIBRARY' | null>(null);
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
    <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Official EU Strip (Light & Crisp, Responsive) */}
      <div className="bg-slate-100/80 border-b border-slate-200 px-3 py-1 sm:px-6 text-[11px] sm:text-xs text-slate-600 flex items-center justify-between flex-wrap gap-1.5">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span>🇪🇺</span>
            <span className="truncate max-w-[210px] sm:max-w-none">
              {locale === 'en' ? 'Erasmus+ Vocational Education and Training' : 'Erasmus+ Mesleki Eğitim'}
            </span>
          </span>
          <span className="text-slate-400 hidden sm:inline">•</span>
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
      <div className="max-w-[1440px] mx-auto px-4 py-2.5 sm:px-6 flex items-center justify-between gap-4">
        {/* 1. Left Brand Block (Compact, No Line Wrapping) */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-xs shrink-0"
            style={{ backgroundColor: themeConfig.primary }}
          >
            E
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-950 group-hover:text-blue-900 transition-colors">
              {t.header.title}
            </span>
            <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
              {t.header.badge}
            </span>
          </div>
        </Link>

        {/* 2. Center 6 Core Nav Items (Single Line on Desktop) */}
        <nav
          ref={navContainerRef}
          className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0"
        >
          {/* 1. Home */}
          <Link
            href="/"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              pathname === '/'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>🏠</span>
            <span>{t.header.nav.home}</span>
          </Link>

          {/* 2. About */}
          <Link
            href="/about"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              pathname === '/about'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>ℹ️</span>
            <span>{t.header.nav.about}</span>
          </Link>

          {/* 3. Platform (with Dropdown) */}
          <div className="relative">
            <div
              className={`inline-flex items-stretch rounded-lg transition-all ${
                pathname === '/platform' || pathname.startsWith('/school')
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Link
                href="/platform"
                className={`px-2.5 py-1.5 text-xs font-bold rounded-l-lg transition-colors flex items-center gap-1.5 ${
                  pathname === '/platform' || pathname.startsWith('/school')
                    ? 'hover:bg-slate-800 text-white'
                    : 'hover:bg-slate-200/60'
                }`}
              >
                <span>⚡</span>
                <span>{t.header.nav.platform.label}</span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'PLATFORM' ? null : 'PLATFORM')
                }
                className={`px-2 flex items-center justify-center rounded-r-lg transition-colors border-l cursor-pointer ${
                  pathname === '/platform' || pathname.startsWith('/school')
                    ? 'border-slate-800 text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
                aria-label="Platform Alt Menü"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${
                    activeDropdown === 'PLATFORM' ? 'rotate-180' : ''
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
              <div className="absolute left-0 mt-2 w-80 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.header.nav.platform.desc}
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
              className={`inline-flex items-stretch rounded-lg transition-all ${
                pathname === '/library'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Link
                href="/library"
                className={`px-2.5 py-1.5 text-xs font-bold rounded-l-lg transition-colors flex items-center gap-1.5 ${
                  pathname === '/library'
                    ? 'hover:bg-slate-800 text-white'
                    : 'hover:bg-slate-200/60'
                }`}
              >
                <span>📚</span>
                <span>{t.header.nav.library.label}</span>
              </Link>
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === 'LIBRARY' ? null : 'LIBRARY')
                }
                className={`px-2 flex items-center justify-center rounded-r-lg transition-colors border-l cursor-pointer ${
                  pathname === '/library'
                    ? 'border-slate-800 text-white hover:bg-slate-800'
                    : 'border-slate-200 text-slate-500 hover:bg-slate-200/60 hover:text-slate-900'
                }`}
                aria-label="Kütüphane Alt Menü"
              >
                <svg
                  className={`w-3 h-3 transition-transform ${
                    activeDropdown === 'LIBRARY' ? 'rotate-180' : ''
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
              <div className="absolute left-0 mt-2 w-80 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.header.nav.library.desc}
                </div>
                <div className="py-1">
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

          {/* 5. News & Events */}
          <Link
            href="/news-and-events"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              pathname === '/news-and-events'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>📢</span>
            <span>{t.header.nav.newsAndEvents.label}</span>
          </Link>

          {/* 6. Contact */}
          <Link
            href="/contact"
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              pathname === '/contact'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <span>📬</span>
            <span>{t.header.nav.contact.label}</span>
          </Link>
        </nav>

        {/* 3. Right Utility Bar (Single Line: Language, Admin Badge, Profile Link, Mobile Toggle) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* TR / EN Language Dropdown List */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 flex items-center gap-1 sm:gap-1.5 shadow-2xs transition-all"
              title={locale === 'tr' ? 'Dili Değiştir' : 'Change Language'}
            >
              <span>{locale === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}</span>
              <svg
                className={`w-3 h-3 text-slate-500 transition-transform ${
                  isLangDropdownOpen ? 'rotate-180' : ''
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
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                    locale === 'tr'
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
                  className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors ${
                    locale === 'en'
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
              className="inline-flex items-center gap-1.5 px-2 sm:px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-2xs"
              title="Admin Evrak İnceleme ve Onay Havuzu"
            >
              <span>🛡️</span>
              <span className="hidden sm:inline">Admin</span>
            </button>
          )}

          {/* User Profile Area (Navigates to /profile on click) */}
          <Show when="signed-in">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 sm:gap-2 p-1 sm:pl-2 sm:pr-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs group"
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
          </Show>

          <Show when="signed-out">
            <button
              type="button"
              onClick={() => setIsGuestTourOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
              title={t.guestOnboarding.howItWorksBtn}
            >
              <span>✨</span>
              <span className="hidden sm:inline">{t.guestOnboarding.howItWorksBtn}</span>
            </button>
            <SignInButton mode="modal">
              <button
                type="button"
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
              >
                {locale === 'en' ? 'Sign In' : 'Giriş Yap'}
              </button>
            </SignInButton>
          </Show>

          {/* Mobile Hamburger Menu Toggle Button (Visible on screens < lg) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs"
            aria-label={isMobileMenuOpen ? 'Menüyü Kapat' : 'Menüyü Aç'}
            aria-expanded={isMobileMenuOpen}
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

      {/* Mobile Slide-down Navigation Panel (Flat, Zero Gradient, lg:hidden) */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="lg:hidden bg-white border-t border-slate-200 shadow-xl max-h-[calc(100vh-100px)] overflow-y-auto divide-y divide-slate-100 animate-fadeIn"
        >
          {/* Quick Action: 5 Adımlı Pipeline */}
          <div className="p-3 bg-blue-50/60 border-b border-blue-100">
            <Link
              href="/school/pipeline"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-2.5 px-3 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>🚀</span>
              <span>{locale === 'tr' ? '5 Adımlı Hareketlilik Planı' : '5-Step Mobility Planning'}</span>
              <span>→</span>
            </Link>
          </div>

          {/* 1. Home */}
          <div className="p-2">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                pathname === '/' ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🏠</span>
                <span>{t.header.nav.home}</span>
              </span>
              <span>→</span>
            </Link>
          </div>

          {/* 2. About */}
          <div className="p-2">
            <Link
              href="/about"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                pathname === '/about' ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>ℹ️</span>
                <span>{t.header.nav.about}</span>
              </span>
              <span>→</span>
            </Link>
          </div>

          {/* 3. Platform */}
          <div className="p-3 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-2">
              <span>⚡</span>
              <span>{t.header.nav.platform.label}</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/platform"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{locale === 'tr' ? 'Platform Genel Bakış' : 'Platform Overview'}</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                href="/school/pipeline"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-blue-900 hover:bg-blue-50 flex items-center justify-between"
              >
                <span>{t.header.nav.platform.pipeline}</span>
                <span className="text-blue-600">→</span>
              </Link>
              <Link
                href="/school/application-draft"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-emerald-900 hover:bg-emerald-50 flex items-center justify-between"
              >
                <span>📋 {locale === 'tr' ? 'Başvuru Taslağı Modülü' : 'Application Draft'}</span>
                <span className="text-emerald-600">→</span>
              </Link>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{t.header.nav.platform.schoolDashboard}</span>
                <span className="text-slate-400">→</span>
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{t.header.nav.platform.onboarding}</span>
                <span className="text-slate-400">→</span>
              </Link>
            </div>
          </div>

          {/* 4. Library */}
          <div className="p-3 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-2">
              <span>📚</span>
              <span>{t.header.nav.library.label}</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/library"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{locale === 'tr' ? 'Kütüphane & Rehberler' : 'Library & Guides'}</span>
                <span className="text-slate-400">→</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsHibeOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{t.header.nav.library.grantResults}</span>
                <span className="text-slate-400">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('MESLEK_LISELERI');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{t.header.nav.library.mebAtlas}</span>
                <span className="text-slate-400">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLegalTab('LEGAL');
                  setIsLegalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between"
              >
                <span>{t.header.nav.library.legal}</span>
                <span className="text-slate-400">→</span>
              </button>
            </div>
          </div>

          {/* 5. News & Events */}
          <div className="p-2">
            <Link
              href="/news-and-events"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                pathname === '/news-and-events' ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📢</span>
                <span>{t.header.nav.newsAndEvents.label}</span>
              </span>
              <span>→</span>
            </Link>
          </div>

          {/* 6. Contact */}
          <div className="p-3 space-y-2">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`w-full px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between transition-colors ${
                pathname === '/contact' ? 'bg-slate-900 text-white' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>📬</span>
                <span>{t.header.nav.contact.label}</span>
              </span>
              <span>→</span>
            </Link>
            <button
              type="button"
              onClick={() => {
                setIsAppointmentOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-3 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>📅</span>
              <span>{t.header.nav.contact.appointment}</span>
            </button>
          </div>
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

      <GuestOnboardingModal
        isOpen={isGuestTourOpen}
        onClose={() => setIsGuestTourOpen(false)}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </header>
  );
}
