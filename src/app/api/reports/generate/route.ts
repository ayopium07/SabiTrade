import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json().catch(() => ({ userId: 'demo-user-id' }));

    let portfolio = null;
    try {
      // 1. Fetch user's portfolio and recent trades
      portfolio = await prisma.portfolio.findFirst({
        where: { userId: userId || 'demo-user-id' },
        include: {
          user: {
            include: { trades: true }
          }
        }
      });
    } catch (dbError) {
      console.warn('DB offline, using mock portfolio for report generation:', dbError);
    }

    if (!portfolio) {
      // Return a simulated portfolio structure
      portfolio = {
        cash: 1000000.0,
        user: {
          id: userId || 'demo-user-id',
          name: 'Demo Trader',
          trades: [
            { id: '1', symbol: 'ZENITHBANK', quantity: 1000, price: 35.0, type: 'BUY' },
            { id: '2', symbol: 'GTCO', quantity: 500, price: 42.0, type: 'BUY' }
          ]
        }
      };
    }

    // 2. Generate a prompt based on their data
    const prompt = `Analyze this simulated portfolio and trade history for a Nigerian stock market trader.
Cash Balance: ₦${portfolio.cash}
Total Trades: ${portfolio.user.trades?.length || 0}

Provide a 2-paragraph personalized performance report. 
Use a friendly, simple Nigerian tone. Give them some general advice on risk management.`;

    let textResponse = '';
    try {
      // 3. Generate the report using the AI model
      const { text } = await generateText({
        model: google('gemini-3.5-flash') as any,
        prompt: prompt,
      });
      textResponse = text;
    } catch (aiError) {
      console.error('AI generation failed during report creation:', aiError);
      textResponse = `Oga, your portfolio dey stand gidigba at ₦${portfolio.cash}! You don execute like ${portfolio.user.trades?.length || 0} trades. The way market dey go, banking sector stocks like Zenith and GTCO are trying, but try to spread your eggs. Put some cash for industrial goods to shield your portfolio from CBN rate hikes. Keep eye on dividend yield so you can enjoy steady passive income!`;
    }

    let summary = null;
    try {
      // 4. Save the report to the database
      summary = await prisma.aISummary.create({
        data: {
          userId: userId || 'demo-user-id',
          content: textResponse,
          type: 'REPORT',
        },
      });
    } catch (dbSaveError) {
      console.warn('DB offline, returning generated report directly for demo:', dbSaveError);
      summary = {
        id: 'demo-report-' + Date.now(),
        userId: userId || 'demo-user-id',
        content: textResponse,
        type: 'REPORT',
        createdAt: new Date().toISOString()
      };
    }

    return NextResponse.json({ report: summary });
  } catch (error) {
    console.error('Error generating report (returning mock fallback for demo):', error);
    return NextResponse.json({
      report: {
        id: 'demo-report-' + Date.now(),
        userId: 'demo-user-id',
        content: "Abeg, market analysis dey run smoothly. Your cash balance is ₦1,000,000. Recommend scaling into defensive sectors like Consumer Goods.",
        type: 'REPORT',
        createdAt: new Date().toISOString()
      }
    });
  }
}
