import { Command } from "commander";
import { getCtx } from "../core/context";
import { get } from "../helper/i18n";
import { initCommand } from "../helper/command";
import { checkUpdate } from "../prepare/check";
import ora from "ora";
import chalk from "chalk";
import { run } from "@imohuan/utils";
import pkg from "../../package.json";
import semver from "semver";

export async function updateLoading(command: string, version: string) {
  return new Promise((_resolve) => {
    const ctx = getCtx();
    ctx.logger.info(command);
    const spinner = ora(chalk.green.bold(get("update-loading"))).start();
    const spawn = run(command, false);

    spawn.on("close", () => {
      spinner.text = get("update-loading-after");

      const check = run(`${Object.keys(pkg.bin)[0]} -v`, false);
      check.stdout?.on("data", (data): any => {
        spinner.stop();
        const nowVersion = `${data}`.split(":").pop()?.trim();
        if (!nowVersion) {
          ctx.logger.error(get("check-version-error"));
          return _resolve(false);
        }

        if (semver.eq(nowVersion!, version)) {
          ctx.logger.info(get("update-success"));
          return _resolve(true);
        }

        ctx.logger.error(get("update-error"));
        _resolve(false);
      });
    });
  });
}

export function commandUpdate(program: Command) {
  const ctx = getCtx();
  const update = program
    .command("update")
    .description(get("update"))
    .action(() => {
      checkUpdate(ctx, false, async ({ name, version }) => {
        const command = `npm install ${name}@${version} -g`;
        await updateLoading(command, version);
      });
    });
  initCommand(update);
}
