'use client';

import React from 'react';
import { ApplicationDraftContext, FormType } from '../../../lib/application-draft-schema';

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
  const isKa121 = formType === 'KA121';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🏛️</span>
            <span>Bölüm 1: Başvuru ve Kurum Bağlam Bilgileri</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {isKa121
              ? 'KA121 Akredite Kurumlar İçin Hibe Talebi resmi başvuru bağlamı'
              : 'KA122 Kısa Dönemli Mesleki Eğitim Hareketliliği proje bağlamı'}
          </p>
        </div>

        {isPipelineSynced && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
            <span>✓</span> Pipeline verileri aktarıldı
          </span>
        )}
      </div>

      {/* Kurum Resmi Bilgileri */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Kuruluş Resmi Adı (Applicant Name) *
            </label>
            {ka120ImportedFields?.['context.applicantName'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                KA120'den çekildi
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
              Kuruluş Kimlik Kodu (OID) *
            </label>
            {ka120ImportedFields?.['context.applicantOid'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                KA120'den çekildi
              </span>
            )}
          </div>
          <input
            type="text"
            value={data.applicantOid}
            onChange={(e) => onChange({ applicantOid: e.target.value })}
            placeholder="Örn: E10123456"
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Şehir / Konum (City) *
            </label>
            {ka120ImportedFields?.['context.applicantCity'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                KA120'den çekildi
              </span>
            )}
          </div>
          <input
            type="text"
            value={data.applicantCity}
            onChange={(e) => onChange({ applicantCity: e.target.value })}
            placeholder="Örn: Nevşehir"
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
                Erasmus Akreditasyon Kodu (Accreditation Code) *
              </label>
              {ka120ImportedFields?.['context.accreditationCode'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.accreditationCode || ''}
              onChange={(e) => onChange({ accreditationCode: e.target.value })}
              placeholder="Örn: 2021-1-TR01-KA120-VET-000012"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              KA121 başvurusu yalnızca geçerli KA120 akreditasyonu olan kurumlarca yapılabilir.
            </p>
          </div>
        ) : (
          <>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Son 36 Ayda Alınan KA122 Sayısı *
              </label>
              <select
                value={data.pastKa122Count}
                onChange={(e) => onChange({ pastKa122Count: Number(e.target.value) })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value={0}>0 (İlk başvuru veya geçmiş hibe yok)</option>
                <option value={1}>1 (Daha önce 1 hibe alındı)</option>
                <option value={2}>2 (Daha önce 2 hibe alındı - Sınırda)</option>
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Resmi kural: Bir kurum son 36 ayda en fazla 2 KA122 hibesi alabilir.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Proje Süresi (Ay) *
              </label>
              <div className="flex items-center gap-2">
                {[6, 12, 18, 24].map((m) => (
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
                    {m} Ay
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* KA122 Özel: Proje Başlığı ve Tarihleri */}
      {!isKa121 && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>🏷️</span> Proje Başlık ve Zaman Çerçevesi
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Proje Tam Adı (İngilizce / Project name) *
                </label>
                {ka120ImportedFields?.['context.projectTitle'] && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    KA120'den çekildi
                  </span>
                )}
              </div>
              <input
                type="text"
                value={data.projectTitle}
                onChange={(e) => onChange({ projectTitle: e.target.value })}
                placeholder="Örn: Advancing Industry 4.0 and Smart Automation Competences in VET"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <p className="text-[11px] text-slate-500 mt-1">Resmi AB başvuru formunda proje tam adı İngilizce olmalıdır.</p>
            </div>

            <div>
              <div className="flex items-center justify-between gap-1 mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Proje Kısaltması / Akronim (Project acronym) *
                </label>
                {ka120ImportedFields?.['context.projectAcronym'] && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                    KA120'den çekildi
                  </span>
                )}
              </div>
              <input
                type="text"
                value={data.projectAcronym}
                onChange={(e) => onChange({ projectAcronym: e.target.value })}
                placeholder="Örn: IND4-VET"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tahmini Proje Başlangıç Tarihi *
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
