'use client';

import React, { useState } from 'react';
import {
  Course,
  CourseSession,
  JobShadowingOffer,
  MarketplaceProjectType,
  CreateMarketplaceApplicationDto,
} from '@mobility-nexus/types';
import {
  X,
  Building2,
  Euro,
  Users,
  Calendar,
  CheckCircle,
  FileText,
  AlertCircle,
  Send,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '../../lib/i18n';

interface MarketplaceApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  course?: Course | null;
  session?: CourseSession | null;
  jobShadowing?: JobShadowingOffer | null;
  onSuccess: () => void;
}

export function MarketplaceApplicationModal({
  isOpen,
  onClose,
  course,
  session,
  jobShadowing,
  onSuccess,
}: MarketplaceApplicationModalProps) {
  const { locale } = useTranslation();
  if (!isOpen || (!course && !jobShadowing)) return null;

  const isCourse = Boolean(course);
  const durationDays = course?.durationDays || jobShadowing?.durationDays || 5;

  // Form State with sensible defaults for quick demo & testing
  const [schoolName, setSchoolName] = useState('İstanbul Pendik Borsa İstanbul MTAL');
  const [schoolOid, setSchoolOid] = useState('E10384729');
  const [schoolCity, setSchoolCity] = useState('İstanbul');
  const [contactName, setContactName] = useState('Ahmet Yılmaz');
  const [contactEmail, setContactEmail] = useState('a.yilmaz@pendikmtal.k12.tr');
  const [contactPhone, setContactPhone] = useState('+90 532 111 2233');
  const [projectType, setProjectType] = useState<MarketplaceProjectType>('KA121');
  const [participantCount, setParticipantCount] = useState<number>(2);
  const [specialNotes, setSpecialNotes] = useState(
    'Okulumuz KA121 akredite kurumudur. Belirtilen tarihlerdeki seansa 2 meslek öğretmenimiz ile katılım sağlamak ve resmi kabul belgesi almak istiyoruz.'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  // Live Erasmus+ Grant Calculation
  // Courses: Official course fee grant is 80 €/day per participant, capped at max 10 days (800 €)
  // Job Shadowing: No course fee; funding comes from Individual Support (Subsistence) and Travel Grant
  const cappedDays = Math.min(Math.max(durationDays, 1), 10);
  const feePerPerson = isCourse ? cappedDays * 80 : 0;
  const totalGrantEur = isCourse ? participantCount * feePerPerson : participantCount * durationDays * 160; // Estimated 160 €/day avg individual support for job shadowing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: CreateMarketplaceApplicationDto = {
      applicationType: isCourse ? 'COURSE' : 'JOB_SHADOWING',
      courseId: course?.id,
      sessionId: session?.id,
      jobShadowingId: jobShadowing?.id,
      hostId: course?.hostId || jobShadowing?.hostId || '',
      hostName: course?.hostName || jobShadowing?.hostName || '',
      schoolName,
      schoolOid,
      schoolCity,
      contactName,
      contactEmail,
      contactPhone,
      projectType,
      participantCount,
      durationDays,
      specialNotes,
    };

    try {
      const res = await fetch('/api/marketplace/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Başvuru gönderilirken bir hata oluştu.');
      }

      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsDone(false);
      }, 1400);
    } catch (err: any) {
      setErrorMsg(err.message || 'Başvuru iletilemedi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600 text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">
                {isCourse
                  ? (locale === 'tr' ? 'Kurs Ön Başvuru Formu' : 'Course Pre-Application Form')
                  : (locale === 'tr' ? 'İşbaşı Gözlem Talep Formu' : 'Job Shadowing Request Form')}
              </h2>
              <p className="text-xs text-slate-300">
                {locale === 'tr' ? 'Ev Sahibi:' : 'Host:'} <strong>{course?.hostName || jobShadowing?.hostName}</strong>
              </p>
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

        {/* Selected Course / Session Summary Banner */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {locale === 'tr' ? 'Seçilen Faaliyet:' : 'Selected Activity:'}
            </span>
            <strong className="text-slate-900 text-xs">
              {locale === 'tr'
                ? (course?.titleTr || jobShadowing?.titleTr)
                : (course?.titleEn || jobShadowing?.titleEn || course?.titleTr || jobShadowing?.titleTr)}
            </strong>
            {session && (
              <p className="text-blue-700 font-medium mt-0.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {session.startDate} — {session.endDate} ({session.city}, {session.country})
              </p>
            )}
          </div>

          <div className="sm:text-right shrink-0">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {locale === 'tr' ? 'Süre:' : 'Duration:'}
            </span>
            <strong className="text-slate-900">
              {locale === 'tr' ? `${durationDays} Günlük Faaliyet` : `${durationDays} Days Activity`}
            </strong>
          </div>
        </div>

        {/* Form Body */}
        {isDone ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              {locale === 'tr' ? 'Başvurunuz Başarıyla İletildi!' : 'Your Application Was Successfully Sent!'}
            </h3>
            <p className="text-xs text-slate-600 max-w-sm">
              {locale === 'tr'
                ? 'Talebiniz ev sahibi kuruma aktarıldı. Kabul ve kontenjan durumunu panelinizden takip edebilirsiniz.'
                : 'Your request was forwarded to the host institution. You can track acceptance and quota status in your dashboard.'}
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

            {/* Erasmus+ Grant Live Box */}
            <div className={`p-4 rounded-xl border ${isCourse ? 'bg-emerald-50 border-emerald-200' : 'bg-blue-50 border-blue-200'}`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className={`font-bold flex items-center gap-1.5 text-xs ${isCourse ? 'text-emerald-950' : 'text-blue-950'}`}>
                  <Euro className={`w-4 h-4 ${isCourse ? 'text-emerald-700' : 'text-blue-700'}`} />
                  {isCourse
                    ? (locale === 'tr' ? 'Erasmus+ Kurs Ücreti Hibe Hesaplama Simülasyonu' : 'Erasmus+ Course Fee Grant Calculation Simulation')
                    : (locale === 'tr' ? 'Erasmus+ İşbaşı Gözlem Hibe Rejimi Bilgilendirmesi' : 'Erasmus+ Job Shadowing Grant Regime Info')}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${isCourse ? 'bg-emerald-200/60 text-emerald-900' : 'bg-blue-200/60 text-blue-900'}`}>
                  {isCourse
                    ? (locale === 'tr' ? 'Resmi Standart: 80 € / Gün (Maks. 800 €)' : 'Official Standard: 80 € / Day (Max 800 €)')
                    : (locale === 'tr' ? 'Kurs Ücreti: 0 € (Harcırahlı Model)' : 'Course Fee: 0 € (Per-diem Model)')}
                </span>
              </div>
              <div className={`flex flex-wrap items-center justify-between gap-2 pt-2 border-t text-xs ${isCourse ? 'border-emerald-200/80 text-emerald-800' : 'border-blue-200/80 text-blue-800'}`}>
                {isCourse ? (
                  <>
                    <span>
                      <strong>{participantCount}</strong> {locale === 'tr' ? 'Öğretmen' : 'Teachers'} × <strong>{cappedDays}</strong> {locale === 'tr' ? 'Gün' : 'Days'} ×{' '}
                      <strong>80 €</strong> =
                    </span>
                    <span className="text-sm font-black text-emerald-900 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs">
                      {locale === 'tr'
                        ? `${totalGrantEur.toLocaleString('tr-TR')} € Kurs Hibe Tavanı`
                        : `€${totalGrantEur.toLocaleString('en-US')} Course Grant Ceiling`}
                    </span>
                  </>
                ) : (
                  <>
                    <span>
                      {locale === 'tr'
                        ? <>İşbaşı gözlemde ev sahibine kurs ücreti ödenmez; okulunuz <strong>{participantCount}</strong> öğretmen için günlük ort. ~160 € bireysel destek + seyahat hibesi kullanır.</>
                        : <>In job shadowing, no course fee is paid to host; your school utilizes ~160 €/day individual support + travel grant for <strong>{participantCount}</strong> teachers.</>}
                    </span>
                    <span className="text-xs font-bold text-blue-900 bg-white px-2.5 py-1 rounded-lg border border-blue-300 shadow-2xs">
                      {locale === 'tr'
                        ? `Tahmini ~${totalGrantEur.toLocaleString('tr-TR')} € Bireysel Destek`
                        : `Estimated ~€${totalGrantEur.toLocaleString('en-US')} Individual Support`}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* School details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Kurum Adı (Okul / Merkez):' : 'Organisation Name (School / Centre):'}
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Kurum OID Numarası:' : 'Organisation ID (OID):'}
                </label>
                <input
                  type="text"
                  required
                  value={schoolOid}
                  onChange={(e) => setSchoolOid(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs font-mono"
                  placeholder="E10384729"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Şehir:' : 'City:'}
                </label>
                <input
                  type="text"
                  required
                  value={schoolCity}
                  onChange={(e) => setSchoolCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'Erasmus+ Proje Türü:' : 'Erasmus+ Project Type:'}
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value as MarketplaceProjectType)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs bg-white"
                >
                  <option value="KA121">
                    {locale === 'tr' ? 'KA121 - Akredite Kurum Konsorsiyumu' : 'KA121 - Accredited Consortium'}
                  </option>
                  <option value="KA122">
                    {locale === 'tr' ? 'KA122 - Kısa Dönemli Hareketlilik Projesi' : 'KA122 - Short-term Mobility Project'}
                  </option>
                  <option value="NOT_YET_APPLIED">
                    {locale === 'tr' ? 'Henüz Proje Başvurusu Yapılmadı (Ön Mutabakat)' : 'Project Not Yet Submitted (Pre-agreement)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'İletişim Yetkilisi:' : 'Contact Person:'}
                </label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  {locale === 'tr' ? 'İletişim E-posta:' : 'Contact Email:'}
                </label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>
            </div>

            {/* Participants Stepper */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {locale === 'tr' ? 'Katılacak Öğretmen / Personel Sayısı:' : 'Number of Participating Teachers / Staff:'}
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setParticipantCount((prev) => Math.max(1, prev - 1))}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-bold text-slate-900 bg-white">
                    {participantCount} {locale === 'tr' ? 'Kişi' : 'Participants'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setParticipantCount((prev) => Math.min(10, prev + 1))}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-slate-500 text-xs">
                  {locale === 'tr'
                    ? '(Kontenjana ve Erasmus+ bütçenize göre maksimum 10 kişi seçebilirsiniz)'
                    : '(You may select up to 10 participants based on quota and Erasmus+ budget)'}
                </span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                {locale === 'tr' ? 'Özel Talepler ve Kurumsal Notlar:' : 'Special Requests and Institutional Notes:'}
              </label>
              <textarea
                rows={3}
                value={specialNotes}
                onChange={(e) => setSpecialNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs leading-relaxed"
                placeholder={locale === 'tr' ? 'Örn: Bölüm branşları, dil seviyeleri veya ön kabul talebi...' : 'e.g. Department specializations, language levels, or draft request...'}
              />
            </div>

            {/* Footer Buttons */}
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-700 hover:bg-blue-800 active:scale-98 text-white font-bold transition-all shadow-xs disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (locale === 'tr' ? 'Gönderiliyor...' : 'Submitting...')
                    : (locale === 'tr' ? 'Başvuruyu İlet' : 'Submit Application')}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
