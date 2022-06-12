import { ensureFileSync, writeFileSync } from "fs-extra";
import { resolve } from "path";

import { VueParse } from "./helper";

const dirname = resolve(__dirname, "../web/src");
const parse = new VueParse(dirname, {});

parse.html().then((res) => {
  // console.log("res", res);
  const filepath = resolve(__dirname, "../dist/index.html");
  ensureFileSync(filepath);
  writeFileSync(filepath, res);
});
