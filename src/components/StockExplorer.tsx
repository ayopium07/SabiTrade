'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAppStore } from '@/lib/store';

// ── Mini Sparkline SVG ─────────────────────────────────────────
function Sparkline({ data, positive }: { data: number[]; positive: boolean }) {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 80;
  const h = 32;
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(' ');
  const color = positive ? '#00D395' : '#FF4D4F';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <polyline points={points} stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" fill="none" />
    </svg>
  );
}

// ── Sector-coloured stock avatar ───────────────────────────────
const SECTOR_COLORS: Record<string, { bg: string; text: string }> = {
  Banking: { bg: '#1A3A5C', text: '#53A6F6' },
  'Consumer Goods': { bg: '#3A1A1A', text: '#FF7B7B' },
  'Oil & Gas': { bg: '#1A2E1A', text: '#00D395' },
  Industrials: { bg: '#2A1A3A', text: '#B275FF' },
  Agriculture: { bg: '#2E2A10', text: '#CFA343' },
  Conglomerates: { bg: '#1A2A2A', text: '#53D6D6' },
};

function StockAvatar({ ticker, sector }: { ticker: string; sector: string }) {
  const colors = SECTOR_COLORS[sector] ?? { bg: '#1E1E2E', text: '#888' };
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-extrabold font-sora flex-shrink-0"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.text}22` }}
    >
      {ticker.slice(0, 2)}
    </div>
  );
}

// ── Rating badge ───────────────────────────────────────────────
function RatingBadge({ rating }: { rating: string }) {
  const map: Record<string, { label: string; bg: string; color: string }> = {
    Outperform: { label: 'Watch', bg: 'rgba(0,211,149,0.12)', color: '#00D395' },
    Neutral: { label: 'Neutral', bg: 'rgba(207,163,67,0.12)', color: '#CFA343' },
    Underperform: { label: 'Bearish', bg: 'rgba(255,77,79,0.12)', color: '#FF4D4F' },
  };
  const style = map[rating] ?? map.Neutral;
  return (
    <span
      className="text-[9px] md:text-[11px] font-bold px-3 py-1 rounded-md whitespace-nowrap"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  );
}

// ── Sort header cell ───────────────────────────────────────────
type SortField = 'ticker' | 'price' | 'change' | 'target' | 'upside' | 'rating' | 'high' | 'low' | 'eps' | 'bvps' | 'peRatio';

function SortTh({
  field, label, active, order, onClick, align = 'left',
}: {
  field: SortField; label: React.ReactNode; active: boolean; order: 'asc' | 'desc';
  onClick: () => void; align?: 'left' | 'right' | 'center';
}) {
  return (
    <th
      onClick={onClick}
      className={`px-3 py-2 md:px-4 md:py-3.5 text-[9px] md:text-[11px] font-bold text-[#7B7E8E] uppercase tracking-wider cursor-pointer select-none whitespace-nowrap hover:text-white transition-colors ${align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left'
        }`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="flex flex-col leading-none ml-0.5">
          <ChevronUp className={`w-2.5 h-2.5 ${active && order === 'asc' ? 'text-white' : 'text-[#44475A]'}`} />
          <ChevronDown className={`w-2.5 h-2.5 ${active && order === 'desc' ? 'text-white' : 'text-[#44475A]'}`} />
        </span>
      </span>
    </th>
  );
}

const PAGE_SIZE = 10;

// ── Main Component ─────────────────────────────────────────────
export default function StockExplorer() {
  const stocks = useAppStore((s) => s.stocks);
  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const toggleWatchlist = useAppStore((s) => s.toggleWatchlist);
  const watchlist = useAppStore((s) => s.watchlist);

  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('All');
  const [sortBy, setSortBy] = useState<SortField>('price');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const sectors = ['All', 'Banking', 'Consumer Goods', 'Oil & Gas', 'Industrials'];

  // ── Filter + sort ──────────────────────────────────────────
  const filtered = useMemo(() => {
    return stocks
      .filter((s) => {
        const q = search.toLowerCase();
        const matchQ = s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q);
        const matchS = sector === 'All' || s.sector === sector;
        return matchQ && matchS;
      })
      .sort((a, b) => {
        let cmp = 0;
        if (sortBy === 'ticker') cmp = a.ticker.localeCompare(b.ticker);
        if (sortBy === 'price') cmp = a.price - b.price;
        if (sortBy === 'change') cmp = a.change - b.change;
        if (sortBy === 'target') cmp = a.targetPrice - b.targetPrice;
        if (sortBy === 'upside') cmp = ((a.targetPrice - a.price) / a.price) - ((b.targetPrice - b.price) / b.price);
        if (sortBy === 'rating') cmp = a.rating.localeCompare(b.rating);
        if (sortBy === 'high') cmp = a.fiftyTwoWeekRange.high - b.fiftyTwoWeekRange.high;
        if (sortBy === 'low') cmp = a.fiftyTwoWeekRange.low - b.fiftyTwoWeekRange.low;
        if (sortBy === 'eps') cmp = a.eps - b.eps;
        if (sortBy === 'bvps') cmp = a.bvps - b.bvps;
        if (sortBy === 'peRatio') cmp = a.peRatio - b.peRatio;
        return sortOrder === 'desc' ? -cmp : cmp;
      });
  }, [stocks, search, sector, sortBy, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field: SortField) => {
    if (sortBy === field) setSortOrder(o => o === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortOrder('desc'); }
    setPage(1);
  };

  const toggleCheck = (ticker: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      next.has(ticker) ? next.delete(ticker) : next.add(ticker);
      return next;
    });
  };

  const SORT_LABELS: Record<SortField, string> = {
    ticker: 'Ticker', price: 'Close Price', change: 'Upside/Downside',
    target: 'Our Target', upside: 'Upside %', rating: 'Rating',
    high: '52W High', low: '52W Low', eps: 'EPS', bvps: 'BVPS', peRatio: 'P/E Ratio',
  };

  return (
    <div className="w-full flex flex-col gap-0" onClick={() => setMenuOpen(null)}>

      {/* ── Header bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Sector tabs */}
        <div className="flex items-center gap-2 flex-wrap">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => { setSector(s); setPage(1); }}
              className="px-4 py-2 rounded-lg text-[10px] md:text-[12px] font-bold transition-all focus:outline-none"
              style={{
                background: sector === s ? '#CFA343' : 'rgba(255,255,255,0.05)',
                color: sector === s ? '#0E0B14' : '#94A3B8',
                border: sector === s ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Search + sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#7B7E8E]" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search NGX stock (e.g Zenith, DANGCEM)..."
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-[10px] md:text-[12px] font-medium bg-[#141020] border border-white/8 text-white placeholder:text-[#44475A] focus:outline-none focus:border-[#CFA343]/40"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === '__sort__' ? null : '__sort__'); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-[10px] md:text-[12px] font-bold text-[#94A3B8] bg-[#141020] border border-white/8 hover:border-white/20 transition-colors focus:outline-none whitespace-nowrap"
            >
              Sort: {SORT_LABELS[sortBy]} {sortOrder === 'desc' ? '↓' : '↑'}
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            {menuOpen === '__sort__' && (
              <div
                className="absolute right-0 top-full mt-1 z-50 rounded-xl border border-white/8 bg-[#141020] shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {(Object.entries(SORT_LABELS) as [SortField, string][]).map(([field, label]) => (
                  <button
                    key={field}
                    onClick={() => { handleSort(field); setMenuOpen(null); }}
                    className="w-full px-4 py-2.5 text-left text-[10px] md:text-[12px] font-medium hover:bg-white/5 transition-colors whitespace-nowrap"
                    style={{ color: sortBy === field ? '#CFA343' : '#94A3B8' }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-white/8 overflow-hidden" style={{ background: '#0F0D1A' }}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr style={{ background: '#12101E' }}>
                {/* Checkbox — sticky col 1 */}
                <th className="w-10 px-3 py-2 md:px-4 md:py-3.5 sticky left-0 z-20" style={{ background: '#12101E', boxShadow: 'none' }} />
                {/* No. — sticky col 2 */}
                <th className="px-3 py-2 md:px-4 md:py-3.5 text-[9px] md:text-[11px] font-bold text-[#7B7E8E] uppercase tracking-wider text-left w-14 sticky left-10 z-20" style={{ background: '#12101E' }}>
                  <span className="inline-flex items-center gap-1">No. <span className="flex flex-col leading-none"><ChevronUp className="w-2.5 h-2.5 text-[#44475A]" /><ChevronDown className="w-2.5 h-2.5 text-[#44475A]" /></span></span>
                </th>
                {/* Company — sticky col 3 */}
                <th className="px-3 py-2 md:px-4 md:py-3.5 text-[9px] md:text-[11px] font-bold text-[#7B7E8E] uppercase tracking-wider text-left sticky left-24 z-20" style={{ background: '#12101E', boxShadow: '4px 0 8px -2px rgba(0,0,0,0.5)' }}>
                  <span className="inline-flex items-center gap-1">Company <span className="flex flex-col leading-none ml-0.5"><ChevronUp className={`w-2.5 h-2.5 ${sortBy === 'ticker' && sortOrder === 'asc' ? 'text-white' : 'text-[#44475A]'}`} /><ChevronDown className={`w-2.5 h-2.5 ${sortBy === 'ticker' && sortOrder === 'desc' ? 'text-white' : 'text-[#44475A]'}`} /></span></span>
                </th>
                <SortTh field="price" label="Close Price" active={sortBy === 'price'} order={sortOrder} onClick={() => handleSort('price')} align="right" />
                <th className="px-3 py-2 md:px-4 md:py-3.5 text-[9px] md:text-[11px] font-bold text-[#7B7E8E] uppercase tracking-wider text-center">7D Chart</th>
                <SortTh field="high" label="52W High" active={sortBy === 'high'} order={sortOrder} onClick={() => handleSort('high')} align="right" />
                <SortTh field="low" label="52W Low" active={sortBy === 'low'} order={sortOrder} onClick={() => handleSort('low')} align="right" />
                <SortTh field="eps" label="EPS" active={sortBy === 'eps'} order={sortOrder} onClick={() => handleSort('eps')} align="right" />
                <SortTh field="bvps" label="BVPS" active={sortBy === 'bvps'} order={sortOrder} onClick={() => handleSort('bvps')} align="right" />
                <SortTh field="peRatio" label="P/E Ratio" active={sortBy === 'peRatio'} order={sortOrder} onClick={() => handleSort('peRatio')} align="right" />
                <SortTh field="target" label="Fair Value" active={sortBy === 'target'} order={sortOrder} onClick={() => handleSort('target')} align="right" />
                <SortTh field="change" label={<span className="flex flex-col leading-tight items-center text-center"><span>Upside</span><span>Downside</span></span>} active={sortBy === 'change'} order={sortOrder} onClick={() => handleSort('change')} align="center" />
                <SortTh field="rating" label="Consensus Rating" active={sortBy === 'rating'} order={sortOrder} onClick={() => handleSort('rating')} align="center" />
                {/* Actions */}
                <th className="w-10 px-3 py-2 md:px-4 md:py-3.5" />
              </tr>
            </thead>
            <tbody>
              {paged.map((stock, idx) => {
                const rowNum = String((page - 1) * PAGE_SIZE + idx + 1).padStart(2, '0');
                const isPositive = stock.change >= 0;
                const isChecked = checked.has(stock.ticker);
                const upside = ((stock.targetPrice - stock.price) / stock.price) * 100;

                return (
                  <tr
                    key={stock.ticker}
                    className="border-t border-white/5 hover:bg-white/[0.025] transition-colors cursor-pointer group"
                    onClick={() => setSelectedTicker(stock.ticker)}
                  >
                    {/* Checkbox — sticky */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 sticky left-0 z-10" style={{ background: '#0F0D1A' }} onClick={(e) => { e.stopPropagation(); toggleCheck(stock.ticker); }}>
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center transition-colors cursor-pointer"
                        style={{
                          background: isChecked ? '#CFA343' : 'transparent',
                          border: isChecked ? '1px solid #CFA343' : '1px solid #44475A',
                        }}
                      >
                        {isChecked && (
                          <svg className="w-2.5 h-2.5 text-[#0E0B14]" fill="none" viewBox="0 0 10 8">
                            <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                    </td>

                    {/* Row number — sticky */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 sticky left-10 z-10" style={{ background: '#0F0D1A' }}>
                      <span className="text-[10px] md:text-[12px] font-bold text-[#7B7E8E] font-sora">{rowNum}</span>
                    </td>

                    {/* Company — sticky */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 sticky left-24 z-10" style={{ background: '#0F0D1A', boxShadow: '4px 0 8px -2px rgba(0,0,0,0.5)' }}
                      onClick={() => setSelectedTicker(stock.ticker)}
                    >
                      <div className="flex items-center gap-3 min-w-[130px] md:min-w-[160px]">
                        <StockAvatar ticker={stock.ticker} sector={stock.sector} />
                        <div>
                          <div className="text-[11px] md:text-[13px] font-extrabold text-white font-sora leading-none">{stock.ticker}</div>
                          <div className="text-[10px] font-medium text-[#7B7E8E] mt-0.5">{stock.name.split(' ')[0].toUpperCase()}</div>
                        </div>
                      </div>
                    </td>

                    {/* Close Price */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right">
                      <span className="text-[11px] md:text-[13px] font-bold text-white font-sora">
                        ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* 7D Sparkline */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5">
                      <div className="flex justify-center">
                        <Sparkline data={stock.sparkline} positive={isPositive} />
                      </div>
                    </td>

                    {/* 52W High */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right">
                      <span className="text-[10px] md:text-[12px] font-bold text-[#00D395] font-sora">
                        ₦{stock.fiftyTwoWeekRange.high.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* 52W Low */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right">
                      <span className="text-[10px] md:text-[12px] font-bold text-[#FF4D4F] font-sora">
                        ₦{stock.fiftyTwoWeekRange.low.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* EPS */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right">
                      <span className="text-[10px] md:text-[12px] font-bold text-[#94A3B8] font-sora">
                        ₦{stock.eps.toFixed(2)}
                      </span>
                    </td>

                    {/* BVPS */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right">
                      <span className="text-[10px] md:text-[12px] font-bold text-[#94A3B8] font-sora">
                        ₦{stock.bvps.toFixed(2)}
                      </span>
                    </td>

                    {/* P/E Ratio */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right">
                      <span className="text-[10px] md:text-[12px] font-bold text-[#94A3B8] font-sora">
                        {stock.peRatio.toFixed(1)}x
                      </span>
                    </td>

                    {/* Fair Value */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-right">
                      <span className="text-[11px] md:text-[13px] font-bold text-white font-sora">
                        ₦{stock.targetPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    {/* Upside/Downside badge */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-center">
                      <span
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[9px] md:text-[11px] font-bold"
                        style={{
                          background: isPositive ? 'rgba(0,211,149,0.12)' : 'rgba(255,77,79,0.12)',
                          color: isPositive ? '#00D395' : '#FF4D4F',
                        }}
                      >
                        {isPositive
                          ? <ChevronUp className="w-3 h-3" />
                          : <ChevronDown className="w-3 h-3" />}
                        {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                      </span>
                    </td>

                    {/* Consensus Rating */}
                    <td className="px-3 py-2 md:px-4 md:py-3.5 text-center">
                      <RatingBadge rating={stock.rating} />
                    </td>

                    {/* Actions */}
                    <td
                      className="px-3 py-2 md:px-4 md:py-3.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === stock.ticker ? null : stock.ticker); }}
                          className="p-1.5 rounded-lg text-[#44475A] hover:text-white hover:bg-white/5 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {menuOpen === stock.ticker && (
                          <div className="absolute right-0 top-full mt-1 z-50 rounded-xl border border-white/8 bg-[#141020] shadow-2xl overflow-hidden min-w-[140px]">
                            <button
                              onClick={() => { toggleWatchlist(stock.ticker); setMenuOpen(null); }}
                              className="w-full px-4 py-2.5 text-left text-[10px] md:text-[12px] font-medium text-[#94A3B8] hover:bg-white/5 hover:text-white transition-colors"
                            >
                              {watchlist.includes(stock.ticker) ? '★ Remove Watchlist' : '☆ Add to Watchlist'}
                            </button>
                            <button
                              onClick={() => { setSelectedTicker(stock.ticker); setMenuOpen(null); }}
                              className="w-full px-4 py-2.5 text-left text-[10px] md:text-[12px] font-medium text-[#94A3B8] hover:bg-white/5 hover:text-white transition-colors"
                            >
                              View Details
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}

              {paged.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-[11px] md:text-[13px] font-medium text-[#7B7E8E]">
                    No stocks match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/5" style={{ background: '#12101E' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] md:text-[12px] font-bold text-[#94A3B8] border border-white/8 hover:border-white/20 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            Previous
          </button>

          <span className="text-[10px] md:text-[12px] font-medium text-[#7B7E8E]">
            Page {page} of {totalPages}
          </span>

          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] md:text-[12px] font-bold text-[#94A3B8] border border-white/8 hover:border-white/20 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-none"
          >
            Next
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
