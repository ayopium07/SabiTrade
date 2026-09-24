'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, MoreVertical, Star } from 'lucide-react';
import { useAppStore } from '@/lib/store';

function Sparkline({ data, positive, width = 80, height = 32 }: { data: number[]; positive: boolean; width?: number; height?: number }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(' ');
  const color = positive ? '#00D395' : '#FF4D4F';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <polyline points={points} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
    </svg>
  );
}

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

function RatingBadge({ rating }: { rating: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    Outperform: { label: 'Watch', bg: 'rgba(0,211,149,0.12)', color: '#00D395' },
    Neutral: { label: 'Neutral', bg: 'rgba(207,163,67,0.12)', color: '#CFA343' },
    Underperform: { label: 'Bearish', bg: 'rgba(255,77,79,0.12)', color: '#FF4D4F' },
  };
  const style = map[rating] ?? map.Neutral;
  return <span className="text-[9px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap" style={{ background: style.bg, color: style.color }}>{style.label}</span>;
}

type SortField = 'ticker' | 'price' | 'high' | 'low' | 'eps' | 'bvps' | 'peRatio' | 'rating';

function SortTh({ field, label, active, order, onClick, align = 'left' }: { field: SortField; label: React.ReactNode; active: boolean; order: 'asc' | 'desc'; onClick: () => void; align?: 'left' | 'right' | 'center' }) {
  return (
    <th onClick={onClick} className={`px-3 py-2 md:px-4 md:py-3.5 text-[9px] md:text-[11px] font-bold text-text-muted uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-text-primary transition-colors ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'}`}>
      <span className="inline-flex items-center gap-1">{label}<span className="flex flex-col leading-none ml-0.5"><ChevronUp className={`w-2.5 h-2.5 ${active && order === 'asc' ? 'text-text-primary' : 'text-text-muted'}`} /><ChevronDown className={`w-2.5 h-2.5 ${active && order === 'desc' ? 'text-text-primary' : 'text-text-muted'}`} /></span></span>
    </th>
  );
}

export default function StockExplorer() {
  const stocks = useAppStore((s) => s.stocks);
  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const toggleWatchlist = useAppStore((s) => s.toggleWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [sortBy, setSortBy] = useState<SortField>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const sectors = ['All', 'Banking', 'Consumer Goods', 'Oil & Gas', 'Industrials'];

  const filtered = useMemo(() => {
    return stocks.filter((s) => {
      const q = search.toLowerCase();
      return ((s.ticker || '').toLowerCase().includes(q) || (s.name || '').toLowerCase().includes(q)) && (sector === 'All' || s.sector === sector);
    }).sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'ticker') cmp = (a.ticker || '').localeCompare(b.ticker || '');
      else if (sortBy === 'price') cmp = (Number(a.price) || 0) - (Number(b.price) || 0);
      else if (sortBy === 'high') cmp = (Number(a.fiftyTwoWeekRange?.high) || 0) - (Number(b.fiftyTwoWeekRange?.high) || 0);
      else if (sortBy === 'low') cmp = (Number(a.fiftyTwoWeekRange?.low) || 0) - (Number(b.fiftyTwoWeekRange?.low) || 0);
      else if (sortBy === 'eps') cmp = (Number(a.eps) || 0) - (Number(b.eps) || 0);
      else if (sortBy === 'bvps') cmp = (Number(a.bvps) || 0) - (Number(b.bvps) || 0);
      else if (sortBy === 'peRatio') cmp = (Number(a.peRatio) || 0) - (Number(b.peRatio) || 0);
      else if (sortBy === 'rating') cmp = (a.rating || '').localeCompare(b.rating || '');
      return sortOrder === 'desc' ? -cmp : cmp;
    });
  }, [stocks, search, sector, sortBy, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortOrder(o => o === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const SORT_LABELS: Record<SortField, string> = { ticker: 'Ticker', price: 'Close Price', high: '52W High', low: '52W Low', eps: 'EPS', bvps: 'BVPS', peRatio: 'P/E Ratio', rating: 'Rating' };

  return (
    <div className="w-full flex flex-col gap-0" onClick={() => setMenuOpen(null)}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`px-3 py-1.5 rounded-lg text-[10px] md:text-[12px] font-bold transition-all focus:outline-none flex-shrink-0 ${
                sector === s
                  ? 'bg-brand-primary text-bg-base font-extrabold shadow-sm'
                  : 'bg-bg-raised text-text-secondary hover:text-text-primary border border-border'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stock..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-[11px] font-medium bg-bg-surface border border-border text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-primary/50"
            />
          </div>
          <div className="relative flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === '__sort__' ? null : '__sort__'); }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-[10px] font-bold text-text-secondary bg-bg-surface border border-border hover:border-border-bright transition-colors focus:outline-none whitespace-nowrap"
            >
              <span className="hidden sm:inline">Sort: {SORT_LABELS[sortBy]} </span>
              <span className="sm:hidden">Sort</span>
              {sortOrder === 'desc' ? '↓' : '↑'}
              <ChevronDown className="h-3 w-3" />
            </button>
            {menuOpen === '__sort__' && (
              <div className="absolute right-0 top-full mt-1 z-50 rounded-xl border border-border bg-bg-surface shadow-2xl overflow-y-auto max-h-64" onClick={(e) => e.stopPropagation()}>
                {(Object.entries(SORT_LABELS) as [SortField, string][]).map(([field, label]) => (
                  <button
                    key={field}
                    onClick={() => { handleSort(field); setMenuOpen(null); }}
                    className={`w-full px-4 py-2.5 text-left text-[10px] md:text-[12px] font-medium hover:bg-bg-hover transition-colors whitespace-nowrap ${
                      sortBy === field ? 'text-brand-primary font-bold' : 'text-text-secondary'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TABLE — all screen sizes, horizontal scroll on mobile */}
      <div className="rounded-2xl overflow-hidden glass-elevated">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-bg-raised border-b border-border">
                <th className="w-9 px-3 py-2.5 text-center sticky left-0 z-20 bg-bg-raised border-b border-border">
                  <Star className="w-3.5 h-3.5 text-text-muted mx-auto" />
                </th>
                <th className="px-2 py-2.5 text-[9px] font-bold text-text-muted uppercase tracking-wider text-left sticky left-9 z-20 bg-bg-raised border-b border-border shadow-sm">
                  <span className="inline-flex items-center gap-0.5">
                    Company
                    <span className="flex flex-col leading-none ml-0.5">
                      <ChevronUp className={`w-2 h-2 ${sortBy === 'ticker' && sortOrder === 'asc' ? 'text-text-primary' : 'text-text-muted'}`} />
                      <ChevronDown className={`w-2 h-2 ${sortBy === 'ticker' && sortOrder === 'desc' ? 'text-text-primary' : 'text-text-muted'}`} />
                    </span>
                  </span>
                </th>
                <SortTh field="price" label="Close Price" active={sortBy === 'price'} order={sortOrder} onClick={() => handleSort('price')} align="right" />
                <SortTh field="high" label="52W High" active={sortBy === 'high'} order={sortOrder} onClick={() => handleSort('high')} align="right" />
                <SortTh field="low" label="52W Low" active={sortBy === 'low'} order={sortOrder} onClick={() => handleSort('low')} align="right" />
                <SortTh field="eps" label="EPS" active={sortBy === 'eps'} order={sortOrder} onClick={() => handleSort('eps')} align="right" />
                <SortTh field="bvps" label="BVPS" active={sortBy === 'bvps'} order={sortOrder} onClick={() => handleSort('bvps')} align="right" />
                <SortTh field="peRatio" label="P/E Ratio" active={sortBy === 'peRatio'} order={sortOrder} onClick={() => handleSort('peRatio')} align="right" />
                <SortTh field="rating" label="Consensus Rating" active={sortBy === 'rating'} order={sortOrder} onClick={() => handleSort('rating')} align="center" />
                <th className="px-3 py-2 md:px-4 md:py-3.5 text-[9px] md:text-[11px] font-bold text-text-muted uppercase tracking-wider text-center">7D Chart</th>
                <th className="w-10 px-3 py-2 md:px-4 md:py-3.5" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock) => {
                const changeVal = Number(stock.change) || 0;
                const isPositive = changeVal >= 0;
                const isStarred = watchlist.includes(stock.ticker);
                const priceVal = Number(stock.price) || 0;
                const highVal = Number(stock.fiftyTwoWeekRange?.high) || 0;
                const lowVal = Number(stock.fiftyTwoWeekRange?.low) || 0;
                const epsVal = Number(stock.eps) || 0;
                const bvpsVal = Number(stock.bvps) || 0;
                const peVal = Number(stock.peRatio) || 0;
                return (
                  <tr key={stock.ticker} className="border-t border-border hover:bg-bg-hover transition-colors cursor-pointer group" onClick={() => setSelectedTicker(stock.ticker)}>
                    <td className="px-3 py-2 text-center sticky left-0 z-10 bg-bg-surface group-hover:bg-bg-hover transition-colors" onClick={(e) => { e.stopPropagation(); toggleWatchlist(stock.ticker); }}>
                      <button className="p-1 rounded hover:bg-bg-hover transition-colors focus:outline-none flex items-center justify-center mx-auto" title={isStarred ? 'Remove from watchlist' : 'Add to watchlist'}>
                        <Star className={`w-4 h-4 transition-transform active:scale-125 ${isStarred ? 'text-brand-primary fill-brand-primary' : 'text-text-muted hover:text-brand-primary'}`} />
                      </button>
                    </td>
                    <td className="px-2 py-2 sticky left-9 z-10 bg-bg-surface group-hover:bg-bg-hover transition-colors shadow-sm" onClick={() => setSelectedTicker(stock.ticker)}>
                      <div className="flex items-center gap-2 min-w-[110px] md:min-w-[130px]">
                        <StockAvatar ticker={stock.ticker} sector={stock.sector} logoUrl={stock.logoUrl} />
                        <div><div className="text-[10px] md:text-[12px] font-extrabold text-text-primary font-sora leading-none">{stock.ticker}</div><div className="text-[9px] font-medium text-text-muted mt-0.5">{(stock.name || '').split(' ')[0].toUpperCase()}</div></div>
                      </div>
                    </td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right"><span className="text-[11px] md:text-[13px] font-bold text-text-primary font-sora">₦{priceVal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right"><span className="text-[10px] md:text-[12px] font-bold text-gain font-sora">₦{highVal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right"><span className="text-[10px] md:text-[12px] font-bold text-danger font-sora">₦{lowVal.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right"><span className="text-[10px] md:text-[12px] font-bold text-text-secondary font-sora">₦{epsVal.toFixed(2)}</span></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right"><span className="text-[10px] md:text-[12px] font-bold text-text-secondary font-sora">₦{bvpsVal.toFixed(2)}</span></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right"><span className="text-[10px] md:text-[12px] font-bold text-text-secondary font-sora">{peVal.toFixed(1)}x</span></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-center"><RatingBadge rating={stock.rating} /></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5"><div className="flex justify-center"><Sparkline data={stock.sparkline} positive={isPositive} /></div></td>
                    <td className="px-3 py-2 md:px-4 md:py-3.5" onClick={(e) => e.stopPropagation()}>
                      <div className="relative">
                        <button onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === stock.ticker ? null : stock.ticker); }} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover focus:outline-none opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></button>
                        {menuOpen === stock.ticker && (
                          <div className="absolute right-0 top-full mt-1 z-50 rounded-xl border border-border bg-bg-surface shadow-2xl overflow-hidden min-w-[140px]">
                            <button onClick={() => { toggleWatchlist(stock.ticker); setMenuOpen(null); }} className="w-full px-4 py-2.5 text-left text-[10px] md:text-[12px] font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary">{watchlist.includes(stock.ticker) ? '★ Remove Watchlist' : '☆ Add to Watchlist'}</button>
                            <button onClick={() => { setSelectedTicker(stock.ticker); setMenuOpen(null); }} className="w-full px-4 py-2.5 text-left text-[10px] md:text-[12px] font-medium text-text-secondary hover:bg-bg-hover hover:text-text-primary">View Details</button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={11} className="px-4 py-16 text-center text-[11px] md:text-[13px] font-medium text-text-muted">No stocks match your search.</td></tr>}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-6 py-4 border-t border-border text-[10px] md:text-[12px] font-medium text-text-muted bg-bg-raised">
          <span>Showing all <strong className="text-text-primary font-semibold">{filtered.length}</strong> equities {sector !== 'All' ? `in ${sector}` : ''}</span>
          <span className="text-gain font-semibold flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-gain animate-pulse" />Live Market Data</span>
        </div>
      </div>
    </div>
  );
}
