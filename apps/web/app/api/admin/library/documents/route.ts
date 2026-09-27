import { NextRequest, NextResponse } from 'next/server';
import { LibraryDb, CreateLibraryDocumentDto } from '@/lib/library-db';

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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateLibraryDocumentDto;

    if (!body.titleTr || !body.category || !body.downloadUrl || !body.descriptionTr) {
      return NextResponse.json(
        {
          success: false,
          error: 'Eksik alanlar: titleTr, category, downloadUrl ve descriptionTr zorunludur.',
        },
        { status: 400 }
      );
    }

    const created = await LibraryDb.createDocument(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Kütüphane dokümanı başarıyla oluşturuldu ve yayına alındı.',
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating library document:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Doküman oluşturulurken hata oluştu.' },
      { status: 500 }
    );
  }
}
