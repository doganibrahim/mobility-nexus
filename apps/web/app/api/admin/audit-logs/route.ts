import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAccess } from '@/lib/admin-auth';
import { getRecentAuditLogs, AuditActionType } from '@/lib/audit-logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Admin yetkisi gereklidir.' },
      { status: auth.status },
    );
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 200);
  const status = (searchParams.get('status') as 'SUCCESS' | 'WARNING' | 'FAILURE') || undefined;
  const action = (searchParams.get('action') as AuditActionType) || undefined;

  const logs = getRecentAuditLogs(limit, { action, status });

  return NextResponse.json({
    success: true,
    count: logs.length,
    data: logs,
  });
}
