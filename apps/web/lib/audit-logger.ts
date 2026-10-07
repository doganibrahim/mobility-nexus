export type AuditActionType =
  | 'ADMIN_ACCESS_GRANTED'
  | 'ADMIN_ACCESS_DENIED'
  | 'CONTACT_FORM_SUBMISSION'
  | 'CONTACT_SPAM_BLOCKED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'CMS_REVISION_CREATED'
  | 'COURSE_UPDATED'
  | 'DOCUMENT_MODIFIED'
  | 'DOCUMENT_DELETED'
  | 'QA_TEST_TRIGGERED'
  | 'SETTINGS_UPDATED';

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  action: AuditActionType;
  actorUserId?: string | null;
  actorEmail?: string | null;
  clientIp?: string | null;
  userAgent?: string | null;
  status: 'SUCCESS' | 'WARNING' | 'FAILURE';
  details?: Record<string, any>;
}

// In-memory circular buffer for last 500 audit logs
const MAX_LOGS = 500;
const auditLogsBuffer: AuditLogRecord[] = [];

/**
 * Records an auditable security or administrative event.
 */
export function recordAuditEvent(
  action: AuditActionType,
  options: {
    actorUserId?: string | null;
    actorEmail?: string | null;
    clientIp?: string | null;
    userAgent?: string | null;
    status: 'SUCCESS' | 'WARNING' | 'FAILURE';
    details?: Record<string, any>;
  },
): AuditLogRecord {
  const record: AuditLogRecord = {
    id: `audit-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    action,
    actorUserId: options.actorUserId || null,
    actorEmail: options.actorEmail || null,
    clientIp: options.clientIp || null,
    userAgent: options.userAgent ? options.userAgent.substring(0, 200) : null,
    status: options.status,
    details: options.details,
  };

  auditLogsBuffer.unshift(record);
  if (auditLogsBuffer.length > MAX_LOGS) {
    auditLogsBuffer.pop();
  }

  // Also log to stdout for container/cloud logging services (e.g. Datadog, CloudWatch)
  const logPrefix = `[AUDIT_LOG][${record.status}] ${record.action}`;
  if (record.status === 'FAILURE') {
    console.warn(logPrefix, JSON.stringify(record));
  } else {
    console.info(logPrefix, JSON.stringify(record));
  }

  return record;
}

/**
 * Retrieves the most recent audit logs.
 */
export function getRecentAuditLogs(
  limit = 100,
  filter?: { action?: AuditActionType; status?: 'SUCCESS' | 'WARNING' | 'FAILURE' },
): AuditLogRecord[] {
  let filtered = auditLogsBuffer;
  if (filter?.action) {
    filtered = filtered.filter((l) => l.action === filter.action);
  }
  if (filter?.status) {
    filtered = filtered.filter((l) => l.status === filter.status);
  }
  return filtered.slice(0, limit);
}
