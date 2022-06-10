import { Chalk } from "chalk";
import { existsSync } from "fs-extra";
import rootCheck from "root-check";
import semver from "semver";
import userHome from "user-home";
import latestVersion from "latest-version";

import pkg from "../../package.json";
import { LOWEST_NODE_VERSION } from "../core/const";
import { Ctx } from "../core/context";

const chalk = new Chalk();

/** 检查Cli版本 */
export function checkPkgVersion(ctx: Ctx) {
  ctx.logger.info("Cli Version: ", pkg.version);
}

/** 检查Node版本 */
export function checkNodeVersion(ctx: Ctx) {
  // 1.获取当前node版本
  const currentVersion = process.version;
  // 2.获取最低版本
  const lowestVersion = LOWEST_NODE_VERSION;
  // 3.比对，使用semver库
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(chalk.red(`${ctx.name} 需要安装 v${lowestVersion} 以上版本的 Node.js`));
  }
}

/** 检测 Root 权限 */
export function checkRoot(_ctx: Ctx) {
  rootCheck();
}

/** 检查用户主目录 */
export function checkUserHome(_ctx: Ctx) {
  if (!userHome || !existsSync(userHome)) {
    throw new Error(chalk.red("当前登录用户主目录不存在"));
  }
}

/** 检测最新版本 */
export async function checkUpdate(ctx: Ctx) {
  try {
    const version = await latestVersion(pkg.name);
    if (semver.lt(pkg.version, version)) {
      ctx.logger.warn("检查到最新版本: ", chalk.green.bold(version));
      ctx.logger.warn("请执行", chalk.green.bold(`npm i ${pkg.name}@${version} -g`), "进行更新");
    }
  } catch {}
}
