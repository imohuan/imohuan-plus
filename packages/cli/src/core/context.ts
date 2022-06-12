import { logger, Logger } from "@imohuan/utils";
import { set, get } from "lodash-es";
import { resolve } from "path";
import userHome from "user-home";
import { Store } from "@imohuan/utils";
import { ensureDirSync } from "fs-extra";

export type Global = {
  ctx: Ctx;
};

export type LocalStore = {
  updateTime: string;
  language: "en" | "zh";
};

export class Ctx {
  name: string;
  store: Store<LocalStore>;
  dirname: string;
  logger: Logger;

  static getInstance() {
    return new Ctx("Imohuan Cli", resolve(userHome, ".imohuan-cli"));
  }

  constructor(name: string, dirname: string) {
    this.name = name;
    this.dirname = dirname;
    ensureDirSync(dirname);
    this.store = new Store<LocalStore>(resolve(dirname, "config.json"), {
      updateTime: "",
      language: "zh"
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
}

export function getCtx(): Ctx {
  return get(global, "ctx", null);
}
