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
            ⚡ {t.decision.calcBtn}
          </button>
        </div>

        {/* Decision Output Box */}
        {decision ? (
          <div
            className={`rounded-xl border p-5 space-y-4 shadow-sm text-white transition-all ${
              decision.action === 'KA120-VET Erasmus Accreditation Recommended'
                ? 'border-purple-400 bg-purple-950 text-white'
                : decision.action === 'KA121-VET'
                  ? 'border-blue-300 bg-blue-950 text-white'
                  : decision.action === 'KA122-VET'
                    ? 'border-emerald-400 bg-slate-950 text-white'
                    : 'border-amber-400 bg-amber-950 text-white'
            }`}
          >
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3 ${
                decision.action === 'KA120-VET Erasmus Accreditation Recommended'
                  ? 'border-purple-800'
                  : decision.action === 'KA121-VET'
                    ? 'border-blue-800'
                    : decision.action === 'KA122-VET'
                      ? 'border-emerald-800'
                      : 'border-amber-800'
              }`}
            >
              <div>
                <div
                  className={`text-xs font-medium uppercase tracking-wide ${
                    decision.action === 'KA120-VET Erasmus Accreditation Recommended'
                      ? 'text-purple-200'
                      : decision.action === 'KA121-VET'
                        ? 'text-blue-200'
                        : decision.action === 'KA122-VET'
                          ? 'text-emerald-200'
                          : 'text-amber-200'
                  }`}
                >
                  {t.decision.proposedPath}
                </div>
                <div className="text-xl sm:text-2xl font-black mt-0.5 flex items-center gap-2">
                  <span>
                    {decision.action === 'KA120-VET Erasmus Accreditation Recommended'
                      ? '⭐ '
                      : decision.action === 'KA121-VET'
                        ? '🎖️ '
                        : decision.action === 'KA122-VET'
                          ? '🚀 '
                          : '🔍 '}
                    {decision.action}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div
                    className={`text-xs ${
                      decision.action === 'KA120-VET Erasmus Accreditation Recommended'
                        ? 'text-purple-200'
                        : decision.action === 'KA121-VET'
                          ? 'text-blue-200'
                          : decision.action === 'KA122-VET'
                            ? 'text-emerald-200'
                            : 'text-amber-200'
                    }`}
                  >
                    {t.decision.scoreLabel}
                  </div>
                  <div className="text-2xl font-black">
                    {decision.score}/100
                  </div>
                </div>
                <span className="edu-badge bg-white text-slate-900 border-white font-bold">
                  {decision.readiness}
                </span>
              </div>
            </div>

            <div
              className={`text-xs leading-relaxed p-3.5 rounded-lg border ${
                decision.action === 'KA120-VET Erasmus Accreditation Recommended'
                  ? 'bg-purple-900/60 border-purple-800 text-purple-100'
                  : decision.action === 'KA121-VET'
                    ? 'bg-blue-900/60 border-blue-800 text-blue-100'
                    : decision.action === 'KA122-VET'
                      ? 'bg-slate-900 border-slate-800 text-emerald-100'
                      : 'bg-amber-900/60 border-amber-800 text-amber-100'
              }`}
            >
              📌 <strong className="font-semibold text-white">{t.decision.rationaleTitle}</strong> {decision.rationale}
            </div>

            {/* KA120 Specific Strategic Guidance Roadmap */}
            {decision.action === 'KA120-VET Erasmus Accreditation Recommended' && (
              <div className="p-3 bg-purple-900/40 rounded-lg border border-purple-700/60 text-xs text-purple-200 space-y-1.5">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>💡</span>
                  <span>Erasmus Akreditasyonu (KA120-VET) Stratejik Yol Haritası:</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-[11px] text-purple-200">
                  <li><strong>Erasmus Planı:</strong> Okulunuzun uluslararasılaşma ve pedagojik gelişim hedeflerini 3–5 yıllık periyot için belirleyin.</li>
                  <li><strong>Yıllık Çağrı:</strong> Her yıl sonbaharda (genellikle Ekim) yayımlanan resmî KA120-VET akreditasyon çağrısına başvurun.</li>
                  <li><strong>Garantili Bütçe:</strong> Akreditasyon onaylandığında, her yıl yeni proje yazmadan doğrudan KA121 yıllık bütçe tahsisatı alırsınız.</li>
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-6 text-center text-xs text-slate-500 bg-slate-50/50">
            {t.decision.emptyText}
          </div>
        )}
      </div>
    </NeoCard>
  );
}
