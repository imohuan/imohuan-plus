import chalk from "chalk";
import { existsSync } from "fs-extra";
import latestVersion from "latest-version";
import moment from "moment";
import rootCheck from "root-check";
import semver from "semver";

import pkg from "../../package.json";
import { LOWEST_NODE_VERSION, USER_HOME } from "../config";
import { Ctx } from "../core/context";

/** 检查Cli版本 */
export function getPkgVersion(ctx: Ctx) {
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
export function checkUserHome() {
  if (!USER_HOME || !existsSync(USER_HOME)) {
    throw new Error(chalk.red("获取用户主目录失败"));
  }
}

/** 检测最新版本 */
export async function checkUpdate(
  ctx: Ctx,
  checkTime: boolean = true,
  callback?: (option: { name: string; version: string }) => void
) {
  // 每过4个小时检查一次更新
  const format = "YYYY-MM-DD HH:mm:ss";
  if (checkTime) {
    const updateTime = ctx.store.get("updateTime", "");
    if (updateTime && updateTime.trim().length > 0) {
      const now = moment(moment(), format);
      const old = moment(updateTime, format);
      const hours = now.diff(old, "hours");
      if (hours < 4) return;
    }
  }

  try {
    const version = await latestVersion(pkg.name);
    if (semver.lt(pkg.version, version)) {
      if (callback) {
        callback({ name: pkg.name, version });
      } else {
        ctx.logger.warn("检查到最新版本", chalk.green.bold(version));
        ctx.logger.warn(`请执行 ${chalk.green.bold(`npm i ${pkg.name}@${version} -g`)} 进行更新`);
      }
    } else if (!checkTime) {
      ctx.logger.info(`当前已是最新版本: ${pkg.version}`);
    }
    ctx.store.set("updateTime", moment().format(format));
  } catch {}
}
