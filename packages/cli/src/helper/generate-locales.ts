import { readFileSync, writeFile, writeFileSync } from "fs-extra";
import { get, set, values } from "lodash-es";
import { resolve } from "path";
import { getCtx } from "../core/context";
import { get as I18nGet } from "./I18n";

const files = {
  en: resolve(__dirname, "../locales/en.json"),
  zh: resolve(__dirname, "../locales/zh.json")
};

export function localReset() {
  Object.values(files).forEach((path) => {
    writeFileSync(path, "{}");
  });
}

export function setLocals(data: [name: string, zh: string, en: string][]) {
  const ctx = getCtx();
  Object.keys(files).forEach((language) => {
    try {
      const path = (files as any)[language];
      const json = JSON.parse(readFileSync(path).toString());
      data.forEach((item) => set(json, item[0], item[language === "zh" ? 1 : 2]));
      writeFileSync(path, JSON.stringify(json, null, 2));
    } catch (e: any) {
      ctx.logger.error(I18nGet("set-locals-error"));
    }
  });
}
