import { logger, Logger } from "@imohuan/utils";
import { set, get } from "lodash-es";

export type Global = {
  ctx: Ctx;
};

export class Ctx {
  name: string;
  logger: Logger;

  constructor(name: string, dirname: string) {
    this.name = name;
    this.logger = logger(name, dirname);
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
