import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await MarketplaceDb.updateSession(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Oturum bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Oturum başarıyla güncellendi.',
      session: updated,
    });
  } catch (error: any) {
    console.error('Error updating session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Oturum güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await MarketplaceDb.deleteSession(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Silinecek oturum bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Oturum başarıyla kaldırıldı.',
    });
  } catch (error: any) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Oturum silinirken hata oluştu.' },
      { status: 500 }
    );
  }
}
