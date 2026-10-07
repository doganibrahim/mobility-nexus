'use client';

import React from 'react';
import {
  ApplicationDraftActivityDetails,
  FormType,
  INCLUSION_CATEGORY_OPTIONS,
  INCLUSION_CATEGORY_OPTIONS_EN,
} from '../../../lib/application-draft-schema';
import { ERASMUS_COUNTRIES } from '../../../lib/countries';
import { useTranslation } from '../../../lib/i18n';

interface ActivityDetailsSectionProps {
  data: ApplicationDraftActivityDetails;
  formType: FormType;
  onChange: (updated: Partial<ApplicationDraftActivityDetails>) => void;
}

export default function ActivityDetailsSection({
  data,
  formType,
  onChange,
}: ActivityDetailsSectionProps) {
  const { locale } = useTranslation();

  const toggleInclusionCategory = (cat: string) => {
    const categories = data.inclusionCategories || [];
    const exists = categories.includes(cat);
    const updated = exists ? categories.filter((c) => c !== cat) : [...categories, cat];
    onChange({ inclusionCategories: updated });
  };

  const isVetShortTerm = data.activityType === 'VET_SHORT_TERM';
  const minDuration = isVetShortTerm ? 10 : 2;
  const maxDuration = isVetShortTerm ? 89 : 365;

  const isGreenTravelActive =
    data.greenTravelParticipantsCount > 0 ||
    ['TRAIN', 'BUS', 'CARPOOL'].includes(data.mainTravelMode);
  const travelDayOptions = isGreenTravelActive ? [0, 1, 2, 3, 4, 5, 6] : [0, 1, 2];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>✈️</span>
            <span>
              {locale === 'tr'
                ? 'Bölüm 4: Hareketlilik Faaliyeti ve Lojistik Detayları'
                : 'Section 4: Mobility Activity and Logistics Details'}
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {locale === 'tr'
              ? 'Katılımcı sayıları, süreler, seyahat planı, refakatçi ve içerme destekleri'
              : 'Participant quotas, durations, travel schedules, accompanying persons, and inclusion support'}
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          {formType} {locale === 'tr' ? 'Ortak' : 'Core'}
        </span>
      </div>

      {/* 1. Faaliyet Türü ve Amacı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {locale === 'tr' ? 'Faaliyet Türü (ACT-01) *' : 'Activity Type (ACT-01) *'}
          </label>
          <select
            value={data.activityType}
            onChange={(e) => onChange({ activityType: e.target.value as any })}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="VET_SHORT_TERM">
              {locale === 'tr'
                ? 'Öğrenicilerin Kısa Dönemli Mesleki Eğitimi ve Stajı (10-89 gün)'
                : 'Short-term learning mobility of VET learners (10-89 days)'}
            </option>
            <option value="VET_LONG_TERM">
              {locale === 'tr'
                ? 'ErasmusPro - Uzun Dönemli Mesleki Eğitim ve Staj (90-365 gün)'
                : 'ErasmusPro - Long-term mobility of VET learners (90-365 days)'}
            </option>
            <option value="JOB_SHADOWING">
              {locale === 'tr'
                ? 'Personel İşbaşı Gözlem ve Mesleki Gelişim (Job Shadowing)'
                : 'Staff Job Shadowing (2-60 days)'}
            </option>
            <option value="TEACHING_ASSIGNMENT">
              {locale === 'tr'
                ? 'Personel Eğitici / Öğretici Görevlendirmesi'
                : 'Teaching or training assignments (2-365 days)'}
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {locale === 'tr'
              ? 'Faaliyet Amacı ve Beklenen Çıktı Özeti (ACT-02) *'
              : 'Activity Objective and Anticipated Outcomes (ACT-02) *'}
          </label>
          <input
            type="text"
            value={data.activityGoalSummary}
            onChange={(e) => onChange({ activityGoalSummary: e.target.value })}
            placeholder={
              locale === 'tr'
                ? "Örn: Otomasyon öğrencilerine Almanya'da akıllı üretim hatlarında 14 günlük staj"
                : 'e.g. 14-day traineeship in smart production lines for VET automation learners'
            }
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* 2. Ev Sahibi ve Ülke */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>📍</span> {locale === 'tr' ? 'Ev Sahibi Kuruluş ve Hedef Ülke (ACT-04 & ACT-05)' : 'Host Organisation and Destination Country (ACT-04 & ACT-05)'}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">
              {locale === 'tr' ? 'Ev sahibi belli mi?' : 'Host confirmed?'}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => onChange({ hostKnown: true })}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                  data.hostKnown
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {locale === 'tr' ? 'Evet' : 'Yes'}
              </button>
              <button
                type="button"
                onClick={() => onChange({ hostKnown: false })}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all ${
                  !data.hostKnown
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {locale === 'tr' ? 'Hayır' : 'No'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {locale === 'tr' ? 'Hedef Ülke *' : 'Destination Country *'}
            </label>
            <select
              value={data.hostCountry || 'DE'}
              onChange={(e) => onChange({ hostCountry: e.target.value })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {ERASMUS_COUNTRIES.filter((c) => c.code !== 'TR').map((c) => (
                <option key={c.code} value={c.code}>
                  {c.flagEmoji} {locale === 'en' ? c.nameEn : c.nameTr} ({c.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {locale === 'tr' ? 'Ev Sahibi Kuruluş Adı' : 'Host Organisation Legal Name'}
            </label>
            <input
              type="text"
              value={data.hostName || ''}
              onChange={(e) => onChange({ hostName: e.target.value })}
              placeholder={
                data.hostKnown
                  ? (locale === 'tr' ? 'Örn: Leipzig VET Training Solutions' : 'e.g. Leipzig VET Training Solutions')
                  : (locale === 'tr' ? 'Henüz belirlenmedi' : 'To be confirmed')
              }
              disabled={!data.hostKnown}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Katılımcı Sayısı, Süre ve Süre Grupları */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>⏱️</span> {locale === 'tr' ? 'Katılımcı Sayısı ve Faaliyet Süresi' : 'Participant Numbers & Activity Duration'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {locale === 'tr' ? 'Toplam Katılımcı Sayısı (ACT-06) *' : 'Total Participants (ACT-06) *'}
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={data.totalParticipants}
              onChange={(e) => {
                const newTotal = Math.max(1, Number(e.target.value));
                onChange({
                  totalParticipants: newTotal,
                  greenTravelParticipantsCount: Math.min(newTotal, data.greenTravelParticipantsCount),
                });
              }}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {locale === 'tr' ? 'Standart Faaliyet Süresi (Gün - ACT-07) *' : 'Standard Duration (Days - ACT-07) *'}
            </label>
            <input
              type="number"
              min={minDuration}
              max={maxDuration}
              value={data.standardDurationDays}
              onChange={(e) =>
                onChange({ standardDurationDays: Math.max(1, Number(e.target.value)) })
              }
              className={`w-full text-xs px-3 py-2 border rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 ${
                isVetShortTerm && (data.standardDurationDays < 10 || data.standardDurationDays > 89)
                  ? 'border-amber-400 focus:ring-amber-500 bg-amber-50/20'
                  : 'border-slate-300 focus:ring-blue-600'
              }`}
            />
            {isVetShortTerm && (data.standardDurationDays < 10 || data.standardDurationDays > 89) ? (
              <p className="text-[11px] text-amber-700 font-semibold mt-1">
                ⚠️ {locale === 'tr'
                  ? 'Kısa Dönemli VET Öğrenici Hareketliliği resmi süresi 10 - 89 gün arasındadır.'
                  : 'Official duration for Short-term VET Learner mobility must be 10 - 89 days.'}
              </p>
            ) : (
              <p className="text-[11px] text-slate-500 mt-1">
                {isVetShortTerm
                  ? (locale === 'tr'
                      ? 'Resmi süre 10 - 89 gündür. Seyahat günleri TRV-01 adımında ayrıca hibe hesabına eklenir.'
                      : 'Official range is 10 - 89 days. Travel days are calculated in TRV-01.')
                  : (locale === 'tr'
                      ? 'Yalnızca fiziksel öğrenme/staj günlerini kapsar. Seyahat günleri (1-2 gün) TRV-01 adımında ayrıca hibe hesabına eklenir.'
                      : 'Covers practical learning/training days only. Travel days (1-2 days) are calculated in TRV-01.')}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {locale === 'tr' ? 'Tüm Katılımcılar Aynı Sürede mi? (ACT-08) *' : 'Uniform Duration for All? (ACT-08) *'}
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onChange({ allSameDuration: true })}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  data.allSameDuration
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {locale === 'tr'
                  ? `Evet (Hepsi ${data.standardDurationDays} gün)`
                  : `Yes (All ${data.standardDurationDays} days)`}
              </button>
              <button
                type="button"
                onClick={() => onChange({ allSameDuration: false })}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  !data.allSameDuration
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {locale === 'tr' ? 'Farklı Gruplar Var' : 'Multiple Groups'}
              </button>
            </div>
          </div>
        </div>

        {!data.allSameDuration && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>{locale === 'tr' ? 'Farklı Süre Grupları (ACT-09):' : 'Multiple Duration Cohorts (ACT-09):'}</strong>{' '}
            {locale === 'tr'
              ? 'Katılımcıların bir kısmı farklı sürelerde staj yapacaksa, nihai hibe tablosunda grup bazlı gün hesaplaması yapılır.'
              : 'If cohorts undertake mobilities for differing day counts, group-specific calculations will apply in the budget allocation summary.'}
          </div>
        )}
      </div>

      {/* 4. Seyahat ve Yeşil Ulaşım (TRV-01 ~ TRV-03) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>🚆</span> {locale === 'tr' ? 'Seyahat Günleri ve Yeşil Seyahat (Green Travel)' : 'Travel Days & Green Travel (TRV-01 ~ TRV-03)'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {locale === 'tr' ? 'Kişi Başı Ek Seyahat Günü (TRV-01) *' : 'Additional Travel Days per Person (TRV-01) *'}
              </label>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                isGreenTravelActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
              }`}>
                {isGreenTravelActive
                  ? (locale === 'tr' ? 'Yeşil (Maks 6)' : 'Green (Max 6)')
                  : (locale === 'tr' ? 'Standart (Maks 2)' : 'Standard (Max 2)')}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-wrap">
              {travelDayOptions.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ travelDaysPerPerson: d })}
                  className={`flex-1 min-w-[28px] py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    data.travelDaysPerPerson === d
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d} {locale === 'tr' ? 'G' : 'd'}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isGreenTravelActive
                ? (locale === 'tr' ? 'Yeşil seyahat için AB kuralları gereği 6 güne kadar seyahat günü seçilebilir.' : 'Up to 6 travel days allowed for green travel under EU guidelines.')
                : (locale === 'tr' ? 'Standart uçak seyahati için AB kuralları gereği en fazla 2 gün verilebilir.' : 'Max 2 travel days allowed for standard air travel under EU guidelines.')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {locale === 'tr' ? 'Yeşil Ulaşım Katılımcı Sayısı (TRV-02) *' : 'Green Travel Participants (TRV-02) *'}
            </label>
            <input
              type="number"
              min={0}
              max={data.totalParticipants}
              value={data.greenTravelParticipantsCount}
              onChange={(e) => {
                const newGreenCount = Math.min(
                  data.totalParticipants,
                  Math.max(0, Number(e.target.value)),
                );
                const isGreen = newGreenCount > 0 || ['TRAIN', 'BUS', 'CARPOOL'].includes(data.mainTravelMode);
                onChange({
                  greenTravelParticipantsCount: newGreenCount,
                  travelDaysPerPerson: (!isGreen && data.travelDaysPerPerson > 2) ? 2 : data.travelDaysPerPerson,
                });
              }}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {locale === 'tr' ? 'Tren veya otobüs kullananlar ek hibe alır' : 'Train or bus travel qualifies for extra grant'}
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {locale === 'tr' ? 'Ana Ulaşım Aracı (TRV-03) *' : 'Main Means of Transport (TRV-03) *'}
            </label>
            <select
              value={data.mainTravelMode}
              onChange={(e) => {
                const newMode = e.target.value as any;
                const isGreen = data.greenTravelParticipantsCount > 0 || ['TRAIN', 'BUS', 'CARPOOL'].includes(newMode);
                onChange({
                  mainTravelMode: newMode,
                  travelDaysPerPerson: (!isGreen && data.travelDaysPerPerson > 2) ? 2 : data.travelDaysPerPerson,
                });
              }}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="FLIGHT">{locale === 'tr' ? 'Uçak (Standart)' : 'Flight (Standard)'}</option>
              <option value="TRAIN">{locale === 'tr' ? 'Tren (Yeşil Seyahat)' : 'Train (Green Travel)'}</option>
              <option value="BUS">{locale === 'tr' ? 'Otobüs (Yeşil Seyahat)' : 'Bus (Green Travel)'}</option>
              <option value="CARPOOL">{locale === 'tr' ? 'Paylaşımlı Araç (Carpool)' : 'Carpooling (Green Travel)'}</option>
              <option value="MIXED">{locale === 'tr' ? 'Karma Ulaşım' : 'Mixed Modes'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Refakatçi Kişiler (ACC-01 ~ ACC-05) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>👨‍🏫</span>{' '}
              {locale === 'tr'
                ? 'Refakat Eden Kişi (Öğretmen / Personel) Gerekiyor mu? *'
                : 'Accompanying Persons (Staff / Trainers) Required? *'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {locale === 'tr'
                ? 'Reşit olmayan öğrenciler veya özel ihtiyaçlı katılımcılar için refakatçi hibe desteği'
                : 'Individual support grant for minors or learners requiring pedagogical assistance'}
            </p>
          </div>

          <div className="flex gap-2 min-w-[140px]">
            <button
              type="button"
              onClick={() => onChange({ accompanyingRequired: true, accompanyingCount: Math.max(1, data.accompanyingCount) })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                data.accompanyingRequired
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {locale === 'tr' ? 'Evet' : 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => onChange({ accompanyingRequired: false, accompanyingCount: 0 })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                !data.accompanyingRequired
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {locale === 'tr' ? 'Hayır' : 'No'}
            </button>
          </div>
        </div>

        {data.accompanyingRequired && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Refakat Eden Kişi Sayısı *' : 'Accompanying Persons Count *'}
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={data.accompanyingCount}
                onChange={(e) => onChange({ accompanyingCount: Math.max(1, Number(e.target.value)) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Kalış Süresi (Gün - ACC-03) *' : 'Accompanying Duration (Days - ACC-03) *'}
              </label>
              <input
                type="number"
                min={1}
                max={365}
                value={data.accompanyingDays}
                onChange={(e) => onChange({ accompanyingDays: Math.max(1, Number(e.target.value)) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Refakatçi Gerekçesi (ACC-04) *' : 'Justification for Accompanying Persons (ACC-04) *'}
              </label>
              <select
                value={data.accompanyingReason}
                onChange={(e) => onChange({ accompanyingReason: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="UNDERAGE">
                  {locale === 'tr' ? 'Öğreniciler Reşit Değil (18 yaş altı)' : 'Learners are Minors (Under 18)'}
                </option>
                <option value="SPECIAL_NEEDS">
                  {locale === 'tr' ? 'Özel İhtiyaç / Engellilik Desteği' : 'Special Needs & Disability Support'}
                </option>
                <option value="SAFETY_LOGISTICS">
                  {locale === 'tr' ? 'İş Güvenliği, Lojistik ve Atölye Takibi' : 'Safety, Logistics & Workshop Supervision'}
                </option>
                <option value="OTHER">
                  {locale === 'tr' ? 'Diğer Kurumsal Gerekçe' : 'Other Institutional Justification'}
                </option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 6. İçerme ve Fırsat Eşitliği Desteği (INC-01 ~ INC-06) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>🌟</span>{' '}
              {locale === 'tr'
                ? 'Daha Az Fırsata Sahip Katılımcı Desteği (INC-01) *'
                : 'Inclusion Support for Participants with Fewer Opportunities (INC-01) *'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {locale === 'tr'
                ? 'Ekonomik, coğrafi veya sosyal engeli olan katılımcılar için ilave bireysel hibe desteği'
                : 'Top-up individual grant allocation for economic, geographical, or physical barriers'}
            </p>
          </div>

          <div className="flex gap-2 min-w-[140px]">
            <button
              type="button"
              onClick={() => onChange({ hasInclusionSupport: true, inclusionCount: Math.max(1, data.inclusionCount || 1) })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                data.hasInclusionSupport
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {locale === 'tr' ? 'Evet' : 'Yes'}
            </button>
            <button
              type="button"
              onClick={() => onChange({ hasInclusionSupport: false, inclusionCount: 0 })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                !data.hasInclusionSupport
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {locale === 'tr' ? 'Hayır' : 'No'}
            </button>
          </div>
        </div>

        {data.hasInclusionSupport && (
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr'
                    ? 'İçerme Desteği Alacak Kişi Sayısı (INC-03) *'
                    : 'Participants Receiving Inclusion Support (INC-03) *'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={data.totalParticipants}
                  value={data.inclusionCount || 1}
                  onChange={(e) =>
                    onChange({
                      inclusionCount: Math.min(
                        data.totalParticipants,
                        Math.max(1, Number(e.target.value)),
                      ),
                    })
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Destek Türü (INC-04) *' : 'Support Mechanism Type (INC-04) *'}
                </label>
                <select
                  value={data.inclusionSupportType || 'UNIT_COST'}
                  onChange={(e) => onChange({ inclusionSupportType: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="UNIT_COST">
                    {locale === 'tr' ? 'Standart Birim Maliyet (Kişi başı sabit ek hibe)' : 'Standard Unit Cost (Fixed top-up grant)'}
                  </option>
                  <option value="REAL_COST">
                    {locale === 'tr' ? 'Gerçek Maliyet Esası (%100 fatura karşılığı)' : 'Real Cost Basis (100% eligible invoices)'}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {locale === 'tr' ? 'İçerme Kategorileri (INC-02) *' : 'Inclusion Categories (INC-02) *'}
              </label>
              <div className="flex flex-wrap gap-2">
                {INCLUSION_CATEGORY_OPTIONS.map((cat) => {
                  const selected = (data.inclusionCategories || []).includes(cat);
                  const label = locale === 'en' ? (INCLUSION_CATEGORY_OPTIONS_EN[cat] || cat) : cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleInclusionCategory(cat)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selected
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 7. İstisnai Maliyetler (EXC-01 ~ EXC-04) & Hazırlık Ziyareti (PRE-01) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* İstisnai Maliyet */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>💳</span> {locale === 'tr' ? 'İstisnai Maliyet Talebi (EXC-01)' : 'Exceptional Costs Request (EXC-01)'}
            </span>
            <button
              type="button"
              onClick={() => onChange({ hasExceptionalCosts: !data.hasExceptionalCosts })}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                data.hasExceptionalCosts
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {data.hasExceptionalCosts ? (locale === 'tr' ? 'Evet' : 'Yes') : (locale === 'tr' ? 'Hayır' : 'No')}
            </button>
          </div>

          {data.hasExceptionalCosts && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <select
                value={data.exceptionalCostType || 'VISA_RESIDENCE'}
                onChange={(e) => onChange({ exceptionalCostType: e.target.value as any })}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
              >
                <option value="VISA_RESIDENCE">
                  {locale === 'tr' ? 'Vize, İkamet İzni ve Tıbbi Belgeler' : 'Visa, Residence Permits & Medical Certificates'}
                </option>
                <option value="FINANCIAL_GUARANTEE">
                  {locale === 'tr' ? 'Finansal Garanti Teminatı' : 'Financial Guarantee Bond'}
                </option>
                <option value="EXPENSIVE_TRAVEL">
                  {locale === 'tr' ? 'Pahalı Seyahat Maliyeti' : 'High-cost Expensive Travel'}
                </option>
              </select>
              <input
                type="number"
                min={0}
                value={data.exceptionalCostAmountEur || 0}
                onChange={(e) => onChange({ exceptionalCostAmountEur: Number(e.target.value) })}
                placeholder={locale === 'tr' ? 'Talep Edilen Tutar (€)' : 'Requested Amount (€)'}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
          )}
        </div>

        {/* Hazırlık Ziyareti */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>✈️</span> {locale === 'tr' ? 'Hazırlık Ziyareti (PRE-01)' : 'Preparatory Visit (PRE-01)'}
            </span>
            <button
              type="button"
              onClick={() => onChange({ hasPreparatoryVisit: !data.hasPreparatoryVisit })}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition-all ${
                data.hasPreparatoryVisit
                  ? 'bg-blue-700 text-white border-blue-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              {data.hasPreparatoryVisit ? (locale === 'tr' ? 'Evet' : 'Yes') : (locale === 'tr' ? 'Hayır' : 'No')}
            </button>
          </div>

          {data.hasPreparatoryVisit && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={1}
                  max={3}
                  value={data.preparatoryVisitPersons || 1}
                  onChange={(e) => onChange({ preparatoryVisitPersons: Number(e.target.value) })}
                  placeholder={locale === 'tr' ? 'Kişi Sayısı (Max 3)' : 'Persons (Max 3)'}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={data.preparatoryVisitDays || 3}
                  onChange={(e) => onChange({ preparatoryVisitDays: Number(e.target.value) })}
                  placeholder={locale === 'tr' ? 'Gün Sayısı' : 'Duration (Days)'}
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
              <input
                type="text"
                value={data.preparatoryVisitJustification || ''}
                onChange={(e) => onChange({ preparatoryVisitJustification: e.target.value })}
                placeholder={
                  locale === 'tr'
                    ? 'Gerekçe (Örn: Ağır özel gereksinimli öğrenci atölye kontrolü)'
                    : 'Justification (e.g. Assessment of special needs accessibility at host facilities)'
                }
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
