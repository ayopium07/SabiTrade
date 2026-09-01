import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { ArrowLeft, MessageSquare, Share2, Bookmark, Clock, Send, Sparkles, TrendingUp, TrendingDown, Minus, ExternalLink, GraduationCap, Lightbulb, Target } from 'lucide-react';
import { resolveCompanyLogo, resolveCompanyLogos } from '@/lib/companyLogos';

const sentimentConfig = {
  Positive: {
    bg: 'rgba(16,185,129,0.06)',
    border: 'rgba(16,185,129,0.4)',
    text: '#10B981',
    icon: TrendingUp,
  },
  Negative: {
    bg: 'rgba(255,77,77,0.04)',
    border: 'rgba(255,77,77,0.4)',
    text: '#FF4D4D',
    icon: TrendingDown,
  },
  Neutral: {
    bg: 'rgba(255,184,0,0.03)',
    border: 'rgba(255,184,0,0.3)',
    text: '#FFB800',
    icon: Minus,
  },
};

export default function NewsDetail() {
  const setView = useAppStore((s) => s.setView);
  const selectedNews = useAppStore((s) => s.selectedNewsArticle);
  const setSelectedNewsArticle = useAppStore((s) => s.setSelectedNewsArticle);
  const addNewsComment = useAppStore((s) => s.addNewsComment);
  const stocks = useAppStore((s) => s.stocks);
  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);

  const [commentInput, setCommentInput] = useState('');

  if (!selectedNews) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-white/50 text-sm">No article selected.</p>
        <button 
          onClick={() => setView('news')}
          className="px-4 py-2 bg-brand-primary text-black rounded-lg text-xs font-bold"
        >
          Return to News Feed
        </button>
      </div>
    );
  }

  const handleBack = () => {
    setSelectedNewsArticle(null);
    setView('news');
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    addNewsComment(selectedNews.id, commentInput);
    setCommentInput('');
  };

  const cfg = sentimentConfig[selectedNews.marketImpact];
  const Icon = cfg.icon;

  return (
    <div className="w-full space-y-6 pb-20 animate-in fade-in duration-300">
      {/* Header / Nav */}
      <div className="flex items-center justify-between sticky top-0 z-10 bg-[#0E0D25]/90 backdrop-blur-md py-4 border-b border-border/30">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-text-secondary hover:text-white transition-colors text-sm font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to News
        </button>
        <div className="flex items-center gap-3">
          <button className="p-2 text-text-secondary hover:text-brand-primary transition-colors bg-bg-hover rounded-full">
            <Bookmark className="w-4 h-4" />
          </button>
          <button className="p-2 text-text-secondary hover:text-brand-primary transition-colors bg-bg-hover rounded-full">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Article Header */}
      <div className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-3 text-xs font-bold uppercase tracking-wider">
          <span className="text-brand-primary bg-brand-primary/10 px-2 py-1 rounded border border-brand-primary/20">
            {selectedNews.category}
          </span>
          <span 
            className="flex items-center gap-1.5 px-2 py-1 rounded border"
            style={{ backgroundColor: cfg.bg, color: cfg.text, borderColor: cfg.border }}
          >
            <Icon className="w-3.5 h-3.5" />
            {selectedNews.marketImpact} Impact
          </span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-sora leading-tight">
          {selectedNews.originalHeadline}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-xs text-text-secondary font-medium font-dm-sans">
          <span className="font-bold text-white/90">{selectedNews.source}</span>
          {selectedNews.author && (
            <span className="font-bold text-brand-primary">by {selectedNews.author}</span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {selectedNews.date ? new Date(selectedNews.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : selectedNews.timeAgo}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            {selectedNews.commentsCount} Comments
          </span>
        </div>
      </div>

      {/* Hero Image & Combined Multi-Company Editorial Graphic */}
      {(() => {
        const logos = resolveCompanyLogos(selectedNews.affectedStocks, selectedNews.originalHeadline, selectedNews.fullContent || selectedNews.aiSummary);
        if (logos.length > 1) {
          return (
            <div className="w-full h-64 sm:h-[400px] rounded-3xl overflow-hidden border border-border/40 relative flex items-center justify-center p-6 sm:p-10 group bg-[#090814]">
              {/* Financial City Skyline Background */}
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=1200&auto=format&fit=crop"
                alt="Stock chart skyline"
                className="absolute inset-0 w-full h-full object-cover opacity-35 filter contrast-125 saturate-150 brightness-75 scale-105 transition-transform duration-700 group-hover:scale-110"
              />

              {/* SVG Glowing Stock Candlestick Chart Overlay */}
              <svg className="absolute inset-0 w-full h-full opacity-35 z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1000 400">
                <defs>
                  <linearGradient id="chartGlowDetail" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <line x1="0" y1="120" x2="1000" y2="120" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                <line x1="0" y1="220" x2="1000" y2="220" stroke="rgba(255,255,255,0.08)" strokeDasharray="4 4" />
                
                <rect x="120" y="140" width="14" height="70" fill="#10B981" opacity="0.6" />
                <line x1="127" y1="120" x2="127" y2="230" stroke="#10B981" opacity="0.6" strokeWidth="2" />
                
                <rect x="350" y="100" width="14" height="110" fill="#10B981" opacity="0.7" />
                <line x1="357" y1="80" x2="357" y2="230" stroke="#10B981" opacity="0.7" strokeWidth="2" />

                <rect x="680" y="70" width="14" height="140" fill="#10B981" opacity="0.8" />
                <line x1="687" y1="50" x2="687" y2="230" stroke="#10B981" opacity="0.8" strokeWidth="2" />

                <path d="M 0,260 Q 250,200 450,120 T 800,90 L 1000,60 L 1000,400 L 0,400 Z" fill="url(#chartGlowDetail)" />
                <path d="M 0,260 Q 250,200 450,120 T 800,90 L 1000,60" stroke="#10B981" strokeWidth="3" fill="none" />
              </svg>

              {/* Dark gradient vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D25] via-[#0E0D25]/75 to-[#0E0D25]/40 z-10" />

              {/* Clean Logo Showcase: LOGO 1 | LOGO 2 */}
              <div className="relative z-20 flex items-center justify-center gap-6 sm:gap-14">
                {logos.map((l, i) => (
                  <React.Fragment key={l.ticker}>
                    {i > 0 && (
                      <div className="w-[2px] h-16 sm:h-24 bg-gradient-to-b from-transparent via-white/80 to-transparent shadow-[0_0_14px_rgba(255,255,255,0.9)]" />
                    )}
                    <div className="flex flex-col items-center gap-3">
                      <div className="px-6 py-4 rounded-3xl bg-black/40 backdrop-blur-md border border-white/15 shadow-[0_15px_40px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-105 hover:bg-black/60 flex items-center justify-center">
                        <img src={l.logoUrl} alt={l.name} className="h-16 sm:h-24 w-auto max-w-[160px] sm:max-w-[240px] object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]" />
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div className="w-full h-64 sm:h-[400px] rounded-3xl overflow-hidden border border-border/40 relative group">
            <img 
              src={selectedNews.imageUrl} 
              alt={selectedNews.originalHeadline}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0E0D25] via-transparent to-transparent opacity-60" />
            
            {/* Combined Company Logo Badge */}
            {logos.length === 1 && (
              <div className="absolute top-4 right-4 bg-white/95 p-2 rounded-2xl shadow-xl border border-white/20 flex items-center justify-center w-14 h-14 backdrop-blur-md z-10" title={logos[0].name}>
                <img src={logos[0].logoUrl} alt={logos[0].name} className="w-full h-full object-contain" />
              </div>
            )}
          </div>
        );
      })()}

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Article Body */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Prominent Educational Insights Grid: Why It Matters & Potential Implications */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Why It Matters */}
            <div className="p-5 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-brand-primary flex-shrink-0 animate-pulse" />
                <h3 className="text-xs font-extrabold text-brand-primary uppercase tracking-wider font-sora">
                  Why It Matters To Investors
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed font-dm-sans">
                {selectedNews.whyItMatters}
              </p>
            </div>

            {/* Potential Implications */}
            <div className="p-5 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <h3 className="text-xs font-extrabold text-blue-400 uppercase tracking-wider font-sora">
                  Potential Market Implications
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed font-dm-sans">
                {selectedNews.implications}
              </p>
            </div>
          </div>

          {/* Educational Concept Banner */}
          {selectedNews.educationalConcept && (
            <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 flex items-start gap-3.5">
              <GraduationCap className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider font-sora">
                  Investor Educational Concept
                </h3>
                <p className="text-xs sm:text-sm text-white/90 font-medium leading-relaxed font-dm-sans">
                  {selectedNews.educationalConcept}
                </p>
              </div>
            </div>
          )}

          {/* Main Article Content */}
          <div className="prose prose-invert prose-p:text-white/90 prose-p:leading-relaxed prose-p:font-dm-sans max-w-none space-y-4 text-[15px]">
            {selectedNews.fullContent?.split(/(?:\r?\n)+/).map((paragraph, idx) => {
              const cleanPara = paragraph.trim();
              if (!cleanPara) return null;
              
              // Handle section headings like ### Section Title
              if (cleanPara.startsWith('###') || cleanPara.startsWith('##')) {
                const headingText = cleanPara.replace(/^#+\s*/, '');
                return (
                  <h3 key={idx} className="text-lg font-extrabold text-brand-primary font-sora mt-8 mb-2 border-b border-border/20 pb-1">
                    {headingText}
                  </h3>
                );
              }

              const parts = cleanPara.split(/(!\[.*?\]\(.*?\))/g);
              if (parts.length === 1) {
                return <p key={idx} className="leading-relaxed">{cleanPara}</p>;
              }

              return (
                <div key={idx} className="space-y-4">
                  {parts.map((part, pIdx) => {
                    const imageMatch = part.match(/^!\[(.*?)\]\((.*?)\)$/);
                    if (imageMatch) {
                      return (
                        <div key={pIdx} className="my-6 w-full rounded-2xl overflow-hidden border border-border/40 bg-black/20">
                          <img src={imageMatch[2]} alt={imageMatch[1]} className="w-full h-auto object-cover" />
                          {imageMatch[1] && imageMatch[1] !== 'Image Description' && (
                            <div className="p-3 text-center text-xs text-white/50 bg-black/40">
                              {imageMatch[1]}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return part.trim() ? <p key={pIdx} className="inline-block leading-relaxed">{part}</p> : null;
                  })}
                </div>
              );
            })}
          </div>

          {/* Comments Section */}
          <div className="pt-8 mt-12 border-t border-border/30 space-y-6">
            <h3 className="text-lg font-bold text-white font-sora flex items-center gap-2">
              Discussion <span className="text-brand-primary bg-brand-primary/10 px-2 py-0.5 rounded-lg text-sm">{selectedNews.commentsCount}</span>
            </h3>
            
            {/* Comment Input */}
            <form onSubmit={handlePostComment} className="flex gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=CurrentUser" alt="You" />
              </div>
              <div className="flex-1 relative">
                <textarea 
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share your thoughts on this..."
                  className="w-full bg-[#171622] border border-border/40 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-brand-primary/50 resize-none min-h-[80px]"
                />
                <button 
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="absolute bottom-3 right-3 p-2 bg-brand-primary text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brand-primary/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-5 pt-4">
              {selectedNews.commentsList?.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-border bg-bg-hover">
                    <img src={comment.avatar} alt={comment.user} />
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#171622] border border-border/30 rounded-2xl rounded-tl-sm p-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-brand-primary">{comment.user}</span>
                        <span className="text-[10px] text-white/40">{comment.timeAgo}</span>
                      </div>
                      <p className="text-sm text-white/80 font-dm-sans leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Original Source Link */}
          {selectedNews.link && (
            <div className="bg-[#171622] border border-brand-primary/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-[10px] font-extrabold text-brand-primary uppercase tracking-widest border-b border-white/5 pb-2">
                Original Publisher Source
              </h3>
              <p className="text-xs text-white/70 font-dm-sans">
                Read the unedited original story published by <span className="font-bold text-white">{selectedNews.source}</span>.
              </p>
              <a
                href={selectedNews.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-xs font-bold bg-brand-primary text-black hover:bg-brand-primary/90 transition-all text-center"
              >
                Read Full Story on {selectedNews.source}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Why It Matters */}
          <div className="bg-[#171622] border border-border/30 rounded-2xl p-5 space-y-3">
            <h3 className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest border-b border-white/5 pb-2">Why It Matters</h3>
            <p className="text-xs text-white/80 font-medium leading-relaxed font-dm-sans">
              {selectedNews.whyItMatters}
            </p>
          </div>

          {/* Implications */}
          <div className="bg-[#171622] border border-border/30 rounded-2xl p-5 space-y-3">
            <h3 className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest border-b border-white/5 pb-2">Potential Implications</h3>
            <p className="text-xs text-white/80 font-medium leading-relaxed font-dm-sans">
              {selectedNews.implications}
            </p>
          </div>

          {/* Related Equities */}
          {selectedNews.affectedStocks && selectedNews.affectedStocks.length > 0 && (
            <div className="bg-[#171622] border border-border/30 rounded-2xl p-5 space-y-3">
               <h3 className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest border-b border-white/5 pb-2">Related Equities</h3>
               <div className="flex flex-col gap-2">
                 {selectedNews.affectedStocks.map((ticker) => {
                   const stock = stocks.find(s => s.ticker === ticker);
                   const isPos = stock ? stock.change >= 0 : true;
                   return (
                     <div key={ticker} className="flex items-center justify-between p-3 rounded-xl bg-bg-base border border-border/40 hover:border-brand-primary/30 transition-colors cursor-pointer" onClick={() => { setSelectedTicker(ticker); setView('stock-detail'); }}>
                       <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-[#0E0D25] flex items-center justify-center font-bold text-[10px] text-white border border-white/10">
                           {ticker.substring(0, 2)}
                         </div>
                         <span className="text-xs font-bold text-white">{ticker}</span>
                       </div>
                       {stock && (
                         <div className="text-right">
                           <div className="text-xs font-bold text-white">₦{stock.price.toFixed(2)}</div>
                           <div className={`text-[10px] font-bold ${isPos ? 'text-gain' : 'text-danger'}`}>
                             {isPos ? '+' : ''}{stock.change.toFixed(2)}%
                           </div>
                         </div>
                       )}
                     </div>
                   );
                 })}
               </div>
            </div>
          )}
          
          {/* Tags */}
          {selectedNews.drivers && (
            <div className="bg-[#171622] border border-border/30 rounded-2xl p-5 space-y-3">
              <h3 className="text-[10px] font-extrabold text-white/50 uppercase tracking-widest border-b border-white/5 pb-2">Topic Drivers</h3>
              <div className="flex flex-wrap gap-2">
                {selectedNews.drivers.map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-lg text-[10px] font-bold text-white/60 bg-bg-base border border-border/40">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
