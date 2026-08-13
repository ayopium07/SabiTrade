import { NextResponse } from 'next/server';
import { fetchEodhdAllShareIndex, fetchEodhdHistoricalPrices } from '@/lib/eodhd';
import { ngxIndexData } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '12 month';
    const from = searchParams.get('from') || undefined;
    const to = searchParams.get('to') || undefined;

    const asiData = await fetchEodhdAllShareIndex();
    return NextResponse.json({
      success: true,
      source: 'EODHD',
      ...asiData,
    });
  } catch (error: any) {
    console.error('Error fetching ASI from EODHD:', error.message || error);
    return NextResponse.json({
      success: false,
      source: 'fallback',
      ...ngxIndexData,
      error: error.message || 'Failed to fetch ASI from EODHD',
    });
  }
}
