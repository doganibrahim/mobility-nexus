import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Application Draft Assistant',
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
