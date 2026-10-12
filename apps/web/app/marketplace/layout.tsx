import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hareketlilik Pazaryeri • Mobility Marketplace | ErasmusMobility',
  description:
    'Avrupa mesleki eğitim kursları, işbaşı gözlem (job shadowing) kontenjanları ve okul katılım talepleri. European VET courses and job shadowing catalogue.',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
