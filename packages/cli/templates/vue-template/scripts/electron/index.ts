import chokidar from "chokidar";
import connect from "electron-connect";
import { existsSync, ensureDirSync } from "fs-extra";
import minimist from "minimist";

import { buildInput, findPaths, rootResolve } from "../helper";

const { w, watch } = minimist(process.argv.slice(2));
const electron = connect.server.create({ stopOnClose: true, checkForUpdatesAndNotify: false });

(async () => {
  const main = rootResolve("src-electron/index.ts");
  const preloadDir = rootResolve("src-electron/preloads");
  if (!existsSync(preloadDir)) ensureDirSync(preloadDir);
  const preloads = findPaths(preloadDir);
  const all = [main, preloads].flat(1);
  await buildInput(all);

  if (w || watch) {
    await electron.start();

    chokidar.watch(main).on("change", async () => {
      await buildInput(all);
      await electron.restart();
    });

    chokidar.watch(preloads).on("change", async (path) => {
      await buildInput(path);
      await electron.reload();
    });
  }
})();
