import { NextRequest, NextResponse } from 'next/server';
import { CoordinationDb } from '@/lib/coordination-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const schools = await CoordinationDb.getAllSchools(status, search);

    return NextResponse.json({
      success: true,
      total: schools.length,
      data: schools,
    });
  } catch (error: any) {
    console.error('Error fetching coordination schools:', error);
    return NextResponse.json(
      { success: false, error: 'Okul koordinasyon listesi alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
