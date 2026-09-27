'use client';

import React from 'react';
import { Euro, Sparkles } from 'lucide-react';

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
  const cappedDays = Math.min(Math.max(days, 1), 10);
  const totalPerPerson = cappedDays * 80;
  const grandTotal = participants * totalPerPerson;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-xs ${className}`}
      title="Erasmus+ Resmi Kurs Ücreti Hibesi: Günlük 80 € / Maksimum 800 € (10 gün)"
    >
      <Euro className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
      <span>80 €/gün</span>
      <span className="text-emerald-400">•</span>
      {showTotal ? (
        <span className="font-bold text-emerald-900">
          {grandTotal.toLocaleString('tr-TR')} € Hibe ({participants} Kişi / {days} Gün)
        </span>
      ) : (
        <span className="text-emerald-700">Maks. 800 € (10 Gün)</span>
      )}
    </div>
  );
}
