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
        // Solarpunk color scheme
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#10b981", // Vibrant green
          light: "#22c55e",
          dark: "#059669",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#d97706", // Warm earth tone (amber)
          light: "#f59e0b",
          dark: "#b45309",
          foreground: "#ffffff",
        },
        accent: {
          yellow: "#fbbf24", // Sunny yellow
          blue: "#38bdf8", // Sky blue
          terracotta: "#e85d04",
        },
        earth: {
          cream: "#fef3c7",
          brown: "#78716c",
          sand: "#fef3c7",
        },
        forest: {
          DEFAULT: "#14532d", // Deep forest green for text
          light: "#166534",
        },
        card: {
          DEFAULT: "#ffffff",
          hover: "#fef9e7",
        },
        border: "#d4d4a8",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 2px 8px rgba(16, 185, 129, 0.1)",
        "soft-lg": "0 4px 16px rgba(16, 185, 129, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;
