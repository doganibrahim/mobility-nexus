import {
  Controller,
  Post,
  Body,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HostsService } from './hosts.service';
import { EvaluateCriteriaDto } from './dto/evaluate-criteria.dto';
import { MatchHostsDto } from './dto/match-hosts.dto';
import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id.middleware';

@ApiTags('Matching Engine & Diagnostics (Eşleştirme & Uyuşmazlık Tanılaması)')
@Controller('matching')
export class MatchingController {
  constructor(private readonly hostsService: HostsService) {}

  @Post('evaluate-criteria')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({
    summary: 'POST /matching/evaluate-criteria - 7 Kriterli Detaylı Eşleşme/Uyuşmazlık Dökümü ve Skor Açıklaması (PKG-IMP-03)',
  })
  @ApiResponse({
    status: 200,
    description: '7 kriterli detaylı eşleşme/uyuşmazlık dökümü, skor açıklamaları ve aksiyon tavsiyeleri',
  })
  evaluateCriteria(
    @Body() dto: EvaluateCriteriaDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'eval-req',
  ) {
    return this.hostsService.evaluateCriteria(dto, correlationId);
  }

  @Post('match')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Yararlanıcı Okul Gereksinimlerine Göre Eşleştir & İki Kademeli Skorla' })
  @ApiResponse({ status: 200, description: 'Filtrelenmiş ve iki kademeli puanlanmış ev sahibi adayları' })
  matchHosts(
    @Body() dto: MatchHostsDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'match-req',
  ) {
    return this.hostsService.matchHosts(dto, correlationId);
  }
}
