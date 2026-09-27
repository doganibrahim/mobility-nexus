'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import {
  SchoolCoordinationRecord,
  SchoolCoordinationStatusType,
  SchoolGuidanceRecommendation,
} from '@mobility-nexus/types';
import { SchoolReadinessCard } from '@/components/coordination/SchoolReadinessCard';
import { NeedRadarChart } from '@/components/coordination/NeedRadarChart';
import { MobilityGuidanceBadge } from '@/components/coordination/MobilityGuidanceBadge';
import {
  Users,
  Compass,
  Search,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Calendar,
  MessageSquare,
  X,
  Plus,
  Sparkles,
  ArrowRight,
  MapPin,
  Building2,
  FileText,
  Clock,
  ExternalLink,
} from 'lucide-react';

export default function SchoolCoordinationPage() {
  const [schools, setSchools] = useState<SchoolCoordinationRecord[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Selected school for S1-S8 Radar detail modal
  const [selectedSchool, setSelectedSchool] = useState<SchoolCoordinationRecord | null>(null);
  const [guidance, setGuidance] = useState<SchoolGuidanceRecommendation | null>(null);
  const [isGuidanceLoading, setIsGuidanceLoading] = useState(false);

  // Note Modal state
  const [noteModalSchool, setNoteModalSchool] = useState<SchoolCoordinationRecord | null>(null);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [activityType, setActivityType] = useState<
    'PHONE_CALL' | 'ONLINE_MEETING' | 'NOTE' | 'CONSORTIUM_ASSIGNMENT' | 'STATUS_CHANGE'
  >('PHONE_CALL');
  const [newStatus, setNewStatus] = useState<SchoolCoordinationStatusType>('IN_REVIEW');
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const fetchSchools = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (searchQuery.trim()) params.set('search', searchQuery.trim());

      const res = await fetch(`/api/admin/coordination/schools?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSchools(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching schools:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, [statusFilter]);

  // Load guidance recommendation when a school is selected
  useEffect(() => {
    if (!selectedSchool) {
      setGuidance(null);
      return;
    }
    const loadGuidance = async () => {
      setIsGuidanceLoading(true);
      try {
        const res = await fetch(`/api/admin/coordination/guidance/${selectedSchool.schoolId}`);
        if (res.ok) {
          const data = await res.json();
          setGuidance(data.data || null);
        }
      } catch (e) {
        console.error('Error loading guidance:', e);
      } finally {
        setIsGuidanceLoading(false);
      }
    };
    loadGuidance();
  }, [selectedSchool]);

  const handleOpenNoteModal = (school: SchoolCoordinationRecord) => {
    setNoteModalSchool(school);
    setNoteTitle('');
    setNoteContent('');
    setActivityType('PHONE_CALL');
    setNewStatus(school.status);
    setFollowUpDate('');
  };

  const handleSubmitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteModalSchool || !noteTitle.trim() || !noteContent.trim()) return;

    setIsSubmittingNote(true);
    try {
      const res = await fetch(`/api/admin/coordination/inquiries/${noteModalSchool.schoolId}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: noteModalSchool.schoolId,
          activityType,
          title: noteTitle,
          content: noteContent,
          newStatus,
          followUpDate: followUpDate || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setFeedbackMsg(`"${noteModalSchool.schoolName}" için görüşme notu ve süreç güncellendi.`);
        setNoteModalSchool(null);
        await fetchSchools();
        if (selectedSchool && selectedSchool.schoolId === noteModalSchool.schoolId) {
          const updated = schools.find((s) => s.schoolId === noteModalSchool.schoolId);
          if (updated) setSelectedSchool(updated);
        }
      } else {
        alert(data.error || 'Not kaydedilemedi.');
      }
    } catch (err: any) {
      console.error('Error submitting note:', err);
      alert('Görüşme notu kaydedilirken hata oluştu.');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Metrics
  const totalSchools = schools.length;
  const inReviewCount = schools.filter((s) => s.status === 'IN_REVIEW').length;
  const meetingCount = schools.filter((s) => s.status === 'MEETING_SCHEDULED').length;
  const matchedCount = schools.filter((s) => s.status === 'CONSORTIUM_MATCHED').length;
  const avgReadiness =
    totalSchools > 0
      ? Math.round(
          schools.reduce((acc, s) => acc + (s.needAssessment?.overallReadinessScore || 0), 0) /
            totalSchools
        )
      : 0;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-150">
      <AppHeader />

      {/* Breadcrumb */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>Ana Sayfa</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/admin/content-manager"
              className="hover:text-blue-700 font-medium transition-colors"
            >
              Admin
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              Okul Destek & İhtiyaç Koordinasyon Masası
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>İlk Yıl 100% Ücretsiz Model</span>
            </span>
            <span>•</span>
            <span className="font-bold text-blue-700">PKG-03 AKTİF</span>
          </div>
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full space-y-6 focus:outline-hidden">
        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer">
              Kapat
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
              <Compass className="w-3.5 h-3.5" />
              <span>Koordinasyon & Karar Destek Masası</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>S1-S8 Kurumsal İhtiyaç Analizi</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200 font-mono">
              0 TL / Tamamen Ücretsiz Hizmet
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
                Okul Destek ve Süreç Takip Paneli
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl m-0 leading-relaxed">
                Sisteme kayıt olan mesleki ve teknik liselerin 8 temel boyuttaki eksikliklerini radar grafikte inceleyin, randevu taleplerini koordine edin ve akreditasyon durumuna göre doğru konsorsiyuma yönlendirin.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/admin/content-manager"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <span>İçerik CMS Konsoluna Git</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200">
              <div className="text-[11px] font-bold text-blue-900">Kayıtlı Okullar</div>
              <div className="text-xl font-black text-blue-950">{totalSchools}</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
              <div className="text-[11px] font-bold text-amber-900">İncelenen Talepler</div>
              <div className="text-xl font-black text-amber-950">{inReviewCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200">
              <div className="text-[11px] font-bold text-purple-900">Planlanan Randevular</div>
              <div className="text-xl font-black text-purple-950">{meetingCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-900">Konsorsiyuma Bağlanan</div>
              <div className="text-xl font-black text-emerald-950">{matchedCount}</div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold text-indigo-900">Ortalama Hazırlık</div>
              <div className="text-xl font-black text-indigo-950">%{avgReadiness}</div>
            </div>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'ALL', label: 'Tüm Okullar' },
              { id: 'NEW_REGISTRATION', label: 'Yeni Kayıt' },
              { id: 'IN_REVIEW', label: 'İnceleniyor' },
              { id: 'MEETING_SCHEDULED', label: 'Randevu Planlandı' },
              { id: 'CONSORTIUM_MATCHED', label: 'Konsorsiyumda' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-blue-700 text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchSchools();
            }}
            className="flex items-center gap-2"
          >
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Okul adı, şehir, OID ara..."
                className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-blue-600 w-52 sm:w-64"
              />
            </div>
            <button
              type="submit"
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Ara"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Schools List */}
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Okul kayıtları yükleniyor...</div>
        ) : schools.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            Arama kriterine uygun okul kaydı bulunamadı.
          </div>
        ) : (
          <div className="space-y-3">
            {schools.map((school) => (
              <SchoolReadinessCard
                key={school.id}
                school={school}
                onSelect={(s) => setSelectedSchool(s)}
                onAddNote={(s) => handleOpenNoteModal(s)}
              />
            ))}
          </div>
        )}
      </main>

      {/* S1-S8 Radar & School Need Detail Modal */}
      {selectedSchool && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold m-0">{selectedSchool.schoolName}</h2>
                  <p className="text-[11px] text-slate-400 m-0">
                    OID: {selectedSchool.schoolOid || '—'} • {selectedSchool.schoolCity || 'Belirtilmemiş'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSchool(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
              {/* Radar Chart & S1-S8 Assessment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      <span>S1-S8 Kurumsal İhtiyaç Radarı</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-bold text-[10px]">
                      Hazırlık Skoru: %{selectedSchool.needAssessment.overallReadinessScore}
                    </span>
                  </div>
                  <NeedRadarChart scores={selectedSchool.needAssessment} size={300} />
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>İhtiyaç ve Kapasite Özeti</span>
                    </span>
                    <p className="text-slate-600 leading-relaxed m-0 text-xs">
                      {selectedSchool.needAssessment.evaluationSummary}
                    </p>
                  </div>

                  {/* Automated Guidance Box */}
                  <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Compass className="w-4 h-4 text-blue-700" />
                        <span>Otomatik Hareketlilik & Konsorsiyum Rehberliği</span>
                      </span>
                      <MobilityGuidanceBadge
                        path={selectedSchool.needAssessment.recommendedPath}
                        size="sm"
                      />
                    </div>

                    {isGuidanceLoading ? (
                      <div className="text-slate-400 py-3">Rehberlik analizi hesaplanıyor...</div>
                    ) : guidance ? (
                      <div className="space-y-2 text-xs">
                        <div className="font-bold text-slate-800">
                          {guidance.primaryActionTitle}
                        </div>
                        <ul className="space-y-1 list-disc pl-4 text-slate-600">
                          {guidance.guidanceNotes.map((note, idx) => (
                            <li key={idx}>{note}</li>
                          ))}
                        </ul>

                        <div className="pt-2 border-t border-blue-200/80 space-y-1.5">
                          <span className="font-bold text-slate-800 text-[11px]">
                            Eşleşen Uygun Ev Sahibi (Host) Merkezleri:
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {guidance.recommendedHosts.map((h, i) => (
                              <div
                                key={i}
                                className="p-2 rounded-lg bg-white border border-blue-100 text-[11px]"
                              >
                                <div className="font-bold text-blue-950">{h.country}</div>
                                <div className="text-slate-500">{h.field}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Activity History & Call Notes */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-indigo-600" />
                    <span>Koordinasyon ve İletişim Geçmişi</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenNoteModal(selectedSchool)}
                    className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Yeni Not Ekle</span>
                  </button>
                </div>

                {selectedSchool.recentActivities.length === 0 ? (
                  <div className="py-4 text-center text-slate-400 bg-slate-50 rounded-xl">
                    Henüz kayıtlı bir görüşme veya koordinasyon notu yok.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedSchool.recentActivities.map((act) => (
                      <div
                        key={act.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                      >
                        <div className="space-y-0.5">
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{act.title}</span>
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-mono">
                              {act.activityType}
                            </span>
                          </div>
                          <p className="text-slate-600 m-0 text-xs">{act.content}</p>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono shrink-0 self-end sm:self-center">
                          {new Date(act.createdAt).toLocaleString('tr-TR')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-slate-500 text-xs">
                Temsilci: <strong className="text-slate-800">{selectedSchool.assignedCoordinatorName}</strong>
              </span>
              <button
                type="button"
                onClick={() => setSelectedSchool(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Coordinator Add Note Modal */}
      {noteModalSchool && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-sm font-bold m-0">Görüşme Notu ve Süreç Güncellemesi</h3>
                  <p className="text-[11px] text-slate-400 m-0">{noteModalSchool.schoolName}</p>
                </div>
              </div>
              <button
                onClick={() => setNoteModalSchool(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitNote} className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">İletişim Türü *</label>
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-medium"
                  >
                    <option value="PHONE_CALL">Telefon Görüşmesi</option>
                    <option value="ONLINE_MEETING">Çevrim İçi Toplantı</option>
                    <option value="CONSORTIUM_ASSIGNMENT">Konsorsiyum Eşleşmesi</option>
                    <option value="NOTE">İç Not / İnceleme</option>
                    <option value="STATUS_CHANGE">Aşama Değişikliği</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Yeni Süreç Durumu *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="NEW_REGISTRATION">Yeni Kayıt</option>
                    <option value="IN_REVIEW">İnceleniyor</option>
                    <option value="MEETING_SCHEDULED">Randevu Planlandı</option>
                    <option value="CONSORTIUM_MATCHED">Konsorsiyuma Bağlandı</option>
                    <option value="APPLICATION_READY">Başvuru Hazır</option>
                    <option value="MOBILITY_ACTIVE">Hareketlilik Aktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Görüşme Konusu / Başlık *</label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Örn: 2026 KA121 Bütçe Dağılımı ve Almanya Stajı Görüşmesi"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Görüşme Notu / Eylem Detayı *</label>
                <textarea
                  rows={4}
                  required
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Okul koordinatörü ile yapılan görüşmenin özeti, talep edilen katılımcı sayıları ve bir sonraki adım..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Takip / Hatırlatma Tarihi (İsteğe Bağlı)</label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                />
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNoteModalSchool(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingNote}
                  className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isSubmittingNote ? 'Kaydediliyor...' : 'Notu Kaydet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AppFooter />
    </div>
  );
}
