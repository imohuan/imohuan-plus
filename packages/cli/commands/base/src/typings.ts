/** 环境变量  链接 - @imohuan-plus-dev/cli - global.d.ts */
export interface ProcessEnv {
  /** CLI保存文件目录名称 */
  CLI_HOME: string;
  /** CLI保存完整目录 */
  CLI_HOME_PATH: string;
  /** Root地址（会在该目录下执行npm install, 生成node_modules文件夹） */
  CLI_TARGET_PATH: string;
  /** npm安装的缓存地址 (会在该目录下生成.store文件夹) */
  CLI_STORE_PATH: string;
  /** 日志级别 */
  LOG_LEVEL: "error" | "warn" | "info" | "verbose" | "debug" | "silly";
  /** 日志Label */
  LOG_LABAL: string;
  /** 是否开启debug模式 值: on / off */
  LOG_DEBUGGER: string;
}

/** 加载效果配置 */
export interface SpinnerOption {
  /** 标题内容 */
  title: string;
  /** 程序最下执行时间，如果程序执行特别快也将延迟在最小时间后返回 */
  minTime: number;
  /** 程序超时时间 */
  timeout: number;
}
