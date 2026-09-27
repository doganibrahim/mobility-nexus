'use client';

import React from 'react';
import Link from 'next/link';

export interface StatHighlightBadgeProps {
  value: string | number;
  label: string;
  sublabel?: string;
  accent?: 'blue' | 'emerald' | 'amber' | 'purple' | 'slate';
  icon?: string;
  badgeText?: string;
  linkHref?: string;
  linkLabel?: string;
}

const ACCENT_STYLES = {
  blue: {
    border: 'border-blue-200 hover:border-blue-400',
    topBorder: 'border-t-4 border-t-blue-600',
    badge: 'bg-blue-50 text-blue-900 border-blue-200',
    valueText: 'text-blue-950',
    iconBg: 'bg-blue-50 text-blue-700',
    link: 'text-blue-700 hover:text-blue-900',
  },
  emerald: {
    border: 'border-emerald-200 hover:border-emerald-400',
    topBorder: 'border-t-4 border-t-emerald-600',
    badge: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    valueText: 'text-emerald-950',
    iconBg: 'bg-emerald-50 text-emerald-700',
    link: 'text-emerald-700 hover:text-emerald-900',
  },
  amber: {
    border: 'border-amber-200 hover:border-amber-400',
    topBorder: 'border-t-4 border-t-amber-500',
    badge: 'bg-amber-50 text-amber-900 border-amber-200',
    valueText: 'text-amber-950',
    iconBg: 'bg-amber-50 text-amber-700',
    link: 'text-amber-700 hover:text-amber-900',
  },
  purple: {
    border: 'border-purple-200 hover:border-purple-400',
    topBorder: 'border-t-4 border-t-purple-600',
    badge: 'bg-purple-50 text-purple-900 border-purple-200',
    valueText: 'text-purple-950',
    iconBg: 'bg-purple-50 text-purple-700',
    link: 'text-purple-700 hover:text-purple-900',
  },
  slate: {
    border: 'border-slate-200 hover:border-slate-400',
    topBorder: 'border-t-4 border-t-slate-700',
    badge: 'bg-slate-100 text-slate-800 border-slate-200',
    valueText: 'text-slate-900',
    iconBg: 'bg-slate-100 text-slate-700',
    link: 'text-slate-700 hover:text-slate-950',
  },
};

export default function StatHighlightBadge({
  value,
  label,
  sublabel,
  accent = 'slate',
  icon,
  badgeText,
  linkHref,
  linkLabel,
}: StatHighlightBadgeProps) {
  const styles = ACCENT_STYLES[accent] || ACCENT_STYLES.slate;

  return (
    <div
      className={`bg-white rounded-2xl p-5 shadow-xs border ${styles.border} ${styles.topBorder} transition-all flex flex-col justify-between`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </span>
          {icon && (
            <span
              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${styles.iconBg}`}
            >
              {icon}
            </span>
          )}
        </div>

        <div className={`text-3xl sm:text-4xl font-black tracking-tight ${styles.valueText}`}>
          {value}
        </div>

        {sublabel && (
          <p className="text-xs text-slate-600 mt-2 leading-relaxed">
            {sublabel}
          </p>
        )}
      </div>

      <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
        {badgeText ? (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles.badge}`}
          >
            {badgeText}
          </span>
        ) : (
          <span />
        )}

        {linkHref && linkLabel && (
          <Link
            href={linkHref}
            className={`font-bold inline-flex items-center gap-1 transition-colors ${styles.link}`}
          >
            <span>{linkLabel}</span>
            <span>→</span>
          </Link>
        )}
      </div>
    </div>
  );
}
