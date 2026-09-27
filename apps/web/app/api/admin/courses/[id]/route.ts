import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await MarketplaceDb.updateCourse(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Belirtilen ID ile kurs bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kurs başarıyla güncellendi.',
      course: updated,
    });
  } catch (error: any) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Kurs güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await MarketplaceDb.deleteCourse(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Silinecek kurs bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kurs ve ilişkili seanslar başarıyla kaldırıldı.',
    });
  } catch (error: any) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Kurs silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
