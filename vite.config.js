import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
export default defineConfig({
    plugins: [react()],
    base: "/",
    server: {
        host: "0.0.0.0",
        port: 2052,
    },
    build: {
        chunkSizeWarningLimit: 3000,
        rollupOptions: {
            input: "./src/main.tsx",
        },
    },
});
