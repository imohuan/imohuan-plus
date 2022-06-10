import { Command } from "commander";
import { getCtx } from "../core/context";
import { get } from "./i18n";
import chalk from "chalk";

export function initOutput(program: Command) {
  const ctx = getCtx();
  program.configureOutput({
    outputError(str) {
      if (str.indexOf("error: missing required argument") !== -1) {
        const args = str.match(/\'(.+)\'/)![1];
        ctx.logger.error(`${get("required-argument")} "${chalk.yellow.bold(args)}"`);
      } else {
        ctx.logger.error(str);
      }
    }
  });

  // 注册callback来代替调用process.exit。
  // program.exitOverride((err) => {});
}
