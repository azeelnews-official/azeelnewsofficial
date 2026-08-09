import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "rgb(var(--color-paper) / <alpha-value>)",
          dim: "rgb(var(--color-paper-dim) / <alpha-value>)",
        },
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        ink: {
          50: "#EEF1F6",
          100: "#D7DEE9",
          300: "rgb(var(--color-ink-300) / <alpha-value>)",
          600: "rgb(var(--color-ink-600) / <alpha-value>)",
          800: "rgb(var(--color-ink-800) / <alpha-value>)",
          900: "rgb(var(--color-ink-900) / <alpha-value>)",
          950: "#0B1220",
        },
        azeel: {
          DEFAULT: "#1B4DBF",
          light: "#3D6BE0",
          dark: "#123B99",
        },
        press: {
          DEFAULT: "#C41230",
          light: "#E0294A",
          dark: "#8F0C22",
        },
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        "hairline-dark": "#26304A",
      },
      fontFamily: {
        display: ["var(--font-display)", "var(--font-devanagari)", "Georgia", "serif"],
        body: ["var(--font-body)", "var(--font-devanagari)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "var(--font-devanagari)", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        masthead: "-0.02em",
        eyebrow: "0.14em",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
        marquee: "marquee 32s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
