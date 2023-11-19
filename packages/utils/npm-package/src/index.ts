import { ensureDirSync, existsSync } from "fs-extra";
import npmInstall from "npminstall";
import { resolve } from "path";

import { getNpmVersions } from "@imohuan-plus/info";
import { loadJson } from "@imohuan-plus/utils-common";

export interface NpmPackageOption {
  /** 目标目录(如: xxxxx/dependecise ) */
  target: string;
  /** npm缓存目录 (如: {target}/node_modules ) */
  store: string;
  /** npm包名称 */
  name: string;
  /** npm包版本号 */
  version: string;
}

export class NpmPackage {
  constructor(private option: NpmPackageOption) {
    // 确保目录存在
    ensureDirSync(this.option.store);
  }

  /** 当前包所在目录 */
  get dirpath() {
    const { store, name } = this.option;
    return resolve(store, name);
  }

  /** 获取当前库的package.json信息 */
  public async getInfo(): Promise<any> {
    const { store, name } = this.option;
    const defaultResult = { version: "-1" };
    const pkgPath = resolve(store, name, "package.json");
    if (!existsSync(pkgPath)) return defaultResult;
    return loadJson(pkgPath) || defaultResult;
  }

  /** 获取入口文件地址 */
  public async getMainPath() {
    const pkg = await this.getInfo();
    const { store, name } = this.option;
    if (!pkg.main) throw new Error(`未找到 ${this.option.name} 中的入口文件地址`);
    const main = resolve(store, name, pkg.main);
    if (!existsSync(main)) throw new Error(`不存在 ${this.option.name} 的入口文件`);
    return main;
  }

  /** 判断当前包是否安装 */
  public async exists(version: string = this.option.version): Promise<boolean> {
    const pkg = await this.getInfo();
    return pkg.version === version;
  }

  /** 安装当前包 */
  public async install() {
    const { target, store, name, version } = this.option;
    return npmInstall({ root: target, storeDir: store, pkgs: [{ name, version }] });
  }

  /** 更新当前包 */
  public async update() {
    const { latestVersion } = await getNpmVersions(this.option.name);
    const pkg = await this.getInfo();
    if (pkg.version !== latestVersion) {
      const { target, store, name } = this.option;
      await npmInstall({ root: target, storeDir: store, pkgs: [{ name, version: latestVersion }] });
    }
    this.option.version = latestVersion;
  }
}
