import { NextRequest, NextResponse } from 'next/server';
import { LibraryDb } from '@/lib/library-db';
import { CreateLibraryCategoryDto } from '@mobility-nexus/types';

export async function GET() {
  try {
    const categories = await LibraryDb.getAllCategories();
    return NextResponse.json({
      success: true,
      total: categories.length,
      data: categories,
    });
  } catch (error: any) {
    console.error('Error fetching library categories:', error);
    return NextResponse.json(
      { success: false, error: 'Kategoriler listelenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateLibraryCategoryDto;

    if (!body.code || !body.nameTr || !body.nameEn) {
      return NextResponse.json(
        { success: false, error: 'code, nameTr ve nameEn alanları zorunludur.' },
        { status: 400 }
      );
    }

    const created = await LibraryDb.createCategory(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Kategori başarıyla oluşturuldu.',
        data: created,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating library category:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Kategori oluşturulurken bir hata oluştu.' },
      { status: 500 }
    );
  }
}
