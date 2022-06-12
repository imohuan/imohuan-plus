import { program } from "commander";

import { formatLog } from "@imohuan/utils";

import pkg from "../../package.json";
import { commandCreate } from "../commands/create";
import { commandLanguage } from "../commands/language";
import { commandLog } from "../commands/log";
import { initCommand } from "../helper/command";
import { initHelp } from "../helper/formatHelp";
import { initOutput } from "../helper/formatOutput";
import { get, i18n, initI18n } from "../helper/i18n";
import { Ctx } from "./context";
import { commandUpdate } from "../commands/update";
import { commandRepl } from "../commands/repl";

export function registerCommand(ctx: Ctx) {
  initI18n();
  initHelp(program, {});
  initOutput(program);
  initCommand(program);

  i18n.setLocale(ctx.store.get("language", "zh"));

  program.name(ctx.name.replaceAll(" ", "-").toLocaleLowerCase()).usage("[command] [options]");
  program.helpOption("-h, --help", get("command-help"));
  program.version(
    formatLog({ level: "info", label: ctx.name, message: `${get("version")}: ${pkg.version}` }),
    "-v, --version",
    get("command-version")
  );

  commandLanguage(program);
  commandCreate(program);
  commandRepl(program);
  commandLog(program);
  commandUpdate(program);

  program.parse();
}
