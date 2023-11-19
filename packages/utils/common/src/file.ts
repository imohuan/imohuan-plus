import { upperFirst } from "lodash-es";

/** 格式化文件大小 */
export function formatSize(fileSize: number) {
  const unitArr = new Array("bytes", "kib", "mb", "gb", "tb", "pb", "eb", "zb", "yz");
  if (!fileSize) return `0 ${upperFirst(unitArr[0])}`;
  const index = Math.floor(Math.log(fileSize) / Math.log(1024));
  const size = fileSize / Math.pow(1024, index);
  return size.toFixed(2) + " " + upperFirst(unitArr[index]);
}
