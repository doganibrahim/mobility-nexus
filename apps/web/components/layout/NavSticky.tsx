'use client';

import React from 'react';

const NAV_ITEMS = [
  { href: '#system', label: '1. Sistem Mantığı' },
  { href: '#school', label: '2. Okul Profili' },
  { href: '#participant', label: '3. Katılımcı & Mobilite' },
  { href: '#esco', label: '4. ESCO–ISCED Mapper' },
  { href: '#assessment', label: '5. Yetkinlik Testi' },
  { href: '#decision', label: '6. KA121/122 Karar Motoru' },
  { href: '#host', label: '7. Host Eşleştirme' },
  { href: '#partners', label: '8. Partner Bulma' },
  { href: '#outcomes', label: '9. Kazanımlar' },
  { href: '#report', label: '10. Rapor & Dışa Aktar' },
];

export default function NavSticky() {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200/80 sticky top-[61px] z-20 overflow-x-auto whitespace-nowrap shadow-xs no-print">
      <div className="max-w-[1440px] mx-auto px-4 flex items-center gap-1.5 py-2 scrollbar-none">
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
