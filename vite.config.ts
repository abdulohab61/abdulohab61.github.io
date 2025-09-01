import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  base: "/open-bookmarks-homepage/", // Your GitHub repository name
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
});
