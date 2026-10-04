import { NextRequest, NextResponse } from 'next/server';
import { LibraryDb } from '@/lib/library-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const documents = await LibraryDb.getAllDocuments(category);

    return NextResponse.json({
      success: true,
      total: documents.length,
      data: documents,
    });
  } catch (error: any) {
    console.error('Error fetching library documents:', error);
    return NextResponse.json(
      { success: false, error: 'Dokümanlar listelenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
