import { NextRequest, NextResponse } from 'next/server';
import { InquiriesDb } from '../../../../lib/inquiries-db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * PATCH /api/inquiries/[id]
 * Updates inquiry status (PENDING, ACCEPTED, REVISED, DECLINED) and hostReplyNote
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Talep ID zorunludur' },
        { status: 400 },
      );
    }

    const body = await request.json();

    const VALID_STATUSES = ['PENDING', 'ACCEPTED', 'REVISED', 'DECLINED'];
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json(
        {
          success: false,
          message: `Geçersiz talep durumu (${body.status}). Yalnızca PENDING, ACCEPTED, REVISED veya DECLINED olabilir.`,
        },
        { status: 400 },
      );
    }

    const updated = await InquiriesDb.updateInquiry(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: 'Belirtilen ID ile talep bulunamadı' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Talep başarıyla güncellendi.',
      data: updated,
    });
  } catch (error: any) {
    console.error('Error updating inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Talep güncellenirken hata oluştu', error: error.message },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/inquiries/[id]
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Talep ID zorunludur' },
        { status: 400 },
      );
    }

    await InquiriesDb.delete(id);
    return NextResponse.json({
      success: true,
      message: 'Talep başarıyla silindi.',
    });
  } catch (error: any) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Talep silinirken hata oluştu', error: error.message },
      { status: 500 },
    );
  }
}
