'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { DossierDocument, MobilityDossier, LearningAgreementPayload } from '@mobility-nexus/types';
import {
  X,
  Printer,
  Download,
  CheckCircle2,
  FileText,
  Building2,
  User,
  Award,
  Layers,
  Sparkles,
} from 'lucide-react';

interface LearningAgreementExportModalProps {
  document: DossierDocument;
  dossier: MobilityDossier;
  onClose: () => void;
  onExportPdf?: () => void;
}

export function LearningAgreementExportModal({
  document,
  dossier,
  onClose,
  onExportPdf,
}: LearningAgreementExportModalProps) {
  const { locale } = useTranslation();
  const payload = (document.documentPayload || {}) as Partial<LearningAgreementPayload>;

  const handlePrint = () => {
    if (onExportPdf) {
      onExportPdf();
    }
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white"
    >
      <div className="bg-white rounded-2xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-w-none print:max-h-none">
        {/* Top Control Header (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇪🇺</span>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>European Commission Official VET Template</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/50 text-blue-200 border border-blue-400/30">
                  {document.templateVersion}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                {dossier.mobilityCode} • {dossier.schoolName}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
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

        {/* Printable Official Document Sheet */}
        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-slate-900 font-sans print:p-0 print:overflow-visible">
          {/* EC Official Header */}
          <div className="border-b-2 border-slate-900 pb-5 text-center relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-left">
                <span className="text-4xl">🇪🇺</span>
                <div>
                  <div className="text-[11px] font-extrabold tracking-widest uppercase text-blue-900">
                    Erasmus+ Programme
                  </div>
                  <div className="text-[10px] text-slate-500 font-semibold">
                    European Commission • Directorate-General for Education
                  </div>
                </div>
              </div>

              <div className="text-right text-xs font-mono font-bold text-slate-700">
                <div>Project: {dossier.mobilityCode}</div>
                <div className="text-slate-400 text-[10px]">Doc: EC-LA-VET-2026</div>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight mt-3">
              Learning Agreement for Vocational Education and Training (VET)
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              {locale === 'tr'
                ? 'Mesleki Eğitim ve Öğretim Katılımcıları İçin Resmi Öğrenme Sözleşmesi'
                : 'Official Learning Agreement for VET Learners & Apprentices'}
            </p>
          </div>

          {/* Section 1: Institutional Partners Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sending School */}
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50">
              <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>The Sending Institution ({locale === 'tr' ? 'Gönderen Kurum' : 'Sending Partner'})</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'Kurum Adı:' : 'Institution Name:'}</strong>{' '}
                  {payload.sendingInstitution?.name || dossier.schoolName}
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'Kurum OID:' : 'Institution OID:'}</strong>{' '}
                  <span className="font-mono text-blue-900 font-bold">
                    {payload.sendingInstitution?.oid || dossier.schoolOid || 'E10123456'}
                  </span>
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'Şehir / Ülke:' : 'City / Country:'}</strong>{' '}
                  {payload.sendingInstitution?.city || 'Bursa / Türkiye'}
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'İletişim Sorumlusu:' : 'Contact Person:'}</strong>{' '}
                  {payload.sendingInstitution?.contactPerson || (locale === 'tr' ? 'Metin Demir (Koordinatör)' : 'Metin Demir (Coordinator)')}
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'E-posta:' : 'Email:'}</strong>{' '}
                  {payload.sendingInstitution?.contactEmail || 'erasmus@school.k12.tr'}
                </div>
              </div>
            </div>

            {/* Receiving Host */}
            <div className="border border-slate-300 rounded-lg p-4 bg-slate-50/50">
              <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" />
                <span>The Receiving Organisation ({locale === 'tr' ? 'Ev Sahibi İşletme' : 'Host Enterprise'})</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'İşletme Adı:' : 'Organisation Name:'}</strong>{' '}
                  {payload.hostOrganisation?.name || dossier.hostName}
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'Hedef Ülke / Şehir:' : 'Target Country / City:'}</strong>{' '}
                  {dossier.hostCountry} {dossier.hostCity ? `(${dossier.hostCity})` : ''}
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'İşyeri Adresi:' : 'Premises Address:'}</strong>{' '}
                  {payload.hostOrganisation?.address || 'Petuelring 130, 80788 München'}
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'Teknik Mentor:' : 'Technical Mentor:'}</strong>{' '}
                  {payload.hostOrganisation?.mentorName || 'Klaus Schneider'} (
                  {payload.hostOrganisation?.mentorRole || 'Senior VET Engineer'})
                </div>
                <div>
                  <strong className="text-slate-800">{locale === 'tr' ? 'Mentor E-posta:' : 'Mentor Email:'}</strong>{' '}
                  {payload.hostOrganisation?.mentorEmail || dossier.hostContactEmail || 'mentor@host.eu'}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Mobility Programme Details */}
          <div className="border border-slate-300 rounded-lg p-4 bg-white">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-2">
              Mobility Programme Details ({locale === 'tr' ? 'Hareketlilik Programı Ayrıntıları' : 'Internship Specifications'})
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">{locale === 'tr' ? 'Mesleki Alan & ISCED:' : 'VET Field & ISCED:'}</span>
                <strong className="text-slate-900">
                  {dossier.vetFieldName} ({dossier.iscedCode})
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">{locale === 'tr' ? 'Tarih Aralığı:' : 'Dates:'}</span>
                <strong className="text-slate-900 font-mono">
                  {dossier.startDate} → {dossier.endDate}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">{locale === 'tr' ? 'Süre & Haftalık Saat:' : 'Duration & Weekly Hours:'}</span>
                <strong className="text-slate-900">
                  {dossier.durationDays} {locale === 'tr' ? 'Gün • 35 Saat/Hafta' : 'Days • 35 Hours/Week'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">{locale === 'tr' ? 'Öğrenci Kontenjanı:' : 'Learner Capacity:'}</span>
                <strong className="text-blue-900 font-bold">
                  {dossier.participantCount} {locale === 'tr' ? 'Katılımcı' : 'Participants'}
                </strong>
              </div>
            </div>
          </div>

          {/* Section 3: Learning Outcomes Mapped to ESCO */}
          <div className="border border-slate-300 rounded-lg p-4 bg-white space-y-3">
            <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center justify-between">
              <span>Detailed Learning Outcomes & ESCO Skills Matrix</span>
              <span className="text-[10px] text-slate-500 font-normal font-mono">
                ECVET / ESCO Alignment
              </span>
            </div>

            {/* Knowledge */}
            <div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                A. Knowledge (Kuramsal ve Teknik Bilgi):
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1 leading-relaxed">
                {(
                  payload.learningOutcomes?.knowledge || [
                    'Sektörel güvenlik normları ve araç batarya modüllerinin çalışma prensipleri.',
                    'Avrupa iş sağlığı direktifleri ve telemetri veri yolu mimarisi.',
                  ]
                ).map((k, idx) => (
                  <li key={idx}>{k}</li>
                ))}
              </ul>
            </div>

            {/* Skills */}
            <div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                B. Skills (Uygulamalı Beceriler):
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1 leading-relaxed">
                {(
                  payload.learningOutcomes?.skills || [
                    'Ölçüm ve test ekipmanlarıyla elektriksel parametre analizi yapmak.',
                    'Endüstri standardında hata teşhisi ve bakım uygulamalarını tamamlamak.',
                  ]
                ).map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>

            {/* Competencies */}
            <div>
              <div className="text-xs font-bold text-slate-800 mb-1">
                C. Competencies & Responsibility (Özerklik ve Yetkinlikler):
              </div>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1 leading-relaxed">
                {(
                  payload.learningOutcomes?.competencies || [
                    'Farklı dillerin konuşulduğu çok uluslu üretim ortamında ekip halinde problem çözmek.',
                  ]
                ).map((c, idx) => (
                  <li key={idx}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 4: Monitoring and Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border border-slate-300 rounded-lg p-4 bg-slate-50/40">
            <div>
              <strong className="block text-slate-800 mb-1">
                {locale === 'tr' ? 'İzleme ve Rehberlik Planı:' : 'Monitoring and Mentoring Plan:'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {payload.monitoringPlan ||
                  (locale === 'tr'
                    ? 'Haftalık mentor toplantıları, günlük staj günlüğü (logbook) kontrolleri ve refakatçi öğretmen ara değerlendirmeleri.'
                    : 'Weekly mentor meetings, daily logbook audits, and accompanying teacher milestone reviews.')}
              </p>
            </div>
            <div>
              <strong className="block text-slate-800 mb-1">
                {locale === 'tr' ? 'Değerlendirme ve Tanınma Kriteri:' : 'Assessment and Recognition Criteria:'}
              </strong>
              <p className="text-slate-600 leading-relaxed">
                {payload.assessmentCriteria ||
                  (locale === 'tr'
                    ? 'ECVET ve ESCO mesleki beceri değerlendirme matrisi üzerinden %70 pratik uygulama, %30 teorik sınav ve sunum.'
                    : 'ECVET & ESCO skill assessment matrix: 70% hands-on practical tasks, 30% technical presentation and oral evaluation.')}
              </p>
            </div>
          </div>

          {/* Section 5: Official Signatures */}
          <div className="border border-slate-300 rounded-lg p-4 pt-5">
            <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider mb-4 text-center">
              Commitment of the Parties (Tarafların Resmi İmzaları ve Onayı)
            </div>

            <div className="grid grid-cols-3 gap-4 text-center text-xs">
              {/* Learner */}
              <div className="border-t border-slate-300 pt-2">
                <div className="font-bold text-slate-900">{payload.studentName || (locale === 'tr' ? 'Katılımcı Öğrenci' : 'Participant Learner')}</div>
                <div className="text-[10px] text-slate-500">The Learner ({locale === 'tr' ? 'Katılımcı' : 'Participant'})</div>
                <div className="mt-8 text-[11px] font-mono text-slate-400">{locale === 'tr' ? 'İmza & Tarih' : 'Signature & Date'}</div>
              </div>

              {/* Sending Institution */}
              <div className="border-t border-slate-300 pt-2">
                <div className="font-bold text-slate-900">
                  {payload.sendingInstitution?.contactPerson || 'Metin Demir'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Sending Institution Coordinator
                </div>
                <div className="mt-8 text-[11px] font-mono text-slate-400">{locale === 'tr' ? 'Resmi Mühür & İmza' : 'Official Seal & Signature'}</div>
              </div>

              {/* Receiving Host */}
              <div className="border-t border-slate-300 pt-2">
                <div className="font-bold text-slate-900">
                  {payload.hostOrganisation?.mentorName || 'Klaus Schneider'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Receiving Organisation Mentor
                </div>
                <div className="mt-8 text-[11px] font-mono text-slate-400">{locale === 'tr' ? 'Kurumsal Onay & Kaşe' : 'Corporate Seal & Approval'}</div>
              </div>
            </div>
          </div>

          {/* Footer Official Note */}
          <div className="text-[10px] text-slate-400 text-center border-t border-slate-200 pt-3">
            Generated via CAPPINNO Mobility Nexus • Official European Commission VET Learning Agreement Template (100% Free First Year Scheme)
          </div>
        </div>
      </div>
    </div>
  );
}
