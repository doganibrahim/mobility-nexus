import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { TenantGuard } from './common/guards/tenant.guard';
import { RolesGuard } from './common/guards/rbac.guard';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { AuditModule } from './audit/audit.module';
import { OrganisationsModule } from './organisations/organisations.module';
import { MembersModule } from './members/members.module';
import { ReferenceModule } from './reference/reference.module';
import { HostsModule } from './hosts/hosts.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    DatabaseModule,
    AuditModule,
    HealthModule,
    OrganisationsModule,
    MembersModule,
    ReferenceModule,
    HostsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: TenantGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
