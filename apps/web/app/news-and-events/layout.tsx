import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Haberler ve Etkinlikler • News & Events | ErasmusMobility',
  description:
    'Erasmus+ mesleki eğitim resmi çağrı takvimi, son başvuru tarihleri, etkinlikler ve arşiv akışı. Erasmus+ VET official calls and event updates.',
};

export default function NewsAndEventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
