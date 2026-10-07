import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'News & Events',
  description: 'Erasmus+ mesleki eğitim resmi çağrı takvimi, son başvuru tarihleri, etkinlikler ve arşiv akışı.',
};

export default function NewsAndEventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
