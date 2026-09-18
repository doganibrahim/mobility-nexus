'use client';

import React, { useState, useEffect } from 'react';
import { Ka120ExtractedData } from '../../lib/application-draft-schema';

interface Ka120ImportPreviewModalProps {
  isOpen: boolean;
  extractedData: Ka120ExtractedData | null;
  onClose: () => void;
  onConfirm: (confirmedData: Ka120ExtractedData) => void;
}

export default function Ka120ImportPreviewModal({
  isOpen,
  extractedData,
  onClose,
  onConfirm,
}: Ka120ImportPreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'context' | 'team' | 'org' | 'quality' | 'objectives'>('context');
  const [formData, setFormData] = useState<Ka120ExtractedData | null>(null);

  useEffect(() => {
    if (extractedData) {
      setFormData(JSON.parse(JSON.stringify(extractedData)));
      setActiveTab('context');
    }
  }, [extractedData]);

  if (!isOpen || !formData) return null;

  const handleTextChange = (field: keyof Ka120ExtractedData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleQualityChange = (field: string, value: any) => {
    setFormData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        qualityTeam: {
          ...(prev.qualityTeam || {}),
          [field]: value,
        },
      };
    });
  };

  const handleObjectiveChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      if (!prev || !prev.objectives) return prev;
      const nextObjs = [...prev.objectives];
      nextObjs[index] = { ...nextObjs[index], [field]: value };
      return { ...prev, objectives: nextObjs };
    });
  };

  const handleNeedChange = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      if (!prev || !prev.needs) return prev;
      const nextNeeds = [...prev.needs];
      nextNeeds[index] = { ...nextNeeds[index], [field]: value };
      return { ...prev, needs: nextNeeds };
    });
  };

  const detectedFieldsCount = [
    formData.applicantName,
    formData.applicantOid,
    formData.applicantCity,
    formData.accreditationCode,
    formData.projectTitle,
    formData.qualityTeam?.legalRepresentativeName,
    formData.qualityTeam?.coordinatorName,
    formData.qualityTeam?.inclusionApproach,
    formData.qualityTeam?.greenPractices,
    formData.qualityTeam?.digitalToolsUsage,
    formData.qualityTeam?.monitoringMentorshipPlan,
    formData.needs && formData.needs.length > 0,
    formData.objectives && formData.objectives.length > 0,
  ].filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-600 text-white uppercase tracking-wider">
                KA120 VET Akreditasyon
              </span>
              <span className="text-xs text-slate-300">
                {detectedFieldsCount} alan tespit edildi
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              KA120 Akreditasyon Verileri Önizleme ve Düzenleme
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Yüklediğiniz resmi KA120 belgesinden çıkarılan verileri inceleyebilir ve taslağa aktarmadan önce düzenleyebilirsiniz.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition"
          >
            ✕
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 gap-2 pt-2 overflow-x-auto">
          {[
            { id: 'context', label: '1. Kurum & Bağlam' },
            { id: 'team', label: '2. Yasal Temsilci & Ekip' },
            { id: 'org', label: '3. Profil & İstatistikler' },
            { id: 'quality', label: '4. Kalite Standartları' },
            { id: 'objectives', label: '5. Hedefler & İhtiyaçlar' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white border-blue-600 text-blue-700 shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {/* TAB 1: CONTEXT */}
          {activeTab === 'context' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                Belgeden çekilen kurum adı, OID ve akreditasyon kodu resmi KA121 başvuru formunuzun bağlam alanlarına aktarılacaktır.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kuruluş Resmi Adı (Applicant Name)
                  </label>
                  <input
                    type="text"
                    value={formData.applicantName || ''}
                    onChange={(e) => handleTextChange('applicantName', e.target.value)}
                    placeholder="Örn: Kapadokya Mesleki ve Teknik Anadolu Lisesi"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Kuruluş Kimlik Kodu (OID)
                  </label>
                  <input
                    type="text"
                    value={formData.applicantOid || ''}
                    onChange={(e) => handleTextChange('applicantOid', e.target.value)}
                    placeholder="Örn: E10123456"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Şehir (City)
                  </label>
                  <input
                    type="text"
                    value={formData.applicantCity || ''}
                    onChange={(e) => handleTextChange('applicantCity', e.target.value)}
                    placeholder="Örn: Nevşehir"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Erasmus Akreditasyon Kodu (Accreditation Code)
                  </label>
                  <input
                    type="text"
                    value={formData.accreditationCode || ''}
                    onChange={(e) => handleTextChange('accreditationCode', e.target.value)}
                    placeholder="Örn: 2021-1-TR01-KA120-VET-000012"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Erasmus Planı / Proje Başlığı
                  </label>
                  <input
                    type="text"
                    value={formData.projectTitle || ''}
                    onChange={(e) => handleTextChange('projectTitle', e.target.value)}
                    placeholder="Örn: Mesleki Eğitimde Dijitalleşme ve Endüstri 4.0 Planı"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Proje Kısaltması (Acronym)
                  </label>
                  <input
                    type="text"
                    value={formData.projectAcronym || ''}
                    onChange={(e) => handleTextChange('projectAcronym', e.target.value)}
                    placeholder="Örn: DIGI-VET"
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEAM */}
          {activeTab === 'team' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                KA120 başvurusunda yer alan Yasal Temsilci (Legal Representative) ve İlgili Kişi / Proje Koordinatörü bilgileri.
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>👔</span> Yasal Temsilci (Legal Representative)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.legalRepresentativeName || ''}
                      onChange={(e) => handleQualityChange('legalRepresentativeName', e.target.value)}
                      placeholder="Örn: Ahmet Yılmaz"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Görevi</label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.legalRepresentativeRole || ''}
                      onChange={(e) => handleQualityChange('legalRepresentativeRole', e.target.value)}
                      placeholder="Örn: Okul Müdürü"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">E-Posta</label>
                    <input
                      type="email"
                      value={formData.qualityTeam?.legalRepresentativeEmail || ''}
                      onChange={(e) => handleQualityChange('legalRepresentativeEmail', e.target.value)}
                      placeholder="Örn: mudur@okul.k12.tr"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>📋</span> Erasmus Koordinatörü / Temas Kişisi
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.coordinatorName || ''}
                      onChange={(e) => handleQualityChange('coordinatorName', e.target.value)}
                      placeholder="Örn: Zeynep Kaya"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Görevi</label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.coordinatorRole || ''}
                      onChange={(e) => handleQualityChange('coordinatorRole', e.target.value)}
                      placeholder="Örn: Proje Koordinatörü"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">E-Posta</label>
                    <input
                      type="email"
                      value={formData.qualityTeam?.coordinatorEmail || ''}
                      onChange={(e) => handleQualityChange('coordinatorEmail', e.target.value)}
                      placeholder="Örn: koordinasyon@okul.k12.tr"
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORG */}
          {activeTab === 'org' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Toplam Mesleki Öğrenci Sayısı
                  </label>
                  <input
                    type="number"
                    value={formData.totalVetLearnersCount || 0}
                    onChange={(e) => handleTextChange('totalVetLearnersCount', parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Öğretici Personel Sayısı
                  </label>
                  <input
                    type="number"
                    value={formData.teachingStaffCount || 0}
                    onChange={(e) => handleTextChange('teachingStaffCount', parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mesleki Eğitim Deneyimi (Yıl)
                  </label>
                  <input
                    type="number"
                    value={formData.yearsOfVetExperience || 0}
                    onChange={(e) => handleTextChange('yearsOfVetExperience', parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Öğrenici Profili ve Yaş Grubu Özeti
                </label>
                <textarea
                  rows={3}
                  value={formData.learnerProfileSummary || ''}
                  onChange={(e) => handleTextChange('learnerProfileSummary', e.target.value)}
                  placeholder="Örn: 15-18 yaş arası mesleki ve teknik lise bilişim/otomasyon öğrencileri"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: QUALITY */}
          {activeTab === 'quality' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                KA120 akreditasyonunda taahhüt ettiğiniz Erasmus Kalite Standartları ve ilkeleri. Bu içerikler KA121 hibe talebi metinlerinde doğrudan referans alınacaktır.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kapsayıcılık ve Fırsat Eşitliği Yaklaşımı (Inclusion)
                </label>
                <textarea
                  rows={2}
                  value={formData.qualityTeam?.inclusionApproach || ''}
                  onChange={(e) => handleQualityChange('inclusionApproach', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Yeşil ve Çevresel Sürdürülebilirlik (Environmental Sustainability)
                </label>
                <textarea
                  rows={2}
                  value={formData.qualityTeam?.greenPractices || ''}
                  onChange={(e) => handleQualityChange('greenPractices', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dijital Eğitim ve Çevrim İçi Araçlar (Digital Tools)
                </label>
                <textarea
                  rows={2}
                  value={formData.qualityTeam?.digitalToolsUsage || ''}
                  onChange={(e) => handleQualityChange('digitalToolsUsage', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  İzleme, Mentörlük ve Faaliyet Yönetimi
                </label>
                <textarea
                  rows={2}
                  value={formData.qualityTeam?.monitoringMentorshipPlan || ''}
                  onChange={(e) => handleQualityChange('monitoringMentorshipPlan', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sonuçların Kurum Müfredatına ve Atölyelere Entegrasyonu
                </label>
                <textarea
                  rows={2}
                  value={formData.qualityTeam?.institutionalIntegrationPlan || ''}
                  onChange={(e) => handleQualityChange('institutionalIntegrationPlan', e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          )}

          {/* TAB 5: OBJECTIVES & NEEDS */}
          {activeTab === 'objectives' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                KA120 Erasmus Planınızda yer alan onaylı hedefler ve kurumsal ihtiyaçlar.
              </div>

              {/* Objectives */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>🎯 Erasmus Planı Hedefleri ({formData.objectives?.length || 0})</span>
                </h3>

                {(!formData.objectives || formData.objectives.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">Belgeden özel bir hedef listesi okunamadı.</p>
                ) : (
                  formData.objectives.map((obj, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                      <div className="text-[11px] font-bold text-blue-700">Hedef #{idx + 1}</div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Hedef Başlığı</label>
                        <input
                          type="text"
                          value={obj.title || ''}
                          onChange={(e) => handleObjectiveChange(idx, 'title', e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Başarı Göstergesi</label>
                          <input
                            type="text"
                            value={obj.targetIndicator || ''}
                            onChange={(e) => handleObjectiveChange(idx, 'targetIndicator', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Ölçme Aracı</label>
                          <input
                            type="text"
                            value={obj.measurementTool || ''}
                            onChange={(e) => handleObjectiveChange(idx, 'measurementTool', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Needs */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <h3 className="text-xs font-bold text-slate-900">
                  🔍 Kurumsal İhtiyaçlar ve Zorluklar ({formData.needs?.length || 0})
                </h3>

                {(!formData.needs || formData.needs.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">Belgeden özel bir ihtiyaç listesi okunamadı.</p>
                ) : (
                  formData.needs.map((need, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700">İhtiyaç #{idx + 1}</div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">İhtiyaç Başlığı</label>
                        <input
                          type="text"
                          value={need.title || ''}
                          onChange={(e) => handleNeedChange(idx, 'title', e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Dayanak / Kanıt</label>
                          <input
                            type="text"
                            value={need.evidence || ''}
                            onChange={(e) => handleNeedChange(idx, 'evidence', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">Hedef Kitle</label>
                          <input
                            type="text"
                            value={need.targetGroup || ''}
                            onChange={(e) => handleNeedChange(idx, 'targetGroup', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition"
          >
            İptal
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Değişiklikleriniz onayladığınızda taslağa işlenecektir.
            </span>
            <button
              type="button"
              onClick={() => onConfirm(formData)}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5"
            >
              <span>✓</span> Onayla ve Taslağa Aktar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
