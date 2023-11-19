import chalk from "chalk";
import { Command } from "commander";
import { readdirSync, readFileSync, writeFileSync } from "fs-extra";
import inquirer from "inquirer";
import { resolve } from "path";

import { initCommand } from "../core/command";
import { getCtx } from "../core/context";
import { copy } from "../helper";

export function commandLog(program: Command) {
  const ctx = getCtx();
  const logPath = resolve(ctx.dirname, "log");
  const log = program.command("log").description("获取日志");

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
    .description("日志列表")
    .action(async () => {
      const logs = getLogs();
      if (logs.length === 0) {
        ctx.print("info", "当前不存在目录");
        return;
      }

      const { path, types } = await inquirer.prompt([
        {
          type: "list",
          message: "选择日志",
          name: "path",
          choices: logs
        },
        {
          type: "list",
          message: "选择方式",
          name: "types",
          // "命令行阅读",
          choices: ["复制地址", "打印地址"]
        }
      ]);

      switch (types) {
        case "复制地址":
          const result = await copy(path);
          if (result.status) ctx.logger.info("复制成功");
          else ctx.logger.error("复制失败");
          break;
        case "阅读文件(未找到解决方案)":
          readLog(path);
          break;
        case "打印地址":
          ctx.logger.info(path);
          break;
      }
    });

  log
    .command("clear")
    .description("清除所有日志")
    .action(() => {
      readdirSync(logPath)
        .filter((f) => f.endsWith(".log"))
        .forEach((m) => {
          const path = resolve(logPath, m);
          writeFileSync(path, "");
        });
      const logs = getLogs();
      if (logs.length === 0) {
        ctx.print("info", "清空日志成功");
      } else {
        ctx.print("error", `清空日志失败: ${chalk.bold.yellow(logs.join(", "))}`);
      }
    });

  initCommand(log);
}
