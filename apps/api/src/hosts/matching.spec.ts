import { Test, TestingModule } from '@nestjs/testing';
import { HostsService } from './hosts.service';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../audit/audit.service';
import { MatchHostsDto } from './dto/match-hosts.dto';

describe('Hosts Matching Engine (Akıllı Eşleştirme Motoru)', () => {
  let service: HostsService;
  let dbService: Partial<DatabaseService>;
  let auditService: Partial<AuditService>;

  beforeEach(async () => {
    dbService = {
      isConnected: false,
      query: jest.fn().mockResolvedValue([]),
    };

    auditService = {
      logEvent: jest.fn().mockResolvedValue({} as any),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HostsService,
        { provide: DatabaseService, useValue: dbService },
        { provide: AuditService, useValue: auditService },
      ],
    }).compile();

    service = module.get<HostsService>(HostsService);
    // Seed the 8 realistic European VET host organisations
    service.seedDefaultHosts();
  });

  describe('Zorunlu Ön Eleme Kriterleri (Hard Eligibility Filters)', () => {
    it('HF-1: Hedef Ülke Filtresi - Yalnızca hedef ülkedeki kurumlar geçmeli, diğerleri elenmeli', async () => {
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['DE'], // Sadece Almanya
        mobilityGoal: 'JOB_SHADOWING',
        participantType: 'teacher',
        participantCount: 2,
        ageGroup: '18_plus',
      };

      const result = await service.matchHosts(query);

      // Uygun olan tüm kurumlar Almanya'da olmalı (DE)
      expect(result.eligibleCount).toBeGreaterThan(0);
      result.matches.forEach((match) => {
        expect(match.countryCode).toBe('DE');
        expect(match.isEligible).toBe(true);
      });

      // Elenen kurumların en az birinde hedef ülke uyuşmazlığı gerekçesi bulunmalı
      const countryDq = result.disqualified.filter((d) =>
        d.disqualificationReasons.some((r) => r.includes('Hedef ülke uyuşmazlığı')),
      );
      expect(countryDq.length).toBeGreaterThan(0);
    });

    it('HF-1b: Hedef Ülke "ANY" / "TÜMÜ" Seçildiğinde Tüm Ülkeler Filtreyi Geçmeli', async () => {
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['ANY'],
        mobilityGoal: 'VET_SHORT_TERM',
        participantType: 'student',
        participantCount: 4,
        ageGroup: '18_plus',
      };

      const result = await service.matchHosts(query);
      const countries = new Set(result.matches.map((m) => m.countryCode));
      // Birden fazla ülkeden eşleşme çıkmalı (DE, ES, NL vb.)
      expect(countries.size).toBeGreaterThan(1);
    });

    it('HF-2: Faaliyet Türü Filtresi - Ev sahibinin sunmadığı faaliyet talep edilirse elenmeli', async () => {
      // Sadece 3 kurumun sunduğu VET_SKILLS_COMPETITION talep edelim
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['ANY'],
        mobilityGoal: 'VET_SKILLS_COMPETITION',
        participantType: 'student',
        participantCount: 4,
        ageGroup: '18_plus',
      };

      const result = await service.matchHosts(query);
      result.matches.forEach((match) => {
        expect(match.supportedActivities).toContain('VET_SKILLS_COMPETITION');
      });

      // Elenenlerde faaliyet türü uyuşmazlığı olmalı
      const activityDq = result.disqualified.filter((d) =>
        d.disqualificationReasons.some((r) => r.includes('Faaliyet türü uyuşmazlığı')),
      );
      expect(activityDq.length).toBeGreaterThan(0);
    });

    it('HF-3: Kontenjan & Kapasite Filtresi - Talep edilen katılımcı sayısı dönem kapasitesini aşarsa elenmeli', async () => {
      // 15 asil + 2 refakatçi = 17 kişi (Yalnızca 20 kapasiteli Rotterdam geçebilmeli)
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['ANY'],
        mobilityGoal: 'JOB_SHADOWING',
        participantType: 'staff',
        participantCount: 15,
        accompanyingPersonsCount: 2,
        ageGroup: '18_plus',
      };

      const result = await service.matchHosts(query);
      result.matches.forEach((match) => {
        expect(match.maxLearnersPerTerm).toBeGreaterThanOrEqual(17);
      });

      // Düşük kapasiteli kurumlar (Bohemia: 6, Bavaria: 4, Italia: 8) elenmiş olmalı
      const capacityDq = result.disqualified.filter((d) =>
        d.disqualificationReasons.some((r) => r.includes('Kontenjan yetersizliği')),
      );
      expect(capacityDq.length).toBeGreaterThan(0);
    });

    it('HF-4: Yaş Grubu (18 Yaş Altı) Filtresi - Reşit olmayan stajyer kabul etmeyen kurumlar elenmeli', async () => {
      // Italia Meccatronica acceptsUnder18: false olarak tanımlıdır
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['IT'],
        mobilityGoal: 'VET_SHORT_TERM',
        participantType: 'student',
        participantCount: 4,
        ageGroup: 'under_18', // 18 yaş altı talep ediliyor
      };

      const result = await service.matchHosts(query);

      // İtalya'daki kurum elenmiş olmalıdır
      const italianDq = result.disqualified.find((d) => d.countryCode === 'IT');
      expect(italianDq).toBeDefined();
      expect(
        italianDq?.disqualificationReasons.some((r) =>
          r.includes('18 yaş altı (reşit olmayan) stajyer kabul etmemektedir'),
        ),
      ).toBe(true);
    });

    it('HF-5: Katılımcı Profili Filtresi - Sadece personel kabul eden kuruma öğrenci gönderilememeli', async () => {
      // Bavaria Digital Manufacturing yalnızca personel kabul eder (hasVetLearner: false)
      const query: MatchHostsDto = {
        projectType: 'KA121',
        targetCountries: ['DE'],
        mobilityGoal: 'VET_SHORT_TERM',
        participantType: 'student',
        participantCount: 3,
        ageGroup: '18_plus',
      };

      const result = await service.matchHosts(query);
      const bavariaDq = result.disqualified.find((d) => d.hostId === 'host-de-bavaria-digital');
      expect(bavariaDq).toBeDefined();
      expect(
        bavariaDq?.disqualificationReasons.some((r) =>
          r.includes('öğrencisi (stajyer) kabul etmemektedir') ||
          r.includes('Faaliyet türü uyuşmazlığı'),
        ),
      ).toBe(true);
    });

    it('HF-6: Özel İhtiyaçlar (Erişilebilirlik) Filtresi - Tekerlekli sandalye erişimi olmayan kurumlar elenmeli', async () => {
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['ANY'],
        mobilityGoal: 'VET_SHORT_TERM',
        participantType: 'student',
        participantCount: 4,
        ageGroup: '18_plus',
        specialNeeds: {
          wheelchairAccessible: true,
        },
      };

      const result = await service.matchHosts(query);
      result.matches.forEach((m) => {
        expect(m.passedFilters).toContain('special_needs');
      });

      const wheelchairDq = result.disqualified.filter((d) =>
        d.disqualificationReasons.some((r) => r.includes('tekerlekli sandalye')),
      );
      expect(wheelchairDq.length).toBeGreaterThan(0);
    });
  });

  describe('İki Kademeli Bağımsız Puanlama (Two-Tier Scoring)', () => {
    it('Eğitim Kalitesi Skoru ve Lojistik Skoru birbirinden bağımsız hesaplanmalıdır', async () => {
      // Rotterdam: Eğitim kalitesi yüksek (90+), fakat lojistik desteği yok (providesAccommodation: false)
      const query: MatchHostsDto = {
        projectType: 'KA121',
        targetCountries: ['NL'],
        mobilityGoal: 'VET_LONG_TERM_PRO',
        participantType: 'student',
        participantCount: 4,
        ageGroup: '18_plus',
        vetField: 'logistics_transport',
        logisticsRequired: {
          accommodation: true,
          meals: true,
          transfers: true,
        },
      };

      const result = await service.matchHosts(query);
      const rotterdam = result.matches.find((m) => m.countryCode === 'NL');
      expect(rotterdam).toBeDefined();

      if (rotterdam) {
        // Eğitim skoru yüksek olmalı (sektör ve ErasmusPro tam uyumu)
        expect(rotterdam.educationScore).toBeGreaterThanOrEqual(75);
        // Lojistik skoru düşük olmalı (hizmet sağlamadığı için)
        expect(rotterdam.logisticsScore).toBeLessThan(rotterdam.educationScore);
        // İki skor birbirinden farklı bağımsız sayılar olmalı
        expect(rotterdam.educationScore).not.toEqual(rotterdam.logisticsScore);
      }
    });

    it('Lojistik talep edilmediğinde birleşik skor doğrudan Eğitim Kalitesi Skoruna eşit olmalıdır', async () => {
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['DE'],
        mobilityGoal: 'JOB_SHADOWING',
        participantType: 'teacher',
        participantCount: 2,
        ageGroup: '18_plus',
        // logisticsRequired belirtilmedi
      };

      const result = await service.matchHosts(query);
      result.matches.forEach((m) => {
        expect(m.compositeScore).toBe(m.educationScore);
      });
    });

    it('Eşleşen kurumlar birleşik skora göre azalan sırada (en yüksekten en düşüğe) sıralanmalıdır', async () => {
      const query: MatchHostsDto = {
        projectType: 'KA122',
        targetCountries: ['ANY'],
        mobilityGoal: 'VET_SHORT_TERM',
        participantType: 'student',
        participantCount: 4,
        ageGroup: 'under_18',
        vetField: 'software_dev',
      };

      const result = await service.matchHosts(query);
      expect(result.matches.length).toBeGreaterThan(1);

      for (let i = 0; i < result.matches.length - 1; i++) {
        expect(result.matches[i].compositeScore).toBeGreaterThanOrEqual(
          result.matches[i + 1].compositeScore,
        );
      }
    });
  });
});
