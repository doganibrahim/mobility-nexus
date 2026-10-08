'use client';

import React from 'react';
import {
  ApplicationDraftOrgProfile,
  VET_PROGRAM_OPTIONS,
  VET_PROGRAM_OPTIONS_EN,
  SUPPORTING_ORG_TASK_OPTIONS,
  SUPPORTING_ORG_TASK_OPTIONS_EN,
} from '../../../lib/application-draft-schema';
import { useTranslation } from '../../../lib/i18n';

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
  const { locale } = useTranslation();

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
            <span>
              {locale === 'tr'
                ? 'Bölüm 2: Kuruluş Profili ve Kapasitesi (KA122)'
                : 'Section 2: Organisation Profile & Capacity (KA122)'}
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {locale === 'tr'
              ? 'Kurumunuzun mesleki eğitimdeki yasal statüsü, öğrenici yapısı ve personel büyüklüğü'
              : 'Legal status, learner demographics, and staff capacity in VET'}
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          {locale === 'tr' ? 'KA122 Zorunlu' : 'KA122 Mandatory'}
        </span>
      </div>

      {/* 1. Temel İş ve Yasal Tip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="op-main-activity" className="block text-xs font-bold text-slate-700 mb-1">
            {locale === 'tr'
              ? 'Kuruluşun Temel Faaliyet Türü (ORG-01) *'
              : 'Main Activity Type of Organisation (ORG-01) *'}
          </label>
          <select
            id="op-main-activity"
            name="mainActivityType"
            value={data.mainActivityType}
            onChange={(e) => onChange({ mainActivityType: e.target.value as any })}
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="VET_SCHOOL">
              {locale === 'tr' ? 'Mesleki ve Teknik Anadolu Lisesi / Meslek Lisesi' : 'Vocational and Technical High School'}
            </option>
            <option value="VET_PROVIDER">
              {locale === 'tr' ? 'Mesleki Eğitim Merkezi / Sürekli Eğitim Kurumu' : 'VET Center / Continuing Education Provider'}
            </option>
            <option value="COMPANY">
              {locale === 'tr' ? 'Mesleki Staj Veren Şirket / İşletme' : 'Company / Enterprise Hosting Apprentices'}
            </option>
            <option value="OTHER">
              {locale === 'tr' ? 'Diğer Eğitim Otoritesi / Konsorsiyum Koordinatörü' : 'Other Education Authority / Consortium Coordinator'}
            </option>
          </select>
        </div>

        <div>
          <label htmlFor="op-years-exp" className="block text-xs font-bold text-slate-700 mb-1">
            {locale === 'tr'
              ? 'Mesleki Eğitim Deneyim Süresi (Yıl - ORG-05) *'
              : 'VET Experience (Years - ORG-05) *'}
          </label>
          <input
            id="op-years-exp"
            name="yearsOfVetExperience"
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
          {locale === 'tr'
            ? 'Kurumunuzda Sunulan Mesleki Eğitim Programları (ORG-02) *'
            : 'VET Programs Offered by Your Organisation (ORG-02) *'}
        </label>
        <p className="text-[11px] text-slate-500 mb-2">
          {locale === 'tr'
            ? 'Uygulanan tüm programları seçiniz (Hızlı seçim):'
            : 'Select all applicable programs (Quick select):'}
        </p>
        <div className="flex flex-wrap gap-2">
          {VET_PROGRAM_OPTIONS.map((prog) => {
            const selected = data.vetProgramTypes.includes(prog);
            const label = locale === 'en' ? (VET_PROGRAM_OPTIONS_EN[prog] || prog) : prog;
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
                {label}
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
              {locale === 'tr'
                ? 'Hedef Öğrenici Profili ve Yaş Grubu (ORG-03) *'
                : 'Target Learner Profile and Age Group (ORG-03) *'}
            </label>
            {ka120ImportedFields?.['orgProfile.learnerProfileSummary'] && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
              </span>
            )}
          </div>
          <input
            type="text"
            value={data.learnerProfileSummary}
            onChange={(e) => onChange({ learnerProfileSummary: e.target.value })}
            placeholder={
              locale === 'tr'
                ? 'Örn: 15-18 yaş bilişim ve endüstriyel otomasyon öğrencileri'
                : 'e.g. 15-18 age IT and automation learners'
            }
            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            {locale === 'tr'
              ? 'İmkanları Kısıtlı Öğrenicilerle Çalışıyor musunuz? (ORG-04) *'
              : 'Do you work with learners with fewer opportunities? (ORG-04) *'}
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
              {locale === 'tr' ? 'Evet' : 'Yes'}
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
              {locale === 'tr' ? 'Hayır' : 'No'}
            </button>
          </div>
        </div>
      </div>

      {data.hasFewerOpportunitiesLearners && (
        <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200">
          <label htmlFor="op-fewer-opportunities" className="block text-xs font-bold text-blue-950 mb-1">
            {locale === 'tr'
              ? 'Kurumunuzdaki İmkanları Kısıtlı Öğrenici Tahmini Oranı (%)'
              : 'Estimated Percentage of Learners with Fewer Opportunities (%)'}
          </label>
          <div className="flex items-center gap-3">
            <input
              id="op-fewer-opportunities"
              name="fewerOpportunitiesPercentage"
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

      {/* 4. Personel ve Öğrenici Sayıları */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <span>👥</span> {locale === 'tr' ? 'Kurum Büyüklüğü ve Personel Sayıları' : 'Organisation Size & Staff Counts'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label htmlFor="op-learners-count" className="block text-xs font-semibold text-slate-700">
                {locale === 'tr' ? 'Aktif Öğrenici Sayısı (ORG-06) *' : 'Active Learners Count (ORG-06) *'}
              </label>
              {ka120ImportedFields?.['orgProfile.totalVetLearnersCount'] && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                </span>
              )}
            </div>
            <input
              id="op-learners-count"
              name="totalVetLearnersCount"
              type="number"
              min={0}
              value={data.totalVetLearnersCount}
              onChange={(e) => onChange({ totalVetLearnersCount: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label htmlFor="op-teachers-count" className="block text-xs font-semibold text-slate-700">
                {locale === 'tr' ? 'Meslek Öğretmeni Sayısı (ORG-07) *' : 'VET Teaching Staff Count (ORG-07) *'}
              </label>
              {ka120ImportedFields?.['orgProfile.teachingStaffCount'] && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                </span>
              )}
            </div>
            <input
              id="op-teachers-count"
              name="teachingStaffCount"
              type="number"
              min={0}
              value={data.teachingStaffCount}
              onChange={(e) => onChange({ teachingStaffCount: Number(e.target.value) })}
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label htmlFor="op-admin-staff-count" className="block text-xs font-semibold text-slate-700">
                {locale === 'tr' ? 'İdari / Destek Personel (ORG-08) *' : 'Non-teaching / Admin Staff (ORG-08) *'}
              </label>
              {ka120ImportedFields?.['orgProfile.nonTeachingStaffCount'] && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                </span>
              )}
            </div>
            <input
              id="op-admin-staff-count"
              name="nonTeachingStaffCount"
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
              <span>🤝</span> {locale === 'tr' ? 'Proje Yönetiminde Destek Kuruluşu Olacak mı? (SUP-01)' : 'Will a Supporting Organisation be Involved? (SUP-01)'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {locale === 'tr'
                ? 'Lojistik, konaklama veya transfer organizasyonunda aracı bir kurumdan destek alacak mısınız?'
                : 'Will you receive assistance from an intermediary body for logistics, lodging, or transport?'}
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
              {locale === 'tr' ? 'Evet' : 'Yes'}
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
              {locale === 'tr' ? 'Hayır' : 'No'}
            </button>
          </div>
        </div>

        {data.hasSupportingOrg && (
          <div className="space-y-4 pt-3 border-t border-slate-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Destek Kuruluşu Adı (SUP-02)' : 'Supporting Organisation Name (SUP-02)'}
                </label>
                <input
                  type="text"
                  value={data.supportingOrgName || ''}
                  onChange={(e) => onChange({ supportingOrgName: e.target.value })}
                  placeholder={locale === 'tr' ? 'Örn: EU Mobility Support Solutions' : 'e.g. EU Mobility Support Solutions'}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Destek Kuruluşu OID Kodu' : 'Supporting Organisation OID Code'}
                </label>
                <input
                  type="text"
                  value={data.supportingOrgOid || ''}
                  onChange={(e) => onChange({ supportingOrgOid: e.target.value })}
                  placeholder="E10987654"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {locale === 'tr'
                  ? 'Destek Kuruluşuna Devredilecek Görevler (SUP-03)'
                  : 'Tasks Assigned to Supporting Organisation (SUP-03)'}
              </label>
              <div className="flex flex-wrap gap-2">
                {SUPPORTING_ORG_TASK_OPTIONS.map((task) => {
                  const selected = (data.supportingOrgTasks || []).includes(task);
                  const label = locale === 'en' ? (SUPPORTING_ORG_TASK_OPTIONS_EN[task] || task) : task;
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
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
              <span className="font-bold">⚠️</span>
              <div>
                <strong>{locale === 'tr' ? 'Resmi Erasmus+ Kuralı:' : 'Official Erasmus+ Rule:'}</strong>{' '}
                {locale === 'tr'
                  ? 'Destek kuruluşu yalnızca lojistik ve pratik düzenlemelerde yardımcı olabilir. Katılımcı seçimi, bütçe yönetimi ve içerik kararları asla devredilemez.'
                  : 'Supporting organisations may only assist with logistics and practical arrangements. Participant selection, financial decisions, and course content can never be outsourced.'}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
