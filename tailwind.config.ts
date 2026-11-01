import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          // Neutral tokens flip with the .dark class (see globals.css)
          bg: "var(--cyber-bg)",
          darker: "var(--cyber-darker)",
          card: "var(--cyber-card)",
          glass: "var(--cyber-glass)",
          border: "var(--cyber-border)",
          muted: "var(--cyber-muted)",
          text: "var(--cyber-text)",
          // Accent tokens stay constant across themes
          cyan: "#DC2626",
          violet: "#EA580C",
          pink: "#D97706",
          neon: "#DC2626",
        },
        // Zinc scale is theme-driven via CSS variables
        zinc: {
          50: "rgb(var(--zinc-50) / <alpha-value>)",
          100: "rgb(var(--zinc-100) / <alpha-value>)",
          200: "rgb(var(--zinc-200) / <alpha-value>)",
          300: "rgb(var(--zinc-300) / <alpha-value>)",
          400: "rgb(var(--zinc-400) / <alpha-value>)",
          500: "rgb(var(--zinc-500) / <alpha-value>)",
          600: "rgb(var(--zinc-600) / <alpha-value>)",
          700: "rgb(var(--zinc-700) / <alpha-value>)",
          800: "rgb(var(--zinc-800) / <alpha-value>)",
          900: "rgb(var(--zinc-900) / <alpha-value>)",
          950: "rgb(var(--zinc-950) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-space-grotesk)", "sans-serif"],
        fairplay: ["var(--font-playfair)", "serif"],
      },
      boxShadow: {
        "cyan-glow": "0 4px 20px var(--glow-cyan)",
        "violet-glow": "0 4px 20px var(--glow-violet)",
        "pink-glow": "0 4px 20px var(--glow-pink)",
        "glass": "0 8px 32px 0 var(--shadow-glass)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "cyber-grid": "linear-gradient(to right, var(--grid-line) 1px, transparent 1px), linear-gradient(to bottom, var(--grid-line) 1px, transparent 1px)",
        "neon-gradient": "linear-gradient(135deg, #DC2626 0%, #EA580C 100%)",
      },
      animation: {
        "pulse-glow": "pulseGlow 3s infinite ease-in-out",
        "gradient-shift": "gradientShift 8s ease infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        pulseGlow: {
          "0%, 100%": { opacity: "0.4", filter: "blur(20px)" },
          "50%": { opacity: "0.8", filter: "blur(30px)" },
        },
        gradientShift: {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
