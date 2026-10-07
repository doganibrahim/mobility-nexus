'use client';

import React from 'react';
import {
  ApplicationDraftNeedItem,
  ApplicationDraftObjectiveItem,
  PRIORITY_TOPIC_OPTIONS,
  PRIORITY_TOPIC_OPTIONS_EN,
} from '../../../lib/application-draft-schema';
import { useTranslation } from '../../../lib/i18n';

interface NeedsObjectivesSectionProps {
  needs: ApplicationDraftNeedItem[];
  objectives: ApplicationDraftObjectiveItem[];
  priorityTopics: string[];
  onChangeNeeds: (needs: ApplicationDraftNeedItem[]) => void;
  onChangeObjectives: (objectives: ApplicationDraftObjectiveItem[]) => void;
  onChangePriorityTopics: (topics: string[]) => void;
  ka120ImportedFields?: Record<string, boolean>;
}

export default function NeedsObjectivesSection({
  needs,
  objectives,
  priorityTopics,
  onChangeNeeds,
  onChangeObjectives,
  onChangePriorityTopics,
  ka120ImportedFields,
}: NeedsObjectivesSectionProps) {
  const { locale } = useTranslation();

  // Update specific need
  const updateNeed = (idx: number, patch: Partial<ApplicationDraftNeedItem>) => {
    const updated = [...needs];
    updated[idx] = { ...updated[idx], ...patch };
    onChangeNeeds(updated);
  };

  const addNeed = () => {
    if (needs.length >= 3) return;
    const newNeed: ApplicationDraftNeedItem = {
      id: `need-${Date.now()}`,
      title: '',
      evidence: '',
      targetGroup: '',
    };
    onChangeNeeds([...needs, newNeed]);
  };

  const removeNeed = (idx: number) => {
    if (needs.length <= 1) return;
    onChangeNeeds(needs.filter((_, i) => i !== idx));
  };

  // Update specific objective
  const updateObjective = (idx: number, patch: Partial<ApplicationDraftObjectiveItem>) => {
    const updated = [...objectives];
    updated[idx] = { ...updated[idx], ...patch };
    onChangeObjectives(updated);
  };

  const addObjective = () => {
    if (objectives.length >= 3) return;
    const newObj: ApplicationDraftObjectiveItem = {
      id: `obj-${Date.now()}`,
      needIdRef: needs[0]?.id,
      title: '',
      targetIndicator: '',
      measurementTool: '',
    };
    onChangeObjectives([...objectives, newObj]);
  };

  const removeObjective = (idx: number) => {
    if (objectives.length <= 1) return;
    onChangeObjectives(objectives.filter((_, i) => i !== idx));
  };

  // Toggle priority topic
  const toggleTopic = (topic: string) => {
    const exists = priorityTopics.includes(topic);
    if (exists) {
      onChangePriorityTopics(priorityTopics.filter((t) => t !== topic));
    } else {
      if (priorityTopics.length >= 3) return;
      onChangePriorityTopics([...priorityTopics, topic]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>🎯</span>
            <span>
              {locale === 'tr'
                ? 'Bölüm 3: İhtiyaç Analizi ve Proje Hedefleri (KA122)'
                : 'Section 3: Needs Analysis and Project Objectives (KA122)'}
            </span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            {locale === 'tr'
              ? 'Kurumun gelişim ihtiyaçları, belirlenen hedefler ve Erasmus+ öncelikleri'
              : 'Institutional development needs, defined objectives, and Erasmus+ priorities'}
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          {locale === 'tr' ? 'KA122 Zorunlu' : 'KA122 Mandatory'}
        </span>
      </div>

      {/* 1. Erasmus+ Öncelikli Konuları (TOP-01) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>📌</span>{' '}
            {locale === 'tr'
              ? 'Erasmus+ Öncelikli Konuları (TOP-01 - En Fazla 3 Seçim) *'
              : 'Erasmus+ Priority Topics (TOP-01 - Max 3 Selections) *'}
          </label>
          <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
            {locale === 'tr'
              ? `${priorityTopics.length} / 3 Seçildi`
              : `${priorityTopics.length} / 3 Selected`}
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          {locale === 'tr'
            ? 'Projenizin doğrudan katkı sağladığı en önemli tematik alanları işaretleyiniz:'
            : 'Select the key thematic priorities your project directly addresses:'}
        </p>

        <div className="flex flex-wrap gap-2">
          {PRIORITY_TOPIC_OPTIONS.map((topic) => {
            const selected = priorityTopics.includes(topic);
            const label = locale === 'en' ? (PRIORITY_TOPIC_OPTIONS_EN[topic] || topic) : topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => toggleTopic(topic)}
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

      {/* 2. İhtiyaç Analizi (NEED-01 ~ NEED-04) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🔍</span> {locale === 'tr' ? 'Kurumsal İhtiyaç Analizi (Needs Analysis)' : 'Institutional Needs Analysis'}
              </h3>
              {ka120ImportedFields?.['needs'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {locale === 'tr'
                ? 'Kurumunuzun çözmek istediği mesleki veya kurumsal eksiklikler'
                : 'Deficits and development gaps your institution intends to address'}
            </p>
          </div>

          {needs.length < 3 && (
            <button
              type="button"
              onClick={addNeed}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              {locale === 'tr' ? '+ Yeni İhtiyaç Ekle' : '+ Add New Need'}
            </button>
          )}
        </div>

        {needs.map((need, idx) => (
          <div
            key={need.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {locale === 'tr' ? `İhtiyaç #${idx + 1}` : `Need #${idx + 1}`}
              </span>
              {needs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeNeed(idx)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  {locale === 'tr' ? 'Sil' : 'Delete'}
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'İhtiyaç Başlığı / Tanımı (NEED-01) *' : 'Need Title / Definition (NEED-01) *'}
              </label>
              <input
                type="text"
                value={need.title}
                onChange={(e) => updateNeed(idx, { title: e.target.value })}
                placeholder={
                  locale === 'tr'
                    ? 'Örn: Yeni nesil PLC otomasyon ve dijital üretimde pratik uygulama eksikliği'
                    : 'e.g. Lack of practical hands-on training in PLC automation and Industry 4.0'
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Somut Kanıt / Gerekçe (NEED-02) *' : 'Concrete Evidence / Justification (NEED-02) *'}
                </label>
                <input
                  type="text"
                  value={need.evidence}
                  onChange={(e) => updateNeed(idx, { evidence: e.target.value })}
                  placeholder={
                    locale === 'tr'
                      ? 'Örn: Mezun izleme anketleri ve okul-sanayi işbirliği raporu'
                      : 'e.g. Graduate employment tracking surveys and industrial advisory reports'
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Hedef Grup (Target Group) *' : 'Target Group (Target Group) *'}
                </label>
                <input
                  type="text"
                  value={need.targetGroup}
                  onChange={(e) => updateNeed(idx, { targetGroup: e.target.value })}
                  placeholder={
                    locale === 'tr'
                      ? 'Örn: 11. sınıf elektrik-elektronik öğrencileri ve 4 atölye öğretmeni'
                      : 'e.g. 11th grade electrical learners and 4 workshop trainers'
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Proje Hedefleri (OBJ-01 ~ OBJ-04) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🎯</span> {locale === 'tr' ? 'Proje Hedefleri (Project Objectives)' : 'Project Objectives'}
              </h3>
              {ka120ImportedFields?.['objectives'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {locale === 'tr' ? "KA120'den çekildi" : 'Imported from KA120'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {locale === 'tr'
                ? 'SMART (Belirli, Ölçülebilir, Ulaşılabilir, İlgili, Zamanlı) kurumsal hedefler'
                : 'SMART (Specific, Measurable, Achievable, Relevant, Time-bound) institutional objectives'}
            </p>
          </div>

          {objectives.length < 3 && (
            <button
              type="button"
              onClick={addObjective}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              {locale === 'tr' ? '+ Yeni Hedef Ekle' : '+ Add New Objective'}
            </button>
          )}
        </div>

        {objectives.map((obj, idx) => (
          <div
            key={obj.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {locale === 'tr' ? `Hedef #${idx + 1}` : `Objective #${idx + 1}`}
              </span>
              {objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(idx)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
                >
                  {locale === 'tr' ? 'Sil' : 'Delete'}
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Hedef Başlığı (OBJ-01) *' : 'Objective Title (OBJ-01) *'}
              </label>
              <input
                type="text"
                value={obj.title}
                onChange={(e) => updateObjective(idx, { title: e.target.value })}
                placeholder={
                  locale === 'tr'
                    ? 'Örn: 10 öğrencinin Avrupa standartlarında endüstriyel robotik programlama sertifikasyonu alması'
                    : 'e.g. 10 learners gaining certified European competency in industrial robotic automation'
                }
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Başarı Göstergesi (OBJ-03) *' : 'Target Indicator (OBJ-03) *'}
                </label>
                <input
                  type="text"
                  value={obj.targetIndicator}
                  onChange={(e) => updateObjective(idx, { targetIndicator: e.target.value })}
                  placeholder={
                    locale === 'tr'
                      ? 'Örn: Europass Hareketlilik Belgesi ve beceri kazanım puanı'
                      : 'e.g. Europass Mobility document and verified skill rubric score'
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Ölçüm Aracı (Measurement Tool) *' : 'Measurement Tool (Measurement Tool) *'}
                </label>
                <input
                  type="text"
                  value={obj.measurementTool}
                  onChange={(e) => updateObjective(idx, { measurementTool: e.target.value })}
                  placeholder={
                    locale === 'tr'
                      ? 'Örn: Mentor değerlendirme formu, pratik sınav ve katılım sertifikası'
                      : 'e.g. Mentor evaluation rubric, practical performance assessment, and attendance log'
                  }
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
