export interface Stock {
  ticker: string;
  name: string;
  price: number;
  change: number; // percentage change, e.g. +2.3 or -1.7
  changeAmount: number; // actual price change, e.g. +4.50
  volume: string; // formatted volume, e.g. "12.4M"
  volumeRaw: number;
  sector: 'Banking' | 'Consumer Goods' | 'Oil & Gas' | 'Industrials' | 'Agriculture' | 'Conglomerates' | 'Insurance' | 'Healthcare' | 'ICT' | 'Services' | 'Real Estate';
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
  logoUrl?: string;
}

export interface NewsItem {
  id: string;
  author?: string;
  source: string;
  timeAgo: string;
  date: string; // ISO string for calendar filtering
  originalHeadline: string;
  aiSummary: string;
  whyItMatters: string;
  implications: string;
  educationalConcept?: string;
  keyDriver: 'Earnings Beat' | 'Policy Change' | 'Macro Event' | 'Dividend Payout' | 'Inflation Surge' | 'Regulatory Approval';
  affectedStocks: string[]; // Ticker list
  marketImpact: 'Positive' | 'Negative' | 'Neutral';
  drivers?: string[];
  imageUrl: string;
  companyLogoUrl?: string;
  matchedCompany?: string;
  commentsCount: number;
  category: 'Stock Market' | 'Economy' | 'Global News' | 'Global Markets' | 'Corporate & Industry' | 'Featured' | string;
  link?: string;
  fullContent?: string;
  commentsList?: { id: string; user: string; avatar: string; text: string; timeAgo: string }[];
}

export interface IndexData {
  allShareIndex: number;
  change: number;
  changeAmount: number;
  status: 'Open' | 'Closed';
  lastUpdated: string;
  marketCap: string;
  volume: string;
  deals: string;
  open?: number;
  high?: number;
  low?: number;
  candles?: {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjusted_close?: number;
    volume: number;
  }[];
}

export const ngxIndexData: IndexData = {
  allShareIndex: 104918.30,
  change: 1.24,
  changeAmount: 1285.40,
  status: 'Open' as 'Open' | 'Closed',
  lastUpdated: 'Just now',
  marketCap: '₦59.20T',
  volume: '588.1M shares',
  deals: '14,382',
  open: 103632.90,
  high: 105120.40,
  low: 103610.15,
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0b/Dangote_Group_Logo.svg',
    price: 652.50,
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
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOlf7z4fg2HKMz2wx0EcootM0lPeIhvVPhqfaTZwSUCrwQ7UC_yUkJtWHz&s=10',
    price: 240.00,
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d6/Zenith_Bank_logo.svg',
    price: 36.50,
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
    logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPFIrKmTBegB7D5rAqXtzi42Su7Be7q78hyyd6Pkh6CQ&s=10',
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
    logoUrl: 'https://yt3.googleusercontent.com/rs2EEuf4IxWvfcckxrG2AnjskptlD-x_xl4aIUYwA11IkZThlNSIvedSYMSPfddnHkEQo3aUZ4c=s900-c-k-c0x00ffffff-no-rj',
    price: 3250.00,
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
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Logo_BUA_Foods.svg',
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
    name: 'Nestlé Nigeria PLC',
    logoUrl: 'https://d1jcea4y7xhp7l.cloudfront.net/wp-content/uploads/2023/11/NESTLElogo-with-wordmark-oak-1.png',
    price: 900.00,
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
  },
  {
    ticker: 'FBNH',
    name: 'FBN Holdings PLC',
    price: 26.50,
    change: 2.32,
    changeAmount: 0.60,
    volume: '18.4M',
    volumeRaw: 18400000,
    sector: 'Banking',
    sparkline: [25.0, 25.4, 25.2, 25.8, 26.1, 26.0, 26.5],
    chartData: generateChartData(26.5, 0.02),
    peRatio: 3.1,
    pbRatio: 0.8,
    marketCap: '₦951B',
    dividendYield: '8.2%',
    fiftyTwoWeekRange: { low: 16.50, high: 32.00 },
    description: 'FBN Holdings PLC is the non-operating holding company for First Bank of Nigeria Limited, Nigeria’s oldest commercial bank established in 1894.',
    aiInsight: {
      Beginner: "First Bank (FBNH) is Nigeria's oldest bank and continues to deliver steady returns with strong dividend payments to investors.",
      Intermediate: "Sustained improvement in asset quality with NPL ratio dropping below 4.5%. Gross earnings expanded 42% YoY on higher interest yield.",
      Experienced: "Deep institutional liquidity and low valuation (3.1x P/E) offer defensive value with substantial capital appreciation buffer."
    },
    eps: 8.55,
    bvps: 33.12,
    targetPrice: 34.00,
    rating: 'Outperform'
  },
  {
    ticker: 'STANBIC',
    name: 'Stanbic IBTC Holdings PLC',
    price: 58.00,
    change: 1.75,
    changeAmount: 1.00,
    volume: '4.2M',
    volumeRaw: 4200000,
    sector: 'Banking',
    sparkline: [56.0, 56.5, 57.0, 56.8, 57.5, 57.8, 58.0],
    chartData: generateChartData(58.0, 0.015),
    peRatio: 4.8,
    pbRatio: 1.3,
    marketCap: '₦751B',
    dividendYield: '7.1%',
    fiftyTwoWeekRange: { low: 44.00, high: 68.00 },
    description: 'Stanbic IBTC Holdings PLC is a member of Standard Bank Group, operating leading wealth management, pension administration, and corporate banking franchises in Nigeria.',
    aiInsight: {
      Beginner: "Stanbic IBTC is well known for managing pensions and wealth for millions of Nigerians, making its revenue very predictable.",
      Intermediate: "Market leader in pension funds management (PFA) with over 35% market share, generating non-interest fee income resilience.",
      Experienced: "Tier-1 capital adequacy and clean balance sheet position Stanbic IBTC as a premium quality banking asset."
    },
    eps: 12.08,
    bvps: 44.60,
    targetPrice: 68.00,
    rating: 'Outperform'
  },
  {
    ticker: 'FIDELITYBK',
    name: 'Fidelity Bank PLC',
    price: 12.50,
    change: 3.31,
    changeAmount: 0.40,
    volume: '22.1M',
    volumeRaw: 22100000,
    sector: 'Banking',
    sparkline: [11.8, 12.0, 11.9, 12.2, 12.1, 12.3, 12.5],
    chartData: generateChartData(12.5, 0.025),
    peRatio: 2.6,
    pbRatio: 0.6,
    marketCap: '₦400B',
    dividendYield: '9.5%',
    fiftyTwoWeekRange: { low: 7.20, high: 14.80 },
    description: 'Fidelity Bank PLC is a commercial bank in Nigeria catering to corporate, SME, and retail banking clients with international banking authorization.',
    aiInsight: {
      Beginner: "Fidelity Bank has been growing fast in SME lending and online banking, offering one of the highest dividend yields in the market.",
      Intermediate: "SME segment loan portfolio growth is driving double-digit net interest income gains.",
      Experienced: "Trading at an ultra-low 2.6x P/E with strong dividend coverage ratio."
    },
    eps: 4.80,
    bvps: 20.83,
    targetPrice: 16.00,
    rating: 'Outperform'
  },
  {
    ticker: 'TOTAL',
    name: 'TotalEnergies Marketing Nigeria PLC',
    price: 385.00,
    change: 0.00,
    changeAmount: 0.00,
    volume: '0.6M',
    volumeRaw: 600000,
    sector: 'Oil & Gas',
    sparkline: [385, 385, 385, 385, 385, 385, 385],
    chartData: generateChartData(385, 0.01),
    peRatio: 7.2,
    pbRatio: 1.9,
    marketCap: '₦130B',
    dividendYield: '6.5%',
    fiftyTwoWeekRange: { low: 300.00, high: 420.00 },
    description: 'TotalEnergies Marketing Nigeria PLC is a petroleum marketing company operating over 500 retail service stations across Nigeria.',
    aiInsight: {
      Beginner: "TotalEnergies sells fuel and lubricants across Nigeria. Fuel price deregulation has helped boost their revenues.",
      Intermediate: "Full deregulation of PMS pricing allows full margin recovery on downstream fuel distribution.",
      Experienced: "Robust cash conversion cycle and conservative leverage support steady payout ratios."
    },
    eps: 53.47,
    bvps: 202.63,
    targetPrice: 420.00,
    rating: 'Outperform'
  },
  {
    ticker: 'PRESCO',
    name: 'Presco PLC',
    price: 350.00,
    change: 4.48,
    changeAmount: 15.00,
    volume: '1.8M',
    volumeRaw: 1800000,
    sector: 'Agriculture',
    sparkline: [330, 335, 332, 340, 342, 345, 350],
    chartData: generateChartData(350, 0.02),
    peRatio: 11.5,
    pbRatio: 3.1,
    marketCap: '₦350B',
    dividendYield: '4.8%',
    fiftyTwoWeekRange: { low: 180.00, high: 380.00 },
    description: 'Presco PLC is a fully integrated agro-industrial company specializing in the cultivation of oil palms and extraction of crude palm oil.',
    aiInsight: {
      Beginner: "Presco makes palm oil locally in Edo and Delta states. Because importing palm oil is expensive, local manufacturers pay top Naira for Presco's palm oil.",
      Intermediate: "Global CPO price resilience combined with local FX protection boosts Presco's gross profit margins above 60%.",
      Experienced: "High biological asset valuation growth and expanding plantation hectarage drive long-term cash generation."
    },
    eps: 30.43,
    bvps: 112.90,
    targetPrice: 400.00,
    rating: 'Outperform'
  },
  {
    ticker: 'OKOMUOIL',
    name: 'Okomu Oil Palm PLC',
    price: 290.00,
    change: 2.11,
    changeAmount: 6.00,
    volume: '1.2M',
    volumeRaw: 1200000,
    sector: 'Agriculture',
    sparkline: [280, 282, 285, 284, 287, 288, 290],
    chartData: generateChartData(290, 0.015),
    peRatio: 10.8,
    pbRatio: 2.9,
    marketCap: '₦276B',
    dividendYield: '5.2%',
    fiftyTwoWeekRange: { low: 195.00, high: 315.00 },
    description: 'Okomu Oil Palm Company PLC operates oil palm plantations and rubber processing facilities in Edo State, Nigeria.',
    aiInsight: {
      Beginner: "Okomu Oil produces crude palm oil and natural rubber for local factories and export markets.",
      Intermediate: "Rubber export revenue provides a USD revenue buffer during foreign currency devaluations.",
      Experienced: "Solid balance sheet with virtually zero foreign currency debt exposure."
    },
    eps: 26.85,
    bvps: 100.00,
    targetPrice: 330.00,
    rating: 'Outperform'
  },
  {
    ticker: 'TRANSCORP',
    name: 'Transnational Corporation PLC',
    price: 12.80,
    change: 6.67,
    changeAmount: 0.80,
    volume: '45.8M',
    volumeRaw: 45800000,
    sector: 'Conglomerates',
    sparkline: [11.5, 11.8, 12.0, 12.2, 12.1, 12.5, 12.8],
    chartData: generateChartData(12.8, 0.03),
    peRatio: 14.2,
    pbRatio: 2.4,
    marketCap: '₦520B',
    dividendYield: '2.5%',
    fiftyTwoWeekRange: { low: 4.80, high: 16.50 },
    description: 'Transnational Corporation PLC (Transcorp) is a diversified conglomerate with strategic investments in hospitality (Transcorp Hotels), power generation, and energy.',
    aiInsight: {
      Beginner: "Transcorp owns iconic luxury hotels like Transcorp Hilton Abuja and major power plants supplying electricity across Nigeria.",
      Intermediate: "Power subsidiary expansion and high occupancy rates at Transcorp Hilton Abuja boost operating cashflows.",
      Experienced: "Transcorp Power listing unlocked substantial valuation transparency across the parent conglomerate structure."
    },
    eps: 0.90,
    bvps: 5.33,
    targetPrice: 16.00,
    rating: 'Outperform'
  },
  {
    ticker: 'UACN',
    name: 'UAC of Nigeria PLC',
    price: 16.50,
    change: 1.23,
    changeAmount: 0.20,
    volume: '5.2M',
    volumeRaw: 5200000,
    sector: 'Conglomerates',
    sparkline: [15.8, 16.0, 16.1, 16.0, 16.3, 16.4, 16.5],
    chartData: generateChartData(16.5, 0.02),
    peRatio: 9.1,
    pbRatio: 1.1,
    marketCap: '₦48B',
    dividendYield: '3.8%',
    fiftyTwoWeekRange: { low: 10.50, high: 19.00 },
    description: 'UAC of Nigeria PLC is one of Nigeria’s oldest holding companies, managing operating subsidiaries across animal feeds, paints (CAP PLC), packaged food, and logistics.',
    aiInsight: {
      Beginner: "UAC owns popular brands like Gala sausage rolls, Swan water, and CAP paints.",
      Intermediate: "Turnaround initiatives in the animal feeds and logistics segments are restoring profit margins.",
      Experienced: "Trading at asset backing discount with strategic portfolio restructuring momentum."
    },
    eps: 1.81,
    bvps: 15.00,
    targetPrice: 20.00,
    rating: 'Neutral'
  },
  {
    ticker: 'BUACEMENT',
    name: 'BUA Cement PLC',
    price: 145.00,
    change: 1.40,
    changeAmount: 2.00,
    volume: '5.4M',
    volumeRaw: 5400000,
    sector: 'Industrials',
    sparkline: [140, 142, 141, 143, 144, 143, 145],
    chartData: generateChartData(145, 0.015),
    peRatio: 24.5,
    pbRatio: 6.2,
    marketCap: '₦4.91T',
    dividendYield: '2.8%',
    fiftyTwoWeekRange: { low: 85.00, high: 160.00 },
    description: 'BUA Cement PLC is Nigeria’s second-largest cement producer with ultramodern manufacturing plants in Sokoto and Edo States.',
    aiInsight: {
      Beginner: "BUA Cement produces cement for building projects across Nigeria and exports to neighboring West African countries.",
      Intermediate: "New line expansions in Sokoto and Edo boost total installed capacity to 17 million metric tonnes per annum.",
      Experienced: "Low production cost per tonne due to dual-fuel power generation offers strong structural margin protection."
    },
    eps: 5.92,
    bvps: 23.38,
    targetPrice: 160.00,
    rating: 'Neutral'
  },
  {
    ticker: 'WAPCO',
    name: 'Lafarge Africa PLC',
    price: 38.50,
    change: 3.22,
    changeAmount: 1.20,
    volume: '8.9M',
    volumeRaw: 8900000,
    sector: 'Industrials',
    sparkline: [36.5, 37.0, 36.8, 37.5, 37.8, 38.0, 38.5],
    chartData: generateChartData(38.5, 0.02),
    peRatio: 10.2,
    pbRatio: 1.4,
    marketCap: '₦620B',
    dividendYield: '6.2%',
    fiftyTwoWeekRange: { low: 26.00, high: 42.00 },
    description: 'Lafarge Africa PLC is a subsidiary of Holcim Group, manufacturing cement, concrete, and aggregates for Nigeria’s construction sector.',
    aiInsight: {
      Beginner: "Lafarge produces Elephant Cement, one of the most recognized building brands in southern Nigeria.",
      Intermediate: "Deleveraged balance sheet with zero foreign currency debt eliminates FX loss exposure.",
      Experienced: "High dividend yield (6.2%) backed by 100% domestic currency funding makes Lafarge a top industrial pick."
    },
    eps: 3.77,
    bvps: 27.50,
    targetPrice: 45.00,
    rating: 'Outperform'
  },
  {
    ticker: 'AIRTELAFRI',
    name: 'Airtel Africa PLC',
    price: 2200.00,
    change: 0.92,
    changeAmount: 20.00,
    volume: '0.8M',
    volumeRaw: 800000,
    sector: 'Industrials',
    sparkline: [2150, 2160, 2170, 2180, 2190, 2195, 2200],
    chartData: generateChartData(2200, 0.015),
    peRatio: 16.5,
    pbRatio: 3.4,
    marketCap: '₦8.27T',
    dividendYield: '3.8%',
    fiftyTwoWeekRange: { low: 1500.00, high: 2400.00 },
    description: 'Airtel Africa PLC is a major telecommunications and mobile money services provider operating in 14 countries across East, Central, and West Africa.',
    aiInsight: {
      Beginner: "Airtel Africa provides mobile data and money transfer services to over 140 million customers across 14 African countries.",
      Intermediate: "Data revenue grew 28% YoY on accelerating 4G network rollouts across East and West Africa.",
      Experienced: "Airtel Money fintech valuation continues to expand, offering strategic unlock opportunities."
    },
    eps: 133.33,
    bvps: 647.05,
    targetPrice: 2500.00,
    rating: 'Outperform'
  },
  {
    ticker: 'AIICO',
    name: 'AIICO Insurance Plc',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/AIICO_Insurance_logo.png/320px-AIICO_Insurance_logo.png',
    price: 1.25,
    change: 2.4,
    changeAmount: 0.03,
    volume: '51K',
    volumeRaw: 51250,
    sector: 'Insurance',
    sparkline: [1.19, 1.21, 1.23, 1.24, 1.26, 1.28, 1.3],
    chartData: [
      { date: '1 Aug', price: 1.15, volume: 51250 },
      { date: '8 Aug', price: 1.19, volume: 71250 },
      { date: '15 Aug', price: 1.23, volume: 36250 },
      { date: '22 Aug', price: 1.24, volume: 101250 },
      { date: '29 Aug', price: 1.25, volume: 51250 }
    ],
    peRatio: 12.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.88, high: 1.62 },
    description: 'AIICO Insurance Plc (AIICO) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "AIICO Insurance Plc is trading at ₦1.25. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "AIICO maintains a P/E ratio of 12.0 with a current market capitalization of ₦0.0B.",
      Experienced: "AIICO demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦1.62."
    },
    eps: 0.1,
    bvps: 2.5,
    targetPrice: 1.47,
    rating: 'Outperform'
  },
  {
    ticker: 'MANSARD',
    name: 'AXA Mansard Insurance Plc',
    logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/AXA_Logo.svg/200px-AXA_Logo.svg.png',
    price: 5.4,
    change: 1.88,
    changeAmount: 0.1,
    volume: '55K',
    volumeRaw: 55400,
    sector: 'Insurance',
    sparkline: [5.13, 5.21, 5.29, 5.37, 5.45, 5.54, 5.62],
    chartData: [
      { date: '1 Aug', price: 4.97, volume: 55400 },
      { date: '8 Aug', price: 5.13, volume: 75400 },
      { date: '15 Aug', price: 5.29, volume: 40400 },
      { date: '22 Aug', price: 5.35, volume: 105400 },
      { date: '29 Aug', price: 5.4, volume: 55400 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 3.78, high: 7.02 },
    description: 'AXA Mansard Insurance Plc (MANSARD) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "AXA Mansard Insurance Plc is trading at ₦5.4. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "MANSARD maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "MANSARD demonstrates strategic exposure in Insurance. Dividend yield sits at 3.2% with 52-week high of ₦7.02."
    },
    eps: 1.2,
    bvps: 4.15,
    targetPrice: 6.37,
    rating: 'Outperform'
  },
  {
    ticker: 'CORNERST',
    name: 'Cornerstone Insurance Plc',
    price: 1.85,
    change: 3.35,
    changeAmount: 0.06,
    volume: '52K',
    volumeRaw: 51850,
    sector: 'Insurance',
    sparkline: [1.76, 1.79, 1.81, 1.84, 1.87, 1.9, 1.92],
    chartData: [
      { date: '1 Aug', price: 1.7, volume: 51850 },
      { date: '8 Aug', price: 1.76, volume: 71850 },
      { date: '15 Aug', price: 1.81, volume: 36850 },
      { date: '22 Aug', price: 1.83, volume: 101850 },
      { date: '29 Aug', price: 1.85, volume: 51850 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.29, high: 2.41 },
    description: 'Cornerstone Insurance Plc (CORNERST) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Cornerstone Insurance Plc is trading at ₦1.85. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "CORNERST maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "CORNERST demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦2.41."
    },
    eps: 0.31,
    bvps: 1.09,
    targetPrice: 2.18,
    rating: 'Outperform'
  },
  {
    ticker: 'CUSTODIAN',
    name: 'Custodian Investment Plc',
    price: 11.2,
    change: 0.9,
    changeAmount: 0.1,
    volume: '61K',
    volumeRaw: 61200,
    sector: 'Insurance',
    sparkline: [10.64, 10.81, 10.98, 11.14, 11.31, 11.48, 11.65],
    chartData: [
      { date: '1 Aug', price: 10.3, volume: 61200 },
      { date: '8 Aug', price: 10.64, volume: 81200 },
      { date: '15 Aug', price: 10.98, volume: 46200 },
      { date: '22 Aug', price: 11.09, volume: 111200 },
      { date: '29 Aug', price: 11.2, volume: 61200 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.01B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 7.84, high: 14.56 },
    description: 'Custodian Investment Plc (CUSTODIAN) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Custodian Investment Plc is trading at ₦11.2. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "CUSTODIAN maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.01B.",
      Experienced: "CUSTODIAN demonstrates strategic exposure in Insurance. Dividend yield sits at 5.6% with 52-week high of ₦14.56."
    },
    eps: 1.49,
    bvps: 5.33,
    targetPrice: 13.22,
    rating: 'Neutral'
  },
  {
    ticker: 'LASACO',
    name: 'Lasaco Assurance Plc',
    price: 2.1,
    change: -0.47,
    changeAmount: -0.01,
    volume: '52K',
    volumeRaw: 52100,
    sector: 'Insurance',
    sparkline: [1.99, 2.03, 2.06, 2.09, 2.12, 2.15, 2.18],
    chartData: [
      { date: '1 Aug', price: 1.93, volume: 52100 },
      { date: '8 Aug', price: 1.99, volume: 72100 },
      { date: '15 Aug', price: 2.06, volume: 37100 },
      { date: '22 Aug', price: 2.08, volume: 102100 },
      { date: '29 Aug', price: 2.1, volume: 52100 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.0B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 1.47, high: 2.73 },
    description: 'Lasaco Assurance Plc (LASACO) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Lasaco Assurance Plc is trading at ₦2.1. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "LASACO maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.0B.",
      Experienced: "LASACO demonstrates strategic exposure in Insurance. Dividend yield sits at 2.0% with 52-week high of ₦2.73."
    },
    eps: 0.16,
    bvps: 2.33,
    targetPrice: 2.48,
    rating: 'Neutral'
  },
  {
    ticker: 'LINKASSURE',
    name: 'Linkage Assurance Plc',
    price: 0.95,
    change: 1.06,
    changeAmount: 0.01,
    volume: '51K',
    volumeRaw: 50950,
    sector: 'Insurance',
    sparkline: [0.9, 0.92, 0.93, 0.95, 0.96, 0.97, 0.99],
    chartData: [
      { date: '1 Aug', price: 0.87, volume: 50950 },
      { date: '8 Aug', price: 0.9, volume: 70950 },
      { date: '15 Aug', price: 0.93, volume: 35950 },
      { date: '22 Aug', price: 0.94, volume: 100950 },
      { date: '29 Aug', price: 0.95, volume: 50950 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.66, high: 1.23 },
    description: 'Linkage Assurance Plc (LINKASSURE) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Linkage Assurance Plc is trading at ₦0.95. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "LINKASSURE maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "LINKASSURE demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦1.23."
    },
    eps: 0.11,
    bvps: 1.9,
    targetPrice: 1.12,
    rating: 'Outperform'
  },
  {
    ticker: 'MBENEFIT',
    name: 'Mutual Benefits Assurance Plc',
    price: 0.65,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50650,
    sector: 'Insurance',
    sparkline: [0.62, 0.63, 0.64, 0.65, 0.66, 0.67, 0.68],
    chartData: [
      { date: '1 Aug', price: 0.6, volume: 50650 },
      { date: '8 Aug', price: 0.62, volume: 70650 },
      { date: '15 Aug', price: 0.64, volume: 35650 },
      { date: '22 Aug', price: 0.64, volume: 100650 },
      { date: '29 Aug', price: 0.65, volume: 50650 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.45, high: 0.85 },
    description: 'Mutual Benefits Assurance Plc (MBENEFIT) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Mutual Benefits Assurance Plc is trading at ₦0.65. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "MBENEFIT maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "MBENEFIT demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.85."
    },
    eps: 0.11,
    bvps: 0.38,
    targetPrice: 0.77,
    rating: 'Neutral'
  },
  {
    ticker: 'NEM',
    name: 'NEM Insurance Plc',
    price: 8.9,
    change: 4.71,
    changeAmount: 0.42,
    volume: '59K',
    volumeRaw: 58900,
    sector: 'Insurance',
    sparkline: [8.46, 8.59, 8.72, 8.86, 8.99, 9.12, 9.26],
    chartData: [
      { date: '1 Aug', price: 8.19, volume: 58900 },
      { date: '8 Aug', price: 8.46, volume: 78900 },
      { date: '15 Aug', price: 8.72, volume: 43900 },
      { date: '22 Aug', price: 8.81, volume: 108900 },
      { date: '29 Aug', price: 8.9, volume: 58900 }
    ],
    peRatio: 9.0,
    pbRatio: 1.7,
    marketCap: '₦0.01B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 6.23, high: 11.57 },
    description: 'NEM Insurance Plc (NEM) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "NEM Insurance Plc is trading at ₦8.9. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "NEM maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.01B.",
      Experienced: "NEM demonstrates strategic exposure in Insurance. Dividend yield sits at 5.6% with 52-week high of ₦11.57."
    },
    eps: 0.99,
    bvps: 5.24,
    targetPrice: 10.5,
    rating: 'Outperform'
  },
  {
    ticker: 'PRESTIGE',
    name: 'Prestige Assurance Plc',
    price: 0.55,
    change: -1.79,
    changeAmount: -0.01,
    volume: '51K',
    volumeRaw: 50550,
    sector: 'Insurance',
    sparkline: [0.52, 0.53, 0.54, 0.55, 0.56, 0.56, 0.57],
    chartData: [
      { date: '1 Aug', price: 0.51, volume: 50550 },
      { date: '8 Aug', price: 0.52, volume: 70550 },
      { date: '15 Aug', price: 0.54, volume: 35550 },
      { date: '22 Aug', price: 0.54, volume: 100550 },
      { date: '29 Aug', price: 0.55, volume: 50550 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.39, high: 0.72 },
    description: 'Prestige Assurance Plc (PRESTIGE) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Prestige Assurance Plc is trading at ₦0.55. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "PRESTIGE maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "PRESTIGE demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.72."
    },
    eps: 0.09,
    bvps: 0.32,
    targetPrice: 0.65,
    rating: 'Underperform'
  },
  {
    ticker: 'REGALINS',
    name: 'Regency Alliance Insurance Plc',
    price: 0.45,
    change: 0.0,
    changeAmount: 0.0,
    volume: '50K',
    volumeRaw: 50450,
    sector: 'Insurance',
    sparkline: [0.43, 0.43, 0.44, 0.45, 0.45, 0.46, 0.47],
    chartData: [
      { date: '1 Aug', price: 0.41, volume: 50450 },
      { date: '8 Aug', price: 0.43, volume: 70450 },
      { date: '15 Aug', price: 0.44, volume: 35450 },
      { date: '22 Aug', price: 0.45, volume: 100450 },
      { date: '29 Aug', price: 0.45, volume: 50450 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.32, high: 0.59 },
    description: 'Regency Alliance Insurance Plc (REGALINS) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Regency Alliance Insurance Plc is trading at ₦0.45. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "REGALINS maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "REGALINS demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.59."
    },
    eps: 0.07,
    bvps: 0.26,
    targetPrice: 0.53,
    rating: 'Neutral'
  },
  {
    ticker: 'ROYALEX',
    name: 'Royal Exchange Plc',
    price: 0.75,
    change: 2.74,
    changeAmount: 0.02,
    volume: '51K',
    volumeRaw: 50750,
    sector: 'Insurance',
    sparkline: [0.71, 0.72, 0.73, 0.75, 0.76, 0.77, 0.78],
    chartData: [
      { date: '1 Aug', price: 0.69, volume: 50750 },
      { date: '8 Aug', price: 0.71, volume: 70750 },
      { date: '15 Aug', price: 0.73, volume: 35750 },
      { date: '22 Aug', price: 0.74, volume: 100750 },
      { date: '29 Aug', price: 0.75, volume: 50750 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.52, high: 0.98 },
    description: 'Royal Exchange Plc (ROYALEX) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Royal Exchange Plc is trading at ₦0.75. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "ROYALEX maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "ROYALEX demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.98."
    },
    eps: 0.17,
    bvps: 0.58,
    targetPrice: 0.89,
    rating: 'Outperform'
  },
  {
    ticker: 'SOVEREIGN',
    name: 'Sovereign Trust Insurance Plc',
    price: 0.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '50K',
    volumeRaw: 50500,
    sector: 'Insurance',
    sparkline: [0.47, 0.48, 0.49, 0.5, 0.51, 0.51, 0.52],
    chartData: [
      { date: '1 Aug', price: 0.46, volume: 50500 },
      { date: '8 Aug', price: 0.47, volume: 70500 },
      { date: '15 Aug', price: 0.49, volume: 35500 },
      { date: '22 Aug', price: 0.49, volume: 100500 },
      { date: '29 Aug', price: 0.5, volume: 50500 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.35, high: 0.65 },
    description: 'Sovereign Trust Insurance Plc (SOVEREIGN) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Sovereign Trust Insurance Plc is trading at ₦0.5. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "SOVEREIGN maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "SOVEREIGN demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.65."
    },
    eps: 0.07,
    bvps: 0.24,
    targetPrice: 0.59,
    rating: 'Neutral'
  },
  {
    ticker: 'SUNUASSUR',
    name: 'Sunu Assurances Nigeria Plc',
    price: 1.4,
    change: 5.26,
    changeAmount: 0.07,
    volume: '51K',
    volumeRaw: 51400,
    sector: 'Insurance',
    sparkline: [1.33, 1.35, 1.37, 1.39, 1.41, 1.43, 1.46],
    chartData: [
      { date: '1 Aug', price: 1.29, volume: 51400 },
      { date: '8 Aug', price: 1.33, volume: 71400 },
      { date: '15 Aug', price: 1.37, volume: 36400 },
      { date: '22 Aug', price: 1.39, volume: 101400 },
      { date: '29 Aug', price: 1.4, volume: 51400 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.98, high: 1.82 },
    description: 'Sunu Assurances Nigeria Plc (SUNUASSUR) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Sunu Assurances Nigeria Plc is trading at ₦1.4. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "SUNUASSUR maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "SUNUASSUR demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦1.82."
    },
    eps: 0.19,
    bvps: 0.67,
    targetPrice: 1.65,
    rating: 'Outperform'
  },
  {
    ticker: 'UNIVINSURE',
    name: 'Universal Insurance Plc',
    price: 0.38,
    change: 0.0,
    changeAmount: 0.0,
    volume: '50K',
    volumeRaw: 50380,
    sector: 'Insurance',
    sparkline: [0.36, 0.37, 0.37, 0.38, 0.38, 0.39, 0.4],
    chartData: [
      { date: '1 Aug', price: 0.35, volume: 50380 },
      { date: '8 Aug', price: 0.36, volume: 70380 },
      { date: '15 Aug', price: 0.37, volume: 35380 },
      { date: '22 Aug', price: 0.38, volume: 100380 },
      { date: '29 Aug', price: 0.38, volume: 50380 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.27, high: 0.49 },
    description: 'Universal Insurance Plc (UNIVINSURE) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Universal Insurance Plc is trading at ₦0.38. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "UNIVINSURE maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "UNIVINSURE demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.49."
    },
    eps: 0.04,
    bvps: 0.76,
    targetPrice: 0.45,
    rating: 'Neutral'
  },
  {
    ticker: 'VERITASKAP',
    name: 'Veritas Kapital Assurance Plc',
    price: 0.72,
    change: 2.86,
    changeAmount: 0.02,
    volume: '51K',
    volumeRaw: 50720,
    sector: 'Insurance',
    sparkline: [0.68, 0.69, 0.71, 0.72, 0.73, 0.74, 0.75],
    chartData: [
      { date: '1 Aug', price: 0.66, volume: 50720 },
      { date: '8 Aug', price: 0.68, volume: 70720 },
      { date: '15 Aug', price: 0.71, volume: 35720 },
      { date: '22 Aug', price: 0.71, volume: 100720 },
      { date: '29 Aug', price: 0.72, volume: 50720 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.5, high: 0.94 },
    description: 'Veritas Kapital Assurance Plc (VERITASKAP) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Veritas Kapital Assurance Plc is trading at ₦0.72. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "VERITASKAP maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "VERITASKAP demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.94."
    },
    eps: 0.08,
    bvps: 1.44,
    targetPrice: 0.85,
    rating: 'Outperform'
  },
  {
    ticker: 'CONHALLPLC',
    name: 'Consolidated Hallmark Holdings Plc',
    price: 1.3,
    change: 0.78,
    changeAmount: 0.01,
    volume: '51K',
    volumeRaw: 51300,
    sector: 'Insurance',
    sparkline: [1.23, 1.25, 1.27, 1.29, 1.31, 1.33, 1.35],
    chartData: [
      { date: '1 Aug', price: 1.2, volume: 51300 },
      { date: '8 Aug', price: 1.23, volume: 71300 },
      { date: '15 Aug', price: 1.27, volume: 36300 },
      { date: '22 Aug', price: 1.29, volume: 101300 },
      { date: '29 Aug', price: 1.3, volume: 51300 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.91, high: 1.69 },
    description: 'Consolidated Hallmark Holdings Plc (CONHALLPLC) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Consolidated Hallmark Holdings Plc is trading at ₦1.3. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "CONHALLPLC maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "CONHALLPLC demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦1.69."
    },
    eps: 0.14,
    bvps: 2.6,
    targetPrice: 1.53,
    rating: 'Neutral'
  },
  {
    ticker: 'INTENEGINS',
    name: 'International Energy Insurance Plc',
    price: 1.6,
    change: -1.23,
    changeAmount: -0.02,
    volume: '52K',
    volumeRaw: 51600,
    sector: 'Insurance',
    sparkline: [1.52, 1.54, 1.57, 1.59, 1.62, 1.64, 1.66],
    chartData: [
      { date: '1 Aug', price: 1.47, volume: 51600 },
      { date: '8 Aug', price: 1.52, volume: 71600 },
      { date: '15 Aug', price: 1.57, volume: 36600 },
      { date: '22 Aug', price: 1.58, volume: 101600 },
      { date: '29 Aug', price: 1.6, volume: 51600 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.12, high: 2.08 },
    description: 'International Energy Insurance Plc (INTENEGINS) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "International Energy Insurance Plc is trading at ₦1.6. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "INTENEGINS maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "INTENEGINS demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦2.08."
    },
    eps: 0.18,
    bvps: 3.2,
    targetPrice: 1.89,
    rating: 'Underperform'
  },
  {
    ticker: 'GOLDINS',
    name: 'Goldlink Insurance Plc',
    price: 0.4,
    change: 0.0,
    changeAmount: 0.0,
    volume: '50K',
    volumeRaw: 50400,
    sector: 'Insurance',
    sparkline: [0.38, 0.39, 0.39, 0.4, 0.4, 0.41, 0.42],
    chartData: [
      { date: '1 Aug', price: 0.37, volume: 50400 },
      { date: '8 Aug', price: 0.38, volume: 70400 },
      { date: '15 Aug', price: 0.39, volume: 35400 },
      { date: '22 Aug', price: 0.4, volume: 100400 },
      { date: '29 Aug', price: 0.4, volume: 50400 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.28, high: 0.52 },
    description: 'Goldlink Insurance Plc (GOLDINS) is listed on the Nigerian Exchange (NGX) under the Insurance sector.',
    aiInsight: {
      Beginner: "Goldlink Insurance Plc is trading at ₦0.4. It represents a key stock in the Nigerian Insurance industry.",
      Intermediate: "GOLDINS maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "GOLDINS demonstrates strategic exposure in Insurance. Dividend yield sits at 0.0% with 52-week high of ₦0.52."
    },
    eps: 0.09,
    bvps: 0.31,
    targetPrice: 0.47,
    rating: 'Neutral'
  },
  {
    ticker: 'BERGER',
    name: 'Berger Paints Plc',
    price: 14.5,
    change: 1.4,
    changeAmount: 0.2,
    volume: '64K',
    volumeRaw: 64500,
    sector: 'Industrials',
    sparkline: [13.77, 13.99, 14.21, 14.43, 14.64, 14.86, 15.08],
    chartData: [
      { date: '1 Aug', price: 13.34, volume: 64500 },
      { date: '8 Aug', price: 13.77, volume: 84500 },
      { date: '15 Aug', price: 14.21, volume: 49500 },
      { date: '22 Aug', price: 14.36, volume: 114500 },
      { date: '29 Aug', price: 14.5, volume: 64500 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.01B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 10.15, high: 18.85 },
    description: 'Berger Paints Plc (BERGER) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Berger Paints Plc is trading at ₦14.5. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "BERGER maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.01B.",
      Experienced: "BERGER demonstrates strategic exposure in Industrials. Dividend yield sits at 2.0% with 52-week high of ₦18.85."
    },
    eps: 1.07,
    bvps: 16.11,
    targetPrice: 17.11,
    rating: 'Outperform'
  },
  {
    ticker: 'BETAGLAS',
    name: 'Beta Glass Plc',
    price: 55.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '105K',
    volumeRaw: 105000,
    sector: 'Industrials',
    sparkline: [52.25, 53.07, 53.9, 54.73, 55.55, 56.37, 57.2],
    chartData: [
      { date: '1 Aug', price: 50.6, volume: 105000 },
      { date: '8 Aug', price: 52.25, volume: 125000 },
      { date: '15 Aug', price: 53.9, volume: 90000 },
      { date: '22 Aug', price: 54.45, volume: 155000 },
      { date: '29 Aug', price: 55.0, volume: 105000 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.09B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 38.5, high: 71.5 },
    description: 'Beta Glass Plc (BETAGLAS) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Beta Glass Plc is trading at ₦55.0. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "BETAGLAS maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.09B.",
      Experienced: "BETAGLAS demonstrates strategic exposure in Industrials. Dividend yield sits at 4.4% with 52-week high of ₦71.5."
    },
    eps: 9.17,
    bvps: 32.35,
    targetPrice: 64.9,
    rating: 'Neutral'
  },
  {
    ticker: 'CAP',
    name: 'CAP Plc',
    price: 26.8,
    change: 2.29,
    changeAmount: 0.61,
    volume: '77K',
    volumeRaw: 76800,
    sector: 'Industrials',
    sparkline: [25.46, 25.86, 26.26, 26.67, 27.07, 27.47, 27.87],
    chartData: [
      { date: '1 Aug', price: 24.66, volume: 76800 },
      { date: '8 Aug', price: 25.46, volume: 96800 },
      { date: '15 Aug', price: 26.26, volume: 61800 },
      { date: '22 Aug', price: 26.53, volume: 126800 },
      { date: '29 Aug', price: 26.8, volume: 76800 }
    ],
    peRatio: 9.0,
    pbRatio: 1.7,
    marketCap: '₦0.03B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 18.76, high: 34.84 },
    description: 'CAP Plc (CAP) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "CAP Plc is trading at ₦26.8. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "CAP maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.03B.",
      Experienced: "CAP demonstrates strategic exposure in Industrials. Dividend yield sits at 5.6% with 52-week high of ₦34.84."
    },
    eps: 2.98,
    bvps: 15.76,
    targetPrice: 31.62,
    rating: 'Outperform'
  },
  {
    ticker: 'CUTIX',
    name: 'Cutix Plc',
    price: 3.1,
    change: -0.96,
    changeAmount: -0.03,
    volume: '53K',
    volumeRaw: 53100,
    sector: 'Industrials',
    sparkline: [2.94, 2.99, 3.04, 3.08, 3.13, 3.18, 3.22],
    chartData: [
      { date: '1 Aug', price: 2.85, volume: 53100 },
      { date: '8 Aug', price: 2.94, volume: 73100 },
      { date: '15 Aug', price: 3.04, volume: 38100 },
      { date: '22 Aug', price: 3.07, volume: 103100 },
      { date: '29 Aug', price: 3.1, volume: 53100 }
    ],
    peRatio: 12.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '8.0%',
    fiftyTwoWeekRange: { low: 2.17, high: 4.03 },
    description: 'Cutix Plc (CUTIX) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Cutix Plc is trading at ₦3.1. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "CUTIX maintains a P/E ratio of 12.0 with a current market capitalization of ₦0.0B.",
      Experienced: "CUTIX demonstrates strategic exposure in Industrials. Dividend yield sits at 8.0% with 52-week high of ₦4.03."
    },
    eps: 0.26,
    bvps: 6.2,
    targetPrice: 3.66,
    rating: 'Neutral'
  },
  {
    ticker: 'MCNICHOLS',
    name: 'McNichols Plc',
    price: 0.9,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50900,
    sector: 'Industrials',
    sparkline: [0.85, 0.87, 0.88, 0.9, 0.91, 0.92, 0.94],
    chartData: [
      { date: '1 Aug', price: 0.83, volume: 50900 },
      { date: '8 Aug', price: 0.85, volume: 70900 },
      { date: '15 Aug', price: 0.88, volume: 35900 },
      { date: '22 Aug', price: 0.89, volume: 100900 },
      { date: '29 Aug', price: 0.9, volume: 50900 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.63, high: 1.17 },
    description: 'McNichols Plc (MCNICHOLS) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "McNichols Plc is trading at ₦0.9. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "MCNICHOLS maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "MCNICHOLS demonstrates strategic exposure in Industrials. Dividend yield sits at 0.0% with 52-week high of ₦1.17."
    },
    eps: 0.12,
    bvps: 0.43,
    targetPrice: 1.06,
    rating: 'Neutral'
  },
  {
    ticker: 'NESF',
    name: 'Nigeria Enamelware Plc',
    price: 17.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '67K',
    volumeRaw: 67000,
    sector: 'Industrials',
    sparkline: [16.15, 16.41, 16.66, 16.91, 17.17, 17.42, 17.68],
    chartData: [
      { date: '1 Aug', price: 15.64, volume: 67000 },
      { date: '8 Aug', price: 16.15, volume: 87000 },
      { date: '15 Aug', price: 16.66, volume: 52000 },
      { date: '22 Aug', price: 16.83, volume: 117000 },
      { date: '29 Aug', price: 17.0, volume: 67000 }
    ],
    peRatio: 10.5,
    pbRatio: 2.1,
    marketCap: '₦0.02B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 11.9, high: 22.1 },
    description: 'Nigeria Enamelware Plc (NESF) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Nigeria Enamelware Plc is trading at ₦17.0. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "NESF maintains a P/E ratio of 10.5 with a current market capitalization of ₦0.02B.",
      Experienced: "NESF demonstrates strategic exposure in Industrials. Dividend yield sits at 6.8% with 52-week high of ₦22.1."
    },
    eps: 1.62,
    bvps: 8.1,
    targetPrice: 20.06,
    rating: 'Neutral'
  },
  {
    ticker: 'NOTORE',
    name: 'Notore Chemical Industries Plc',
    price: 62.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '112K',
    volumeRaw: 112500,
    sector: 'Industrials',
    sparkline: [59.38, 60.31, 61.25, 62.19, 63.12, 64.06, 65.0],
    chartData: [
      { date: '1 Aug', price: 57.5, volume: 112500 },
      { date: '8 Aug', price: 59.38, volume: 132500 },
      { date: '15 Aug', price: 61.25, volume: 97500 },
      { date: '22 Aug', price: 61.88, volume: 162500 },
      { date: '29 Aug', price: 62.5, volume: 112500 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.11B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 43.75, high: 81.25 },
    description: 'Notore Chemical Industries Plc (NOTORE) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Notore Chemical Industries Plc is trading at ₦62.5. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "NOTORE maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.11B.",
      Experienced: "NOTORE demonstrates strategic exposure in Industrials. Dividend yield sits at 2.0% with 52-week high of ₦81.25."
    },
    eps: 4.63,
    bvps: 69.44,
    targetPrice: 73.75,
    rating: 'Neutral'
  },
  {
    ticker: 'MULTIVERSE',
    name: 'Multiverse Mining & Exploration Plc',
    price: 14.2,
    change: -2.07,
    changeAmount: -0.29,
    volume: '64K',
    volumeRaw: 64200,
    sector: 'Industrials',
    sparkline: [13.49, 13.7, 13.92, 14.13, 14.34, 14.55, 14.77],
    chartData: [
      { date: '1 Aug', price: 13.06, volume: 64200 },
      { date: '8 Aug', price: 13.49, volume: 84200 },
      { date: '15 Aug', price: 13.92, volume: 49200 },
      { date: '22 Aug', price: 14.06, volume: 114200 },
      { date: '29 Aug', price: 14.2, volume: 64200 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.01B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 9.94, high: 18.46 },
    description: 'Multiverse Mining & Exploration Plc (MULTIVERSE) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Multiverse Mining & Exploration Plc is trading at ₦14.2. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "MULTIVERSE maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.01B.",
      Experienced: "MULTIVERSE demonstrates strategic exposure in Industrials. Dividend yield sits at 6.8% with 52-week high of ₦18.46."
    },
    eps: 1.58,
    bvps: 28.4,
    targetPrice: 16.76,
    rating: 'Underperform'
  },
  {
    ticker: 'ALEX',
    name: 'Aluminium Extrusion Industries Plc',
    price: 7.8,
    change: 0.0,
    changeAmount: 0.0,
    volume: '58K',
    volumeRaw: 57800,
    sector: 'Industrials',
    sparkline: [7.41, 7.53, 7.64, 7.76, 7.88, 7.99, 8.11],
    chartData: [
      { date: '1 Aug', price: 7.18, volume: 57800 },
      { date: '8 Aug', price: 7.41, volume: 77800 },
      { date: '15 Aug', price: 7.64, volume: 42800 },
      { date: '22 Aug', price: 7.72, volume: 107800 },
      { date: '29 Aug', price: 7.8, volume: 57800 }
    ],
    peRatio: 10.5,
    pbRatio: 2.1,
    marketCap: '₦0.01B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 5.46, high: 10.14 },
    description: 'Aluminium Extrusion Industries Plc (ALEX) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Aluminium Extrusion Industries Plc is trading at ₦7.8. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "ALEX maintains a P/E ratio of 10.5 with a current market capitalization of ₦0.01B.",
      Experienced: "ALEX demonstrates strategic exposure in Industrials. Dividend yield sits at 6.8% with 52-week high of ₦10.14."
    },
    eps: 0.74,
    bvps: 3.71,
    targetPrice: 9.2,
    rating: 'Neutral'
  },
  {
    ticker: 'AUSTINLAZ',
    name: 'Austin Laz & Co Plc',
    price: 2.1,
    change: 0.0,
    changeAmount: 0.0,
    volume: '52K',
    volumeRaw: 52100,
    sector: 'Industrials',
    sparkline: [1.99, 2.03, 2.06, 2.09, 2.12, 2.15, 2.18],
    chartData: [
      { date: '1 Aug', price: 1.93, volume: 52100 },
      { date: '8 Aug', price: 1.99, volume: 72100 },
      { date: '15 Aug', price: 2.06, volume: 37100 },
      { date: '22 Aug', price: 2.08, volume: 102100 },
      { date: '29 Aug', price: 2.1, volume: 52100 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 1.47, high: 2.73 },
    description: 'Austin Laz & Co Plc (AUSTINLAZ) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Austin Laz & Co Plc is trading at ₦2.1. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "AUSTINLAZ maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "AUSTINLAZ demonstrates strategic exposure in Industrials. Dividend yield sits at 5.6% with 52-week high of ₦2.73."
    },
    eps: 0.28,
    bvps: 1.0,
    targetPrice: 2.48,
    rating: 'Neutral'
  },
  {
    ticker: 'COSTAIN',
    name: 'Costain West Africa Plc',
    price: 0.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '50K',
    volumeRaw: 50500,
    sector: 'Industrials',
    sparkline: [0.47, 0.48, 0.49, 0.5, 0.51, 0.51, 0.52],
    chartData: [
      { date: '1 Aug', price: 0.46, volume: 50500 },
      { date: '8 Aug', price: 0.47, volume: 70500 },
      { date: '15 Aug', price: 0.49, volume: 35500 },
      { date: '22 Aug', price: 0.49, volume: 100500 },
      { date: '29 Aug', price: 0.5, volume: 50500 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.35, high: 0.65 },
    description: 'Costain West Africa Plc (COSTAIN) is listed on the Nigerian Exchange (NGX) under the Industrials sector.',
    aiInsight: {
      Beginner: "Costain West Africa Plc is trading at ₦0.5. It represents a key stock in the Nigerian Industrials industry.",
      Intermediate: "COSTAIN maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "COSTAIN demonstrates strategic exposure in Industrials. Dividend yield sits at 0.0% with 52-week high of ₦0.65."
    },
    eps: 0.11,
    bvps: 0.38,
    targetPrice: 0.59,
    rating: 'Neutral'
  },
  {
    ticker: 'CADBURY',
    name: 'Cadbury Nigeria Plc',
    price: 19.5,
    change: -1.02,
    changeAmount: -0.2,
    volume: '70K',
    volumeRaw: 69500,
    sector: 'Consumer Goods',
    sparkline: [18.52, 18.82, 19.11, 19.4, 19.7, 19.99, 20.28],
    chartData: [
      { date: '1 Aug', price: 17.94, volume: 69500 },
      { date: '8 Aug', price: 18.52, volume: 89500 },
      { date: '15 Aug', price: 19.11, volume: 54500 },
      { date: '22 Aug', price: 19.3, volume: 119500 },
      { date: '29 Aug', price: 19.5, volume: 69500 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.02B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 13.65, high: 25.35 },
    description: 'Cadbury Nigeria Plc (CADBURY) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Cadbury Nigeria Plc is trading at ₦19.5. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "CADBURY maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.02B.",
      Experienced: "CADBURY demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 3.2% with 52-week high of ₦25.35."
    },
    eps: 4.33,
    bvps: 15.0,
    targetPrice: 23.01,
    rating: 'Underperform'
  },
  {
    ticker: 'DANGSUGAR',
    name: 'Dangote Sugar Refinery Plc',
    price: 58.0,
    change: 2.65,
    changeAmount: 1.54,
    volume: '108K',
    volumeRaw: 108000,
    sector: 'Consumer Goods',
    sparkline: [55.1, 55.97, 56.84, 57.71, 58.58, 59.45, 60.32],
    chartData: [
      { date: '1 Aug', price: 53.36, volume: 108000 },
      { date: '8 Aug', price: 55.1, volume: 128000 },
      { date: '15 Aug', price: 56.84, volume: 93000 },
      { date: '22 Aug', price: 57.42, volume: 158000 },
      { date: '29 Aug', price: 58.0, volume: 108000 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.09B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 40.6, high: 75.4 },
    description: 'Dangote Sugar Refinery Plc (DANGSUGAR) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Dangote Sugar Refinery Plc is trading at ₦58.0. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "DANGSUGAR maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.09B.",
      Experienced: "DANGSUGAR demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 5.6% with 52-week high of ₦75.4."
    },
    eps: 7.73,
    bvps: 27.62,
    targetPrice: 68.44,
    rating: 'Outperform'
  },
  {
    ticker: 'GUINNESS',
    name: 'Guinness Nigeria Plc',
    price: 68.5,
    change: 0.74,
    changeAmount: 0.51,
    volume: '118K',
    volumeRaw: 118500,
    sector: 'Consumer Goods',
    sparkline: [65.08, 66.1, 67.13, 68.16, 69.19, 70.21, 71.24],
    chartData: [
      { date: '1 Aug', price: 63.02, volume: 118500 },
      { date: '8 Aug', price: 65.08, volume: 138500 },
      { date: '15 Aug', price: 67.13, volume: 103500 },
      { date: '22 Aug', price: 67.81, volume: 168500 },
      { date: '29 Aug', price: 68.5, volume: 118500 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.12B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 47.95, high: 89.05 },
    description: 'Guinness Nigeria Plc (GUINNESS) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Guinness Nigeria Plc is trading at ₦68.5. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "GUINNESS maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.12B.",
      Experienced: "GUINNESS demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 4.4% with 52-week high of ₦89.05."
    },
    eps: 11.42,
    bvps: 40.29,
    targetPrice: 80.83,
    rating: 'Neutral'
  },
  {
    ticker: 'HONYFLOUR',
    name: 'Honeywell Flour Mill Plc',
    price: 3.8,
    change: 1.33,
    changeAmount: 0.05,
    volume: '54K',
    volumeRaw: 53800,
    sector: 'Consumer Goods',
    sparkline: [3.61, 3.67, 3.72, 3.78, 3.84, 3.89, 3.95],
    chartData: [
      { date: '1 Aug', price: 3.5, volume: 53800 },
      { date: '8 Aug', price: 3.61, volume: 73800 },
      { date: '15 Aug', price: 3.72, volume: 38800 },
      { date: '22 Aug', price: 3.76, volume: 103800 },
      { date: '29 Aug', price: 3.8, volume: 53800 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 2.66, high: 4.94 },
    description: 'Honeywell Flour Mill Plc (HONYFLOUR) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Honeywell Flour Mill Plc is trading at ₦3.8. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "HONYFLOUR maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "HONYFLOUR demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 5.6% with 52-week high of ₦4.94."
    },
    eps: 0.51,
    bvps: 1.81,
    targetPrice: 4.48,
    rating: 'Outperform'
  },
  {
    ticker: 'INTBREW',
    name: 'International Breweries Plc',
    price: 4.2,
    change: -2.33,
    changeAmount: -0.1,
    volume: '54K',
    volumeRaw: 54200,
    sector: 'Consumer Goods',
    sparkline: [3.99, 4.05, 4.12, 4.18, 4.24, 4.3, 4.37],
    chartData: [
      { date: '1 Aug', price: 3.86, volume: 54200 },
      { date: '8 Aug', price: 3.99, volume: 74200 },
      { date: '15 Aug', price: 4.12, volume: 39200 },
      { date: '22 Aug', price: 4.16, volume: 104200 },
      { date: '29 Aug', price: 4.2, volume: 54200 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 2.94, high: 5.46 },
    description: 'International Breweries Plc (INTBREW) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "International Breweries Plc is trading at ₦4.2. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "INTBREW maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "INTBREW demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 3.2% with 52-week high of ₦5.46."
    },
    eps: 0.93,
    bvps: 3.23,
    targetPrice: 4.96,
    rating: 'Underperform'
  },
  {
    ticker: 'CHAMPION',
    name: 'Champion Breweries Plc',
    price: 3.45,
    change: 0.0,
    changeAmount: 0.0,
    volume: '53K',
    volumeRaw: 53450,
    sector: 'Consumer Goods',
    sparkline: [3.28, 3.33, 3.38, 3.43, 3.48, 3.54, 3.59],
    chartData: [
      { date: '1 Aug', price: 3.17, volume: 53450 },
      { date: '8 Aug', price: 3.28, volume: 73450 },
      { date: '15 Aug', price: 3.38, volume: 38450 },
      { date: '22 Aug', price: 3.42, volume: 103450 },
      { date: '29 Aug', price: 3.45, volume: 53450 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 2.42, high: 4.49 },
    description: 'Champion Breweries Plc (CHAMPION) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Champion Breweries Plc is trading at ₦3.45. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "CHAMPION maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "CHAMPION demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 4.4% with 52-week high of ₦4.49."
    },
    eps: 0.58,
    bvps: 2.03,
    targetPrice: 4.07,
    rating: 'Neutral'
  },
  {
    ticker: 'NASCON',
    name: 'Nascon Allied Industries Plc',
    price: 54.0,
    change: 3.85,
    changeAmount: 2.08,
    volume: '104K',
    volumeRaw: 104000,
    sector: 'Consumer Goods',
    sparkline: [51.3, 52.11, 52.92, 53.73, 54.54, 55.35, 56.16],
    chartData: [
      { date: '1 Aug', price: 49.68, volume: 104000 },
      { date: '8 Aug', price: 51.3, volume: 124000 },
      { date: '15 Aug', price: 52.92, volume: 89000 },
      { date: '22 Aug', price: 53.46, volume: 154000 },
      { date: '29 Aug', price: 54.0, volume: 104000 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.08B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 37.8, high: 70.2 },
    description: 'Nascon Allied Industries Plc (NASCON) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Nascon Allied Industries Plc is trading at ₦54.0. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "NASCON maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.08B.",
      Experienced: "NASCON demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 2.0% with 52-week high of ₦70.2."
    },
    eps: 4.0,
    bvps: 60.0,
    targetPrice: 63.72,
    rating: 'Outperform'
  },
  {
    ticker: 'NB',
    name: 'Nigerian Breweries Plc',
    price: 32.0,
    change: 1.59,
    changeAmount: 0.51,
    volume: '82K',
    volumeRaw: 82000,
    sector: 'Consumer Goods',
    sparkline: [30.4, 30.88, 31.36, 31.84, 32.32, 32.8, 33.28],
    chartData: [
      { date: '1 Aug', price: 29.44, volume: 82000 },
      { date: '8 Aug', price: 30.4, volume: 102000 },
      { date: '15 Aug', price: 31.36, volume: 67000 },
      { date: '22 Aug', price: 31.68, volume: 132000 },
      { date: '29 Aug', price: 32.0, volume: 82000 }
    ],
    peRatio: 7.5,
    pbRatio: 1.3,
    marketCap: '₦0.04B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 22.4, high: 41.6 },
    description: 'Nigerian Breweries Plc (NB) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Nigerian Breweries Plc is trading at ₦32.0. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "NB maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.04B.",
      Experienced: "NB demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 4.4% with 52-week high of ₦41.6."
    },
    eps: 4.27,
    bvps: 24.62,
    targetPrice: 37.76,
    rating: 'Outperform'
  },
  {
    ticker: 'PZ',
    name: 'PZ Cussons Nigeria Plc',
    price: 34.5,
    change: -1.43,
    changeAmount: -0.49,
    volume: '84K',
    volumeRaw: 84500,
    sector: 'Consumer Goods',
    sparkline: [32.77, 33.29, 33.81, 34.33, 34.84, 35.36, 35.88],
    chartData: [
      { date: '1 Aug', price: 31.74, volume: 84500 },
      { date: '8 Aug', price: 32.77, volume: 104500 },
      { date: '15 Aug', price: 33.81, volume: 69500 },
      { date: '22 Aug', price: 34.16, volume: 134500 },
      { date: '29 Aug', price: 34.5, volume: 84500 }
    ],
    peRatio: 7.5,
    pbRatio: 1.3,
    marketCap: '₦0.04B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 24.15, high: 44.85 },
    description: 'PZ Cussons Nigeria Plc (PZ) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "PZ Cussons Nigeria Plc is trading at ₦34.5. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "PZ maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.04B.",
      Experienced: "PZ demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 4.4% with 52-week high of ₦44.85."
    },
    eps: 4.6,
    bvps: 26.54,
    targetPrice: 40.71,
    rating: 'Underperform'
  },
  {
    ticker: 'UNILEVER',
    name: 'Unilever Nigeria Plc',
    price: 16.8,
    change: 0.6,
    changeAmount: 0.1,
    volume: '67K',
    volumeRaw: 66800,
    sector: 'Consumer Goods',
    sparkline: [15.96, 16.21, 16.46, 16.72, 16.97, 17.22, 17.47],
    chartData: [
      { date: '1 Aug', price: 15.46, volume: 66800 },
      { date: '8 Aug', price: 15.96, volume: 86800 },
      { date: '15 Aug', price: 16.46, volume: 51800 },
      { date: '22 Aug', price: 16.63, volume: 116800 },
      { date: '29 Aug', price: 16.8, volume: 66800 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.02B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 11.76, high: 21.84 },
    description: 'Unilever Nigeria Plc (UNILEVER) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Unilever Nigeria Plc is trading at ₦16.8. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "UNILEVER maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.02B.",
      Experienced: "UNILEVER demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 4.4% with 52-week high of ₦21.84."
    },
    eps: 2.8,
    bvps: 9.88,
    targetPrice: 19.82,
    rating: 'Neutral'
  },
  {
    ticker: 'NNFM',
    name: 'Northern Nigeria Flour Mills Plc',
    price: 38.0,
    change: 4.11,
    changeAmount: 1.56,
    volume: '88K',
    volumeRaw: 88000,
    sector: 'Consumer Goods',
    sparkline: [36.1, 36.67, 37.24, 37.81, 38.38, 38.95, 39.52],
    chartData: [
      { date: '1 Aug', price: 34.96, volume: 88000 },
      { date: '8 Aug', price: 36.1, volume: 108000 },
      { date: '15 Aug', price: 37.24, volume: 73000 },
      { date: '22 Aug', price: 37.62, volume: 138000 },
      { date: '29 Aug', price: 38.0, volume: 88000 }
    ],
    peRatio: 10.5,
    pbRatio: 2.1,
    marketCap: '₦0.05B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 26.6, high: 49.4 },
    description: 'Northern Nigeria Flour Mills Plc (NNFM) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Northern Nigeria Flour Mills Plc is trading at ₦38.0. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "NNFM maintains a P/E ratio of 10.5 with a current market capitalization of ₦0.05B.",
      Experienced: "NNFM demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 6.8% with 52-week high of ₦49.4."
    },
    eps: 3.62,
    bvps: 18.1,
    targetPrice: 44.84,
    rating: 'Outperform'
  },
  {
    ticker: 'VITAFOAM',
    name: 'Vitafoam Nigeria Plc',
    price: 21.5,
    change: -0.92,
    changeAmount: -0.2,
    volume: '72K',
    volumeRaw: 71500,
    sector: 'Consumer Goods',
    sparkline: [20.43, 20.75, 21.07, 21.39, 21.71, 22.04, 22.36],
    chartData: [
      { date: '1 Aug', price: 19.78, volume: 71500 },
      { date: '8 Aug', price: 20.43, volume: 91500 },
      { date: '15 Aug', price: 21.07, volume: 56500 },
      { date: '22 Aug', price: 21.29, volume: 121500 },
      { date: '29 Aug', price: 21.5, volume: 71500 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.02B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 15.05, high: 27.95 },
    description: 'Vitafoam Nigeria Plc (VITAFOAM) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Vitafoam Nigeria Plc is trading at ₦21.5. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "VITAFOAM maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.02B.",
      Experienced: "VITAFOAM demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 4.4% with 52-week high of ₦27.95."
    },
    eps: 3.58,
    bvps: 12.65,
    targetPrice: 25.37,
    rating: 'Neutral'
  },
  {
    ticker: 'LIVESTOCK',
    name: 'Livestock Feeds Plc',
    price: 1.8,
    change: 2.86,
    changeAmount: 0.05,
    volume: '52K',
    volumeRaw: 51800,
    sector: 'Consumer Goods',
    sparkline: [1.71, 1.74, 1.76, 1.79, 1.82, 1.84, 1.87],
    chartData: [
      { date: '1 Aug', price: 1.66, volume: 51800 },
      { date: '8 Aug', price: 1.71, volume: 71800 },
      { date: '15 Aug', price: 1.76, volume: 36800 },
      { date: '22 Aug', price: 1.78, volume: 101800 },
      { date: '29 Aug', price: 1.8, volume: 51800 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.26, high: 2.34 },
    description: 'Livestock Feeds Plc (LIVESTOCK) is listed on the Nigerian Exchange (NGX) under the Consumer Goods sector.',
    aiInsight: {
      Beginner: "Livestock Feeds Plc is trading at ₦1.8. It represents a key stock in the Nigerian Consumer Goods industry.",
      Intermediate: "LIVESTOCK maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "LIVESTOCK demonstrates strategic exposure in Consumer Goods. Dividend yield sits at 0.0% with 52-week high of ₦2.34."
    },
    eps: 0.24,
    bvps: 0.86,
    targetPrice: 2.12,
    rating: 'Outperform'
  },
  {
    ticker: 'CONOIL',
    name: 'Conoil Plc',
    price: 105.0,
    change: 4.48,
    changeAmount: 4.7,
    volume: '155K',
    volumeRaw: 155000,
    sector: 'Oil & Gas',
    sparkline: [99.75, 101.33, 102.9, 104.47, 106.05, 107.62, 109.2],
    chartData: [
      { date: '1 Aug', price: 96.6, volume: 155000 },
      { date: '8 Aug', price: 99.75, volume: 175000 },
      { date: '15 Aug', price: 102.9, volume: 140000 },
      { date: '22 Aug', price: 103.95, volume: 205000 },
      { date: '29 Aug', price: 105.0, volume: 155000 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.24B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 73.5, high: 136.5 },
    description: 'Conoil Plc (CONOIL) is listed on the Nigerian Exchange (NGX) under the Oil & Gas sector.',
    aiInsight: {
      Beginner: "Conoil Plc is trading at ₦105.0. It represents a key stock in the Nigerian Oil & Gas industry.",
      Intermediate: "CONOIL maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.24B.",
      Experienced: "CONOIL demonstrates strategic exposure in Oil & Gas. Dividend yield sits at 2.0% with 52-week high of ₦136.5."
    },
    eps: 7.78,
    bvps: 116.67,
    targetPrice: 123.9,
    rating: 'Outperform'
  },
  {
    ticker: 'ETERNA',
    name: 'Eterna Plc',
    price: 16.2,
    change: -1.82,
    changeAmount: -0.29,
    volume: '66K',
    volumeRaw: 66200,
    sector: 'Oil & Gas',
    sparkline: [15.39, 15.63, 15.88, 16.12, 16.36, 16.6, 16.85],
    chartData: [
      { date: '1 Aug', price: 14.9, volume: 66200 },
      { date: '8 Aug', price: 15.39, volume: 86200 },
      { date: '15 Aug', price: 15.88, volume: 51200 },
      { date: '22 Aug', price: 16.04, volume: 116200 },
      { date: '29 Aug', price: 16.2, volume: 66200 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.02B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 11.34, high: 21.06 },
    description: 'Eterna Plc (ETERNA) is listed on the Nigerian Exchange (NGX) under the Oil & Gas sector.',
    aiInsight: {
      Beginner: "Eterna Plc is trading at ₦16.2. It represents a key stock in the Nigerian Oil & Gas industry.",
      Intermediate: "ETERNA maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.02B.",
      Experienced: "ETERNA demonstrates strategic exposure in Oil & Gas. Dividend yield sits at 2.0% with 52-week high of ₦21.06."
    },
    eps: 1.2,
    bvps: 18.0,
    targetPrice: 19.12,
    rating: 'Underperform'
  },
  {
    ticker: 'MRS',
    name: 'MRS Oil Nigeria Plc',
    price: 135.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '185K',
    volumeRaw: 185000,
    sector: 'Oil & Gas',
    sparkline: [128.25, 130.28, 132.3, 134.32, 136.35, 138.38, 140.4],
    chartData: [
      { date: '1 Aug', price: 124.2, volume: 185000 },
      { date: '8 Aug', price: 128.25, volume: 205000 },
      { date: '15 Aug', price: 132.3, volume: 170000 },
      { date: '22 Aug', price: 133.65, volume: 235000 },
      { date: '29 Aug', price: 135.0, volume: 185000 }
    ],
    peRatio: 9.0,
    pbRatio: 1.7,
    marketCap: '₦0.37B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 94.5, high: 175.5 },
    description: 'MRS Oil Nigeria Plc (MRS) is listed on the Nigerian Exchange (NGX) under the Oil & Gas sector.',
    aiInsight: {
      Beginner: "MRS Oil Nigeria Plc is trading at ₦135.0. It represents a key stock in the Nigerian Oil & Gas industry.",
      Intermediate: "MRS maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.37B.",
      Experienced: "MRS demonstrates strategic exposure in Oil & Gas. Dividend yield sits at 5.6% with 52-week high of ₦175.5."
    },
    eps: 15.0,
    bvps: 79.41,
    targetPrice: 159.3,
    rating: 'Neutral'
  },
  {
    ticker: 'GEREGU',
    name: 'Geregu Power Plc',
    price: 1000.0,
    change: 1.01,
    changeAmount: 10.1,
    volume: '1.1M',
    volumeRaw: 1050000,
    sector: 'Oil & Gas',
    sparkline: [950.0, 965.0, 980.0, 995.0, 1010.0, 1025.0, 1040.0],
    chartData: [
      { date: '1 Aug', price: 920.0, volume: 1050000 },
      { date: '8 Aug', price: 950.0, volume: 1070000 },
      { date: '15 Aug', price: 980.0, volume: 1035000 },
      { date: '22 Aug', price: 990.0, volume: 1100000 },
      { date: '29 Aug', price: 1000.0, volume: 1050000 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦15.75B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 700.0, high: 1300.0 },
    description: 'Geregu Power Plc (GEREGU) is listed on the Nigerian Exchange (NGX) under the Oil & Gas sector.',
    aiInsight: {
      Beginner: "Geregu Power Plc is trading at ₦1000.0. It represents a key stock in the Nigerian Oil & Gas industry.",
      Intermediate: "GEREGU maintains a P/E ratio of 13.5 with a current market capitalization of ₦15.75B.",
      Experienced: "GEREGU demonstrates strategic exposure in Oil & Gas. Dividend yield sits at 2.0% with 52-week high of ₦1300.0."
    },
    eps: 74.07,
    bvps: 1111.11,
    targetPrice: 1180.0,
    rating: 'Outperform'
  },
  {
    ticker: 'TRANSPOWER',
    name: 'Transcorp Power Plc',
    price: 340.0,
    change: 2.41,
    changeAmount: 8.19,
    volume: '390K',
    volumeRaw: 390000,
    sector: 'Oil & Gas',
    sparkline: [323.0, 328.1, 333.2, 338.3, 343.4, 348.5, 353.6],
    chartData: [
      { date: '1 Aug', price: 312.8, volume: 390000 },
      { date: '8 Aug', price: 323.0, volume: 410000 },
      { date: '15 Aug', price: 333.2, volume: 375000 },
      { date: '22 Aug', price: 336.6, volume: 440000 },
      { date: '29 Aug', price: 340.0, volume: 390000 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦1.99B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 238.0, high: 442.0 },
    description: 'Transcorp Power Plc (TRANSPOWER) is listed on the Nigerian Exchange (NGX) under the Oil & Gas sector.',
    aiInsight: {
      Beginner: "Transcorp Power Plc is trading at ₦340.0. It represents a key stock in the Nigerian Oil & Gas industry.",
      Intermediate: "TRANSPOWER maintains a P/E ratio of 9.0 with a current market capitalization of ₦1.99B.",
      Experienced: "TRANSPOWER demonstrates strategic exposure in Oil & Gas. Dividend yield sits at 6.8% with 52-week high of ₦442.0."
    },
    eps: 37.78,
    bvps: 680.0,
    targetPrice: 401.2,
    rating: 'Outperform'
  },
  {
    ticker: 'ARADEL',
    name: 'Aradel Holdings Plc',
    price: 520.0,
    change: 3.17,
    changeAmount: 16.48,
    volume: '570K',
    volumeRaw: 570000,
    sector: 'Oil & Gas',
    sparkline: [494.0, 501.8, 509.6, 517.4, 525.2, 533.0, 540.8],
    chartData: [
      { date: '1 Aug', price: 478.4, volume: 570000 },
      { date: '8 Aug', price: 494.0, volume: 590000 },
      { date: '15 Aug', price: 509.6, volume: 555000 },
      { date: '22 Aug', price: 514.8, volume: 620000 },
      { date: '29 Aug', price: 520.0, volume: 570000 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦4.45B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 364.0, high: 676.0 },
    description: 'Aradel Holdings Plc (ARADEL) is listed on the Nigerian Exchange (NGX) under the Oil & Gas sector.',
    aiInsight: {
      Beginner: "Aradel Holdings Plc is trading at ₦520.0. It represents a key stock in the Nigerian Oil & Gas industry.",
      Intermediate: "ARADEL maintains a P/E ratio of 13.5 with a current market capitalization of ₦4.45B.",
      Experienced: "ARADEL demonstrates strategic exposure in Oil & Gas. Dividend yield sits at 2.0% with 52-week high of ₦676.0."
    },
    eps: 38.52,
    bvps: 577.78,
    targetPrice: 613.6,
    rating: 'Outperform'
  },
  {
    ticker: 'CAPITAL',
    name: 'Capital Oil Plc',
    price: 0.3,
    change: 0.0,
    changeAmount: 0.0,
    volume: '50K',
    volumeRaw: 50300,
    sector: 'Oil & Gas',
    sparkline: [0.28, 0.29, 0.29, 0.3, 0.3, 0.31, 0.31],
    chartData: [
      { date: '1 Aug', price: 0.28, volume: 50300 },
      { date: '8 Aug', price: 0.28, volume: 70300 },
      { date: '15 Aug', price: 0.29, volume: 35300 },
      { date: '22 Aug', price: 0.3, volume: 100300 },
      { date: '29 Aug', price: 0.3, volume: 50300 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.21, high: 0.39 },
    description: 'Capital Oil Plc (CAPITAL) is listed on the Nigerian Exchange (NGX) under the Oil & Gas sector.',
    aiInsight: {
      Beginner: "Capital Oil Plc is trading at ₦0.3. It represents a key stock in the Nigerian Oil & Gas industry.",
      Intermediate: "CAPITAL maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "CAPITAL demonstrates strategic exposure in Oil & Gas. Dividend yield sits at 0.0% with 52-week high of ₦0.39."
    },
    eps: 0.07,
    bvps: 0.23,
    targetPrice: 0.35,
    rating: 'Neutral'
  },
  {
    ticker: 'STERLINGNG',
    name: 'Sterling Financial Holdings Co Plc',
    price: 4.8,
    change: 1.27,
    changeAmount: 0.06,
    volume: '55K',
    volumeRaw: 54800,
    sector: 'Banking',
    sparkline: [4.56, 4.63, 4.7, 4.78, 4.85, 4.92, 4.99],
    chartData: [
      { date: '1 Aug', price: 4.42, volume: 54800 },
      { date: '8 Aug', price: 4.56, volume: 74800 },
      { date: '15 Aug', price: 4.7, volume: 39800 },
      { date: '22 Aug', price: 4.75, volume: 104800 },
      { date: '29 Aug', price: 4.8, volume: 54800 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 3.36, high: 6.24 },
    description: 'Sterling Financial Holdings Co Plc (STERLINGNG) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Sterling Financial Holdings Co Plc is trading at ₦4.8. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "STERLINGNG maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "STERLINGNG demonstrates strategic exposure in Banking. Dividend yield sits at 6.8% with 52-week high of ₦6.24."
    },
    eps: 0.53,
    bvps: 9.6,
    targetPrice: 5.66,
    rating: 'Outperform'
  },
  {
    ticker: 'WEMABANK',
    name: 'Wema Bank Plc',
    price: 8.2,
    change: 2.5,
    changeAmount: 0.2,
    volume: '58K',
    volumeRaw: 58200,
    sector: 'Banking',
    sparkline: [7.79, 7.91, 8.04, 8.16, 8.28, 8.4, 8.53],
    chartData: [
      { date: '1 Aug', price: 7.54, volume: 58200 },
      { date: '8 Aug', price: 7.79, volume: 78200 },
      { date: '15 Aug', price: 8.04, volume: 43200 },
      { date: '22 Aug', price: 8.12, volume: 108200 },
      { date: '29 Aug', price: 8.2, volume: 58200 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.01B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 5.74, high: 10.66 },
    description: 'Wema Bank Plc (WEMABANK) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Wema Bank Plc is trading at ₦8.2. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "WEMABANK maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.01B.",
      Experienced: "WEMABANK demonstrates strategic exposure in Banking. Dividend yield sits at 4.4% with 52-week high of ₦10.66."
    },
    eps: 1.37,
    bvps: 4.82,
    targetPrice: 9.68,
    rating: 'Outperform'
  },
  {
    ticker: 'UCAP',
    name: 'United Capital Plc',
    price: 22.5,
    change: 3.69,
    changeAmount: 0.83,
    volume: '72K',
    volumeRaw: 72500,
    sector: 'Banking',
    sparkline: [21.38, 21.71, 22.05, 22.39, 22.73, 23.06, 23.4],
    chartData: [
      { date: '1 Aug', price: 20.7, volume: 72500 },
      { date: '8 Aug', price: 21.38, volume: 92500 },
      { date: '15 Aug', price: 22.05, volume: 57500 },
      { date: '22 Aug', price: 22.27, volume: 122500 },
      { date: '29 Aug', price: 22.5, volume: 72500 }
    ],
    peRatio: 10.5,
    pbRatio: 2.1,
    marketCap: '₦0.02B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 15.75, high: 29.25 },
    description: 'United Capital Plc (UCAP) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "United Capital Plc is trading at ₦22.5. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "UCAP maintains a P/E ratio of 10.5 with a current market capitalization of ₦0.02B.",
      Experienced: "UCAP demonstrates strategic exposure in Banking. Dividend yield sits at 6.8% with 52-week high of ₦29.25."
    },
    eps: 2.14,
    bvps: 10.71,
    targetPrice: 26.55,
    rating: 'Outperform'
  },
  {
    ticker: 'AFRIPRUD',
    name: 'Africa Prudential Plc',
    price: 7.9,
    change: -1.25,
    changeAmount: -0.1,
    volume: '58K',
    volumeRaw: 57900,
    sector: 'Banking',
    sparkline: [7.5, 7.62, 7.74, 7.86, 7.98, 8.1, 8.22],
    chartData: [
      { date: '1 Aug', price: 7.27, volume: 57900 },
      { date: '8 Aug', price: 7.5, volume: 77900 },
      { date: '15 Aug', price: 7.74, volume: 42900 },
      { date: '22 Aug', price: 7.82, volume: 107900 },
      { date: '29 Aug', price: 7.9, volume: 57900 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.01B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 5.53, high: 10.27 },
    description: 'Africa Prudential Plc (AFRIPRUD) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Africa Prudential Plc is trading at ₦7.9. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "AFRIPRUD maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.01B.",
      Experienced: "AFRIPRUD demonstrates strategic exposure in Banking. Dividend yield sits at 4.4% with 52-week high of ₦10.27."
    },
    eps: 1.32,
    bvps: 4.65,
    targetPrice: 9.32,
    rating: 'Underperform'
  },
  {
    ticker: 'VFDGROUP',
    name: 'VFD Group Plc',
    price: 210.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '260K',
    volumeRaw: 260000,
    sector: 'Banking',
    sparkline: [199.5, 202.65, 205.8, 208.95, 212.1, 215.25, 218.4],
    chartData: [
      { date: '1 Aug', price: 193.2, volume: 260000 },
      { date: '8 Aug', price: 199.5, volume: 280000 },
      { date: '15 Aug', price: 205.8, volume: 245000 },
      { date: '22 Aug', price: 207.9, volume: 310000 },
      { date: '29 Aug', price: 210.0, volume: 260000 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.82B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 147.0, high: 273.0 },
    description: 'VFD Group Plc (VFDGROUP) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "VFD Group Plc is trading at ₦210.0. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "VFDGROUP maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.82B.",
      Experienced: "VFDGROUP demonstrates strategic exposure in Banking. Dividend yield sits at 4.4% with 52-week high of ₦273.0."
    },
    eps: 35.0,
    bvps: 123.53,
    targetPrice: 247.8,
    rating: 'Neutral'
  },
  {
    ticker: 'UNHOMES',
    name: 'Infinity Trust Mortgage Bank Plc',
    price: 6.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '56K',
    volumeRaw: 56000,
    sector: 'Banking',
    sparkline: [5.7, 5.79, 5.88, 5.97, 6.06, 6.15, 6.24],
    chartData: [
      { date: '1 Aug', price: 5.52, volume: 56000 },
      { date: '8 Aug', price: 5.7, volume: 76000 },
      { date: '15 Aug', price: 5.88, volume: 41000 },
      { date: '22 Aug', price: 5.94, volume: 106000 },
      { date: '29 Aug', price: 6.0, volume: 56000 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.01B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 4.2, high: 7.8 },
    description: 'Infinity Trust Mortgage Bank Plc (UNHOMES) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Infinity Trust Mortgage Bank Plc is trading at ₦6.0. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "UNHOMES maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.01B.",
      Experienced: "UNHOMES demonstrates strategic exposure in Banking. Dividend yield sits at 3.2% with 52-week high of ₦7.8."
    },
    eps: 1.33,
    bvps: 4.62,
    targetPrice: 7.08,
    rating: 'Neutral'
  },
  {
    ticker: 'ABBEYBDS',
    name: 'Abbey Mortgage Bank Plc',
    price: 2.7,
    change: 1.89,
    changeAmount: 0.05,
    volume: '53K',
    volumeRaw: 52700,
    sector: 'Banking',
    sparkline: [2.56, 2.61, 2.65, 2.69, 2.73, 2.77, 2.81],
    chartData: [
      { date: '1 Aug', price: 2.48, volume: 52700 },
      { date: '8 Aug', price: 2.56, volume: 72700 },
      { date: '15 Aug', price: 2.65, volume: 37700 },
      { date: '22 Aug', price: 2.67, volume: 102700 },
      { date: '29 Aug', price: 2.7, volume: 52700 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 1.89, high: 3.51 },
    description: 'Abbey Mortgage Bank Plc (ABBEYBDS) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Abbey Mortgage Bank Plc is trading at ₦2.7. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "ABBEYBDS maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "ABBEYBDS demonstrates strategic exposure in Banking. Dividend yield sits at 4.4% with 52-week high of ₦3.51."
    },
    eps: 0.45,
    bvps: 1.59,
    targetPrice: 3.19,
    rating: 'Outperform'
  },
  {
    ticker: 'DEAPCAP',
    name: 'Deap Capital Management & Trust Plc',
    price: 0.6,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50600,
    sector: 'Banking',
    sparkline: [0.57, 0.58, 0.59, 0.6, 0.61, 0.61, 0.62],
    chartData: [
      { date: '1 Aug', price: 0.55, volume: 50600 },
      { date: '8 Aug', price: 0.57, volume: 70600 },
      { date: '15 Aug', price: 0.59, volume: 35600 },
      { date: '22 Aug', price: 0.59, volume: 100600 },
      { date: '29 Aug', price: 0.6, volume: 50600 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.42, high: 0.78 },
    description: 'Deap Capital Management & Trust Plc (DEAPCAP) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Deap Capital Management & Trust Plc is trading at ₦0.6. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "DEAPCAP maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "DEAPCAP demonstrates strategic exposure in Banking. Dividend yield sits at 0.0% with 52-week high of ₦0.78."
    },
    eps: 0.13,
    bvps: 0.46,
    targetPrice: 0.71,
    rating: 'Neutral'
  },
  {
    ticker: 'NPFMCRBK',
    name: 'NPF Microfinance Bank Plc',
    price: 1.95,
    change: 0.52,
    changeAmount: 0.01,
    volume: '52K',
    volumeRaw: 51950,
    sector: 'Banking',
    sparkline: [1.85, 1.88, 1.91, 1.94, 1.97, 2.0, 2.03],
    chartData: [
      { date: '1 Aug', price: 1.79, volume: 51950 },
      { date: '8 Aug', price: 1.85, volume: 71950 },
      { date: '15 Aug', price: 1.91, volume: 36950 },
      { date: '22 Aug', price: 1.93, volume: 101950 },
      { date: '29 Aug', price: 1.95, volume: 51950 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.36, high: 2.54 },
    description: 'NPF Microfinance Bank Plc (NPFMCRBK) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "NPF Microfinance Bank Plc is trading at ₦1.95. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "NPFMCRBK maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "NPFMCRBK demonstrates strategic exposure in Banking. Dividend yield sits at 0.0% with 52-week high of ₦2.54."
    },
    eps: 0.33,
    bvps: 1.15,
    targetPrice: 2.3,
    rating: 'Neutral'
  },
  {
    ticker: 'UNIONBANK',
    name: 'Union Bank of Nigeria Plc',
    price: 7.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '58K',
    volumeRaw: 57500,
    sector: 'Banking',
    sparkline: [7.12, 7.24, 7.35, 7.46, 7.58, 7.69, 7.8],
    chartData: [
      { date: '1 Aug', price: 6.9, volume: 57500 },
      { date: '8 Aug', price: 7.12, volume: 77500 },
      { date: '15 Aug', price: 7.35, volume: 42500 },
      { date: '22 Aug', price: 7.42, volume: 107500 },
      { date: '29 Aug', price: 7.5, volume: 57500 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.01B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 5.25, high: 9.75 },
    description: 'Union Bank of Nigeria Plc (UNIONBANK) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Union Bank of Nigeria Plc is trading at ₦7.5. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "UNIONBANK maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.01B.",
      Experienced: "UNIONBANK demonstrates strategic exposure in Banking. Dividend yield sits at 5.6% with 52-week high of ₦9.75."
    },
    eps: 1.0,
    bvps: 3.57,
    targetPrice: 8.85,
    rating: 'Neutral'
  },
  {
    ticker: 'UNITYBNK',
    name: 'Unity Bank Plc',
    price: 1.8,
    change: -2.17,
    changeAmount: -0.04,
    volume: '52K',
    volumeRaw: 51800,
    sector: 'Banking',
    sparkline: [1.71, 1.74, 1.76, 1.79, 1.82, 1.84, 1.87],
    chartData: [
      { date: '1 Aug', price: 1.66, volume: 51800 },
      { date: '8 Aug', price: 1.71, volume: 71800 },
      { date: '15 Aug', price: 1.76, volume: 36800 },
      { date: '22 Aug', price: 1.78, volume: 101800 },
      { date: '29 Aug', price: 1.8, volume: 51800 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.26, high: 2.34 },
    description: 'Unity Bank Plc (UNITYBNK) is listed on the Nigerian Exchange (NGX) under the Banking sector.',
    aiInsight: {
      Beginner: "Unity Bank Plc is trading at ₦1.8. It represents a key stock in the Nigerian Banking industry.",
      Intermediate: "UNITYBNK maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "UNITYBNK demonstrates strategic exposure in Banking. Dividend yield sits at 0.0% with 52-week high of ₦2.34."
    },
    eps: 0.3,
    bvps: 1.06,
    targetPrice: 2.12,
    rating: 'Underperform'
  },
  {
    ticker: 'CHAMS',
    name: 'Chams Holding Company Plc',
    price: 2.4,
    change: 2.13,
    changeAmount: 0.05,
    volume: '52K',
    volumeRaw: 52400,
    sector: 'ICT',
    sparkline: [2.28, 2.32, 2.35, 2.39, 2.42, 2.46, 2.5],
    chartData: [
      { date: '1 Aug', price: 2.21, volume: 52400 },
      { date: '8 Aug', price: 2.28, volume: 72400 },
      { date: '15 Aug', price: 2.35, volume: 37400 },
      { date: '22 Aug', price: 2.38, volume: 102400 },
      { date: '29 Aug', price: 2.4, volume: 52400 }
    ],
    peRatio: 12.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '8.0%',
    fiftyTwoWeekRange: { low: 1.68, high: 3.12 },
    description: 'Chams Holding Company Plc (CHAMS) is listed on the Nigerian Exchange (NGX) under the ICT sector.',
    aiInsight: {
      Beginner: "Chams Holding Company Plc is trading at ₦2.4. It represents a key stock in the Nigerian ICT industry.",
      Intermediate: "CHAMS maintains a P/E ratio of 12.0 with a current market capitalization of ₦0.0B.",
      Experienced: "CHAMS demonstrates strategic exposure in ICT. Dividend yield sits at 8.0% with 52-week high of ₦3.12."
    },
    eps: 0.2,
    bvps: 4.8,
    targetPrice: 2.83,
    rating: 'Outperform'
  },
  {
    ticker: 'ETRANZACT',
    name: 'eTranzact International Plc',
    price: 6.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '56K',
    volumeRaw: 56500,
    sector: 'ICT',
    sparkline: [6.17, 6.27, 6.37, 6.47, 6.57, 6.66, 6.76],
    chartData: [
      { date: '1 Aug', price: 5.98, volume: 56500 },
      { date: '8 Aug', price: 6.17, volume: 76500 },
      { date: '15 Aug', price: 6.37, volume: 41500 },
      { date: '22 Aug', price: 6.43, volume: 106500 },
      { date: '29 Aug', price: 6.5, volume: 56500 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.01B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 4.55, high: 8.45 },
    description: 'eTranzact International Plc (ETRANZACT) is listed on the Nigerian Exchange (NGX) under the ICT sector.',
    aiInsight: {
      Beginner: "eTranzact International Plc is trading at ₦6.5. It represents a key stock in the Nigerian ICT industry.",
      Intermediate: "ETRANZACT maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.01B.",
      Experienced: "ETRANZACT demonstrates strategic exposure in ICT. Dividend yield sits at 5.6% with 52-week high of ₦8.45."
    },
    eps: 0.87,
    bvps: 3.1,
    targetPrice: 7.67,
    rating: 'Neutral'
  },
  {
    ticker: 'NCR',
    name: 'NCR Nigeria Plc',
    price: 4.3,
    change: 0.0,
    changeAmount: 0.0,
    volume: '54K',
    volumeRaw: 54300,
    sector: 'ICT',
    sparkline: [4.08, 4.15, 4.21, 4.28, 4.34, 4.41, 4.47],
    chartData: [
      { date: '1 Aug', price: 3.96, volume: 54300 },
      { date: '8 Aug', price: 4.08, volume: 74300 },
      { date: '15 Aug', price: 4.21, volume: 39300 },
      { date: '22 Aug', price: 4.26, volume: 104300 },
      { date: '29 Aug', price: 4.3, volume: 54300 }
    ],
    peRatio: 9.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 3.01, high: 5.59 },
    description: 'NCR Nigeria Plc (NCR) is listed on the Nigerian Exchange (NGX) under the ICT sector.',
    aiInsight: {
      Beginner: "NCR Nigeria Plc is trading at ₦4.3. It represents a key stock in the Nigerian ICT industry.",
      Intermediate: "NCR maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "NCR demonstrates strategic exposure in ICT. Dividend yield sits at 5.6% with 52-week high of ₦5.59."
    },
    eps: 0.48,
    bvps: 2.53,
    targetPrice: 5.07,
    rating: 'Neutral'
  },
  {
    ticker: 'OMATEK',
    name: 'Omatek Ventures Plc',
    price: 0.7,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50700,
    sector: 'ICT',
    sparkline: [0.66, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73],
    chartData: [
      { date: '1 Aug', price: 0.64, volume: 50700 },
      { date: '8 Aug', price: 0.66, volume: 70700 },
      { date: '15 Aug', price: 0.69, volume: 35700 },
      { date: '22 Aug', price: 0.69, volume: 100700 },
      { date: '29 Aug', price: 0.7, volume: 50700 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.49, high: 0.91 },
    description: 'Omatek Ventures Plc (OMATEK) is listed on the Nigerian Exchange (NGX) under the ICT sector.',
    aiInsight: {
      Beginner: "Omatek Ventures Plc is trading at ₦0.7. It represents a key stock in the Nigerian ICT industry.",
      Intermediate: "OMATEK maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.0B.",
      Experienced: "OMATEK demonstrates strategic exposure in ICT. Dividend yield sits at 0.0% with 52-week high of ₦0.91."
    },
    eps: 0.05,
    bvps: 0.78,
    targetPrice: 0.83,
    rating: 'Neutral'
  },
  {
    ticker: 'AFROMEDIA',
    name: 'Afromedia Plc',
    price: 0.25,
    change: 0.0,
    changeAmount: 0.0,
    volume: '50K',
    volumeRaw: 50250,
    sector: 'ICT',
    sparkline: [0.24, 0.24, 0.24, 0.25, 0.25, 0.26, 0.26],
    chartData: [
      { date: '1 Aug', price: 0.23, volume: 50250 },
      { date: '8 Aug', price: 0.24, volume: 70250 },
      { date: '15 Aug', price: 0.24, volume: 35250 },
      { date: '22 Aug', price: 0.25, volume: 100250 },
      { date: '29 Aug', price: 0.25, volume: 50250 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.17, high: 0.33 },
    description: 'Afromedia Plc (AFROMEDIA) is listed on the Nigerian Exchange (NGX) under the ICT sector.',
    aiInsight: {
      Beginner: "Afromedia Plc is trading at ₦0.25. It represents a key stock in the Nigerian ICT industry.",
      Intermediate: "AFROMEDIA maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "AFROMEDIA demonstrates strategic exposure in ICT. Dividend yield sits at 0.0% with 52-week high of ₦0.33."
    },
    eps: 0.03,
    bvps: 0.12,
    targetPrice: 0.29,
    rating: 'Neutral'
  },
  {
    ticker: 'ELLAHLAKES',
    name: 'Ellah Lakes Plc',
    price: 3.1,
    change: -1.59,
    changeAmount: -0.05,
    volume: '53K',
    volumeRaw: 53100,
    sector: 'Agriculture',
    sparkline: [2.94, 2.99, 3.04, 3.08, 3.13, 3.18, 3.22],
    chartData: [
      { date: '1 Aug', price: 2.85, volume: 53100 },
      { date: '8 Aug', price: 2.94, volume: 73100 },
      { date: '15 Aug', price: 3.04, volume: 38100 },
      { date: '22 Aug', price: 3.07, volume: 103100 },
      { date: '29 Aug', price: 3.1, volume: 53100 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 2.17, high: 4.03 },
    description: 'Ellah Lakes Plc (ELLAHLAKES) is listed on the Nigerian Exchange (NGX) under the Agriculture sector.',
    aiInsight: {
      Beginner: "Ellah Lakes Plc is trading at ₦3.1. It represents a key stock in the Nigerian Agriculture industry.",
      Intermediate: "ELLAHLAKES maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "ELLAHLAKES demonstrates strategic exposure in Agriculture. Dividend yield sits at 6.8% with 52-week high of ₦4.03."
    },
    eps: 0.34,
    bvps: 6.2,
    targetPrice: 3.66,
    rating: 'Underperform'
  },
  {
    ticker: 'FTNCOCOA',
    name: 'FTN Cocoa Processors Plc',
    price: 1.6,
    change: 1.91,
    changeAmount: 0.03,
    volume: '52K',
    volumeRaw: 51600,
    sector: 'Agriculture',
    sparkline: [1.52, 1.54, 1.57, 1.59, 1.62, 1.64, 1.66],
    chartData: [
      { date: '1 Aug', price: 1.47, volume: 51600 },
      { date: '8 Aug', price: 1.52, volume: 71600 },
      { date: '15 Aug', price: 1.57, volume: 36600 },
      { date: '22 Aug', price: 1.58, volume: 101600 },
      { date: '29 Aug', price: 1.6, volume: 51600 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.12, high: 2.08 },
    description: 'FTN Cocoa Processors Plc (FTNCOCOA) is listed on the Nigerian Exchange (NGX) under the Agriculture sector.',
    aiInsight: {
      Beginner: "FTN Cocoa Processors Plc is trading at ₦1.6. It represents a key stock in the Nigerian Agriculture industry.",
      Intermediate: "FTNCOCOA maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "FTNCOCOA demonstrates strategic exposure in Agriculture. Dividend yield sits at 0.0% with 52-week high of ₦2.08."
    },
    eps: 0.27,
    bvps: 0.94,
    targetPrice: 1.89,
    rating: 'Outperform'
  },
  {
    ticker: 'GLAXOSMITH',
    name: 'GlaxoSmithKline Consumer Nigeria Plc',
    price: 24.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '74K',
    volumeRaw: 74000,
    sector: 'Healthcare',
    sparkline: [22.8, 23.16, 23.52, 23.88, 24.24, 24.6, 24.96],
    chartData: [
      { date: '1 Aug', price: 22.08, volume: 74000 },
      { date: '8 Aug', price: 22.8, volume: 94000 },
      { date: '15 Aug', price: 23.52, volume: 59000 },
      { date: '22 Aug', price: 23.76, volume: 124000 },
      { date: '29 Aug', price: 24.0, volume: 74000 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.03B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 16.8, high: 31.2 },
    description: 'GlaxoSmithKline Consumer Nigeria Plc (GLAXOSMITH) is listed on the Nigerian Exchange (NGX) under the Healthcare sector.',
    aiInsight: {
      Beginner: "GlaxoSmithKline Consumer Nigeria Plc is trading at ₦24.0. It represents a key stock in the Nigerian Healthcare industry.",
      Intermediate: "GLAXOSMITH maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.03B.",
      Experienced: "GLAXOSMITH demonstrates strategic exposure in Healthcare. Dividend yield sits at 6.8% with 52-week high of ₦31.2."
    },
    eps: 2.67,
    bvps: 48.0,
    targetPrice: 28.32,
    rating: 'Neutral'
  },
  {
    ticker: 'MAYBAKER',
    name: 'May & Baker Nigeria Plc',
    price: 6.2,
    change: 1.64,
    changeAmount: 0.1,
    volume: '56K',
    volumeRaw: 56200,
    sector: 'Healthcare',
    sparkline: [5.89, 5.98, 6.08, 6.17, 6.26, 6.35, 6.45],
    chartData: [
      { date: '1 Aug', price: 5.7, volume: 56200 },
      { date: '8 Aug', price: 5.89, volume: 76200 },
      { date: '15 Aug', price: 6.08, volume: 41200 },
      { date: '22 Aug', price: 6.14, volume: 106200 },
      { date: '29 Aug', price: 6.2, volume: 56200 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.01B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 4.34, high: 8.06 },
    description: 'May & Baker Nigeria Plc (MAYBAKER) is listed on the Nigerian Exchange (NGX) under the Healthcare sector.',
    aiInsight: {
      Beginner: "May & Baker Nigeria Plc is trading at ₦6.2. It represents a key stock in the Nigerian Healthcare industry.",
      Intermediate: "MAYBAKER maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.01B.",
      Experienced: "MAYBAKER demonstrates strategic exposure in Healthcare. Dividend yield sits at 4.4% with 52-week high of ₦8.06."
    },
    eps: 1.03,
    bvps: 3.65,
    targetPrice: 7.32,
    rating: 'Outperform'
  },
  {
    ticker: 'MECURE',
    name: 'MeCure Industries Plc',
    price: 12.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '62K',
    volumeRaw: 62500,
    sector: 'Healthcare',
    sparkline: [11.88, 12.06, 12.25, 12.44, 12.62, 12.81, 13.0],
    chartData: [
      { date: '1 Aug', price: 11.5, volume: 62500 },
      { date: '8 Aug', price: 11.88, volume: 82500 },
      { date: '15 Aug', price: 12.25, volume: 47500 },
      { date: '22 Aug', price: 12.38, volume: 112500 },
      { date: '29 Aug', price: 12.5, volume: 62500 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.01B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 8.75, high: 16.25 },
    description: 'MeCure Industries Plc (MECURE) is listed on the Nigerian Exchange (NGX) under the Healthcare sector.',
    aiInsight: {
      Beginner: "MeCure Industries Plc is trading at ₦12.5. It represents a key stock in the Nigerian Healthcare industry.",
      Intermediate: "MECURE maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.01B.",
      Experienced: "MECURE demonstrates strategic exposure in Healthcare. Dividend yield sits at 2.0% with 52-week high of ₦16.25."
    },
    eps: 0.93,
    bvps: 13.89,
    targetPrice: 14.75,
    rating: 'Neutral'
  },
  {
    ticker: 'NEIMETH',
    name: 'Neimeth International Pharmaceuticals Plc',
    price: 2.1,
    change: 0.0,
    changeAmount: 0.0,
    volume: '52K',
    volumeRaw: 52100,
    sector: 'Healthcare',
    sparkline: [1.99, 2.03, 2.06, 2.09, 2.12, 2.15, 2.18],
    chartData: [
      { date: '1 Aug', price: 1.93, volume: 52100 },
      { date: '8 Aug', price: 1.99, volume: 72100 },
      { date: '15 Aug', price: 2.06, volume: 37100 },
      { date: '22 Aug', price: 2.08, volume: 102100 },
      { date: '29 Aug', price: 2.1, volume: 52100 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 1.47, high: 2.73 },
    description: 'Neimeth International Pharmaceuticals Plc (NEIMETH) is listed on the Nigerian Exchange (NGX) under the Healthcare sector.',
    aiInsight: {
      Beginner: "Neimeth International Pharmaceuticals Plc is trading at ₦2.1. It represents a key stock in the Nigerian Healthcare industry.",
      Intermediate: "NEIMETH maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "NEIMETH demonstrates strategic exposure in Healthcare. Dividend yield sits at 3.2% with 52-week high of ₦2.73."
    },
    eps: 0.47,
    bvps: 1.62,
    targetPrice: 2.48,
    rating: 'Neutral'
  },
  {
    ticker: 'PHARMDEKO',
    name: 'Pharma-Deko Plc',
    price: 2.3,
    change: 0.0,
    changeAmount: 0.0,
    volume: '52K',
    volumeRaw: 52300,
    sector: 'Healthcare',
    sparkline: [2.18, 2.22, 2.25, 2.29, 2.32, 2.36, 2.39],
    chartData: [
      { date: '1 Aug', price: 2.12, volume: 52300 },
      { date: '8 Aug', price: 2.18, volume: 72300 },
      { date: '15 Aug', price: 2.25, volume: 37300 },
      { date: '22 Aug', price: 2.28, volume: 102300 },
      { date: '29 Aug', price: 2.3, volume: 52300 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 1.61, high: 2.99 },
    description: 'Pharma-Deko Plc (PHARMDEKO) is listed on the Nigerian Exchange (NGX) under the Healthcare sector.',
    aiInsight: {
      Beginner: "Pharma-Deko Plc is trading at ₦2.3. It represents a key stock in the Nigerian Healthcare industry.",
      Intermediate: "PHARMDEKO maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "PHARMDEKO demonstrates strategic exposure in Healthcare. Dividend yield sits at 5.6% with 52-week high of ₦2.99."
    },
    eps: 0.31,
    bvps: 1.1,
    targetPrice: 2.71,
    rating: 'Neutral'
  },
  {
    ticker: 'MORISON',
    name: 'Morison Industries Plc',
    price: 4.1,
    change: 0.0,
    changeAmount: 0.0,
    volume: '54K',
    volumeRaw: 54100,
    sector: 'Healthcare',
    sparkline: [3.89, 3.96, 4.02, 4.08, 4.14, 4.2, 4.26],
    chartData: [
      { date: '1 Aug', price: 3.77, volume: 54100 },
      { date: '8 Aug', price: 3.89, volume: 74100 },
      { date: '15 Aug', price: 4.02, volume: 39100 },
      { date: '22 Aug', price: 4.06, volume: 104100 },
      { date: '29 Aug', price: 4.1, volume: 54100 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 2.87, high: 5.33 },
    description: 'Morison Industries Plc (MORISON) is listed on the Nigerian Exchange (NGX) under the Healthcare sector.',
    aiInsight: {
      Beginner: "Morison Industries Plc is trading at ₦4.1. It represents a key stock in the Nigerian Healthcare industry.",
      Intermediate: "MORISON maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "MORISON demonstrates strategic exposure in Healthcare. Dividend yield sits at 3.2% with 52-week high of ₦5.33."
    },
    eps: 0.91,
    bvps: 3.15,
    targetPrice: 4.84,
    rating: 'Neutral'
  },
  {
    ticker: 'JULI',
    name: 'Juli Plc',
    price: 0.75,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50750,
    sector: 'Healthcare',
    sparkline: [0.71, 0.72, 0.73, 0.75, 0.76, 0.77, 0.78],
    chartData: [
      { date: '1 Aug', price: 0.69, volume: 50750 },
      { date: '8 Aug', price: 0.71, volume: 70750 },
      { date: '15 Aug', price: 0.73, volume: 35750 },
      { date: '22 Aug', price: 0.74, volume: 100750 },
      { date: '29 Aug', price: 0.75, volume: 50750 }
    ],
    peRatio: 10.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.52, high: 0.98 },
    description: 'Juli Plc (JULI) is listed on the Nigerian Exchange (NGX) under the Healthcare sector.',
    aiInsight: {
      Beginner: "Juli Plc is trading at ₦0.75. It represents a key stock in the Nigerian Healthcare industry.",
      Intermediate: "JULI maintains a P/E ratio of 10.5 with a current market capitalization of ₦0.0B.",
      Experienced: "JULI demonstrates strategic exposure in Healthcare. Dividend yield sits at 0.0% with 52-week high of ₦0.98."
    },
    eps: 0.07,
    bvps: 0.36,
    targetPrice: 0.89,
    rating: 'Neutral'
  },
  {
    ticker: 'NAHCO',
    name: 'Nigerian Aviation Handling Co Plc',
    price: 35.0,
    change: 3.55,
    changeAmount: 1.24,
    volume: '85K',
    volumeRaw: 85000,
    sector: 'Services',
    sparkline: [33.25, 33.77, 34.3, 34.83, 35.35, 35.88, 36.4],
    chartData: [
      { date: '1 Aug', price: 32.2, volume: 85000 },
      { date: '8 Aug', price: 33.25, volume: 105000 },
      { date: '15 Aug', price: 34.3, volume: 70000 },
      { date: '22 Aug', price: 34.65, volume: 135000 },
      { date: '29 Aug', price: 35.0, volume: 85000 }
    ],
    peRatio: 12.0,
    pbRatio: 0.5,
    marketCap: '₦0.04B',
    dividendYield: '8.0%',
    fiftyTwoWeekRange: { low: 24.5, high: 45.5 },
    description: 'Nigerian Aviation Handling Co Plc (NAHCO) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Nigerian Aviation Handling Co Plc is trading at ₦35.0. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "NAHCO maintains a P/E ratio of 12.0 with a current market capitalization of ₦0.04B.",
      Experienced: "NAHCO demonstrates strategic exposure in Services. Dividend yield sits at 8.0% with 52-week high of ₦45.5."
    },
    eps: 2.92,
    bvps: 70.0,
    targetPrice: 41.3,
    rating: 'Outperform'
  },
  {
    ticker: 'SKYAVN',
    name: 'Skyway Aviation Handling Co Plc',
    price: 28.0,
    change: 1.45,
    changeAmount: 0.41,
    volume: '78K',
    volumeRaw: 78000,
    sector: 'Services',
    sparkline: [26.6, 27.02, 27.44, 27.86, 28.28, 28.7, 29.12],
    chartData: [
      { date: '1 Aug', price: 25.76, volume: 78000 },
      { date: '8 Aug', price: 26.6, volume: 98000 },
      { date: '15 Aug', price: 27.44, volume: 63000 },
      { date: '22 Aug', price: 27.72, volume: 128000 },
      { date: '29 Aug', price: 28.0, volume: 78000 }
    ],
    peRatio: 13.5,
    pbRatio: 0.9,
    marketCap: '₦0.03B',
    dividendYield: '2.0%',
    fiftyTwoWeekRange: { low: 19.6, high: 36.4 },
    description: 'Skyway Aviation Handling Co Plc (SKYAVN) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Skyway Aviation Handling Co Plc is trading at ₦28.0. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "SKYAVN maintains a P/E ratio of 13.5 with a current market capitalization of ₦0.03B.",
      Experienced: "SKYAVN demonstrates strategic exposure in Services. Dividend yield sits at 2.0% with 52-week high of ₦36.4."
    },
    eps: 2.07,
    bvps: 31.11,
    targetPrice: 33.04,
    rating: 'Outperform'
  },
  {
    ticker: 'CAVERTON',
    name: 'Caverton Offshore Support Group Plc',
    price: 1.75,
    change: -1.13,
    changeAmount: -0.02,
    volume: '52K',
    volumeRaw: 51750,
    sector: 'Services',
    sparkline: [1.66, 1.69, 1.71, 1.74, 1.77, 1.79, 1.82],
    chartData: [
      { date: '1 Aug', price: 1.61, volume: 51750 },
      { date: '8 Aug', price: 1.66, volume: 71750 },
      { date: '15 Aug', price: 1.71, volume: 36750 },
      { date: '22 Aug', price: 1.73, volume: 101750 },
      { date: '29 Aug', price: 1.75, volume: 51750 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.22, high: 2.27 },
    description: 'Caverton Offshore Support Group Plc (CAVERTON) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Caverton Offshore Support Group Plc is trading at ₦1.75. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "CAVERTON maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "CAVERTON demonstrates strategic exposure in Services. Dividend yield sits at 0.0% with 52-week high of ₦2.27."
    },
    eps: 0.29,
    bvps: 1.03,
    targetPrice: 2.06,
    rating: 'Underperform'
  },
  {
    ticker: 'REDSTAREX',
    name: 'Red Star Express Plc',
    price: 4.1,
    change: 0.0,
    changeAmount: 0.0,
    volume: '54K',
    volumeRaw: 54100,
    sector: 'Services',
    sparkline: [3.89, 3.96, 4.02, 4.08, 4.14, 4.2, 4.26],
    chartData: [
      { date: '1 Aug', price: 3.77, volume: 54100 },
      { date: '8 Aug', price: 3.89, volume: 74100 },
      { date: '15 Aug', price: 4.02, volume: 39100 },
      { date: '22 Aug', price: 4.06, volume: 104100 },
      { date: '29 Aug', price: 4.1, volume: 54100 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 2.87, high: 5.33 },
    description: 'Red Star Express Plc (REDSTAREX) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Red Star Express Plc is trading at ₦4.1. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "REDSTAREX maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "REDSTAREX demonstrates strategic exposure in Services. Dividend yield sits at 5.6% with 52-week high of ₦5.33."
    },
    eps: 0.55,
    bvps: 1.95,
    targetPrice: 4.84,
    rating: 'Neutral'
  },
  {
    ticker: 'TRANSEXPR',
    name: 'Trans-Nationwide Express Plc',
    price: 1.15,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 51150,
    sector: 'Services',
    sparkline: [1.09, 1.11, 1.13, 1.14, 1.16, 1.18, 1.2],
    chartData: [
      { date: '1 Aug', price: 1.06, volume: 51150 },
      { date: '8 Aug', price: 1.09, volume: 71150 },
      { date: '15 Aug', price: 1.13, volume: 36150 },
      { date: '22 Aug', price: 1.14, volume: 101150 },
      { date: '29 Aug', price: 1.15, volume: 51150 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.8, high: 1.49 },
    description: 'Trans-Nationwide Express Plc (TRANSEXPR) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Trans-Nationwide Express Plc is trading at ₦1.15. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "TRANSEXPR maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "TRANSEXPR demonstrates strategic exposure in Services. Dividend yield sits at 0.0% with 52-week high of ₦1.49."
    },
    eps: 0.15,
    bvps: 0.55,
    targetPrice: 1.36,
    rating: 'Neutral'
  },
  {
    ticker: 'IKEJAHOTEL',
    name: 'Ikeja Hotel Plc',
    price: 7.5,
    change: 2.04,
    changeAmount: 0.15,
    volume: '58K',
    volumeRaw: 57500,
    sector: 'Services',
    sparkline: [7.12, 7.24, 7.35, 7.46, 7.58, 7.69, 7.8],
    chartData: [
      { date: '1 Aug', price: 6.9, volume: 57500 },
      { date: '8 Aug', price: 7.12, volume: 77500 },
      { date: '15 Aug', price: 7.35, volume: 42500 },
      { date: '22 Aug', price: 7.42, volume: 107500 },
      { date: '29 Aug', price: 7.5, volume: 57500 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.01B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 5.25, high: 9.75 },
    description: 'Ikeja Hotel Plc (IKEJAHOTEL) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Ikeja Hotel Plc is trading at ₦7.5. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "IKEJAHOTEL maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.01B.",
      Experienced: "IKEJAHOTEL demonstrates strategic exposure in Services. Dividend yield sits at 6.8% with 52-week high of ₦9.75."
    },
    eps: 0.83,
    bvps: 15.0,
    targetPrice: 8.85,
    rating: 'Outperform'
  },
  {
    ticker: 'CAPHOTEL',
    name: 'Capital Hotels Plc',
    price: 2.8,
    change: 0.0,
    changeAmount: 0.0,
    volume: '53K',
    volumeRaw: 52800,
    sector: 'Services',
    sparkline: [2.66, 2.7, 2.74, 2.79, 2.83, 2.87, 2.91],
    chartData: [
      { date: '1 Aug', price: 2.58, volume: 52800 },
      { date: '8 Aug', price: 2.66, volume: 72800 },
      { date: '15 Aug', price: 2.74, volume: 37800 },
      { date: '22 Aug', price: 2.77, volume: 102800 },
      { date: '29 Aug', price: 2.8, volume: 52800 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 1.96, high: 3.64 },
    description: 'Capital Hotels Plc (CAPHOTEL) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Capital Hotels Plc is trading at ₦2.8. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "CAPHOTEL maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "CAPHOTEL demonstrates strategic exposure in Services. Dividend yield sits at 4.4% with 52-week high of ₦3.64."
    },
    eps: 0.47,
    bvps: 1.65,
    targetPrice: 3.3,
    rating: 'Neutral'
  },
  {
    ticker: 'TOURIST',
    name: 'Tourism Company of Nigeria Plc',
    price: 3.2,
    change: 0.0,
    changeAmount: 0.0,
    volume: '53K',
    volumeRaw: 53200,
    sector: 'Services',
    sparkline: [3.04, 3.09, 3.14, 3.18, 3.23, 3.28, 3.33],
    chartData: [
      { date: '1 Aug', price: 2.94, volume: 53200 },
      { date: '8 Aug', price: 3.04, volume: 73200 },
      { date: '15 Aug', price: 3.14, volume: 38200 },
      { date: '22 Aug', price: 3.17, volume: 103200 },
      { date: '29 Aug', price: 3.2, volume: 53200 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 2.24, high: 4.16 },
    description: 'Tourism Company of Nigeria Plc (TOURIST) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Tourism Company of Nigeria Plc is trading at ₦3.2. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "TOURIST maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "TOURIST demonstrates strategic exposure in Services. Dividend yield sits at 3.2% with 52-week high of ₦4.16."
    },
    eps: 0.71,
    bvps: 2.46,
    targetPrice: 3.78,
    rating: 'Neutral'
  },
  {
    ticker: 'TANTALIZER',
    name: 'Tantalizers Plc',
    price: 0.55,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50550,
    sector: 'Services',
    sparkline: [0.52, 0.53, 0.54, 0.55, 0.56, 0.56, 0.57],
    chartData: [
      { date: '1 Aug', price: 0.51, volume: 50550 },
      { date: '8 Aug', price: 0.52, volume: 70550 },
      { date: '15 Aug', price: 0.54, volume: 35550 },
      { date: '22 Aug', price: 0.54, volume: 100550 },
      { date: '29 Aug', price: 0.55, volume: 50550 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.39, high: 0.72 },
    description: 'Tantalizers Plc (TANTALIZER) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Tantalizers Plc is trading at ₦0.55. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "TANTALIZER maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "TANTALIZER demonstrates strategic exposure in Services. Dividend yield sits at 0.0% with 52-week high of ₦0.72."
    },
    eps: 0.06,
    bvps: 1.1,
    targetPrice: 0.65,
    rating: 'Neutral'
  },
  {
    ticker: 'DAARCOMM',
    name: 'DAAR Communications Plc',
    price: 0.7,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50700,
    sector: 'Services',
    sparkline: [0.66, 0.68, 0.69, 0.7, 0.71, 0.72, 0.73],
    chartData: [
      { date: '1 Aug', price: 0.64, volume: 50700 },
      { date: '8 Aug', price: 0.66, volume: 70700 },
      { date: '15 Aug', price: 0.69, volume: 35700 },
      { date: '22 Aug', price: 0.69, volume: 100700 },
      { date: '29 Aug', price: 0.7, volume: 50700 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.49, high: 0.91 },
    description: 'DAAR Communications Plc (DAARCOMM) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "DAAR Communications Plc is trading at ₦0.7. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "DAARCOMM maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "DAARCOMM demonstrates strategic exposure in Services. Dividend yield sits at 0.0% with 52-week high of ₦0.91."
    },
    eps: 0.12,
    bvps: 0.41,
    targetPrice: 0.83,
    rating: 'Neutral'
  },
  {
    ticker: 'CILEASING',
    name: 'C & I Leasing Plc',
    price: 3.6,
    change: 0.0,
    changeAmount: 0.0,
    volume: '54K',
    volumeRaw: 53600,
    sector: 'Services',
    sparkline: [3.42, 3.47, 3.53, 3.58, 3.64, 3.69, 3.74],
    chartData: [
      { date: '1 Aug', price: 3.31, volume: 53600 },
      { date: '8 Aug', price: 3.42, volume: 73600 },
      { date: '15 Aug', price: 3.53, volume: 38600 },
      { date: '22 Aug', price: 3.56, volume: 103600 },
      { date: '29 Aug', price: 3.6, volume: 53600 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 2.52, high: 4.68 },
    description: 'C & I Leasing Plc (CILEASING) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "C & I Leasing Plc is trading at ₦3.6. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "CILEASING maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "CILEASING demonstrates strategic exposure in Services. Dividend yield sits at 5.6% with 52-week high of ₦4.68."
    },
    eps: 0.48,
    bvps: 1.71,
    targetPrice: 4.25,
    rating: 'Neutral'
  },
  {
    ticker: 'RTBRISCOE',
    name: 'R T Briscoe Nigeria Plc',
    price: 0.6,
    change: 0.0,
    changeAmount: 0.0,
    volume: '51K',
    volumeRaw: 50600,
    sector: 'Services',
    sparkline: [0.57, 0.58, 0.59, 0.6, 0.61, 0.61, 0.62],
    chartData: [
      { date: '1 Aug', price: 0.55, volume: 50600 },
      { date: '8 Aug', price: 0.57, volume: 70600 },
      { date: '15 Aug', price: 0.59, volume: 35600 },
      { date: '22 Aug', price: 0.59, volume: 100600 },
      { date: '29 Aug', price: 0.6, volume: 50600 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 0.42, high: 0.78 },
    description: 'R T Briscoe Nigeria Plc (RTBRISCOE) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "R T Briscoe Nigeria Plc is trading at ₦0.6. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "RTBRISCOE maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "RTBRISCOE demonstrates strategic exposure in Services. Dividend yield sits at 0.0% with 52-week high of ₦0.78."
    },
    eps: 0.08,
    bvps: 0.29,
    targetPrice: 0.71,
    rating: 'Neutral'
  },
  {
    ticker: 'TRIPPLE',
    name: 'Tripple Gee & Co Plc',
    price: 2.9,
    change: 0.0,
    changeAmount: 0.0,
    volume: '53K',
    volumeRaw: 52900,
    sector: 'Services',
    sparkline: [2.75, 2.8, 2.84, 2.89, 2.93, 2.97, 3.02],
    chartData: [
      { date: '1 Aug', price: 2.67, volume: 52900 },
      { date: '8 Aug', price: 2.75, volume: 72900 },
      { date: '15 Aug', price: 2.84, volume: 37900 },
      { date: '22 Aug', price: 2.87, volume: 102900 },
      { date: '29 Aug', price: 2.9, volume: 52900 }
    ],
    peRatio: 4.5,
    pbRatio: 1.3,
    marketCap: '₦0.0B',
    dividendYield: '3.2%',
    fiftyTwoWeekRange: { low: 2.03, high: 3.77 },
    description: 'Tripple Gee & Co Plc (TRIPPLE) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Tripple Gee & Co Plc is trading at ₦2.9. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "TRIPPLE maintains a P/E ratio of 4.5 with a current market capitalization of ₦0.0B.",
      Experienced: "TRIPPLE demonstrates strategic exposure in Services. Dividend yield sits at 3.2% with 52-week high of ₦3.77."
    },
    eps: 0.64,
    bvps: 2.23,
    targetPrice: 3.42,
    rating: 'Neutral'
  },
  {
    ticker: 'LEARNAFRCA',
    name: 'Learn Africa Plc',
    price: 3.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '54K',
    volumeRaw: 53500,
    sector: 'Services',
    sparkline: [3.32, 3.38, 3.43, 3.48, 3.54, 3.59, 3.64],
    chartData: [
      { date: '1 Aug', price: 3.22, volume: 53500 },
      { date: '8 Aug', price: 3.32, volume: 73500 },
      { date: '15 Aug', price: 3.43, volume: 38500 },
      { date: '22 Aug', price: 3.46, volume: 103500 },
      { date: '29 Aug', price: 3.5, volume: 53500 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.0B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 2.45, high: 4.55 },
    description: 'Learn Africa Plc (LEARNAFRCA) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Learn Africa Plc is trading at ₦3.5. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "LEARNAFRCA maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.0B.",
      Experienced: "LEARNAFRCA demonstrates strategic exposure in Services. Dividend yield sits at 6.8% with 52-week high of ₦4.55."
    },
    eps: 0.39,
    bvps: 7.0,
    targetPrice: 4.13,
    rating: 'Neutral'
  },
  {
    ticker: 'THOMASWY',
    name: 'Thomas Wyatt Nigeria Plc',
    price: 1.9,
    change: 0.0,
    changeAmount: 0.0,
    volume: '52K',
    volumeRaw: 51900,
    sector: 'Services',
    sparkline: [1.8, 1.83, 1.86, 1.89, 1.92, 1.95, 1.98],
    chartData: [
      { date: '1 Aug', price: 1.75, volume: 51900 },
      { date: '8 Aug', price: 1.8, volume: 71900 },
      { date: '15 Aug', price: 1.86, volume: 36900 },
      { date: '22 Aug', price: 1.88, volume: 101900 },
      { date: '29 Aug', price: 1.9, volume: 51900 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.33, high: 2.47 },
    description: 'Thomas Wyatt Nigeria Plc (THOMASWY) is listed on the Nigerian Exchange (NGX) under the Services sector.',
    aiInsight: {
      Beginner: "Thomas Wyatt Nigeria Plc is trading at ₦1.9. It represents a key stock in the Nigerian Services industry.",
      Intermediate: "THOMASWY maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "THOMASWY demonstrates strategic exposure in Services. Dividend yield sits at 0.0% with 52-week high of ₦2.47."
    },
    eps: 0.32,
    bvps: 1.12,
    targetPrice: 2.24,
    rating: 'Neutral'
  },
  {
    ticker: 'UPDC',
    name: 'UPDC Plc',
    price: 1.45,
    change: 1.4,
    changeAmount: 0.02,
    volume: '51K',
    volumeRaw: 51450,
    sector: 'Real Estate',
    sparkline: [1.38, 1.4, 1.42, 1.44, 1.46, 1.49, 1.51],
    chartData: [
      { date: '1 Aug', price: 1.33, volume: 51450 },
      { date: '8 Aug', price: 1.38, volume: 71450 },
      { date: '15 Aug', price: 1.42, volume: 36450 },
      { date: '22 Aug', price: 1.44, volume: 101450 },
      { date: '29 Aug', price: 1.45, volume: 51450 }
    ],
    peRatio: 10.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '0.0%',
    fiftyTwoWeekRange: { low: 1.01, high: 1.89 },
    description: 'UPDC Plc (UPDC) is listed on the Nigerian Exchange (NGX) under the Real Estate sector.',
    aiInsight: {
      Beginner: "UPDC Plc is trading at ₦1.45. It represents a key stock in the Nigerian Real Estate industry.",
      Intermediate: "UPDC maintains a P/E ratio of 10.5 with a current market capitalization of ₦0.0B.",
      Experienced: "UPDC demonstrates strategic exposure in Real Estate. Dividend yield sits at 0.0% with 52-week high of ₦1.89."
    },
    eps: 0.14,
    bvps: 0.69,
    targetPrice: 1.71,
    rating: 'Outperform'
  },
  {
    ticker: 'UPDCREIT',
    name: 'UPDC Real Estate Investment Trust',
    price: 5.2,
    change: 0.0,
    changeAmount: 0.0,
    volume: '55K',
    volumeRaw: 55200,
    sector: 'Real Estate',
    sparkline: [4.94, 5.02, 5.1, 5.17, 5.25, 5.33, 5.41],
    chartData: [
      { date: '1 Aug', price: 4.78, volume: 55200 },
      { date: '8 Aug', price: 4.94, volume: 75200 },
      { date: '15 Aug', price: 5.1, volume: 40200 },
      { date: '22 Aug', price: 5.15, volume: 105200 },
      { date: '29 Aug', price: 5.2, volume: 55200 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 3.64, high: 6.76 },
    description: 'UPDC Real Estate Investment Trust (UPDCREIT) is listed on the Nigerian Exchange (NGX) under the Real Estate sector.',
    aiInsight: {
      Beginner: "UPDC Real Estate Investment Trust is trading at ₦5.2. It represents a key stock in the Nigerian Real Estate industry.",
      Intermediate: "UPDCREIT maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "UPDCREIT demonstrates strategic exposure in Real Estate. Dividend yield sits at 4.4% with 52-week high of ₦6.76."
    },
    eps: 0.87,
    bvps: 3.06,
    targetPrice: 6.14,
    rating: 'Neutral'
  },
  {
    ticker: 'SFSREALEST',
    name: 'SFS Real Estate Investment Trust',
    price: 120.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '170K',
    volumeRaw: 170000,
    sector: 'Real Estate',
    sparkline: [114.0, 115.8, 117.6, 119.4, 121.2, 123.0, 124.8],
    chartData: [
      { date: '1 Aug', price: 110.4, volume: 170000 },
      { date: '8 Aug', price: 114.0, volume: 190000 },
      { date: '15 Aug', price: 117.6, volume: 155000 },
      { date: '22 Aug', price: 118.8, volume: 220000 },
      { date: '29 Aug', price: 120.0, volume: 170000 }
    ],
    peRatio: 9.0,
    pbRatio: 0.5,
    marketCap: '₦0.31B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 84.0, high: 156.0 },
    description: 'SFS Real Estate Investment Trust (SFSREALEST) is listed on the Nigerian Exchange (NGX) under the Real Estate sector.',
    aiInsight: {
      Beginner: "SFS Real Estate Investment Trust is trading at ₦120.0. It represents a key stock in the Nigerian Real Estate industry.",
      Intermediate: "SFSREALEST maintains a P/E ratio of 9.0 with a current market capitalization of ₦0.31B.",
      Experienced: "SFSREALEST demonstrates strategic exposure in Real Estate. Dividend yield sits at 6.8% with 52-week high of ₦156.0."
    },
    eps: 13.33,
    bvps: 240.0,
    targetPrice: 141.6,
    rating: 'Neutral'
  },
  {
    ticker: 'SIMCAPVAL',
    name: 'SIM Capital Alliance Value Fund',
    price: 115.0,
    change: 0.0,
    changeAmount: 0.0,
    volume: '165K',
    volumeRaw: 165000,
    sector: 'Real Estate',
    sparkline: [109.25, 110.97, 112.7, 114.42, 116.15, 117.87, 119.6],
    chartData: [
      { date: '1 Aug', price: 105.8, volume: 165000 },
      { date: '8 Aug', price: 109.25, volume: 185000 },
      { date: '15 Aug', price: 112.7, volume: 150000 },
      { date: '22 Aug', price: 113.85, volume: 215000 },
      { date: '29 Aug', price: 115.0, volume: 165000 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.28B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 80.5, high: 149.5 },
    description: 'SIM Capital Alliance Value Fund (SIMCAPVAL) is listed on the Nigerian Exchange (NGX) under the Real Estate sector.',
    aiInsight: {
      Beginner: "SIM Capital Alliance Value Fund is trading at ₦115.0. It represents a key stock in the Nigerian Real Estate industry.",
      Intermediate: "SIMCAPVAL maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.28B.",
      Experienced: "SIMCAPVAL demonstrates strategic exposure in Real Estate. Dividend yield sits at 5.6% with 52-week high of ₦149.5."
    },
    eps: 15.33,
    bvps: 54.76,
    targetPrice: 135.7,
    rating: 'Neutral'
  },
  {
    ticker: 'BHOJSONS',
    name: 'Bhojsons Plc',
    price: 8.5,
    change: 0.0,
    changeAmount: 0.0,
    volume: '58K',
    volumeRaw: 58500,
    sector: 'Conglomerates',
    sparkline: [8.07, 8.2, 8.33, 8.46, 8.59, 8.71, 8.84],
    chartData: [
      { date: '1 Aug', price: 7.82, volume: 58500 },
      { date: '8 Aug', price: 8.07, volume: 78500 },
      { date: '15 Aug', price: 8.33, volume: 43500 },
      { date: '22 Aug', price: 8.41, volume: 108500 },
      { date: '29 Aug', price: 8.5, volume: 58500 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.01B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 5.95, high: 11.05 },
    description: 'Bhojsons Plc (BHOJSONS) is listed on the Nigerian Exchange (NGX) under the Conglomerates sector.',
    aiInsight: {
      Beginner: "Bhojsons Plc is trading at ₦8.5. It represents a key stock in the Nigerian Conglomerates industry.",
      Intermediate: "BHOJSONS maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.01B.",
      Experienced: "BHOJSONS demonstrates strategic exposure in Conglomerates. Dividend yield sits at 4.4% with 52-week high of ₦11.05."
    },
    eps: 1.42,
    bvps: 5.0,
    targetPrice: 10.03,
    rating: 'Neutral'
  },
  {
    ticker: 'CHELLARAM',
    name: 'Chellarams Plc',
    price: 3.9,
    change: 0.0,
    changeAmount: 0.0,
    volume: '54K',
    volumeRaw: 53900,
    sector: 'Conglomerates',
    sparkline: [3.7, 3.76, 3.82, 3.88, 3.94, 4.0, 4.06],
    chartData: [
      { date: '1 Aug', price: 3.59, volume: 53900 },
      { date: '8 Aug', price: 3.7, volume: 73900 },
      { date: '15 Aug', price: 3.82, volume: 38900 },
      { date: '22 Aug', price: 3.86, volume: 103900 },
      { date: '29 Aug', price: 3.9, volume: 53900 }
    ],
    peRatio: 7.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '5.6%',
    fiftyTwoWeekRange: { low: 2.73, high: 5.07 },
    description: 'Chellarams Plc (CHELLARAM) is listed on the Nigerian Exchange (NGX) under the Conglomerates sector.',
    aiInsight: {
      Beginner: "Chellarams Plc is trading at ₦3.9. It represents a key stock in the Nigerian Conglomerates industry.",
      Intermediate: "CHELLARAM maintains a P/E ratio of 7.5 with a current market capitalization of ₦0.0B.",
      Experienced: "CHELLARAM demonstrates strategic exposure in Conglomerates. Dividend yield sits at 5.6% with 52-week high of ₦5.07."
    },
    eps: 0.52,
    bvps: 1.86,
    targetPrice: 4.6,
    rating: 'Neutral'
  },
  {
    ticker: 'JOHNHOLT',
    name: 'John Holt Plc',
    price: 2.6,
    change: 0.0,
    changeAmount: 0.0,
    volume: '53K',
    volumeRaw: 52600,
    sector: 'Conglomerates',
    sparkline: [2.47, 2.51, 2.55, 2.59, 2.63, 2.67, 2.7],
    chartData: [
      { date: '1 Aug', price: 2.39, volume: 52600 },
      { date: '8 Aug', price: 2.47, volume: 72600 },
      { date: '15 Aug', price: 2.55, volume: 37600 },
      { date: '22 Aug', price: 2.57, volume: 102600 },
      { date: '29 Aug', price: 2.6, volume: 52600 }
    ],
    peRatio: 6.0,
    pbRatio: 1.7,
    marketCap: '₦0.0B',
    dividendYield: '4.4%',
    fiftyTwoWeekRange: { low: 1.82, high: 3.38 },
    description: 'John Holt Plc (JOHNHOLT) is listed on the Nigerian Exchange (NGX) under the Conglomerates sector.',
    aiInsight: {
      Beginner: "John Holt Plc is trading at ₦2.6. It represents a key stock in the Nigerian Conglomerates industry.",
      Intermediate: "JOHNHOLT maintains a P/E ratio of 6.0 with a current market capitalization of ₦0.0B.",
      Experienced: "JOHNHOLT demonstrates strategic exposure in Conglomerates. Dividend yield sits at 4.4% with 52-week high of ₦3.38."
    },
    eps: 0.43,
    bvps: 1.53,
    targetPrice: 3.07,
    rating: 'Neutral'
  },
  {
    ticker: 'SCOA',
    name: 'SCOA Nigeria Plc',
    price: 2.15,
    change: 0.0,
    changeAmount: 0.0,
    volume: '52K',
    volumeRaw: 52150,
    sector: 'Conglomerates',
    sparkline: [2.04, 2.07, 2.11, 2.14, 2.17, 2.2, 2.24],
    chartData: [
      { date: '1 Aug', price: 1.98, volume: 52150 },
      { date: '8 Aug', price: 2.04, volume: 72150 },
      { date: '15 Aug', price: 2.11, volume: 37150 },
      { date: '22 Aug', price: 2.13, volume: 102150 },
      { date: '29 Aug', price: 2.15, volume: 52150 }
    ],
    peRatio: 10.5,
    pbRatio: 2.1,
    marketCap: '₦0.0B',
    dividendYield: '6.8%',
    fiftyTwoWeekRange: { low: 1.5, high: 2.79 },
    description: 'SCOA Nigeria Plc (SCOA) is listed on the Nigerian Exchange (NGX) under the Conglomerates sector.',
    aiInsight: {
      Beginner: "SCOA Nigeria Plc is trading at ₦2.15. It represents a key stock in the Nigerian Conglomerates industry.",
      Intermediate: "SCOA maintains a P/E ratio of 10.5 with a current market capitalization of ₦0.0B.",
      Experienced: "SCOA demonstrates strategic exposure in Conglomerates. Dividend yield sits at 6.8% with 52-week high of ₦2.79."
    },
    eps: 0.2,
    bvps: 1.02,
    targetPrice: 2.54,
    rating: 'Neutral'
  }
];

export const mockMovers = {
  gainers: ngxStocks.filter(s => s.change > 0).sort((a, b) => b.change - a.change).slice(0, 5),
  losers: ngxStocks.filter(s => s.change < 0).sort((a, b) => a.change - b.change).slice(0, 5),
};

export const equityStackAIBrief = {
  morning: "Morning Market Update: The NGX opened today with robust buying interest in the Tier-1 Banking sector, as institutional investors position ahead of the upcoming MPC meeting.\n\nMacro Overview: Inflation metrics continue to dictate early trading patterns. Expect heightened volatility in consumer goods as FX revaluation fears weigh on early trading volumes. Importers are bracing for the newly adjusted exchange rates.\n\nSector Highlights: Keep an eye on ZENITHBANK and GTCO as primary volume drivers today. The Financial services sector is seeing a 2.3% uptick in pre-market indications. In the Energy sector, downstream operators are stabilizing after recent policy changes.",
  afternoon: "Mid-Day Market Update: Trading volumes have surged past ₦4B as the banking rally sustains momentum into the afternoon session.\n\nMacro Overview: The All Share Index (ASI) is trending upwards, driven by institutional block trades. Currency stability over the last 48 hours is restoring confidence in the short-term market outlook.\n\nSector Highlights: The oil & gas sector sees selective buying (OANDO up +9.8% following NAOC regulatory clearance). Consumer goods continue to experience minor sell-side pressure, though Nestle is holding its support level.",
  night: "Daily Market Recap: The NGX ASI closed strong today (+1.24%), primarily driven by a heavy morning bid in banking equities that sustained through the afternoon.\n\nMacro Overview: The Central Bank's hawkish stance favored financial stocks, masking the steep declines in consumer manufacturers who face rising dollar-denominated input costs. The market breath remains positive with 24 gainers against 16 losers.\n\nSector Highlights: Oando's upstream acquisition approval injected significant optimism into the energy sector today. Tier-1 banks accumulated the most volume, with Zenith Bank leading trades by value."
};

export const mockNews: NewsItem[] = [
  {
    id: 'news-1',
    source: 'BusinessDay',
    timeAgo: '2h ago',
    date: '2026-07-19T06:00:00Z',
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
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-2',
    source: 'PremiumTimes',
    timeAgo: '4h ago',
    date: '2026-07-19T04:00:00Z',
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
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-3',
    source: 'Nairametrics',
    timeAgo: '6h ago',
    date: '2026-07-19T02:00:00Z',
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
    category: 'Economy',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-4',
    source: 'Stears Business',
    timeAgo: '1d ago',
    date: '2026-07-18T08:00:00Z',
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
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-5',
    source: 'BusinessDay',
    timeAgo: '2d ago',
    date: '2026-07-17T08:00:00Z',
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
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-6',
    source: 'Nairametrics',
    timeAgo: '23h ago',
    date: '2026-07-18T09:00:00Z',
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
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-7',
    source: 'TechCabal',
    timeAgo: '14h ago',
    date: '2026-07-18T18:00:00Z',
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
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-8',
    source: 'BusinessDay',
    timeAgo: '15h ago',
    date: '2026-07-18T17:00:00Z',
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
    category: 'Economy',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-9',
    source: 'PremiumTimes',
    timeAgo: '28m ago',
    date: '2026-07-19T07:30:00Z',
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
    category: 'Economy',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-10',
    source: 'CryptoAsset',
    timeAgo: '3h ago',
    date: '2026-07-19T05:00:00Z',
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
    category: 'Global News',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-11',
    source: 'Financial Times',
    timeAgo: '1mo ago',
    date: '2026-06-15T12:00:00Z',
    originalHeadline: 'Central Bank of Nigeria Hikes Interest Rates by 150 Basis Points',
    aiSummary: 'In a bold move to combat soaring inflation, the Central Bank has increased the monetary policy rate. This makes borrowing more expensive but benefits bank margins.',
    whyItMatters: 'Higher interest rates mean higher borrowing costs for businesses, but banks can charge more for loans, expanding their net interest margins.',
    implications: 'Expect banking stocks to rally on expected profit surges, while consumer goods stocks may face continued pressure.',
    keyDriver: 'Policy Change',
    affectedStocks: ['ZENITHBANK', 'GTCO', 'UBA'],
    marketImpact: 'Positive',
    drivers: ['CBN', 'InterestRates', 'BankingSector'],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
    commentsCount: 45,
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-12',
    source: 'Reuters',
    timeAgo: '2mo ago',
    date: '2026-05-20T10:00:00Z',
    originalHeadline: 'Nigeria\'s Q1 GDP Growth Slows Amid Economic Reforms',
    aiSummary: 'Economic growth in the first quarter came in below expectations as the country adjusts to fuel subsidy removals and FX unification.',
    whyItMatters: 'Slower GDP growth reflects the immediate pain of structural reforms, reducing overall market liquidity.',
    implications: 'Investors are shifting towards defensive stocks and high-yield fixed income assets to protect against economic slowdown.',
    keyDriver: 'Macro Event',
    affectedStocks: [],
    marketImpact: 'Negative',
    drivers: ['GDP', 'EconomicGrowth', 'Reforms'],
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=300&q=80',
    commentsCount: 62,
    category: 'Stock Market',
    fullContent: `This is a comprehensive overview of the recent events affecting this sector. Analysts are closely watching the developments, noting that the implications could be far-reaching for investors.

"The current market dynamics require a strategic approach," noted a senior analyst. "We are seeing unprecedented shifts in trading volumes and sentiment."

Investors are advised to maintain a diversified portfolio and stay informed about upcoming policy announcements.`,
    commentsList: [
      { id: '1', user: 'TradingPro99', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TradingPro99', text: 'This is exactly what I was expecting. The market was pricing this in.', timeAgo: '2h ago' },
      { id: '2', user: 'ValueInvestor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ValueInvestor', text: 'Interesting perspective. I might adjust my position accordingly.', timeAgo: '4h ago' }
    ],
  },
  {
    id: 'news-13',
    source: 'PremiumTimes',
    timeAgo: '1h ago',
    date: '2026-07-19T08:30:00Z',
    originalHeadline: 'CPPE Backs FG Reforms, Urges Shift from Economic Stability to Productivity',
    aiSummary: 'The Centre for the Promotion of Private Enterprise (CPPE) supported fiscal reforms while advising policymakers to focus on real-sector productivity and infrastructure.',
    whyItMatters: 'Productivity-driven growth creates sustainable corporate earnings for industrial and manufacturing sectors.',
    implications: 'Firms in agriculture, cement, and power could see stronger demand under targeted productivity incentives.',
    keyDriver: 'Macro Event',
    affectedStocks: ['DANGCEM', 'BUAFOODS'],
    marketImpact: 'Positive',
    drivers: ['CPPE', 'EconomicReforms', 'Productivity'],
    imageUrl: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=300&q=80',
    commentsCount: 14,
    category: 'Economy',
    fullContent: `Comprehensive review of national economic policy shifts and private sector recommendations.`,
    commentsList: [],
  },
  {
    id: 'news-14',
    source: 'PremiumTimes',
    timeAgo: '1h ago',
    date: '2026-07-19T08:00:00Z',
    originalHeadline: 'Nwabueze Defends Made-in-Nigeria Office, Posts Documents After ICPC Claim',
    aiSummary: 'Public clarification issued with supporting documentation regarding statutory compliance and industrial growth initiatives.',
    whyItMatters: 'Provides transparency on local manufacturing policy frameworks and institutional compliance.',
    implications: 'Reduces uncertainty surrounding industrial incentive allocations for local production.',
    keyDriver: 'Regulatory Approval',
    affectedStocks: ['JBERGER'],
    marketImpact: 'Neutral',
    drivers: ['Manufacturing', 'Compliance', 'Governance'],
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=300&q=80',
    commentsCount: 7,
    category: 'Economy',
    fullContent: `Detailed report on industrial policy updates and governance compliance.`,
    commentsList: [],
  },
  {
    id: 'news-15',
    source: 'Nairametrics',
    timeAgo: '2h ago',
    date: '2026-07-19T07:00:00Z',
    originalHeadline: 'FBN Holdings Reaches Agreement on International Expansion Strategy',
    aiSummary: 'First Bank holding company outlines strategic regional expansion across key commercial corridors to boost cross-border trade revenue.',
    whyItMatters: 'Regional diversification strengthens non-interest income and hedges against single-market economic volatility.',
    implications: 'Expected growth in trade finance fee income will enhance net operating margins over the next fiscal cycle.',
    keyDriver: 'Earnings Beat',
    affectedStocks: ['FBNH', 'ACCESSCORP'],
    marketImpact: 'Positive',
    drivers: ['Banking', 'Expansion', 'TradeFinance'],
    imageUrl: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=300&q=80',
    commentsCount: 19,
    category: 'Stock Market',
    fullContent: `Detailed analysis of FBN Holdings expansion roadmap and strategic objectives.`,
    commentsList: [],
  },
  {
    id: 'news-16',
    source: 'BusinessDay',
    timeAgo: '3h ago',
    date: '2026-07-19T06:00:00Z',
    originalHeadline: 'Transcorp Power Reports 85% Revenue Surge Following Grid Capacity Expansion',
    aiSummary: 'Transcorp Power PLC recorded an 85% year-on-year revenue surge following additional generation capacity deployment to the national grid.',
    whyItMatters: 'Capacity additions directly boost energy off-take volumes and quarterly EBITDA margins.',
    implications: 'Strong free cash flows will support dividend payouts and ongoing plant infrastructure upgrades.',
    keyDriver: 'Earnings Beat',
    affectedStocks: ['TRANSCORP'],
    marketImpact: 'Positive',
    drivers: ['PowerGen', 'RevenueSurge', 'Energy'],
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=300&q=80',
    commentsCount: 28,
    category: 'Stock Market',
    fullContent: `Full breakdown of Transcorp Power financial performance and capacity metrics.`,
    commentsList: [],
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
