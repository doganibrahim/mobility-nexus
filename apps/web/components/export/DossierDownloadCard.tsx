'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { DossierDocument, MobilityDossier } from '@mobility-nexus/types';
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  FileCheck2,
  ShieldCheck,
  Award,
  Layers,
  Printer,
  ChevronRight,
} from 'lucide-react';

interface DossierDownloadCardProps {
  document: DossierDocument;
  dossier: MobilityDossier;
  onPreview: (doc: DossierDocument) => void;
  onDirectExport: (doc: DossierDocument, format: 'PDF' | 'DOCX') => Promise<void>;
}

export function DossierDownloadCard({
  document,
  dossier,
  onPreview,
  onDirectExport,
}: DossierDownloadCardProps) {
  const { locale } = useTranslation();
  const [isExporting, setIsExporting] = useState(false);

  const title = locale === 'tr' ? document.titleTr : document.titleEn;

  const handleExport = async (format: 'PDF' | 'DOCX') => {
    setIsExporting(true);
    try {
      await onDirectExport(document, format);
    } finally {
      setIsExporting(false);
    }
  };

  const getDocBadgeColor = () => {
    switch (document.documentType) {
      case 'LEARNING_AGREEMENT':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'EUROPASS_MOBILITY':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'INTER_INSTITUTIONAL_AGREEMENT':
        return 'bg-indigo-50 text-indigo-800 border-indigo-200';
      default:
        return 'bg-amber-50 text-amber-800 border-amber-200';
    }
  };

  const getDocTypeLabel = () => {
    switch (document.documentType) {
      case 'LEARNING_AGREEMENT':
        return 'EC VET Form 2026';
      case 'EUROPASS_MOBILITY':
        return 'Europass Credential';
      case 'INTER_INSTITUTIONAL_AGREEMENT':
        return 'Bilateral Agreement';
      default:
        return 'Quality Charter';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getDocBadgeColor()}`}
          >
            <span>🇪🇺</span>
            <span>{getDocTypeLabel()}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>{locale === 'tr' ? '100% Ücretsiz' : '100% Free'}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Mobility context preview */}
        <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{locale === 'tr' ? 'Okul / Gönderen:' : 'School:'}</span>
            <span className="font-semibold text-slate-800 truncate max-w-[180px]">
              {dossier.schoolName}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{locale === 'tr' ? 'Ev Sahibi Kurum:' : 'Host:'}</span>
            <span className="font-semibold text-slate-800 truncate max-w-[180px]">
              {dossier.hostName} ({dossier.hostCountry})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">{locale === 'tr' ? 'Katılımcı Sayısı:' : 'Participants:'}</span>
            <span className="font-bold text-blue-900">
              {dossier.participantCount} {locale === 'tr' ? 'Kişi' : 'Pax'} ({dossier.durationDays} {locale === 'tr' ? 'Gün' : 'Days'})
            </span>
          </div>
        </div>

        {/* Export stats */}
        <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 font-medium">
          <span>
            {locale === 'tr' ? 'Şablon:' : 'Template:'}{' '}
            <strong className="text-slate-700 font-mono">{document.templateVersion}</strong>
          </span>
          <span>
            {locale === 'tr' ? 'İndirilme:' : 'Downloads:'}{' '}
            <strong className="text-slate-700">{document.downloadCount || 0}</strong>
          </span>
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onPreview(document)}
          className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
        >
          <Eye className="w-3.5 h-3.5 text-slate-600" />
          <span>{locale === 'tr' ? 'Resmi Önizleme' : 'Official Preview'}</span>
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleExport('PDF')}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('DOCX')}
            disabled={isExporting}
            className="inline-flex items-center gap-1.5 px-2.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
            title={locale === 'tr' ? 'Word Şablonu İndir' : 'Download Word DOCX'}
          >
            <FileText className="w-3.5 h-3.5 text-blue-700" />
            <span>DOCX</span>
          </button>
        </div>
      </div>
    </div>
  );
}
