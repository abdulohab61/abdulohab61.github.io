import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/", // Main site root
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
