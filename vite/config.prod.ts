import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
    base: "./",
    plugins: [ react(), tailwindcss() ],
    logLevel: "warn",
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "../src"),
        },
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: [ "phaser" ],
                },
            },
        },
        minify: "terser",
        terserOptions: {
            compress: {
                passes: 2,
            },
            mangle: true,
            format: {
                comments: false,
            },
        },
    },
});
