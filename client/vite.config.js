import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig(({ command }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      // allow serving files from project root and client folder
      allow: [path.resolve(__dirname), path.resolve(__dirname, "./")],
    },
  },
  build: { outDir: "dist/spa" },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@shared": path.resolve(__dirname, "../server/shared"),
    },
  },
}));
