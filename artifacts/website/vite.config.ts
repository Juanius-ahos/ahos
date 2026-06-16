import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",

  plugins: [
    react(),
    tailwindcss(),
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
