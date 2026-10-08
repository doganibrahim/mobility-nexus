'use client';

import React, { useState } from 'react';
import NeoCard from '../ui/NeoCard';
import { DecisionEngineResult, HostScoreResult, getHumanReadableMobilityGoal } from '../../lib/calculations';
import { ParticipantType, MobilityGoal } from '@mobility-nexus/types';
import { useTranslation } from '../../lib/i18n';
import MobilityInquiryModal from '../inquiry/MobilityInquiryModal';
import { useAppStore } from '../../lib/store';
import { getCountryFlagLabel } from '../../lib/countries';

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

  const isOrgProfileIncomplete = !data.schoolName?.trim() || !data.oid?.trim();
  const isOutcomesOutOfSync = Boolean(
    data.technicalOutcome &&
      (((data.participantType === 'teacher' || data.participantType === 'staff') &&
        data.technicalOutcome.toLowerCase().includes('öğrenci') &&
        !data.technicalOutcome.toLowerCase().includes('eğitici')) ||
        (data.participantType === 'student' &&
          data.technicalOutcome.toLowerCase().includes('teknik eğitici')))
  );

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
      badge={
        decisionResult?.isDataValid === false
          ? (locale === 'tr' ? 'Geçersiz Plan — Düzeltme Gerekli' : 'Invalid Plan — Correction Required')
          : isOrgProfileIncomplete
            ? (locale === 'tr' ? 'Eksik Taslak' : 'Incomplete Draft')
            : t.report.badge
      }
      badgeType={
        decisionResult?.isDataValid === false
          ? 'bad'
          : isOrgProfileIncomplete
            ? 'warn'
            : 'primary'
      }
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
            🔄 {t.report.refreshBtn}
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="edu-btn-secondary text-xs"
          >
            🖨️ {t.report.printBtn}
          </button>
          <button
            type="button"
            onClick={onSaveLocal}
            className="edu-btn-secondary text-xs"
          >
            💾 {t.report.saveBtn}
          </button>
          <button
            type="button"
            onClick={onLoadLocal}
            className="edu-btn-secondary text-xs"
          >
            📂 {t.report.loadBtn}
          </button>
          <button
            type="button"
            onClick={onExportJson}
            className="edu-btn-secondary text-xs font-mono"
          >
            📋 {t.report.exportBtn}
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
            {/* Planning Validation Error Banner */}
            {decisionResult?.isDataValid === false && decisionResult.validationErrors && decisionResult.validationErrors.length > 0 && (
              <div className="p-4 rounded-xl border border-red-300 bg-red-50 text-red-950 text-xs leading-relaxed space-y-2 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-red-900 text-sm">
                  <span>🛑</span>
                  <span>
                    {locale === 'tr'
                      ? 'Planlama Hatası — Uygunluk Değerlendirmesi ve Karar Durduruldu'
                      : 'Planning Errors Detected — Evaluation & Decision Suspended'}
                  </span>
                </div>
                <p className="m-0 text-slate-700">
                  {locale === 'tr'
                    ? 'Aşağıdaki planlama alanlarında Erasmus+ kural veya veri tutarlılığı ihlalleri tespit edildi. Hatalar giderilmeden resmi başvuru taslağı veya başarı puanı oluşturulamaz:'
                    : 'Rule violations or data inconsistencies were detected. Application draft and suitability scoring are suspended until resolved:'}
                </p>
                <ul className="list-disc pl-5 space-y-1 font-semibold text-red-900">
                  {decisionResult.validationErrors.map((err, idx) => (
                    <li key={idx}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Incomplete Draft Warning Banner */}
            {isOrgProfileIncomplete && (
              <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/90 text-amber-950 text-xs leading-relaxed space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <span className="text-base">⚠️</span>
                  <span>
                    {locale === 'tr'
                      ? 'Eksik Taslak — Kurum Bilgisi Girilmedi'
                      : 'Incomplete Draft — Organization Details Missing'}
                  </span>
                </div>
                <p className="m-0 text-slate-700">
                  {locale === 'tr'
                    ? 'Bu rapor bir simülasyon taslağıdır ve henüz bir kuruma (Okul Adı ve OID) bağlanmamıştır. Tam ve geçerli bir uygunluk değerlendirmesi için lütfen 1. Adım Kurum Profili sekmesinden kurum bilgilerinizi doldurunuz.'
                    : 'This report is a simulated draft and has not yet been linked to an official institution (School Name and OID). Please complete Step 1 (School Profile) to obtain an authentic institutional evaluation.'}
                </p>
              </div>
            )}

            {/* Out-of-sync outcomes banner */}
            {isOutcomesOutOfSync && (
              <div className="p-3.5 rounded-xl border border-blue-300 bg-blue-50 text-blue-950 text-xs leading-relaxed flex items-center justify-between gap-3 flex-wrap shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">ℹ️</span>
                  <span>
                    {locale === 'tr'
                      ? 'Katılımcı profili değişti. Öğrenme çıktıları güncel katılımcı rolünü yansıtacak şekilde yenilenmelidir.'
                      : 'Participant profile was modified. Learning outcomes should be refreshed to reflect the new role.'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onRefreshReport}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <span>🔄</span>
                  <span>{locale === 'tr' ? 'Raporu ve Çıktıları Yenile' : 'Refresh Report & Outcomes'}</span>
                </button>
              </div>
            )}

            <div className="border-b border-slate-200 pb-4 flex justify-between items-start flex-wrap gap-3">
              <div>
                <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wide">
                  {locale === 'en' ? 'Erasmus+ VET Mobility' : 'Erasmus+ VET Mesleki Eğitim Hareketliliği'}
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
              <div className="flex items-center gap-2 flex-wrap">
                {isOrgProfileIncomplete && (
                  <span className="px-2.5 py-1 rounded-lg border text-xs font-bold bg-amber-50 text-amber-900 border-amber-300 flex items-center gap-1">
                    <span>⚠️</span>
                    <span>{locale === 'tr' ? 'Eksik Taslak (Kurum/OID Yok)' : 'Incomplete Draft (No Org/OID)'}</span>
                  </span>
                )}
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
                      ? (locale === 'en' ? '⭐ KA120-VET Accreditation Recommended' : '⭐ KA120-VET Akreditasyon Tavsiyesi')
                      : decisionResult.action} • {decisionResult.readiness}
                  </span>
                )}
              </div>
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
                        <span>{data.hostName || '—'} {data.hostCountry ? `(${getCountryFlagLabel(data.hostCountry, locale as 'tr' | 'en') || data.hostCountry})` : ''}</span>
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
                      {locale === 'tr' ? 'Faaliyet Türü ve Ayrıntılar' : 'Activity Type and Details'}
                    </th>
                    <td colSpan={3} className="p-3 text-slate-800">
                      <div className="flex flex-wrap gap-x-6 gap-y-2">
                        <span><strong>{locale === 'tr' ? 'Faaliyet:' : 'Activity:'}</strong> {getHumanReadableMobilityGoal(data.mobilityGoal, locale as 'tr' | 'en')}</span>
                        <span><strong>{locale === 'tr' ? 'Ülkeler:' : 'Countries:'}</strong> {data.targetCountries?.length > 0 ? data.targetCountries.map(c => getCountryFlagLabel(c, locale as 'tr' | 'en')).join(', ') : (locale === 'tr' ? 'Fark Etmez / Tüm Uygun Ülkeler' : 'No Preference / All Eligible Countries')}</span>
                        <span><strong>{locale === 'tr' ? 'Tarih:' : 'Dates:'}</strong> {data.startDate || '—'} / {data.endDate || '—'}</span>
                        <span><strong>{locale === 'tr' ? 'Katılımcı:' : 'Participants:'}</strong> {data.participantCount} {locale === 'tr' ? 'Katılımcı' : 'Participants'} (+{Math.max(0, data.accompanyingPersonsCount || 0)} {locale === 'tr' ? 'Refakat Eden Kişi' : 'Accompanying Persons'})</span>
                        <span><strong>{locale === 'tr' ? 'Yaş Grubu:' : 'Age Group:'}</strong> {data.ageGroup === 'under_18' ? (locale === 'tr' ? '18 Yaş Altı Reşit Olmayan Katılımcı' : 'Under 18 Minor Participant') : data.ageGroup === '18_plus' ? (locale === 'tr' ? '18+ Yetişkin' : '18+ Adult') : (locale === 'tr' ? 'Karma' : 'Mixed')}</span>
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
                      {locale === 'tr' ? 'Erasmus Planı Hedefi:' : 'Erasmus Plan Objective:'} <span className="font-normal text-slate-700">{data.erasmusPlan}</span>
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
                <div className={`p-4 rounded-xl text-xs leading-relaxed shadow-sm ${
                  isOrgProfileIncomplete ? 'bg-slate-800 text-slate-200 border border-amber-500/40' : 'bg-blue-900 text-white'
                }`}>
                  <strong className={isOrgProfileIncomplete ? 'text-amber-300' : 'text-blue-200'}>
                    {locale === 'tr' ? 'Değerlendirme:' : 'Assessment:'}
                  </strong>{' '}
                  {isOrgProfileIncomplete
                    ? (locale === 'tr'
                        ? 'Eksik Taslak: Kurum bilgisi ve OID girilmediği için bu rapor bağlayıcı olmayan bir önizleme simülasyonudur. Resmi başvuru taslağına geçilmeden önce kurum bilgilerinin 1. Adım altında tamamlanması gerekmektedir.'
                        : 'Incomplete Draft: Because organization details and OID are missing, this report is a non-binding preview simulation. Institutional details must be completed in Step 1 before starting an official draft.')
                    : (locale === 'tr'
                        ? 'Bu tavsiye raporu Erasmus+ VET yönergelerine ve Ulusal Ajans standartlarına uygun olarak otomatik sentezlenmiştir. Nihai katılımcı seçimi şeffaf ve belgelendirilebilir bir prosedürle yapılmalıdır.'
                        : 'This recommendation dossier has been automatically synthesized according to Erasmus+ VET guidelines. Final participant selection must follow a transparent and documented procedure.')}
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
