import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// 配置： https://github.com/antfu/unplugin-auto-import#
export function Scripts(env: ViteEnv) {
  return AutoImport({
    // 目标转换
    include: [
      /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
      /\.vue$/,
      /\.vue\?vue/, // .vue
      /\.md$/ // .md
    ],
    // 全球 入口 配置
    imports: [
      "vue",
      "vue-router",
      "quasar",
      "pinia",
      "@vueuse/head",
      "@vueuse/core",
      // 自定义: import { default as axios } from 'axios',
      {
        lodash: ["get", "set", "defaultsDeep", "lowerCase", "lowerFirst", "cloneDeep"]
      }
    ],

    // 生成对应的 .eslintrc-auto-import.json文件
    // Eslint全局配置 - https://eslint.org/docs/user-guide/configuring/language-options#specifying-globals
    eslintrc: {
      enabled: false, // Default `false`
      filepath: "./.eslintrc-auto-import.json", // Default `./.eslintrc-auto-import.json`
      globalsPropValue: true // Default `true`, (true | false | 'readonly' | 'readable' | 'writable' | 'writeable')
    },

    // 自定义解析器
    // see https://github.com/antfu/unplugin-auto-import/pull/23/
    resolvers: [ElementPlusResolver()],

    dts: "./typings/auto-imports.d.ts"
  });
}
