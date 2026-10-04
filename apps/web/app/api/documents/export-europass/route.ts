import { NextRequest, NextResponse } from 'next/server';
import { DossierDb } from '@/lib/dossier-db';
import { ExportDocumentDto } from '@mobility-nexus/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<ExportDocumentDto>;

    if (!body.dossierId) {
      return NextResponse.json(
        { success: false, error: 'dossierId alanı zorunludur.' },
        { status: 400 }
      );
    }

    const result = await DossierDb.recordExport({
      dossierId: body.dossierId,
      documentType: 'EUROPASS_MOBILITY',
      format: body.format || 'PDF',
      exporterName: body.exporterName || 'Okul Erasmus Koordinatörü',
      customPayload: body.customPayload,
    });

    return NextResponse.json({
      success: true,
      message: 'Resmi Europass Hareketlilik Belgesi başarıyla oluşturuldu ve ihraç edildi.',
      data: result,
    });
  } catch (error: any) {
    console.error('Error exporting europass:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Europass belgesi ihraç edilirken hata oluştu.' },
      { status: 500 }
    );
  }
}
