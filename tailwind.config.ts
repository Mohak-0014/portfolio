import type { Config } from "tailwindcss";

/**
 * Design system — "Personal World at Night"
 * Deep navy base, cool slate-grey midtones, moonlit off-white text,
 * one restrained cyan-teal accent for interactive / glowing elements.
 */
const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx,mdx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/sections/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // bright surfaces (light scale) — frosted-glass friendly
        ink: {
          900: "#FFFFFF", // on-accent text / lightest
          800: "#EEF3F8", // page background
          700: "#FFFFFF", // card base (used translucent for glass)
          600: "#D7E0EA", // hairline borders
        },
        // ink-on-light text greys
        slate: {
          400: "#7C8794", // captions / muted
          300: "#4F5B6B", // body secondary
          200: "#33404F", // strong secondary
        },
        moon: "#0F1B2D", // primary text (deep ink on light)
        // accent — emerald / teal
        accent: {
          DEFAULT: "#10B981", // emerald
          soft: "#0F9D8F", // teal
          glow: "#5EEAD4", // light mint glow
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      boxShadow: {
        glow: "0 0 50px -10px rgba(16, 185, 129, 0.45)",
        card: "0 20px 50px -24px rgba(15, 27, 45, 0.22)",
        glass: "0 8px 40px -12px rgba(15, 27, 45, 0.18)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        twinkle: "twinkle 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
