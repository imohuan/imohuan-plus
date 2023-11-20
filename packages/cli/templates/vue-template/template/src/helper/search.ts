import Fuse from "fuse.js";
import { defaultsDeep } from "lodash-es";

const defaultOptions = {
  // 指示比较是否应区分大小写
  isCaseSensitive: false,
  // 分数是否应包含在结果集中。分数0表示完全匹配，而分数1表示完全不匹配
  includeScore: false,
  // 是否按分数对结果列表进行排序
  shouldSort: true,
  // 匹配项是否应包含在结果集中。当 时true，结果集中的每条记录都将包含匹配字符的索引。因此，这些可用于突出显示目的
  includeMatches: false,
  // 当为真时，匹配函数将继续到搜索模式的结尾，即使字符串中已经找到了完美匹配
  findAllMatches: false,
  // 仅返回长度超过此值的匹配项。（例如，如果您想忽略结果中的单个字符匹配，请将其设置为2）
  minMatchCharLength: 1,
  // 大致确定文本中预期要找到的模式的位置。
  location: 0,
  // 匹配算法在什么时候放弃。阈值0.0需要完美匹配（字母和位置），阈值1.0可以匹配任何内容。
  threshold: 0.6,
  // 确定匹配必须与模糊位置（由 指定location）的接近程度。distance与模糊位置相距字符的精确字母匹配将计分为完全不匹配。A distanceof0要求匹配在location指定的精确位置。距离 of1000需要完美匹配才能在使用of找到800的字符内。locationthreshold0.8
  distance: 100,
  // 当时true，它允许使用类似 unix 的搜索命令。见例子
  useExtendedSearch: false,
  // 当true, 搜索将忽略 location and distance，因此模式出现在字符串中的哪个位置无关紧要
  ignoreLocation: false,
  // 当 时true，相关性分数的计算（用于排序）将忽略字段长度范数。
  ignoreFieldNorm: false,
  // 确定字段长度规范对评分的影响程度。的值0相当于忽略字段长度规范。值0.5将大大降低字段长度规范的影响，而值2.0将大大增加它。
  fieldNormWeight: 1,
  // 将被搜索的键列表。这支持嵌套路径、加权搜索、在字符串和对象数组中搜索
  keys: []
  // 用于在提供的路径中检索对象值的函数。默认也将搜索嵌套路径。
  // (obj: T, path: string | string[]) => string | string[]
  // getFn() {}
  // sortFn() {}
};

const customOptions = {
  // 不区分大小写
  isCaseSensitive: false,
  // 忽略 location and distance
  ignoreLocation: true,
  // 分数包含在结果集中
  includeScore: true
};

// {
//   keys: [
//     { name: "class", weight: 0.5 },
//     { name: "body", weight: 0.4 },
//     { name: "title", weight: 0.3 },
//     { name: "keywords", weight: 0.3 }
//   ];
// }

export const useFuse = (list: any[], option: any = {}) => {
  return new Fuse(list, defaultsDeep({}, option, customOptions, defaultOptions));
};
