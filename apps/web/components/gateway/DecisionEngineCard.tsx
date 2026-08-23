'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { DECISION_WEIGHTS } from '../../lib/constants';
import { DecisionEngineResult } from '../../lib/calculations';
import { useTranslation } from '../../lib/i18n';

interface DecisionEngineCardProps {
  decision: DecisionEngineResult | null;
  onMakeDecision: () => void;
}

export default function DecisionEngineCard({
  decision,
  onMakeDecision,
}: DecisionEngineCardProps) {
  const { t } = useTranslation();

  return (
    <NeoCard
      id="decision"
      title={t.decision.title}
      badge="8 Faktörlü Model"
      badgeType="primary"
      featured
    >
      <div className="space-y-4">
        {/* 8 Weighted Criteria Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {DECISION_WEIGHTS.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg border border-slate-200/80 bg-slate-50/50 text-left flex flex-col justify-between"
            >
              <div className="text-[11px] font-medium text-slate-500 truncate">
                {item.label}
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1">
                {item.weight}
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="pt-2 no-print">
          <button
            type="button"
            onClick={onMakeDecision}
            className="edu-btn-primary text-xs w-full sm:w-auto"
          >
            ⚡ Karar Motorunu Çalıştır (KA121 vs KA122)
          </button>
        </div>

        {/* Decision Output Box */}
        {decision ? (
          <div className="rounded-xl border border-blue-200 bg-blue-900 text-white p-5 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-blue-800 pb-3">
              <div>
                <div className="text-xs font-medium text-blue-200 uppercase tracking-wide">
                  {t.decision.proposedPath}
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {decision.action}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-xs text-blue-200">
                    {t.decision.scoreLabel}
                  </div>
                  <div className="text-2xl font-black text-white">
                    {decision.score}/100
                  </div>
                </div>
                <span className="edu-badge bg-white text-blue-900 border-white font-bold">
                  {decision.readiness}
                </span>
              </div>
            </div>

            <div className="text-xs text-blue-100 leading-relaxed bg-blue-950/60 p-3.5 rounded-lg border border-blue-800/80">
              📌 <strong className="text-white font-semibold">{t.decision.rationaleTitle}</strong> {decision.rationale}
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 bg-slate-50/50">
            Yukarıdaki butona tıklayarak kurum ve katılımcı verilerine göre en uygun Erasmus+ başvuru türünü belirleyin.
          </div>
        )}
      </div>
    </NeoCard>
  );
}
