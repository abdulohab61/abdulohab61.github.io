import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Nord color palette
        nord: {
          0: "#2e3440", // Polar Night
          1: "#3b4252",
          2: "#434c5e",
          3: "#4c566a",
          4: "#d8dee9", // Snow Storm
          5: "#e5e9f0",
          6: "#eceff4",
          7: "#8fbcbb", // Frost
          8: "#88c0d0",
          9: "#81a1c1",
          10: "#5e81ac",
          11: "#bf616a", // Aurora
          12: "#d08770",
          13: "#ebcb8b",
          14: "#a3be8c",
          15: "#b48ead",
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
