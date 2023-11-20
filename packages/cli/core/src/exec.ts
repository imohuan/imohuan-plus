import { execa } from "execa";
import { resolve } from "path";

import { logger } from "@imohuan-plus/log";
import { NpmPackage } from "@imohuan-plus/npm-package";
import { get } from "@imohuan-plus/utils-common";
import { Command } from "commander";
import { getNpmInfo } from "@imohuan-plus/info";

/** 指令对应的npm包 */
export const commandMap = {
  init: "@imohuan-plus/init-command"
};

/**
 * 下载Npm包通过子进程执行对应方法
 * @param args Command Action 参数
 */
export async function exec() {
  try {
    // arguments: [name, option, command]
    const homePath = process.env.CLI_HOME_PATH || "";
    logger.verbose("项目Root地址:", homePath);

    const command: Command = arguments[arguments.length - 1];

    /** 指令名称 */
    const name = command.name();
    const npmName = get(commandMap, name, `@imohuan-plus/${name}-command`);
    const npmVersion = "latest";
    logger.verbose("指令", { name, npmName });

    const isTest = !!process.env?.CLI_TARGET_PATH;
    if (!npmName) throw new Error("未找到指令对应的库");

    const info = await getNpmInfo(npmName);
    if (!info?.name) throw new Error(`未找到 ${npmName} 库`);

    /** 安装的Root目录 */
    const target = process.env?.CLI_TARGET_PATH || resolve(homePath, "dependencies");
    /** 安装Npm的缓存目录 */
    const store = resolve(target, "node_modules");
    process.env.CLI_TARGET_PATH = target;
    process.env.CLI_STORE_PATH = store;

    logger.verbose("Npm包缓存地址:", { target, store });

    // 1. 安装或者更新该npm包到指定位置
    const npm = new NpmPackage({ name: npmName, version: npmVersion, target, store });
    if (!isTest) {
      if (await npm.exists()) await npm.update();
      else await npm.install();
    }

    // 2. 子进程执行下载后的代码
    const main = await npm.getMainPath();
    // 这步主要是为了传递属性，剔除command实例中无法解析或者不需要的部分，因为需要反序列化
    const args = Array.from(arguments);
    const o = Object.create(null);
    Object.keys(command).forEach((key) => {
      if (command.hasOwnProperty(key) && !key.startsWith("_") && key !== "parent")
        o[key] = get(command, key, null);
    });
    args[args.length - 1] = o;
    const strArgs = JSON.stringify(args);

    // 通过 node -e "console.log(123)" 可以执行脚本，也就可以使用子进程进行执行代码
    const code = `require('${main.replace(/\\/g, "/")}').default.call(null, ${strArgs})`;
    const child = execa("node", ["-e", code], { cwd: process.cwd(), stdio: "inherit" });
    child.on("error", (e) => {
      logger.verboseError(e.message);
      process.exit(1);
    });

    child.on("exit", (e: number) => {
      if (e === 0) logger.verbose(`命令 ${name} 执行成功`);
      else logger.error(`命令 ${name} 执行失败`);
      process.exit(e);
    });
  } catch (e: any) {
    logger.verboseError(e);
  }
}
