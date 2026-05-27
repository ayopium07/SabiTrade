import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark base surfaces (Deep luxurious Indigo)
        "bg-base":    "#070615",
        "bg-surface": "#0E0D25",
        "bg-raised":  "#16153B",
        "bg-hover":   "#211F54",

        // Brand — elegant indigo identity
        "brand-primary":       "#6366F1",
        "brand-primary-dim":   "#4F46E5",
        "brand-primary-glow":  "rgba(99,102,241,0.15)",
        "brand-primary-dark":  "#1E1B4B",

        // Accent
        "brand-accent": "#818CF8",

        // Text
        "text-primary":   "#FFFFFF",
        "text-secondary": "#94A3B8",
        "text-muted":     "#475569",

        // Border
        "border":         "#23214C",
        "border-bright":  "#3B388D",

        // Semantic
        danger:  "#FF4D4D",
        warning: "#FFB800",
        info:    "#00B8FF",
        gain:    "#10B981", // Emerald green strictly for stock gainers/increases

        // Legacy (kept for compat)
        background: "#070615",
        foreground:  "#FFFFFF",
      },

      fontFamily: {
        sora:     ["var(--font-sora)", "sans-serif"],
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
      },

      boxShadow: {
        "glow-indigo": "0 0 20px rgba(99,102,241,0.25), 0 0 60px rgba(99,102,241,0.08)",
        "glow-indigo-sm": "0 0 10px rgba(99,102,241,0.2)",
        "glow-indigo-lg": "0 0 40px rgba(99,102,241,0.3), 0 0 100px rgba(99,102,241,0.1)",
        "glow-green":  "0 0 20px rgba(16,185,129,0.25), 0 0 60px rgba(16,185,129,0.08)",
        "glow-green-sm": "0 0 10px rgba(16,185,129,0.2)",
        "glow-green-lg": "0 0 40px rgba(16,185,129,0.3), 0 0 100px rgba(16,185,129,0.1)",
        "glow-red":    "0 0 20px rgba(255,77,77,0.25)",
        "card":        "0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
        "card-hover":  "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
        "nav":         "0 8px 32px rgba(0,0,0,0.6), inset 0 -1px 0 rgba(99,102,241,0.08)",
      },

      backgroundImage: {
        "gradient-green":      "linear-gradient(135deg, #10B981 0%, #059669 100%)", // strictly for gainers
        "gradient-indigo":     "linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)", // core buttons/branding
        "gradient-dark-indigo":"linear-gradient(135deg, #070615 0%, #0E0D25 100%)",
        "gradient-card":       "linear-gradient(145deg, #0E0D25 0%, #070615 100%)",
        "gradient-glow":       "radial-gradient(ellipse at top, rgba(99,102,241,0.06) 0%, transparent 60%)",
        "gradient-hero":       "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(99,102,241,0.08) 0%, transparent 70%)",
      },

      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 8px rgba(99,102,241,0.4)" },
          "50%":       { opacity: "0.7", boxShadow: "0 0 20px rgba(99,102,241,0.8)" },
        },
        "ticker-left": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "number-pop": {
          "0%":   { transform: "scale(0.92)", opacity: "0.5" },
          "100%": { transform: "scale(1)",    opacity: "1" },
        },
        "border-glow": {
          "0%, 100%": { borderColor: "rgba(99,102,241,0.2)" },
          "50%":      { borderColor: "rgba(99,102,241,0.6)" },
        },
      },

      animation: {
        shimmer:       "shimmer 1.5s infinite",
        "pulse-glow":  "pulse-glow 2.5s ease-in-out infinite",
        "ticker-left": "ticker-left 30s linear infinite",
        float:         "float 4s ease-in-out infinite",
        "fade-up":     "fade-up 0.4s ease-out both",
        "number-pop":  "number-pop 0.3s ease-out both",
        "border-glow": "border-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
