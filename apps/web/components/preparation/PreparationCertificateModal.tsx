'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { PrepAssignment } from '@mobility-nexus/types';
import {
  X,
  Award,
  CheckCircle2,
  Printer,
  ShieldCheck,
  QrCode,
  Sparkles,
  Download,
} from 'lucide-react';

interface PreparationCertificateModalProps {
  assignment: PrepAssignment;
  onClose: () => void;
}

export function PreparationCertificateModal({
  assignment,
  onClose,
}: PreparationCertificateModalProps) {
  const { locale } = useTranslation();

  const handlePrint = () => {
    window.print();
  };

  const certNumber =
    assignment.certificateNumber || `EMN-PREP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  const issueDate = assignment.certificateIssuedAt
    ? new Date(assignment.certificateIssuedAt).toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )
    : new Date().toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' }
      );

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-auto flex flex-col animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:max-w-none">
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>
              {locale === 'tr'
                ? 'Resmi Erasmus+ Hazırlık Başarı Belgesi'
                : 'Official Erasmus+ Mobility Readiness Certificate'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{locale === 'tr' ? 'Yazdır / PDF Kaydet' : 'Print / Save PDF'}</span>
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

        {/* Certificate Printable Canvas */}
        <div className="p-8 sm:p-12 bg-linear-to-b from-blue-50/40 via-white to-amber-50/20 relative border-8 border-double border-slate-200 m-4 rounded-xl print:m-0 print:border-4">
          {/* Watermark Logo */}
          <div className="absolute right-8 top-8 opacity-10 pointer-events-none text-9xl">
            🇪🇺
          </div>

          {/* Header */}
          <div className="text-center pb-6 border-b border-slate-200">
            <div className="inline-flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">🇪🇺</span>
              <span className="text-xs font-extrabold tracking-widest uppercase text-blue-900">
                Erasmus+ Programme of the European Union
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-1">
              {locale === 'tr'
                ? 'Katılımcı Seyahat Öncesi Hazırlık Başarı Belgesi'
                : 'Certificate of Pre-Departure Mobility Readiness'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              CAPPINNO Mobility Nexus • Participant Mobility Preparation LMS (PKG-04)
            </p>
          </div>

          {/* Body */}
          <div className="py-8 text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
              {locale === 'tr' ? 'Bu belge ile doğrulanır ki;' : 'This certifies that;'}
            </p>

            <div className="text-2xl sm:text-3xl font-black text-blue-950 font-serif border-b-2 border-blue-900 inline-block px-8 pb-1">
              {assignment.participantName}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
              {locale === 'tr' ? (
                <>
                  <strong>{assignment.schoolName}</strong> bünyesinde yürütülen{' '}
                  <strong className="text-blue-900">{assignment.mobilityProjectCode}</strong> numaralı
                  Erasmus+ Mesleki Eğitim (VET) projesi kapsamında{' '}
                  <strong>{assignment.destinationCountry}</strong> hareketliliği için zorunlu olan 10
                  temel hazırlık modülünü (Kültürel Uyum, OHS İSG, Dil Becerileri, Europass ve Yasal
                  Haklar) başarıyla tamamlamıştır.
                </>
              ) : (
                <>
                  Has successfully mastered all 10 mandatory pre-departure modules (Cultural
                  Adaptation, Workshop OHS, Practical Language, Europass & Legal Rights) for the
                  upcoming mobility to <strong>{assignment.destinationCountry}</strong> under Erasmus+
                  project <strong className="text-blue-900">{assignment.mobilityProjectCode}</strong>{' '}
                  hosted by <strong>{assignment.schoolName}</strong>.
                </>
              )}
            </p>

            {/* Competency badges row */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-1.5 max-w-lg mx-auto">
              {[
                'Kültürel Uyum',
                'İSG & KKD Standartları',
                'AB Dil Desteği (OLS)',
                'Yeşil Seyahat',
                'Europass & ESCO',
                'Acil Durum 112',
              ].map((comp, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200"
                >
                  ✓ {comp}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Validation & Stamp */}
          <div className="mt-6 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-600">
            {/* Cert Code */}
            <div className="text-left space-y-1">
              <div>
                <span className="font-bold text-slate-700">
                  {locale === 'tr' ? 'Belge No:' : 'Certificate No:'}{' '}
                </span>
                <span className="font-mono text-blue-900 font-bold">{certNumber}</span>
              </div>
              <div>
                <span className="font-bold text-slate-700">
                  {locale === 'tr' ? 'Düzenleme Tarihi:' : 'Issue Date:'}{' '}
                </span>
                <span>{issueDate}</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>
                  {locale === 'tr' ? 'Dijital Olarak Doğrulandı' : 'Digitally Verified'}
                </span>
              </div>
            </div>

            {/* Official Stamp Box */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border-2 border-dashed border-blue-300 rounded-lg flex flex-col items-center justify-center p-1 bg-white shadow-xs">
                <QrCode className="w-10 h-10 text-slate-800" />
                <span className="text-[8px] font-mono text-slate-400">VERIFIED</span>
              </div>

              <div className="text-center sm:text-right">
                <div className="text-xs font-black text-slate-900 uppercase">
                  CAPPINNO Mobility Nexus
                </div>
                <div className="text-[10px] text-slate-500">
                  Erasmus+ Digital Readiness Engine
                </div>
                <div className="text-[10px] font-bold text-blue-800 mt-1">
                  National Agency Quality Charter Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
