'use client';

import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import { useTranslation } from '@/lib/i18n';
import {
  PrepModule,
  PrepAssignment,
  ParticipantProgressReport,
} from '@mobility-nexus/types';
import { ProgressOverviewBar } from '@/components/preparation/ProgressOverviewBar';
import { MicroLearningCard } from '@/components/preparation/MicroLearningCard';
import { CoordinatorParticipantTable } from '@/components/preparation/CoordinatorParticipantTable';
import { PreparationCertificateModal } from '@/components/preparation/PreparationCertificateModal';
import {
  GraduationCap,
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  Sparkles,
  BookOpen,
  Filter,
  RefreshCw,
  FileCheck2,
  ShieldCheck,
  ChevronDown,
  UserCheck,
} from 'lucide-react';

export default function PreparationPortalPage() {
  const { locale } = useTranslation();

  // Mode switcher: 'LMS' (Student / Participant) vs 'COORDINATOR' (School Coordinator Dashboard)
  const [viewMode, setViewMode] = useState<'LMS' | 'COORDINATOR'>('LMS');

  // Data states
  const [modules, setModules] = useState<PrepModule[]>([]);
  const [assignments, setAssignments] = useState<PrepAssignment[]>([]);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('part-01');
  const [progressReport, setProgressReport] = useState<ParticipantProgressReport | null>(null);

  // Filters & Loading
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Certificate modal
  const [certificateAssignment, setCertificateAssignment] = useState<PrepAssignment | null>(null);

  // 1. Fetch all modules and initial assignments list
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [modulesRes, assignmentsRes] = await Promise.all([
        fetch('/api/preparation/modules'),
        fetch('/api/preparation/participants'),
      ]);

      if (modulesRes.ok) {
        const modData = await modulesRes.json();
        setModules(modData.data || []);
      }

      if (assignmentsRes.ok) {
        const asgData = await assignmentsRes.json();
        setAssignments(asgData.data || []);
      }
    } catch (e) {
      console.error('Error loading preparation initial data:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Fetch specific participant progress
  const loadParticipantProgress = async (id: string) => {
    try {
      const res = await fetch(`/api/preparation/progress/${id}`);
      if (res.ok) {
        const data = await res.json();
        setProgressReport(data.data || null);
      }
    } catch (e) {
      console.error('Error loading participant progress:', e);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedParticipantId) {
      loadParticipantProgress(selectedParticipantId);
    }
  }, [selectedParticipantId]);

  // Handler when participant completes a module test
  const handleCompletedStep = async (moduleId: string, score: number) => {
    if (!progressReport) return;

    try {
      const res = await fetch('/api/preparation/complete-step', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignmentId: progressReport.assignment.id,
          participantId: progressReport.assignment.participantId,
          moduleId,
          quizScore: score,
          timeSpentMinutes: 15,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        // Refresh progress and participants list
        await loadParticipantProgress(progressReport.assignment.participantId);
        const updatedList = await fetch('/api/preparation/participants');
        if (updatedList.ok) {
          const asgData = await updatedList.json();
          setAssignments(asgData.data || []);
        }

        setFeedbackMessage(
          locale === 'tr'
            ? 'Tebrikler! Modül tamamlandı ve hazırlık karnenize işlendi.'
            : 'Congratulations! Module completed and updated in your dossier.'
        );
        setTimeout(() => setFeedbackMessage(null), 4000);

        if (result.data?.isNewlyCompleted) {
          setCertificateAssignment(result.data.assignment);
        }
      }
    } catch (err) {
      console.error('Failed to complete step:', err);
      throw err;
    }
  };

  // Filter modules
  const filteredModules = modules.filter((m) => {
    if (categoryFilter === 'ALL') return true;
    return m.category === categoryFilter;
  });

  // Coordinator KPI calculations
  const totalCount = assignments.length;
  const readyCount = assignments.filter((a) => a.status === 'COMPLETED').length;
  const inProgressCount = assignments.filter((a) => a.status === 'IN_PROGRESS').length;
  const notStartedCount = assignments.filter((a) => a.status === 'NOT_STARTED').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <AppHeader />

      <main className="flex-1 pb-16">
        {/* Top Hero Banner */}
        <section className="bg-slate-900 text-white border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-700 text-white border border-blue-600">
                    Erasmus+ VET Mobility LMS
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    PKG-04
                  </span>
                  <span className="text-xs text-slate-400">
                    {locale === 'tr'
                      ? '10 Resmi Mikro-Öğrenme Modülü'
                      : '10 Official Micro-Learning Modules'}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                  {locale === 'tr'
                    ? 'Katılımcı Seyahat Öncesi Hazırlık Portalı'
                    : 'Participant Mobility Preparation Portal'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
                  {locale === 'tr'
                    ? 'Hareketliliğe katılacak meslek lisesi öğrencilerinin ve öğretmenlerinin seyahat öncesi kültürel uyum, OHS atölye güvenliği, dilsel hazırlık ve yasal haklar mikro-eğitimlerini tamamladığı resmi hazırlık ortamı.'
                    : 'Interactive LMS equipping VET students and accompanying teachers with cultural, linguistic, workshop safety, and legal readiness before their European mobility.'}
                </p>
              </div>

              {/* View Mode Toggle Button */}
              <div className="bg-slate-800/90 p-1.5 rounded-xl border border-slate-700 flex items-center shrink-0 shadow-lg">
                <button
                  type="button"
                  onClick={() => setViewMode('LMS')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'LMS'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>
                    {locale === 'tr' ? 'Katılımcı / Öğrenci LMS' : 'Participant LMS Mode'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('COORDINATOR')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'COORDINATOR'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>
                    {locale === 'tr' ? 'Koordinatör İzleme Masası' : 'Coordinator Dashboard'}
                  </span>
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] font-black flex items-center justify-center">
                    {assignments.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Global Feedback Alert */}
        {feedbackMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMessage}</span>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          {viewMode === 'LMS' ? (
            /* ========================================================================= */
            /* LMS VIEW (STUDENT / PARTICIPANT)                                         */
            /* ========================================================================= */
            <div>
              {/* Persona / Participant Selector Bar */}
              <div className="bg-white border border-slate-200/90 rounded-xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0">
                    <UserCheck className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {locale === 'tr' ? 'Aktif Katılımcı Profili:' : 'Active Participant Profile:'}
                    </div>
                    <div className="text-xs text-slate-700">
                      {locale === 'tr'
                        ? 'Farklı öğrenci ve öğretmen ilerleme durumlarını test etmek için profil seçiniz:'
                        : 'Select participant to simulate different progress states:'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedParticipantId}
                    onChange={(e) => setSelectedParticipantId(e.target.value)}
                    className="px-3 py-2 text-xs font-bold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-blue-600"
                  >
                    {assignments.map((a) => (
                      <option key={a.participantId} value={a.participantId}>
                        {a.participantName} ({a.completionPercentage}% - {a.destinationCountry})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Progress Overview Bar */}
              {progressReport && (
                <ProgressOverviewBar
                  progressReport={progressReport}
                  onOpenCertificate={() => setCertificateAssignment(progressReport.assignment)}
                />
              )}

              {/* Category Filter Tabs */}
              <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {[
                    { id: 'ALL', labelTr: 'Tüm Modüller (10)', labelEn: 'All Modules (10)' },
                    { id: 'OHS_SAFETY', labelTr: 'İş Sağlığı (İSG)', labelEn: 'Safety (OHS)' },
                    { id: 'LANGUAGE_PREP', labelTr: 'Dil (OLS)', labelEn: 'Language (OLS)' },
                    { id: 'CULTURAL_ADAPTATION', labelTr: 'Kültür & Yaşam', labelEn: 'Culture & Life' },
                    { id: 'TRAVEL_LOGISTICS', labelTr: 'Seyahat & Pasaport', labelEn: 'Travel & Logistics' },
                    { id: 'ERASMUS_RIGHTS', labelTr: 'Haklar & Taahhüt', labelEn: 'Charter Rights' },
                    { id: 'ESCO_LEARNING', labelTr: 'Europass & ESCO', labelEn: 'Europass & ESCO' },
                    { id: 'GREEN_DIGITAL', labelTr: 'Yeşil & Dijital', labelEn: 'Green & Digital' },
                    { id: 'CRISIS_INSURANCE', labelTr: 'Kriz & Sigorta 112', labelEn: 'Crisis & 112' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategoryFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                        categoryFilter === tab.id
                          ? 'bg-blue-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {locale === 'tr' ? tab.labelTr : tab.labelEn}
                    </button>
                  ))}
                </div>

                <div className="text-xs text-slate-500 font-medium">
                  {locale === 'tr'
                    ? `${filteredModules.length} modül listeleniyor`
                    : `Showing ${filteredModules.length} modules`}
                </div>
              </div>

              {/* Modules Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredModules.map((mod) => {
                  const completion = progressReport?.completions.find(
                    (c) => c.moduleId === mod.id
                  );
                  return (
                    <MicroLearningCard
                      key={mod.id}
                      module={mod}
                      completion={completion}
                      participantId={progressReport?.assignment.participantId || selectedParticipantId}
                      assignmentId={progressReport?.assignment.id || 'asg-01'}
                      onCompletedStep={handleCompletedStep}
                    />
                  );
                })}
              </div>

              {/* Badges Section */}
              {progressReport && progressReport.badges.length > 0 && (
                <div className="mt-12 bg-white rounded-xl border border-slate-200/90 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <Award className="w-5 h-5 text-amber-500" />
                        <span>
                          {locale === 'tr'
                            ? `Kazanılan Yetkinlik Rozetleri (${progressReport.badges.length})`
                            : `Earned Competence Badges (${progressReport.badges.length})`}
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        {locale === 'tr'
                          ? 'Tamamlanan her modül ile resmi Erasmus+ hazırlık profilinize eklenen rozetler.'
                          : 'Badges accredited to your Erasmus+ mobility dossier upon module mastery.'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {progressReport.badges.map((b, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3 text-center flex flex-col items-center justify-center hover:scale-105 transition-transform"
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-1.5 shadow-xs">
                          <Sparkles className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="text-xs font-bold text-slate-900 line-clamp-1">
                          {b.badgeName}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                          {locale === 'tr' ? b.titleTr : b.titleEn}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================================= */
            /* COORDINATOR VIEW (SCHOOL MONITORING DASHBOARD)                            */
            /* ========================================================================= */
            <div className="space-y-6">
              {/* Coordinator KPI Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {locale === 'tr' ? 'Toplam Katılımcı' : 'Total Participants'}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-slate-900 mt-2">{totalCount}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {locale === 'tr' ? 'Mesleki Eğitim & Personel' : 'VET Students & Staff'}
                  </div>
                </div>

                {/* Ready */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {locale === 'tr' ? 'Seyahate Hazır' : 'Ready for Mobility'}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-emerald-700 mt-2">{readyCount}</div>
                  <div className="text-xs text-emerald-600 font-semibold mt-1">
                    {totalCount > 0
                      ? `%${Math.round((readyCount / totalCount) * 100)} ${
                          locale === 'tr' ? 'Hazırlık Oranı' : 'Readiness Rate'
                        }`
                      : '-'}
                  </div>
                </div>

                {/* In progress */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {locale === 'tr' ? 'Eğitimi Sürenler' : 'In Progress'}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-blue-900 mt-2">{inProgressCount}</div>
                  <div className="text-xs text-slate-500 mt-1">
                    {locale === 'tr' ? 'Modül adımları devam ediyor' : 'Completing module steps'}
                  </div>
                </div>

                {/* Not started */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {locale === 'tr' ? 'Başlamayanlar' : 'Not Started'}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-black text-amber-800 mt-2">{notStartedCount}</div>
                  <div className="text-xs text-amber-700 font-medium mt-1">
                    {locale === 'tr' ? 'Hatırlatma gönderilebilir' : 'Reminder can be sent'}
                  </div>
                </div>
              </div>

              {/* Coordinator Table Component */}
              <CoordinatorParticipantTable
                assignments={assignments}
                onSelectParticipant={(partId) => {
                  setSelectedParticipantId(partId);
                  setViewMode('LMS');
                }}
                onOpenCertificate={(asg) => setCertificateAssignment(asg)}
              />
            </div>
          )}
        </div>
      </main>

      {/* Official Certificate Modal */}
      {certificateAssignment && (
        <PreparationCertificateModal
          assignment={certificateAssignment}
          onClose={() => setCertificateAssignment(null)}
        />
      )}

      <AppFooter />
    </div>
  );
}
