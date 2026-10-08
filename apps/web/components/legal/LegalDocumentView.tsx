'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';

export type LegalTabType = 'LEGAL' | 'TERMS' | 'COOKIES' | 'ACCESSIBILITY' | 'RETENTION';

export interface LegalDocumentViewProps {
  initialTab?: LegalTabType;
  isModal?: boolean;
  onClose?: () => void;
}

export default function LegalDocumentView({
  initialTab = 'LEGAL',
  isModal = false,
  onClose,
}: LegalDocumentViewProps) {
  const { locale } = useTranslation();

  const resolveTab = (tab: LegalTabType): 'LEGAL' | 'TERMS' | 'COOKIES' | 'ACCESSIBILITY' => {
    if (tab === 'COOKIES') return 'COOKIES';
    if (tab === 'ACCESSIBILITY') return 'ACCESSIBILITY';
    if (tab === 'TERMS' || tab === 'RETENTION') return 'TERMS';
    return 'LEGAL';
  };

  const [activeTab, setActiveTab] = useState<'LEGAL' | 'TERMS' | 'COOKIES' | 'ACCESSIBILITY'>(
    resolveTab(initialTab)
  );
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textMap = {
      LEGAL:
        locale === 'tr'
          ? 'KVKK Aydınlatma Metni - ErasmusMobility (erasmusmobility.com)'
          : 'GDPR Privacy Notice - ErasmusMobility (erasmusmobility.com)',
      TERMS:
        locale === 'tr'
          ? 'Platform Katılım Koşullarını Kabul ve Açık Rıza Beyanı - ErasmusMobility (erasmusmobility.com)'
          : 'Platform Participation Terms Acceptance and Explicit Consent Declaration - ErasmusMobility (erasmusmobility.com)',
      COOKIES:
        locale === 'tr'
          ? 'Çerez Politikası - ErasmusMobility (erasmusmobility.com)'
          : 'Cookie Policy - ErasmusMobility (erasmusmobility.com)',
      ACCESSIBILITY:
        locale === 'tr'
          ? 'Erişilebilirlik Beyanı - ErasmusMobility (erasmusmobility.com)'
          : 'Accessibility Statement - ErasmusMobility (erasmusmobility.com)',
    };
    navigator.clipboard.writeText(textMap[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`w-full bg-white ${isModal ? '' : 'rounded-2xl border-2 border-slate-200 shadow-sm'} overflow-hidden`}>
      {/* Header */}
      <div className="bg-white px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-2.5 rounded-xl text-slate-800 border border-slate-300 shrink-0">
            <span className="text-xl">⚖️</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight m-0">
                {locale === 'tr' ? 'Hukuki Çerçeve ve Yasal Metinler' : 'Legal Compliance & Terms'}
              </h1>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-mono">
                erasmusmobility.com • EMaaS v1.0
              </span>
            </div>
            <p className="text-xs text-slate-500 m-0 mt-0.5">
              {locale === 'tr'
                ? 'ErasmusMobility veri koruma aydınlatması, katılım koşulları ve erişilebilirlik taahhüdü'
                : 'ErasmusMobility data governance notice, participation terms, and accessibility declaration'}
            </p>
          </div>
        </div>

        {isModal && onClose && (
          <button
            type="button"
            className="rounded-xl bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200 cursor-pointer"
            onClick={onClose}
            title="Kapat"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-100 px-4 sm:px-6 pt-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab('LEGAL')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'LEGAL'
              ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
              : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <span>📄</span>
          <span>{locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'GDPR Privacy Notice'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300 font-mono">
            {locale === 'tr' ? '6698 SK' : 'EU 2016/679'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('TERMS')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'TERMS'
              ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
              : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <span>📋</span>
          <span>{locale === 'tr' ? 'Platform Katılım Koşulları & Açık Rıza' : 'Terms & Explicit Consent'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300 font-mono">
            v1.0
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('COOKIES')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'COOKIES'
              ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
              : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <span>🍪</span>
          <span>{locale === 'tr' ? 'Çerez Politikası' : 'Cookie Policy'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300 font-mono">
            e-Privacy
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ACCESSIBILITY')}
          className={`px-4 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === 'ACCESSIBILITY'
              ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
              : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          <span>♿</span>
          <span>{locale === 'tr' ? 'Erişilebilirlik Beyanı' : 'Accessibility Statement'}</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300 font-mono">
            WCAG 2.2
          </span>
        </button>
      </div>

      {/* Content Body */}
      <div className={`p-4 sm:p-6 text-xs text-slate-700 leading-relaxed font-sans ${isModal ? 'max-h-[60vh] overflow-y-auto' : ''}`}>
        {activeTab === 'LEGAL' && (
          locale === 'tr' ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) MADDE 10 KAPSAMINDA AYDINLATMA METNİ
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Platform: erasmusmobility.com • Sürüm: 1.0 (2026) • Veri Sorumlusu: ErasmusMobility Teknoloji Ltd. Şti.
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                  <span>⚖️</span>
                  <span>YASAL UYARI: PLATFORMUN ROLÜ VE BAĞIMSIZLIK BEYANI</span>
                </div>
                <p className="m-0 text-[11px] text-amber-900 leading-relaxed font-normal">
                  ErasmusMobility.com; mesleki eğitim kurumları, meslek liseleri ve ev sahibi işletmeler için bağımsız bir dijital planlama, eşleştirme ve kurumsal hazırlık platformudur. <strong>ErasmusMobility; Avrupa Birliği, Avrupa Komisyonu, Türkiye Ulusal Ajansı veya herhangi bir ülkenin Ulusal Ajansı&apos;nın resmi bir organı, kamu iştiraki veya yetkili karar vericisi DEĞİLDİR.</strong> Resmi hibe tahsisatı ve hibe onay yetkisi münhasıran ilgili Ulusal Ajanslara aittir.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Veri Sorumlusu Sıfatı ve İletişim Kanalları
                </h2>
                <p className="m-0">
                  6698 sayılı Kanun uyarınca veri sorumlusu, <strong>ErasmusMobility Teknoloji Ltd. Şti.</strong>&apos;dir. Resmi İletişim ve İlgili Kişi Başvuru Adresi: <strong>info@erasmusmobility.com</strong>, Kapadokya Teknopark, Nevşehir.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  2. İşlenen Veriler ve Amaçları
                </h2>
                <p className="m-0">
                  Platform kapsamında yalnızca kurumsal kullanıcıların ad-soyad, kurumsal e-posta adresi, okul OID numarası ve Erasmus+ hareketlilik planlama tercihleri işlenir. Özel nitelikli kişisel veriler işlenmez.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  3. Veri Güvenliği ve İlgili Kişi Hakları
                </h2>
                <p className="m-0">
                  KVKK Madde 11 uyarınca verilerinize erişme, düzeltilmesini veya silinmesini talep etme hakkınız mevcuttur. Başvurularınızı <strong>info@erasmusmobility.com</strong> adresine iletebilirsiniz. Talepleriniz en geç 30 gün içinde ücretsiz sonuçlandırılır.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  GENERAL DATA PROTECTION REGULATION (GDPR EU 2016/679) PRIVACY NOTICE
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Platform: erasmusmobility.com • Version: 1.0 (2026) • Data Controller: ErasmusMobility Teknoloji Ltd. Şti.
                </div>
              </div>

              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-amber-950 text-xs flex items-center gap-1.5">
                  <span>⚖️</span>
                  <span>LEGAL NOTICE: INDEPENDENCE DECLARATION</span>
                </div>
                <p className="m-0 text-[11px] text-amber-900 leading-relaxed font-normal">
                  ErasmusMobility.com is an independent preparation and partner matching platform. It is <strong>NOT</strong> an official body or agency of the European Union, the European Commission, or any National Agency. All official grant allocations remain the sole prerogative of National Agencies.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Data Controller
                </h2>
                <p className="m-0">
                  The data controller is <strong>ErasmusMobility Teknoloji Ltd. Şti.</strong> (Operating entity of ErasmusMobility.com). Official DPO &amp; Data Subject Inquiries: <strong>info@erasmusmobility.com</strong>, Kapadokya Teknopark, Nevşehir, Türkiye.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  2. Lawful Basis and Data Subject Rights
                </h2>
                <p className="m-0">
                  Data processing is based on GDPR Article 6(1)(b) (contract performance) and Article 6(1)(f) (legitimate interest). You have the right to access, rectify, or erase your personal data under Articles 15-22 by contacting <strong>info@erasmusmobility.com</strong>.
                </p>
              </div>
            </div>
          )
        )}

        {activeTab === 'TERMS' && (
          locale === 'tr' ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  PLATFORM KATILIM KOŞULLARI VE AÇIK RIZA BEYANI
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Platform: erasmusmobility.com • Sürüm: 1.0 (2026) • İşletici: ErasmusMobility Teknoloji Ltd. Şti.
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Hizmet Kapsamı ve Tarafların Yükümlülükleri
                </h2>
                <p className="m-0">
                  ErasmusMobility, mesleki eğitim kurumları (gönderen kurumlar) ile Avrupa&apos;daki ev sahibi işletmeleri doğrudan buluşturur. İlk yıl kurumsal üyelik ve temel eşleştirme araçları %100 ücretsizdir.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  2. Sorumluluğun Sınırlandırılması
                </h2>
                <p className="m-0">
                  Platform üzerinden üretilen bütçe hesaplamaları ve evrak şablonları tavsiye ve taslak niteliğindedir. Kurumlar resmi başvurularını kendi yetkili OID kodları ile resmi Avrupa Komisyonu portalları üzerinden yaparlar.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  3. Hukuki Bildirimler ve Sağlayıcı Desteği
                </h2>
                <p className="m-0">
                  Platform katılım şartları, ev sahibi kurum (provider) doğrulaması veya hukuki bildirimleriniz için resmi irtibat adresi: <strong>info@erasmusmobility.com</strong>.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  PLATFORM PARTICIPATION TERMS AND CONDITIONS
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Platform: erasmusmobility.com • Version: 1.0 (2026) • Operator: ErasmusMobility Teknoloji Ltd. Şti.
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Scope of Service
                </h2>
                <p className="m-0">
                  ErasmusMobility facilitates direct connection between VET sending schools and European host enterprises with zero intermediary brokerage fees.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  2. Limitation of Liability
                </h2>
                <p className="m-0">
                  Calculators and document drafts provided are advisory working templates. Formal proposal submission is conducted by applicant organisations directly through Commission platforms.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  3. Legal Notices &amp; Provider Support
                </h2>
                <p className="m-0">
                  For formal legal notices, provider onboarding inquiries, or contract questions, official contact: <strong>info@erasmusmobility.com</strong>.
                </p>
              </div>
            </div>
          )
        )}

        {activeTab === 'COOKIES' && (
          locale === 'tr' ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  ÇEREZ POLİTİKASI VE AYDINLATMA METNİ
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  e-Privacy Direktifi ve 6698 sayılı KVKK Kapsamında Bilgilendirme
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Çerez Kullanım İlkemiz
                </h2>
                <p className="m-0">
                  ErasmusMobility platformu, ziyaretçileri izinsiz takip eden ticari veya reklam amaçlı 3. parti çerezler kullanmaz. Yalnızca oturum güvenliği (Clerk Auth), dil tercihi (TR/EN) ve güvenli form işleyişi için zorunlu teknik çerezler kullanılır.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-[500px] w-full divide-y divide-slate-200 text-left text-[11px]">
                  <thead className="bg-slate-50 font-bold text-slate-900">
                    <tr>
                      <th className="py-2.5 px-3">Çerez Adı</th>
                      <th className="py-2.5 px-3">Tür</th>
                      <th className="py-2.5 px-3">Amaç</th>
                      <th className="py-2.5 px-3">Süre</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-900">__session / __client_uat</td>
                      <td className="py-2 px-3 text-slate-600">Zorunlu Güvenlik</td>
                      <td className="py-2 px-3 text-slate-600">Oturum açma ve kimlik doğrulama</td>
                      <td className="py-2 px-3 text-slate-600">Oturum Süresince</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-mono font-semibold text-slate-900">em_locale</td>
                      <td className="py-2 px-3 text-slate-600">İşlevsel Tercih</td>
                      <td className="py-2 px-3 text-slate-600">Seçilen arayüz dili (Türkçe / İngilizce)</td>
                      <td className="py-2 px-3 text-slate-600">1 Yıl</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  COOKIE POLICY & TECHNICAL DECLARATION
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Compliance with EU e-Privacy Directive and GDPR Article 7
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Strictly Necessary Cookies Only
                </h2>
                <p className="m-0">
                  ErasmusMobility does not employ third-party advertising or behavioral tracking pixels. We use strictly necessary session cookies for authentication (Clerk Auth) and preference cookies for UI localization.
                </p>
              </div>
            </div>
          )
        )}

        {activeTab === 'ACCESSIBILITY' && (
          locale === 'tr' ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  ERİŞİLEBİLİRLİK BEYANI (ACCESSIBILITY STATEMENT)
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Web İçeriği Erişilebilirlik Kılavuzları (WCAG 2.2 AA Düzeyi) & Avrupa Erişilebilirlik Yasası (EN 301 549) Uyumluluk Taahhüdü
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Erişilebilirlik Taahhüdümüz
                </h2>
                <p className="m-0">
                  ErasmusMobility, mesleki eğitim kurumları, dezavantajlı öğrenciler ve özel gereksinimli katılımcılar dahil olmak üzere tüm kullanıcıların dijital içeriklere engelsiz erişimini sağlamayı taahhüt eder. Platformumuz W3C WCAG 2.2 AA başarı kriterleri ile AB Direktifi (EU) 2019/882 (European Accessibility Act) gerekliliklerine tam uyum hedefiyle geliştirilmektedir.
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  2. Teknik Uyumluluk Standartları (WCAG 2.2 AA)
                </h2>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs leading-relaxed">
                  <li><strong>Klavye Navigasyonu ve Belirgin Odak (2.4.7 / 2.4.11):</strong> Tüm etkileşimli öğeler klavye ile erişilebilir; odak göstergeleri (focus indicator) gizlenmez ve içeriklerce örtülmez.</li>
                  <li><strong>Asgari Tıklama Hedef Boyutu (2.5.8):</strong> Etkileşimli buton ve bağlantılar dokunmatik ve masaüstü arayüzlerde en az 24×24 piksel hedef boyutunu karşılar.</li>
                  <li><strong>Ekran Okuyucu Desteği (1.3.1 / 4.1.2):</strong> Form alanları benzersiz id, programatik label-for, aria-describedby ve geçerlilik durumlarıyla NVDA, JAWS ve VoiceOver uyumludur.</li>
                  <li><strong>Yüksek Kontrast ve Tipografi (1.4.3 / 1.4.10):</strong> Normal metinlerde en az 4.5:1 kontrast sağlanır; %200 ve %400 yakınlaştırmada yatay kaydırma olmaksızın duyarlı (responsive) akış korunur.</li>
                  <li><strong>Yinelenen Veri Girişinin Önlenmesi (3.3.7):</strong> Başvuru ve pipeline formlarında daha önce girilen veriler otomatik taşınarak gereksiz tekrar engellenir.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  3. Geri Bildirim ve İletişim
                </h2>
                <p className="m-0">
                  Erişilebilirlikle ilgili herhangi bir engelle karşılaşırsanız lütfen <strong>accessibility@erasmusmobility.com</strong> adresinden bize bildirin. Bildirimleriniz öncelikli olarak değerlendirilir. Genel platform desteği ve kurumsal danışmanlık talepleriniz için <strong>info@erasmusmobility.com</strong> adresi üzerinden de bize ulaşabilirsiniz.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="font-extrabold text-slate-950 text-sm">
                  WEB ACCESSIBILITY STATEMENT
                </div>
                <div className="text-[11px] text-slate-600 font-medium">
                  Commitment to WCAG 2.2 AA & European Accessibility Act (EN 301 549) Standards
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  1. Our Accessibility Commitment
                </h2>
                <p className="m-0">
                  ErasmusMobility is dedicated to ensuring digital accessibility for all users, including participants with special needs and VET learners with fewer opportunities. Our platform adheres to W3C WCAG 2.2 Level AA success criteria and the European Accessibility Act (Directive (EU) 2019/882 / EN 301 549).
                </p>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  2. Technical Compliance (WCAG 2.2 AA)
                </h2>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-600 text-xs leading-relaxed">
                  <li><strong>Keyboard Navigation & Unobscured Focus (2.4.7 / 2.4.11):</strong> Complete keyboard operability via Tab navigation with highly visible, unobscured focus rings.</li>
                  <li><strong>Target Size Minimum (2.5.8):</strong> Interactive elements maintain a minimum target size of 24×24 pixels for pointer and touch accuracy.</li>
                  <li><strong>Programmatic Labelling (1.3.1 / 4.1.2):</strong> All input elements feature unique IDs, explicit label associations, and ARIA descriptors for NVDA, JAWS, and VoiceOver.</li>
                  <li><strong>Color Contrast & Reflow (1.4.3 / 1.4.10):</strong> Text maintains at least 4.5:1 contrast; responsive layout adapts cleanly up to 200% and 400% zoom without horizontal scroll.</li>
                  <li><strong>Redundant Entry Prevention (3.3.7):</strong> Information previously entered in institutional profiles is automatically reused across drafting steps.</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider m-0">
                  3. Feedback and Contact
                </h2>
                <p className="m-0">
                  If you encounter any accessibility barrier on our platform, please reach out directly to <strong>accessibility@erasmusmobility.com</strong>. For general platform assistance, institutional partnerships, and support: <strong>info@erasmusmobility.com</strong>.
                </p>
              </div>
            </div>
          )
        )}
      </div>

      {/* Footer Actions */}
      <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
          <span>🔒 256-bit SSL</span>
          <span>•</span>
          <span>{locale === 'tr' ? 'Cloudflare R2 Şifreli Kasa' : 'Cloudflare R2 Encrypted Vault'}</span>
          <span>•</span>
          <span className="font-bold text-slate-700">
            {locale === 'tr' ? '6698 KVKK Uyumlu' : 'EU GDPR Compliant'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            title={locale === 'tr' ? 'Başlığı Panoya Kopyala' : 'Copy Title to Clipboard'}
          >
            {copied ? (locale === 'tr' ? '✓ Kopyalandı' : '✓ Copied') : '📋 ' + (locale === 'tr' ? 'Kopyala' : 'Copy')}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
          >
            🖨️ {locale === 'tr' ? 'Yazdır' : 'Print'}
          </button>

          {isModal && onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              {locale === 'tr' ? 'Kapat' : 'Close'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
