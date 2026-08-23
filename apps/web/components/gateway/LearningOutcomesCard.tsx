'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { useTranslation } from '../../lib/i18n';

interface LearningOutcomesCardProps {
  primaryGap: string;
  technicalOutcome: string;
  transversalOutcome: string;
  onPrimaryGapChange: (value: string) => void;
  onTechnicalOutcomeChange: (value: string) => void;
  onTransversalOutcomeChange: (value: string) => void;
  onGenerateClick: () => void;
}

export default function LearningOutcomesCard({
  primaryGap,
  technicalOutcome,
  transversalOutcome,
  onPrimaryGapChange,
  onTechnicalOutcomeChange,
  onTransversalOutcomeChange,
  onGenerateClick,
}: LearningOutcomesCardProps) {
  const { t } = useTranslation();

  return (
    <NeoCard
      id="outcomes"
      title={t.outcomes.title}
      badge="ECVET & Europass Uyumlu"
      badgeType="primary"
    >
      <div className="space-y-4">
        {/* Primary Gap */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.outcomes.gapLabel}
          </label>
          <input
            type="text"
            className="edu-input font-medium"
            placeholder="Örn: PLC Programlama / CNC / Endüstriyel Robotik / Mesleki Yabancı Dil"
            value={primaryGap}
            onChange={(e) => onPrimaryGapChange(e.target.value)}
          />
        </div>

        {/* Technical Outcome */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.outcomes.technicalLabel}
          </label>
          <textarea
            className="edu-input min-h-[90px] resize-y text-xs leading-relaxed"
            placeholder="Katılımcı ... yapabilecektir."
            value={technicalOutcome}
            onChange={(e) => onTechnicalOutcomeChange(e.target.value)}
          />
        </div>

        {/* Transversal Outcome */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.outcomes.transversalLabel}
          </label>
          <textarea
            className="edu-input min-h-[90px] resize-y text-xs leading-relaxed"
            placeholder="Takım çalışması, İSG kuralları, yeşil uygulamalar ve kültürlerarası uyum..."
            value={transversalOutcome}
            onChange={(e) => onTransversalOutcomeChange(e.target.value)}
          />
        </div>

        {/* Generate Button */}
        <div className="pt-2 no-print">
          <button
            type="button"
            onClick={onGenerateClick}
            className="edu-btn-secondary text-xs w-full sm:w-auto"
          >
            ✨ ECVET Standartlarında Kazanımları Yeniden Üret
          </button>
        </div>
      </div>
    </NeoCard>
  );
}
