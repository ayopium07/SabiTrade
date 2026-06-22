const fs = require('fs');

let pageContent = fs.readFileSync('src/app/page.tsx', 'utf8');
pageContent = pageContent.replace(
  "import TradePage from '@/components/TradePage';",
  "import TradePage from '@/components/TradePage';\nimport FeatureCards from '@/components/FeatureCards';"
);
pageContent = pageContent.replace(
  "          {/* ── How It Works / Steps Section ── */}",
  "          {/* ── Feature Cards ── */}\n          <FeatureCards />\n\n          {/* ── How It Works / Steps Section ── */}"
);
fs.writeFileSync('src/app/page.tsx', pageContent, 'utf8');

let aboutContent = fs.readFileSync('src/components/AboutUs.tsx', 'utf8');
aboutContent = aboutContent.replace(
  "import { Sparkles, Compass, Target, Users, X } from 'lucide-react';",
  "import { Sparkles, Compass, Target, Users, X } from 'lucide-react';\nimport FeatureCards from '@/components/FeatureCards';"
);
aboutContent = aboutContent.replace(
  "      {/* ── Team Section ──────────────────────────────────── */}",
  "      {/* ── Feature Cards ── */}\n      <FeatureCards />\n\n      {/* ── Team Section ──────────────────────────────────── */}"
);
fs.writeFileSync('src/components/AboutUs.tsx', aboutContent, 'utf8');
console.log('Updated both files!');
