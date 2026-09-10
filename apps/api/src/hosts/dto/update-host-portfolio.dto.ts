import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsArray,
  IsNumber,
  IsBoolean,
  Min,
  MaxLength,
} from 'class-validator';

export class UpdateHostPortfolioDto {
  @ApiPropertyOptional({
    example: 'Alexanderplatz 5, 10178 Berlin',
    description: 'Resmi adresten farklıysa operasyonel hizmet adresi',
  })
  @IsString()
  @IsOptional()
  operationalAddress?: string;

  @ApiPropertyOptional({
    example: 'https://storage.mobility-nexus.eu/logos/technordic.png',
    description: 'Yüksek çözünürlüklü kurum logosu URL (PNG veya SVG)',
  })
  @IsString()
  @IsOptional()
  logoUrl?: string;

  @ApiPropertyOptional({
    example: 'TechNordic is a leading European IT & digital education provider based in Berlin...',
    description: 'Kurumun kısa tanıtımı (Maksimum 150 kelime)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1500, { message: 'Kısa açıklama maksimum 150 kelime (yaklaşık 1200 karakter) olmalıdır.' })
  shortDescription?: string;

  @ApiPropertyOptional({
    example: 'https://storage.mobility-nexus.eu/documents/technordic-brochure.pdf',
    description: 'Detaylı kurumsal profil veya tanıtım broşürü PDF bağlantısı',
  })
  @IsString()
  @IsOptional()
  detailedProfileUrl?: string;

  // Contact additions
  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/markusschmidt',
    description: 'İrtibat yetkilisinin profesyonel LinkedIn profili',
  })
  @IsString()
  @IsOptional()
  contactLinkedin?: string;

  @ApiPropertyOptional({
    example: ['EN', 'DE', 'TR'],
    description: 'İrtibat yetkilisinin konuşabildiği diller',
  })
  @IsArray()
  @IsOptional()
  contactLanguages?: string[];

  @ApiPropertyOptional({
    example: 'https://storage.mobility-nexus.eu/photos/markus.jpg',
    description: 'İrtibat yetkilisinin profil fotoğrafı URL adresi',
  })
  @IsString()
  @IsOptional()
  contactPhotoUrl?: string;

  @ApiPropertyOptional({
    example: 'Ahmet Yılmaz (Türkçe İletişim Danışmanı / Berlin)',
    description: 'Türk ortaklar için atanmış özel Türkiye irtibat temsilcisi bilgisi',
  })
  @IsString()
  @IsOptional()
  turkeyContactPerson?: string;

  // Erasmus+ Experience
  @ApiPropertyOptional({
    example: 6,
    description: 'Erasmus+ hareketlilik hizmeti sunulan deneyim yılı sayısı',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  yearsOfExperience?: number;

  @ApiPropertyOptional({
    example: 350,
    description: 'Bugüne kadar ağırlanan toplam öğrenci ve personel sayısı',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalParticipantsHosted?: number;

  @ApiPropertyOptional({
    example: 24,
    description: 'Son 3 yıl içinde ağırlanan toplam grup sayısı',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  groupsHostedLast3Years?: number;

  @ApiPropertyOptional({
    example: ['TR', 'ES', 'IT', 'PL', 'PT'],
    description: 'Katılımcı kabul edilen gönderici ülkeler listesi',
  })
  @IsArray()
  @IsOptional()
  sendingCountries?: string[];

  @ApiPropertyOptional({
    example: 12,
    description: 'Türkiye’den daha önce ağırlanan grup sayısı',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  turkishGroupsHosted?: number;

  @ApiPropertyOptional({
    example: 180,
    description: 'Türkiye’den ağırlanan toplam katılımcı sayısı',
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  turkishParticipantsHosted?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'KA121 Akredite hareketlilik projeleri deneyimi',
  })
  @IsBoolean()
  @IsOptional()
  hasKa121?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'KA122 Kısa dönemli hareketlilik projeleri deneyimi',
  })
  @IsBoolean()
  @IsOptional()
  hasKa122?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Mesleki eğitim (VET) öğrenci staj yerleştirme deneyimi',
  })
  @IsBoolean()
  @IsOptional()
  hasVetLearner?: boolean;

  @ApiPropertyOptional({
    example: true,
    description: 'Öğretmen ve personel işbaşı izleme (Job-shadowing) ve kurs deneyimi',
  })
  @IsBoolean()
  @IsOptional()
  hasStaffMobility?: boolean;

  @ApiPropertyOptional({
    example: [
      {
        title: 'Green Tech VET Mobility 2024',
        referenceNumber: '2024-1-TR01-KA121-VET-000123',
        year: 2024,
        role: 'Hosting Partner',
      },
    ],
    description: 'Tamamlanan Erasmus+ projeleri listesi (Proje adı, referans no, yıl, rol)',
  })
  @IsArray()
  @IsOptional()
  completedProjects?: Array<{
    title: string;
    referenceNumber: string;
    year: number;
    role: string;
  }>;

  @ApiPropertyOptional({
    example: ['https://erasmus-plus.ec.europa.eu/projects/eplus-project-details/#project/2024-1-TR01'],
    description: 'Resmi Erasmus+ proje sonuç platformu bağlantıları',
  })
  @IsArray()
  @IsOptional()
  projectResultsLinks?: string[];

  @ApiPropertyOptional({
    example: 'Türkiye Ulusal Ajansı, DAAD (Almanya), SEPIE (İspanya)',
    description: 'Daha önce birlikte çalışılan Ulusal Ajanslar veya ülkeler',
  })
  @IsString()
  @IsOptional()
  nationalAgencyExperience?: string;

  @ApiPropertyOptional({
    example: 'https://storage.mobility-nexus.eu/documents/sample-mobility-programme.pdf',
    description: 'Daha önce tamamlanmış anonim örnek hareketlilik programı belgesi',
  })
  @IsString()
  @IsOptional()
  sampleMobilityProgrammeUrl?: string;
}
