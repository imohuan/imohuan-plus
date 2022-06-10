import chalk from "chalk";
import { Command, Option } from "commander";

import { getCtx } from "../core/context";
import { initCommand } from "../helper/command";
import { get, i18n, languages } from "../helper/i18n";

export function commandLanguage(program: Command) {
  const ctx = getCtx();
  const language = program.command("lang").description(get("command-language")).usage("[command]");

  language
    .command("list")
    .description(get("language-list"))
    .action(() => {
      ctx.logger.info(
        get("support-language"),
        languages.map((l) => chalk.yellow.bold(l)).join(", ")
      );
    });

  language
    .command("use")
    .argument("<language>", get("select-language"))
    .description(get("use-language"))
    .action((language) => {
      i18n.setLocale(language);
      ctx.logger.info(get("current-language"), chalk.yellow.bold(language));
      ctx.store.set("language", language);
    });

  initCommand(language);
}
