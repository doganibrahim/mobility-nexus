**Projenin Genel Özeti**

Sen kıdemli bir Full-Stack Yazılım Mühendisi ve Yazılım Mimarı olarak görev yapıyorsun. Benimle birlikte **"CAPPINNO Mobility Nexus"** adlı projeyi sıfırdan geliştireceğiz. Bu proje, akredite kurumların Erasmus+ KA1 hareketlilik süreçlerini planlamasını, uygulamasını ve raporlamasını sağlayan, B2B SaaS yapısında bir "Erasmus Mobility Management as a Service (EMaaS)" platformudur.

Lütfen tüm kod üretimlerinde ve mimari kararlarda aşağıdaki kurallara kesin olarak uy:

## Proje Bağlamı ve Genel Bakış

* **Modüler Yapı:** Platform; Kurum/Host eşleştirme, evrak otomasyonu, eğitim/işbaşı pazar yeri ve yapay zeka destekli kalite/etki raporlama dahil olmak üzere 8 ana modülden oluşmaktadır.


* **Geliştirme Planı:** Proje 4 aylık (Sprint 0 - Sprint 12) sıkı bir Agile (Çevik) teslimat planına sahiptir.



## Teknoloji Yığını ve Mimari (Tech Stack)

* **Frontend:** React / Next.js (TypeScript) ile duyarlı, rol bazlı navigasyona sahip SPA/SSR mimarisi.


* **Backend:** Node.js / NestJS kullanılarak geliştirilecek, sürüm kontrollü REST API (`/api/v1` base path).


* **Veritabanı:** PostgreSQL kullanılacak olup, veritabanı şemaları (migration) sıkı bir ilişkisel bütünlükle tasarlanacaktır.



## Temel Güvenlik ve Geliştirme Kuralları

* **Multi-tenant (Çoklu Kiracı) İzolasyonu:** Veriler kurumlara (`organisation_id`) göre izole edilecek; hiçbir kurum diğerinin verisine API veya UI üzerinden erişemeyecektir.


* **OIDC/OAuth2 ve RBAC:** Kimlik doğrulama işlemleri güvenli bir altyapıyla yapılacak ve "Platform Admin, Org Admin, Viewer" gibi Rol Tabanlı Erişim Kontrolü (RBAC) mekanizmaları API korumalarında (Guard/Middleware) zorunlu kılınacaktır.


* **KVKK/GDPR ve Audit Trail:** Hassas veriler korunacak, onay (consent) logları tutulacak ve silinemez bir denetim izi (audit_event) tablosu ile tüm kritik değişiklikler loglanacaktır.



## Mevcut Odak: Sprint 0 ve Sprint 1 Görevleri

* **Monorepo ve DevOps:** `/apps` ve `/packages` klasör yapısının kurulması, Docker ile PostgreSQL ayağa kaldırılması ve CI/CD temellerinin atılması.


* **Veritabanı Başlangıcı:** `0001_platform_foundation` ve `0002_auth_identity` migration dosyalarının oluşturulması (tenant context, audit ve auth tabloları).


* **Kurum Profili API'leri (CRUD):** Akredite kurumların kaydı için `organisation` tablosunun ve yönetim servislerinin yazılması.


* **Kullanıcı ve Ekip Davetleri:** `membership` ve `invitation` tablolarının kurularak e-posta davetiyesi üretme uç noktalarının kodlanması.



Yukarıdaki bağlamı anladığını onayla. Anladıysan, Sprint 0'ın ilk görevi olan **Monorepo klasör yapısının oluşturulması ve PostgreSQL Docker-compose dosyasının yazılması** ile geliştirmeye başlayalım.

Toplam fazda tamamlanacak.

**1. Faz**
Sen kıdemli bir Full-Stack Yazılım Mühendisi olarak, Erasmus hareketlilik süreçlerini yöneten çok kiracılı (multi-tenant) B2B SaaS platformu "CAPPINNO Mobility Nexus" projesinin ilk ay (Sprint 0 ve Sprint 1) geliştirmelerini yapacaksın. Geliştirme sürecinde aşağıdaki teknik gereksinimlere ve iş kurallarına kesinlikle uymalısın:

### Proje Özeti ve Teknik Altyapı

* **Teknoloji Yığını:** Frontend için React/Next.js (TypeScript), Backend için Node.js/NestJS, veritabanı için PostgreSQL kullanılacaktır.


* **Yapı:** Proje `/apps` ve `/packages` klasör düzeniyle monorepo olarak başlatılacaktır.



### Sprint 0: DevOps ve Sistem Temelleri

* **Veritabanı Başlangıcı:** Docker ile PostgreSQL ayağa kaldırılacak; ilk olarak `0001_platform_foundation` ve `0002_auth_identity` migration dosyaları (tenant context, audit ve auth tabloları) yazılacaktır.


* **Güvenlik ve İzolasyon:** OIDC/OAuth2 altyapısı ve Rol Tabanlı Erişim Kontrolü (RBAC) kurulacaktır. Kurumlar arası veri sızıntısını engelleyen kesin bir çoklu kiracı (multi-tenant) veri izolasyonu zorunludur.


* **Loglama:** KVKK/GDPR uyumlu denetim izi (`audit_event`) oluşturulacak ve istekler "Correlation ID" middleware'i ile izlenecektir.



### Sprint 1: Kurum ve Kullanıcı Yönetimi

* **Kurum Profili (CRUD):** Akredite kurumların profil kayıtları için `organisation` tablosu oluşturulacak, zorunlu alan doğrulamaları (validation) yapılarak API'ler ve UI bileşenleri yazılacaktır.


* **Kullanıcı Davetleri:** `membership` ve `invitation` tabloları kurularak; tek kullanımlık, süresi dolabilen token içeren e-posta davet akışları ve rol atama ekranları kodlanacaktır.


* **Readiness (Hazırlık) Göstergesi:** Profil verilerini inceleyerek kurumun eksiksizliğini 0-100 arası bir skorla hesaplayan algoritma ve UI widget'ı geliştirilecektir.



### Temel Geliştirme Kuralları

* Veritabanı ilişkileri (Foreign Keys) ve kısıtlamalar eksiksiz tanımlanacaktır.


* Sistem durumunu kontrol etmek için `/api/v1/health` ve `/ready` endpoint'leri eklenecektir.


**2. Faz**
Sen kıdemli bir Full-Stack Yazılım Mühendisi olarak, CAPPINNO Mobility Nexus projesinin 2. ay geliştirmelerini (Sprint 2 ve Sprint 3) yapacaksın. İlk ay tamamlanan kullanıcı ve çoklu kiracı (multi-tenant) altyapısının üzerine, sistemin "Host & Partner Network" (Ev Sahibi ve Ortak Ağı) modüllerini inşa edeceksin. Lütfen aşağıdaki mimari ve iş gereksinimlerine kesin olarak uy:

### Sprint 2: Ev Sahibi Kaydı ve Doğrulaması (Host Registration & Verification)

* **Veritabanı (Migration):** Ev sahibi kurumlar için `host_organisation`, `host_capacity`, `host_activity` ve doğrulama süreçleri için `host_verification`, `verification_evidence` tablolarını oluştur. Sistem taksonomisi için `country_ref` ve `sector_ref` referans tablolarını hazırla.


* **Host Kayıt API ve UI (S2-US01):** Dışa açık (public) kayıt formu (UI-05) ve `/hosts/register` API'sini geliştir. Kayıt sırasında sistemde mükerrer (duplicate) kurum oluşmasını engelleyecek validasyonları ekle. Formda ülke, sektör, faaliyet, kapasite, diller ve erişilebilirlik alanları zorunlu olmalıdır.


* **Doğrulama İş Akışı (S2-US02):** Sadece yetkili (Partner Network Manager) rollerin erişebileceği bir doğrulama konsolu (UI-06) ve `/hosts/{id}/verification` endpoint'ini yaz. Kayıtların durumunu yönetecek (Pending > UnderReview > Verified / NeedsUpdate / Rejected / Suspended) bir state machine (durum makinesi) kur ve 15+ kriterlik kontrol listesi yapısını entegre et.


* **Taksonomi Servisleri (S2-US03):** UI tarafındaki filtreler için `/reference/countries` ve `/reference/sectors` endpoint'lerini oluştur.



### Sprint 3: Arama ve Eşleştirme Motoru v1 (Host Search & Matching)

* **Arama Altyapısı (S3-US01):** Sadece durumu "Verified" (Doğrulandı) olan kurumların listeleneceği `/hosts/search` endpoint'ini ve host arama (UI-07) sayfasını geliştir. Ülke, sektör, dil, kapasite ve erişilebilirlik gibi en az 8 filtre ile yüksek performanslı arama (indexleme) yapılabilmelidir.


* **Eşleştirme Motoru (Matching Algorithm):** Hareketlilik taleplerine göre en uygun 5 ev sahibini (Top-5 listesi) skorlayıp getirecek algoritmayı yaz. Bu algoritma şu ağırlıklara göre çalışmalıdır: Faaliyet türü (%20), Sektör (%20), Tarih/Kapasite uygunluğu (%20), Hedef ülke (%10), Dil (%10), Erişilebilirlik (%10) ve Doğrulama/Profil kalitesi (%10).


* **API ve Arayüz:** Eşleştirme sonuçları için `/mobility-cases/{id}/matching-runs` API'sini kur ve UI-08 ekranında Top-5 listesini, eşleşme gerekçeleri (rationale) ve kapasite uyarılarıyla birlikte göster.



### Teknik Prensipler

* Eşleştirme algoritması kapasite kontrolü yapmalı; kapasitesi dolu olan kurumlar için sistemde uyarı gösterilmelidir (Capacity conflict warning).


* Tüm doğrulama kararları ve eşleştirme sonuçları, denetim (audit) loglarına işlenmelidir.



**3. Faz**

Sen kıdemli bir Full-Stack Yazılım Mühendisi olarak, CAPPINNO Mobility Nexus projesinin 3. ay geliştirmelerini (Sprint 6 ve Sprint 10) yapacaksın. Bu aşamada eğitim pazar yeri (marketplace) özelliklerini, katılımcı hazırlık portalını ve satış operasyonlarını yönetecek akıllı CRM altyapısını kuracaksın. Lütfen aşağıdaki teknik gereksinimlere kesin olarak uy:

### Sprint 6: Eğitim ve İşbaşı Gözlem Akademisi

* **Eğitim Kursu Kataloğu (Marketplace):** `course`, `course_session` ve `course_learning_outcome` veritabanı tablolarını (migration) oluştur. `/courses` ve `/courses/search` CRUD API'lerini yazarak, öğrenme çıktılarını (LO) destekleyen "Course Catalogue" (UI-13) arayüzünü geliştir.


* **İşbaşı Gözlem (Job Shadowing) Fırsatları:** Süre ve kapasite bilgisi tutacak `job_shadowing_offer` tablosunu kur. `/job-shadowing-offers` API'lerini kapasite kontrol (eligibility) iş akışıyla birlikte kodlayarak pazar yeri (UI-14) ekranını entegre et.


* **Katılımcı Hazırlık Portalı:** `prep_module`, `prep_assignment` ve `prep_completion` tablolarını oluştur. Katılımcıların 10 mikro-öğrenme modülündeki ilerlemelerini kaydedecek `/preparation/modules` servisini ve ilerleme çubuklarına sahip portalı (UI-15, UI-16) geliştir.



### Sprint 10: CRM, Lead Skorlama ve Ticari Modüller

* **İhtiyaç Segmentasyonu (Need Scores):** Kurum anket verilerini analiz ederek S1'den S8'e kadar olan 8 ticari ihtiyaç segmentini 0-100 arası puanlayan algoritmayı kodla; sonuçları UI üzerinde radar grafik (radar chart) olarak göster.


* **Lead Skorlama Kural Motoru:** `lead_score_rule` ve `lead_score_result` tablolarını oluştur. Satın alma niyeti, hareketlilik hacmi gibi faktörlere göre puanlama yapan (Örn: Platform ilgisi +15 puan) `/crm/leads/{id}/score` motorunu kur. Müşterileri HOT (80-100), WARM (60-79), NURTURE (40-59) ve INFORMATIONAL (<40) olarak dört ana sınıfa ayır.


* **Akıllı Paket Önerisi:** Kurumun lead skoru ve ihtiyaç segmentlerine dayanarak "Basic, Pro veya Premium" paketlerinden en uygununu CRM ekranında (UI-20) satış temsilcisine öneren karar algoritmasını yaz.



**4. Faz**
Sen kıdemli bir Full-Stack Yazılım Mühendisi olarak, CAPPINNO Mobility Nexus projesinin 4. ve son ay geliştirmelerini (Sprint 11 ve Sprint 12) yapacaksın. Bu nihai aşamada; sisteme yapay zeka (AI) destekli belge/rapor üretimi, abonelik/ödeme altyapısı ve canlıya alım (production) kalite kontrol modüllerini entegre edeceksin. Lütfen aşağıdaki teknik mimari ve iş gereksinimlerine kesin olarak uy:

### Sprint 11: Yapay Zeka Asistanı ve Raporlama (AI Assistant & Reporting)

* **Veritabanı Altyapısı:** Yapay zeka sohbetleri ve bilgi yönetimi için `ai_knowledge_item`, `ai_conversation` ve `ai_message` tablolarını kur. Üretim görevleri ve raporlar için `ai_generation_job`, `ai_report` ve denetim amaçlı `ai_generation_event` tablolarını (migration) oluştur.


* **AI API Servisleri:** RAG (Retrieval-Augmented Generation) destekli `/ai/chat`, belge taslakları için `/ai/generate` ve analitik raporlar için `/ai/reports` endpoint'lerini geliştir. Tenant (kiracı) verileri arasında çapraz erişimi engelleyen güvenlik önlemlerini (guardrails) mutlaka kurgula.


* **Human-in-the-Loop (İnsan Onayı) Kuralı:** Yapay zeka hiçbir hukuki/resmi belgeyi otomatik onaylayamaz (autonomous final approval yasaktır). `ai_generation_event` tablosunda `input_hash` ve `human_review_status` (Pending / Accepted / Edited / Rejected) alanları zorunlu olmalı, tüm AI çıktıları arayüzde "Taslak" (Draft) olarak işaretlenmelidir.



### Sprint 12: Abonelik, Ödeme ve Sistem Metrikleri (Commercial & QA)

* **Abonelik ve Ödeme Modülü:** Kurumların Basic/Pro/Premium paket seçimleri için `subscription_plan`, `subscription`, `entitlement` ve `payment_record` tablolarını oluştur. `/subscriptions` ve `/payments` API'lerini yaz. Çift ödeme çekimini engellemek için mükerrer (duplicate) isteklere karşı "idempotency key" kontrolünü mutlaka koda ekle.


* **Sistem Kalite ve Test Metrikleri (QA):** Yük, güvenlik ve erişilebilirlik test verilerini tutmak için `qa_test_run` ve `system_metric` tablolarını oluştur. `/admin/qa` ve `/admin/metrics` endpoint'leri ile Admin QA Dashboard (Sistem Yönetici Ekranı) arayüzünü geliştir.


* **Ticari Yönetim Paneli (Executive Dashboard):** Sistemdeki kayıtlı kurumlar, doğrulanan ev sahipleri (hosts), eşleşmeler, dönüşüm oranları ve abonelik memnuniyetlerini takip edebilmek için `commercial_metric_snapshot` tablosunu ve `/analytics/commercial` veri servislerini kur.



Yukarıdaki bağlamı anladığını onayla. Anladıysan, ilk görev olan **Sprint 11 veritabanı tablolarının (ai_knowledge_item, ai_generation_event vb.) migration dosyalarını yazarak** geliştirmeye başla.



**BANA ATILAN ÇOK BASİT VE TEMEL PROTOTYPE**

Sen kıdemli bir Frontend Geliştiricisin. Sana vereceğim tek sayfalık HTML/JS prototipini, projemizin **React / Next.js (TypeScript)** ortamına bir frontend iskeleti olarak taşıyacaksın.

Lütfen prototipi analiz et ve aşağıdaki kurallara göre sıfırdan oluştur:

### 1. Durum Yönetimi (State Management)

* HTML içindeki `getState()`, `saveLocal()` ve `loadLocal()` mantığını, form verilerini tutacak bir global state (örneğin React Context API veya Zustand) yapısına dönüştür.
* `schoolName`, `participantType`, `language`, `h1`-`h10` gibi tüm input ve select alanlarını bu state üzerinden yönetilebilir (controlled component) hale getir.

### 2. Modüler Bileşenler (Component Structure)

Tüm kodu tek bir dosyaya yığma. HTML'deki `<div class="card">` bloklarını mantıksal React bileşenlerine ayır. (Örneğin: `OrganisationProfile.tsx`, `HostSearch.tsx` vb.).

### 3. Çekirdek Mantık ve Hook'lar (Logic & Utils)

JS içindeki hesaplama fonksiyonlarını React bileşenlerinden soyutlayarak utility (yardımcı) fonksiyonlar veya custom hook'lar olarak yaz:

* `scoreAssessment()` (12 soruluk testin yüzdelik hesaplaması)
* `scoreHost()` (Ağırlıklı Ev Sahibi skorlaması)
* `makeDecision()` (8 kriterli karar motoru)
* `generateOutcomes()` (Rol bazlı metin üretimi)
* JS içindeki `const fields` ve `const qs` (12 Soru) sabitlerini ayrı bir `constants.ts` dosyasına taşı.

### 4. Stil, Tasarım ve Tema Yönetimi (Theming)

HTML içindeki standart renkleri YOK SAY. Bunun yerine projede 4 farklı tasarım teması test edilecektir. CSS değişkenleri (CSS variables) veya Tailwind Theme provider kullanarak aşağıdaki 4 paleti ve fontları sisteme tanımla:

* **Tema 01:** Ana Renkler: `#FFCA41`, `#000000`, `#A6A6A6`


* **Tema 02:** Ana Renkler: `#E56438`, `#302C4F`, `#C6C6C6`


* **Tema 03:** Ana Renkler: `#863C6D`, `#FFE5BC`, `#E8E8E8`


* **Tema 04:** Ana Renkler: `#013399`, `#F4CB1D`, `#E8E8E8`

Fontlar:
- Playfair Display ve Source Sans 3.
- Fontlar: Montserrat ve Open Sans.
- Fontlar: Merriweather ve Lato.
- Fontlar: Poppins ve Roboto.

* **Görev:** Arayüzün sağ üst köşesine, kullanıcının bu 4 tema arasında anında geçiş yapabilmesini sağlayacak basit bir "Tema Değiştirici" (Theme Switcher) componenti ekle. Prototipteki kart, form ve grid yapılarını koru ancak renk ve fontları bu aktif temadan alacak şekilde bağla.

Şimdi bu analizi onayla ve kodlamaya `constants.ts` ile tema yapılandırmasını (Theme Provider) oluşturarak başla.

**Prototip kodları**:
<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>CAPPINNO EU VET Mobility Matching & Competence Gateway</title>
<meta name="description" content="KA121-VET / KA122-VET karar, ESCO–ISCED eşleştirme, competence assessment ve EU host matching aracı.">
<style>
:root{--bg:#f5f7fb;--panel:#fff;--ink:#172033;--muted:#667085;--brand:#17365d;--brand2:#215d9c;--line:#dfe5ee;--soft:#eef4fb;--good:#107c41;--warn:#b26a00;--bad:#b42318}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,Segoe UI,Arial,sans-serif;line-height:1.45}header{background:linear-gradient(135deg,var(--brand),#0f2745);color:#fff;padding:24px;position:sticky;top:0;z-index:20;box-shadow:0 2px 10px rgba(0,0,0,.12)}.head{max-width:1400px;margin:auto;display:flex;align-items:center;justify-content:space-between;gap:20px}.brand h1{font-size:22px;margin:0 0 4px}.brand p{margin:0;color:#dbe8f8;font-size:13px}.badge{display:inline-flex;border:1px solid rgba(255,255,255,.3);padding:7px 10px;border-radius:999px;font-size:12px;background:rgba(255,255,255,.08)}nav{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:87px;z-index:19;overflow-x:auto;white-space:nowrap}nav .navin{max-width:1400px;margin:auto;padding:0 14px}nav a{display:inline-block;padding:13px 10px;color:#334155;text-decoration:none;font-size:13px}nav a:hover{color:var(--brand2);background:var(--soft)}main{max-width:1400px;margin:22px auto;padding:0 18px 50px}.grid{display:grid;grid-template-columns:repeat(12,1fr);gap:16px}.card{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:18px;box-shadow:0 2px 8px rgba(16,24,40,.04)}.c12{grid-column:span 12}.c8{grid-column:span 8}.c6{grid-column:span 6}.c4{grid-column:span 4}h2{font-size:19px;margin:0 0 14px;color:var(--brand)}h3{font-size:15px;margin:18px 0 9px}label{display:block;font-size:12px;font-weight:700;margin:10px 0 6px;color:#344054}input,select,textarea{width:100%;padding:10px 11px;border:1px solid #cfd7e3;border-radius:9px;background:#fff;color:#111827;font:inherit;font-size:13px}textarea{min-height:86px;resize:vertical}.row{display:grid;grid-template-columns:repeat(12,1fr);gap:12px}.span6{grid-column:span 6}.span4{grid-column:span 4}.span3{grid-column:span 3}.span8{grid-column:span 8}.span12{grid-column:span 12}button,.btn{border:0;border-radius:9px;padding:10px 14px;font-weight:700;cursor:pointer;font-size:13px;text-decoration:none;display:inline-block}.primary{background:var(--brand2);color:#fff}.secondary{background:#e8eef7;color:var(--brand)}.good{background:var(--good);color:#fff}.ghost{background:#fff;border:1px solid var(--line);color:#344054}.toolbar{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}.kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}.kpi{background:#f8fafc;border:1px solid var(--line);border-radius:12px;padding:14px}.kpi b{font-size:23px;display:block;color:var(--brand)}.kpi small{color:var(--muted)}.pill{display:inline-block;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800;margin:2px;background:#eaf2fb;color:#214f7e}.pill.good{background:#e7f6ec;color:var(--good)}.pill.warn{background:#fff2d6;color:var(--warn)}.pill.bad{background:#fee9e7;color:var(--bad)}.notice{padding:12px 14px;border-radius:10px;background:#fff8e8;border:1px solid #f1d59a;color:#6c4a00;font-size:12px}.info{padding:12px 14px;border-radius:10px;background:#eef6ff;border:1px solid #c9ddf4;color:#24476b;font-size:12px}table{width:100%;border-collapse:collapse;font-size:12px}th,td{border:1px solid var(--line);padding:8px;vertical-align:top}th{background:#edf3fa;color:#24476b;text-align:left}.scorebar{height:12px;background:#e8edf4;border-radius:20px;overflow:hidden}.scorebar span{display:block;height:100%;background:linear-gradient(90deg,#b42318,#f59e0b,#107c41);width:0}.q{padding:12px;border:1px solid var(--line);border-radius:10px;margin:8px 0;background:#fbfcfe}.q strong{font-size:12px}.q .scale{display:flex;gap:5px;margin-top:8px}.q .scale label{font-weight:400;margin:0;flex:1;text-align:center}.q input{width:auto}.result{border-left:5px solid var(--brand2);padding:13px 15px;background:#f8fbff;border-radius:8px;margin-top:12px}.hostscore{font-size:36px;font-weight:900;color:var(--brand)}.small{font-size:11px;color:var(--muted)}.muted{color:var(--muted)}.linkcards{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.linkcard{display:block;text-decoration:none;color:inherit;border:1px solid var(--line);border-radius:12px;padding:13px;background:#fff}.linkcard:hover{border-color:#9bb9db;background:#f8fbff}.linkcard b{display:block;color:var(--brand2);margin-bottom:4px}.report{background:#fff;border:1px dashed #b7c4d4;padding:16px;border-radius:12px}.report h3{color:var(--brand)}footer{text-align:center;color:#667085;font-size:11px;padding:25px}@media(max-width:1000px){.c8,.c6,.c4{grid-column:span 12}.kpis{grid-template-columns:repeat(2,1fr)}.linkcards{grid-template-columns:1fr}.row>*{grid-column:span 12!important}nav{top:104px}}@media print{header,nav,.toolbar,.no-print{display:none!important}body{background:#fff}main{max-width:none;margin:0;padding:0}.card{box-shadow:none;border:0;break-inside:avoid}.grid{display:block}.card{margin-bottom:14px}}
</style>
</head>
<body>
<header><div class="head"><div class="brand"><h1>CAPPINNO EU VET Mobility Matching & Competence Gateway</h1><p>KA121-VET • KA122-VET • ESCO • ISCED-F • Competence Assessment • EU Host Matching</p></div><span class="badge">2026 Application Logic</span></div></header>
<nav><div class="navin"><a href="#school">School Profile</a><a href="#participant">Participant</a><a href="#esco">ESCO–ISCED</a><a href="#assessment">Competence Test</a><a href="#decision">KA Decision</a><a href="#host">Host Matching</a><a href="#partners">Find EU Host</a><a href="#outcomes">Learning Outcomes</a><a href="#report">Report</a></div></nav>
<main><section class="grid">
<div class="card c12"><h2>1. Sistem Mantığı</h2><div class="kpis"><div class="kpi"><b>1</b><small>School & Participant Profile</small></div><div class="kpi"><b>2</b><small>ESCO + ISCED-F Mapping</small></div><div class="kpi"><b>3</b><small>Competence Gap + KA121/122 Decision</small></div><div class="kpi"><b>4</b><small>EU Host Match + Mobility Plan</small></div></div><p class="small">Bu araç tavsiye ve planlama amaçlıdır. Nihai uygunluk, faaliyet türü, süre, bütçe ve başvuru kararları Erasmus+ Programme Guide, Türkiye Ulusal Ajansı kuralları ve ilgili çağrı belgeleriyle doğrulanmalıdır.</p></div>
<div class="card c6" id="school"><h2>2. School Profile</h2><div class="row"><div class="span8"><label>Meslek lisesi / VET kuruluşu</label><input id="schoolName" placeholder="Örn. ... Mesleki ve Teknik Anadolu Lisesi"></div><div class="span4"><label>İl</label><input id="city" placeholder="Ankara"></div><div class="span6"><label>Erasmus VET Akreditasyonu</label><select id="accredited"><option value="unknown">Bilinmiyor</option><option value="yes">Evet</option><option value="no">Hayır</option></select></div><div class="span6"><label>OID</label><input id="oid" placeholder="E10..."></div><div class="span12"><label>Erasmus Plan hedefi (akredite ise)</label><textarea id="erasmusPlan" placeholder="Örn. öğretmen ve öğrencilerin Industry 4.0 / dijital üretim yetkinliklerini geliştirmek"></textarea></div><div class="span12"><label>Kurumsal ihtiyaç / challenge</label><textarea id="institutionNeed" placeholder="Somut ihtiyaç ve mevcut performans boşluğunu yazın."></textarea></div></div></div>
<div class="card c6" id="participant"><h2>3. Participant & Mobility Profile</h2><div class="row"><div class="span6"><label>Katılımcı türü</label><select id="participantType"><option value="teacher">Teknik öğretmen</option><option value="student">Meslek lisesi öğrencisi</option></select></div><div class="span6"><label>Mobilite tercihi</label><select id="mobilityGoal"><option>Job shadowing / observation</option><option>Work-based learner mobility</option><option>Skills training</option><option>Teaching/training assignment</option><option>Mixed / not decided</option></select></div><div class="span6"><label>Katılımcı adı / kodu</label><input id="participantName" placeholder="İsim veya anonim ID"></div><div class="span6"><label>İngilizce / çalışma dili hazırlığı (0–100)</label><input id="language" type="number" min="0" max="100" value="60"></div><div class="span6"><label>AB ülke tercihi</label><input id="country" placeholder="Örn. Germany / Netherlands / Spain"></div><div class="span6"><label>Planlanan süre (öneri)</label><input id="duration" placeholder="Örn. 10 gün"></div></div></div>
<div class="card c12" id="esco"><h2>4. ESCO – ISCED-F Mapper</h2><div class="info">ISCED-F eğitim alanını; ESCO ise meslek, skills/competences ve occupational profile eşleştirmesini destekler. ESCO'da her occupation bir ISCO-08 koduna bağlıdır; tam ESCO concept URI'si resmî ESCO portalından doğrulanmalıdır.</div><div class="row"><div class="span6"><label>Mesleki alan / bölüm</label><select id="vetField" onchange="applyField()"><option value="">Seçiniz</option><option value="automation">Elektrik-Elektronik / Endüstriyel Otomasyon</option><option value="software">Bilişim / Yazılım</option><option value="network">Bilişim / Ağ Sistemleri</option><option value="mechanics">Makine / CNC / Metal</option><option value="automotive">Motorlu Araçlar / Otomotiv</option><option value="energy">Elektrik / Yenilenebilir Enerji</option><option value="construction">İnşaat / Yapı</option><option value="hospitality">Konaklama / Yiyecek-İçecek</option><option value="tourism">Turizm / Seyahat</option><option value="agriculture">Tarım / Akıllı Tarım</option><option value="health">Sağlık Hizmetleri</option><option value="media">Grafik / Medya / Görsel İletişim</option></select></div><div class="span3"><label>ISCED-F Kodu</label><input id="iscedCode" readonly></div><div class="span3"><label>ISCED-F Alanı</label><input id="iscedName" readonly></div><div class="span6"><label>Önerilen ESCO arama terimi / occupation family</label><input id="escoTerm"></div><div class="span3"><label>ISCO-08 (doğrulanacak)</label><input id="iscoCode" placeholder="ESCO occupation seçilince"></div><div class="span3"><label>ESCO Concept URI</label><input id="escoUri" placeholder="http://data.europa.eu/esco/occupation/..."></div><div class="span12"><label>Öncelikli ESCO skills/competences</label><textarea id="skills"></textarea></div></div><div class="toolbar no-print"><a class="btn primary" id="escoSearch" href="https://esco.ec.europa.eu/en/classification/occupation-main" target="_blank">ESCO'da Doğrula</a><a class="btn ghost" href="https://esco.ec.europa.eu/en/classification" target="_blank">ESCO Classification</a><a class="btn ghost" href="https://uis.unesco.org/sites/default/files/documents/isced-fields-of-education-and-training-2013-en.pdf" target="_blank">ISCED-F 2013</a></div></div>
<div class="card c8" id="assessment"><h2>5. Competence Assessment</h2><p class="small">Aşağıdaki hızlı test 1–5 öz-değerlendirme ölçeği kullanır. Ayrıntılı test için CAPPINNO Competence4VET Gateway bağlantısı da verilmiştir.</p><div id="questions"></div><div class="toolbar no-print"><button class="primary" onclick="scoreAssessment()">Testi Puanla</button><a class="btn good" target="_blank" href="https://www.competence4vet.com/CAPPINNO_Competence4VET_Assessment_Gateway_v7.html">Tam Competence4VET Testini Aç</a></div><div class="result" id="assessmentResult"><b>Sonuç:</b> Henüz hesaplanmadı.</div></div>
<div class="card c4"><h2>Competence Gap</h2><label>Hızlı test skoru</label><div class="scorebar"><span id="bar"></span></div><div class="hostscore" id="scoreText">—</div><label>Hedef seviye (0–100)</label><input id="targetScore" type="number" min="0" max="100" value="80"><label>Harici Competence4VET sonucu (varsa)</label><input id="externalScore" type="number" min="0" max="100" placeholder="Tam test sonucu"><div class="toolbar no-print"><button class="secondary" onclick="useExternal()">Harici Skoru Kullan</button></div><p class="small">Test sonucu tek başına katılımı reddetmek için kullanılmamalıdır. Düşük skor, ön eğitim veya destek ihtiyacını göstermek üzere değerlendirilir.</p></div>
<div class="card c12" id="decision"><h2>6. KA121-VET / KA122-VET Decision Engine</h2><div class="row"><div class="span3"><label>Competence Gap ağırlığı</label><input value="25%" readonly></div><div class="span3"><label>Institutional Need</label><input value="20%" readonly></div><div class="span3"><label>ESCO Match</label><input value="15%" readonly></div><div class="span3"><label>ISCED Match</label><input value="10%" readonly></div><div class="span3"><label>Host Learning Capacity</label><input value="15%" readonly></div><div class="span3"><label>Language Readiness</label><input value="5%" readonly></div><div class="span3"><label>Inclusion / Accessibility</label><input value="5%" readonly></div><div class="span3"><label>Erasmus Plan / Objective Alignment</label><input value="5%" readonly></div></div><div class="toolbar no-print"><button class="primary" onclick="makeDecision()">Karar Oluştur</button></div><div class="result" id="decisionResult">Henüz karar üretilmedi.</div></div>
<div class="card c12" id="host"><h2>7. EU Host Organisation Matching</h2><div class="row"><div class="span6"><label>Host kuruluş adı</label><input id="hostName" placeholder="EU VET school / company / training centre"></div><div class="span3"><label>Ülke</label><input id="hostCountry"></div><div class="span3"><label>Host türü</label><select id="hostType"><option>VET school</option><option>Training centre</option><option>Company / SME</option><option>Factory / industrial company</option><option>Sectoral organisation</option></select></div><div class="span4"><label>Mesleki alan uyumu (0–100)</label><input id="h1" type="number" value="80"></div><div class="span4"><label>Learning outcomes kapasitesi (0–100)</label><input id="h2" type="number" value="80"></div><div class="span4"><label>Teknik altyapı (0–100)</label><input id="h3" type="number" value="80"></div><div class="span4"><label>Erasmus deneyimi (0–100)</label><input id="h4" type="number" value="60"></div><div class="span4"><label>İngilizce iletişim (0–100)</label><input id="h5" type="number" value="70"></div><div class="span4"><label>Öğrenci kabul kapasitesi (0–100)</label><input id="h6" type="number" value="70"></div><div class="span4"><label>Öğretmen job-shadowing kapasitesi (0–100)</label><input id="h7" type="number" value="70"></div><div class="span4"><label>Mentor kapasitesi (0–100)</label><input id="h8" type="number" value="80"></div><div class="span4"><label>OHS / safety altyapısı (0–100)</label><input id="h9" type="number" value="80"></div><div class="span4"><label>Uzun dönem işbirliği isteği (0–100)</label><input id="h10" type="number" value="70"></div></div><div class="toolbar no-print"><button class="primary" onclick="scoreHost()">Host Score Hesapla</button></div><div class="result"><span class="hostscore" id="hostScore">—</span> <span id="hostLabel" class="pill">Henüz hesaplanmadı</span></div></div>
<div class="card c12" id="partners"><h2>8. EU Partner / Host Finding</h2><div class="linkcards"><a class="linkcard" target="_blank" href="https://school-education.ec.europa.eu/en/networking/partner-finding"><b>European School Education Platform (ESEP)</b><span class="small">VET ve school education kuruluşları için partner-finding ilanı verin ve mevcut ilanları tarayın.</span></a><a class="linkcard" target="_blank" href="https://salto-et.net"><b>SALTO Education & Training TCA</b><span class="small">Contact seminar, online event ve National Agency Training & Cooperation Activities.</span></a><a class="linkcard" target="_blank" href="https://erasmus-plus.ec.europa.eu/projects"><b>Erasmus+ Project Results Platform</b><span class="small">Akredite kuruluşları ve geçmişte desteklenmiş projeleri araştırın.</span></a></div><h3>Önerilen Partner Search Funnel</h3><table><thead><tr><th>Aşama</th><th>Kaynak</th><th>Arama</th><th>Hedef çıktı</th></tr></thead><tbody><tr><td>1</td><td>Erasmus+ Results</td><td>Geçmiş KA121/KA122-VET + mesleki alan</td><td>30–50 deneyimli kuruluş</td></tr><tr><td>2</td><td>ESEP</td><td>Aktif partner/host ilanları</td><td>15–20 aday</td></tr><tr><td>3</td><td>SALTO/TCA</td><td>Contact seminars & networking</td><td>5–10 doğrudan bağlantı</td></tr><tr><td>4</td><td>Kuruluş web sitesi</td><td>Teknik kapasite, mentor, English, safety</td><td>Shortlist</td></tr><tr><td>5</td><td>Online görüşme</td><td>Learning programme + cost/task sharing</td><td>1–2 host</td></tr></tbody></table></div>
<div class="card c6" id="outcomes"><h2>9. Learning Outcomes Generator</h2><label>Öncelikli competence gap</label><input id="primaryGap" placeholder="Örn. PLC programming / CNC / vocational English"><label>Mobilite sonunda beklenen teknik kazanım</label><textarea id="technicalOutcome" placeholder="Katılımcı ... yapabilecektir."></textarea><label>Transversal / green / digital kazanım</label><textarea id="transversalOutcome" placeholder="Takım çalışması, OHS, dijital araçlar, sürdürülebilir uygulamalar..."></textarea><div class="toolbar no-print"><button class="secondary" onclick="generateOutcomes()">Örnek Learning Outcomes Üret</button></div></div>
<div class="card c6"><h2>10. Quality & Responsibility Checklist</h2><table><tr><th>Alan</th><th>Sending School</th><th>EU Host</th></tr><tr><td>Participant selection</td><td>✓ Owner</td><td>Input</td></tr><tr><td>Preparation</td><td>✓</td><td>✓</td></tr><tr><td>Learning programme</td><td>✓</td><td>✓</td></tr><tr><td>Learning outcomes</td><td>✓</td><td>✓</td></tr><tr><td>Mentor</td><td>Contact</td><td>✓ Primary</td></tr><tr><td>Monitoring</td><td>✓</td><td>✓</td></tr><tr><td>Safety / emergency protocol</td><td>✓</td><td>✓</td></tr><tr><td>Assessment & recognition</td><td>✓ Owner</td><td>Evidence</td></tr><tr><td>Reporting / NA contact / financial management</td><td>✓ Core task</td><td>—</td></tr></table><p class="small">Core project tasks beneficiary/sending organisationda kalmalıdır. Supporting organisations pratik uygulama desteği verebilir; ancak içerik, kalite, sonuçlar ve temel kararların sahipliği beneficiary'de kalır.</p></div>
<div class="card c12" id="report"><h2>11. Mobility Recommendation Report</h2><div class="toolbar no-print"><button class="primary" onclick="buildReport()">Raporu Güncelle</button><button class="secondary" onclick="window.print()">PDF / Yazdır</button><button class="ghost" onclick="saveLocal()">Tarayıcıya Kaydet</button><button class="ghost" onclick="loadLocal()">Kaydı Yükle</button><button class="ghost" onclick="exportJSON()">JSON Dışa Aktar</button></div><div class="report" id="reportBox"><h3>Henüz rapor oluşturulmadı</h3><p class="muted">Profil, test ve host alanlarını doldurduktan sonra “Raporu Güncelle” seçeneğini kullanın.</p></div></div>
<div class="card c12"><h2>12. Resmî Kaynaklar ve Uyarı</h2><p class="small">KA121-VET akredite kuruluşlar için Erasmus Plan ile bağlantılı yıllık hareketlilik ve bütçe talebine dayanır. KA122-VET kısa dönemli hareketlilikte kurumun background, needs/challenges, objectives, activities, budget, quality standards ve follow-up bölümlerini gerekçelendirmesini ister.</p><div class="notice"><b>Assessment disclaimer:</b> Bu araçtaki competence test ve Mobility Suitability Score tavsiye/planlama amaçlıdır. Sonuçlar tek başına öğrenci/öğretmen seçimi, dışlama, işe alım, notlandırma veya başka yüksek etkili kararlar için kullanılmamalıdır. Participant selection; şeffaf, adil ve kapsayıcı ayrı bir prosedürle yürütülmelidir.</div><div class="toolbar no-print"><a class="btn ghost" target="_blank" href="https://erasmus-plus.ec.europa.eu/programme-guide">Erasmus+ Programme Guide</a><a class="btn ghost" target="_blank" href="https://www.ua.gov.tr/">Türkiye Ulusal Ajansı</a><a class="btn ghost" target="_blank" href="https://esco.ec.europa.eu/">ESCO</a></div></div>
</section></main><footer>CAPPINNO • EU VET Mobility Matching & Competence Gateway • Single-file HTML prototype</footer>
<script>
const fields={automation:{isced:"0714",name:"Electronics and automation",esco:"automation technician / mechatronics technician / industrial electrician",skills:"PLC programming; industrial automation; robotics; troubleshooting; control systems; preventive maintenance"},software:{isced:"0613",name:"Software and applications development and analysis",esco:"software developer / application programmer",skills:"programming; software testing; version control; debugging; application development; cybersecurity awareness"},network:{isced:"0612",name:"Database and network design and administration",esco:"ICT network technician / network administrator",skills:"network configuration; cybersecurity; troubleshooting; servers; routing; system administration"},mechanics:{isced:"0715",name:"Mechanics and metal trades",esco:"CNC operator / machining technician / welder",skills:"CNC operation; CAD/CAM; machining; measurement; welding; preventive maintenance; OHS"},automotive:{isced:"0716",name:"Motor vehicles, ships and aircraft",esco:"motor vehicle technician / automotive mechatronics technician",skills:"vehicle diagnostics; EV systems; maintenance; electrical systems; OHS; fault finding"},energy:{isced:"0713",name:"Electricity and energy",esco:"electrician / renewable energy technician / solar energy technician",skills:"electrical installation; energy systems; solar PV; electrical safety; testing; maintenance"},construction:{isced:"0732",name:"Building and civil engineering",esco:"construction technician / building electrician / construction craft worker",skills:"technical drawings; site safety; measurement; building systems; sustainable construction"},hospitality:{isced:"1013",name:"Hotel, restaurants and catering",esco:"cook / hotel receptionist / waiter / hospitality worker",skills:"guest service; food safety; culinary techniques; customer communication; hospitality operations"},tourism:{isced:"1015",name:"Travel, tourism and leisure",esco:"travel consultant / tour guide / tourism information officer",skills:"customer service; destination information; booking systems; intercultural communication; digital tourism"},agriculture:{isced:"0811",name:"Crop and livestock production",esco:"agricultural technician / farm worker / precision agriculture operator",skills:"crop production; farm machinery; irrigation; precision agriculture; sustainability; OHS"},health:{isced:"0913",name:"Nursing and midwifery",esco:"healthcare assistant / nursing associate (scope must be checked)",skills:"patient support; hygiene; safety; communication; documentation; digital health awareness"},media:{isced:"0211",name:"Audio-visual techniques and media production",esco:"graphic designer / audiovisual technician / multimedia designer",skills:"digital design; audiovisual production; image editing; multimedia content; copyright awareness"}};
const qs=[["Technical competence","Mesleki alanımdaki temel araç, ekipman veya yazılımları güvenli ve doğru biçimde kullanabilirim."],["Problem solving","Mesleki bir arıza veya problemi sistematik olarak analiz edip çözüm geliştirebilirim."],["Digital competence","Mesleki görevlerimde dijital araçları, veriyi ve çevrim içi platformları etkin kullanabilirim."],["OHS","İş sağlığı ve güvenliği kurallarını uygulayabilir, riskleri tanıyabilirim."],["Green competence","Kaynak verimliliği, atık azaltma ve sürdürülebilir uygulamaları mesleki görevlerime yansıtabilirim."],["Communication","Teknik bilgiyi ekip arkadaşlarına, öğrencilere veya mentora açık biçimde aktarabilirim."],["Teamwork","Çok kültürlü veya disiplinler arası ekiplerde sorumluluk alarak çalışabilirim."],["Learning to learn","Yeni bir teknoloji veya yöntemi öğrenmek için hedef belirleyip öğrenme sürecimi izleyebilirim."],["Vocational English","Alanımla ilgili temel İngilizce terimleri ve işyeri iletişimini kullanabilirim."],["Intercultural","Farklı çalışma ve öğrenme kültürlerine uyum sağlayabilirim."],["Self-management","Yeni bir iş/öğrenme ortamında zamanı, görevleri ve sorumluluklarımı yönetebilirim."],["European mobility readiness","Yurt dışı öğrenme deneyimini kendi mesleki hedeflerimle ilişkilendirebilirim."]];let competenceScore=null,hostScoreValue=null,currentDecision=null;
function initQuestions(){questions.innerHTML=qs.map((q,i)=>`<div class="q"><strong>${i+1}. ${q[0]}</strong><div class="small">${q[1]}</div><div class="scale">${[1,2,3,4,5].map(v=>`<label><input type="radio" name="q${i}" value="${v}"> ${v}</label>`).join("")}</div></div>`).join("")}
function applyField(){const f=fields[vetField.value];if(!f)return;iscedCode.value=f.isced;iscedName.value=f.name;escoTerm.value=f.esco;skills.value=f.skills;escoSearch.href="https://esco.ec.europa.eu/en/classification/occupation-main?search="+encodeURIComponent(f.esco.split("/")[0].trim())}
function scoreAssessment(){let total=0,n=0,missing=[];qs.forEach((q,i)=>{const r=document.querySelector(`input[name="q${i}"]:checked`);if(r){total+=+r.value;n++}else missing.push(i+1)});if(missing.length){assessmentResult.innerHTML=`<b>Eksik:</b> ${missing.join(", ")} numaralı soruları cevaplayın.`;return}competenceScore=Math.round((total/(n*5))*100);bar.style.width=competenceScore+"%";scoreText.textContent=competenceScore+"/100";const target=+targetScore.value||80,gap=Math.max(0,target-competenceScore);let txt=competenceScore>=80?"Strong readiness":competenceScore>=65?"Good readiness":competenceScore>=50?"Preparation recommended":"Additional preparation strongly recommended";assessmentResult.innerHTML=`<b>Score:</b> ${competenceScore}/100 • <b>Target:</b> ${target} • <b>Gap:</b> ${gap} points • <span class="pill ${competenceScore>=65?"good":"warn"}">${txt}</span>`}
function useExternal(){const s=+externalScore.value;if(s>=0&&s<=100){competenceScore=s;bar.style.width=s+"%";scoreText.textContent=s+"/100";assessmentResult.innerHTML=`<b>Competence4VET external score used:</b> ${s}/100.`}}
function scoreHost(){const w=[20,15,10,10,10,10,5,10,5,5],ids=["h1","h2","h3","h4","h5","h6","h7","h8","h9","h10"];hostScoreValue=Math.round(ids.reduce((a,id,i)=>a+(Math.max(0,Math.min(100,+document.getElementById(id).value||0))*w[i]/100),0));hostScore.textContent=hostScoreValue+"/100";let label=hostScoreValue>=85?"Excellent host":hostScoreValue>=70?"Suitable host":hostScoreValue>=55?"Conditional shortlist":"Weak match";hostLabel.textContent=label;hostLabel.className="pill "+(hostScoreValue>=70?"good":hostScoreValue>=55?"warn":"bad")}
function makeDecision(){if(competenceScore===null){scoreAssessment();if(competenceScore===null)return}if(hostScoreValue===null)scoreHost();const acc=accredited.value,need=institutionNeed.value.trim()?85:55,esco=escoTerm.value.trim()?90:40,isced=iscedCode.value.trim()?95:40,lang=Math.max(0,Math.min(100,+language.value||0)),inclusion=75,alignment=erasmusPlan.value.trim()?90:(acc==="no"?75:45),gap=Math.max(0,(+targetScore.value||80)-competenceScore),gapPriority=Math.min(100,50+gap*2),score=Math.round(gapPriority*.25+need*.20+esco*.15+isced*.10+(hostScoreValue||60)*.15+lang*.05+inclusion*.05+alignment*.05);let action=acc==="yes"?"KA121-VET":acc==="no"?"KA122-VET":"Akreditasyon durumu doğrulanmalı";let readiness=score>=85?"Strongly Recommended":score>=70?"Recommended":score>=55?"Recommended with Preparation":score>=40?"Preparation Before Mobility":"Further preparation / needs review";currentDecision={score,action,readiness};decisionResult.innerHTML=`<b>Recommended action:</b> ${action}<br><b>Mobility Suitability Score:</b> ${score}/100 • <span class="pill ${score>=70?"good":score>=55?"warn":"bad"}">${readiness}</span><br><span class="small">Akredite okulda faaliyet mevcut Erasmus Plan hedeflerine bağlanmalıdır. Akreditasyonu olmayan uygun VET kuruluşunda KA122 için needs/challenges → objectives → activities → measurement zinciri kurulmalıdır.</span>`}
function generateOutcomes(){const gap=primaryGap.value||escoTerm.value||"selected vocational competence",p=participantType.value;technicalOutcome.value=p==="teacher"?`Mobilite sonunda öğretmen, ${gap} alanındaki güncel Avrupa uygulamalarını gözlemleyebilecek, en az iki yöntemi kendi atölye/öğretim ortamına uyarlayabilecek ve edinilen uygulamaları meslektaşlarıyla paylaşabilecektir.`:`Mobilite sonunda öğrenci, ${gap} ile ilgili tanımlanmış iş görevlerini host mentor gözetiminde güvenli biçimde uygulayabilecek, performansını kanıtlayacak bir ürün/görev çıktısı sunabilecek ve öğrenme kazanımlarını açıklayabilecektir.`;transversalOutcome.value="Katılımcı; OHS kurallarını, takım çalışmasını, mesleki İngilizceyi, dijital araçları, çevresel sorumluluğu ve kültürlerarası iletişimi gerçek bir Avrupa öğrenme/iş ortamında geliştirecektir."}
function val(id){return (document.getElementById(id)?.value||"").trim()}function esc(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function buildReport(){if(!currentDecision)makeDecision();if(hostScoreValue===null)scoreHost();const test=competenceScore===null?"Not assessed":competenceScore+"/100",hs=hostScoreValue===null?"Not scored":hostScoreValue+"/100";reportBox.innerHTML=`<h3>EU VET Mobility Recommendation</h3><table><tr><th>Sending organisation</th><td>${esc(val("schoolName"))||"—"} / ${esc(val("city"))}</td><th>OID</th><td>${esc(val("oid"))||"—"}</td></tr><tr><th>Participant</th><td>${esc(val("participantName"))||"—"} (${participantType.value==="teacher"?"Technical teacher":"VET learner"})</td><th>Proposed KA</th><td><b>${currentDecision?.action||"—"}</b></td></tr><tr><th>VET field</th><td>${esc(iscedName.value)||"—"}</td><th>ISCED-F</th><td>${esc(iscedCode.value)||"—"}</td></tr><tr><th>ESCO search profile</th><td>${esc(escoTerm.value)||"—"}</td><th>ISCO / ESCO URI</th><td>${esc(iscoCode.value)||"—"}<br>${esc(escoUri.value)||"—"}</td></tr><tr><th>Competence score</th><td>${test}</td><th>Mobility suitability</th><td>${currentDecision?.score||"—"}/100</td></tr><tr><th>Primary gap</th><td colspan="3">${esc(val("primaryGap")||val("skills"))||"—"}</td></tr><tr><th>EU Host</th><td>${esc(val("hostName"))||"—"} / ${esc(val("hostCountry"))}</td><th>Host score</th><td>${hs}</td></tr><tr><th>Mobility format</th><td>${esc(mobilityGoal.value)}</td><th>Suggested duration</th><td>${esc(val("duration"))||"To be validated"}</td></tr></table><h3>Institutional Need / Erasmus Plan Alignment</h3><p>${esc(val("institutionNeed"))||"—"}</p><p><b>Erasmus Plan:</b> ${esc(val("erasmusPlan"))||"—"}</p><h3>Priority ESCO Skills / Competences</h3><p>${esc(val("skills"))||"—"}</p><h3>Expected Learning Outcomes</h3><p>${esc(val("technicalOutcome"))||"—"}</p><p>${esc(val("transversalOutcome"))||"—"}</p><h3>Decision</h3><p><b>${currentDecision?.readiness||"—"}</b>. Assessment sonuçları tavsiye amaçlıdır; nihai participant selection ayrı, şeffaf, adil ve kapsayıcı prosedürle yapılmalıdır.</p>`}
function getState(){const ids=["schoolName","city","accredited","oid","erasmusPlan","institutionNeed","participantType","mobilityGoal","participantName","language","country","duration","vetField","iscedCode","iscedName","escoTerm","iscoCode","escoUri","skills","targetScore","externalScore","hostName","hostCountry","hostType","h1","h2","h3","h4","h5","h6","h7","h8","h9","h10","primaryGap","technicalOutcome","transversalOutcome"],o={};ids.forEach(id=>o[id]=document.getElementById(id).value);o.competenceScore=competenceScore;o.hostScoreValue=hostScoreValue;o.currentDecision=currentDecision;return o}function saveLocal(){localStorage.setItem("cappinnoVetMobility",JSON.stringify(getState()));alert("Kaydedildi.")}function loadLocal(){const x=localStorage.getItem("cappinnoVetMobility");if(!x)return alert("Kayıt bulunamadı.");const o=JSON.parse(x);Object.keys(o).forEach(k=>{const e=document.getElementById(k);if(e)e.value=o[k]});competenceScore=o.competenceScore;hostScoreValue=o.hostScoreValue;currentDecision=o.currentDecision;if(competenceScore!=null){bar.style.width=competenceScore+"%";scoreText.textContent=competenceScore+"/100"}if(hostScoreValue!=null){hostScore.textContent=hostScoreValue+"/100"}buildReport()}function exportJSON(){const blob=new Blob([JSON.stringify(getState(),null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="CAPPINNO_VET_Mobility_Profile.json";a.click();URL.revokeObjectURL(a.href)}initQuestions();
</script>
</body>
</html>

**[KOPYALANACAK PROMPT BİTİŞİ]**

---

Arayüzdeki tema değiştiriciyi şimdilik bir geçiş butonu olarak sayfanın üstüne koymasını istedim. Kararını verdikten sonra bu tema değiştiriciyi tamamen kaldırıp tek temayla mı devam etmek istersin, yoksa kurumların (müşterilerin) kendi panellerini özelleştirebilmesi için bu özelliği kalıcı bir özellik olarak admin ayarlarına mı taşıyalım?