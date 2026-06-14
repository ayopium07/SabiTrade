import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getConceptExplanation } from './mockData';

export interface PortfolioHolding {
  ticker: string;
  shares: number;
  buyPrice: number;
  date: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export interface UserProfile {
  name: string;
  email: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Experienced';
  interests: string[];
  isOnboarded: boolean;
}

export interface AppState {
  // Navigation & View Flow
  currentView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade';
  previousView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'about' | 'learn' | 'community' | 'trade';
  selectedTicker: string;
  
  // User Authentication & Onboarding
  user: UserProfile | null;
  
  // Watchlist & Market search
  watchlist: string[];
  marketSearchQuery: string;
  marketSectorFilter: string;
  
  // Portfolio Holdings
  portfolio: PortfolioHolding[];
  demoPortfolio: PortfolioHolding[];
  cashBalance: number;
  
  // Chatbot State
  chatMessages: ChatMessage[];
  isChatOpen: boolean;
  isChatTyping: boolean;

  // Actions
  setView: (view: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade') => void;
  setSelectedTicker: (ticker: string) => void;
  loginUser: (name: string, email: string) => void;
  setOnboarding: (data: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  logoutUser: () => void;
  toggleWatchlist: (ticker: string) => void;
  addHolding: (ticker: string, shares: number, buyPrice: number) => void;
  addDemoTrade: (ticker: string, shares: number, price: number, type: 'buy' | 'sell', totalCostOrProceeds: number) => { success: boolean; error?: string };
  removeHolding: (ticker: string) => void;
  setMarketSearch: (query: string) => void;
  setMarketSector: (sector: string) => void;
  toggleChat: () => void;
  sendChatMessage: (text: string) => void;
  clearChat: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
  currentView: 'landing',
  previousView: 'landing',
  selectedTicker: 'DANGCEM',
  user: null,
  watchlist: ['DANGCEM', 'ZENITHBANK', 'MTNN'],
  marketSearchQuery: '',
  marketSectorFilter: 'All',
  portfolio: [
    { ticker: 'ZENITHBANK', shares: 5000, buyPrice: 35.50, date: '2026-04-12' },
    { ticker: 'DANGCEM', shares: 200, buyPrice: 620.00, date: '2026-05-01' }
  ],
  demoPortfolio: [],
  cashBalance: 10000000,
  chatMessages: [
    {
      sender: 'ai',
      text: "Ẹ n lẹ! Welcome to EquityStack assistant! 👋 I translate scary Nigerian stock jargon into plain English. \n\nSelect a quick-reply chip below or type your question. How can I help you start your wealth journey today?",
      timestamp: new Date()
    }
  ],
  isChatOpen: false,
  isChatTyping: false,

  setView: (view) => set((state) => {
    // Save WHERE we currently are as previousView before navigating away.
    // Only update previousView when leaving a real navigable page
    // (not when going TO stock-detail, onboarding, or landing, which aren't "back" destinations).
    const leavingView = state.currentView;
    const shouldSavePrev = (
      leavingView !== 'stock-detail' &&
      leavingView !== 'onboarding' &&
      leavingView !== 'landing'
    );
    return {
      currentView: view,
      previousView: shouldSavePrev ? leavingView : state.previousView,
    };
  }),

  setSelectedTicker: (ticker) => set((state) => ({
    selectedTicker: ticker,
    currentView: 'stock-detail',
    // Save the view we're leaving so the Back button knows where to return
    previousView: (
      state.currentView !== 'stock-detail' &&
      state.currentView !== 'onboarding' &&
      state.currentView !== 'landing'
    ) ? state.currentView : state.previousView,
  })),

  loginUser: (name, email) => set({
    user: {
      name,
      email,
      experienceLevel: 'Beginner',
      interests: [],
      isOnboarded: false,
    },
    currentView: 'onboarding'
  }),

  setOnboarding: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),

  completeOnboarding: () => set((state) => ({
    user: state.user ? { ...state.user, isOnboarded: true } : null,
    currentView: 'home'
  })),

  logoutUser: () => set({
    user: null,
    currentView: 'landing'
  }),

  toggleWatchlist: (ticker) => set((state) => {
    const exists = state.watchlist.includes(ticker);
    return {
      watchlist: exists 
        ? state.watchlist.filter(t => t !== ticker)
        : [...state.watchlist, ticker]
    };
  }),

  addHolding: (ticker, shares, buyPrice) => set((state) => {
    // If holding already exists, average it or add it as a new transaction.
    // For simplicity in the MVP manual tracker, we overwrite/update or append
    const existingIndex = state.portfolio.findIndex(h => h.ticker === ticker);
    const newPortfolio = [...state.portfolio];
    
    if (existingIndex >= 0) {
      const existing = state.portfolio[existingIndex];
      const newShares = existing.shares + shares;
      const newCost = (existing.shares * existing.buyPrice) + (shares * buyPrice);
      const newAvgPrice = parseFloat((newCost / newShares).toFixed(2));
      
      newPortfolio[existingIndex] = {
        ticker,
        shares: newShares,
        buyPrice: newAvgPrice,
        date: new Date().toISOString().split('T')[0]
      };
    } else {
      newPortfolio.push({
        ticker,
        shares,
        buyPrice,
        date: new Date().toISOString().split('T')[0]
      });
    }

    return { portfolio: newPortfolio };
  }),

  addDemoTrade: (ticker, shares, price, type, totalCostOrProceeds) => {
    const state = get();
    if (type === 'buy') {
      if (totalCostOrProceeds > state.cashBalance) {
        return { success: false, error: 'Insufficient simulated cash balance!' };
      }
      
      const newCash = state.cashBalance - totalCostOrProceeds;
      const existingIndex = state.demoPortfolio.findIndex(h => h.ticker === ticker);
      const newDemoPortfolio = [...state.demoPortfolio];
      
      if (existingIndex >= 0) {
        const existing = state.demoPortfolio[existingIndex];
        const newShares = existing.shares + shares;
        const newCost = (existing.shares * existing.buyPrice) + (shares * price);
        const newAvgPrice = parseFloat((newCost / newShares).toFixed(2));
        
        newDemoPortfolio[existingIndex] = {
          ticker,
          shares: newShares,
          buyPrice: newAvgPrice,
          date: new Date().toISOString().split('T')[0]
        };
      } else {
        newDemoPortfolio.push({
          ticker,
          shares,
          buyPrice: price,
          date: new Date().toISOString().split('T')[0]
        });
      }
      
      set({ cashBalance: newCash, demoPortfolio: newDemoPortfolio });
      return { success: true };
    } else { // sell
      const existingIndex = state.demoPortfolio.findIndex(h => h.ticker === ticker);
      if (existingIndex < 0 || state.demoPortfolio[existingIndex].shares < shares) {
        return { success: false, error: 'Insufficient shares to sell!' };
      }
      
      const existing = state.demoPortfolio[existingIndex];
      const newShares = existing.shares - shares;
      let newDemoPortfolio = [...state.demoPortfolio];
      
      if (newShares === 0) {
        newDemoPortfolio = newDemoPortfolio.filter(h => h.ticker !== ticker);
      } else {
        newDemoPortfolio[existingIndex] = {
          ...existing,
          shares: newShares,
          date: new Date().toISOString().split('T')[0]
        };
      }
      
      const newCash = state.cashBalance + totalCostOrProceeds;
      set({ cashBalance: newCash, demoPortfolio: newDemoPortfolio });
      return { success: true };
    }
  },

  removeHolding: (ticker) => set((state) => ({
    portfolio: state.portfolio.filter(h => h.ticker !== ticker)
  })),

  setMarketSearch: (query) => set({ marketSearchQuery: query }),
  setMarketSector: (sector) => set({ marketSectorFilter: sector }),

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  sendChatMessage: (text) => {
    const userMessage: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date()
    };

    set((state) => ({
      chatMessages: [...state.chatMessages, userMessage],
      isChatTyping: true
    }));

    // Generate simulated bot response based on user experience level
    setTimeout(() => {
      const userLevel = get().user?.experienceLevel || 'Beginner';
      
      // Determine what concept they asked about
      let concept = 'default';
      const lowercaseText = text.toLowerCase();
      if (lowercaseText.includes('p/e') || lowercaseText.includes('pe ratio') || lowercaseText.includes('price to earnings') || lowercaseText.includes('earning')) {
        concept = 'pe ratio';
      } else if (lowercaseText.includes('how to invest') || lowercaseText.includes('how do i start') || lowercaseText.includes('start') || lowercaseText.includes('broker') || lowercaseText.includes('buy')) {
        concept = 'how to invest';
      } else if (lowercaseText.includes('ngx') || lowercaseText.includes('nigerian exchange') || lowercaseText.includes('stock market') || lowercaseText.includes('stock exchange')) {
        concept = 'ngx';
      }

      const botText = getConceptExplanation(concept, userLevel);
      const botMessage: ChatMessage = {
        sender: 'ai',
        text: botText,
        timestamp: new Date()
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, botMessage],
        isChatTyping: false
      }));
    }, 1200);
  },

  clearChat: () => set((state) => ({
    chatMessages: [
      {
        sender: 'ai',
        text: `Hey ${state.user?.name || ''}! Welcome back to EquityStack assistant. Ask me to explain anything in a simplified way!`,
        timestamp: new Date()
      }
    ]
  }))
  }),
  {
    name: 'equitystack-session',
    // Only persist the essential session state — not transient UI or chat history
    partialize: (state) => ({
      currentView: state.currentView,
      previousView: state.previousView,
      selectedTicker: state.selectedTicker,
      user: state.user,
      watchlist: state.watchlist,
      portfolio: state.portfolio,
      demoPortfolio: state.demoPortfolio,
      cashBalance: state.cashBalance,
      marketSectorFilter: state.marketSectorFilter,
    }),
  }
)
);
