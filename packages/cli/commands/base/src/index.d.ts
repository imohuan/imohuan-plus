declare namespace NodeJS {
  export interface ProcessEnv {
    /** CLI保存文件目录名称 */
    CLI_HOME?: string;
    /** CLI保存完整目录 */
    CLI_HOME_PATH?: string;
    /** 日志级别 */
    LOG_LEVEL?: "error" | "warn" | "info" | "verbose" | "debug" | "silly";
    /** 日志Label */
    LOG_LABAL?: string;
    /** 是否开启debug模式 值: on / off */
    LOG_DEBUGGER?: string;
  }
}
