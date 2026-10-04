'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import PlatformGuideView from '../../components/guide/PlatformGuideView';
import { useAppStore } from '../../lib/store';
import { useTranslation } from '../../lib/i18n';

export default function GuidePage() {
  const router = useRouter();
  const store = useAppStore();
  const { locale } = useTranslation();

  const handleRoleSelection = (role: 'SCHOOL' | 'HOST') => {
    if (role === 'HOST') {
      store.loadHostDemoData(locale);
    } else {
      store.loadDemoData(locale);
    }
    router.push(`/?view=${role}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <AppHeader />

      {/* Guide Top Navigation Breadcrumb Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <Link
              href="/"
              className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 transition-colors"
            >
              <span>←</span>
              <span>{locale === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-extrabold text-slate-900">
              {locale === 'tr' ? 'Platform Kullanım Kılavuzu' : 'Platform User Manual'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/school/pipeline"
              className="text-xs font-bold text-blue-700 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200 transition-colors"
            >
              <span>🚀</span> {locale === 'tr' ? '5 Adımlı Süreç Akışı' : '5-Step Pipeline'}
            </Link>
            <Link
              href="/marketplace"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 transition-colors"
            >
              <span>🎓</span> {locale === 'tr' ? 'Pazaryeri' : 'Marketplace'}
            </Link>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlatformGuideView
          showHeaderBanner={true}
          onSelectRole={handleRoleSelection}
        />
      </main>

      <AppFooter />
    </div>
  );
}
