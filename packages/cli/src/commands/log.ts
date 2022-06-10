import { Command } from "commander";
import { readdirSync } from "fs-extra";
import { resolve } from "path";

import { getCtx } from "../core/context";

export function commandLog(command: Command) {
  command
    .command("log")
    .description("获取日志")
    .action(async () => {
      const ctx = getCtx();
      const logPath = resolve(ctx.dirname, "log");
      const logs = readdirSync(logPath)
        .filter((f) => f.endsWith(".log"))
        .map((m) => resolve(logPath, m));
      const msg = logs.length === 0 ? "当前还没有日志" : JSON.stringify(logs, null, 2);
      ctx.logger.info(msg);
    });
}
