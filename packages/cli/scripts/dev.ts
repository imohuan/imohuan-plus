import chokidar from "chokidar";
import { readFileSync } from "fs-extra";
import { resolve } from "path";

import { setLocals } from "../src/helper/generate-locales";
import { build } from "./build";

chokidar.watch(resolve(__dirname, "..", "src")).on("change", (path) => {
  if (path.endsWith(".json")) return;
  try {
    build();
  } catch {}
});

chokidar.watch(resolve(__dirname, "..", "src/helper/locales.json")).on("change", (path) => {
  try {
    const json = JSON.parse(readFileSync(path).toString());
    setLocals(json);
  } catch {}
});
