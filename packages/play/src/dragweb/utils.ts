import { difference, get, isArray, isBoolean, isString, set } from "lodash-es";

import { RenderVNode } from "./interface";

export const strcopy = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export const strToFunction = (str: string) => {
  try {
    const fun = new Function(`return ${str}`)();
    return fun;
  } catch (e) {
    return false;
  }
};

export const setWindowValues = (function () {
  let oldList: any = [];
  return (data: any, prefix = "$") => {
    const list = Object.keys(data);
    difference(oldList, list).forEach((key) => delete window[`${prefix}${key}` as any]);
    list.forEach((key) => {
      set(window, `${prefix}${key}`, data[key]);
    });
    oldList = list;
  };
})();

/**
 * 生成配置
 * @param data 基本数据属性
 * @param field 字段名称
 * @param configs 字段值，用来给字段赋值
 * @returns 生成对应字段的多种值的列表
 */
export const createConfig = (data: RenderVNode, field: string, configs: any[]): RenderVNode[] => {
  return configs.map((config: any) => {
    const result = JSON.parse(JSON.stringify(data));
    set(result.attr, field, config);
    return result;
  });
};

/**
 * 创建配置属性
 * @param data 基本配置属性
 * @param fields 字段 如：{ type: "xxx", disabled: boolean, size: xxx } -> 我们会分别给基本配置中添加对应的属性
 * @param persistent 需要添加进入基本配置属性的名称 type:['xx', 'sss'] -> 我们会循环添加到基本配置，然后循环添加data中的其他属性
 * @returns 最后生成配置列表
 */
export const createListItemConfig = (data: RenderVNode, fields: any, persistent: string) => {
  const result: any = { show: data, list: [] };
  const persistents = persistent.split(" ").map((m) => m.trim());
  const __base_data = strcopy(data);
  const __base_data_list: any = [];

  let len = 0;

  persistents.forEach((persistent) => {
    const value = get(fields, persistent, false);
    if (!value) return;
    __base_data_list.push(...createConfig(strcopy(__base_data), persistent, value));
    delete fields[persistent];
    if (len === 0) len = isArray(value) ? value.length : 1;
  });

  result.list.push(...__base_data_list);

  Object.keys(fields).forEach((field) => {
    isBoolean(fields[field]) && (fields[field] = [true]);
    __base_data_list.forEach((item: any) => {
      result.list.push(...createConfig(item, field, fields[field]));
    });
  });

  console.log(result);

  return result;
};

/**
 * 获取对象中的 (onXXXX)字符串函数
 * @param data 对象
 * @returns 对象  { onXX: function(){}, onXX2: function(){}  } 和其他不是函数的对象
 */
export const getObjStrFunToMap = (data: any) => {
  const others: any = {};
  const events = Object.keys(data)
    .map((key) => {
      const value: any = data[key];
      const fun = strToFunction(value);
      const isFunction = key.startsWith("on") && isString(value) && fun;
      return isFunction ? { status: true, key, fun } : { status: false, key, value };
    })
    .reduce((result: any, item: any) => {
      if (item.status) result[item.key] = item.fun;
      else others[item.key] = item.value;
      return result;
    }, {});

  return {
    events,
    others
  };
};
