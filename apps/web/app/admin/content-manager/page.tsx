'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppHeader from '@/components/layout/AppHeader';
import AppFooter from '@/components/layout/AppFooter';
import { Course, JobShadowingOffer, CmsContentRevision } from '@mobility-nexus/types';
import { LibraryDocument } from '@/lib/library-db';
import { CourseEditorModal } from '@/components/admin/cms/CourseEditorModal';
import { DocumentUploadModal } from '@/components/admin/cms/DocumentUploadModal';
import { AdminCreateCourseModal } from '@/components/admin/cms/AdminCreateCourseModal';
import { CategoryTagManager } from '@/components/admin/cms/CategoryTagManager';
import {
  BookOpen,
  Briefcase,
  FileText,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
  History,
  ShieldCheck,
  Tag,
  RefreshCw,
  Clock,
  ArrowRight,
  Compass,
} from 'lucide-react';

export default function AdminContentManagerPage() {
  const [activeTab, setActiveTab] = useState<'COURSES' | 'JOB_SHADOWING' | 'LIBRARY' | 'CATEGORIES_TAGS' | 'REVISIONS'>('COURSES');

  // Courses state
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [selectedCourseForEdit, setSelectedCourseForEdit] = useState<Course | null>(null);
  const [isCreateCourseOpen, setIsCreateCourseOpen] = useState(false);

  // Job Shadowing state
  const [jobOffers, setJobOffers] = useState<JobShadowingOffer[]>([]);
  const [jobSearch, setJobSearch] = useState('');

  // Library Documents state
  const [documents, setDocuments] = useState<LibraryDocument[]>([]);
  const [docSearch, setDocSearch] = useState('');
  const [selectedDocForEdit, setSelectedDocForEdit] = useState<LibraryDocument | null>(null);
  const [isDocModalOpen, setIsDocModalOpen] = useState(false);

  // Revisions state
  const [revisions, setRevisions] = useState<CmsContentRevision[]>([]);

  // Global loading & feedback
  const [isLoading, setIsLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/admin/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (e) {
      console.error('Error fetching courses:', e);
    }
  };

  const fetchJobOffers = async () => {
    try {
      const res = await fetch('/api/marketplace/job-shadowing');
      if (res.ok) {
        const data = await res.json();
        setJobOffers(data.offers || []);
      }
    } catch (e) {
      console.error('Error fetching job offers:', e);
    }
  };

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/admin/library/documents');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching library documents:', e);
    }
  };

  const fetchRevisions = async () => {
    try {
      const res = await fetch('/api/admin/cms/revisions');
      if (res.ok) {
        const data = await res.json();
        setRevisions(data.data || []);
      }
    } catch (e) {
      console.error('Error fetching CMS revisions:', e);
    }
  };

  const loadAll = async () => {
    setIsLoading(true);
    await Promise.all([fetchCourses(), fetchJobOffers(), fetchDocuments(), fetchRevisions()]);
    setIsLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDeleteDocument = async (id: string, title: string) => {
    if (!window.confirm(`"${title}" dokümanını kütüphaneden silmek istediğinize emin misiniz?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/library/documents/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedbackMsg(`"${title}" başarıyla silindi.`);
        fetchDocuments();
        fetchRevisions();
      }
    } catch (e) {
      console.error('Error deleting doc:', e);
    }
  };

  // Filtered lists
  const filteredCourses = courses.filter((c) =>
    `${c.titleTr} ${c.titleEn} ${c.hostName} ${c.hostCity} ${c.iscedName} ${(c.tags || []).join(' ')}`
      .toLowerCase()
      .includes(courseSearch.toLowerCase())
  );

  const filteredJobs = jobOffers.filter((j) =>
    `${j.titleTr} ${j.titleEn} ${j.hostName} ${j.city} ${j.vetField}`
      .toLowerCase()
      .includes(jobSearch.toLowerCase())
  );

  const filteredDocs = documents.filter((d) =>
    `${d.titleTr} ${d.titleEn} ${d.category} ${(d.tags || []).join(' ')}`
      .toLowerCase()
      .includes(docSearch.toLowerCase())
  );

  // Extract all tags for manager
  const allDocTags = Array.from(
    new Set([
      ...documents.flatMap((d) => d.tags || []),
      ...courses.flatMap((c) => c.tags || []),
    ])
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-150">
      <AppHeader />

      {/* Institutional Breadcrumb */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>Ana Sayfa</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              Admin CMS & Dinamik İçerik Yönetim Konsolu
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              <span>Platform Admin Rolü Doğrulandı</span>
            </span>
            <span>•</span>
            <span className="font-bold text-blue-700">PKG-02 AKTİF</span>
          </div>
        </div>
      </div>

      <main id="main-content" tabIndex={-1} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-10 flex-1 w-full space-y-6 focus:outline-hidden">
        {/* Feedback Alert */}
        {feedbackMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 flex items-center justify-between text-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
            <button onClick={() => setFeedbackMsg(null)} className="text-emerald-600 hover:text-emerald-800 font-bold">
              Kapat
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
              <Layers className="w-3.5 h-3.5" />
              <span>Merkezi CMS Konsolu</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Kod Bağımsız Dinamik İçerik & Revizyon Takibi</span>
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
                Pazar Yeri ve Kütüphane İçerik Yönetimi
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl m-0 leading-relaxed">
                Platform yöneticisi olarak yeni yapılandırılmış eğitim kursları, oturum takvimleri ve Kütüphane altındaki resmi form/kılavuz belgelerini anında yayına alın, kategorileri ve revizyon geçmişini denetleyin.
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Link
                href="/marketplace"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Pazar Yerini Gör</span>
              </Link>
              <Link
                href="/library"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                <span>Kütüphaneyi Gör</span>
              </Link>
              <Link
                href="/admin/coordination"
                className="px-3.5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Okul Destek Masası</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-100">
            <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200">
              <div className="text-[11px] font-bold text-blue-900">Aktif Kurslar</div>
              <div className="text-xl font-black text-blue-950">{courses.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
              <div className="text-[11px] font-bold text-emerald-900">İşbaşı Gözlem İlanları</div>
              <div className="text-xl font-black text-emerald-950">{jobOffers.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200">
              <div className="text-[11px] font-bold text-purple-900">Kütüphane Belgeleri</div>
              <div className="text-xl font-black text-purple-950">{documents.length}</div>
            </div>
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
              <div className="text-[11px] font-bold text-amber-900">Toplam Kurs Seansı</div>
              <div className="text-xl font-black text-amber-950">
                {courses.reduce((acc, c) => acc + (c.sessions?.length || 0), 0)}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-200 col-span-2 sm:col-span-1">
              <div className="text-[11px] font-bold text-indigo-900">Kayıtlı Revizyon</div>
              <div className="text-xl font-black text-indigo-950">{revisions.length}</div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('COURSES')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'COURSES'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Kurslar ({courses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('JOB_SHADOWING')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'JOB_SHADOWING'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span>İşbaşı Gözlem ({jobOffers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('LIBRARY')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'LIBRARY'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Kütüphane Dokümanları ({documents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('CATEGORIES_TAGS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'CATEGORIES_TAGS'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Kategori & Etiketler</span>
            </button>

            <button
              onClick={() => setActiveTab('REVISIONS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'REVISIONS'
                  ? 'bg-blue-700 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>Revizyon Geçmişi ({revisions.length})</span>
            </button>
          </div>

          {/* Action Button based on tab */}
          <div>
            {activeTab === 'COURSES' && (
              <button
                onClick={() => setIsCreateCourseOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Kurs Tanımla</span>
              </button>
            )}

            {activeTab === 'LIBRARY' && (
              <button
                onClick={() => {
                  setSelectedDocForEdit(null);
                  setIsDocModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Doküman / Kılavuz Yükle</span>
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: COURSES */}
        {activeTab === 'COURSES' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                  placeholder="Kurs başlığı, şehir, kurum veya alan ara..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredCourses.length} kurs listeleniyor
              </span>
            </div>

            <div className="space-y-3">
              {filteredCourses.map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 text-blue-800 border border-blue-200">
                        {c.iscedName || 'Genel Mesleki'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        📍 {c.hostCity}, {c.hostCountry}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.dailyFeeEur ? c.dailyFeeEur * c.durationDays : 400} € / katılımcı ({c.durationDays} Gün)
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">ID: {c.id}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 m-0">{c.titleTr}</h3>
                    <p className="text-xs text-slate-500 italic m-0">{c.titleEn}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 m-0 leading-relaxed">
                      {c.descriptionTr}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium flex-wrap">
                      <span>🏛️ {c.hostName}</span>
                      <span>•</span>
                      <span>🗓️ {c.sessions?.length || 0} Oturum / Seans</span>
                      <span>•</span>
                      <span>🎯 {c.learningOutcomes?.length || 0} ESCO Çıktısı</span>
                      <span>•</span>
                      <span>🌐 {c.language}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedCourseForEdit(c)}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Düzenle & Seanslar</span>
                    </button>
                    <Link
                      href="/marketplace/courses"
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-colors"
                    >
                      İncele
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 2: JOB SHADOWING */}
        {activeTab === 'JOB_SHADOWING' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={jobSearch}
                  onChange={(e) => setJobSearch(e.target.value)}
                  placeholder="İşbaşı gözlem başlığı, kurum veya sektör ara..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredJobs.length} ilan listeleniyor
              </span>
            </div>

            <div className="space-y-3">
              {filteredJobs.map((j) => (
                <div
                  key={j.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {j.vetField}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        📍 {j.city}, {j.country}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                        Maks. {j.maxCapacityPerSlot} Öğretmen / Slot ({j.durationDays} Gün)
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 m-0">{j.titleTr}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 m-0 leading-relaxed">
                      {j.descriptionTr}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-500 font-medium">
                      <span>🏢 {j.hostName}</span>
                      <span>•</span>
                      <span>👨‍🏫 Hedef: {j.eligibleStaffTypes.join(', ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Link
                      href="/marketplace/job-shadowing"
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                      <span>İlanda Gör</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: LIBRARY DOCUMENTS */}
        {activeTab === 'LIBRARY' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={docSearch}
                  onChange={(e) => setDocSearch(e.target.value)}
                  placeholder="Belge adı, kategori veya etiket ara..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {filteredDocs.length} doküman listeleniyor
              </span>
            </div>

            <div className="space-y-3">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-white shadow-2xs hover:shadow-xs transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-purple-50 text-purple-800 border border-purple-200 font-mono">
                        {doc.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        {doc.fileFormat} • {doc.fileSize}
                      </span>
                      {doc.isFeatured && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Öne Çıkan</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 m-0">{doc.titleTr}</h3>
                    <p className="text-xs text-slate-500 italic m-0">{doc.titleEn}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 m-0 leading-relaxed">
                      {doc.descriptionTr}
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {doc.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold"
                        >
                          #{tag}
                        </span>
                      ))}
                      <span className="text-[11px] text-slate-400 font-mono">
                        URL: {doc.downloadUrl}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {
                        setSelectedDocForEdit(doc);
                        setIsDocModalOpen(true);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>Düzenle</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.id, doc.titleTr)}
                      className="p-2 rounded-xl text-red-600 hover:bg-red-50 border border-red-200 transition-colors cursor-pointer"
                      title="Dokümanı Kaldır"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 4: CATEGORY & TAG MANAGEMENT */}
        {activeTab === 'CATEGORIES_TAGS' && (
          <CategoryTagManager
            availableTags={allDocTags}
            onCategoryChanged={() => {
              fetchDocuments();
              fetchRevisions();
            }}
          />
        )}

        {/* TAB 5: CMS REVISIONS AUDIT TRAIL */}
        {activeTab === 'REVISIONS' && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                    <History className="w-4 h-4" />
                  </span>
                  <h2 className="text-base font-bold text-slate-900 m-0">CMS İçerik Değişiklik ve Revizyon Günlüğü</h2>
                </div>
                <p className="text-xs text-slate-500 m-0">
                  Platform üzerinde kurs, seans, kılavuz ve kategorilerde yapılan tüm yönetimsel değişiklikler denetim için kayıt altına alınır.
                </p>
              </div>

              <button
                onClick={fetchRevisions}
                className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Yenile</span>
              </button>
            </div>

            <div className="space-y-3">
              {revisions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">Henüz kayıtlı bir revizyon bulunamadı.</div>
              ) : (
                revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold ${
                            rev.action === 'CREATE'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : rev.action === 'UPDATE'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-red-50 text-red-800 border border-red-200'
                          }`}
                        >
                          {rev.action}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                          {rev.entityType}
                        </span>
                        <span className="font-bold text-slate-900">{rev.entityTitle}</span>
                      </div>
                      <p className="text-slate-600 m-0">{rev.changesSummary}</p>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2 self-end sm:self-center shrink-0">
                      <span>👤 {rev.authorName}</span>
                      <span>•</span>
                      <span>🕒 {new Date(rev.createdAt).toLocaleString('tr-TR')}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        )}
      </main>

      {/* Course Editor Modal */}
      <CourseEditorModal
        isOpen={!!selectedCourseForEdit}
        onClose={() => setSelectedCourseForEdit(null)}
        course={selectedCourseForEdit}
        onSuccess={() => {
          fetchCourses();
          fetchRevisions();
        }}
      />

      {/* Admin Create Course Modal */}
      <AdminCreateCourseModal
        isOpen={isCreateCourseOpen}
        onClose={() => setIsCreateCourseOpen(false)}
        onSuccess={() => {
          setFeedbackMsg('Yeni kurs ve seans tanımı başarıyla oluşturuldu ve anında Pazar Yeri kataloğuna eklendi.');
          fetchCourses();
          fetchRevisions();
        }}
      />

      {/* Document Upload & Edit Modal */}
      <DocumentUploadModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
        documentToEdit={selectedDocForEdit}
        onSuccess={() => {
          setFeedbackMsg('Doküman başarıyla kaydedildi ve anında Kütüphane sayfasına yansıtıldı.');
          fetchDocuments();
          fetchRevisions();
        }}
      />

      <AppFooter />
    </div>
  );
}
