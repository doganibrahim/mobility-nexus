import { Injectable, Logger } from '@nestjs/common';
import { AuditEvent } from '@mobility-nexus/types';
import { v4 as uuidv4 } from 'uuid';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);
  private readonly events: AuditEvent[] = [];

  constructor(private readonly db: DatabaseService) {}

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

    // Persist to PostgreSQL if connected
    if (this.db.isConnected) {
      try {
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(event.userId || '');
        const dbUserId = isUuid ? event.userId : null;

        await this.db.query(
          `INSERT INTO audit_event (
            id, organisation_id, user_id, action, resource_type, resource_id, 
            payload_before, payload_after, correlation_id, ip_address, user_agent, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [
            event.id,
            event.organisationId,
            dbUserId,
            event.action,
            event.resourceType,
            event.resourceId,
            event.payloadBefore ? JSON.stringify(event.payloadBefore) : null,
            event.payloadAfter ? JSON.stringify(event.payloadAfter) : null,
            event.correlationId,
            event.ipAddress,
            event.userAgent,
            event.createdAt,
          ],
        );
      } catch (err: any) {
        this.logger.warn(`Audit event veritabanına yazılamadı: ${err.message}`);
      }
    }

    return event;
  }

  async getEventsByOrg(organisationId: string): Promise<AuditEvent[]> {
    if (this.db.isConnected) {
      try {
        const rows = await this.db.query(
          `SELECT 
            id, organisation_id AS "organisationId", user_id AS "userId", 
            action, resource_type AS "resourceType", resource_id AS "resourceId", 
            payload_before AS "payloadBefore", payload_after AS "payloadAfter", 
            correlation_id AS "correlationId", ip_address AS "ipAddress", 
            user_agent AS "userAgent", created_at AS "createdAt"
          FROM audit_event 
          WHERE organisation_id = $1 
          ORDER BY created_at DESC`,
          [organisationId],
        );
        return rows;
      } catch {
        // fallback
      }
    }
    return this.events.filter((e) => e.organisationId === organisationId);
  }
}
