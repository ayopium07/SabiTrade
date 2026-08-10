import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Sparkles, RotateCcw, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AIChatbot() {
  const isChatOpen    = useAppStore((s) => s.isChatOpen);
  const isChatTyping  = useAppStore((s) => s.isChatTyping);
  const chatMessages  = useAppStore((s) => s.chatMessages);
  const toggleChat    = useAppStore((s) => s.toggleChat);
  const sendChatMessage = useAppStore((s) => s.sendChatMessage);
  const clearChat     = useAppStore((s) => s.clearChat);

  const [inputText, setInputText] = useState('');
  const chatEndRef  = useRef<HTMLDivElement | null>(null);
  const inputRef    = useRef<HTMLInputElement | null>(null);

  // ── Drag state ────────────────────────────────────────────
  const [pos, setPos] = useState({ x: 24, y: 24 });
  const isDragging  = useRef(false);
  const hasDragged  = useRef(false);
  const dragStart   = useRef({ mx: 0, my: 0, bx: 0, by: 0 });
  const orbRef      = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setPos({ x: 16, y: 76 });
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatOpen]);

  // ── Drag handlers ─────────────────────────────────────────
  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const dx = clientX - dragStart.current.mx;
    const dy = clientY - dragStart.current.my;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;
    const W = window.innerWidth;
    const H = window.innerHeight;
    const SIZE = 56;
    let newX = Math.max(8, Math.min(dragStart.current.bx - dx, W - SIZE - 8));
    let newY = Math.max(8, Math.min(dragStart.current.by - dy, H - SIZE - 8));
    setPos({ x: newX, y: newY });
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  const onMouseMove = useCallback((e: MouseEvent) => onDragMove(e.clientX, e.clientY), [onDragMove]);
  const onMouseUp   = useCallback(() => onDragEnd(), [onDragEnd]);
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    onDragMove(e.touches[0].clientX, e.touches[0].clientY);
  }, [onDragMove]);
  const onTouchEnd = useCallback(() => onDragEnd(), [onDragEnd]);

  const startDrag = (clientX: number, clientY: number) => {
    isDragging.current  = true;
    hasDragged.current  = false;
    dragStart.current   = { mx: clientX, my: clientY, bx: pos.x, by: pos.y };
    document.body.style.userSelect = 'none';
    document.body.style.cursor = 'grabbing';
  };

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const handleOrbClick = () => {
    if (!hasDragged.current) toggleChat();
  };

  // ── Chat helpers ──────────────────────────────────────────
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() && !isChatTyping) {
      sendChatMessage(inputText.trim());
      setInputText('');
    }
  };

  const handleClose = () => {
    toggleChat();
    setTimeout(() => clearChat(), 300);
  };

  const parseMarkdown = (text: string) => {
    // Strip the disclaimer line for cleaner display
    const cleaned = text.replace(/\*Disclaimer:[\s\S]*?\*/g, '').trim();
    return cleaned.split('\n').map((line, lineIdx) => {
      if (!line.trim()) return null;
      const isBullet = line.startsWith('* ') || line.startsWith('- ');
      const content  = isBullet ? line.substring(2) : line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: (string | React.ReactElement)[] = [];
      let lastIndex = 0, match;
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) parts.push(content.substring(lastIndex, match.index));
        parts.push(<strong key={match.index} className="font-extrabold" style={{ color: '#CFA343' }}>{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) parts.push(content.substring(lastIndex));
      const elements = parts.length > 0 ? parts : content;
      if (isBullet) return <li key={lineIdx} className="ml-4 list-disc pl-1 text-[13px] leading-relaxed my-1">{elements}</li>;
      return <p key={lineIdx} className="text-[13px] leading-relaxed mb-2 last:mb-0">{elements}</p>;
    }).filter(Boolean);
  };

  // ── Panel sizing ──────────────────────────────────────────
  const ORB_SIZE  = 56;
  const isMobile  = typeof window !== 'undefined' && window.innerWidth < 640;
  const PANEL_W   = isMobile ? (typeof window !== 'undefined' ? window.innerWidth - 16 : 360) : 400;
  const PANEL_H   = isMobile ? 520 : 540;
  const viewport  = typeof window !== 'undefined' ? { w: window.innerWidth, h: window.innerHeight } : { w: 1200, h: 800 };

  const panelBottom = pos.y + ORB_SIZE + 12;
  let panelRight    = pos.x;
  if (viewport.w - pos.x - PANEL_W < 0) panelRight = viewport.w - PANEL_W - 8;

  // Quick reply chips — shown only when conversation is fresh
  const quickReplies = [
    '📊 What is P/E Ratio?',
    '🏦 Explain ZENITHBANK stock',
    '📈 How do dividends work?',
    '🚀 Best NGX stocks to watch?',
    '📉 What causes stock price to fall?',
    '💡 What is market cap?',
  ];

  return (
    <>
      {/* ── Floating Draggable Orb ───────────────────────── */}
      <button
        ref={orbRef}
        aria-label="Open AI assistant"
        onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
        onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        onClick={handleOrbClick}
        className="fixed z-40 p-0 rounded-full focus:outline-none group"
        style={{
          width:  `${ORB_SIZE}px`,
          height: `${ORB_SIZE}px`,
          right:  `${pos.x}px`,
          bottom: `${pos.y}px`,
          background: 'linear-gradient(135deg, #CFA343, #B58C35)',
          boxShadow: isChatOpen
            ? '0 0 30px rgba(207,163,67,0.6), 0 0 60px rgba(207,163,67,0.2)'
            : '0 0 20px rgba(207,163,67,0.4), 0 8px 30px rgba(0,0,0,0.5)',
          cursor: isDragging.current ? 'grabbing' : 'grab',
          transition: isDragging.current ? 'none' : 'box-shadow 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isChatOpen
          ? <ChevronDown className="h-5 w-5 text-[#0E0B14] pointer-events-none" />
          : <MessageSquare className="h-5 w-5 text-[#0E0B14] pointer-events-none" />
        }

        {/* Pulse ring */}
        {!isChatOpen && (
          <span className="absolute inset-0 rounded-full animate-ping pointer-events-none"
            style={{ background: 'rgba(207,163,67,0.2)' }} />
        )}

        {/* Online dot */}
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#0E0B14] pointer-events-none"
          style={{ background: '#10B981' }} />
      </button>

      {/* ── Chat Panel ──────────────────────────────────────── */}
      {isChatOpen && (
        <div
          className="fixed z-50 flex flex-col rounded-2xl overflow-hidden"
          style={{
            width:  `${Math.min(PANEL_W, viewport.w - 16)}px`,
            height: `${PANEL_H}px`,
            right:  `${panelRight}px`,
            bottom: `${panelBottom}px`,
            background: 'rgba(6, 20, 42, 0.98)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(207,163,67,0.18)',
            boxShadow: '0 0 0 1px rgba(207,163,67,0.05), 0 40px 80px rgba(0,0,0,0.85)',
            animation: 'chatSlideIn 0.25s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, #CFA343 40%, transparent)' }} />

          {/* ── Header ── */}
          <div
            className="px-4 py-3 flex items-center justify-between flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(207,163,67,0.07), rgba(8,29,56,0.5))', borderBottom: '1px solid rgba(207,163,67,0.1)' }}
          >
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}>
                  <Sparkles className="h-4 w-4 text-[#0E0B14]" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2"
                  style={{ background: '#10B981', borderColor: '#06142A' }} />
              </div>
              <div>
                <h4 className="text-[13px] font-bold font-sora text-white leading-none">EquityStack Assistant</h4>
                <span className="text-[9px] font-semibold uppercase tracking-widest mt-0.5 block" style={{ color: '#CFA343' }}>
                  NGX Intelligence · 🇳🇬
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => clearChat()}
                className="p-1.5 rounded-lg transition-all focus:outline-none"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                title="Clear chat"
                onMouseEnter={e => (e.currentTarget.style.color = '#CFA343')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 rounded-lg transition-all focus:outline-none"
                style={{ color: 'rgba(255,255,255,0.4)' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#FF4D4F')}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            className="flex-grow overflow-y-auto p-4 space-y-3 custom-scrollbar"
            style={{ background: 'rgba(4,12,28,0.5)' }}
          >
            {chatMessages.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={idx} className={`flex items-end gap-2 ${isAi ? '' : 'justify-end'}`}>
                  {isAi && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mb-0.5"
                      style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}
                    >
                      <Sparkles className="h-3 w-3 text-[#0E0B14]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] font-dm-sans ${isAi ? 'rounded-bl-sm' : 'rounded-br-sm'}`}
                    style={isAi
                      ? { background: 'rgba(8,29,56,0.9)', border: '1px solid rgba(207,163,67,0.1)', color: 'rgba(255,255,255,0.88)' }
                      : { background: 'linear-gradient(135deg, #CFA343, #B58C35)', color: '#0E0B14', fontWeight: 600 }
                    }
                  >
                    {isAi
                      ? <>{parseMarkdown(msg.text)}</>
                      : <p className="leading-snug">{msg.text}</p>
                    }
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isChatTyping && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}>
                  <Sparkles className="h-3 w-3 text-[#0E0B14]" />
                </div>
                <div className="rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5"
                  style={{ background: 'rgba(8,29,56,0.9)', border: '1px solid rgba(207,163,67,0.1)' }}>
                  {[0, 140, 280].map((delay) => (
                    <span key={delay} className="h-2 w-2 rounded-full animate-bounce"
                      style={{ background: '#CFA343', animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── Quick replies (shown when fresh) ── */}
          {chatMessages.length <= 1 && !isChatTyping && (
            <div
              className="px-3 py-2.5 flex flex-wrap gap-1.5 flex-shrink-0"
              style={{ background: 'rgba(4,12,28,0.7)', borderTop: '1px solid rgba(207,163,67,0.08)' }}
            >
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => sendChatMessage(q.replace(/^[^a-zA-Z]+/, '').trim())}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold transition-all focus:outline-none whitespace-nowrap"
                  style={{ background: 'rgba(207,163,67,0.08)', border: '1px solid rgba(207,163,67,0.18)', color: '#CFA343' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(207,163,67,0.16)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(207,163,67,0.08)'; }}
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* ── Disclaimer ── */}
          <div
            className="px-4 py-1.5 text-[9px] leading-relaxed font-dm-sans text-left flex-shrink-0"
            style={{ background: 'rgba(4,12,28,0.8)', borderTop: '1px solid rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.3)' }}
          >
            For educational &amp; research purposes only. Not financial advice.
          </div>

          {/* ── Input ── */}
          <form
            onSubmit={handleSend}
            className="p-3 flex gap-2 flex-shrink-0"
            style={{ background: 'rgba(4,12,28,0.95)', borderTop: '1px solid rgba(207,163,67,0.1)' }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask in simple Nigerian terms..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={isChatTyping}
              className="flex-grow px-4 py-2.5 rounded-xl text-[12px] font-semibold focus:ring-0 focus:outline-none text-white placeholder:text-white/30 disabled:opacity-50"
              style={{
                background: 'rgba(8,29,56,0.9)',
                border: '1px solid rgba(207,163,67,0.15)',
                transition: 'border-color 0.2s',
              }}
              onFocus={e => (e.target.style.borderColor = 'rgba(207,163,67,0.45)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(207,163,67,0.15)')}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isChatTyping}
              className="p-2.5 rounded-xl flex-shrink-0 focus:outline-none disabled:opacity-40 transition-opacity"
              style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 12px rgba(207,163,67,0.3)' }}
            >
              <Send className="h-4 w-4 text-[#0E0B14]" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes chatSlideIn {
          from { opacity: 0; transform: translateY(16px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
