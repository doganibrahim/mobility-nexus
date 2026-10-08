import React from 'react';
import { Metadata } from 'next';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import LegalDocumentView from '../../components/legal/LegalDocumentView';

export const metadata: Metadata = {
  title: 'Erişilebilirlik Beyanı • Accessibility Statement | ErasmusMobility',
  description:
    'ErasmusMobility WCAG 2.2 AA düzeyinde dijital erişilebilirlik taahhüdü, EN 301 549 ve Avrupa Erişilebilirlik Yasası (EAA) teknik standartları.',
  alternates: {
    canonical: 'https://www.erasmusmobility.com/accessibility',
  },
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <AppHeader />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegalDocumentView initialTab="ACCESSIBILITY" isModal={false} />
      </main>
      <AppFooter />
    </div>
  );
}
