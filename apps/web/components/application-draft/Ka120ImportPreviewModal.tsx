'use client';

import React, { useState, useEffect } from 'react';
import { Ka120ExtractedData } from '../../lib/application-draft-schema';
import { useTranslation } from '../../lib/i18n';

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
  const { locale } = useTranslation();
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
                {locale === 'tr' ? 'KA120 Mesleki Akreditasyon' : 'KA120 VET Accreditation'}
              </span>
              <span className="text-xs text-slate-300">
                {locale === 'tr' ? `${detectedFieldsCount} alan tespit edildi` : `${detectedFieldsCount} fields detected`}
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-1">
              {locale === 'tr' ? 'KA120 Akreditasyon Verileri Önizleme ve Düzenleme' : 'KA120 Accreditation Data Preview & Edit'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              {locale === 'tr'
                ? 'Yüklediğiniz KA120 belgesinden çıkarılan verileri inceleyebilir ve taslağa aktarmadan önce düzenleyebilirsiniz.'
                : 'You can review data extracted from your KA120 document and edit them before transferring to the draft.'}
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
            { id: 'context', label: locale === 'tr' ? '1. Kurum & Bağlam' : '1. Institution & Context' },
            { id: 'team', label: locale === 'tr' ? '2. Yasal Temsilci & Ekip' : '2. Legal Rep & Team' },
            { id: 'org', label: locale === 'tr' ? '3. Profil & İstatistikler' : '3. Profile & Stats' },
            { id: 'quality', label: locale === 'tr' ? '4. Kalite Standartları' : '4. Quality Standards' },
            { id: 'objectives', label: locale === 'tr' ? '5. Hedefler & İhtiyaçlar' : '5. Objectives & Needs' },
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
                {locale === 'tr'
                  ? 'Belgeden çekilen kurum adı, OID ve akreditasyon kodu resmi KA121 başvuru formunuzun bağlam alanlarına aktarılacaktır.'
                  : 'Institution name, OID, and accreditation code extracted from the document will be transferred to your KA121 application form context fields.'}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Kuruluş Resmi Adı (Applicant Name)' : 'Legal Name of Organisation (Applicant Name)'}
                  </label>
                  <input
                    type="text"
                    value={formData.applicantName || ''}
                    onChange={(e) => handleTextChange('applicantName', e.target.value)}
                    placeholder={locale === 'tr' ? 'Örn: Kapadokya Mesleki ve Teknik Anadolu Lisesi' : 'e.g. Cappadocia Vocational and Technical High School'}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Kuruluş Kimlik Kodu (OID)' : 'Organisation ID (OID)'}
                  </label>
                  <input
                    type="text"
                    value={formData.applicantOid || ''}
                    onChange={(e) => handleTextChange('applicantOid', e.target.value)}
                    placeholder={locale === 'tr' ? 'Örn: E10123456' : 'e.g. E10123456'}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Şehir (City)' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={formData.applicantCity || ''}
                    onChange={(e) => handleTextChange('applicantCity', e.target.value)}
                    placeholder={locale === 'tr' ? 'Örn: Nevşehir' : 'e.g. Nevsehir'}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Erasmus Akreditasyon Kodu (Accreditation Code)' : 'Erasmus Accreditation Code'}
                  </label>
                  <input
                    type="text"
                    value={formData.accreditationCode || ''}
                    onChange={(e) => handleTextChange('accreditationCode', e.target.value)}
                    placeholder={locale === 'tr' ? 'Örn: 2021-1-TR01-KA120-VET-000012' : 'e.g. 2021-1-TR01-KA120-VET-000012'}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 font-mono focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Erasmus Planı / Proje Başlığı' : 'Erasmus Plan / Project Title'}
                  </label>
                  <input
                    type="text"
                    value={formData.projectTitle || ''}
                    onChange={(e) => handleTextChange('projectTitle', e.target.value)}
                    placeholder={locale === 'tr' ? 'Örn: Mesleki Eğitimde Dijitalleşme ve Endüstri 4.0 Planı' : 'e.g. Digitalisation and Industry 4.0 in VET Plan'}
                    className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Proje Kısaltması (Acronym)' : 'Project Acronym'}
                  </label>
                  <input
                    type="text"
                    value={formData.projectAcronym || ''}
                    onChange={(e) => handleTextChange('projectAcronym', e.target.value)}
                    placeholder={locale === 'tr' ? 'Örn: DIGI-VET' : 'e.g. DIGI-VET'}
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
                {locale === 'tr'
                  ? 'KA120 başvurusunda yer alan Yasal Temsilci (Legal Representative) ve İlgili Kişi / Proje Koordinatörü bilgileri.'
                  : 'Legal Representative and Contact Person / Project Coordinator details from the KA120 application.'}
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>👔</span> {locale === 'tr' ? 'Yasal Temsilci (Legal Representative)' : 'Legal Representative'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {locale === 'tr' ? 'Ad Soyad' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.legalRepresentativeName || ''}
                      onChange={(e) => handleQualityChange('legalRepresentativeName', e.target.value)}
                      placeholder={locale === 'tr' ? 'Örn: Ahmet Yılmaz' : 'e.g. John Doe'}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {locale === 'tr' ? 'Görevi' : 'Role / Position'}
                    </label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.legalRepresentativeRole || ''}
                      onChange={(e) => handleQualityChange('legalRepresentativeRole', e.target.value)}
                      placeholder={locale === 'tr' ? 'Örn: Okul Müdürü' : 'e.g. School Principal'}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {locale === 'tr' ? 'E-Posta' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.qualityTeam?.legalRepresentativeEmail || ''}
                      onChange={(e) => handleQualityChange('legalRepresentativeEmail', e.target.value)}
                      placeholder={locale === 'tr' ? 'Örn: mudur@okul.k12.tr' : 'e.g. principal@school.edu'}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>📋</span> {locale === 'tr' ? 'Erasmus Koordinatörü / Temas Kişisi' : 'Erasmus Coordinator / Contact Person'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {locale === 'tr' ? 'Ad Soyad' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.coordinatorName || ''}
                      onChange={(e) => handleQualityChange('coordinatorName', e.target.value)}
                      placeholder={locale === 'tr' ? 'Örn: Zeynep Kaya' : 'e.g. Jane Smith'}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {locale === 'tr' ? 'Görevi' : 'Role / Position'}
                    </label>
                    <input
                      type="text"
                      value={formData.qualityTeam?.coordinatorRole || ''}
                      onChange={(e) => handleQualityChange('coordinatorRole', e.target.value)}
                      placeholder={locale === 'tr' ? 'Örn: Proje Koordinatörü' : 'e.g. Project Coordinator'}
                      className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      {locale === 'tr' ? 'E-Posta' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.qualityTeam?.coordinatorEmail || ''}
                      onChange={(e) => handleQualityChange('coordinatorEmail', e.target.value)}
                      placeholder={locale === 'tr' ? 'Örn: koordinasyon@okul.k12.tr' : 'e.g. coordinator@school.edu'}
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
                    {locale === 'tr' ? 'Toplam Mesleki Öğrenci Sayısı' : 'Total VET Learners Count'}
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
                    {locale === 'tr' ? 'Öğretici Personel Sayısı' : 'Teaching Staff Count'}
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
                    {locale === 'tr' ? 'Mesleki Eğitim Deneyimi (Yıl)' : 'VET Experience (Years)'}
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
                  {locale === 'tr' ? 'Öğrenici Profili ve Yaş Grubu Özeti' : 'Learner Profile & Age Group Summary'}
                </label>
                <textarea
                  rows={3}
                  value={formData.learnerProfileSummary || ''}
                  onChange={(e) => handleTextChange('learnerProfileSummary', e.target.value)}
                  placeholder={locale === 'tr' ? 'Örn: 15-18 yaş arası mesleki ve teknik lise bilişim/otomasyon öğrencileri' : 'e.g. 15-18 age group vocational high school IT / automation students'}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-900 focus:ring-2 focus:ring-blue-600 leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: QUALITY */}
          {activeTab === 'quality' && (
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                {locale === 'tr'
                  ? 'KA120 akreditasyonunda taahhüt ettiğiniz Erasmus Kalite Standartları ve ilkeleri. Bu içerikler KA121 hibe talebi metinlerinde doğrudan referans alınacaktır.'
                  : 'Erasmus Quality Standards and principles committed in your KA120 accreditation. These will be referenced in KA121 grant request narratives.'}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Kapsayıcılık ve Fırsat Eşitliği Yaklaşımı (Inclusion)' : 'Inclusion & Opportunity Equality Approach'}
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
                  {locale === 'tr' ? 'Yeşil ve Çevresel Sürdürülebilirlik (Environmental Sustainability)' : 'Green & Environmental Sustainability'}
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
                  {locale === 'tr' ? 'Dijital Eğitim ve Çevrim İçi Araçlar (Digital Tools)' : 'Digital Education & Online Tools'}
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
                  {locale === 'tr' ? 'İzleme, Mentörlük ve Faaliyet Yönetimi' : 'Monitoring, Mentorship & Activity Management'}
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
                  {locale === 'tr' ? 'Sonuçların Kurum Müfredatına ve Atölyelere Entegrasyonu' : 'Integration of Results into Curriculum & Workshops'}
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
                {locale === 'tr'
                  ? 'KA120 Erasmus Planınızda yer alan onaylı hedefler ve kurumsal ihtiyaçlar.'
                  : 'Approved objectives and institutional needs in your KA120 Erasmus Plan.'}
              </div>

              {/* Objectives */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>
                    {locale === 'tr'
                      ? `🎯 Erasmus Planı Hedefleri (${formData.objectives?.length || 0})`
                      : `🎯 Erasmus Plan Objectives (${formData.objectives?.length || 0})`}
                  </span>
                </h3>

                {(!formData.objectives || formData.objectives.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">
                    {locale === 'tr' ? 'Belgeden özel bir hedef listesi okunamadı.' : 'No specific objectives list could be read from document.'}
                  </p>
                ) : (
                  formData.objectives.map((obj, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                      <div className="text-[11px] font-bold text-blue-700">
                        {locale === 'tr' ? `Hedef #${idx + 1}` : `Objective #${idx + 1}`}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          {locale === 'tr' ? 'Hedef Başlığı' : 'Objective Title'}
                        </label>
                        <input
                          type="text"
                          value={obj.title || ''}
                          onChange={(e) => handleObjectiveChange(idx, 'title', e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {locale === 'tr' ? 'Başarı Göstergesi' : 'Target Indicator'}
                          </label>
                          <input
                            type="text"
                            value={obj.targetIndicator || ''}
                            onChange={(e) => handleObjectiveChange(idx, 'targetIndicator', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {locale === 'tr' ? 'Ölçme Aracı' : 'Measurement Tool'}
                          </label>
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
                  {locale === 'tr'
                    ? `🔍 Kurumsal İhtiyaçlar ve Zorluklar (${formData.needs?.length || 0})`
                    : `🔍 Institutional Needs & Challenges (${formData.needs?.length || 0})`}
                </h3>

                {(!formData.needs || formData.needs.length === 0) ? (
                  <p className="text-xs text-slate-500 italic">
                    {locale === 'tr' ? 'Belgeden özel bir ihtiyaç listesi okunamadı.' : 'No specific needs list could be read from document.'}
                  </p>
                ) : (
                  formData.needs.map((need, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                      <div className="text-[11px] font-bold text-slate-700">
                        {locale === 'tr' ? `İhtiyaç #${idx + 1}` : `Need #${idx + 1}`}
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                          {locale === 'tr' ? 'İhtiyaç Başlığı' : 'Need Title'}
                        </label>
                        <input
                          type="text"
                          value={need.title || ''}
                          onChange={(e) => handleNeedChange(idx, 'title', e.target.value)}
                          className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {locale === 'tr' ? 'Dayanak / Kanıt' : 'Evidence / Justification'}
                          </label>
                          <input
                            type="text"
                            value={need.evidence || ''}
                            onChange={(e) => handleNeedChange(idx, 'evidence', e.target.value)}
                            className="w-full text-xs px-3 py-1.5 border border-slate-300 rounded bg-white text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 mb-0.5">
                            {locale === 'tr' ? 'Hedef Kitle' : 'Target Group'}
                          </label>
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
            {locale === 'tr' ? 'İptal' : 'Cancel'}
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              {locale === 'tr'
                ? 'Değişiklikleriniz onayladığınızda taslağa işlenecektir.'
                : 'Changes will be applied to the draft upon confirmation.'}
            </span>
            <button
              type="button"
              onClick={() => onConfirm(formData)}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition flex items-center gap-1.5"
            >
              <span>✓</span> {locale === 'tr' ? 'Onayla ve Taslağa Aktar' : 'Confirm and Transfer to Draft'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
