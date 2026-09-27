import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const course = await MarketplaceDb.getCourseById(id);

    if (!course) {
      return NextResponse.json(
        { success: false, message: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error: any) {
    console.error('Error fetching course by ID:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch course', error: error.message },
      { status: 500 }
    );
  }
}
