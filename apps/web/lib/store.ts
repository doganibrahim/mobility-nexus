import { create } from 'zustand';
import {
  ParticipantType,
  MobilityGoal,
  HostType,
  Ka122EligibilityResult,
} from '@mobility-nexus/types';
import { DecisionEngineResult, HostScoreResult } from './calculations';

export interface MobilityInquiry {
  id: string;
  createdAt: string;
  isMock?: boolean;
  // Sending school details
  schoolName: string;
  schoolCity: string;
  schoolOid: string;
  schoolContactName?: string;
  schoolContactEmail?: string;
  projectType: 'KA121' | 'KA122';
  // Target Host details
  hostId: string;
  hostName: string;
  hostCountry: string;
  // Mobility details
  vetField: string;
  iscedCode?: string;
  participantCount: number;
  accompanyingPersonsCount: number;
  durationDays: number;
  targetStartDate: string;
  targetEndDate: string;
  logisticsRequired: {
    accommodation: boolean;
    meals: boolean;
    transfers: boolean;
  };
  notes?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REVISED' | 'DECLINED';
  hostReplyNote?: string;
}

export const createDemoInquiries = (locale: string): MobilityInquiry[] => {
  const isEn = locale === 'en';
  return [
    {
      id: 'inq-mock-kapadokya',
      createdAt: '2026-09-10T10:30:00Z',
      isMock: true,
      schoolName: isEn ? 'Kapadokya Technical High School [MOCK]' : 'Kapadokya Teknik Lisesi [MOCK]',
      schoolCity: 'Nevşehir / Kapadokya',
      schoolOid: 'E10999001',
      schoolContactName: 'Ahmet Yılmaz',
      schoolContactEmail: 'proje@kapadokyateknik.k12.tr',
      projectType: 'KA121',
      hostId: 'demo-host-berlin',
      hostName: isEn ? 'Berlin VET Training Solutions GmbH' : 'Berlin VET Eğitim Çözümleri GmbH',
      hostCountry: 'DE',
      vetField: isEn ? 'Information & Communication Technologies (ICT / Cybersecurity)' : 'Bilişim Teknolojileri & Siber Güvenlik',
      iscedCode: '0613',
      participantCount: 6,
      accompanyingPersonsCount: 1,
      durationDays: 14,
      targetStartDate: '2026-10-12',
      targetEndDate: '2026-10-25',
      logisticsRequired: {
        accommodation: true,
        meals: true,
        transfers: false,
      },
      notes: isEn
        ? 'Our accredited VET school seeks a 14-day internship placement for 6 cybersecurity students and 1 accompanying teacher. We require local workshop mentoring.'
        : 'KA121 akredite meslek lisemizden 6 siber güvenlik öğrencisi ve 1 refakatçi öğretmen için 14 günlük işletme stajı planlamaktayız. Pratik atölye eğitimi ve İngilizce/Almanca mentorluk desteği talep ediyoruz.',
      status: 'PENDING',
    },
    {
      id: 'inq-mock-seyrek',
      createdAt: '2026-09-08T14:15:00Z',
      isMock: true,
      schoolName: isEn ? 'Seyrek Technical High School [MOCK]' : 'Seyrek Teknik Lisesi [MOCK]',
      schoolCity: 'İzmir / Seyrek',
      schoolOid: 'E10999002',
      schoolContactName: 'Merve Demir',
      schoolContactEmail: 'erasmus@seyrekteknik.k12.tr',
      projectType: 'KA122',
      hostId: 'demo-host-berlin',
      hostName: isEn ? 'Berlin VET Training Solutions GmbH' : 'Berlin VET Eğitim Çözümleri GmbH',
      hostCountry: 'DE',
      vetField: isEn ? 'Industrial Automation & Mechatronics' : 'Endüstriyel Otomasyon & Mekatronik',
      iscedCode: '0714',
      participantCount: 4,
      accompanyingPersonsCount: 1,
      durationDays: 21,
      targetStartDate: '2026-11-02',
      targetEndDate: '2026-11-22',
      logisticsRequired: {
        accommodation: true,
        meals: true,
        transfers: true,
      },
      notes: isEn
        ? 'KA122 short-term mobility proposal for 4 industrial automation students. Initial Letter of Intent (LoI) approved by host.'
        : 'KA122 kısa dönemli hareketlilik kapsamında 4 mekatronik öğrencimizin PLC ve robotik hatlar üzerinde staj yapması hedeflenmektedir. Kurumunuzdan ön kabul mektubu alınmıştır.',
      status: 'ACCEPTED',
      hostReplyNote: isEn
        ? 'Letter of Intent (LoI) signed. We confirm capacity for 4 students during November 2026.'
        : 'Ön kabul onaylandı. Kasım 2026 dönemi için 4 öğrenci kontenjanı rezerve edildi.',
    },
  ];
};

export interface AppState {
  // 1. School Profile
  schoolProfile: {
    schoolName: string;
    city: string;
    accredited: 'yes' | 'no' | 'unknown';
    oid: string;
    erasmusPlan: string;
    institutionNeed: string;
  };
  setSchoolProfile: (data: Partial<AppState['schoolProfile']>) => void;

  // 2. Participant Profile
  participantProfile: {
    participantType: ParticipantType;
    mobilityGoal: MobilityGoal;
    participantName: string;
    language: number;
    targetCountries: string[];
    startDate: string;
    endDate: string;
    participantCount: number;
    accompanyingPersonsCount: number;
    ageGroup: 'under_18' | '18_plus' | 'mixed';
  };
  setParticipantProfile: (data: Partial<AppState['participantProfile']>) => void;

  // 3. ESCO - ISCED State
  escoIsced: {
    vetField: string;
    iscedCode: string;
    iscedName: string;
    escoTerm: string;
    iscoCode: string;
    escoUri: string;
    skills: string;
  };
  setEscoIsced: (data: Partial<AppState['escoIsced']>) => void;

  // 4. Competence Assessment & Gap State
  competence: {
    assessmentAnswers: Record<number, number>;
    competenceScore: number | null;
    assessmentResultMsg: string;
    assessmentResultType: 'good' | 'warn' | 'bad';
    targetScore: number;
    externalScore: string;
  };
  setCompetence: (data: Partial<AppState['competence']>) => void;

  // 5. Decision Engine State
  decisionEngine: {
    decisionResult: DecisionEngineResult | null;
  };
  setDecisionEngine: (data: Partial<AppState['decisionEngine']>) => void;

  // 5b. Eligibility Gatekeeper State
  eligibilityGatekeeper: {
    participantCount: number;
    projectDurationMonths: number;
    pastKa122GrantsCount: number;
    mobilityStrategy: 'ad_hoc' | 'regular_annual';
    eligibilityResult: Ka122EligibilityResult | null;
  };
  setEligibilityGatekeeper: (
    data: Partial<AppState['eligibilityGatekeeper']>,
  ) => void;

  // 6. Host Matching State
  hostMatching: {
    hostName: string;
    hostCountry: string;
    hostType: HostType;
    hostMetrics: Record<string, number>;
    hostScoreResult: HostScoreResult | null;
  };
  setHostMatching: (data: Partial<AppState['hostMatching']>) => void;

  // 7. Learning Outcomes State
  learningOutcomes: {
    primaryGap: string;
    technicalOutcome: string;
    transversalOutcome: string;
  };
  setLearningOutcomes: (data: Partial<AppState['learningOutcomes']>) => void;

  // 8. Organisation & Multi-Tenant Onboarding State
  currentOrg: any | null;
  currentHost: any | null;
  orgType: 'SCHOOL' | 'HOST' | null;
  userRole: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER' | null;
  isOnboarded: boolean;
  setCurrentOrg: (
    org: any,
    role?: 'ORG_ADMIN' | 'MEMBER' | 'VIEWER',
  ) => void;
  setCurrentHost: (host: any) => void;

  // 9. Mobility Inquiries State (Sending & Receiving)
  inquiries: MobilityInquiry[];
  sendInquiry: (inquiry: Omit<MobilityInquiry, 'id' | 'createdAt' | 'status'>) => MobilityInquiry;
  updateInquiryStatus: (
    inquiryId: string,
    status: MobilityInquiry['status'],
    replyNote?: string,
  ) => void;
  removeInquiry: (inquiryId: string) => void;

  // Actions
  initFromStorage: () => void;
  clearOrg: () => void;
  loadDemoData: (locale: string) => void;
  loadHostDemoData: (locale: string) => void;
  resetData: () => void;
}

const initialEmptyState = {
  inquiries: [] as MobilityInquiry[],
  schoolProfile: {
    schoolName: '',
    city: '',
    accredited: 'unknown' as const,
    oid: '',
    erasmusPlan: '',
    institutionNeed: '',
  },
  participantProfile: {
    participantType: 'student' as ParticipantType,
    mobilityGoal: 'VET_SHORT_TERM' as MobilityGoal,
    participantName: '',
    language: 0,
    targetCountries: [],
    startDate: '',
    endDate: '',
    participantCount: 1,
    accompanyingPersonsCount: 0,
    ageGroup: 'mixed' as const,
  },
  escoIsced: {
    vetField: '',
    iscedCode: '',
    iscedName: '',
    escoTerm: '',
    iscoCode: '',
    escoUri: '',
    skills: '',
  },
  competence: {
    assessmentAnswers: {},
    competenceScore: null,
    assessmentResultMsg: 'Henüz değerlendirme yapılmadı.',
    assessmentResultType: 'warn' as const,
    targetScore: 80,
    externalScore: '',
  },
  decisionEngine: {
    decisionResult: null,
  },
  eligibilityGatekeeper: {
    participantCount: 15,
    projectDurationMonths: 12,
    pastKa122GrantsCount: 0,
    mobilityStrategy: 'ad_hoc' as const,
    eligibilityResult: null,
  },
  hostMatching: {
    hostName: '',
    hostCountry: '',
    hostType: 'VET school' as HostType,
    hostMetrics: { h1: 0, h2: 0, h3: 0, h4: 0, h5: 0, h6: 0, h7: 0, h8: 0, h9: 0, h10: 0 },
    hostScoreResult: null,
  },
  learningOutcomes: {
    primaryGap: '',
    technicalOutcome: '',
    transversalOutcome: '',
  },
  currentOrg: null,
  currentHost: null,
  orgType: null,
  userRole: null,
  isOnboarded: false,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialEmptyState,

  setCurrentOrg: (org, role = 'ORG_ADMIN') => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'cappinno_current_org',
          JSON.stringify({ org, role }),
        );
        localStorage.removeItem('cappinno_current_host');
      } catch {}
    }
    return set((state) => ({
      currentOrg: org,
      currentHost: null,
      orgType: 'SCHOOL',
      userRole: role,
      isOnboarded: true,
      schoolProfile: {
        ...state.schoolProfile,
        schoolName: org.name || state.schoolProfile.schoolName,
        city: org.city || state.schoolProfile.city,
        accredited: (org.accreditationStatus === 'YES'
          ? 'yes'
          : org.accreditationStatus === 'NO'
            ? 'no'
            : state.schoolProfile.accredited) as any,
        oid: org.oid || state.schoolProfile.oid,
        erasmusPlan: org.erasmusPlan || state.schoolProfile.erasmusPlan,
        institutionNeed:
          org.institutionNeed || state.schoolProfile.institutionNeed,
      },
    }));
  },

  setCurrentHost: (host) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'cappinno_current_host',
          JSON.stringify({ host }),
        );
        localStorage.removeItem('cappinno_current_org');
      } catch {}
    }
    return set(() => ({
      currentHost: host,
      currentOrg: null,
      orgType: 'HOST',
      userRole: 'ORG_ADMIN',
      isOnboarded: true,
    }));
  },

  sendInquiry: (inquiryData) => {
    const newInquiry: MobilityInquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    set((state) => {
      const updated = [newInquiry, ...state.inquiries];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cappinno_inquiries', JSON.stringify(updated));
        } catch {}
      }
      return { inquiries: updated };
    });
    return newInquiry;
  },

  updateInquiryStatus: (inquiryId, status, replyNote) => {
    set((state) => {
      const updated = state.inquiries.map((inq) =>
        inq.id === inquiryId
          ? {
              ...inq,
              status,
              hostReplyNote: replyNote !== undefined ? replyNote : inq.hostReplyNote,
            }
          : inq,
      );
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cappinno_inquiries', JSON.stringify(updated));
        } catch {}
      }
      return { inquiries: updated };
    });
  },

  removeInquiry: (inquiryId) => {
    set((state) => {
      const updated = state.inquiries.filter((inq) => inq.id !== inquiryId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('cappinno_inquiries', JSON.stringify(updated));
        } catch {}
      }
      return { inquiries: updated };
    });
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        // Restore Inquiries
        const storedInquiries = localStorage.getItem('cappinno_inquiries');
        if (storedInquiries) {
          const parsedInquiries = JSON.parse(storedInquiries);
          if (Array.isArray(parsedInquiries)) {
            set(() => ({ inquiries: parsedInquiries }));
          }
        }

        const storedHost = localStorage.getItem('cappinno_current_host');
        if (storedHost) {
          const { host } = JSON.parse(storedHost);
          if (host && host.name) {
            set(() => ({
              currentHost: host,
              currentOrg: null,
              orgType: 'HOST',
              userRole: 'ORG_ADMIN',
              isOnboarded: true,
            }));
            return;
          }
        }

        const stored = localStorage.getItem('cappinno_current_org');
        if (stored) {
          const { org, role } = JSON.parse(stored);
          if (org && org.name) {
            set((state) => ({
              currentOrg: org,
              currentHost: null,
              orgType: 'SCHOOL',
              userRole: role || 'ORG_ADMIN',
              isOnboarded: true,
              schoolProfile: {
                ...state.schoolProfile,
                schoolName: org.name || state.schoolProfile.schoolName,
                city: org.city || state.schoolProfile.city,
                accredited: (org.accreditationStatus === 'YES'
                  ? 'yes'
                  : org.accreditationStatus === 'NO'
                    ? 'no'
                    : state.schoolProfile.accredited) as any,
                oid: org.oid || state.schoolProfile.oid,
                erasmusPlan: org.erasmusPlan || state.schoolProfile.erasmusPlan,
                institutionNeed:
                  org.institutionNeed || state.schoolProfile.institutionNeed,
              },
            }));
          }
        }
      } catch {}
    }
  },

  clearOrg: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cappinno_current_org');
        localStorage.removeItem('cappinno_current_host');
      } catch {}
    }
    set({
      currentOrg: null,
      currentHost: null,
      orgType: null,
      userRole: null,
      isOnboarded: false,
    });
  },

  setSchoolProfile: (data) =>
    set((state) => ({ schoolProfile: { ...state.schoolProfile, ...data } })),

  setParticipantProfile: (data) =>
    set((state) => ({ participantProfile: { ...state.participantProfile, ...data } })),

  setEscoIsced: (data) =>
    set((state) => ({ escoIsced: { ...state.escoIsced, ...data } })),

  setCompetence: (data) =>
    set((state) => ({ competence: { ...state.competence, ...data } })),

  setDecisionEngine: (data) =>
    set((state) => ({ decisionEngine: { ...state.decisionEngine, ...data } })),

  setEligibilityGatekeeper: (data) =>
    set((state) => ({
      eligibilityGatekeeper: { ...state.eligibilityGatekeeper, ...data },
    })),

  setHostMatching: (data) =>
    set((state) => ({ hostMatching: { ...state.hostMatching, ...data } })),

  setLearningOutcomes: (data) =>
    set((state) => ({ learningOutcomes: { ...state.learningOutcomes, ...data } })),

  loadDemoData: (locale: string) => {
    const isEn = locale === 'en';
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('cappinno_current_host');
      } catch {}
    }

    set({
      currentHost: null,
      orgType: 'SCHOOL',
      isOnboarded: true,
      schoolProfile: {
        schoolName: isEn ? 'Kapadokya Technical High School [MOCK]' : 'Kapadokya Teknik Lisesi [MOCK]',
        city: 'Nevşehir',
        accredited: 'yes',
        oid: 'E10999001',
        erasmusPlan: isEn ? 'Enhance teachers and learners competence in Industry 4.0, smart automation, and robotics.' : 'Öğretmen ve öğrencilerin Endüstri 4.0 / dijital üretim ve robotik yetkinliklerini geliştirmek.',
        institutionNeed: isEn ? 'Our school has established a new PLC lab and requires European job-shadowing for technical staff.' : 'Okulumuzda yeni nesil PLC ve endüstriyel haberleşme laboratuvarı kurulmuş olup, öğretmenlerimizin Avrupa standartlarında pratik işbaşı gözlem ihtiyacı bulunmaktadır.',
      },
      participantProfile: {
        participantType: 'teacher',
        mobilityGoal: 'JOB_SHADOWING',
        participantName: isEn ? 'Vocational Teachers Group' : 'Teknik Öğretmen Grubu',
        language: 70,
        targetCountries: ['DE', 'NL'],
        startDate: '2026-10-15',
        endDate: '2026-10-25',
        participantCount: 5,
        accompanyingPersonsCount: 0,
        ageGroup: '18_plus',
      },
      escoIsced: {
        vetField: 'automation',
        iscedCode: '0714',
        iscedName: 'Electronics and automation',
        escoTerm: 'automation technician / mechatronics technician / industrial electrician',
        iscoCode: '3115',
        escoUri: 'http://data.europa.eu/esco/occupation/3115',
        skills: 'PLC programlama; endüstriyel otomasyon; robotik; arıza tespiti; kontrol sistemleri; önleyici bakım',
      },
      competence: {
        assessmentAnswers: { 1: 4, 2: 4, 3: 3, 4: 5, 5: 4, 6: 4, 7: 4, 8: 4, 9: 3, 10: 4, 11: 4, 12: 4 },
        competenceScore: 78,
        assessmentResultMsg: 'Skor: 78/100 | Hedef: 80 | Yetkinlik Farkı: 2 Puan (Yüksek Hazırlık Seviyesi)',
        assessmentResultType: 'good',
        targetScore: 80,
        externalScore: '',
      },
      decisionEngine: {
        decisionResult: null, // Will be computed
      },
      hostMatching: {
        hostName: 'Leipzig Vocational Training Center (BSZ 7)',
        hostCountry: isEn ? 'Germany' : 'Almanya',
        hostType: 'VET school',
        hostMetrics: { h1: 85, h2: 80, h3: 85, h4: 70, h5: 75, h6: 70, h7: 85, h8: 80, h9: 90, h10: 80 },
        hostScoreResult: null, // Will be computed
      },
      learningOutcomes: {
        primaryGap: 'Endüstriyel PLC Programlama & Robotik',
        technicalOutcome: '',
        transversalOutcome: '',
      },
    });
  },

  loadHostDemoData: (locale: string) => {
    const isEn = locale === 'en';
    const demoHost = {
      id: 'demo-host-berlin',
      name: isEn ? 'Berlin VET Training Solutions GmbH' : 'Berlin VET Eğitim Çözümleri GmbH',
      tradingName: 'Berlin VET Academy',
      organisationType: 'Company',
      countryCode: 'DE',
      city: 'Berlin',
      registeredAddress: 'Friedrichstraße 120, 10117 Berlin',
      operationalAddress: 'Alexanderplatz 5, 10178 Berlin',
      yearEstablished: 2017,
      oid: 'E10345678',
      picNumber: '948215632',
      websiteUrl: 'https://berlin-vet-solutions.de',
      generalEmail: 'contact@berlin-vet-solutions.de',
      telephone: '+49 30 12345678',
      primarySector: 'ict',
      workingLanguages: ['EN', 'DE'],
      contactPerson: 'Klaus Weber',
      contactTitle: isEn ? 'Head of International Mobility' : 'Uluslararası Hareketlilik Direktörü',
      contactEmail: 'k.weber@berlin-vet-solutions.de',
      verificationStatus: 'VERIFIED',
      profileCompletenessScore: 85,
      maxLearnersPerTerm: 6,
      totalAnnualCapacity: 18,
      yearsOfExperience: 6,
      totalParticipantsHosted: 92,
      consentPublicDisplay: true,
      activities: ['VET_INTERNSHIP', 'JOB_SHADOWING'],
    };

    const demoInquiries = createDemoInquiries(locale);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('cappinno_current_host', JSON.stringify({ host: demoHost }));
        localStorage.setItem('cappinno_inquiries', JSON.stringify(demoInquiries));
        localStorage.removeItem('cappinno_current_org');
      } catch {}
    }

    set({
      currentHost: demoHost,
      currentOrg: null,
      orgType: 'HOST',
      userRole: 'ORG_ADMIN',
      isOnboarded: true,
      inquiries: demoInquiries,
    });
  },

  resetData: () => set(initialEmptyState),
}));
