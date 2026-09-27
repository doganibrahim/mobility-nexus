'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';

export function SkipToContent() {
  const { locale } = useTranslation();

  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-blue-800 focus:text-white focus:rounded-xl focus:shadow-2xl focus:font-bold focus:text-xs focus:ring-2 focus:ring-white focus:outline-hidden transition-all"
    >
      {locale === 'tr' ? '⏩ Ana İçeriğe Atla (Skip to Content)' : '⏩ Skip to Main Content'}
    </a>
  );
}
