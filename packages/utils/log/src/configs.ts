import chalk from "chalk";
import { LevelColor, LoggerOption } from "./typings";

export const defaultColors: LevelColor = {
  info: chalk.green.bold,
  warn: chalk.yellow.bold,
  error: chalk.red.bold,
  debug: chalk.blue.bold,
  verbose: chalk.cyan.bold,
  silly: chalk.white.bold
};

export const defaultOption: LoggerOption = {
  label: "",
  out: {
    dirname: "",
    nameFormat: "{date}-{level}.{ext}",
    nameDateFormat: "YYYY-MM-DD"
  },
  format: {
    prefix: "$",
    content: "{prefix} {date} {label} {level}",
    date: "YYYY-MM-DD hh:ss:mm"
  }
};
