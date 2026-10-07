'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import AppHeader from '../../components/layout/AppHeader';
import AppFooter from '../../components/layout/AppFooter';
import CookieBanner from '../../components/ui/CookieBanner';
import LegalModal from '../../components/ui/LegalModal';
import DistinctSectionPurposeCard from '../../components/ui/DistinctSectionPurposeCard';
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
  contentTr?: string;
  contentEn?: string;
  highlightsTr?: string[];
  highlightsEn?: string[];
  sourceUrl?: string;
  sourceTitleTr?: string;
  sourceTitleEn?: string;
  readTime: string;
  isArchived?: boolean;
  archiveDate?: string;
  archiveReason?: string;
}

const CATEGORY_EN_MAP: Record<string, string> = {
  'Çağrı Duyurusu': 'Call Announcement',
  'Uluslararası Etkinlik': 'International Event',
  'Host Ağı': 'Host Network',
  'Rehber & Standartlar': 'Guides & Standards',
  'Eğitim & Çalıştay': 'Training & Workshop',
  'Ulusal Ajans': 'National Agency',
  'Arşivlenmiş Çağrı': 'Archived Call',
  'Arşivlenmiş Etkinlik': 'Archived Event',
  'Arşiv Raporu': 'Archived Report',
};

function formatLocalizedDate(dateStr: string, locale: 'tr' | 'en'): string {
  if (locale === 'tr') return dateStr;
  const monthMap: Record<string, string> = {
    Ocak: 'January',
    Şubat: 'February',
    Mart: 'March',
    Nisan: 'April',
    Mayıs: 'May',
    Haziran: 'June',
    Temmuz: 'July',
    Ağustos: 'August',
    Eylül: 'September',
    Ekim: 'October',
    Kasım: 'November',
    Aralık: 'December',
  };
  let result = dateStr;
  for (const [tr, en] of Object.entries(monthMap)) {
    result = result.replace(tr, en);
  }
  return result;
}

const INITIAL_NEWS_ITEMS: NewsItem[] = [
  {
    id: 'news-1',
    category: 'Çağrı Duyurusu',
    categoryColor: 'bg-blue-100 text-blue-900 border-blue-300',
    date: '14 Eylül 2026',
    titleTr: '2026 Yılı Erasmus+ Mesleki Eğitim Akreditasyonu ve Hibe Tahsisatı Sonuçları Açıklandı',
    titleEn: '2026 Erasmus+ VET Accreditation and Grant Allocation Results Officially Announced',
    descTr: 'Türkiye Ulusal Ajansı tarafından 2026 çağrısı kapsamında akredite mesleki eğitim kurumlarına tahsis edilen yıllık hibe miktarları ve uygulama takvimi yayımlandı.',
    descEn: 'The National Agency has published annual grant allocations and the operational calendar for accredited VET institutions under the 2026 call.',
    contentTr: 'Türkiye Ulusal Ajansı tarafından yayımlanan 2026 yılı Mesleki Eğitim Akreditasyonu hibe tahsisatı sonuçlarına göre, akredite kurumların yıllık bütçe tahsisatları ve hareketlilik kotaları resmi portala aktarılmıştır. Okullar kurum kodları ve OID numaralarıyla sisteme giriş yaparak nihai sözleşme paketlerini indirebilirler.',
    contentEn: 'According to the 2026 VET Accreditation grant allocation results published by the Turkish National Agency, annual budgets and mobility quotas for accredited institutions have been issued. Schools can access their final grant contracts using their institutional OID credentials.',
    highlightsTr: [
      'Yıllık hibe sözleşmeleri dijital imza sürecine açıldı.',
      'KA121 kapsamındaki bütçe aktarımları ilk dilim olarak %80 oranında yatırılacak.',
      'Hareketlilik faaliyetlerinin en geç 31 Ağustos 2027 tarihine kadar tamamlanması gerekmektedir.',
    ],
    highlightsEn: [
      'Annual grant agreements are open for digital signature.',
      'Pre-financing transfers under KA121 are set at 80% upon contract ratification.',
      'All planned mobilities must conclude by 31 August 2027.',
    ],
    sourceUrl: 'https://www.ua.gov.tr',
    sourceTitleTr: 'Türkiye Ulusal Ajansı Resmi Portalı',
    sourceTitleEn: 'Turkish National Agency Official Portal',
    readTime: '3 dk',
    isArchived: false,
  },
  {
    id: 'news-2',
    category: 'Uluslararası Etkinlik',
    categoryColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    date: '08 Eylül 2026',
    titleTr: 'Erasmus Days 2026: Mesleki Eğitimde Yeşil Beceriler ve Dijital Dönüşüm Çalıştayları',
    titleEn: 'Erasmus Days 2026: Green Skills and Digital Transformation Workshops in VET',
    descTr: '12-17 Ekim 2026 tarihlerinde tüm Avrupa\'da eş zamanlı gerçekleştirilecek Erasmus Days etkinlikleri kapsamında okullarımız için özel çevrimiçi panel serisi düzenleniyor.',
    descEn: 'A dedicated online webinar series is scheduled for VET schools during Erasmus Days between 12-17 October 2026 across Europe.',
    contentTr: 'Avrupa genelinde kutlanan Erasmus Days 2026 kapsamında, meslek liselerimizin yeşil beceriler, sürdürülebilir atölye uygulamaları ve sanal staj entegrasyonu deneyimlerini paylaşacakları çevrimiçi panel serisi başlıyor. Katılımcılar iyi uygulama örneklerini ve proje başarı hikayelerini doğrudan aktaracak.',
    contentEn: 'As part of the Europe-wide Erasmus Days 2026 celebrations, a dedicated webinar series spotlights green skills, eco-friendly vocational workshops, and virtual mobility integration across European VET institutions.',
    highlightsTr: [
      '12-17 Ekim 2026 tarihleri arasında her gün 14:00\'te canlı panel oturumu',
      'Yeşil seyahat ve atölye karbon ayak izi azaltma vaka analizleri',
      'Tüm katılımcı öğretmenlere dijital katılım sertifikası',
    ],
    highlightsEn: [
      'Daily live sessions at 14:00 CET between 12-17 October 2026',
      'Case studies on green travel and workshop sustainability',
      'Digital Certificate of Attendance issued for participants',
    ],
    sourceUrl: 'https://www.erasmusdays.eu',
    sourceTitleTr: 'Resmi Erasmus Days Portalı',
    sourceTitleEn: 'Official Erasmus Days Portal',
    readTime: '2 dk',
    isArchived: false,
  },
  {
    id: 'news-3',
    category: 'Host Ağı',
    categoryColor: 'bg-indigo-100 text-indigo-900 border-indigo-300',
    date: '01 Eylül 2026',
    titleTr: 'Almanya ve İspanya\'dan 45 Yeni Onaylı İşletme ErasmusMobility Ağına Katıldı',
    titleEn: '45 Verified Enterprises from Germany and Spain Join ErasmusMobility Network',
    descTr: 'Endüstriyel otomasyon, mekatronik ve yenilenebilir enerji alanlarında 180 öğrenci için yeni staj ve işbaşı izleme kontenjanı platform üzerinde onaylandı.',
    descEn: 'New internship capacities for 180 learners in industrial automation, mechatronics and clean tech are now open for school applications.',
    contentTr: 'Almanya (Bavyera ve Baden-Württemberg) ile İspanya (Valensiya ve Bask) bölgelerindeki 45 yeni teknoloji ve üretim işletmesi, ErasmusMobility ağına ev sahibi (host) kuruluş olarak katıldı. 180 meslek lisesi öğrencisi için mekatronik, endüstriyel robotik ve yenilenebilir enerji staj kontenjanı oluşturuldu.',
    contentEn: '45 high-tech manufacturing enterprises across Germany (Bavaria & Baden-Württemberg) and Spain (Valencia & Basque Country) have joined the ErasmusMobility hosting network, unlocking 180 internship placements in mechatronics, robotics, and clean tech.',
    highlightsTr: [
      'Mentorluk ve teknik rehberlik altyapısı doğrulanmış işletmeler',
      'İş temelli öğrenme (WBL) ve Europass hareketlilik belgesi garantisi',
      'Öğrenci konaklama ve yerel refakatçi koordinasyon desteği',
    ],
    highlightsEn: [
      'Pre-vetted mentorship and technical workplace tutors',
      'Work-based learning (WBL) and Europass certification assurance',
      'Assistance with student accommodation and local guidance',
    ],
    sourceUrl: '/marketplace',
    sourceTitleTr: 'ErasmusMobility Host Kataloğu',
    sourceTitleEn: 'ErasmusMobility Host Directory',
    readTime: '4 dk',
    isArchived: false,
  },
  {
    id: 'news-4',
    category: 'Rehber & Standartlar',
    categoryColor: 'bg-amber-100 text-amber-900 border-amber-300',
    date: '25 Ağustos 2026',
    titleTr: 'Yeşil Seyahat (Green Travel) Hibe Artışları ve 2026 Uygulama Esasları',
    titleEn: 'Green Travel Grant Increments and 2026 Implementation Rules',
    descTr: 'Demiryolu ve çevre dostu ulaşım araçlarını tercih eden katılımcılar için günlük harcırah ilaveleri ve sürdürülebilir seyahat hibe kuralları güncellendi.',
    descEn: 'Updated travel top-up grants and subsistence allowances for participants opting for sustainable low-carbon travel alternatives.',
    contentTr: 'Avrupa Komisyonu, sürdürülebilir ulaşımı teşvik etmek amacıyla Yeşil Seyahat (Green Travel) hibelerinde güncellemeye gitti. Tren, otobüs veya paylaşımlı araç kullanan katılımcılar için mesafe bandına göre ilave 80 € seyahat desteği ve 6 güne kadar ek bireysel destek harcırahı sağlanmaktadır.',
    contentEn: 'The European Commission has upgraded Green Travel grant allocations to encourage low-carbon transport. Participants choosing train, bus, or carpooling receive up to €80 additional travel top-up and up to 6 extra days of individual subsistence support.',
    highlightsTr: [
      'Uçak yerine demiryolu veya toplu karayolu tercihine özel ek hibe desteği',
      'Gidiş-dönüş seyahat süresine göre 2 ile 6 gün ek bireysel destek yevmiyesi',
      'Seyahat biletleri ve bordroların nihai raporda sunulması zorunludur',
    ],
    highlightsEn: [
      'Dedicated top-up allowance for low-carbon travel alternatives',
      '2 to 6 additional subsistence days for extended travel journeys',
      'Boarding passes and tickets required in final audit report',
    ],
    sourceUrl: 'https://erasmus-plus.ec.europa.eu',
    sourceTitleTr: 'AB Erasmus+ Yeşil Seyahat Rehberi',
    sourceTitleEn: 'EC Erasmus+ Green Travel Guide',
    readTime: '3 dk',
    isArchived: false,
  },
  {
    id: 'news-5',
    category: 'Eğitim & Çalıştay',
    categoryColor: 'bg-purple-100 text-purple-900 border-purple-300',
    date: '18 Ağustos 2026',
    titleTr: 'Europass & ESCO Entegrasyonu: Mesleki Eğitimde Öğrenme Çıktıları Belgeleme Eğitimi',
    titleEn: 'Europass & ESCO Integration: Documenting Learning Outcomes in VET Mobility',
    descTr: 'Meslek lisesi koordinatörleri için hazırlanan 2 saatlik çevrimiçi seminerde Bloom taksonomisi ve Europass Hareketlilik Belgesi hazırlama süreçleri ele alındı.',
    descEn: 'Two-hour practical seminar for project coordinators covering Bloom taxonomy and Europass Mobility certificate documentation.',
    contentTr: 'Meslek lisesi koordinatörleri ve öğretmenleri için düzenlenen Europass ve ESCO entegrasyonu eğitiminde; staj faaliyetlerinde kazanılan teknik ve sosyal becerilerin AB standartlarında belgelenmesi, Bloom taksonomisiyle öğrenme kazanımı tanımlama ve dijital kimlik oluşturma pratikleri incelenmektedir.',
    contentEn: 'A training module for VET coordinators exploring Europass & ESCO taxonomy: documenting technical and transversal competencies acquired during traineeships, formulating learning outcomes via Bloom taxonomy, and issuing digital verifiable credentials.',
    highlightsTr: [
      'ESCO meslek ve yetkinlik ağacı ile uyumlu staj planlama',
      'Europass Hareketlilik Belgesi (Mobility Document) doldurma kılavuzu',
      'Öğrenci CV ve beceri pasaportu dijitalleştirme adımları',
    ],
    highlightsEn: [
      'Work placement alignment with ESCO competence classifications',
      'Step-by-step guidance for Europass Mobility Certificates',
      'Digitizing student CVs and vocational credentials',
    ],
    sourceUrl: 'https://europass.europa.eu',
    sourceTitleTr: 'Avrupa Europass Portalı',
    sourceTitleEn: 'European Europass Platform',
    readTime: '5 dk',
    isArchived: false,
  },
  {
    id: 'news-6',
    category: 'Ulusal Ajans',
    categoryColor: 'bg-slate-100 text-slate-900 border-slate-300',
    date: '10 Ağustos 2026',
    titleTr: '2027 Teklif Çağrısı Ön Bilgilendirmesi ve Konsorsiyum Başvuru Takvimi',
    titleEn: 'Advance Briefing on 2027 Call for Proposals and Consortium Schedules',
    descTr: '2027 genel teklif çağrısına ilişkin beklenen öncelikler, dijital kapsayıcılık hedefleri ve konsorsiyum oluşturma adımları hakkında bilgilendirme notu.',
    descEn: 'Strategic forecast detailing expected priorities, digital inclusion quotas, and preparation timelines for 2027 call submissions.',
    contentTr: '2027 Erasmus+ Genel Teklif Çağrısı öncesinde Avrupa Komisyonu tarafından yayımlanan hazırlık notu; dijital kapsayıcılık, yapay zeka okuryazarlığı ve dezavantajlı öğrenici kotalarındaki artışları öngörmektedir. Konsorsiyum lideri okulların hazırlık süreçlerini şimdiden başlatmaları tavsiye edilmektedir.',
    contentEn: 'The European Commission advance notice for the 2027 Call outlines increased priority for AI literacy, digital twin workshops, and higher funding caps for fewer-opportunity participants. Consortium coordinators are encouraged to initiate preparatory partnerships.',
    highlightsTr: [
      '2027 çağrısı resmi takvimi Kasım 2026\'da ilan edilecek',
      'Kısa dönemli KA122 başvuruları için tahmini son tarih Şubat 2027',
      'Konsorsiyum ortaklık protokolleri için erken hazırlık önerilir',
    ],
    highlightsEn: [
      'Official 2027 call text to be published November 2026',
      'Estimated KA122 short-term deadline in February 2027',
      'Early consortium partner agreement preparation recommended',
    ],
    sourceUrl: 'https://erasmus-plus.ec.europa.eu/programme-guide/erasmusplus-programme-guide',
    sourceTitleTr: 'Erasmus+ Program Rehberi',
    sourceTitleEn: 'Erasmus+ Programme Guide',
    readTime: '4 dk',
    isArchived: false,
  },
  // Archived Past Items (Completed / Expired Cycles)
  {
    id: 'news-archived-1',
    category: 'Arşivlenmiş Çağrı',
    categoryColor: 'bg-slate-200 text-slate-800 border-slate-300',
    date: '15 Şubat 2025',
    titleTr: '2025 Yılı Erasmus+ Mesleki Eğitim Akreditasyon ve Hibe Tahsisatı Süreci (Süresi Doldu)',
    titleEn: '2025 Erasmus+ VET Accreditation & Grant Allocation Cycle (Concluded)',
    descTr: '2025 yılı çağrı dönemine ilişkin hibe sözleşmeleri ve nihai raporlama süreçleri tamamlanmış olup, geçmiş dönem kayıtları proje arşivi amacıyla saklanmaktadır.',
    descEn: 'The 2025 call cycle official grant agreements and project lifecycles have fully concluded; historic data preserved for auditing and benchmarking.',
    contentTr: '2025 yılı çağrı takviminde yer alan hibe dağıtımı ve harcama süreçleri başarılı şekilde sonuçlanmış olup, tüm akredite kurumların nihai teknik ve mali raporları onaylanmıştır.',
    contentEn: 'All grant distribution, audit, and expenditure milestones for the 2025 cycle have concluded successfully, and final reports have been approved by the National Agency.',
    sourceUrl: 'https://www.ua.gov.tr',
    sourceTitleTr: 'Ulusal Ajans 2025 Arşivi',
    sourceTitleEn: 'National Agency 2025 Archive',
    readTime: '4 dk',
    isArchived: true,
    archiveDate: 'Mart 2026',
    archiveReason: 'Çağrı ve proje uygulama dönemi resmi olarak tamamlandı',
  },
  {
    id: 'news-archived-2',
    category: 'Arşivlenmiş Etkinlik',
    categoryColor: 'bg-slate-200 text-slate-800 border-slate-300',
    date: '20 Ekim 2025',
    titleTr: 'Erasmus Days 2025: Yeşil & Dijital Mesleki Eğitim Çalıştay Sunumları (Arşiv)',
    titleEn: 'Erasmus Days 2025: Green & Digital VET Workshop Materials (Archived)',
    descTr: 'Ekim 2025 döneminde gerçekleştirilen 12 çevrimiçi seminerin sunum ve video kayıt arşivi meslek liselerinin emsal incelemesi için erişime açıktır.',
    descEn: 'Presentation decks and session recordings from the 12 webinar series conducted during Erasmus Days 2025 are preserved for institutional review.',
    contentTr: '2025 Erasmus Days etkinliklerinde gerçekleştirilen 12 oturumun video kayıtları, sunum slaytları ve proje raporları arşiv portalında yayınlanmıştır.',
    contentEn: 'Video recordings, slide decks, and project summary leaflets from all 12 sessions of Erasmus Days 2025 remain accessible in the archive section.',
    sourceUrl: 'https://www.erasmusdays.eu',
    sourceTitleTr: 'Erasmus Days 2025 Arşiv Kayıtları',
    sourceTitleEn: 'Erasmus Days 2025 Materials',
    readTime: '3 dk',
    isArchived: true,
    archiveDate: 'Kasım 2025',
    archiveReason: 'Etkinlik serisi başarıyla tamamlandı',
  },
  {
    id: 'news-archived-3',
    category: 'Arşiv Raporu',
    categoryColor: 'bg-slate-200 text-slate-800 border-slate-300',
    date: '30 Kasım 2024',
    titleTr: '2024 Yılı Erasmus+ Mesleki Eğitim Yaygınlaştırma ve Kalite Raporu (Arşiv)',
    titleEn: '2024 Erasmus+ VET Dissemination and Quality Report (Archived)',
    descTr: '2024 yılında tamamlanan 84 meslek lisesi hareketlilik projesinin etki, bütçe kullanımı ve sonuç değerlendirme raporu.',
    descEn: 'Impact, budget utilization, and outcome evaluation report covering 84 vocational school mobility projects finalized in 2024.',
    contentTr: '84 mesleki eğitim kurumunun katılımıyla hazırlanan etki değerlendirme raporunda; öğrenci istihdam edilebilirlik artışı %28, yabancı dil yeterlilik gelişimi %42 olarak ölçülmüştür.',
    contentEn: 'Synthesized outcome analysis across 84 completed projects: learner employability increased by 28% and foreign language proficiency showed an average gain of 42%.',
    sourceUrl: 'https://erasmus-plus.ec.europa.eu',
    sourceTitleTr: 'AB Mesleki Eğitim 2024 Kalite Raporu',
    sourceTitleEn: 'EU 2024 VET Dissemination Report',
    readTime: '6 dk',
    isArchived: true,
    archiveDate: 'Ocak 2025',
    archiveReason: 'Yıllık yaygınlaştırma çıktısı arşivlendi',
  },
];

function NewsAndEventsContent() {
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const [isCookieLegalOpen, setIsCookieLegalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CALLS' | 'EVENTS' | 'RESULTS' | 'ARCHIVE'>('ALL');
  const [newsList, setNewsList] = useState<NewsItem[]>(INITIAL_NEWS_ITEMS);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [selectedNewsItem, setSelectedNewsItem] = useState<NewsItem | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedNewsItem(null);
      }
    };
    if (selectedNewsItem) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedNewsItem]);

  // Sync with search parameter if provided (?filter=ARCHIVE)
  useEffect(() => {
    const filterParam = searchParams.get('filter')?.toUpperCase();
    if (filterParam === 'ARCHIVE' || filterParam === 'CALLS' || filterParam === 'EVENTS' || filterParam === 'RESULTS') {
      setActiveFilter(filterParam as any);
    }
  }, [searchParams]);

  // Handle Archiving an Item
  const handleArchiveToggle = (itemId: string) => {
    setNewsList((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const willArchive = !item.isArchived;
          setActionNotice(
            willArchive
              ? locale === 'tr'
                ? `"${item.titleTr.substring(0, 40)}..." içeriği arşive kaldırıldı.`
                : `"${item.titleEn.substring(0, 40)}..." has been archived.`
              : locale === 'tr'
              ? `"${item.titleTr.substring(0, 40)}..." içerik yayına geri alındı.`
              : `"${item.titleEn.substring(0, 40)}..." restored to active list.`
          );
          setTimeout(() => setActionNotice(null), 4000);
          return {
            ...item,
            isArchived: willArchive,
            archiveDate: willArchive ? 'Ekim 2026' : undefined,
            archiveReason: willArchive ? 'Kullanıcı/Koordinatör tarafından arşive taşındı' : undefined,
          };
        }
        return item;
      })
    );
  };

  const archivedCount = newsList.filter((n) => n.isArchived).length;
  const activeCount = newsList.filter((n) => !n.isArchived).length;

  const filteredNews = newsList.filter((item) => {
    if (activeFilter === 'ARCHIVE') {
      return item.isArchived === true;
    }
    // All other filters apply to non-archived items
    if (item.isArchived) return false;

    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CALLS') {
      return item.id === 'news-1' || item.id === 'news-6';
    }
    if (activeFilter === 'EVENTS') {
      return item.id === 'news-2' || item.id === 'news-5';
    }
    if (activeFilter === 'RESULTS') {
      return item.id === 'news-3' || item.id === 'news-4';
    }
    return true;
  });

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
              {locale === 'tr' ? 'Haberler & Çağrı Takvimi' : 'News & Call Calendar'}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
            <span>{locale === 'tr' ? '2026-2027 Dönemi' : '2026-2027 Cycle'}</span>
            <span>•</span>
            <span>Erasmus+ VET</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Canvas */}
      <main id="main-content" tabIndex={-1} className="max-w-[1440px] mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 w-full space-y-8 focus:outline-hidden">
        {/* Toast / Action Notice */}
        {actionNotice && (
          <div className="p-3 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <span>🔔</span>
              <span>{actionNotice}</span>
            </span>
            <button
              type="button"
              onClick={() => setActionNotice(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Hero Section */}
        <section className="bg-white border-2 border-slate-300 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-900 border border-blue-200">
              <span>📢</span>
              <span>{locale === 'tr' ? 'Duyuru & Arşiv Akışı' : 'News & Archive Feed'}</span>
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

          {/* Quick Filter Bar with Dedicated ARCHIVE Tab */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {locale === 'tr' ? `Tüm Haberler (${activeCount})` : `All News (${activeCount})`}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('CALLS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'EVENTS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              🌍 {locale === 'tr' ? 'Etkinlikler & Seminerler' : 'Events & Workshops'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('RESULTS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'RESULTS'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              📋 {locale === 'tr' ? 'Sonuçlar & Rehberler' : 'Results & Guides'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ARCHIVE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === 'ARCHIVE'
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <span>🗄️</span>
              <span>{locale === 'tr' ? `Arşivlenmiş İçerikler (${archivedCount})` : `Archived Content (${archivedCount})`}</span>
            </button>
          </div>
        </section>

        {/* Distinct Section Purpose & Top 3 Resources Card */}
        <DistinctSectionPurposeCard
          sectionKey="news"
          tag={locale === 'tr' ? 'Erasmus+ Haber & Duyuru Kanalı' : 'Erasmus+ News & Announcements'}
          tagColor="bg-blue-50 text-blue-900 border-blue-200"
          title={
            locale === 'tr'
              ? 'Haberler ve Etkinlikler Bölümünün Rolü ve En Çok Aranan Kaynaklar'
              : 'News & Events Section Role & Top Searched Resources'
          }
          purposeSentence={
            locale === 'tr'
              ? 'Erasmus+ teklif çağrıları, hibe tahsisatları ve uluslararası mesleki eğitim etkinlik takvimidir.'
              : 'Official information channel for Erasmus+ call announcements, grant allocations and international VET event schedule.'
          }
          topResourcesTitle={
            locale === 'tr'
              ? 'Haberlerde En Çok Aranan 3 Kaynak ve Hızlı Erişim'
              : 'Top 3 Most Searched Resources & Direct Access'
          }
          resources={[
            {
              icon: '📢',
              title: locale === 'tr' ? 'Resmi Çağrı Duyuruları & Hibe Tahsisatı' : 'Official Call Notices & Allocations',
              description:
                locale === 'tr'
                  ? 'Ulusal Ajans tarafından yayımlanan güncel bütçe dağılımları ve yıllık tahsisat takvimi.'
                  : 'Official National Agency budget allocations, annual deadlines and proposal releases.',
              href: '/news-and-events?filter=CALLS',
              badge: locale === 'tr' ? 'Çağrılar' : 'Calls',
              onClick: () => setActiveFilter('CALLS'),
            },
            {
              icon: '🌍',
              title: locale === 'tr' ? 'Uluslararası Çalıştaylar & Erasmus Days' : 'International Workshops & Erasmus Days',
              description:
                locale === 'tr'
                  ? 'Mesleki eğitimde yeşil beceriler, dijitalleşme ve Avrupa seminer takvimi.'
                  : 'Green skills, digital transition workshops, and European webinar series calendar.',
              href: '/news-and-events?filter=EVENTS',
              badge: locale === 'tr' ? 'Etkinlikler' : 'Events',
              onClick: () => setActiveFilter('EVENTS'),
            },
            {
              icon: '🗄️',
              title: locale === 'tr' ? 'Geçmiş Çağrılar & Arşiv Deposu' : 'Concluded Calls & Content Archive',
              description:
                locale === 'tr'
                  ? 'Süresi dolmuş çağrı kayıtları, önceki yıl sunumları ve proje denetim bültenleri.'
                  : 'Historic expired calls, previous year recordings and institutional audit archives.',
              href: '/news-and-events?filter=ARCHIVE',
              badge: locale === 'tr' ? `Arşiv (${archivedCount})` : `Archive (${archivedCount})`,
              onClick: () => setActiveFilter('ARCHIVE'),
            },
          ]}
          footerNotice={
            locale === 'tr'
              ? 'Duyurular resmi makamların teyit ettiği takvimle eşzamanlı olarak anlık güncellenir.'
              : 'Announcements are continuously verified and synchronized with official publishing schedules.'
          }
        />

        {/* Archival Notice Box (When ARCHIVE tab is active) */}
        {activeFilter === 'ARCHIVE' && (
          <section className="bg-amber-50/80 border-2 border-amber-300 rounded-2xl p-5 sm:p-6 text-amber-950 space-y-2 animate-fadeIn shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xl">🗄️</span>
              <h2 className="text-sm sm:text-base font-extrabold m-0 text-amber-950">
                {locale === 'tr'
                  ? 'Resmi İçerik Arşivi ve Süresi Geçmiş Çağrılar'
                  : 'Official Content Archive & Concluded Calls'}
              </h2>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed m-0">
              {locale === 'tr'
                ? 'Bu sekmede yer alan çağrı duyuruları, çalıştay kayıtları ve raporların resmi başvuru ve uygulama süresi sona ermiştir. İçerikler akredite kurumların proje denetimleri, emsal karşılaştırmalar ve yaygınlaştırma kanıtları için arşivde muhafaza edilmektedir.'
                : 'Items in this section correspond to calls and events whose application windows have officially closed. They are retained for audit trail, benchmarking, and historical dissemination reference.'}
            </p>
          </section>
        )}

        {/* Milestone Timeline Bar (Displayed for active view) */}
        {activeFilter !== 'ARCHIVE' && (
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
                <div className="text-sm font-bold text-slate-900">
                  {locale === 'tr' ? 'KA121 Uygulama Dönemi' : 'KA121 Implementation Phase'}
                </div>
                <p className="text-xs text-slate-600 m-0">
                  {locale === 'tr' ? '2026 yılı akredite öğrenci ve personel hareketlilikleri' : '2026 accredited learner mobilities underway'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                  {locale === 'tr' ? '12-17 Ekim 2026' : '12–17 October 2026'}
                </span>
                <div className="text-sm font-bold text-slate-900">Erasmus Days 2026</div>
                <p className="text-xs text-slate-600 m-0">
                  {locale === 'tr' ? 'Tüm Avrupa ile eşzamanlı VET yaygınlaştırma günleri' : 'European-wide VET dissemination sessions'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                  {locale === 'tr' ? 'Kasım 2026' : 'November 2026'}
                </span>
                <div className="text-sm font-bold text-slate-900">
                  {locale === 'tr' ? '2027 Çağrısı Yayımı' : '2027 Call Publication'}
                </div>
                <p className="text-xs text-slate-600 m-0">
                  {locale === 'tr' ? 'Avrupa Komisyonu resmi program rehberi ilanı' : 'European Commission official guide announcement'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  {locale === 'tr' ? 'Şubat 2027' : 'February 2027'}
                </span>
                <div className="text-sm font-bold text-slate-900">
                  {locale === 'tr' ? 'KA122 Son Başvuru' : 'KA122 Deadline'}
                </div>
                <p className="text-xs text-slate-600 m-0">
                  {locale === 'tr' ? 'Kısa dönemli projeler için tahmini son teslim tarihi' : 'Estimated deadline for short-term project calls'}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* News Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
          {filteredNews.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 transition-all ${
                item.isArchived
                  ? 'bg-slate-50 border-2 border-slate-300 opacity-90'
                  : 'bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.categoryColor}`}
                  >
                    {locale === 'en' ? (CATEGORY_EN_MAP[item.category] || item.category) : item.category}
                  </span>

                  {item.isArchived ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      <span>🗄️</span>
                      <span>{locale === 'tr' ? 'Süresi Doldu / Arşiv' : 'Concluded / Archived'}</span>
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      {formatLocalizedDate(item.date, locale)}
                    </span>
                  )}
                </div>

                <h3
                  onClick={() => setSelectedNewsItem(item)}
                  className="text-base font-bold text-slate-950 leading-snug m-0 hover:text-blue-600 cursor-pointer transition-colors"
                >
                  {locale === 'tr' ? item.titleTr : item.titleEn}
                </h3>

                <p className="text-sm text-slate-600 leading-relaxed m-0">
                  {locale === 'tr' ? item.descTr : item.descEn}
                </p>

                {item.isArchived && item.archiveReason && (
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-900 font-medium">
                    <strong>{locale === 'tr' ? 'Arşiv Nedeni: ' : 'Archive Reason: '}</strong>
                    <span>{item.archiveReason}</span>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 gap-2">
                <span className="text-[11px] text-slate-400">
                  {item.isArchived
                    ? formatLocalizedDate(item.date, locale)
                    : locale === 'tr'
                    ? `${item.readTime} okuma`
                    : `${item.readTime.replace('dk', 'min')} read`}
                </span>

                <div className="flex items-center gap-2">
                  {/* Detaylar Button (Acceptance Criteria 3) */}
                  <button
                    type="button"
                    onClick={() => setSelectedNewsItem(item)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    <span>{t.newsModal.detailsBtn}</span>
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>

                  {/* Archive Toggle Button (Acceptance Criteria 3) */}
                  <button
                    type="button"
                    onClick={() => handleArchiveToggle(item.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      item.isArchived
                        ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                        : 'bg-slate-100 hover:bg-amber-100 text-slate-600 hover:text-amber-900'
                    }`}
                    title={item.isArchived ? 'Yayına geri al' : 'Bu içeriği arşive taşı'}
                  >
                    {item.isArchived
                      ? locale === 'tr' ? '↩ Arşivden Çıkar' : '↩ Restore'
                      : locale === 'tr' ? '🗄️ Arşive Kaldır' : '🗄️ Archive'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {filteredNews.length === 0 && (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <span className="text-3xl">🗄️</span>
            <h3 className="text-sm font-bold text-slate-900 m-0">
              {locale === 'tr' ? 'Bu kategoride içerik bulunamadı' : 'No items found in this section'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {locale === 'tr'
                ? 'Filtreyi değiştirerek diğer güncel duyuruları ve arşiv kayıtlarını görüntüleyebilirsiniz.'
                : 'Select another filter tab to view recent publications and archives.'}
            </p>
          </div>
        )}

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
                className="flex items-center gap-2 max-w-md mx-auto lg:mx-0"
              >
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder={locale === 'tr' ? 'E-posta adresiniz' : 'Your email address'}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  {locale === 'tr' ? 'Kaydol' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* 4. Institutional Footer */}
      <AppFooter />

      {/* 5. Modals */}
      <CookieBanner onManagePreferences={() => setIsCookieLegalOpen(true)} />
      <LegalModal
        isOpen={isCookieLegalOpen}
        onClose={() => setIsCookieLegalOpen(false)}
        initialTab="COOKIES"
      />

      {/* 6. News Details Modal (Acceptance Criteria 3) */}
      {selectedNewsItem && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="news-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedNewsItem(null);
          }}
        >
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 sticky top-0 bg-white/95 backdrop-blur-xs z-10">
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${selectedNewsItem.categoryColor}`}
                  >
                    {locale === 'en'
                      ? (CATEGORY_EN_MAP[selectedNewsItem.category] || selectedNewsItem.category)
                      : selectedNewsItem.category}
                  </span>
                  {selectedNewsItem.isArchived ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                      <span>🗄️</span>
                      <span>{locale === 'tr' ? 'Süresi Doldu / Arşiv' : 'Concluded / Archived'}</span>
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">
                      📅 {formatLocalizedDate(selectedNewsItem.date, locale)}
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-medium">
                    ⏱️ {locale === 'tr'
                      ? `${selectedNewsItem.readTime} okuma süresi`
                      : `${selectedNewsItem.readTime.replace('dk', 'min')} read`}
                  </span>
                </div>
                <h2 id="news-modal-title" className="text-lg sm:text-xl font-bold text-slate-950 leading-snug m-0">
                  {locale === 'tr' ? selectedNewsItem.titleTr : selectedNewsItem.titleEn}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNewsItem(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                aria-label={locale === 'tr' ? 'Kapat' : 'Close'}
              >
                ✕
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 text-sm text-slate-700 leading-relaxed overflow-y-auto">
              {selectedNewsItem.isArchived && selectedNewsItem.archiveReason && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                  <span className="text-lg">ℹ️</span>
                  <div>
                    <strong>{locale === 'tr' ? 'Arşiv Bilgilendirmesi: ' : 'Archive Notice: '}</strong>
                    <span>{selectedNewsItem.archiveReason}</span>
                    <p className="m-0 mt-1 text-[11px] text-amber-900">
                      {t.newsModal.archiveNotice}
                    </p>
                  </div>
                </div>
              )}

              {/* Lead Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium text-xs sm:text-sm leading-relaxed">
                {locale === 'tr' ? selectedNewsItem.descTr : selectedNewsItem.descEn}
              </div>

              {/* Extended Body Content */}
              {selectedNewsItem.contentTr && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">
                    {t.newsModal.scopeAndObjectives}
                  </h4>
                  <p className="text-slate-700 text-xs sm:text-sm leading-relaxed m-0">
                    {locale === 'tr' ? selectedNewsItem.contentTr : selectedNewsItem.contentEn}
                  </p>
                </div>
              )}

              {/* Highlights List */}
              {((locale === 'tr' ? selectedNewsItem.highlightsTr : selectedNewsItem.highlightsEn) || []).length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 m-0">
                    {t.newsModal.keyHighlights}
                  </h4>
                  <ul className="space-y-2 p-0 list-none m-0">
                    {(locale === 'tr' ? selectedNewsItem.highlightsTr : selectedNewsItem.highlightsEn)!.map((h, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-800">
                        <span className="text-blue-600 font-bold shrink-0">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between gap-3 flex-wrap">
              <div>
                {selectedNewsItem.sourceUrl && (
                  <a
                    href={selectedNewsItem.sourceUrl}
                    target={selectedNewsItem.sourceUrl.startsWith('http') ? '_blank' : undefined}
                    rel={selectedNewsItem.sourceUrl.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>
                      {locale === 'tr'
                        ? selectedNewsItem.sourceTitleTr || t.newsModal.sourceLinkBtn
                        : selectedNewsItem.sourceTitleEn || t.newsModal.sourceLinkBtn}
                    </span>
                    <span>↗</span>
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => setSelectedNewsItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors cursor-pointer"
              >
                {t.newsModal.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function NewsAndEventsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-500 text-xs font-bold">Yükleniyor...</div>}>
      <NewsAndEventsContent />
    </Suspense>
  );
}
