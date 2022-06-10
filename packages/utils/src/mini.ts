export function delay(timeout = 1000) {
  return new Promise((_resolve) => setTimeout(() => _resolve(true), timeout));
}
