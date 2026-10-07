import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Library',
  description: 'Erasmus+ mesleki eğitim rehberleri, resmi form şablonları, hibe verileri ve açık kaynak kütüphanesi.',
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
