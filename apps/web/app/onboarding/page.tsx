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
import LegalModal, { LegalTabType } from '../../components/ui/LegalModal';

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
    useState<AccreditationStatus | null>(null);
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
  const [hostConsentPublicDisplay, setHostConsentPublicDisplay] = useState(false);
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

  // Legal & i18n State (Kutular varsayılan olarak boştur / false)
  const { t, locale } = useTranslation();
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<LegalTabType>('LEGAL');
  const [legalConsentAccepted, setLegalConsentAccepted] = useState(false);
  const [schoolConsentPublicDisplay, setSchoolConsentPublicDisplay] = useState(false);

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
          setAccreditationStatus(currentOrg.accreditationStatus || null);
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
            setAccreditationStatus(orgData.accreditationStatus || null);
            setIsCheckingOrg(false);
            return;
          }

          const { data: hostData } = await apiClient.getUserHostOrganisation(user.id);
          if (!isMounted) return;
          if (hostData && hostData.name) {
            setCurrentHost(hostData);
            setSubmittedHost(hostData);
            setSelectedRole('HOST');
            setHostName(hostData.name || '');
            setHostCity(hostData.city || '');
            setIsCheckingOrg(false);
            return;
          }
        } catch (err) {
          // No organisation found, proceed to onboarding
        }
      }

      setIsCheckingOrg(false);
    }

    checkExistingOrg();

    return () => {
      isMounted = false;
    };
  }, [isUserLoaded, user?.id, isOnboarded, orgType, currentOrg, currentHost, setCurrentOrg, setCurrentHost]);

  // Validation - School
  const isSchoolOidEntered = schoolOid.trim().length > 0;
  const isSchoolOidFormatValid = /^E10[0-9]{5,7}$/i.test(schoolOid.trim());
  const isSchoolOidValid = !isSchoolOidEntered || isSchoolOidFormatValid;
  const canSubmitSchool =
    schoolName.trim().length >= 3 &&
    schoolCity.trim().length >= 2 &&
    isSchoolOidValid &&
    (accreditationStatus === 'YES' || accreditationStatus === 'NO') &&
    legalConsentAccepted;

  // Validation - Host (Tier 1 Quick Onboarding)
  const isHostOidEntered = hostOid.trim().length > 0;
  const isHostOidFormatValid = /^E10[0-9]{5,7}$/i.test(hostOid.trim());
  const isHostOidValid = !isHostOidEntered || isHostOidFormatValid;
  const canSubmitHost =
    hostName.trim().length >= 3 &&
    hostCity.trim().length >= 2 &&
    hostRegisteredAddress.trim().length >= 5 &&
    hostOid.trim().length >= 8 &&
    isHostOidFormatValid &&
    hostWebsite.trim().length >= 4 &&
    hostGeneralEmail.includes('@') &&
    hostTelephone.trim().length >= 5 &&
    hostContactPerson.trim().length >= 3 &&
    hostContactTitle.trim().length >= 2 &&
    hostContactEmail.includes('@') &&
    legalConsentAccepted;

  // 1. Okul Form Doluluk Oranı (%0 - %100)
  // Yalnızca geçerli ve eksiksiz doldurulan alanlara puan verilir; geçersiz OID puanı artırmaz!
  const calculateSchoolFormCompletion = () => {
    if (!schoolName.trim() && !schoolCity.trim() && !schoolOid.trim() && !accreditationStatus && !legalConsentAccepted) {
      return 0;
    }
    let completion = 0;
    if (schoolName.trim().length >= 3) completion += 25;
    if (schoolCity.trim().length >= 2) completion += 20;
    if (schoolCountryCode.trim().length >= 2 && schoolName.trim().length >= 3) completion += 15;
    if (accreditationStatus === 'YES' || accreditationStatus === 'NO') completion += 20;
    // YALNIZCA geçerli OID girildiğinde doluluk puanı eklenir. Geçersiz OID kesinlikle 0 puan!
    if (isSchoolOidEntered && isSchoolOidFormatValid) {
      completion += 20;
    }
    return Math.min(100, completion);
  };

  // 2. Okul Erasmus+ Proje Hazırlık Puanı (%0 - %100)
  // Kurumun resmi OID tescili ve akreditasyon gibi mevzuat kriterlerine dayalı başvuru gücüdür.
  // Boş formda başlangıç puanı KESİNLİKLE %0'dır. Geçersiz alanlara veya OID'ye puan verilmez!
  const calculateSchoolReadinessScore = () => {
    if (!schoolName.trim() && !schoolCity.trim() && !schoolOid.trim() && !accreditationStatus) {
      return 0;
    }
    let score = 0;
    if (schoolName.trim().length >= 3 && schoolCity.trim().length >= 2) {
      score += 30;
    }
    if (accreditationStatus === 'YES') {
      score += 35;
    } else if (accreditationStatus === 'NO') {
      score += 20;
    }
    // YALNIZCA geçerli OID girildiğinde puan verilir; geçersiz format ise 0 puan
    if (isSchoolOidEntered && isSchoolOidFormatValid) {
      score += 35;
    }
    return Math.min(100, score);
  };

  const schoolFormCompletionRate = calculateSchoolFormCompletion();
  const schoolReadinessScore = calculateSchoolReadinessScore();

  // 1. Host Form Doluluk Oranı (%0 - %100)
  const calculateHostFormCompletion = () => {
    if (!hostName.trim() && !hostCity.trim() && !hostOid.trim() && !hostWebsite.trim()) {
      return 0;
    }
    let completion = 0;
    if (hostName.trim().length >= 3) completion += 15;
    if (hostCity.trim().length >= 2 && hostRegisteredAddress.trim().length >= 5) completion += 15;
    if (hostWebsite.trim().length >= 4) completion += 10;
    if (hostGeneralEmail.includes('@')) completion += 10;
    if (hostTelephone.trim().length >= 5) completion += 10;
    if (hostContactPerson.trim().length >= 3 && hostContactEmail.includes('@')) completion += 20;
    if (isHostOidEntered && isHostOidFormatValid) completion += 20;
    return Math.min(100, completion);
  };

  // 2. Host Güven & Doğrulama Hazırlık Puanı (%0 - %100)
  const calculateHostTrustScore = () => {
    if (!hostName.trim() && !hostCity.trim() && !hostOid.trim()) return 0;
    let score = 0;
    if (hostName.trim().length >= 3 && hostCity.trim().length >= 2) score += 35;
    if (hostContactPerson.trim().length >= 3 && hostContactEmail.includes('@')) score += 35;
    if (isHostOidEntered && isHostOidFormatValid) score += 30;
    return Math.min(100, score);
  };

  const hostFormCompletionRate = calculateHostFormCompletion();
  const hostTrustScore = calculateHostTrustScore();

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
          accreditationStatus: accreditationStatus || 'UNKNOWN',
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
          accreditationStatus: accreditationStatus || 'UNKNOWN',
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
        err.message ||
          (locale === 'tr'
            ? 'Kurum işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.'
            : 'An error occurred during organisation action. Please try again.'),
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
        err.message ||
          (locale === 'tr'
            ? 'Ev sahibi kurum kaydı sırasında bir hata oluştu. Lütfen tekrar deneyin.'
            : 'An error occurred during host registration. Please try again.'),
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
          <span>
            {locale === 'tr'
              ? 'Kurumsal yetkiler ve profil durumu kontrol ediliyor...'
              : 'Verifying institutional authorizations and profile status...'}
          </span>
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
              E
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-slate-900 text-base">
                ErasmusMobility
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
      <main id="main-content" tabIndex={-1} className="max-w-3xl mx-auto w-full px-4 py-8 sm:py-12 flex-1 focus:outline-none">
        {/* ========================================================================= */}
        {/* DURUM 1: OKUL ÖZET KARTI (Gönderen Kurum Kayıtlı)                          */}
        {/* ========================================================================= */}
        {submittedOrg && !isEditing ? (
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden animate-fadeIn">
            {/* Header Banner */}
            <div className="p-6 sm:p-8 text-white" style={{ backgroundColor: primaryColor }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold tracking-wide uppercase mb-3">
                <span>✓</span>
                <span>
                  {locale === 'tr'
                    ? 'Okul / Gönderen Kurum Kaydı Tamamlandı'
                    : 'School / Sending Institution Registration Complete'}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 text-white">
                {submittedOrg.name}
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-xl leading-relaxed">
                {locale === 'tr'
                  ? 'Kurumunuz sisteme başarıyla tanımlandı. Artık KA121 / KA122 hareketlilik süreçlerinizi planlayabilir ve başvuru hazırlıklarına geçebilirsiniz.'
                  : 'Your institution has been successfully registered. You can now plan your KA121 / KA122 mobility cycles and proceed to application preparation.'}
              </p>
            </div>

            {/* Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    {locale === 'tr' ? 'Erasmus Kurum Kodu (OID)' : 'Erasmus Organisation ID (OID)'}
                  </div>
                  <div className="text-lg font-bold font-mono text-slate-900 mt-1">
                    {submittedOrg.oid || (locale === 'tr' ? 'Belirtilmedi' : 'Not specified')}
                  </div>
                  <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                    <span>🇪🇺</span>
                    <span>{locale === 'tr' ? 'Resmi Format Doğrulandı' : 'Official Format Verified'}</span>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    {locale === 'tr' ? 'Akreditasyon Durumu' : 'Accreditation Status'}
                  </div>
                  <div className="text-lg font-bold text-slate-900 mt-1">
                    {submittedOrg.accreditationStatus === 'YES'
                      ? (locale === 'tr' ? 'Erasmus+ Akredite Kurum (KA121)' : 'Erasmus+ Accredited Organisation (KA121)')
                      : submittedOrg.accreditationStatus === 'NO'
                        ? (locale === 'tr' ? 'Kısa Dönem Hareketlilik (KA122)' : 'Short-term Mobility (KA122)')
                        : (locale === 'tr' ? 'Doğrulanacak' : 'To be verified')}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-600">
                    {submittedOrg.accreditationStatus === 'YES'
                      ? (locale === 'tr'
                          ? 'Yıllık bütçe talebi ve Erasmus Planı ile uyumlu'
                          : 'Aligned with annual budget allocation and Erasmus Plan')
                      : (locale === 'tr'
                          ? 'Standart başvuru ve ihtiyaç analizi döngüsü'
                          : 'Standard competitive call and needs analysis cycle')}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    {locale === 'tr' ? 'Konum ve Ülke' : 'Location & Country'}
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1">
                    {submittedOrg.city || (locale === 'tr' ? 'Belirtilmedi' : 'Not specified')}, {submittedOrg.countryCode || 'TR'}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {locale === 'tr' ? 'Ulusal Ajans koordinasyonu' : 'National Agency coordination'}
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4">
                  <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                    {locale === 'tr' ? 'Sistem Yetki Rolü' : 'System Role'}
                  </div>
                  <div className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                    <span className="font-mono text-sm">{userRole || 'ORG_ADMIN'}</span>
                    <span className="text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2.5 py-0.5 rounded-full">
                      {locale === 'tr' ? 'Kurum Yöneticisi' : 'Organisation Administrator'}
                    </span>
                  </div>
                  <div className="mt-2 text-[11px] text-slate-500">
                    {locale === 'tr'
                      ? 'Kurum profili ve hareketlilik yönetimi yetkisi'
                      : 'Institutional profile and mobility management authorization'}
                  </div>
                </div>
              </div>

              {/* Skor Göstergesi */}
              <div className="border border-slate-200 rounded-xl p-5 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {locale === 'tr' ? 'BAŞLANGIÇ HAZIRLIK SKORU' : 'INITIAL READINESS SCORE'}
                    </span>
                    <p className="text-xs text-slate-500 m-0 mt-0.5">
                      {locale === 'tr'
                        ? 'Sabit kimlik verilerinize göre hesaplanan kurumsal hazırlık puanı'
                        : 'Institutional readiness score calculated from baseline verified data'}
                    </p>
                  </div>
                  <span className="text-2xl font-black text-slate-900">
                    %{submittedOrg.readinessScore ?? schoolReadinessScore}
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                    style={{ width: `${submittedOrg.readinessScore ?? schoolReadinessScore}%` }}
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
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 shadow-2xs cursor-pointer"
                >
                  {locale === 'tr' ? 'Bilgileri Düzenle' : 'Edit Information'}
                </button>

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>{locale === 'tr' ? "Hareketlilik Gateway'ine Başla" : 'Launch Mobility Gateway'}</span>
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
                  <span>{locale === 'tr' ? 'Aşama 1: Temel Kurum Kurulumu Tamamlandı' : 'Stage 1: Core Setup Completed'}</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold font-mono">
                  <span>OID: {submittedHost.oid || 'E10XXXXXX'}</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight m-0 text-white">
                {submittedHost.name}
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-xl leading-relaxed">
                {locale === 'tr' ? (
                  <>Avrupa ev sahibi kurumunuz sisteme başarıyla tanımlandı. Okullarla güvenle eşleşmek ve <strong>&quot;Doğrulanmış Partner&quot;</strong> rozeti almak için aşağıdaki adımları tamamlayabilirsiniz.</>
                ) : (
                  <>Your European host organisation has been registered. You can complete the following steps to match securely with schools and earn the <strong>&quot;Verified Partner&quot;</strong> badge.</>
                )}
              </p>
            </div>

            <div className="px-6 sm:px-8 pb-6 space-y-6">
              {/* Profil Tamamlama Çubuğu */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      {locale === 'tr' ? 'Kurumsal Profil Doluluk Oranı' : 'Institutional Profile Completeness'}
                    </span>
                    <p className="text-xs text-slate-500 m-0 mt-0.5">
                      {locale === 'tr'
                        ? 'Portföy ve doğrulama evraklarınızı ekledikçe okulların arama sonuçlarında üst sıralara çıkarsınız.'
                        : 'Adding portfolio items and verification documents boosts your ranking in school searches.'}
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
                    {locale === 'tr' ? 'Konum & Ülke' : 'Location & Country'}
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block">
                    {submittedHost.city}, {submittedHost.countryCode}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block truncate">
                    {submittedHost.registeredAddress || (locale === 'tr' ? 'Resmi Adres' : 'Registered Address')}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                    {locale === 'tr' ? 'Kurum Türü & Sektör' : 'Type & Sector'}
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block capitalize">
                    {submittedHost.organisationType || 'Company'}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block capitalize">
                    {locale === 'tr' ? `Sektör: ${submittedHost.primarySector}` : `Sector: ${submittedHost.primarySector}`}
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5">
                  <span className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider block">
                    {locale === 'tr' ? 'İrtibat Yetkilisi & İzin' : 'Contact Person & Consent'}
                  </span>
                  <span className="text-sm font-bold text-slate-900 mt-1 block truncate">
                    {submittedHost.contactPerson} ({submittedHost.contactTitle || (locale === 'tr' ? 'Yetkili' : 'Officer')})
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                    {locale === 'tr' ? '✓ Kamusal Profilde Gösterim Onaylı' : '✓ Public Visibility Approved'}
                  </span>
                </div>
              </div>

              {/* 3 AŞAMALI AKSİYON KARTLARI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Aşama 2: Portföy Kartı */}
                <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 mb-2">
                      {locale === 'tr' ? 'Aşama 2: Vitrin & Portföy' : 'Stage 2: Showcase & Portfolio'}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 m-0">
                      {locale === 'tr' ? 'Erasmus+ Portföyünü ve Detayları Ekle' : 'Add Erasmus+ Portfolio & Details'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed m-0">
                      {locale === 'tr'
                        ? 'Örnek hareketlilik programı, 150 kelimelik kısa açıklama, logo, LinkedIn ve geçmiş Türkiye deneyimlerinizi ekleyerek okulların sizi keşfetmesini sağlayın.'
                        : 'Upload sample syllabi, 150-word overview, company logo, and track record to make your profile stand out.'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsPortfolioModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors text-center cursor-pointer"
                  >
                    {locale === 'tr' ? '🎨 Portföyü Düzenle (%75-80 Doluluk)' : '🎨 Edit Portfolio (75-80% Progress)'}
                  </button>
                </div>

                {/* Aşama 3: Kurumsal Doğrulama / KYC Kartı */}
                <div className="border border-emerald-200 bg-emerald-50/40 rounded-xl p-5 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 mb-2">
                      {locale === 'tr' ? 'Aşama 3: Kurumsal Doğrulama' : 'Stage 3: Institutional Verification'}
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 m-0">
                      {locale === 'tr' ? 'Kurumsal Doğrulama & Rozet Başvurusu' : 'Corporate Verification & Badge Request'}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed m-0">
                      {locale === 'tr' ? (
                        <>Şirket sicil belgesi, vergi numarası, 7/24 acil durum kontağı ve katılımcı kanıt evraklarını yükleyerek <strong>&quot;Verified Partner&quot;</strong> rozeti kazanın.</>
                      ) : (
                        <>Upload registration documents, VAT identification, 24/7 emergency coordinates, and workshop photos to earn the <strong>&quot;Verified Partner&quot;</strong> badge.</>
                      )}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="w-full py-2.5 px-4 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors text-center cursor-pointer"
                  >
                    {locale === 'tr' ? '🛡️ Doğrulama Evrakları & Rozet Başvurusu' : '🛡️ Verification Documents & Badge Request'}
                  </button>
                </div>
              </div>

              {/* Alt Butonlar ve Admin Simülasyon Paneli */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                {isPlatformAdmin ? (
                  <button
                    type="button"
                    onClick={() => setIsAdminQueueModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200/80 cursor-pointer"
                  >
                    <span>👁️</span>
                    <span>{locale === 'tr' ? 'Yönetici Doğrulama Havuzunu İncele (Admin View)' : 'Review Admin Verification Queue (Admin View)'}</span>
                  </button>
                ) : (
                  <div />
                )}

                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm bg-slate-900 hover:bg-slate-800 transition-all shadow-md cursor-pointer"
                >
                  <span>{locale === 'tr' ? 'Platform Ana Sayfasına Git' : 'Go to Platform Home'}</span>
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
                  {locale === 'tr' ? 'Kurumun Yasal Tam Adı' : 'Legal Name of Organisation'} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={locale === 'tr' ? 'Örn: Nevşehir Mesleki ve Teknik Anadolu Lisesi' : 'e.g. Helsinki Vocational College'}
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {locale === 'tr' ? 'Erasmus Kurum Kodu (OID)' : 'Erasmus Organisation ID (OID)'}
                    <span className="text-slate-400 font-normal lowercase ml-1">
                      ({locale === 'tr' ? 'varsa' : 'optional'})
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="E10XXXXXX"
                    value={schoolOid}
                    onChange={(e) => setSchoolOid(e.target.value.toUpperCase())}
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-mono focus:outline-hidden focus:ring-2 transition-all uppercase ${
                      isSchoolOidEntered && !isSchoolOidFormatValid
                        ? 'border-rose-300 bg-rose-50/40 text-rose-900 focus:ring-rose-500'
                        : isSchoolOidEntered && isSchoolOidFormatValid
                        ? 'border-emerald-300 bg-emerald-50/20 text-emerald-900 focus:ring-emerald-500'
                        : 'border-slate-200 focus:ring-blue-600'
                    }`}
                  />
                  {isSchoolOidEntered && !isSchoolOidFormatValid && (
                    <p className="text-xs text-rose-600 mt-1.5 font-medium flex items-center gap-1">
                      <span>⚠️</span>
                      <span>
                        {locale === 'tr'
                          ? 'Geçersiz OID formatı! "E10" ile başlayıp 5-7 basamaklı olmalıdır (Örn: E10123456). Geçersiz alanlara puan verilmez.'
                          : 'Invalid OID format! Must begin with "E10" followed by 5 to 7 digits (e.g. E10123456).'}
                      </span>
                    </p>
                  )}
                  {isSchoolOidEntered && isSchoolOidFormatValid && (
                    <p className="text-xs text-emerald-600 mt-1.5 font-medium flex items-center gap-1">
                      <span>✓</span>
                      <span>
                        {locale === 'tr'
                          ? 'Geçerli Erasmus OID formatı (+35 Proje Hazırlık Puanı).'
                          : 'Valid Erasmus OID format (+35 Project Readiness Points).'}
                      </span>
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {locale === 'tr' ? 'Kayıtlı Ülke' : 'Country of Registration'} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={schoolCountryCode}
                    onChange={(e) => setSchoolCountryCode(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all bg-white"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flagEmoji || '🇪🇺'} {locale === 'tr' ? (c.nameTr || c.nameEn) : (c.nameEn || c.nameTr)} ({c.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    {locale === 'tr' ? 'Bulunduğu Şehir' : 'City / Location'} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={locale === 'tr' ? 'Örn: Nevşehir' : 'e.g. Helsinki'}
                    value={schoolCity}
                    onChange={(e) => setSchoolCity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-600 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  {locale === 'tr' ? 'Erasmus VET Akreditasyon Durumu' : 'Erasmus VET Accreditation Status'} <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      accreditationStatus === 'YES'
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accreditation"
                      value="YES"
                      checked={accreditationStatus === 'YES'}
                      onChange={() => setAccreditationStatus('YES')}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {locale === 'tr' ? 'Akredite Kurum (KA121-VET)' : 'Accredited Organisation (KA121-VET)'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {locale === 'tr'
                          ? 'Kurumumuz Erasmus+ Mesleki Eğitim Akreditasyonuna sahiptir (+35 Proje Hazırlık Puanı).'
                          : 'Our organisation holds an Erasmus+ VET Accreditation (+35 Readiness Points).'}
                      </div>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      accreditationStatus === 'NO'
                        ? 'border-blue-600 bg-blue-50/60 shadow-xs ring-2 ring-blue-500/10'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="accreditation"
                      value="NO"
                      checked={accreditationStatus === 'NO'}
                      onChange={() => setAccreditationStatus('NO')}
                      className="mt-1 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {locale === 'tr' ? 'Kısa Dönem Proje (KA122-VET)' : 'Short-term Mobility Project (KA122-VET)'}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {locale === 'tr'
                          ? 'Akreditasyonumuz bulunmamakta, standart çağrılara başvurmaktayız (+20 Proje Hazırlık Puanı).'
                          : 'No accreditation; we apply through standard competitive calls (+20 Readiness Points).'}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* İKİ AYRI NET METRİK: FORM DOLULUK ORANI & PROJE HAZIRLIK PUANI */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/80">
                {/* METRİK 1: Form Doluluk Oranı */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>📋</span>
                      <span>{locale === 'tr' ? 'Form Doluluk Oranı' : 'Form Completeness'}:</span>
                    </span>
                    <span className="font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-xs font-mono">
                      %{schoolFormCompletionRate}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                    <div
                      className="h-full rounded-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${schoolFormCompletionRate}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    {isSchoolOidEntered && !isSchoolOidFormatValid ? (
                      <span className="text-rose-600 font-semibold flex items-center gap-1">
                        <span>⚠️</span>
                        <span>{locale === 'tr' ? 'Geçersiz OID girildi, doluluk puanına eklenmedi.' : 'Invalid OID entered, not counted in completeness.'}</span>
                      </span>
                    ) : (
                      <span>{locale === 'tr' ? 'Zorunlu ve geçerli alanların eksiksizlik düzeyi.' : 'Completeness level of required and valid fields.'}</span>
                    )}
                  </div>
                </div>

                {/* METRİK 2: Proje Hazırlık Puanı */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 flex items-center gap-1.5">
                      <span>🎯</span>
                      <span>{locale === 'tr' ? 'Proje Hazırlık Puanı' : 'Project Readiness Score'}:</span>
                    </span>
                    <span className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-mono">
                      %{schoolReadinessScore}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                    <div
                      className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${schoolReadinessScore}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-500 leading-snug">
                    {locale === 'tr'
                      ? 'Resmi OID ve akreditasyon gücüne dayalı mevzuat hazırlığı. Geçersiz alanlara puan verilmez.'
                      : 'Readiness calculated from verified OID and accreditation standing. Invalid fields receive zero points.'}
                  </div>
                </div>
              </div>

              {/* 3 KATMANLI HUKUKİ BİLGİLENDİRME, KOŞULLARIN KABULÜ VE İSTEĞE BAĞLI İZİNLER */}
              <div className="space-y-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                {/* 1. KATMAN: HUKUKİ BİLGİLENDİRME (AYDINLATMA METNİ) - Bilgilendirme Notu, Kutusuz */}
                <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3 text-xs text-blue-900 flex items-start gap-2.5">
                  <span className="text-base shrink-0 mt-0.5">ℹ️</span>
                  <div className="leading-relaxed">
                    <span className="font-bold block text-blue-950 mb-0.5">
                      {locale === 'tr' ? 'Veri Güvenliği & Aydınlatma Bilgilendirmesi' : 'Data Protection Notice'}
                    </span>
                    <span>
                      {locale === 'tr' ? (
                        <>
                          6698 sayılı KVKK ve EU GDPR (2016/679) uyarınca kurumsal ve yetkili verilerinizin işlenme detayları hakkında{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setLegalTab('LEGAL');
                              setIsLegalModalOpen(true);
                            }}
                            className="font-bold text-blue-700 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                          >
                            KVKK & GDPR Aydınlatma Metni
                          </button>
                          &apos;nden bilgi edinebilirsiniz.
                        </>
                      ) : (
                        <>
                          Read our{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setLegalTab('LEGAL');
                              setIsLegalModalOpen(true);
                            }}
                            className="font-bold text-blue-700 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                          >
                            Privacy Policy & Information Notice
                          </button>
                          {' '}for data processing statutory rights.
                        </>
                      )}
                    </span>
                  </div>
                </div>

                {/* 2. KATMAN: ZORUNLU PLATFORM KOŞULLARI KABULÜ - Varsayılan: Boş (false) */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs flex items-start gap-3 shadow-2xs">
                  <input
                    type="checkbox"
                    id="schoolLegalConsent"
                    checked={legalConsentAccepted}
                    onChange={(e) => setLegalConsentAccepted(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    required
                  />
                  <label htmlFor="schoolLegalConsent" className="text-slate-700 leading-relaxed cursor-pointer select-none">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      {locale === 'tr' ? 'Platform Katılım ve Kullanım Koşulları Onayı (Zorunlu) *' : 'Platform Participation & Terms Acceptance (Mandatory) *'}
                    </span>
                    <span>
                      {locale === 'tr' ? (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setLegalTab('TERMS');
                              setIsLegalModalOpen(true);
                            }}
                            className="font-bold text-blue-700 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                          >
                            Platform Katılım Koşulları ve Hizmet Şartları
                          </button>
                          &apos;nı okudum, temsil ettiğim kurum adına tüm koşulları kabul ve beyan ederim.
                        </>
                      ) : (
                        <>
                          I have read and agree on behalf of my organisation to the{' '}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              setLegalTab('TERMS');
                              setIsLegalModalOpen(true);
                            }}
                            className="font-bold text-blue-700 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                          >
                            Platform Participation Terms & Conditions
                          </button>
                          .
                        </>
                      )}
                    </span>
                  </label>
                </div>

                {/* 3. KATMAN: İSTEĞE BAĞLI İZİNLER (KAMUSAL PROFİL İLETİŞİM GÖSTERİMİ) - Varsayılan: Boş (false) */}
                <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs flex items-start gap-3 shadow-2xs">
                  <input
                    type="checkbox"
                    id="schoolPublicConsent"
                    checked={schoolConsentPublicDisplay}
                    onChange={(e) => setSchoolConsentPublicDisplay(e.target.checked)}
                    className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="schoolPublicConsent" className="text-slate-600 leading-relaxed cursor-pointer select-none">
                    <span className="font-bold text-slate-900 block mb-0.5">
                      {locale === 'tr' ? 'Kamusal Profilde İletişim Bilgilerinin Sergilenmesi (İsteğe Bağlı)' : 'Public Directory Contact Details Display (Optional)'}
                    </span>
                    <span>
                      {locale === 'tr'
                        ? 'Ortak arayan diğer meslek liseleri ve Avrupalı ev sahibi işletmelerin kurumumuzla doğrudan iletişime geçebilmesi için irtibat yetkilisi ve kurumsal e-posta bilgilerimizin platform dizininde sergilenmesine açık rıza gösteriyorum. (İşaretlenmezse iletişim bilgileri gizli kalır).'
                        : 'I give explicit consent for our primary contact details to be publicly displayed in the directory for mobility coordinators. (If unchecked, details remain private).'}
                    </span>
                  </label>
                </div>
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
                        {locale === 'tr' ? 'Kurumun Yasal Tam Adı (Legal Name)' : 'Legal Name of Organisation'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={locale === 'tr' ? 'Örn: TechNordic Solutions GmbH' : 'e.g. TechNordic Solutions GmbH'}
                        value={hostName}
                        onChange={(e) => setHostName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Ticari / Marka Adı (Varsa)' : 'Trading / Brand Name (Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder={locale === 'tr' ? 'Örn: TechNordic' : 'e.g. TechNordic'}
                        value={hostTradingName}
                        onChange={(e) => setHostTradingName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Kurum Türü' : 'Organisation Type'} <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={hostOrgType}
                        onChange={(e) => setHostOrgType(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
                      >
                        <option value="Company">{locale === 'tr' ? 'Şirket / İşletme (SME / Company)' : 'Enterprise / SME (Company)'}</option>
                        <option value="NGO">{locale === 'tr' ? 'STK / Dernek / Vakıf (NGO)' : 'Non-Governmental Organisation (NGO)'}</option>
                        <option value="VET School">{locale === 'tr' ? 'Meslek Okulu / Kolej (VET School)' : 'VET School / College'}</option>
                        <option value="University">{locale === 'tr' ? 'Üniversite (University)' : 'Higher Education Institution (University)'}</option>
                        <option value="Training Centre">{locale === 'tr' ? 'Eğitim Merkezi (Training Centre)' : 'Vocational Training Centre'}</option>
                        <option value="Public Institution">{locale === 'tr' ? 'Kamu Kurumu (Public Institution)' : 'Public Institution / Regional Authority'}</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider m-0">
                          {locale === 'tr' ? 'Kayıtlı Ülke (Erasmus+ Program Ülkesi)' : 'Country of Registration'} <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-semibold">{locale === 'tr' ? '33 Program Ülkesi' : '33 Programme Countries'}</span>
                      </div>
                      <select
                        value={hostCountryCode}
                        onChange={(e) => setHostCountryCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
                      >
                        {countries.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flagEmoji || '🇪🇺'} {locale === 'tr' ? (c.nameTr || c.nameEn) : (c.nameEn || c.nameTr)} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Şehir / Bölge' : 'City / Region'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={locale === 'tr' ? 'Örn: Berlin' : 'e.g. Berlin'}
                        value={hostCity}
                        onChange={(e) => setHostCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Resmi Kayıtlı Adres (Registered Address)' : 'Official Registered Address'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={locale === 'tr' ? 'Örn: Friedrichstraße 120, 10117 Berlin' : 'e.g. Friedrichstraße 120, 10117 Berlin'}
                        value={hostRegisteredAddress}
                        onChange={(e) => setHostRegisteredAddress(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Kuruluş Yılı' : 'Year Established'} <span className="text-rose-500">*</span>
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
                      {locale === 'tr' ? 'Operasyonel Hizmet Adresi (Resmi adresten farklıysa)' : 'Operational Premises Address (If different from registered)'}
                    </label>
                    <input
                      type="text"
                      placeholder={locale === 'tr' ? 'Örn: Alexanderplatz 5, 10178 Berlin' : 'e.g. Alexanderplatz 5, 10178 Berlin'}
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
                    {locale === 'tr' ? '2. Erasmus+ Kimliği ve Kurumsal İletişim' : '2. Erasmus+ Identity & Institutional Contact'}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Erasmus+ OID Numarası' : 'Erasmus+ OID Number'} <span className="text-rose-500">*</span>
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
                          {locale === 'tr'
                            ? 'Geçerli bir Erasmus OID formatı giriniz (Örn: E10123456).'
                            : 'Please enter a valid Erasmus OID format (e.g. E10123456).'}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'PIC Numarası (Varsa)' : 'PIC Number (Optional)'}
                      </label>
                      <input
                        type="text"
                        placeholder={locale === 'tr' ? 'Örn: 987654321' : 'e.g. 987654321'}
                        value={hostPicNumber}
                        onChange={(e) => setHostPicNumber(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Resmi Web Sitesi' : 'Official Website'} <span className="text-rose-500">*</span>
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
                        {locale === 'tr' ? 'Genel E-Posta Adresi' : 'General Email Address'} <span className="text-rose-500">*</span>
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
                        {locale === 'tr' ? 'Telefon Numarası' : 'Telephone Number'} <span className="text-rose-500">*</span>
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
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider m-0">
                          {locale === 'tr' ? 'Kurumsal Faaliyet Sektörü (8 Ana Sektör Kümesi)' : 'Vocational Sector Cluster'} <span className="text-rose-500">*</span>
                        </label>
                        <span className="text-[11px] text-slate-500 font-semibold">{locale === 'tr' ? '8 Sektör' : '8 Sectors'}</span>
                      </div>
                      <select
                        value={hostSector}
                        onChange={(e) => setHostSector(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all bg-white"
                      >
                        {sectors.map((s) => (
                          <option key={s.code} value={s.code}>
                            {locale === 'tr' ? (s.nameTr || s.nameEn) : (s.nameEn || s.nameTr)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Dönemlik Stajyer Kapasitesi' : 'Internship Capacity Per Term'}
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
                    {locale === 'tr' ? '3. Hareketlilik İrtibat Yetkilisi' : '3. Primary Mobility Contact Person'}
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Yetkili Adı Soyadı' : 'Contact Person Full Name'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={locale === 'tr' ? 'Örn: Markus Schmidt' : 'e.g. Markus Schmidt'}
                        value={hostContactPerson}
                        onChange={(e) => setHostContactPerson(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Unvan / Görevi' : 'Job Title / Role'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={locale === 'tr' ? 'Örn: Mobility Coordinator' : 'e.g. Mobility Coordinator'}
                        value={hostContactTitle}
                        onChange={(e) => setHostContactTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                        {locale === 'tr' ? 'Yetkili Kurumsal E-Posta' : 'Corporate Email Address'} <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder={locale === 'tr' ? 'schmidt@technordic.de' : 'schmidt@technordic.de'}
                        value={hostContactEmail}
                        onChange={(e) => setHostContactEmail(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all"
                      />
                    </div>
                  </div>

                  {/* 3 KATMANLI HUKUKİ BİLGİLENDİRME, KOŞULLARIN KABULÜ VE İSTEĞE BAĞLI İZİNLER (HOST) */}
                  <div className="space-y-3 p-4 rounded-2xl border border-slate-200 bg-slate-50/70">
                    {/* 1. KATMAN: HUKUKİ BİLGİLENDİRME (AYDINLATMA METNİ) - Bilgilendirme Notu, Kutusuz */}
                    <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-xs text-emerald-950 flex items-start gap-2.5">
                      <span className="text-base shrink-0 mt-0.5">ℹ️</span>
                      <div className="leading-relaxed">
                        <span className="font-bold block text-emerald-950 mb-0.5">
                          {locale === 'tr' ? 'Hukuki Aydınlatma & Veri Koruma Bildirimi' : 'Statutory Data Protection Notice'}
                        </span>
                        <span>
                          {locale === 'tr' ? (
                            <>
                              6698 sayılı KVKK ve EU GDPR (2016/679) uyarınca ticari ve irtibat verilerinizin işlenmesine ilişkin detaylara{' '}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLegalTab('LEGAL');
                                  setIsLegalModalOpen(true);
                                }}
                                className="font-bold text-emerald-800 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                              >
                                KVKK & GDPR Aydınlatma Metni
                              </button>
                              &apos;nden ulaşabilirsiniz.
                            </>
                          ) : (
                            <>
                              Please read our{' '}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLegalTab('LEGAL');
                                  setIsLegalModalOpen(true);
                                }}
                                className="font-bold text-emerald-800 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                              >
                                Statutory Privacy & Data Protection Notice
                              </button>
                              {' '}pursuant to EU GDPR 2016/679.
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* 2. KATMAN: ZORUNLU PLATFORM KATILIM KOŞULLARI - Varsayılan: Boş (false) */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs flex items-start gap-3 shadow-2xs">
                      <input
                        type="checkbox"
                        id="hostLegalConsent"
                        checked={legalConsentAccepted}
                        onChange={(e) => setLegalConsentAccepted(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        required
                      />
                      <label htmlFor="hostLegalConsent" className="text-slate-700 leading-relaxed cursor-pointer select-none">
                        <span className="font-bold text-slate-900 block mb-0.5">
                          {locale === 'tr' ? 'Platform Katılım ve Hizmet Koşulları Onayı (Zorunlu) *' : 'Platform Terms & Participation Acceptance (Mandatory) *'}
                        </span>
                        <span>
                          {locale === 'tr' ? (
                            <>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLegalTab('TERMS');
                                  setIsLegalModalOpen(true);
                                }}
                                className="font-bold text-emerald-700 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                              >
                                Platform Katılım Koşulları ve Hizmet Şartları
                              </button>
                              &apos;nı okudum, temsil ettiğim ev sahibi kurum adına kabul ve taahhüt ederim.
                            </>
                          ) : (
                            <>
                              I have read and agree on behalf of my organisation to the{' '}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLegalTab('TERMS');
                                  setIsLegalModalOpen(true);
                                }}
                                className="font-bold text-emerald-700 underline cursor-pointer p-0 bg-transparent border-none text-xs inline"
                              >
                                Platform Participation Terms & Conditions
                              </button>
                              .
                            </>
                          )}
                        </span>
                      </label>
                    </div>

                    {/* 3. KATMAN: İSTEĞE BAĞLI İZİNLER (KAMUSAL PROFİLDE İLETİŞİM BİLGİSİ GÖSTERİMİ) - Varsayılan: Boş (false) */}
                    <div className="bg-white border border-slate-200 rounded-xl p-3.5 text-xs flex items-start gap-3 shadow-2xs">
                      <input
                        type="checkbox"
                        id="hostConsentPublicDisplay"
                        checked={hostConsentPublicDisplay}
                        onChange={(e) => setHostConsentPublicDisplay(e.target.checked)}
                        className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <label htmlFor="hostConsentPublicDisplay" className="text-slate-600 leading-relaxed cursor-pointer select-none">
                        <span className="font-bold text-slate-900 block mb-0.5">
                          {locale === 'tr' ? 'Kamusal Profilde İletişim Bilgilerinin Sergilenmesi (İsteğe Bağlı)' : 'Public Profile Contact Details Display (Optional)'}
                        </span>
                        <span>
                          {locale === 'tr'
                            ? 'İrtibat yetkilisinin adı, unvanı ve kurumsal e-posta adresinin, hareketlilik planlayan okullar ve kurumlar tarafından görülebilmesi için kurum profilimizde sergilenmesine açık rıza onayımı veriyorum. (İşaretlenmezse bilgiler yalnızca doğrulanmış eşleşmelerde paylaşılır).'
                            : 'I authorize the public display of the primary contact person’s name, title, and institutional email on our profile for mobility coordinators. (If unchecked, contact details remain private until a confirmed partnership).'}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

                {/* İKİ AYRI CANLI METRİK: FORM DOLULUK ORANI & DOĞRULAMA / GÜVEN PUANI */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl border border-slate-200 bg-slate-50/80">
                  {/* METRİK 1: Form Doluluk Oranı */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>📋</span>
                        <span>{locale === 'tr' ? 'Form Doluluk Oranı' : 'Form Completeness'}:</span>
                      </span>
                      <span className="font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-xs font-mono">
                        %{hostFormCompletionRate}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                      <div
                        className="h-full rounded-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${hostFormCompletionRate}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      {isHostOidEntered && !isHostOidFormatValid ? (
                        <span className="text-rose-600 font-semibold flex items-center gap-1">
                          <span>⚠️</span>
                          <span>{locale === 'tr' ? 'Geçersiz OID girildi, doluluk puanına eklenmedi.' : 'Invalid OID entered, not counted in completeness.'}</span>
                        </span>
                      ) : (
                        <span>{locale === 'tr' ? 'Kurumsal iletişim ve faaliyet alanlarının geçerlilik oranı.' : 'Completion rate of verified institutional details.'}</span>
                      )}
                    </div>
                  </div>

                  {/* METRİK 2: Doğrulama & Güven Puanı */}
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700 flex items-center gap-1.5">
                        <span>🛡️</span>
                        <span>{locale === 'tr' ? 'Doğrulama & Güven Puanı' : 'Trust & Verification Score'}:</span>
                      </span>
                      <span className="font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-mono">
                        %{hostTrustScore}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200/60">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${hostTrustScore}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 leading-snug">
                      {locale === 'tr'
                        ? 'Resmi OID ve iletişim teyidine dayalı güven skoru. Boş formda başlangıç puanı %0\'dır.'
                        : 'Trust score based on verified OID and registered contact points. Initial empty score is 0%.'}
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
                  <span className="font-bold text-slate-800 text-[11px] bg-slate-200 border border-slate-300/80 px-2 py-0.5 rounded-md">
                    {locale === 'tr' ? 'Kayıt Sonrası Portföy & KYC ile %100 Doğrulama' : 'Post-registration KYC for 100% Verification'}
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
          <span>ErasmusMobility • Erasmus Mobility Management as a Service (EMaaS)</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLegalTab('LEGAL');
                setIsLegalModalOpen(true);
              }}
              className="text-slate-500 hover:text-blue-700 hover:underline transition-colors font-medium cursor-pointer"
            >
              {locale === 'tr' ? 'KVKK Aydınlatma Metni' : 'GDPR Privacy Policy'}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setLegalTab('TERMS');
                setIsLegalModalOpen(true);
              }}
              className="text-slate-500 hover:text-blue-700 hover:underline transition-colors font-medium cursor-pointer"
            >
              {locale === 'tr' ? 'Kullanım Koşulları ve Açık Rıza' : 'Platform Participation Terms & Consent'}
            </button>
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

      {isPlatformAdmin && (
        <AdminVerificationQueueModal
          isOpen={isAdminQueueModalOpen}
          onClose={() => setIsAdminQueueModalOpen(false)}
        />
      )}

      {/* Language-exclusive Legal Modal */}
      <LegalModal
        isOpen={isLegalModalOpen}
        onClose={() => setIsLegalModalOpen(false)}
        initialTab={legalTab}
      />
    </div>
  );
}
