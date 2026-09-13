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
  const { t } = useTranslation();

  const durationDays = useMemo(() => {
    if (!data.startDate || !data.endDate) return 0;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return -1;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
  }, [data.startDate, data.endDate]);

  const durationValidation = useMemo(() => {
    return validateActivityDuration(data.mobilityGoal, durationDays);
  }, [data.mobilityGoal, durationDays]);

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
    { code: 'ANY', label: 'Farketmez / Tüm Ülkeler' },
    { code: 'DE', label: 'Almanya' },
    { code: 'IT', label: 'İtalya' },
    { code: 'ES', label: 'İspanya' },
    { code: 'FR', label: 'Fransa' },
    { code: 'NL', label: 'Hollanda' },
    { code: 'SE', label: 'İsveç' },
    { code: 'PT', label: 'Portekiz' },
    { code: 'AT', label: 'Avusturya' },
  ];

  return (
    <NeoCard
      id="participant"
      title={t.participant.title}
      badge="Hedef Kitle"
      badgeType="primary"
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
              <option value="student">{t.participant.student} (VET Öğrenicisi)</option>
              <option value="teacher">{t.participant.teacher} (Teknik Öğretmen)</option>
              <option value="staff">Eğitici & Mesleki Personel</option>
              <option value="incoming">Kuruma Gelen (Davetli Uzman / Eğitici)</option>
              <option value="project_team">Proje Ekibi (Hazırlık Ziyareti)</option>
            </select>
          </div>
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {t.participant.goalLabel} (10 Resmi Erasmus+ Faaliyeti)
            </label>
            <select
              className="edu-input bg-white cursor-pointer font-medium"
              value={data.mobilityGoal}
              onChange={(e) => onChange('mobilityGoal', e.target.value as MobilityGoal)}
            >
              <optgroup label="1. VET Öğrenici Hareketliliği">
                <option value="VET_SKILLS_COMPETITION">Mesleki Beceri Yarışmasına Katılım (1–10 gün)</option>
                <option value="VET_GROUP_MOBILITY">Öğrenici Grup Hareketliliği (2–30 gün)</option>
                <option value="VET_SHORT_TERM">Kısa Dönemli Bireysel Öğrenme / Staj (10–89 gün)</option>
                <option value="VET_LONG_TERM_PRO">ErasmusPro Uzun Dönemli Staj (90–365 gün)</option>
              </optgroup>
              <optgroup label="2. Personel Hareketliliği">
                <option value="JOB_SHADOWING">İşbaşı Gözlem / Job Shadowing (2–60 gün)</option>
                <option value="TEACHING_ASSIGNMENT">Öğretme veya Eğitim Görevlendirmesi (2–365 gün)</option>
                <option value="STAFF_COURSE_TRAINING">Kurs ve Eğitim (2–10 gün)</option>
              </optgroup>
              <optgroup label="3. Kuruma Gelen Katılımcılar">
                <option value="INVITED_EXPERT">Davetli Uzman / Invited Expert (2–60 gün)</option>
                <option value="HOSTING_TEACHERS">Öğretmen/Eğitimci Adayına Ev Sahipliği (10–365 gün)</option>
              </optgroup>
              <optgroup label="4. Proje Ekibi">
                <option value="PREPARATORY_VISIT">Hazırlık Ziyareti (Maks. 3 kişi)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Row 2: Target Countries (Multi-select UI) */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Hedef Ülkeler
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
                Planlanan Başlangıç Tarihi
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
                Planlanan Bitiş Tarihi
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
                      ? `Hesaplanan Süre: ${durationDays} Gün (Kurallara Uygun)`
                      : durationValidation.warning}
                  </strong>
                  <span className="block text-[11px] opacity-80 mt-0.5">
                    Resmi Erasmus+ Kuralı: {durationValidation.rule}
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
                {durationValidation.minDays}–{durationValidation.maxDays} Gün
              </span>
            </div>
          )}

          {durationDays === -1 && (
            <div className="p-2 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
              ❌ Bitiş tarihi başlangıç tarihinden önce olamaz.
            </div>
          )}
        </div>

        {/* Row 4: Participant Demographics */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Katılımcı Sayısı
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
              Refakatçi Sayısı
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
              Yaş Grubu
            </label>
            <select
              className="edu-input bg-white cursor-pointer"
              value={data.ageGroup || 'mixed'}
              onChange={(e) => onChange('ageGroup', e.target.value)}
            >
              <option value="under_18">18 Yaş Altı (Reşit Değil)</option>
              <option value="18_plus">18+ (Reşit)</option>
              <option value="mixed">Karma</option>
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
