import { Command } from "commander";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "fs-extra";
import inquirer from "inquirer";
import { get } from "lodash";
import { basename, extname, resolve } from "path";

import { CREATE_TEMPLATE } from "../config";
import { initCommand } from "../core/command";
import { getCtx } from "../core/context";
import { download } from "../helper/download";

export function commandCreate(program: Command) {
  const ctx = getCtx();
  const create = program
    .command("create")
    .usage("<project_name>")
    .argument("<project_name>", "创建项目名称")
    .option("-f, --force", "强制覆盖")
    .description("创建模板");

  create
    .command("*", { hidden: true })
    .argument("<project_name>", "创建项目名称")
    .option("-f, --force", "强制覆盖")
    .action(async (project_name): Promise<any> => {
      const { force } = create.opts();

      // 1. 选择模板类型
      // let components = ["unocss", "vue-router", "pinia", "vueuse", "md", "element-ui", "quasar"];
      const { template } = await inquirer.prompt([
        {
          type: "list",
          message: "选择模板",
          name: "template",
          choices: Object.keys(CREATE_TEMPLATE)
        }
      ]);

      // 2. 下载模板
      const { status, message } = await download(get(CREATE_TEMPLATE, template, ""), project_name, {
        force
      });

      if (!status) return ctx.logger.error(message);

      // 3. 执行增量结果
      // 根据 components 来进行 add 或者 remove

      // 4. 打印结果
      ctx.logger.info("创建成功");
    });

  create
    .command("config")
    .description("创建配置文件")
    .option("-f, --force", "强制覆盖")
    .action(async () => {
      const { force } = create.opts();
      const sourceDir = resolve(__dirname, "../src/templates");
      const dirs = readdirSync(sourceDir);
      const { filename } = (await inquirer.prompt([
        {
          type: "list",
          name: "filename",
          message: "选择模板",
          choices: dirs
        }
      ])) as { filename: string };

      let annotation = false;
      if ([".js", ".ts", ".jsx"].some((f) => filename.endsWith(f))) {
        const result = await inquirer.prompt([
          {
            type: "confirm",
            name: "annotation",
            message: "是否去除代码中的注释",
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
            message: "项目已经存在，请选择处理方式",
            name: "types",
            choices: ["覆盖", "追加", "取消"]
          }
        ]);
        if (types === "取消") return;
        if (types === "追加") {
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
      ctx.logger.info("目标地址", target);
    });

  initCommand(create);
}
