#!/usr/bin/env node
import { registerCommand } from "./core/commander";
import { Ctx } from "./core/context";
import { checkNodeVersion, checkRoot, checkUpdate, checkUserHome } from "./prepare/check";

const ctx = Ctx.getInstance();

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

main();
