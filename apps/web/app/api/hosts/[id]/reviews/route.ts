import { NextRequest, NextResponse } from 'next/server';
import { ProviderReviewsDb } from '@/lib/provider-reviews-db';
import { CreateHostReviewDto } from '@mobility-nexus/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body: CreateHostReviewDto = await request.json();

    if (!id || !body.schoolName || !body.metrics) {
      return NextResponse.json(
        { success: false, message: 'Okul adı ve 5 kriterli değerlendirme puanları zorunludur' },
        { status: 400 }
      );
    }

    // Try NestJS API first
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      const res = await fetch(`${API_BASE_URL}/hosts/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const data = await res.json();
        // Also persist locally for fast responsiveness
        ProviderReviewsDb.addReview(id, body);
        return NextResponse.json(data, { status: 201 });
      }
    } catch {}

    // Fallback to local memory DB
    const newReview = ProviderReviewsDb.addReview(id, body);
    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting host review:', error);
    return NextResponse.json(
      { success: false, message: 'Değerlendirme kaydedilemedi', error: error.message },
      { status: 500 }
    );
  }
}
