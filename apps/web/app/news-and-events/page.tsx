'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal from '../../components/ui/LegalModal';
import { useTranslation } from '../../lib/i18n';

interface NewsItem {
  id: string;
  category: string;
  categoryColor: string;
  date: string;
  titleTr: string;
  titleEn: string;
  descTr: string;
  descEn: string;
  readTime: string;
}

export default function NewsAndEventsPage() {
  const { t, locale } = useTranslation();
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CALLS' | 'EVENTS' | 'RESULTS'>('ALL');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const NEWS_ITEMS: NewsItem[] = [
    {
      id: 'news-1',
      category: locale === 'tr' ? 'Çağrı Duyurusu' : 'Call Notice',
      categoryColor: 'bg-blue-100 text-blue-900 border-blue-300',
      date: '14 Eylül 2026',
      titleTr: '2026 Yılı Erasmus+ Mesleki Eğitim Akreditasyonu ve Hibe Tahsisatı Sonuçları Açıklandı',
      titleEn: '2026 Erasmus+ VET Accreditation and Grant Allocation Results Officially Announced',
      descTr: 'Türkiye Ulusal Ajansı tarafından 2026 çağrısı kapsamında akredite mesleki eğitim kurumlarına tahsis edilen yıllık hibe miktarları ve uygulama takvimi yayımlandı.',
      descEn: 'The National Agency has published annual grant allocations and the operational calendar for accredited VET institutions under the 2026 call.',
      readTime: '3 dk',
    },
    {
      id: 'news-2',
      category: locale === 'tr' ? 'Uluslararası Etkinlik' : 'International Event',
      categoryColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      date: '08 Eylül 2026',
      titleTr: 'Erasmus Days 2026: Mesleki Eğitimde Yeşil Beceriler ve Dijital Dönüşüm Çalıştayları',
      titleEn: 'Erasmus Days 2026: Green Skills and Digital Transformation Workshops in VET',
      descTr: '14-19 Ekim 2026 tarihlerinde tüm Avrupa\'da eş zamanlı gerçekleştirilecek Erasmus Days etkinlikleri kapsamında okullarımız için özel çevrimiçi panel serisi düzenleniyor.',
      descEn: 'A dedicated online webinar series is scheduled for VET schools during Erasmus Days between 14-19 October 2026 across Europe.',
      readTime: '2 dk',
    },
    {
      id: 'news-3',
      category: locale === 'tr' ? 'Host Ağı' : 'Host Network',
      categoryColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      date: '01 Eylül 2026',
      titleTr: 'Almanya ve İspanya\'dan 45 Yeni Onaylı İşletme ErasmusMobility Ağına Katıldı',
      titleEn: '45 Verified Enterprises from Germany and Spain Join ErasmusMobility Network',
      descTr: 'Endüstriyel otomasyon, mekatronik ve yenilenebilir enerji alanlarında 180 öğrenci için yeni staj ve işbaşı izleme kontenjanı platform üzerinde onaylandı.',
      descEn: 'New internship capacities for 180 learners in industrial automation, mechatronics and clean tech are now open for school applications.',
      readTime: '4 dk',
    },
    {
      id: 'news-4',
      category: locale === 'tr' ? 'Rehber & Standartlar' : 'Guidelines',
      categoryColor: 'bg-amber-100 text-amber-900 border-amber-300',
      date: '25 Ağustos 2026',
      titleTr: 'Yeşil Seyahat (Green Travel) Hibe Artışları ve 2026 Uygulama Esasları',
      titleEn: 'Green Travel Grant Increments and 2026 Implementation Rules',
      descTr: 'Demiryolu ve çevre dostu ulaşım araçlarını tercih eden katılımcılar için günlük harcırah ilaveleri ve sürdürülebilir seyahat hibe kuralları güncellendi.',
      descEn: 'Updated travel top-up grants and subsistence allowances for participants opting for sustainable low-carbon travel alternatives.',
      readTime: '3 dk',
    },
    {
      id: 'news-5',
      category: locale === 'tr' ? 'Eğitim & Çalıştay' : 'Training Workshop',
      categoryColor: 'bg-purple-100 text-purple-900 border-purple-300',
      date: '18 Ağustos 2026',
      titleTr: 'Europass & ESCO Entegrasyonu: Mesleki Eğitimde Öğrenme Çıktıları Belgeleme Eğitimi',
      titleEn: 'Europass & ESCO Integration: Documenting Learning Outcomes in VET Mobility',
      descTr: 'Meslek lisesi koordinatörleri için hazırlanan 2 saatlik çevrimiçi seminerde Bloom taksonomisi ve Europass Hareketlilik Belgesi hazırlama süreçleri ele alındı.',
      descEn: 'Two-hour practical seminar for project coordinators covering Bloom taxonomy and Europass Mobility certificate documentation.',
      readTime: '5 dk',
    },
    {
      id: 'news-6',
      category: locale === 'tr' ? 'Ulusal Ajans' : 'National Agency',
      categoryColor: 'bg-slate-100 text-slate-900 border-slate-300',
      date: '10 Ağustos 2026',
      titleTr: '2027 Teklif Çağrısı Ön Bilgilendirmesi ve Konsorsiyum Başvuru Takvimi',
      titleEn: 'Advance Briefing on 2027 Call for Proposals and Consortium Schedules',
      descTr: '2027 genel teklif çağrısına ilişkin beklenen öncelikler, dijital kapsayıcılık hedefleri ve konsorsiyum oluşturma adımları hakkında bilgilendirme notu.',
      descEn: 'Strategic forecast detailing expected priorities, digital inclusion quotas, and preparation timelines for 2027 call submissions.',
      readTime: '4 dk',
    },
  ];

  const filteredNews =
    activeFilter === 'ALL'
      ? NEWS_ITEMS
      : activeFilter === 'CALLS'
      ? NEWS_ITEMS.filter((n) => n.id === 'news-1' || n.id === 'news-6')
      : activeFilter === 'EVENTS'
      ? NEWS_ITEMS.filter((n) => n.id === 'news-2' || n.id === 'news-5')
      : NEWS_ITEMS.filter((n) => n.id === 'news-3' || n.id === 'news-4');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-150">
      {/* 1. Official Erasmus+ Header */}
      <AppHeader />

      {/* 2. Institutional Breadcrumb */}
      <div className="bg-slate-100 border-b border-slate-200 px-4 sm:px-6 py-2.5 text-xs text-slate-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 transition-colors"
            >
              <span>←</span>
              <span>{locale === 'tr' ? 'Ana Sayfa' : 'Home'}</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="font-semibold text-slate-800">
              {locale === 'tr' ? 'Haberler, Duyurular ve Çağrı Takvimi' : 'News, Announcements & Call Schedule'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>2026-2027 Dönemi</span>
            <span>•</span>
            <span>Erasmus+ VET</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Canvas */}
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-10">
        {/* Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>📢</span>
              <span>{locale === 'tr' ? 'Güncel Duyurular' : 'Latest Announcements'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>{locale === 'tr' ? '2026-2027 Dönemi Aktif' : '2026-2027 Cycle Active'}</span>
            </span>
          </div>

          <div className="max-w-3xl space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight m-0">
              {locale === 'tr'
                ? 'Erasmus+ Mesleki Eğitim Haber ve Çağrı Takvimi'
                : 'Erasmus+ Vocational Education News & Call Calendar'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed m-0">
              {locale === 'tr'
                ? 'Ulusal Ajans hibe duyuruları, son başvuru tarihleri, Avrupa Mesleki Beceriler Haftası etkinlikleri ve onaylı host portföyündeki yeni staj kontenjanları.'
                : 'Stay informed on National Agency grant releases, key deadlines, European VET Skills Week workshops, and newly verified host capacities.'}
            </p>
          </div>

          {/* Quick Filter Bar */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {locale === 'tr' ? 'Tüm Haberler' : 'All News'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('CALLS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'CALLS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🗓️ {locale === 'tr' ? 'Çağrılar & Takvim' : 'Calls & Deadlines'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('EVENTS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'EVENTS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🌍 {locale === 'tr' ? 'Etkinlikler & Çalıştaylar' : 'Events & Workshops'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('RESULTS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'RESULTS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🏢 {locale === 'tr' ? 'Host & Hibe Güncellemeleri' : 'Hosts & Grants'}
            </button>
          </div>
        </section>

        {/* Milestone Timeline Bar */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 m-0">
              {locale === 'tr' ? 'Önemli Tarihler & Başvuru Zaman Çizelgesi' : 'Critical Milestones & Timeline'}
            </h2>
            <p className="text-xs text-slate-500 m-0">
              {locale === 'tr' ? 'Mesleki eğitim kurumları için kritik takvim' : 'Key deadlines for vocational education applicants'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-800">
                {locale === 'tr' ? 'Devam Ediyor' : 'Ongoing'}
              </span>
              <div className="text-sm font-bold text-slate-900">KA121 Uygulama Dönemi</div>
              <p className="text-xs text-slate-600 m-0">
                {locale === 'tr' ? '2026 yılı akredite öğrenci ve personel hareketlilikleri' : '2026 accredited learner mobilities underway'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                14-19 Ekim 2026
              </span>
              <div className="text-sm font-bold text-slate-900">Erasmus Days 2026</div>
              <p className="text-xs text-slate-600 m-0">
                {locale === 'tr' ? 'Tüm Avrupa ile eşzamanlı VET yaygınlaştırma günleri' : 'European-wide VET dissemination sessions'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                Kasım 2026
              </span>
              <div className="text-sm font-bold text-slate-900">2027 Çağrısı Yayımı</div>
              <p className="text-xs text-slate-600 m-0">
                {locale === 'tr' ? 'Avrupa Komisyonu resmi program rehberi ilanı' : 'European Commission official guide announcement'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                Şubat 2027
              </span>
              <div className="text-sm font-bold text-slate-900">KA122 Son Başvuru</div>
              <p className="text-xs text-slate-600 m-0">
                {locale === 'tr' ? 'Kısa dönemli projeler için tahmini son teslim tarihi' : 'Estimated deadline for short-term project calls'}
              </p>
            </div>
          </div>
        </section>

        {/* News Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.categoryColor}`}
                  >
                    {item.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.date}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-950 leading-snug m-0">
                  {locale === 'tr' ? item.titleTr : item.titleEn}
                </h3>

                <p className="text-xs text-slate-600 leading-relaxed m-0">
                  {locale === 'tr' ? item.descTr : item.descEn}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{item.readTime} {locale === 'tr' ? 'okuma' : 'read'}</span>
                <span className="font-bold text-blue-700 hover:text-blue-900 cursor-pointer">
                  {locale === 'tr' ? 'Detaylar' : 'Read more'} →
                </span>
              </div>
            </article>
          ))}
        </section>

        {/* Newsletter Subscription Box */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold uppercase tracking-wider text-blue-300">
              <span>✉️</span>
              <span>{locale === 'tr' ? 'Çağrı Bildirim Bülteni' : 'Call Notification Bulletin'}</span>
            </span>
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white m-0">
              {locale === 'tr' ? 'Yeni Çağrı ve Hibe Duyurularını Kaçırmayın' : 'Never Miss a Grant Announcement or Call'}
            </h3>
            <p className="text-xs text-slate-300 m-0 leading-relaxed">
              {locale === 'tr'
                ? 'E-posta adresinizi bırakın, Ulusal Ajans duyurularını ve platforma eklenen yeni onaylı hostları anında iletelim.'
                : 'Subscribe to receive official National Agency alerts and newly verified host trainee slots directly.'}
            </p>
          </div>

          <div className="w-full lg:w-auto shrink-0">
            {isSubscribed ? (
              <div className="px-5 py-3 rounded-xl bg-emerald-600/30 border border-emerald-400 text-emerald-200 text-xs font-bold text-center">
                ✓ {locale === 'tr' ? 'Bültene başarıyla kaydoldunuz!' : 'Successfully subscribed to bulletin!'}
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (newsletterEmail) setIsSubscribed(true);
                }}
                className="flex items-center gap-2 flex-col sm:flex-row w-full sm:w-auto"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={locale === 'tr' ? 'E-posta adresiniz' : 'Your email address'}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-colors shadow-xs w-full sm:w-auto shrink-0"
                >
                  {locale === 'tr' ? 'Abone Ol' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* 4. Institutional Footer */}
      <AppFooter />

      {/* 5. Cookie Consent & Modals */}
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />
    </div>
  );
}
