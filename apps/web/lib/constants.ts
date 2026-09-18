/**
 * ErasmusMobility - Constants & Configuration
 * 
 * 4 Exact Designer Palettes:
 * - Palet 01: #FFCA41 (Sarı), #000000 (Siyah), #A6A6A6 (Gri)
 * - Palet 02: #E56438 (Turuncu), #302C4F (Koyu Lacivert), #C6C6C6 (Gri)
 * - Palet 03: #863C6D (Mürdüm), #FFE5BC (Açık Sarı/Şampanya), #E8E8E8 (Açık Gri)
 * - Palet 04 (Erasmus+ Logosu İlhamlı): #013399 (Erasmus Mavisi), #F4CB1D (Erasmus Sarısı), #E8E8E8 (Açık Gri)
 */

export interface ThemeConfig {
  id: 'theme-01' | 'theme-02' | 'theme-03' | 'theme-04';
  name: string;
  badge: string;
  primary: string;
  secondary: string;
  accent: string;
  description: string;
}

export const THEMES: Record<string, ThemeConfig> = {
  'theme-01': {
    id: 'theme-01',
    name: 'Palet 01: Gold & Black',
    badge: '#FFCA41 • #000000',
    primary: '#FFCA41',
    secondary: '#000000',
    accent: '#A6A6A6',
    description: 'Canlı Altın Sarısı (#FFCA41), Derin Siyah (#000000) ve Nötr Gri (#A6A6A6).',
  },
  'theme-02': {
    id: 'theme-02',
    name: 'Palet 02: Sunset Orange & Deep Navy',
    badge: '#E56438 • #302C4F',
    primary: '#E56438',
    secondary: '#302C4F',
    accent: '#C6C6C6',
    description: 'Canlı Turuncu (#E56438), Koyu Lacivert (#302C4F) ve Gri (#C6C6C6).',
  },
  'theme-03': {
    id: 'theme-03',
    name: 'Palet 03: Mürdüm & Şampanya Sarısı',
    badge: '#863C6D • #FFE5BC',
    primary: '#863C6D',
    secondary: '#FFE5BC',
    accent: '#E8E8E8',
    description: 'Zarif Mürdüm (#863C6D), Sıcak Açık Sarı (#FFE5BC) ve Açık Gri (#E8E8E8).',
  },
  'theme-04': {
    id: 'theme-04',
    name: 'Palet 04: Erasmus+ Mavisi & Sarısı',
    badge: '#013399 • #F4CB1D',
    primary: '#013399',
    secondary: '#F4CB1D',
    accent: '#E8E8E8',
    description: 'Resmi Erasmus+ logosundan ilham alan AB Mavisi (#013399), Erasmus Sarısı (#F4CB1D) ve Açık Gri (#E8E8E8).',
  },
};

export interface FontPreset {
  id: string;
  name: string;
  heading: string;
  body: string;
  cssHeading: string;
  cssBody: string;
}

export const FONT_PRESETS: Record<string, FontPreset> = {
  'font-inter': {
    id: 'font-inter',
    name: 'Inter & Plus Jakarta Sans',
    heading: 'Plus Jakarta Sans',
    body: 'Inter',
    cssHeading: "'Plus Jakarta Sans', 'Inter', sans-serif",
    cssBody: "'Inter', sans-serif",
  },
  'font-playfair': {
    id: 'font-playfair',
    name: 'Playfair Display & Source Sans',
    heading: 'Playfair Display',
    body: 'Source Sans 3',
    cssHeading: "'Playfair Display', serif",
    cssBody: "'Source Sans 3', sans-serif",
  },
  'font-montserrat': {
    id: 'font-montserrat',
    name: 'Montserrat & Open Sans',
    heading: 'Montserrat',
    body: 'Open Sans',
    cssHeading: "'Montserrat', sans-serif",
    cssBody: "'Open Sans', sans-serif",
  },
  'font-poppins': {
    id: 'font-poppins',
    name: 'Poppins & Roboto',
    heading: 'Poppins',
    body: 'Roboto',
    cssHeading: "'Poppins', sans-serif",
    cssBody: "'Roboto', sans-serif",
  },
  'font-merriweather': {
    id: 'font-merriweather',
    name: 'Merriweather & Lato',
    heading: 'Merriweather',
    body: 'Lato',
    cssHeading: "'Merriweather', serif",
    cssBody: "'Lato', sans-serif",
  },
};

export interface VetField {
  id: string;
  label: string;
  labelEn?: string;
  isced: string;
  name: string;
  esco: string;
  skills: string;
}

export const VET_FIELDS: Record<string, VetField> = {
  automation: {
    id: 'automation',
    label: 'Elektrik-Elektronik / Endüstriyel Otomasyon',
    labelEn: 'Electrical and Electronic Engineering / Industrial Automation',
    isced: '0714',
    name: 'Electronics and automation',
    esco: 'automation technician / mechatronics technician / industrial electrician',
    skills: 'PLC programlama; endüstriyel otomasyon; robotik; arıza tespiti; kontrol sistemleri; önleyici bakım',
  },
  software: {
    id: 'software',
    label: 'Bilişim / Yazılım Geliştirme',
    labelEn: 'Information Technologies / Software Development',
    isced: '0613',
    name: 'Software and applications development and analysis',
    esco: 'software developer / application programmer',
    skills: 'programlama; yazılım testi; sürüm kontrolü (Git); hata ayıklama; uygulama geliştirme; siber güvenlik farkındalığı',
  },
  network: {
    id: 'network',
    label: 'Bilişim / Ağ Sistemleri & Siber Güvenlik',
    labelEn: 'Information Technologies / Network Systems and Cybersecurity',
    isced: '0612',
    name: 'Database and network design and administration',
    esco: 'ICT network technician / network administrator',
    skills: 'ağ yapılandırması; siber güvenlik; ağ sorun giderme; sunucular; yönlendirme (routing); sistem yönetimi',
  },
  mechanics: {
    id: 'mechanics',
    label: 'Makine / CNC / Metal Teknolojisi',
    isced: '0715',
    name: 'Mechanics and metal trades',
    esco: 'CNC operator / machining technician / welder',
    skills: 'CNC tezgah kullanımı; CAD/CAM; talaşlı üretim; hassas ölçüm; kaynak teknikleri; önleyici bakım; İSG kuralları',
  },
  automotive: {
    id: 'automotive',
    label: 'Motorlu Araçlar / Otomotiv & Elektrikli Araçlar (EV)',
    isced: '0716',
    name: 'Motor vehicles, ships and aircraft',
    esco: 'motor vehicle technician / automotive mechatronics technician',
    skills: 'araç diyagnostiği; EV batarya ve güç sistemleri; periyodik bakım; elektrik devreleri; arıza tespiti',
  },
  energy: {
    id: 'energy',
    label: 'Elektrik / Yenilenebilir Enerji (Güneş & Rüzgar)',
    isced: '0713',
    name: 'Electricity and energy',
    esco: 'electrician / renewable energy technician / solar energy technician',
    skills: 'elektrik tesisatı; fotovoltaik (PV) güneş sistemleri; rüzgar enerjisi; elektrik güvenliği; şebeke bağlantısı',
  },
  construction: {
    id: 'construction',
    label: 'İnşaat / Yapı & Sürdürülebilir Mimari (BIM)',
    isced: '0732',
    name: 'Building and civil engineering',
    esco: 'construction technician / building electrician / construction craft worker',
    skills: 'teknik çizim; BIM modelleme; şantiye güvenliği; yapı malzemeleri; enerji verimli yapı teknikleri',
  },
  hospitality: {
    id: 'hospitality',
    label: 'Konaklama / Yiyecek-İçecek Hizmetleri & Mutfak',
    isced: '1013',
    name: 'Hotel, restaurants and catering',
    esco: 'cook / hotel receptionist / waiter / hospitality worker',
    skills: 'misafir ilişkileri; gıda hijyeni (HACCP); mutfak teknikleri; müşteri iletişimi; otel operasyonları',
  },
  tourism: {
    id: 'tourism',
    label: 'Turizm / Seyahat Hizmetleri & Rehberlik',
    isced: '1015',
    name: 'Travel, tourism and leisure',
    esco: 'travel consultant / tour guide / tourism information officer',
    skills: 'turizm operasyonu; destinasyon tanıtımı; dijital rezervasyon; kültürlerarası iletişim; yabancı dil kullanımı',
  },
  agriculture: {
    id: 'agriculture',
    label: 'Tarım / Akıllı Tarım & Hayvancılık',
    isced: '0811',
    name: 'Crop and livestock production',
    esco: 'agricultural technician / farm worker / precision agriculture operator',
    skills: 'bitkisel üretim; tarım makineleri; damla sulama; hassas tarım teknolojileri; toprak analizi; İSG',
  },
  health: {
    id: 'health',
    label: 'Sağlık Hizmetleri / Hasta & Yaşlı Bakımı',
    isced: '0913',
    name: 'Nursing and midwifery',
    esco: 'healthcare assistant / nursing associate',
    skills: 'hasta bakımı; hijyen ve sanitasyon; ilk yardım; iletişim ve empati; tıbbi dokümantasyon; dijital sağlık',
  },
  media: {
    id: 'media',
    label: 'Grafik / Medya & Görsel İletişim',
    isced: '0211',
    name: 'Audio-visual techniques and media production',
    esco: 'graphic designer / audiovisual technician / multimedia designer',
    skills: 'dijital tasarım; video prodüksiyonu; görsel düzenleme; çoklu ortam içerik üretimi; telif hakları',
  },
};

export interface Question {
  id: number;
  title: string;
  titleEn?: string;
  description: string;
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Mesleki Teknik Yetkinlik',
    titleEn: 'Technical and Occupational Competence',
    description: 'Mesleki alanımdaki temel araç, ekipman veya yazılımları güvenli ve doğru biçimde kullanabilirim.',
  },
  {
    id: 2,
    title: 'Problem Çözme ve Analiz',
    description: 'Mesleki bir arıza veya teknik problemi sistematik olarak analiz edip çözüm geliştirebilirim.',
  },
  {
    id: 3,
    title: 'Dijital Beceriler & Araçlar',
    description: 'Mesleki görevlerimde dijital araçları, verileri ve çevrim içi platformları etkin biçimde kullanabilirim.',
  },
  {
    id: 4,
    title: 'İSG (İş Sağlığı ve Güvenliği)',
    description: 'İş sağlığı ve güvenliği standartlarını uygulayabilir, çalışma ortamındaki riskleri tanıyabilirim.',
  },
  {
    id: 5,
    title: 'Yeşil Beceriler & Sürdürülebilirlik',
    description: 'Kaynak verimliliği, atık azaltımı ve sürdürülebilir uygulamaları mesleki görevlerime yansıtabilirim.',
  },
  {
    id: 6,
    title: 'İletişim ve Bilgi Aktarımı',
    description: 'Teknik bilgiyi ekip arkadaşlarıma, öğrencilere veya mentora açık ve net biçimde aktarabilirim.',
  },
  {
    id: 7,
    title: 'Takım Çalışması & İşbirliği',
    description: 'Farklı disiplinlerden veya kültürlerden ekiplerde sorumluluk alarak uyum içinde çalışabilirim.',
  },
  {
    id: 8,
    title: 'Öğrenmeyi Öğrenme & Gelişim',
    description: 'Yeni bir teknoloji veya yöntemi öğrenmek için hedef belirleyip kendi öğrenme sürecimi yönetebilirim.',
  },
  {
    id: 9,
    title: 'Mesleki Yabancı Dil (İngilizce)',
    description: 'Alanıma ilişkin temel teknik terimleri ve işyeri içi mesleki iletişimi yürütebilirim.',
  },
  {
    id: 10,
    title: 'Kültürlerarası Uyum',
    description: 'Farklı ülkelerdeki çalışma, eğitim ve sosyal kültür ortamlarına hızla uyum sağlayabilirim.',
  },
  {
    id: 11,
    title: 'Öz Yönetim & Sorumluluk',
    description: 'Yeni bir iş/öğrenme ortamında zamanı, görevleri ve bireysel sorumluluklarımı planlayabilirim.',
  },
  {
    id: 12,
    title: 'Avrupa Hareketliliği Hazırlığı',
    description: 'Yurt dışı hareketlilik deneyimini kurumsal hedeflerim ve kişisel kariyer planımla ilişkilendirebilirim.',
  },
];

export const HOST_METRIC_CONFIG = [
  { id: 'h1', label: 'Mesleki Alan Uyumu', labelTr: 'Mesleki Alan Uyumu', labelEn: 'Vocational Field Alignment', weight: 20, defaultVal: 80 },
  { id: 'h2', label: 'Öğrenme Kazanımları Kapasitesi', labelTr: 'Öğrenme Kazanımları Kapasitesi', labelEn: 'Learning Outcomes Capacity', weight: 15, defaultVal: 80 },
  { id: 'h3', label: 'Teknik ve Laboratuvar Altyapısı', labelTr: 'Teknik ve Laboratuvar Altyapısı', labelEn: 'Technical & Lab Infrastructure', weight: 10, defaultVal: 80 },
  { id: 'h4', label: 'Erasmus+ Proje Deneyimi', labelTr: 'Erasmus+ Proje Deneyimi', labelEn: 'Erasmus+ Project Experience', weight: 10, defaultVal: 60 },
  { id: 'h5', label: 'İngilizce / Çalışma Dili İletişimi', labelTr: 'İngilizce / Çalışma Dili İletişimi', labelEn: 'English / Working Language Communication', weight: 10, defaultVal: 70 },
  { id: 'h6', label: 'Öğrenici / Stajyer Kabul Kapasitesi', labelTr: 'Öğrenici / Stajyer Kabul Kapasitesi', labelEn: 'Learner / Trainee Hosting Capacity', weight: 10, defaultVal: 70 },
  { id: 'h7', label: 'Öğretmen İşbaşı Gözlem Kapasitesi', labelTr: 'Öğretmen İşbaşı Gözlem Kapasitesi', labelEn: 'Staff Job Shadowing Capacity', weight: 5, defaultVal: 70 },
  { id: 'h8', label: 'Mentor ve Eğitici Desteği', labelTr: 'Mentor ve Eğitici Desteği', labelEn: 'Mentorship & Trainer Support', weight: 10, defaultVal: 80 },
  { id: 'h9', label: 'İSG ve Güvenlik Standartları', labelTr: 'İSG ve Güvenlik Standartları', labelEn: 'OHS & Safety Standards', weight: 5, defaultVal: 80 },
  { id: 'h10', label: 'Uzun Dönemli İşbirliği İsteği', labelTr: 'Uzun Dönemli İşbirliği İsteği', labelEn: 'Long-Term Partnership Commitment', weight: 5, defaultVal: 70 },
] as const;

export const DECISION_WEIGHTS = [
  { label: 'Yetkinlik Açığı (Gap)', labelTr: 'Yetkinlik Açığı (Gap)', labelEn: 'Competence Gap', weight: '25%' },
  { label: 'Kurumsal İhtiyaç', labelTr: 'Kurumsal İhtiyaç', labelEn: 'Institutional Need', weight: '20%' },
  { label: 'ESCO Eşleşmesi', labelTr: 'ESCO Eşleşmesi', labelEn: 'ESCO Matching', weight: '15%' },
  { label: 'ISCED-F Uyumu', labelTr: 'ISCED-F Uyumu', labelEn: 'ISCED-F Alignment', weight: '10%' },
  { label: 'Ev Sahibi Kapasitesi', labelTr: 'Ev Sahibi Kapasitesi', labelEn: 'Host Capacity', weight: '15%' },
  { label: 'Dil Seviyesi', labelTr: 'Dil Seviyesi', labelEn: 'Language Proficiency', weight: '5%' },
  { label: 'Kapsayıcılık / İhtiyaç', labelTr: 'Kapsayıcılık / İhtiyaç', labelEn: 'Inclusion & Support', weight: '5%' },
  { label: 'Erasmus Planı Uyumu', labelTr: 'Erasmus Planı Uyumu', labelEn: 'Erasmus Plan Alignment', weight: '5%' },
];

export const QUALITY_CHECKLIST = [
  {
    area: 'Katılımcı Seçimi (Selection)',
    areaTr: 'Katılımcı Seçimi (Selection)',
    areaEn: 'Participant Selection',
    sending: '✓ Sorumlu & Sahip (Yararlanıcı)',
    sendingTr: '✓ Sorumlu & Sahip (Yararlanıcı)',
    sendingEn: '✓ Responsible & Owner (Beneficiary)',
    host: 'Girdi & Öneri',
    hostTr: 'Girdi & Öneri',
    hostEn: 'Input & Recommendations',
  },
  {
    area: 'Hazırlık (Dil, Pedagojik & Kültürel)',
    areaTr: 'Hazırlık (Dil, Pedagojik & Kültürel)',
    areaEn: 'Preparation (Language, Pedagogical & Intercultural)',
    sending: '✓ Birincil Sorumlu',
    sendingTr: '✓ Birincil Sorumlu',
    sendingEn: '✓ Primary Responsible',
    host: 'Destekleyici Materyal',
    hostTr: 'Destekleyici Materyal',
    hostEn: 'Supporting Materials',
  },
  {
    area: 'Öğrenme Programı & Müfredat',
    areaTr: 'Öğrenme Programı & Müfredat',
    areaEn: 'Learning Programme & Curriculum',
    sending: '✓ Ortak Onay',
    sendingTr: '✓ Ortak Onay',
    sendingEn: '✓ Joint Agreement',
    host: '✓ Uygulama Programı',
    hostTr: '✓ Uygulama Programı',
    hostEn: '✓ Practical Training Implementation',
  },
  {
    area: 'Öğrenme Kazanımları (Outcomes)',
    areaTr: 'Öğrenme Kazanımları (Outcomes)',
    areaEn: 'Learning Outcomes & Validation',
    sending: '✓ Tanımlama & Onay',
    sendingTr: '✓ Tanımlama & Onay',
    sendingEn: '✓ Definition & Verification',
    host: '✓ Pratik Uygulama',
    hostTr: '✓ Pratik Uygulama',
    hostEn: '✓ Workplace Practice',
  },
  {
    area: 'İşyeri Mentoru Ataması',
    areaTr: 'İşyeri Mentoru Ataması',
    areaEn: 'In-Company Mentor Assignment',
    sending: 'İletişim & Takip',
    sendingTr: 'İletişim & Takip',
    sendingEn: 'Communication & Monitoring',
    host: '✓ Doğrudan Atama',
    hostTr: '✓ Doğrudan Atama',
    hostEn: '✓ Direct Designation',
  },
  {
    area: 'İzleme & Değerlendirme',
    areaTr: 'İzleme & Değerlendirme',
    areaEn: 'Monitoring & Continuous Assessment',
    sending: '✓ Düzenli Raporlama',
    sendingTr: '✓ Düzenli Raporlama',
    sendingEn: '✓ Regular Reporting',
    host: '✓ Günlük Gözlem',
    hostTr: '✓ Günlük Gözlem',
    hostEn: '✓ Daily Workplace Tutoring',
  },
  {
    area: 'İSG & Acil Durum Protokolü',
    areaTr: 'İSG & Acil Durum Protokolü',
    areaEn: 'OHS & Emergency Protocol',
    sending: '✓ Sigorta & Bilgilendirme',
    sendingTr: '✓ Sigorta & Bilgilendirme',
    sendingEn: '✓ Insurance & Orientation',
    host: '✓ İşyeri Güvenliği',
    hostTr: '✓ İşyeri Güvenliği',
    hostEn: '✓ Workplace Safety & Equipment',
  },
  {
    area: 'Kazanımların Tanınması (Europass)',
    areaTr: 'Kazanımların Tanınması (Europass)',
    areaEn: 'Recognition of Learning (Europass Mobility)',
    sending: '✓ Belge Düzenleme',
    sendingTr: '✓ Belge Düzenleme',
    sendingEn: '✓ Issuing & Validation',
    host: 'Kanıt & İmza',
    hostTr: 'Kanıt & İmza',
    hostEn: 'Evidence Verification & Signature',
  },
  {
    area: 'Ulusal Ajans Raporlaması & Bütçe',
    areaTr: 'Ulusal Ajans Raporlaması & Bütçe',
    areaEn: 'National Agency Reporting & Budget',
    sending: '✓ Tek Sorumlu (Beneficiary)',
    sendingTr: '✓ Tek Sorumlu (Beneficiary)',
    sendingEn: '✓ Sole Responsible (Beneficiary)',
    host: '—',
    hostTr: '—',
    hostEn: '—',
  },
];

export const PARTNER_FUNNEL = [
  {
    step: '1',
    source: 'Erasmus+ Results Platform',
    query: 'Geçmiş KA121/KA122 VET projeleri + mesleki alan',
    queryTr: 'Geçmiş KA121/KA122 VET projeleri + mesleki alan',
    queryEn: 'Past KA121/KA122 VET projects + vocational field',
    output: '30–50 deneyimli kuruluş havuzu',
    outputTr: '30–50 deneyimli kuruluş havuzu',
    outputEn: '30–50 experienced host institution pool',
  },
  {
    step: '2',
    source: 'ESEP (European School Education Platform)',
    query: 'Aktif partner & ev sahibi arama ilanları',
    queryTr: 'Aktif partner & ev sahibi arama ilanları',
    queryEn: 'Active partner finding & host announcements',
    output: '15–20 potansiyel aday',
    outputTr: '15–20 potansiyel aday',
    outputEn: '15–20 prospective candidates',
  },
  {
    step: '3',
    source: 'SALTO Education & Training / TCA',
    query: 'İletişim seminerleri & uluslararası ağlar',
    queryTr: 'İletişim seminerleri & uluslararası ağlar',
    queryEn: 'Contact-making seminars & international networking',
    output: '5–10 doğrudan temas',
    outputTr: '5–10 doğrudan temas',
    outputEn: '5–10 direct partner contacts',
  },
  {
    step: '4',
    source: 'Kuruluş Web Sitesi & Doğrulama',
    query: 'Teknik kapasite, mentor varlığı, dil, İSG',
    queryTr: 'Teknik kapasite, mentor varlığı, dil, İSG',
    queryEn: 'Technical capacity, mentor availability, language, OHS',
    output: 'Kısa Liste (Shortlist)',
    outputTr: 'Kısa Liste (Shortlist)',
    outputEn: 'Verified Shortlist',
  },
  {
    step: '5',
    source: 'Mutabakat & Görev Dağılımı',
    query: 'Öğrenme programı ve kalite taahhüdü',
    queryTr: 'Öğrenme programı ve kalite taahhüdü',
    queryEn: 'Learning programme agreement & quality commitment',
    output: '1–2 kesinleşmiş Ev Sahibi',
    outputTr: '1–2 kesinleşmiş Ev Sahibi',
    outputEn: '1–2 confirmed Host Organisations',
  },
];

export interface OfficialActivityConfig {
  code: string;
  category: 'VET_LEARNER' | 'STAFF' | 'HOSTED' | 'PROJECT_TEAM';
  categoryLabelTr: string;
  categoryLabelEn: string;
  participantRoleTr: string;
  participantRoleEn: string;
  nameTr: string;
  nameEn: string;
  minDays: number;
  maxDays: number;
  ruleDescriptionTr: string;
  ruleDescriptionEn: string;
}

export const OFFICIAL_VET_ACTIVITIES: Record<string, OfficialActivityConfig> = {
  VET_SKILLS_COMPETITION: {
    code: 'VET_SKILLS_COMPETITION',
    category: 'VET_LEARNER',
    categoryLabelTr: 'VET Öğrenici Hareketliliği',
    categoryLabelEn: 'VET Learner Mobility',
    participantRoleTr: 'VET Öğrencisi',
    participantRoleEn: 'VET Learner',
    nameTr: 'Mesleki Beceri Yarışmasına Katılım (1–10 gün)',
    nameEn: 'Participation in VET skills competitions (1–10 days)',
    minDays: 1,
    maxDays: 10,
    ruleDescriptionTr: 'Mesleki eğitim öğrenicilerinin uluslararası beceri yarışmalarına katılımı (1–10 gün).',
    ruleDescriptionEn: 'Participation of VET learners in international skills competitions (1–10 days).',
  },
  VET_GROUP_MOBILITY: {
    code: 'VET_GROUP_MOBILITY',
    category: 'VET_LEARNER',
    categoryLabelTr: 'Mesleki Eğitim Öğrenici Hareketliliği',
    categoryLabelEn: 'Mobility of VET Learners',
    participantRoleTr: 'Mesleki Eğitim Öğrenicisi',
    participantRoleEn: 'VET Learner',
    nameTr: 'Mesleki Eğitim Öğrenicilerinin Grup Hareketliliği (2–30 gün)',
    nameEn: 'Group mobility of VET learners (2–30 days)',
    minDays: 2,
    maxDays: 30,
    ruleDescriptionTr: 'VET öğrenicilerinin ortak kurumdaki akranlarıyla birlikte grupça öğrenme faaliyeti (2–30 gün, en az 2 öğrenici).',
    ruleDescriptionEn: 'Group learning activity with peers at host institution (2–30 days, min 2 learners).',
  },
  VET_SHORT_TERM: {
    code: 'VET_SHORT_TERM',
    category: 'VET_LEARNER',
    categoryLabelTr: 'Mesleki Eğitim Öğrenici Hareketliliği',
    categoryLabelEn: 'Mobility of VET Learners',
    participantRoleTr: 'Mesleki Eğitim Öğrenicisi',
    participantRoleEn: 'VET Learner',
    nameTr: 'Mesleki Eğitim Öğrenicilerinin Kısa Dönemli Öğrenme Hareketliliği (10–89 gün)',
    nameEn: 'Short-term learning mobility of VET learners (10–89 days)',
    minDays: 10,
    maxDays: 89,
    ruleDescriptionTr: 'VET öğrenicilerinin ev sahibi işletmede veya mesleki okulda iş temelli stajı (10–89 gün).',
    ruleDescriptionEn: 'Work-based internship or vocational school learning (10–89 days).',
  },
  VET_LONG_TERM_PRO: {
    code: 'VET_LONG_TERM_PRO',
    category: 'VET_LEARNER',
    categoryLabelTr: 'Mesleki Eğitim Öğrenici Hareketliliği',
    categoryLabelEn: 'Mobility of VET Learners',
    participantRoleTr: 'Mesleki Eğitim Öğrenicisi',
    participantRoleEn: 'VET Learner (ErasmusPro)',
    nameTr: 'Mesleki Eğitim Öğrenicilerinin Uzun Dönemli Öğrenme Hareketliliği – ErasmusPro (90–365 gün)',
    nameEn: 'Long-term learning mobility of VET learners – ErasmusPro (90–365 days)',
    minDays: 90,
    maxDays: 365,
    ruleDescriptionTr: 'VET öğrenicileri ve yeni mezunlar için kapsamlı işbaşı staj (90–365 gün).',
    ruleDescriptionEn: 'Comprehensive long-term work-based placement (90–365 days).',
  },
  JOB_SHADOWING: {
    code: 'JOB_SHADOWING',
    category: 'STAFF',
    categoryLabelTr: 'Personel Hareketliliği',
    categoryLabelEn: 'Staff Mobility',
    participantRoleTr: 'Öğretmen / Eğitici / Personel Katılımcı',
    participantRoleEn: 'Staff Participant – Teacher or Trainer',
    nameTr: 'İşbaşı Gözlem (2–60 gün)',
    nameEn: 'Job shadowing (2–60 days)',
    minDays: 2,
    maxDays: 60,
    ruleDescriptionTr: 'Personelin ev sahibi işletmede veya okulda iyi uygulamaları ve süreçleri gözlemlemesi (2–60 gün).',
    ruleDescriptionEn: 'Observation of practices and processes at host partner (2–60 days).',
  },
  TEACHING_ASSIGNMENT: {
    code: 'TEACHING_ASSIGNMENT',
    category: 'STAFF',
    categoryLabelTr: 'Personel Hareketliliği',
    categoryLabelEn: 'Staff Mobility',
    participantRoleTr: 'Öğretmen / Eğitici / Personel Katılımcı',
    participantRoleEn: 'Staff Participant – Teacher or Trainer',
    nameTr: 'Öğretme veya Eğitim Verme Görevi (2–365 gün)',
    nameEn: 'Teaching or training assignments (2–365 days)',
    minDays: 2,
    maxDays: 365,
    ruleDescriptionTr: 'Eğitici veya personelin ortak kurumda ders verme ya da eğitim yürütme görevi (2–365 gün).',
    ruleDescriptionEn: 'Staff delivering teaching or training at a partner institution (2–365 days).',
  },
  STAFF_COURSE_TRAINING: {
    code: 'STAFF_COURSE_TRAINING',
    category: 'STAFF',
    categoryLabelTr: 'Personel Hareketliliği',
    categoryLabelEn: 'Staff Mobility',
    participantRoleTr: 'Öğretmen / Eğitici / Personel Katılımcı',
    participantRoleEn: 'Staff Participant – Teacher or Trainer',
    nameTr: 'Kurslar ve Eğitimler (2–10 gün)',
    nameEn: 'Courses and training (2–10 days)',
    minDays: 2,
    maxDays: 10,
    ruleDescriptionTr: 'Mesleki eğitim personelinin yapılandırılmış uzmanlık kurslarına katılımı (2–10 gün).',
    ruleDescriptionEn: 'Participation of VET staff in structured training courses (2–10 days).',
  },
  INVITED_EXPERT: {
    code: 'INVITED_EXPERT',
    category: 'HOSTED',
    categoryLabelTr: 'Kuruma Gelen Katılımcılar',
    categoryLabelEn: 'Hosted Participants',
    participantRoleTr: 'Davetli Uzman',
    participantRoleEn: 'Invited Expert',
    nameTr: 'Davetli Uzman (2–60 gün)',
    nameEn: 'Invited experts (2–60 days)',
    minDays: 2,
    maxDays: 60,
    ruleDescriptionTr: 'Yurt dışından okulunuza davet edilen sektör profesyonelleri veya eğitmenler (2–60 gün).',
    ruleDescriptionEn: 'Trainers or industry experts invited from abroad to your institution (2–60 days).',
  },
  HOSTING_TEACHERS: {
    code: 'HOSTING_TEACHERS',
    category: 'HOSTED',
    categoryLabelTr: 'Kuruma Gelen Katılımcılar',
    categoryLabelEn: 'Hosted Participants',
    participantRoleTr: 'Eğitimdeki Öğretmen / Eğitici',
    participantRoleEn: 'Hosted Teacher-in-Training',
    nameTr: 'Eğitimdeki Öğretmen ve Eğiticilere Ev Sahipliği Yapılması (10–365 gün)',
    nameEn: 'Hosting teachers and educators in training (10–365 days)',
    minDays: 10,
    maxDays: 365,
    ruleDescriptionTr: 'Yurt dışındaki öğretmenlik/eğitmenlik öğrencilerinin kurumunuzda staj yapması (10–365 gün).',
    ruleDescriptionEn: 'Hosting prospective teachers from abroad for placements at your school (10–365 days).',
  },
  PREPARATORY_VISIT: {
    code: 'PREPARATORY_VISIT',
    category: 'PROJECT_TEAM',
    categoryLabelTr: 'Proje Ekibi',
    categoryLabelEn: 'Project Team',
    participantRoleTr: 'Hazırlık Ziyareti Katılımcısı',
    participantRoleEn: 'Preparatory Visit Participant',
    nameTr: 'Hazırlık Ziyareti (Maks. 3 kişi)',
    nameEn: 'Preparatory visit (Max 3 persons)',
    minDays: 1,
    maxDays: 5,
    ruleDescriptionTr: 'Ev sahibi başına bir ziyaret; hareketlilik öncesi teknik ve idari mutabakat için en fazla 3 kişi.',
    ruleDescriptionEn: 'One visit per host institution; max 3 persons for pre-mobility preparation.',
  },
};
