import { Module } from '@nestjs/common';
import { HostsService } from './hosts.service';
import { HostsController } from './hosts.controller';
import { MatchingController } from './matching.controller';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [AuditModule],
  controllers: [HostsController, MatchingController],
  providers: [HostsService],
  exports: [HostsService],
})
export class HostsModule {}
