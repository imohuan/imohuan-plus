import chalk from "chalk";
import { Command } from "commander";

import { getCtx } from "../core/context";
import { get } from "./i18n";
// import { delay } from "@imohuan/utils";

export function initOutput(program: Command) {
  program.configureOutput({
    outputError(str) {
      const ctx = getCtx();
      if (str.indexOf("error: missing required argument") !== -1) {
        const args = str.match(/\'(.+)\'/)![1];
        ctx.logger.error(`${get("required-argument")} "${chalk.yellow.bold(args)}"`);
      } else if (str.indexOf("unknown option") !== -1) {
        const args = str.match(/\'(.+)\'/)![1];
        ctx.logger.error(`${get("unknown-option")} "${chalk.yellow.bold(args)}"`);
      } else {
        ctx.logger.error(str);
      }
    }
  });

  // 注册callback来代替调用process.exit。
  // todo logger无法在 process.exit 将最后的消息写入 (为解决)
  // https://github.com/jdthorpe/winston-log-and-exit#readme
  program.exitOverride((_err) => {
    process.exitCode = 1;
  });
}
