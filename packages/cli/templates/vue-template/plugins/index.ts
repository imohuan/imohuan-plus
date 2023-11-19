import { resolve } from "path";
import { visualizer as Visualizer } from "rollup-plugin-visualizer";

import { quasar as Quasar, transformAssetUrls } from "@quasar/vite-plugin";
import legacy from "@vitejs/plugin-legacy";
import vue from "@vitejs/plugin-vue";

import { Compression } from "./compression";
import { Custom } from "./custom";
import { Inspect } from "./inspect";
import { Md } from "./md";
import { Unocss } from "./unocss";
import { Components, Icons, Scripts, Styles } from "./unplugin";
import { Pwa } from "./pwa";

export function getPluginsList(command: "build" | "serve", env: ViteEnv) {
  const plugins = [
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
    Quasar({ sassVariables: "src/styles/theme-quasar.scss" }),
    Compression(),
    Custom(),
    Inspect(),
    Pwa(env),
    Visualizer({
      filename: resolve("dist/report.html"),
      open: false,
      gzipSize: true,
      brotliSize: true
    })
  ];

  if (env.VITE_LEGACY === "true") {
    plugins.push(
      legacy({
        targets: [
          "Android > 39",
          "Chrome >= 60",
          "Safari >= 10.1",
          "iOS >= 10.3",
          "Firefox >= 54",
          "Edge >= 15"
        ],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"]
      })
    );
  }
  return plugins.filter((f) => f).flat();
}
