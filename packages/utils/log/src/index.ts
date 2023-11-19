import "winston-daily-rotate-file";

import chalk from "chalk";
import stripAnsi from "strip-ansi";
import { defaultColors, defaultOption } from "./configs";
import { format, transports, createLogger, Logger as _Logger } from "winston";
import { LoggerOption, LevelColor, LevelColorKey } from "./typings";
import {
  replaceVar,
  upperFirst,
  defaultsDeep,
  get,
  isArray,
  isObject,
  trimEnd
} from "@imohuan-plus/utils-common";
import moment from "moment";
import DailyRotateFile from "winston-daily-rotate-file";

const { combine, timestamp, label, printf, splat } = format;

export type * from "./typings";

export class Logger {
  private _debugger = false;
  private instance: _Logger;
  private console: transports.ConsoleTransportInstance;
  private transports: DailyRotateFile[] = [];
  private option: LoggerOption;
  public colors: LevelColor = defaultColors;

  constructor(ops: Partial<LoggerOption> = {}) {
    this.option = defaultsDeep(ops, defaultOption);

    this.console = new transports.Console({
      level: "info",
      format: combine(printf(({ level, message }) => this.formatLog(level as any, message)))
    });

    this.instance = createLogger({
      level: "verbose",
      format: this.defaultFormat(),
      transports: [this.console]
    });

    this.initRotateFile();
  }

  private initRotateFile() {
    if (this.option.out.dirname.trim()) {
      this.transports.push(this.createRotateFile("info"));
      this.transports.push(this.createRotateFile("error"));
      this.transports.push(this.createRotateFile("verbose"));
      this.transports.forEach((transport) => this.instance.add(transport));
    }
  }

  /** 该属性是获取参数中`option.out.dirname`, 用于构建 `rotate-file` 日志目录， 如果为空则不进行构建日志， 可以自行设置 */
  get dirname() {
    return this.option.out.dirname;
  }

  set dirname(value: string) {
    if (value.trim()) {
      this.option.out.dirname = value;
      this.initRotateFile();
    } else {
      this.transports.forEach((transport) => this.instance.remove(transport));
      this.transports = [];
    }
  }

  /** 是否开启 console debugger模式  */
  get debugger() {
    return this._debugger;
  }

  set debugger(value: boolean) {
    this._debugger = value;
    if (value) {
      this.instance.level = "verbose";
      this.console.level = "verbose";
    } else {
      this.instance.level = "info";
      this.console.level = "info";
    }
  }

  /** 自定义多个 log 多个参数输出 */
  private parseArg(): any {
    return {
      transform(info: any) {
        try {
          const msg = info.message;
          const symbols = Object.getOwnPropertySymbols(info);
          if (symbols.length === 1) {
            info.message = isObject(msg) ? JSON.stringify(msg) : msg;
            return info;
          }

          const splatKey = symbols.slice(-1)[0];
          const splat = info[splatKey] || info.splat;
          if (/%[scdjifoO%]/g.test(msg)) return info;
          info[splatKey] = [];
          if (isArray(splat)) {
            splat.unshift(msg);
            info.message = splat
              .map((m: any) => {
                if (!isObject(m)) return m;
                return JSON.stringify(m, null, 2);
              })
              .join(" ");
          }
          return info;
        } catch {
          return info;
        }
      }
    };
  }

  /** 自定义输出日志内容 */
  public formatLog(level: LevelColorKey, ...msgs: any[]): string {
    const msg = msgs.join(" ");
    const varOption = {
      prefix: chalk.gray.bold(this.option.format.prefix),
      label: this.option.label.trim() ? chalk.blue.bold(`[${this.option.label}]`) : "-",
      level: get(this.colors, level, chalk.red.bold)(`[${upperFirst(level)}]`),
      date: chalk.gray.bold(moment().format(this.option.format.date))
    };

    /** 以下逻辑是处理多行输出内容对其的，效果如下
     * $ 2023-01-26 11:15:38 - [Verbose]  hello hhhhhhh {
     *                         [Verbose]    "hello": 2,
     *                         [Verbose]    "adsdfasdfsadfsadf": "123"
     *                         [Verbose]  }
     */
    const headers = replaceVar(this.option.format.content, varOption);
    if (level !== "verbose") return chalk.white(`${headers} ${msg}`);

    let headerBody = "";
    const bodys: string[] = [];
    msg.split("\n").forEach((line, index) => {
      const prefix = varOption.level;
      if (index === 0) {
        headerBody = line;
        return;
      }
      const space = "".padStart(stripAnsi(headers).length - stripAnsi(prefix).length, " ");
      bodys.push(`${space}${prefix} ${line}`);
    });
    return chalk.white(
      `${headers} ${headerBody}${bodys.length > 0 ? "\n" + bodys.join("\n") : ""}`
    );
  }

  /** 自定义格式化日志 */
  private defaultFormat() {
    return combine(
      this.parseArg(),
      printf(({ level, message }) => stripAnsi(this.formatLog(level as any, message)))
    );
  }

  private createRotateFile(level: string) {
    const dirname = this.option.out.dirname;
    const varOption = { level: upperFirst(level), date: "%DATE%", ext: "log" };
    const transport = new transports.DailyRotateFile({
      level,
      dirname,
      filename: replaceVar(this.option.out.nameFormat, varOption),
      datePattern: this.option.out.nameDateFormat,
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "1d"
    });
    return transport;
  }

  private log(level: LevelColorKey, ...msgs: any[]) {
    this.instance[level]?.(msgs[0], ...msgs.slice(1));
  }

  /** 设置显示label */
  public setLable(label: string) {
    this.option.label = label;
  }

  /** 设置配置属性 */
  public setOption(option: Partial<LoggerOption> = {}) {
    this.option = defaultsDeep(option, this.option);
  }

  public info(...msgs: any[]) {
    this.log("info", ...msgs);
  }

  public warn(...msgs: any[]) {
    this.log("warn", ...msgs);
  }

  public error(...msgs: any[]) {
    this.log("error", ...msgs);
  }

  public verbose(...msgs: any[]) {
    this.log("verbose", ...msgs);
  }

  public verboseError(error: any) {
    this.log("error", error.message);
    this.log("verbose", `${error.message}\n${error.stack}`);
  }
}

export const logger = new Logger();
