import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'İletişim | ErasmusMobility',
  description: 'Erasmus+ mesleki eğitim projeleriniz, akreditasyon yıllık planı ve host eşleşmeleri için kurumsal iletişim masası.',
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
