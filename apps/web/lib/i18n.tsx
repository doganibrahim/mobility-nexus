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
    },
    tabs: {
      profile: { label: '1. Kurum & Katılımcı', desc: 'Okul ve hedef profil' },
      competence: { label: '2. ESCO & Yetkinlik', desc: 'Taksonomi ve değerlendirme' },
      matching: { label: '3. Karar & Host', desc: 'KA121/122 ve eşleştirme' },
      outcomes: { label: '4. Kazanımlar & Kalite', desc: 'Öğrenme çıktıları ve İSG' },
      report: { label: '5. Rapor & Dosya', desc: 'Başvuru tavsiye dosyası' },
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
    decision: {
      title: '6. KA121-VET / KA122-VET Karar Motoru',
      badge: '8 Faktörlü Karar Modeli',
      calcBtn: 'KA121 / KA122 Kararını ve Uygunluk Skorunu Hesapla',
      proposedPath: 'Önerilen Erasmus+ Başvuru Yolu:',
      scoreLabel: 'Hareketlilik Uygunluk Skoru:',
      rationaleTitle: 'Karar Gerekçesi:',
      emptyText: 'Karar üretmek için yukarıdaki "Kararını Hesapla" butonuna tıklayınız.',
    },
    host: {
      title: '7. AB Ev Sahibi Kuruluş (Host) Eşleştirme & Skorlama',
      badge: '10 Ağırlıklı Kriter',
      nameLabel: 'Host Kuruluş Adı *',
      countryLabel: 'Ülke *',
      typeLabel: 'Host Türü',
      criteriaTitle: 'Kurum Değerlendirme Kriterleri (0–100 Puan)',
      totalWeight: 'Toplam Ağırlık: %100',
      scoreBtn: 'Ev Sahibi Skorunu Hesapla',
      calculatedScore: 'Hesaplanan Skor:',
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
      title: '11. Erasmus+ Hareketlilik Tavsiye Dosyası (Recommendation Dossier)',
      badge: 'Resmi Rapor',
      refreshBtn: 'Raporu Güncelle',
      printBtn: 'PDF / Yazdır',
      saveBtn: 'Tarayıcıya Kaydet',
      loadBtn: 'Kaydı Yükle',
      exportBtn: 'JSON İndir',
      dossierTitle: 'AB Mesleki Eğitim Hareketliliği Tavsiye ve Planlama Dosyası',
      dossierSub: 'CAPPINNO Mobility Nexus • Erasmus+ 2026 Çağrı Dönemi',
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
  },
  en: {
    header: {
      title: 'CAPPINNO Mobility Nexus',
      subtitle: 'KA121-VET • KA122-VET • ESCO & ISCED-F • Competence Assessment • EU Host Matching',
      badge: 'EMaaS v1.0 • 2026',
      langToggle: 'Language',
      themeLabel: 'Color Theme',
      fontLabel: 'Typography',
    },
    tabs: {
      profile: { label: '1. Institution & Participant', desc: 'School & target profile' },
      competence: { label: '2. ESCO & Competence', desc: 'Taxonomy & assessment' },
      matching: { label: '3. Decision & Host', desc: 'KA121/122 & matching' },
      outcomes: { label: '4. Outcomes & Quality', desc: 'Learning outcomes & OHS' },
      report: { label: '5. Report & Dossier', desc: 'Application recommendation' },
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
    decision: {
      title: '6. KA121-VET / KA122-VET Decision Engine',
      badge: '8-Factor Decision Model',
      calcBtn: 'Calculate KA121/KA122 Decision & Suitability Score',
      proposedPath: 'Recommended Erasmus+ Action:',
      scoreLabel: 'Mobility Suitability Score:',
      rationaleTitle: 'Decision Rationale:',
      emptyText: 'Click "Calculate Decision" above to generate recommendation.',
    },
    host: {
      title: '7. EU Host Organisation Matching & Scoring',
      badge: '10 Weighted Criteria',
      nameLabel: 'Host Organisation Name *',
      countryLabel: 'Country *',
      typeLabel: 'Host Type',
      criteriaTitle: 'Host Assessment Criteria (0–100 Points)',
      totalWeight: 'Total: 100%',
      scoreBtn: 'Calculate Host Score',
      calculatedScore: 'Calculated Score:',
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
      title: '11. Erasmus+ Mobility Recommendation Dossier',
      badge: 'Official Report',
      refreshBtn: 'Update Report',
      printBtn: 'Print / PDF',
      saveBtn: 'Save to Browser',
      loadBtn: 'Load Saved Record',
      exportBtn: 'Export JSON',
      dossierTitle: 'EU VET Mobility Recommendation & Planning Dossier',
      dossierSub: 'CAPPINNO Mobility Nexus • Erasmus+ 2026 Call Cycle',
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
