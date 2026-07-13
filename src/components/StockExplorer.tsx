// StockExplorer Component - Enhanced with Investment Metrics and Sorting
import React, { useState } from 'react';
import { Search, ChevronDown, Check, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function StockExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<'ticker' | 'price' | 'change' | 'high' | 'low' | 'eps' | 'bvps' | 'peRatio' | 'target' | 'upside' | 'rating'>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const stocks = useAppStore((state) => state.stocks);
  const setSelectedTicker = useAppStore((state) => state.setSelectedTicker);
  const toggleWatchlist = useAppStore((state) => state.toggleWatchlist);
  const watchlist = useAppStore((state) => state.watchlist);

  const sectors = ['All', 'Banking', 'Consumer Goods', 'Oil & Gas', 'Industrials'];

  const filteredStocks = stocks
    .filter((stock) => {
      const matchesSearch =
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'ticker') {
        comparison = a.ticker.localeCompare(b.ticker);
      } else if (sortBy === 'price') {
        comparison = a.price - b.price;
      } else if (sortBy === 'change') {
        comparison = a.change - b.change;
      } else if (sortBy === 'high') {
        comparison = a.fiftyTwoWeekRange.high - b.fiftyTwoWeekRange.high;
      } else if (sortBy === 'low') {
        comparison = a.fiftyTwoWeekRange.low - b.fiftyTwoWeekRange.low;
      } else if (sortBy === 'eps') {
        comparison = a.eps - b.eps;
      } else if (sortBy === 'bvps') {
        comparison = a.bvps - b.bvps;
      } else if (sortBy === 'peRatio') {
        comparison = a.peRatio - b.peRatio;
      } else if (sortBy === 'target') {
        comparison = a.targetPrice - b.targetPrice;
      } else if (sortBy === 'upside') {
        const upsideA = (a.targetPrice - a.price) / a.price;
        const upsideB = (b.targetPrice - b.price) / b.price;
        comparison = upsideA - upsideB;
      } else if (sortBy === 'rating') {
        comparison = a.rating.localeCompare(b.rating);
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const handleSort = (type: typeof sortBy) => {
    if (sortBy === type) setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    else { setSortBy(type); setSortOrder('desc'); }
    setIsSortOpen(false);
  };

  const renderHeader = (field: typeof sortBy, label: string, align: 'left' | 'right' | 'center' = 'left') => {
    const isActive = sortBy === field;
    const isTicker = field === 'ticker';
    return (
      <th
        onClick={(e) => {
          e.stopPropagation();
          handleSort(field);
        }}
        className={`px-4 py-3.5 cursor-pointer select-none text-[10px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans hover:text-text-primary transition-colors group/th ${
          align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
        } ${isTicker ? 'sticky left-0 z-40 bg-[#0e0d25] border-r border-border/40 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]' : 'bg-[#0e0d25]'}`}
      >
        <div className={`flex items-center gap-1 ${align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start'}`}>
          <span className="whitespace-pre-line">{label}</span>
          <span className="inline-flex w-3 h-3 items-center justify-center">
            {isActive ? (
              sortOrder === 'desc' ? '↓' : '↑'
            ) : (
              <span className="opacity-0 group-hover/th:opacity-40 transition-opacity">↕</span>
            )}
          </span>
        </div>
      </th>
    );
  };

  return (
    <div className="space-y-4">
      {/* ── Search & Sort Row ─────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search NGX stocks (e.g. Zenith, DANGCEM)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-bg-surface border border-border focus:border-brand-primary/50 rounded-xl text-sm font-dm-sans transition-all placeholder:text-text-secondary focus:ring-0 focus:outline-none text-text-primary"
            style={{ boxShadow: 'none' }}
            onFocus={e => (e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.08)')}
            onBlur={e => (e.target.style.boxShadow = 'none')}
          />
        </div>

        <div className="relative flex-shrink-0 self-end sm:self-auto">
          <button
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-bg-surface border border-border hover:border-brand-primary/30 rounded-xl text-xs font-bold font-dm-sans transition-all text-text-primary"
          >
            <span>Sort: {sortBy === 'ticker' ? 'Company' : sortBy === 'price' ? 'Close Price' : sortBy === 'change' ? 'Daily Change' : sortBy === 'high' ? '52 Weeks High' : sortBy === 'low' ? '52 Weeks Low' : sortBy === 'eps' ? 'EPS' : sortBy === 'bvps' ? 'BVPS' : sortBy === 'peRatio' ? 'PE Ratio' : sortBy === 'target' ? 'Our Target' : sortBy === 'upside' ? 'Upside/Downside' : 'Consensus Rating'} ({sortOrder === 'desc' ? '↓' : '↑'})</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
          </button>
 
          {isSortOpen && (
            <div className="absolute right-0 mt-1 w-48 glass-elevated border border-border shadow-card rounded-xl p-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150 max-h-64 overflow-y-auto custom-scrollbar">
              {([
                { key: 'ticker', label: 'Company' },
                { key: 'price', label: 'Close Price' },
                { key: 'change', label: 'Daily Change' },
                { key: 'high', label: '52 Weeks High' },
                { key: 'low', label: '52 Weeks Low' },
                { key: 'eps', label: 'EPS' },
                { key: 'bvps', label: 'BVPS' },
                { key: 'peRatio', label: 'PE Ratio' },
                { key: 'target', label: 'Our Target' },
                { key: 'upside', label: 'Upside/Downside' },
                { key: 'rating', label: 'Consensus Rating' }
              ] as const).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key)}
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-bg-hover text-text-primary transition-colors"
                >
                  <span>{label}</span>
                  {sortBy === key && <Check className="h-3.5 w-3.5 text-brand-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Sector Pills ──────────────────────────────────── */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        {sectors.map((sector) => (
          <button
            key={sector}
            onClick={() => setSelectedSector(sector)}
            className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border"
            style={selectedSector === sector
              ? { background: '#00E676', color: '#070615', border: '1px solid #00E676', boxShadow: '0 0 12px rgba(0,230,118,0.3)' }
              : { backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
          >
            {sector}
          </button>
        ))}
      </div>      {/* ── Stock Table ───────────────────────────────────── */}
      <div className="rounded-2xl border border-border overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}>
        <div className="overflow-x-auto overflow-y-auto max-h-[600px] custom-scrollbar">
          <table className="w-full border-collapse text-left min-w-[1200px]">
            {/* Table header */}
            <thead className="sticky top-0 z-30 shadow-md">
              <tr className="bg-[#0e0d25] border-b border-border">
                {renderHeader('ticker', 'Company', 'left')}
                {renderHeader('price', 'Close\nPrice', 'right')}
                {renderHeader('change', 'Daily\nChange', 'right')}
                {renderHeader('high', '52 Weeks\nHigh', 'right')}
                {renderHeader('low', '52 Weeks\nLow', 'right')}
                {renderHeader('eps', 'EPS', 'right')}
                {renderHeader('bvps', 'BVPS', 'right')}
                {renderHeader('peRatio', 'PE\nRatio', 'right')}
                {renderHeader('target', 'Our\nTarget', 'right')}
                {renderHeader('upside', 'Upside\nDownside', 'right')}
                {renderHeader('rating', 'Consensus\nRating', 'center')}
                <th className="px-4 py-3.5 text-center text-[10px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans w-[100px] whitespace-pre-line bg-[#0e0d25]">7D\nChart</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/60">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => {
                  const isPositive = stock.change >= 0;
                  const isWatched = watchlist.includes(stock.ticker);
                  const color = isPositive ? '#10B981' : '#FF4D4D';
                  
                  const upside = ((stock.targetPrice - stock.price) / stock.price) * 100;
                  const isUpsidePositive = upside >= 0;
                  
                  const ratingLabelMap: Record<string, string> = {
                    Outperform: 'Bullish',
                    Neutral: 'Watch',
                    Underperform: 'Bearish',
                  };
                  const ratingLabel = ratingLabelMap[stock.rating] ?? stock.rating;

                  let ratingClass = '';
                  if (stock.rating === 'Outperform') {
                    ratingClass = 'bg-gain/10 text-gain border border-gain/20';
                  } else if (stock.rating === 'Neutral') {
                    ratingClass = 'bg-warning/10 text-warning border border-warning/20';
                  } else {
                    ratingClass = 'bg-danger/10 text-danger border border-danger/20';
                  }

                  return (
                    <tr
                      key={stock.ticker}
                      onClick={() => setSelectedTicker(stock.ticker)}
                      className="hover:bg-brand-primary/[0.02] transition-colors cursor-pointer group"
                    >
                      {/* Company */}
                      <td className="px-4 py-3.5 align-middle sticky left-0 z-10 bg-[#0c0b22] border-r border-border/20 group-hover:bg-[#12102e] transition-colors shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">
                        <div className="flex items-center gap-3 max-w-[240px]">
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.ticker); }}
                            className={`text-sm focus:outline-none transition-all flex-shrink-0 ${
                              isWatched ? 'text-warning' : 'text-text-muted hover:text-text-secondary'
                            }`}
                          >
                            <Star className={`h-3.5 w-3.5 ${isWatched ? 'fill-warning' : ''}`} />
                          </button>
                          <div className="truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold font-sora tracking-tight group-hover:underline"
                                style={{ color, textShadow: isPositive ? '0 0 6px rgba(16,185,129,0.3)' : 'none' }}>
                                {stock.ticker}
                              </span>
                              <span className="px-1.5 py-0.5 bg-bg-base border border-border rounded text-[9px] font-bold text-text-secondary">
                                {stock.sector}
                              </span>
                            </div>
                            <p className="text-[10px] text-text-secondary font-medium font-dm-sans truncate">{stock.name}</p>
                          </div>
                        </div>
                      </td>

                      {/* Close Price */}
                      <td className="px-4 py-3.5 text-right align-middle font-bold text-xs text-text-primary">
                        ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Daily Change */}
                      <td className="px-4 py-3.5 text-right align-middle">
                        <span className={`text-xs font-extrabold ${isPositive ? 'text-gain' : 'text-danger'}`}>
                          {isPositive ? '+' : ''}₦{stock.changeAmount.toFixed(2)}
                        </span>
                        <span className={`block text-[10px] font-bold ${isPositive ? 'text-gain' : 'text-danger'}`}>
                          ({isPositive ? '+' : ''}{stock.change.toFixed(2)}%)
                        </span>
                      </td>

                      {/* 52W High */}
                      <td className="px-4 py-3.5 text-right align-middle font-medium text-xs text-text-secondary">
                        ₦{stock.fiftyTwoWeekRange.high.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>

                      {/* 52W Low */}
                      <td className="px-4 py-3.5 text-right align-middle font-medium text-xs text-text-secondary">
                        ₦{stock.fiftyTwoWeekRange.low.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>

                      {/* EPS */}
                      <td className="px-4 py-3.5 text-right align-middle font-medium text-xs text-text-secondary">
                        {stock.eps < 0 ? `-₦${Math.abs(stock.eps).toFixed(2)}` : `₦${stock.eps.toFixed(2)}`}
                      </td>

                      {/* BVPS */}
                      <td className="px-4 py-3.5 text-right align-middle font-medium text-xs text-text-secondary">
                        {stock.bvps < 0 ? `-₦${Math.abs(stock.bvps).toFixed(2)}` : `₦${stock.bvps.toFixed(2)}`}
                      </td>

                      {/* PE Ratio */}
                      <td className="px-4 py-3.5 text-right align-middle font-medium text-xs text-text-secondary">
                        {stock.peRatio < 0 ? 'N/A' : `${stock.peRatio.toFixed(1)}x`}
                      </td>

                      {/* Our Target */}
                      <td className="px-4 py-3.5 text-right align-middle font-bold text-xs text-brand-primary">
                        ₦{stock.targetPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Upside/Downside */}
                      <td className="px-4 py-3.5 text-right align-middle">
                        <span className={`block text-xs font-extrabold leading-tight ${isUpsidePositive ? 'text-gain' : 'text-danger'}`}>
                          {isUpsidePositive ? '+' : ''}{upside.toFixed(1)}%
                        </span>
                        <span className={`block text-[9px] font-bold uppercase tracking-wider leading-tight mt-0.5 ${isUpsidePositive ? 'text-gain/60' : 'text-danger/60'}`}>
                          {isUpsidePositive ? 'Upside' : 'Downside'}
                        </span>
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3.5 text-center align-middle">
                        <span className={`inline-flex text-[10px] font-extrabold px-2 py-0.5 rounded-lg uppercase tracking-wider ${ratingClass}`}>
                          {ratingLabel}
                        </span>
                      </td>

                      {/* 7D Chart */}
                      <td className="px-4 py-3.5 text-center align-middle">
                        {(() => {
                          const min = Math.min(...stock.sparkline);
                          const max = Math.max(...stock.sparkline);
                          const range = max - min || 1;
                          const W = 80;
                          const H = 22;

                          const points = stock.sparkline.map((val: number, idx: number) => ({
                            x: (idx / (stock.sparkline.length - 1)) * W,
                            y: H - 2 - ((val - min) / range) * (H - 4),
                          }));

                          const linePath = points.reduce((d: string, p: { x: number; y: number }, i: number) => d + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                          const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`;

                          return (
                            <div className="h-6 w-20 mx-auto opacity-80">
                              <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id={`area-table-grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={isPositive ? '#10B981' : '#FF4D4D'} stopOpacity="0.25" />
                                    <stop offset="100%" stopColor={isPositive ? '#10B981' : '#FF4D4D'} stopOpacity="0.0" />
                                  </linearGradient>
                                </defs>
                                <path d={areaPath} fill={`url(#area-table-grad-${stock.ticker})`} />
                                <path d={linePath} fill="none" stroke={isPositive ? '#10B981' : '#FF4D4D'} strokeWidth="1.5"
                                  strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </div>
                          );
                        })()}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={12} className="p-10 text-center text-text-secondary font-medium font-dm-sans">
                    <span className="block text-2xl mb-2">🔍</span>
                    No stocks match &quot;{searchQuery}&quot;. Try a different name or ticker.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
