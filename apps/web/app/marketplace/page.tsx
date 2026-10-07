'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useAppStore } from '@/lib/store';
import { useTranslation } from '@/lib/i18n';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import {
  Course,
  CourseSession,
  JobShadowingOffer,
  MarketplaceApplication,
} from '@mobility-nexus/types';
import { CourseCard } from '@/components/marketplace/CourseCard';
import { JobShadowingCard } from '@/components/marketplace/JobShadowingCard';
import { CourseSessionPickerModal } from '@/components/marketplace/CourseSessionPickerModal';
import { MarketplaceApplicationModal } from '@/components/marketplace/MarketplaceApplicationModal';
import { HostCreateCourseModal } from '@/components/marketplace/HostCreateCourseModal';
import { HostCreateSessionModal } from '@/components/marketplace/HostCreateSessionModal';
import { HostCreateJobShadowingModal } from '@/components/marketplace/HostCreateJobShadowingModal';
import { HostApplicationReviewModal } from '@/components/marketplace/HostApplicationReviewModal';
import { ERASMUS_COUNTRIES } from '@/lib/countries';
import {
  GraduationCap,
  Building2,
  Calendar,
  Search,
  Users,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
  RefreshCw,
} from 'lucide-react';

type BeneficiaryTab = 'COURSES' | 'JOB_SHADOWING' | 'MY_APPLICATIONS';
type HostTab = 'INBOX' | 'MY_COURSES' | 'MY_JOB_SHADOWING';

export default function MarketplacePage() {
  const { user, isLoaded } = useUser();
  const { orgType, currentHost, currentOrg } = useAppStore();
  const { locale } = useTranslation();
  const isTr = locale === 'tr';

  // Determine user role strictly:
  // If user metadata says HOST or store has currentHost -> HOST.
  // Otherwise -> BENEFICIARY.
  const isAutoHost = orgType === 'HOST' || Boolean(currentHost);
  const [activeRole, setActiveRole] = useState<'BENEFICIARY' | 'HOST'>('BENEFICIARY');

  useEffect(() => {
    if (isAutoHost) {
      setActiveRole('HOST');
    }
  }, [isAutoHost]);

  // Host selection for Host portal
  const [activeHostId, setActiveHostId] = useState(currentHost?.id || 'host-de-bavaria');

  // Tabs for each role
  const [beneTab, setBeneTab] = useState<BeneficiaryTab>('COURSES');
  const [hostTab, setHostTab] = useState<HostTab>('INBOX');

  // Data State
  const [courses, setCourses] = useState<Course[]>([]);
  const [jobOffers, setJobOffers] = useState<JobShadowingOffer[]>([]);
  const [applications, setApplications] = useState<MarketplaceApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Beneficiary Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [selectedIsced, setSelectedIsced] = useState<string>('ALL');

  // Modals
  const [pickerCourse, setPickerCourse] = useState<Course | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [appTargetCourse, setAppTargetCourse] = useState<Course | null>(null);
  const [appTargetSession, setAppTargetSession] = useState<CourseSession | null>(null);
  const [appTargetJobShadowing, setAppTargetJobShadowing] = useState<JobShadowingOffer | null>(null);

  // Host Modals
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);
  const [isCreateSessionOpen, setIsCreateSessionOpen] = useState(false);
  const [isCreateJobShadowingOpen, setIsCreateJobShadowingOpen] = useState(false);
  const [sessionCourseTarget, setSessionCourseTarget] = useState<Course | null>(null);
  const [reviewAppTarget, setReviewAppTarget] = useState<MarketplaceApplication | null>(null);

  // Fetch initial data
  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [coursesRes, jobRes, appsRes] = await Promise.all([
        fetch('/api/marketplace/courses'),
        fetch('/api/marketplace/job-shadowing'),
        fetch('/api/marketplace/applications'),
      ]);

      const coursesData = await coursesRes.json();
      const jobData = await jobRes.json();
      const appsData = await appsRes.json();

      if (coursesData.success) setCourses(coursesData.courses);
      if (jobData.success) setJobOffers(jobData.offers);
      if (appsData.success) setApplications(appsData.applications);
    } catch (err) {
      console.error('Failed to load marketplace data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();

    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      const iscedParam = params.get('isced');
      const countryParam = params.get('country');
      const queryParam = params.get('q');
      const roleParam = params.get('role');

      if (tabParam === 'JOB_SHADOWING' || tabParam === 'job-shadowing') {
        setBeneTab('JOB_SHADOWING');
      } else if (tabParam === 'COURSES' || tabParam === 'courses') {
        setBeneTab('COURSES');
      } else if (tabParam === 'MY_APPLICATIONS' || tabParam === 'applications') {
        setBeneTab('MY_APPLICATIONS');
      }

      if (iscedParam) setSelectedIsced(iscedParam);
      if (countryParam) setSelectedCountry(countryParam);
      if (queryParam) setSearchQuery(queryParam);
      if (roleParam === 'HOST' || roleParam === 'host') setActiveRole('HOST');
    }
  }, [loadData]);

  // Available Host profiles for Host mode
  const HOST_PROFILES = [
    {
      id: 'host-de-bavaria',
      name: 'Bavaria VET & Industry 4.0 Academy',
      city: 'München',
      country: 'DE',
      oid: 'E10294821',
    },
    {
      id: 'host-fi-nordic',
      name: 'Nordic Sustainability & Skills Institute',
      city: 'Helsinki',
      country: 'FI',
      oid: 'E10183742',
    },
    {
      id: 'host-it-mechatronics',
      name: 'Milano Mechatronics & Robotics Center',
      city: 'Milano',
      country: 'IT',
      oid: 'E10339102',
    },
  ];

  const activeHost =
    HOST_PROFILES.find((h) => h.id === activeHostId) || HOST_PROFILES[0];

  // Beneficiary Handlers
  const handleOpenCourseDetails = (course: Course) => {
    setPickerCourse(course);
    setIsPickerOpen(true);
  };

  const handleApplyFromPicker = (course: Course, session: CourseSession) => {
    setIsPickerOpen(false);
    setAppTargetCourse(course);
    setAppTargetSession(session);
    setAppTargetJobShadowing(null);
    setApplicationModalOpen(true);
  };

  const handleApplyDirect = (course: Course, session?: CourseSession) => {
    setAppTargetCourse(course);
    setAppTargetSession(session || null);
    setAppTargetJobShadowing(null);
    setApplicationModalOpen(true);
  };

  const handleApplyJobShadowing = (offer: JobShadowingOffer) => {
    setAppTargetCourse(null);
    setAppTargetSession(null);
    setAppTargetJobShadowing(offer);
    setApplicationModalOpen(true);
  };

  // Host Handlers
  const handleOpenAddSession = (course: Course) => {
    setSessionCourseTarget(course);
    setIsCreateSessionOpen(true);
  };

  // Beneficiary Filtered Courses
  const filteredCourses = courses.filter((c) => {
    const matchCountry = selectedCountry === 'ALL' || c.hostCountry === selectedCountry;
    const matchIsced = selectedIsced === 'ALL' || c.iscedCode.startsWith(selectedIsced);
    const matchSearch =
      !searchQuery ||
      c.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.hostCity.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCountry && matchIsced && matchSearch;
  });

  // Beneficiary Filtered Job Shadowing Offers
  const filteredJobOffers = jobOffers.filter((j) => {
    const matchCountry = selectedCountry === 'ALL' || j.country === selectedCountry;
    const matchSearch =
      !searchQuery ||
      j.titleTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.hostName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.city.toLowerCase().includes(searchQuery.toLowerCase());

    return matchCountry && matchSearch;
  });

  // Host Specific Data (Isolated to this Host)
  const hostCourses = courses.filter((c) => c.hostId === activeHostId);
  const hostJobOffers = jobOffers.filter((j) => j.hostId === activeHostId);
  const hostApplications = applications.filter((a) => a.hostId === activeHostId);
  const pendingHostApps = hostApplications.filter((a) => a.status === 'PENDING');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 transition-colors duration-150">
      {/* 1. Official Platform AppHeader */}
      <AppHeader />

      {/* 2. Institutional Breadcrumb & Clean Role Mode Switcher */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>{isTr ? 'Ana Sayfa' : 'Home'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <Link
              href="/platform"
              className="font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              {isTr ? 'Platform' : 'Platform'}
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-bold text-slate-900">
              {activeRole === 'HOST'
                ? (isTr ? 'Ev Sahibi Kurum Konsolu (Host Provider)' : 'Host Institution Console (Host Provider)')
                : (isTr ? 'Eğitim & Fırsat Pazar Yeri (Yararlanıcı Okul)' : 'Training & Opportunity Marketplace (Beneficiary School)')}
            </span>
          </div>

          {/* Role Mode Switcher */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-slate-500">{isTr ? 'Çalışma Alanı:' : 'Workspace:'}</span>
            <div className="inline-flex items-center p-0.5 rounded-lg bg-slate-200/80 border border-slate-300">
              <button
                type="button"
                onClick={() => setActiveRole('BENEFICIARY')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  activeRole === 'BENEFICIARY'
                    ? 'bg-white text-blue-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏛️ {isTr ? 'Gönderen Okul' : 'Sending School'}
              </button>
              <button
                type="button"
                onClick={() => setActiveRole('HOST')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                  activeRole === 'HOST'
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🏢 {isTr ? 'Ev Sahibi Kuruluş' : 'Host Institution'}
                {pendingHostApps.length > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-500 text-white font-black text-[10px]">
                    {pendingHostApps.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. STRICT ROLE VIEW: BENEFICIARY (Gönderen Okul / Yararlanıcı)         */}
      {/* ===================================================================== */}
      {activeRole === 'BENEFICIARY' && (
        <main id="main-content" tabIndex={-1} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 focus:outline-hidden">
          {/* Header Title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>🎓</span>
                <span>{isTr ? 'Avrupa Mesleki Eğitim ve İşbaşı Gözlem Kataloğu' : 'European VET Course & Job Shadowing Catalogue'}</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {isTr
                  ? "Avrupa'daki onaylı eğitim kursları, işbaşı gözlem kontenjanları ve okulunuzun katılım başvuruları."
                  : 'Accredited training courses, job shadowing opportunities across Europe, and your mobility applications.'}
              </p>
            </div>

            {/* Beneficiary Navigation Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl shrink-0">
              <button
                type="button"
                onClick={() => setBeneTab('COURSES')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  beneTab === 'COURSES'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isTr ? 'Kurs Kataloğu' : 'Course Catalogue'} ({courses.length})
              </button>
              <button
                type="button"
                onClick={() => setBeneTab('JOB_SHADOWING')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  beneTab === 'JOB_SHADOWING'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isTr ? 'İşbaşı Gözlem' : 'Job Shadowing'} ({jobOffers.length})
              </button>
              <button
                type="button"
                onClick={() => setBeneTab('MY_APPLICATIONS')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  beneTab === 'MY_APPLICATIONS'
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isTr ? 'Taleplerim' : 'My Applications'} ({applications.length})
              </button>
            </div>
          </div>

          {/* SINGLE Official Erasmus+ Grant Notice Banner */}
          <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-xs text-blue-950 flex items-start gap-3">
            <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>{isTr ? 'Erasmus+ Kurs Ücreti Desteği:' : 'Erasmus+ Course Fee Support:'}</strong>{' '}
              {isTr
                ? 'Mesleki eğitim personel hareketliliği (KA121 / KA122) kapsamında, katılımcı öğretmen başına günlük 80 € (maksimum 10 gün / 800 €) kurs ücreti hibesi doğrudan proje bütçenizden karşılanır.'
                : 'Under VET staff mobility (KA121 / KA122), a daily course fee grant of 80 € per participating teacher (maximum 10 days / 800 €) is covered directly by your approved project budget.'}
            </div>
          </div>

          {/* TAB 1: COURSES */}
          {beneTab === 'COURSES' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isTr ? 'Kurs, konu veya şehir ara...' : 'Search course, topic, or city...'}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                  />
                </div>

                <div>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs bg-white text-slate-700"
                  >
                    <option value="ALL">🌍 {isTr ? `Tüm Ülkeler (${ERASMUS_COUNTRIES.length})` : `All Countries (${ERASMUS_COUNTRIES.length})`}</option>
                    {ERASMUS_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flagEmoji} {isTr ? (c.nameTr || c.nameEn) : (c.nameEn || c.nameTr)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={selectedIsced}
                    onChange={(e) => setSelectedIsced(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs bg-white text-slate-700"
                  >
                    <option value="ALL">📐 {isTr ? 'Tüm ISCED Meslek Alanları' : 'All ISCED Vocational Fields'}</option>
                    <option value="0714">0714 - {isTr ? 'Otomasyon & Robotik' : 'Automation & Robotics'}</option>
                    <option value="0712">0712 - {isTr ? 'Çevre & Yeşil Beceriler' : 'Environment & Green Skills'}</option>
                    <option value="0612">0612 - {isTr ? 'Bilişim & Siber Güvenlik' : 'Informatics & Cyber Security'}</option>
                    <option value="0413">0413 - {isTr ? 'Dual VET & Yönetim' : 'Dual VET & Management'}</option>
                    <option value="1013">1013 - {isTr ? 'Gastronomi & Mutfak' : 'Gastronomy & Culinary'}</option>
                  </select>
                </div>
              </div>

              {/* H2 Section Header for Heading Hierarchy (WCAG 2.4.6) */}
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 m-0">
                  {isTr ? 'Mevcut Kurs ve Hareketlilik Fırsatları' : 'Available Mobility Opportunities'}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredCourses.length} {isTr ? 'kurs listeleniyor' : 'courses listed'}
                </span>
              </div>

              {/* Grid */}
              {filteredCourses.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-2">
                  <Search className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">{isTr ? 'Aramanıza Uygun Kurs Bulunamadı' : 'No Matching Courses Found'}</p>
                  <p className="text-xs text-slate-500">{isTr ? 'Farklı bir ülke veya meslek alanı seçebilirsiniz.' : 'Try selecting another country or vocational field.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onSelect={handleOpenCourseDetails}
                      onApplyDirect={handleApplyDirect}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: JOB SHADOWING */}
          {beneTab === 'JOB_SHADOWING' && (
            <div className="space-y-6">
              {/* Filter bar */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isTr ? 'İşletme veya şehir ara...' : 'Search enterprise or city...'}
                    className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs"
                  />
                </div>
                <div>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-hidden text-xs bg-white text-slate-700"
                  >
                    <option value="ALL">🌍 {isTr ? `Tüm Ülkeler (${ERASMUS_COUNTRIES.length})` : `All Countries (${ERASMUS_COUNTRIES.length})`}</option>
                    {ERASMUS_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flagEmoji} {isTr ? (c.nameTr || c.nameEn) : (c.nameEn || c.nameTr)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* H2 Section Header for Heading Hierarchy (WCAG 2.4.6) */}
              <div className="flex items-center justify-between pb-1">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 m-0">
                  {isTr ? 'Avrupa İşbaşı Gözlem Kontenjanları' : 'European Job Shadowing Opportunities'}
                </h2>
                <span className="text-xs text-slate-500 font-medium">
                  {filteredJobOffers.length} {isTr ? 'fırsat listeleniyor' : 'opportunities listed'}
                </span>
              </div>

              {filteredJobOffers.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-2">
                  <p className="text-sm font-semibold text-slate-700">{isTr ? 'Seçilen filtrelerle eşleşen işbaşı gözlem bulunamadı.' : 'No matching job shadowing offers found.'}</p>
                  <p className="text-xs text-slate-500">{isTr ? 'Ülke filtresini değiştirerek veya aramayı temizleyerek tekrar deneyin.' : 'Try changing the country filter or clearing your search.'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredJobOffers.map((offer) => (
                    <JobShadowingCard
                      key={offer.id}
                      offer={offer}
                      onApply={handleApplyJobShadowing}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: MY APPLICATIONS */}
          {beneTab === 'MY_APPLICATIONS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 m-0">
                  {isTr ? 'Okulunuz Tarafından İletilen Başvurular ve Durumları' : 'Applications Submitted by Your School and Their Status'}
                </h2>
                <button
                  type="button"
                  onClick={loadData}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isTr ? 'Yenile' : 'Refresh'}</span>
                </button>
              </div>

              <div className="space-y-3">
                {applications.map((app) => {
                  const isConfirmed = app.status === 'CONFIRMED';
                  const isDeclined = app.status === 'DECLINED';

                  return (
                    <div
                      key={app.id}
                      className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isDeclined
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isConfirmed && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {isConfirmed
                              ? (isTr ? 'ONAYLANDI (Kontenjan Ayrıldı)' : 'CONFIRMED (Quota Reserved)')
                              : isDeclined
                              ? (isTr ? 'REDDEDİLDİ' : 'DECLINED')
                              : (isTr ? 'ONAY BEKLİYOR' : 'AWAITING CONFIRMATION')}
                          </span>
                          <span className="text-xs font-mono text-slate-400">ID: {app.id}</span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900">
                          {app.courseTitle || app.jobShadowingTitle}
                        </h4>

                        <p className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                          <span>{isTr ? 'Ev Sahibi:' : 'Host:'} <strong>{app.hostName}</strong></span>
                          <span>•</span>
                          <span>{isTr ? 'Katılımcı:' : 'Participants:'} <strong>{app.participantCount} {isTr ? 'Öğretmen' : 'Staff'}</strong> ({app.durationDays} {isTr ? 'Gün' : 'Days'})</span>
                          {app.sessionDates && (
                            <>
                              <span>•</span>
                              <span>{isTr ? 'Tarihler:' : 'Dates:'} <strong>{app.sessionDates}</strong></span>
                            </>
                          )}
                        </p>

                        {app.hostDecisionNote && (
                          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 mt-2">
                            <strong className="text-slate-900">{isTr ? 'Ev Sahibi Kurum Notu:' : 'Host Institution Note:'}</strong> "{app.hostDecisionNote}"
                          </div>
                        )}
                      </div>

                      <div className="sm:text-right shrink-0">
                        <span className="text-[11px] font-bold text-slate-500 uppercase block">
                          {isTr ? 'Öngörülen Hibe Bütçesi' : 'Estimated Grant Budget'}
                        </span>
                        <span className="text-base font-extrabold text-slate-900">
                          {app.totalGrantEur.toLocaleString(isTr ? 'tr-TR' : 'en-US')} €
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* 4. STRICT ROLE VIEW: HOST PORTAL (Ev Sahibi / Kurs Sağlayıcı)         */}
      {/* ===================================================================== */}
      {activeRole === 'HOST' && (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Host Top Profile Header */}
          <div className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase">
                  {isTr ? 'Ev Sahibi Kurum Paneli' : 'Host Institution Console'}
                </div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeHost.name} ({activeHost.city}, {activeHost.country})
                </h2>
                <span className="text-xs text-slate-500 font-mono">OID: {activeHost.oid}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">{isTr ? 'Kurum Seçimi:' : 'Select Institution:'}</span>
              <select
                value={activeHostId}
                onChange={(e) => setActiveHostId(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold bg-white text-slate-800 outline-hidden"
              >
                {HOST_PROFILES.map((hp) => (
                  <option key={hp.id} value={hp.id}>
                    {hp.name} ({hp.city})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Host Navigation Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setHostTab('INBOX')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  hostTab === 'INBOX'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>📥 {isTr ? 'Gelen Başvurular' : 'Incoming Applications'} ({hostApplications.length})</span>
                {pendingHostApps.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-900 font-black text-[10px]">
                    {pendingHostApps.length}
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setHostTab('MY_COURSES')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  hostTab === 'MY_COURSES'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>{isTr ? 'Kurslarım & Seans Kontenjanları' : 'My Courses & Quotas'} ({hostCourses.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setHostTab('MY_JOB_SHADOWING')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  hostTab === 'MY_JOB_SHADOWING'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>{isTr ? 'İşbaşı Gözlem Slotları' : 'Job Shadowing Slots'} ({hostJobOffers.length})</span>
              </button>
            </div>

            {hostTab === 'MY_COURSES' && (
              <button
                type="button"
                onClick={() => setIsCreateCourseOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isTr ? 'Yeni Kurs Tanımla' : 'Define New Course'}</span>
              </button>
            )}
          </div>

          {/* HOST TAB 1: INBOX */}
          {hostTab === 'INBOX' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">
                  {isTr ? 'Okullardan Kurumunuza Gelen Başvurular' : 'Applications Received from Partner Schools'}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {pendingHostApps.length} {isTr ? 'onay bekleyen talep' : 'pending review'}
                </span>
              </div>

              {hostApplications.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">{isTr ? 'Henüz Gelen Başvuru Yok' : 'No Incoming Applications Yet'}</h4>
                  <p className="text-xs text-slate-500">
                    {isTr ? 'Kursa ve seanslara okullar başvurdukça bu havuzda listelenecektir.' : 'Incoming applications will appear here as schools apply to your courses and sessions.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hostApplications.map((app) => {
                    const isPending = app.status === 'PENDING';
                    const isConfirmed = app.status === 'CONFIRMED';
                    const isDeclined = app.status === 'DECLINED';

                    return (
                      <div
                        key={app.id}
                        className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                isConfirmed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isDeclined
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {isConfirmed
                                ? (isTr ? 'ONAYLANDI' : 'CONFIRMED')
                                : isDeclined
                                ? (isTr ? 'REDDEDİLDİ' : 'DECLINED')
                                : (isTr ? 'YENİ TALEP' : 'NEW REQUEST')}
                            </span>

                            <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
                              OID: {app.schoolOid}
                            </span>
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700">
                              {app.projectType}
                            </span>
                          </div>

                          <h4 className="text-base font-bold text-slate-900">{app.schoolName}</h4>

                          <p className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                            <span>{isTr ? 'Yetkili:' : 'Contact:'} <strong>{app.contactName}</strong></span>
                            <span>•</span>
                            <span>{isTr ? 'E-posta:' : 'Email:'} <strong>{app.contactEmail}</strong></span>
                            <span>•</span>
                            <span>{isTr ? 'Talep:' : 'Request:'} <strong>{app.participantCount} {isTr ? 'Katılımcı' : 'Participants'}</strong> ({app.durationDays} {isTr ? 'Gün' : 'Days'})</span>
                          </p>

                          <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                            <span>
                              {isTr ? 'Faaliyet:' : 'Activity:'} <strong>{app.courseTitle || app.jobShadowingTitle}</strong>
                              {app.sessionDates && ` (${app.sessionDates})`}
                            </span>
                            <span className="font-bold text-emerald-800">
                              {isTr ? 'Bütçe:' : 'Budget:'} {app.totalGrantEur.toLocaleString(isTr ? 'tr-TR' : 'en-US')} €
                            </span>
                          </div>

                          {app.hostDecisionNote && (
                            <p className="text-xs text-slate-500 italic">
                              {isTr ? 'Karar Notu:' : 'Decision Note:'} "{app.hostDecisionNote}"
                            </p>
                          )}
                        </div>

                        <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0">
                          <button
                            type="button"
                            onClick={() => setReviewAppTarget(app)}
                            className="px-4 py-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-xs"
                          >
                            {isTr ? 'İncele & Karar Ver' : 'Review & Decide'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* HOST TAB 2: MY COURSES */}
          {hostTab === 'MY_COURSES' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hostCourses.map((course) => {
                  const sessions = course.sessions || [];

                  return (
                    <div
                      key={course.id}
                      className="p-5 rounded-xl border border-slate-200/90 bg-white shadow-2xs flex flex-col justify-between space-y-4"
                    >
                      <div>
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                          ISCED {course.iscedCode}
                        </span>
                        <h4 className="text-base font-bold text-slate-900 mt-2">
                          {isTr ? (course.titleTr || course.titleEn) : (course.titleEn || course.titleTr)}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {isTr ? (course.descriptionTr || course.descriptionEn) : (course.descriptionEn || course.descriptionTr)}
                        </p>
                      </div>

                      {/* Sessions Box */}
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-blue-600" />
                            {isTr ? 'Oturum Takvimi & Doluluk' : 'Session Calendar & Capacity'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleOpenAddSession(course)}
                            className="text-[11px] font-bold text-blue-700 hover:underline flex items-center gap-0.5"
                          >
                            <Plus className="w-3 h-3" />
                            {isTr ? 'Yeni Seans Ekle' : 'Add New Session'}
                          </button>
                        </div>

                        {sessions.length === 0 ? (
                          <p className="text-xs text-slate-400 py-1">
                            {isTr ? 'Henüz seans planlanmadı.' : 'No sessions scheduled yet.'}
                          </p>
                        ) : (
                          <div className="space-y-2">
                            {sessions.map((ses) => {
                              const percent = Math.min(
                                100,
                                Math.round((ses.enrolledCount / ses.capacity) * 100)
                              );
                              const isFull = ses.status === 'FULL';

                              return (
                                <div
                                  key={ses.id}
                                  className="p-2.5 bg-white rounded-lg border border-slate-200 text-xs"
                                >
                                  <div className="flex items-center justify-between font-semibold text-slate-800">
                                    <span>
                                      {ses.startDate} — {ses.endDate} ({ses.city})
                                    </span>
                                    <span
                                      className={`text-[11px] ${
                                        isFull ? 'text-rose-600 font-bold' : 'text-slate-600'
                                      }`}
                                    >
                                      {ses.enrolledCount} / {ses.capacity} ({percent}%)
                                    </span>
                                  </div>
                                  <div className="w-full h-1.5 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                                    <div
                                      className={`h-full ${
                                        isFull
                                          ? 'bg-rose-500'
                                          : percent >= 80
                                          ? 'bg-amber-500'
                                          : 'bg-emerald-500'
                                      }`}
                                      style={{ width: `${percent}%` }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* HOST TAB 3: MY JOB SHADOWING */}
          {hostTab === 'MY_JOB_SHADOWING' && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isTr ? 'Kurumunuzun Aktif İşbaşı Gözlem (Job Shadowing) Kontenjanları' : 'Active Job Shadowing Slots'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isTr
                      ? "Avrupa'dan gelecek meslek lisesi öğretmenleri ve eğiticiler için atölye/laboratuvar gözlem slotları oluşturun."
                      : 'Create workshop and laboratory observation slots for visiting European VET teachers.'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateJobShadowingOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-98 text-white text-xs font-semibold transition-all shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isTr ? 'Yeni İşbaşı Gözlem İlanı Ver' : 'Publish Job Shadowing Offer'}</span>
                </button>
              </div>

              {hostJobOffers.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-xl border border-slate-200 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800">
                    {isTr ? 'Henüz İşbaşı Gözlem İlanı Vermediniz' : 'No Job Shadowing Offers Published Yet'}
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {isTr
                      ? 'Atölye veya laboratuvar imkanlarınızı Avrupalı meslek öğretmenlerine açarak işbirliği ağınızı genişletin.'
                      : 'Open your workshop facilities to European vocational teachers and expand your partnership network.'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateJobShadowingOpen(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isTr ? 'İlk İlanı Tanımla' : 'Define First Offer'}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {hostJobOffers.map((jso) => (
                    <div
                      key={jso.id}
                      className="p-5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {isTr ? 'Aktif Slot' : 'Active Slot'}
                        </span>
                        <span className="text-xs text-slate-500">
                          {isTr
                            ? `Maks. ${jso.maxCapacityPerSlot} Öğretmen / Dönem`
                            : `Max ${jso.maxCapacityPerSlot} Staff / Term`}
                        </span>
                      </div>

                      <h4 className="text-base font-bold text-slate-900">
                        {isTr ? (jso.titleTr || jso.titleEn) : (jso.titleEn || jso.titleTr)}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {isTr ? (jso.descriptionTr || jso.descriptionEn) : (jso.descriptionEn || jso.descriptionTr)}
                      </p>
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <span>
                          {isTr ? 'Sektör:' : 'Sector:'} <strong>{jso.vetField}</strong> ({jso.city}, {jso.country})
                        </span>
                        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                          {jso.durationDays} {isTr ? 'Gün' : 'Days'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      )}

      {/* 5. Official AppFooter */}
      <AppFooter />

      {/* MODALS */}
      {/* 1. Beneficiary Course Details & Session Picker */}
      <CourseSessionPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        course={pickerCourse}
        onSelectSession={handleApplyFromPicker}
      />

      {/* 2. Beneficiary Application Form */}
      <MarketplaceApplicationModal
        isOpen={applicationModalOpen}
        onClose={() => setApplicationModalOpen(false)}
        course={appTargetCourse}
        session={appTargetSession}
        jobShadowing={appTargetJobShadowing}
        onSuccess={loadData}
      />

      {/* 3. Host Create Course Modal */}
      <HostCreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
        hostId={activeHost.id}
        hostName={activeHost.name}
        hostCountry={activeHost.country}
        hostCity={activeHost.city}
        hostOid={activeHost.oid}
        onSuccess={loadData}
      />

      {/* 4. Host Add Session Modal */}
      <HostCreateSessionModal
        isOpen={isCreateSessionOpen}
        onClose={() => setIsCreateSessionOpen(false)}
        course={sessionCourseTarget}
        onSuccess={loadData}
      />

      {/* 5. Host Review Application Modal */}
      <HostApplicationReviewModal
        isOpen={Boolean(reviewAppTarget)}
        onClose={() => setReviewAppTarget(null)}
        application={reviewAppTarget}
        onSuccess={loadData}
      />

      {/* 6. Host Create Job Shadowing Slot */}
      <HostCreateJobShadowingModal
        isOpen={isCreateJobShadowingOpen}
        onClose={() => setIsCreateJobShadowingOpen(false)}
        hostId={activeHost.id}
        hostName={activeHost.name}
        hostCountry={activeHost.country}
        hostCity={activeHost.city}
        onSuccess={loadData}
      />
    </div>
  );
}
