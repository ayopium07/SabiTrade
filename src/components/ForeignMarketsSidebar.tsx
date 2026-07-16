'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';

// Mock Data for the sidebar
const indicesData = [
  { id: 'SPX', name: 'S&P 500', flag: '🇺🇸', price: '5,575', change: 0.42, selected: false },
  { id: 'DJI', name: 'DOW JONES', flag: '🇺🇸', price: '39,637', change: 0.29, selected: false },
  { id: 'NDX', name: 'NASDAQ 100', flag: '🇺🇸', price: '19,825', change: 0.33, selected: false },
  { id: 'TSX', name: 'TSX COMP', flag: '🇨🇦', price: '22,305', change: 0.30, selected: false },
  { id: 'FTSE', name: 'FTSE 100', flag: '🇬🇧', price: '8,492', change: -0.05, selected: true }, // Highlighted as in the screenshot
  { id: 'DAX', name: 'DAX', flag: '🇩🇪', price: '18,110', change: 0.17, selected: true }, // Highlighted as in the screenshot
  { id: 'CAC', name: 'CAC 40', flag: '🇫🇷', price: '7,353', change: 0.17, selected: false },
  { id: 'STOXX', name: 'EURO STOXX 50', flag: '🇪🇺', price: '4,275', change: 0.08, selected: false },
  { id: 'SHCOMP', name: 'SHANGHAI COMPOSITE', flag: '🇨🇳', price: '2,914', change: -2.06, selected: false },
  { id: 'TOPIX', name: 'TOPIX', flag: '🇯🇵', price: '2,707', change: -0.71, selected: false },
  { id: 'MSCIE', name: 'MSCI EMERGING', flag: '🌎', price: '1,055', change: -2.13, selected: false },
  { id: 'MSCIW', name: 'MSCI WORLD', flag: '🌎', price: '3,265', change: -0.05, selected: false },
];

const generateSparkline = (base: number) => {
  let current = base;
  return Array.from({ length: 40 }).map(() => {
    current += (Math.random() - 0.45) * (base * 0.001);
    return current;
  });
};

export default function ForeignMarketsSidebar() {
  const [activeTab, setActiveTab] = useState<'Indices' | 'Europe' | 'America' | 'Asia'>('Indices');
  
  // For the chart, we'll just show a dummy SVG sparkline that looks like the one in the screenshot.
  const chartData = generateSparkline(7550);
  const min = Math.min(...chartData);
  const max = Math.max(...chartData);
  const range = max - min || 1;
  const points = chartData.map((val, idx) => ({
    x: (idx / (chartData.length - 1)) * 100,
    y: 100 - ((val - min) / range) * 80 - 10,
  }));
  const linePath = points.reduce((d, p, i) => d + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="w-full lg:w-[280px] flex-shrink-0 flex flex-col lg:sticky lg:top-6 rounded-xl overflow-hidden shadow-2xl border border-white/[0.05]" style={{ background: '#191A1D' }}>
      
      {/* ── Tabs ── */}
      <div className="flex bg-[#252528] text-[12px] font-bold text-white/50 border-b border-black">
        {(['Indices', 'Europe', 'America', 'Asia'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center transition-colors ${
              activeTab === tab ? 'bg-[#191A1D] text-white shadow-[0_-2px_0_#CFA343_inset]' : 'hover:bg-[#2A2B2F]'
            }`}
          >
            {tab === 'Indices' && <Activity className="w-3 h-3 inline-block mr-1 -mt-0.5" />}
            {tab}
          </button>
        ))}
      </div>

      {/* ── Chart Area ── */}
      <div className="h-[120px] bg-[#222225] relative border-b border-[#333]">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        
        {/* Mock Price Axis */}
        <div className="absolute right-2 top-2 bottom-6 flex flex-col justify-between text-[9px] text-white/30 font-mono text-right">
          <span>7580</span>
          <span>7560</span>
          <span>7540</span>
        </div>
        
        {/* Mock Time Axis */}
        <div className="absolute left-2 right-10 bottom-1 flex justify-between text-[9px] text-white/30 font-mono">
          <span>Jul10</span>
          <span>11:59</span>
          <span>13:59</span>
          <span>15:59</span>
        </div>

        {/* Center line (Open price) */}
        <div className="absolute left-0 right-0 top-[60%] h-px bg-orange-500/30" />

        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-10 px-2 pb-6">
          <path d={linePath} fill="none" stroke="#2563EB" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── Indices List ── */}
      <div className="flex flex-col bg-[#191A1D]">
        {indicesData.map((idx, i) => {
          const isPos = idx.change >= 0;
          return (
            <div 
              key={idx.id} 
              className={`flex items-center justify-between px-3 py-1.5 text-[11px] font-medium border-b border-white/[0.03] ${
                idx.selected ? 'bg-white/[0.08]' : 'hover:bg-white/[0.04]'
              } cursor-pointer transition-colors`}
            >
              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <span className="text-[14px] leading-none">{idx.flag}</span>
                <span className="text-white truncate">{idx.name}</span>
              </div>
              
              <div className="flex items-center justify-end gap-3 w-[110px]">
                <span className="text-white/90 font-mono">{idx.price}</span>
                
                {/* Change Badge - mimics the blocky green/red from the screenshot for selected, else plain text */}
                <span 
                  className={`w-[45px] text-right font-mono flex items-center justify-end ${
                    idx.selected 
                      ? isPos ? 'bg-[#008000] text-white px-1' : 'bg-[#CC0000] text-white px-1'
                      : isPos ? 'text-[#00D395]' : 'text-[#FF4D4F]'
                  }`}
                >
                  {isPos ? '+' : ''}{idx.change.toFixed(2)}%
                </span>
                
                {/* Status Dot */}
                <span className={`w-1.5 h-1.5 rounded-full ${isPos ? 'bg-[#00D395]' : 'bg-[#FF4D4F]'}`} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
