import { NextRequest, NextResponse } from 'next/server';
import { PreparationDb } from '@/lib/preparation-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId') || undefined;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const participants = await PreparationDb.getAllAssignments(schoolId, search, status);

    return NextResponse.json({
      success: true,
      total: participants.length,
      data: participants,
    });
  } catch (error: any) {
    console.error('Error fetching preparation participants:', error);
    return NextResponse.json(
      { success: false, error: 'Katılımcı hazırlık listesi alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
