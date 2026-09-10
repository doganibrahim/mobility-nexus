'use client';

import React, { useState } from 'react';
import { apiClient } from '../../lib/api-client';

interface HostPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: any;
  onSuccess: (updatedHost: any) => void;
}

export default function HostPortfolioModal({
  isOpen,
  onClose,
  host,
  onSuccess,
}: HostPortfolioModalProps) {
  const [operationalAddress, setOperationalAddress] = useState(host?.operationalAddress || '');
  const [shortDescription, setShortDescription] = useState(host?.shortDescription || '');
  const [logoUrl, setLogoUrl] = useState(host?.logoUrl || '');
  const [detailedProfileUrl, setDetailedProfileUrl] = useState(host?.detailedProfileUrl || '');
  const [contactLinkedin, setContactLinkedin] = useState(host?.contactLinkedin || '');
  const [contactPhotoUrl, setContactPhotoUrl] = useState(host?.contactPhotoUrl || '');
  const [turkeyContactPerson, setTurkeyContactPerson] = useState(host?.turkeyContactPerson || '');

  // Erasmus+ Experience
  const [yearsOfExperience, setYearsOfExperience] = useState<number>(host?.yearsOfExperience || 0);
  const [totalParticipantsHosted, setTotalParticipantsHosted] = useState<number>(
    host?.totalParticipantsHosted || 0,
  );
  const [groupsHostedLast3Years, setGroupsHostedLast3Years] = useState<number>(
    host?.groupsHostedLast3Years || 0,
  );
  const [turkishGroupsHosted, setTurkishGroupsHosted] = useState<number>(
    host?.turkishGroupsHosted || 0,
  );
  const [turkishParticipantsHosted, setTurkishParticipantsHosted] = useState<number>(
    host?.turkishParticipantsHosted || 0,
  );
  const [sendingCountries, setSendingCountries] = useState<string>(
    (host?.sendingCountries || ['TR', 'ES', 'IT']).join(', '),
  );
  const [hasKa121, setHasKa121] = useState<boolean>(host?.hasKa121 ?? true);
  const [hasKa122, setHasKa122] = useState<boolean>(host?.hasKa122 ?? true);
  const [hasVetLearner, setHasVetLearner] = useState<boolean>(host?.hasVetLearner ?? true);
  const [hasStaffMobility, setHasStaffMobility] = useState<boolean>(host?.hasStaffMobility ?? true);
  const [nationalAgencyExperience, setNationalAgencyExperience] = useState(
    host?.nationalAgencyExperience || '',
  );
  const [sampleMobilityProgrammeUrl, setSampleMobilityProgrammeUrl] = useState(
    host?.sampleMobilityProgrammeUrl || '',
  );

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Word counter for 150 words limit
  const wordCount = shortDescription.trim() ? shortDescription.trim().split(/\s+/).length : 0;
  const isWordCountExceeded = wordCount > 150;

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: 'logo' | 'brochure' | 'sampleProgramme' | 'photo',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(fieldKey);
    setStatusMessage(null);

    try {
      const folder = fieldKey === 'logo' || fieldKey === 'photo' ? 'logos' : 'documents';
      const result = await apiClient.uploadFile(file, folder, false);

      if (fieldKey === 'logo') setLogoUrl(result.url);
      else if (fieldKey === 'photo') setContactPhotoUrl(result.url);
      else if (fieldKey === 'brochure') setDetailedProfileUrl(result.url);
      else if (fieldKey === 'sampleProgramme') setSampleMobilityProgrammeUrl(result.url);

      setStatusMessage(`✅ ${file.name} başarıyla yüklendi.`);
    } catch {
      setStatusMessage('❌ Dosya yükleme sırasında hata oluştu.');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isWordCountExceeded) return;

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const countriesList = sendingCountries
        .split(',')
        .map((c) => c.trim().toUpperCase())
        .filter(Boolean);

      const payload = {
        operationalAddress: operationalAddress.trim() || undefined,
        logoUrl: logoUrl.trim() || undefined,
        shortDescription: shortDescription.trim() || undefined,
        detailedProfileUrl: detailedProfileUrl.trim() || undefined,
        contactLinkedin: contactLinkedin.trim() || undefined,
        contactPhotoUrl: contactPhotoUrl.trim() || undefined,
        turkeyContactPerson: turkeyContactPerson.trim() || undefined,
        yearsOfExperience: Number(yearsOfExperience),
        totalParticipantsHosted: Number(totalParticipantsHosted),
        groupsHostedLast3Years: Number(groupsHostedLast3Years),
        turkishGroupsHosted: Number(turkishGroupsHosted),
        turkishParticipantsHosted: Number(turkishParticipantsHosted) || undefined,
        sendingCountries: countriesList,
        hasKa121,
        hasKa122,
        hasVetLearner,
        hasStaffMobility,
        nationalAgencyExperience: nationalAgencyExperience.trim() || undefined,
        sampleMobilityProgrammeUrl: sampleMobilityProgrammeUrl.trim() || undefined,
      };

      const { data } = await apiClient.updateHostPortfolio(host.id, payload);
      onSuccess(data);
      onClose();
    } catch (err: any) {
      setStatusMessage(`Hata: ${err.message || 'Portföy güncellenemedi.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-1">
              <span>Aşama 2</span>
              <span>•</span>
              <span>Kamusal Vitrin & Portföy</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight m-0 text-white">
              Erasmus+ Deneyimi & Kurum Vitrini
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 m-0">
              Okulların kurumunuzu arama sonuçlarında filtrelemesi ve güvenle seçmesi için bilgilerinizi zenginleştirin.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
              {statusMessage}
            </div>
          )}

          <form id="portfolio-form" onSubmit={handleSave} className="space-y-8">
            {/* 1. VİTRİN VE TANITIM */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <span className="text-base">🎨</span>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  1. Kurumsal Vitrin ve Tanıtım
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Kurum Logosu */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Kurum Logosu (PNG / SVG)
                    </label>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Profil kartınızda ve resmi anlaşma çıktılarında yer alacak logo.
                    </p>
                    <div className="flex items-center gap-3">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="Logo"
                          className="w-12 h-12 object-contain rounded-lg border border-slate-200 bg-white p-1"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xl">
                          📷
                        </div>
                      )}
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs">
                        {isUploading === 'logo' ? 'Yükleniyor...' : 'Logo Seç & Yükle'}
                        <input
                          type="file"
                          accept="image/png,image/svg+xml,image/jpeg"
                          onChange={(e) => handleFileUpload(e, 'logo')}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Tanıtım Broşürü */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                      Kurumsal Profil / Broşür (PDF)
                    </label>
                    <p className="text-[11px] text-slate-500 mb-3">
                      Kurumunuzun atölye, staj ve faaliyet imkanlarını anlatan katalog.
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white flex items-center justify-center text-xl">
                        📄
                      </div>
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs">
                        {isUploading === 'brochure' ? 'Yükleniyor...' : detailedProfileUrl ? 'Broşürü Değiştir' : 'PDF Broşür Yükle'}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, 'brochure')}
                          className="hidden"
                        />
                      </label>
                      {detailedProfileUrl && (
                        <a
                          href={detailedProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:underline"
                        >
                          Önizle ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Kısa Açıklama (Maks 150 kelime) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Kurum Tanıtımı (Maksimum 150 Kelime)
                    </label>
                    <span
                      className={`text-xs font-bold ${
                        isWordCountExceeded ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      {wordCount} / 150 kelime
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Kurumunuzun sunduğu teknik altyapı, mesleki staj alanları ve katılımcı öğrencilere sağlanan mentorluk olanaklarını özetleyiniz..."
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all leading-relaxed"
                  />
                  {isWordCountExceeded && (
                    <p className="text-xs text-rose-600 mt-1 font-semibold">
                      Açıklama 150 kelime sınırını aşamaz. Lütfen metni kısaltınız.
                    </p>
                  )}
                </div>

                {/* İrtibat Yetkilisi Ek Bilgileri */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      İrtibat Yetkilisi LinkedIn Profili
                    </label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={contactLinkedin}
                      onChange={(e) => setContactLinkedin(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Türkiye İrtibat Temsilcisi (Varsa)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ahmet Yılmaz (Türkiye Koordinatörü / Ankara)"
                      value={turkeyContactPerson}
                      onChange={(e) => setTurkeyContactPerson(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. ERASMUS+ DENEYİM METRİKLERİ */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <span className="text-base">🇪🇺</span>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  2. Erasmus+ Deneyim Metrikleri ve Geçmiş
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Erasmus+ Deneyim Yılı <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={yearsOfExperience}
                      onChange={(e) => setYearsOfExperience(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Toplam Ağırlanan Katılımcı <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={totalParticipantsHosted}
                      onChange={(e) => setTotalParticipantsHosted(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Son 3 Yılda Ağırlanan Grup <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={groupsHostedLast3Years}
                      onChange={(e) => setGroupsHostedLast3Years(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Türkiye'den Ağırlanan Grup <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={turkishGroupsHosted}
                      onChange={(e) => setTurkishGroupsHosted(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Türkiye'den Katılımcı Sayısı
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={turkishParticipantsHosted}
                      onChange={(e) => setTurkishParticipantsHosted(Number(e.target.value) || 0)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Hizmet Verilen Gönderici Ülkeler
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: TR, ES, IT, DE, PL"
                      value={sendingCountries}
                      onChange={(e) => setSendingCountries(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all uppercase font-mono"
                    />
                  </div>
                </div>

                {/* Faaliyet Türleri Kutuları */}
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Faaliyet ve Program Deneyimi
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasKa121}
                        onChange={(e) => setHasKa121(e.target.checked)}
                        className="rounded-sm text-blue-600"
                      />
                      <span className="font-semibold text-slate-800">
                        KA121 Akredite Hareketlilik Projeleri
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasKa122}
                        onChange={(e) => setHasKa122(e.target.checked)}
                        className="rounded-sm text-blue-600"
                      />
                      <span className="font-semibold text-slate-800">
                        KA122 Kısa Dönemli Hareketlilik Projeleri
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasVetLearner}
                        onChange={(e) => setHasVetLearner(e.target.checked)}
                        className="rounded-sm text-blue-600"
                      />
                      <span className="font-semibold text-slate-800">
                        VET Öğrenci Staj ve Beceri Eğitimi
                      </span>
                    </label>

                    <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasStaffMobility}
                        onChange={(e) => setHasStaffMobility(e.target.checked)}
                        className="rounded-sm text-blue-600"
                      />
                      <span className="font-semibold text-slate-800">
                        Öğretmen / Personel İşbaşı Gözlem (Job Shadowing)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Ulusal Ajans Deneyimi ve Örnek Program */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Birlikte Çalışılan Ulusal Ajanslar
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Türkiye Ulusal Ajansı, DAAD, SEPIE"
                      value={nationalAgencyExperience}
                      onChange={(e) => setNationalAgencyExperience(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Örnek Hareketlilik Programı (PDF) <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors text-center">
                        {isUploading === 'sampleProgramme'
                          ? 'Yükleniyor...'
                          : sampleMobilityProgrammeUrl
                            ? 'Program Yüklendi (Değiştir)'
                            : 'Örnek Program PDF Seç'}
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload(e, 'sampleProgramme')}
                          className="hidden"
                        />
                      </label>
                      {sampleMobilityProgrammeUrl && (
                        <a
                          href={sampleMobilityProgrammeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-blue-600 hover:underline px-2"
                        >
                          Önizle ↗
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Aşama 2 tamamlandığında profil doluluğunuz <strong>%75-80</strong> seviyesine ulaşır.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-white transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              form="portfolio-form"
              disabled={isSaving || isWordCountExceeded}
              className="px-6 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-all"
            >
              {isSaving ? 'Kaydediliyor...' : 'Portföyü Kaydet & Güncelle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
