import React, { useState } from 'react';
import { Target, Compass, Users, Code, Mail, Sparkles, Award, X } from 'lucide-react';

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

export default function AboutUs() {
  const [activeMember, setActiveMember] = useState<typeof team[0] | null>(null);

  return (
    <div className="space-y-10">

      {/* ── Header / Hero ─────────────────────────────────── */}
      <div className="relative rounded-3xl overflow-hidden border border-brand-primary/10 p-6 sm:p-10 text-center"
        style={{ background: 'linear-gradient(145deg, #081D38 0%, #041226 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.08) 0%, transparent 70%)' }} />
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #CFA343, transparent)' }} />
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-brand-primary/20 text-brand-primary"
            style={{ background: 'rgba(207,163,67,0.08)' }}>
            <Sparkles className="h-3.5 w-3.5" />
            <span>Behind EquityStack</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary font-sora tracking-tight">
            Our Story &amp; Philosophy
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
            EquityStack was born from a simple observation: Nigerian financial markets are full of compounding opportunities, but the raw data is wrapped in complex, intimidating jargon. We are here to bridge that gap.
          </p>
        </div>
      </div>

      {/* ── Vision & Mission ──────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-brand-primary/30"
          style={{ background: 'linear-gradient(145deg, #081D38, #041226)', border: '1px solid #11325D' }}>
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(207,163,67,0.05) 0%, transparent 70%)' }} />
          <div className="flex items-center gap-3.5 mb-4">
            <div className="bg-brand-primary/10 border border-brand-primary/25 p-2.5 rounded-xl text-brand-primary">
              <Compass className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-text-primary font-sora">Our Vision</h3>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
            To become the most accessible and trusted financial intelligence ecosystem across Sub-Saharan Africa — where every Nigerian can navigate the NGX confidently and build long-term generational wealth.
          </p>
        </div>

        <div className="p-6 rounded-2xl relative overflow-hidden transition-all duration-300 hover:border-gain/30"
          style={{ background: 'linear-gradient(145deg, #081D38, #041226)', border: '1px solid #11325D' }}>
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)' }} />
          <div className="flex items-center gap-3.5 mb-4">
            <div className="bg-gain/10 border border-gain/25 p-2.5 rounded-xl text-gain">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="text-base font-extrabold text-text-primary font-sora">Our Mission</h3>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
            To translate intimidating financial structures into plain, actionable, and localized education — providing intelligent simulated portfolios and AI-powered answers that help users master asset evaluation, dividend compounding, and market analysis.
          </p>
        </div>
      </div>

      {/* ── Team Section ──────────────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <p className="text-[10px] font-extrabold text-text-secondary uppercase tracking-widest font-dm-sans">
              Leadership Team
            </p>
            <h2 className="text-lg font-bold text-text-primary font-sora mt-0.5">Meet the Minds Building EquityStack</h2>
          </div>
          <Users className="h-5 w-5 text-brand-primary" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {team.map((member) => {
            const IconComp = member.icon;
            return (
              <button
                key={member.name}
                onClick={() => setActiveMember(member)}
                className="group text-left rounded-2xl overflow-hidden border border-border transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/30 focus:outline-none"
                style={{ background: 'linear-gradient(145deg, #081D38, #041226)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 16px 40px ${member.color}18`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                }}
              >
                {/* Profile image — object-top keeps faces visible */}
                <div className="relative w-full overflow-hidden" style={{ height: '360px' }}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    style={{ display: 'block' }}
                  />
                  {/* Subtle bottom fade into card footer only */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, #081D38 0%, transparent 100%)' }}
                  />
                  {/* Hover CTA chip */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 shadow-lg"
                      style={{ background: member.color }}
                    >
                      View Profile
                    </span>
                  </div>
                </div>

                {/* Name / Role strip */}
                <div className="px-5 py-4 relative">
                  {/* Coloured top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-0.5"
                    style={{ background: `linear-gradient(90deg, ${member.color}, transparent)` }} />
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: member.color }}>
                    <IconComp className="h-3 w-3" />
                    {member.role}
                  </span>
                  <h4 className="text-sm font-extrabold text-text-primary font-sora group-hover:text-brand-primary transition-colors">
                    {member.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Profile Modal ─────────────────────────────────── */}
      {activeMember && (
        <div
          onClick={() => setActiveMember(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(18px)' }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl rounded-3xl overflow-hidden flex flex-row"
            style={{
              background: '#081D38',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
              minHeight: '420px',
            }}
          >
            {/* Colour accent top bar */}
            <div className="absolute top-0 left-0 right-0 h-1 z-10"
              style={{ background: `linear-gradient(90deg, ${activeMember.color}, #B58C35)` }} />

            {/* Close button */}
            <button
              onClick={() => setActiveMember(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full transition-all focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)';
                (e.currentTarget as HTMLButtonElement).style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              <X className="h-4 w-4" />
            </button>

            {/* Left — profile image */}
            <div className="w-2/5 flex-shrink-0 overflow-hidden">
              <img
                src={activeMember.image}
                alt={activeMember.name}
                className="w-full h-full object-cover object-top"
                style={{ display: 'block', minHeight: '420px' }}
              />
            </div>

            {/* Right — bio content */}
            <div className="flex-1 p-6 sm:p-8 space-y-5 overflow-y-auto">
              <div>
                <span
                  className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest border px-2.5 py-0.5 rounded-full mb-2"
                  style={{ color: activeMember.color, borderColor: `${activeMember.color}40`, background: `${activeMember.color}0D` }}
                >
                  {activeMember.role}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary font-sora tracking-tight">
                  {activeMember.name}
                </h3>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                {activeMember.bio}
              </p>

              {/* Social links */}
              <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                <a
                  href={activeMember.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border/60 text-xs font-bold text-text-secondary hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all focus:outline-none"
                >
                  <LinkedInIcon className="h-4 w-4" />
                  LinkedIn
                </a>
                <a
                  href={`mailto:${activeMember.email}`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-border/60 text-xs font-bold text-text-secondary hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all focus:outline-none"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
