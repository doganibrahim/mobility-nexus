'use client';

import React from 'react';
import { useTranslation } from '../../lib/i18n';

interface InquiryStepIndicatorProps {
  currentStep: 1 | 2;
  onStepClick?: (step: 1 | 2) => void;
}

export default function InquiryStepIndicator({
  currentStep,
  onStepClick,
}: InquiryStepIndicatorProps) {
  const { t, locale } = useTranslation();

  const steps = [
    {
      number: 1 as const,
      title: t.inquiry.step1Title,
      subtitle: t.inquiry.step1Subtitle,
      icon: '📋',
    },
    {
      number: 2 as const,
      title: t.inquiry.step2Title,
      subtitle: t.inquiry.step2Subtitle,
      icon: '🏨',
    },
  ];

  return (
    <nav aria-label={locale === 'tr' ? 'Ön talep adımları' : 'Inquiry steps'} className="w-full">
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 sm:p-4">
        <div className="relative flex items-center justify-between">
          {/* Connecting Progress Line */}
          <div
            className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0"
            aria-hidden="true"
          >
            <div
              className={`h-full transition-all duration-300 ${
                currentStep === 2 ? 'w-full bg-emerald-500' : 'w-0 bg-blue-600'
              }`}
            />
          </div>

          {/* Steps */}
          {steps.map((step) => {
            const isCurrent = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            const isClickable = isCompleted && onStepClick;

            return (
              <div
                key={step.number}
                className="relative z-10 flex items-center gap-3 bg-slate-50 px-2 select-none"
              >
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.number)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex items-center justify-center w-9 h-9 rounded-full text-xs font-bold transition-all ${
                    isCompleted
                      ? 'bg-emerald-600 text-white shadow-xs cursor-pointer hover:bg-emerald-700 ring-2 ring-emerald-200'
                      : isCurrent
                      ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100'
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}
                >
                  {isCompleted ? '✓' : step.number}
                </button>

                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">{step.icon}</span>
                    <span
                      className={`text-xs font-bold ${
                        isCurrent
                          ? 'text-blue-900'
                          : isCompleted
                          ? 'text-emerald-900'
                          : 'text-slate-600'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    {step.subtitle}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Step Title Label */}
        <div className="sm:hidden mt-2 pt-2 border-t border-slate-200 text-center">
          <span className="text-[11px] font-bold text-blue-700">
            {t.inquiry.stepBadge} {currentStep}/2: {steps[currentStep - 1].title}
          </span>
          <p className="text-[10px] text-slate-500 m-0 mt-0.5">
            {steps[currentStep - 1].subtitle}
          </p>
        </div>
      </div>
    </nav>
  );
}
