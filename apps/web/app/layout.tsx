import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../lib/theme-context';
import { LanguageProvider } from '../lib/i18n';

export const metadata: Metadata = {
  title: 'CAPPINNO Mobility Nexus | EU VET Matching & Competence Gateway',
  description:
    'KA121-VET / KA122-VET karar, ESCO–ISCED eslestirme, competence assessment ve EU host matching araci. Erasmus Mobility Management as a Service (EMaaS).',
  keywords: [
    'Erasmus+',
    'KA121',
    'KA122',
    'VET',
    'ESCO',
    'ISCED-F',
    'Mobility Matching',
    'Competence Gateway',
    'CAPPINNO',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="theme-01" suppressHydrationWarning>
      <body className="antialiased selection:bg-black selection:text-white" suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
