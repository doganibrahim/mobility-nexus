/**
 * ErasmusMobility - KA121 Official Form Structure & Guidance Schema
 * Bu dosya, resmi Erasmus+ KA121 formunun tüm bölümlerini, alanlarını,
 * doldurma stratejilerini (Doğrudan Veri vs. AI Destekli) ve
 * Okul (Gönderen) ile Host (Kabul Eden) kurum rehberlerini saklar.
 */

export type KA121FillStrategy =
  | 'DIRECT_AUTOFILL' // Mobility Nexus veritabanından doğrudan otomatik çekilen alanlar (OID, tarihler vb.)
  | 'AI_ASSISTED'     // Hedefler, etki, kalite anlatımı gibi LLM/AI desteği ile yazdırılacak alanlar
  | 'MANUAL_UPLOAD'   // İmzalı belgeler, doğruluk beyanları (Declaration on Honour) vb.
  | 'DECLARATION'     // Şartların onay kutucukları (Checkboxes/Legal affirmations)
  | 'SYSTEM_GENERATED'; // Sistem tarafından hesaplanan bütçe/tablo/sayı özetleri

export interface KA121FieldGuidance {
  school: string; // Okul (Gönderen Kurum) için püf noktaları ve yapılması gerekenler
  host: string;   // Host (Kabul Eden Kurum) için gereken bilgi, kanıt ve işbirliği notları
  aiPromptTemplate?: string; // AI asistanının bu alanı doldururken kullanacağı prompt yapısı
}

export interface KA121FormField {
  id: string;
  fieldCode?: string;
  label: string;
  description?: string;
  fillStrategy: KA121FillStrategy;
  sourceKey?: string; // Mobility Nexus veri tabanındaki karşılık gelen alan (e.g. 'organisation.oid', 'mobility.participantCount')
  rules?: {
    isMandatory: boolean;
    minChars?: number;
    maxChars?: number;
    allowedValues?: string[];
  };
  guidance: KA121FieldGuidance;
}

export interface KA121FormSection {
  id: string;
  pageNumber: number;
  title: string;
  subtitle?: string;
  description: string;
  fields: KA121FormField[];
  subsections?: KA121FormSection[];
}

export interface KA121FormSchema {
  formId: 'KA121-VET' | 'KA121-SCH' | 'KA121-ADU';
  title: string;
  version: string;
  tableOfContents: Array<{
    id: string;
    title: string;
    page: number;
    subitems?: Array<{ id: string; title: string; page: number }>;
  }>;
  sections: KA121FormSection[];
}

/**
 * Resmi KA121 Form İskeleti (Görseller geldikçe detaylandırılacak)
 */
export const OFFICIAL_KA121_SCHEMA: KA121FormSchema = {
  formId: 'KA121-VET',
  title: 'Erasmus+ Accreditation Progress & Grant Application (KA121)',
  version: '2024-2027 Official Standard',
  tableOfContents: [
    {
      id: 'accreditation',
      title: 'Accreditation',
      page: 3,
    },
    {
      id: 'participating-organisations',
      title: 'Participating organisations',
      page: 3,
      subitems: [
        { id: 'applicant-organisation', title: 'Applicant organisation', page: 3 },
      ],
    },
    {
      id: 'erasmus-plan',
      title: 'Erasmus Plan',
      page: 4,
    },
    {
      id: 'activities',
      title: 'Activities',
      page: 5,
      subitems: [
        { id: 'list-of-activities', title: 'List of activities', page: 5 },
        { id: 'additional-expenses', title: 'Additional expenses', page: 6 },
        {
          id: 'exceptional-costs-inclusion',
          title: 'Exceptional costs and inclusion support for participants',
          page: 7,
        },
      ],
    },
    {
      id: 'annexes',
      title: 'Annexes',
      page: 9,
    },
    {
      id: 'application-conditions',
      title: 'Application conditions',
      page: 10,
    },
    {
      id: 'submission-history',
      title: 'Submission history',
      page: 12,
    },
  ],
  sections: [
    {
      id: 'accreditation',
      pageNumber: 3,
      title: 'Accreditation',
      description: 'Akreditasyon kodu, geçerlilik süresi ve hibe anlaşması temel parametreleri.',
      fields: [
        {
          id: 'acc_oid',
          fieldCode: 'OID',
          label: 'Organisation ID (OID)',
          description: 'Başvuran akredite kurumun resmi Avrupa Komisyonu OID kodu (E10xxxxxx).',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'organisation.oid',
          rules: { isMandatory: true, minChars: 8, maxChars: 8 },
          guidance: {
            school: 'Kurumunuzun resmi E-ile başlayan 8 haneli OID numarasını girin veya sistem profilinizden tek tıkla çekin.',
            host: 'Ev sahibi kurumun OID numarası bu alana yazılmaz; burası sadece akredite başvuran okulu ilgilendirir.',
          },
        },
        {
          id: 'acc_field',
          fieldCode: 'Field of application',
          label: 'Field of application',
          description: 'Akreditasyonun ait olduğu sektör (Mesleki Eğitim için Vocational Education and Training).',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'accreditation.field',
          rules: { isMandatory: true, allowedValues: ['Vocational Education and Training'] },
          guidance: {
            school: 'Akreditasyon belgenizle sabitlenmiştir. VET akreditasyonunuz varsa otomatik olarak "Vocational Education and Training" gelir.',
            host: 'Host kurumun sunduğu staj ve eğitim içeriklerinin VET alanı ile doğrudan uyumlu olması zorunludur.',
          },
        },
        {
          id: 'acc_type',
          fieldCode: 'Accreditation type',
          label: 'Accreditation type',
          description: 'Bireysel akreditasyon (Individual organisation) veya Konsorsiyum koordinatörü.',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'accreditation.type',
          rules: { isMandatory: true, allowedValues: ['Individual organisation', 'Mobility consortium coordinator'] },
          guidance: {
            school: 'Tek başınıza okul olarak başvuruyorsanız "Individual organisation", konsorsiyum lideriyseniz "Mobility consortium coordinator" seçilir.',
            host: 'Konsorsiyum durumunda birden fazla okuldan öğrenci gelebileceğini bilmek kapasite planlaması için önemlidir.',
          },
        },
        {
          id: 'acc_code',
          fieldCode: 'Accreditation code',
          label: 'Accreditation code',
          description: 'Ulusal Ajans tarafından verilen KA120 Akreditasyon sözleşme numarası (Örn: 2020-1-TR01-KA120-VET-000001).',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'accreditation.code',
          rules: { isMandatory: true },
          guidance: {
            school: 'Daha önce onaylanan KA120 akreditasyon hibe sözleşmenizdeki resmi proje kodudur.',
            host: 'Bilgi amaçlıdır.',
          },
        },
        {
          id: 'acc_national_agency',
          fieldCode: 'National agency of the applicant organisation',
          label: 'National agency of the applicant organisation',
          description: 'Başvuran kurumun bağlı olduğu Ulusal Ajans kodu (Örn: TR01 - Türkiye Ulusal Ajansı).',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'organisation.countryCode',
          rules: { isMandatory: true },
          guidance: {
            school: 'Kurumunuzun bulunduğu ülkenin Ulusal Ajansı sistem tarafından otomatik eşleştirilir.',
            host: 'Raporlama standartları ve kural yorumları gönderen okulun ulusal ajansına tabidir.',
          },
        },
        {
          id: 'acc_form_language',
          fieldCode: 'Language used to fill in the form',
          label: 'Language used to fill in the form',
          description: 'Formun doldurulacağı resmi dil seçimi.',
          fillStrategy: 'DIRECT_AUTOFILL',
          rules: { isMandatory: true, allowedValues: ['Turkish', 'English'] },
          guidance: {
            school: 'Türkiye Ulusal Ajansı için Türkçe veya İngilizce seçilebilir. Ancak uluslararası ortaklarla paylaşım ve şeffaflık için İngilizce veya çift dilli rehber önerilir.',
            host: 'Form Türkçe doldurulsa bile, host ile yapılan Learning Agreement ve çalışma programları mutlaka İngilizce olmalıdır.',
          },
        },
        {
          id: 'acc_grant_start_date',
          fieldCode: 'Grant agreement start date',
          label: 'Grant agreement start date',
          description: 'Proje hibe sözleşmesinin resmi başlangıç tarihi (Genellikle çağrı takvimine göre 01/06/2026).',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'grant.startDate',
          rules: { isMandatory: true },
          guidance: {
            school: 'Erasmus+ KA121 kuralları gereği proje başlangıç tarihi sabittir (01 Haziran). Faaliyetler bu tarihten önce başlayamaz.',
            host: 'Hareketliliklerin planlanan başlangıç tarihi en erken bu tarihten sonra olabilir.',
          },
        },
        {
          id: 'acc_grant_duration',
          fieldCode: 'Grant agreement duration (in months)',
          label: 'Grant agreement duration (in months)',
          description: 'Sözleşme süresi (Resmi başlangıç varsayılanı 15 aydır, süreç içinde 24 aya uzatılabilir).',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'grant.durationMonths',
          rules: { isMandatory: true, allowedValues: ['15', '24'] },
          guidance: {
            school: 'İlk başvuruda standart 15 aydır. Proje yürütülürken ihtiyaç duyulursa 24 aya kadar ek süre talep edilebilir.',
            host: 'Faaliyet dönemlerinin 15 aylık bu takvim aralığına dağıtılması beklenir.',
          },
        },
        {
          id: 'acc_grant_end_date',
          fieldCode: 'Grant agreement end date',
          label: 'Grant agreement end date',
          description: 'Proje bitiş tarihi (Başlangıç tarihi + süre formülüyle otomatik hesaplanır: örn. 30/08/2027).',
          fillStrategy: 'SYSTEM_GENERATED',
          rules: { isMandatory: true },
          guidance: {
            school: 'Sistem tarafından otomatik hesaplanır; elle değiştirilmez.',
            host: 'Tüm hareketliliklerin, değerlendirmelerin ve sertifikasyon işlemlerinin bu tarihten önce tamamlanması şarttır.',
          },
        },
      ],
    },
    {
      id: 'participating-organisations',
      pageNumber: 3,
      title: 'Participating organisations',
      description: 'Başvuru sahibi ve ortakların kurumsal detayları.',
      fields: [],
      subsections: [
        {
          id: 'applicant-organisation',
          pageNumber: 3,
          title: 'Applicant organisation',
          description: 'Başvuran akredite kurumun kimliği ve destekleyen kuruluş (supporting organisation) beyanı.',
          fields: [
            {
              id: 'app_org_id',
              label: 'Organisation ID',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'organisation.oid',
              rules: { isMandatory: true },
              guidance: {
                school: 'Kurum OID numarası girildiğinde Legal Name, Country ve City sistemden otomatik gelir.',
                host: 'İşlem gerekmez.',
              },
            },
            {
              id: 'app_legal_name',
              label: 'Legal name',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'organisation.name',
              rules: { isMandatory: true },
              guidance: {
                school: 'Kurumun resmi adı (OID kaydındaki tam ad).',
                host: 'İşlem gerekmez.',
              },
            },
            {
              id: 'app_country',
              label: 'Country',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'organisation.countryCode',
              rules: { isMandatory: true },
              guidance: { school: 'Kurumun ülkesi.', host: 'İşlem gerekmez.' },
            },
            {
              id: 'app_city',
              label: 'City',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'organisation.city',
              rules: { isMandatory: true },
              guidance: { school: 'Kurumun bulunduğu şehir.', host: 'İşlem gerekmez.' },
            },
            {
              id: 'app_supporting_organisations_question',
              fieldCode: 'Supporting organisations question',
              label: 'My organisation plans to work with other supporting organisations that are not going to host our participants, but are going to help with the implementation of activities.',
              description: 'Öğrencileri ağırlamayıp sadece proje idari işlerine destek veren harici aracı kuruluş kullanımı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              rules: { isMandatory: true, allowedValues: ['Yes', 'No'] },
              guidance: {
                school: '⚠️ KRİTİK UYARI: Ev sahibi (Host) kurumlar staj/eğitim ve mentorluk sağladıkları için "Supporting Organisation" SAYILMAZLAR! Harici bir aracı danışmanlık/taşeronluk firması ile çalışmıyorsanız bu soruya kesinlikle "No" demelisiniz. Eğer "Yes" derseniz sözleşme değişikliği ve ayrıntılı idari gerekçelendirme gerekir.',
                host: 'Ev sahibi kurum olarak öğrencilere eğitim, mentörlük ve staj imkanı sunduğunuz için resmi Erasmus Kalite Standartları gereği "Supporting Organisation" sayılmazsınız. Bu kutucuğun "No" işaretlenmesi normal ve doğrudur.',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'erasmus-plan',
      pageNumber: 4,
      title: 'Erasmus Plan',
      description: 'Kurumun KA120 akreditasyon hedefleri ile talep edilen bu yılki hareketliliklerin doğrudan uyumu ve gerekçesi.',
      fields: [
        {
          id: 'ep_linked_objectives',
          fieldCode: 'Erasmus Plan objectives linked to your accreditation',
          label: 'Linked Erasmus Plan Objectives',
          description: 'Akreditasyon sözleşmenizde onaylanmış çok yıllık Erasmus Planı hedefleri listesi.',
          fillStrategy: 'DIRECT_AUTOFILL',
          sourceKey: 'organisation.erasmusPlan',
          rules: { isMandatory: true },
          guidance: {
            school: 'KA120 akreditasyon belgenizdeki resmi hedefler sistem tarafından otomatik listelenir.',
            host: 'Ev sahibi kurum, okulun bu hedeflerinden hangisine (teknik beceri, dijitalleşme, dil, yeşil dönüşüm) hizmet edeceğini profilinde eşleştirmelidir.',
          },
        },
        {
          id: 'ep_activity_alignment_narrative',
          fieldCode: 'Contribution to Erasmus Plan objectives',
          label: 'How requested activities contribute to Erasmus Plan objectives',
          description: 'Talep edilen hareketliliklerin akreditasyon hedeflerine nasıl katkı sağlayacağının gerekçelendirilmesi.',
          fillStrategy: 'AI_ASSISTED',
          rules: { isMandatory: true, minChars: 150, maxChars: 2500 },
          guidance: {
            school: 'Her bir hareketlilik türünün (öğrenci stajı, personel işbaşı izleme) onaylı hedeflerle doğrudan bağını açıklayın.',
            host: 'Host kurumun teknik altyapısı, mentorluk uzmanlığı ve staj çalışma planının okulun bu hedeflerine nasıl doğrudan yanıt verdiği vurgulanmalıdır.',
            aiPromptTemplate: 'Okulun Erasmus Planı hedefleri: {erasmusPlanObjectives}. Talep edilen hareketlilik türleri ve katılımcı profili: {mobilityProfile}. Host kurumun sektör ve teknik kapasitesi: {hostCapacity}. Bu verileri kullanarak, hareketliliklerin kurumsal hedeflere katkısını açıklayan, Ulusal Ajans değerlendirme standartlarına tam uyumlu profesyonel bir gerekçe oluştur.',
          },
        },
      ],
    },
    {
      id: 'activities',
      pageNumber: 5,
      title: 'Activities',
      description: 'Hareketlilik bütçe talebi, faaliyet türleri, katılımcı sayıları ve ek giderler.',
      fields: [],
      subsections: [
        {
          id: 'list-of-activities',
          pageNumber: 5,
          title: 'List of activities (Table 1)',
          description: 'Faaliyet türleri, katılımcı sayıları ve öğrenme günleri (SEYAHAT GÜNLERİ HARİÇ).',
          fields: [
            {
              id: 'act_type',
              fieldCode: 'Activity type',
              label: 'Activity type',
              description: 'Resmi Erasmus+ faaliyet türü (Örn: Short-term learning mobility of VET learners, ErasmusPro, Job shadowing).',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'mobility.activityType',
              rules: { isMandatory: true },
              guidance: {
                school: 'Öğrenciler için kısa dönem (10-89 gün) veya ErasmusPro (90-365 gün); personel için Job Shadowing veya Course seçilir.',
                host: 'Host kurum staj süresinin (kısa dönem vs. uzun dönem ErasmusPro) şirket içi mentorluk kapasitesine uygunluğunu teyit etmelidir.',
              },
            },
            {
              id: 'act_num_participants',
              fieldCode: 'Number of participants',
              label: 'Number of participants',
              description: 'Faaliyete katılacak toplam öğrenci veya personel sayısı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'mobility.participantCount',
              rules: { isMandatory: true },
              guidance: {
                school: 'Mobility Gateway planlamanızdaki toplam katılımcı sayısı otomatik doldurulur.',
                host: 'Aynı dönemde ağırlanabilecek maksimum öğrenci kotası (maxLearnersPerTerm) ile örtüşmelidir.',
              },
            },
            {
              id: 'act_total_duration_days',
              fieldCode: 'Total duration (in days)',
              label: 'Total duration (in days)',
              description: 'Tüm katılımcıların toplam faaliyet gün sayısı. ⚠️ DİKKAT: Seyahat günleri buraya DAHİL EDİLMEZ!',
              fillStrategy: 'SYSTEM_GENERATED',
              sourceKey: 'mobility.totalActivityDays',
              rules: { isMandatory: true },
              guidance: {
                school: '⚠️ ÇOK ÖNEMLİ KURAL: Seyahat günleri bu tabloya YAZILMAZ! Sadece öğrenmenin/stajın gerçekleştiği net günler yazılır. Seyahat günleri bir sonraki (Additional Expenses) tablosuna yazılacaktır.',
                host: 'Staj programı ve işletme çalışma günleri bu net süre üzerinden planlanmalıdır.',
              },
            },
            {
              id: 'act_avg_duration_days',
              fieldCode: 'Average duration (in days)',
              label: 'Average duration (in days)',
              description: 'Katılımcı başına ortalama gün (Toplam gün / Katılımcı sayısı).',
              fillStrategy: 'SYSTEM_GENERATED',
              rules: { isMandatory: true },
              guidance: {
                school: 'Sistem tarafından otomatik hesaplanır.',
                host: 'Bir öğrencinin işletmede geçireceği ortalama net staj süresidir.',
              },
            },
            {
              id: 'act_fewer_opportunities',
              fieldCode: 'Number of participants with fewer opportunities',
              label: 'Number of participants with fewer opportunities',
              description: 'Sosyo-ekonomik, coğrafi veya fiziksel engeli/özel ihtiyacı olan dezavantajlı katılımcı sayısı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'mobility.fewerOpportunitiesCount',
              rules: { isMandatory: true },
              guidance: {
                school: 'Kurumunuzdaki kapsayıcılık (Inclusion) hedefi için kritik puanlama faktörüdür. Belgelendirilebilir olmalıdır.',
                host: 'Host kurumun erişilebilirlik, mentorluk veya refakatçi desteği gereksinimlerini önceden bilmesi gerekir.',
              },
            },
            {
              id: 'act_blended_mobility',
              fieldCode: 'Number of participants in blended mobility activities',
              label: 'Number of participants in blended mobility activities',
              description: 'Fiziksel hareketlilik öncesinde/sonrasında sanal (çevrimiçi) işbirliği yapan katılımcı sayısı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'mobility.blendedCount',
              rules: { isMandatory: true },
              guidance: {
                school: 'Fiziksel staj öncesi host kurumla online hazırlık/tanışma seansları yapılıyorsa bu sayı girilir.',
                host: 'Gitmeden önce öğrencilere online oryantasyon veya teknik giriş eğitimi veren hostlar avantaj sağlar.',
              },
            },
            {
              id: 'act_green_travel',
              fieldCode: 'Number of persons using sustainable means of transport (green travel)',
              label: 'Number of persons using sustainable means of transport (green travel)',
              description: 'Seyahatte tren, otobüs veya paylaşımlı araç kullanan kişi sayısı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'mobility.greenTravelCount',
              rules: { isMandatory: true },
              guidance: {
                school: 'Yeşil seyahat kullananlara kişi başı ek hibe ve 6 güne kadar ek seyahat günü verilir.',
                host: 'Host lokasyonuna tren/otobüsle erişim imkanları okul ile paylaşılmalıdır.',
              },
            },
          ],
        },
        {
          id: 'additional-expenses',
          pageNumber: 6,
          title: 'Additional expenses (Table 2)',
          description: 'Refakatçi kişiler, seyahat günleri ve hazırlık ziyaretleri.',
          fields: [
            {
              id: 'add_num_accompanying',
              fieldCode: 'Number of accompanying persons',
              label: 'Number of accompanying persons',
              description: 'Özellikle 18 yaş altı veya özel ihtiyaçlı öğrencilere eşlik edecek refakatçi öğretmen sayısı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'mobility.accompanyingPersonsCount',
              rules: { isMandatory: true },
              guidance: {
                school: 'VET öğrenci hareketliliklerinde genellikle her grup için refakatçi öğretmen atanır.',
                host: 'Host kurum refakatçi öğretmen için konaklama ve çalışma alanı düzenlemelerini dikkate almalıdır.',
              },
            },
            {
              id: 'add_total_duration_accompanying',
              fieldCode: 'Total duration (in days) for accompanying persons',
              label: 'Total duration (in days) for accompanying persons',
              description: 'Refakatçilerin toplam gün sayısı (öğrencilerle aynı veya rotasyonlu olabilir).',
              fillStrategy: 'DIRECT_AUTOFILL',
              rules: { isMandatory: true },
              guidance: {
                school: 'Refakatçinin görev yapacağı gün sayısı yazılır.',
                host: 'İşlem gerekmez.',
              },
            },
            {
              id: 'add_travel_days',
              fieldCode: 'Total number of additional travel days for participants and accompanying persons',
              label: 'Total number of additional travel days for participants and accompanying persons',
              description: 'Katılımcılar ve refakatçiler için toplam seyahat günleri.',
              fillStrategy: 'SYSTEM_GENERATED',
              sourceKey: 'mobility.totalTravelDays',
              rules: { isMandatory: true },
              guidance: {
                school: '⚠️ KRİTİK YERLEŞİM: Katılımcıların gidiş-dönüş seyahat günleri Table 1 yerine BURAYA girilir! Standart uçuş için genelde 2 gün (1 gidiş + 1 dönüş), Green travel için 4-6 güne kadar seyahat günü talep edilebilir.',
                host: 'Öğrencilerin varış ve ayrılış günlerinde lojistik/transfer karşılaması planlanmalıdır.',
              },
            },
            {
              id: 'add_preparatory_visits',
              fieldCode: 'Total number of persons taking part in preparatory visits',
              label: 'Total number of persons taking part in preparatory visits',
              description: 'Öğrenci gitmeden önce ev sahibi kurumu ve işletmeleri yerinde denetlemek üzere gidecek personel sayısı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              sourceKey: 'mobility.preparatoryVisitCount',
              rules: { isMandatory: true },
              guidance: {
                school: 'Özellikle yeni bir host kurumla ilk defa çalışılıyorsa veya uzun dönem ErasmusPro öncesinde hazırlık ziyareti yazılması büyük avantajdır.',
                host: 'Host kurum hazırlık ziyaretinde okulu ağırlamaya, işletmeleri gezdirmeye ve protokolleri imzalamaya hazır olmalıdır.',
              },
            },
          ],
        },
        {
          id: 'exceptional-costs-inclusion',
          pageNumber: 7,
          title: 'Exceptional costs and inclusion support for participants (Table 3)',
          description: 'Gerçek maliyet esaslı (actual costs) özel destek ve istisnai masraflar.',
          fields: [
            {
              id: 'exc_cost_type',
              fieldCode: 'Cost type',
              label: 'Cost type',
              description: 'Maliyet kategorisi (Inclusion support for participants veya Exceptional costs).',
              fillStrategy: 'DIRECT_AUTOFILL',
              rules: { isMandatory: true, allowedValues: ['Inclusion support for participants', 'Exceptional costs'] },
              guidance: {
                school: 'Fiziksel/sağlık engeli masrafları için "Inclusion support", pahalı vize veya uzak coğrafya seyahatleri için "Exceptional costs" seçilir.',
                host: 'Host lokasyonundaki özel destek (medikal ekipman kiralama, özel servis vb.) maliyetleri burada listelenir.',
              },
            },
            {
              id: 'exc_participants_count',
              fieldCode: 'Estimated number of participants requiring support',
              label: 'Estimated number of participants requiring support',
              description: 'Bu desteğe ihtiyaç duyan tahmini kişi sayısı.',
              fillStrategy: 'DIRECT_AUTOFILL',
              rules: { isMandatory: true },
              guidance: { school: 'İlgili katılımcı sayısı.', host: 'İşlem gerekmez.' },
            },
            {
              id: 'exc_justification',
              fieldCode: 'Description and justification',
              label: 'Description and justification',
              description: 'Harcamanın neden zorunlu olduğunu ve standart birim hibenin neden yetersiz kaldığını açıklayan resmi gerekçe.',
              fillStrategy: 'AI_ASSISTED',
              rules: { isMandatory: true, minChars: 100, maxChars: 1500 },
              guidance: {
                school: 'Ulusal Ajans harcamanın gerekçesini ve piyasa araştırmasını çok sıkı inceler. AI ile gerekçeyi resmi bütçe kurallarına uygun formatta üretin.',
                host: 'Host kurum yerel maliyet tekliflerini (fiyat teklifi/proforma) sağlayarak gerekçeyi kanıtlandırmalıdır.',
                aiPromptTemplate: 'Katılımcı ihtiyacı: {participantNeed}. Talep edilen maliyet kalemi: {costItem} ({estimatedCost} EUR). Destek türü: {costType}. Standart hibenin neden yetersiz olduğunu ve bu harcamanın Erasmus Kalite Standartları ve Kapsayıcılık (Inclusion) ilkeleri gereğince neden zorunlu olduğunu açıklayan resmi, ikna edici Ulusal Ajans gerekçesi oluştur.',
              },
            },
            {
              id: 'exc_estimated_cost',
              fieldCode: 'Estimated cost (EUR)',
              label: 'Estimated cost (EUR)',
              description: 'Öngörülen gerçek harcama tutarı (€).',
              fillStrategy: 'DIRECT_AUTOFILL',
              rules: { isMandatory: true },
              guidance: { school: 'Piyasa fiyatı / proforma fatura tutarı.', host: 'Yerel fiyat araştırması sağlar.' },
            },
            {
              id: 'exc_support_rate',
              fieldCode: 'Support rate (%)',
              label: 'Support rate (%)',
              description: 'Hibe destek oranı (Inclusion Support için %100, Exceptional Costs için %80 veya %100).',
              fillStrategy: 'SYSTEM_GENERATED',
              rules: { isMandatory: true },
              guidance: { school: 'Rehbere göre otomatik atanır.', host: 'İşlem gerekmez.' },
            },
            {
              id: 'exc_eligible_amount',
              fieldCode: 'Eligible amount (EUR)',
              label: 'Eligible amount (EUR)',
              description: 'Tahmini maliyet x Destek oranı formülüyle talep edilecek resmi hibe tutarı.',
              fillStrategy: 'SYSTEM_GENERATED',
              rules: { isMandatory: true },
              guidance: { school: 'Sistem tarafından otomatik hesaplanır.', host: 'İşlem gerekmez.' },
            },
          ],
        },
      ],
    },
    {
      id: 'annexes',
      pageNumber: 9,
      title: 'Annexes',
      description: 'Zorunlu ek belgeler ve Doğruluk Beyanı (Declaration on Honour).',
      fields: [
        {
          id: 'annex_declaration_on_honour',
          fieldCode: 'Declaration on Honour',
          label: 'Declaration on Honour (DoH)',
          description: 'Yasal temsilci (Okul Müdürü) tarafından imzalanmış ve kaşelenmiş resmi doğruluk beyanı PDF dosyası.',
          fillStrategy: 'MANUAL_UPLOAD',
          rules: { isMandatory: true },
          guidance: {
            school: 'Form sisteminden Declaration on Honour şablonunu indirin, Okul Müdürünüze imzalatıp kaşeletin ve PDF olarak sisteme yükleyin (Maksimum dosya boyutu: genellikle 10 MB).',
            host: 'Ev sahibi kurum bu belgeyi imzalamaz; bu belge yalnızca başvuran akredite kurumu bağlar.',
          },
        },
      ],
    },
    {
      id: 'application-conditions',
      pageNumber: 10,
      title: 'Application conditions & Checklists',
      description: 'AB temel değerleri, yaptırım kontrolleri, kişisel veri koruma ve başvuru öncesi kontrol listesi.',
      fields: [
        {
          id: 'cond_eu_values_adhere',
          fieldCode: 'EU Values adherence',
          label: 'I confirm that I, my organisation and the co-beneficiaries (where applicable) adhere to the EU values mentioned in Article 2 of the TEU and Article 21 of the EU Charter of Fundamental Rights',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: {
            school: 'İnsan onuru, özgürlük, demokrasi, eşitlik, hukukun üstünlüğü ve insan haklarına saygı ilkelerine bağlılık teyidi.',
            host: 'Host kurum da staj ve konaklama ortamında tüm ayrımcılık karşıtı AB standartlarına uymakla yükümlüdür.',
          },
        },
        {
          id: 'cond_eu_values_eval',
          fieldCode: 'EU Values evaluation criteria',
          label: 'I understand and agree that EU Values will be used as part of the criteria for evaluation of the activities implemented under this project',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: { school: 'Zorunlu onay kutusu.', host: 'Zorunlu taahhüt.' },
        },
        {
          id: 'cond_sanctions_check',
          fieldCode: 'EU sanctions compliance',
          label: 'I confirm that I/my organisation/project partner are NOT included on the list of persons/entities subject to EU sanctions',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: {
            school: 'Kurumun veya ortakların AB yaptırım listesinde olmadığını beyan eder.',
            host: 'Host kurumun AB yaptırımlarına tabi olmadığının doğrulanması için gereklidir.',
          },
        },
        {
          id: 'cond_russia_restriction',
          fieldCode: 'Russia restrictive measures',
          label: 'I/my organisation/project partner are not established in Russia nor are any of our proprietary rights directly or indirectly owned for more than 50% by a legal person, entity or body established in Russia',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: { school: 'Zorunlu yasal onay.', host: 'Zorunlu yasal onay.' },
        },
        {
          id: 'cond_audit_consent',
          fieldCode: 'Audit and monitoring consent',
          label: 'I/my organisation consent and acknowledge that information concerning me/my organisation, application and assessments can be made accessible to authorised persons of the EC, EACEA and National Agencies',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: {
            school: 'Ulusal Ajans ve AB denetçilerinin denetim ve inceleme yetkisinin kabulü.',
            host: 'Gerektiğinde yerinde denetim (on-the-spot check) yapılabileceğinin kabulü.',
          },
        },
        {
          id: 'chk_eligibility',
          fieldCode: 'Eligibility criteria fulfilled',
          label: 'It fulfills the eligibility criteria listed in the Programme Guide.',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: { school: 'Program Rehberi uygunluk kriterlerinin sağlandığı teyidi.', host: 'İşlem gerekmez.' },
        },
        {
          id: 'chk_fields_completed',
          fieldCode: 'All fields completed',
          label: 'All relevant fields in the application form have been completed.',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: { school: 'Tüm alanların eksiksiz doldurulduğunun teyidi.', host: 'İşlem gerekmez.' },
        },
        {
          id: 'chk_correct_na',
          fieldCode: 'Correct National Agency chosen',
          label: 'You have chosen the correct National Agency of the country in which your organisation is established.',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: { school: 'Türkiye Ulusal Ajansı (TR01) seçildiğinin kontrolü.', host: 'İşlem gerekmez.' },
        },
        {
          id: 'chk_accreditation_commitments',
          fieldCode: 'Erasmus Quality Standards commitments',
          label: 'It is prepared with full awareness of commitments made under the Erasmus accreditation, including your Erasmus Plan objectives and the Erasmus quality standards.',
          fillStrategy: 'DECLARATION',
          rules: { isMandatory: true },
          guidance: {
            school: 'Akreditasyon kalite standartlarına (katılımcı güvenliği, şeffaf seçim, öğrenme anlaşması vb.) tam uyum taahhüdü.',
            host: 'Erasmus Kalite Standartları gereği host kurumun öğrencilere kaliteli mentörlük ve iş sağlığı güvenliği (OHS) sağlaması beklenir.',
          },
        },
      ],
    },
    {
      id: 'submission-history',
      pageNumber: 12,
      title: 'Submission history',
      description: 'Formun Avrupa Komisyonu resmi portalına gönderim kayıtları.',
      fields: [
        {
          id: 'sub_version',
          fieldCode: 'Version',
          label: 'Submission Version',
          description: 'Başvuru versiyon numarası (Örn: v1, v2).',
          fillStrategy: 'SYSTEM_GENERATED',
          rules: { isMandatory: true },
          guidance: { school: 'Komisyon sunucusu tarafından atanır.', host: 'İşlem gerekmez.' },
        },
        {
          id: 'sub_time',
          fieldCode: 'Submission time (Brussels time)',
          label: 'Submission time (Brussels time)',
          description: 'Resmi Brüksel saati ile gönderim zaman damgası.',
          fillStrategy: 'SYSTEM_GENERATED',
          rules: { isMandatory: true },
          guidance: {
            school: 'Son başvuru saatinden (genellikle Brüksel saatiyle 12:00) önce gönderildiğinin yasal kanıtıdır.',
            host: 'İşlem gerekmez.',
          },
        },
        {
          id: 'sub_id',
          fieldCode: 'Submission ID',
          label: 'Submission ID',
          description: 'Avrupa Komisyonu resmi gönderim onay kodu (Submission Hash / ID).',
          fillStrategy: 'SYSTEM_GENERATED',
          rules: { isMandatory: true },
          guidance: {
            school: 'Başvurunun başarıyla sisteme ulaştığını kanıtlayan referans numarasıdır; arşivde saklanmalıdır.',
            host: 'İşlem gerekmez.',
          },
        },
      ],
    },
  ],
};
