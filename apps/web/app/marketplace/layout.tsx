import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mobility Marketplace',
  description: 'Avrupa mesleki eğitim kursları, işbaşı gözlem (job shadowing) kontenjanları ve okul katılım talepleri.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
