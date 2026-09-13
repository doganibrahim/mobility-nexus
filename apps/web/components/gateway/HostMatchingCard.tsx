'use client';

import React, { useState } from 'react';
import NeoCard from '../ui/NeoCard';
import { HOST_METRIC_CONFIG, OFFICIAL_VET_ACTIVITIES } from '../../lib/constants';
import { HostType, HostMatchCandidate, MatchHostsResponseDto } from '@mobility-nexus/types';
import { HostScoreResult } from '../../lib/calculations';
import { useTranslation } from '../../lib/i18n';
import { apiClient } from '../../lib/api-client';
import MobilityInquiryModal from '../inquiry/MobilityInquiryModal';
import { useAppStore } from '../../lib/store';

interface HostMatchingCardProps {
  data: {
    hostName: string;
    hostCountry: string;
    hostType: HostType;
    hostMetrics: Record<string, number>;
    providesAccommodation?: boolean;
    accommodationDetails?: string;
    providesMeals?: boolean;
    mealsDetails?: string;
    providesTransfers?: boolean;
    transfersDetails?: string;
    acceptsUnder18?: boolean;
    offeredActivities?: string[];
  };
  schoolProfile?: {
    projectType?: 'KA121' | 'KA122';
    targetCountries?: string[];
    mobilityGoal?: string;
    participantType?: string;
    participantCount?: number;
    accompanyingPersonsCount?: number;
    durationDays?: number;
    ageGroup?: 'under_18' | '18_plus' | 'mixed';
    vetField?: string;
    iscedCode?: string;
    languages?: string[];
  };
  scoreResult: HostScoreResult | null;
  onChangeHostInfo: (field: string, value: any) => void;
  onMetricChange: (metricId: string, value: number) => void;
  onScoreHost: (customScore?: number) => void;
  onSelectMatchedHost?: (candidate: HostMatchCandidate) => void;
}

export default function HostMatchingCard({
  data,
  schoolProfile,
  scoreResult,
  onChangeHostInfo,
  onMetricChange,
  onScoreHost,
  onSelectMatchedHost,
}: HostMatchingCardProps) {
  const { t, locale } = useTranslation();
  const store = useAppStore();
  const [activeMode, setActiveMode] = useState<'live' | 'manual'>('live');
  const [isMatching, setIsMatching] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchHostsResponseDto | null>(null);
  const [selectedHostId, setSelectedHostId] = useState<string | null>(null);
  const [showDisqualified, setShowDisqualified] = useState(false);
  const [inquiryTargetHost, setInquiryTargetHost] = useState<{
    hostId?: string;
    hostName: string;
    hostCountry: string;
    organisationType?: string;
    oid?: string;
  } | null>(null);

  // Search Preferences
  const [reqAccommodation, setReqAccommodation] = useState(true);
  const [reqMeals, setReqMeals] = useState(true);
  const [reqTransfers, setReqTransfers] = useState(false);
  const [reqWheelchair, setReqWheelchair] = useState(false);

  // Trigger Live Match
  const handleRunMatch = async () => {
    setIsMatching(true);
    try {
      const payload = {
        projectType: schoolProfile?.projectType || 'KA122',
        targetCountries:
          schoolProfile?.targetCountries && schoolProfile.targetCountries.length > 0
            ? schoolProfile.targetCountries
            : ['ANY'],
        mobilityGoal: (schoolProfile?.mobilityGoal as any) || 'VET_SHORT_TERM',
        participantType: (schoolProfile?.participantType as any) || 'student',
        participantCount: schoolProfile?.participantCount || 6,
        accompanyingPersonsCount: schoolProfile?.accompanyingPersonsCount || 0,
        durationDays: schoolProfile?.durationDays || 14,
        ageGroup: schoolProfile?.ageGroup || 'under_18',
        vetField: schoolProfile?.vetField,
        iscedCode: schoolProfile?.iscedCode,
        languages: schoolProfile?.languages || ['EN'],
        logisticsRequired: {
          accommodation: reqAccommodation,
          meals: reqMeals,
          transfers: reqTransfers,
        },
        specialNeeds: {
          wheelchairAccessible: reqWheelchair,
        },
      };

      const { data: res } = await apiClient.matchHosts(payload);
      setMatchResult(res);

      // Auto select top candidate if current hostName is empty
      if (!data.hostName && res.matches.length > 0) {
        handleSelectCandidate(res.matches[0]);
      }
    } catch (err: any) {
      console.error('Match failed:', err);
    } finally {
      setIsMatching(false);
    }
  };

  const handleSelectCandidate = (candidate: HostMatchCandidate) => {
    setSelectedHostId(candidate.hostId);
    onChangeHostInfo('hostName', candidate.hostName);
    onChangeHostInfo('hostCountry', candidate.countryCode);
    if (candidate.organisationType) {
      onChangeHostInfo('hostType', candidate.organisationType as HostType);
    }
    if (candidate.providesAccommodation !== undefined) {
      onChangeHostInfo('providesAccommodation', candidate.providesAccommodation);
      onChangeHostInfo('accommodationDetails', candidate.accommodationDetails || '');
    }
    if (candidate.providesMeals !== undefined) {
      onChangeHostInfo('providesMeals', candidate.providesMeals);
      onChangeHostInfo('mealsDetails', candidate.mealsDetails || '');
    }
    if (candidate.providesTransfers !== undefined) {
      onChangeHostInfo('providesTransfers', candidate.providesTransfers);
      onChangeHostInfo('transfersDetails', candidate.transfersDetails || '');
    }
    if (candidate.acceptsUnder18 !== undefined) {
      onChangeHostInfo('acceptsUnder18', candidate.acceptsUnder18);
    }

    // Pass custom score directly to host scoring callback
    onScoreHost(candidate.compositeScore);

    if (onSelectMatchedHost) {
      onSelectMatchedHost(candidate);
    }
  };

  const activityTitle = schoolProfile?.mobilityGoal
    ? (locale === 'en' ? OFFICIAL_VET_ACTIVITIES[schoolProfile.mobilityGoal]?.nameEn : OFFICIAL_VET_ACTIVITIES[schoolProfile.mobilityGoal]?.nameTr) || schoolProfile.mobilityGoal
    : (locale === 'en' ? 'Short-term learning mobility' : 'Kısa Dönemli Bireysel Öğrenme');

  return (
    <NeoCard
      id="host"
      title={t.host.title}
      badge={t.host.badge}
      badgeType="primary"
    >
      <div className="space-y-6">
        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveMode('live')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeMode === 'live'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>🤖</span>
            <span>{t.host.modeLive}</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 text-blue-800 font-extrabold">
              Yeni
            </span>
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('manual')}
            className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeMode === 'manual'
                ? 'border-blue-600 text-blue-700 bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <span>⚙️</span>
            <span>{t.host.modeManual}</span>
          </button>
        </div>

        {/* MODE 1: LIVE SMART MATCHING */}
        {activeMode === 'live' && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Input Criteria Summary Bar */}
            <div className="rounded-xl border border-blue-200/80 bg-linear-to-r from-blue-50/70 via-indigo-50/40 to-white p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span>📋</span>
                    <span>Eşleştirme Kriterleri Özeti (Okul Profilinden Alındı):</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-semibold text-blue-800">
                      {schoolProfile?.projectType || 'KA122'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium">
                      🌍 {schoolProfile?.targetCountries?.length ? schoolProfile.targetCountries.join(', ') : 'Tüm Ülkeler (ANY)'}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium truncate max-w-[220px]">
                      🎯 {activityTitle}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium">
                      👥 {schoolProfile?.participantCount || 6} Asil + {schoolProfile?.accompanyingPersonsCount || 0} Refakatçi
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-medium">
                      {schoolProfile?.ageGroup === 'under_18' ? '👶 18 Yaş Altı' : '🧑 18+ Yetişkin'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunMatch}
                  disabled={isMatching}
                  className="edu-btn-primary text-xs font-bold shadow-xs flex items-center justify-center gap-2 min-w-[200px]"
                >
                  {isMatching ? (
                    <>
                      <span className="inline-block animate-spin">⏳</span>
                      <span>{t.host.matchingInProgress}</span>
                    </>
                  ) : (
                    <>
                      <span>🔍</span>
                      <span>{t.host.runMatchBtn}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Logistics & Accessibility Toggles */}
              <div className="mt-3 pt-3 border-t border-blue-100 flex flex-wrap items-center gap-4 text-xs">
                <span className="font-semibold text-slate-700">Lojistik Talepleri:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqAccommodation}
                    onChange={(e) => setReqAccommodation(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🏨 Konaklama Şartı</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqMeals}
                    onChange={(e) => setReqMeals(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🍽️ Yemek / İaşe Şartı</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqTransfers}
                    onChange={(e) => setReqTransfers(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🚌 Havalimanı / Yerel Transfer</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={reqWheelchair}
                    onChange={(e) => setReqWheelchair(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>♿ Tekerlekli Sandalye Erişimi</span>
                </label>
              </div>
            </div>

            {/* Match Results Display */}
            {matchResult && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{t.host.matchSuccessTitle}</span>
                    <span className="text-slate-500 font-normal">
                      ({matchResult.eligibleCount} uygun kuruluş bulundu, {matchResult.totalEvaluated} kuruluş tarandı)
                    </span>
                  </div>
                  {matchResult.disqualifiedCount > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowDisqualified(!showDisqualified)}
                      className="text-xs text-slate-600 hover:text-slate-900 underline font-medium"
                    >
                      {showDisqualified
                        ? '▲ Elenenleri Gizle'
                        : `▼ ${matchResult.disqualifiedCount} Elenen Kuruluşu İncele`}
                    </button>
                  )}
                </div>

                {/* Candidate Cards Grid */}
                {matchResult.matches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {matchResult.matches.map((candidate) => {
                      const isSelected =
                        selectedHostId === candidate.hostId || data.hostName === candidate.hostName;

                      return (
                        <div
                          key={candidate.hostId}
                          className={`p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between ${
                            isSelected
                              ? 'border-blue-500 bg-blue-50/40 shadow-xs ring-2 ring-blue-500/20'
                              : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="space-y-3">
                            {/* Card Header: Country, Verification, OID */}
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700">
                                    {candidate.countryCode} • {candidate.city}
                                  </span>
                                  {candidate.verificationStatus === 'VERIFIED' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                      <span>✓</span>
                                      <span>KYC Doğrulandı</span>
                                    </span>
                                  )}
                                  {candidate.verificationStatus === 'UNDER_REVIEW' && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                                      İncelemede
                                    </span>
                                  )}
                                  {candidate.hostName.includes('[MOCK]') && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1">
                                      <span>🧪</span>
                                      <span>{locale === 'en' ? 'Mock / Demo' : 'Simülasyon / Mock'}</span>
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-sm font-bold text-slate-900 mt-1">
                                  {candidate.hostName}
                                </h4>
                                <div className="text-[11px] text-slate-500">
                                  OID: {candidate.oid || 'E10XXXXXX'} • {candidate.organisationType}
                                </div>
                              </div>

                              {/* Composite Score Circle */}
                              <div className="text-right">
                                <div
                                  className={`text-lg font-black ${
                                    candidate.compositeScore >= 80
                                      ? 'text-emerald-700'
                                      : candidate.compositeScore >= 60
                                      ? 'text-blue-700'
                                      : 'text-amber-700'
                                  }`}
                                >
                                  %{candidate.compositeScore}
                                </div>
                                <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                                  {candidate.matchGrade}
                                </div>
                              </div>
                            </div>

                            {/* Short Description */}
                            {candidate.shortDescription && (
                              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                                {candidate.shortDescription}
                              </p>
                            )}

                            {/* Two-Tier Independent Score Badges */}
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="text-[10px] font-semibold text-slate-500 truncate">
                                  🎓 {t.host.educationScoreLabel}
                                </div>
                                <div className="text-xs font-bold text-slate-900 mt-0.5">
                                  {candidate.educationScore}/100
                                  <span className="text-[10px] text-slate-500 font-normal ml-1">
                                    (Ağırlık: %70)
                                  </span>
                                </div>
                              </div>
                              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="text-[10px] font-semibold text-slate-500 truncate">
                                  🏨 {t.host.logisticsScoreLabel}
                                </div>
                                <div className="text-xs font-bold text-slate-900 mt-0.5">
                                  {candidate.logisticsScore}/100
                                  <span className="text-[10px] text-slate-500 font-normal ml-1">
                                    (Ağırlık: %30)
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Logistics & Capacity Badges */}
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-600">
                              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                                👥 Kontenjan: {candidate.maxLearnersPerTerm} kişi
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded font-medium ${
                                  candidate.acceptsUnder18
                                    ? 'bg-emerald-50 text-emerald-800'
                                    : 'bg-rose-50 text-rose-800'
                                }`}
                              >
                                {candidate.acceptsUnder18 ? '👶 18 Yaş Altı Uygun' : '🚫 18+ Yetişkin'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                                🏨 Konaklama: {candidate.providesAccommodation ? 'Var ✓' : 'Yok'}
                              </span>
                              <span className="px-2 py-0.5 rounded bg-slate-100 font-medium">
                                🍽️ Yemek: {candidate.providesMeals ? 'Var ✓' : 'Yok'}
                              </span>
                            </div>
                          </div>

                          {/* Card Footer: Select & Inquiry Action Buttons */}
                          <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                            {isSelected ? (
                              <>
                                <div className="w-full py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5">
                                  <span>✓</span>
                                  <span>{t.host.selectedBadge}</span>
                                </div>
                                {(() => {
                                  const candidateInquiry = store.inquiries.find(
                                    (inq) =>
                                      inq.hostName.toLowerCase() === candidate.hostName.toLowerCase() ||
                                      (candidate.hostId && inq.hostId === candidate.hostId),
                                  );

                                  if (candidateInquiry) {
                                    return (
                                      <div className="w-full space-y-1.5">
                                        <div
                                          className={`w-full py-1.5 px-3 rounded-lg border text-xs font-bold text-center flex items-center justify-center gap-1.5 shadow-2xs ${
                                            candidateInquiry.status === 'ACCEPTED'
                                              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                                              : candidateInquiry.status === 'DECLINED'
                                                ? 'bg-rose-50 text-rose-900 border-rose-300'
                                                : candidateInquiry.status === 'REVISED'
                                                  ? 'bg-blue-50 text-blue-900 border-blue-300'
                                                  : 'bg-amber-50 text-amber-900 border-amber-300'
                                          }`}
                                        >
                                          <span>
                                            {candidateInquiry.status === 'ACCEPTED'
                                              ? '✓'
                                              : candidateInquiry.status === 'DECLINED'
                                                ? '✕'
                                                : candidateInquiry.status === 'REVISED'
                                                  ? '✏️'
                                                  : '⏳'}
                                          </span>
                                          <span>
                                            {candidateInquiry.status === 'ACCEPTED'
                                              ? t.inquiry.statusAccepted
                                              : candidateInquiry.status === 'DECLINED'
                                                ? t.inquiry.statusDeclined
                                                : candidateInquiry.status === 'REVISED'
                                                  ? t.inquiry.statusRevised
                                                  : t.inquiry.statusPending}
                                          </span>
                                        </div>
                                        {candidateInquiry.hostReplyNote && (
                                          <div className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] text-slate-700 italic text-left">
                                            <strong>💬 {locale === 'tr' ? 'Ev Sahibi Yanıtı:' : 'Host Reply:'}</strong> {candidateInquiry.hostReplyNote}
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }

                                  return (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setInquiryTargetHost({
                                          hostId: candidate.hostId,
                                          hostName: candidate.hostName,
                                          hostCountry: candidate.countryCode,
                                          organisationType: candidate.organisationType,
                                          oid: candidate.oid,
                                        })
                                      }
                                      className="w-full py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                                    >
                                      <span>✉️</span>
                                      <span>{t.inquiry.sendInquiryBtn}</span>
                                    </button>
                                  );
                                })()}
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleSelectCandidate(candidate)}
                                className="w-full py-1.5 px-3 rounded-lg border border-blue-600 text-blue-700 hover:bg-blue-50 text-xs font-bold transition-colors cursor-pointer"
                              >
                                {t.host.selectHostBtn}
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-6 rounded-xl border border-amber-200 bg-amber-50/50 text-center space-y-2">
                    <div className="text-2xl">⚠️</div>
                    <div className="text-xs font-bold text-amber-900">
                      {t.host.noMatchesFound}
                    </div>
                    <div className="text-xs text-amber-700 max-w-md mx-auto leading-relaxed">
                      Seçilen ülke veya faaliyet türü için zorunlu kriterleri karşılayan kurum bulunamadı. Hedef ülke filtresini &apos;Tüm Ülkeler&apos; yapabilir veya kontenjan sayınızı güncelleyebilirsiniz.
                    </div>
                  </div>
                )}

                {/* Disqualified Hosts Accordion */}
                {showDisqualified && matchResult.disqualified.length > 0 && (
                  <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <span>🚫</span>
                      <span>{t.host.disqualifiedTitle} ({matchResult.disqualified.length} Kurum)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {t.host.disqualifiedSub}
                    </p>

                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                      {matchResult.disqualified.map((dq) => (
                        <div
                          key={dq.hostId}
                          className="p-2.5 rounded-lg border border-slate-200 bg-white text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{dq.hostName} ({dq.countryCode})</span>
                            <span className="text-[10px] text-rose-600 font-bold uppercase">
                              Ön Elemede Elendi
                            </span>
                          </div>
                          <div className="text-[11px] text-rose-700 space-y-0.5">
                            {dq.disqualificationReasons.map((r, i) => (
                              <div key={i} className="flex items-start gap-1">
                                <span className="font-bold">•</span>
                                <span>{r}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE 2: MANUAL 10-CRITERIA SLIDERS */}
        {activeMode === 'manual' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Row 1: Host Name, Country, Type */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
              <div className="md:col-span-6">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.host.nameLabel}
                </label>
                <input
                  type="text"
                  className="edu-input font-medium"
                  placeholder="Örn: Fraunhofer Institute / Leipzig VET School / Festo Didactic"
                  value={data.hostName}
                  onChange={(e) => onChangeHostInfo('hostName', e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.host.countryLabel}
                </label>
                <input
                  type="text"
                  className="edu-input"
                  placeholder="Örn: Almanya"
                  value={data.hostCountry}
                  onChange={(e) => onChangeHostInfo('hostCountry', e.target.value)}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {t.host.typeLabel}
                </label>
                <select
                  className="edu-input bg-white cursor-pointer font-medium"
                  value={data.hostType}
                  onChange={(e) => onChangeHostInfo('hostType', e.target.value)}
                >
                  <option value="VET school">Meslek Lisesi / VET School</option>
                  <option value="Training centre">Eğitim Merkezi / Training Centre</option>
                  <option value="Company / SME">İşletme / KOBİ / Company</option>
                  <option value="Factory / industrial company">Fabrika / Endüstriyel Tesis</option>
                  <option value="Sectoral organisation">Sektörel Kuruluş / Birlik</option>
                </select>
              </div>
            </div>

            {/* Logistics Services Checkboxes */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-3">
              <div className="text-xs font-bold text-slate-800">
                Lojistik & Destek Hizmetleri (Ev Sahibi Kapasitesi):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={data.providesAccommodation ?? false}
                    onChange={(e) => onChangeHostInfo('providesAccommodation', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🏨 Konaklama Sağlıyor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={data.providesMeals ?? false}
                    onChange={(e) => onChangeHostInfo('providesMeals', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🍽️ Yemek / İaşe Sağlıyor</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-medium">
                  <input
                    type="checkbox"
                    checked={data.providesTransfers ?? false}
                    onChange={(e) => onChangeHostInfo('providesTransfers', e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>🚌 Havalimanı / Ulaşım Desteği</span>
                </label>
              </div>
            </div>

            {/* 10 Weighted Criteria Form Grid */}
            <div className="pt-2">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-slate-800">
                  {t.host.criteriaTitle}
                </span>
                <span className="text-xs font-bold text-blue-700">
                  {t.host.totalWeight}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {HOST_METRIC_CONFIG.map((m) => {
                  const val = data.hostMetrics[m.id] ?? m.defaultVal;
                  return (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all duration-150 space-y-1.5"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-semibold text-slate-800">
                          {locale === 'tr' ? m.labelTr : m.labelEn}
                        </label>
                        <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                          Ağırlık: %{m.weight}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={val}
                          onChange={(e) => onMetricChange(m.id, parseInt(e.target.value, 10))}
                          className="w-full accent-blue-600 cursor-pointer"
                        />
                        <span className="w-10 text-right font-bold text-xs text-slate-900">
                          {val}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Manual Score Action Toolbar */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onScoreHost()}
                  className="edu-btn-primary text-xs font-bold cursor-pointer"
                >
                  {t.host.scoreBtn}
                </button>
                {data.hostName && (
                  <button
                    type="button"
                    onClick={() =>
                      setInquiryTargetHost({
                        hostName: data.hostName,
                        hostCountry: data.hostCountry || 'DE',
                        organisationType: data.hostType,
                      })
                    }
                    className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>✉️</span>
                    <span>{t.inquiry.sendInquiryBtn}</span>
                  </button>
                )}
              </div>

              {scoreResult && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600">{t.host.calculatedScore}</span>
                  <span
                    className={`edu-badge text-xs font-bold ${
                      scoreResult.level === 'good'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : scoreResult.level === 'warn'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {scoreResult.score}/100 • {scoreResult.label}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobility Inquiry Modal */}
      {inquiryTargetHost && (
        <MobilityInquiryModal
          isOpen={Boolean(inquiryTargetHost)}
          onClose={() => setInquiryTargetHost(null)}
          targetHost={inquiryTargetHost}
          onNavigateToSent={() => {
            setInquiryTargetHost(null);
            setTimeout(() => {
              const el = document.getElementById('sent-inquiries');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}
        />
      )}
    </NeoCard>
  );
}
