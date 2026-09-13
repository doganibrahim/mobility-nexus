'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Locale = 'tr' | 'en';

export interface Translations {
  header: {
    title: string;
    subtitle: string;
    badge: string;
    langToggle: string;
    themeLabel: string;
    fontLabel: string;
    nav: {
      programmes: {
        label: string;
        ka121: string;
        ka121Desc: string;
        ka122: string;
        ka122Desc: string;
        comparison: string;
        comparisonDesc: string;
      };
      beneficiaries: {
        label: string;
        meslekLiseleri: string;
        meslekLiseleriDesc: string;
        halkEgitim: string;
        halkEgitimDesc: string;
        olgunlasma: string;
        olgunlasmaDesc: string;
        mem: string;
        memDesc: string;
        osb: string;
        osbDesc: string;
        ttso: string;
        ttsoDesc: string;
        esnaf: string;
        esnafDesc: string;
      };
      opportunities: {
        label: string;
        hostOrgs: string;
        hostOrgsDesc: string;
        internships: string;
        internshipsDesc: string;
        becomePartner: string;
        becomePartnerDesc: string;
      };
      resources: {
        label: string;
        grantResults: string;
        grantResultsDesc: string;
        mebAtlas: string;
        mebAtlasDesc: string;
        legal: string;
        legalDesc: string;
      };
      contact: {
        label: string;
        appointment: string;
        appointmentDesc: string;
      };
    };
    beneficiaries: {
      label: string;
      meslekLiseleri: string;
      halkEgitim: string;
      olgunlasma: string;
      mem: string;
      diger: string;
      osb: string;
      ttso: string;
      esnaf: string;
    };
  };
  tabs: {
    profile: { label: string; desc: string };
    competence: { label: string; desc: string };
    matching: { label: string; desc: string };
    outcomes: { label: string; desc: string };
    report: { label: string; desc: string };
  };
  nav: {
    prev: string;
    next: string;
    step: string;
    complete: string;
  };
  system: {
    title: string;
    badge: string;
    step1Title: string;
    step1Desc: string;
    step2Title: string;
    step2Desc: string;
    step3Title: string;
    step3Desc: string;
    step4Title: string;
    step4Desc: string;
    disclaimer: string;
  };
  school: {
    title: string;
    badgePrefix: string;
    nameLabel: string;
    namePlaceholder: string;
    cityLabel: string;
    cityPlaceholder: string;
    accLabel: string;
    accUnknown: string;
    accYes: string;
    accNo: string;
    oidLabel: string;
    planLabel: string;
    planPlaceholder: string;
    needLabel: string;
    needPlaceholder: string;
    readinessTitle: string;
    readyBadge: string;
    incompleteBadge: string;
  };
  participant: {
    title: string;
    badge: string;
    typeLabel: string;
    teacher: string;
    student: string;
    goalLabel: string;
    nameLabel: string;
    namePlaceholder: string;
    langLabel: string;
    countryLabel: string;
    countryPlaceholder: string;
    durationLabel: string;
    durationPlaceholder: string;
  };
  esco: {
    title: string;
    badge: string;
    info: string;
    fieldLabel: string;
    fieldDefault: string;
    iscedCodeLabel: string;
    iscedNameLabel: string;
    escoTermLabel: string;
    iscoLabel: string;
    escoUriLabel: string;
    skillsLabel: string;
    verifyBtn: string;
    escoPortalBtn: string;
    iscedGuideBtn: string;
  };
  assessment: {
    title: string;
    badgeSuffix: string;
    desc: string;
    scoreBtn: string;
    fullTestBtn: string;
  };
  gap: {
    title: string;
    badge: string;
    quickScore: string;
    targetLabel: string;
    externalLabel: string;
    applyBtn: string;
    disclaimer: string;
  };
  eligibility: {
    title: string;
    badge: string;
    subtitle: string;
    accreditationLabel: string;
    participantCountLabel: string;
    durationLabel: string;
    pastGrantsLabel: string;
    strategyLabel: string;
    strategyAdHoc: string;
    strategyRegular: string;
    checkButton: string;
    resultEligibleTitle: string;
    resultIneligibleTitle: string;
    resultKa120Title: string;
    resultKa121Title: string;
  };
  decision: {
    title: string;
    badge: string;
    calcBtn: string;
    proposedPath: string;
    scoreLabel: string;
    rationaleTitle: string;
    emptyText: string;
  };
  host: {
    title: string;
    badge: string;
    modeLive: string;
    modeManual: string;
    liveDesc: string;
    runMatchBtn: string;
    matchingInProgress: string;
    matchSuccessTitle: string;
    matchSuccessSub: string;
    educationScoreLabel: string;
    logisticsScoreLabel: string;
    compositeRank: string;
    selectHostBtn: string;
    selectedBadge: string;
    hardFiltersPassed: string;
    disqualifiedTitle: string;
    disqualifiedSub: string;
    dqReasonLabel: string;
    capacityLabel: string;
    activitiesLabel: string;
    languagesLabel: string;
    noMatchesFound: string;
    nameLabel: string;
    countryLabel: string;
    typeLabel: string;
    criteriaTitle: string;
    totalWeight: string;
    scoreBtn: string;
    calculatedScore: string;
  };
  partners: {
    title: string;
    badge: string;
    funnelTitle: string;
    stageCol: string;
    sourceCol: string;
    queryCol: string;
    outputCol: string;
  };
  outcomes: {
    title: string;
    badge: string;
    gapLabel: string;
    technicalLabel: string;
    transversalLabel: string;
    generateBtn: string;
  };
  quality: {
    title: string;
    badge: string;
    stageCol: string;
    sendingCol: string;
    hostCol: string;
    disclaimer: string;
  };
  report: {
    title: string;
    badge: string;
    refreshBtn: string;
    printBtn: string;
    saveBtn: string;
    loadBtn: string;
    exportBtn: string;
    dossierTitle: string;
    dossierSub: string;
    legalDisclaimer: string;
    sendingOrg: string;
    oid: string;
    participant: string;
    proposedAction: string;
    vetField: string;
    iscedCode: string;
    escoProfile: string;
    conceptUri: string;
    compScore: string;
    suitability: string;
    hostOrg: string;
    hostScore: string;
    formatDuration: string;
    needsAlignment: string;
    erasmusPlan: string;
    escoSkills: string;
    expectedOutcomes: string;
    techOutcomes: string;
    transOutcomes: string;
    decisionSummary: string;
    emptyText: string;
    savedAlert: string;
    loadedAlert: string;
    notFoundAlert: string;
  };
  official: {
    title: string;
    badge: string;
    info: string;
    disclaimer: string;
  };
  footer: {
    subtitle: string;
    copyright: string;
  };
  legal: {
    title: string;
    termsTitle: string;
    cookiesTitle: string;
    retentionTitle: string;
    cookiePreferences: string;
    close: string;
    savePreferences: string;
    acceptAll: string;
    rejectAll: string;
    consentCheckbox: string;
  };
  profile: {
    title: string;
    subtitle: string;
    personalInfo: string;
    fullName: string;
    email: string;
    role: string;
    roleAdmin: string;
    roleSchool: string;
    roleHost: string;
    roleMember: string;
    institutionInfo: string;
    noInstitution: string;
    createInstitution: string;
    readinessScore: string;
    verificationStatus: string;
    signOut: string;
    backHome: string;
  };
  adminDashboard: {
    badge: string;
    title: string;
    subtitle: string;
    viewAdmin: string;
    viewSchool: string;
    viewHost: string;
    pendingDocs: string;
    pendingSubtitle: string;
    verifiedHosts: string;
    verifiedSubtitle: string;
    beneficiariesCatalog: string;
    beneficiariesSubtitle: string;
    openQueue: string;
    quickReview: string;
    recentRequests: string;
    underReview: string;
    verified: string;
    pending: string;
    needsRevision: string;
    exploreCatalog: string;
  };
  hostDashboard: {
    portalBadge: string;
    verifiedBadge: string;
    underReviewBadge: string;
    needsUpdateBadge: string;
    pendingBadge: string;
    simulatedBadge: string;
    completenessTitle: string;
    completenessDesc: string;
    stage2Badge: string;
    stage2Title: string;
    stage2Desc: string;
    stage2Btn: string;
    stage3Badge: string;
    stage3Title: string;
    stage3Desc: string;
    stage3Btn: string;
    locationCountry: string;
    orgTypeSector: string;
    sectorCapacity: string;
    activitiesLanguages: string;
    contactConsent: string;
    contactPerson: string;
    viewAdminQueue: string;
    backToHome: string;
  };
  onboarding: {
    roleSelectBadge: string;
    roleSelectTitle: string;
    roleSelectSubtitle: string;
    adminBadge: string;
    adminTitle: string;
    adminDesc: string;
    adminQueueBtn: string;
    goToHomeBtn: string;
    schoolCardBadge: string;
    schoolCardTitle: string;
    schoolCardDesc: string;
    schoolFeature1: string;
    schoolFeature2: string;
    schoolFeature3: string;
    schoolCardAction: string;
    hostCardBadge: string;
    hostCardTitle: string;
    hostCardDesc: string;
    hostFeature1: string;
    hostFeature2: string;
    hostFeature3: string;
    hostCardAction: string;
    schoolSetupBadge: string;
    schoolUpdateBadge: string;
    schoolFormTitle: string;
    schoolEditTitle: string;
    schoolFormSubtitle: string;
    changeRole: string;
    cancel: string;
    back: string;
    completeAndReview: string;
    updateAndSave: string;
    hostSetupBadge: string;
    hostFormTitle: string;
    hostFormSubtitle: string;
    hostSection1: string;
    hostSection2: string;
    hostSection3: string;
    publicConsentTitle: string;
    publicConsentDesc: string;
    kycNotice: string;
    completeHostSetup: string;
  };
  simulation: {
    bannerTitle: string;
    viewingAsSchool: string;
    viewingAsHost: string;
    switchToHost: string;
    switchToSchool: string;
    backToAdmin: string;
  };
  resultsWidget: {
    title: string;
    subtitle: string;
    badge: string;
    close: string;
    searchPlaceholder: string;
    allCities: string;
    allStatuses: string;
    acceptedList: string;
    reserveList: string;
    grantRangeAll: string;
    colRank: string;
    colSchool: string;
    colCity: string;
    colGrant: string;
    colStatus: string;
    colProject: string;
    kpiFiltered: string;
    kpiTotalGrant: string;
    kpiAvgGrant: string;
    kpiDistribution: string;
    institutionsCount: string;
    acceptedCountLabel: string;
    backupCountLabel: string;
    tabKa121: string;
    tabKa122: string;
    filtersBtn: string;
    clearBtn: string;
    cityLabel: string;
    statusLabel: string;
    grantRangeLabel: string;
    sortLabel: string;
    sortDefault: string;
    sortGrantDesc: string;
    sortGrantAsc: string;
    sortNameAsc: string;
    sortNameDesc: string;
    sortCityAsc: string;
    sortCityDesc: string;
    sortProjectAsc: string;
    sortProjectDesc: string;
    noResultsTitle: string;
    noResultsDesc: string;
    resetFilters: string;
    totalRecords: string;
    recordsOf: string;
    showingRange: string;
    showingZero: string;
    perPage: string;
    all: string;
    prevPage: string;
    nextPage: string;
  };
  guestBanner: {
    badge: string;
    title: string;
    desc: string;
    badge1: string;
    badge2: string;
    badge3: string;
    badge4: string;
    btnTour: string;
    btnDemo: string;
    btnRegister: string;
    dismiss: string;
  };
  inquiry: {
    sendInquiryBtn: string;
    inquirySentBadge: string;
    modalTitle: string;
    modalSubtitle: string;
    senderOrgTitle: string;
    targetHostTitle: string;
    mobilityDetailsTitle: string;
    fieldLabel: string;
    participantsLabel: string;
    durationLabel: string;
    datesLabel: string;
    logisticsLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    cancelBtn: string;
    submitBtn: string;
    successTitle: string;
    successMessage: string;
    closeBtn: string;
    hostSectionTitle: string;
    hostSectionSubtitle: string;
    tabAll: string;
    tabPending: string;
    tabAccepted: string;
    tabDeclined: string;
    acceptBtn: string;
    reviseBtn: string;
    declineBtn: string;
    undoBtn: string;
    editReplyBtn: string;
    viewDetailsBtn: string;
    replyModalTitle: string;
    replyModalSubtitle: string;
    replyModalDecisionLabel: string;
    replyModalNoteLabel: string;
    replyModalPlaceholder: string;
    replyModalTemplatesLabel: string;
    replyModalSaveBtn: string;
    templateAccept1: string;
    templateAccept2: string;
    templateRevise1: string;
    templateRevise2: string;
    templateDecline1: string;
    templateDecline2: string;
    undoSuccessMsg: string;
    statusPending: string;
    statusAccepted: string;
    statusRevised: string;
    statusDeclined: string;
    mockBadge: string;
    emptyInquiriesMsg: string;
  };
  sentInquiries: {
    cardTitle: string;
    cardBadge: string;
    cardSubtitle: string;
    tabAll: string;
    tabPending: string;
    tabAccepted: string;
    tabRevised: string;
    tabDeclined: string;
    viewLoIBtn: string;
    withdrawBtn: string;
    withdrawConfirmMsg: string;
    findAlternativeBtn: string;
    emptyTitle: string;
    emptyDesc: string;
    emptyCtaBtn: string;
    viewSentInquiriesBtn: string;
    demoSwitchNotice: string;
    demoSwitchBtn: string;
    sentDateLabel: string;
    targetHostLabel: string;
    logisticsLabel: string;
    schoolNoteLabel: string;
    hostResponseLabel: string;
    loiModalTitle: string;
    loiModalSubtitle: string;
  };
  guestOnboarding: {
    modalTitle: string;
    stepIndicator: string;
    btnNext: string;
    btnPrev: string;
    btnComplete: string;
    btnSkip: string;
    dontShowAgain: string;
    howItWorksBtn: string;
    guestNoticeBadge: string;
    guestNoticeTitle: string;
    guestNoticeDesc: string;
    guestNoticeBtn: string;
    step1Tag: string;
    step1Title: string;
    step1Desc: string;
    step1Point1Title: string;
    step1Point1Desc: string;
    step1Point2Title: string;
    step1Point2Desc: string;
    step1Point3Title: string;
    step1Point3Desc: string;
    step2Tag: string;
    step2Title: string;
    step2Desc: string;
    roleSchoolTitle: string;
    roleSchoolSubtitle: string;
    roleSchoolDesc: string;
    roleSchoolPoint1: string;
    roleSchoolPoint2: string;
    roleSchoolPoint3: string;
    roleHostTitle: string;
    roleHostSubtitle: string;
    roleHostDesc: string;
    roleHostPoint1: string;
    roleHostPoint2: string;
    roleHostPoint3: string;
    step3Tag: string;
    step3Title: string;
    step3Desc: string;
    stage1Name: string;
    stage1Desc: string;
    stage2Name: string;
    stage2Desc: string;
    stage3Name: string;
    stage3Desc: string;
    stage4Name: string;
    stage4Desc: string;
    stage5Name: string;
    stage5Desc: string;
    step4Tag: string;
    step4Title: string;
    step4Desc: string;
    freeBenefitTitle: string;
    freeBenefitDesc: string;
    btnDemoStart: string;
    btnDemoStartSub: string;
    btnSignUp: string;
    btnSignUpSub: string;
    btnSignIn: string;
    noticeNoCard: string;
  };
}

const TRANSLATIONS: Record<Locale, Translations> = {
  tr: {
    header: {
      title: 'CAPPINNO Mobility Nexus',
      subtitle: 'KA121-VET • KA122-VET • ESCO & ISCED-F • Yetkinlik Ölçümü • AB Ev Sahibi Eşleştirme',
      badge: 'EMaaS v1.0 • 2026',
      langToggle: 'Dil',
      themeLabel: 'Tema',
      fontLabel: 'Yazı Tipi',
      nav: {
        programmes: {
          label: 'Programlar',
          ka121: 'KA121-VET (Akredite Kurumlar)',
          ka121Desc: 'Yıllık hibe tahsisatı ve Erasmus Plan hedefleri',
          ka122: 'KA122-VET (Kısa Dönemli)',
          ka122Desc: 'İlk kez başvuran ve akredite olmayan kurumlar için',
          comparison: 'KA121 - KA122 Karşılaştırması',
          comparisonDesc: 'Uygunluk kuralları, hibe limitleri ve kriterler',
        },
        beneficiaries: {
          label: 'Yararlanıcılar',
          meslekLiseleri: 'Meslek Liseleri',
          meslekLiseleriDesc: '3.700+ MTAL ve ÇPAL açık veri kataloğu',
          halkEgitim: 'Halk Eğitim Merkezleri',
          halkEgitimDesc: '1.002 resmi HEM iletişim ve web portalları',
          olgunlasma: 'Olgunlaşma Enstitüleri',
          olgunlasmaDesc: '32 geleneksel sanat ve tasarım enstitüsü',
          mem: 'İl ve İlçe MEM',
          memDesc: '81 İl ve İlçe Milli Eğitim Müdürlüğü',
          osb: 'Organize Sanayi Bölgeleri',
          osbDesc: 'Türkiye geneli OSB müdürlükleri',
          ttso: 'Ticaret ve Sanayi Odaları',
          ttsoDesc: 'TOBB il bazlı ticaret ve sanayi odaları',
          esnaf: 'Esnaf ve Sanatkârlar Odaları',
          esnafDesc: 'TESK il esnaf ve sanatkârlar birlikleri',
        },
        opportunities: {
          label: 'Fırsatlar & Hostlar',
          hostOrgs: 'Ev Sahibi Kurumlar (Host Portföyü)',
          hostOrgsDesc: 'Avrupa genelinde onaylı işletmeler ve merkezler',
          internships: 'Staj ve İşbaşı İzleme Alanları',
          internshipsDesc: 'VET stajyer kontenjanları ve çalışma koşulları',
          becomePartner: 'Ev Sahibi Ortak Ol (Host Kaydı)',
          becomePartnerDesc: 'Avrupa merkezli kurumlar için hızlı kayıt',
        },
        resources: {
          label: 'Kaynaklar',
          grantResults: '2026 Hibe Dağılımı ve Analizi',
          grantResultsDesc: 'Türkiye geneli akredite kurum hibe istatistikleri',
          mebAtlas: 'MEB Açık Veri Referans Kataloğu',
          mebAtlasDesc: '81 il resmi okul ve kurum verileri rehberi',
          legal: 'KVKK Aydınlatma Metni',
          legalDesc: '6698 sayılı kanun kapsamında veri işleme ilkeleri',
        },
        contact: {
          label: 'İletişim',
          appointment: 'Randevu Al',
          appointmentDesc: 'Online danışmanlık ve tanışma toplantısı planlayın',
        },
      },
      beneficiaries: {
        label: 'Yararlanıcılar',
        meslekLiseleri: 'Meslek Liseleri',
        halkEgitim: 'Halk Eğitim Merkezleri',
        olgunlasma: 'Olgunlaşma Enstitüleri',
        mem: 'İl ve İlçe Milli Eğitim Müdürlükleri',
        diger: 'Diğer',
        osb: 'Organize Sanayi Bölgeleri',
        ttso: 'Ticaret ve Sanayi Odaları',
        esnaf: 'Esnaf ve Sanatkârlar Odaları Birlikleri',
      },
    },
    tabs: {
      profile: { label: '1. Kurum & Katılımcı', desc: 'Okul ve hedef profil' },
      competence: { label: '2. ESCO & Yetkinlik', desc: 'Taksonomi ve değerlendirme' },
      matching: { label: '3. Host & Karar', desc: 'Host eşleştirme ve KA120/121/122' },
      outcomes: { label: '4. Kazanımlar & Kalite', desc: 'Öğrenme çıktıları ve İSG' },
      report: { label: '5. Planlama Raporu', desc: 'Kurum içi planlama ve tavsiye raporu' },
    },
    nav: {
      prev: '← Önceki Adım',
      next: 'Sonraki Adım →',
      step: 'Aşama',
      complete: 'Raporu Güncelle & Tamamla ✓',
    },
    system: {
      title: '1. Sistem Mimarisi & EMaaS İş Akışı',
      badge: 'Platform Rehberi',
      step1Title: 'Kurum & Katılımcı Profili',
      step1Desc: 'Kurum akreditasyon OID kaydı, Erasmus Plan hedefleri ve katılımcı dil/profil verileri.',
      step2Title: 'ESCO + ISCED-F Eşleştirici',
      step2Desc: '12 Mesleki alan için ISCED-F eğitim kodu ve Avrupa ESCO meslek profili otomatik eşleme.',
      step3Title: 'Yetkinlik & Karar Motoru',
      step3Desc: '12 soruluk yetkinlik testi, gelişim açığı (gap) ve 8 kriterli KA121/KA122 karar motoru.',
      step4Title: 'AB Ev Sahibi & Hareketlilik Planı',
      step4Desc: '10 parametreli ağırlıklı Host skorlaması, partner arama hunisi ve rol bazlı kazanım üretimi.',
      disclaimer: 'Önemli Bilgilendirme: Bu platform Erasmus+ KA121-VET ve KA122-VET projeleri için tavsiye, eşleştirme ve planlama amaçlıdır. Nihai uygunluk, faaliyet türü, süre, bütçe ve başvuru kararları Erasmus+ Programme Guide ve Türkiye Ulusal Ajansı kurallarıyla doğrulanmalıdır.',
    },
    school: {
      title: '2. Kurum & Okul Profili',
      badgePrefix: 'Kurum Hazırlık',
      nameLabel: 'Meslek Lisesi / VET Kuruluşu Tam Adı *',
      namePlaceholder: 'Örn: Ankara Mesleki ve Teknik Anadolu Lisesi',
      cityLabel: 'İl / Şehir *',
      cityPlaceholder: 'Örn: Ankara',
      accLabel: 'Erasmus VET Akreditasyonu',
      accUnknown: 'Bilinmiyor / Belirsiz',
      accYes: 'Evet (Akredite Kurum - KA121)',
      accNo: 'Hayır (Kısa Dönem Başvuru - KA122)',
      oidLabel: 'Erasmus OID Kodu (E10XXXXXX)',
      planLabel: 'Erasmus Plan Hedefi (Akredite İse Stratejik Hedefler)',
      planPlaceholder: 'Örn: Öğretmen ve öğrencilerin Endüstri 4.0 / dijital üretim ve robotik yetkinliklerini geliştirmek...',
      needLabel: 'Kurumsal İhtiyaç / Somut Challenge *',
      needPlaceholder: 'Somut kurumsal ihtiyaç, laboratuvar donanım/eğitim eksikliği ve mevcut performans boşluğunu yazın...',
      readinessTitle: 'Kurumsal Profil Tamamlığı:',
      readyBadge: 'Hazır',
      incompleteBadge: 'Eksikler Var',
    },
    participant: {
      title: '3. Katılımcı & Hareketlilik Profili',
      badge: 'Hedef Kitle',
      typeLabel: 'Katılımcı Türü *',
      teacher: 'Teknik Öğretmen / Eğitici (Staff)',
      student: 'Meslek Lisesi Öğrencisi / Çırak (VET Learner)',
      goalLabel: 'Hareketlilik Tercihi / Faaliyet Türü',
      nameLabel: 'Katılımcı Grubu / Kod / İsim',
      namePlaceholder: 'Örn: Bilişim Öğretmenleri veya ID-2026-VET-01',
      langLabel: 'İngilizce / Çalışma Dili Hazırlığı (0-100)',
      countryLabel: 'Hedef AB Ülke Tercihi',
      countryPlaceholder: 'Örn: Almanya / Hollanda / İspanya',
      durationLabel: 'Planlanan Süre (Öneri)',
      durationPlaceholder: 'Örn: 10 gün (Öğretmen) veya 21 gün (Öğrenci)',
    },
    esco: {
      title: '4. ESCO – ISCED-F Eşleştirici',
      badge: 'AB Taksonomi Standartları',
      info: 'ISCED-F eğitim alanını; ESCO ise meslek, beceri/yetkinlik ve mesleki profil eşleştirmesini destekler. ESCO\'da her meslek bir ISCO-08 koduna bağlıdır; tam ESCO kavram URI\'si resmi ESCO portalından doğrulanmalıdır.',
      fieldLabel: 'Mesleki Alan / Bölüm Seçiniz *',
      fieldDefault: '-- Alan Seçiniz (12 VET Alanı) --',
      iscedCodeLabel: 'ISCED-F Kodu',
      iscedNameLabel: 'ISCED-F Alanı',
      escoTermLabel: 'Önerilen ESCO Arama Terimi / Meslek Ailesi',
      iscoLabel: 'ISCO-08 Kodu',
      escoUriLabel: 'ESCO Kavram URI',
      skillsLabel: 'Öncelikli ESCO Becerileri / Beceriler & Yetkinlikler',
      verifyBtn: 'ESCO\'da Doğrula',
      escoPortalBtn: 'ESCO Sınıflandırma Portalı',
      iscedGuideBtn: 'ISCED-F 2013 Rehberi',
    },
    assessment: {
      title: '5. Yetkinlik Değerlendirme (Competence Assessment)',
      badgeSuffix: 'Yanıtlandı',
      desc: 'Aşağıdaki 12 soruluk değerlendirme 1 (Temel) – 5 (İleri/Uzman) ölçeğini kullanır. CAPPINNO Competence4VET metodolojisine dayanır.',
      scoreBtn: 'Testi Puanla',
      fullTestBtn: 'Tam Competence4VET Testini Aç',
    },
    gap: {
      title: 'Yetkinlik Açığı Analizi (Competence Gap)',
      badge: 'Açık & İhtiyaç',
      quickScore: 'Hızlı Değerlendirme Skoru',
      targetLabel: 'Hedeflenen Seviye (0–100)',
      externalLabel: 'Harici Competence4VET Test Skoru',
      applyBtn: 'Uygula',
      disclaimer: 'Test sonucu tek başına katılımcı elemek için kullanılmamalıdır; ön hazırlık veya mentorluk ihtiyacını tespit etmek amacıyla değerlendirilir.',
    },
    eligibility: {
      title: '5. KA122-VET Başvuru Öncesi Zorunlu Uygunluk Kontrolü',
      badge: 'Resmi Uygunluk Kapısı (Gatekeeper)',
      subtitle: 'Erasmus+ VET rehberine göre akreditasyon, katılımcı tavanı (30 kişi), proje süresi (6–18 ay) ve 36 aylık hibe kotası denetimi',
      accreditationLabel: 'Kurum Akreditasyon Durumu',
      participantCountLabel: 'Planlanan Katılımcı Sayısı (Maks. 30)',
      durationLabel: 'Planlanan Proje Süresi (6–18 Ay)',
      pastGrantsLabel: 'Son 36 Ayda Alınan KA122 Hibesi (Maks. 3)',
      strategyLabel: 'Hareketlilik Stratejisi & Vizyonu',
      strategyAdHoc: 'Kısa Dönemli / Tek Seferlik İhtiyaç (KA122)',
      strategyRegular: 'Yıllık ve Düzenli Kurumsal Hareketlilik (KA120 Önerilir)',
      checkButton: 'Uygunluk Kriterlerini Denetle',
      resultEligibleTitle: 'KA122-VET Başvurusuna Tam Uygun',
      resultIneligibleTitle: 'Kural İhlali Tespit Edildi',
      resultKa120Title: 'KA120-VET Erasmus Akreditasyonu Tavsiye Edilir',
      resultKa121Title: 'Doğrudan KA121-VET Yıllık Hibe Tahsisatı Kullanılmalıdır',
    },
    host: {
      title: '6. AB Ev Sahibi Kuruluş (Host) Eşleştirme & Skorlama',
      badge: '10 Kriter & Akıllı Eşleştirme',
      modeLive: 'Akıllı AB Ev Sahibi Eşleştirme (Live Match)',
      modeManual: 'Manuel Değerlendirme (10 Kriter)',
      liveDesc: 'Okulunuzun hedef ülke, faaliyet türü, kontenjan ve lojistik taleplerini veritabanındaki kayıtlı ve doğrulanmış Avrupalı ev sahipleriyle anlık eşleştirir.',
      runMatchBtn: 'Okul Profiline Göre Ev Sahibi Eşleştir',
      matchingInProgress: 'Kuruluşlar taranıyor ve 10 zorunlu kriter denetleniyor...',
      matchSuccessTitle: 'Eşleşen Ev Sahibi Kuruluşlar',
      matchSuccessSub: 'Zorunlu ön eleme kriterlerini (Hard Filters) eksiksiz geçen ve iki kademeli puanlanan adaylar:',
      educationScoreLabel: 'Eğitim & Yerleştirme Kalitesi',
      logisticsScoreLabel: 'Lojistik Desteği',
      compositeRank: 'Birleşik Eşleşme Uyumu',
      selectHostBtn: 'Bu Kuruluşu Seç & Forma Aktar ✓',
      selectedBadge: 'Seçili Ev Sahibi',
      hardFiltersPassed: '10 Zorunlu Kriter Onaylandı',
      disqualifiedTitle: 'Ön Elemede Diskalifiye Edilen Kuruluşlar',
      disqualifiedSub: 'Aşağıdaki kurumlar en az bir zorunlu uygunluk şartını karşılamadığı için elenmiştir:',
      dqReasonLabel: 'Elenme Gerekçesi',
      capacityLabel: 'Dönemlik Kontenjan',
      activitiesLabel: 'Desteklenen Faaliyetler',
      languagesLabel: 'Çalışma Dilleri',
      noMatchesFound: 'Girilen kriterlere tam uyan kayıtlı ev sahibi bulunamadı. Lütfen hedef ülke veya faaliyet türü filtrelerinizi genişletiniz.',
      nameLabel: 'Host Kuruluş Adı *',
      countryLabel: 'Ülke *',
      typeLabel: 'Host Türü',
      criteriaTitle: 'Kurum Değerlendirme Kriterleri (0–100 Puan)',
      totalWeight: 'Toplam Ağırlık: %100',
      scoreBtn: 'Ev Sahibi Skorunu Hesapla',
      calculatedScore: 'Hesaplanan Skor:',
    },
    decision: {
      title: '7. KA120 / KA121 / KA122 Karar Motoru',
      badge: '8 Faktörlü Karar Modeli',
      calcBtn: 'Karar Motorunu Çalıştır (KA120 / KA121 / KA122)',
      proposedPath: 'Önerilen Erasmus+ Başvuru Yolu:',
      scoreLabel: 'Hareketlilik Uygunluk Skoru:',
      rationaleTitle: 'Karar Gerekçesi:',
      emptyText: 'Karar üretmek için yukarıdaki "Karar Motorunu Çalıştır" butonuna tıklayınız.',
    },
    partners: {
      title: '8. AB Partner & Host Arama Portalları',
      badge: 'Resmi Portallar & Arama Hunisi',
      funnelTitle: 'Önerilen 5 Aşamalı Partner Arama Hunisi (Search Funnel)',
      stageCol: 'Aşama',
      sourceCol: 'Kaynak Platform',
      queryCol: 'Arama Stratejisi',
      outputCol: 'Hedef Çıktı',
    },
    outcomes: {
      title: '9. Öğrenme Kazanımları Üreteci (Learning Outcomes)',
      badge: 'Rol Bazlı Dinamik Üretim',
      gapLabel: 'Öncelikli Yetkinlik Açığı / Competence Gap',
      technicalLabel: 'Hareketlilik Sonunda Beklenen Teknik Kazanım (Hard Skills)',
      transversalLabel: 'Transversal / Yeşil / Dijital & Dil Kazanımı (Soft Skills)',
      generateBtn: 'Rol ve Alana Göre Örnek Kazanımlar Üret',
    },
    quality: {
      title: '10. Kalite & Sorumluluk Matrisi',
      badge: 'Erasmus Kalite Standartları',
      stageCol: 'Süreç / Alan',
      sendingCol: 'Gönderen Kurum (Yararlanıcı VET)',
      hostCol: 'Ev Sahibi (AB Partneri)',
      disclaimer: 'Erasmus Temel İlkesi: Çekirdek proje görevleri (katılımcı seçimi, bütçe yönetimi, Ulusal Ajans raporlaması) mutlaka gönderen yararlanıcı kurumda (Beneficiary) kalmalıdır. Destekleyici aracı kuruluşlar sadece operasyonel kolaylaştırıcılık sağlayabilir.',
    },
    report: {
      title: '11. Kurum İçi Planlama ve Tavsiye Raporu – Erasmus+ Başvuru Formu Değildir',
      badge: 'Kurum İçi Planlama Raporu',
      refreshBtn: 'Raporu Güncelle',
      printBtn: 'PDF / Yazdır',
      saveBtn: 'Tarayıcıya Kaydet',
      loadBtn: 'Kaydı Yükle',
      exportBtn: 'JSON İndir',
      dossierTitle: 'Kurum İçi Planlama ve Tavsiye Raporu – Erasmus+ Başvuru Formu Değildir',
      dossierSub: 'CAPPINNO Mobility Nexus • 2026 Projeleri: Uygulama Dönemi • 2027 Çağrısı: Resmi Duyuru Bekleniyor',
      legalDisclaimer: 'Önemli Bilgilendirme: Bu belge kurum içi stratejik planlama ve hazırlık tavsiyesi niteliğindedir. Resmi Erasmus+ başvuru formu veya taahhüt yerine geçmez. Başvurular ilgili kurum tarafından doğrudan Ulusal Ajans resmi başvuru portalları üzerinden yürütülmelidir.',
      sendingOrg: 'Gönderen Kurum (Sending VET)',
      oid: 'OID Kodu',
      participant: 'Katılımcı Profili',
      proposedAction: 'Önerilen Faaliyet',
      vetField: 'Mesleki Alan & Bölüm',
      iscedCode: 'ISCED-F Kodu',
      escoProfile: 'ESCO Arama Profili',
      conceptUri: 'ISCO / Kavram URI',
      compScore: 'Yetkinlik Skoru',
      suitability: 'Hareketlilik Uygunluğu',
      hostOrg: 'Ev Sahibi Kuruluş (EU Host)',
      hostScore: 'Ev Sahibi Kalite Skoru',
      formatDuration: 'Hareketlilik Formatı & Süre',
      needsAlignment: 'Kurumsal İhtiyaç & Erasmus Plan Uyumu',
      erasmusPlan: 'Erasmus Planı Hedefi:',
      escoSkills: 'Öncelikli ESCO Becerileri',
      expectedOutcomes: 'Beklenen Öğrenme Kazanımları (Learning Outcomes)',
      techOutcomes: 'Teknik Kazanım:',
      transOutcomes: 'Transversal / Yeşil / Dijital:',
      decisionSummary: 'Sonuç & Değerlendirme',
      emptyText: 'Okul profili, yeterlilik testi ve host bilgilerini doldurduktan sonra yukarıdaki "Raporu Güncelle" butonuna basınız.',
      savedAlert: 'Tüm form ve değerlendirme verileri tarayıcınıza başarıyla kaydedildi.',
      loadedAlert: 'Kayıtlı profil verileri başarıyla yüklendi.',
      notFoundAlert: 'Kayıtlı bir profil verisi bulunamadı.',
    },
    official: {
      title: '12. Resmi Kaynaklar ve Yasal Çerçeve',
      badge: 'Yasal Sorumluluk',
      info: 'KA121-VET akredite kuruluşlar için Erasmus Plan ile bağlantılı yıllık bütçe tahsisatına dayanır. KA122-VET kısa dönemli hareketlilik projelerinde ise kurumun kurumsal arkaplan, ihtiyaç/challenge, hedefler, faaliyetler, bütçe, kalite standartları ve yaygınlaştırma zincirini gerekçelendirmesi zorunludur.',
      disclaimer: 'Değerlendirme Yasal Uyarısı (Assessment Disclaimer): Bu araçtaki yeterlilik testi ve Mobility Suitability skoru tavsiye ve planlama amaçlıdır. Sonuçlar tek başına öğrenci/öğretmen seçimi, dışlama, işe alım, notlandırma veya başka yüksek etkili kararlar için kullanılamaz. Katılımcı seçimi şeffaf, adil ve kapsayıcı ayrı bir resmi prosedürle yürütülmelidir.',
    },
    footer: {
      subtitle: 'Erasmus+ KA121-VET ve KA122-VET projeleri için akıllı eşleştirme, ESCO-ISCED sınıflandırması, yetkinlik ölçümü ve denetim izi yönetim platformu.',
      copyright: '© 2026 CAPPINNO • Enterprise Multi-tenant SaaS Platform',
    },
    legal: {
      title: 'KVKK Aydınlatma Metni',
      termsTitle: 'Kullanım Koşulları',
      cookiesTitle: 'Çerez Politikası',
      retentionTitle: 'Veri Saklama & İmha',
      cookiePreferences: 'Çerez Tercihleri',
      close: 'Kapat',
      savePreferences: 'Seçimlerimi Kaydet',
      acceptAll: 'Tümünü Kabul Et',
      rejectAll: 'Tümünü Reddet (Zorunlu Hariç)',
      consentCheckbox: 'KVKK Aydınlatma Metni\'ni okudum ve kişisel/kurumsal verilerimin işlenmesini onaylıyorum.',
    },
    profile: {
      title: 'Kullanıcı Profili & Hesap Detayları',
      subtitle: 'Platformdaki kişisel bilgileriniz, kurumsal yetki seviyeniz ve bağlı kurumunuzun durumu.',
      personalInfo: 'Kişisel Hesap Bilgileri',
      fullName: 'Ad Soyad',
      email: 'E-posta Adresi',
      role: 'Yetki Seviyesi',
      roleAdmin: '🛡️ Platform Yöneticisi',
      roleSchool: '🏛️ Okul / Gönderen Kurum Yöneticisi',
      roleHost: '🏢 Ev Sahibi Kurum Temsilcisi',
      roleMember: '👤 Ekip Üyesi',
      institutionInfo: 'Bağlı Kurum Bilgileri',
      noInstitution: 'Henüz kayıtlı bir kurumunuz bulunmuyor.',
      createInstitution: 'Kurum Profilini Oluştur (Onboarding) →',
      readinessScore: 'Erasmus+ Başvuru Hazırlık Skoru',
      verificationStatus: 'Doğrulama Durumu',
      signOut: 'Oturumu Kapat',
      backHome: '← Ana Sayfaya Dön',
    },
    adminDashboard: {
      badge: 'Platform Yöneticisi Kontrol Merkezi',
      title: 'Yönetici Paneli & Rol Simülasyonu',
      subtitle: 'Sistemi farklı kullanıcıların gözünden test etmek için aşağıdaki butonlara tıklayarak anında simülasyon moduna geçebilirsiniz.',
      viewAdmin: 'Admin Görünümü',
      viewSchool: 'Okul Gözünden Bak',
      viewHost: 'Host Gözünden Bak',
      pendingDocs: 'Onay Bekleyen Evraklar',
      pendingSubtitle: 'İncelenmeyi bekleyen kurumsal sicil ve doğrulama evrakları',
      verifiedHosts: 'Doğrulanmış Host Kurumlar',
      verifiedSubtitle: 'Tüm aşamaları geçmiş onaylı Avrupa işletmeleri',
      beneficiariesCatalog: 'Yararlanıcılar Referans Kataloğu (4.800+)',
      beneficiariesSubtitle: 'Meslek Liseleri, HEM, Olgunlaşma ve MEM referans veri tabanı',
      openQueue: 'Admin Doğrulama Havuzunu Aç',
      quickReview: 'Hızlı İşlemler & İnceleme Havuzu',
      recentRequests: 'Son Eklenen Doğrulama Talepleri',
      underReview: 'İnceleniyor',
      verified: 'Onaylandı',
      pending: 'Beklemede',
      needsRevision: 'Revizyon İstendi',
      exploreCatalog: 'Kataloğu İncele',
    },
    hostDashboard: {
      portalBadge: 'Ev Sahibi Kurum Portali (Host)',
      verifiedBadge: 'Doğrulanmış Partner Rozeti Aktif',
      underReviewBadge: 'Evraklar İnceleniyor (Under Review)',
      needsUpdateBadge: 'Evraklarda Revizyon İsteniyor',
      pendingBadge: 'Doğrulama Bekliyor',
      simulatedBadge: 'Admin Simülasyonu',
      completenessTitle: 'Kurumsal Profil Doluluk Oranı',
      completenessDesc: 'Portföy ve doğrulama evraklarınızı ekledikçe okulların arama sonuçlarında üst sıralara çıkarsınız.',
      stage2Badge: 'Aşama 2: Vitrin & Portföy',
      stage2Title: 'Erasmus+ Portföyünü ve Detayları Ekle',
      stage2Desc: 'Örnek hareketlilik programı, 150 kelimelik kısa açıklama, logo, LinkedIn ve geçmiş Türkiye deneyimlerinizi ekleyerek okulların sizi keşfetmesini sağlayın.',
      stage2Btn: '🎨 Portföyü Düzenle (%75-80 Doluluk)',
      stage3Badge: 'Aşama 3: Kurumsal Doğrulama / KYC',
      stage3Title: 'Kurumsal Doğrulama & Rozet Başvurusu',
      stage3Desc: 'Şirket sicil belgesi, vergi numarası, 7/24 acil durum kontağı ve katılımcı kanıt evraklarını yükleyerek "Verified Partner" rozeti kazanın.',
      stage3Btn: '🛡️ Doğrulama Evraklarını Yönet (Admin Only)',
      locationCountry: 'Konum & Ülke',
      orgTypeSector: 'Kurum Türü & Sektör',
      sectorCapacity: 'Sektör & Dönemlik Kapasite',
      activitiesLanguages: 'Faaliyet Türleri & Diller',
      contactConsent: 'Kamusal Profilde Gösterim Onaylı',
      contactPerson: 'İrtibat Yetkilisi & İzin',
      viewAdminQueue: 'Yönetici Doğrulama Havuzunu İncele (Admin View)',
      backToHome: 'Platform Ana Sayfasına Git',
    },
    onboarding: {
      roleSelectBadge: 'Erasmus+ Hareketlilik Portalı',
      roleSelectTitle: 'Kurumsal Profilinizi Seçin',
      roleSelectSubtitle: 'Platform üzerindeki faaliyet alanınıza uygun kurumsal rolü seçerek kurulumu başlatın.',
      adminBadge: 'Platform Yöneticisi Erişimi',
      adminTitle: 'Sistem Yöneticisi olarak oturum açtınız',
      adminDesc: 'Kurum kaydı yapmanız zorunlu değildir. Tarafsız yönetici olarak onay havuzunu doğrudan yönetebilirsiniz.',
      adminQueueBtn: 'Admin Doğrulama Havuzu',
      goToHomeBtn: 'Ana Sayfaya Geç',
      schoolCardBadge: 'Öğrenci & Personel Gönderen',
      schoolCardTitle: 'Okul / Gönderen Kurum',
      schoolCardDesc: 'Erasmus+ KA121 akreditasyonu veya KA122 kısa dönem projeleri ile mesleki eğitim öğrencilerini ve öğretmenlerini Avrupa\'ya staj ve eğitime gönderen meslek liseleri ve kurumlar.',
      schoolFeature1: 'Resmi Erasmus OID & Akreditasyon Eşleşmesi',
      schoolFeature2: 'Canlı Kurumsal Hazırlık Skoru',
      schoolFeature3: 'ESCO / ISCED-F Eşleştirme Motoru',
      schoolCardAction: 'Okul Kurulumuna Başla',
      hostCardBadge: 'Avrupa Staj / İşbaşı Sağlayıcısı',
      hostCardTitle: 'Ev Sahibi Kurum / İşletme',
      hostCardDesc: 'Avrupa\'da faaliyet gösteren; Türk ve AB meslek lisesi öğrencilerine staj ve beceri eğitimi, öğretmenlere işbaşı gözlem imkanı sağlayan işletmeler.',
      hostFeature1: '15 Kriterli Resmi Doğrulama Güvencesi',
      hostFeature2: 'Dönemlik Öğrenci Kapasite Yönetimi',
      hostFeature3: 'Akredite Okullarla Doğrudan Eşleşme',
      hostCardAction: 'Ev Sahibi Kaydına Başla',
      schoolSetupBadge: 'Okul / Gönderen Kurum Kurulumu',
      schoolUpdateBadge: 'Kurum Bilgilerini Güncelle',
      schoolFormTitle: 'Okul Profilinizi Tanımlayın',
      schoolEditTitle: 'Kurum Profilinizi Düzenleyin',
      schoolFormSubtitle: 'Erasmus+ KA121 / KA122 hareketlilik süreçlerinde kullanılmak üzere temel kurumsal bilgilerinizi giriniz.',
      changeRole: '← Rol Değiştir',
      cancel: 'Vazgeç',
      back: 'Geri Dön',
      completeAndReview: 'Kurulumu Tamamla ve Özet Gör',
      updateAndSave: 'Bilgileri Güncelle ve Kaydet',
      hostSetupBadge: 'Aşama 1: Temel Kurum Kurulumu',
      hostFormTitle: 'Ev Sahibi Kurum Profilinizi Tanımlayın',
      hostFormSubtitle: 'Kurumunuzun yasal kimliğini, Erasmus+ OID kodunu ve ana irtibat yetkilisini tanımlayarak sisteme hızlıca dahil olun.',
      hostSection1: '1. Kurum Kimliği ve Resmi Bilgiler',
      hostSection2: '2. Erasmus+ Kimliği ve Kurumsal İletişim',
      hostSection3: '3. Hareketlilik İrtibat Yetkilisi',
      publicConsentTitle: 'Kamusal Profilde İletişim Bilgilerinin Sergilenmesi Açık Rıza Onayı',
      publicConsentDesc: 'İrtibat yetkilisinin adı, unvanı ve kurumsal e-posta adresinin, hareketlilik planlayan okullar tarafından görülebilmesi için kurum profilimizde sergilenmesini onaylıyorum.',
      kycNotice: 'Vergi Numarası, Sicil Evrakları ve Katılımcı Kanıt Belgeleri sonraki aşamalarda Kurumsal Doğrulama panelinden yüklenecektir.',
      completeHostSetup: 'Kurulumu Tamamla ve Profili Aç',
    },
    simulation: {
      bannerTitle: 'Simülasyon Modu',
      viewingAsSchool: 'Okul / Gönderen Kurum Gözünden Bakıyorsunuz',
      viewingAsHost: 'Ev Sahibi Kurum (Host) Gözünden Bakıyorsunuz',
      switchToHost: 'Host Moduna Geç',
      switchToSchool: 'Okul Moduna Geç',
      backToAdmin: 'Yönetici Paneline Dön ✕',
    },
    resultsWidget: {
      title: '2026 Erasmus+ Hibe Sonuçları',
      subtitle: 'Ulusal Ajans KA121 ve KA122 onaylanan ve yedek proje analiz tablosu',
      badge: 'Resmi Liste',
      close: 'Kapat',
      searchPlaceholder: 'Kurum adı, şehir veya proje no...',
      allCities: 'Tüm Şehirler',
      allStatuses: 'Tüm Durumlar (Kabul & Yedek)',
      acceptedList: 'Sadece Kabul Listesi',
      reserveList: 'Sadece Yedek Listesi',
      grantRangeAll: 'Tüm Tutarlar',
      colRank: 'Sıra',
      colSchool: 'Kurum Bilgisi',
      colCity: 'Şehir',
      colGrant: 'Kabul Edilen Hibe (Euro)',
      colStatus: 'Durum',
      colProject: 'Proje No',
      kpiFiltered: 'Filtrelenen Kurum',
      kpiTotalGrant: 'Toplam Hibe Hacmi',
      kpiAvgGrant: 'Ortalama Proje Hibesi',
      kpiDistribution: 'Dağılım Durumu',
      institutionsCount: 'kurum',
      acceptedCountLabel: 'Asil',
      backupCountLabel: 'Yedek',
      tabKa121: 'KA121 Akreditasyon',
      tabKa122: 'KA122 Kısa Dönemli',
      filtersBtn: 'Filtreler',
      clearBtn: 'Temizle',
      cityLabel: 'Şehir',
      statusLabel: 'Başvuru Durumu',
      grantRangeLabel: 'Hibe Tutarı Aralığı',
      sortLabel: 'Sıralama Kriteri',
      sortDefault: 'Varsayılan (Resmi Sıra)',
      sortGrantDesc: 'Hibe Tutarı (En Yüksek)',
      sortGrantAsc: 'Hibe Tutarı (En Düşük)',
      sortNameAsc: 'Kurum Adı (A-Z)',
      sortNameDesc: 'Kurum Adı (Z-A)',
      sortCityAsc: 'Şehir (A-Z)',
      sortCityDesc: 'Şehir (Z-A)',
      sortProjectAsc: 'Proje No (A-Z)',
      sortProjectDesc: 'Proje No (Z-A)',
      noResultsTitle: 'Arama Kriterlerine Uygun Sonuç Bulunamadı',
      noResultsDesc: 'Farklı bir şehir, hibe aralığı veya anahtar kelime deneyebilir ya da filtreleri sıfırlayabilirsiniz.',
      resetFilters: 'Filtreleri Sıfırla',
      totalRecords: 'Toplam',
      recordsOf: 'kayıttan',
      showingRange: 'arası gösteriliyor',
      showingZero: '0 gösteriliyor',
      perPage: 'Sayfa Başına:',
      all: 'Tümü',
      prevPage: 'Önceki Sayfa',
      nextPage: 'Sonraki Sayfa',
    },
    guestBanner: {
      badge: 'Erasmus+ VET Hareketlilik Ag Gecidi',
      title: 'CAPPINNO Mobility Nexus\'a Hos Geldiniz!',
      desc: 'Mesleki egitim (VET) hareketliliklerinizi planlamak, ESCO beceri analizini yapmak ve Avrupa genelindeki dogrulanmis ev sahipleriyle eslesmek icin giris yapmadan tum araclari canli test edebilir veya ucretsiz kayit olabilirsiniz.',
      badge1: 'KA121 & KA122 Uyumlu',
      badge2: 'Giris Sarti Olmadan Simulasyon',
      badge3: 'ESCO & ISCED-F Taksonomisi',
      badge4: '15 Kriterli Guvenli Eslestirme',
      btnTour: 'Hizli Baslangic Rehberi (3 dk)',
      btnDemo: 'Demo Verisiyle Dene',
      btnRegister: 'Ucretsiz Kayit Ol',
      dismiss: 'Kapat',
    },
    inquiry: {
      sendInquiryBtn: 'Ev Sahibine Talep İlet',
      inquirySentBadge: 'Talep İletildi (Beklemede)',
      modalTitle: 'Ev Sahibi Kuruma Hareketlilik Talebi İlet',
      modalSubtitle: 'Mesleki eğitim hareketliliği için ev sahibi işletmeyle doğrudan kurumsal iletişim başlatın.',
      senderOrgTitle: 'Gönderen Kurum (Yararlanıcı)',
      targetHostTitle: 'Hedef Ev Sahibi İşletme (Partner)',
      mobilityDetailsTitle: 'Talep Edilen Hareketlilik Detayları',
      fieldLabel: 'Mesleki Alan & Bölüm',
      participantsLabel: 'Katılımcı Sayısı',
      durationLabel: 'Staj Süresi',
      datesLabel: 'Hedef Tarih Aralığı',
      logisticsLabel: 'Talep Edilen Lojistik Hizmetler',
      notesLabel: 'Kurumsal Not / Özel Talepleriniz',
      notesPlaceholder: 'Öğrencilerinizin yapacağı çalışmalar, atölye beklentileri ve staj hedeflerini kısaca belirtin...',
      cancelBtn: 'Vazgeç',
      submitBtn: '✉️ Talebi Host Kuruma İlet',
      successTitle: 'Hareketlilik Talebiniz Başarıyla İletildi!',
      successMessage: 'Talebiniz ev sahibi kurumun yönetim paneline düştü ve irtibat yetkilisine bildirim gönderildi. Ev sahibinin cevabını ve ön kabul mektubunu (LoI) bu panelden takip edebilirsiniz.',
      closeBtn: 'Kapat',
      hostSectionTitle: 'Gelen Hareketlilik Talepleri & Başvurular',
      hostSectionSubtitle: 'Türkiye ve Avrupa\'daki meslek liselerinden işletmenize iletilen staj ve işbaşı eğitim talepleri.',
      tabAll: 'Tüm Talepler',
      tabPending: 'Değerlendirme Bekleyenler',
      tabAccepted: 'Ön Kabul Verilenler (LoI)',
      tabDeclined: 'Reddedilen / Uygun Olmayanlar',
      acceptBtn: '✓ Ön Kabul Ver (Letter of Intent)',
      reviseBtn: '✏️ Tarih/Kapasite Revizyonu İste',
      declineBtn: '✕ Reddet / Uygun Değil',
      undoBtn: '↩️ Kararı Geri Al / İptal Et',
      editReplyBtn: '💬 Yanıtı Düzenle',
      viewDetailsBtn: '👁️ Okul Detaylarını Gör',
      replyModalTitle: 'Ev Sahibi Yanıtı & Gerekçe İlet',
      replyModalSubtitle: 'Gönderen kuruma iletilecek resmi hareketlilik kararınızı ve yanıt notunu belirleyin.',
      replyModalDecisionLabel: 'Karar Tercihi:',
      replyModalNoteLabel: 'Okula İletilecek Resmi Yanıt Notu *',
      replyModalPlaceholder: 'Ön kabul detaylarını, revizyon teklifinizi veya ret gerekçenizi buraya yazınız...',
      replyModalTemplatesLabel: 'Hazır Yanıt Şablonları (Tıklayarak Doldur):',
      replyModalSaveBtn: 'Kararı Kaydet & Okula İlet',
      templateAccept1: 'Ön kabul mektubu (Letter of Intent) onaylandı. Staj kontenjanı ayrıldı. İkili protokol için hazırız.',
      templateAccept2: 'Kurumumuz belirtilen tarihlerde işletme mentorluğu ve atölye imkanlarını sağlamaktan memnuniyet duyacaktır.',
      templateRevise1: 'Atölye yoğunluğu sebebiyle staj tarihlerinin 1 hafta kaydırılması önerilmektedir.',
      templateRevise2: 'Mevcut kontenjanımız doğrultusunda öğrenci sayısının en fazla 4 kişi olarak güncellenmesi rica olunur.',
      templateDecline1: 'Belirtilen dönemde atölye kapasitemizin dolu olması nedeniyle maalesef bu talebi kabul edememekteyiz.',
      templateDecline2: 'Talep edilen mesleki alanda bu dönem uygun eğitmen ve mentorluk desteği sağlanamamaktadır.',
      undoSuccessMsg: 'Karar geri alındı, talep beklemede durumuna getirildi.',
      statusPending: 'Değerlendirme Bekliyor',
      statusAccepted: 'Ön Kabul Verildi (LoI Hazır)',
      statusRevised: 'Revizyon İstendi',
      statusDeclined: 'Reddedildi / Uygun Değil',
      mockBadge: 'Simülasyon / Mock Okul',
      emptyInquiriesMsg: 'Bu kriterde henüz gelen hareketlilik talebi bulunmuyor.',
    },
    sentInquiries: {
      cardTitle: 'Gönderilen Hareketlilik Taleplerim & Başvuru Durumları',
      cardBadge: 'Giden Talep Havuzu',
      cardSubtitle: 'Avrupa genelindeki ev sahibi işletmelere ilettiğiniz staj ve işbaşı eğitim taleplerinizin canlı durum takibi.',
      tabAll: 'Tüm Taleplerim',
      tabPending: 'Değerlendirme Bekleyenler',
      tabAccepted: 'Ön Kabul Alındı (LoI Hazır)',
      tabRevised: 'Revizyon İstendi',
      tabDeclined: 'Reddedildi / Müsait Değil',
      viewLoIBtn: '📄 Ön Kabul Belgesini (LoI) Gör & Yazdır',
      withdrawBtn: '↩️ Talebi İptal Et / Geri Çek',
      withdrawConfirmMsg: 'Talebiniz başarıyla iptal edildi ve sistemden kaldırıldı.',
      findAlternativeBtn: '🔍 Yeni Ev Sahibi Ara',
      emptyTitle: 'Henüz Gönderilmiş Bir Hareketlilik Talebiniz Yok',
      emptyDesc: '3. Aşamada yer alan Eşleştirme Motorundan uygun bir Avrupa ev sahibi kuruluşu seçerek "Ev Sahibine Talep İlet" butonuna tıklayabilirsiniz.',
      emptyCtaBtn: '🚀 Ev Sahibi Eşleştirmeyi Başlat',
      viewSentInquiriesBtn: '📬 Gönderilen Taleplerimi İncele',
      demoSwitchNotice: 'Simülasyon / Demo Modu:',
      demoSwitchBtn: '🧪 Ev Sahibi Gözünden İncele →',
      sentDateLabel: 'Gönderim Tarihi:',
      targetHostLabel: 'Hedef Ev Sahibi Kurum:',
      logisticsLabel: 'Talep Edilen Lojistik:',
      schoolNoteLabel: 'İlettiğiniz Kurumsal Not:',
      hostResponseLabel: 'Ev Sahibi Resmi Yanıtı:',
      loiModalTitle: 'Erasmus+ VET Letter of Intent (Ön Kabul Belgesi)',
      loiModalSubtitle: 'Ev sahibi kuruluş tarafından onaylanmış ve staj kontenjanı ayrılmış resmi belge.',
    },
    guestOnboarding: {
      modalTitle: 'CAPPINNO Mobility Nexus • Hizli Baslangic Rehberi',
      stepIndicator: 'Asama',
      btnNext: 'Sonraki Asama',
      btnPrev: 'Onceki',
      btnComplete: 'Turu Tamamla',
      btnSkip: 'Gec ve Kapat',
      dontShowAgain: 'Bir daha otomatik gosterme',
      howItWorksBtn: 'Nasil Calisir?',
      guestNoticeBadge: 'Ziyaretci Modu',
      guestNoticeTitle: 'Kurum Bilgilerinizi Kaydedin',
      guestNoticeDesc: 'Giris yapmadan formu doldurabilir ve on hazirlik skorunuzu test edebilirsiniz. Bilgilerinizi kalici olarak kaydetmek ve resmi basvuru raporu olusturmak icin ucretsiz giris yapabilirsiniz.',
      guestNoticeBtn: 'Giris Yap / Kayit Ol',
      step1Tag: 'Platforma Genel Bakis',
      step1Title: 'Erasmus+ Mesleki Egitimde Yeni Nesil Dijital Altyapi',
      step1Desc: 'CAPPINNO Mobility Nexus, meslek liseleri ve Avrupali ev sahibi kurumlar arasindaki KA121 akreditasyonu ve KA122 kisa donemli hareketlilik sureclerini uctan uca dijitallestiren resmi karar ve eslestirme motorudur.',
      step1Point1Title: 'Resmi OID & Akreditasyon Uyumu',
      step1Point1Desc: 'Ulusal Ajans ve Avrupa Komisyonu standartlarinda kurum kodu (OID) dogrulamasi ve hazirlik skoru.',
      step1Point2Title: 'ESCO & ISCED-F Beceri Analizi',
      step1Point2Desc: 'Avrupa Beceri ve Yeterlilikler Taksonomisi ile 27 meslek alaninda canli yetkinlik acigi tespiti.',
      step1Point3Title: '33 Ulkede Guvenli Eslestirme',
      step1Point3Desc: '15 kriterli kurumsal dogrulamadan gecmis staj ve isbasi gozlem partnerleriyle dogrudan iletisim.',
      step2Tag: 'Kurumsal Rolunuz',
      step2Title: 'Platformda Hangi Rolle Yer Alacaksiniz?',
      step2Desc: 'Sistem hem Turkiye\'deki gonderen meslek liselerine hem de Avrupa\'daki ev sahibi isletmelere ozel fonksiyonlar sunar.',
      roleSchoolTitle: 'Okul / Gonderen Kurum',
      roleSchoolSubtitle: 'Meslek Liseleri, MEM ve Enstituler',
      roleSchoolDesc: 'Ogrenci ve ogretmenlerini Avrupa\'ya staj ve egitime gonderen kurumlar icin gelismis planlama araclari.',
      roleSchoolPoint1: 'Canli kurumsal hazirlik puani (%0 - %100)',
      roleSchoolPoint2: 'Otomatik ogrenme kazanimlari ve kalite kontrolu',
      roleSchoolPoint3: 'Kurum ici planlama ve hareketlilik tavsiye raporu',
      roleHostTitle: 'Avrupa Ev Sahibi (Host)',
      roleHostSubtitle: 'Isletmeler, Merkezler ve Partnerler',
      roleHostDesc: 'Avrupa\'da mesleki egitim ogrencilerine staj ve isbasi egitim imkani sunan isletme ve kuruluslar.',
      roleHostPoint1: 'Donemlik stajyer ve kontenjan kapasite yonetimi',
      roleHostPoint2: '15 kriterli KYC ile Dogrulanmis Partner rozeti',
      roleHostPoint3: 'Akredite okullarin arama sonuclarinda one cikma',
      step3Tag: '5 Asamali Dongu',
      step3Title: 'Akilli Erasmus+ Karar ve Eslestirme Motoru',
      step3Desc: 'Adim adim ilerleyerek basvurunuzu veya staj programinizi saniyeler icinde hazirlayin.',
      stage1Name: '1. Kurum & Katilimci',
      stage1Desc: 'Okul OID, Erasmus Plani hedefleri, ogrenci ve refakatci profili tanimlama.',
      stage2Name: '2. ESCO & Beceri Acigi',
      stage2Desc: 'Meslek alani, ISCED kodu ve 5 temel yeterlilik uzerinden yetkinlik testi.',
      stage3Name: '3. Ev Sahibi & Karar',
      stage3Desc: '8 faktorlu KA120 / KA121 / KA122 karar motoru ve partner eslestirme.',
      stage4Name: '4. Ogrenme Kazanimlari',
      stage4Desc: 'Bloom taksonomisine uygun teknik ve transversal ogrenme ciktilari.',
      stage5Name: '5. Planlama Raporu',
      stage5Desc: 'Kurum ici planlama ve hareketlilik tavsiye raporu ciktisi.',
      step4Tag: 'Hemen Baslayin',
      step4Title: 'Platformu Canli Deneyimleyin',
      step4Desc: 'Giris yapmadan tum yetenekleri demo verisiyle hemen test edebilir ya da ucretsiz hesap acarak kurumunuzu kaydedebilirsiniz.',
      freeBenefitTitle: 'Ucretsiz Hesapla Neler Kazanirsiniz?',
      freeBenefitDesc: 'Kurum verileriniz bulutta guvenle saklanir, OID eslesmeniz yapilir, planlama raporlarinizi dilediginiz an PDF/JSON olarak indirebilir ve paylasabilirsiniz.',
      btnDemoStart: 'Hazir Demo Verisiyle Basla',
      btnDemoStartSub: 'Giris yapmadan tum akisi 1 tikla canli gorun',
      btnSignUp: 'Ucretsiz Hesap Olustur',
      btnSignUpSub: 'Hemen baslayin, kurulum 1 dakika',
      btnSignIn: 'Zaten hesabiniz var mi? Giris Yapin',
      noticeNoCard: 'Kredi karti gerekmez • Tum temel Erasmus+ VET araclari ucretsizdir',
    },
  },
  en: {
    header: {
      title: 'CAPPINNO Mobility Nexus',
      subtitle: 'KA121-VET • KA122-VET • ESCO & ISCED-F • Competence Assessment • EU Host Matching',
      badge: 'EMaaS v1.0 • 2026',
      langToggle: 'Language',
      themeLabel: 'Color Theme',
      fontLabel: 'Typography',
      nav: {
        programmes: {
          label: 'Programmes',
          ka121: 'KA121-VET (Accredited)',
          ka121Desc: 'Annual grant allocation and Erasmus Plan strategic targets',
          ka122: 'KA122-VET (Short-term)',
          ka122Desc: 'For first-time applicants and non-accredited organizations',
          comparison: 'KA121 vs KA122 Comparison',
          comparisonDesc: 'Eligibility rules, grant limits, and quality standards',
        },
        beneficiaries: {
          label: 'Beneficiaries',
          meslekLiseleri: 'Vocational High Schools',
          meslekLiseleriDesc: '3,700+ VET high school open-data directory',
          halkEgitim: 'Public Education Centers',
          halkEgitimDesc: '1,002 official adult education centers and portals',
          olgunlasma: 'Traditional Arts Institutes',
          olgunlasmaDesc: '32 traditional crafts and design institutes',
          mem: 'Directorates of National Education',
          memDesc: '81 Provincial and District Directorates',
          osb: 'Organized Industrial Zones',
          osbDesc: 'Nationwide industrial zone directorates',
          ttso: 'Chambers of Commerce and Industry',
          ttsoDesc: 'TOBB affiliated chambers of commerce',
          esnaf: 'Chambers of Arts and Crafts',
          esnafDesc: 'TESK affiliated craftsmen associations',
        },
        opportunities: {
          label: 'Opportunities & Hosts',
          hostOrgs: 'Host Organisations Portfolio',
          hostOrgsDesc: 'Verified EU enterprises, VET providers and centres',
          internships: 'VET Internships & Job Shadowing',
          internshipsDesc: 'Internship capacities, sectors, and mentoring standards',
          becomePartner: 'Become a Host Partner',
          becomePartnerDesc: 'Fast-track registration for European hosts',
        },
        resources: {
          label: 'Resources',
          grantResults: '2026 Grant Allocations & Analysis',
          grantResultsDesc: 'Nationwide accredited institution grant statistics',
          mebAtlas: 'MEB Open Data Reference Directory',
          mebAtlasDesc: '81 provinces official educational institution catalog',
          legal: 'GDPR & Privacy Policy',
          legalDesc: 'EU General Data Protection Regulation compliance',
        },
        contact: {
          label: 'Contact',
          appointment: 'Book Appointment',
          appointmentDesc: 'Schedule an online consultation & orientation meeting',
        },
      },
      beneficiaries: {
        label: 'Beneficiaries',
        meslekLiseleri: 'Vocational High Schools',
        halkEgitim: 'Public Education Centers',
        olgunlasma: 'Institutes of Traditional Arts and Crafts',
        mem: 'Provincial and District Directorates of National Education',
        diger: 'Others',
        osb: 'Organized Industrial Zones',
        ttso: 'Chambers of Commerce and Industry',
        esnaf: 'Chambers of Arts and Crafts',
      },
    },
    tabs: {
      profile: { label: '1. Institution & Participant', desc: 'School & target profile' },
      competence: { label: '2. ESCO & Competence', desc: 'Taxonomy & assessment' },
      matching: { label: '3. Host & Decision', desc: 'Host matching & KA120/121/122' },
      outcomes: { label: '4. Outcomes & Quality', desc: 'Learning outcomes & OHS' },
      report: { label: '5. Planning Report', desc: 'Internal planning and recommendation report' },
    },
    nav: {
      prev: '← Previous Step',
      next: 'Next Step →',
      step: 'Step',
      complete: 'Update & Complete Report ✓',
    },
    system: {
      title: '1. System Architecture & EMaaS Workflow',
      badge: 'Platform Guide',
      step1Title: 'Institution & Participant Profile',
      step1Desc: 'Accreditation OID record, Erasmus Plan strategic goals, and participant language readiness.',
      step2Title: 'ESCO + ISCED-F Mapper',
      step2Desc: 'Automatic mapping of 12 VET sectors to ISCED-F codes and European ESCO occupational profiles.',
      step3Title: 'Competence & Decision Engine',
      step3Desc: '12-question competence assessment, gap calculation, and 8-factor KA121/KA122 decision engine.',
      step4Title: 'EU Host & Mobility Plan',
      step4Desc: '10-parameter weighted Host scoring, partner search funnel, and role-based learning outcomes.',
      disclaimer: 'Important Notice: This platform is designed for recommendation, matching, and planning in Erasmus+ KA121-VET and KA122-VET projects. Final eligibility, activity types, duration, budget, and application decisions must be verified against the official Erasmus+ Programme Guide and National Agency rules.',
    },
    school: {
      title: '2. Institution & School Profile',
      badgePrefix: 'Institution Readiness',
      nameLabel: 'VET School / Organization Legal Name *',
      namePlaceholder: 'E.g., Ankara Vocational and Technical High School',
      cityLabel: 'City / Region *',
      cityPlaceholder: 'E.g., Ankara',
      accLabel: 'Erasmus VET Accreditation Status',
      accUnknown: 'Unknown / Not Decided',
      accYes: 'Yes (Accredited Institution - KA121)',
      accNo: 'No (Short-term Mobility - KA122)',
      oidLabel: 'Erasmus Organisation ID (OID: E10XXXXXX)',
      planLabel: 'Erasmus Plan Strategic Objective (If Accredited)',
      planPlaceholder: 'E.g., Enhance staff and learner competence in Industry 4.0, PLC automation and robotics...',
      needLabel: 'Institutional Need / Concrete Challenge *',
      needPlaceholder: 'Describe concrete institutional needs, equipment/training gaps, and target performance improvements...',
      readinessTitle: 'Institutional Profile Completeness:',
      readyBadge: 'Ready',
      incompleteBadge: 'Incomplete',
    },
    participant: {
      title: '3. Participant & Mobility Profile',
      badge: 'Target Audience',
      typeLabel: 'Participant Type *',
      teacher: 'Vocational Teacher / Trainer (Staff)',
      student: 'VET Student / Apprentice (VET Learner)',
      goalLabel: 'Mobility Format / Activity Type',
      nameLabel: 'Participant Group / Code / Name',
      namePlaceholder: 'E.g., Automation Teachers or ID-2026-VET-01',
      langLabel: 'Working Language Readiness (0-100)',
      countryLabel: 'Preferred EU Destination Countries',
      countryPlaceholder: 'E.g., Germany / Netherlands / Spain',
      durationLabel: 'Planned Duration (Recommendation)',
      durationPlaceholder: 'E.g., 10 days (Staff) or 21 days (Learners)',
    },
    esco: {
      title: '4. ESCO – ISCED-F Mapper',
      badge: 'EU Taxonomy Standards',
      info: 'ISCED-F classifies educational fields, while ESCO supports occupational profiles, skills, and competences. In ESCO, occupations link to ISCO-08; verify exact concept URIs on the official portal.',
      fieldLabel: 'Select Vocational Field / Sector *',
      fieldDefault: '-- Select Field (12 VET Sectors) --',
      iscedCodeLabel: 'ISCED-F Code',
      iscedNameLabel: 'ISCED-F Field Name',
      escoTermLabel: 'Suggested ESCO Search Profile / Occupation Family',
      iscoLabel: 'ISCO-08 Code',
      escoUriLabel: 'ESCO Concept URI',
      skillsLabel: 'Priority ESCO Skills & Competences',
      verifyBtn: 'Verify in ESCO',
      escoPortalBtn: 'ESCO Portal',
      iscedGuideBtn: 'ISCED-F 2013 Guide',
    },
    assessment: {
      title: '5. Competence Assessment',
      badgeSuffix: 'Answered',
      desc: 'The 12-question self-assessment uses a 1 (Basic) to 5 (Expert) scale based on the CAPPINNO Competence4VET methodology.',
      scoreBtn: 'Calculate Score',
      fullTestBtn: 'Open Full Competence4VET Test',
    },
    gap: {
      title: 'Competence Gap Analysis',
      badge: 'Needs Analysis',
      quickScore: 'Assessment Score',
      targetLabel: 'Target Benchmark (0–100)',
      externalLabel: 'External Competence4VET Score (Optional)',
      applyBtn: 'Apply',
      disclaimer: 'Assessment results should not be used as the sole basis for exclusion; low scores identify pre-departure preparation and mentoring needs.',
    },
    eligibility: {
      title: '5. KA122-VET Pre-Application Mandatory Eligibility Gatekeeper',
      badge: 'Official Eligibility Gatekeeper',
      subtitle: 'Verifies accreditation status, participant cap (30 max), duration (6–18 months), and 36-month grant limits as per Erasmus+ VET Guide',
      accreditationLabel: 'Accreditation Status',
      participantCountLabel: 'Planned Participants (Max 30 for KA122)',
      durationLabel: 'Planned Project Duration (6–18 Months)',
      pastGrantsLabel: 'KA122 Grants in Past 36 Months (Max 3)',
      strategyLabel: 'Mobility Strategy & Vision',
      strategyAdHoc: 'Short-term / Single Project (KA122)',
      strategyRegular: 'Annual / Regular Mobility (KA120 Recommended)',
      checkButton: 'Verify Eligibility Criteria',
      resultEligibleTitle: 'Fully Eligible for KA122-VET',
      resultIneligibleTitle: 'Eligibility Violation Detected',
      resultKa120Title: 'KA120-VET Erasmus Accreditation Recommended',
      resultKa121Title: 'KA121-VET Annual Grant Allocation Should Be Used',
    },
    host: {
      title: '6. EU Host Organisation Matching & Scoring',
      badge: '10 Criteria & Smart Matching',
      modeLive: 'Smart EU Host Matching (Live Match)',
      modeManual: 'Manual Assessment (10 Criteria)',
      liveDesc: 'Instantly matches your school requirements, target countries, activities, and logistics against verified European host organisations.',
      runMatchBtn: 'Match Hosts by School Profile',
      matchingInProgress: 'Evaluating hosts against 10 mandatory eligibility criteria...',
      matchSuccessTitle: 'Matching Host Organisations',
      matchSuccessSub: 'Candidates passing all hard eligibility filters with two-tier scoring:',
      educationScoreLabel: 'Education & Placement Quality',
      logisticsScoreLabel: 'Logistics Support',
      compositeRank: 'Composite Match Score',
      selectHostBtn: 'Select Host & Apply to Gateway ✓',
      selectedBadge: 'Active Selected Host',
      hardFiltersPassed: 'Passed 10 Hard Eligibility Filters',
      disqualifiedTitle: 'Disqualified Host Organisations',
      disqualifiedSub: 'The following hosts were eliminated prior to scoring due to failing mandatory criteria:',
      dqReasonLabel: 'Disqualification Reason',
      capacityLabel: 'Term Capacity',
      activitiesLabel: 'Supported Activities',
      languagesLabel: 'Working Languages',
      noMatchesFound: 'No registered host fully matches the current criteria. Try expanding target countries or adjusting participant count.',
      nameLabel: 'Host Organisation Name *',
      countryLabel: 'Country *',
      typeLabel: 'Host Type',
      criteriaTitle: 'Host Assessment Criteria (0–100 Points)',
      totalWeight: 'Total: 100%',
      scoreBtn: 'Calculate Host Score',
      calculatedScore: 'Calculated Score:',
    },
    decision: {
      title: '7. KA120 / KA121 / KA122 Decision Engine',
      badge: '8-Factor Decision Model',
      calcBtn: 'Run Decision Engine (KA120 / KA121 / KA122)',
      proposedPath: 'Recommended Erasmus+ Action Pathway:',
      scoreLabel: 'Mobility Suitability Score:',
      rationaleTitle: 'Decision Rationale:',
      emptyText: 'Click the button above to calculate the most suitable Erasmus+ mobility pathway.',
    },
    partners: {
      title: '8. EU Partner & Host Finding Gateway',
      badge: 'Official Portals & Search Funnel',
      funnelTitle: 'Recommended 5-Step Partner Search Funnel',
      stageCol: 'Step',
      sourceCol: 'Platform',
      queryCol: 'Search Strategy',
      outputCol: 'Target Output',
    },
    outcomes: {
      title: '9. Learning Outcomes Generator',
      badge: 'Role-Based Dynamic Generation',
      gapLabel: 'Primary Competence Gap',
      technicalLabel: 'Expected Technical Learning Outcome (Hard Skills)',
      transversalLabel: 'Transversal / Green / Digital & Language Outcome (Soft Skills)',
      generateBtn: 'Generate Sample Learning Outcomes',
    },
    quality: {
      title: '10. Quality & Responsibility Matrix',
      badge: 'Erasmus Quality Standards',
      stageCol: 'Process / Area',
      sendingCol: 'Sending Institution (Beneficiary)',
      hostCol: 'Host Organisation (EU Partner)',
      disclaimer: 'Core Project Principle: Core project tasks (participant selection, budget management, NA reporting) must remain with the beneficiary. Supporting partner organizations only provide practical facilitation.',
    },
    report: {
      title: '11. Internal Planning and Recommendation Report – Not an Erasmus+ Application Form',
      badge: 'Internal Planning Report',
      refreshBtn: 'Update Report',
      printBtn: 'Print / PDF',
      saveBtn: 'Save to Browser',
      loadBtn: 'Load Saved Record',
      exportBtn: 'Export JSON',
      dossierTitle: 'Internal Planning and Recommendation Report – Not an Erasmus+ Application Form',
      dossierSub: 'CAPPINNO Mobility Nexus • 2026 Projects: Implementation Phase • 2027 Call: Awaiting Official Announcement',
      legalDisclaimer: 'Important Note: This document is an internal strategic planning and recommendation report. It is not an official Erasmus+ application form. Official project submissions must be completed directly by the institution via the European Commission and National Agency application portals.',
      sendingOrg: 'Sending Institution (VET)',
      oid: 'OID Code',
      participant: 'Participant Profile',
      proposedAction: 'Proposed Action',
      vetField: 'VET Field & Sector',
      iscedCode: 'ISCED-F Code',
      escoProfile: 'ESCO Search Profile',
      conceptUri: 'ISCO / Concept URI',
      compScore: 'Competence Score',
      suitability: 'Mobility Suitability',
      hostOrg: 'Host Organisation (EU Partner)',
      hostScore: 'Host Quality Score',
      formatDuration: 'Mobility Format & Duration',
      needsAlignment: 'Institutional Needs & Erasmus Plan Alignment',
      erasmusPlan: 'Erasmus Plan:',
      escoSkills: 'Priority ESCO Skills',
      expectedOutcomes: 'Expected Learning Outcomes',
      techOutcomes: 'Technical Outcome:',
      transOutcomes: 'Transversal Outcome:',
      decisionSummary: 'Conclusion & Recommendations',
      emptyText: 'Fill in the institution, assessment, and host sections, then click "Update Report".',
      savedAlert: 'All form data and evaluation metrics saved to browser storage.',
      loadedAlert: 'Saved profile data loaded successfully.',
      notFoundAlert: 'No saved profile data found in browser storage.',
    },
    official: {
      title: '12. Official Resources & Legal Framework',
      badge: 'Regulatory Framework',
      info: 'KA121-VET relies on annual budget allocations tied to the approved Erasmus Plan for accredited bodies. KA122-VET short-term projects require justification across background, needs/challenges, objectives, activities, and impact.',
      disclaimer: 'Assessment Disclaimer: Competence scores and mobility suitability metrics are advisory and intended for planning purposes. They must not be used as the sole basis for exclusion, selection, or formal grading.',
    },
    footer: {
      subtitle: 'Intelligent matching, ESCO-ISCED taxonomy classification, competence assessment, and audit trail platform for Erasmus+ KA121-VET & KA122-VET.',
      copyright: '© 2026 CAPPINNO • Enterprise Multi-tenant SaaS Platform',
    },
    legal: {
      title: 'GDPR Privacy Policy',
      termsTitle: 'Terms of Use',
      cookiesTitle: 'Cookie Policy',
      retentionTitle: 'Data Retention & Disposal',
      cookiePreferences: 'Cookie Preferences',
      close: 'Close',
      savePreferences: 'Save My Choices',
      acceptAll: 'Accept All',
      rejectAll: 'Reject All (Except Necessary)',
      consentCheckbox: 'I have read and agree to the GDPR Data Protection & Privacy Policy.',
    },
    profile: {
      title: 'User Profile & Account Details',
      subtitle: 'Your personal information, institutional role, and associated organization status.',
      personalInfo: 'Personal Account Information',
      fullName: 'Full Name',
      email: 'Email Address',
      role: 'Access Level',
      roleAdmin: '🛡️ Platform Administrator',
      roleSchool: '🏛️ School / Sending Institution Admin',
      roleHost: '🏢 Host Organization Representative',
      roleMember: '👤 Team Member',
      institutionInfo: 'Associated Institution Details',
      noInstitution: 'You do not have a registered institution yet.',
      createInstitution: 'Complete Organization Onboarding →',
      readinessScore: 'Erasmus+ Readiness Score',
      verificationStatus: 'Verification Status',
      signOut: 'Sign Out',
      backHome: '← Back to Home',
    },
    adminDashboard: {
      badge: 'Platform Administrator Control Center',
      title: 'Admin Dashboard & Role Simulation',
      subtitle: 'Switch views below to inspect and test the platform from different user perspectives in real-time.',
      viewAdmin: 'Admin View',
      viewSchool: 'View as School',
      viewHost: 'View as Host',
      pendingDocs: 'Pending Verification Documents',
      pendingSubtitle: 'Corporate registry and KYC credentials waiting for review',
      verifiedHosts: 'Verified Host Organisations',
      verifiedSubtitle: 'Vetted European host enterprises and centres',
      beneficiariesCatalog: 'Beneficiaries Reference Directory (4,800+)',
      beneficiariesSubtitle: 'Comprehensive directory of VET high schools, adult centres, and directorates',
      openQueue: 'Open Verification Queue',
      quickReview: 'Quick Actions & Document Pool',
      recentRequests: 'Recent Verification Submissions',
      underReview: 'Under Review',
      verified: 'Verified',
      pending: 'Pending',
      needsRevision: 'Revision Required',
      exploreCatalog: 'Browse Catalog',
    },
    hostDashboard: {
      portalBadge: 'Host Organisation Portal',
      verifiedBadge: 'Verified Partner Badge Active',
      underReviewBadge: 'Documents Under Review',
      needsUpdateBadge: 'Revision Requested on Documents',
      pendingBadge: 'Pending Verification',
      simulatedBadge: 'Admin Simulation',
      completenessTitle: 'Institutional Profile Completeness',
      completenessDesc: 'As you complete your portfolio and upload KYC documents, you will rank higher in sending schools\' search results.',
      stage2Badge: 'Stage 2: Showcase & Portfolio',
      stage2Title: 'Add Erasmus+ Portfolio & Sample Programmes',
      stage2Desc: 'Add sample mobility tracks, description, logo, LinkedIn, and past Turkish partnership experience to help schools discover you.',
      stage2Btn: '🎨 Edit Portfolio (75-80% Complete)',
      stage3Badge: 'Stage 3: Corporate Verification / KYC',
      stage3Title: 'Institutional Verification & Badge Application',
      stage3Desc: 'Upload company registration, tax certificate, 24/7 emergency contact, and past participant proof to obtain the "Verified Partner" badge.',
      stage3Btn: '🛡️ Manage Verification Documents (Admin Only)',
      locationCountry: 'Location & Country',
      orgTypeSector: 'Organisation Type & Sector',
      sectorCapacity: 'Sector & Capacity',
      activitiesLanguages: 'Activity Formats & Languages',
      contactConsent: 'Public Profile Visibility Approved',
      contactPerson: 'Contact Person & Consent',
      viewAdminQueue: 'View Admin Verification Pool',
      backToHome: 'Return to Platform Home',
    },
    onboarding: {
      roleSelectBadge: 'Erasmus+ Mobility Portal',
      roleSelectTitle: 'Select Your Institutional Profile',
      roleSelectSubtitle: 'Select the institutional role that matches your scope of activity on the platform to start onboarding.',
      adminBadge: 'Platform Administrator Access',
      adminTitle: 'Logged in as System Administrator',
      adminDesc: 'Institution registration is not mandatory for admins. You can inspect and manage the verification queue directly.',
      adminQueueBtn: 'Admin Verification Queue',
      goToHomeBtn: 'Go to Main Platform',
      schoolCardBadge: 'Learner & Staff Sending',
      schoolCardTitle: 'School / Sending Institution',
      schoolCardDesc: 'Vocational high schools and institutes sending VET learners and staff to Europe under KA121 accreditation or KA122 short-term projects.',
      schoolFeature1: 'Official Erasmus OID & Accreditation Linkage',
      schoolFeature2: 'Live Institutional Readiness Scoring',
      schoolFeature3: 'ESCO / ISCED-F Taxonomy Alignment',
      schoolCardAction: 'Start School Setup',
      hostCardBadge: 'European Internship & Host Provider',
      hostCardTitle: 'Host Organisation / Enterprise',
      hostCardDesc: 'Enterprises in Europe offering vocational internships, apprentice placements, and teacher job shadowing to Turkish and EU VET participants.',
      hostFeature1: '15-Point Rigorous KYC Verification',
      hostFeature2: 'Term-Based Learner Capacity Management',
      hostFeature3: 'Direct Matching with Accredited Schools',
      hostCardAction: 'Start Host Registration',
      schoolSetupBadge: 'School / Sending Setup',
      schoolUpdateBadge: 'Update School Profile',
      schoolFormTitle: 'Define Your School Profile',
      schoolEditTitle: 'Edit Institutional Profile',
      schoolFormSubtitle: 'Enter your core institutional details for Erasmus+ KA121 / KA122 mobility preparation.',
      changeRole: '← Change Role',
      cancel: 'Cancel',
      back: 'Go Back',
      completeAndReview: 'Complete Setup & View Summary',
      updateAndSave: 'Update & Save Changes',
      hostSetupBadge: 'Stage 1: Basic Organisation Setup',
      hostFormTitle: 'Define Your Host Organisation Profile',
      hostFormSubtitle: 'Define your legal identity, Erasmus+ OID, and primary mobility contact to join the verified network.',
      hostSection1: '1. Legal Identity & Official Data',
      hostSection2: '2. Erasmus+ ID & Institutional Contact',
      hostSection3: '3. Primary Mobility Contact Person',
      publicConsentTitle: 'Public Contact Details Display Consent',
      publicConsentDesc: 'I authorize the public display of the primary contact person\'s name, title, and institutional email on our profile for mobility coordinators.',
      kycNotice: 'Tax certificates, commercial registry excerpts, and participant proofs will be uploaded in later stages via the Institutional Verification panel.',
      completeHostSetup: 'Complete Setup & Launch Profile',
    },
    simulation: {
      bannerTitle: 'Simulation Mode',
      viewingAsSchool: 'Viewing as School / Sending Institution',
      viewingAsHost: 'Viewing as Host Organisation',
      switchToHost: 'Switch to Host View',
      switchToSchool: 'Switch to School View',
      backToAdmin: 'Return to Admin Panel ✕',
    },
    resultsWidget: {
      title: '2026 Erasmus+ Grant Results',
      subtitle: 'National Agency KA121 & KA122 awarded and reserve project analytics table',
      badge: 'Official List',
      close: 'Close',
      searchPlaceholder: 'Institution name, city or project code...',
      allCities: 'All Cities',
      allStatuses: 'All Results (Awarded & Reserve)',
      acceptedList: 'Awarded Only',
      reserveList: 'Reserve Only',
      grantRangeAll: 'All Amounts',
      colRank: 'Rank',
      colSchool: 'Institution Details',
      colCity: 'City',
      colGrant: 'Awarded Grant (EUR)',
      colStatus: 'Status',
      colProject: 'Project Code',
      kpiFiltered: 'Filtered Institutions',
      kpiTotalGrant: 'Total Grant Volume',
      kpiAvgGrant: 'Average Project Grant',
      kpiDistribution: 'Distribution Status',
      institutionsCount: 'institutions',
      acceptedCountLabel: 'Awarded',
      backupCountLabel: 'Reserve',
      tabKa121: 'KA121 Accreditation',
      tabKa122: 'KA122 Short-term',
      filtersBtn: 'Filters',
      clearBtn: 'Clear',
      cityLabel: 'City',
      statusLabel: 'Application Status',
      grantRangeLabel: 'Grant Amount Range',
      sortLabel: 'Sort Criteria',
      sortDefault: 'Default (Official Order)',
      sortGrantDesc: 'Grant Amount (Highest)',
      sortGrantAsc: 'Grant Amount (Lowest)',
      sortNameAsc: 'Institution Name (A-Z)',
      sortNameDesc: 'Institution Name (Z-A)',
      sortCityAsc: 'City (A-Z)',
      sortCityDesc: 'City (Z-A)',
      sortProjectAsc: 'Project Code (A-Z)',
      sortProjectDesc: 'Project Code (Z-A)',
      noResultsTitle: 'No Matching Results Found',
      noResultsDesc: 'You can try a different city, grant range, keyword, or reset active filters.',
      resetFilters: 'Reset Filters',
      totalRecords: 'Total',
      recordsOf: 'records,',
      showingRange: 'showing',
      showingZero: '0 showing',
      perPage: 'Per Page:',
      all: 'All',
      prevPage: 'Previous Page',
      nextPage: 'Next Page',
    },
    guestBanner: {
      badge: 'Erasmus+ VET Mobility Gateway',
      title: 'Welcome to CAPPINNO Mobility Nexus!',
      desc: 'Plan your vocational education (VET) mobilities, perform ESCO competence gap analysis, and match with verified European hosts. Test all tools live without signing in or create a free account.',
      badge1: 'KA121 & KA122 Aligned',
      badge2: 'Live Simulation Without Login',
      badge3: 'ESCO & ISCED-F Taxonomy',
      badge4: '15-Factor Verified Matching',
      btnTour: 'Quick Start Guide (3 min)',
      btnDemo: 'Try with Demo Data',
      btnRegister: 'Create Free Account',
      dismiss: 'Dismiss',
    },
    inquiry: {
      sendInquiryBtn: 'Send Mobility Inquiry',
      inquirySentBadge: 'Inquiry Sent (Pending)',
      modalTitle: 'Send Mobility Inquiry to Host',
      modalSubtitle: 'Initiate direct institutional communication with the hosting enterprise for VET mobility.',
      senderOrgTitle: 'Sending Institution (Beneficiary)',
      targetHostTitle: 'Target Host Enterprise (Partner)',
      mobilityDetailsTitle: 'Requested Mobility Parameters',
      fieldLabel: 'VET Field & Sector',
      participantsLabel: 'Learner Count',
      durationLabel: 'Internship Duration',
      datesLabel: 'Target Date Window',
      logisticsLabel: 'Requested Logistics Services',
      notesLabel: 'Institutional Note / Special Requests',
      notesPlaceholder: 'Briefly outline expected student tasks, workshop requirements, and internship objectives...',
      cancelBtn: 'Cancel',
      submitBtn: '✉️ Submit Inquiry to Host',
      successTitle: 'Mobility Inquiry Successfully Sent!',
      successMessage: 'Your inquiry has been delivered to the host organisation dashboard and a notification was sent to their contact person.',
      closeBtn: 'Close',
      hostSectionTitle: 'Incoming Mobility Inquiries',
      hostSectionSubtitle: 'Vocational internship and job-shadowing placement requests submitted by partner schools.',
      tabAll: 'All Inquiries',
      tabPending: 'Under Review',
      tabAccepted: 'Accepted (LoI Issued)',
      tabDeclined: 'Declined / Unavailable',
      acceptBtn: '✓ Issue Letter of Intent (LoI)',
      reviseBtn: '✏️ Request Date/Capacity Revision',
      declineBtn: '✕ Decline / Unavailable',
      undoBtn: '↩️ Revert Decision / Undo',
      editReplyBtn: '💬 Edit Reply Note',
      viewDetailsBtn: '👁️ View School Profile',
      replyModalTitle: 'Send Host Decision & Official Reply',
      replyModalSubtitle: 'Formulate your formal institutional reply and placement decision for the sending school.',
      replyModalDecisionLabel: 'Decision Type:',
      replyModalNoteLabel: 'Official Response Note to School *',
      replyModalPlaceholder: 'Enter your acceptance details, revision request, or decline reason here...',
      replyModalTemplatesLabel: 'Quick Response Templates (Click to apply):',
      replyModalSaveBtn: 'Save Decision & Send to School',
      templateAccept1: 'Letter of Intent (LoI) approved. Placement capacity confirmed for the requested period.',
      templateAccept2: 'Our enterprise is pleased to provide vocational workshop mentoring and practical placement.',
      templateRevise1: 'Date adjustment requested due to high workshop volume. Suggest shifting by 1 week.',
      templateRevise2: 'Due to current mentor capacity, we propose adjusting the learner group size to a maximum of 4.',
      templateDecline1: 'Unfortunately, our workshop capacity is fully booked during the requested dates.',
      templateDecline2: 'We are unable to provide mentor support for this specific occupational profile during this term.',
      undoSuccessMsg: 'Decision reverted. Inquiry returned to pending review.',
      statusPending: 'Under Review',
      statusAccepted: 'Accepted (LoI Ready)',
      statusRevised: 'Revision Requested',
      statusDeclined: 'Declined / Unavailable',
      mockBadge: 'Simulation / Mock School',
      emptyInquiriesMsg: 'No incoming mobility inquiries found in this view.',
    },
    sentInquiries: {
      cardTitle: 'My Sent Mobility Inquiries & Application Status',
      cardBadge: 'Sent Inquiries Pool',
      cardSubtitle: 'Live tracking of your vocational internship and job-shadowing requests sent to European host enterprises.',
      tabAll: 'All My Inquiries',
      tabPending: 'Under Review',
      tabAccepted: 'Accepted (LoI Ready)',
      tabRevised: 'Revision Requested',
      tabDeclined: 'Declined / Unavailable',
      viewLoIBtn: '📄 View Acceptance Letter (LoI) & Print',
      withdrawBtn: '↩️ Withdraw / Cancel Inquiry',
      withdrawConfirmMsg: 'Your inquiry has been successfully withdrawn.',
      findAlternativeBtn: '🔍 Find Alternative Host',
      emptyTitle: 'No Mobility Inquiries Sent Yet',
      emptyDesc: 'Select a suitable European host organisation in Stage 3 Matching Engine and click "Send Mobility Inquiry" to get started.',
      emptyCtaBtn: '🚀 Launch Host Matching',
      viewSentInquiriesBtn: '📬 View My Sent Inquiries',
      demoSwitchNotice: 'Simulation / Demo Mode:',
      demoSwitchBtn: '🧪 View from Host Perspective →',
      sentDateLabel: 'Sent Date:',
      targetHostLabel: 'Target Host Organisation:',
      logisticsLabel: 'Requested Logistics:',
      schoolNoteLabel: 'Your Institutional Note:',
      hostResponseLabel: 'Official Host Reply:',
      loiModalTitle: 'Erasmus+ VET Letter of Intent (LoI)',
      loiModalSubtitle: 'Official placement confirmation and capacity allocation issued by the host enterprise.',
    },
    guestOnboarding: {
      modalTitle: 'CAPPINNO Mobility Nexus • Quick Start Guide',
      stepIndicator: 'Stage',
      btnNext: 'Next Stage',
      btnPrev: 'Previous',
      btnComplete: 'Complete Tour',
      btnSkip: 'Skip & Close',
      dontShowAgain: 'Do not show automatically again',
      howItWorksBtn: 'How It Works?',
      guestNoticeBadge: 'Guest Mode',
      guestNoticeTitle: 'Save Your Institutional Profile',
      guestNoticeDesc: 'You can fill out the form and test your readiness score without logging in. Sign in for free to permanently save your records and export planning reports.',
      guestNoticeBtn: 'Sign In / Sign Up',
      step1Tag: 'Platform Overview',
      step1Title: 'Next-Generation Digital Infrastructure for Erasmus+ VET',
      step1Desc: 'CAPPINNO Mobility Nexus is the official decision and matching gateway digitizing KA121 accreditation and KA122 short-term mobilities between vocational schools and European host enterprises end-to-end.',
      step1Point1Title: 'Official OID & Accreditation Compliance',
      step1Point1Desc: 'Organisation ID (OID) verification and institutional readiness scoring compliant with National Agency standards.',
      step1Point2Title: 'ESCO & ISCED-F Competence Analysis',
      step1Point2Desc: 'Live skill gap detection across 27 vocational fields powered by the European Skills and Qualifications Taxonomy.',
      step1Point3Title: 'Verified Matching Across 33 Countries',
      step1Point3Desc: 'Direct contact with internship and job shadowing providers vetted through a 15-point institutional verification framework.',
      step2Tag: 'Your Institutional Role',
      step2Title: 'Which Role Fits Your Organisation?',
      step2Desc: 'The system offers dedicated workflows for both sending vocational schools and European host organisations.',
      roleSchoolTitle: 'School / Sending Institution',
      roleSchoolSubtitle: 'VET Schools, Directorates & Institutes',
      roleSchoolDesc: 'Advanced planning tools for institutions sending learners and staff to Europe for traineeships and courses.',
      roleSchoolPoint1: 'Live readiness scoring (0% to 100%)',
      roleSchoolPoint2: 'Automated learning outcomes and quality checks',
      roleSchoolPoint3: 'Internal planning and recommendation report export',
      roleHostTitle: 'European Host Organisation',
      roleHostSubtitle: 'Enterprises, VET Centres & Consortia',
      roleHostDesc: 'Organisations providing traineeships and job shadowing opportunities for vocational learners and staff.',
      roleHostPoint1: 'Term-based trainee and capacity quota management',
      roleHostPoint2: 'Verified Partner badge via 15-point KYC audit',
      roleHostPoint3: 'Top visibility in accredited school search results',
      step3Tag: '5-Stage Workflow',
      step3Title: 'Smart Erasmus+ Decision & Matching Engine',
      step3Desc: 'Follow the streamlined 5-stage pipeline to prepare your mobility application in minutes.',
      stage1Name: '1. Institution & Profile',
      stage1Desc: 'Define school OID, Erasmus Plan targets, learners, and accompanying staff.',
      stage2Name: '2. ESCO & Skill Gap',
      stage2Desc: 'Select field, ISCED-F code, and run 5-core competence diagnostics.',
      stage3Name: '3. Host & Decision Engine',
      stage3Desc: '8-factor KA120/KA121/KA122 decision matrix and verified host matching.',
      stage4Name: '4. Outcomes & Quality',
      stage4Desc: 'Bloom-aligned technical and transversal learning outcomes with OHS checklist.',
      stage5Name: '5. Planning Report',
      stage5Desc: 'Comprehensive internal planning and mobility recommendation report.',
      step4Tag: 'Ready to Start',
      step4Title: 'Experience the Platform Live',
      step4Desc: 'Test all features right away with rich demo data or create a free account to register your institution.',
      freeBenefitTitle: 'What Do You Get with a Free Account?',
      freeBenefitDesc: 'Cloud synchronization, verified OID profile, unlimited PDF/JSON report exports, and verified host applications.',
      btnDemoStart: 'Start with Demo Data',
      btnDemoStartSub: 'See the full 5-stage pipeline live in 1 click',
      btnSignUp: 'Create Free Account',
      btnSignUpSub: 'Get started in under 1 minute',
      btnSignIn: 'Already have an account? Sign In',
      noticeNoCard: 'No credit card required • All core Erasmus+ VET tools are free',
    },
  },
};

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('tr');

  useEffect(() => {
    const saved = localStorage.getItem('cappinno_locale');
    if (saved === 'tr' || saved === 'en') {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('cappinno_locale', newLocale);
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t: TRANSLATIONS[locale],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
