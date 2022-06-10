import { Command } from "commander";

import { getCtx } from "../core/context";
import { initCommand } from "../helper/command";
import { download } from "../helper/download";
import { get } from "../helper/i18n";

export function commandCreate(program: Command) {
  const ctx = getCtx();
  const create = program
    .command("create")
    .usage("<project_name>")
    .description(get("command-create"));

  create
    .command("*", { hidden: true })
    .argument("<project_name>", get("create-name"))
    .action(async (project_name) => {
      console.log("project_name", project_name);
      // todo 交互未解决 (pnpm workspace的锅)
      // 1. 选择模板类型 (cmd交互暂时无法使用)
      // await download("https://github.com/imohuan/imohuan-plus", "temp");
      // 2. 下载模板
      // 3. 打印结果
    });

  create
    .command("list")
    .description(get("create-list"))
    .action(() => {
      ctx.logger.info("[1,2,3]");
    });

  initCommand(create);
}
