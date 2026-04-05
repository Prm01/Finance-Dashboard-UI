import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react") || id.includes("react-dom") || id.includes("react-router-dom")) {
              return "vendor-react";
            }
            if (id.includes("recharts") || id.includes("framer-motion")) {
              return "vendor-ui";
            }
            return "vendor";
          }

          if (id.includes(path.resolve(__dirname, "src/pages"))) {
            const name = path.basename(id, path.extname(id));
            return `page-${name.toLowerCase()}`;
          }
        },
      },
    },
  },
});

