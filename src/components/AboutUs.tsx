import React, { useState } from 'react';
import { Target, Compass, Users, Code, Mail, Sparkles, Award, X, ArrowRight } from 'lucide-react';
import FeatureCards from './FeatureCards';

const LinkedInIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

// ─── Team Core Data ───────────────────────────────────────
const team = [
  {
    name: 'Timilehin Olaniyi',
    role: 'Founder & CEO',
    bio: 'A dynamic financial analyst and investment intelligence architect with extensive knowledge in investment banking. Currently working for one of the Big 4 professional services firms in Nigeria, he advises leading corporate portfolios. Timilehin is passionate about retail equity accessibility, and conceptualized EquityStack to build robust financial intelligence interfaces that speak the language of everyday retail investors.',
    initials: 'TO',
    image: '/ceo.jpeg',
    color: '#CFA343',
    linkedin: 'https://linkedin.com',
    email: 'timilehinolaniyi193@gmail.com',
    icon: Award,
  },
  {
    name: 'Joshua Ayotope',
    role: 'Co-Founder & CTO',
    bio: 'A versatile tech innovator and systems architect with multi-disciplinary knowledge across different sectors. Joshua has worked closely with different sectors to build efficient technical solutions. At EquityStack, he translates complex market intelligence models into a production-ready web platform, directing the EquityStack AI logic implementation.',
    initials: 'JAA',
    image: '/Ayofe.png',
    color: '#10B981',
    linkedin: 'https://linkedin.com',
    email: 'maceyjoshua07@gmail.com',
    icon: Code,
  },
  {
    name: 'Waliyullah "West" Adekunle',
    role: 'Co-Founder & COO / UI-UX Lead',
    bio: 'A Lagos-based web developer and product designer with deep expertise across Shopify, Framer, and WordPress ecosystems, West brings a rare blend of technical fluency and design sensibility to EquityStack. As Co-Founder and COO, he leads the platform\'s full UI-UX redesign — translating complex NGX market intelligence into a clean, intuitive experience across all core screens. His work draws on years of hands-on freelance experience building conversion-focused, e-commerce-grade web platforms for clients worldwide, giving EquityStack\'s product both technical rigor and real-world polish.',
    initials: 'WA',
    image: '/West.jpeg',
    color: '#00B8FF',
    linkedin: 'https://linkedin.com',
    email: 'west@equitystack.com',
    icon: Compass,
  },
];

interface AboutUsProps {
  onJoinClick?: () => void;
}

export default function AboutUs({ onJoinClick }: AboutUsProps) {
  const [activeMember, setActiveMember] = useState<typeof team[0]>(team[0]);



  return (
    <div className="w-full flex flex-col font-dm-sans -mt-8 relative z-10 pb-20">
      {/* ── 1. Hero Section ─────────────────────────────────── */}
      <div className="relative w-full p-8 sm:p-16 lg:p-24 text-center mb-16 overflow-visible">
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[400px] rounded-full pointer-events-none mix-blend-screen opacity-60"
          style={{ background: 'radial-gradient(ellipse, rgba(207,163,67,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full pointer-events-none mix-blend-screen opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, transparent 70%)' }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full pointer-events-none mix-blend-screen opacity-40"
          style={{ background: 'radial-gradient(circle, rgba(0,184,255,0.15) 0%, transparent 70%)' }} />
        
        {/* Content */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[0.2em] uppercase border border-brand-primary/20 text-brand-primary backdrop-blur-md"
            style={{ background: 'rgba(207,163,67,0.05)', boxShadow: '0 0 20px rgba(207,163,67,0.1)' }}>
            <Sparkles className="h-4 w-4" />
            <span>Behind EquityStack</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-text-primary font-sora tracking-tight leading-[1.1]"
            style={{ textShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            Empowering the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CFA343] to-[#F59E0B]">Next Generation</span> of Investors
          </h1>
          <p className="text-sm sm:text-lg text-text-secondary/90 leading-relaxed font-medium max-w-2xl mx-auto pt-2">
            EquityStack was born from a simple observation: Nigerian financial markets are full of compounding opportunities, but the raw data is wrapped in complex, intimidating jargon. We are here to bridge that gap.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-5 sm:px-8 space-y-24">
        
        {/* ── 2. Vision & Mission ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch relative">
          {/* Mission Section */}
          <div className="relative group">
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gain/10 border border-gain/20 p-4 rounded-2xl text-gain transition-transform duration-500">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-sora">Our Mission</h3>
              </div>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
                To translate intimidating financial structures into plain, actionable, and localized education — providing intelligent simulated portfolios and AI-powered answers that help users master asset evaluation, dividend compounding, and market analysis.
              </p>
            </div>
          </div>

          {/* Vision Section */}
          <div className="relative group lg:translate-y-12">
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-brand-primary/10 border border-brand-primary/20 p-4 rounded-2xl text-brand-primary transition-transform duration-500">
                  <Compass className="h-7 w-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary font-sora">Our Vision</h3>
              </div>
              <p className="text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
                To become the most accessible and trusted financial intelligence ecosystem across Sub-Saharan Africa — where every Nigerian can navigate the NGX confidently and build long-term generational wealth.
              </p>
            </div>
          </div>
        </div>

        {/* ── 3. Services / FeatureCards ──────────────────────────────── */}
        <div className="pt-12">
          <FeatureCards />
        </div>

        {/* ── 4. Team Section ──────────────────────────────────── */}
        <div className="space-y-16">
          <div className="text-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary font-sora tracking-tight leading-tight">
              Meet the Minds Building EquityStack
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-stretch md:items-start max-w-6xl mx-auto">
            {/* Left: Large Image */}
            <div className="w-full md:w-5/12 flex-shrink-0 animate-in fade-in zoom-in duration-500" key={activeMember.name + "-img"}>
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[3/4]">
                <img src={activeMember.image} alt={activeMember.name} className="w-full h-full object-cover object-top" />
              </div>
            </div>

            {/* Right: Info and Thumbnails */}
            <div className="w-full md:w-7/12 flex flex-col justify-between py-2 md:py-6 animate-in fade-in slide-in-from-right-8 duration-500" key={activeMember.name + "-info"}>
              <div>
                {/* 5 Stars */}
                <div className="flex gap-1 mb-8">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-[#CFA343] fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                {/* Bio */}
                <p className="text-lg sm:text-xl text-text-secondary leading-[1.8] font-medium mb-12 max-w-2xl">
                  "{activeMember.bio}"
                </p>

                {/* Name and Role */}
                <div className="mb-16">
                  <div className="w-12 h-1 mb-6 rounded-full" style={{ background: activeMember.color }}></div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sora mb-2">{activeMember.name}</h3>
                  <p className="text-text-secondary/80 font-medium tracking-wide uppercase text-sm">{activeMember.role}</p>
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex flex-wrap gap-4 md:gap-6 mt-auto">
                {team.map((member) => {
                  const isActive = activeMember.name === member.name;
                  return (
                    <button
                      key={member.name}
                      onClick={() => setActiveMember(member)}
                      className={`relative w-20 h-28 sm:w-28 sm:h-36 rounded-2xl overflow-hidden transition-all duration-300 ${
                        isActive 
                          ? 'scale-105 shadow-xl z-10' 
                          : 'opacity-50 hover:opacity-100 hover:scale-105'
                      }`}
                      style={{ 
                        boxShadow: isActive ? `0 0 0 4px #041226, 0 0 0 6px ${member.color}` : 'none'
                      }}
                    >
                      <img src={member.image} alt={member.name} className="w-full h-full object-cover object-top" />
                      {!isActive && <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── 5. Bottom CTA ──────────────────────────────────── */}
        <div className="relative text-center mt-24 pb-12">
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sora tracking-tight mb-6 leading-tight">
              Ready to Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CFA343] to-[#E5C06F]">Generational Wealth?</span>
            </h2>
            <p className="text-sm sm:text-base text-text-secondary/90 font-medium mb-10 max-w-xl">
              Join our exclusive beta program today. Start with a virtual ₦1,000,000 portfolio, access AI-powered market intelligence, and connect with a community of ambitious Nigerian investors.
            </p>
            <button
              onClick={onJoinClick}
              className="px-10 py-4 sm:px-12 sm:py-5 rounded-full text-sm sm:text-base font-extrabold text-bg-base flex items-center gap-3 transition-all focus:outline-none hover:scale-105 hover:shadow-[0_0_40px_rgba(207,163,67,0.4)]"
              style={{ background: 'linear-gradient(135deg, #CFA343, #B58C35)' }}
            >
              Join Beta Testing Now
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
