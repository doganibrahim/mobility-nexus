'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { calculateReadinessScore } from '../../lib/calculations';
import { useTranslation } from '../../lib/i18n';

interface SchoolProfileCardProps {
  data: {
    schoolName: string;
    city: string;
    accredited: 'yes' | 'no' | 'unknown';
    oid: string;
    erasmusPlan: string;
    institutionNeed: string;
  };
  onChange: (field: string, value: string) => void;
}

export default function SchoolProfileCard({
  data,
  onChange,
}: SchoolProfileCardProps) {
  const { t } = useTranslation();
  const { score: readinessScore } = calculateReadinessScore(data);

  return (
    <NeoCard
      id="school"
      title={t.school.title}
      badge={`Hazırlık Skoru: %${readinessScore}`}
      badgeType={readinessScore >= 70 ? 'good' : 'warn'}
      featured
    >
      <div className="space-y-4">
        {/* Row 1: School Name & City */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.school.nameLabel}
            </label>
            <input
              type="text"
              className="edu-input font-medium"
              placeholder={t.school.namePlaceholder}
              value={data.schoolName}
              onChange={(e) => onChange('schoolName', e.target.value)}
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.school.cityLabel}
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder={t.school.cityPlaceholder}
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
            />
          </div>
        </div>

        {/* Row 2: Accreditation Status & OID Code */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-7">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.school.accLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.accredited}
              onChange={(e) => onChange('accredited', e.target.value)}
            >
              <option value="unknown">{t.school.accUnknown}</option>
              <option value="yes">{t.school.accYes}</option>
              <option value="no">{t.school.accNo}</option>
            </select>
          </div>
          <div className="md:col-span-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.school.oidLabel}
            </label>
            <input
              type="text"
              className="edu-input font-semibold tracking-wider text-slate-900"
              placeholder="Örn: E10123456"
              value={data.oid}
              onChange={(e) => onChange('oid', e.target.value)}
            />
          </div>
        </div>

        {/* Row 3: Erasmus Plan Objectives */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.school.planLabel}
          </label>
          <input
            type="text"
            className="edu-input text-xs"
            placeholder={t.school.planPlaceholder}
            value={data.erasmusPlan}
            onChange={(e) => onChange('erasmusPlan', e.target.value)}
          />
        </div>

        {/* Row 4: Institutional Need & Concrete Challenge */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {t.school.needLabel}
          </label>
          <textarea
            className="edu-input min-h-[85px] resize-y text-xs leading-relaxed"
            placeholder={t.school.needPlaceholder}
            value={data.institutionNeed}
            onChange={(e) => onChange('institutionNeed', e.target.value)}
          />
        </div>

        {/* Readiness Meter Bar (Friendly Soft Progress) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-slate-700">
              {t.school.readinessTitle}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {readinessScore >= 70
                ? 'Kurum profili başvuru için yeterli seviyede.'
                : 'Temel alanları doldurarak skoru yükseltin.'}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-32 sm:w-44 h-2.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  readinessScore >= 70
                    ? 'bg-emerald-500'
                    : readinessScore >= 40
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                }`}
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-900 min-w-[45px] text-right">
              %{readinessScore}
            </span>
          </div>
        </div>
      </div>
    </NeoCard>
  );
}
