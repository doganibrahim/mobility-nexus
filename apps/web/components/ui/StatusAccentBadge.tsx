'use client';

import React from 'react';

export type StatusAccentType =
  | 'APPROVED'
  | 'PENDING'
  | 'ACTION_REQUIRED'
  | 'INFO'
  | 'REJECTED'
  | 'DRAFT';

export interface StatusAccentBadgeProps {
  status: StatusAccentType;
  label?: string;
  icon?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIGS: Record<
  StatusAccentType,
  { defaultLabel: string; defaultIcon: string; classes: string }
> = {
  APPROVED: {
    defaultLabel: 'Onaylandı',
    defaultIcon: '✓',
    classes: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  PENDING: {
    defaultLabel: 'İnceleniyor',
    defaultIcon: '⏳',
    classes: 'bg-amber-100 text-amber-950 border-amber-300',
  },
  ACTION_REQUIRED: {
    defaultLabel: 'Aksiyon Gerekli',
    defaultIcon: '⚠️',
    classes: 'bg-indigo-100 text-indigo-950 border-indigo-300',
  },
  INFO: {
    defaultLabel: 'Bilgilendirme',
    defaultIcon: 'ℹ️',
    classes: 'bg-blue-100 text-blue-950 border-blue-300',
  },
  REJECTED: {
    defaultLabel: 'Reddedildi',
    defaultIcon: '✕',
    classes: 'bg-rose-100 text-rose-950 border-rose-300',
  },
  DRAFT: {
    defaultLabel: 'Taslak',
    defaultIcon: '✏️',
    classes: 'bg-slate-200 text-slate-800 border-slate-300',
  },
};

export default function StatusAccentBadge({
  status,
  label,
  icon,
  size = 'md',
}: StatusAccentBadgeProps) {
  const config = STATUS_CONFIGS[status] || STATUS_CONFIGS.INFO;
  const displayLabel = label || config.defaultLabel;
  const displayIcon = icon !== undefined ? icon : config.defaultIcon;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs font-bold gap-1'
      : 'px-3 py-1 text-xs font-extrabold gap-1.5';

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs transition-colors shrink-0 ${config.classes} ${sizeClasses}`}
    >
      {displayIcon && <span>{displayIcon}</span>}
      <span>{displayLabel}</span>
    </span>
  );
}
