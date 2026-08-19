/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070A0F",
        surface: "rgba(13, 19, 33, 0.75)",
        "surface-card": "rgba(16, 24, 40, 0.85)",
        "surface-card-hover": "rgba(22, 32, 54, 0.95)",
        gold: {
          light: "#FBE6B5",
          DEFAULT: "#DFB15B",
          dark: "#B8860B",
          glow: "rgba(223, 177, 91, 0.35)",
        },
        cyan: {
          accent: "#38EF7D",
          glow: "rgba(56, 239, 125, 0.35)",
        },
        crimson: {
          karma: "#FF4B4B",
          glow: "rgba(255, 75, 75, 0.35)",
        },
        border: {
          subtle: "rgba(223, 177, 91, 0.15)",
          bright: "rgba(223, 177, 91, 0.45)",
        }
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Cinzel", "serif"],
        sans: ["var(--font-outfit)", "Outfit", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      boxShadow: {
        "gold-glow": "0 0 25px rgba(223, 177, 91, 0.25)",
        "gold-glow-lg": "0 0 45px rgba(223, 177, 91, 0.45)",
        "cyan-glow": "0 0 25px rgba(56, 239, 125, 0.25)",
        "crimson-glow": "0 0 25px rgba(255, 75, 75, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 25s linear infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        }
      }
    },
  },
  plugins: [],
};
