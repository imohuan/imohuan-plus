import chokidar from "chokidar";
import { build } from "./build";
import { resolve } from "path";

chokidar.watch(resolve(__dirname, "..", "src")).on("change", () => {
  build();
});
