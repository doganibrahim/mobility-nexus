'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { ASSESSMENT_QUESTIONS } from '../../lib/constants';
import { useTranslation } from '../../lib/i18n';

interface CompetenceAssessmentCardProps {
  answers: Record<number, number>;
  onAnswerChange: (questionId: number, value: number) => void;
  onScoreClick: () => void;
  resultMessage?: string;
  resultType?: 'good' | 'warn' | 'bad';
}

export default function CompetenceAssessmentCard({
  answers,
  onAnswerChange,
  onScoreClick,
  resultMessage,
  resultType = 'warn',
}: CompetenceAssessmentCardProps) {
  const { t, locale } = useTranslation();

  const missingQuestions = ASSESSMENT_QUESTIONS.filter(
    (q) => !answers[q.id] || answers[q.id] < 1 || answers[q.id] > 5,
  ).map((q) => q.id);

  const answeredCount = 12 - missingQuestions.length;
  const isAllAnswered = missingQuestions.length === 0;

  // Single-source derived message: guarantees badge and message box never contradict
  const displayMessage = (() => {
    if (isAllAnswered) {
      if (
        resultMessage &&
        !resultMessage.includes('Eksik Sorular') &&
        !resultMessage.includes('Missing Questions')
      ) {
        return resultMessage;
      }
      return locale === 'en'
        ? '✓ All 12 questions completed. Competence evaluation is ready.'
        : '✓ 12 sorunun tamamı yanıtlandı. Yetkinlik değerlendirmesi hazır.';
    }
    return locale === 'en'
      ? `Missing Questions: Please answer question(s) ${missingQuestions.join(', ')}.`
      : `Eksik Sorular: Lütfen ${missingQuestions.join(', ')} numaralı soruları yanıtlayın.`;
  })();

  const displayType: 'good' | 'warn' | 'bad' = isAllAnswered
    ? resultType === 'bad'
      ? 'warn'
      : (resultType || 'good')
    : 'warn';

  return (
    <NeoCard
      id="assessment"
      title={t.assessment.title}
      badge={`${answeredCount}/12 ${locale === 'en' ? 'Completed' : 'Tamamlandı'}`}
      badgeType={isAllAnswered ? 'good' : 'warn'}
    >
      <div className="space-y-4">
        <p className="text-xs text-slate-600 mb-1">
          {t.assessment.desc}
        </p>

        {/* 12 Questions Cards Matrix */}
        <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
          {ASSESSMENT_QUESTIONS.map((q) => {
            const currentVal = answers[q.id];
            return (
              <div
                key={q.id}
                className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="text-xs font-bold text-slate-900">
                      <span className="text-blue-700 font-bold mr-1.5">
                        {String(q.id).padStart(2, '0')}.
                      </span>
                      {locale === 'en' && q.titleEn ? q.titleEn : q.title}
                    </div>
                    <div className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {locale === 'en' && q.descriptionEn ? q.descriptionEn : q.description}
                    </div>
                  </div>
                </div>

                {/* Friendly 1-5 Scale Radio-Buttons */}
                <div className="grid grid-cols-5 gap-1 sm:gap-1.5 mt-3 pt-2.5 border-t border-slate-200/60">
                  {[1, 2, 3, 4, 5].map((val) => {
                    const isSelected = currentVal === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => onAnswerChange(q.id, val)}
                        className={`py-1.5 px-0.5 sm:px-1.5 text-xs font-semibold rounded-lg border transition-all text-center min-w-0 overflow-hidden flex flex-col items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-sm leading-tight">{val}</span>
                        <span className="block text-[8.5px] sm:text-[10px] font-normal opacity-90 truncate w-full text-center leading-tight mt-0.5">
                          {val === 1 ? (
                            locale === 'tr' ? 'Başlangıç' : 'Novice'
                          ) : val === 2 ? (
                            locale === 'tr' ? 'Temel' : 'Level 2'
                          ) : val === 3 ? (
                            <>
                              <span className="hidden sm:inline">{locale === 'tr' ? 'Orta' : 'Intermediate'}</span>
                              <span className="sm:hidden">{locale === 'tr' ? 'Orta' : 'Inter.'}</span>
                            </>
                          ) : val === 4 ? (
                            locale === 'tr' ? 'Yetkin' : 'Level 4'
                          ) : (
                            locale === 'tr' ? 'İleri' : 'Advanced'
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {currentVal && (
                  <div className="mt-2 text-[11px] text-slate-500 font-medium flex items-center justify-between px-0.5">
                    <span>{locale === 'tr' ? 'Seçilen Yetkinlik:' : 'Selected Level:'}</span>
                    <span className="font-bold text-blue-700">
                      {currentVal === 1
                        ? (locale === 'tr' ? '1 - Başlangıç Seviyesi' : '1 - Novice')
                        : currentVal === 2
                        ? (locale === 'tr' ? '2 - Temel Düzey' : '2 - Level 2 (Basic)')
                        : currentVal === 3
                        ? (locale === 'tr' ? '3 - Orta Düzey (Intermediate)' : '3 - Intermediate')
                        : currentVal === 4
                        ? (locale === 'tr' ? '4 - Yetkin Düzey' : '4 - Level 4 (Proficient)')
                        : (locale === 'tr' ? '5 - İleri Seviye (Advanced)' : '5 - Advanced')}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100 no-print">
          <button
            type="button"
            onClick={onScoreClick}
            className="edu-btn-primary text-xs"
          >
            📊 {locale === 'tr' ? 'Yetkinlik Skorunu Hesapla' : 'Calculate Competence Score'}
          </button>
          <a
            href="https://www.competence4vet.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="edu-btn-secondary text-xs"
          >
            🧪 {locale === 'tr' ? 'Competence4VET Test Portalı ↗' : 'Competence4VET Assessment Portal ↗'}
          </a>
        </div>

        {/* Score Result Box */}
        {displayMessage && (
          <div
            className={`p-4 rounded-xl border text-xs font-semibold ${
              displayType === 'good'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : displayType === 'warn'
                  ? 'bg-amber-50 text-amber-900 border-amber-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {displayMessage}
          </div>
        )}
      </div>
    </NeoCard>
  );
}
