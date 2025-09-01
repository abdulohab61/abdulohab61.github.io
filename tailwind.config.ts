import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx,html}"],
  theme: {
    extend: {
      colors: {
        // Nord color palette
        nord: {
          0: "#2e3440", // Polar Night - Dark
          1: "#3b4252", // Polar Night
          2: "#434c5e", // Polar Night
          3: "#4c566a", // Polar Night - Light
          4: "#d8dee9", // Snow Storm - Dark
          5: "#e5e9f0", // Snow Storm
          6: "#eceff4", // Snow Storm - Light
          7: "#8fbcbb", // Frost - Teal
          8: "#88c0d0", // Frost - Blue
          9: "#81a1c1", // Frost - Light Blue
          10: "#5e81ac", // Frost - Dark Blue
          11: "#bf616a", // Aurora - Red
          12: "#d08770", // Aurora - Orange
          13: "#ebcb8b", // Aurora - Yellow
          14: "#a3be8c", // Aurora - Green
          15: "#b48ead", // Aurora - Purple
        },
      },
      fontFamily: {
        mono: ["Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
