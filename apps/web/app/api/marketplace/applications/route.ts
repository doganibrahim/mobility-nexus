import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';
import { CreateMarketplaceApplicationDto } from '@mobility-nexus/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const schoolOid = searchParams.get('schoolOid') || undefined;

    const applications = await MarketplaceDb.getApplications({ schoolOid });
    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch applications', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateMarketplaceApplicationDto;

    // Validation
    if (!body.hostId || !body.schoolName || !body.schoolOid || !body.contactEmail) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields (hostId, schoolName, schoolOid, contactEmail)',
        },
        { status: 400 }
      );
    }

    if (!body.participantCount || body.participantCount < 1) {
      return NextResponse.json(
        { success: false, message: 'Participant count must be at least 1' },
        { status: 400 }
      );
    }

    const application = await MarketplaceDb.createApplication(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        application,
        supportEmail: 'info@erasmusmobility.com',
        replyTo: 'info@erasmusmobility.com',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating marketplace application:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit application', error: error.message },
      { status: 500 }
    );
  }
}
