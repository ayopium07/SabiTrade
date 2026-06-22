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
  GraduationCap,
  Users,
  Search,
  Menu,
  X,
  ArrowLeft,
  ArrowRight,
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
import Stock101 from '@/components/Stock101';
import Community from '@/components/Community';
import TradePage from '@/components/TradePage';

// ─── SVG Step Illustrations ───────────────────────────
const Pillar1Illustration = () => (
  <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="60" fill="rgba(207,163,67,0.06)" />
    <line x1="40" y1="150" x2="160" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round" />
    <rect x="60" y="80" width="80" height="55" rx="3" fill="#041226" stroke="#CFA343" strokeWidth="2" />
    <line x1="85" y1="135" x2="115" y2="135" stroke="#CFA343" strokeWidth="3" />
    <line x1="75" y1="142" x2="125" y2="142" stroke="#CFA343" strokeWidth="3" />
    <path d="M70 120 L90 100 L110 110 L130 90" stroke="#E5C06F" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="120" cy="95" r="14" fill="#081D38" stroke="#FFFFFF" strokeWidth="1.5" />
    <line x1="130" y1="105" x2="142" y2="117" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M120 87 L120 91 M116 95 L124 95" stroke="#E5C06F" strokeWidth="1.5" />
  </svg>
);

const Pillar2Illustration = () => (
  <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="60" fill="rgba(207,163,67,0.06)" />
    <line x1="40" y1="150" x2="160" y2="150" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round" />
    <rect x="60" y="115" width="80" height="15" rx="2" fill="#081D38" stroke="#CFA343" strokeWidth="2" />
    <rect x="65" y="98" width="70" height="15" rx="2" fill="#CFA343" stroke="#E5C06F" strokeWidth="1.5" />
    <path d="M100 55 L140 70 L100 85 L60 70 Z" fill="#E5C06F" stroke="#FFFFFF" strokeWidth="1.5" />
    <rect x="85" y="80" width="30" height="15" fill="#041226" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="M125 73 L135 88 L133 92" stroke="#FFFFFF" strokeWidth="1.5" fill="none" />
  </svg>
);

const Pillar3Illustration = ({ active }: { active: boolean }) => (
  <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="60" fill={active ? "rgba(255,255,255,0.15)" : "rgba(207,163,67,0.06)"} />
    <rect x="60" y="120" width="18" height="30" rx="2" fill={active ? "#041226" : "#CFA343"} />
    <rect x="85" y="95" width="18" height="55" rx="2" fill={active ? "#041226" : "#E5C06F"} opacity="0.8" />
    <rect x="110" y="70" width="18" height="80" rx="2" fill={active ? "#041226" : "#CFA343"} opacity="0.9" />
    <g transform="translate(62, 30)">
      <rect x="36" y="18" width="14" height="11" rx="1" fill={active ? "#FFFFFF" : "#E5C06F"} />
      <path d="M50 20 L58 24" stroke={active ? "#FFFFFF" : "#E5C06F"} strokeWidth="2" />
    </g>
    <path d="M119 70 C119 64, 125 60, 125 60 C125 60, 119 64, 119 70 Z" fill={active ? "#FFFFFF" : "#E5C06F"} />
  </svg>
);

const Pillar4Illustration = () => (
  <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="60" fill="rgba(207,163,67,0.06)" />
    <line x1="70" y1="80" x2="130" y2="80" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    <line x1="70" y1="80" x2="100" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    <line x1="130" y1="80" x2="100" y2="130" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />
    <circle cx="70" cy="80" r="16" fill="#081D38" stroke="#CFA343" strokeWidth="2" />
    <path d="M60 92 C60 84, 80 84, 80 92 Z" fill="#E5C06F" />
    <circle cx="130" cy="80" r="16" fill="#081D38" stroke="#CFA343" strokeWidth="2" />
    <path d="M120 92 C120 84, 140 84, 140 92 Z" fill="#E5C06F" />
    <circle cx="100" cy="130" r="16" fill="#081D38" stroke="#CFA343" strokeWidth="2" />
    <path d="M90 142 C90 134, 110 134, 110 142 Z" fill="#E5C06F" />
    <path d="M90 62 L110 62 L105 72 Z" fill="#FFFFFF" />
  </svg>
);

const Pillar5Illustration = () => (
  <svg className="w-40 h-40 mx-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="60" fill="rgba(207,163,67,0.06)" />
    <path d="M100 50 C125 50, 140 60, 140 90 C140 120, 100 145, 100 145 C100 145, 60 120, 60 90 C60 60, 75 50, 100 50 Z" fill="#081D38" stroke="#CFA343" strokeWidth="3" />
    <path d="M85 95 L95 105 L120 80" stroke="#10B981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="100" cy="115" r="3" fill="#E5C06F" />
  </svg>
);

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
  const fetchMarketData = useAppStore((s) => s.fetchMarketData);
  const stocks          = useAppStore((s) => s.stocks);
  const news            = useAppStore((s) => s.news);
  const fetchNews       = useAppStore((s) => s.fetchNews);

  const [emailInput, setEmailInput]   = useState('');
  const [nameInput, setNameInput]     = useState('');
  const [authMode, setAuthMode]       = useState<'login' | 'signup'>('signup');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [onboardingStep, setOnboardingStep]   = useState(1);
  const [activeHomeTab, setActiveHomeTab]     = useState<'report' | 'dividend' | 'growth' | 'analyst' | 'safe'>('report');
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery]   = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isLandingMenuOpen, setIsLandingMenuOpen] = useState(false);

  React.useEffect(() => {
    fetchMarketData();
    fetchNews();
  }, [fetchMarketData, fetchNews]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsHeaderSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  React.useEffect(() => {
    if (!user) {
      setView('landing');
    }
  }, [user, setView]);

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
    let content;
    switch (currentView) {
      case 'home':         content = renderHomeView(); break;
      case 'markets':      content = <StockExplorer />; break;
      case 'news':         content = <AINewsFeed />; break;
      case 'portfolio':    content = <PortfolioTracker />; break;
      case 'profile':      content = renderProfileView(); break;
      case 'stock-detail': content = <StockDetail />; break;
      case 'about':        content = <AboutUs />; break;
      case 'learn':        content = <Stock101 />; break;
      case 'community':    content = <Community />; break;
      case 'trade':        content = <TradePage />; break;
      default:             content = renderHomeView();
    }
    return (
      <div key={currentView} className="animate-slide-up">
        {content}
      </div>
    );
  };

  // ─── Home Dashboard View ────────────────────────────────
  const renderHomeView = () => {
    const watchStocks = stocks.filter((s) => watchlist.includes(s.ticker)).slice(0, 4);

    // ── Data Computations for Tabs ────────────────────────
    const dividendStocks = [...stocks]
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
    const growthStocks = [...stocks]
      .filter(s => catalysts[s.ticker])
      .sort((a, b) => b.change - a.change)
      .slice(0, 6)
      .map(s => ({ ...s, catalyst: catalysts[s.ticker] }));

    const analystPicks = [...stocks]
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
    const safeStocks = [...stocks]
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
              { id: 'report', label: 'Daily Market Report', icon: Newspaper, color: '#CFA343' },
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
                        {({ Outperform: 'Bullish', Neutral: 'Watch', Underperform: 'Bearish' } as Record<string,string>)[stock.rating] ?? stock.rating}
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
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 10px rgba(207,163,67,0.3)' }}>
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
            {news.slice(0, 2).map((news) => {
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
            style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 20px rgba(207,163,67,0.35)' }}>
            {user?.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold font-sora text-brand-primary" style={{ textShadow: '0 0 16px rgba(207,163,67,0.3)' }}>
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
                  ? { background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 10px rgba(207,163,67,0.3)' }
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
    const handleGuestNav = (targetView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade') => {
      if (!user) {
        loginUser('Nigerian Investor', 'investor@equitystack.ng');
        completeOnboarding();
      }
      setView(targetView);
    };

    const steps = [
      {
        title: 'Financial Intelligence',
        desc: 'Transform market data into understandable insights.',
        illustration: <Pillar1Illustration />
      },
      {
        title: 'Education',
        desc: 'Help users continuously improve their investing knowledge.',
        illustration: <Pillar2Illustration />
      },
      {
        title: 'Practice',
        desc: 'Allow users to learn through risk-free simulated investing.',
        illustration: <Pillar3Illustration active={activeStep === 2} />
      },
      {
        title: 'Community',
        desc: 'Create a social environment where investors learn from each other.',
        illustration: <Pillar4Illustration />
      },
      {
        title: 'Trust',
        desc: 'Provide transparent, source-backed, explainable intelligence.',
        illustration: <Pillar5Illustration />
      }
    ];

    return (
      <div className="min-h-screen bg-bg-base flex flex-col font-dm-sans relative overflow-x-hidden">
        {/* ── Ambient Background Orbs ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,184,255,0.03) 0%, transparent 70%)' }} />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.04) 0%, transparent 70%)' }} />

        {/* ── Top Nav ── */}
        <nav className="max-w-7xl mx-auto w-full flex items-center justify-between px-5 sm:px-8 py-6 z-30 relative">
          {/* Brand Logo & Name */}
          <button 
            onClick={() => { setView('landing'); setIsLandingMenuOpen(false); }}
            className="flex items-center gap-2.5 text-left focus:outline-none group z-40"
          >
            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-200"
              style={{ boxShadow: '0 0 10px rgba(207,163,67,0.35)' }}>
              <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
            </div>
            <div className="leading-none">
              <span className="font-sora font-extrabold text-sm tracking-tight text-text-primary block group-hover:text-brand-primary transition-colors">EquityStack</span>
              <span className="text-[8px] font-bold text-brand-primary uppercase tracking-[0.15em] block mt-0.5">NGX Intelligence</span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <button onClick={() => setView('landing')}
              className="text-xs font-bold text-text-primary hover:text-brand-primary transition-all focus:outline-none">
              Home
            </button>
            <button onClick={() => handleGuestNav('about')}
              className="text-xs font-bold text-text-secondary hover:text-text-primary transition-all focus:outline-none">
              About Us
            </button>
            <button onClick={() => handleGuestNav('markets')}
              className="text-xs font-bold text-text-secondary hover:text-text-primary transition-all focus:outline-none">
              Markets
            </button>
          </div>

          {/* Desktop/Tablet Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
              className="text-xs font-extrabold px-6 py-2.5 rounded-full border border-brand-primary text-brand-primary bg-transparent hover:bg-brand-primary/10 transition-all focus:outline-none">
              Sign In
            </button>
            <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
              className="text-xs font-extrabold px-6 py-2.5 rounded-full text-bg-base transition-all focus:outline-none"
              style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 14px rgba(207,163,67,0.35)' }}>
              Create Account
            </button>
          </div>

          {/* Mobile Actions and Hamburger Toggle */}
          <div className="flex sm:hidden items-center gap-3 z-40">
            <button 
              onClick={() => setIsLandingMenuOpen(!isLandingMenuOpen)}
              className="p-1.5 text-text-primary hover:text-brand-primary transition-colors focus:outline-none"
            >
              {isLandingMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Tablet Hamburger Toggle (when width is between sm and md) */}
          <div className="hidden sm:flex md:hidden items-center z-40">
            <button 
              onClick={() => setIsLandingMenuOpen(!isLandingMenuOpen)}
              className="p-1.5 text-text-primary hover:text-brand-primary transition-colors focus:outline-none"
            >
              {isLandingMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile / Tablet Dropdown Menu Drawer */}
        {isLandingMenuOpen && (
          <div className="md:hidden absolute top-[76px] left-0 right-0 z-30 px-5 pb-6 bg-[#041226]/95 backdrop-blur-md border-b border-border/40 flex flex-col gap-4 py-4 animate-in slide-in-from-top duration-200">
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => { setView('landing'); setIsLandingMenuOpen(false); }}
                className="w-full text-left py-2.5 text-sm font-bold text-text-primary hover:text-brand-primary transition-all focus:outline-none border-b border-border/10"
              >
                Home
              </button>
              <button 
                onClick={() => { handleGuestNav('about'); setIsLandingMenuOpen(false); }}
                className="w-full text-left py-2.5 text-sm font-bold text-text-secondary hover:text-text-primary transition-all focus:outline-none border-b border-border/10"
              >
                About Us
              </button>
              <button 
                onClick={() => { handleGuestNav('markets'); setIsLandingMenuOpen(false); }}
                className="w-full text-left py-2.5 text-sm font-bold text-text-secondary hover:text-text-primary transition-all focus:outline-none border-b border-border/10"
              >
                Markets
              </button>
            </div>
            
            {/* Mobile-only menu action buttons */}
            <div className="flex sm:hidden flex-col gap-2 pt-2">
              <button 
                onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); setIsLandingMenuOpen(false); }}
                className="w-full py-3 rounded-full border border-brand-primary text-brand-primary bg-transparent text-xs font-bold text-center focus:outline-none"
              >
                Sign In
              </button>
              <button 
                onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); setIsLandingMenuOpen(false); }}
                className="w-full py-3 rounded-full text-bg-base text-xs font-bold text-center focus:outline-none"
                style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* ── Hero Section ── */}
        <div className="max-w-7xl mx-auto w-full flex flex-col z-10 px-5 sm:px-8 pt-8 pb-16 sm:pt-12 sm:pb-20 flex-grow">
          
          {/* Main Grid: Text Left, Portrait Right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-left mb-20">
            {/* Left Info Column */}
            <div className="lg:col-span-7 space-y-6">
              {/* Brand Logo with Interlocking Rings */}
              <div className="relative inline-flex items-center mb-2">
                <span className="font-sora font-extrabold text-4xl sm:text-7xl md:text-8xl tracking-tight text-white select-none relative z-10 leading-none">
                  equitystack
                </span>
                <div className="absolute -left-2 -bottom-2 flex items-center pointer-events-none z-0">
                  <div className="logo-interlock-1 opacity-85" />
                  <div className="logo-interlock-2 opacity-85" />
                </div>
              </div>

              {/* Tagline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-text-primary font-sora tracking-tight leading-[1.1] max-w-2xl">
                Invest with <span className="text-brand-primary text-glow-indigo">Intelligence</span> not Hype
              </h1>

              {/* Description */}
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium max-w-xl">
                At EquityStack, we bridge education and opportunity equipping you with the right knowledge, tools, and community to grow confidently. Whether you're starting out or scaling up, we're here to guide your journey toward meaningful and sustainable wealth.
              </p>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full sm:w-auto">
                <button onClick={() => handleGuestNav('markets')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold text-center transition-all text-bg-base focus:outline-none"
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 24px rgba(207,163,67,0.3)' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 40px rgba(207,163,67,0.5)')}
                  onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.boxShadow = '0 0 24px rgba(207,163,67,0.3)')}>
                  Explore Markets
                </button>
                <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-extrabold text-center transition-all border border-brand-primary text-text-primary bg-transparent hover:bg-brand-primary/10 focus:outline-none">
                  Join Beta Testing
                </button>
              </div>

              {/* Floating Pill Badge (Bottom Left) */}
              <div className="pt-6">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider text-gain bg-gain/8 border border-gain/20">
                  Don't invest with us, invest through us
                </span>
              </div>
            </div>

            {/* Right Portrait Column */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="hero-blob-container relative select-none">
                {/* Floating Outline Rings */}
                {/* Teal Ring */}
                <div className="absolute -top-6 -left-6 w-28 h-28 rounded-full border-2 border-[#10B981]/40 pointer-events-none" />
                {/* White Ring */}
                <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />
                {/* Outer concentric rings */}
                <div className="absolute -bottom-12 -left-4 w-72 h-72 rounded-full border-2 border-brand-primary/20 pointer-events-none" />

                {/* Organic Background Blob */}
                <div className="hero-blob-bg" />

                {/* Headshot Image */}
                <img
                  src="/nigerian-investor.png"
                  alt="Nigerian Investor Portrait"
                  className="hero-portrait-img"
                />

              </div>
            </div>
          </div>

          {/* ── Dashboard Mock Terminal ── */}
          <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
            style={{ background: 'linear-gradient(145deg, #081D38, #041226)' }}>
            {/* Window controls */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50"
              style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-brand-primary/70" />
              </div>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                EquityStack Intelligence Terminal
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
                    style={{ textShadow: '0 0 20px rgba(207,163,67,0.4)' }}>
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
                style={{ background: 'rgba(207,163,67,0.03)' }}>
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

          {/* ── How It Works / Steps Section ── */}
          <div className="w-full mt-24 text-left relative">
            {/* Dotted grid decorative background on bottom left */}
            <div className="absolute -bottom-10 -left-10 w-24 h-24 opacity-25 pointer-events-none z-0">
              <svg className="w-full h-full text-brand-primary" viewBox="0 0 100 100" fill="currentColor">
                <pattern id="dot-grid" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="2" />
                </pattern>
                <rect width="100" height="100" fill="url(#dot-grid)" />
              </svg>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start relative z-10">
              {/* Left Title Column */}
              <div className="lg:col-span-4 space-y-6">
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-brand-primary uppercase block mb-2">
                    Product Pillars
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary font-sora leading-tight">
                    Our Five Foundation Pillars
                  </h2>
                </div>

                {/* Arrow Controls */}
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveStep((prev) => (prev === 0 ? 4 : prev - 1))}
                    className="w-11 h-11 rounded-lg border border-border/60 flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-brand-primary/50 transition-all bg-bg-surface/40 backdrop-blur-sm focus:outline-none"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setActiveStep((prev) => (prev === 4 ? 0 : prev + 1))}
                    className="w-11 h-11 rounded-lg border border-border/60 flex items-center justify-center text-text-secondary hover:text-text-primary hover:border-brand-primary/50 transition-all bg-bg-surface/40 backdrop-blur-sm focus:outline-none"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Right Cards Column */}
              <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
                {[
                  { ...steps[activeStep % 5], idx: activeStep % 5, visibilityClass: 'flex' },
                  { ...steps[(activeStep + 1) % 5], idx: (activeStep + 1) % 5, visibilityClass: 'hidden md:flex' },
                  { ...steps[(activeStep + 2) % 5], idx: (activeStep + 2) % 5, visibilityClass: 'hidden lg:flex' }
                ].map((item) => {
                  const isActive = activeStep % 5 === item.idx;
                  return (
                    <div
                      key={item.title}
                      onClick={() => setActiveStep(item.idx)}
                      className={`cursor-pointer rounded-2xl p-6 transition-all duration-500 flex flex-col items-center text-center relative overflow-hidden group ${item.visibilityClass} ${
                        isActive
                          ? 'shadow-[0_20px_40px_rgba(207,163,67,0.25)] border border-brand-primary translate-y-[-8px]'
                          : 'border border-border/40 hover:border-border hover:translate-y-[-4px]'
                      }`}
                      style={{
                        background: isActive
                          ? 'linear-gradient(180deg, #E5C06F 0%, #B58C35 100%)'
                          : 'linear-gradient(145deg, #081D38, #041226)',
                        minHeight: '340px'
                      }}
                    >
                      {/* Active highlight glow orb */}
                      {isActive && (
                        <div className="absolute -top-16 -left-16 w-32 h-32 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                      )}

                      {/* Illustration Container */}
                      <div className="h-40 flex items-center justify-center w-full mb-4">
                        {item.illustration}
                      </div>

                      {/* Text */}
                      <div className="space-y-2 mt-auto">
                        <h3
                          className={`text-base font-extrabold font-sora ${
                            isActive ? 'text-bg-base' : 'text-text-primary group-hover:text-brand-primary transition-colors'
                          }`}
                        >
                          {item.title}
                        </h3>
                        <p
                          className={`text-xs leading-relaxed font-medium font-dm-sans ${
                            isActive ? 'text-bg-base/80' : 'text-text-secondary'
                          }`}
                        >
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="max-w-7xl mx-auto w-full z-10 text-center text-[10px] text-text-secondary font-medium font-dm-sans border-t border-border/40 py-5 px-5">
          © {new Date().getFullYear()} EquityStack · Nigerian Financial Intelligence Platform · MVP v1.0 · Strictly Confidential
        </div>

        {/* ── Auth Modal ── */}
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}>
            <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 relative overflow-hidden animate-in zoom-in-95 duration-300"
              style={{ background: 'rgba(8,29,56,0.97)', border: '1px solid rgba(207,163,67,0.25)', boxShadow: '0 0 0 1px rgba(207,163,67,0.04), 0 40px 80px rgba(0,0,0,0.8)' }}>
              {/* Top border */}
              <div className="absolute top-0 left-0 right-0 h-px"
                style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)' }} />
              {/* Ambient glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.12) 0%, transparent 70%)' }} />

              {/* Close */}
              <button onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-2 rounded-full transition-colors focus:outline-none"
                style={{ background: 'rgba(8,29,56,0.8)' }}>
                ✕
              </button>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-8 w-8 rounded-xl overflow-hidden flex items-center justify-center"
                    style={{ boxShadow: '0 0 12px rgba(207,163,67,0.4)' }}>
                    <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
                  </div>
                  <span className="font-sora font-extrabold text-text-primary text-sm">EquityStack</span>
                </div>

                <h2 className="text-2xl font-extrabold font-sora tracking-tight mb-1 text-brand-primary"
                  style={{ textShadow: '0 0 20px rgba(207,163,67,0.3)' }}>
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
                      onFocus={e => (e.target.style.borderColor = 'rgba(207,163,67,0.4)')}
                      onBlur={e => (e.target.style.borderColor = '#23214C')} />
                  </div>
                  <button type="submit"
                    className="w-full py-3 rounded-xl text-xs font-bold transition-all text-bg-base mt-2 focus:outline-none"
                    style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 16px rgba(207,163,67,0.3)' }}>
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
      <div className="min-h-screen bg-bg-base flex flex-col py-10 px-4 sm:px-6 relative font-dm-sans">
        {/* Ambient */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.05) 0%, transparent 70%)' }} />

        {/* Brand header */}
        <div className="max-w-xl mx-auto w-full flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ boxShadow: '0 0 12px rgba(207,163,67,0.35)' }}>
              <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-sora font-extrabold text-sm text-brand-primary">EquityStack Onboarding</span>
          </div>
          <button onClick={handleOnboardingSkip}
            className="text-xs font-bold text-text-secondary hover:text-text-primary focus:outline-none">
            Skip →
          </button>
        </div>

        {/* Wizard Panel */}
        <div className="max-w-xl mx-auto w-full rounded-3xl p-6 sm:p-8 space-y-6 z-10 relative"
          style={{ background: 'rgba(8,29,56,0.97)', border: '1px solid rgba(207,163,67,0.12)', boxShadow: '0 0 0 1px rgba(207,163,67,0.03), 0 40px 80px rgba(0,0,0,0.7)' }}>
          <div className="absolute top-0 left-0 right-0 h-px rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)' }} />

          {/* Progress */}
          <div className="flex items-center justify-between pb-3 border-b border-border/40">
            <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider">
              Step {onboardingStep} of 3
            </span>
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <span key={s} className={`h-1.5 rounded-full transition-all duration-300 ${
                  onboardingStep === s ? 'w-6' : 'w-1.5 bg-border'
                }`} style={onboardingStep === s ? { background: '#10B981', boxShadow: '0 0 8px rgba(207,163,67,0.5)' } : {}} />
              ))}
            </div>
          </div>

          {/* Step 1: Name */}
          {onboardingStep === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider block w-max mb-2 border border-brand-primary/20 text-brand-primary"
                  style={{ background: 'rgba(207,163,67,0.08)' }}>
                  Welcome to EquityStack
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
              style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 14px rgba(207,163,67,0.35)' }}>
              <span>{onboardingStep === 3 ? 'Launch Dashboard' : 'Next Step'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="max-w-xl mx-auto w-full text-center text-[10px] text-text-secondary font-medium font-dm-sans border-t border-border/30 pt-5 mt-6 relative z-10">
          EquityStack Onboarding · Secure · Paperless · BVN exempt
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // C. MAIN DASHBOARD SHELL
  // ══════════════════════════════════════════════════════════

  // Nav structure — each item supports an optional `children` array for future dropdowns.
  // When `children` is present, a ChevronDown is rendered and the item becomes a dropdown trigger.
  // Desktop nav — all items as flat links
  const allNavItems = [
    { id: 'home',      label: 'Overview' },
    { id: 'markets',  label: 'Markets' },
    { id: 'portfolio',label: 'Portfolio' },
    { id: 'news',     label: 'News & Insights', badge: true },
    { id: 'trade',    label: 'Trade' },
    { id: 'community',label: 'Marketplace' },
    { id: 'learn',    label: 'Learn' },
    { id: 'about',    label: 'About us' },
  ] as const;

  // Items hidden inside the "More" dropdown
  const moreNavItems = [
    { id: 'trade',     label: 'Trade',       icon: TrendingUp },
    { id: 'community', label: 'Marketplace', icon: Users },
    { id: 'learn',     label: 'Learn',       icon: GraduationCap },
    { id: 'about',     label: 'About us',    icon: Info },
    { id: 'profile',   label: 'Profile',     icon: User },
  ] as const;

  // Mobile bottom 5-tab bar
  const mobileBottomTabs = [
    { id: 'home' as const,      label: 'Home',     icon: HomeIcon },
    { id: 'markets' as const,   label: 'Markets',  icon: BarChart2 },
    { id: 'portfolio' as const, label: 'Portfolio',icon: Briefcase },
    { id: 'news' as const,      label: 'News',     icon: Newspaper, badge: true },
  ] as const;

  // Drawer items (More panel) — all overflow items
  const mobileNavItems = [
    { id: 'trade' as const,     label: 'Trade',       icon: TrendingUp },
    { id: 'community' as const, label: 'Marketplace', icon: Users },
    { id: 'learn' as const,     label: 'Learn',       icon: GraduationCap },
    { id: 'about' as const,     label: 'About',       icon: Info },
    { id: 'profile' as const,   label: 'Profile',     icon: User },
  ];

  return (
    <div className="min-h-screen bg-bg-base font-dm-sans flex flex-col">

      {/* ══════════════════════════════════════════════════════
          DESKTOP TOP NAVIGATION
          ══════════════════════════════════════════════════════ */}
      <header className="hidden lg:block sticky top-0 z-40 glass-nav">
        <div className="max-w-7xl mx-auto px-8 flex items-center justify-between" style={{ height: '56px' }}>

          {/* ── Brand ───────────────────────────────────────── */}
          <button 
            onClick={() => setView('landing')}
            className="flex items-center gap-3 flex-shrink-0 pr-8 border-r border-border/40 text-left focus:outline-none group"
          >
            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
              style={{ boxShadow: '0 0 12px rgba(207,163,67,0.35)' }}>
              <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
            </div>
            <div className="leading-none">
              <span className="font-sora font-extrabold text-sm tracking-tight text-text-primary block group-hover:text-brand-primary transition-colors">EquityStack</span>
              <span className="text-[8px] font-bold text-brand-primary uppercase tracking-[0.15em] block mt-0.5">NGX Intelligence</span>
            </div>
          </button>

          {/* ── Nav Links ── */}
          <nav className="flex items-center flex-1 px-6">
            {allNavItems.map((item) => {
              const isActive = currentView === item.id ||
                (item.id === 'markets' && currentView === 'stock-detail');
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as Parameters<typeof setView>[0])}
                  className="relative flex items-center gap-1.5 px-3 py-1 text-sm font-semibold transition-colors duration-200 focus:outline-none whitespace-nowrap"
                  style={{ color: isActive ? '#CFA343' : 'rgba(255,255,255,0.55)' }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.9)'; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.55)'; }}
                >
                  <span>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary" style={{ boxShadow: '0 0 4px rgba(207,163,67,0.8)' }} />
                  )}
                  {isActive && (
                    <span className="absolute left-0 right-0 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)', boxShadow: '0 0 8px rgba(207,163,67,0.6)', bottom: '-9px' }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ── Right Controls ──────────────────────────────── */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search Button */}
            <button
              onClick={() => setIsHeaderSearchOpen(true)}
              className="p-2 rounded-lg transition-all focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.5)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF')}
              onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)')}
              title="Search Stocks"
            >
              <Search className="h-4.5 w-4.5" />
            </button>

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
                style={{ background: '#10B981', boxShadow: '0 0 4px rgba(207,163,67,0.8)' }} />
            </button>

            {/* Divider */}
            <div className="h-5 w-px mx-1" style={{ background: 'rgba(35,33,76,0.8)' }} />

            {/* User Profile Avatar */}
            <button
              onClick={() => setView('profile')}
              className="h-8.5 w-8.5 rounded-full flex items-center justify-center transition-all duration-200 focus:outline-none border border-transparent"
              style={{
                background: currentView === 'profile' ? 'rgba(207,163,67,0.15)' : 'transparent',
                borderColor: currentView === 'profile' ? '#CFA343' : 'transparent',
              }}
              onMouseEnter={e => {
                if (currentView !== 'profile') {
                  (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(207,163,67,0.3)';
                }
              }}
              onMouseLeave={e => {
                if (currentView !== 'profile') {
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                  (e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent';
                }
              }}
              title="Profile"
            >
              {/* Avatar circle */}
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-extrabold text-bg-base flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #CFA343, #B58C35)',
                  boxShadow: '0 0 8px rgba(207,163,67,0.3)',
                }}
              >
                {user?.name.slice(0, 2).toUpperCase()}
              </div>
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
        <div className="h-px w-full" style={{ background: 'rgba(207,163,67,0.06)' }} />
      </header>

      {/* ══════════════════════════════════════════════════════
          MOBILE HEADER (top bar — logo + utilities only)
          ══════════════════════════════════════════════════════ */}
      <div className="lg:hidden sticky top-0 z-30 glass-nav">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setView('landing')}
            className="flex items-center gap-2 text-left focus:outline-none"
          >
            <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center"
              style={{ boxShadow: '0 0 10px rgba(207,163,67,0.35)' }}>
              <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
            </div>
            <span className="font-sora font-extrabold text-sm text-text-primary">EquityStack</span>
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsHeaderSearchOpen(true)}
              className="p-1.5 rounded-lg focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <Search className="h-4 w-4" />
            </button>
            <button className="relative p-1.5 rounded-lg focus:outline-none"
              style={{ color: 'rgba(255,255,255,0.6)' }}>
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full"
                style={{ background: '#10B981', boxShadow: '0 0 4px rgba(207,163,67,0.7)' }} />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          MAIN CONTENT
          ══════════════════════════════════════════════════════ */}
      <main className="flex-grow flex flex-col">
        <div className={`flex-grow p-4 sm:p-6 lg:p-8 w-full mx-auto pb-24 lg:pb-10 ${
          currentView === 'markets' || currentView === 'portfolio' || currentView === 'trade' ? 'max-w-7xl' : 'max-w-6xl'
        }`}>
          {renderViewContent()}
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════
          MOBILE BOTTOM TAB BAR
          ══════════════════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch" style={{ background: 'rgba(4,18,38,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(207,163,67,0.1)', boxShadow: '0 -8px 32px rgba(0,0,0,0.5)' }}>
        {mobileBottomTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id || (tab.id === 'markets' && currentView === 'stock-detail');
          return (
            <button key={tab.id} onClick={() => setView(tab.id)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 focus:outline-none relative transition-all duration-200"
              style={{ color: isActive ? '#CFA343' : 'rgba(255,255,255,0.45)' }}>
              {isActive && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: '#CFA343', boxShadow: '0 0 8px rgba(207,163,67,0.7)' }} />}
              <div className="relative">
                <Icon className="h-[18px] w-[18px]" />
                {'badge' in tab && tab.badge && (
                  <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full" style={{ background: '#10B981', boxShadow: '0 0 4px rgba(16,185,129,0.8)' }} />
                )}
              </div>
              <span className={`text-[9px] font-semibold tracking-tight ${isActive ? 'text-brand-primary' : 'text-text-secondary'}`}>{tab.label}</span>
            </button>
          );
        })}
        {/* More tab */}
        <button onClick={() => setIsMobileDrawerOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2 focus:outline-none relative transition-all duration-200"
          style={{ color: mobileNavItems.some(i => i.id === currentView) ? '#CFA343' : 'rgba(255,255,255,0.45)' }}>
          {mobileNavItems.some(i => i.id === currentView) && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full" style={{ background: '#CFA343', boxShadow: '0 0 8px rgba(207,163,67,0.7)' }} />}
          <Menu className="h-[18px] w-[18px]" />
          <span className={`text-[9px] font-semibold tracking-tight ${mobileNavItems.some(i => i.id === currentView) ? 'text-brand-primary' : 'text-text-secondary'}`}>More</span>
        </button>
      </nav>

      {/* ── Mobile Navigation Drawer (triggered by More tab) ── */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)' }}
          onClick={() => setIsMobileDrawerOpen(false)}>
          
          {/* Drawer Panel */}
          <div className="w-[290px] h-full bg-[#081D38] border-l border-brand-primary/15 p-6 flex flex-col justify-between shadow-2xl relative animate-in slide-in-from-right duration-300"
            style={{ boxShadow: '-10px 0 30px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}>
            
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-border/40 mb-6">
                <button 
                  onClick={() => { setView('landing'); setIsMobileDrawerOpen(false); }}
                  className="flex items-center gap-2.5 text-left focus:outline-none group"
                >
                  <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-200"
                    style={{ boxShadow: '0 0 10px rgba(207,163,67,0.35)' }}>
                    <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
                  </div>
                  <span className="font-sora font-extrabold text-sm text-text-primary tracking-tight group-hover:text-brand-primary transition-colors">EquityStack</span>
                </button>
                <button onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors focus:outline-none">
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* User Profile Card */}
              {user && (
                <div onClick={() => { setView('profile'); setIsMobileDrawerOpen(false); }}
                  className="flex items-center gap-3 p-3 rounded-xl border border-brand-primary/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors mb-6 group">
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-xs font-extrabold text-bg-base flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #CFA343, #B58C35)',
                      boxShadow: '0 0 8px rgba(207, 163, 67, 0.3)',
                    }}>
                    {user.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="text-left leading-none">
                    <span className="block text-xs font-semibold text-text-primary group-hover:text-brand-primary transition-colors">
                      {user.name}
                    </span>
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-text-secondary mt-1">
                      {user.experienceLevel}
                    </span>
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <div className="space-y-1.5 overflow-y-auto max-h-[calc(100vh-280px)] pr-1 custom-scrollbar">
                {mobileNavItems.map((item) => {
                  const IconComp = item.icon;
                  const isActive = currentView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setView(item.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left font-bold text-xs transition-all duration-200 focus:outline-none relative"
                      style={{
                        background: isActive ? 'rgba(207,163,67,0.1)' : 'transparent',
                        color: isActive ? '#CFA343' : 'rgba(255,255,255,0.6)',
                        border: isActive ? '1px solid rgba(207,163,67,0.15)' : '1px solid transparent',
                      }}
                    >
                      <IconComp className="h-4.5 w-4.5" />
                      <span>{item.label}</span>
                      {isActive && (
                        <span className="absolute right-3.5 h-1.5 w-1.5 rounded-full bg-brand-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer with Sign Out */}
            <div className="pt-4 border-t border-border/40">
              <button
                onClick={() => {
                  logoutUser();
                  setIsMobileDrawerOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-danger/20 text-danger bg-danger/5 hover:bg-danger/10 font-bold text-xs transition-all focus:outline-none"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Chatbot ─────────────────────────────────────── */}
      <AIChatbot />

      {/* ── Header Search Modal ── */}
      {isHeaderSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 animate-in fade-in duration-200"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(12px)' }}
          onClick={() => setIsHeaderSearchOpen(false)}>
          <div className="w-full max-w-lg rounded-2xl border border-brand-primary/20 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-250"
            style={{ background: 'rgba(8, 29, 56, 0.98)' }}
            onClick={(e) => e.stopPropagation()}>
            
            {/* Input row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border/40">
              <Search className="h-5 w-5 text-text-secondary" />
              <input
                type="text"
                value={headerSearchQuery}
                onChange={(e) => setHeaderSearchQuery(e.target.value)}
                placeholder="Search Nigerian stocks (e.g. DANGCEM, GTCO)..."
                className="w-full bg-transparent text-sm text-text-primary focus:outline-none placeholder:text-text-secondary"
                autoFocus
              />
              <button
                onClick={() => setIsHeaderSearchOpen(false)}
                className="text-xs text-text-secondary hover:text-text-primary font-bold px-2 py-1 rounded bg-white/5 transition-colors focus:outline-none"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[360px] overflow-y-auto p-2">
              {stocks
                .filter((s) => 
                  s.ticker.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
                  s.name.toLowerCase().includes(headerSearchQuery.toLowerCase())
                )
                .map((stock) => {
                  const isPositive = stock.change >= 0;
                  return (
                    <button
                      key={stock.ticker}
                      onClick={() => {
                        setSelectedTicker(stock.ticker);
                        setIsHeaderSearchOpen(false);
                        setHeaderSearchQuery('');
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-left transition-colors focus:outline-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className="px-2.5 py-1 rounded bg-brand-primary/10 border border-brand-primary/20">
                          <span className="text-xs font-extrabold text-brand-primary font-sora">{stock.ticker}</span>
                        </div>
                        <div>
                          <span className="block text-xs font-semibold text-text-primary">{stock.name}</span>
                          <span className="block text-[9px] font-bold text-text-secondary uppercase tracking-wider">{stock.sector}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-xs font-extrabold text-text-primary font-sora">
                          ₦{stock.price.toFixed(2)}
                        </span>
                        <span className={`block text-[10px] font-bold ${isPositive ? 'text-gain' : 'text-danger'}`}>
                          {isPositive ? '+' : ''}{stock.change.toFixed(2)}%
                        </span>
                      </div>
                    </button>
                  );
                })}
              {stocks.filter((s) => 
                s.ticker.toLowerCase().includes(headerSearchQuery.toLowerCase()) ||
                s.name.toLowerCase().includes(headerSearchQuery.toLowerCase())
              ).length === 0 && (
                <div className="p-8 text-center text-xs font-bold text-text-secondary">
                  No matching stocks found. Try searching for {"DANGCEM"} or {"Banking"}.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
