import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class SubmitHostVerificationDto {
  @ApiProperty({
    example: 'HRB 123456 B',
    description: 'Şirket, dernek veya resmi sicil numarası (Organisation Registration Number)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kuruluş sicil numarası girilmelidir.' })
  registrationNumber: string;

  @ApiProperty({
    example: 'https://storage.mobility-nexus.eu/documents/commercial-register.pdf',
    description: 'Tüzel kuruluşu doğrulayan resmi sicil tasdiknamesi / kuruluş belgesi (Registration Document)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Resmi sicil/kuruluş belgesi yüklenmelidir.' })
  registrationDocumentUrl: string;

  @ApiProperty({
    example: 'DE123456789',
    description: 'Ulusal vergi numarası veya AB KDV (EU VAT) numarası',
  })
  @IsString()
  @IsNotEmpty({ message: 'Vergi veya KDV numarası girilmelidir.' })
  taxVatNumber: string;

  @ApiProperty({
    example: 'Dr. Klaus Weber',
    description: 'Hareketlilik faaliyetleri sırasında 7/24 ulaşılabilecek acil durum yetkilisi (Emergency Contact Person)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Acil durum irtibat kişisi belirtilmelidir.' })
  emergencyContactPerson: string;

  @ApiProperty({
    example: '+49 170 9876543',
    description: '7/24 ulaşılabilecek acil durum telefon numarası',
  })
  @IsString()
  @IsNotEmpty({ message: '7/24 acil durum irtibat numarası girilmelidir.' })
  emergencyContactPhone: string;

  @ApiPropertyOptional({
    example: '+49 30 98765432',
    description: 'İrtibat yetkilisinin doğrudan masaüstü / mobil telefon numarası (Admin incelemesi için)',
  })
  @IsString()
  @IsOptional()
  contactDirectPhone?: string;

  @ApiPropertyOptional({
    example: '+49 176 12345678',
    description: 'Operasyonel iletişim için WhatsApp irtibat numarası',
  })
  @IsString()
  @IsOptional()
  contactWhatsapp?: string;

  @ApiProperty({
    example: ['https://storage.mobility-nexus.eu/evidence/past-mobilities-report.pdf'],
    description: 'Beyan edilen katılımcı sayılarını doğrulayan resmi kanıt evrakları (Katılım sertifikaları, sözleşmeler vb.)',
  })
  @IsArray()
  @IsNotEmpty({ message: 'Katılımcı sayılarını destekleyen en az bir kanıt belgesi eklenmelidir.' })
  participantEvidenceUrls: string[];

  @ApiPropertyOptional({
    example: ['https://storage.mobility-nexus.eu/samples/learning-agreement-sample.pdf'],
    description: 'Öğrenme anlaşmaları, devam çizelgeleri veya sertifika örnekleri',
  })
  @IsArray()
  @IsOptional()
  sampleDocumentsUrls?: string[];
}
