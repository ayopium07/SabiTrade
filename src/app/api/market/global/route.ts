import { NextResponse } from 'next/server';
import { fetchEodhdGlobalIndices, getEodhdApiKey } from '@/lib/eodhd';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    if (getEodhdApiKey()) {
      const indices = await fetchEodhdGlobalIndices();
      return NextResponse.json({
        success: true,
        source: 'EODHD Live',
        indices,
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
      });
    }

    throw new Error('EODHD_API_KEY not configured');
  } catch (error: any) {
    console.error('Error fetching global indices:', error.message || error);
    // Fallback static list if network or key fails
    return NextResponse.json({
      success: false,
      source: 'fallback',
      indices: [
        { id: 'SPX', name: 'S&P 500', symbol: 'GSPC.INDX', flag: '🇺🇸', price: '7,799', rawPrice: 7799, change: 0.65, changeAmount: 50.5, selected: false },
        { id: 'DJI', name: 'DOW JONES', symbol: 'DJI.INDX', flag: '🇺🇸', price: '53,840', rawPrice: 53840, change: 0.13, changeAmount: 69.7, selected: false },
        { id: 'NDX', name: 'NASDAQ', symbol: 'IXIC.INDX', flag: '🇺🇸', price: '26,803', rawPrice: 26803, change: 0.81, changeAmount: 214.5, selected: false },
        { id: 'DAX', name: 'DAX', symbol: 'GDAXI.INDX', flag: '🇩🇪', price: '18,240', rawPrice: 18240, change: 0.28, changeAmount: 51.0, selected: true },
        { id: 'CAC', name: 'CAC 40', symbol: 'FCHI.INDX', flag: '🇫🇷', price: '7,412', rawPrice: 7412, change: 0.22, changeAmount: 16.3, selected: false },
        { id: 'FTSE', name: 'FTSE 100', symbol: 'FTSE.INDX', flag: '🇬🇧', price: '8,510', rawPrice: 8510, change: -0.05, changeAmount: -4.2, selected: true },
      ],
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  }
}
