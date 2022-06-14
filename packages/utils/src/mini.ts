import { createHash } from "crypto";
import { get, isObject, random } from "lodash-es";

/**
 * 延迟
 * @param timeout 超时
 * @returns
 */
export function delay(timeout = 1000) {
  return new Promise((_resolve) => setTimeout(() => _resolve(true), timeout));
}

/**
 * 通配符匹配
 * @param s 待匹配字符串
 * @param p 通配符字符串
 * @returns boolean
 */
export const globStr = (s: string, p: string) => {
  // 构造 dp 函数
  let dp = [];
  for (let i = 0; i <= s.length; i++) {
    let child = [];
    for (let j = 0; j <= p.length; j++) {
      child.push(false);
    }
    dp.push(child);
  }
  dp[s.length][p.length] = true;
  // 执行
  for (let i = p.length - 1; i >= 0; i--) {
    if (p[i] != "*") break;
    else dp[s.length][i] = true;
  }

  for (let i = s.length - 1; i >= 0; i--) {
    for (let j = p.length - 1; j >= 0; j--) {
      if (s[i] == p[j] || p[j] == "?") {
        dp[i][j] = dp[i + 1][j + 1];
      } else if (p[j] == "*") {
        dp[i][j] = dp[i + 1][j] || dp[i][j + 1];
      } else {
        dp[i][j] = false;
      }
    }
  }
  return dp[0][0];
};

/**
 * 随机返回数组中的一个值
 * @param arr 数组
 * @returns 随机数组值
 */
export function arrRandom(arr: any[]) {
  return arr[random(0, arr.length - 1)];
}

/**
 * 获取一个对象中所有的值， 并且过滤掉空值和不匹配regexp的值
 * @param obj 对象
 * @param regexp 正则表达式
 */
export function getValue(data: any, regexp: RegExp = /.+/): any {
  const values = Object.values(data);
  return values
    .map((m: any) => (isObject(m) ? getValue(m, regexp) : m && regexp.test(m) ? m : false))
    .flat()
    .filter((f) => f);
}

/**
 * md5 加密
 * @param content 需要加密的内容
 * @param len 加密的保留长度
 */
export function md5(content: string, len?: number): string {
  const result = createHash("md5").update(content).digest("hex");
  return result.substring(0, len || result.length);
}

/**
 * 合并数组对象，按照对应key内容重复将合并为同一个对象
 * @param arr 数组
 * @param margeName 需要合并的对象名称
 * @returns 合并后的数组
 * @example [{name: 'a', age: 1}, {name: 'a', age: 2}] => [{name: 'a', age: 1, children: [{name: "a", age: 2}]}]
 */
export function mergeArrayForField(arr: any[], margeName: string) {
  const keys: string[] = [];
  const result: any = [];
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    const value = get(item, margeName, false);
    const fIndex = keys.indexOf(value);
    if (fIndex === -1) {
      keys.push(value || `None-${Math.random().toString().slice(3, 13)}`);
      result.push(item);
    } else {
      if (!result[fIndex]["children"]) result[fIndex]["children"] = [];
      result[fIndex]["children"].push(item);
    }
  }
  return result;
}
