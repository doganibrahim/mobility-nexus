'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { HOST_METRIC_CONFIG } from '../../lib/constants';
import { HostType } from '@mobility-nexus/types';
import { HostScoreResult } from '../../lib/calculations';
import { useTranslation } from '../../lib/i18n';

interface HostMatchingCardProps {
  data: {
    hostName: string;
    hostCountry: string;
    hostType: HostType;
    hostMetrics: Record<string, number>;
  };
  scoreResult: HostScoreResult | null;
  onChangeHostInfo: (field: string, value: string) => void;
  onMetricChange: (metricId: string, value: number) => void;
  onScoreHost: () => void;
}

export default function HostMatchingCard({
  data,
  scoreResult,
  onChangeHostInfo,
  onMetricChange,
  onScoreHost,
}: HostMatchingCardProps) {
  const { t } = useTranslation();

  return (
    <NeoCard
      id="host"
      title={t.host.title}
      badge="10 Kriterli Uygunluk"
      badgeType="primary"
    >
      <div className="space-y-4">
        {/* Row 1: Host Name, Country, Type */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.host.nameLabel}
            </label>
            <input
              type="text"
              className="edu-input font-medium"
              placeholder="Örn: Fraunhofer Institute / Leipzig VET School / Festo Didactic"
              value={data.hostName}
              onChange={(e) => onChangeHostInfo('hostName', e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.host.countryLabel}
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder="Örn: Almanya"
              value={data.hostCountry}
              onChange={(e) => onChangeHostInfo('hostCountry', e.target.value)}
            />
          </div>
          <div className="md:col-span-3">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.host.typeLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.hostType}
              onChange={(e) => onChangeHostInfo('hostType', e.target.value)}
            >
              <option value="VET school">Meslek Lisesi / VET School</option>
              <option value="Training centre">Eğitim Merkezi / Training Centre</option>
              <option value="Company / SME">İşletme / KOBİ / Company</option>
              <option value="Factory / industrial company">Fabrika / Endüstriyel Tesis</option>
              <option value="Sectoral organisation">Sektörel Kuruluş / Birlik</option>
            </select>
          </div>
        </div>

        {/* 10 Weighted Host Metrics Grid */}
        <div>
          <div className="text-xs font-bold text-slate-700 mb-2 flex items-center justify-between">
            <span>{t.host.criteriaTitle}</span>
            <span className="text-xs font-normal text-slate-500">Toplam Ağırlık: %100</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {HOST_METRIC_CONFIG.map((m) => {
              const currentVal = data.hostMetrics[m.id] ?? m.defaultVal;
              return (
                <div
                  key={m.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 flex flex-col justify-between"
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <label className="text-xs font-semibold text-slate-800 leading-tight">
                      {m.label}
                    </label>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100 shrink-0 ml-1">
                      %{m.weight}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      className="edu-input py-1 px-1 text-xs font-bold text-center w-12"
                      value={currentVal}
                      onChange={(e) =>
                        onMetricChange(m.id, parseInt(e.target.value, 10) || 0)
                      }
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="w-full accent-blue-700 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
                      value={currentVal}
                      onChange={(e) =>
                        onMetricChange(m.id, parseInt(e.target.value, 10) || 0)
                      }
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Toolbar & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 no-print">
          <button
            type="button"
            onClick={onScoreHost}
            className="edu-btn-primary text-xs"
          >
            🏢 Ev Sahibi Uygunluk Skorunu Hesapla
          </button>

          {scoreResult && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-xs font-medium text-slate-500 mr-2">
                  {t.host.calculatedScore}
                </span>
                <span className="text-2xl font-black text-slate-900">
                  {scoreResult.score}/100
                </span>
              </div>
              <span
                className={`edu-badge font-bold ${
                  scoreResult.level === 'good'
                    ? 'edu-badge-good'
                    : scoreResult.level === 'warn'
                      ? 'edu-badge-warn'
                      : 'edu-badge-bad'
                }`}
              >
                {scoreResult.label}
              </span>
            </div>
          )}
        </div>
      </div>
    </NeoCard>
  );
}
