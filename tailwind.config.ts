import type { Config } from "tailwindcss";

const config: Config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blush:   "#F7E8E8",
          rose:    "#C9748A",
          "rose-dark": "#A85970",
          "rose-light": "#EEC5CF",
          gold:    "#C9A96E",
          "gold-light": "#F0DDB8",
          ink:     "#1A1A2E",
          mist:    "#F5F5F7",
          slate:   "#6B7280",
          border:  "#E8DDD9",
        },
      },
      fontFamily: {
        serif:  ["Playfair Display", "Georgia", "serif"],
        sans:   ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },
      boxShadow: {
        card:     "0 2px 16px 0 rgba(201,116,138,0.08), 0 1px 4px 0 rgba(0,0,0,0.04)",
        "card-hover": "0 8px 32px 0 rgba(201,116,138,0.18), 0 2px 8px 0 rgba(0,0,0,0.06)",
        drawer:   "-8px 0 48px 0 rgba(26,26,46,0.12)",
        popover:  "0 8px 32px 0 rgba(26,26,46,0.12)",
      },
      borderRadius: {
        "4xl": "2rem",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to:   { transform: "translateX(0)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        "badge-pop": {
          "0%":   { transform: "scale(1)" },
          "40%":  { transform: "scale(1.45)" },
          "70%":  { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)" },
        },
        "heart-beat": {
          "0%":   { transform: "scale(1)" },
          "25%":  { transform: "scale(1.3)" },
          "50%":  { transform: "scale(0.95)" },
          "75%":  { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0", visibility: "hidden" },
        },
        "scale-x": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "50%": { transform: "scaleX(1)", transformOrigin: "left" },
          "50.1%": { transform: "scaleX(1)", transformOrigin: "right" },
          "100%": { transform: "scaleX(0)", transformOrigin: "right" },
        },
        "reel-slide": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        }
      },
      animation: {
        "fade-in":       "fade-in 0.35s ease forwards",
        "slide-up":      "slide-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-in-right":"slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) forwards",
        shimmer:         "shimmer 1.6s linear infinite",
        "badge-pop":     "badge-pop 0.4s cubic-bezier(0.36,0.07,0.19,0.97)",
        "heart-beat":    "heart-beat 0.45s ease-in-out",
        "spin-slow":     "spin-slow 1s linear infinite",
        marquee:         "marquee 20s linear infinite",
        "fade-out":      "fade-out 0.5s ease-out forwards",
        "scale-x":       "scale-x 1.5s ease-in-out infinite",
        "reel-slide":    "reel-slide 40s linear infinite",
      },
      backgroundImage: {
        shimmer:
          "linear-gradient(90deg, #f0e8e8 25%, #faf0f0 50%, #f0e8e8 75%)",
        "hero-gradient":
          "linear-gradient(135deg, #F7E8E8 0%, #fff8f5 50%, #F5F5F7 100%)",
      },
      backgroundSize: {
        shimmer: "800px 100%",
      },
      aspectRatio: {
        "product": "3 / 4",
        "hero":    "16 / 9",
        "square":  "1 / 1",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
