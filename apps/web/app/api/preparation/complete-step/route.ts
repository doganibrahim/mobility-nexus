import { NextRequest, NextResponse } from 'next/server';
import { PreparationDb } from '@/lib/preparation-db';
import { CompleteStepDto } from '@mobility-nexus/types';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CompleteStepDto;

    if (!body.participantId || !body.moduleId) {
      return NextResponse.json(
        { success: false, error: 'participantId ve moduleId alanları zorunludur.' },
        { status: 400 }
      );
    }

    const result = await PreparationDb.completeStep(body);

    return NextResponse.json({
      success: true,
      message: 'Modül adımı başarıyla tamamlandı ve karne güncellendi.',
      data: result,
    });
  } catch (error: any) {
    console.error('Error completing preparation step:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Adım tamamlanırken hata oluştu.' },
      { status: 500 }
    );
  }
}
