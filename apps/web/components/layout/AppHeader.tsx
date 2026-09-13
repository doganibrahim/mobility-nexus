'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
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
  const [activeDropdown, setActiveDropdown] = useState<
    'PROGRAMMES' | 'BENEFICIARIES' | 'OPPORTUNITIES' | 'RESOURCES' | 'CONTACT' | null
  >(null);
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
            <span className="truncate max-w-[210px] sm:max-w-none">Erasmus+ Mesleki Eğitim</span>
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
            C
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

        {/* 2. Center 4 Dropdown Menus (Single Line on Desktop) */}
        <nav
          ref={navContainerRef}
          className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0"
        >
          {/* Menu 1: Programlar */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveDropdown(activeDropdown === 'PROGRAMMES' ? null : 'PROGRAMMES')
              }
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDropdown === 'PROGRAMMES'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <span>{t.header.nav.programmes.label}</span>
              <svg
                className={`w-3 h-3 transition-transform ${
                  activeDropdown === 'PROGRAMMES' ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'PROGRAMMES' && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.header.nav.programmes.label}
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProgrammesTab('KA121');
                      setIsProgrammesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.programmes.ka121}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.programmes.ka121Desc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProgrammesTab('KA122');
                      setIsProgrammesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.programmes.ka122}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.programmes.ka122Desc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setProgrammesTab('COMPARISON');
                      setIsProgrammesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.programmes.comparison}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.programmes.comparisonDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu 2: Yararlanıcılar */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveDropdown(activeDropdown === 'BENEFICIARIES' ? null : 'BENEFICIARIES')
              }
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDropdown === 'BENEFICIARIES'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <span>{t.header.nav.beneficiaries.label}</span>
              <svg
                className={`w-3 h-3 transition-transform ${
                  activeDropdown === 'BENEFICIARIES' ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'BENEFICIARIES' && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.header.nav.beneficiaries.label}
                </div>
                <div className="py-1">
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
                      <div>{t.header.nav.beneficiaries.meslekLiseleri}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.beneficiaries.meslekLiseleriDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBeneficiariesCategory('HALK_EGITIM');
                      setIsBeneficiariesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.beneficiaries.halkEgitim}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.beneficiaries.halkEgitimDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBeneficiariesCategory('OLGUNLASMA');
                      setIsBeneficiariesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.beneficiaries.olgunlasma}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.beneficiaries.olgunlasmaDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBeneficiariesCategory('MEM');
                      setIsBeneficiariesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.beneficiaries.mem}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.beneficiaries.memDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBeneficiariesCategory('OSB');
                      setIsBeneficiariesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.beneficiaries.osb}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.beneficiaries.osbDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBeneficiariesCategory('TTSO');
                      setIsBeneficiariesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.beneficiaries.ttso}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.beneficiaries.ttsoDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setBeneficiariesCategory('ESNAF');
                      setIsBeneficiariesOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.beneficiaries.esnaf}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.beneficiaries.esnafDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu 3: Fırsatlar & Hostlar */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveDropdown(activeDropdown === 'OPPORTUNITIES' ? null : 'OPPORTUNITIES')
              }
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDropdown === 'OPPORTUNITIES'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <span>{t.header.nav.opportunities.label}</span>
              <svg
                className={`w-3 h-3 transition-transform ${
                  activeDropdown === 'OPPORTUNITIES' ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'OPPORTUNITIES' && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.header.nav.opportunities.label}
                </div>
                <div className="py-1">
                  <Link
                    href="/#host-matching"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div>{t.header.nav.opportunities.hostOrgs}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.opportunities.hostOrgsDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>

                  <Link
                    href="/#competence"
                    onClick={() => setActiveDropdown(null)}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors block"
                  >
                    <div>
                      <div>{t.header.nav.opportunities.internships}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.opportunities.internshipsDesc}
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
                      <div>{t.header.nav.opportunities.becomePartner}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.opportunities.becomePartnerDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Menu 4: Kaynaklar (Dile Özel: TR'de KVKK, EN'de GDPR) */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveDropdown(activeDropdown === 'RESOURCES' ? null : 'RESOURCES')
              }
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDropdown === 'RESOURCES'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <span>{t.header.nav.resources.label}</span>
              <svg
                className={`w-3 h-3 transition-transform ${
                  activeDropdown === 'RESOURCES' ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'RESOURCES' && (
              <div className="absolute left-0 mt-2 w-72 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.header.nav.resources.label}
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsHibeOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div>{t.header.nav.resources.grantResults}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.resources.grantResultsDesc}
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
                      <div>{t.header.nav.resources.mebAtlas}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.resources.mebAtlasDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>

                  {/* Strictly Language-Exclusive: TR -> KVKK, EN -> GDPR */}
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
                      <div>{t.header.nav.resources.legal}</div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.resources.legalDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Menu 5: İletişim (Sadece Randevu Al içerir) */}
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setActiveDropdown(activeDropdown === 'CONTACT' ? null : 'CONTACT')
              }
              className={`px-3 py-1.5 text-xs font-extrabold rounded-lg border transition-all flex items-center gap-1.5 ${
                activeDropdown === 'CONTACT'
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'bg-white text-slate-700 border-transparent hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <span>{t.header.nav.contact.label}</span>
              <svg
                className={`w-3 h-3 transition-transform ${
                  activeDropdown === 'CONTACT' ? 'rotate-180 text-white' : 'text-slate-400'
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {activeDropdown === 'CONTACT' && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1.5 z-50 divide-y divide-slate-100 animate-fadeIn">
                <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                  {t.header.nav.contact.label}
                </div>
                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAppointmentOpen(true);
                      setActiveDropdown(null);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between group transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-800">
                        {t.header.nav.contact.appointment}
                      </div>
                      <div className="text-[10px] font-normal text-slate-500">
                        {t.header.nav.contact.appointmentDesc}
                      </div>
                    </div>
                    <span className="text-slate-400 group-hover:text-slate-700">→</span>
                  </button>
                </div>
              </div>
            )}
          </div>
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
                Giriş Yap
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
          {/* Guest Quick Tour Banner on Mobile */}
          <Show when="signed-out">
            <div className="p-3 bg-blue-50/60 border-b border-blue-100">
              <button
                type="button"
                onClick={() => {
                  setIsGuestTourOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full py-2.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <span>✨</span>
                <span>{t.guestOnboarding.howItWorksBtn} (Platform Turu)</span>
              </button>
            </div>
          </Show>
          {/* 1. Programlar Section */}
          <div className="p-3.5 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-2">
              <span>🇪🇺</span>
              <span>{t.header.nav.programmes.label}</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setProgrammesTab('KA121');
                  setIsProgrammesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.programmes.ka121}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.programmes.ka121Desc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProgrammesTab('KA122');
                  setIsProgrammesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.programmes.ka122}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.programmes.ka122Desc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setProgrammesTab('COMPARISON');
                  setIsProgrammesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.programmes.comparison}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.programmes.comparisonDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
            </div>
          </div>

          {/* 2. Yararlanıcılar Section */}
          <div className="p-3.5 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-2">
              <span>🏛️</span>
              <span>{t.header.nav.beneficiaries.label}</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('MESLEK_LISELERI');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.beneficiaries.meslekLiseleri}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.beneficiaries.meslekLiseleriDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('HALK_EGITIM');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.beneficiaries.halkEgitim}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.beneficiaries.halkEgitimDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('OLGUNLASMA');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.beneficiaries.olgunlasma}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.beneficiaries.olgunlasmaDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('MEM');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.beneficiaries.mem}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.beneficiaries.memDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('OSB');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.beneficiaries.osb}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.beneficiaries.osbDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('TTSO');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.beneficiaries.ttso}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.beneficiaries.ttsoDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('ESNAF');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.beneficiaries.esnaf}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.beneficiaries.esnafDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
            </div>
          </div>

          {/* 3. Fırsatlar Section */}
          <div className="p-3.5 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-2">
              <span>🤝</span>
              <span>{t.header.nav.opportunities.label}</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <Link
                href="/#host-matching"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors block"
              >
                <div>
                  <div>{t.header.nav.opportunities.hostOrgs}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.opportunities.hostOrgsDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </Link>
              <Link
                href="/#competence"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors block"
              >
                <div>
                  <div>{t.header.nav.opportunities.internships}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.opportunities.internshipsDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </Link>
              <Link
                href="/onboarding"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors block"
              >
                <div>
                  <div>{t.header.nav.opportunities.becomePartner}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.opportunities.becomePartnerDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </Link>
            </div>
          </div>

          {/* 4. Kaynaklar Section (Dile Özel KVKK vs. GDPR) */}
          <div className="p-3.5 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 px-2">
              <span>📚</span>
              <span>{t.header.nav.resources.label}</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsHibeOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.resources.grantResults}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.resources.grantResultsDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setBeneficiariesCategory('MESLEK_LISELERI');
                  setIsBeneficiariesOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.resources.mebAtlas}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.resources.mebAtlasDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLegalTab('LEGAL');
                  setIsLegalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-slate-800 hover:bg-slate-100 flex items-center justify-between transition-colors"
              >
                <div>
                  <div>{t.header.nav.resources.legal}</div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.resources.legalDesc}</div>
                </div>
                <span className="text-slate-400 font-bold">→</span>
              </button>
            </div>
          </div>

          {/* 5. İletişim Section (Mobile) */}
          <div className="p-3.5 space-y-1.5">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 px-2">
              {t.header.nav.contact.label}
            </div>
            <div className="grid grid-cols-1 gap-1">
              <button
                type="button"
                onClick={() => {
                  setIsAppointmentOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 bg-blue-50/50 hover:bg-blue-100/70 border border-blue-200/60 flex items-center justify-between transition-colors"
              >
                <div>
                  <div className="text-xs font-bold text-blue-900">
                    {t.header.nav.contact.appointment}
                  </div>
                  <div className="text-[10px] font-normal text-slate-500">{t.header.nav.contact.appointmentDesc}</div>
                </div>
                <span className="text-blue-700 font-bold">→</span>
              </button>
            </div>
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
