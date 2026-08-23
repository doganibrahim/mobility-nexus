import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsIn,
  MaxLength,
} from 'class-validator';
import { AccreditationStatus } from '@mobility-nexus/types';

export class CreateOrganisationDto {
  @ApiProperty({
    example: 'Ankara Mesleki ve Teknik Anadolu Lisesi',
    description: 'Kurumun tam yasal adı',
  })
  @IsString()
  @IsNotEmpty({ message: 'Kurum adı boş bırakılamaz.' })
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({
    example: 'ankara-mtal',
    description: 'URL dostu benzersiz kurum slug değeri',
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    example: 'E10123456',
    description: 'Erasmus Organisation ID (OID: E10 ile başlayan 8-9 karakter)',
  })
  @IsString()
  @IsOptional()
  @Matches(/^E10[0-9]{5,7}$/, {
    message: 'OID formatı geçerli bir Erasmus OID olmalıdır (Örn: E10123456).',
  })
  oid?: string;

  @ApiPropertyOptional({ example: 'Ankara', description: 'Kurumun bulunduğu il/şehir' })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({ example: 'TR', description: '2 veya 3 haneli ülke kodu' })
  @IsString()
  @IsOptional()
  countryCode?: string;

  @ApiPropertyOptional({
    enum: ['YES', 'NO', 'UNKNOWN', 'PENDING'],
    example: 'YES',
    description: 'Erasmus VET Akreditasyon Durumu',
  })
  @IsOptional()
  @IsIn(['YES', 'NO', 'UNKNOWN', 'PENDING'])
  accreditationStatus?: AccreditationStatus;

  @ApiPropertyOptional({
    example: 'Endüstri 4.0 ve PLC otomasyon yetkinliklerinin AB düzeyinde geliştirilmesi',
    description: 'Kurumun Erasmus Planı hedefi',
  })
  @IsString()
  @IsOptional()
  erasmusPlan?: string;

  @ApiPropertyOptional({
    example: 'Öğretmen ve öğrencilerin robotik kol programlama tecrübesi eksikliği',
    description: 'Kurumsal ihtiyaç ve gelişim alanı analizi',
  })
  @IsString()
  @IsOptional()
  institutionNeed?: string;
}
