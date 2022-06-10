import { resolve } from "path";

import { registerCommand } from "./core/commander";
import { Ctx } from "./core/context";
import { checkNodeVersion, checkRoot, checkUpdate, checkUserHome } from "./prepare/check";

const ctx = new Ctx("Imohuan Cli", resolve(process.cwd(), "dist"));

export async function main() {
  try {
    checkRoot(ctx);
    checkUpdate(ctx);
    checkUserHome(ctx);
    checkNodeVersion(ctx);
    registerCommand(ctx);
  } catch (e: any) {
    ctx.logger.error(e.message);
  }
}
