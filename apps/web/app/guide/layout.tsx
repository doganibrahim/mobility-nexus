import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform Kullanım Kılavuzu & Destek | ErasmusMobility',
  description: 'ErasmusMobility platformu kapsamlı kullanım rehberi, adım adım hareketlilik akışı ve okul kılavuzu.',
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
