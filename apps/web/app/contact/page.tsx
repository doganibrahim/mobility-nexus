'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal from '../../components/ui/LegalModal';
import AppointmentModal from '../../components/ui/AppointmentModal';
import DistinctSectionPurposeCard from '../../components/ui/DistinctSectionPurposeCard';
import { useTranslation } from '../../lib/i18n';
import { ChevronDown } from 'lucide-react';

export default function ContactPage() {
  const { t, locale } = useTranslation();
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const FAQ_ITEMS = [
    {
      qTr: 'Onaylı Ev Sahibi Kuruluş (Host) doğrulama kriterleri nelerdir?',
      qEn: 'What are the verification criteria for certified host organisations?',
      aTr: 'ErasmusMobility ağındaki tüm işletmeler; yasal kuruluş ve vergi kayıtları, yerel ticaret odası kaydı, ECVET staj protokolü uygunluğu ve daha önce tamamlanmış hareketlilik referansları kontrol edilerek onaylanır. Yalnızca öğrencilerin güvenli, pedagojik ve mesleki standartlara uygun staj yapabileceği kurumlar listelenir.',
      aEn: 'All host organisations in the ErasmusMobility network are verified by evaluating legal registration, local chamber of commerce standing, ECVET internship protocol compliance, and prior mobility track records. Only vetted enterprises providing safe learning environments are certified.',
    },
    {
      qTr: 'KA121 Akredite Bütçe Talebi ile KA122 Kısa Dönemli Proje Başvurusu arasındaki temel fark nedir?',
      qEn: 'What is the main difference between KA121 Accredited Grant Allocation and KA122 Short-Term Application?',
      aTr: 'KA121, Erasmus Akreditasyonuna (KA120) sahip mesleki eğitim kurumlarının her çağrı yılında basitleştirilmiş bütçe talep ettiği süreçtir (ayrıntılı proje anlatımı gerekmez). KA122 ise henüz akredite olmamış okulların 6-24 aylık bağımsız hareketlilik projeleri için başvurduğu, hedefleri ve kalite standartlarını sıfırdan anlattığı başvuru formudur.',
      aEn: 'KA121 is the streamlined annual budget allocation requested by institutions holding Erasmus Accreditation (KA120) without rewritten narratives. KA122 is a full stand-alone short-term mobility proposal (6-24 months) for non-accredited organisations detailing objectives and quality standards from scratch.',
    },
    {
      qTr: 'Okulumuzun OID (Organisation ID) numarası ile nasıl eşleşme sağlanır?',
      qEn: 'How does school OID (Organisation ID) matchmaking work?',
      aTr: 'Avrupa Komisyonu tarafından verilen 8 haneli E-harfli OID numaranızı platforma girdiğinizde veya başvuru formunda belirttiğinizde; okul türü, mesleki alanlar ve akreditasyon durumu otomatik olarak profilinizle eşleşir. Formlarımız bu sayede resmi form alanlarını sizin adınıza doldurabilir.',
      aEn: 'Entering your European Commission 8-digit E-prefixed OID links your institution type, vocational programs, and accreditation status. Our system automatically synchronizes official application fields with your verified data.',
    },
    {
      qTr: 'Platformda ev sahibi işletme aramak veya başvuru taslağı oluşturmak ücretli midir?',
      qEn: 'Are host searches and application drafting services free for schools?',
      aTr: 'Hayır. Mesleki ve teknik liselerimiz, öğretmenlerimiz ve öğrencilerimiz için platform üzerindeki ev sahibi arama, ESCO/EQAVET kazanım eşleştirme ve KA121/KA122 resmi başvuru taslağı oluşturma araçları tamamen ücretsizdir. Kurumsal danışmanlık randevuları da ilk aşamada ücretsiz sağlanır.',
      aEn: 'No. Searching European hosts, mapping ESCO/EQAVET learning outcomes, and generating KA121/KA122 draft forms are completely free for VET schools, teachers, and learners. Preliminary 30-minute consultation sessions are also complimentary.',
    },
    {
      qTr: 'Kişisel verilerimiz ve kurum bilgilerimiz nasıl korunmaktadır (KVKK / GDPR)?',
      qEn: 'How are personal data and institutional information protected (KVKK / GDPR)?',
      aTr: 'Tüm veriler Avrupa Birliği GDPR ve Türkiye KVKK mevzuatına tam uyumlu olarak TLS 1.3 şifrelemeli sunucularda saklanır. Okul ve katılımcı verileri üçüncü şahıslara ticari amaçla satılmaz; yalnızca resmi hareketlilik sözleşmeleri, Learning Agreement belgeleri ve Ulusal Ajans akreditasyon süreçleri için işlenir.',
      aEn: 'All data is stored in encrypted environments compliant with EU GDPR and Turkish KVKK regulations. Institutional and participant data is never sold or used for marketing; it is processed solely for official mobility contracts, Learning Agreements, and National Agency grant procedures.',
    },
  ];

  // Form State
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [oid, setOid] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('KA121');
  const [message, setMessage] = useState('');
  const [hpField, setHpField] = useState(''); // Anti-bot honeypot
  const [formLoadedAt] = useState(() => Date.now()); // Time-trap
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          orgName,
          oid,
          email,
          phone,
          subject,
          message,
          website: hpField,
          formLoadedAt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            (locale === 'tr' ? 'Mesaj iletilemedi. Lütfen alanları kontrol ediniz.' : 'Failed to send message.')
        );
      }

      if (data.trackingId) {
        setTrackingId(data.trackingId);
      }
      setIsSubmitted(true);
    } catch (err: any) {
      setFormError(err.message || (locale === 'tr' ? 'Bir bağlantı hatası oluştu.' : 'Connection error occurred.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-150">
      {/* 1. Official Erasmus+ Header */}
      <AppHeader />

      {/* 2. Institutional Breadcrumb */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>{locale === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              {locale === 'tr' ? 'İletişim & Kurumsal Destek' : 'Contact & Institutional Support'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>{locale === 'tr' ? 'Online Danışmanlık' : 'Online Consultation'}</span>
            <span>•</span>
            <span>{locale === 'tr' ? '30 Dk Randevu' : '30-Minute Appointment'}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Canvas */}
      <main id="main-content" tabIndex={-1} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-10 focus:outline-none">
        {/* Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>📬</span>
              <span>{locale === 'tr' ? 'Bize Ulaşın' : 'Get in Touch'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{locale === 'tr' ? 'Uzman Danışmanlık Desteği' : 'Expert Consultation Support'}</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
              {locale === 'tr'
                ? 'Mesleki Eğitim Projeleriniz İçin Bizimle İletişime Geçin'
                : 'Contact Us for Your Vocational Education Mobility Projects'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
              {locale === 'tr'
                ? 'KA121 akreditasyon yıllık planı, KA122 proje başvuruları, ev sahibi kuruluş kaydı ve teknik sorularınız için doğrudan randevu alabilir veya mesaj bırakabilirsiniz.'
                : 'Schedule a direct video consultation or send a message regarding KA121 annual plans, KA122 applications, European host registrations or platform assistance.'}
            </p>
          </div>

          {/* Quick Consultation CTA */}
          <div className="pt-2 flex items-center gap-3 flex-wrap border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAppointmentOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-2"
            >
              <span>{locale === 'tr' ? 'Ücretsiz Online Randevu Planlayın (30 Dk)' : 'Schedule Free Online Consultation (30 Min)'}</span>
              <span>→</span>
            </button>

            <span className="text-xs text-slate-500 hidden sm:inline">
              {locale === 'tr' ? 'Birebir video görüşme ile proje analizi' : 'One-on-one video session with specialists'}
            </span>
          </div>
        </section>

        {/* Distinct Section Purpose & Top 3 Resources Card */}
        <DistinctSectionPurposeCard
          sectionKey="contact"
          tag={locale === 'tr' ? 'Kurumsal İletişim Masası' : 'Institutional Contact Desk'}
          tagColor="bg-blue-50 text-blue-900 border-blue-200"
          title={
            locale === 'tr'
              ? 'İletişim Bölümünün Rolü ve En Çok Aranan Kaynaklar'
              : 'Contact Section Role & Top Searched Resources'
          }
          purposeSentence={
            locale === 'tr'
              ? 'Proje planlama, KA121/KA122 rehberliği ve ev sahibi işletme eşleşmeleri için doğrudan uzman desteği iletişim merkezidir.'
              : 'Dedicated institutional contact center providing direct specialist consultation for project planning, KA121/KA122 guidance and European host matching.'
          }
          topResourcesTitle={
            locale === 'tr'
              ? 'İletişimde En Çok Aranan 3 Kaynak ve Hızlı Erişim'
              : 'Top 3 Most Searched Resources & Direct Access'
          }
          resources={[
            {
              icon: '📅',
              title: locale === 'tr' ? 'Ücretsiz 30 Dk Çevrimiçi Danışmanlık' : 'Free 30-Min Online Consultation',
              description:
                locale === 'tr'
                  ? 'Proje uzmanlarımızla Google Meet üzerinden birebir konsorsiyum ve hibe değerlendirmesi.'
                  : 'Direct 1-on-1 video conference with VET specialists to evaluate project feasibility.',
              href: '#appointment-section',
              badge: locale === 'tr' ? 'Canlı Randevu' : 'Live Booking',
              onClick: () => setIsAppointmentOpen(true),
            },
            {
              icon: '✉️',
              title: locale === 'tr' ? 'Kurumsal Talep & İletişim Formu' : 'Institutional Inquiry Form',
              description:
                locale === 'tr'
                  ? 'Okul OID numarası ve hareketlilik ihtiyaçlarınızla birlikte doğrudan resmi mesaj iletin.'
                  : 'Submit official institutional inquiries with school OID details directly to specialists.',
              href: '#contact-form',
              badge: locale === 'tr' ? '24s Yanıt' : '24h Response',
            },
            {
              icon: '❓',
              title: locale === 'tr' ? 'Destek Masası & Sıkça Sorulan Sorular' : 'Support Desk & FAQ',
              description:
                locale === 'tr'
                  ? 'Onaylı işletme doğrulama kriterleri, OID eşleşmesi ve veri koruma hakları.'
                  : 'Host verification criteria, school OID matchmaking and privacy compliance FAQs.',
              href: '#faq-section',
              badge: locale === 'tr' ? 'Destek' : 'Support',
            },
          ]}
          footerNotice={
            locale === 'tr'
              ? 'Hafta içi 09:00 - 18:00 saatleri arasında iletilen tüm talepler aynı iş günü içinde işleme alınır.'
              : 'All requests submitted on business days (09:00 - 18:00 TSI) are acknowledged on the same day.'
          }
        />

        {/* 2-Column Contact Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Channel 1: Appointment Card */}
            <div id="appointment-section" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-xl">
                  🗓️
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 m-0">
                    {locale === 'tr' ? 'Birebir Danışmanlık Randevusu' : '1-on-1 Consultation Booking'}
                  </h3>
                  <p className="text-[11px] text-slate-500 m-0">
                    {locale === 'tr' ? 'Google Meet üzerinden 30 dakikalık görüşme' : '30-minute online video session'}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Okulunuzun akreditasyon hedefleri, hibe tahsisatı, öğrenci staj kotaları ve host sözleşmeleri için uzmanlarımızla uygun gün ve saatte randevu planlayın.'
                  : 'Book a session with our Erasmus+ specialists to discuss school goals, grant budgets, student quotas and European host contracts.'}
              </p>

              <button
                type="button"
                onClick={() => setIsAppointmentOpen(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>{locale === 'tr' ? 'Randevu Takvimini Aç' : 'Open Calendar'}</span>
                <span>→</span>
              </button>
            </div>

            {/* Direct Channel 2: Contact Info */}
            <div id="working-hours-section" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'İrtibat Noktaları & Çalışma Saatleri' : 'Liaison Desks & Operating Hours'}
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start gap-3">
                  <span className="text-base">✉️</span>
                  <div>
                    <div className="font-bold text-slate-900">{locale === 'tr' ? 'Genel İletişim & Destek' : 'General Enquiries'}</div>
                    <a
                      href="mailto:info@erasmusmobility.com"
                      className="text-blue-700 hover:text-blue-900 font-semibold underline text-xs"
                    >
                      info@erasmusmobility.com
                    </a>
                    <div className="text-slate-500 text-[11px] mt-0.5">
                      {locale === 'tr'
                        ? 'Resmi kurum yazışmaları, ortaklık ve genel platform desteği'
                        : 'Official institutional correspondence & general platform assistance'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base">💬</span>
                  <div>
                    <div className="font-bold text-slate-900">{locale === 'tr' ? 'Doğrudan İletişim Formu' : 'Direct Inquiries'}</div>
                    <div className="text-slate-600 text-xs">
                      {locale === 'tr' 
                        ? 'Yandaki form üzerinden ilettiğiniz tüm talepler ErasmusMobility uzmanlarına doğrudan iletilir.'
                        : 'All inquiries submitted via the form are directly routed to ErasmusMobility specialists.'}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base">📍</span>
                  <div>
                    <div className="font-bold text-slate-900">{locale === 'tr' ? 'Koordinasyon Masası' : 'Coordination Desk'}</div>
                    <div className="text-slate-600 font-semibold">ErasmusMobility</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-base">⏱️</span>
                  <div>
                    <div className="font-bold text-slate-900">{locale === 'tr' ? 'Çalışma Saatleri' : 'Working Hours'}</div>
                    <div className="text-slate-600">
                      {locale === 'tr' ? 'Pazartesi - Cuma: 09:00 - 18:00 (TSI)' : 'Monday - Friday: 09:00 - 18:00 (TSI)'}
                    </div>
                    <div className="text-slate-400 text-[11px]">{locale === 'tr' ? 'Hafta sonu gelen talepler ilk iş günü yanıtlanır' : 'Weekend requests replied on Monday'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div id="contact-form" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
              <div>
                <h2 className="text-base font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Doğrudan İletişim Formu' : 'Direct Message Form'}
                </h2>
                <p className="text-xs text-slate-500 m-0 mt-0.5">
                  {locale === 'tr'
                    ? 'Sorularınızı iletin, uzman ekibimiz en geç 24 saat içinde dönüş sağlasın.'
                    : 'Submit your inquiry, and our support team will respond within 24 hours.'}
                </p>
              </div>

              {isSubmitted ? (
                <div role="status" aria-live="polite" className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-2xl mx-auto">
                    ✓
                  </div>
                  <h3 className="text-base font-bold text-emerald-950 m-0">
                    {locale === 'tr' ? 'Mesajınız Başarıyla İletildi!' : 'Your Message Has Been Sent!'}
                  </h3>
                  {trackingId && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-900 font-mono text-xs font-bold shadow-2xs">
                      <span>🔖</span>
                      <span>{locale === 'tr' ? 'Takip Numarası:' : 'Tracking Ref:'} {trackingId}</span>
                    </div>
                  )}
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    {locale === 'tr'
                      ? 'Talebiniz kaydedilmiştir. Teyit ve yanıt mesajı belirttiğiniz e-posta adresine iletilecektir (Reply-To: info@erasmusmobility.com). Doğrudan sorularınız için info@erasmusmobility.com üzerinden de iletişime geçebilirsiniz.'
                      : 'Your inquiry has been logged. Confirmation will be sent to your email address (Reply-To: info@erasmusmobility.com). For direct questions, contact info@erasmusmobility.com.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                      setTrackingId(null);
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    {locale === 'tr' ? 'Yeni Mesaj Gönder' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>
                  {/* Anti-bot Honeypot Trap (Completely hidden to users) */}
                  <div className="absolute opacity-0 pointer-events-none -left-[9999px] h-0 overflow-hidden" aria-hidden="true">
                    <label htmlFor="website-hp">Website</label>
                    <input
                      id="website-hp"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={hpField}
                      onChange={(e) => setHpField(e.target.value)}
                    />
                  </div>

                  {formError && (
                    <div id="contact-form-error" role="alert" aria-live="assertive" className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                      <span aria-hidden="true">⚠️</span>
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="contact-full-name" className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Ad Soyad' : 'Full Name'} *
                      </label>
                      <input
                        id="contact-full-name"
                        name="full_name"
                        type="text"
                        autoComplete="name"
                        required
                        aria-invalid={!!formError}
                        aria-describedby={formError ? "contact-form-error" : undefined}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={locale === 'tr' ? 'Ahmet Yılmaz' : 'John Doe'}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-org-name" className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Kurum Adı' : 'Institution Name'} *
                      </label>
                      <input
                        id="contact-org-name"
                        name="org_name"
                        type="text"
                        autoComplete="organization"
                        required
                        aria-invalid={!!formError}
                        aria-describedby={formError ? "contact-form-error" : undefined}
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder={locale === 'tr' ? 'Örnek Mesleki ve Teknik Anadolu Lisesi' : 'Sample Vocational and Technical High School'}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="contact-oid" className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Kurum OID (Varsa)' : 'Institution OID (Optional)'}
                      </label>
                      <input
                        id="contact-oid"
                        name="oid"
                        type="text"
                        autoComplete="off"
                        value={oid}
                        onChange={(e) => setOid(e.target.value)}
                        placeholder="E10389241"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-subject" className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Konu / Başvuru Türü' : 'Subject'} *
                      </label>
                      <select
                        id="contact-subject"
                        name="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                      >
                        <option value="KA121">
                          {locale === 'tr' ? 'KA121 Akredite Hibe Planlama' : 'KA121 Accredited Grant Planning'}
                        </option>
                        <option value="KA122">
                          {locale === 'tr' ? 'KA122 Kısa Dönemli Proje Başvurusu' : 'KA122 Short-Term Project Application'}
                        </option>
                        <option value="HOST">
                          {locale === 'tr' ? 'Avrupa Ev Sahibi Kuruluş Olmak İstiyorum' : 'I Want to Become a European Host'}
                        </option>
                        <option value="SUPPORT">
                          {locale === 'tr' ? 'Platform ve Teknik Destek' : 'Platform and Technical Support'}
                        </option>
                        <option value="OTHER">
                          {locale === 'tr' ? 'Diğer Kurumsal İş Birliği' : 'Other Institutional Cooperation'}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Kurumsal E-posta' : 'Email Address'} *
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        aria-invalid={!!formError}
                        aria-describedby={formError ? "contact-form-error" : undefined}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={locale === 'tr' ? 'proje@okulunuz.k12.tr' : 'project@yourschool.edu'}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-phone" className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Telefon / WhatsApp' : 'Phone'}
                      </label>
                      <input
                        id="contact-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 532 000 0000"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-message" className="text-xs font-bold text-slate-800">
                      {locale === 'tr' ? 'Mesajınız' : 'Your Message'} *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={4}
                      aria-invalid={!!formError}
                      aria-describedby={formError ? "contact-form-error" : undefined}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={
                        locale === 'tr'
                          ? 'Hareketlilik hedefleriniz, öğrenci sayısı veya danışmak istediğiniz hususlar hakkında bilgi veriniz...'
                          : 'Please describe your inquiry, target student mobilities or required support...'
                      }
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 leading-relaxed"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>{locale === 'tr' ? 'Gönderiliyor...' : 'Sending...'}</span>
                        </>
                      ) : (
                        <span>{locale === 'tr' ? 'Mesajı Gönder' : 'Submit Message'}</span>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-2 text-[11px] text-slate-500">
                    <span>{locale === 'tr' ? 'Yardıma mı ihtiyacınız var? ' : 'Need help? '}</span>
                    <a href="mailto:info@erasmusmobility.com" className="text-blue-700 font-bold hover:underline">
                      {locale === 'tr' ? 'info@erasmusmobility.com ile iletişime geçin' : 'Contact info@erasmusmobility.com'}
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 3. Interactive FAQ Accordion Section (#faq-section) */}
        <section id="faq-section" className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">❓</span>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 m-0">
                  {locale === 'tr' ? 'Sıkça Sorulan Sorular (SSS)' : 'Frequently Asked Questions (FAQ)'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800">
                  {FAQ_ITEMS.length} {locale === 'tr' ? 'Soru' : 'Questions'}
                </span>
              </div>
              <p className="text-xs text-slate-600 m-0">
                {locale === 'tr'
                  ? 'Onaylı ev sahibi işletme doğrulama kriterleri, okul OID eşleşmesi, hibe kuralları ve KVKK/GDPR güvenceleri.'
                  : 'Certified host verification criteria, school OID synchronization, grant rules, and data governance.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAppointmentOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs border border-blue-200 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>📅</span>
              <span>{locale === 'tr' ? 'Uzmana Canlı Danışın' : 'Consult a Specialist'}</span>
            </button>
          </div>

          <div className="space-y-3" role="region" aria-label={locale === 'tr' ? 'Sıkça Sorulan Sorular' : 'Frequently Asked Questions'}>
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-xl border transition-all duration-150 overflow-hidden ${
                    isOpen
                      ? 'border-blue-400 bg-blue-50/20 shadow-xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${idx}`}
                    id={`faq-question-${idx}`}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black font-mono shrink-0 ${
                        isOpen ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className={`text-xs sm:text-sm font-bold ${
                        isOpen ? 'text-blue-950' : 'text-slate-900'
                      }`}>
                        {locale === 'tr' ? item.qTr : item.qEn}
                      </span>
                    </div>

                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-700' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${idx}`}
                      role="region"
                      aria-labelledby={`faq-question-${idx}`}
                      className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 border-t border-blue-100/60 animate-fadeIn"
                    >
                      <p className="text-xs text-slate-700 leading-relaxed m-0 pt-3">
                        {locale === 'tr' ? item.aTr : item.aEn}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* 4. Institutional Footer */}
      <AppFooter />

      {/* 5. Modals */}
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />
      <AppointmentModal
        isOpen={isAppointmentOpen}
        onClose={() => setIsAppointmentOpen(false)}
      />
    </div>
  );
}
