'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat, Message } from 'ai/react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div 
          className="w-80 sm:w-96 h-[500px] mb-4 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(9,8,27,0.95) 0%, rgba(43,38,129,0.95) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#DEAB52]/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#DEAB52]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">SabiTrade Analyst</h3>
                <p className="text-white/60 text-xs">AI Assistant</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-white/50 text-sm mt-10">
                <p>Hello! I am your Nigerian market analyst.</p>
                <p className="mt-2">Ask me anything about stocks, portfolios, or the economy!</p>
              </div>
            )}
            
            {messages.map((m: Message) => (
              <div 
                key={m.id} 
                className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${
                  m.role === 'user' 
                    ? 'bg-white/10 text-white' 
                    : 'bg-[#DEAB52]/20 text-[#DEAB52]'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === 'user' 
                    ? 'bg-white/10 text-white rounded-tr-none' 
                    : 'bg-[#DEAB52]/10 text-white rounded-tl-none border border-[#DEAB52]/20'
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full bg-[#DEAB52]/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#DEAB52]" />
                </div>
                <div className="bg-[#DEAB52]/10 border border-[#DEAB52]/20 rounded-2xl rounded-tl-none px-4 py-3 text-white">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-black/20">
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about the market..."
                className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-4 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#DEAB52]/50 transition-colors"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-[#DEAB52] text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#c29546] transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 ${
          isOpen 
            ? 'bg-white/10 text-white hover:bg-white/20' 
            : 'bg-[#DEAB52] text-[#09081B] hover:bg-[#c29546]'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
