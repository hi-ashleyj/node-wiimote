import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            fileName: "index",
            name: "vt220-interface"
        },
        minify: false,
        sourcemap: true,
        target: 'esnext'
    },
    plugins: [ dts({ include: "src", outDir: "dist" }) ],
    define: {
        '__MODULE_VERSION__': JSON.stringify(process.env.npm_package_version)
    }
});