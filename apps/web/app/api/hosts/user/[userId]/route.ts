import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const host = await OrganisationsDb.getHostByUserId(userId);

    if (!host) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(host);
  } catch (error: any) {
    console.error('Error fetching user host:', error);
    return NextResponse.json(
      { success: false, message: 'Host getirilemedi', error: error.message },
      { status: 500 }
    );
  }
}
