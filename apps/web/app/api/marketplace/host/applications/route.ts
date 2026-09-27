import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const hostId = searchParams.get('hostId') || undefined;

    const applications = await MarketplaceDb.getApplications({ hostId });
    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error('Error fetching host applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch host applications', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { applicationId, status, hostDecisionNote } = body;

    if (!applicationId || !status) {
      return NextResponse.json(
        { success: false, message: 'applicationId and status are required' },
        { status: 400 }
      );
    }

    if (!['CONFIRMED', 'DECLINED', 'CANCELLED', 'PENDING'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Invalid application status' },
        { status: 400 }
      );
    }

    const updated = await MarketplaceDb.updateApplicationStatus(
      applicationId,
      status,
      hostDecisionNote
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Application status updated to ${status}`,
      application: updated,
    });
  } catch (error: any) {
    console.error('Error updating application status:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update application status', error: error.message },
      { status: 500 }
    );
  }
}
