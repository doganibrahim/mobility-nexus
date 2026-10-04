'use client';

import React, { useState } from 'react';
import { Course, CourseSession, HostCancellationPolicy } from '@mobility-nexus/types';
import {
  Calendar,
  MapPin,
  Users,
  Award,
  Star,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Accessibility,
  Utensils,
  Eye,
  Info,
  ChevronRight,
  X,
} from 'lucide-react';
import { GrantBadge } from './GrantBadge';
import { ProviderFeedbackBreakdown } from './ProviderFeedbackBreakdown';
import { getCountryFlagLabel, localizeMarketplaceTag } from '@/lib/countries';
import { useTranslation } from '@/lib/i18n';

interface CourseCardProps {
  course: Course;
  onSelect: (course: Course) => void;
  onApplyDirect: (course: Course, session?: CourseSession) => void;
  lang?: 'tr' | 'en';
}

export function CourseCard({ course, onSelect, onApplyDirect, lang }: CourseCardProps) {
  const { locale } = useTranslation();
  const currentLang = lang || (locale as 'tr' | 'en') || 'tr';
  const isTr = currentLang === 'tr';
  const title = isTr ? (course.titleTr || course.titleEn) : (course.titleEn || course.titleTr);
  const description = isTr ? (course.descriptionTr || course.descriptionEn) : (course.descriptionEn || course.descriptionTr);
  const sessions = course.sessions || [];
  const openSessions = sessions.filter((s) => s.status === 'OPEN' || s.status === 'LIMITED');
  const nextSession = openSessions[0];

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Cancellation Policy resolution
  const policyObj: HostCancellationPolicy | null =
    typeof course.cancellationPolicy === 'object' && course.cancellationPolicy !== null
      ? (course.cancellationPolicy as HostCancellationPolicy)
      : null;

  const policyType = policyObj?.policyType || (typeof course.cancellationPolicy === 'string' ? course.cancellationPolicy : 'FLEXIBLE');
  const policyLabel =
    policyType === 'FLEXIBLE'
      ? (isTr ? 'Esnek İptal (30 Güne Kadar %100 İade)' : 'Flexible Policy (100% Refund up to 30d)')
      : policyType === 'MODERATE'
      ? (isTr ? 'Dengeli İptal (45 Gün %100 / 21 Gün %50)' : 'Moderate Policy (45d 100% / 21d 50%)')
      : (isTr ? 'Mücbir Sebep Garantili İptal' : 'Force Majeure Guaranteed');

  // Accessibility features
  const access = course.accessibilityFeatures || {
    wheelchairAccessible: true,
    specialDiet: true,
  };

  // Date formatted
  const rawDate = course.lastUpdatedAt || course.updatedAt || '2026-03-01T10:00:00Z';
  const updatedFormatted = new Date(rawDate).toLocaleDateString(isTr ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
        {/* Top Header Strip */}
        <div className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="w-3 h-3 text-slate-500" />
                {getCountryFlagLabel(course.hostCountry, currentLang) || course.hostCountry} • {course.hostCity}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                ISCED {course.iscedCode}
              </span>
              {course.hostOid && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-slate-50 text-slate-600 border border-slate-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  OID: {course.hostOid}
                </span>
              )}
            </div>

            {/* Clickable 5D Rating Badge */}
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              title={isTr ? '5 Boyutlu Performans Kırılımını İncele' : 'View 5-Dimensional Performance Breakdown'}
              className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 shrink-0 transition-colors cursor-pointer"
            >
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{course.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
              <Sparkles className="w-3 h-3 text-amber-600 ml-0.5" />
            </button>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(course)}
            className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-2"
          >
            {title}
          </h3>

          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span>{course.hostName}</span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isTr ? `Güncellendi: ${updatedFormatted}` : `Updated: ${updatedFormatted}`}
            </span>
          </p>

          {/* Description snippet */}
          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Trust Badges: Cancellation Policy & Accessibility */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
            {/* Cancellation Policy Badge */}
            <span
              title={policyObj?.policyDetailsTr || policyLabel}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{policyLabel}</span>
            </span>

            {/* Accessibility Features */}
            {access.wheelchairAccessible && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Accessibility className="w-3 h-3 text-blue-600" />
                <span>{isTr ? 'Tekerlekli Sandalye' : 'Wheelchair Access'}</span>
              </span>
            )}
            {access.specialDiet && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Utensils className="w-3 h-3 text-amber-600" />
                <span>{isTr ? 'Özel Diyet' : 'Dietary Support'}</span>
              </span>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-2.5">
            {course.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
              >
                #{localizeMarketplaceTag(tag, currentLang)}
              </span>
            ))}
            {course.tags.length > 3 && (
              <span className="text-[11px] px-1.5 py-0.5 text-slate-400">
                +{course.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Course Highlights Strip */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-t border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            {course.durationDays} {isTr ? 'Günlük Eğitim' : 'Days Training'} • {course.minLanguageLevel} {isTr ? 'Dil' : 'Lang'}
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            {openSessions.length > 0
              ? (isTr ? `${openSessions.length} Açık Seans` : `${openSessions.length} Open Sessions`)
              : (isTr ? 'Kontenjan Bekleniyor' : 'Awaiting Quota')}
          </span>
        </div>

        {/* Card Footer Actions */}
        <div className="p-5 pt-3 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect(course)}
              className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors py-2 px-1"
            >
              {isTr ? 'Müfredat & Seanslar' : 'Curriculum & Sessions'}
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors py-2 px-1 flex items-center gap-1"
            >
              <span>{isTr ? '5 Boyutlu Değerlendirme' : '5D Feedback'}</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => onApplyDirect(course, nextSession)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 active:scale-98 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <span>{isTr ? 'Seans Seç & Başvur' : 'Select Session & Apply'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5-Dimensional Review Modal */}
      {isFeedbackModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{course.hostName}</h3>
                <p className="text-xs text-slate-300">
                  {isTr ? 'Doğrulanmış Sağlayıcı Performans Karnesi ve Okul Yorumları' : 'Verified Provider Performance Scorecard & School Reviews'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <ProviderFeedbackBreakdown
                hostId={course.hostId}
                hostName={course.hostName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
