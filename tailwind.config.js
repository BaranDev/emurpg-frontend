export default {  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
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
