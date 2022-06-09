import { resolve } from "path";

import { Ctx } from "./core/context";
import {
  checkNodeVersion,
  checkPkgVersion,
  checkRoot,
  checkUpdate,
  checkUserHome
} from "./prepare/check";

const ctx = new Ctx("Imohuan Cli", resolve(process.cwd(), "dist", "log"));

async function main() {
  try {
    checkUpdate();
    checkUserHome();
    checkRoot(ctx);
    checkPkgVersion(ctx);
    checkNodeVersion(ctx);
  } catch (e: any) {
    ctx.logger.error(e.message);
  }
}
main();
