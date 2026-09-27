'use client';

import React, { useState } from 'react';
import { Course, CreateCourseSessionDto } from '@mobility-nexus/types';
import { X, Calendar, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface HostCreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course | null;
  onSuccess: () => void;
}

export function HostCreateSessionModal({
  isOpen,
  onClose,
  course,
  onSuccess,
}: HostCreateSessionModalProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  if (!isOpen || !course) return null;

  const [startDate, setStartDate] = useState('2026-11-16');
  const [endDate, setEndDate] = useState('2026-11-20');
  const [city, setCity] = useState(course.hostCity);
  const [country, setCountry] = useState(course.hostCountry);
  const [capacity, setCapacity] = useState(15);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: CreateCourseSessionDto = {
      courseId: course.id,
      startDate,
      endDate,
      city,
      country,
      capacity,
    };

    try {
      const res = await fetch('/api/marketplace/host/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || (isTr ? 'Seans eklenemedi.' : 'Failed to add session.'));
      }

      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsDone(false);
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || (isTr ? 'Hata oluştu.' : 'An error occurred.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold">{isTr ? 'Yeni Kurs Oturumu (Seans) Ekle' : 'Add New Course Session'}</h2>
              <p className="text-xs text-slate-300 truncate max-w-xs">{isTr ? (course.titleTr || course.titleEn) : (course.titleEn || course.titleTr)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDone ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900">{isTr ? 'Seans Başarıyla Eklendi!' : 'Session Added Successfully!'}</h3>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">{isTr ? 'Başlangıç Tarihi:' : 'Start Date:'}</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{isTr ? 'Bitiş Tarihi:' : 'End Date:'}</label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">{isTr ? 'Şehir:' : 'City:'}</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">{isTr ? 'Ülke Kodu:' : 'Country Code:'}</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs uppercase"
                  maxLength={4}
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">{isTr ? 'Maksimum Kontenjan:' : 'Maximum Capacity:'}</label>
              <input
                type="number"
                min={1}
                max={50}
                required
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {isTr ? 'Vazgeç' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{isSubmitting ? (isTr ? 'Kaydediliyor...' : 'Saving...') : (isTr ? 'Oturumu Aç' : 'Create Session')}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
