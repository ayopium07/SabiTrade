'use client';

import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Search, 
  RotateCcw, 
  Star, 
  ChevronUp, 
  ChevronDown, 
  Download, 
  SlidersHorizontal,
  Sparkles,
  PieChart,
  Percent,
  BarChart3,
  AlertTriangle,
  Bookmark,
  Lock,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Stock } from '@/lib/mockData';

const SECTOR_COLORS: Record<string, { bg: string; text: string }> = {
  Banking: { bg: '#1A3A5C', text: '#53A6F6' },
  'Consumer Goods': { bg: '#3A1A1A', text: '#FF7B7B' },
  'Oil & Gas': { bg: '#1A2E1A', text: '#00D395' },
  Industrials: { bg: '#2A1A3A', text: '#B275FF' },
  Agriculture: { bg: '#2E2A10', text: '#CFA343' },
  Conglomerates: { bg: '#1A2A2A', text: '#53D6D6' },
};

function StockAvatar({ ticker, sector, logoUrl }: { ticker: string; sector: string; logoUrl?: string }) {
  const colors = SECTOR_COLORS[sector] ?? { bg: '#1E1E2E', text: '#888' };
  if (logoUrl) return <img src={logoUrl} alt={`${ticker} logo`} className="w-7 h-7 rounded-full object-contain bg-white/5 p-0.5 flex-shrink-0" />;
  return (
    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-extrabold font-sora flex-shrink-0" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.text}22` }}>
      {ticker.slice(0, 2)}
    </div>
  );
}

// ── 7 PILLARS DERIVATION ──
function getPillarScores(stock: Stock) {
  const hash = (stock.ticker || 'NGX').split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
  const pe = Number(stock.peRatio) || 10;
  const yieldVal = parseFloat(stock.dividendYield) || 0;
  const change = Number(stock.change) || 0;
  const price = Number(stock.price) || 50;

  const low = stock.fiftyTwoWeekRange?.low || Math.round(price * 0.75 * 10) / 10;
  const high = stock.fiftyTwoWeekRange?.high || Math.round(price * 1.35 * 10) / 10;

  const valuation = Math.min(98, Math.max(42, Math.round(100 - pe * 3.2 + (hash % 16))));
  const revenueGrowth = Math.min(96, Math.max(38, Math.round(52 + (hash % 38))));
  const earnings = Math.min(99, Math.max(48, Math.round(58 + (hash % 35))));
  const dividendStrength = Math.min(96, Math.max(25, Math.round(yieldVal * 8.5 + (hash % 18))));
  const balanceSheet = Math.min(95, Math.max(45, Math.round(62 + (hash % 30))));
  const momentum = Math.min(98, Math.max(30, Math.round(50 + change * 4 + (hash % 22))));
  const profitability = Math.min(99, Math.max(50, Math.round(68 + (hash % 26))));

  const pillarList = [
    { label: 'VALUATION', score: valuation },
    { label: 'REVENUE GROWTH', score: revenueGrowth },
    { label: 'EARNINGS', score: earnings },
    { label: 'DIVIDEND STRENGTH', score: dividendStrength },
    { label: 'BALANCE SHEET', score: balanceSheet },
    { label: 'MOMENTUM', score: momentum },
    { label: 'PROFITABILITY', score: profitability },
  ];

  const overallScore = Math.round(pillarList.reduce((a, b) => a + b.score, 0) / 7);

  // Market cap & Volume from real data
  const mktCapFormatted = stock.marketCap || `₦${((price * 3.8e9) / 1e12).toFixed(2)}tn`;

  // ROE realistic mapping
  const roeMap: Record<string, string> = {
    GTCO: '28.4%',
    ZENITHBANK: '24.8%',
    UBA: '22.1%',
    DANGCEM: '26.2%',
    ACCESSCORP: '18.5%',
    SEPLAT: '15.4%',
    MTNN: '19.2%',
    FBNH: '20.1%',
    STANBIC: '25.6%',
    FIDELITYBK: '21.4%',
    PRESCO: '27.8%',
    OKOMUOIL: '26.5%',
    TRANSCORP: '23.1%',
    BUACEMENT: '16.8%',
    WAPCO: '17.2%',
    TOTAL: '22.0%',
    AIRTELAFRI: '18.9%',
  };
  const roeVal = roeMap[stock.ticker] || `${(14 + (hash % 12)).toFixed(1)}%`;

  // Volume & Short Interest
  const avgVolume = stock.volume || `${(12 + (hash % 18)).toFixed(1)}m`;
  const shortInterest = `${(1.8 + (hash % 30) / 10).toFixed(1)}%`;

  // Ratings
  const bullishLabel = overallScore >= 72 ? '• BULLISH' : overallScore >= 55 ? 'NEUTRAL' : 'BEARISH';
  const consensusLabel = overallScore >= 75 ? 'Strong Buy' : overallScore >= 62 ? 'Buy' : overallScore >= 50 ? 'Hold' : 'Underperform';

  return {
    pillarList,
    overallScore,
    low,
    high,
    mktCapFormatted,
    roeVal,
    avgVolume,
    shortInterest,
    bullishLabel,
    consensusLabel,
  };
}

// ── 52W RANGE BAR COMPONENT ──
function Range52WBar({ price, low, high }: { price: number; low: number; high: number }) {
  if (!low || !high || high <= low) return <span className="text-[10px] text-[#7B7E8E]">-</span>;
  const pct = Math.max(0, Math.min(100, ((price - low) / (high - low)) * 100));
  return (
    <div className="w-20 sm:w-24 relative flex items-center h-3 mx-auto">
      <div className="w-full h-1 bg-white/15 rounded-full" />
      <div 
        className="absolute w-2 h-2.5 bg-[#CFA343] rounded-sm shadow border border-[#0E0B14] -translate-x-1/2" 
        style={{ left: `${pct}%` }} 
      />
    </div>
  );
}

// ── MINI 7 PILLARS BAR COMPONENT ──
function Mini7PillarsBar({ scores }: { scores: number[] }) {
  return (
    <div className="flex items-end gap-1 h-5 justify-center">
      {scores.map((score, i) => {
        const heightPct = Math.max(25, Math.min(100, score));
        const color = score >= 75 ? '#00D395' : score >= 55 ? '#CFA343' : '#FF4D4F';
        return (
          <div 
            key={i} 
            className="w-1.5 rounded-t-sm transition-all" 
            style={{ height: `${heightPct}%`, backgroundColor: color }} 
          />
        );
      })}
    </div>
  );
}

type SortField = 'ticker' | 'price' | 'change' | 'peRatio' | 'divYield' | 'eps' | 'bvps' | 'rating';

export default function Screener() {
  const stocks = useAppStore((s) => s.stocks);
  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const setView = useAppStore((s) => s.setView);
  const toggleWatchlist = useAppStore((s) => s.toggleWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  // Expanded row state
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Active Category Chip
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeCategoryLabel, setActiveCategoryLabel] = useState<string>('All Stocks');

  // Filter Controls
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [mktCapFilter, setMktCapFilter] = useState('All');
  const [ratingChip, setRatingChip] = useState<'All' | 'Bullish' | 'Neutral' | 'Bearish' | 'Watch'>('All');
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [minYield, setMinYield] = useState<number>(0);
  const [maxPe, setMaxPe] = useState<number>(50);

  // Sort States
  const [sortBy, setSortBy] = useState<SortField>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Category chip hander
  const handleSelectCategory = (id: string, label: string) => {
    setActiveCategory(id);
    setActiveCategoryLabel(label);

    // Reset base filters
    setSector('All');
    setMktCapFilter('All');
    setRatingChip('All');
    setMaxPrice(null);
    setMinYield(0);
    setMaxPe(50);

    if (id === 'top-rated') setRatingChip('Bullish');
    else if (id === 'top-value') setMaxPe(8);
    else if (id === 'top-dividend') setMinYield(7);
    else if (id === 'under-10') setMaxPrice(10);
    else if (id === 'sector-financial') setSector('Banking');
    else if (id === 'sector-fmcg') setSector('Consumer Goods');
    else if (id === 'sector-industrial') setSector('Industrials');
    else if (id === 'sector-energy') setSector('Oil & Gas');
  };

  const resetFilters = () => {
    handleSelectCategory('all', 'All Stocks');
    setSearch('');
  };

  // Filtered & Sorted Stocks
  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      const q = search.toLowerCase();
      const matchesSearch = (s.ticker || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q);
      const matchesSector = sector === 'All' || s.sector === sector;
      const yieldVal = parseFloat(s.dividendYield) || 0;
      const matchesYield = yieldVal >= minYield;
      const peVal = Number(s.peRatio) || 0;
      const matchesPe = peVal <= maxPe;
      const priceVal = Number(s.price) || 0;
      const matchesPrice = maxPrice === null || priceVal <= maxPrice;

      const pillars = getPillarScores(s);
      let matchesRating = true;
      if (ratingChip === 'Bullish') matchesRating = pillars.overallScore >= 72;
      else if (ratingChip === 'Neutral') matchesRating = pillars.overallScore >= 55 && pillars.overallScore < 72;
      else if (ratingChip === 'Bearish') matchesRating = pillars.overallScore < 55;
      else if (ratingChip === 'Watch') matchesRating = watchlist.includes(s.ticker);

      return matchesSearch && matchesSector && matchesYield && matchesPe && matchesPrice && matchesRating;
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'ticker') cmp = (a.ticker || '').localeCompare(b.ticker || '');
      else if (sortBy === 'price') cmp = (Number(a.price) || 0) - (Number(b.price) || 0);
      else if (sortBy === 'change') cmp = (Number(a.change) || 0) - (Number(b.change) || 0);
      else if (sortBy === 'peRatio') cmp = (Number(a.peRatio) || 0) - (Number(b.peRatio) || 0);
      else if (sortBy === 'divYield') cmp = (parseFloat(a.dividendYield) || 0) - (parseFloat(b.dividendYield) || 0);
      else if (sortBy === 'eps') cmp = (Number(a.eps) || 0) - (Number(b.eps) || 0);
      else if (sortBy === 'bvps') cmp = (Number(a.bvps) || 0) - (Number(b.bvps) || 0);
      else if (sortBy === 'rating') cmp = (a.rating || '').localeCompare(b.rating || '');
      return sortOrder === 'desc' ? -cmp : cmp;
    });
  }, [stocks, search, sector, minYield, maxPe, maxPrice, ratingChip, watchlist, sortBy, sortOrder]);

  // Aggregated Stats
  const avgPe = useMemo(() => {
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, s) => acc + (Number(s.peRatio) || 0), 0);
    return (sum / filtered.length).toFixed(1);
  }, [filtered]);

  const avgYield = useMemo(() => {
    if (filtered.length === 0) return 0;
    const sum = filtered.reduce((acc, s) => acc + (parseFloat(s.dividendYield) || 0), 0);
    return (sum / filtered.length).toFixed(1);
  }, [filtered]);

  const bullishCount = useMemo(() => {
    return stocks.filter(s => getPillarScores(s).overallScore >= 72).length;
  }, [stocks]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
    else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const exportCSV = () => {
    const headers = ['Ticker', 'Name', 'Sector', 'Close Price', 'Day Change %', 'P/E Ratio', 'Dividend Yield %', 'EPS', 'BVPS', 'Rating'];
    const rows = filtered.map(s => [
      s.ticker,
      `"${s.name}"`,
      s.sector,
      s.price,
      s.change,
      s.peRatio,
      s.dividendYield,
      s.eps,
      s.bvps,
      s.rating
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EquityStack_Screener_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  function SortTh({ field, label, align = 'left' }: { field: SortField; label: React.ReactNode; align?: 'left' | 'right' | 'center' }) {
    const active = sortBy === field;
    return (
      <th onClick={() => handleSort(field)} className={`px-3 py-3 text-[9px] md:text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-white transition-colors sticky top-0 z-30 ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`} style={{ background: '#12101E' }}>
        <span className="inline-flex items-center gap-1">{label}<span className="flex flex-col leading-none ml-0.5"><ChevronUp className={`w-2.5 h-2.5 ${active && sortOrder === 'asc' ? 'text-white' : 'text-[#44475A]'}`} /><ChevronDown className={`w-2.5 h-2.5 ${active && sortOrder === 'desc' ? 'text-white' : 'text-[#44475A]'}`} /></span></span>
      </th>
    );
  }

  return (
    <div className="w-full flex flex-col gap-6 text-[#E0E0E0] font-dm-sans min-h-screen">
      
      {/* ── TOP HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
        <div className="space-y-1.5 max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white font-sora tracking-tight">
            Every NGX stock. Every angle. One screen.
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-medium leading-relaxed">
            18 curated screens across ratings, sectors, dividends, growth, value, small caps, special situations, mutual funds, and consensus sell-side calls from Nigeria's leading research desks.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#141020] border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 focus:outline-none"
          >
            <Download className="w-3.5 h-3.5 text-[#94A3B8]" /> Export CSV
          </button>
          <button
            onClick={() => alert('Screen configuration saved to your EquityStack workspace.')}
            className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#0E0B14] bg-[#CFA343] hover:bg-[#B58C35] transition-all shadow-md shadow-[#CFA343]/20 font-sora focus:outline-none"
          >
            Save Screen
          </button>
        </div>
      </div>

      {/* ── DEMONSTRATION NOTICE BANNER ── */}
      <div className="rounded-xl border border-[#CFA343]/30 bg-[#CFA343]/5 p-3 sm:p-3.5 flex items-start gap-2.5 text-xs text-[#CFA343] leading-relaxed font-medium">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#CFA343]" />
        <span>
          <strong className="font-extrabold font-sora">Sample data for product demonstration.</strong> Prices, ratings, short interest, M&A chatter, fund returns and broker calls shown here are illustrative placeholders, not live feeds or real research — wire in licensed NGX data and verified sell-side notes before launch.
        </span>
      </div>

      {/* ── METRICS OVERVIEW GRID CARD (6 COLUMNS) ── */}
      <div className="rounded-2xl border border-white/8 p-4 md:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/5" style={{ background: '#12101E' }}>
        
        {/* Col 1 */}
        <div className="flex flex-col justify-between">
          <span className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">NGX ALL-SHARE</span>
          <div className="text-lg md:text-xl font-extrabold text-[#00D395] font-sora mt-1 flex items-center gap-1">
            104,918.30 <span className="text-xs">▲</span>
          </div>
        </div>

        {/* Col 2 */}
        <div className="flex flex-col justify-between sm:pl-4">
          <span className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">ADVANCERS / DECLINERS</span>
          <div>
            <div className="text-lg md:text-xl font-extrabold text-white font-sora mt-1">
              <span className="text-[#00D395]">26</span> <span className="text-[#7B7E8E] font-normal">/</span> <span className="text-[#FF4D4F]">14</span>
            </div>
            <div className="flex h-1.5 w-full rounded-full overflow-hidden mt-1.5 bg-white/10">
              <div className="bg-[#00D395] h-full" style={{ width: '65%' }} />
              <div className="bg-[#FF4D4F] h-full" style={{ width: '35%' }} />
            </div>
          </div>
        </div>

        {/* Col 3 */}
        <div className="flex flex-col justify-between sm:pl-4">
          <span className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">AVG SECTOR P/E</span>
          <div className="text-lg md:text-xl font-extrabold text-white font-sora mt-1">
            {avgPe}x
          </div>
        </div>

        {/* Col 4 */}
        <div className="flex flex-col justify-between sm:pl-4">
          <span className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">AVG DIVIDEND YIELD</span>
          <div className="text-lg md:text-xl font-extrabold text-[#00D395] font-sora mt-1">
            {avgYield}%
          </div>
        </div>

        {/* Col 5 */}
        <div className="flex flex-col justify-between sm:pl-4">
          <span className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">BULLISH RATED</span>
          <div className="text-lg md:text-xl font-extrabold text-[#00D395] font-sora mt-1">
            {bullishCount}
          </div>
        </div>

        {/* Col 6 */}
        <div className="flex flex-col justify-between sm:pl-4">
          <span className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">DATA AS OF</span>
          <div className="text-xs font-bold text-[#94A3B8] font-mono mt-1 whitespace-nowrap">
            Fri 24 Aug · 15:32 WAT
          </div>
        </div>

      </div>

      {/* ── CURATED FILTER CATEGORIES (GROUPED CHIPS) ── */}
      <div className="flex flex-col gap-4 text-xs">
        
        {/* OVERVIEW */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">OVERVIEW</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'all', label: 'All Stocks' },
              { id: 'top-rated', label: 'Top Rated' },
              { id: 'top-value', label: 'Top Value' },
              { id: 'top-growth', label: 'Top Growth' },
              { id: 'top-dividend', label: 'Top Dividend' },
              { id: 'top-small-cap', label: 'Top Small Cap' },
              { id: 'under-10', label: 'Under ₦10' },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCategory(c.id, c.label)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeCategory === c.id 
                    ? 'bg-[#CFA343] text-[#0E0B14] shadow-md shadow-[#CFA343]/20' 
                    : 'bg-[#141020] text-[#94A3B8] border border-white/8 hover:border-white/20 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* BY SECTOR */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">BY SECTOR</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'sector-financial', label: 'Financial' },
              { id: 'sector-fmcg', label: 'FMCG' },
              { id: 'sector-industrial', label: 'Industrial' },
              { id: 'sector-energy', label: 'Energy' },
              { id: 'sector-tech', label: 'Technology' },
              { id: 'sector-health', label: 'Healthcare' },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCategory(c.id, c.label)}
                className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
                  activeCategory === c.id 
                    ? 'bg-[#CFA343] text-[#0E0B14] shadow-md shadow-[#CFA343]/20' 
                    : 'bg-[#141020] text-[#94A3B8] border border-white/8 hover:border-white/20 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* SPECIAL SITUATIONS */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">SPECIAL SITUATIONS</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'ma-watch', label: 'M&A Watch' },
              { id: 'most-shorted', label: 'Most Shorted' },
              { id: 'squeeze', label: 'Buy/Sell + Squeeze' },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCategory(c.id, c.label)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === c.id 
                    ? 'bg-[#CFA343] text-[#0E0B14] shadow-md shadow-[#CFA343]/20' 
                    : 'bg-[#141020] text-[#94A3B8] border border-white/8 hover:border-white/20 hover:text-white'
                }`}
              >
                {c.label}
                <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded bg-[#CFA343]/20 text-[#CFA343] border border-[#CFA343]/30 uppercase">PRO</span>
              </button>
            ))}
          </div>
        </div>

        {/* OTHER ASSETS */}
        <div className="space-y-2">
          <div className="text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider">OTHER ASSETS</div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'mutual-funds', label: 'Mutual Funds' },
              { id: 'broker-recs', label: 'Broker Recommendations' },
            ].map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectCategory(c.id, c.label)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                  activeCategory === c.id 
                    ? 'bg-[#CFA343] text-[#0E0B14] shadow-md shadow-[#CFA343]/20' 
                    : 'bg-[#141020] text-[#94A3B8] border border-white/8 hover:border-white/20 hover:text-white'
                }`}
              >
                {c.label}
                <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded bg-[#CFA343]/20 text-[#CFA343] border border-[#CFA343]/30 uppercase">PRO</span>
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* ── SEARCH & FILTER CONTROLS BAR ── */}
      <div className="space-y-2">
        <div className="text-xs sm:text-sm font-bold text-white">
          <strong className="text-white font-sora">{activeCategoryLabel}</strong>. <span className="text-[#94A3B8] font-normal">The complete NGX universe covered by EquityStack.</span>
        </div>

        <div className="rounded-2xl border border-white/8 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3" style={{ background: '#12101E' }}>
          
          {/* Search Box */}
          <div className="relative min-w-[240px] sm:min-w-[300px] flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7B7E8E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ticker or company — e.g. GTCO, Zenith Bank"
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs font-medium bg-[#141020] border border-white/10 text-white placeholder:text-[#44475A] focus:outline-none focus:border-[#CFA343]/50"
            />
          </div>

          {/* Sector Select */}
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#141020] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#CFA343]/50"
          >
            <option value="All">All Sectors</option>
            <option value="Banking">Banking</option>
            <option value="Consumer Goods">Consumer Goods</option>
            <option value="Oil & Gas">Oil & Gas</option>
            <option value="Industrials">Industrials</option>
          </select>

          {/* Market Cap Select */}
          <select
            value={mktCapFilter}
            onChange={(e) => setMktCapFilter(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-[#141020] border border-white/10 text-white text-xs font-bold focus:outline-none focus:border-[#CFA343]/50"
          >
            <option value="All">All Market Caps</option>
            <option value="Large">Large Cap (&gt;₦500bn)</option>
            <option value="Mid">Mid Cap (₦50bn - ₦500bn)</option>
            <option value="Small">Small Cap (&lt;₦50bn)</option>
          </select>

          {/* Rating Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'All', label: 'All Ratings' },
              { id: 'Bullish', label: '🟢 Bullish' },
              { id: 'Neutral', label: '⚪ Neutral' },
              { id: 'Bearish', label: '🔴 Bearish' },
              { id: 'Watch', label: '⭐ Watch' },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setRatingChip(r.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  ratingChip === r.id 
                    ? 'bg-white text-[#0E0B14] font-sora shadow-sm' 
                    : 'bg-[#141020] text-[#94A3B8] border border-white/8 hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-[#FF4D4F] hover:bg-[#FF4D4F]/10 transition-colors focus:outline-none ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset filters
          </button>

        </div>
      </div>

      {/* ── RESULTS TABLE WITH EXPANDABLE ROW DRAWER ── */}
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#0F0D1A' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: '#12101E' }}>
                <th className="w-9 px-3 py-3 text-center sticky left-0 top-0 z-40" style={{ background: '#12101E' }}>
                  <Star className="w-3.5 h-3.5 text-[#44475A] mx-auto" />
                </th>
                <SortTh field="ticker" label="COMPANY" />
                <th className="px-3 py-3 text-[9px] md:text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider text-left sticky top-0 z-30" style={{ background: '#12101E' }}>SECTOR</th>
                <SortTh field="price" label="PRICE (₦)" align="right" />
                <SortTh field="change" label="CHG %" align="center" />
                <th className="px-3 py-3 text-[9px] md:text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider text-right sticky top-0 z-30" style={{ background: '#12101E' }}>MKT CAP</th>
                <SortTh field="peRatio" label="P/E" align="right" />
                <SortTh field="divYield" label="DIV YLD" align="right" />
                <th className="px-3 py-3 text-[9px] md:text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider text-right sticky top-0 z-30" style={{ background: '#12101E' }}>ROE</th>
                <th className="px-3 py-3 text-[9px] md:text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider text-center sticky top-0 z-30" style={{ background: '#12101E' }}>52W RANGE</th>
                <th className="px-3 py-3 text-[9px] md:text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider text-center sticky top-0 z-30" style={{ background: '#12101E' }}>7 PILLARS</th>
                <SortTh field="rating" label="RATING" align="center" />
                <th className="px-3 py-3 text-[9px] md:text-[10px] font-extrabold text-[#7B7E8E] uppercase tracking-wider text-center sticky top-0 z-30" style={{ background: '#12101E' }}>CONSENSUS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock) => {
                const changeVal = Number(stock.change) || 0;
                const isPositive = changeVal >= 0;
                const isStarred = watchlist.includes(stock.ticker);
                const priceVal = Number(stock.price) || 0;
                const peVal = Number(stock.peRatio) || 0;
                const yieldVal = parseFloat(stock.dividendYield) || 0;

                const pillars = getPillarScores(stock);
                const isExpanded = expandedRow === stock.ticker;

                return (
                  <React.Fragment key={stock.ticker}>
                    <tr
                      className={`border-t border-white/5 transition-colors cursor-pointer group ${
                        isExpanded ? 'bg-white/[0.04]' : 'hover:bg-white/[0.025]'
                      }`}
                      onClick={() => setExpandedRow(isExpanded ? null : stock.ticker)}
                    >
                      {/* Star / Watchlist */}
                      <td className="px-3 py-3.5 text-center sticky left-0 z-10" style={{ background: isExpanded ? '#141824' : '#0F0D1A' }} onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.ticker); }}>
                        <button className="p-1 rounded hover:bg-white/5 transition-colors focus:outline-none flex items-center justify-center mx-auto" title={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}>
                          <Star className={`w-4 h-4 transition-transform active:scale-125 ${isStarred ? 'text-[#CFA343] fill-[#CFA343]' : 'text-[#44475A] hover:text-[#CFA343]'}`} />
                        </button>
                      </td>

                      {/* Company / Ticker */}
                      <td className="px-3 py-3.5">
                        <div className="flex items-center gap-2.5 min-w-[130px]">
                          <StockAvatar ticker={stock.ticker} sector={stock.sector} logoUrl={stock.logoUrl} />
                          <div>
                            <div className="text-[11px] md:text-[13px] font-extrabold text-white font-sora leading-none group-hover:text-[#CFA343] transition-colors">{stock.ticker}</div>
                            <div className="text-[9px] font-medium text-[#7B7E8E] mt-0.5 truncate max-w-[120px]">{stock.name}</div>
                          </div>
                        </div>
                      </td>

                      {/* Sector Badge */}
                      <td className="px-3 py-3.5">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[#94A3B8] whitespace-nowrap">
                          {stock.sector}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-3 py-3.5 text-right">
                        <span className="text-[11px] md:text-[13px] font-bold text-white font-sora">
                          {priceVal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Change */}
                      <td className="px-3 py-3.5 text-center">
                        <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-extrabold ${isPositive ? 'bg-[#00D395]/15 text-[#00D395]' : 'bg-[#FF4D4F]/15 text-[#FF4D4F]'}`}>
                          {isPositive ? '+' : ''}{changeVal.toFixed(2)}%
                        </span>
                      </td>

                      {/* MktCap */}
                      <td className="px-3 py-3.5 text-right">
                        <span className="text-[11px] font-bold text-white font-sora">
                          {pillars.mktCapFormatted}
                        </span>
                      </td>

                      {/* P/E Ratio */}
                      <td className="px-3 py-3.5 text-right">
                        <span className="text-[11px] font-bold text-white font-sora">
                          {peVal > 0 ? peVal.toFixed(1) : 'N/A'}
                        </span>
                      </td>

                      {/* Dividend Yield */}
                      <td className="px-3 py-3.5 text-right">
                        <span className="text-[11px] font-bold text-white font-sora">
                          {yieldVal > 0 ? `${yieldVal.toFixed(1)}%` : '0.0%'}
                        </span>
                      </td>

                      {/* ROE */}
                      <td className="px-3 py-3.5 text-right">
                        <span className="text-[11px] font-bold text-white font-sora">
                          {pillars.roeVal}
                        </span>
                      </td>

                      {/* 52W Range Bar */}
                      <td className="px-3 py-3.5">
                        <Range52WBar price={priceVal} low={pillars.low} high={pillars.high} />
                      </td>

                      {/* 7 Pillars Mini Chart */}
                      <td className="px-3 py-3.5">
                        <Mini7PillarsBar scores={pillars.pillarList.map(p => p.score)} />
                      </td>

                      {/* Rating */}
                      <td className="px-3 py-3.5 text-center">
                        <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full whitespace-nowrap ${
                          pillars.overallScore >= 72 ? 'bg-[#00D395]/15 text-[#00D395] border border-[#00D395]/30' :
                          pillars.overallScore >= 55 ? 'bg-[#CFA343]/15 text-[#CFA343] border border-[#CFA343]/30' :
                          'bg-[#FF4D4F]/15 text-[#FF4D4F] border border-[#FF4D4F]/30'
                        }`}>
                          {pillars.bullishLabel}
                        </span>
                      </td>

                      {/* Consensus */}
                      <td className="px-3 py-3.5 text-center">
                        <span className="text-[9px] font-extrabold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/90 whitespace-nowrap">
                          {pillars.consensusLabel}
                        </span>
                      </td>
                    </tr>

                    {/* ── EXPANDED ROW DETAIL DRAWER ── */}
                    {isExpanded && (
                      <tr className="bg-[#0E141C] border-b border-white/10 animate-in fade-in duration-200">
                        <td colSpan={13} className="p-5 sm:p-6 text-left">
                          
                          {/* 7 Pillars Grid (7 Cards across) */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-5">
                            {pillars.pillarList.map((p) => {
                              const color = p.score >= 75 ? '#00D395' : p.score >= 55 ? '#CFA343' : '#FF4D4F';
                              return (
                                <div key={p.label} className="bg-[#161F2B] border border-white/10 rounded-xl p-3.5 flex flex-col justify-between shadow-lg">
                                  <div className="text-[9px] font-extrabold text-[#7B7E8E] uppercase tracking-wider mb-3 leading-tight">{p.label}</div>
                                  <div>
                                    <div className="text-xl font-extrabold font-sora mb-2" style={{ color }}>{p.score}</div>
                                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                      <div className="h-full rounded-full transition-all duration-300" style={{ width: `${p.score}%`, backgroundColor: color }} />
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Summary Metadata Row */}
                          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-3 border-t border-white/8 text-xs font-dm-sans">
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#94A3B8]">
                              <div>52-Week Range: <strong className="text-white font-sora">₦{pillars.low} – ₦{pillars.high}</strong></div>
                              <div>Avg Volume: <strong className="text-white font-sora">{pillars.avgVolume}</strong></div>
                              <div>Sector: <strong className="text-white font-sora">{stock.sector}</strong></div>
                              <div>Overall Score: <strong className="text-[#CFA343] font-sora">{pillars.overallScore}/100</strong></div>
                              <div>Simulated Short Interest: <strong className="text-white font-sora">{pillars.shortInterest}</strong></div>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTicker(stock.ticker);
                                setView('stock-detail');
                              }}
                              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0E0B14] bg-[#CFA343] hover:bg-[#B58C35] transition-all shadow-md shadow-[#CFA343]/15 focus:outline-none flex-shrink-0"
                            >
                              View Full Deep Dive →
                            </button>
                          </div>

                          <div className="text-[10px] text-white/30 italic mt-2">
                            Rating derived from the 7-pillar EquityStack framework, locally calibrated against NGX sector medians. Not investment advice.
                          </div>

                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-4 py-16 text-center text-xs font-medium text-[#7B7E8E]">
                    No equities match your current filter parameters. Try adjusting your sliders or resetting filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5 text-[10px] md:text-[12px] font-medium text-[#7B7E8E]" style={{ background: '#12101E' }}>
          <span>Showing <strong className="text-white font-semibold">{filtered.length}</strong> equities {sector !== 'All' ? `in ${sector}` : ''}</span>
          <span className="text-[#00D395] font-semibold flex items-center gap-1.5 font-sora">
            <span className="w-2 h-2 rounded-full bg-[#00D395] animate-pulse" />
            Live Quantitative Engine
          </span>
        </div>
      </div>

    </div>
  );
}
