import { NextRequest, NextResponse } from 'next/server';
import { OrganisationsDb } from '@/lib/organisations-db';

async function handlePortfolioUpdate(
  request: NextRequest,
  paramsPromise: Promise<{ id: string }>
) {
  try {
    const { id } = await paramsPromise;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Host ID zorunludur' },
        { status: 400 }
      );
    }

    const updatedHost = await OrganisationsDb.updateHostPortfolio(id, body);

    if (!updatedHost) {
      return NextResponse.json(
        { success: false, message: 'Host bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedHost, { status: 200 });
  } catch (error: any) {
    console.error('Error updating host portfolio:', error);
    return NextResponse.json(
      { success: false, message: 'Portföy güncellenemedi', error: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handlePortfolioUpdate(request, params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handlePortfolioUpdate(request, params);
}
