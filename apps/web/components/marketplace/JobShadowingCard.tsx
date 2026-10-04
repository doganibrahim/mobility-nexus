'use client';

import React, { useState } from 'react';
import { JobShadowingOffer, HostCancellationPolicy } from '@mobility-nexus/types';
import {
  MapPin,
  Briefcase,
  Users,
  Clock,
  ShieldCheck,
  ArrowRight,
  Accessibility,
  Utensils,
  Sparkles,
  Star,
  X,
  UserCheck,
} from 'lucide-react';
import { ProviderFeedbackBreakdown } from './ProviderFeedbackBreakdown';
import { GrantBadge } from './GrantBadge';
import { getCountryFlagLabel } from '@/lib/countries';
import { useTranslation } from '@/lib/i18n';

interface JobShadowingCardProps {
  offer: JobShadowingOffer;
  onApply: (offer: JobShadowingOffer) => void;
  lang?: 'tr' | 'en';
}

export function JobShadowingCard({ offer, onApply, lang }: JobShadowingCardProps) {
  const { locale } = useTranslation();
  const isTr = (lang || locale) === 'tr';
  const title = isTr ? offer.titleTr : (offer.titleEn || offer.titleTr);
  const description = isTr ? offer.descriptionTr : (offer.descriptionEn || offer.descriptionTr);

  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);

  // Cancellation Policy resolution
  const policyObj: HostCancellationPolicy | null =
    typeof offer.cancellationPolicy === 'object' && offer.cancellationPolicy !== null
      ? (offer.cancellationPolicy as HostCancellationPolicy)
      : null;

  const policyType =
    policyObj?.policyType ||
    (typeof offer.cancellationPolicy === 'string' ? offer.cancellationPolicy : 'FLEXIBLE');

  const policyLabel =
    policyType === 'FLEXIBLE'
      ? (isTr ? 'Esnek İptal (30 Güne Kadar %100 İade)' : 'Flexible Policy (100% Refund up to 30d)')
      : policyType === 'MODERATE'
      ? (isTr ? 'Dengeli İptal (45 Gün %100 / 21 Gün %50)' : 'Moderate Policy (45d 100% / 21d 50%)')
      : (isTr ? 'Mücbir Sebep Garantili İptal' : 'Force Majeure Guaranteed');

  // Accessibility features
  const access = offer.accessibilityFeatures || {
    wheelchairAccessible: true,
    specialDiet: true,
  };

  // Target groups (Öğrenci, Çırak, Personel, Öğretmen)
  const targetGroups = offer.targetGroups || ['TEACHER', 'STAFF'];

  // Date formatted
  const rawDate = offer.lastUpdatedAt || offer.updatedAt || '2026-03-01T10:00:00Z';
  const updatedFormatted = new Date(rawDate).toLocaleDateString(isTr ? 'tr-TR' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <>
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between overflow-hidden">
        <div className="p-5 pb-3">
          {/* Top Badges */}
          <div className="flex items-start justify-between gap-3 mb-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                <MapPin className="w-3 h-3 text-slate-500" />
                {getCountryFlagLabel(offer.country, isTr ? 'tr' : 'en') || offer.country} • {offer.city}
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                {isTr ? 'İşbaşı Gözlem' : 'Job Shadowing'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isTr ? 'Aktif Kontenjan' : 'Active Quota'}
              </span>

              <button
                type="button"
                onClick={() => setIsFeedbackModalOpen(true)}
                title={isTr ? '5 Boyutlu Performans Karnesini Gör' : 'View 5D Performance Scorecard'}
                className="flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200 transition-colors cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                <span>4.9</span>
                <Sparkles className="w-3 h-3 text-amber-600" />
              </button>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
            {title}
          </h3>

          <p className="text-xs font-medium text-slate-500 mt-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <span>{offer.hostName}</span>
            </span>
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {isTr ? `Güncellendi: ${updatedFormatted}` : `Updated: ${updatedFormatted}`}
            </span>
          </p>

          {/* Description */}
          <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Target Groups & Accessibility Strip */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-[11px]">
            {/* Cancellation Policy Badge */}
            <span
              title={policyObj?.policyDetailsTr || policyLabel}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/90 font-medium"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{policyLabel}</span>
            </span>

            {/* Target Audience Badges */}
            {targetGroups.map((tg, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200/80 font-medium"
              >
                <UserCheck className="w-3 h-3 text-blue-600" />
                <span>
                  {tg === 'STUDENT'
                    ? (isTr ? 'Öğrenci' : 'Student')
                    : tg === 'APPRENTICE'
                    ? (isTr ? 'Çırak' : 'Apprentice')
                    : tg === 'TEACHER'
                    ? (isTr ? 'Öğretmen' : 'Teacher')
                    : (isTr ? 'Personel' : 'Staff')}
                </span>
              </span>
            ))}

            {/* Accessibility badges */}
            {access.wheelchairAccessible && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Accessibility className="w-3 h-3 text-blue-600" />
                <span>{isTr ? 'Tekerlekli Sandalye' : 'Wheelchair'}</span>
              </span>
            )}
            {access.specialDiet && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                <Utensils className="w-3 h-3 text-amber-600" />
                <span>{isTr ? 'Özel Diyet' : 'Special Diet'}</span>
              </span>
            )}
          </div>

          {/* Eligible Staff Types */}
          <div className="mt-2.5 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">
              {isTr ? 'Kabul Edilen Branşlar / Görevler:' : 'Eligible Branches / Roles:'}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {offer.eligibleStaffTypes.map((staff, idx) => (
                <span
                  key={idx}
                  className="text-[11px] px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-medium"
                >
                  {staff}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Logistics & Capacity Details */}
        <div className="px-5 py-2.5 bg-slate-50/80 border-t border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            {isTr ? `${offer.durationDays} Günlük Saha İncelemesi` : `${offer.durationDays} Days Field Visit`}
          </span>
          <span className="flex items-center gap-1 font-medium text-slate-700">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            {isTr ? `Kapasite: Maks. ${offer.maxCapacityPerSlot} Katılımcı` : `Capacity: Max ${offer.maxCapacityPerSlot} Participants`}
          </span>
        </div>

        {/* Action Footer */}
        <div className="p-5 pt-3 bg-white flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="text-[11px] text-slate-500">
              {isTr ? 'Diller:' : 'Languages:'} <span className="font-medium text-slate-700">{offer.languages.join(', ')}</span>
            </div>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={() => setIsFeedbackModalOpen(true)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors py-1 flex items-center gap-1"
            >
              <span>{isTr ? '5 Boyutlu Puanlar' : '5D Reviews'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => onApply(offer)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold transition-all shadow-xs"
          >
            <span>{isTr ? 'İşbaşı Gözlem Başvurusu Yap' : 'Apply for Job Shadowing'}</span>
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
                <h3 className="text-base font-bold text-white">{offer.hostName}</h3>
                <p className="text-xs text-slate-300">
                  {isTr ? 'Doğrulanmış İşbaşı Gözlem Sağlayıcı Performans Karnesi' : 'Verified Job Shadowing Provider Performance Scorecard'}
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
                hostId={offer.hostId}
                hostName={offer.hostName}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
