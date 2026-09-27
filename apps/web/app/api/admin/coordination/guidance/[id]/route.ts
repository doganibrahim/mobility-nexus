import { NextRequest, NextResponse } from 'next/server';
import { CoordinationDb } from '@/lib/coordination-db';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const guidance = await CoordinationDb.getGuidanceRecommendation(id);

    if (!guidance) {
      return NextResponse.json(
        { success: false, error: 'Rehberlik önerisi oluşturulamadı.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: guidance,
    });
  } catch (error: any) {
    console.error('Error generating mobility guidance:', error);
    return NextResponse.json(
      { success: false, error: 'Rehberlik önerisi alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
