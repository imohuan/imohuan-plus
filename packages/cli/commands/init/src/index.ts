import { renderFile } from "ejs";
import { execa } from "execa";
import {
  copySync,
  emptyDirSync,
  ensureDirSync,
  existsSync,
  readdirSync,
  writeFileSync
} from "fs-extra";
import { glob } from "glob";
import inquirer from "inquirer";
import { resolve } from "path";
import { valid } from "semver";

import { Command } from "@imohuan-plus/base-command";
import { getSearchList, SearchItem } from "@imohuan-plus/info";
import { NpmPackage } from "@imohuan-plus/npm-package";
import { defaultsDeep, kebabCase, loadJson, omit } from "@imohuan-plus/utils-common";

import { TemplateType, typeNames } from "./configs";
import { SelectInfo, TemplateOption } from "./typing";

export class InitCommand extends Command {
  private info: SelectInfo | null = null;

  init() {
    this.logger.verbose("新建项目名称: ", this.value);
    this.logger.verbose("新建项目参数: ", JSON.stringify(this.option));
  }

  async exec() {
    try {
      const projectInfo = await this.prepare();
      if (!projectInfo) throw new Error("未找到参数");
      this.logger.verbose(
        "初始化参数:",
        defaultsDeep(omit(projectInfo, "template"), { template: "[Object]" })
      );
      this.info = projectInfo;
      const pkgData = await this.downloadTemplate();
      const targetPath = await this.renderTemplate(pkgData);
      // await this.installTemplate(targetPath);

      // 安装(复制目录, Ejs渲染, 或则执行模板入口文件进行Ejs渲染)
      // 执行预处理（安装依赖和执行命令， 但是需要注意白名单（避免命令中存在恶意代码 npm/cnpm/yarn/pnpm, 但是避免执行类似npm run dev这样的代码，理由相同））
    } catch (e: any) {
      this.logger.verboseError(e.message);
    }
  }

  /** 对目录进行检查，并且采取措施（强制清空当前目录） */
  private async prepare(): Promise<any> {
    const rootPath = resolve(process.cwd(), this.value);
    // 如果目录不为空则，提示是否删除目录
    if (!this.isDirEmpty(rootPath)) {
      /** 是否通过 */ let ifContinue = false;
      // 询问是否继续创建
      if (!this.option?.force) {
        const { value } = await inquirer.prompt({
          type: "confirm",
          name: "value",
          default: false,
          message: "当前文件夹不为空，是否继续创建项目？"
        });
        ifContinue = value;
        if (!value) return;
      }
      // 是否强制更新
      if (ifContinue || this.option?.force) {
        // 第二次确认， 是否删除该目录下的内容
        const { confirmDelete } = await inquirer.prompt({
          type: "confirm",
          name: "confirmDelete",
          default: false,
          message: "是否确认清空当前目录下的文件？"
        });
        // 清空当前目录
        if (confirmDelete) emptyDirSync(rootPath);
      }
    }
    return this.getProjectInfo();
  }

  /** 名称是否符条件 */
  private isValidName(name: string) {
    return /^[a-zA-Z]+([-][a-zA-Z][a-zA-Z0-9]*|[_][a-zA-Z][a-zA-Z0-9]*|[a-zA-Z0-9])*$/.test(name);
  }

  /** 获取生成模板的参数 */
  private async getProjectInfo(): Promise<SearchItem> {
    let info: any = {};
    // 检查名称是否合法
    let isNameOk = false;
    if (this.isValidName(this.value)) {
      isNameOk = true;
      info.name = this.value;
    }

    // 选择创建项目还是组件
    const { type } = await inquirer.prompt({
      type: "list",
      name: "type",
      message: "请选择初始化类型",
      default: TemplateType.PROJECT,
      choices: [
        { name: typeNames[TemplateType.PROJECT], value: TemplateType.PROJECT },
        { name: typeNames[TemplateType.COMPONENT], value: TemplateType.COMPONENT }
      ]
    });
    info.type = type;
    this.logger.verbose("选择生成项目类型: ", typeNames[type], type);

    const title = typeNames[type];
    if (!isNameOk) {
      const { name } = await inquirer.prompt({
        type: "input",
        name: "name",
        message: `请输入${title}名称`,
        default: "",
        validate: (input) => {
          if (this.isValidName(input)) return true;
          return `请输入合法的${title}名称`;
        }
      });
      info.name = name;
    }

    const { version } = await inquirer.prompt({
      type: "input",
      name: "version",
      message: `请输入${title}版本号`,
      default: "1.0.0",
      validate: (input) => (valid(input) ? true : "请输入合法的版本号"),
      filter: (f) => valid(f) || f
    });
    info.version = version;

    // 搜索npm模板列表 imooc-cli-dev-template
    this.startSpinner({ title: "正在为您搜索可用的模板数据..." });
    const list = await getSearchList("imohuan-plus-template", 1, { startsWith: true });
    await this.endSpinner();
    if (list.length === 0) throw new Error("为搜索到任何模板");

    const { template } = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: `请选择${title}模板`,
        default: "",
        choices: list.map((item) => ({ name: item.package.name, value: item.package }))
      }
    ]);
    info.template = template;

    if (type === TemplateType.COMPONENT) {
      //组件
      const { description } = await inquirer.prompt({
        type: "input",
        name: "description",
        message: "请输入组件描述信息",
        default: "",
        validate: (input) => (!input.trim() ? "请输入组件描述信息" : true)
      });
      info.description = description;
    }
    info.className = kebabCase(info.name);
    return info;
  }

  /**
   * 判断当前路径是否为空（如果存在 .开头的文件或者文件夹， 或者node_modules 则不进行计算）
   * @param path 需要判断路径
   * @returns boolean
   */
  private isDirEmpty(path: string): boolean {
    if (!existsSync(path)) return true;
    const list = readdirSync(path).filter(
      (name) => !name.startsWith(".") && !["node_modules"].includes(name)
    );
    return list.length === 0;
  }

  /**
   * 渲染文件夹下的Ejs模板
   * @param cwd 需要渲染ejs的目录地址
   * @param data Ejs模板中所需要的对象内容
   * @param _templateOptoin 模板中 package.json 中 template 属性
   * @returns void
   */
  private ejsRender(
    cwd: string,
    data: any,
    _templateOptoin: Partial<TemplateOption> = {}
  ): Promise<void> {
    return new Promise((_resolve, reject) => {
      const templateOption: TemplateOption = defaultsDeep(_templateOptoin, {
        ignore: ["**/node_modules/**", "**/.git/**", "**/.vscode/**", "**/.DS_Store"]
      } as TemplateOption);
      glob("**", { cwd, nodir: true, ignore: templateOption.ignore }, (err, files) => {
        if (err) return reject(err);
        Promise.all(
          files.map((file) => {
            return new Promise((__reoslve) => {
              const filepath = resolve(cwd, file);
              renderFile(filepath, data, (err, str) => {
                if (err) return __reoslve(false);
                writeFileSync(filepath, str);
                __reoslve(true);
              });
            });
          })
        )
          .then(() => _resolve())
          .catch((err) => reject(err));
      });
    });
  }

  /**
   * Npm 下载模板 到缓存中
   * @returns 数据 { mainPath: 入口文件地址, templatePath: 模板所在文件夹, info: Package.json内容 }
   */
  public async downloadTemplate(): Promise<{ mainPath: string; templatePath: string; info: any }> {
    if (!this.info) throw new Error("未找到参数");
    const env = this.getEnv();
    // 下载(NpmPackage类进行下载,更新,加载动画)
    const npm = new NpmPackage({
      name: this.info.template.name,
      version: this.info.template.version,
      target: env.CLI_TARGET_PATH,
      store: env.CLI_STORE_PATH
    });
    if (await npm.exists()) {
      this.startSpinner({ title: "更新模板中..." });
      await npm.update();
      await this.endSpinner();
    } else {
      this.startSpinner({ title: "下载模板中..." });
      await npm.install();
      await this.endSpinner();
      if (await npm.exists()) this.logger.info("模板下载成功");
      else throw new Error("下载模板失败，请重试");
    }

    let mainPath = "";
    try {
      mainPath = await npm.getMainPath();
    } catch (e) {}
    return { mainPath, templatePath: resolve(npm.dirpath, "template"), info: await npm.getInfo() };
  }

  /** 对缓存中复制模板数据并且进行渲染 */
  public async renderTemplate(option: { mainPath: string; templatePath: string; info: any }) {
    const { mainPath, templatePath, info } = option;
    if (!this.info) throw new Error("未找到参数");
    const targetPath = resolve(process.cwd(), this.info.name);
    this.startSpinner({ title: "正在安装模板中..." });
    ensureDirSync(targetPath);
    ensureDirSync(templatePath);
    copySync(templatePath, targetPath);
    await this.endSpinner();

    if (existsSync(mainPath)) {
      // 执行自定义的模板渲染逻辑
      // 复制代码
      // const rootFile = this.templateNpm.getRootFilePath();
      // if (fs.existsSync(rootFile)) {
      //   log.notice("开始执行自定义模板");
      //   const templatePath = path.resolve(this.templateNpm.cacheFilePath, "template");
      //   const options = {
      //     templateInfo: this.templateInfo,
      //     projectInfo: this.projectInfo,
      //     sourcePath: templatePath,
      //     targetPath: process.cwd()
      //   };
      //   const code = `require('${rootFile}')(${JSON.stringify(options)})`;
      //   log.verbose("code", code);
      //   await execAsync("node", ["-e", code], { stdio: "inherit", cwd: process.cwd() });
      //   log.success("自定义模板安装成功");
      // } else {
      //   throw new Error("自定义模板入口文件不存在！");
      // }
    } else {
      // 执行程序中的模板渲染逻辑
      await this.ejsRender(targetPath, this.info, info?.template);
    }

    return targetPath;
  }

  /** 安装依赖并且执行初始化命令 */
  public async installTemplate(targetPath: string) {
    const info = loadJson(resolve(targetPath, "package.json"));
    const installCommand: string = info?.template?.install?.trim();
    const regexp = /^(pnpm|npm|yarn|cnpm)\s+(install|i)/;
    if (!installCommand) return;
    if (!regexp.test(installCommand))
      throw new Error("安装依赖只支持 pnpm|npm|yarn|cnpm i|install");
    const [_, cmd] = Array.from(installCommand.match(regexp)!);
    const args = installCommand.replace(cmd, "").split(" ");
    execa(cmd, args, { stdin: "inherit" });
  }
}

export default function (argv: any[]) {
  return new InitCommand(argv);
}
