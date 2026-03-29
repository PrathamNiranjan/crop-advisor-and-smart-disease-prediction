/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        soil:    { DEFAULT: "#3d2b1f", light: "#6b4226", dark: "#1a0f08" },
        leaf:    { DEFAULT: "#2d6a4f", light: "#52b788", dark: "#1b4332" },
        harvest: { DEFAULT: "#f4a261", light: "#ffd166", dark: "#e76f51" },
        sky:     { DEFAULT: "#48cae4", light: "#90e0ef", dark: "#0096c7" },
        cream:   { DEFAULT: "#fefae0", soft: "#f8f4e3" },
        danger:  { DEFAULT: "#e63946", soft: "#ffd6d8" },
        warn:    { DEFAULT: "#f4a261", soft: "#fde8d5" },
        safe:    { DEFAULT: "#52b788", soft: "#d8f3dc" },
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "pulse-ring": "pulseRing 1.5s ease-in-out infinite",
        "leaf-float": "leafFloat 3s ease-in-out infinite",
        "shimmer":    "shimmer 1.5s infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulseRing: { "0%,100%": { transform: "scale(1)", opacity: 1 }, "50%": { transform: "scale(1.08)", opacity: 0.8 } },
        leafFloat: { "0%,100%": { transform: "translateY(0) rotate(-2deg)" }, "50%": { transform: "translateY(-8px) rotate(2deg)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [],
};
