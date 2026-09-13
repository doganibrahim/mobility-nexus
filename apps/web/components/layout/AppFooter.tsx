'use client';

import React, { useState } from 'react';
import { useTranslation } from '../../lib/i18n';
import LegalModal, { LegalTabType } from '../ui/LegalModal';
import AppointmentModal from '../ui/AppointmentModal';

export default function AppFooter() {
  const { t, locale } = useTranslation();
  const [isLegalOpen, setIsLegalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTabType>('LEGAL');
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  const openLegal = (tab: LegalTabType) => {
    setLegalTab(tab);
    setIsLegalOpen(true);
  };

  return (
    <>
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
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setIsAppointmentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{locale === 'tr' ? 'Danışmanlık İçin Randevu Al' : 'Schedule Consultation'}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            <div className="md:col-span-3 text-xs space-y-1.5 text-slate-500">
              <div className="text-slate-900 font-bold text-xs mb-1">
                {locale === 'tr' ? 'Standartlar & Taksonomi' : 'Standards & Taxonomy'}
              </div>
              <div>• Erasmus+ KA121/KA122 VET</div>
              <div>• ESCO v1.1.1 & ISCED-F 2013</div>
              <div>• ECVET & Europass Uyumlu</div>
            </div>

            <div className="md:col-span-3 text-xs space-y-1.5 text-slate-500">
              <div className="text-slate-900 font-bold text-xs mb-1">
                {locale === 'tr' ? 'Güvenlik & Gizlilik' : 'Security & Privacy'}
              </div>
              <div>
                • {locale === 'tr' ? '6698 sayılı KVKK Uyumlu' : 'EU GDPR 2016/679 Compliant'}
              </div>
              <div>
                • {locale === 'tr' ? 'Denetlenebilir İşlem Kayıtları' : 'Auditable Transaction Trails'}
              </div>
              <div>
                • {locale === 'tr' ? 'Uçtan Uca Güvenli Veri Saklama' : 'End-to-End Secure Storage'}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
            <div>© 2026 CAPPINNO • Tüm hakları saklıdır.</div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <button
                type="button"
                onClick={() => openLegal('LEGAL')}
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500"
              >
                {locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'GDPR Privacy Policy'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegal('TERMS')}
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500"
              >
                {locale === 'tr' ? 'Kullanım Koşulları' : 'Terms of Use'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegal('COOKIES')}
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500"
              >
                {locale === 'tr' ? 'Çerez Tercihleri' : 'Cookie Preferences'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => openLegal('RETENTION')}
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500"
              >
                {locale === 'tr' ? 'Veri Saklama & İmha' : 'Data Retention'}
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => setIsAppointmentOpen(true)}
                className="hover:text-blue-700 hover:underline transition-colors font-bold text-blue-700 cursor-pointer"
              >
                {locale === 'tr' ? 'Randevu Al' : 'Book Appointment'}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Language-exclusive Legal Modal */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        initialTab={legalTab}
      />

      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </>
  );
}
