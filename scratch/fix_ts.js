const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

const landingIndex = content.indexOf("if (currentView === 'landing') {");
if (landingIndex !== -1) {
  const endIndex = content.indexOf("  if (currentView === 'onboarding') {", landingIndex);
  let landingBlock = content.substring(landingIndex, endIndex);
  
  landingBlock = landingBlock.replace(/currentView === 'about'/g, "(currentView as string) === 'about'");
  landingBlock = landingBlock.replace(/currentView === 'markets'/g, "(currentView as string) === 'markets'");
  
  content = content.substring(0, landingIndex) + landingBlock + content.substring(endIndex);
  fs.writeFileSync('src/app/page.tsx', content, 'utf8');
  console.log('Fixed TypeScript errors');
} else {
  console.log('Landing block not found');
}
