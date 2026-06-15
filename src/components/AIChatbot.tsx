import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageSquare, X, Send, Sparkles, Bot } from 'lucide-react';
import { useAppStore } from '@/lib/store';

export default function AIChatbot() {
  const isChatOpen    = useAppStore((s) => s.isChatOpen);
  const isChatTyping  = useAppStore((s) => s.isChatTyping);
  const chatMessages  = useAppStore((s) => s.chatMessages);
  const toggleChat    = useAppStore((s) => s.toggleChat);
  const sendChatMessage = useAppStore((s) => s.sendChatMessage);
  const clearChat     = useAppStore((s) => s.clearChat);

  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // ── Drag state ────────────────────────────────────────────
  // Start anchored at bottom-right (default position)
  const [pos, setPos] = useState({ x: 24, y: 24 }); // distance from bottom-right
  const isDragging  = useRef(false);
  const hasDragged  = useRef(false);           // distinguish drag vs click
  const dragStart   = useRef({ mx: 0, my: 0, bx: 0, by: 0 });
  const orbRef      = useRef<HTMLButtonElement | null>(null);

  // Scroll chat to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatTyping]);

  // ── Drag handlers ─────────────────────────────────────────
  const onDragMove = useCallback((clientX: number, clientY: number) => {
    if (!isDragging.current) return;
    const dx = clientX - dragStart.current.mx;
    const dy = clientY - dragStart.current.my;

    // If moved more than 4px in any direction, mark as a real drag
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) hasDragged.current = true;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const SIZE = 56; // orb diameter

    // Convert from bottom-right anchor → absolute coords → clamp → back to bottom-right
    let newX = dragStart.current.bx - dx; // subtract because anchor is from right
    let newY = dragStart.current.by - dy; // subtract because anchor is from bottom

    newX = Math.max(8, Math.min(newX, W - SIZE - 8));
    newY = Math.max(8, Math.min(newY, H - SIZE - 8));

    setPos({ x: newX, y: newY });
  }, []);

  const onDragEnd = useCallback(() => {
    isDragging.current = false;
    document.body.style.userSelect = '';
    document.body.style.cursor = '';
  }, []);

  // Mouse
  const onMouseMove = useCallback((e: MouseEvent) => onDragMove(e.clientX, e.clientY), [onDragMove]);
  const onMouseUp   = useCallback(() => onDragEnd(), [onDragEnd]);

  // Touch
  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging.current) return; // don't block page scroll when not dragging
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
    // Only fire toggle if the user didn't drag
    if (!hasDragged.current) toggleChat();
  };

  // ── Chat helpers ──────────────────────────────────────────
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) { sendChatMessage(inputText.trim()); setInputText(''); }
  };

  const handleClose = () => {
    toggleChat();
    setTimeout(() => clearChat(), 300);
  };

  const parseMarkdown = (text: string) => {
    return text.split('\n').map((line, lineIdx) => {
      const isBullet = line.startsWith('* ') || line.startsWith('- ');
      const content  = isBullet ? line.substring(2) : line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts: (string | React.ReactElement)[] = [];
      let lastIndex = 0, match;
      while ((match = boldRegex.exec(content)) !== null) {
        if (match.index > lastIndex) parts.push(content.substring(lastIndex, match.index));
        parts.push(<strong key={match.index} className="font-extrabold text-brand-primary">{match[1]}</strong>);
        lastIndex = boldRegex.lastIndex;
      }
      if (lastIndex < content.length) parts.push(content.substring(lastIndex));
      const elements = parts.length > 0 ? parts : content;
      if (isBullet) return <li key={lineIdx} className="ml-4 list-disc pl-1 text-[13px] leading-relaxed my-1">{elements}</li>;
      return <p key={lineIdx} className="text-[13px] leading-relaxed mb-2 last:mb-0">{elements}</p>;
    });
  };

  // Chat panel position — opens above/beside the orb
  const PANEL_W   = 380;
  const PANEL_H   = 500;
  const ORB_SIZE  = 56;
  const viewport  = typeof window !== 'undefined' ? { w: window.innerWidth, h: window.innerHeight } : { w: 1200, h: 800 };

  // Panel sits above orb; if too high, flip to below
  const panelBottom = pos.y + ORB_SIZE + 12;
  let panelRight  = pos.x;

  // If panel would overflow left, shift it
  if (viewport.w - pos.x - PANEL_W < 0) {
    panelRight = viewport.w - PANEL_W - 8;
  }

  return (
    <>
      {/* ── Floating Draggable Orb ───────────────────────── */}
      <button
        ref={orbRef}
        aria-label="Open AI assistant"
        onMouseDown={(e) => { e.preventDefault(); startDrag(e.clientX, e.clientY); }}
        onTouchStart={(e) => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        onClick={handleOrbClick}
        className="fixed z-40 p-0 rounded-full focus:outline-none"
        style={{
          width:  `${ORB_SIZE}px`,
          height: `${ORB_SIZE}px`,
          right:  `${pos.x}px`,
          bottom: `${pos.y}px`,
          background: 'linear-gradient(135deg, #CFA343, #B58C35)',
          boxShadow: isChatOpen
            ? '0 0 30px rgba(207,163,67,0.5), 0 0 60px rgba(207,163,67,0.2)'
            : '0 0 20px rgba(207,163,67,0.35), 0 8px 30px rgba(0,0,0,0.5)',
          cursor: isDragging.current ? 'grabbing' : 'grab',
          transition: isDragging.current ? 'none' : 'box-shadow 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MessageSquare className="h-5 w-5 text-bg-base pointer-events-none" />

        {/* Pulse ring */}
        {!isChatOpen && (
          <span className="absolute inset-0 rounded-full animate-ping pointer-events-none"
            style={{ background: 'rgba(207,163,67,0.2)' }} />
        )}

        {/* Online dot */}
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg-base pointer-events-none"
          style={{ background: '#10B981' }} />

        {/* Drag hint tooltip — shows briefly on first hover */}
        <span
          className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-text-secondary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity px-2 py-0.5 rounded-lg"
          style={{ background: 'rgba(8,29,56,0.9)', border: '1px solid #11325D' }}
        >
          drag me
        </span>
      </button>

      {/* ── Chat Panel ──────────────────────────────────────── */}
      {isChatOpen && (
        <div
          className="fixed z-50 flex flex-col rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-250"
          style={{
            width:  `${Math.min(PANEL_W, viewport.w - 16)}px`,
            height: `${PANEL_H}px`,
            right:  `${panelRight}px`,
            bottom: `${panelBottom}px`,
            background: 'rgba(8, 29, 56, 0.97)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(207,163,67,0.15)',
            boxShadow: '0 0 0 1px rgba(207,163,67,0.04), 0 40px 80px rgba(0,0,0,0.8)',
          }}
        >
          {/* Top gradient border */}
          <div className="absolute top-0 left-0 right-0 h-px pointer-events-none"
            style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)' }} />

          {/* Header */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-border/60 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, rgba(207,163,67,0.06), transparent)' }}>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="bg-brand-primary/15 border border-brand-primary/25 p-1.5 rounded-lg">
                  <Bot className="h-4 w-4 text-brand-primary" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-bg-base"
                  style={{ background: '#10B981' }} />
              </div>
              <div>
                <h4 className="text-sm font-bold font-sora text-text-primary">EquityStack Assistant</h4>
                <span className="text-[9px] font-semibold text-brand-primary uppercase tracking-widest block font-dm-sans">
                  NGX Intelligence · 🇳🇬
                </span>
              </div>
            </div>
            <button onClick={handleClose}
              className="text-text-secondary hover:text-danger bg-bg-hover hover:bg-danger/10 p-1.5 rounded-lg transition-all focus:outline-none">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar"
            style={{ background: 'rgba(7,6,21,0.4)' }}>
            {chatMessages.map((msg, idx) => {
              const isAi = msg.sender === 'ai';
              return (
                <div key={idx} className={`flex items-start gap-2.5 ${isAi ? '' : 'justify-end'}`}>
                  {isAi && (
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-bg-base flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}>
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl p-3 text-xs font-dm-sans ${
                    isAi ? 'rounded-tl-none text-text-primary/90' : 'rounded-tr-none text-bg-base'
                  }`}
                    style={isAi
                      ? { background: 'rgba(8,29,56,0.9)', border: '1px solid rgba(207,163,67,0.1)' }
                      : { background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 12px rgba(207,163,67,0.25)' }
                    }>
                    {isAi
                      ? parseMarkdown(msg.text)
                      : <p className="text-[13px] font-medium leading-normal">{msg.text}</p>
                    }
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isChatTyping && (
              <div className="flex items-start gap-2.5">
                <div className="h-7 w-7 rounded-full flex items-center justify-center text-bg-base flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}>
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-tl-none p-3 flex items-center gap-1.5 h-9"
                  style={{ background: 'rgba(8,29,56,0.9)', border: '1px solid rgba(207,163,67,0.1)' }}>
                  {[0, 150, 300].map((delay) => (
                    <span key={delay} className="h-1.5 w-1.5 rounded-full animate-bounce"
                      style={{ background: '#CFA343', animationDelay: `${delay}ms` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Quick replies */}
          {chatMessages.length === 1 && !isChatTyping && (
            <div className="px-3 py-2 border-t border-border/40 flex flex-wrap gap-1.5 flex-shrink-0"
              style={{ background: 'rgba(7,6,21,0.6)' }}>
              {['What is P/E Ratio? 📊', 'How do I start? 🚀', 'What is NGX? 🏢'].map((q) => (
                <button key={q}
                  onClick={() => sendChatMessage(q.replace(/ [^\w\s]/g, '').trim())}
                  className="px-2.5 py-1 rounded-full text-[10px] font-extrabold text-brand-primary transition-all focus:outline-none"
                  style={{ background: 'rgba(207,163,67,0.08)', border: '1px solid rgba(207,163,67,0.2)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(207,163,67,0.15)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(207,163,67,0.08)')}>
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Disclaimer */}
          <div className="px-4 py-2 border-t border-border/40 text-[9px] text-text-secondary leading-relaxed font-dm-sans bg-bg-base/40 text-left">
            This information is for educational and research purposes only and should not be considered financial advice.
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-border/40 flex gap-2 flex-shrink-0"
            style={{ background: 'rgba(7,6,21,0.8)' }}>
            <input
              type="text"
              placeholder="Ask in simple Nigerian terms..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-grow px-3.5 py-2 rounded-xl text-xs font-semibold focus:ring-0 focus:outline-none text-text-primary placeholder:text-text-secondary"
              style={{ background: 'rgba(8,29,56,0.8)', border: '1px solid rgba(207,163,67,0.12)' }}
              onFocus={e => (e.target.style.borderColor = 'rgba(207,163,67,0.35)')}
              onBlur={e => (e.target.style.borderColor = 'rgba(207,163,67,0.12)')}
            />
            <button type="submit"
              className="p-2 rounded-xl text-bg-base focus:outline-none flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)', boxShadow: '0 0 10px rgba(207,163,67,0.3)' }}>
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
