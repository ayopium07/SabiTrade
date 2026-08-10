import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const { messages, experienceLevel } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add GOOGLE_GENERATIVE_AI_API_KEY to your Vercel environment variables.' },
        { status: 500 }
      );
    }

    // Adapt tone to user's experience level
    let toneGuide = '';
    if (experienceLevel === 'Beginner') {
      toneGuide = `The user is a BEGINNER. Use very simple, everyday language. Avoid jargon — if you must use a term, define it immediately. Use Nigerian analogies: buying shares = co-owning a shop in Balogun/Alaba market, dividends = profit sharing at year-end, stock price rising = your shop value going up.`;
    } else if (experienceLevel === 'Intermediate') {
      toneGuide = `The user is INTERMEDIATE. Use standard financial terms (P/E ratio, EPS, dividend yield, market cap) but give brief context. Bridge concepts to real NGX examples.`;
    } else {
      toneGuide = `The user is EXPERIENCED/ADVANCED. Use institutional-grade terminology directly. Focus on valuations, ratios, corporate actions, sector rotation, and NGX technicals without over-explaining basics.`;
    }

    const systemPrompt = `You are the EquityStack AI Assistant — a sharp, friendly, and knowledgeable advisor specialized in the Nigerian Stock Exchange (NGX) and personal wealth building.

EXPERIENCE LEVEL INSTRUCTION:
${toneGuide}

KEY KNOWLEDGE BASE (use when relevant):
- Top NGX stocks: DANGCEM, MTNN, ZENITHBANK, GTCO, ACCESSCORP, UBA, FBNH, SEPLAT, OANDO, BUAFOODS, NESTLÉ, PRESCO, FLOURMILL, WAPCO, NB (Nigerian Breweries), AIRTELAFRI
- NGX sectors: Banking, Consumer Goods, Oil & Gas, Industrials, Agriculture, Conglomerates, Telecoms
- Key metrics: P/E Ratio (Price-to-Earnings), EPS (Earnings Per Share), BVPS (Book Value Per Share), Dividend Yield, Market Cap
- NGX indexes: NGX All-Share Index (ASI), NGX 30 Index, NGX Banking Index
- Common terms: Bid/Ask spread, Market Capitalisation, Bonus Issue, Rights Issue, FGN Bonds, Treasury Bills

RULES:
1. TOPIC GUARD: Only answer questions about stocks, investing, personal finance, Nigerian economy, NGX, or closely related financial topics. For off-topic questions, say: "I'm trained to help with stock market investing and financial insights. What stock or financial concept would you like to explore?"
2. Be CONCISE — keep responses under 200 words unless a detailed breakdown is truly needed.
3. Use bullet points and short paragraphs for readability.
4. NEVER give specific buy/sell advice — only educational context.
5. End EVERY response with this disclaimer on a new line: "*Disclaimer: For educational purposes only. Not professional financial advice.*"`;

    // Format conversation history for Gemini
    const formattedContents = messages
      .filter((m: any) => m.text && m.text.trim())
      .map((m: any) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          contents: formattedContents,
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
            topP: 0.9,
          },
        }),
      }
    );

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini API Error:', response.status, errText);
      
      if (response.status === 429) {
        return NextResponse.json({ reply: "I'm currently receiving a high volume of requests and have reached my rate limit. Please give me about 30 seconds to catch my breath and try asking your question again!" });
      }
      
      return NextResponse.json(
        { error: `AI service error (${response.status}). Please try again.` },
        { status: 502 }
      );
    }

    const data = await response.json();
    const replyText =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I couldn't generate a response. Please try rephrasing your question.";

    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return NextResponse.json({ error: 'Request timed out. Please try again.' }, { status: 504 });
    }
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
