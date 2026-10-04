import React from 'react';
import { Metadata } from 'next';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import LegalDocumentView from '../../components/legal/LegalDocumentView';

export const metadata: Metadata = {
  title: 'Gizlilik Politikası & GDPR • Privacy Policy | ErasmusMobility',
  description:
    'ErasmusMobility KVKK ve GDPR uyumlu veri koruma aydınlatma metni ve gizlilik politikası.',
  alternates: {
    canonical: 'https://www.erasmusmobility.com/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <AppHeader />
      <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LegalDocumentView initialTab="LEGAL" isModal={false} />
      </main>
      <AppFooter />
    </div>
  );
}
