import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'User Guide',
  description: 'ErasmusMobility platformu kapsamlı kullanım rehberi, adım adım hareketlilik akışı ve okul kılavuzu.',
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
