import { program } from "commander";

import pkg from "../../package.json";
import { commandCreate } from "../commands/create";
import { commandLog } from "../commands/log";
import { commandUpdate } from "../commands/update";
import { formatLog } from "../helper";
import { initCommand } from "./command";
import { Ctx } from "./context";
import { initHelp } from "./formatHelp";
import { initOutput } from "./formatOutput";

export function registerCommand(ctx: Ctx) {
  initHelp(program, {});
  initOutput(program);
  initCommand(program);
  program.name(ctx.name.replaceAll(" ", "-").toLocaleLowerCase()).usage("[command] [options]");
  program.helpOption("-h, --help", "指令帮助");
  program.version(
    formatLog({ level: "info", label: ctx.name, message: `版本号: ${pkg.version}` }),
    "-v, --version",
    "查看版本"
  );
  commandCreate(program);
  commandLog(program);
  commandUpdate(program);
  program.parse();
}
