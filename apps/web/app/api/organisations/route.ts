import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Kurum adı zorunludur' },
        { status: 400 }
      );
    }

    const org = await OrganisationsDb.saveOrganisation(body, 'ORG_ADMIN');

    return NextResponse.json(org, { status: 201 });
  } catch (error: any) {
    console.error('Error saving organisation:', error);
    return NextResponse.json(
      { success: false, message: 'Kurum kaydedilemedi', error: error.message },
      { status: 500 }
    );
  }
}
