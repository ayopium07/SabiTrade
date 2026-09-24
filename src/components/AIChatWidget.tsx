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
          className="w-80 sm:w-96 h-[500px] mb-4 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border bg-bg-surface backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-bg-raised">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-text-primary font-semibold text-sm">SabiTrade Analyst</h3>
                <p className="text-text-muted text-xs">AI Assistant</p>
              </div>
            </div>
            <button 
              onClick={toggleChat}
              className="text-text-muted hover:text-text-primary transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-text-muted text-sm mt-10">
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
                    ? 'bg-bg-raised text-text-primary' 
                    : 'bg-brand-primary/20 text-brand-primary'
                }`}>
                  {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-primary text-bg-base font-medium rounded-tr-none' 
                    : 'bg-bg-raised text-text-primary rounded-tl-none border border-border'
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 shrink-0 rounded-full bg-brand-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="bg-bg-raised border border-border rounded-2xl rounded-tl-none px-4 py-3 text-text-primary">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-bg-raised">
            <div className="relative">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about the market..."
                className="w-full bg-bg-surface border border-border rounded-full py-3 pl-4 pr-12 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-brand-primary transition-colors"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-brand-primary text-bg-base disabled:opacity-50 disabled:cursor-not-allowed hover:brightness-110 transition-colors"
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
            ? 'bg-bg-raised text-text-primary hover:bg-bg-surface border border-border' 
            : 'bg-brand-primary text-bg-base hover:brightness-110'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  );
}
