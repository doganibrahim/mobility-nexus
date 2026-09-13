'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUser, SignInButton } from '@clerk/nextjs';
import { apiClient } from '../../lib/api-client';
import { useAppStore } from '../../lib/store';
import { useTheme } from '../../lib/theme-context';
import { AccreditationStatus } from '@mobility-nexus/types';
import HostPortfolioModal from '../../components/host/HostPortfolioModal';
import HostVerificationModal from '../../components/host/HostVerificationModal';
import AdminVerificationQueueModal from '../../components/admin/AdminVerificationQueueModal';
import { useTranslation } from '../../lib/i18n';
import LegalModal from '../../components/ui/LegalModal';

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

  // Platform Admin verification check
  const adminEmails = (
    process.env.NEXT_PUBLIC_ADMIN_EMAILS ||
    'ibrahimdogan.js@gmail.com'
  )
    .toLowerCase()
    .split(',')
    .map((e) => e.trim());

  const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase() || '';
  const userRoleMeta = (user?.publicMetadata?.role as string)?.toUpperCase();

  const isPlatformAdmin = Boolean(
    user &&
      (userRoleMeta === 'SUPER_ADMIN' ||
        userRoleMeta === 'ADMIN' ||
        userRoleMeta === 'PLATFORM_ADMIN' ||
        user?.publicMetadata?.isAdmin === true ||
        (userEmail && adminEmails.includes(userEmail)))
  );

  // 1. School Form State
  const [schoolName, setSchoolName] = useState('');
  const [schoolOid, setSchoolOid] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolCountryCode, setSchoolCountryCode] = useState('TR');
  const [accreditationStatus, setAccreditationStatus] =
    useState<AccreditationStatus>('YES');
  const [role, setRole] = useState<'ORG_ADMIN' | 'MEMBER'>('ORG_ADMIN');

  // 2. Host Form State (Tier 1: Onboarding Quick Setup)
  const [hostName, setHostName] = useState('');
  const [hostTradingName, setHostTradingName] = useState('');
  const [hostOrgType, setHostOrgType] = useState('Company');
  const [hostCountryCode, setHostCountryCode] = useState('DE');
  const [hostCity, setHostCity] = useState('');
  const [hostRegisteredAddress, setHostRegisteredAddress] = useState('');
  const [hostOperationalAddress, setHostOperationalAddress] = useState('');
  const [hostYearEstablished, setHostYearEstablished] = useState<number>(2018);
  const [hostOid, setHostOid] = useState('');
  const [hostPicNumber, setHostPicNumber] = useState('');
  const [hostWebsite, setHostWebsite] = useState('');
  const [hostGeneralEmail, setHostGeneralEmail] = useState('');
  const [hostTelephone, setHostTelephone] = useState('');
  const [hostSector, setHostSector] = useState('ict');
  const [hostContactPerson, setHostContactPerson] = useState('');
  const [hostContactTitle, setHostContactTitle] = useState('');
  const [hostContactEmail, setHostContactEmail] = useState('');
  const [hostConsentPublicDisplay, setHostConsentPublicDisplay] = useState(true);
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

  // Host Modals State
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [isAdminQueueModalOpen, setIsAdminQueueModalOpen] = useState(false);

  // Legal & i18n State
  const { t, locale } = useTranslation();
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalConsentAccepted, setLegalConsentAccepted] = useState(true);

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

  // Validation - Host (Tier 1 Quick Onboarding)
  const isHostOidValid = !hostOid || /^E10[0-9]{5,7}$/i.test(hostOid.trim());
  const canSubmitHost =
    hostName.trim().length >= 3 &&
    hostCity.trim().length >= 2 &&
    hostRegisteredAddress.trim().length >= 5 &&
    hostOid.trim().length >= 8 &&
    isHostOidValid &&
    hostWebsite.trim().length >= 4 &&
    hostGeneralEmail.includes('@') &&
    hostTelephone.trim().length >= 5 &&
    hostContactPerson.trim().length >= 3 &&
    hostContactTitle.trim().length >= 2 &&
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

  // Handle Host Form Submit (Tier 1)
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
        tradingName: hostTradingName.trim() || undefined,
        organisationType: hostOrgType,
        countryCode: hostCountryCode,
        city: hostCity.trim(),
        registeredAddress: hostRegisteredAddress.trim(),
        operationalAddress: hostOperationalAddress.trim() || undefined,
        yearEstablished: Number(hostYearEstablished) || new Date().getFullYear(),
        oid: hostOid.trim().toUpperCase(),
        picNumber: hostPicNumber.trim() || undefined,
        websiteUrl: hostWebsite.trim(),
        generalEmail: hostGeneralEmail.trim().toLowerCase(),
        telephone: hostTelephone.trim(),
        primarySector: hostSector,
        workingLanguages: hostLanguages,
        contactPerson: hostContactPerson.trim(),
        contactTitle: hostContactTitle.trim(),
        contactEmail: hostContactEmail.trim().toLowerCase(),
        consentPublicDisplay: hostConsentPublicDisplay,
        maxLearnersPerTerm: hostMaxLearners,
        totalAnnualCapacity: hostMaxLearners * 3,
        activities: hostActivities,
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
                {locale === 'tr' ? 'Erasmus+ VET Kurum & Ev Sahibi Yönetimi' : 'Erasmus+ VET School & Host Portal'}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <span className="text-xs text-slate-500 hidden sm:inline">
                {locale === 'tr' ? 'Giriş yapan:' : 'Signed in as:'}{' '}
                <strong className="text-slate-800">
                  {user.fullName || user.primaryEmailAddress?.emailAddress}
                </strong>
              </span>
            ) : (
              <SignInButton mode="modal">
                <button
                  type="button"
                  className="text-xs font-bold text-slate-700 hover:text-slate-950 bg-white border border-slate-300 px-3 py-1.5 rounded-lg shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  {locale === 'tr' ? 'Giriş Yap' : 'Sign In'}
                </button>
              </SignInButton>
            )}
            <Link
              href="/"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg bg-white shadow-xs hover:bg-slate-50 transition-colors"
            >
              {t.profile.backHome}
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
                    <span>Resmi Format Doğrulandı</span>
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
          /* DURUM 2: EV SAHİBİ (HOST) ÖZET KARTI - 3 AŞAMALI İLERLEME                 */
          /* ========================================================================= */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fadeIn space-y-6">
            <div className="p-6 sm:p-8 text-white" style={{ backgroundColor: primaryColor }}>
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                  <span>✓</span>
                  <span>Aşama 1: Temel Kurum Kurulumu Tamamlandı</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold font-mono">
                  <span>OID: {submittedHost.oid || 'E10XXXXXX'}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 text-white">
                {submittedHost.name}
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-xl leading-relaxed">
                Avrupa ev sahibi kurumunuz sisteme başarıyla tanımlandı. Okullarla güvenle eşleşmek ve <strong>"Doğrulanmış Partner"</strong> rozeti almak için aşağıdaki adımları tamamlayabilirsiniz.
              </p>
            </div>

            <div className="px-6 sm:px-8 pb-6 space-y-6">
              {/* Profil Tamamlama Çubuğu */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Kurumsal Profil Doluluk Oranı
                    </span>
                    <p className="text-xs text-slate-500 m-0 mt-0.5">
                      Portföy ve doğrulama evraklarınızı ekledikçe okulların arama sonuçlarında üst sıralara çıkarsınız.
                    </p>
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    %{submittedHost.profileCompletenessScore || 40}
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                    style={{ width: `${submittedHost.profileCompletenessScore || 40}%` }}
                  ></div>
                </div>
              </div>

              {/* Kurum Bilgi Özeti Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                    Konum & Ülke
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    {submittedHost.city}, {submittedHost.countryCode}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block truncate">
                    {submittedHost.registeredAddress || 'Resmi Adres'}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                    Kurum Türü & Sektör
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block capitalize">
                    {submittedHost.organisationType || 'Company'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block capitalize">
                    Sektör: {submittedHost.primarySector}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                    İrtibat Yetkilisi & İzin
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
                    {submittedHost.contactPerson} ({submittedHost.contactTitle || 'Yetkili'})
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                    ✓ Kamusal Profilde Gösterim Onaylı
                  </span>
                </div>
              </div>

              {/* 3 AŞAMALI AKSİYON KARTLARI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Aşama 2: Portföy Kartı */}
                <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 mb-2">
                      Aşama 2: Vitrin & Portföy
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 m-0">
                      Erasmus+ Portföyünü ve Detayları Ekle
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed m-0">
                      Örnek hareketlilik programı, 150 kelimelik kısa açıklama, logo, LinkedIn ve geçmiş Türkiye deneyimlerinizi ekleyerek okulların sizi keşfetmesini sağlayın.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPortfolioModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors text-center"
                  >
                    🎨 Portföyü Düzenle (%75-80 Doluluk)
                  </button>
                </div>

                {/* Aşama 3: Kurumsal Doğrulama / KYC Kartı */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                      Aşama 3: Admin Only Doğrulama
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 m-0">
                      Kurumsal Doğrulama & Rozet Başvurusu
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed m-0">
                      Şirket sicil belgesi, vergi numarası, 7/24 acil durum kontağı ve katılımcı kanıt evraklarını yükleyerek <strong>"Verified Partner"</strong> rozeti kazanın.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors text-center"
                  >
                    🛡️ Doğrulama Evraklarını Yükle (Admin Only)
                  </button>
                </div>
              </div>

              {/* Alt Butonlar ve Admin Simülasyon Paneli */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsAdminQueueModalOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/80"
                >
                  <span>👁️</span>
                  <span>Yönetici Doğrulama Havuzunu İncele (Admin View)</span>
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm bg-slate-900 hover:bg-slate-800 transition-all shadow-md"
                >
                  <span>Platform Ana Sayfasına Git</span>
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
                <span>{t.onboarding.roleSelectBadge}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight m-0">
                {t.onboarding.roleSelectTitle}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed m-0">
                {t.onboarding.roleSelectSubtitle}
              </p>
            </div>

            {/* Guest Notice for Unauthenticated Visitors */}
            {!user && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border-2 border-blue-200 bg-blue-50/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
                    <span>💡</span>
                    <span>{t.guestOnboarding.guestNoticeBadge}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-slate-900 m-0">
                    {t.guestOnboarding.guestNoticeTitle}
                  </h3>
                  <p className="text-xs text-slate-600 m-0 leading-relaxed">
                    {t.guestOnboarding.guestNoticeDesc}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <SignInButton mode="modal">
                    <button
                      type="button"
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      {t.guestOnboarding.guestNoticeBtn}
                    </button>
                  </SignInButton>
                </div>
              </div>
            )}

            {/* Platform Admin Bilgilendirme Bannerı (Düz, Sade ve Net Tasarım - Sıfır Gradient) */}
            {isPlatformAdmin && (
              <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-xs border-2 border-slate-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider border border-slate-200">
                    <span>🛡️</span>
                    <span>{t.onboarding.adminBadge}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 m-0">
                    {t.onboarding.adminTitle}
                  </h3>
                  <p className="text-xs text-slate-600 m-0 leading-relaxed">
                    {t.onboarding.adminDesc}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setIsAdminQueueModalOpen(true)}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5"
                  >
                    <span>🛡️</span>
                    <span>{t.onboarding.adminQueueBtn}</span>
                  </button>
                  <Link
                    href="/"
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all border border-slate-300 flex items-center gap-1"
                  >
                    <span>{t.onboarding.goToHomeBtn}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Çift Kart Seçimi */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
                    {t.onboarding.schoolCardBadge}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {t.onboarding.schoolCardTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {t.onboarding.schoolCardDesc}
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t.onboarding.schoolFeature1}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t.onboarding.schoolFeature2}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t.onboarding.schoolFeature3}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-blue-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>{t.onboarding.schoolCardAction}</span>
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
                    {t.onboarding.hostCardBadge}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {t.onboarding.hostCardTitle}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {t.onboarding.hostCardDesc}
                  </p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t.onboarding.hostFeature1}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t.onboarding.hostFeature2}</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{t.onboarding.hostFeature3}</span>
                    </li>
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-emerald-600 font-bold text-xs group-hover:translate-x-1 transition-transform">
                  <span>{t.onboarding.hostCardAction}</span>
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
                  <span>{isEditing ? t.onboarding.schoolUpdateBadge : t.onboarding.schoolSetupBadge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                  {isEditing ? t.onboarding.schoolEditTitle : t.onboarding.schoolFormTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {t.onboarding.schoolFormSubtitle}
                </p>
              </div>

              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t.onboarding.changeRole}
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

              {/* KVKK / GDPR Rıza Onayı (Dile Göre Ayrık) */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-start gap-3">
                <input
                  type="checkbox"
                  id="schoolLegalConsent"
                  checked={legalConsentAccepted}
                  onChange={(e) => setLegalConsentAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="schoolLegalConsent" className="text-slate-600 leading-relaxed cursor-pointer select-none">
                  {locale === 'tr' ? (
                    <>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsLegalModalOpen(true);
                        }}
                        className="font-bold text-blue-700 hover:underline inline p-0 m-0 bg-transparent border-none text-xs"
                      >
                        6698 sayılı KVKK Aydınlatma Metni
                      </button>
                      &apos;ni okudum, kişisel ve kurumsal verilerimin bu kapsamda işlenmesini onaylıyorum.
                    </>
                  ) : (
                    <>
                      I have read and agree to the{' '}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsLegalModalOpen(true);
                        }}
                        className="font-bold text-blue-700 hover:underline inline p-0 m-0 bg-transparent border-none text-xs"
                      >
                        GDPR Privacy Policy (Regulation EU 2016/679)
                      </button>
                      .
                    </>
                  )}
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    {t.onboarding.cancel}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedRole(null)}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                  >
                    {t.onboarding.back}
                  </button>
                )}

                <button
                  type="submit"
                  disabled={!canSubmitSchool || isSubmitting || !legalConsentAccepted}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
                    !canSubmitSchool || isSubmitting || !legalConsentAccepted
                      ? 'bg-slate-400 cursor-not-allowed opacity-70'
                      : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <span>{locale === 'tr' ? 'İşleniyor...' : 'Processing...'}</span>
                  ) : (
                    <>
                      <span>{isEditing ? t.onboarding.updateAndSave : t.onboarding.completeAndReview}</span>
                      <span>✓</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* FORM 2: EV SAHİBİ KURUM (HOST) - AŞAMA 1 HIZLI ONBOARDING                 */
          /* ========================================================================= */
          <div className="bg-white border border-slate-200 rounded-2xl shadow-lg p-6 sm:p-9 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold mb-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  <span>{t.onboarding.hostSetupBadge}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight m-0">
                  {t.onboarding.hostFormTitle}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                  {t.onboarding.hostFormSubtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedRole(null)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {t.onboarding.changeRole}
              </button>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleHostSubmit} className="space-y-8">
              {/* BÖLÜM 1: Kurum Kimliği ve Tüzel Bilgiler */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                  <span className="text-base">🏢</span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    {t.onboarding.hostSection1}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Kurumun Yasal Tam Adı (Legal Name) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: TechNordic Solutions GmbH"
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Ticari / Marka Adı (Varsa)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: TechNordic"
                        value={hostTradingName}
                        onChange={(e) => setHostTradingName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Kurum Türü <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={hostOrgType}
                        onChange={(e) => setHostOrgType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
                      >
                        <option value="Company">Şirket / İşletme (SME / Company)</option>
                        <option value="NGO">STK / Dernek / Vakıf (NGO)</option>
                        <option value="VET School">Meslek Okulu / Kolej (VET School)</option>
                        <option value="University">Üniversite (University)</option>
                        <option value="Training Centre">Eğitim Merkezi (Training Centre)</option>
                        <option value="Public Institution">Kamu Kurumu (Public Institution)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Kayıtlı Ülke <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={hostCountryCode}
                        onChange={(e) => setHostCountryCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
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
                        Şehir / Bölge <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Berlin"
                        value={hostCity}
                        onChange={(e) => setHostCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Resmi Kayıtlı Adres (Registered Address) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Friedrichstraße 120, 10117 Berlin"
                        value={hostRegisteredAddress}
                        onChange={(e) => setHostRegisteredAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Kuruluş Yılı <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min={1800}
                        max={2030}
                        value={hostYearEstablished}
                        onChange={(e) => setHostYearEstablished(Number(e.target.value) || 2015)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                      Operasyonel Hizmet Adresi (Resmi adresten farklıysa)
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Alexanderplatz 5, 10178 Berlin"
                      value={hostOperationalAddress}
                      onChange={(e) => setHostOperationalAddress(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* BÖLÜM 2: Erasmus+ ve Dijital İletişim */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                  <span className="text-base">🇪🇺</span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    2. Erasmus+ Kimliği ve Kurumsal İletişim
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Erasmus+ OID Numarası <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="E10123456"
                        value={hostOid}
                        onChange={(e) => setHostOid(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all uppercase"
                      />
                      {!isHostOidValid && hostOid.length > 0 && (
                        <p className="text-xs text-rose-600 mt-1 font-medium">
                          Geçerli bir Erasmus OID formatı giriniz (Örn: E10123456).
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        PIC Numarası (Varsa)
                      </label>
                      <input
                        type="text"
                        placeholder="Örn: 987654321"
                        value={hostPicNumber}
                        onChange={(e) => setHostPicNumber(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Resmi Web Sitesi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="url"
                        required
                        placeholder="https://technordic.de"
                        value={hostWebsite}
                        onChange={(e) => setHostWebsite(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Genel E-Posta Adresi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="info@technordic.de"
                        value={hostGeneralEmail}
                        onChange={(e) => setHostGeneralEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Telefon Numarası <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+49 30 1234567"
                        value={hostTelephone}
                        onChange={(e) => setHostTelephone(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
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
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
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
                        Dönemlik Stajyer Kapasitesi
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={hostMaxLearners}
                        onChange={(e) => setHostMaxLearners(Number(e.target.value) || 1)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* BÖLÜM 3: Ana İrtibat Yetkilisi ve Açık Rıza */}
              <div>
                <div className="flex items-center gap-2 pb-2 mb-4 border-b border-slate-100">
                  <span className="text-base">👤</span>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                    3. Hareketlilik İrtibat Yetkilisi
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Yetkili Adı Soyadı <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Markus Schmidt"
                        value={hostContactPerson}
                        onChange={(e) => setHostContactPerson(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Unvan / Görevi <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Örn: Mobility Coordinator"
                        value={hostContactTitle}
                        onChange={(e) => setHostContactTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        Yetkili Kurumsal E-Posta <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="schmidt@technordic.de"
                        value={hostContactEmail}
                        onChange={(e) => setHostContactEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* Açık Rıza / Consent Checkbox (Kamusal Profil Gösterimi) */}
                  <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 text-xs">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hostConsentPublicDisplay}
                        onChange={(e) => setHostConsentPublicDisplay(e.target.checked)}
                        className="mt-0.5 rounded-md text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="text-slate-700 leading-relaxed">
                        <span className="font-bold text-slate-900 block mb-0.5">
                          Kamusal Profilde İletişim Bilgilerinin Sergilenmesi Açık Rıza Onayı
                        </span>
                        <span>
                          İrtibat yetkilisinin adı, unvanı ve kurumsal e-posta adresinin, hareketlilik planlayan okullar tarafından görülebilmesi için kurum profilimizde sergilenmesini onaylıyorum.
                        </span>
                      </div>
                    </label>
                  </div>

                  {/* KVKK / GDPR Hukuki Aydınlatma (Dile Göre Ayrık) */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-xs flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="hostLegalConsent"
                      checked={legalConsentAccepted}
                      onChange={(e) => setLegalConsentAccepted(e.target.checked)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <label htmlFor="hostLegalConsent" className="text-slate-600 leading-relaxed cursor-pointer select-none">
                      {locale === 'tr' ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsLegalModalOpen(true);
                            }}
                            className="font-bold text-emerald-700 hover:underline inline p-0 m-0 bg-transparent border-none text-xs"
                          >
                            6698 sayılı KVKK Aydınlatma Metni
                          </button>
                          &apos;ni okudum, ev sahibi kurum ve yetkili verilerimizin bu kapsamda işlenmesini onaylıyorum.
                        </>
                      ) : (
                        <>
                          I confirm that I have read and agree to the{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsLegalModalOpen(true);
                            }}
                            className="font-bold text-emerald-700 hover:underline inline p-0 m-0 bg-transparent border-none text-xs"
                          >
                            EU GDPR 2016/679 Privacy Policy
                          </button>
                          .
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Bilgilendirme Notu */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-600 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-base">💡</span>
                  <span>
                    {t.onboarding.kycNotice}
                  </span>
                </div>
                <span className="font-bold text-slate-900 text-[11px] bg-slate-200 px-2 py-0.5 rounded-md">
                  {locale === 'tr' ? 'Başlangıç Puanı: %40' : 'Initial Score: 40%'}
                </span>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
                >
                  {t.onboarding.back}
                </button>

                <button
                  type="submit"
                  disabled={!canSubmitHost || isSubmitting || !legalConsentAccepted}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all shadow-sm ${
                    !canSubmitHost || isSubmitting || !legalConsentAccepted
                      ? 'bg-slate-400 cursor-not-allowed opacity-70'
                      : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                  }`}
                >
                  {isSubmitting ? (
                    <span>{locale === 'tr' ? 'Kuruluyor...' : 'Registering...'}</span>
                  ) : (
                    <>
                      <span>{t.onboarding.completeHostSetup}</span>
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
      <footer className="py-4 px-4 text-center text-xs text-slate-500 border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CAPPINNO Mobility Nexus • Erasmus Mobility Management as a Service (EMaaS)</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsLegalModalOpen(true)}
              className="text-slate-500 hover:text-blue-700 hover:underline transition-colors font-medium"
            >
              {locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'GDPR Privacy Policy'}
            </button>
            <span>•</span>
            <span className="text-slate-400">{locale === 'tr' ? 'Gizlilik & Güvenlik' : 'Privacy & Security'}</span>
          </div>
        </div>
      </footer>

      {/* Host Tier 2 & Tier 3 & Admin Modals */}
      {submittedHost && (
        <>
          <HostPortfolioModal
            isOpen={isPortfolioModalOpen}
            onClose={() => setIsPortfolioModalOpen(false)}
            host={submittedHost}
            onSuccess={(updated) => {
              setSubmittedHost(updated);
              setCurrentHost(updated);
            }}
          />

          <HostVerificationModal
            isOpen={isVerificationModalOpen}
            onClose={() => setIsVerificationModalOpen(false)}
            host={submittedHost}
            onSuccess={(updated) => {
              setSubmittedHost(updated);
              setCurrentHost(updated);
            }}
          />
        </>
      )}

      <AdminVerificationQueueModal
        isOpen={isAdminQueueModalOpen}
        onClose={() => setIsAdminQueueModalOpen(false)}
      />

      {/* Language-exclusive Legal Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
      />
    </div>
  );
}
