'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { QUALITY_CHECKLIST } from '../../lib/constants';
import { useTranslation } from '../../lib/i18n';

export default function QualityChecklistCard() {
  const { t, locale } = useTranslation();

  return (
    <NeoCard
      title={t.quality.title}
      badge={locale === 'en' ? 'Erasmus+ Quality Standards' : 'Erasmus+ Kalite Standartları'}
      badgeType="primary"
    >
      <div className="space-y-4">
        <div className="overflow-x-auto rounded-xl border border-slate-200/80">
          <table className="w-full text-left text-xs bg-white border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200/80">
                <th className="p-3">{t.quality.stageCol}</th>
                <th className="p-3">{t.quality.sendingCol}</th>
                <th className="p-3">{t.quality.hostCol}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {QUALITY_CHECKLIST.map((item, idx) => (
                <tr
                  key={idx}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  <td className="p-3 font-bold text-slate-900">
                    {locale === 'en' ? item.areaEn : item.areaTr}
                  </td>
                  <td className="p-3 text-slate-700">
                    {locale === 'en' ? item.sendingEn : item.sendingTr}
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    {locale === 'en' ? item.hostEn : item.hostTr}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-3.5 text-xs text-amber-900 leading-relaxed">
          <strong className="font-bold">{locale === 'en' ? 'Fundamental Rule:' : 'Temel Kural:'}</strong>{' '}
          <span className="text-amber-800">
            {t.quality.disclaimer.includes(':')
              ? t.quality.disclaimer.split(':')[1]
              : t.quality.disclaimer}
          </span>
        </div>
      </div>
    </NeoCard>
  );
}
