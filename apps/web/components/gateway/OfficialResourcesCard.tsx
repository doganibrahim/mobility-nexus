'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { useTranslation } from '../../lib/i18n';

export default function OfficialResourcesCard() {
  const { t } = useTranslation();

  return (
    <NeoCard
      title={t.official.title}
      badge="Resmî Rehberler"
      badgeType="primary"
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600 leading-relaxed m-0">
          {t.official.info}
        </p>

        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">⚠️ {t.official.disclaimer.split(':')[0]}:</strong>{' '}
          <span className="text-amber-800">{t.official.disclaimer.split(':')[1]}</span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-2 border-t border-slate-100 no-print">
          <a
            href="https://erasmus-plus.ec.europa.eu/programme-guide"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn-secondary text-xs"
          >
            📘 Erasmus+ Program Rehberi ↗
          </a>
          <a
            href="https://www.ua.gov.tr/"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn-secondary text-xs"
          >
            🇹🇷 Türkiye Ulusal Ajansı ↗
          </a>
          <a
            href="https://esco.ec.europa.eu/"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn-secondary text-xs"
          >
            🌐 Resmî ESCO Portalı ↗
          </a>
        </div>
      </div>
    </NeoCard>
  );
}
