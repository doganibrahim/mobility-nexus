'use client';

import React, { useMemo } from 'react';
import NeoCard from '../ui/NeoCard';
import { useTranslation } from '../../lib/i18n';
import { checkKa122Eligibility } from '../../lib/calculations';
import {
  Ka122EligibilityResult,
  Ka122EligibilityState,
} from '@mobility-nexus/types';

interface EligibilityGatekeeperCardProps {
  data: Ka122EligibilityState;
  onChange: (field: keyof Ka122EligibilityState, val: any) => void;
}

export default function EligibilityGatekeeperCard({
  data,
  onChange,
}: EligibilityGatekeeperCardProps) {
  const { t, locale } = useTranslation();

  const eligibilityResult: Ka122EligibilityResult = useMemo(() => {
    return checkKa122Eligibility(data);
  }, [data]);

  return (
    <NeoCard
      id="eligibility"
      title={t.eligibility.title}
      badge={t.eligibility.badge}
      badgeType="primary"
    >
      <div className="space-y-5">
        {/* Description Banner */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-base shrink-0">🛡️</span>
            <div>
              <strong className="text-slate-900 font-semibold">
                {locale === 'tr' ? 'Ön Uygunluk Kontrolü:' : 'Preliminary Eligibility Assessment:'}
              </strong>{' '}
              {t.eligibility.subtitle}
            </div>
          </div>
        </div>

        {/* Input Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Accreditation Status */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.eligibility.accreditationLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.accredited}
              onChange={(e) => onChange('accredited', e.target.value)}
            >
              <option value="no">
                {locale === 'tr' ? 'Erasmus Akreditasyonu Bulunmuyor' : 'Does Not Hold an Erasmus Accreditation'}
              </option>
              <option value="yes">
                {locale === 'tr' ? 'Erasmus Akreditasyonuna Sahip Kuruluş KA120-VET' : 'Holds an Erasmus Accreditation KA120-VET'}
              </option>
              <option value="unknown">
                {locale === 'tr' ? 'Bilinmiyor / Teyit Edilecek' : 'Unknown / To Be Verified'}
              </option>
            </select>
          </div>

          {/* Participant Count */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.eligibility.participantCountLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={150}
                className={`edu-input font-bold ${
                  data.participantCount > 30 ? 'border-amber-400 bg-amber-50/40 text-amber-900' : 'text-slate-900'
                }`}
                value={data.participantCount || ''}
                onChange={(e) => onChange('participantCount', Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 pointer-events-none">
                {locale === 'tr' ? 'Kişi' : 'Participants'}
              </span>
            </div>
            {data.participantCount > 30 && (
              <span className="text-[11px] text-amber-700 font-medium mt-1 block">
                ⚠️ {locale === 'tr' ? 'KA122 için azami sınır 30 kişidir.' : 'Maximum participant limit for KA122 is 30.'}
              </span>
            )}
          </div>

          {/* Project Duration in Months */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.eligibility.durationLabel}
            </label>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={36}
                className={`edu-input font-bold ${
                  data.projectDurationMonths < 6 || data.projectDurationMonths > 18
                    ? 'border-red-400 bg-red-50/40 text-red-900'
                    : 'text-slate-900'
                }`}
                value={data.projectDurationMonths || ''}
                onChange={(e) => onChange('projectDurationMonths', Math.max(1, parseInt(e.target.value, 10) || 1))}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 pointer-events-none">
                {locale === 'tr' ? 'Ay' : 'Months'}
              </span>
            </div>
            {(data.projectDurationMonths < 6 || data.projectDurationMonths > 18) && (
              <span className="text-[11px] text-red-600 font-medium mt-1 block">
                ❌ {locale === 'tr' ? 'Süre 6–18 ay aralığında olmalıdır.' : 'Duration must be between 6 and 18 months.'}
              </span>
            )}
          </div>

          {/* Past Grants in 5 Call Years */}
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.eligibility.pastGrantsLabel}
            </label>
            <select
              className={`edu-input bg-white cursor-pointer font-medium ${
                data.pastKa122GrantsCount >= 3 ? 'border-amber-400 bg-amber-50/40 text-amber-900' : ''
              }`}
              value={data.pastKa122GrantsCount}
              onChange={(e) => onChange('pastKa122GrantsCount', parseInt(e.target.value, 10) || 0)}
            >
              <option value={0}>
                {locale === 'tr' ? '0 (İlk Kez Başvuruyor / Hiç Hibe Alınmadı)' : '0 (First Time Applicant / No Past Grants)'}
              </option>
              <option value={1}>
                {locale === 'tr' ? '1 Proje (Ardışık 5 çağrı yılında 1 hibe alındı)' : '1 Project (1 grant received in 5 call years)'}
              </option>
              <option value={2}>
                {locale === 'tr' ? '2 Proje (Ardışık 5 çağrı yılında 2 hibe alındı)' : '2 Projects (2 grants received in 5 call years)'}
              </option>
              <option value={3}>
                {locale === 'tr' ? '3 Proje (KA122-VET Hibe Sınırına Ulaşıldı - KA120 Zorunlu)' : '3 Projects (Three Grant Limit Reached - KA120 Required)'}
              </option>
              <option value={4}>
                {locale === 'tr' ? '4+ Proje (Kota Aşımı)' : '4+ Projects (Quota Exceeded)'}
              </option>
            </select>
          </div>

          {/* Mobility Strategy & Vision */}
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.eligibility.strategyLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.mobilityStrategy}
              onChange={(e) => onChange('mobilityStrategy', e.target.value as 'ad_hoc' | 'regular_annual')}
            >
              <option value="ad_hoc">{t.eligibility.strategyAdHoc}</option>
              <option value="regular_annual">{t.eligibility.strategyRegular}</option>
            </select>
          </div>
        </div>

        {/* Dynamic Criteria Evaluation Checklist */}
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-100 px-4 py-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">
              📋 {locale === 'tr' ? 'Kriter Değerlendirme Çıktıları' : 'Eligibility Evaluation Checklist'}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                eligibilityResult.recommendedPathway === 'KA122-VET'
                  ? 'bg-emerald-100 text-emerald-800'
                  : eligibilityResult.recommendedPathway === 'KA120-VET'
                    ? 'bg-purple-100 text-purple-900'
                    : eligibilityResult.recommendedPathway === 'KA121-VET'
                      ? 'bg-blue-100 text-blue-900'
                      : 'bg-red-100 text-red-900'
              }`}
            >
              {eligibilityResult.summaryTitle}
            </span>
          </div>

          <div className="divide-y divide-slate-100 bg-white">
            {eligibilityResult.checks.map((check) => (
              <div key={check.id} className="p-3 sm:px-4 flex items-start gap-3">
                <div className="shrink-0 mt-0.5">
                  {check.status === 'eligible' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                  {check.status === 'warning' && (
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center text-xs">
                      !
                    </span>
                  )}
                  {check.status === 'ineligible' && (
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center text-xs">
                      ✕
                    </span>
                  )}
                  {check.status === 'recommend_ka120' && (
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-xs">
                      ⭐
                    </span>
                  )}
                  {check.status === 'recommend_ka121' && (
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                      🎖️
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">{check.title}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{check.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strategic Pathway Banner */}
        <div
          className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            eligibilityResult.recommendedPathway === 'KA120-VET'
              ? 'bg-purple-50 border-purple-200 text-purple-950'
              : eligibilityResult.recommendedPathway === 'KA122-VET'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : eligibilityResult.recommendedPathway === 'KA121-VET'
                  ? 'bg-blue-50 border-blue-200 text-blue-950'
                  : 'bg-red-50 border-red-200 text-red-950'
          }`}
        >
          <span className="text-2xl shrink-0">
            {eligibilityResult.recommendedPathway === 'KA120-VET'
              ? '⭐'
              : eligibilityResult.recommendedPathway === 'KA122-VET'
                ? '🚀'
                : eligibilityResult.recommendedPathway === 'KA121-VET'
                  ? '🎖️'
                  : '⚠️'}
          </span>
          <div>
            <div className="text-sm font-bold">{eligibilityResult.summaryTitle}</div>
            <div className="text-xs mt-1 leading-relaxed opacity-90">
              {eligibilityResult.summaryMessage}
            </div>
          </div>
        </div>
      </div>
    </NeoCard>
  );
}
