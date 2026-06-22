const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const regex = /const handleGuestNav = \([^)]+\) => \{[\s\S]*?setView\(targetView\);\s*\};/;
const replacement = `    const handleGuestNav = (targetView: 'landing' | 'onboarding' | 'home' | 'markets' | 'news' | 'portfolio' | 'profile' | 'stock-detail' | 'about' | 'learn' | 'community' | 'trade') => {
      if (targetView === 'about') {
        setView('about');
      } else {
        setAuthMode('signup');
        setIsAuthModalOpen(true);
      }
    };`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/page.tsx', content, 'utf8');
console.log('Fixed handleGuestNav');
