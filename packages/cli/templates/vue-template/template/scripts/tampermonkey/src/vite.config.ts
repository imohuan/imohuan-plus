import { resolve } from "path";
import { visualizer as Visualizer } from "rollup-plugin-visualizer";

import { quasar as Quasar, transformAssetUrls } from "@quasar/vite-plugin";
import vue from "@vitejs/plugin-vue";

// import legacy from "@vitejs/plugin-legacy";
// import { Compression } from "../../../plugins/compression";
// import { getPluginsList } from "../../../plugins/index";
// import { Inspect } from "../../../plugins/inspect";
import { Md } from "../../../plugins/md";
import { Unocss } from "../../../plugins/unocss";
import { Components, Icons, Scripts, Styles } from "../../../plugins/unplugin";
import { buildViteConfig } from "../../helper/index";

export default buildViteConfig(({ command, mode, env }) => {
  return {
    publicDir: "./xxxxx",
    plugins: [
      vue({
        reactivityTransform: true,
        include: [/\.vue$/, /\.md$/],
        template: {
          transformAssetUrls,
          compilerOptions: { isCustomElement: (tag) => ["webview"].includes(tag) }
        }
      }),
      // 自动导入
      Icons(env),
      Components(env),
      Styles(env),
      Scripts(env),
      // 检查
      Md(),
      Unocss(),
      Quasar({ sassVariables: "src/styles/theme-quasar.scss" })
      // Compression(),
      // Inspect()
    ],
    build: {
      assetsDir: ".",
      rollupOptions: {
        input: resolve(__dirname, "main.ts"),
        output: { format: "iife", inlineDynamicImports: true, name: "main.js" }
      }
    }
  };
});
