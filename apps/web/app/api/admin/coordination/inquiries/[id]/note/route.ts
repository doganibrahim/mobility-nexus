import { NextRequest, NextResponse } from 'next/server';
import { CoordinationDb } from '@/lib/coordination-db';
import { AddCoordinationNoteDto } from '@mobility-nexus/types';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Başlık (title) ve içerik (content) zorunludur.' },
        { status: 400 }
      );
    }

    const schoolId = body.schoolId || id;

    const dto: AddCoordinationNoteDto = {
      schoolId,
      inquiryId: id,
      activityType: body.activityType || 'NOTE',
      title: body.title,
      content: body.content,
      newStatus: body.newStatus,
      followUpDate: body.followUpDate,
    };

    const activity = await CoordinationDb.addCoordinationNote(dto);

    return NextResponse.json(
      {
        success: true,
        message: 'Görüşme notu ve süreç durumu başarıyla kaydedildi.',
        data: activity,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error adding coordination note:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Görüşme notu kaydedilirken hata oluştu.' },
      { status: 500 }
    );
  }
}
