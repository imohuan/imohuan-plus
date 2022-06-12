import { Command } from "commander";
import inquirer from "inquirer";

import { getCtx } from "../core/context";
import { initCommand } from "../helper/command";
import { download } from "../helper/download";
import { get } from "../helper/i18n";

export function commandCreate(program: Command) {
  const ctx = getCtx();
  const create = program
    .command("create")
    .usage("<project_name>")
    .argument("<project_name>", get("create-name"))
    .description(get("command-create"));

  // create.command("*", { hidden: true }).argument("<project_name>", get("create-name"));

  create.action(async (project_name): Promise<any> => {
    // 1. 选择模板类型
    let components = ["unocss", "vue-router", "pinia", "vueuse", "md", "element-ui", "quasar"];
    const { template } = await inquirer.prompt([
      {
        type: "list",
        message: "选择模板",
        name: "template",
        choices: ["lib-ts", "vue-ts"]
      }
    ]);

    if (template === "vue-ts") {
      const vueConfig = await inquirer.prompt([
        {
          type: "checkbox",
          name: "components",
          message: "选择组件",
          choices: components
        }
      ]);
      components = vueConfig.components;
    }

    // 2. 下载模板
    const { status, message } = await download(
      "https://github.com/imohuan/imohuan-plus",
      project_name
    );

    if (!status) {
      return ctx.logger.error(message);
    }

    // 3. 执行增量结果
    // 根据 components 来进行 add 或者 remove

    // 4. 打印结果
    ctx.logger.info("create-success");
  });

  initCommand(create);
}
