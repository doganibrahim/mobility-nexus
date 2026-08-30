import { create } from 'zustand';
import { ParticipantType, MobilityGoal, HostType } from '@mobility-nexus/types';
import { DecisionEngineResult, HostScoreResult } from './calculations';

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
    country: string;
    duration: string;
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

  // Actions
  loadDemoData: (locale: string) => void;
  resetData: () => void;
}

const initialEmptyState = {
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
    mobilityGoal: 'Short-term VET mobility' as MobilityGoal,
    participantName: '',
    language: 0,
    country: '',
    duration: '',
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
};

export const useAppStore = create<AppState>((set) => ({
  ...initialEmptyState,

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

  setHostMatching: (data) =>
    set((state) => ({ hostMatching: { ...state.hostMatching, ...data } })),

  setLearningOutcomes: (data) =>
    set((state) => ({ learningOutcomes: { ...state.learningOutcomes, ...data } })),

  loadDemoData: (locale: string) => {
    const isEn = locale === 'en';
    
    set({
      schoolProfile: {
        schoolName: isEn ? 'Ankara Vocational and Technical Anatolian High School' : 'Ankara Mesleki ve Teknik Anadolu Lisesi',
        city: 'Ankara',
        accredited: 'yes',
        oid: 'E10123456',
        erasmusPlan: isEn ? 'Enhance teachers and learners competence in Industry 4.0, smart automation, and robotics.' : 'Öğretmen ve öğrencilerin Endüstri 4.0 / dijital üretim ve robotik yetkinliklerini geliştirmek.',
        institutionNeed: isEn ? 'Our school has established a new PLC lab and requires European job-shadowing for technical staff.' : 'Okulumuzda yeni nesil PLC ve endüstriyel haberleşme laboratuvarı kurulmuş olup, öğretmenlerimizin Avrupa standartlarında pratik işbaşı gözlem ihtiyacı bulunmaktadır.',
      },
      participantProfile: {
        participantType: 'teacher',
        mobilityGoal: 'Job shadowing / observation',
        participantName: isEn ? 'Vocational Teachers Group' : 'Teknik Öğretmen Grubu',
        language: 70,
        country: isEn ? 'Germany / Netherlands' : 'Almanya / Hollanda',
        duration: isEn ? '10 days' : '10 gün',
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

  resetData: () => set(initialEmptyState),
}));
