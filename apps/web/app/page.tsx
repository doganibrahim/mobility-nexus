'use client';

import React, { useState, useEffect } from 'react';
import AppHeader from '../components/layout/AppHeader';
import AppFooter from '../components/layout/AppFooter';

import SystemKpiCard from '../components/gateway/SystemKpiCard';
import SchoolProfileCard from '../components/gateway/SchoolProfileCard';
import ParticipantProfileCard from '../components/gateway/ParticipantProfileCard';
import EscoIscedMapperCard from '../components/gateway/EscoIscedMapperCard';
import CompetenceAssessmentCard from '../components/gateway/CompetenceAssessmentCard';
import CompetenceGapCard from '../components/gateway/CompetenceGapCard';
import DecisionEngineCard from '../components/gateway/DecisionEngineCard';
import HostMatchingCard from '../components/gateway/HostMatchingCard';
import PartnerFindingCard from '../components/gateway/PartnerFindingCard';
import LearningOutcomesCard from '../components/gateway/LearningOutcomesCard';
import QualityChecklistCard from '../components/gateway/QualityChecklistCard';
import RecommendationReportCard from '../components/gateway/RecommendationReportCard';
import OfficialResourcesCard from '../components/gateway/OfficialResourcesCard';

import { VET_FIELDS } from '../lib/constants';
import { useTranslation } from '../lib/i18n';
import {
  scoreAssessment,
  scoreHost,
  makeDecision,
  generateOutcomes,
  HostScoreResult,
  DecisionEngineResult,
} from '../lib/calculations';
import { ParticipantType, MobilityGoal, HostType } from '@mobility-nexus/types';

export default function Home() {
  const { t, locale } = useTranslation();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<string>('profile');

  // Dynamic Tabs Configuration using i18n
  const TABS = [
    { id: 'profile', code: '1', label: t.tabs.profile.label, desc: t.tabs.profile.desc },
    { id: 'competence', code: '2', label: t.tabs.competence.label, desc: t.tabs.competence.desc },
    { id: 'matching', code: '3', label: t.tabs.matching.label, desc: t.tabs.matching.desc },
    { id: 'outcomes', code: '4', label: t.tabs.outcomes.label, desc: t.tabs.outcomes.desc },
    { id: 'report', code: '5', label: t.tabs.report.label, desc: t.tabs.report.desc },
  ];

  // 1. School Profile State
  const [schoolName, setSchoolName] = useState(
    locale === 'en'
      ? 'Ankara Vocational and Technical Anatolian High School'
      : 'Ankara Mesleki ve Teknik Anadolu Lisesi',
  );
  const [city, setCity] = useState('Ankara');
  const [accredited, setAccredited] = useState<'yes' | 'no' | 'unknown'>('yes');
  const [oid, setOid] = useState('E10123456');
  const [erasmusPlan, setErasmusPlan] = useState(
    locale === 'en'
      ? 'Enhance teachers and learners competence in Industry 4.0, smart automation, and robotics.'
      : 'Öğretmen ve öğrencilerin Endüstri 4.0 / dijital üretim ve robotik yetkinliklerini geliştirmek.',
  );
  const [institutionNeed, setInstitutionNeed] = useState(
    locale === 'en'
      ? 'Our school has established a new PLC lab and requires European job-shadowing for technical staff.'
      : 'Okulumuzda yeni nesil PLC ve endüstriyel haberleşme laboratuvarı kurulmuş olup, öğretmenlerimizin Avrupa standartlarında pratik işbaşı gözlem ihtiyacı bulunmaktadır.',
  );

  // 2. Participant Profile State
  const [participantType, setParticipantType] = useState<ParticipantType>('teacher');
  const [mobilityGoal, setMobilityGoal] = useState<MobilityGoal>('Job shadowing / observation');
  const [participantName, setParticipantName] = useState(
    locale === 'en' ? 'Vocational Teachers Group' : 'Teknik Öğretmen Grubu',
  );
  const [language, setLanguage] = useState(70);
  const [country, setCountry] = useState(locale === 'en' ? 'Germany / Netherlands' : 'Almanya / Hollanda');
  const [duration, setDuration] = useState(locale === 'en' ? '10 days' : '10 gün');

  // 3. ESCO - ISCED State
  const [vetField, setVetField] = useState('automation');
  const [iscedCode, setIscedCode] = useState('0714');
  const [iscedName, setIscedName] = useState('Electronics and automation');
  const [escoTerm, setEscoTerm] = useState(
    'automation technician / mechatronics technician / industrial electrician',
  );
  const [iscoCode, setIscoCode] = useState('3115');
  const [escoUri, setEscoUri] = useState('http://data.europa.eu/esco/occupation/3115');
  const [skills, setSkills] = useState(
    'PLC programlama; endüstriyel otomasyon; robotik; arıza tespiti; kontrol sistemleri; önleyici bakım',
  );

  // 4. Competence Assessment & Gap State
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, number>>({
    1: 4,
    2: 4,
    3: 3,
    4: 5,
    5: 4,
    6: 4,
    7: 4,
    8: 4,
    9: 3,
    10: 4,
    11: 4,
    12: 4,
  });
  const [competenceScore, setCompetenceScore] = useState<number | null>(78);
  const [assessmentResultMsg, setAssessmentResultMsg] = useState<string>(
    'Skor: 78/100 | Hedef: 80 | Yetkinlik Farkı: 2 Puan (Yüksek Hazırlık Seviyesi)',
  );
  const [assessmentResultType, setAssessmentResultType] = useState<'good' | 'warn' | 'bad'>('good');
  const [targetScore, setTargetScore] = useState(80);
  const [externalScore, setExternalScore] = useState('');

  // 5. Decision Engine State
  const [decisionResult, setDecisionResult] = useState<DecisionEngineResult | null>(null);

  // 6. Host Matching State
  const [hostName, setHostName] = useState('Leipzig Vocational Training Center (BSZ 7)');
  const [hostCountry, setHostCountry] = useState(locale === 'en' ? 'Germany' : 'Almanya');
  const [hostType, setHostType] = useState<HostType>('VET school');
  const [hostMetrics, setHostMetrics] = useState<Record<string, number>>({
    h1: 85,
    h2: 80,
    h3: 85,
    h4: 70,
    h5: 75,
    h6: 70,
    h7: 85,
    h8: 80,
    h9: 90,
    h10: 80,
  });
  const [hostScoreResult, setHostScoreResult] = useState<HostScoreResult | null>(null);

  // 7. Learning Outcomes State
  const [primaryGap, setPrimaryGap] = useState('Endüstriyel PLC Programlama & Robotik');
  const [technicalOutcome, setTechnicalOutcome] = useState('');
  const [transversalOutcome, setTransversalOutcome] = useState('');

  // Initial Calculation on Mount
  useEffect(() => {
    handleScoreAssessment();
    handleScoreHost();
    handleGenerateOutcomes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      setAssessmentResultMsg(`Competence4VET Dış Test Skoru Uygulandı: ${s}/100`);
      setAssessmentResultType('good');
    } else {
      alert('Lütfen 0 ile 100 arasında bir skor giriniz.');
    }
  };

  // Handler: Host Score calculation
  const handleScoreHost = () => {
    const res = scoreHost(hostMetrics);
    setHostScoreResult(res);
  };

  // Handler: Make Decision (KA121 vs KA122)
  const handleMakeDecision = () => {
    const currentCompScore = competenceScore ?? scoreAssessment(assessmentAnswers, targetScore).score;
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

  // Handler: Save to LocalStorage
  const handleSaveLocal = () => {
    const payload = {
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
      country,
      duration,
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
      primaryGap,
      technicalOutcome,
      transversalOutcome,
    };

    localStorage.setItem('cappinno_mobility_nexus_data', JSON.stringify(payload));
    alert(`[Kayıt Başarılı] ${t.report.savedAlert}`);
  };

  // Handler: Load from LocalStorage
  const handleLoadLocal = () => {
    const raw = localStorage.getItem('cappinno_mobility_nexus_data');
    if (!raw) {
      alert(`[Uyarı] ${t.report.notFoundAlert}`);
      return;
    }

    try {
      const d = JSON.parse(raw);
      if (d.schoolName) setSchoolName(d.schoolName);
      if (d.city) setCity(d.city);
      if (d.accredited) setAccredited(d.accredited);
      if (d.oid) setOid(d.oid);
      if (d.erasmusPlan) setErasmusPlan(d.erasmusPlan);
      if (d.institutionNeed) setInstitutionNeed(d.institutionNeed);
      if (d.participantType) setParticipantType(d.participantType);
      if (d.mobilityGoal) setMobilityGoal(d.mobilityGoal);
      if (d.participantName) setParticipantName(d.participantName);
      if (d.language !== undefined) setLanguage(d.language);
      if (d.country) setCountry(d.country);
      if (d.duration) setDuration(d.duration);
      if (d.vetField) setVetField(d.vetField);
      if (d.iscedCode) setIscedCode(d.iscedCode);
      if (d.iscedName) setIscedName(d.iscedName);
      if (d.escoTerm) setEscoTerm(d.escoTerm);
      if (d.iscoCode) setIscoCode(d.iscoCode);
      if (d.escoUri) setEscoUri(d.escoUri);
      if (d.skills) setSkills(d.skills);
      if (d.assessmentAnswers) setAssessmentAnswers(d.assessmentAnswers);
      if (d.targetScore !== undefined) setTargetScore(d.targetScore);
      if (d.competenceScore !== undefined) setCompetenceScore(d.competenceScore);
      if (d.hostName) setHostName(d.hostName);
      if (d.hostCountry) setHostCountry(d.hostCountry);
      if (d.hostType) setHostType(d.hostType);
      if (d.hostMetrics) setHostMetrics(d.hostMetrics);
      if (d.primaryGap) setPrimaryGap(d.primaryGap);
      if (d.technicalOutcome) setTechnicalOutcome(d.technicalOutcome);
      if (d.transversalOutcome) setTransversalOutcome(d.transversalOutcome);

      alert(`[Başarılı] ${t.report.loadedAlert}`);
    } catch {
      alert('Kayıtlı veri ayrıştırılırken hata oluştu.');
    }
  };

  // Handler: Export JSON File
  const handleExportJson = () => {
    const payload = {
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
      country,
      duration,
      vetField,
      iscedCode,
      iscedName,
      escoTerm,
      iscoCode,
      escoUri,
      skills,
      assessmentAnswers,
      competenceScore,
      targetScore,
      hostName,
      hostCountry,
      hostType,
      hostMetrics,
      hostScoreResult,
      decisionResult,
      primaryGap,
      technicalOutcome,
      transversalOutcome,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Erasmus_VET_Hareketlilik_Dosyasi_${oid || 'Taslak'}.json`;
    a.click();
    URL.revokeObjectURL(url);
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

      {/* 2. Institutional Stepper Navigation Bar */}
      <div className="border-b border-slate-200 bg-white sticky top-[69px] z-20 shadow-xs no-print">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 py-2">
            {TABS.map((tab, idx) => {
              const isActive = activeTab === tab.id;
              const isPast = idx < currentTabIndex;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`p-2.5 rounded-xl text-left transition-all flex items-center gap-3 ${
                    isActive
                      ? 'bg-blue-50/90 text-blue-950 font-bold border border-blue-200 shadow-xs'
                      : isPast
                        ? 'bg-slate-50 text-slate-800 hover:bg-slate-100/80 border border-transparent'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border border-transparent'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
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
                    <div className="text-xs font-bold truncate">
                      {tab.label}
                    </div>
                    <div className="text-[11px] font-normal text-slate-500 truncate hidden md:block">
                      {tab.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Main Content Container */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 flex-1 w-full space-y-8">
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
                    country,
                    duration,
                  }}
                  onChange={(field, val) => {
                    if (field === 'participantType') setParticipantType(val as ParticipantType);
                    if (field === 'mobilityGoal') setMobilityGoal(val as MobilityGoal);
                    if (field === 'participantName') setParticipantName(val as string);
                    if (field === 'language') setLanguage(val as number);
                    if (field === 'country') setCountry(val as string);
                    if (field === 'duration') setDuration(val as string);
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
                    setAssessmentAnswers((prev) => ({ ...prev, [qId]: val }))
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

        {/* TAB 3: Karar Motoru & Host Eslestirme */}
        {activeTab === 'matching' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <DecisionEngineCard
              decision={decisionResult}
              onMakeDecision={handleMakeDecision}
            />

            <HostMatchingCard
              data={{
                hostName,
                hostCountry,
                hostType,
                hostMetrics,
              }}
              scoreResult={hostScoreResult}
              onChangeHostInfo={(field, val) => {
                if (field === 'hostName') setHostName(val);
                if (field === 'hostCountry') setHostCountry(val);
                if (field === 'hostType') setHostType(val as HostType);
              }}
              onMetricChange={(metricId, val) =>
                setHostMetrics((prev) => ({ ...prev, [metricId]: val }))
              }
              onScoreHost={handleScoreHost}
            />

            <PartnerFindingCard />
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
                duration,
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
            Aşama: <strong className="text-slate-900 font-bold">{currentTabIndex + 1}</strong> / {TABS.length}
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
    </div>
  );
}
