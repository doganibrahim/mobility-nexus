import React from 'react';
import { Metadata } from 'next';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import LegalDocumentView from '../../components/legal/LegalDocumentView';

export const metadata: Metadata = {
  title: 'Kullanım Koşulları • Terms of Service | ErasmusMobility',
  description:
    'ErasmusMobility platform katılım koşulları, sorumluluğun sınırlandırılması ve kurumsal hizmet şartları.',
  alternates: {
    canonical: 'https://www.erasmusmobility.com/terms',
  },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <AppHeader />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegalDocumentView initialTab="TERMS" isModal={false} />
      </main>
      <AppFooter />
    </div>
  );
}
