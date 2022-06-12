import { ensureFileSync, readFileSync, writeFileSync } from "fs-extra";
import { set } from "lodash-es";
import { resolve } from "path";

const i18nPath = resolve(__dirname, "../locales");
const files = {
  en: resolve(i18nPath, "en.json"),
  zh: resolve(i18nPath, "zh.json")
};

export function localReset() {
  Object.values(files).forEach((path) => {
    writeFileSync(path, "{}");
  });
}

export function setLocals(data: [name: string, zh: string, en: string][]) {
  Object.keys(files).forEach((language) => {
    try {
      const json = {};
      const path = (files as any)[language];
      data.forEach((item) => {
        const value = item[language === "zh" ? 1 : 2];
        set(json, item[0], value);
      });
      writeFileSync(path, JSON.stringify(json, null, 2));
    } catch (e: any) {
      console.log("解析失败", e.message);
    }
  });
}
