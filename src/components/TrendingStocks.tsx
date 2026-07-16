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

  const renderRow = (item: { ticker: string; name: string; change: number }) => {
    const isPositive = item.change >= 0;
    return (
      <div key={item.ticker} className="flex items-center justify-between py-3 md:py-3.5 group rounded-xl px-4 -mx-4 hover:bg-white/[0.04] transition-all cursor-pointer">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-[95px] flex-shrink-0">
            <span className="inline-block px-2 py-1 rounded bg-[#2563EB]/10 border border-[#2563EB]/20 text-[12px] font-extrabold text-[#3B82F6] font-sora truncate max-w-full">
              {item.ticker}
            </span>
          </div>
          <span className="text-[13px] font-medium text-white/60 group-hover:text-white/90 transition-colors truncate max-w-[150px] sm:max-w-[200px]">
            {item.name}
          </span>
        </div>
        <div className="flex items-center justify-end w-[85px]">
          <span
            className="inline-flex items-center justify-center gap-1 w-full px-2 py-1 rounded-md text-[11px] font-bold font-sora"
            style={{
              background: isPositive ? 'rgba(0,211,149,0.12)' : 'rgba(255,77,79,0.12)',
              color: isPositive ? '#00D395' : '#FF4D4F',
            }}
          >
            {isPositive ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {isPositive ? '+' : ''}{item.change.toFixed(2)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto mt-12 mb-8 bg-[#0E0B14] rounded-2xl border border-white/[0.05] p-6 md:p-8 lg:p-10 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur in background */}
      <div className="absolute top-0 right-1/4 w-[300px] h-[300px] bg-[#CFA343]/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-[250px] h-[250px] bg-[#2563EB]/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="mb-10 text-center md:text-left">
        <h2 className="text-[18px] md:text-[22px] font-extrabold text-white font-sora tracking-wide mb-2 flex items-center justify-center md:justify-start gap-3">
          Trending on Equitystack
          <div className="h-2 w-2 rounded-full bg-[#CFA343] animate-pulse" />
        </h2>
        <p className="text-[13px] md:text-[14px] text-white/50 max-w-2xl">
          The most searched stocks on Equitystack, and the most traded stocks on NGX Market
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
        {/* Trending Column */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 px-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                <Flame className="w-4 h-4" />
              </div>
              <span className="text-[12px] md:text-[13px] font-bold text-white/70 uppercase tracking-widest font-sora">
                Trending
              </span>
            </div>
            <div className="w-[85px] text-center">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">1D Chg</span>
            </div>
          </div>
          <div className="flex flex-col relative z-10">
            {defaultTrending.map(renderRow)}
          </div>
        </div>

        {/* Most Active Column */}
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 px-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-[12px] md:text-[13px] font-bold text-white/70 uppercase tracking-widest font-sora">
                Most Active
              </span>
            </div>
            <div className="w-[85px] text-center">
              <span className="text-[11px] font-bold text-white/50 uppercase tracking-widest">1D Chg</span>
            </div>
          </div>
          <div className="flex flex-col relative z-10">
            {defaultActive.map(renderRow)}
          </div>
        </div>
      </div>
    </div>
  );
}
