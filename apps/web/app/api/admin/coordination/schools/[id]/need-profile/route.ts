import { NextRequest, NextResponse } from 'next/server';
import { CoordinationDb } from '@/lib/coordination-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const profile = await CoordinationDb.getSchoolNeedProfile(id);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Kurum profili bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error: any) {
    console.error('Error fetching school need profile:', error);
    return NextResponse.json(
      { success: false, error: 'İhtiyaç profili alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
