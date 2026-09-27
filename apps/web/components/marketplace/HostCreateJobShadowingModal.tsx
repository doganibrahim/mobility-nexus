'use client';

import React, { useState } from 'react';
import { CreateJobShadowingOfferDto } from '@mobility-nexus/types';
import { X, Briefcase, CheckCircle, AlertCircle, Eye, Users, Calendar, Globe } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface HostCreateJobShadowingModalProps {
  isOpen: boolean;
  onClose: () => void;
  hostId: string;
  hostName: string;
  hostCountry: string;
  hostCity: string;
  onSuccess: () => void;
}

const COMMON_ISCED_FIELDS = [
  { code: '0714', nameTr: 'Elektronik ve Otomasyon', nameEn: 'Electronics and Automation' },
  { code: '0716', nameTr: 'Motorlu Araçlar ve Otomotiv', nameEn: 'Motor Vehicles and Automotive' },
  { code: '0713', nameTr: 'Elektrik ve Yenilenebilir Enerji', nameEn: 'Electricity and Renewable Energy' },
  { code: '0613', nameTr: 'Yazılım ve Web Geliştirme', nameEn: 'Software and Applications Development' },
  { code: '0715', nameTr: 'Mekanik ve Metal İşleme', nameEn: 'Mechanics and Metal Trades' },
  { code: '0722', nameTr: 'Ahşap ve Mobilya İmalatı', nameEn: 'Materials (Wood, Paper, Glass)' },
  { code: '1041', nameTr: 'Lojistik ve Tedarik Zinciri', nameEn: 'Transport and Logistics' },
  { code: '1012', nameTr: 'Gıda İşleme ve Mutfak Sanatları', nameEn: 'Food Processing' },
];

export function HostCreateJobShadowingModal({
  isOpen,
  onClose,
  hostId,
  hostName,
  hostCountry,
  hostCity,
  onSuccess,
}: HostCreateJobShadowingModalProps) {
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  if (!isOpen) return null;

  const [titleTr, setTitleTr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [selectedIsced, setSelectedIsced] = useState(COMMON_ISCED_FIELDS[0].code);
  const [customVetField, setCustomVetField] = useState(COMMON_ISCED_FIELDS[0].nameTr);
  const [descriptionTr, setDescriptionTr] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [durationDays, setDurationDays] = useState(5);
  const [maxCapacity, setMaxCapacity] = useState(4);
  const [staffTypesInput, setStaffTypesInput] = useState('Vocational Teachers, Workshop Instructors');
  const [languagesInput, setLanguagesInput] = useState('English');
  const [workEnvDetails, setWorkEnvDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDone, setIsDone] = useState(false);

  const handleIscedChange = (code: string) => {
    setSelectedIsced(code);
    const found = COMMON_ISCED_FIELDS.find((f) => f.code === code);
    if (found) {
      setCustomVetField(found.nameTr);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const eligibleStaffTypes = staffTypesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const languages = languagesInput
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    const payload: CreateJobShadowingOfferDto = {
      hostId,
      hostName,
      country: hostCountry,
      city: hostCity,
      vetField: customVetField,
      iscedCode: selectedIsced,
      titleTr,
      titleEn: titleEn || titleTr,
      descriptionTr,
      descriptionEn: descriptionEn || descriptionTr,
      eligibleStaffTypes: eligibleStaffTypes.length > 0 ? eligibleStaffTypes : ['Vocational Teachers'],
      durationDays: Number(durationDays),
      maxCapacityPerSlot: Number(maxCapacity),
      languages: languages.length > 0 ? languages : ['English'],
      workingEnvironmentDetails: workEnvDetails || undefined,
    };

    try {
      const res = await fetch('/api/marketplace/job-shadowing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || (isTr ? 'İşbaşı gözlem ilanı oluşturulamadı.' : 'Failed to create job shadowing offer.'));
      }

      setIsDone(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setIsDone(false);
      }, 1200);
    } catch (err: any) {
      setErrorMsg(err.message || (isTr ? 'Bir hata oluştu.' : 'An error occurred.'));
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
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">{isTr ? 'Yeni İşbaşı Gözlem (Job Shadowing) Slotu Tanımla' : 'Define New Job Shadowing Slot'}</h2>
              <p className="text-xs text-slate-300">
                {isTr ? 'Ev Sahibi Kurum:' : 'Host Institution:'} <strong>{hostName}</strong> ({hostCity}, {hostCountry})
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

        {isDone ? (
          <div className="p-10 text-center flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center animate-bounce">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{isTr ? 'İşbaşı Gözlem İlanı Yayında!' : 'Job Shadowing Offer is Live!'}</h3>
            <p className="text-xs text-slate-600 max-w-sm">
              {isTr
                ? 'Öğretmen ve mesleki eğitmenler kurumunuzdaki atölye ve laboratuvarları incelemek üzere talep gönderebilecek.'
                : 'Teachers and vocational trainers can now discover and apply for observation at your workshops.'}
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

            {/* Title TR */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 flex items-center justify-between">
                <span>{isTr ? 'İşbaşı Gözlem Başlığı (Türkçe) *' : 'Job Shadowing Title (Turkish) *'}</span>
                <span className="text-[11px] text-slate-400">{isTr ? 'Okul koordinatörlerinin göreceği ana başlık' : 'Main title visible to coordinators'}</span>
              </label>
              <input
                type="text"
                required
                value={titleTr}
                onChange={(e) => setTitleTr(e.target.value)}
                placeholder={isTr ? 'Örn: Elektrikli Araçlar Batarya Teşhis Laboratuvarı Saha Gözlemi' : 'e.g. EV Battery Diagnostic Lab Practical Job Shadowing (TR)'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
              />
            </div>

            {/* Title EN */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800 flex items-center justify-between">
                <span>{isTr ? 'Program Başlığı (İngilizce) *' : 'Program Title (English) *'}</span>
                <span className="text-[11px] text-slate-400">{isTr ? 'Resmi Erasmus+ / Europass başlığı' : 'Formal Erasmus+ / Europass title'}</span>
              </label>
              <input
                type="text"
                required
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder={isTr ? 'Örn: EV Battery Diagnostic Lab Practical Job Shadowing' : 'e.g. EV Battery Diagnostic Lab Practical Job Shadowing'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
              />
            </div>

            {/* ISCED Field and Sector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800">{isTr ? 'ISCED Meslek Alanı Kodu' : 'ISCED Vocational Field Code'}</label>
                <select
                  value={selectedIsced}
                  onChange={(e) => handleIscedChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs bg-white"
                >
                  {COMMON_ISCED_FIELDS.map((f) => (
                    <option key={f.code} value={f.code}>
                      ISCED {f.code} - {isTr ? f.nameTr : f.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800">{isTr ? 'VET Sektör / Atölye Branşı *' : 'VET Sector / Workshop Field *'}</label>
                <input
                  type="text"
                  required
                  value={customVetField}
                  onChange={(e) => setCustomVetField(e.target.value)}
                  placeholder={isTr ? 'Örn: Mekatronik ve Endüstriyel Robotik' : 'e.g. Mechatronics & Industrial Robotics'}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>
            </div>

            {/* Duration and Capacity */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isTr ? 'Önerilen Süre (Gün) *' : 'Recommended Duration (Days) *'}</span>
                </label>
                <input
                  type="number"
                  min={2}
                  max={60}
                  required
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
                <p className="text-[10px] text-slate-500">
                  {isTr
                    ? 'Erasmus+ Personel İşbaşı Gözlemi 2 ile 60 gün arasındadır (standart 5 gün).'
                    : 'Erasmus+ Staff Job Shadowing is between 2 and 60 days (standard 5 days).'}
                </p>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isTr ? 'Slot Başı Maks. Katılımcı Kapasitesi *' : 'Max Capacity Per Slot *'}</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  required
                  value={maxCapacity}
                  onChange={(e) => setMaxCapacity(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
                <p className="text-[10px] text-slate-500">
                  {isTr ? 'Tek seferde kabul edebileceğiniz gözlemci öğretmen sayısı.' : 'Number of visiting teachers you can host simultaneously.'}
                </p>
              </div>
            </div>

            {/* Eligible Staff Types & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isTr ? 'Hedef Personel Türleri (Virgülle ayırın)' : 'Eligible Staff Profiles (comma-separated)'}</span>
                </label>
                <input
                  type="text"
                  value={staffTypesInput}
                  onChange={(e) => setStaffTypesInput(e.target.value)}
                  placeholder="Vocational Teachers, Lab Leads, Instructors"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>{isTr ? 'Çalışma & İletişim Dilleri' : 'Working & Communication Languages'}</span>
                </label>
                <input
                  type="text"
                  value={languagesInput}
                  onChange={(e) => setLanguagesInput(e.target.value)}
                  placeholder="English, German, Italian"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                />
              </div>
            </div>

            {/* Description TR */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800">{isTr ? 'Gözlem & Faaliyet Açıklaması (Türkçe) *' : 'Observation & Activity Description (Turkish) *'}</label>
              <textarea
                required
                rows={3}
                value={descriptionTr}
                onChange={(e) => setDescriptionTr(e.target.value)}
                placeholder={isTr ? 'Öğretmenler işletmenizde hangi atölye süreçlerini, emniyet tedbirlerini, test ve cihazları gözlemleyecek?' : 'Describe workshop activities, safety measures, equipment...'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
              />
            </div>

            {/* Description EN */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800">{isTr ? 'İşbaşı Gözlem Kapsamı & Görevler (İngilizce)' : 'Job Shadowing Scope & Tasks (English)'}</label>
              <textarea
                rows={2}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                placeholder="Describe observation benches, diagnostic procedures, and mentored workshop activities..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
              />
            </div>

            {/* Working Environment Details */}
            <div className="space-y-1">
              <label className="font-semibold text-slate-800">{isTr ? 'Çalışma / Atölye Ortamı & Ekipman Notları' : 'Working Environment & Equipment Notes'}</label>
              <input
                type="text"
                value={workEnvDetails}
                onChange={(e) => setWorkEnvDetails(e.target.value)}
                placeholder={isTr ? 'Örn: Tier-1 sanayi tesisi, yüksek gerilim batarya laboratuvarı, Siemens PLC istasyonları.' : 'e.g. Tier-1 manufacturing facility, high-voltage battery lab, Siemens PLC stations.'}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
              />
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {isTr ? 'İptal' : 'Cancel'}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold transition-all shadow-xs disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>{isTr ? 'Kaydediliyor...' : 'Saving...'}</span>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isTr ? 'İşbaşı Gözlem İlanını Yayınla' : 'Publish Job Shadowing Offer'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
