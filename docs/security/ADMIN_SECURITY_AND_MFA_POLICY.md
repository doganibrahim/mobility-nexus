# ErasmusMobility — Yönetici Güvenliği, İki Aşamalı Doğrulama (MFA) ve Denetim Günlüğü Politikası

**Belge Sürümü:** 1.0.0  
**Tarih:** 7 Ekim 2026  
**Kapsam:** ErasmusMobility.com Yönetim Paneli, API Uç Noktaları ve Kurumsal Sistemler  
**Uyumluluk:** KVKK, AB Genel Veri Koruma Tüzüğü (GDPR), Erasmus+ Dijital Güvenlik Standartları  

---

## 1. Amaç ve Kapsam

Bu politika belgesi, **ErasmusMobility.com** platformundaki yönetici hesaplarının güvenliğini, iki aşamalı kimlik doğrulama (MFA/2FA) zorunluluklarını, sunucu taraflı yetkilendirme (RBAC) kurallarını, denetim günlüğü (Audit Logging) mimarisini ve iletişim formu spam koruma mekanizmalarını resmi olarak belirler.

---

## 2. İki Aşamalı Doğrulama (MFA / 2FA) Politikası

### 2.1. Zorunlu Kapsam
Aşağıdaki yetkilere sahip tüm kullanıcı hesapları için İki Aşamalı Doğrulama (MFA) **kesinlikle zorunludur**:
* `SUPER_ADMIN` (Süper Yönetici)
* `PLATFORM_ADMIN` (Platform Yöneticisi)
* `ADMIN` (Operasyonel Yönetici)
* Kurumsal e-posta beyaz listesinde (`ADMIN_EMAILS`) yer alan tüm hesaplar.

### 2.2. Desteklenen ve Zorunlu Tutulan Doğrulama Yöntemleri
1. **TOTP Zaman Tabanlı Kimlik Doğrulama Uygulamaları (Birincil Tercih):**
   * Google Authenticator, Microsoft Authenticator, 1Password, Bitwarden veya Apple Keychain.
2. **FIDO2 / WebAuthn Donanım Güvenlik Anahtarları:**
   * YubiKey ve biyometrik cihaz anahtarları (Touch ID / Windows Hello).
3. **SMS ile Doğrulama:**
   * SIM takası (SIM swapping) riskleri nedeniyle yalnızca ikincil kurtarma yöntemi olarak kabul edilir; birincil MFA olarak TOTP zorunludur.

### 2.3. Clerk Kimlik Sağlayıcısı Üzerinde MFA Zorunlu Kılma Adımları
ErasmusMobility platformu kimlik doğrulama omurgası olarak Clerk altyapısını kullanır. Üretim ortamında yönetici MFA'sını etkinleştirmek için:
1. **Clerk Dashboard > Configure > User & Authentication > Multi-factor:**
   * *"Two-factor authentication"* seçeneğini **Required for Admins** veya **Always Required** durumuna getirin.
2. **Allowed Methods:**
   * *"Authenticator application (TOTP)"* seçeneğini etkinleştirin.
3. **Session Lifetime:**
   * Yönetici oturum süresini en fazla **12 saat**; boşta kalma süresini (inactivity timeout) en fazla **30 dakika** olarak yapılandırın.
4. **Step-Up Authentication:**
   * Kritik CMS değişiklikleri veya toplu veri silme işlemlerinde oturum şifresinin veya TOTP kodunun yeniden sorulması (Re-verification) zorunludur.

---

## 3. Rol Tabanlı Erişim Denetimi (RBAC) ve Savunma Derinliği

Platformda en az ayrıcalık (Principle of Least Privilege) ilkesi uygulanır:

| Rol | Erişim Kapsamı | Koruma Katmanı |
| :--- | :--- | :--- |
| `SUPER_ADMIN` / `PLATFORM_ADMIN` | Tüm `/admin/*`, `/api/admin/*`, QA metrikleri, CMS ve kütüphane yönetimi | `proxy.ts` Middleware + `AdminLayout` + API Uç Noktası Doğrulaması |
| `ORG_ADMIN` (Okul / Host) | Kendi kurumunun `/school/pipeline`, `/marketplace/host/*` panelleri | Tenant Guard + Organizasyon İzolasyonu |
| `MEMBER` / `VIEWER` | Sadece okuma veya başvuru taslağı görüntüleme yetkisi | Sayfa Seviyesi Yetki Kontrolü |
| `GUEST` (Misafir) | Genel sayfalar, arama motoru, açık katalog ve bilgi kütüphanesi | Genel Erişim (CSP + HSTS korumalı) |

### 3.1. Çok Katmanlı Güvenlik Kontrolleri
* **Katman 1 (Edge Middleware - `proxy.ts`):** `/api/admin/*` ve `/admin/*` yollarındaki tüm istekleri sunucu tarafında yakalar; yetkisiz veya oturumsuz istekleri anında reddeder.
* **Katman 2 (Server Component - `AdminLayout`):** `/admin` sayfalarının tamamı sunucu tarafında `verifyAdminAccess()` ile kontrol edilir; yetkisiz kullanıcılar ana sayfaya yönlendirilir.
* **Katman 3 (API Route Seviyesi):** `/api/admin/metrics`, `/api/admin/qa`, `/api/admin/audit-logs` vb. uç noktalar doğrudan istek bazında yetki doğrulaması yapar.

---

## 4. Denetim Günlüğü (Audit Logging) Mimarisi

Sistem güvenliğini izlemek ve olası güvenlik ihlallerini tespit etmek amacıyla `apps/web/lib/audit-logger.ts` modülü devreye alınmıştır.

### 4.1. Günlüğe Kaydedilen Olaylar
* `ADMIN_ACCESS_GRANTED`: Başarılı yönetici paneli erişimleri.
* `ADMIN_ACCESS_DENIED`: Yetkisiz yönetici erişim denemeleri.
* `CONTACT_FORM_SUBMISSION`: Geçerli iletişim ve kurumsal destek talepleri.
* `CONTACT_SPAM_BLOCKED`: Honeypot tuzağına takılan veya zaman eşiğini aşan bot girişimleri.
* `RATE_LIMIT_EXCEEDED`: API hız sınırını aşan IP adresleri.
* `CMS_REVISION_CREATED`: İçerik ve kurs yönetiminde yapılan değişiklikler.
* `DOCUMENT_DELETED` / `DOCUMENT_MODIFIED`: Kütüphane dokümanı işlemleri.
* `QA_TEST_TRIGGERED`: Canlı kalite kontrol ve sistem dayanıklılık testleri.

### 4.2. Günlük Formatı ve Veri Saklama
Her denetim günlüğü kaydı aşağıdaki yapılandırılmış JSON formatında saklanır:
```json
{
  "id": "audit-m8k2a1-7x9q",
  "timestamp": "2026-10-07T12:40:00.000Z",
  "action": "ADMIN_ACCESS_GRANTED",
  "actorUserId": "user_2...",
  "actorEmail": "admin@erasmusmobility.com",
  "clientIp": "198.51.100.42",
  "userAgent": "Mozilla/5.0 ...",
  "status": "SUCCESS",
  "details": {
    "role": "PLATFORM_ADMIN",
    "method": "session_claims_role"
  }
}
```

* **Canlı Bellek Tamponu:** Son 500 olay anında `/api/admin/audit-logs` üzerinden incelenebilir.
* **Kalıcı Günlükler:** Üretim ortamında tüm denetim günlükleri standart `stdout` üzerinden merkezi izleme servislerine (CloudWatch, Datadog veya Logstash) aktarılır.
* **Saklama Süresi:** İlgili yasal denetim gereksinimleri uyarınca güvenlik ve denetim kayıtları en az **180 gün** süreyle şifrelenmiş olarak muhafaza edilir.

---

## 5. İletişim Formu Spam Koruması ve Giriş Doğrulama

Otomatik bot ağlarının sunucuyu meşgul etmesini veya sahte başvuru üretmesini önlemek amacıyla `/api/contact` üzerinde üçlü koruma katmanı uygulanmıştır:
1. **Görünmez Honeypot Tuzağı (`website` / `hp_field`):** Gerçek kullanıcıların görmediği ve doldurmadığı gizli form alanı. Botlar doldurduğunda istek sessizce engellenir.
2. **Zaman Tuzağı (Time-Trap):** Formun yüklenme anından itibaren 1.8 saniyeden daha kısa sürede gönderilen formlar bot olarak işaretlenir.
3. **Kayan Pencereli Hız Sınırlaması (Sliding-Window Rate Limiting):** Aynı IP adresinden 10 dakika içinde en fazla 5 form gönderilebilir. Aşılması durumunda `429 Too Many Requests` döner.
4. **Girdi Temizleme (Sanitization):** Tüm metin girdileri XSS, HTML etiketleri ve kontrol karakterlerinden arındırılır; e-posta adresleri RFC standartlarına göre doğrulanır.

---

## 6. Olay Müdahale ve Anahtar Döndürme (Key Rotation) Prosedürü

1. **Yönetici Hesabı Şüpheli Girişinde:**
   * İlgili kullanıcının Clerk oturumu derhal sonlandırılır.
   * Şifresi sıfırlanır ve MFA yöntemi yeniden tanımlanır.
2. **`ADMIN_SECRET_KEY` İhlalinde:**
   * `.env.production` dosyasındaki `ADMIN_SECRET_KEY` ve `JWT_SECRET` anahtarları 32 baytlık rastgele kriptografik değerle yenilenir.
   * Uygulama ortamı yeniden derlenip dağıtılır.
3. **Denetim Raporu:**
   * Olayın başlangıç ve bitiş zamanı `/api/admin/audit-logs` kayıtlarından incelenerek teknik rapor oluşturulur.
