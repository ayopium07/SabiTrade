const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// 1. Fix the top-level block condition
content = content.replace("if (currentView === 'landing') {", "if (!user || currentView === 'landing' || currentView === 'about') {");

// 2. Fix handleGuestNav in the landing block
const oldGuestNav = `    const handleGuestNav = (targetView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade') => {
      if (!user) {
        loginUser('Nigerian Investor', 'investor@equitystack.ng');
        completeOnboarding();
      }
      setView(targetView);
    };`;
    
const newGuestNav = `    const handleGuestNav = (targetView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade') => {
      if (targetView === 'about') {
        setView('about');
      } else {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
      }
    };`;
content = content.replace(oldGuestNav, newGuestNav);

// 3. Wrap landing page body and inject FeatureCards
if (!content.includes("import FeatureCards")) {
    content = content.replace("import AboutUs from '@/components/AboutUs';", "import AboutUs from '@/components/AboutUs';\nimport FeatureCards from '@/components/FeatureCards';");
}

const heroStart = "{/* ── Hero Section ── */}";
const newHeroStart = `{currentView === 'about' ? (
          <AboutUs />
        ) : (
          <>
            {/* ── Hero Section ── */}`;
content = content.replace(heroStart, newHeroStart);

const pillarsStart = "{/* ── The 5 Pillars ── */}";
const newPillarsStart = `        {/* ── Feature Cards ── */}
          <FeatureCards />

          {/* ── The 5 Pillars ── */}`;
content = content.replace(pillarsStart, newPillarsStart);

const footerStart = `<div className="max-w-7xl mx-auto w-full z-10 text-center text-[10px] text-text-secondary font-medium font-dm-sans border-t border-border/40 py-5 px-5">`;
const newFooterStart = `          </>
        )}

        ${footerStart}`;
content = content.replace(footerStart, newFooterStart);

// Let's replace the first instance of \`{renderAuthModal()}\` (in the landing block) with \` \`
content = content.replace("{renderAuthModal()}", ""); 

fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log('Fixed page.tsx');
