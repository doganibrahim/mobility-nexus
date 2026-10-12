import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hareketlilik Planlama Süreci / Mobility Planning Pipeline | ErasmusMobility',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
