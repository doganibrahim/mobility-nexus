import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Host ID zorunludur' },
        { status: 400 }
      );
    }

    const updatedHost = await OrganisationsDb.submitHostVerification(id, body);

    if (!updatedHost) {
      return NextResponse.json(
        { success: false, message: 'Host bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedHost, { status: 200 });
  } catch (error: any) {
    console.error('Error submitting host verification:', error);
    return NextResponse.json(
      { success: false, message: 'Doğrulama belgeleri kaydedilemedi', error: error.message },
      { status: 500 }
    );
  }
}
