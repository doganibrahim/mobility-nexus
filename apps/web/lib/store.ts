import { create } from 'zustand';
import {
  ParticipantType,
  MobilityGoal,
  HostType,
  Ka122EligibilityResult,
} from '@mobility-nexus/types';
import { DecisionEngineResult, HostScoreResult } from './calculations';
import {
  ApplicationDraftState,
  DEFAULT_DRAFT_STATE,
  FormType,
  calculateDraftCompletion,
  Ka120ExtractedData,
} from './application-draft-schema';
import { DRAFT_DEMO_PRESETS } from './application-draft-demo-presets';
import { apiClient } from './api-client';

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
  fetchInquiriesFromServer: () => Promise<void>;
  sendInquiry: (inquiry: Omit<MobilityInquiry, 'id' | 'createdAt' | 'status'>) => MobilityInquiry;
  updateInquiryStatus: (
    inquiryId: string,
    status: MobilityInquiry['status'],
    replyNote?: string,
  ) => void;
  removeInquiry: (inquiryId: string) => void;

  // 10. Application Draft State (KA121 / KA122)
  applicationDraft: ApplicationDraftState;
  setApplicationDraft: (
    updater:
      | Partial<ApplicationDraftState>
      | ((prev: ApplicationDraftState) => ApplicationDraftState),
  ) => void;
  syncPipelineToDraft: (targetFormType?: FormType) => void;
  resetDraft: (formType?: FormType) => void;
  loadDraftDemoPreset: (presetId: string) => void;
  applyKa120Data: (data: Partial<Ka120ExtractedData>) => void;

  // Actions
  initFromStorage: () => void;
  clearOrg: () => void;
  loadDemoData: (locale: string) => void;
  loadHostDemoData: (locale: string) => void;
  resetData: () => void;
}

const initialEmptyState = {
  applicationDraft: DEFAULT_DRAFT_STATE,
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

export const useAppStore = create<AppState>((set, get) => ({
  ...initialEmptyState,

  setCurrentOrg: (org, role = 'ORG_ADMIN') => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'em_current_org',
          JSON.stringify({ org, role }),
        );
        localStorage.removeItem('em_current_host');
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
      applicationDraft: {
        ...state.applicationDraft,
        context: {
          ...state.applicationDraft.context,
          applicantName: org.name || state.applicationDraft.context.applicantName,
          applicantOid: org.oid || state.applicationDraft.context.applicantOid,
          applicantCity: org.city || state.applicationDraft.context.applicantCity,
          accreditationCode:
            org.accreditationStatus === 'YES'
              ? (state.applicationDraft.context.accreditationCode || '2021-1-TR01-KA120-VET-000000')
              : state.applicationDraft.context.accreditationCode,
        },
      },
    }));
  },

  setCurrentHost: (host) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'em_current_host',
          JSON.stringify({ host }),
        );
        localStorage.removeItem('em_current_org');
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

  fetchInquiriesFromServer: async () => {
    try {
      const serverInquiries = await apiClient.getInquiries();
      if (Array.isArray(serverInquiries) && serverInquiries.length > 0) {
        set(() => {
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem('em_inquiries', JSON.stringify(serverInquiries));
            } catch {}
          }
          return { inquiries: serverInquiries };
        });
      }
    } catch (err) {
      console.warn('Sunucudan talepler getirilemedi:', err);
    }
  },

  sendInquiry: (inquiryData) => {
    const newInquiry: MobilityInquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
      status: 'PENDING',
    };
    set((state) => {
      const updated = [newInquiry, ...state.inquiries.filter((i) => i.id !== newInquiry.id)];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('em_inquiries', JSON.stringify(updated));
        } catch {}
      }
      return { inquiries: updated };
    });
    // Persist to server/database
    apiClient.createInquiry(newInquiry).catch((err) => {
      console.warn('Veritabanina talep kaydedilirken hata:', err);
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
          localStorage.setItem('em_inquiries', JSON.stringify(updated));
        } catch {}
      }
      return { inquiries: updated };
    });
    // Persist to server/database
    apiClient.updateInquiryStatus(inquiryId, status, replyNote).catch((err) => {
      console.warn('Veritabaninda talep guncellenirken hata:', err);
    });
  },

  removeInquiry: (inquiryId) => {
    set((state) => {
      const updated = state.inquiries.filter((inq) => inq.id !== inquiryId);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('em_inquiries', JSON.stringify(updated));
        } catch {}
      }
      return { inquiries: updated };
    });
    apiClient.deleteInquiry(inquiryId).catch((err) => {
      console.warn('Veritabanindan talep silinirken hata:', err);
    });
  },

  initFromStorage: () => {
    if (typeof window !== 'undefined') {
      try {
        // Restore Inquiries
        const storedInquiries = localStorage.getItem('em_inquiries') || localStorage.getItem('cappinno_inquiries');
        if (storedInquiries) {
          const parsedInquiries = JSON.parse(storedInquiries);
          if (Array.isArray(parsedInquiries) && parsedInquiries.length > 0) {
            set(() => ({ inquiries: parsedInquiries }));
          }
        }
        // Always sync latest inquiries from server/database
        get().fetchInquiriesFromServer();

        const storedHost = localStorage.getItem('em_current_host') || localStorage.getItem('cappinno_current_host');
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

        const stored = localStorage.getItem('em_current_org') || localStorage.getItem('cappinno_current_org');
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

        // Restore Application Draft
        const storedDraft = localStorage.getItem('em_application_draft') || localStorage.getItem('cappinno_application_draft');
        if (storedDraft) {
          try {
            const parsedDraft = JSON.parse(storedDraft);
            if (parsedDraft && parsedDraft.context) {
              set((state) => ({
                applicationDraft: {
                  ...parsedDraft,
                  context: {
                    ...parsedDraft.context,
                    applicantName: parsedDraft.context.applicantName || state.schoolProfile.schoolName,
                    applicantOid: parsedDraft.context.applicantOid || state.schoolProfile.oid,
                    applicantCity: parsedDraft.context.applicantCity || state.schoolProfile.city,
                  },
                },
              }));
            }
          } catch {}
        } else {
          get().syncPipelineToDraft();
        }
      } catch {}
    }
  },

  clearOrg: () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('em_current_org');
        localStorage.removeItem('em_current_host');
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

  setApplicationDraft: (updater) => {
    set((state) => {
      const nextDraft =
        typeof updater === 'function'
          ? updater(state.applicationDraft)
          : { ...state.applicationDraft, ...updater, lastUpdated: new Date().toISOString() };

      const { overallPercentage } = calculateDraftCompletion(nextDraft);
      nextDraft.isDraftCompleted = overallPercentage === 100;

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('em_application_draft', JSON.stringify(nextDraft));
        } catch {}
      }
      return { applicationDraft: nextDraft };
    });
  },

  syncPipelineToDraft: (targetFormType) => {
    set((state) => {
      const formType: FormType = targetFormType || state.applicationDraft.formType;
      const isKa121 = formType === 'KA121';

      const nextDraft: ApplicationDraftState = {
        ...state.applicationDraft,
        formType,
        lastUpdated: new Date().toISOString(),
        context: {
          ...state.applicationDraft.context,
          formType,
          applicantName: state.schoolProfile.schoolName || state.applicationDraft.context.applicantName,
          applicantOid: state.schoolProfile.oid || state.applicationDraft.context.applicantOid,
          applicantCity: state.schoolProfile.city || state.applicationDraft.context.applicantCity,
          accreditationCode: state.schoolProfile.accredited === 'yes' ? '2021-1-TR01-KA120-VET-000000' : state.applicationDraft.context.accreditationCode,
          projectDurationMonths: state.eligibilityGatekeeper.projectDurationMonths || state.applicationDraft.context.projectDurationMonths,
          pastKa122Count: state.eligibilityGatekeeper.pastKa122GrantsCount || state.applicationDraft.context.pastKa122Count,
          projectTitle: state.applicationDraft.context.projectTitle || (state.schoolProfile.schoolName ? `${state.schoolProfile.schoolName} Mesleki Hareketlilik Projesi` : ''),
        },
        needs: state.schoolProfile.institutionNeed
          ? [
              {
                id: 'need-1',
                title: state.schoolProfile.institutionNeed,
                evidence: 'Kurum oz degerlendirme raporu ve sektor istisareleri',
                targetGroup: state.participantProfile.participantName || 'Mesleki egitim ogrenicileri ve ogretmenleri',
              },
            ]
          : state.applicationDraft.needs,
        objectives: state.schoolProfile.erasmusPlan
          ? [
              {
                id: 'obj-1',
                needIdRef: 'need-1',
                title: state.schoolProfile.erasmusPlan,
                targetIndicator: 'Europass Hareketlilik Belgesi ve beceri kazanim puani',
                measurementTool: 'Gozlem kontrol listesi ve staj degerlendirme formu',
              },
            ]
          : state.applicationDraft.objectives,
        activityDetails: {
          ...state.applicationDraft.activityDetails,
          activityType:
            state.participantProfile.participantType === 'teacher'
              ? 'JOB_SHADOWING'
              : 'VET_SHORT_TERM',
          activityGoalSummary: state.schoolProfile.erasmusPlan || state.applicationDraft.activityDetails.activityGoalSummary,
          targetCountries: state.participantProfile.targetCountries.length > 0
            ? state.participantProfile.targetCountries
            : state.applicationDraft.activityDetails.targetCountries,
          hostKnown: !!state.hostMatching.hostName,
          hostName: state.hostMatching.hostName || state.applicationDraft.activityDetails.hostName,
          hostCountry: state.hostMatching.hostCountry || state.applicationDraft.activityDetails.hostCountry,
          totalParticipants: state.participantProfile.participantCount || state.applicationDraft.activityDetails.totalParticipants,
          accompanyingRequired: (state.participantProfile.accompanyingPersonsCount || 0) > 0,
          accompanyingCount: state.participantProfile.accompanyingPersonsCount || 0,
          accompanyingReason: state.participantProfile.ageGroup === 'under_18' ? 'UNDERAGE' : 'SAFETY_LOGISTICS',
        },
      };

      const { overallPercentage } = calculateDraftCompletion(nextDraft);
      nextDraft.isDraftCompleted = overallPercentage === 100;

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('em_application_draft', JSON.stringify(nextDraft));
        } catch {}
      }
      return { applicationDraft: nextDraft };
    });
  },

  resetDraft: (formType = 'KA122') => {
    const freshDraft: ApplicationDraftState = {
      ...DEFAULT_DRAFT_STATE,
      formType,
      context: {
        ...DEFAULT_DRAFT_STATE.context,
        formType,
      },
      lastUpdated: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('em_application_draft', JSON.stringify(freshDraft));
      } catch {}
    }
    set({ applicationDraft: freshDraft });
  },

  loadDraftDemoPreset: (presetId) => {
    const preset = DRAFT_DEMO_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;

    const currentSchoolOrg = {
      id: `org-${preset.schoolProfile.oid}`,
      name: preset.schoolProfile.schoolName,
      city: preset.schoolProfile.city,
      oid: preset.schoolProfile.oid,
      accreditationStatus: preset.schoolProfile.accredited === 'yes' ? 'YES' : 'NO',
      erasmusPlan: preset.schoolProfile.erasmusPlan,
      institutionNeed: preset.schoolProfile.institutionNeed,
    };

    const draftWithTimestamp = {
      ...preset.draftData,
      lastUpdated: new Date().toISOString(),
    };

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          'em_current_org',
          JSON.stringify({ org: currentSchoolOrg, role: 'ORG_ADMIN' }),
        );
        localStorage.setItem('em_application_draft', JSON.stringify(draftWithTimestamp));
      } catch {}
    }

    set({
      currentOrg: currentSchoolOrg,
      currentHost: null,
      orgType: 'SCHOOL',
      userRole: 'ORG_ADMIN',
      isOnboarded: true,
      schoolProfile: {
        ...preset.schoolProfile,
      },
      participantProfile: {
        ...preset.participantProfile,
      },
      escoIsced: {
        ...preset.escoIsced,
      },
      hostMatching: {
        hostName: preset.hostMatching.hostName,
        hostCountry: preset.hostMatching.hostCountry,
        hostType: preset.hostMatching.hostType,
        hostMetrics: { h1: 85, h2: 85, h3: 85, h4: 80, h5: 85, h6: 80, h7: 85, h8: 85, h9: 90, h10: 85 },
        hostScoreResult: null,
      },
      applicationDraft: draftWithTimestamp,
    });
  },

  applyKa120Data: (data: Partial<Ka120ExtractedData>) => {
    set((state) => {
      const current = state.applicationDraft;
      const importedFlags: Record<string, boolean> = { ...(current.ka120ImportedFields || {}) };

      const setFlagIfPresent = (key: string, val: any) => {
        if (val !== undefined && val !== null && val !== '') {
          importedFlags[key] = true;
        }
      };

      setFlagIfPresent('context.applicantName', data.applicantName);
      setFlagIfPresent('context.applicantOid', data.applicantOid);
      setFlagIfPresent('context.applicantCity', data.applicantCity);
      setFlagIfPresent('context.accreditationCode', data.accreditationCode);
      setFlagIfPresent('context.projectTitle', data.projectTitle);
      setFlagIfPresent('context.projectAcronym', data.projectAcronym);

      setFlagIfPresent('orgProfile.mainActivityType', data.mainActivityType);
      setFlagIfPresent('orgProfile.yearsOfVetExperience', data.yearsOfVetExperience);
      setFlagIfPresent('orgProfile.learnerProfileSummary', data.learnerProfileSummary);
      setFlagIfPresent('orgProfile.totalVetLearnersCount', data.totalVetLearnersCount);
      setFlagIfPresent('orgProfile.teachingStaffCount', data.teachingStaffCount);
      setFlagIfPresent('orgProfile.nonTeachingStaffCount', data.nonTeachingStaffCount);

      if (data.qualityTeam) {
        Object.entries(data.qualityTeam).forEach(([k, v]) => {
          if (v !== undefined && v !== null && (Array.isArray(v) ? v.length > 0 : v !== '')) {
            importedFlags[`qualityTeam.${k}`] = true;
          }
        });
      }

      if (data.needs && data.needs.length > 0) {
        importedFlags['needs'] = true;
      }
      if (data.objectives && data.objectives.length > 0) {
        importedFlags['objectives'] = true;
      }

      const nextDraft: ApplicationDraftState = {
        ...current,
        lastUpdated: new Date().toISOString(),
        ka120ImportedFields: importedFlags,
        context: {
          ...current.context,
          applicantName: data.applicantName?.trim() || current.context.applicantName,
          applicantOid: data.applicantOid?.trim() || current.context.applicantOid,
          applicantCity: data.applicantCity?.trim() || current.context.applicantCity,
          accreditationCode: data.accreditationCode?.trim() || current.context.accreditationCode,
          projectTitle: data.projectTitle?.trim() || current.context.projectTitle,
          projectAcronym: data.projectAcronym?.trim() || current.context.projectAcronym,
        },
        orgProfile: {
          ...current.orgProfile,
          mainActivityType: data.mainActivityType || current.orgProfile.mainActivityType,
          yearsOfVetExperience: data.yearsOfVetExperience ?? current.orgProfile.yearsOfVetExperience,
          learnerProfileSummary: data.learnerProfileSummary?.trim() || current.orgProfile.learnerProfileSummary,
          totalVetLearnersCount: data.totalVetLearnersCount ?? current.orgProfile.totalVetLearnersCount,
          teachingStaffCount: data.teachingStaffCount ?? current.orgProfile.teachingStaffCount,
          nonTeachingStaffCount: data.nonTeachingStaffCount ?? current.orgProfile.nonTeachingStaffCount,
        },
        qualityTeam: {
          ...current.qualityTeam,
          ...(data.qualityTeam ? {
            inclusionApproach: data.qualityTeam.inclusionApproach?.trim() || current.qualityTeam.inclusionApproach,
            greenPractices: data.qualityTeam.greenPractices?.trim() || current.qualityTeam.greenPractices,
            digitalToolsUsage: data.qualityTeam.digitalToolsUsage?.trim() || current.qualityTeam.digitalToolsUsage,
            democraticParticipation: data.qualityTeam.democraticParticipation?.trim() || current.qualityTeam.democraticParticipation,
            selectionCriteriaSummary: data.qualityTeam.selectionCriteriaSummary?.trim() || current.qualityTeam.selectionCriteriaSummary,
            preparationPlanSummary: data.qualityTeam.preparationPlanSummary?.trim() || current.qualityTeam.preparationPlanSummary,
            monitoringMentorshipPlan: data.qualityTeam.monitoringMentorshipPlan?.trim() || current.qualityTeam.monitoringMentorshipPlan,
            institutionalIntegrationPlan: data.qualityTeam.institutionalIntegrationPlan?.trim() || current.qualityTeam.institutionalIntegrationPlan,
            internalDissemination: data.qualityTeam.internalDissemination?.trim() || current.qualityTeam.internalDissemination,
            externalDissemination: data.qualityTeam.externalDissemination?.trim() || current.qualityTeam.externalDissemination,
            euVisibilityMeasures: data.qualityTeam.euVisibilityMeasures?.trim() || current.qualityTeam.euVisibilityMeasures,
            legalRepresentativeName: data.qualityTeam.legalRepresentativeName?.trim() || current.qualityTeam.legalRepresentativeName,
            legalRepresentativeRole: data.qualityTeam.legalRepresentativeRole?.trim() || current.qualityTeam.legalRepresentativeRole,
            legalRepresentativeEmail: data.qualityTeam.legalRepresentativeEmail?.trim() || current.qualityTeam.legalRepresentativeEmail,
            coordinatorName: data.qualityTeam.coordinatorName?.trim() || current.qualityTeam.coordinatorName,
            coordinatorRole: data.qualityTeam.coordinatorRole?.trim() || current.qualityTeam.coordinatorRole,
            coordinatorEmail: data.qualityTeam.coordinatorEmail?.trim() || current.qualityTeam.coordinatorEmail,
            priorityTopics: (data.qualityTeam.priorityTopics && data.qualityTeam.priorityTopics.length > 0)
              ? data.qualityTeam.priorityTopics
              : current.qualityTeam.priorityTopics,
          } : {}),
        },
        needs: (data.needs && data.needs.length > 0)
          ? data.needs.map((n, idx) => ({
              id: n.id || `need-${idx + 1}`,
              title: n.title || '',
              evidence: n.evidence || '',
              targetGroup: n.targetGroup || '',
            }))
          : current.needs,
        objectives: (data.objectives && data.objectives.length > 0)
          ? data.objectives.map((o, idx) => ({
              id: o.id || `obj-${idx + 1}`,
              needIdRef: current.needs[idx]?.id || current.needs[0]?.id || 'need-1',
              title: o.title || '',
              targetIndicator: o.targetIndicator || '',
              measurementTool: o.measurementTool || '',
            }))
          : current.objectives,
      };

      const { overallPercentage } = calculateDraftCompletion(nextDraft);
      nextDraft.isDraftCompleted = overallPercentage === 100;

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('em_application_draft', JSON.stringify(nextDraft));
        } catch {}
      }
      return { applicationDraft: nextDraft };
    });
  },

  loadDemoData: (locale: string) => {
    const isEn = locale === 'en';
    
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('em_current_host');
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

    // Also populate application draft for demo
    get().syncPipelineToDraft('KA122');
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
        localStorage.setItem('em_current_host', JSON.stringify({ host: demoHost }));
        localStorage.setItem('em_inquiries', JSON.stringify(demoInquiries));
        localStorage.removeItem('em_current_org');
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
