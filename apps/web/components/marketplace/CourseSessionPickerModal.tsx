'use client';

import React, { useState } from 'react';
import { Course, CourseSession, HostCancellationPolicy } from '@mobility-nexus/types';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Star,
  ArrowRight,
  Clock,
  Accessibility,
  Utensils,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { GrantBadge } from './GrantBadge';
import { ProviderFeedbackBreakdown } from './ProviderFeedbackBreakdown';
import { useTranslation } from '../../lib/i18n';

interface CourseSessionPickerModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectSession: (course: Course, session: CourseSession) => void;
  lang?: 'tr' | 'en';
}

export function CourseSessionPickerModal({
  course,
  isOpen,
  onClose,
  onSelectSession,
  lang,
}: CourseSessionPickerModalProps) {
  const { locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'FEEDBACK'>('OVERVIEW');

  if (!isOpen || !course) return null;

  const isTr = (lang || locale) === 'tr';
  const title = isTr ? course.titleTr : (course.titleEn || course.titleTr);
  const description = isTr ? course.descriptionTr : (course.descriptionEn || course.descriptionTr);
  const sessions = course.sessions || [];
  const outcomes = course.learningOutcomes || [];

  // Cancellation policy
  const policyObj: HostCancellationPolicy | null =
    typeof course.cancellationPolicy === 'object' && course.cancellationPolicy !== null
      ? (course.cancellationPolicy as HostCancellationPolicy)
      : null;

  const policyType =
    policyObj?.policyType ||
    (typeof course.cancellationPolicy === 'string' ? course.cancellationPolicy : 'FLEXIBLE');

  const policyTitle =
    policyType === 'FLEXIBLE'
      ? (isTr ? 'Esnek İptal Koşulları (30 Güne Kadar %100 Kesintisiz İade)' : 'Flexible Policy (100% Refund up to 30 Days)')
      : policyType === 'MODERATE'
      ? (isTr ? 'Dengeli İptal Koşulları (45 Gün %100 / 21 Gün %50 İade)' : 'Moderate Policy (45d 100% / 21d 50% Refund)')
      : (isTr ? 'Mücbir Sebep Korumalı İptal Koşulları' : 'Force Majeure Protected Cancellation Policy');

  const policyDetail =
    policyObj?.policyDetailsTr ||
    (isTr
      ? 'Hareketlilik başlangıcından 30 gün öncesine kadar ücretsiz %100 iade. 14 güne kadar %50 iade. Ulusal Ajans vize veya mücbir sebep iptallerinde tam hibe güvencesi sunulur.'
      : 'Full 100% refund up to 30 days before mobility. 50% refund up to 14 days. National Agency force majeure and visa guarantees apply.');

  // Accessibility
  const access = course.accessibilityFeatures || {
    wheelchairAccessible: true,
    specialDiet: true,
  };

  const rawDate = course.lastUpdatedAt || course.updatedAt || '2026-03-01T10:00:00Z';
  const updatedFormatted = new Date(rawDate).toLocaleDateString(isTr ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-200 border border-blue-400/30">
                {course.hostCity}, {course.hostCountry}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                ISCED {course.iscedCode}
              </span>
              {course.hostOid && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  OID: {course.hostOid}
                </span>
              )}
              <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-1">
                <Clock className="w-3 h-3" />
                {isTr ? `Son Güncelleme: ${updatedFormatted}` : `Last Updated: ${updatedFormatted}`}
              </span>
            </div>
            <h2 className="text-xl font-bold leading-snug">{title}</h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>{isTr ? 'Ev Sahibi Sağlayıcı:' : 'Host Provider:'} <strong className="text-white">{course.hostName}</strong></span>
              <span>•</span>
              <button
                type="button"
                onClick={() => setActiveTab('FEEDBACK')}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 underline font-semibold"
              >
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {course.rating.toFixed(1)} ({course.reviewsCount} {isTr ? '5 Boyutlu Değerlendirme' : '5D Reviews'})
              </button>
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation: Overview vs 5D Feedback Breakdown */}
        <div className="px-6 bg-slate-100/80 border-b border-slate-200 flex items-center gap-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'OVERVIEW'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isTr ? 'Müfredat ve Seanslar' : 'Curriculum & Sessions'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('FEEDBACK')}
            className={`py-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'FEEDBACK'
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{isTr ? '5 Boyutlu Performans Karnesi' : '5D Performance Scorecard'}</span>
            <span className="ml-1 px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded-full text-[10px]">
              {course.rating.toFixed(1)} ★
            </span>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'FEEDBACK' ? (
            <ProviderFeedbackBreakdown
              hostId={course.hostId}
              hostName={course.hostName}
            />
          ) : (
            <>
              {/* Erasmus+ Grant Banner */}
              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-950">
                      {isTr ? 'Resmi Erasmus+ Kurs Ücreti Hibesi Standardı' : 'Official Erasmus+ Course Fee Grant Standard'}
                    </h4>
                    <p className="text-xs text-emerald-700">
                      {isTr
                        ? 'Öğretmen başına günlük 80 € (Maksimum 800 € / 10 gün) doğrudan proje bütçenizden karşılanır.'
                        : '€80 per day per teacher (Max €800 / 10 days) is directly covered by your project budget.'}
                    </p>
                  </div>
                </div>
                <GrantBadge days={course.durationDays} />
              </div>

              {/* Cancellation Policy & Inclusion Strip */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{policyTitle}</h4>
                      <p className="text-[11px] text-slate-600">{policyDetail}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded shrink-0">
                    {isTr ? 'AB Mücbir Sebep Korumalı' : 'EU Force Majeure Protected'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs">
                  <span className="font-semibold text-slate-700">
                    {isTr ? 'Erişilebilirlik & Kapsayıcılık:' : 'Accessibility & Inclusion:'}
                  </span>
                  {access.wheelchairAccessible && (
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                      <Accessibility className="w-3.5 h-3.5 text-blue-600" />
                      <span>{isTr ? 'Tekerlekli Sandalye Erişilebilir' : 'Wheelchair Accessible'}</span>
                    </span>
                  )}
                  {access.specialDiet && (
                    <span className="inline-flex items-center gap-1 text-slate-700 bg-white px-2.5 py-1 rounded-md border border-slate-200 font-medium">
                      <Utensils className="w-3.5 h-3.5 text-amber-600" />
                      <span>{isTr ? 'Özel Diyet (Helal/Vegan) Desteği' : 'Dietary (Halal/Vegan) Support'}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Description & Overview */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  {isTr ? 'Kurs Kapsamı ve Pedagojik Yaklaşım' : 'Course Scope & Pedagogical Approach'}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                  {description}
                </p>
              </div>

              {/* Learning Outcomes (ESCO Aligned) */}
              {outcomes.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-600" />
                    {isTr ? 'Kazanılacak Öğrenme Çıktıları & Beceriler (ESCO Uyumlu)' : 'Learning Outcomes & Skills Acquired (ESCO Aligned)'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {outcomes.map((outcome) => (
                      <div
                        key={outcome.id}
                        className="p-3 rounded-lg border border-slate-200/90 bg-white flex items-start gap-2.5"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-slate-800 font-medium leading-normal">
                            {isTr ? outcome.outcomeTr : (outcome.outcomeEn || outcome.outcomeTr)}
                          </p>
                          {outcome.escoSkillLabel && (
                            <span className="inline-block mt-1 text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                              ESCO: {outcome.escoSkillLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Sessions List */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    {isTr ? 'Açık Oturumlar ve Kontenjan Takvimi' : 'Open Sessions & Capacity Schedule'}
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {isTr ? `${sessions.length} Seans Planlandı` : `${sessions.length} Sessions Scheduled`}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {sessions.map((session) => {
                    const isFull = session.status === 'FULL' || session.enrolledCount >= session.capacity;
                    const isLimited = session.status === 'LIMITED';
                    const remainingSeats = Math.max(0, session.capacity - session.enrolledCount);
                    const percent = Math.min(100, Math.round((session.enrolledCount / session.capacity) * 100));

                    return (
                      <div
                        key={session.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isFull
                            ? 'bg-slate-50 border-slate-200 opacity-70'
                            : 'bg-white border-slate-200/90 hover:border-blue-400 hover:shadow-xs'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold text-slate-900">
                                {session.startDate} — {session.endDate}
                              </span>
                              {isFull && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-100 text-rose-700">
                                  {isTr ? 'KONTENJAN DOLDU' : 'FULLY BOOKED'}
                                </span>
                              )}
                              {isLimited && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-100 text-amber-800">
                                  {isTr ? 'SON YERLER' : 'LAST SPOTS'}
                                </span>
                              )}
                              {!isFull && !isLimited && (
                                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-100 text-emerald-800">
                                  {isTr ? 'KAYIT AÇIK' : 'REGISTRATION OPEN'}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {session.city}, {session.country} • {isTr ? `${course.durationDays} Günlük Yoğun Atölye` : `${course.durationDays} Days Intensive Workshop`}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-5">
                          {/* Capacity bar */}
                          <div className="w-32">
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                              <span>{isTr ? 'Kontenjan' : 'Capacity'}</span>
                              <span>{session.enrolledCount} / {session.capacity}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  isFull ? 'bg-rose-500' : isLimited ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${percent}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              {remainingSeats > 0
                                ? (isTr ? `${remainingSeats} boş yer kaldı` : `${remainingSeats} spots left`)
                                : (isTr ? 'Yedek liste' : 'Waiting list')}
                            </span>
                          </div>

                          {/* Select Session Action Button */}
                          <button
                            type="button"
                            disabled={isFull}
                            onClick={() => onSelectSession(course, session)}
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                              isFull
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : 'bg-blue-700 hover:bg-blue-800 active:scale-98 text-white shadow-xs'
                            }`}
                          >
                            <span>{isTr ? 'Seans Seç & Başvur' : 'Select Session & Apply'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {isTr ? 'Diller:' : 'Languages:'} <strong>{course.language}</strong> ({isTr ? 'Asgari' : 'Minimum'} <strong>{course.minLanguageLevel}</strong>)
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-200/70 transition-colors"
          >
            {isTr ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}
