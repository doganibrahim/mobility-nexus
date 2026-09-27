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

  // Normalize initial tab strictly to the 2 supported legal documents
  const resolveTab = (tab: LegalTabType): 'LEGAL' | 'TERMS' => {
    if (tab === 'TERMS' || tab === 'COOKIES' || tab === 'RETENTION') {
      return 'TERMS';
    }
    return 'LEGAL';
  };

  const [activeTab, setActiveTab] = useState<'LEGAL' | 'TERMS'>(resolveTab(initialTab));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(resolveTab(initialTab));
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

        {/* Modal Window */}
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
                    {locale === 'tr' ? 'Hukuki Çerçeve ve Yasal Metinler' : 'Legal Compliance & Terms'}
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-slate-100 text-slate-800 border border-slate-300 font-mono">
                    erasmusmobility.com • EMaaS v1.0
                  </span>
                </div>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  {locale === 'tr'
                    ? 'ErasmusMobility veri koruma aydınlatması ve platform katılım koşulları referans metinleri'
                    : 'ErasmusMobility data governance notice and platform participation terms'}
                </p>
              </div>
            </div>

            <button
              type="button"
              className="rounded-xl bg-white p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors border border-slate-200 cursor-pointer"
              onClick={onClose}
              title={t.legal.close}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Strictly Only 2 Navigation Tabs */}
          <div className="bg-slate-100 px-4 sm:px-6 pt-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Tab 1: KVKK (TR) or GDPR (EN) */}
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

            {/* Tab 2: Platform Participation Terms & Explicit Consent Declaration */}
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
              <span>{locale === 'tr' ? 'Kullanım Koşulları ve Açık Rıza' : 'Platform Participation Terms & Consent'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-900 border border-blue-200 font-mono">
                {locale === 'tr' ? 'Yasal Metin' : 'Official Terms'}
              </span>
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
                      Platform: erasmusmobility.com • Sürüm: 1.0 (2026) • Veri Sorumlusu: ErasmusMobility
                    </div>
                  </div>

                  {/* 1. Veri Sorumlusu */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      1. Veri Sorumlusu Sıfatı ve İletişim Kanalları
                    </h4>
                    <p className="m-0">
                      6698 sayılı Kişisel Verilerin Korunması Kanunu (“Kanun”) uyarınca veri sorumlusu, merkezi Türkiye&apos;de bulunan <strong>ErasmusMobility</strong>&apos;dir. Şirketimiz, erasmusmobility.com platformu üzerinden sunulan Erasmus+ KA121/KA122 VET hareketlilik yönetimi, yetkinlik değerlendirme ve kurumsal eşleştirme (EMaaS) hizmetleri kapsamında verilerinizi Kanun&apos;a uygun olarak işlemektedir.
                    </p>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      <div><strong>İletişim & Destek:</strong> Platform Yönetim Paneli / Destek Masası</div>
                      <div><strong>Veri Güvenliği Birimi:</strong> ErasmusMobility Bilgi Güvenliği Masası</div>
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
                      Verileriniz, Kanun&apos;un 5. maddesinde yer alan aşağıdaki somut şartlara dayanılarak işlenmektedir:
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
                      4. 18 Yaş Altı Katılımcıların (Öğrencilerin) Veri Güvenliği
                    </h4>
                    <p className="m-0">
                      Mesleki ve Teknik Anadolu Lisesi (MTAL) öğrencilerinin hareketlilik planlamasında veri minimizasyonu esastır. Platforma veri girişi yapan gönderen okul temsilcisi; öğrencilerin ad-soyadı yerine mümkün olduğunca öğrenci/grup kodu kullanmakla ve 18 yaşından küçük öğrencilerin veli/vasilerine mevzuata uygun katmanlı aydınlatmayı sağlamakla yükümlüdür.
                    </p>
                  </div>

                  {/* 6. Paylaşım ve Yurt Dışına Aktarım */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      5. Verilerin Aktarımı ve Yurt Dışı Güvenceleri
                    </h4>
                    <p className="m-0">
                      Verileriniz; yalnızca hizmetin gerektirdiği ölçüde bilişim altyapı sağlayıcılarımıza (Cloudflare R2, Clerk Authentication), gönderen okulun açık talebiyle seçilen Avrupa merkezli ev sahibi işletmelere ve kanunen yetkili kamu kurumlarına aktarılır.
                    </p>
                    <p className="m-0 text-slate-600">
                      Yurt dışındaki ev sahibi kurumlara ilk eşleştirmede kimliksizleştirilmiş kurum ve grup profili iletilir; isimli katılımcı listeleri ancak hareketlilik operasyonunun kesinleştiği aşamada Kanun&apos;un güncel 9. maddesindeki uygun güvence mekanizmaları (Standart Sözleşme veya istisnai aktarım şartları) çerçevesinde aktarılır.
                    </p>
                  </div>

                  {/* 7. İlgili Kişi Hakları */}
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      6. İlgili Kişi Olarak Kanun’un 11. Maddesindeki Haklarınız
                    </h4>
                    <p className="m-0">
                      Kanun&apos;un 11. maddesi kapsamında; verilerinizin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, işlenme amacına uygun kullanılıp kullanılmadığını öğrenme, yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini isteme, şartları oluştuğunda silinmesini veya yok edilmesini talep etme ve münhasıran otomatik sistemler vasıtasıyla aleyhinize bir sonucun ortaya çıkmasına itiraz etme haklarına sahipsiniz.
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
                      Platform: erasmusmobility.com • Version: 1.0 (2026) • Data Controller: ErasmusMobility
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      1. Data Controller & Scope
                    </h4>
                    <p className="m-0">
                      This Privacy Policy governs the processing of personal data on erasmusmobility.com, an Erasmus+ Mobility-as-a-Service (EMaaS) platform operated by ErasmusMobility. We are committed to protecting the fundamental privacy rights of European and international VET schools, hosting enterprises, and mobility coordinators in full compliance with the General Data Protection Regulation (GDPR - EU 2016/679).
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
                      You have the right to access your personal data (Art. 15), obtain rectification of inaccurate data (Art. 16), request erasure / &quot;Right to be Forgotten&quot; (Art. 17), restrict processing (Art. 18), receive data portability (Art. 20), and object to processing (Art. 21). You may exercise these rights at any time through your verified institutional account dashboard.
                    </p>
                  </div>
                </div>
              )
            )}

            {/* ============================================================ */}
            {/* TAB 2: TERMS & EXPLICIT CONSENT (Resmi Yasal Referans Metni) */}
            {/* ============================================================ */}
            {activeTab === 'TERMS' && (
              locale === 'tr' ? (
                /* Turkish: Platform Katılım Koşullarını Kabul ve Açık Rıza Beyanı */
                <div className="space-y-6">
                  {/* Başlık ve Bilgilendirme Kutusu */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="font-extrabold text-slate-950 text-sm">
                      PLATFORM KATILIM KOŞULLARINI KABUL VE AÇIK RIZA BEYANI
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Platform: erasmusmobility.com • Sürüm: 1.0 (2026) • Yasal Hüküm ve Açık Rıza Metni
                    </div>
                  </div>

                  {/* BÖLÜM 1: İsteğe Bağlı Tercihler ve Açık Rıza Hükümleri */}
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      İsteğe Bağlı Tercihler ve Açık Rıza Hükümleri
                    </h4>
                    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 text-xs text-slate-700 leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Profil yayımlama tercihi:</strong> Kuruluş profilinde belirttiğim bilgilerin kamuya açık olarak yayımlanmasını kabul ediyorum.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Kişisel iletişim bilgisi tercihi:</strong> Adımın ve kişisel iletişim bilgilerimin kuruluş profilinde kamuya açık olarak gösterilmesini kabul ediyorum.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Bülten ve tanıtım tercihi:</strong> ErasmusMobility.com tarafından haber, duyuru ve tanıtım amaçlı elektronik ileti gönderilmesini kabul ediyorum.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          Adımın, görevimin ve kişisel iletişim bilgilerimin kuruluş profilinde kamuya açık olarak yayımlanmasına açık rıza veriyorum.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          Kuruluş profilinde yayımladığım logo, fotoğraf, video ve tanıtım içeriklerinin ErasmusMobility.com’un internet sitesi ve sosyal medya hesaplarında platformun tanıtılması amacıyla kullanılmasına açık rıza veriyorum.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          ErasmusMobility.com tarafından yeni hareketlilik talepleri, hizmet fırsatları, platform haberleri ve tanıtımlar hakkında e-posta veya diğer elektronik ileti gönderilmesine onay veriyorum.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          Yer aldığım fotoğraf ve videoların ErasmusMobility.com üzerinde ve platformun sosyal medya hesaplarında bilgilendirme ve tanıtım amacıyla yayımlanmasına açık rıza veriyorum.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BÖLÜM 2: Kabul, Beyan ve Taahhüt Metni */}
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Kabul ve Açık Rıza Beyanı
                    </h4>
                    <div className="p-4 sm:p-5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                      <div className="font-bold text-blue-950 text-xs">
                        Platform Katılım Koşullarını Kabul ve Açık Rıza Beyanımdır:
                      </div>
                      <p className="m-0 text-xs text-slate-800 leading-relaxed font-normal">
                        ErasmusMobility.com’un Gizlilik Politikasını, KVKK Aydınlatma Metnini, GDPR Gizlilik Bildirimini, Zorunlu Çerezler Bilgilendirme Metnini, Kullanım Koşullarını, Platform İşleticisinin Rolü ve Sorumluluğunun Sınırlandırılması hükümlerini, Veri Saklama ve İmha Politikasını, İlgili Kişi Hakları ve Başvuru Prosedürünü, Platform İşleticisi ve Yasal İletişim Bilgilerini ve Platform Katılım Koşullarını okudum ve anladım; kuruluşum adına geçerli olan kullanım koşullarını kabul ediyorum. Kişisel iletişim bilgilerinin yayımlanması, ticari elektronik ileti gönderilmesi, profil içeriğinin tanıtımda kullanılması, özel nitelikli kişisel verilerin işlenmesi ve fotoğraf veya videoların kullanılması konularının isteğe bağlı olduğunu ve bu işlemlere ilişkin tercihlerimin ayrı onay kutularıyla alınacağını biliyorum. Bu beyanı kuruluşum adına vermeye yetkili olduğumu kabul ve beyan ederim.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* English: Platform Participation Terms Acceptance and Explicit Consent Declaration */
                <div className="space-y-6">
                  {/* Title & Scope */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="font-extrabold text-slate-950 text-sm">
                      PLATFORM PARTICIPATION TERMS ACCEPTANCE AND EXPLICIT CONSENT DECLARATION
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      Platform: erasmusmobility.com • Version: 1.0 (2026) • Statutory Terms & Explicit Consent Provisions
                    </div>
                  </div>

                  {/* SECTION 1: Optional Preferences and Consents */}
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Optional Preferences and Consents
                    </h4>
                    <div className="bg-slate-50/80 border border-slate-200 rounded-xl p-4 sm:p-5 space-y-3 text-xs text-slate-700 leading-relaxed">
                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Profile publication preference:</strong> I agree that the information provided in my organisation profile may be made publicly available.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Personal contact information preference:</strong> I agree that my name and personal contact information may be displayed publicly in the organisation profile.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Newsletter and promotional communications preference:</strong> I agree to receive electronic communications from ErasmusMobility.com for news, announcements and promotional purposes.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Publication of personal contact information:</strong> I give my explicit consent for my name, position and personal contact information to be published publicly in the organisation profile.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Use of organisation profile content:</strong> I give my explicit consent for the logo, photographs, videos and promotional content published in my organisation profile to be used on the ErasmusMobility.com website and its social media accounts for the purpose of promoting the Platform.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Mobility opportunities and platform communications:</strong> I agree to receive emails or other electronic communications from ErasmusMobility.com concerning new mobility requests, service opportunities, Platform news and promotional information.
                        </div>
                      </div>

                      <div className="flex items-start gap-2.5">
                        <span className="text-slate-400 font-bold select-none">•</span>
                        <div>
                          <strong>Use of photographs and videos:</strong> I give my explicit consent for photographs and videos in which I appear to be published on ErasmusMobility.com and on the Platform&apos;s social media accounts for information and promotional purposes.
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 2: Acceptance and Acknowledgement */}
                  <div className="space-y-2.5">
                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Acceptance and Acknowledgement
                    </h4>
                    <div className="p-4 sm:p-5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-2">
                      <div className="font-bold text-blue-950 text-xs">
                        Declaration of Acceptance & Authority:
                      </div>
                      <p className="m-0 text-xs text-slate-800 leading-relaxed font-normal">
                        I have read and understood ErasmusMobility.com&apos;s Privacy Policy, KVKK Information Notice, GDPR Privacy Notice, Strictly Necessary Cookies Notice, Terms of Use, provisions concerning the Role and Limitation of Liability of the Platform Operator, Data Retention and Deletion Policy, Data Subject Rights and Request Procedure, Legal Notice and Platform Operator Information, and Platform Participation Terms. I accept, on behalf of my organisation, the terms of use applicable to us. I understand that the publication of personal contact information, the sending of commercial electronic communications, the use of profile content for promotional purposes, the processing of special categories of personal data, and the use of photographs or videos are optional, and that my preferences regarding these activities will be obtained through separate consent checkboxes. I confirm and declare that I am authorised to make this declaration on behalf of my organisation.
                      </p>
                    </div>
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

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                {locale === 'tr' ? 'Kapat' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
