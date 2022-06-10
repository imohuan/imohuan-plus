import { Command } from "commander";

import { initCommand } from "../helper/command";
import { download } from "../helper/download";
import { get } from "../helper/i18n";

export function commandCreate(program: Command) {
  const create = program
    .command("create")
    .usage("<project_name>")
    .argument("<project_name>", get("create-name"))
    .description(get("command-create"))
    .action((project_name) => {
      console.log(123, project_name);
      // 1. 选择模板类型 (cmd交互暂时无法使用)
      // 2. 下载模板
      // 3. 打印结果
    });

  initCommand(create);
}
