'use client';

import React from 'react';
import { Course, CourseSession } from '@mobility-nexus/types';
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
} from 'lucide-react';
import { GrantBadge } from './GrantBadge';
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
  if (!isOpen || !course) return null;

  const isTr = (lang || locale) === 'tr';
  const title = isTr ? course.titleTr : (course.titleEn || course.titleTr);
  const description = isTr ? course.descriptionTr : (course.descriptionEn || course.descriptionTr);
  const sessions = course.sessions || [];
  const outcomes = course.learningOutcomes || [];

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
            </div>
            <h2 className="text-xl font-bold leading-snug">{title}</h2>
            <p className="text-xs text-slate-300 mt-1 flex items-center gap-2">
              <span>{isTr ? 'Ev Sahibi Sağlayıcı:' : 'Host Provider:'} <strong className="text-white">{course.hostName}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                {course.rating.toFixed(1)} ({course.reviewsCount} {isTr ? 'Değerlendirme' : 'Reviews'})
              </span>
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

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
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
