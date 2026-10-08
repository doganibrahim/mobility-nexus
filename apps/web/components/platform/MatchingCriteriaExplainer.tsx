'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from '../../lib/i18n';
import { CLIENT_SEED_HOSTS, evaluateSevenCriteriaClient, evaluateHardFiltersClient } from '../../lib/matching-engine';
import { MatchHostsRequestDto, MatchingCriterionKey } from '@mobility-nexus/types';
import { OFFICIAL_VET_ACTIVITIES } from '../../lib/constants';
import { getCountryFlagLabel } from '../../lib/countries';

export default function MatchingCriteriaExplainer() {
  const { t, locale } = useTranslation();

  // Simulator State
  const [selectedCountry, setSelectedCountry] = useState<string>('DE');
  const [mobilityGoal, setMobilityGoal] = useState<string>('VET_SHORT_TERM');
  const [participantType, setParticipantType] = useState<'student' | 'teacher'>('student');
  const [ageGroup, setAgeGroup] = useState<'under_18' | '18_plus' | 'mixed'>('under_18');
  const [participantCount, setParticipantCount] = useState<number>(6);
  const [accompanyingPersonsCount, setAccompanyingPersonsCount] = useState<number>(1);
  const [durationDays, setDurationDays] = useState<number>(14);
  const [reqAccommodation, setReqAccommodation] = useState<boolean>(true);
  const [reqMeals, setReqMeals] = useState<boolean>(true);
  const [reqTransfers, setReqTransfers] = useState<boolean>(false);
  const [reqWheelchair, setReqWheelchair] = useState<boolean>(false);

  // Selected Host for Diagnosis
  const [selectedHostId, setSelectedHostId] = useState<string>('host-de-technordic');

  // Active Tab: Explainer vs Simulator
  const [activeTab, setActiveTab] = useState<'overview' | 'simulator'>('simulator');

  const queryDto: MatchHostsRequestDto = useMemo(() => ({
    projectType: 'KA122',
    targetCountries: selectedCountry === 'ANY' ? [] : [selectedCountry],
    mobilityGoal: mobilityGoal as any,
    participantType: participantType as any,
    participantCount,
    accompanyingPersonsCount,
    durationDays,
    ageGroup,
    logisticsRequired: {
      accommodation: reqAccommodation,
      meals: reqMeals,
      transfers: reqTransfers,
    },
    specialNeeds: {
      wheelchairAccessible: reqWheelchair,
    },
  }), [
    selectedCountry,
    mobilityGoal,
    participantType,
    participantCount,
    accompanyingPersonsCount,
    durationDays,
    ageGroup,
    reqAccommodation,
    reqMeals,
    reqTransfers,
    reqWheelchair,
  ]);

  const selectedHost = useMemo(() => {
    return CLIENT_SEED_HOSTS.find((h) => h.id === selectedHostId) || CLIENT_SEED_HOSTS[0];
  }, [selectedHostId]);

  const diagnostics = useMemo(() => {
    return evaluateSevenCriteriaClient(selectedHost, queryDto);
  }, [selectedHost, queryDto]);

  const hardFilterResult = useMemo(() => {
    return evaluateHardFiltersClient(selectedHost, queryDto);
  }, [selectedHost, queryDto]);

  const CRITERIA_DEFINITIONS = [
    {
      key: 'country' as MatchingCriterionKey,
      weight: 15,
      icon: '🌍',
      titleTr: 'Hedef Ülke Uyumu',
      titleEn: 'Target Country Match',
      typeTr: 'Zorunlu Ön Filtre (Hard Filter)',
      typeEn: 'Mandatory Hard Filter',
      descTr: 'Okulun başvurusunda veya Erasmus Planında belirlediği hedef ülkeler ile ev sahibi kuruluşun yasal sicil ülkesinin birebir eşleşmesi.',
      descEn: 'Exact alignment between sending school target countries and host organisation registered country.',
      ruleTr: 'Okul belirli ülkeler seçtiyse ev sahibi bu ülkelerden birinde olmak zorundadır. "Tüm Ülkeler" esnek seçeneğinde tam puan verilir.',
      ruleEn: 'If specific countries are selected, host must be located in one of them. "All Countries" option yields full score.',
    },
    {
      key: 'activityType' as MatchingCriterionKey,
      weight: 20,
      icon: '🎯',
      titleTr: 'Faaliyet Türü Yetkinliği',
      titleEn: 'Activity Type Competence',
      typeTr: 'Zorunlu Ön Filtre (Hard Filter)',
      typeEn: 'Mandatory Hard Filter',
      descTr: 'Erasmus+ program rehberindeki 10 resmi mesleki eğitim faaliyet türü (Kısa dönem staj, İşbaşı gözlem vb.) arasından seçilen türün ev sahibi tarafından sunulması.',
      descEn: 'Host must be accredited/certified to deliver the specific activity type from 10 official Erasmus+ VET actions.',
      ruleTr: 'Ev sahibi bu faaliyeti portföyünde taahhüt etmemişse eşleşme gerçekleşmez ve kurum ön elemede elenir.',
      ruleEn: 'If host does not support the selected activity in its portfolio, it is disqualified immediately.',
    },
    {
      key: 'targetGroup' as MatchingCriterionKey,
      weight: 15,
      icon: '👥',
      titleTr: 'Hedef Grup & Yaş Sınırları',
      titleEn: 'Target Group & Age Compatibility',
      typeTr: 'Yasal Uyum & Güvenlik',
      typeEn: 'Legal & Safety Safeguards',
      descTr: 'Katılımcı türü (Öğrenci stajyer vs Eğitici/Personel) ve yaş grubu (18 yaş altı reşit olmayanlar veya 18+ yetişkinler) gereksinimleri.',
      descEn: 'Alignment of participant profile (VET learners vs staff) and age group (under 18 minors vs 18+ adults).',
      ruleTr: '18 yaş altı öğrenciler için ev sahibinin yasal çalışma güvenliği onayı bulunmalıdır. Yalnızca yetişkin kabul eden işletmeler reşit olmayan gruplarda elenir.',
      ruleEn: 'For minors under 18, host must possess youth safeguarding policies. Adult-only hosts are disqualified for minors.',
    },
    {
      key: 'dates' as MatchingCriterionKey,
      weight: 10,
      icon: '📅',
      titleTr: 'Tarihler & Dönem Müsaitliği',
      titleEn: 'Dates & Term Availability',
      typeTr: 'Kapasite Planlama',
      typeEn: 'Capacity Planning',
      descTr: 'Ev sahibinin aktif operasyonel durumu ve dönemlik/yıllık kontenjan doluluk oranları.',
      descEn: 'Host operational status and annual/term capacity allocation headroom.',
      ruleTr: 'Pasif kurumlar diskalifiye edilir; yıllık kontenjanı kritik sınıra yaklaşmış kurumlara kısmi uyum (⚠️) verilir.',
      ruleEn: 'Inactive hosts are disqualified; hosts near annual capacity thresholds receive partial warning.',
    },
    {
      key: 'duration' as MatchingCriterionKey,
      weight: 10,
      icon: '⏱️',
      titleTr: 'Hareketlilik Süresi',
      titleEn: 'Mobility Duration',
      typeTr: 'Zaman Kısıtı',
      typeEn: 'Duration Boundary',
      descTr: 'Talep edilen staj süresinin (örn: 14 gün) ev sahibinin asgari ve azami kabul sınırları [min–max gün] arasında kalması.',
      descEn: 'Requested stay duration (e.g. 14 days) must fall within host accepted min-max day limits.',
      ruleTr: 'Sınırın dışındaki talepler elenir; sınır toleransında (±3 gün) olan talepler için kısmi uyum ve revizyon önerilir.',
      ruleEn: 'Out-of-bounds requests are disqualified; near-threshold requests receive partial adjustment advice.',
    },
    {
      key: 'capacity' as MatchingCriterionKey,
      weight: 15,
      icon: '🪑',
      titleTr: 'Katılımcı Sayısı & Kontenjan',
      titleEn: 'Participant Capacity',
      typeTr: 'Grup Büyüklüğü & Kotasyon',
      typeEn: 'Group Sizing & Slot Cap',
      descTr: 'Asil katılımcı ve refakatçi toplamının, ev sahibinin dönemlik azami stajyer kotasını aşmaması.',
      descEn: 'Total learners plus accompanying staff must not exceed host single-term capacity limit.',
      ruleTr: 'Grup büyüklüğü ev sahibi kotasından büyükse uyuşmazlık oluşur. Okul grubu ikiye bölebilir veya katılımcı sayısını ayarlayabilir.',
      ruleEn: 'If group size exceeds host limit, mismatch is flagged. School can split flows or reduce group size.',
    },
    {
      key: 'logistics' as MatchingCriterionKey,
      weight: 15,
      icon: '🏨',
      titleTr: 'Lojistik & Özel İhtiyaçlar',
      titleEn: 'Logistics & Special Support',
      typeTr: 'Operasyonel Destek',
      typeEn: 'Operational Services',
      descTr: 'Konaklama, yemek, yerel transfer ve engelsiz erişim (tekerlekli sandalye vb.) hizmetlerinin ev sahibi tarafından karşılanması.',
      descEn: 'Fulfillment of accommodation, full/half board meals, airport transfers and disability accessibility.',
      ruleTr: 'Okul zorunlu konaklama şartı koyduysa ve ev sahibi bunu sağlamıyorsa diskalifiye edilir; harcırah modeli seçilirse bağımsız devam edilebilir.',
      ruleEn: 'If accommodation is strictly required and host offers none, it is disqualified unless school opts for self-managed allowance.',
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Header & Navigation */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <span>⚖️</span>
              <span>{locale === 'tr' ? 'Şeffaf Algoritma & Tanılama Standardı' : 'Transparent Algorithm & Diagnostics Standard'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white m-0">
              {locale === 'tr'
                ? 'Nasıl Eşleşir? 7 Temel Kriter, Ağırlıklar ve Uyuşmazlık Analizi'
                : 'How It Matches: 7 Core Criteria, Weights & Mismatch Diagnostics'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 m-0 max-w-3xl leading-relaxed">
              {locale === 'tr'
                ? 'Platformumuzda hiçbir eşleştirme rastlantısal veya sübjektif değildir. Her aday Avrupa kuruluşu, aşağıdaki 7 şeffaf kritere göre matematiksel olarak taranır; diskalifiye ve uyuşmazlık nedenleri okullara aksiyon alınabilir yol haritalarıyla sunulur.'
                : 'Matching on our platform is completely transparent and mathematically grounded. Each European provider is evaluated against 7 criteria; disqualification causes are accompanied by actionable resolution steps.'}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>🧪</span>
              <span>{locale === 'tr' ? 'Canlı Simülatör' : 'Live Simulator'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <span>📋</span>
              <span>{locale === 'tr' ? '7 Kriter Kılavuzu' : 'Criteria Guide'}</span>
            </button>
          </div>
        </div>

        {/* Formula Banner */}
        <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-base">📐</span>
            <span className="font-semibold text-slate-200">
              {locale === 'tr' ? 'Toplam Uygunluk Formülü:' : 'Suitability Formula:'}
            </span>
            <span className="font-mono text-blue-300 font-bold">
              {locale === 'tr'
                ? '%15 Ülke + %20 Faaliyet + %15 Hedef/Yaş + %10 Dönem + %10 Süre + %15 Kontenjan + %15 Lojistik = %100'
                : '15% Country + 20% Activity + 15% Target/Age + 10% Term + 10% Duration + 15% Capacity + 15% Logistics = 100%'}
            </span>
          </div>

          <div className="text-[11px] text-slate-400">
            {locale === 'tr'
              ? 'İki Kademeli Ağırlık: %70 Eğitim & Mentorluk Kalitesi • %30 Lojistik Destek'
              : 'Two-Tier Weight: 70% Educational Quality • 30% Logistical Support'}
          </div>
        </div>
      </div>

      {/* TAB 1: LIVE SIMULATOR */}
      {activeTab === 'simulator' && (
        <div className="p-6 sm:p-8 space-y-6">
          {/* Terminology Bridge: 10 Demand Parameters -> 7 Core Criteria */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3.5 text-xs text-blue-950 flex items-start gap-2.5">
            <span className="text-base shrink-0">ℹ️</span>
            <div className="space-y-0.5">
              <span className="font-extrabold block">
                {locale === 'tr'
                  ? 'Eşleştirme Terminolojisi: 10 Talep Parametresi → 7 Temel Uygunluk Kriteri'
                  : 'Matching Terminology: 10 Demand Parameters → 7 Core Evaluation Criteria'}
              </span>
              <p className="text-[11px] text-blue-800 leading-relaxed m-0">
                {locale === 'tr'
                  ? 'Okul profilinizde tanımlanan 10 operasyonel talep parametresi (Hedef Ülke, Faaliyet Türü, Katılımcı Profili, Yaş Grubu, Öğrenci Sayısı, Refakatçi Sayısı, Süre, Dönem, Lojistik Paket ve Özel İhtiyaçlar), Avrupa Komisyonu standartlarındaki 7 Temel Kriter (Ülke Uyumu, Faaliyet Yetkinliği, Hedef Grup, Dönem Müsaitliği, Süre, Kontenjan, Lojistik & Kapsayıcılık) üzerinden ağırlıklı olarak puanlanır.'
                  : 'The 10 operational demand parameters entered by sending schools (Target Country, Activity Type, Participant Profile, Age Group, Learner Count, Accompanying Persons, Duration, Mobility Term, Logistics, and Special Needs) are synthesized into 7 Core Criteria (Country Match, Activity Competence, Target Group & Age, Term Availability, Duration, Quota, and Logistics & Inclusion) for scoring.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Parameters (5 cols) */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>⚙️</span>
                  <span>{locale === 'tr' ? '1. Okul Talep Parametreleri (10 Parametre)' : '1. School Request Parameters (10 Parameters)'}</span>
                </span>
                <span className="text-[10px] text-slate-500 font-semibold uppercase">
                  {locale === 'tr' ? 'Simülasyon Girişi' : 'Simulation Input'}
                </span>
              </div>

              {/* Country Selection */}
              <div>
                <label htmlFor="target-country" className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Hedef Ülke Tercihi' : 'Target Country'}
                </label>
                <select
                  id="target-country"
                  name="target_country"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="edu-input text-xs font-semibold"
                >
                  <option value="DE">{locale === 'tr' ? '🇩🇪 Almanya' : '🇩🇪 Germany'}</option>
                  <option value="ES">{locale === 'tr' ? '🇪🇸 İspanya' : '🇪🇸 Spain'}</option>
                  <option value="IT">{locale === 'tr' ? '🇮🇹 İtalya' : '🇮🇹 Italy'}</option>
                  <option value="PL">{locale === 'tr' ? '🇵🇱 Polonya' : '🇵🇱 Poland'}</option>
                  <option value="NL">{locale === 'tr' ? '🇳🇱 Hollanda' : '🇳🇱 Netherlands'}</option>
                  <option value="CZ">{locale === 'tr' ? '🇨🇿 Çekya' : '🇨🇿 Czechia'}</option>
                  <option value="ANY">{locale === 'tr' ? '🌍 Tüm Uygun Ülkeler (Any)' : '🌍 Any Eligible Country'}</option>
                </select>
              </div>

              {/* Activity Selection */}
              <div>
                <label htmlFor="mobility-activity" className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Faaliyet Türü' : 'Mobility Activity'}
                </label>
                <select
                  id="mobility-activity"
                  name="mobility_activity"
                  value={mobilityGoal}
                  onChange={(e) => setMobilityGoal(e.target.value)}
                  className="edu-input text-xs font-semibold"
                >
                  {Object.entries(OFFICIAL_VET_ACTIVITIES).map(([key, act]) => (
                    <option key={key} value={key}>
                      {locale === 'tr' ? act.nameTr : act.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Participant Profile & Age */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="participant-profile" className="block text-[11px] font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Katılımcı Profili' : 'Profile'}
                  </label>
                  <select
                    id="participant-profile"
                    name="participant_profile"
                    value={participantType}
                    onChange={(e) => setParticipantType(e.target.value as any)}
                    className="edu-input text-xs font-medium"
                  >
                    <option value="student">{locale === 'tr' ? 'Meslek Öğrencisi' : 'VET Student'}</option>
                    <option value="teacher">{locale === 'tr' ? 'Öğretmen / Personel' : 'Staff / Teacher'}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="age-group" className="block text-[11px] font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Yaş Grubu' : 'Age Group'}
                  </label>
                  <select
                    id="age-group"
                    name="age_group"
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as any)}
                    className="edu-input text-xs font-medium"
                  >
                    <option value="under_18">{locale === 'tr' ? '18 Yaş Altı (Reşit Değil)' : 'Under 18 (Minor)'}</option>
                    <option value="18_plus">{locale === 'tr' ? '18+ Yetişkin' : '18+ Adult'}</option>
                    <option value="mixed">{locale === 'tr' ? 'Karma Yaş' : 'Mixed Ages'}</option>
                  </select>
                </div>
              </div>

              {/* Participants & Duration */}
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label htmlFor="learners" className="block text-[11px] font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Öğrenci Sayısı' : 'Learners'}
                  </label>
                  <input
                    id="learners"
                    name="learners"
                    type="number"
                    min={1}
                    max={30}
                    value={participantCount}
                    onChange={(e) => setParticipantCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="edu-input text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label htmlFor="escorts" className="block text-[11px] font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Refakatçi' : 'Escorts'}
                  </label>
                  <input
                    id="escorts"
                    name="escorts"
                    type="number"
                    min={0}
                    max={5}
                    value={accompanyingPersonsCount}
                    onChange={(e) => setAccompanyingPersonsCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="edu-input text-xs font-bold text-center"
                  />
                </div>
                <div>
                  <label htmlFor="duration-days" className="block text-[11px] font-bold text-slate-700 mb-1">
                    {locale === 'tr' ? 'Süre (Gün)' : 'Duration (Days)'}
                  </label>
                  <input
                    id="duration-days"
                    name="duration_days"
                    type="number"
                    min={2}
                    max={180}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Math.max(2, parseInt(e.target.value) || 14))}
                    className="edu-input text-xs font-bold text-center"
                  />
                </div>
              </div>

              {/* Mandatory Logistics Checkboxes */}
              <div className="pt-2 border-t border-slate-200 space-y-1.5">
                <span className="text-[11px] font-bold text-slate-700 block">
                  {locale === 'tr' ? 'Zorunlu Lojistik Şartları:' : 'Mandatory Logistics Requirements:'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label htmlFor="req-accommodation" className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      id="req-accommodation"
                      name="req_accommodation"
                      type="checkbox"
                      checked={reqAccommodation}
                      onChange={(e) => setReqAccommodation(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>🏨 {locale === 'tr' ? 'Konaklama' : 'Accommodation'}</span>
                  </label>
                  <label htmlFor="req-meals" className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      id="req-meals"
                      name="req_meals"
                      type="checkbox"
                      checked={reqMeals}
                      onChange={(e) => setReqMeals(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>🍽️ {locale === 'tr' ? 'Yemek' : 'Meals'}</span>
                  </label>
                  <label htmlFor="req-transfers" className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      id="req-transfers"
                      name="req_transfers"
                      type="checkbox"
                      checked={reqTransfers}
                      onChange={(e) => setReqTransfers(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>🚌 {locale === 'tr' ? 'Transfer' : 'Transfers'}</span>
                  </label>
                  <label htmlFor="req-wheelchair" className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      id="req-wheelchair"
                      name="req_wheelchair"
                      type="checkbox"
                      checked={reqWheelchair}
                      onChange={(e) => setReqWheelchair(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span>♿ {locale === 'tr' ? 'Engelsiz' : 'Wheelchair'}</span>
                  </label>
                </div>
              </div>

              {/* Host Selector */}
              <div className="pt-2 border-t border-slate-200">
                <label htmlFor="provider-select" className="block text-xs font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Test Edilecek Avrupa Kuruluşu' : 'Test Provider'}
                </label>
                <select
                  id="provider-select"
                  name="provider_select"
                  value={selectedHostId}
                  onChange={(e) => setSelectedHostId(e.target.value)}
                  className="edu-input text-xs font-bold text-blue-900 bg-white"
                >
                  {CLIENT_SEED_HOSTS.map((h) => (
                    <option key={h.id} value={h.id}>
                      {locale === 'en' ? (h.nameEn || h.name) : h.name} ({h.countryCode} - {h.city})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Right Column: Live Diagnostic Outcome (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Score Meter & Overall Status */}
              <div
                className={`p-5 rounded-2xl border transition-all ${
                  hardFilterResult.isEligible
                    ? diagnostics.overallSuitabilityScore >= 75
                      ? 'border-emerald-200 bg-emerald-50/40'
                      : 'border-blue-200 bg-blue-50/40'
                    : 'border-rose-300 bg-rose-50/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">
                        {hardFilterResult.isEligible ? (diagnostics.overallSuitabilityScore >= 75 ? '🌟' : '✅') : '🚫'}
                      </span>
                      <h3 className="text-base font-black text-slate-900 m-0">
                        {locale === 'en' ? (selectedHost.nameEn || selectedHost.name) : selectedHost.name}
                      </h3>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      {selectedHost.city}, {getCountryFlagLabel(selectedHost.countryCode, locale as 'tr' | 'en') || selectedHost.countryCode} • OID: {selectedHost.oid}
                    </div>
                    {(selectedHost.shortDescriptionEn || selectedHost.shortDescription) && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                        {locale === 'en'
                          ? (selectedHost.shortDescriptionEn || selectedHost.shortDescription)
                          : selectedHost.shortDescription}
                      </p>
                    )}
                  </div>

                  <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4">
                    <div
                      className={`text-2xl font-black ${
                        hardFilterResult.isEligible
                          ? diagnostics.overallSuitabilityScore >= 75
                            ? 'text-emerald-700'
                            : 'text-blue-700'
                          : 'text-rose-700'
                      }`}
                    >
                      %{diagnostics.overallSuitabilityScore}
                    </div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {hardFilterResult.isEligible
                        ? (locale === 'en' ? `${diagnostics.grade} SUITABILITY` : `${diagnostics.grade} UYGUNLUK`)
                        : (locale === 'en' ? 'DISQUALIFIED IN PRE-SCREENING (MISMATCH)' : 'ÖN ELEMEDE ELENDİ (MISMATCH)')}
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      hardFilterResult.isEligible
                        ? diagnostics.overallSuitabilityScore >= 75
                          ? 'bg-emerald-600'
                          : 'bg-blue-600'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${diagnostics.overallSuitabilityScore}%` }}
                  />
                </div>

                {/* Summary counts */}
                <div className="mt-3 flex items-center gap-3 text-xs">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                    ✓ {diagnostics.matchedCount} {locale === 'en' ? 'Matched' : 'Eşleşti'}
                  </span>
                  {diagnostics.partialCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold">
                      ⚠️ {diagnostics.partialCount} {locale === 'en' ? 'Partial' : 'Kısmi Uyum'}
                    </span>
                  )}
                  {diagnostics.mismatchCount > 0 && (
                    <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold">
                      ✕ {diagnostics.mismatchCount} {locale === 'en' ? 'Mismatch' : 'Uyuşmazlık'}
                    </span>
                  )}
                </div>
              </div>

              {/* 7 Criteria Evaluation Table */}
              <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-2xs">
                <div className="px-4 py-3 bg-slate-100/80 border-b border-slate-200 font-bold text-xs text-slate-800 flex items-center justify-between">
                  <span>{locale === 'en' ? '7 Criteria Comparison Matrix (Request vs Offer)' : '7 Kriter Karşılaştırma Matrisi (Talep vs İmkân)'}</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    {locale === 'en' ? 'Weighted Score Contribution' : 'Ağırlıklı Puan Katkısı'}
                  </span>
                </div>

                <div className="divide-y divide-slate-100 text-xs">
                  {diagnostics.criteria.map((crit) => {
                    const isMatch = crit.status === 'MATCH';
                    const isPartial = crit.status === 'PARTIAL';
                    return (
                      <div
                        key={crit.key}
                        className={`p-3 space-y-1.5 transition-colors ${
                          !isMatch && !isPartial
                            ? 'bg-rose-50/40'
                            : isPartial
                            ? 'bg-amber-50/30'
                            : 'hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${
                                isMatch
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : isPartial
                                  ? 'bg-amber-100 text-amber-700'
                                  : 'bg-rose-100 text-rose-700'
                              }`}
                            >
                              {isMatch ? '✓' : isPartial ? '⚠️' : '✕'}
                            </span>
                            <span className="font-bold text-slate-900">
                              {locale === 'en' ? crit.labelEn : crit.labelTr}
                            </span>
                            <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.2 rounded bg-slate-100">
                              %{crit.weightPercent} {locale === 'en' ? 'Weight' : 'Ağırlık'}
                            </span>
                          </div>

                          <div className="text-right">
                            <span
                              className={`text-xs font-black ${
                                isMatch
                                  ? 'text-emerald-700'
                                  : isPartial
                                  ? 'text-amber-700'
                                  : 'text-rose-700'
                              }`}
                            >
                              +{crit.weightedScore} / {crit.weightPercent} {locale === 'en' ? 'Pts' : 'Puan'}
                            </span>
                          </div>
                        </div>

                        {/* Comparison details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 text-slate-600">
                          <div>
                            <span className="text-slate-500 font-semibold">
                              {locale === 'en' ? 'School Request:' : 'Okul Talebi:'}
                            </span>{' '}
                            <span className="font-medium text-slate-800">
                              {locale === 'en' ? (crit.schoolRequestedEn || crit.schoolRequested) : crit.schoolRequested}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500 font-semibold">
                              {locale === 'en' ? 'Host Provision:' : 'Ev Sahibi:'}
                            </span>{' '}
                            <span className="font-medium text-slate-900">
                              {locale === 'en' ? (crit.hostProvidedEn || crit.hostProvided) : crit.hostProvided}
                            </span>
                          </div>
                        </div>

                        {/* Explanation message */}
                        <p className="text-[11px] text-slate-700 m-0 leading-relaxed">
                          {locale === 'en' ? crit.messageEn : crit.messageTr}
                        </p>

                        {/* Actionable Hint if any */}
                        {((locale === 'en' ? crit.actionableHintEn : crit.actionableHintTr) || crit.actionableHintTr) && (
                          <div className="p-2 rounded-lg bg-blue-50 border border-blue-200 text-[10px] text-blue-900 font-medium flex items-start gap-1.5">
                            <span>💡</span>
                            <span>
                              <strong>{locale === 'en' ? 'Action Advice:' : 'Aksiyon Tavsiyesi:'}</strong>{' '}
                              {locale === 'en' ? (crit.actionableHintEn || crit.actionableHintTr) : crit.actionableHintTr}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Roadmap Callout if Disqualified or Partial */}
              {((locale === 'en' ? diagnostics.actionableRecommendationsEn : diagnostics.actionableRecommendationsTr) || diagnostics.actionableRecommendationsTr).length > 0 && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/70 text-xs space-y-2">
                  <div className="font-bold text-blue-950 flex items-center gap-1.5">
                    <span>🧭</span>
                    <span>{locale === 'tr' ? 'Tam Eşleşme İçin Aksiyon Yol Haritası' : 'Action Roadmap for Full Alignment'}</span>
                  </div>
                  <ul className="space-y-1 text-blue-900 text-[11px] pl-4 list-disc m-0">
                    {(locale === 'en' ? diagnostics.actionableRecommendationsEn : diagnostics.actionableRecommendationsTr).map((rec, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CRITERIA GUIDE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-900 m-0">
              {locale === 'tr' ? '7 Temel Kriterin Formülü ve Değerlendirme Kuralları' : '7 Core Criteria Formulas & Rules'}
            </h3>
            <p className="text-xs text-slate-500 m-0">
              {locale === 'tr'
                ? 'Okulların girdiği 10 operasyonel talep parametresi bu 7 temel kritere dönüştürülür. Avrupa Komisyonu Erasmus+ Standartları ile tam uyumludur.'
                : '10 operational parameters entered by schools are synthesized into these 7 core criteria. Fully aligned with European Commission Erasmus+ standards.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {CRITERIA_DEFINITIONS.map((def) => (
              <div
                key={def.key}
                className="p-4 rounded-xl border border-slate-200 bg-white space-y-2.5 shadow-2xs hover:border-blue-300 hover:shadow-xs transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center text-lg">
                      {def.icon}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 m-0">
                        {locale === 'tr' ? def.titleTr : def.titleEn}
                      </h4>
                      <span className="text-[10px] text-blue-700 font-extrabold">
                        %{def.weight} {locale === 'tr' ? 'Ağırlık' : 'Weight'}
                      </span>
                    </div>
                  </div>

                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700">
                    {locale === 'tr' ? def.typeTr : def.typeEn}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr' ? def.descTr : def.descEn}
                </p>

                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-[10px] text-slate-700 space-y-0.5">
                  <strong className="block text-slate-900 font-semibold">
                    {locale === 'tr' ? 'Kural & Eşik Değeri:' : 'Rule & Threshold:'}
                  </strong>
                  <span>{locale === 'tr' ? def.ruleTr : def.ruleEn}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Transparent Scoring Architecture Note */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-700 space-y-2">
            <h4 className="font-bold text-slate-900 m-0 flex items-center gap-1.5">
              <span>🛡️</span>
              <span>{locale === 'tr' ? 'Neden Şeffaf Uyuşmazlık Tanılaması?' : 'Why Transparent Mismatch Diagnostics?'}</span>
            </h4>
            <p className="leading-relaxed text-[11px] m-0">
              {locale === 'tr'
                ? "Geleneksel aracı kurum modellerinde okullara yalnızca 'eşleşen' veya 'eşleşmeyen' kurum listesi verilir ve kurumların neden elendiği bilinmez. ErasmusMobility mimarisinde, bir okulun talep ettiği 7 kriterin her biri aday profil ile karşılaştırılır. Örneğin 18 yaş altı stajyer kabul etmeyen bir işletmenin neden uygun olmadığı açıkça gösterilerek okulun hem hibe güvenliği sağlanır hem de revizyon için net aksiyon yolları sunulur."
                : 'Unlike opaque broker models, ErasmusMobility reveals the precise diagnostic reasons behind every provider match or exclusion, safeguarding grant compliance and providing actionable paths to resolve requirements.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
