import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let hosts = await OrganisationsDb.getAllHosts();

    if (status) {
      hosts = hosts.filter((h) => h.verificationStatus === status);
    }

    // Sort: UNDER_REVIEW and PENDING first, then by newest
    hosts.sort((a, b) => {
      const priorityOrder: Record<string, number> = {
        UNDER_REVIEW: 1,
        PENDING: 2,
        NEEDS_UPDATE: 3,
        REJECTED: 4,
        VERIFIED: 5,
      };
      const pA = priorityOrder[a.verificationStatus] || 99;
      const pB = priorityOrder[b.verificationStatus] || 99;
      if (pA !== pB) return pA - pB;

      const timeA = new Date(a.updatedAt || a.createdAt || 0).getTime();
      const timeB = new Date(b.updatedAt || b.createdAt || 0).getTime();
      return timeB - timeA;
    });

    return NextResponse.json(hosts, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching verification queue:', error);
    return NextResponse.json(
      { success: false, message: 'Doğrulama kuyruğu alınamadı', error: error.message },
      { status: 500 }
    );
  }
}
