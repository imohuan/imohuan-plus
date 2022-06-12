import chalk from "chalk";
import { Command } from "commander";
import { readdirSync, readFileSync, writeFileSync } from "fs-extra";
import inquirer from "inquirer";
import { resolve } from "path";

import { copy } from "@imohuan/utils";

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

  const readLog = async (path: string): Promise<any> => {
    let contents = readFileSync(path).toString().split("\n");
    console.log(contents.splice(0, 10).join("\n"));
    let exit = true;
    while (exit) {
      const { value } = await inquirer.prompt([
        {
          type: "input",
          message: "",
          name: "value",
          askAnswered: false
        }
      ]);
      if (value === "q") return (exit = false);
      if (contents.length === 0) return (exit = false);
      console.log(contents.shift());
    }
  };

  log
    .command("list")
    .alias("ls")
    .description(get("log-list"))
    .action(async () => {
      const logs = getLogs();
      const { path, types } = await inquirer.prompt([
        {
          type: "list",
          message: get("select-log"),
          name: "path",
          choices: logs
        },
        {
          type: "list",
          message: get("select-type"),
          name: "types",
          // "命令行阅读",
          choices: [get("copy-address"), get("print-address")]
        }
      ]);

      switch (types) {
        case get("copy-address"):
          const result = await copy(path);
          if (result.status) ctx.logger.info(get("copy-success"));
          else ctx.logger.error(get("copy-error"));
          break;
        case "阅读文件(未找到解决方案)":
          readLog(path);
          break;
        case get("print-address"):
          ctx.logger.info(path);
          break;
      }
    });

  // log
  //   .command("look")
  //   .argument("[path]", get("log-look-path"))
  //   .description(get("log-look"))
  //   .action(async () => {
  //     const logs = getLogs();
  //     const { path } = await inquirer.prompt([
  //       {
  //         type: "list",
  //         message: get("select-log"),
  //         name: "path",
  //         choices: logs
  //       }
  //     ]);
  //     //
  //     // 交互选中 log
  //     // 输出 log
  //   });

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
