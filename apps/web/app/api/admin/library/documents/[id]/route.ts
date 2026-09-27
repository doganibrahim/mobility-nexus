import { NextRequest, NextResponse } from 'next/server';
import { LibraryDb } from '@/lib/library-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const updated = await LibraryDb.updateDocument(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Belirtilen ID ile doküman bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doküman başarıyla güncellendi.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating library document:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Doküman güncellenirken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await LibraryDb.deleteDocument(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Silinecek doküman bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Doküman başarıyla yayından kaldırıldı.',
    });
  } catch (error: any) {
    console.error('Error deleting library document:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Doküman silinirken hata oluştu.' },
      { status: 500 }
    );
  }
}
