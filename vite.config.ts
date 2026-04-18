import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("scheduler")
            ) {
              return "react-core";
            }

            if (id.includes("lottie") || id.includes("framer-motion")) {
              return "motion";
            }

            if (id.includes("@supabase")) {
              return "supabase";
            }

            if (id.includes("@tanstack") || id.includes("react-router")) {
              return "routing-data";
            }

            if (
              id.includes("@radix-ui") ||
              id.includes("lucide-react") ||
              id.includes("sonner")
            ) {
              return "ui-kit";
            }

            if (
              id.includes("date-fns") ||
              id.includes("zod") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge") ||
              id.includes("class-variance-authority")
            ) {
              return "ui-utils";
            }

            return "vendor";
          }
        },
      },
    },
  },
  server: {
    port: 5173,
  },
});
