import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { verifyAdminAccess } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authResult = await verifyAdminAccess();

  if (!authResult.authorized) {
    if (authResult.status === 401) {
      redirect('/sign-in?redirect_url=/admin/content-manager');
    } else {
      // 403 Forbidden - non-admin user
      redirect('/?auth_error=admin_privileges_required');
    }
  }

  return <div className="admin-root-container min-h-screen bg-slate-950">{children}</div>;
}
