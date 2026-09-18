'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SignInButton, SignUpButton } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';
import { useAppStore } from '../../lib/store';
import AppointmentModal from './AppointmentModal';

export interface GuestOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo?: (role: 'SCHOOL' | 'HOST') => void;
}

export default function GuestOnboardingModal({
  isOpen,
  onClose,
  onStartDemo,
}: GuestOnboardingModalProps) {
  const { t, locale, setLocale } = useTranslation();
  const store = useAppStore();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedRolePreview, setSelectedRolePreview] = useState<'SCHOOL' | 'HOST'>('SCHOOL');
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState<boolean>(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isLangDropdownOpen) {
          setIsLangDropdownOpen(false);
        } else {
          handleDismiss();
        }
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, dontShowAgain, isLangDropdownOpen]);

  const handleDismiss = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      try {
        localStorage.setItem('em_guest_onboarding_dismissed', 'true');
      } catch (err) {
        console.warn('LocalStorage write failed:', err);
      }
    }
    onClose();
  };

  const handleDemoLaunch = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      try {
        localStorage.setItem('em_guest_onboarding_dismissed', 'true');
      } catch (err) {
        console.warn('LocalStorage write failed:', err);
      }
    }
    if (selectedRolePreview === 'HOST') {
      store.loadHostDemoData(locale);
    } else {
      store.loadDemoData(locale);
    }
    if (onStartDemo) {
      onStartDemo(selectedRolePreview);
    }
    onClose();
  };

  if (!isOpen) return null;

  const totalSteps = 4;

  const STEP_NAMES = [
    { num: 1, title: locale === 'tr' ? 'Genel Bakış' : 'Overview' },
    { num: 2, title: locale === 'tr' ? 'Kurumsal Rol' : 'Roles' },
    { num: 3, title: locale === 'tr' ? '5 Aşamalı Döngü' : 'Pipeline' },
    { num: 4, title: locale === 'tr' ? 'Başlangıç' : 'Get Started' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-50 flex flex-col justify-between overflow-y-auto min-h-screen animate-fadeIn"
      aria-labelledby="guest-onboarding-title"
      role="dialog"
      aria-modal="true"
    >
      {/* 1. Official Top Header Bar (Full Screen Navy Strip) */}
      <header className="bg-slate-900 text-white px-4 sm:px-8 py-3.5 border-b border-slate-800 shrink-0 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left Brand Identity */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-xs shrink-0">
              🇪🇺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1
                  id="guest-onboarding-title"
                  className="text-sm sm:text-base font-black tracking-tight text-white m-0"
                >
                  ErasmusMobility
                </h1>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-900/80 text-blue-200 border border-blue-700">
                  EMaaS v1.0
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal block truncate max-w-[200px] sm:max-w-none">
                {locale === 'tr'
                  ? 'Erasmus+ VET Karar ve Eşleştirme Ağ Geçidi'
                  : 'Erasmus+ VET Decision & Matching Gateway'}
              </span>
            </div>
          </div>

          {/* Center Stepper Indicators (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {STEP_NAMES.map((step) => {
              const isActive = currentStep === step.num;
              const isPassed = currentStep > step.num;
              return (
                <button
                  key={step.num}
                  type="button"
                  onClick={() => setCurrentStep(step.num)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : isPassed
                        ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                        : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] bg-white/20">
                    {isPassed ? '✓' : step.num}
                  </span>
                  <span>{step.title}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Utility (Language Dropdown + Sign In + Close) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* TR / EN Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                title={locale === 'tr' ? 'Dili Değiştir' : 'Change Language'}
              >
                <span>{locale === 'tr' ? '🇹🇷 TR' : '🇬🇧 EN'}</span>
                <svg
                  className={`w-3 h-3 text-slate-400 transition-transform ${
                    isLangDropdownOpen ? 'rotate-180 text-white' : ''
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
                <div className="absolute right-0 mt-1.5 w-40 rounded-xl bg-white border-2 border-slate-300 shadow-xl py-1 z-50 animate-fadeIn divide-y divide-slate-100 text-slate-900">
                  <button
                    type="button"
                    onClick={() => {
                      setLocale('tr');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
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
                    className={`w-full px-3 py-2 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
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

            {/* Randevu Al Butonu */}
            <button
              type="button"
              onClick={() => setIsAppointmentOpen(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-xs shrink-0"
            >
              {locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}
            </button>

            <SignInButton mode="modal">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-3 py-1.5 text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                {t.guestOnboarding.btnSignIn.replace(/.*\?/, '').trim()}
              </button>
            </SignInButton>

            <button
              type="button"
              onClick={handleDismiss}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors cursor-pointer border border-slate-700"
              title={t.guestOnboarding.btnSkip}
            >
              <span>{t.guestOnboarding.btnSkip}</span>
              <span>✕</span>
            </button>
          </div>
        </div>
      </header>

      {/* Progress Line */}
      <div className="w-full bg-slate-200 h-1.5 shrink-0 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        />
      </div>

      {/* 2. Full-Screen Main Content Canvas */}
      <main className="max-w-5xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        
        {/* ============================================================ */}
        {/* STEP 1: HOŞ GELDİNİZ & PLATFORM GENEL BAKIŞ                   */}
        {/* ============================================================ */}
        {currentStep === 1 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Block */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                <span>🇪🇺</span>
                <span>{t.guestOnboarding.step1Tag}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight m-0">
                {t.guestOnboarding.step1Title}
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed m-0">
                {t.guestOnboarding.step1Desc}
              </p>
            </div>

            {/* 3 Core Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-3 hover:border-blue-400 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-2xl">
                  🏛️
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800">
                  KA121 / KA122
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {t.guestOnboarding.step1Point1Title}
                </h3>
                <p className="text-xs text-slate-600 m-0 leading-relaxed">
                  {t.guestOnboarding.step1Point1Desc}
                </p>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-3 hover:border-indigo-400 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-800 flex items-center justify-center font-bold text-2xl">
                  📊
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-800">
                  {locale === 'tr' ? '27 Meslek Alanı' : '27 VET Fields'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {t.guestOnboarding.step1Point2Title}
                </h3>
                <p className="text-xs text-slate-600 m-0 leading-relaxed">
                  {t.guestOnboarding.step1Point2Desc}
                </p>
              </div>

              <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 space-y-3 hover:border-emerald-400 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-2xl">
                  🌍
                </div>
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800">
                  {locale === 'tr' ? '33 Program Ülkesi' : '33 EU Countries'}
                </div>
                <h3 className="text-base font-bold text-slate-900 m-0">
                  {t.guestOnboarding.step1Point3Title}
                </h3>
                <p className="text-xs text-slate-600 m-0 leading-relaxed">
                  {t.guestOnboarding.step1Point3Desc}
                </p>
              </div>
            </div>

            {/* Zero-Risk Institutional Callout */}
            <div className="bg-white border-2 border-blue-200 rounded-2xl p-5 sm:p-6 shadow-xs flex items-center gap-4">
              <span className="text-3xl sm:text-4xl shrink-0">💡</span>
              <div className="space-y-1">
                <h4 className="text-sm font-extrabold text-blue-950 m-0">
                  {locale === 'tr' ? 'Giriş Şartı Olmadan Canlı Simülasyon' : 'Live Simulation Without Login'}
                </h4>
                <p className="text-xs text-slate-600 m-0 leading-relaxed">
                  {locale === 'tr'
                    ? 'Platformu keşfetmek için hesap açmak zorunda değilsiniz. Sonraki adımlarda tek tıkla zengin demo verisi yükleyebilir ve tüm analiz motorlarını doğrudan deneyimleyebilirsiniz.'
                    : 'You do not need an account to test the platform. In the final step, you can load demo data with one click and explore all decision engines live.'}
                </p>
              </div>
            </div>

            {/* Randevu & Danışmanlık Çağrısı */}
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white border-2 border-blue-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                  </svg>
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 mb-1">
                    {locale === 'tr' ? 'Birebir Danışmanlık' : '1-on-1 Consultation'}
                  </div>
                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 m-0">
                    {locale === 'tr' ? 'Sorularınız mı var? Uzmanımızla Randevu Planlayın' : 'Have Questions? Book a Free Consultation'}
                  </h4>
                  <p className="text-xs text-slate-600 m-0 mt-0.5 leading-relaxed">
                    {locale === 'tr'
                      ? 'Erasmus+ KA121 akreditasyon, KA122 başvuru ve host eşleştirme süreçleri için 30 dakikalık ücretsiz online randevu alın.'
                      : 'Schedule a free 30-minute online session with our Erasmus+ VET specialists.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAppointmentOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
              >
                <span>{locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}</span>
                <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 2: İKİ TEMEL KURUMSAL ROL                                */}
        {/* ============================================================ */}
        {currentStep === 2 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Block */}
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                <span>👥</span>
                <span>{t.guestOnboarding.step2Tag}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
                {t.guestOnboarding.step2Title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t.guestOnboarding.step2Desc}
              </p>
            </div>

            {/* Two Full Role Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rol 1: Okul */}
              <div
                onClick={() => setSelectedRolePreview('SCHOOL')}
                className={`bg-white rounded-2xl p-7 border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedRolePreview === 'SCHOOL'
                    ? 'border-blue-600 shadow-lg ring-2 ring-blue-600/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-3xl">
                      🏛️
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedRolePreview === 'SCHOOL'
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {selectedRolePreview === 'SCHOOL'
                        ? locale === 'tr' ? '✓ Seçili Rol' : '✓ Selected'
                        : locale === 'tr' ? 'Seç ve İncele' : 'Select'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 m-0">
                    {t.guestOnboarding.roleSchoolTitle}
                  </h3>
                  <span className="text-xs font-bold text-blue-800 block mt-1">
                    {t.guestOnboarding.roleSchoolSubtitle}
                  </span>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {t.guestOnboarding.roleSchoolDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                    <span>{t.guestOnboarding.roleSchoolPoint1}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                    <span>{t.guestOnboarding.roleSchoolPoint2}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-blue-600 font-bold text-sm">✓</span>
                    <span>{t.guestOnboarding.roleSchoolPoint3}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-800">
                    {locale === 'tr' ? '5 adımlı okul karar motoru' : '5-step decision engine'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRolePreview('SCHOOL');
                      handleDemoLaunch();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    🚀 {locale === 'tr' ? 'Okul Demosuyla Başla' : 'Start School Demo'}
                  </button>
                </div>
              </div>

              {/* Rol 2: Host */}
              <div
                onClick={() => setSelectedRolePreview('HOST')}
                className={`bg-white rounded-2xl p-7 border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  selectedRolePreview === 'HOST'
                    ? 'border-emerald-600 shadow-lg ring-2 ring-emerald-600/20'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl">
                      🏢
                    </div>
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        selectedRolePreview === 'HOST'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {selectedRolePreview === 'HOST'
                        ? locale === 'tr' ? '✓ Seçili Rol' : '✓ Selected'
                        : locale === 'tr' ? 'Seç ve İncele' : 'Select'}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 m-0">
                    {t.guestOnboarding.roleHostTitle}
                  </h3>
                  <span className="text-xs font-bold text-emerald-800 block mt-1">
                    {t.guestOnboarding.roleHostSubtitle}
                  </span>
                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {t.guestOnboarding.roleHostDesc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <span>{t.guestOnboarding.roleHostPoint1}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <span>{t.guestOnboarding.roleHostPoint2}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span className="text-emerald-600 font-bold text-sm">✓</span>
                    <span>{t.guestOnboarding.roleHostPoint3}</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-800">
                    {locale === 'tr' ? 'Avrupa host portali ve stajyer havuzu' : 'European host portal & trainee pool'}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRolePreview('HOST');
                      store.loadHostDemoData(locale);
                      if (onStartDemo) onStartDemo('HOST');
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                  >
                    🚀 {locale === 'tr' ? 'Host Demosuyla Başla' : 'Start Host Demo'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 3: 5 AŞAMALI HAREKETLİLİK DÖNGÜSÜ                        */}
        {/* ============================================================ */}
        {currentStep === 3 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Block */}
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                <span>⚡</span>
                <span>{t.guestOnboarding.step3Tag}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
                {t.guestOnboarding.step3Title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t.guestOnboarding.step3Desc}
              </p>
            </div>

            {/* 5-Stage Step Flow Cards */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
              <div className="bg-white border-2 border-slate-200 hover:border-blue-400 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  1
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 m-0">
                    {t.guestOnboarding.stage1Name}
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-1 leading-relaxed">
                    {t.guestOnboarding.stage1Desc}
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 hover:border-indigo-400 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  2
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 m-0">
                    {t.guestOnboarding.stage2Name}
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-1 leading-relaxed">
                    {t.guestOnboarding.stage2Desc}
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 hover:border-emerald-400 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  3
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 m-0">
                    {t.guestOnboarding.stage3Name}
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-1 leading-relaxed">
                    {t.guestOnboarding.stage3Desc}
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 hover:border-amber-400 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-amber-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  4
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 m-0">
                    {t.guestOnboarding.stage4Name}
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-1 leading-relaxed">
                    {t.guestOnboarding.stage4Desc}
                  </p>
                </div>
              </div>

              <div className="bg-white border-2 border-slate-200 hover:border-slate-400 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3 shadow-xs transition-all">
                <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-xs">
                  5
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 m-0">
                    {t.guestOnboarding.stage5Name}
                  </h4>
                  <p className="text-[11px] text-slate-500 m-0 mt-1 leading-relaxed">
                    {t.guestOnboarding.stage5Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* STEP 4: HEMEN BAŞLAYIN (DEMO VE KAYIT AKSİYONLARI)           */}
        {/* ============================================================ */}
        {currentStep === 4 && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Block */}
            <div className="text-center max-w-2xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                <span>🚀</span>
                <span>{t.guestOnboarding.step4Tag}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
                {t.guestOnboarding.step4Title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t.guestOnboarding.step4Desc}
              </p>
            </div>

            {/* Benefits Overview Box */}
            <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl mx-auto space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 m-0 flex items-center gap-2">
                <span>🛡️</span>
                <span>{t.guestOnboarding.freeBenefitTitle}</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
                {t.guestOnboarding.freeBenefitDesc}
              </p>
            </div>

            {/* Active Role Selector Pill */}
            <div className="max-w-3xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border-2 border-slate-200 p-3.5 rounded-2xl shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800">
                  {locale === 'tr' ? 'Seçili Kurumsal Rolünüz:' : 'Selected Institutional Role:'}
                </span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">
                  {locale === 'tr' ? '(Demo buna göre yüklenecektir)' : '(Demo will match this role)'}
                </span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setSelectedRolePreview('SCHOOL')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedRolePreview === 'SCHOOL'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>🏛️</span>
                  <span>{locale === 'tr' ? 'Okul / Gönderen' : 'School / Sending'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRolePreview('HOST')}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    selectedRolePreview === 'HOST'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>🏢</span>
                  <span>{locale === 'tr' ? 'Avrupa Ev Sahibi (Host)' : 'European Host'}</span>
                </button>
              </div>
            </div>

            {/* Two Primary Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-3xl mx-auto w-full">
              {/* Action 1: Load Demo Data */}
              <button
                type="button"
                onClick={handleDemoLaunch}
                className="p-6 rounded-2xl border-2 border-blue-600 bg-blue-50/70 hover:bg-blue-100/70 text-left transition-all group flex flex-col justify-between shadow-sm hover:shadow-md cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">
                      {selectedRolePreview === 'HOST' ? '🏢' : '🏛️'}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-200/70 text-blue-900">
                      {selectedRolePreview === 'HOST'
                        ? locale === 'tr' ? 'Host Demosu' : 'Host Demo'
                        : locale === 'tr' ? 'Okul Demosu' : 'School Demo'}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-blue-950 group-hover:text-blue-900 m-0">
                    {selectedRolePreview === 'HOST'
                      ? locale === 'tr' ? '✨ Ev Sahibi (Host) Demosuyla Başla' : '✨ Start with Host Demo'
                      : locale === 'tr' ? '✨ Okul Demosuyla Başla' : '✨ Start with School Demo'}
                  </h3>
                  <p className="text-xs text-blue-800 mt-1.5 leading-relaxed m-0">
                    {selectedRolePreview === 'HOST'
                      ? locale === 'tr'
                        ? 'Avrupa ev sahibi kurum portali, 15 kriterli KYC doğrulaması ve stajyer kapasite yönetimini canlı test edin'
                        : 'Explore the European host dashboard, 15-point KYC audit, and trainee capacity management live'
                      : locale === 'tr'
                        ? 'KA121 / KA122 hazırlık skoru, ESCO beceri analizi ve 5 adımlı karar motorunu canlı test edin'
                        : 'Experience KA121/KA122 readiness scoring, ESCO skill gap analysis, and 5-stage decision engine live'}
                  </p>
                </div>
                <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 group-hover:text-blue-950">
                  <span>
                    {selectedRolePreview === 'HOST'
                      ? locale === 'tr' ? 'Host Panelini Aç' : 'Launch Host Dashboard'
                      : locale === 'tr' ? 'Okul Karar Motorunu Aç' : 'Launch School Pipeline'}
                  </span>
                  <span>→</span>
                </div>
              </button>

              {/* Action 2: Sign Up */}
              <SignUpButton mode="modal">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-6 rounded-2xl border-2 border-slate-950 bg-slate-950 hover:bg-slate-800 text-left text-white transition-all group flex flex-col justify-between shadow-md hover:shadow-xl cursor-pointer"
                >
                  <div>
                    <span className="text-3xl mb-3 block">👤</span>
                    <h3 className="text-base font-black text-white m-0">
                      {t.guestOnboarding.btnSignUp}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed m-0">
                      {t.guestOnboarding.btnSignUpSub}
                    </p>
                  </div>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold text-blue-300 group-hover:text-white">
                    <span>{locale === 'tr' ? 'Ücretsiz Hesap Aç' : 'Register for Free'}</span>
                    <span>→</span>
                  </div>
                </button>
              </SignUpButton>
            </div>

            {/* Bottom Footer Notice */}
            <div className="max-w-3xl mx-auto pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs border-t border-slate-200">
              <span className="text-slate-500 text-center sm:text-left">
                {t.guestOnboarding.noticeNoCard}
              </span>
              <SignInButton mode="modal">
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="font-bold text-blue-700 hover:text-blue-900 hover:underline transition-colors shrink-0 cursor-pointer"
                >
                  {t.guestOnboarding.btnSignIn}
                </button>
              </SignInButton>
            </div>
          </div>
        )}
      </main>

      {/* 3. Sticky Bottom Control Bar */}
      <footer className="bg-white border-t border-slate-200 px-4 sm:px-8 py-4 shadow-sm shrink-0 sticky bottom-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Left: Don't show again checkbox & Randevu Al */}
          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-600">
                {t.guestOnboarding.dontShowAgain}
              </span>
            </label>

            <span className="text-slate-300 hidden sm:inline">•</span>

            <button
              type="button"
              onClick={() => setIsAppointmentOpen(true)}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            >
              {locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}
            </button>
          </div>

          {/* Center: Indicator Dots */}
          <div className="flex items-center gap-2 justify-center">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map((stepNum) => (
              <button
                key={stepNum}
                type="button"
                onClick={() => setCurrentStep(stepNum)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentStep === stepNum
                    ? 'w-6 bg-blue-600'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Aşama ${stepNum}`}
              />
            ))}
          </div>

          {/* Right: Previous / Next Buttons */}
          <div className="flex items-center justify-end gap-2.5">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors shadow-2xs cursor-pointer"
              >
                ← {t.guestOnboarding.btnPrev}
              </button>
            )}

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-xs cursor-pointer"
              >
                {t.guestOnboarding.btnNext} →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleDemoLaunch}
                className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>✓</span>
                <span>
                  {selectedRolePreview === 'HOST'
                    ? locale === 'tr'
                      ? 'Host Simülasyonunu Başlat'
                      : 'Launch Host Simulation'
                    : t.guestOnboarding.btnComplete}
                </span>
              </button>
            )}
          </div>
        </div>
      </footer>

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </div>
  );
}
