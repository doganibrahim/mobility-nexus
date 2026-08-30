'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { DecisionEngineResult, HostScoreResult } from '../../lib/calculations';
import { ParticipantType, MobilityGoal } from '@mobility-nexus/types';
import { useTranslation } from '../../lib/i18n';

interface RecommendationReportCardProps {
  data: {
    schoolName: string;
    city: string;
    oid: string;
    accredited: string;
    erasmusPlan: string;
    institutionNeed: string;
    participantType: ParticipantType;
    participantName: string;
    mobilityGoal: MobilityGoal;
    duration: string;
    iscedName: string;
    iscedCode: string;
    escoTerm: string;
    iscoCode: string;
    escoUri: string;
    skills: string;
    primaryGap: string;
    hostName: string;
    hostCountry: string;
    technicalOutcome: string;
    transversalOutcome: string;
  };
  competenceScore: number | null;
  hostScoreResult: HostScoreResult | null;
  decisionResult: DecisionEngineResult | null;
  onRefreshReport: () => void;
  onSaveLocal: () => void;
  onLoadLocal: () => void;
  onExportJson: () => void;
}

export default function RecommendationReportCard({
  data,
  competenceScore,
  hostScoreResult,
  decisionResult,
  onRefreshReport,
  onSaveLocal,
  onLoadLocal,
  onExportJson,
}: RecommendationReportCardProps) {
  const { t } = useTranslation();
  const isReportGenerated = Boolean(decisionResult || hostScoreResult || competenceScore !== null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <NeoCard
      id="report"
      title={t.report.title}
      badge="Resmî Rapor Çıktısı"
      badgeType="good"
      featured
    >
      <div className="space-y-4">
        {/* Action Toolbar */}
        <div className="flex flex-wrap gap-2.5 pb-3 border-b border-slate-100 no-print">
          <button
            type="button"
            onClick={onRefreshReport}
            className="edu-btn-primary text-xs"
          >
            🔄 Raporu Güncelle
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="edu-btn-secondary text-xs"
          >
            🖨️ Yazdır / PDF İndir
          </button>
          <button
            type="button"
            onClick={onSaveLocal}
            className="edu-btn-secondary text-xs"
          >
            💾 Tarayıcıya Kaydet
          </button>
          <button
            type="button"
            onClick={onLoadLocal}
            className="edu-btn-secondary text-xs"
          >
            📂 Kayıtlı Veriyi Yükle
          </button>
          <button
            type="button"
            onClick={onExportJson}
            className="edu-btn-secondary text-xs font-mono"
          >
            📋 JSON İndir
          </button>
        </div>

        {/* Formatted Report Container */}
        {isReportGenerated ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5 shadow-xs">
            <div className="border-b border-slate-200 pb-4 flex justify-between items-start flex-wrap gap-3">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  Erasmus+ VET Mesleki Eğitim Hareketliliği
                </span>
                <h3 className="text-lg font-bold text-slate-900 m-0 mt-0.5">
                  {t.report.dossierTitle}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t.report.dossierSub}
                </p>
              </div>
              {decisionResult && (
                <span
                  className={`edu-badge text-xs font-bold ${
                    decisionResult.level === 'good'
                      ? 'edu-badge-good'
                      : decisionResult.level === 'warn'
                        ? 'edu-badge-warn'
                        : 'edu-badge-bad'
                  }`}
                >
                  {decisionResult.action} • {decisionResult.readiness}
                </span>
              )}
            </div>

            {/* Key Metadata Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-xs text-left border-collapse bg-white">
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 w-1/4 border-r border-slate-200">
                      {t.report.sendingOrg}
                    </th>
                    <td className="p-3 text-slate-900 font-bold border-r border-slate-200">
                      {data.schoolName || '—'} {data.city ? `(${data.city})` : ''}
                    </td>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 w-1/6 border-r border-slate-200">
                      {t.report.oid}
                    </th>
                    <td className="p-3 font-bold text-slate-900">{data.oid || '—'}</td>
                  </tr>

                  <tr>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.participant}
                    </th>
                    <td className="p-3 text-slate-800 border-r border-slate-200">
                      {data.participantName || '—'}{' '}
                      <span className="text-slate-500 font-medium">
                        ({data.participantType === 'teacher' ? 'Eğitici / Personel' : 'Öğrenici / Stajyer'})
                      </span>
                    </td>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.proposedAction}
                    </th>
                    <td className="p-3 font-bold text-blue-700">
                      {decisionResult?.action || '—'}
                    </td>
                  </tr>

                  <tr>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.vetField}
                    </th>
                    <td className="p-3 text-slate-900 font-medium border-r border-slate-200">
                      {data.iscedName || '—'}
                    </td>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.iscedCode}
                    </th>
                    <td className="p-3 font-bold text-slate-900">
                      {data.iscedCode || '—'}
                    </td>
                  </tr>

                  <tr>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.escoProfile}
                    </th>
                    <td className="p-3 text-slate-800 border-r border-slate-200">
                      {data.escoTerm || '—'}
                    </td>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.conceptUri}
                    </th>
                    <td className="p-3 text-[11px] text-slate-600 truncate max-w-[200px]">
                      {data.iscoCode ? `ISCO: ${data.iscoCode}` : ''} {data.escoUri || '—'}
                    </td>
                  </tr>

                  <tr>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.compScore}
                    </th>
                    <td className="p-3 font-bold text-slate-900 border-r border-slate-200">
                      {competenceScore !== null ? `${competenceScore}/100` : '—'}
                    </td>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.suitability}
                    </th>
                    <td className="p-3 font-bold text-blue-700">
                      {decisionResult ? `${decisionResult.score}/100` : '—'}
                    </td>
                  </tr>

                  <tr>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.hostOrg}
                    </th>
                    <td className="p-3 text-slate-900 font-medium border-r border-slate-200">
                      {data.hostName || '—'} {data.hostCountry ? `(${data.hostCountry})` : ''}
                    </td>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.hostScore}
                    </th>
                    <td className="p-3 font-bold text-slate-900">
                      {hostScoreResult ? `${hostScoreResult.score}/100` : '—'}
                    </td>
                  </tr>

                  <tr>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.formatDuration}
                    </th>
                    <td colSpan={3} className="p-3 text-slate-800">
                      {data.mobilityGoal} • Süre: <strong className="text-slate-900">{data.duration || '—'}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Strategic Alignment Section */}
            <div className="space-y-4 pt-2">
              <div>
                <div className="text-xs font-bold text-slate-700 mb-1">
                  {t.report.needsAlignment}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800">
                  <p className="m-0">{data.institutionNeed || '—'}</p>
                  {data.erasmusPlan && (
                    <p className="mt-2.5 pt-2.5 border-t border-slate-200 font-medium text-slate-900">
                      Erasmus Planı Hedefi: <span className="font-normal text-slate-700">{data.erasmusPlan}</span>
                    </p>
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-1">
                  {t.report.escoSkills}
                </div>
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700">
                  {data.skills || '—'}
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-1">
                  {t.report.expectedOutcomes}
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 text-slate-800">
                  <p className="m-0">
                    <strong className="text-slate-900 font-semibold">• {t.report.techOutcomes}:</strong>{' '}
                    {data.technicalOutcome || '—'}
                  </p>
                  <p className="m-0">
                    <strong className="text-slate-900 font-semibold">• {t.report.transOutcomes}:</strong>{' '}
                    {data.transversalOutcome || '—'}
                  </p>
                </div>
              </div>

              <div>
                <div className="text-xs font-bold text-slate-700 mb-1">
                  {t.report.decisionSummary}
                </div>
                <div className="bg-blue-900 text-white p-4 rounded-xl text-xs leading-relaxed shadow-sm">
                  <strong className="text-blue-200">Değerlendirme:</strong> Bu tavsiye raporu Erasmus+ VET yönergelerine ve Ulusal Ajans standartlarına uygun olarak otomatik sentezlenmiştir. Nihai katılımcı seçimi şeffaf ve belgelendirilebilir bir prosedürle yapılmalıdır.
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-xs text-slate-500 bg-slate-50">
            {t.report.emptyText}
          </div>
        )}
      </div>
    </NeoCard>
  );
}
