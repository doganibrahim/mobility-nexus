'use client';

import React from 'react';
import {
  ApplicationDraftNeedItem,
  ApplicationDraftObjectiveItem,
  PRIORITY_TOPIC_OPTIONS,
} from '../../../lib/application-draft-schema';

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
            <span>Bölüm 3: İhtiyaç Analizi ve Proje Hedefleri (KA122)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Kurumun gelişim ihtiyaçları, belirlenen hedefler ve Erasmus+ öncelikleri
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          KA122 Zorunlu
        </span>
      </div>

      {/* 1. Erasmus+ Öncelikli Konuları (TOP-01) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <span>📌</span> Erasmus+ Öncelikli Konuları (TOP-01 - En Fazla 3 Seçim) *
          </label>
          <span className="text-xs font-bold text-blue-700 bg-blue-100/60 px-2 py-0.5 rounded-md">
            {priorityTopics.length} / 3 Seçildi
          </span>
        </div>
        <p className="text-[11px] text-slate-500 mb-3">
          Projenizin doğrudan katkı sağladığı en önemli tematik alanları işaretleyiniz:
        </p>

        <div className="flex flex-wrap gap-2">
          {PRIORITY_TOPIC_OPTIONS.map((topic) => {
            const selected = priorityTopics.includes(topic);
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
                {topic}
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
                <span>🔍</span> Kurumsal İhtiyaç Analizi (Needs Analysis)
              </h3>
              {ka120ImportedFields?.['needs'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Kurumunuzun çözmek istediği mesleki veya kurumsal eksiklikler
            </p>
          </div>

          {needs.length < 3 && (
            <button
              type="button"
              onClick={addNeed}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              + Yeni İhtiyaç Ekle
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
                İhtiyaç #{idx + 1}
              </span>
              {needs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeNeed(idx)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Sil
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                İhtiyaç Başlığı / Tanımı (NEED-01) *
              </label>
              <input
                type="text"
                value={need.title}
                onChange={(e) => updateNeed(idx, { title: e.target.value })}
                placeholder="Örn: Yeni nesil PLC otomasyon ve dijital üretimde pratik uygulama eksikliği"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Somut Kanıt / Gerekçe (NEED-02) *
                </label>
                <input
                  type="text"
                  value={need.evidence}
                  onChange={(e) => updateNeed(idx, { evidence: e.target.value })}
                  placeholder="Örn: Mezun izleme anketleri ve okul-sanayi işbirliği raporu"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hedef Grup (Target Group) *
                </label>
                <input
                  type="text"
                  value={need.targetGroup}
                  onChange={(e) => updateNeed(idx, { targetGroup: e.target.value })}
                  placeholder="Örn: 11. sınıf elektrik-elektronik öğrencileri ve 4 atölye öğretmeni"
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
                <span>🎯</span> Proje Hedefleri (Project Objectives)
              </h3>
              {ka120ImportedFields?.['objectives'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              SMART (Belirli, Ölçülebilir, Ulaşılabilir, İlgili, Zamanlı) kurumsal hedefler
            </p>
          </div>

          {objectives.length < 3 && (
            <button
              type="button"
              onClick={addObjective}
              className="text-xs font-bold text-blue-700 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors"
            >
              + Yeni Hedef Ekle
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
                Hedef #{idx + 1}
              </span>
              {objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeObjective(idx)}
                  className="text-xs text-rose-600 hover:text-rose-700 font-semibold"
                >
                  Sil
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hedef Başlığı (OBJ-01) *
              </label>
              <input
                type="text"
                value={obj.title}
                onChange={(e) => updateObjective(idx, { title: e.target.value })}
                placeholder="Örn: 10 öğrencinin Avrupa standartlarında endüstriyel robotik programlama sertifikasyonu alması"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Başarı Göstergesi (OBJ-03) *
                </label>
                <input
                  type="text"
                  value={obj.targetIndicator}
                  onChange={(e) => updateObjective(idx, { targetIndicator: e.target.value })}
                  placeholder="Örn: Europass Hareketlilik Belgesi ve beceri kazanım puanı"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Ölçüm Aracı (Measurement Tool) *
                </label>
                <input
                  type="text"
                  value={obj.measurementTool}
                  onChange={(e) => updateObjective(idx, { measurementTool: e.target.value })}
                  placeholder="Örn: Mentor değerlendirme formu, pratik sınav ve katılım sertifikası"
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
