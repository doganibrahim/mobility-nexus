'use client';

import React, { useState, useEffect } from 'react';
import { CreateCourseDto } from '@mobility-nexus/types';
import { X, Plus, BookPlus, Euro, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface HostCreateCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostId: string;
  hostName: string;
  hostCountry: string;
  hostCity: string;
  hostOid?: string;
  onSuccess: () => void;
}

export function HostCreateCourseModal({
  isOpen,
  onClose,
  hostId,
  hostName,
  hostCountry,
  hostCity,
  hostOid,
  onSuccess,
}: HostCreateCourseModalProps) {
  const { locale } = useTranslation();
  if (!isOpen) return null;

  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [iscedCode, setIscedCode] = useState('0714');
  const [iscedName, setIscedName] = useState('Elektronik ve Otomasyon');
  const [durationDays, setDurationDays] = useState(5);
  const [language, setLanguage] = useState('English');
  const [minLanguageLevel, setMinLanguageLevel] = useState<'A2' | 'B1' | 'B2' | 'C1'>('B1');
  const [targetAudience, setTargetAudience] = useState<'TEACHERS' | 'VET_STAFF' | 'TRAINERS' | 'MIXED'>('TEACHERS');
  const [outcomeTr, setOutcomeTr] = useState('');
  const [outcomeEn, setOutcomeEn] = useState('');
  const [tagsInput, setTagsInput] = useState('Endüstri 4.0, PLC, Otomasyon');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: CreateCourseDto = {
      hostId,
      hostName,
      hostCountry,
      hostCity,
      hostOid,
      titleTr,
      titleEn: titleEn || titleTr,
      descriptionTr,
      descriptionEn: descriptionEn || descriptionTr,
      iscedCode,
      iscedName,
      durationDays,
      dailyFeeEur: 80, // official Erasmus+ rate
      language,
      minLanguageLevel,
      targetAudience,
      tags,
      learningOutcomesTr: outcomeTr ? [outcomeTr] : [],
      learningOutcomesEn: outcomeEn ? [outcomeEn] : [outcomeTr],
    };

    try {
      const res = await fetch('/api/marketplace/host/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Kurs eklenemedi.');
      }

      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsDone(false);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || 'Bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-course-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150"
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-600 text-white">
              <BookPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 id="create-course-title" className="text-base font-bold">
                {locale === 'tr' ? 'Yeni Erasmus+ Kursu Tanımla' : 'Define New Erasmus+ Course'}
              </h2>
              <p className="text-xs text-slate-300">
                {locale === 'tr' ? 'Ev Sahibi Kurum:' : 'Host Institution:'} <strong>{hostName}</strong> ({hostCity}, {hostCountry})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={locale === 'tr' ? 'Pencereyi kapat' : 'Close window'}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {locale === 'tr' ? 'Kurs Kataloğa Eklendi!' : 'Course Added to Catalogue!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm">
              {locale === 'tr'
                ? 'Kursunuz tüm Avrupa meslek liseleri ve gönderen kurumlar için pazar yerinde yayına alındı.'
                : 'Your course is now published on the marketplace for European VET schools and sending organisations.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <Euro className="w-4 h-4 text-emerald-700" />
                {locale === 'tr' ? 'Erasmus+ Resmi Kurs Ücreti Standardı:' : 'Erasmus+ Official Course Fee Standard:'}
              </span>
              <span className="font-bold text-xs bg-white px-2.5 py-1 rounded border border-emerald-300">
                {locale === 'tr' ? '80 € / Gün (Katılımcı Başına)' : '80 € / Day (Per Participant)'}
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Kurs Başlığı (Türkçe):' : 'Course Title (Turkish):'}
                </label>
                <input
                  type="text"
                  required
                  value={titleTr}
                  onChange={(e) => setTitleTr(e.target.value)}
                  placeholder={locale === 'tr' ? 'Örn: Endüstri 4.0 ve Yapay Zeka Odaklı Mesleki Eğitimcisi Kursu' : 'e.g. Industry 4.0 & AI Pedagogy for Vocational Educators'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Kurs Başlığı (İngilizce):' : 'Course Title (English):'}
                </label>
                <input
                  type="text"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g. Industry 4.0 & AI Pedagogy for Vocational Educators"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {locale === 'tr' ? 'ISCED Kodu:' : 'ISCED Code:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={iscedCode}
                    onChange={(e) => setIscedCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs font-mono"
                    placeholder="0714"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {locale === 'tr' ? 'Eğitim Süresi:' : 'Training Duration:'}
                  </label>
                  <select
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs bg-white"
                  >
                    <option value={5}>{locale === 'tr' ? '5 Gün (400 € Hibe)' : '5 Days (€400 Grant)'}</option>
                    <option value={6}>{locale === 'tr' ? '6 Gün (480 € Hibe)' : '6 Days (€480 Grant)'}</option>
                    <option value={7}>{locale === 'tr' ? '7 Gün (560 € Hibe)' : '7 Days (€560 Grant)'}</option>
                    <option value={10}>{locale === 'tr' ? '10 Gün (800 € Hibe)' : '10 Days (€800 Grant)'}</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    {locale === 'tr' ? 'Asgari Dil Düzeyi:' : 'Minimum Language Level:'}
                  </label>
                  <select
                    value={minLanguageLevel}
                    onChange={(e) => setMinLanguageLevel(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs bg-white"
                  >
                    <option value="A2">{locale === 'tr' ? 'A2 - Temel' : 'A2 - Elementary'}</option>
                    <option value="B1">{locale === 'tr' ? 'B1 - Orta (Önerilen)' : 'B1 - Intermediate (Recommended)'}</option>
                    <option value="B2">{locale === 'tr' ? 'B2 - İleri' : 'B2 - Upper-Intermediate'}</option>
                    <option value="C1">{locale === 'tr' ? 'C1 - Yetkin' : 'C1 - Advanced'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Kurs Açıklaması ve Müfredat Özeti:' : 'Course Description & Curriculum Summary:'}
                </label>
                <textarea
                  rows={3}
                  required
                  value={descriptionTr}
                  onChange={(e) => setDescriptionTr(e.target.value)}
                  placeholder={locale === 'tr'
                    ? 'Meslek öğretmenlerinin atölyelerinde uygulayacağı pedagojik kazanımlar, kullanılacak araçlar...'
                    : 'Pedagogical outcomes to be applied in workshops, tools and methods to be used...'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Örnek Öğrenme Çıktısı (ESCO Uyumlu):' : 'Sample Learning Outcome (ESCO Compliant):'}
                </label>
                <input
                  type="text"
                  value={outcomeTr}
                  onChange={(e) => setOutcomeTr(e.target.value)}
                  placeholder={locale === 'tr' ? 'Örn: PLC sistemlerine IoT sensör veri akışı entegre edebilme.' : 'e.g. Integrate IoT sensor data flows into PLC systems.'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Etiketler (Virgülle ayırın):' : 'Tags (Separate with commas):'}
                </label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder={locale === 'tr' ? 'Yapay Zeka, PLC, Otomasyon' : 'AI, PLC, Automation'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {locale === 'tr' ? 'Vazgeç' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 active:scale-98 text-white font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (locale === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                    : (locale === 'tr' ? 'Kursu Yayınla' : 'Publish Course')}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
