import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      boxShadow: {
        glass: "0 20px 80px rgba(15, 23, 42, 0.35)",
        glow: "0 0 0 1px rgba(255,255,255,0.08), 0 24px 80px rgba(14, 165, 233, 0.24)",
      },
      backgroundImage: {
        pulse:
          "radial-gradient(circle at top, rgba(255,255,255,0.24), transparent 40%), linear-gradient(135deg, hsl(var(--theme-from)) 0%, hsl(var(--theme-via)) 48%, hsl(var(--theme-to)) 100%)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.6" },
          "70%, 100%": { transform: "scale(1.4)", opacity: "0" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        pulseRing: "pulseRing 1.5s ease-out infinite",
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Manrope'", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;
