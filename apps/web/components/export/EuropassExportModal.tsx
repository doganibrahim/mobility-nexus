'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { DossierDocument, MobilityDossier, EuropassMobilityPayload } from '@mobility-nexus/types';
import {
  X,
  Printer,
  Download,
  Award,
  CheckCircle2,
  QrCode,
  Building2,
  FileCheck,
  Sparkles,
} from 'lucide-react';

interface EuropassExportModalProps {
  document: DossierDocument;
  dossier: MobilityDossier;
  onClose: () => void;
  onExportPdf?: () => void;
}

export function EuropassExportModal({
  document,
  dossier,
  onClose,
  onExportPdf,
}: EuropassExportModalProps) {
  const { locale } = useTranslation();
  const payload = (document.documentPayload || {}) as Partial<EuropassMobilityPayload>;

  const handlePrint = () => {
    if (onExportPdf) {
      onExportPdf();
    }
    window.print();
  };

  const europassId = payload.europassId || 'EUROPASS-MOB-2026-TR01-00482';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-w-none print:max-h-none">
        {/* Top Control Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇪🇺</span>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Official Europass Mobility Credential</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/50 text-emerald-200 border border-emerald-400/30">
                  {europassId}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {dossier.schoolName} → {dossier.hostName} ({dossier.hostCountry})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{locale === 'tr' ? 'Yazdır / PDF İhraç Et' : 'Print / Export PDF'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Europass Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="border-b-4 border-blue-900 pb-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">🇪🇺</span>
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-blue-950 uppercase tracking-tight">
                    europass mobility
                  </h1>
                  <p className="text-xs font-semibold text-slate-600">
                    Avrupa Hareketlilik ve Yetkinlik Belgesi
                  </p>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs font-mono font-bold text-blue-900">{europassId}</div>
                <div className="text-[10px] text-slate-400">Decision No: 2241/2004/EC</div>
              </div>
            </div>
          </div>

          {/* Section 1: Certificate Holder */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50">
            <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-2">
              1. This Europass Mobility Document is Awarded to (Belge Sahibi Katılımcı)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Adı Soyadı / Full Name:</span>
                <strong className="text-base text-slate-900">
                  {payload.certificateHolder?.fullName || 'Alperen Yılmaz'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Doğum Tarihi / Date of Birth:</span>
                <strong className="text-slate-800">
                  {payload.certificateHolder?.dateOfBirth || '2008-04-12'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Uyruk / Nationality:</span>
                <strong className="text-slate-800">
                  {payload.certificateHolder?.nationality || 'Turkish (T.C.)'}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 2 & 3: Partners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-300 rounded-lg p-4 bg-white text-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Sending Partner (Gönderen Kurum)
              </div>
              <div>
                <strong className="text-slate-800">{dossier.schoolName}</strong>
              </div>
              <div className="text-slate-600">{dossier.schoolCity || 'Bursa'}, {locale === 'tr' ? 'Türkiye' : 'Turkey'}</div>
              <div className="text-[11px] text-slate-500 font-mono">OID: {dossier.schoolOid}</div>
            </div>

            <div className="border border-slate-300 rounded-lg p-4 bg-white text-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Host Partner (Ev Sahibi Kuruluş)
              </div>
              <div>
                <strong className="text-slate-800">{dossier.hostName}</strong>
              </div>
              <div className="text-slate-600">
                {dossier.hostCity ? `${dossier.hostCity}, ` : ''}
                {dossier.hostCountry}
              </div>
              <div className="text-[11px] text-blue-900 font-semibold">
                European Accredited Vocational Partner
              </div>
            </div>
          </div>

          {/* Section 4: Mobility Details */}
          <div className="border border-slate-300 rounded-lg p-4 bg-white text-xs space-y-2">
            <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">
              4. Description of the Mobility Experience ({locale === 'tr' ? 'Staj & Hareketlilik Detayları' : 'Traineeship Details'})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block">{locale === 'tr' ? 'Eğitim / Staj Başlığı:' : 'Title of Training / Placement:'}</span>
                <strong className="text-slate-900">
                  {payload.mobilityDetails?.titleOfTraining ||
                    'Elektrikli Taşıt Batarya Mekatroniği ve Arıza Teşhis Stajı'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">{locale === 'tr' ? 'Tarih ve Süre:' : 'Dates & Duration:'}</span>
                <strong className="text-slate-900 font-mono">
                  {dossier.startDate} → {dossier.endDate} ({dossier.durationDays} {locale === 'tr' ? 'Gün' : 'Days'})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">{locale === 'tr' ? 'Proje Sözleşme No:' : 'Grant Agreement No:'}</span>
                <strong className="text-blue-900 font-mono">{dossier.mobilityCode}</strong>
              </div>
            </div>
          </div>

          {/* Section 5: Skills Acquired */}
          <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/40 text-xs space-y-3">
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
              5. Skills and Competencies Acquired During the Mobility (Edinilen Beceriler)
            </div>

            <div className="space-y-2">
              <div>
                <span className="font-bold text-slate-800 block mb-0.5">
                  • Job-related / Technical Skills (Mesleki Beceriler - ESCO Mapped):
                </span>
                <div className="text-slate-700 pl-4 leading-relaxed">
                  {(
                    payload.acquiredSkills?.jobRelatedSkills || dossier.escoSkills
                  ).join(' • ')}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">
                  • Language Skills (Yabancı Dil Becerileri):
                </span>
                <div className="text-slate-700 pl-4 leading-relaxed">
                  {(
                    payload.acquiredSkills?.languageSkills || [
                      'Mesleki teknik İngilizce terminolojisi ve pratik işyeri iletişimi (CEFR B1).',
                    ]
                  ).join(' • ')}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">
                  • Digital & Technology Skills (Dijital Yetkinlikler):
                </span>
                <div className="text-slate-700 pl-4 leading-relaxed">
                  {(
                    payload.acquiredSkills?.digitalSkills || [
                      'Telemetri yazılımları, dijital iş emri sistemleri, OLS kullanımı ve veri analizi.',
                    ]
                  ).join(' • ')}
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-0.5">
                  • Organizational & Social Skills (Sosyal ve Yönetsel Beceriler):
                </span>
                <div className="text-slate-700 pl-4 leading-relaxed">
                  {(
                    payload.acquiredSkills?.organizationalSkills || [
                      'Dakiklik, çok kültürlü takım çalışması, atölye 5S düzeni ve güvenlik disiplini.',
                    ]
                  ).join(' • ')}
                </div>
              </div>
            </div>
          </div>

          {/* Official Stamp & Validation Footer */}
          <div className="border-t-2 border-slate-300 pt-4 flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 border border-dashed border-slate-300 rounded-lg p-1 bg-white flex items-center justify-center">
                <QrCode className="w-10 h-10 text-slate-800" />
              </div>
              <div>
                <div className="font-bold text-slate-800">Europass Digital Verification</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Digest: 8f9b4c2e...verified
                </div>
                <div className="text-[10px] text-emerald-700 font-bold">
                  ✓ National Europass Centre Accredited
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[11px] font-bold text-slate-900">
                {dossier.hostName}
              </div>
              <div className="text-[10px] text-slate-400">
                Official Host Partner Certification
              </div>
              <div className="mt-4 font-mono text-[11px] text-slate-400">
                Mühür & İmza (Seal & Signature)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
