'use client';

import React from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { useAppStore } from '../../lib/store';
import { useTranslation } from '../../lib/i18n';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { currentOrg, currentHost, orgType, userRole, isOnboarded } = useAppStore();
  const { t, locale } = useTranslation();

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

  const isAdmin = Boolean(
    isSignedIn &&
      (userRoleMeta === 'SUPER_ADMIN' ||
        userRoleMeta === 'ADMIN' ||
        userRoleMeta === 'PLATFORM_ADMIN' ||
        user?.publicMetadata?.isAdmin === true ||
        (userEmail && adminEmails.includes(userEmail)))
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-slate-200">
      <AppHeader />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fadeIn">
        {/* Navigation Breadcrumb & Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-950 transition-colors"
          >
            <span>←</span>
            <span>{t.profile.backHome}</span>
          </Link>

          <span className="text-xs font-bold text-slate-400">
            CAPPINNO Mobility Nexus • EMaaS v1.0
          </span>
        </div>

        {/* 1. Profile Header Card (Flat, Zero Gradient) */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {user?.imageUrl ? (
                <img
                  src={user.imageUrl}
                  alt={user.fullName || 'User Avatar'}
                  className="w-16 h-16 rounded-2xl border-2 border-slate-300 object-cover shadow-2xs"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-2xl font-black text-slate-800">
                  {user?.firstName?.[0] || 'U'}
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-950 m-0 tracking-tight">
                    {user?.fullName || 'Kullanıcı'}
                  </h1>

                  {/* Role Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${
                      isAdmin
                        ? 'bg-slate-900 text-white border-slate-900'
                        : orgType === 'HOST'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : orgType === 'SCHOOL'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}
                  >
                    {isAdmin
                      ? t.profile.roleAdmin
                      : orgType === 'HOST'
                      ? t.profile.roleHost
                      : orgType === 'SCHOOL'
                      ? t.profile.roleSchool
                      : t.profile.roleMember}
                  </span>
                </div>

                <p className="text-xs text-slate-600 m-0 font-medium">
                  {userEmail || 'E-posta belirtilmedi'}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 self-start sm:self-center">
              <button
                type="button"
                onClick={() => signOut({ redirectUrl: '/' })}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors shadow-2xs flex items-center gap-1.5"
              >
                <span>🚪</span>
                <span>{t.profile.signOut}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. Personal & Account Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <span className="text-base">👤</span>
              <h3 className="font-bold text-slate-900 text-sm m-0">
                {t.profile.personalInfo}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{t.profile.fullName}:</span>
                <span className="font-bold text-slate-900">{user?.fullName || '-'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{t.profile.email}:</span>
                <span className="font-bold text-slate-900">{userEmail || '-'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">E-posta Doğrulandı:</span>
                <span className="font-bold text-emerald-700">✓ Doğrulandı</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Hesap ID:</span>
                <span className="font-mono text-slate-600 text-[11px] truncate max-w-[150px] sm:max-w-none">
                  {user?.id ? user.id.slice(0, 18) + '...' : '-'}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">Aktif Dil & Bölge:</span>
                <span className="font-bold text-slate-900">
                  {locale === 'tr' ? '🇹🇷 Türkçe (TR)' : '🇬🇧 English (EN)'}
                </span>
              </div>
            </div>
          </div>

          {/* Connected Institution Details */}
          <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-base">🏛️</span>
                <h3 className="font-bold text-slate-900 text-sm m-0">
                  {t.profile.institutionInfo}
                </h3>
              </div>

              <Link
                href="/onboarding"
                className="text-xs font-bold text-blue-700 hover:text-blue-900 underline"
              >
                {isOnboarded ? 'Düzenle' : 'Kaydet'}
              </Link>
            </div>

            {orgType === 'HOST' && currentHost ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Kurum Adı:</span>
                  <span className="font-bold text-slate-900">{currentHost.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Ülke / Şehir:</span>
                  <span className="font-bold text-slate-900">
                    {currentHost.countryCode} • {currentHost.city}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Ana Sektör:</span>
                  <span className="font-bold text-slate-900">{currentHost.primarySector || 'Genel'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{t.profile.verificationStatus}:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                    {currentHost.verificationStatus || 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">Dönemlik Kapasite:</span>
                  <span className="font-bold text-slate-900">
                    {currentHost.maxLearnersPerTerm || 4} Öğrenci
                  </span>
                </div>
              </div>
            ) : currentOrg ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Kurum Adı:</span>
                  <span className="font-bold text-slate-900">{currentOrg.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">OID Numarası:</span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentOrg.oid || 'Belirtilmedi'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Şehir / Ülke:</span>
                  <span className="font-bold text-slate-900">
                    {currentOrg.city || 'Türkiye'} ({currentOrg.countryCode || 'TR'})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">Akreditasyon:</span>
                  <span className="font-bold text-slate-900">
                    {currentOrg.accreditationStatus === 'YES' ? 'Akredite Kurum' : 'Akredite Değil / Bilinmiyor'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{t.profile.readinessScore}:</span>
                  <span className="font-black text-emerald-700">
                    %{currentOrg.readinessScore || 75}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-3">
                <p className="text-xs text-slate-500 m-0">
                  {t.profile.noInstitution}
                </p>
                <Link
                  href="/onboarding"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
                >
                  <span>{t.profile.createInstitution}</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 3. System Permissions & Compliance Card */}
        <div className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-base">🛡️</span>
            <h3 className="font-bold text-slate-900 text-sm m-0">
              Mevzuat ve Güvenlik Uyumluluğu
            </h3>
          </div>
          <p className="text-xs text-slate-600 m-0 leading-relaxed">
            Hesabınız {locale === 'tr' ? '6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK)' : 'EU General Data Protection Regulation (GDPR)'} ve AB Erasmus+ kurumsal standartları uyarınca korunmaktadır. Yüklediğiniz hareketlilik dokümanları ve kurum sicil evrakları şifrelenmiş Cloudflare R2 altyapısında saklanır.
          </p>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
