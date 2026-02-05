import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#10b981",
          light: "#22c55e",
          dark: "#059669",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#d97706",
          light: "#f59e0b",
          dark: "#b45309",
          foreground: "#ffffff",
        },
        accent: {
          yellow: "#fbbf24",
          blue: "#38bdf8",
          terracotta: "#e85d04",
        },
        earth: {
          cream: "#fafaf8",
          brown: "#78716c",
          sand: "#f5f5f0",
        },
        forest: {
          DEFAULT: "#14532d",
          light: "#166534",
        },
        card: {
          DEFAULT: "#ffffff",
          hover: "#fafafa",
        },
        border: "#e5e5e5",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-dm-serif-display)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)",
        "soft-lg": "0 4px 6px rgba(0,0,0,0.04), 0 10px 15px rgba(0,0,0,0.06)",
        "soft-xl": "0 10px 25px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.05)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-in-right": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "slide-in-right": "slide-in-right 0.3s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
