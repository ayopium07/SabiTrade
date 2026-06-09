import React, { useState, useRef } from 'react';
import { 
  ChevronLeft, 
  Star, 
  Briefcase, 
  Sparkles, 
  BookOpen, 
  BarChart2, 
  FileText, 
  Gift, 
  Activity, 
  Users, 
  Layers, 
  Newspaper 
} from 'lucide-react';
import { ngxStocks, mockNews } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

// ─── Management Mock Directory ─────────────────────────
const getManagementData = (ticker: string) => {
  const defaults = [
    { name: 'Dr. Herbert Wigwe (Legacy)', role: 'Group CEO', tenure: '10 years', bio: 'Pioneered Access Bank expansion.' },
    { name: 'Mr. Aigboje Aig-Imoukhuede', role: 'Chairman', tenure: '2 years', bio: 'Veteran banking executive and leader.' }
  ];

  switch (ticker) {
    case 'GTCO':
      return [
        { name: 'Mr. Segun Agbaje', role: 'Group CEO', tenure: '13 years', bio: 'Under his leadership, GTBank grew into a highly efficient financial services group across West Africa.' },
        { name: 'Mrs. Miriam Olusanya', role: 'Managing Director, GTBank', tenure: '3 years', bio: 'First female MD of Guaranty Trust Bank, leading the core banking operations.' },
        { name: 'Mr. Hezekiah Oyinlola', role: 'Board Chairman', tenure: '4 years', bio: 'Distinguished energy and finance professional guiding board decisions.' },
      ];
    case 'ZENITHBANK':
      return [
        { name: 'Dr. Ebenezer Onyeagwu', role: 'Group CEO', tenure: '5 years', bio: 'Experienced corporate banker with over 30 years in financial services, steering Zenith\'s technological growth.' },
        { name: 'Dame Dr. Adaora Umeoji', role: 'MD / CEO Designate', tenure: 'Incoming', bio: 'Highly decorated executive with vast experience in retail and commercial banking.' },
        { name: 'Mr. Jim Ovia', role: 'Founder & Board Chairman', tenure: '34 years (Founder)', bio: 'Legendary banker and philanthropist, widely regarded as the godfather of modern Nigerian banking.' },
      ];
    case 'UBA':
      return [
        { name: 'Mr. Oliver Alawuba', role: 'Group Managing Director', tenure: '2 years', bio: 'Heads operations across 20 African nations and global offices in London, New York, and Paris.' },
        { name: 'Mr. Tony O. Elumelu', role: 'Group Chairman', tenure: '14 years', bio: 'Renowned entrepreneur and economic advocate, developer of the Africapitalism concept.' },
        { name: 'Ms. Abiola Bawuah', role: 'CEO, UBA Africa', tenure: '2 years', bio: 'Oversees the bank\'s critical subsidiaries across the African continent.' },
      ];
    case 'ACCESSCORP':
      return [
        { name: 'Ms. Bolaji Agbede', role: 'Acting Group CEO', tenure: '1 year', bio: 'Leads Access Holdings plc, overseeing human capital, business integrations, and expansion programs.' },
        { name: 'Mr. Aigboje Aig-Imoukhuede', role: 'Non-Executive Chairman', tenure: '1 year', bio: 'Co-founder of modern Access Bank, returned to guide corporate governance and global scaling.' },
        { name: 'Mr. Roosevelt Ogbonna', role: 'MD / CEO, Access Bank', tenure: '2 years', bio: 'Heads the banking subsidiary, driving commercial growth and financial inclusions.' },
      ];
    case 'OANDO':
      return [
        { name: 'Adewale Tinubu', role: 'Group Chief Executive', tenure: '23 years', bio: 'Sought-after corporate leader who transformed Oando from a local petroleum marketer into a leading energy producer.' },
        { name: 'Omamofe Boyo', role: 'Deputy Group Chief Executive', tenure: '23 years', bio: 'Key strategist behind Oando\'s mergers, acquisitions, and restructuring initiatives.' },
        { name: 'Mr. J.A. Adewale', role: 'Chief Financial Officer', tenure: '11 years', bio: 'Manages Oando\'s complex project finance and capital restructuring.' },
      ];
    case 'DANGCEM':
      return [
        { name: 'Mr. Arvind Pathak', role: 'Group MD / CEO', tenure: '2 years', bio: 'Experienced manufacturing executive driving production improvements across African cement plants.' },
        { name: 'Alhaji Aliko Dangote', role: 'Founder & Chairman', tenure: '32 years', bio: 'Africa\'s richest businessman, founder of the Dangote Group conglomerate.' },
        { name: 'Mr. Guillaume Moyen', role: 'Group Chief Financial Officer', tenure: '6 years', bio: 'Oversees finance strategy and treasury operations for all African regions.' },
      ];
    case 'MTNN':
      return [
        { name: 'Mr. Karl Toriola', role: 'CEO', tenure: '3 years', bio: 'Steered MTN Nigeria\'s expansion into 5G services and mobile money (MoMo PSB).' },
        { name: 'Dr. Ernest Ndukwe', role: 'Chairman', tenure: '5 years', bio: 'Former telecommunications regulator (NCC) overseeing corporate governance and policies.' },
        { name: 'Mr. Modupe Kadri', role: 'CFO / Executive Director', tenure: '4 years', bio: 'Manages MTN\'s financial portfolios and capital allocation in Nigeria.' },
      ];
    case 'NESTLE':
      return [
        { name: 'Mr. Wassim Elhusseini', role: 'MD / CEO', tenure: '4 years', bio: 'Over 20 years with Nestlé globally, championing domestic manufacturing and sourcing in Nigeria.' },
        { name: 'Mr. Gbenga Oyebode', role: 'Board Chairman', tenure: '7 years', bio: 'Distinguished business lawyer and corporate director helping guide Nestle\'s long-term sustainability.' },
      ];
    case 'BUAFOODS':
      return [
        { name: 'Mr. Ayodele Abioye', role: 'MD / CEO', tenure: '3 years', bio: 'Experienced operations executive driving food processing capabilities and national food security.' },
        { name: 'Alhaji Abdul Samad Rabiu', role: 'Founder & Chairman', tenure: '16 years', bio: 'Prominent industrialist and billionaire, founder of BUA Group.' },
      ];
    case 'SEPLAT':
      return [
        { name: 'Mr. Roger Brown', role: 'CEO', tenure: '4 years', bio: 'Leads Seplat\'s energy transition strategies and oil/gas development projects in Nigeria.' },
        { name: 'Mr. Basil Omiyi', role: 'Board Chairman', tenure: '6 years', bio: 'Former Shell MD guiding Seplat\'s corporate development and compliance.' },
      ];
    default:
      return defaults;
  }
};

// ─── Financial Statements Generator ────────────────────
const getFinancialsData = (ticker: string, price: number, eps: number) => {
  const scale = ticker === 'DANGCEM' ? 120 : ticker === 'MTNN' ? 95 : 35;
  const rawEps = eps > 0 ? eps : 4.5;

  const rev25 = (rawEps * scale * 2.3).toFixed(1);
  const rev24 = (rawEps * scale * 2.0).toFixed(1);
  const rev23 = (rawEps * scale * 1.7).toFixed(1);

  const ni25 = (rawEps * scale).toFixed(1);
  const ni24 = (rawEps * scale * 0.86).toFixed(1);
  const ni23 = (rawEps * scale * 0.72).toFixed(1);

  const asset25 = (price * scale * 3.8).toFixed(1);
  const asset24 = (price * scale * 3.4).toFixed(1);
  const liab25 = (price * scale * 2.2).toFixed(1);
  const liab24 = (price * scale * 2.0).toFixed(1);
  const eq25 = (parseFloat(asset25) - parseFloat(liab25)).toFixed(1);
  const eq24 = (parseFloat(asset24) - parseFloat(liab24)).toFixed(1);

  return {
    income: [
      { metric: 'Revenue (Turnover)', y2025: `₦${rev25}B`, y2024: `₦${rev24}B`, y2023: `₦${rev23}B` },
      { metric: 'Operating Expenses', y2025: `₦${(parseFloat(rev25) * 0.58).toFixed(1)}B`, y2024: `₦${(parseFloat(rev24) * 0.60).toFixed(1)}B`, y2023: `₦${(parseFloat(rev23) * 0.62).toFixed(1)}B` },
      { metric: 'Net Income (PAT)', y2025: `₦${ni25}B`, y2024: `₦${ni24}B`, y2023: `₦${ni23}B`, highlight: true },
      { metric: 'Operating Profit Margin', y2025: '42.0%', y2024: '40.0%', y2023: '38.0%' },
    ],
    balance: [
      { metric: 'Total Assets', y2025: `₦${asset25}B`, y2024: `₦${asset24}B` },
      { metric: 'Total Liabilities', y2025: `₦${liab25}B`, y2024: `₦${liab24}B` },
      { metric: 'Total Shareholder Equity', y2025: `₦${eq25}B`, y2024: `₦${eq24}B`, highlight: true },
      { metric: 'Debt to Equity Ratio', y2025: '0.88x', y2024: '0.94x' },
    ]
  };
};

// ─── Dividend History Generator ────────────────────────
const getDividendHistoryData = (ticker: string, divYield: string, price: number) => {
  const yieldPct = parseFloat(divYield) || 5;
  const totalDiv = price * (yieldPct / 100);

  return {
    yield: divYield,
    payoutRatio: `${(32 + (price % 18)).toFixed(1)}%`,
    frequency: yieldPct > 6 ? 'Semi-Annually' : 'Annually',
    history: [
      { period: 'Interim 2025', type: 'Cash', amount: `₦${(totalDiv * 0.35).toFixed(2)}`, exDate: 'Aug 14, 2025', payDate: 'Sep 02, 2025' },
      { period: 'Final 2024', type: 'Cash', amount: `₦${(totalDiv * 0.65).toFixed(2)}`, exDate: 'Mar 12, 2024', payDate: 'Apr 04, 2024' },
      { period: 'Interim 2024', type: 'Cash', amount: `₦${(totalDiv * 0.30).toFixed(2)}`, exDate: 'Aug 18, 2024', payDate: 'Sep 05, 2024' },
      { period: 'Final 2023', type: 'Cash', amount: `₦${(totalDiv * 0.60).toFixed(2)}`, exDate: 'Mar 15, 2023', payDate: 'Apr 06, 2023' },
    ]
  };
};

export default function StockDetail() {
  const selectedTicker = useAppStore((state) => state.selectedTicker);
  const previousView   = useAppStore((state) => state.previousView);
  const setView        = useAppStore((state) => state.setView);
  const toggleWatchlist = useAppStore((state) => state.toggleWatchlist);
  const watchlist      = useAppStore((state) => state.watchlist);
  const user           = useAppStore((state) => state.user);
  const addHolding     = useAppStore((state) => state.addHolding);

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'dividend' | 'valuation' | 'management' | 'competitors' | 'news'>('overview');
  const [activeDuration, setActiveDuration] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');
  const [sharesInput, setSharesInput] = useState('');
  const [priceInput, setPriceInput]   = useState('');
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement | null>(null);

  const stock      = ngxStocks.find((s) => s.ticker === selectedTicker) || ngxStocks[0];
  const isPositive = stock.change >= 0;
  const isWatched  = watchlist.includes(stock.ticker);
  const color      = isPositive ? '#10B981' : '#FF4D4D';

  const relatedNews = mockNews.filter((news) => news.affectedStocks.includes(stock.ticker));

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = parseInt(sharesInput);
    const price  = parseFloat(priceInput) || stock.price;
    if (shares > 0) {
      addHolding(stock.ticker, shares, price);
      setShowAddSuccess(true);
      setSharesInput(''); setPriceInput('');
      setTimeout(() => setShowAddSuccess(false), 3000);
    }
  };

  const rawData = stock.chartData;
  const getSlicedData = () => {
    switch (activeDuration) {
      case '1D': return rawData.slice(-4);
      case '1W': return rawData.slice(-7);
      case '1M': return rawData.slice(-15);
      default:   return rawData;
    }
  };

  const chartPoints = getSlicedData();
  const prices   = chartPoints.map((p) => p.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const chartWidth  = 500;
  const chartHeight = 180;
  const paddingX    = 20;
  const paddingY    = 20;

  const points = chartPoints.map((point, index) => {
    const x = paddingX + (index / (chartPoints.length - 1)) * (chartWidth - paddingX * 2);
    const y = paddingY + (1 - (point.price - minPrice) / priceRange) * (chartHeight - paddingY * 2);
    return { x, y, price: point.price, date: point.date, volume: point.volume };
  });

  const pathD = points.reduce((acc, p, i) => `${acc}${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
    : '';

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!chartRef.current || points.length === 0) return;
    const rect   = chartRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * chartWidth;
    let closestIndex = 0;
    let minDiff = Infinity;
    points.forEach((p, idx) => {
      const diff = Math.abs(p.x - mouseX);
      if (diff < minDiff) { minDiff = diff; closestIndex = idx; }
    });
    setHoverIndex(closestIndex);
    setHoverX(points[closestIndex].x);
    setHoverY(points[closestIndex].y);
  };

  const handleMouseLeave = () => { setHoverIndex(null); setHoverX(null); setHoverY(null); };
  const hoveredPoint = hoverIndex !== null ? points[hoverIndex] : null;

  const cardStyle = {
    background: 'linear-gradient(145deg, #0E0D2A, #050410)',
    border: '1px solid rgba(59, 56, 141, 0.5)', // border-bright/50
    boxShadow: '0 10px 30px rgba(99, 102, 241, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.02)',
  };
  const inputStyle = { background: 'rgba(14,13,37,0.8)', border: '1px solid #23214C', color: '#FFFFFF' };

  // ─── Render Helper functions for Tabs ────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'financials':
        return renderFinancials();
      case 'dividend':
        return renderDividend();
      case 'valuation':
        return renderValuation();
      case 'management':
        return renderManagement();
      case 'competitors':
        return renderCompetitors();
      case 'news':
        return renderNews();
      default:
        return renderOverview();
    }
  };

  // 1. Overview Content
  const renderOverview = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Main detail indicators */}
        <div className="md:col-span-2 space-y-5">
          {/* Price Block */}
          <div className="p-5 rounded-3xl flex flex-wrap items-baseline gap-4" style={cardStyle}>
            <div>
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
                Current Price
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl sm:text-4xl font-extrabold text-text-primary font-sora tracking-tight"
                  style={{ textShadow: isPositive ? `0 0 20px ${color}30` : 'none' }}>
                  ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
                <span className={`inline-flex items-center text-sm font-bold px-2 py-0.5 rounded-lg ${
                  isPositive ? 'bg-gain/10 text-gain border border-gain/20' : 'bg-danger/10 text-danger'
                }`}>
                  {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                </span>
              </div>
            </div>
            <div className="border-l border-border pl-4">
              <span className="text-[10px] text-text-secondary font-medium block">Daily Move</span>
              <span className={`text-sm font-extrabold font-sora ${isPositive ? 'text-gain' : 'text-danger'}`}>
                {isPositive ? '+' : ''}₦{stock.changeAmount.toFixed(2)}
              </span>
            </div>
            <div className="border-l border-border pl-4">
              <span className="text-[10px] text-text-secondary font-medium block">Volume</span>
              <span className="text-sm font-extrabold font-sora text-text-primary">{stock.volume}</span>
            </div>
          </div>

          {/* Interactive Chart */}
          <div className="p-4 sm:p-5 rounded-3xl space-y-4" style={cardStyle}>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider font-dm-sans">
                Price Chart
              </span>
              <div className="flex p-0.5 rounded-lg border border-border/60 text-[10px]"
                style={{ background: 'rgba(0,0,0,0.3)' }}>
                {(['1D', '1W', '1M', '3M', '1Y'] as const).map((d) => (
                  <button key={d} onClick={() => setActiveDuration(d)}
                    className="px-2.5 py-1 rounded font-bold font-dm-sans transition-all focus:outline-none"
                    style={activeDuration === d
                      ? { background: '#6366F1', color: '#FFFFFF', boxShadow: '0 0 8px rgba(99,102,241,0.4)' }
                      : { color: 'rgba(255,255,255,0.5)' }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative rounded-xl p-2 h-[200px] border border-border/40"
              style={{ background: 'rgba(0,0,0,0.3)' }}>
              {hoveredPoint && (
                <div className="absolute top-2 left-2 rounded-xl p-2.5 shadow-xl z-20 text-[10px] space-y-0.5 pointer-events-none animate-in fade-in duration-100"
                  style={{ background: '#0E0D25', border: '1px solid #23214C' }}>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    Date: <span className="text-text-primary font-bold">{hoveredPoint.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    Price: <span className="font-bold" style={{ color }}>{`₦${hoveredPoint.price.toLocaleString('en-NG')}`}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-text-secondary">
                    Vol: <span className="font-bold text-text-primary">{(hoveredPoint.volume / 1000).toFixed(0)}k</span>
                  </div>
                </div>
              )}

              <svg ref={chartRef} viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full cursor-crosshair"
                onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <defs>
                  <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.01" />
                  </linearGradient>
                  <filter id="chart-glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {points.map((p, idx) => {
                  const maxVol = Math.max(...points.map((pt) => pt.volume));
                  const volH   = (p.volume / maxVol) * 28;
                  return (
                    <rect key={idx} x={p.x - 2} y={chartHeight - paddingY - volH}
                      width="4" height={volH}
                      fill={color} opacity="0.08" rx="1" />
                  );
                })}

                {areaD && <path d={areaD} fill="url(#chartAreaGrad)" />}
                {pathD && (
                  <path d={pathD} fill="none" stroke={color} strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" filter="url(#chart-glow)" />
                )}

                {hoverX !== null && hoverY !== null && (
                  <>
                    <line x1={hoverX} y1={paddingY} x2={hoverX} y2={chartHeight - paddingY}
                      stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
                    <circle cx={hoverX} cy={hoverY} r="7" fill={color} opacity="0.15" />
                    <circle cx={hoverX} cy={hoverY} r="4" fill={color} stroke="#070615" strokeWidth="2" />
                  </>
                )}
              </svg>
            </div>

            <div className="flex items-center justify-between text-[9px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans px-1">
              <span>{chartPoints[0]?.date}</span>
              <span>₦{minPrice.toLocaleString()} – ₦{maxPrice.toLocaleString()}</span>
              <span>{chartPoints[chartPoints.length - 1]?.date}</span>
            </div>
          </div>

          {/* Fundamental metrics snippet */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Fundamental Indices
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'P/E Ratio', value: stock.peRatio < 0 ? 'N/A (Loss)' : `${stock.peRatio}x`, sub: 'Trailing 12 months' },
                { label: 'P/B Ratio', value: `${stock.pbRatio}x`, sub: 'Book value multiplier' },
                { label: 'Market Cap', value: stock.marketCap, sub: 'Total equity worth' },
                { label: 'Dividend Yield', value: stock.dividendYield, sub: 'Historical payout', highlight: true },
              ].map(({ label, value, sub, highlight }) => (
                <div key={label} className="p-4 rounded-xl" style={cardStyle}>
                  <span className="text-[10px] text-text-secondary font-bold uppercase font-dm-sans tracking-wide block mb-1">{label}</span>
                  <span className={`text-base font-extrabold font-sora ${highlight ? 'text-brand-primary' : 'text-text-primary'}`}
                    style={highlight ? { textShadow: '0 0 10px rgba(99,102,241,0.3)' } : {}}>
                    {value}
                  </span>
                  <span className="block text-[9px] text-text-secondary mt-0.5 font-dm-sans">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar details */}
        <div className="space-y-5">
          {/* AI Insight */}
          <div className="p-5 rounded-3xl space-y-3 relative overflow-hidden border border-brand-primary/12"
            style={{ background: 'linear-gradient(145deg, #0E0D2A, #050410)' }}>
            <div className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #6366F1, transparent)' }} />
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />

            <div className="flex items-center gap-2 relative z-10">
              <div className="bg-brand-primary/15 border border-brand-primary/25 p-1.5 rounded-lg">
                <Sparkles className="h-3.5 w-3.5 text-brand-primary animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-extrabold text-brand-primary font-sora">AI Insight</h4>
                <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans">
                  {user?.experienceLevel || 'Beginner'} Mode
                </span>
              </div>
            </div>

            <div className="relative z-10 border-l-2 border-brand-primary/30 pl-3">
              <p className="text-xs leading-relaxed text-text-primary/90 font-medium font-dm-sans">
                {stock.aiInsight[user?.experienceLevel || 'Beginner']}
              </p>
            </div>

            <div className="pt-2 border-t border-border/40 text-[9px] text-text-secondary font-medium font-dm-sans relative z-10">
              AI-generated insight. Not financial advice.
            </div>
          </div>

          {/* Ledger Add Form */}
          <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
            <div className="flex items-center gap-2 pb-3 border-b border-border/40">
              <Briefcase className="h-4 w-4 text-brand-primary" />
              <h4 className="text-sm font-bold text-brand-primary font-sora">Manual Ledger</h4>
            </div>

            {showAddSuccess && (
              <div className="bg-brand-primary/10 border border-brand-primary/20 text-brand-primary rounded-xl p-3 text-xs font-bold text-center animate-in fade-in duration-200">
                ✅ Transaction saved to Portfolio!
              </div>
            )}

            <form onSubmit={handleBuy} className="space-y-3.5">
              {[
                { label: 'Shares Volume', placeholder: 'e.g. 1,000 shares', value: sharesInput, onChange: setSharesInput, type: 'number', required: true },
                { label: `Buy Price / Share (₦)`, placeholder: `Current: ₦${stock.price.toFixed(2)}`, value: priceInput, onChange: setPriceInput, type: 'number' },
              ].map(({ label, placeholder, value, onChange, type, required }) => (
                <div key={label}>
                  <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans mb-1.5">{label}</label>
                  <input type={type} placeholder={placeholder} value={value}
                    onChange={e => onChange(e.target.value)}
                    required={required}
                    className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:ring-0 focus:outline-none placeholder:text-text-secondary"
                    style={inputStyle}
                    onFocus={e => (e.target.style.borderColor = 'rgba(99,102,241,0.4)')}
                    onBlur={e => (e.target.style.borderColor = '#23214C')} />
                </div>
              ))}

              <button type="submit"
                className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 focus:outline-none text-bg-base transition-all"
                style={{ background: 'linear-gradient(135deg, #6366F1, #4F46E5)', boxShadow: '0 0 12px rgba(99,102,241,0.3)' }}>
                Add to Portfolio Ledger
              </button>
            </form>
          </div>

          {/* News mentioned */}
          {relatedNews.slice(0, 2).length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] text-text-secondary font-bold uppercase tracking-widest font-dm-sans">
                Mentioned in Feed
              </h4>
              <div className="space-y-2">
                {relatedNews.slice(0, 2).map((news) => {
                  const dotColors = { Positive: '#10B981', Negative: '#FF4D4D', Neutral: '#FFB800' };
                  const dot = dotColors[news.marketImpact];
                  return (
                    <button key={news.id} onClick={() => setView('news')}
                      className="w-full p-3.5 rounded-xl text-left transition-all text-xs font-dm-sans flex items-start gap-2.5 group border border-border/40 focus:outline-none"
                      style={{ background: 'rgba(14,13,37,0.5)' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.2)';
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(99,102,241,0.03)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = '#23214C';
                        (e.currentTarget as HTMLButtonElement).style.background = 'rgba(14,13,37,0.5)';
                      }}>
                      <div className="p-1.5 rounded-lg flex-shrink-0 transition-all"
                        style={{ background: `${dot}15`, border: `1px solid ${dot}25` }}>
                        <BookOpen className="h-3 w-3" style={{ color: dot }} />
                      </div>
                      <div className="truncate">
                        <span className="text-[9px] font-bold text-text-secondary block">
                          {news.source} · {news.timeAgo}
                        </span>
                        <p className="font-bold text-text-primary group-hover:text-brand-primary transition-colors truncate text-[11px] mt-0.5">
                          {news.originalHeadline}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 2. Financials Content
  const renderFinancials = () => {
    const fin = getFinancialsData(stock.ticker, stock.price, stock.eps);
    return (
      <div className="space-y-6">
        {/* Income Statement */}
        <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <h4 className="text-sm font-extrabold text-brand-primary font-sora">Income Statement Summary</h4>
            <span className="text-[9px] font-bold text-text-secondary uppercase">All figures in Billions (₦)</span>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-xs font-dm-sans min-w-[500px]">
              <thead>
                <tr className="border-b border-border/40 text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Financial Metric</th>
                  <th className="py-2.5 text-right">FY 2025</th>
                  <th className="py-2.5 text-right">FY 2024</th>
                  <th className="py-2.5 text-right">FY 2023</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-text-primary">
                {fin.income.map((row) => (
                  <tr key={row.metric} className={`hover:bg-bg-surface/30 transition-colors ${row.highlight ? 'font-bold text-brand-primary' : 'font-medium text-text-secondary hover:text-text-primary'}`}>
                    <td className="py-3.5 flex items-center gap-1.5">
                      {row.highlight && <Sparkles className="h-3.5 w-3.5 text-brand-primary" />}
                      {row.metric}
                    </td>
                    <td className="py-3.5 text-right text-text-primary">{row.y2025}</td>
                    <td className="py-3.5 text-right">{row.y2024}</td>
                    <td className="py-3.5 text-right">{row.y2023}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Balance Sheet */}
        <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <h4 className="text-sm font-extrabold text-brand-primary font-sora">Balance Sheet Summary</h4>
            <span className="text-[9px] font-bold text-text-secondary uppercase">All figures in Billions (₦)</span>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-xs font-dm-sans min-w-[500px]">
              <thead>
                <tr className="border-b border-border/40 text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Account Position</th>
                  <th className="py-2.5 text-right">FY 2025</th>
                  <th className="py-2.5 text-right">FY 2024</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-text-primary">
                {fin.balance.map((row) => (
                  <tr key={row.metric} className={`hover:bg-bg-surface/30 transition-colors ${row.highlight ? 'font-bold text-brand-primary' : 'font-medium text-text-secondary hover:text-text-primary'}`}>
                    <td className="py-3.5">{row.metric}</td>
                    <td className="py-3.5 text-right text-text-primary">{row.y2025}</td>
                    <td className="py-3.5 text-right">{row.y2024}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 3. Dividend Content
  const renderDividend = () => {
    const div = getDividendHistoryData(stock.ticker, stock.dividendYield, stock.price);
    return (
      <div className="space-y-5">
        {/* Dividend Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Dividend Yield', value: div.yield, desc: 'Historical yield percentage' },
            { label: 'Payout Ratio', value: div.payoutRatio, desc: 'Percentage of earnings paid out' },
            { label: 'Frequency', value: div.frequency, desc: 'Regularity of payout' },
          ].map((item) => (
            <div key={item.label} className="p-4 rounded-2xl" style={cardStyle}>
              <span className="text-[10px] text-text-secondary font-bold uppercase font-dm-sans tracking-wide block mb-1">
                {item.label}
              </span>
              <span className="text-xl font-extrabold text-brand-primary font-sora block mb-0.5" style={{ textShadow: '0 0 10px rgba(99,102,241,0.3)' }}>
                {item.value}
              </span>
              <span className="text-[9px] text-text-secondary font-medium font-dm-sans">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* History Table */}
        <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
          <div className="flex items-center justify-between pb-3 border-b border-border/50">
            <h4 className="text-sm font-extrabold text-brand-primary font-sora">Dividend Payment History</h4>
            <span className="text-[9px] font-bold text-text-secondary uppercase">Recent Distributions</span>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full border-collapse text-left text-xs font-dm-sans min-w-[500px]">
              <thead>
                <tr className="border-b border-border/40 text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Period</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5 text-right">Dividend Amount</th>
                  <th className="py-2.5">Ex-Dividend Date</th>
                  <th className="py-2.5">Payment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20 text-text-secondary hover:text-text-primary">
                {div.history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-bg-surface/30 transition-colors font-medium">
                    <td className="py-3.5 text-text-primary font-bold">{row.period}</td>
                    <td className="py-3.5">{row.type}</td>
                    <td className="py-3.5 text-right text-brand-primary font-bold">{row.amount}</td>
                    <td className="py-3.5">{row.exDate}</td>
                    <td className="py-3.5">{row.payDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // 4. Valuation Content
  const renderValuation = () => {
    const upside = ((stock.targetPrice - stock.price) / stock.price) * 100;
    const rangePercent = Math.max(0, Math.min(100, ((stock.price - stock.fiftyTwoWeekRange.low) / (stock.fiftyTwoWeekRange.high - stock.fiftyTwoWeekRange.low)) * 100));

    return (
      <div className="space-y-6">
        {/* Core Valuation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
            <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans border-b border-border/40 pb-2">
              Price Target & Consensus
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary font-medium">Current Price:</span>
                <span className="text-sm font-bold text-text-primary font-sora">₦{stock.price.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary font-medium">Analyst Target Price:</span>
                <span className="text-sm font-bold text-brand-primary font-sora">₦{stock.targetPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-text-secondary font-medium">Implied Returns:</span>
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg ${upside >= 0 ? 'bg-gain/10 text-gain' : 'bg-danger/10 text-danger'}`}>
                  {upside >= 0 ? '+' : ''}{upside.toFixed(1)}% Upside
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/20">
                <span className="text-xs text-text-secondary font-medium">Recommended Action:</span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  stock.decision === 'Buy' ? 'bg-gain/15 text-gain border border-gain/35 shadow-glow-green-sm' :
                  stock.decision === 'Sell' ? 'bg-danger/15 text-danger border border-danger/35 shadow-glow-red' :
                  'bg-warning/15 text-warning border border-warning/35'
                }`}>
                  {stock.decision}
                </span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
            <h4 className="text-xs font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans border-b border-border/40 pb-2">
              Relative Valuation Multiples
            </h4>
            <div className="space-y-3.5">
              <div>
                <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                  <span>P/E Ratio (Trailing)</span>
                  <span className="text-text-primary">{stock.peRatio < 0 ? 'N/A' : `${stock.peRatio}x`}</span>
                </div>
                <div className="h-1.5 w-full bg-bg-base rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary" style={{ width: stock.peRatio > 0 ? `${Math.min(100, (stock.peRatio / 18) * 100)}%` : '0%' }} />
                </div>
                <span className="text-[9px] text-text-muted mt-1 block">Sector Avg: {(stock.peRatio * 0.95).toFixed(1)}x</span>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                  <span>P/B Ratio (Book Multiplier)</span>
                  <span className="text-text-primary">{stock.pbRatio}x</span>
                </div>
                <div className="h-1.5 w-full bg-bg-base rounded-full overflow-hidden">
                  <div className="h-full bg-brand-primary" style={{ width: `${Math.min(100, (stock.pbRatio / 3) * 100)}%` }} />
                </div>
                <span className="text-[9px] text-text-muted mt-1 block">Sector Avg: {(stock.pbRatio * 1.1).toFixed(1)}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* 52-Week Price Range Slider */}
        <div className="p-5 rounded-3xl space-y-5" style={cardStyle}>
          <div>
            <h4 className="text-sm font-extrabold text-brand-primary font-sora">52-Week Trading Range</h4>
            <p className="text-[10px] text-text-secondary font-medium font-dm-sans mt-0.5">Current position relative to annual boundary</p>
          </div>

          <div className="space-y-2">
            <div className="relative h-2.5 w-full bg-bg-base rounded-full border border-border/50">
              {/* Highlight Bar */}
              <div className="absolute h-full rounded-full bg-brand-primary/25" style={{ left: '0%', width: `${rangePercent}%` }} />
              {/* Current Price Marker */}
              <div className="absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-brand-primary border-4 border-foreground shadow-[0_0_12px_#6366F1]"
                style={{ left: `calc(${rangePercent}% - 10px)` }} />
            </div>

            <div className="flex justify-between text-xs font-bold font-dm-sans pt-1">
              <div className="text-left">
                <span className="block text-[8px] text-text-muted uppercase">52W Low</span>
                <span className="text-text-secondary">₦{stock.fiftyTwoWeekRange.low.toFixed(2)}</span>
              </div>
              <div className="text-center">
                <span className="block text-[8px] text-text-muted uppercase">Current</span>
                <span className="text-brand-primary">₦{stock.price.toFixed(2)}</span>
              </div>
              <div className="text-right">
                <span className="block text-[8px] text-text-muted uppercase">52W High</span>
                <span className="text-text-secondary">₦{stock.fiftyTwoWeekRange.high.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 5. Management Content
  const renderManagement = () => {
    const mgmt = getManagementData(stock.ticker);
    return (
      <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
        <div className="pb-3 border-b border-border/50">
          <h4 className="text-sm font-extrabold text-brand-primary font-sora">Corporate Governance & Board</h4>
          <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">Key executives steering the business strategy</p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-xs font-dm-sans min-w-[600px]">
            <thead>
              <tr className="border-b border-border/40 text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Executive Name</th>
                <th className="py-2.5">Corporate Role</th>
                <th className="py-2.5">Tenure</th>
                <th className="py-2.5 max-w-xs">Professional Profile</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-text-secondary hover:text-text-primary">
              {mgmt.map((person, idx) => (
                <tr key={idx} className="hover:bg-bg-surface/30 transition-colors font-medium">
                  <td className="py-4 text-text-primary font-bold">{person.name}</td>
                  <td className="py-4 text-brand-primary font-bold">{person.role}</td>
                  <td className="py-4 text-[11px]">{person.tenure}</td>
                  <td className="py-4 text-[11px] max-w-xs leading-relaxed text-text-secondary font-medium font-dm-sans">{person.bio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 6. Competitors Content
  const renderCompetitors = () => {
    const competitors = ngxStocks.filter(s => s.sector === stock.sector && s.ticker !== stock.ticker);
    const compList = competitors.length > 0 ? competitors : ngxStocks.filter(s => s.ticker !== stock.ticker).slice(0, 3);

    return (
      <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
        <div className="pb-3 border-b border-border/50">
          <h4 className="text-sm font-extrabold text-brand-primary font-sora">Sector Comparison (Peer Review)</h4>
          <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">Comparing {stock.name} against relevant industry peers</p>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse text-left text-xs font-dm-sans min-w-[650px]">
            <thead>
              <tr className="border-b border-border/40 text-text-secondary font-bold uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Peer Ticker</th>
                <th className="py-2.5">Name</th>
                <th className="py-2.5 text-right">Price</th>
                <th className="py-2.5 text-right">Daily Change</th>
                <th className="py-2.5 text-right">P/E Ratio</th>
                <th className="py-2.5 text-right">Div Yield</th>
                <th className="py-2.5 text-right">Market Cap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20 text-text-secondary hover:text-text-primary">
              {/* Highlight row of the active stock first */}
              <tr className="bg-brand-primary/8 font-bold border-l-2 border-brand-primary">
                <td className="py-4 pl-2 text-brand-primary font-extrabold">{stock.ticker} (Current)</td>
                <td className="py-4 text-text-primary">{stock.name}</td>
                <td className="py-4 text-right text-text-primary font-bold">₦{stock.price.toFixed(2)}</td>
                <td className={`py-4 text-right ${isPositive ? 'text-gain' : 'text-danger'}`}>{isPositive ? '+' : ''}{stock.change.toFixed(1)}%</td>
                <td className="py-4 text-right">{stock.peRatio < 0 ? 'N/A' : `${stock.peRatio}x`}</td>
                <td className="py-4 text-right text-brand-primary">{stock.dividendYield}</td>
                <td className="py-4 text-right">{stock.marketCap}</td>
              </tr>

              {compList.map((peer) => {
                const peerPos = peer.change >= 0;
                return (
                  <tr key={peer.ticker} className="hover:bg-bg-surface/30 transition-colors font-medium">
                    <td className="py-4 pl-2 text-text-primary font-bold">{peer.ticker}</td>
                    <td className="py-4 truncate max-w-[150px]">{peer.name}</td>
                    <td className="py-4 text-right text-text-primary">₦{peer.price.toFixed(2)}</td>
                    <td className={`py-4 text-right ${peerPos ? 'text-gain' : 'text-danger'}`}>{peerPos ? '+' : ''}{peer.change.toFixed(1)}%</td>
                    <td className="py-4 text-right">{peer.peRatio < 0 ? 'N/A' : `${peer.peRatio}x`}</td>
                    <td className="py-4 text-right">{peer.dividendYield}</td>
                    <td className="py-4 text-right">{peer.marketCap}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  // 7. Recent News Content
  const renderNews = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-border/50">
          <div>
            <h4 className="text-sm font-extrabold text-brand-primary font-sora">Related News & Sentiments</h4>
            <p className="text-[10px] text-text-secondary font-dm-sans mt-0.5">Articles and announcements mentioning {stock.ticker}</p>
          </div>
          <span className="text-[10px] font-bold text-text-secondary">{relatedNews.length} articles found</span>
        </div>

        {relatedNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {relatedNews.map((news) => {
              const dotColors = { Positive: '#10B981', Negative: '#FF4D4D', Neutral: '#FFB800' };
              const dot = dotColors[news.marketImpact];
              return (
                <div key={news.id} className="rounded-3xl p-5 border transition-all duration-300 group"
                  style={{ background: 'linear-gradient(145deg, #0E0D2A, #050410)', borderColor: 'rgba(99,102,241,0.08)', borderLeft: `4px solid ${dot}` }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = `${dot}50`;
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px ${dot}12`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(99,102,241,0.08)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                  }}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-text-secondary uppercase tracking-wider font-dm-sans mb-2.5">
                    <span>{news.source} · {news.timeAgo}</span>
                    <span className="px-2 py-0.5 rounded-lg border text-[10px] font-extrabold"
                      style={{ color: dot, borderColor: `${dot}30`, background: `${dot}10` }}>
                      {news.marketImpact} Sentiment
                    </span>
                  </div>
                  <h4 className="text-sm font-extrabold text-text-primary group-hover:text-brand-primary transition-colors mb-2">
                    {news.originalHeadline}
                  </h4>
                  <p className="text-xs text-text-secondary font-medium leading-relaxed font-dm-sans">
                    {news.aiSummary}
                  </p>
                  
                  {/* Drivers Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/30">
                    {news.drivers?.map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-bg-base border border-border/40 text-text-secondary">
                        #{d}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-10 border border-dashed border-border/50 rounded-2xl text-center text-xs text-text-secondary font-medium font-dm-sans" style={cardStyle}>
            <span className="text-2xl block mb-2">📰</span>
            <span>No specific news found for {stock.ticker} recently. Check overall Markets News.</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Navigation Row ──────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <button onClick={() => setView(previousView)}
          className="flex items-center gap-1.5 text-xs font-bold text-brand-primary hover:bg-brand-primary/8 px-3 py-2 rounded-xl transition-all focus:outline-none"
          style={{ border: '1px solid transparent' }}
          onMouseEnter={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.2)')}
          onMouseLeave={e => ((e.currentTarget as HTMLButtonElement).style.borderColor = 'transparent')}>
          <ChevronLeft className="h-4 w-4" />
          Back to {previousView === 'home' ? 'Overview' : 'Markets'}
        </button>

        <button onClick={() => toggleWatchlist(stock.ticker)}
          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all focus:outline-none ${
            isWatched
              ? 'bg-warning/10 border-warning/25 text-warning'
              : 'text-text-secondary hover:text-text-primary border-border hover:border-border-bright'
          }`}
          style={!isWatched ? { background: 'rgba(14,13,37,0.5)' } : {}}>
          <Star className={`h-3.5 w-3.5 ${isWatched ? 'fill-warning' : ''}`} />
          {isWatched ? 'Watching' : 'Add to Watchlist'}
        </button>
      </div>

      {/* ── Stock Title Header ──────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border"
            style={{ background: `${color}10`, borderColor: `${color}25`, color }}>
            {stock.sector}
          </span>
          <span className="text-[10px] text-text-secondary font-medium">NGX Listed</span>
        </div>
        <h1 className="text-3xl font-extrabold font-sora tracking-tight"
          style={{ color, textShadow: `0 0 24px ${color}40` }}>
          {stock.ticker}
        </h1>
        <p className="text-sm font-medium text-text-secondary font-dm-sans mt-0.5">{stock.name}</p>
      </div>

      {/* ── Main Grid with Left Menu Tab ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Menu */}
        <div className="lg:col-span-3 space-y-2 lg:sticky lg:top-6">
          <div className="p-2.5 rounded-3xl border border-border-bright/45 shadow-glow-indigo flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 lg:gap-1 scrollbar-none"
            style={{ background: 'linear-gradient(145deg, #0E0D2A, #050410)' }}>
            <div className="hidden lg:block text-[10px] font-extrabold text-text-secondary uppercase tracking-widest px-3 py-2 border-b border-border/40 mb-2">
              Terminal Menu
            </div>
            {([
              { id: 'overview', label: 'Overview', icon: BarChart2 },
              { id: 'financials', label: 'Financials', icon: FileText },
              { id: 'dividend', label: 'Dividend', icon: Gift },
              { id: 'valuation', label: 'Valuation', icon: Activity },
              { id: 'management', label: 'Management', icon: Users },
              { id: 'competitors', label: 'Competitors', icon: Layers },
              { id: 'news', label: 'Recent News', icon: Newspaper },
            ] as const).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-center lg:justify-start gap-2.5 px-4 lg:px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 relative flex-shrink-0 lg:flex-shrink focus:outline-none ${
                    isActive
                      ? 'text-brand-primary bg-brand-primary/10 border border-brand-primary/20 shadow-[0_0_8px_rgba(99,102,241,0.1)]'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50 border border-transparent'
                  }`}
                >
                  <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-brand-primary' : 'text-text-secondary'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <div className="hidden lg:block absolute right-3 h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-9">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
