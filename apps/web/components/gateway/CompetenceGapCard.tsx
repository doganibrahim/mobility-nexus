'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { useTranslation } from '../../lib/i18n';

interface CompetenceGapCardProps {
  competenceScore: number | null;
  targetScore: number;
  externalScore: string;
  onTargetScoreChange: (score: number) => void;
  onExternalScoreChange: (score: string) => void;
  onApplyExternalScore: () => void;
}

export default function CompetenceGapCard({
  competenceScore,
  targetScore,
  externalScore,
  onTargetScoreChange,
  onExternalScoreChange,
  onApplyExternalScore,
}: CompetenceGapCardProps) {
  const { t } = useTranslation();
  const gap = competenceScore !== null ? Math.max(0, targetScore - competenceScore) : null;

  return (
    <NeoCard
      title={t.gap.title}
      badge="Analiz & Boşluk"
      badgeType="primary"
    >
      <div className="space-y-4">
        {/* Friendly Score Readout */}
        <div className="rounded-xl border border-slate-200/80 p-5 bg-slate-50/50 text-center">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
            {t.gap.quickScore}
          </div>
          <div className="text-4xl font-extrabold text-slate-900">
            {competenceScore !== null ? competenceScore : '—'}
            <span className="text-lg font-normal text-slate-400">/100</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden mt-3">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                (competenceScore ?? 0) >= 70
                  ? 'bg-emerald-500'
                  : (competenceScore ?? 0) >= 50
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
              }`}
              style={{ width: `${competenceScore ?? 0}%` }}
            />
          </div>

          {gap !== null && (
            <div className="text-xs font-semibold text-slate-700 mt-2.5">
              Hedef: {targetScore} | Yetkinlik Farkı (Gap): {gap} Puan
            </div>
          )}
        </div>

        {/* Target Score Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.gap.targetLabel}
          </label>
          <input
            type="number"
            min="0"
            max="100"
            className="edu-input font-bold"
            value={targetScore}
            onChange={(e) => onTargetScoreChange(parseInt(e.target.value, 10) || 80)}
          />
        </div>

        {/* External Competence4VET Score */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.gap.externalLabel}
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              min="0"
              max="100"
              placeholder="Örn: 82"
              className="edu-input"
              value={externalScore}
              onChange={(e) => onExternalScoreChange(e.target.value)}
            />
            <button
              type="button"
              onClick={onApplyExternalScore}
              className="edu-btn-secondary text-xs whitespace-nowrap"
            >
              {t.gap.applyBtn}
            </button>
          </div>
        </div>

        {/* Evaluation Disclaimer */}
        <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-3.5 text-xs text-blue-900 leading-relaxed">
          💡 {t.gap.disclaimer}
        </div>
      </div>
    </NeoCard>
  );
}
