// Comprehensive platform guide dataset extracted faithfully from docs/erasmus_mobility.json
// Covers full end-to-end workflows for Schools, European Hosts, Platform Architecture, and Regulatory FAQ.

export type GuideAudience = 'SCHOOL' | 'HOST' | 'ADMIN' | 'ARCHITECTURE' | 'SETTINGS' | 'FAQ';

export interface GuideStepAction {
  stepNumber: number;
  titleTr: string;
  titleEn: string;
  actionTr: string;
  actionEn: string;
  uiTargetTr: string;
  uiTargetEn: string;
  expectedStateTr?: string;
  expectedStateEn?: string;
  expertTipTr?: string;
  expertTipEn?: string;
  badge?: string;
}

export interface GuideTopic {
  id: string;
  audience: GuideAudience;
  icon: string;
  titleTr: string;
  titleEn: string;
  summaryTr: string;
  summaryEn: string;
  goalTr: string;
  goalEn: string;
  route?: string;
  routeLabelTr?: string;
  routeLabelEn?: string;
  demoRole?: 'SCHOOL' | 'HOST';
  keyHighlightsTr?: string[];
  keyHighlightsEn?: string[];
  parametersTable?: {
    labelTr: string;
    labelEn: string;
    valueTr: string;
    valueEn: string;
  }[];
  steps: GuideStepAction[];
}

export interface GuideCategory {
  id: GuideAudience;
  labelTr: string;
  labelEn: string;
  icon: string;
  badgeTr: string;
  badgeEn: string;
  descriptionTr: string;
  descriptionEn: string;
  topics: GuideTopic[];
}

export const PLATFORM_GUIDE_DATA: GuideCategory[] = [
  {
    id: 'SCHOOL',
    labelTr: 'Hizmet Alıcı (Meslek Lisesi / VET Okulu)',
    labelEn: 'Service Beneficiary (Vocational School / VET)',
    icon: '🏛️',
    badgeTr: 'Okul Müdürleri, Koordinatörler ve Proje Ekipleri',
    badgeEn: 'Principals, Coordinators & VET Project Teams',
    descriptionTr: 'Mesleki ve Teknik Anadolu Liseleri, Mesleki Eğitim Merkezleri ve konsorsiyum koordinatörleri için OID kurulumundan 5 adımlı hareketlilik pipeline\'ına, host eşleştirmeden resmi KA121/KA122 web başvuru taslağına kadar tam süreç rehberi.',
    descriptionEn: 'End-to-end operational handbook covering OID setup, the 5-step mobility pipeline, European host matching, and official KA121/KA122 application draft preparation.',
    topics: [
      {
        id: 'school-onboarding',
        audience: 'SCHOOL',
        icon: '📋',
        titleTr: '1. Kurumsal Onboarding & OID Doğrulaması',
        titleEn: '1. Institutional Onboarding & OID Setup',
        summaryTr: 'MEB 54.000+ okul atlası otomatik tamamlama, 8 haneli resmi E-OID regex doğrulaması, akreditasyon durumu (KA120) seçimi ve yetki tanımlama.',
        summaryEn: 'Automatic completion from 54,000+ MEB schools, 8-digit E-OID validation regex, KA120 accreditation toggle, and RBAC permission setup.',
        goalTr: 'Okulun kurumsal profilini sisteme kaydetmek, doğru hibe rotasını (KA121 Akredite vs KA122 Kısa Dönemli) aktive etmek.',
        goalEn: 'Register institutional profile, validate EC identifiers, and activate the proper grant route (KA121 Accredited vs KA122 Short-term).',
        route: '/onboarding',
        routeLabelTr: 'Onboarding Sayfasına Git',
        routeLabelEn: 'Go to Onboarding',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'MEB Mesleki Atlası (54.000+ Kurum): Okul adı yazıldığında İl ve OID otomatik yüklenir.',
          'Resmi OID Formatı: "E" harfi ile başlayan ve 8 rakamdan oluşan standart regex (^E[0-9]{8}$) denetlenir.',
          'Akreditasyon Seçimi (KA120): "EVET" seçilirse KA121 yıllık tahsisat rotası, "HAYIR" seçilirse KA122 yarışmalı teklif rotası aktifleşir.',
          'Rol Seviyeleri: ORG_ADMIN (Tam yetkili koordinatör) veya MEMBER (Form doldurucu öğretmen) seçimi.'
        ],
        keyHighlightsEn: [
          'MEB Atlas (54,000+ Schools): School name input auto-fills province and verified OID.',
          'Official OID Format: Strict validation against European Commission regex (^E[0-9]{8}$).',
          'Accreditation Status (KA120): "YES" prioritises KA121 annual allocation; "NO" engages KA122 competitive call route.',
          'Permission Roles: ORG_ADMIN (Full coordinator) or MEMBER (Collaborating teacher).'
        ],
        parametersTable: [
          {
            labelTr: 'Form Alanı: Okul / Kurum Adı',
            labelEn: 'Field: School Name',
            valueTr: 'Mesleki Eğitim Kurumu Adı (MEB veritabanından otomatik önerili)',
            valueEn: 'Legal Vocational School Name (Autocompleted from MEB Atlas)'
          },
          {
            labelTr: 'Form Alanı: Resmi OID Numarası',
            labelEn: 'Field: Commission OID',
            valueTr: 'Avrupa Komisyonu Kurum Kimlik No (Örn: E10389241, E ile başlayan 8 rakam)',
            valueEn: 'EC Organisation ID (e.g. E10389241, starting with E followed by 8 digits)'
          },
          {
            labelTr: 'Form Alanı: Akreditasyon Durumu (KA120)',
            labelEn: 'Field: Accreditation Status (KA120)',
            valueTr: '"Evet" (Akredite Kurum / KA121) veya "Hayır" (Kısa Dönemli Başvuru / KA122)',
            valueEn: '"Yes" (Accredited / KA121) or "No" (Short-term Applicant / KA122)'
          },
          {
            labelTr: 'Form Alanı: Kurumsal Yetki Düzeyi',
            labelEn: 'Field: Role Level',
            valueTr: 'Proje Koordinatörü (Tam Yetkili) veya Görevli Öğretmen (Form Doldurucu)',
            valueEn: 'Project Coordinator (Full Admin) or Member Teacher'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Rol Seçim Kartını Belirleme',
            titleEn: 'Select School Role Card',
            actionTr: '/onboarding sayfasında "🏛️ Meslek Lisesi / VET Okulu" kartına tıklayın.',
            actionEn: 'On the /onboarding page, select the "🏛️ Vocational School / VET" card.',
            uiTargetTr: 'Seçim Kartı: [🏛️ Meslek Lisesi / VET Okulu]',
            uiTargetEn: 'Card: [🏛️ Vocational School / VET]',
            expectedStateTr: 'Okul kurumsal kayıt formu ve OID doğrulama alanları açılır.',
            expectedStateEn: 'Institutional school registration form and OID validation fields open.',
            expertTipTr: 'Konsorsiyum lideriyseniz, lider koordinatör kurum adına okul kaydını tamamlayın.',
            expertTipEn: 'If applying as a consortium lead, register using the coordinating institution credentials.'
          },
          {
            stepNumber: 2,
            titleTr: 'MEB Atlasından Okul Adını Arama',
            titleEn: 'Search School in MEB Atlas',
            actionTr: 'Okul Adı alanına okulunuzun adını veya ilçesini yazmaya başlayın ve öneri listesinden seçin.',
            actionEn: 'Start typing your school name or district in the school name field and choose from suggestions.',
            uiTargetTr: 'Form Alanı: [Okul Adı / İlçe Arama]',
            uiTargetEn: 'Input: [School Name Search]',
            expectedStateTr: 'Kurum seçildiğinde İl ve bilinen OID numarası otomatik dolar.',
            expectedStateEn: 'Selecting a school automatically populates the city and known OID.',
            expertTipTr: 'Özel statülü veya listede görünmeyen kurumlar için isim serbest metin olarak da girilebilir.',
            expertTipEn: 'Institutions not found in the autocomplete registry can type their name manually.'
          },
          {
            stepNumber: 3,
            titleTr: 'Avrupa Komisyonu OID Numarasını Girme',
            titleEn: 'Enter Official Commission OID',
            actionTr: 'Kurumunuzun 8 haneli resmi OID numarasını girin (Örn: E10389241).',
            actionEn: 'Enter your 8-digit official Commission OID starting with E (e.g. E10389241).',
            uiTargetTr: 'Form Alanı: [OID Numarası (E10389241)]',
            uiTargetEn: 'Input: [OID Code (e.g. E10389241)]',
            expectedStateTr: 'Format doğrulanır; geçerli OID yanında yeşil onay simgesi belirir.',
            expectedStateEn: 'Format is validated; valid OID receives a green validation checkmark.',
            expertTipTr: 'OID numaranız yoksa Avrupa Komisyonu ORS portalı üzerinden ücretsiz oluşturabilirsiniz.',
            expertTipEn: 'If your school lacks an OID, register free on the Commission ORS portal.'
          },
          {
            stepNumber: 4,
            titleTr: 'Akreditasyon Statüsü ve Yasal Onay',
            titleEn: 'Accreditation Status & Consent',
            actionTr: 'Erasmus+ Mesleki Eğitim Akreditasyonunuz (KA120) varsa "Evet", yoksa "Hayır"ı seçin. KVKK onay kutusunu işaretleyip tamamlayın.',
            actionEn: 'Toggle Accreditation Status to "Yes" or "No". Check the GDPR/KVKK consent box and submit.',
            uiTargetTr: 'Seçim: [Akreditasyon: Evet / Hayır] & Buton: [Kurulumu Tamamla]',
            uiTargetEn: 'Select: [Accreditation: Yes / No] & Button: [Complete Setup]',
            expectedStateTr: 'Kurum profiliniz güvenle kaydedilir ve sistem sizi doğrudan Okul Paneline yönlendirir.',
            expectedStateEn: 'Profile is securely saved and you are routed directly to the School Dashboard.',
            expertTipTr: 'Akredite kurumlar KA121 yıllık bütçe modülüne, akreditasyonsuz kurumlar ise KA122 yarışmalı teklif modülüne yönlendirilir.',
            expertTipEn: 'Accredited schools are channeled to KA121 annual allocation; non-accredited to KA122 proposals.'
          }
        ]
      },
      {
        id: 'school-dashboard',
        audience: 'SCHOOL',
        icon: '📊',
        titleTr: '2. Okul Gösterge Paneli ve Süreç Takibi',
        titleEn: '2. School Dashboard & Milestone Tracker',
        summaryTr: 'OID rozeti, akreditasyon durumu (KA121/KA122), katılımcı havuzu, gönderilen staj talepleri ve 0-100 hazırbulunuşluk skoru.',
        summaryEn: 'OID badge, accreditation mode (KA121/KA122), participant pool, sent inquiries tracker, and 0-100 readiness KPI.',
        goalTr: 'Devam eden hareketlilik hazırlıklarını, onaylanan Letter of Intent belgelerini ve hibe takvimini tek merkezden yönetmek.',
        goalEn: 'Centralize management of mobility preparation, approved Letters of Intent, and grant milestones.',
        route: '/',
        routeLabelTr: 'Okul Paneline Git',
        routeLabelEn: 'Go to School Dashboard',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'Kurum Kimlik Rozetleri: OID, Şehir, Seçili Mesleki Alan ve KA121/KA122 Hibe Yolu.',
          'Katılımcı Havuzu Kartı: Planlanan öğrenci stajı veya personel işbaşı sayıları.',
          'Host & Ortaklık Durumu: Gönderilen talep sayısı ve onaylanan LoI belgeleri.',
          'Hazırbulunuşluk & Karar Skoru: 0-100 puanlık hazırlık göstergesi.',
          'Gelen/Giden Talepler Tablosu: Durum takibi (Ön Kabul Onaylandı / Yanıt Bekleniyor / Kapasite Dolu).'
        ],
        keyHighlightsEn: [
          'Identity Badges: OID, City, Selected Vocational Field, and KA121/KA122 Route.',
          'Participant Pool Card: Planned student internships and staff job shadowing counts.',
          'Host Partnership Status: Total inquiries sent and approved Letters of Intent.',
          'Readiness Score KPI: 0-100 institutional mobility preparedness index.',
          'Inquiry Tracker Table: Real-time status (Accepted LoI / Pending Reply / Declined).'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Gösterge Kartlarını İnceleme',
            titleEn: 'Audit Summary Metric Cards',
            actionTr: 'Ana sayfada Okul Gösterge Paneline geçin. Kurum OID, Seçili Mesleki Alan ve Akreditasyon Rozetini inceleyin.',
            actionEn: 'Access the School Dashboard on the homepage. Inspect OID, Vocational Field, and Accreditation badges.',
            uiTargetTr: 'Ekran: [Okul Gösterge Paneli]',
            uiTargetEn: 'Screen: [School Dashboard Overview]',
            expectedStateTr: 'Aktif kurum bilgileri ve 0-100 hazırbulunuşluk skoru görüntülenir.',
            expectedStateEn: 'Active institutional details and 0-100 readiness scores render.'
          },
          {
            stepNumber: 2,
            titleTr: 'Hızlı Eylemleri Başlatma',
            titleEn: 'Trigger Quick Actions',
            actionTr: '"🚀 5 Adımlı Pipeline’ı Başlat" butonuna tıklayarak hareketlilik planlama sihirbazına geçin.',
            actionEn: 'Click "🚀 Launch 5-Step Pipeline" to enter the planning wizard.',
            uiTargetTr: 'Buton: [🚀 5 Adımlı Pipeline’ı Başlat]',
            uiTargetEn: 'Button: [🚀 Launch 5-Step Pipeline]',
            expectedStateTr: 'Kullanıcı doğrudan 5 adımlı hareketlilik planlama sayfasına aktarılır.',
            expectedStateEn: 'User is smoothly routed to the 5-step pipeline page.'
          },
          {
            stepNumber: 3,
            titleTr: 'Son Hareketlilik Talepleri Tablosunu İzleme',
            titleEn: 'Monitor Inquiries Tracker Table',
            actionTr: 'Panelin altındaki tabloda Avrupa ev sahibi işletmelerine gönderdiğiniz staj taleplerini ve onay durumlarını izleyin.',
            actionEn: 'Inspect the status of sent student internship inquiries at the bottom table.',
            uiTargetTr: 'Tablo: [Gönderilen Staj Talepleri & Başvuru Durumları]',
            uiTargetEn: 'Table: [Inquiries & Application Status]',
            expectedStateTr: 'Durumu ACCEPTED olan taleplerde "LoI Belgesi Görüntüle" butonu görünür.',
            expectedStateEn: 'Inquiries marked ACCEPTED display the "View LoI Document" button.'
          }
        ]
      },
      {
        id: 'school-pipeline',
        audience: 'SCHOOL',
        icon: '🚀',
        titleTr: '3. 5 Adımlı Hareketlilik Planlama Pipeline\'ı',
        titleEn: '3. 5-Step Mobility Planning Pipeline',
        summaryTr: 'Profil -> ESCO/ISCED Taksonomisi & 12 Likert Yetkinlik Testi -> 10 Kriterli Host Eşleştirme -> ECVET Öğrenme Kazanımları -> Resmi Tavsiye Dosyası (Dossier).',
        summaryEn: 'Profile -> ESCO/ISCED Taxonomy & 12 Likert Assessment -> 10-Criteria Host Matching -> ECVET Learning Outcomes -> Institutional Dossier.',
        goalTr: 'Avrupa Komisyonu ve Ulusal Ajans standartlarına tam uyumlu teknik, pedagojik ve lojistik hareketlilik dosyasını eksiksiz üretmek.',
        goalEn: 'Produce a complete pedagogical, logistical, and technical mobility dossier fully compliant with Commission criteria.',
        route: '/school/pipeline',
        routeLabelTr: 'Pipeline\'ı Aç',
        routeLabelEn: 'Open Pipeline',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'Aşama 1 (Kurum & Katılımcı): Öğrenci stajı vs Personel işbaşı izleme, refakatçi sayısı, dil hazırlığı kaydırıcısı (0-100), hareketlilik takvimi.',
          'Aşama 2 (Yetkinlik & Karar): ESCO/ISCED taksonomi eşleşmesi, 12 Likert sorusu, Yetkinlik Açığı (Gap), 8 faktörlü Karar Motoru, KA122 Kurallar Kapısı (max 30 kişi).',
          'Aşama 3 (Host Eşleştirme): 10 kriterli host puanlama (>=85 Mükemmel), vitrin portföyü ve haftalık müfredat (Syllabus PDF) inceleme, doğrudan staj talebi iletme.',
          'Aşama 4 (Kazanımlar & Kalite): Rol bazlı ECVET/Europass teknik, yeşil ve dijital kazanımlar üretimi; sorumluluk paylaşım matrisi.',
          'Aşama 5 (Rapor & Form Taslağı): Kurumsal Hareketlilik Dosyası (Dossier), PDF/Yazdır, JSON indirme ve tek tıkla Başvuru Taslağına aktarma.'
        ],
        keyHighlightsEn: [
          'Stage 1 (Profile): Student internship vs Staff job shadowing, accompanying staff, language slider (0-100), dates.',
          'Stage 2 (Competence): ESCO/ISCED mapper, 12 Likert test, Competence Gap, 8-factor Decision Engine, KA122 Gatekeeper (max 30).',
          'Stage 3 (Host Matching): 10-criteria host scoring (>=85 Excellent), syllabus inspection, direct inquiry dispatch.',
          'Stage 4 (Outcomes): Role-based ECVET technical, green, and digital outcomes; institutional responsibility matrix.',
          'Stage 5 (Dossier): Institutional Mobility Dossier, PDF print preview, JSON export, one-click transfer to Application Draft.'
        ],
        parametersTable: [
          {
            labelTr: 'İhtiyaç ve Yetkinlik Değerlendirmesi',
            labelEn: 'Competence & Needs Assessment',
            valueTr: 'Seçilen meslek alanındaki öğrenci eksikleri, kurum hedefleri ve dil hazırlığı analiz edilerek projenizin öncelikli kazanımları belirlenir.',
            valueEn: 'Target vocational skill gaps, institutional goals, and linguistic readiness are analyzed to pinpoint priority learning outcomes.'
          },
          {
            labelTr: 'Ev Sahibi (Host) Uygunluk Eşikleri',
            labelEn: 'Host Matching Thresholds',
            valueTr: '85 Puan ve Üzeri: Mükemmel Eşleşme, 70-84 Puan: Uygun İşletme, 70 Puan Altı: Gözden Geçirilmesi Gereken Eşleşme',
            valueEn: '>=85: Excellent Match, 70-84: Suitable Host, <70: Review Recommended'
          },
          {
            labelTr: 'KA122 Kısa Dönemli Proje Kuralları',
            labelEn: 'KA122 Eligibility Rules',
            valueTr: 'En fazla 30 katılımcı, 6-24 ay proje süresi, son 5 yılda en çok 2 hibe (Sınırı aşan okullara KA120 Akreditasyonu tavsiye edilir)',
            valueEn: 'Max 30 participants, 6-24 months duration, max 2 grants in 5 years (Accreditation recommended if exceeded)'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: '1. Aşama: Kurum ve Katılımcı Profili Tanımlama',
            titleEn: 'Stage 1: Define School & Participant Profile',
            actionTr: 'Katılımcı türünü ("Öğrenci" / "Teknik Öğretmen"), hareketlilik türünü ("Staj" / "İşbaşı İzleme"), öğrenci sayısını (Örn: 6) ve refakatçi sayısını (Örn: 1) girin. Yabancı Dil Hazırlığı kaydırıcısını (0-100) ayarlayın.',
            actionEn: 'Specify participant type (Learner / Staff), mobility type (Internship / Job Shadowing), headcounts, and language prep slider (0-100).',
            uiTargetTr: 'Form Kartları: [1. Kurum Bilgileri] ve [2. Katılımcı Sayısı]',
            uiTargetEn: 'Form Cards: [1. School Profile] & [2. Headcount & Participants]',
            expectedStateTr: 'Girdiğiniz bilgiler anında kaydedilir ve "Sonraki Aşama: Yetkinlik & Hibe Yolu →" butonu aktifleşir.',
            expectedStateEn: 'Inputs are committed; "Next Stage: Competence & Decision →" unlocks.',
            expertTipTr: 'Refakatçi öğretmen sayısı öğrenci sayısına ve 18 yaş altı grup büyüklüğüne göre Ulusal Ajans oranlarına uygun seçilmelidir.',
            expertTipEn: 'Accompanying staff counts should match National Agency rules for minors under 18.'
          },
          {
            stepNumber: 2,
            titleTr: '2. Aşama: Meslek Alanı ve 12 Soruluk Yetkinlik Testi',
            titleEn: 'Stage 2: Vocational Field & Competence Assessment',
            actionTr: 'Mesleki Alanı seçin (Örn: Bilişim, Makine, Elektrik, Yenilenebilir Enerji). Otomatik listelenen meslek becerilerini inceleyin. 12 soruluk kısa yetkinlik testini puanlayıp "Karar Oluştur" butonuna basın.',
            actionEn: 'Select vocational field. Inspect listed skills. Complete 12 short assessment questions and click "Generate Decision".',
            uiTargetTr: 'Değerlendirme Kartı: [Meslek Alanı Seçimi ve 12 Soruluk Yetkinlik Testi]',
            uiTargetEn: 'Assessment Card: [Vocational Field & 12-Question Skills Survey]',
            expectedStateTr: 'Sistem 0-100 yetkinlik skoru, Yetkinlik Açığı grafiği ve okulunuza en uygun hibe rotası önerisini (KA121 vs KA122) üretir.',
            expectedStateEn: 'Outputs 0-100 competence score, Competence Gap gauge, and recommended grant route (KA121 vs KA122).',
            expertTipTr: 'Katılımcı sayısı 30\'u aşıyorsa sistem kırmızı uyarı vererek okulunuza KA120 Akreditasyonuna başvurmayı önerir.',
            expertTipEn: 'If learner count exceeds 30, the system issues a warning and suggests KA120 Accreditation.'
          },
          {
            stepNumber: 3,
            titleTr: '3. Aşama: Doğrulanmış Ev Sahibi İşletme Bulma ve Talep Gönderme',
            titleEn: 'Stage 3: Host Matching & Inquiry Submission',
            actionTr: 'Doğrulanmış Avrupa işletmelerini filtreleyin (Ülke, Sektör, Çalışma Dili). "Portföyü İncele" ile atölye imkanlarını ve müfredatı görün. "✉️ Staj Talebi Gönder" butonuna basarak okulunuz adına resmi ön başvuru iletin.',
            actionEn: 'Filter verified European hosts. Inspect workshop facilities and syllabus via "Review Portfolio". Click "✉️ Send Inquiry" to dispatch request.',
            uiTargetTr: 'İşletme Kartı: [Avrupa Ev Sahibi Listesi] & Buton: [✉️ Staj Talebi Gönder]',
            uiTargetEn: 'Host Card: [European Host Directory] & Button: [✉️ Send Inquiry]',
            expectedStateTr: 'Ev sahibi ile okulunuz arasındaki eşleşme skoru hesaplanır (>=85 Mükemmel); staj talebiniz anında ev sahibinin masasına iletilir.',
            expectedStateEn: 'Host match score computed (>=85 Excellent); inquiry is logged to host dashboard immediately.',
            expertTipTr: '15 kriterli denetimden geçmiş ve mavi "Verified Partner" rozetine sahip işletmeler Ulusal Ajans nezdinde en yüksek kabul oranına sahiptir.',
            expertTipEn: 'Hosts holding the blue "Verified Partner" badge carry the highest credibility with grant evaluators.'
          },
          {
            stepNumber: 4,
            titleTr: '4. Aşama: Mesleki, Yeşil ve Dijital Öğrenme Kazanımları',
            titleEn: 'Stage 4: Generate Learning Outcomes',
            actionTr: '"Örnek Öğrenme Kazanımları Üret" butonuna basın. Öğrencilerin edineceği teknik, yeşil ve dijital beceri metinlerini oluşturun. Okul ve ev sahibi arasındaki görev dağılımını onaylayın.',
            actionEn: 'Click "Generate Learning Outcomes". Produce tailored technical, green, and digital skills. Audit the institutional responsibility matrix.',
            uiTargetTr: 'Kazanım Bölümü: [Mesleki, Yeşil ve Dijital Öğrenme Çıktıları]',
            uiTargetEn: 'Outcomes Card: [Technical, Green & Digital Learning Outcomes]',
            expectedStateTr: 'Europass Hareketlilik Belgesine ve resmi başvuru formuna aktarılacak standart metinler üretilir.',
            expectedStateEn: 'Europass-compliant learning outcomes and task sharing matrix are prepared.'
          },
          {
            stepNumber: 5,
            titleTr: '5. Aşama: Kurumsal Hareketlilik Dosyası (Dossier) ve Taslağa Aktarma',
            titleEn: 'Stage 5: Institutional Dossier & Transfer to Draft',
            actionTr: 'Oluşan Kurumsal Hareketlilik Dosyasını inceleyin. "🖨️ PDF / Yazdır" ile arşiv çıktısı alın veya "📋 Resmi Başvuru Form Taslağına Aktar" butonuna basarak tek tıkla başvuru modülüne geçin.',
            actionEn: 'Review the Dossier. Click "🖨️ PDF / Print" for physical archives or "📋 Transfer to Application Draft" to sync into web forms.',
            uiTargetTr: 'Rapor Ekranı: [Kurumsal Hareketlilik Dosyası] & Buton: [Başvuru Taslağına Aktar]',
            uiTargetEn: 'Report View: [Institutional Mobility Dossier] & Button: [Transfer to Draft]',
            expectedStateTr: 'Hazırladığınız tüm planlama verileri tek tıkla resmi başvuru taslağı modülüne aktarılır.',
            expectedStateEn: 'All pipeline data is copied seamlessly into /school/application-draft and user is routed there.'
          }
        ]
      },
      {
        id: 'school-inquiry-loi',
        audience: 'SCHOOL',
        icon: '📄',
        titleTr: '4. Staj Talebi Takibi ve Örnek Ön Kabul Taslağı (LoI) İndirme',
        titleEn: '4. Inquiry Tracking & Sample Letter of Intent (LoI) Draft',
        summaryTr: 'Avrupa ev sahiplerine gönderilen staj başvurularını izleme, onaylanan taleplerden tarafların referans alabileceği örnek Letter of Intent (LoI) taslağını indirme.',
        summaryEn: 'Track applications dispatched to EU hosts and retrieve a reference Letter of Intent (LoI) draft upon approval.',
        goalTr: 'Ulusal Ajans hibe başvurusu hazırlıklarında ve kurumlar arası yazışmalarda referans alınacak örnek kontenjan taahhüt taslağını (LoI) temin etmek.',
        goalEn: 'Acquire a reference host commitment draft (Letter of Intent) with reserved quotas to guide institutional preparations.',
        route: '/',
        routeLabelTr: 'Talepleri İzle',
        routeLabelEn: 'Track Inquiries',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'ACCEPTED Rozeti: Ev sahibinin kurum OID\'si, kontenjan sayısı ve hareketlilik takvimini ön kabul olarak onayladığını gösterir.',
          'Örnek LoI Taslağı İçeriği: Ev Sahibi OID, Gönderen Okul OID, Kabul Edilen Öğrenci Sayısı, Tarihler ve Mentor Bilgisi içeren referans metin.',
          'Tek Tıkla PDF Taslak: Tarayıcı baskı önizlemesiyle örnek niyet mektubu taslağı PDF olarak kaydedilir.'
        ],
        keyHighlightsEn: [
          'ACCEPTED Badge: Confirms host has locked learner quota, dates, and mentorship support.',
          'LoI Draft Contents: Host OID, School OID, Approved Headcounts, Mobility Window, and Mentor Info for institutional reference.',
          'Instant PDF Export: Browser print dialog produces a clean reference template PDF.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Talepler Tablosuna Ulaşma',
            titleEn: 'Navigate to Sent Inquiries Tracker',
            actionTr: 'Okul Paneli veya 5 Adımlı Planlayıcı altındaki "Son Hareketlilik Talepleri & Ortaklıklar" tablosuna gidin.',
            actionEn: 'Locate the "Sent Inquiries & Partnerships" table on the School Dashboard or Pipeline view.',
            uiTargetTr: 'Takip Tablosu: [Son Hareketlilik Talepleri & Başvuru Durumları]',
            uiTargetEn: 'Tracker Table: [Sent Inquiries & Status Tracker]',
            expectedStateTr: 'Gönderilen tüm staj talepleri durumlarıyla (ACCEPTED / PENDING / DECLINED) listelenir.',
            expectedStateEn: 'All submitted inquiries render with live statuses (ACCEPTED / PENDING / DECLINED).'
          },
          {
            stepNumber: 2,
            titleTr: 'Ön Kabul Verilen Talebi Belirleme',
            titleEn: 'Identify Accepted Inquiry Entry',
            actionTr: 'Durumu yeşil renkli "✓ Ön Kabul Onaylandı (ACCEPTED)" olan satırı bulun.',
            actionEn: 'Find the entry bearing the green "✓ Accepted (ACCEPTED)" status badge.',
            uiTargetTr: 'Durum Rozeti: [✓ Ön Kabul Onaylandı (ACCEPTED)]',
            uiTargetEn: 'Status Badge: [✓ Accepted LoI Active]',
            expectedStateTr: 'Satırın sağında "LoI Belgesi Görüntüle" butonu görünür hale gelir.',
            expectedStateEn: 'The "View LoI Document" action button is enabled.'
          },
          {
            stepNumber: 3,
            titleTr: 'Letter of Intent Önizleme ve PDF Olarak Kaydetme',
            titleEn: 'Preview & Export Letter of Intent PDF',
            actionTr: '"LoI Belgesi Görüntüle" butonuna basın. Açılan ön kabul taslağı penceresinde "🖨️ Yazdır / PDF Olarak Kaydet" butonuna tıklayın.',
            actionEn: 'Click "View LoI Document". In the draft preview modal, click "🖨️ Print / Save as PDF".',
            uiTargetTr: 'Önizleme Penceresi: [Letter of Intent Belgesi] & Buton: [Yazdır / PDF]',
            uiTargetEn: 'Preview Modal: [Letter of Intent Document] & Button: [Print / PDF]',
            expectedStateTr: 'Ev sahibinin OID, tarih ve kontenjan bilgilerini içeren örnek niyet mektubu taslağı PDF olarak cihazınıza indirilir.',
            expectedStateEn: 'Sample host LoI draft with OID and dates is saved as PDF on your device.'
          }
        ]
      },
      {
        id: 'school-application-draft',
        audience: 'SCHOOL',
        icon: '📝',
        titleTr: '5. Resmi Başvuru Form Taslak Modülü (KA121 / KA122)',
        titleEn: '5. Official Application Form Draft Assistant',
        summaryTr: 'KA122 (74 Soru) ve KA121 (46 Soru) soru matrisi, KA120 akreditasyon PDF tarama, otomatik bütçe/harcırah hesaplama ve Gemini AI resmi soru anlatıları.',
        summaryEn: 'KA122 (74 Questions) vs KA121 (46 Questions) matrices, KA120 PDF extraction, distance band budget calculator, and Gemini AI narrative generator.',
        goalTr: 'Avrupa Komisyonu resmi web başvuru portalına (Web Application Forms) aktarılacak proje anlatılarını ve bütçe matrisini eksiksiz hazırlamak.',
        goalEn: 'Formulate proposal narratives and compute budget matrices ready for submission to the European Commission portal.',
        route: '/school/application-draft',
        routeLabelTr: 'Form Taslak Modülünü Aç',
        routeLabelEn: 'Open Application Draft',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'Hızlı Test Senaryoları: Kapadokya Siber Güvenlik MTAL (KA121), Seyrek Otomasyon MTAL (KA122), Ankara Yenilenebilir Enerji MTAL (KA122).',
          'KA120 PDF Yükleme: Eski onaylı akreditasyon PDF belgesini yapay zeka (/api/extract-ka120) ile tarayıp OID ve hedefleri taslağa aktarma.',
          '7 Resmi Komisyon Bölümü: Context, Org Profile, Needs & Objectives, Activity Details & Budget, Quality Standards, Declarations, AI Narrative Generator.',
          'Otomatik Hibe Bütçesi: Mesafe bandı (Örn: 2000-2999 km 360 €), Yeşil Seyahat (+30-50 € ve +4 gün harcırah), Dahil Etme Desteği (kişi başı 100 €).',
          'Gemini 2.5 Flash Yapay Zeka: Resmi form soruları için tekil veya toplu anlatı üretimi, canlı karakter sayacı, Human-in-the-Loop denetimi.'
        ],
        keyHighlightsEn: [
          'Preset Test Scenarios: Cappadocia Cyber Security (KA121), Seyrek Automation (KA122), Ankara Green Tech (KA122).',
          'KA120 PDF Ingestion: Upload accredited PDF to ingest objectives and quality standards via AI (/api/extract-ka120).',
          '7 Official Commission Sections: Context, Org Profile, Needs, Activity & Budget, Quality, Declarations, AI Narratives.',
          'Automated Grant Budget: Distance bands, Green Travel top-ups (+4 subsistence days), Inclusion support (100 €/pax).',
          'Gemini 2.5 Flash AI: Bulk or individual narrative drafting, live character counters, Human-in-the-Loop editing.'
        ],
        parametersTable: [
          {
            labelTr: 'KA121-VET (Akredite Kurum Hibe Talebi)',
            labelEn: 'KA121-VET (Accredited Grant Allocation)',
            valueTr: '46 Resmi Soru, yarışma yoktur, doğrudan yıllık bütçe tahsisatı, KA120 akreditasyon hedefleriyle eşleşir.',
            valueEn: '46 Questions, non-competitive annual allocation, binds directly to approved KA120 goals.'
          },
          {
            labelTr: 'KA122-VET (Kısa Dönemli Mesleki Projeler)',
            labelEn: 'KA122-VET (Short-term Mobility Projects)',
            valueTr: '74 Resmi Soru, yarışmalı teklif çağrısı, max 30 katılımcı, 6-24 ay proje süresi, 100 üzerinden bağımsız dış değerlendirici puanlaması.',
            valueEn: '74 Questions, competitive call, max 30 participants, 6-24 months, scored out of 100 by external evaluators.'
          },
          {
            labelTr: 'Yeşil Seyahat (Green Travel) Hibe Formülü',
            labelEn: 'Green Travel Grant Formula',
            valueTr: 'Standart seyahate ek +30-50 € hibe ve seyahat günleri için katılımcı başına +4 güne kadar Bireysel Destek (günlük harcırah).',
            valueEn: '+30-50 € travel top-up and up to +4 days Individual Support subsistence allowance per participant.'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Hibe Formatını Belirleme (KA121 vs KA122)',
            titleEn: 'Toggle Form Format (KA121 vs KA122)',
            actionTr: 'Sayfanın üstündeki format düğmelerinden "KA122-VET (Kısa Dönemli Projeler - 74 Soru)" veya "KA121-VET (Akredite Kurum Hibe Talebi - 46 Soru)" butonuna tıklayın.',
            actionEn: 'Toggle between "KA122-VET (Short-term Projects - 74 Questions)" and "KA121-VET (Accredited Grant - 46 Questions)".',
            uiTargetTr: 'Düğmeler: [KA122-VET / KA121-VET Toggle]',
            uiTargetEn: 'Toggles: [KA122-VET / KA121-VET Toggle]',
            expectedStateTr: 'Seçilen form türünün resmi 7 bölüm menüsü ve soru şablonları yüklenir.',
            expectedStateEn: 'The 7-section navigation and specific question bank load.'
          },
          {
            stepNumber: 2,
            titleTr: 'KA120 Akreditasyon Belgesi Yükleme (KA121 İçin)',
            titleEn: 'Upload KA120 Accreditation PDF (For KA121)',
            actionTr: 'KA121 seçtiyseniz, kurumunuzun eski onaylı akreditasyon PDF dosyasını yükleyin. Açılan önizleme penceresinde sistemin taradığı hedefleri onaylayın.',
            actionEn: 'For KA121, drop your approved KA120 accreditation PDF. Approve AI-extracted goals in the preview modal.',
            uiTargetTr: 'Belge Yükleme Alanı: [KA120 Akreditasyon Belgesi (PDF)]',
            uiTargetEn: 'Upload Zone: [KA120 Accreditation PDF]',
            expectedStateTr: 'OID, akreditasyon hedefleri ve kalite taahhütleri başvuru taslağına otomatik aktarılır.',
            expectedStateEn: 'OID, Erasmus Plan targets, and commitments populate the draft automatically.'
          },
          {
            stepNumber: 3,
            titleTr: 'Faaliyet Detayları ve Canlı Bütçe Hesaplama',
            titleEn: 'Activity Details & Automated Budget Matrix',
            actionTr: '4. Bölümde Faaliyet Türünü (Öğrenci Stajı / Personel İşbaşı), Katılımcı Sayısını, Gün Sayısını ve Mesafe Bandını (Örn: 2000-2999 km) belirleyin. "Yeşil Seyahat" seçeneğini işaretleyin.',
            actionEn: 'In Section 4, enter Activity Type, Headcounts, Duration, and Distance Band. Toggle Green Travel.',
            uiTargetTr: 'Bölüm: [4. Faaliyet Detayları & Bütçe Hesaplama]',
            uiTargetEn: 'Section: [4. Activity Details & Budget Calculation]',
            expectedStateTr: 'Bireysel Destek + Seyahat + Yeşil Bonus + Organizasyonel Destek hibe toplamı canlı matriste hesaplanır.',
            expectedStateEn: 'Live budget matrix computes Individual Support + Travel + Green Bonus + Organisational Support.'
          },
          {
            stepNumber: 4,
            titleTr: 'Gemini AI ile Resmi Soru Anlatıları Yazdırma',
            titleEn: 'Generate Proposal Narratives with Gemini AI',
            actionTr: '7. Bölümde "✨ Tüm Cevapları AI ile Oluştur" butonuna basarak resmi soruların taslak anlatılarını kurum verilerinizle harmanlayarak hazırlatın.',
            actionEn: 'In Section 7, click "✨ Generate All Answers with AI" to synthesize official narratives tailored to your school.',
            uiTargetTr: 'Yapay Zeka Aracı: [✨ Tüm Cevapları AI ile Oluştur]',
            uiTargetEn: 'AI Tool: [✨ Generate All Answers with AI]',
            expectedStateTr: 'Resmi Komisyon karakter sınırlarına uygun, "AI Taslak" rozetli düzenlenebilir metinler üretilir.',
            expectedStateEn: 'Commission character-compliant drafts bearing the "AI Draft" badge are generated.'
          },
          {
            stepNumber: 5,
            titleTr: 'Resmi Başvuru Dosyasını Dışa Aktarma',
            titleEn: 'Export Complete Proposal Dossier',
            actionTr: 'Taslak tamamlandığında "⬇️ JSON İndir" ile verinizi yedekleyin ve "🖨️ Yazdır / PDF" ile resmi başvuru dosyasını yazdırın.',
            actionEn: 'Export your completed proposal via "⬇️ Download JSON" and print formal dossier via "🖨️ Print / PDF".',
            uiTargetTr: 'Butonlar: [⬇️ JSON İndir] & [🖨️ Yazdır / PDF]',
            uiTargetEn: 'Buttons: [⬇️ Download JSON] & [🖨️ Print / PDF]',
            expectedStateTr: 'ErasmusMobility_[Format]_Draft.json ve baskıya hazır resmi hibe başvuru dosyası kaydedilir.',
            expectedStateEn: 'Structured JSON and formatted proposal dossier are exported to your machine.'
          }
        ]
      },
      {
        id: 'school-preparation-library',
        audience: 'SCHOOL',
        icon: '🎒',
        titleTr: '6. Hareketlilik Öncesi Hazırlık (Vize, Sigorta, OLS) & Doküman Kütüphanesi',
        titleEn: '6. Pre-Departure Preparation (Visa, Insurance, OLS) & Document Library',
        summaryTr: 'Yurtdışına çıkış öncesi yasal hazırlıklar: Vize süreçleri, SGK A/T 11 & seyahat sağlık sigortası, OLS dil hazırlığı, veli izinleri ve Kütüphane şablonları (LoI, Learning Agreement, Europass).',
        summaryEn: 'Pre-departure legal and pedagogical preparation: Visa workflows, A/T 11 & medical insurance, OLS language prep, guardian consent, and Document Library templates (LoI, Learning Agreement, Europass).',
        goalTr: 'Öğrenci ve refakatçi öğretmenlerin yurtdışına çıkmadan önceki tüm idari, yasal, dilsel ve lojistik hazırlıklarını eksiksiz tamamlamak.',
        goalEn: 'Complete all administrative, legal, linguistic, and logistical milestones for students and accompanying staff before departure.',
        route: '/preparation',
        routeLabelTr: 'Hazırlık Modülünü Aç',
        routeLabelEn: 'Open Preparation Module',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'Vize ve Pasaport: Hizmet pasaportu (Gri) veya hususi pasaport süreçleri, konsolosluk vize talep yazıları ve seyahat onayları.',
          'Sağlık Sigortası & A/T 11: Almanya vb. anlaşmalı ülkeler için SGK A/T 11 formüleri; diğer ülkeler için kapsamlı Erasmus+ özel seyahat sağlık ve mesuliyet sigortası.',
          'OLS (Online Language Support): Avrupa Komisyonu OLS platformu üzerinden öğrencilerin hareketlilik öncesi ve sonrası dil seviyesi tespiti ve online eğitimler.',
          'Doküman Kütüphanesi (/library): Standart Öğrenim Anlaşması (Learning Agreement for VET), Europass Hareketlilik Belgesi, veli muvafakatnameleri ve kriz eylem planı şablonları.'
        ],
        keyHighlightsEn: [
          'Visa & Passports: Service passport (Grey) processing, consular visa support letters, and travel authorisations.',
          'Health Insurance & A/T 11: Social Security A/T 11 bilateral certificate for countries like Germany; comprehensive Erasmus+ medical, accident, and liability insurance for all others.',
          'OLS (Online Language Support): Mandatory pre- and post-mobility CEFR language assessments and self-paced language courses via the EC portal.',
          'Document Library (/library): Official Learning Agreement for VET, Europass Mobility certificate guidelines, guardian consent forms, and emergency protocol templates.'
        ],
        parametersTable: [
          {
            labelTr: 'İdari Süreç: Pasaport & Vize',
            labelEn: 'Process: Passport & Visa',
            valueTr: 'Kaymakamlık / Valilik Oluru, Hizmet Pasaportu (Gri) veya Schengen Vize Randevusu',
            valueEn: 'District Approval, Official Service Passport (Grey), or Schengen Visa Filing'
          },
          {
            labelTr: 'Yasal Zorunluluk: Seyahat & Sağlık Sigortası',
            labelEn: 'Mandatory: Medical & Liability Insurance',
            valueTr: 'SGK A/T 11 Belgesi veya En Az 30.000 € Teminatlı Kapsamlı Seyahat Sağlık & Kaza Poliçesi',
            valueEn: 'SGK A/T 11 or Comprehensive 30,000+ EUR Coverage with Repatriation & Civil Liability'
          },
          {
            labelTr: 'Pedagojik Araç: OLS Dil Hazırlığı',
            labelEn: 'Pedagogical: OLS Language Support',
            valueTr: 'Avrupa Komisyonu Online Language Support sistemi üzerinden A1-C1 dil eğitimi',
            valueEn: 'Self-paced CEFR level learning via official European Commission OLS portal'
          },
          {
            labelTr: 'Sözleşme: Öğrenim Anlaşması (Learning Agreement)',
            labelEn: 'Contract: Learning Agreement (VET)',
            valueTr: 'Gönderen okul, ev sahibi işletme ve öğrenci tarafından imzalanan resmi staj sözleşmesi',
            valueEn: 'Tripartite agreement signed by sending school, host enterprise, and trainee'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Hazırlık Kontrol Listesini İnceleyin',
            titleEn: 'Review Pre-Departure Checklist',
            actionTr: 'Üst menüden "Hazırlık" (/preparation) sayfasına gidin. 4 aşamalı hazırlık takvimini (İdari, Lojistik, Dil, Kültürel) inceleyin.',
            actionEn: 'Navigate to "Preparation" (/preparation) via navigation bar. Inspect the 4-phase milestone schedule.',
            uiTargetTr: 'Sayfa: [/preparation - Hareketlilik Öncesi Hazırlık Masası]',
            uiTargetEn: 'Page: [/preparation - Pre-Departure Readiness Deck]',
            expectedStateTr: 'Vize, sigorta, veli izinleri ve konaklama hazırlık adımları listelenir.',
            expectedStateEn: 'Structured pre-departure timeline with document links and checklists appears.'
          },
          {
            stepNumber: 2,
            titleTr: 'Doküman Kütüphanesinden Şablonları İndirin',
            titleEn: 'Download Templates from Library',
            actionTr: '"Kütüphane" (/library) sekmesinden resmi Öğrenim Anlaşması (Learning Agreement), Veli Muvafakatnamesi ve Europass rehberini indirin.',
            actionEn: 'Access "Library" (/library) to download official Learning Agreement, parental consent, and Europass guides.',
            uiTargetTr: 'Sayfa: [/library - Doküman Kütüphanesi & Standart Şablonlar]',
            uiTargetEn: 'Page: [/library - Document Library & Templates]',
            expectedStateTr: 'Komisyon standartlarında düzenlenebilir Word ve PDF formatlarında şablonlar edinilir.',
            expectedStateEn: 'Editable Commission-compliant document templates are downloaded.'
          }
        ]
      },
      {
        id: 'school-consulting-analytics',
        audience: 'SCHOOL',
        icon: '📊',
        titleTr: '7. Birebir Danışmanlık Randevusu & Geçmiş Hibe Analitiği',
        titleEn: '7. Expert Advisory Appointment & Historical Grant Analytics',
        summaryTr: 'Ulusal Ajans geçmiş çağrı kabul oranları, il bazlı hibe dağılım istatistikleri ve platform uzmanlarıyla canlı birebir online danışmanlık randevusu planlama.',
        summaryEn: 'National Agency historical acceptance analytics, province-based grant allocation benchmarks, and scheduling live 1-on-1 expert advisory consultations.',
        goalTr: 'Okulun başvuru stratejisini somut verilerle güçlendirmek, soru işaretleri için uzman desteği almak ve kazanma şansını maksimize etmek.',
        goalEn: 'Reinforce proposal strategy with empirical data and schedule direct consultations with European project specialists.',
        route: '/',
        routeLabelTr: 'Üst Menüden Randevu Al',
        routeLabelEn: 'Schedule via Top Nav',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'Canlı Randevu Sistemi: Üst menüde "Danışmanlık Randevusu" butonu ile uygun tarih/saat seçimi ve soru konusu iletme.',
          'Hibe İstatistikleri & Sonuçlar Widget\'ı: Türkiye Ulusal Ajansı geçmiş dönem çağrı sonuçları, sektör bazlı hibe dağılımları ve puanlama eşikleri.',
          'Ön Başvuru Kontrolü: Proje metninin Erasmus+ Kalite Standartları ve hibe uygunluk kriterlerine göre ön değerlendirmesi.',
          'Bütçe ve Kota Danışmanlığı: KA121 yıllık tahsisat bütçe planlaması veya KA122 30 hareketlilik ve 60.000 € üst sınır danışmanlığı.'
        ],
        keyHighlightsEn: [
          'Live Appointment System: Direct booking via "Expert Advisory" in top header with date/time picker and inquiry context notes.',
          'Grant Results & Analytics Widget: Historical Turkish National Agency acceptance rates, sectoral distributions, and scoring cutoffs.',
          'Pre-Submission Quality Audit: Preliminary review against Erasmus+ Quality Standards and operational criteria.',
          'Budget & Quota Consultation: Guidance on KA121 block allocation or KA122 30-participant / 60,000 EUR thresholds.'
        ],
        parametersTable: [
          {
            labelTr: 'Danışmanlık Formatı: Canlı Görüşme',
            labelEn: 'Consultation: Live Session',
            valueTr: '30-45 dakikalık online video görüşme (Google Meet / Zoom)',
            valueEn: '30-45 minute interactive online session (Google Meet / Zoom)'
          },
          {
            labelTr: 'Veri Tabanı: Geçmiş Proje Analitiği',
            labelEn: 'Database: Historical Project Analytics',
            valueTr: 'Türkiye geneli ve AB geneli mesleki eğitim kabul oranları ve ortalama hibe tutarları',
            valueEn: 'National and European VET acceptance rates and mean allocation benchmarks'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Randevu Penceresini Açın',
            titleEn: 'Trigger Appointment Modal',
            actionTr: 'Üst menüdeki "📅 Danışmanlık Randevusu" bağlantısına tıklayın.',
            actionEn: 'Click "📅 Expert Advisory" in the top navigation bar.',
            uiTargetTr: 'Menü Butonu: [📅 Randevu Al]',
            uiTargetEn: 'Nav Button: [📅 Book Advisory]',
            expectedStateTr: 'Uzman takvimi, tarih seçici ve konu başlıkları formu açılır.',
            expectedStateEn: 'Interactive appointment scheduling dialog opens with topic and date pickers.'
          },
          {
            stepNumber: 2,
            titleTr: 'Tarih & Proje Konusunu Belirleyin',
            titleEn: 'Select Date & Project Topic',
            actionTr: 'Okulunuzun OID numarasını, ilgilendiğiniz çağrı türünü (KA121 / KA122) ve danışmak istediğiniz konuları girerek randevuyu onaylayın.',
            actionEn: 'Specify school OID, target action type (KA121/KA122), and questions before confirming.',
            uiTargetTr: 'Form Alanları: [Tarih, Saat, İrtibat E-posta ve Not]',
            uiTargetEn: 'Fields: [Date, Time Slot, Contact Email, Context Note]',
            expectedStateTr: 'Randevu onaylanır, e-posta bildirim ve takvim daveti oluşturulur.',
            expectedStateEn: 'Appointment is confirmed with email notification and calendar invitation.'
          }
        ]
      }
    ]
  },
  {
    id: 'HOST',
    labelTr: 'Hizmet Sağlayıcı (Avrupa Ev Sahibi Kuruluş / Host)',
    labelEn: 'Service Provider (European Host Organisation)',
    icon: '🏢',
    badgeTr: 'Avrupa KOBİ\'leri, Fabrikalar ve Eğitim Merkezleri',
    badgeEn: 'European Enterprises, Factories & VET Providers',
    descriptionTr: 'Almanya, İspanya, İtalya vb. ülkelerde faaliyet gösteren işletmeler için Tier 1 hızlı kayıt, Tier 2 vitrin portföyü ve haftalık staj müfredatı, Tier 3 15 kriterli kurumsal KYC doğrulaması ve staj taleplerini örnek LoI taslağı ile yanıtlama rehberi.',
    descriptionEn: 'Operational manual for European host organisations: Tier 1 registration, Tier 2 showcase portfolio & weekly syllabus, Tier 3 15-criteria institutional KYC verification, and issuing reference Letters of Intent (LoI drafts).',
    topics: [
      {
        id: 'host-onboarding-tier1',
        audience: 'HOST',
        icon: '🏢',
        titleTr: '1. Host Hızlı Kayıt (Tier 1 Onboarding)',
        titleEn: '1. Host Quick Setup & Registration (Tier 1)',
        summaryTr: 'Yasal şirket adı, unvan, ülke, şehir, adres, kuruluş yılı, OID/PIC, sektör, stajyer kontenjanı, faaliyetler ve çalışma dilleri.',
        summaryEn: 'Legal entity name, country, city, address, OID/PIC, vocational sector, trainee capacity, activities, and working languages.',
        goalTr: 'Avrupa ev sahibi işletmesini sisteme tanımlayarak okul arama motorunda listelenir hale gelmek ve %40 profil doluluğuna ulaşmak.',
        goalEn: 'Register European enterprise to be discoverable in school searches and reach 40% initial profile completion.',
        route: '/onboarding',
        routeLabelTr: 'Host Kayıt Sayfası',
        routeLabelEn: 'Host Registration',
        demoRole: 'HOST',
        keyHighlightsTr: [
          'Kurum Türü: Company / SME, Training Centre, VET School, Sectoral Organisation, NGO.',
          'Kontenjan Tanımı: Dönemlik maksimum öğrenci kapasitesi (Örn: 4-6 öğrenci) ve yıllık toplam kapasite.',
          'Sunulan Faaliyetler: VET_INTERNSHIP (Öğrenci Stajı), JOB_SHADOWING (İşbaşı İzleme), TRAINING_COURSE.',
          'Çalışma Dilleri: İngilizce (EN), Almanca (DE), İspanyolca (ES), İtalyanca (IT) vb.'
        ],
        keyHighlightsEn: [
          'Entity Types: Company / SME, Training Centre, VET School, Sectoral Body, NGO.',
          'Quota Management: Max learners per session (e.g. 4-6 students) and annual aggregate capacity.',
          'Offered Activities: VET_INTERNSHIP (Learner Internship), JOB_SHADOWING (Staff Observation), TRAINING_COURSE.',
          'Workplace Languages: English (EN), German (DE), Spanish (ES), Italian (IT), etc.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Host Rolü Seçimi',
            titleEn: 'Select Host Role Card',
            actionTr: '/onboarding sayfasında "🏢 Ev Sahibi Kuruluş (Host)" kartına tıklayın.',
            actionEn: 'On the /onboarding screen, click the "🏢 European Host Organisation (HOST)" card.',
            uiTargetTr: 'Buton: [🏢 Ev Sahibi Kuruluş (HOST)]',
            uiTargetEn: 'Button: [🏢 European Host Organisation (HOST)]',
            expectedStateTr: 'Host Tier 1 kayıt formu aktifleşir.',
            expectedStateEn: 'Host Tier 1 registration form is displayed.'
          },
          {
            stepNumber: 2,
            titleTr: 'Şirket ve İletişim Bilgileri',
            titleEn: 'Company Identity & Coordinates',
            actionTr: 'Şirketinizin resmi yasal adını, ticari unvanını, faaliyet gösterdiği ülkeyi, şehri, açık adresini ve varsa Avrupa Komisyonu OID/PIC numarasını girin.',
            actionEn: 'Enter legal company name, trading name, country code, city, registered address, and OID/PIC if available.',
            uiTargetTr: 'Form Alanları: [Şirket Yasal Adı, Ticari Unvan, Ülke, Şehir, Resmi Kurum Kodu (OID)]',
            uiTargetEn: 'Fields: [Legal Entity Name, Trading Name, Country, City, Commission OID/PIC]',
            expectedStateTr: 'İşletme iletişim koordinatları sisteme kaydedilir.',
            expectedStateEn: 'Entity coordinates are committed to the system.'
          },
          {
            stepNumber: 3,
            titleTr: 'Sektör ve Stajyer Kontenjanı Belirleme',
            titleEn: 'Specify Sector & Trainee Capacity',
            actionTr: 'Ana sektörünüzü seçin (Örn: Bilişim & Yazılım, Mekatronik & Otomasyon, Yeşil Enerji). Dönemlik ve yıllık maksimum öğrenci kontenjanını girin.',
            actionEn: 'Select primary sector. Define session capacity (e.g. 4-6 learners) and annual capacity.',
            uiTargetTr: 'Form Seçimleri: [Faaliyet Gösterilen Sektör ve Dönemlik Stajyer Kontenjanı]',
            uiTargetEn: 'Selections: [Vocational Sector & Trainee Capacity]',
            expectedStateTr: 'Okulların talep gönderirken göreceği kontenjan sınırı belirlenir.',
            expectedStateEn: 'Hosting limits are established for sending schools sending requests.'
          },
          {
            stepNumber: 4,
            titleTr: 'Kaydı Tamamlama',
            titleEn: 'Complete Tier 1 Registration',
            actionTr: 'Yetkili İrtibat Kişisi e-postasını girin, herkese açık listeleme onayını işaretleyin ve "Host Kaydını Tamamla" butonuna basın.',
            actionEn: 'Enter Contact Person email, check public display consent, and click "Complete Host Registration".',
            uiTargetTr: 'İletişim Alanı: [Yetkili E-posta Adresi] & Mavi Buton: [Host Kaydını Tamamla]',
            uiTargetEn: 'Field: [Contact Person Email] & Button: [Complete Host Registration]',
            expectedStateTr: 'Profil oluşturulur (Tier 1 %40 doluluk) ve kullanıcı doğrudan Host Dashboard ekranına yönlendirilir.',
            expectedStateEn: 'Profile is generated (Tier 1 40% completion) and user enters the Host Dashboard.'
          }
        ]
      },
      {
        id: 'host-dashboard-overview',
        audience: 'HOST',
        icon: '📊',
        titleTr: '2. Host Gösterge Paneli ve Doğrulama Durumu',
        titleEn: '2. Host Dashboard & Verification Lifecycle',
        summaryTr: 'Profil doluluk çubuğu (%40 - %100), doğrulama rozeti (Verified Partner), 3 yönetim kartı ve gelen staj talepleri yönetim havuzu.',
        summaryEn: 'Profile progress bar (40% - 100%), verification status badges, 3 management cards, and incoming inquiry inbox.',
        goalTr: 'Ev sahibinin kurumsal profil doluluğunu, resmi doğrulama durumunu ve okullardan gelen staj başvurularını anlık yönetmek.',
        goalEn: 'Centralize company showcase completeness, audit status, and manage incoming school internship requests.',
        route: '/',
        routeLabelTr: 'Host Paneline Git',
        routeLabelEn: 'Go to Host Dashboard',
        demoRole: 'HOST',
        keyHighlightsTr: [
          'Doğrulama Statüsü Rozeti: ✓ Doğrulanmış Partner / ⏳ İncelemede / ⚠️ Güncelleme Gerekiyor / ℹ️ Doğrulama Bekliyor.',
          'Profil Doluluk İlerleme Çubuğu: Tier 1 (%40), Tier 2 (%75), Tier 3 (%100).',
          '3 Yönetim Kartı: Tier 2 Vitrin Portföyü, Tier 3 Kurumsal KYC, Staj Kontenjanı & Kapasite.',
          'Gelen Hareketlilik Talepleri Bölümü: PENDING, ACCEPTED, DECLINED filtreleri.'
        ],
        keyHighlightsEn: [
          'Verification Status Badges: ✓ Verified Partner / ⏳ Under Review / ⚠️ Needs Update / ℹ️ Pending Review.',
          'Profile Progress Bar: Tier 1 (40%), Tier 2 (75%), Tier 3 (100%).',
          '3 Management Cards: Tier 2 Showcase Portfolio, Tier 3 KYC Documents, Trainee Capacity.',
          'Incoming Inquiries Section: PENDING, ACCEPTED, DECLINED filter tabs.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Host Dashboard Kartlarını İnceleme',
            titleEn: 'Review Host Dashboard KPI Cards',
            actionTr: 'Ana sayfadaki Host Dashboard ekranını açın. Doğrulama Rozetini ve profil doluluk oranını denetleyin.',
            actionEn: 'Access the Host Dashboard. Inspect Verification Badge and profile completion bar.',
            uiTargetTr: 'Ekran: [Ev Sahibi Yönetim Masası]',
            uiTargetEn: 'Screen: [Host Management Dashboard]',
            expectedStateTr: 'Aktif işletme verileri, doluluk yüzdesi ve yönetim kartları listelenir.',
            expectedStateEn: 'Active entity metrics, completion percentage, and management cards render.'
          },
          {
            stepNumber: 2,
            titleTr: 'Hızlı Eylemleri Kullanma',
            titleEn: 'Execute Quick Actions',
            actionTr: '"📁 Portföy & Tanıtım" ile vitrin bilgilerini güncelleyin veya "🛡️ Resmi Evrak & KYC" ile sicil belgelerini yükleyin.',
            actionEn: 'Click "📁 Portfolio & Showcase" to edit showcase, or "🛡️ Legal & KYC" to submit corporate audit files.',
            uiTargetTr: 'Hızlı İşlem Butonları: [📁 Portföy & Tanıtım] ve [🛡️ Resmi Evrak & KYC]',
            uiTargetEn: 'Action Buttons: [📁 Portfolio & Showcase] & [🛡️ Legal & KYC]',
            expectedStateTr: 'İlgili düzenleme penceresi açılır.',
            expectedStateEn: 'The respective editing modal opens.'
          }
        ]
      },
      {
        id: 'host-portfolio-tier2',
        audience: 'HOST',
        icon: '📁',
        titleTr: '3. Vitrin Portföyü ve Staj Müfredatı (Tier 2)',
        titleEn: '3. Public Showcase Portfolio & Sample Syllabus (Tier 2)',
        summaryTr: 'Erasmus+ deneyim yılı, ağırlanan öğrenci sayısı, atölye ve makine parkuru tanıtımı (CNC, robotik) ve örnek haftalık staj müfredatı (Syllabus PDF) yükleme.',
        summaryEn: 'Years of Erasmus+ experience, participant counts, workshop facilities description (CNC, robotics), and sample weekly syllabus PDF upload.',
        goalTr: 'Okulların arama motorunda işletmeyi öncelikli tercih etmesini sağlamak ve profil doluluğunu %75\'e yükseltmek.',
        goalEn: 'Elevate priority ranking in school partner searches and advance profile completion to 75%.',
        route: '/',
        routeLabelTr: 'Portföyü Aç',
        routeLabelEn: 'Open Portfolio',
        demoRole: 'HOST',
        keyHighlightsTr: [
          'Deneyim Metrikleri: Erasmus+ deneyim yılı ve bugüne kadar ağırlanan toplam öğrenci sayısı.',
          'Atölye Olanakları: 150-200 kelimelik atölye tanıtımı (Hangi CNC tezgahları, robotik hücreler, yazılımlar stajyerlere sunuluyor).',
          'Örnek Staj Müfredatı (Syllabus PDF): Haftalık staj programı yükleyen hostlar okul koordinatörlerinden %80 daha hızlı talep alır.'
        ],
        keyHighlightsEn: [
          'Track Record: Years of Erasmus+ experience and cumulative hosted participants count.',
          'Facility Description: 150-200 word summary of machinery, labs, and tools available to interns.',
          'Sample Weekly Syllabus PDF: Hosts providing curriculum receive inquiry responses 80% faster.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Portföy Modalını Başlatma',
            titleEn: 'Launch Portfolio Modal',
            actionTr: 'Host Dashboard üzerindeki "📁 Portföy & Tanıtım" veya "Vitrin Portföyünü Düzenle →" butonuna tıklayın.',
            actionEn: 'Click "📁 Portfolio & Showcase" on the Host Dashboard.',
            uiTargetTr: 'Buton: [📁 Portföy & Tanıtımı Düzenle]',
            uiTargetEn: 'Button: [📁 Edit Portfolio & Showcase]',
            expectedStateTr: 'Vitrin ve staj müfredatı düzenleme penceresi açılır.',
            expectedStateEn: 'Host portfolio dialog opens.'
          },
          {
            stepNumber: 2,
            titleTr: 'Deneyim ve Katılımcı Sayısı Girişi',
            titleEn: 'Enter Experience & Trainee Metrics',
            actionTr: 'Erasmus+ Deneyim Yılınızı (Örn: 5 yıl) ve Ağırlanan Katılımcı Sayısını (Örn: 64 öğrenci) girin.',
            actionEn: 'Enter Years of Experience (e.g. 5) and Total Participants Hosted (e.g. 64).',
            uiTargetTr: 'Form Alanları: [Erasmus+ Deneyim Yılı ve Ağırlanan Toplam Stajyer Sayısı]',
            uiTargetEn: 'Fields: [Years of Experience & Total Trainees Hosted]',
            expectedStateTr: 'Okul arama listesinde kurumsal deneyim rozeti belirir.',
            expectedStateEn: 'Experience badge appears on school directory cards.'
          },
          {
            stepNumber: 3,
            titleTr: 'Atölye Olanakları ve Logo URL\'si',
            titleEn: 'Workshop Machinery & Corporate Logo',
            actionTr: 'Atölyenizdeki makineleri, laboratuvarları ve yazılımları anlatan 150-200 kelimelik metin ve logo bağlantısı ekleyin.',
            actionEn: 'Provide 150-200 words describing CNC machinery, robotics, and software, plus logo link.',
            uiTargetTr: 'Form Alanları: [Atölye Olanakları ve Ekipman Tanıtımı] & [Logo Bağlantısı]',
            uiTargetEn: 'Fields: [Workshop Machinery & Facilities] & [Logo URL]',
            expectedStateTr: 'Okulların göreceği vitrin kartında işletme logonuz ve olanaklarınız yer alır.',
            expectedStateEn: 'Company logo and equipment summary render on public search cards.'
          },
          {
            stepNumber: 4,
            titleTr: 'Örnek Haftalık Staj Programı (Syllabus PDF) Ekleme',
            titleEn: 'Attach Sample Weekly Syllabus PDF',
            actionTr: 'Stajyerlerin 2-3 haftalık staj süresince gün gün ne öğreneceğini gösteren müfredat belgesi bağlantısını ekleyin ve kaydedin.',
            actionEn: 'Attach sample weekly curriculum link outlining daily learning activities and click Save.',
            uiTargetTr: 'Belge Alanı: [Örnek Haftalık Staj Programı / Müfredat Bağlantısı] & Buton: [Kaydet]',
            uiTargetEn: 'Field: [Sample Weekly Syllabus Link] & Button: [Save]',
            expectedStateTr: 'Profil doluluk oranı %75\'e yükselir; arama kartında "Müfredat Mevcut" rozeti yanar.',
            expectedStateEn: 'Profile completion reaches 75%; "Syllabus Available" badge is enabled.'
          }
        ]
      },
      {
        id: 'host-kyc-tier3',
        audience: 'HOST',
        icon: '🛡️',
        titleTr: '4. 15 Kriterli Resmi KYC & Onaylı Partner Rozeti (Tier 3)',
        titleEn: '4. 15-Point Institutional KYC & Verified Badge (Tier 3)',
        summaryTr: 'Resmi Ticaret Sicil Belgesi (Company Registration PDF), Vergi/VAT numarası, 7/24 kriz telefonu ve İSG (OHS) uygunluk taahhüdü.',
        summaryEn: 'Official Company Registration Document PDF, VAT number, 24/7 crisis emergency line, and OHS compliance declaration.',
        goalTr: 'Platform yöneticisinin resmi sicil denetiminden geçerek "✓ Doğrulanmış Partner" (Verified Badge) rozetini kazanmak ve %100 profil doluluğuna ulaşmak.',
        goalEn: 'Pass Platform Admin corporate audit to achieve the "✓ Verified Partner" badge and reach 100% profile completion.',
        route: '/',
        routeLabelTr: 'KYC Ekranını Aç',
        routeLabelEn: 'Open KYC',
        demoRole: 'HOST',
        keyHighlightsTr: [
          'Ticaret Sicil Belgesi (Company Registration Document PDF): Resmi devlet ticaret sicil tescili denetlenir.',
          'Vergi / VAT / KDV Numarası: Avrupa VIES sisteminde geçerli resmi kurumsal vergi kimliği.',
          '7/24 Acil Durum Kontağı: Stajyerlerin kriz ve sağlık durumlarında 24 saat ulaşılabilecek telefon ve kriz sorumlusu adı.',
          'İSG (OHS) Taahhüdü: İşletmenin ulusal İSG standartlarına tam uyumlu olduğu ve koruyucu donanım sağladığı beyanı.',
          'Admin Onayı: Belgeler incelendikten sonra işletmeye "VERIFIED" statüsü verilir.'
        ],
        keyHighlightsEn: [
          'Company Registration Document PDF: Official certificate of statutory business incorporation.',
          'VAT / Tax Number: Valid institutional tax identification audited against VIES standards.',
          '24/7 Emergency Line: Round-the-clock crisis phone number and designated emergency officer.',
          'OHS Statutory Declaration: Commitment to provide personal protective equipment and workplace safety.',
          'Admin Audit: Upon review, Platform Admin awards the authoritative "VERIFIED" partner badge.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Resmi Evrak & KYC Modalını Açma',
            titleEn: 'Open Legal KYC Modal',
            actionTr: 'Host Dashboard üzerindeki "🛡️ Resmi Evrak & KYC" veya "KYC Doğrulamasını Tamamla →" butonuna tıklayın.',
            actionEn: 'Click "🛡️ Legal & KYC" or "Complete KYC Verification →" on the Host Dashboard.',
            uiTargetTr: 'Buton: [🛡️ Resmi Evrak & KYC Doğrulaması]',
            uiTargetEn: 'Button: [🛡️ Legal Documents & KYC]',
            expectedStateTr: 'Kurumsal evrak yükleme ve doğrulama penceresi açılır.',
            expectedStateEn: 'Host verification dialog opens.'
          },
          {
            stepNumber: 2,
            titleTr: 'Ticaret Sicil Belgesi ve Vergi Numarası Girişi',
            titleEn: 'Upload Registration Certificate & VAT',
            actionTr: 'Resmi Ticaret Sicil Belgesi veya Faaliyet Belgesi PDF dosyasını yükleyin ve yasal Vergi / VAT numaranızı girin (Örn: DE312456789).',
            actionEn: 'Upload Company Registration PDF and enter statutory VAT number (e.g. DE312456789).',
            uiTargetTr: 'Yükleme Alanı: [Ticaret Sicil Belgesi PDF] ve Form Alanı: [Vergi / VAT No]',
            uiTargetEn: 'Upload: [Company Registration PDF] & Field: [VAT / Tax ID]',
            expectedStateTr: 'Yasal belgeler güvenli şifreli depolamaya yüklenir.',
            expectedStateEn: 'Statutory certificates are committed to secure storage.'
          },
          {
            stepNumber: 3,
            titleTr: '7/24 Acil Durum Telefonu ve İSG Taahhüdü',
            titleEn: 'Emergency Phone & OHS Confirmation',
            actionTr: 'Stajyerlerin acil durumlarında 24 saat ulaşılabilecek kriz telefonunu, yetkili adını girin ve İş Sağlığı ve Güvenliği taahhüt kutucuğunu onaylayın.',
            actionEn: 'Enter 24/7 emergency phone, crisis officer name, and check the OHS compliance confirmation box.',
            uiTargetTr: 'İletişim: [7/24 Acil Durum Telefonu] ve Onay Kutusu: [İş Sağlığı ve Güvenliği Taahhüdü]',
            uiTargetEn: 'Contact: [24/7 Emergency Phone] & Checkbox: [Workplace Health & Safety Confirmation]',
            expectedStateTr: 'Erasmus+ Kalite Standartları güvenlik şartları sağlanmış olur.',
            expectedStateEn: 'Erasmus+ Quality Standards safety criteria are satisfied.'
          },
          {
            stepNumber: 4,
            titleTr: 'İncelemeye Gönderme ve Rozet Kazanma',
            titleEn: 'Submit for Audit & Gain Verified Badge',
            actionTr: '"Doğrulama Belgelerini İncelemeye Gönder" butonuna tıklayın.',
            actionEn: 'Click "Submit Verification Documents for Audit".',
            uiTargetTr: 'Mavi Buton: [Doğrulama Belgelerini İncelemeye Gönder]',
            uiTargetEn: 'Button: [Submit Verification Documents for Audit]',
            expectedStateTr: 'Durum "UNDER_REVIEW" olur. Admin onayladığında "✓ Doğrulanmış Partner" rozeti kazanılır ve doluluk %100 olur.',
            expectedStateEn: 'Status updates to "UNDER_REVIEW"; upon Admin approval, the "✓ Verified Partner" badge is awarded (100% completion).'
          }
        ]
      },
      {
        id: 'host-inquiries-loi',
        audience: 'HOST',
        icon: '✉️',
        titleTr: '5. Gelen Talepleri Yönetme & Örnek LoI Taslağı Oluşturma',
        titleEn: '5. Inquiry Management & Sample LoI Draft Generation',
        summaryTr: 'Okullardan gelen staj başvurularını filtreleme, okul irtibatını inceleme, hazır şablonlarla yanıtlama ve referans LoI taslağı oluşturma.',
        summaryEn: 'Filter incoming school internship applications, inspect teacher contacts, respond via templates, and prepare reference LoI drafts.',
        goalTr: 'Talepleri değerlendirerek uygun gruplara ön kabul vermek ve okulların referans alabileceği örnek Letter of Intent (LoI) taslağını üretmek.',
        goalEn: 'Review inquiries, grant pre-acceptance, and generate sample Letter of Intent (LoI) drafts for institutional reference.',
        route: '/',
        routeLabelTr: 'Talepleri Yönet',
        routeLabelEn: 'Manage Inquiries',
        demoRole: 'HOST',
        keyHighlightsTr: [
          'Filtreleme Sekmeleri: Tüm Talepler (ALL), Yanıt Bekleyenler (PENDING), Ön Kabul Verilenler (ACCEPTED), Reddedilenler (DECLINED).',
          'Okul İrtibat Detayları: Öğretmen adı, unvanı, doğrudan e-posta ve telefon bilgisi.',
          'Hazır Karar Şablonları: ✓ Ön Kabul Ver (LoI), ✏️ Revizyon İste, ✕ Reddet.',
          'Örnek Letter of Intent (LoI) Taslağı: İşletmenizin OID ve kontenjan bilgilerini içeren referans ön kabul taslağını PDF olarak kaydetme.'
        ],
        keyHighlightsEn: [
          'Filter Tabs: All Inquiries (ALL), Pending (PENDING), Accepted (ACCEPTED), Declined (DECLINED).',
          'Coordinator Contact Card: Teacher name, title, direct email, and phone coordinates.',
          'Decision Templates: ✓ Accept (LoI), ✏️ Request Revision, ✕ Decline.',
          'Sample Letter of Intent (LoI) Draft: One-click export of a reference draft featuring host OID and reserved student quota.'
        ],
        parametersTable: [
          {
            labelTr: 'Şablon: Ön Kabul Ver (LoI)',
            labelEn: 'Template: Accept (LoI)',
            valueTr: '"Kontenjanımız uygundur, kurumunuzu ağırlamaktan memnuniyet duyarız. Referans alabileceğiniz örnek ön kabul taslağınız (LoI) oluşturulmuştur."',
            valueEn: '"Our hosting capacity is available. We are delighted to host your cohort. Your reference Letter of Intent (LoI) draft has been generated."'
          },
          {
            labelTr: 'Şablon: Revizyon İste',
            labelEn: 'Template: Request Revision',
            valueTr: '"Talep edilen tarihlerde yoğunluk bulunmaktadır. Tarihleri 2 hafta öne/sonraya alabilir miyiz? Veya öğrenci sayısını revize edebilir misiniz?"',
            valueEn: '"High workshop occupancy during requested dates. Could the mobility window be shifted by 2 weeks or participant count adjusted?"'
          },
          {
            labelTr: 'Şablon: Reddet',
            labelEn: 'Template: Decline',
            valueTr: '"İlgili dönemde atölye kapasitemiz doludur. Bir sonraki çağrıda işbirliği yapmaktan memnuniyet duyarız."',
            valueEn: '"Our workshop capacity is fully booked for this term. We look forward to cooperating in future Erasmus+ calls."'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Gelen Talepler Bölümünü Açma',
            titleEn: 'Navigate to Incoming Inquiries',
            actionTr: 'Host Dashboard altındaki "Gelen Hareketlilik Talepleri & Staj Başvuruları" bölümüne inin.',
            actionEn: 'Scroll to "Incoming Mobility Inquiries & Applications" on the Host Dashboard.',
            uiTargetTr: 'Bölüm: [Gelen Hareketlilik Talepleri ve Staj Başvuruları]',
            uiTargetEn: 'Section: [Incoming Mobility Inquiries & Applications]',
            expectedStateTr: 'Gönderen okul adı, OID, çağrı türü (KA121/KA122), öğrenci sayısı, tarihler ve talep edilen lojistik listelenir.',
            expectedStateEn: 'Sending school name, OID, call type, headcounts, dates, and requested logistics render.'
          },
          {
            stepNumber: 2,
            titleTr: 'Okul İrtibat Kişisini İnceleme',
            titleEn: 'Inspect Teacher Contact Coordinates',
            actionTr: 'Okulun proje koordinatörünü görmek için "ℹ️ Okul İrtibat" butonuna tıklayın.',
            actionEn: 'Click "ℹ️ School Contact" to inspect the project coordinator details.',
            uiTargetTr: 'Buton: [ℹ️ Okul İrtibat Bilgileri]',
            uiTargetEn: 'Button: [ℹ️ School Contact Details]',
            expectedStateTr: 'Okul yetkilisinin doğrudan e-posta ve telefon bilgisi pencerede açılır.',
            expectedStateEn: 'Direct coordinator contact details appear in modal.'
          },
          {
            stepNumber: 3,
            titleTr: 'Karar Verme ve Şablon Seçimi',
            titleEn: 'Execute Decision & Choose Template',
            actionTr: '"Yanıtla / Karar Ver" butonuna tıklayın. "✓ Ön Kabul Ver (LoI)", "✏️ Revizyon İste" veya "✕ Reddet" butonlarından birini seçip notunuzu yazın.',
            actionEn: 'Click "Reply / Decide". Select Accept (LoI), Request Revision, or Decline, and append custom notes.',
            uiTargetTr: 'Yanıt Penceresi: [Karar Ver] ve Buton: [✓ Ön Kabul Ver]',
            uiTargetEn: 'Decision Window: [Decide] & Button: [✓ Accept (LoI)]',
            expectedStateTr: 'Hazır profesyonel şablon metni yüklenir; karar veritabanına kaydedilir.',
            expectedStateEn: 'Pre-written template loads; status updates and school receives immediate notification.'
          },
          {
            stepNumber: 4,
            titleTr: 'Örnek Letter of Intent (LoI) Taslağı Üretme',
            titleEn: 'Generate & Export Letter of Intent (LoI) Draft',
            actionTr: 'Ön kabul verdiğiniz talep kartında "📄 LoI Belgesi (Ön Kabul Mektubu)" butonuna tıklayın ve "🖨️ Yazdır / PDF Olarak Kaydet" ile taslak PDF dosyasını kaydedin.',
            actionEn: 'Click "📄 LoI Document" on the accepted inquiry card and save draft via "🖨️ Print / Save as PDF".',
            uiTargetTr: 'Butonlar: [📄 LoI Belgesi Görüntüle] ve [🖨️ Yazdır / PDF]',
            uiTargetEn: 'Buttons: [📄 View LoI Document] & [🖨️ Print / PDF]',
            expectedStateTr: 'İşletmenizin OID ve kontenjan bilgilerini içeren örnek LoI taslağı PDF olarak cihazınıza indirilir.',
            expectedStateEn: 'Reference LoI draft featuring host OID and reserved quota is exported as PDF.'
          }
        ]
      }
    ]
  },
  {
    id: 'ADMIN',
    labelTr: 'Platform Yöneticisi (Platform Admin)',
    labelEn: 'Platform Administrator (Platform Admin)',
    icon: '🛡️',
    badgeTr: 'Sistem Yöneticileri ve Denetim Ekipleri',
    badgeEn: 'System Administrators & Audit Teams',
    descriptionTr: 'Platform yöneticileri için kayıtlı okulları, host kuruluşları, KYC doğrulama kuyruğunu ve canlı kullanıcı simülasyon çubuğunu denetleme rehberi.',
    descriptionEn: 'Administrative oversight manual for verifying host corporate KYC submissions, monitoring global inquiries, and operating the live user simulation banner.',
    topics: [
      {
        id: 'admin-simulation-banner',
        audience: 'ADMIN',
        icon: '🔄',
        titleTr: '1. Canlı Simülasyon Çubuğu (Admin Simulation Banner)',
        titleEn: '1. Persistent Live Simulation Banner',
        summaryTr: 'Platform yöneticisinin tek tıkla "Okul Görünümüne Geç" veya "Host Görünümüne Geç" yaparak sistemi son kullanıcı gözünden canlı test etmesi.',
        summaryEn: 'One-click switching between Admin, School, and Host views to audit the user experience in real time.',
        goalTr: 'Kullanıcıların karşılaştığı ekranları, form alanlarını ve buton işlevlerini hesap değiştirmeden doğrudan test etmek.',
        goalEn: 'Audit front-end workflows, form validations, and user actions directly without multi-account switching.',
        route: '/',
        routeLabelTr: 'Paneli Aç',
        routeLabelEn: 'Open Dashboard',
        keyHighlightsTr: [
          'Ekranın en üstünde sabitlenen koyu gri simülasyon çubuğu (Sticky Banner).',
          '"Okul Moduna Geç (Switch to School)": Okul gösterge paneli ve pipeline deneyimi.',
          '"Host Moduna Geç (Switch to Host)": Ev sahibi gösterge paneli ve talep havuzu deneyimi.',
          '"Yönetici Paneline Dön (Back to Admin)": Tek tıkla admin denetim masasına geri dönüş.'
        ],
        keyHighlightsEn: [
          'Sticky dark banner anchored permanently to top of screen.',
          '"Switch to School": Full student mobility pipeline and grant draft experience.',
          '"Switch to Host": Enterprise verification and incoming inquiry experience.',
          '"Back to Admin": Instant reversion to central platform oversight.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Simülasyon Çubuğunu Kullanma',
            titleEn: 'Activate Simulation Mode',
            actionTr: 'Ekranın üstündeki koyu simülasyon çubuğunda "🏛️ Okul Görünümüne Geç" veya "🏢 Host Görünümüne Geç" butonuna tıklayın.',
            actionEn: 'On the top sticky banner, click "Switch to School" or "Switch to Host".',
            uiTargetTr: 'Simülasyon Çubuğu: [Okul / Host Görünümüne Geç]',
            uiTargetEn: 'Simulation Banner: [Switch to School / Switch to Host]',
            expectedStateTr: 'Ekran anında seçilen role göre şekillenir; tüm veriler ilgili rolün gözünden canlı çalışır.',
            expectedStateEn: 'The entire UI morphs into the selected role with live interactive state.'
          }
        ]
      },
      {
        id: 'admin-kyc-queue',
        audience: 'ADMIN',
        icon: '⚖️',
        titleTr: '2. Ev Sahibi KYC Onay Kuyruğu',
        titleEn: '2. Host Corporate KYC Audit Queue',
        summaryTr: 'Host işletmelerin yüklediği ticaret sicil belgelerini ve vergi numaralarını inceleme, "VERIFIED" statüsü verme veya revizyon isteme.',
        summaryEn: 'Review company registration certificates and VAT IDs submitted by hosts, award "VERIFIED" badges, or request revisions.',
        goalTr: 'Avrupa ev sahibi ağının güvenilirliğini, ticaret sicil geçerliliğini ve İSG taahhütlerini garanti altına almak.',
        goalEn: 'Safeguard host network credibility, verify statutory registration, and enforce OHS safety compliance.',
        route: '/',
        routeLabelTr: 'Denetim Masası',
        routeLabelEn: 'Audit Desk',
        keyHighlightsTr: [
          'Ticaret sicil PDF belgesi görüntüleyici.',
          'Vergi / VAT numarası denetim alanı.',
          'Onay Butonu: "✓ Doğrula ve Verified Rozeti Ver" -> Host profili %100 olur.',
          'Revizyon Butonu: "⚠️ Eksik Belge / Güncelleme İste" -> Host bildirim alır.'
        ],
        keyHighlightsEn: [
          'Registration PDF certificate inspector.',
          'VAT / Tax number audit interface.',
          'Approval Action: "✓ Verify & Award Verified Badge" -> Elevates host profile to 100%.',
          'Revision Action: "⚠️ Request Update" -> Dispatches revision alert to host.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'KYC Onay Havuzunu Açma',
            titleEn: 'Open KYC Queue Dialog',
            actionTr: 'Header\'daki "🛡️ KYC Onay Havuzu" butonuna tıklayın.',
            actionEn: 'Click "🛡️ KYC Audit Queue" in the platform header.',
            uiTargetTr: 'Pencere: [Ev Sahibi KYC Onay Havuzu]',
            uiTargetEn: 'Modal: [Host KYC Verification Queue]',
            expectedStateTr: 'İnceleme bekleyen (UNDER_REVIEW) ev sahibi işletmeler listelenir.',
            expectedStateEn: 'All host enterprises pending verification (UNDER_REVIEW) are displayed.'
          },
          {
            stepNumber: 2,
            titleTr: 'Belgeleri Denetleme ve Karar Verme',
            titleEn: 'Audit Documents & Issue Decision',
            actionTr: 'Yüklenen ticaret sicil belgesini inceleyin, vergi numarasını doğrulayın ve "✓ Onayla" butonuna basarak "VERIFIED" rozetini verin.',
            actionEn: 'Inspect the uploaded registration PDF, verify the VAT number, and click "✓ Approve" to grant Verified status.',
            uiTargetTr: 'Onay Butonu: [✓ Doğrula ve Onayla]',
            uiTargetEn: 'Button: [✓ Verify & Approve]',
            expectedStateTr: 'İşletmenin rozeti güncellenir; okul arama sonuçlarında en üst sıraya yükseltilir.',
            expectedStateEn: 'Host badge is updated; entity is promoted to top tier in school searches.'
          }
        ]
      },
      {
        id: 'admin-governance-audit',
        audience: 'ADMIN',
        icon: '⚖️',
        titleTr: '3. Platform Denetimi, KVKK/GDPR ve Güvenlik Bütünlüğü',
        titleEn: '3. Governance Audit, KVKK/GDPR & Security Integrity',
        summaryTr: 'Platform içi kurumların kimlik doğrulaması, şüpheli etkinliklerin tespiti, KVKK/GDPR şifreleme logları ve veri güvenliği kontrolleri.',
        summaryEn: 'Institutional identity auditing, suspicious activity detection, KVKK/GDPR encryption logs, and security oversight.',
        goalTr: 'Platform ekosisteminin mevzuata tam uyumlu, kötü niyetli aracılardan arındırılmış ve güvenilir kalmasını sağlamak.',
        goalEn: 'Ensure the platform ecosystem remains strictly compliant, free from bad actors, and completely transparent.',
        route: '/admin',
        routeLabelTr: 'Yönetim Masasını Aç',
        routeLabelEn: 'Open Admin Deck',
        keyHighlightsTr: [
          'Aracı / Danışmanlık Ayıklama: Sadece doğrudan ev sahibi olan gerçek işletmelerin ve onaylı VET okullarının listelenmesi denetlenir.',
          'Hibe Dolandırıcılığı Koruması: Sahte LoI veya şişirilmiş maliyet talepleri sistem uyarı mekanizmalarıyla tespit edilir.',
          'Veri Koruma Denetimi: Cloudflare R2 üzerindeki belgelerin erişim izinleri ve saklama süreleri periyodik olarak kontrol edilir.'
        ],
        keyHighlightsEn: [
          'Intermediary Filtering: Strict screening to ensure only genuine direct host enterprises and accredited schools are listed.',
          'Grant Fraud Prevention: Detection algorithms flag fraudulent LoI generation or artificially inflated fee structures.',
          'Data Vault Auditing: Periodic verification of encryption controls, retention periods, and access credentials on Cloudflare R2.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Yönetici Denetim Kayıtlarını İnceleyin',
            titleEn: 'Inspect Audit Logs',
            actionTr: 'Yönetici konsolundaki güvenlik paneline girerek şüpheli veya eksik evraklı kurumları listeleyin.',
            actionEn: 'Access the admin console security deck to review flagged or incomplete registrations.',
            uiTargetTr: 'Panel: [Yönetim Masası / Güvenlik Denetimi]',
            uiTargetEn: 'Panel: [Admin Deck / Security Audit]',
            expectedStateTr: 'Şüpheli aktivite uyarıları ve denetim kayıtları görüntülenir.',
            expectedStateEn: 'Audit trails and risk flags are rendered in the dashboard.'
          }
        ]
      }
    ]
  },
  {
    id: 'SETTINGS',
    labelTr: 'Ayarlar, Profil & Görünüm',
    labelEn: 'Settings, Profile & Accessibility',
    icon: '⚙️',
    badgeTr: 'WCAG 2.1 AA Görünüm, Hesap & Sistem Tercihleri',
    badgeEn: 'WCAG 2.1 AA Display, Account & Preferences',
    descriptionTr: 'Erişilebilirlik (yüksek kontrast, yazı boyutu, animasyon azaltma), kullanıcı ve kurum profili yönetimi, OID düzenleme, çok dilli (TR/EN) sistem ve canlı simülasyon veri yönetimi kılavuzu.',
    descriptionEn: 'Comprehensive guide covering WCAG 2.1 AA accessibility (high contrast, font scaling, motion reduction), user & institution profile setup, OID updates, bilingual (TR/EN) locale, and live interactive simulation data.',
    topics: [
      {
        id: 'settings-display-accessibility',
        audience: 'SETTINGS',
        icon: '👁️',
        titleTr: '1. Görünüm, Okuma & WCAG 2.1 AA Erişilebilirlik Ayarları',
        titleEn: '1. Display, Reading & WCAG 2.1 AA Accessibility Preferences',
        summaryTr: 'Yazı boyutu ölçekleme (Normal, Büyük, Ekstra Büyük), Yüksek Kontrast (Koyu/Yüksek Kontrast Modu), Bağlantıların Altını Çizme ve Animasyonları Azaltma (Reduced Motion) kontrolleri.',
        summaryEn: 'Font scaling (Normal, Large, Extra Large), High Contrast (Dark/High-Contrast Mode), Link Underlining, and Motion Reduction (WCAG 2.1 AA compliance).',
        goalTr: 'Platformu her görme yetisi ve cihaz koşulunda rahatça okumak, göz yorgunluğunu önlemek ve engelsiz erişim sağlamak.',
        goalEn: 'Ensure effortless legibility, eye comfort, and barrier-free access under all lighting conditions and visual needs.',
        route: '/',
        routeLabelTr: 'Üst Menüden Ayarları Aç',
        routeLabelEn: 'Open from Top Navigation',
        keyHighlightsTr: [
          'Üst Menüde "Görünüm & Okuma" Butonu: Ekranın sağ üst köşesinde Type ikonuyla her an erişilebilirdir.',
          'Yazı Boyutu Ölçekleme: Normal (14px/16px), Büyük (18px) ve Ekstra Büyük (20px) seçenekleri tüm metinleri yeniden boyutlandırır.',
          'Yüksek Kontrast Modu: Arka planı derin siyaha dönüştürür, sarı/cyan yüksek kontrast vurgularıyla metin netliğini maksimize eder.',
          'Bağlantıların Altını Çiz: Renk körlüğü veya okuma güçlüğü çeken kullanıcılar için tıklanabilir tüm metinlerin altına çizgi ekler.',
          'Animasyonları Azalt (Reduced Motion): Baş dönmesi veya dikkat dağınıklığını önlemek için geçiş ve kayma efektlerini devre dışı bırakır.',
          'Tek Tıkla Sıfırlama: "Varsayılana Sıfırla" butonuyla tüm kişisel görünüm tercihlerini fabrika ayarlarına döndürür.'
        ],
        keyHighlightsEn: [
          'Header "Display & Reading" Trigger: Accessible anytime from the top-right header via Type icon.',
          'Font Size Scaling: Normal (14px/16px), Large (18px), and Extra Large (20px) instantly rescales platform typography.',
          'High Contrast Mode: Inverts interface to pitch black with vibrant yellow/cyan contrast highlights for maximum legibility.',
          'Underline Links: Adds distinct underlines beneath all clickable interactive anchors for low-vision and color-blind users.',
          'Reduced Motion: Disables transitions, spinners, and parallax animations to eliminate vestibular trigger risks.',
          'One-Click Reset: "Reset to Default" button restores all display preferences to standard factory values.'
        ],
        parametersTable: [
          {
            labelTr: 'Ayar: Yazı Boyutu Seçenekleri',
            labelEn: 'Setting: Font Size Options',
            valueTr: 'Normal (100%), Büyük (115% - 18px), Ekstra Büyük (130% - 20px)',
            valueEn: 'Normal (100%), Large (115% - 18px), Extra Large (130% - 20px)'
          },
          {
            labelTr: 'Ayar: Yüksek Kontrast / Koyu Mod',
            labelEn: 'Setting: High Contrast / Dark Mode',
            valueTr: 'WCAG 2.1 AA 7:1 kontrast oranlı koyu tema',
            valueEn: 'WCAG 2.1 AA compliant 7:1 contrast ratio dark aesthetic'
          },
          {
            labelTr: 'Ayar: Animasyonları Azalt (Reduced Motion)',
            labelEn: 'Setting: Reduced Motion',
            valueTr: 'CSS prefers-reduced-motion ve Tailwind animasyon iptali',
            valueEn: 'CSS prefers-reduced-motion override and transition dampening'
          },
          {
            labelTr: 'Depolama: Yerel Tercih Kalıcılığı',
            labelEn: 'Storage: Local Persistence',
            valueTr: 'Tarayıcı localStorage üzerinde güvenle saklanır, sayfa yenilendiğinde kaybolmaz',
            valueEn: 'Persisted in browser localStorage across reloads and sessions'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Görünüm Menüsünü Açın',
            titleEn: 'Open Display Menu',
            actionTr: 'Üst menü çubuğunun sağ tarafındaki "Görünüm & Okuma" (Type ikonu) butonuna tıklayın.',
            actionEn: 'Click the "Display & Reading" (Type icon) button in the top right navigation bar.',
            uiTargetTr: 'Buton: [Type İkonu - Görünüm & Okuma]',
            uiTargetEn: 'Button: [Type Icon - Display & Reading]',
            expectedStateTr: 'Görünüm ve Okuma Tercihleri açılır paneli görüntülenir.',
            expectedStateEn: 'Display & Reading Options dropdown panel appears.'
          },
          {
            stepNumber: 2,
            titleTr: 'Tercihlerinizi Özelleştirin',
            titleEn: 'Customize Your Reading Preferences',
            actionTr: 'İhtiyacınıza göre "Büyük" yazı boyutunu seçin, "Yüksek Kontrast" veya "Bağlantıların Altını Çiz" düğmelerini açın.',
            actionEn: 'Select "Large" typography, toggle "High Contrast", or enable "Underline Links" as needed.',
            uiTargetTr: 'Panel Kontrolleri: [Yazı Boyutu Butonları & Geçiş Anahtarları]',
            uiTargetEn: 'Panel Controls: [Font Size Radios & Toggle Switches]',
            expectedStateTr: 'Tüm sayfa anında seçilen ayarlarla güncellenir ve tercihiniz kaydedilir.',
            expectedStateEn: 'The entire UI dynamically re-renders with your settings and persists locally.'
          }
        ]
      },
      {
        id: 'settings-profile-account',
        audience: 'SETTINGS',
        icon: '👤',
        titleTr: '2. Kullanıcı Hesabı & Kurumsal Profil Yönetimi',
        titleEn: '2. User Account & Institutional Profile Management',
        summaryTr: 'Profil fotoğrafı yükleme/kaldırma, ad-soyad, e-posta, Clerk hesap ve şifre güvenliği, kurum OID ve akreditasyon durumu güncelleme.',
        summaryEn: 'Profile photo upload/removal, full name, email, Clerk account security, institution OID and accreditation status updates.',
        goalTr: 'Kullanıcının ve temsil ettiği okul/ev sahibi kurumun yasal bilgilerini güncel tutmak, oturum güvenliğini sağlamak.',
        goalEn: 'Keep institutional and personal credentials up-to-date and maintain secure multi-factor authentication.',
        route: '/profile',
        routeLabelTr: 'Profil Sayfasına Git',
        routeLabelEn: 'Go to Profile Page',
        keyHighlightsTr: [
          'Profil Sayfası (/profile): Üst menüde kullanıcı avatarına veya ismine tıklanarak ulaşılır.',
          'Fotoğraf Yükleme / Kaldırma: Maksimum 5 MB boyutunda PNG, JPG, WebP veya GIF fotoğrafı doğrudan yüklenebilir.',
          'Clerk Hesap ve Güvenlik: "Hesap Ayarları" butonuyla şifre değiştirme, iki adımlı doğrulama (2FA) ve bağlı hesaplar yönetilir.',
          'Kurum Bilgilerini Düzenleme: Okul OID numarası, şehir, akreditasyon durumu ve hazırbulunuşluk skoru takip edilir.',
          'Güvenli Çıkış (Sign Out): "Oturumu Kapat" butonuyla tüm yerel oturum jetonları temizlenir.'
        ],
        keyHighlightsEn: [
          'Profile Portal (/profile): Reached via user avatar or name link in the top header.',
          'Photo Upload / Removal: Upload custom avatars up to 5 MB (PNG, JPG, WebP, GIF) with direct preview and delete.',
          'Clerk Account & Security: Access password changes, two-factor authentication (2FA), and connected logins via "Account Settings".',
          'Institutional Data Editing: Inspect and modify school OID, city, accreditation status, and mobility readiness score.',
          'Secure Sign Out: Clears all active auth tokens and returns to the guest landing view.'
        ],
        parametersTable: [
          {
            labelTr: 'Profil Alanı: Fotoğraf Yükleme',
            labelEn: 'Field: Photo Upload',
            valueTr: 'Maksimum 5 MB (PNG, JPEG, WebP, GIF formatları)',
            valueEn: 'Max 5 MB (PNG, JPEG, WebP, GIF supported)'
          },
          {
            labelTr: 'Profil Alanı: Kurum OID Numarası',
            labelEn: 'Field: Organisation OID',
            valueTr: '8 haneli E-OID (Örn: E10389241, onboarding üzerinden düzenlenebilir)',
            valueEn: '8-digit E-OID (e.g. E10389241, editable via onboarding)'
          },
          {
            labelTr: 'Güvenlik Protokolü: Kimlik Doğrulama',
            labelEn: 'Security: Authentication',
            valueTr: 'Clerk SOC-2 Tip II sertifikalı bulut kimlik yönetimi',
            valueEn: 'Clerk SOC-2 Type II certified cloud identity management'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Profil Masasına Gidin',
            titleEn: 'Open Profile Dashboard',
            actionTr: 'Üst menü çubuğundaki kullanıcı avatarınıza veya "Profil" linkine tıklayın.',
            actionEn: 'Click your user avatar or "Profile" in the navigation bar.',
            uiTargetTr: 'Menü Butonu: [Kullanıcı Avatarı / Profil]',
            uiTargetEn: 'Nav Link: [User Avatar / Profile]',
            expectedStateTr: 'Kişisel bilgiler, bağlı kurum detayları ve güvenlik kartı listelenir.',
            expectedStateEn: 'Personal details, linked institution profile, and security controls open.'
          },
          {
            stepNumber: 2,
            titleTr: 'Kurum veya Hesap Bilgilerinizi Güncelleyin',
            titleEn: 'Update Details or Security',
            actionTr: 'Kurum OID ve şehir bilgilerini güncellemek için "Düzenle" linkine; şifre ve 2FA için "Hesap Ayarları" butonuna tıklayın.',
            actionEn: 'Click "Edit" to modify school OID or "Account Settings" to manage passwords and 2FA.',
            uiTargetTr: 'Butonlar: [Düzenle] & [Hesap Ayarları]',
            uiTargetEn: 'Buttons: [Edit] & [Account Settings]',
            expectedStateTr: 'Değişiklikler anında veritabanına kaydedilir.',
            expectedStateEn: 'Modifications are committed securely to the persistent store.'
          }
        ]
      },
      {
        id: 'settings-localization-language',
        audience: 'SETTINGS',
        icon: '🌍',
        titleTr: '3. Dil ve Yerelleştirme Tercihi (TR / EN)',
        titleEn: '3. Bilingual Localization & Language Settings (TR / EN)',
        summaryTr: 'Türkçe ve İngilizce dilleri arasında anında geçiş, iki dilli bütçe formülleri, mevzuat rehberleri ve resmi başvuru taslağı dışa aktarımı.',
        summaryEn: 'Instant switching between Turkish and English, dynamic bilingual budget tables, regulatory guidelines, and proposal exports.',
        goalTr: 'Yerel okul ekiplerinin Türkçe, Avrupalı ortakların ve denetçilerin İngilizce olarak platformu sorunsuz kullanmasını sağlamak.',
        goalEn: 'Enable Turkish VET teams to operate in Turkish while European partners and auditors operate in English seamlessly.',
        route: '/',
        routeLabelTr: 'Üst Menüden Dili Değiştir',
        routeLabelEn: 'Toggle Language from Header',
        keyHighlightsTr: [
          'Üst Menüde Dil Değiştirici: 🇹🇷 TR / 🇬🇧 EN bayrak menüsü ile tek tıkla dil değişimi.',
          'Eşzamanlı Dinamik Çeviri: Tüm arayüz butonları, rehber adımları, hata mesajları ve hibe açıklamaları anında güncellenir.',
          'Dışa Aktarma Dili: Başvuru taslakları ve LoI belgeleri seçili dile göre üretilir (örneğin yabancı ev sahibi için İngilizce LoI).',
          'Kalıcı Dil Tercihi: Seçtiğiniz dil çerezlerde ve yerel hafızada saklanır, sonraki ziyaretlerde hatırlanır.'
        ],
        keyHighlightsEn: [
          'Header Language Selector: Instant switch via 🇹🇷 TR / 🇬🇧 EN selector dropdown in the top bar.',
          'Synchronous Re-Rendering: All button labels, guidance narratives, validation alerts, and grant tables update immediately.',
          'Export Locale: Application dossiers and Letters of Intent render in the active language (e.g. English LoIs for foreign hosts).',
          'Persistent Language State: Selected language is stored in browser cookie and localStorage across future visits.'
        ],
        parametersTable: [
          {
            labelTr: 'Desteklenen Diller',
            labelEn: 'Supported Languages',
            valueTr: 'Türkçe (tr) ve İngilizce (en)',
            valueEn: 'Turkish (tr) and English (en)'
          },
          {
            labelTr: 'Kapsam: Çift Dilli Belgeler',
            labelEn: 'Scope: Bilingual Documents',
            valueTr: 'Kullanım Kılavuzu, LoI Taslakları, 5 Adımlı Pipeline, Bütçe Tabloları',
            valueEn: 'User Manual, LoI Drafts, 5-Step Pipeline, Subsistence Calculators'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Dil Seçim Menüsüne Tıklayın',
            titleEn: 'Click Language Dropdown',
            actionTr: 'Üst çubuktaki bayrak simgesine (🇹🇷 TR veya 🇬🇧 EN) tıklayın.',
            actionEn: 'Click the flag dropdown (🇹🇷 TR or 🇬🇧 EN) in the navigation bar.',
            uiTargetTr: 'Menü Elemanı: [Dil Seçici Bayrak]',
            uiTargetEn: 'Nav Element: [Language Selector Flag]',
            expectedStateTr: 'Türkçe ve İngilizce seçeneklerini içeren menü açılır.',
            expectedStateEn: 'Dropdown showing Turkish and English options expands.'
          },
          {
            stepNumber: 2,
            titleTr: 'İstediğiniz Dili Seçin',
            titleEn: 'Choose Desired Language',
            actionTr: 'Kullanmak istediğiniz dile tıklayın; tüm sayfa anında o dile çevrilir.',
            actionEn: 'Select preferred locale; the entire interface transforms dynamically.',
            uiTargetTr: 'Seçenek: [🇹🇷 Türkçe] veya [🇬🇧 English]',
            uiTargetEn: 'Option: [🇹🇷 Türkçe] or [🇬🇧 English]',
            expectedStateTr: 'Dil tercihi kaydedilir ve arayüz seçilen dilde görüntülenir.',
            expectedStateEn: 'Locale is saved to localStorage and the UI refreshes instantly.'
          }
        ]
      },
      {
        id: 'settings-simulation-demo',
        audience: 'SETTINGS',
        icon: '⚡',
        titleTr: '4. İnteraktif Simülasyon & Canlı Demo Veri Yönetimi',
        titleEn: '4. Interactive Simulation & Live Demo Data Management',
        summaryTr: 'Kayıt olmadan platformu test etmek için akredite meslek lisesi (Kapadokya VET) ve Berlin ev sahibi işletme hazır demo verilerini yükleme ve sıfırlama.',
        summaryEn: 'Load pre-configured realistic datasets (Kapadokya Accredited VET / Berlin Host Solutions) to test workflows without registering.',
        goalTr: 'Platformun tüm özelliklerini, hesaplayıcılarını ve LoI üretim mekanizmasını gerçekçi verilerle canlı deneyimlemek.',
        goalEn: 'Experience all calculators, pipeline steps, and LoI generators with realistic institutional datasets.',
        route: '/',
        routeLabelTr: 'Ana Sayfada Demoyu Başlat',
        routeLabelEn: 'Launch Demo on Home',
        demoRole: 'SCHOOL',
        keyHighlightsTr: [
          'Simülasyon Çubuğu: Ekranın en üstünde veya kılavuz kenar çubuğunda "Canlı İnteraktif Simülasyon" alanı yer alır.',
          'Okul Demosu: 6 Siber Güvenlik öğrencisi, KA121 akredite lise, onaylı hibe ve hazır staj talepleriyle tam bir okul senaryosu yükler.',
          'Ev Sahibi Demosu: Berlin merkezli Tier 2 portföyü onaylı, gelen staj taleplerini bekleyen bir Avrupa işletmesi senaryosu yükler.',
          'Tek Tıkla Sıfırlama: Yüklenen demo verileri tarayıcı hafızasını temizleyerek istediğiniz an sıfırlanabilir.',
          'Hibe Hesabı Testi: Demo verisiyle mesafe bandı, harcırah ve yeşil seyahat hesaplamalarını anında test edebilirsiniz.'
        ],
        keyHighlightsEn: [
          'Simulation Bar: Positioned at the top of the interface and in the guide sidebar for instant sandbox access.',
          'School Demo: Loads Kapadokya VET (KA121 accredited, 6 cybersecurity interns, pre-calculated grant budget, and active sent inquiries).',
          'Host Demo: Loads Berlin VET Training Solutions GmbH (Tier 2 verified showcase, incoming internship inquiries awaiting LoI decisions).',
          'Zero Risk Reset: Sandbox state can be cleared or reloaded anytime with a single click.',
          'Instant Subsistence Test: Test distance bands, subsistence tables, and green travel formulas with live realistic data.'
        ],
        parametersTable: [
          {
            labelTr: 'Demo Profili: Meslek Lisesi',
            labelEn: 'Demo Profile: Vocational School',
            valueTr: 'Kapadokya Teknik Lisesi (E10999001 - KA121 Akredite)',
            valueEn: 'Kapadokya Technical High School (E10999001 - KA121 Accredited)'
          },
          {
            labelTr: 'Demo Profili: Avrupa Ev Sahibi',
            labelEn: 'Demo Profile: European Host',
            valueTr: 'Berlin VET Training Solutions GmbH (DE - Tier 2 Onaylı)',
            valueEn: 'Berlin VET Training Solutions GmbH (DE - Tier 2 Verified)'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Demo Yükleme Butonuna Basın',
            titleEn: 'Click Demo Preset Trigger',
            actionTr: 'Kılavuz sol kenarındaki "⚡ Canlı İnteraktif Simülasyon" kutusundan "🏛️ Okul Demosu" veya "🏢 Ev Sahibi Demosu" butonuna tıklayın.',
            actionEn: 'Click "🏛️ School Demo" or "🏢 Host Demo" inside the guide sidebar simulation panel.',
            uiTargetTr: 'Buton: [🏛️ Okul Demosu] veya [🏢 Ev Sahibi Demosu]',
            uiTargetEn: 'Button: [🏛️ School Demo] or [🏢 Host Demo]',
            expectedStateTr: 'Seçilen kurumun tüm gerçekçi verileri, staj talepleri ve bütçeleri sisteme yüklenir.',
            expectedStateEn: 'Realistic school/host profile, inquiries, and budget calculations are loaded.'
          },
          {
            stepNumber: 2,
            titleTr: 'Modülleri Canlı Deneyimleyin',
            titleEn: 'Interact with Live Modules',
            actionTr: 'Yüklenen verilerle 5 adımlı pipeline\'ı gezinin, harcırah hesaplayın veya gelen staj talebine LoI metni oluşturun.',
            actionEn: 'Navigate through pipeline steps, calculate subsistence, or review inquiry LoI generation with loaded data.',
            uiTargetTr: 'Modüller: [/school/pipeline & Host Masası]',
            uiTargetEn: 'Modules: [/school/pipeline & Host Dashboard]',
            expectedStateTr: 'Tüm butonlar ve formlar gerçekçi verilerle çalışır durumda deneyimlenir.',
            expectedStateEn: 'All tools and interactive components operate with real-time responsive behavior.'
          }
        ]
      },
      {
        id: 'settings-privacy-compliance',
        audience: 'SETTINGS',
        icon: '🛡️',
        titleTr: '5. Veri Güvenliği, KVKK / GDPR & Şifreli Saklama',
        titleEn: '5. Data Privacy, KVKK / GDPR & Encrypted Storage',
        summaryTr: '6698 sayılı KVKK ve AB GDPR uyumluluğu, Cloudflare R2 üzerinde şifreli belge saklama, çerez tercihleri ve veri silme hakları.',
        summaryEn: 'Compliance with Turkish KVKK and EU GDPR, Cloudflare R2 encrypted document storage, cookie controls, and data erasure rights.',
        goalTr: 'Okul ve işletme verilerinin Avrupa ve Türk kişisel veri mevzuatına %100 uygun şekilde korunduğunu bilerek güvenle işlem yapmak.',
        goalEn: 'Conduct mobility operations with confidence under 100% compliant Turkish KVKK and European GDPR data protection standards.',
        route: '/kvkk',
        routeLabelTr: 'KVKK Metnini Oku',
        routeLabelEn: 'Read Privacy Terms',
        keyHighlightsTr: [
          'KVKK & GDPR Uyumluluğu: Platform, hem 6698 sayılı Türk Kişisel Verilerin Korunması Kanunu\'na hem de AB Genel Veri Koruma Tüzüğü\'ne (GDPR) tam uyumludur.',
          'Şifreli Bulut Depolama: Yüklenen ticaret sicil gazeteleri, vergi levhaları ve öğrenci evrakları Cloudflare R2 üzerinde AES-256 ile şifrelenir.',
          'Veri Minimizasyonu: Yalnızca Erasmus+ hibe başvurusu ve eşleştirme için zorunlu olan asgari veriler talep edilir.',
          'Açık Rıza ve İptal Hakkı: Kullanıcılar diledikleri zaman hesap ve kurum verilerinin silinmesini talep edebilirler.',
          'Yasal Uyarı & Sorumluluk Reddi: Platform bağımsız bir teknik destek ağıdır; nihai hibe tahsis kararı Türkiye Ulusal Ajansı\'na aittir.'
        ],
        keyHighlightsEn: [
          'Dual KVKK & GDPR Compliance: Certified compliance with both Turkish Law No. 6698 and European Union GDPR regulations.',
          'Encrypted Cloud Vault: Trade registry PDFs, tax certificates, and student records are encrypted via AES-256 on Cloudflare R2.',
          'Data Minimization: Only data strictly necessary for Erasmus+ vetting and proposal generation is gathered.',
          'Right to Erasure: Users possess full statutory rights to inspect, export, or permanently purge their data.',
          'Regulatory Disclaimer: The platform is an independent advisory framework; final grant awards are determined solely by the National Agency.'
        ],
        parametersTable: [
          {
            labelTr: 'Şifreleme Standardı',
            labelEn: 'Encryption Standard',
            valueTr: 'AES-256 bekleyen veri şifrelemesi ve TLS 1.3 aktarım güvenliği',
            valueEn: 'AES-256 data at rest encryption and TLS 1.3 transport security'
          },
          {
            labelTr: 'Yasal Dayanak',
            labelEn: 'Legal Basis',
            valueTr: 'KVKK Madde 5/2-c (Sözleşmenin kurulması/ifası) & GDPR Madde 6(1)(b)',
            valueEn: 'KVKK Article 5/2-c & EU GDPR Article 6(1)(b)'
          }
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Yasal Metinleri İnceleyin',
            titleEn: 'Access Legal Disclosures',
            actionTr: 'Sayfa altındaki (footer) "KVKK Aydınlatma Metni", "Kullanım Şartları" veya "Gizlilik Politikası" linklerine tıklayın.',
            actionEn: 'Click "KVKK Disclosure", "Terms of Service", or "Privacy Policy" links in the footer.',
            uiTargetTr: 'Footer Linkleri: [/kvkk & /terms & /privacy]',
            uiTargetEn: 'Footer Links: [/kvkk & /terms & /privacy]',
            expectedStateTr: 'Mevzuata uygun detaylı hukuki aydınlatma metinleri açılır.',
            expectedStateEn: 'Comprehensive statutory legal disclosures open.'
          },
          {
            stepNumber: 2,
            titleTr: 'Veri Güvenliği Haklarınızı Kullanın',
            titleEn: 'Exercise Data Protection Rights',
            actionTr: 'Veri silme veya bilgi alma talepleriniz için iletişim sekmesinden resmi başvuruda bulunabilirsiniz.',
            actionEn: 'Submit data access or erasure requests through the contact portal.',
            uiTargetTr: 'İletişim Kanalı: [/contact - Veri Sorumlusu İrtibat]',
            uiTargetEn: 'Contact Channel: [/contact - Data Protection Officer]',
            expectedStateTr: 'Talebiniz yasal süre içinde işleme alınır.',
            expectedStateEn: 'Request is queued and processed within statutory timelines.'
          }
        ]
      }
    ]
  },
  {
    id: 'ARCHITECTURE',
    labelTr: 'Platform Mimarisi & Hibe Modelleri',
    labelEn: 'Platform Architecture & Grants',
    icon: '🌐',
    badgeTr: 'EMaaS & Erasmus+ Standartları',
    badgeEn: 'EMaaS & Erasmus+ Standards',
    descriptionTr: 'Erasmus Mobility Management as a Service (EMaaS) mimarisi, KA121 ve KA122 hibe modelleri arasındaki farklar, taksonomi ve yapay zeka entegrasyonu.',
    descriptionEn: 'EMaaS cloud architecture, structural differences between KA121 and KA122 calls, European taxonomy, and AI engine guardrails.',
    topics: [
      {
        id: 'arch-grants-comparison',
        audience: 'ARCHITECTURE',
        icon: '⚖️',
        titleTr: 'KA121-VET ile KA122-VET Karşılaştırma Rehberi',
        titleEn: 'KA121-VET vs KA122-VET Comparative Guide',
        summaryTr: 'Yıllık doğrudan bütçe tahsisi (KA121) ile yarışmalı teklif çağrısı (KA122) arasındaki kural, kota ve başvuru farkları.',
        summaryEn: 'Rules, quotas, and procedural differences between accredited allocation (KA121) and competitive calls (KA122).',
        goalTr: 'Kurumunuzun akreditasyon durumuna göre en doğru hibe rotasını seçmek.',
        goalEn: 'Select the optimal grant mechanism according to your institutional accreditation profile.',
        route: '/school/application-draft',
        routeLabelTr: 'Başvuru Modülüne Git',
        routeLabelEn: 'Open Application Assistant',
        keyHighlightsTr: [
          'KA121-VET: Yalnızca KA120 Akreditasyonuna sahip kurumlar içindir; yarışma yoktur, doğrudan bütçe tahsisi yapılır (46 Soru).',
          'KA122-VET: Akreditasyonu olmayan tüm VET kurumlarına açıktır; yarışmalıdır (74 Soru), azami 30 katılımcı ve 6-18 ay süre sınırı vardır.',
          'Kurallar Kapısı (Eligibility Gatekeeper): 5 ardışık çağrı yılında aynı alanda en fazla 3 KA122 hibesi alınabilir; 3 hibe tamamlandığında KA120 akreditasyonuna yönlendirilir.'
        ],
        keyHighlightsEn: [
          'KA121-VET: Exclusive to KA120 accredited organisations; non-competitive annual budget allocation (46 Questions).',
          'KA122-VET: Open to all non-accredited VET providers; competitive call (74 Questions), max 30 participants, 6-18 months.',
          'Eligibility Gatekeeper: Max 3 KA122 grants across 5 consecutive call years; organisations reaching this threshold must apply for KA120 accreditation.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Akreditasyon Statünüzü Kontrol Edin',
            titleEn: 'Audit Your Accreditation Status',
            actionTr: 'Kurumunuzun geçerli bir KA120 Mesleki Eğitim Akreditasyonu olup olmadığını belirleyin.',
            actionEn: 'Determine whether your institution possesses a valid KA120 VET Accreditation.',
            uiTargetTr: 'Profil Ayarı: [Akreditasyon Durumu (KA120): Evet / Hayır]',
            uiTargetEn: 'Profile Toggle: [Accreditation Status (KA120): Yes / No]',
            expectedStateTr: 'Akredite kurumlar doğrudan KA121 yıllık bütçe tahsisat akışına geçer.',
            expectedStateEn: 'Accredited schools enter the KA121 annual grant allocation workflow.'
          },
          {
            stepNumber: 2,
            titleTr: 'KA122 Kurallar Kapısını (Gatekeeper) Doğrulayın',
            titleEn: 'Verify KA122 Eligibility Rules Gatekeeper',
            actionTr: 'KA122 başvurusu yapacaksanız, katılımcı sayınızın 30\'u aşmadığını, proje süresinin 6–18 ay olduğunu ve 5 ardışık çağrı yılında 3\'ten fazla KA122 almadığınızı teyit edin.',
            actionEn: 'Ensure participants do not exceed 30, project duration is 6–18 months, and no more than 3 KA122 grants have been received in 5 consecutive call years.',
            uiTargetTr: 'Kontrol Bölümü: [KA121 / KA122 Uygunluk ve Kota Denetimi]',
            uiTargetEn: 'Rules Check: [KA121 / KA122 Eligibility & Quota Check]',
            expectedStateTr: 'Kriterler aşılıyorsa sistem otomatik olarak KA120 Akreditasyonuna başvurmanızı önerir.',
            expectedStateEn: 'If limits are exceeded, the engine advises applying for KA120 Accreditation.'
          }
        ]
      },
      {
        id: 'arch-ai-assistant',
        audience: 'ARCHITECTURE',
        icon: '🤖',
        titleTr: 'AI Erasmus Asistanı ve Danışman Desteği',
        titleEn: 'AI Erasmus Assistant & Expert Guidance',
        summaryTr: '2026 Program Rehberi ile eğitilmiş Google Gemini motoru, anında mevzuat yanıtları ve güvenilir danışmanlık.',
        summaryEn: 'Google Gemini engine trained on the 2026 Programme Guide, instant regulatory answers, and ethical guardrails.',
        goalTr: 'Yapay zekanın taslak üretici gücünü proje koordinatörünün nihai onayıyla güvenle birleştirmek.',
        goalEn: 'Safely merge AI generative power with final human coordinator oversight.',
        route: '/api/chat',
        routeLabelTr: 'Asistanı Keşfet',
        routeLabelEn: 'Discover Assistant',
        keyHighlightsTr: [
          'Ekranın sağ alt köşesinde bulunan interaktif ErasmusAI danışman butonu.',
          'Hibe hesaplama, yeşil seyahat ve eşleştirme sorularına anında Türkçe yanıt.',
          'İnsan denetimi ilkesi: Yapay zeka taslak önerir; nihai karar proje koordinatöründedir.'
        ],
        keyHighlightsEn: [
          'Floating interactive ErasmusAI assistant at bottom-right of every view.',
          'Instant guidance on distance bands, green travel, and eligibility rules.',
          'Human-in-the-loop: AI recommends and drafts; final submission responsibility remains with human coordinator.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Sağ Alttaki Asistan Butonunu Açma',
            titleEn: 'Activate Floating Chat Assistant',
            actionTr: 'Ekranın sağ altındaki mavi yapay zeka simgesine tıklayın.',
            actionEn: 'Click the blue AI chat icon in the bottom-right corner.',
            uiTargetTr: 'Pencere: [ErasmusAI Mevzuat Danışmanı]',
            uiTargetEn: 'Window: [ErasmusAI Chat Assistant]',
            expectedStateTr: 'Sohbet penceresi ve hazır hızlı istemler (Quick Prompts) açılır.',
            expectedStateEn: 'Chat drawer and quick prompt chips are displayed.'
          },
          {
            stepNumber: 2,
            titleTr: 'Mevzuat ve Başvuru Soruları Sorma',
            titleEn: 'Query Programme Regulations',
            actionTr: '"KA121 ile KA122 arasındaki fark nedir?" veya "Yeşil seyahat ek hibesi nasıl alınır?" gibi sorular sorun.',
            actionEn: 'Ask questions like "What is the green travel top-up?" or "How is the competence gap scored?".',
            uiTargetTr: 'Girdi: [Erasmus Chat Input]',
            uiTargetEn: 'Input: [Erasmus Chat Input]',
            expectedStateTr: '2026 Erasmus+ rehberine dayalı madde madde resmi kaynaklı yanıtlar üretilir.',
            expectedStateEn: 'Structured answers citing 2026 Erasmus+ Programme Guide criteria are returned.'
          }
        ]
      }
    ]
  },
  {
    id: 'FAQ',
    labelTr: 'Sıkça Sorulan Sorular (SSS) & İpuçları',
    labelEn: 'FAQ & Practical Tips',
    icon: '❓',
    badgeTr: 'Sorun Giderme & Mevzuat',
    badgeEn: 'Troubleshooting & Regulations',
    descriptionTr: 'OID doğrulama sorunları, hibe hesaplama tavanları, vize davet süreçleri, Letter of Intent zorunluluğu ve KVKK uyumluluğu.',
    descriptionEn: 'Common questions on OID registration, grant ceilings, visa processes, LoI validity, and GDPR compliance.',
    topics: [
      {
        id: 'faq-oid-setup',
        audience: 'FAQ',
        icon: '🔑',
        titleTr: 'OID Numarası Nedir ve Nasıl Alınır?',
        titleEn: 'What is an OID and How to Obtain One?',
        summaryTr: 'Avrupa Komisyonu Organisation ID (OID) alma adımları, formatı ve geçerlilik kontrolleri.',
        summaryEn: 'European Commission Organisation ID registration steps, syntax rules, and validation checks.',
        goalTr: 'Resmi başvuru yapabilmek için kurum OID numarasını eksiksiz temin etmek.',
        goalEn: 'Acquire your institutional OID to be eligible for European Commission Erasmus+ calls.',
        keyHighlightsTr: [
          'OID, "E" harfi ile başlayan ve 8 rakamdan oluşan benzersiz kurum kimliğidir (Örn: E10389241).',
          'Avrupa Komisyonu Organisation Registration System (ORS) üzerinden ücretsiz kayıt olunabilir.',
          'Platformumuzdaki MEB Mesleki Atlası, kayıtlı binlerce Türk okulunun OID numarasını otomatik getirir.'
        ],
        keyHighlightsEn: [
          'OID is a unique 9-character identifier starting with "E" followed by 8 digits (e.g. E10389241).',
          'Registered free of charge via the Commission Organisation Registration System (ORS).',
          'Our built-in MEB Vocational Atlas auto-fills OIDs for thousands of Turkish vocational schools.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'ORS Portalında Arama Yapın',
            titleEn: 'Search on ORS Portal',
            actionTr: 'Okulunuzun daha önce kayıt olup olmadığını ORS sisteminden kontrol edin.',
            actionEn: 'Verify if your school already has a registered OID on the official ORS portal.',
            uiTargetTr: 'Bağlantı: [European Commission ORS]',
            uiTargetEn: 'Link: [European Commission ORS]',
            expectedStateTr: 'Mevcut OID bulunur veya yeni kayıt başlatılır.',
            expectedStateEn: 'Existing OID is retrieved or a new registration is submitted.'
          }
        ]
      },
      {
        id: 'faq-loi-requirement',
        audience: 'FAQ',
        icon: '📜',
        titleTr: 'Letter of Intent (LoI) Hibe Başvurusunda Zorunlu mudur?',
        titleEn: 'Is a Letter of Intent (LoI) Mandatory for the Grant Proposal?',
        summaryTr: 'Ulusal Ajans değerlendirme kriterlerinde ev sahibi ortaklık belgesinin puanlamaya etkisi.',
        summaryEn: 'Impact of preliminary host commitment letters on National Agency proposal scoring.',
        goalTr: 'Proje başvurunuzun uygunluk ve kalite değerlendirmesinde maksimum puanı almasını sağlamak.',
        goalEn: 'Maximize proposal quality scoring under the Partnership and Operational Capacity criteria.',
        keyHighlightsTr: [
          'Resmi formlarda zorunlu ek olmasa dahi, onaylı bir Letter of Intent (LoI) sunmak "Operasyonel Kapasite ve Ortaklık Kalitesi" kriterinde projenize +15-20 puan avantaj sağlar.',
          'Platformumuzdan indirilen LoI, ev sahibinin OID\'si, ayrılan stajyer kontenjanı ve tarih taahhüdünü içerir.',
          'Avrupa\'da 15 kriterli KYC\'den geçmiş "Verified Partner" rozetli hostlardan alınan LoI belgeleri en yüksek güvenilirlik düzeyine sahiptir.'
        ],
        keyHighlightsEn: [
          'While not strictly mandatory in every call, an official Letter of Intent (LoI) provides a decisive +15-20 point advantage under "Quality of Project Design and Cooperation".',
          'Our platform-generated LoI guarantees verified host OID, reserved learner capacity, and fixed mobility windows.',
          'Letters from Tier-3 Verified European Hosts carry the highest credibility with evaluators.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Pipeline Aşama 3\'te Host Eşleştirme Yapın',
            titleEn: 'Match with a Verified Host in Stage 3',
            actionTr: 'Pipeline 3. sekmede doğrulanmış Avrupa işletmelerine staj talebi gönderin.',
            actionEn: 'Send an internship inquiry to a verified European host in Pipeline Stage 3.',
            uiTargetTr: 'Kart: [Ev Sahibi Eşleştirme Kartı]',
            uiTargetEn: 'Card: [Host Matching Card]',
            expectedStateTr: 'Host ön kabul verdiğinde örnek LoI taslağı PDF olarak hazır hale gelir.',
            expectedStateEn: 'Upon host acceptance, reference LoI draft PDF is ready for consultation.'
          }
        ]
      },
      {
        id: 'faq-green-travel',
        audience: 'FAQ',
        icon: '🌱',
        titleTr: 'Yeşil Seyahat (Green Travel) Ek Hibesi Nasıl Hesaplanır?',
        titleEn: 'How is Green Travel Top-up and Travel Days Calculated?',
        summaryTr: 'Otobüs, tren veya paylaşımlı araç kullanımı durumunda ek hibe ve harcırah günlerinin hesaplanması.',
        summaryEn: 'Calculating extra travel grant amounts and up to 4 days of individual support for sustainable transport.',
        goalTr: 'Yeşil seyahat avantajlarından yararlanarak kurumunuza ek seyahat bütçesi kazandırmak.',
        goalEn: 'Utilize green travel provisions to secure additional individual support and travel funding.',
        keyHighlightsTr: [
          'Yeşil seyahat (tren, otobüs, paylaşımlı araç) kullanan katılımcılara kişi başı +30-50 € ek seyahat hibesi verilir.',
          'Yolculuk günleri için katılımcı başına 4 güne kadar ilave Bireysel Destek (günlük harcırah) tahsis edilir.',
          'Platformumuzdaki Resmi Başvuru Taslağı modülü, yeşil seyahat kutusu işaretlendiğinde bu hesaplamayı canlı matris üzerinden otomatik yapar.'
        ],
        keyHighlightsEn: [
          'Participants opting for bus, train, or carpooling receive a +30-50 € travel grant top-up.',
          'Up to 4 extra days of standard daily subsistence (Individual Support) are granted for travel duration.',
          'Our Application Draft module computes these bonuses live as soon as the Green Travel toggle is activated.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Taslak Modülünde Yeşil Seyahati İşaretleyin',
            titleEn: 'Toggle Green Travel in the Draft Assistant',
            actionTr: '/school/application-draft sayfasında 4. Faaliyet Detayları bölümündeki Yeşil Seyahat kutusunu onaylayın.',
            actionEn: 'In /school/application-draft, toggle Green Travel under Section 4 Activity Details.',
            uiTargetTr: 'Form Alanı: [Yeşil Seyahat (Green Travel) Onayı]',
            uiTargetEn: 'Form Toggle: [Green Travel Checkbox]',
            expectedStateTr: 'Bütçe tablosuna yeşil seyahat primi ve ek harcırah günleri otomatik yansır.',
            expectedStateEn: 'The budget matrix automatically incorporates green bonus and supplementary subsistence days.'
          }
        ]
      },
      {
        id: 'faq-free-model',
        audience: 'FAQ',
        icon: '🆓',
        titleTr: '1. Yıl %100 Ücretsiz Model Neleri Kapsar? Gizli Ücret Var mı?',
        titleEn: 'What Does the 100% Free First Year Model Include? Any Hidden Fees?',
        summaryTr: 'Platformun meslek liseleri ve gönderici okullar için ücretsiz kamu yararı prensibi ve sıfır komisyon güvencesi.',
        summaryEn: 'Public-good principle for vocational schools and zero commission guarantee for sending institutions.',
        goalTr: 'Okul yöneticilerinin ve öğretmenlerin platformu herhangi bir bütçe veya abonelik kaygısı olmadan güvenle kullanmasını sağlamak.',
        goalEn: 'Enable school leaders and teachers to leverage all platform tools without subscription or budgetary barriers.',
        keyHighlightsTr: [
          'Meslek liseleri, İl/İlçe Milli Eğitim Müdürlükleri ve konsorsiyum üyeleri için tüm modüller 1. yıl tamamen ücretsizdir.',
          'Hiçbir gizli aidat, işlem ücreti veya hareketlilik başına aracı komisyonu alınmaz.',
          'Okullar hibe bütçelerini doğrudan kendi döviz hesaplarında yönetir; platform mali aracılık yapmaz.',
          'Amaç, mesleki eğitim hareketliliklerindeki bürokratik engelleri kaldırarak öğrenci ve öğretmen faydasını maksimize etmektir.'
        ],
        keyHighlightsEn: [
          'All modules are completely free for vocational schools, directorates of education, and consortium partners during Year 1.',
          'No hidden fees, recurring charges, or agency transaction commissions are ever billed to schools.',
          'Schools manage their grant budget directly through institutional bank accounts with zero intermediary hold.',
          'Designed as a public-benefit infrastructure to eliminate bureaucracy in European vocational education.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Okul Profilinizi Ücretsiz Başlatın',
            titleEn: 'Initiate Your Free School Profile',
            actionTr: 'Kayıt sırasında hiçbir kredi kartı veya ödeme bilgisi girmeden doğrudan OID numaranızla giriş yapın.',
            actionEn: 'Sign up using only your school OID without any credit card or payment authorization.',
            uiTargetTr: 'Buton: [Yararlanıcı / Okul Kaydı Oluştur]',
            uiTargetEn: 'Button: [Register Beneficiary School]',
            expectedStateTr: 'Tüm analiz, eşleştirme ve evrak ihracı araçları kısıtlamasız aktifleşir.',
            expectedStateEn: 'All assessment, matching, and document export tools are fully unlocked without limitations.'
          }
        ]
      },
      {
        id: 'faq-ka121-vs-ka122',
        audience: 'FAQ',
        icon: '⚖️',
        titleTr: 'KA121 ile KA122 Arasındaki Fark Nedir? Okulum Hangisine Başvurmalı?',
        titleEn: 'Difference Between KA121 and KA122: Which Call Should My School Choose?',
        summaryTr: 'Erasmus+ Akreditasyonlu (KA121) kurumlar ile akredite olmayan kurumların kısa dönemli (KA122) hibe rotası karşılaştırması.',
        summaryEn: 'Comparison between Erasmus+ Accredited (KA121) annual allocation and non-accredited short-term (KA122) routes.',
        goalTr: 'Okulunuzun mevcut kurumsal durumuna göre doğru hibe başvuru modülünü ve bütçe stratejisini seçmek.',
        goalEn: 'Select the optimal grant application track and budget strategy according to your school accreditation status.',
        keyHighlightsTr: [
          'KA120 Akreditasyonuna sahip kurumlar KA121 yıllık bütçe tahsisatına başvurur; yarışmalı proje yazımı gerekmez.',
          'Akredite olmayan okullar KA122-VET kısa dönemli projelerine başvurur; her yıl şubat ayında teklif çağrısı açılır.',
          'KA122 Kısıtları: Proje başına maksimum 30 katılımcı, en fazla 60.000 € hibe ve son 5 yılda en çok 2 kez yararlanma hakkı.',
          'Platformumuzdaki 5 Adımlı Pipeline ve Taslak Sihirbazı her iki hibe rotasına göre soru setlerini otomatik uyarlar.'
        ],
        keyHighlightsEn: [
          'Schools holding KA120 Accreditation request annual funding under KA121 without competitive proposal scoring.',
          'Non-accredited schools apply for KA122-VET short-term projects under the annual open competitive call.',
          'KA122 Ceilings: Maximum 30 participants, 60,000 € grant cap, and limited to twice within five consecutive years.',
          'Our 5-Step Pipeline automatically adapts questionnaires and matrices to your specific chosen route.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Akreditasyon Durumunuzu İşaretleyin',
            titleEn: 'Confirm Your Accreditation Status',
            actionTr: 'Okul profilinizde KA120 Akreditasyonunuz varsa "Evet", yoksa "Hayır" seçeneğini belirleyin.',
            actionEn: 'Toggle KA120 status to Yes if accredited, or No if applying for short-term short-cycle grant.',
            uiTargetTr: 'Form Seçimi: [Akreditasyon: Evet / Hayır]',
            uiTargetEn: 'Form Toggle: [Accreditation: Yes / No]',
            expectedStateTr: 'Sistem okulunuz için geçerli resmi hibe kurallarını ve bütçe sınırlarını otomatik yükler.',
            expectedStateEn: 'The engine dynamically sets compliant proposal parameters and funding ceilings.'
          }
        ]
      },
      {
        id: 'faq-grant-payment-flow',
        audience: 'FAQ',
        icon: '💶',
        titleTr: 'Hibe Parası Okula Nasıl Yatar ve Harcamalar Nasıl Yapılır?',
        titleEn: 'How is the Erasmus+ Grant Disbursed and Documented?',
        summaryTr: '%80 ön avans ödemesi, birim maliyet (unit cost) sistemi, faturalandırma ve %20 kesin hak ediş kuralları.',
        summaryEn: '80% advance payment, unit cost expenditure system, documentation, and 20% final balance rules.',
        goalTr: 'Mali denetimlerde ve nihai raporda hiçbir kesinti yaşamadan hibe bütçesini mevzuata tam uygun yönetmek.',
        goalEn: 'Manage project funds in strict compliance with National Agency financial guidelines to avoid audit cuts.',
        keyHighlightsTr: [
          'Hibe Sözleşmesi imzalandıktan sonra bütçenin %80\'i okulun veya konsorsiyum liderinin resmi döviz hesabına ön avans olarak yatar.',
          'Erasmus+ birim maliyet (unit cost) esasına dayanır; seyahat biletleri, biniş kartları ve staj katılım belgeleri saklanmalıdır.',
          'Öğrencilere günlük cep harçlığı (Bireysel Destek) ve refakatçi öğretmenlere harcırah sözleşme öncesi avans veya banka yoluyla ödenir.',
          'Kalan %20 kesin bakiye, hareketlilik tamamlanıp nihai rapor Ulusal Ajans tarafından onaylandıktan sonra hesaba geçer.'
        ],
        keyHighlightsEn: [
          'Upon grant agreement signature, 80% pre-financing is transferred directly to the school institutional foreign currency account.',
          'Erasmus+ operates on a unit cost basis: boarding passes, invoices, and certificates of attendance must be archived.',
          'Individual support (subsistence) is disbursed to participants in advance via official bank transfer or documented sign-off.',
          'The remaining 20% balance is released following approval of the final report by the National Agency.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Hibe Hesaplayıcı ile Bütçe Matrisini Çıkarın',
            titleEn: 'Export Budget Matrix via Grant Engine',
            actionTr: '5 Adımlı Pipeline 4. Adımda katılımcı sayısı ve ülke seçerek resmi birim maliyet bütçe tablonuzu indirin.',
            actionEn: 'Calculate your unit cost matrix in Pipeline Step 4 by configuring learner count and destination.',
            uiTargetTr: 'Bölüm: [Otomatik Hibe ve Bütçe Planlayıcı]',
            uiTargetEn: 'Section: [Automated Grant & Budget Engine]',
            expectedStateTr: 'Kurumsal destek, seyahat, bireysel destek ve hazırlık bütçesi kalem kalem listelenir.',
            expectedStateEn: 'Organizational support, travel, subsistence, and linguistic budget breakdowns render.'
          }
        ]
      },
      {
        id: 'faq-daily-subsistence-rates',
        audience: 'FAQ',
        icon: '🏨',
        titleTr: 'Öğrenci ve Refakatçi Öğretmen Günlük Harcırahı Ne Kadardır?',
        titleEn: 'What are Daily Subsistence Rates for Students and Accompanying Teachers?',
        summaryTr: 'Avrupa Komisyonu 1., 2. ve 3. grup ülke yaşam maliyetlerine göre belirlenen günlük harcırah cetveli.',
        summaryEn: 'European Commission country group subsistence tables reflecting living costs across Europe.',
        goalTr: 'Gidilecek ülkeye ve kalış süresine göre öğrenci ve refakatçi öğretmenlerin hak ettiği net harcırahı hesaplamak.',
        goalEn: 'Determine exact subsistence entitlements for learners and accompanying staff based on destination.',
        keyHighlightsTr: [
          'Grup 1 Ülkeler (Yaşam maliyeti yüksek: Norveç, Danimarka, İrlanda vb.): Günlük öğrenci desteği yaklaşık 130-160 € seviyesindedir.',
          'Grup 2 Ülkeler (Orta yaşam maliyeti: Almanya, İspanya, İtalya, Avusturya, Hollanda vb.): Günlük destek yaklaşık 110-140 € seviyesindedir.',
          'Grup 3 Ülkeler (Ekonomik: Polonya, Macaristan, Romanya, Bulgaristan vb.): Günlük destek yaklaşık 90-120 € seviyesindedir.',
          'Refakatçi öğretmenler için günlük konaklama ve yemek harcırahı personel hareketliliği (Staff Mobility) katsayısıyla ödenir.',
          'Platformumuz gidilecek şehri ve gün sayısını seçtiğinizde bu resmi tutarları tek tıkla hesaplar.'
        ],
        keyHighlightsEn: [
          'Group 1 (High living cost: Norway, Denmark, Ireland, etc.): Daily subsistence ranges ~130-160 €.',
          'Group 2 (Medium cost: Germany, Spain, Italy, Austria, Netherlands, etc.): Daily subsistence ranges ~110-140 €.',
          'Group 3 (Lower cost: Poland, Hungary, Romania, Bulgaria, etc.): Daily subsistence ranges ~90-120 €.',
          'Accompanying teachers receive dedicated staff daily allowances covering hotel and per-diem meals.',
          'Our platform distance and grant engine computes these rates automatically upon destination selection.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Harita Üzerinden Hedef Ülkeyi Seçin',
            titleEn: 'Pick Destination on the Route Map',
            actionTr: 'Avrupa Rota Ağı haritasında Berlin, Viyana, Madrid veya Prag noktalarından birine tıklayın.',
            actionEn: 'Click on Berlin, Vienna, Madrid, or Prague on the European Route Network vector map.',
            uiTargetTr: 'Harita: [Avrupa Hareketlilik Ağı]',
            uiTargetEn: 'Map: [European Mobility Network]',
            expectedStateTr: 'Gidilen ülkenin günlük harcırahı ve seyahat mesafe hibesi ekranda gösterilir.',
            expectedStateEn: 'The country group rate and travel grant band appear instantly on the calculator card.'
          }
        ]
      },
      {
        id: 'faq-host-fees-legality',
        audience: 'FAQ',
        icon: '🏢',
        titleTr: 'Avrupa Ev Sahibi İşletme Ücret Talep Edebilir mi? Aracı Komisyonu Var mı?',
        titleEn: 'Can a European Host Enterprise Charge Fees? Is There an Agency Commission?',
        summaryTr: 'Meslek liseleri ile Avrupalı ev sahibi işletmeler arasındaki yasal staj protokolü ve sıfır aracı komisyonu ilkesi.',
        summaryEn: 'Direct legal internship agreement between schools and host enterprises with zero intermediary cut.',
        goalTr: 'Mali suistimallerin önüne geçmek ve doğrudan okul-işletme iş birliğinin yasal sınırlarını bilmek.',
        goalEn: 'Safeguard school budgets and understand the legal framework of direct European school-to-business partnerships.',
        keyHighlightsTr: [
          'Platformumuzda aracı ajans komisyonu kesinlikle YOKTUR; okul doğrudan işletme koordinatörüyle görüşür.',
          'Stajyer kabul eden işletmeler öğrencilere pratik eğitim sağladığı için okullardan gizli danışmanlık ücreti talep edemez.',
          'Kurs merkezleri ve eğitim kurumları (VET Training Providers) sundukları kurslar için AB standart günlük kurs ücreti (Course Fee: 80 €/gün) faturalandırabilir.',
          'İşletmenin sunduğu konaklama, transfer ve yerel lojistik hizmetleri okulun Kurumsal Destek (OS) bütçesinden resmi fatura karşılığı karşılanır.'
        ],
        keyHighlightsEn: [
          'Zero agency commissions: sending schools communicate and contract directly with hosting enterprises.',
          'Enterprises hosting student interns cannot levy arbitrary agency markups or placement deductions.',
          'Structured training centres may invoice standardized course fees up to the official 80 €/day ceiling.',
          'Local accommodation and logistics arranged by hosts are settled cleanly against Organizational Support invoices.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Pazaryeri İlanlarında Şeffaf Koşulları İnceleyin',
            titleEn: 'Review Transparent Terms in Marketplace',
            actionTr: 'Pazaryeri modülündeki işletme profilinde konaklama, dil desteği ve çalışma şartlarını okuyun.',
            actionEn: 'Inspect logistics, accommodation, language environment, and conditions on the host card.',
            uiTargetTr: 'Pazaryeri: [/marketplace]',
            uiTargetEn: 'Marketplace: [/marketplace]',
            expectedStateTr: 'Tüm koşullar ve kontenjanlar net olarak listelenir; doğrudan talep gönderilebilir.',
            expectedStateEn: 'All conditions and available slots are transparently presented for direct booking.'
          }
        ]
      },
      {
        id: 'faq-learning-agreement-europass',
        audience: 'FAQ',
        icon: '📜',
        titleTr: 'Learning Agreement ve Europass Mobility Belgeleri Ne Zaman İmzalanır?',
        titleEn: 'When are Learning Agreement and Europass Mobility Documents Signed?',
        summaryTr: 'Hareketlilik öncesi imzalanan Öğrenme Anlaşması ile hareketlilik sonrası verilen resmi Europass sertifikası takvimi.',
        summaryEn: 'Timeline for pre-departure Learning Agreements and post-mobility Europass Mobility certification.',
        goalTr: 'Öğrencilerin mesleki staj kazanımlarını e-Devlet ve Avrupa Birliği nezdinde resmi olarak tescil ettirmek.',
        goalEn: 'Ensure student internship competencies are formally accredited under EU and National standards.',
        keyHighlightsTr: [
          'Öğrenme Anlaşması (Learning Agreement): Öğrenci uçağa binmeden ÖNCE okul, ev sahibi ve öğrenci tarafından imzalanır.',
          'Anlaşmada öğrencinin işletmede kazanacağı mesleki yetkinlikler (ESCO/ECVET birimleri) açıkça belirtilir.',
          'Europass Mobility: Staj başarıyla tamamlandıktan sonra ev sahibi kurum değerlendirme formunu doldurur.',
          'Okul müdürü ve ev sahibi koordinatörü tarafından onaylanan Europass belgesi, öğrencinin e-Devlet ve Europass profilinde ömür boyu doğrulanabilir olur.'
        ],
        keyHighlightsEn: [
          'Learning Agreement: Must be signed by the school, the hosting enterprise, and the student BEFORE departure.',
          'It outlines exact vocational tasks, safety rules, and ESCO/ECVET learning outcomes to be acquired.',
          'Europass Mobility: Issued after successful completion of the training period based on host mentor rubrics.',
          'Signed by the school principal and host lead, providing lifelong verifiable accreditation on the Europass portal.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Pipeline 4. Adımdan Resmi Evrakları İndirin',
            titleEn: 'Export Dossier in Pipeline Step 4',
            actionTr: 'Pipeline 4. sekmede "Resmi Öğrenme Anlaşması (LA) Taslağı Üret" butonuna basın.',
            actionEn: 'Click "Export Learning Agreement Draft" in Pipeline Step 4.',
            uiTargetTr: 'Buton: [Öğrenme Anlaşması İndir (PDF)]',
            uiTargetEn: 'Button: [Download Learning Agreement (PDF)]',
            expectedStateTr: 'Avrupa Komisyonu standart şablonunda tüm tarafların imzasına hazır belge üretilir.',
            expectedStateEn: 'Standard Commission template pre-filled with student and host data is generated.'
          }
        ]
      },
      {
        id: 'faq-consortium-participation',
        audience: 'FAQ',
        icon: '🤝',
        titleTr: 'Konsorsiyum Nedir ve İl/İlçe Milli Eğitim Konsorsiyumuna Nasıl Dahil Olunur?',
        titleEn: 'What is a VET Consortium and How Can Our School Join?',
        summaryTr: 'İl/İlçe MEM liderliğindeki akredite konsorsiyumlara üye okul olarak katılmanın avantajları ve süreçleri.',
        summaryEn: 'Advantages and operational process of joining accredited VET mobility consortia led by directorates.',
        goalTr: 'Bireysel başvuru yapmadan veya akreditasyon beklemeden konsorsiyum kotasıyla öğrencileri Avrupa\'ya göndermek.',
        goalEn: 'Send vocational students and staff to Europe via consortium allocation without separate grant applications.',
        keyHighlightsTr: [
          'Konsorsiyum Koordinatörü (genellikle İl/İlçe Milli Eğitim Müdürlüğü) KA120 akreditasyonuna sahiptir ve yıllık hibe çeker.',
          'Meslek lisesi konsorsiyum üyesi olduğunda, ayrı bir proje yazma veya yarışmalı değerlendirme stresine girmez.',
          'Konsorsiyum lideri okulunuza öğrenci ve öğretmen kontenjanı (Örn: 6 öğrenci + 1 refakatçi) tahsis eder.',
          'Platformumuzda konsorsiyum lideri tüm üye okulların staj taleplerini ve ev sahibi eşleşmelerini tek merkezden denetleyebilir.'
        ],
        keyHighlightsEn: [
          'Consortium leaders (often provincial/district directorates of education) hold KA120 accreditation and secure block grants.',
          'Member vocational schools participate under allocated quotas without submitting separate competitive proposals.',
          'The leader allocates learner and teacher slots (e.g. 6 interns + 1 accompanying teacher) to member schools.',
          'Our platform enables consortium leads to monitor and approve all member school placements centrally.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Konsorsiyum Seçeneğini Belirtin',
            titleEn: 'Flag Consortium Participation',
            actionTr: 'Okul kayıt profilinizde kurum tipinizi veya konsorsiyum lider kurum adını girin.',
            actionEn: 'Identify your consortium coordinator in the institutional profile setup.',
            uiTargetTr: 'Form Alanı: [Konsorsiyum Lideri / Bağlı Kurum]',
            uiTargetEn: 'Field: [Consortium Lead / Directorate]',
            expectedStateTr: 'Okulunuz konsorsiyum ağında listelenir ve ortak ev sahibi havuzundan faydalanır.',
            expectedStateEn: 'Your school is linked to the consortium cluster and gains access to pooled host capacity.'
          }
        ]
      },
      {
        id: 'faq-display-settings',
        audience: 'FAQ',
        icon: '👁️',
        titleTr: 'Görünüm, Yüksek Kontrast ve Yazı Boyutu Ayarları Nereden Değiştirilir?',
        titleEn: 'Where Can I Customize Display, High Contrast, and Font Size?',
        summaryTr: 'Platformun sağ üst köşesinde yer alan Görünüm & Okuma menüsü ile WCAG 2.1 AA erişilebilirlik ayarlarını kişiselleştirme.',
        summaryEn: 'Customizing WCAG 2.1 AA accessibility preferences via the Display & Reading menu in the top right header.',
        goalTr: 'Kullanıcının görme konforuna uygun kontrast, yazı boyutu ve hareket azaltma tercihlerini anında ayarlamasını sağlamak.',
        goalEn: 'Enable users to customize contrast, font scaling, and motion damping to their visual comfort instantly.',
        keyHighlightsTr: [
          'Sağ üst menüdeki "Görünüm & Okuma" (Type simgesi) butonuna basarak paneli açabilirsiniz.',
          'Büyük veya Ekstra Büyük yazı boyutunu seçerek metinleri büyütebilirsiniz.',
          'Yüksek Kontrast modunu açarak koyu zemin üzerinde sarı/cyan yüksek kontrast görünüm elde edebilirsiniz.',
          'Animasyonları Azalt seçeneği ile sayfa geçişlerindeki hareketleri durdurabilirsiniz.',
          'Tüm ayarlar tarayıcınızda otomatik saklanır; dilediğiniz zaman "Varsayılana Sıfırla" ile geri alabilirsiniz.'
        ],
        keyHighlightsEn: [
          'Access the panel anytime via the "Display & Reading" (Type icon) button in the upper right header.',
          'Scale typography dynamically to Large or Extra Large for easier reading.',
          'Enable High Contrast mode for a deep-black canvas with bright contrast highlights.',
          'Turn on Reduced Motion to damp transitions and eliminate distracting animations.',
          'Preferences are remembered locally and can be restored anytime via "Reset to Default".'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Görünüm Menüsünü Açın',
            titleEn: 'Open Display Menu',
            actionTr: 'Üst çubuktaki "Görünüm & Okuma" butonuna tıklayın ve tercihinizi belirleyin.',
            actionEn: 'Click "Display & Reading" in the navigation bar and toggle preferences.',
            uiTargetTr: 'Header: [Görünüm & Okuma Butonu]',
            uiTargetEn: 'Header: [Display & Reading Button]',
            expectedStateTr: 'Tercihler anında uygulanır ve kaydedilir.',
            expectedStateEn: 'Settings are applied instantly and saved.'
          }
        ]
      },
      {
        id: 'faq-profile-oid-change',
        audience: 'FAQ',
        icon: '✏️',
        titleTr: 'Okul OID Numarası, İrtibat Kişisi veya Kurum Bilgileri Nasıl Güncellenir?',
        titleEn: 'How to Update School OID, Contact Person, or Institutional Info?',
        summaryTr: 'Onboarding sonrasında okul OID numarası, proje koordinatörü e-postası veya adres değişikliklerinin nasıl güncelleneceği.',
        summaryEn: 'How to modify school OID, coordinator contact details, or address data after initial onboarding.',
        goalTr: 'Değişen okul yöneticisi, koordinatör veya OID bilgilerini sisteme hatasız yansıtmak.',
        goalEn: 'Reflect changes in school leadership, coordinators, or OID credentials accurately.',
        keyHighlightsTr: [
          'Profil Sayfası (/profile): Üst menüde adınıza tıklayarak "Bağlı Kurum Bilgileri" alanından "Düzenle" linkine tıklayın.',
          'Onboarding Formunu Yeniden Açma: /onboarding adresine giderek MEB okul atlası veya yeni OID numaranızı kaydedebilirsiniz.',
          'Koordinatör Bilgileri: Staj talepleri gönderilirken okul irtibat kişisi adı ve e-postası form üzerinden de güncellenebilir.',
          'Clerk Güvenliği: E-posta veya şifre güncellemesi için "Profil" sayfasındaki "Hesap Ayarları" butonunu kullanabilirsiniz.'
        ],
        keyHighlightsEn: [
          'Profile Portal (/profile): Click your name in top nav and select "Edit" in the Connected Institution card.',
          'Re-Engage Onboarding: Visit /onboarding to update MEB school lookup or input a revised 8-digit E-OID.',
          'Coordinator Contacts: Sending coordinator contact details can also be revised dynamically when submitting inquiries.',
          'Clerk Security: Manage email or password modifications via "Account Settings" on the profile page.'
        ],
        steps: [
          {
            stepNumber: 1,
            titleTr: 'Profil Sayfasına Gidin',
            titleEn: 'Visit Profile Page',
            actionTr: 'Üst menüden "Profil" sayfasına girin ve Kurum Bilgileri kartındaki "Düzenle" bağlantısını tıklayın.',
            actionEn: 'Navigate to "Profile" and click "Edit" in the Connected Institution panel.',
            uiTargetTr: 'Profil Sayfası: [/profile]',
            uiTargetEn: 'Profile Page: [/profile]',
            expectedStateTr: 'Kurum ve OID düzenleme seçenekleri açılır.',
            expectedStateEn: 'Institutional edit controls become available.'
          }
        ]
      }
    ]
  }
];
