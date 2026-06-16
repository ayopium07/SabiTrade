import React, { useState } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus, MessageSquare, X, Sparkles, Info } from 'lucide-react';
import { mockNews, NewsItem } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

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

const categories = ['All', 'Featured', 'Breaking', 'Most Popular', 'Cryptocurrency'] as const;

export default function AINewsFeed() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const setView = useAppStore((s) => s.setView);
  const stocks = useAppStore((s) => s.stocks);
  const newsList = useAppStore((s) => s.news);
  const isLoading = useAppStore((s) => s.isLoadingNews);
  const fetchNews = useAppStore((s) => s.fetchNews);

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Filter news by active category (case-insensitive with "All" option fallback)
  const filteredNews = activeCategory === 'All'
    ? newsList
    : newsList.filter((item) => {
        const itemCat = (item.category || '').trim().toLowerCase();
        const activeCat = activeCategory.trim().toLowerCase();
        return itemCat === activeCat;
      });

  const handleStockClick = (ticker: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening news modal
    setSelectedTicker(ticker);
    setView('stock-detail');
  };

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
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

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-none border-b border-border/30">
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-2 border-b-2 font-bold text-xs transition-all duration-300 focus:outline-none"
              style={{
                borderColor: isSelected ? '#CFA343' : 'transparent',
                color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* News Stack (High Density List) */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          // Premium Gold/Dark pulsing loading skeletons
          Array.from({ length: 3 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="flex gap-4 p-3 rounded-2xl border border-border/20 bg-gradient-to-br from-bg-hover to-bg-base animate-pulse"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-20 flex-shrink-0 rounded-xl bg-white/5 border border-white/5" />
              <div className="flex-1 flex flex-col justify-between py-1">
                <div className="space-y-2">
                  <div className="h-2.5 w-16 bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/15 rounded" />
                  <div className="h-3 w-2/3 bg-white/10 rounded" />
                </div>
                <div className="h-2.5 w-24 bg-white/5 rounded mt-2" />
              </div>
            </div>
          ))
        ) : filteredNews.length > 0 ? (
          filteredNews.map((news) => {
            const cfg = sentimentConfig[news.marketImpact];
            return (
              <div
                key={news.id}
                onClick={() => setSelectedNews(news)}
                className="flex gap-4 p-3 rounded-2xl border transition-all duration-300 cursor-pointer group relative overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #0E0D25, #070615)',
                  borderColor: '#23214C',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)';
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 20px rgba(99,102,241,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = '#23214C';
                  (e.currentTarget as HTMLDivElement).style.transform = 'none';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Left Side: Thumbnail Image */}
                <div className="w-20 h-20 sm:w-24 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden relative border border-border/35 bg-bg-base/60">
                  <img
                    src={news.imageUrl}
                    alt={news.originalHeadline}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Subtle impact corner badge */}
                  <span
                    className="absolute top-1 left-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: cfg.dot }}
                    title={`Market Impact: ${news.marketImpact}`}
                  />
                </div>

                {/* Right Side: Content Area */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="space-y-1">
                    {/* Stock Badges with Live price changes */}
                    {news.affectedStocks && news.affectedStocks.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        {news.affectedStocks.map((ticker) => {
                          const stock = stocks.find((s) => s.ticker === ticker);
                          if (!stock) return null;
                          const isPos = stock.change >= 0;
                          return (
                            <button
                              key={ticker}
                              onClick={(e) => handleStockClick(ticker, e)}
                              className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-bg-base border border-border/40 hover:border-brand-primary/40 hover:text-brand-primary transition-colors focus:outline-none"
                            >
                              <span className="text-text-secondary">{ticker}</span>
                              <span className={isPos ? 'text-gain' : 'text-danger'}>
                                {isPos ? '+' : ''}
                                {stock.change.toFixed(2)}%
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Headline */}
                    <h3 className="text-xs sm:text-sm font-bold text-text-primary font-sora leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                      {news.originalHeadline}
                    </h3>
                  </div>

                  {/* Metadata Row */}
                  <div className="flex items-center justify-between text-[10px] text-text-secondary font-medium font-dm-sans mt-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary/80">{news.source}</span>
                      <span>·</span>
                      <span>{news.timeAgo}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3.5 w-3.5 text-text-secondary/80" />
                      <span>{news.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 border border-dashed border-border/50 rounded-2xl text-center text-xs text-text-secondary font-medium font-dm-sans">
            <span className="text-2xl block mb-2">📰</span>
            <span>No articles available in this category. Check back later!</span>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedNews && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
        >
          {/* Backdrop click close */}
          <div className="absolute inset-0" onClick={() => setSelectedNews(null)} />

          {/* Modal content box */}
          <div
            className="w-full max-w-xl rounded-3xl p-6 sm:p-8 relative overflow-y-auto max-h-[90vh] border animate-in zoom-in-95 duration-300 text-left z-10 space-y-5 shadow-2xl"
            style={{
              background: 'linear-gradient(145deg, #0E0D25, #070615)',
              borderColor: sentimentConfig[selectedNews.marketImpact].border,
              boxShadow: `0 0 24px ${sentimentConfig[selectedNews.marketImpact].dot}15`,
            }}
          >
            {/* Top Close Button & Indicators */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="px-2 py-0.5 rounded-lg text-[9px] font-extrabold border uppercase tracking-wider"
                  style={{
                    backgroundColor: sentimentConfig[selectedNews.marketImpact].bg,
                    color: sentimentConfig[selectedNews.marketImpact].dot,
                    borderColor: sentimentConfig[selectedNews.marketImpact].border,
                  }}
                >
                  {selectedNews.marketImpact} Impact
                </span>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                  {selectedNews.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-text-secondary hover:text-text-primary p-1.5 rounded-full border border-border/40 hover:border-border transition-colors focus:outline-none"
                style={{ background: '#070615' }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Featured Image */}
            <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden border border-border/30 bg-bg-base/60">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.originalHeadline}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Headline & Meta info */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-extrabold font-sora text-text-primary leading-snug">
                {selectedNews.originalHeadline}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-text-secondary">
                <span className="font-bold text-text-primary">{selectedNews.source}</span>
                <span>·</span>
                <span>{selectedNews.timeAgo}</span>
                <span>·</span>
                <span className="flex items-center gap-0.5">
                  <MessageSquare className="h-3 w-3" />
                  {selectedNews.commentsCount} comments
                </span>
              </div>
            </div>

            {/* AI summary block */}
            <div className="p-4 rounded-2xl border border-brand-primary/10 bg-brand-primary/5 space-y-2">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-brand-primary animate-pulse" />
                <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-wider">
                  Sora AI Summary
                </span>
              </div>
              <p className="text-xs text-text-primary font-medium leading-relaxed font-dm-sans">
                {selectedNews.aiSummary}
              </p>
            </div>

            {/* AI Insights: why it matters & implications */}
            <div className="space-y-3.5 pt-1">
              <div>
                <span className="block text-[9px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">
                  Why It Matters
                </span>
                <p className="text-xs text-text-primary/90 font-medium leading-relaxed font-dm-sans">
                  {selectedNews.whyItMatters}
                </p>
              </div>

              <div>
                <span className="block text-[9px] text-text-secondary font-extrabold uppercase tracking-wider mb-1">
                  Potential Implications
                </span>
                <p className="text-xs text-text-primary/90 font-medium leading-relaxed font-dm-sans">
                  {selectedNews.implications}
                </p>
              </div>

              {/* Related Companies */}
              {selectedNews.affectedStocks && selectedNews.affectedStocks.length > 0 && (
                <div>
                  <span className="block text-[9px] text-text-secondary font-extrabold uppercase tracking-wider mb-1.5">
                    Related Companies
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedNews.affectedStocks.map((ticker) => {
                      const stock = stocks.find((s) => s.ticker === ticker);
                      const isPos = stock ? stock.change >= 0 : true;
                      const price = stock ? stock.price.toFixed(2) : '';
                      return (
                        <button
                          key={ticker}
                          onClick={(e) => handleStockClick(ticker, e)}
                          className="px-2.5 py-1 rounded-xl text-xs font-bold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors flex items-center gap-1.5 focus:outline-none"
                        >
                          <span>{ticker}</span>
                          {price && (
                            <span className="text-[10px] opacity-85">
                              ₦{price}
                            </span>
                          )}
                          {stock && (
                            <span className={`text-[10px] font-extrabold ${isPos ? 'text-gain' : 'text-danger'}`}>
                              {isPos ? '+' : ''}
                              {stock.change.toFixed(1)}%
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Drivers Tags */}
            {selectedNews.drivers && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedNews.drivers.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-lg text-[9px] font-bold text-text-secondary border border-border bg-bg-base"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Read full article & disclaimers */}
            <div className="pt-2 border-t border-border/40 space-y-3">
              <button
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold bg-brand-primary text-bg-base hover:bg-brand-primary/90 transition-all focus:outline-none"
                style={{ boxShadow: '0 4px 12px rgba(99,102,241,0.25)' }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Read full article
              </button>

              <div className="flex gap-2 items-start text-[9px] leading-relaxed text-text-secondary italic font-dm-sans">
                <Info className="h-3.5 w-3.5 text-text-secondary flex-shrink-0 mt-0.5" />
                <span>
                  This analysis is for educational purposes only. Always consult a licensed broker before making financial decisions.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
