'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
      <footer role="contentinfo" className="border-t border-slate-200 bg-white mt-16 pt-10 pb-20 sm:pb-12 text-slate-600 no-print">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b border-slate-100 pb-8 mb-6">
            <div className="md:col-span-6 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo.png"
                  alt="ErasmusMobility"
                  className="h-7 w-auto object-contain"
                />
                <span className="font-bold text-slate-900 text-sm hidden sm:inline">
                  • {locale === 'tr'
                    ? 'Erasmus+ Mesleki Eğitim Hareketlilik Platformu'
                    : 'Mobility Planning and Matching Platform'}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                {t.footer.subtitle}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsAppointmentOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 font-bold text-xs transition-colors shadow-2xs cursor-pointer"
                >
                  <span>{locale === 'tr' ? 'Danışmanlık İçin Randevu Al' : 'Schedule Consultation'}</span>
                  <span>→</span>
                </button>
                <a
                  href="mailto:info@erasmusmobility.com"
                  className="inline-flex items-center gap-1 text-xs text-slate-600 hover:text-blue-700 hover:underline font-semibold transition-colors"
                >
                  <span>✉️</span>
                  <span>info@erasmusmobility.com</span>
                </a>
              </div>
            </div>

            <div className="md:col-span-3 text-xs space-y-1.5 text-slate-500">
              <div className="text-slate-900 font-bold text-xs mb-1">
                {locale === 'tr' ? 'Standartlar & Taksonomi' : 'Standards & Taxonomy'}
              </div>
              <div>• Erasmus+ KA121/KA122 VET</div>
              <div>• ESCO v1.1.1 & ISCED-F 2013</div>
              <div>
                • {locale === 'tr'
                    ? 'Öğrenme Çıktıları ve Europass Mobility ile Uyumlu'
                    : 'Aligned with Learning Outcomes and Europass Mobility'}
              </div>
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

          {/* Institutional Role & Official Disclaimer Block */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-[11px] text-slate-500 leading-relaxed mb-6 space-y-2">
            <div className="flex items-center gap-2 font-black text-slate-800 text-xs">
              <span>⚖️</span>
              <span>
                {locale === 'tr'
                  ? 'Yasal Feragatname ve Platformun Rolü (Legal Disclaimer & Scope)'
                  : 'Legal Disclaimer & Platform Scope'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                {locale === 'tr' ? 'Bağımsız Platform' : 'Independent Tool'}
              </span>
            </div>
            <p className="m-0 text-slate-600 leading-relaxed font-normal">
              {locale === 'tr'
                ? "ErasmusMobility.com; mesleki eğitim kurumları, meslek liseleri ve Avrupa ev sahibi işletmeleri için geliştirilmiş bağımsız bir planlama, eşleştirme ve resmi evrak hazırlık destek platformudur. ErasmusMobility; Avrupa Birliği, Avrupa Komisyonu, Türkiye Ulusal Ajansı veya herhangi bir ülkenin resmi Erasmus+ Ulusal Otoritesinin resmi bir kuruluşu, iştiraki veya kamu kurumu DEĞİLDİR. 'Erasmus+' ismi ve logosu Avrupa Birliği'nin tescilli ticari markalarıdır. Platform üzerinde sunulan hibe simülasyonları, yetkinlik ölçümleri ve evrak taslakları kurumsal planlama ve kolaylaştırma amaçlı olup; resmi başvuru kabulü, hibe tahsisi ve akreditasyon kararları münhasıran ilgili Ulusal Ajanslar ile Avrupa Komisyonu'nun yetki ve takdirindedir."
                : "ErasmusMobility.com is an independent digital planning, partner matching, and documentation preparation support platform for vocational institutions and European host enterprises. ErasmusMobility is NOT an official agency, body, or affiliate of the European Union, the European Commission, the Turkish National Agency, or any National Authority. 'Erasmus+' is a registered trademark of the European Union. All grant budget simulations, competence scorecards, and document drafts generated on this platform are for institutional planning and preparatory purposes only; formal accreditation, grant allocation, and project selection decisions rest solely with official National Agencies and the European Commission."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-400 sm:pr-48">
            <div>
              {locale === 'tr'
                ? '© 2026 ErasmusMobility.com • Tüm hakları saklıdır.'
                : '© 2026 ErasmusMobility.com • All rights reserved.'}
            </div>
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <a
                href="mailto:info@erasmusmobility.com"
                className="hover:text-blue-700 hover:underline transition-colors font-bold text-slate-700 cursor-pointer inline-flex items-center gap-1"
              >
                <span>✉️</span>
                <span>Contact: info@erasmusmobility.com</span>
              </a>
              <span>•</span>
              <Link
                href="/privacy"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey) return;
                  e.preventDefault();
                  openLegal('LEGAL');
                }}
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500 cursor-pointer"
              >
                {locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'GDPR Privacy Policy'}
              </Link>
              <span>•</span>
              <Link
                href="/terms"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey) return;
                  e.preventDefault();
                  openLegal('TERMS');
                }}
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500 cursor-pointer"
              >
                {locale === 'tr' ? 'Kullanım Koşulları ve Açık Rıza' : 'Platform Participation Terms & Consent'}
              </Link>
              <span>•</span>
              <Link
                href="/cookies"
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey) return;
                  e.preventDefault();
                  openLegal('COOKIES');
                }}
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500 cursor-pointer"
              >
                {locale === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}
              </Link>
              <span>•</span>
              <Link
                href="/accessibility"
                className="hover:text-blue-700 hover:underline transition-colors font-medium text-slate-500 cursor-pointer"
              >
                {locale === 'tr' ? 'Erişilebilirlik' : 'Accessibility'}
              </Link>
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
