import chalk from "chalk";
import { program } from "commander";

import { formatLog } from "@imohuan/utils";

import pkg from "../../package.json";
import { commandCreate } from "../commands/create";
import { commandLanguage } from "../commands/language";
import { commandLog } from "../commands/log";
import { initHelp } from "../helper/formatHelp";
import { get, i18n, initI18n } from "../helper/i18n";
import { Ctx } from "./context";
import { initCommand } from "../helper/command";
import { initOutput } from "../helper/formatOutput";

// https://juejin.cn/post/7106007795123617799
export function registerCommand(ctx: Ctx) {
  initI18n();
  initHelp(program, {});
  i18n.setLocale(ctx.store.get("language", "zh"));

  program.name(ctx.name.replaceAll(" ", "-").toLocaleLowerCase()).usage("[command] [options]");
  program.helpOption("-h, --help", get("command-help"));
  program.version(
    formatLog({ level: "info", label: ctx.name, message: `${get("version")}: ${pkg.version}` }),
    "-v, --version",
    get("command-version")
  );

  initOutput(program);
  initCommand(program);
  commandLanguage(program);
  commandCreate(program);
  commandLog(program);

  program.parse();
}
