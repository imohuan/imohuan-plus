import { defineConfig } from "vite";
import { builtinModules } from "node:module";
import pkg from "./package.json";

export default defineConfig(() => {
  return {
    clearScreen: true,
    optimizeDeps: {
      extensions: [".ts", ".js"]
    },
    build: {
      outDir: "./dist",
      assetsDir: "",
      sourcemap: true,
      lib: {
        entry: "./src/index.ts",
        formats: ["cjs", "es"],
        fileName: (format) => {
          return `imohuan-cli-${format}.js`;
        }
      },
      rollupOptions: {
        external: [...Object.keys(pkg.devDependencies), ...builtinModules]
      }
    }
  };
});
