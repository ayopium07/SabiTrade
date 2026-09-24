'use client';

import React from 'react';
import { useAppStore } from '@/lib/store';
import { ChevronUp, ChevronDown, Flame, Activity } from 'lucide-react';

export default function TrendingStocks() {
  const stocks = useAppStore(s => s.stocks);

  // Fallback data in case the store is empty
  const defaultTrending = [
    { ticker: 'DANGCEM', name: 'Dangote Cement Plc', change: -1.32 },
    { ticker: 'MTNN', name: 'MTN Nigeria Communications Plc', change: -0.89 },
    { ticker: 'AIRTELAFRI', name: 'Airtel Africa Plc', change: 2.65 },
    { ticker: 'BUACEMENT', name: 'BUA Cement Plc', change: -0.47 },
    { ticker: 'ZENITHBANK', name: 'Zenith Bank Plc', change: 1.86 },
    { ticker: 'GTCO', name: 'Guaranty Trust Holding Co.', change: 1.53 },
    { ticker: 'ACCESSCORP', name: 'Access Holdings Plc', change: 0.81 },
    { ticker: 'FBNH', name: 'FBN Holdings Plc', change: -4.55 },
    { ticker: 'UBA', name: 'United Bank for Africa', change: 1.11 },
    { ticker: 'TRANSCORP', name: 'Transnational Corporation', change: -5.36 },
  ];

  const defaultActive = [
    { ticker: 'UBA', name: 'United Bank for Africa', change: -3.78 },
    { ticker: 'ACCESSCORP', name: 'Access Holdings Plc', change: -0.65 },
    { ticker: 'TRANSCORP', name: 'Transnational Corporation', change: -4.13 },
    { ticker: 'FBNH', name: 'FBN Holdings Plc', change: -3.52 },
    { ticker: 'GTCO', name: 'Guaranty Trust Holding Co.', change: -3.46 },
    { ticker: 'ZENITHBANK', name: 'Zenith Bank Plc', change: -6.03 },
    { ticker: 'OANDO', name: 'Oando Plc', change: 1.46 },
    { ticker: 'FCMB', name: 'FCMB Group Plc', change: -6.12 },
    { ticker: 'FLOURMILL', name: 'Flour Mills of Nigeria', change: -5.88 },
    { ticker: 'WAPCO', name: 'Lafarge Africa Plc', change: 1.99 },
  ];

  const defaultIndices = [
    { ticker: 'SPX', name: 'S&P 500', change: 0.42 },
    { ticker: 'DJI', name: 'DOW JONES', change: 0.29 },
    { ticker: 'NDX', name: 'NASDAQ 100', change: 0.33 },
    { ticker: 'TSX', name: 'TSX COMP', change: 0.30 },
    { ticker: 'FTSE', name: 'FTSE 100', change: -0.05 },
    { ticker: 'DAX', name: 'DAX', change: 0.17 },
    { ticker: 'CAC', name: 'CAC 40', change: 0.17 },
    { ticker: 'STOXX', name: 'EURO STOXX 50', change: 0.08 },
    { ticker: 'SHCOMP', name: 'SHANGHAI COMPOSITE', change: -2.06 },
    { ticker: 'TOPIX', name: 'TOPIX', change: -0.71 },
  ];

  const renderRow = (item: { ticker: string; name: string; change: number }) => {
    const isPositive = item.change >= 0;
    return (
      <div key={item.ticker} className="flex items-center justify-between py-3 md:py-3.5 group rounded-xl px-3 sm:px-4 -mx-2 sm:-mx-4 hover:bg-bg-hover transition-all cursor-pointer border-b border-border/40 last:border-0">
        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="w-[85px] sm:w-[95px] flex-shrink-0">
            <span className="inline-block px-2 py-1 rounded bg-brand-primary-glow border border-brand-primary/20 text-[11px] sm:text-[12px] font-extrabold text-brand-primary font-sora truncate max-w-full">
              {item.ticker}
            </span>
          </div>
          <span className="text-[12px] sm:text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate">
            {item.name}
          </span>
        </div>
        <div className="flex items-center justify-end w-[85px] flex-shrink-0">
          <span
            className={`inline-flex items-center justify-center gap-1 w-full px-2 py-1 rounded-md text-[11px] font-bold font-sora ${
              isPositive ? 'bg-gain/10 text-gain border border-gain/20' : 'bg-danger/10 text-danger border border-danger/20'
            }`}
          >
            {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{item.change.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-8 mb-8 glass-elevated rounded-2xl border border-border p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-brand-primary-glow rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mb-8 text-center md:text-left">
        <h2 className="text-[18px] md:text-[22px] font-extrabold text-text-primary font-sora tracking-wide mb-2 flex items-center justify-center md:justify-start gap-3">
          Trending on Equitystack
          <div className="h-2 w-2 rounded-full bg-brand-primary animate-pulse" />
        </h2>
        <p className="text-[13px] md:text-[14px] text-text-secondary max-w-2xl">
          The most searched stocks on Equitystack, and the most traded stocks on NGX Market
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-10">
        {/* Trending Column */}
        <div className="bg-bg-raised p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3 px-2">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-bold text-text-primary uppercase tracking-widest font-sora">
                Trending
              </span>
            </div>
            <div className="w-[85px] text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">1D Chg</span>
            </div>
          </div>
          <div className="flex flex-col relative z-10">
            {defaultTrending.map(renderRow)}
          </div>
        </div>

        {/* Most Active Column */}
        <div className="bg-bg-raised p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3 px-2">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-bold text-text-primary uppercase tracking-widest font-sora">
                Most Active
              </span>
            </div>
            <div className="w-[85px] text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">1D Chg</span>
            </div>
          </div>
          <div className="flex flex-col relative z-10">
            {defaultActive.map(renderRow)}
          </div>
        </div>

        {/* Global Markets Column */}
        <div className="bg-bg-raised p-4 rounded-xl border border-border">
          <div className="flex items-center justify-between pb-3 border-b border-border mb-3 px-2">
            <div className="flex items-center gap-2.5 flex-1">
              <div className="p-1.5 rounded-lg bg-green-500/10 text-green-500">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[12px] font-bold text-text-primary uppercase tracking-widest font-sora">
                Global Indices
              </span>
            </div>
            <div className="w-[85px] text-center">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">1D Chg</span>
            </div>
          </div>
          <div className="flex flex-col relative z-10">
            {defaultIndices.map(renderRow)}
          </div>
        </div>
      </div>
    </div>
  );
}
