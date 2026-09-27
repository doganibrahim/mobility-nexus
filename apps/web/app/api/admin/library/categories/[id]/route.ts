import { NextRequest, NextResponse } from 'next/server';
import { LibraryDb } from '@/lib/library-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await LibraryDb.updateCategory(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Belirtilen ID ile kategori bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla güncellendi.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating library category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Kategori güncellenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await LibraryDb.deleteCategory(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Silinecek kategori bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Kategori başarıyla kaldırıldı.',
    });
  } catch (error: any) {
    console.error('Error deleting library category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Kategori silinirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
