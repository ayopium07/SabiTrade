import React from 'react';
import { TrendingUp, TrendingDown, Clock, Zap } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function MarketStatus() {
  const data = useAppStore((state) => state.indexData);
  const stocks = useAppStore((state) => state.stocks);
  const isPositive = data.change >= 0;

  // Get marquee tickers dynamically from the active stocks list
  const tickerItems = stocks.slice(0, 8).map(s => ({
    label: s.ticker,
    value: `₦${s.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
    change: `${s.change >= 0 ? '+' : ''}${s.change.toFixed(1)}%`,
    up: s.change >= 0
  }));

  // Duplicate for seamless loop
  const allTickers = [...tickerItems, ...tickerItems];
  const today = new Date().toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div className="rounded-2xl overflow-hidden border border-border" style={{ background: 'linear-gradient(145deg, #0E0D25 0%, #070615 100%)' }}>
      {/* ── Top Ticker Strip ───────────────────────────────── */}
      <div className="overflow-hidden border-b border-border/60 bg-bg-base/40">
        <div className="ticker-track py-1.5">
          {allTickers.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-5 text-[10px] font-bold font-dm-sans flex-shrink-0">
              <span className="text-text-secondary uppercase tracking-wider">{item.label}</span>
              <span className="text-text-primary font-sora">{item.value}</span>
              <span className={item.up ? 'text-gain text-glow-green-sm' : 'text-danger'}>
                {item.change}
              </span>
              <span className="text-border ml-2">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main ASI Status ────────────────────────────────── */}
      <div className="p-4 sm:p-6 relative">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)' }} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          {/* Left — Index Value */}
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans">
                Nigerian Exchange · All-Share Index
              </span>
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold ${
                data.status === 'Open'
                  ? 'bg-gain/10 border border-gain/25 text-gain'
                  : 'bg-text-muted/20 border border-border text-text-secondary'
              }`}>
                <span className={`h-1.5 w-1.5 rounded-full ${
                  data.status === 'Open' ? 'bg-gain animate-pulse-glow' : 'bg-text-secondary'
                }`} />
                {data.status === 'Open' ? 'LIVE' : 'CLOSED'}
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <h2 className={`text-3xl sm:text-4xl font-extrabold font-sora tracking-tight ${
                isPositive ? 'text-gain text-glow-green' : 'text-danger text-glow-red'
              }`}>
                ₦{data.allShareIndex.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </h2>
              <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-lg ${
                isPositive
                  ? 'bg-gain/10 text-gain border border-gain/20'
                  : 'bg-danger/10 text-danger border border-danger/20'
              }`}>
                {isPositive
                  ? <TrendingUp className="h-3.5 w-3.5" />
                  : <TrendingDown className="h-3.5 w-3.5" />}
                <span>{isPositive ? '+' : ''}{data.change}%</span>
              </div>
            </div>

            <p className="text-xs text-text-secondary font-medium mt-1.5 font-dm-sans">
              Market Cap: <span className="text-text-primary font-bold">{data.marketCap}</span>
              <span className="mx-2 text-border">·</span>
              Volume: <span className="text-text-primary font-bold">{data.volume}</span>
              <span className="mx-2 text-border">·</span>
              Deals: <span className="text-text-primary font-bold">{data.deals}</span>
            </p>
          </div>

          {/* Right — Date & Delay Warning */}
          <div className="flex flex-col sm:items-end gap-2">
            <div className="flex items-center gap-1.5 text-xs text-text-secondary font-medium">
              <Clock className="h-3.5 w-3.5 text-brand-primary/70" />
              <span>{today}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-warning/5 text-warning/80 px-2.5 py-1 rounded-lg border border-warning/15 text-[10px] font-bold">
              <Zap className="h-3 w-3 flex-shrink-0" />
              <span>15-min delayed NGX feed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
