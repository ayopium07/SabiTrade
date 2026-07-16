import React, { useState } from 'react';
import { ArrowRight, TrendingUp, TrendingDown, BarChart2, Activity } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function TopMovers() {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers' | 'volume' | 'value'>('gainers');
  const setSelectedTicker = useAppStore((state) => state.setSelectedTicker);
  const stocks = useAppStore((state) => state.stocks);

  const getMovers = () => {
    switch (activeTab) {
      case 'gainers':
        return [...stocks].sort((a, b) => b.change - a.change).slice(0, 4);
      case 'losers':
        return [...stocks].sort((a, b) => a.change - b.change).slice(0, 4);
      case 'volume':
        return [...stocks].sort((a, b) => b.volumeRaw - a.volumeRaw).slice(0, 4);
      case 'value':
        return [...stocks].sort((a, b) => (b.price * b.volumeRaw) - (a.price * a.volumeRaw)).slice(0, 4);
      default:
        return [...stocks].sort((a, b) => b.change - a.change).slice(0, 4);
    }
  };
  
  const movers = getMovers();

  const getCryptoLogo = (ticker: string) => {
    switch (ticker) {
      case 'ACCESSCORP':
        return (
          <svg viewBox="0 0 32 32" className="w-6 h-6">
            <circle cx="16" cy="16" r="16" fill="#F7931A" />
            <path d="M21.5 15.5c.6-1.1.2-2.8-1.5-3.3l.7-2.6-1.6-.4-.7 2.6c-.4-.1-.8-.2-1.3-.3l.7-2.7-1.6-.4-.7 2.7c-1.1-.3-2.3-.6-3.1-.8l-1-.2-.4 1.7s.9.2.9.2c.5.1.6.4.5.7l-1 3.9c.1 0 .2.1.3.1l-.3-.1-1.3 5.4c-.1.3-.3.4-.6.3 0 0-.9-.2-.9-.2l-.6 1.8 1 .2c.4.1.8.2 1.2.3l-.7 2.7 1.6.4.7-2.6c.4.1.8.2 1.3.3l-.7 2.6 1.6.4.7-2.8c2.2.4 3.9.2 4.6-1.8.6-1.6-.1-2.5-1.1-3.1 1-.3 1.7-1 1.9-2zm-3.1 4.7c-.4 1.7-3.3.8-4.3.5l.8-3.1c1 .3 3.9.7 3.5 2.6zm.4-4.6c-.4 1.5-2.8.7-3.6.5l.7-2.8c.8.2 3.3.6 2.9 2.3z" fill="#FFF" />
          </svg>
        );
      case 'REDSTAREX':
        return (
          <svg viewBox="0 0 32 32" className="w-6 h-6">
            <circle cx="16" cy="16" r="16" fill="#F3BA2F" />
            <path d="M12.2 13.9l3.8-3.8 3.8 3.8 2.2-2.2-6-6-6 6 2.2 2.2zm7.6 4.2l-3.8 3.8-3.8-3.8-2.2 2.2 6 6 6-6-2.2-2.2zm-3.8-3.2l2.3 2.3 2.2-2.2-4.5-4.5-4.5 4.5 2.2 2.2 2.3-2.3zm7.8-1l2.2-2.2-2.2-2.2-2.2 2.2 2.2 2.2zm-15.6 0l2.2-2.2-2.2-2.2-2.2 2.2 2.2 2.2z" fill="#FFF" />
          </svg>
        );
      case 'JBERGER':
        return (
          <svg viewBox="0 0 32 32" className="w-6 h-6">
            <circle cx="16" cy="16" r="16" fill="#F05E32" />
            <path d="M16 23.5c-4.1 0-7.5-2.8-7.5-6.3 0-1.8.9-3.4 2.3-4.6l-1.3-3.6c-.2-.4 0-.8.3-.9.3-.1.7 0 .9.3l2.8 3.6c.8-.3 1.7-.4 2.6-.4s1.8.2 2.6.4l2.8-3.6c.2-.3.6-.4.9-.3.3.1.5.5.3.9l-1.3 3.6c1.4 1.2 2.3 2.8 2.3 4.6 0 3.5-3.4 6.3-7.5 6.3zm-3.5-5.3c.7 0 1.2-.5 1.2-1.2 0-.7-.5-1.2-1.2-1.2-.7 0-1.2.5-1.2 1.2 0 .7.5 1.2 1.2 1.2zm7 0c.7 0 1.2-.5 1.2-1.2 0-.7-.5-1.2-1.2-1.2-.7 0-1.2.5-1.2 1.2 0 .7.5 1.2 1.2 1.2z" fill="#FFF" />
          </svg>
        );
      case 'ZENITHBANK':
        return (
          <svg viewBox="0 0 32 32" className="w-6 h-6">
            <circle cx="16" cy="16" r="16" fill="#FF8D6C" />
            <path d="M22.5 19.5c0-.4-.2-.8-.6-1L16 15l-5.9 3.5c-.3.2-.6.5-.6 1 0 .9.7 1.6 1.6 1.6.4 0 .8-.2 1-.5l3.9-2.2 3.9 2.2c.2.3.6.5 1 .5.9 0 1.6-.7 1.6-1.6zm-6.5-9.6L9.6 13.7c-.3.2-.5.6-.5 1 0 .9.7 1.6 1.6 1.6.4 0 .8-.2 1-.5l4.3-2.5 4.3 2.5c.2.3.6.5 1 .5.9 0 1.6-.7 1.6-1.6 0-.4-.2-.8-.5-1l-6.4-3.8z" fill="#FFF" />
          </svg>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary text-[10px] font-bold">
            {ticker.charAt(0)}
          </div>
        );
    }
  };

  return (
    <div className="w-full">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-4 gap-4 md:gap-0">
        <div>
          <h3 className="text-lg font-bold text-text-primary font-sora">Top Movers</h3>
          <p className="text-[11px] text-text-secondary font-dm-sans mt-0.5">NGX today · 15-min delay</p>
        </div>

        {/* Pill switcher */}
        <div className="flex overflow-x-auto hide-scrollbar border border-border/40 p-1 rounded-2xl gap-1 flex-shrink-0 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('gainers')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              activeTab === 'gainers'
                ? 'bg-[#10B981] text-[#121212]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingUp className="h-3 w-3" />
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              activeTab === 'losers'
                ? 'bg-[#10B981] text-[#121212]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <TrendingDown className="h-3 w-3" />
            Losers
          </button>
          <button
            onClick={() => setActiveTab('volume')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              activeTab === 'volume'
                ? 'bg-[#10B981] text-[#121212]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <BarChart2 className="h-3 w-3" />
            Volume
          </button>
          <button
            onClick={() => setActiveTab('value')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
              activeTab === 'value'
                ? 'bg-[#10B981] text-[#121212]'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            <Activity className="h-3 w-3" />
            Value
          </button>
        </div>
      </div>

      {/* ── Cards Grid (Horizontal scroll on mobile, Grid on desktop) ─────────────────────────── */}
      <div className="flex overflow-x-auto pb-4 sm:pb-0 hide-scrollbar sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 snap-x snap-mandatory">
        {movers.map((stock) => {
          const isPos = stock.change > 0;
          const color = isPos ? '#10B981' : '#FF4D4D';
          const min = Math.min(...stock.sparkline);
          const max = Math.max(...stock.sparkline);
          const range = max - min || 1;
          const W = 160;
          const H = 60;

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
              className="snap-start flex-shrink-0 w-[220px] sm:w-auto border rounded-2xl text-left transition-all duration-300 group focus:outline-none relative overflow-hidden flex flex-col justify-between h-[160px]"
              style={{
                background: '#191A1D',
                borderColor: 'rgba(255,255,255,0.05)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = isPos
                  ? 'rgba(16,185,129,0.3)'
                  : 'rgba(255,77,77,0.3)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.05)';
              }}
            >
              <div className="p-5 pb-0">
                {/* Header row */}
                <div className="flex items-center gap-2 mb-4">
                  {getCryptoLogo(stock.ticker)}
                  <span className="text-[12px] font-bold font-sora text-text-primary">
                    {stock.ticker === 'ACCESSCORP' ? 'AccessCorp' : stock.ticker === 'REDSTAREX' ? 'RedStarRex' : stock.ticker === 'JBERGER' ? 'JuliusBerger' : stock.ticker === 'ZENITHBANK' ? 'ZenithBank' : stock.name}
                  </span>
                </div>

                {/* Price row */}
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold font-sora text-white">
                    ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 3 })}k
                  </span>
                  <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    isPos ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-[#FF4D4D]/20 text-[#FF4D4D]'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${isPos ? '' : 'rotate-180'}`} />
                    {isPos ? '+' : ''}{stock.change.toFixed(1)}%
                  </span>
                </div>
              </div>

              {/* Area sparkline at bottom */}
              <div className="w-full mt-auto">
                <svg width="100%" height="60" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`area-grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                      <stop offset="100%" stopColor={color} stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path d={areaPath} fill={`url(#area-grad-${stock.ticker})`} />
                  <path d={linePath} fill="none" stroke={color} strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
