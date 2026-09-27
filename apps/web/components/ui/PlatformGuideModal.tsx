'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { SignInButton } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';
import { useAppStore } from '../../lib/store';
import {
  PLATFORM_GUIDE_DATA,
  GuideAudience,
  GuideTopic,
  GuideStepAction,
} from '../../lib/platform-guide-data';

export interface PlatformGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDemo?: (role: 'SCHOOL' | 'HOST') => void;
  initialAudience?: GuideAudience;
  initialTopicId?: string;
}

export default function PlatformGuideModal({
  isOpen,
  onClose,
  onStartDemo,
  initialAudience = 'SCHOOL',
  initialTopicId,
}: PlatformGuideModalProps) {
  const { locale, setLocale } = useTranslation();
  const store = useAppStore();

  const [activeAudience, setActiveAudience] = useState<GuideAudience>(initialAudience);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(initialTopicId || null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Sync initial props when opened
  useEffect(() => {
    if (isOpen) {
      if (initialAudience) setActiveAudience(initialAudience);
      if (initialTopicId) setSelectedTopicId(initialTopicId);
      setSearchQuery('');
    }
  }, [isOpen, initialAudience, initialTopicId]);

  // Handle escape key and outside click for lang dropdown
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
        if (selectedTopicId) {
          setSelectedTopicId(null);
        } else if (isLangDropdownOpen) {
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
  }, [isOpen, selectedTopicId, isLangDropdownOpen, dontShowAgain]);

  // Scroll to top when topic changes
  useEffect(() => {
    if (contentContainerRef.current) {
      contentContainerRef.current.scrollTop = 0;
    }
  }, [selectedTopicId, activeAudience]);

  const handleDismiss = () => {
    if (dontShowAgain && typeof window !== 'undefined') {
      try {
        localStorage.setItem('em_guest_onboarding_dismissed', 'true');
        localStorage.setItem('em_platform_guide_dismissed', 'true');
      } catch (err) {
        console.warn('LocalStorage write failed:', err);
      }
    }
    onClose();
  };

  const handleDemoLaunch = (role: 'SCHOOL' | 'HOST') => {
    if (dontShowAgain && typeof window !== 'undefined') {
      try {
        localStorage.setItem('em_guest_onboarding_dismissed', 'true');
        localStorage.setItem('em_platform_guide_dismissed', 'true');
      } catch (err) {
        console.warn('LocalStorage write failed:', err);
      }
    }
    if (role === 'HOST') {
      store.loadHostDemoData(locale);
    } else {
      store.loadDemoData(locale);
    }
    if (onStartDemo) {
      onStartDemo(role);
    }
    onClose();
  };

  const currentCategory = useMemo(() => {
    return (
      PLATFORM_GUIDE_DATA.find((c) => c.id === activeAudience) ||
      PLATFORM_GUIDE_DATA[0]
    );
  }, [activeAudience]);

  // Filter topics by search query
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) {
      return currentCategory.topics;
    }
    const q = searchQuery.toLowerCase().trim();
    return currentCategory.topics.filter((topic) => {
      const title = (locale === 'en' ? topic.titleEn : topic.titleTr).toLowerCase();
      const summary = (locale === 'en' ? topic.summaryEn : topic.summaryTr).toLowerCase();
      const goal = (locale === 'en' ? topic.goalEn : topic.goalTr).toLowerCase();
      const hasStepMatch = topic.steps.some((step) => {
        const action = (locale === 'en' ? step.actionEn : step.actionTr).toLowerCase();
        const stepTitle = (locale === 'en' ? step.titleEn : step.titleTr).toLowerCase();
        return action.includes(q) || stepTitle.includes(q);
      });
      return title.includes(q) || summary.includes(q) || goal.includes(q) || hasStepMatch;
    });
  }, [currentCategory, searchQuery, locale]);

  const activeTopic = useMemo(() => {
    if (!selectedTopicId) return null;
    for (const cat of PLATFORM_GUIDE_DATA) {
      const found = cat.topics.find((t) => t.id === selectedTopicId);
      if (found) return found;
    }
    return null;
  }, [selectedTopicId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-fadeIn overflow-hidden">
      <div
        className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-scaleIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-modal-title"
      >
        {/* TOP OFFICIAL STRIP & CONTROLS */}
        <div className="bg-slate-900 text-white px-4 py-3 sm:px-6 flex items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-lg shrink-0">
              📖
            </div>
            <div className="min-w-0">
              <h2
                id="guide-modal-title"
                className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2"
              >
                <span>
                  {locale === 'en'
                    ? 'ErasmusMobility Platform User Guide & Manual'
                    : 'ErasmusMobility Platform Kullanım Kılavuzu & Rehberi'}
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  EMaaS 2026/2027
                </span>
              </h2>
              <p className="text-[11px] text-slate-300 truncate hidden sm:block">
                {locale === 'en'
                  ? 'Step-by-step workflow guide, button directories & official Erasmus+ guidance'
                  : 'Adım adım ekran akışları, buton işlevleri ve resmi Erasmus+ uygulama rehberi'}
              </p>
            </div>
          </div>

          {/* Right Action Tools: Language, Print & Close */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Language Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                aria-label="Language Selector"
              >
                <span>{locale === 'en' ? '🇬🇧 EN' : '🇹🇷 TR'}</span>
                <svg
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                    isLangDropdownOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              {isLangDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-32 bg-slate-900 border border-slate-700 rounded-xl shadow-xl py-1 z-50 animate-fadeIn">
                  <button
                    type="button"
                    onClick={() => {
                      setLocale('tr');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-slate-800 transition-colors ${
                      locale === 'tr' ? 'text-blue-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>🇹🇷</span>
                    <span>Türkçe</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocale('en');
                      setIsLangDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-xs text-left flex items-center gap-2 hover:bg-slate-800 transition-colors ${
                      locale === 'en' ? 'text-blue-400 font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>🇬🇧</span>
                    <span>English</span>
                  </button>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg hidden sm:flex items-center gap-1 transition-colors cursor-pointer"
              title={locale === 'en' ? 'Print Guide / Save PDF' : 'Kılavuzu Yazdır / PDF İndir'}
            >
              <span>🖨️</span>
              <span className="hidden md:inline">{locale === 'en' ? 'Print' : 'Yazdır'}</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* LEVEL 1: MODULAR AUDIENCE / ROLE SELECTION TABS */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 sm:px-6 py-2 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {PLATFORM_GUIDE_DATA.map((category) => {
              const isSelected = activeAudience === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => {
                    setActiveAudience(category.id);
                    setSelectedTopicId(null);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-blue-700 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/80'
                  }`}
                >
                  <span className="text-sm">{category.icon}</span>
                  <span>{locale === 'en' ? category.labelEn : category.labelTr}</span>
                  <span
                    className={`hidden lg:inline-block px-1.5 py-0.5 rounded-md text-[10px] font-medium ${
                      isSelected ? 'bg-blue-800/80 text-blue-100' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {category.topics.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SEARCH & BREADCRUMB BAR */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            {selectedTopicId ? (
              <button
                type="button"
                onClick={() => setSelectedTopicId(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <span>←</span>
                <span>{locale === 'en' ? 'Back to Topic Cards' : 'Konu Kartlarına Dön'}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-bold text-slate-800">
                  {locale === 'en' ? currentCategory.badgeEn : currentCategory.badgeTr}:
                </span>
                <span className="text-xs text-slate-500 truncate hidden md:inline">
                  {locale === 'en' ? currentCategory.descriptionEn : currentCategory.descriptionTr}
                </span>
              </div>
            )}
          </div>

          {/* Quick Filter Search Input */}
          <div className="relative w-full sm:w-64 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                locale === 'en' ? 'Filter topics, steps, OID...' : 'Konu, adım veya OID ara...'
              }
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800 placeholder-slate-400"
            />
            <span className="absolute left-2.5 top-2 text-slate-400 text-xs">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* MAIN MODULAR CONTENT AREA */}
        <div
          ref={contentContainerRef}
          className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/60"
        >
          {/* VIEW A: DETAILED TOPIC DRILL-DOWN */}
          {activeTopic ? (
            <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
              {/* Topic Hero Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-2xl flex items-center justify-center shrink-0 shadow-2xs">
                      {activeTopic.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                          {activeAudience}
                        </span>
                        {activeTopic.route && (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                            {activeTopic.route}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                        {locale === 'en' ? activeTopic.titleEn : activeTopic.titleTr}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {locale === 'en' ? activeTopic.summaryEn : activeTopic.summaryTr}
                      </p>
                    </div>
                  </div>

                  {/* Route Jump or Demo Button */}
                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                    {activeTopic.route && (
                      <Link
                        href={activeTopic.route}
                        onClick={onClose}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-2xs transition-colors inline-flex items-center gap-1.5"
                      >
                        <span>
                          {locale === 'en'
                            ? activeTopic.routeLabelEn || 'Go to Page'
                            : activeTopic.routeLabelTr || 'Sayfaya Git'}
                        </span>
                        <span>→</span>
                      </Link>
                    )}
                    {activeTopic.demoRole && (
                      <button
                        type="button"
                        onClick={() => handleDemoLaunch(activeTopic.demoRole!)}
                        className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                      >
                        <span>⚡ {locale === 'en' ? 'Launch Demo' : 'Demoyu Yükle'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Goal & Highlights Box */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 sm:p-4 space-y-2">
                  <div className="text-xs text-slate-800">
                    <span className="font-bold text-slate-900">
                      🎯 {locale === 'en' ? 'Objective & Goal: ' : 'Amaç & Hedef: '}
                    </span>
                    {locale === 'en' ? activeTopic.goalEn : activeTopic.goalTr}
                  </div>

                  {activeTopic.keyHighlightsTr && (
                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="text-[11px] font-bold text-slate-700 block mb-1">
                        ✨ {locale === 'en' ? 'Key Highlights:' : 'Öne Çıkan Standartlar:'}
                      </span>
                      <ul className="grid sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600 list-disc list-inside">
                        {(locale === 'en'
                          ? activeTopic.keyHighlightsEn!
                          : activeTopic.keyHighlightsTr!
                        ).map((h, i) => (
                          <li key={i} className="leading-snug">
                            {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* STEP BY STEP ACTIONS LIST */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {locale === 'en'
                      ? `Step-by-Step Workflow (${activeTopic.steps.length} Steps)`
                      : `Adım Adım Ekran Akışı (${activeTopic.steps.length} Adım)`}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {locale === 'en' ? 'Follow steps sequentially' : 'Adımları sırasıyla uygulayın'}
                  </span>
                </div>

                <div className="space-y-3">
                  {activeTopic.steps.map((step: GuideStepAction) => (
                    <div
                      key={step.stepNumber}
                      className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow space-y-3"
                    >
                      {/* Step Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-full bg-blue-700 text-white text-xs font-extrabold flex items-center justify-center shrink-0 shadow-2xs">
                            {step.stepNumber}
                          </span>
                          <h5 className="text-xs sm:text-sm font-bold text-slate-900">
                            {locale === 'en' ? step.titleEn : step.titleTr}
                          </h5>
                        </div>

                        {/* UI Target Pill */}
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                          <span className="text-blue-600">🖱️</span>
                          <span>{locale === 'en' ? step.uiTargetEn : step.uiTargetTr}</span>
                        </div>
                      </div>

                      {/* Action Instruction */}
                      <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-9">
                        {locale === 'en' ? step.actionEn : step.actionTr}
                      </p>

                      {/* Sub-Boxes: Expected State & Expert Tip */}
                      <div className="pl-9 grid gap-2 pt-1">
                        {step.expectedStateTr && (
                          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg px-3 py-2 text-[11px] text-emerald-900 flex items-start gap-2">
                            <span className="font-bold shrink-0">⚙️ {locale === 'en' ? 'Result:' : 'Sonuç:'}</span>
                            <span className="leading-snug">
                              {locale === 'en' ? step.expectedStateEn : step.expectedStateTr}
                            </span>
                          </div>
                        )}

                        {step.expertTipTr && (
                          <div className="bg-amber-50/70 border border-amber-200/80 rounded-lg px-3 py-2 text-[11px] text-amber-900 flex items-start gap-2">
                            <span className="font-bold shrink-0">💡 {locale === 'en' ? 'Tip:' : 'İpucu:'}</span>
                            <span className="leading-snug">
                              {locale === 'en' ? step.expertTipEn : step.expertTipTr}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Pagination within Topics */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedTopicId(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  ← {locale === 'en' ? 'All Topics' : 'Tüm Konular'}
                </button>

                {activeTopic.route && (
                  <Link
                    href={activeTopic.route}
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>
                      {locale === 'en'
                        ? activeTopic.routeLabelEn || 'Open Module'
                        : activeTopic.routeLabelTr || 'Modülü Aç'}
                    </span>
                    <span>→</span>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* VIEW B: MODULAR TOPIC CARDS GRID (LEVEL 2) */
            <div className="space-y-6">
              {/* Category Introduction Header */}
              <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 text-xl flex items-center justify-center shrink-0">
                    {currentCategory.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">
                      {locale === 'en' ? currentCategory.labelEn : currentCategory.labelTr}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {locale === 'en' ? currentCategory.descriptionEn : currentCategory.descriptionTr}
                    </p>
                  </div>
                </div>

                {/* Instant Demo Quick Start if applicable */}
                {activeAudience === 'SCHOOL' && (
                  <button
                    type="button"
                    onClick={() => handleDemoLaunch('SCHOOL')}
                    className="px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <span>⚡</span>
                    <span>{locale === 'en' ? 'Instant School Demo' : 'Hızlı Okul Demosunu Başlat'}</span>
                  </button>
                )}
                {activeAudience === 'HOST' && (
                  <button
                    type="button"
                    onClick={() => handleDemoLaunch('HOST')}
                    className="px-3.5 py-2 text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl shadow-2xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
                  >
                    <span>⚡</span>
                    <span>{locale === 'en' ? 'Instant Host Demo' : 'Hızlı Host Demosunu Başlat'}</span>
                  </button>
                )}
              </div>

              {/* Cards Grid */}
              {filteredTopics.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {filteredTopics.map((topic: GuideTopic) => (
                    <div
                      key={topic.id}
                      onClick={() => setSelectedTopicId(topic.id)}
                      className="bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-md hover:border-blue-300 transition-all duration-150 flex flex-col justify-between group cursor-pointer"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 text-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {topic.icon}
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                            {topic.steps.length} {locale === 'en' ? 'Steps' : 'Adım'}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                            {locale === 'en' ? topic.titleEn : topic.titleTr}
                          </h4>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                            {locale === 'en' ? topic.summaryEn : topic.summaryTr}
                          </p>
                        </div>

                        {/* Highlights Pills */}
                        {topic.keyHighlightsTr && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {(locale === 'en' ? topic.keyHighlightsEn! : topic.keyHighlightsTr!)
                              .slice(0, 2)
                              .map((h, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-slate-50 border border-slate-200 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[280px]"
                                >
                                  • {h}
                                </span>
                              ))}
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions */}
                      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700">
                        <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                          <span>{locale === 'en' ? 'Learn & Explore Steps' : 'Öğren & Adımları İncele'}</span>
                          <span>→</span>
                        </span>
                        {topic.route && (
                          <span className="text-[10px] font-mono text-slate-400 font-normal">
                            {topic.route}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-3">
                  <div className="text-3xl">🔍</div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {locale === 'en' ? 'No topics matching your filter' : 'Aramanızla eşleşen konu bulunamadı'}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {locale === 'en'
                      ? 'Try clearing the search query to see all available workflow cards.'
                      : 'Mevcut tüm kartları görmek için arama kutusunu temizleyebilirsiniz.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="px-3 py-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    {locale === 'en' ? 'Clear Filter' : 'Filtreyi Temizle'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* BOTTOM ACTION DOCK (GUEST DEMO & PERSISTENCE CONTROLS) */}
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-3 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Don't show again checkbox */}
          <label className="flex items-center gap-2 text-xs text-slate-600 select-none cursor-pointer self-start sm:self-auto">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-4 h-4 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span>
              {locale === 'en'
                ? 'Do not show automatically on startup'
                : 'Açılışta otomatik gösterme (Dilediğinizde Kütüphaneden açabilirsiniz)'}
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handleDismiss}
              className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {locale === 'en' ? 'Close' : 'Kapat'}
            </button>

            {/* Quick Demo Launches if not signed in */}
            <button
              type="button"
              onClick={() => handleDemoLaunch('SCHOOL')}
              className="px-3 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors cursor-pointer shadow-xs hidden sm:inline-flex items-center gap-1.5"
            >
              <span>🏛️</span>
              <span>{locale === 'en' ? 'School Demo' : 'Okul Demosu'}</span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoLaunch('HOST')}
              className="px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer hidden md:inline-flex items-center gap-1.5"
            >
              <span>🏢</span>
              <span>{locale === 'en' ? 'Host Demo' : 'Host Demosu'}</span>
            </button>

            <SignInButton mode="modal">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                {locale === 'en' ? 'Sign In / Register' : 'Giriş Yap / Kaydol'}
              </button>
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
}
