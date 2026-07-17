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
  ArrowUpRight,
  FileText,
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
import FeatureCards from '@/components/FeatureCards';
import DashboardNewsPortfolio from '@/components/DashboardNewsPortfolio';
import TickerTape from '@/components/TickerTape';
import Footer from '@/components/Footer';
import TrendingStocks from '@/components/TrendingStocks';
import ForeignMarketsSidebar from '@/components/ForeignMarketsSidebar';
import PublicProfile from '@/components/PublicProfile';
import ThreadView from '@/components/ThreadView';

// ─── NGX Ticker Carousel ──────────────────────────────
const ngxTickerData = [
  { id: 'GTCO', name: 'GTCO', badge: 'GTCO', price: '₦56,623.54', change: '1.41%', up: true, initials: 'GT', bg: '#C0392B', sparkPath: 'M0 22 C15 17,25 20,40 13 S60 9,75 11 S90 7,100 9' },
  { id: 'SEPLAT', name: 'SEPLAT', badge: 'SEPLAT', price: '₦4,267.90', change: '2.22%', up: true, initials: 'SP', bg: '#E67E22', sparkPath: 'M0 24 C12 19,22 22,38 15 S58 11,72 13 S88 9,100 11' },
  { id: 'MTNN', name: 'MTNN', badge: 'MTNN', price: '₦587.74', change: '0.82%', up: true, initials: 'MT', bg: '#F39C12', sparkPath: 'M0 20 C14 17,24 20,40 15 S60 13,76 14 S90 11,100 13' },
  { id: 'ARADEL', name: 'ARADEL', badge: 'ARADEL', price: '₦0.9998', change: '0.03%', up: true, initials: 'AR', bg: '#C0392B', sparkPath: 'M0 22 C16 19,26 21,42 17 S62 15,78 16 S92 13,100 15' },
  { id: 'DANGCEM', name: 'DANGCEM', badge: 'DANG', price: '₦312.50', change: '0.48%', up: false, initials: 'DC', bg: '#2980B9', sparkPath: 'M0 10 C12 13,22 12,38 16 S58 18,74 17 S90 21,100 20' },
  { id: 'ZENITH', name: 'ZENITHBANK', badge: 'ZENITH', price: '₦42,780.00', change: '3.20%', up: true, initials: 'ZB', bg: '#7D3C98', sparkPath: 'M0 24 C10 18,22 21,38 13 S58 9,74 11 S90 7,100 9' },
];

function NGXTickerCarousel() {
  const [offset, setOffset] = React.useState(0);
  const visible = 4;
  const max = ngxTickerData.length - visible;
  const cards = ngxTickerData.slice(offset, offset + visible);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">

      {/* ── Section heading ── */}
      <div>
        <h2 className="text-2xl font-bold text-white font-sora leading-tight">
          Nigerian Exchange
        </h2>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: '#CFA343' }}>
          150+ equities · Lagos
        </p>
      </div>

      {/* ── Carousel wrapper with outer nav arrows ── */}
      <div className="relative">

        {/* Left arrow */}
        <button
          onClick={() => setOffset(o => Math.max(0, o - 1))}
          disabled={offset === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:border-white/25 transition-all disabled:opacity-20 focus:outline-none"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => setOffset(o => Math.min(max, o + 1))}
          disabled={offset >= max}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 hover:border-white/25 transition-all disabled:opacity-20 focus:outline-none"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        {/* Card row — no outer container style, cards float freely */}
        <div className="w-full flex gap-3">

          {cards.map((s) => (
            <div
              key={s.id}
              className="relative flex-1 flex flex-col gap-4 px-5 py-6 cursor-pointer rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.055)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
            >
              {/* Row 1: logo circle + name + badge + ↗ */}
              <div className="flex items-center gap-2">
                <div
                  className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: s.bg, boxShadow: `0 0 14px ${s.bg}60` }}
                >
                  {s.initials}
                </div>
                <span className="text-[12px] font-extrabold text-white font-sora flex-1 truncate">{s.name}</span>
                <span
                  className="text-[8px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}
                >
                  {s.badge}
                </span>
                <div
                  className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)' }}
                >
                  <ArrowUpRight className="h-3 w-3 text-white/50" />
                </div>
              </div>

              {/* Row 2: Price */}
              <p className="text-[16px] font-extrabold font-sora text-white leading-none">{s.price}</p>

              {/* Row 3: Sparkline */}
              <div className="h-7 w-full">
                <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path
                    d={`${s.sparkPath} L100 24 L0 24 Z`}
                    fill={s.up ? 'rgba(16,185,129,0.10)' : 'rgba(255,77,77,0.08)'}
                  />
                  <path
                    d={s.sparkPath}
                    fill="none"
                    stroke={s.up ? '#10B981' : '#FF4D4D'}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* Row 4: Change % */}
              <p className="text-[12px] font-semibold text-white/75">{s.change}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── US Markets Carousel ─────────────────────────────
const usStockData = [
  { id: 'AAPL', name: 'Apple',     badge: 'AAPL', price: '$142.7', change: '+0.66%', up: true,  bg: '#555555', sparkPath: 'M0 20 C14 17,24 18,40 13 S60 10,76 12 S90 9,100 11' },
  { id: 'TSLA', name: 'Tesla',     badge: 'TSLA', price: '$245.9', change: '-1.22%', up: false, bg: '#CC0000', sparkPath: 'M0 8 C12 11,22 10,38 15 S58 18,74 16 S90 20,100 19' },
  { id: 'MSFT', name: 'Microsoft', badge: 'MSFT', price: '$378.5', change: '+0.44%', up: true,  bg: '#00A4EF', sparkPath: 'M0 18 C14 15,24 17,40 12 S60 9,76 11 S90 8,100 10' },
  { id: 'META', name: 'Meta',      badge: 'META', price: '$528.3', change: '+1.84%', up: true,  bg: '#0082FB', sparkPath: 'M0 22 C12 18,22 20,38 14 S58 10,74 12 S90 9,100 11' },
  { id: 'AMZN', name: 'Amazon',    badge: 'AMZN', price: '$192.7', change: '+2.11%', up: true,  bg: '#FF9900', sparkPath: 'M0 22 C10 17,22 19,38 12 S58 8,74 10 S90 7,100 9'  },
  { id: 'NVDA', name: 'Nvidia',    badge: 'NVDA', price: '$875.4', change: '+3.56%', up: true,  bg: '#76B900', sparkPath: 'M0 23 C10 18,22 20,38 13 S58 9,74 11 S90 7,100 9'  },
];

function USMarketsCarousel() {
  const [offset, setOffset] = React.useState(0);
  const visible = 4;
  const max = usStockData.length - visible;
  const cards = usStockData.slice(offset, offset + visible);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white font-sora leading-tight">US Markets (NYSE &amp; NASDAQ)</h2>
        <p className="text-[12px] font-medium mt-0.5" style={{ color: '#CFA343' }}>8,000+ equities &middot; New York</p>
      </div>

      <div className="relative">
        <button onClick={() => setOffset(o => Math.max(0, o - 1))} disabled={offset === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all disabled:opacity-20 focus:outline-none"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          <ArrowLeft className="h-3.5 w-3.5" />
        </button>
        <button onClick={() => setOffset(o => Math.min(max, o + 1))} disabled={offset >= max}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 z-10 w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all disabled:opacity-20 focus:outline-none"
          style={{ background: 'rgba(0,0,0,0.3)' }}>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>

        <div className="flex gap-3">
          {cards.map((s) => (
            <div key={s.id}
              className="flex-1 flex flex-col gap-4 px-5 py-6 rounded-xl cursor-pointer"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'background 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.055)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)'}
            >
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[9px] font-black"
                  style={{ background: s.bg, boxShadow: `0 0 12px ${s.bg}55` }}>
                  {s.id.slice(0, 2)}
                </div>
                <span className="text-[12px] font-extrabold text-white font-sora flex-1 truncate">{s.name}</span>
                <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}>{s.badge}</span>
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <ArrowUpRight className="h-3 w-3 text-white/50" />
                </div>
              </div>
              <p className="text-[16px] font-extrabold font-sora text-white leading-none">{s.price}</p>
              <div className="h-7 w-full">
                <svg className="w-full h-full" viewBox="0 0 100 24" preserveAspectRatio="none">
                  <path d={`${s.sparkPath} L100 24 L0 24 Z`} fill={s.up ? 'rgba(16,185,129,0.10)' : 'rgba(255,77,77,0.08)'} />
                  <path d={s.sparkPath} fill="none" stroke={s.up ? '#10B981' : '#FF4D4D'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="text-[12px] font-semibold" style={{ color: s.up ? '#10B981' : '#FF4D4D' }}>{s.change}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Rating System Deep Dive ─────────────────────────
function RatingSystemDeepDive() {
  const sentiments = [
    { name: 'BULLISH', bg: '#071F1A', desc: 'Strong fundamentals & attractive valuation. Company worth more than current price.' },
    { name: 'NEUTRAL', bg: '#271911', desc: 'Mixed signals. Warrants monitoring. Neither a clear buy nor a red flag.' },
    { name: 'BEARISH', bg: '#231114', desc: 'Deteriorating fundamentals or overvaluation. Caution advised.' },
    { name: 'WATCH', bg: '#111A24', desc: 'Something is changing. Could become Bullish or Bearish - track development.' }
  ];

  const pillars = [
    { title: 'Valuation', desc: 'P/E, P/B, EV/EBITDA vs sector & history' },
    { title: 'Revenue Growth', desc: '3-years CAGR and trend direction' },
    { title: 'Earnings Performance', desc: 'EPS trend, earning surprises, forecast accuracy' },
    { title: 'Dividend Strength', desc: 'Yield, payout ratio, dividend consistency' },
    { title: 'Balance Sheet Quality', desc: 'Debt/equity, current ratio, interest coverage' },
    { title: 'Market Momentum', desc: 'Price vs 52-week range, volume, relative strength' },
    { title: 'Profitability', desc: 'ROE, ROA, EBITDA margins' }
  ];

  return (
    <div className="w-full mt-24 text-left max-w-7xl mx-auto px-5 sm:px-8">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[12px] font-semibold text-[#CFA343] block mb-2">
          Product Deep Dive
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sora mb-2">
          The EquityStack Rating System
        </h2>
        <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Every rating is drive by 7 measurable pillars - fully transparent, locally calibrated
        </p>
      </div>

      {/* 4 Sentiments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
        {sentiments.map((s) => (
          <div key={s.name} className="rounded-xl p-6 flex flex-col items-center justify-start text-center" style={{ background: s.bg }}>
            <h3 className="text-[14px] font-bold text-white font-sora tracking-wide mb-3">{s.name}</h3>
            <p className="text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 7 Pillars Grid */}
      <div>
        <p className="text-[13px] font-semibold text-white mb-6">
          The 7 scoring pillars behind every ratings:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pillars.map((p, idx) => (
            <div 
              key={p.title} 
              className={`rounded-xl p-5 flex items-center gap-4 ${idx === 6 ? 'lg:col-start-2' : ''}`}
              style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.03)' }}
            >
              <div className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center bg-[#2B273A] relative">
                <span className="text-white font-bold text-xl italic font-serif">e</span>
                <span className="absolute bottom-2.5 right-2 w-2.5 h-2.5 rounded-full bg-white border-2 border-[#2B273A] flex items-center justify-center">
                  <span className="w-1 h-1 rounded-full bg-[#2B273A]"></span>
                </span>
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-white font-sora mb-1">{p.title}</h4>
                <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Market Report Section ─────────────────────────────
function MarketReportSection() {
  return (
    <div className="w-full mt-24 max-w-7xl mx-auto px-5 sm:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left Side: Content */}
        <div className="text-left">
          <span className="text-[12px] font-semibold text-[#CFA343] uppercase tracking-wider block mb-3">
            Market Report
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sora leading-tight mb-6">
            Every Saturday, the market comes to your inbox.
          </h2>
          <p className="text-[14px] leading-relaxed text-white/70 mb-6">
            The EquityStack Weekly Market Report is a comprehensive briefing on Nigerian stock market performance &mdash; sector highlights, notable price movements, volume leaders, and economic analysis. Delivered every Saturday so you're ready when Monday opens.
          </p>
          <ul className="space-y-3 mb-8">
            {[
              'Full NGX weekly performance summary',
              'Sector-by-sector breakdown',
              'Notable movers and volume leaders',
              'Economic developments and macro impact analysis',
              'Delivered to every subscriber\'s inbox, every Saturday'
            ].map((item, idx) => (
              <li key={idx} className="flex items-center gap-3 text-[13px] text-white/80">
                <span className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <button className="bg-[#CFA343] hover:bg-[#B58C35] text-[#111] font-bold py-3 px-6 rounded-full text-sm transition-colors focus:outline-none">
            Subscribe for Free
          </button>
        </div>

        {/* Right Side: Card Mockup */}
        <div className="rounded-2xl border border-white/5" style={{ background: '#111116' }}>
          {/* Card Header */}
          <div className="p-6 sm:p-8 flex items-start justify-between">
            <div>
              <h4 className="text-white font-bold text-[15px] font-sora mb-1.5">EquityStack Weekly Market Report</h4>
              <p className="text-[11px] text-white/40">Week ended 21 June 2026 &middot; Delivered Saturday</p>
            </div>
            <div className="px-3 py-1 rounded-md text-[10px] font-bold text-[#CFA343] border border-[#CFA343]/20" style={{ background: 'rgba(207,163,67,0.05)' }}>
              Issue #24
            </div>
          </div>
          
          <div className="w-full border-t border-white/5" />

          {/* Card Data */}
          <div className="p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">NGX All-Share Index</span>
              <span className="text-[13px] font-semibold text-[#10B981]">104,256.80 <span className="text-[10px]">▲</span>1.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">Market Cap</span>
              <span className="text-[13px] font-semibold text-white">₦58.3tn</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">Weekly Volume</span>
              <span className="text-[13px] font-semibold text-white">2.14bn shares</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">Top Gainer</span>
              <span className="text-[13px] font-semibold text-[#10B981]">DANGCEM +8.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">Top Loser</span>
              <span className="text-[13px] font-semibold text-[#FF4D4D]">STANBIC -3.4%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">Sector Leader</span>
              <span className="text-[13px] font-semibold text-white">Banking +3.1%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[12px] text-white/50">MPR (CBN)</span>
              <span className="text-[13px] font-semibold text-white">26.75% &mdash; Unchanged</span>
            </div>
          </div>

          <div className="w-full border-t border-white/5" />

          {/* Card Footer */}
          <div className="p-5 sm:px-8 text-[11px] text-white/30 text-center sm:text-left rounded-b-2xl" style={{ background: 'rgba(255,255,255,0.01)' }}>
            Next report: Saturday, 28 June 2026 &middot; Delivered 8:00 AM WAT
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── News Section ───────────────────────────────────────
function NewsSection() {
  const newsItems = [
    {
      title: 'What is the stock market? all you need to know',
      badge: 'MARKET BASIC',
      desc: 'Equities represent fractional ownership in companies. They are traded securely on the exchange.',
      gradient: 'linear-gradient(135deg, #1c2b39, #0f171e)',
    },
    {
      title: 'Can dividend investing build long-term wealth?',
      badge: 'INVESTING 101',
      desc: 'From capital appreciation to earning yield, key ways stocks can help you build wealth over time.',
      gradient: 'linear-gradient(135deg, #162447, #0b1224)',
    },
    {
      title: 'How to set up a brokerage account for trading',
      badge: 'TIPS & TRICKS',
      desc: 'A brokerage account is essential for securely buying, selling, and holding your stock portfolio.',
      gradient: 'linear-gradient(135deg, #3d2c23, #1e1511)',
    },
    {
      title: 'The facts about blue-chip stocks you must know',
      badge: 'MARKET BASIC',
      desc: 'Blue-chip companies are large, established, and financially sound market leaders with a history of reliable growth.',
      gradient: 'linear-gradient(135deg, #4d3a19, #261d0c)',
    },
    {
      title: 'When is the best time to invest in equities?',
      badge: 'TIPS & TRICKS',
      desc: 'When market prices are fluctuating, how do you determine the optimal entry point for your portfolio?',
      gradient: 'linear-gradient(135deg, #091c33, #040d1a)',
    },
    {
      title: 'What is a Bear Market? Inside market corrections.',
      badge: 'TIPS & TRICKS',
      desc: 'Welcome to market cycles. Understanding economic downturns is the key to long-term success.',
      gradient: 'linear-gradient(135deg, #2b2b2b, #151515)',
    }
  ];

  return (
    <div className="w-full mt-32 max-w-7xl mx-auto px-5 sm:px-8 mb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sora mb-6">
          News
        </h2>
        <p className="text-[13px] leading-relaxed text-white/60">
          Stay current with a curated feed of Nigerian financial news. From corporate announcements and regulatory updates to macroeconomic developments, the News section ensures you're always working with the latest information relevant to your investment decisions.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Large Feature Card (Spans 2 columns) */}
        <div className="col-span-1 md:col-span-2 rounded-2xl overflow-hidden cursor-pointer group relative flex flex-col justify-end p-8" style={{ background: 'linear-gradient(135deg, #2d184a, #150a24)', minHeight: '320px' }}>
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiNmZmYiLz48L3N2Zz4=')]"></div>
          
          <div className="relative z-10 space-y-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-white font-sora leading-tight group-hover:text-[#CFA343] transition-colors">
              All about Investing in NGX Equities and related risks
            </h3>
            <span className="inline-block px-3 py-1.5 text-[9px] font-bold text-white/70 uppercase tracking-widest rounded bg-white/5 border border-white/10">
              EQUITY BASIC
            </span>
          </div>
        </div>

        {/* Regular Cards */}
        {newsItems.map((item, idx) => (
          <div key={idx} className="col-span-1 rounded-2xl overflow-hidden cursor-pointer group flex flex-col" style={{ background: '#111116', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div className="h-32 w-full" style={{ background: item.gradient }}></div>
            <div className="p-6 space-y-3 flex-1 flex flex-col items-start">
              <span className="inline-block px-2.5 py-1 text-[8px] font-bold text-white/60 uppercase tracking-widest rounded bg-white/5 border border-white/10">
                {item.badge}
              </span>
              <h4 className="text-[14px] font-bold text-white font-sora leading-tight group-hover:text-[#CFA343] transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-white/50 leading-relaxed mt-auto">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Link */}
      <div className="text-left mt-2">
        <a href="#" className="text-[13px] font-bold text-[#10B981] hover:underline">
          See All Articles
        </a>
      </div>
    </div>
  );
}

// ─── Footer Section ───────────────────────────────────────
function FooterSection() {
  return (
    <div className="w-full bg-[#0B0C10] pt-20 pb-8 mt-12 border-t border-white/5 relative z-10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-lg overflow-hidden flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(207,163,67,0.2)' }}>
                <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
              </div>
              <span className="font-sora font-medium text-white tracking-tight">EquityStack</span>
            </div>
            <p className="text-[12px] leading-relaxed text-white/50 mb-8 max-w-sm">
              Africa's intelligence layer for capital markets. Built for Nigerian investors, by people who care about the market.
            </p>
            <div className="flex items-center gap-4 text-white/40">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="YouTube">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Platform */}
            <div>
              <h4 className="text-[13px] font-bold text-white mb-6">Platform</h4>
              <ul className="space-y-4 text-[12px] text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Legal & privacy</a></li>
              </ul>
            </div>
            
            {/* Markets */}
            <div>
              <h4 className="text-[13px] font-bold text-white mb-6">Markets</h4>
              <ul className="space-y-4 text-[12px] text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">Applications</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Buy Equities</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Affiliate</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Institutional Services</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-[13px] font-bold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-[12px] text-white/50">
                <li><a href="#" className="hover:text-white transition-colors">What is the Stock Market?</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Basic</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tips and Tutorials</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Market Update</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="w-full border-t border-white/5 pt-8 text-center">
          <p className="text-[10px] font-medium text-white/40">
            &copy; {new Date().getFullYear()} EquityStack &middot; Nigerian Financial Intelligence Platform &middot; MVP v1.0 &middot; Strictly Confidential
          </p>
        </div>
      </div>
    </div>
  );
}

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
  const currentView = useAppStore((s) => s.currentView);
  const setView = useAppStore((s) => s.setView);
  const setSelectedTicker = useAppStore((s) => s.setSelectedTicker);
  const updateProfileImage = useAppStore((s) => s.updateProfileImage);
  const user = useAppStore((s) => s.user);
  const loginUser = useAppStore((s) => s.loginUser);
  const signInUser = useAppStore((s) => s.signInUser);
  const setOnboarding = useAppStore((s) => s.setOnboarding);
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const logoutUser = useAppStore((s) => s.logoutUser);
  const watchlist = useAppStore((s) => s.watchlist);
  const fetchMarketData = useAppStore((s) => s.fetchMarketData);
  const stocks = useAppStore((s) => s.stocks);
  const news = useAppStore((s) => s.news);
  const fetchNews = useAppStore((s) => s.fetchNews);

  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);
  const [welcomeBackName, setWelcomeBackName] = useState('');
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [activeHomeTab, setActiveHomeTab] = useState<'report' | 'dividend' | 'growth' | 'analyst' | 'safe'>('report');
  const [isHeaderSearchOpen, setIsHeaderSearchOpen] = useState(false);
  const [headerSearchQuery, setHeaderSearchQuery] = useState('');
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(1);
  const [isLandingMenuOpen, setIsLandingMenuOpen] = useState(false);

  const switchAuthMode = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthError('');
    setPasswordInput('');
    setConfirmInput('');
    setShowPassword(false);
  };

  React.useEffect(() => {
    fetchMarketData();
    fetchNews();
  }, [fetchMarketData, fetchNews]);

  // Scroll to top on every view change (including refresh)
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

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

  // Auto-dismiss the welcome-back overlay after 2.5 s
  React.useEffect(() => {
    if (!showWelcomeBack) return;
    const t = setTimeout(() => setShowWelcomeBack(false), 2500);
    return () => clearTimeout(t);
  }, [showWelcomeBack]);

  const availableInterests = ['Banking', 'Consumer Goods', 'Oil & Gas', 'Industrials', 'Agriculture', 'Technology'];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    // ── Validation ──────────────────────────────────────
    if (!emailInput.trim()) {
      setAuthError('Please enter your email address.');
      return;
    }
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(emailInput.trim())) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!passwordInput) {
      setAuthError('Please enter your password.');
      return;
    }
    if (authMode === 'signup') {
      if (!nameInput.trim()) {
        setAuthError('Please enter your full name.');
        return;
      }
      if (passwordInput.length < 8) {
        setAuthError('Password must be at least 8 characters.');
        return;
      }
      if (passwordInput !== confirmInput) {
        setAuthError('Passwords do not match.');
        return;
      }
    }

    // ── All valid: proceed ──────────────────────────────
    setIsAuthModalOpen(false);

    if (authMode === 'login') {
      // Sign-in: skip onboarding, show welcome overlay
      const displayName = nameInput.trim() || emailInput.split('@')[0];
      setWelcomeBackName(displayName);
      setShowWelcomeBack(true);
      signInUser(displayName, emailInput.trim());
    } else {
      // Sign-up: go through onboarding wizard
      loginUser(nameInput.trim() || emailInput.split('@')[0], emailInput.trim());
    }
  };

  const handleOnboardingNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (onboardingStep < 3) setOnboardingStep(onboardingStep + 1);
    else completeOnboarding();
  };

  const handleOnboardingSkip = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setOnboarding({ experienceLevel: 'Beginner', interests: [] });
    completeOnboarding();
  };

  const renderViewContent = () => {
    let content;
    switch (currentView) {
      case 'home': content = renderHomeView(); break;
      case 'markets': content = <StockExplorer />; break;
      case 'news': content = <AINewsFeed />; break;
      case 'portfolio': content = <PortfolioTracker />; break;
      case 'profile': content = renderProfileView(); break;
      case 'stock-detail': content = <StockDetail />; break;
      case 'about': content = <AboutUs />; break;
      case 'learn': content = <Stock101 />; break;
      case 'community': content = <Community />; break;
      case 'trade': content = <TradePage />; break;
      case 'public-profile': content = <PublicProfile />; break;
      case 'post-thread': content = <ThreadView />; break;
      default: content = renderHomeView();
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
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
        
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden w-full">
          <button 
            onClick={() => setIsHomeMenuOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#191A1D] rounded-xl text-[13px] font-bold text-white border border-white/5 focus:outline-none"
          >
            <Menu className="w-4 h-4 text-brand-primary" />
            Dashboard Menu
          </button>
        </div>

        {/* ─── Left Sidebar (Off-canvas on mobile) ─── */}
        {isHomeMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setIsHomeMenuOpen(false)} />
        )}
        <div className={`fixed top-0 bottom-0 left-0 z-50 lg:static lg:z-auto w-[280px] lg:w-[280px] flex-shrink-0 flex flex-col lg:sticky lg:top-6 h-full lg:h-auto overflow-y-auto lg:overflow-visible transition-transform duration-300 ${isHomeMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`} style={{ background: '#121212' }}>
          {/* Mobile Close Header */}
          <div className="lg:hidden flex justify-end p-4 border-b border-[#2C2D30]">
            <button onClick={() => setIsHomeMenuOpen(false)} className="p-2 text-white/50 hover:text-white rounded-lg bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Menu Navigation */}
          <div className="p-5 pb-6 border-b border-[#2C2D30]">
            <h3 className="text-[13px] font-bold text-[#E5E7EB] font-dm-sans mb-5">
              Menu
            </h3>
            <div className="flex flex-col gap-2">
              {([
                { id: 'report', label: 'Daily Market Report', color: '#D4AF37' },
                { id: 'dividend', label: 'Best Dividend Paying Stocks', color: '#EC4899' },
                { id: 'growth', label: 'Fast Growing Companies', color: '#A855F7' },
                { id: 'analyst', label: 'Top Analyst Picks', color: '#FCD34D' },
                { id: 'safe', label: 'Play Safe Stocks', color: '#F87171' }
              ] as const).map((tab) => {
                const isSelected = activeHomeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveHomeTab(tab.id);
                      setIsHomeMenuOpen(false); // Auto-close on mobile
                    }}
                    className="flex items-center justify-between px-3 py-3 rounded-xl text-[14px] font-semibold transition-all duration-200 focus:outline-none"
                    style={isSelected
                      ? { backgroundColor: '#2D2619', color: '#FFFFFF' }
                      : { color: '#8B95A5' }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: tab.color }} />
                      <span className="flex-1 text-left">{tab.label}</span>
                      {!isSelected && <ChevronDown className="h-4 w-4 text-[#8B95A5]/70 flex-shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Watchlist Preview Sidebar */}
          <div className="p-5 pt-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[13px] font-bold text-[#E5E7EB] font-dm-sans">
                Watchlist Preview
              </h3>
            </div>
            
            <div className="flex flex-col gap-1">
              {watchStocks.slice(0, 6).map((stock) => {
                const getCryptoIcon = (ticker: string) => {
                  switch (ticker.toUpperCase()) {
                    case 'MTNN':
                      return (
                        <div className="w-7 h-7 rounded-full bg-[#F7931A] flex items-center justify-center text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16.624 10.648c.84-1.282.884-2.828.118-4.047-1.026-1.636-3.136-2.072-5.143-1.666V2.368h-1.57v2.441c-.428.082-.86.177-1.293.284V2.368H7.166v2.966c-.958.256-1.888.55-2.775.877l.676 1.832c.571-.21 1.157-.406 1.748-.588v7.925c-.53.125-1.055.263-1.57.412l.628 1.954c.954-.265 1.954-.537 2.973-.787v3.08h1.57v-3.355c.446-.091.895-.182 1.346-.269v3.614h1.57v-3.878c2.408-.344 4.708-1.266 5.617-3.523.63-1.558.117-2.915-.65-3.921zm-4.321 4.542c-1.391.31-2.996.55-4.225.772v-3.79c1.196-.242 2.723-.526 4.015-.815 1.488-.333 2.502.164 2.766 1.134.256.945-.63 2.302-2.556 2.699zm.507-4.831c-1.229.288-2.593.53-3.729.743v-3.327c1.077-.22 2.348-.445 3.468-.674 1.258-.258 2.075.147 2.296.88.22.735-.41 1.996-2.035 2.378z"/>
                          </svg>
                        </div>
                      );
                    case 'DANGCEM':
                      return (
                        <div className="w-7 h-7 rounded-full bg-[#10B981] flex items-center justify-center text-white">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" transform="rotate(-15)">
                            <path d="M16.624 10.648c.84-1.282.884-2.828.118-4.047-1.026-1.636-3.136-2.072-5.143-1.666V2.368h-1.57v2.441c-.428.082-.86.177-1.293.284V2.368H7.166v2.966c-.958.256-1.888.55-2.775.877l.676 1.832c.571-.21 1.157-.406 1.748-.588v7.925c-.53.125-1.055.263-1.57.412l.628 1.954c.954-.265 1.954-.537 2.973-.787v3.08h1.57v-3.355c.446-.091.895-.182 1.346-.269v3.614h1.57v-3.878c2.408-.344 4.708-1.266 5.617-3.523.63-1.558.117-2.915-.65-3.921zm-4.321 4.542c-1.391.31-2.996.55-4.225.772v-3.79c1.196-.242 2.723-.526 4.015-.815 1.488-.333 2.502.164 2.766 1.134.256.945-.63 2.302-2.556 2.699zm.507-4.831c-1.229.288-2.593.53-3.729.743v-3.327c1.077-.22 2.348-.445 3.468-.674 1.258-.258 2.075.147 2.296.88.22.735-.41 1.996-2.035 2.378z"/>
                          </svg>
                        </div>
                      );
                    case 'ZENITHBANK':
                      return (
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                            <path fill="#E15132" d="M12 21.6A9.6 9.6 0 1012 2.4a9.6 9.6 0 000 19.2z"/>
                            <path fill="#FFF" d="M9 13.5c1.5-1.5 4.5-1.5 6 0l2 2a7 7 0 01-10 0l2-2z"/>
                            <circle fill="#000" cx="10" cy="11" r="1.5"/>
                            <circle fill="#000" cx="14" cy="11" r="1.5"/>
                            <path fill="#000" d="M11 13.5h2l-1 1.5z"/>
                          </svg>
                        </div>
                      );
                    case 'GTCO':
                      return (
                        <div className="w-7 h-7 rounded-full bg-[#EF4444] flex items-center justify-center">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                            <path d="M12 2L2 21h20L12 2zm0 4.5l6.5 12.5h-13L12 6.5z"/>
                          </svg>
                        </div>
                      );
                    default:
                      return (
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold" style={{ backgroundColor: stock.change >= 0 ? '#10B981' : '#EF4444' }}>
                          {stock.ticker.charAt(0)}
                        </div>
                      );
                  }
                };

                const min = Math.min(...stock.sparkline);
                const max = Math.max(...stock.sparkline);
                const range = max - min || 1;
                const W = 60;
                const H = 20;

                const points = stock.sparkline.map((val, idx) => ({
                  x: (idx / (stock.sparkline.length - 1)) * W,
                  y: H - 2 - ((val - min) / range) * (H - 4),
                }));
                const linePath = points.reduce((d, p, i) => d + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
                const lineColor = stock.change >= 0 ? '#10B981' : '#EF4444';

                return (
                  <button key={stock.ticker} onClick={() => setSelectedTicker(stock.ticker)}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors focus:outline-none text-left w-full group gap-4">
                    <div className="flex items-center gap-4">
                      {getCryptoIcon(stock.ticker)}
                      <span className="text-[14px] font-bold text-[#8B95A5]">
                        {stock.ticker}
                      </span>
                    </div>
                    <div className="flex-1 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
                        <path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>
                );
              })}
            </div>

            <button onClick={() => setView('markets')}
              className="mt-6 text-[12px] font-bold text-[#D4AF37] hover:underline font-dm-sans focus:outline-none w-full text-left px-2">
              Manage all stocks &gt;
            </button>
          </div>
        </div>

        {/* ─── Main Content Area ─── */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-6">
          {activeHomeTab === 'report' && (
            <div className="space-y-6 animate-in fade-in duration-300 text-left">
              <MarketStatus />
              
              {/* Mobile-only Foreign Markets insertion right after All-Share Index */}
              <div className="w-full lg:hidden">
                <ForeignMarketsSidebar />
              </div>

              <TopMovers />
              <AIDailyBrief />
              <div className="flex flex-col xl:flex-row gap-6 w-full">
                <div className="flex-1 min-w-0">
                  <DashboardNewsPortfolio />
                </div>
                <div className="hidden lg:block xl:w-[320px] flex-shrink-0">
                  <ForeignMarketsSidebar />
                </div>
              </div>
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
                        {({ Outperform: 'Bullish', Neutral: 'Watch', Underperform: 'Bearish' } as Record<string, string>)[stock.rating] ?? stock.rating}
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

          {/* AI News Snapshot (only show on report tab for cleanliness, or always?) Let's keep it below */}
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
          <div className="relative group h-16 w-16 rounded-full flex-shrink-0">
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="h-full w-full object-cover rounded-full" style={{ boxShadow: '0 0 20px rgba(207,163,67,0.35)' }} />
            ) : (
              <div className="h-full w-full rounded-full flex items-center justify-center font-sora text-xl font-extrabold text-bg-base"
                style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 20px rgba(207,163,67,0.35)' }}>
                {user?.name?.slice(0, 2).toUpperCase() || 'ES'}
              </div>
            )}
            <label className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span className="text-[10px] font-bold text-white">Upload</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const url = URL.createObjectURL(file);
                  updateProfileImage(url);
                }
              }} />
            </label>
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
                className={`py-2 rounded-lg text-xs font-bold font-dm-sans transition-all duration-200 focus:outline-none ${user?.experienceLevel === lvl ? 'text-bg-base' : 'text-text-secondary hover:text-text-primary'
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


  const renderAuthModal = () => {
    const pwStrength = (() => {
      if (!passwordInput) return 0;
      let s = 0;
      if (passwordInput.length >= 8) s++;
      if (/[A-Z]/.test(passwordInput)) s++;
      if (/[0-9]/.test(passwordInput)) s++;
      if (/[^A-Za-z0-9]/.test(passwordInput)) s++;
      return s;
    })();
    const pwColors = ['#FF4D4F', '#FF7B00', '#CFA343', '#00D395'];
    const pwLabels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
      <>
        {isAuthModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
            onClick={() => setIsAuthModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-3xl p-6 sm:p-8 relative overflow-hidden"
              style={{ background: '#0E0B14', border: '1px solid rgba(207,163,67,0.25)', boxShadow: '0 0 0 1px rgba(207,163,67,0.04), 0 40px 80px rgba(0,0,0,0.9)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top gradient border */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)' }} />
              {/* Ambient glow */}
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.1) 0%, transparent 70%)' }} />

              {/* Close */}
              <button
                onClick={() => setIsAuthModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-[#7B7E8E] hover:text-white transition-colors focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                ✕
              </button>

              <div className="relative z-10">
                {/* Brand */}
                <div className="flex items-center gap-2.5 mb-6">
                  <div className="h-9 w-9 rounded-xl overflow-hidden flex items-center justify-center" style={{ boxShadow: '0 0 12px rgba(207,163,67,0.4)' }}>
                    <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
                  </div>
                  <span className="font-sora font-extrabold text-white text-sm tracking-tight">EquityStack</span>
                </div>

                {/* Mode tabs */}
                <div className="flex gap-1 p-1 rounded-xl mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {(['signup', 'login'] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => switchAuthMode(m)}
                      className="flex-1 py-2 rounded-lg text-[12px] font-bold transition-all focus:outline-none"
                      style={{
                        background: authMode === m ? '#CFA343' : 'transparent',
                        color:      authMode === m ? '#0E0B14' : '#7B7E8E',
                      }}
                    >
                      {m === 'signup' ? 'Create Account' : 'Sign In'}
                    </button>
                  ))}
                </div>

                <h2 className="text-xl font-extrabold font-sora tracking-tight mb-1 text-white">
                  {authMode === 'signup' ? 'Start Your Journey' : 'Welcome Back 👋'}
                </h2>
                <p className="text-[11px] text-[#7B7E8E] font-medium mb-5">
                  {authMode === 'signup'
                    ? 'Join thousands of retail investors on the NGX.'
                    : 'Enter your credentials to access your dashboard.'}
                </p>

                {/* Error banner */}
                {authError && (
                  <div className="mb-4 px-4 py-2.5 rounded-xl text-[11px] font-bold flex items-center gap-2" style={{ background: 'rgba(255,77,79,0.1)', border: '1px solid rgba(255,77,79,0.25)', color: '#FF4D4F' }}>
                    <span>⚠</span> {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4" noValidate>
                  {/* Full Name — signup only */}
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-[10px] text-[#7B7E8E] font-bold uppercase tracking-wider mb-1.5">Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Tunde Balogun"
                        value={nameInput}
                        onChange={(e) => { setNameInput(e.target.value); setAuthError(''); }}
                        className={inputCls}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'rgba(207,163,67,0.5)')}
                        onBlur={e => (e.target.style.borderColor = '#23214C')}
                      />
                    </div>
                  )}

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] text-[#7B7E8E] font-bold uppercase tracking-wider mb-1.5">Email Address</label>
                    <input
                      type="email"
                      placeholder="e.g. tunde@gmail.com"
                      value={emailInput}
                      onChange={(e) => { setEmailInput(e.target.value); setAuthError(''); }}
                      className={inputCls}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = 'rgba(207,163,67,0.5)')}
                      onBlur={e => (e.target.style.borderColor = '#23214C')}
                    />
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[10px] text-[#7B7E8E] font-bold uppercase tracking-wider">Password</label>
                      {authMode === 'login' && (
                        <button type="button" className="text-[10px] text-[#CFA343] font-bold hover:underline focus:outline-none">
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder={authMode === 'signup' ? 'At least 8 characters' : 'Enter your password'}
                        value={passwordInput}
                        onChange={(e) => { setPasswordInput(e.target.value); setAuthError(''); }}
                        className={`${inputCls} pr-12`}
                        style={inputStyle}
                        onFocus={e => (e.target.style.borderColor = 'rgba(207,163,67,0.5)')}
                        onBlur={e => (e.target.style.borderColor = '#23214C')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(s => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7B7E8E] hover:text-white transition-colors focus:outline-none text-[11px] font-bold"
                      >
                        {showPassword ? 'HIDE' : 'SHOW'}
                      </button>
                    </div>

                    {/* Password strength bar — signup only */}
                    {authMode === 'signup' && passwordInput && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1,2,3,4].map(i => (
                            <div key={i} className="h-1 flex-1 rounded-full transition-all" style={{ background: i <= pwStrength ? pwColors[pwStrength - 1] : 'rgba(255,255,255,0.08)' }} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: pwColors[pwStrength - 1] || '#7B7E8E' }}>
                          {pwStrength > 0 ? pwLabels[pwStrength - 1] : ''}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password — signup only */}
                  {authMode === 'signup' && (
                    <div>
                      <label className="block text-[10px] text-[#7B7E8E] font-bold uppercase tracking-wider mb-1.5">Confirm Password</label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Re-enter your password"
                          value={confirmInput}
                          onChange={(e) => { setConfirmInput(e.target.value); setAuthError(''); }}
                          className={`${inputCls} pr-10`}
                          style={inputStyle}
                          onFocus={e => (e.target.style.borderColor = confirmInput && confirmInput !== passwordInput ? 'rgba(255,77,79,0.5)' : 'rgba(207,163,67,0.5)')}
                          onBlur={e => (e.target.style.borderColor = '#23214C')}
                        />
                        {confirmInput && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px]">
                            {confirmInput === passwordInput ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-[12px] font-extrabold transition-all text-[#0E0B14] mt-2 focus:outline-none hover:opacity-90 active:scale-[0.98]"
                    style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 20px rgba(207,163,67,0.35)' }}
                  >
                    {authMode === 'signup' ? 'Create My Account →' : 'Sign In →'}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-5 flex items-center">
                  <div className="flex-grow border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                  <span className="mx-3 text-[10px] font-bold text-[#44475A] uppercase">or continue with</span>
                  <div className="flex-grow border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                </div>

                {/* Google */}
                <button
                  onClick={() => { loginUser(nameInput.trim() || 'Google User', emailInput.trim() || 'user@gmail.com'); setIsAuthModalOpen(false); }}
                  className="w-full py-2.5 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-2.5 transition-all focus:outline-none border hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)' }}
                >
                  <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Google
                </button>

                <p className="mt-5 text-center text-[11px] font-medium text-[#7B7E8E]">
                  {authMode === 'signup' ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => switchAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                    className="ml-1 text-[#CFA343] font-bold hover:underline focus:outline-none"
                  >
                    {authMode === 'signup' ? 'Sign In' : 'Sign Up for Free'}
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  // ══════════════════════════════════════════════════════════
  // A. LANDING / SPLASH SCREEN
  // ══════════════════════════════════════════════════════════
  if (!user || currentView === 'landing' || currentView === 'about') {
    const handleGuestNav = (targetView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade') => {
      if (targetView === 'about') {
        setView('about');
      } else {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
      }
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
      <div className="min-h-screen bg-[#0E0B14] flex flex-col font-dm-sans relative overflow-x-hidden">
        {/* ── Ambient Background Orbs ── */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(62,39,89,0.4) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[800px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,39,0.15) 0%, transparent 70%)' }} />

        {/* ── Top Nav ── */}
        <div className="flex justify-center pt-8 w-full z-30 relative px-4">
          <nav className="max-w-5xl w-full flex items-center justify-between px-8 py-3.5 rounded-[32px]"
            style={{ background: 'linear-gradient(90deg, #221D32, #181720, #221D32)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>

            {/* Brand Logo & Name */}
            <button
              onClick={() => { setView('landing'); setIsLandingMenuOpen(false); }}
              className="flex items-center gap-3 text-left focus:outline-none group z-40"
            >
              <div className="h-10 w-10 overflow-hidden flex items-center justify-center">
                <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover mix-blend-screen rounded-full" />
              </div>
              <div className="leading-none">
                <span className="font-sora font-medium text-[15px] tracking-tight text-white block">EquityStack</span>
                <span className="text-[9px] text-[#A39EBA] block mt-0.5">NGX Intelligence</span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <button onClick={() => setView('landing')}
                className="text-sm font-medium text-[#CFA343] transition-all focus:outline-none">
                Home
              </button>
              <button onClick={() => handleGuestNav('about')}
                className="text-sm font-medium text-white hover:text-[#CFA343] transition-all focus:outline-none">
                About Us
              </button>
              <button onClick={() => handleGuestNav('markets')}
                className="text-sm font-medium text-white hover:text-[#CFA343] transition-all focus:outline-none">
                Markets
              </button>
            </div>

            {/* Desktop/Tablet Action Buttons */}
            <div className="hidden sm:flex items-center gap-4">
              <button onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                className="text-sm font-medium px-6 py-2.5 rounded-full border border-[#443E55] text-[#CFA343] bg-transparent hover:bg-[#CFA343]/10 transition-all focus:outline-none">
                Sign In
              </button>
              <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                className="text-sm font-medium px-6 py-2.5 rounded-full text-[#14131A] transition-all focus:outline-none"
                style={{ background: '#CFA343' }}>
                Create Account
              </button>
            </div>

            {/* Mobile Actions and Hamburger Toggle */}
            <div className="flex sm:hidden items-center gap-3 z-40">
              <button
                onClick={() => setIsLandingMenuOpen(!isLandingMenuOpen)}
                className="p-1.5 text-white hover:text-[#CFA343] transition-colors focus:outline-none"
              >
                {isLandingMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </nav>
        </div>

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

        {currentView === 'about' ? (
          <AboutUs onJoinClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }} />
        ) : (
          <>
            {/* ── Hero Section ── */}
            <div className="max-w-4xl mx-auto w-full flex flex-col items-center text-center z-10 px-5 sm:px-8 pt-24 pb-16 sm:pt-32 sm:pb-20 flex-grow">

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-sora tracking-tight leading-[1.3] mb-6"
                style={{ background: 'linear-gradient(90deg, #B275FF 0%, #FF7EB3 30%, #FFB067 60%, #FF9551 80%, #FF645A 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                See like an OWL. View the market CLEARLY.{' '}
                <span style={{ background: 'linear-gradient(90deg, #E2DCE8, #FF9551)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Invest with CONFIDENCE</span>
              </h1>

              <p className="text-[#A39EBA] text-sm sm:text-base leading-relaxed max-w-3xl mb-12">
                EquityStack provides investors with personalized dashboards and powerful analytical tools to model portfolios, evaluate risk, and estimate potential returns. The platform combines financial data, visual infographics, and AI-driven insights to deliver tailored portfolio analysis and stock recommendations based on each investor's goals and preferences.
              </p>

              {/* Company Logos Grid */}
              <div className="flex flex-col items-center gap-4 mb-14">
                {/* Row 1 */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {[
                    { id: 1, name: 'Apple', icon: <span className="font-extrabold text-3xl" style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #A2AAAD 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}></span> },
                    { id: 2, name: 'Zenith', icon: <div className="font-extrabold text-2xl flex items-center gap-1"><div className="w-2.5 h-2.5 bg-[#E84142]" /><span className="text-white">Z</span></div> },
                    { id: 3, name: 'Nvidia', icon: <span className="font-black text-xl italic tracking-tighter" style={{ color: '#76B900' }}>NVIDIA</span> },
                    { id: 4, name: 'SpaceX', icon: <span className="font-medium text-[11px] tracking-[0.3em] text-white uppercase">SpaceX</span> },
                    { id: 5, name: 'Tesla', icon: <span className="font-black text-3xl" style={{ color: '#E31937', fontFamily: 'serif' }}>T</span> },
                    { id: 6, name: 'Dangote Food', icon: <div className="flex flex-col leading-none text-center"><span className="font-black text-[13px] text-white uppercase">Dangote</span><span className="text-[9px] text-[#CFA343] font-bold">FOOD</span></div> },
                  ].map(item => (
                    <div key={item.id} className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-[#221F2A]/80 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 backdrop-blur-xl hover:scale-110 hover:bg-white/5 transition-all duration-300">
                      {item.icon}
                    </div>
                  ))}
                </div>
                {/* Row 2 */}
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  {[
                    { id: 7, name: 'Buafood', icon: <span className="font-black text-2xl tracking-tighter" style={{ background: 'linear-gradient(to right, #00B4C9, #00E4FF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>BUA</span> },
                    { id: 8, name: 'Airtel', icon: <span className="font-black text-xl italic" style={{ color: '#E84142' }}>airtel</span> },
                    { id: 9, name: 'FIRSTHOLDCO', icon: <div className="flex flex-col leading-none text-center"><span className="font-black text-[14px] text-white">FIRST</span><span className="text-[8px] text-[#CFA343] font-bold tracking-widest uppercase">Holdco</span></div> },
                    { id: 10, name: 'Meta', icon: <span className="font-black text-2xl tracking-tight" style={{ color: '#2764FF' }}>Meta</span> },
                    { id: 11, name: 'Alphabet', icon: <span className="font-bold text-[14px] font-sora text-white tracking-tight">Alphabet</span> },
                  ].map(item => (
                    <div key={item.id} className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-[#221F2A]/80 flex items-center justify-center shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/5 backdrop-blur-xl hover:scale-110 hover:bg-white/5 transition-all duration-300">
                      {item.icon}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button onClick={() => handleGuestNav('markets')}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-[#14131A] transition-all focus:outline-none"
                  style={{ background: '#CFA343' }}>
                  Explore Markets
                </button>
                <button onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full text-sm font-bold text-white transition-all border border-[#443E55] hover:bg-white/5 focus:outline-none">
                  Join Beta Testing
                </button>
              </div>
            </div>

            <div className="max-w-7xl mx-auto w-full flex flex-col z-10 px-5 sm:px-8 pb-16 sm:pb-20 flex-grow">
              {/* ── NGX Ticker Carousel ── */}
              <NGXTickerCarousel />

              {/* ── Feature Cards ── */}
              <FeatureCards />

              {/* ── US Markets Carousel ── */}
              <USMarketsCarousel />

              {/* ── How It Works / Steps Section ── */}
              <div className="w-full mt-24 text-left relative max-w-7xl mx-auto">
                <div className="mb-8">
                  <span className="text-[12px] font-semibold text-[#CFA343] block mb-2">
                    Product Pillars
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sora">
                    Our Five Foundation Pillars
                  </h2>
                </div>

                <div className="relative">
                  {/* Left Arrow */}
                  <button
                    onClick={() => setActiveStep((prev) => (prev === 0 ? 4 : prev - 1))}
                    className="absolute -left-6 sm:-left-12 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white transition-colors focus:outline-none"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>

                  {/* Cards */}
                  <div className="flex gap-4 overflow-hidden">
                    {[
                      steps[activeStep % 5],
                      steps[(activeStep + 1) % 5],
                      steps[(activeStep + 2) % 5],
                      steps[(activeStep + 3) % 5],
                    ].map((item, localIdx) => {
                      const isActive = localIdx === 0;
                      
                      // Fallback icons
                      let IconObj = FileText;
                      if (item.title === 'Education') IconObj = GraduationCap;
                      if (item.title === 'Practice') IconObj = Shield;
                      if (item.title === 'Community') IconObj = Users;
                      if (item.title === 'Trust') IconObj = Check;
                      if (item.title === 'Financial Intelligence') IconObj = BarChart2;

                      return (
                        <div
                          key={item.title}
                          onClick={() => setActiveStep(steps.indexOf(item))}
                          className={`flex-1 rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-300 flex flex-col items-start min-w-[240px] ${
                            isActive
                              ? 'bg-[#CFA343]'
                              : 'bg-[#111116]'
                          }`}
                          style={!isActive ? { background: '#111116' } : {}}
                        >
                          {/* Icon */}
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-12 ${isActive ? 'bg-[#2B273A]' : 'bg-[#2B273A]'}`}>
                             <IconObj className="w-6 h-6 text-white" />
                          </div>
                          
                          {/* Text */}
                          <h3 className={`text-lg font-bold mb-3 font-sora ${isActive ? 'text-[#111]' : 'text-white'}`}>
                            {item.title}
                          </h3>
                          <p className={`text-xs leading-relaxed font-medium flex-1 ${isActive ? 'text-[#333]' : 'text-white/60'}`}>
                            {item.desc}
                          </p>
                          
                          <div className={`mt-6 text-[11px] font-bold flex items-center gap-1 ${isActive ? 'text-[#111]' : 'text-[#CFA343]'}`}>
                            See Explained <ArrowRight className="w-3 h-3 inline" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right Arrow */}
                  <button
                    onClick={() => setActiveStep((prev) => (prev === 4 ? 0 : prev + 1))}
                    className="absolute -right-6 sm:-right-12 top-1/2 -translate-y-1/2 z-10 text-white/50 hover:text-white transition-colors focus:outline-none"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* ── Rating System Deep Dive ── */}
              <RatingSystemDeepDive />

              {/* ── Market Report Section ── */}
              <MarketReportSection />

              {/* ── News Section ── */}
              <NewsSection />
            </div>

            {/* Footer */}
          </>
        )}

        <FooterSection />

        {renderAuthModal()}


      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // B. ONBOARDING WIZARD
  // ══════════════════════════════════════════════════════════
  if (currentView === 'onboarding') {
    return (
      <div className="min-h-screen bg-[#0E0B14] flex flex-col py-10 px-4 sm:px-6 relative font-dm-sans">
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
          <button type="button" onClick={handleOnboardingSkip}
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
                <span key={s} className={`h-1.5 rounded-full transition-all duration-300 ${onboardingStep === s ? 'w-6' : 'w-1.5 bg-border'
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
              <button type="button" onClick={() => setOnboardingStep(onboardingStep - 1)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary border border-border/40 transition-colors focus:outline-none">
                Back
              </button>
            )}
            <button type="button" onClick={handleOnboardingNext}
              className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-bg-base flex items-center gap-1.5 transition-all focus:outline-none"
              style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 14px rgba(207,163,67,0.35)' }}>
              <span>{onboardingStep === 3 ? 'Launch Dashboard' : 'Next Step'}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <div className="max-w-xl mx-auto w-full text-center text-[10px] text-text-secondary font-medium font-dm-sans border-t border-border/30 pt-5 mt-6 relative z-10 mb-12">
          EquityStack Onboarding · Secure · Paperless · BVN exempt
        </div>
        <Footer />
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
    { id: 'home', label: 'Dashboard' },
    { id: 'markets', label: 'Markets' },
    { id: 'news', label: 'News', badge: true },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'trade', label: 'Trade' },
    { id: 'community', label: 'Community' },
    { id: 'learn', label: 'Learn' },
    { id: 'about', label: 'About Us' },
  ] as const;

  // Items hidden inside the "More" dropdown
  const moreNavItems = [
    { id: 'trade', label: 'Trade', icon: TrendingUp },
    { id: 'community', label: 'Marketplace', icon: Users },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'about', label: 'About us', icon: Info },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  // Mobile bottom 5-tab bar
  const mobileBottomTabs = [
    { id: 'home' as const, label: 'Home', icon: HomeIcon },
    { id: 'markets' as const, label: 'Markets', icon: BarChart2 },
    { id: 'portfolio' as const, label: 'Portfolio', icon: Briefcase },
    { id: 'news' as const, label: 'News', icon: Newspaper, badge: true },
  ] as const;

  // Drawer items (More panel) — all overflow items
  const mobileNavItems = [
    { id: 'trade' as const, label: 'Trade', icon: TrendingUp },
    { id: 'community' as const, label: 'Marketplace', icon: Users },
    { id: 'learn' as const, label: 'Learn', icon: GraduationCap },
    { id: 'about' as const, label: 'About', icon: Info },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#0E0B14] font-dm-sans flex flex-col">
      <TickerTape />
      {/* ══════════════════════════════════════════════════════
          DESKTOP TOP NAVIGATION
          ══════════════════════════════════════════════════════ */}
      <header className="hidden lg:flex sticky top-0 z-40 items-center border-t-[3px]" style={{ background: '#191A1D', borderTopColor: '#53A6F6', height: '60px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
        <div className="w-full max-w-[1600px] mx-auto px-6 flex items-center justify-between" style={{ height: '100%' }}>

          <div className="flex items-center">
            {/* ── Brand ───────────────────────────────────────── */}
            <button
              onClick={() => setView('landing')}
              className="flex items-center gap-3 flex-shrink-0 text-left focus:outline-none group mr-24"
            >
              <div className="h-9 w-9 rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                <img src="/EquityStack.jpeg" alt="EquityStack Logo" className="h-full w-full object-cover" />
              </div>
              <div className="leading-none mt-0.5">
                <span className="font-sora font-medium text-[15px] tracking-tight text-white block">EquityStack</span>
                <span className="text-[10px] font-medium block mt-[3px]" style={{ color: '#D3A84B' }}>NGX Intelligence</span>
              </div>
            </button>



            {/* ── Nav Links ── */}
            <nav className="flex items-center gap-2">
              {allNavItems.map((item) => {
                const isActive = currentView === item.id ||
                  (item.id === 'markets' && currentView === 'stock-detail');
                return (
                  <button
                    key={item.id}
                    onClick={() => setView(item.id as Parameters<typeof setView>[0])}
                    className="relative flex items-center justify-center px-4 py-1.5 rounded-md text-[13.5px] font-medium transition-all duration-150 focus:outline-none whitespace-nowrap"
                    style={{
                      color: isActive ? '#ffffff' : '#D3A84B',
                      background: isActive ? '#3F392B' : 'transparent',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.color = '#F2C96D';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        (e.currentTarget as HTMLButtonElement).style.color = '#D3A84B';
                      }
                    }}
                  >
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ── Right Controls ──────────────────────────────── */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {/* Search */}
            <button
              onClick={() => setIsHeaderSearchOpen(true)}
              className="flex items-center justify-center transition-all focus:outline-none"
              style={{ color: '#A855F7' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#C084FC';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#A855F7';
              }}
              title="Search"
            >
              <Search className="h-[22px] w-[22px]" strokeWidth={2.5} />
            </button>

            {/* Notifications */}
            <button
              className="flex items-center justify-center transition-all focus:outline-none"
              style={{ color: '#E0E0E0' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#E0E0E0';
              }}
              title="Notifications"
            >
              <Bell className="h-5 w-5" strokeWidth={2} />
            </button>

            {/* Avatar */}
            <button
              onClick={() => setView('profile')}
              className="flex items-center justify-center w-[30px] h-[30px] rounded-full focus:outline-none overflow-hidden flex-shrink-0"
              style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              title="Profile"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Avatar" className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center font-sora text-[10px] font-extrabold text-bg-base"
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}>
                  {user?.name?.slice(0, 2).toUpperCase() || 'ES'}
                </div>
              )}
            </button>

            {/* Logout Icon */}
            <button
              onClick={logoutUser}
              className="flex items-center justify-center transition-all focus:outline-none ml-2"
              style={{ color: '#E0E0E0' }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#FFFFFF';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.color = '#E0E0E0';
              }}
              title="Sign out"
            >
              <LogOut className="h-[18px] w-[18px]" strokeWidth={2.5} />
            </button>
          </div>
        </div>
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
        <div className="flex-grow p-4 sm:p-6 lg:p-8 w-full mx-auto pb-24 lg:pb-10 max-w-[100%]">
          {renderViewContent()}
        </div>
        {currentView === 'home' && (
          <div className="px-4 sm:px-6 lg:px-8 w-full">
            <TrendingStocks />
          </div>
        )}
        <Footer />
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

      {renderAuthModal()}

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
