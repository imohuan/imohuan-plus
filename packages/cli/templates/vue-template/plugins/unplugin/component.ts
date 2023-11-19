import IconsResolver from "unplugin-icons/resolver";
import _Icons from "unplugin-icons/vite";
import {
  QuasarResolver,
  ElementPlusResolver,
  VueUseComponentsResolver
} from "unplugin-vue-components/resolvers";
import _Components from "unplugin-vue-components/vite";

import { customCollections } from "./icon";
import { resolve } from "path";

export function Components(env: ViteEnv) {
  return _Components({
    // 生成声明文件
    dts: resolve(process.cwd(), "typings/components.d.ts"),
    // 要搜索组件的目录的相对路径。
    dirs: [`${env.VITE_DIR}/components`],
    // 搜索子目录
    deep: true,
    // 组件的有效文件扩展名。
    extensions: ["vue", "md"],
    // 自动导入指令
    directives: true,
    // 用于转换目标的过滤器
    include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
    // 用于自定义组件的解析器
    resolvers: [
      QuasarResolver(),
      ElementPlusResolver(),
      VueUseComponentsResolver(),
      IconsResolver({
        alias: { park: "icon" },
        customCollections: Object.keys(customCollections)
      })
    ],
    // 允许子目录作为组件的名称空间前缀.
    directoryAsNamespace: false,
    // 忽略名称空间前缀的子目录路径
    // 当'directoryAsNamespace: true '时工作
    globalNamespaces: []
    // 在解析之前转换路径
    // importPathTransform: v => v,
    // 允许组件使用相同的名称覆盖其他组件
    // allowOverrides: false,
  });
}
