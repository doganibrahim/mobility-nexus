import { NextRequest, NextResponse } from 'next/server';
import { QaDb } from '@/lib/qa-db';
import { TriggerQaRunDto } from '@mobility-nexus/types';
import { verifyAdminAccess } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Admin yetkisi gereklidir.' },
      { status: auth.status }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;

    const [testRuns, hardeningChecklist] = await Promise.all([
      QaDb.getQaTestRuns(category),
      QaDb.getHardeningChecklist(),
    ]);

    return NextResponse.json({
      success: true,
      totalTestRuns: testRuns.length,
      data: {
        testRuns,
        hardeningChecklist,
      },
    });
  } catch (error: any) {
    console.error('Error fetching QA test runs:', error);
    return NextResponse.json(
      { success: false, error: 'QA test metrikleri alınırken hata oluştu.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json(
      { success: false, error: auth.error || 'Admin yetkisi gereklidir.' },
      { status: auth.status }
    );
  }

  try {
    const body = (await request.json().catch(() => ({}))) as TriggerQaRunDto;
    const newRun = await QaDb.triggerTestRun(body);

    return NextResponse.json({
      success: true,
      message: 'Yeni canlı QA test koşusu başarıyla tamamlandı.',
      data: newRun,
    });
  } catch (error: any) {
    console.error('Error triggering QA run:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'QA testi başlatılırken hata oluştu.' },
      { status: 500 }
    );
  }
}
