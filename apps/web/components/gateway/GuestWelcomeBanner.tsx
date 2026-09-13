'use client';

import React from 'react';
import { SignUpButton, SignInButton } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';

export interface GuestWelcomeBannerProps {
  onOpenTour: () => void;
  onStartDemo: () => void;
  onDismiss: () => void;
}

export default function GuestWelcomeBanner({
  onOpenTour,
  onStartDemo,
  onDismiss,
}: GuestWelcomeBannerProps) {
  const { t } = useTranslation();

  return (
    <div className="relative bg-white border-2 border-slate-300 rounded-2xl p-5 sm:p-7 shadow-xs animate-fadeIn overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Info Block */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>🇪🇺</span>
              <span>{t.guestBanner.badge}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{t.guestBanner.badge2}</span>
            </span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight m-0">
              {t.guestBanner.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed m-0">
              {t.guestBanner.desc}
            </p>
          </div>

          {/* 4 Feature Badges */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
              <span>✓</span>
              <span>{t.guestBanner.badge1}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
              <span>📊</span>
              <span>{t.guestBanner.badge3}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
              <span>🛡️</span>
              <span>{t.guestBanner.badge4}</span>
            </span>
          </div>
        </div>

        {/* Right CTA Actions Block */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 justify-center">
          <button
            type="button"
            onClick={onOpenTour}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <span>🚀</span>
            <span>{t.guestBanner.btnTour}</span>
          </button>

          <button
            type="button"
            onClick={onStartDemo}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold transition-all shadow-2xs cursor-pointer"
          >
            <span>✨</span>
            <span>{t.guestBanner.btnDemo}</span>
          </button>

          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 lg:border-t-0 lg:pt-0">
            <SignUpButton mode="modal">
              <button
                type="button"
                className="w-full text-center py-2 px-3 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              >
                {t.guestBanner.btnRegister}
              </button>
            </SignUpButton>

            <button
              type="button"
              onClick={onDismiss}
              className="text-xs text-slate-400 hover:text-slate-700 px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0"
              title={t.guestBanner.dismiss}
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
