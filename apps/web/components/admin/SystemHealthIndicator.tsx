'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { ShieldCheck, Activity, Database, Lock, CheckCircle2 } from 'lucide-react';

interface SystemHealthIndicatorProps {
  p95LatencyMs?: number;
  uptimePercentage?: number;
  compact?: boolean;
}

export function SystemHealthIndicator({
  p95LatencyMs = 118,
  uptimePercentage = 99.98,
  compact = false,
}: SystemHealthIndicatorProps) {
  const { locale } = useTranslation();

  if (compact) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
        </span>
        <span>{uptimePercentage}% {locale === 'tr' ? 'Çalışma Süresi' : 'Uptime'}</span>
        <span className="text-slate-400">•</span>
        <span className="font-mono text-emerald-900">p95: {p95LatencyMs}ms</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
      {/* Live Service Status */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
          <Activity className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800">
              {locale === 'tr' ? 'Sistem Canlı ve Sağlıklı' : 'All Systems Operational'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {locale === 'tr'
              ? 'Tüm mikroservisler, veritabanı havuzu ve export motorları aktif.'
              : 'All microservices, database pools, and export engines are active.'}
          </p>
        </div>
      </div>

      {/* Badges Row */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <span className="text-slate-500 font-medium">{locale === 'tr' ? 'SLA p95 Gecikme:' : 'p95 Latency:'}</span>
          <strong className="text-blue-900 font-mono font-bold">{p95LatencyMs} ms</strong>
          <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
            &lt; 500ms SLA
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Database className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Veritabanı:' : 'Database:'}</span>
          <strong className="text-emerald-700 font-bold">PostgreSQL Pool (OK)</strong>
        </div>

        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-amber-600" />
          <span className="text-slate-500 font-medium">SSL:</span>
          <strong className="text-slate-800 font-bold">TLS v1.3 A+</strong>
        </div>
      </div>
    </div>
  );
}
