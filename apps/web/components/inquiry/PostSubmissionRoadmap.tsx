'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from '../../lib/i18n';
import { MobilityInquiry } from '../../lib/store';

interface PostSubmissionRoadmapProps {
  inquiry: MobilityInquiry;
  targetHost: {
    hostId?: string;
    hostName: string;
    hostCountry: string;
    organisationType?: string;
    oid?: string;
  };
  onClose: () => void;
  onNavigateToDashboard?: () => void;
  onSwitchToHost?: () => void;
  isSignedIn?: boolean;
}

export default function PostSubmissionRoadmap({
  inquiry,
  targetHost,
  onClose,
  onNavigateToDashboard,
  onSwitchToHost,
  isSignedIn = false,
}: PostSubmissionRoadmapProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (inquiry?.id) {
      navigator.clipboard.writeText(inquiry.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleTrackInDashboard = () => {
    onClose();
    if (onNavigateToDashboard) {
      onNavigateToDashboard();
    } else {
      const el = document.getElementById('sent-inquiries');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        router.push('/school/pipeline#sent-inquiries');
      }
    }
  };

  // Logistics summary badges
  const logistics = inquiry.logisticsRequired || {};
  const activeLogistics: string[] = [];
  if (logistics.accommodation) {
    activeLogistics.push(locale === 'tr' ? '🏨 Konaklama' : '🏨 Accommodation');
  }
  if (logistics.meals) {
    activeLogistics.push(locale === 'tr' ? '🍽️ Yemek' : '🍽️ Meals');
  }
  if (logistics.transfers) {
    activeLogistics.push(locale === 'tr' ? '🚗 Transfer' : '🚗 Transfers');
  }

  const phases = [
    {
      step: 1,
      icon: '🔍',
      title: t.inquiry.phase1Title,
      duration: t.inquiry.phase1Duration,
      desc: t.inquiry.phase1Desc,
      status: 'active',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      activeLabel: locale === 'tr' ? 'Mevcut Aşama: İnceleniyor' : 'Current Phase: In Review',
    },
    {
      step: 2,
      icon: '✏️',
      title: t.inquiry.phase2Title,
      duration: t.inquiry.phase2Duration,
      desc: t.inquiry.phase2Desc,
      status: 'upcoming',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-300',
      activeLabel: locale === 'tr' ? 'Sonraki Aşama' : 'Upcoming Phase',
    },
    {
      step: 3,
      icon: '📜',
      title: t.inquiry.phase3Title,
      duration: t.inquiry.phase3Duration,
      desc: t.inquiry.phase3Desc,
      status: 'upcoming',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      activeLabel: locale === 'tr' ? 'Nihai Sonuç: Resmi LoI' : 'Final Outcome: Official LoI',
    },
  ];

  return (
    <div className="py-2 space-y-6 animate-fadeIn text-xs text-slate-800">
      {/* Header Badge */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 text-2xl font-black flex items-center justify-center mx-auto shadow-xs ring-4 ring-emerald-50">
          ✓
        </div>
        <h4 className="text-base sm:text-lg font-bold text-slate-950 m-0">
          {t.inquiry.successTitle}
        </h4>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed m-0">
          {t.inquiry.roadmapSubtitle}
        </p>
      </div>

      {/* Inquiry Summary Card */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-600">
              {t.inquiry.inquiryIdLabel}:
            </span>
            <span className="font-mono font-bold text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {inquiry.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-[10px] text-slate-500 hover:text-blue-700 underline font-semibold cursor-pointer"
            >
              {copied
                ? locale === 'tr'
                  ? 'Kopyalandı!'
                  : 'Copied!'
                : locale === 'tr'
                ? 'Kopyala'
                : 'Copy'}
            </button>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse" />
              {t.inquiry.statusPending}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">
              {t.inquiry.targetHostLabel}:
            </span>
            <span className="font-bold text-slate-900 truncate block">
              {targetHost.hostName} ({targetHost.hostCountry})
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">
              {locale === 'tr' ? 'Mesleki Alan:' : 'VET Field:'}
            </span>
            <span className="font-bold text-slate-900 truncate block">
              {inquiry.vetField || (locale === 'tr' ? 'Genel Mesleki Eğitim' : 'General VET')}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">
              {t.inquiry.summaryLearners} & {t.inquiry.summaryDuration}:
            </span>
            <span className="font-semibold text-slate-800">
              {inquiry.participantCount} {locale === 'tr' ? 'Öğrenci' : 'Learners'}
              {inquiry.accompanyingPersonsCount > 0 &&
                ` + ${inquiry.accompanyingPersonsCount} ${
                  locale === 'tr' ? 'Refakatçi' : 'Staff'
                }`}
              {' • '}
              {inquiry.durationDays} {locale === 'tr' ? 'Gün' : 'Days'}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block text-[11px]">
              {t.inquiry.summaryDates}:
            </span>
            <span className="font-semibold text-slate-800">
              {inquiry.targetStartDate || '—'} → {inquiry.targetEndDate || '—'}
            </span>
          </div>
        </div>

        {/* Logistics Chips */}
        {activeLogistics.length > 0 && (
          <div className="pt-2 border-t border-slate-200 flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-500 font-semibold mr-1">
              {t.inquiry.summaryLogistics}:
            </span>
            {activeLogistics.map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white border border-slate-300 text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 3-Phase Roadmap Timeline */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <span>🗺️</span>
            <span>{t.inquiry.roadmapTitle}</span>
          </span>
          <span className="text-[11px] text-slate-500">
            {locale === 'tr' ? 'Toplam 3 Aşama' : '3 Formal Phases'}
          </span>
        </div>

        <div className="space-y-2.5">
          {phases.map((phase) => (
            <div
              key={phase.step}
              className={`p-3.5 rounded-xl border transition-all ${
                phase.status === 'active'
                  ? 'bg-blue-50/70 border-blue-200 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
                    phase.status === 'active'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}
                >
                  {phase.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 mb-1">
                    <span className="font-bold text-xs text-slate-900">
                      {phase.title}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${phase.badgeColor}`}
                    >
                      ⏱️ {phase.duration}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 m-0 leading-relaxed">
                    {phase.desc}
                  </p>
                  {phase.status === 'active' && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] font-bold text-blue-700">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                      <span>{phase.activeLabel}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-slate-200">
        <button
          type="button"
          onClick={handleTrackInDashboard}
          className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2"
        >
          <span>{t.inquiry.trackInDashboardBtn}</span>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors cursor-pointer"
        >
          {t.inquiry.closeBtn}
        </button>
      </div>

      {/* Demo Switch Option for Visitor Testing */}
      {!isSignedIn && onSwitchToHost && (
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          <span className="text-[11px] font-medium text-slate-400 mr-1.5">
            {t.sentInquiries.demoSwitchNotice}
          </span>
          <button
            type="button"
            onClick={onSwitchToHost}
            className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
          >
            {t.sentInquiries.demoSwitchBtn}
          </button>
        </div>
      )}
    </div>
  );
}
