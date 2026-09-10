'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api-client';

interface AdminVerificationQueueModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminVerificationQueueModal({
  isOpen,
  onClose,
}: AdminVerificationQueueModalProps) {
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedHost, setSelectedHost] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    taxRegistrationVerified: false,
    physicalWorkplaceVerified: false,
    occupationalSafetyStandards: false,
    mentorAssigned: false,
    emergencyProtocolInPlace: false,
    insuranceCoverageConfirmed: false,
    learningAgreementCompliant: false,
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    async function loadQueue() {
      setIsLoading(true);
      try {
        const data = await apiClient.getVerificationQueue();
        setQueue(data);
        if (data.length > 0 && !selectedHost) {
          setSelectedHost(data[0]);
        }
      } catch (err) {
        console.error('Queue load error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadQueue();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleDecision = async (status: 'VERIFIED' | 'NEEDS_UPDATE' | 'REJECTED') => {
    if (!selectedHost) return;
    setIsProcessing(true);
    setFeedbackMsg(null);

    try {
      await apiClient.reviewHostVerification(selectedHost.id, {
        status,
        reviewerNotes,
        criteriaChecklist: checklist,
      });

      setFeedbackMsg(`Kurum başarıyla "${status}" durumuna getirildi.`);

      // Update local queue
      const updatedQueue = queue.map((item) =>
        item.id === selectedHost.id ? { ...item, verificationStatus: status } : item,
      );
      setQueue(updatedQueue);
      setSelectedHost({ ...selectedHost, verificationStatus: status });
    } catch (err: any) {
      setFeedbackMsg(`İşlem hatası: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
              🛡️
            </div>
            <div>
              <h2 className="text-base font-bold text-white m-0">
                Platform Yönetici Paneli • Ev Sahibi Doğrulama Havuzu (Admin Verification Queue)
              </h2>
              <p className="text-slate-400 text-xs mt-0.5 m-0">
                Yüklenen resmi belgeleri inceleyin ve 15 kriterli kalite kontrol listesini onaylayın.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Layout: Left list, Right review */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Sol Panel: Liste */}
          <div className="w-full md:w-80 border-r border-slate-200 bg-slate-50 overflow-y-auto p-4 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
              <span>Talepler ({queue.length})</span>
              <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded-sm">Canlı</span>
            </div>

            {isLoading ? (
              <div className="text-xs text-slate-500 p-4 text-center">Yükleniyor...</div>
            ) : queue.length === 0 ? (
              <div className="text-xs text-slate-500 p-4 text-center bg-white rounded-xl border border-slate-200">
                Bekleyen başvuru bulunmuyor.
              </div>
            ) : (
              queue.map((h) => {
                const isSelected = selectedHost?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => {
                      setSelectedHost(h);
                      setReviewerNotes(h.reviewerNotes || '');
                      setFeedbackMsg(null);
                    }}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-blue-600 shadow-sm ring-1 ring-blue-600'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate max-w-[170px]">
                        {h.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          h.verificationStatus === 'VERIFIED'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : h.verificationStatus === 'UNDER_REVIEW'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {h.verificationStatus}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                      <span>{h.countryCode}</span>
                      <span>•</span>
                      <span>{h.oid || 'OID Yok'}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sağ Panel: İnceleme ve Karar Ekranı */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {selectedHost ? (
              <div className="space-y-6">
                {feedbackMsg && (
                  <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs font-semibold">
                    {feedbackMsg}
                  </div>
                )}

                {/* Kurum Üst Bilgi Kartı */}
                <div className="flex items-start justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 m-0">
                      {selectedHost.name}
                    </h3>
                    <div className="text-xs text-slate-600 mt-1 flex items-center gap-3">
                      <span><strong>OID:</strong> {selectedHost.oid}</span>
                      <span>•</span>
                      <span><strong>Tür:</strong> {selectedHost.organisationType}</span>
                      <span>•</span>
                      <span><strong>Konum:</strong> {selectedHost.city}, {selectedHost.countryCode}</span>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-slate-200 shadow-2xs">
                    Durum: {selectedHost.verificationStatus}
                  </span>
                </div>

                {/* 1. Resmi Bilgiler & Evraklar (Admin Only) */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span>📑</span>
                    <span>Admin Only Resmi Bilgiler & Evraklar</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-slate-500 font-semibold block">Sicil Numarası:</span>
                      <span className="font-mono text-slate-900 font-bold text-sm mt-0.5 block">
                        {selectedHost.registrationNumber || 'Henüz Girilmedi'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-slate-500 font-semibold block">Vergi / KDV Numarası:</span>
                      <span className="font-mono text-slate-900 font-bold text-sm mt-0.5 block">
                        {selectedHost.taxVatNumber || 'Henüz Girilmedi'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-slate-500 font-semibold block">7/24 Acil Durum Kontağı:</span>
                      <span className="text-slate-900 font-bold mt-0.5 block">
                        {selectedHost.emergencyContactPerson || 'Belirtilmedi'}
                      </span>
                      <span className="font-mono text-slate-600 block">
                        {selectedHost.emergencyContactPhone || '-'}
                      </span>
                    </div>

                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                      <span className="text-slate-500 font-semibold block">İrtibat Yetkilisi:</span>
                      <span className="text-slate-900 font-bold mt-0.5 block">
                        {selectedHost.contactPerson}
                      </span>
                      <span className="text-slate-600 block">
                        {selectedHost.contactEmail}
                      </span>
                    </div>
                  </div>

                  {/* Yüklenen PDF Evraklar */}
                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-slate-700 block">Yüklenen Resmi Dosyalar:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedHost.registrationDocumentUrl && (
                        <a
                          href={selectedHost.registrationDocumentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <span>📄 Kuruluş Sicil Belgesi</span>
                          <span>↗</span>
                        </a>
                      )}

                      {(selectedHost.participantEvidenceUrls || []).map((url: string, idx: number) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                        >
                          <span>📜 Katılımcı Kanıtı #{idx + 1}</span>
                          <span>↗</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. 15 Kriterli Kalite Kontrol Listesi */}
                <div className="border border-slate-200 rounded-xl p-5 bg-white space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
                    <span>🛡️</span>
                    <span>15+ Kalite Kriteri Kontrol Listesi</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                    {[
                      { key: 'taxRegistrationVerified', label: 'Vergi ve Yasal Tüzel Kuruluş Doğrulandı' },
                      { key: 'physicalWorkplaceVerified', label: 'Fiziksel İşyeri / Eğitim Alanı Uygun' },
                      { key: 'occupationalSafetyStandards', label: 'İş Sağlığı ve Güvenliği (OHS) Standartları' },
                      { key: 'mentorAssigned', label: 'İngilizce Bilen Mesleki Mentor Atandı' },
                      { key: 'emergencyProtocolInPlace', label: '7/24 Acil Durum Protokolü Hazır' },
                      { key: 'insuranceCoverageConfirmed', label: 'Sigorta Kapsamı ve Prosedürleri Teyit Edildi' },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-2.5 p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={checklist[item.key] || false}
                          onChange={(e) =>
                            setChecklist({ ...checklist, [item.key]: e.target.checked })
                          }
                          className="rounded-sm text-blue-600"
                        />
                        <span className="text-slate-800 font-medium">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. İnceleme Notu ve Karar Butonları */}
                <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                      Yönetici İnceleme Notu (Kuruma iletilir veya kayıt altına alınır)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Örn: Sicil gazetesi ve vergi levhası teyit edildi. Türkiye grubu referansları olumlu."
                      value={reviewerNotes}
                      onChange={(e) => setReviewerNotes(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleDecision('REJECTED')}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                    >
                      Reddet
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleDecision('NEEDS_UPDATE')}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors"
                    >
                      Eksik Evrak İste (NEEDS_UPDATE)
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() => handleDecision('VERIFIED')}
                      className="px-6 py-2 rounded-lg text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 shadow-sm transition-all"
                    >
                      {isProcessing ? 'İşleniyor...' : '✓ Onayla & "Verified Partner" Rozeti Ver'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-500">
                Lütfen incelemek için soldaki listeden bir kurum seçiniz.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
