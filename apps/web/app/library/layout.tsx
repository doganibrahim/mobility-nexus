import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kütüphane • Library | ErasmusMobility',
  description:
    'Erasmus+ mesleki eğitim rehberleri, resmi form şablonları, hibe verileri ve açık kaynak kütüphanesi. Erasmus+ VET official documentation and open library.',
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
