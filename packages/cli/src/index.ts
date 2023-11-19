import { checkNodeVersion, checkRoot, checkUpdate, checkUserHome } from "./core/check";
import { registerCommand } from "./core/commander";
import { Ctx } from "./core/context";
import { formatLog } from "./helper/logger";

export async function main() {
  const name = "Imohuan Cli";
  try {
    checkUserHome();
  } catch (e: any) {
    console.log(formatLog({ label: name, level: "error", message: e.message }));
    process.exit();
  }

  const ctx = Ctx.getInstance(name);
  try {
    await checkUpdate(ctx);
    checkRoot(ctx);
    checkNodeVersion(ctx);
    registerCommand(ctx);
  } catch (e: any) {
    ctx.logger.error(e.message);
  }
}
