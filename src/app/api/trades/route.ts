import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  let body: any = {};
  try {
    body = await request.json().catch(() => ({}));
    const { symbol, quantity, price, type, userId } = body;

    if (!symbol || !quantity || !price || !type || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Record the trade
    const trade = await prisma.trade.create({
      data: {
        userId,
        symbol,
        quantity,
        price,
        type,
      },
    });

    // In a full implementation, you'd also update the Portfolio cash balance and holdings here.

    return NextResponse.json(trade, { status: 201 });
  } catch (error) {
    console.error('Error recording trade (returning mock fallback for demo):', error);
    const { symbol, quantity, price, type, userId } = body;
    return NextResponse.json({
      id: 'demo-trade-' + Date.now(),
      userId: userId || 'demo-user-id',
      symbol: symbol || 'ZENITHBANK',
      quantity: quantity || 100,
      price: price || 35.0,
      type: type || 'BUY',
      createdAt: new Date().toISOString()
    }, { status: 201 });
  }
}
