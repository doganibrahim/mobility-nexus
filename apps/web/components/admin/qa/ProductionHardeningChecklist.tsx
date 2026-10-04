'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { HardeningCheckItem } from '@mobility-nexus/types';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
  Scale,
  FileCheck2,
  Clock,
  Sparkles,
  Server,
  AlertTriangle,
} from 'lucide-react';

interface ProductionHardeningChecklistProps {
  checklist: HardeningCheckItem[];
}

export function ProductionHardeningChecklist({
  checklist,
}: ProductionHardeningChecklistProps) {
  const { locale } = useTranslation();

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'SECURITY':
        return { label: 'Güvenlik', color: 'bg-red-50 text-red-800 border-red-200' };
      case 'ENV':
        return { label: 'Ortam & Gizlilik', color: 'bg-blue-50 text-blue-800 border-blue-200' };
      case 'PERFORMANCE':
        return { label: 'Performans', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' };
      case 'COMPLIANCE':
        return { label: 'Hukuk & Uyum', color: 'bg-purple-50 text-purple-800 border-purple-200' };
      default:
        return { label: cat, color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  return (
    <div className="space-y-6">
      {/* 30-Day Warranty Highlight Banner */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="absolute right-6 top-6 opacity-10 text-8xl pointer-events-none">
          🛡️
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold mb-3">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>
                {locale === 'tr'
                  ? '30 Günlük Ücretsiz Bakım ve Garanti Protokolü Devrede'
                  : '30-Day Free Maintenance Warranty Protocol Active'}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {locale === 'tr'
                ? 'Canlıya Alım Güvencesi & Sıfır Hata Taahhüdü'
                : 'Production Launch Assurance & Zero-Defect Guarantee'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {locale === 'tr'
                ? 'CAPPINNO Mobility Nexus platformu canlıya alındıktan sonra 30 gün boyunca operasyonel hata giderme, güvenlik güncellemeleri ve teknik destek 100% ücretsiz olarak garanti altındadır.'
                : 'Following production deployment, CAPPINNO guarantees 30 days of complimentary maintenance, proactive bug resolution, and SLA adherence.'}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-xl text-center shrink-0">
            <div className="text-[10px] uppercase font-bold text-slate-300">
              {locale === 'tr' ? 'Garanti Süresi' : 'Warranty Window'}
            </div>
            <div className="text-2xl font-black text-white font-mono mt-1">30 Gün</div>
            <div className="text-[10px] text-emerald-300 font-semibold mt-0.5">
              100% Ücretsiz Destek
            </div>
          </div>
        </div>
      </div>

      {/* 10-Point Checklist Grid */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-700" />
              <span>
                {locale === 'tr'
                  ? '10 Maddelik Canlıya Alım & Güvenlik Kilidi Denetimi'
                  : '10-Point Production Hardening & Security Audit'}
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              {locale === 'tr'
                ? 'Sistem kararlılığı, veri gizliliği ve yasal uyumluluk kriterlerinin tamamı doğrulanmıştır.'
                : 'All criteria for system resilience, data protection, and regulatory compliance verified.'}
            </p>
          </div>

          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
            10 / 10 {locale === 'tr' ? 'Doğrulandı' : 'Verified'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {checklist.map((item, index) => {
            const badge = getCategoryBadge(item.category);
            return (
              <div
                key={item.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-4 flex items-start gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-xs text-slate-900">
                      {index + 1}. {locale === 'tr' ? item.titleTr : item.titleEn}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {locale === 'tr' ? item.detailsTr : item.detailsEn}
                  </p>

                  <div className="mt-2 text-[10px] text-slate-400 font-mono">
                    Doğrulandı: {new Date(item.verifiedAt).toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-GB')}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
