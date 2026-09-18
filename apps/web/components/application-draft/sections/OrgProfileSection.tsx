'use client';

import React from 'react';
import {
  ApplicationDraftOrgProfile,
  VET_PROGRAM_OPTIONS,
  SUPPORTING_ORG_TASK_OPTIONS,
} from '../../../lib/application-draft-schema';

interface OrgProfileSectionProps {
  data: ApplicationDraftOrgProfile;
  onChange: (updated: Partial<ApplicationDraftOrgProfile>) => void;
  ka120ImportedFields?: Record<string, boolean>;
}

export default function OrgProfileSection({
  data,
  onChange,
  ka120ImportedFields,
}: OrgProfileSectionProps) {
  const toggleProgram = (prog: string) => {
    const exists = data.vetProgramTypes.includes(prog);
    const updated = exists
      ? data.vetProgramTypes.filter((p) => p !== prog)
      : [...data.vetProgramTypes, prog];
    onChange({ vetProgramTypes: updated });
  };

  const toggleTask = (task: string) => {
    const tasks = data.supportingOrgTasks || [];
    const exists = tasks.includes(task);
    const updated = exists ? tasks.filter((t) => t !== task) : [...tasks, task];
    onChange({ supportingOrgTasks: updated });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🏢</span>
            <span>Bölüm 2: Kuruluş Profili ve Kapasitesi (KA122)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Kurumunuzun mesleki eğitimdeki yasal statüsü, öğrenici yapısı ve personel büyüklüğü
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          KA122 Zorunlu
        </span>
      </div>

      {/* 1. Temel İş ve Yasal Tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Kuruluşun Temel Faaliyet Türü (ORG-01) *
          </label>
          <select
            value={data.mainActivityType}
            onChange={(e) => onChange({ mainActivityType: e.target.value as any })}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="VET_SCHOOL">Mesleki ve Teknik Anadolu Lisesi / Meslek Lisesi</option>
            <option value="VET_PROVIDER">Mesleki Eğitim Merkezi / Sürekli Eğitim Kurumu</option>
            <option value="COMPANY">Mesleki Staj Veren Şirket / İşletme</option>
            <option value="OTHER">Diğer Eğitim Otoritesi / Konsorsiyum Koordinatörü</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Mesleki Eğitim Deneyim Süresi (Yıl - ORG-05) *
          </label>
          <input
            type="number"
            min={1}
            max={100}
            value={data.yearsOfVetExperience}
            onChange={(e) => onChange({ yearsOfVetExperience: Math.max(1, Number(e.target.value)) })}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
      </div>

      {/* 2. VET Programları (Hızlı Seçim Çipleri) */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          Kurumunuzda Sunulan Mesleki Eğitim Programları (ORG-02) *
        </label>
        <p className="text-[11px] text-slate-500 mb-2">
          Uygulanan tüm programları seçiniz (Hızlı seçim):
        </p>
        <div className="flex flex-wrap gap-2">
          {VET_PROGRAM_OPTIONS.map((prog) => {
            const selected = data.vetProgramTypes.includes(prog);
            return (
              <button
                key={prog}
                type="button"
                onClick={() => toggleProgram(prog)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                  selected
                    ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {selected ? '✓ ' : '+ '}
                {prog}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Öğrenici Profili ve Kapsayıcılık */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <label className="block text-xs font-bold text-slate-700">
              Hedef Öğrenici Profili ve Yaş Grubu (ORG-03) *
            </label>
            {ka120ImportedFields?.['orgProfile.learnerProfileSummary'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                KA120'den çekildi
              </span>
            )}
          </div>
          <input
            type="text"
            value={data.learnerProfileSummary}
            onChange={(e) => onChange({ learnerProfileSummary: e.target.value })}
            placeholder="Örn: 15-18 yaş bilişim ve endüstriyel otomasyon öğrencileri"
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            İmkanları Kısıtlı Öğrenicilerle Çalışıyor musunuz? (ORG-04) *
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onChange({ hasFewerOpportunitiesLearners: true })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                data.hasFewerOpportunitiesLearners
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Evet
            </button>
            <button
              type="button"
              onClick={() => onChange({ hasFewerOpportunitiesLearners: false, fewerOpportunitiesPercentage: 0 })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                !data.hasFewerOpportunitiesLearners
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Hayır
            </button>
          </div>
        </div>
      </div>

      {data.hasFewerOpportunitiesLearners && (
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
          <label className="block text-xs font-bold text-blue-950 mb-1">
            Kurumunuzdaki İmkanları Kısıtlı Öğrenici Tahmini Oranı (%)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={1}
              max={100}
              value={data.fewerOpportunitiesPercentage || 15}
              onChange={(e) => onChange({ fewerOpportunitiesPercentage: Number(e.target.value) })}
              className="flex-1 accent-blue-700"
            />
            <span className="text-xs font-bold text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-200 min-w-[50px] text-center">
              %{data.fewerOpportunitiesPercentage || 15}
            </span>
          </div>
        </div>
      )}

      {/* 4. Personel ve Öğrenici Sayıları (Hızlı Sayı Girişi) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span>👥</span> Kurum Büyüklüğü ve Personel Sayıları
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Aktif Öğrenici Sayısı (ORG-06) *
              </label>
              {ka120ImportedFields?.['orgProfile.totalVetLearnersCount'] && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="number"
              min={0}
              value={data.totalVetLearnersCount}
              onChange={(e) => onChange({ totalVetLearnersCount: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Meslek Öğretmeni Sayısı (ORG-07) *
              </label>
              {ka120ImportedFields?.['orgProfile.teachingStaffCount'] && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="number"
              min={0}
              value={data.teachingStaffCount}
              onChange={(e) => onChange({ teachingStaffCount: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                İdari / Destek Personel (ORG-08) *
              </label>
              {ka120ImportedFields?.['orgProfile.nonTeachingStaffCount'] && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="number"
              min={0}
              value={data.nonTeachingStaffCount}
              onChange={(e) => onChange({ nonTeachingStaffCount: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
        </div>
      </div>

      {/* 5. Destek Kuruluşu (Supporting Organisation) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>🤝</span> Proje Yönetiminde Destek Kuruluşu Olacak mı? (SUP-01)
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Lojistik, konaklama veya transfer organizasyonunda aracı bir kurumdan destek alacak mısınız?
            </p>
          </div>

          <div className="flex gap-2 min-w-[140px]">
            <button
              type="button"
              onClick={() => onChange({ hasSupportingOrg: true })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                data.hasSupportingOrg
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Evet
            </button>
            <button
              type="button"
              onClick={() => onChange({ hasSupportingOrg: false })}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                !data.hasSupportingOrg
                  ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Hayır
            </button>
          </div>
        </div>

        {data.hasSupportingOrg && (
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destek Kuruluşu Adı (SUP-02)
                </label>
                <input
                  type="text"
                  value={data.supportingOrgName || ''}
                  onChange={(e) => onChange({ supportingOrgName: e.target.value })}
                  placeholder="Örn: EU Mobility Support Solutions"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Destek Kuruluşu OID Kodu
                </label>
                <input
                  type="text"
                  value={data.supportingOrgOid || ''}
                  onChange={(e) => onChange({ supportingOrgOid: e.target.value })}
                  placeholder="Örn: E10987654"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Destek Kuruluşuna Devredilecek Görevler (SUP-03)
              </label>
              <div className="flex flex-wrap gap-2">
                {SUPPORTING_ORG_TASK_OPTIONS.map((task) => {
                  const selected = (data.supportingOrgTasks || []).includes(task);
                  return (
                    <button
                      key={task}
                      type="button"
                      onClick={() => toggleTask(task)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                        selected
                          ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {selected ? '✓ ' : '+ '}
                      {task}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <div>
                <strong>Resmi Erasmus+ Kuralı:</strong> Destek kuruluşu yalnızca lojistik ve pratik
                düzenlemelerde yardımcı olabilir. Katılımcı seçimi, bütçe yönetimi ve içerik
                kararları asla devredilemez.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
