'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';

interface RouteCity {
  id: string;
  nameTr: string;
  nameEn: string;
  countryTr: string;
  countryEn: string;
  flag: string;
  distanceKm: number;
  travelGrantEuro: number;
  dailyGrantEuro: number;
  sectorTr: string;
  sectorEn: string;
  isced: string;
  x: number;
  y: number;
  accent: 'blue' | 'emerald' | 'amber';
}

const ROUTE_CITIES: RouteCity[] = [
  {
    id: 'berlin',
    nameTr: 'Berlin',
    nameEn: 'Berlin',
    countryTr: 'Almanya',
    countryEn: 'Germany',
    flag: '🇩🇪',
    distanceKm: 1740,
    travelGrantEuro: 275,
    dailyGrantEuro: 165,
    sectorTr: 'Bilişim Teknolojileri & Mekatronik',
    sectorEn: 'IT & Mechatronics',
    isced: '0714 / 0610',
    x: 420,
    y: 170,
    accent: 'blue',
  },
  {
    id: 'madrid',
    nameTr: 'Madrid',
    nameEn: 'Madrid',
    countryTr: 'İspanya',
    countryEn: 'Spain',
    flag: '🇪🇸',
    distanceKm: 2750,
    travelGrantEuro: 360,
    dailyGrantEuro: 155,
    sectorTr: 'Yenilenebilir Enerji & Elektrik',
    sectorEn: 'Renewable Energy & Electrical',
    isced: '0712 / 0713',
    x: 190,
    y: 310,
    accent: 'emerald',
  },
  {
    id: 'rome',
    nameTr: 'Roma',
    nameEn: 'Rome',
    countryTr: 'İtalya',
    countryEn: 'Italy',
    flag: '🇮🇹',
    distanceKm: 1380,
    travelGrantEuro: 275,
    dailyGrantEuro: 165,
    sectorTr: 'Otomotiv & Endüstriyel Tasarım',
    sectorEn: 'Automotive & Industrial Design',
    isced: '0716 / 0212',
    x: 420,
    y: 295,
    accent: 'amber',
  },
  {
    id: 'vienna',
    nameTr: 'Viyana',
    nameEn: 'Vienna',
    countryTr: 'Avusturya',
    countryEn: 'Austria',
    flag: '🇦🇹',
    distanceKm: 1280,
    travelGrantEuro: 275,
    dailyGrantEuro: 165,
    sectorTr: 'Endüstri 4.0 & Otomasyon Sistemleri',
    sectorEn: 'Industry 4.0 & Automation Systems',
    isced: '0714 / 0710',
    x: 465,
    y: 220,
    accent: 'blue',
  },
  {
    id: 'warsaw',
    nameTr: 'Varşova',
    nameEn: 'Warsaw',
    countryTr: 'Polonya',
    countryEn: 'Poland',
    flag: '🇵🇱',
    distanceKm: 1400,
    travelGrantEuro: 275,
    dailyGrantEuro: 145,
    sectorTr: 'Lojistik & Ağ Güvenliği',
    sectorEn: 'Logistics & Network Security',
    isced: '1041 / 0612',
    x: 520,
    y: 165,
    accent: 'emerald',
  },
];

const ORIGIN_TURKEY = {
  name: 'İstanbul / Türkiye',
  flag: '🇹🇷',
  x: 620,
  y: 330,
};

export default function EuropeanRouteNetwork() {
  const { locale } = useTranslation();
  const [activeCityId, setActiveCityId] = useState<string>('berlin');

  const activeCity =
    ROUTE_CITIES.find((c) => c.id === activeCityId) || ROUTE_CITIES[0];

  return (
    <div className="bg-white rounded-3xl border-2 border-slate-300 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-900 border border-blue-200">
              <span>🗺️</span>
              <span>{locale === 'tr' ? 'Vektörel Hareketlilik Ağı' : 'Mobility Route Network'}</span>
            </span>
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">
              {locale === 'tr' ? 'Mesafe Bandı & Hibe Otomasyonu' : 'Distance Band & Grant Automation'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5 m-0">
            {locale === 'tr'
              ? 'Türkiye’den Avrupa’ya Hareketlilik Koridorları'
              : 'Mobility Corridors from Turkey to Europe'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 m-0">
            {locale === 'tr'
              ? 'Avrupa Komisyonu mesafe bandı formülüyle hesaplanan hibe tutarları ve mesleki staj alanları.'
              : 'Standardised Erasmus+ travel grants and technical sectors across key European mobility hubs.'}
          </p>
        </div>

        <Link
          href="/school/pipeline"
          className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-extrabold rounded-xl transition-colors shadow-2xs self-start md:self-auto flex items-center gap-1.5 cursor-pointer"
        >
          <span>🚀</span>
          <span>{locale === 'tr' ? 'Kendi Rotanı Hesapla' : 'Calculate Your Route'}</span>
          <span>→</span>
        </Link>
      </div>

      {/* Main Interactive Stage: SVG Map + Info Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* SVG Interactive Canvas (7 cols on desktop) */}
        <div className="lg:col-span-7 bg-[#0B1930] rounded-2xl p-4 sm:p-6 border border-slate-800 relative overflow-hidden flex flex-col justify-between shadow-inner min-h-[340px]">
          {/* Subtle Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg width="100%" height="100%">
              <defs>
                <pattern id="route-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#route-grid)" />
            </svg>
          </div>

          {/* SVG Map Canvas */}
          <svg
            viewBox="0 0 750 420"
            className="w-full h-auto select-none relative z-10"
            style={{ maxHeight: '360px' }}
          >
            {/* Draw Paths from Origin (Istanbul) to Target Cities */}
            {ROUTE_CITIES.map((city) => {
              const isActive = city.id === activeCityId;
              // Curved bezier midpoint
              const midX = (ORIGIN_TURKEY.x + city.x) / 2;
              const midY = (ORIGIN_TURKEY.y + city.y) / 2 - 40;
              const pathD = `M ${ORIGIN_TURKEY.x} ${ORIGIN_TURKEY.y} Q ${midX} ${midY} ${city.x} ${city.y}`;

              return (
                <g key={`path-${city.id}`}>
                  {/* Background shadow line */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isActive ? (city.accent === 'emerald' ? '#10B981' : city.accent === 'amber' ? '#F59E0B' : '#3B82F6') : '#334155'}
                    strokeWidth={isActive ? 3 : 1.5}
                    strokeDasharray={isActive ? '6 4' : '4 4'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            })}

            {/* Origin Node: Istanbul, Turkey */}
            <g className="cursor-pointer">
              <circle
                cx={ORIGIN_TURKEY.x}
                cy={ORIGIN_TURKEY.y}
                r="14"
                fill="#3B82F6"
                fillOpacity="0.2"
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
                x={ORIGIN_TURKEY.x - 10}
                y={ORIGIN_TURKEY.y + 22}
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="900"
                textAnchor="middle"
              >
                🇹🇷 {locale === 'tr' ? 'Türkiye (Çıkış)' : 'Turkey (Origin)'}
              </text>
            </g>

            {/* Destination Nodes: European Cities */}
            {ROUTE_CITIES.map((city) => {
              const isActive = city.id === activeCityId;
              const nodeColor =
                city.accent === 'emerald'
                  ? '#10B981'
                  : city.accent === 'amber'
                  ? '#F59E0B'
                  : '#3B82F6';

              return (
                <g
                  key={`node-${city.id}`}
                  onClick={() => setActiveCityId(city.id)}
                  className="cursor-pointer group"
                >
                  {/* Hit area */}
                  <circle cx={city.x} cy={city.y} r="20" fill="transparent" />

                  {/* Pulsing ring if active */}
                  {isActive && (
                    <circle
                      cx={city.x}
                      cy={city.y}
                      r="16"
                      fill={nodeColor}
                      fillOpacity="0.3"
                      className="animate-pulse"
                    />
                  )}

                  {/* Core Node Dot */}
                  <circle
                    cx={city.x}
                    cy={city.y}
                    r={isActive ? 8 : 6}
                    fill={nodeColor}
                    stroke="#FFFFFF"
                    strokeWidth={isActive ? 2.5 : 1.5}
                    className="transition-all duration-200 group-hover:scale-125"
                  />

                  {/* City Label */}
                  <text
                    x={city.x}
                    y={city.y - 12}
                    fill={isActive ? '#FFFFFF' : '#94A3B8'}
                    fontSize={isActive ? '12' : '10'}
                    fontWeight={isActive ? '900' : '700'}
                    textAnchor="middle"
                    className="transition-colors"
                  >
                    {city.flag} {locale === 'tr' ? city.nameTr : city.nameEn}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Quick city pills on the bottom of map */}
          <div className="flex items-center gap-1.5 flex-wrap pt-3 border-t border-slate-800/80 relative z-10">
            <span className="text-[11px] font-bold text-slate-400 mr-1">
              {locale === 'tr' ? 'Şehir Seç:' : 'Select Hub:'}
            </span>
            {ROUTE_CITIES.map((city) => (
              <button
                key={city.id}
                type="button"
                onClick={() => setActiveCityId(city.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCityId === city.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{city.flag}</span> <span>{locale === 'tr' ? city.nameTr : city.nameEn}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Detail Card for Active Hub (5 cols on desktop) */}
        <div className="lg:col-span-5 bg-slate-50 rounded-2xl border-2 border-slate-200 p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            {/* City Title & Distance Badge */}
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
                  {locale === 'tr' ? 'Seçili Hareketlilik Merkezi' : 'Selected Mobility Hub'}
                </span>
                <h3 className="text-2xl font-black text-slate-900 m-0 flex items-center gap-2">
                  <span>{activeCity.flag}</span>
                  <span>{locale === 'tr' ? activeCity.nameTr : activeCity.nameEn}</span>
                  <span className="text-xs font-semibold text-slate-500">
                    ({locale === 'tr' ? activeCity.countryTr : activeCity.countryEn})
                  </span>
                </h3>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-900 border border-blue-300 shrink-0">
                {activeCity.distanceKm} km
              </span>
            </div>

            {/* EU Calculated Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {locale === 'tr' ? 'Seyahat Desteği' : 'Travel Grant'}
                </span>
                <div className="text-2xl font-black text-blue-700 mt-0.5">
                  {activeCity.travelGrantEuro} €
                </div>
                <span className="text-[11px] text-slate-500">
                  {locale === 'tr' ? 'Katılımcı Başına' : 'Per Participant'}
                </span>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {locale === 'tr' ? 'Günlük Bireysel Hibe' : 'Daily Unit Cost'}
                </span>
                <div className="text-2xl font-black text-emerald-700 mt-0.5">
                  {activeCity.dailyGrantEuro} €
                </div>
                <span className="text-[11px] text-slate-500">
                  {locale === 'tr' ? 'Grup 1/2 AB Ülkesi' : 'Group 1/2 Country'}
                </span>
              </div>
            </div>

            {/* Target VET Sectors */}
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1.5 shadow-2xs text-xs">
              <div className="flex items-center justify-between text-slate-500 font-bold">
                <span>{locale === 'tr' ? 'Öne Çıkan Mesleki Alan:' : 'Target VET Domain:'}</span>
                <span className="font-mono text-slate-700">{activeCity.isced}</span>
              </div>
              <div className="text-sm font-black text-slate-900">
                {locale === 'tr' ? activeCity.sectorTr : activeCity.sectorEn}
              </div>
              <p className="text-xs text-slate-500 m-0 pt-0.5 leading-relaxed">
                {locale === 'tr'
                  ? 'Bu rotada akredite meslek liseleri için doğrudan işbaşı izleme ve staj kontenjanı tanımlanabilmektedir.'
                  : 'Direct internship placements and job shadowing opportunities available for accredited schools.'}
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <Link
              href="/marketplace"
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs text-center transition-colors shadow-2xs"
            >
              <span>{locale === 'tr' ? 'Bu Rota İlanlarını Gör' : 'View Hub Offers'}</span>
              <span>→</span>
            </Link>

            <Link
              href="/school/pipeline"
              className="py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs border border-slate-300 transition-colors shadow-2xs text-center"
            >
              <span>{locale === 'tr' ? 'Hibe Planla' : 'Plan Grant'}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
