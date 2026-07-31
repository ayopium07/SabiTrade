import React from 'react';

export default function LearnSection() {
  const learnItems = [
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
    <div className="w-full mt-16 max-w-7xl mx-auto px-5 sm:px-8 mb-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sora mb-6">
          Learn
        </h2>
        <p className="text-[13px] leading-relaxed text-white/60">
          Master the Nigerian financial market with our curated educational resources. From understanding market basics to advanced investment strategies, our Learn section provides the knowledge you need to make informed decisions.
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
        {learnItems.map((item, idx) => (
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
