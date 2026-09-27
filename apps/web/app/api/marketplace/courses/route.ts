import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country') || undefined;
    const iscedCode = searchParams.get('iscedCode') || undefined;
    const targetAudience = searchParams.get('targetAudience') || undefined;
    const minLanguageLevel = searchParams.get('minLanguageLevel') || undefined;
    const search = searchParams.get('search') || undefined;

    const courses = await MarketplaceDb.getAllCourses({
      country,
      iscedCode,
      targetAudience,
      minLanguageLevel,
      search,
    });

    return NextResponse.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error: any) {
    console.error('Error fetching marketplace courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch courses', error: error.message },
      { status: 500 }
    );
  }
}
