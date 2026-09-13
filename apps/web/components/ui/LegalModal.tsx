'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';

export type LegalTabType = 'LEGAL' | 'TERMS' | 'COOKIES' | 'RETENTION';

export interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LegalTabType;
}

export default function LegalModal({
  isOpen,
  onClose,
  initialTab = 'LEGAL',
}: LegalModalProps) {
  const { t, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState<LegalTabType>(initialTab);
  const [copied, setCopied] = useState(false);

  // Cookie preferences state
  const [cookiePrefs, setCookiePrefs] = useState<{
    necessary: boolean;
    functional: boolean;
    analytics: boolean;
  }>({
    necessary: true,
    functional: true,
    analytics: false,
  });
  const [saveToast, setSaveToast] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      // Load saved preferences if available
      try {
        const saved = localStorage.getItem('cappinno_cookie_prefs');
        if (saved) {
          setCookiePrefs(JSON.parse(saved));
        }
      } catch (err) {
        // Fallback to default
      }
    }
  }, [isOpen, initialTab]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  const handleSaveCookiePrefs = () => {
    localStorage.setItem('cappinno_cookie_prefs', JSON.stringify(cookiePrefs));
    localStorage.setItem('cappinno_cookie_consent', 'CUSTOM');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleAcceptAllCookies = () => {
    const allOn = { necessary: true, functional: true, analytics: true };
    setCookiePrefs(allOn);
    localStorage.setItem('cappinno_cookie_prefs', JSON.stringify(allOn));
    localStorage.setItem('cappinno_cookie_consent', 'ALL');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleRejectAllCookies = () => {
    const onlyNec = { necessary: true, functional: false, analytics: false };
    setCookiePrefs(onlyNec);
    localStorage.setItem('cappinno_cookie_prefs', JSON.stringify(onlyNec));
    localStorage.setItem('cappinno_cookie_consent', 'NECESSARY');
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleCopy = () => {
    const textMap: Record<LegalTabType, string> = {
      LEGAL:
        locale === 'tr'
          ? 'KVKK Aydınlatma Metni - CAPPINNO Mobility Nexus (erasmusmobility.com)'
          : 'GDPR Privacy & Data Protection Policy - CAPPINNO Mobility Nexus (erasmusmobility.com)',
      TERMS:
        locale === 'tr'
          ? 'Kullanım Koşulları - CAPPINNO Mobility Nexus'
          : 'Terms of Use - CAPPINNO Mobility Nexus',
      COOKIES:
        locale === 'tr'
          ? 'Çerez Politikası ve Tercihleri - CAPPINNO Mobility Nexus'
          : 'Cookie Policy & Preferences - CAPPINNO Mobility Nexus',
      RETENTION:
        locale === 'tr'
          ? 'Veri Saklama ve İmha Politikası - CAPPINNO Mobility Nexus'
          : 'Data Retention and Disposal Policy - CAPPINNO Mobility Nexus',
    };
    navigator.clipboard.writeText(textMap[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex min-h-screen items-center justify-center p-3 sm:p-4 text-center">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity z-0"
          aria-hidden="true"
          onClick={onClose}
        />

        <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
          &#8203;
        </span>

        {/* Modal Window (Flat, Zero Gradient, Accessible) */}
        <div className="relative z-10 inline-block transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-2xl transition-all sm:my-8 w-full sm:max-w-5xl sm:align-middle border-2 border-slate-300">
          {/* Header */}
          <div className="bg-white px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2.5 rounded-xl text-slate-800 border border-slate-300 shrink-0">
                <span className="text-xl">⚖️</span>
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-950 tracking-tight m-0" id="modal-title">
                    {locale === 'tr' ? 'Hukuki Çerçeve ve Uyumluluk Paketi' : 'Legal Compliance & Governance'}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-mono">
                    erasmusmobility.com • EMaaS v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  {locale === 'tr'
                    ? 'CAPPINNO Mobility Nexus veri güvenliği, karar destek ilkeleri ve kullanım şartları'
                    : 'CAPPINNO Mobility Nexus data governance, decision-support bounds and terms of service'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200"
              onClick={onClose}
              title={t.legal.close}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 4 Navigation Tabs (Strictly Language-Exclusive: TR -> KVKK, EN -> GDPR) */}
          <div className="bg-slate-100 px-4 sm:px-6 pt-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Tab 1: KVKK (TR) or GDPR (EN) */}
            <button
              type="button"
              onClick={() => setActiveTab('LEGAL')}
              className={`px-3.5 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'LEGAL'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>📄</span>
              <span>{locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'GDPR Privacy Policy'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 text-slate-700 border border-slate-300 font-mono">
                {locale === 'tr' ? '6698 SK' : 'EU 2016/679'}
              </span>
            </button>

            {/* Tab 2: Terms of Use */}
            <button
              type="button"
              onClick={() => setActiveTab('TERMS')}
              className={`px-3.5 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'TERMS'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>📋</span>
              <span>{locale === 'tr' ? 'Kullanım Koşulları' : 'Terms of Use'}</span>
            </button>

            {/* Tab 3: Cookies & Preferences */}
            <button
              type="button"
              onClick={() => setActiveTab('COOKIES')}
              className={`px-3.5 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'COOKIES'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🍪</span>
              <span>{locale === 'tr' ? 'Çerez Politikası & Tercihleri' : 'Cookie Policy & Preferences'}</span>
            </button>

            {/* Tab 4: Data Retention & Disposal */}
            <button
              type="button"
              onClick={() => setActiveTab('RETENTION')}
              className={`px-3.5 py-2.5 text-xs font-extrabold rounded-t-xl border-t-2 border-x-2 transition-all flex items-center gap-2 shrink-0 ${
                activeTab === 'RETENTION'
                  ? 'bg-white border-slate-300 text-slate-950 -mb-[1px] shadow-2xs'
                  : 'bg-slate-200/70 border-transparent text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              <span>🗄️</span>
              <span>{locale === 'tr' ? 'Veri Saklama & İmha' : 'Data Retention & Disposal'}</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-6 md:p-8 max-h-[62vh] overflow-y-auto space-y-6 text-xs text-slate-700 leading-relaxed font-normal bg-white">
            {/* ============================================================ */}
            {/* TAB 1: LEGAL (KVKK or GDPR)                                  */}
            {/* ============================================================ */}
            {activeTab === 'LEGAL' && (
              locale === 'tr' ? (
                /* Turkish: 6698 Sayılı KVKK Kapsamında Aydınlatma Metni */
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="font-extrabold text-slate-950 text-sm">
                      6698 SAYILI KİŞİSEL VERİLERİN KORUNMASI KANUNU (KVKK) MADDE 10 KAPSAMINDA AYDINLATMA METNİ
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Platform: erasmusmobility.com • Sürüm: 1.0 (2026) • Veri Sorumlusu: CAPPINNO Bilişim ve Danışmanlık Hizmetleri (“CAPPINNO”)
                    </div>
                  </div>

                  {/* 1. Veri Sorumlusu */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      1. Veri Sorumlusu Sıfatı ve İletişim Kanalları
                    </h4>
                    <p className="m-0">
                      6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca veri sorumlusu, merkezi Türkiye'de bulunan <strong>CAPPINNO Bilişim ve Danışmanlık Hizmetleri</strong>'dir. Şirketimiz, erasmusmobility.com platformu üzerinden sunulan Erasmus+ KA121/KA122 VET hareketlilik yönetimi, yetkinlik değerlendirme ve kurumsal eşleştirme (EMaaS) hizmetleri kapsamında verilerinizi Kanun'a uygun olarak işlemektedir.
                    </p>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div><strong>İletişim & Destek:</strong> Platform Yönetim Paneli / Destek Masası</div>
                      <div><strong>Veri Güvenliği Birimi:</strong> CAPPINNO Bilgi Güvenliği Masası</div>
                    </div>
                  </div>

                  {/* 2. İşlenen Veriler ve Tablo */}
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      2. İşlenen Kişisel Veri Grupları
                    </h4>
                    <p className="m-0">
                      Platformumuz kapsamında yalnızca hizmetin doğası ve mevzuatın gerektirdiği asgari veriler işlenir. Özel nitelikli kişisel veri (sağlık, ceza kaydı, biyometrik vb.) zorunlu olmadıkça kesinlikle talep edilmez.
                    </p>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="min-w-[580px] w-full divide-y divide-slate-200 text-left">
                        <thead className="bg-slate-50 font-bold text-slate-900 text-[11px]">
                          <tr>
                            <th className="py-2.5 px-3">Veri Kategorisi</th>
                            <th className="py-2.5 px-3">İşlenen Başlıca Veriler</th>
                            <th className="py-2.5 px-3">İşleme Amacı</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-[11px]">
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-900">Kimlik & İletişim</td>
                            <td className="py-2 px-3 text-slate-600">Ad-soyad, kurumsal e-posta, telefon, görev/unvan, kullanıcı kimliği.</td>
                            <td className="py-2 px-3 text-slate-600">Hesap açma, doğrulama, kurumsal temsilci iletişimi.</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-900">Kurum & Proje</td>
                            <td className="py-2 px-3 text-slate-600">Okul/kurum adı, il/ilçe, OID, Erasmus akreditasyonu, hareketlilik hedefleri.</td>
                            <td className="py-2 px-3 text-slate-600">KA121/KA122 planlaması, hibe simülasyonu, eşleştirme.</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-900">Katılımcı & Yetkinlik</td>
                            <td className="py-2 px-3 text-slate-600">Katılımcı/grup kodu, meslek alanı (ISCED-F), ESCO becerileri, test skorları.</td>
                            <td className="py-2 px-3 text-slate-600">Öğrenme çıktısı tespiti, ESCO eşleştirmesi, dosya hazırlığı.</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-900">Ev Sahibi (KYC)</td>
                            <td className="py-2 px-3 text-slate-600">İşletme sicil belgesi, vergi levhası, 7/24 acil durum irtibat yetkilisi.</td>
                            <td className="py-2 px-3 text-slate-600">Yönetici onay havuzu, öğrenci güvenliği, sahte kurum önleme.</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-900">Abonelik & Finans</td>
                            <td className="py-2 px-3 text-slate-600">Kurumsal fatura adresi, vergi no/TC, abonelik paketi (Basic/Pro/Premium), ödeme ve tahsilat kayıtları.</td>
                            <td className="py-2 px-3 text-slate-600">Abonelik sözleşmesinin ifası, TTK ve VUK uyarınca zorunlu mali ve muhasebe kayıtlarının tutulması.</td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 font-semibold text-slate-900">Sistem & Güvenlik</td>
                            <td className="py-2 px-3 text-slate-600">IP adresi, oturum belirteçleri, zaman damgası, denetim izi (audit log).</td>
                            <td className="py-2 px-3 text-slate-600">Siber güvenlik, sızma önleme, hukuki kayıt yükümlülüğü.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3. Hukuki Sebepler */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      3. Kişisel Veri İşlemenin Hukuki Sebepleri
                    </h4>
                    <p className="m-0">
                      Verileriniz, Kanun'un 5. maddesinde yer alan aşağıdaki somut şartlara dayanılarak işlenmektedir:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li><strong>Sözleşmenin kurulması ve ifası (m.5/2-c):</strong> Platform kurumsal üyeliği, abonelik paketleri, ev sahibi ve yararlanıcı eşleştirme süreçlerinin yürütülmesi ve rapor üretimi.</li>
                      <li><strong>Veri sorumlusunun hukuki yükümlülüğü (m.5/2-ç):</strong> 5651 sayılı Kanun gereği sistem erişim loglarının tutulması ile Türk Ticaret Kanunu ve Vergi Usul Kanunu uyarınca mali/fatura kayıtlarının muhafazası.</li>
                      <li><strong>Bir hakkın tesisi, kullanılması veya korunması (m.5/2-e):</strong> Olası hukuki uyuşmazlıklarda ispat külfetinin karşılanması.</li>
                      <li><strong>Meşru menfaat (m.5/2-f):</strong> Temel hak ve özgürlüklerinize zarar vermemek kaydıyla, platform siber güvenliğinin sağlanması ve sahte ev sahibi kurum başvurularının elenmesi.</li>
                    </ul>
                  </div>

                  {/* 4. Karar Destek Sistemi Uyarısı */}
                  <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                    <div className="font-bold text-blue-950 text-xs">
                      ⚖️ Önemli: Karar Destek Sistemi (Decision-Support) Güvencesi
                    </div>
                    <p className="m-0 text-blue-900 text-[11px] leading-relaxed">
                      Platformumuz tarafından üretilen KA121/KA122 karşılaştırma çıktıları, ESCO beceri eşleştirmeleri ve hareketlilik uygunluk puanları profesyonel karar destek mahiyetindedir. Kullanıcı veya katılımcı hakkında <strong>tek başına ve münhasıran otomatik analizle hukuki veya benzer ölçüde önemli bir sonuç doğuran karar bulunmamaktadır</strong>. Katılımcı seçimi, ev sahibi kurumla nihai sözleşme akdi ve hibe tahsisi ilgili okul idaresi, konsorsiyum lideri veya yetkili Ulusal Ajans tarafından takdir edilir.
                    </p>
                  </div>

                  {/* 5. 18 Yaş Altı Katılımcılar */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      5. 18 Yaş Altı Katılımcıların (Öğrencilerin) Veri Güvenliği
                    </h4>
                    <p className="m-0">
                      Mesleki ve Teknik Anadolu Lisesi (MTAL) öğrencilerinin hareketlilik planlamasında veri minimizasyonu esastır. Platforma veri girişi yapan gönderen okul temsilcisi; öğrencilerin ad-soyadı yerine mümkün olduğunca öğrenci/grup kodu kullanmakla ve 18 yaşından küçük öğrencilerin veli/vasilerine mevzuata uygun katmanlı aydınlatmayı sağlamakla yükümlüdür.
                    </p>
                  </div>

                  {/* 6. Paylaşım ve Yurt Dışına Aktarım */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      6. Verilerin Aktarımı ve Yurt Dışı Güvenceleri
                    </h4>
                    <p className="m-0">
                      Verileriniz; yalnızca hizmetin gerektirdiği ölçüde bilişim altyapı sağlayıcılarımıza (Cloudflare R2, Clerk Authentication), gönderen okulun açık talebiyle seçilen Avrupa merkezli ev sahibi işletmelere ve kanunen yetkili kamu kurumlarına aktarılır.
                    </p>
                    <p className="m-0 text-slate-600">
                      Yurt dışındaki ev sahibi kurumlara ilk eşleştirmede kimliksizleştirilmiş kurum ve grup profili iletilir; isimli katılımcı listeleri ancak hareketlilik operasyonunun kesinleştiği aşamada Kanun'un güncel 9. maddesindeki uygun güvence mekanizmaları (Standart Sözleşme veya istisnai aktarım şartları) çerçevesinde aktarılır.
                    </p>
                  </div>

                  {/* 7. İlgili Kişi Hakları */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      7. İlgili Kişi Olarak Kanun’un 11. Maddesindeki Haklarınız
                    </h4>
                    <p className="m-0">
                      Kanun’un 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, şartları oluştuğunda silinmesini veya yok edilmesini talep etme ve münhasıran otomatik sistemler vasıtasıyla aleyhinize bir sonucun ortaya çıkmasına itiraz etme haklarına sahipsiniz.
                    </p>
                    <p className="m-0 text-slate-600">
                      Başvurularınızı kimliğinizi tevsik edici belgelerle birlikte platform kullanıcı paneliniz üzerinden veya yazılı tebligat kanalıyla Şirketimize iletebilirsiniz. Talebiniz en geç 30 gün içinde ücretsiz olarak sonuçlandırılır.
                    </p>
                  </div>
                </div>
              ) : (
                /* English: EU GDPR 2016/679 Privacy Policy */
                <div className="space-y-6">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="font-extrabold text-slate-950 text-sm">
                      PRIVACY & PERSONAL DATA PROTECTION POLICY (REGULATION EU 2016/679 - GDPR)
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Platform: erasmusmobility.com • Version: 1.0 (2026) • Data Controller: CAPPINNO Bilişim ve Danışmanlık Hizmetleri (“CAPPINNO”)
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      1. Data Controller & Scope
                    </h4>
                    <p className="m-0">
                      This Privacy Policy governs the processing of personal data on erasmusmobility.com, an Erasmus+ Mobility-as-a-Service (EMaaS) platform operated by CAPPINNO. We are committed to protecting the fundamental privacy rights of European and international VET schools, hosting enterprises, and mobility coordinators in full compliance with the General Data Protection Regulation (GDPR - EU 2016/679).
                    </p>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div><strong>Support & Communications:</strong> Platform Support Desk / User Dashboard</div>
                      <div><strong>Storage Vault:</strong> Cloudflare R2 (Encrypted, Zero-Egress)</div>
                      <div><strong>Jurisdiction:</strong> European Union & Republic of Turkey</div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      2. Lawful Grounds for Processing (Article 6 GDPR)
                    </h4>
                    <ul className="list-disc pl-5 space-y-1 text-slate-600">
                      <li><strong>Contractual Performance (Art. 6(1)(b)):</strong> Enterprise onboarding, organisation profile creation, host and beneficiary matchmaking, mobility workflow tracking, ESCO-ISCED taxonomy alignment, dossier generation, and subscription package administration.</li>
                      <li><strong>Legal Obligation (Art. 6(1)(c)):</strong> Compliance with European Commission guidelines, Erasmus+ 5-year project documentation audit standards, and 10-year fiscal/commercial accounting retention rules.</li>
                      <li><strong>Legitimate Interests (Art. 6(1)(f)):</strong> Platform cybersecurity, fraud detection, and multi-tier verification (KYC) of European hosting institutions.</li>
                    </ul>
                  </div>

                  <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                    <div className="font-bold text-blue-950 text-xs">
                      ⚖️ Decision-Support Tool Statement (Article 22 GDPR)
                    </div>
                    <p className="m-0 text-blue-900 text-[11px] leading-relaxed">
                      Our platform outputs (KA121/KA122 readiness scoring, ESCO competence matching, and host recommendations) constitute <strong>advisory decision support</strong>. The Platform <strong>does not make decisions based solely on automated processing or profiling that produce legal or similarly significant effects</strong> on participants or institutions. Final participant selection, funding decisions, and contractual partnerships remain subject to human verification.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      3. Protection of Minor Participants (Under 18)
                    </h4>
                    <p className="m-0">
                      Where VET learners under 18 participate in mobility planning, data minimisation is strictly enforced. Institutional administrators are advised to use pseudonymous learner codes during initial planning. Sending schools warrant that they maintain valid parental/guardian authorization under applicable national educational legislation.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      4. Cross-Border Transfers & Storage Security
                    </h4>
                    <p className="m-0">
                      Institutional documents and verification records are stored in zero-egress, S3-compatible encrypted cloud vaults (Cloudflare R2, European data locations). International transfers between Sending Schools and European Host Organisations are executed under Standard Contractual Clauses (SCCs) and robust data processing agreements.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      5. Data Subject Rights (Articles 15–22 GDPR)
                    </h4>
                    <p className="m-0">
                      You have the right to access your personal data (Art. 15), obtain rectification of inaccurate data (Art. 16), request erasure / "Right to be Forgotten" (Art. 17), restrict processing (Art. 18), receive data portability (Art. 20), and object to processing (Art. 21). You may exercise these rights at any time through your verified institutional account dashboard.
                    </p>
                  </div>
                </div>
              )
            )}

            {/* ============================================================ */}
            {/* TAB 2: TERMS (Kullanım Koşulları / Terms of Use)             */}
            {/* ============================================================ */}
            {activeTab === 'TERMS' && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {locale === 'tr' ? 'CAPPINNO MOBILITY NEXUS KULLANIM KOŞULLARI' : 'CAPPINNO MOBILITY NEXUS TERMS OF USE'}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {locale === 'tr'
                      ? 'Kapsam: erasmusmobility.com • Hizmet Modeli: B2B SaaS Erasmus+ EMaaS Araç Seti • Sürüm: 1.0 (2026)'
                      : 'Scope: erasmusmobility.com • Model: B2B SaaS Erasmus+ EMaaS Toolset • Version: 1.0 (2026)'}
                  </div>
                </div>

                {/* 1. Hizmetin Niteliği ve EMaaS Araç Seti */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '1. Platformun Niteliği, EMaaS Araç Seti ve Süreç Kapsamı' : '1. Nature of Platform, EMaaS Toolset & Workflow'}
                  </h4>
                  <p className="m-0">
                    {locale === 'tr'
                      ? 'CAPPINNO Mobility Nexus (erasmusmobility.com); Erasmus+ Mesleki Eğitim (VET) alanında KA121 Akredite ve KA122 Kısa Dönemli hareketlilikleri yöneten gönderen kurumlar (Yararlanıcılar) ile Avrupalı ev sahibi işletmeleri (Hosts) bir araya getiren B2B SaaS yapısında entegre bir hareketlilik yönetim araç setidir (toolset). Platform; kurumsal profil oluşturma, akıllı eşleştirme (matching engine), hareketlilik yaşam döngüsünün uçtan uca dijital takibi, ESCO/ISCED-F taksonomik yetkinlik analizi, evrak/dossier otomasyonu ve nihai raporlama araçlarını kapsar.'
                      : 'CAPPINNO Mobility Nexus (erasmusmobility.com) is an enterprise B2B SaaS Erasmus Mobility-as-a-Service (EMaaS) toolset connecting sending educational institutions (Beneficiaries) with European hosting enterprises. The platform provides an integrated digital lifecycle workflow covering institutional profiling, intelligent partner matchmaking, end-to-end mobility monitoring, ESCO/ISCED-F competence analytics, dossier automation, and final reporting.'}
                  </p>
                </div>

                {/* 2. Ev Sahibi - Yararlanıcı Eşleştirmesi ve Süreç Takibi */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '2. Ev Sahibi ve Yararlanıcı Eşleştirmesi & Hareketlilik Takibi' : '2. Host-Beneficiary Matchmaking & Process Lifecycle'}
                  </h4>
                  <p className="m-0">
                    {locale === 'tr'
                      ? 'Kayıtlı yararlanıcı kurumlar ve doğrulanmış ev sahibi işletmeler, platform üzerinden sektörel, coğrafi ve faaliyet kriterlerine göre eşleşir. Eşleşme sonrasında staj programı, öğrenme hedefleri, tarih/kapasite mutabakatı ve hareketliliğin operasyonel aşamaları platform üzerinden adım adım takip edilir ve sonuçlandırılır. Taraflar, platform aracılığıyla paylaştıkları bilgilerin güncelliğinden, staj koşullarından ve kurumsal taahhütlerin ifasından karşılıklı olarak sorumludur.'
                      : 'Registered beneficiaries and verified hosting organizations connect through the platform based on sector, geography, and activity requirements. Following matching, internship milestones, learning outcomes, capacity schedules, and operational progress are tracked and concluded end-to-end. Both parties remain responsible for their commitments and accurate communication.'}
                  </p>
                </div>

                {/* 3. Abonelik Paketleri ve Faturalandırma */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '3. Abonelik Paketleri, Kullanım Hakları ve Faturalandırma' : '3. Subscription Plans, Entitlements and Billing'}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>
                      {locale === 'tr'
                        ? 'Platform hizmetleri kademeli kurumsal abonelik paketleri (Basic, Pro, Premium) şeklinde sunulur. Her paketin kapsadığı hareketlilik vaka sayısı, eşleştirme kotaları, yapay zeka evrak üretim limitleri ve ekip yetkilendirmeleri ilgili abonelik planında belirlenir.'
                        : 'Platform services are provided under tiered institutional subscription plans (Basic, Pro, Premium). Feature sets, mobility quotas, AI generation limits, and seat allocations are defined by the active tier.'}
                    </li>
                    <li>
                      {locale === 'tr'
                        ? 'Abonelik ücretleri, faturalandırma dönemleri (aylık/yıllık) ve ödeme koşulları kurumsal sözleşmeye tabidir. 6102 sayılı TTK ve Vergi Usul Kanunu uyarınca mali ve fatura kayıtları 10 yıl süreyle saklanır.'
                        : 'Subscription fees, billing cycles, and payment terms are governed by commercial agreements. Fiscal and invoice records are retained for 10 years pursuant to statutory tax and commercial codes.'}
                    </li>
                    <li>
                      {locale === 'tr'
                        ? 'Abonelik iptali veya paket değişikliklerinde, mevcut fatura dönemine ait haklar dönem sonuna kadar geçerliliğini korur; geçmiş dönemlere ait yasal muhasebe ve denetim kayıtları mevzuat gereğince silinemez.'
                        : 'Upon plan modification or cancellation, active entitlements remain valid through the current billing term. Historical audit and fiscal records cannot be expunged prior to statutory retention periods.'}
                    </li>
                  </ul>
                </div>

                {/* 4. Karar Destek Garantisizliği */}
                <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1">
                  <div className="font-bold text-amber-950 text-xs">
                    {locale === 'tr' ? '⚠️ Karar Destek ve Sonuç Garantisizliği Beyanı' : '⚠️ Advisory Nature & No Guarantee Disclaimer'}
                  </div>
                  <p className="m-0 text-amber-900 text-[11px] leading-relaxed">
                    {locale === 'tr'
                      ? 'Platform üzerinde sunulan eşleştirme skorları, ESCO yetkinlik analizleri, hibe simülasyonları ve doküman şablonları profesyonel karar destek araçlarıdır. CAPPINNO hiçbir koşulda hibe tahsisatı, Ulusal Ajans proje kabulü, ev sahibi işletmenin kesin stajyer onayı, vize/konsolosluk işlemleri veya projenin nihai finansal başarısı hususunda garanti taahhüt etmez.'
                      : 'All matching scores, ESCO competence mappings, grant simulations, and automated document templates serve as advisory decision support. CAPPINNO makes no warranty regarding grant allocation, National Agency approvals, host placement confirmation, consular visa issuance, or final financial outcomes.'}
                  </p>
                </div>

                {/* 5. Hesap ve Kurumsal Temsil Yetkisi */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '4. Hesap Güvenliği ve Kurumsal Temsil' : '4. Accounts and Institutional Authority'}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>
                      {locale === 'tr'
                        ? 'Kullanıcı, platformda işlem yaptığı okul, kurum veya işletme adına işlem yapmaya tam hukuki yetkisi olduğunu beyan ve taahhüt eder.'
                        : 'Users confirm that they possess the necessary legal authority to represent their educational or hosting institution.'}
                    </li>
                    <li>
                      {locale === 'tr'
                        ? 'Hesap giriş bilgileri üçüncü kişilerle paylaşılamaz; şüpheli yetkisiz erişim durumları derhal platform yöneticisine bildirilmelidir.'
                        : 'Credentials must be protected; suspected unauthorized access must be reported promptly to platform administration.'}
                    </li>
                    <li>
                      {locale === 'tr'
                        ? 'Platforma gereksiz özel nitelikli kişisel veri (sağlık verileri, adli sicil kayıtları vb.) yüklenemez; öğrenci verilerinde veri minimizasyonu esastır.'
                        : 'Users must not upload unnecessary special-category data, medical records, or sensitive biometric information. Data minimisation is strictly enforced.'}
                    </li>
                  </ul>
                </div>

                {/* 6. Bağımsız Üçüncü Taraf Ev Sahipleri */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '5. Bağımsız Ev Sahibi Kuruluşlar ve KYC Doğrulaması' : '5. Independent Hosting Organisations & KYC Verification'}
                  </h4>
                  <p className="m-0">
                    {locale === 'tr'
                      ? 'Platformda listelenen veya önerilen Avrupa işletmeleri bağımsız üçüncü taraflardır. CAPPINNO, ev sahiplerinin resmi belgelerini (sicil, vergi levhası, acil durum irtibatı) çok adımlı KYC incelemesinden geçirir. Bununla birlikte gönderen yararlanıcı kurum; stajyer yerleşimi yapmadan önce staj ortamı güvenliğini, iş sağlığı ve güvenliği şartlarını, sigorta poliçesi kapsamını ve yerel koşulları teyit etmekle yükümlüdür.'
                      : 'Hosting enterprises listed or matched through the Platform are independent third parties. While CAPPINNO conducts multi-step KYC verification (business registry, tax certificates, emergency contacts), sending beneficiary institutions remain responsible for verifying safety standards, insurance policies, and workplace compliance prior to participant placement.'}
                  </p>
                </div>

                {/* 7. Bulut Veri Depolama ve Denetim Arşivlemesi */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '6. Bulut Depolama, Arşivleme ve Denetim Yükümlülüğü' : '6. Cloud Storage, Archiving & Audit Compliance'}
                  </h4>
                  <p className="m-0">
                    {locale === 'tr'
                      ? 'Platform üzerindeki hareketlilik dosyaları, kurum KYC evrakları ve süreç kanıtları; Avrupa Komisyonu ve Ulusal Ajans’ın 5 yıllık Erasmus+ mali denetim kurallarına uygun şekilde yüksek güvenlikli şifreli bulut kasalarında saklanır. Kurumlar, denetim kanıtlarını diledikleri zaman platformdan yapısal formatta indirebilir.'
                      : 'Mobility dossiers, institutional KYC records, and process evidence are preserved in encrypted cloud vaults in full compliance with European Commission and National Agency 5-year Erasmus+ audit rules. Institutions may export structured compliance dossiers at any time.'}
                  </p>
                </div>

                {/* 8. Fikri Mülkiyet */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '7. Fikrî Mülkiyet ve Kullanım Hakları' : '7. Intellectual Property'}
                  </h4>
                  <p className="m-0">
                    {locale === 'tr'
                      ? 'Platform yazılımı, algoritmaları, eşleştirme motoru, arayüz tasarımları, veri modelleri ve özgün taksonomik içerikler CAPPINNO’nun mülkiyetindedir. Kullanıcının yüklediği kurumsal veriler üzerindeki mülkiyeti kullanıcıya ait olup, CAPPINNO’ya yalnızca hizmetin ifası ve süreç takibi için gerekli sınırlı barındırma ve işleme izni verilmiştir.'
                      : 'Platform software, matching algorithms, UI architectures, and proprietary taxonomies belong to CAPPINNO. Institutional users retain full ownership of their uploaded project content, granting CAPPINNO a limited license solely to process and maintain requested dossiers.'}
                  </p>
                </div>

                {/* 9. Sorumluluk ve Uygulanacak Hukuk */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '8. Sorumluluğun Sınırı ve Yetkili Mahkeme' : '8. Governing Law & Dispute Resolution'}
                  </h4>
                  <p className="m-0">
                    {locale === 'tr'
                      ? 'Bu koşullar Türkiye Cumhuriyeti hukukuna tabidir. Taraflar arasındaki uyuşmazlıklarda, mevzuatın emredici hükümleri saklı kalmak kaydıyla yetkili mahkeme ve icra daireleri yetkilidir.'
                      : 'These Terms are governed by the laws of the Republic of Turkey. Mandatory European consumer and jurisdictional provisions remain unaffected.'}
                  </p>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 3: COOKIES & PREFERENCE PANEL                            */}
            {/* ============================================================ */}
            {activeTab === 'COOKIES' && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {locale === 'tr' ? 'ÇEREZ POLİTİKASI VE İNTERAKTİF TERCİH YÖNETİMİ' : 'COOKIE POLICY & INTERACTIVE PREFERENCE PANEL'}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {locale === 'tr'
                      ? 'Gizlilik odaklı kurumsal ilke: Platformumuzda üçüncü taraf reklam veya davranışsal takip çerezi kullanılmaz.'
                      : 'Privacy-by-design policy: No third-party behavioral ad trackers are deployed across the platform.'}
                  </div>
                </div>

                {/* Interactive Preference Panel (Flat Corporate Toggles) */}
                <div className="p-4 sm:p-5 bg-white border-2 border-slate-300 rounded-2xl space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div>
                      <h4 className="font-extrabold text-slate-950 text-xs sm:text-sm m-0">
                        {locale === 'tr' ? 'Çerez Tercihlerinizi Özelleştirin' : 'Customize Your Cookie Preferences'}
                      </h4>
                      <p className="text-[11px] text-slate-500 m-0 mt-0.5">
                        {locale === 'tr'
                          ? 'Kategorileri belirleyebilir ve dilediğiniz zaman alt bilgiden değiştirebilirsiniz.'
                          : 'Select your preferred categories. You can update these anytime from the footer.'}
                      </p>
                    </div>

                    {saveToast && (
                      <span className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 animate-fadeIn">
                        ✓ {locale === 'tr' ? 'Tercihler Kaydedildi' : 'Preferences Saved'}
                      </span>
                    )}
                  </div>

                  {/* 1. Strictly Necessary (Locked ON) */}
                  <div className="flex items-start justify-between gap-4 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">
                          {locale === 'tr' ? '1. Kesinlikle Gerekli Çerezler' : '1. Strictly Necessary Cookies'}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-blue-100 text-blue-900 border border-blue-200">
                          {locale === 'tr' ? 'HER ZAMAN ETKİN' : 'ALWAYS ACTIVE'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 m-0">
                        {locale === 'tr'
                          ? 'Oturum yönetimi (Clerk Auth), CSRF güvenliği, yük dengeleme ve temel platform navigasyonu için zorunludur. Kapatılamaz.'
                          : 'Essential for user authentication (Clerk), CSRF security, and core session handling. Cannot be disabled.'}
                      </p>
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <span className="text-xs font-bold text-slate-500 bg-slate-200 px-2 py-1 rounded-md border border-slate-300 cursor-not-allowed">
                        🔒 {locale === 'tr' ? 'Kilitli' : 'Locked'}
                      </span>
                    </div>
                  </div>

                  {/* 2. Functional Cookies (Toggleable) */}
                  <div className="flex items-start justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">
                          {locale === 'tr' ? '2. İşlevsellik Çerezleri' : '2. Functional Preferences'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {locale === 'tr' ? '(Dil ve Görünüm Tercihleri)' : '(Language & UI Preferences)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 m-0">
                        {locale === 'tr'
                          ? 'Seçilen dilin (TR/EN) ve form taslaklarının tarayıcınızda hatırlanmasını sağlar.'
                          : 'Remembers your active language (TR/EN) and local form drafts across page refreshes.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCookiePrefs((prev) => ({ ...prev, functional: !prev.functional }))
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        cookiePrefs.functional ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                      role="switch"
                      aria-checked={cookiePrefs.functional}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          cookiePrefs.functional ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 3. Analytics Cookies (Toggleable) */}
                  <div className="flex items-start justify-between gap-4 p-3 bg-white rounded-xl border border-slate-200">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">
                          {locale === 'tr' ? '3. Analitik Çerezleri' : '3. Analytics & Performance'}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {locale === 'tr' ? '(Hata ve Performans Ölçümü)' : '(Crash & Usage Metrics)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 m-0">
                        {locale === 'tr'
                          ? 'Platformun hızını ve hata sıklığını ölçerek teknik iyileştirmeler yapmamıza yardımcı olur.'
                          : 'Helps us measure site performance and identify error traces anonymously.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setCookiePrefs((prev) => ({ ...prev, analytics: !prev.analytics }))
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        cookiePrefs.analytics ? 'bg-slate-900' : 'bg-slate-300'
                      }`}
                      role="switch"
                      aria-checked={cookiePrefs.analytics}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                          cookiePrefs.analytics ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 4. Marketing Trackers (Always Off) */}
                  <div className="flex items-start justify-between gap-4 p-3 bg-slate-50/60 rounded-xl border border-slate-200 opacity-80">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-950 text-xs">
                          {locale === 'tr' ? '4. Pazarlama ve Reklam Çerezleri' : '4. Marketing & Ad Trackers'}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-slate-200 text-slate-700 border border-slate-300">
                          {locale === 'tr' ? 'KULLANILMIYOR' : 'NOT DEPLOYED'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 m-0">
                        {locale === 'tr'
                          ? 'Platformumuzda üçüncü taraf reklam ağı, izleme pikseli veya yeniden hedefleme çerezi barındırılmaz.'
                          : 'No cross-site advertising networks, tracking pixels, or retargeting cookies are used.'}
                      </p>
                    </div>
                    <div className="shrink-0 pt-0.5">
                      <span className="text-xs font-bold text-slate-400 bg-slate-200/80 px-2 py-1 rounded-md border border-slate-300 cursor-not-allowed">
                        ✕ {locale === 'tr' ? 'Kapalı' : 'Off'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2.5 pt-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleRejectAllCookies}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition-colors"
                    >
                      {locale === 'tr' ? 'Tümünü Reddet (Zorunlu Hariç)' : 'Reject All (Except Necessary)'}
                    </button>

                    <button
                      type="button"
                      onClick={handleAcceptAllCookies}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-900 transition-colors"
                    >
                      {locale === 'tr' ? 'Tümünü Kabul Et' : 'Accept All'}
                    </button>

                    <button
                      type="button"
                      onClick={handleSaveCookiePrefs}
                      className="px-4 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
                    >
                      {locale === 'tr' ? 'Seçimlerimi Kaydet' : 'Save My Choices'}
                    </button>
                  </div>
                </div>

                {/* Verified Cookie Inventory Table */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? 'Şeffaf Çerez Envanteri' : 'Verified Cookie Inventory'}
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-[580px] w-full divide-y divide-slate-200 text-left">
                      <thead className="bg-slate-50 font-bold text-slate-900 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">Çerez Adı</th>
                          <th className="py-2.5 px-3">Sağlayıcı</th>
                          <th className="py-2.5 px-3">Kategori</th>
                          <th className="py-2.5 px-3">Amaç</th>
                          <th className="py-2.5 px-3">Süre</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        <tr>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">__session, __clerk_*</td>
                          <td className="py-2 px-3 text-slate-700 font-semibold">Clerk Inc.</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.2 bg-blue-50 text-blue-800 rounded font-bold">Zorunlu</span></td>
                          <td className="py-2 px-3 text-slate-600">Kullanıcı kimlik doğrulama ve oturum güvenliği</td>
                          <td className="py-2 px-3 text-slate-600">Oturum / 30 Gün</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">cappinno_lang</td>
                          <td className="py-2 px-3 text-slate-700 font-semibold">CAPPINNO</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.2 bg-slate-100 text-slate-800 rounded font-bold">İşlevsel</span></td>
                          <td className="py-2 px-3 text-slate-600">Aktif dil tercihinin (TR/EN) hatırlanması</td>
                          <td className="py-2 px-3 text-slate-600">1 Yıl (localStorage)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">cappinno_cookie_prefs</td>
                          <td className="py-2 px-3 text-slate-700 font-semibold">CAPPINNO</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.2 bg-slate-100 text-slate-800 rounded font-bold">İşlevsel</span></td>
                          <td className="py-2 px-3 text-slate-600">Kullanıcı çerez onay ve kategori tercihlerinin saklanması</td>
                          <td className="py-2 px-3 text-slate-600">1 Yıl (localStorage)</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-mono font-bold text-slate-900">cappinno_onboarding_draft</td>
                          <td className="py-2 px-3 text-slate-700 font-semibold">CAPPINNO</td>
                          <td className="py-2 px-3"><span className="px-1.5 py-0.2 bg-slate-100 text-slate-800 rounded font-bold">İşlevsel</span></td>
                          <td className="py-2 px-3 text-slate-600">Form doldururken sayfa yenilenmesinde veri kaybını önleme</td>
                          <td className="py-2 px-3 text-slate-600">Yerel Oturum</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================================ */}
            {/* TAB 4: RETENTION (Veri Saklama & İmha Politikası)             */}
            {/* ============================================================ */}
            {activeTab === 'RETENTION' && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <div className="font-extrabold text-slate-950 text-sm">
                    {locale === 'tr' ? 'VERİ SAKLAMA VE İMHA POLİTİKASI' : 'DATA RETENTION AND DISPOSAL POLICY'}
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">
                    {locale === 'tr'
                      ? 'Kapsam: erasmusmobility.com • Erasmus+ denetim kuralları, TTK, VUK, KVKK ve GDPR saklama takvimi'
                      : 'Scope: erasmusmobility.com • Erasmus+ audit mandates, fiscal codes, KVKK and GDPR retention schedule'}
                  </div>
                </div>

                {/* 1. Kurumsal Toolset ve Bulut Depolama İlkeleri */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr'
                      ? '1. Kurumsal EMaaS Araç Seti ve Güvenli Bulut Saklama İlkeleri'
                      : '1. Enterprise EMaaS Toolset & Secure Cloud Retention Architecture'}
                  </h4>
                  <p className="m-0">
                    {locale === 'tr'
                      ? 'CAPPINNO Mobility Nexus; Erasmus+ yararlanıcı okulları ile Avrupalı ev sahibi işletmelerin eşleştiği, hareketlilik yaşam döngüsünün uçtan uca takip edilip sonuçlandırıldığı ve kurumsal abonelik paketleriyle desteklenen entegre bir EMaaS (Mobility-as-a-Service) araç setidir. Platform üzerinde oluşturulan proje dosyaları, eşleşme kayıtları, katılımcı yetkinlik analizleri, ev sahibi doğrulama (KYC) evrakları ve abonelik/fatura verileri; Avrupa Komisyonu, Ulusal Ajans ve ilgili mevzuatın zorunlu kıldığı yasal denetim süreleri boyunca yüksek güvenlikli, şifrelenmiş bulut kasalarında (Cloudflare R2, izole çok kiracılı veritabanları) uluslararası standartlara uygun olarak saklanmaktadır.'
                      : 'CAPPINNO Mobility Nexus is an integrated EMaaS (Mobility-as-a-Service) toolset connecting Erasmus+ beneficiary institutions with European hosts to manage and conclude mobility lifecycles under tiered subscription plans. Project dossiers, matching records, participant competence assessments, host KYC verification documents, and commercial billing records are securely stored in zero-egress encrypted cloud vaults (Cloudflare R2, multi-tenant databases) in strict compliance with statutory audit schedules.'}
                  </p>
                </div>

                {/* 2. Yasal Saklama Çizelgesi Tablosu */}
                <div className="space-y-2">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr' ? '2. Yasal ve Operasyonel Veri Saklama Çizelgesi' : '2. Statutory & Operational Data Retention Schedule'}
                  </h4>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-[580px] w-full divide-y divide-slate-200 text-left">
                      <thead className="bg-slate-50 font-bold text-slate-900 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3">{locale === 'tr' ? 'Kayıt Grubu' : 'Record Category'}</th>
                          <th className="py-2.5 px-3">{locale === 'tr' ? 'Saklama Süresi' : 'Retention Period'}</th>
                          <th className="py-2.5 px-3">{locale === 'tr' ? 'Hukuki / Operasyonel Dayanak' : 'Legal / Operational Basis'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-[11px]">
                        {/* 1. Kurum, Proje ve Hareketlilik Dosyaları */}
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {locale === 'tr' ? 'Kurum, Proje ve Hareketlilik Dosyaları' : 'Institution, Project & Mobility Dossiers'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-blue-900 whitespace-nowrap">
                            {locale === 'tr' ? 'Proje Kapanışından Sonra 5 Yıl' : '5 Years Post Project Closure'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {locale === 'tr'
                              ? 'Avrupa Komisyonu ve Ulusal Ajans Erasmus+ mali denetim yükümlülüğü. KA121/KA122 planları, bütçe simülasyonları, eşleşme kayıtları ve nihai rapor taslakları.'
                              : 'European Commission & National Agency Erasmus+ financial audit mandate. Covers KA121/KA122 plans, budget simulations, host match records, and closure dossiers.'}
                          </td>
                        </tr>

                        {/* 2. Katılımcı Yetkinlik ve ESCO Değerlendirmeleri */}
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {locale === 'tr' ? 'Katılımcı Yetkinlik ve ESCO Değerlendirmeleri' : 'Learner Competence & ESCO Assessments'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-blue-900 whitespace-nowrap">
                            {locale === 'tr' ? 'Hareketlilik Bitiminden Sonra 2 Yıl' : '2 Years Post Mobility Completion'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {locale === 'tr'
                              ? 'Öğrenme çıktısı teyidi ve sertifikasyon doğrulaması. 2 yıllık sürenin bitiminde kayıtlar katılımcı kimliğinden koparılarak araştırma ve etki analizi amacıyla anonimleştirilir.'
                              : 'Learning outcomes and certification validation. After 2 years, records are decoupled from individual identities and permanently anonymised for educational impact research.'}
                          </td>
                        </tr>

                        {/* 3. Ev Sahibi (Host) Doğrulama & KYC Belgeleri */}
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {locale === 'tr' ? 'Ev Sahibi (Host) Doğrulama & KYC Belgeleri' : 'Host Verification & KYC Documents'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {locale === 'tr' ? 'Ortaklık Kapanışından Sonra 3 Yıl' : '3 Years Post Partnership Termination'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {locale === 'tr'
                              ? 'Kurumsal güvenlik ve sahte ev sahibi önleme denetim izi. Partner Network doğrulama konsolu, ticaret sicil gazetesi, vergi levhası ve 7/24 acil durum irtibat teyitleri.'
                              : 'Institutional safety and anti-fraud audit trail. Partner Network verification records, commercial registry extracts, tax certificates, and verified 24/7 emergency contacts.'}
                          </td>
                        </tr>

                        {/* 4. Sözleşme, Fatura ve Muhasebe Kayıtları */}
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {locale === 'tr' ? 'Sözleşme, Fatura ve Muhasebe Kayıtları' : 'Contracts, Invoices & Commercial Records'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {locale === 'tr' ? '10 Yıl' : '10 Years'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {locale === 'tr'
                              ? '6102 sayılı Türk Ticaret Kanunu (TTK) ve Vergi Usul Kanunu (VUK). Kurumsal abonelik paketleri (Basic/Pro/Premium), resmi e-faturalar ve tahsilat işlem kayıtları.'
                              : 'Commercial and Tax Codes (TTK & VUK). Institutional subscription plans, commercial invoicing, and transaction audit trails.'}
                          </td>
                        </tr>

                        {/* 5. Sistem, Erişim ve Güvenlik Logları */}
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {locale === 'tr' ? 'Sistem, Erişim ve Güvenlik Logları' : 'System, Access & Security Logs'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {locale === 'tr' ? '12 Ay' : '12 Months'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {locale === 'tr'
                              ? '5651 sayılı Kanun ve siber güvenlik olay izleme yükümlülüğü. IP erişim kayıtları, Clerk oturum izleri, Correlation ID ve silinemez denetim izi (audit_event) kayıtları.'
                              : 'Statutory internet traffic logging and cybersecurity incident monitoring. IP access traces, authentication timestamps, Correlation IDs, and immutable audit_event records.'}
                          </td>
                        </tr>

                        {/* 6. Çerez Tercih & İspat Kayıtları */}
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {locale === 'tr' ? 'Çerez Tercih & İspat Kayıtları' : 'Cookie Consent & Proof Logs'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-slate-900 whitespace-nowrap">
                            {locale === 'tr' ? 'Geçerlilik Süresi + 3 Yıl' : 'Validity Term + 3 Years'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {locale === 'tr'
                              ? 'İspat yükümlülüğü ve rıza yönetim denetimi. Çerez onay tercihleri, versiyon damgaları ve kullanıcı izin durumları.'
                              : 'Proof of compliance and consent governance auditing under KVKK and ePrivacy/GDPR directives.'}
                          </td>
                        </tr>

                        {/* 7. Sistem Yedekleri */}
                        <tr>
                          <td className="py-2.5 px-3 font-semibold text-slate-900">
                            {locale === 'tr' ? 'Sistem Yedekleri (Backups & DR)' : 'System Backups & Disaster Recovery'}
                          </td>
                          <td className="py-2.5 px-3 font-bold text-emerald-800 whitespace-nowrap">
                            {locale === 'tr' ? 'Maksimum 90 Günlük Döngü' : 'Maximum 90-Day Rolling Cycle'}
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">
                            {locale === 'tr'
                              ? 'İş sürekliliği ve felaket kurtarma. Şifreli artımlı yedekler 90 gün boyunca dönüşümlü olarak saklanır; süresi dolan döngüler otomatik olarak üzerine yazılarak imha edilir.'
                              : 'Business continuity and disaster recovery. Encrypted rolling backups retained for a maximum 90-day cycle, then automatically overwritten.'}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 3. İmha ve Güvenli Silme Usulleri */}
                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                    {locale === 'tr'
                      ? '3. Güvenli İmha Usulleri, Anonimleştirme ve Veri Taşınabilirliği'
                      : '3. Secure Disposal Protocols, Anonymization & Data Portability'}
                  </h4>
                  <ul className="list-disc pl-5 space-y-1 text-slate-600">
                    <li>
                      <strong>{locale === 'tr' ? 'Kriptografik Güvenli İmha:' : 'Cryptographic Erasure:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Yasal saklama süresi dolan bulut nesneleri (Cloudflare R2) ve veritabanı kayıtları, geri döndürülemeyecek şekilde şifreleme anahtarlarının yok edilmesi ve DoD 5220.22-M standartlarında üzerine yazma ile imha edilir.'
                        : 'Expired cloud objects (Cloudflare R2) and database records are permanently purged via cryptographic key destruction and secure multi-pass overwriting.'}
                    </li>
                    <li>
                      <strong>{locale === 'tr' ? 'Yetkinlik Değerlendirmelerinin Anonimleştirilmesi:' : 'Competence Anonymization:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Katılımcı öğrencilerin ESCO yetkinlik skorları hareketlilik bitiminden 2 yıl sonra ad, soyad ve kimlik bilgilerinden geri dönülemez biçimde koparılarak istatistiksel kalite göstergesine dönüştürülür.'
                        : 'Learner ESCO competence evaluations are permanently anonymised 2 years after mobility completion, stripping personal identifiers for longitudinal educational benchmarking.'}
                    </li>
                    <li>
                      <strong>{locale === 'tr' ? 'Kurumsal Veri İndirme (Data Portability):' : 'Institutional Data Portability:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Kurum yöneticileri, hareketlilik sürecinde veya proje kapanışında oluşturulan tüm proje dosyalarını, eşleştirme raporlarını ve denetim kayıtlarını tek tıkla yapısal JSON ve denetime hazır PDF formatında dışa aktarabilir.'
                        : 'Institutional admins may export complete mobility dossiers, matching summaries, and audit logs at any time as structured JSON or audit-ready PDF packages.'}
                    </li>
                    <li>
                      <strong>{locale === 'tr' ? 'Abonelik Feshi Durumu:' : 'Subscription Termination:'}</strong>{' '}
                      {locale === 'tr'
                        ? 'Aboneliğini sonlandıran veya hesabını kapatan kurumların aktif operasyonel verileri dondurulur; kanunen zorunlu 5 yıllık proje denetim ve 10 yıllık mali saklama süreleri dolana dek güvenli arşiv kasasında tutulur.'
                        : 'Upon subscription termination, active operational features are suspended; records subject to mandatory 5-year Erasmus+ audit and 10-year commercial tax laws are preserved in secure read-only vaults.'}
                    </li>
                  </ul>
                </div>

                {/* 4. Periyodik İmha Takvimi */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <div className="font-bold text-slate-950 text-xs">
                    📅 {locale === 'tr' ? 'Periyodik İmha ve Denetim Takvimi' : 'Periodic Disposal & Audit Schedule'}
                  </div>
                  <p className="m-0 text-slate-600 text-[11px] leading-relaxed">
                    {locale === 'tr'
                      ? 'Saklama süresi dolan kayıtlar için yılda 2 kez (Haziran ve Aralık aylarında) periyodik imha prosedürü işletilir. İmha edilen her veri grubu için silinemez sistem denetim izi (audit_event) oluşturulur ve imha tutanakları yasal 3 yıl boyunca muhafaza edilir.'
                      : 'Expired data are reviewed and purged semi-annually (June and December). Every deletion operation generates an immutable audit_event log, with certified disposal records retained for 3 years.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-4 sm:px-6 py-3.5 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
              <span>🔒 256-bit SSL</span>
              <span>•</span>
              <span>Cloudflare R2 Şifreli Kasa</span>
              <span>•</span>
              <span className="font-bold text-slate-700">
                {locale === 'tr' ? '6698 KVKK Uyumlu' : 'EU GDPR Compliant'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
                title="Başlığı Panoya Kopyala"
              >
                {copied ? (locale === 'tr' ? '✓ Kopyalandı' : '✓ Copied') : '📋 ' + (locale === 'tr' ? 'Kopyala' : 'Copy')}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors"
              >
                🖨️ {locale === 'tr' ? 'Yazdır' : 'Print'}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {locale === 'tr' ? 'Anladım / Kapat' : 'Understood / Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
