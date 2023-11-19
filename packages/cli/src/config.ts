/** 用户主目录 */
export const USER_HOME = process.env.HOME || process.env.USERPROFILE || require("node-homedir")();

/** Node 最低版本要求 */
export const LOWEST_NODE_VERSION = "12.0.0";

export const CREATE_TEMPLATE = {
  "vite-lib": "https://github.com/imohuan/vite-lib",
  "vite-lib-packages": "https://github.com/imohuan/vite-lib-packages",
  "midway-ts-serverless": "https://github.com/imohuan/midway-ts-serverless",
  "midway-ts": "https://github.com/imohuan/midway-ts",
  "vite-vue3-ts": "https://github.com/imohuan/vue-template",
  "vite-vue3-unocss": "https://github.com/imohuan/vite-vue3-unocss"
};
