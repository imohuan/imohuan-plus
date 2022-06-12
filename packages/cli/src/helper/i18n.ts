import { I18n } from "i18n";
import { defaultsDeep } from "lodash-es";
import { resolve } from "path";

export const i18n = new I18n();
export const languages = ["en", "zh"];
export const i18nPath = resolve(__dirname, "../src/locales");

export const initI18n = (options?: i18n.ConfigurationOptions) => {
  i18n.configure(
    defaultsDeep(options, {
      locales: languages,
      directory: i18nPath
    })
  );

  return i18n;
};

export const get = (key: string, data: any = {}) => {
  return i18n.__mf(i18n.__(key), data);
};
