import { buildSync } from "esbuild";
import { resolve } from "path";

const resolvePath = (...args: string[]) => resolve(__dirname, "..", ...args);

export function build() {
  buildSync({
    entryPoints: [resolvePath("src/index.ts")],
    bundle: true,
    sourcemap: true,
    platform: "node",
    external: ["chalk", "commander", "fs-extra", "figlet"],
    outfile: resolvePath("bin/imohuan-cli.js"),
    minify: true,
    format: "cjs"
  });
}

build();
