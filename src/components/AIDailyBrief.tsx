"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldAlert } from 'lucide-react';
import { equityStackAIBrief } from '@/lib/mockData';

export default function AIDailyBrief() {
  const [briefText, setBriefText] = useState(equityStackAIBrief.morning);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setBriefText(equityStackAIBrief.morning);
    } else if (hour < 17) {
      setBriefText(equityStackAIBrief.afternoon);
    } else {
      setBriefText(equityStackAIBrief.night);
    }
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-primary/10"
      style={{ background: 'linear-gradient(145deg, #0E0D25 0%, #070615 100%)' }}>

      {/* Ambient glow decorations */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.08) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.05) 0%, transparent 70%)' }} />

      {/* Top gradient border line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)' }} />

      <div className="p-5 sm:p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 rounded-[14px] animate-pulse-glow" 
                style={{ background: 'rgba(207,163,67,0.2)', filter: 'blur(8px)' }} />
              <div className="relative bg-[#1A1829] border border-[#CFA343]/30 p-3 rounded-[14px]">
                <Sparkles className="h-5 w-5 text-[#CFA343]" />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-[20px] font-bold text-white font-sora">
                EquityStack AI Brief
              </h4>
              <span className="block text-[11px] font-bold text-white/60 uppercase tracking-widest font-sora">
                LIVE MARKET INTELLIGENCE
              </span>
            </div>
          </div>
        </div>

        {/* Brief text */}
        <div className="relative pl-5 py-1">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
            style={{ background: 'linear-gradient(180deg, #CFA343 0%, rgba(207,163,67,0.1) 100%)' }} />
          <p className="text-[14px] leading-[1.6] text-white/90 font-sora font-medium">
            {briefText}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 pt-5 border-t border-white/10 flex items-start sm:items-center gap-3 text-[12px] text-white/50 font-sora text-left">
          <ShieldAlert className="h-4 w-4 text-[#CFA343] flex-shrink-0" />
          <span>This information is for educational and research purposes only and should not be considered financial advice.</span>
        </div>
      </div>
    </div>
  );
}
