'use client';

import React, { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { GlobalIndexItem } from '@/lib/eodhd';

const defaultIndices: GlobalIndexItem[] = [
  { id: 'SPX', name: 'S&P 500', symbol: 'GSPC.INDX', flag: '🇺🇸', price: '7,799', rawPrice: 7799, change: 0.65, changeAmount: 50.5, selected: false },
  { id: 'DJI', name: 'DOW JONES', symbol: 'DJI.INDX', flag: '🇺🇸', price: '53,840', rawPrice: 53840, change: 0.13, changeAmount: 69.7, selected: false },
  { id: 'NDX', name: 'NASDAQ', symbol: 'IXIC.INDX', flag: '🇺🇸', price: '26,803', rawPrice: 26803, change: 0.81, changeAmount: 214.5, selected: false },
  { id: 'DAX', name: 'DAX', symbol: 'GDAXI.INDX', flag: '🇩🇪', price: '18,240', rawPrice: 18240, change: 0.28, changeAmount: 51.0, selected: true },
  { id: 'CAC', name: 'CAC 40', symbol: 'FCHI.INDX', flag: '🇫🇷', price: '7,412', rawPrice: 7412, change: 0.22, changeAmount: 16.3, selected: false },
  { id: 'FTSE', name: 'FTSE 100', symbol: 'FTSE.INDX', flag: '🇬🇧', price: '8,510', rawPrice: 8510, change: -0.05, changeAmount: -4.2, selected: true },
];

export default function ForeignMarketsSidebar() {
  const [activeTab, setActiveTab] = useState<'Global Indices'>('Global Indices');
  const [indices, setIndices] = useState<GlobalIndexItem[]>(defaultIndices);
  const [selectedIndexId, setSelectedIndexId] = useState<string>('SPX');

  useEffect(() => {
    let isMounted = true;
    async function loadGlobalIndices() {
      try {
        const res = await fetch('/api/market/global');
        if (res.ok) {
          const data = await res.json();
          if (data.indices && Array.isArray(data.indices) && data.indices.length > 0 && isMounted) {
            setIndices(data.indices);
            if (!data.indices.some((idx: GlobalIndexItem) => idx.id === selectedIndexId)) {
              setSelectedIndexId(data.indices[0].id);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load global market indices:', err);
      }
    }

    loadGlobalIndices();
    const interval = setInterval(loadGlobalIndices, 120000); // 2 min polling
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [selectedIndexId]);

  const selectedIndex = indices.find(idx => idx.id === selectedIndexId) || indices[0];
  const basePrice = selectedIndex ? selectedIndex.rawPrice : 7550;

  // Generate dynamic sparkline based on the selected index price
  const chartPoints = React.useMemo(() => {
    const count = 30;
    const pts: number[] = [];
    let cur = basePrice * (1 - (selectedIndex.change / 100));
    const stepDelta = ((basePrice - cur) / count);
    for (let i = 0; i < count; i++) {
      cur += stepDelta + (Math.sin(i * 0.5) * basePrice * 0.001);
      pts.push(cur);
    }
    pts[count - 1] = basePrice;
    return pts;
  }, [basePrice, selectedIndex]);

  const min = Math.min(...chartPoints);
  const max = Math.max(...chartPoints);
  const range = max - min || 1;
  const points = chartPoints.map((val, idx) => ({
    x: (idx / (chartPoints.length - 1)) * 100,
    y: 100 - ((val - min) / range) * 80 - 10,
  }));
  const linePath = points.reduce((d, p, i) => d + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');

  return (
    <div className="w-full h-full flex flex-col rounded-xl overflow-hidden shadow-2xl border border-white/[0.05]" style={{ background: '#191A1D' }}>
      
      {/* ── Tabs ── */}
      <div className="flex bg-[#252528] text-[12px] font-bold text-white/50 border-b border-black">
        {(['Global Indices'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center transition-colors ${
              activeTab === tab ? 'bg-[#191A1D] text-white shadow-[0_-2px_0_#CFA343_inset]' : 'hover:bg-[#2A2B2F]'
            }`}
          >
            {tab === 'Global Indices' && <Activity className="w-3 h-3 inline-block mr-1 -mt-0.5" />}
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
        
        {/* Price Axis */}
        <div className="absolute right-2 top-2 bottom-6 flex flex-col justify-between text-[9px] text-white/40 font-mono text-right pointer-events-none">
          <span>{Math.round(max).toLocaleString()}</span>
          <span>{Math.round((max + min) / 2).toLocaleString()}</span>
          <span>{Math.round(min).toLocaleString()}</span>
        </div>
        
        {/* Time Axis */}
        <div className="absolute left-2 right-10 bottom-1 flex justify-between text-[9px] text-white/40 font-mono pointer-events-none">
          <span>{selectedIndex.name}</span>
          <span>Live Feed</span>
          <span>{selectedIndex.change >= 0 ? '+' : ''}{selectedIndex.change}%</span>
        </div>

        {/* Center line (Open price) */}
        <div className="absolute left-0 right-0 top-[50%] h-px bg-[#CFA343]/20 pointer-events-none" />

        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 z-10 px-2 pb-6">
          <path d={linePath} fill="none" stroke={selectedIndex.change >= 0 ? '#10B981' : '#FF4D4D'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* ── Indices List ── */}
      <div className="flex flex-col bg-[#191A1D]">
        {indices.map((idx) => {
          const isPos = idx.change >= 0;
          const isSelected = selectedIndexId === idx.id;
          return (
            <div 
              key={idx.id} 
              onClick={() => setSelectedIndexId(idx.id)}
              className={`flex items-center justify-between px-3 py-2 text-[11px] font-medium border-b border-white/[0.03] ${
                isSelected ? 'bg-white/[0.08] border-l-2 border-l-[#CFA343]' : 'hover:bg-white/[0.04]'
              } cursor-pointer transition-colors`}
            >
              <div className="flex items-center gap-2 flex-1 overflow-hidden">
                <span className="text-[14px] leading-none">{idx.flag}</span>
                <span className={`truncate ${isSelected ? 'text-[#CFA343] font-bold' : 'text-white'}`}>{idx.name}</span>
              </div>
              
              <div className="flex items-center justify-end gap-3 w-[125px]">
                <span className="text-white/90 font-mono">{idx.price}</span>
                
                {/* Change Badge */}
                <span 
                  className={`w-[52px] text-right font-mono flex items-center justify-end font-bold ${
                    isSelected 
                      ? isPos ? 'bg-[#10B981] text-[#0E0B14] px-1 rounded' : 'bg-[#FF4D4D] text-white px-1 rounded'
                      : isPos ? 'text-[#10B981]' : 'text-[#FF4D4D]'
                  }`}
                >
                  {isPos ? '+' : ''}{idx.change.toFixed(2)}%
                </span>
                
                {/* Status Dot */}
                <span className={`w-1.5 h-1.5 rounded-full ${isPos ? 'bg-[#10B981]' : 'bg-[#FF4D4D]'}`} />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
