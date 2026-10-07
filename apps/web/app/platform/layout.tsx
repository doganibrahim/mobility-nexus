import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Platform',
  description: 'Erasmus+ mesleki eğitim hareketlilik platformu, eşleştirme motoru ve hibe simülatörü.',
};

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
