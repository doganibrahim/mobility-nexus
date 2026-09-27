import {ClerkProvider} from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../lib/theme-context';
import { LanguageProvider } from '../lib/i18n';
import { AccessibilityProvider } from '../lib/accessibility-context';
import { SkipToContent } from '../components/ui/SkipToContent';
import UserOrgSync from '../components/auth/UserOrgSync';
import ErasmusChatWidget from '../components/chat/ErasmusChatWidget';

export const metadata: Metadata = {
  title: 'ErasmusMobility | EU VET Matching & Competence Gateway',
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
    'ErasmusMobility',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="theme-01" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var loc = localStorage.getItem('em_locale') || localStorage.getItem('cappinno_locale');
                if (loc === 'en' || loc === 'tr') {
                  document.documentElement.lang = loc;
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="antialiased selection:bg-black selection:text-white" suppressHydrationWarning>
        <ClerkProvider>
          <UserOrgSync />
          <ThemeProvider>
            <LanguageProvider>
              <AccessibilityProvider>
                <SkipToContent />
                {children}
                <ErasmusChatWidget />
              </AccessibilityProvider>
            </LanguageProvider>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}