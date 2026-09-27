import { NextRequest, NextResponse } from 'next/server';
import { LibraryDb } from '@/lib/library-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const revisions = await LibraryDb.getAllRevisions(limit);
    return NextResponse.json({
      success: true,
      total: revisions.length,
      data: revisions,
    });
  } catch (error: any) {
    console.error('Error fetching CMS revisions:', error);
    return NextResponse.json(
      { success: false, error: 'CMS revizyon geçmişi alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
