import React, { useState } from 'react';
import { MessageSquare, ThumbsUp, Send, TrendingUp, Users, ShieldAlert } from 'lucide-react';
// ngxStocks is loaded dynamically from store
import { useAppStore } from '@/lib/store';

interface Post {
  id: string;
  user: string;
  avatar: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Experienced';
  tickerTag?: string;
  timeAgo: string;
  content: string;
  likes: number;
  commentsCount: number;
  isLikedByUser?: boolean;
}

const initialPosts: Post[] = [
  {
    id: 'post-1',
    user: 'Tunde_Trades',
    avatar: 'TT',
    experienceLevel: 'Intermediate',
    tickerTag: 'OANDO',
    timeAgo: '12m ago',
    content: 'OANDO is absolutely flying after the Agip NAOC acquisition approval. The volumes are massive. Already up 9.8% today. Who else is holding this to ₦45? 🚀📈',
    likes: 24,
    commentsCount: 8,
  },
  {
    id: 'post-2',
    user: 'Ngozi_Invest',
    avatar: 'NI',
    experienceLevel: 'Beginner',
    tickerTag: 'ZENITHBANK',
    timeAgo: '2h ago',
    content: 'Just bought Zenith Bank shares for the interim dividend cash rewards. ₦1.00 per share is an amazing yield. Best dividend stock in Nigeria currently in my opinion! 🏦💰',
    likes: 42,
    commentsCount: 15,
  },
  {
    id: 'post-3',
    user: 'Chidi_Capital',
    avatar: 'CC',
    experienceLevel: 'Experienced',
    tickerTag: 'NESTLE',
    timeAgo: '5h ago',
    content: 'Interesting value play on NESTLE. Yes, the forex translation losses are severe and book value is negative, but operational revenues rose 24%. It is oversold. A long-term buy for patient capital.',
    likes: 18,
    commentsCount: 12,
  },
  {
    id: 'post-4',
    user: 'Amara_Wealth',
    avatar: 'AW',
    experienceLevel: 'Beginner',
    tickerTag: 'DANGCEM',
    timeAgo: '1d ago',
    content: 'Dangote Cement is my solid defensive anchor. Building works are everywhere in Lagos and Abuja. Stable earnings and they hold 60% of the market. Play safe!',
    likes: 31,
    commentsCount: 4,
  }
];

const trendingTickers = [
  { ticker: 'OANDO', mentions: 124, trend: 'up' },
  { ticker: 'ZENITHBANK', mentions: 98, trend: 'up' },
  { ticker: 'NESTLE', mentions: 86, trend: 'down' },
  { ticker: 'GTCO', mentions: 54, trend: 'neutral' }
];

export default function Community() {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [inputText, setInputText] = useState('');
  const [selectedTickerTag, setSelectedTickerTag] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [sentimentPercent, setSentimentPercent] = useState({ bullish: 68, bearish: 32 });

  const user = useAppStore((s) => s.user);
  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const setView = useAppStore((s) => s.setView);
  const stocks = useAppStore((s) => s.stocks);

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

  const handleLikePost = (postId: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const liked = !p.isLikedByUser;
          return {
            ...p,
            likes: liked ? p.likes + 1 : p.likes - 1,
            isLikedByUser: liked
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: user?.name.replace(/\s+/g, '_') || 'Guest_Investor',
      avatar: user?.name.slice(0, 2).toUpperCase() || 'GI',
      experienceLevel: user?.experienceLevel || 'Beginner',
      tickerTag: selectedTickerTag || undefined,
      timeAgo: 'Just now',
      content: inputText.trim(),
      likes: 0,
      commentsCount: 0,
      isLikedByUser: false
    };

    setPosts([newPost, ...posts]);
    setInputText('');
    setSelectedTickerTag('');
  };

  const handleTickerClick = (ticker: string) => {
    setSelectedTicker(ticker);
    setView('stock-detail');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10 text-left">
      {/* Top Banner */}
      <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden border border-brand-primary/15"
        style={{ background: 'linear-gradient(135deg, rgba(8, 29, 56, 0.9), rgba(4, 18, 38, 0.95))' }}>
        <div className="absolute inset-0 bg-brand-primary/2 opacity-50" />
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Users className="h-28 w-28 text-brand-primary" />
        </div>
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider border border-brand-primary/30 bg-brand-primary/10 text-brand-primary uppercase">
            <Users className="h-3.5 w-3.5" />
            Market Place
          </span>
          <h1 className="text-xl sm:text-2xl font-extrabold text-text-primary font-sora">
            EquityStack Community Feed
          </h1>
          <p className="text-xs text-text-secondary leading-relaxed max-w-xl font-medium font-dm-sans">
            Connect with thousands of retail investors trading on the NGX. Share investment ideas, discuss dividend payouts, and see real-time trader sentiment.
          </p>
        </div>
      </div>

      {/* Grid: Sentiment & Posting & Leaderboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Posting box & Posts Feed */}
        <div className="lg:col-span-8 space-y-5">
          {/* Post Creation Box */}
          <div className="rounded-2xl p-4 sm:p-5 border border-border"
            style={{ background: 'linear-gradient(145deg, #081D38, #041226)' }}>
            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-full flex items-center justify-center font-sora text-xs font-extrabold text-bg-base"
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}>
                  {user?.name.slice(0, 2).toUpperCase() || 'GI'}
                </div>
                <div>
                  <span className="block text-xs font-bold text-text-primary font-sora">
                    {user?.name || 'Guest Investor'}
                  </span>
                  <span className="block text-[9px] text-text-secondary uppercase font-extrabold tracking-wider">
                    {user?.experienceLevel || 'Beginner'} Tone
                  </span>
                </div>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="What stock are you buying or analyzing today? Share with the community..."
                rows={3}
                className="w-full bg-bg-base/60 border border-border/60 hover:border-border rounded-xl p-3 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand-primary/60 transition-all font-medium font-dm-sans"
              />

              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Ticker tag picker */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-text-secondary uppercase">
                    Tag Stock:
                  </span>
                  <select
                    value={selectedTickerTag}
                    onChange={(e) => setSelectedTickerTag(e.target.value)}
                    className="bg-bg-base border border-border/40 hover:border-brand-primary/45 rounded-lg px-2 py-1 text-[11px] font-bold text-brand-primary focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
                  >
                    <option value="">None</option>
                    {stocks.map((stock) => (
                      <option key={stock.ticker} value={stock.ticker}>
                        ${stock.ticker}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-4.5 py-2 rounded-xl text-xs font-bold bg-brand-primary text-bg-base hover:bg-brand-primary/95 disabled:opacity-40 transition-all flex items-center gap-1.5 focus:outline-none"
                  style={{ boxShadow: '0 4px 12px rgba(207,163,67,0.2)' }}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Publish</span>
                </button>
              </div>
            </form>
          </div>

          {/* Social Feed List */}
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Recent Activity Feed
            </h3>

            <div className="space-y-3.5">
              {posts.map((post) => {
                const experienceBadge = {
                  Beginner: 'border-gain/20 text-gain bg-gain/5',
                  Intermediate: 'border-warning/20 text-warning bg-warning/5',
                  Experienced: 'border-[#A855F7] text-[#A855F7] bg-[#A855F7]/5'
                };

                return (
                  <div
                    key={post.id}
                    className="rounded-2xl p-4.5 border border-border/70 hover:border-border transition-all duration-300 relative overflow-hidden"
                    style={{ background: 'linear-gradient(145deg, #081D38, #041226)' }}
                  >
                    {/* User info row */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="h-9 w-9 rounded-full flex items-center justify-center font-sora text-xs font-extrabold text-text-primary border border-border bg-bg-base">
                          {post.avatar}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-text-primary font-sora">
                              @{post.user}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold border uppercase tracking-wider ${experienceBadge[post.experienceLevel]}`}>
                              {post.experienceLevel}
                            </span>
                          </div>
                          <span className="block text-[9px] text-text-secondary mt-0.5">{post.timeAgo}</span>
                        </div>
                      </div>

                      {/* Tagged Stock Ticker Badge */}
                      {post.tickerTag && (
                        <button
                          onClick={() => handleTickerClick(post.tickerTag!)}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold text-brand-primary border border-brand-primary/20 bg-brand-primary/5 hover:bg-brand-primary/10 transition-colors focus:outline-none"
                        >
                          ${post.tickerTag}
                        </button>
                      )}
                    </div>

                    {/* Content text */}
                    <p className="text-xs text-text-primary/90 font-medium leading-relaxed font-dm-sans mb-3.5 whitespace-pre-line">
                      {post.content}
                    </p>

                    {/* Interactions footer */}
                    <div className="flex items-center gap-4.5 pt-3 border-t border-border/30 text-xs font-bold text-text-secondary font-dm-sans">
                      <button
                        onClick={() => handleLikePost(post.id)}
                        className={`flex items-center gap-1.5 hover:text-brand-primary transition-colors focus:outline-none ${
                          post.isLikedByUser ? 'text-brand-primary' : ''
                        }`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${post.isLikedByUser ? 'fill-brand-primary/25' : ''}`} />
                        <span>{post.likes} Likes</span>
                      </button>

                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-brand-primary transition-colors">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{post.commentsCount} Comments</span>
                      </div>
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
          <div className="rounded-2xl p-4 sm:p-5 border border-border text-center space-y-4"
            style={{ background: 'linear-gradient(145deg, #081D38, #041226)' }}>
            <div className="space-y-1">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-text-secondary block">
                NGX Sentiment Barometer
              </span>
              <h4 className="text-xs font-bold text-text-primary">
                Where is the market heading today?
              </h4>
            </div>

            {/* Gauge */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-extrabold font-sora">
                <span className="text-gain">📈 Bullish {sentimentPercent.bullish}%</span>
                <span className="text-danger">📉 Bearish {sentimentPercent.bearish}%</span>
              </div>
              <div className="w-full h-3 bg-danger/20 border border-danger/10 rounded-full overflow-hidden flex">
                <div
                  className="h-full bg-gain transition-all duration-500"
                  style={{
                    width: `${sentimentPercent.bullish}%`,
                    boxShadow: '0 0 10px rgba(16,185,129,0.3)'
                  }}
                />
              </div>
            </div>

            {/* Vote Buttons */}
            {!hasVoted ? (
              <div className="grid grid-cols-2 gap-2 pt-1.5">
                <button
                  onClick={() => handleVote('bullish')}
                  className="py-2 rounded-xl text-xs font-bold border border-gain/20 text-gain bg-gain/5 hover:bg-gain/10 transition-all focus:outline-none"
                >
                  📈 Bullish
                </button>
                <button
                  onClick={() => handleVote('bearish')}
                  className="py-2 rounded-xl text-xs font-bold border border-danger/20 text-danger bg-danger/5 hover:bg-danger/10 transition-all focus:outline-none"
                >
                  📉 Bearish
                </button>
              </div>
            ) : (
              <div className="p-3 rounded-xl border border-gain/15 bg-gain/5 text-[10px] font-bold text-gain flex items-center justify-center gap-1.5">
                <ThumbsUp className="h-3.5 w-3.5 animate-bounce" />
                <span>Thank you! Your vote has been cast.</span>
              </div>
            )}
          </div>

          {/* Trending Tickers leaderboard */}
          <div className="rounded-2xl p-4 sm:p-5 border border-border space-y-4"
            style={{ background: 'linear-gradient(145deg, #081D38, #041226)' }}>
            <div className="flex items-center gap-1.5 border-b border-border/30 pb-2.5">
              <TrendingUp className="h-4 w-4 text-brand-primary" />
              <span className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest">
                Trending Tickers
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
                    className="flex items-center justify-between p-2 rounded-xl border border-border/30 hover:border-brand-primary/30 bg-bg-base/40 hover:bg-bg-base/80 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-text-secondary w-4">
                        {idx + 1}.
                      </span>
                      <div>
                        <span className="block text-xs font-bold text-text-primary group-hover:text-brand-primary transition-colors">
                          ${item.ticker}
                        </span>
                        <span className="block text-[9px] text-text-secondary">
                          {item.mentions} discussions
                        </span>
                      </div>
                    </div>

                    {stock && (
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${
                        isPos ? 'text-gain bg-gain/5' : 'text-danger bg-danger/5'
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
