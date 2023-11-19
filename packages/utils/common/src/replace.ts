import { get, isArray, isObject } from "lodash-es";

/**
 * 替换字符中的变量
 * @param str 字符串 案例: `Hello {name}！`, 找不到变量则为 undefined
 * @param varOption 需要替换的变量对象
 * @returns 替换后的字符串
 */
export function replaceVar(str: string, varOption: any = {}): string {
  return str.replace(/\{([_a-zA-Z0-9]+)\}/g, (_, key) => {
    const val = get(varOption, key, "undefined");
    if (isArray(val)) return val.join(" ");
    if (isObject(val)) return JSON.stringify(val, null, 2);
    return val;
  });
}
