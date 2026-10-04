'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { PrepModule, PrepCompletion } from '@mobility-nexus/types';
import {
  CheckCircle2,
  Clock,
  BookOpen,
  HelpCircle,
  Award,
  ChevronRight,
  ShieldCheck,
  Globe2,
  Languages,
  ShieldAlert,
  PlaneTakeoff,
  Leaf,
  Smartphone,
  FileCheck,
  LifeBuoy,
  Compass,
  X,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface MicroLearningCardProps {
  module: PrepModule;
  completion?: PrepCompletion;
  participantId: string;
  assignmentId: string;
  onCompletedStep: (moduleId: string, score: number) => Promise<void>;
}

// Icon mapper
function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'CULTURAL_ADAPTATION':
      return Globe2;
    case 'LANGUAGE_PREP':
      return Languages;
    case 'OHS_SAFETY':
      return ShieldAlert;
    case 'TRAVEL_LOGISTICS':
      return PlaneTakeoff;
    case 'ERASMUS_RIGHTS':
      return Award;
    case 'GREEN_DIGITAL':
      return Leaf;
    case 'ESCO_LEARNING':
      return FileCheck;
    case 'CRISIS_INSURANCE':
      return LifeBuoy;
    case 'MENTORSHIP_WORKPLACE':
      return Compass;
    default:
      return BookOpen;
  }
}

export function MicroLearningCard({
  module,
  completion,
  participantId,
  assignmentId,
  onCompletedStep,
}: MicroLearningCardProps) {
  const { locale } = useTranslation();
  const isCompleted = Boolean(completion?.isCompleted);
  const IconComponent = getCategoryIcon(module.category);

  // Modal interactive state
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'CONTENT' | 'QUIZ'>('CONTENT');

  // Quiz interactive state
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const title = (locale === 'tr' ? (module.title_tr || module.titleTr) : (module.title_en || module.titleEn)) || '';
  const description = (locale === 'tr' ? (module.description_tr || module.descriptionTr) : (module.description_en || module.descriptionEn)) || '';

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setQuizError(null);
  };

  const handleStartQuiz = () => {
    setActiveTab('QUIZ');
  };

  const handleSubmitQuiz = async () => {
    // Check all questions answered
    const unanswered = module.quizQuestions.some(
      (q) => selectedAnswers[q.id] === undefined
    );

    if (unanswered) {
      setQuizError(
        locale === 'tr'
          ? 'Lütfen tüm soruları işaretleyiniz.'
          : 'Please answer all questions before submitting.'
      );
      return;
    }

    // Calculate score
    let correctCount = 0;
    module.quizQuestions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctOptionIndex) {
        correctCount += 1;
      }
    });

    const score = Math.round(
      (correctCount / (module.quizQuestions.length || 1)) * 100
    );

    setIsSubmitting(true);
    try {
      await onCompletedStep(module.id, score);
      setQuizSubmitted(true);
    } catch (e: any) {
      setQuizError(e.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Main Card */}
      <div
        className={`bg-white rounded-xl border transition-all duration-200 p-5 flex flex-col justify-between ${
          isCompleted
            ? 'border-emerald-200/90 shadow-xs hover:border-emerald-300'
            : 'border-slate-200/90 shadow-sm hover:shadow-md hover:border-blue-300'
        }`}
      >
        <div>
          {/* Top badges */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">
              <IconComponent className="w-3.5 h-3.5 text-blue-700" />
              <span>
                {locale === 'tr' ? `Modül ${module.orderIndex}` : `Module ${module.orderIndex}`}
              </span>
            </span>

            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>
                  {module.estimatedDurationMinutes} {locale === 'tr' ? 'dk' : 'min'}
                </span>
              </span>

              {isCompleted ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{locale === 'tr' ? 'Tamamlandı' : 'Completed'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <span>{locale === 'tr' ? 'Bekliyor' : 'Pending'}</span>
                </span>
              )}
            </div>
          </div>

          {/* Title & Desc */}
          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-600 mt-1.5 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span className="truncate max-w-[130px] sm:max-w-none">{module.badgeName}</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(true);
              setActiveTab(isCompleted ? 'CONTENT' : 'CONTENT');
              setQuizSubmitted(isCompleted);
            }}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
              isCompleted
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
          >
            <span>
              {isCompleted
                ? locale === 'tr'
                  ? 'Tekrar İncele'
                  : 'Review'
                : locale === 'tr'
                ? 'Modülü Başlat'
                : 'Start Module'}
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Detail & Interactive Quiz Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600/40 text-blue-200 border border-blue-400/30">
                    {locale === 'tr' ? `Modül ${module.orderIndex}` : `Module ${module.orderIndex}`}
                  </span>
                  <span className="text-xs text-slate-300">
                    ⏱ {module.estimatedDurationMinutes} {locale === 'tr' ? 'dakika' : 'minutes'}
                  </span>
                  {isCompleted && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                      ✓ {locale === 'tr' ? 'Kazanıldı' : 'Passed'}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">{title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subnav Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('CONTENT')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'CONTENT'
                    ? 'border-blue-700 text-blue-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>{locale === 'tr' ? '1. Hazırlık Rehberi' : '1. Preparation Guide'}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('QUIZ')}
                className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'QUIZ'
                    ? 'border-blue-700 text-blue-800 bg-white rounded-t-lg'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                <HelpCircle className="w-4 h-4" />
                <span>
                  {locale === 'tr'
                    ? `2. Bilgi Doğrulama Testi (${module.quizQuestions.length} Soru)`
                    : `2. Knowledge Check (${module.quizQuestions.length} Questions)`}
                </span>
                {isCompleted && (
                  <Check className="w-3.5 h-3.5 text-emerald-600 font-black ml-1" />
                )}
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
              {activeTab === 'CONTENT' ? (
                <div>
                  <p className="text-sm text-slate-700 leading-relaxed mb-6 font-medium bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                    {description}
                  </p>

                  <div className="space-y-6">
                    {module.contentBlocks.map((block, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs"
                      >
                        <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span>{locale === 'tr' ? block.titleTr : block.titleEn}</span>
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                          {locale === 'tr' ? block.contentTr : block.contentEn}
                        </p>

                        {/* Checklist */}
                        {((locale === 'tr' ? block.checklistTr : block.checklistEn) || []).length >
                          0 && (
                          <div className="mt-4 pl-7">
                            <div className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wide">
                              {locale === 'tr' ? 'Uygulama Kontrol Listesi' : 'Action Checklist'}
                            </div>
                            <ul className="space-y-2">
                              {(locale === 'tr' ? block.checklistTr : block.checklistEn)?.map(
                                (item, cIdx) => (
                                  <li
                                    key={cIdx}
                                    className="flex items-start gap-2 text-xs text-slate-700 font-medium"
                                  >
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{item}</span>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* CTA to Quiz */}
                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={handleStartQuiz}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                    >
                      <span>
                        {locale === 'tr'
                          ? 'Konuyu Anladım, Teste Geç'
                          : 'I Understand, Proceed to Quiz'}
                      </span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* QUIZ TAB */
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-slate-900">
                      {locale === 'tr'
                        ? 'Kazanım Değerlendirme Soruları'
                        : 'Learning Outcome Assessment'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {locale === 'tr'
                        ? 'Modülü tamamlamak ve hazırlık karnenize işlemek için soruları doğru cevaplayınız.'
                        : 'Answer the questions correctly to complete this module and update your dossier.'}
                    </p>
                  </div>

                  {quizError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{quizError}</span>
                    </div>
                  )}

                  {quizSubmitted && isCompleted && (
                    <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-emerald-700 shrink-0" />
                        <div>
                          <strong className="font-bold">
                            {locale === 'tr'
                              ? 'Tebrikler! Bu modül başarıyla tamamlandı.'
                              : 'Congratulations! This module has been successfully mastered.'}
                          </strong>
                          <div className="text-[11px] text-emerald-700 mt-0.5">
                            {locale === 'tr'
                              ? `Kazanılan Rozet: ${module.badgeName} (%${completion?.quizScore || 100} Başarı)`
                              : `Badge Earned: ${module.badgeName} (${completion?.quizScore || 100}% Score)`}
                          </div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-black text-xs">
                        100 / 100
                      </span>
                    </div>
                  )}

                  <div className="space-y-5">
                    {module.quizQuestions.map((q, qIndex) => {
                      const options = locale === 'tr' ? q.optionsTr : q.optionsEn;
                      const isAnswered = selectedAnswers[q.id] !== undefined;
                      const selectedOpt = selectedAnswers[q.id];
                      const isCorrect = selectedOpt === q.correctOptionIndex;

                      return (
                        <div
                          key={q.id}
                          className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs"
                        >
                          <div className="flex items-start gap-2.5 mb-3">
                            <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                              {qIndex + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {locale === 'tr' ? q.questionTr : q.questionEn}
                            </span>
                          </div>

                          {/* Options */}
                          <div className="space-y-2 pl-8">
                            {options.map((opt, optIdx) => {
                              const isThisSelected = selectedOpt === optIdx;
                              let optionClass =
                                'border-slate-200 hover:border-blue-400 hover:bg-slate-50 text-slate-800';

                              if (isThisSelected && !quizSubmitted) {
                                optionClass =
                                  'border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-600';
                              } else if (quizSubmitted) {
                                if (optIdx === q.correctOptionIndex) {
                                  optionClass =
                                    'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                                } else if (isThisSelected && !isCorrect) {
                                  optionClass =
                                    'border-red-400 bg-red-50 text-red-900 font-medium';
                                }
                              }

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => handleSelectOption(q.id, optIdx)}
                                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${optionClass}`}
                                >
                                  <span>{opt}</span>
                                  {quizSubmitted && optIdx === q.correctOptionIndex && (
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                                  )}
                                </button>
                              );
                            })}
                          </div>

                          {/* Explanation if submitted */}
                          {quizSubmitted && (
                            <div className="mt-3 pl-8 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                              <strong className="text-slate-800">
                                {locale === 'tr' ? 'Açıklama: ' : 'Rationale: '}
                              </strong>
                              {locale === 'tr' ? q.explanationTr : q.explanationEn}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Submit / Close bar */}
                  <div className="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('CONTENT')}
                      className="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                    >
                      {locale === 'tr' ? '← Rehbere Dön' : '← Back to Guide'}
                    </button>

                    {!quizSubmitted ? (
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        disabled={isSubmitting}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        {isSubmitting ? (
                          <span>{locale === 'tr' ? 'Kaydediliyor...' : 'Saving...'}</span>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>
                              {locale === 'tr'
                                ? 'Cevapları Onayla ve Modülü Tamamla'
                                : 'Submit & Complete Module'}
                            </span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        {locale === 'tr' ? 'Kapat ve Devam Et' : 'Close and Continue'}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
