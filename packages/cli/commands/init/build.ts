import { buildSync } from "esbuild";
import pkg from "./package.json";

const external = [""].concat(Object.keys(pkg.dependencies), Object.keys(pkg.devDependencies));

buildSync({
  entryPoints: ["src/index.ts"],
  outfile: "dist/index.js",
  bundle: true,
  platform: "node",
  minify: true,
  external: ["npminstall"]
  // packages: "external",
  // esbuild src/index.ts --outfile=dist/index.js --bundle --platform=node --minify --packages=external
});
