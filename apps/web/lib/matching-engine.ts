/**
 * ErasmusMobility - Client-Side Resilient Matching Engine
 * Implements identical 10 Hard Filters & Two-Tier Scoring as the Backend API.
 */

import {
  MatchHostsRequestDto,
  HostMatchCandidate,
  MatchHostsResponseDto,
  HostVerificationStatus,
} from '@mobility-nexus/types';

export interface ClientHostRecord {
  id: string;
  name: string;
  legalName?: string;
  tradingName?: string;
  organisationType: string;
  slug: string;
  countryCode: string;
  city: string;
  registeredAddress: string;
  yearEstablished: number;
  oid: string;
  websiteUrl: string;
  generalEmail: string;
  telephone: string;
  primarySector: string;
  verificationStatus: HostVerificationStatus;
  profileCompletenessScore: number;
  contactPerson: string;
  contactTitle?: string;
  contactEmail: string;
  contactLanguages: string[];
  languages: string[];
  maxLearnersPerTerm: number;
  totalAnnualCapacity: number;
  activities: string[];
  isActive: boolean;
  providesAccommodation: boolean;
  accommodationDetails?: string | null;
  providesMeals: boolean;
  mealsDetails?: string | null;
  providesTransfers: boolean;
  transfersDetails?: string | null;
  acceptsUnder18: boolean;
  minDurationDays?: number;
  maxDurationDays?: number;
  accessibilityFeatures?: {
    wheelchairAccessible?: boolean;
    specialDiet?: boolean;
    visualAid?: boolean;
  };
  hasKa121: boolean;
  hasKa122: boolean;
  hasVetLearner: boolean;
  hasStaffMobility: boolean;
  yearsOfExperience: number;
  totalParticipantsHosted: number;
  turkishGroupsHosted: number;
  turkishParticipantsHosted: number;
  emergencyContactPerson?: string;
  emergencyContactPhone?: string;
  shortDescription?: string;
}

export const CLIENT_SEED_HOSTS: ClientHostRecord[] = [
  {
    id: 'host-de-technordic',
    name: '[MOCK] TechNordic Digital Solutions (Simülasyon)',
    legalName: '[MOCK / DEMO] TechNordic Digital Solutions GmbH',
    tradingName: 'TechNordic Demo Hub',
    organisationType: 'Company / SME',
    slug: 'mock-technordic-digital-solutions',
    countryCode: 'DE',
    city: 'Leipzig',
    registeredAddress: 'Karl-Liebknecht-Straße 144, 04277 Leipzig, Germany',
    yearEstablished: 2016,
    oid: 'E10394821',
    websiteUrl: 'https://technordic.demo.example.eu',
    generalEmail: 'erasmus@technordic.demo.example.eu',
    telephone: '+49 341 8920190',
    primarySector: 'software_dev',
    verificationStatus: 'VERIFIED',
    profileCompletenessScore: 95,
    contactPerson: 'Klaus Lindemann (Mock)',
    contactTitle: 'Head of VET Internships & Erasmus+',
    contactEmail: 'klaus.lindemann@demo.example.eu',
    contactLanguages: ['EN', 'DE'],
    languages: ['EN', 'DE'],
    maxLearnersPerTerm: 12,
    totalAnnualCapacity: 36,
    activities: [
      'VET_SHORT_TERM',
      'VET_LONG_TERM_PRO',
      'JOB_SHADOWING',
      'TEACHING_ASSIGNMENT',
      'PREPARATORY_VISIT',
    ],
    isActive: true,
    providesAccommodation: true,
    accommodationDetails: 'Partner 3-star campus hotel & student dorms in Leipzig Zentrum (Wi-Fi, 24/7 security)',
    providesMeals: true,
    mealsDetails: 'Breakfast at hotel and lunch meal vouchers provided (halal & vegan friendly)',
    providesTransfers: true,
    transfersDetails: 'Leipzig/Halle Airport shuttle & 30-day MDV public transportation pass',
    acceptsUnder18: true,
    minDurationDays: 10,
    maxDurationDays: 180,
    accessibilityFeatures: {
      wheelchairAccessible: true,
      specialDiet: true,
      visualAid: false,
    },
    hasKa121: true,
    hasKa122: true,
    hasVetLearner: true,
    hasStaffMobility: true,
    yearsOfExperience: 8,
    totalParticipantsHosted: 340,
    turkishGroupsHosted: 5,
    turkishParticipantsHosted: 64,
    emergencyContactPerson: 'Dr. Anna Becker (Mock)',
    emergencyContactPhone: '+49 176 8839201',
    shortDescription: '[SİMÜLASYON VERİSİDİR] Almanya Leipzig merkezli yazılım, web geliştirme ve yapay zeka uygulamaları simülasyonu için oluşturulmuş örnek işletme profili.',
  },
  {
    id: 'host-es-iberia-vet',
    name: '[MOCK] Iberia EcoTech VET Hub (Simülasyon)',
    legalName: '[MOCK / DEMO] Iberia EcoTech Vocational Training S.L.',
    tradingName: 'Iberia EcoTech Demo Hub',
    organisationType: 'Training centre',
    slug: 'mock-iberia-ecotech-vet-hub',
    countryCode: 'ES',
    city: 'Valencia',
    registeredAddress: 'Carrer de Colon 28, 46004 Valencia, Spain',
    yearEstablished: 2018,
    oid: 'E10284719',
    websiteUrl: 'https://iberia-ecotech.demo.example.eu',
    generalEmail: 'mobility@iberia-ecotech.demo.example.eu',
    telephone: '+34 963 829100',
    primarySector: 'renewable_energy',
    verificationStatus: 'VERIFIED',
    profileCompletenessScore: 92,
    contactPerson: 'Elena Garcia Ortiz (Mock)',
    contactTitle: 'Erasmus Coordinator',
    contactEmail: 'elena.garcia@demo.example.eu',
    contactLanguages: ['EN', 'ES'],
    languages: ['EN', 'ES'],
    maxLearnersPerTerm: 16,
    totalAnnualCapacity: 48,
    activities: [
      'VET_SHORT_TERM',
      'VET_GROUP_MOBILITY',
      'VET_SKILLS_COMPETITION',
      'JOB_SHADOWING',
      'HOSTING_TEACHERS',
    ],
    isActive: true,
    providesAccommodation: true,
    accommodationDetails: 'Erasmus student residence in central Valencia (Double/single rooms, self-catering kitchen)',
    providesMeals: true,
    mealsDetails: 'Full board: Breakfast at residence, lunch at partner company, dinner vouchers',
    providesTransfers: true,
    transfersDetails: 'Valencia Manises Airport pick-up and metro card included',
    acceptsUnder18: true,
    minDurationDays: 7,
    maxDurationDays: 90,
    accessibilityFeatures: {
      wheelchairAccessible: true,
      specialDiet: true,
      visualAid: false,
    },
    hasKa121: true,
    hasKa122: true,
    hasVetLearner: true,
    hasStaffMobility: true,
    yearsOfExperience: 6,
    totalParticipantsHosted: 280,
    turkishGroupsHosted: 4,
    turkishParticipantsHosted: 52,
    emergencyContactPerson: 'Carlos Navarro (Mock)',
    emergencyContactPhone: '+34 612 345678',
    shortDescription: '[SİMÜLASYON VERİSİDİR] Güneş enerjisi, fotovoltaik sistemler ve temiz teknoloji stajı simülasyonu için oluşturulmuş örnek İspanyol eğitim merkezi profili.',
  },
  {
    id: 'host-it-meccatronica',
    name: '[MOCK] Bologna Meccatronica Hub (Simülasyon - Yalnızca 18+)',
    legalName: '[MOCK / DEMO] Consorzio Bologna Meccatronica Industriale SCARL',
    tradingName: 'Bologna Robotics Demo Lab',
    organisationType: 'Sectoral organisation',
    slug: 'mock-bologna-meccatronica-hub',
    countryCode: 'IT',
    city: 'Bologna',
    registeredAddress: 'Via dell\'Industria 42, 40138 Bologna, Italy',
    yearEstablished: 2014,
    oid: 'E10192847',
    websiteUrl: 'https://bologna-meccatronica.demo.example.eu',
    generalEmail: 'info@bologna-meccatronica.demo.example.eu',
    telephone: '+39 051 829100',
    primarySector: 'automation_robotics',
    verificationStatus: 'VERIFIED',
    profileCompletenessScore: 88,
    contactPerson: 'Marco Rossi (Mock)',
    contactTitle: 'Technical Director & VET Mentor',
    contactEmail: 'marco.rossi@demo.example.eu',
    contactLanguages: ['EN', 'IT'],
    languages: ['EN', 'IT'],
    maxLearnersPerTerm: 8,
    totalAnnualCapacity: 24,
    activities: [
      'VET_SHORT_TERM',
      'VET_LONG_TERM_PRO',
      'JOB_SHADOWING',
      'INVITED_EXPERT',
    ],
    isActive: true,
    providesAccommodation: true,
    accommodationDetails: 'Partner hotel near central station',
    providesMeals: false,
    providesTransfers: true,
    transfersDetails: 'Bologna Marconi Airport shuttle',
    acceptsUnder18: false, // Disqualified if under 18 requested
    minDurationDays: 14,
    maxDurationDays: 180,
    accessibilityFeatures: {
      wheelchairAccessible: false,
      specialDiet: false,
      visualAid: false,
    },
    hasKa121: true,
    hasKa122: true,
    hasVetLearner: true,
    hasStaffMobility: true,
    yearsOfExperience: 10,
    totalParticipantsHosted: 420,
    turkishGroupsHosted: 6,
    turkishParticipantsHosted: 70,
    emergencyContactPerson: 'Matteo Conti (Mock)',
    emergencyContactPhone: '+39 340 8920192',
    shortDescription: '[SİMÜLASYON VERİSİDİR] İtalya Motor Vadisi bölgesinde endüstriyel robotik stajı simülasyonu için oluşturulmuş örnek sanayi konsorsiyumu (Yalnızca 18+ yetişkin stajyer kabul eder).',
  },
  {
    id: 'host-pl-silesia-green',
    name: '[MOCK] Silesia Green Manufacturing (Simülasyon - KA122 Only)',
    legalName: '[MOCK / DEMO] Silesia Green Manufacturing Sp. z o.o.',
    tradingName: 'Silesia GreenTech Demo',
    organisationType: 'Company / SME',
    slug: 'mock-silesia-green-manufacturing',
    countryCode: 'PL',
    city: 'Katowice',
    registeredAddress: 'ul. Francuska 34, 40-028 Katowice, Poland',
    yearEstablished: 2019,
    oid: 'E10482910',
    websiteUrl: 'https://silesia-green.demo.example.eu',
    generalEmail: 'office@silesia-green.demo.example.eu',
    telephone: '+48 32 8920190',
    primarySector: 'electrical_electronics',
    verificationStatus: 'UNDER_REVIEW',
    profileCompletenessScore: 78,
    contactPerson: 'Piotr Wisniewski (Mock)',
    contactTitle: 'Project Manager',
    contactEmail: 'p.wisniewski@demo.example.eu',
    contactLanguages: ['EN', 'PL'],
    languages: ['EN', 'PL'],
    maxLearnersPerTerm: 10,
    totalAnnualCapacity: 30,
    activities: [
      'VET_SHORT_TERM',
      'JOB_SHADOWING',
      'STAFF_COURSE_TRAINING',
    ],
    isActive: true,
    providesAccommodation: true,
    accommodationDetails: 'Modern student hostel near the facility',
    providesMeals: true,
    mealsDetails: 'Canteen hot lunch & breakfast',
    providesTransfers: false,
    acceptsUnder18: true,
    minDurationDays: 10,
    maxDurationDays: 60,
    accessibilityFeatures: {
      wheelchairAccessible: true,
      specialDiet: false,
      visualAid: false,
    },
    hasKa121: false, // KA122 only!
    hasKa122: true,
    hasVetLearner: true,
    hasStaffMobility: true,
    yearsOfExperience: 4,
    totalParticipantsHosted: 110,
    turkishGroupsHosted: 2,
    turkishParticipantsHosted: 24,
    emergencyContactPerson: 'Agnieszka Kowalska (Mock)',
    emergencyContactPhone: '+48 601 892019',
    shortDescription: '[SİMÜLASYON VERİSİDİR] Polonya Katowice sanayi bölgesinde elektronik devre tasarımı üzerine staj simülasyonu için oluşturulmuş örnek üretim tesisi (Yalnızca KA122).',
  },
  {
    id: 'host-nl-rotterdam-port',
    name: '[MOCK] Rotterdam Port Logistics Academy (Simülasyon)',
    legalName: '[MOCK / DEMO] Rotterdam Port Logistics Training B.V.',
    tradingName: 'SmartPort Demo Academy',
    organisationType: 'Training centre',
    slug: 'mock-rotterdam-port-logistics-academy',
    countryCode: 'NL',
    city: 'Rotterdam',
    registeredAddress: 'Wilhelminakade 955, 3072 AP Rotterdam, Netherlands',
    yearEstablished: 2015,
    oid: 'E10592837',
    websiteUrl: 'https://rotterdam-port.demo.example.eu',
    generalEmail: 'contact@rotterdam-port.demo.example.eu',
    telephone: '+31 10 8291020',
    primarySector: 'logistics_transport',
    verificationStatus: 'VERIFIED',
    profileCompletenessScore: 90,
    contactPerson: 'Jan van der Meer (Mock)',
    contactTitle: 'Director of International Mobility',
    contactEmail: 'jan.vandermeer@demo.example.eu',
    contactLanguages: ['EN', 'NL'],
    languages: ['EN', 'NL'],
    maxLearnersPerTerm: 20,
    totalAnnualCapacity: 60,
    activities: [
      'VET_SHORT_TERM',
      'VET_LONG_TERM_PRO',
      'JOB_SHADOWING',
      'PREPARATORY_VISIT',
    ],
    isActive: true,
    providesAccommodation: false,
    providesMeals: false,
    providesTransfers: false,
    acceptsUnder18: true,
    minDurationDays: 14,
    maxDurationDays: 120,
    accessibilityFeatures: {
      wheelchairAccessible: true,
      specialDiet: true,
      visualAid: true,
    },
    hasKa121: true,
    hasKa122: true,
    hasVetLearner: true,
    hasStaffMobility: true,
    yearsOfExperience: 9,
    totalParticipantsHosted: 510,
    turkishGroupsHosted: 7,
    turkishParticipantsHosted: 95,
    emergencyContactPerson: 'Sanne de Jong (Mock)',
    emergencyContactPhone: '+31 6 82910291',
    shortDescription: '[SİMÜLASYON VERİSİDİR] Rotterdam liman lojistiği, gümrükleme yazılımları ve depo otomasyonu staj simülasyonu için oluşturulmuş örnek akademi profili (Kendi lojistiğini yöneten gruplar için).',
  },
  {
    id: 'host-cz-bohemia-mech',
    name: '[MOCK] Bohemia Precision Engineering (Simülasyon - Düşük Kontenjan)',
    legalName: '[MOCK / DEMO] Bohemia Precision Strojírenství s.r.o.',
    tradingName: 'Bohemia Precision Demo',
    organisationType: 'Factory / industrial company',
    slug: 'mock-bohemia-precision-engineering',
    countryCode: 'CZ',
    city: 'Brno',
    registeredAddress: 'Technologická 820, 612 00 Brno, Czech Republic',
    yearEstablished: 2017,
    oid: 'E10692817',
    websiteUrl: 'https://bohemia-precision.demo.example.eu',
    generalEmail: 'info@bohemia-precision.demo.example.eu',
    telephone: '+420 538 920190',
    primarySector: 'machinery_cnc',
    verificationStatus: 'UNDER_REVIEW',
    profileCompletenessScore: 82,
    contactPerson: 'Tomas Dvorak (Mock)',
    contactTitle: 'Senior Training Engineer',
    contactEmail: 'tomas.dvorak@demo.example.eu',
    contactLanguages: ['EN', 'CZ'],
    languages: ['EN', 'CZ'],
    maxLearnersPerTerm: 6,
    totalAnnualCapacity: 18,
    activities: [
      'VET_SHORT_TERM',
      'JOB_SHADOWING',
      'HOSTING_TEACHERS',
    ],
    isActive: true,
    providesAccommodation: true,
    accommodationDetails: 'Technical university dorm with single & twin rooms',
    providesMeals: true,
    mealsDetails: 'Factory lunch included; self-catering kitchen for evening meals',
    providesTransfers: true,
    transfersDetails: 'Brno/Vienna Airport pick-up by institute van',
    acceptsUnder18: true,
    minDurationDays: 10,
    maxDurationDays: 60,
    accessibilityFeatures: {
      wheelchairAccessible: false,
      specialDiet: false,
      visualAid: false,
    },
    hasKa121: true,
    hasKa122: true,
    hasVetLearner: true,
    hasStaffMobility: true,
    yearsOfExperience: 5,
    totalParticipantsHosted: 130,
    turkishGroupsHosted: 3,
    turkishParticipantsHosted: 30,
    emergencyContactPerson: 'Klara Novakova (Mock)',
    emergencyContactPhone: '+420 777 892019',
    shortDescription: '[SİMÜLASYON VERİSİDİR] Çekya Brno teknoloji vadisinde 5 eksenli CNC işleme ve hassas metroloji staj simülasyonu için oluşturulmuş örnek üretim işletmesi (6 kişilik butik kontenjan).',
  },
  {
    id: 'host-es-andalucia-gastro',
    name: '[MOCK] Andalucía Gastro & Hospitality Hub (Simülasyon - Yalnızca Öğrenci)',
    legalName: '[MOCK / DEMO] Centro Andaluz de Hostelería y Turismo S.L.',
    tradingName: 'Andalucía Gastro Demo',
    organisationType: 'Training centre',
    slug: 'mock-andalucia-gastro-hospitality',
    countryCode: 'ES',
    city: 'Sevilla',
    registeredAddress: 'Av. de la Constitución 18, 41004 Sevilla, Spain',
    yearEstablished: 2012,
    oid: 'E10782910',
    websiteUrl: 'https://andalucia-gastro.demo.example.eu',
    generalEmail: 'international@andalucia-gastro.demo.example.eu',
    telephone: '+34 954 829100',
    primarySector: 'tourism_hospitality',
    verificationStatus: 'VERIFIED',
    profileCompletenessScore: 94,
    contactPerson: 'Maria Jose Lopez (Mock)',
    contactTitle: 'Director of International Relations',
    contactEmail: 'mj.lopez@demo.example.eu',
    contactLanguages: ['EN', 'ES'],
    languages: ['EN', 'ES'],
    maxLearnersPerTerm: 14,
    totalAnnualCapacity: 42,
    activities: [
      'VET_SHORT_TERM',
      'VET_LONG_TERM_PRO',
      'VET_SKILLS_COMPETITION',
      'JOB_SHADOWING',
    ],
    isActive: true,
    providesAccommodation: true,
    accommodationDetails: 'Partner hotel residence with 24/7 reception in historic center',
    providesMeals: true,
    mealsDetails: 'Full board: Training kitchen dining + partner restaurant dinners',
    providesTransfers: true,
    transfersDetails: 'Sevilla San Pablo Airport private transfer',
    acceptsUnder18: true,
    minDurationDays: 14,
    maxDurationDays: 180,
    accessibilityFeatures: {
      wheelchairAccessible: true,
      specialDiet: true,
      visualAid: false,
    },
    hasKa121: true,
    hasKa122: true,
    hasVetLearner: true,
    hasStaffMobility: false, // Students only!
    yearsOfExperience: 12,
    totalParticipantsHosted: 620,
    turkishGroupsHosted: 8,
    turkishParticipantsHosted: 110,
    emergencyContactPerson: 'Alvaro Ruiz (Mock)',
    emergencyContactPhone: '+34 655 892019',
    shortDescription: '[SİMÜLASYON VERİSİDİR] Sevilla bölgesinde otel işletmeciliği ve mutfak sanatları staj simülasyonu için oluşturulmuş örnek gastronomi enstitüsü (Yalnızca öğrenci stajı).',
  },
  {
    id: 'host-de-bavaria-digital',
    name: '[MOCK] Bavaria EV Training Center (Simülasyon - Yalnızca Öğretmen)',
    legalName: '[MOCK / DEMO] Bayerisches Zentrum für Digitale Mobilität gGmbH',
    tradingName: 'Bavaria Digital Demo',
    organisationType: 'Training centre',
    slug: 'mock-bavaria-ev-training-center',
    countryCode: 'DE',
    city: 'Munich',
    registeredAddress: 'Frankfurter Ring 193, 80807 München, Germany',
    yearEstablished: 2020,
    oid: 'E10891029',
    websiteUrl: 'https://bavaria-ev.demo.example.eu',
    generalEmail: 'info@bavaria-ev.demo.example.eu',
    telephone: '+49 89 3291000',
    primarySector: 'automotive_ev',
    verificationStatus: 'PENDING',
    profileCompletenessScore: 70,
    contactPerson: 'Stefan Gruber (Mock)',
    contactTitle: 'Coordinator for Staff Mobilities',
    contactEmail: 'stefan.gruber@demo.example.eu',
    contactLanguages: ['EN', 'DE'],
    languages: ['EN', 'DE'],
    maxLearnersPerTerm: 4,
    totalAnnualCapacity: 12,
    activities: [
      'JOB_SHADOWING',
      'STAFF_COURSE_TRAINING',
      'TEACHING_ASSIGNMENT',
    ],
    isActive: true,
    providesAccommodation: false,
    providesMeals: false,
    providesTransfers: false,
    acceptsUnder18: true,
    minDurationDays: 2,
    maxDurationDays: 30,
    accessibilityFeatures: {
      wheelchairAccessible: false,
      specialDiet: false,
      visualAid: false,
    },
    hasKa121: true,
    hasKa122: true,
    hasVetLearner: false, // Staff only!
    hasStaffMobility: true,
    yearsOfExperience: 3,
    totalParticipantsHosted: 65,
    turkishGroupsHosted: 1,
    turkishParticipantsHosted: 8,
    emergencyContactPerson: 'Helena Wolf (Mock)',
    emergencyContactPhone: '+49 171 8920199',
    shortDescription: '[SİMÜLASYON VERİSİDİR] Münih merkezli, otomotiv yan sanayisi ve elektrikli araç batarya montajı alanında öğretmen işbaşı gözlem simülasyonu sunan örnek merkez (Yalnızca personel/öğretmen).',
  },
];

export function evaluateHardFiltersClient(
  host: ClientHostRecord,
  query: MatchHostsRequestDto,
): { isEligible: boolean; disqualificationReasons: string[]; passedFilters: string[] } {
  const passedFilters: string[] = [];
  const disqualificationReasons: string[] = [];

  // 1. Project Type Match
  if (query.projectType === 'KA121' && host.hasKa121 === false) {
    disqualificationReasons.push('Ev sahibi KA121 (Akredite) hareketlilik kabul etmemektedir.');
  } else if (query.projectType === 'KA122' && host.hasKa122 === false) {
    disqualificationReasons.push('Ev sahibi KA122 (Kısa Dönem) hareketlilik kabul etmemektedir.');
  } else {
    passedFilters.push('project_type');
  }

  // 2. Country Match
  const requestedCountries = (query.targetCountries || []).map((c) => c.toUpperCase());
  const isAnyCountry =
    requestedCountries.length === 0 ||
    requestedCountries.includes('ANY') ||
    requestedCountries.includes('TÜMÜ') ||
    requestedCountries.includes('ALL');

  if (!isAnyCountry && !requestedCountries.includes((host.countryCode || '').toUpperCase())) {
    disqualificationReasons.push(
      `Hedef ülke uyuşmazlığı: Ev sahibi ${host.countryCode} ülkesindedir. Tercih edilen ülkeler: [${requestedCountries.join(', ')}].`,
    );
  } else {
    passedFilters.push('country');
  }

  // 3. Activity Type Match
  const hostActivities = host.activities || [];
  if (!hostActivities.includes(query.mobilityGoal)) {
    disqualificationReasons.push(
      `Faaliyet türü uyuşmazlığı: Ev sahibi seçilen faaliyeti (${query.mobilityGoal}) sunmamaktadır.`,
    );
  } else {
    passedFilters.push('activity_type');
  }

  // 4. Participant Profile Match
  if (query.participantType === 'student' && host.hasVetLearner === false) {
    disqualificationReasons.push('Ev sahibi meslek lisesi öğrencisi (stajyer) kabul etmemektedir.');
  } else if (
    (query.participantType === 'teacher' || query.participantType === 'staff') &&
    host.hasStaffMobility === false
  ) {
    disqualificationReasons.push('Ev sahibi öğretmen/eğitici personel hareketliliği kabul etmemektedir.');
  } else {
    passedFilters.push('participant_profile');
  }

  // 5. Capacity Check
  const totalNeeded = (query.participantCount || 0) + (query.accompanyingPersonsCount || 0);
  const maxCapacity = host.maxLearnersPerTerm || 4;
  if (totalNeeded > maxCapacity) {
    disqualificationReasons.push(
      `Kontenjan yetersizliği: Talep edilen ${totalNeeded} kişi (${query.participantCount} asil + ${query.accompanyingPersonsCount || 0} refakatçi), ev sahibi dönemlik azami kontenjanı ${maxCapacity} kişi.`,
    );
  } else {
    passedFilters.push('capacity');
  }

  // 6. Age Group
  if ((query.ageGroup === 'under_18' || query.ageGroup === 'mixed') && host.acceptsUnder18 === false) {
    disqualificationReasons.push('Ev sahibi yasal/kurumsal olarak 18 yaş altı (reşit olmayan) stajyer kabul etmemektedir.');
  } else {
    passedFilters.push('age_group');
  }

  // 7. Duration Check
  if (query.durationDays && query.durationDays > 0) {
    const minDays = host.minDurationDays || 2;
    const maxDays = host.maxDurationDays || 365;
    if (query.durationDays < minDays || query.durationDays > maxDays) {
      disqualificationReasons.push(
        `Süre uyuşmazlığı: Talep edilen ${query.durationDays} gün, ev sahibi kabul sınırları [${minDays}–${maxDays}] gün.`,
      );
    } else {
      passedFilters.push('duration');
    }
  } else {
    passedFilters.push('duration');
  }

  // 8. Language Compatibility
  const hostLangs = (host.languages || ['EN']).map((l) => l.toUpperCase());
  const reqLangs = (query.languages && query.languages.length > 0 ? query.languages : ['EN']).map((l) => l.toUpperCase());
  const hasLangOverlap = reqLangs.some((l) => hostLangs.includes(l)) || hostLangs.includes('EN');
  if (!hasLangOverlap) {
    disqualificationReasons.push(
      `Dil uyuşmazlığı: Ev sahibi dilleri [${hostLangs.join(', ')}], talep edilen [${reqLangs.join(', ')}].`,
    );
  } else {
    passedFilters.push('language');
  }

  // 9. Special Needs
  if (query.specialNeeds?.wheelchairAccessible && !host.accessibilityFeatures?.wheelchairAccessible) {
    disqualificationReasons.push('Erişilebilirlik uyuşmazlığı: Ev sahibi tekerlekli sandalye erişimine uygun değildir.');
  } else if (query.specialNeeds?.specialDiet && !host.accessibilityFeatures?.specialDiet) {
    disqualificationReasons.push('Özel diyet uyuşmazlığı: Ev sahibi talep edilen özel diyet/beslenme desteğini sağlayamamaktadır.');
  } else {
    passedFilters.push('special_needs');
  }

  return {
    isEligible: disqualificationReasons.length === 0,
    disqualificationReasons,
    passedFilters,
  };
}

export function calculateEducationQualityScoreClient(
  host: ClientHostRecord,
  query: MatchHostsRequestDto,
): { score: number; label: string; breakdown: any } {
  let sectorScore = 15;
  if (query.vetField) {
    const vField = query.vetField.toLowerCase();
    const pSector = (host.primarySector || '').toLowerCase();
    if (vField === pSector || pSector.includes(vField) || vField.includes(pSector)) {
      sectorScore = 25;
    } else if (
      (vField.includes('software') && pSector.includes('automation')) ||
      (vField.includes('electric') && pSector.includes('energy')) ||
      (vField.includes('machinery') && pSector.includes('robotics'))
    ) {
      sectorScore = 20;
    }
  } else {
    sectorScore = 20;
  }

  let activityScore = 15;
  if (host.activities && host.activities.includes(query.mobilityGoal)) {
    activityScore = 25;
  }

  let kycScore = 8;
  if (host.verificationStatus === 'VERIFIED') {
    kycScore = 20;
  } else if (host.verificationStatus === 'UNDER_REVIEW') {
    kycScore = 14;
  }

  let expScore = 8;
  const completeness = host.profileCompletenessScore || 50;
  expScore = Math.round((completeness / 100) * 10);
  if ((host.turkishGroupsHosted || 0) > 0) {
    expScore = Math.min(15, expScore + 5);
  }

  let langScore = 10;
  const hostLangs = (host.languages || ['EN']).map((l) => l.toUpperCase());
  if (hostLangs.includes('EN') && hostLangs.length > 1) {
    langScore = 15;
  }

  const total = Math.min(100, sectorScore + activityScore + kycScore + expScore + langScore);

  let label = 'Yetersiz Uyum';
  if (total >= 85) label = 'Mükemmel Eğitim Kalitesi (Excellent)';
  else if (total >= 70) label = 'Yüksek Eğitim Kalitesi (High)';
  else if (total >= 55) label = 'Yeterli Eğitim Kalitesi (Moderate)';

  return {
    score: total,
    label,
    breakdown: {
      sectorMatch: Math.round((sectorScore / 25) * 100),
      activityMatch: Math.round((activityScore / 25) * 100),
      kycTrust: Math.round((kycScore / 20) * 100),
      experience: Math.round((expScore / 15) * 100),
      languageMatch: Math.round((langScore / 15) * 100),
    },
  };
}

export function calculateLogisticsScoreClient(
  host: ClientHostRecord,
  query: MatchHostsRequestDto,
): { score: number; label: string; breakdown: any } {
  const reqAccom = query.logisticsRequired?.accommodation;
  const reqMeals = query.logisticsRequired?.meals;
  const reqTransfers = query.logisticsRequired?.transfers;

  let accomScore = 20;
  if (host.providesAccommodation) {
    accomScore = host.accommodationDetails ? 30 : 25;
  } else if (reqAccom) {
    accomScore = 0;
  }

  let mealsScore = 15;
  if (host.providesMeals) {
    mealsScore = host.mealsDetails ? 20 : 16;
  } else if (reqMeals) {
    mealsScore = 0;
  }

  let transferScore = 15;
  if (host.providesTransfers) {
    transferScore = host.transfersDetails ? 20 : 16;
  } else if (reqTransfers) {
    transferScore = 0;
  }

  let emergencyScore = 8;
  if (host.emergencyContactPerson && host.emergencyContactPhone) {
    emergencyScore = 15;
  } else if (host.emergencyContactPhone) {
    emergencyScore = 12;
  }

  let accompanyingScore = 10;
  const totalCount = (query.participantCount || 0) + (query.accompanyingPersonsCount || 0);
  const capacityHeadroom = (host.maxLearnersPerTerm || 4) - totalCount;
  if (capacityHeadroom >= 2) {
    accompanyingScore = 15;
  } else if (capacityHeadroom >= 0) {
    accompanyingScore = 12;
  }

  const total = Math.min(100, accomScore + mealsScore + transferScore + emergencyScore + accompanyingScore);

  let label = 'Temel Lojistik';
  if (total >= 85) label = 'Kapsamlı Lojistik Desteği (Comprehensive)';
  else if (total >= 70) label = 'İyi Düzeyde Lojistik (Good)';
  else if (total >= 50) label = 'Kısmi Lojistik Desteği (Partial)';
  else label = 'Lojistik Desteği Yok / Bağımsız (Self-Managed)';

  return {
    score: total,
    label,
    breakdown: {
      accommodation: Math.round((accomScore / 30) * 100),
      meals: Math.round((mealsScore / 20) * 100),
      transfers: Math.round((transferScore / 20) * 100),
      emergencySupport: Math.round((emergencyScore / 15) * 100),
      accompanyingSupport: Math.round((accompanyingScore / 15) * 100),
    },
  };
}

export function matchHostsClientSide(
  query: MatchHostsRequestDto,
  hostsPool: ClientHostRecord[] = CLIENT_SEED_HOSTS,
): MatchHostsResponseDto {
  const matches: HostMatchCandidate[] = [];
  const disqualified: HostMatchCandidate[] = [];

  for (const host of hostsPool) {
    const { isEligible, disqualificationReasons, passedFilters } = evaluateHardFiltersClient(host, query);
    const { score: educationScore, label: educationScoreLabel, breakdown: eduBreakdown } =
      calculateEducationQualityScoreClient(host, query);
    const { score: logisticsScore, label: logisticsScoreLabel, breakdown: logBreakdown } =
      calculateLogisticsScoreClient(host, query);

    const hasLogisticsRequest = Boolean(
      query.logisticsRequired?.accommodation ||
      query.logisticsRequired?.meals ||
      query.logisticsRequired?.transfers,
    );

    const compositeScore = hasLogisticsRequest
      ? Math.round(educationScore * 0.7 + logisticsScore * 0.3)
      : educationScore;

    let matchGrade: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
    if (compositeScore >= 85) matchGrade = 'EXCELLENT';
    else if (compositeScore >= 70) matchGrade = 'HIGH';
    else if (compositeScore >= 55) matchGrade = 'MODERATE';

    const candidate: HostMatchCandidate = {
      hostId: host.id,
      hostName: host.name,
      legalName: host.legalName,
      countryCode: host.countryCode,
      city: host.city,
      oid: host.oid,
      primarySector: host.primarySector,
      organisationType: host.organisationType,
      verificationStatus: host.verificationStatus,
      profileCompletenessScore: host.profileCompletenessScore,
      shortDescription: host.shortDescription,
      websiteUrl: host.websiteUrl,
      providesAccommodation: host.providesAccommodation,
      accommodationDetails: host.accommodationDetails,
      providesMeals: host.providesMeals,
      mealsDetails: host.mealsDetails,
      providesTransfers: host.providesTransfers,
      transfersDetails: host.transfersDetails,
      acceptsUnder18: host.acceptsUnder18,
      maxLearnersPerTerm: host.maxLearnersPerTerm,
      supportedActivities: host.activities,
      workingLanguages: host.languages,
      isEligible,
      disqualificationReasons,
      passedFilters,
      educationScore,
      educationScoreLabel,
      logisticsScore,
      logisticsScoreLabel,
      compositeScore,
      matchGrade,
      scoreBreakdown: {
        sectorMatch: eduBreakdown.sectorMatch,
        activityMatch: eduBreakdown.activityMatch,
        kycTrust: eduBreakdown.kycTrust,
        experience: eduBreakdown.experience,
        languageMatch: eduBreakdown.languageMatch,
        accommodation: logBreakdown.accommodation,
        meals: logBreakdown.meals,
        transfers: logBreakdown.transfers,
        emergencySupport: logBreakdown.emergencySupport,
      },
    };

    if (isEligible) {
      matches.push(candidate);
    } else {
      disqualified.push(candidate);
    }
  }

  matches.sort((a, b) => b.compositeScore - a.compositeScore || b.educationScore - a.educationScore);
  disqualified.sort((a, b) => b.compositeScore - a.compositeScore);

  const totalParticipants = (query.participantCount || 0) + (query.accompanyingPersonsCount || 0);

  return {
    totalEvaluated: hostsPool.length,
    eligibleCount: matches.length,
    disqualifiedCount: disqualified.length,
    matches,
    disqualified,
    queryCriteria: {
      projectType: query.projectType,
      targetCountries: query.targetCountries || [],
      mobilityGoal: query.mobilityGoal,
      participantType: query.participantType,
      totalParticipants,
      ageGroup: query.ageGroup,
      vetField: query.vetField,
    },
  };
}
