import React from 'react';
import { Metadata } from 'next';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import LegalDocumentView from '../../components/legal/LegalDocumentView';

export const metadata: Metadata = {
  title: 'Çerez Politikası • Cookie Policy | ErasmusMobility',
  description:
    'ErasmusMobility platformu çerez politikası, zorunlu ve işlevsel çerez yönetimi kılavuzu.',
  alternates: {
    canonical: 'https://www.erasmusmobility.com/cookies',
  },
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <AppHeader />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegalDocumentView initialTab="COOKIES" isModal={false} />
      </main>
      <AppFooter />
    </div>
  );
}
