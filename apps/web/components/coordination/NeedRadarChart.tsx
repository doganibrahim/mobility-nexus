'use client';

import React from 'react';
import { NeedAssessmentScores } from '@mobility-nexus/types';
import { useTranslation } from '@/lib/i18n';

interface NeedRadarChartProps {
  scores: NeedAssessmentScores;
  size?: number;
}

interface Dimension {
  key: keyof NeedAssessmentScores;
  labelTr: string;
  labelEn: string;
  shortLabelTr: string;
  shortLabelEn: string;
}

const DIMENSIONS: Dimension[] = [
  {
    key: 's1AccreditationAlignment',
    labelTr: 'S1: Akreditasyon & Plan',
    labelEn: 'S1: Accreditation & Plan',
    shortLabelTr: 'S1: Akreditasyon',
    shortLabelEn: 'S1: Accreditation',
  },
  {
    key: 's2HostMatchingGap',
    labelTr: 'S2: Ev Sahibi Ağı',
    labelEn: 'S2: Host Network',
    shortLabelTr: 'S2: Ev Sahibi',
    shortLabelEn: 'S2: Host Network',
  },
  {
    key: 's3GrantBudgetCapacity',
    labelTr: 'S3: Hibe & Bütçe',
    labelEn: 'S3: Grant & Budget',
    shortLabelTr: 'S3: Bütçe',
    shortLabelEn: 'S3: Budget',
  },
  {
    key: 's4ParticipantPrepLevel',
    labelTr: 'S4: Dil & Hazırlık',
    labelEn: 'S4: Language & Prep',
    shortLabelTr: 'S4: Hazırlık',
    shortLabelEn: 'S4: Prep',
  },
  {
    key: 's5LearningAgreementQuality',
    labelTr: 'S5: ESCO & Sözleşme',
    labelEn: 'S5: ESCO & Agreement',
    shortLabelTr: 'S5: Sözleşme',
    shortLabelEn: 'S5: Agreement',
  },
  {
    key: 's6RiskAndInclusion',
    labelTr: 'S6: İçerme & Risk',
    labelEn: 'S6: Inclusion & Risk',
    shortLabelTr: 'S6: İçerme',
    shortLabelEn: 'S6: Inclusion',
  },
  {
    key: 's7ConsortiumSynergy',
    labelTr: 'S7: Konsorsiyum İhtiyacı',
    labelEn: 'S7: Consortium Need',
    shortLabelTr: 'S7: Konsorsiyum',
    shortLabelEn: 'S7: Consortium',
  },
  {
    key: 's8GreenAndDigitalShift',
    labelTr: 'S8: Yeşil & Dijital',
    labelEn: 'S8: Green & Digital',
    shortLabelTr: 'S8: Yeşil/Dijital',
    shortLabelEn: 'S8: Green/Digital',
  },
];

export function NeedRadarChart({ scores, size = 320 }: NeedRadarChartProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';
  const center = size / 2;
  const radius = size * 0.38;
  const totalAxes = DIMENSIONS.length;

  // Calculate polygon points
  const points = DIMENSIONS.map((dim, i) => {
    const value = Math.max(0, Math.min(100, Number(scores[dim.key]) || 50));
    const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
    const r = (value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y, value, angle, dim };
  });

  const polygonPath = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Concentric background rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="flex flex-col items-center justify-center p-2 bg-slate-50/50 rounded-2xl border border-slate-200/80">
      <div className="relative">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="overflow-visible"
        >
          {/* Background Concentric Rings */}
          {rings.map((ratio, idx) => {
            const ringRadius = radius * ratio;
            const ringPoints = Array.from({ length: totalAxes }).map((_, i) => {
              const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
              const x = center + ringRadius * Math.cos(angle);
              const y = center + ringRadius * Math.sin(angle);
              return `${x},${y}`;
            });
            return (
              <polygon
                key={idx}
                points={ringPoints.join(' ')}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={idx === rings.length - 1 ? '1.5' : '1'}
                strokeDasharray={idx < rings.length - 1 ? '3 3' : undefined}
              />
            );
          })}

          {/* Axes Lines */}
          {Array.from({ length: totalAxes }).map((_, i) => {
            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}

          {/* Data Filled Polygon */}
          <polygon
            points={polygonPath}
            fill="rgba(37, 99, 235, 0.22)"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Data Points and Value Badges */}
          {points.map((p, idx) => (
            <g key={idx}>
              <circle
                cx={p.x}
                cy={p.y}
                r="4.5"
                fill="#1e40af"
                stroke="#ffffff"
                strokeWidth="2"
              />
            </g>
          ))}

          {/* Axis Labels */}
          {DIMENSIONS.map((dim, i) => {
            const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
            const labelRadius = radius + 22;
            const x = center + labelRadius * Math.cos(angle);
            const y = center + labelRadius * Math.sin(angle);
            const shortText = isTr ? dim.shortLabelTr : dim.shortLabelEn;
            return (
              <text
                key={i}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-bold fill-slate-700 select-none"
              >
                {shortText}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 w-full pt-3 border-t border-slate-200/80">
        {DIMENSIONS.map((dim) => {
          const val = Number(scores[dim.key]) || 0;
          const fullLabel = isTr ? dim.labelTr : dim.labelEn;
          const shortLabel = isTr ? dim.shortLabelTr : dim.shortLabelEn;
          return (
            <div
              key={dim.key}
              className="p-2 rounded-xl bg-white border border-slate-200 text-[11px] flex flex-col justify-between"
            >
              <span className="text-slate-500 font-medium truncate" title={fullLabel}>
                {shortLabel}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-extrabold text-slate-900">{val}/100</span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    val >= 80 ? 'bg-emerald-500' : val >= 55 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
