import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsArray,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  MaxLength,
  Matches,
} from 'class-validator';

export class RegisterHostDto {
  @ApiProperty({
    example: 'TechNordic Solutions GmbH',
    description: 'Ev sahibi işletmenin veya kurumun resmi kayıtlı yasal tam adı (Full Legal Name)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kurum yasal adı (Full Legal Name) boş bırakılamaz.' })
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'TechNordic',
    description: 'Ticari veya marka adı (varsa yasal addan farklı)',
  })
  @IsString()
  @IsOptional()
  @MaxLength(255)
  tradingName?: string;

  @ApiProperty({
    example: 'Company',
    description: 'Kurum türü (Company, NGO, School, University, Training Centre, vb.)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kurum türü seçilmelidir.' })
  organisationType: string;

  @ApiProperty({
    example: 'DE',
    description: 'Kurumun kayıtlı olduğu 2 veya 3 haneli ülke kodu (Örn: DE, NL, ES)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ülke kodu seçilmelidir.' })
  countryCode: string;

  @ApiProperty({
    example: 'Berlin',
    description: 'Hizmet verilen ana şehir / bölge',
  })
  @IsString()
  @IsNotEmpty({ message: 'Şehir boş bırakılamaz.' })
  city: string;

  @ApiProperty({
    example: 'Friedrichstraße 120, 10117 Berlin',
    description: 'Resmi kayıtlı tebligat adresi (Registered Address)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Resmi kayıtlı adres girilmelidir.' })
  registeredAddress: string;

  @ApiPropertyOptional({
    example: 'Alexanderplatz 5, 10178 Berlin',
    description: 'Hizmet verilen operasyonel adres (resmi adresten farklıysa)',
  })
  @IsString()
  @IsOptional()
  operationalAddress?: string;

  @ApiProperty({
    example: 2012,
    description: 'Kurumun faaliyete başladığı kuruluş yılı',
  })
  @IsNumber()
  @Min(1800)
  @Max(2100)
  @IsNotEmpty({ message: 'Kuruluş yılı belirtilmelidir.' })
  yearEstablished: number;

  @ApiProperty({
    example: 'E10123456',
    description: 'Erasmus+ Organizasyon Kimlik Numarası (OID - E10 ile başlayan 8 haneli kod)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Erasmus+ OID numarası zorunludur.' })
  @Matches(/^E10[0-9]{5,7}$/i, {
    message: 'Geçerli bir Erasmus+ OID numarası giriniz (Örn: E10123456).',
  })
  oid: string;

  @ApiPropertyOptional({
    example: '987654321',
    description: 'Funding & Tenders Portal Katılımcı Kimlik Kodu (PIC Number)',
  })
  @IsString()
  @IsOptional()
  picNumber?: string;

  @ApiProperty({
    example: 'https://technordic.de',
    description: 'Aktif kurumsal web sitesi URL adresi',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kurumsal web sitesi girilmelidir.' })
  websiteUrl: string;

  @ApiProperty({
    example: 'info@technordic.de',
    description: 'Kurumsal genel e-posta adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir genel e-posta adresi giriniz.' })
  generalEmail: string;

  @ApiProperty({
    example: '+49 30 1234567',
    description: 'Uluslararası ülke kodlu kurumsal telefon numarası',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kurumsal telefon numarası girilmelidir.' })
  telephone: string;

  @ApiProperty({
    example: 'ict',
    description: 'Faaliyet gösterilen ana sektör kodu (Örn: ict, automotive, electrical)',
  })
  @IsString()
  @IsNotEmpty({ message: 'Ana sektör seçilmelidir.' })
  primarySector: string;

  @ApiPropertyOptional({
    example: ['EN', 'DE'],
    description: 'Kurumsal ve katılımcı desteğinde kullanılan çalışma dilleri',
  })
  @IsArray()
  @IsOptional()
  workingLanguages?: string[];

  // --------------------------------------------------------------------------
  // Primary Contact Person
  // --------------------------------------------------------------------------
  @ApiProperty({
    example: 'Markus Schmidt',
    description: 'Hareketlilik işbirliklerinden sorumlu ana irtibat kişisi (Ad Soyad)',
  })
  @IsString()
  @IsNotEmpty({ message: 'İrtibat yetkilisinin adı soyadı belirtilmelidir.' })
  contactPerson: string;

  @ApiProperty({
    example: 'Mobility Coordinator',
    description: 'İrtibat yetkilisinin unvanı/görevi (Director, Project Manager vb.)',
  })
  @IsString()
  @IsNotEmpty({ message: 'İrtibat yetkilisinin unvanı belirtilmelidir.' })
  contactTitle: string;

  @ApiProperty({
    example: 'schmidt@technordic.de',
    description: 'Yetkilinin doğrudan kurumsal e-posta adresi',
  })
  @IsEmail({}, { message: 'Geçerli bir kurumsal yetkili e-posta adresi giriniz.' })
  contactEmail: string;

  @ApiProperty({
    example: true,
    description: 'İletişim kişisinin adı, unvanı ve e-postasının kamusal profilde yayınlanması için açık rıza onayı (Consent)',
  })
  @IsBoolean()
  consentPublicDisplay: boolean;

  // --------------------------------------------------------------------------
  // Optional Capacity & Activity defaults
  // --------------------------------------------------------------------------
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
    description: 'Sunulan faaliyet türleri',
  })
  @IsArray()
  @IsOptional()
  activities?: string[];

  @ApiPropertyOptional({
    example: 'user_2b9x...',
    description: 'Kaydı oluşturan kullanıcının kimlik kodu',
  })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({
    example: 'user@clerk.user',
    description: 'Kullanıcının e-posta adresi',
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
