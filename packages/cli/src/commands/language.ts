import chalk from "chalk";
import { Command, Option } from "commander";
import inquirer from "inquirer";

import { getCtx } from "../core/context";
import { initCommand } from "../helper/command";
import { get, i18n, languages } from "../helper/i18n";

export function commandLanguage(program: Command) {
  const ctx = getCtx();
  const language = program.command("lang").description(get("command-language")).usage("[command]");

  language
    .command("list")
    .alias("ls")
    .description(get("language-list"))
    .action(() => {
      const language = ctx.store.get("language", "zh");
      const log = languages
        .map((l) => {
          return `${"".padEnd(2)}${chalk.green.bold(
            (language === l ? "*" : "").padEnd(2)
          )}${chalk.yellow.bold(l)}`;
        })
        .join("\n");
      ctx.logger.info(get("support-language"), "\n" + log);
    });

  language
    .command("use")
    .argument("[language]", get("select-language"))
    .description(get("use-language"))
    .action(async (language) => {
      if (!language) {
        const result = await inquirer.prompt([
          {
            type: "list",
            message: get("select-language"),
            name: "language",
            choices: languages
          }
        ]);
        language = result.language;
      }
      i18n.setLocale(language);
      ctx.logger.info(get("current-language"), chalk.yellow.bold(language));
      ctx.store.set("language", language);
    });

  initCommand(language);
}
