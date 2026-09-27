'use client';

import React from 'react';
import { Course, CourseSession } from '@mobility-nexus/types';
import { Calendar, MapPin, Users, Award, Star, ArrowRight, ShieldCheck } from 'lucide-react';
import { GrantBadge } from './GrantBadge';
import { getCountryFlagLabel } from '@/lib/countries';
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

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden group">
      {/* Top Header Strip */}
      <div className="p-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
              <MapPin className="w-3 h-3 text-slate-500" />
              {getCountryFlagLabel(course.hostCountry, lang) || course.hostCountry} • {course.hostCity}
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
          <div className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(course)}
          className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors cursor-pointer line-clamp-2"
        >
          {title}
        </h3>

        <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
          <span>{course.hostName}</span>
        </p>

        {/* Description snippet */}
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-3">
          {course.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md"
            >
              #{tag}
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
      <div className="px-5 py-3 bg-slate-50/80 border-t border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
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
        <button
          type="button"
          onClick={() => onSelect(course)}
          className="text-xs font-semibold text-slate-600 hover:text-blue-700 transition-colors py-2 px-1"
        >
          {isTr ? 'Müfredat & Seanslar' : 'Curriculum & Sessions'}
        </button>

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
  );
}
