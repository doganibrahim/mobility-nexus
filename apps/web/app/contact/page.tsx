'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal from '../../components/ui/LegalModal';
import AppointmentModal from '../../components/ui/AppointmentModal';
import { useTranslation } from '../../lib/i18n';

export default function ContactPage() {
  const { t, locale } = useTranslation();
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [isAppointmentOpen, setIsAppointmentOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [oid, setOid] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('KA121');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
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
            <span>Online Danışmanlık</span>
            <span>•</span>
            <span>30 Dk Randevu</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Canvas */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-10">
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
                ? 'KA121 akreditasyon yıllık planı, KA122 proje başvuruları, ev sahibi (host) işletme kaydı ve teknik sorularınız için doğrudan randevu alabilir veya mesaj bırakabilirsiniz.'
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
              <span>📅</span>
              <span>{locale === 'tr' ? 'Ücretsiz Online Randevu Planlayın (30 Dk)' : 'Schedule Free Online Consultation (30 Min)'}</span>
              <span>→</span>
            </button>

            <span className="text-xs text-slate-500 hidden sm:inline">
              {locale === 'tr' ? 'Birebir video görüşme ile proje analizi' : 'One-on-one video session with specialists'}
            </span>
          </div>
        </section>

        {/* 2-Column Contact Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Direct Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Direct Channel 1: Appointment Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
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
                <span>📅</span>
                <span>{locale === 'tr' ? 'Randevu Takvimini Aç' : 'Open Calendar'}</span>
                <span>→</span>
              </button>
            </div>

            {/* Direct Channel 2: Contact Info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 m-0">
                {locale === 'tr' ? 'İrtibat Noktaları & Çalışma Saatleri' : 'Liaison Desks & Operating Hours'}
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
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
                    <div className="text-slate-600">Pazartesi - Cuma: 09:00 - 18:00 (TSI)</div>
                    <div className="text-slate-400 text-[11px]">{locale === 'tr' ? 'Hafta sonu gelen talepler ilk iş günü yanıtlanır' : 'Weekend requests replied on Monday'}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
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
                <div className="p-8 text-center bg-emerald-50 rounded-xl border border-emerald-200 space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center text-2xl mx-auto">
                    ✓
                  </div>
                  <h3 className="text-base font-bold text-emerald-950 m-0">
                    {locale === 'tr' ? 'Mesajınız Başarıyla İletildi!' : 'Your Message Has Been Sent!'}
                  </h3>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    {locale === 'tr'
                      ? 'Talebiniz kaydedilmiştir. Proje uzmanımız belirttiğiniz e-posta ve telefon üzerinden en kısa sürede sizinle irtibata geçecektir.'
                      : 'Your inquiry has been logged. Our VET project specialist will get in touch with you shortly.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setMessage('');
                    }}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    {locale === 'tr' ? 'Yeni Mesaj Gönder' : 'Send Another Message'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Ad Soyad' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ahmet Yılmaz"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Kurum Adı' : 'Institution Name'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        placeholder="Örnek Mesleki ve Teknik Anadolu Lisesi"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Kurum OID (Varsa)' : 'Institution OID (Optional)'}
                      </label>
                      <input
                        type="text"
                        value={oid}
                        onChange={(e) => setOid(e.target.value)}
                        placeholder="E10389241"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Konu / Başvuru Türü' : 'Subject'} *
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 bg-white"
                      >
                        <option value="KA121">KA121 Akredite Hibe Planlama</option>
                        <option value="KA122">KA122 Kısa Dönemli Proje Başvurusu</option>
                        <option value="HOST">Avrupa Ev Sahibi (Host) Olmak İstiyorum</option>
                        <option value="SUPPORT">Platform ve Teknik Destek</option>
                        <option value="OTHER">Diğer Kurumsal İş Birliği</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Kurumsal E-posta' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="proje@okulunuz.k12.tr"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-800">
                        {locale === 'tr' ? 'Telefon / WhatsApp' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+90 532 000 0000"
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      {locale === 'tr' ? 'Mesajınız' : 'Your Message'} *
                    </label>
                    <textarea
                      required
                      rows={4}
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
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>✉️</span>
                      <span>{locale === 'tr' ? 'Mesajı Gönder' : 'Submit Message'}</span>
                      <span>→</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
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
