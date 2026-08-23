import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { OrganisationsService } from './organisations.service';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { UpdateOrganisationDto } from './dto/update-organisation.dto';
import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id.middleware';

@ApiTags('Organisations (Tenants)')
@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Yeni Akredite/VET Kurumu Kaydı' })
  @ApiResponse({ status: 201, description: 'Kurum başarıyla oluşturuldu' })
  create(
    @Body() createDto: CreateOrganisationDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.organisationsService.create(createDto, correlationId);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm Kayıtlı Kurumları Listele' })
  findAll() {
    return this.organisationsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Kurum Profil Detayını Getir' })
  findOne(@Param('id') id: string) {
    return this.organisationsService.findOne(id);
  }

  @Get(':id/readiness')
  @ApiOperation({ summary: 'Kurumun Erasmus Başvuru Hazırlık (Readiness) Skorunu Hesapla (0-100)' })
  getReadiness(@Param('id') id: string) {
    return this.organisationsService.getReadiness(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Kurum Profilini Güncelle' })
  update(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrganisationDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.organisationsService.update(id, updateDto, correlationId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Kurumu Sistemden Kaldır' })
  remove(
    @Param('id') id: string,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.organisationsService.remove(id, correlationId);
  }
}
