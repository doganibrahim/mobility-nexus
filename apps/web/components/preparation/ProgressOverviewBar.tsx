'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { ParticipantProgressReport } from '@mobility-nexus/types';
import {
  CheckCircle2,
  Clock,
  Award,
  AlertTriangle,
  FileCheck2,
  Sparkles,
  Plane,
} from 'lucide-react';

interface ProgressOverviewBarProps {
  progressReport: ParticipantProgressReport;
  onOpenCertificate?: () => void;
}

export function ProgressOverviewBar({
  progressReport,
  onOpenCertificate,
}: ProgressOverviewBarProps) {
  const { locale } = useTranslation();
  const { assignment, isReadyForMobility, completedModuleIds, averageQuizScore } = progressReport;

  const totalCount = assignment.totalModulesCount || 10;
  const completedCount = completedModuleIds.length;
  const percentage = assignment.completionPercentage;

  // Remaining time approx
  const remainingCount = Math.max(0, totalCount - completedCount);
  const estimatedMinutesRemaining = remainingCount * 20;

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 sm:p-6 mb-8 transition-all">
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              {assignment.mobilityProjectCode}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
              {assignment.participantRole === 'TEACHER'
                ? locale === 'tr'
                  ? 'Refakatçi Öğretmen'
                  : 'Accompanying Teacher'
                : locale === 'tr'
                ? 'Stajyer Öğrenci'
                : 'VET Student Trainee'}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <Plane className="w-3.5 h-3.5 text-blue-600" />
              <span>
                {locale === 'tr' ? 'Hedef:' : 'Destination:'}{' '}
                <strong className="text-slate-800 font-semibold">
                  {assignment.destinationCountry}{' '}
                  {assignment.destinationCity ? `(${assignment.destinationCity})` : ''}
                </strong>
              </span>
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {assignment.participantName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {assignment.schoolName}
          </p>
        </div>

        {/* Readiness Badge & Certificate CTA */}
        <div className="flex items-center gap-3">
          {isReadyForMobility ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                  {locale === 'tr' ? 'Seyahate Hazır' : 'Ready for Mobility'}
                </div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  {locale === 'tr'
                    ? 'Tüm zorunlu modüller tamamlandı'
                    : 'All mandatory modules completed'}
                </div>
              </div>
              {onOpenCertificate && (
                <button
                  type="button"
                  onClick={onOpenCertificate}
                  className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-xs transition-colors shrink-0"
                >
                  <Award className="w-4 h-4" />
                  <span>{locale === 'tr' ? 'Belgeyi Görüntüle' : 'View Certificate'}</span>
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                  {locale === 'tr' ? 'Hazırlık Devam Ediyor' : 'Preparation In Progress'}
                </div>
                <div className="text-[11px] text-amber-700 font-medium">
                  {locale === 'tr'
                    ? `${remainingCount} modül daha tamamlanmalı`
                    : `${remainingCount} more modules required`}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress Bars & Metrics */}
      <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        {/* Progress Bar (Spans 2 columns) */}
        <div className="md:col-span-2">
          <div className="flex justify-between items-center text-xs mb-2 font-medium">
            <span className="text-slate-700 font-bold flex items-center gap-1.5">
              <span>{locale === 'tr' ? 'Genel Tamamlanma' : 'Overall Completion'}</span>
              <span className="text-slate-400 font-normal">
                ({completedCount}/{totalCount} {locale === 'tr' ? 'Modül' : 'Modules'})
              </span>
            </span>
            <span className="text-blue-900 font-black text-sm">{percentage}%</span>
          </div>

          <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage === 100
                  ? 'bg-emerald-600'
                  : percentage >= 50
                  ? 'bg-blue-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Avg Quiz Score */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm shrink-0">
            <Sparkles className="w-4 h-4 text-blue-700" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">
              {locale === 'tr' ? 'Ortalama Test Skoru' : 'Average Quiz Score'}
            </div>
            <div className="text-base font-black text-slate-900">
              {averageQuizScore > 0 ? `%${averageQuizScore}` : '-'}
            </div>
          </div>
        </div>

        {/* Time Remaining */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 text-amber-700" />
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-medium">
              {locale === 'tr' ? 'Kalan Tahmini Süre' : 'Est. Time Remaining'}
            </div>
            <div className="text-base font-black text-slate-900">
              {remainingCount === 0
                ? locale === 'tr'
                  ? 'Tamamlandı'
                  : 'Finished'
                : `${estimatedMinutesRemaining} ${locale === 'tr' ? 'dk' : 'min'}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
