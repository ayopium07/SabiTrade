import React, { useState } from 'react';
import { Briefcase, Plus, TrendingUp, TrendingDown, Trash2, LayoutGrid } from 'lucide-react';
import { ngxStocks } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

const DONUT_COLORS = ['#6366F1', '#10B981', '#00B8FF', '#FFB800', '#FF4D4D', '#A855F7'];

export default function PortfolioTracker() {
  const portfolio = useAppStore((state) => state.portfolio);
  const addHolding = useAppStore((state) => state.addHolding);
  const removeHolding = useAppStore((state) => state.removeHolding);
  const setSelectedTicker = useAppStore((state) => state.setSelectedTicker);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tickerSelect, setTickerSelect] = useState('ZENITHBANK');
  const [sharesInput, setSharesInput] = useState('');
  const [priceInput, setPriceInput] = useState('');

  // ── Portfolio Metrics ─────────────────────────────────
  let totalCostBasis = 0;
  let totalCurrentValue = 0;
  let totalTodayChange = 0;

  const holdingsDetails = portfolio.map((holding) => {
    const stock = ngxStocks.find((s) => s.ticker === holding.ticker) || ngxStocks[0];
    const costBasis = holding.shares * holding.buyPrice;
    const currentValue = holding.shares * stock.price;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const todayChangeAmount = holding.shares * stock.changeAmount;
    totalCostBasis += costBasis;
    totalCurrentValue += currentValue;
    totalTodayChange += todayChangeAmount;
    return { ...holding, stock, costBasis, currentValue, pnl, pnlPercent, todayChangeAmount };
  });

  const totalAllTimePnl = totalCurrentValue - totalCostBasis;
  const totalAllTimePnlPercent = totalCostBasis > 0 ? (totalAllTimePnl / totalCostBasis) * 100 : 0;
  const totalTodayPnlPercent = totalCurrentValue > 0 ? (totalTodayChange / totalCurrentValue) * 100 : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = parseInt(sharesInput);
    const selectedStock = ngxStocks.find(s => s.ticker === tickerSelect) || ngxStocks[0];
    const price = parseFloat(priceInput) || selectedStock.price;
    if (shares > 0) {
      addHolding(tickerSelect, shares, price);
      setSharesInput(''); setPriceInput(''); setIsAddOpen(false);
    }
  };

  // ── Donut Chart ───────────────────────────────────────
  let accumulatedAngle = 0;
  const donutSlices = holdingsDetails.map((h, i) => {
    const percentage = totalCurrentValue > 0 ? h.currentValue / totalCurrentValue : 0;
    const angle = percentage * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const describeArc = (x: number, y: number, r: number, sA: number, eA: number) => {
      const start = polarToCartesian(x, y, r, eA);
      const end = polarToCartesian(x, y, r, sA);
      const large = eA - sA <= 180 ? '0' : '1';
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
    };

    return {
      ticker: h.ticker,
      percentage,
      path: describeArc(100, 100, 68, startAngle, startAngle + angle),
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    };
  });

  const cardStyle = {
    background: 'linear-gradient(145deg, #0E0D25, #070615)',
    border: '1px solid #23214C',
  };

  return (
    <div className="space-y-6">
      {/* ── Stats Row ────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Value */}
        <div className="p-5 rounded-2xl relative overflow-hidden" style={cardStyle}>
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)' }} />
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
            Total Valuation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-sora tracking-tight mb-1 text-brand-primary"
            style={{ textShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
            ₦{totalCurrentValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </h2>
          <div className="text-[10px] text-text-secondary font-dm-sans">
            Cost basis: <span className="text-text-primary font-bold">₦{totalCostBasis.toLocaleString('en-NG')}</span>
          </div>
        </div>

        {/* Today's P&L */}
        <div className="p-5 rounded-2xl" style={cardStyle}>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
            Today&apos;s Return
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-sora tracking-tight ${
              totalTodayChange >= 0 ? 'text-gain' : 'text-danger'
            }`}
              style={{ textShadow: totalTodayChange >= 0 ? '0 0 16px rgba(16,185,129,0.3)' : '0 0 16px rgba(255,77,77,0.3)' }}>
              {totalTodayChange >= 0 ? '+' : ''}₦{totalTodayChange.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </h2>
            <span className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-lg ${
              totalTodayChange >= 0 ? 'bg-gain/10 text-gain border border-gain/20' : 'bg-danger/10 text-danger'
            }`}>
              {totalTodayChange >= 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
              {totalTodayChange >= 0 ? '+' : ''}{totalTodayPnlPercent.toFixed(2)}%
            </span>
          </div>
          <span className="text-[9px] text-text-secondary font-dm-sans uppercase">Since NGX open</span>
        </div>

        {/* All-time P&L */}
        <div className="p-5 rounded-2xl" style={cardStyle}>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
            All-Time P&amp;L
          </span>
          <div className="flex items-baseline gap-2 mb-1">
            <h2 className={`text-2xl sm:text-3xl font-extrabold font-sora tracking-tight ${
              totalAllTimePnl >= 0 ? 'text-gain' : 'text-danger'
            }`}
              style={{ textShadow: totalAllTimePnl >= 0 ? '0 0 16px rgba(16,185,129,0.3)' : '0 0 16px rgba(255,77,77,0.3)' }}>
              {totalAllTimePnl >= 0 ? '+' : ''}₦{totalAllTimePnl.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </h2>
            <span className={`inline-flex text-xs font-bold px-1.5 py-0.5 rounded-lg ${
              totalAllTimePnl >= 0 ? 'bg-gain/10 text-gain border border-gain/20' : 'bg-danger/10 text-danger'
            }`}>
              {totalAllTimePnl >= 0 ? '+' : ''}{totalAllTimePnlPercent.toFixed(2)}%
            </span>
          </div>
          <span className="text-[9px] text-text-secondary font-dm-sans uppercase">Unrealised ledger P&L</span>
        </div>
      </div>

      {/* ── Donut & Holdings ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Donut Chart */}
        {portfolio.length > 0 && (
          <div className="md:col-span-4 p-5 rounded-2xl space-y-4" style={cardStyle}>
            <h3 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Allocation
            </h3>
            <div className="relative w-44 h-44 mx-auto">
              <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                {/* Dark ring background */}
                <circle cx="100" cy="100" r="68" fill="none" stroke="#23214C" strokeWidth="20" />
                {donutSlices.map((slice) => (
                  <path key={slice.ticker} d={slice.path} fill="none"
                    stroke={slice.color} strokeWidth="20"
                    style={{ filter: `drop-shadow(0 0 6px ${slice.color}60)` }} />
                ))}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-text-secondary font-bold uppercase tracking-wider">Assets</span>
                <span className="text-lg font-extrabold text-brand-primary font-sora">{portfolio.length}</span>
                <span className="text-[9px] text-text-secondary">Equities</span>
              </div>
            </div>
            <div className="space-y-1.5 pt-2 border-t border-border/50">
              {donutSlices.map((slice) => (
                <div key={slice.ticker} className="flex items-center justify-between text-xs font-medium font-dm-sans">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: slice.color, boxShadow: `0 0 4px ${slice.color}80` }} />
                    <span className="font-bold text-text-primary uppercase text-[11px]">{slice.ticker}</span>
                  </div>
                  <span className="text-text-secondary font-sora text-[10px]">
                    {(slice.percentage * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Holdings Table */}
        <div className={`${portfolio.length > 0 ? 'md:col-span-8' : 'md:col-span-12'} space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Tracked Holdings
            </h3>
            <button onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold focus:outline-none transition-all text-bg-base"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
              <Plus className="h-3.5 w-3.5" />
              Record Purchase
            </button>
          </div>

          <div className="rounded-2xl overflow-hidden" style={cardStyle}>
            {holdingsDetails.length > 0 ? (
              <div className="divide-y divide-border/50">
                <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border/50 text-[9px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans"
                  style={{ background: 'rgba(0,0,0,0.3)' }}>
                  <div className="col-span-4">Equity</div>
                  <div className="col-span-2 text-right">Holdings</div>
                  <div className="col-span-2 text-right">Cost Price</div>
                  <div className="col-span-2 text-right">Current Val</div>
                  <div className="col-span-2 text-center">P&L / Del</div>
                </div>
                {holdingsDetails.map((h, idx) => {
                  const isPos = h.pnl >= 0;
                  const color = DONUT_COLORS[idx % DONUT_COLORS.length];
                  return (
                    <div key={h.ticker} onClick={() => setSelectedTicker(h.ticker)}
                      className="grid grid-cols-12 gap-2 sm:gap-4 items-center px-4 sm:px-5 py-4 cursor-pointer group transition-all"
                      style={{ borderLeft: '2px solid transparent' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(99,102,241,0.02)';
                        (e.currentTarget as HTMLDivElement).style.borderLeftColor = color;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                        (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent';
                      }}>
                      <div className="col-span-7 sm:col-span-4 flex items-center gap-3">
                        <span className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }} />
                        <div className="truncate">
                          <span className="text-sm font-extrabold font-sora tracking-tight group-hover:underline"
                            style={{ color }}>{h.ticker}</span>
                          <p className="text-xs text-text-secondary font-medium font-dm-sans truncate">{h.stock.name}</p>
                        </div>
                      </div>
                      <div className="col-span-3 sm:col-span-2 text-right">
                        <span className="text-xs font-extrabold text-text-primary font-sora">{h.shares.toLocaleString()}</span>
                        <span className="block text-[9px] text-text-secondary font-dm-sans uppercase">shares</span>
                      </div>
                      <div className="hidden sm:block col-span-2 text-right">
                        <span className="text-xs font-bold text-text-secondary font-sora">₦{h.buyPrice.toLocaleString()}</span>
                        <span className="block text-[9px] text-text-secondary font-dm-sans">₦{h.costBasis.toLocaleString()}</span>
                      </div>
                      <div className="col-span-2 text-right">
                        <span className="text-xs font-extrabold text-text-primary font-sora">
                          ₦{h.currentValue.toLocaleString('en-NG')}
                        </span>
                      </div>
                      <div className="col-span-12 sm:col-span-2 flex items-center justify-between sm:justify-center gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40 border-dashed">
                        <div className="hidden sm:block text-right">
                          <span className={`text-xs font-extrabold font-sora ${isPos ? 'text-gain' : 'text-danger'}`}
                            style={{ textShadow: isPos ? '0 0 8px rgba(16,185,129,0.4)' : '0 0 8px rgba(255,77,77,0.3)' }}>
                            {isPos ? '+' : ''}₦{h.pnl.toLocaleString('en-NG')}
                          </span>
                          <span className={`block text-[9px] font-bold ${isPos ? 'text-gain' : 'text-danger'}`}>
                            {isPos ? '+' : ''}{h.pnlPercent.toFixed(1)}%
                          </span>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); removeHolding(h.ticker); }}
                          className="p-1.5 rounded-lg text-text-secondary hover:text-danger hover:bg-danger/10 border border-transparent hover:border-danger/20 transition-all focus:outline-none">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-text-secondary font-dm-sans">
                <LayoutGrid className="h-8 w-8 text-text-secondary/40 mx-auto mb-3" />
                <p className="text-sm font-bold text-text-primary mb-1">Portfolio is Empty</p>
                <p className="text-xs mb-5 max-w-sm mx-auto leading-relaxed">
                  Track your NGX holdings manually. Record your first buy to analyze yields!
                </p>
                <button onClick={() => setIsAddOpen(true)}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-bg-base transition-all focus:outline-none"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
                  Start tracking investments
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Add Holding Modal ─────────────────────────────── */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-4 animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
            style={{ background: '#0E0D25', border: '1px solid rgba(99,102,241,0.15)', boxShadow: '0 0 0 1px rgba(99,102,241,0.04), 0 40px 80px rgba(0,0,0,0.8)' }}>
            <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
              style={{ background: 'linear-gradient(90deg, transparent, #6366F1, transparent)' }} />

            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h3 className="text-sm font-extrabold text-brand-primary font-sora flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Record Buy Transaction
              </h3>
              <button onClick={() => setIsAddOpen(false)}
                className="text-text-secondary hover:text-text-primary text-sm font-bold focus:outline-none p-1">✕</button>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              {[
                { label: 'Select NGX Asset', el: (
                  <select value={tickerSelect} onChange={e => setTickerSelect(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
                    style={{ background: '#0E0D25', border: '1px solid #23214C' }}>
                    {ngxStocks.map(s => (
                      <option key={s.ticker} value={s.ticker} style={{ background: '#0E0D25' }}>
                        {s.ticker} — {s.name} (₦{s.price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                )},
                { label: 'Shares Purchased', el: (
                  <input type="number" required placeholder="e.g. 5,000" value={sharesInput}
                    onChange={e => setSharesInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none text-text-primary placeholder:text-text-secondary"
                    style={{ background: '#0E0D25', border: '1px solid #23214C' }} />
                )},
                { label: 'Buy Price per Share (₦)', el: (
                  <input type="number" step="0.01" placeholder="Leave empty for current price" value={priceInput}
                    onChange={e => setPriceInput(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none text-text-primary placeholder:text-text-secondary"
                    style={{ background: '#0E0D25', border: '1px solid #23214C' }} />
                )},
              ].map(({ label, el }) => (
                <div key={label}>
                  <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans mb-1.5">{label}</label>
                  {el}
                </div>
              ))}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button type="button" onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary border border-border/50 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-bg-base transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
                  Add Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
