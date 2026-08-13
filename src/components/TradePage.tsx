import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Briefcase, 
  RefreshCw,
  LineChart
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
// ngxStocks is loaded dynamically from store

const DONUT_COLORS = ['#CFA343', '#10B981', '#00B8FF', '#FFB800', '#FF4D4D', '#A855F7'];

export default function TradePage() {
  const demoPortfolio = useAppStore((state) => state.demoPortfolio);
  const cashBalance = useAppStore((state) => state.cashBalance);
  const addDemoTrade = useAppStore((state) => state.addDemoTrade);
  const stocks = useAppStore((state) => state.stocks);

  // Form State
  const [selectedTickerState, setSelectedTickerState] = useState('GTCO');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'stop'>('market');
  const [sharesInput, setSharesInput] = useState('');
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const activeStock = stocks.find((s) => s.ticker === selectedTickerState) || stocks[0] || { ticker: 'GTCO', name: 'Guaranty Trust Holding Co', price: 0, changeAmount: 0 };

  // Calculate Demo Portfolio Values
  let totalCostBasis = 0;
  let totalCurrentValue = 0;

  const holdingsDetails = demoPortfolio.map((holding) => {
    const stock = stocks.find((s) => s.ticker === holding.ticker) || { price: 0, changeAmount: 0, name: holding.ticker };
    const stockPrice = Number(stock.price) || 0;
    const stockChangeAmount = Number(stock.changeAmount) || 0;
    const costBasis = holding.shares * (Number(holding.buyPrice) || 0);
    const currentValue = holding.shares * stockPrice;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const todayChangeAmount = holding.shares * stockChangeAmount;
    totalCostBasis += costBasis;
    totalCurrentValue += currentValue;
    return { ...holding, stock, costBasis, currentValue, pnl, pnlPercent, todayChangeAmount };
  });

  const totalAllTimePnl = totalCurrentValue - totalCostBasis;
  const totalAllTimePnlPercent = totalCostBasis > 0 ? (totalAllTimePnl / totalCostBasis) * 100 : 0;

  // Handlers
  const handleDemoTradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTradeError(null);
    const quantity = parseInt(sharesInput);
    if (!quantity || quantity <= 0) {
      setTradeError('Please enter a valid quantity of shares.');
      return;
    }

    const tradePrice = Number(activeStock.price) || 0;
    const tradeValue = quantity * tradePrice;
    const commission = tradeValue * 0.0135;
    const regulatory = tradeValue * 0.004;
    const vat = (commission + regulatory) * 0.075;
    const totalCharges = commission + regulatory + vat;
    const finalAmount = tradeType === 'buy' ? (tradeValue + totalCharges) : (tradeValue - totalCharges);

    const res = addDemoTrade(activeStock.ticker, quantity, tradePrice, tradeType, finalAmount);
    if (res.success) {
      setShowAddSuccess(true);
      setSharesInput('');
      setTradeError(null);
      setTimeout(() => setShowAddSuccess(false), 3000);
    } else {
      setTradeError(res.error || 'Trade failed.');
    }
  };

  const handleResetSimulation = () => {
    if (confirm('Are you sure you want to reset the simulation? This will restore your cash balance to ₦1,000,000 and clear all demo holdings.')) {
      useAppStore.setState({ cashBalance: 1000000, demoPortfolio: [] });
      setTradeError(null);
      setSharesInput('');
    }
  };

  const prefillSell = (ticker: string, shares: number) => {
    setSelectedTickerState(ticker);
    setTradeType('sell');
    setSharesInput(shares.toString());
    setTradeError(null);
  };  const cardStyle = {
    background: 'linear-gradient(145deg, #141020 0%, #0E0B14 100%)',
    border: '1px solid rgba(207, 163, 67, 0.12)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
    borderRadius: '16px'
  };

  const inputStyle = {
    backgroundColor: '#141020',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    color: '#FFFFFF'
  };

  return (
    <div className="space-y-6 text-[#E0E0E0] min-h-[calc(100vh-6rem)] font-dm-sans pb-10">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sora mb-1">
            Simulated Trade Desk
          </h1>
          <p className="text-sm text-white/60 font-medium">
            Practice trading NGX equities with zero financial risk using simulated capital.
          </p>
        </div>
        <button
          onClick={handleResetSimulation}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-white border border-[#443E55] hover:bg-white/5 hover:border-white/30 transition-all focus:outline-none"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Simulation
        </button>
      </div>

      {/* ── Metric Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div 
          className="md:col-span-12 xl:col-span-6 relative overflow-hidden rounded-2xl flex items-center justify-between p-8 min-h-[200px]" 
          style={{
            background: 'linear-gradient(145deg, #181426 0%, #0E0B14 100%)',
            border: '1px solid rgba(207, 163, 67, 0.15)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.03)',
            backgroundImage: "url('/nigerian-bg.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Dark overlay to ensure text remains very readable over the pattern */}
          <div className="absolute inset-0 bg-[#0E0B14]/80 pointer-events-none" />
          
          <div className="relative z-10 space-y-2">
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
              SIMULATED CASH
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#CFA343] font-sora tracking-tight truncate">
              ₦{cashBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-[10px] text-white/40 font-semibold tracking-wider uppercase mt-2">READY TO DEPLOY</div>
          </div>
        </div>

        <div className="md:col-span-12 xl:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Demo Holdings Value */}
          <div className="p-8 rounded-2xl flex flex-col justify-center space-y-4" style={cardStyle}>
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
              PORTFOLIO EQUITIES VALUE
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-sora tracking-tight truncate">
              ₦{totalCurrentValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-white/60 font-medium">Cost basis: <span className="font-bold text-white">₦{totalCostBasis.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span></div>
          </div>

          {/* Unrealised PnL */}
          <div className="p-8 rounded-2xl flex flex-col justify-center space-y-4" style={cardStyle}>
            <div className="text-[10px] font-bold text-white/50 uppercase tracking-wider">
              UNREALISED P&L
            </div>
            <div className="flex items-center gap-3">
               <div className={`p-1.5 rounded-lg border ${totalAllTimePnl >= 0 ? 'border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]' : 'border-[#FF4D4D]/30 bg-[#FF4D4D]/10 text-[#FF4D4D]'}`}>
                 {totalAllTimePnl >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
               </div>
               <div className={`text-2xl sm:text-3xl font-extrabold font-sora tracking-tight truncate ${totalAllTimePnl >= 0 ? 'text-[#10B981]' : 'text-[#FF4D4D]'}`}>
                 {totalAllTimePnl >= 0 ? '+' : ''}₦{totalAllTimePnl.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
               </div>
            </div>
            <div className="text-xs text-white/60 font-medium">
              Return: <span className={`font-semibold ${totalAllTimePnl >= 0 ? 'text-[#10B981]' : 'text-[#FF4D4D]'}`}>
                {totalAllTimePnl >= 0 ? '+' : ''}{totalAllTimePnlPercent.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Trading Grid ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Left: Trade Order Form */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl h-full" style={cardStyle}>
            <div className="flex items-center gap-3 pb-6 border-b border-white/5">
              <Activity className="h-5 w-5 text-[#CFA343]" />
              <h4 className="text-sm font-bold text-[#CFA343] font-sora">Order Entry</h4>
            </div>

            {tradeError && (
              <div className="mt-6 bg-[#FF4D4D]/10 border border-[#FF4D4D]/20 text-[#FF4D4D] rounded-xl p-3 text-xs font-medium text-center">
                {tradeError}
              </div>
            )}
            {showAddSuccess && (
              <div className="mt-6 bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] rounded-xl p-3 text-xs font-medium text-center">
                Simulated {tradeType === 'buy' ? 'Buy' : 'Sell'} executed successfully!
              </div>
            )}

            <form onSubmit={handleDemoTradeSubmit} className="space-y-6 mt-6">
              {/* Asset Selector */}
              <div>
                <label className="block text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2">
                  SELECT NGX ASSET
                </label>
                <select
                  value={selectedTickerState}
                  onChange={(e) => {
                    setSelectedTickerState(e.target.value);
                    setTradeError(null);
                  }}
                  className="w-full px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-[#CFA343] focus:ring-1 focus:ring-[#CFA343]/40 appearance-none bg-no-repeat bg-[right_1rem_center]"
                  style={{ ...inputStyle, backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23888' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M8 9l4-4 4 4m0 6l-4 4-4-4'/%3E%3C/svg%3E")`, backgroundSize: '1.2rem' }}
                >
                  {stocks.map((s) => (
                    <option key={s.ticker} value={s.ticker} className="bg-[#141020] text-white">
                      {s.ticker} — {s.name} (₦{(Number(s.price) || 0).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { setTradeType('buy'); setTradeError(null); }}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all focus:outline-none border ${
                    tradeType === 'buy'
                      ? 'border-[#CFA343] bg-[#CFA343] text-[#14131A]'
                      : 'border-white/10 bg-[#141020] text-white/70 hover:bg-white/5'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => { setTradeType('sell'); setTradeError(null); }}
                  className={`flex-1 py-3.5 rounded-xl text-sm font-bold transition-all focus:outline-none border ${
                    tradeType === 'sell'
                      ? 'border-[#FF4D4D] bg-[#FF4D4D] text-white'
                      : 'border-white/10 bg-[#141020] text-white/70 hover:bg-white/5'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Order Type Tabs */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none border ${
                    orderType === 'market'
                      ? 'border-[#CFA343] bg-[#CFA343]/15 text-[#CFA343] font-bold'
                      : 'border-white/10 bg-[#141020] text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  Market
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('stop')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all focus:outline-none border ${
                    orderType === 'stop'
                      ? 'border-[#CFA343] bg-[#CFA343]/15 text-[#CFA343] font-bold'
                      : 'border-white/10 bg-[#141020] text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {tradeType === 'buy' ? 'Buy Stop' : 'Sell Stop'}
                </button>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[10px] text-white/50 font-bold uppercase tracking-wider mb-2">
                  QUANTITY (SHARES)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    placeholder="Enter amount of shares"
                    value={sharesInput}
                    onChange={(e) => {
                      setSharesInput(e.target.value);
                      setTradeError(null);
                    }}
                    className="w-full px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:border-[#CFA343] focus:ring-1 focus:ring-[#CFA343]/40 placeholder:text-white/30"
                    style={inputStyle}
                  />
                  {tradeType === 'sell' && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-white/50">
                      Owns: {demoPortfolio.find((h) => h.ticker === selectedTickerState)?.shares || 0}
                    </span>
                  )}
                </div>
              </div>

              {/* pricing calculator logic */}
              {(() => {
                const quantity = parseFloat(sharesInput) || 0;
                const tradePrice = Number(activeStock.price) || 0;
                const tradeValue = quantity * tradePrice;
                const commission = tradeValue * 0.0135;
                const regulatory = tradeValue * 0.004;
                const vat = (commission + regulatory) * 0.075;
                const totalCharges = commission + regulatory + vat;
                const finalAmount = tradeType === 'buy' ? (tradeValue + totalCharges) : (tradeValue - totalCharges);

                return (
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60 font-medium">Last price</span>
                      <span className="font-bold text-white font-sora">₦{tradePrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="space-y-2 mt-4">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-[#CFA343] mb-3">CHARGES</span>
                      <div className="flex justify-between text-[11px] text-white/50 font-medium">
                        <span>Commission (1.35%)</span>
                        <span className="text-white/80">₦{commission.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-white/50 font-medium">
                        <span>Regulatory (0.4%)</span>
                        <span className="text-white/80">₦{regulatory.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-white/50 font-medium">
                        <span>VAT (7.5%)</span>
                        <span className="text-white/80">₦{vat.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/5 space-y-2">
                      <div className="flex justify-between text-[11px] text-white/50 font-medium">
                        <span>Total charges</span>
                        <span className="text-white/80">₦{totalCharges.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-white">
                        <span className="text-xs">{tradeType === 'buy' ? 'Total cost' : 'Total proceeds'}</span>
                        <span className="text-[#CFA343] font-sora font-extrabold text-base">
                          ₦{finalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button
                type="submit"
                className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold font-sora bg-[#CFA343] hover:bg-[#B58C35] text-[#14131A] transition-all shadow-lg shadow-[#CFA343]/15 focus:outline-none"
              >
                Execute Simulated {tradeType === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Demo Portfolio List */}
        <div className="space-y-4 h-full">
          <div className="p-8 rounded-3xl h-full flex flex-col" style={cardStyle}>
            <div className="flex items-center justify-between pb-6 border-b border-white/5">
              <div className="flex items-center gap-4">
                <Briefcase className="h-6 w-6 text-[#CFA343]" />
                <h4 className="text-lg font-bold text-[#CFA343] font-sora">Demo Portfolio Holdings</h4>
              </div>
              <span className="text-sm font-medium text-white/50">
                {demoPortfolio.length} Assets
              </span>
            </div>

            {holdingsDetails.length > 0 ? (
              <div className="overflow-x-auto mt-6 custom-scrollbar flex-1">
                <table className="w-full border-collapse text-left text-sm whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-white/5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                      <th className="pb-3 pr-4 font-bold">Asset</th>
                      <th className="pb-3 px-4 font-bold text-right">Shares</th>
                      <th className="pb-3 px-4 font-bold text-right">Buy Price</th>
                      <th className="pb-3 px-4 font-bold text-right">Current</th>
                      <th className="pb-3 px-4 font-bold text-right">P&L</th>
                      <th className="pb-3 pl-4 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {holdingsDetails.map((h, idx) => {
                      const isPos = h.pnl >= 0;
                      const color = DONUT_COLORS[idx % DONUT_COLORS.length];
                      return (
                        <tr
                          key={h.ticker}
                          onClick={() => setSelectedTickerState(h.ticker)}
                          className="hover:bg-white/[0.03] cursor-pointer transition-colors"
                        >
                          <td className="py-4 pr-4 flex items-center gap-3">
                            <span className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                            <div className="flex flex-col">
                              <span className="font-bold text-white text-xs font-sora">{h.ticker}</span>
                              <span className="text-[10px] text-white/50 truncate max-w-[120px]">{h.stock.name}</span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-right font-medium text-white/90 text-xs font-sora">
                            {h.shares.toLocaleString()}
                          </td>
                          <td className="py-4 px-4 text-right text-white/50 text-xs font-sora">
                            ₦{h.buyPrice.toFixed(2)}
                          </td>
                          <td className="py-4 px-4 text-right font-bold text-white text-xs font-sora">
                            ₦{h.currentValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                          </td>
                          <td className={`py-4 px-4 text-right font-bold text-xs font-sora ${isPos ? 'text-[#10B981]' : 'text-[#FF4D4D]'}`}>
                            <div className="flex flex-col items-end">
                              <span>{isPos ? '+' : ''}₦{h.pnl.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                              <span className="text-[9px] mt-0.5 opacity-80">
                                ({isPos ? '+' : ''}{h.pnlPercent.toFixed(1)}%)
                              </span>
                            </div>
                          </td>
                          <td className="py-4 pl-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => prefillSell(h.ticker, h.shares)}
                              className="px-3 py-1.5 rounded-lg bg-[#FF4D4D]/10 hover:bg-[#FF4D4D]/20 text-[#FF4D4D] border border-[#FF4D4D]/20 text-[9px] font-bold uppercase transition-all focus:outline-none"
                            >
                              Sell
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center rounded-2xl mt-8 border border-white/10 bg-white/[0.01]">
                <LineChart className="h-10 w-10 text-[#CFA343] mb-6" />
                <p className="font-bold text-white font-sora text-lg mb-3 tracking-tight">Your Demo Portfolio is empty</p>
                <p className="text-sm text-white/50 max-w-lg leading-relaxed">
                  Select a stock from the simulator, enter a quantity, and execute a buy order to
                  begin tracking your virtual yields.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
