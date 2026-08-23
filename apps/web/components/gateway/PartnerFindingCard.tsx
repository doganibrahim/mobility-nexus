'use client';

import React from 'react';
import NeoCard from '../ui/NeoCard';
import { PARTNER_FUNNEL } from '../../lib/constants';
import { useTranslation } from '../../lib/i18n';

export default function PartnerFindingCard() {
  const { t } = useTranslation();

  return (
    <NeoCard
      id="partners"
      title={t.partners.title}
      badge="Resmî AB Ağları"
      badgeType="primary"
    >
      <div className="space-y-4">
        {/* 3 Portal Link Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          <a
            href="https://school-education.ec.europa.eu/en/networking/partner-finding"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  ESEP Partner Finding
                </span>
                <span className="text-xs text-slate-400 group-hover:text-blue-600">↗</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                VET ve okul eğitimi kuruluşları için ortaklık ilanı verin ve aktif çağrıları tarayın.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-blue-700">
              Avrupa Komisyonu Portalı
            </div>
          </a>

          <a
            href="https://salto-et.net"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  SALTO Education & Training
                </span>
                <span className="text-xs text-slate-400 group-hover:text-blue-600">↗</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                İletişim seminerleri, eğitim etkinlikleri ve Ulusal Ajans TCA işbirliği fırsatları.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-blue-700">
              SALTO-ET TCA Portalı
            </div>
          </a>

          <a
            href="https://erasmus-plus.ec.europa.eu/projects"
            target="_blank"
            rel="noopener noreferrer"
            className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-sm transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-700">
                  Erasmus+ Proje Veritabanı
                </span>
                <span className="text-xs text-slate-400 group-hover:text-blue-600">↗</span>
              </div>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Geçmişte hibe almış akredite kurumları ve başarılı VET projelerini inceleyin.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-medium text-blue-700">
              Proje Sonuç Arşivi
            </div>
          </a>
        </div>

        {/* 5-Step Funnel Table */}
        <div>
          <div className="text-xs font-bold text-slate-700 mb-2">
            {t.partners.funnelTitle}
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200/80">
            <table className="w-full text-left text-xs bg-white border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-700 text-xs font-bold border-b border-slate-200/80">
                  <th className="p-3 w-16 text-center">{t.partners.stageCol}</th>
                  <th className="p-3">{t.partners.sourceCol}</th>
                  <th className="p-3">{t.partners.queryCol}</th>
                  <th className="p-3">{t.partners.outputCol}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PARTNER_FUNNEL.map((f) => (
                  <tr
                    key={f.step}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="p-3 font-bold text-center text-blue-700">
                      Adım {f.step}
                    </td>
                    <td className="p-3 font-semibold text-slate-900">
                      {f.source}
                    </td>
                    <td className="p-3 text-slate-600">
                      {f.query}
                    </td>
                    <td className="p-3 font-medium text-slate-800">
                      {f.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </NeoCard>
  );
}
