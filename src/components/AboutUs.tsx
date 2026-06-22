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
    image: '/Timilehin.jpg',
    color: '#CFA343',
    linkedin: 'https://linkedin.com',
    email: 'timilehinolaniyi193@gmail.com',
    icon: Award,
  },
  {
    name: 'Joshua Ayotope',
    role: 'Co-Founder & CTO',
    bio: 'A versatile tech innovator and systems architect with multi-disciplinary knowledge across different sectors. Joshua has worked closely with different sectors to build efficient technical solutions. At EquityStack, he translates complex market intelligence models into a production-ready web platform, directing the Sora AI logic implementation.',
    initials: 'JAA',
    image: '/Temisann.png',
    color: '#10B981',
    linkedin: 'https://linkedin.com',
    email: 'maceyjoshua07@gmail.com',
    icon: Code,
  },
];

interface AboutUsProps {
  onJoinClick?: () => void;
}

export default function AboutUs({ onJoinClick }: AboutUsProps) {
  const [activeMember, setActiveMember] = useState<typeof team[0] | null>(null);

  if (activeMember) {
    const IconComp = activeMember.icon;
    return (
      <div className="w-full max-w-5xl mx-auto px-5 sm:px-8 py-12 lg:py-20 font-dm-sans animate-in slide-in-from-bottom-8 duration-500 relative z-10">
        <button 
          onClick={() => setActiveMember(null)}
          className="group flex items-center gap-3 text-sm font-bold text-text-secondary hover:text-white transition-colors mb-12 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center bg-white/5 group-hover:bg-white/10 transition-colors shadow-sm">
            <ArrowRight className="h-4 w-4 rotate-180" />
          </div>
          Back to About Us
        </button>

        <div className="flex flex-col md:flex-row gap-10 md:gap-16 mb-16">
          {/* Picture top left */}
          <div className="w-full md:w-5/12 flex-shrink-0">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl" style={{ aspectRatio: '3/4' }}>
              <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: `linear-gradient(90deg, ${activeMember.color}, transparent)` }} />
              <img src={activeMember.image} alt={activeMember.name} className="w-full h-full object-cover object-top" />
            </div>
          </div>

          {/* Name and title right */}
          <div className="w-full md:w-7/12 flex flex-col justify-center">
            <div className="mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest border px-4 py-2 rounded-full mb-6"
                style={{ color: activeMember.color, borderColor: `${activeMember.color}30`, background: `${activeMember.color}10` }}>
                <IconComp className="h-4 w-4" />
                {activeMember.role}
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-sora tracking-tight leading-[1.1] mb-8">
                {activeMember.name}
              </h1>
              
              {/* Bio Below */}
              <div className="max-w-2xl">
                <p className="text-base sm:text-lg text-text-secondary/90 leading-[1.8] font-medium mb-10">
                  {activeMember.bio}
                </p>
              </div>
              
              {/* Social links */}
              <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-white/10">
                <a href={activeMember.linkedin} target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/10 text-sm font-bold text-white/80 hover:text-white hover:bg-white/5 transition-all shadow-sm">
                  <LinkedInIcon className="h-4 w-4" />
                  Connect on LinkedIn
                </a>
                <a href={`mailto:${activeMember.email}`}
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-sm font-bold text-bg-base transition-all shadow-lg hover:scale-[1.02]"
                  style={{ background: `linear-gradient(135deg, ${activeMember.color}, ${activeMember.color}CC)` }}>
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

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
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/30">
            <div className="max-w-2xl">
              <p className="text-[11px] font-extrabold text-brand-primary uppercase tracking-[0.2em] font-dm-sans mb-3">
                Leadership Team
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary font-sora leading-tight">
                Meet the Minds Building EquityStack
              </h2>
            </div>
            <Users className="h-10 w-10 text-border/50 hidden md:block" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member) => {
              const IconComp = member.icon;
              return (
                <button
                  key={member.name}
                  onClick={() => setActiveMember(member)}
                  className="group text-left rounded-[2rem] overflow-hidden border border-border/50 transition-all duration-500 hover:-translate-y-2 focus:outline-none relative"
                  style={{ background: 'rgba(8, 29, 56, 0.5)' }}
                >
                  {/* Subtle glowing border on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-[2rem]"
                    style={{ boxShadow: `inset 0 0 0 1px ${member.color}40`, background: `radial-gradient(circle at top right, ${member.color}15, transparent 50%)` }} />
                  
                  {/* Profile Image Area */}
                  <div className="relative w-full overflow-hidden bg-[#041226]" style={{ height: '420px' }}>
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover object-top transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-90"
                      style={{ display: 'block' }}
                    />
                    
                    {/* Dark gradient fade at the bottom of the image for text readability */}
                    <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(8, 29, 56, 1) 0%, transparent 100%)' }} />
                    
                    {/* Centered Hover CTA */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-black/20 backdrop-blur-[2px]">
                      <span className="px-6 py-3 rounded-full text-sm font-extrabold text-bg-base flex items-center gap-2 shadow-2xl translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                        style={{ background: member.color }}>
                        View Full Profile
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>

                  {/* Text Container */}
                  <div className="px-8 py-6 relative z-10 bg-[rgba(8,29,56,1)]">
                    <div className="flex flex-col gap-1.5">
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest"
                        style={{ color: member.color }}>
                        <IconComp className="h-3.5 w-3.5" />
                        {member.role}
                      </span>
                      <h4 className="text-2xl font-extrabold text-text-primary font-sora group-hover:text-white transition-colors">
                        {member.name}
                      </h4>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── 5. Bottom CTA ──────────────────────────────────── */}
        <div className="relative text-center mt-24 pb-12">
          
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-sora tracking-tight mb-6 leading-tight">
              Ready to Build <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CFA343] to-[#E5C06F]">Generational Wealth?</span>
            </h2>
            <p className="text-sm sm:text-base text-text-secondary/90 font-medium mb-10 max-w-xl">
              Join our exclusive beta program today. Start with a virtual ₦10,000,000 portfolio, access AI-powered market intelligence, and connect with a community of ambitious Nigerian investors.
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
