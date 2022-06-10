import { Chalk } from "chalk";
import { program } from "commander";
import { promisify } from "util";

import { formatLog } from "@imohuan/utils";

import pkg from "../../package.json";
import { commandLog } from "../commands/log";
import { Ctx } from "./context";

const chalk = new Chalk();
const figlet: any = promisify(require("figlet"));

// https://juejin.cn/post/7106007795123617799
export function registerCommand(ctx: Ctx) {
  const title = chalk.green.bold(
    figlet.textSync(ctx.name, {
      horizontalLayout: "Isometric1",
      verticalLayout: "default",
      width: 300,
      whitespaceBreak: true
    })
  );

  program
    .name(`\n${title}\n`)
    .usage(chalk.gray.bold(`${ctx.name.replaceAll(" ", "-")} [global options] command`));

  program.version(
    formatLog({ level: "info", label: ctx.name, message: "版本号: " + pkg.version }),
    "-v, --version",
    "查看cli版本"
  );

  program.arguments("[cmd] [options]").action((cmd, options) => {
    if (!cmd) return program.outputHelp();
    ctx.logger.error(`未找到命令: ${chalk.yellow.bold(cmd)}`);
  });

  commandLog(program);

  program.parse();
  // const options = program.opts();
}
