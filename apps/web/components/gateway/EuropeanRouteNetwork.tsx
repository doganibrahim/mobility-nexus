'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';
import {
  EUROPE_COUNTRY_PATHS,
  MOBILITY_COUNTRIES,
  ORIGIN_TURKEY,
  MobilityCountry,
} from './europeMapData';

export default function EuropeanRouteNetwork() {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  const [activeCountryId, setActiveCountryId] = useState<string>('DE');
  const [isGreenTravel, setIsGreenTravel] = useState<boolean>(false);
  const [participantRole, setParticipantRole] = useState<'learner' | 'staff'>('learner');
  const [durationDays, setDurationDays] = useState<number>(14);

  const activeCountry: MobilityCountry =
    MOBILITY_COUNTRIES.find((c) => c.id === activeCountryId) ||
    MOBILITY_COUNTRIES[0];

  const travelGrant = isGreenTravel
    ? activeCountry.greenGrantEuro
    : activeCountry.travelGrantEuro;

  const dailyGrant = participantRole === 'learner'
    ? activeCountry.learnerDailyGrantEuro
    : activeCountry.staffDailyGrantEuro;

  // Official Erasmus+ 15th+ day 70% rule
  const calculateTotalIndividualSupport = (days: number, rate: number) => {
    if (days <= 14) {
      return days * rate;
    }
    const baseAmount = 14 * rate;
    const reducedDays = days - 14;
    const reducedRate = Math.round(rate * 0.7);
    return baseAmount + (reducedDays * reducedRate);
  };

  const totalIndividualSupport = calculateTotalIndividualSupport(durationDays, dailyGrant);
  const totalGrantPackage = travelGrant + totalIndividualSupport;

  // Active path curve from Turkey to selected country
  const midX = (ORIGIN_TURKEY.x + activeCountry.x) / 2;
  const midY = Math.min(ORIGIN_TURKEY.y, activeCountry.y) - 60;
  const activePathD = `M ${ORIGIN_TURKEY.x} ${ORIGIN_TURKEY.y} Q ${midX} ${midY} ${activeCountry.x} ${activeCountry.y}`;

  // Quick lookup set for partner countries
  const partnerCountryMap = new Map(
    MOBILITY_COUNTRIES.map((c) => [c.id, c])
  );

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-900 border border-blue-200">
              <span>🗺️</span>
              <span>{isTr ? 'Avrupa Hareketlilik Ağı' : 'European Mobility Network'}</span>
            </span>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              {isTr ? 'Mesafe Bandı & Hibe Otomasyonu' : 'Distance Band & Grant Automation'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 m-0">
            {isTr
              ? 'Türkiye’den Avrupa’ya Hareketlilik Koridorları'
              : 'Mobility Corridors from Turkey to Europe'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 m-0">
            {isTr
              ? 'Avrupa Komisyonu mesafe bandı ve ülke hibe gruplarına göre anlık seyahat ve harcırah hesaplama.'
              : 'Real-time Erasmus+ distance band grants and daily unit costs across partner countries.'}
          </p>
        </div>

        <Link
          href="/school/pipeline"
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-extrabold rounded-xl transition-colors shadow-2xs self-start md:self-auto flex items-center gap-1.5 cursor-pointer"
        >
          <span>{isTr ? 'Kendi Rotanı Hesapla' : 'Calculate Your Route'}</span>
          <span>→</span>
        </Link>
      </div>

      {/* Main Interactive Stage: Real Vector Map (7 cols) + Detail & Cost Card (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Real Geographic European Vector Map Canvas (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-[#081220] rounded-2xl p-4 sm:p-5 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-inner min-h-[380px]">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="radar-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#radar-grid)" />
            </svg>
          </div>

          {/* Real Geographic Vector Map SVG */}
          <svg
            viewBox="200 130 800 550"
            className="w-full h-auto select-none relative z-10"
            style={{ maxHeight: '420px' }}
          >
            <defs>
              <style>{`
                @keyframes routeDashFlow {
                  to {
                    stroke-dashoffset: -28;
                  }
                }
              `}</style>
            </defs>

            {/* 1. All European Countries Landmass Geometry */}
            <g id="europe-landmasses">
              {EUROPE_COUNTRY_PATHS.map((c, idx) => {
                const isTurkey = c.id === 'TR';
                const isPartner = partnerCountryMap.has(c.id);
                const isActive = c.id === activeCountryId;

                let fill = '#111C2E';
                let stroke = '#1E2D44';
                let strokeWidth = 0.8;

                if (isTurkey) {
                  fill = '#1E3A8A';
                  stroke = '#3B82F6';
                  strokeWidth = 1.4;
                } else if (isActive) {
                  fill = isGreenTravel ? '#065F46' : '#1D4ED8';
                  stroke = isGreenTravel ? '#34D399' : '#60A5FA';
                  strokeWidth = 1.8;
                } else if (isPartner) {
                  fill = '#1A2942';
                  stroke = '#334D6E';
                  strokeWidth = 1;
                }

                return (
                  <path
                    key={`country-${c.id}-${idx}`}
                    d={c.d}
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    onClick={() => {
                      if (isPartner) {
                        setActiveCountryId(c.id);
                      }
                    }}
                    className={`transition-colors duration-200 ${
                      isPartner ? 'cursor-pointer hover:fill-blue-900/70' : ''
                    }`}
                  >
                    <title>{c.name}</title>
                  </path>
                );
              })}
            </g>

            {/* 2. Inactive Flight Corridors */}
            <g id="inactive-corridors">
              {MOBILITY_COUNTRIES.filter((c) => c.id !== activeCountryId).map((c) => {
                const mx = (ORIGIN_TURKEY.x + c.x) / 2;
                const my = Math.min(ORIGIN_TURKEY.y, c.y) - 40;
                const pathD = `M ${ORIGIN_TURKEY.x} ${ORIGIN_TURKEY.y} Q ${mx} ${my} ${c.x} ${c.y}`;

                return (
                  <path
                    key={`corridor-${c.id}`}
                    d={pathD}
                    fill="none"
                    stroke="#2A3D59"
                    strokeWidth="1.2"
                    strokeDasharray="4 4"
                  />
                );
              })}
            </g>

            {/* 3. Active Flight Corridor with Moving Beam Flow */}
            <path
              d={activePathD}
              fill="none"
              stroke={isGreenTravel ? '#10B981' : '#38BDF8'}
              strokeWidth="3.5"
              strokeDasharray="8 6"
              style={{
                animation: 'routeDashFlow 1.3s linear infinite',
              }}
              className="transition-all duration-300"
            />

            {/* 4. Origin Node: Turkey */}
            <g className="cursor-pointer select-none">
              <circle
                cx={ORIGIN_TURKEY.x}
                cy={ORIGIN_TURKEY.y}
                r="16"
                fill="#3B82F6"
                fillOpacity="0.25"
                className="animate-ping"
              />
              <circle
                cx={ORIGIN_TURKEY.x}
                cy={ORIGIN_TURKEY.y}
                r="8"
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth="2.5"
              />
              <text
                x={ORIGIN_TURKEY.x}
                y={ORIGIN_TURKEY.y + 20}
                fill="#FFFFFF"
                fontSize="12"
                fontWeight="900"
                textAnchor="middle"
                className="pointer-events-none"
              >
                {ORIGIN_TURKEY.flag} {isTr ? ORIGIN_TURKEY.nameTr : ORIGIN_TURKEY.nameEn}
              </text>
            </g>

            {/* 5. Destination Partner Country Markers */}
            {MOBILITY_COUNTRIES.map((country) => {
              const isActive = country.id === activeCountryId;
              const textX = country.x + (country.labelDx ?? 0);
              const textY = country.y + (country.labelDy ?? -12);
              const textAnchor = country.labelAnchor ?? 'middle';
              const dotColor = isActive
                ? isGreenTravel
                  ? '#10B981'
                  : '#38BDF8'
                : '#94A3B8';

              return (
                <g
                  key={`marker-${country.id}`}
                  onClick={() => setActiveCountryId(country.id)}
                  className="cursor-pointer group"
                >
                  {/* Generous invisible tap/click target */}
                  <circle cx={country.x} cy={country.y} r="20" fill="transparent" />

                  {/* Pulsing ring on active */}
                  {isActive && (
                    <circle
                      cx={country.x}
                      cy={country.y}
                      r="16"
                      fill={dotColor}
                      fillOpacity="0.3"
                      className="animate-pulse"
                    />
                  )}

                  {/* Core Country Dot */}
                  <circle
                    cx={country.x}
                    cy={country.y}
                    r={isActive ? 8 : 5}
                    fill={dotColor}
                    stroke="#FFFFFF"
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />

                  {/* Country Name & Flag */}
                  <text
                    x={textX}
                    y={textY}
                    fill={isActive ? '#FFFFFF' : '#CBD5E1'}
                    fontSize={isActive ? '13' : '11'}
                    fontWeight={isActive ? '900' : '700'}
                    textAnchor={textAnchor}
                    className="transition-colors group-hover:fill-white select-none pointer-events-none drop-shadow-sm"
                  >
                    {country.flag} {isTr ? country.nameTr : country.nameEn}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Sleek bottom radar status indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-800/80 relative z-10">
            <span className="flex items-center gap-2 font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {isTr ? 'Aktif Rota:' : 'Active Route:'}{' '}
                <strong className="text-white font-black">
                  Türkiye ➔ {isTr ? activeCountry.nameTr : activeCountry.nameEn} ({activeCountry.distanceKm} km)
                </strong>
              </span>
            </span>
            <span className="text-slate-400 hidden sm:inline text-[11px]">
              {isTr ? '💡 Harita üzerindeki ülkelere tıklayabilirsiniz' : '💡 Click countries directly on the map'}
            </span>
          </div>
        </div>

        {/* Dynamic Detail & Cost Card (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border-2 border-slate-200 p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Header: Selected Country & Distance Band */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  {isTr ? 'SEÇİLİ HAREKETLİLİK ÜLKESİ' : 'SELECTED DESTINATION COUNTRY'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 m-0 flex items-center gap-2 mt-0.5">
                  <span>{activeCountry.flag}</span>
                  <span>{isTr ? activeCountry.nameTr : activeCountry.nameEn}</span>
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300 shrink-0 shadow-2xs">
                {activeCountry.distanceKm} km
              </span>
            </div>

            {/* Destination Country Dropdown for Instant Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                🎯 {isTr ? 'Hedef Ülkeyi Değiştir:' : 'Change Destination Country:'}
              </label>
              <select
                value={activeCountryId}
                onChange={(e) => setActiveCountryId(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                {MOBILITY_COUNTRIES.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.flag} {isTr ? country.nameTr : country.nameEn} - {country.distanceKm} km ({isTr ? 'Grup' : 'Group'} {country.group})
                  </option>
                ))}
              </select>
            </div>

            {/* Role & Duration Switchers */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {isTr ? 'KATILIMCI TÜRÜ' : 'PARTICIPANT ROLE'}
                </span>
                <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setParticipantRole('learner')}
                    className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold transition-all ${
                      participantRole === 'learner'
                        ? 'bg-white text-blue-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👨‍🎓 {isTr ? 'Öğrenci' : 'Learner'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setParticipantRole('staff')}
                    className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold transition-all ${
                      participantRole === 'staff'
                        ? 'bg-white text-blue-900 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    👨‍🏫 {isTr ? 'Personel' : 'Staff'}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  {isTr ? 'FAALİYET SÜRESİ' : 'DURATION'}
                </span>
                <div className="flex rounded-lg bg-slate-100 p-0.5 border border-slate-200">
                  {[14, 21, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDurationDays(d)}
                      className={`flex-1 py-1 rounded-md text-[11px] font-bold transition-all ${
                        durationDays === d
                          ? 'bg-white text-blue-900 shadow-2xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {d} {isTr ? 'Gün' : 'd'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* EU Calculated Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isTr ? 'SEYAHAT DESTEĞİ' : 'TRAVEL GRANT'}
                </span>
                <div className={`text-2xl font-black mt-0.5 ${isGreenTravel ? 'text-emerald-700' : 'text-blue-700'}`}>
                  {travelGrant} €
                </div>
                <span className="text-[11px] text-slate-500">
                  {isGreenTravel
                    ? isTr ? 'Yeşil Seyahat / Kişi' : 'Green Travel / Person'
                    : isTr ? 'Standart / Kişi' : 'Standard / Person'}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {isTr ? 'GÜNLÜK HARCIRAH' : 'DAILY UNIT COST'}
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  {dailyGrant} €
                </div>
                <span className="text-[11px] text-slate-500">
                  {isTr
                    ? `Grup ${activeCountry.group} • ${participantRole === 'learner' ? 'Öğrenci Tarifesi' : 'Personel Tarifesi'}`
                    : `Group ${activeCountry.group} • ${participantRole === 'learner' ? 'Learner Rate' : 'Staff Rate'}`}
                </span>
              </div>
            </div>

            {/* Green Travel Toggle Option */}
            <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isGreenTravel}
                  onChange={(e) => setIsGreenTravel(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                />
                <span className="font-semibold text-slate-800">
                  🌱 {isTr ? 'Yeşil Seyahat Desteği' : 'Green Travel Bonus'}
                </span>
              </label>

              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {isGreenTravel
                  ? `+${activeCountry.greenGrantEuro - activeCountry.travelGrantEuro} € ${isTr ? 'Ek Hibe' : 'Extra'}`
                  : (isTr ? 'Standart' : 'Standard')}
              </span>
            </div>

            {/* Total Budget Preview with 15th+ day 70% rule */}
            <div className="p-3.5 bg-blue-50/80 rounded-xl border border-blue-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-xs font-extrabold text-blue-900 block">
                  💶 {isTr ? `Örnek ${durationDays} Günlük Hibe Paketi:` : `Sample ${durationDays}-Day Grant Package:`}
                </span>
                <span className="text-[11px] text-blue-700">
                  {travelGrant} € ({isTr ? 'Seyahat' : 'Travel'}) + {totalIndividualSupport} € ({isTr ? 'Harcırah' : 'Subsistence'})
                  {durationDays > 14 && (
                    <span className="block text-[10px] text-blue-600 mt-0.5">
                      {isTr
                        ? `(14 × ${dailyGrant} € + ${durationDays - 14} × ${Math.round(dailyGrant * 0.7)} € [%70 Kuralı])`
                        : `(14 × ${dailyGrant} € + ${durationDays - 14} × ${Math.round(dailyGrant * 0.7)} € [70% Rule])`}
                    </span>
                  )}
                </span>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-blue-950 block">
                  {totalGrantPackage} €
                </span>
                <span className="text-[10px] font-semibold text-blue-700">
                  {participantRole === 'learner'
                    ? (isTr ? 'Öğrenci Başına' : 'Per Learner')
                    : (isTr ? 'Personel Başına' : 'Per Staff')}
                </span>
              </div>
            </div>

            {/* Official Erasmus+ Distance Band Explanation */}
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed">
              <span className="font-bold text-slate-800 block mb-0.5">
                📌 {isTr ? 'Resmi 2024–2027 Erasmus+ Hibe Kuralları:' : 'Official 2024–2027 Erasmus+ Grant Rules:'}
              </span>
              {isTr
                ? 'Seyahat hibeleri güncel resmi mesafe bantlarına göre hesaplanır. Bireysel destek harcırahı ev sahibi ülkenin yaşam maliyet grubuna (Grup 1–3) göre belirlenir ve 15. günden itibaren %70 oranında ödenir.'
                : 'Travel grants are aligned with official 2024–2027 distance bands. Subsistence adheres to country living cost groups (Group 1–3) with a 70% rate applied from day 15 onward.'}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <Link
              href={`/marketplace?country=${encodeURIComponent(activeCountry.nameEn)}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center transition-colors shadow-2xs"
            >
              <span>{isTr ? 'Bu Ülke İlanlarını Gör' : 'View Country Offers'}</span>
              <span> →</span>
            </Link>

            <Link
              href="/school/pipeline"
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-colors shadow-2xs text-center"
            >
              <span>{isTr ? 'Hibe Planla' : 'Plan Grant'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
