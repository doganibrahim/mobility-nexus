import { NextRequest, NextResponse } from 'next/server';
import { QaDb } from '@/lib/qa-db';

export async function GET(request: NextRequest) {
  try {
    const snapshot = await QaDb.getCommercialSnapshot();

    return NextResponse.json({
      success: true,
      data: snapshot,
    });
  } catch (error: any) {
    console.error('Error fetching commercial analytics snapshot:', error);
    return NextResponse.json(
      { success: false, error: 'Platform hacim ve ticari metrikler alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
