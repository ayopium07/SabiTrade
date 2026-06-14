import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Briefcase, 
  RefreshCw 
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { ngxStocks } from '@/lib/mockData';

const DONUT_COLORS = ['#CFA343', '#10B981', '#00B8FF', '#FFB800', '#FF4D4D', '#A855F7'];

export default function TradePage() {
  const demoPortfolio = useAppStore((state) => state.demoPortfolio);
  const cashBalance = useAppStore((state) => state.cashBalance);
  const addDemoTrade = useAppStore((state) => state.addDemoTrade);

  // Form State
  const [selectedTickerState, setSelectedTickerState] = useState('GTCO');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'market' | 'stop'>('market');
  const [sharesInput, setSharesInput] = useState('');
  const [tradeError, setTradeError] = useState<string | null>(null);
  const [showAddSuccess, setShowAddSuccess] = useState(false);

  const activeStock = ngxStocks.find((s) => s.ticker === selectedTickerState) || ngxStocks[0];

  // Calculate Demo Portfolio Values
  let totalCostBasis = 0;
  let totalCurrentValue = 0;

  const holdingsDetails = demoPortfolio.map((holding) => {
    const stock = ngxStocks.find((s) => s.ticker === holding.ticker) || ngxStocks[0];
    const costBasis = holding.shares * holding.buyPrice;
    const currentValue = holding.shares * stock.price;
    const pnl = currentValue - costBasis;
    const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
    const todayChangeAmount = holding.shares * stock.changeAmount;
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

    const tradePrice = activeStock.price;
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
    if (confirm('Are you sure you want to reset the simulation? This will restore your cash balance to ₦10,000,000 and clear all demo holdings.')) {
      useAppStore.setState({ cashBalance: 10000000, demoPortfolio: [] });
      setTradeError(null);
      setSharesInput('');
    }
  };

  const prefillSell = (ticker: string, shares: number) => {
    setSelectedTickerState(ticker);
    setTradeType('sell');
    setSharesInput(shares.toString());
    setTradeError(null);
  };

  const cardStyle = {
    background: 'linear-gradient(145deg, #0E0D25, #070615)',
    border: '1px solid #23214C',
  };

  const inputStyle = {
    background: '#0E0D25',
    border: '1px solid #23214C',
  };

  return (
    <div className="space-y-6">
      {/* ── Header ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-extrabold font-sora tracking-tight text-text-primary">
            Simulated Trade Desk
          </h1>
          <p className="text-xs text-text-secondary font-medium font-dm-sans mt-0.5">
            Practice trading NGX equities with zero financial risk using simulated capital.
          </p>
        </div>
        <button
          onClick={handleResetSimulation}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary border border-border hover:border-border-bright transition-all focus:outline-none"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Reset Simulation
        </button>
      </div>

      {/* ── Stats Summary Row ────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Virtual Cash */}
        <div className="p-5 rounded-2xl relative overflow-hidden" style={cardStyle}>
          <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
            Simulated Cash
          </span>
          <h2 className="text-2xl font-extrabold font-sora tracking-tight mb-1 text-brand-primary"
            style={{ textShadow: '0 0 20px rgba(99,102,241,0.2)' }}>
            ₦{cashBalance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </h2>
          <span className="text-[9px] text-text-secondary font-medium uppercase font-dm-sans">
            Ready to deploy
          </span>
        </div>

        {/* Demo Holdings Valuation */}
        <div className="p-5 rounded-2xl relative overflow-hidden" style={cardStyle}>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
            Demo Portfolio Value
          </span>
          <h2 className="text-2xl font-extrabold font-sora tracking-tight mb-1 text-text-primary">
            ₦{totalCurrentValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </h2>
          <div className="text-[9px] text-text-secondary font-dm-sans">
            Cost basis: <span className="text-text-primary font-semibold">₦{totalCostBasis.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>

        {/* Account Total Capital */}
        <div className="p-5 rounded-2xl relative overflow-hidden" style={cardStyle}>
          <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans block mb-1">
            Total Account Value
          </span>
          <h2 className="text-2xl font-extrabold font-sora tracking-tight mb-1 text-brand-primary"
            style={{ textShadow: '0 0 20px rgba(207,163,67,0.1)' }}>
            ₦{(cashBalance + totalCurrentValue).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </h2>
          <div className="flex items-center gap-1.5 text-[9px] font-bold">
            <span className={`inline-flex items-center rounded ${totalAllTimePnl >= 0 ? 'text-gain' : 'text-danger'}`}>
              {totalAllTimePnl >= 0 ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
              {totalAllTimePnl >= 0 ? '+' : ''}{totalAllTimePnlPercent.toFixed(2)}% P&amp;L
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Grid ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Trade Simulator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
            <div className="flex items-center justify-between pb-3 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Activity className="h-4.5 w-4.5 text-brand-primary animate-pulse" />
                <h4 className="text-sm font-bold text-brand-primary font-sora">Order Entry</h4>
              </div>
              <span className="text-[9px] px-2 py-0.5 rounded-full border border-warning/20 bg-warning/5 text-warning font-extrabold font-dm-sans">
                SIMULATION
              </span>
            </div>

            {/* Notifications */}
            {tradeError && (
              <div className="bg-danger/10 border border-danger/25 text-danger rounded-xl p-3 text-xs font-bold text-center animate-in fade-in duration-200">
                ⚠️ {tradeError}
              </div>
            )}
            {showAddSuccess && (
              <div className="bg-gain/10 border border-gain/20 text-gain rounded-xl p-3 text-xs font-bold text-center animate-in fade-in duration-200">
                ✅ Simulated {tradeType === 'buy' ? 'Buy' : 'Sell'} executed successfully!
              </div>
            )}

            <form onSubmit={handleDemoTradeSubmit} className="space-y-4">
              {/* Asset Selector */}
              <div>
                <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans mb-1.5">
                  Select NGX Asset
                </label>
                <select
                  value={selectedTickerState}
                  onChange={(e) => {
                    setSelectedTickerState(e.target.value);
                    setTradeError(null);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-none text-text-primary"
                  style={inputStyle}
                >
                  {ngxStocks.map((s) => (
                    <option key={s.ticker} value={s.ticker} style={{ background: '#0E0D25' }}>
                      {s.ticker} — {s.name} (₦{s.price.toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Buy / Sell Tabs */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-bg-base/80 border border-border/40">
                <button
                  type="button"
                  onClick={() => { setTradeType('buy'); setTradeError(null); }}
                  className={`py-2 rounded-lg text-xs font-extrabold transition-all duration-200 focus:outline-none ${
                    tradeType === 'buy'
                      ? 'bg-gain text-bg-base shadow-glow-green-sm'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => { setTradeType('sell'); setTradeError(null); }}
                  className={`py-2 rounded-lg text-xs font-extrabold transition-all duration-200 focus:outline-none ${
                    tradeType === 'sell'
                      ? 'bg-danger text-text-primary shadow-glow-red'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Sell
                </button>
              </div>

              {/* Order Type Tabs */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOrderType('market')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all duration-200 focus:outline-none ${
                    orderType === 'market'
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-border/60 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  Market
                </button>
                <button
                  type="button"
                  onClick={() => setOrderType('stop')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all duration-200 focus:outline-none ${
                    orderType === 'stop'
                      ? 'border-brand-primary bg-brand-primary/10 text-brand-primary'
                      : 'border-border/60 text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {tradeType === 'buy' ? 'Buy Stop' : 'Sell Stop'}
                </button>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-[10px] text-text-secondary font-bold uppercase tracking-wider font-dm-sans mb-1.5">
                  Quantity (shares)
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
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-bold focus:ring-0 focus:outline-none placeholder:text-text-secondary text-text-primary"
                    style={inputStyle}
                  />
                  {tradeType === 'sell' && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[9px] font-bold text-text-secondary">
                      Owns: {demoPortfolio.find((h) => h.ticker === selectedTickerState)?.shares || 0}
                    </span>
                  )}
                </div>
              </div>

              {/* pricing calculator logic */}
              {(() => {
                const quantity = parseFloat(sharesInput) || 0;
                const tradePrice = activeStock.price;
                const tradeValue = quantity * tradePrice;
                const commission = tradeValue * 0.0135;
                const regulatory = tradeValue * 0.004;
                const vat = (commission + regulatory) * 0.075;
                const totalCharges = commission + regulatory + vat;
                const finalAmount = tradeType === 'buy' ? (tradeValue + totalCharges) : (tradeValue - totalCharges);

                return (
                  <div className="space-y-1.5 pt-2 text-xs font-dm-sans font-medium text-text-secondary">
                    <div className="flex justify-between">
                      <span>Last price</span>
                      <span className="font-bold text-text-primary">₦{activeStock.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="border-t border-border/40 pt-2.5 mt-2 space-y-1.5">
                      <span className="block text-[9px] font-bold uppercase tracking-wider text-brand-primary/75">Charges</span>
                      <div className="flex justify-between text-[11px]">
                        <span>Commission (1.35%)</span>
                        <span>₦{commission.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>Regulatory (0.4%)</span>
                        <span>₦{regulatory.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span>VAT (7.5%)</span>
                        <span>₦{vat.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="border-t border-border/40 pt-2.5 mt-2 space-y-1">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>Total charges</span>
                        <span>₦{totalCharges.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-xs font-extrabold text-text-primary">
                        <span>{tradeType === 'buy' ? 'Total cost' : 'Total proceeds'}</span>
                        <span className={tradeType === 'buy' ? 'text-brand-primary' : 'text-gain'} style={{ textShadow: '0 0 10px rgba(99,102,241,0.2)' }}>
                          ₦{finalAmount.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button
                type="submit"
                className={`w-full py-3 rounded-xl text-xs font-bold text-bg-base transition-all duration-200 focus:outline-none ${
                  tradeType === 'buy'
                    ? 'bg-gain hover:opacity-90 shadow-glow-green-sm'
                    : 'bg-danger hover:opacity-90 shadow-glow-red text-text-primary'
                }`}
              >
                Execute Simulated {tradeType === 'buy' ? 'Buy' : 'Sell'}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Demo Portfolio List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl space-y-4" style={cardStyle}>
            <div className="flex items-center justify-between pb-1 border-b border-border/40">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4.5 w-4.5 text-brand-primary" />
                <h4 className="text-sm font-bold text-text-primary font-sora">Demo Portfolio Holdings</h4>
              </div>
              <span className="text-[10px] font-bold text-text-secondary font-dm-sans">
                {demoPortfolio.length} Assets
              </span>
            </div>

            {holdingsDetails.length > 0 ? (
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full border-collapse text-left text-xs font-dm-sans min-w-[500px]">
                  <thead>
                    <tr className="border-b border-border/40 text-text-secondary font-bold uppercase tracking-wider text-[9px] py-2">
                      <th className="pb-2">Asset</th>
                      <th className="pb-2 text-right">Shares</th>
                      <th className="pb-2 text-right">Avg Buy Price</th>
                      <th className="pb-2 text-right">Current Value</th>
                      <th className="pb-2 text-right">P&amp;L</th>
                      <th className="pb-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20 text-text-secondary">
                    {holdingsDetails.map((h, idx) => {
                      const isPos = h.pnl >= 0;
                      const color = DONUT_COLORS[idx % DONUT_COLORS.length];
                      return (
                        <tr
                          key={h.ticker}
                          onClick={() => setSelectedTickerState(h.ticker)}
                          className="hover:bg-bg-surface/30 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 pl-1 flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                            <div>
                              <span className="font-extrabold text-text-primary text-xs font-sora">{h.ticker}</span>
                              <span className="block text-[9px] text-text-secondary truncate max-w-[100px]">{h.stock.name}</span>
                            </div>
                          </td>
                          <td className="py-3.5 text-right font-bold text-text-primary">
                            {h.shares.toLocaleString()}
                          </td>
                          <td className="py-3.5 text-right">
                            ₦{h.buyPrice.toFixed(2)}
                          </td>
                          <td className="py-3.5 text-right font-extrabold text-text-primary">
                            ₦{h.currentValue.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                          </td>
                          <td className={`py-3.5 text-right font-extrabold ${isPos ? 'text-gain' : 'text-danger'}`}>
                            {isPos ? '+' : ''}₦{h.pnl.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                            <span className="block text-[8px] font-bold">
                              ({isPos ? '+' : ''}{h.pnlPercent.toFixed(1)}%)
                            </span>
                          </td>
                          <td className="py-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => prefillSell(h.ticker, h.shares)}
                              className="px-2 py-1 rounded-lg bg-danger/10 hover:bg-danger/20 text-danger border border-danger/20 text-[9px] font-extrabold transition-all focus:outline-none"
                            >
                              SELL
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-10 border border-dashed border-border/50 rounded-2xl text-center text-xs text-text-secondary font-medium font-dm-sans">
                <span className="text-2xl block mb-2">📈</span>
                <p className="font-bold text-text-primary mb-1">Your Demo Portfolio is empty</p>
                <p className="text-[10px] leading-relaxed max-w-sm mx-auto">
                  Select a stock from the simulator, enter a quantity, and execute a buy order to begin tracking your virtual yields.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
