import { Chalk } from "chalk";

export interface HelpColor {
  logo: Chalk;
  usage: Chalk;
  head: Chalk;
  title: Chalk;
  description: Chalk;
}

/** 自定义的环境变量 */
export interface CustomProcessEnv {
  /** CLI保存文件目录名称 */
  CLI_HOME?: string;
  /** CLI保存完整目录 */
  CLI_HOME_PATH?: string;
  /** Root地址（会在该目录下执行npm install, 生成node_modules文件夹） */
  CLI_TARGET_PATH?: string;
  /** npm安装的缓存地址 (会在该目录下生成.store文件夹) */
  CLI_STORE_PATH?: string;
  /** 日志级别 */
  LOG_LEVEL?: "error" | "warn" | "info" | "verbose" | "debug" | "silly";
  /** 日志Label */
  LOG_LABAL?: string;
  /** 是否开启debug模式 值: on / off */
  LOG_DEBUGGER?: string;
}
