import { NextRequest, NextResponse } from 'next/server';
import { DossierDb } from '@/lib/dossier-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolId = searchParams.get('schoolId') || undefined;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;

    const dossiers = await DossierDb.getAllDossiers(schoolId, search, status);

    return NextResponse.json({
      success: true,
      total: dossiers.length,
      data: dossiers,
    });
  } catch (error: any) {
    console.error('Error fetching mobility dossiers:', error);
    return NextResponse.json(
      { success: false, error: 'Hareketlilik dosyaları alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
