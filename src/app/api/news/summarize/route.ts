import { NextResponse } from 'next/server';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // 1. In a real scenario, you'd fetch live news from a financial API (e.g., Bloomberg, NGX API)
    // For this example, we'll use some mock headlines.
    const mockHeadlines = [
      "NGX ASI rises by 1.2% as banking stocks rally",
      "Inflation hits 28.9%, CBN considers further rate hikes",
      "Dangote Cement announces record profits for Q3",
      "MTN Nigeria expands 5G coverage to 10 more states"
    ];

    const prompt = `Here are the latest news headlines affecting the Nigerian economy: 
${mockHeadlines.join('\n')}

Write a single, concise paragraph summarizing the overall market sentiment based on this news. 
Write it in a simple, relatable Nigerian tone.`;

    // 2. Generate the summary using the AI model
    const { text } = await generateText({
      model: google('gemini-3.5-flash') as any,
      prompt: prompt,
    });

    let summary = null;
    try {
      // 3. Save the summary to the database
      summary = await prisma.aISummary.create({
        data: {
          content: text,
          type: 'NEWS',
        },
      });
    } catch (dbError) {
      console.warn('DB offline, returning AI summary directly for demo:', dbError);
      summary = {
        id: 'demo-summary-' + Date.now(),
        content: text,
        type: 'NEWS',
        createdAt: new Date().toISOString()
      };
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating news summary (returning mock fallback for demo):', error);
    return NextResponse.json({
      summary: {
        id: 'demo-summary-' + Date.now(),
        content: "Market dey bubble slightly as banking sector stocks pull weight, but inflation still dey pressure consumer pocket. Investors dey watch out for policy decisions from CBN.",
        type: 'NEWS',
        createdAt: new Date().toISOString()
      }
    });
  }
}
