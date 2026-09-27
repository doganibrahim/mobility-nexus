'use client';

import React from 'react';
import { Award, Compass, Users, BookOpen, Layers } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface MobilityGuidanceBadgeProps {
  path: string;
  size?: 'sm' | 'md';
}

export function MobilityGuidanceBadge({ path, size = 'md' }: MobilityGuidanceBadgeProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  let label = isTr ? 'Konsorsiyum Desteği' : 'Consortium Support';
  let badgeClasses = 'bg-blue-50 text-blue-800 border-blue-200';
  let icon = <Compass className="w-3.5 h-3.5" />;

  switch (path) {
    case 'KA121_BUDGET_REQUEST':
      label = isTr ? 'KA121 Bütçe Tahsisi (Akredite)' : 'KA121 Budget Allocation (Accredited)';
      badgeClasses = 'bg-emerald-50 text-emerald-800 border-emerald-200';
      icon = <Award className="w-3.5 h-3.5 text-emerald-600" />;
      break;
    case 'KA122_SHORT_TERM':
      label = isTr ? 'KA122 Kısa Dönemli Başvuru' : 'KA122 Short-term Application';
      badgeClasses = 'bg-amber-50 text-amber-800 border-amber-200';
      icon = <BookOpen className="w-3.5 h-3.5 text-amber-600" />;
      break;
    case 'CONSORTIUM_PARTNER':
      label = isTr ? 'Uluslararası Konsorsiyum Ortağı' : 'International Consortium Partner';
      badgeClasses = 'bg-indigo-50 text-indigo-800 border-indigo-200';
      icon = <Users className="w-3.5 h-3.5 text-indigo-600" />;
      break;
    case 'ACCREDITATION_PREP':
      label = isTr ? 'Akreditasyon Hazırlık Süreci' : 'Accreditation Preparation Path';
      badgeClasses = 'bg-purple-50 text-purple-800 border-purple-200';
      icon = <Layers className="w-3.5 h-3.5 text-purple-600" />;
      break;
    default:
      label = isTr ? 'Ücretsiz Destek ve Eşleşme' : 'Free Support & Matching';
      badgeClasses = 'bg-slate-100 text-slate-800 border-slate-200';
      icon = <Compass className="w-3.5 h-3.5 text-slate-600" />;
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border transition-all ${badgeClasses} ${padding}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
}
