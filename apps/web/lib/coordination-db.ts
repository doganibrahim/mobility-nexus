import fs from 'fs/promises';
import path from 'path';
import {
  SchoolCoordinationRecord,
  SchoolCoordinationStatusType,
  NeedAssessmentScores,
  CoordinationActivityLog,
  AddCoordinationNoteDto,
  SchoolGuidanceRecommendation,
} from '@mobility-nexus/types';
import { InquiriesDb } from './inquiries-db';
import { OrganisationsDb } from './organisations-db';

const STATUS_FILE_PATH = path.join(process.cwd(), 'data', 'coordination_status.json');
const ACTIVITIES_FILE_PATH = path.join(process.cwd(), 'data', 'coordination_activities.json');

// Initial seed records
const INITIAL_COORDINATION_RECORDS: SchoolCoordinationRecord[] = [
  {
    id: 'scs-01',
    schoolId: 'org-oibmtal',
    schoolName: 'OİB Mesleki ve Teknik Anadolu Lisesi',
    schoolOid: 'E10123456',
    schoolCity: 'Bursa',
    contactName: 'Metin Demir',
    contactEmail: 'm.demir@oibmtal.k12.tr',
    contactPhone: '+90 535 777 8899',
    accreditationStatus: 'YES',
    status: 'MEETING_SCHEDULED',
    assignedCoordinatorName: 'CAPPINNO Destek Ekibi',
    lastContactedAt: '2026-03-20T14:30:00.000Z',
    inquiriesCount: 2,
    needAssessment: {
      s1AccreditationAlignment: 90,
      s2HostMatchingGap: 85,
      s3GrantBudgetCapacity: 80,
      s4ParticipantPrepLevel: 75,
      s5LearningAgreementQuality: 85,
      s6RiskAndInclusion: 90,
      s7ConsortiumSynergy: 70,
      s8GreenAndDigitalShift: 85,
      overallReadinessScore: 83,
      recommendedPath: 'KA121_BUDGET_REQUEST',
      evaluationSummary:
        'Akredite kurum, yüksek hibe potansiyeline sahip. Otomotiv ve batarya teknolojilerinde Almanya ev sahipliği önerilmektedir.',
    },
    recentActivities: [
      {
        id: 'cal-01',
        schoolId: 'org-oibmtal',
        coordinatorId: 'coord-cappinno',
        coordinatorName: 'CAPPINNO Destek Ekibi',
        activityType: 'PHONE_CALL',
        title: 'İlk Tanışma ve İhtiyaç Görüşmesi',
        content:
          'Okul koordinatörü Metin Bey ile görüşüldü. 15 öğrenci ve 3 öğretmen için Almanya ve İspanya staj talebi mevcut. 2026 KA121 çağrısına dahil edilecek.',
        previousStatus: 'NEW_REGISTRATION',
        newStatus: 'MEETING_SCHEDULED',
        createdAt: '2026-03-20T14:30:00.000Z',
      },
    ],
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-20T14:30:00.000Z',
  },
  {
    id: 'scs-02',
    schoolId: 'org-haydarpasa',
    schoolName: 'Haydarpaşa Mesleki ve Teknik Anadolu Lisesi',
    schoolOid: 'E10294821',
    schoolCity: 'İstanbul',
    contactName: 'Ayşe Kaya',
    contactEmail: 'a.kaya@haydarpasa.k12.tr',
    contactPhone: '+90 532 444 3322',
    accreditationStatus: 'NO',
    status: 'IN_REVIEW',
    assignedCoordinatorName: 'CAPPINNO Destek Ekibi',
    lastContactedAt: '2026-03-18T11:00:00.000Z',
    inquiriesCount: 1,
    needAssessment: {
      s1AccreditationAlignment: 35,
      s2HostMatchingGap: 75,
      s3GrantBudgetCapacity: 50,
      s4ParticipantPrepLevel: 60,
      s5LearningAgreementQuality: 65,
      s6RiskAndInclusion: 70,
      s7ConsortiumSynergy: 85,
      s8GreenAndDigitalShift: 60,
      overallReadinessScore: 62,
      recommendedPath: 'KA122_SHORT_TERM',
      evaluationSummary:
        'İlk kez münferit başvuru yapacak okul. Konsorsiyum desteği ve ihtiyaç analizi güçlendirilmelidir.',
    },
    recentActivities: [
      {
        id: 'cal-02',
        schoolId: 'org-haydarpasa',
        coordinatorId: 'coord-cappinno',
        coordinatorName: 'CAPPINNO Destek Ekibi',
        activityType: 'ONLINE_MEETING',
        title: 'KA122 Başvuru Destek Toplantısı',
        content:
          'Okulun akreditasyonu olmadığı için kısa dönemli hareketlilik başvuru taslağı üzerinde çalışılıyor. Çevrim içi randevu planlandı.',
        previousStatus: 'NEW_REGISTRATION',
        newStatus: 'IN_REVIEW',
        createdAt: '2026-03-18T11:00:00.000Z',
      },
    ],
    createdAt: '2026-03-05T10:00:00.000Z',
    updatedAt: '2026-03-18T11:00:00.000Z',
  },
  {
    id: 'scs-03',
    schoolId: 'org-etimesgut',
    schoolName: 'Cezeri Yeşil Teknoloji MTAL',
    schoolOid: 'E10384729',
    schoolCity: 'Ankara',
    contactName: 'Bülent Yılmaz',
    contactEmail: 'b.yilmaz@cezeri.k12.tr',
    contactPhone: '+90 542 111 2233',
    accreditationStatus: 'YES',
    status: 'CONSORTIUM_MATCHED',
    assignedCoordinatorName: 'CAPPINNO Destek Ekibi',
    lastContactedAt: '2026-03-22T16:00:00.000Z',
    inquiriesCount: 3,
    needAssessment: {
      s1AccreditationAlignment: 95,
      s2HostMatchingGap: 90,
      s3GrantBudgetCapacity: 85,
      s4ParticipantPrepLevel: 80,
      s5LearningAgreementQuality: 90,
      s6RiskAndInclusion: 85,
      s7ConsortiumSynergy: 90,
      s8GreenAndDigitalShift: 95,
      overallReadinessScore: 89,
      recommendedPath: 'CONSORTIUM_PARTNER',
      evaluationSummary:
        'Yeşil beceriler ve yenilenebilir enerjide öncü akredite okul. Doğrudan uluslararası konsorsiyum ortağı yapıldı.',
    },
    recentActivities: [
      {
        id: 'cal-03',
        schoolId: 'org-etimesgut',
        coordinatorId: 'coord-cappinno',
        coordinatorName: 'CAPPINNO Destek Ekibi',
        activityType: 'CONSORTIUM_ASSIGNMENT',
        title: 'Yenilenebilir Enerji Konsorsiyum Eşleşmesi',
        content:
          'Okul, Finlandiya ve Almanya ortaklı Yeşil Şebeke Konsorsiyumu havuzuna başarıyla bağlandı.',
        previousStatus: 'MEETING_SCHEDULED',
        newStatus: 'CONSORTIUM_MATCHED',
        createdAt: '2026-03-22T16:00:00.000Z',
      },
    ],
    createdAt: '2026-02-15T11:00:00.000Z',
    updatedAt: '2026-03-22T16:00:00.000Z',
  },
  {
    id: 'scs-04',
    schoolId: 'org-bornova',
    schoolName: 'Bornova Mazhar Zorlu MTAL',
    schoolOid: 'E10492837',
    schoolCity: 'İzmir',
    contactName: 'Selin Aktaş',
    contactEmail: 's.aktas@mazharzorlu.k12.tr',
    contactPhone: '+90 533 999 8811',
    accreditationStatus: 'NO',
    status: 'NEW_REGISTRATION',
    assignedCoordinatorName: 'CAPPINNO Destek Ekibi',
    lastContactedAt: null,
    inquiriesCount: 1,
    needAssessment: {
      s1AccreditationAlignment: 40,
      s2HostMatchingGap: 80,
      s3GrantBudgetCapacity: 45,
      s4ParticipantPrepLevel: 50,
      s5LearningAgreementQuality: 55,
      s6RiskAndInclusion: 65,
      s7ConsortiumSynergy: 80,
      s8GreenAndDigitalShift: 55,
      overallReadinessScore: 58,
      recommendedPath: 'ACCREDITATION_PREP',
      evaluationSummary:
        'Endüstriyel otomasyon alanında güçlü ancak akreditasyon hazırlığı ve ev sahibi ağı desteği gerekmektedir.',
    },
    recentActivities: [],
    createdAt: '2026-03-24T08:30:00.000Z',
    updatedAt: '2026-03-24T08:30:00.000Z',
  },
];

let memoryRecords: SchoolCoordinationRecord[] = [...INITIAL_COORDINATION_RECORDS];
let memoryActivities: CoordinationActivityLog[] = INITIAL_COORDINATION_RECORDS.flatMap(
  (r) => r.recentActivities
);

async function readRecordsFromFile(): Promise<SchoolCoordinationRecord[]> {
  try {
    const content = await fs.readFile(STATUS_FILE_PATH, 'utf-8');
    const data = JSON.parse(content);
    if (Array.isArray(data) && data.length > 0) {
      memoryRecords = data;
    }
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      await writeRecordsToFile(memoryRecords);
    }
  }
  return memoryRecords;
}

async function writeRecordsToFile(data: SchoolCoordinationRecord[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(STATUS_FILE_PATH), { recursive: true });
    await fs.writeFile(STATUS_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing coordination records to file:', err);
  }
}

export const CoordinationDb = {
  /**
   * Retrieves all school coordination records with filter & search
   */
  async getAllSchools(statusFilter?: string, search?: string): Promise<SchoolCoordinationRecord[]> {
    await readRecordsFromFile();
    let records = [...memoryRecords];

    if (statusFilter && statusFilter !== 'ALL') {
      records = records.filter((r) => r.status === statusFilter);
    }

    if (search) {
      const q = search.toLowerCase();
      records = records.filter(
        (r) =>
          r.schoolName.toLowerCase().includes(q) ||
          (r.schoolCity && r.schoolCity.toLowerCase().includes(q)) ||
          (r.schoolOid && r.schoolOid.toLowerCase().includes(q)) ||
          (r.contactName && r.contactName.toLowerCase().includes(q))
      );
    }

    return records;
  },

  /**
   * Retrieves a single school profile with S1-S8 radar need assessment
   */
  async getSchoolNeedProfile(schoolId: string): Promise<SchoolCoordinationRecord | null> {
    await readRecordsFromFile();
    const record = memoryRecords.find(
      (r) => r.schoolId === schoolId || r.id === schoolId || r.schoolOid === schoolId
    );
    if (record) return record;

    // Fallback: check if organization exists and dynamically create a coordination profile
    try {
      const org = await OrganisationsDb.getById(schoolId);
      if (org) {
        const isAcc = org.accreditationStatus === 'YES';
        const dynamicRecord: SchoolCoordinationRecord = {
          id: `scs-${org.id}`,
          schoolId: org.id,
          schoolName: org.name,
          schoolOid: org.oid || 'E10000000',
          schoolCity: org.city || 'Belirtilmemiş',
          contactName: 'Okul Koordinatörü',
          contactEmail: 'iletisim@okul.meb.k12.tr',
          contactPhone: null,
          accreditationStatus: org.accreditationStatus,
          status: 'NEW_REGISTRATION',
          assignedCoordinatorName: 'CAPPINNO Destek Ekibi',
          lastContactedAt: null,
          inquiriesCount: 1,
          needAssessment: {
            s1AccreditationAlignment: isAcc ? 90 : 40,
            s2HostMatchingGap: 75,
            s3GrantBudgetCapacity: isAcc ? 80 : 50,
            s4ParticipantPrepLevel: 65,
            s5LearningAgreementQuality: 70,
            s6RiskAndInclusion: 75,
            s7ConsortiumSynergy: 80,
            s8GreenAndDigitalShift: 65,
            overallReadinessScore: isAcc ? 82 : 60,
            recommendedPath: isAcc ? 'KA121_BUDGET_REQUEST' : 'KA122_SHORT_TERM',
            evaluationSummary: isAcc
              ? 'Akredite kurum, 2026 bütçe tahsis çağrısı için konsorsiyum havuzuna dahil edilebilir.'
              : 'İlk kez başvuran okul, kısa dönemli hareketlilik veya konsorsiyum üyeliği önerilmektedir.',
          },
          recentActivities: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        memoryRecords.push(dynamicRecord);
        await writeRecordsToFile(memoryRecords);
        return dynamicRecord;
      }
    } catch (e) {
      console.warn('Error fetching org fallback:', e);
    }

    return null;
  },

  /**
   * Adds a coordinator note and updates coordination status
   */
  async addCoordinationNote(dto: AddCoordinationNoteDto): Promise<CoordinationActivityLog> {
    await readRecordsFromFile();
    const index = memoryRecords.findIndex(
      (r) => r.schoolId === dto.schoolId || r.id === dto.schoolId
    );

    const now = new Date().toISOString();
    const activityId = `cal-${Date.now().toString(36)}`;
    const previousStatus = index !== -1 ? memoryRecords[index].status : undefined;

    const newActivity: CoordinationActivityLog = {
      id: activityId,
      schoolId: dto.schoolId,
      inquiryId: dto.inquiryId || null,
      coordinatorId: 'coord-cappinno',
      coordinatorName: 'CAPPINNO Destek Ekibi',
      activityType: dto.activityType || 'NOTE',
      title: dto.title,
      content: dto.content,
      previousStatus: previousStatus || null,
      newStatus: dto.newStatus || previousStatus || null,
      followUpDate: dto.followUpDate || null,
      createdAt: now,
    };

    if (index !== -1) {
      const record = memoryRecords[index];
      record.recentActivities = [newActivity, ...(record.recentActivities || [])];
      record.lastContactedAt = now;
      if (dto.newStatus) {
        record.status = dto.newStatus;
      }
      record.updatedAt = now;
      memoryRecords[index] = record;
      await writeRecordsToFile(memoryRecords);
    }

    return newActivity;
  },

  /**
   * Provides tailored Erasmus+ mobility guidance for the school (100% Free First Year)
   */
  async getGuidanceRecommendation(schoolId: string): Promise<SchoolGuidanceRecommendation | null> {
    const record = await this.getSchoolNeedProfile(schoolId);
    if (!record) return null;

    const isAccredited = record.accreditationStatus === 'YES';

    let primaryActionTitle = '';
    let guidanceNotes: string[] = [];

    if (isAccredited) {
      primaryActionTitle = 'KA121 Yıllık Hibe ve Bütçe Tahsis Başvurusu (Erasmus Plan Doğrulaması)';
      guidanceNotes = [
        'Kurum akredite olduğu için KA122 yarışmalı hibe çağrısına değil, doğrudan KA121 yıllık bütçe tahsisine yönlendirildi.',
        'Okulun mevcut Erasmus Planı hedefleriyle eşleşen 2 farklı Avrupa ev sahibi kurum listesi hazırlandı.',
        'Refakatçi ve kapsayıcılık (inclusion support) ek bütçeleri otomatik hesaplandı.',
      ];
    } else {
      primaryActionTitle = 'KA122 Kısa Dönemli Öğrenici & Personel Hareketliliği Konsorsiyum Eşleşmesi';
      guidanceNotes = [
        'Kurumun henüz akreditasyonu bulunmuyor; CAPPINNO VET Konsorsiyumu altına dahil edilerek ilk yıl risksiz hareketlilik yapması önerildi.',
        'Tekil KA122 başvurusu yapılacaksa okulun kurumsal ihtiyaç analizi (Section 2) için otomatik taslak hazırlandı.',
        'Münferit başvuru yerine CAPPINNO ortak konsorsiyumuna dahil olarak 0 puan kaybetme riski sağlandı.',
      ];
    }

    return {
      schoolId: record.schoolId,
      schoolName: record.schoolName,
      accreditationStatus: record.accreditationStatus,
      overallScore: record.needAssessment.overallReadinessScore,
      recommendedPath: record.needAssessment.recommendedPath,
      primaryActionTitle,
      guidanceNotes,
      recommendedHosts: [
        {
          country: 'Almanya (Münih)',
          field: 'Endüstri 4.0 & PLC Otomasyon',
          matchReason: 'Okulun teknik altyapısı ve atölye modernizasyon ihtiyacıyla 92% uyumlu.',
        },
        {
          country: 'Finlandiya (Helsinki)',
          field: 'Yeşil Beceriler & Eko-Atölye',
          matchReason: 'Avrupa Komisyonu sürdürülebilirlik önceliğinde tam puan sağlar.',
        },
      ],
      eligibleConsortia: [
        'CAPPINNO Akıllı Üretim & VET Konsorsiyumu (2026)',
        'Marmara & Ege Yeşil Dönüşüm Eğitim Ağı',
      ],
    };
  },
};
