import { logger, Logger } from "@imohuan/utils";
import { set, get } from "lodash-es";
import { resolve } from "path";

export type Global = {
  ctx: Ctx;
};

export class Ctx {
  name: string;
  dirname: string;
  logger: Logger;

  constructor(name: string, dirname: string) {
    this.name = name;
    this.dirname = dirname;
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
