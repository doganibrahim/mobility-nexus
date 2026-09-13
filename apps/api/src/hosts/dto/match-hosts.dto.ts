import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
  Min,
  IsEnum,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MatchHostsRequestDto, MobilityGoal, ParticipantType } from '@mobility-nexus/types';

export class LogisticsRequirementsDto {
  @ApiPropertyOptional({ example: true, description: 'Konaklama desteği gerekiyor mu' })
  @IsOptional()
  @IsBoolean()
  accommodation?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Yemek desteği gerekiyor mu' })
  @IsOptional()
  @IsBoolean()
  meals?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Havalimanı/yerel transfer gerekiyor mu' })
  @IsOptional()
  @IsBoolean()
  transfers?: boolean;
}

export class SpecialNeedsDto {
  @ApiPropertyOptional({ example: false, description: 'Tekerlekli sandalye / bedensel erişilebilirlik' })
  @IsOptional()
  @IsBoolean()
  wheelchairAccessible?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Özel diyet / alerjen / helal / vejetaryen' })
  @IsOptional()
  @IsBoolean()
  specialDiet?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Görme / işitme yardımcı desteği' })
  @IsOptional()
  @IsBoolean()
  visualAid?: boolean;
}

export class MatchHostsDto implements MatchHostsRequestDto {
  @ApiProperty({ example: 'KA122', enum: ['KA121', 'KA122'], description: 'Erasmus+ Proje Türü' })
  @IsEnum(['KA121', 'KA122'], { message: 'Proje türü KA121 veya KA122 olmalıdır.' })
  projectType: 'KA121' | 'KA122';

  @ApiProperty({ example: ['DE', 'ES'], description: 'Hedef AB Ülke Kodları (veya ANY)' })
  @IsArray()
  @IsString({ each: true })
  targetCountries: string[];

  @ApiPropertyOptional({ example: 'Berlin', description: 'Tercih edilen hedef şehir' })
  @IsOptional()
  @IsString()
  preferredCity?: string;

  @ApiProperty({ example: 'VET_SHORT_TERM', description: '10 Resmi Erasmus+ VET Faaliyet Türü' })
  @IsString()
  @IsNotEmpty()
  mobilityGoal: MobilityGoal;

  @ApiProperty({ example: 'student', enum: ['student', 'teacher', 'staff', 'incoming', 'project_team'] })
  @IsEnum(['student', 'teacher', 'staff', 'incoming', 'project_team'])
  participantType: ParticipantType;

  @ApiProperty({ example: 8, description: 'Planlanan asil katılımcı sayısı' })
  @IsInt()
  @Min(1)
  participantCount: number;

  @ApiPropertyOptional({ example: 2, description: 'Refakatçi öğretmen sayısı' })
  @IsOptional()
  @IsInt()
  @Min(0)
  accompanyingPersonsCount?: number;

  @ApiPropertyOptional({ example: 14, description: 'Faaliyet gün sayısı' })
  @IsOptional()
  @IsInt()
  @Min(1)
  durationDays?: number;

  @ApiProperty({ example: 'under_18', enum: ['under_18', '18_plus', 'mixed'], description: 'Katılımcı yaş grubu' })
  @IsEnum(['under_18', '18_plus', 'mixed'])
  ageGroup: 'under_18' | '18_plus' | 'mixed';

  @ApiPropertyOptional({ example: 'software_dev', description: 'Mesleki alan / Sektör kodu' })
  @IsOptional()
  @IsString()
  vetField?: string;

  @ApiPropertyOptional({ example: '0613', description: 'ISCED-F eğitim alanı kodu' })
  @IsOptional()
  @IsString()
  iscedCode?: string;

  @ApiPropertyOptional({ example: ['EN'], description: 'Çalışma / iletişim dilleri' })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @ApiPropertyOptional({ type: LogisticsRequirementsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => LogisticsRequirementsDto)
  logisticsRequired?: LogisticsRequirementsDto;

  @ApiPropertyOptional({ type: SpecialNeedsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SpecialNeedsDto)
  specialNeeds?: SpecialNeedsDto;
}
