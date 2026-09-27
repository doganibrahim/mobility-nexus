import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';
import { CreateJobShadowingOfferDto } from '@mobility-nexus/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateJobShadowingOfferDto;

    if (!body.hostId || !body.titleTr || !body.country || !body.city || !body.vetField) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required job shadowing fields (hostId, titleTr, country, city, vetField)',
        },
        { status: 400 }
      );
    }

    const offer = await MarketplaceDb.createJobShadowingOffer(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Job shadowing offer created successfully',
        offer,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating job shadowing offer:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create job shadowing offer', error: error.message },
      { status: 500 }
    );
  }
}
