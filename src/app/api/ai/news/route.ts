import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured.' },
        { status: 500 }
      );
    }

    // 1. Fetch latest business news from Punch Business RSS feed (highly reliable & public)
    let feedXml = '';
    try {
      const res = await fetch('https://punchng.com/category/business/feed/', {
        next: { revalidate: 900 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (res.ok) {
        feedXml = await res.text();
      }
    } catch (e) {
      console.warn('Failed to fetch live RSS feed, falling back to local simulation:', e);
    }

    // 2. Parse RSS items
    const rawItems: Array<{ title: string; description: string; pubDate: string; source: string }> = [];
    
    if (feedXml) {
      const itemRegex = /<item>([\s\S]*?)<\/item>/g;
      let match;
      while ((match = itemRegex.exec(feedXml)) !== null && rawItems.length < 6) {
        const itemContent = match[1];
        
        // Strip CDATA and HTML tags helper
        const cleanText = (text: string) => {
          return text
            .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
            .replace(/<[^>]*>/g, '')
            .trim();
        };

        const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
        const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
        const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

        if (titleMatch) {
          rawItems.push({
            title: cleanText(titleMatch[1]),
            description: descMatch ? cleanText(descMatch[1]) : '',
            pubDate: dateMatch ? cleanText(dateMatch[1]) : new Date().toUTCString(),
            source: 'Punch Business'
          });
        }
      }
    }

    // Fallback if feed was empty/failed
    if (rawItems.length === 0) {
      rawItems.push(
        {
          title: 'Nigeria Inflation Rises as FX Pressure Continues on Domestic Markets',
          description: 'The consumer price index records another uptick as transport and food costs push household budgets to the limit across major urban centers.',
          pubDate: new Date().toUTCString(),
          source: 'Nairametrics'
        },
        {
          title: 'Zenith Bank and GTCO Trade High Volumes on NGX Banking Index Rally',
          description: 'Tier-1 commercial bank shares saw sustained buying pressure as foreign and retail accounts positioned for interim dividend payouts.',
          pubDate: new Date().toUTCString(),
          source: 'BusinessDay'
        },
        {
          title: 'Oando NAOC Acquisition Finalized Boosting Energy Sector Outlook',
          description: 'The regulatory approval on Agip asset transfer has spurred fresh buying momentum for domestic oil and gas majors listed on the exchange.',
          pubDate: new Date().toUTCString(),
          source: 'PremiumTimes'
        }
      );
    }

    // 3. Ask Gemini to enrich this news with EquityStack tags, impact, and simplified summaries
    const geminiPrompt = `You are a financial news intelligence analyst for EquityStack.
I have a list of raw Nigerian business news headlines and descriptions.
Analyze these raw stories and output a single JSON array of objects representing EquityStack news cards.

Raw News Stories:
${JSON.stringify(rawItems, null, 2)}

Output Requirements:
Return a JSON array of objects. Each object MUST match this structure:
{
  "id": string (unique identifier like "news-feed-1", "news-feed-2"...),
  "source": string (the news source provided or a reputable Nigerian financial paper),
  "timeAgo": string (e.g. "2h ago", "12h ago", or "1d ago" relative to the current time),
  "originalHeadline": string (the headline of the story),
  "aiSummary": string (a highly simplified, clear 2-sentence summary translating any financial jargon into plain English),
  "whyItMatters": string (1 sentence explaining why this is important to a retail investor),
  "implications": string (1 sentence explaining the future outlook/implication for the stock market or economy),
  "keyDriver": string (must be one of: "Earnings Beat", "Policy Change", "Macro Event", "Dividend Payout", "Inflation Surge", "Regulatory Approval"),
  "affectedStocks": array of strings (must only contain tickers from this exact list: ["DANGCEM", "MTNN", "ZENITHBANK", "GTCO", "SEPLAT", "BUAFOODS", "ACCESSCORP", "NESTLE", "OANDO", "UBA"]. If no tickers are affected, return []),
  "marketImpact": string (must be one of: "Positive", "Negative", "Neutral"),
  "category": string (must be one of: "Featured", "Breaking", "Most Popular", "Cryptocurrency")
}

Return ONLY valid JSON. Do not include markdown code block wrappers (e.g., \`\`\`json ... \`\`\`). Do not include any text before or after the JSON array.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: geminiPrompt }] }],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: 'application/json',
          }
        })
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error('Gemini News API Error:', errText);
      return NextResponse.json(
        { error: 'Failed to enrich news with AI.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    
    // Clean any accidental markdown wraps
    replyText = replyText.trim();
    if (replyText.startsWith('```')) {
      replyText = replyText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
    }

    const enrichedNews = JSON.parse(replyText);

    return NextResponse.json({ news: enrichedNews });
  } catch (error: any) {
    console.error('News route handler failed:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
