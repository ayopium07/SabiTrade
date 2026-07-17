'use client';

import React, { useState } from 'react';
import { useAppStore } from '@/lib/store';

export default function DashboardNewsPortfolio() {
  const news = useAppStore((s) => s.news);
  const portfolio = useAppStore((s) => s.portfolio);
  const watchlist = useAppStore((s) => s.watchlist);
  const stocks = useAppStore((s) => s.stocks);

  const [portfolioTab, setPortfolioTab] = useState<'portfolio' | 'watchlist' | 'newsletters'>('portfolio');

  // Split news for the two columns
  const analysisNews = news.slice(0, 4);
  const marketNews = news.slice(4, 8);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
      
      {/* Column 1: Stock Analysis & Insight */}
      <div className="flex flex-col">
        <h3 className="text-[15px] font-extrabold text-white font-sora mb-3">Stock Analysis & Insight</h3>
        <div className="rounded-xl border border-white/5 bg-[#111116] overflow-hidden">
          <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
          <div className="p-2">
            {analysisNews.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="flex gap-4 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      {item.category === 'Featured' && (
                        <span className="text-[10px] text-orange-500 font-bold mb-1 block">Trending 🔥</span>
                      )}
                      <h4 className="text-[12px] font-bold text-white/90 leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                        {item.originalHeadline}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-[10px] text-white/50 truncate flex-1">{item.timeAgo} • {item.source}</span>
                      <div className="flex gap-1 flex-shrink-0">
                        {item.affectedStocks.slice(0,2).map(ticker => (
                          <span key={ticker} className="text-[8px] font-semibold border border-white/20 text-white/60 px-1.5 py-0.5 rounded-full uppercase">
                            {ticker}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {idx < analysisNews.length - 1 && <div className="h-[1px] w-[90%] mx-auto bg-white/5"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Column 2: Financial Market News */}
      <div className="flex flex-col">
        <h3 className="text-[15px] font-extrabold text-white font-sora mb-3">Financial Market News</h3>
        <div className="rounded-xl border border-white/5 bg-[#111116] overflow-hidden">
          <div className="h-[2px] w-full bg-gradient-to-r from-orange-400 to-amber-600"></div>
          <div className="p-2">
            {marketNews.map((item, idx) => (
              <React.Fragment key={item.id}>
                <div className="flex gap-4 p-3 hover:bg-white/5 rounded-lg cursor-pointer transition-colors group">
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div>
                      {idx === 0 && (
                        <span className="text-[10px] text-white/60 font-medium mb-1 block">Market News</span>
                      )}
                      <h4 className="text-[12px] font-bold text-white/90 leading-tight group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                        {item.originalHeadline}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-[10px] text-white/50 truncate flex-1">{item.timeAgo}</span>
                      <div className="flex gap-1 flex-shrink-0">
                        {item.affectedStocks.slice(0,2).map(ticker => (
                          <span key={ticker} className="text-[8px] font-semibold border border-white/20 text-white/60 px-1.5 py-0.5 rounded-full uppercase">
                            {ticker}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                {idx < marketNews.length - 1 && <div className="h-[1px] w-[90%] mx-auto bg-white/5"></div>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Column 3: My Portfolio */}
      <div className="flex flex-col">
        <h3 className="text-[15px] font-extrabold text-white font-sora mb-3">My Portfolio</h3>
        <div className="rounded-xl border border-white/5 bg-[#111116] overflow-hidden flex flex-col h-full">
          <div className="h-[2px] w-full bg-gradient-to-r from-pink-500 to-rose-600"></div>
          <div className="p-4 flex-1 flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              {portfolio.length === 0 ? (
                <div className="py-6 text-center text-[12px] text-white/40">Your portfolio is empty.</div>
              ) : (
                portfolio.map(h => {
                  const stock = stocks.find(s => s.ticker === h.ticker);
                  return (
                    <div key={h.ticker} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-white">{h.ticker}</span>
                        <span className="text-[10px] text-white/50">{h.shares} Shares</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[13px] font-bold text-white">₦{(h.shares * (stock?.price || 0)).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        <span className={`text-[10px] ${((stock?.price || 0) - h.buyPrice) >= 0 ? 'text-[#10B981]' : 'text-red-500'}`}>
                          {((stock?.price || 0) - h.buyPrice) >= 0 ? '+' : ''}{(((stock?.price || 0) - h.buyPrice) / h.buyPrice * 100).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
