import { buildSync } from "esbuild";
import { statSync } from "fs-extra";
import { resolve } from "path";

import pkg from "../package.json";

const resolvePath = (...args: string[]) => resolve(__dirname, "..", ...args);
const packages = Object.keys(pkg.dependencies).filter((f) => !f.startsWith("@imohuan"));
// console.log("packages", packages);

export function build() {
  const outfile = resolvePath("dist/index.js");
  buildSync({
    bundle: true,
    entryPoints: [resolvePath("src/index.ts")],
    outfile,
    platform: "node",
    // sourcemap: true,
    // external: ["chalk", "commander", "fs-extra", "figlet"],
    external: packages,
    minify: true,
    format: "cjs"
  });
  const size = statSync(outfile).size;
  console.log("[Build-Size]", (size / 1024).toFixed(2), "kb");
}

build();
