import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  Min,
  Max,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { FiveDimensionalReviewMetrics } from '@mobility-nexus/types';

export class ReviewMetricsDto implements FiveDimensionalReviewMetrics {
  @ApiProperty({ description: 'Yanıt Süresi (1.0 - 5.0)', example: 4.8 })
  @IsNumber()
  @Min(1)
  @Max(5)
  responseTime: number;

  @ApiProperty({ description: 'İletişim Kalitesi (1.0 - 5.0)', example: 4.9 })
  @IsNumber()
  @Min(1)
  @Max(5)
  communication: number;

  @ApiProperty({ description: 'Hizmet Tamamlama / Sözleşme Uyumu (1.0 - 5.0)', example: 4.7 })
  @IsNumber()
  @Min(1)
  @Max(5)
  serviceDelivery: number;

  @ApiProperty({ description: 'Program & Müfredat Uygunluğu (1.0 - 5.0)', example: 5.0 })
  @IsNumber()
  @Min(1)
  @Max(5)
  programmeAlignment: number;

  @ApiProperty({ description: 'Sorun Çözme & Kriz Yönetimi (1.0 - 5.0)', example: 4.6 })
  @IsNumber()
  @Min(1)
  @Max(5)
  problemSolving: number;
}

export class CreateReviewDto {
  @ApiProperty({ description: 'Değerlendirmeyi yapan okul veya kurum adı', example: 'Bursa Nilüfer MTAL' })
  @IsString()
  @IsNotEmpty()
  schoolName: string;

  @ApiPropertyOptional({ description: 'Okul Erasmus+ OID numarası', example: 'E10023451' })
  @IsOptional()
  @IsString()
  schoolOid?: string;

  @ApiPropertyOptional({ description: 'Proje türü (KA121, KA122, vb.)', example: 'KA121' })
  @IsOptional()
  @IsString()
  projectType?: string;

  @ApiPropertyOptional({ description: 'Hareketlilik yılı', example: 2025 })
  @IsOptional()
  @IsNumber()
  mobilityYear?: number;

  @ApiProperty({ description: '5 boyutlu performans değerlendirme puanları', type: ReviewMetricsDto })
  @ValidateNested()
  @Type(() => ReviewMetricsDto)
  metrics: ReviewMetricsDto;

  @ApiPropertyOptional({ description: 'Okul koordinatörü detaylı değerlendirme metni' })
  @IsOptional()
  @IsString()
  comment?: string;
}
