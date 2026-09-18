'use client';

import React, { useMemo } from 'react';
import NeoCard from '../ui/NeoCard';
import { ParticipantType, MobilityGoal } from '@mobility-nexus/types';
import { useTranslation } from '../../lib/i18n';
import { validateActivityDuration } from '../../lib/calculations';

interface ParticipantProfileCardProps {
  data: {
    participantType: ParticipantType;
    mobilityGoal: MobilityGoal;
    participantName: string;
    language: number;
    targetCountries: string[];
    startDate: string;
    endDate: string;
    participantCount: number;
    accompanyingPersonsCount: number;
    ageGroup: 'under_18' | '18_plus' | 'mixed';
  };
  onChange: (field: string, value: any) => void;
}

export default function ParticipantProfileCard({
  data,
  onChange,
}: ParticipantProfileCardProps) {
  const { t, locale } = useTranslation();

  const durationDays = useMemo(() => {
    if (!data.startDate || !data.endDate) return 0;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return -1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  }, [data.startDate, data.endDate]);

  const durationValidation = useMemo(() => {
    return validateActivityDuration(data.mobilityGoal, durationDays, locale);
  }, [data.mobilityGoal, durationDays, locale]);

  const handleCountryToggle = (code: string) => {
    let newCountries = [...(data.targetCountries || [])];
    if (code === 'ANY') {
      newCountries = ['ANY'];
    } else {
      newCountries = newCountries.filter(c => c !== 'ANY');
      if (newCountries.includes(code)) {
        newCountries = newCountries.filter(c => c !== code);
      } else {
        newCountries.push(code);
      }
    }
    onChange('targetCountries', newCountries);
  };

  const EU_COUNTRIES = [
    { code: 'ANY', label: locale === 'en' ? 'Any / All Eligible Countries' : 'Fark Etmez / Tüm Uygun Ülkeler' },
    { code: 'DE', label: locale === 'en' ? 'Germany' : 'Almanya' },
    { code: 'IT', label: locale === 'en' ? 'Italy' : 'İtalya' },
    { code: 'ES', label: locale === 'en' ? 'Spain' : 'İspanya' },
    { code: 'FR', label: locale === 'en' ? 'France' : 'Fransa' },
    { code: 'NL', label: locale === 'en' ? 'Netherlands' : 'Hollanda' },
    { code: 'SE', label: locale === 'en' ? 'Sweden' : 'İsveç' },
    { code: 'PT', label: locale === 'en' ? 'Portugal' : 'Portekiz' },
    { code: 'AT', label: locale === 'en' ? 'Austria' : 'Avusturya' },
  ];

  return (
    <NeoCard
      id="participant"
      title={t.participant.title}
      badge={locale === 'en' ? 'Target Group' : 'Hedef Kitle'}
      badgeType="good"
    >
      <div className="space-y-4">
        {/* Row 1: Participant Type & Mobility Goal */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.typeLabel}
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.participantType}
              onChange={(e) => onChange('participantType', e.target.value as ParticipantType)}
            >
              <option value="student">
                {locale === 'en' ? 'VET Learner / Apprentice' : 'Mesleki Eğitim Öğrenicisi / Çırak'}
              </option>
              <option value="teacher">
                {locale === 'en' ? 'Staff Participant – Teacher or Trainer' : 'Öğretmen / Eğitici / Personel Katılımcı'}
              </option>
              <option value="staff">
                {locale === 'en' ? 'Trainer and Other VET Staff' : 'Eğitici ve Diğer Mesleki Eğitim Personeli'}
              </option>
              <option value="incoming">
                {locale === 'en' ? 'Invited Expert' : 'Davetli Uzman'}
              </option>
              <option value="project_team">
                {locale === 'en' ? 'Preparatory Visit Participant' : 'Hazırlık Ziyareti Katılımcısı'}
              </option>
            </select>
          </div>
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.goalLabel} ({locale === 'en' ? 'Supported Erasmus+ Activity Types' : 'Desteklenen Erasmus+ Faaliyet Türleri'})
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.mobilityGoal}
              onChange={(e) => onChange('mobilityGoal', e.target.value as MobilityGoal)}
            >
              <optgroup label={locale === 'en' ? '1. Mobility of VET Learners' : '1. Mesleki Eğitim Öğrenici Hareketliliği'}>
                <option value="VET_SKILLS_COMPETITION">
                  {locale === 'en' ? 'Participation in VET Skills Competitions (1–10 days)' : 'Mesleki Beceri Yarışmasına Katılım (1–10 gün)'}
                </option>
                <option value="VET_GROUP_MOBILITY">
                  {locale === 'en' ? 'Group Mobility of VET Learners (2–30 days)' : 'Mesleki Eğitim Öğrenicilerinin Grup Hareketliliği (2–30 gün)'}
                </option>
                <option value="VET_SHORT_TERM">
                  {locale === 'en' ? 'Short-term Learning Mobility of VET Learners (10–89 days)' : 'Mesleki Eğitim Öğrenicilerinin Kısa Dönemli Öğrenme Hareketliliği (10–89 gün)'}
                </option>
                <option value="VET_LONG_TERM_PRO">
                  {locale === 'en' ? 'Long-term Learning Mobility of VET Learners – ErasmusPro (90–365 days)' : 'Mesleki Eğitim Öğrenicilerinin Uzun Dönemli Öğrenme Hareketliliği – ErasmusPro (90–365 gün)'}
                </option>
              </optgroup>
              <optgroup label={locale === 'en' ? '2. Staff Mobility' : '2. Personel Hareketliliği'}>
                <option value="JOB_SHADOWING">
                  {locale === 'en' ? 'Job Shadowing (2–60 days)' : 'İşbaşı Gözlem (2–60 gün)'}
                </option>
                <option value="TEACHING_ASSIGNMENT">
                  {locale === 'en' ? 'Teaching or Training Assignments (2–365 days)' : 'Öğretme veya Eğitim Verme Görevi (2–365 gün)'}
                </option>
                <option value="STAFF_COURSE_TRAINING">
                  {locale === 'en' ? 'Courses and Training (2–10 days)' : 'Kurslar ve Eğitimler (2–10 gün)'}
                </option>
              </optgroup>
              <optgroup label={locale === 'en' ? '3. Hosted Participants' : '3. Kuruma Gelen Katılımcılar'}>
                <option value="INVITED_EXPERT">
                  {locale === 'en' ? 'Invited Expert (2–60 days)' : 'Davetli Uzman (2–60 gün)'}
                </option>
                <option value="HOSTING_TEACHERS">
                  {locale === 'en' ? 'Hosting Teachers and Educators in Training (10–365 days)' : 'Eğitimdeki Öğretmen ve Eğiticilere Ev Sahipliği Yapılması (10–365 gün)'}
                </option>
              </optgroup>
              <optgroup label={locale === 'en' ? '4. Project Team' : '4. Proje Ekibi'}>
                <option value="PREPARATORY_VISIT">
                  {locale === 'en' ? 'Preparatory Visit (Max 3 persons)' : 'Hazırlık Ziyareti (Maks. 3 kişi)'}
                </option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Row 2: Target Countries (Multi-select UI) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {locale === 'en' ? 'Preferred Hosting Countries' : 'Hedef Ülkeler'}
          </label>
          <div className="flex flex-wrap gap-2">
            {EU_COUNTRIES.map(country => {
              const isSelected = (data.targetCountries || []).includes(country.code);
              return (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountryToggle(country.code)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-colors ${
                    isSelected
                      ? 'bg-blue-50 border-blue-600 text-blue-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                  }`}
                >
                  {country.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Dates & Duration Verification */}
        <div className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            <div className="md:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {locale === 'en' ? 'Planned Start Date' : 'Planlanan Başlangıç Tarihi'}
              </label>
              <input
                type="date"
                className="edu-input"
                value={data.startDate || ''}
                onChange={(e) => onChange('startDate', e.target.value)}
              />
            </div>
            <div className="md:col-span-6">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {locale === 'en' ? 'Planned End Date' : 'Planlanan Bitiş Tarihi'}
              </label>
              <input
                type="date"
                className="edu-input"
                value={data.endDate || ''}
                onChange={(e) => onChange('endDate', e.target.value)}
              />
            </div>
          </div>

          {/* Real-time Erasmus+ Duration Check Badge */}
          {durationDays > 0 && (
            <div
              className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-3 ${
                durationValidation.isValid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-300 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>{durationValidation.isValid ? '✓' : '⚠️'}</span>
                <div>
                  <strong>
                    {durationValidation.isValid
                      ? (locale === 'en' ? `Calculated Duration: ${durationDays} Days (Compliant)` : `Hesaplanan Süre: ${durationDays} Gün (Kurallara Uygun)`)
                      : durationValidation.warning}
                  </strong>
                  <span className="block text-[11px] opacity-80 mt-0.5">
                    {locale === 'en' ? `Official Erasmus+ Rule: ${durationValidation.rule}` : `Resmi Erasmus+ Kuralı: ${durationValidation.rule}`}
                  </span>
                </div>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold shrink-0 ${
                  durationValidation.isValid
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-200 text-amber-900'
                }`}
              >
                {durationValidation.minDays}–{durationValidation.maxDays} {locale === 'en' ? 'Days' : 'Gün'}
              </span>
            </div>
          )}

          {durationDays === -1 && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              {locale === 'en' ? '❌ End date cannot be before start date.' : '❌ Bitiş tarihi başlangıç tarihinden önce olamaz.'}
            </div>
          )}
        </div>

        {/* Row 4: Participant Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {locale === 'en' ? 'Number of Participants' : 'Katılımcı Sayısı'}
            </label>
            <input
              type="number"
              min="1"
              className="edu-input"
              value={data.participantCount || 1}
              onChange={(e) => onChange('participantCount', parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {locale === 'en' ? 'Accompanying Persons' : 'Refakat Eden Kişi Sayısı'}
            </label>
            <input
              type="number"
              min="0"
              className="edu-input"
              value={data.accompanyingPersonsCount || 0}
              onChange={(e) => onChange('accompanyingPersonsCount', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {locale === 'en' ? 'Age Group' : 'Yaş Grubu'}
            </label>
            <select
              className="edu-input bg-white cursor-pointer"
              value={data.ageGroup || 'mixed'}
              onChange={(e) => onChange('ageGroup', e.target.value)}
            >
              <option value="under_18">{locale === 'en' ? 'Participants Under 18 Years of Age' : '18 Yaş Altı Reşit Olmayan Katılımcı'}</option>
              <option value="18_plus">{locale === 'en' ? '18+ (Adult)' : '18+ (Reşit)'}</option>
              <option value="mixed">{locale === 'en' ? 'Mixed' : 'Karma'}</option>
            </select>
          </div>
        </div>

        {/* Row 5: Participant Name & Language Readiness */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-6">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.nameLabel}
            </label>
            <input
              type="text"
              className="edu-input"
              placeholder={t.participant.namePlaceholder}
              value={data.participantName}
              onChange={(e) => onChange('participantName', e.target.value)}
            />
          </div>
          <div className="md:col-span-6">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                {t.participant.langLabel}
              </label>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                {data.language || 0}/100
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              className="w-full accent-blue-700 cursor-pointer h-2 bg-slate-200 rounded-lg"
              value={data.language || 0}
              onChange={(e) => onChange('language', parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      </div>
    </NeoCard>
  );
}
