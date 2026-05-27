import React, { useState, useRef } from 'react';
import { ChevronLeft, Star, Briefcase, Sparkles, BookOpen } from 'lucide-react';
import { ngxStocks, mockNews } from '@/lib/mockData';
import { useAppStore } from '@/lib/store';

export default function StockDetail() {
  const selectedTicker = useAppStore((state) => state.selectedTicker);
  const previousView   = useAppStore((state) => state.previousView);
  const setView        = useAppStore((state) => state.setView);
  const toggleWatchlist = useAppStore((state) => state.toggleWatchlist);
  const watchlist      = useAppStore((state) => state.watchlist);
  const user           = useAppStore((state) => state.user);
  const addHolding     = useAppStore((state) => state.addHolding);

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

  const relatedNews = mockNews.filter((news) => news.affectedStocks.includes(stock.ticker)).slice(0, 3);

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

  const cardStyle = { background: 'linear-gradient(145deg, #0E0D25, #070615)', border: '1px solid #23214C' };
  const inputStyle = { background: 'rgba(14,13,37,0.8)', border: '1px solid #23214C', color: '#FFFFFF' };

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

      {/* ── Main Grid ───────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2 space-y-5">
          {/* Ticker Header */}
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

          {/* Price Block */}
          <div className="p-5 rounded-2xl flex flex-wrap items-baseline gap-4" style={cardStyle}>
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
          <div className="p-4 sm:p-5 rounded-2xl space-y-4" style={cardStyle}>
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

            {/* SVG Chart */}
            <div className="relative rounded-xl p-2 h-[200px] border border-border/40"
              style={{ background: 'rgba(0,0,0,0.3)' }}>
              {/* Tooltip */}
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

                {/* Volume bars */}
                {points.map((p, idx) => {
                  const maxVol = Math.max(...points.map((pt) => pt.volume));
                  const volH   = (p.volume / maxVol) * 28;
                  return (
                    <rect key={idx} x={p.x - 2} y={chartHeight - paddingY - volH}
                      width="4" height={volH}
                      fill={color} opacity="0.08" rx="1" />
                  );
                })}

                {/* Area fill */}
                {areaD && <path d={areaD} fill="url(#chartAreaGrad)" />}

                {/* Main line */}
                {pathD && (
                  <path d={pathD} fill="none" stroke={color} strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round" filter="url(#chart-glow)" />
                )}

                {/* Hover node */}
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

          {/* Metrics Grid */}
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

        {/* ── Right Sidebar ────────────────────────────────── */}
        <div className="space-y-5">
          {/* AI Insight */}
          <div className="p-5 rounded-2xl space-y-3 relative overflow-hidden border border-brand-primary/12"
            style={{ background: 'linear-gradient(145deg, #0E0D25, #070615)' }}>
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

          {/* Manual Trade Form */}
          <div className="p-5 rounded-2xl space-y-4" style={cardStyle}>
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

          {/* Related News */}
          {relatedNews.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[10px] text-text-secondary font-bold uppercase tracking-widest font-dm-sans">
                Mentioned in Feed
              </h4>
              <div className="space-y-2">
                {relatedNews.map((news) => {
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
    </div>
  );
}
