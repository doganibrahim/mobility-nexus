'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { QaTestRun } from '@mobility-nexus/types';
import {
  CheckCircle2,
  Clock,
  Play,
  RotateCcw,
  ShieldAlert,
  Search,
  ChevronRight,
  Sparkles,
  X,
  Layers,
  Award,
} from 'lucide-react';

interface QaTestRunTableProps {
  testRuns: QaTestRun[];
  onTriggerRun: (category?: string) => Promise<void>;
  isTriggering?: boolean;
}

export function QaTestRunTable({
  testRuns,
  onTriggerRun,
  isTriggering = false,
}: QaTestRunTableProps) {
  const { locale } = useTranslation();
  const [selectedRun, setSelectedRun] = useState<QaTestRun | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  const filteredRuns = testRuns.filter((r) => {
    if (categoryFilter !== 'ALL' && r.testCategory !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Top Header & Actions */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <span>🧪</span>
            <span>
              {locale === 'tr'
                ? 'Otomatik QA Test Koşuları ve Güvenlik Taramaları'
                : 'Automated QA Test Runs & Security Scans'}
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            {locale === 'tr'
              ? 'Yük testleri, OWASP güvenlik açığı taraması ve uçtan uca akış doğrulama.'
              : 'Stress simulations, OWASP vulnerability audits, and end-to-end regression runs.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-medium focus:ring-2 focus:ring-blue-600"
          >
            <option value="ALL">{locale === 'tr' ? 'Tüm Testler' : 'All Suites'}</option>
            <option value="SECURITY_AUDIT">{locale === 'tr' ? 'Güvenlik (OWASP)' : 'Security'}</option>
            <option value="LOAD_PERFORMANCE">{locale === 'tr' ? 'Yük & Stres' : 'Load & Stress'}</option>
            <option value="E2E_WORKFLOW">{locale === 'tr' ? 'Uçtan Uca (E2E)' : 'E2E Workflow'}</option>
            <option value="ACCESSIBILITY">{locale === 'tr' ? 'Erişilebilirlik' : 'Accessibility'}</option>
          </select>

          {/* Trigger button */}
          <button
            type="button"
            onClick={() => onTriggerRun()}
            disabled={isTriggering}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
          >
            <Play className={`w-3.5 h-3.5 ${isTriggering ? 'animate-spin' : ''}`} />
            <span>
              {isTriggering
                ? locale === 'tr'
                  ? 'Koşuluyor...'
                  : 'Running...'
                : locale === 'tr'
                ? 'Yeni Test Koş'
                : 'Run QA Suite'}
            </span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs divide-y divide-slate-100">
          <thead className="bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">{locale === 'tr' ? 'Test Paketi' : 'Suite Name'}</th>
              <th className="py-2.5 px-4">{locale === 'tr' ? 'Kategori' : 'Category'}</th>
              <th className="py-2.5 px-4">{locale === 'tr' ? 'Durum' : 'Status'}</th>
              <th className="py-2.5 px-4">{locale === 'tr' ? 'Doğrulamalar' : 'Assertions'}</th>
              <th className="py-2.5 px-4">{locale === 'tr' ? 'p95 Gecikme' : 'p95 Latency'}</th>
              <th className="py-2.5 px-4">{locale === 'tr' ? 'Çalıştırılma' : 'Timestamp'}</th>
              <th className="py-2.5 px-4 text-right">{locale === 'tr' ? 'Detay' : 'Details'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredRuns.map((run) => (
              <tr
                key={run.id}
                onClick={() => setSelectedRun(run)}
                className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
              >
                <td className="py-3 px-4 font-bold text-slate-900 group-hover:text-blue-900">
                  {run.testSuiteName}
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {run.testCategory}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{run.status}</span>
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-800">
                  {run.passedAssertions} / {run.totalAssertions} {locale === 'tr' ? 'Geçti' : 'Passed'}
                </td>
                <td className="py-3 px-4 font-mono font-bold text-blue-900">
                  {run.p95LatencyMs} ms
                </td>
                <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                  {new Date(run.executedAt).toLocaleString(locale === 'tr' ? 'tr-TR' : 'en-GB')}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    type="button"
                    className="p-1 rounded hover:bg-slate-100 text-slate-400 group-hover:text-slate-700"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal for Selected Test Run */}
      {selectedRun && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
        >
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 my-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  {selectedRun.testCategory}
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-1">
                  {selectedRun.testSuiteName}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedRun(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">
                  {locale === 'tr' ? 'Özet Rapor:' : 'Summary Report:'}
                </span>
                <p className="text-slate-600 leading-relaxed">{selectedRun.summaryReport}</p>
              </div>

              <div>
                <span className="font-bold text-slate-800 block mb-2">
                  {locale === 'tr' ? 'Doğrulanan Maddeler:' : 'Verified Assertions:'}
                </span>
                <div className="space-y-1.5">
                  {selectedRun.detailedResults.map((res) => (
                    <div
                      key={res.id}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-slate-800">{res.name}</span>
                      </div>
                      {res.latencyMs && (
                        <span className="text-[10px] font-mono text-slate-400">
                          {res.latencyMs} ms
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedRun(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-lg transition-colors"
              >
                {locale === 'tr' ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
