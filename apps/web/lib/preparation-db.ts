import fs from 'fs/promises';
import path from 'path';
import {
  PrepModule,
  PrepAssignment,
  PrepCompletion,
  ParticipantProgressReport,
  CompleteStepDto,
  ParticipantBadge,
} from '@mobility-nexus/types';

const PREP_DATA_FILE = path.join(process.cwd(), 'data', 'preparation.json');

// 10 Official Preparatory Micro-learning Modules
export const INITIAL_PREP_MODULES: PrepModule[] = [
  {
    id: 'mod-01-culture',
    slug: 'cultural-adaptation-and-host-life',
    title_tr: 'Kültürel Uyum ve Ev Sahibi Ülke Yaşam Rehberi',
    title_en: 'Cultural Adaptation & Host Country Living Guide',
    description_tr:
      'Avrupa kültürel normları, yerel görgü kuralları, konaklama düzeni ve kültür şokunu aşma stratejileri.',
    description_en:
      'European cultural norms, local etiquette, accommodation rules, and strategies to overcome culture shock.',
    category: 'CULTURAL_ADAPTATION',
    estimatedDurationMinutes: 20,
    orderIndex: 1,
    requiredRole: 'ALL',
    badgeName: 'Kültür Elçisi',
    badgeIcon: 'Globe2',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'Kültür Şoku Aşamaları ve Uyum Süreci',
        titleEn: 'Stages of Culture Shock and Adaptation',
        contentTr:
          'Kültür şoku balayı, kriz, toparlanma ve uyum olmak üzere 4 temel evreden oluşur. İlk günlerdeki farklılıklar geçicidir; yerel alışkanlıklara açık ve sabırlı olmak süreci hızlandırır.',
        contentEn:
          'Culture shock consists of four main phases: honeymoon, crisis, recovery, and adaptation. Initial differences are temporary; staying open and patient accelerates settling in.',
        checklistTr: [
          'Ev sahibi ülkenin günlük yemek ve toplu taşıma saatlerini öğrenin.',
          'Konaklama yerindeki ev kurallarına (sessizlik saatleri, geri dönüşüm) uyun.',
          'Zorlandığınız anlarda refakatçi öğretmeninizle hemen iletişim kurun.',
        ],
        checklistEn: [
          'Learn the daily meal times and public transit schedules of the host country.',
          'Adhere strictly to accommodation house rules (quiet hours, waste sorting).',
          'Contact your accompanying teacher immediately if you experience difficulties.',
        ],
      },
      {
        titleTr: 'Sosyal İletişim ve Saygı Kuralları',
        titleEn: 'Social Communication and Etiquette',
        contentTr:
          'Kişisel alan sınırları ve selamlaşma biçimleri Avrupa ülkeleri arasında farklılık gösterir. Dakiklik (zamanında varış) kurumsal ve sosyal hayatta en yüksek önceliktir.',
        contentEn:
          'Personal space boundaries and greetings vary across Europe. Punctuality is universally regarded as a top priority in both institutional and social life.',
        checklistTr: [
          'Randevu ve toplantılara 5-10 dakika önce gidin.',
          'Hitap ederken resmiyet düzeyini gözlemleyin.',
        ],
        checklistEn: [
          'Arrive at meetings 5-10 minutes ahead of scheduled time.',
          'Observe the appropriate level of formality in communication.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q1-1',
        questionTr: 'Kültür şokunun ilk günlerindeki uyum zorluklarında en doğru yaklaşım nedir?',
        questionEn: 'What is the most effective approach when facing initial culture shock?',
        optionsTr: [
          'Odadan çıkmayıp sadece sosyal medyada vakit geçirmek',
          'Yerel farklılıkları doğal kabul edip refakatçi öğretmen ve mentordan destek almak',
          'Hemen ilk uçakla geri dönmeyi talep etmek',
          'Grup kurallarına uymadan bireysel hareket etmek',
        ],
        optionsEn: [
          'Stay in the room and only browse social media',
          'Accept cultural differences as natural and seek guidance from the accompanying teacher',
          'Demand an immediate return ticket home',
          'Act independently without following group regulations',
        ],
        correctOptionIndex: 1,
        explanationTr: 'Kültür şoku evrelerini sağlıklı aşmak için sabırlı olmak ve refakatçi öğretmen ile mentor desteği almak esastır.',
        explanationEn: 'Patience and open communication with your accompanying teacher and mentor are essential to overcoming culture shock.',
      },
      {
        id: 'q1-2',
        questionTr: 'Avrupa staj ve eğitim ortamlarında dakiklik (punctuality) neden kritiktir?',
        questionEn: 'Why is punctuality critical in European internship and training environments?',
        optionsTr: [
          'Önemsiz bir formalitedir, gecikmeler tolere edilir',
          'Kurumsal saygının, profesyonelliğin ve iş etiğinin temel göstergesidir',
          'Sadece son gün değerlendirilir',
          'Yalnızca fabrika müdürleri için geçerlidir',
        ],
        optionsEn: [
          'It is an unimportant formality, delays are freely tolerated',
          'It is the foundational indicator of institutional respect, professionalism, and work ethics',
          'It is only evaluated on the final day',
          'It only applies to factory directors',
        ],
        correctOptionIndex: 1,
        explanationTr: 'Avrupa iş kültüründe mesaiye ve eğitime vaktinde gelmek güvenilirliğin birinci şartıdır.',
        explanationEn: 'In European work culture, being on time is the primary prerequisite for reliability and trust.',
      },
    ],
  },
  {
    id: 'mod-02-language',
    slug: 'practical-language-prep-ols',
    title_tr: 'Mesleki ve Pratik Yabancı Dil Hazırlığı & OLS',
    title_en: 'VET Practical Language Skills & OLS Integration',
    description_tr:
      'AB Çevrimiçi Dil Desteği (OLS) kullanımı, atölye teknik terimleri ve acil durum diyalogları.',
    description_en:
      'EU Online Language Support (OLS) usage, workshop technical terminology, and emergency dialogue phrases.',
    category: 'LANGUAGE_PREP',
    estimatedDurationMinutes: 25,
    orderIndex: 2,
    requiredRole: 'ALL',
    badgeName: 'Dil Becerisi Rozeti',
    badgeIcon: 'Languages',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'AB Çevrimiçi Dil Desteği (OLS) Platformu',
        titleEn: 'EU Online Language Support (OLS) Platform',
        contentTr:
          'Erasmus+ katılımcıları seyahat öncesi ve sırasında AB OLS platformunda seviye tespit sınavını tamamlamalı ve hedef ülkenin dili veya İngilizce pratik modüllerini haftalık 2 saat takip etmelidir.',
        contentEn:
          'Erasmus+ participants must complete the initial OLS assessment and follow weekly 2-hour practice sessions in either English or the host country language.',
        checklistTr: [
          'OLS hesabınızı aktif hale getirin ve seviye tespit testini tamamlayın.',
          'Telefonunuza çevrimdışı çalışabilen sözlük uygulaması indirin.',
          'Meslek dalınıza ait 50 temel teknik terimi not defterinize kaydedin.',
        ],
        checklistEn: [
          'Activate your OLS account and complete the baseline assessment.',
          'Download an offline dictionary app on your mobile device.',
          'Note down 50 core technical terms relevant to your vocational field.',
        ],
      },
      {
        titleTr: 'Günlük Pratik ve Atölye İletişimi',
        titleEn: 'Daily Practice and Workshop Communication',
        contentTr:
          'Atölyede anlamadığınız talimatları onaylamadan önce "Could you please repeat that?" veya "Could you please demonstrate?" diyerek teyit etmek iş güvenliği açısından hayati önem taşır.',
        contentEn:
          'In the workshop, always confirm instructions before operating equipment by asking "Could you please repeat that?" or "Could you please demonstrate?".',
        checklistTr: [
          'Anlamadığınız güvenlik uyarılarını asla onaylamayın, tekrar ettirin.',
          'Hata yapmaktan korkmadan basit ve net cümlelerle iletişim kurun.',
        ],
        checklistEn: [
          'Never agree to a safety procedure you did not understand; always ask for repetition.',
          'Communicate in simple, clear sentences without fear of grammatical errors.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q2-1',
        questionTr: 'Atölyede usta öğreticinin makine çalıştırma talimatını tam anlamadığınızda ne yapmalısınız?',
        questionEn: 'What should you do if you do not fully understand a machinery instruction?',
        optionsTr: [
          'Anlamış gibi yapıp hemen makinenin düğmesine basmak',
          'Talimatı tekrar etmesini ve bir kez göstermesini rica etmek',
          'Talimatı görmezden gelip atölyeden ayrılmak',
          'Kendi bildiğiniz yöntemle deneme yapmak',
        ],
        optionsEn: [
          'Pretend to understand and press the machine button right away',
          'Request them politely to repeat the instruction and demonstrate it once',
          'Ignore the instructions and walk away',
          'Experiment with your own unverified method',
        ],
        correctOptionIndex: 1,
        explanationTr: 'İş sağlığı ve güvenliği için anlaşılmayan talimatlar mutlaka tekrar ettirilmeli ve netleştirilmelidir.',
        explanationEn: 'For occupational safety, unclear instructions must always be clarified and demonstrated.',
      },
    ],
  },
  {
    id: 'mod-03-ohs',
    slug: 'occupational-health-safety-workshop-standards',
    title_tr: 'İş Sağlığı ve Güvenliği (İSG) & Avrupa Atölye Standartları',
    title_en: 'Occupational Health & Safety (OHS) & European Workshop Standards',
    description_tr:
      'Kişisel koruyucu donanım (KKD), acil durum butonları, yangın tahliyesi ve CE işareti kuralları.',
    description_en:
      'Personal protective equipment (PPE), emergency stop buttons, fire evacuation, and CE safety standards.',
    category: 'OHS_SAFETY',
    estimatedDurationMinutes: 30,
    orderIndex: 3,
    requiredRole: 'ALL',
    badgeName: 'İSG ve Güvenlik Uzmanı',
    badgeIcon: 'ShieldAlert',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'Kişisel Koruyucu Donanım (KKD) Zorunluluğu',
        titleEn: 'Personal Protective Equipment (PPE) Requirements',
        contentTr:
          'Avrupa Birliği 89/391/EEC direktifine göre atölye veya işletme sahasına çelik burunlu iş ayakkabısı, koruyucu gözlük ve uygun iş kıyafeti olmadan girmek kesinlikle yasaktır.',
        contentEn:
          'Under EU Directive 89/391/EEC, entering workshop or industrial floor without steel-toe safety footwear, protective goggles, and approved work attire is strictly prohibited.',
        checklistTr: [
          'Çelik burunlu güvenlik ayakkabınızı yanınıza alın.',
          'Gözlük, kulaklık ve eldiven gibi KKD ekipmanlarını her çalışma öncesinde kontrol edin.',
          'Bol kıyafetler, sarkan kolyeler ve açık saçlar makinelere dolanma riski nedeniyle toplanmalıdır.',
        ],
        checklistEn: [
          'Pack certified steel-toe safety boots.',
          'Inspect PPE items such as goggles, ear defenders, and gloves before every shift.',
          'Tie back long hair and avoid loose clothing or jewelry to prevent entanglement.',
        ],
      },
      {
        titleTr: 'Acil Durum Butonları ve Tahliye Rotaları',
        titleEn: 'Emergency Stop Buttons and Evacuation Routes',
        contentTr:
          'İşletmeye girdiğiniz ilk gün acil durdurma (E-STOP) butonlarının yerini, ilk yardım dolabını ve acil toplanma alanını usta öğreticinizden öğrenin.',
        contentEn:
          'On your first day at the company, locate emergency stop (E-STOP) buttons, first aid stations, and designated assembly points.',
        checklistTr: [
          'Acil durum toplanma noktasını harita üzerinde işaretleyin.',
          'Kaza veya yaralanma anında derhal amirinize ve refakatçi öğretmene bildirin.',
        ],
        checklistEn: [
          'Mark the emergency evacuation assembly point on your map.',
          'Report any accident, near-miss, or injury immediately to your supervisor and teacher.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q3-1',
        questionTr: 'Atölyede döner aksamlı torna veya CNC makinesi başında çalışırken hangisi kesinlikle yasaktır?',
        questionEn: 'Which of the following is strictly prohibited when working near rotating machinery?',
        optionsTr: [
          'Koruyucu iş gözlüğü takmak',
          'Sarkan kolyeler takmak ve bol kollu sarkan giysiler giymek',
          'Çelik burunlu iş ayakkabısı giymek',
          'Usta öğretici nezaretinde çalışmak',
        ],
        optionsEn: [
          'Wearing certified protective eyewear',
          'Wearing dangling necklaces and loose-fitting, dangling garments',
          'Wearing steel-toe safety boots',
          'Working under the supervision of a master trainer',
        ],
        correctOptionIndex: 1,
        explanationTr: 'Döner aksamlara dolanma riski nedeniyle takı, sarkan kıyafet ve açık uzun saç atölyede kesinlikle yasaktır.',
        explanationEn: 'Loose clothing, jewelry, and loose hair present catastrophic entanglement risks and are strictly banned around rotating machinery.',
      },
    ],
  },
  {
    id: 'mod-04-travel',
    slug: 'travel-logistics-passport-protocols',
    title_tr: 'Seyahat Öncesi Lojistik, Pasaport ve Vize Protokolleri',
    title_en: 'Pre-Departure Logistics, Passport & Travel Protocols',
    description_tr:
      'Havalimanı prosedürleri, bagaj limitleri, resmi seyahat izinleri ve konaklama varış kuralları.',
    description_en:
      'Airport procedures, baggage allowances, official travel approvals, and accommodation check-in protocols.',
    category: 'TRAVEL_LOGISTICS',
    estimatedDurationMinutes: 20,
    orderIndex: 4,
    requiredRole: 'ALL',
    badgeName: 'Kusursuz Gezgin',
    badgeIcon: 'PlaneTakeoff',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'Havalimanı ve Pasaport Kontrolü',
        titleEn: 'Airport and Passport Control',
        contentTr:
          'Uluslararası uçuşlarda kalkıştan en az 3 saat önce havalimanında olunmalıdır. Pasaport, vize/yeşil pasaport, Erasmus+ kabul mektubu ve veli muvafakatnamesi el çantasında bulundurulmalıdır.',
        contentEn:
          'Arrive at the airport at least 3 hours prior to departure for international flights. Passports, visas, Erasmus+ acceptance letters, and parental consents must remain in hand luggage.',
        checklistTr: [
          'Pasaportunuzun geçerlilik süresinin en az 6 ay olduğunu doğrulayın.',
          'Erasmus+ Resmi Kabul Belgesinin renkli çıktısını el çantanıza koyun.',
          'Sıvı kısıtlamalarına (100ml altı şeffaf kilitli poşet) dikkat edin.',
        ],
        checklistEn: [
          'Verify your passport has at least 6 months validity beyond travel dates.',
          'Keep a printed color copy of your official Erasmus+ Invitation/Acceptance Letter.',
          'Observe carry-on liquid limits (under 100ml in transparent sealed pouch).',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q4-1',
        questionTr: 'Erasmus+ kabul belgesi ve pasaport seyahat esnasında nerede taşınmalıdır?',
        questionEn: 'Where should your Erasmus+ acceptance letter and passport be carried during travel?',
        optionsTr: [
          'Uçağın altına verilecek büyük valizin en dibinde',
          'Her an erişilebilir şekilde kişisel el çantasında veya sırt çantasında',
          'Evde refakatçi öğretmenin dosyasında bırakılarak',
          'Herhangi bir poşet içinde rastgele',
        ],
        optionsEn: [
          'At the bottom of the large check-in luggage',
          'Immediately accessible in personal hand baggage or backpack',
          'Left at home in the accompanying teacher file',
          'Randomly inside an unchecked shopping bag',
        ],
        correctOptionIndex: 1,
        explanationTr: 'Sınır kontrolünde ve havalimanında ibraz edilmesi gerekebileceği için resmi belgeler daima el çantasında olmalıdır.',
        explanationEn: 'Official identity and invitation documents must always be accessible in hand baggage for border and check-in verifications.',
      },
    ],
  },
  {
    id: 'mod-05-rights',
    slug: 'erasmus-rights-responsibilities-charter',
    title_tr: 'Erasmus+ Katılımcı Hakları, Sorumlulukları ve Kalite Taahhüdü',
    title_en: 'Erasmus+ Rights, Responsibilities & Quality Charter',
    description_tr:
      'Erasmus+ Kalite Taahhüdü (Quality Commitment), hibe kullanımı, devamsızlık kuralları ve katılımcı hakları.',
    description_en:
      'Erasmus+ Quality Commitment, grant utilization, attendance rules, and participant rights & duties.',
    category: 'ERASMUS_RIGHTS',
    estimatedDurationMinutes: 20,
    orderIndex: 5,
    requiredRole: 'ALL',
    badgeName: 'Erasmus+ Temsilcisi',
    badgeIcon: 'Award',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'Erasmus+ Kalite Taahhüdü Esasları',
        titleEn: 'Erasmus+ Quality Commitment Principles',
        contentTr:
          'Katılımcılar hareketlilik süresince eğitim programına %100 devam etmekle yükümlüdür. Mazeretsiz devamsızlık hibenin kısmen veya tamamen iade edilmesini gerektirebilir.',
        contentEn:
          'Participants are required to maintain 100% attendance during their mobility period. Unjustified absences may trigger partial or total grant recovery by National Agencies.',
        checklistTr: [
          'Günlük devam çizelgesini (attendance sheet) eksiksiz imzalayın.',
          'Ev sahibi işletmede kurumsal gizlilik kurallarına uyun.',
          'Program sonunda Avrupa Komisyonu Katılımcı Raporunu (EU Survey) 15 gün içinde doldurun.',
        ],
        checklistEn: [
          'Sign the daily mobility attendance sheet diligently.',
          'Respect host company confidentiality and intellectual property.',
          'Complete the mandatory European Commission Participant Survey within 15 days of return.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q5-1',
        questionTr: 'Erasmus+ hareketliliğinde haksız ve mazeretsiz devamsızlık yapmanın sonucu nedir?',
        questionEn: 'What is the consequence of unexcused absence during an Erasmus+ mobility?',
        optionsTr: [
          'Hiçbir yaptırımı yoktur',
          'Hibenin devamsızlık oranında veya tamamen geri talep edilmesi ve sertifikanın iptali',
          'Sadece teşekkür belgesi verilir',
          'Grup üyelerine ek harçlık verilir',
        ],
        optionsEn: [
          'There are no consequences whatsoever',
          'Proportional or full recovery of the Erasmus grant and cancellation of certification',
          'Only a courtesy letter is issued',
          'Remaining funds are redistributed to other peers',
        ],
        correctOptionIndex: 1,
        explanationTr: 'Erasmus+ kurallarına göre mazeretsiz devamsızlık durumunda Ulusal Ajans hibe kesintisi uygular.',
        explanationEn: 'Under Erasmus+ financial guidelines, unauthorized absenteeism leads to mandatory grant recovery and loss of certification.',
      },
    ],
  },
  {
    id: 'mod-06-green',
    slug: 'green-travel-sustainable-habits',
    title_tr: 'Yeşil Seyahat, Karbon Ayak İzi ve Sürdürülebilir Alışkanlıklar',
    title_en: 'Green Travel & Sustainable Habits',
    description_tr:
      'Çevre dostu ulaşım, atık ayrıştırma, enerji tasarrufu ve Erasmus+ Yeşil Seyahat ek hibesi.',
    description_en:
      'Eco-friendly transport, waste sorting, energy efficiency, and Erasmus+ Green Travel top-up rules.',
    category: 'GREEN_DIGITAL',
    estimatedDurationMinutes: 15,
    orderIndex: 6,
    requiredRole: 'ALL',
    badgeName: 'Yeşil Öncü',
    badgeIcon: 'Leaf',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'Yeşil Seyahat ve Döngüsel Alışkanlıklar',
        titleEn: 'Green Travel and Circular Habits',
        contentTr:
          'Tren, otobüs veya paylaşımlı araç ile seyahat eden katılımcılara Yeşil Seyahat ek hibe desteği ve ek seyahat günleri sağlanır. Yerel yaşamda tek kullanımlık plastiklerden kaçınmak AB önceliklerindendir.',
        contentEn:
          'Participants travelling by train, bus, or carpool receive Erasmus+ Green Travel top-up grants and additional travel days. Minimizing single-use plastics is a core EU priority.',
        checklistTr: [
          'Yeniden kullanılabilir su matarası ve bez çanta kullanın.',
          'Konaklama tesisinde ısıtma/klimayı odadan çıkarken kapatın.',
          'Yerel toplu taşıma veya bisiklet kullanımını tercih edin.',
        ],
        checklistEn: [
          'Carry a reusable water flask and cloth shopping bag.',
          'Turn off room radiators/air conditioning when leaving accommodations.',
          'Use public bicycles or local rail transit whenever feasible.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q6-1',
        questionTr: 'Erasmus+ programında Yeşil Seyahat (Green Travel) hibesinden yararlanmak için hangi ulaşım türü uygundur?',
        questionEn: 'Which mode of transport qualifies for the Erasmus+ Green Travel top-up grant?',
        optionsTr: [
          'Özel jet veya aktarmasız uçuş',
          'Tren, otobüs veya paylaşımlı araç (carpooling) kullanımı',
          'Yalnızca helikopter yolculuğu',
          'Kruvaziyer gemi turu',
        ],
        optionsEn: [
          'Charter jet or non-stop domestic flight',
          'Train, cross-border coach, or carpooling with verified peers',
          'Helicopter charter',
          'Cruise ship voyage',
        ],
        correctOptionIndex: 1,
        explanationTr: 'Yeşil Seyahat düşük karbon emisyonlu kara ve demiryolu ulaşımını teşvik eder.',
        explanationEn: 'Green Travel specifically incentivizes low-emission ground transport such as railways, coaches, or shared vehicle journeys.',
      },
    ],
  },
  {
    id: 'mod-07-digital',
    slug: 'digital-tools-workspace-communication',
    title_tr: 'Dijital Araçlar, OLS, Mobility Tool ve İletişim Güvenliği',
    title_en: 'Digital Tools, OLS & Mobility Nexus Workspace',
    description_tr:
      'Hareketlilik dijital platformları, güvenli Wi-Fi kullanımı, konum paylaşımı ve acil durum kanalları.',
    description_en:
      'Mobility management portals, safe public Wi-Fi habits, live location sharing, and emergency messaging channels.',
    category: 'GREEN_DIGITAL',
    estimatedDurationMinutes: 15,
    orderIndex: 7,
    requiredRole: 'ALL',
    badgeName: 'Dijital Yetkinlik',
    badgeIcon: 'Smartphone',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'İletişim Kanalları ve Veri Güvenliği',
        titleEn: 'Communication Channels and Data Security',
        contentTr:
          'Hareketlilik boyunca koordinatörünüzle iletişim için oluşturulan resmi WhatsApp/Telegram kanalında bildirimler açık tutulmalı, halka açık şifresiz Wi-Fi ağlarında bankacılık işlemleri yapılmamalıdır.',
        contentEn:
          'Keep notifications enabled on the official group messaging channel throughout the mobility. Avoid conducting banking transactions over unencrypted public Wi-Fi networks.',
        checklistTr: [
          'Acil durum iletişim hattını rehberinize kaydedin.',
          'Avrupa roaming/veri paketinizi gitmeden önce operatörünüzden açtırın.',
          'Önemli evraklarınızın taranmış dijital kopyalarını bulutta yedekleyin.',
        ],
        checklistEn: [
          'Save emergency coordinator contact numbers to your device.',
          'Verify international data roaming with your mobile carrier before departure.',
          'Back up scanned copies of vital identity files to secure cloud storage.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q7-1',
        questionTr: 'Yurtdışındayken halka açık şifresiz bir kafeterya Wi-Fi ağına bağlandığınızda neye dikkat etmelisiniz?',
        questionEn: 'What caution should you take when connected to an unencrypted public cafe Wi-Fi abroad?',
        optionsTr: [
          'Hassas bankacılık şifrelerini ve ödeme bilgilerini bu ağda girmemek',
          'Telefonu tamamen fabrika ayarlarına sıfırlamak',
          'SIM kartı çöpe atmak',
          'Hiçbir internet sitesine girmemek',
        ],
        optionsEn: [
          'Refrain from entering sensitive banking credentials or payment info on unsecured networks',
          'Factory reset your phone immediately',
          'Discard your SIM card',
          'Disconnect the power button permanently',
        ],
        correctOptionIndex: 0,
        explanationTr: 'Açık ağlar şifrelenmemiş veri trafiği riski taşır; hassas finansal işlemler güvenli hücresel veriyle yapılmalıdır.',
        explanationEn: 'Open networks carry packet interception risks; sensitive financial transactions should only use secure cellular connections.',
      },
    ],
  },
  {
    id: 'mod-08-europass',
    slug: 'europass-mobility-and-esco-outcomes',
    title_tr: 'Europass Hareketlilik Belgesi ve ESCO Mesleki Kazanım Takibi',
    title_en: 'Europass Mobility & ESCO Learning Outcomes',
    description_tr:
      'Öğrenme Sözleşmesi (Learning Agreement), ESCO beceri eşleştirmesi, staj defteri ve Europass sertifikası.',
    description_en:
      'Learning Agreement tracking, ESCO skill mapping, daily logbook, and official Europass Mobility credentialing.',
    category: 'ESCO_LEARNING',
    estimatedDurationMinutes: 25,
    orderIndex: 8,
    requiredRole: 'ALL',
    badgeName: 'Europass Ustası',
    badgeIcon: 'FileCheck',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'Europass Hareketlilik Belgesinin Değeri',
        titleEn: 'Value of Europass Mobility Document',
        contentTr:
          'Europass Hareketlilik Belgesi, Avrupa çapında geçerli resmi bir yetkinlik sertifikasıdır. Stajda edindiğiniz teknik becerilerin (ESCO sınıflandırmasına göre) işverenler tarafından tanınmasını sağlar.',
        contentEn:
          'Europass Mobility is an official pan-European competence credential. It ensures technical skills acquired during your internship are recognized by prospective employers across Europe.',
        checklistTr: [
          'Günlük staj günlüğünüzü (logbook) her gün düzenli olarak doldurun.',
          'Öğrenme Sözleşmesinde (Learning Agreement) yer alan hedefleri periyodik olarak gözden geçirin.',
          'Program sonunda ev sahibi mentorun değerlendirme formunu imzalamasını sağlayın.',
        ],
        checklistEn: [
          'Maintain your daily internship logbook diligently.',
          'Review the learning objectives stipulated in your Learning Agreement periodically.',
          'Ensure the host mentor evaluates and signs your final performance assessment.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q8-1',
        questionTr: 'Europass Hareketlilik Belgesinin katılımcı öğrenciye kariyerindeki en büyük faydası nedir?',
        questionEn: 'What is the primary career benefit of the Europass Mobility document for a student?',
        optionsTr: [
          'Yurtdışında kalıcı oturum izni yerine geçmesi',
          'Avrupa çapında edinilen mesleki becerilerin resmi olarak belgelenmesi ve CV değerinin artması',
          'Pasaport yerine kullanılabilmesi',
          'Sınavsız üniversiteye geçiş sağlaması',
        ],
        optionsEn: [
          'Serving as an automatic permanent residency permit',
          'Providing officially validated documentation of vocational skills across Europe to boost employability',
          'Functioning as an international passport substitute',
          'Guaranteeing unconditional university admission without exam',
        ],
        correctOptionIndex: 1,
        explanationTr: 'Europass hareketlilik belgesi Avrupa Komisyonu standardında resmi bir beceri ve deneyim kanıtıdır.',
        explanationEn: 'Europass Mobility is a standardized European credential validating skills and workplace competencies to employers worldwide.',
      },
    ],
  },
  {
    id: 'mod-09-crisis',
    slug: 'emergency-protocol-health-insurance-crisis',
    title_tr: 'Acil Durumlar, Seyahat Sağlık Sigortası ve Kriz Yönetimi',
    title_en: 'Emergency Protocol, Health Insurance & Crisis Management',
    description_tr:
      '112 acil çağrı, seyahat sağlık ve mesuliyet sigortası poliçeleri, kayıp pasaport prosedürü ve konsolosluk desteği.',
    description_en:
      '112 European emergency number, health & liability insurance policies, lost passport protocols, and consular assistance.',
    category: 'CRISIS_INSURANCE',
    estimatedDurationMinutes: 20,
    orderIndex: 9,
    requiredRole: 'ALL',
    badgeName: 'Kriz ve Güvenlik Kalkanı',
    badgeIcon: 'LifeBuoy',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'Avrupa Genel Acil Çağrı Numarası: 112',
        titleEn: 'European Emergency Number: 112',
        contentTr:
          'Tüm Avrupa Birliği ülkelerinde polis, ambulans ve itfaiye için tek numara 112\'dir. SIM kartsız dahi ücretsiz aranabilir. Seyahat sağlık sigortanızın poliçe numarasını telefonunuzda kayıtlı tutun.',
        contentEn:
          'In all EU member states, 112 is the single emergency number for police, ambulance, and fire rescue. It works free of charge even without a SIM card. Keep your insurance policy number saved.',
        checklistTr: [
          'Sigorta poliçenizin 7/24 asistan numarasını telefonunuza kaydedin.',
          'Bulunduğunuz ülkedeki TC Büyükelçiliği/Başkonsolosluğu acil nöbetçi telefonunu not edin.',
          'Kronik ilaç veya alerjiniz varsa refakatçi öğretmene ve mentora bildirin.',
        ],
        checklistEn: [
          'Save your travel insurance 24/7 global assistance hotline.',
          'Record the emergency consular duty line of your national embassy.',
          'Disclose any chronic health conditions or severe allergies to your accompanying teacher.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q9-1',
        questionTr: 'Avrupa Birliği ülkelerinin tamamında ambulans, polis ve itfaiyeye ulaşmak için kullanılan ortak acil numara hangisidir?',
        questionEn: 'Which single emergency number connects to ambulance, police, and fire rescue across all EU nations?',
        optionsTr: ['911', '112', '999', '155'],
        optionsEn: ['911', '112', '999', '155'],
        correctOptionIndex: 1,
        explanationTr: '112, tüm AB ülkelerinde geçerli tek ve ücretsiz acil durum numarasıdır.',
        explanationEn: '112 is the universal, toll-free European emergency number reachable across all EU member states.',
      },
    ],
  },
  {
    id: 'mod-10-mentorship',
    slug: 'mentorship-workplace-ethics-dissemination',
    title_tr: 'Mentorluk, İşyeri Davranış Kuralları ve Yaygınlaştırma',
    title_en: 'Mentorship, Workplace Ethics & Project Dissemination',
    description_tr:
      'İşyeri hiyerarşisi, profesyonel iletişim, geri bildirim alma kültürü ve hareketlilik sonrası okul yaygınlaştırması.',
    description_en:
      'Workplace hierarchy, professional communication, feedback culture, and post-mobility school dissemination.',
    category: 'MENTORSHIP_WORKPLACE',
    estimatedDurationMinutes: 20,
    orderIndex: 10,
    requiredRole: 'ALL',
    badgeName: 'Geleceğin Lideri',
    badgeIcon: 'Compass',
    isMandatory: true,
    isActive: true,
    contentBlocks: [
      {
        titleTr: 'İşyerinde Mentorla Profesyonel İlişki',
        titleEn: 'Professional Relationship with Workplace Mentor',
        contentTr:
          'Ev sahibi işletmedeki mentorunuz mesleki gelişiminizdeki en önemli rehberdir. Görevleri zamanında tamamlamak, geri bildirimlere açık olmak ve her gün en az bir yeni teknik soru sormak öğrenme verimini katlar.',
        contentEn:
          'Your workplace mentor is the primary guide for your vocational growth. Delivering tasks promptly, embracing constructive feedback, and actively asking questions maximizes learning efficiency.',
        checklistTr: [
          'Günün başında mentorunuza o günkü çalışma planını sorun.',
          'Dönüşte okulunuzdaki akranlarınıza sunmak üzere fotoğraf ve teknik notlar biriktirin.',
          'Yaygınlaştırma gününde okulunuzda atölye deneyiminizi sunmaya hazırlıklı olun.',
        ],
        checklistEn: [
          'Clarify daily work objectives with your mentor each morning.',
          'Collect photos and technical field notes to present to peers upon return.',
          'Prepare to deliver a dissemination workshop sharing your experience with your home institution.',
        ],
      },
    ],
    quizQuestions: [
      {
        id: 'q10-1',
        questionTr: 'Hareketlilik bittikten sonra katılımcının kendi okulunda yapması beklenen "yaygınlaştırma" faaliyeti ne anlama gelir?',
        questionEn: 'What does the expected post-mobility "dissemination" activity mean for participants?',
        optionsTr: [
          'Öğrendiği bilgi, beceri ve deneyimleri okulundaki arkadaşları ve öğretmenleriyle paylaşması',
          'Tüm fotoğrafları ve sertifikaları silmesi',
          'Bir daha Erasmus hakkında hiçbir şey konuşmaması',
          'Sadece evde dinlenmesi',
        ],
        optionsEn: [
          'Sharing acquired skills, insights, and experiences with school peers and teachers',
          'Deleting all project photos and certificates',
          'Never speaking of the mobility experience again',
          'Staying strictly at home without sharing',
        ],
        correctOptionIndex: 0,
        explanationTr: 'Erasmus+ projelerinde yaygınlaştırma, kazanımların kurum ve akranlar arasında çarpan etkisi oluşturmasını sağlar.',
        explanationEn: 'In Erasmus+ projects, dissemination ensures acquired skills create multiplier value across the home institution and peer community.',
      },
    ],
  },
];

// Initial Seed Participants for School Coordinators to track
export const INITIAL_ASSIGNMENTS: PrepAssignment[] = [
  {
    id: 'asg-01',
    participantId: 'part-01',
    participantName: 'Alperen Yılmaz',
    participantEmail: 'alperen.yilmaz@oibmtal.k12.tr',
    participantRole: 'STUDENT',
    schoolId: 'org-oibmtal',
    schoolName: 'OİB Mesleki ve Teknik Anadolu Lisesi',
    destinationCountry: 'Almanya',
    destinationCity: 'Stuttgart',
    mobilityProjectCode: '2026-1-TR01-KA121-VET-0001',
    deadlineDate: '2026-05-15',
    status: 'IN_PROGRESS',
    completionPercentage: 80,
    completedModulesCount: 8,
    totalModulesCount: 10,
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-03-24T14:30:00.000Z',
  },
  {
    id: 'asg-02',
    participantId: 'part-02',
    participantName: 'Zeynep Kaya',
    participantEmail: 'zeynep.kaya@oibmtal.k12.tr',
    participantRole: 'STUDENT',
    schoolId: 'org-oibmtal',
    schoolName: 'OİB Mesleki ve Teknik Anadolu Lisesi',
    destinationCountry: 'Almanya',
    destinationCity: 'Stuttgart',
    mobilityProjectCode: '2026-1-TR01-KA121-VET-0001',
    deadlineDate: '2026-05-15',
    status: 'COMPLETED',
    completionPercentage: 100,
    completedModulesCount: 10,
    totalModulesCount: 10,
    certificateIssuedAt: '2026-03-22T16:00:00.000Z',
    certificateNumber: 'EMN-PREP-2026-0042',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-03-22T16:00:00.000Z',
  },
  {
    id: 'asg-03',
    participantId: 'part-03',
    participantName: 'Burak Şahin',
    participantEmail: 'burak.sahin@oibmtal.k12.tr',
    participantRole: 'STUDENT',
    schoolId: 'org-oibmtal',
    schoolName: 'OİB Mesleki ve Teknik Anadolu Lisesi',
    destinationCountry: 'İspanya',
    destinationCity: 'Valencia',
    mobilityProjectCode: '2026-1-TR01-KA121-VET-0001',
    deadlineDate: '2026-05-20',
    status: 'IN_PROGRESS',
    completionPercentage: 40,
    completedModulesCount: 4,
    totalModulesCount: 10,
    createdAt: '2026-02-15T11:00:00.000Z',
    updatedAt: '2026-03-20T09:15:00.000Z',
  },
  {
    id: 'asg-04',
    participantId: 'part-04',
    participantName: 'Ahmet Kemal Yıldız (Refakatçi Öğretmen)',
    participantEmail: 'ahmet.yildiz@oibmtal.k12.tr',
    participantRole: 'TEACHER',
    schoolId: 'org-oibmtal',
    schoolName: 'OİB Mesleki ve Teknik Anadolu Lisesi',
    destinationCountry: 'Almanya',
    destinationCity: 'Stuttgart',
    mobilityProjectCode: '2026-1-TR01-KA121-VET-0001',
    deadlineDate: '2026-05-15',
    status: 'COMPLETED',
    completionPercentage: 100,
    completedModulesCount: 10,
    totalModulesCount: 10,
    certificateIssuedAt: '2026-03-21T11:20:00.000Z',
    certificateNumber: 'EMN-PREP-2026-0041',
    createdAt: '2026-02-10T10:00:00.000Z',
    updatedAt: '2026-03-21T11:20:00.000Z',
  },
  {
    id: 'asg-05',
    participantId: 'part-05',
    participantName: 'Elif Ceren Arslan',
    participantEmail: 'elif.ceren@nilufermtal.k12.tr',
    participantRole: 'STUDENT',
    schoolId: 'org-nilufer',
    schoolName: 'Nilüfer Mesleki ve Teknik Anadolu Lisesi',
    destinationCountry: 'İtalya',
    destinationCity: 'Bologna',
    mobilityProjectCode: '2026-1-TR01-KA122-VET-0089',
    deadlineDate: '2026-06-01',
    status: 'NOT_STARTED',
    completionPercentage: 0,
    completedModulesCount: 0,
    totalModulesCount: 10,
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
  },
];

// Initial Seed Completions
export const INITIAL_COMPLETIONS: PrepCompletion[] = [
  // Alperen Yılmaz (8 modules completed)
  {
    id: 'cmp-01',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-01-culture',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-10T11:00:00.000Z',
  },
  {
    id: 'cmp-02',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-02-language',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-12T14:30:00.000Z',
  },
  {
    id: 'cmp-03',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-03-ohs',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-15T09:45:00.000Z',
  },
  {
    id: 'cmp-04',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-04-travel',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-18T16:20:00.000Z',
  },
  {
    id: 'cmp-05',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-05-rights',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-19T10:10:00.000Z',
  },
  {
    id: 'cmp-06',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-06-green',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-21T13:40:00.000Z',
  },
  {
    id: 'cmp-07',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-07-digital',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-22T15:00:00.000Z',
  },
  {
    id: 'cmp-08',
    assignmentId: 'asg-01',
    participantId: 'part-01',
    moduleId: 'mod-08-europass',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-24T14:30:00.000Z',
  },

  // Zeynep Kaya (All 10 modules completed)
  ...INITIAL_PREP_MODULES.map((m, idx) => ({
    id: `cmp-zk-${idx + 1}`,
    assignmentId: 'asg-02',
    participantId: 'part-02',
    moduleId: m.id,
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-22T15:30:00.000Z',
  })),

  // Burak Şahin (4 modules completed)
  {
    id: 'cmp-bs-01',
    assignmentId: 'asg-03',
    participantId: 'part-03',
    moduleId: 'mod-01-culture',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-12T10:00:00.000Z',
  },
  {
    id: 'cmp-bs-02',
    assignmentId: 'asg-03',
    participantId: 'part-03',
    moduleId: 'mod-02-language',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-14T11:30:00.000Z',
  },
  {
    id: 'cmp-bs-03',
    assignmentId: 'asg-03',
    participantId: 'part-03',
    moduleId: 'mod-03-ohs',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-18T14:15:00.000Z',
  },
  {
    id: 'cmp-bs-04',
    assignmentId: 'asg-03',
    participantId: 'part-03',
    moduleId: 'mod-04-travel',
    isCompleted: true,
    quizScore: 100,
    completedAt: '2026-03-20T09:15:00.000Z',
  },
];

interface PreparationDataStore {
  modules: PrepModule[];
  assignments: PrepAssignment[];
  completions: PrepCompletion[];
}

let inMemoryData: PreparationDataStore = {
  modules: INITIAL_PREP_MODULES,
  assignments: INITIAL_ASSIGNMENTS,
  completions: INITIAL_COMPLETIONS,
};

let isInitialized = false;

async function ensureDataLoaded(): Promise<PreparationDataStore> {
  if (isInitialized) return inMemoryData;

  try {
    const raw = await fs.readFile(PREP_DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.modules && parsed.assignments && parsed.completions) {
      inMemoryData = parsed;
    }
  } catch {
    // If file doesn't exist, create it with seed
    try {
      await fs.mkdir(path.dirname(PREP_DATA_FILE), { recursive: true });
      await fs.writeFile(PREP_DATA_FILE, JSON.stringify(inMemoryData, null, 2), 'utf-8');
    } catch (writeErr) {
      console.warn('Could not write preparation.json, using in-memory store:', writeErr);
    }
  }

  isInitialized = true;
  return inMemoryData;
}

async function persistData() {
  try {
    await fs.mkdir(path.dirname(PREP_DATA_FILE), { recursive: true });
    await fs.writeFile(PREP_DATA_FILE, JSON.stringify(inMemoryData, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Persist preparation.json failed, memory intact:', err);
  }
}

export class PreparationDb {
  static async getAllModules(): Promise<PrepModule[]> {
    const store = await ensureDataLoaded();
    return [...store.modules].sort((a, b) => a.orderIndex - b.orderIndex);
  }

  static async getModuleById(id: string): Promise<PrepModule | null> {
    const store = await ensureDataLoaded();
    return store.modules.find((m) => m.id === id || m.slug === id) || null;
  }

  static async getAllAssignments(
    schoolId?: string,
    search?: string,
    status?: string
  ): Promise<PrepAssignment[]> {
    const store = await ensureDataLoaded();
    let result = [...store.assignments];

    if (schoolId && schoolId !== 'ALL') {
      result = result.filter((a) => a.schoolId === schoolId);
    }

    if (status && status !== 'ALL') {
      result = result.filter((a) => a.status === status);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.participantName.toLowerCase().includes(q) ||
          a.participantEmail.toLowerCase().includes(q) ||
          a.schoolName.toLowerCase().includes(q) ||
          a.destinationCountry.toLowerCase().includes(q) ||
          a.mobilityProjectCode.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => b.completionPercentage - a.completionPercentage);
  }

  static async getParticipantAssignment(participantId: string): Promise<PrepAssignment | null> {
    const store = await ensureDataLoaded();
    return store.assignments.find((a) => a.participantId === participantId || a.id === participantId) || null;
  }

  static async getParticipantProgress(participantId: string): Promise<ParticipantProgressReport | null> {
    const store = await ensureDataLoaded();
    const assignment = store.assignments.find(
      (a) => a.participantId === participantId || a.id === participantId
    );
    if (!assignment) return null;

    const completions = store.completions.filter(
      (c) => c.participantId === assignment.participantId && c.isCompleted
    );
    const completedModuleIds = completions.map((c) => c.moduleId);

    const mandatoryModules = store.modules.filter((m) => m.isMandatory);
    const missingMandatoryModuleIds = mandatoryModules
      .filter((m) => !completedModuleIds.includes(m.id))
      .map((m) => m.id);

    const isReadyForMobility = missingMandatoryModuleIds.length === 0;

    // Badges calculation
    const badges: ParticipantBadge[] = [];
    completions.forEach((cmp) => {
      const mod = store.modules.find((m) => m.id === cmp.moduleId);
      if (mod) {
        badges.push({
          badgeName: mod.badgeName,
          badgeIcon: mod.badgeIcon,
          earnedAt: cmp.completedAt,
          titleTr: mod.titleTr || mod.title_tr || '',
          titleEn: mod.titleEn || mod.title_en || '',
        });
      }
    });

    const averageQuizScore =
      completions.length > 0
        ? Math.round(
            completions.reduce((acc, curr) => acc + (curr.quizScore || 100), 0) /
              completions.length
          )
        : 0;

    return {
      assignment,
      completions,
      completedModuleIds,
      missingMandatoryModuleIds,
      isReadyForMobility,
      badges,
      averageQuizScore,
    };
  }

  static async completeStep(dto: CompleteStepDto): Promise<{
    success: boolean;
    completion: PrepCompletion;
    assignment: PrepAssignment;
    isNewlyCompleted: boolean;
  }> {
    const store = await ensureDataLoaded();

    let assignment = store.assignments.find(
      (a) => a.participantId === dto.participantId || a.id === dto.assignmentId
    );

    if (!assignment) {
      throw new Error(`Participant assignment not found for ID: ${dto.participantId || dto.assignmentId}`);
    }

    const moduleObj = store.modules.find((m) => m.id === dto.moduleId);
    if (!moduleObj) {
      throw new Error(`Prep module not found for ID: ${dto.moduleId}`);
    }

    // Check if completion already exists
    let existingIndex = store.completions.findIndex(
      (c) => c.assignmentId === assignment!.id && c.moduleId === dto.moduleId
    );

    const now = new Date().toISOString();
    let completion: PrepCompletion;

    if (existingIndex >= 0) {
      store.completions[existingIndex] = {
        ...store.completions[existingIndex],
        isCompleted: true,
        quizScore: dto.quizScore,
        timeSpentMinutes: dto.timeSpentMinutes || 15,
        completedAt: now,
      };
      completion = store.completions[existingIndex];
    } else {
      completion = {
        id: `cmp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        assignmentId: assignment.id,
        participantId: assignment.participantId,
        moduleId: dto.moduleId,
        isCompleted: true,
        quizScore: dto.quizScore,
        completedAt: now,
        timeSpentMinutes: dto.timeSpentMinutes || 15,
        notes: dto.notes,
      };
      store.completions.push(completion);
    }

    // Recalculate assignment progress
    const userCompletions = store.completions.filter(
      (c) => c.participantId === assignment!.participantId && c.isCompleted
    );
    const completedCount = userCompletions.length;
    const totalCount = store.modules.length;
    const percentage = Math.min(100, Math.round((completedCount / totalCount) * 100));

    let isNewlyCompleted = false;
    let newStatus = assignment.status;

    if (percentage === 100) {
      if (assignment.status !== 'COMPLETED') {
        isNewlyCompleted = true;
        assignment.certificateIssuedAt = now;
        assignment.certificateNumber = `EMN-PREP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      }
      newStatus = 'COMPLETED';
    } else if (completedCount > 0) {
      newStatus = 'IN_PROGRESS';
    }

    assignment.completedModulesCount = completedCount;
    assignment.totalModulesCount = totalCount;
    assignment.completionPercentage = percentage;
    assignment.status = newStatus;
    assignment.updatedAt = now;

    await persistData();

    return {
      success: true,
      completion,
      assignment,
      isNewlyCompleted,
    };
  }
}
