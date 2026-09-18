/**
 * Erasmus+ KA121 & KA122 Başvuru Taslağı Test & Demo Veri Setleri
 * Gerçekçi okul profilleri ve Erasmus+ öncelikleri doğrultusunda 3 farklı senaryo içerir.
 */

import { ApplicationDraftState } from './application-draft-schema';
import { ParticipantType, MobilityGoal, HostType } from '@mobility-nexus/types';

export interface DraftDemoPreset {
  id: string;
  name: string;
  shortDesc: string;
  badge: string;
  formType: 'KA121' | 'KA122';
  color: string;
  schoolProfile: {
    schoolName: string;
    city: string;
    accredited: 'yes' | 'no' | 'unknown';
    oid: string;
    erasmusPlan: string;
    institutionNeed: string;
  };
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
  escoIsced: {
    vetField: string;
    iscedCode: string;
    iscedName: string;
    escoTerm: string;
    iscoCode: string;
    escoUri: string;
    skills: string;
  };
  hostMatching: {
    hostName: string;
    hostCountry: string;
    hostType: HostType;
  };
  draftData: ApplicationDraftState;
}

export const DRAFT_DEMO_PRESETS: DraftDemoPreset[] = [
  // =========================================================================
  // DEMO 1: Kapadokya MTAL (KA121 Akredite - Bilişim & Siber Güvenlik)
  // =========================================================================
  {
    id: 'kapadokya-ka121',
    name: 'Kapadokya MTAL',
    shortDesc: 'Bilişim & Siber Güvenlik (KA121 Akredite)',
    badge: 'KA121 Akredite',
    formType: 'KA121',
    color: 'blue',
    schoolProfile: {
      schoolName: 'Kapadokya Mesleki ve Teknik Anadolu Lisesi',
      city: 'Nevşehir',
      accredited: 'yes',
      oid: 'E10999001',
      erasmusPlan: 'Bilişim ve ağ teknolojileri alanında öğrencilerin Avrupa standartlarında siber güvenlik ve bulut mimarisi yetkinliklerini artırmak.',
      institutionNeed: 'Okulumuz siber güvenlik dalı öğrencilerinin sanal tehdit simülasyonları ve kurumsal veri güvenliği alanında Avrupa işletmelerinde pratik staj ihtiyacı.',
    },
    participantProfile: {
      participantType: 'student',
      mobilityGoal: 'VET_SHORT_TERM',
      participantName: 'Siber Güvenlik Öğrenci Grubu',
      language: 75,
      targetCountries: ['DE'],
      startDate: '2026-10-12',
      endDate: '2026-10-25',
      participantCount: 6,
      accompanyingPersonsCount: 1,
      ageGroup: 'under_18',
    },
    escoIsced: {
      vetField: 'Information & Communication Technologies (ICT)',
      iscedCode: '0613',
      iscedName: 'Software and applications development and analysis',
      escoTerm: 'cyber security specialist / network security technician',
      iscoCode: '2529',
      escoUri: 'http://data.europa.eu/esco/occupation/2529',
      skills: 'Sızma testi; güvenlik duvarı konfigürasyonu; ağ izleme; şifreleme; tehdit analizi',
    },
    hostMatching: {
      hostName: 'Leipzig Vocational Training Center (BSZ 7)',
      hostCountry: 'DE',
      hostType: 'VET school',
    },
    draftData: {
      formType: 'KA121',
      lastUpdated: new Date().toISOString(),
      isDraftCompleted: true,
      context: {
        formType: 'KA121',
        applicantName: 'Kapadokya Mesleki ve Teknik Anadolu Lisesi',
        applicantOid: 'E10999001',
        applicantCity: 'Nevşehir',
        projectTitle: 'Kapadokya MTAL Siber Güvenlik Hibe Talebi',
        projectAcronym: 'CYBER-KAP-26',
        projectTitleEn: 'Cyber Security VET Mobility Request',
        projectStartDate: '2026-10-01',
        projectDurationMonths: 12,
        applicationLanguage: 'tr',
        accreditationCode: '2021-1-TR01-KA120-VET-000012',
        pastKa122Count: 0,
      },
      orgProfile: {
        mainActivityType: 'VET_SCHOOL',
        vetProgramTypes: ['Anadolu Meslek Programı (AMP)', 'Anadolu Teknik Programı (ATP)'],
        learnerProfileSummary: '16-18 yaş bilişim ve ağ teknolojileri öğrencileri',
        hasFewerOpportunitiesLearners: true,
        fewerOpportunitiesPercentage: 20,
        yearsOfVetExperience: 18,
        totalVetLearnersCount: 680,
        teachingStaffCount: 52,
        nonTeachingStaffCount: 11,
        hasSupportingOrg: false,
        supportingOrgTasks: [],
      },
      needs: [
        {
          id: 'need-k1',
          title: 'Siber güvenlik laboratuvarında kurumsal ağ savunması pratik eksikliği',
          evidence: 'Bilişim sektörü istişare toplantısı tutanakları ve mezun izleme anketi',
          targetGroup: '11. sınıf siber güvenlik dalı öğrencileri ve meslek öğretmenleri',
        },
      ],
      objectives: [
        {
          id: 'obj-k1',
          needIdRef: 'need-k1',
          title: '6 öğrencinin Avrupa standartlarında siber tehdit ve güvenlik analizi becerisi kazanması',
          targetIndicator: 'Europass Hareketlilik Belgesi ve pratik sınav puanı (en az 80/100)',
          measurementTool: 'Ev sahibi işletme mentoru değerlendirme formu ve beceri listesi',
        },
      ],
      activityDetails: {
        activityType: 'VET_SHORT_TERM',
        activityGoalSummary: 'Almanya Leipzig şehrinde 14 günlük kurumsal ağ ve siber güvenlik işletme stajı',
        targetCountries: ['DE'],
        hostKnown: true,
        hostName: 'Leipzig Vocational Training Center (BSZ 7)',
        hostCountry: 'DE',
        totalParticipants: 6,
        standardDurationDays: 14,
        allSameDuration: true,
        durationGroups: [],
        includeTravelDays: true,
        travelDaysPerPerson: 2,
        greenTravelParticipantsCount: 2,
        mainTravelMode: 'FLIGHT',
        accompanyingRequired: true,
        accompanyingCount: 1,
        accompanyingDays: 14,
        accompanyingReason: 'UNDERAGE',
        accompanyingFullDuration: true,
        hasBlendedMobility: true,
        blendedParticipantsCount: 6,
        blendedVirtualActivities: 'Hareketlilik öncesi 2 haftalık çevrim içi OLS dil ve sanal laboratuvar hazırlığı',
        hasInclusionSupport: true,
        inclusionCount: 2,
        inclusionCategories: ['Ekonomik Engeller (Düşük gelir, burs ihtiyacı)'],
        inclusionSupportType: 'UNIT_COST',
        inclusionReasonNotes: 'Aile gelir düzeyi asgari ücret altında olan 2 öğrencimiz için ek bireysel destek',
        hasExceptionalCosts: false,
        hasPreparatoryVisit: false,
        hasCourseFees: false,
        linguisticSupportMode: 'OLS',
      },
      qualityTeam: {
        inclusionApproach: 'Tüm bilişim öğrencilerine açık şeffaf puanlama ve burslu öğrencilere pozitif ayrımcılık.',
        greenPractices: 'Seyahat planlamasında karbon salınımı bilinci, dijital dökümantasyon ve tren kullanımı teşviki.',
        digitalToolsUsage: 'Europass portali, eTwinning ve Erasmus+ sanal öğrenme platformları aktif kullanılacaktır.',
        democraticParticipation: 'Öğrenciler proje hazırlık komisyonunda yer alacak, AB gençlik politikaları tartışılacaktır.',
        legalRepresentativeName: 'Ahmet Yılmaz',
        legalRepresentativeRole: 'Okul Müdürü',
        legalRepresentativeEmail: 'mudur@kapadokyateknik.k12.tr',
        coordinatorName: 'Mehmet Akif Şen',
        coordinatorRole: 'Bilişim Alan Şefi / Proje Koordinatörü',
        coordinatorEmail: 'proje@kapadokyateknik.k12.tr',
        selectionCriteriaSummary: 'Mesleki yeterlilik (%35), İngilizce seviyesi (%25), Akademik başarı (%20), Mülakat (%20)',
        preparationPlanSummary: '24 saat mesleki teknik İngilizce, 8 saat Almanya kültürel uyum ve iş güvenliği semineri',
        recognitionMethod: 'EUROPASS_MOBILITY',
        monitoringMentorshipPlan: 'Ev sahibi kurum mentoruyla günlük kontrol, refakatçi öğretmenle haftalık ara rapor',
        emergencyCrisisProtocol: '24 saat acil çağrı hattı, tam kapsamlı yurtdışı sağlık ve seyahat sigortası, konsolosluk kaydı',
        institutionalIntegrationPlan: 'Hareketlilikte öğrenilen güvenlik senaryolarının okul bilişim atölyesi ders müfredatına aktarımı',
        internalDissemination: 'Okul konferans salonunda Erasmus Günleri sunumu ve okul web sitesinde deneyim bülteni',
        externalDissemination: 'Nevşehir İl MEM ve yerel sanayi odası temsilcilerine yönelik proje çıktıları çalıştayı',
        euVisibilityMeasures: 'Okul giriş panosu, proje tişörtleri, sertifikalar ve sosyal medyada AB bayrağı ve Erasmus logosu',
        priorityTopics: ['Mesleki Eğitimde Dijital Beceriler ve Endüstri 4.0', 'Kapsayıcılık, Çeşitlilik ve Fırsat Eşitliği'],
      },
      declarations: {
        confirmAccreditationOrPlan: true,
        confirmAbsorptionCapacity: true,
        confirmErasmusQualityStandards: true,
        confirmNoConflictOfInterest: true,
        confirmNoDoubleFunding: true,
        confirmDeclarationOnHonour: true,
      },
    },
  },

  // =========================================================================
  // DEMO 2: Seyrek MTAL (KA122 - Endüstriyel Otomasyon & PLC Robotik)
  // =========================================================================
  {
    id: 'seyrek-ka122',
    name: 'Seyrek MTAL',
    shortDesc: 'Endüstriyel Otomasyon & Robotik (KA122)',
    badge: 'KA122 Standart',
    formType: 'KA122',
    color: 'emerald',
    schoolProfile: {
      schoolName: 'Seyrek Mesleki ve Teknik Anadolu Lisesi',
      city: 'İzmir',
      accredited: 'no',
      oid: 'E10999002',
      erasmusPlan: 'Endüstriyel otomasyon ve mekatronik öğrencilerinin Endüstri 4.0 PLC ve robot kolu programlama pratik becerilerini geliştirmek.',
      institutionNeed: 'Okulumuzda kurulan yeni otomasyon atölyesinde Avrupa standartlarında pratik işletme stajı ve sensör teknolojileri deneyimi eksikliği bulunmaktadır.',
    },
    participantProfile: {
      participantType: 'student',
      mobilityGoal: 'VET_SHORT_TERM',
      participantName: 'Otomasyon ve Mekatronik Öğrenci Grubu',
      language: 70,
      targetCountries: ['DE'],
      startDate: '2026-11-02',
      endDate: '2026-11-22',
      participantCount: 4,
      accompanyingPersonsCount: 1,
      ageGroup: 'under_18',
    },
    escoIsced: {
      vetField: 'Industrial Automation & Mechatronics',
      iscedCode: '0714',
      iscedName: 'Electronics and automation',
      escoTerm: 'automation technician / industrial robot programmer',
      iscoCode: '3115',
      escoUri: 'http://data.europa.eu/esco/occupation/3115',
      skills: 'PLC programlama; Siemens TIA Portal; endüstriyel robot kalibrasyonu; pnömatik kontrol; sensör entegrasyonu',
    },
    hostMatching: {
      hostName: 'Berlin VET Training Solutions GmbH',
      hostCountry: 'DE',
      hostType: 'Company / SME',
    },
    draftData: {
      formType: 'KA122',
      lastUpdated: new Date().toISOString(),
      isDraftCompleted: true,
      context: {
        formType: 'KA122',
        applicantName: 'Seyrek Mesleki ve Teknik Anadolu Lisesi',
        applicantOid: 'E10999002',
        applicantCity: 'İzmir',
        projectTitle: 'Mesleki Eğitimde Endüstri 4.0 ve Akıllı Otomasyon Uygulamaları',
        projectAcronym: 'AUTO-VET-26',
        projectTitleEn: 'Industry 4.0 and Smart Automation in VET',
        projectStartDate: '2026-10-01',
        projectDurationMonths: 12,
        applicationLanguage: 'tr',
        pastKa122Count: 0,
        accreditationCode: '',
      },
      orgProfile: {
        mainActivityType: 'VET_SCHOOL',
        vetProgramTypes: ['Anadolu Meslek Programı (AMP)', 'Anadolu Teknik Programı (ATP)'],
        learnerProfileSummary: '15-18 yaş endüstriyel otomasyon ve mekatronik dalı öğrencileri',
        hasFewerOpportunitiesLearners: true,
        fewerOpportunitiesPercentage: 15,
        yearsOfVetExperience: 14,
        totalVetLearnersCount: 520,
        teachingStaffCount: 42,
        nonTeachingStaffCount: 9,
        hasSupportingOrg: false,
        supportingOrgTasks: [],
      },
      needs: [
        {
          id: 'need-s1',
          title: 'Yeni nesil PLC programlama ve endüstriyel robot hücresi pratik staj eksikliği',
          evidence: 'İzmir Menemen Plastik İhtisas OSB sanayici anket sonuçları ve zümre raporu',
          targetGroup: '11. sınıf mekatronik öğrencileri ve 3 atölye teknik öğretmeni',
        },
      ],
      objectives: [
        {
          id: 'obj-s1',
          needIdRef: 'need-s1',
          title: '4 öğrencinin Siemens TIA Portal ve robotik montaj hattında 21 günlük sertifikalı staj yapması',
          targetIndicator: 'Europass Hareketlilik Belgesi ve pratik otomasyon sınavı başarı puanı',
          measurementTool: 'İşletme mentoru değerlendirme çizelgesi ve öğrenci staj günlüğü',
        },
      ],
      activityDetails: {
        activityType: 'VET_SHORT_TERM',
        activityGoalSummary: 'Almanya Berlin şehrinde 21 günlük ileri seviye PLC ve robot kolu programlama işletme stajı',
        targetCountries: ['DE'],
        hostKnown: true,
        hostName: 'Berlin VET Training Solutions GmbH',
        hostCountry: 'DE',
        totalParticipants: 4,
        standardDurationDays: 21,
        allSameDuration: true,
        durationGroups: [],
        includeTravelDays: true,
        travelDaysPerPerson: 2,
        greenTravelParticipantsCount: 0,
        mainTravelMode: 'FLIGHT',
        accompanyingRequired: true,
        accompanyingCount: 1,
        accompanyingDays: 21,
        accompanyingReason: 'UNDERAGE',
        accompanyingFullDuration: true,
        hasBlendedMobility: false,
        hasInclusionSupport: true,
        inclusionCount: 1,
        inclusionCategories: ['Ekonomik Engeller (Düşük gelir, burs ihtiyacı)'],
        inclusionSupportType: 'UNIT_COST',
        inclusionReasonNotes: 'Dezavantajlı aile ortamından gelen 1 başarılı öğrenci için içerme desteği',
        hasExceptionalCosts: false,
        hasPreparatoryVisit: false,
        hasCourseFees: false,
        linguisticSupportMode: 'OLS',
      },
      qualityTeam: {
        inclusionApproach: 'Sosyoekonomik güçlük yaşayan yetenekli öğrencilere fırsat tanıyan objektif puanlama sistemi.',
        greenPractices: 'Kağıtsız çalışma, işletmede enerji verimliliği prensiplerine uyum ve atık ayrıştırma.',
        digitalToolsUsage: 'Çevrim içi proje yönetim platformları, Europass ve dijital öğrenme sözleşmeleri (Learning Agreement).',
        democraticParticipation: 'Katılımcıların çalışma hayatındaki hakları ve Avrupa iş hukuku ilkeleri konusunda bilinçlendirilmesi.',
        legalRepresentativeName: 'Ali Kaya',
        legalRepresentativeRole: 'Okul Müdürü',
        legalRepresentativeEmail: 'ali.kaya@seyrekteknik.k12.tr',
        coordinatorName: 'Merve Demir',
        coordinatorRole: 'Elektrik-Elektronik Öğretmeni / Proje Koordinatörü',
        coordinatorEmail: 'merve.demir@seyrekteknik.k12.tr',
        selectionCriteriaSummary: 'Meslek dersleri not ortalaması (%35), Pratik atölye performansı (%25), Dil testi (%20), Mülakat (%20)',
        preparationPlanSummary: '30 saat teknik Almanca/İngilizce, 12 saat iş sağlığı ve güvenliği eğitimi',
        recognitionMethod: 'EUROPASS_MOBILITY',
        monitoringMentorshipPlan: 'Haftalık çevrim içi veli ve okul bilgilendirme oturumu, refakatçi öğretmen eşliğinde günlük fabrika viziti',
        emergencyCrisisProtocol: 'Yurtdışı seyahat sağlık poliçesi, 24 saat erişilebilir koordinatör telefon hattı ve acil durum rehberi',
        institutionalIntegrationPlan: 'Staj çıktılarının okul PLC atölyesinde modüler ders materyali olarak diğer sınıflarla paylaşılması',
        internalDissemination: 'Okul atölye binasında proje sergisi ve tüm teknik öğretmenlere yönelik deneyim paylaşım semineri',
        externalDissemination: 'Menemen İlçe MEM ve İzmir Atatürk OSB sanayi bülteninde haber ve proje sonuç bildirisi',
        euVisibilityMeasures: 'Okul girişinde Avrupa Birliği panosu, proje sosyal medya hesabı ve sertifika töreni',
        priorityTopics: ['Mesleki Eğitimde Dijital Beceriler ve Endüstri 4.0', 'İş Temelli Öğrenme ve Okul-Sektör İşbirliği'],
      },
      declarations: {
        confirmAccreditationOrPlan: true,
        confirmAbsorptionCapacity: true,
        confirmErasmusQualityStandards: true,
        confirmNoConflictOfInterest: true,
        confirmNoDoubleFunding: true,
        confirmDeclarationOnHonour: true,
      },
    },
  },

  // =========================================================================
  // DEMO 3: İnegöl MEMP (KA122 - Yeşil Beceriler & Ahşap CNC Teknolojisi)
  // =========================================================================
  {
    id: 'inegol-ka122',
    name: 'İnegöl MEMP',
    shortDesc: 'Yeşil Dönüşüm & Ahşap CNC (KA122 Destekli)',
    badge: 'KA122 Yeşil Seyahat',
    formType: 'KA122',
    color: 'amber',
    schoolProfile: {
      schoolName: 'İnegöl Mesleki Eğitim Merkezi (MEMP)',
      city: 'Bursa',
      accredited: 'no',
      oid: 'E10999003',
      erasmusPlan: 'Çıraklık ve kalfalık öğrencilerinin mobilya ve ahşap teknolojilerinde ekolojik üretim, sıfır atık ve CNC tasarım yetkinliklerini artırmak.',
      institutionNeed: 'Geleneksel mobilya üretiminden yeşil ve dijital üretim modellerine geçiş sürecinde kalfa adaylarımızın Avrupa ahşap sanayisindeki modern CNC ve atık geri dönüşüm tekniklerini yerinde görme ihtiyacı.',
    },
    participantProfile: {
      participantType: 'student',
      mobilityGoal: 'VET_SHORT_TERM',
      participantName: 'Ahşap Teknolojisi Çırak/Kalfa Grubu',
      language: 65,
      targetCountries: ['AT'],
      startDate: '2026-11-15',
      endDate: '2026-12-12',
      participantCount: 8,
      accompanyingPersonsCount: 2,
      ageGroup: 'under_18',
    },
    escoIsced: {
      vetField: 'Wood Technology & Sustainable Manufacturing',
      iscedCode: '0722',
      iscedName: 'Materials (wood, paper, plastic, glass)',
      escoTerm: 'CNC wood processing machine operator / sustainable furniture maker',
      iscoCode: '7523',
      escoUri: 'http://data.europa.eu/esco/occupation/7523',
      skills: '5 eksen CNC ahşap işleme; CAD/CAM modelleme; sürdürülebilir ahşap malzeme; sıfır atık kesim optimizasyonu',
    },
    hostMatching: {
      hostName: 'Vienna Green Woodcraft Academy & Workshops',
      hostCountry: 'AT',
      hostType: 'Training centre',
    },
    draftData: {
      formType: 'KA122',
      lastUpdated: new Date().toISOString(),
      isDraftCompleted: true,
      context: {
        formType: 'KA122',
        applicantName: 'İnegöl Mesleki Eğitim Merkezi (MEMP)',
        applicantOid: 'E10999003',
        applicantCity: 'Bursa',
        projectTitle: 'Mobilya ve Ahşap Sanayisinde Yeşil Dönüşüm ve Ekolojik CNC Tasarımı',
        projectAcronym: 'GREEN-WOOD-26',
        projectTitleEn: 'Green Transformation and Eco-CNC in Woodcraft',
        projectStartDate: '2026-11-01',
        projectDurationMonths: 18,
        applicationLanguage: 'tr',
        pastKa122Count: 1,
        accreditationCode: '',
      },
      orgProfile: {
        mainActivityType: 'VET_PROVIDER',
        vetProgramTypes: ['Mesleki Eğitim Merkezi Programı (MEMP - Çıraklık/Kalfalık)'],
        learnerProfileSummary: '16-20 yaş mobilya ve iç mekan tasarımı çırak ve kalfa öğrenicileri',
        hasFewerOpportunitiesLearners: true,
        fewerOpportunitiesPercentage: 35,
        yearsOfVetExperience: 22,
        totalVetLearnersCount: 850,
        teachingStaffCount: 38,
        nonTeachingStaffCount: 12,
        hasSupportingOrg: true,
        supportingOrgName: 'Avusturya-Türkiye Mesleki Eğitim Derneği',
        supportingOrgOid: 'E10988005',
        supportingOrgTasks: [
          'Seyahat, Transfer ve Lojistik Düzenlemeleri',
          'Konaklama ve Güvenli Yaşam Şartlarının Sağlanması',
          'Kültürel Oryantasyon ve Rehberlik Hizmetleri',
        ],
      },
      needs: [
        {
          id: 'need-i1',
          title: 'Ahşap işlemede talaş ve atık geri kazanımı ile 5 eksenli CNC kullanım eksikliği',
          evidence: 'İnegöl Ticaret ve Sanayi Odası Mobilya Komitesi sektörel analiz raporu',
          targetGroup: 'Mobilya ve iç mekan tasarımı alanında çıraklık eğitimi gören 8 genç kalfa',
        },
      ],
      objectives: [
        {
          id: 'obj-i1',
          needIdRef: 'need-i1',
          title: '8 çırak öğrencinin Viyana ahşap atölyelerinde 28 günlük yeşil üretim ve CNC stajı tamamlaması',
          targetIndicator: 'Europass Hareketlilik Sertifikası ve ekolojik üretim yeterlilik karnesi',
          measurementTool: 'Usta öğretici değerlendirme rubriği ve atölye sonu ürün sergisi',
        },
      ],
      activityDetails: {
        activityType: 'VET_SHORT_TERM',
        activityGoalSummary: 'Avusturya Viyana kentinde 28 günlük çevre dostu ahşap işleme ve 5 eksen CNC stajı',
        targetCountries: ['AT'],
        hostKnown: true,
        hostName: 'Vienna Green Woodcraft Academy & Workshops',
        hostCountry: 'AT',
        totalParticipants: 8,
        standardDurationDays: 28,
        allSameDuration: true,
        durationGroups: [],
        includeTravelDays: true,
        travelDaysPerPerson: 4,
        greenTravelParticipantsCount: 8,
        mainTravelMode: 'TRAIN',
        accompanyingRequired: true,
        accompanyingCount: 2,
        accompanyingDays: 28,
        accompanyingReason: 'UNDERAGE',
        accompanyingFullDuration: true,
        hasBlendedMobility: false,
        hasInclusionSupport: true,
        inclusionCount: 3,
        inclusionCategories: [
          'Ekonomik Engeller (Düşük gelir, burs ihtiyacı)',
          'Coğrafi Engeller (Kırsal veya dezavantajlı bölge)',
        ],
        inclusionSupportType: 'UNIT_COST',
        inclusionReasonNotes: 'Kırsal kesimde ikamet eden ve gelir seviyesi düşük 3 çırak için ek seyahat ve konaklama desteği',
        hasExceptionalCosts: true,
        exceptionalCostType: 'VISA_RESIDENCE',
        exceptionalCostAmountEur: 1400,
        exceptionalCostJustification: 'Avusturya vize işlem harçları, yeminli tercüme ve zorunlu yurtdışı sağlık teminatı maliyetleri',
        hasPreparatoryVisit: false,
        hasCourseFees: false,
        linguisticSupportMode: 'OLS',
      },
      qualityTeam: {
        inclusionApproach: 'Çıraklık eğitimi alan dezavantajlı gençlerin uluslararasılaşmasını önceliklendiren kapsayıcı politika.',
        greenPractices: 'Gidiş-dönüşte tren/otobüs yeşil seyahat kullanımı (8 kişi), çevre dostu malzeme seçimi ve dijital evrak.',
        digitalToolsUsage: '3D CAD/CAM çizim programları, Europass CV ve e-staj takip defteri kullanımı.',
        democraticParticipation: 'Katılımcıların Avrupa yeşil mutabakatı ve mesleki örgütlenme bilinci kazanması.',
        legalRepresentativeName: 'Mehmet Özkan',
        legalRepresentativeRole: 'Merkez Müdürü',
        legalRepresentativeEmail: 'mehmet.ozkan@inegolmemp.meb.k12.tr',
        coordinatorName: 'Burak Şahin',
        coordinatorRole: 'Mobilya Alan Şefi / Erasmus+ Sorumlusu',
        coordinatorEmail: 'burak.sahin@inegolmemp.meb.k12.tr',
        selectionCriteriaSummary: 'İşletme devamlılığı (%30), Atölye uygulama notu (%30), Dil/Mülakat (%20), Sosyal durum (%20)',
        preparationPlanSummary: '36 saat pratik mesleki Almanca, 12 saat iş güvenliği ve Avrupa kültürü semineri',
        recognitionMethod: 'BOTH',
        monitoringMentorshipPlan: '2 refakatçi öğretmen eşliğinde günlük işletme ziyaretleri ve Avusturyalı usta mentorla haftalık değerlendirme',
        emergencyCrisisProtocol: 'Tam kapsamlı seyahat ve kaza poliçesi, Avusturya yerel acil numaralar rehberi ve 24/7 kriz irtibatı',
        institutionalIntegrationPlan: 'Viyana atölyelerindeki sıfır atık tekniklerinin İnegöl MEMP atölye eğitim modülüne dahil edilmesi',
        internalDissemination: 'İnegöl MEMP bahçesinde öğrenci ürünleri sergisi ve çırak öğrencilere yönelik motivasyon söyleşisi',
        externalDissemination: 'İnegöl Mobilyacılar Odası ve yerel basında proje sonuç raporu ve örnek uygulama tanıtımı',
        euVisibilityMeasures: 'Üretilen ahşap prototiplerde AB logosu, kurum girişinde tabela ve yerel basında haberler',
        priorityTopics: ['Yeşil Beceriler ve Sürdürülebilir Kalkınma', 'Kapsayıcılık, Çeşitlilik ve Fırsat Eşitliği', 'İş Temelli Öğrenme ve Okul-Sektör İşbirliği'],
      },
      declarations: {
        confirmAccreditationOrPlan: true,
        confirmAbsorptionCapacity: true,
        confirmErasmusQualityStandards: true,
        confirmNoConflictOfInterest: true,
        confirmNoDoubleFunding: true,
        confirmDeclarationOnHonour: true,
      },
    },
  },
];
