import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Host kurum adı zorunludur' },
        { status: 400 }
      );
    }

    const host = await OrganisationsDb.saveHost(body, body.userId);

    return NextResponse.json(host, { status: 201 });
  } catch (error: any) {
    console.error('Error registering host organisation:', error);
    return NextResponse.json(
      { success: false, message: 'Host kaydedilemedi', error: error.message },
      { status: 500 }
    );
  }
}
