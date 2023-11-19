import chalk from "chalk";
import { Command } from "commander";
import ora from "ora";
import semver from "semver";

import pkg from "../../package.json";
import { checkUpdate } from "../core/check";
import { initCommand } from "../core/command";
import { getCtx } from "../core/context";
import { run } from "../helper";

export async function updateLoading(command: string, version: string) {
  return new Promise((_resolve) => {
    const ctx = getCtx();
    ctx.logger.info(command);
    const spinner = ora(chalk.green.bold("正在更新中")).start();
    const spawn = run(command, false);

    spawn.on("close", () => {
      spinner.text = "更新结束, 检查是否成功";
      const check = run(`${Object.keys(pkg.bin)[0]} -v`, false);
      check.stdout?.on("data", (data): any => {
        spinner.stop();
        const nowVersion = `${data}`.split(":").pop()?.trim();
        if (!nowVersion) {
          ctx.logger.error("检查脚手架版本失败");
          return _resolve(false);
        }

        if (semver.eq(nowVersion!, version)) {
          ctx.logger.info("更新成功");
          return _resolve(true);
        }

        ctx.logger.error("更新失败");
        _resolve(false);
      });
    });
  });
}

export function commandUpdate(program: Command) {
  const ctx = getCtx();
  const update = program
    .command("update")
    .description("更新脚手架")
    .action(() => {
      checkUpdate(ctx, false, async ({ name, version }) => {
        const command = `npm install ${name}@${version} -g`;
        await updateLoading(command, version);
      });
    });
  initCommand(update);
}
