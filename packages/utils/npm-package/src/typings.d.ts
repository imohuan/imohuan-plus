declare module "npminstall" {
  interface NpmInstallOption {
    /** 安装根目录 */
    root: string;
    /** 需要安装的可选程序包，默认为Package.json的依赖项和devDependents */
    pkgs: { name: string; version: string }[];
    /** 安装到特定目录，默认为根目录 */
    targetDir: string;
    /** 将bin链接到特定目录(全局安装) */
    binDir: string;
    /** 注册表，默认为https://registry.npmjs.org */
    registry: string;
    /** 调试模式 */
    debug: boolean;
    /** node_modules 目录地址 */
    storeDir: string;
    /** 忽略安装前/安装后脚本，默认为`False` */
    ignoreScripts: boolean;
    /** 禁止许可：禁止使用这些许可的安装包 */
    forbiddenLicenses: boolean;
  }
  export default function (option: Partial<NpmInstallOption>): any;
}
