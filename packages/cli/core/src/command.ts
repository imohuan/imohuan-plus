import chalk from "chalk";
import { Command } from "commander";
import { textSync } from "figlet";

import { logger } from "@imohuan-plus/log";
import { defaultsDeep, max } from "@imohuan-plus/utils-common";

import { exec } from "./exec";
import { HelpColor } from "./typings";

export function registerCommand(label: string, version: string) {
  const program = new Command();
  program
    .name(label.replaceAll(" ", "-").toLocaleLowerCase())
    .usage("[command] [options]")
    .option("-d, --debug", "是否开启调试模式", false)
    .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "");

  program.helpOption("-h, --help", "指令帮助");
  program.version(logger.formatLog("info", `版本号: ${version}`), "-v, --version", "查看版本");

  initHelp(label, program);
  initOutput(program);
  initUnKnowCommand(program);

  program
    .command("init [projectName]")
    .description("创建项目模板")
    // .option("--packagePath <packagePath>", "手动指定init包路径")
    .option("-f, --force", "是否强制初始化项目")
    .action(exec);

  // program.command("[ml] [projectName]").description("使用网络命令").action(exec);

  program.on("option:targetPath", function () {
    process.env.CLI_TARGET_PATH = program.getOptionValue("targetPath");
  });

  program.parse();
}

/** 重构帮助样式 */
export function initHelp(label: string, program: Command, userHelpColor: Partial<HelpColor> = {}) {
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

      const usage = `${helpColor.head("🛷 使用")} ${helpColor.usage(helper.commandUsage(cmd))}`;
      const title = helpColor.logo(
        textSync(label, {
          horizontalLayout: "full",
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
        output = output.concat([helpColor.head("🛠️  参数"), formatList(argumentList), ""]);

      // cmd 配置介绍
      const optionList = helper.visibleOptions(cmd).map((option) => {
        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
      });
      if (optionList.length > 0)
        output = output.concat([helpColor.head("🪁 配置"), formatList(optionList), ""]);

      // cmd 命令介绍
      const commandList = helper.visibleCommands(cmd).map((cmd) => {
        return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
      });
      if (commandList.length > 0)
        output = output.concat([helpColor.head("🐳 指令"), formatList(commandList), ""]);

      return output.join("\n");
    },

    //获取要在子命令列表中显示的命令术语 : Get the command term to show in the list of subcommands
    subcommandTerm: (cmd) => cmd.name() // Just show the name, instead of short usage.
  });
}

/** 重构错误输出 */
export function initOutput(program: Command) {
  program.configureOutput({
    outputError(str) {
      if (str.indexOf("error: missing required argument") !== -1) {
        const args = str.match(/\'(.+)\'/)![1];
        logger.error(`缺少所需的参数: ${chalk.yellow.bold(args)}`);
      } else if (str.indexOf("unknown option") !== -1) {
        const args = str.match(/\'(.+)\'/)![1];
        logger.error(`未知配置: ${chalk.yellow.bold(args)}`);
      } else {
        logger.error(str);
      }
    }
  });

  // program.exitOverride((_err) => {
  //   process.exitCode = 1;
  // });
}

/** 未知命令输出 */
export function initUnKnowCommand(program: Command) {
  const availableCommands = program.commands.map((cmd) => cmd.name());
  program.command("*", { hidden: true }).action(function (_, cmd) {
    logger.error(`未找到对应的指令: ${chalk.yellow.bold(cmd.args.join(", "))}`);
    if (availableCommands.length > 0) {
      logger.info(chalk.red("可用命令：" + availableCommands.join(",")));
    }
  });
  // 关闭 -h, -help 配置
  // program.helpOption(false);
  // 关闭子命令中的help
  program.addHelpCommand(false);
}
