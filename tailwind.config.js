export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          dark: "#0d1f0d",
          deep: "#1a2e1a",
          medium: "#2d4a2d",
          light: "#4a7c4a",
          glow: "#6b9b6b",
        },
        arcane: {
          dark: "#0a1628",
          deep: "#132238",
          medium: "#1e3a5f",
          light: "#2d5a87",
          glow: "#4a9eff",
          mist: "#1a2d4a",
        },
        silver: {
          DEFAULT: "#c0c0c0",
          light: "#e8e8e8",
          dark: "#808080",
        },
        gold: {
          DEFAULT: "#c9a227",
          light: "#e8d48b",
          dark: "#8a6d1a",
        },
        cream: "#f5f2e8",
        emucon: {
          "text-primary": "#f0efe8",
          "text-secondary": "#b8b5a8",
          "text-muted": "#8a8778",
        },
        tavern: {
          wood: "#3d2817",
          woodLight: "#5c3d2e",
          woodDark: "#2a1a0f",
          parchment: "#f4e4bc",
          parchmentDark: "#d4c4a0",
          candleGlow: "#ffaa33",
          candleWarm: "#ff8800",
          ale: "#c9a227",
          leather: "#8b4513",
          stone: "#4a4a4a",
        },
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
      },
      keyframes: {
        "flame-dance": {
          "0%, 100%": { transform: "scaleY(1) translateY(0)" },
          "50%": { transform: "scaleY(1.1) translateY(-5px)" },
        },
        "flame-dance-delay": {
          "0%, 100%": { transform: "scaleY(1) translateY(-2px)" },
          "50%": { transform: "scaleY(1.2) translateY(-7px)" },
        },
        "flame-dance-slow": {
          "0%, 100%": { transform: "scaleY(1) translateY(-1px)" },
          "50%": { transform: "scaleY(1.15) translateY(-4px)" },
        },
      },
      animation: {
        "flame-dance": "flame-dance 2s ease-in-out infinite",
        "flame-dance-delay": "flame-dance-delay 2.5s ease-in-out infinite",
        "flame-dance-slow": "flame-dance-slow 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
