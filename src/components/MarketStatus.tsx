import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Calendar, Info, TrendingUp } from 'lucide-react';

export default function MarketStatus() {
  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const data = useAppStore((state) => state.indexData);
  const stocks = useAppStore((state) => state.stocks);
  const isPositive = data.change >= 0;

  // Get marquee tickers dynamically
  const tickerItems = stocks.slice(0, 10).map(s => ({
    label: s.ticker,
    value: `₦${s.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
    change: `${s.change >= 0 ? '+' : ''}${s.change.toFixed(1)}%`,
    up: s.change >= 0
  }));

  const allTickers = [...tickerItems, ...tickerItems];

  // Specific candlestick data to match the image
  const candles = [
    { o: 16, c: 12, h: 18, l: 10, v: 25 },
    { o: 12, c: 17, h: 20, l: 11, v: 30 },
    { o: 17, c: 14, h: 18, l: 12, v: 35 },
    { o: 14, c: 18, h: 22, l: 13, v: 20 },
    { o: 18, c: 11, h: 19, l: 8, v: 45 },
    { o: 11, c: 13, h: 15, l: 3, v: 50 },
    { o: 13, c: 11, h: 14, l: 10, v: 25 },
    { o: 11, c: 16, h: 18, l: 10, v: 30 },
    { o: 16, c: 20, h: 22, l: 15, v: 20 },
    { o: 20, c: 32, h: 36, l: 15, v: 40 },
    { o: 32, c: 22, h: 33, l: 20, v: 35 },
    { o: 22, c: 19, h: 24, l: 17, v: 25 },
    { o: 19, c: 11, h: 20, l: 5, v: 45 },
    { o: 11, c: 22, h: 25, l: 10, v: 30 },
    { o: 22, c: 24, h: 26, l: 20, v: 20 },
    { o: 24, c: 20, h: 25, l: 18, v: 25 },
    { o: 20, c: 23, h: 25, l: 19, v: 20 },
    { o: 23, c: 30, h: 35, l: 22, v: 35 },
    { o: 30, c: 25, h: 32, l: 23, v: 30 },
    { o: 25, c: 38, h: 42, l: 20, v: 45 },
    { o: 38, c: 32, h: 40, l: 28, v: 30 },
    { o: 32, c: 34, h: 36, l: 30, v: 20 },
    { o: 34, c: 28, h: 35, l: 25, v: 25 },
    { o: 28, c: 31, h: 34, l: 26, v: 20 },
    { o: 31, c: 34, h: 36, l: 29, v: 20 },
    { o: 34, c: 30, h: 35, l: 28, v: 25 },
    { o: 30, c: 32, h: 34, l: 28, v: 15 },
    { o: 32, c: 35, h: 37, l: 30, v: 20 },
    { o: 35, c: 28, h: 36, l: 26, v: 30 },
    { o: 28, c: 26, h: 30, l: 25, v: 20 },
    { o: 26, c: 33, h: 35, l: 25, v: 25 },
    { o: 33, c: 35, h: 36, l: 31, v: 20 },
    { o: 35, c: 34, h: 37, l: 32, v: 15 },
    { o: 34, c: 32, h: 35, l: 30, v: 20 },
    { o: 32, c: 35, h: 36, l: 31, v: 25 },
    { o: 35, c: 18, h: 36, l: 15, v: 50 },
    { o: 18, c: 38, h: 40, l: 16, v: 45 },
    { o: 38, c: 34, h: 42, l: 32, v: 30 },
    { o: 34, c: 45, h: 48, l: 32, v: 40 },
    { o: 45, c: 38, h: 47, l: 35, v: 35 },
    { o: 38, c: 43, h: 45, l: 36, v: 30 },
    { o: 43, c: 35, h: 44, l: 32, v: 25 },
    { o: 35, c: 28, h: 37, l: 25, v: 35 },
    { o: 28, c: 18, h: 30, l: 15, v: 45 },
    { o: 18, c: 8, h: 20, l: 3, v: 50 },
    { o: 8, c: 30, h: 32, l: 6, v: 45 },
    { o: 30, c: 22, h: 32, l: 20, v: 30 },
    { o: 22, c: 18, h: 24, l: 16, v: 25 },
    { o: 18, c: 21, h: 23, l: 17, v: 20 },
    { o: 21, c: 18, h: 22, l: 16, v: 20 },
    { o: 18, c: 20, h: 22, l: 17, v: 15 },
    { o: 20, c: 23, h: 24, l: 19, v: 20 },
    { o: 23, c: 18, h: 25, l: 16, v: 25 },
    { o: 18, c: 14, h: 20, l: 12, v: 30 },
    { o: 14, c: 22, h: 24, l: 13, v: 25 },
    { o: 22, c: 17, h: 23, l: 15, v: 20 },
    { o: 17, c: 27, h: 29, l: 15, v: 30 },
    { o: 27, c: 45, h: 48, l: 25, v: 40 },
    { o: 45, c: 35, h: 52, l: 32, v: 45 },
    { o: 35, c: 50, h: 56, l: 33, v: 50 },
    { o: 50, c: 40, h: 52, l: 38, v: 35 },
    { o: 40, c: 44, h: 46, l: 38, v: 30 },
    { o: 44, c: 38, h: 45, l: 35, v: 25 },
    { o: 38, c: 42, h: 44, l: 36, v: 20 },
    { o: 42, c: 39, h: 43, l: 37, v: 15 },
    { o: 39, c: 43, h: 45, l: 38, v: 20 },
    { o: 43, c: 34, h: 44, l: 32, v: 30 },
    { o: 34, c: 45, h: 47, l: 32, v: 35 },
    { o: 45, c: 39, h: 46, l: 37, v: 25 },
    { o: 39, c: 35, h: 40, l: 34, v: 20 },
    { o: 35, c: 32, h: 36, l: 30, v: 25 },
    { o: 32, c: 38, h: 40, l: 30, v: 25 },
    { o: 38, c: 23, h: 40, l: 20, v: 45 },
    { o: 23, c: 25, h: 27, l: 21, v: 20 },
  ].map(c => ({ ...c, up: c.c >= c.o }));

  return (
    <div className="space-y-6">
      {/* ── Top Ticker Strip ── */}
      <div className="rounded-xl overflow-hidden border border-border/20 bg-[#191A1D]">
        <div className="ticker-track py-2.5">
          {allTickers.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-6 text-[10px] font-bold font-dm-sans flex-shrink-0">
              <span className="text-text-secondary tracking-widest uppercase">{item.label}:</span>
              <span className="text-text-primary font-sora">{item.value}</span>
              <span className={item.up ? 'text-gain' : 'text-danger'}>
                {item.change}
              </span>
              <span className="text-border/40 ml-4">|</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Main Chart Area ── */}
      <div className="rounded-2xl border border-border overflow-hidden" style={{ background: '#191A1D' }}>
        <div className="p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">

            {/* Left Header */}
            {/* Left Header */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl sm:text-2xl font-bold text-text-primary font-sora">
                  All Share Index
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded text-[#10B981] bg-[#10B981]/10 uppercase border border-[#10B981]/20 ml-2 font-sora">
                  {data.status === 'Open' ? 'LIVE' : 'CLOSED'}
                </span>
                <Info className="h-4 w-4 text-text-secondary ml-1" />
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-extrabold text-[#10B981] tracking-tight">₿</span>
                  <h2 className="text-3xl lg:text-4xl font-bold font-sora text-[#10B981] tracking-tight">
                    {data.allShareIndex.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/20'} border`}>
                  <TrendingUp className={`h-3 w-3 ${isPositive ? '' : 'rotate-180'}`} />
                  {isPositive ? '+' : ''}{data.change.toLocaleString('en-NG', { minimumFractionDigits: 1 })}%
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm font-medium font-sora">
                <span><span className="text-text-secondary">Market Cap:</span> <span className="text-text-primary font-bold">{data.marketCap}</span></span>
                <span><span className="text-text-secondary">Volume:</span> <span className="text-text-primary font-bold">{data.volume}</span></span>
                <span><span className="text-text-secondary">Deals:</span> <span className="text-text-primary font-bold">{data.deals}</span></span>
              </div>
            </div>

            {/* Right Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center border border-white/10 rounded-lg p-0.5 bg-transparent overflow-hidden">
                <button
                  onClick={() => setChartType('candlestick')}
                  className={`px-3 py-1.5 text-xs font-bold transition-all focus:outline-none border-r border-white/10 ${chartType === 'candlestick' ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                >
                  Candlestick
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 text-xs font-bold transition-all focus:outline-none ${chartType === 'line' ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                >
                  7D Graph
                </button>
              </div>

              <div className="flex items-center border border-white/10 rounded-lg p-0.5 bg-transparent overflow-hidden">
                {['12 month', '30 days', '7 days', '24 hours'].map((filter, i) => (
                  <button key={filter} className={`px-4 py-1.5 text-xs font-bold transition-all focus:outline-none border-r border-white/10 last:border-0 ${i === 0 ? 'bg-white/5 text-white' : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}>
                    {filter}
                  </button>
                ))}
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold border border-white/20 text-white hover:bg-white/5 focus:outline-none transition-all bg-transparent">
                <Calendar className="h-3.5 w-3.5" />
                Select dates
              </button>
            </div>
          </div>

          {/* Candlestick Chart Render */}
          <div className="mt-8 h-[380px] w-full relative flex pl-2 pr-4 pt-4 pb-6">

            {/* Left Y-axis labels */}
            <div className="flex flex-col justify-between items-end pr-4 text-[10px] text-white/60 font-medium h-full font-sora">
              <span>60k</span>
              <span>50k</span>
              <span>40k</span>
              <span>30k</span>
              <span>20k</span>
              <span>10k</span>
              <span>0</span>
            </div>

            {/* Chart Grid Area */}
            <div className="flex-1 relative border-l border-white/5 ml-2">
              {/* Horizontal Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="w-full border-t border-white/5" />
                ))}
              </div>

              {/* Candlesticks & Volume Container */}
              <div className="absolute inset-0 flex items-end justify-between px-2" style={{ paddingBottom: '32px' }}>
                {chartType === 'candlestick' ? candles.map((c, i) => {
                  const color = c.up ? '#10B981' : '#FF4D4D';
                  const maxHeight = 60; // 60k max
                  const scale = (val: number) => (val / maxHeight) * 100;

                  const high = scale(c.h);
                  const low = scale(c.l);
                  const open = scale(c.o);
                  const close = scale(c.c);

                  // Top offset (from 0 at top to 100 at bottom)
                  const top = 100 - high;
                  const bottom = 100 - low;
                  const bodyTop = 100 - Math.max(open, close);
                  const bodyBottom = 100 - Math.min(open, close);

                  // Volume Data (Scale to fit bottom 25% of chart)
                  const volHeight = Math.min(100, c.v); // Assuming max volume is 100
                  const scaledVolHeight = volHeight * 0.25; // 25% max height

                  return (
                    <div key={i} className="relative w-2.5 flex flex-col justify-end h-full group cursor-crosshair">
                      {/* Price Candle Container */}
                      <div className="absolute top-0 bottom-0 w-full z-10">
                        {/* Wick */}
                        <div className="absolute w-[1.5px] rounded-full left-1/2 -translate-x-1/2 transition-all duration-200 group-hover:bg-white"
                          style={{ top: `${top}%`, bottom: `${100 - bottom}%`, backgroundColor: color }} />
                        {/* Body */}
                        <div className="absolute w-full rounded-[1px] transition-all duration-200 group-hover:brightness-125"
                          style={{ top: `${bodyTop}%`, bottom: `${100 - bodyBottom}%`, backgroundColor: color }} />
                      </div>

                      {/* Volume Bar */}
                      <div className="absolute bottom-0 w-full rounded-t-[1px] bg-[#3A3A3C] transition-all duration-200 group-hover:bg-white/40 z-0"
                        style={{ height: `${scaledVolHeight}%` }} />
                    </div>
                  );
                }) : (
                  <svg className="absolute top-0 left-0 w-full" style={{ height: 'calc(100% - 32px)' }} preserveAspectRatio="none" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="line-gradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${(i / (candles.length - 1)) * 100} ${100 - (c.c / 60) * 100}`).join(' ')} L 100 100 L 0 100 Z`}
                      fill="url(#line-gradient)"
                    />
                    <path
                      d={candles.map((c, i) => `${i === 0 ? 'M' : 'L'} ${(i / (candles.length - 1)) * 100} ${100 - (c.c / 60) * 100}`).join(' ')}
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="2"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}
              </div>

              {/* Bottom X-axis labels */}
              <div className="absolute bottom-0 w-full flex justify-between text-[11px] text-white/60 font-medium font-sora -mb-7">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
