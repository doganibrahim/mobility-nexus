'use client';

import React, { ReactNode } from 'react';

export type RoleTheme = 'SCHOOL' | 'HOST' | 'GRANT' | 'CMS' | 'NEUTRAL';

export interface RoleThemedCardProps {
  theme?: RoleTheme;
  title: string;
  subtitle?: string;
  icon?: string;
  badge?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  variant?: 'solid-header' | 'subtle-accent';
}

const THEME_STYLES: Record<
  RoleTheme,
  {
    cardBorder: string;
    headerBg: string;
    headerText: string;
    subtitleText: string;
    subtleBorderL: string;
    subtleHeaderBg: string;
    subtleTitleText: string;
    iconBg: string;
  }
> = {
  SCHOOL: {
    cardBorder: 'border-2 border-blue-500',
    headerBg: 'bg-blue-600 text-white',
    headerText: 'text-white',
    subtitleText: 'text-blue-100',
    subtleBorderL: 'border-l-4 border-l-blue-600 border-slate-200',
    subtleHeaderBg: 'bg-blue-50/70',
    subtleTitleText: 'text-blue-950',
    iconBg: 'bg-blue-100 text-blue-800',
  },
  HOST: {
    cardBorder: 'border-2 border-emerald-500',
    headerBg: 'bg-emerald-600 text-white',
    headerText: 'text-white',
    subtitleText: 'text-emerald-100',
    subtleBorderL: 'border-l-4 border-l-emerald-600 border-slate-200',
    subtleHeaderBg: 'bg-emerald-50/70',
    subtleTitleText: 'text-emerald-950',
    iconBg: 'bg-emerald-100 text-emerald-800',
  },
  GRANT: {
    cardBorder: 'border-2 border-amber-500',
    headerBg: 'bg-amber-600 text-white',
    headerText: 'text-white',
    subtitleText: 'text-amber-100',
    subtleBorderL: 'border-l-4 border-l-amber-500 border-slate-200',
    subtleHeaderBg: 'bg-amber-50/70',
    subtleTitleText: 'text-amber-950',
    iconBg: 'bg-amber-100 text-amber-900',
  },
  CMS: {
    cardBorder: 'border-2 border-purple-600',
    headerBg: 'bg-purple-700 text-white',
    headerText: 'text-white',
    subtitleText: 'text-purple-100',
    subtleBorderL: 'border-l-4 border-l-purple-600 border-slate-200',
    subtleHeaderBg: 'bg-purple-50/70',
    subtleTitleText: 'text-purple-950',
    iconBg: 'bg-purple-100 text-purple-800',
  },
  NEUTRAL: {
    cardBorder: 'border-2 border-slate-300',
    headerBg: 'bg-slate-900 text-white',
    headerText: 'text-white',
    subtitleText: 'text-slate-300',
    subtleBorderL: 'border-l-4 border-l-slate-800 border-slate-200',
    subtleHeaderBg: 'bg-slate-100',
    subtleTitleText: 'text-slate-950',
    iconBg: 'bg-slate-200 text-slate-800',
  },
};

export default function RoleThemedCard({
  theme = 'NEUTRAL',
  title,
  subtitle,
  icon,
  badge,
  headerAction,
  children,
  footer,
  className = '',
  variant = 'solid-header',
}: RoleThemedCardProps) {
  const styles = THEME_STYLES[theme] || THEME_STYLES.NEUTRAL;

  return (
    <div
      className={`bg-white rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between transition-all ${
        variant === 'solid-header' ? styles.cardBorder : styles.subtleBorderL
      } ${className}`}
    >
      {/* Card Header */}
      <div
        className={`px-5 sm:px-6 py-4 flex items-center justify-between gap-3 ${
          variant === 'solid-header' ? styles.headerBg : `${styles.subtleHeaderBg} border-b border-slate-200/80`
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                variant === 'solid-header' ? 'bg-white/15 text-white' : styles.iconBg
              }`}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0">
            <h3
              className={`text-base font-black tracking-tight m-0 truncate ${
                variant === 'solid-header' ? styles.headerText : styles.subtleTitleText
              }`}
            >
              {title}
            </h3>
            {subtitle && (
              <p
                className={`text-xs m-0 mt-0.5 truncate ${
                  variant === 'solid-header' ? styles.subtitleText : 'text-slate-600'
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge}
          {headerAction}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 sm:p-6 flex-1 space-y-4">{children}</div>

      {/* Optional Card Footer */}
      {footer && (
        <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-100 text-xs">
          {footer}
        </div>
      )}
    </div>
  );
}
