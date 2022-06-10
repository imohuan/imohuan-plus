import chalk from "chalk";
import { Command } from "commander";
import { readdirSync, readFileSync, writeFileSync } from "fs-extra";
import { resolve } from "path";

import { getCtx } from "../core/context";
import { initCommand } from "../helper/command";
import { get } from "../helper/i18n";

export function commandLog(program: Command) {
  const ctx = getCtx();
  const logPath = resolve(ctx.dirname, "log");
  const log = program.command("log").description(get("command-log"));

  const getLogs = (): string[] => {
    return readdirSync(logPath)
      .map((m) => resolve(logPath, m))
      .filter((f) => {
        const ext = f.endsWith(".log");
        if (!ext) return false;
        return readFileSync(f).toString().trim();
      });
  };

  log
    .command("list")
    .alias("ls")
    .description(get("log-list"))
    .action(async () => {
      const logs = getLogs();
      const msg = logs.length === 0 ? get("log-empty") : JSON.stringify(logs, null, 2);
      ctx.logger.info(msg);
    });

  log
    .command("look")
    .argument("[path]", get("log-look-path"))
    .description(get("log-look"))
    .action(() => {
      // todo 未解决(git issus), 无法使用命令行交互
      const logs = getLogs();
      // 交互选中 log
      // 输出 log
    });

  log
    .command("clear")
    .description(get("log-clear"))
    .action(() => {
      readdirSync(logPath)
        .filter((f) => f.endsWith(".log"))
        .forEach((m) => {
          const path = resolve(logPath, m);
          writeFileSync(path, "");
        });
      const logs = getLogs();
      if (logs.length === 0) {
        ctx.logger.info(get("log-clear-success"));
      } else {
        ctx.logger.error(`${get("log-clear-error")}: ${chalk.bold.yellow(logs.join(", "))}`);
      }
    });

  initCommand(log);
}
