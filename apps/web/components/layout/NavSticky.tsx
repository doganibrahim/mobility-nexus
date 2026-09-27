'use client';

import React from 'react';
import { useTranslation } from '../../lib/i18n';

const NAV_ITEMS = [
  { href: '#system', labelTr: '1. Sistem Mantığı', labelEn: '1. Platform Overview' },
  { href: '#school', labelTr: '2. Okul Profili', labelEn: '2. School Profile' },
  { href: '#participant', labelTr: '3. Katılımcı & Mobilite', labelEn: '3. Participant & Mobility' },
  { href: '#esco', labelTr: '4. ESCO–ISCED Mapper', labelEn: '4. ESCO–ISCED Mapper' },
  { href: '#assessment', labelTr: '5. Yetkinlik Testi', labelEn: '5. Competence Assessment' },
  { href: '#host', labelTr: '6. Host Eşleştirme', labelEn: '6. Host Matching' },
  { href: '#decision', labelTr: '7. KA120/121/122 Karar Motoru', labelEn: '7. Grant Decision Engine' },
  { href: '#partners', labelTr: '8. Partner Bulma', labelEn: '8. Partner Matching' },
  { href: '#outcomes', labelTr: '9. Kazanımlar', labelEn: '9. Learning Outcomes' },
  { href: '#report', labelTr: '10. Rapor & Dışa Aktar', labelEn: '10. Dossier & Export' },
];

export default function NavSticky() {
  const { locale } = useTranslation();

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 sticky top-[61px] z-20 overflow-x-auto whitespace-nowrap shadow-xs no-print">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center gap-1.5 py-2 scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            {locale === 'tr' ? item.labelTr : item.labelEn}
          </a>
        ))}
      </div>
    </nav>
  );
}
