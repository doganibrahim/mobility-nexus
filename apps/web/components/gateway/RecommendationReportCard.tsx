'use client';

import React, { useState } from 'react';
import NeoCard from '../ui/NeoCard';
import { DecisionEngineResult, HostScoreResult } from '../../lib/calculations';
import { ParticipantType, MobilityGoal } from '@mobility-nexus/types';
import { useTranslation } from '../../lib/i18n';
import MobilityInquiryModal from '../inquiry/MobilityInquiryModal';
import { useAppStore } from '../../lib/store';

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
    targetCountries: string[];
    startDate: string;
    endDate: string;
    participantCount: number;
    accompanyingPersonsCount: number;
    ageGroup: 'under_18' | '18_plus' | 'mixed';
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
  onNavigateToSent?: () => void;
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
  onNavigateToSent,
}: RecommendationReportCardProps) {
  const { t, locale } = useTranslation();
  const store = useAppStore();
  const isReportGenerated = Boolean(decisionResult || hostScoreResult || competenceScore !== null);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);

  const existingInquiry = data.hostName
    ? store.inquiries.find(
        (inq) => inq.hostName.toLowerCase() === data.hostName.toLowerCase(),
      )
    : null;
  const hasExistingInquiry = Boolean(existingInquiry);

  const handlePrint = () => {
    window.print();
  };

  return (
    <NeoCard
      id="report"
      title={t.report.title}
      badge={t.report.badge}
      badgeType="primary"
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

          {data.hostName && (
            existingInquiry ? (
              <span
                className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-2xs ${
                  existingInquiry.status === 'ACCEPTED'
                    ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                    : existingInquiry.status === 'DECLINED'
                      ? 'bg-rose-50 text-rose-900 border-rose-300'
                      : existingInquiry.status === 'REVISED'
                        ? 'bg-blue-50 text-blue-900 border-blue-300'
                        : 'bg-amber-50 text-amber-900 border-amber-300'
                }`}
              >
                <span>
                  {existingInquiry.status === 'ACCEPTED'
                    ? '✓'
                    : existingInquiry.status === 'DECLINED'
                      ? '✕'
                      : existingInquiry.status === 'REVISED'
                        ? '✏️'
                        : '⏳'}
                </span>
                <span>
                  {existingInquiry.status === 'ACCEPTED'
                    ? t.inquiry.statusAccepted
                    : existingInquiry.status === 'DECLINED'
                      ? t.inquiry.statusDeclined
                      : existingInquiry.status === 'REVISED'
                        ? t.inquiry.statusRevised
                        : t.inquiry.statusPending}
                </span>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setIsInquiryModalOpen(true)}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>✉️</span>
                <span>{t.inquiry.sendInquiryBtn}</span>
              </button>
            )
          )}
        </div>

        {/* Formatted Report Container */}
        {isReportGenerated ? (
          <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-6 space-y-5 shadow-xs">
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
                <div className="mt-3 p-3 rounded-xl border border-amber-200 bg-amber-50/90 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
                  <span className="text-base shrink-0 leading-none">⚠️</span>
                  <div>
                    <strong className="font-bold">{locale === 'tr' ? 'Hukuki Bilgilendirme:' : 'Legal Notice:'}</strong>{' '}
                    <span>{t.report.legalDisclaimer}</span>
                  </div>
                </div>
              </div>
              {decisionResult && (
                <span
                  className={`edu-badge text-xs font-bold ${
                    decisionResult.action === 'KA120-VET Erasmus Accreditation Recommended'
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : decisionResult.level === 'good'
                        ? 'edu-badge-good'
                        : decisionResult.level === 'warn'
                          ? 'edu-badge-warn'
                          : 'edu-badge-bad'
                  }`}
                >
                  {decisionResult.action === 'KA120-VET Erasmus Accreditation Recommended'
                    ? '⭐ KA120-VET Akreditasyon Tavsiyesi'
                    : decisionResult.action} • {decisionResult.readiness}
                </span>
              )}
            </div>

            {/* Key Metadata Table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[560px] text-xs text-left border-collapse bg-white">
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
                        ({data.participantType === 'teacher'
                          ? 'Teknik Öğretmen'
                          : data.participantType === 'staff'
                            ? 'Mesleki Eğitim Personeli'
                            : data.participantType === 'incoming'
                              ? 'Kuruma Gelen'
                              : data.participantType === 'project_team'
                                ? 'Proje Ekibi'
                                : 'VET Öğrencisi / Stajyer'})
                      </span>
                    </td>
                    <th className="p-3 bg-slate-50 font-semibold text-slate-700 border-r border-slate-200">
                      {t.report.proposedAction}
                    </th>
                    <td className={`p-3 font-bold ${
                      decisionResult?.action === 'KA120-VET Erasmus Accreditation Recommended'
                        ? 'text-purple-800'
                        : 'text-blue-700'
                    }`}>
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
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span>{data.hostName || '—'} {data.hostCountry ? `(${data.hostCountry})` : ''}</span>
                        {data.hostName && !hasExistingInquiry && (
                          <button
                            type="button"
                            onClick={() => setIsInquiryModalOpen(true)}
                            className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-[11px] font-bold transition-colors cursor-pointer no-print flex items-center gap-1"
                          >
                            <span>✉️</span>
                            <span>{t.inquiry.sendInquiryBtn}</span>
                          </button>
                        )}
                        {existingInquiry && (
                          <span
                            className={`px-2 py-0.5 rounded-md border text-[10px] font-bold no-print flex items-center gap-1 ${
                              existingInquiry.status === 'ACCEPTED'
                                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                : existingInquiry.status === 'DECLINED'
                                  ? 'bg-rose-50 text-rose-900 border-rose-300'
                                  : existingInquiry.status === 'REVISED'
                                    ? 'bg-blue-50 text-blue-900 border-blue-300'
                                    : 'bg-amber-50 text-amber-900 border-amber-300'
                            }`}
                          >
                            <span>
                              {existingInquiry.status === 'ACCEPTED'
                                ? '✓'
                                : existingInquiry.status === 'DECLINED'
                                  ? '✕'
                                  : existingInquiry.status === 'REVISED'
                                    ? '✏️'
                                    : '⏳'}
                            </span>
                            <span>
                              {existingInquiry.status === 'ACCEPTED'
                                ? t.inquiry.statusAccepted
                                : existingInquiry.status === 'DECLINED'
                                  ? t.inquiry.statusDeclined
                                  : existingInquiry.status === 'REVISED'
                                    ? t.inquiry.statusRevised
                                    : t.inquiry.statusPending}
                            </span>
                          </span>
                        )}
                      </div>
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
                      Format & Detaylar
                    </th>
                    <td colSpan={3} className="p-3 text-slate-800">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <span><strong>Format:</strong> {data.mobilityGoal}</span>
                        <span><strong>Ülkeler:</strong> {data.targetCountries?.length > 0 ? data.targetCountries.join(', ') : 'Farketmez / Tümü'}</span>
                        <span><strong>Tarih:</strong> {data.startDate || '—'} / {data.endDate || '—'}</span>
                        <span><strong>Kişi:</strong> {data.participantCount} Asil (+{data.accompanyingPersonsCount} Refakatçi)</span>
                        <span><strong>Yaş Grubu:</strong> {data.ageGroup === 'under_18' ? '18 Yaş Altı' : data.ageGroup === '18_plus' ? '18 Yaş ve Üstü' : 'Karma'}</span>
                      </div>
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

      {/* Mobility Inquiry Modal */}
      {isInquiryModalOpen && data.hostName && (
        <MobilityInquiryModal
          isOpen={isInquiryModalOpen}
          onClose={() => setIsInquiryModalOpen(false)}
          targetHost={{
            hostName: data.hostName,
            hostCountry: data.hostCountry || 'DE',
          }}
          onNavigateToSent={() => {
            setIsInquiryModalOpen(false);
            if (onNavigateToSent) {
              onNavigateToSent();
            }
          }}
        />
      )}
    </NeoCard>
  );
}
