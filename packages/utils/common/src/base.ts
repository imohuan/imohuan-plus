import { createHash } from "crypto";
import { readFileSync } from "fs";
import { defaultsDeep } from "lodash-es";

/**
 * 文本转Md5
 * @param content 需要转换的内容(默认为随机值)
 */
export function md5(content: string = Math.random().toString()) {
  return createHash("md5").update(content).digest("hex");
}

/** 克隆对象 */
export function cloneData(data: any) {
  return JSON.parse(JSON.stringify(data));
}

/** 加载JSON文件 */
export function loadJson(path: string) {
  try {
    return defaultsDeep(JSON.parse(readFileSync(path).toString()), {});
  } catch {
    return {};
  }
}
