import { Injectable, Logger } from '@nestjs/common';
import { AuditEvent } from '@mobility-nexus/types';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private readonly events: AuditEvent[] = [];

  async logEvent(params: {
    organisationId?: string;
    userId?: string;
    action: string;
    resourceType: string;
    resourceId: string;
    payloadBefore?: Record<string, unknown>;
    payloadAfter?: Record<string, unknown>;
    correlationId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<AuditEvent> {
    const event: AuditEvent = {
      id: uuidv4(),
      organisationId: params.organisationId || null,
      userId: params.userId || null,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      payloadBefore: params.payloadBefore || null,
      payloadAfter: params.payloadAfter || null,
      correlationId: params.correlationId,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
      createdAt: new Date().toISOString(),
    };

    this.events.push(event);
    this.logger.log(
      `[AUDIT] Action: ${event.action} | Org: ${event.organisationId || 'SYSTEM'} | Res: ${event.resourceType}:${event.resourceId} | Corr: ${event.correlationId}`,
    );

    return event;
  }

  async getEventsByOrg(organisationId: string): Promise<AuditEvent[]> {
    return this.events.filter((e) => e.organisationId === organisationId);
  }
}
