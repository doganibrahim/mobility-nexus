import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HostsService } from './hosts.service';
import { RegisterHostDto } from './dto/register-host.dto';
import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id.middleware';

@ApiTags('Host Organisations (Ev Sahibi Kurumlar)')
@Controller('hosts')
export class HostsController {
  constructor(private readonly hostsService: HostsService) {}

  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Yeni Ev Sahibi Kurum (Host) Kaydı Oluştur' })
  @ApiResponse({ status: 201, description: 'Ev sahibi kurum başarıyla kaydedildi (Pending)' })
  register(
    @Body() dto: RegisterHostDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.hostsService.register(dto, correlationId);
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
}
