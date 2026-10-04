import React from 'react';
import { Metadata } from 'next';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import LegalDocumentView from '../../components/legal/LegalDocumentView';

export const metadata: Metadata = {
  title: 'KVKK Aydınlatma Metni • Kişisel Verilerin Korunması | ErasmusMobility',
  description:
    '6698 sayılı Kişisel Verilerin Korunması Kanunu uyarınca ErasmusMobility aydınlatma metni ve veri sorumlusu bilgilendirmesi.',
  alternates: {
    canonical: 'https://www.erasmusmobility.com/kvkk',
  },
};

export default function KvkkPage() {
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
