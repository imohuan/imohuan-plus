import chalk from "chalk";
import { Command } from "commander";

import { getCtx } from "../core/context";
import { get } from "./i18n";

export function initCommand(program: Command) {
  const ctx = getCtx();
  program.command("*", { hidden: true }).action(function (_, cmd) {
    ctx.logger.error(`${get("not-found")}: ${chalk.yellow.bold(cmd.args.join(", "))}`);
  });

  // 关闭 -h, -help 配置
  // program.helpOption(false);
  // 关闭子 命令中的help
  program.addHelpCommand(false);
}
