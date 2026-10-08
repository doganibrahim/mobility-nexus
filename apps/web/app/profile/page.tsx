'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { useUser, useClerk } from '@clerk/nextjs';
import { useAppStore } from '../../lib/store';
import { useTranslation } from '../../lib/i18n';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';

export default function ProfilePage() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { currentOrg, currentHost, orgType, userRole, isOnboarded } = useAppStore();
  const { t, locale } = useTranslation();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageNotice, setImageNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setImageNotice({
        type: 'error',
        message: locale === 'tr' ? 'Fotoğraf boyutu 5 MB\'tan küçük olmalıdır.' : 'Image size must be under 5 MB.',
      });
      return;
    }

    try {
      setIsUploadingImage(true);
      setImageNotice(null);
      if (user && 'setProfileImage' in user) {
        await (user as any).setProfileImage({ file });
        await user.reload();
        setImageNotice({
          type: 'success',
          message: locale === 'tr' ? 'Profil fotoğrafınız başarıyla güncellendi!' : 'Profile photo updated successfully!',
        });
      }
    } catch (err: any) {
      console.error('Failed to upload profile image:', err);
      setImageNotice({
        type: 'error',
        message: err?.message || (locale === 'tr' ? 'Fotoğraf yüklenemedi. Lütfen tekrar deneyin.' : 'Failed to upload photo.'),
      });
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = async () => {
    if (
      !confirm(
        locale === 'tr'
          ? 'Profil fotoğrafınızı kaldırmak istediğinize emin misiniz?'
          : 'Are you sure you want to remove your profile photo?'
      )
    )
      return;

    try {
      setIsUploadingImage(true);
      setImageNotice(null);
      if (user && 'setProfileImage' in user) {
        await (user as any).setProfileImage({ file: null });
        await user.reload();
        setImageNotice({
          type: 'success',
          message: locale === 'tr' ? 'Profil fotoğrafınız kaldırıldı.' : 'Profile photo removed.',
        });
      }
    } catch (err: any) {
      console.error('Failed to remove profile image:', err);
      setImageNotice({
        type: 'error',
        message: err?.message || (locale === 'tr' ? 'Fotoğraf kaldırılamadı.' : 'Failed to remove photo.'),
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

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
            ErasmusMobility • EMaaS v1.0
          </span>
        </div>

        {/* Status Notice if image upload or error */}
        {imageNotice && (
          <div
            className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between animate-fadeIn ${
              imageNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                : 'bg-rose-50 text-rose-900 border-rose-300'
            }`}
          >
            <span>{imageNotice.message}</span>
            <button
              type="button"
              onClick={() => setImageNotice(null)}
              className="text-xs opacity-60 hover:opacity-100 cursor-pointer ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. Profile Header Card (Flat, Zero Gradient) */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-5 flex-wrap">
              {/* Profile Avatar with Direct Upload Trigger */}
              <div className="relative group">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                />

                {user?.imageUrl ? (
                  <img
                    src={user.imageUrl}
                    alt={user.fullName || 'User Avatar'}
                    className={`w-20 h-20 rounded-2xl border-2 border-slate-300 object-cover shadow-2xs transition-all ${
                      isUploadingImage ? 'opacity-40 animate-pulse' : ''
                    }`}
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-3xl font-black text-slate-800 shadow-2xs">
                    {user?.firstName?.[0] || 'U'}
                  </div>
                )}

                {/* Upload Hover Overlay */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingImage}
                  className="absolute inset-0 rounded-2xl bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer"
                  title={locale === 'tr' ? 'Fotoğrafı Değiştir' : 'Change Photo'}
                >
                  <span className="text-base">📷</span>
                  <span>{locale === 'tr' ? 'Değiştir' : 'Change'}</span>
                </button>
              </div>

              <div className="space-y-1.5">
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

                {/* Photo Action Controls */}
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingImage}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>📷</span>
                    <span>
                      {isUploadingImage
                        ? locale === 'tr'
                          ? 'Yükleniyor...'
                          : 'Uploading...'
                        : locale === 'tr'
                        ? 'Fotoğraf Yükle'
                        : 'Upload Photo'}
                    </span>
                  </button>

                  {user?.imageUrl && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={isUploadingImage}
                      className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      {locale === 'tr' ? 'Kaldır' : 'Remove'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
              <button
                type="button"
                onClick={() => openUserProfile()}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
                title={locale === 'tr' ? 'Clerk Hesap ve Güvenlik Ayarları' : 'Clerk Account & Security Settings'}
              >
                <span>⚙️</span>
                <span>{locale === 'tr' ? 'Hesap Ayarları' : 'Account Settings'}</span>
              </button>

              <button
                type="button"
                onClick={() => signOut({ redirectUrl: '/' })}
                className="px-4 py-2 bg-white hover:bg-slate-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors shadow-2xs flex items-center gap-1.5 cursor-pointer"
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
                <span className="text-slate-500 font-medium">{locale === 'tr' ? 'E-posta Doğrulandı:' : 'Email Verified:'}</span>
                <span className="font-bold text-emerald-700">{locale === 'tr' ? '✓ Doğrulandı' : '✓ Verified'}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Hesap ID:' : 'Account ID:'}</span>
                <span className="font-mono text-slate-600 text-[11px] truncate max-w-[150px] sm:max-w-none">
                  {user?.id ? user.id.slice(0, 18) + '...' : '-'}
                </span>
              </div>

              <div className="flex justify-between py-1">
                <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Aktif Dil & Bölge:' : 'Active Language & Region:'}</span>
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
                {isOnboarded ? (locale === 'tr' ? 'Düzenle' : 'Edit') : (locale === 'tr' ? 'Kaydet' : 'Save')}
              </Link>
            </div>

            {orgType === 'HOST' && currentHost ? (
              <div className="space-y-3 text-xs">
                {currentHost.logoUrl && (
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Kurum Logosu:' : 'Institution Logo:'}</span>
                    <img
                      src={currentHost.logoUrl}
                      alt={currentHost.name}
                      className="w-9 h-9 rounded-lg object-contain border border-slate-200 p-0.5 bg-white"
                    />
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Kurum Adı:' : 'Organisation Name:'}</span>
                  <span className="font-bold text-slate-900">{currentHost.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Ülke / Şehir:' : 'Country / City:'}</span>
                  <span className="font-bold text-slate-900">
                    {currentHost.countryCode} • {currentHost.city}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Ana Sektör:' : 'Primary Sector:'}</span>
                  <span className="font-bold text-slate-900">{currentHost.primarySector || (locale === 'tr' ? 'Genel' : 'General')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{t.profile.verificationStatus}:</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-900 border border-amber-200">
                    {currentHost.verificationStatus || 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Dönemlik Kapasite:' : 'Seasonal Capacity:'}</span>
                  <span className="font-bold text-slate-900">
                    {currentHost.maxLearnersPerTerm || 4} {locale === 'tr' ? 'Öğrenci' : 'Learners'}
                  </span>
                </div>
              </div>
            ) : currentOrg ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Kurum Adı:' : 'Organisation Name:'}</span>
                  <span className="font-bold text-slate-900">{currentOrg.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'OID Numarası:' : 'OID Number:'}</span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentOrg.oid || (locale === 'tr' ? 'Belirtilmedi' : 'Not Specified')}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Şehir / Ülke:' : 'City / Country:'}</span>
                  <span className="font-bold text-slate-900">
                    {currentOrg.city || 'Türkiye'} ({currentOrg.countryCode || 'TR'})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">{locale === 'tr' ? 'Akreditasyon:' : 'Accreditation:'}</span>
                  <span className="font-bold text-slate-900">
                    {currentOrg.accreditationStatus === 'YES'
                      ? (locale === 'tr' ? 'Akredite Kurum' : 'Accredited Institution')
                      : (locale === 'tr' ? 'Akredite Değil / Bilinmiyor' : 'Non-accredited / Unknown')}
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
              {locale === 'tr' ? 'Mevzuat ve Güvenlik Uyumluluğu' : 'Legal & Security Compliance'}
            </h3>
          </div>
          <p className="text-xs text-slate-600 m-0 leading-relaxed">
            {locale === 'tr'
              ? 'Hesabınız 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve AB Erasmus+ kurumsal standartları uyarınca korunmaktadır. Yüklediğiniz hareketlilik dokümanları ve kurum sicil evrakları şifrelenmiş Cloudflare R2 altyapısında saklanır.'
              : 'Your account is safeguarded in full compliance with EU General Data Protection Regulation (GDPR) and EU Erasmus+ quality standards. All uploaded mobility dossiers and institutional registries are encrypted via Cloudflare R2 infrastructure.'}
          </p>
        </div>
      </main>

      <AppFooter />
    </div>
  );
}
