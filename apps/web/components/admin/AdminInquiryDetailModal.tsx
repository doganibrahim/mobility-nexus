'use client';

import React, { useState, useEffect } from 'react';
import { MobilityInquiry, useAppStore } from '../../lib/store';
import { useTranslation } from '../../lib/i18n';

interface AdminInquiryDetailModalProps {
  inquiry: MobilityInquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusUpdated?: (updated: MobilityInquiry) => void;
}

export default function AdminInquiryDetailModal({
  inquiry,
  isOpen,
  onClose,
  onStatusUpdated,
}: AdminInquiryDetailModalProps) {
  const { locale } = useTranslation();
  const store = useAppStore();
  const isEn = locale === 'en';

  const [selectedStatus, setSelectedStatus] = useState<MobilityInquiry['status']>('PENDING');
  const [replyNote, setReplyNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (inquiry) {
      setSelectedStatus(inquiry.status);
      setReplyNote(inquiry.hostReplyNote || '');
      setSuccessMessage(null);
    }
  }, [inquiry]);

  if (!isOpen || !inquiry) return null;

  const handleSaveStatus = async () => {
    setIsSaving(true);
    try {
      store.updateInquiryStatus(inquiry.id, selectedStatus, replyNote);
      setSuccessMessage(
        isEn
          ? 'Inquiry status and administrative note updated successfully.'
          : 'Talep durumu ve idari not basariyla guncellendi.',
      );
      if (onStatusUpdated) {
        onStatusUpdated({
          ...inquiry,
          status: selectedStatus,
          hostReplyNote: replyNote,
        });
      }
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopySummary = () => {
    const summaryText = `[ErasmusMobility Nexus - Hareketlilik Talebi]
Talep ID: ${inquiry.id}
Tarih: ${new Date(inquiry.createdAt).toLocaleDateString('tr-TR')}
Durum: ${inquiry.status}
Gonderen Okul: ${inquiry.schoolName} (${inquiry.schoolCity})
Okul OID: ${inquiry.schoolOid}
Yetkili: ${inquiry.schoolContactName || '-'} (${inquiry.schoolContactEmail || '-'})
Hedef Host: ${inquiry.hostName} (${inquiry.hostCountry})
Mesleki Alan: ${inquiry.vetField} (ISCED: ${inquiry.iscedCode || '-'})
Kapsam: ${inquiry.projectType} • ${inquiry.participantCount} Ogrenci + ${inquiry.accompanyingPersonsCount} Refakatci • ${inquiry.durationDays} Gun
Tarih Araligi: ${inquiry.targetStartDate} - ${inquiry.targetEndDate}
Lojistik: Konaklama: ${inquiry.logisticsRequired?.accommodation ? 'Evet' : 'Hayir'}, Yemek: ${inquiry.logisticsRequired?.meals ? 'Evet' : 'Hayir'}, Transfer: ${inquiry.logisticsRequired?.transfers ? 'Evet' : 'Hayir'}

OKUL MESAJI:
"${inquiry.notes || '(Mesaj belirtilmedi)'}"

HOST/ADMIN YANITI:
"${replyNote || inquiry.hostReplyNote || '(Henuz yanit verilmedi)'}"
`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const getStatusBadge = (status: MobilityInquiry['status']) => {
    switch (status) {
      case 'ACCEPTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span>✅</span>
            <span>{isEn ? 'Accepted' : 'Kabul Edildi'}</span>
          </span>
        );
      case 'DECLINED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-50 text-rose-800 border border-rose-300">
            <span>❌</span>
            <span>{isEn ? 'Declined' : 'Reddedildi'}</span>
          </span>
        );
      case 'REVISED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-50 text-indigo-800 border border-indigo-300">
            <span>🔄</span>
            <span>{isEn ? 'Revision Requested' : 'Revizyon Istendi'}</span>
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-300">
            <span>⏳</span>
            <span>{isEn ? 'Pending Review' : 'Onay Bekliyor'}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white border-2 border-slate-300 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar (Official Navy Theme) */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-lg shadow-xs">
              📩
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white tracking-tight m-0">
                  {isEn ? 'Mobility Placement Inquiry Details' : 'Hareketlilik Eslestirme Talebi & Mesaj Detayi'}
                </h3>
                {inquiry.isMock && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 m-0 mt-0.5">
                {isEn ? 'Inquiry ID' : 'Talep ID'}: <span className="font-mono text-slate-300">{inquiry.id}</span> • {new Date(inquiry.createdAt).toLocaleString(isEn ? 'en-US' : 'tr-TR')}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Status and Action Alert */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {isEn ? 'Current Status:' : 'Guncel Durum:'}
              </span>
              {getStatusBadge(inquiry.status)}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 shadow-2xs"
              >
                <span>{copied ? '✓' : '📋'}</span>
                <span>{copied ? (isEn ? 'Copied!' : 'Kopyalandi!') : (isEn ? 'Copy Summary' : 'Ozeti Kopyala')}</span>
              </button>
            </div>
          </div>

          {successMessage && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-2">
              <span>✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* 1. Okulun Yazdigi Asil Mesaj (Primary Focus) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
                <span>💬</span>
                <span>{isEn ? 'School Inquiry Message / Notes' : 'Okulun Gonderdigi Talep Mesaji ve Notlar'}</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                {inquiry.schoolContactName || inquiry.schoolName} tarafindan yazildi
              </span>
            </div>
            <div className="p-4 bg-blue-50/50 border-2 border-blue-200 rounded-xl text-slate-900 leading-relaxed text-sm whitespace-pre-wrap shadow-2xs font-sans">
              {inquiry.notes ? (
                inquiry.notes
              ) : (
                <span className="italic text-slate-400">
                  {isEn ? 'No message or specific notes provided.' : 'Ozel bir mesaj veya aciklama iletilmemis.'}
                </span>
              )}
            </div>
          </div>

          {/* 2. Host veya Yonetici Yaniti */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏢</span>
              <span>{isEn ? 'Host / Admin Response Note' : 'Ev Sahibi (Host) / Yonetici Yanit Mesaji'}</span>
            </span>
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 leading-relaxed text-sm whitespace-pre-wrap">
              {inquiry.hostReplyNote ? (
                inquiry.hostReplyNote
              ) : (
                <span className="italic text-slate-500">
                  {isEn ? 'No reply message has been submitted yet.' : 'Henuz bir yanit mesaji yazilmamis.'}
                </span>
              )}
            </div>
          </div>

          {/* 3. Kurumlar Karsilastirma Tablosu (Gonderen Okul & Hedef Host) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gonderen Okul */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="text-base">🏛️</span>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider m-0">
                  {isEn ? 'Sending School (Turkiye)' : 'Gonderen Kurum (Turkiye)'}
                </h4>
              </div>
              <div className="text-xs space-y-1.5 pt-1">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{inquiry.schoolName}</span>
                  <span className="text-slate-500">{inquiry.schoolCity}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-slate-500 font-medium">OID:</span>
                  <span className="font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {inquiry.schoolOid}
                  </span>
                </div>
                <div className="pt-1 text-slate-600">
                  <div><span className="font-medium text-slate-500">{isEn ? 'Contact' : 'Yetkili'}:</span> {inquiry.schoolContactName || '-'}</div>
                  <div><span className="font-medium text-slate-500">{isEn ? 'Email' : 'E-posta'}:</span> <a href={`mailto:${inquiry.schoolContactEmail}`} className="text-blue-700 hover:underline">{inquiry.schoolContactEmail || '-'}</a></div>
                </div>
              </div>
            </div>

            {/* Hedef Host */}
            <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="text-base">🏢</span>
                <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider m-0">
                  {isEn ? 'Target Host Organisation (Europe)' : 'Hedef Ev Sahibi Kurum (Avrupa)'}
                </h4>
              </div>
              <div className="text-xs space-y-1.5 pt-1">
                <div>
                  <span className="font-bold text-slate-900 text-sm block">{inquiry.hostName}</span>
                  <span className="text-slate-500">{isEn ? 'Country' : 'Ulke'}: {inquiry.hostCountry}</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-slate-500 font-medium">{isEn ? 'Host ID' : 'Host Kodu'}:</span>
                  <span className="font-mono text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {inquiry.hostId}
                  </span>
                </div>
                <div className="pt-1 text-slate-600">
                  <div><span className="font-medium text-slate-500">{isEn ? 'VET Field' : 'Mesleki Alan'}:</span> {inquiry.vetField}</div>
                  {inquiry.iscedCode && (
                    <div><span className="font-medium text-slate-500">ISCED:</span> {inquiry.iscedCode}</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Hareketlilik & Lojistik Detaylari */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider m-0 flex items-center gap-1.5">
              <span>📋</span>
              <span>{isEn ? 'Mobility Scope and Logistical Service Requirements' : 'Hareketlilik Kapsamı ve Lojistik Hizmet Talepleri'}</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{isEn ? 'Project Type' : 'Proje Turu'}</span>
                <span className="font-black text-slate-900 text-sm">{inquiry.projectType}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{isEn ? 'Participants' : 'Katilimci Sayisi'}</span>
                <span className="font-black text-slate-900 text-sm">
                  {inquiry.participantCount} {isEn ? 'Learners' : 'Ogrenci'} {inquiry.accompanyingPersonsCount > 0 ? `+ ${inquiry.accompanyingPersonsCount} ${isEn ? 'Staff' : 'Refakatci'}` : ''}
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{isEn ? 'Duration' : 'Staj Suresi'}</span>
                <span className="font-black text-slate-900 text-sm">{inquiry.durationDays} {isEn ? 'Days' : 'Gun'}</span>
              </div>
              <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                <span className="text-slate-500 block">{isEn ? 'Target Dates' : 'Tarih Araligi'}</span>
                <span className="font-bold text-slate-900 text-[11px]">{inquiry.targetStartDate} / {inquiry.targetEndDate}</span>
              </div>
            </div>

            {/* Lojistik Rozetleri */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium mr-1">{isEn ? 'Logistics Needed:' : 'Istenen Destekler:'}</span>
              <span
                className={`px-2.5 py-1 rounded-md font-bold text-[11px] border ${
                  inquiry.logisticsRequired?.accommodation
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                }`}
              >
                🏨 {isEn ? 'Accommodation' : 'Konaklama'}
              </span>
              <span
                className={`px-2.5 py-1 rounded-md font-bold text-[11px] border ${
                  inquiry.logisticsRequired?.meals
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                }`}
              >
                🍽️ {isEn ? 'Meals' : 'Yemek Destegi'}
              </span>
              <span
                className={`px-2.5 py-1 rounded-md font-bold text-[11px] border ${
                  inquiry.logisticsRequired?.transfers
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border-slate-200 line-through'
                }`}
              >
                🚐 {isEn ? 'Local Transfers' : 'Yerel Transferler'}
              </span>
            </div>
          </div>

          {/* 5. Yonetici Mudahalesi / Durum Guncelleme Alani */}
          <div className="p-4 bg-slate-100 border-2 border-slate-300 rounded-xl space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider m-0 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>{isEn ? 'Administrative Override & Status Management' : 'Yonetici Mudahalesi & Durum Guncelleme'}</span>
            </h4>
            <p className="text-xs text-slate-600 m-0">
              {isEn
                ? 'As a platform administrator, you can update the status of this inquiry or append an official institutional reply note.'
                : 'Platform yoneticisi olarak bu talebin durumunu degistirebilir veya resmi kurumsal yanit notunu guncelleyebilirsiniz.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEn ? 'Set New Status' : 'Yeni Durum Belirle'}
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                >
                  <option value="PENDING">⏳ {isEn ? 'Pending (Onay Bekliyor)' : 'Onay Bekliyor (PENDING)'}</option>
                  <option value="ACCEPTED">✅ {isEn ? 'Accepted (Kabul Edildi)' : 'Kabul Edildi (ACCEPTED)'}</option>
                  <option value="REVISED">🔄 {isEn ? 'Revision Requested (Revizyon Istendi)' : 'Revizyon Istendi (REVISED)'}</option>
                  <option value="DECLINED">❌ {isEn ? 'Declined (Reddedildi)' : 'Reddedildi (DECLINED)'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isEn ? 'Host / Admin Reply Note' : 'Kurumsal Yanit / Aciklama Notu'}
                </label>
                <textarea
                  value={replyNote}
                  onChange={(e) => setReplyNote(e.target.value)}
                  rows={3}
                  placeholder={isEn ? 'Enter response note for the school...' : 'Okul icin yanit aciklamasi giriniz...'}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSaveStatus}
                disabled={isSaving}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
              >
                {isSaving ? (
                  <span>{isEn ? 'Saving...' : 'Kaydediliyor...'}</span>
                ) : (
                  <>
                    <span>💾</span>
                    <span>{isEn ? 'Save Changes' : 'Degisiklikleri Kaydet'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500">
            {isEn ? 'ErasmusMobility Inquiries & Placement Hub' : 'ErasmusMobility Eslestirme ve Talep Havuzu'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-lg border border-slate-300 transition-colors"
          >
            {isEn ? 'Close' : 'Kapat'}
          </button>
        </div>
      </div>
    </div>
  );
}
