import { NextRequest, NextResponse } from 'next/server';
import { InquiriesDb } from '../../../lib/inquiries-db';
import { MobilityInquiry } from '../../../lib/store';

export const dynamic = 'force-dynamic';

/**
 * GET /api/inquiries
 * Returns all inquiries, optionally filtered by status, hostId, or schoolOid
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const hostId = searchParams.get('hostId');
    const schoolOid = searchParams.get('schoolOid');

    let inquiries = await InquiriesDb.getAll();

    if (status) {
      inquiries = inquiries.filter((inq) => inq.status === status);
    }
    if (hostId) {
      inquiries = inquiries.filter((inq) => inq.hostId === hostId);
    }
    if (schoolOid) {
      inquiries = inquiries.filter((inq) => inq.schoolOid === schoolOid);
    }

    return NextResponse.json({
      success: true,
      count: inquiries.length,
      data: inquiries,
    });
  } catch (error: any) {
    console.error('Error fetching inquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Talepler getirilirken hata oluştu', error: error.message },
      { status: 500 },
    );
  }
}

/**
 * POST /api/inquiries
 * Submits a new school inquiry to a European host organisation
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.schoolName || !body.hostId || !body.hostName) {
      return NextResponse.json(
        { success: false, message: 'Eksik parametreler: Okul adı ve hedef host zorunludur.' },
        { status: 400 },
      );
    }

    const newInquiry: MobilityInquiry = {
      id: body.id || 'inq-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      createdAt: body.createdAt || new Date().toISOString(),
      isMock: Boolean(body.isMock),
      schoolName: body.schoolName,
      schoolCity: body.schoolCity || 'Bilinmiyor',
      schoolOid: body.schoolOid || 'E10000000',
      schoolContactName: body.schoolContactName,
      schoolContactEmail: body.schoolContactEmail,
      projectType: body.projectType || 'KA121',
      hostId: body.hostId,
      hostName: body.hostName,
      hostCountry: body.hostCountry || 'EU',
      vetField: body.vetField || 'General',
      iscedCode: body.iscedCode,
      participantCount: Number(body.participantCount) || 1,
      accompanyingPersonsCount: Number(body.accompanyingPersonsCount) || 0,
      durationDays: Number(body.durationDays) || 14,
      targetStartDate: body.targetStartDate,
      targetEndDate: body.targetEndDate,
      logisticsRequired: body.logisticsRequired || {
        accommodation: true,
        meals: true,
        transfers: false,
      },
      notes: body.notes || '',
      status: body.status || 'PENDING',
      hostReplyNote: body.hostReplyNote || null,
    };

    const saved = await InquiriesDb.create(newInquiry);

    return NextResponse.json({
      success: true,
      message: 'Hareketlilik talebi ve mesaj başarıyla kaydedildi.',
      data: saved,
    });
  } catch (error: any) {
    console.error('Error saving inquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Talep kaydedilirken hata oluştu', error: error.message },
      { status: 500 },
    );
  }
}
