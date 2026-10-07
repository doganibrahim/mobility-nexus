import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '../lib/theme-context';
import { LanguageProvider } from '../lib/i18n';
import { AccessibilityProvider } from '../lib/accessibility-context';
import { SkipToContent } from '../components/ui/SkipToContent';
import UserOrgSync from '../components/auth/UserOrgSync';
import ErasmusChatWidget from '../components/chat/ErasmusChatWidget';
import { clerkTrLocalization } from '../lib/clerk-tr';

// 1. Google Fonts with full Turkish (Latin-Extended) support
const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: {
    default: 'Home | ErasmusMobility',
    template: '%s | ErasmusMobility',
  },
  description:
    'KA121-VET / KA122-VET karar, ESCO–ISCED eşleştirme, competence assessment ve EU host matching aracı. Erasmus Mobility Management as a Service (EMaaS).',
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

// 2. Custom Clerk Theme matching ErasmusMobility Design System
const clerkAppearance = {
  layout: {
    logoImageUrl: '/images/logo.png',
    logoPlacement: 'inside' as const,
    socialButtonsPlacement: 'top' as const,
    socialButtonsVariant: 'blockButton' as const,
    helpPageUrl: '/contact',
    privacyPageUrl: '/about',
    termsPageUrl: '/about',
  },
  variables: {
    colorPrimary: '#1d4ed8', // Royal Blue (Blue 700) matching platform theme
    colorText: '#0f172a',
    colorTextSecondary: '#475569',
    colorBackground: '#ffffff',
    colorInputBackground: '#ffffff',
    colorInputText: '#0f172a',
    borderRadius: '1rem', // 16px (rounded-2xl)
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    fontSize: '0.875rem',
  },
  elements: {
    rootBox: 'w-full max-w-[460px] mx-auto',
    cardBox: 'w-full rounded-2xl shadow-2xl overflow-hidden border border-slate-200/90 bg-white m-0 p-0',
    card: 'border-0 rounded-none shadow-none bg-white p-5 sm:p-6 w-full m-0',
    modalContent: 'rounded-2xl overflow-hidden max-w-[460px] bg-transparent shadow-none border-0 p-0',
    modalBackdrop: 'backdrop-blur-sm bg-slate-900/60',
    footer: 'bg-slate-50/90 border-t border-slate-200/80 m-0 py-3.5 px-6 rounded-none',
    footerAction: 'mb-2.5 flex items-center justify-center gap-1.5',
    footerActionText: 'text-xs text-slate-600',
    footerActionLink: 'text-xs text-blue-700 hover:text-blue-900 font-bold hover:underline ml-1',
    headerTitle: 'font-black text-slate-950 text-lg sm:text-xl tracking-tight text-center',
    headerSubtitle: 'text-xs text-slate-600 text-center leading-relaxed mt-0.5',
    formButtonPrimary:
      'bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white font-extrabold rounded-xl text-xs py-2.5 px-4 shadow-sm hover:shadow transition-all cursor-pointer',
    socialButtonsBlockButton:
      'border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-xs text-slate-800 transition-all shadow-2xs py-2.5',
    socialButtonsBlockButtonText: 'font-bold text-slate-800 text-xs',
    dividerLine: 'bg-slate-200',
    dividerText: 'text-slate-400 text-[10px] font-extrabold uppercase tracking-widest',
    formFieldLabel: 'font-bold text-slate-700 text-xs',
    formFieldInput:
      'rounded-xl border border-slate-300 bg-white text-slate-900 text-xs px-3.5 py-2.5 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all',
    identityPreviewText: 'font-bold text-slate-900',
    userButtonPopoverCard: 'border border-slate-200 rounded-2xl shadow-xl',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="theme-01" className={`${inter.variable} ${plusJakartaSans.variable}`} suppressHydrationWarning>
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
      <body className={`${inter.className} antialiased selection:bg-black selection:text-white`} suppressHydrationWarning>
        <ClerkProvider appearance={clerkAppearance} localization={clerkTrLocalization}>
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