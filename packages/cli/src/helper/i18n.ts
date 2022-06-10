import { I18n } from "i18n";
import { defaultsDeep } from "lodash-es";
import { resolve } from "path";

export const i18n = new I18n();
export const languages = ["en", "zh"];

export const initI18n = (options?: i18n.ConfigurationOptions) => {
  i18n.configure(
    defaultsDeep(options, {
      locales: languages,
      directory: resolve(__dirname, "../locales")
    })
  );

  i18n.setLocale("en");
  return i18n;
};

export const get = (key: string, num: number = 0) => {
  return i18n.__n(key, num);
};
