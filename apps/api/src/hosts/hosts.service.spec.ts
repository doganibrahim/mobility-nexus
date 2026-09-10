import { Test, TestingModule } from '@nestjs/testing';
import { HostsService } from './hosts.service';
import { DatabaseService } from '../database/database.service';
import { AuditService } from '../audit/audit.service';
import { RegisterHostDto } from './dto/register-host.dto';
import { UpdateHostPortfolioDto } from './dto/update-host-portfolio.dto';
import { SubmitHostVerificationDto } from './dto/submit-host-verification.dto';
import { ReviewHostVerificationDto } from './dto/review-host-verification.dto';

describe('HostsService', () => {
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculateCompleteness', () => {
    it('should calculate base score of 30 for minimal host', () => {
      const score = service.calculateCompleteness({});
      expect(score).toBe(30);
    });

    it('should reward valid OID and logo', () => {
      const score = service.calculateCompleteness({
        oid: 'E10345678',
        logoUrl: 'https://r2.example.com/logo.png',
      });
      expect(score).toBe(50); // 30 base + 10 oid + 10 logo
    });

    it('should cap completeness at 100 for comprehensive profile', () => {
      const score = service.calculateCompleteness({
        oid: 'E10345678',
        logoUrl: 'https://r2.example.com/logo.png',
        shortDescription: 'This is a detailed description of an experienced European host organisation with 150 words.',
        yearsOfExperience: 5,
        sampleMobilityProgrammeUrl: 'https://r2.example.com/programme.pdf',
        hasKa121: true,
        taxVatNumber: 'DE123456789',
        registrationNumber: 'HRB 987654',
        registrationDocumentUrl: 'https://r2.example.com/doc.pdf',
      });
      expect(score).toBe(100);
    });
  });

  describe('Host Lifecycle (Register -> Portfolio -> Verification -> Admin Review)', () => {
    it('should successfully register quick tier 1 host in fallback mode', async () => {
      const dto: RegisterHostDto = {
        name: 'Berlin Tech Training GmbH',
        tradingName: 'BerlinTech',
        organisationType: 'PRIVATE_COMPANY',
        countryCode: 'DE',
        city: 'Berlin',
        registeredAddress: 'Alexanderplatz 1, 10178 Berlin',
        yearEstablished: 2018,
        oid: 'E10123456',
        websiteUrl: 'https://berlintech.de',
        generalEmail: 'info@berlintech.de',
        telephone: '+49 30 1234567',
        primarySector: 'ict',
        contactPerson: 'Klaus Müller',
        contactTitle: 'Mobility Director',
        contactEmail: 'klaus@berlintech.de',
        consentPublicDisplay: true,
      };

      const result = await service.register(dto, 'test-corr-1');
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Berlin Tech Training GmbH');
      expect(result.verificationStatus).toBe('PENDING');
      expect(result.profileCompletenessScore).toBeGreaterThanOrEqual(40);

      // Verify findOne retrieval
      const found = await service.findOne(result.id);
      expect(found.id).toBe(result.id);
      expect(found.contactPerson).toBe('Klaus Müller');
    });

    it('should update Tier 2 portfolio', async () => {
      const regDto: RegisterHostDto = {
        name: 'Madrid Green Innovations SL',
        organisationType: 'PRIVATE_COMPANY',
        countryCode: 'ES',
        city: 'Madrid',
        registeredAddress: 'Gran Via 45, 28013 Madrid',
        yearEstablished: 2020,
        oid: 'E10987654',
        websiteUrl: 'https://madridgreen.es',
        generalEmail: 'contact@madridgreen.es',
        telephone: '+34 91 1234567',
        primarySector: 'green_energy',
        contactPerson: 'Elena Rodriguez',
        contactTitle: 'Project Manager',
        contactEmail: 'elena@madridgreen.es',
        consentPublicDisplay: true,
      };
      const host = await service.register(regDto, 'test-corr-2');

      const portfolioDto: UpdateHostPortfolioDto = {
        logoUrl: 'https://r2.storage.com/madrid-logo.png',
        shortDescription: 'Leading ecological green energy training center offering high-standard Erasmus+ VET internships.',
        yearsOfExperience: 4,
        totalParticipantsHosted: 85,
        hasKa121: true,
        hasVetLearner: true,
        sendingCountries: ['TR', 'DE', 'PL'],
        turkishParticipantsHosted: 32,
      };

      const updated = await service.updatePortfolio(host.id, portfolioDto, 'test-corr-3');
      expect(updated.logoUrl).toBe('https://r2.storage.com/madrid-logo.png');
      expect(updated.yearsOfExperience).toBe(4);
      expect(updated.hasKa121).toBe(true);
      expect(updated.profileCompletenessScore).toBeGreaterThan(host.profileCompletenessScore);
    });

    it('should submit Tier 3 verification documents and process Admin approval', async () => {
      const regDto: RegisterHostDto = {
        name: 'Vienna Care Education',
        organisationType: 'VOCATIONAL_SCHOOL',
        countryCode: 'AT',
        city: 'Wien',
        registeredAddress: 'Kärntner Ring 12, 1010 Wien',
        yearEstablished: 2015,
        oid: 'E10555666',
        websiteUrl: 'https://viennacare.at',
        generalEmail: 'office@viennacare.at',
        telephone: '+43 1 5556677',
        primarySector: 'health',
        contactPerson: 'Sophie Weber',
        contactTitle: 'Erasmus Coordinator',
        contactEmail: 'sophie@viennacare.at',
        consentPublicDisplay: true,
      };
      const host = await service.register(regDto, 'test-corr-4');

      // Submit verification
      const verifyDto: SubmitHostVerificationDto = {
        registrationNumber: 'FN 123456 a',
        taxVatNumber: 'ATU12345678',
        registrationDocumentUrl: 'https://r2.storage.com/vienna-registration.pdf',
        emergencyContactPerson: 'Dr. Lukas Bauer',
        emergencyContactPhone: '+43 664 1234567',
        participantEvidenceUrls: ['https://r2.storage.com/evidence-2024.pdf'],
      };

      const submitted = await service.submitVerification(host.id, verifyDto, 'test-corr-5');
      expect(submitted.registrationNumber).toBe('FN 123456 a');
      expect(submitted.emergencyContactPhone).toBe('+43 664 1234567');

      // Check verification queue
      const queue = await service.getVerificationQueue();
      const inQueue = queue.find((h) => h.id === host.id);
      expect(inQueue).toBeDefined();

      // Admin Review: Approve
      const reviewDto: ReviewHostVerificationDto = {
        status: 'VERIFIED',
        reviewerNotes: 'All legal KYC and registration documents confirmed. Erasmus+ criteria met.',
        criteriaChecklist: {
          legalEntityConfirmed: true,
          oidActive: true,
          emergencyContactAvailable: true,
          vetCapacitySufficient: true,
        },
      };

      const approved = await service.reviewVerification(host.id, reviewDto, 'admin-user-1', 'test-corr-6');
      expect(approved.verificationStatus).toBe('VERIFIED');
    });
  });
});
