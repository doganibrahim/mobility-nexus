import { PartialType } from '@nestjs/swagger';
import { CreateOrganisationDto } from './create-organisation.dto';
import { IsBoolean, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateOrganisationDto extends PartialType(CreateOrganisationDto) {
  @ApiPropertyOptional({ example: true, description: 'Kurum aktiflik durumu' })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    example: { theme: 'theme-01', locale: 'tr' },
    description: 'Kurumsal özelleştirilmiş ayarlar',
  })
  @IsObject()
  @IsOptional()
  settings?: Record<string, unknown>;
}
