import { NextRequest, NextResponse } from 'next/server';
import { DossierDb } from '@/lib/dossier-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Dosya ID parametresi gereklidir.' },
        { status: 400 }
      );
    }

    const dossier = await DossierDb.getDossierById(id);

    if (!dossier) {
      return NextResponse.json(
        { success: false, error: 'Hareketlilik dosyası bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dossier,
    });
  } catch (error: any) {
    console.error('Error fetching dossier by id:', error);
    return NextResponse.json(
      { success: false, error: 'Dosya detayı alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
