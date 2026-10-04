import { NextRequest, NextResponse } from 'next/server';
import { DossierDb } from '@/lib/dossier-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dossierId = searchParams.get('dossierId') || undefined;

    const logs = await DossierDb.getExportLogs(dossierId);

    return NextResponse.json({
      success: true,
      total: logs.length,
      data: logs,
    });
  } catch (error: any) {
    console.error('Error fetching export logs:', error);
    return NextResponse.json(
      { success: false, error: 'İhracat geçmişi alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
