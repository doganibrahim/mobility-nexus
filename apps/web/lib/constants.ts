/**
 * CAPPINNO Mobility Nexus - Constants & Configuration
 * 
 * 4 Exact Designer Palettes:
 * - Palet 01: #FFCA41 (Sarı), #000000 (Siyah), #A6A6A6 (Gri)
 * - Palet 02 (CAPPINNO Logosu İlhamlı): #E56438 (Turuncu), #302C4F (Koyu Lacivert), #C6C6C6 (Gri)
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
    name: 'Palet 02: CAPPINNO Turuncu & Lacivert',
    badge: '#E56438 • #302C4F',
    primary: '#E56438',
    secondary: '#302C4F',
    accent: '#C6C6C6',
    description: 'CAPPINNO logosundan ilham alan Turuncu (#E56438), Koyu Lacivert (#302C4F) ve Gri (#C6C6C6).',
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
    description: 'Resmî Erasmus+ logosundan ilham alan AB Mavisi (#013399), Erasmus Sarısı (#F4CB1D) ve Açık Gri (#E8E8E8).',
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
  isced: string;
  name: string;
  esco: string;
  skills: string;
}

export const VET_FIELDS: Record<string, VetField> = {
  automation: {
    id: 'automation',
    label: 'Elektrik-Elektronik / Endüstriyel Otomasyon',
    isced: '0714',
    name: 'Electronics and automation',
    esco: 'automation technician / mechatronics technician / industrial electrician',
    skills: 'PLC programlama; endüstriyel otomasyon; robotik; arıza tespiti; kontrol sistemleri; önleyici bakım',
  },
  software: {
    id: 'software',
    label: 'Bilişim / Yazılım Geliştirme',
    isced: '0613',
    name: 'Software and applications development and analysis',
    esco: 'software developer / application programmer',
    skills: 'programlama; yazılım testi; sürüm kontrolü (Git); hata ayıklama; uygulama geliştirme; siber güvenlik farkındalığı',
  },
  network: {
    id: 'network',
    label: 'Bilişim / Ağ Sistemleri & Siber Güvenlik',
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
  description: string;
}

export const ASSESSMENT_QUESTIONS: Question[] = [
  {
    id: 1,
    title: 'Mesleki Teknik Yetkinlik',
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
  { id: 'h1', label: 'Mesleki Alan Uyumu', weight: 20, defaultVal: 80 },
  { id: 'h2', label: 'Öğrenme Kazanımları Kapasitesi', weight: 15, defaultVal: 80 },
  { id: 'h3', label: 'Teknik ve Laboratuvar Altyapısı', weight: 10, defaultVal: 80 },
  { id: 'h4', label: 'Erasmus+ Proje Deneyimi', weight: 10, defaultVal: 60 },
  { id: 'h5', label: 'İngilizce / Çalışma Dili İletişimi', weight: 10, defaultVal: 70 },
  { id: 'h6', label: 'Öğrenici / Stajyer Kabul Kapasitesi', weight: 10, defaultVal: 70 },
  { id: 'h7', label: 'Öğretmen İşbaşı Gözlem Kapasitesi', weight: 5, defaultVal: 70 },
  { id: 'h8', label: 'Mentor ve Eğitici Desteği', weight: 10, defaultVal: 80 },
  { id: 'h9', label: 'İSG ve Güvenlik Standartları', weight: 5, defaultVal: 80 },
  { id: 'h10', label: 'Uzun Dönemli İşbirliği İsteği', weight: 5, defaultVal: 70 },
] as const;

export const DECISION_WEIGHTS = [
  { label: 'Yetkinlik Açığı (Gap)', weight: '25%' },
  { label: 'Kurumsal İhtiyaç', weight: '20%' },
  { label: 'ESCO Eşleşmesi', weight: '15%' },
  { label: 'ISCED-F Uyumu', weight: '10%' },
  { label: 'Ev Sahibi Kapasitesi', weight: '15%' },
  { label: 'Dil Seviyesi', weight: '5%' },
  { label: 'Kapsayıcılık / İhtiyaç', weight: '5%' },
  { label: 'Erasmus Planı Uyumu', weight: '5%' },
];

export const QUALITY_CHECKLIST = [
  { area: 'Katılımcı Seçimi (Selection)', sending: '✓ Sorumlu & Sahip (Yararlanıcı)', host: 'Girdi & Öneri' },
  { area: 'Hazırlık (Dil, Pedagojik & Kültürel)', sending: '✓ Birincil Sorumlu', host: 'Destekleyici Materyal' },
  { area: 'Öğrenme Programı & Müfredat', sending: '✓ Ortak Onay', host: '✓ Uygulama Programı' },
  { area: 'Öğrenme Kazanımları (Outcomes)', sending: '✓ Tanımlama & Onay', host: '✓ Pratik Uygulama' },
  { area: 'İşyeri Mentoru Ataması', sending: 'İletişim & Takip', host: '✓ Doğrudan Atama' },
  { area: 'İzleme & Değerlendirme', sending: '✓ Düzenli Raporlama', host: '✓ Günlük Gözlem' },
  { area: 'İSG & Acil Durum Protokolü', sending: '✓ Sigorta & Bilgilendirme', host: '✓ İşyeri Güvenliği' },
  { area: 'Kazanımların Tanınması (Europass)', sending: '✓ Belge Düzenleme', host: 'Kanıt & İmza' },
  { area: 'Ulusal Ajans Raporlaması & Bütçe', sending: '✓ Tek Sorumlu (Beneficiary)', host: '—' },
];

export const PARTNER_FUNNEL = [
  { step: '1', source: 'Erasmus+ Results Platform', query: 'Geçmiş KA121/KA122 VET projeleri + mesleki alan', output: '30–50 deneyimli kuruluş havuzu' },
  { step: '2', source: 'ESEP (European School Education Platform)', query: 'Aktif partner & ev sahibi arama ilanları', output: '15–20 potansiyel aday' },
  { step: '3', source: 'SALTO Education & Training / TCA', query: 'İletişim seminerleri & uluslararası ağlar', output: '5–10 doğrudan temas' },
  { step: '4', source: 'Kuruluş Web Sitesi & Doğrulama', query: 'Teknik kapasite, mentor varlığı, dil, İSG', output: 'Kısa Liste (Shortlist)' },
  { step: '5', source: 'Mutabakat & Görev Dağılımı', query: 'Öğrenme programı ve kalite taahhüdü', output: '1–2 kesinleşmiş Ev Sahibi' },
];
