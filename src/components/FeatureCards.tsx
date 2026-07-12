import React from 'react';
import { GraduationCap, MessageSquare, Bot, BarChart2, FileText, Newspaper } from 'lucide-react';

const services = [
  {
    num: '01',
    icon: GraduationCap,
    iconBg: '#1A6B3A',
    title: 'Learn',
    desc: 'A structured knowledge base for every type of investor. Equips you with the fundamentals of stock market investing and practical frameworks for conducting your own equity analysis — built specifically for the NGX.',
    tag: 'EDUCATION',
    tagColor: '#10B981',
  },
  {
    num: '02',
    icon: MessageSquare,
    iconBg: '#1A4A6B',
    title: 'Community',
    desc: 'A forum built for informed market conversation. Share your views on any NGX-listed stock or broader economic developments, and engage with fellow subscribers. Every opinion is open for discussion — agree, challenge, or build on it.',
    tag: 'DISCUSSION',
    tagColor: '#10B981',
  },
  {
    num: '03',
    icon: Bot,
    iconBg: '#3B1F6B',
    title: 'EquityStack Assistant',
    desc: 'Your always-on market intelligence companion. Powered by AI, the EquityStack Assistant answers any question about the Nigerian stock market — fast, contextual, and built for local market nuance.',
    tag: 'AI-POWERED',
    tagColor: '#8B5CF6',
  },
  {
    num: '04',
    icon: BarChart2,
    iconBg: '#6B1F1F',
    title: 'Portfolio & Demo Trade',
    desc: 'Practice investing without financial risk. Upon signup, receive a virtual portfolio funded with ₦10,000,000 to simulate buying and selling NGX-listed stocks. Build the confidence and discipline needed for real-market decisions.',
    tag: 'SIMULATION',
    tagColor: '#EF4444',
  },
  {
    num: '05',
    icon: FileText,
    iconBg: '#1A5050',
    title: 'Market Report',
    desc: 'A comprehensive weekly briefing delivered to your inbox every Saturday. Covers NGX performance, sector highlights, notable price movements, and economic developments — everything you need before the next trading week opens.',
    tag: 'WEEKLY GET',
    tagColor: '#06B6D4',
  },
  {
    num: '06',
    icon: Newspaper,
    iconBg: '#1A3A6B',
    title: 'News',
    desc: 'Stay current with a curated feed of Nigerian financial news. From corporate announcements and regulatory updates to macroeconomic developments — always working with the latest information relevant to your investment decisions.',
    tag: 'LIVE FEED',
    tagColor: '#10B981',
  },
];

export default function FeatureCards() {
  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 font-dm-sans">

      {/* Section header */}
      <div className="mb-10 text-left">
        <span className="text-[11px] font-semibold tracking-widest uppercase block mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Platform Services
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sora leading-tight mb-3">
          Everything you need to invest smarter.
        </h2>
        <p className="text-sm text-white/50 font-medium max-w-sm leading-relaxed">
          Six integrated tools designed to take you from first-time investor to confident market participant.
        </p>
      </div>

      {/* 3-column grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}
      >
        {services.map((s, i) => (
          <div
            key={s.num}
            className="flex flex-col gap-4 p-7 transition-colors duration-200 hover:bg-white/[0.02]"
            style={{
              borderRight: (i + 1) % 3 !== 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
            }}
          >
            {/* Number */}
            <span className="text-[11px] font-semibold" style={{ color: 'rgba(255,255,255,0.25)' }}>
              {s.num}
            </span>

            {/* Icon */}
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: s.iconBg }}
            >
              <s.icon className="w-5 h-5 text-white" />
            </div>

            {/* Title */}
            <h3 className="text-[15px] font-extrabold text-white font-sora leading-snug">
              {s.title}
            </h3>

            {/* Description */}
            <p className="text-[12px] leading-relaxed flex-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {s.desc}
            </p>

            {/* Tag badge */}
            <div>
              <span
                className="inline-block text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 rounded"
                style={{
                  background: `${s.tagColor}18`,
                  color: s.tagColor,
                  border: `1px solid ${s.tagColor}30`,
                }}
              >
                {s.tag}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
