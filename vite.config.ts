import { defineConfig } from "vite";
import vite_dts from "vite-plugin-dts";
import { builtinModules } from "node:module";

export default defineConfig({
    build: {
        lib: {
            entry: "src/index.ts",
            fileName: "index",
            name: "node-wiimote",
            formats: [ "es" ]
        },
        minify: false,
        sourcemap: true,
        target: "node16",
        
        emptyOutDir: true,
        rollupOptions: {
            external: [
                ...builtinModules,
                ...builtinModules.map(it => "node:" + it),
                "node-hid"
            ],
        }
    },
    
    plugins: [ 
        vite_dts({ include: "src", outDir: "dist" }),
    ],
    define: {
        '__MODULE_VERSION__': JSON.stringify(process.env.npm_package_version)
    }
});