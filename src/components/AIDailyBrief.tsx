"use client";

import React, { useMemo, useState } from 'react';
import { ThumbsUp, Bookmark, Share2, ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import { useAppStore } from '@/lib/store';

/** Highlights ticker references like $TICKER or bare ALL-CAPS tickers in amber */
function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(\$[A-Z]{2,10}|\b[A-Z]{3,10}\b)/g);
  return (
    <>
      {parts.map((part, i) => {
        const isTicker = /^(\$[A-Z]{2,10}|[A-Z]{3,10})$/.test(part) && part.length <= 12;
        return isTicker ? (
          <span key={i} className="text-[#CFA343] font-semibold">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        );
      })}
    </>
  );
}

export default function AIDailyBrief() {
  const indexData = useAppStore((state) => state.indexData);
  const stocks = useAppStore((state) => state.stocks);
  const news = useAppStore((state) => state.news);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const dynamicBrief = useMemo(() => {
    const isPositive = (indexData.change || 0) >= 0;
    const gainers = stocks.filter((s) => s.change > 0);
    const losers = stocks.filter((s) => s.change < 0);
    const topGainer = [...stocks].sort((a, b) => b.change - a.change)[0];
    const topVolume = [...stocks].sort((a, b) => b.volumeRaw - a.volumeRaw)[0];
    const latestStory = news.length > 0 ? news[0] : null;

    // Punchy headline derived from live market data
    const headline = isPositive
      ? `NGX rallies ${indexData.change.toFixed(2)}% — ${gainers.length} stocks advance as ${topGainer?.ticker || 'equities'} leads the charge`
      : `NGX dips ${Math.abs(indexData.change || 0).toFixed(2)}% — ${losers.length} counters retreat amid macro headwinds`;

    const p1 = `The Nigerian Exchange (NGX) All-Share Index is currently at ${indexData.allShareIndex.toLocaleString('en-NG', { minimumFractionDigits: 2 })} points (${isPositive ? '+' : ''}${indexData.change.toFixed(2)}%), reflecting an equity valuation of ${indexData.marketCap}. Market breadth tracks ${gainers.length} advancing tickers against ${losers.length} declining counters.`;

    const p2 = topGainer
      ? `Leading momentum today: ${topGainer.name} (${topGainer.ticker}) advancing +${topGainer.change.toFixed(1)}% to ₦${topGainer.price.toFixed(2)}, alongside heavy institutional volume in ${topVolume ? `${topVolume.name} (${topVolume.ticker}) with ${topVolume.volume} traded` : 'Tier-1 banking names'}. Total exchange turnover: ${indexData.volume}.`
      : `Market participation remains concentrated across benchmark heavyweights in Industrial Goods and Banking, with turnover at ${indexData.volume}.`;

    const p3 = latestStory
      ? `Key Macro Driver: ${latestStory.originalHeadline} — ${latestStory.aiSummary || latestStory.whyItMatters}`
      : `Institutional investors continue evaluating domestic inflation metrics and monetary policy signals, balancing equity yield opportunities against sovereign debt yields.`;

    const today = new Date();
    const dateLabel = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return { headline, paragraphs: [p1, p2, p3], dateLabel };
  }, [indexData, stocks, news]);

  const visibleParagraphs = expanded ? dynamicBrief.paragraphs : dynamicBrief.paragraphs.slice(0, 1);

  return (
    <div className="rounded-2xl overflow-hidden bg-bg-surface border border-border shadow-lg">
      {/* Top accent line */}
      <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #CFA343, #7C5C1E, transparent)' }} />

      <div className="p-4 sm:p-5">

        {/* ── Author / Source Row ── */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {/* AI Avatar */}
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-[11px] font-extrabold text-bg-base"
              style={{ background: 'linear-gradient(135deg, #CFA343, #8C6420)' }}
            >
              AI
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[13px] font-bold text-text-primary leading-none">EquityStack AI</span>
                <span
                  className="text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide"
                  style={{ background: 'rgba(207,163,67,0.15)', color: 'var(--brand-primary)', border: '1px solid rgba(207,163,67,0.3)' }}
                >
                  Daily Brief
                </span>
              </div>
              <span className="text-[10px] text-text-muted font-medium mt-0.5 block">{dynamicBrief.dateLabel}</span>
            </div>
          </div>
          {/* Bookmark */}
          <button
            onClick={() => setBookmarked(!bookmarked)}
            className="p-1.5 rounded-lg transition-colors focus:outline-none text-text-muted hover:text-brand-primary"
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? 'var(--brand-primary)' : 'none'} />
          </button>
        </div>

        {/* ── Article Headline ── */}
        <h2 className="text-[15px] sm:text-[16px] font-extrabold text-text-primary leading-snug mb-3 font-sora">
          {dynamicBrief.headline}
        </h2>

        {/* ── Body Paragraphs with ticker highlighting ── */}
        <div className="text-[13px] leading-[1.7] text-text-secondary space-y-3">
          {visibleParagraphs.map((para, idx) => (
            <p key={idx}>
              <HighlightedText text={para} />
            </p>
          ))}
        </div>

        {/* Read more / collapse toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 mt-3 text-[11px] font-bold text-brand-primary hover:brightness-110 transition-colors focus:outline-none"
        >
          {expanded ? (
            <><ChevronUp className="w-3.5 h-3.5" />Show less</>
          ) : (
            <><ChevronDown className="w-3.5 h-3.5" />Read full brief</>
          )}
        </button>

        {/* ── Engagement / Footer Row ── */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-1.5 text-[11px] font-semibold transition-colors focus:outline-none text-text-muted hover:text-brand-primary"
            >
              <ThumbsUp className="w-3.5 h-3.5" fill={liked ? 'var(--brand-primary)' : 'none'} />
              <span>{liked ? 43 : 42}</span>
            </button>
            <button className="flex items-center gap-1.5 text-[11px] font-semibold text-text-muted hover:text-text-primary transition-colors focus:outline-none">
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
          </div>
          <div className="flex items-center gap-1 text-[9px] text-text-muted font-medium">
            <ShieldAlert className="w-3 h-3 flex-shrink-0" />
            <span>Research only</span>
          </div>
        </div>
      </div>
    </div>
  );
}
