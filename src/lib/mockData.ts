export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number; // percentage change, e.g. +2.3 or -1.7
  changeAmount: number; // actual price change, e.g. +4.50
  volume: string; // formatted volume, e.g. "12.4M"
  volumeRaw: number;
  sector: 'Banking' | 'Consumer Goods' | 'Oil & Gas' | 'Industrials' | 'Agriculture' | 'Conglomerates';
  sparkline: number[]; // 7 data points for mini sparkline
  chartData: { date: string; price: number; volume: number }[]; // 30-day historical chart data
  peRatio: number;
  pbRatio: number;
  marketCap: string; // e.g. "₦1.85T"
  dividendYield: string; // e.g. "6.4%"
  fiftyTwoWeekRange: { low: number; high: number };
  description: string;
  aiInsight: {
    Beginner: string;
    Intermediate: string;
    Experienced: string;
  };
  eps: number;
  bvps: number;
  targetPrice: number;
  rating: 'Outperform' | 'Neutral' | 'Underperform';
}

export interface NewsItem {
  id: string;
  source: string;
  timeAgo: string;
  originalHeadline: string;
  aiSummary: string;
  whyItMatters: string;
  implications: string;
  keyDriver: 'Earnings Beat' | 'Policy Change' | 'Macro Event' | 'Dividend Payout' | 'Inflation Surge' | 'Regulatory Approval';
  affectedStocks: string[]; // Ticker list
  marketImpact: 'Positive' | 'Negative' | 'Neutral';
  drivers?: string[];
  imageUrl: string;
  commentsCount: number;
  category: 'Featured' | 'Breaking' | 'Most Popular' | 'Cryptocurrency';
}

export const ngxIndexData = {
  allShareIndex: 98425.10,
  change: +1.24,
  changeAmount: +1205.80,
  status: 'Open' as 'Open' | 'Closed',
  lastUpdated: 'Just now',
};

// Generates 30 days of stock chart data with volatility
const generateChartData = (basePrice: number, volatility: number = 0.02) => {
  const data = [];
  let price = basePrice * 0.95; // start slightly lower to trend upwards
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
    
    // Random walk with a slight upward drift
    const change = price * (Math.random() - 0.48) * volatility;
    price += change;
    
    const volume = Math.floor(100000 + Math.random() * 5000000);
    data.push({
      date: dateStr,
      price: parseFloat(price.toFixed(2)),
      volume,
    });
  }
  return data;
};

export const ngxStocks: Stock[] = [
  {
    ticker: 'DANGCEM',
    name: 'Dangote Cement PLC',
    price: 650.00,
    change: 3.42,
    changeAmount: 21.50,
    volume: '8.4M',
    volumeRaw: 8400000,
    sector: 'Industrials',
    sparkline: [620, 625, 615, 630, 638, 642, 650],
    chartData: generateChartData(650, 0.015),
    peRatio: 15.4,
    pbRatio: 3.2,
    marketCap: '₦11.08T',
    dividendYield: '4.6%',
    fiftyTwoWeekRange: { low: 320.00, high: 710.00 },
    description: 'Dangote Cement PLC is Sub-Saharan Africa’s leading cement producer with operations in 10 African countries. Owned by Africa’s richest man, Aliko Dangote, it represents a core pillar of Nigerian industrial production and infrastructure construction.',
    aiInsight: {
      Beginner: "Dangote Cement is making a lot of profit because Nigeria is building more roads and houses. It is like buying a share in Africa's biggest builder—very stable but price goes up mostly when the country is building.",
      Intermediate: "Solid domestic infrastructure demand and capacity expansion are offsetting high inflationary pressures. Excellent cost-control despite diesel price spikes keeps operating margins healthy.",
      Experienced: "FCFF yield remains strong at 8.2% despite elevated CAPEX. Solid defensive moat with 60% domestic market share. High pricing power allows pass-through of FX depreciation costs onto end consumers."
    },
    eps: 42.21,
    bvps: 203.13,
    targetPrice: 720.00,
    rating: 'Outperform'
  },
  {
    ticker: 'MTNN',
    name: 'MTN Nigeria Communications PLC',
    price: 215.50,
    change: -1.82,
    changeAmount: -4.00,
    volume: '15.2M',
    volumeRaw: 15200000,
    sector: 'Industrials', // Grouping in utilities/industrials for filter
    sparkline: [225, 222, 220, 218, 214, 218, 215.5],
    chartData: generateChartData(215.5, 0.02),
    peRatio: 12.1,
    pbRatio: 2.8,
    marketCap: '₦4.38T',
    dividendYield: '7.8%',
    fiftyTwoWeekRange: { low: 180.00, high: 290.00 },
    description: 'MTN Nigeria Communications PLC is the largest provider of broadband, mobile, and digital services in Nigeria, serving over 70 million subscribers nationwide.',
    aiInsight: {
      Beginner: "MTN is losing a bit of stock value because they had to pay a lot of money for dollar loans, even though millions of Nigerians are still buying data and airtime every single day.",
      Intermediate: "FX translation losses on foreign-currency-denominated leases have impacted net profit. However, 18% YoY growth in active data subscribers shows that core operational revenue remains exceptionally robust.",
      Experienced: "EBITDA margin compressed by 150bps due to tower lease indexation to FX rates. Mobile Money (MoMo) active wallets grew to 5.2M, which represents the primary long-term upside to non-voice service expansion."
    },
    eps: 17.81,
    bvps: 76.96,
    targetPrice: 240.00,
    rating: 'Neutral'
  },
  {
    ticker: 'ZENITHBANK',
    name: 'Zenith Bank PLC',
    price: 38.20,
    change: 4.66,
    changeAmount: 1.70,
    volume: '24.8M',
    volumeRaw: 24800000,
    sector: 'Banking',
    sparkline: [35.5, 36.2, 35.8, 36.5, 37.0, 37.8, 38.2],
    chartData: generateChartData(38.2, 0.025),
    peRatio: 3.5,
    pbRatio: 0.9,
    marketCap: '₦1.20T',
    dividendYield: '9.2%',
    fiftyTwoWeekRange: { low: 28.00, high: 44.50 },
    description: 'Zenith Bank PLC is a leading financial services provider in Nigeria and Anglophone West Africa, recognized for its heavy investments in tech-driven corporate banking.',
    aiInsight: {
      Beginner: "Zenith Bank is having an amazing year! They made massive gains because higher interest rates in Nigeria mean banks can charge borrowers more, and they are paying out an excellent dividend cash reward to shareholders.",
      Intermediate: "Net Interest Margin (NIM) expanded to 8.4% due to the Central Bank's monetary policy rate hikes. FX revaluation gains continue to bolster the bank's non-interest income stream.",
      Experienced: "Tier-1 capital adequacy ratio sits securely at 21.0%. Trading at an attractive 3.5x trailing P/E, offering highly defensive characteristics coupled with a double-digit prospective dividend yield."
    },
    eps: 10.91,
    bvps: 42.44,
    targetPrice: 48.00,
    rating: 'Outperform'
  },
  {
    ticker: 'GTCO',
    name: 'Guaranty Trust Holding Company PLC',
    price: 45.10,
    change: 5.12,
    changeAmount: 2.20,
    volume: '21.0M',
    volumeRaw: 21000000,
    sector: 'Banking',
    sparkline: [41.2, 42.0, 42.5, 43.1, 42.8, 44.0, 45.1],
    chartData: generateChartData(45.1, 0.02),
    peRatio: 3.8,
    pbRatio: 1.1,
    marketCap: '₦1.33T',
    dividendYield: '8.4%',
    fiftyTwoWeekRange: { low: 32.50, high: 53.00 },
    description: 'Guaranty Trust Holding Company PLC (GTCO) is a major financial service provider, famous for its youth-centric digital banking app (GTBank) and premium retail brand.',
    aiInsight: {
      Beginner: "GTCO (GTBank) is growing fast because its digital transfers are extremely popular with young Nigerians. They are making big money from charging small fees on millions of transfers every day.",
      Intermediate: "Cost-to-income ratio remains the best in the industry at 42%. Sustained growth in e-payment transaction volumes is successfully offsetting rising operating overheads.",
      Experienced: "RoE remains industry-leading at 28.5%. Highly efficient retail deposit base provides a cheap funding source, allowing GTCO to capture maximum benefits from the elevated yield environment."
    },
    eps: 11.87,
    bvps: 41.00,
    targetPrice: 55.00,
    rating: 'Outperform'
  },
  {
    ticker: 'SEPLAT',
    name: 'Seplat Energy PLC',
    price: 3450.00,
    change: -2.82,
    changeAmount: -100.00,
    volume: '0.4M',
    volumeRaw: 400000,
    sector: 'Oil & Gas',
    sparkline: [3600, 3550, 3580, 3500, 3520, 3480, 3450],
    chartData: generateChartData(3450, 0.035),
    peRatio: 9.8,
    pbRatio: 1.4,
    marketCap: '₦2.03T',
    dividendYield: '5.1%',
    fiftyTwoWeekRange: { low: 1800.00, high: 3800.00 },
    description: 'Seplat Energy PLC is Nigeria’s leading independent oil and gas company, listed on both the Nigerian Exchange and the London Stock Exchange.',
    aiInsight: {
      Beginner: "Seplat is losing price value today because international oil prices fell slightly, and the pipeline they use to ship oil had some temporary maintenance issues.",
      Intermediate: "Production decreased to 44,000 boepd due to pipeline downtime. However, gas-to-power revenue rose by 14%, offering an excellent secondary buffer to crude price volatility.",
      Experienced: "Free cash flow yield remains strong at 11.2% supporting their quarterly dividend policy. The pending acquisition of Mobil Producing Nigeria Unlimited (MPNU) assets remains the core catalyst for explosive reserve additions."
    },
    eps: 352.04,
    bvps: 2464.29,
    targetPrice: 3800.00,
    rating: 'Outperform'
  },
  {
    ticker: 'BUAFOODS',
    name: 'BUA Foods PLC',
    price: 380.00,
    change: 0.00,
    changeAmount: 0.00,
    volume: '2.8M',
    volumeRaw: 2800000,
    sector: 'Consumer Goods',
    sparkline: [380, 380, 380, 380, 380, 380, 380],
    chartData: generateChartData(380, 0.01),
    peRatio: 28.2,
    pbRatio: 8.5,
    marketCap: '₦6.84T',
    dividendYield: '3.1%',
    fiftyTwoWeekRange: { low: 220.00, high: 410.00 },
    description: 'BUA Foods PLC is a leading food business in Nigeria, specializing in manufacturing sugar, flour, pasta, rice, and edible oils.',
    aiInsight: {
      Beginner: "BUA Foods' price didn't change today because investors are holding onto their shares. People must buy food (like sugar and spaghetti) even when times are tough, so the company is a safe bet.",
      Intermediate: "Revenue grew 48% YoY driven by capacity expansion in flour and pasta lines. High gross margin of 32% helps absorb local currency devaluation impacts on imported raw wheat.",
      Experienced: "BUA Foods shows highly inelastic demand characteristics. P/E of 28.2x represents a growth premium, but outstanding return on assets (ROA) of 18% justifies investor confidence."
    },
    eps: 13.48,
    bvps: 44.71,
    targetPrice: 350.00,
    rating: 'Neutral'
  },
  {
    ticker: 'ACCESSCORP',
    name: 'Access Holdings PLC',
    price: 18.50,
    change: -4.15,
    changeAmount: -0.80,
    volume: '32.4M',
    volumeRaw: 32400000,
    sector: 'Banking',
    sparkline: [19.8, 19.5, 19.1, 18.9, 18.2, 18.7, 18.5],
    chartData: generateChartData(18.5, 0.03),
    peRatio: 2.2,
    pbRatio: 0.5,
    marketCap: '₦657B',
    dividendYield: '10.8%',
    fiftyTwoWeekRange: { low: 15.00, high: 29.00 },
    description: 'Access Holdings PLC is a leading multinational financial services conglomerate, operating the largest retail bank network in Nigeria by customer base.',
    aiInsight: {
      Beginner: "Access Bank's price dropped because they are asking shareholders to invest more money (called a Rights Issue) to expand their business. This temporary surge in shares available makes the price dip.",
      Intermediate: "Rights Issue of ₦351B is currently underway to meet the Central Bank's new minimum capital requirements (₦500B for international banks). This dilution creates temporary price pressure.",
      Experienced: "At 0.5x book value, Access is highly undervalued. Pan-African expansion into 15+ countries creates a natural hedge against single-country Nigerian FX risk, promising strong long-term EPS accretion."
    },
    eps: 8.41,
    bvps: 37.00,
    targetPrice: 25.00,
    rating: 'Outperform'
  },
  {
    ticker: 'NESTLE',
    name: 'Nestle Nigeria PLC',
    price: 820.00,
    change: -5.75,
    changeAmount: -50.00,
    volume: '1.2M',
    volumeRaw: 1200000,
    sector: 'Consumer Goods',
    sparkline: [900, 890, 860, 850, 830, 810, 820],
    chartData: generateChartData(820, 0.04),
    peRatio: -14.2, // negative due to recent FX losses
    pbRatio: -4.5,
    marketCap: '₦650B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 780.00, high: 1250.00 },
    description: 'Nestle Nigeria PLC is a major food and beverage manufacturing company, famous for household staples like Milo, Maggi, and Golden Morn.',
    aiInsight: {
      Beginner: "Nestle's stock dropped heavily today. The company had huge losses recently because they buy some ingredients in dollars, and the Naira became much weaker, which made their dollar-debts balloon.",
      Intermediate: "Substantial FX revaluation losses on USD-denominated loans have wiped out operating profits, leading to a negative equity position. Core operations, however, remain strong with a 24% increase in domestic brand sales.",
      Experienced: "Balance sheet repair is critical. Nestle’s net finance cost jumped 300% YoY due to Naira devaluation. Operating cash flow remains highly positive, but they will likely suspend dividend payments to conserve liquidity."
    },
    eps: -57.75,
    bvps: -182.22,
    targetPrice: 750.00,
    rating: 'Underperform'
  },
  {
    ticker: 'OANDO',
    name: 'Oando PLC',
    price: 32.40,
    change: 9.83,
    changeAmount: 2.90,
    volume: '18.9M',
    volumeRaw: 18900000,
    sector: 'Oil & Gas',
    sparkline: [28.2, 28.5, 29.0, 29.5, 30.2, 31.0, 32.4],
    chartData: generateChartData(32.4, 0.035),
    peRatio: 8.2,
    pbRatio: 1.8,
    marketCap: '₦403B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 12.00, high: 36.50 },
    description: 'Oando PLC is a leading indigenous energy solutions provider active across upstream oil exploration, refining, and gas retail.',
    aiInsight: {
      Beginner: "Oando is flying high! The price went up by almost 10% today because the government officially approved their deal to buy an oil field from a giant foreign oil company (Eni).",
      Intermediate: "Stock hitting limits on heavy buy-side volume following the final regulatory sign-off on the 100% acquisition of Nigerian Agip Oil Company (NAOC). This will immediately double upstream output.",
      Experienced: "The acquisition of NAOC assets is highly transformative, adding 40,000 boepd of net production and extensive infrastructure. High leverage remains a concern, but cash-flow expansion will rapidly deleverage the company."
    },
    eps: 3.95,
    bvps: 18.00,
    targetPrice: 42.00,
    rating: 'Outperform'
  },
  {
    ticker: 'UBA',
    name: 'United Bank for Africa PLC',
    price: 26.80,
    change: 4.89,
    changeAmount: 1.25,
    volume: '29.1M',
    volumeRaw: 29100000,
    sector: 'Banking',
    sparkline: [24.8, 25.1, 24.9, 25.5, 26.0, 26.2, 26.8],
    chartData: generateChartData(26.8, 0.02),
    peRatio: 2.8,
    pbRatio: 0.7,
    marketCap: '₦916B',
    dividendYield: '10.1%',
    fiftyTwoWeekRange: { low: 18.50, high: 34.00 },
    description: 'United Bank for Africa PLC is an African multinational financial services group headquartered in Lagos, with presence in 20 African countries, London, Paris, and New York.',
    aiInsight: {
      Beginner: "UBA is having a great day. Because they do business in many other African countries, they make money in different currencies. When the Naira drops, their non-Naira profits become much bigger in Naira!",
      Intermediate: "Strong geographic diversification across UBA Africa subsidiaries is providing a substantial natural hedge against Naira FX depreciation, accounting for 45% of group earnings.",
      Experienced: "UBA is exceptionally well-positioned to meet capitalization requirements through retained earnings rather than dilution. Capital adequacy ratio of 22.8% is among the safest in Tier-1 banks."
    },
    eps: 9.57,
    bvps: 38.29,
    targetPrice: 35.00,
    rating: 'Outperform'
  }
];

export const mockMovers = {
  gainers: ngxStocks.filter(s => s.change > 0).sort((a, b) => b.change - a.change).slice(0, 5),
  losers: ngxStocks.filter(s => s.change < 0).sort((a, b) => a.change - b.change).slice(0, 5),
};

export const aiDailyBrief = {
  Beginner: "Today on the Nigerian Stock Exchange (NGX), stocks went up! Banks like Zenith and GTBank made a lot of money for investors because the Central Bank is raising interest rates, which helps banks profit. On the flip side, popular food companies like Nestle had a tough day because it's getting more expensive to buy imported ingredients in dollars. If you are starting, focusing on big banks or stable builders like Dangote Cement is a great way to stay safe.",
  Intermediate: "The NGX closed in green today, driven by heavy buying in the Tier-1 Banking sector (+4.8% average) after positive earnings expectations under the CBN's hawkish monetary policy stance. High-yield deposit capture is boosting banking net interest margins. Meanwhile, currency headwinds continue to impact consumer goods manufacturers, as seen in Nestle's 5.7% price dip. Focus on companies with strong local supply chains to weather FX volatility.",
  Experienced: "A strong bid in banking equities (GTCO, Zenith, UBA) propelled the NGX ASI upwards by 1.24% to close at 98,425.10 points. Institutional investors are positioning in dividend-paying financial stocks, absorbing the minor sell-side pressures from consumer goods due to balance-sheet FX exposure. Sector rotation from consumer goods to banks and indigenous oil/gas (Oando +9.8% on NAOC asset sign-off) is the dominant theme of this week's trading cycle."
};

export const mockNews: NewsItem[] = [
  {
    id: 'news-1',
    source: 'BusinessDay',
    timeAgo: '2h ago',
    originalHeadline: 'CBN Grants Final Approval for Oando Acquisition of Agip Oil Assets',
    aiSummary: 'Oando PLC has received final regulatory approval from the Central Bank and NUPRC to buy Italian oil giant Eni\'s local subsidiary (Agip). This massive deal will instantly double Oando\'s oil production capacity, creating high optimism in the energy market.',
    whyItMatters: 'NAOC acquisition instantly doubles Oando\'s upstream oil production capacity from 20,000 to 40,000 barrels per day, creating substantial cash flow expansion.',
    implications: 'Investors are highly optimistic because expanded upstream reserves will increase Oando\'s revenue and help deleverage its balance sheet faster.',
    keyDriver: 'Regulatory Approval',
    affectedStocks: ['OANDO', 'SEPLAT'],
    marketImpact: 'Positive',
    drivers: ['Acquisition', 'Regulatory', 'OilAndGas', 'ProductionBoost'],
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=300&q=80',
    commentsCount: 18,
    category: 'Breaking',
  },
  {
    id: 'news-2',
    source: 'PremiumTimes',
    timeAgo: '4h ago',
    originalHeadline: 'Nestle Nigeria Records FX Loss as Naira Volatility Weighs on Earnings',
    aiSummary: 'Nestle Nigeria reported substantial losses in its latest quarterly results due to dollar-based loans. Although local sales of Milo and Maggi grew by 24%, the cost of paying off dollar debts in weakened Naira has completely wiped out their profits.',
    whyItMatters: 'Dollar-denominated loans caused massive currency revaluation losses due to Naira devaluation, wiping out otherwise profitable local sales.',
    implications: 'Nestle\'s negative equity position means they will likely suspend future dividend payouts to conserve liquidity.',
    keyDriver: 'Inflation Surge',
    affectedStocks: ['NESTLE', 'BUAFOODS'],
    marketImpact: 'Negative',
    drivers: ['ForexLoss', 'Devaluation', 'ConsumerGoods', 'EarningsReport'],
    imageUrl: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=300&q=80',
    commentsCount: 12,
    category: 'Featured',
  },
  {
    id: 'news-3',
    source: 'Nairametrics',
    timeAgo: '6h ago',
    originalHeadline: 'Zenith Bank Proposes Outstanding Interim Dividend of N1.00 Per Share',
    aiSummary: 'Zenith Bank has announced a cash payout of ₦1.00 for every share you own. This reward comes after their half-year profits surged by 42% due to high interest rates, making it highly attractive to dividend-seeking investors.',
    whyItMatters: 'Profits rose 42% due to high interest rates, allowing the bank to reward shareholders with an attractive interim cash payout.',
    implications: 'Seeking dividend income? Zenith is highly attractive, drawing more domestic capital into tier-1 banking equities.',
    keyDriver: 'Dividend Payout',
    affectedStocks: ['ZENITHBANK', 'GTCO'],
    marketImpact: 'Positive',
    drivers: ['InterimDividend', 'BankingSector', 'ProfitsSurge', 'CashPayout'],
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
    commentsCount: 24,
    category: 'Most Popular',
  },
  {
    id: 'news-4',
    source: 'Stears Business',
    timeAgo: '1d ago',
    originalHeadline: 'Inflation Hits 33.69% in Nigeria; Consumer Spending Power Drops',
    aiSummary: 'Nigeria\'s inflation continues to climb, rising to 33.69%. This means food, transport, and energy are much more expensive. Consumers are spending less on snacks, forcing food companies to cut costs and struggle with sales.',
    whyItMatters: 'Rising price levels reduce the purchasing power of average consumers, squeezing sales for consumer goods manufacturers.',
    implications: 'Margins will continue to contract unless firms can successfully pass rising import costs down to local consumers.',
    keyDriver: 'Macro Event',
    affectedStocks: ['NESTLE', 'BUAFOODS'],
    marketImpact: 'Negative',
    drivers: ['InflationData', 'Macroeconomics', 'ConsumerGoods', 'PurchasingPower'],
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=300&q=80',
    commentsCount: 9,
    category: 'Breaking',
  },
  {
    id: 'news-5',
    source: 'BusinessDay',
    timeAgo: '2d ago',
    originalHeadline: 'Access Holdings Launches N351 Billion Rights Issue for Capital Raise',
    aiSummary: 'Access Holdings is asking current investors to buy new shares at a discount (₦19.75) to raise ₦351 Billion. This money will help them meet the Central Bank\'s new high capital rules, but the extra shares on the market have caused the price to drop slightly.',
    whyItMatters: 'The bank needs to raise ₦351 Billion to satisfy the Central Bank of Nigeria\'s new tier-1 capital requirements.',
    implications: 'The addition of new discounted shares will create short-term dilution and price pressure, though long-term solvency improves.',
    keyDriver: 'Policy Change',
    affectedStocks: ['ACCESSCORP', 'UBA'],
    marketImpact: 'Neutral',
    drivers: ['RightsIssue', 'CapitalAdequacy', 'BankingSector', 'CBNPolicy'],
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=300&q=80',
    commentsCount: 15,
    category: 'Featured',
  },
  {
    id: 'news-6',
    source: 'Nairametrics',
    timeAgo: '23h ago',
    originalHeadline: 'Dangote Cement Expands Export Capacity, Targets West African Markets',
    aiSummary: 'Dangote Cement PLC has commissioned new clinker export terminals, expanding its reach into neighboring West African countries to earn foreign exchange and hedge against local inflation.',
    whyItMatters: 'Export earnings in foreign currency provide a natural buffer against domestic currency devaluation and high input inflation.',
    implications: 'Dangote Cement will likely report higher non-operating cash flows and stronger foreign exchange reserves, reinforcing its Outperform rating.',
    keyDriver: 'Policy Change',
    affectedStocks: ['DANGCEM'],
    marketImpact: 'Positive',
    drivers: ['Exports', 'Expansion', 'WestAfrica', 'Dangote'],
    imageUrl: 'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=300&q=80',
    commentsCount: 8,
    category: 'Featured',
  },
  {
    id: 'news-7',
    source: 'TechCabal',
    timeAgo: '14h ago',
    originalHeadline: 'MTN Nigeria Secures License for Additional 5G Spectrum from NCC',
    aiSummary: 'MTN Nigeria has acquired more 5G spectrum space to boost network speeds and capacity. This is expected to drive higher data usage and subscription revenue.',
    whyItMatters: 'Additional spectrum allows MTN to handle more concurrent high-bandwidth data connections, reducing congestion in urban hubs like Lagos.',
    implications: 'Data revenue growth will continue its upward trend, potentially offsetting margins compressed by tower leases.',
    keyDriver: 'Policy Change',
    affectedStocks: ['MTNN'],
    marketImpact: 'Positive',
    drivers: ['5GSpectrum', 'NCC', 'Telecoms', 'DataGrowth'],
    imageUrl: 'https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=300&q=80',
    commentsCount: 22,
    category: 'Breaking',
  },
  {
    id: 'news-8',
    source: 'BusinessDay',
    timeAgo: '15h ago',
    originalHeadline: 'BUA Foods Reports Record N120 Billion Profit in Half-Year Performance',
    aiSummary: 'BUA Foods announced record half-year profits, driven by massive increases in sales across its sugar, pasta, and flour product lines, showing strong inelastic consumer demand.',
    whyItMatters: 'Inelastic consumer demand for essential food items allows BUA Foods to maintain high margins despite rising wheat and transport costs.',
    implications: 'Strong cash generation supports capital expenditures for new production lines and potential dividend growth.',
    keyDriver: 'Earnings Beat',
    affectedStocks: ['BUAFOODS'],
    marketImpact: 'Positive',
    drivers: ['Earnings', 'FoodStaples', 'RecordProfit', 'BUA'],
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80',
    commentsCount: 14,
    category: 'Most Popular',
  },
  {
    id: 'news-9',
    source: 'PremiumTimes',
    timeAgo: '28m ago',
    originalHeadline: 'Seplat Energy Resumes Oil Export Operations via Forcados Terminal',
    aiSummary: 'Seplat Energy PLC has resumed crude oil exports at the Forcados Terminal after completion of scheduled pipeline maintenance, ending a short production dip.',
    whyItMatters: 'Resumption of Forcados exports returns Seplat\'s production to normal levels (~45k boepd), securing near-term oil revenue.',
    implications: 'Third-quarter cash flows will recover strongly, solidifying the quarterly dividend payouts to shareholders.',
    keyDriver: 'Macro Event',
    affectedStocks: ['SEPLAT', 'OANDO'],
    marketImpact: 'Positive',
    drivers: ['OilExports', 'Forcados', 'ProductionRecovery', 'Seplat'],
    imageUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=300&q=80',
    commentsCount: 5,
    category: 'Most Popular',
  },
  {
    id: 'news-10',
    source: 'CryptoAsset',
    timeAgo: '3h ago',
    originalHeadline: 'SEC Nigeria Issues Regulatory Framework for Digital Asset Exchanges',
    aiSummary: 'The Securities and Exchange Commission of Nigeria has released new guidelines and licensing frameworks for digital assets, signaling a major shift in regulatory tone.',
    whyItMatters: 'Clear regulatory guidelines legitimize local crypto platforms, reducing systemic banking transaction block risks.',
    implications: 'Fintech startups and retail traders gain legal clarity, which may boost digital asset transaction volumes in the country.',
    keyDriver: 'Regulatory Approval',
    affectedStocks: [],
    marketImpact: 'Neutral',
    drivers: ['CryptoRules', 'SECNigeria', 'DigitalAssets', 'Regulation'],
    imageUrl: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&w=300&q=80',
    commentsCount: 31,
    category: 'Cryptocurrency',
  }
];

export const getConceptExplanation = (concept: string, level: 'Beginner' | 'Intermediate' | 'Experienced'): string => {
  const dictionary: Record<string, { Beginner: string; Intermediate: string; Experienced: string }> = {
    'pe ratio': {
      Beginner: "**P/E Ratio** is like checking how many years it will take to get your money back! \n\n*   **Analogy**: Think of a local *mama put* (food stall). If the stall makes ₦100,000 profit a year, and the owner wants to sell the whole business to you for ₦500,000, the P/E ratio is **5** (₦500k divided by ₦100k). You get your money back in 5 years! \n*   **Rule of thumb**: A lower P/E ratio means the stock is cheaper and you get your money back faster! *Remember, this is for learning, not financial advice.*",
      Intermediate: "**P/E Ratio (Price-to-Earnings)** measures a company's current share price relative to its earnings per share (EPS). \n\n*   **Formula**: P/E = Market Price per Share / Earnings per Share.\n*   **Interpretation**: If Zenith Bank has a P/E of 3.5, it means investors pay ₦3.5 for every ₦1 of profit the bank makes. A lower P/E relative to industry peers (e.g. comparing Zenith to GTCO) suggests the stock may be undervalued.\n*   **Context**: In Nigeria, banks typically trade at low P/Es (2x-5x) due to emerging market risks, while fast-moving consumer goods (FMCG) like BUA Foods trade at high P/Es (20x-30x) due to brand premiums. *Remember, this is for learning, not financial advice.*",
      Experienced: "**Price-to-Earnings (P/E) Multiple** represents the market's capitalization of a firm's current earning power.\n\n*   **Derivation**: $P/E = \\frac{1 - g/RoE}{r - g}$ under Gordon Growth assumptions. \n*   **Analytical Use**: It serves as a shortcut for discounted cash flow (DCF). A low bank P/E (e.g., Access at 2.2x) reflects capital dilution risks from rights issues and regulatory capital requirements, representing a value trap or a deeply mispriced asset depending on their pan-African ROE yields.\n*   **FMCG vs Banking**: Multiples dispersion in the NGX (e.g. BUAFOODS at 28x vs. GTCO at 3.8x) represents stark differences in asset-light compounding profiles and capital efficiency under elevated risk-free rates (3-year T-bills > 21%). *Remember, this is for learning, not financial advice.*"
    },
    'how to invest': {
      Beginner: "Starting to invest in Nigeria is simple! \n\n1.  **Get a Broker**: You need a certified broker (like Bamboo, Chaka, Trove, or standard banks). These are like digital markets where you buy stocks.\n2.  **Get a CHN/CSCS Number**: The broker will create a secure, government-tracked account for you (CSCS account). This holds your digital stocks securely so nobody can steal them!\n3.  **Start Small**: You don't need millions! You can start buying shares of banks like UBA or Zenith for less than ₦5,000.\n*   **Tip**: Treat stocks like buying a piece of a real shop in Balogun market—you want to hold onto it to collect profit dividends! *Remember, this is for learning, not financial advice.*",
      Intermediate: "To start investing on the NGX:\n\n*   **CSCS Account**: Your Central Securities Clearing System (CSCS) account is the centralized registry that secures all equities in Nigeria.\n*   **Brokers**: Select an SEC-registered broker. Digital-first platforms have made this paperless (verification via BVN).\n*   **Strategy**: Dollar-cost average (DCA) into defensive dividend stocks like GTCO, Zenith, and Dangote Cement to compound returns over time.\n*   *Remember, this is for learning, not financial advice.*",
      Experienced: "NGX execution architecture requires an active CSCS clearing account mapped to an SEC-licensed broker-dealer. \n\n*   **Execution**: Multi-asset portfolio allocation can be optimized by targeting index heavyweights (DANGCEM, BUAFOODS, MTNN) for passive index replication, or active trading in volatile oil/gas equities (OANDO, SEPLAT) for momentum plays.\n*   **Hedging Strategy**: Due to systemic Naira depreciation, defensive portfolios should over-allocate to net-exporters or banks with pan-African currency footprints (like UBA or Access) to capture natural currency hedges.\n*   *Remember, this is for learning, not financial advice.*"
    },
    'ngx': {
      Beginner: "**NGX** stands for the **Nigerian Exchange Group** (previously called the Nigerian Stock Exchange). \n\n*   **Analogy**: Think of it like a huge, digital **Alaba International Market** or **Mile 12 Market**, but instead of selling electronics or tomatoes, people are buying and selling tiny pieces of huge companies like MTN, Dangote, and Zenith Bank.\n*   **How it works**: When these companies make more profit, their pieces become more valuable, and they share some of the profits (dividends) with you! *Remember, this is for learning, not financial advice.*",
      Intermediate: "The **Nigerian Exchange Group (NGX)** is the principal stock exchange of Nigeria. It lists over 150 companies with a market capitalization exceeding ₦50 Trillion.\n\n*   **Index**: The performance is tracked by the **All-Share Index (ASI)**, a weighted index representing all listed equities.\n*   **Trading Hours**: The exchange is open from Monday to Friday, 9:30 AM to 2:30 PM WAT.\n*   *Remember, this is for learning, not financial advice.*",
      Experienced: "The **NGX Group** is a demutualized, multi-asset exchange operating under SEC oversight.\n\n*   **Market Structure**: Equities are categorized into Premium, Main, and Growth boards. The All-Share Index (ASI) is free-float market-capitalization weighted.\n*   **Monetary Dynamics**: Market liquidity is heavily correlated with the CBN's Monetary Policy Rate (MPR) and banking sector cash reserve ratios (CRR). High domestic interest rates often trigger capital flight from equities to fixed income, except for banks capturing high margins on sovereign debt.\n*   *Remember, this is for learning, not financial advice.*"
    }
  };

  const defaultExplanation = {
    Beginner: "Let me break that down simply! Investing is like buying a bag of rice in the market to sell later when it is more expensive, or buying a share in a local shop so you can get a slice of their weekly profits. Always buy what you understand, start small, and think long-term! *Remember, this is for learning, not financial advice.*",
    Intermediate: "Financial concepts are tools to help you evaluate asset quality. Diversifying across sectors, understanding dividend yield, and evaluating earnings growth are crucial steps. *Remember, this is for learning, not financial advice.*",
    Experienced: "Quantitative equity valuation necessitates analyzing free cash flow yields, capital adequacy ratios, inflation-adjusted returns, and sovereign risk premiums. High nominal yields must always be benchmarked against systemic FX depreciation. *Remember, this is for learning, not financial advice.*"
  };

  const key = concept.toLowerCase().trim();
  const entry = dictionary[key];
  return entry ? entry[level] : defaultExplanation[level];
};
