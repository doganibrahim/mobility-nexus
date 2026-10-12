'use client';

import React, { useState } from 'react';
import { AdminCreateCourseWithSessionsDto } from '@mobility-nexus/types';
import { useTranslation } from '@/lib/i18n';
import { X, Plus, BookOpen, AlertCircle, CheckCircle, Calendar, Sparkles } from 'lucide-react';

interface AdminCreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AdminCreateCourseModal({
  isOpen,
  onClose,
  onSuccess,
}: AdminCreateCourseModalProps) {
  const { locale } = useTranslation();
  if (!isOpen) return null;

  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [hostName, setHostName] = useState('CAPPINNO European Mobility Consortium');
  const [hostCountry, setHostCountry] = useState(locale === 'tr' ? 'Almanya' : 'Germany');
  const [hostCity, setHostCity] = useState('Berlin');
  const [hostOid, setHostOid] = useState('E10009988');
  const [iscedCode, setIscedCode] = useState('0714');
  const [iscedName, setIscedName] = useState(locale === 'tr' ? 'Elektronik ve Otomasyon' : 'Electronics and Automation');
  const [durationDays, setDurationDays] = useState(5);
  const [dailyFeeEur, setDailyFeeEur] = useState(80);
  const [language, setLanguage] = useState('English');
  const [minLanguageLevel, setMinLanguageLevel] = useState<'A2' | 'B1' | 'B2' | 'C1'>('B1');
  const [tagsInput, setTagsInput] = useState(locale === 'tr' ? 'Erasmus+, Mesleki Eğitim, İnovasyon' : 'Erasmus+, VET, Innovation');

  // Initial session dates
  const [sessionStartDate, setSessionStartDate] = useState('');
  const [sessionEndDate, setSessionEndDate] = useState('');
  const [sessionCapacity, setSessionCapacity] = useState(15);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: AdminCreateCourseWithSessionsDto = {
      hostId: 'admin-cappinno',
      hostName,
      hostCountry,
      hostCity,
      hostOid,
      titleTr,
      titleEn,
      descriptionTr,
      descriptionEn: descriptionEn || titleEn,
      iscedCode,
      iscedName,
      durationDays: Number(durationDays),
      dailyFeeEur: Number(dailyFeeEur),
      language,
      minLanguageLevel,
      tags,
      sessions:
        sessionStartDate && sessionEndDate
          ? [
              {
                startDate: sessionStartDate,
                endDate: sessionEndDate,
                city: hostCity,
                country: hostCountry,
                capacity: Number(sessionCapacity),
              },
            ]
          : [],
    };

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Kurs oluşturulurken bir hata oluştu.');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-600/30 text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold m-0">
                {locale === 'tr' ? 'Yeni Kurs ve Seans Tanımlama' : 'Define New Course & Session'}
              </h2>
              <p className="text-[11px] text-slate-400 m-0">
                {locale === 'tr' ? 'Platform Admin Yetkili Yayın' : 'Platform Admin Authorized Publishing'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Kurs Başlığı (TR) *' : 'Course Title (TR) *'}
              </label>
              <input
                type="text"
                required
                value={titleTr}
                onChange={(e) => setTitleTr(e.target.value)}
                placeholder={locale === 'tr' ? 'Örn: Siber Güvenlik ve Ağ Savunması' : 'e.g. Siber Guvenlik'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Kurs Başlığı (EN) *' : 'Course Title (EN) *'}
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="e.g. Cybersecurity & Network Defense"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Ev Sahibi (Host) Kurum *' : 'Host Organisation *'}
              </label>
              <input
                type="text"
                required
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Şehir *' : 'City *'}
              </label>
              <input
                type="text"
                required
                value={hostCity}
                onChange={(e) => setHostCity(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Ülke *' : 'Country *'}
              </label>
              <input
                type="text"
                required
                value={hostCountry}
                onChange={(e) => setHostCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              {locale === 'tr' ? 'Açıklama (TR) *' : 'Description (TR) *'}
            </label>
            <textarea
              rows={3}
              required
              value={descriptionTr}
              onChange={(e) => setDescriptionTr(e.target.value)}
              placeholder={
                locale === 'tr'
                  ? 'Kurs müfredatı, kazanımları ve katılımcı profili hakkında özet bilgi...'
                  : 'Summary of syllabus, outcomes and participant requirements...'
              }
              className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Günlük Hibe (€/gün)' : 'Daily Fee (€/day)'}
              </label>
              <input
                type="number"
                min={0}
                value={dailyFeeEur}
                onChange={(e) => setDailyFeeEur(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Süre (Gün)' : 'Duration (Days)'}
              </label>
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
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Eğitim Dili' : 'Language'}
              </label>
              <input
                type="text"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Min. Dil Seviyesi' : 'Min. Level'}
              </label>
              <select
                value={minLanguageLevel}
                onChange={(e) => setMinLanguageLevel(e.target.value as any)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
              >
                <option value="A2">A2</option>
                <option value="B1">{locale === 'tr' ? 'B1 (Önerilen)' : 'B1 (Recommended)'}</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'ISCED Kodu & Alan Adı *' : 'ISCED Code & Field *'}
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={iscedCode}
                  onChange={(e) => setIscedCode(e.target.value)}
                  placeholder="0714"
                  className="w-24 px-3 py-2 rounded-lg border border-slate-300 font-mono"
                />
                <input
                  type="text"
                  value={iscedName}
                  onChange={(e) => setIscedName(e.target.value)}
                  placeholder={locale === 'tr' ? 'Elektronik ve Otomasyon' : 'Electronics and Automation'}
                  className="flex-1 px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                {locale === 'tr' ? 'Etiketler (Virgülle ayırın)' : 'Tags (Comma separated)'}
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300"
              />
            </div>
          </div>

          {/* First Session (Optional but recommended) */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-2">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-blue-700" />
              <span>
                {locale === 'tr'
                  ? 'İlk Kurs Seansı Tanımı (İsteğe Bağlı)'
                  : 'Initial Session Calendar (Optional)'}
              </span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Başlangıç' : 'Start Date'}
                </label>
                <input
                  type="date"
                  value={sessionStartDate}
                  onChange={(e) => setSessionStartDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Bitiş' : 'End Date'}
                </label>
                <input
                  type="date"
                  value={sessionEndDate}
                  onChange={(e) => setSessionEndDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {locale === 'tr' ? 'Kontenjan' : 'Capacity'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={sessionCapacity}
                  onChange={(e) => setSessionCapacity(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
            >
              {locale === 'tr' ? 'İptal' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? (locale === 'tr' ? 'Oluşturuluyor...' : 'Creating...')
                  : (locale === 'tr' ? 'Kursu Oluştur ve Yayına Al' : 'Create & Publish Course')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
