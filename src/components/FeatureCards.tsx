import React from 'react';
import { GraduationCap, MessageSquare, Bot, Sliders, FileText, Newspaper } from 'lucide-react';

const features = [
  {
    title: 'Learn',
    badge: 'EDUCATION',
    badgeColor: 'text-[#00B8FF] bg-[#00B8FF]/10 border-[#00B8FF]/20', // Blue
    icon: GraduationCap,
    desc: "A structured knowledge base for every type of investor. Whether you're stepping into the stock market for the first time or sharpening your existing skills, Learn equips you with the fundamentals of stock market investing and practical frameworks for conducting your own equity analysis."
  },
  {
    title: 'Community',
    badge: 'DISCUSSION',
    badgeColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20', // Green
    icon: MessageSquare,
    desc: "A forum built for informed market conversation. Share your views on any NGX-listed stock or broader economic developments affecting the market, and engage with perspectives from other subscribers. Every opinion is open for discussion — agree, challenge, or build on it."
  },
  {
    title: 'EquityStack Assistant',
    badge: 'AI-POWERED',
    badgeColor: 'text-[#8B5CF6] bg-[#8B5CF6]/10 border-[#8B5CF6]/20', // Purple
    icon: Bot,
    desc: "Your always-on market intelligence companion. Powered by AI, the EquityStack Assistant answers any question about the Nigerian stock market — from how a specific stock is performing, to how macroeconomic shifts may affect your portfolio. Fast, contextual, and built for local market nuance."
  },
  {
    title: 'Portfolio & Demo Trade',
    badge: 'SIMULATION',
    badgeColor: 'text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20', // Orange
    icon: Sliders,
    desc: "Practice investing without financial risk. Upon signup, you receive a virtual portfolio funded with ₦10,000,000 to simulate buying and selling NGX-listed stocks. Track your positions, monitor performance, and build the confidence and discipline needed for real-market decisions."
  },
  {
    title: 'Market Report',
    badge: 'WEEKLY DIGEST',
    badgeColor: 'text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20', // Red
    icon: FileText,
    desc: "A comprehensive weekly briefing delivered to your inbox every Saturday. The EquityStack Market Report covers Nigerian stock market performance, sector highlights, notable price movements, and economic developments — everything you need to stay fully informed before the next trading week."
  },
  {
    title: 'News',
    badge: 'LIVE FEED',
    badgeColor: 'text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20', // Green
    icon: Newspaper,
    desc: "Stay current with a curated feed of Nigerian financial news. From corporate announcements and regulatory updates to macroeconomic developments, the News section ensures you're always working with the latest information relevant to your investment decisions."
  }
];

export default function FeatureCards() {
  return (
    <div className="w-full max-w-7xl mx-auto px-5 sm:px-8 py-16 sm:py-24 font-dm-sans relative z-10">
      <div className="mb-12 sm:mb-16 text-left">
        <span className="text-[10px] font-extrabold tracking-widest text-brand-primary uppercase block mb-2">
          What We Offer
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary font-sora leading-tight">
          Our Services
        </h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {features.map((feature, idx) => (
          <div key={idx} className="p-6 sm:p-8 rounded-[24px] sm:rounded-[32px] border transition-all duration-300 hover:-translate-y-1 group"
            style={{ 
              background: 'linear-gradient(145deg, rgba(8,29,56,0.6), rgba(4,18,38,0.8))', 
              borderColor: 'rgba(255,255,255,0.08)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(207,163,67,0.3)')}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.08)')}>
            
            <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-5 mb-5 sm:mb-6">
              <div className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-105 group-hover:bg-brand-primary/10 transition-all duration-300">
                <feature.icon className="w-7 h-7 text-text-primary group-hover:text-brand-primary transition-colors" />
              </div>
              
              <div className="pt-1">
                <h3 className="text-xl sm:text-2xl font-extrabold font-sora text-text-primary mb-2.5">
                  {feature.title}
                </h3>
                <span className={`inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold tracking-wider uppercase border ${feature.badgeColor}`}>
                  {feature.badge}
                </span>
              </div>
            </div>
            
            <p className="text-sm sm:text-base leading-[1.7] text-text-secondary font-medium">
              {feature.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
