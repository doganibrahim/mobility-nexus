'use client';

import React from 'react';
import { JobShadowingOffer } from '@mobility-nexus/types';
import { MapPin, Briefcase, Users, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
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

  return (
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

          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {isTr ? 'Aktif Kontenjan' : 'Active Quota'}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 line-clamp-2">
          {title}
        </h3>

        <p className="text-xs font-medium text-slate-500 mt-1 flex items-center gap-1.5">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" />
          <span>{offer.hostName}</span>
        </p>

        {/* Description */}
        <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
          {description}
        </p>

        {/* Eligible Staff Types */}
        <div className="mt-3.5 pt-3 border-t border-slate-100">
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

      {/* Logistics Details */}
      <div className="px-5 py-3 bg-slate-50/80 border-t border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          {isTr ? `${offer.durationDays} Günlük Saha İncelemesi` : `${offer.durationDays} Days Field Visit`}
        </span>
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          {isTr ? `Maks. ${offer.maxCapacityPerSlot} Öğretmen` : `Max ${offer.maxCapacityPerSlot} Teachers`}
        </span>
      </div>

      {/* Action Footer */}
      <div className="p-5 pt-3 bg-white flex items-center justify-between gap-3">
        <div className="text-[11px] text-slate-500">
          {isTr ? 'Diller:' : 'Languages:'} <span className="font-medium text-slate-700">{offer.languages.join(', ')}</span>
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
  );
}
