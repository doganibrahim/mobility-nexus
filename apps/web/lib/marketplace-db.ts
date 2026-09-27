import fs from 'fs/promises';
import path from 'path';
import {
  Course,
  CourseSession,
  CourseLearningOutcome,
  JobShadowingOffer,
  MarketplaceApplication,
  CourseFilterQuery,
  CreateCourseDto,
  CreateCourseSessionDto,
  CreateJobShadowingOfferDto,
  CreateMarketplaceApplicationDto,
  MarketplaceApplicationStatus,
  AdminCreateCourseWithSessionsDto,
} from '@mobility-nexus/types';
import { LibraryDb } from './library-db';

const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'marketplace.json');

// Optional dynamic pg pool
let pgPool: any = null;
let pgChecked = false;

async function getPgPool(): Promise<any> {
  if (pgPool) return pgPool;
  if (pgChecked) return null;
  pgChecked = true;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;

  try {
    // @ts-ignore
    const { Pool } = await import('pg');
    const isSsl =
      process.env.DATABASE_SSL === 'true' ||
      connectionString.includes('sslmode=require') ||
      connectionString.includes('railway');

    pgPool = new Pool({
      connectionString,
      ssl: isSsl ? { rejectUnauthorized: false } : undefined,
      max: 5,
      connectionTimeoutMillis: 3000,
    });
    return pgPool;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Resilient Mock Initial Dataset (Covering Both HOST and BENEFICIARY roles)
// ---------------------------------------------------------------------------

interface MarketplaceStore {
  courses: Course[];
  sessions: CourseSession[];
  outcomes: CourseLearningOutcome[];
  jobShadowingOffers: JobShadowingOffer[];
  applications: MarketplaceApplication[];
}

const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-muc-01',
    hostId: 'host-de-bavaria',
    hostName: 'Bavaria VET & Industry 4.0 Academy',
    hostCountry: 'DE',
    hostCity: 'Münih',
    hostOid: 'E10294821',
    titleTr: 'Endüstri 4.0 ve Yapay Zeka Odaklı Mesleki Eğitimcisi Kursu',
    titleEn: 'Industry 4.0 & AI Pedagogy for Vocational Educators',
    slug: 'industry-40-ai-pedagogy-vocational-educators-munich',
    descriptionTr:
      'Mesleki eğitim öğretmenlerinin atölyelerinde yapay zeka araçlarını, kestirimci bakım modellerini ve IoT sensörlerini müfredata entegre etmesini sağlayan uygulamalı 5 günlük yoğun program.',
    descriptionEn:
      'A 5-day hands-on masterclass enabling VET educators to integrate AI tools, predictive maintenance simulations, and IoT sensors into technical curricula.',
    iscedCode: '0714',
    iscedName: 'Elektronik ve Otomasyon (Electronics & Automation)',
    targetAudience: 'TEACHERS',
    durationDays: 5,
    dailyFeeEur: 80,
    language: 'English',
    minLanguageLevel: 'B1',
    isPublished: true,
    rating: 4.9,
    reviewsCount: 38,
    tags: ['Yapay Zeka', 'Endüstri 4.0', 'IoT', 'Siemens PLC', 'Akıllı Atölye'],
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: 'crs-hel-02',
    hostId: 'host-fi-nordic',
    hostName: 'Nordic Sustainability & Skills Institute',
    hostCountry: 'FI',
    hostCity: 'Helsinki',
    hostOid: 'E10183742',
    titleTr: 'Yeşil Beceriler, Sıfır Atık ve Eko-Atölye Pedagojisi',
    titleEn: 'Green Skills, Circular Economy & Eco-Workshop Pedagogy',
    slug: 'green-skills-circular-economy-eco-workshop-helsinki',
    descriptionTr:
      'Finlandiya mesleki eğitim modelinde döngüsel ekonomi, karbon ayak izi hesaplama ve meslek lisesi atölyelerini eko-tasarım prensipleriyle yönetme metodolojisi.',
    descriptionEn:
      'Finnish VET methodology for circular manufacturing, carbon footprint auditing in school workshops, and green curricula design.',
    iscedCode: '0712',
    iscedName: 'Çevre Koruma Teknolojileri (Environmental Tech)',
    targetAudience: 'VET_STAFF',
    durationDays: 7,
    dailyFeeEur: 80,
    language: 'English',
    minLanguageLevel: 'B1',
    isPublished: true,
    rating: 4.95,
    reviewsCount: 44,
    tags: ['Yeşil Beceriler', 'Finlandiya VET', 'Döngüsel Ekonomi', 'Eko-Atölye'],
    createdAt: '2026-01-20T10:00:00.000Z',
    updatedAt: '2026-03-02T11:00:00.000Z',
  },
  {
    id: 'crs-mil-03',
    hostId: 'host-it-mechatronics',
    hostName: 'Milano Mechatronics & Robotics Center',
    hostCountry: 'IT',
    hostCity: 'Milano',
    hostOid: 'E10339102',
    titleTr: 'İleri Robotik Otomasyon, Kolaboratif Robotlar (Cobot) ve Dijital İkiz',
    titleEn: 'Advanced Robotics Automation, Cobots & Digital Twin in VET',
    slug: 'advanced-robotics-cobots-digital-twin-milano',
    descriptionTr:
      'İtalyan üretim ekosisteminde cobot programlama, sanal simülasyon ve meslek lisesi öğrencilerine dijital ikiz üzerinden güvenli operatörlük öğretme eğitimi.',
    descriptionEn:
      'Collaborative robotics programming (Universal Robots/KUKA), digital twin simulation, and safety protocols for vocational workshop instructors.',
    iscedCode: '0714',
    iscedName: 'Elektronik ve Otomasyon (Electronics & Automation)',
    targetAudience: 'TEACHERS',
    durationDays: 5,
    dailyFeeEur: 80,
    language: 'English',
    minLanguageLevel: 'B1',
    isPublished: true,
    rating: 4.85,
    reviewsCount: 29,
    tags: ['Robotik', 'Cobot', 'Dijital İkiz', 'Mekatronik', 'CAD/CAM'],
    createdAt: '2026-02-01T08:30:00.000Z',
    updatedAt: '2026-03-05T09:15:00.000Z',
  },
  {
    id: 'crs-vie-04',
    hostId: 'host-at-dual-vet',
    hostName: 'Austrian Center for Dual Vocational Excellence',
    hostCountry: 'AT',
    hostCity: 'Viyana',
    hostOid: 'E10091244',
    titleTr: 'Avusturya Çift Sistemli (Dual VET) Mesleki Eğitim ve Okul-Sanayi Köprüsü',
    titleEn: 'Austrian Dual VET System, Apprenticeship Mentoring & Industry Linkage',
    slug: 'austrian-dual-vet-system-apprenticeship-vienna',
    descriptionTr:
      'Okul ile sanayi arasındaki çıraklık sözleşmeleri, işletmede stajyer mentörlüğü ve işgücü piyasası talep eşleştirmesinin Avusturya modeli üzerinden incelenmesi.',
    descriptionEn:
      'Deep dive into Austrian dual apprenticeship frameworks, corporate mentor training, and competence-based assessment for vocational leadership.',
    iscedCode: '0413',
    iscedName: 'Yönetim ve İdare (Management & Administration)',
    targetAudience: 'MIXED',
    durationDays: 5,
    dailyFeeEur: 80,
    language: 'English',
    minLanguageLevel: 'B1',
    isPublished: true,
    rating: 4.88,
    reviewsCount: 31,
    tags: ['Dual VET', 'Çıraklık Eğitimi', 'Staj Mentörlüğü', 'Avusturya Modeli'],
    createdAt: '2026-02-10T12:00:00.000Z',
    updatedAt: '2026-03-08T14:20:00.000Z',
  },
  {
    id: 'crs-bcn-05',
    hostId: 'host-es-medtech',
    hostName: 'Barcelona Tech & Automation Institute',
    hostCountry: 'ES',
    hostCity: 'Barselona',
    hostOid: 'E10228391',
    titleTr: 'Siber Güvenlik Savunması ve Bulut Altyapısı Eğitici Eğitimi',
    titleEn: 'Cybersecurity Operations & Cloud Infrastructure for VET Trainers',
    slug: 'cybersecurity-operations-cloud-infrastructure-barcelona',
    descriptionTr:
      'Mesleki eğitimde siber güvenlik laboratuvarı kurma, etik korsanlık temelleri ve AWS/Azure bulut ağ mimarilerinin uygulamalı öğretimi.',
    descriptionEn:
      'Setting up cybersecurity labs in technical colleges, SOC fundamentals, network defense drills, and AWS cloud management for teachers.',
    iscedCode: '0612',
    iscedName: 'Veritabanı ve Ağ Tasarımı (Database & Network Design)',
    targetAudience: 'TEACHERS',
    durationDays: 6,
    dailyFeeEur: 80,
    language: 'English',
    minLanguageLevel: 'B2',
    isPublished: true,
    rating: 4.92,
    reviewsCount: 22,
    tags: ['Siber Güvenlik', 'Bulut Bilişim', 'Ağ Güvenliği', 'Linux'],
    createdAt: '2026-02-14T11:00:00.000Z',
    updatedAt: '2026-03-10T15:00:00.000Z',
  },
  {
    id: 'crs-lyo-06',
    hostId: 'host-fr-culinary',
    hostName: 'Rhône-Alpes Culinary Arts & Hospitality Academy',
    hostCountry: 'FR',
    hostCity: 'Lyon',
    hostOid: 'E10459201',
    titleTr: 'Sürdürülebilir Gastronomi, Modern Pişirme Teknikleri ve Hijyen Standartları',
    titleEn: 'Sustainable Gastronomy, Modern Culinary Arts & HACCP Pedagogics',
    slug: 'sustainable-gastronomy-modern-culinary-lyon',
    descriptionTr:
      'Yiyecek-içecek hizmetleri alan öğretmenleri için sous-vide, moleküler teknikler, yerel tedarik zincirleri ve atık azaltma uygulamaları.',
    descriptionEn:
      'Modern culinary techniques, sous-vide perfection, farm-to-fork sourcing, and European food safety pedagogical standards for culinary instructors.',
    iscedCode: '1013',
    iscedName: 'Otelcilik, Restoran ve Yiyecek Hizmetleri',
    targetAudience: 'TEACHERS',
    durationDays: 5,
    dailyFeeEur: 80,
    language: 'English',
    minLanguageLevel: 'B1',
    isPublished: true,
    rating: 4.9,
    reviewsCount: 19,
    tags: ['Gastronomi', 'Yiyecek İçecek', 'Mutfak Sanatları', 'HACCP'],
    createdAt: '2026-02-18T09:30:00.000Z',
    updatedAt: '2026-03-11T12:00:00.000Z',
  },
];

const INITIAL_SESSIONS: CourseSession[] = [
  // Sessions for crs-muc-01 (Munich)
  {
    id: 'ses-muc-26a',
    courseId: 'crs-muc-01',
    startDate: '2026-10-12',
    endDate: '2026-10-16',
    city: 'Münih',
    country: 'DE',
    capacity: 15,
    enrolledCount: 9,
    status: 'OPEN',
  },
  {
    id: 'ses-muc-26b',
    courseId: 'crs-muc-01',
    startDate: '2026-11-23',
    endDate: '2026-11-27',
    city: 'Münih',
    country: 'DE',
    capacity: 15,
    enrolledCount: 13,
    status: 'LIMITED',
  },
  {
    id: 'ses-muc-27a',
    courseId: 'crs-muc-01',
    startDate: '2027-02-15',
    endDate: '2027-02-19',
    city: 'Münih',
    country: 'DE',
    capacity: 15,
    enrolledCount: 2,
    status: 'OPEN',
  },
  // Sessions for crs-hel-02 (Helsinki)
  {
    id: 'ses-hel-26a',
    courseId: 'crs-hel-02',
    startDate: '2026-10-19',
    endDate: '2026-10-25',
    city: 'Helsinki',
    country: 'FI',
    capacity: 12,
    enrolledCount: 7,
    status: 'OPEN',
  },
  {
    id: 'ses-hel-26b',
    courseId: 'crs-hel-02',
    startDate: '2026-12-07',
    endDate: '2026-12-13',
    city: 'Helsinki',
    country: 'FI',
    capacity: 12,
    enrolledCount: 12,
    status: 'FULL',
  },
  // Sessions for crs-mil-03 (Milano)
  {
    id: 'ses-mil-26a',
    courseId: 'crs-mil-03',
    startDate: '2026-10-26',
    endDate: '2026-10-30',
    city: 'Milano',
    country: 'IT',
    capacity: 14,
    enrolledCount: 8,
    status: 'OPEN',
  },
  {
    id: 'ses-mil-27a',
    courseId: 'crs-mil-03',
    startDate: '2027-03-08',
    endDate: '2027-03-12',
    city: 'Milano',
    country: 'IT',
    capacity: 14,
    enrolledCount: 3,
    status: 'OPEN',
  },
  // Sessions for crs-vie-04 (Vienna)
  {
    id: 'ses-vie-26a',
    courseId: 'crs-vie-04',
    startDate: '2026-11-09',
    endDate: '2026-11-13',
    city: 'Viyana',
    country: 'AT',
    capacity: 16,
    enrolledCount: 10,
    status: 'OPEN',
  },
  // Sessions for crs-bcn-05 (Barcelona)
  {
    id: 'ses-bcn-26a',
    courseId: 'crs-bcn-05',
    startDate: '2026-11-16',
    endDate: '2026-11-21',
    city: 'Barselona',
    country: 'ES',
    capacity: 15,
    enrolledCount: 6,
    status: 'OPEN',
  },
  // Sessions for crs-lyo-06 (Lyon)
  {
    id: 'ses-lyo-26a',
    courseId: 'crs-lyo-06',
    startDate: '2026-10-05',
    endDate: '2026-10-09',
    city: 'Lyon',
    country: 'FR',
    capacity: 10,
    enrolledCount: 5,
    status: 'OPEN',
  },
];

const INITIAL_OUTCOMES: CourseLearningOutcome[] = [
  {
    id: 'clo-muc-1',
    courseId: 'crs-muc-01',
    outcomeTr: 'Mesleki teknik atölyelerde endüstriyel PLC sistemlerine IoT sensör veri akışı entegre edebilme.',
    outcomeEn: 'Ability to integrate IoT sensor telemetry into industrial PLC environments in school workshops.',
    escoSkillCode: 'S1.2.4',
    escoSkillLabel: 'Industrial Automation & Telemetry',
    orderIndex: 1,
  },
  {
    id: 'clo-muc-2',
    courseId: 'crs-muc-01',
    outcomeTr: 'Öğrencilere kestirimci bakım (predictive maintenance) algoritmalarını simülatörlerle öğretebilme.',
    outcomeEn: 'Proficiency in teaching predictive maintenance algorithmic models using workshop simulators.',
    escoSkillCode: 'S4.8.1',
    escoSkillLabel: 'Predictive Maintenance Analytics',
    orderIndex: 2,
  },
  {
    id: 'clo-hel-1',
    courseId: 'crs-hel-02',
    outcomeTr: 'Meslek okulu üretim hatlarında döngüsel atık yönetimi ve karbon ayak izi izleme tasarımı.',
    outcomeEn: 'Designing circular waste reduction and carbon tracking workflows in technical vocational centers.',
    escoSkillCode: 'S7.1.0',
    escoSkillLabel: 'Environmental Life Cycle Assessment',
    orderIndex: 1,
  },
  {
    id: 'clo-mil-1',
    courseId: 'crs-mil-03',
    outcomeTr: 'Universal Robots / KUKA kolaboratif robotların emniyetli operatörlük ve görsel programlama eğitimi.',
    outcomeEn: 'Visual programming and collaborative safety certification for industrial robotic cells.',
    escoSkillCode: 'S2.9.3',
    escoSkillLabel: 'Cobot Programming & Industrial Robotics',
    orderIndex: 1,
  },
];

const INITIAL_JOB_SHADOWING_OFFERS: JobShadowingOffer[] = [
  {
    id: 'jso-stu-01',
    hostId: 'host-de-bavaria',
    hostName: 'Bavaria VET & Industry 4.0 Academy (Bosch Partner)',
    country: 'DE',
    city: 'Stuttgart',
    vetField: 'Otomotiv ve Elektrikli Araç Teknolojileri',
    iscedCode: '0716',
    titleTr: 'Elektrikli ve Hibrit Araçlar Batarya Teşhis Laboratuvarı İşbaşı İnceleme',
    titleEn: 'EV & Hybrid Vehicle Battery Diagnostics Laboratory Job Shadowing',
    descriptionTr:
      'Almanya otomotiv sanayisi kalbinde, yüksek gerilimli batarya söküm-takım güvenliği, CAN-Bus arıza analizi ve okul atölyelerine uyarlanabilir pratik eğitim setlerinin yerinde incelenmesi.',
    descriptionEn:
      'Direct observation of high-voltage battery test-benches, CAN-Bus diagnostic procedures, and vocational workshop safety in a Tier-1 German automotive hub.',
    eligibleStaffTypes: ['Vocational Teachers', 'Motor Vehicles Instructors', 'Electrical Lab Leads'],
    durationDays: 5,
    maxCapacityPerSlot: 4,
    languages: ['English', 'German'],
    workingEnvironmentDetails: 'Tier-1 automotive diagnostic test center and high-voltage training bay.',
    status: 'ACTIVE',
    createdAt: '2026-02-05T10:00:00.000Z',
  },
  {
    id: 'jso-val-02',
    hostId: 'host-es-medtech',
    hostName: 'Valencia Renewable Energy Innovation Park',
    country: 'ES',
    city: 'Valensiya',
    vetField: 'Yenilenebilir Enerji ve Mikro-Şebekeler',
    iscedCode: '0713',
    titleTr: 'Güneş Fotovoltaik Santralleri ve Akıllı Mikro-Şebeke Saha Gözlemi',
    titleEn: 'Solar Photovoltaic Parks & Smart Microgrid Field Job Shadowing',
    descriptionTr:
      'Güneş enerjisi invertör testleri, çatı tipi fotovoltaik montaj simülatörleri ve meslek lisesi öğrencileri için emniyet standartlarının Akdeniz tesislerinde gözlemlenmesi.',
    descriptionEn:
      'Practical observation of inverter performance testing, rooftop PV installation simulators, and grid-tie maintenance protocols.',
    eligibleStaffTypes: ['Renewable Energy Teachers', 'Electrical Workshop Instructors'],
    durationDays: 5,
    maxCapacityPerSlot: 3,
    languages: ['English', 'Spanish'],
    workingEnvironmentDetails: 'Utility-scale solar array and technical training training park.',
    status: 'ACTIVE',
    createdAt: '2026-02-12T14:00:00.000Z',
  },
  {
    id: 'jso-hel-03',
    hostId: 'host-fi-nordic',
    hostName: 'Nordic Sustainability & Wood Technology Center',
    country: 'FI',
    city: 'Helsinki',
    vetField: 'Ahşap Teknolojisi ve Eko-İnşaat',
    iscedCode: '0722',
    titleTr: 'Modern CNC Ahşap İşleme ve Eko-Tasarım Atölye Gözlemi',
    titleEn: 'Modern CNC Timber Processing & Eco-Design Workshop Job Shadowing',
    descriptionTr:
      'Finlandiya sürdürülebilir orman ürünleri ve CLT (çapraz lamine ahşap) prefabrik yapı elemanlarının meslek okulu atölyelerinde işlenmesi ve dijital kesim yöntemleri.',
    descriptionEn:
      'Observation of 5-axis CNC timber machining, circular eco-joinery, and Finnish sustainable vocational methods.',
    eligibleStaffTypes: ['Woodworking Teachers', 'Architecture & Design Instructors'],
    durationDays: 5,
    maxCapacityPerSlot: 4,
    languages: ['English'],
    workingEnvironmentDetails: 'Digital timber fabrication workshop and prototyping lab.',
    status: 'ACTIVE',
    createdAt: '2026-02-18T16:00:00.000Z',
  },
  {
    id: 'jso-rot-04',
    hostId: 'host-nl-portlogistics',
    hostName: 'Rotterdam Smart Logistics & Port Institute',
    country: 'NL',
    city: 'Rotterdam',
    vetField: 'Lojistik ve Akıllı Depo Yönetimi',
    iscedCode: '1041',
    titleTr: 'Otomasyonlu Antrepo, AGV ve Liman Lojistiği İşbaşı İncelemesi',
    titleEn: 'Automated Warehousing, AGV Systems & Port Logistics Job Shadowing',
    descriptionTr:
      'Avrupa’nın en büyük limanında otomatik yönlendirmeli araçlar (AGV), RFID envanter izleme ve liman tedarik zinciri süreçlerinin meslek öğretmenleri tarafından incelenmesi.',
    descriptionEn:
      'Hands-on observation of automated container terminals, AGV operations, and RFID tracking for logistics teachers.',
    eligibleStaffTypes: ['Logistics Teachers', 'Supply Chain Instructors'],
    durationDays: 5,
    maxCapacityPerSlot: 4,
    languages: ['English'],
    workingEnvironmentDetails: 'Automated distribution center and port container simulation lab.',
    status: 'ACTIVE',
    createdAt: '2026-02-22T11:00:00.000Z',
  },
];

const INITIAL_APPLICATIONS: MarketplaceApplication[] = [
  // 1. Pending Course Application from Beneficiary School to Munich Host
  {
    id: 'app-mkt-001',
    applicationType: 'COURSE',
    courseId: 'crs-muc-01',
    sessionId: 'ses-muc-26a',
    hostId: 'host-de-bavaria',
    hostName: 'Bavaria VET & Industry 4.0 Academy',
    schoolId: 'org-tr-pendik',
    schoolName: 'İstanbul Pendik Borsa İstanbul Mesleki ve Teknik Anadolu Lisesi',
    schoolOid: 'E10384729',
    schoolCity: 'İstanbul',
    contactName: 'Ahmet Yılmaz',
    contactEmail: 'a.yilmaz@pendikmtal.k12.tr',
    contactPhone: '+90 532 111 2233',
    projectType: 'KA121',
    participantCount: 3,
    durationDays: 5,
    totalGrantEur: 1200, // 3 teachers * 5 days * 80 EUR
    specialNotes:
      'Okulumuz KA121 akredite kurumu olup bilişim ve elektrik bölümünden 3 öğretmenimiz katılacaktır. Kurs içeriğindeki Siemens PLC ve AI entegrasyonu okulumuzun stratejik hedeflerindedir.',
    status: 'PENDING',
    hostDecisionNote: null,
    courseTitle: 'Endüstri 4.0 ve Yapay Zeka Odaklı Mesleki Eğitimcisi Kursu',
    sessionDates: '2026-10-12 / 2026-10-16',
    sessionLocation: 'Münih, Almanya',
    createdAt: '2026-03-12T10:30:00.000Z',
    updatedAt: '2026-03-12T10:30:00.000Z',
  },
  // 2. Confirmed Course Application from Beneficiary School to Milano Host
  {
    id: 'app-mkt-002',
    applicationType: 'COURSE',
    courseId: 'crs-mil-03',
    sessionId: 'ses-mil-26a',
    hostId: 'host-it-mechatronics',
    hostName: 'Milano Mechatronics & Robotics Center',
    schoolId: 'org-tr-ostim',
    schoolName: 'Ankara Ostim Şehit Alper Zor Mesleki ve Teknik Anadolu Lisesi',
    schoolOid: 'E10192847',
    schoolCity: 'Ankara',
    contactName: 'Elif Kaya',
    contactEmail: 'e.kaya@ostimmtal.k12.tr',
    contactPhone: '+90 533 444 5566',
    projectType: 'KA122',
    participantCount: 2,
    durationDays: 5,
    totalGrantEur: 800, // 2 teachers * 5 days * 80 EUR
    specialNotes:
      'KA122-VET projemiz hibe almaya hak kazanmıştır. 2 mekatronik öğretmenimiz için resmi kabul mektubu (Letter of Intent) talep ediyoruz.',
    status: 'CONFIRMED',
    hostDecisionNote:
      'Başvurunuz ve OID numaranız incelenmiş olup 2 kişilik kontenjan ayrılmıştır. Resmi kabul belgeniz e-posta ile iletilmiştir.',
    courseTitle: 'İleri Robotik Otomasyon, Kolaboratif Robotlar (Cobot) ve Dijital İkiz',
    sessionDates: '2026-10-26 / 2026-10-30',
    sessionLocation: 'Milano, İtalya',
    createdAt: '2026-03-08T14:15:00.000Z',
    updatedAt: '2026-03-09T11:00:00.000Z',
  },
  // 3. Pending Job Shadowing Application to Stuttgart
  {
    id: 'app-mkt-003',
    applicationType: 'JOB_SHADOWING',
    jobShadowingId: 'jso-stu-01',
    hostId: 'host-de-bavaria',
    hostName: 'Bavaria VET & Industry 4.0 Academy (Bosch Partner)',
    schoolId: 'org-tr-bursa',
    schoolName: 'Bursa Otomotiv İhracatçıları Birliği MTAL',
    schoolOid: 'E10029381',
    schoolCity: 'Bursa',
    contactName: 'Murat Demir',
    contactEmail: 'm.demir@oibmtal.k12.tr',
    contactPhone: '+90 535 777 8899',
    projectType: 'KA121',
    participantCount: 2,
    durationDays: 5,
    totalGrantEur: 800,
    specialNotes:
      'Motorlu araçlar teknolojisi alan şefimiz ve 1 atölye öğretmenimiz elektrikli araç batarya testlerini yerinde incelemek üzere başvurmaktadır.',
    status: 'PENDING',
    hostDecisionNote: null,
    jobShadowingTitle: 'Elektrikli ve Hibrit Araçlar Batarya Teşhis Laboratuvarı İşbaşı İnceleme',
    sessionDates: '2026-10-19 / 2026-10-23 (Öneri)',
    sessionLocation: 'Stuttgart, Almanya',
    createdAt: '2026-03-14T09:00:00.000Z',
    updatedAt: '2026-03-14T09:00:00.000Z',
  },
];

// Helper to calculate Erasmus+ Grant
export function calculateErasmusGrant(participants: number, days: number, dailyFee = 80): number {
  // Erasmus+ rule: daily fee is 80 EUR, capped at max 10 days (800 EUR) per participant
  const cappedDays = Math.min(Math.max(days, 1), 10);
  const feePerPerson = cappedDays * dailyFee;
  return participants * feePerPerson;
}

// Memory Store for runtime resilience
let memoryStore: MarketplaceStore = {
  courses: [...INITIAL_COURSES],
  sessions: [...INITIAL_SESSIONS],
  outcomes: [...INITIAL_OUTCOMES],
  jobShadowingOffers: [...INITIAL_JOB_SHADOWING_OFFERS],
  applications: [...INITIAL_APPLICATIONS],
};

async function readFromFile(): Promise<MarketplaceStore> {
  try {
    const content = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    if (data && Array.isArray(data.courses)) {
      memoryStore = data;
      return memoryStore;
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await writeToFile(memoryStore);
    }
  }
  return memoryStore;
}

async function writeToFile(data: MarketplaceStore): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE_PATH), { recursive: true });
    await fs.writeFile(DATA_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing marketplace data to file:', err);
  }
}

// ---------------------------------------------------------------------------
// MarketplaceDb Public API
// ---------------------------------------------------------------------------

export const MarketplaceDb = {
  /**
   * Retrieves courses with their active sessions and learning outcomes
   */
  async getAllCourses(filters?: CourseFilterQuery): Promise<Course[]> {
    await readFromFile();
    let courses = [...memoryStore.courses];

    if (filters) {
      if (filters.country) {
        courses = courses.filter(
          (c) => c.hostCountry.toUpperCase() === filters.country?.toUpperCase()
        );
      }
      if (filters.iscedCode) {
        courses = courses.filter((c) => c.iscedCode.startsWith(filters.iscedCode!));
      }
      if (filters.targetAudience && filters.targetAudience !== 'ALL') {
        courses = courses.filter(
          (c) => c.targetAudience === filters.targetAudience || c.targetAudience === 'MIXED'
        );
      }
      if (filters.minLanguageLevel) {
        courses = courses.filter((c) => c.minLanguageLevel === filters.minLanguageLevel);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        courses = courses.filter(
          (c) =>
            c.titleTr.toLowerCase().includes(q) ||
            c.titleEn.toLowerCase().includes(q) ||
            c.descriptionTr.toLowerCase().includes(q) ||
            c.hostName.toLowerCase().includes(q) ||
            c.hostCity.toLowerCase().includes(q) ||
            c.tags.some((t) => t.toLowerCase().includes(q))
        );
      }
    }

    // Attach sessions and learning outcomes
    return courses.map((course) => ({
      ...course,
      sessions: memoryStore.sessions.filter((s) => s.courseId === course.id),
      learningOutcomes: memoryStore.outcomes.filter((o) => o.courseId === course.id),
    }));
  },

  /**
   * Retrieves a single course by ID with sessions and outcomes
   */
  async getCourseById(id: string): Promise<Course | null> {
    await readFromFile();
    const course = memoryStore.courses.find((c) => c.id === id);
    if (!course) return null;

    return {
      ...course,
      sessions: memoryStore.sessions.filter((s) => s.courseId === course.id),
      learningOutcomes: memoryStore.outcomes.filter((o) => o.courseId === course.id),
    };
  },

  /**
   * Retrieves all Job Shadowing offers
   */
  async getAllJobShadowingOffers(): Promise<JobShadowingOffer[]> {
    await readFromFile();
    return memoryStore.jobShadowingOffers;
  },

  /**
   * Retrieves Job Shadowing offer by ID
   */
  async getJobShadowingById(id: string): Promise<JobShadowingOffer | null> {
    await readFromFile();
    const offer = memoryStore.jobShadowingOffers.find((o) => o.id === id);
    return offer || null;
  },

  /**
   * Retrieves applications (filterable by school OID or host ID)
   */
  async getApplications(filters?: {
    schoolOid?: string;
    hostId?: string;
  }): Promise<MarketplaceApplication[]> {
    await readFromFile();
    let apps = [...memoryStore.applications];

    if (filters?.schoolOid) {
      apps = apps.filter((a) => a.schoolOid.toLowerCase() === filters.schoolOid?.toLowerCase());
    }
    if (filters?.hostId) {
      apps = apps.filter((a) => a.hostId === filters.hostId);
    }

    // Order descending by creation date
    return apps.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  /**
   * Creates a new application from a Beneficiary school
   */
  async createApplication(
    dto: CreateMarketplaceApplicationDto
  ): Promise<MarketplaceApplication> {
    await readFromFile();

    const id = `app-mkt-${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 4)}`;
    const durationDays = dto.durationDays || 5;
    const totalGrantEur = calculateErasmusGrant(dto.participantCount, durationDays, 80);

    let courseTitle = '';
    let sessionDates = '';
    let sessionLocation = '';
    let jobShadowingTitle = '';

    if (dto.courseId) {
      const course = memoryStore.courses.find((c) => c.id === dto.courseId);
      courseTitle = course ? course.titleTr : '';
    }
    if (dto.sessionId) {
      const session = memoryStore.sessions.find((s) => s.id === dto.sessionId);
      if (session) {
        sessionDates = `${session.startDate} / ${session.endDate}`;
        sessionLocation = `${session.city}, ${session.country}`;
      }
    }
    if (dto.jobShadowingId) {
      const jso = memoryStore.jobShadowingOffers.find((j) => j.id === dto.jobShadowingId);
      if (jso) {
        jobShadowingTitle = jso.titleTr;
        sessionLocation = `${jso.city}, ${jso.country}`;
      }
    }

    const newApp: MarketplaceApplication = {
      id,
      applicationType: dto.applicationType,
      courseId: dto.courseId || null,
      sessionId: dto.sessionId || null,
      jobShadowingId: dto.jobShadowingId || null,
      hostId: dto.hostId,
      hostName: dto.hostName,
      schoolId: dto.schoolId || null,
      schoolName: dto.schoolName,
      schoolOid: dto.schoolOid,
      schoolCity: dto.schoolCity || null,
      contactName: dto.contactName,
      contactEmail: dto.contactEmail,
      contactPhone: dto.contactPhone || null,
      projectType: dto.projectType,
      participantCount: dto.participantCount,
      durationDays,
      totalGrantEur,
      specialNotes: dto.specialNotes || null,
      status: 'PENDING',
      hostDecisionNote: null,
      courseTitle: courseTitle || null,
      sessionDates: sessionDates || null,
      sessionLocation: sessionLocation || null,
      jobShadowingTitle: jobShadowingTitle || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.applications.unshift(newApp);
    await writeToFile(memoryStore);
    return newApp;
  },

  /**
   * Host Action: Review and update application status (CONFIRMED / DECLINED)
   * If CONFIRMED, automatically increments the session's enrolled_count and marks as FULL if needed.
   */
  async updateApplicationStatus(
    id: string,
    status: MarketplaceApplicationStatus,
    note?: string
  ): Promise<MarketplaceApplication | null> {
    await readFromFile();
    const appIndex = memoryStore.applications.findIndex((a) => a.id === id);
    if (appIndex === -1) return null;

    const currentApp = memoryStore.applications[appIndex];
    const previousStatus = currentApp.status;

    currentApp.status = status;
    currentApp.hostDecisionNote = note || currentApp.hostDecisionNote;
    currentApp.updatedAt = new Date().toISOString();

    // Capacity Management Logic:
    // If transition to CONFIRMED and has sessionId, increment capacity
    if (status === 'CONFIRMED' && previousStatus !== 'CONFIRMED' && currentApp.sessionId) {
      const session = memoryStore.sessions.find((s) => s.id === currentApp.sessionId);
      if (session) {
        session.enrolledCount = Math.min(
          session.capacity,
          session.enrolledCount + currentApp.participantCount
        );
        if (session.enrolledCount >= session.capacity) {
          session.status = 'FULL';
        } else if (session.enrolledCount >= session.capacity * 0.8) {
          session.status = 'LIMITED';
        }
      }
    }

    // If cancelled or declined after being confirmed, decrement capacity
    if (
      (status === 'DECLINED' || status === 'CANCELLED') &&
      previousStatus === 'CONFIRMED' &&
      currentApp.sessionId
    ) {
      const session = memoryStore.sessions.find((s) => s.id === currentApp.sessionId);
      if (session) {
        session.enrolledCount = Math.max(0, session.enrolledCount - currentApp.participantCount);
        if (session.enrolledCount < session.capacity) {
          session.status = 'OPEN';
        }
      }
    }

    memoryStore.applications[appIndex] = currentApp;
    await writeToFile(memoryStore);
    return currentApp;
  },

  /**
   * Host Action: Create a new Course
   */
  async createCourse(dto: CreateCourseDto): Promise<Course> {
    await readFromFile();
    const id = `crs-${dto.hostCountry.toLowerCase()}-${Date.now().toString(36)}`;
    const slug = `${dto.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${dto.hostCity.toLowerCase()}`;

    const newCourse: Course = {
      id,
      hostId: dto.hostId,
      hostName: dto.hostName,
      hostCountry: dto.hostCountry,
      hostCity: dto.hostCity,
      hostOid: dto.hostOid || null,
      titleTr: dto.titleTr,
      titleEn: dto.titleEn,
      slug,
      descriptionTr: dto.descriptionTr,
      descriptionEn: dto.descriptionEn,
      iscedCode: dto.iscedCode,
      iscedName: dto.iscedName || null,
      targetAudience: dto.targetAudience || 'TEACHERS',
      durationDays: dto.durationDays || 5,
      dailyFeeEur: dto.dailyFeeEur || 80,
      language: dto.language || 'English',
      minLanguageLevel: dto.minLanguageLevel || 'B1',
      isPublished: true,
      rating: 5.0,
      reviewsCount: 1,
      tags: dto.tags || ['Yeni İlan', 'Erasmus+'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sessions: [],
      learningOutcomes: [],
    };

    memoryStore.courses.unshift(newCourse);

    // Add outcomes if provided
    if (dto.learningOutcomesTr && dto.learningOutcomesTr.length > 0) {
      dto.learningOutcomesTr.forEach((outTr, idx) => {
        const outEn = dto.learningOutcomesEn?.[idx] || outTr;
        const clo: CourseLearningOutcome = {
          id: `clo-${id}-${idx + 1}`,
          courseId: id,
          outcomeTr: outTr,
          outcomeEn: outEn,
          orderIndex: idx + 1,
        };
        memoryStore.outcomes.push(clo);
      });
    }

    await writeToFile(memoryStore);

    // Record CMS Revision
    try {
      await LibraryDb.logRevision({
        entityType: 'COURSE',
        entityId: id,
        entityTitle: newCourse.titleTr,
        action: 'CREATE',
        changesSummary: `Yeni kurs tanımlandı (${newCourse.titleTr} - ${newCourse.hostCity}, ${newCourse.hostCountry}).`,
        payloadAfter: newCourse as any,
      });
    } catch (e) {
      console.warn('Failed to log CMS revision for createCourse:', e);
    }

    return this.getCourseById(id) as Promise<Course>;
  },

  /**
   * Admin / Host Action: Create a Course with initial Sessions
   */
  async createCourseWithSessions(dto: AdminCreateCourseWithSessionsDto): Promise<Course> {
    const course = await this.createCourse(dto);
    if (dto.sessions && dto.sessions.length > 0) {
      for (const s of dto.sessions) {
        await this.createSession({
          courseId: course.id,
          startDate: s.startDate,
          endDate: s.endDate,
          city: s.city || course.hostCity,
          country: s.country || course.hostCountry,
          capacity: s.capacity || 15,
        });
      }
    }
    return (await this.getCourseById(course.id)) as Course;
  },

  /**
   * Host Action: Add a Session to an existing course
   */
  async createSession(dto: CreateCourseSessionDto): Promise<CourseSession> {
    await readFromFile();
    const id = `ses-${dto.courseId}-${Date.now().toString(36)}`;

    const newSession: CourseSession = {
      id,
      courseId: dto.courseId,
      startDate: dto.startDate,
      endDate: dto.endDate,
      city: dto.city,
      country: dto.country,
      capacity: dto.capacity || 15,
      enrolledCount: 0,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.sessions.push(newSession);
    await writeToFile(memoryStore);
    return newSession;
  },

  /**
   * Host Action: Post a new Job Shadowing slot
   */
  async createJobShadowingOffer(
    dto: CreateJobShadowingOfferDto
  ): Promise<JobShadowingOffer> {
    await readFromFile();
    const id = `jso-${dto.country.toLowerCase()}-${Date.now().toString(36)}`;

    const newOffer: JobShadowingOffer = {
      id,
      hostId: dto.hostId,
      hostName: dto.hostName,
      country: dto.country,
      city: dto.city,
      vetField: dto.vetField,
      iscedCode: dto.iscedCode || null,
      titleTr: dto.titleTr,
      titleEn: dto.titleEn,
      descriptionTr: dto.descriptionTr,
      descriptionEn: dto.descriptionEn,
      eligibleStaffTypes: dto.eligibleStaffTypes || ['Vocational Teachers', 'Workshop Leads'],
      durationDays: dto.durationDays || 5,
      maxCapacityPerSlot: dto.maxCapacityPerSlot || 4,
      languages: dto.languages || ['English'],
      workingEnvironmentDetails: dto.workingEnvironmentDetails || null,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryStore.jobShadowingOffers.unshift(newOffer);
    await writeToFile(memoryStore);
    return newOffer;
  },

  /**
   * Admin / Host Action: Update an existing Course
   */
  async updateCourse(
    id: string,
    dto: Partial<Course> & { learningOutcomesTr?: string[]; learningOutcomesEn?: string[] }
  ): Promise<Course | null> {
    await readFromFile();
    const index = memoryStore.courses.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const existing = memoryStore.courses[index];
    const updated: Course = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };

    memoryStore.courses[index] = updated;

    if (dto.learningOutcomesTr && dto.learningOutcomesTr.length > 0) {
      memoryStore.outcomes = memoryStore.outcomes.filter((o) => o.courseId !== id);
      dto.learningOutcomesTr.forEach((outTr, idx) => {
        const outEn = dto.learningOutcomesEn?.[idx] || outTr;
        memoryStore.outcomes.push({
          id: `clo-${id}-${idx + 1}-${Date.now().toString(36)}`,
          courseId: id,
          outcomeTr: outTr,
          outcomeEn: outEn,
          orderIndex: idx + 1,
        });
      });
    }

    await writeToFile(memoryStore);

    try {
      await LibraryDb.logRevision({
        entityType: 'COURSE',
        entityId: id,
        entityTitle: updated.titleTr,
        action: 'UPDATE',
        changesSummary: `Kurs bilgileri ve müfredat revize edildi.`,
        payloadBefore: existing as any,
        payloadAfter: updated as any,
      });
    } catch (e) {
      console.warn('Failed to log CMS revision for updateCourse:', e);
    }

    return this.getCourseById(id);
  },

  /**
   * Admin / Host Action: Delete / Archive a Course
   */
  async deleteCourse(id: string): Promise<boolean> {
    await readFromFile();
    const prevLen = memoryStore.courses.length;
    const existing = memoryStore.courses.find((c) => c.id === id);
    memoryStore.courses = memoryStore.courses.filter((c) => c.id !== id);
    if (memoryStore.courses.length !== prevLen) {
      memoryStore.sessions = memoryStore.sessions.filter((s) => s.courseId !== id);
      memoryStore.outcomes = memoryStore.outcomes.filter((o) => o.courseId !== id);
      await writeToFile(memoryStore);

      try {
        if (existing) {
          await LibraryDb.logRevision({
            entityType: 'COURSE',
            entityId: id,
            entityTitle: existing.titleTr,
            action: 'DELETE',
            changesSummary: `Kurs ve ilişkili tüm oturum/çıktılar yayından kaldırıldı.`,
            payloadBefore: existing as any,
          });
        }
      } catch (e) {
        console.warn('Failed to log CMS revision for deleteCourse:', e);
      }

      return true;
    }
    return false;
  },

  /**
   * Admin / Host Action: Update an existing Session
   */
  async updateSession(id: string, dto: Partial<CourseSession>): Promise<CourseSession | null> {
    await readFromFile();
    const index = memoryStore.sessions.findIndex((s) => s.id === id);
    if (index === -1) return null;

    const existing = memoryStore.sessions[index];
    const updated: CourseSession = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    memoryStore.sessions[index] = updated;
    await writeToFile(memoryStore);
    return updated;
  },

  /**
   * Admin / Host Action: Delete a Session
   */
  async deleteSession(id: string): Promise<boolean> {
    await readFromFile();
    const prevLen = memoryStore.sessions.length;
    memoryStore.sessions = memoryStore.sessions.filter((s) => s.id !== id);
    if (memoryStore.sessions.length !== prevLen) {
      await writeToFile(memoryStore);
      return true;
    }
    return false;
  },

  /**
   * Admin / Host Action: Update a Job Shadowing Offer
   */
  async updateJobShadowingOffer(
    id: string,
    dto: Partial<JobShadowingOffer>
  ): Promise<JobShadowingOffer | null> {
    await readFromFile();
    const index = memoryStore.jobShadowingOffers.findIndex((j) => j.id === id);
    if (index === -1) return null;

    const existing = memoryStore.jobShadowingOffers[index];
    const updated: JobShadowingOffer = {
      ...existing,
      ...dto,
      updatedAt: new Date().toISOString(),
    };
    memoryStore.jobShadowingOffers[index] = updated;
    await writeToFile(memoryStore);
    return updated;
  },

  /**
   * Admin / Host Action: Delete a Job Shadowing Offer
   */
  async deleteJobShadowingOffer(id: string): Promise<boolean> {
    await readFromFile();
    const prevLen = memoryStore.jobShadowingOffers.length;
    memoryStore.jobShadowingOffers = memoryStore.jobShadowingOffers.filter((j) => j.id !== id);
    if (memoryStore.jobShadowingOffers.length !== prevLen) {
      await writeToFile(memoryStore);
      return true;
    }
    return false;
  },
};
