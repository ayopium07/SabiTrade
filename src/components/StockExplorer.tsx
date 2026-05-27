import React, { useState } from 'react';
import { Search, ChevronDown, Check, ArrowUpDown, Star } from 'lucide-react';
import { ngxStocks } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function StockExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('All');
  const [sortBy, setSortBy] = useState<'price' | 'change' | 'volume'>('change');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isSortOpen, setIsSortOpen] = useState(false);

  const setSelectedTicker = useAppStore((state) => state.setSelectedTicker);
  const toggleWatchlist = useAppStore((state) => state.toggleWatchlist);
  const watchlist = useAppStore((state) => state.watchlist);

  const sectors = ['All', 'Banking', 'Consumer Goods', 'Oil & Gas', 'Industrials'];

  const filteredStocks = ngxStocks
    .filter((stock) => {
      const matchesSearch =
        stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stock.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSector = selectedSector === 'All' || stock.sector === selectedSector;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'price') comparison = a.price - b.price;
      else if (sortBy === 'change') comparison = a.change - b.change;
      else if (sortBy === 'volume') comparison = a.volumeRaw - b.volumeRaw;
      return sortOrder === 'desc' ? -comparison : comparison;
    });

  const handleSort = (type: 'price' | 'change' | 'volume') => {
    if (sortBy === type) setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    else { setSortBy(type); setSortOrder('desc'); }
    setIsSortOpen(false);
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
            <ArrowUpDown className="h-3.5 w-3.5 text-brand-primary" />
            <span>Sort: {sortBy === 'price' ? 'Price' : sortBy === 'change' ? 'Change' : 'Volume'} ({sortOrder === 'desc' ? '↓' : '↑'})</span>
            <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />
          </button>

          {isSortOpen && (
            <div className="absolute right-0 mt-1 w-44 glass-elevated border border-border shadow-card rounded-xl p-1 z-30 animate-in fade-in slide-in-from-top-1 duration-150">
              {(['change', 'price', 'volume'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => handleSort(type)}
                  className="flex items-center justify-between w-full text-left px-3 py-2 text-xs font-medium rounded-lg hover:bg-bg-hover text-text-primary transition-colors"
                >
                  <span className="capitalize">{type === 'change' ? '% Change' : type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  {sortBy === type && <Check className="h-3.5 w-3.5 text-brand-primary" />}
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
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 border ${
              selectedSector === sector
                ? 'text-bg-base border-brand-primary'
                : 'bg-bg-surface text-text-secondary border-border hover:border-border-bright hover:text-text-primary'
            }`}
            style={selectedSector === sector
              ? { background: '#00E676', boxShadow: '0 0 12px rgba(0,230,118,0.3)' }
              : {}}
          >
            {sector}
          </button>
        ))}
      </div>

      {/* ── Stock Table ───────────────────────────────────── */}
      <div className="rounded-2xl border border-border overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}>
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-bg-base/60 border-b border-border text-[10px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans">
          <div className="col-span-5">Company</div>
          <div className="col-span-2 text-right">Price (₦)</div>
          <div className="col-span-2 text-right">Change</div>
          <div className="col-span-2 text-center">7D Chart</div>
          <div className="col-span-1 text-center">View</div>
        </div>

        <div className="divide-y divide-border/60">
          {filteredStocks.length > 0 ? (
            filteredStocks.map((stock) => {
              const isPositive = stock.change >= 0;
              const isWatched = watchlist.includes(stock.ticker);
              const color = isPositive ? '#10B981' : '#FF4D4D';

              // Sparkline area chart
              const min = Math.min(...stock.sparkline);
              const max = Math.max(...stock.sparkline);
              const range = max - min || 1;
              const W = 80; const H = 24;
              const pts = stock.sparkline.map((v, i) => ({
                x: (i / (stock.sparkline.length - 1)) * W,
                y: H - 2 - ((v - min) / range) * (H - 4),
              }));
              const linePath = pts.reduce((d, p, i) => d + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
              const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`;

              return (
                <div
                  key={stock.ticker}
                  onClick={() => setSelectedTicker(stock.ticker)}
                  className="grid grid-cols-12 gap-2 sm:gap-4 items-center px-4 sm:px-6 py-3.5 transition-all cursor-pointer group"
                  style={{ borderLeft: '2px solid transparent' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.02)';
                    (e.currentTarget as HTMLDivElement).style.borderLeftColor = color;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent';
                  }}
                >
                  {/* Ticker & Name */}
                  <div className="col-span-7 sm:col-span-5 flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.ticker); }}
                      className={`text-sm focus:outline-none transition-all ${
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
                        <span className="hidden sm:inline-block px-1.5 py-0.5 bg-bg-base border border-border rounded text-[9px] font-bold text-text-secondary">
                          {stock.sector}
                        </span>
                      </div>
                      <p className="text-xs text-text-secondary font-medium font-dm-sans truncate">{stock.name}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="col-span-3 sm:col-span-2 text-right">
                    <span className="text-sm font-extrabold text-text-primary font-sora">
                      ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="block sm:hidden text-[9px] text-text-secondary font-medium uppercase font-dm-sans">
                      {stock.volume}
                    </span>
                  </div>

                  {/* Change */}
                  <div className="col-span-2 text-right">
                    <span className={`inline-flex text-xs font-extrabold px-2 py-0.5 rounded-lg ${
                      isPositive ? 'bg-gain/10 text-gain border border-gain/20' : 'bg-danger/10 text-danger'
                    }`}>
                      {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                    </span>
                  </div>

                  {/* Sparkline */}
                  <div className="hidden sm:block col-span-2">
                    <div className="h-6 w-20 mx-auto">
                      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                        <defs>
                          <linearGradient id={`sg-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                            <stop offset="100%" stopColor={color} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={areaPath} fill={`url(#sg-${stock.ticker})`} />
                        <path d={linePath} fill="none" stroke={color} strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="col-span-2 sm:col-span-1 text-center">
                    <span className="text-brand-primary text-sm group-hover:translate-x-1 inline-block transition-transform duration-200">→</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-10 text-center text-text-secondary font-medium font-dm-sans">
              <span className="block text-2xl mb-2">🔍</span>
              No stocks match &quot;{searchQuery}&quot;. Try a different name or ticker.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
