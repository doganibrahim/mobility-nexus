'use client';

import React, { useEffect, useState } from 'react';
import { useTranslation } from '../../lib/i18n';

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GOOGLE_APPOINTMENT_SHORT_LINK = 'https://calendar.app.google/TU3JUa5FCVBW1Rzi9';
const GOOGLE_APPOINTMENT_EMBED_URL =
  'https://calendar.google.com/calendar/appointments/schedules/AcZssZ1TH4CJRdFctxbF4ZdlfsyPELnmzTbLdUUdwXX8k1SdTH0bnXvZSjW1BzuMHCZAdMcfgv-XMAyU?gv=true';

export default function AppointmentModal({ isOpen, onClose }: AppointmentModalProps) {
  const { locale } = useTranslation();
  const [isIframeLoading, setIsIframeLoading] = useState(true);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setIsIframeLoading(true);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="appointment-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity z-0"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Container */}
        <div className="relative z-10 inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 w-full sm:max-w-4xl sm:align-middle border-2 border-slate-300">
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-200 shadow-2xs">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <h3
                  id="appointment-modal-title"
                  className="text-base sm:text-lg font-black text-slate-900 tracking-tight"
                >
                  {locale === 'tr' ? 'Online Randevu Planla' : 'Schedule an Online Appointment'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {locale === 'tr'
                    ? 'ErasmusMobility • Erasmus+ VET & Hareketlilik Danışmanlığı'
                    : 'ErasmusMobility • Erasmus+ VET & Mobility Advisory'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={GOOGLE_APPOINTMENT_SHORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                title={locale === 'tr' ? "Google Takvim'de Aç" : 'Open in Google Calendar'}
              >
                <span>{locale === 'tr' ? "Google'da Aç" : 'Open in Google'}</span>
                <span>↗</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Kapat"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Info Bar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                <span>⏱️</span>
                <span>{locale === 'tr' ? '30 Dakika' : '30 Minutes'}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                <span>✓</span>
                <span>{locale === 'tr' ? 'Ücretsiz Danışmanlık' : 'Free Consultation'}</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 text-blue-700 font-semibold">
                <span>📹</span>
                <span>Google Meet</span>
              </span>
            </div>

            <a
              href={GOOGLE_APPOINTMENT_SHORT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-700 hover:underline inline-flex items-center gap-1"
            >
              <span>{locale === 'tr' ? 'Yeni Sekmede Randevu Al' : 'Book in New Tab'}</span>
              <span>↗</span>
            </a>
          </div>

          {/* Calendar Iframe / Embed Container */}
          <div className="relative bg-white min-h-[580px] sm:min-h-[640px] w-full flex flex-col">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 gap-3">
                <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <div className="text-xs font-bold text-slate-700">
                  {locale === 'tr' ? 'Google Randevu Takvimi Yükleniyor...' : 'Loading Google Appointment Calendar...'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {locale === 'tr' ? 'Lütfen birkaç saniye bekleyin' : 'Please wait a few seconds'}
                </div>
              </div>
            )}

            <iframe
              src={GOOGLE_APPOINTMENT_EMBED_URL}
              className="w-full flex-1 border-0 min-h-[580px] sm:min-h-[640px]"
              onLoad={() => setIsIframeLoading(false)}
              title="Google Calendar Appointment Scheduling"
            />
          </div>

          {/* Footer Bar */}
          <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="text-slate-500">
              {locale === 'tr'
                ? 'Randevunuz onaylandığında Google Meet bağlantısı otomatik iletilir.'
                : 'Google Meet link is sent automatically once booked.'}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={GOOGLE_APPOINTMENT_SHORT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-2xs inline-flex items-center gap-1"
              >
                <span>{locale === 'tr' ? 'Doğrudan Google ile Aç' : 'Open Directly with Google'}</span>
                <span>↗</span>
              </a>
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                {locale === 'tr' ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
