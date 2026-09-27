import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';
import { CreateCourseDto } from '@mobility-nexus/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId') || undefined;

    const allCourses = await MarketplaceDb.getAllCourses();
    const hostCourses = hostId
      ? allCourses.filter((c) => c.hostId === hostId)
      : allCourses;

    return NextResponse.json({
      success: true,
      count: hostCourses.length,
      courses: hostCourses,
    });
  } catch (error: any) {
    console.error('Error fetching host courses:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch host courses', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateCourseDto;

    if (!body.hostId || !body.titleTr || !body.hostCity || !body.iscedCode) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required course fields (hostId, titleTr, hostCity, iscedCode)',
        },
        { status: 400 }
      );
    }

    const createdCourse = await MarketplaceDb.createCourse(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Course created successfully',
        course: createdCourse,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create course', error: error.message },
      { status: 500 }
    );
  }
}
