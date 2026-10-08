'use client';

import React from 'react';
import { Euro, Sparkles } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface GrantBadgeProps {
  days?: number;
  participants?: number;
  showTotal?: boolean;
  className?: string;
}

export function GrantBadge({
  days = 5,
  participants = 1,
  showTotal = false,
  className = '',
}: GrantBadgeProps) {
  const { locale } = useTranslation();
  const cappedDays = Math.min(Math.max(days, 1), 10);
  const totalPerPerson = cappedDays * 80;
  const grandTotal = participants * totalPerPerson;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs ${className}`}
      title={
        locale === 'tr'
          ? 'Erasmus+ Resmi Kurs Ücreti Hibesi: Günlük 80 € / Maksimum 800 € (10 güne kadar)'
          : 'Erasmus+ Official Course Fee Grant: 80 € / day (Max. 800 € for up to 10 days)'
      }
    >
      <Euro className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span>{locale === 'tr' ? '80 €/gün' : '80 €/day'}</span>
      <span className="text-emerald-400">•</span>
      {showTotal ? (
        <span className="font-bold text-emerald-900">
          {grandTotal.toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-US')} € {locale === 'tr' ? 'Hibe' : 'Grant'} ({participants} {locale === 'tr' ? 'Kişi' : 'Pax'} / {days} {locale === 'tr' ? 'Gün' : 'Days'})
        </span>
      ) : (
        <span className="text-emerald-700">
          {locale === 'tr' ? 'Maks. 800 € (10 Gün)' : 'Max. 800 € (10 Days)'}
        </span>
      )}
    </div>
  );
}
