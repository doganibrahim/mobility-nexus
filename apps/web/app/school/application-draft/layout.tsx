import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Başvuru Taslağı Asistanı / Application Draft Assistant | ErasmusMobility',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function ApplicationDraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
