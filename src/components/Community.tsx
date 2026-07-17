import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, TrendingUp, Users, ShieldAlert, Repeat2, Share, X } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const timeAgo = (dateStr: string) => {
  const diffInMinutes = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return `${Math.floor(diffInHours / 24)}d ago`;
};

const trendingTickers = [
  { ticker: 'OANDO', mentions: 124, trend: 'up' },
  { ticker: 'ZENITHBANK', mentions: 98, trend: 'up' },
  { ticker: 'NESTLE', mentions: 86, trend: 'down' },
  { ticker: 'GTCO', mentions: 54, trend: 'neutral' }
];

export default function Community() {
  const [inputText, setInputText] = useState('');
  const [selectedTickerTags, setSelectedTickerTags] = useState<string[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [sentimentPercent, setSentimentPercent] = useState({ bullish: 68, bearish: 32 });

  const {
    user,
    stocks,
    communityPosts,
    communityUsers,
    setSelectedTicker,
    setView,
    addPost,
    likePost,
    retweetPost,
    viewProfile,
    viewThread
  } = useAppStore();

  // Create a pseudo current user id
  const currentUserId = user ? 'u1' : 'guest';

  const handleVote = (type: 'bullish' | 'bearish') => {
    if (hasVoted) return;
    setHasVoted(true);
    if (type === 'bullish') {
      setSentimentPercent({
        bullish: sentimentPercent.bullish + 1,
        bearish: Math.max(0, sentimentPercent.bearish - 1)
      });
    } else {
      setSentimentPercent({
        bullish: Math.max(0, sentimentPercent.bullish - 1),
        bearish: sentimentPercent.bearish + 1
      });
    }
  };

  const handleLikePost = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    likePost(postId, currentUserId);
  };

  const handleRetweet = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    retweetPost(postId, currentUserId);
  };

  const handleShare = async (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SabiTrade',
          text: 'Check out this post on SabiTrade!',
          url: url,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(`Check out this post on SabiTrade: ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    addPost(inputText.trim(), selectedTickerTags, currentUserId);
    setInputText('');
    setSelectedTickerTags([]);
  };

  const handleAddTag = (ticker: string) => {
    if (ticker && !selectedTickerTags.includes(ticker)) {
      setSelectedTickerTags([...selectedTickerTags, ticker]);
    }
  };

  const handleRemoveTag = (ticker: string) => {
    setSelectedTickerTags(selectedTickerTags.filter(t => t !== ticker));
  };

  const handleTickerClick = (ticker: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedTicker(ticker);
    setView('stock-detail');
  };

  const handleUserClick = (userId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    viewProfile(userId);
  };

  const handlePostClick = (postId: string) => {
    viewThread(postId);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-left">
      {/* Top Banner */}
      <div className="relative rounded-[2rem] p-8 sm:p-10 overflow-hidden border border-border/50 bg-bg-base/40 backdrop-blur-xl">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#B275FF]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-brand-primary/20 bg-brand-primary/5 backdrop-blur-md">
            <Users className="h-3.5 w-3.5 text-brand-primary" />
            <span className="text-[10px] font-bold tracking-widest text-brand-primary uppercase">Trading Community</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-text-primary font-sora leading-tight">
            The pulse of the <span style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>NGX market</span>.
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-dm-sans font-medium">
            Join thousands of retail investors. Share your analysis, discover trending tickers, and stay ahead of the curve.
          </p>
        </div>
      </div>

      {/* Grid: Sentiment & Posting & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Posting box & Posts Feed */}
        <div className="lg:col-span-8 space-y-5">
          {/* Post Creation Box */}
          <div className="rounded-3xl p-5 border border-border/50 bg-bg-base/40 backdrop-blur-md hover:border-brand-primary/30 transition-all shadow-lg shadow-black/20">
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full flex items-center justify-center font-sora text-sm font-extrabold text-bg-base flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 15px rgba(207,163,67,0.2)' }}>
                  {user?.name?.slice(0, 2).toUpperCase() || 'GI'}
                </div>
                <div className="flex-1 space-y-3">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="What's your market move today?"
                    rows={inputText ? 3 : 1}
                    className="w-full bg-transparent border-none text-sm text-text-primary placeholder:text-text-secondary/60 focus:ring-0 resize-none font-medium font-dm-sans leading-relaxed pt-2.5"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  
                  {/* Tags display */}
                  {selectedTickerTags.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {selectedTickerTags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/20">
                          ${tag}
                          <X className="h-3 w-3 cursor-pointer hover:text-white" onClick={() => handleRemoveTag(tag)} />
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions Row */}
                  <div className={`flex items-center justify-between gap-3 flex-wrap transition-all duration-300 ${inputText ? 'opacity-100 pt-3 border-t border-border/40' : 'opacity-0 h-0 overflow-hidden pt-0 border-transparent'}`}>
                    <div className="flex items-center gap-2 relative">
                      <select
                        onChange={(e) => handleAddTag(e.target.value)}
                        value=""
                        className="bg-bg-base/80 border border-border/60 hover:border-brand-primary/40 rounded-full px-3 py-1.5 text-[11px] font-bold text-brand-primary focus:outline-none transition-colors cursor-pointer appearance-none pr-6"
                      >
                        <option value="" disabled>+ Tag Stock</option>
                        {stocks.filter(s => !selectedTickerTags.includes(s.ticker)).map((stock) => (
                          <option key={stock.ticker} value={stock.ticker}>
                            ${stock.ticker}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={!inputText.trim() || !user}
                      className="px-5 py-2 rounded-full text-xs font-bold bg-brand-primary text-bg-base hover:bg-brand-primary/90 disabled:opacity-30 disabled:hover:bg-brand-primary transition-all flex items-center gap-2 focus:outline-none shadow-[0_0_15px_rgba(207,163,67,0.2)] hover:shadow-[0_0_20px_rgba(207,163,67,0.4)]"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Social Feed List */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Recent Activity Feed
            </h3>

            <div className="space-y-3.5">
              {communityPosts.map((post) => {
                const author = communityUsers.find(u => u.id === post.authorId);
                if (!author) return null;

                const isLiked = post.likes.includes(currentUserId);
                const isRetweeted = post.retweets.includes(currentUserId);

                return (
                  <div
                    key={post.id}
                    onClick={() => handlePostClick(post.id)}
                    className="group rounded-3xl p-5 sm:p-6 border border-border/40 bg-bg-base/30 backdrop-blur-md hover:border-brand-primary/30 hover:bg-bg-base/60 transition-all duration-500 relative overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                    {/* User info row */}
                    <div className="relative flex items-start justify-between mb-4 z-10">
                      <div className="flex items-center gap-3">
                        <div 
                          className="relative h-11 w-11 rounded-full flex-shrink-0 cursor-pointer"
                          onClick={(e) => handleUserClick(author.id, e)}
                        >
                          <div className="absolute inset-0 bg-gradient-to-tr from-[#CFA343] to-[#B58C35] rounded-full blur-[6px] opacity-40 group-hover:opacity-80 transition-opacity duration-500" />
                          <div className="relative h-full w-full rounded-full flex items-center justify-center font-sora text-sm font-extrabold text-bg-base bg-text-primary z-10 border-2 border-bg-base overflow-hidden">
                            {author.avatar.length > 2 ? <img src={author.avatar} className="w-full h-full object-cover" /> : author.avatar}
                          </div>
                        </div>
                        <div 
                          className="cursor-pointer group/author"
                          onClick={(e) => handleUserClick(author.id, e)}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-text-primary font-sora group-hover/author:text-brand-primary transition-colors">
                              {author.name}
                            </span>
                            <span className="text-[10px] text-text-secondary font-medium">
                              @{author.handle}
                            </span>
                          </div>
                          <span className="block text-[10px] text-text-secondary mt-0.5 font-medium">{timeAgo(post.createdAt)}</span>
                        </div>
                      </div>

                      {/* Tagged Stock Ticker Badges */}
                      {post.tickerTags && post.tickerTags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 justify-end max-w-[120px]">
                          {post.tickerTags.map(tag => (
                            <button
                              key={tag}
                              onClick={(e) => handleTickerClick(tag, e)}
                              className="px-2.5 py-1 rounded-full text-[9px] font-bold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/20 transition-all focus:outline-none shadow-[0_0_10px_rgba(207,163,67,0.05)]"
                            >
                              ${tag}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Content text */}
                    <p className="relative text-[13px] text-text-primary/90 font-medium leading-relaxed font-dm-sans mb-5 whitespace-pre-line z-10">
                      {post.content}
                    </p>

                    {/* Interactions footer */}
                    <div className="relative flex items-center gap-6 pt-4 border-t border-border/30 text-xs font-bold text-text-secondary font-dm-sans z-10">
                      <button
                        onClick={(e) => handleLikePost(post.id, e)}
                        className={`flex items-center gap-2 transition-colors focus:outline-none group/btn ${
                          isLiked ? 'text-brand-primary' : 'hover:text-brand-primary'
                        }`}
                      >
                        <div className={`p-1.5 rounded-full transition-all duration-300 ${isLiked ? 'bg-brand-primary/15' : 'group-hover/btn:bg-brand-primary/10'}`}>
                          <ThumbsUp className={`h-4 w-4 transition-transform group-hover/btn:scale-110 ${isLiked ? 'fill-brand-primary' : ''}`} />
                        </div>
                        <span className={isLiked ? 'text-brand-primary' : ''}>{post.likes.length}</span>
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); viewThread(post.id); }}
                        className="flex items-center gap-2 hover:text-text-primary transition-colors focus:outline-none group/btn"
                      >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-white/5 transition-all duration-300">
                          <MessageSquare className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                        </div>
                        <span>{post.repliesCount}</span>
                      </button>

                      <button
                        onClick={(e) => handleRetweet(post.id, e)}
                        className={`flex items-center gap-2 transition-colors focus:outline-none group/btn ${
                          isRetweeted ? 'text-gain' : 'hover:text-gain'
                        }`}
                      >
                        <div className={`p-1.5 rounded-full transition-all duration-300 ${isRetweeted ? 'bg-gain/15' : 'group-hover/btn:bg-gain/10'}`}>
                          <Repeat2 className={`h-4 w-4 transition-transform group-hover/btn:scale-110 ${isRetweeted ? 'stroke-[3px]' : ''}`} />
                        </div>
                        <span className={isRetweeted ? 'text-gain' : ''}>{post.retweets.length}</span>
                      </button>

                      <button
                        onClick={(e) => handleShare(post.id, e)}
                        className="flex items-center gap-2 hover:text-[#B275FF] transition-colors focus:outline-none group/btn ml-auto"
                      >
                        <div className="p-1.5 rounded-full group-hover/btn:bg-[#B275FF]/10 transition-all duration-300">
                          <Share className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Sentiment Vote & Leaderboards */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Sentiment Vote Box */}
          <div className="rounded-[2rem] p-6 border border-border/50 text-center space-y-6 bg-bg-base/40 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-danger via-transparent to-gain opacity-50" />
            
            <div className="space-y-1 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary block">
                Sentiment Barometer
              </span>
              <h4 className="text-sm font-bold text-text-primary font-sora">
                Where is the market heading today?
              </h4>
            </div>

            {/* Gauge */}
            <div className="space-y-2 relative z-10">
              <div className="flex justify-between text-xs font-extrabold font-sora">
                <span className="text-gain drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">📈 {sentimentPercent.bullish}% Bullish</span>
                <span className="text-danger drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">📉 {sentimentPercent.bearish}% Bearish</span>
              </div>
              <div className="w-full h-4 bg-bg-base border border-border/50 rounded-full overflow-hidden flex relative shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-gain/80 to-gain transition-all duration-1000 ease-out"
                  style={{
                    width: `${sentimentPercent.bullish}%`,
                    boxShadow: '0 0 15px rgba(16,185,129,0.4)'
                  }}
                />
                <div
                  className="h-full bg-gradient-to-l from-danger/80 to-danger transition-all duration-1000 ease-out"
                  style={{
                    width: `${sentimentPercent.bearish}%`,
                    boxShadow: '0 0 15px rgba(244,63,94,0.4)'
                  }}
                />
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-bg-base -translate-x-1/2 z-10" />
              </div>
            </div>

            {/* Vote Buttons */}
            {!hasVoted ? (
              <div className="grid grid-cols-2 gap-3 pt-2 relative z-10">
                <button
                  onClick={() => handleVote('bullish')}
                  className="py-2.5 rounded-xl text-xs font-bold border border-gain/30 text-gain bg-gain/5 hover:bg-gain/20 transition-all focus:outline-none shadow-[0_0_10px_rgba(16,185,129,0.1)] hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  Buy Target
                </button>
                <button
                  onClick={() => handleVote('bearish')}
                  className="py-2.5 rounded-xl text-xs font-bold border border-danger/30 text-danger bg-danger/5 hover:bg-danger/20 transition-all focus:outline-none shadow-[0_0_10px_rgba(244,63,94,0.1)] hover:shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                >
                  Sell Target
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl border border-gain/20 bg-gain/10 text-xs font-bold text-gain flex items-center justify-center gap-2 relative z-10 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                <ThumbsUp className="h-4 w-4 animate-bounce" />
                <span>Vote recorded!</span>
              </div>
            )}
          </div>

          {/* Trending Tickers leaderboard */}
          <div className="rounded-[2rem] p-6 border border-border/50 space-y-5 bg-bg-base/40 backdrop-blur-md">
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <TrendingUp className="h-4 w-4 text-brand-primary" />
              <span className="text-[11px] font-extrabold text-text-primary uppercase tracking-widest">
                Trending Discussions
              </span>
            </div>

            <div className="space-y-3">
              {trendingTickers.map((item, idx) => {
                const stock = stocks.find((s) => s.ticker === item.ticker);
                const isPos = stock ? stock.change >= 0 : true;

                return (
                  <div
                    key={item.ticker}
                    onClick={() => handleTickerClick(item.ticker)}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/40 hover:border-brand-primary/40 bg-bg-base/50 hover:bg-bg-base/90 transition-all cursor-pointer group shadow-sm hover:shadow-[0_0_15px_rgba(207,163,67,0.15)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-border/50 flex items-center justify-center text-[10px] font-extrabold text-text-secondary group-hover:text-brand-primary group-hover:bg-brand-primary/10 transition-colors">
                        {idx + 1}
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-text-primary font-sora group-hover:text-brand-primary transition-colors">
                          ${item.ticker}
                        </span>
                        <span className="block text-[10px] text-text-secondary mt-0.5">
                          {item.mentions} mentions
                        </span>
                      </div>
                    </div>

                    {stock && (
                      <span className={`text-[11px] font-extrabold px-2 py-1 rounded-lg border ${
                        isPos ? 'border-gain/20 text-gain bg-gain/10' : 'border-danger/20 text-danger bg-danger/10'
                      }`}>
                        {isPos ? '+' : ''}
                        {stock.change.toFixed(1)}%
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Guidelines disclaimer */}
          <div className="p-4 rounded-xl border border-border/60 bg-bg-base/30 space-y-2 text-[10px] leading-relaxed text-text-secondary">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-text-secondary/90">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Community Guidelines</span>
            </div>
            <p>
              Please keep discussions respectful and focused on Nigerian stock markets and personal portfolio building. No spam or coordinated pumping.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
