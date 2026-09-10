'use client';

import React, { useState } from 'react';
import { apiClient } from '../../lib/api-client';

interface HostVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  host: any;
  onSuccess: (updatedHost: any) => void;
}

export default function HostVerificationModal({
  isOpen,
  onClose,
  host,
  onSuccess,
}: HostVerificationModalProps) {
  const [registrationNumber, setRegistrationNumber] = useState(host?.registrationNumber || '');
  const [registrationDocumentUrl, setRegistrationDocumentUrl] = useState(
    host?.registrationDocumentUrl || '',
  );
  const [taxVatNumber, setTaxVatNumber] = useState(host?.taxVatNumber || '');
  const [emergencyContactPerson, setEmergencyContactPerson] = useState(
    host?.emergencyContactPerson || '',
  );
  const [emergencyContactPhone, setEmergencyContactPhone] = useState(
    host?.emergencyContactPhone || '',
  );
  const [contactDirectPhone, setContactDirectPhone] = useState(
    host?.contactDirectPhone || host?.contactPhone || '',
  );
  const [contactWhatsapp, setContactWhatsapp] = useState(host?.contactWhatsapp || '');
  const [participantEvidenceUrls, setParticipantEvidenceUrls] = useState<string[]>(
    host?.participantEvidenceUrls || [],
  );
  const [sampleDocumentsUrls, setSampleDocumentsUrls] = useState<string[]>(
    host?.sampleDocumentsUrls || [],
  );

  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentStatus = host?.verificationStatus || 'PENDING';

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'regDoc' | 'evidence' | 'sampleDoc',
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(type);
    setStatusMessage(null);

    try {
      const folder = type === 'regDoc' ? 'documents' : type === 'evidence' ? 'evidence' : 'samples';
      const result = await apiClient.uploadFile(file, folder, true);

      if (type === 'regDoc') {
        setRegistrationDocumentUrl(result.url);
      } else if (type === 'evidence') {
        setParticipantEvidenceUrls([...participantEvidenceUrls, result.url]);
      } else if (type === 'sampleDoc') {
        setSampleDocumentsUrls([...sampleDocumentsUrls, result.url]);
      }

      setStatusMessage(`✅ ${file.name} güvenli şekilde yüklendi (Admin Only).`);
    } catch {
      setStatusMessage('❌ Dosya yükleme sırasında hata oluştu.');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!registrationNumber || !registrationDocumentUrl || !taxVatNumber || !emergencyContactPerson || !emergencyContactPhone) {
      setStatusMessage('Lütfen zorunlu tüm alanları ve resmi evrakları doldurunuz.');
      return;
    }

    if (participantEvidenceUrls.length === 0) {
      setStatusMessage('Lütfen beyan edilen katılımcı sayılarını destekleyen en az bir kanıt belgesi ekleyiniz.');
      return;
    }

    setIsSaving(true);
    setStatusMessage(null);

    try {
      const payload = {
        registrationNumber: registrationNumber.trim(),
        registrationDocumentUrl: registrationDocumentUrl.trim(),
        taxVatNumber: taxVatNumber.trim(),
        emergencyContactPerson: emergencyContactPerson.trim(),
        emergencyContactPhone: emergencyContactPhone.trim(),
        contactDirectPhone: contactDirectPhone.trim() || undefined,
        contactWhatsapp: contactWhatsapp.trim() || undefined,
        participantEvidenceUrls,
        sampleDocumentsUrls,
      };

      const { data } = await apiClient.submitHostVerification(host.id, payload);
      onSuccess(data);
      onClose();
    } catch (err: any) {
      setStatusMessage(`Hata: ${err.message || 'Doğrulama evrakları gönderilemedi.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-1">
              <span>Aşama 3</span>
              <span>•</span>
              <span>Admin Only & Resmi Doğrulama</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight m-0 text-white">
              Kurumsal Doğrulama & KYC Başvurusu
            </h2>
            <p className="text-slate-400 text-xs mt-0.5 m-0">
              "Onaylı Ev Sahibi (Verified Partner)" rozeti almak ve okullarla resmi anlaşma yapabilmek için evraklarınızı iletin.
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
        <div className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* Trust Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
            <span className="text-lg leading-none mt-0.5">🔒</span>
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Admin Only Gizlilik Güvencesi</span>
              Bu bölümde yükleyeceğiniz sicil, vergi ve acil durum irtibat bilgileri yalnızca platform denetçileri tarafından incelenir. Kamusal profilinizde veya üçüncü taraflarla kesinlikle paylaşılmaz.
            </div>
          </div>

          {/* Mevcut Durum Kartı */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 font-semibold block">Mevcut Doğrulama Durumu</span>
              <span className="text-sm font-bold text-slate-900 mt-0.5 block">
                {currentStatus === 'VERIFIED'
                  ? '🟢 Doğrulanmış Partner (Verified Partner)'
                  : currentStatus === 'UNDER_REVIEW'
                    ? '🟡 İnceleme Aşamasında (Under Review)'
                    : currentStatus === 'NEEDS_UPDATE'
                      ? '🟠 Eksik Belge / Güncelleme İsteniyor'
                      : '⚪ Başvuru Bekleniyor (Pending)'}
              </span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
              {currentStatus}
            </span>
          </div>

          {statusMessage && (
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
              {statusMessage}
            </div>
          )}

          <form id="verification-form" onSubmit={handleSubmit} className="space-y-6">
            {/* 1. TÜZEL KİŞİLİK VE VERGİ BİLGİLERİ */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <span className="text-base">📑</span>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  1. Tüzel Kuruluş ve Vergi Bilgileri
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Kuruluş / Sicil Numarası <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: HRB 123456 B"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Ulusal Vergi No / EU VAT <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: DE123456789"
                      value={taxVatNumber}
                      onChange={(e) => setTaxVatNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all font-mono"
                    />
                  </div>
                </div>

                {/* Sicil Belgesi Yükleme */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                    Resmi Sicil Tasdiknamesi / Kuruluş Belgesi (PDF) <span className="text-rose-500">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500 mb-3">
                    Kurumun yasal varlığını kanıtlayan güncel ticaret sicil gazetesi, oda kaydı veya kuruluş senedi.
                  </p>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs">
                      {isUploading === 'regDoc'
                        ? 'Yükleniyor...'
                        : registrationDocumentUrl
                          ? 'Belge Yüklendi (Değiştir)'
                          : 'PDF Belge Yükle'}
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, 'regDoc')}
                        className="hidden"
                      />
                    </label>
                    {registrationDocumentUrl && (
                      <a
                        href={registrationDocumentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Yüklenen Belgeyi Önizle ↗
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. 7/24 ACİL DURUM VE İRTİBAT PROTOKOLÜ */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <span className="text-base">🚨</span>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  2. 7/24 Acil Durum ve Operasyonel İletişim
                </h3>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Acil Durum İrtibat Kişisi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Dr. Klaus Weber"
                      value={emergencyContactPerson}
                      onChange={(e) => setEmergencyContactPerson(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      7/24 Acil Durum Telefonu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Örn: +49 170 9876543"
                      value={emergencyContactPhone}
                      onChange={(e) => setEmergencyContactPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Yetkilinin Doğrudan Telefonu
                    </label>
                    <input
                      type="tel"
                      placeholder="Örn: +49 30 98765432"
                      value={contactDirectPhone}
                      onChange={(e) => setContactDirectPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Operasyonel WhatsApp Numarası
                    </label>
                    <input
                      type="tel"
                      placeholder="Örn: +49 176 12345678"
                      value={contactWhatsapp}
                      onChange={(e) => setContactWhatsapp(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. KATILIMCI KANIT EVRAKLARI */}
            <div>
              <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                <span className="text-base">📜</span>
                <h3 className="text-xs font-bold text-slate-900 tracking-wider uppercase">
                  3. Katılımcı Sayısı Kanıt Evrakları
                </h3>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Katılımcı Sayılarını Destekleyen Resmi Kanıt Belgeleri <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Daha önce ağırladığınız öğrencilere verilen katılım sertifikaları, sözleşmeler veya anonimleştirilmiş proje sonuç raporları.
                </p>

                <label className="inline-block cursor-pointer px-4 py-2 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs">
                  {isUploading === 'evidence' ? 'Yükleniyor...' : '+ Kanıt Belgesi Ekle (PDF)'}
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => handleFileUpload(e, 'evidence')}
                    className="hidden"
                  />
                </label>

                {participantEvidenceUrls.length > 0 && (
                  <div className="space-y-1 pt-2">
                    <span className="text-[11px] font-bold text-slate-700">Yüklenen Kanıt Evrakları:</span>
                    <ul className="space-y-1 m-0 p-0 list-none">
                      {participantEvidenceUrls.map((url, idx) => (
                        <li key={idx} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200">
                          <span className="truncate max-w-xs text-slate-700 font-mono">
                            📄 Kanıt Belgesi #{idx + 1}
                          </span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            Görüntüle ↗
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Evraklarınız yüklendiğinde kurum statünüz <strong>"İncelemede"</strong> olarak işaretlenir.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-white transition-colors"
            >
              Kapat
            </button>
            <button
              type="submit"
              form="verification-form"
              disabled={isSaving}
              className="px-6 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all"
            >
              {isSaving ? 'Gönderiliyor...' : 'Doğrulamaya Gönder'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
