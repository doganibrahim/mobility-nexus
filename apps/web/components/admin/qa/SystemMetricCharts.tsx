'use client';

import React from 'react';
import { useTranslation } from '@/lib/i18n';
import { SystemMetric } from '@mobility-nexus/types';
import { Activity, Cpu, HardDrive, Zap, CheckCircle2 } from 'lucide-react';

interface SystemMetricChartsProps {
  metrics: SystemMetric[];
}

export function SystemMetricCharts({ metrics }: SystemMetricChartsProps) {
  const { locale } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((m) => {
          // Calculate percentage relative to 500ms SLA
          const p95Pct = Math.min(100, Math.round((m.p95LatencyMs / 500) * 100));

          return (
            <div
              key={m.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-xs hover:border-blue-300 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                  {m.httpMethod} {m.endpointPath.replace('/api', '')}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>&lt; 500ms</span>
                </span>
              </div>

              {/* Latency Bar */}
              <div className="my-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-500 font-medium">p95 Latency:</span>
                  <span className="font-mono font-bold text-slate-900">{m.p95LatencyMs} ms</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${p95Pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>p50: {m.p50LatencyMs}ms</span>
                  <span>p99: {m.p99LatencyMs}ms</span>
                  <span>SLA: 500ms</span>
                </div>
              </div>

              {/* Throughput & Resources */}
              <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Throughput</div>
                  <div className="font-bold text-slate-800">{m.requestsPerSecond} r/s</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Errors</div>
                  <div className="font-bold text-emerald-600">{m.errorCount}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">CPU</div>
                  <div className="font-bold text-slate-800">{m.cpuUsagePercent}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
