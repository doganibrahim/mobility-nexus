import { NextRequest, NextResponse } from 'next/server';
import { PreparationDb } from '@/lib/preparation-db';

interface RouteContext {
  params: Promise<{ participantId: string }>;
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { participantId } = await context.params;
    if (!participantId) {
      return NextResponse.json(
        { success: false, error: 'participantId parametresi gereklidir.' },
        { status: 400 }
      );
    }

    const progress = await PreparationDb.getParticipantProgress(participantId);

    if (!progress) {
      return NextResponse.json(
        { success: false, error: 'Katılımcı hazırlık kaydı bulunamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error: any) {
    console.error('Error fetching participant progress:', error);
    return NextResponse.json(
      { success: false, error: 'Katılımcı ilerleme durumu alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
