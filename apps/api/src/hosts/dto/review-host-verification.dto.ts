import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsIn, IsObject } from 'class-validator';

export class ReviewHostVerificationDto {
  @ApiProperty({
    example: 'VERIFIED',
    enum: ['VERIFIED', 'NEEDS_UPDATE', 'REJECTED'],
    description: 'Doğrulama kararı (VERIFIED: Onayla & Rozet Ver, NEEDS_UPDATE: Eksik Evrak İste, REJECTED: Reddet)',
  })
  @IsString()
  @IsNotEmpty()
  @IsIn(['VERIFIED', 'NEEDS_UPDATE', 'REJECTED'])
  status: 'VERIFIED' | 'NEEDS_UPDATE' | 'REJECTED';

  @ApiPropertyOptional({
    example: 'Tüm sicil ve vergi evrakları teyit edildi. Türkiye grubu referansları olumlu onaylandı.',
    description: 'Yönetici inceleme notları veya evrak güncelleme talimatı',
  })
  @IsString()
  @IsOptional()
  reviewerNotes?: string;

  @ApiPropertyOptional({
    example: {
      taxRegistrationVerified: true,
      physicalWorkplaceVerified: true,
      occupationalSafetyStandards: true,
      emergencyProtocolInPlace: true,
    },
    description: '15+ Kalite Kriteri kontrol listesi durumları',
  })
  @IsObject()
  @IsOptional()
  criteriaChecklist?: Record<string, boolean>;
}
