import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/metronic8/react/demo1/",
  build: {
    chunkSizeWarningLimit: 3000,
    rollupOptions: {
      input: "./src/main.tsx",
    },
  },
});
