import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Current bundle intentionally exceeds Vite's default 500 kB warning limit.
    chunkSizeWarningLimit: 1500,
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.js",
    css: true,
    exclude: ["**/node_modules/**", "**/e2e/**"],
  },
});
