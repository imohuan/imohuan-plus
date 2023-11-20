import chalk from "chalk";
import { config } from "dotenv";
import { existsSync } from "fs";
import importLocal from "import-local";
import minimist from "minimist";
import { homedir } from "os";
import { resolve } from "path";
import rootCheck from "root-check";
import { gt } from "semver";

import { getNpmVersions, getRegistryMap } from "@imohuan-plus/info";
import { logger } from "@imohuan-plus/log";

import pkg from "../package.json";
import { registerCommand } from "./command";
import { DEFAULT_CLI_HOME, DEFAULT_ENV_NAME } from "./configs";

export function run() {
  if (importLocal(__filename)) {
    logger.info("cli", "正在使用 imohuan-cli 本地版本");
  } else {
    core(process.argv.slice(2));
  }
}

export async function core(argv: string[]) {
  try {
    const label = "Imohuan Cli";
    const env = minimist(argv);
    await prelog(env, label);
    await prepare();
    registerCommand(label, pkg.version);
  } catch (e: any) {
    logger.verboseError(e.message);
  }
}

/** 对全局日志进行配置 */
async function prelog(env: any, label: string) {
  logger.debugger = env?.d || env?.debug || false;
  logger.setLable(label);
  process.env.LOG_DEBUGGER = logger.debugger ? "on" : "off";
  process.env.LOG_LEVEL = "info";
  process.env.LOG_LABAL = label;
}

/** 检查环境 */
async function prepare() {
  // 检查版本号
  // logger.info("cli: ", pkg.version);

  // 权限检测（将管理者权限降级至普通权限）
  rootCheck();

  // 检查用户目录是否存在
  const homeDirPath = homedir();
  if (!homeDirPath || !existsSync(homeDirPath)) {
    throw new Error(chalk.red("当前登录用户主目录不存在！"));
  }

  // 设置环境变量
  const envPath = resolve(homeDirPath, DEFAULT_ENV_NAME);
  if (existsSync(envPath)) config({ path: envPath });
  process.env.CLI_HOME = process.env?.CLI_HOME || DEFAULT_CLI_HOME;
  process.env.CLI_HOME_PATH = resolve(homeDirPath, process.env.CLI_HOME);

  // 检查更新单独捕获，避免请求异常导致程序终止
  try {
    await checkUpdate();
  } catch (e) {
    logger.verboseError(e);
  }
}

/** 检查CLi是否需要更新 */
async function checkUpdate() {
  const name = pkg.name;
  const version = pkg.version;
  const { latestVersion } = await getNpmVersions(name, version, getRegistryMap("npm"));
  if (!latestVersion || !gt(latestVersion, version)) return;
  logger.warn(chalk.yellow(`请手动更新 ${name}，当前版本：${version}，最新版本：${latestVersion}`));
  logger.warn(chalk.yellow(`更新命令： npm install -g ${name}`));
}
