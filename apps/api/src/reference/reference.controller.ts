import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ReferenceService } from './reference.service';

@ApiTags('Reference Data (Taxonomy)')
@Controller('reference')
export class ReferenceController {
  constructor(private readonly referenceService: ReferenceService) {}

  @Get('countries')
  @ApiOperation({ summary: 'Erasmus+ Programı Desteklenen Ülkeler Listesi' })
  @ApiResponse({ status: 200, description: 'Ülke referans listesi' })
  getCountries() {
    return this.referenceService.getCountries();
  }

  @Get('sectors')
  @ApiOperation({ summary: 'Mesleki Eğitim (VET) Sektör Taksonomisi' })
  @ApiResponse({ status: 200, description: 'Sektör referans listesi' })
  getSectors() {
    return this.referenceService.getSectors();
  }
}
