import { NextResponse } from 'next/server';
import { ngxStocks, ngxIndexData, Stock } from '@/lib/mockData';

export const dynamic = 'force-dynamic';

// Cache market data in memory for 10 minutes (600,000 ms)
let cachedData: { indexData: typeof ngxIndexData; stocks: Stock[] } | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 600000; // 10 minutes

export async function GET() {
  const now = Date.now();
  
  if (cachedData && (now - lastFetchTime < CACHE_DURATION)) {
    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  }

  try {
    // 1. Fetch sectors from ngx-listed-companies
    const dirRes = await fetch('https://ngxpulse.ng/ngx-listed-companies', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      },
      cache: 'no-store'
    });
    
    const sectorMap: Record<string, string> = {};
    if (dirRes.ok) {
      const dirHtml = await dirRes.text();
      const dirTrRegex = /<tr>([\s\S]*?)<\/tr>/g;
      let dirMatch;
      while ((dirMatch = dirTrRegex.exec(dirHtml)) !== null) {
        const row = dirMatch[1];
        const tickerMatch = row.match(/<td class="col-ticker">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
        const sectorMatch = row.match(/<td class="col-sector">([\s\S]*?)<\/td>/);
        if (tickerMatch && sectorMatch) {
          sectorMap[tickerMatch[1].trim()] = sectorMatch[1].trim();
        }
      }
    }

    // 2. Fetch prices & ASI from home page
    const homeRes = await fetch('https://ngxpulse.ng/', {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
      },
      cache: 'no-store'
    });

    if (!homeRes.ok) {
      throw new Error(`Failed to fetch homepage: ${homeRes.status}`);
    }

    const homeHtml = await homeRes.text();

    // 3. Parse ASI summary
    let indexData = { ...ngxIndexData };
    const summaryMatch = homeHtml.match(/The Nigerian Exchange ([\s\S]*?) As of ([\s\S]*?)\./);
    if (summaryMatch) {
      const text = summaryMatch[1];
      const asiMatch = text.match(/All-Share Index (?:shed|gained|rose|fell) ([\d,.-]+) points \(([\d,.-]+)%\) to close at ([\d,.-]+)/);
      const capMatch = text.match(/Market capitalisation (?:fell|rose) by ₦([\d,.-]+) (trillion|billion) to ₦([\d,.-]+) (trillion|billion)/);
      const volMatch = text.match(/total volume ([\d,.-]+\s*(?:m|b|k)?\s*shares)/i);
      const valMatch = text.match(/value traded ₦([\d,.-]+\s*(?:billion|trillion|million))/i);
      const dealsMatch = text.match(/([\d,.-]+)\s*deals/i);

      if (asiMatch) {
        indexData.change = parseFloat(asiMatch[2]);
        indexData.changeAmount = parseFloat(asiMatch[1].replace(/,/g, ''));
        indexData.allShareIndex = parseFloat(asiMatch[3].replace(/,/g, ''));
        
        const isDown = text.includes('declined') || text.includes('shed') || text.includes('fell');
        if (isDown) {
          indexData.change = -Math.abs(indexData.change);
          indexData.changeAmount = -Math.abs(indexData.changeAmount);
        }
      }

      // Format custom stats if present
      if (capMatch) {
        indexData.marketCap = `₦${capMatch[3]}T`;
      }
      if (valMatch) {
        indexData.volume = `₦${valMatch[1]}B`;
      }
      if (dealsMatch) {
        indexData.deals = dealsMatch[1];
      }
    }

    // 4. Parse stocks table
    const tableRegex = /<table class="terminal-table">([\s\S]*?)<\/table>/;
    const tableMatch = homeHtml.match(tableRegex);
    const parsedStocks: Stock[] = [];

    if (tableMatch) {
      const tableHtml = tableMatch[1];
      const trRegex = /<tr>([\s\S]*?)<\/tr>/g;
      let rMatch;
      while ((rMatch = trRegex.exec(tableHtml)) !== null) {
        const rowContent = rMatch[1];
        if (rowContent.includes('col-star') || rowContent.includes('<th>')) continue; // Skip header
        
        const tickerMatch = rowContent.match(/<span class="stock-ticker">[\s\S]*?<a[^>]*>([\s\S]*?)<\/a>/);
        const nameMatch = rowContent.match(/<span class="stock-name">([\s\S]*?)<\/span>/);
        const priceMatch = rowContent.match(/<td class="price-cell">([\s\S]*?)<\/td>/);
        const changeMatch = rowContent.match(/<td><span class="pct-badge[^>]*>([\s\S]*?)<\/span><\/td>/);
        const mcapMatch = rowContent.match(/<td class="mcap-cell">([\s\S]*?)<\/td>/);
        const volMatch = rowContent.match(/<td class="vol-cell">([\s\S]*?)<\/td>/);

        if (tickerMatch) {
          const ticker = tickerMatch[1].trim();
          const name = nameMatch ? nameMatch[1].trim() : ticker;
          const price = priceMatch ? parseFloat(priceMatch[1].replace(/[^\d.]/g, '')) : 0;
          const change = changeMatch ? parseFloat(changeMatch[1].replace(/%/g, '')) : 0;
          const mcap = mcapMatch ? mcapMatch[1].trim() : '—';
          const vol = volMatch ? volMatch[1].trim() : '—';

          const sectorRaw = sectorMap[ticker] || 'FINANCIAL SERVICES';
          let sectorMapped: 'Banking' | 'Consumer Goods' | 'Oil & Gas' | 'Industrials' | 'Agriculture' | 'Conglomerates' = 'Conglomerates';
          
          if (sectorRaw.includes('BANK') || sectorRaw.includes('FINANCIAL')) sectorMapped = 'Banking';
          else if (sectorRaw.includes('CONSUMER') || sectorRaw.includes('FOOD') || sectorRaw.includes('BEVERAGE')) sectorMapped = 'Consumer Goods';
          else if (sectorRaw.includes('OIL') || sectorRaw.includes('GAS') || sectorRaw.includes('ENERGY') || sectorRaw.includes('PETROLEUM')) sectorMapped = 'Oil & Gas';
          else if (sectorRaw.includes('INDUSTRIAL') || sectorRaw.includes('CEMENT') || sectorRaw.includes('CONSTRUCTION')) sectorMapped = 'Industrials';
          else if (sectorRaw.includes('AGRICULT')) sectorMapped = 'Agriculture';

          // Look for existing mock stock detail
          const existingMock = ngxStocks.find(s => s.ticker === ticker);
          
          if (existingMock) {
            // Override price, change, volume, mcap, and keep detailed properties
            const changeAmt = parseFloat((price * change / 100).toFixed(2));
            parsedStocks.push({
              ...existingMock,
              price,
              change,
              changeAmount: changeAmt,
              marketCap: mcap.startsWith('₦') ? mcap : `₦${mcap}`,
              volume: vol,
              volumeRaw: vol.includes('M') ? parseFloat(vol) * 1000000 : vol.includes('K') ? parseFloat(vol) * 1000 : parseFloat(vol) || 0,
            });
          } else {
            // Generate metadata for new stocks
            const changeAmt = parseFloat((price * change / 100).toFixed(2));
            const peRatio = parseFloat((5.0 + Math.random() * 8.0).toFixed(1));
            const pbRatio = parseFloat((0.4 + Math.random() * 1.8).toFixed(1));
            const divYield = price > 5 ? `${(2.0 + Math.random() * 7.0).toFixed(1)}%` : '0.0%';
            
            // Build simple 30 day chart data
            const chartData: { date: string; price: number; volume: number }[] = [];
            const today = new Date();
            let walkPrice = price * 0.95;
            for (let i = 30; i >= 0; i--) {
              const d = new Date(today);
              d.setDate(today.getDate() - i);
              const dateStr = d.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
              walkPrice += walkPrice * (Math.random() - 0.49) * 0.03;
              chartData.push({
                date: dateStr,
                price: parseFloat(walkPrice.toFixed(2)),
                volume: Math.floor(50000 + Math.random() * 2000000),
              });
            }

            parsedStocks.push({
              ticker,
              name,
              price,
              change,
              changeAmount: changeAmt,
              volume: vol,
              volumeRaw: vol.includes('M') ? parseFloat(vol) * 1000000 : vol.includes('K') ? parseFloat(vol) * 1000 : parseFloat(vol) || 0,
              sector: sectorMapped,
              sparkline: chartData.slice(-7).map(pt => pt.price),
              chartData,
              peRatio,
              pbRatio,
              marketCap: mcap.startsWith('₦') ? mcap : `₦${mcap}`,
              dividendYield: divYield,
              fiftyTwoWeekRange: {
                low: parseFloat((price * 0.65).toFixed(2)),
                high: parseFloat((price * 1.35).toFixed(2)),
              },
              description: `${name} (${ticker}) is a listed company on the Nigerian Exchange (NGX) operating within the ${sectorMapped} sector.`,
              aiInsight: {
                Beginner: `${name} is trading at ₦${price}. It recently moved by ${change}%. This stock is in the ${sectorMapped} sector, representing a key part of Nigeria's business landscape.`,
                Intermediate: `${ticker} has a PE of ${peRatio} with a daily change of ${change}%. The company's valuation stands at ${mcap}, reflecting its position in the ${sectorMapped} industry.`,
                Experienced: `${ticker} technical indicators show daily momentum at ${change}%. Valuation at ${mcap} yields an implied earnings yield of ${(100/peRatio).toFixed(1)}%. Recommend tracking order-book depth for liquidity spikes.`
              },
              eps: parseFloat((price / peRatio).toFixed(2)),
              bvps: parseFloat((price / pbRatio).toFixed(2)),
              targetPrice: parseFloat((price * 1.15).toFixed(2)),
              rating: change > 1 ? 'Outperform' : change < -1 ? 'Underperform' : 'Neutral'
            });
          }
        }
      }
    }

    if (parsedStocks.length === 0) {
      throw new Error('Parsed zero stocks from table');
    }

    // Sort alphabetically by ticker
    parsedStocks.sort((a, b) => a.ticker.localeCompare(b.ticker));

    cachedData = {
      indexData,
      stocks: parsedStocks
    };
    lastFetchTime = now;

    console.log(`Successfully scraped & updated market data cache. Total stocks: ${parsedStocks.length}`);
    return NextResponse.json(cachedData, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });

  } catch (error: any) {
    console.error('Market data scrape failed, returning fallback mock data:', error.message || error);
    // Return fallback mock data
    return NextResponse.json({
      indexData: ngxIndexData,
      stocks: ngxStocks
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      }
    });
  }
}
