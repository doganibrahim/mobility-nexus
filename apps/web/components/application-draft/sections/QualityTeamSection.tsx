'use client';

import React from 'react';
import { ApplicationDraftQualityTeam } from '../../../lib/application-draft-schema';

interface QualityTeamSectionProps {
  data: ApplicationDraftQualityTeam;
  onChange: (updated: Partial<ApplicationDraftQualityTeam>) => void;
  ka120ImportedFields?: Record<string, boolean>;
}

export default function QualityTeamSection({
  data,
  onChange,
  ka120ImportedFields,
}: QualityTeamSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>👥</span>
            <span>Bölüm 5: Kalite Standartları, Proje Ekibi ve Yaygınlaştırma (KA122)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Erasmus Kalite Standartları taahhütleri, yönetim ekibi ve proje sonuçlarının yaygınlaştırılması
          </p>
        </div>
        <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
          KA122 Zorunlu
        </span>
      </div>

      {/* 1. Proje Yönetim Ekibi (TEAM-01 & TEAM-02) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>👔</span> Proje Yönetim Ekibi (Yasal Temsilci & Koordinatör)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Yasal Temsilci */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-1">
              <div className="text-xs font-bold text-slate-900">Yasal Temsilci (Okul Müdürü) *</div>
              {ka120ImportedFields?.['qualityTeam.legalRepresentativeName'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.legalRepresentativeName}
              onChange={(e) => onChange({ legalRepresentativeName: e.target.value })}
              placeholder="Ad Soyad"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={data.legalRepresentativeRole}
                onChange={(e) => onChange({ legalRepresentativeRole: e.target.value })}
                placeholder="Görevi (Örn: Okul Müdürü)"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
              />
              <input
                type="email"
                value={data.legalRepresentativeEmail}
                onChange={(e) => onChange({ legalRepresentativeEmail: e.target.value })}
                placeholder="E-posta Adresi"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
              />
            </div>
          </div>

          {/* Proje Koordinatörü */}
          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-3">
            <div className="flex items-center justify-between gap-1">
              <div className="text-xs font-bold text-slate-900">Proje Koordinatörü / İrtibat Kişisi *</div>
              {ka120ImportedFields?.['qualityTeam.coordinatorName'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.coordinatorName}
              onChange={(e) => onChange({ coordinatorName: e.target.value })}
              placeholder="Ad Soyad"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={data.coordinatorRole}
                onChange={(e) => onChange({ coordinatorRole: e.target.value })}
                placeholder="Görevi (Örn: İngilizce Öğretmeni)"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
              />
              <input
                type="email"
                value={data.coordinatorEmail}
                onChange={(e) => onChange({ coordinatorEmail: e.target.value })}
                placeholder="E-posta Adresi"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Katılımcı Seçimi, Hazırlık ve Tanınma */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>📋</span> Seçim, Hazırlık ve Öğrenme Çıktılarının Tanınması
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Katılımcı Seçim Kriterleri (TEAM-03) *
              </label>
              {ka120ImportedFields?.['qualityTeam.selectionCriteriaSummary'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.selectionCriteriaSummary}
              onChange={(e) => onChange({ selectionCriteriaSummary: e.target.value })}
              placeholder="Örn: Akademik başarı (%30), Mesleki motivasyon (%30), Dil düzeyi (%20), Mülakat (%20)"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-bold text-slate-700">
                Pedagojik, Kültürel ve Dilsel Hazırlık Planı (TEAM-04) *
              </label>
              {ka120ImportedFields?.['qualityTeam.preparationPlanSummary'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.preparationPlanSummary}
              onChange={(e) => onChange({ preparationPlanSummary: e.target.value })}
              placeholder="Örn: 20 saat mesleki yabancı dil, 10 saat kültürel oryantasyon ve iş güvenliği eğitimi"
              className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Öğrenme Çıktılarının Tanınma Yöntemi (TEAM-05) *
              </label>
              <select
                value={data.recognitionMethod}
                onChange={(e) => onChange({ recognitionMethod: e.target.value as any })}
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="EUROPASS_MOBILITY">Europass Hareketlilik Belgesi (Önerilen)</option>
                <option value="INSTITUTIONAL_CERTIFICATE">Kurumsal Katılım ve Başarı Sertifikası</option>
                <option value="BOTH">Europass + Kurumsal Sertifika</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Acil Durum ve Kriz Protokolü (TEAM-07) *
              </label>
              <input
                type="text"
                value={data.emergencyCrisisProtocol}
                onChange={(e) => onChange({ emergencyCrisisProtocol: e.target.value })}
                placeholder="Örn: 24/7 acil iletişim hattı, seyahat sağlık sigortası ve konsolosluk bildirimi"
                className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 3. Erasmus Temel İlkeleri (QLT-01 ~ QLT-04) */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
        <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span>🇪🇺</span> Erasmus Kalite İlkelerine Uyum
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Kapsayıcılık ve Fırsat Eşitliği (QLT-01)
              </label>
              {ka120ImportedFields?.['qualityTeam.inclusionApproach'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.inclusionApproach}
              onChange={(e) => onChange({ inclusionApproach: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Çevre Sürdürülebilirliği ve Yeşil İlkeler (QLT-02)
              </label>
              {ka120ImportedFields?.['qualityTeam.greenPractices'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.greenPractices}
              onChange={(e) => onChange({ greenPractices: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Dijital Eğitim Araçları Kullanımı (QLT-03)
              </label>
              {ka120ImportedFields?.['qualityTeam.digitalToolsUsage'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.digitalToolsUsage}
              onChange={(e) => onChange({ digitalToolsUsage: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Demokratik Yaşama Aktif Katılım (QLT-04)
              </label>
              {ka120ImportedFields?.['qualityTeam.democraticParticipation'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.democraticParticipation}
              onChange={(e) => onChange({ democraticParticipation: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* 4. Kurumsallaşma ve Yaygınlaştırma (INT-01, DIS-01 ~ 03) */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <span>📢</span> Kurumsallaşma ve Yaygınlaştırma
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Müfredata Entegrasyon (INT-01)
              </label>
              {ka120ImportedFields?.['qualityTeam.institutionalIntegrationPlan'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.institutionalIntegrationPlan}
              onChange={(e) => onChange({ institutionalIntegrationPlan: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-1 mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Kurum İçi Paylaşım (DIS-01)
              </label>
              {ka120ImportedFields?.['qualityTeam.internalDissemination'] && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  KA120'den çekildi
                </span>
              )}
            </div>
            <input
              type="text"
              value={data.internalDissemination}
              onChange={(e) => onChange({ internalDissemination: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sektör ve Yerel Paydaşlarla Paylaşım (DIS-02)
            </label>
            <input
              type="text"
              value={data.externalDissemination}
              onChange={(e) => onChange({ externalDissemination: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              AB Görünürlük Tedbirleri (DIS-03)
            </label>
            <input
              type="text"
              value={data.euVisibilityMeasures}
              onChange={(e) => onChange({ euVisibilityMeasures: e.target.value })}
              className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
