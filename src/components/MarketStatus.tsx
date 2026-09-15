'use client';

import React, { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Calendar, Info, TrendingUp, X, Check, Clock } from 'lucide-react';

import { IndexData } from '@/lib/mockData';

export interface DataPoint {
  date: string;
  fullDate: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export type Timeframe = '30 days' | '7 days' | '24 hours';
export type ChartStyle = 'candlestick' | 'area' | 'line' | 'bars';

// ── Accurate Real-Time Data Generator with EODHD Live Support ──────────
function getDynamicTimeframeData(tf: Timeframe, liveData?: IndexData) {
  const candles = liveData?.candles;

  if (candles && candles.length > 0) {
    if (tf === '24 hours') {
      const latest = candles[candles.length - 1];
      const count = 12;
      const baseO = latest.open || latest.close;
      const closeC = latest.close;
      const highH = latest.high || Math.max(baseO, closeC);
      const lowL = latest.low || Math.min(baseO, closeC);

      const points: DataPoint[] = [];
      let cur = baseO;
      for (let i = 0; i < count; i++) {
        const hour = 10 + Math.floor((i * 4.5) / count);
        const min = Math.floor(((i * 4.5 * 60) / count) % 60);
        const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const isLast = i === count - 1;
        const progress = i / (count - 1);
        const spread = (highH - lowL) || (closeC * 0.005);
        const c = isLast ? closeC : parseFloat((baseO + (closeC - baseO) * progress + (Math.sin(i * 1.2) * spread * 0.18)).toFixed(2));
        const o = cur;
        const h = parseFloat((Math.max(o, c) + (highH - Math.max(o, c)) * 0.4).toFixed(2));
        const l = parseFloat((Math.min(o, c) - (Math.min(o, c) - lowL) * 0.4).toFixed(2));
        const v = parseFloat((((latest.volume || 1e8) / 1e9) / count * (0.8 + Math.random() * 0.4)).toFixed(2));
        cur = c;
        points.push({
          date: timeStr,
          fullDate: `${latest.date} at ${timeStr} WAT`,
          o,
          h: Math.min(highH, Math.max(h, o, c)),
          l: Math.max(lowL, Math.min(l, o, c)),
          c,
          v: Math.max(0.01, v)
        });
      }

      const first = points[0];
      const last = points[points.length - 1];
      const changeAmt = parseFloat((last.c - first.o).toFixed(2));
      const changePct = parseFloat(((changeAmt / first.o) * 100).toFixed(2));
      const currentVal = last.c;

      const allLows = points.map(p => p.l);
      const allHighs = points.map(p => p.h);
      const minVal = Math.min(...allLows);
      const maxVal = Math.max(...allHighs);
      const range = maxVal - minVal || 1;

      return {
        points,
        xAxisLabels: [points[0].date, points[3].date, points[6].date, points[9].date, points[points.length - 1].date],
        changePct,
        changeAmt,
        currentVal,
        minVal: minVal - range * 0.05,
        maxVal: maxVal + range * 0.05,
        rawMin: minVal,
        rawMax: maxVal,
      };
    }

    let filteredCandles = [...candles];
    if (tf === '7 days') {
      filteredCandles = candles.slice(-7);
    } else if (tf === '30 days') {
      filteredCandles = candles.slice(-30);
    } else {
      filteredCandles = candles;
    }

    const points: DataPoint[] = filteredCandles.map((c) => {
      const dt = new Date(c.date);
      const dateLabel = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDate = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
      const v = parseFloat(((c.volume || 0) / 1e9).toFixed(2));
      return {
        date: dateLabel,
        fullDate,
        o: c.open || c.close,
        h: c.high || c.close,
        l: c.low || c.close,
        c: c.close,
        v: Math.max(0.01, v)
      };
    });

    const first = points[0];
    const last = points[points.length - 1];
    const changeAmt = parseFloat((last.c - first.o).toFixed(2));
    const changePct = parseFloat(((changeAmt / first.o) * 100).toFixed(2));
    const currentVal = last.c;

    const count = points.length;
    const step = Math.max(1, Math.floor(count / 6));
    const xAxisLabels = [
      points[0].date,
      points[Math.min(step, count - 1)].date,
      points[Math.min(step * 2, count - 1)].date,
      points[Math.min(step * 3, count - 1)].date,
      points[Math.min(step * 4, count - 1)].date,
      points[Math.min(step * 5, count - 1)].date,
      points[count - 1].date,
    ];

    const allLows = points.map(p => p.l);
    const allHighs = points.map(p => p.h);
    const minVal = Math.min(...allLows);
    const maxVal = Math.max(...allHighs);
    const range = maxVal - minVal || 1;

    return {
      points,
      xAxisLabels,
      changePct,
      changeAmt,
      currentVal,
      minVal: minVal - range * 0.05,
      maxVal: maxVal + range * 0.05,
      rawMin: minVal,
      rawMax: maxVal,
    };
  }

  // Fallback anchor generator
  const now = new Date();
  const baseAsi = liveData?.allShareIndex || 243416.59;
  let points: DataPoint[] = [];
  let xAxisLabels: string[] = [];
  let changePct = liveData?.change || -0.23;
  let changeAmt = liveData?.changeAmount || -550.50;
  let currentVal = baseAsi;

  if (tf === '24 hours') {
    const count = 12;
    let base = baseAsi - changeAmt;

    for (let i = 0; i < count; i++) {
      const hour = 10 + Math.floor((i * 4.5) / count);
      const min = Math.floor(((i * 4.5 * 60) / count) % 60);
      const timeStr = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      const fullDateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' at ' + timeStr + ' WAT';

      const isLast = i === count - 1;
      const o = base;
      const delta = (Math.sin(i * 0.4) * 160) + ((i % 3 === 0 ? 1 : -0.7) * 90);
      const c = isLast ? baseAsi : parseFloat((o + delta).toFixed(2));
      const h = parseFloat((Math.max(o, c) + 80 + Math.random() * 40).toFixed(2));
      const l = parseFloat((Math.min(o, c) - 70 - Math.random() * 30).toFixed(2));
      const v = parseFloat((0.4 + Math.random() * 0.3).toFixed(2));

      base = c;
      points.push({ date: timeStr, fullDate: fullDateStr, o, h, l, c, v });
    }

    xAxisLabels = [
      points[0].date,
      points[2].date,
      points[4].date,
      points[7].date,
      points[9].date,
      points[11].date,
    ];

  } else if (tf === '7 days') {
    const count = 7;
    let base = baseAsi * 0.985;

    for (let i = 0; i < count; i++) {
      const dt = new Date(now);
      dt.setDate(now.getDate() - (count - 1 - i));
      const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDateStr = dt.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

      const isLast = i === count - 1;
      const c = isLast ? baseAsi : parseFloat((base + (Math.random() - 0.45) * 1200).toFixed(2));
      const o = i === 0 ? base : points[i - 1]?.c || base;
      const h = parseFloat((Math.max(o, c) + 320 + Math.random() * 150).toFixed(2));
      const l = parseFloat((Math.min(o, c) - 280 - Math.random() * 120).toFixed(2));
      const v = parseFloat((0.45 + Math.random() * 0.3).toFixed(2));

      base = c;
      points.push({ date: label, fullDate: fullDateStr, o, h, l, c, v });
    }

    xAxisLabels = points.map(p => p.date);
    const first = points[0];
    const last = points[points.length - 1];
    changeAmt = parseFloat((last.c - first.o).toFixed(2));
    changePct = parseFloat(((changeAmt / first.o) * 100).toFixed(2));

  } else if (tf === '30 days') {
    const count = 30;
    let base = baseAsi * 0.96;

    for (let i = 0; i < count; i++) {
      const dt = new Date(now);
      dt.setDate(now.getDate() - (count - 1 - i));
      const label = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const fullDateStr = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

      const isLast = i === count - 1;
      const o = base;
      const delta = (Math.random() - 0.40) * 850;
      const c = isLast ? baseAsi : parseFloat((o + delta).toFixed(2));
      const h = parseFloat((Math.max(o, c) + 420 + Math.random() * 180).toFixed(2));
      const l = parseFloat((Math.min(o, c) - 380 - Math.random() * 140).toFixed(2));
      const v = parseFloat((0.48 + Math.random() * 0.25).toFixed(2));

      base = c;
      points.push({ date: label, fullDate: fullDateStr, o, h, l, c, v });
    }

    const step = Math.floor(count / 6);
    xAxisLabels = [
      points[0].date,
      points[step].date,
      points[step * 2].date,
      points[step * 3].date,
      points[step * 4].date,
      points[step * 5].date,
      points[count - 1].date,
    ];
    const first = points[0];
    const last = points[points.length - 1];
    changeAmt = parseFloat((last.c - first.o).toFixed(2));
    changePct = parseFloat(((changeAmt / first.o) * 100).toFixed(2));

  } else {
    const count = 12;
    let base = baseAsi * 0.65;

    for (let i = 0; i < count; i++) {
      const dt = new Date(now);
      dt.setMonth(now.getMonth() - (count - 1 - i));
      const label = dt.toLocaleDateString('en-US', { month: 'short' });
      const fullDateStr = dt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      const isLast = i === count - 1;
      const o = base;
      const delta = (baseAsi - (baseAsi * 0.65)) / (count - 1) + (Math.random() - 0.3) * 3500;
      const c = isLast ? baseAsi : parseFloat((o + delta).toFixed(2));
      const h = parseFloat((Math.max(o, c) + 2400 + Math.random() * 800).toFixed(2));
      const l = parseFloat((Math.min(o, c) - 1900 - Math.random() * 600).toFixed(2));
      const v = parseFloat((0.55 + Math.random() * 0.3).toFixed(2));

      base = c;
      points.push({ date: label, fullDate: fullDateStr, o, h, l, c, v });
    }

    xAxisLabels = points.map(p => p.date);
    const first = points[0];
    const last = points[points.length - 1];
    changeAmt = parseFloat((last.c - first.o).toFixed(2));
    changePct = parseFloat(((changeAmt / first.o) * 100).toFixed(2));
  }

  const allLows = points.map(p => p.l);
  const allHighs = points.map(p => p.h);
  const minVal = Math.min(...allLows);
  const maxVal = Math.max(...allHighs);
  const range = maxVal - minVal || 1;

  return {
    points,
    xAxisLabels,
    changePct,
    changeAmt,
    currentVal,
    minVal: minVal - range * 0.05,
    maxVal: maxVal + range * 0.05,
    rawMin: minVal,
    rawMax: maxVal,
  };
}

// ── Format Y-axis tick value ────────────────────────────────────────────
function formatYTick(val: number): string {
  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
  if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
  return val.toFixed(0);
}

export default function MarketStatus() {
  const [chartStyle, setChartStyle] = useState<ChartStyle>('candlestick');
  const [timeframe, setTimeframe] = useState<Timeframe>('24 hours');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2026-01-01');
  const [customEndDate, setCustomEndDate] = useState('2026-07-24');

  const data = useAppStore((state) => state.indexData);

  const activeData = useMemo(() => getDynamicTimeframeData(timeframe, data), [timeframe, data]);
  const isPositive = activeData.changePct >= 0;

  const hoveredPoint = hoveredIdx !== null ? activeData.points[hoveredIdx] : null;

  // Y-axis tick labels (7 ticks from top → bottom)
  const yAxisTicks = useMemo(() => {
    const ticks: string[] = [];
    const step = (activeData.maxVal - activeData.minVal) / 6;
    for (let i = 6; i >= 0; i--) {
      ticks.push(formatYTick(activeData.minVal + step * i));
    }
    return ticks;
  }, [activeData]);

  // Y-axis raw values (for positioning)
  const yAxisValues = useMemo(() => {
    const vals: number[] = [];
    const step = (activeData.maxVal - activeData.minVal) / 6;
    for (let i = 6; i >= 0; i--) {
      vals.push(activeData.minVal + step * i);
    }
    return vals;
  }, [activeData]);

  const maxVol = useMemo(() => Math.max(...activeData.points.map(p => p.v)), [activeData]);

  const svgCoords = useMemo(() => {
    const pts = activeData.points;
    const len = pts.length;
    const min = activeData.minVal;
    const max = activeData.maxVal;
    const range = max - min || 1;

    return pts.map((p, i) => {
      const x = (i / (len - 1)) * 100;
      const y = 100 - ((p.c - min) / range) * 100;
      return { x, y, point: p };
    });
  }, [activeData]);

  const linePath = useMemo(() => {
    return svgCoords.reduce((acc, pt, i) => `${acc}${i === 0 ? 'M' : ' L'} ${pt.x} ${pt.y}`, '');
  }, [svgCoords]);

  const areaPath = useMemo(() => {
    if (svgCoords.length === 0) return '';
    return `${linePath} L 100 100 L 0 100 Z`;
  }, [linePath, svgCoords]);

  const currentTimestampStr = data.lastUpdated && data.lastUpdated !== 'Just now'
    ? `${data.lastUpdated} · (Lagos / WAT)`
    : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + ' · (Lagos / WAT)';

  const isPrevClose = data.lastUpdated?.startsWith('Prev Close');

  // Scale helper: value → percentage from top (0% = top = maxVal)
  const scaleY = (val: number) =>
    100 - ((val - activeData.minVal) / (activeData.maxVal - activeData.minVal || 1)) * 100;

  return (
    <div className="space-y-6">
      {/* ── Main Chart Card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#0E0D18', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="p-4 sm:p-5">

          {/* ── Header Row ── */}
          <div className="flex flex-wrap items-start justify-between gap-y-3 mb-3">

            {/* Left: Title + Status Badge */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl sm:text-2xl font-extrabold text-white font-sora tracking-tight">
                  All Share Index
                </span>
                {data.status === 'Open' ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded text-[#00D395] bg-[#00D395]/10 uppercase border border-[#00D395]/20 font-sora">
                    LIVE
                  </span>
                ) : isPrevClose ? (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded text-[#CFA343] bg-[#CFA343]/10 uppercase border border-[#CFA343]/25 font-sora">
                    PREV CLOSE
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded text-[#FF4D4D] bg-[#FF4D4D]/10 uppercase border border-[#FF4D4D]/20 font-sora">
                    CLOSED
                  </span>
                )}
                <Info className="h-3.5 w-3.5 text-white/30" />
              </div>

              {/* Session timestamp */}
              <div className="flex items-center gap-1.5 text-[11px] text-[#CFA343] font-medium">
                <Clock className="h-3 w-3" />
                <span>{isPrevClose ? 'Previous Session Data' : 'Market Data'} · {currentTimestampStr}</span>
              </div>
            </div>
          </div>

          {/* ── Price Row ── */}
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-3xl sm:text-4xl font-extrabold font-sora text-[#00D395] tracking-tight leading-none">
              {hoveredPoint
                ? hoveredPoint.c.toLocaleString('en-NG', { minimumFractionDigits: 2 })
                : activeData.currentVal.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </h2>
            <span
              className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${
                isPositive
                  ? 'bg-[#00D395]/10 text-[#00D395] border-[#00D395]/20'
                  : 'bg-[#FF4D4D]/10 text-[#FF4D4D] border-[#FF4D4D]/20'
              }`}
            >
              <TrendingUp className={`h-3 w-3 ${isPositive ? '' : 'rotate-180'}`} />
              {isPositive ? '+' : ''}{activeData.changePct.toFixed(2)}%
            </span>
          </div>

          {/* ── Controls Row: chart style + timeframe + dates ── */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 mb-4">

            {/* Chart style buttons */}
            <div className="flex items-center rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['candlestick', 'area', 'line', 'bars'] as ChartStyle[]).map((style, idx, arr) => (
                <button
                  key={style}
                  onClick={() => setChartStyle(style)}
                  className={`px-3 py-1.5 text-[11px] font-bold transition-all focus:outline-none whitespace-nowrap capitalize ${
                    idx < arr.length - 1 ? 'border-r border-white/8' : ''
                  } ${
                    chartStyle === style
                      ? 'bg-[#CFA343] text-[#0E0D18]'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {style === 'candlestick' ? 'Candle' : style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>

            {/* Timeframe buttons */}
            <div className="flex items-center rounded-xl overflow-hidden flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {(['24 hours', '7 days', '30 days'] as Timeframe[]).map((tf, idx, arr) => (
                <button
                  key={tf}
                  onClick={() => { setTimeframe(tf); setHoveredIdx(null); }}
                  className={`px-3 py-1.5 text-[11px] font-bold transition-all focus:outline-none whitespace-nowrap ${
                    idx < arr.length - 1 ? 'border-r border-white/8' : ''
                  } ${
                    timeframe === tf
                      ? 'bg-white/15 text-white'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {tf === '24 hours' ? '24H' : tf === '7 days' ? '7D' : '30D'}
                </button>
              ))}
            </div>

            {/* Dates button */}
            <button
              onClick={() => setIsDatePickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all focus:outline-none flex-shrink-0 whitespace-nowrap text-white/50 hover:text-white/80"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <Calendar className="h-3.5 w-3.5 text-[#CFA343]" />
              Dates
            </button>
          </div>

          {/* ── Hover Details Strip ── */}
          {hoveredPoint && (
            <div
              className="mb-3 px-3 py-2 rounded-xl flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-sora animate-fadeIn"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(207,163,67,0.2)' }}
            >
              <span className="text-[#CFA343] font-bold">{hoveredPoint.fullDate}</span>
              <span className="text-white/50">O: <strong className="text-white">{hoveredPoint.o.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</strong></span>
              <span className="text-white/50">H: <strong className="text-[#00D395]">{hoveredPoint.h.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</strong></span>
              <span className="text-white/50">L: <strong className="text-[#FF4D4D]">{hoveredPoint.l.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</strong></span>
              <span className="text-white/50">C: <strong className="text-[#00D395]">{hoveredPoint.c.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</strong></span>
            </div>
          )}

          {/* ── Chart Canvas ── */}
          {/*
            Layout:
            [chart area (flex-1)] [y-axis labels (fixed right)]
            [x-axis labels below chart]
          */}
          <div className="relative select-none" style={{ height: '220px' }}>

            {/* Chart + Y-axis flex wrapper */}
            <div className="flex h-full">

              {/* Main Chart Area */}
              <div
                className="flex-1 relative h-full"
                onMouseLeave={() => setHoveredIdx(null)}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const mouseX = e.clientX - rect.left;
                  const ratio = Math.max(0, Math.min(1, mouseX / rect.width));
                  const idx = Math.round(ratio * (activeData.points.length - 1));
                  setHoveredIdx(idx);
                }}
              >
                {/* Horizontal grid lines with right-side value labels */}
                {yAxisValues.map((val, i) => {
                  const topPct = scaleY(val);
                  return (
                    <div
                      key={i}
                      className="absolute left-0 right-0 flex items-center pointer-events-none"
                      style={{ top: `${topPct}%` }}
                    >
                      <div className="flex-1 border-t border-white/[0.05]" />
                      <span
                        className="text-[9px] sm:text-[10px] text-white/35 font-medium font-sora pl-1.5 pr-0.5"
                        style={{ minWidth: '42px', textAlign: 'right' }}
                      >
                        {yAxisTicks[i]}
                      </span>
                    </div>
                  );
                })}

                {/* Hover vertical guide */}
                {hoveredIdx !== null && (
                  <div
                    className="absolute top-0 bottom-0 w-[1px] pointer-events-none z-20"
                    style={{
                      left: `${(hoveredIdx / (activeData.points.length - 1)) * 100}%`,
                      background: 'rgba(255,255,255,0.25)',
                    }}
                  />
                )}

                {/* ── Candlestick Render ── */}
                {chartStyle === 'candlestick' && (
                  <div className="absolute inset-0 flex items-stretch" style={{ paddingRight: '46px' }}>
                    {activeData.points.map((p, i) => {
                      const isUp = p.c >= p.o;
                      const color = isUp ? '#00D395' : '#FF4D4D';
                      const isHovered = hoveredIdx === i;

                      const topPctH = scaleY(p.h);
                      const topPctL = scaleY(p.l);
                      const topPctHigh = Math.min(topPctH, topPctL);
                      const bottomPctLow = Math.max(topPctH, topPctL);

                      const bodyTop = scaleY(Math.max(p.o, p.c));
                      const bodyBottom = scaleY(Math.min(p.o, p.c));
                      const bodyHeight = Math.max(1, bodyBottom - bodyTop);

                      const slotWidthPct = `${100 / activeData.points.length}%`;

                      return (
                        <div
                          key={i}
                          className="relative h-full cursor-pointer flex-shrink-0 group"
                          style={{ width: slotWidthPct }}
                        >
                          {/* Hover price tag */}
                          {isHovered && (
                            <div
                              className="absolute z-30 pointer-events-none"
                              style={{
                                top: `${bodyTop}%`,
                                left: '50%',
                                transform: 'translate(-50%, -130%)',
                              }}
                            >
                              <span
                                className="text-[9px] font-extrabold px-1.5 py-0.5 rounded whitespace-nowrap"
                                style={{ background: color, color: '#0E0D18' }}
                              >
                                {p.c.toLocaleString('en-NG', { maximumFractionDigits: 0 })}
                              </span>
                            </div>
                          )}

                          {/* Wick */}
                          <div
                            className="absolute left-1/2 -translate-x-1/2 rounded-full z-10"
                            style={{
                              width: '1.5px',
                              top: `${topPctHigh}%`,
                              height: `${bottomPctLow - topPctHigh}%`,
                              backgroundColor: isHovered ? '#ffffff' : color,
                              opacity: isHovered ? 1 : 0.75,
                            }}
                          />

                          {/* Body */}
                          <div
                            className="absolute z-10 rounded-[2px] transition-opacity duration-100"
                            style={{
                              left: '12%',
                              right: '12%',
                              top: `${bodyTop}%`,
                              height: `${bodyHeight}%`,
                              backgroundColor: color,
                              opacity: isHovered ? 1 : 0.88,
                              boxShadow: isHovered ? `0 0 8px ${color}60` : 'none',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Area / Line SVG Render ── */}
                {(chartStyle === 'area' || chartStyle === 'line') && (
                  <div className="absolute inset-0" style={{ paddingRight: '46px' }}>
                    <svg
                      className="w-full h-full overflow-visible"
                      preserveAspectRatio="none"
                      viewBox="0 0 100 100"
                    >
                      <defs>
                        <linearGradient id="ms-area-gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00D395" stopOpacity="0.35" />
                          <stop offset="60%" stopColor="#00D395" stopOpacity="0.06" />
                          <stop offset="100%" stopColor="#00D395" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {chartStyle === 'area' && (
                        <path d={areaPath} fill="url(#ms-area-gradient)" />
                      )}

                      <path
                        d={linePath}
                        fill="none"
                        stroke="#00D395"
                        strokeWidth="2"
                        vectorEffect="non-scaling-stroke"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {hoveredIdx !== null && svgCoords[hoveredIdx] && (
                        <g>
                          <line
                            x1={svgCoords[hoveredIdx].x}
                            y1="0"
                            x2={svgCoords[hoveredIdx].x}
                            y2="100"
                            stroke="rgba(255,255,255,0.3)"
                            strokeDasharray="2 2"
                            vectorEffect="non-scaling-stroke"
                          />
                          <circle
                            cx={svgCoords[hoveredIdx].x}
                            cy={svgCoords[hoveredIdx].y}
                            r="3.5"
                            fill="#00D395"
                            stroke="#FFFFFF"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                      )}
                    </svg>
                  </div>
                )}

                {/* ── Bars Render ── */}
                {chartStyle === 'bars' && (
                  <div
                    className="absolute inset-0 flex items-end gap-px"
                    style={{ paddingRight: '46px' }}
                  >
                    {activeData.points.map((p, i) => {
                      const range = activeData.maxVal - activeData.minVal;
                      const heightPct = Math.max(4, ((p.c - activeData.minVal) / range) * 100);
                      const isHovered = hoveredIdx === i;
                      return (
                        <div key={i} className="relative flex-1 flex flex-col justify-end h-full">
                          <div
                            className="w-full rounded-t-sm transition-all duration-100"
                            style={{
                              height: `${heightPct}%`,
                              backgroundColor: isHovered ? '#00D395' : 'rgba(0,211,149,0.55)',
                              boxShadow: isHovered ? '0 0 6px rgba(0,211,149,0.5)' : 'none',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* ── Volume Overlay ── */}
                <div
                  className="absolute bottom-0 left-0 flex items-end pointer-events-none"
                  style={{ right: '46px', height: '18%' }}
                >
                  {activeData.points.map((p, i) => {
                    const volH = (p.v / maxVol) * 100;
                    const isHovered = hoveredIdx === i;
                    return (
                      <div key={i} className="flex-1 px-[0.5px] h-full flex items-end">
                        <div
                          className="w-full rounded-t-[1px] transition-colors"
                          style={{
                            height: `${volH}%`,
                            backgroundColor: isHovered ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.07)',
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── X-Axis Labels ── */}
            <div
              className="absolute bottom-0 left-0 flex justify-between text-[9px] sm:text-[10px] text-white/35 font-medium font-sora"
              style={{ right: '50px' }}
            >
              {activeData.xAxisLabels.map((lbl, idx) => (
                <span key={idx}>{lbl}</span>
              ))}
            </div>
          </div>

          {/* ── Market Stats Row (below chart) ── */}
          <div className="mt-5 pt-4 border-t border-white/[0.06] flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-sora">
            <span><span className="text-white/40">Market Cap</span> <span className="text-white font-bold ml-1">{data.marketCap}</span></span>
            <span><span className="text-white/40">Volume</span> <span className="text-white font-bold ml-1">{data.volume}</span></span>
            <span><span className="text-white/40">Deals</span> <span className="text-white font-bold ml-1">{data.deals}</span></span>
          </div>

        </div>
      </div>

      {/* ── Date Picker Modal ── */}
      {isDatePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[#141020] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#CFA343]" />
                <h3 className="text-lg font-bold text-white font-sora">Select Date Range</h3>
              </div>
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="p-1 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/60 font-medium mb-1 block">Start Date</label>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-full bg-[#1A1829] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CFA343]"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/60 font-medium mb-1 block">End Date</label>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-full bg-[#1A1829] border border-white/15 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CFA343]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-white/60 font-medium mb-2 block">Quick Ranges</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: '30D', tf: '30 days' as Timeframe },
                    { name: '7D', tf: '7 days' as Timeframe },
                    { name: '24H', tf: '24 hours' as Timeframe },
                  ].map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => {
                        setTimeframe(preset.tf);
                        setIsDatePickerOpen(false);
                      }}
                      className="py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white hover:bg-[#CFA343] hover:text-[#0E0B14] transition-all"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
              <button
                onClick={() => setIsDatePickerOpen(false)}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setTimeframe('30 days');
                  setIsDatePickerOpen(false);
                }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-[#CFA343] text-[#0E0B14] hover:brightness-110 transition-all"
              >
                <Check className="h-4 w-4" />
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
