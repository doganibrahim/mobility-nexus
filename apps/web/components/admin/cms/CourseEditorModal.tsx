'use client';

import React, { useState, useEffect } from 'react';
import { Course, CourseSession, CourseLearningOutcome } from '@mobility-nexus/types';
import {
  X,
  Save,
  Trash2,
  AlertCircle,
  CheckCircle,
  Edit3,
  Calendar,
  Plus,
  BookOpen,
  Layers,
  MapPin,
  Clock,
  Sparkles,
} from 'lucide-react';

interface CourseEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSuccess: () => void;
}

export function CourseEditorModal({
  isOpen,
  onClose,
  course,
  onSuccess,
}: CourseEditorModalProps) {
  if (!isOpen || !course) return null;

  const [activeTab, setActiveTab] = useState<'BASIC' | 'OUTCOMES' | 'SESSIONS'>('BASIC');

  // Form Basic Info
  const [titleTr, setTitleTr] = useState(course.titleTr || '');
  const [titleEn, setTitleEn] = useState(course.titleEn || '');
  const [descriptionTr, setDescriptionTr] = useState(course.descriptionTr || '');
  const [descriptionEn, setDescriptionEn] = useState(course.descriptionEn || '');
  const [hostName, setHostName] = useState(course.hostName || '');
  const [hostCity, setHostCity] = useState(course.hostCity || '');
  const [hostCountry, setHostCountry] = useState(course.hostCountry || '');
  const [dailyFeeEur, setDailyFeeEur] = useState(course.dailyFeeEur || 80);
  const [durationDays, setDurationDays] = useState(course.durationDays || 5);
  const [language, setLanguage] = useState(course.language || 'English');
  const [iscedName, setIscedName] = useState(course.iscedName || '');
  const [iscedCode, setIscedCode] = useState(course.iscedCode || '');
  const [isPublished, setIsPublished] = useState(course.isPublished ?? true);
  const [tagsInput, setTagsInput] = useState((course.tags || []).join(', '));

  // Outcomes state
  const [outcomes, setOutcomes] = useState<Array<{ outcomeTr: string; outcomeEn: string }>>(
    (course.learningOutcomes || []).map((o) => ({
      outcomeTr: o.outcomeTr,
      outcomeEn: o.outcomeEn,
    }))
  );
  const [newOutcomeTr, setNewOutcomeTr] = useState('');
  const [newOutcomeEn, setNewOutcomeEn] = useState('');

  // Sessions state
  const [sessions, setSessions] = useState<CourseSession[]>(course.sessions || []);
  const [newSessionStartDate, setNewSessionStartDate] = useState('');
  const [newSessionEndDate, setNewSessionEndDate] = useState('');
  const [newSessionCity, setNewSessionCity] = useState(course.hostCity || '');
  const [newSessionCountry, setNewSessionCountry] = useState(course.hostCountry || '');
  const [newSessionCapacity, setNewSessionCapacity] = useState(15);
  const [isAddingSession, setIsAddingSession] = useState(false);

  // Status & Submit
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (course) {
      setTitleTr(course.titleTr || '');
      setTitleEn(course.titleEn || '');
      setDescriptionTr(course.descriptionTr || '');
      setDescriptionEn(course.descriptionEn || '');
      setHostName(course.hostName || '');
      setHostCity(course.hostCity || '');
      setHostCountry(course.hostCountry || '');
      setDailyFeeEur(course.dailyFeeEur || 80);
      setDurationDays(course.durationDays || 5);
      setLanguage(course.language || 'English');
      setIscedName(course.iscedName || '');
      setIscedCode(course.iscedCode || '');
      setIsPublished(course.isPublished ?? true);
      setTagsInput((course.tags || []).join(', '));
      setOutcomes(
        (course.learningOutcomes || []).map((o) => ({
          outcomeTr: o.outcomeTr,
          outcomeEn: o.outcomeEn,
        }))
      );
      setSessions(course.sessions || []);
      setNewSessionCity(course.hostCity || '');
      setNewSessionCountry(course.hostCountry || '');
      setErrorMsg(null);
      setSuccessMsg(null);
      setActiveTab('BASIC');
    }
  }, [course]);

  const handleAddOutcome = () => {
    if (!newOutcomeTr.trim()) return;
    setOutcomes((prev) => [
      ...prev,
      {
        outcomeTr: newOutcomeTr.trim(),
        outcomeEn: newOutcomeEn.trim() || newOutcomeTr.trim(),
      },
    ]);
    setNewOutcomeTr('');
    setNewOutcomeEn('');
  };

  const handleRemoveOutcome = (idx: number) => {
    setOutcomes((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSessionStartDate || !newSessionEndDate || !newSessionCity || !newSessionCountry) {
      setErrorMsg('Tüm seans alanları zorunludur.');
      return;
    }

    setIsAddingSession(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/marketplace/host/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          startDate: newSessionStartDate,
          endDate: newSessionEndDate,
          city: newSessionCity,
          country: newSessionCountry,
          capacity: Number(newSessionCapacity),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || data.error || 'Seans oluşturulamadı.');
      }

      setSessions((prev) => [...prev, data.session]);
      setNewSessionStartDate('');
      setNewSessionEndDate('');
      setSuccessMsg('Yeni kurs seansı başarıyla eklendi.');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Seans eklenirken hata oluştu.');
    } finally {
      setIsAddingSession(false);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    if (!window.confirm('Bu oturumu silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/admin/courses/sessions/${sessionId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Oturum silinemedi.');
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setSuccessMsg('Oturum başarıyla kaldırıldı.');
      onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Oturum silinirken hata oluştu.');
    }
  };

  const handleToggleSessionStatus = async (session: CourseSession) => {
    const nextStatus = session.status === 'OPEN' ? 'FULL' : 'OPEN';
    try {
      const res = await fetch(`/api/admin/courses/sessions/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSessions((prev) =>
          prev.map((s) => (s.id === session.id ? { ...s, status: nextStatus } : s))
        );
        onSuccess();
      }
    } catch (e) {
      console.error('Error toggling status:', e);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          titleTr,
          titleEn,
          descriptionTr,
          descriptionEn,
          hostName,
          hostCity,
          hostCountry,
          dailyFeeEur: Number(dailyFeeEur),
          durationDays: Number(durationDays),
          language,
          iscedName,
          iscedCode,
          isPublished: Boolean(isPublished),
          tags,
          learningOutcomesTr: outcomes.map((o) => o.outcomeTr),
          learningOutcomesEn: outcomes.map((o) => o.outcomeEn),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kurs güncellenirken bir hata oluştu.');
      }

      setSuccessMsg('Kurs ve öğrenme çıktıları başarıyla güncellendi.');
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMsg(err.message || 'Hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (
      !window.confirm(
        `"${course.titleTr}" kursunu ve tüm bağlı oturumlarını kalıcı olarak silmek istediğinize emin misiniz?`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Silme işlemi başarısız oldu.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Silinirken hata oluştu.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-editor-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h2 id="course-editor-title" className="text-sm font-bold m-0">
                Kurs Yönetimi & Müfredat Düzenleyici
              </h2>
              <p className="text-[11px] text-slate-400 m-0">ID: {course.id}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Pencereyi kapat"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 bg-slate-100 border-b border-slate-200">
          <button
            type="button"
            onClick={() => setActiveTab('BASIC')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'BASIC'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Temel Bilgiler & Fiyat
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('OUTCOMES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'OUTCOMES'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Öğrenme Çıktıları ({outcomes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('SESSIONS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'SESSIONS'
                ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Oturumlar & Kontenjan ({sessions.length})
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
              <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between font-bold">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
              <button onClick={() => setSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'BASIC' && (
            <form id="course-basic-form" onSubmit={handleSaveCourse} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kurs Başlığı (TR) *</label>
                  <input
                    type="text"
                    required
                    value={titleTr}
                    onChange={(e) => setTitleTr(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kurs Başlığı (EN) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ev Sahibi Kurum (Host)</label>
                  <input
                    type="text"
                    value={hostName}
                    onChange={(e) => setHostName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Şehir</label>
                  <input
                    type="text"
                    value={hostCity}
                    onChange={(e) => setHostCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ülke</label>
                  <input
                    type="text"
                    value={hostCountry}
                    onChange={(e) => setHostCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıklama (TR)</label>
                <textarea
                  rows={3}
                  value={descriptionTr}
                  onChange={(e) => setDescriptionTr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Açıklama (EN)</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Günlük Kurs Hibesi (€)</label>
                  <input
                    type="number"
                    min={0}
                    value={dailyFeeEur}
                    onChange={(e) => setDailyFeeEur(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Süre (Gün)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Eğitim Dili</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Yayın Durumu</label>
                  <select
                    value={isPublished ? 'PUBLISHED' : 'DRAFT'}
                    onChange={(e) => setIsPublished(e.target.value === 'PUBLISHED')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white font-bold"
                  >
                    <option value="PUBLISHED">Yayında (Aktif)</option>
                    <option value="DRAFT">Taslak / Gizli</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ISCED Meslek Alanı</label>
                  <input
                    type="text"
                    value={iscedName}
                    onChange={(e) => setIscedName(e.target.value)}
                    placeholder="Örn: Bilişim ve İletişim Teknolojileri"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Etiketler (Virgülle)</label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Siber Güvenlik, Bulut, AI"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
            </form>
          )}

          {/* TAB 2: LEARNING OUTCOMES */}
          {activeTab === 'OUTCOMES' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 leading-relaxed text-xs">
                Avrupa Komisyonu ESCO ve ECVET ilkeleri gereği kursun kazandıracağı somut mesleki öğrenme çıktılarını ekleyin.
              </div>

              {/* Add Outcome Form */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-blue-600" />
                  <span>Yeni Öğrenme Çıktısı Ekle</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={newOutcomeTr}
                    onChange={(e) => setNewOutcomeTr(e.target.value)}
                    placeholder="Çıktı açıklaması (TR) *"
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                  <input
                    type="text"
                    value={newOutcomeEn}
                    onChange={(e) => setNewOutcomeEn(e.target.value)}
                    placeholder="Learning outcome (EN)"
                    className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddOutcome}
                    className="px-3 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    Listeye Ekle
                  </button>
                </div>
              </div>

              {/* Outcomes List */}
              <div className="space-y-2">
                {outcomes.length === 0 ? (
                  <div className="py-6 text-center text-slate-400">Henüz öğrenme çıktısı eklenmedi.</div>
                ) : (
                  outcomes.map((o, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3"
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-800">
                          {idx + 1}. {o.outcomeTr}
                        </div>
                        {o.outcomeEn && (
                          <div className="text-[11px] text-slate-500 italic">{o.outcomeEn}</div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveOutcome(idx)}
                        className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: SESSIONS */}
          {activeTab === 'SESSIONS' && (
            <div className="space-y-4">
              {/* New Session Inline Form */}
              <form onSubmit={handleCreateSession} className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-3">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-blue-700" />
                  <span>Yeni Seans / Oturum Takvimi Tanımla</span>
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Başlangıç Tarihi *</label>
                    <input
                      type="date"
                      required
                      value={newSessionStartDate}
                      onChange={(e) => setNewSessionStartDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Bitiş Tarihi *</label>
                    <input
                      type="date"
                      required
                      value={newSessionEndDate}
                      onChange={(e) => setNewSessionEndDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Şehir & Ülke</label>
                    <input
                      type="text"
                      required
                      value={`${newSessionCity}, ${newSessionCountry}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(',');
                        setNewSessionCity(parts[0]?.trim() || '');
                        if (parts[1]) setNewSessionCountry(parts[1]?.trim());
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Kontenjan</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={newSessionCapacity}
                      onChange={(e) => setNewSessionCapacity(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isAddingSession}
                    className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingSession ? 'Ekleniyor...' : 'Seansı Kaydet'}</span>
                  </button>
                </div>
              </form>

              {/* Sessions List */}
              <div className="space-y-2">
                {sessions.length === 0 ? (
                  <div className="py-6 text-center text-slate-400">Bu kurs için henüz aktif bir seans tanımlanmamış.</div>
                ) : (
                  sessions.map((ses) => (
                    <div
                      key={ses.id}
                      className="p-3.5 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-xs text-slate-900">
                            🗓️ {ses.startDate} / {ses.endDate}
                          </span>
                          <span className="text-xs text-slate-500">📍 {ses.city}, {ses.country}</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ses.status === 'OPEN'
                                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                          >
                            {ses.status === 'OPEN' ? 'Açık' : 'Dolu / Kapalı'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Kontenjan: {ses.enrolledCount || 0} / {ses.capacity} Katılımcı
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => handleToggleSessionStatus(ses)}
                          className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                        >
                          {ses.status === 'OPEN' ? 'Kontenjanı Kapat' : 'Yeniden Aç'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteSession(ses.id)}
                          className="p-1 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                          title="Seansı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={isDeleting}
            onClick={handleDeleteCourse}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 font-bold transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? 'Siliniyor...' : 'Kursu Kaldır'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-200/60 font-bold transition-colors cursor-pointer"
            >
              Kapat
            </button>
            <button
              type="button"
              onClick={handleSaveCourse}
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold transition-colors shadow-xs cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
