/**
 * 时间延迟
 * @param timeout 延迟时间 默认: 1（`1000`）
 */
export function delayTime(timeout: number = 1000) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}
