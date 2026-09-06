import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsArray,
  IsNumber,
  Min,
  Max,
  MaxLength,
} from 'class-validator';

export class RegisterHostDto {
  @ApiProperty({
    example: 'TechNordic Solutions GmbH',
    description: 'Ev sahibi işletmenin veya kurumun yasal tam adı',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kurum adı boş bırakılamaz.' })
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'DE',
    description: 'Ev sahibi kurumun bulunduğu 2 veya 3 haneli ülke kodu (Örn: DE, NL, ES)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ülke kodu seçilmelidir.' })
  countryCode: string;

  @ApiProperty({
    example: 'Berlin',
    description: 'Ev sahibi kurumun bulunduğu şehir',
  })
  @IsString()
  @IsNotEmpty({ message: 'Şehir boş bırakılamaz.' })
  city: string;

  @ApiPropertyOptional({
    example: 'Friedrichstraße 120, 10117 Berlin',
    description: 'İşletme açık adresi',
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({
    example: 'https://technordic.de',
    description: 'Kurumsal web sitesi URL adresi',
  })
  @IsString()
  @IsOptional()
  websiteUrl?: string;

  @ApiProperty({
    example: 'ict',
    description: 'Faaliyet gösterilen ana sektör kodu (Örn: ict, automotive, electrical)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ana sektör seçilmelidir.' })
  primarySector: string;

  @ApiProperty({
    example: 'Markus Schmidt',
    description: 'Staj ve hareketlilikten sorumlu irtibat kişisi',
  })
  @IsString()
  @IsNotEmpty({ message: 'İrtibat kişisi belirtilmelidir.' })
  contactPerson: string;

  @ApiProperty({
    example: 'placement@technordic.de',
    description: 'Resmi iletişim e-posta adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir e-posta adresi giriniz.' })
  contactEmail: string;

  @ApiPropertyOptional({
    example: '+49 30 1234567',
    description: 'İletişim telefon numarası',
  })
  @IsString()
  @IsOptional()
  contactPhone?: string;

  @ApiPropertyOptional({
    example: ['EN', 'DE'],
    description: 'Staj ve mentorluk sürecinde kullanılan çalışma dilleri',
  })
  @IsArray()
  @IsOptional()
  languages?: string[];

  @ApiPropertyOptional({
    example: 4,
    description: 'Dönem başına kabul edilebilecek maksimum stajyer/öğrenci sayısı',
  })
  @IsNumber()
  @Min(1)
  @Max(50)
  @IsOptional()
  maxLearnersPerTerm?: number;

  @ApiPropertyOptional({
    example: 12,
    description: 'Yıllık toplam kabul kapasitesi',
  })
  @IsNumber()
  @Min(1)
  @Max(200)
  @IsOptional()
  totalAnnualCapacity?: number;

  @ApiPropertyOptional({
    example: ['VET_INTERNSHIP', 'JOB_SHADOWING'],
    description: 'Sunulan faaliyet türleri (VET_INTERNSHIP, JOB_SHADOWING, INVITED_EXPERT)',
  })
  @IsArray()
  @IsOptional()
  activities?: string[];

  @ApiPropertyOptional({
    example: 'user_2b9x...',
    description: 'Kaydı oluşturan Clerk kullanıcısının kimlik kodu',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    example: 'user@clerk.user',
    description: 'Kullanıcının Clerk e-posta adresi',
  })
  @IsString()
  @IsOptional()
  userEmail?: string;

  @ApiPropertyOptional({
    example: 'Markus Schmidt',
    description: 'Kullanıcının tam adı ve soyadı',
  })
  @IsString()
  @IsOptional()
  userFullName?: string;
}
