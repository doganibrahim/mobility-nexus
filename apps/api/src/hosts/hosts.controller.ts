import {
  Controller,
  Post,
  Patch,
  Get,
  Body,
  Param,
  Query,
  Headers,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { HostsService } from './hosts.service';
import { RegisterHostDto } from './dto/register-host.dto';
import { UpdateHostPortfolioDto } from './dto/update-host-portfolio.dto';
import { SubmitHostVerificationDto } from './dto/submit-host-verification.dto';
import { ReviewHostVerificationDto } from './dto/review-host-verification.dto';
import { MatchHostsDto } from './dto/match-hosts.dto';
import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id.middleware';
import { AdminGuard } from '../common/guards/admin.guard';

@ApiTags('Host Organisations (Ev Sahibi Kurumlar)')
@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Aşama 1: Hızlı Ev Sahibi Kurum Kaydı (Onboarding Quick Setup)' })
  @ApiResponse({ status: 201, description: 'Ev sahibi kurum başarıyla kaydedildi' })
  register(
    @Body() dto: RegisterHostDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.hostsService.register(dto, correlationId);
  }

  @Patch(':id/portfolio')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Aşama 2: Dashboard Vitrin & Erasmus+ Portföyü Güncelle' })
  @ApiResponse({ status: 200, description: 'Ev sahibi kurum portföyü güncellendi' })
  updatePortfolio(
    @Param('id') id: string,
    @Body() dto: UpdateHostPortfolioDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.hostsService.updatePortfolio(id, dto, correlationId);
  }

  @Post(':id/verification')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Aşama 3: Doğrulama & KYC Evraklarını Gönder (Admin Only)' })
  @ApiResponse({ status: 200, description: 'Doğrulama evrakları gönderildi (Statü: UNDER_REVIEW)' })
  submitVerification(
    @Param('id') id: string,
    @Body() dto: SubmitHostVerificationDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.hostsService.submitVerification(id, dto, correlationId);
  }

  @Get('verifications/queue')
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Yönetici: Onay Bekleyen Evrak İnceleme Havuzunu Getir' })
  @ApiQuery({ name: 'status', required: false, example: 'UNDER_REVIEW' })
  @ApiResponse({ status: 200, description: 'İnceleme bekleyen kurum ve evrak listesi' })
  getVerificationQueue(@Query('status') status?: string) {
    return this.hostsService.getVerificationQueue(status);
  }

  @Post(':id/verification/review')
  @UseGuards(AdminGuard)
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Yönetici: Kurum Doğrulama Kararı Ver (Onayla/Rozet Ver, Revize İste)' })
  @ApiResponse({ status: 200, description: 'Doğrulama kararı işlendi' })
  reviewVerification(
    @Param('id') id: string,
    @Body() dto: ReviewHostVerificationDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.hostsService.reviewVerification(id, dto, 'platform_admin', correlationId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Kullanıcının Bağlı Olduğu Ev Sahibi Kurumu Getir' })
  @ApiResponse({ status: 200, description: 'Kullanıcının ev sahibi kurum bilgileri veya null' })
  findByUser(@Param('userId') userId: string) {
    return this.hostsService.findByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Ev Sahibi Kurum Detaylarını Getir' })
  @ApiResponse({ status: 200, description: 'Ev sahibi kurum profili' })
  findOne(@Param('id') id: string) {
    return this.hostsService.findOne(id);
  }

  @Post('match')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Yararlanıcı Okul Gereksinimlerine Göre Ev Sahibi (Host) Eşleştir & İki Kademeli Skorla' })
  @ApiResponse({ status: 200, description: 'Filtrelenmiş ve iki kademeli puanlanmış ev sahibi adayları' })
  matchHosts(
    @Body() dto: MatchHostsDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'match-req',
  ) {
    return this.hostsService.matchHosts(dto, correlationId);
  }
}
