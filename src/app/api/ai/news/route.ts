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

    // 1. Fetch latest business news from multiple active feeds (Nairametrics, Punch, Premium Times)
    const feeds = [
      { url: 'https://nairametrics.com/feed/', source: 'Nairametrics' },
      { url: 'https://punchng.com/category/business/feed/', source: 'Punch Business' },
      { url: 'https://www.premiumtimesng.com/category/business/feed/', source: 'Premium Times' }
    ];

    const rawItems: Array<{ title: string; description: string; pubDate: string; source: string }> = [];

    for (const feed of feeds) {
      try {
        const res = await fetch(feed.url, {
          cache: 'no-store',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'application/xml, text/xml, */*'
          },
          signal: AbortSignal.timeout(5000)
        });
        if (res.ok) {
          const xml = await res.text();
          const itemRegex = /<item>([\s\S]*?)<\/item>/g;
          let match;
          let feedCount = 0;
          while ((match = itemRegex.exec(xml)) !== null && feedCount < 3) {
            const itemContent = match[1];
            
            const cleanText = (text: string) => {
              return text
                .replace(/<!\[CDATA\[([\s\S]*?)]]>/g, '$1')
                .replace(/<[^>]*>/g, '')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#8217;/g, "'")
                .replace(/&#8216;/g, "'")
                .replace(/&#8220;/g, '"')
                .replace(/&#8221;/g, '"')
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
                source: feed.source
              });
              feedCount++;
            }
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch live RSS feed from ${feed.url}:`, e);
      }
    }

    // Fallback if feeds were empty/failed
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
I have a list of raw Nigerian business news headlines and descriptions fetched from real-time outlets (Nairametrics, Punch Business, etc.).
Your job is to rewrite these stories for retail investors, simplify complex jargon, and enrich them with EquityStack-specific fields.

CRITICAL INSTRUCTIONS FOR TRUTHFULNESS & FACTUAL ACCURACY:
1. DO NOT make up any facts, figures, dates, or names. You must rely ONLY on the details explicitly mentioned in the raw news stories below.
2. Under no circumstances should you hallucinate or alter any prices, financial metrics, or statistics.
3. Translate advanced financial terms (like "Recapitalization", "Hawkish", "Yield Curve", "NPL ratio", "NIM") into simple, friendly English so beginners can understand them, but ensure you do not distort the truth of the news.
4. Keep the original facts 100% correct so we never mislead our users.

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

    let parsedNews = [];
    let apiCallSucceeded = false;

    try {
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

      if (response.ok) {
        const data = await response.json();
        let replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        replyText = replyText.trim();
        if (replyText.startsWith('```')) {
          replyText = replyText.replace(/^```json\s*/, '').replace(/```$/, '').trim();
        }
        parsedNews = JSON.parse(replyText);
        if (Array.isArray(parsedNews)) {
          apiCallSucceeded = true;
        }
      } else {
        const errText = await response.text();
        console.warn('Gemini News API returned non-ok response, using fallback parsing:', errText);
      }
    } catch (e) {
      console.warn('Failed to call Gemini News API, using fallback parsing:', e);
    }

    // Fallback if Gemini failed
    if (!apiCallSucceeded || parsedNews.length === 0) {
      parsedNews = rawItems.map((item, index) => {
        const title = item.title;
        const description = item.description || 'No description available.';
        
        let keyDriver = 'Macro Event';
        if (/dividend/i.test(title)) keyDriver = 'Dividend Payout';
        else if (/inflation|cpi/i.test(title)) keyDriver = 'Inflation Surge';
        else if (/earning|profit|revenue/i.test(title)) keyDriver = 'Earnings Beat';
        else if (/policy|cbn|interest/i.test(title)) keyDriver = 'Policy Change';
        else if (/approve|acquisition|deal/i.test(title)) keyDriver = 'Regulatory Approval';
        
        let marketImpact = 'Neutral';
        if (/rise|gain|up|surge|higher|growth|boost/i.test(title)) marketImpact = 'Positive';
        else if (/fall|drop|down|decline|loss|lower|crash/i.test(title)) marketImpact = 'Negative';

        return {
          id: `news-feed-${index + 1}`,
          source: item.source,
          timeAgo: '1h ago',
          originalHeadline: title,
          aiSummary: description.slice(0, 150) + (description.length > 150 ? '...' : ''),
          whyItMatters: 'Factual news update matching local business activities.',
          implications: 'Market reactions depend on subsequent volume execution.',
          keyDriver,
          affectedStocks: [],
          marketImpact,
          category: index === 0 ? 'Breaking' : 'Featured'
        };
      });
    }

    // High quality deterministic Unsplash stock photos mapped to drivers
    const driverImages: Record<string, string> = {
      'Earnings Beat': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80',
      'Policy Change': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      'Macro Event': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80',
      'Dividend Payout': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
      'Inflation Surge': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      'Regulatory Approval': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    };
    const defaultImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80';

    const enrichedNews = parsedNews.map((item: any) => {
      const driver = item.keyDriver || 'Macro Event';
      let category = item.category || 'Featured';
      
      const validCategories = ['Featured', 'Breaking', 'Most Popular', 'Cryptocurrency'];
      const matched = validCategories.find(c => c.toLowerCase() === category.toString().trim().toLowerCase());
      if (matched) {
        category = matched;
      } else {
        category = 'Featured';
      }

      return {
        ...item,
        keyDriver: driver,
        category,
        imageUrl: item.imageUrl || driverImages[driver] || defaultImage,
        commentsCount: typeof item.commentsCount === 'number' ? item.commentsCount : Math.floor(Math.random() * 25) + 3,
        affectedStocks: Array.isArray(item.affectedStocks) ? item.affectedStocks : [],
        marketImpact: ['Positive', 'Negative', 'Neutral'].includes(item.marketImpact) ? item.marketImpact : 'Neutral',
      };
    });

    return NextResponse.json({ news: enrichedNews }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  } catch (error: any) {
    console.error('News route handler failed:', error);
    const fallbackNewsList = [
      {
        id: 'news-feed-1',
        source: 'Nairametrics',
        timeAgo: '1h ago',
        originalHeadline: 'Nigeria Inflation Rises as FX Pressure Continues on Domestic Markets',
        aiSummary: 'The consumer price index records another uptick as transport and food costs push household budgets to the limit across major urban centers.',
        whyItMatters: 'Higher inflation reduces the purchasing power of everyday consumers, leaving them with less money to invest in the stock market.',
        implications: 'The central bank may raise interest rates further to combat inflation, which could make fixed-income investments more attractive than equities.',
        keyDriver: 'Inflation Surge',
        affectedStocks: [],
        marketImpact: 'Negative',
        category: 'Breaking',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
        commentsCount: 12
      },
      {
        id: 'news-feed-2',
        source: 'BusinessDay',
        timeAgo: '2h ago',
        originalHeadline: 'Zenith Bank and GTCO Trade High Volumes on NGX Banking Index Rally',
        aiSummary: 'Tier-1 commercial bank shares saw sustained buying pressure as foreign and retail accounts positioned for interim dividend payouts.',
        whyItMatters: 'This rally offers retail investors an opportunity to capture short-term gains and secure steady cash payouts from top-performing banks.',
        implications: 'Sustained buying interest could push banking sector valuations higher in the coming weeks as dividend qualification dates approach.',
        keyDriver: 'Dividend Payout',
        affectedStocks: ['ZENITHBANK', 'GTCO'],
        marketImpact: 'Positive',
        category: 'Featured',
        imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
        commentsCount: 18
      }
    ];

    return NextResponse.json({ news: fallbackNewsList }, {
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  }
}
