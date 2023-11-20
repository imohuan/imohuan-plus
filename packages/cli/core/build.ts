import { buildSync } from "esbuild";
import pkg from "./package.json";

buildSync({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  minify: true,
  external: ["npminstall", "1@imohuan-plus/npm-package"]
  // packages: "external",
  // esbuild src/index.ts --outfile=dist/index.js --bundle --platform=node --minify --packages=external
});
