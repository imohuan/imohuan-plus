import { buildSync, Format } from "esbuild";
import { statSync } from "fs-extra";
import { resolve } from "path";

import pkg from "../package.json";

const resolvePath = (...args: string[]) => resolve(__dirname, "..", ...args);
const packages = Object.keys(pkg.dependencies).filter((f) => !f.startsWith("@imohuan"));

export function build(input: string, outfile: string, format: Format = "cjs") {
  buildSync({
    bundle: true,
    entryPoints: [resolvePath(input)],
    outfile,
    platform: "node",
    // sourcemap: true,
    // external: ["chalk", "commander", "fs-extra", "figlet"],
    external: packages,
    minify: true,
    format
  });
  const size = statSync(outfile).size;
  console.log("[Build-Size]", (size / 1024).toFixed(2), "kb");
}

build("index.ts", resolvePath("dist/aria2c.cjs.js"));
