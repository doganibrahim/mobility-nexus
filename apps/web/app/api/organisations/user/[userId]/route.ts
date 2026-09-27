import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    const result = await OrganisationsDb.getByUserId(userId);

    if (!result) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json({
      ...result.org,
      role: result.role,
    });
  } catch (error: any) {
    console.error('Error fetching user organisation:', error);
    return NextResponse.json(
      { success: false, message: 'Kurum getirilemedi', error: error.message },
      { status: 500 }
    );
  }
}
