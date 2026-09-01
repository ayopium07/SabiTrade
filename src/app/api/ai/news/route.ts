import { NextRequest, NextResponse } from 'next/server';
import { resolveCompanyLogo } from '@/lib/companyLogos';

export const dynamic = 'force-dynamic';

// In-memory cache for ultra-fast sub-50ms responses
// Key: cache_latest OR cache_YYYY-MM-DD
const newsCache = new Map<string, { timestamp: number; news: any[] }>();
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes TTL

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetDate = searchParams.get('date'); // Format: YYYY-MM-DD or DD/MM/YYYY
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    let cacheKey = 'cache_latest';
    let formattedDateQuery = '';

    if (targetDate && targetDate.trim() !== '') {
      // Normalize targetDate to YYYY-MM-DD if in DD/MM/YYYY
      let isoDate = targetDate.trim();
      if (isoDate.includes('/')) {
        const parts = isoDate.split('/');
        if (parts.length === 3) {
          // DD/MM/YYYY -> YYYY-MM-DD
          isoDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
        }
      }
      cacheKey = `cache_${isoDate}`;
      formattedDateQuery = isoDate;
    }

    // Check in-memory cache first for instant sub-50ms speed
    const cachedEntry = newsCache.get(cacheKey);
    if (cachedEntry && (Date.now() - cachedEntry.timestamp < CACHE_TTL_MS)) {
      return NextResponse.json({ news: cachedEntry.news, source: 'cache' }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        }
      });
    }

    const rawItems: Array<{ title: string; description: string; pubDate: string; source: string; link?: string }> = [];

    if (formattedDateQuery) {
      // 1. Target date provided: Query Google News RSS for live historical news matching that date range
      const startDate = new Date(formattedDateQuery);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2); // 2-day window

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const googleNewsRssUrl = `https://news.google.com/rss/search?q=Nigeria+market+OR+economy+OR+stocks+after:${startStr}+before:${endStr}&hl=en-NG&gl=NG&ceid=NG:en`;

      try {
        const res = await fetch(googleNewsRssUrl, {
          cache: 'no-store',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'application/xml, text/xml, */*'
          },
          signal: AbortSignal.timeout(6000)
        });

        if (res.ok) {
          const xml = await res.text();
          const itemRegex = /<item>([\s\S]*?)<\/item>/g;
          let match;
          let count = 0;

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

          while ((match = itemRegex.exec(xml)) !== null && count < 10) {
            const itemContent = match[1];
            const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
            const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
            const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/);

            if (titleMatch) {
              rawItems.push({
                title: cleanText(titleMatch[1]),
                description: descMatch ? cleanText(descMatch[1]) : '',
                pubDate: dateMatch ? cleanText(dateMatch[1]) : new Date(formattedDateQuery).toUTCString(),
                source: sourceMatch ? cleanText(sourceMatch[1]) : 'Financial News'
              });
              count++;
            }
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch Google News RSS for date ${formattedDateQuery}:`, e);
      }
    }

    // 2. Fetch latest live news feeds from Nairametrics, Punch, Premium Times, BusinessDay, and Vanguard
    if (rawItems.length === 0) {
      const feeds = [
        { url: 'https://nairametrics.com/feed/', source: 'Nairametrics' },
        { url: 'https://punchng.com/category/business/feed/', source: 'Punch Business' },
        { url: 'https://www.premiumtimesng.com/category/business/feed/', source: 'Premium Times' },
        { url: 'https://businessday.ng/feed/', source: 'BusinessDay' },
        { url: 'https://www.vanguardngr.com/category/business/feed/', source: 'Vanguard Business' }
      ];

      const fetchPromises = feeds.map(async (feed) => {
        try {
          const res = await fetch(feed.url, {
            cache: 'no-store',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Accept': 'application/xml, text/xml, */*'
            },
            signal: AbortSignal.timeout(5000)
          });
          if (res.ok) {
            const xml = await res.text();
            const itemRegex = /<item>([\s\S]*?)<\/item>/g;
            let match;
            let feedCount = 0;
            const items = [];

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

            while ((match = itemRegex.exec(xml)) !== null && feedCount < 3) {
              const itemContent = match[1];
              const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
              const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
              const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

              if (titleMatch) {
                items.push({
                  title: cleanText(titleMatch[1]),
                  description: descMatch ? cleanText(descMatch[1]) : '',
                  pubDate: dateMatch ? cleanText(dateMatch[1]) : new Date().toUTCString(),
                  source: feed.source
                });
                feedCount++;
              }
            }
            return items;
          }
        } catch (e) {
          console.warn(`Failed to fetch live RSS feed from ${feed.url}:`, e);
        }
        return [];
      });

      const results = await Promise.all(fetchPromises);
      results.forEach(items => {
        rawItems.push(...items);
      });
    }

    // High quality deterministic Unsplash stock photos mapped to drivers as fallback background
    const driverImages: Record<string, string> = {
      'Earnings Beat': 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=400&q=80',
      'Policy Change': 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=400&q=80',
      'Macro Event': 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=400&q=80',
      'Dividend Payout': 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=400&q=80',
      'Inflation Surge': 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80',
      'Regulatory Approval': 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80',
    };
    const defaultImage = 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80';

    let parsedNews: any[] = [];
    let apiCallSucceeded = false;

    // 3. Ask Gemini to enrich live raw news items with EquityStack fields
    if (apiKey && apiKey.trim() !== '' && rawItems.length > 0) {
      const geminiPrompt = `You are a financial news intelligence analyst for EquityStack.
I have a list of raw live Nigerian business news stories fetched from real-time outlets.
Your job is to rewrite these stories into full, multi-paragraph articles for retail investors, adhering to a strict, professional financial analyst tone.
Simplify complex jargon where necessary, and enrich them with EquityStack-specific fields.

CRITICAL INSTRUCTIONS FOR TRUTHFULNESS & FACTUAL ACCURACY:
1. DO NOT make up any facts, figures, dates, or names. You must rely ONLY on the details explicitly mentioned in the raw news stories below.
2. Under no circumstances should you hallucinate or alter any prices, financial metrics, or statistics.

Raw News Stories:
${JSON.stringify(rawItems, null, 2)}

Output Requirements:
Return a JSON array of objects. Each object MUST match this structure:
{
  "id": string (unique identifier like "news-live-1", "news-live-2"...),
  "source": string (the news source provided or a reputable Nigerian financial paper),
  "author": string (generate a realistic sounding name for a financial journalist),
  "date": string (ISO date string YYYY-MM-DD matching the publication date),
  "timeAgo": string (e.g. "2h ago", "12h ago", or "1d ago" relative to publication time),
  "originalHeadline": string (the headline of the story),
  "aiSummary": string (a highly simplified, clear 2-sentence summary),
  "fullContent": string (a comprehensive 3-4 paragraph article based on the news, strictly keeping a professional financial analyst tone. Use \\n\\n for paragraph breaks.),
  "whyItMatters": string (1 sentence explaining why this is important to a retail investor),
  "implications": string (1 sentence explaining the future outlook/implication for the stock market or economy),
  "keyDriver": string (must be one of: "Earnings Beat", "Policy Change", "Macro Event", "Dividend Payout", "Inflation Surge", "Regulatory Approval"),
  "affectedStocks": array of strings (must only contain tickers from this exact list: ["DANGCEM", "MTNN", "ZENITHBANK", "GTCO", "SEPLAT", "BUAFOODS", "ACCESSCORP", "NESTLE", "OANDO", "UBA", "AIRTELAFRI", "PRESCO", "TRANSCORP", "TOTAL", "FBNH"]. If no tickers are affected, return []),
  "marketImpact": string (must be one of: "Positive", "Negative", "Neutral"),
  "category": string (must be one of: "All News", "Stock Market", "Economy", "Global News")
}

Return ONLY valid JSON. Do not include markdown code block wrappers.`;

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
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
          if (Array.isArray(parsedNews) && parsedNews.length > 0) {
            apiCallSucceeded = true;
          }
        }
      } catch (e) {
        console.warn('Failed to call Gemini News API, using direct raw parsing:', e);
      }
    }

    // 4. Fallback: Parse rawItems directly if Gemini is unavailable
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

        const pubDateObj = new Date(item.pubDate);
        const isoDate = !isNaN(pubDateObj.getTime()) ? pubDateObj.toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        return {
          id: `news-live-${index + 1}`,
          source: item.source,
          author: 'Market Reporter',
          date: isoDate,
          timeAgo: 'Recently',
          originalHeadline: title,
          aiSummary: description.slice(0, 160) + (description.length > 160 ? '...' : ''),
          fullContent: `${description}\n\nThis live report highlights ongoing shifts in domestic commercial activities. Industry watchers emphasize monitoring volume patterns and upcoming regulatory announcements for clearer guidance on long-term trends.`,
          whyItMatters: 'Direct real-time insight into Nigerian economic and corporate developments.',
          implications: 'Subsequent trading activity will confirm market direction over coming sessions.',
          keyDriver,
          affectedStocks: [],
          marketImpact,
          category: 'All News'
        };
      });
    }

    // 5. Inject company logos & format final objects
    const enrichedNews = parsedNews.map((item: any, idx: number) => {
      const driver = item.keyDriver || 'Macro Event';
      let category = item.category || 'All News';

      const validCategories = ['All News', 'Stock Market', 'Economy', 'Global News'];
      const matched = validCategories.find(c => c.toLowerCase() === category.toString().trim().toLowerCase());
      category = matched || 'All News';

      // Detect company logo
      const logoRes = resolveCompanyLogo(item.affectedStocks, item.originalHeadline, item.fullContent);

      return {
        ...item,
        keyDriver: driver,
        category,
        companyLogoUrl: logoRes.logoUrl,
        matchedCompany: logoRes.matchedCompany,
        // If company logo exists, set company logo or keep high quality image
        imageUrl: logoRes.logoUrl || item.imageUrl || driverImages[driver] || defaultImage,
        commentsCount: typeof item.commentsCount === 'number' ? item.commentsCount : (idx % 7) + 4,
        affectedStocks: Array.isArray(item.affectedStocks) ? item.affectedStocks : [],
        marketImpact: ['Positive', 'Negative', 'Neutral'].includes(item.marketImpact) ? item.marketImpact : 'Neutral',
      };
    });

    // Store in cache for sub-50ms subsequent requests
    newsCache.set(cacheKey, { timestamp: Date.now(), news: enrichedNews });

    return NextResponse.json({ news: enrichedNews, source: 'live' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });

  } catch (error: any) {
    console.error('Live news route handler error:', error);
    return NextResponse.json({ news: [], error: error.message }, { status: 500 });
  }
}
