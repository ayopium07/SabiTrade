import React, { useState } from 'react';
import { ExternalLink, TrendingUp, TrendingDown, Minus, MessageSquare, X, Sparkles, Info, Calendar, PenTool } from 'lucide-react';
import { NewsItem } from '@/lib/mockData';
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

const categories = ['All News', 'Stock Market', 'Economy', 'Global News'] as const;

export default function AINewsFeed() {
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]>('All News');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [publishTitle, setPublishTitle] = useState('');
  const [publishImageUrl, setPublishImageUrl] = useState('');
  const [publishContent, setPublishContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const setView = useAppStore((s) => s.setView);
  const stocks = useAppStore((s) => s.stocks);
  const newsList = useAppStore((s) => s.news);
  const isLoading = useAppStore((s) => s.isLoadingNews);

  const setSelectedNewsArticle = useAppStore((s) => s.setSelectedNewsArticle);
  
  const handleReadFullArticle = () => {
    if (selectedNews) {
      setSelectedNewsArticle(selectedNews);
      setView('news-detail');
      setSelectedNews(null); // Close modal
    }
  };

  const fetchNews = useAppStore((s) => s.fetchNews);
  const publishNews = useAppStore((s) => s.publishNews);

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishTitle.trim() || !publishContent.trim()) return;
    
    setIsPublishing(true);
    await publishNews(publishTitle, publishContent, publishImageUrl);
    setIsPublishing(false);
    setIsPublishModalOpen(false);
    setPublishTitle('');
    setPublishImageUrl('');
    setPublishContent('');
  };

  const handleInsertImage = () => {
    setPublishContent(prev => prev + '\n\n![Image Description](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80)\n\n');
  };

  React.useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // Filter news by active category and selected date
  const filteredNews = newsList.filter((item) => {
    const matchesCategory = activeCategory === 'All News' || 
      (item.category || '').trim().toLowerCase() === activeCategory.trim().toLowerCase();
    
    let matchesDate = true;
    if (selectedDate && item.date) {
      const itemDateStr = new Date(item.date).toISOString().split('T')[0];
      matchesDate = itemDateStr === selectedDate;
    }
    return matchesCategory && matchesDate;
  }).sort((a, b) => {
    // Sort by newest first
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
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
            NGX-filtered · EquityStack AI-interpreted market news
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Publish News Button */}
          <button 
            onClick={() => setIsPublishModalOpen(true)}
            className="flex items-center gap-1.5 bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary px-3 py-1.5 rounded-lg border border-brand-primary/20 transition-colors text-xs font-bold"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Publish News</span>
          </button>
          
          {/* Calendar Metric */}
          <div className="flex items-center gap-1.5 bg-bg-hover px-2.5 py-1.5 rounded-lg border border-border/40 transition-colors hover:border-border/60">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            <input 
              type="date" 
              className="bg-transparent text-xs text-text-primary outline-none cursor-pointer [&::-webkit-calendar-picker-indicator]:filter-invert"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              title="Filter news by date"
            />
            {selectedDate && (
              <button 
                onClick={() => setSelectedDate('')} 
                className="ml-0.5 text-text-secondary hover:text-danger focus:outline-none transition-colors"
                title="Clear date"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold text-brand-primary uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
            Live Feed
          </span>
        </div>
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
          <>
            {/* Featured First Item */}
            {(() => {
              const news = filteredNews[0];
              const cfg = sentimentConfig[news.marketImpact];
              return (
                <div
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className="flex flex-col p-4 rounded-3xl border transition-all duration-300 cursor-pointer group relative overflow-hidden mb-2"
                  style={{
                    background: 'linear-gradient(145deg, #0E0D25, #070615)',
                    borderColor: '#23214C',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.4)';
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 30px rgba(99,102,241,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#23214C';
                    (e.currentTarget as HTMLDivElement).style.transform = 'none';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}
                >
                  <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative border border-border/35 bg-bg-base/60 mb-4">
                    <img
                      src={news.imageUrl}
                      alt={news.originalHeadline}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md"
                      style={{ backgroundColor: cfg.bg, color: cfg.dot, borderColor: cfg.border, borderWidth: '1px' }}
                    >
                      {news.marketImpact} Impact
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-text-primary font-sora leading-snug group-hover:text-brand-primary transition-colors">
                      {news.originalHeadline}
                    </h3>
                    <p className="text-xs text-text-secondary/90 line-clamp-2 leading-relaxed">
                      {news.aiSummary}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-text-secondary font-medium font-dm-sans pt-2">
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
            })()}

            {/* Remaining Items List */}
            {filteredNews.slice(1).map((news) => {
              const cfg = sentimentConfig[news.marketImpact];
              return (
                <div
                  key={news.id}
                  onClick={() => setSelectedNews(news)}
                  className="flex gap-4 py-3 border-b border-border/30 last:border-0 transition-colors duration-300 cursor-pointer group hover:bg-bg-hover/30 -mx-2 px-2 rounded-xl"
                >
                  <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
                    <h3 className="text-sm font-bold text-text-primary font-sora leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors mb-2">
                      {news.originalHeadline}
                    </h3>
                    <div className="flex items-center text-[10px] text-text-secondary font-medium font-dm-sans">
                      <span className="font-semibold">{news.source}</span>
                      <span className="mx-1.5">·</span>
                      <span>{news.timeAgo}</span>
                      <span className="mx-1.5">·</span>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        <span>{news.commentsCount}</span>
                      </div>
                    </div>
                  </div>
                  <div className="w-24 h-16 sm:w-28 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden relative border border-border/35 bg-bg-base/60">
                    <img
                      src={news.imageUrl}
                      alt={news.originalHeadline}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </div>
              );
            })}
          </>
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
            className="w-full max-w-xl rounded-3xl relative overflow-hidden overflow-y-auto max-h-[90vh] border border-border/40 animate-in zoom-in-95 duration-300 text-left z-10 shadow-2xl flex flex-col"
            style={{
              background: '#0E0D25',
              boxShadow: `0 0 40px rgba(0,0,0,0.5)`,
            }}
          >
            {/* Featured Image Header (Flush with edges) */}
            <div className="w-full h-56 sm:h-64 relative flex-shrink-0 bg-black">
              <img
                src={selectedNews.imageUrl}
                alt={selectedNews.originalHeadline}
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D25] to-transparent opacity-90" />
              
              {/* Floating Top Elements */}
              <div className="absolute top-4 left-4 right-4 flex items-start justify-between z-10">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md"
                      style={{
                        backgroundColor: sentimentConfig[selectedNews.marketImpact].bg,
                        color: sentimentConfig[selectedNews.marketImpact].dot,
                        border: `1px solid ${sentimentConfig[selectedNews.marketImpact].border}`,
                      }}
                    >
                      {selectedNews.marketImpact} Impact
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider bg-black/40 backdrop-blur-md border border-white/10">
                      {selectedNews.category}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setSelectedNews(null)}
                  className="text-white hover:text-brand-primary p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors focus:outline-none"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Headline Over Image */}
              <div className="absolute bottom-4 left-6 right-6 z-10 space-y-2">
                <h2 className="text-xl sm:text-2xl font-extrabold font-sora text-white leading-tight drop-shadow-md">
                  {selectedNews.originalHeadline}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-white/80 font-dm-sans font-medium">
                  <span className="font-bold text-brand-primary">{selectedNews.source}</span>
                  <span className="opacity-50">·</span>
                  <span>{selectedNews.timeAgo}</span>
                  <span className="opacity-50">·</span>
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {selectedNews.commentsCount} comments
                  </span>
                </div>
              </div>
            </div>

            {/* Scrollable Content Body */}
            <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
              
              {/* AI summary block */}
              <div className="p-5 rounded-2xl border border-brand-primary/20 bg-brand-primary/5 relative overflow-hidden">
                <div className="absolute -top-4 -right-4 opacity-10">
                  <Sparkles className="h-20 w-20 text-brand-primary" />
                </div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Sparkles className="h-4 w-4 text-brand-primary animate-pulse" />
                  <span className="text-[10px] font-extrabold text-brand-primary uppercase tracking-wider">
                    EquityStack AI Summary
                  </span>
                </div>
                <p className="text-sm text-text-primary/90 font-medium leading-relaxed font-dm-sans relative z-10">
                  {selectedNews.aiSummary}
                </p>
              </div>

              {/* AI Insights: why it matters & implications */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1.5 border-b border-border/30 pb-1">
                    Why It Matters
                  </h4>
                  <p className="text-sm text-text-primary/80 font-medium leading-relaxed font-dm-sans">
                    {selectedNews.whyItMatters}
                  </p>
                </div>

                <div>
                  <h4 className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-1.5 border-b border-border/30 pb-1">
                    Potential Implications
                  </h4>
                  <p className="text-sm text-text-primary/80 font-medium leading-relaxed font-dm-sans">
                    {selectedNews.implications}
                  </p>
                </div>

                {/* Related Companies */}
                {selectedNews.affectedStocks && selectedNews.affectedStocks.length > 0 && (
                  <div className="pt-2">
                    <h4 className="text-[10px] text-text-secondary font-extrabold uppercase tracking-wider mb-2 border-b border-border/30 pb-1">
                      Related Companies
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedNews.affectedStocks.map((ticker) => {
                        const stock = stocks.find((s) => s.ticker === ticker);
                        const isPos = stock ? stock.change >= 0 : true;
                        const price = stock ? stock.price.toFixed(2) : '';
                        return (
                          <button
                            key={ticker}
                            onClick={(e) => handleStockClick(ticker, e)}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-brand-primary border border-brand-primary/20 bg-[#171622] hover:bg-[#1E1C2E] hover:border-brand-primary/40 transition-all flex items-center gap-2 focus:outline-none"
                          >
                            <span className="text-white">{ticker}</span>
                            {price && (
                              <span className="text-[10px] text-white/60 font-medium">
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
                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedNews.drivers.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-[10px] font-bold text-text-secondary border border-border/50 bg-[#171622]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Read full article */}
              <div className="pt-6 mt-4 border-t border-border/30 space-y-4">
                <button
                  onClick={handleReadFullArticle}
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold bg-brand-primary text-black hover:bg-brand-primary/90 hover:scale-[1.01] transition-all focus:outline-none"
                >
                  Read full article
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Modals & Overlays */}
      
      {/* Publish News Modal */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-2xl rounded-[24px] border border-white/10 overflow-hidden flex flex-col relative"
            style={{
              background: 'linear-gradient(180deg, #13111C 0%, #0B0A10 100%)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center border border-brand-primary/20">
                  <PenTool className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white font-sora tracking-tight">Publish Article</h2>
                  <p className="text-xs text-text-secondary font-dm-sans mt-0.5">Share your market analysis with the community</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPublishModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/5"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePublish} className="p-6 flex flex-col gap-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Headline</label>
                <input
                  type="text"
                  placeholder="e.g., Zenith Bank announces record Q3 profits..."
                  value={publishTitle}
                  onChange={(e) => setPublishTitle(e.target.value)}
                  className="w-full bg-[#0A090F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-primary/50 transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Cover Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="e.g., https://unsplash.com/photos/..."
                  value={publishImageUrl}
                  onChange={(e) => setPublishImageUrl(e.target.value)}
                  className="w-full bg-[#0A090F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-primary/50 transition-colors"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-white/70 uppercase tracking-wider">Article Content</label>
                  <button 
                    type="button" 
                    onClick={handleInsertImage}
                    className="text-[10px] text-brand-primary hover:underline flex items-center gap-1"
                  >
                    + Insert Image in Text
                  </button>
                </div>
                <textarea
                  placeholder="Write your market analysis here. EquityStack AI will automatically summarize it for the feed."
                  value={publishContent}
                  onChange={(e) => setPublishContent(e.target.value)}
                  className="w-full bg-[#0A090F] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-primary/50 transition-colors min-h-[200px] resize-y"
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsPublishModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPublishing || !publishTitle.trim() || !publishContent.trim()}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs bg-brand-primary text-black hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isPublishing ? 'Publishing...' : 'Publish to Feed'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
