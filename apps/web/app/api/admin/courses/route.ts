import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';
import { AdminCreateCourseWithSessionsDto } from '@mobility-nexus/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || undefined;
    const iscedCode = searchParams.get('iscedCode') || undefined;
    const search = searchParams.get('search') || undefined;

    const courses = await MarketplaceDb.getAllCourses({
      country,
      iscedCode,
      search,
    });

    return NextResponse.json({
      success: true,
      total: courses.length,
      courses,
    });
  } catch (error: any) {
    console.error('Error fetching admin courses:', error);
    return NextResponse.json(
      { success: false, error: 'Kurslar listelenirken bir hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AdminCreateCourseWithSessionsDto;

    if (!body.titleTr || !body.titleEn || !body.hostCountry || !body.hostCity || !body.iscedCode) {
      return NextResponse.json(
        {
          success: false,
          error: 'Eksik alanlar: titleTr, titleEn, hostCountry, hostCity ve iscedCode zorunludur.',
        },
        { status: 400 }
      );
    }

    const hostId = body.hostId || 'admin-cappinno';
    const hostName = body.hostName || 'CAPPINNO European Mobility Consortium';

    const course = await MarketplaceDb.createCourseWithSessions({
      ...body,
      hostId,
      hostName,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Yeni kurs ve oturumları başarıyla oluşturuldu ve yayına alındı.',
        course,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating admin course:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Kurs oluşturulurken bir hata meydana geldi.' },
      { status: 500 }
    );
  }
}
