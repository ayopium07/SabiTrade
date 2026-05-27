import React, { useState } from 'react';
import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { mockMovers } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function TopMovers() {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');
  const setSelectedTicker = useAppStore((state) => state.setSelectedTicker);

  const movers = activeTab === 'gainers' ? mockMovers.gainers : mockMovers.losers;
  const isGainerTab = activeTab === 'gainers';

  return (
    <div className="rounded-2xl border border-border overflow-hidden" style={{ background: 'linear-gradient(145deg, #0E0D25 0%, #070615 100%)' }}>
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 sm:pt-5 pb-3">
        <div>
          <h3 className="text-sm font-extrabold text-text-primary font-sora">Top Movers</h3>
          <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">NGX today · 15-min delay</p>
        </div>

        {/* Pill switcher */}
        <div className="flex bg-bg-base border border-border p-1 rounded-xl gap-1">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              isGainerTab
                ? 'bg-gain text-bg-base shadow-glow-green-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
              !isGainerTab
                ? 'bg-danger text-white shadow-glow-red'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingDown className="h-3 w-3" />
            Losers
          </button>
        </div>
      </div>

      {/* ── Scrollable Cards Strip ─────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 custom-scrollbar px-4 sm:px-5">
        {movers.map((stock) => {
          const isPos = stock.change > 0;
          const color = isPos ? '#10B981' : '#FF4D4D';
          const min = Math.min(...stock.sparkline);
          const max = Math.max(...stock.sparkline);
          const range = max - min || 1;
          const W = 140;
          const H = 36;

          // Build SVG path points
          const points = stock.sparkline.map((val, idx) => ({
            x: (idx / (stock.sparkline.length - 1)) * W,
            y: H - 4 - ((val - min) / range) * (H - 8),
          }));

          const linePath = points.reduce((d, p, i) => d + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
          const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`;

          return (
            <button
              key={stock.ticker}
              onClick={() => setSelectedTicker(stock.ticker)}
              className="flex-shrink-0 w-[168px] border rounded-xl p-3.5 text-left transition-all duration-300 group focus:outline-none relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #0E0D25, #070615)',
                borderColor: 'rgba(99,102,241,0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = isPos
                  ? 'rgba(16,185,129,0.3)'
                  : 'rgba(255,77,77,0.3)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = isPos
                  ? '0 0 20px rgba(16,185,129,0.1)'
                  : '0 0 20px rgba(255,77,77,0.1)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,230,118,0.08)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
              }}
            >
              {/* Top colored bar */}
              <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
                style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

              {/* Header row */}
              <div className="flex items-start justify-between gap-1 mb-2.5">
                <div>
                  <span className="text-xs font-extrabold font-sora uppercase"
                    style={{ color, textShadow: isPos ? '0 0 8px rgba(16,185,129,0.5)' : '0 0 8px rgba(255,77,77,0.4)' }}>
                    {stock.ticker}
                  </span>
                  <p className="text-[9px] text-text-secondary font-dm-sans truncate max-w-[90px] mt-0.5">
                    {stock.name}
                  </p>
                </div>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-lg ${
                  isPos ? 'bg-gain/10 text-gain border border-gain/20' : 'bg-danger/10 text-danger'
                }`}>
                  {isPos ? '+' : ''}{stock.change.toFixed(1)}%
                </span>
              </div>

              {/* Area sparkline */}
              <div className="h-9 w-full mb-2.5">
                <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`area-grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.25" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill={`url(#area-grad-${stock.ticker})`} />
                  <path d={linePath} fill="none" stroke={color} strokeWidth="1.8"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* Bottom price row */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold font-sora text-text-primary">
                    ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="block text-[8px] text-text-secondary font-dm-sans uppercase mt-0.5">
                    Vol: {stock.volume}
                  </span>
                </div>
                <div className="p-1.5 rounded-lg border border-border/60 group-hover:border-brand-primary/30 group-hover:bg-brand-primary/10 transition-colors">
                  <ArrowRight className="h-3 w-3 text-text-secondary group-hover:text-brand-primary transition-colors" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
