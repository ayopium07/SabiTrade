'use client';

import React, { useState, useMemo } from 'react';
import { Briefcase, Plus, TrendingUp, TrendingDown, Trash2, LayoutGrid, Calendar, X, Check } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const DONUT_COLORS = ['#FF7A68', '#00B8FF', '#FFD166', '#FF4D4D', '#A855F7', '#10B981'];

export type Timeframe = '12 month' | '30 days' | '7 days' | '24 hours';
export interface DataPoint {
  date: string;
  fullDate: string;
  pVal: number;
  asiVal: number;
}

function generateChartData(tf: Timeframe, finalPortfolioVal: number) {
  const points: DataPoint[] = [];
  const now = new Date();
  const maxPVal = finalPortfolioVal > 0 ? finalPortfolioVal : 10000;
  
  if (tf === '12 month') {
    const count = 12;
    // Specific curve multipliers to mimic the exact screenshot graph shape
    const curveShapeP = [0.05, 0.12, 0.40, 0.45, 0.85, 0.55, 0.45, 0.50, 0.45, 0.55, 0.90, 1.0];
    const curveShapeA = [0.02, 0.08, 0.25, 0.30, 0.45, 0.40, 0.25, 0.40, 0.30, 0.45, 0.65, 0.1];
    
    for (let i = 0; i < count; i++) {
      const dt = new Date(now);
      dt.setMonth(now.getMonth() - (count - 1 - i));
      const label = dt.toLocaleDateString('en-US', { month: 'short' });
      const fullDate = dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
      
      const pVal = finalPortfolioVal === 0 ? 0 : (curveShapeP[i] * maxPVal * 0.6) + (maxPVal * 0.4);
      const asiVal = finalPortfolioVal === 0 ? 0 : (curveShapeA[i] * maxPVal * 0.6) + (maxPVal * 0.3);
      points.push({ date: label, fullDate, pVal, asiVal });
    }
  } else {
    // Other timeframes, generate generic smooth data
    const count = tf === '30 days' ? 30 : tf === '7 days' ? 7 : 24;
    let pBase = maxPVal * 0.8;
    let asiBase = maxPVal * 0.7;
    for (let i = 0; i < count; i++) {
      const pVal = i === count - 1 && finalPortfolioVal > 0 ? finalPortfolioVal : pBase + (Math.random() - 0.4) * (maxPVal * 0.05);
      const asiVal = asiBase + (Math.random() - 0.5) * (maxPVal * 0.05);
      pBase = pVal; asiBase = asiVal;
      points.push({ date: '', fullDate: '', pVal: finalPortfolioVal === 0 ? 0 : pVal, asiVal: finalPortfolioVal === 0 ? 0 : asiVal });
    }
  }
  return points;
}

export default function PortfolioTracker() {
  const portfolio = useAppStore((state) => state.portfolio);
  const addHolding = useAppStore((state) => state.addHolding);
  const removeHolding = useAppStore((state) => state.removeHolding);
  const setSelectedTicker = useAppStore((state) => state.setSelectedTicker);
  const stocks = useAppStore((state) => state.stocks);
  const news = useAppStore((state) => state.news);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [tickerSelect, setTickerSelect] = useState('ZENITHBANK');
  const [sharesInput, setSharesInput] = useState('');
  const [priceInput, setPriceInput] = useState('');
  
  const [timeframe, setTimeframe] = useState<Timeframe>('12 month');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // ── Portfolio Metrics ──
  let totalCostBasis = 0;
  let totalCurrentValue = 0;
  let totalTodayChange = 0;

  const holdingsDetails = portfolio.map((holding) => {
    const stock = stocks.find((s) => s.ticker === holding.ticker) || stocks[0];
    const costBasis = holding.shares * holding.buyPrice;
    const currentValue = holding.shares * stock.price;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const todayChangeAmount = holding.shares * stock.changeAmount;
    
    totalCostBasis += costBasis;
    totalCurrentValue += currentValue;
    totalTodayChange += todayChangeAmount;
    
    return { ...holding, stock, costBasis, currentValue, pnl, pnlPercent, todayChangeAmount };
  });

  const totalAllTimePnl = totalCurrentValue - totalCostBasis;
  const totalAllTimePnlPercent = totalCostBasis > 0 ? (totalAllTimePnl / totalCostBasis) * 100 : 0;
  const totalTodayPnlPercent = totalCurrentValue > 0 ? (totalTodayChange / totalCurrentValue) * 100 : 0;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const shares = parseInt(sharesInput);
    const selectedStock = stocks.find(s => s.ticker === tickerSelect) || stocks[0];
    const price = parseFloat(priceInput) || selectedStock.price;
    if (shares > 0) {
      addHolding(tickerSelect, shares, price);
      setSharesInput(''); setPriceInput(''); setIsAddOpen(false);
    }
  };

  // ── Chart Data & SVG ──
  const activeData = useMemo(() => generateChartData(timeframe, totalCurrentValue), [timeframe, totalCurrentValue]);
  
  const svgCoords = useMemo(() => {
    const pts = activeData;
    const len = pts.length;
    
    // Find min and max across both Pval and AsiVal to set Y scale properly
    const allVals = pts.flatMap(p => [p.pVal, p.asiVal]);
    const rawMin = Math.min(...allVals);
    const rawMax = Math.max(...allVals);
    const range = (rawMax - rawMin) || 1;
    
    const paddedMin = rawMin - range * 0.1;
    const paddedMax = rawMax + range * 0.2; // leave room at top
    const finalRange = paddedMax - paddedMin;

    return pts.map((p, i) => {
      const x = (i / (len - 1)) * 100;
      const yP = 100 - ((p.pVal - paddedMin) / finalRange) * 100;
      const yA = 100 - ((p.asiVal - paddedMin) / finalRange) * 100;
      return { x, yP, yA, point: p };
    });
  }, [activeData]);

  // Smooth cubic bezier path generator
  const createSmoothPath = (points: {x: number, y: number}[]) => {
    if (points.length === 0) return '';
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  const pPath = useMemo(() => createSmoothPath(svgCoords.map(p => ({x: p.x, y: p.yP}))), [svgCoords]);
  const aPath = useMemo(() => createSmoothPath(svgCoords.map(p => ({x: p.x, y: p.yA}))), [svgCoords]);
  
  const areaPath = useMemo(() => {
    if (svgCoords.length === 0) return '';
    return `${pPath} L 100 100 L 0 100 Z`;
  }, [pPath, svgCoords]);

  // ── Donut Chart ──
  let accumulatedAngle = 0;
  // Sort holdings by value descending for donut
  const sortedHoldings = [...holdingsDetails].sort((a,b) => b.currentValue - a.currentValue);
  
  const donutSlices = sortedHoldings.map((h, i) => {
    const percentage = totalCurrentValue > 0 ? h.currentValue / totalCurrentValue : 0;
    const angle = percentage * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    const polarToCartesian = (cx: number, cy: number, r: number, deg: number) => {
      const rad = ((deg - 90) * Math.PI) / 180;
      return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
    };

    const describeArc = (x: number, y: number, r: number, sA: number, eA: number): string => {
      // If a single holding is 100%, render two semicircles to form a full circle safely
      if (percentage === 1) {
          const half1 = describeArc(x, y, r, 0, 180);
          const half2 = describeArc(x, y, r, 180, 360);
          return `${half1} ${half2}`;
      }
      
      const start = polarToCartesian(x, y, r, eA);
      const end = polarToCartesian(x, y, r, sA);
      const large = eA - sA <= 180 ? '0' : '1';
      return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
    };

    return {
      ticker: h.ticker,
      percentage,
      path: describeArc(100, 100, 75, startAngle, startAngle + angle),
      color: DONUT_COLORS[i % DONUT_COLORS.length],
    };
  });

  return (
    <div className="space-y-6 text-[#E0E0E0] font-dm-sans min-h-screen">
      
      {/* ── TOP SECTION (GRID) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Main Chart (col-span-8) */}
        <div className="md:col-span-8 rounded-[14px] border border-white/5 overflow-hidden flex flex-col" style={{ background: '#171622' }}>
          <div className="p-6 flex-1 flex flex-col relative">
            
            {/* Header row */}
            <div className="flex justify-between items-start mb-8 z-10 relative">
              <div>
                <div className="text-[11px] font-bold text-white/50 mb-2">Total Valuation</div>
                <div className="text-4xl font-extrabold text-[#CFA343] font-sora tracking-tight mb-2">
                  ₦{totalCurrentValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-white/60">
                  Cost basis: <span className="font-bold text-white">₦{totalCostBasis.toLocaleString('en-NG')}</span>
                </div>
                
                <div className="flex items-center gap-5 mt-6">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></div>
                      <span className="text-[11px] text-white/60 font-semibold">Portfolio Performance</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                      <span className="text-[11px] text-white/60 font-semibold">ASI line</span>
                   </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                 <div className="flex items-center rounded-md border border-white/10 bg-transparent overflow-hidden">
                    {(['12 month', '30 days', '7 days', '24 hours'] as Timeframe[]).map((tf) => (
                      <button key={tf} onClick={() => setTimeframe(tf)}
                        className={`px-3 py-1.5 text-[10px] font-bold border-r border-white/10 last:border-r-0 transition-colors ${timeframe === tf ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white hover:bg-white/5'}`}>
                        {tf}
                      </button>
                    ))}
                 </div>
                 
                 <button onClick={() => setIsDatePickerOpen(true)} className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-white/10 bg-transparent hover:bg-white/5 transition-colors">
                    <Calendar className="h-3.5 w-3.5 text-white/60" />
                    <span className="text-[10px] font-bold text-white">Select dates</span>
                 </button>
              </div>
            </div>
            
            {/* SVG Chart Area */}
            <div className="relative w-full h-[320px] mt-auto">
               
               {/* Horizontal grid lines */}
               <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="w-full border-t border-white/5" />
                 ))}
               </div>

               {/* SVG Canvas */}
               <div 
                 className="absolute inset-0 z-0" 
                 onMouseLeave={() => setHoveredIdx(null)}
                 onMouseMove={(e) => {
                   const rect = e.currentTarget.getBoundingClientRect();
                   const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
                   setHoveredIdx(Math.round(ratio * (activeData.length - 1)));
                 }}
               >
                 <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                   <defs>
                     <linearGradient id="port-grad" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                       <stop offset="70%" stopColor="#10B981" stopOpacity="0.05" />
                       <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                     </linearGradient>
                   </defs>
                   
                   {/* ASI Line (White) */}
                   <path d={aPath} fill="none" stroke="#FFFFFF" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeOpacity="0.6" />
                   
                   {/* Portfolio Line (Green) + Area */}
                   <path d={areaPath} fill="url(#port-grad)" />
                   <path d={pPath} fill="none" stroke="#10B981" strokeWidth="2" vectorEffect="non-scaling-stroke" />

                   {/* Hover logic */}
                   {hoveredIdx !== null && svgCoords[hoveredIdx] && (
                      <g>
                        <line x1={svgCoords[hoveredIdx].x} y1="0" x2={svgCoords[hoveredIdx].x} y2="100" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.7" vectorEffect="non-scaling-stroke" />
                        <circle cx={svgCoords[hoveredIdx].x} cy={svgCoords[hoveredIdx].yP} r="3" fill="#171622" stroke="#10B981" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                      </g>
                   )}
                 </svg>
                 
                 {/* X Axis Labels */}
                 <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-2">
                    {activeData.map((d, i) => {
                      if (!d.date) return null;
                      const x = (i / (activeData.length - 1)) * 100;
                      return (
                        <div key={i} className="absolute text-[10px] text-white/50 -translate-x-1/2" style={{ left: `${x}%` }}>
                          {d.date}
                        </div>
                      )
                    })}
                 </div>

                 {/* Custom Tooltip text on hover */}
                 {hoveredIdx !== null && activeData[hoveredIdx] && activeData[hoveredIdx].fullDate && (
                    <div className="absolute text-[10px] text-white pointer-events-none" style={{ left: `${svgCoords[hoveredIdx].x}%`, top: '-10px', transform: 'translateX(-50%)' }}>
                       {activeData[hoveredIdx].fullDate}
                    </div>
                 )}
               </div>
               
            </div>
          </div>
        </div>
        
        {/* RIGHT COLUMN: 3 Stacked Cards (col-span-4) */}
        <div className="md:col-span-4 flex flex-col gap-5">
           
           {/* Card 1: Today's Return */}
           <div className="rounded-[14px] border border-white/5 p-6 flex flex-col justify-center bg-[#171622]">
              <div className="text-[11px] font-bold text-white/50 mb-3">Today's Return</div>
              <div className={`text-4xl font-extrabold font-sora tracking-tight mb-3 ${totalTodayChange >= 0 ? 'text-[#00D395]' : 'text-[#FF4D4D]'}`}>
                 {totalTodayChange >= 0 ? '+' : ''}₦{totalTodayChange.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <span className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${totalTodayChange >= 0 ? 'bg-[#00D395]/10 text-[#00D395]' : 'bg-[#FF4D4D]/10 text-[#FF4D4D]'}`}>
                    <TrendingUp className={`h-3 w-3 mr-1 ${totalTodayChange >= 0 ? '' : 'rotate-180'}`} />
                    {totalTodayChange >= 0 ? '+' : ''}{totalTodayPnlPercent.toFixed(2)}%
                 </span>
              </div>
              <div className="text-[10px] text-white/40">Since NGX open</div>
           </div>
           
           {/* Card 2: All-Time P&L */}
           <div className="rounded-[14px] border border-white/5 p-6 flex flex-col justify-center bg-[#171622]">
              <div className="text-[11px] font-bold text-white/50 mb-3">All-Time P&L</div>
              <div className={`text-4xl font-extrabold font-sora tracking-tight mb-3 ${totalAllTimePnl >= 0 ? 'text-[#00D395]' : 'text-[#FF4D4D]'}`}>
                 {totalAllTimePnl >= 0 ? '+' : ''}₦{totalAllTimePnl.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2 mb-2">
                 <span className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${totalAllTimePnl >= 0 ? 'bg-[#00D395]/10 text-[#00D395]' : 'bg-[#FF4D4D]/10 text-[#FF4D4D]'}`}>
                    <TrendingUp className={`h-3 w-3 mr-1 ${totalAllTimePnl >= 0 ? '' : 'rotate-180'}`} />
                    {totalAllTimePnl >= 0 ? '+' : ''}{totalAllTimePnlPercent.toFixed(2)}%
                 </span>
              </div>
              <div className="text-[10px] text-white/40">Unrealised ledger P&L</div>
           </div>
           
           {/* Card 3: Donut */}
           <div className="rounded-[14px] border border-white/5 p-6 flex-1 flex items-center bg-[#171622] gap-4">
              <div className="relative w-[130px] h-[130px] flex-shrink-0">
                 <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
                   <circle cx="100" cy="100" r="75" fill="none" stroke="#23214C" strokeWidth="22" />
                   {donutSlices.map(s => (
                      <path key={s.ticker} d={s.path} fill="none" stroke={s.color} strokeWidth="22" />
                   ))}
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center pt-1">
                    <span className="text-[9px] text-white/50 font-bold tracking-wider">ASSETS</span>
                    <span className="text-xl font-extrabold text-[#CFA343] font-sora leading-tight">{portfolio.length}</span>
                    <span className="text-[9px] text-white/40">Equities</span>
                 </div>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-3">
                 {donutSlices.slice(0,3).map((slice) => (
                    <div key={slice.ticker} className="flex items-start gap-2">
                       <div className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0" style={{ backgroundColor: slice.color }}></div>
                       <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-white tracking-wide">{slice.ticker}</span>
                          <span className="text-[10px] text-white/50">{(slice.percentage * 100).toFixed(0)}%</span>
                       </div>
                    </div>
                 ))}
                 {donutSlices.length > 3 && (
                    <div className="text-[10px] text-white/40 italic ml-5">+ {donutSlices.length - 3} more</div>
                 )}
              </div>
           </div>

        </div>
      </div>
      
      {/* ── BOTTOM SECTION: Tracked Holdings ── */}
      <div className="rounded-[14px] border border-white/5 bg-[#171622] p-6">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-extrabold text-white/60 uppercase tracking-widest">
              Tracked Holdings
            </h3>
            <button onClick={() => setIsAddOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold focus:outline-none transition-all text-black bg-[#FFD166] hover:bg-[#CFA343]">
              <Plus className="h-4 w-4" />
              Record Purchase
            </button>
         </div>
         
         <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[800px]">
               {/* Table Header */}
               <div className="grid grid-cols-12 gap-4 pb-4 border-b border-white/5 text-[9px] font-bold text-white/40 uppercase tracking-widest text-left">
                  <div className="col-span-3">Equity</div>
                  <div className="col-span-2 text-center">Current Price</div>
                  <div className="col-span-2 text-center">Holdings</div>
                  <div className="col-span-2 text-center">Cost Price</div>
                  <div className="col-span-1 text-center">Current Val</div>
                  <div className="col-span-2 text-right pr-4">P&L / DEL</div>
               </div>
               
               {/* Table Body */}
               <div className="divide-y divide-white/5">
                  {holdingsDetails.length === 0 ? (
                     <div className="py-12 text-center">
                        <LayoutGrid className="h-8 w-8 text-white/20 mx-auto mb-3" />
                        <p className="text-sm font-bold text-white mb-1">Portfolio is Empty</p>
                        <p className="text-xs text-white/40 max-w-sm mx-auto">
                           Track your NGX holdings manually. Record your first buy to analyze yields!
                        </p>
                     </div>
                  ) : (
                     holdingsDetails.map((h, idx) => {
                        const isPos = h.pnl >= 0;
                        // Use exact matching for colors based on donut order to maintain visual consistency
                        const colorIndex = sortedHoldings.findIndex(sh => sh.ticker === h.ticker);
                        const color = DONUT_COLORS[colorIndex % DONUT_COLORS.length];
                        
                        return (
                          <div key={h.ticker} className="grid grid-cols-12 gap-4 py-5 items-center hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg">
                             
                             {/* EQUITY */}
                             <div className="col-span-3 flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></div>
                                <div className="flex flex-col">
                                   <span className="text-sm font-extrabold text-white tracking-wide font-sora cursor-pointer hover:underline"
                                         onClick={() => setSelectedTicker(h.ticker)}>
                                     {h.ticker}
                                   </span>
                                   <span className="text-xs text-[#00B8FF] opacity-80 truncate" style={{ color }}>{h.stock.name}</span>
                                </div>
                             </div>
                             
                             {/* CURRENT PRICE */}
                             <div className="col-span-2 flex flex-col items-center">
                                <span className="text-sm font-extrabold text-white font-sora">₦{h.stock.price.toLocaleString('en-NG')}</span>
                                <span className="text-[10px] text-white/40 font-bold mt-0.5">N{(h.shares * h.stock.price).toLocaleString('en-NG')}</span>
                             </div>
                             
                             {/* HOLDINGS */}
                             <div className="col-span-2 flex flex-col items-center">
                                <span className="text-sm font-extrabold text-white font-sora">{h.shares.toLocaleString()}</span>
                                <span className="text-[9px] text-white/40 uppercase tracking-widest mt-0.5 font-bold">Shares</span>
                             </div>
                             
                             {/* COST PRICE */}
                             <div className="col-span-2 flex flex-col items-center">
                                <span className="text-sm font-extrabold text-white font-sora">₦{h.buyPrice.toLocaleString()}</span>
                                <span className="text-[10px] text-white/40 font-bold mt-0.5">N{h.costBasis.toLocaleString('en-NG')}</span>
                             </div>
                             
                             {/* CURRENT VAL */}
                             <div className="col-span-1 flex justify-center items-center">
                                <span className="text-sm font-extrabold text-white font-sora">₦{h.currentValue.toLocaleString('en-NG')}</span>
                             </div>
                             
                             {/* P&L / DEL */}
                             <div className="col-span-2 flex items-center justify-end gap-3 pr-2">
                                <div className="flex flex-col items-end">
                                   <span className={`text-sm font-extrabold font-sora ${isPos ? 'text-[#00D395]' : 'text-[#FF4D4D]'}`}>
                                      {isPos ? '+' : ''}₦{h.pnl.toLocaleString('en-NG')}
                                   </span>
                                   <span className={`text-[10px] font-bold mt-0.5 ${isPos ? 'text-[#00D395]' : 'text-[#FF4D4D]'}`}>
                                      {isPos ? '+' : ''}{h.pnlPercent.toFixed(1)}%
                                   </span>
                                </div>
                                <button onClick={() => removeHolding(h.ticker)} className="p-1.5 rounded bg-white/5 hover:bg-[#FF4D4D]/20 text-white/30 hover:text-[#FF4D4D] transition-colors">
                                   <Trash2 className="h-3.5 w-3.5" />
                                </button>
                             </div>
                             
                          </div>
                        );
                     })
                  )}
               </div>
            </div>
         </div>
      </div>
      
      {/* ── BOTTOM SECTION 2: Portfolio News and Analysis ── */}
      <div className="rounded-[14px] border border-white/5 bg-[#171622] p-6 mt-6">
         <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-extrabold text-white/60 uppercase tracking-widest">
              Portfolio News and Analysis
            </h3>
         </div>
         <div className="divide-y divide-white/5">
            {news
              .filter(n => n.affectedStocks?.some(ticker => portfolio.some(h => h.ticker === ticker)))
              .map((item) => (
               <div key={item.id} className="py-5 flex gap-4 hover:bg-white/[0.02] transition-colors -mx-4 px-4 rounded-lg cursor-pointer">
                  {item.imageUrl && (
                     <div className="w-[120px] h-[80px] rounded-lg overflow-hidden flex-shrink-0 border border-white/10 hidden sm:block">
                        <img src={item.imageUrl} alt={item.originalHeadline} className="w-full h-full object-cover" />
                     </div>
                  )}
                  <div className="flex flex-col flex-1 justify-center">
                     <h4 className="text-sm font-bold text-[#00B8FF] hover:underline mb-1">
                        {item.originalHeadline}
                     </h4>
                     <p className="text-[10px] text-white/40 mb-2">
                        By {item.source} - {item.date ? new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : item.timeAgo}
                     </p>
                     <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                        {item.aiSummary || item.whyItMatters}
                     </p>
                  </div>
               </div>
            ))}
            {news.filter(n => n.affectedStocks?.some(ticker => portfolio.some(h => h.ticker === ticker))).length === 0 && (
               <div className="py-8 text-center">
                  <p className="text-sm font-bold text-white mb-1">No News Available</p>
                  <p className="text-xs text-white/40">Add assets to your portfolio to track related news and analysis.</p>
               </div>
            )}
         </div>
      </div>
      
      {/* ── Modals (Add Holding, DatePicker) ── */}
      {/* ... Add Modal ... */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl p-6 space-y-4 bg-[#171622] border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-sm font-extrabold text-[#CFA343] font-sora flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Record Buy Transaction
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-white/40 hover:text-white p-1"><X className="h-4 w-4" /></button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] text-white/50 font-bold uppercase mb-1.5">Select NGX Asset</label>
                <select value={tickerSelect} onChange={e => setTickerSelect(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none text-white bg-[#0E0D25] border border-white/10">
                  {stocks.map(s => <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name} (₦{s.price.toFixed(2)})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-white/50 font-bold uppercase mb-1.5">Shares Purchased</label>
                <input type="number" required placeholder="e.g. 5,000" value={sharesInput} onChange={e => setSharesInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none text-white bg-[#0E0D25] border border-white/10" />
              </div>
              <div>
                <label className="block text-[10px] text-white/50 font-bold uppercase mb-1.5">Buy Price per Share (₦)</label>
                <input type="number" step="0.01" placeholder="Leave empty for current price" value={priceInput} onChange={e => setPriceInput(e.target.value)} className="w-full px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-none text-white bg-[#0E0D25] border border-white/10" />
              </div>
              <div className="pt-2 flex justify-end gap-2.5">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-white/60 hover:text-white border border-white/10">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-[#CFA343] hover:bg-[#FFD166] transition-colors">Add Transaction</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* ... Date Picker Modal ... */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           {/* Re-use exact design from MarketStatus, simplified */}
           <div className="bg-[#171622] border border-white/10 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                 <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-[#CFA343]" /><h3 className="text-sm font-bold text-white font-sora">Select Date Range</h3></div>
                 <button onClick={() => setIsDatePickerOpen(false)} className="text-white/40 hover:text-white p-1"><X className="h-4 w-4" /></button>
              </div>
              <div className="text-xs text-white/50">Date picker feature disabled in demo. Select a quick timeframe.</div>
              <div className="flex justify-end pt-2"><button onClick={() => setIsDatePickerOpen(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-black bg-[#CFA343] hover:bg-[#FFD166]">Close</button></div>
           </div>
        </div>
      )}

    </div>
  );
}
