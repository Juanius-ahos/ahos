import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { prerender } from "./plugins/prerender";

const DIR = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
    prerender(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(DIR, "src"),
    },
    dedupe: ["react", "react-dom"],
  },

  root: DIR,

  build: {
    outDir: path.resolve(DIR, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap: ["gsap"],
          vendor: ["react", "react-dom", "framer-motion"],
        },
      },
    },
  },
});
