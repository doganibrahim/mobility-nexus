'use client';

import React from 'react';
import {
  ApplicationDraftActivityDetails,
  FormType,
  INCLUSION_CATEGORY_OPTIONS,
} from '../../../lib/application-draft-schema';

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
  const toggleInclusionCategory = (cat: string) => {
    const categories = data.inclusionCategories || [];
    const exists = categories.includes(cat);
    const updated = exists ? categories.filter((c) => c !== cat) : [...categories, cat];
    onChange({ inclusionCategories: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>✈️</span>
            <span>Bölüm 4: Hareketlilik Faaliyeti ve Lojistik Detayları</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Katılımcı sayıları, süreler, seyahat planı, refakatçi ve içerme destekleri
          </p>
        </div>
        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
          {formType} Ortak
        </span>
      </div>

      {/* 1. Faaliyet Türü ve Amacı */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Faaliyet Türü (ACT-01) *
          </label>
          <select
            value={data.activityType}
            onChange={(e) => onChange({ activityType: e.target.value as any })}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="VET_SHORT_TERM">
              Öğrenicilerin Kısa Dönemli Mesleki Eğitimi ve Stajı (10-89 gün)
            </option>
            <option value="VET_LONG_TERM">
              ErasmusPro - Uzun Dönemli Mesleki Eğitim ve Staj (90-365 gün)
            </option>
            <option value="JOB_SHADOWING">
              Personel İşbaşı Gözlem ve Mesleki Gelişim (Job Shadowing)
            </option>
            <option value="TEACHING_ASSIGNMENT">
              Personel Eğitici / Öğretici Görevlendirmesi
            </option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Faaliyet Amacı ve Beklenen Çıktı Özeti (ACT-02) *
          </label>
          <input
            type="text"
            value={data.activityGoalSummary}
            onChange={(e) => onChange({ activityGoalSummary: e.target.value })}
            placeholder="Örn: Otomasyon öğrencilerine Almanya'da akıllı üretim hatlarında 14 günlük staj"
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* 2. Ev Sahibi ve Ülke */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>📍</span> Ev Sahibi Kuruluş ve Hedef Ülke (ACT-04 & ACT-05)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600">Ev sahibi belli mi?</span>
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
                Evet
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
                Hayır
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hedef Ülke *
            </label>
            <input
              type="text"
              value={data.hostCountry || 'DE'}
              onChange={(e) => onChange({ hostCountry: e.target.value })}
              placeholder="Örn: Almanya (DE)"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Ev Sahibi Kuruluş Adı
            </label>
            <input
              type="text"
              value={data.hostName || ''}
              onChange={(e) => onChange({ hostName: e.target.value })}
              placeholder={data.hostKnown ? 'Örn: Leipzig VET Training Solutions' : 'Henüz belirlenmedi'}
              disabled={!data.hostKnown}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-100 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* 3. Katılımcı Sayısı, Süre ve Süre Grupları */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>⏱️</span> Katılımcı Sayısı ve Faaliyet Süresi
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Toplam Katılımcı Sayısı (ACT-06) *
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={data.totalParticipants}
              onChange={(e) => onChange({ totalParticipants: Math.max(1, Number(e.target.value)) })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Standart Faaliyet Süresi (Gün - ACT-07) *
            </label>
            <input
              type="number"
              min={10}
              max={365}
              value={data.standardDurationDays}
              onChange={(e) =>
                onChange({ standardDurationDays: Math.max(1, Number(e.target.value)) })
              }
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tüm Katılımcılar Aynı Sürede mi? (ACT-08) *
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
                Evet (Hepsi {data.standardDurationDays} gün)
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
                Farklı Gruplar Var
              </button>
            </div>
          </div>
        </div>

        {!data.allSameDuration && (
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
            <strong>Farklı Süre Grupları (ACT-09):</strong> Katılımcıların bir kısmı farklı
            sürelerde staj yapacaksa, nihai hibe tablosunda grup bazlı gün hesaplaması yapılır.
          </div>
        )}
      </div>

      {/* 4. Seyahat ve Yeşil Ulaşım (TRV-01 ~ TRV-03) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>🚆</span> Seyahat Günleri ve Yeşil Seyahat (Green Travel)
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kişi Başı Ek Seyahat Günü (TRV-01) *
            </label>
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => onChange({ travelDaysPerPerson: d })}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                    data.travelDaysPerPerson === d
                      ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {d} Gün
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Standart seyahat için genelde 2 gün</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Yeşil Ulaşım Katılımcı Sayısı (TRV-02) *
            </label>
            <input
              type="number"
              min={0}
              max={data.totalParticipants}
              value={data.greenTravelParticipantsCount}
              onChange={(e) =>
                onChange({
                  greenTravelParticipantsCount: Math.min(
                    data.totalParticipants,
                    Math.max(0, Number(e.target.value)),
                  ),
                })
              }
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <p className="text-[11px] text-slate-500 mt-1">Tren veya otobüs kullananlar ek hibe alır</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Ana Ulaşım Aracı (TRV-03) *
            </label>
            <select
              value={data.mainTravelMode}
              onChange={(e) => onChange({ mainTravelMode: e.target.value as any })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="FLIGHT">Uçak (Standart)</option>
              <option value="TRAIN">Tren (Yeşil Seyahat)</option>
              <option value="BUS">Otobüs (Yeşil Seyahat)</option>
              <option value="CARPOOL">Paylaşımlı Araç (Carpool)</option>
              <option value="MIXED">Karma Ulaşım</option>
            </select>
          </div>
        </div>
      </div>

      {/* 5. Refakatçi Kişiler (ACC-01 ~ ACC-05) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>👨‍🏫</span> Refakat Eden Kişi (Öğretmen / Personel) Gerekiyor mu? *
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Reşit olmayan öğrenciler veya özel ihtiyaçlı katılımcılar için refakatçi hibe desteği
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
              Evet
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
              Hayır
            </button>
          </div>
        </div>

        {data.accompanyingRequired && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Refakat Eden Kişi Sayısı *
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
                Kalış Süresi (Gün - ACC-03) *
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
                Refakatçi Gerekçesi (ACC-04) *
              </label>
              <select
                value={data.accompanyingReason}
                onChange={(e) => onChange({ accompanyingReason: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="UNDERAGE">Öğreniciler Reşit Değil (18 yaş altı)</option>
                <option value="SPECIAL_NEEDS">Özel İhtiyaç / Engellilik Desteği</option>
                <option value="SAFETY_LOGISTICS">İş Güvenliği, Lojistik ve Atölye Takibi</option>
                <option value="OTHER">Diğer Kurumsal Gerekçe</option>
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
              <span>🌟</span> Daha Az Fırsata Sahip Katılımcı Desteği (INC-01) *
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Ekonomik, coğrafi veya sosyal engeli olan katılımcılar için ilave bireysel hibe desteği
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
              Evet
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
              Hayır
            </button>
          </div>
        </div>

        {data.hasInclusionSupport && (
          <div className="space-y-4 pt-3 border-t border-slate-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  İçerme Desteği Alacak Kişi Sayısı (INC-03) *
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
                  Destek Türü (INC-04) *
                </label>
                <select
                  value={data.inclusionSupportType || 'UNIT_COST'}
                  onChange={(e) => onChange({ inclusionSupportType: e.target.value as any })}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="UNIT_COST">Standart Birim Maliyet (Kişi başı sabit ek hibe)</option>
                  <option value="REAL_COST">Gerçek Maliyet Esası (%100 fatura karşılığı)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                İçerme Kategorileri (INC-02) *
              </label>
              <div className="flex flex-wrap gap-2">
                {INCLUSION_CATEGORY_OPTIONS.map((cat) => {
                  const selected = (data.inclusionCategories || []).includes(cat);
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
                      {cat}
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
              <span>💳</span> İstisnai Maliyet Talebi (EXC-01)
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
              {data.hasExceptionalCosts ? 'Evet' : 'Hayır'}
            </button>
          </div>

          {data.hasExceptionalCosts && (
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <select
                value={data.exceptionalCostType || 'VISA_RESIDENCE'}
                onChange={(e) => onChange({ exceptionalCostType: e.target.value as any })}
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
              >
                <option value="VISA_RESIDENCE">Vize, İkamet İzni ve Tıbbi Belgeler</option>
                <option value="FINANCIAL_GUARANTEE">Finansal Garanti Teminatı</option>
                <option value="EXPENSIVE_TRAVEL">Pahalı Seyahat Maliyeti</option>
              </select>
              <input
                type="number"
                min={0}
                value={data.exceptionalCostAmountEur || 0}
                onChange={(e) => onChange({ exceptionalCostAmountEur: Number(e.target.value) })}
                placeholder="Talep Edilen Tutar (€)"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
          )}
        </div>

        {/* Hazırlık Ziyareti */}
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <span>✈️</span> Hazırlık Ziyareti (PRE-01)
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
              {data.hasPreparatoryVisit ? 'Evet' : 'Hayır'}
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
                  placeholder="Kişi Sayısı (Max 3)"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={data.preparatoryVisitDays || 3}
                  onChange={(e) => onChange({ preparatoryVisitDays: Number(e.target.value) })}
                  placeholder="Gün Sayısı"
                  className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
                />
              </div>
              <input
                type="text"
                value={data.preparatoryVisitJustification || ''}
                onChange={(e) => onChange({ preparatoryVisitJustification: e.target.value })}
                placeholder="Gerekçe (Örn: Ağır özel gereksinimli öğrenci atölye kontrolü)"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-900"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
