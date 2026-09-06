'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { apiClient } from '../../lib/api-client';
import { useAppStore } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';
import { AccreditationStatus } from '@mobility-nexus/types';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded: isUserLoaded } = useUser();
  const { themeConfig } = useTheme();
  const {
    currentOrg,
    currentHost,
    orgType,
    userRole,
    isOnboarded,
    setCurrentOrg,
    setCurrentHost,
  } = useAppStore();

  // Role Selection State: 'SCHOOL' | 'HOST' | null
  const [selectedRole, setSelectedRole] = useState<'SCHOOL' | 'HOST' | null>(null);

  // 1. School Form State
  const [schoolName, setSchoolName] = useState('');
  const [schoolOid, setSchoolOid] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolCountryCode, setSchoolCountryCode] = useState('TR');
  const [accreditationStatus, setAccreditationStatus] =
    useState<AccreditationStatus>('YES');
  const [role, setRole] = useState<'ORG_ADMIN' | 'MEMBER'>('ORG_ADMIN');

  // 2. Host Form State
  const [hostName, setHostName] = useState('');
  const [hostCountryCode, setHostCountryCode] = useState('DE');
  const [hostCity, setHostCity] = useState('');
  const [hostAddress, setHostAddress] = useState('');
  const [hostWebsite, setHostWebsite] = useState('');
  const [hostSector, setHostSector] = useState('ict');
  const [hostContactPerson, setHostContactPerson] = useState('');
  const [hostContactEmail, setHostContactEmail] = useState('');
  const [hostContactPhone, setHostContactPhone] = useState('');
  const [hostMaxLearners, setHostMaxLearners] = useState(4);
  const [hostActivities, setHostActivities] = useState<string[]>([
    'VET_INTERNSHIP',
    'JOB_SHADOWING',
  ]);
  const [hostLanguages, setHostLanguages] = useState<string[]>(['EN']);

  // Reference Data (from API)
  const [countries, setCountries] = useState<
    Array<{ code: string; nameTr: string; nameEn: string; flagEmoji?: string }>
  >([]);
  const [sectors, setSectors] = useState<
    Array<{ code: string; nameTr: string; nameEn: string }>
  >([]);

  // UI Flow State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingOrg, setIsCheckingOrg] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Submitted Data View
  const [submittedOrg, setSubmittedOrg] = useState<any | null>(null);
  const [submittedHost, setSubmittedHost] = useState<any | null>(null);

  // Fetch Reference Data on mount
  useEffect(() => {
    async function loadReferenceData() {
      const [cList, sList] = await Promise.all([
        apiClient.getCountries(),
        apiClient.getSectors(),
      ]);
      setCountries(cList);
      setSectors(sList);
    }
    loadReferenceData();
  }, []);

  // Check if user already has an active organisation or host
  useEffect(() => {
    let isMounted = true;

    async function checkExistingOrg() {
      if (!isUserLoaded) return;

      // Check current Zustand store first
      if (isOnboarded) {
        if (orgType === 'HOST' && currentHost) {
          setSubmittedHost(currentHost);
          setSelectedRole('HOST');
          setIsCheckingOrg(false);
          return;
        }
        if (currentOrg) {
          setSubmittedOrg(currentOrg);
          setSelectedRole('SCHOOL');
          setSchoolName(currentOrg.name || '');
          setSchoolOid(currentOrg.oid || '');
          setSchoolCity(currentOrg.city || '');
          setAccreditationStatus(currentOrg.accreditationStatus || 'YES');
          setIsCheckingOrg(false);
          return;
        }
      }

      // Check backend via user ID
      if (user?.id) {
        try {
          const { data: orgData } = await apiClient.getUserOrganisation(user.id);
          if (!isMounted) return;
          if (orgData && orgData.name) {
            setCurrentOrg(orgData, orgData.role || 'ORG_ADMIN');
            setSubmittedOrg(orgData);
            setSelectedRole('SCHOOL');
            setSchoolName(orgData.name || '');
            setSchoolOid(orgData.oid || '');
            setSchoolCity(orgData.city || '');
            setAccreditationStatus(orgData.accreditationStatus || 'YES');
            setIsCheckingOrg(false);
            return;
          }

          const { data: hostData } = await apiClient.getUserHostOrganisation(user.id);
          if (!isMounted) return;
          if (hostData && hostData.name) {
            setCurrentHost(hostData);
            setSubmittedHost(hostData);
            setSelectedRole('HOST');
            setIsCheckingOrg(false);
            return;
          }
        } catch (err) {
          console.warn('[Onboarding] Error checking user institutions:', err);
        }
      }

      if (isMounted) {
        setIsCheckingOrg(false);
      }
    }

    checkExistingOrg();

    return () => {
      isMounted = false;
    };
  }, [isUserLoaded, user?.id, isOnboarded, orgType, currentOrg, currentHost, setCurrentOrg, setCurrentHost]);

  // Validation - School
  const isSchoolOidValid = !schoolOid || /^E10[0-9]{5,7}$/i.test(schoolOid.trim());
  const canSubmitSchool =
    schoolName.trim().length >= 3 && schoolCity.trim().length >= 2 && isSchoolOidValid;

  // Validation - Host
  const canSubmitHost =
    hostName.trim().length >= 3 &&
    hostCity.trim().length >= 2 &&
    hostContactPerson.trim().length >= 3 &&
    hostContactEmail.includes('@');

  // Live Hazırlık Skoru Calculation (School)
  const calculatePreviewScore = () => {
    let score = 20; // base
    if (schoolName.trim().length > 3) score += 20;
    if (schoolCity.trim().length > 2) score += 15;
    if (schoolOid.trim() && isSchoolOidValid) score += 25;
    if (accreditationStatus === 'YES') score += 20;
    else if (accreditationStatus === 'NO') score += 15;
    return Math.min(100, score);
  };

  const previewScore = calculatePreviewScore();

  // Handle School Form Submit
  const handleSchoolSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitSchool) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const formattedOid = schoolOid.trim() ? schoolOid.trim().toUpperCase() : undefined;
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const userFullName = user?.fullName || undefined;

      let orgResult: any;

      if (isEditing && (submittedOrg?.id || currentOrg?.id)) {
        const orgId = submittedOrg?.id || currentOrg?.id;
        const { data } = await apiClient.updateOrganisation(orgId, {
          name: schoolName.trim(),
          oid: formattedOid,
          city: schoolCity.trim(),
          countryCode: schoolCountryCode,
          accreditationStatus,
          userId: user?.id,
          userEmail,
          userFullName,
        });
        orgResult = data;
      } else {
        const { data } = await apiClient.createOrganisation({
          name: schoolName.trim(),
          oid: formattedOid,
          city: schoolCity.trim(),
          countryCode: schoolCountryCode,
          accreditationStatus,
          userId: user?.id,
          userEmail,
          userFullName,
        });
        orgResult = data;
      }

      setCurrentOrg(orgResult, role);
      setSubmittedOrg(orgResult);
      setIsEditing(false);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Kurum işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Host Form Submit
  const handleHostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmitHost) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      const userFullName = user?.fullName || undefined;

      const { data } = await apiClient.registerHost({
        name: hostName.trim(),
        countryCode: hostCountryCode,
        city: hostCity.trim(),
        address: hostAddress.trim() || undefined,
        websiteUrl: hostWebsite.trim() || undefined,
        primarySector: hostSector,
        contactPerson: hostContactPerson.trim(),
        contactEmail: hostContactEmail.trim().toLowerCase(),
        contactPhone: hostContactPhone.trim() || undefined,
        maxLearnersPerTerm: hostMaxLearners,
        totalAnnualCapacity: hostMaxLearners * 3,
        activities: hostActivities,
        languages: hostLanguages,
        userId: user?.id,
        userEmail,
        userFullName,
      });

      setCurrentHost(data);
      setSubmittedHost(data);
      setIsEditing(false);
    } catch (err: any) {
      setErrorMessage(
        err.message || 'Ev sahibi kurum kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isUserLoaded || isCheckingOrg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-600 font-medium text-sm">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Kurumsal yetkiler ve profil durumu kontrol ediliyor...</span>
        </div>
      </div>
    );
  }

  const primaryColor = themeConfig.primary || '#17365d';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Brand Header Bar */}
      <header className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 text-decoration-none">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-xs text-sm"
              style={{ backgroundColor: primaryColor }}
            >
              C
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-slate-900 text-base">
                CAPPINNO Mobility Nexus
              </span>
              <span className="text-xs text-slate-500 block">
                Erasmus+ VET Kurum & Ev Sahibi Yönetimi
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Giriş yapan: <strong className="text-slate-800">{user?.fullName || user?.primaryEmailAddress?.emailAddress}</strong>
            </span>
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-50 transition-colors"
            >
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-3xl mx-auto w-full px-4 py-8 sm:py-12 flex-1">
        {/* ========================================================================= */}
        {/* DURUM 1: OKUL ÖZET KARTI (Gönderen Kurum Kayıtlı)                          */}
        {/* ========================================================================= */}
        {submittedOrg && !isEditing ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 text-white" style={{ backgroundColor: primaryColor }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide uppercase mb-3">
                <span>✓</span>
                <span>Okul / Gönderen Kurum Kaydı Tamamlandı</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 text-white">
                {submittedOrg.name}
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-xl leading-relaxed">
                Kurumunuz sisteme başarıyla tanımlandı. Artık KA121 / KA122 hareketlilik süreçlerinizi planlayabilir ve başvuru hazırlıklarına geçebilirsiniz.
              </p>
            </div>

            {/* Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Erasmus Kurum Kodu (OID)
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {submittedOrg.oid || 'Belirtilmedi'}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <span>🇪🇺</span>
                    <span>Resmî Format Doğrulandı</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Akreditasyon Durumu
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {submittedOrg.accreditationStatus === 'YES'
                      ? 'Erasmus+ Akredite Kurum (KA121)'
                      : submittedOrg.accreditationStatus === 'NO'
                        ? 'Kısa Dönem Hareketlilik (KA122)'
                        : 'Doğrulanacak'}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600">
                    {submittedOrg.accreditationStatus === 'YES'
                      ? 'Yıllık bütçe talebi ve Erasmus Planı ile uyumlu'
                      : 'Standart başvuru ve ihtiyaç analizi döngüsü'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Konum ve Ülke
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {submittedOrg.city || 'Belirtilmedi'}, {submittedOrg.countryCode || 'TR'}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Ulusal Ajans koordinasyonu
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Sistem Yetki Rolü
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm">{userRole || 'ORG_ADMIN'}</span>
                    <span className="text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      Kurum Yöneticisi
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    Kurum profili ve hareketlilik yönetimi yetkisi
                  </div>
                </div>
              </div>

              {/* Skor Göstergesi */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      BAŞLANGIÇ HAZIRLIK SKORU
                    </span>
                    <p className="text-xs text-slate-500 m-0 mt-0.5">
                      Sabit kimlik verilerinize göre hesaplanan kurumsal hazırlık puanı
                    </p>
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    %{submittedOrg.readinessScore || previewScore}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${submittedOrg.readinessScore || previewScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Butonlar */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(true);
                    setSchoolName(submittedOrg.name || '');
                    setSchoolOid(submittedOrg.oid || '');
                    setSchoolCity(submittedOrg.city || '');
                    setSchoolCountryCode(submittedOrg.countryCode || 'TR');
                    setAccreditationStatus(submittedOrg.accreditationStatus || 'YES');
                  }}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-2xs"
                >
                  Bilgileri Düzenle
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                >
                  <span>Hareketlilik Gateway'ine Başla</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        ) : submittedHost ? (
          /* ========================================================================= */
          /* DURUM 2: EV SAHİBİ (HOST) ÖZET KARTI                                      */
          /* ========================================================================= */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            <div className="p-6 sm:p-8 text-white" style={{ backgroundColor: primaryColor }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-bold tracking-wide uppercase mb-3">
                <span className="w-2 h-2 rounded-full bg-amber-800"></span>
                <span>Doğrulama İncelemesinde</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 text-white">
                {submittedHost.name}
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-xl leading-relaxed">
                Avrupa ev sahibi kurum başvurunuz sisteme başarıyla iletildi. Kalite kontrol ve 15 kriterli inceleme sürecinin ardından akredite okulların arama sonuçlarında listelenecektir.
              </p>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Faaliyet Sektörü & Konum
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1 capitalize">
                    {submittedHost.primarySector || hostSector}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {submittedHost.city}, {submittedHost.countryCode}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Kabul Kapasitesi
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {submittedHost.maxLearnersPerTerm || 4} Stajyer / Dönem
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    Yıllık azami: {submittedHost.totalAnnualCapacity || 12} öğrenci
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    İletişim Yetkilisi
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {submittedHost.contactPerson}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {submittedHost.contactEmail}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    Çalışma Dilleri
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1 flex gap-1.5 flex-wrap">
                    {(submittedHost.languages || ['EN']).map((lang: string) => (
                      <span key={lang} className="px-2 py-0.5 bg-blue-50 text-blue-800 text-xs rounded-md font-semibold border border-blue-200">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 15 Kriterlik Kalite Güvence Bilgi Kutusu */}
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 text-slate-800 text-xs space-y-2">
                <div className="font-bold text-blue-950 flex items-center gap-2">
                  <span>🛡️</span>
                  <span>15 Kriterli Kalite & Güvenlik Doğrulama Süreci</span>
                </div>
                <p className="text-slate-600 leading-relaxed m-0">
                  CAPPINNO Partner Network yöneticileri; vergi kaydı, fiziksel işyeri standartları, İngilizce mentorluk varlığı ve iş güvenliği kriterlerini inceleyecektir. Doğrulandığında profiliniz <strong>"Doğrulanmış Ev Sahibi"</strong> statüsü alacaktır.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
                >
                  <span>Ana Sayfaya Dön</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        ) : selectedRole === null ? (
          /* ========================================================================= */
          /* ADIM 1: KURUMSAL ROL SEÇİM EKRANI (Role Selection)                        */
          /* ========================================================================= */
          <div className="space-y-6 animate-fadeIn">
            <div className="text-center max-w-xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
                <span>🇪🇺</span>
                <span>Erasmus+ Hareketlilik Portalı</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0">
                Kurumsal Profilinizi Seçin
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                Platform üzerindeki faaliyet alanınıza uygun kurumsal rolü seçerek kurulumu başlatın.
              </p>
            </div>

            {/* Çift Kart Seçimi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              {/* Kart 1: Okul / Gönderen Kurum */}
              <div
                onClick={() => setSelectedRole('SCHOOL')}
                className="group relative bg-white border-2 border-slate-200 hover:border-blue-600 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                    🏛️
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 border border-blue-200 mb-2">
                    Öğrenci & Personel Gönderen
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Okul / Gönderen Kurum
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Erasmus+ KA121 akreditasyonu veya KA122 kısa dönem projeleri ile mesleki eğitim öğrencilerini ve öğretmenlerini Avrupa'ya staj ve eğitime gönderen meslek liseleri ve kurumlar.
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Resmi Erasmus OID & Akreditasyon Eşleşmesi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Canlı Kurumsal Hazırlık Skoru</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>ESCO / ISCED-F Eşleştirme Motoru</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Okul Kurulumuna Başla</span>
                  <span>→</span>
                </div>
              </div>

              {/* Kart 2: Ev Sahibi Kurum / Avrupalı İşletme */}
              <div
                onClick={() => setSelectedRole('HOST')}
                className="group relative bg-white border-2 border-slate-200 hover:border-emerald-600 rounded-2xl p-7 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-3xl mb-5 group-hover:scale-110 transition-transform">
                    🏢
                  </div>
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 mb-2">
                    Avrupa Staj / İşbaşı Sağlayıcısı
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Ev Sahibi Kurum / İşletme
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Avrupa'da faaliyet gösteren; Türk ve AB meslek lisesi öğrencilerine staj ve beceri eğitimi, öğretmenlere işbaşı gözlem (Job Shadowing) imkanı sağlayan işletmeler.
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>15 Kriterli Resmi Doğrulama Güvencesi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Dönemlik Öğrenci Kapasite Yönetimi</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Akredite Okullarla Doğrudan Eşleşme</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>Ev Sahibi Kaydına Başla</span>
                  <span>→</span>
                </div>
              </div>
            </div>
          </div>
        ) : selectedRole === 'SCHOOL' ? (
          /* ========================================================================= */
          /* FORM 1: OKUL / GÖNDEREN KURUM FORMU                                        */
          /* ========================================================================= */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-9 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>{isEditing ? 'Kurum Bilgilerini Güncelle' : 'Okul / Gönderen Kurum Kurulumu'}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                  {isEditing ? 'Kurum Profilinizi Düzenleyin' : 'Okul Profilinizi Tanımlayın'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Erasmus+ KA121 / KA122 hareketlilik süreçlerinde kullanılmak üzere temel kurumsal bilgilerinizi giriniz.
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  ← Rol Değiştir
                </button>
              )}
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSchoolSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Kurumun Yasal Tam Adı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Nevşehir Mesleki ve Teknik Anadolu Lisesi"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Erasmus Kurum Kodu (OID)
                  </label>
                  <input
                    type="text"
                    placeholder="E10XXXXXX"
                    value={schoolOid}
                    onChange={(e) => setSchoolOid(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all uppercase"
                  />
                  {!isSchoolOidValid && (
                    <p className="text-xs text-rose-600 mt-1 font-medium">
                      Geçerli bir Erasmus OID formatı giriniz (Örn: E10123456).
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Bulunduğu Şehir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Nevşehir"
                    value={schoolCity}
                    onChange={(e) => setSchoolCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Erasmus VET Akreditasyon Durumu <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      accreditationStatus === 'YES'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accreditation"
                      value="YES"
                      checked={accreditationStatus === 'YES'}
                      onChange={() => setAccreditationStatus('YES')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Akredite Kurum (KA121-VET)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Kurumumuz Erasmus+ Mesleki Eğitim Akreditasyonuna sahiptir.
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      accreditationStatus === 'NO'
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accreditation"
                      value="NO"
                      checked={accreditationStatus === 'NO'}
                      onChange={() => setAccreditationStatus('NO')}
                      className="mt-1"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Kısa Dönem Proje (KA122-VET)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Akreditasyonumuz bulunmamakta, standart çağrılara başvurmaktayız.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Canlı Skor Önizlemesi */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold text-slate-700">Tahmini Başlangıç Hazırlık Skoru:</span>
                  <span className="font-bold text-slate-900">%{previewScore}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                    style={{ width: `${previewScore}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    Vazgeç
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    Geri Dön
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!canSubmitSchool || isSubmitting}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
                    !canSubmitSchool || isSubmitting
                      ? 'bg-slate-400 cursor-not-allowed opacity-70'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <span>İşleniyor...</span>
                  ) : (
                    <>
                      <span>{isEditing ? 'Bilgileri Güncelle ve Kaydet' : 'Kurulumu Tamamla ve Özet Gör'}</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORM 2: EV SAHİBİ KURUM / AVRUPALI İŞLETME FORMU (Sprint 2)              */
          /* ========================================================================= */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-9 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>Ev Sahibi Kurum Kaydı</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                  Ev Sahibi İşletme Profilinizi Oluşturun
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  Avrupa'daki işletmeniz veya eğitim merkeziniz için stajyer kabul kapasitesini ve sektör alanlarınızı tanımlayın.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                ← Rol Değiştir
              </button>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleHostSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  İşletme / Kurum Yasal Adı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: TechNordic Solutions GmbH"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Ülke <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={hostCountryCode}
                    onChange={(e) => setHostCountryCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flagEmoji || '🇪🇺'} {c.nameTr} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Şehir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Berlin"
                    value={hostCity}
                    onChange={(e) => setHostCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Faaliyet Sektörü <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={hostSector}
                    onChange={(e) => setHostSector(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
                  >
                    {sectors.map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.nameTr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Dönemlik Kabul Kapasitesi (Öğrenci)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={hostMaxLearners}
                    onChange={(e) => setHostMaxLearners(Number(e.target.value) || 1)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    İrtibat Yetkilisi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Markus Schmidt"
                    value={hostContactPerson}
                    onChange={(e) => setHostContactPerson(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    İletişim E-Posta Adresi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="placement@technordic.de"
                    value={hostContactEmail}
                    onChange={(e) => setHostContactEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                  />
                </div>
              </div>

              {/* Sunulan Faaliyetler */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Sunulan Hareketlilik Faaliyetleri
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hostActivities.includes('VET_INTERNSHIP')}
                      onChange={(e) => {
                        if (e.target.checked) setHostActivities([...hostActivities, 'VET_INTERNSHIP']);
                        else setHostActivities(hostActivities.filter((a) => a !== 'VET_INTERNSHIP'));
                      }}
                    />
                    <span className="font-semibold text-slate-800">Öğrenci Staj ve Beceri Eğitimi</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50/50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hostActivities.includes('JOB_SHADOWING')}
                      onChange={(e) => {
                        if (e.target.checked) setHostActivities([...hostActivities, 'JOB_SHADOWING']);
                        else setHostActivities(hostActivities.filter((a) => a !== 'JOB_SHADOWING'));
                      }}
                    />
                    <span className="font-semibold text-slate-800">Öğretmen İşbaşı Gözlem (Job Shadowing)</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  Geri Dön
                </button>

                <button
                  type="submit"
                  disabled={!canSubmitHost || isSubmitting}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
                    !canSubmitHost || isSubmitting
                      ? 'bg-slate-400 cursor-not-allowed opacity-70'
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <span>Kaydediliyor...</span>
                  ) : (
                    <>
                      <span>Ev Sahibi Kurum Kaydını Tamamla</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* Simple Clean Footer */}
      <footer className="py-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        CAPPINNO Mobility Nexus • Erasmus Mobility Management as a Service (EMaaS)
      </footer>
    </div>
  );
}
