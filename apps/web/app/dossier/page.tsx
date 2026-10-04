'use client';

import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import { useTranslation } from '@/lib/i18n';
import {
  MobilityDossier,
  DossierDocument,
  ExportLogRecord,
} from '@mobility-nexus/types';
import { DossierDownloadCard } from '@/components/export/DossierDownloadCard';
import { LearningAgreementExportModal } from '@/components/export/LearningAgreementExportModal';
import { EuropassExportModal } from '@/components/export/EuropassExportModal';
import { InterInstitutionalAgreementExportModal } from '@/components/export/InterInstitutionalAgreementExportModal';
import {
  FolderArchive,
  Download,
  CheckCircle2,
  FileText,
  Clock,
  Building2,
  Plane,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Search,
  ExternalLink,
  Layers,
  Award,
} from 'lucide-react';

export default function MobilityDossierPage() {
  const { locale } = useTranslation();

  const [dossiers, setDossiers] = useState<MobilityDossier[]>([]);
  const [selectedDossierId, setSelectedDossierId] = useState<string>('dos-01');
  const [exportLogs, setExportLogs] = useState<ExportLogRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Active modals
  const [activeModalDoc, setActiveModalDoc] = useState<DossierDocument | null>(null);
  const [isMasterExporting, setIsMasterExporting] = useState(false);

  const loadDossiersAndLogs = async () => {
    setIsLoading(true);
    try {
      const [dossiersRes, logsRes] = await Promise.all([
        fetch('/api/dossiers'),
        fetch('/api/documents/logs'),
      ]);

      if (dossiersRes.ok) {
        const dData = await dossiersRes.json();
        setDossiers(dData.data || []);
      }

      if (logsRes.ok) {
        const lData = await logsRes.json();
        setExportLogs(lData.data || []);
      }
    } catch (e) {
      console.error('Error loading dossiers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDossiersAndLogs();
  }, []);

  const selectedDossier =
    dossiers.find((d) => d.id === selectedDossierId) || dossiers[0] || null;

  // Direct export handler (calls API and triggers feedback)
  const handleDirectExport = async (doc: DossierDocument, format: 'PDF' | 'DOCX') => {
    if (!selectedDossier) return;

    let endpoint = '/api/documents/export-learning-agreement';
    if (doc.documentType === 'EUROPASS_MOBILITY') {
      endpoint = '/api/documents/export-europass';
    } else if (doc.documentType === 'INTER_INSTITUTIONAL_AGREEMENT') {
      endpoint = '/api/documents/export-inter-institutional-agreement';
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dossierId: selectedDossier.id,
          documentType: doc.documentType,
          format,
          exporterName: 'Okul Koordinatörü',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbackMessage(
          locale === 'tr'
            ? `✓ "${doc.titleTr}" başarıyla ${format} olarak ihraç edildi. İndirme kaydı güncellendi.`
            : `✓ "${doc.titleEn}" exported as ${format} successfully. Audit log updated.`
        );
        setTimeout(() => setFeedbackMessage(null), 4000);
        await loadDossiersAndLogs();
      }
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  // Master Export: One-click export for all dossier documents
  const handleMasterExport = async () => {
    if (!selectedDossier || !selectedDossier.documents) return;
    setIsMasterExporting(true);

    try {
      for (const doc of selectedDossier.documents) {
        await handleDirectExport(doc, 'PDF');
      }

      setFeedbackMessage(
        locale === 'tr'
          ? '✓ Tüm hareketlilik evrakları resmi Avrupa Komisyonu şablonuyla başarıyla ihraç edildi!'
          : '✓ All dossier documents exported successfully with official EC templates!'
      );
      setTimeout(() => setFeedbackMessage(null), 5000);
    } catch (e) {
      console.error('Master export error:', e);
    } finally {
      setIsMasterExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AppHeader />

      <main className="flex-1 pb-16">
        {/* Hero Top Banner */}
        <section className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-700 text-white border border-blue-600">
                    Erasmus+ Official Dossier Engine
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                    {locale === 'tr' ? 'İlk Yıl 100% Ücretsiz' : '100% Free First Year'}
                  </span>
                  <span className="text-xs text-slate-400">PKG-05</span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {locale === 'tr'
                    ? 'Resmi Hareketlilik Dosya ve Evrak İhraç Masası'
                    : 'Official Mobility Dossier & Formal Document Export Console'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  {locale === 'tr'
                    ? 'Onaylanan ve eşleşen tüm hareketlilikler için resmi Avrupa Komisyonu Learning Agreement, Europass Mobility ve Kurumlararası Sözleşme evraklarının doldurulmuş olarak tek tıkla dışa aktarılması.'
                    : 'Automated generation and instant one-click export of official European Commission VET Learning Agreements, Europass Mobility credentials, and bilateral agreements.'}
                </p>
              </div>

              {/* Master Bundle Export CTA */}
              <div className="shrink-0">
                <button
                  type="button"
                  onClick={handleMasterExport}
                  disabled={isMasterExporting || !selectedDossier}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isMasterExporting
                      ? locale === 'tr'
                        ? 'Tüm Evraklar Hazırlanıyor...'
                        : 'Preparing All Documents...'
                      : locale === 'tr'
                      ? 'Tüm Dosyayı Tek Tıkla İhraç Et'
                      : 'Export Full Mobility Dossier'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Global Alert Notification */}
        {feedbackMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {/* Dossier Selection & Institutional Context Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 mb-8 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <FolderArchive className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {locale === 'tr' ? 'Aktif Hareketlilik Dosyası:' : 'Active Mobility Dossier:'}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {selectedDossier?.mobilityCode} • {selectedDossier?.schoolName}
                  </h2>
                </div>
              </div>

              {/* Dossier Switcher Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">
                  {locale === 'tr' ? 'Dosya Değiştir:' : 'Switch Dossier:'}
                </span>
                <select
                  value={selectedDossierId}
                  onChange={(e) => setSelectedDossierId(e.target.value)}
                  className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600"
                >
                  {dossiers.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.mobilityCode} - {d.hostName} ({d.hostCountry})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dossier Quick Specs Grid */}
            {selectedDossier && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {locale === 'tr' ? 'Gönderen Okul' : 'Sending School'}
                  </span>
                  <span className="font-semibold text-slate-900 truncate block">
                    {selectedDossier.schoolName}
                  </span>
                  <span className="text-[10px] text-blue-700 font-mono">
                    OID: {selectedDossier.schoolOid}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {locale === 'tr' ? 'Ev Sahibi İşletme' : 'Host Enterprise'}
                  </span>
                  <span className="font-semibold text-slate-900 truncate block">
                    {selectedDossier.hostName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {selectedDossier.hostCountry}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {locale === 'tr' ? 'Mesleki Alan' : 'VET Field'}
                  </span>
                  <span className="font-semibold text-slate-900 truncate block">
                    {selectedDossier.vetFieldName}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    ISCED: {selectedDossier.iscedCode}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {locale === 'tr' ? 'Tarih & Süre' : 'Dates & Duration'}
                  </span>
                  <span className="font-semibold text-slate-900 block font-mono text-[11px]">
                    {selectedDossier.startDate}
                  </span>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    {selectedDossier.durationDays} {locale === 'tr' ? 'Günlük Hareketlilik' : 'Days'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {locale === 'tr' ? 'Katılımcı Sayısı' : 'Participant Count'}
                  </span>
                  <span className="font-black text-blue-900 text-sm block">
                    {selectedDossier.participantCount} {locale === 'tr' ? 'Kişi' : 'Pax'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {locale === 'tr' ? 'Stajyer Öğrenci' : 'VET Trainees'}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">
                    {locale === 'tr' ? 'Dosya Durumu' : 'Dossier Status'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{locale === 'tr' ? 'İhraca Hazır' : 'Ready'}</span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section: 4 Official Documents Grid */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-700" />
                <span>
                  {locale === 'tr'
                    ? 'Resmi Avrupa Birliği Evrak Seti (4 Belge)'
                    : 'Official European Union Document Set (4 Files)'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                {locale === 'tr'
                  ? 'Avrupa Komisyonu güncel VET standartlarına tam uyumlu, doldurulmuş resmi belgeler.'
                  : 'Pre-filled official documentation conforming to current European Commission VET standards.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {selectedDossier?.documents?.map((doc) => (
              <DossierDownloadCard
                key={doc.id}
                document={doc}
                dossier={selectedDossier}
                onPreview={(d) => setActiveModalDoc(d)}
                onDirectExport={handleDirectExport}
              />
            ))}
          </div>

          {/* Section: Export Audit Trail Log */}
          <div className="mt-12 bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  {locale === 'tr' ? 'Son İhraç ve İndirme Geçmişi' : 'Recent Export & Audit History'}
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {exportLogs.length} {locale === 'tr' ? 'Kayıt' : 'Logs'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-100">
                <thead className="bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">{locale === 'tr' ? 'Dosya Adı' : 'File Name'}</th>
                    <th className="py-2.5 px-4">{locale === 'tr' ? 'Evrak Türü' : 'Document Type'}</th>
                    <th className="py-2.5 px-4">{locale === 'tr' ? 'Format' : 'Format'}</th>
                    <th className="py-2.5 px-4">{locale === 'tr' ? 'İhraç Eden' : 'Exporter'}</th>
                    <th className="py-2.5 px-4">{locale === 'tr' ? 'Zaman' : 'Timestamp'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {exportLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-medium text-blue-900">
                        {log.fileName}
                      </td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">
                        {log.documentType}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {log.exportFormat}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{log.exporterName}</td>
                      <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(log.exportedAt).toLocaleString(
                          locale === 'tr' ? 'tr-TR' : 'en-GB'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Official Modals */}
      {activeModalDoc?.documentType === 'LEARNING_AGREEMENT' && selectedDossier && (
        <LearningAgreementExportModal
          document={activeModalDoc}
          dossier={selectedDossier}
          onClose={() => setActiveModalDoc(null)}
          onExportPdf={() => handleDirectExport(activeModalDoc, 'PDF')}
        />
      )}

      {activeModalDoc?.documentType === 'EUROPASS_MOBILITY' && selectedDossier && (
        <EuropassExportModal
          document={activeModalDoc}
          dossier={selectedDossier}
          onClose={() => setActiveModalDoc(null)}
          onExportPdf={() => handleDirectExport(activeModalDoc, 'PDF')}
        />
      )}

      {activeModalDoc?.documentType === 'INTER_INSTITUTIONAL_AGREEMENT' && selectedDossier && (
        <InterInstitutionalAgreementExportModal
          document={activeModalDoc}
          dossier={selectedDossier}
          onClose={() => setActiveModalDoc(null)}
          onExportPdf={() => handleDirectExport(activeModalDoc, 'PDF')}
        />
      )}

      <AppFooter />
    </div>
  );
}
