import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const __dirname = import.meta.dirname

// The site is served from "/" on the custom domain (heartsinbloom.co.uk) and
// from "/hearts-in-bloom/" on the temporary github.io address. The deployment
// workflow sets VITE_BASE; local development uses "/".
// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE || "/",
  plugins: [react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: true,
  },
});
