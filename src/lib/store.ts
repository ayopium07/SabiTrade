
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stock, ngxStocks, ngxIndexData, NewsItem, mockNews } from '@/lib/mockData';

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
  profileImage?: string;
}

export interface SocialUser {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  followers: string[]; // array of userIds
  following: string[]; // array of userIds
  joinDate: string;
}

export interface SocialPost {
  id: string;
  authorId: string;
  content: string;
  tickerTags: string[];
  createdAt: string;
  likes: string[]; // array of userIds
  retweets: string[]; // array of userIds
  repliesCount: number;
}

export interface SocialComment {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  likes: string[]; // array of userIds
}

export interface AppState {
  // Navigation & View Flow
  currentView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade' | 'public-profile' | 'post-thread';
  previousView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'about' | 'learn' | 'community' | 'trade' | 'public-profile' | 'post-thread';
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

  // Real-time market state
  stocks: Stock[];
  indexData: typeof ngxIndexData;
  isLoadingMarketData: boolean;

  // Real-time news state
  news: NewsItem[];
  isLoadingNews: boolean;

  // Social Network State
  communityUsers: SocialUser[];
  communityPosts: SocialPost[];
  communityComments: SocialComment[];
  selectedUserId: string | null;
  selectedPostId: string | null;

  // Actions
  setView: (view: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade' | 'public-profile' | 'post-thread') => void;
  setSelectedTicker: (ticker: string) => void;
  loginUser: (name: string, email: string) => void;
  signInUser: (name: string, email: string) => void;
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
  fetchMarketData: () => Promise<void>;
  fetchNews: () => Promise<void>;
  updateProfileImage: (url: string) => void;

  // Social Actions
  viewProfile: (userId: string) => void;
  viewThread: (postId: string) => void;
  likePost: (postId: string, userId: string) => void;
  retweetPost: (postId: string, userId: string) => void;
  addPost: (content: string, tickerTags: string[], authorId: string) => void;
  addComment: (postId: string, content: string, authorId: string) => void;
  followUser: (targetUserId: string, currentUserId: string) => void;
  unfollowUser: (targetUserId: string, currentUserId: string) => void;
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
  stocks: ngxStocks,
  indexData: ngxIndexData,
  isLoadingMarketData: false,
  news: mockNews,
  isLoadingNews: false,

  communityUsers: [
    { id: 'u1', name: 'Adebayo O.', handle: 'adebayo_trades', avatar: 'AO', bio: 'Value investor focused on NGX banking sector. Always looking for dividends.', followers: ['u2', 'u3'], following: ['u2'], joinDate: 'March 2026' },
    { id: 'u2', name: 'Chioma N.', handle: 'chioma_invests', avatar: 'CN', bio: 'Swing trader. Crypto & Stocks.', followers: ['u1'], following: ['u1', 'u3'], joinDate: 'January 2026' },
    { id: 'u3', name: 'SabiTrade Official', handle: 'sabitrade', avatar: 'ST', bio: 'Official account of SabiTrade. Your home for NGX data and community.', followers: ['u1', 'u2'], following: [], joinDate: 'December 2025' }
  ],
  communityPosts: [
    { id: 'p1', authorId: 'u1', content: 'Just added more to my $ZENITHBANK position. The Q1 earnings report looks very promising! Who else is holding?', tickerTags: ['ZENITHBANK'], createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), likes: ['u2'], retweets: [], repliesCount: 1 },
    { id: 'p2', authorId: 'u2', content: 'Anyone tracking $DANGCEM recently? Thinking of rotating my portfolio into more industrial goods as inflation hedges.', tickerTags: ['DANGCEM'], createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), likes: ['u1', 'u3'], retweets: ['u1'], repliesCount: 0 }
  ],
  communityComments: [
    { id: 'c1', postId: 'p1', authorId: 'u2', content: 'Agreed! Their dividend yield is unbeatable right now.', createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), likes: ['u1'] }
  ],
  selectedUserId: null,
  selectedPostId: null,

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

  signInUser: (name, email) => set({
    user: {
      name,
      email,
      experienceLevel: 'Beginner',
      interests: [],
      isOnboarded: true,
    },
    currentView: 'home'
  }),

  setOnboarding: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null
  })),

  completeOnboarding: () => set((state) => ({
    user: state.user ? { ...state.user, isOnboarded: true } : null,
    currentView: 'home'
  })),

  updateProfileImage: (url) => set((state) => ({
    user: state.user ? { ...state.user, profileImage: url } : null
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

  sendChatMessage: async (text) => {
    const userMessage: ChatMessage = {
      sender: 'user',
      text,
      timestamp: new Date()
    };

    const currentMessages = get().chatMessages;
    const nextMessages = [...currentMessages, userMessage];

    set({
      chatMessages: nextMessages,
      isChatTyping: true
    });

    try {
      const experienceLevel = get().user?.experienceLevel || 'Beginner';
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: nextMessages,
          experienceLevel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch AI response');
      }

      const data = await response.json();
      const botMessage: ChatMessage = {
        sender: 'ai',
        text: data.reply,
        timestamp: new Date()
      };

      set((state) => ({
        chatMessages: [...state.chatMessages, botMessage],
        isChatTyping: false
      }));
    } catch (err: unknown) {
      console.error('AI chat failed:', err);
      const errMsg = err instanceof Error ? err.message : 'Please check your connection or environment config.';
      const errorMessage: ChatMessage = {
        sender: 'ai',
        text: `Sorry, I couldn't reach the intelligence engine. ${errMsg}`,
        timestamp: new Date()
      };
      set((state) => ({
        chatMessages: [...state.chatMessages, errorMessage],
        isChatTyping: false
      }));
    }
  },

  clearChat: () => set((state) => ({
    chatMessages: [
      {
        sender: 'ai',
        text: `Hey ${state.user?.name || ''}! Welcome back to EquityStack assistant. Ask me to explain anything in a simplified way!`,
        timestamp: new Date()
      }
    ]
  })),

  fetchMarketData: async () => {
    if (get().isLoadingMarketData) return;
    set({ isLoadingMarketData: true });
    try {
      const response = await fetch('/api/market/data');
      if (response.ok) {
        const data = await response.json();
        if (data.stocks && data.indexData) {
          set({
            stocks: data.stocks,
            indexData: data.indexData
          });
        }
      }
    } catch (err) {
      console.error('Failed to fetch market data:', err);
    } finally {
      set({ isLoadingMarketData: false });
    }
  },

  fetchNews: async () => {
    if (get().isLoadingNews) return;
    set({ isLoadingNews: true });
    try {
      const response = await fetch('/api/ai/news');
      if (response.ok) {
        const data = await response.json();
        if (data.news && Array.isArray(data.news)) {
          set({ news: data.news });
        }
      }
    } catch (err) {
      console.error('Failed to fetch news:', err);
    } finally {
      set({ isLoadingNews: false });
    }
  },

  viewProfile: (userId) => set((state) => ({
    selectedUserId: userId,
    currentView: 'public-profile',
    previousView: (
      state.currentView !== 'stock-detail' &&
      state.currentView !== 'onboarding' &&
      state.currentView !== 'landing' &&
      state.currentView !== 'public-profile' &&
      state.currentView !== 'post-thread'
    ) ? state.currentView : state.previousView,
  })),

  viewThread: (postId) => set((state) => ({
    selectedPostId: postId,
    currentView: 'post-thread',
    previousView: (
      state.currentView !== 'stock-detail' &&
      state.currentView !== 'onboarding' &&
      state.currentView !== 'landing' &&
      state.currentView !== 'public-profile' &&
      state.currentView !== 'post-thread'
    ) ? state.currentView : state.previousView,
  })),

  likePost: (postId, userId) => set((state) => ({
    communityPosts: state.communityPosts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes(userId);
        return { ...p, likes: hasLiked ? p.likes.filter(id => id !== userId) : [...p.likes, userId] };
      }
      return p;
    })
  })),

  retweetPost: (postId, userId) => set((state) => ({
    communityPosts: state.communityPosts.map(p => {
      if (p.id === postId) {
        const hasRetweeted = p.retweets.includes(userId);
        return { ...p, retweets: hasRetweeted ? p.retweets.filter(id => id !== userId) : [...p.retweets, userId] };
      }
      return p;
    })
  })),

  addPost: (content, tickerTags, authorId) => set((state) => ({
    communityPosts: [
      {
        id: `p${Date.now()}`,
        authorId,
        content,
        tickerTags,
        createdAt: new Date().toISOString(),
        likes: [],
        retweets: [],
        repliesCount: 0
      },
      ...state.communityPosts
    ]
  })),

  addComment: (postId, content, authorId) => set((state) => ({
    communityComments: [
      ...state.communityComments,
      {
        id: `c${Date.now()}`,
        postId,
        authorId,
        content,
        createdAt: new Date().toISOString(),
        likes: []
      }
    ],
    communityPosts: state.communityPosts.map(p => p.id === postId ? { ...p, repliesCount: p.repliesCount + 1 } : p)
  })),

  followUser: (targetUserId, currentUserId) => set((state) => ({
    communityUsers: state.communityUsers.map(u => {
      if (u.id === targetUserId) {
        return { ...u, followers: Array.from(new Set([...u.followers, currentUserId])) };
      }
      if (u.id === currentUserId) {
        return { ...u, following: Array.from(new Set([...u.following, targetUserId])) };
      }
      return u;
    })
  })),

  unfollowUser: (targetUserId, currentUserId) => set((state) => ({
    communityUsers: state.communityUsers.map(u => {
      if (u.id === targetUserId) {
        return { ...u, followers: u.followers.filter(id => id !== currentUserId) };
      }
      if (u.id === currentUserId) {
        return { ...u, following: u.following.filter(id => id !== targetUserId) };
      }
      return u;
    })
  }))

  }),
  {
    name: 'equitystack-session',
    // Only persist the essential session state — not transient UI, chat history, or real-time prices
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
