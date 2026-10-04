'use client';

import React from 'react';
import { ApplicationDraftContext, FormType } from '../../../lib/application-draft-schema';
import { useTranslation } from '../../../lib/i18n';

interface ContextSectionProps {
  data: ApplicationDraftContext;
  formType: FormType;
  onChange: (updated: Partial<ApplicationDraftContext>) => void;
  isPipelineSynced?: boolean;
  ka120ImportedFields?: Record<string, boolean>;
}

export default function ContextSection({
  data,
  formType,
  onChange,
  isPipelineSynced,
  ka120ImportedFields,
}: ContextSectionProps) {
  const { locale } = useTranslation();
  const isKa121 = formType === 'KA121';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🏛️</span>
            <span>
              {locale === 'tr'
                ? 'Bölüm 1: Başvuru ve Kurum Bağlam Bilgileri'
                : 'Section 1: Application and Institutional Context'}
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {isKa121
              ? (locale === 'tr'
                  ? 'KA121 Akredite Kurumlar İçin Hibe Talebi resmi başvuru bağlamı'
                  : 'Official context for KA121 Accredited Grant Allocation')
              : (locale === 'tr'
                  ? 'KA122 Kısa Dönemli Mesleki Eğitim Hareketliliği proje bağlamı'
                  : 'Project context for KA122 Short-term VET Mobility')}
          </p>
        </div>

        {isPipelineSynced && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            <span>✓</span> {locale === 'tr' ? 'Pipeline verileri aktarıldı' : 'Pipeline data synced'}
          </span>
        )}
      </div>

      {/* Kurum Resmi Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="block text-xs font-bold text-slate-700">
              {locale === 'tr' ? 'Kuruluşun Resmî Adı' : 'Applicant Legal Name'} *
            </label>
            {ka120ImportedFields?.['context.applicantName'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
              </span>
            )}
          </div>
          <input
            type="text"
            value={data.applicantName}
            onChange={(e) => onChange({ applicantName: e.target.value })}
            placeholder="Örn: Kapadokya Mesleki ve Teknik Anadolu Lisesi"
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="block text-xs font-bold text-slate-700">
              {locale === 'tr' ? 'Kuruluş Kimlik Kodu (OID)' : 'Organisation ID (OID)'} *
            </label>
            {ka120ImportedFields?.['context.applicantOid'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
              </span>
            )}
          </div>
          <input
            type="text"
            value={data.applicantOid}
            onChange={(e) => onChange({ applicantOid: e.target.value })}
            placeholder={locale === 'tr' ? 'Örn: E10123456' : 'e.g. E10123456'}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="block text-xs font-bold text-slate-700">
              {locale === 'tr' ? 'Şehir / Konum' : 'City / Location'} *
            </label>
            {ka120ImportedFields?.['context.applicantCity'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
              </span>
            )}
          </div>
          <input
            type="text"
            value={data.applicantCity}
            onChange={(e) => onChange({ applicantCity: e.target.value })}
            placeholder={locale === 'tr' ? 'Örn: Nevşehir' : 'e.g. Nevşehir'}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* Akreditasyon / Proje Süre ve Geçmiş Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isKa121 ? (
          <div className="md:col-span-2">
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-bold text-slate-700">
                {locale === 'tr' ? 'Erasmus Akreditasyon Kodu' : 'Erasmus Accreditation Code'} *
              </label>
              {ka120ImportedFields?.['context.accreditationCode'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.accreditationCode || ''}
              onChange={(e) => onChange({ accreditationCode: e.target.value })}
              placeholder={locale === 'tr' ? 'Örn: 2021-1-TR01-KA120-VET-000012' : 'e.g. 2021-1-TR01-KA120-VET-000012'}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              {locale === 'tr'
                ? 'KA121 başvurusu yalnızca geçerli KA120 akreditasyonu olan kurumlarca yapılabilir.'
                : 'KA121 applications can only be submitted by organisations holding a valid KA120 accreditation.'}
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? '5 Ardışık Çağrı Yılında Alınan KA122 Sayısı' : 'Number of KA122 Grants Received in Past 5 Call Years'} *
              </label>
              <select
                value={data.pastKa122Count}
                onChange={(e) => onChange({ pastKa122Count: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={0}>
                  {locale === 'tr' ? '0 (İlk başvuru veya geçmiş hibe yok)' : '0 (First application or no past grants)'}
                </option>
                <option value={1}>
                  {locale === 'tr' ? '1 (Daha önce 1 hibe alındı)' : '1 (Previously received 1 grant)'}
                </option>
                <option value={2}>
                  {locale === 'tr' ? '2 (Daha önce 2 hibe alındı)' : '2 (Previously received 2 grants)'}
                </option>
                <option value={3}>
                  {locale === 'tr' ? '3 (Daha önce 3 hibe alındı - Kotayı Doldurdu)' : '3 (Previously received 3 grants - Quota Reached)'}
                </option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                {locale === 'tr'
                  ? 'Resmi kural: Bir kurum 5 ardışık çağrı yılı içinde aynı alanda (VET) en fazla 3 KA122 hibesi alabilir.'
                  : 'Official rule: An organisation can receive a maximum of 3 KA122 grants in the same field within 5 consecutive call years.'}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Proje Süresi (Ay)' : 'Project Duration (Months)'} *
              </label>
              <div className="flex items-center gap-2">
                {[6, 12, 18].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => onChange({ projectDurationMonths: m })}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                      data.projectDurationMonths === m
                        ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {m} {locale === 'tr' ? 'Ay' : 'Months'}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {locale === 'tr'
                  ? 'Erasmus+ Program Rehberi gereği KA122-VET projeleri 6 ila 18 ay arasında seçilmelidir.'
                  : 'Under Erasmus+ Programme guidelines, KA122-VET projects must be 6 to 18 months.'}
              </p>
            </div>
          </>
        )}
      </div>

      {/* KA122 Özel: Proje Başlığı ve Tarihleri */}
      {!isKa121 && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>🏷️</span> {locale === 'tr' ? 'PROJE BAŞLIK VE ZAMAN ÇERÇEVESİ' : 'PROJECT TITLE AND TIMEFRAME'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {locale === 'tr' ? 'Projenin Tam Adı (İngilizce)' : 'Full Project Name'} *
                </label>
                {ka120ImportedFields?.['context.projectTitle'] && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={data.projectTitle}
                onChange={(e) => onChange({ projectTitle: e.target.value })}
                placeholder={locale === 'tr' ? 'Örn: Advancing Industry 4.0 and Smart Automation Competences in VET' : 'e.g. Advancing Industry 4.0 and Smart Automation Competences in VET'}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {locale === 'tr' ? 'Resmi AB başvuru formunda proje tam adı İngilizce olmalıdır.' : 'Full project title must be in English for official EU applications.'}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {locale === 'tr' ? 'Proje Kısaltması / Akronim' : 'Project Acronym'} *
                </label>
                {ka120ImportedFields?.['context.projectAcronym'] && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                  </span>
                )}
              </div>
              <input
                type="text"
                value={data.projectAcronym}
                onChange={(e) => onChange({ projectAcronym: e.target.value })}
                placeholder={locale === 'tr' ? 'Örn: IND4-VET' : 'e.g. IND4-VET'}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Tahmini Proje Başlangıç Tarihi' : 'Estimated Project Start Date'} *
              </label>
              <input
                type="date"
                value={data.projectStartDate}
                onChange={(e) => onChange({ projectStartDate: e.target.value })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
