import React from 'react';
import { Sparkles, ShieldAlert } from 'lucide-react';
import { aiDailyBrief } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function AIDailyBrief() {
  const user = useAppStore((state) => state.user);
  const experienceLevel = user?.experienceLevel || 'Beginner';
  const briefText = aiDailyBrief[experienceLevel];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-brand-primary/10"
      style={{ background: 'linear-gradient(145deg, #0E0D25 0%, #070615 100%)' }}>

      {/* Ambient glow decorations */}
      <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />

      {/* Top gradient border line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #6366F1, transparent)' }} />

      <div className="p-5 sm:p-6 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl animate-pulse-glow" 
                style={{ background: 'rgba(99,102,241,0.2)', filter: 'blur(8px)' }} />
              <div className="relative bg-brand-primary/15 border border-brand-primary/25 p-2.5 rounded-xl">
                <Sparkles className="h-4 w-4 text-brand-primary" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-text-primary font-sora">
                AI Market Brief
              </h4>
              <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans">
                Sora Intelligence · Real-time
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-brand-primary/8 border border-brand-primary/15 text-brand-primary px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold font-dm-sans">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
            <span>{experienceLevel} Mode</span>
          </div>
        </div>

        {/* Brief text */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full"
            style={{ background: 'linear-gradient(180deg, #6366F1, transparent)' }} />
          <p className="pl-4 text-sm leading-relaxed text-text-primary/90 font-dm-sans font-medium">
            {briefText}
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 pt-3.5 border-t border-border/50 flex items-center gap-2 text-[10px] text-text-secondary font-dm-sans text-left">
          <ShieldAlert className="h-3.5 w-3.5 text-warning/70 flex-shrink-0" />
          <span>This information is for educational and research purposes only and should not be considered financial advice.</span>
        </div>
      </div>
    </div>
  );
}
