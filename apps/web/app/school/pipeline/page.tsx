'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '../../../components/layout/AppHeader';
import AppFooter from '../../../components/layout/AppFooter';
import CookieBanner from '../../../components/ui/CookieBanner';
import LegalModal from '../../../components/ui/LegalModal';

import SystemKpiCard from '../../../components/gateway/SystemKpiCard';
import SchoolProfileCard from '../../../components/gateway/SchoolProfileCard';
import ParticipantProfileCard from '../../../components/gateway/ParticipantProfileCard';
import EscoIscedMapperCard from '../../../components/gateway/EscoIscedMapperCard';
import CompetenceAssessmentCard from '../../../components/gateway/CompetenceAssessmentCard';
import CompetenceGapCard from '../../../components/gateway/CompetenceGapCard';
import DecisionEngineCard from '../../../components/gateway/DecisionEngineCard';
import EligibilityGatekeeperCard from '../../../components/gateway/EligibilityGatekeeperCard';
import HostMatchingCard from '../../../components/gateway/HostMatchingCard';
import PartnerFindingCard from '../../../components/gateway/PartnerFindingCard';
import LearningOutcomesCard from '../../../components/gateway/LearningOutcomesCard';
import QualityChecklistCard from '../../../components/gateway/QualityChecklistCard';
import RecommendationReportCard from '../../../components/gateway/RecommendationReportCard';
import OfficialResourcesCard from '../../../components/gateway/OfficialResourcesCard';
import SentInquiriesCard from '../../../components/gateway/SentInquiriesCard';

import { VET_FIELDS } from '../../../lib/constants';
import { useTranslation } from '../../../lib/i18n';
import {
  scoreAssessment,
  scoreHost,
  makeDecision,
  generateOutcomes,
} from '../../../lib/calculations';
import { ParticipantType, MobilityGoal, HostType } from '@mobility-nexus/types';
import { useAppStore } from '../../../lib/store';

export default function SchoolPipelinePage() {
  const { t, locale } = useTranslation();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);

  // Modern Non-blocking Toast Notification State (Prevents headless browser timeouts)
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'warn' | 'error';
  } | null>(null);

  const showToast = (
    text: string,
    type: 'success' | 'warn' | 'error' = 'success',
  ) => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Dynamic Tabs Configuration using i18n
  const TABS = [
    { id: 'profile', code: '1', label: t.tabs.profile.label, desc: t.tabs.profile.desc },
    { id: 'competence', code: '2', label: t.tabs.competence.label, desc: t.tabs.competence.desc },
    { id: 'matching', code: '3', label: t.tabs.matching.label, desc: t.tabs.matching.desc },
    { id: 'outcomes', code: '4', label: t.tabs.outcomes.label, desc: t.tabs.outcomes.desc },
    { id: 'report', code: '5', label: t.tabs.report.label, desc: t.tabs.report.desc },
  ];

  // --- ZUSTAND STORE INTEGRATION ---
  const store = useAppStore();

  // 1. School Profile State
  const { schoolName, city, accredited, oid, erasmusPlan, institutionNeed } = store.schoolProfile;
  const setSchoolName = (v: string) => store.setSchoolProfile({ schoolName: v });
  const setCity = (v: string) => store.setSchoolProfile({ city: v });
  const setAccredited = (v: any) => store.setSchoolProfile({ accredited: v });
  const setOid = (v: string) => store.setSchoolProfile({ oid: v });
  const setErasmusPlan = (v: string) => store.setSchoolProfile({ erasmusPlan: v });
  const setInstitutionNeed = (v: string) => store.setSchoolProfile({ institutionNeed: v });

  // 2. Participant Profile State
  const {
    participantType,
    mobilityGoal,
    participantName,
    language,
    targetCountries,
    startDate,
    endDate,
    participantCount,
    accompanyingPersonsCount,
    ageGroup,
  } = store.participantProfile;
  const setParticipantType = (v: any) => store.setParticipantProfile({ participantType: v });
  const setMobilityGoal = (v: any) => store.setParticipantProfile({ mobilityGoal: v });
  const setParticipantName = (v: string) => store.setParticipantProfile({ participantName: v });
  const setLanguage = (v: number) => store.setParticipantProfile({ language: v });
  const setTargetCountries = (v: string[]) => store.setParticipantProfile({ targetCountries: v });
  const setStartDate = (v: string) => store.setParticipantProfile({ startDate: v });
  const setEndDate = (v: string) => store.setParticipantProfile({ endDate: v });
  const setParticipantCount = (v: number) => store.setParticipantProfile({ participantCount: v });
  const setAccompanyingPersonsCount = (v: number) =>
    store.setParticipantProfile({ accompanyingPersonsCount: v });
  const setAgeGroup = (v: any) => store.setParticipantProfile({ ageGroup: v });

  // 3. ESCO - ISCED State
  const { vetField, iscedCode, iscedName, escoTerm, iscoCode, escoUri, skills } = store.escoIsced;
  const setVetField = (v: string) => store.setEscoIsced({ vetField: v });
  const setIscedCode = (v: string) => store.setEscoIsced({ iscedCode: v });
  const setIscedName = (v: string) => store.setEscoIsced({ iscedName: v });
  const setEscoTerm = (v: string) => store.setEscoIsced({ escoTerm: v });
  const setIscoCode = (v: string) => store.setEscoIsced({ iscoCode: v });
  const setEscoUri = (v: string) => store.setEscoIsced({ escoUri: v });
  const setSkills = (v: string) => store.setEscoIsced({ skills: v });

  // 4. Competence Assessment & Gap State
  const {
    assessmentAnswers,
    competenceScore,
    assessmentResultMsg,
    assessmentResultType,
    targetScore,
    externalScore,
  } = store.competence;
  const setAssessmentAnswers = (fn: any) => {
    store.setCompetence({
      assessmentAnswers:
        typeof fn === 'function' ? fn(store.competence.assessmentAnswers) : fn,
    });
  };
  const setCompetenceScore = (v: any) => store.setCompetence({ competenceScore: v });
  const setAssessmentResultMsg = (v: string) => store.setCompetence({ assessmentResultMsg: v });
  const setAssessmentResultType = (v: any) => store.setCompetence({ assessmentResultType: v });
  const setTargetScore = (v: number) => store.setCompetence({ targetScore: v });
  const setExternalScore = (v: string) => store.setCompetence({ externalScore: v });

  // 5. Decision Engine State
  const { decisionResult } = store.decisionEngine;
  const setDecisionResult = (v: any) => store.setDecisionEngine({ decisionResult: v });

  // 5b. Eligibility Gatekeeper State
  const {
    participantCount: eligibilityParticipantCount,
    projectDurationMonths: eligibilityDurationMonths,
    pastKa122GrantsCount: eligibilityPastGrants,
    mobilityStrategy: eligibilityStrategy,
  } = store.eligibilityGatekeeper;

  const setEligibilityField = (field: string, val: any) => {
    store.setEligibilityGatekeeper({ [field]: val });
    if (field === 'accredited') {
      setAccredited(val);
    }
  };

  // 6. Host Matching State
  const { hostName, hostCountry, hostType, hostMetrics, hostScoreResult } = store.hostMatching;
  const setHostName = (v: string) => store.setHostMatching({ hostName: v });
  const setHostCountry = (v: string) => store.setHostMatching({ hostCountry: v });
  const setHostType = (v: any) => store.setHostMatching({ hostType: v });
  const setHostMetrics = (fn: any) => {
    store.setHostMatching({
      hostMetrics: typeof fn === 'function' ? fn(store.hostMatching.hostMetrics) : fn,
    });
  };
  const setHostScoreResult = (v: any) => store.setHostMatching({ hostScoreResult: v });

  // 7. Learning Outcomes State
  const { primaryGap, technicalOutcome, transversalOutcome } = store.learningOutcomes;
  const setPrimaryGap = (v: string) => store.setLearningOutcomes({ primaryGap: v });
  const setTechnicalOutcome = (v: string) => store.setLearningOutcomes({ technicalOutcome: v });
  const setTransversalOutcome = (v: string) => store.setLearningOutcomes({ transversalOutcome: v });

  // Initial Calculation on Mount
  useEffect(() => {
    handleScoreAssessment();
    handleScoreHost();
    handleGenerateOutcomes();
    handleMakeDecision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dynamic outcome regeneration when participantType changes
  useEffect(() => {
    handleGenerateOutcomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantType]);

  // Re-sync competence score and result message whenever assessmentAnswers or targetScore change
  useEffect(() => {
    handleScoreAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessmentAnswers, targetScore]);

  // Dynamic decision engine re-evaluation when any plan parameter changes
  useEffect(() => {
    handleMakeDecision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accredited,
    institutionNeed,
    erasmusPlan,
    participantCount,
    accompanyingPersonsCount,
    startDate,
    endDate,
    mobilityGoal,
    eligibilityDurationMonths,
    eligibilityPastGrants,
    eligibilityStrategy,
    competenceScore,
    hostScoreResult,
  ]);

  // Handler: Select VET Field
  const handleSelectField = (key: string) => {
    setVetField(key);
    const item = VET_FIELDS[key];
    if (item) {
      setIscedCode(item.isced);
      setIscedName(item.name);
      setEscoTerm(item.esco);
      setSkills(item.skills);
      setPrimaryGap(item.esco.split('/')[0].trim());
    }
  };

  // Handler: Competence Score calculation
  const handleScoreAssessment = () => {
    const res = scoreAssessment(assessmentAnswers, targetScore);
    if (res.missingQuestions.length > 0) {
      setAssessmentResultMsg(res.readinessText);
      setAssessmentResultType('warn');
      setCompetenceScore(null);
      return;
    }

    setCompetenceScore(res.score);
    setAssessmentResultMsg(
      `Skor: ${res.score}/100 | Hedef: ${targetScore} | Yetkinlik Farkı: ${res.gap} Puan (${res.readinessText})`,
    );
    setAssessmentResultType(res.readinessType);
  };

  // Handler: Apply External Competence Score
  const handleApplyExternalScore = () => {
    const s = parseInt(externalScore, 10);
    if (!isNaN(s) && s >= 0 && s <= 100) {
      setCompetenceScore(s);
      setAssessmentResultMsg(
        locale === 'tr'
          ? `Competence4VET Dış Test Skoru Uygulandı: ${s}/100`
          : `Competence4VET External Test Score Applied: ${s}/100`
      );
      setAssessmentResultType('good');
    } else {
      showToast(
        locale === 'tr'
          ? 'Lütfen 0 ile 100 arasında bir yetkinlik skoru giriniz.'
          : 'Please enter a competence score between 0 and 100.',
        'warn'
      );
    }
  };

  // Handler: Host Score calculation
  const handleScoreHost = (customScore?: number) => {
    if (typeof customScore === 'number') {
      const level: 'good' | 'warn' | 'bad' =
        customScore >= 70 ? 'good' : customScore >= 55 ? 'warn' : 'bad';
      const label =
        customScore >= 85
          ? (locale === 'tr' ? 'Mükemmel Eşleşme' : 'Excellent Match')
          : customScore >= 70
          ? (locale === 'tr' ? 'Uygun Kuruluş' : 'Suitable Institution')
          : customScore >= 55
          ? (locale === 'tr' ? 'Şartlı Kısa Liste' : 'Conditional Shortlist')
          : (locale === 'tr' ? 'Yetersiz Uyum' : 'Weak Match');
      setHostScoreResult({ score: customScore, label, level });
    } else {
      const res = scoreHost(hostMetrics);
      setHostScoreResult(res);
    }
  };

  // Handler: Make Decision (KA121 vs KA122)
  const handleMakeDecision = () => {
    const currentCompScore =
      competenceScore ?? scoreAssessment(assessmentAnswers, targetScore).score;
    const currentHostScore = hostScoreResult?.score ?? scoreHost(hostMetrics).score;

    const res = makeDecision({
      accredited,
      institutionNeed,
      erasmusPlan,
      escoTerm,
      iscedCode,
      language,
      competenceScore: currentCompScore,
      targetScore,
      hostScore: currentHostScore,
      participantCount,
      accompanyingPersonsCount,
      startDate,
      endDate,
      mobilityGoal,
      locale: locale as 'tr' | 'en',
      projectDurationMonths: eligibilityDurationMonths,
      pastKa122GrantsCount: eligibilityPastGrants,
      mobilityStrategy: eligibilityStrategy,
    });

    setDecisionResult(res);
  };

  // Handler: Generate Outcomes
  const handleGenerateOutcomes = () => {
    const res = generateOutcomes(participantType, primaryGap, escoTerm);
    setTechnicalOutcome(res.technicalOutcome);
    setTransversalOutcome(res.transversalOutcome);
  };

  // Handler: Refresh Complete Report
  const handleRefreshReport = () => {
    handleScoreAssessment();
    handleScoreHost();
    handleMakeDecision();
    handleGenerateOutcomes();
  };

  // Handler: Save to LocalStorage (Non-blocking)
  const handleSaveLocal = () => {
    const payload = {
      schemaVersion: '1.0',
      generator: 'ErasmusMobility.com VET Mobility Planner',
      savedAt: new Date().toISOString(),
      schoolName,
      city,
      accredited,
      oid,
      erasmusPlan,
      institutionNeed,
      participantType,
      mobilityGoal,
      participantName,
      language,
      targetCountries,
      startDate,
      endDate,
      participantCount,
      accompanyingPersonsCount: Math.max(0, accompanyingPersonsCount || 0),
      ageGroup,
      vetField,
      iscedCode,
      iscedName,
      escoTerm,
      iscoCode,
      escoUri,
      skills,
      assessmentAnswers,
      targetScore,
      competenceScore,
      hostName,
      hostCountry,
      hostType,
      hostMetrics,
      eligibilityDurationMonths,
      eligibilityPastGrants,
      eligibilityStrategy,
      primaryGap,
      technicalOutcome,
      transversalOutcome,
    };

    try {
      localStorage.setItem('erasmusmobility_pipeline_data', JSON.stringify(payload));
      showToast(
        locale === 'tr'
          ? '✓ Hareketlilik planı başarıyla tarayıcı yerel hafızasına kaydedildi.'
          : '✓ Mobility plan successfully saved to browser local storage.',
        'success'
      );
    } catch {
      showToast(
        locale === 'tr'
          ? '❌ Veri tarayıcıya kaydedilirken kota veya depolama hatası oluştu.'
          : '❌ Storage quota exceeded or error occurred while saving.',
        'error'
      );
    }
  };

  // Handler: Load from LocalStorage (Non-blocking & Full Pipeline Refresh)
  const handleLoadLocal = () => {
    const raw =
      localStorage.getItem('erasmusmobility_pipeline_data') ||
      localStorage.getItem('cappinno_mobility_nexus_data');
    if (!raw) {
      showToast(
        locale === 'tr'
          ? '⚠️ Tarayıcı hafızasında kayıtlı bir hareketlilik planı bulunamadı.'
          : '⚠️ No saved mobility plan found in browser storage.',
        'warn'
      );
      return;
    }

    try {
      const d = JSON.parse(raw);
      if (d.schoolName !== undefined) setSchoolName(d.schoolName);
      if (d.city !== undefined) setCity(d.city);
      if (d.accredited !== undefined) setAccredited(d.accredited);
      if (d.oid !== undefined) setOid(d.oid);
      if (d.erasmusPlan !== undefined) setErasmusPlan(d.erasmusPlan);
      if (d.institutionNeed !== undefined) setInstitutionNeed(d.institutionNeed);
      if (d.participantType !== undefined) setParticipantType(d.participantType);
      if (d.mobilityGoal !== undefined) setMobilityGoal(d.mobilityGoal);
      if (d.participantName !== undefined) setParticipantName(d.participantName);
      if (d.language !== undefined) setLanguage(d.language);
      if (d.targetCountries !== undefined) setTargetCountries(d.targetCountries);
      if (d.startDate !== undefined) setStartDate(d.startDate);
      if (d.endDate !== undefined) setEndDate(d.endDate);
      if (d.participantCount !== undefined) setParticipantCount(d.participantCount);
      if (d.accompanyingPersonsCount !== undefined)
        setAccompanyingPersonsCount(Math.max(0, d.accompanyingPersonsCount));
      if (d.ageGroup !== undefined) setAgeGroup(d.ageGroup);
      if (d.vetField !== undefined) setVetField(d.vetField);
      if (d.iscedCode !== undefined) setIscedCode(d.iscedCode);
      if (d.iscedName !== undefined) setIscedName(d.iscedName);
      if (d.escoTerm !== undefined) setEscoTerm(d.escoTerm);
      if (d.iscoCode !== undefined) setIscoCode(d.iscoCode);
      if (d.escoUri !== undefined) setEscoUri(d.escoUri);
      if (d.skills !== undefined) setSkills(d.skills);
      if (d.assessmentAnswers !== undefined) setAssessmentAnswers(d.assessmentAnswers);
      if (d.targetScore !== undefined) setTargetScore(d.targetScore);
      if (d.competenceScore !== undefined) setCompetenceScore(d.competenceScore);
      if (d.hostName !== undefined) setHostName(d.hostName);
      if (d.hostCountry !== undefined) setHostCountry(d.hostCountry);
      if (d.hostType !== undefined) setHostType(d.hostType);
      if (d.hostMetrics !== undefined) setHostMetrics(d.hostMetrics);
      if (d.eligibilityDurationMonths !== undefined)
        setEligibilityField('projectDurationMonths', d.eligibilityDurationMonths);
      if (d.eligibilityPastGrants !== undefined)
        setEligibilityField('pastKa122GrantsCount', d.eligibilityPastGrants);
      if (d.eligibilityStrategy !== undefined)
        setEligibilityField('mobilityStrategy', d.eligibilityStrategy);
      if (d.primaryGap !== undefined) setPrimaryGap(d.primaryGap);
      if (d.technicalOutcome !== undefined) setTechnicalOutcome(d.technicalOutcome);
      if (d.transversalOutcome !== undefined) setTransversalOutcome(d.transversalOutcome);

      // Re-trigger complete pipeline calculations with restored data
      setTimeout(() => {
        handleScoreAssessment();
        handleScoreHost();
        handleMakeDecision();
        handleGenerateOutcomes();
      }, 50);

      showToast(
        locale === 'tr'
          ? '✓ Kayıtlı hareketlilik planı eksiksiz yüklendi ve rapor güncellendi.'
          : '✓ Saved mobility plan successfully loaded and refreshed.',
        'success'
      );
    } catch {
      showToast(
        locale === 'tr'
          ? '❌ Kayıtlı veri ayrıştırılırken hata oluştu.'
          : '❌ Failed to parse saved data.',
        'error'
      );
    }
  };

  // Handler: Export JSON File
  const handleExportJson = () => {
    const payload = {
      schemaVersion: '1.0',
      generator: 'ErasmusMobility.com VET Mobility Planner',
      exportedAt: new Date().toISOString(),
      schoolProfile: {
        schoolName,
        city,
        accredited,
        oid,
        erasmusPlan,
        institutionNeed,
      },
      participantProfile: {
        participantType,
        mobilityGoal,
        participantName,
        language,
        targetCountries,
        startDate,
        endDate,
        participantCount,
        accompanyingPersonsCount: Math.max(0, accompanyingPersonsCount || 0),
        ageGroup,
      },
      escoIsced: {
        vetField,
        iscedCode,
        iscedName,
        escoTerm,
        iscoCode,
        escoUri,
        skills,
      },
      competenceAssessment: {
        assessmentAnswers,
        competenceScore,
        targetScore,
      },
      hostMatching: {
        hostName,
        hostCountry,
        hostType,
        hostMetrics,
        hostScoreResult,
      },
      eligibilityGatekeeper: {
        projectDurationMonths: eligibilityDurationMonths,
        pastKa122GrantsCount: eligibilityPastGrants,
        mobilityStrategy: eligibilityStrategy,
      },
      decisionResult,
      learningOutcomes: {
        primaryGap,
        technicalOutcome,
        transversalOutcome,
      },
    };

    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Erasmus_VET_Hareketlilik_Dosyasi_${oid || 'Taslak'}.json`;
      a.click();
      URL.revokeObjectURL(url);

      showToast(
        locale === 'tr'
          ? '✓ Hareketlilik planı JSON dosyası olarak indirildi.'
          : '✓ Mobility plan exported as JSON file.',
        'success'
      );
    } catch {
      showToast(
        locale === 'tr'
          ? '❌ JSON dosyası oluşturulurken hata meydana geldi.'
          : '❌ Failed to generate JSON export.',
        'error'
      );
    }
  };

  // Step Navigation Helper
  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const goToNextTab = () => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const goToPrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-150">
      {/* 1. Official Erasmus+ Header */}
      <AppHeader />

      {/* Top Breadcrumb & Page Identification Bar */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>{locale === 'tr' ? 'Okul Paneline Dön' : 'Back to School Dashboard'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <h1 className="font-bold text-slate-900 text-xs sm:text-sm inline m-0">
              {locale === 'tr' ? '5 Adımlı Hareketlilik Planlama Pipeline\'ı' : '5-Step Mobility Planning Pipeline'}
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>OID: <strong>{oid || (locale === 'tr' ? 'Belirtilmedi' : 'Not Specified')}</strong></span>
            <span>•</span>
            <span>{schoolName || (locale === 'tr' ? 'Örnek Mesleki Eğitim Kurumu' : 'Sample VET School')}</span>
          </div>
        </div>
      </div>

      {/* 2. Institutional Stepper Navigation Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-[57px] sm:top-[69px] z-20 shadow-xs no-print">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 py-2">
            {/* Step Tabs: Horizontal Touch-friendly Scroll on Mobile, Flex on Desktop */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 max-w-full">
              {TABS.map((tab, idx) => {
                const isActive = activeTab === tab.id;
                const isPast = idx < currentTabIndex;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2 sm:p-2.5 rounded-xl text-left transition-all flex items-center gap-2 sm:gap-3 shrink-0 ${
                      isActive
                        ? 'bg-blue-50/90 text-blue-950 font-bold border border-blue-200 shadow-xs'
                        : isPast
                        ? 'bg-slate-50 text-slate-800 hover:bg-slate-100/80 border border-transparent'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : isPast
                          ? 'bg-emerald-100 text-emerald-700 font-bold'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isPast ? '✓' : tab.code}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{tab.label}</div>
                      <div className="text-[11px] font-normal text-slate-500 truncate hidden lg:block">
                        {tab.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 justify-end shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => {
                  store.loadDemoData(locale);
                  handleRefreshReport();
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors shadow-xs"
              >
                ✨ {locale === 'tr' ? 'Demo Verisi' : 'Demo Data'}
              </button>
              <button
                onClick={() => {
                  store.resetData();
                  setActiveTab('profile');
                }}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                {locale === 'tr' ? 'Sıfırla' : 'Reset'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main id="main-content" tabIndex={-1} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8 focus:outline-none">
        {/* TAB 1: Kurum & Katilimci Profili */}
        {activeTab === 'profile' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <SystemKpiCard />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <SchoolProfileCard
                  data={{
                    schoolName,
                    city,
                    accredited,
                    oid,
                    erasmusPlan,
                    institutionNeed,
                  }}
                  onChange={(field, val) => {
                    if (field === 'schoolName') setSchoolName(val);
                    if (field === 'city') setCity(val);
                    if (field === 'accredited') setAccredited(val as 'yes' | 'no' | 'unknown');
                    if (field === 'oid') setOid(val);
                    if (field === 'erasmusPlan') setErasmusPlan(val);
                    if (field === 'institutionNeed') setInstitutionNeed(val);
                  }}
                />
              </div>

              <div className="lg:col-span-6">
                <ParticipantProfileCard
                  data={{
                    participantType,
                    mobilityGoal,
                    participantName,
                    language,
                    targetCountries,
                    startDate,
                    endDate,
                    participantCount,
                    accompanyingPersonsCount,
                    ageGroup,
                  }}
                  onChange={(field, val) => {
                    if (field === 'participantType') setParticipantType(val as ParticipantType);
                    if (field === 'mobilityGoal') setMobilityGoal(val as MobilityGoal);
                    if (field === 'participantName') setParticipantName(val as string);
                    if (field === 'language') setLanguage(val as number);
                    if (field === 'targetCountries') setTargetCountries(val as string[]);
                    if (field === 'startDate') setStartDate(val as string);
                    if (field === 'endDate') setEndDate(val as string);
                    if (field === 'participantCount') setParticipantCount(val as number);
                    if (field === 'accompanyingPersonsCount')
                      setAccompanyingPersonsCount(val as number);
                    if (field === 'ageGroup') setAgeGroup(val);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ESCO & Yetkinlik Analizi */}
        {activeTab === 'competence' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <EscoIscedMapperCard
              data={{
                vetField,
                iscedCode,
                iscedName,
                escoTerm,
                iscoCode,
                escoUri,
                skills,
              }}
              onSelectField={handleSelectField}
              onChange={(field, val) => {
                if (field === 'escoTerm') setEscoTerm(val);
                if (field === 'iscoCode') setIscoCode(val);
                if (field === 'escoUri') setEscoUri(val);
                if (field === 'skills') setSkills(val);
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <CompetenceAssessmentCard
                  answers={assessmentAnswers}
                  onAnswerChange={(qId, val) =>
                    setAssessmentAnswers((prev: any) => ({ ...prev, [qId]: val }))
                  }
                  onScoreClick={handleScoreAssessment}
                  resultMessage={assessmentResultMsg}
                  resultType={assessmentResultType}
                />
              </div>
              <div className="lg:col-span-4">
                <CompetenceGapCard
                  competenceScore={competenceScore}
                  targetScore={targetScore}
                  externalScore={externalScore}
                  onTargetScoreChange={setTargetScore}
                  onExternalScoreChange={setExternalScore}
                  onApplyExternalScore={handleApplyExternalScore}
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Host Eslestirme & Karar Motoru */}
        {activeTab === 'matching' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Step 5: Mandatory Eligibility Gatekeeper */}
            <EligibilityGatekeeperCard
              data={{
                accredited,
                participantCount: participantCount,
                projectDurationMonths: eligibilityDurationMonths,
                pastKa122GrantsCount: eligibilityPastGrants,
                mobilityStrategy: eligibilityStrategy,
              }}
              onChange={setEligibilityField}
            />

            {/* Step 6: 10-Criteria Host Matching & Scoring */}
            <HostMatchingCard
              data={{
                hostName,
                hostCountry,
                hostType,
                hostMetrics,
              }}
              schoolProfile={{
                projectType: accredited === 'yes' ? 'KA121' : 'KA122',
                targetCountries,
                mobilityGoal,
                participantType,
                participantCount,
                accompanyingPersonsCount,
                ageGroup,
                vetField,
                iscedCode,
                languages: language ? ['EN'] : ['EN'],
              }}
              scoreResult={hostScoreResult}
              onChangeHostInfo={(field, val) => {
                if (field === 'hostName') setHostName(val);
                if (field === 'hostCountry') setHostCountry(val);
                if (field === 'hostType') setHostType(val as HostType);
              }}
              onMetricChange={(metricId, val) =>
                setHostMetrics((prev: any) => ({ ...prev, [metricId]: val }))
              }
              onScoreHost={handleScoreHost}
              onSelectMatchedHost={(candidate) => {
                setHostName(candidate.hostName);
                setHostCountry(candidate.countryCode);
                if (candidate.organisationType) {
                  setHostType(candidate.organisationType as HostType);
                }
                handleScoreHost(candidate.compositeScore);
              }}
            />

            {/* Step 7: 8-Factor KA120 / KA121 / KA122 Decision Engine */}
            <DecisionEngineCard
              decision={decisionResult}
              onMakeDecision={handleMakeDecision}
            />

            {/* Step 8: EU Partner & Host Finding Gateway */}
            <PartnerFindingCard />

            {/* Step 9: Gönderilen Hareketlilik Talepleri / Sent Inquiries Tracker */}
            <div id="sent-inquiries">
              <SentInquiriesCard />
            </div>
          </div>
        )}

        {/* TAB 4: Ogrenme Kazanimlari & Kalite */}
        {activeTab === 'outcomes' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6">
                <LearningOutcomesCard
                  primaryGap={primaryGap}
                  technicalOutcome={technicalOutcome}
                  transversalOutcome={transversalOutcome}
                  onPrimaryGapChange={setPrimaryGap}
                  onTechnicalOutcomeChange={setTechnicalOutcome}
                  onTransversalOutcomeChange={setTransversalOutcome}
                  onGenerateClick={handleGenerateOutcomes}
                />
              </div>
              <div className="lg:col-span-6">
                <QualityChecklistCard />
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Rapor & Basvuru Dosyasi */}
        {activeTab === 'report' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Hizmet Alan Kurulus Basvuru Taslagi CTA */}
            <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-blue-800/60 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-3 max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      <span>📑</span>
                      <span>Resmi KA121 & KA122 Soru ve Karar Matrisi</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-200 border border-indigo-400/30">
                      <span>🎯</span>
                      <span>
                        {accredited === 'yes'
                          ? (locale === 'tr' ? 'Önerilen: KA121-VET (Akredite Kurum Yıllık Hibe)' : 'Recommended: KA121-VET (Accredited Grant)')
                          : (locale === 'tr' ? 'Önerilen: KA122-VET (Kısa Dönemli Proje)' : 'Recommended: KA122-VET (Short-term Project)')}
                      </span>
                    </span>
                    {(!schoolName?.trim() || !oid?.trim()) && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                        <span>⚠️</span>
                        <span>{locale === 'tr' ? 'Eksik Kurum Bilgisi (Taslakta tamamlanabilir)' : 'Missing Org Info (Can be filled in draft)'}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Hizmet Alan Kuruluş Başvuru Taslağının Hazırlanmasını İstiyorum
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    Bu 5 adımlı planda girdiğiniz kurum, katılımcı, süre, ev sahibi ve öğrenme çıktıları
                    otomatik olarak resmi başvuru taslağına aktarılır. Başvuru formunda eksik kalan ek
                    lojistik, seyahat, refakatçi ve resmi beyan sorularını hızlı seçeneklerle tamamlayın.
                  </p>

                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 pt-1">
                    <span className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span> Pipeline verileriyle otomatik eşleşir
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span> Hızlı seçenekli pratik sorular
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="text-emerald-400 font-bold">✓</span> KA121 ve KA122 desteği
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-3 min-w-[240px]">
                  {(() => {
                    const recommendedType = accredited === 'yes' ? 'KA121' : 'KA122';
                    const hasValidationErrors = Boolean(
                      decisionResult &&
                        (decisionResult.isDataValid === false ||
                          (decisionResult.validationErrors &&
                            decisionResult.validationErrors.length > 0))
                    );

                    if (hasValidationErrors) {
                      return (
                        <div className="space-y-1.5">
                          <button
                            type="button"
                            disabled
                            className="w-full px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed flex items-center justify-center gap-2 text-center"
                          >
                            <span>⚠️ {locale === 'tr' ? 'Önce Planlama Hatalarını Düzeltiniz' : 'Fix Planning Errors First'}</span>
                          </button>
                          <span className="block text-[11px] text-rose-300 font-semibold text-center">
                            {locale === 'tr' ? 'Geçersiz parametrelerle taslak başlatılamaz' : 'Cannot start draft with invalid parameters'}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <Link
                        href={`/school/application-draft?type=${recommendedType}`}
                        onClick={() => {
                          store.syncPipelineToDraft(recommendedType);
                        }}
                        className="px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-md hover:shadow-blue-500/30 flex items-center justify-center gap-2 text-center"
                      >
                        <span>
                          {recommendedType}-VET {locale === 'tr' ? 'Başvuru Taslağını Başlat' : 'Start Application Draft'}
                        </span>
                        <span>→</span>
                      </Link>
                    );
                  })()}
                  <span className="text-[11px] text-slate-400 text-center">
                    {accredited === 'yes'
                      ? (locale === 'tr' ? 'KA121 Akredite şablonu açılır' : 'Opens KA121 Accredited template')
                      : (locale === 'tr' ? 'KA122 Standart şablon açılır' : 'Opens KA122 Standard template')}
                  </span>
                </div>
              </div>
            </div>

            <RecommendationReportCard
              data={{
                schoolName,
                city,
                oid,
                accredited,
                erasmusPlan,
                institutionNeed,
                participantType,
                participantName,
                mobilityGoal,
                targetCountries,
                startDate,
                endDate,
                participantCount,
                accompanyingPersonsCount,
                ageGroup,
                iscedName,
                iscedCode,
                escoTerm,
                iscoCode,
                escoUri,
                skills,
                primaryGap,
                hostName,
                hostCountry,
                technicalOutcome,
                transversalOutcome,
              }}
              competenceScore={competenceScore}
              hostScoreResult={hostScoreResult}
              decisionResult={decisionResult}
              onRefreshReport={handleRefreshReport}
              onSaveLocal={handleSaveLocal}
              onLoadLocal={handleLoadLocal}
              onExportJson={handleExportJson}
              onNavigateToSent={() => {
                setActiveTab('matching');
                setTimeout(() => {
                  const el = document.getElementById('sent-inquiries');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }, 150);
              }}
            />

            <OfficialResourcesCard />
          </div>
        )}

        {/* 4. Stepper Navigation Controls */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-200 no-print">
          <button
            type="button"
            onClick={goToPrevTab}
            disabled={currentTabIndex === 0}
            className={`edu-btn-secondary text-xs ${
              currentTabIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
          >
            ← {t.nav.prev.replace(/[←→]/g, '').trim()}
          </button>

          <div className="text-xs font-semibold text-slate-500">
            {locale === 'tr' ? 'Aşama:' : 'Step:'}{' '}
            <strong className="text-slate-900 font-bold">{currentTabIndex + 1}</strong> /{' '}
            {TABS.length}
          </div>

          {currentTabIndex < TABS.length - 1 ? (
            <button
              type="button"
              onClick={goToNextTab}
              className="edu-btn-primary text-xs"
            >
              {t.nav.next.replace(/[←→]/g, '').trim()} →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRefreshReport}
              className="edu-btn-primary text-xs"
            >
              ✓ {t.nav.complete.replace(/[✓]/g, '').trim()}
            </button>
          )}
        </div>
      </main>

      {/* 5. Institutional Footer */}
      <AppFooter />

      {/* 6. Cookie Consent Banner */}
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />

      {/* Direct Cookie Preferences Modal */}
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />

      {/* Modern Non-blocking Floating Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 text-xs font-bold px-4 py-3 rounded-xl shadow-xl border animate-in fade-in slide-in-from-bottom duration-200 flex items-center gap-2.5 no-print ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
              : toastMessage.type === 'warn'
                ? 'bg-amber-950 text-amber-100 border-amber-800'
                : 'bg-rose-950 text-rose-100 border-rose-800'
          }`}
        >
          <span className="text-sm">
            {toastMessage.type === 'success'
              ? '✓'
              : toastMessage.type === 'warn'
                ? '⚠️'
                : '❌'}
          </span>
          <span>{toastMessage.text}</span>
        </div>
      )}
    </div>
  );
}
