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

    const { status, reviewerNotes, criteriaChecklist } = body;
    if (!status || !['VERIFIED', 'NEEDS_UPDATE', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz doğrulama durumu' },
        { status: 400 }
      );
    }

    const updatedHost = await OrganisationsDb.reviewHostVerification(
      id,
      status,
      reviewerNotes,
      criteriaChecklist
    );

    if (!updatedHost) {
      return NextResponse.json(
        { success: false, message: 'Host bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedHost, { status: 200 });
  } catch (error: any) {
    console.error('Error reviewing host verification:', error);
    return NextResponse.json(
      { success: false, message: 'Doğrulama kararı kaydedilemedi', error: error.message },
      { status: 500 }
    );
  }
}
