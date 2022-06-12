import { Command } from "commander";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs-extra";
import inquirer from "inquirer";
import { basename, extname, resolve } from "path";

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
    .option("-f, --force", get("create-option-force"))
    .description(get("command-create"));

  create
    .command("*", { hidden: true })
    .argument("<project_name>", get("create-name"))
    .option("-f, --force", get("create-option-force"))
    .action(async (project_name): Promise<any> => {
      const { force } = create.opts();

      // 1. 选择模板类型
      let components = ["unocss", "vue-router", "pinia", "vueuse", "md", "element-ui", "quasar"];
      const { template } = await inquirer.prompt([
        {
          type: "list",
          message: get("select-template"),
          name: "template",
          choices: ["lib-ts", "vue-ts", "vue-browser-ts", "midway-ts"]
        }
      ]);

      if (template === "vue-ts") {
        const vueConfig = await inquirer.prompt([
          {
            type: "checkbox",
            name: "components",
            message: get("select-component"),
            choices: components
          }
        ]);
        components = vueConfig.components;
      }

      // 2. 下载模板
      const { status, message } = await download(
        // "https://github.com/imohuan/imohuan-plus",
        "https://gitee.com/imohuan/serverless-midway",
        project_name,
        { force }
      );

      if (!status) {
        return ctx.logger.error(message);
      }

      // 3. 执行增量结果
      // 根据 components 来进行 add 或者 remove

      // 4. 打印结果
      ctx.logger.info("create-success");
    });

  create
    .command("config")
    .description(get("create-config"))
    .option("-f, --force", get("create-option-force"))
    .action(async () => {
      const { force } = create.opts();
      const sourceDir = resolve(__dirname, "../src/templates");
      const dirs = readdirSync(sourceDir);
      const { filename } = (await inquirer.prompt([
        {
          type: "list",
          name: "filename",
          message: get("select-template"),
          choices: dirs
        }
      ])) as { filename: string };

      let annotation = false;
      if ([".js", ".ts", ".jsx"].some((f) => filename.endsWith(f))) {
        const result = await inquirer.prompt([
          {
            type: "confirm",
            name: "annotation",
            message: get("create-config-annotation"),
            default: false
          }
        ]);
        annotation = result.annotation;
      }

      const targetDir = resolve(process.cwd());
      const source = resolve(sourceDir, filename);
      let target = resolve(targetDir, filename);
      if (existsSync(target) && !force) {
        const { types } = await inquirer.prompt([
          {
            type: "list",
            message: get("download-exist"),
            name: "types",
            choices: [get("force"), get("additional"), get("cancel")]
          }
        ]);
        if (types === get("cancel")) return;
        if (types === get("additional")) {
          const ext = extname(filename);
          const id = `copy${String(Math.random()).slice(2, 4)}`;
          target = resolve(targetDir, `${basename(filename.replace(ext, ""))}-${id}${ext}`);
        }
      }

      const commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm;
      let content = readFileSync(source).toString();
      if (annotation)
        content = content
          .replace(commentRegExp, "")
          .split("\n")
          .filter((f) => f.trim())
          .join("\n");

      writeFileSync(target, content);
      ctx.logger.info(get("target-path"), target);
    });

  initCommand(create);
}
