import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  Star,
  Sparkles,
  BookOpen,
  BarChart2,
  FileText,
  Gift,
  Activity,
  Users,
  Layers,
  Newspaper,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockNews } from '@/lib/mockData';
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


// ─── 7 Pillars Section Component ────────────────────
const SevenPillarsSection = ({ ticker }: { ticker: string }) => {
  const pillarsData = [
    {
      id: '01', name: 'Valuation', sub: 'P/E, P/B, EV/EBITDA vs sector', score: 78, color: '#22C55E',
      bullets: ['P/E of 3.2x — below NGX banking avg of 7.8x', 'P/B of 0.74x — trading below book value']
    },
    {
      id: '02', name: 'Revenue Growth', sub: '3-year CAGR, trend direction', score: 82, color: '#22C55E',
      bullets: ['Gross earnings ₦3.97T — +125% YoY', 'Real USD growth ~18-20% ex-FX']
    },
    {
      id: '03', name: 'Earnings Perf.', sub: 'EPS trend, surprises', score: 70, color: '#F5A623',
      bullets: ['PAT ₦1.03T in FY2024', 'EPS of ₦32.83']
    },
    {
      id: '04', name: 'Profitability', sub: 'ROE, ROA, EBITDA margins', score: 85, color: '#22C55E',
      bullets: ['ROE 34.7% — top quartile NGX banks', 'Cost-to-income: 38.2%']
    },
    {
      id: '05', name: 'Dividends', sub: 'Yield, payout ratio, consistency', score: 80, color: '#22C55E',
      bullets: ['Dividend yield of 10.4%', 'Consistent payout history']
    },
    {
      id: '06', name: 'Balance Sheet', sub: 'Capital adequacy, NPLs, liquidity', score: 75, color: '#22C55E',
      bullets: ['CAR above regulatory minimum', 'NPL ratio within target bounds']
    },
    {
      id: '07', name: 'Momentum', sub: 'Price trend, volume, relative strength', score: 65, color: '#F5A623',
      bullets: ['Trading above 50-day SMA', 'RSI indicates neutral territory']
    }
  ];

  // Radar chart base points (R=100, Center=150,150)
  // Angles: -90, -38.57, 12.86, 64.29, 115.71, 167.14, 218.57
  const r100 = [
    [150.0, 50.0], [228.2, 87.7], [247.5, 172.3], 
    [193.4, 240.1], [106.6, 240.1], [52.5, 172.3], [71.8, 87.7]
  ];
  const r66 = r100.map(p => [150 + (p[0]-150)*0.66, 150 + (p[1]-150)*0.66]);
  const r33 = r100.map(p => [150 + (p[0]-150)*0.33, 150 + (p[1]-150)*0.33]);
  
  // Data points based on score
  const dataPoints = pillarsData.map((p, i) => {
    const scale = p.score / 100;
    return [150 + (r100[i][0]-150)*scale, 150 + (r100[i][1]-150)*scale];
  });
  
  const polyStr = (pts: number[][]) => pts.map(p => p.join(',')).join(' ');

  return (
    <div className="mt-12 mb-8 bg-transparent">
      <div className="mb-8">
        <div className="text-[10px] font-extrabold text-brand-primary uppercase tracking-widest font-dm-sans mb-2">
          The 7 Scoring Pillars
        </div>
        <h2 className="text-2xl lg:text-3xl font-bold font-serif mb-2 text-text-primary">
          What's driving this rating?
        </h2>
        <p className="text-sm text-text-secondary">
          Every EquityStack rating is built on 7 measurable, transparent pillars. Here's how {ticker} scores on each.
        </p>
      </div>

      {/* Radar Chart Area */}
      <div className="relative w-full flex justify-center py-10 mb-8">
        <svg width="400" height="300" viewBox="0 0 300 300" className="overflow-visible">
          <defs>
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
              <stop offset="0%" stopColor="rgba(34, 197, 94, 0.2)" />
              <stop offset="100%" stopColor="rgba(34, 197, 94, 0)" />
            </radialGradient>
          </defs>
          
          {/* Concentric Webs */}
          <polygon points={polyStr(r100)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <polygon points={polyStr(r66)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          <polygon points={polyStr(r33)} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          
          {/* Axis Lines */}
          {r100.map((p, i) => (
            <line key={i} x1="150" y1="150" x2={p[0]} y2={p[1]} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}

          {/* Data Polygon */}
          <polygon points={polyStr(dataPoints)} fill="url(#radarGlow)" stroke="#22C55E" strokeWidth="2" strokeLinejoin="round" />
          
          {/* Data Nodes */}
          {dataPoints.map((p, i) => (
            <circle key={`node-${i}`} cx={p[0]} cy={p[1]} r="4" fill={pillarsData[i].color} />
          ))}

          {/* Labels */}
          {r100.map((p, i) => {
            const isLeft = p[0] < 150;
            const isTop = p[1] < 150;
            const isCenter = Math.abs(p[0] - 150) < 5;
            let anchor: "middle" | "end" | "start" = isCenter ? "middle" : isLeft ? "end" : "start";
            let xOffset = isCenter ? 0 : isLeft ? -10 : 10;
            let yOffset = isTop ? -10 : 15;
            
            return (
              <text key={`label-${i}`} x={p[0] + xOffset} y={p[1] + yOffset} fill="#8FA3C0" fontSize="9" textAnchor={anchor} className="font-dm-sans font-medium">
                {pillarsData[i].name}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pillarsData.map((pillar) => (
          <div key={pillar.id} className="p-5 rounded-2xl border border-border/40" style={{ background: 'linear-gradient(180deg, #141020 0%, #0A0810 100%)' }}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-[10px] font-bold text-brand-primary uppercase tracking-widest font-dm-sans mb-1">
                  Pillar {pillar.id}
                </div>
                <div className="text-lg font-bold text-text-primary mb-1">{pillar.name}</div>
                <div className="text-[11px] text-text-secondary font-medium">{pillar.sub}</div>
              </div>
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-extrabold border-2"
                style={{ borderColor: `${pillar.color}40`, color: pillar.color }}
              >
                {pillar.score}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div 
                className="h-full rounded-full"
                style={{ width: `${pillar.score}%`, background: pillar.color }}
              />
            </div>
            
            {/* Bullets */}
            <ul className="space-y-2">
              {pillar.bullets.map((b, i) => (
                <li key={i} className="flex items-start text-[11px] text-text-secondary font-medium">
                  <span className="w-1 h-1 rounded-full mt-1.5 mr-2 shrink-0" style={{ background: pillar.color }} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function StockDetail() {
  const selectedTicker = useAppStore((state) => state.selectedTicker);
  const previousView = useAppStore((state) => state.previousView);
  const setView = useAppStore((state) => state.setView);
  const toggleWatchlist = useAppStore((state) => state.toggleWatchlist);
  const watchlist = useAppStore((state) => state.watchlist);
  const user = useAppStore((state) => state.user);
  const stocks = useAppStore((state) => state.stocks);

  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'dividend' | 'valuation' | 'earnings' | 'management' | 'competitors' | 'news' | 'health'>('overview');
  const [activeDuration, setActiveDuration] = useState<'1D' | '1W' | '1M' | '3M' | '1Y'>('1M');

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const [hoverY, setHoverY] = useState<number | null>(null);
  const chartRef = useRef<SVGSVGElement | null>(null);

  const stock = stocks.find((s) => s.ticker === selectedTicker) || stocks[0];
  const isPositive = stock.change >= 0;
  const isWatched = watchlist.includes(stock.ticker);
  const color = isPositive ? '#10B981' : '#FF4D4D';

  const relatedNews = mockNews.filter((news) => news.affectedStocks.includes(stock.ticker));



  const rawData = stock.chartData;
  const getSlicedData = () => {
    switch (activeDuration) {
      case '1D': return rawData.slice(-4);
      case '1W': return rawData.slice(-7);
      case '1M': return rawData.slice(-15);
      default: return rawData;
    }
  };

  const chartPoints = getSlicedData();
  const prices = chartPoints.map((p) => p.price);
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const priceRange = maxPrice - minPrice || 1;

  const chartWidth = 500;
  const chartHeight = 180;
  const paddingX = 20;
  const paddingY = 20;

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
    const rect = chartRef.current.getBoundingClientRect();
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
    background: 'linear-gradient(180deg, #141020 0%, #0A0810 100%)',
    border: '1px solid rgba(207, 163, 67, 0.2)',
    boxShadow: '0 10px 30px rgba(207, 163, 67, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.02)',
  };

  // ─── Render Helper functions for Tabs ────────────────
  // 2.5 Earnings Content
  const renderEarnings = () => {
    // Generate dynamic "real" data based on the stock's actual metrics
    const baseEps = stock.eps;
    const epsData = [
      { year: 'FY20', val: baseEps * 0.3, type: 'actual' },
      { year: 'FY21', val: baseEps * 0.35, type: 'actual' },
      { year: 'FY22', val: baseEps * 0.45, type: 'actual' },
      { year: 'FY23', val: baseEps * 0.7, type: 'actual' },
      { year: 'FY24', val: baseEps, type: 'current' },
      { year: 'FY25E', val: baseEps * 1.15, type: 'estimate' },
      { year: 'FY26E', val: baseEps * 1.3, type: 'estimate' },
    ];
    const maxEps = baseEps * 1.3;

    // Analyst Consensus
    const buyCount = stock.rating === 'Outperform' ? 4 : stock.rating === 'Neutral' ? 2 : 0;
    const holdCount = stock.rating === 'Neutral' ? 3 : 1;
    const sellCount = stock.rating === 'Underperform' ? 4 : (stock.rating === 'Outperform' ? 0 : 1);
    const totalCount = buyCount + holdCount + sellCount;
    const buyPct = (buyCount / totalCount) * 100;
    const holdPct = (holdCount / totalCount) * 100;
    const sellPct = (sellCount / totalCount) * 100;

    const upside = ((stock.targetPrice - stock.price) / stock.price) * 100;
    const score = stock.rating === 'Outperform' ? 85 : stock.rating === 'Neutral' ? 60 : 35;
    const scoreText = stock.rating === 'Outperform' ? 'Excellent' : stock.rating === 'Neutral' ? 'Fair' : 'Poor';

    return (
      <div className="space-y-6">
        
        {/* Top & Middle Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: EPS History & Surprise */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* EPS History Chart */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
              <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">PILLAR 03 · EARNINGS PERFORMANCE</div>
              <h3 className="text-base font-serif font-bold text-text-primary mb-2">EPS History & Analyst Estimates</h3>
              <p className="text-sm text-text-secondary mb-10">Earnings per share trend and how {stock.name} has performed against analyst forecasts</p>
              
              <div className="h-[220px] mb-8 border-b border-border/20 pb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={epsData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }} barSize={32}>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8FA3C0' }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#8FA3C0' }} tickFormatter={(val) => `₦${val}`} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                      contentStyle={{ backgroundColor: '#112240', border: '1px solid #1E3A5F', borderRadius: '8px' }}
                      itemStyle={{ color: '#F0F4FF', fontWeight: 'bold' }}
                      formatter={(val) => [`₦${Number(val).toFixed(2)}`, 'EPS']}
                      labelStyle={{ color: '#8FA3C0', marginBottom: '4px' }}
                    />
                    <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                      {epsData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.type === 'current' ? '#22C55E' : entry.type === 'estimate' ? 'transparent' : 'rgba(201,168,76,0.5)'}
                          stroke={entry.type === 'estimate' ? 'rgba(143, 163, 192, 0.5)' : 'none'}
                          strokeDasharray={entry.type === 'estimate' ? '4 4' : 'none'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-4 text-xs text-text-secondary font-medium">
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-[#22C55E] rounded-sm" /> Actual</div>
                <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 border border-dashed border-text-secondary rounded-sm" /> Estimate</div>
              </div>
            </div>

            {/* Earnings Surprise History */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
              <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">EARNINGS SURPRISE HISTORY</div>
              
              <div className="overflow-x-auto custom-scrollbar mt-6">
                <table className="w-full text-left text-sm font-dm-sans min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#1E3A5F]/50 text-[#8FA3C0] font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3">PERIOD</th>
                      <th className="py-3 text-right">ESTIMATE</th>
                      <th className="py-3 text-right">ACTUAL</th>
                      <th className="py-3 text-right">SURPRISE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3A5F]/30 text-text-primary">
                    {[
                      { period: 'H2 2024', est: baseEps * 0.45, act: baseEps * 0.51 },
                      { period: 'H1 2024', est: baseEps * 0.40, act: baseEps * 0.49 },
                      { period: 'H2 2023', est: baseEps * 0.32, act: baseEps * 0.38 },
                      { period: 'H1 2023', est: baseEps * 0.28, act: baseEps * 0.32 },
                      { period: 'H2 2022', est: baseEps * 0.25, act: baseEps * 0.22 },
                      { period: 'H1 2022', est: baseEps * 0.20, act: baseEps * 0.23 },
                    ].map((row, i) => {
                      const surpVal = ((row.act / row.est) - 1) * 100;
                      const sColor = surpVal >= 0 ? '#22C55E' : '#EF4444';
                      return (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 font-medium text-text-secondary">{row.period}</td>
                          <td className="py-4 text-right font-bold">₦{row.est.toFixed(2)}</td>
                          <td className="py-4 text-right font-bold" style={{ color: sColor }}>₦{row.act.toFixed(2)}</td>
                          <td className="py-4 text-right font-bold" style={{ color: sColor }}>{surpVal > 0 ? '+' : ''}{surpVal.toFixed(1)}% {surpVal >= 0 ? '▲' : '▼'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column: Score & Next Earnings */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl flex flex-col justify-between" style={cardStyle}>
               <div>
                 <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">EARNINGS SCORE</div>
                 <div className="text-center mt-4 mb-8">
                   <div className="text-6xl font-serif font-bold mb-2" style={{ color: score >= 70 ? '#22C55E' : score >= 50 ? '#C9A84C' : '#EF4444' }}>{score}</div>
                   <div className="text-sm text-text-secondary mb-1">out of 100</div>
                   <div className="text-base font-bold mt-2" style={{ color: score >= 70 ? '#22C55E' : score >= 50 ? '#C9A84C' : '#EF4444' }}>{scoreText}</div>
                 </div>
               </div>
               <p className="text-sm text-text-secondary leading-relaxed">
                 {stock.ticker.toLowerCase().replace(/^\w/, c => c.toUpperCase())} has consistently reported earnings aligned with its {stock.rating.toLowerCase()} rating. EPS {score >= 50 ? 'growth' : 'trend'} has been driven by {stock.sector.toLowerCase()} market conditions.
               </p>
            </div>
            
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">NEXT EARNINGS</div>
               
               <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20 text-center mb-6">
                  <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans mb-2">H1 2025 RESULTS</div>
                  <div className="text-base font-serif font-bold text-text-primary mb-1">August 2025</div>
                  <div className="text-xs text-text-secondary">Estimated release window</div>
               </div>
               
               <p className="text-sm text-text-secondary leading-relaxed">
                 Market expects H1 2025 EPS of ~₦{(baseEps * 0.55).toFixed(2)}, implying full-year FY2025 of ~₦{(baseEps * 1.15).toFixed(2)} if current trends continue.
               </p>
            </div>
          </div>
          
        </div>

        {/* Bottom Row: Analyst Consensus */}
        <div className="p-6 rounded-3xl" style={cardStyle}>
          <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">ANALYST CONSENSUS</div>
          <h3 className="text-base font-serif font-bold text-text-primary mb-8">What analysts are forecasting</h3>
          
          {/* Segmented Bar */}
          <div className="mb-6">
            <div className="flex h-10 w-full rounded-xl overflow-hidden font-bold text-xs uppercase text-[#0B1628]">
               {buyCount > 0 && <div className="bg-[#22C55E] h-full flex items-center justify-center" style={{ width: `${buyPct}%` }}>{buyCount} BUY</div>}
               {holdCount > 0 && <div className="bg-[#C9A84C] h-full flex items-center justify-center" style={{ width: `${holdPct}%` }}>{holdCount} HOLD</div>}
               {sellCount > 0 && <div className="bg-[#EF4444] h-full flex items-center justify-center" style={{ width: `${sellPct}%` }}>{sellCount} SELL</div>}
            </div>
            <div className="flex justify-between items-center text-xs text-text-secondary mt-3 font-medium">
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#22C55E] rounded-full" /> Buy ({buyCount})</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#C9A84C] rounded-full" /> Hold ({holdCount})</div>
               <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#EF4444] rounded-full" /> Sell ({sellCount})</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">CONSENSUS TARGET</div>
                <div className="text-3xl font-bold font-sora text-text-primary mb-1">₦{stock.targetPrice.toFixed(2)}</div>
                <div className={`text-sm font-bold ${upside >= 0 ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {upside >= 0 ? '+' : ''}{upside.toFixed(1)}% {upside >= 0 ? 'upside' : 'downside'}
                </div>
             </div>
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">FY2025 EPS EST.</div>
                <div className="text-3xl font-bold font-sora text-text-primary mb-1">₦{(baseEps * 1.15).toFixed(2)}</div>
                <div className="text-sm font-bold text-[#22C55E]">+15.0% growth</div>
             </div>
          </div>
        </div>

      </div>
    );
  };
  const renderHealth = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl" style={cardStyle}>
              <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">PILLAR 06 · BALANCE SHEET QUALITY</div>
              <h3 className="text-base font-serif font-bold text-text-primary mb-2">How healthy is {stock.name}'s balance sheet?</h3>
              <p className="text-sm text-text-secondary mb-10">A bank's health is measured by capital strength, asset quality, liquidity, and regulatory compliance.</p>
              
              <div className="space-y-8">
                
                {/* CAR */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-text-primary">Capital Adequacy Ratio (CAR)</div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">STRONG</div>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-secondary font-mono mb-2">
                    <span>CBN Minimum: 15%</span>
                    <span className="text-[#22C55E] font-bold">{stock.ticker}: 21.6%</span>
                  </div>
                  <div className="relative h-2 bg-[#112240] rounded-full overflow-visible flex items-center">
                    <div className="absolute left-0 h-2 bg-[#22C55E] rounded-full" style={{ width: '75%' }}></div>
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow border-2 border-[#1E3A5F]" style={{ left: '75%', top: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                    {stock.ticker}'s CAR of 21.6% is 6.6 percentage points above the CBN minimum, providing a strong buffer against credit losses. This is the best CAR among Tier-1 banks.
                  </p>
                </div>
                
                {/* NPL */}
                <div className="pt-8 border-t border-[#1E3A5F]/50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-text-primary">Non-Performing Loan (NPL) Ratio</div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">WATCH</div>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-secondary font-mono mb-2">
                    <span>CBN Threshold: 5.0%</span>
                    <span className="text-[#C9A84C] font-bold">{stock.ticker}: 4.4%</span>
                  </div>
                  <div className="relative h-2 bg-[#112240] rounded-full overflow-visible flex items-center">
                    <div className="absolute left-0 h-2 bg-gradient-to-r from-[#EF4444] to-[#C9A84C] rounded-full" style={{ width: '85%' }}></div>
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow border-2 border-[#1E3A5F]" style={{ left: '85%', top: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                    NPL ratio ticked up slightly to 4.4% from 3.9%, staying below the CBN's 5% threshold. Loan growth (+72% YoY) contributed to the uptick. Bears monitoring closely.
                  </p>
                </div>

                {/* Liquidity Ratio */}
                <div className="pt-8 border-t border-[#1E3A5F]/50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-text-primary">Liquidity Ratio</div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">STRONG</div>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-secondary font-mono mb-2">
                    <span>CBN Minimum: 30%</span>
                    <span className="text-[#22C55E] font-bold">{stock.ticker}: 52.4%</span>
                  </div>
                  <div className="relative h-2 bg-[#112240] rounded-full overflow-visible flex items-center">
                    <div className="absolute left-0 h-2 bg-[#22C55E] rounded-full" style={{ width: '85%' }}></div>
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow border-2 border-[#1E3A5F]" style={{ left: '85%', top: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                    Liquidity ratio of 52.4% is comfortably above the 30% regulatory minimum, indicating {stock.ticker} can meet short-term obligations and depositor withdrawals without stress.
                  </p>
                </div>

                {/* Loan-to-Deposit */}
                <div className="pt-8 border-t border-[#1E3A5F]/50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-text-primary">Loan-to-Deposit Ratio (LDR)</div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">HEALTHY</div>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-secondary font-mono mb-2">
                    <span>CBN Minimum: 65%</span>
                    <span className="text-[#C9A84C] font-bold">{stock.ticker}: 45.4%</span>
                  </div>
                  <div className="relative h-2 bg-[#112240] rounded-full overflow-visible flex items-center">
                    <div className="absolute left-0 h-2 bg-[#C9A84C] rounded-full" style={{ width: '50%' }}></div>
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow border-2 border-[#1E3A5F]" style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                    LDR of 45.4% is below the CBN's 65% minimum — meaning {stock.ticker} has significant headroom to grow its loan book further, which could drive future earnings growth.
                  </p>
                </div>

                {/* Total Equity */}
                <div className="pt-8 border-t border-[#1E3A5F]/50">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold text-sm text-text-primary">Total Equity / Assets</div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">STRONG</div>
                  </div>
                  <div className="flex justify-between text-[10px] text-text-secondary font-mono mb-2">
                    <span>Industry median: 8%</span>
                    <span className="text-[#22C55E] font-bold">{stock.ticker}: 10.5%</span>
                  </div>
                  <div className="relative h-2 bg-[#112240] rounded-full overflow-visible flex items-center">
                    <div className="absolute left-0 h-2 bg-[#22C55E] rounded-full" style={{ width: '65%' }}></div>
                    <div className="absolute w-4 h-4 bg-white rounded-full shadow border-2 border-[#1E3A5F]" style={{ left: '65%', top: '50%', transform: 'translate(-50%, -50%)' }}></div>
                  </div>
                  <p className="text-xs text-text-secondary mt-3 leading-relaxed">
                    Equity of ₦2.97T against total assets of ₦28.4T gives a 10.5% equity ratio, above the sector median and well above CBN solvency requirements.
                  </p>
                </div>

                {/* CBN Recap */}
                <div className="pt-8 border-t border-[#1E3A5F]/50">
                  <div className="flex justify-between items-center mb-3">
                    <div className="font-bold text-sm text-text-primary">CBN Recapitalisation Compliance</div>
                    <div className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#22C55E]/10 border border-[#22C55E]/30 text-[#22C55E]">ON TRACK</div>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {stock.name} is on track to meet CBN's new minimum capital requirement of ₦500B for international banks by March 2026. The bank has already met 89% of the target through retained earnings and planned rights issue.
                  </p>
                </div>
                
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Balance Sheet Score */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">BALANCE SHEET SCORE</div>
               
               <div className="text-center mt-6 mb-8 border-b border-[#1E3A5F]/50 pb-8">
                 <div className="text-6xl font-serif font-bold mb-2 text-[#C9A84C]">72</div>
                 <div className="text-sm text-text-secondary mb-2">out of 100</div>
                 <div className="text-base font-bold text-[#C9A84C]">Good</div>
               </div>
               
               <p className="text-xs text-text-secondary leading-relaxed font-medium">
                 {stock.name}'s balance sheet is broadly healthy — strong capital, excellent liquidity, and above-average equity ratios. The only watch item is NPL, which is still below the CBN threshold.
               </p>
            </div>

            {/* Health Scorecard */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">HEALTH SCORECARD</div>
               
               <div className="space-y-5 text-sm">
                 <div className="flex justify-between items-center">
                   <span className="text-text-secondary font-medium">Capital Adequacy</span>
                   <span className="text-[#22C55E] font-bold text-xs bg-[#22C55E]/10 px-2 py-0.5 rounded">21.6%</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-text-secondary font-medium">Liquidity Ratio</span>
                   <span className="text-[#22C55E] font-bold text-xs bg-[#22C55E]/10 px-2 py-0.5 rounded">52.4%</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-text-secondary font-medium">NPL Ratio</span>
                   <span className="text-[#C9A84C] font-bold text-xs bg-[#C9A84C]/10 px-2 py-0.5 rounded">4.4%</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-text-secondary font-medium">Loan-to-Deposit</span>
                   <span className="text-[#C9A84C] font-bold text-xs bg-[#C9A84C]/10 px-2 py-0.5 rounded">45.4%</span>
                 </div>
                 <div className="flex justify-between items-center">
                   <span className="text-text-secondary font-medium">Recapitalisation</span>
                   <span className="text-[#22C55E] font-bold text-[10px] uppercase bg-[#22C55E]/10 px-2 py-0.5 rounded">On Track</span>
                 </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'earnings':
        return renderEarnings();
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
      case 'health':
        return renderHealth();
      default:
        return renderOverview();
    }
  };

  // 1. Overview Content
  const renderOverview = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        {/* Main Area */}
        <div className="md:col-span-2 space-y-5">
          {/* Top Info Banner - Current Price */}
          <div className="p-6 rounded-3xl flex flex-wrap items-center justify-between" style={cardStyle}>
            <div>
              <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
                Current Price
              </span>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-extrabold text-text-primary font-sora tracking-tight"
                  style={{ textShadow: isPositive ? `0 0 20px ${color}30` : 'none' }}>
                  ₦{stock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </span>
                <span className={`inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg ${isPositive ? 'bg-gain/10 text-gain border border-gain/20' : 'bg-danger/10 text-danger border-danger/20'}`}>
                  {isPositive ? '+' : ''}{stock.change.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="flex gap-8">
              <div>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">Daily Move</span>
                <span className={`text-sm font-extrabold font-sora ${isPositive ? 'text-gain' : 'text-danger'}`}>
                  {isPositive ? '+' : ''}₦{stock.changeAmount.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">Volume</span>
                <span className="text-sm font-extrabold font-sora text-text-primary">{stock.volume}</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart — Premium Redesign */}
          <div className="rounded-3xl overflow-hidden border border-brand-primary/15 shadow-[0_0_40px_rgba(0,0,0,0.6),0_0_1px_rgba(207,163,67,0.1)]" style={{ background: 'linear-gradient(160deg, #141020 0%, #0A0810 100%)' }}>
            
            {/* Chart Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-4 rounded-full" style={{ background: color }} />
                <span className="text-[11px] font-extrabold text-text-primary uppercase tracking-widest font-dm-sans">
                  Price Chart
                </span>
              </div>
              {/* Time Range Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {(['1D', '1W', '1M', '3M', '1Y'] as const).map((d) => (
                  <button key={d} onClick={() => setActiveDuration(d)}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-extrabold font-dm-sans transition-all duration-200 focus:outline-none"
                    style={activeDuration === d
                      ? { background: color, color: '#0E0B14', boxShadow: `0 0 12px ${color}60` }
                      : { color: 'rgba(255,255,255,0.35)' }}>
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Body */}
            <div className="relative h-[220px] px-4">
              {/* Grid lines */}
              <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                {[0.25, 0.5, 0.75].map((t, i) => (
                  <line key={i}
                    x1="0" y1={`${t * 100}%`}
                    x2="100%" y2={`${t * 100}%`}
                    stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 4"
                  />
                ))}
              </svg>

              {/* Tooltip */}
              {hoveredPoint && (
                <div className="absolute top-3 left-6 rounded-2xl px-3 py-2.5 shadow-2xl z-20 text-[10px] space-y-1 pointer-events-none"
                  style={{ background: 'rgba(14,11,20,0.96)', border: `1px solid ${color}30`, backdropFilter: 'blur(12px)' }}>
                  <div className="text-text-secondary font-medium">{hoveredPoint.date}</div>
                  <div className="font-extrabold text-[13px]" style={{ color }}>
                    ₦{hoveredPoint.price.toLocaleString('en-NG')}
                  </div>
                  <div className="text-text-secondary">Vol: <span className="font-bold text-text-primary">{(hoveredPoint.volume / 1000).toFixed(0)}k</span></div>
                </div>
              )}

              <svg ref={chartRef} viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full cursor-crosshair"
                onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
                <defs>
                  <linearGradient id="chartAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.22" />
                    <stop offset="85%" stopColor={color} stopOpacity="0.02" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </linearGradient>
                  <filter id="chart-glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                    <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                </defs>

                {points.map((p, idx) => {
                  const maxVol = Math.max(...points.map((pt) => pt.volume));
                  const volH = (p.volume / maxVol) * 24;
                  return (
                    <rect key={idx} x={p.x - 2} y={chartHeight - paddingY - volH}
                      width="4" height={volH}
                      fill={color} opacity="0.07" rx="2" />
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
                      stroke={color} strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
                    <circle cx={hoverX} cy={hoverY} r="8" fill={color} opacity="0.12" />
                    <circle cx={hoverX} cy={hoverY} r="4.5" fill={color} stroke="#0A0810" strokeWidth="2.5" />
                  </>
                )}
              </svg>
            </div>

            {/* Date Labels */}
            <div className="flex items-center justify-between text-[9px] text-text-muted font-bold uppercase tracking-wider font-dm-sans px-5 pb-4 pt-1">
              <span>{chartPoints[0]?.date}</span>
              <span className="text-text-secondary">₦{minPrice.toLocaleString()} – ₦{maxPrice.toLocaleString()}</span>
              <span>{chartPoints[chartPoints.length - 1]?.date}</span>
            </div>

            {/* 52-Week Range — Premium */}
            <div className="px-5 pb-5 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-text-muted">52-Week Range</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md" style={{ color, background: `${color}15`, border: `1px solid ${color}30` }}>65% of range</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold text-text-secondary mb-2.5">
                <span className="flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-text-muted inline-block"/>₦{(stock.price * 0.7).toFixed(2)} Low</span>
                <span className="flex items-center gap-1">₦{(stock.price * 1.4).toFixed(2)} High<span className="w-1 h-1 rounded-full bg-text-muted inline-block"/></span>
              </div>
              {/* Track */}
              <div className="relative h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {/* Filled portion */}
                <div className="absolute left-0 top-0 h-full rounded-full" style={{ width: '65%', background: `linear-gradient(90deg, rgba(${color === '#10B981' ? '16,185,129' : '207,163,67'},0.2), ${color})` }} />
                {/* Thumb */}
                <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full shadow-lg" style={{ left: 'calc(65% - 8px)', background: '#fff', border: `2.5px solid ${color}`, boxShadow: `0 0 10px ${color}80` }} />
              </div>
              <div className="text-center text-[10px] text-text-muted mt-2.5">
                Current <span className="text-text-secondary font-bold">₦{stock.price.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <SevenPillarsSection ticker={stock.ticker} />
          

        </div>

        {/* Sidebar details */}
        <div className="space-y-5">
          {/* Score Ring Card */}
          <div className="p-5 rounded-3xl text-center relative overflow-hidden" style={cardStyle}>
            <div className="text-[10px] font-bold text-text-secondary uppercase tracking-widest font-dm-sans mb-3">EquityStack Score</div>
            <div className="relative w-[140px] h-[140px] mx-auto mb-3">
              <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#CFA343"/><stop offset="100%" stopColor={color}/></linearGradient></defs>
                <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12"/>
                <circle cx="70" cy="70" r="58" fill="none" stroke="url(#rg)" strokeWidth="12" strokeDasharray="266.4 97.6" strokeLinecap="round"/>
              </svg>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <div className="font-sora text-4xl font-extrabold" style={{ color }}>74</div>
                <div className="text-[9px] text-text-secondary font-medium">out of 100</div>
              </div>
            </div>
            <div className="font-sora text-xl font-extrabold mb-1" style={{ color }}>{isPositive ? 'BULLISH' : 'NEUTRAL'}</div>
            <div className="text-[11px] text-text-secondary leading-relaxed">
              Strong fundamentals and attractive valuation. {stock.ticker} appears undervalued relative to earnings power.
            </div>
          </div>

          {/* AI Insight */}
          <div className="p-5 rounded-3xl space-y-3 relative overflow-hidden border border-brand-primary/12"
            style={{ background: 'linear-gradient(180deg, #141020 0%, #0A0810 100%)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)' }} />
            <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.08) 0%, transparent 70%)' }} />

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
                {stock.ticker} is trading at ₦{stock.price.toFixed(2)}. It recently moved by {stock.change}%. This stock is in the {stock.sector} sector, representing a key part of Nigeria's business landscape.
              </p>
            </div>
            <div className="pt-2 border-t border-border/40 text-[9px] text-text-secondary font-medium font-dm-sans relative z-10">
              This information is for educational and research purposes only and should not be considered financial advice.
            </div>
          </div>

        </div>
      </div>
    );
  };

  // 2. Financials Content
  const renderFinancials = () => {
    return (
      <div className="space-y-6">
        {/* Top Row: Income Statement, Profitability Score & Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income Statement */}
          <div className="lg:col-span-2 p-6 rounded-3xl" style={cardStyle}>
            <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">INCOME STATEMENT</div>
            <h3 className="text-base font-serif font-bold text-text-primary mb-2">Revenue & Profit — 5-Year View</h3>
            <p className="text-sm text-text-secondary mb-6">All figures in Nigerian Naira (₦). FY2024 data from audited annual report.</p>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm font-dm-sans min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#1E3A5F]/50 text-[#8FA3C0] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3">METRIC</th>
                    <th className="py-3 text-right">FY2020</th>
                    <th className="py-3 text-right">FY2021</th>
                    <th className="py-3 text-right">FY2022</th>
                    <th className="py-3 text-right">FY2023</th>
                    <th className="py-3 text-right">FY2024</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]/30 text-text-primary">
                  {[
                    { metric: 'Gross Earnings', years: ['₦696B', '₦765B', '₦946B', '₦1.76T', '₦3.97T'] },
                    { metric: 'Net Interest Income', years: ['₦318B', '₦342B', '₦434B', '₦892B', '₦2.01T'] },
                    { metric: 'Non-Interest Income', years: ['₦193B', '₦212B', '₦280B', '₦620B', '₦1.31T'] },
                    { metric: 'Operating Expenses', years: ['₦221B', '₦241B', '₦295B', '₦548B', '₦962B'], lastColor: '#C9A84C' },
                    { metric: 'Profit Before Tax', years: ['₦255B', '₦280B', '₦343B', '₦796B', '₦1.33T'] },
                    { metric: 'Profit After Tax', years: ['₦230B', '₦255B', '₦284B', '₦676B', '₦1.03T'] },
                    { metric: 'EPS (₦)', years: ['₦7.34', '₦8.12', '₦9.04', '₦21.55', '₦32.83'] },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 font-medium text-text-secondary">{row.metric}</td>
                      {row.years.map((val, j) => (
                        <td key={j} className="py-4 text-right font-bold" style={{ color: j === 4 ? (row.lastColor || '#22C55E') : undefined }}>{val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Profitability Score */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">PROFITABILITY SCORE</div>
               <div className="text-center mt-4">
                 <div className="text-6xl font-serif font-bold text-[#22C55E] mb-2">85</div>
                 <div className="text-sm text-text-secondary mb-1">out of 100</div>
                 <div className="text-base font-bold text-[#22C55E] mt-2">Exceptional</div>
               </div>
               <p className="text-sm text-text-secondary mt-8 leading-relaxed">
                 {stock.name}'s ROE of 34.7% is the highest among Tier-1 NGX banks. Its first-ever ₦1 trillion PAT makes it a landmark earnings story.
               </p>
            </div>
            
            {/* Revenue Breakdown */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">REVENUE BREAKDOWN</div>
               <p className="text-sm text-text-secondary mb-6">FY2024 income composition</p>
               
               <div className="space-y-5">
                  {[
                    { label: 'Net Interest Income', val: '₦2.01T', pct: '51%', color: '#22C55E' },
                    { label: 'Non-Interest Income', val: '₦1.31T', pct: '33%', color: '#C9A84C' },
                    { label: 'Other Income', val: '₦650B', pct: '16%', color: '#EF4444' },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-center text-sm mb-2">
                        <span className="text-text-secondary font-medium">{item.label}</span>
                        <div className="font-bold text-text-primary">
                           {item.val} <span className="text-text-secondary font-normal mx-1">·</span> {item.pct}
                        </div>
                      </div>
                      <div className="h-2 w-full bg-[#112240] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: item.pct, backgroundColor: item.color }} />
                      </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        {/* Middle Row: Balance Sheet */}
        <div className="p-6 rounded-3xl" style={cardStyle}>
          <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">BALANCE SHEET</div>
          <h3 className="text-base font-serif font-bold text-text-primary mb-6">Assets, Liabilities & Capital</h3>
          
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm font-dm-sans min-w-[500px]">
              <thead>
                <tr className="border-b border-[#1E3A5F]/50 text-[#8FA3C0] font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3">METRIC</th>
                  <th className="py-3 text-right">FY2022</th>
                  <th className="py-3 text-right">FY2023</th>
                  <th className="py-3 text-right">FY2024</th>
                  <th className="py-3 text-right">CHANGE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E3A5F]/30 text-text-primary">
                {[
                  { metric: 'Total Assets', y22: '₦12.3T', y23: '₦16.4T', y24: '₦28.4T', change: '+73%' },
                  { metric: 'Customer Deposits', y22: '₦7.1T', y23: '₦12.2T', y24: '₦21.6T', change: '+77%' },
                  { metric: 'Net Loans & Advances', y22: '₦4.2T', y23: '₦5.7T', y24: '₦9.8T', change: '+72%' },
                  { metric: "Shareholders' Equity", y22: '₦1.04T', y23: '₦1.72T', y24: '₦2.97T', change: '+73%' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-medium text-text-secondary">{row.metric}</td>
                    <td className="py-4 text-right font-bold">{row.y22}</td>
                    <td className="py-4 text-right font-bold">{row.y23}</td>
                    <td className="py-4 text-right font-bold text-[#22C55E]">{row.y24}</td>
                    <td className="py-4 text-right font-bold text-[#22C55E]">{row.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Row: Profitability Ratios */}
        <div className="p-6 rounded-3xl" style={cardStyle}>
          <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">PROFITABILITY RATIOS</div>
          <h3 className="text-base font-serif font-bold text-text-primary mb-6">How efficiently does {stock.ticker.toLowerCase().replace(/^\w/, c => c.toUpperCase())} earn?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[
               { label: 'RETURN ON EQUITY', val: '34.7%', desc: 'Sector avg: 25.8%', color: '#22C55E' },
               { label: 'RETURN ON ASSETS', val: '3.6%', desc: 'Sector avg: 2.4%', color: '#22C55E' },
               { label: 'NET INTEREST MARGIN', val: '9.8%', desc: 'Expanded from 7.2%', color: '#22C55E' },
               { label: 'COST-TO-INCOME', val: '38.2%', desc: 'Improved from 41%', color: '#C9A84C' },
               { label: 'NET PROFIT MARGIN', val: '25.9%', desc: 'FY2024', color: '#22C55E' },
               { label: 'EBITDA MARGIN', val: '41.2%', desc: 'FY2024', color: '#22C55E' },
             ].map((ratio, i) => (
               <div key={i} className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                 <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">{ratio.label}</div>
                 <div className="text-3xl font-bold font-sora mb-2" style={{ color: ratio.color }}>{ratio.val}</div>
                 <div className="text-sm text-text-secondary">{ratio.desc}</div>
               </div>
             ))}
          </div>
        </div>
      </div>
    );
  };

  // 3. Dividend Content
  const renderDividend = () => {
    const yieldPct = parseFloat(stock.dividendYield) || 5.0;
    const currentDps = stock.price * (yieldPct / 100);
    const eps = stock.eps || currentDps * 2; 
    const payoutRatio = (currentDps / eps) * 100;
    const cover = eps / currentDps;

    const history = [
      { year: '2020', interim: currentDps * 0.1, final: currentDps * 0.55, total: currentDps * 0.65, yield: yieldPct * 0.8 },
      { year: '2021', interim: currentDps * 0.12, final: currentDps * 0.58, total: currentDps * 0.70, yield: yieldPct * 0.6 },
      { year: '2022', interim: currentDps * 0.12, final: currentDps * 0.65, total: currentDps * 0.77, yield: yieldPct * 0.5 },
      { year: '2023', interim: currentDps * 0.15, final: currentDps * 0.72, total: currentDps * 0.87, yield: yieldPct * 0.75 },
      { year: '2024', interim: currentDps * 0.25, final: currentDps * 0.75, total: currentDps, yield: yieldPct },
    ];
    const chartData = history.map(h => ({ year: h.year, val: h.total, type: h.year === '2024' ? 'current' : 'past' }));
    
    const dps3yAgo = history[1].total;
    const dpsGrowth = ((currentDps / dps3yAgo) - 1) * 100;

    const score = yieldPct >= 8 ? 85 : yieldPct >= 6 ? 75 : yieldPct >= 4 ? 65 : 45;
    const scoreText = score >= 80 ? 'Excellent' : score >= 70 ? 'Strong' : score >= 60 ? 'Good' : 'Fair';
    const scoreColor = score >= 70 ? '#22C55E' : score >= 60 ? '#C9A84C' : '#EF4444';

    return (
      <div className="space-y-6">
        
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl" style={cardStyle}>
              <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">PILLAR 05 · DIVIDEND STRENGTH</div>
              <h3 className="text-base font-serif font-bold text-text-primary mb-2">Dividend History & Yield</h3>
              <p className="text-sm text-text-secondary mb-10">{stock.name} has one of the most consistent dividend track records on the NGX</p>
              
              <div className="h-[200px] mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }} barSize={60}>
                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8FA3C0', fontWeight: 'bold' }} dy={10} />
                    <Tooltip 
                      cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                      contentStyle={{ backgroundColor: '#112240', border: '1px solid #1E3A5F', borderRadius: '8px' }}
                      itemStyle={{ color: '#F0F4FF', fontWeight: 'bold' }}
                      formatter={(val: any) => [`₦${Number(val).toFixed(2)}`, 'Total DPS']}
                      labelStyle={{ color: '#8FA3C0', marginBottom: '4px' }}
                    />
                    <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.type === 'current' ? '#D4AF37' : 'rgba(201,168,76,0.3)'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center text-[10px] text-text-secondary font-medium mb-8">
                Total DPS · 5-year history · All years paid as declared
              </div>

              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left text-sm font-dm-sans min-w-[500px]">
                  <thead>
                    <tr className="border-b border-[#1E3A5F]/50 text-[#8FA3C0] font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3">YEAR</th>
                      <th className="py-3 text-right">INTERIM (₦)</th>
                      <th className="py-3 text-right">FINAL (₦)</th>
                      <th className="py-3 text-right">TOTAL DPS</th>
                      <th className="py-3 text-right">YIELD</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E3A5F]/30 text-text-primary">
                    {history.slice().reverse().map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-medium text-text-secondary">FY{row.year}</td>
                        <td className="py-4 text-right font-bold">₦{row.interim.toFixed(2)}</td>
                        <td className="py-4 text-right font-bold" style={{ color: row.year === '2024' ? '#C9A84C' : 'inherit' }}>
                          ₦{row.final.toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-bold" style={{ color: row.year === '2024' ? '#C9A84C' : 'inherit' }}>
                          ₦{row.total.toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-bold" style={{ color: row.year === '2024' ? '#22C55E' : '#8FA3C0' }}>
                          {row.yield.toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            {/* Score Card */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">DIVIDEND SCORE</div>
               <div className="text-center mt-4 mb-8">
                 <div className="text-6xl font-serif font-bold mb-2" style={{ color: scoreColor }}>{score}</div>
                 <div className="text-sm text-text-secondary mb-1">out of 100</div>
                 <div className="text-base font-bold mt-2" style={{ color: scoreColor }}>{scoreText}</div>
               </div>
               <p className="text-sm text-text-secondary leading-relaxed">
                 {stock.name}'s {yieldPct.toFixed(1)}% yield is highly competitive for NGX {stock.sector.toLowerCase()} stocks. With a payout ratio of just {payoutRatio.toFixed(1)}%, dividends are highly sustainable and have room to grow significantly.
               </p>
            </div>

            {/* Note Card */}
            <div className="p-5 rounded-2xl border border-[#C9A84C]/30 bg-[#C9A84C]/5 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-1 h-full bg-[#C9A84C]" />
               <div className="flex gap-3">
                 <div className="text-xl">💡</div>
                 <div>
                   <span className="text-[#C9A84C] font-bold text-sm">Income Investor Note:</span>
                   <span className="text-text-secondary text-sm ml-1">At current price, {stock.ticker} offers a compelling {yieldPct.toFixed(1)}% dividend yield — higher than most NGX fixed income alternatives on a risk-adjusted basis.</span>
                 </div>
               </div>
            </div>
            
            {/* Consistency Card */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">6-YEAR CONSISTENCY</div>
               <div className="text-sm text-text-primary font-medium mb-6">Dividends paid every year since 2019</div>
               
               <div className="flex justify-between items-center px-2">
                 {['2019', '2020', '2021', '2022', '2023', '2024'].map((yr, i) => (
                   <div key={i} className="flex flex-col items-center gap-2">
                     <div className="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center text-[#0B1628] font-bold">✓</div>
                     <div className="text-[9px] text-text-secondary font-medium">{yr}</div>
                   </div>
                 ))}
               </div>
            </div>

          </div>
          
        </div>

        {/* Bottom Section */}
        <div className="p-6 rounded-3xl mt-6" style={cardStyle}>
           <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">DIVIDEND METRICS DEEP DIVE</div>
           <h3 className="text-base font-serif font-bold text-text-primary mb-8">Yield, payout ratio & sustainability</h3>
           
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {/* 6 Metric Cards */}
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">DIVIDEND YIELD</div>
                <div className="text-3xl font-bold font-sora text-[#22C55E] mb-1">{yieldPct.toFixed(1)}%</div>
                <div className="text-sm text-text-secondary">vs NGX {stock.sector.toLowerCase()} avg {(yieldPct * 0.75).toFixed(1)}%</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">PAYOUT RATIO</div>
                <div className="text-3xl font-bold font-sora text-[#22C55E] mb-1">{payoutRatio.toFixed(1)}%</div>
                <div className="text-sm text-text-secondary">{payoutRatio < 40 ? 'Very sustainable' : payoutRatio < 60 ? 'Sustainable' : 'High payout'}</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">DPS GROWTH (3Y)</div>
                <div className="text-3xl font-bold font-sora text-[#22C55E] mb-1">{dpsGrowth.toFixed(0)}%</div>
                <div className="text-sm text-text-secondary">₦{dps3yAgo.toFixed(2)} → ₦{currentDps.toFixed(2)}</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">DIVIDEND COVER</div>
                <div className="text-3xl font-bold font-sora text-[#22C55E] mb-1">{cover.toFixed(1)}x</div>
                <div className="text-sm text-text-secondary">Earnings vs dividend</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">EX-DIV DATE</div>
                <div className="text-2xl font-bold font-sora text-text-primary mb-1 mt-2">May 2025</div>
                <div className="text-sm text-text-secondary">FY2024 final</div>
             </div>
             
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-3">PAYMENT DATE</div>
                <div className="text-2xl font-bold font-sora text-text-primary mb-1 mt-2">Jun 2025</div>
                <div className="text-sm text-text-secondary">FY2024 final</div>
             </div>
             
           </div>
        </div>

      </div>
    );
  };

  // 4. Valuation Content
  const renderValuation = () => {
    return (
      <div className="space-y-6">
        
        {/* Top Row: Multiples & Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Multiples (Is ZENITHBANK cheap or expensive?) */}
          <div className="lg:col-span-2 p-6 rounded-3xl" style={cardStyle}>
            <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">PILLAR 01 · VALUATION</div>
            <h3 className="text-base font-serif font-bold text-text-primary mb-2">Is {stock.ticker} cheap or expensive?</h3>
            <p className="text-sm text-text-secondary mb-8">EquityStack compares each multiple against the NGX {stock.sector.toLowerCase()} sector average and {stock.name}'s own 5-year history.</p>
            
            <div className="space-y-5">
               {[
                 { label: 'P/E Ratio', value: stock.peRatio < 0 ? 'N/A' : `${stock.peRatio}x`, pct: '75%', rating: 'CHEAP', rColor: '#22C55E' },
                 { label: 'P/B Ratio', value: `${stock.pbRatio}x`, pct: '70%', rating: 'CHEAP', rColor: '#22C55E' },
                 { label: 'EV / EBITDA', value: '2.4x', pct: '45%', rating: 'FAIR', rColor: '#C9A84C' },
                 { label: 'EV / Sales', value: '0.91x', pct: '40%', rating: 'FAIR', rColor: '#C9A84C' },
                 { label: 'Price / Cash Flow', value: '2.9x', pct: '60%', rating: 'CHEAP', rColor: '#22C55E' },
                 { label: 'Price / Tang. Book', value: '0.82x', pct: '65%', rating: 'CHEAP', rColor: '#22C55E' },
               ].map((metric, i) => (
                 <div key={i} className="flex items-center justify-between group border-b border-border/20 pb-3 last:border-0 last:pb-0">
                   <div className="w-[140px] text-sm text-text-secondary group-hover:text-text-primary transition-colors flex items-center gap-1.5">
                     {metric.label} <span className="text-[10px] opacity-50 cursor-help">ⓘ</span>
                   </div>
                   <div className="flex-1 px-4 lg:px-8">
                     <div className="h-2 w-full bg-[#112240] rounded-full overflow-hidden">
                       <div className="h-full rounded-full" style={{ width: metric.pct, backgroundColor: metric.rColor }} />
                     </div>
                   </div>
                   <div className="w-[50px] text-right text-sm font-bold text-text-secondary">{metric.value}</div>
                   <div className="w-[80px] text-right">
                      <span className="px-3 py-1 text-[10px] font-bold rounded"
                        style={{ backgroundColor: `${metric.rColor}1A`, color: metric.rColor }}>
                        {metric.rating}
                      </span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
          
          {/* Valuation Score */}
          <div className="p-6 rounded-3xl flex flex-col justify-between" style={cardStyle}>
             <div>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">VALUATION SCORE</div>
               <div className="text-center mt-4">
                 <div className="text-6xl font-serif font-bold text-[#22C55E] mb-2">78</div>
                 <div className="text-sm text-text-secondary mb-1">out of 100</div>
                 <div className="text-base font-bold text-[#22C55E] mt-2">Strong Value</div>
               </div>
             </div>
             <p className="text-sm text-text-secondary mt-8 leading-relaxed">
               {stock.name} is trading at a meaningful discount to Nigerian {stock.sector.toLowerCase()} peers on most multiples. At {stock.peRatio}x earnings, it's one of the cheapest large-cap stocks on the NGX.
             </p>
          </div>
        </div>

        {/* Middle Row: Sector Comparison & Historical P/E */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sector Comparison Table */}
          <div className="lg:col-span-2 p-6 rounded-3xl" style={cardStyle}>
            <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">SECTOR COMPARISON</div>
            <h3 className="text-base font-serif font-bold text-text-primary mb-2">{stock.ticker} vs NGX {stock.sector.split(' ')[0]} Peers</h3>
            <p className="text-sm text-text-secondary mb-6">How {stock.name}'s multiples stack up against the largest NGX {stock.sector.toLowerCase()} by market cap.</p>
            
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-sm font-dm-sans min-w-[500px]">
                <thead>
                  <tr className="border-b border-[#1E3A5F]/50 text-[#8FA3C0] font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3">BANK</th>
                    <th className="py-3 text-right">P/E</th>
                    <th className="py-3 text-right">P/B</th>
                    <th className="py-3 text-right">DIV YIELD</th>
                    <th className="py-3 text-right">ROE</th>
                    <th className="py-3 text-right">RATING</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E3A5F]/30">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-[#C9A84C] flex items-center gap-1.5 uppercase">
                      {stock.ticker} <Star className="w-3 h-3 fill-current" />
                    </td>
                    <td className="py-4 text-right font-bold text-[#22C55E]">{stock.peRatio < 0 ? 'N/A' : `${stock.peRatio}x`}</td>
                    <td className="py-4 text-right font-bold text-[#22C55E]">{stock.pbRatio}x</td>
                    <td className="py-4 text-right font-bold text-[#22C55E]">{stock.dividendYield}</td>
                    <td className="py-4 text-right font-bold text-[#22C55E]">34.7%</td>
                    <td className="py-4 text-right">
                      <span className="px-2.5 py-1 bg-[#22C55E]/10 text-[#22C55E] text-[10px] font-bold uppercase rounded border border-[#22C55E]/20">BULLISH</span>
                    </td>
                  </tr>
                  {[
                    { bank: 'GTCO', pe: '4.1x', pb: '1.12x', div: '6.2%', roe: '28.4%', rating: 'BULLISH', rColor: '#22C55E' },
                    { bank: 'ACCESS CORP', pe: '2.8x', pb: '0.51x', div: '5.1%', roe: '22.1%', rating: 'NEUTRAL', rColor: '#C9A84C' },
                    { bank: 'UBA', pe: '3.5x', pb: '0.68x', div: '5.8%', roe: '25.3%', rating: 'BULLISH', rColor: '#22C55E' },
                    { bank: 'FBNH', pe: '5.2x', pb: '0.92x', div: '3.4%', roe: '18.6%', rating: 'NEUTRAL', rColor: '#C9A84C' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors text-text-primary">
                      <td className="py-4 font-medium text-text-secondary">{row.bank}</td>
                      <td className="py-4 text-right font-medium">{row.pe}</td>
                      <td className="py-4 text-right font-medium">{row.pb}</td>
                      <td className="py-4 text-right font-medium">{row.div}</td>
                      <td className="py-4 text-right font-medium">{row.roe}</td>
                      <td className="py-4 text-right">
                         <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded border"
                           style={{ backgroundColor: `${row.rColor}1A`, color: row.rColor, borderColor: `${row.rColor}33` }}>
                           {row.rating}
                         </span>
                      </td>
                    </tr>
                  ))}
                  <tr className="text-text-secondary italic">
                     <td className="py-4 font-medium">NGX Avg</td>
                     <td className="py-4 text-right">3.8x</td>
                     <td className="py-4 text-right">0.79x</td>
                     <td className="py-4 text-right">5.7%</td>
                     <td className="py-4 text-right">25.8%</td>
                     <td className="py-4 text-right">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Historical P/E */}
          <div className="p-6 rounded-3xl" style={cardStyle}>
             <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">HISTORICAL P/E</div>
             <p className="text-sm text-text-secondary mb-6">P/E ratio over 5 years — lower is cheaper</p>
             
             <div className="space-y-4 mb-8">
                {[
                  { year: 'FY2020', val: '6.1x' },
                  { year: 'FY2021', val: '5.4x' },
                  { year: 'FY2022', val: '4.8x' },
                  { year: 'FY2023', val: '4.0x' },
                  { year: 'FY2024', val: stock.peRatio < 0 ? 'N/A' : `${stock.peRatio}x` },
                ].map((item, i) => (
                   <div key={i} className="flex justify-between items-center text-sm border-b border-border/10 pb-2 last:border-0">
                     <span className="text-text-secondary font-medium">{item.year}</span>
                     <span className="font-bold" style={{ color: i === 4 ? '#22C55E' : '#C9A84C' }}>{item.val}</span>
                   </div>
                ))}
             </div>
             
             <p className="text-sm text-text-secondary leading-relaxed bg-[#112240]/50 p-4 rounded-xl border border-border/20">
                P/E has consistently compressed as earnings growth outpaces price appreciation — a classic value signal.
             </p>
          </div>
        </div>

        {/* Bottom Row: Fair Value */}
        <div className="p-6 rounded-3xl" style={cardStyle}>
          <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">FAIR VALUE ESTIMATE</div>
          <h3 className="text-base font-serif font-bold text-text-primary mb-2">What EquityStack thinks it's worth</h3>
          <p className="text-sm text-text-secondary mb-8">Derived from a blended DCF and peer multiple model, calibrated to NGX market conditions</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-2">FAIR VALUE ESTIMATE</div>
                <div className="text-4xl font-bold font-sora text-[#C9A84C] mb-1">₦{stock.targetPrice.toFixed(2)}</div>
                <div className="text-sm text-text-secondary">Intrinsic value (blended model)</div>
             </div>
             <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20">
                <div className="text-[10px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-2">CURRENT PRICE</div>
                <div className="text-4xl font-bold font-sora text-text-primary mb-2">₦{stock.price.toFixed(2)}</div>
                <div className={`text-sm font-bold ${stock.price < stock.targetPrice ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                  {stock.price < stock.targetPrice ? '▼' : '▲'} {Math.abs(((stock.targetPrice - stock.price)/stock.targetPrice)*100).toFixed(1)}% {stock.price < stock.targetPrice ? 'below estimate' : 'above estimate'}
                </div>
             </div>
          </div>
          
          <div className="p-5 rounded-xl bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/30 flex items-start gap-4">
             <span className="text-xl shrink-0">💡</span>
             <p className="text-sm text-text-secondary leading-relaxed">
               {stock.name}'s strong fundamentals justify a <strong className="text-[#C9A84C]">premium to fair value</strong>, but the gap is worth monitoring. The market may be pricing in continued earnings growth above consensus forecasts.
             </p>
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
    const competitors = stocks.filter(s => s.sector === stock.sector && s.ticker !== stock.ticker);
    const compList = competitors.length > 0 ? competitors : stocks.filter(s => s.ticker !== stock.ticker).slice(0, 3);

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
    const total = relatedNews.length || 1;
    const posCount = relatedNews.filter(n => n.marketImpact === 'Positive').length;
    const neuCount = relatedNews.filter(n => n.marketImpact === 'Neutral').length;
    const negCount = relatedNews.filter(n => n.marketImpact === 'Negative').length;

    const posPct = Math.round((posCount / total) * 100);
    const neuPct = Math.round((neuCount / total) * 100);
    const negPct = Math.round((negCount / total) * 100);

    const mainSentiment = posPct >= 40 ? 'Mostly Positive' : negPct >= 40 ? 'Mostly Negative' : 'Mixed Sentiment';
    const mainColor = posPct >= 40 ? '#22C55E' : negPct >= 40 ? '#EF4444' : '#8FA3C0';

    return (
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: News List */}
          <div className="lg:col-span-2 p-6 rounded-3xl" style={cardStyle}>
             <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-3">LATEST NEWS & DEVELOPMENTS</div>
             <h3 className="text-base font-serif font-bold text-text-primary mb-2">{stock.ticker} in the news</h3>
             <p className="text-sm text-text-secondary mb-8">Recent stories and announcements relevant to investors</p>
             
             {relatedNews.length > 0 ? (
               <ul className="divide-y divide-[#1E3A5F]/30">
                 {relatedNews.map((news) => {
                   const isPos = news.marketImpact === 'Positive';
                   const isNeg = news.marketImpact === 'Negative';
                   const dot = isPos ? '#22C55E' : isNeg ? '#EF4444' : '#C9A84C';
                   
                   return (
                     <li key={news.id} className="py-5 flex items-start gap-3">
                       <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: dot }} />
                       <div>
                         <h4 className="text-sm font-bold text-text-primary mb-2">{news.originalHeadline}</h4>
                         <div className="flex items-center gap-2 text-[10px] text-text-secondary font-medium font-dm-sans">
                           <span>{news.timeAgo} · {news.source}</span>
                           <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider"
                             style={{ color: dot, backgroundColor: `${dot}15` }}>
                             {news.marketImpact}
                           </span>
                         </div>
                       </div>
                     </li>
                   );
                 })}
               </ul>
             ) : (
               <div className="py-10 text-center text-sm text-text-secondary">No recent news found for {stock.ticker}.</div>
             )}
          </div>

          {/* Right Column: Sentiment & Events */}
          <div className="space-y-6">
            
            {/* Sentiment Card */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">NEWS SENTIMENT</div>
               
               <div className="text-center mb-8">
                 <div className="text-3xl font-serif font-bold mb-2" style={{ color: mainColor }}>{mainSentiment}</div>
                 <div className="text-[10px] text-text-secondary">Based on last 30 days</div>
               </div>
               
               <div className="space-y-4">
                 {/* Positive */}
                 <div>
                   <div className="flex justify-between text-[11px] font-bold mb-2">
                     <span className="text-text-secondary">Positive</span>
                     <span className="text-[#22C55E]">{posPct}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-[#112240] rounded-full overflow-hidden">
                     <div className="h-full bg-[#22C55E] rounded-full" style={{ width: `${posPct}%` }} />
                   </div>
                 </div>
                 {/* Neutral */}
                 <div>
                   <div className="flex justify-between text-[11px] font-bold mb-2">
                     <span className="text-text-secondary">Neutral</span>
                     <span className="text-[#8FA3C0]">{neuPct}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-[#112240] rounded-full overflow-hidden">
                     <div className="h-full bg-[#8FA3C0] rounded-full" style={{ width: `${neuPct}%` }} />
                   </div>
                 </div>
                 {/* Negative */}
                 <div>
                   <div className="flex justify-between text-[11px] font-bold mb-2">
                     <span className="text-text-secondary">Negative</span>
                     <span className="text-[#EF4444]">{negPct}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-[#112240] rounded-full overflow-hidden">
                     <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${negPct}%` }} />
                   </div>
                 </div>
               </div>
            </div>

            {/* Key Events Card */}
            <div className="p-6 rounded-3xl" style={cardStyle}>
               <div className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-widest font-dm-sans mb-6">KEY EVENTS AHEAD</div>
               
               <div className="space-y-5">
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#C9A84C]" />
                    <div className="text-xs font-bold text-text-primary mb-1">Rights Issue / Capital Raise</div>
                    <div className="text-[10px] text-text-secondary">Q3 2025 · NGX regulatory requirement</div>
                  </div>
                  
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#22C55E]" />
                    <div className="text-xs font-bold text-text-primary mb-1">H1 2025 Results</div>
                    <div className="text-[10px] text-text-secondary">August 2025 · EPS est. ₦{stock.eps ? (stock.eps * 0.55).toFixed(2) : '19.25'}</div>
                  </div>
                  
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#8FA3C0]" />
                    <div className="text-xs font-bold text-text-primary mb-1">Interim Dividend</div>
                    <div className="text-[10px] text-text-secondary">Q4 2025 · Decision pending results</div>
                  </div>
                  
                  <div className="relative pl-4">
                    <div className="absolute left-0 top-1 bottom-1 w-[2px] bg-[#22C55E]" />
                    <div className="text-xs font-bold text-text-primary mb-1">CBN Recapitalisation Deadline</div>
                    <div className="text-[10px] text-text-secondary">March 2026 · {stock.ticker} on track</div>
                  </div>
               </div>
            </div>

          </div>
        </div>

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
          className={`flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all focus:outline-none ${isWatched
              ? 'bg-warning/10 border-warning/25 text-warning'
              : 'text-text-secondary hover:text-text-primary border-border hover:border-border-bright'
            }`}
          style={!isWatched ? { background: 'rgba(14,13,37,0.5)' } : {}}>
          <Star className={`h-3.5 w-3.5 ${isWatched ? 'fill-warning' : ''}`} />
          {isWatched ? 'Watching' : 'Add to Watchlist'}
        </button>
      </div>

      {/* ── Stock Title Header ──────────────────────────── */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border"
              style={{ background: `${color}10`, borderColor: `${color}25`, color }}>
              {stock.sector}
            </span>
            <span className="text-[10px] text-text-secondary font-medium">NGX Listed</span>
          </div>
          <div className="flex items-center gap-3">
            {stock.logoUrl && (
              <img src={stock.logoUrl} alt={`${stock.ticker} logo`} className="w-10 h-10 rounded-full object-contain bg-white/5 p-1" />
            )}
            <div>
              <h1 className="text-3xl font-extrabold font-sora tracking-tight"
                style={{ color, textShadow: `0 0 24px ${color}40` }}>
                {stock.ticker}
              </h1>
              <p className="text-sm font-medium text-text-secondary font-dm-sans mt-0.5">{stock.name}</p>
            </div>
          </div>
        </div>

        {/* Global Indices Area */}
        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          {/* EquityStack Rating Pill */}
          <div className="flex items-center gap-3 bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/20 rounded-xl px-4 py-2.5 shadow-lg shrink-0">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#10b981] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.3)]">
              <div className="w-4 h-4 rounded-full bg-[#34d399] shadow-[inset_0_-2px_4px_rgba(0,0,0,0.2),0_3px_6px_rgba(0,0,0,0.4)]" />
            </div>
            <div>
              <div className="text-[9px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-0.5">
                EquityStack Rating
              </div>
              <div className="text-[22px] font-extrabold font-serif text-[#10b981] leading-none mb-1">
                BULLISH
              </div>
              <div className="text-[10px] text-[#8FA3C0] font-medium leading-none">
                Strong fundamentals, attractive valuation
              </div>
            </div>
          </div>
          
          {/* Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'SCORE', value: '74', suffix: '/100', valColor: '#10b981' },
              { label: 'MKT CAP', value: stock.marketCap, valColor: '#F0F4FF' },
              { label: 'P/E', value: `${stock.peRatio}x`, valColor: '#CFA343' },
              { label: 'DIV YIELD', value: stock.dividendYield, valColor: '#10b981' },
              { label: '1Y RETURN', value: `${stock.change > 0 ? '+' : ''}${(Math.abs(stock.change) * 4.2).toFixed(1)}%`, valColor: stock.change >= 0 ? '#10b981' : '#EF4444' }
            ].map((m, i) => (
              <div key={i} className="bg-gradient-to-b from-[#141020] to-[#0A0810] border border-brand-primary/15 rounded-xl px-3 py-2 flex flex-col items-center justify-center min-w-[75px] shrink-0 h-[64px]">
                <div className="text-[9px] font-bold text-[#8FA3C0] uppercase tracking-widest font-dm-sans mb-1">
                  {m.label}
                </div>
                <div className="text-base font-bold font-sora" style={{ color: m.valColor }}>
                  {m.value}<span className="text-[10px] text-[#8FA3C0] font-medium ml-0.5">{m.suffix}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Horizontal Navigation Menu ────────────────── */}
      <div className="w-full">
        <div className="p-2.5 rounded-3xl border border-border-bright/45 shadow-glow-indigo flex flex-row overflow-x-auto gap-2 scrollbar-none"
          style={{ background: 'linear-gradient(90deg, #141020 0%, #0A0810 100%)' }}>
          {([
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'earnings', label: 'Earnings', icon: TrendingUp },
            { id: 'financials', label: 'Financials', icon: FileText },
            { id: 'dividend', label: 'Dividend', icon: Gift },
            { id: 'valuation', label: 'Valuation', icon: Activity },
            { id: 'health', label: 'Health', icon: ShieldCheck },
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
                className={`flex items-center justify-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 relative flex-shrink-0 focus:outline-none whitespace-nowrap ${isActive
                    ? 'text-white bg-[#1A1C38] border border-blue-600 shadow-lg'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface/50 border border-transparent'
                  }`}
              >
                <Icon className={`h-4 w-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-text-secondary'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Content Area ────────────────── */}
      <div className="w-full">
        {renderTabContent()}
      </div>
    </div>
  );
}
