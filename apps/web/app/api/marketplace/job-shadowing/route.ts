import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceDb } from '@/lib/marketplace-db';

export async function GET(request: NextRequest) {
  try {
    const offers = await MarketplaceDb.getAllJobShadowingOffers();
    return NextResponse.json({
      success: true,
      count: offers.length,
      offers,
    });
  } catch (error: any) {
    console.error('Error fetching job shadowing offers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch job shadowing offers', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.hostId || !body.hostName || !body.country || !body.city || !body.titleTr || !body.titleEn) {
      return NextResponse.json(
        { success: false, message: 'Missing required job shadowing fields' },
        { status: 400 }
      );
    }

    const newOffer = await MarketplaceDb.createJobShadowingOffer(body);

    return NextResponse.json(
      {
        success: true,
        message: 'Job shadowing offer created successfully',
        offer: newOffer,
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
