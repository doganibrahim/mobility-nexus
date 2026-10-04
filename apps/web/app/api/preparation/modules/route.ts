import { NextRequest, NextResponse } from 'next/server';
import { PreparationDb } from '@/lib/preparation-db';

export async function GET(request: NextRequest) {
  try {
    const modules = await PreparationDb.getAllModules();
    return NextResponse.json({
      success: true,
      total: modules.length,
      data: modules,
    });
  } catch (error: any) {
    console.error('Error fetching preparation modules:', error);
    return NextResponse.json(
      { success: false, error: 'Hazırlık modülleri alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}
