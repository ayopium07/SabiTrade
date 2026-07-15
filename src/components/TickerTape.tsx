'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';

export default function TickerTape() {
  const stocks = useAppStore((state) => state.stocks);

  if (!stocks || stocks.length === 0) return null;

  // Get marquee tickers dynamically
  const tickerItems = stocks.slice(0, 10).map(s => ({
    label: s.ticker,
    value: `₦${s.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}`,
    change: `${s.change >= 0 ? '+' : ''}${s.change.toFixed(1)}%`,
    up: s.change >= 0
  }));

  const allTickers = [...tickerItems, ...tickerItems, ...tickerItems]; // duplicate for smooth scrolling

  return (
    <div className="w-full overflow-hidden border-b border-border/20 bg-[#191A1D] hidden lg:block">
      <div className="ticker-track py-2">
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
  );
}
