import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { MatchHostsDto } from './match-hosts.dto';
import { EvaluateCriteriaRequestDto } from '@mobility-nexus/types';

export class EvaluateCriteriaDto implements EvaluateCriteriaRequestDto {
  @ApiProperty({
    description: 'Okul hareketlilik planlama ve filtreleme kriterleri (7 Kriter)',
    type: MatchHostsDto,
  })
  @ValidateNested()
  @Type(() => MatchHostsDto)
  criteria: MatchHostsDto;

  @ApiPropertyOptional({
    description: 'Belirli bir ev sahibi ID (opsiyonel; belirtilmezse havuzdaki tüm ev sahipleri değerlendirilir)',
    example: 'host-de-technordic',
  })
  @IsOptional()
  @IsString()
  hostId?: string;
}
