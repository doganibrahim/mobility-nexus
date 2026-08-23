'use client';

import React from 'react';
import { useTranslation } from '../../lib/i18n';

export default function AppFooter() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 bg-white mt-16 py-10 text-slate-600 no-print">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100 pb-8 mb-6">
          <div className="md:col-span-6 space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-6 h-6 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                C
              </span>
              <span className="font-bold text-slate-900 text-sm">
                CAPPINNO Mobility Nexus • Erasmus+ EMaaS Platformu
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
              {t.footer.subtitle}
            </p>
          </div>

          <div className="md:col-span-3 text-xs space-y-1.5 text-slate-500">
            <div className="text-slate-900 font-bold text-xs mb-1">
              Standartlar & Taksonomi
            </div>
            <div>• Erasmus+ KA121/KA122 VET</div>
            <div>• ESCO v1.1.1 & ISCED-F 2013</div>
            <div>• ECVET & Europass Uyumlu</div>
          </div>

          <div className="md:col-span-3 text-xs space-y-1.5 text-slate-500">
            <div className="text-slate-900 font-bold text-xs mb-1">
              Güvenlik & Gizlilik
            </div>
            <div>• AB GDPR & KVKK Uyumlu</div>
            <div>• Denetlenebilir İşlem Kayıtları</div>
            <div>• Uçtan Uca Güvenli Veri Saklama</div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
          <div>© 2026 CAPPINNO • Tüm hakları saklıdır.</div>
          <div className="flex items-center gap-4">
            <span>Erasmus+ Mesleki Eğitim Hareketliliği Yönetim Portalı</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
