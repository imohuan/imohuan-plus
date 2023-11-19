import { ensureDirSync } from "fs-extra";
import { get, set } from "lodash";
import { resolve } from "path";

import { USER_HOME } from "../config";
import { formatLog, Logger, logger, LogLevel, Store } from "../helper";

export type Global = {
  ctx: Ctx;
};

export type LocalStore = {
  updateTime: string;
};

export class Ctx {
  name: string;
  store: Store<LocalStore>;
  dirname: string;
  logger: Logger;

  static getInstance(name: string) {
    return new Ctx(name, resolve(USER_HOME, ".imohuan-cli"));
  }

  constructor(name: string, dirname: string) {
    this.name = name;
    this.dirname = dirname;
    ensureDirSync(dirname);
    this.store = new Store<LocalStore>(resolve(dirname, "config.json"), {
      updateTime: ""
    });
    this.logger = logger(name, resolve(dirname, "log"));
    this.set("ctx", this);
  }

  set<K extends keyof Global>(key: K, value: any) {
    set(global, key, value);
  }

  get<K extends keyof Global>(key: K, defaults: any = null) {
    return get(global, key, defaults);
  }

  print(level: LogLevel, ...args: any[]) {
    console.log(formatLog({ label: this.name, level, message: args.join(" ") }));
  }
}

export function getCtx(): Ctx {
  return get(global, "ctx", null);
}
