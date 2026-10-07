import { auth, currentUser } from '@clerk/nextjs/server';
import { recordAuditEvent } from './audit-logger';

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS ||
  'ibrahimdogan.js@gmail.com'
)
  .toLowerCase()
  .split(',')
  .map((e) => e.trim());

const ADMIN_SECRET_KEY =
  process.env.ADMIN_SECRET_KEY ||
  process.env.JWT_SECRET ||
  'super-secret-jwt-key-change-in-production-erasmusmobility-2026';

export interface AdminAuthResult {
  authorized: boolean;
  status: 200 | 401 | 403;
  error?: string;
  userId?: string;
  userEmail?: string;
}

/**
 * Server-side helper to verify that the calling client has Platform Admin privileges.
 * Supports:
 * 1. x-admin-key header (automated tasks / internal service calls)
 * 2. Clerk JWT role metadata ('ADMIN', 'PLATFORM_ADMIN', 'SUPER_ADMIN')
 * 3. Clerk verified email check against ADMIN_EMAILS
 */
export async function verifyAdminAccess(request?: Request): Promise<AdminAuthResult> {
  // 1. Check API secret key header
  if (request) {
    const adminKey = request.headers.get('x-admin-key');
    if (adminKey && adminKey.trim() === ADMIN_SECRET_KEY.trim()) {
      return { authorized: true, status: 200 };
    }
  }

  // 2. Check Clerk authenticated session
  const session = await auth();
  if (!session || !session.userId) {
    recordAuditEvent('ADMIN_ACCESS_DENIED', {
      status: 'WARNING',
      details: { reason: 'No active Clerk session' },
    });
    return {
      authorized: false,
      status: 401,
      error: 'Unauthorized: Admin authentication required.',
    };
  }

  // 3. Check role from session claims (Clerk publicMetadata or metadata)
  const sessionClaims = session.sessionClaims as any;
  const role =
    sessionClaims?.metadata?.role ||
    sessionClaims?.publicMetadata?.role ||
    sessionClaims?.role;

  if (
    role === 'SUPER_ADMIN' ||
    role === 'PLATFORM_ADMIN' ||
    role === 'ADMIN' ||
    role === 'admin'
  ) {
    recordAuditEvent('ADMIN_ACCESS_GRANTED', {
      actorUserId: session.userId,
      status: 'SUCCESS',
      details: { role, method: 'session_claims_role' },
    });
    return { authorized: true, status: 200, userId: session.userId };
  }

  // 4. Check verified user email
  try {
    const user = await currentUser();
    const userEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
    if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
      recordAuditEvent('ADMIN_ACCESS_GRANTED', {
        actorUserId: session.userId,
        actorEmail: userEmail,
        status: 'SUCCESS',
        details: { method: 'verified_email_whitelist' },
      });
      return { authorized: true, status: 200, userId: session.userId, userEmail };
    }
  } catch {
    // If currentUser() throws or is unavailable, continue to reject
  }

  recordAuditEvent('ADMIN_ACCESS_DENIED', {
    actorUserId: session.userId,
    status: 'WARNING',
    details: { reason: 'User lacks admin role or email whitelist' },
  });

  return {
    authorized: false,
    status: 403,
    error: 'Forbidden: Platform administrator privileges required.',
    userId: session.userId,
  };
}
