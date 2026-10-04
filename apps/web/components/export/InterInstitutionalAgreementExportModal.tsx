'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import {
  DossierDocument,
  MobilityDossier,
  InterInstitutionalAgreementPayload,
} from '@mobility-nexus/types';
import { X, Printer, Download, Building2, CheckCircle2, ShieldCheck } from 'lucide-react';

interface InterInstitutionalAgreementExportModalProps {
  document: DossierDocument;
  dossier: MobilityDossier;
  onClose: () => void;
  onExportPdf?: () => void;
}

export function InterInstitutionalAgreementExportModal({
  document,
  dossier,
  onClose,
  onExportPdf,
}: InterInstitutionalAgreementExportModalProps) {
  const { locale } = useTranslation();
  const payload = (document.documentPayload ||
    {}) as Partial<InterInstitutionalAgreementPayload>;

  const handlePrint = () => {
    if (onExportPdf) {
      onExportPdf();
    }
    window.print();
  };

  const agreementNumber = payload.agreementNumber || 'EMN-IIA-2026-DE-TR-001';

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
            <span className="text-xl">🤝</span>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Erasmus+ Inter-Institutional Partnership Protocol</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600/50 text-indigo-200 border border-indigo-400/30">
                  {agreementNumber}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {dossier.schoolName} & {dossier.hostName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
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

        {/* Printable Official Protocol Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* Header */}
          <div className="text-center border-b-2 border-slate-900 pb-5">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🇪🇺</span>
              <span className="text-xs font-extrabold uppercase tracking-widest text-blue-900">
                Erasmus+ Vocational Education and Training Programme
              </span>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
              Inter-Institutional Bilateral Partnership & Traineeship Agreement
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Mesleki Eğitim Kurumlararası Resmi Ortaklık ve Staj Protokolü
            </p>
            <div className="text-xs font-mono font-bold text-blue-900 mt-1">
              Prot. No: {agreementNumber} • Call 2026
            </div>
          </div>

          {/* Parties Introduction */}
          <div className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
            {locale === 'tr' ? (
              <>
                İşbu Protokol, Avrupa Birliği Erasmus+ Mesleki Eğitim Programı (KA121 / KA122)
                kuralları çerçevesinde, aşağıda bilgileri yer alan <strong>Gönderen Kurum</strong> ile{' '}
                <strong>Ev Sahibi İşletme</strong> arasında karşılıklı mutabakatla akdedilmiştir.
              </>
            ) : (
              <>
                This Agreement is concluded within the framework of the European Union Erasmus+ Vocational Education
                and Training (VET) Programme (KA121 / KA122) between the <strong>Sending Institution</strong> and the{' '}
                <strong>Host Enterprise</strong> detailed below.
              </>
            )}
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Partner A */}
            <div className="border border-slate-300 rounded-lg p-4 bg-white space-y-1">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                {locale === 'tr' ? 'Taraf A (Gönderen Kurum / Sending Institution)' : 'Party A (Sending Institution)'}
              </div>
              <div>
                <strong>{locale === 'tr' ? 'Kurum:' : 'Institution:'}</strong> {dossier.schoolName}
              </div>
              <div>
                <strong>{locale === 'tr' ? 'OID / Ülke:' : 'OID / Country:'}</strong> {dossier.schoolOid} • Türkiye
              </div>
              <div>
                <strong>{locale === 'tr' ? 'Yasal Temsilci:' : 'Legal Representative:'}</strong>{' '}
                {payload.partnerA?.legalRep || (locale === 'tr' ? 'Metin Demir (Okul Müdürü)' : 'Metin Demir (Headmaster)')}
              </div>
              <div>
                <strong>{locale === 'tr' ? 'Adres:' : 'Address:'}</strong> {payload.partnerA?.address || 'Bursa, Türkiye'}
              </div>
            </div>

            {/* Partner B */}
            <div className="border border-slate-300 rounded-lg p-4 bg-white space-y-1">
              <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
                {locale === 'tr' ? 'Taraf B (Ev Sahibi İşletme / Host Organisation)' : 'Party B (Host Organisation)'}
              </div>
              <div>
                <strong>{locale === 'tr' ? 'Kurum:' : 'Organisation:'}</strong> {dossier.hostName}
              </div>
              <div>
                <strong>{locale === 'tr' ? 'Ülke / Şehir:' : 'Country / City:'}</strong> {dossier.hostCountry} (
                {dossier.hostCity || (locale === 'tr' ? 'Avrupa' : 'Europe')})
              </div>
              <div>
                <strong>{locale === 'tr' ? 'Yasal Temsilci:' : 'Legal Representative:'}</strong>{' '}
                {payload.partnerB?.legalRep || 'Hans-Peter Weber (Director)'}
              </div>
              <div>
                <strong>{locale === 'tr' ? 'Adres:' : 'Address:'}</strong>{' '}
                {payload.partnerB?.address || 'Petuelring 130, 80788 München'}
              </div>
            </div>
          </div>

          {/* Key Articles */}
          <div className="space-y-3 text-xs leading-relaxed text-slate-700">
            <div>
              <strong className="text-slate-900 block mb-1">
                {locale === 'tr' ? 'Madde 1: Amaç ve Kapsam (Purpose & Scope)' : 'Article 1: Purpose & Scope'}
              </strong>
              <p>
                {locale === 'tr' ? (
                  <>
                    Bu sözleşmenin amacı, <strong>{dossier.mobilityCode}</strong> numaralı proje
                    kapsamında {dossier.participantCount} meslek lisesi öğrencisinin{' '}
                    <strong>{dossier.vetFieldName}</strong> alanında{' '}
                    {dossier.durationDays} gün sürecek pratik staj hareketliliğinin kurallarını
                    belirlemektir.
                  </>
                ) : (
                  <>
                    The purpose of this agreement is to define terms and quality benchmarks for practical VET traineeships of{' '}
                    {dossier.participantCount} learners in the field of <strong>{dossier.vetFieldName}</strong> for a duration of{' '}
                    {dossier.durationDays} days under project <strong>{dossier.mobilityCode}</strong>.
                  </>
                )}
              </p>
            </div>

            <div>
              <strong className="text-slate-900 block mb-1">
                {locale === 'tr' ? 'Madde 2: Ev Sahibi Kurum Yükümlülükleri (Host Commitments)' : 'Article 2: Host Commitments'}
              </strong>
              <ul className="list-disc pl-5 space-y-0.5">
                {locale === 'tr' ? (
                  <>
                    <li>
                      Katılımcılara Avrupa atölye standartlarında uygun çalışma ortamı ve KKD ekipmanı
                      sağlamak.
                    </li>
                    <li>Haftalık en az 35 saatlik yapılandırılmış staj programı ve mentor tahsis etmek.</li>
                    <li>
                      Staj sonunda Learning Agreement çıktılarını değerlendirerek Europass Mobility
                      belgesini imzalamak.
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      Provide a safe workplace and necessary PPE compliant with European workshop and industry safety standards.
                    </li>
                    <li>Assign a certified technical mentor and ensure at least 35 hours of structured weekly training.</li>
                    <li>
                      Assess Learning Agreement outcomes upon completion and execute the Europass Mobility credential.
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <strong className="text-slate-900 block mb-1">
                {locale === 'tr'
                  ? 'Madde 3: Mali Hükümler ve Ücretsiz Sağlama (Financial Provisions - 100% Free Scheme)'
                  : 'Article 3: Financial Terms & 100% Free Scheme'}
              </strong>
              <p>
                {locale === 'tr' ? (
                  <>
                    İşbu sözleşme kapsamında sunulan koordinasyon, evrak hazırlığı ve staj izleme
                    hizmetleri, platformun ilk yıl 100% ücretsiz modeline tabidir. Okul ve ev sahibi
                    kurumdan hiçbir gizli komisyon veya işlem bedeli talep edilmez.
                  </>
                ) : (
                  <>
                    All coordination, documentation preparation, and monitoring tools provided under this framework are
                    100% free with zero commission fees or hidden surcharges for either participating party.
                  </>
                )}
              </p>
            </div>

            <div>
              <strong className="text-slate-900 block mb-1">
                {locale === 'tr'
                  ? 'Madde 4: Sigorta ve İş Güvenliği (Insurance & OHS Compliance)'
                  : 'Article 4: Insurance & OHS Compliance'}
              </strong>
              <p>
                {locale === 'tr' ? (
                  <>
                    Gönderen kurum tüm katılımcıların seyahat sağlık, acil tıbbi tahliye ve mesuliyet
                    sigortalarını eksiksiz yaptırmayı taahhüt eder. Ev sahibi kurum ise işletme içi OHS
                    kurallarını ilk gün oryantasyonunda aktarır.
                  </>
                ) : (
                  <>
                    The Sending Institution guarantees international health, emergency medical repatriation, and civil liability
                    insurance coverage for all participants. The Host Enterprise delivers mandatory workplace safety induction on day one.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Signatures */}
          <div className="border border-slate-300 rounded-lg p-5 pt-4">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-4 text-center">
              Signatures of Authorised Representatives (Yetkili Temsilcilerin İmzaları)
            </div>

            <div className="grid grid-cols-2 gap-8 text-center text-xs">
              <div className="border-t border-slate-300 pt-2">
                <div className="font-bold text-slate-900">{dossier.schoolName}</div>
                <div className="text-[10px] text-slate-500">
                  {payload.partnerA?.legalRep || 'Metin Demir (Okul Müdürü)'}
                </div>
                <div className="mt-10 font-mono text-[11px] text-slate-400">
                  Mühür & İmza (Seal & Signature)
                </div>
              </div>

              <div className="border-t border-slate-300 pt-2">
                <div className="font-bold text-slate-900">{dossier.hostName}</div>
                <div className="text-[10px] text-slate-500">
                  {payload.partnerB?.legalRep || 'Hans-Peter Weber (Managing Director)'}
                </div>
                <div className="mt-10 font-mono text-[11px] text-slate-400">
                  Kurumsal Kaşe & İmza (Corporate Seal)
                </div>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-3">
            CAPPINNO Mobility Nexus • Bilateral Traineeship Agreement Protocol • European Union Erasmus+ Standards
          </div>
        </div>
      </div>
    </div>
  );
}
