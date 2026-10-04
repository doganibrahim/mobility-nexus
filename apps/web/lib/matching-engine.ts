/**
 * ErasmusMobility - Client-Side Resilient Matching Engine
 * Implements identical 10 Hard Filters & Two-Tier Scoring as the Backend API.
 */

import {
  MatchHostsRequestDto,
  HostMatchCandidate,
  MatchHostsResponseDto,
  HostVerificationStatus,
  SevenCriteriaDiagnostics,
  CriterionEvaluation,
  MatchingCriterionKey,
  CriterionMatchStatus,
  EvaluateCriteriaRequestDto,
  EvaluateCriteriaResponseDto,
  EvaluateCriteriaItemResult,
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

  // 10. Mandatory Logistics Requirements (Strict Hard Filter)
  if (query.logisticsRequired?.accommodation && !host.providesAccommodation) {
    disqualificationReasons.push('Zorunlu konaklama şartı karşılanmıyor: Ev sahibi konaklama hizmeti sunmamaktadır.');
  } else {
    passedFilters.push('logistics_accommodation');
  }

  if (query.logisticsRequired?.meals && !host.providesMeals) {
    disqualificationReasons.push('Zorunlu yemek şartı karşılanmıyor: Ev sahibi yemek hizmeti sunmamaktadır.');
  } else {
    passedFilters.push('logistics_meals');
  }

  if (query.logisticsRequired?.transfers && !host.providesTransfers) {
    disqualificationReasons.push('Zorunlu transfer şartı karşılanmıyor: Ev sahibi transfer hizmeti sunmamaktadır.');
  } else {
    passedFilters.push('logistics_transfers');
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

/**
 * 7 Core Matching Criteria Engine (PKG-IMP-03)
 * Evaluates: Country (15%), Activity (20%), Target Group (15%), Dates (10%), Duration (10%), Capacity (15%), Logistics (15%)
 */
export function evaluateSevenCriteriaClient(
  host: ClientHostRecord,
  query: MatchHostsRequestDto,
): SevenCriteriaDiagnostics {
  const criteria: CriterionEvaluation[] = [];
  const primaryBlockersTr: string[] = [];
  const primaryBlockersEn: string[] = [];
  const actionableRecommendationsTr: string[] = [];
  const actionableRecommendationsEn: string[] = [];

  // 1. Country Match (Weight: 15%)
  const requestedCountries = (query.targetCountries || []).map((c) => c.toUpperCase());
  const isAnyCountry =
    requestedCountries.length === 0 ||
    requestedCountries.includes('ANY') ||
    requestedCountries.includes('TÜMÜ') ||
    requestedCountries.includes('ALL');

  const hostCountry = (host.countryCode || '').toUpperCase();
  const countryMatch = isAnyCountry || requestedCountries.includes(hostCountry);

  const countryEval: CriterionEvaluation = {
    key: 'country',
    labelTr: 'Hedef Ülke Uyumu',
    labelEn: 'Target Country Match',
    weightPercent: 15,
    status: countryMatch ? 'MATCH' : 'MISMATCH',
    scoreContribution: countryMatch ? 100 : 0,
    weightedScore: countryMatch ? 15 : 0,
    schoolRequested: isAnyCountry ? 'Tüm Uygun AB Ülkeleri (Any)' : requestedCountries.join(', '),
    hostProvided: `${host.countryCode} (${host.city})`,
    messageTr: countryMatch
      ? `Ev sahibi (${host.countryCode} - ${host.city}), okulun hedef ülke tercihi ile tam uyumludur.`
      : `Hedef ülke uyuşmazlığı: Ev sahibi ${host.countryCode} ülkesindedir. Tercih edilen: [${requestedCountries.join(', ')}].`,
    messageEn: countryMatch
      ? `Host location (${host.countryCode} - ${host.city}) fully matches preferred countries.`
      : `Country mismatch: Host is located in ${host.countryCode}. Requested: [${requestedCountries.join(', ')}].`,
    actionableHintTr: countryMatch
      ? undefined
      : `Hedef ülke filtrenizi 'Tüm Ülkeler' yapabilir veya ${host.countryCode} ülkesini tercih listenize ekleyebilirsiniz.`,
    actionableHintEn: countryMatch
      ? undefined
      : `Set country filter to 'All' or add ${host.countryCode} to preferred destinations.`,
  };
  criteria.push(countryEval);
  if (!countryMatch) {
    primaryBlockersTr.push(countryEval.messageTr);
    primaryBlockersEn.push(countryEval.messageEn);
    if (countryEval.actionableHintTr) actionableRecommendationsTr.push(countryEval.actionableHintTr);
    if (countryEval.actionableHintEn) actionableRecommendationsEn.push(countryEval.actionableHintEn);
  }

  // 2. Activity Type (Weight: 20%)
  const hostActivities = host.activities || [];
  const activityMatch = hostActivities.includes(query.mobilityGoal);

  const activityEval: CriterionEvaluation = {
    key: 'activityType',
    labelTr: 'Faaliyet Türü',
    labelEn: 'Activity Type',
    weightPercent: 20,
    status: activityMatch ? 'MATCH' : 'MISMATCH',
    scoreContribution: activityMatch ? 100 : 0,
    weightedScore: activityMatch ? 20 : 0,
    schoolRequested: query.mobilityGoal,
    hostProvided: hostActivities.length > 0 ? hostActivities.join(', ') : 'Belirtilmedi',
    messageTr: activityMatch
      ? `Ev sahibi seçilen faaliyeti (${query.mobilityGoal}) aktif olarak sunmakta ve rehberlik vermektedir.`
      : `Faaliyet uyuşmazlığı: Ev sahibi ${query.mobilityGoal} faaliyetini sunmamaktadır.`,
    messageEn: activityMatch
      ? `Host actively provides mentoring for ${query.mobilityGoal}.`
      : `Activity mismatch: Host does not provide ${query.mobilityGoal}.`,
    actionableHintTr: activityMatch
      ? undefined
      : `Ev sahibinin sunduğu faaliyetleri (${hostActivities.slice(0, 3).join(', ')}) inceleyebilir veya faaliyet türünüzü uyarlayabilirsiniz.`,
    actionableHintEn: activityMatch
      ? undefined
      : `Consider activities offered by host (${hostActivities.slice(0, 3).join(', ')}) or adjust requirements.`,
  };
  criteria.push(activityEval);
  if (!activityMatch) {
    primaryBlockersTr.push(activityEval.messageTr);
    primaryBlockersEn.push(activityEval.messageEn);
    if (activityEval.actionableHintTr) actionableRecommendationsTr.push(activityEval.actionableHintTr);
    if (activityEval.actionableHintEn) actionableRecommendationsEn.push(activityEval.actionableHintEn);
  }

  // 3. Target Group & Age Compatibility (Weight: 15%)
  let targetStatus: CriterionMatchStatus = 'MATCH';
  let targetScoreContribution = 100;
  let targetMessageTr = '';
  let targetMessageEn = '';
  let targetHintTr: string | undefined;
  let targetHintEn: string | undefined;

  const isMinor = query.ageGroup === 'under_18' || query.ageGroup === 'mixed';
  if (query.participantType === 'student' && host.hasVetLearner === false) {
    targetStatus = 'MISMATCH';
    targetScoreContribution = 0;
    targetMessageTr = 'Ev sahibi meslek lisesi öğrencisi (stajyer) kabul etmemektedir.';
    targetMessageEn = 'Host does not accept VET students/interns.';
    targetHintTr = 'Öğrenci stajı kabul eden ev sahipleri listesine göz atın.';
    targetHintEn = 'Filter for hosts accepting student mobility.';
  } else if (
    (query.participantType === 'teacher' || query.participantType === 'staff') &&
    host.hasStaffMobility === false
  ) {
    targetStatus = 'MISMATCH';
    targetScoreContribution = 0;
    targetMessageTr = 'Ev sahibi öğretmen veya personel hareketliliği kabul etmemektedir.';
    targetMessageEn = 'Host does not accept teacher/staff mobility.';
    targetHintTr = 'İşbaşı gözlem (Job Shadowing) veya eğitici kabul eden kurumları seçin.';
    targetHintEn = 'Select hosts that accommodate staff job shadowing.';
  } else if (isMinor && host.acceptsUnder18 === false) {
    targetStatus = 'MISMATCH';
    targetScoreContribution = 0;
    targetMessageTr = 'Yasal kısıt: Ev sahibi 18 yaş altı (reşit olmayan) stajyer kabul etmemektedir (Yalnızca 18+ Yetişkin).';
    targetMessageEn = 'Host legal policy does not allow minors under 18 (18+ adults only).';
    targetHintTr = 'Katılımcı grubunuzu 18+ mezun veya son sınıf öğrencilerinden oluşturun ya da 18 yaş altı kabul eden partnerleri seçin.';
    targetHintEn = 'Form group with adult 18+ students or choose hosts accepting under-18.';
  } else if (query.ageGroup === 'mixed' && host.acceptsUnder18) {
    targetStatus = 'PARTIAL';
    targetScoreContribution = 80;
    targetMessageTr = 'Karma yaş grubu: Ev sahibi reşit olmayanları kabul ediyor; refakatçi ve veli izin prosedürleri gereklidir.';
    targetMessageEn = 'Mixed age group: Host accepts minors; parental and accompanying person policies apply.';
    targetHintTr = 'Her reşit olmayan öğrenci için refakatçi oranını ve veli muvafakatnamelerini tamamlayın.';
    targetHintEn = 'Verify accompanying person ratio and parental consent forms.';
  } else {
    targetMessageTr = `Hedef profil (${query.participantType === 'student' ? 'Meslek Lisesi Öğrencisi' : 'Öğretmen/Eğitici'}) ve yaş grubu (${query.ageGroup === 'under_18' ? '18 Yaş Altı' : '18+'}) ev sahibi ile tam uyumludur.`;
    targetMessageEn = `Participant profile (${query.participantType}) and age group (${query.ageGroup}) fully compatible with host.`;
  }

  const targetEval: CriterionEvaluation = {
    key: 'targetGroup',
    labelTr: 'Hedef Grup & Yaş Uygunluğu',
    labelEn: 'Target Group & Age Compatibility',
    weightPercent: 15,
    status: targetStatus,
    scoreContribution: targetScoreContribution,
    weightedScore: Math.round((targetScoreContribution * 15) / 100),
    schoolRequested: `${query.participantType === 'student' ? 'Öğrenci' : 'Öğretmen/Personel'} (${query.ageGroup === 'under_18' ? '18 Yaş Altı' : query.ageGroup === 'mixed' ? 'Karma Yaş' : '18+'})`,
    hostProvided: `${host.hasVetLearner ? 'Öğrenci ✓' : 'Öğrenci ✕'} • ${host.hasStaffMobility ? 'Personel ✓' : 'Personel ✕'} • ${host.acceptsUnder18 ? '18 Yaş Altı Uygun' : 'Yalnızca 18+'}`,
    messageTr: targetMessageTr,
    messageEn: targetMessageEn,
    actionableHintTr: targetHintTr,
    actionableHintEn: targetHintEn,
  };
  criteria.push(targetEval);
  if (targetStatus === 'MISMATCH') {
    primaryBlockersTr.push(targetMessageTr);
    primaryBlockersEn.push(targetMessageEn);
  }
  if (targetHintTr) actionableRecommendationsTr.push(targetHintTr);
  if (targetHintEn) actionableRecommendationsEn.push(targetHintEn);

  // 4. Dates & Term Availability (Weight: 10%)
  let datesStatus: CriterionMatchStatus = 'MATCH';
  let datesScore = 100;
  let datesMsgTr = '';
  let datesMsgEn = '';
  let datesHintTr: string | undefined;
  let datesHintEn: string | undefined;

  if (!host.isActive) {
    datesStatus = 'MISMATCH';
    datesScore = 0;
    datesMsgTr = 'Ev sahibi şu anda pasif durumda veya bu dönem için grup kabul etmemektedir.';
    datesMsgEn = 'Host is currently inactive or not accepting groups for this term.';
    datesHintTr = 'Aktif ve başvuruları açık ev sahiplerini listeleyin.';
    datesHintEn = 'Browse active hosts accepting mobility groups.';
  } else if ((host.totalAnnualCapacity || 36) < 15) {
    datesStatus = 'PARTIAL';
    datesScore = 70;
    datesMsgTr = `Sınırlı yıllık kontenjan: Ev sahibi yıllık toplam ${host.totalAnnualCapacity} katılımcı ağırlayabilmektedir. Dönem doluluk riski olabilir.`;
    datesMsgEn = `Limited annual capacity: Host accommodates up to ${host.totalAnnualCapacity} participants annually.`;
    datesHintTr = 'Tarihlerinizi erkenden rezerve etmek için ev sahibiyle derhal talep iletişimi başlatın.';
    datesHintEn = 'Initiate early inquiry to reserve target period.';
  } else {
    datesMsgTr = `Ev sahibi aktif ve yıllık ${host.totalAnnualCapacity || 36} kişilik kapasiteyle planlanan dönem için müsait durumdadır.`;
    datesMsgEn = `Host is active with annual capacity of ${host.totalAnnualCapacity || 36} for target mobility periods.`;
  }

  const datesEval: CriterionEvaluation = {
    key: 'dates',
    labelTr: 'Tarihler & Dönem Müsaitliği',
    labelEn: 'Dates & Term Availability',
    weightPercent: 10,
    status: datesStatus,
    scoreContribution: datesScore,
    weightedScore: Math.round((datesScore * 10) / 100),
    schoolRequested: 'Planlanan Dönem (2026/2027)',
    hostProvided: `Yıllık Kapasite: ${host.totalAnnualCapacity || 36} kişi (${host.isActive ? 'Aktif' : 'Pasif'})`,
    messageTr: datesMsgTr,
    messageEn: datesMsgEn,
    actionableHintTr: datesHintTr,
    actionableHintEn: datesHintEn,
  };
  criteria.push(datesEval);
  if (datesStatus === 'MISMATCH') {
    primaryBlockersTr.push(datesMsgTr);
    primaryBlockersEn.push(datesMsgEn);
  }
  if (datesHintTr) actionableRecommendationsTr.push(datesHintTr);
  if (datesHintEn) actionableRecommendationsEn.push(datesHintEn);

  // 5. Duration Limits (Weight: 10%)
  const reqDuration = query.durationDays || 14;
  const minDays = host.minDurationDays || 2;
  const maxDays = host.maxDurationDays || 365;

  let durStatus: CriterionMatchStatus = 'MATCH';
  let durScore = 100;
  let durMsgTr = '';
  let durMsgEn = '';
  let durHintTr: string | undefined;
  let durHintEn: string | undefined;

  if (reqDuration >= minDays && reqDuration <= maxDays) {
    durMsgTr = `Talep edilen ${reqDuration} günlük süre, ev sahibinin kabul aralığına [${minDays}–${maxDays} gün] tam uygundur.`;
    durMsgEn = `Requested duration of ${reqDuration} days fits within host range [${minDays}–${maxDays} days].`;
  } else if (Math.abs(reqDuration - minDays) <= 3 || Math.abs(reqDuration - maxDays) <= 5) {
    durStatus = 'PARTIAL';
    durScore = 60;
    durMsgTr = `Süre yakın sınırda: Talep edilen ${reqDuration} gün, ev sahibi aralığı [${minDays}–${maxDays} gün]. Küçük bir esneklik gerekebilir.`;
    durMsgEn = `Duration near threshold: Requested ${reqDuration} days vs host limits [${minDays}–${maxDays} days].`;
    durHintTr = `Hareketlilik sürenizi ${minDays} veya ${maxDays} gün seviyesine yuvarlayarak tam uyum sağlayabilirsiniz.`;
    durHintEn = `Adjust duration towards ${minDays} or ${maxDays} days for full compliance.`;
  } else {
    durStatus = 'MISMATCH';
    durScore = 0;
    durMsgTr = `Süre uyuşmazlığı: Talep edilen ${reqDuration} gün, ev sahibi kabul sınırları [${minDays}–${maxDays} gün] dışındadır.`;
    durMsgEn = `Duration mismatch: Requested ${reqDuration} days is outside host limits [${minDays}–${maxDays} days].`;
    durHintTr = `Hareketlilik sürenizi ev sahibinin kabul aralığı olan [${minDays}–${maxDays}] güne revize edin.`;
    durHintEn = `Revise mobility duration to match host range [${minDays}–${maxDays} days].`;
  }

  const durEval: CriterionEvaluation = {
    key: 'duration',
    labelTr: 'Hareketlilik Süresi',
    labelEn: 'Mobility Duration',
    weightPercent: 10,
    status: durStatus,
    scoreContribution: durScore,
    weightedScore: Math.round((durScore * 10) / 100),
    schoolRequested: `${reqDuration} Gün`,
    hostProvided: `${minDays}–${maxDays} Gün`,
    messageTr: durMsgTr,
    messageEn: durMsgEn,
    actionableHintTr: durHintTr,
    actionableHintEn: durHintEn,
  };
  criteria.push(durEval);
  if (durStatus === 'MISMATCH') {
    primaryBlockersTr.push(durMsgTr);
    primaryBlockersEn.push(durMsgEn);
  }
  if (durHintTr) actionableRecommendationsTr.push(durHintTr);
  if (durHintEn) actionableRecommendationsEn.push(durHintEn);

  // 6. Participant Capacity (Weight: 15%)
  const totalCount = (query.participantCount || 6) + (query.accompanyingPersonsCount || 0);
  const maxCap = host.maxLearnersPerTerm || 4;

  let capStatus: CriterionMatchStatus = 'MATCH';
  let capScore = 100;
  let capMsgTr = '';
  let capMsgEn = '';
  let capHintTr: string | undefined;
  let capHintEn: string | undefined;

  if (totalCount < maxCap) {
    capMsgTr = `Kontenjan uygun: Talep edilen ${totalCount} kişi (${query.participantCount} asil + ${query.accompanyingPersonsCount || 0} refakatçi), ev sahibinin ${maxCap} kişilik azami kapasitesine rahatça sığmaktadır.`;
    capMsgEn = `Capacity suitable: Requested ${totalCount} participants fits comfortably in ${maxCap} host slots.`;
  } else if (totalCount === maxCap) {
    capStatus = 'PARTIAL';
    capScore = 80;
    capMsgTr = `Kontenjan tam sınırda: Talep edilen ${totalCount} kişi, ev sahibinin dönemlik azami ${maxCap} kişilik kontenjanını doldurmaktadır.`;
    capMsgEn = `Capacity at boundary: Requested ${totalCount} participants uses 100% of host capacity (${maxCap}).`;
    capHintTr = 'Refakatçi sayısında artış planlanıyorsa ev sahibi ile önceden teyit edin.';
    capHintEn = 'Confirm with host if additional accompanying persons might join.';
  } else {
    capStatus = 'MISMATCH';
    capScore = 0;
    capMsgTr = `Kontenjan yetersizliği: Talep edilen ${totalCount} kişi (${query.participantCount} asil + ${query.accompanyingPersonsCount || 0} refakatçi), ev sahibinin azami ${maxCap} kişilik dönem kontenjanını aşmaktadır.`;
    capMsgEn = `Capacity deficit: Requested ${totalCount} participants exceeds host maximum term capacity of ${maxCap}.`;
    capHintTr = `Katılımcı sayınızı ${maxCap} kişiye düşürün veya grubu iki farklı döneme bölerek iki ayrı hareketlilik akışı planlayın.`;
    capHintEn = `Reduce group size to ${maxCap} or split participants into two sequential mobility flows.`;
  }

  const capEval: CriterionEvaluation = {
    key: 'capacity',
    labelTr: 'Katılımcı Sayısı & Kontenjan',
    labelEn: 'Participant Capacity',
    weightPercent: 15,
    status: capStatus,
    scoreContribution: capScore,
    weightedScore: Math.round((capScore * 15) / 100),
    schoolRequested: `${totalCount} Kişi (${query.participantCount || 6} Katılımcı + ${query.accompanyingPersonsCount || 0} Refakatçi)`,
    hostProvided: `Azami ${maxCap} Kişi / Dönem`,
    messageTr: capMsgTr,
    messageEn: capMsgEn,
    actionableHintTr: capHintTr,
    actionableHintEn: capHintEn,
  };
  criteria.push(capEval);
  if (capStatus === 'MISMATCH') {
    primaryBlockersTr.push(capMsgTr);
    primaryBlockersEn.push(capMsgEn);
  }
  if (capHintTr) actionableRecommendationsTr.push(capHintTr);
  if (capHintEn) actionableRecommendationsEn.push(capHintEn);

  // 7. Logistics & Special Needs (Weight: 15%)
  const reqAccom = Boolean(query.logisticsRequired?.accommodation);
  const reqMeals = Boolean(query.logisticsRequired?.meals);
  const reqTransfers = Boolean(query.logisticsRequired?.transfers);
  const reqWheelchair = Boolean(query.specialNeeds?.wheelchairAccessible);
  const reqSpecialDiet = Boolean(query.specialNeeds?.specialDiet);

  const hasAnyReq = reqAccom || reqMeals || reqTransfers || reqWheelchair || reqSpecialDiet;

  let logStatus: CriterionMatchStatus = 'MATCH';
  let logScore = 100;
  let logMsgTr = '';
  let logMsgEn = '';
  let logHintTr: string | undefined;
  let logHintEn: string | undefined;

  const failedItems: string[] = [];
  if (reqAccom && !host.providesAccommodation) failedItems.push('Konaklama');
  if (reqMeals && !host.providesMeals) failedItems.push('Yemek');
  if (reqTransfers && !host.providesTransfers) failedItems.push('Transfer');
  if (reqWheelchair && !host.accessibilityFeatures?.wheelchairAccessible) failedItems.push('Tekerlekli Sandalye');
  if (reqSpecialDiet && !host.accessibilityFeatures?.specialDiet) failedItems.push('Özel Diyet');

  const providedItems: string[] = [];
  if (host.providesAccommodation) providedItems.push('Konaklama');
  if (host.providesMeals) providedItems.push('Yemek');
  if (host.providesTransfers) providedItems.push('Transfer');
  if (host.accessibilityFeatures?.wheelchairAccessible) providedItems.push('Engelsiz Erişim');

  if (!hasAnyReq) {
    logScore = 100;
    logMsgTr = 'Okul özel bir lojistik zorunluluğu belirtmedi. Ev sahibi ihtiyaç duyulduğunda esnek destek sunabilmektedir.';
    logMsgEn = 'No mandatory logistics required by school. Host offers flexible assistance.';
  } else if (failedItems.length === 0) {
    logScore = 100;
    logMsgTr = `Talep edilen tüm lojistik hizmetler (${[reqAccom && 'Konaklama', reqMeals && 'Yemek', reqTransfers && 'Transfer', reqWheelchair && 'Erişilebilirlik'].filter(Boolean).join(', ')}) ev sahibi tarafından eksiksiz karşılanmaktadır.`;
    logMsgEn = 'All requested logistics and accessibility services are fully provided by host.';
  } else if (failedItems.length > 0 && (reqAccom && !host.providesAccommodation)) {
    logStatus = 'MISMATCH';
    logScore = 0;
    logMsgTr = `Zorunlu lojistik uyuşmazlığı: Okul tarafından talep edilen kritik şartlar (${failedItems.join(', ')}) ev sahibi tarafından sağlanamamaktadır.`;
    logMsgEn = `Logistics mismatch: Mandatory requirements (${failedItems.join(', ')}) cannot be provided by host.`;
    logHintTr = 'Konaklamayı Erasmus+ harcırah yöntemiyle okulun kendisinin organize etmesini seçebilir veya tam konaklama sunan ev sahiplerini inceleyebilirsiniz.';
    logHintEn = 'Consider self-managed accommodation via Erasmus daily allowances or select full-service hosts.';
  } else {
    logStatus = 'PARTIAL';
    logScore = 65;
    logMsgTr = `Kısmi lojistik: Ev sahibi temel hizmetleri karşılarken bazı kalemler (${failedItems.join(', ')}) eksiktir.`;
    logMsgEn = `Partial logistics: Host covers core services but misses (${failedItems.join(', ')}).`;
    logHintTr = `Eksik kalan ${failedItems.join(', ')} hizmetini harcırah bütçesi veya yerel tedarikçilerle planlayın.`;
    logHintEn = `Plan for (${failedItems.join(', ')}) using allowance or local service providers.`;
  }

  const logEval: CriterionEvaluation = {
    key: 'logistics',
    labelTr: 'Lojistik & Özel İhtiyaçlar',
    labelEn: 'Logistics & Special Needs',
    weightPercent: 15,
    status: logStatus,
    scoreContribution: logScore,
    weightedScore: Math.round((logScore * 15) / 100),
    schoolRequested: hasAnyReq
      ? [reqAccom && 'Konaklama', reqMeals && 'Yemek', reqTransfers && 'Transfer', reqWheelchair && 'Erişilebilirlik'].filter(Boolean).join(', ')
      : 'Esnek / Bağımsız Yönetim',
    hostProvided: providedItems.length > 0 ? providedItems.join(', ') : 'Hizmet Sağlanmıyor (Bağımsız)',
    messageTr: logMsgTr,
    messageEn: logMsgEn,
    actionableHintTr: logHintTr,
    actionableHintEn: logHintEn,
  };
  criteria.push(logEval);
  if (logStatus === 'MISMATCH') {
    primaryBlockersTr.push(logMsgTr);
    primaryBlockersEn.push(logMsgEn);
  }
  if (logHintTr) actionableRecommendationsTr.push(logHintTr);
  if (logHintEn) actionableRecommendationsEn.push(logHintEn);

  // Summary counts and overall suitability score
  const matchedCount = criteria.filter((c) => c.status === 'MATCH').length;
  const partialCount = criteria.filter((c) => c.status === 'PARTIAL').length;
  const mismatchCount = criteria.filter((c) => c.status === 'MISMATCH').length;

  const totalWeighted = criteria.reduce((sum, c) => sum + c.weightedScore, 0);
  const overallSuitabilityScore = Math.min(100, Math.max(0, totalWeighted));

  let grade: 'EXCELLENT' | 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
  if (overallSuitabilityScore >= 85 && mismatchCount === 0) grade = 'EXCELLENT';
  else if (overallSuitabilityScore >= 70 && mismatchCount === 0) grade = 'HIGH';
  else if (overallSuitabilityScore >= 50) grade = 'MODERATE';

  const formulaExplanationTr =
    'Uygunluk Skoru Formülü: %15 Ülke + %20 Faaliyet Türü + %15 Hedef Grup/Yaş + %10 Dönem Müsaitliği + %10 Süre + %15 Kontenjan + %15 Lojistik İhtiyaçlar = %100 Toplam Ağırlık. Kritik uyuşmazlık içeren kriterler elenme nedenidir.';
  const formulaExplanationEn =
    'Suitability Formula: 15% Country + 20% Activity + 15% Target Group/Age + 10% Term Availability + 10% Duration + 15% Capacity + 15% Logistics = 100% Total Weight. Critical mismatches result in disqualification.';

  return {
    overallSuitabilityScore,
    grade,
    formulaExplanationTr,
    formulaExplanationEn,
    criteria,
    matchedCount,
    partialCount,
    mismatchCount,
    primaryBlockersTr,
    primaryBlockersEn,
    actionableRecommendationsTr,
    actionableRecommendationsEn,
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

    const sevenCriteria = evaluateSevenCriteriaClient(host, query);

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
      sevenCriteria,
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

/**
 * Evaluates 7 criteria on demand for a single host or host pool (PKG-IMP-03)
 */
export function evaluateCriteriaClient(
  payload: EvaluateCriteriaRequestDto,
  hostsPool: ClientHostRecord[] = CLIENT_SEED_HOSTS,
): EvaluateCriteriaResponseDto {
  const targetHosts = payload.hostId
    ? hostsPool.filter((h) => h.id === payload.hostId)
    : hostsPool;

  const results: EvaluateCriteriaItemResult[] = targetHosts.map((host) => {
    const { isEligible } = evaluateHardFiltersClient(host, payload.criteria);
    const { score: educationScore } = calculateEducationQualityScoreClient(host, payload.criteria);
    const { score: logisticsScore } = calculateLogisticsScoreClient(host, payload.criteria);
    const diagnostics = evaluateSevenCriteriaClient(host, payload.criteria);

    const hasLogisticsRequest = Boolean(
      payload.criteria.logisticsRequired?.accommodation ||
      payload.criteria.logisticsRequired?.meals ||
      payload.criteria.logisticsRequired?.transfers,
    );

    const compositeScore = hasLogisticsRequest
      ? Math.round(educationScore * 0.7 + logisticsScore * 0.3)
      : educationScore;

    return {
      hostId: host.id,
      hostName: host.name,
      countryCode: host.countryCode,
      city: host.city,
      isEligible,
      suitabilityScore: diagnostics.overallSuitabilityScore,
      educationScore,
      logisticsScore,
      compositeScore,
      matchGrade: diagnostics.grade,
      diagnostics,
    };
  });

  return {
    totalEvaluated: results.length,
    queryCriteria: payload.criteria,
    results,
  };
}
