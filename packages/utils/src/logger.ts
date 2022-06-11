import "winston-daily-rotate-file";

import chalk from "chalk";
import { get, isArray, isObject, upperFirst } from "lodash-es";
import moment from "moment";
import stripAnsi from "strip-ansi";
import { createLogger, format, transports } from "winston";

export type { Logger } from "winston";

const { combine, timestamp, label, printf, splat } = format;

const levelColor: any = {
  error: chalk.red,
  warn: chalk.yellow,
  info: chalk.green,
  debug: chalk.blue,
  verbose: chalk.cyan,
  silly: chalk.white
};

const createRotateFile = (level: string, dirname: string) => {
  const transport = new transports.DailyRotateFile({
    level,
    dirname,
    filename: `%DATE%-${level}.log`,
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "1d"
  } as any);
  return transport;
};

export const formatLog = (args: { label: string; level: string; message: string }) => {
  return `${chalk.gray.bold("$")} ${chalk.bold.blue(`[${args.label}]`)} ${levelColor[
    args.level
  ].bold(`[${upperFirst(args.level)}]`)}: ${args.message}`;
};

const custom = {
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
        info.message = splat.map((m: any) => (isObject(m) ? JSON.stringify(m) : m)).join(" ");
      }
      return info;
    } catch {
      return info;
    }
  }
};

const Console = (labelName: string) => {
  return new transports.Console({
    format: combine(
      label({ label: labelName }),
      timestamp(),
      printf((args: any) => chalk.white.bold(formatLog(args)))
    )
  } as any);
};

export const logger = (labelName: string, dirname: string) => {
  const result = createLogger({
    level: "debug",
    format: combine(
      custom,
      splat(),
      label({ label: labelName }),
      timestamp(),
      printf((args: any) => {
        const text = stripAnsi(formatLog(args)).slice(2);
        return `$ ${moment().format("YYYY-MM-DD hh:ss:mm")} ${text}`;
      })
    ),
    transports: [
      Console(labelName),
      createRotateFile("info", dirname),
      createRotateFile("error", dirname)
    ]
  });
  return result;
};
