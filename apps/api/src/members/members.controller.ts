import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Headers,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MembersService } from './members.service';
import {
  CreateInvitationDto,
  AcceptInvitationDto,
} from './dto/create-invitation.dto';
import { CORRELATION_ID_HEADER } from '../common/middleware/correlation-id.middleware';

@ApiTags('Members & Invitations')
@Controller()
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Get('organisations/:orgId/members')
  @ApiOperation({ summary: 'Kurum Üyelerini ve Rollerını Listele' })
  getMembers(@Param('orgId') orgId: string) {
    return this.membersService.getMembers(orgId);
  }

  @Post('organisations/:orgId/invitations')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Kuruma Yeni Ekip Üyesi Davet Et (Tek Kullanımlık Token)' })
  @ApiResponse({ status: 201, description: 'Davet oluşturuldu ve bağlantı üretildi' })
  createInvitation(
    @Param('orgId') orgId: string,
    @Body() dto: CreateInvitationDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.membersService.createInvitation(orgId, dto, correlationId);
  }

  @Post('invitations/accept')
  @UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
  @ApiOperation({ summary: 'Davet Tokenı ile Kuruma Katıl' })
  acceptInvitation(
    @Body() dto: AcceptInvitationDto,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.membersService.acceptInvitation(dto, correlationId);
  }

  @Delete('organisations/:orgId/members/:userId')
  @ApiOperation({ summary: 'Kurum Üyeliğini İptal Et' })
  removeMember(
    @Param('orgId') orgId: string,
    @Param('userId') userId: string,
    @Headers(CORRELATION_ID_HEADER) correlationId = 'api-req',
  ) {
    return this.membersService.removeMember(orgId, userId, correlationId);
  }
}
