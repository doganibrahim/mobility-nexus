import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';
import { CreateCourseSessionDto } from '@mobility-nexus/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCourseSessionDto;

    if (!body.courseId || !body.startDate || !body.endDate || !body.city || !body.country) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required session fields (courseId, startDate, endDate, city, country)',
        },
        { status: 400 }
      );
    }

    const session = await MarketplaceDb.createSession(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Course session created successfully',
        session,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating course session:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create session', error: error.message },
      { status: 500 }
    );
  }
}
