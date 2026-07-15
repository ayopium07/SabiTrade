'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0A0B0D] border-t border-white/5 mt-auto">
      {/* Main footer body */}
      <div className="max-w-[1400px] mx-auto px-8 py-14 grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">

        {/* ── Brand Column ── */}
        <div className="flex flex-col gap-5 pr-8">
          {/* Logo + Name */}
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded overflow-hidden flex-shrink-0">
              <img src="/EquityStack.jpeg" alt="EquityStack" className="h-full w-full object-cover mix-blend-screen" />
            </div>
            <span className="text-[15px] font-bold font-sora text-white tracking-tight">EquityStack</span>
          </div>

          {/* Tagline */}
          <p className="text-[12.5px] text-[#7B7E8E] leading-relaxed font-dm-sans">
            Africa's intelligence layer for capital markets. Built for Nigerian investors, by people who care about the market.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-1">
            {/* Instagram */}
            <a href="#" aria-label="Instagram" className="text-[#7B7E8E] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
            {/* Facebook */}
            <a href="#" aria-label="Facebook" className="text-[#7B7E8E] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.675 0h-21.35C.597 0 0 .597 0 1.325v21.351C0 23.403.597 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.597 1.323-1.325V1.325C24 .597 23.403 0 22.675 0z"/>
              </svg>
            </a>
            {/* Twitter/X */}
            <a href="#" aria-label="Twitter" className="text-[#7B7E8E] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="#" aria-label="YouTube" className="text-[#7B7E8E] hover:text-white transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.07 0 12 0 12s0 3.93.501 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* ── Platform Column ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[13px] font-bold text-white font-sora">Platform</h4>
          <ul className="flex flex-col gap-3">
            {['About', 'Careers', 'Blog', 'Legal & privacy'].map(item => (
              <li key={item}>
                <a href="#" className="text-[12.5px] text-[#7B7E8E] hover:text-white transition-colors font-dm-sans">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Markets Column ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[13px] font-bold text-white font-sora">Markets</h4>
          <ul className="flex flex-col gap-3">
            {['Applications', 'Buy Equities', 'Affiliate', 'Institutional Services'].map(item => (
              <li key={item}>
                <a href="#" className="text-[12.5px] text-[#7B7E8E] hover:text-white transition-colors font-dm-sans">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Company Column ── */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[13px] font-bold text-white font-sora">Company</h4>
          <ul className="flex flex-col gap-3">
            {['What is the Stock Market?', 'Market Basic', 'Tips and Tutorials', 'Market Update'].map(item => (
              <li key={item}>
                <a href="#" className="text-[12.5px] text-[#7B7E8E] hover:text-white transition-colors font-dm-sans">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* ── Bottom copyright bar ── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-8 py-4 flex items-center justify-center">
          <p className="text-[11px] text-[#4A4D5E] font-dm-sans text-center">
            © 2026 EquityStack · Nigerian Financial Intelligence Platform · MVP v1.0 · Strictly Confidential
          </p>
        </div>
      </div>
    </footer>
  );
}
