'use client';

import React from 'react';
import Link from 'next/link';
import { SignUpButton } from '@clerk/nextjs';
import { useTranslation } from '../../lib/i18n';

export interface HeroContrastSectionProps {
  onStartSchoolDemo?: () => void;
  onStartHostDemo?: () => void;
}

export default function HeroContrastSection({
  onStartSchoolDemo,
  onStartHostDemo,
}: HeroContrastSectionProps) {
  const { locale } = useTranslation();

  return (
    <section className="bg-[#0B1930] text-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-slate-800 space-y-8">
      {/* Top Tag & Context */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
            <span>🇪🇺</span>
            <span>{locale === 'tr' ? 'Erasmus+ Mesleki Eğitim (VET) Planlama Ağı' : 'Erasmus+ VET Mobility Planning Network'}</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
            <span>🇹🇷 ➔ 🇪🇺</span>
            <span>
              {locale === 'tr'
                ? "Türkiye'den Avrupa'ya Hareketlilik"
                : 'Türkiye-to-Europe Mobility'}
            </span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{locale === 'tr' ? '1. Yıl Ücretsiz Model' : '1st Year Free'}</span>
          </span>
        </div>

        <span className="text-xs font-mono text-slate-400">
          KA121 • KA122 • Europass
        </span>
      </div>

      {/* Main Headline */}
      <div className="max-w-3xl space-y-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
          {locale === 'tr'
            ? "Türkiye'den Avrupa'ya Mesleki Hareketlilik Planlama ve Ortak Ağı"
            : 'Plan Your Türkiye-to-Europe Mobility: Verified Host Network & Planning Platform'}
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          {locale === 'tr'
            ? "Platformumuz; Türkiye'den Avrupa'ya KA121 ve KA122 hareketliliği planlayan meslek liseleri, konsorsiyumlar ve eğitim kurumlarını; kurumsal ihtiyaç analizi, onaylı Avrupa ev sahibi eşleşmesi ve resmi AB evrak otomasyonu ile uçtan uca destekler."
            : 'Our platform supports organisations and vocational schools planning Türkiye-to-Europe KA121/KA122 mobility through needs assessment, verified European host matching, distance band grants, and official EU documentation.'}
        </p>
      </div>

      {/* The 2 Primary Action Doors (Symmetrical & Clean) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-1">
        {/* DOOR 1: YARARLANICI / OKUL MASASI */}
        <div className="bg-[#122442] border-2 border-blue-500/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-md hover:border-blue-400 transition-all">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏛️</span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300 block">
                    {locale === 'tr' ? '1. Kapı: Gönderici Kurumlar' : 'Gate 1: Sending Institutions'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white m-0">
                    {locale === 'tr' ? 'Yararlanıcı / Okul Masası' : 'Beneficiary / School Desk'}
                  </h2>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-600/40 text-blue-200 border border-blue-500/40 shrink-0">
                {locale === 'tr' ? 'VET Okulları' : 'VET Schools'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed m-0">
              {locale === 'tr'
                ? "Türkiye'den Avrupa'ya hareketlilik planlayan meslek liseleri ve konsorsiyumlar için proje hazırlığı, ihtiyaç analizi, ev sahibi eşleşmesi ve resmi evrak ihracı."
                : 'Project preparation, needs assessment, verified host matching, and official dossier export for vocational schools planning Türkiye-to-Europe mobility.'}
            </p>

            {/* 3 Value Points */}
            <ul className="space-y-2 pt-1">
              <li className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                <span>{locale === 'tr' ? '5 Adımlı Hareketlilik Planlama ve OID doğrulaması' : '5-Step Mobility Planning & OID validation'}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                <span>{locale === 'tr' ? 'Mesafe bandına göre anında resmi AB hibe hesabı' : 'Instant official EU grant budget calculation'}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-blue-500/30 text-blue-300 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                <span>{locale === 'tr' ? 'Öğrenim Anlaşması ve Europass Hareketlilik Belgesi ihracı' : 'Learning Agreement & Europass Mobility export'}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-700/70 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <Link
                href="/school/pipeline"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-blue-400"
              >
                <span>{locale === 'tr' ? 'Hareketliliğinizi Planlayın' : 'Plan your mobility'}</span>
                <span>→</span>
              </Link>

              {onStartSchoolDemo && (
                <button
                  type="button"
                  onClick={onStartSchoolDemo}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-200 border border-slate-700 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>{locale === 'tr' ? 'Okul Demosu' : 'School Demo'}</span>
                </button>
              )}
            </div>

            {/* Symmetrical Registration Row */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="text-blue-300 hover:text-white font-semibold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <span>{locale === 'tr' ? 'Yararlanıcı / Okul Kaydı Oluştur' : 'Register Beneficiary School'}</span>
                  <span>→</span>
                </button>
              </SignUpButton>
              <span className="text-slate-400 text-[11px]">
                {locale === 'tr' ? 'Resmi OID ile Doğrulama' : 'OID Verification'}
              </span>
            </div>
          </div>
        </div>

        {/* DOOR 2: AVRUPA EV SAHİBİ MASASI */}
        <div className="bg-[#0e2a22] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-md hover:border-emerald-400 transition-all">
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🏢</span>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300 block">
                    {locale === 'tr' ? '2. Kapı: Ev Sahibi Kurumlar' : 'Gate 2: Hosting Organisations'}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black text-white m-0">
                    {locale === 'tr' ? 'Avrupa Ev Sahibi Masası' : 'European Host Desk'}
                  </h2>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600/40 text-emerald-200 border border-emerald-500/40 shrink-0">
                {locale === 'tr' ? 'Ev Sahibi Kuruluşlar ve Staj' : 'Hosts & Internships'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed m-0">
              {locale === 'tr'
                ? 'Avrupa’daki işletmeler ve eğitim merkezleri için stajyer kabulü, işbaşı gözlem kontenjanları ve doğrudan okul iletişimi.'
                : 'Direct intern placement and structured courses across Europe with verified sending schools and zero agency fees.'}
            </p>

            {/* 3 Value Points */}
            <ul className="space-y-2 pt-1">
              <li className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                <span>{locale === 'tr' ? 'Akredite meslek liselerinden doğrudan stajyer talepleri' : 'Direct intern requests from accredited VET schools'}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                <span>{locale === 'tr' ? 'Kurs ve işbaşı gözlem kontenjanlarını yayına alma' : 'Publish course and job shadowing opportunities'}</span>
              </li>
              <li className="flex items-center gap-2 text-xs text-slate-300">
                <span className="w-4 h-4 rounded-full bg-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-[10px] shrink-0">✓</span>
                <span>{locale === 'tr' ? 'Aracı komisyonu olmadan okul koordinatörüyle doğrudan temas' : 'Direct coordinator dialogue with zero intermediary fees'}</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-700/70 space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <Link
                href="/marketplace"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm text-center shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{locale === 'tr' ? 'Pazaryerini İncele' : 'Explore Marketplace'}</span>
                <span>→</span>
              </Link>

              {onStartHostDemo && (
                <button
                  type="button"
                  onClick={onStartHostDemo}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-200 border border-slate-700 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <span>{locale === 'tr' ? 'Ev Sahibi Kuruluş Demosu' : 'Host Demo'}</span>
                </button>
              )}
            </div>

            {/* Symmetrical Registration Row */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-0.5">
              <SignUpButton mode="modal">
                <button
                  type="button"
                  className="text-emerald-300 hover:text-white font-semibold hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <span>{locale === 'tr' ? 'Ev Sahibi Kurum Kaydı Oluştur' : 'Register Host Organisation'}</span>
                  <span>→</span>
                </button>
              </SignUpButton>
              <span className="text-slate-400 text-[11px]">
                {locale === 'tr' ? 'Doğrulanmış Kurum Profili' : 'Verified Profile'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Trust & Metric Strip */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="text-blue-400">💶</span>
            <span>{locale === 'tr' ? 'Güncel AB Hibe Kuralları' : 'Official EU Grant Rules'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-400">📄</span>
            <span>{locale === 'tr' ? 'Europass & Öğrenim Anlaşması Standartları' : 'Europass & Learning Agreement'}</span>
          </span>
        </div>

        <Link
          href="/guide"
          className="text-slate-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
        >
          <span>{locale === 'tr' ? 'Platform Kullanım Kılavuzu' : 'Platform Guide'}</span>
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}
