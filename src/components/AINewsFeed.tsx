import React, { useState } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp } from 'lucide-react';
import { mockNews } from '@/lib/mockData';

const sentimentConfig = {
  Positive: {
    border: 'rgba(16,185,129,0.4)',
    bg: 'rgba(16,185,129,0.06)',
    badge: 'bg-gain/10 text-gain border-gain/20',
    icon: TrendingUp,
    dot: '#10B981',
  },
  Negative: {
    border: 'rgba(255,77,77,0.4)',
    bg: 'rgba(255,77,77,0.04)',
    badge: 'bg-danger/10 text-danger border-danger/20',
    icon: TrendingDown,
    dot: '#FF4D4D',
  },
  Neutral: {
    border: 'rgba(255,184,0,0.3)',
    bg: 'rgba(255,184,0,0.03)',
    badge: 'bg-warning/10 text-warning border-warning/20',
    icon: Minus,
    dot: '#FFB800',
  },
};

export default function AINewsFeed() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-text-primary font-sora">AI News Feed</h2>
          <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">
            NGX-filtered · Sora-interpreted market news
          </p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
          Live Feed
        </span>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mockNews.map((news) => {
          const cfg = sentimentConfig[news.marketImpact];
          const IconComp = cfg.icon;
          const isExpanded = expandedId === news.id;

          return (
            <div
              key={news.id}
              className="rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group"
              style={{
                background: 'linear-gradient(145deg, #0E0D25, #070615)',
                border: `1px solid ${isExpanded ? cfg.border : '#23214C'}`,
                boxShadow: isExpanded ? `0 0 24px ${cfg.dot}20` : 'none',
                borderLeft: `3px solid ${cfg.dot}`,
              }}
              onClick={() => setExpandedId(isExpanded ? null : news.id)}
              onMouseEnter={e => {
                if (!isExpanded) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = cfg.border;
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = cfg.dot;
                }
              }}
              onMouseLeave={e => {
                if (!isExpanded) {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#23214C';
                  (e.currentTarget as HTMLDivElement).style.borderLeftColor = cfg.dot;
                }
              }}
            >
              <div className="p-4 sm:p-5">
                {/* Source & Metadata Row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[9px] font-extrabold border ${cfg.badge}`}>
                      <IconComp className="h-2.5 w-2.5" />
                      {news.marketImpact}
                    </span>
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider font-dm-sans">
                      {news.source}
                    </span>
                  </div>
                  <span className="text-[9px] text-text-secondary font-dm-sans">{news.timeAgo}</span>
                </div>

                {/* Headline */}
                <h4 className="text-sm font-bold text-text-primary font-sora leading-snug mb-2.5 line-clamp-2 group-hover:text-brand-primary transition-colors">
                  {news.originalHeadline}
                </h4>

                {/* AI Summary */}
                <p className="text-xs text-text-secondary font-medium leading-relaxed font-dm-sans line-clamp-3">
                  {news.aiSummary}
                </p>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pt-3.5 border-t border-border/60 space-y-3 animate-in fade-in duration-200">
                    {/* Driver Tags */}
                    {news.drivers && (
                      <div className="flex flex-wrap gap-1.5">
                        {news.drivers.map((tag: string) => (
                          <span key={tag}
                            className="px-2 py-0.5 rounded-lg text-[9px] font-bold text-text-secondary border border-border bg-bg-base">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <button className="flex items-center gap-1.5 text-[10px] font-bold text-brand-primary hover:underline focus:outline-none">
                      <ExternalLink className="h-3 w-3" />
                      Read full article
                    </button>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-border/40">
                  <div className="flex items-center gap-1.5 text-[9px] text-text-secondary font-dm-sans">
                    <span style={{ color: cfg.dot }}>●</span>
                    <span>Market impact: <strong className="text-text-primary">{news.marketImpact}</strong></span>
                  </div>
                  {isExpanded
                    ? <ChevronUp className="h-3.5 w-3.5 text-text-secondary" />
                    : <ChevronDown className="h-3.5 w-3.5 text-text-secondary" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
