import { Chalk } from "chalk";

export interface LoggerFormat {
  /** 输出前缀 默认: `$` */
  prefix: string;
  /** 日志内容 默认: `{prefix} {date} {label} {level} {msg}` */
  content: string;
  /** 日期格式化 默认: `YYYY-MM-DD hh:ss:mm` */
  date: string;
}

export interface LoggerOutput {
  /** 日志缓存目录 */
  dirname: string;
  /** 日志文件名称模板 */
  nameFormat: string;
  /** 日志名称中的 date 变量的格式化 */
  nameDateFormat: string;
}

export interface LoggerOption {
  /** 日志显示标题 */
  label: string;
  /** 日志输出到本地配置 */
  out: LoggerOutput;
  /** 打印输出格式配置 */
  format: LoggerFormat;
}

/** 日志不同等级的颜色 */
export interface LevelColor {
  error: Chalk;
  warn: Chalk;
  info: Chalk;
  verbose: Chalk;
  debug: Chalk;
  silly: Chalk;
}

export type LevelColorKey = keyof LevelColor;
