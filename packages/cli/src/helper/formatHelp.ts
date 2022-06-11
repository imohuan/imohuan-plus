import chalk, { Chalk } from "chalk";
import { Command } from "commander";
import { defaultsDeep, max } from "lodash-es";
import { promisify } from "util";
import { getCtx } from "../core/context";

import { get } from "./i18n";

type HelpArgs = typeof helpArgs[number];
const figlet: any = promisify(require("figlet"));
const helpArgs = ["args", "options", "commands", "usage"] as const;

interface HelpColor {
  logo: Chalk;
  usage: Chalk;
  head: Chalk;
  title: Chalk;
  description: Chalk;
}

export function initHelp(program: Command, userHelpColor?: Partial<HelpColor>) {
  const helpColor: HelpColor = defaultsDeep(userHelpColor, {
    logo: chalk.cyan.bold,
    usage: chalk.yellow.bold,
    head: chalk.white.bold,
    title: chalk.green.bold,
    description: chalk.gray.bold
  } as HelpColor);

  program.configureHelp({
    helpWidth: max([process.stdout.columns, 100]),
    // sortSubcommands: true,
    formatHelp: (cmd, helper) => {
      const termWidth = helper.padWidth(cmd, helper);
      const helpWidth = helper.helpWidth || 80;
      const itemIndentWidth = 4;
      const itemSeparatorWidth = 2;

      function formatItem(term: string, description: string) {
        term = helpColor.title(term.padEnd(termWidth + itemSeparatorWidth));
        description = helpColor.description(description);
        if (description) {
          const fullText = `${term}${description}`;
          return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
        }
        return term;
      }

      function formatList(textArray: string[]) {
        return textArray.join("\n").replace(/^/gm, " ".repeat(itemIndentWidth));
      }

      function formatTitle(name: HelpArgs) {
        return helpColor.head(get(name));
      }

      const usage = `${formatTitle("usage")} ${helpColor.usage(helper.commandUsage(cmd))}`;
      const title = helpColor.logo(
        figlet.textSync(getCtx().name, {
          // font: "Ghost",
          horizontalLayout: "Isometric1",
          verticalLayout: "default",
          width: 200,
          whitespaceBreak: true
        })
      );

      let output = [title, "", usage, ""];

      // cmd 详细介绍 (description)
      const commandDescription = helper.commandDescription(cmd);
      if (commandDescription.length > 0)
        output = output.concat([helpColor.description(commandDescription), ""]);

      // cmd 参数介绍
      const argumentList = helper.visibleArguments(cmd).map((argument) => {
        return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
      });
      if (argumentList.length > 0)
        output = output.concat([formatTitle("args"), formatList(argumentList), ""]);

      // cmd 配置介绍
      const optionList = helper.visibleOptions(cmd).map((option) => {
        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
      });
      if (optionList.length > 0)
        output = output.concat([formatTitle("options"), formatList(optionList), ""]);

      // cmd 命令介绍
      const commandList = helper.visibleCommands(cmd).map((cmd) => {
        return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
      });
      if (commandList.length > 0)
        output = output.concat([formatTitle("commands"), formatList(commandList), ""]);

      return output.join("\n");
    },

    //获取要在子命令列表中显示的命令术语 : Get the command term to show in the list of subcommands
    subcommandTerm: (cmd) => cmd.name() // Just show the name, instead of short usage.
  });
}
