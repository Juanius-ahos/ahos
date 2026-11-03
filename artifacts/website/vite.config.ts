import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const DIR = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: "/",
  root: DIR,
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(DIR, "src") },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: path.resolve(DIR, "dist"),
    emptyOutDir: true,
    sourcemap: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: { manualChunks: (id) => (id.includes("node_modules/react") || id.includes("node_modules/scheduler") ? "react" : undefined) },
    },
  },
  ssr: { noExternal: ["wouter"] },
});
