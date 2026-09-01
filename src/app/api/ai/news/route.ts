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
      let isoDate = targetDate.trim();
      if (isoDate.includes('/')) {
        const parts = isoDate.split('/');
        if (parts.length === 3) {
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

    if (formattedDateQuery) {
      // 1. Target date provided: Query Google News RSS for live historical stock/market news
      const startDate = new Date(formattedDateQuery);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2); // 2-day window

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const googleNewsRssUrl = `https://news.google.com/rss/search?q=Nigeria+stocks+OR+market+OR+economy+OR+global+markets+after:${startStr}+before:${endStr}&hl=en-NG&gl=NG&ceid=NG:en`;

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

          while ((match = itemRegex.exec(xml)) !== null && count < 12) {
            const itemContent = match[1];
            const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
            const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
            const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
            const sourceMatch = itemContent.match(/<source[^>]*>([\s\S]*?)<\/source>/);
            const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);

            if (titleMatch) {
              rawItems.push({
                title: cleanText(titleMatch[1]),
                description: descMatch ? cleanText(descMatch[1]) : '',
                pubDate: dateMatch ? cleanText(dateMatch[1]) : new Date(formattedDateQuery).toUTCString(),
                source: sourceMatch ? cleanText(sourceMatch[1]) : 'Financial Press',
                link: linkMatch ? cleanText(linkMatch[1]) : ''
              });
              count++;
            }
          }
        }
      } catch (e) {
        console.warn(`Failed to fetch Google News RSS for date ${formattedDateQuery}:`, e);
      }
    }

    // 2. Fetch latest live news feeds from Nairametrics, Punch, Premium Times, BusinessDay, Vanguard, and Global Markets RSS
    if (rawItems.length === 0) {
      const feeds = [
        { url: 'https://nairametrics.com/feed/', source: 'Nairametrics' },
        { url: 'https://punchng.com/category/business/feed/', source: 'Punch Business' },
        { url: 'https://www.premiumtimesng.com/category/business/feed/', source: 'Premium Times' },
        { url: 'https://businessday.ng/feed/', source: 'BusinessDay' },
        { url: 'https://www.vanguardngr.com/category/business/feed/', source: 'Vanguard Business' },
        { url: 'https://news.google.com/rss/search?q=Global+stocks+OR+SP500+OR+Federal+Reserve+OR+interest+rates+OR+commodities&hl=en-US&gl=US&ceid=US:en', source: 'Global Markets' }
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

            while ((match = itemRegex.exec(xml)) !== null && feedCount < 3) {
              const itemContent = match[1];
              const titleMatch = itemContent.match(/<title>([\s\S]*?)<\/title>/);
              const descMatch = itemContent.match(/<description>([\s\S]*?)<\/description>/);
              const dateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
              const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/);

              if (titleMatch) {
                items.push({
                  title: cleanText(titleMatch[1]),
                  description: descMatch ? cleanText(descMatch[1]) : '',
                  pubDate: dateMatch ? cleanText(dateMatch[1]) : new Date().toUTCString(),
                  source: feed.source,
                  link: linkMatch ? cleanText(linkMatch[1]) : ''
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

    // 3. Ask Gemini to enrich live raw news items into deep, educational financial reports (Nairametrics style)
    if (apiKey && apiKey.trim() !== '' && rawItems.length > 0) {
      const geminiPrompt = `You are a senior financial analyst, educator, and economic journalist for EquityStack.
I have a list of raw live news stories. Your job is to write deep, highly educational, professional financial reports (similar to in-depth Nairametrics, Wall Street Journal, or Bloomberg analysis) based on these stories.

EDUCATIONAL ARTICLE WRITING REQUIREMENTS:
1. Every article must be comprehensive, thorough, and highly educational (500 to 800+ words).
2. Structure each article into clear, distinct sections using markdown headings:
   - ### Introduction & Overview
   - ### What the Data is Saying
   - ### Corporate & Stock Performance Impact
   - ### 🎓 Investor Educational Concept
   - ### Key Takeaways for Retail Investors
3. In the "🎓 Investor Educational Concept" section, explicitly explain an underlying financial term or mechanism mentioned in the story (e.g. *What is constant price GDP?*, *How do interest rate hikes boost bank net interest margins?*, *Understanding FX debt devaluation*, *What EBITDA margin tells us about cash efficiency*).
4. Translate complex economic statistics into clear, relatable prose for retail investors without losing 100% factual accuracy.

CRITICAL INSTRUCTIONS FOR TRUTHFULNESS & FACTUAL ACCURACY:
1. DO NOT make up any facts, figures, dates, or names. Rely ONLY on the details explicitly mentioned in the raw news stories below.
2. Under no circumstances should you alter any prices, financial metrics, or statistics.

Raw News Stories:
${JSON.stringify(rawItems, null, 2)}

Output Requirements:
Return a JSON array of objects. Each object MUST match this structure:
{
  "id": string (unique identifier like "news-live-1", "news-live-2"...),
  "source": string (the news source provided or a reputable financial paper),
  "author": string (generate a realistic sounding name for a financial journalist),
  "date": string (ISO date string YYYY-MM-DD matching the publication date),
  "timeAgo": string (e.g. "2h ago", "12h ago", or "1d ago" relative to publication time),
  "link": string (preserve original source link if available, or empty string),
  "originalHeadline": string (the headline of the story),
  "aiSummary": string (a concise 2-sentence executive summary),
  "fullContent": string (a deep, comprehensive 5 to 7 section detailed educational article formatted with ### section headers including "### 🎓 Investor Educational Concept". Use \\n\\n between paragraphs and sections.),
  "whyItMatters": string (2 to 3 detailed sentences explaining exactly why retail stock investors should care and how to position their portfolio),
  "implications": string (2 to 3 detailed sentences explaining the future market outlook, interest rate trajectory, and risk factors),
  "educationalConcept": string (a concise 2-sentence breakdown of the core financial literacy concept taught in this story),
  "keyDriver": string (must be one of: "Earnings Beat", "Policy Change", "Macro Event", "Dividend Payout", "Inflation Surge", "Regulatory Approval"),
  "affectedStocks": array of strings (must only contain tickers from this exact list: ["DANGCEM", "MTNN", "ZENITHBANK", "GTCO", "SEPLAT", "BUAFOODS", "ACCESSCORP", "NESTLE", "OANDO", "UBA", "AIRTELAFRI", "PRESCO", "TRANSCORP", "TOTAL", "FBNH"]. If no tickers are affected, return []),
  "marketImpact": string (must be one of: "Positive", "Negative", "Neutral"),
  "category": string (must be one of: "Stock Market", "Economy", "Global Markets", "Corporate & Industry")
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

        let category = 'Stock Market';
        if (/fed|us|global|nasdaq|s&p|dollar|oil|world/i.test(title)) category = 'Global Markets';
        else if (/cbn|inflation|gdp|economy|tax|naira/i.test(title)) category = 'Economy';
        else if (/bank|dangote|seplat|mtn|telecom|energy/i.test(title)) category = 'Corporate & Industry';

        return {
          id: `news-live-${index + 1}`,
          source: item.source,
          author: 'Market Reporter',
          date: isoDate,
          timeAgo: 'Recently',
          link: item.link || '',
          originalHeadline: title,
          aiSummary: description.slice(0, 160) + (description.length > 160 ? '...' : ''),
          fullContent: `${description}\n\nThis stock-related development comes at a pivotal time for financial markets. Analysts suggest that equity investors are re-evaluating risk exposure across domestic and international assets in response to ongoing monetary policy adjustments and earnings announcements.\n\nInstitutional money flows indicate selective accumulation in high-yielding sectors, while defensive stocks are gaining traction among retail portfolios seeking inflation hedges. Market participants are advised to monitor trade volumes closely to validate price movement.`,
          whyItMatters: 'Direct impact on stock valuations, sector sentiment, and investor portfolio positioning.',
          implications: 'Subsequent trading sessions will determine whether price momentum expands into broader equity indices.',
          keyDriver,
          affectedStocks: [],
          marketImpact,
          category
        };
      });
    }

    // 5. Inject company logos & format final objects
    const enrichedNews = parsedNews.map((item: any, idx: number) => {
      const driver = item.keyDriver || 'Macro Event';
      let category = item.category || 'Stock Market';

      const validCategories = ['Stock Market', 'Economy', 'Global Markets', 'Corporate & Industry'];
      const matched = validCategories.find(c => c.toLowerCase() === category.toString().trim().toLowerCase());
      category = matched || 'Stock Market';

      // Detect company logo
      const logoRes = resolveCompanyLogo(item.affectedStocks, item.originalHeadline, item.fullContent);

      return {
        ...item,
        keyDriver: driver,
        category,
        companyLogoUrl: logoRes.logoUrl,
        matchedCompany: logoRes.matchedCompany,
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
