'use client';

import React, { useState } from 'react';
import {
  Home as HomeIcon,
  BarChart2,
  Newspaper,
  Briefcase,
  User,
  Sparkles,
  LogOut,
  Bell,
  ChevronRight,
  ChevronDown,
  Check,
  Zap,
  Info,
  TrendingUp,
  Shield,
  Percent,
  Award,
} from 'lucide-react';

import { useAppStore } from '@/lib/store';
import { ngxStocks, mockNews, Stock } from '@/lib/mockData';

import MarketStatus from '@/components/MarketStatus';
import TopMovers from '@/components/TopMovers';
import AIDailyBrief from '@/components/AIDailyBrief';
import StockExplorer from '@/components/StockExplorer';
import StockDetail from '@/components/StockDetail';
import AINewsFeed from '@/components/AINewsFeed';
import PortfolioTracker from '@/components/PortfolioTracker';
import AIChatbot from '@/components/AIChatbot';
import AboutUs from '@/components/AboutUs';

// ─── Reusable dark input style ─────────────────────────
const inputCls = "w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:ring-0 focus:outline-none text-text-primary placeholder:text-text-secondary transition-all";
const inputStyle = { background: 'rgba(14,13,37,0.8)', border: '1px solid #23214C' };

export default function Page() {
  const currentView     = useAppStore((s) => s.currentView);
  const setView         = useAppStore((s) => s.setView);
  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const user            = useAppStore((s) => s.user);
  const loginUser       = useAppStore((s) => s.loginUser);
  const setOnboarding   = useAppStore((s) => s.setOnboarding);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const logoutUser      = useAppStore((s) => s.logoutUser);
  const watchlist       = useAppStore((s) => s.watchlist);

  const [emailInput, setEmailInput]   = useState('');
  const [nameInput, setNameInput]     = useState('');
  const [authMode, setAuthMode]       = useState<'login' | 'signup'>('signup');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep]   = useState(1);
  const [activeHomeTab, setActiveHomeTab]     = useState<'report' | 'dividend' | 'growth' | 'analyst' | 'safe'>('report');

  const availableInterests = ['Banking', 'Consumer Goods', 'Oil & Gas', 'Industrials', 'Agriculture', 'Technology'];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) loginUser(nameInput.trim() || 'Investor', emailInput.trim());
  };

  const handleOnboardingNext = () => {
    if (onboardingStep < 3) setOnboardingStep(onboardingStep + 1);
    else completeOnboarding();
  };

  const handleOnboardingSkip = () => {
    setOnboarding({ experienceLevel: 'Beginner', interests: [] });
    completeOnboarding();
  };

  const renderViewContent = () => {
    switch (currentView) {
      case 'home':      return renderHomeView();
      case 'markets':   return <StockExplorer />;
      case 'news':      return <AINewsFeed />;
      case 'portfolio': return <PortfolioTracker />;
      case 'profile':   return renderProfileView();
      case 'stock-detail': return <StockDetail />;
      case 'about':     return <AboutUs />;
      default:          return renderHomeView();
    }
  };

  // ─── Home Dashboard View ────────────────────────────────
  const renderHomeView = () => {
    const watchStocks = ngxStocks.filter((s) => watchlist.includes(s.ticker)).slice(0, 4);

    // ── Data Computations for Tabs ────────────────────────
    const dividendStocks = [...ngxStocks]
      .filter(s => parseFloat(s.dividendYield) > 0)
      .sort((a, b) => parseFloat(b.dividendYield) - parseFloat(a.dividendYield))
      .slice(0, 6);

    const catalysts: Record<string, string> = {
      OANDO: 'Agip Oil Field Acquisition Approval',
      SEPLAT: 'MPNU Asset Acquisition Catalyst',
      UBA: 'Pan-African Subsidiary Earnings Expansion',
      ACCESSCORP: 'Rights Issue Recapitalization Anchor',
      DANGCEM: 'Sub-Saharan Infrastructure Growth',
      ZENITHBANK: 'High Net Margin Yield & Tech Focus',
    };
    const growthStocks = [...ngxStocks]
      .filter(s => catalysts[s.ticker])
      .sort((a, b) => b.change - a.change)
      .slice(0, 6)
      .map(s => ({ ...s, catalyst: catalysts[s.ticker] }));

    const analystPicks = [...ngxStocks]
      .map(s => {
        const upside = ((s.targetPrice - s.price) / s.price) * 100;
        return { ...s, upside };
      })
      .filter(s => s.upside > 0)
      .sort((a, b) => b.upside - a.upside)
      .slice(0, 6);

    const safeStocksList = ['DANGCEM', 'BUAFOODS', 'MTNN', 'ZENITHBANK', 'GTCO'];
    const safetyReasons: Record<string, string> = {
      DANGCEM: 'Defensive Infrastructure Play',
      BUAFOODS: 'Inelastic Food Staples Demand',
      MTNN: 'Leading Telecom Subscriber Moat',
      ZENITHBANK: 'High Tier-1 Capital Buffers',
      GTCO: 'Industry-Best Cost Efficiency Ratio',
    };
    const safeStocks = [...ngxStocks]
      .filter(s => safeStocksList.includes(s.ticker))
      .map(s => ({ ...s, safetyReason: safetyReasons[s.ticker] }))
      .slice(0, 6);

    // ── Helper to render custom stock card for tabs ─────
    const renderDashboardStockCard = ({
      stock,
      metricLabel,
      metricValue,
      metricSub,
      badge,
      color,
    }: {
      stock: Stock;
      metricLabel: string;
      metricValue: string;
      metricSub?: string;
      badge: React.ReactNode;
      color: string;
    }) => {
      const isPos = stock.change >= 0;
      const min = Math.min(...stock.sparkline);
      const max = Math.max(...stock.sparkline);
      const range = max - min || 1;
      const W = 100;
      const H = 28;

      const points = stock.sparkline.map((val: number, idx: number) => ({
        x: (idx / (stock.sparkline.length - 1)) * W,
        y: H - 2 - ((val - min) / range) * (H - 4),
      }));

      const linePath = points.reduce((d: string, p: { x: number; y: number }, i: number) => d + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
      const areaPath = linePath + ` L ${W} ${H} L 0 ${H} Z`;

      return (
        <div
          key={stock.ticker}
          onClick={() => setSelectedTicker(stock.ticker)}
          className="rounded-2xl p-4 sm:p-5 cursor-pointer border hover:border-brand-primary/40 transition-all duration-300 group relative overflow-hidden text-left"
          style={{
            background: 'linear-gradient(145deg, #0E0D25, #070615)',
            borderColor: '#23214C',
          }}
        >
          {/* Hover glow */}
          <div className="absolute inset-0 bg-brand-primary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold font-sora text-text-primary group-hover:text-brand-primary transition-colors">
                  {stock.ticker}
                </span>
                <span className="px-1.5 py-0.5 bg-bg-base border border-border rounded text-[9px] font-bold text-text-secondary">
                  {stock.sector}
                </span>
              </div>
              <p className="text-[10px] text-text-secondary font-medium font-dm-sans truncate max-w-[140px] mt-0.5">
                {stock.name}
              </p>
            </div>
            {badge}
          </div>

          {/* Price & Sparkline */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <div>
              <span className="text-sm font-extrabold text-text-primary font-sora">
                ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </span>
              <span className={`block text-[10px] font-bold ${isPos ? 'text-gain' : 'text-danger'} mt-0.5`}>
                {isPos ? '+' : ''}{stock.change.toFixed(1)}%
              </span>
            </div>

            <div className="h-7 w-20 opacity-80">
              <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                <defs>
                  <linearGradient id={`area-card-grad-${stock.ticker}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={isPos ? '#10B981' : '#FF4D4D'} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={isPos ? '#10B981' : '#FF4D4D'} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path d={areaPath} fill={`url(#area-card-grad-${stock.ticker})`} />
                <path d={linePath} fill="none" stroke={isPos ? '#10B981' : '#FF4D4D'} strokeWidth="1.5"
                  strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Metric Bottom Row */}
          <div className="flex items-center justify-between pt-3 border-t border-border/40 text-xs font-semibold font-dm-sans">
            <div className="flex-grow pr-2 min-w-0">
              <span className="block text-[8px] text-text-secondary font-bold uppercase tracking-wider">
                {metricLabel}
              </span>
              <span className="text-xs font-extrabold text-text-primary mt-0.5 block truncate" style={{ color }}>
                {metricValue}
              </span>
            </div>
            {metricSub && (
              <div className="text-right flex-shrink-0">
                <span className="block text-[8px] text-text-secondary font-bold uppercase tracking-wider">
                  Details
                </span>
                <span className="text-[10px] font-bold text-text-secondary mt-0.5 block">
                  {metricSub}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-6">
        
        {/* ─── Premium Tab Switched Navigation ─── */}
        <div className="space-y-5">
          <div className="flex gap-2 overflow-x-auto pb-1.5 custom-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {([
              { id: 'report', label: 'Daily Market Report', icon: Newspaper, color: '#6366F1' },
              { id: 'dividend', label: 'Best Dividend Paying Stocks', icon: Percent, color: '#10B981' },
              { id: 'growth', label: 'Fast Growing Companies', icon: TrendingUp, color: '#A855F7' },
              { id: 'analyst', label: 'Top Analyst Picks', icon: Award, color: '#00B8FF' },
              { id: 'safe', label: 'Play Safe Stocks', icon: Shield, color: '#FFB800' }
            ] as const).map((tab) => {
              const TabIcon = tab.icon;
              const isSelected = activeHomeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveHomeTab(tab.id)}
                  className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-300 border focus:outline-none"
                  style={isSelected
                    ? { backgroundColor: tab.color, borderColor: tab.color, color: '#070615', boxShadow: `0 0 16px ${tab.color}35` }
                    : { backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ─── Tab Content ─── */}
          {activeHomeTab === 'report' && (
            <div className="space-y-6 animate-in fade-in duration-300 text-left">
              <MarketStatus />
              <TopMovers />
              <AIDailyBrief />
            </div>
          )}

          {activeHomeTab === 'dividend' && (
            <div className="space-y-4 animate-in fade-in duration-300 text-left">
              <div>
                <h3 className="text-sm font-extrabold text-text-primary font-sora">Best Dividend Paying Stocks</h3>
                <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">Top-yielding equities on the NGX offering defensive income payouts</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dividendStocks.map((stock) =>
                  renderDashboardStockCard({
                    stock,
                    metricLabel: 'Dividend Yield',
                    metricValue: `${stock.dividendYield} Yield`,
                    metricSub: stock.peRatio > 0 ? `${stock.peRatio}x P/E` : 'N/A P/E',
                    color: '#10B981',
                    badge: (
                      <span className="px-1.5 py-0.5 bg-gain/10 text-gain border border-gain/20 rounded-md text-[9px] font-extrabold uppercase">
                        Yield Leader
                      </span>
                    ),
                  })
                )}
              </div>
            </div>
          )}

          {activeHomeTab === 'growth' && (
            <div className="space-y-4 animate-in fade-in duration-300 text-left">
              <div>
                <h3 className="text-sm font-extrabold text-text-primary font-sora">Fast Growing Companies you should invest in</h3>
                <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">Equities experiencing high revenue growth, operational scale, or transformational catalysts</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {growthStocks.map((stock) =>
                  renderDashboardStockCard({
                    stock,
                    metricLabel: 'Growth Catalyst',
                    metricValue: stock.catalyst,
                    metricSub: stock.eps > 0 ? `₦${stock.eps.toFixed(1)} EPS` : 'N/A',
                    color: '#A855F7',
                    badge: (
                      <span className="px-1.5 py-0.5 bg-brand-primary/10 text-[#A855F7] border border-[#A855F7]/30 rounded-md text-[9px] font-extrabold uppercase">
                        Expansion
                      </span>
                    ),
                  })
                )}
              </div>
            </div>
          )}

          {activeHomeTab === 'analyst' && (
            <div className="space-y-4 animate-in fade-in duration-300 text-left">
              <div>
                <h3 className="text-sm font-extrabold text-text-primary font-sora">Top stock pick from analysts</h3>
                <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">NGX equities showing the highest analyst consensus target upside from current market price</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {analystPicks.map((stock) =>
                  renderDashboardStockCard({
                    stock,
                    metricLabel: 'Analyst Target Upside',
                    metricValue: `+${stock.upside.toFixed(1)}% Upside`,
                    metricSub: `Target ₦${stock.targetPrice.toFixed(0)}`,
                    color: '#00B8FF',
                    badge: (
                      <span className="px-1.5 py-0.5 bg-bg-base border border-brand-primary/20 text-[#00B8FF] rounded-md text-[9px] font-extrabold uppercase">
                        {stock.decision} Pick
                      </span>
                    ),
                  })
                )}
              </div>
            </div>
          )}

          {activeHomeTab === 'safe' && (
            <div className="space-y-4 animate-in fade-in duration-300 text-left">
              <div>
                <h3 className="text-sm font-extrabold text-text-primary font-sora">Play Safe Stocks</h3>
                <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">Stable defensive anchors with dominant market share, resilient utility-like cash flows, or inelastic consumer demand</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {safeStocks.map((stock) =>
                  renderDashboardStockCard({
                    stock,
                    metricLabel: 'Defensive Anchor',
                    metricValue: stock.safetyReason,
                    metricSub: `Cap ${stock.marketCap}`,
                    color: '#FFB800',
                    badge: (
                      <span className="px-1.5 py-0.5 bg-warning/10 text-warning border border-warning/20 rounded-md text-[9px] font-extrabold uppercase">
                        Low Volatility
                      </span>
                    ),
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Watchlist Preview */}
        <div className="rounded-2xl border border-border overflow-hidden"
          style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
            <h3 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Watchlist Preview
            </h3>
            <button onClick={() => setView('markets')}
              className="text-[10px] font-bold text-brand-primary hover:underline font-dm-sans focus:outline-none">
              Manage all stocks →
            </button>
          </div>

          <div className="p-4 sm:p-5">
            {watchStocks.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {watchStocks.map((stock) => {
                  const isPos = stock.change >= 0;
                  const color = isPos ? '#10B981' : '#FF4D4D';
                  return (
                    <button key={stock.ticker} onClick={() => setSelectedTicker(stock.ticker)}
                      className="p-4 rounded-xl text-left transition-all duration-200 border group focus:outline-none animate-in fade-in"
                      style={{ background: '#070615', borderColor: '#23214C' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = color;
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 16px ${color}20`;
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#23214C';
                        (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                      }}>
                      <span className="text-xs font-extrabold font-sora block mb-0.5"
                        style={{ color, textShadow: `0 0 8px ${color}50` }}>
                        {stock.ticker}
                      </span>
                      <span className="text-sm font-extrabold text-text-primary font-sora block mb-1.5">
                        ₦{stock.price.toFixed(2)}
                      </span>
                      <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${
                        isPos ? 'bg-brand-primary/10 text-brand-primary' : 'bg-danger/10 text-danger'
                      }`}>
                        {isPos ? '+' : ''}{stock.change.toFixed(1)}%
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 border border-dashed border-border/50 rounded-xl text-center text-xs text-text-secondary font-medium font-dm-sans">
                <span className="text-2xl block mb-2">⭐️</span>
                <span>Watchlist is empty. Start tracking your first NGX stock!</span>
                <button onClick={() => setView('markets')}
                  className="mt-3 block mx-auto px-4 py-2 rounded-xl text-[10px] font-bold text-bg-base focus:outline-none"
                  style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 10px rgba(99,102,241,0.3)' }}>
                  Add stocks
                </button>
              </div>
            )}
          </div>
        </div>

        {/* News Feed Snippet */}
        <div className="space-y-3">
          <h3 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
            AI News Snapshot
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockNews.slice(0, 2).map((news) => {
              const dotColors = { Positive: '#10B981', Negative: '#FF4D4D', Neutral: '#FFB800' };
              const dot = dotColors[news.marketImpact];
              return (
                <div key={news.id} onClick={() => setView('news')}
                  className="rounded-2xl p-4 sm:p-5 cursor-pointer transition-all duration-300 group border text-left"
                  style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)', borderColor: '#23214C', borderLeft: `3px solid ${dot}` }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${dot}50`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${dot}12`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = '#23214C';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}>
                  <div className="flex items-center justify-between text-[8px] font-bold text-text-secondary uppercase tracking-wider font-dm-sans mb-2">
                    <span>{news.source} · {news.timeAgo}</span>
                    <span className="px-1.5 py-0.5 rounded-lg border text-[9px]"
                      style={{ color: dot, borderColor: `${dot}30`, background: `${dot}10` }}>
                      {news.marketImpact}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-text-primary line-clamp-2 group-hover:text-brand-primary transition-colors mb-1.5">
                    {news.originalHeadline}
                  </h4>
                  <p className="text-xs text-text-secondary font-medium line-clamp-2 leading-relaxed font-dm-sans">
                    {news.aiSummary}
                  </p>
                  <div className="flex items-center gap-1 mt-3 pt-2.5 border-t border-border/40 text-[9px] text-brand-primary font-bold uppercase tracking-wider">
                    <span>Read analysis</span>
                    <span>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // ─── Profile View ───────────────────────────────────────
  const renderProfileView = () => (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="rounded-2xl p-6 border border-border"
        style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}>
        <div className="flex items-center gap-4 pb-4 border-b border-border/50 mb-4">
          <div className="h-16 w-16 rounded-full flex items-center justify-center font-sora text-xl font-extrabold text-bg-base flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 20px rgba(99,102,241,0.35)' }}>
            {user?.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-sora text-brand-primary" style={{ textShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
              {user?.name}
            </h2>
            <p className="text-xs text-text-secondary">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-brand-primary uppercase tracking-wider px-2 py-0.5 rounded-lg border border-brand-primary/20 bg-brand-primary/8">
              <Sparkles className="h-2.5 w-2.5" />
              {user?.experienceLevel} Investor
            </span>
          </div>
        </div>

        {/* Experience Level Selector */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-brand-primary animate-pulse" />
            <h3 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Financial Literacy Tone
            </h3>
          </div>
          <p className="text-xs text-text-secondary font-medium font-dm-sans leading-relaxed">
            Toggle your level to instantly adapt AI vocabulary across dashboard briefs, stock insights, and chatbot responses.
          </p>
          <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl border border-border/50"
            style={{ background: '#070615' }}>
            {(['Beginner', 'Intermediate', 'Experienced'] as const).map((lvl) => (
              <button key={lvl} onClick={() => setOnboarding({ experienceLevel: lvl })}
                className={`py-2 rounded-lg text-xs font-bold font-dm-sans transition-all duration-200 focus:outline-none ${
                  user?.experienceLevel === lvl ? 'text-bg-base' : 'text-text-secondary hover:text-text-primary'
                }`}
                style={user?.experienceLevel === lvl
                  ? { background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 10px rgba(99,102,241,0.3)' }
                  : {}}>
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Watchlist Stocks', value: `${watchlist.length} Tickers` },
          { label: 'Interests Selected', value: `${user?.interests.length || 0} Sectors` },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl p-4 border border-border"
            style={{ background: '#070615' }}>
            <span className="block text-[10px] text-text-secondary font-bold uppercase font-dm-sans mb-1">{label}</span>
            <span className="text-lg font-extrabold text-brand-primary font-sora" style={{ textShadow: '0 0 10px rgba(99,102,241,0.3)' }}>
              {value}
            </span>
          </div>
        ))}
      </div>

      <button onClick={logoutUser}
        className="w-full py-3 rounded-xl border border-danger/20 text-danger bg-danger/5 hover:bg-danger/10 font-bold text-xs flex items-center justify-center gap-2 transition-all focus:outline-none">
        <LogOut className="h-4 w-4" />
        Disconnect Session (Logout)
      </button>
    </div>
  );

  // ══════════════════════════════════════════════════════════
  // A. LANDING / SPLASH SCREEN
  // ══════════════════════════════════════════════════════════
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col font-dm-sans relative overflow-hidden">
        {/* ── Ambient Background Orbs ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,184,255,0.03) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)' }} />

        {/* ── Top Nav ── */}
        <nav className="max-w-7xl mx-auto w-full flex items-center justify-between px-5 sm:px-8 py-5 z-10 relative">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 16px rgba(99,102,241,0.4)' }}>
              <span className="text-bg-base font-sora font-extrabold text-sm tracking-tighter">ST</span>
            </div>
            <div>
              <span className="font-sora font-extrabold text-lg text-text-primary tracking-tight block leading-tight">SabiTrade</span>
              <span className="text-[9px] font-bold text-brand-primary uppercase tracking-widest leading-none">Market Pulse 🇳🇬</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="text-xs font-bold text-text-secondary hover:text-brand-primary px-4 py-2.5 rounded-xl transition-all focus:outline-none">
              Sign In
            </button>
            <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
              className="text-xs font-extrabold px-5 py-2.5 rounded-xl transition-all focus:outline-none text-bg-base"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 14px rgba(99,102,241,0.35)' }}>
              Create Account
            </button>
          </div>
        </nav>

        {/* ── Hero Section ── */}
        <div className="max-w-7xl mx-auto w-full flex flex-col items-center text-center z-10 px-5 sm:px-8 pt-8 pb-16 sm:pt-16 sm:pb-24 flex-grow">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-xs font-extrabold tracking-wide border"
            style={{ background: 'rgba(99,102,241,0.08)', borderColor: 'rgba(99,102,241,0.2)', color: '#818CF8' }}>
            <Zap className="h-3.5 w-3.5" />
            <span>Next-Gen NGX Investment Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-text-primary font-sora tracking-tight leading-[1.05] max-w-3xl mx-auto mb-6">
            Your Nigerian market{' '}
            <span className="relative inline-block" style={{ color: '#818CF8', textShadow: '0 0 40px rgba(99,102,241,0.4)' }}>
              intelligence
            </span>
            {', simplified.'}
          </h1>

          <p className="text-base sm:text-lg text-text-secondary leading-relaxed font-medium max-w-xl mx-auto mb-10">
            SabiTrade translates raw NGX data and complex financial metrics into clear, AI-powered summaries. Built for the modern Nigerian retail investor.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
              className="px-8 py-3.5 rounded-xl text-sm font-extrabold transition-all text-bg-base focus:outline-none"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 24px rgba(99,102,241,0.4)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(0,230,118,0.6)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(99,102,241,0.4)')}>
              Create Free Account
            </button>
            <button onClick={() => loginUser('Nigerian Investor', 'investor@sabitrade.ng')}
              className="px-8 py-3.5 rounded-xl text-sm font-extrabold transition-all border text-text-primary focus:outline-none"
              style={{ borderColor: '#23214C', background: 'rgba(14,13,37,0.6)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.3)')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = '#23214C')}>
              ⚡ Interactive Quick-Demo
            </button>
          </div>

          {/* ── Dashboard Mock Terminal ── */}
          <div className="w-full max-w-4xl rounded-2xl overflow-hidden border border-border shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}>
            {/* Window controls */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50"
              style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary/70" />
              </div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                SabiTrade Intelligence Terminal
              </span>
              <div className="w-12" />
            </div>

            <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-4 text-left">
              {/* ASI Index */}
              <div className="md:col-span-8 p-4 rounded-xl border border-border"
                style={{ background: 'rgba(0,0,0,0.3)' }}>
                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-text-secondary mb-2">
                  <span>Nigerian Exchange · All-Share Index</span>
                  <span className="text-brand-primary flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                    LIVE
                  </span>
                </div>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-2xl font-extrabold font-sora text-brand-primary"
                    style={{ textShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
                    ₦104,256.80
                  </span>
                  <span className="text-xs font-bold text-brand-primary px-2 py-0.5 rounded-lg bg-brand-primary/10 border border-brand-primary/20">
                    +1.4%
                  </span>
                </div>
                <div className="h-8 w-full opacity-70">
                  <svg className="w-full h-full" viewBox="0 0 400 32" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 20 Q 40 14, 80 18 T 160 10 T 240 16 T 320 6 T 400 12 L 400 32 L 0 32 Z"
                      fill="url(#hero-area)" />
                    <path d="M 0 20 Q 40 14, 80 18 T 160 10 T 240 16 T 320 6 T 400 12"
                      fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Movers */}
              <div className="md:col-span-4 p-4 rounded-xl border border-border space-y-2.5"
                style={{ background: 'rgba(0,0,0,0.3)' }}>
                <span className="text-[9px] font-bold uppercase tracking-wider text-text-secondary block"></span>
                {[
                  { t: 'ZENITHBANK', ch: '+3.2%', up: true },
                  { t: 'DANGCEM', ch: '+2.5%', up: true },
                  { t: 'GTCO', ch: '-0.8%', up: false },
                ].map((s) => (
                  <div key={s.t} className="flex items-center justify-between border-t border-border/30 pt-2">
                    <span className="text-xs font-extrabold font-sora" style={{ color: s.up ? '#10B981' : '#FF4D4D' }}>{s.t}</span>
                    <span className="text-xs font-extrabold" style={{ color: s.up ? '#10B981' : '#FF4D4D' }}>{s.ch}</span>
                  </div>
                ))}
              </div>

              {/* AI Brief */}
              <div className="md:col-span-12 p-4 rounded-xl border border-brand-primary/15"
                style={{ background: 'rgba(99,102,241,0.03)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-brand-primary">Sora AI Market Summary</span>
                </div>
                <p className="text-xs text-text-primary/80 leading-relaxed font-medium">
                  &ldquo;The market is riding high on local investor confidence. Dangote Cement led the charge today like an anchor tenant in Balogun Market, pulling secondary real estate and manufacturing equities up behind it. Watch bank stocks closely as liquidity reserves expand...&rdquo;
                </p>
              </div>
            </div>
          </div>

          {/* ── Value Props Grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-12 max-w-4xl w-full text-left">
            {[
              { title: 'NGX Top 50 Stocks', desc: 'Detailed metrics, sparkline indices, and historical datasets covering the most active companies on the Nigerian Exchange.' },
              { title: 'Sora AI Interpretations', desc: 'Say goodbye to financial jargon. We simplify complex indicators using local analogies and plain-English briefs.' },
              { title: 'Manual Portfolio Ledger', desc: 'Log stock purchases, track cost bases, calculate real-time gains, and visualize asset allocations with SVG donut charts.' },
            ].map(({ title, desc }) => (
              <div key={title} className="rounded-2xl p-5 border border-border transition-all duration-300 group"
                style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(0,230,118,0.25)')}
                onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(30,48,40,0.6)')}>
                <div className="h-1 w-8 rounded-full mb-3" style={{ background: 'linear-gradient(90deg, #6366F1, transparent)' }} />
                <span className="block text-sm font-extrabold text-text-primary font-sora mb-2 group-hover:text-brand-primary transition-colors">{title}</span>
                <span className="text-xs text-text-secondary leading-relaxed font-medium font-dm-sans">{desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto w-full z-10 text-center text-[10px] text-text-secondary font-medium font-dm-sans border-t border-border/40 py-5 px-5">
          © {new Date().getFullYear()} SabiTrade · Nigerian Financial Intelligence Platform · MVP v1.0 · Strictly Confidential
        </div>

        {/* ── Auth Modal ── */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}>
            <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-300"
              style={{ background: 'rgba(14,13,37,0.97)', border: '1px solid rgba(0,230,118,0.15)', boxShadow: '0 0 0 1px rgba(0,230,118,0.04), 0 40px 80px rgba(0,0,0,0.8)' }}>
              {/* Top border */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #6366F1, transparent)' }} />
              {/* Ambient glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />

              {/* Close */}
              <button onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-2 rounded-full transition-colors focus:outline-none"
                style={{ background: 'rgba(14,13,37,0.8)' }}>
                ✕
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 12px rgba(99,102,241,0.4)' }}>
                    <span className="text-bg-base font-sora font-extrabold text-xs">ST</span>
                  </div>
                  <span className="font-sora font-extrabold text-text-primary text-sm">SabiTrade</span>
                </div>

                <h2 className="text-2xl font-extrabold font-sora tracking-tight mb-1 text-brand-primary"
                  style={{ textShadow: '0 0 20px rgba(99,102,241,0.3)' }}>
                  {authMode === 'signup' ? 'Start Your Journey' : 'Welcome Back'}
                </h2>
                <p className="text-xs text-text-secondary font-medium mb-6 font-dm-sans">
                  {authMode === 'signup'
                    ? 'Join thousands of retail investors compounding wealth on the NGX.'
                    : 'Enter your credentials to access your intelligence dashboard.'}
                </p>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans mb-1.5">Full Name</label>
                      <input type="text" required placeholder="e.g. Tunde Balogun" value={nameInput}
                        onChange={(e) => setNameInput(e.target.value)}
                        className={inputCls} style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.4)')}
                        onBlur={e => (e.target.style.borderColor = '#23214C')} />
                    </div>
                  )}
                  <div>
                    <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans mb-1.5">Email Address</label>
                    <input type="email" required placeholder="e.g. tunde@gmail.com" value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className={inputCls} style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.4)')}
                      onBlur={e => (e.target.style.borderColor = '#23214C')} />
                  </div>
                  <button type="submit"
                    className="w-full py-3 rounded-xl text-xs font-bold transition-all text-bg-base mt-2 focus:outline-none"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
                    {authMode === 'signup' ? 'Sign Up for Free' : 'Sign In Now'}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-5 flex items-center">
                  <div className="flex-grow border-t border-border/50" />
                  <span className="mx-3 text-[10px] font-bold text-text-secondary uppercase px-1"
                    style={{ background: 'transparent' }}>Or</span>
                  <div className="flex-grow border-t border-border/50" />
                </div>

                {/* Google Auth */}
                <button onClick={() => loginUser('Mock User', 'user@gmail.com')}
                  className="w-full py-2.5 rounded-xl text-xs font-bold text-text-primary flex items-center justify-center gap-2 transition-all focus:outline-none border border-border/50"
                  style={{ background: 'rgba(14,13,37,0.6)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,230,118,0.2)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(35,33,76,0.5)')}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Connect via Google Account
                </button>

                <p className="mt-5 text-center text-[11px] font-medium text-text-secondary">
                  {authMode === 'signup' ? 'Already have an account?' : 'Need to register?'}
                  <button onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    className="ml-1 text-brand-primary font-bold hover:underline focus:outline-none">
                    {authMode === 'signup' ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // B. ONBOARDING WIZARD
  // ══════════════════════════════════════════════════════════
  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-bg-base flex flex-col py-10 px-4 sm:px-6 relative font-dm-sans overflow-hidden">
        {/* Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />

        {/* Brand header */}
        <div className="max-w-xl mx-auto w-full flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 12px rgba(99,102,241,0.35)' }}>
              <span className="text-bg-base font-sora font-extrabold text-xs">ST</span>
            </div>
            <span className="font-sora font-extrabold text-sm text-brand-primary">SabiTrade Onboarding</span>
          </div>
          <button onClick={handleOnboardingSkip}
            className="text-xs font-bold text-text-secondary hover:text-text-primary focus:outline-none">
            Skip →
          </button>
        </div>

        {/* Wizard Panel */}
        <div className="max-w-xl mx-auto w-full rounded-3xl p-6 sm:p-8 space-y-6 z-10 relative"
          style={{ background: 'rgba(14,13,37,0.97)', border: '1px solid rgba(99,102,241,0.12)', boxShadow: '0 0 0 1px rgba(99,102,241,0.03), 0 40px 80px rgba(0,0,0,0.7)' }}>
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, transparent, #6366F1, transparent)' }} />

          {/* Progress */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              Step {onboardingStep} of 3
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`h-1.5 rounded-full transition-all duration-300 ${
                  onboardingStep === s ? 'w-6' : 'w-1.5 bg-border'
                }`} style={onboardingStep === s ? { background: '#10B981', boxShadow: '0 0 8px rgba(99,102,241,0.5)' } : {}} />
              ))}
            </div>
          </div>

          {/* Step 1: Name */}
          {onboardingStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider block w-max mb-2 border border-brand-primary/20 text-brand-primary"
                  style={{ background: 'rgba(99,102,241,0.08)' }}>
                  Welcome to SabiTrade
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary font-sora tracking-tight">
                  Let&apos;s personalize your intelligence
                </h2>
                <p className="text-xs text-text-secondary font-medium mt-1 leading-relaxed">
                  We customize AI vocabulary, charts, and news interpretations to match your profile.
                </p>
              </div>
              <div>
                <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans mb-1.5">
                  Your Full Name
                </label>
                <input type="text" placeholder="Tunde Balogun" value={user?.name || ''}
                  onChange={(e) => setOnboarding({ name: e.target.value })}
                  className={inputCls} style={inputStyle}
                  onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.4)')}
                  onBlur={e => (e.target.style.borderColor = '#23214C')} />
              </div>
            </div>
          )}

          {/* Step 2: Experience */}
          {onboardingStep === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider block w-max mb-2 border border-brand-primary/20 text-brand-primary"
                  style={{ background: 'rgba(99,102,241,0.08)' }}>
                  AI Calibration
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary font-sora tracking-tight">
                  How familiar are you with investing?
                </h2>
                <p className="text-xs text-text-secondary font-medium mt-1 leading-relaxed">
                  Our AI adapts its vocabulary to match your level — from Balogun market analogies to Gordon growth models.
                </p>
              </div>
              <div className="space-y-2.5">
                {(['Beginner', 'Intermediate', 'Experienced'] as const).map((lvl) => {
                  const desc = {
                    Beginner: 'Scared of charts? We use friendly Balogun Market analogies to explain everything.',
                    Intermediate: 'Understand P/E ratios and dividends — you want concise metrics without the fluff.',
                    Experienced: 'Show me capital adequacy ratios, DCF models, and sovereign risk premiums.',
                  };
                  const isSelected = user?.experienceLevel === lvl;
                  return (
                    <button key={lvl} onClick={() => setOnboarding({ experienceLevel: lvl })}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-200 border focus:outline-none`}
                      style={{
                        background: isSelected ? 'rgba(99,102,241,0.06)' : 'rgba(14,13,37,0.5)',
                        borderColor: isSelected ? 'rgba(99,102,241,0.3)' : '#23214C',
                        boxShadow: isSelected ? '0 0 16px rgba(99,102,241,0.1)' : 'none',
                      }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-extrabold font-sora text-brand-primary">{lvl} Investor</span>
                        {isSelected && <Check className="h-4 w-4 text-brand-primary" />}
                      </div>
                      <p className="text-[11px] leading-relaxed text-text-secondary font-medium font-dm-sans">{desc[lvl]}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Sectors */}
          {onboardingStep === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider block w-max mb-2 border border-brand-primary/20 text-brand-primary"
                  style={{ background: 'rgba(99,102,241,0.08)' }}>
                  Market Sectors
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-text-primary font-sora tracking-tight">
                  What areas are you tracking?
                </h2>
                <p className="text-xs text-text-secondary font-medium mt-1 leading-relaxed">
                  Select sectors to pre-configure your watchlist and AI news indicators.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {availableInterests.map((interest) => {
                  const isSelected = user?.interests.includes(interest);
                  return (
                    <button key={interest}
                      onClick={() => {
                        const current = user?.interests || [];
                        const next = current.includes(interest)
                          ? current.filter((x) => x !== interest)
                          : [...current, interest];
                        setOnboarding({ interests: next });
                      }}
                      className="p-3.5 rounded-xl border font-bold text-xs transition-all duration-200 flex items-center justify-between focus:outline-none"
                      style={{
                        background: isSelected ? 'rgba(99,102,241,0.06)' : 'rgba(14,13,37,0.5)',
                        borderColor: isSelected ? 'rgba(99,102,241,0.3)' : '#23214C',
                      }}>
                      <span className={isSelected ? 'text-brand-primary' : 'text-text-secondary'}>{interest}</span>
                      {isSelected && <Check className="h-3.5 w-3.5 text-brand-primary" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            {onboardingStep > 1 && (
              <button onClick={() => setOnboardingStep(onboardingStep - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary border border-border/40 transition-colors focus:outline-none">
                Back
              </button>
            )}
            <button onClick={handleOnboardingNext}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-bg-base flex items-center gap-1.5 transition-all focus:outline-none"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 14px rgba(99,102,241,0.35)' }}>
              <span>{onboardingStep === 3 ? 'Launch Dashboard' : 'Next Step'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="max-w-xl mx-auto w-full text-center text-[10px] text-text-secondary font-medium font-dm-sans border-t border-border/30 pt-5 mt-6 relative z-10">
          SabiTrade Onboarding · Secure · Paperless · BVN exempt
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // C. MAIN DASHBOARD SHELL
  // ══════════════════════════════════════════════════════════

  // Nav structure — each item supports an optional `children` array for future dropdowns.
  // When `children` is present, a ChevronDown is rendered and the item becomes a dropdown trigger.
  const navItems = [
    {
      id: 'home',
      label: 'Overview',
      // No children — plain link
    },
    {
      id: 'markets',
      label: 'Markets',
      // Future: children: [{ label: 'Stock Explorer', id: 'markets' }, { label: 'Sector Heat Map', id: 'sectors' }]
    },
    {
      id: 'news',
      label: 'News & Insights',
      badge: true,
      // Future: children: [{ label: 'AI News Feed', id: 'news' }, { label: 'Market Calendar', id: 'calendar' }]
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      // Future: children: [{ label: 'Holdings', id: 'portfolio' }, { label: 'Performance', id: 'performance' }]
    },
    {
      id: 'about',
      label: 'About us',
    },
  ] as const;

  // Mobile bottom bar keeps icons for quick recognition at small sizes
  const mobileNavItems = [
    { id: 'home' as const,      label: 'Home',      icon: HomeIcon },
    { id: 'markets' as const,   label: 'Markets',   icon: BarChart2 },
    { id: 'news' as const,      label: 'News',      icon: Newspaper, badge: true },
    { id: 'portfolio' as const, label: 'Portfolio', icon: Briefcase },
    { id: 'about' as const,     label: 'About',     icon: Info },
    { id: 'profile' as const,   label: 'Profile',   icon: User },
  ];

  return (
    <div className="min-h-screen bg-bg-base font-dm-sans flex flex-col">

      {/* ══════════════════════════════════════════════════════
          DESKTOP TOP NAVIGATION
          ══════════════════════════════════════════════════════ */}
      <header className="hidden lg:block sticky top-0 z-40 glass-nav">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between" style={{ height: '56px' }}>

          {/* ── Brand ───────────────────────────────────────── */}
          <div className="flex items-center gap-3 flex-shrink-0 pr-8 border-r border-border/40">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 12px rgba(99,102,241,0.35)' }}>
              <span className="text-bg-base font-sora font-extrabold text-xs tracking-tighter">ST</span>
            </div>
            <div className="leading-none">
              <span className="font-sora font-extrabold text-sm tracking-tight text-text-primary block">SabiTrade</span>
              <span className="text-[8px] font-bold text-brand-primary uppercase tracking-[0.15em] block mt-0.5">NGX Intelligence</span>
            </div>
          </div>

          {/* ── Primary Nav Links ───────────────────────────── */}
          <nav className="flex items-center flex-1 px-6">
            {navItems.map((item) => {
              const isActive = currentView === item.id ||
                (item.id === 'markets' && currentView === 'stock-detail');
              // hasChildren would be true when item.children is populated in the future
              const hasChildren = false;

              return (
                <div key={item.id} className="relative group">
                  <button
                    onClick={() => setView(item.id as 'home' | 'markets' | 'news' | 'portfolio' | 'about')}
                    className="relative flex items-center gap-1.5 px-4 py-1 text-sm font-semibold transition-colors duration-200 focus:outline-none whitespace-nowrap"
                    style={{
                      color: isActive ? '#6366F1' : 'rgba(255,255,255,0.55)',
                      fontFamily: 'var(--font-dm-sans)',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)';
                    }}
                    onMouseLeave={e => {
                      if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)';
                    }}
                  >
                    <span>{item.label}</span>

                    {/* Live badge dot */}
                    {'badge' in item && item.badge && (
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-primary"
                        style={{ boxShadow: '0 0 4px rgba(99,102,241,0.8)' }} />
                    )}

                    {/* Dropdown chevron — shown when item has children */}
                    {hasChildren && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-50 group-hover:opacity-100 transition-all duration-200 group-hover:rotate-180" />
                    )}

                    {/* Active underline indicator */}
                    {isActive && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-px rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, #6366F1, transparent)',
                          boxShadow: '0 0 8px rgba(0,230,118,0.6)',
                          bottom: '-9px',  // aligns to the bottom edge of the header
                        }}
                      />
                    )}
                  </button>

                  {/*
                    ── DROPDOWN PANEL (future use) ──────────────────
                    When item.children is populated, render this panel.
                    Currently hidden — structure is ready for wiring up.

                    <div className="absolute top-full left-0 mt-2 min-w-[200px] glass-elevated
                      rounded-xl p-1.5 opacity-0 pointer-events-none group-hover:opacity-100
                      group-hover:pointer-events-auto transition-all duration-200
                      translate-y-1 group-hover:translate-y-0 shadow-card z-50">
                      {item.children?.map(child => (
                        <button key={child.id}
                          onClick={() => setView(child.id)}
                          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs
                            font-semibold text-text-secondary hover:text-text-primary
                            hover:bg-bg-hover transition-colors text-left focus:outline-none">
                          {child.label}
                        </button>
                      ))}
                    </div>
                  */}
                </div>
              );
            })}
          </nav>

          {/* ── Right Controls ──────────────────────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notifications */}
            <button
              className="relative p-2 rounded-lg transition-all focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)')}
              title="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full"
                style={{ background: '#10B981', boxShadow: '0 0 4px rgba(99,102,241,0.8)' }} />
            </button>

            {/* Divider */}
            <div className="h-5 w-px mx-1" style={{ background: 'rgba(35,33,76,0.8)' }} />

            {/* User avatar + name + dropdown trigger */}
            <button
              onClick={() => setView('profile')}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl transition-all duration-200 focus:outline-none group"
              style={{
                background: currentView === 'profile' ? 'rgba(99,102,241,0.08)' : 'transparent',
                border: currentView === 'profile' ? '1px solid rgba(99,102,241,0.18)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (currentView !== 'profile') {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(35,33,76,0.8)';
                }
              }}
              onMouseLeave={e => {
                if (currentView !== 'profile') {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                }
              }}
            >
              {/* Avatar circle */}
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-extrabold text-bg-base flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #6366F1, #4F46E5)',
                  boxShadow: '0 0 8px rgba(99,102,241,0.3)',
                }}
              >
                {user?.name.slice(0, 2).toUpperCase()}
              </div>

              {/* Name + level */}
              <div className="text-left leading-none">
                <span className="block text-xs font-semibold text-text-primary" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  {user?.name}
                </span>
                <span className="block text-[9px] font-bold uppercase tracking-wider" style={{ color: 'rgba(99,102,241,0.7)' }}>
                  {user?.experienceLevel}
                </span>
              </div>

              <ChevronDown className="h-3.5 w-3.5 opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: '#FFFFFF' }} />
            </button>

            {/* Logout */}
            <button
              onClick={logoutUser}
              className="p-2 rounded-lg transition-all focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#FF4D4D';
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,77,77,0.06)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.4)';
                (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              }}
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Active-page green bottom border line */}
        <div className="h-px w-full" style={{ background: 'rgba(99,102,241,0.06)' }} />
      </header>

      {/* ══════════════════════════════════════════════════════
          MOBILE HEADER
          ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden sticky top-0 z-30 glass-nav">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 10px rgba(99,102,241,0.35)' }}>
              <span className="text-bg-base font-sora font-extrabold text-xs">ST</span>
            </div>
            <span className="font-sora font-extrabold text-sm text-text-primary">SabiTrade</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-1.5 rounded-lg focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full"
                style={{ background: '#10B981', boxShadow: '0 0 4px rgba(99,102,241,0.7)' }} />
            </button>
            <button onClick={() => setView('profile')}
              className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-extrabold font-sora text-bg-base flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 8px rgba(99,102,241,0.3)' }}>
              {user?.name.slice(0, 2).toUpperCase()}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════ */}
      <main className="flex-grow flex flex-col">
        <div className={`flex-grow p-4 sm:p-6 lg:p-8 w-full mx-auto pb-28 lg:pb-10 ${
          currentView === 'markets' || currentView === 'portfolio' ? 'max-w-7xl' : 'max-w-6xl'
        }`}>
          {renderViewContent()}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════
          MOBILE BOTTOM TAB BAR  (icons kept — essential at small sizes)
          ══════════════════════════════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-30 border-t border-border/40"
        style={{ background: 'rgba(7,6,21,0.96)', backdropFilter: 'blur(24px)' }}
      >
        <div className="flex items-center justify-around px-2 py-1.5">
          {mobileNavItems.map((item) => {
            const IconComp = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === 'markets' && currentView === 'stock-detail');

            return (
              <button
                key={item.id}
                onClick={() => setView(item.id)}
                className="flex flex-col items-center gap-0.5 py-1.5 px-3 text-center focus:outline-none relative transition-all duration-200"
                style={{ color: isActive ? '#6366F1' : 'rgba(255,255,255,0.35)' }}
              >
                {/* Active top glow pill */}
                {isActive && (
                  <span
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full"
                    style={{ background: '#10B981', boxShadow: '0 0 8px rgba(99,102,241,0.7)' }}
                  />
                )}

                <IconComp
                  className="h-5 w-5 transition-all duration-200"
                  style={isActive ? { filter: 'drop-shadow(0 0 5px rgba(99,102,241,0.55))' } : {}}
                />
                <span className="text-[9px] font-bold tracking-tight font-dm-sans">{item.label}</span>

                {/* Badge */}
                {'badge' in item && item.badge && !isActive && (
                  <span
                    className="absolute top-1 right-2 h-1.5 w-1.5 rounded-full border border-bg-base"
                    style={{ background: '#6366F1' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* ── AI Chatbot ─────────────────────────────────────── */}
      <AIChatbot />
    </div>
  );
}
