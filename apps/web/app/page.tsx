'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';
import CookieBanner from '../components/ui/CookieBanner';
import LegalModal from '../components/ui/LegalModal';
import AdminDashboardView from '../components/dashboard/AdminDashboardView';
import HostDashboardView from '../components/dashboard/HostDashboardView';
import SchoolDashboardView from '../components/dashboard/SchoolDashboardView';
import GuestWelcomeBanner from '../components/gateway/GuestWelcomeBanner';
import GuestOnboardingModal from '../components/ui/GuestOnboardingModal';

import { useTranslation } from '../lib/i18n';
import { useAppStore } from '../lib/store';

export default function Home() {
  const { t, locale } = useTranslation();
  const store = useAppStore();

  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [isGuestTourOpen, setIsGuestTourOpen] = useState(false);
  const [isBannerDismissed, setIsBannerDismissed] = useState(false);

  // Guest role exploration mode ('SCHOOL' | 'HOST')
  const [guestMode, setGuestMode] = useState<'SCHOOL' | 'HOST'>('SCHOOL');

  // User Authentication & Platform Role Detection
  const { user, isLoaded: isUserLoaded, isSignedIn } = useUser();

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

  // Simulation mode for admins ('ADMIN' | 'SCHOOL' | 'HOST')
  const [adminSimulationMode, setAdminSimulationMode] = useState<'ADMIN' | 'SCHOOL' | 'HOST'>('ADMIN');

  // Determine current active view:
  // - Admin (default: 'ADMIN', can switch to 'SCHOOL' or 'HOST' to simulate)
  // - Host: 'HOST'
  // - School: 'SCHOOL'
  // - Guest: guestMode ('SCHOOL' | 'HOST', default: 'SCHOOL')
  const isHostUser = store.orgType === 'HOST' || Boolean(store.currentHost);
  let effectiveView: 'ADMIN' | 'HOST' | 'SCHOOL' = 'SCHOOL';

  if (isAdmin) {
    effectiveView = adminSimulationMode;
  } else if (isSignedIn) {
    if (isHostUser) {
      effectiveView = 'HOST';
    } else {
      effectiveView = 'SCHOOL';
    }
  } else {
    // Unauthenticated Guest
    effectiveView = guestMode;
  }

  // Automatic onboarding tour trigger for first-time unauthenticated visitors
  useEffect(() => {
    if (isUserLoaded && !isSignedIn) {
      try {
        const tourDismissed =
          localStorage.getItem('em_guest_onboarding_dismissed') ||
          localStorage.getItem('cappinno_guest_onboarding_dismissed');
        if (!tourDismissed) {
          const timer = setTimeout(() => setIsGuestTourOpen(true), 600);
          return () => clearTimeout(timer);
        }
        const bannerDismissed =
          sessionStorage.getItem('em_guest_banner_dismissed') ||
          sessionStorage.getItem('cappinno_guest_banner_dismissed');
        if (bannerDismissed) {
          setIsBannerDismissed(true);
        }
      } catch (err) {
        // Fallback for restricted storage environments
      }
    }
  }, [isUserLoaded, isSignedIn]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-150">
      {/* 1. Official Erasmus+ Header */}
      <AppHeader />

      {/* Persistent Simulation Mode Banner for Platform Admin */}
      {isAdmin && adminSimulationMode !== 'ADMIN' && (
        <div className="bg-slate-900 text-white px-4 py-2.5 text-xs font-bold flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs border-b border-slate-700 sticky top-[57px] sm:top-[69px] z-30">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
            <span className="leading-snug">
              {t.simulation.bannerTitle}: {adminSimulationMode === 'SCHOOL' ? t.simulation.viewingAsSchool : t.simulation.viewingAsHost}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {adminSimulationMode === 'SCHOOL' ? (
              <button
                type="button"
                onClick={() => setAdminSimulationMode('HOST')}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-semibold transition-colors"
              >
                {t.simulation.switchToHost}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAdminSimulationMode('SCHOOL')}
                className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-md text-[11px] font-semibold transition-colors"
              >
                {t.simulation.switchToSchool}
              </button>
            )}
            <button
              type="button"
              onClick={() => setAdminSimulationMode('ADMIN')}
              className="px-3 py-1 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-md transition-colors text-xs"
            >
              {t.simulation.backToAdmin}
            </button>
          </div>
        </div>
      )}

      {/* Guest Role Exploration & Demo Bar (For unauthenticated visitors) */}
      {!isSignedIn && (
        <div className="bg-white border-b-2 border-slate-200 px-4 sm:px-6 py-3 no-print">
          <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                <span>🔍</span>
                <span>{locale === 'tr' ? 'Demo Keşif Modu' : 'Guest Demo Mode'}</span>
              </span>
              <span className="text-xs text-slate-600 hidden md:inline">
                {locale === 'tr'
                  ? 'Giriş yapmadan iki temel kurumsal rolü canlı verilerle deneyimleyebilirsiniz:'
                  : 'Explore two core institutional roles with live demo data without logging in:'}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setGuestMode('SCHOOL');
                  store.loadDemoData(locale);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  guestMode === 'SCHOOL'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>🏛️</span>
                <span>{locale === 'tr' ? 'Okul Paneli' : 'School View'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setGuestMode('HOST');
                  store.loadHostDemoData(locale);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  guestMode === 'HOST'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>🏢</span>
                <span>{locale === 'tr' ? 'Host Paneli' : 'Host View'}</span>
              </button>

              <Link
                href="/school/pipeline"
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs flex items-center gap-1.5 ml-1"
              >
                <span>🚀</span>
                <span>{locale === 'tr' ? '5 Adımlı Pipeline' : '5-Step Pipeline'}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
        {/* Guest Welcome Banner for Unauthenticated Visitors */}
        {!isSignedIn && !isBannerDismissed && (
          <GuestWelcomeBanner
            onOpenTour={() => setIsGuestTourOpen(true)}
            onStartDemo={() => {
              store.loadDemoData(locale);
              setGuestMode('SCHOOL');
            }}
            onDismiss={() => {
              setIsBannerDismissed(true);
              try {
                sessionStorage.setItem('em_guest_banner_dismissed', 'true');
              } catch (e) {}
            }}
          />
        )}

        {/* VIEW 1: ADMIN DASHBOARD */}
        {effectiveView === 'ADMIN' ? (
          <AdminDashboardView
            onSwitchView={(view) => setAdminSimulationMode(view)}
            userEmail={userEmail}
          />
        ) : effectiveView === 'HOST' ? (
          /* VIEW 2: HOST ORGANISATION DASHBOARD */
          <HostDashboardView
            hostData={store.currentHost}
            onUpdateHost={store.setCurrentHost}
            isSimulated={isAdmin && adminSimulationMode === 'HOST'}
          />
        ) : (
          /* VIEW 3: SCHOOL DASHBOARD */
          <SchoolDashboardView
            isSimulated={isAdmin && adminSimulationMode === 'SCHOOL'}
          />
        )}
      </main>

      {/* Institutional Footer */}
      <AppFooter />

      {/* Cookie Consent Banner */}
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />

      {/* Direct Cookie Preferences Modal */}
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />

      {/* Interactive Guest Onboarding Modal */}
      <GuestOnboardingModal
        isOpen={isGuestTourOpen}
        onClose={() => setIsGuestTourOpen(false)}
        onStartDemo={(role) => {
          if (role === 'SCHOOL') {
            if (isAdmin) {
              setAdminSimulationMode('SCHOOL');
            } else {
              setGuestMode('SCHOOL');
            }
          } else if (role === 'HOST') {
            if (isAdmin) {
              setAdminSimulationMode('HOST');
            } else {
              setGuestMode('HOST');
            }
          }
        }}
      />
    </div>
  );
}
