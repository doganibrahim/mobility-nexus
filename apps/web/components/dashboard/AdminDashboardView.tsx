'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from '../../lib/i18n';
import { apiClient } from '../../lib/api-client';
import { useAppStore } from '../../lib/store';
import AdminVerificationQueueModal from '../admin/AdminVerificationQueueModal';
import AdminInquiriesSection from '../admin/AdminInquiriesSection';
import ErasmusResultsWidget from '../ui/ErasmusResultsWidget';
import MebSchoolsWidget from '../ui/MebSchoolsWidget';

interface AdminDashboardViewProps {
  onSwitchView: (view: 'ADMIN' | 'SCHOOL' | 'HOST') => void;
  userEmail?: string;
}

export default function AdminDashboardView({
  onSwitchView,
  userEmail,
}: AdminDashboardViewProps) {
  const { t, locale } = useTranslation();
  const [isAdminQueueOpen, setIsAdminQueueOpen] = useState(false);
  const [isHibeWidgetOpen, setIsHibeWidgetOpen] = useState(false);
  const [isMebWidgetOpen, setIsMebWidgetOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [recentQueue, setRecentQueue] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const store = useAppStore();
  const inquiries = store.inquiries || [];
  const pendingInquiriesCount = inquiries.filter((i) => i.status === 'PENDING').length;

  useEffect(() => {
    store.fetchInquiriesFromServer();
  }, []);

  useEffect(() => {
    async function fetchQueueStats() {
      setIsLoading(true);
      try {
        const queue = await apiClient.getVerificationQueue(undefined, userEmail);
        setRecentQueue(queue.slice(0, 4));
        setPendingCount(queue.filter((q) => q.verificationStatus !== 'VERIFIED').length);
      } catch (err) {
        console.warn('Admin dashboard queue fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQueueStats();
  }, [userEmail]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. Simulation / Role Switcher Header Bar (Flat, Zero Gradient) */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold uppercase tracking-wider border border-slate-300">
              <span>🛡️</span>
              <span>{t.adminDashboard.badge}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight m-0">
              {t.adminDashboard.title}
            </h1>
            <p className="text-xs text-slate-600 m-0 leading-relaxed">
              {t.adminDashboard.subtitle}
            </p>
          </div>

          {/* View As (Rol Değiştirici) Butonları */}
          <div className="flex items-center gap-2.5 p-1.5 bg-slate-100 border border-slate-300 rounded-xl flex-wrap shrink-0">
            <button
              type="button"
              className="px-3.5 py-2 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-default"
            >
              <span>🛡️</span>
              <span>{t.adminDashboard.viewAdmin}</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchView('SCHOOL')}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 hover:border-slate-300 transition-all shadow-2xs flex items-center gap-1.5"
              title={locale === 'tr' ? "Okulların gördüğü 5 adımlı Erasmus+ karar pipeline'ını gör" : "View the 5-step Erasmus+ decision pipeline as seen by schools"}
            >
              <span>🏛️</span>
              <span>{t.adminDashboard.viewSchool}</span>
            </button>

            <button
              type="button"
              onClick={() => onSwitchView('HOST')}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs border border-slate-200 hover:border-slate-300 transition-all shadow-2xs flex items-center gap-1.5"
              title={locale === 'tr' ? "Ev sahibi kurumların gördüğü portföy ve evrak yönetim panelini gör" : "View the portfolio and document dashboard as seen by European hosts"}
            >
              <span>🏢</span>
              <span>{t.adminDashboard.viewHost}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Platform KPI Metrics Grid (Flat, High-Contrast - 4 Columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* KPI 1: Hareketlilik Talepleri & Mesaj Havuzu */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {locale === 'tr' ? 'Eşleşme Talepleri' : 'Mobility Inquiries'}
            </span>
            <span className="text-xl">📩</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-950">
              {inquiries.length}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 m-0">
              {locale === 'tr'
                ? `${pendingInquiriesCount} onay bekleyen okul talebi`
                : `${pendingInquiriesCount} pending placement inquiries`}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('admin-inquiries-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="mt-4 w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
          >
            {locale === 'tr' ? 'Talepleri & Mesajları Gör ↓' : 'View Inquiries & Messages ↓'}
          </button>
        </div>

        {/* KPI 2: Bekleyen Kurum Evrakları */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.adminDashboard.pendingDocs}
            </span>
            <span className="text-xl">⏳</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-950">
              {pendingCount}
            </div>
            <p className="text-[11px] text-slate-500 mt-1 m-0">
              {t.adminDashboard.pendingSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminQueueOpen(true)}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
          >
            {t.adminDashboard.openQueue} →
          </button>
        </div>

        {/* KPI 3: Hibe Havuzu */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {locale === 'tr' ? '2026 Çağrısı Hibe Havuzu' : '2026 Call Grant Pool'}
            </span>
            <span className="text-xl">💶</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-950">
              €10.420.000
            </div>
            <p className="text-[11px] text-slate-500 mt-1 m-0">
              {locale === 'tr' ? 'Türkiye geneli akredite kurum hibe dağılımı' : 'Accredited institution grant distribution'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsHibeWidgetOpen(true)}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
          >
            {locale === 'tr' ? 'Hibe Analizini Gör →' : 'View Grant Analysis →'}
          </button>
        </div>

        {/* KPI 4: Yararlanıcı Kataloğu */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {t.adminDashboard.beneficiariesCatalog}
            </span>
            <span className="text-xl">🏛️</span>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-950">
              4.800+
            </div>
            <p className="text-[11px] text-slate-500 mt-1 m-0">
              {t.adminDashboard.beneficiariesSubtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsMebWidgetOpen(true)}
            className="mt-4 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors"
          >
            {t.adminDashboard.exploreCatalog} →
          </button>
        </div>
      </div>

      {/* 3. Central Inquiries & Messages Management Section (Admin Hub) */}
      <div id="admin-inquiries-section">
        <AdminInquiriesSection />
      </div>

      {/* 3. Pending Verifications Quick List & Review Section */}
      <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-950 m-0">
              {t.adminDashboard.recentRequests}
            </h2>
            <p className="text-xs text-slate-600 m-0 mt-0.5">
              {locale === 'tr'
                ? 'Avrupa\'daki ev sahibi işletmelerin yüklediği şirket sicil evrakları ve 7/24 acil protokolleri.'
                : 'Corporate verification filings and 24/7 emergency protocols submitted by EU hosts.'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminQueueOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
          >
            <span>🛡️</span>
            <span>{t.adminDashboard.openQueue}</span>
          </button>
        </div>

        <div className="mt-6">
          {isLoading ? (
            <div className="text-center py-10 text-xs text-slate-500 font-semibold">
              {locale === 'tr' ? 'Evrak havuzu yükleniyor...' : 'Loading verification pool...'}
            </div>
          ) : recentQueue.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              {locale === 'tr'
                ? 'Şu an onay bekleyen yeni bir ev sahibi kurum evrakı bulunmuyor.'
                : 'There are currently no new host verification documents waiting for review.'}
            </div>
          ) : (
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl overflow-hidden">
              {recentQueue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-white hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{item.name}</span>
                      <span className="font-mono text-xs text-slate-500">({item.oid || 'No OID'})</span>
                      <span className="text-xs">{item.countryCode}</span>
                    </div>
                    <p className="text-xs text-slate-500 m-0">
                      {locale === 'tr' ? 'Yetkili' : 'Contact'}: {item.contactPerson || '-'} • {locale === 'tr' ? 'Sektör' : 'Sector'}: {item.primarySector || 'General'}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
                        item.verificationStatus === 'VERIFIED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      {item.verificationStatus === 'VERIFIED'
                        ? t.adminDashboard.verified
                        : item.verificationStatus === 'UNDER_REVIEW'
                        ? t.adminDashboard.underReview
                        : item.verificationStatus === 'NEEDS_UPDATE'
                        ? t.adminDashboard.needsRevision
                        : t.adminDashboard.pending}
                    </span>

                    <button
                      type="button"
                      onClick={() => setIsAdminQueueOpen(true)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-bold rounded-lg border border-slate-300 transition-colors"
                    >
                      {locale === 'tr' ? 'İncele →' : 'Review →'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AdminVerificationQueueModal
        isOpen={isAdminQueueOpen}
        onClose={() => setIsAdminQueueOpen(false)}
      />

      <ErasmusResultsWidget
        isOpen={isHibeWidgetOpen}
        onClose={() => setIsHibeWidgetOpen(false)}
      />

      <MebSchoolsWidget
        isOpen={isMebWidgetOpen}
        onClose={() => setIsMebWidgetOpen(false)}
      />
    </div>
  );
}
