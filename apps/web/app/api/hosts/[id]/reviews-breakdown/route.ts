import { NextRequest, NextResponse } from 'next/server';
import { ProviderReviewsDb } from '@/lib/provider-reviews-db';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, message: 'Host ID gerekli' }, { status: 400 });
    }

    // Try NestJS API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/hosts/${id}/reviews-breakdown`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch {}

    // Fallback to local memory DB
    const breakdown = ProviderReviewsDb.getReviewsBreakdown(id);
    return NextResponse.json(breakdown);
  } catch (error: any) {
    console.error('Error fetching host reviews breakdown:', error);
    return NextResponse.json(
      { success: false, message: 'Yorumlar getirilemedi', error: error.message },
      { status: 500 }
    );
  }
}
