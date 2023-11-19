import { resolve } from "path";
import Unocss from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { createStyleImportPlugin, ElementPlusResolve } from "vite-plugin-style-import";
import Components from "unplugin-vue-components/vite";
import { defineConfig } from "vite";

import presetAttributify from "@unocss/preset-attributify";
import presetUno from "@unocss/preset-uno";
import transformerDirectives from "@unocss/transformer-directives";
import transformerVariantGroup from "@unocss/transformer-variant-group";

import { presetScalpel } from "unocss-preset-scalpel";
import { presetScrollbar } from "unocss-preset-scrollbar";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "./",
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
      c: resolve(__dirname, "src", "components"),
    },
  },
  plugins: [
    vue(),
    Unocss({
      presets: [presetUno(), presetAttributify({}), presetScalpel(), presetScrollbar()],
      transformers: [
        transformerVariantGroup(),
        transformerDirectives({ applyVariable: ["--at-apply", "--uno-apply", "--uno"] }),
      ],
      theme: {
        colors: {
          tw: {
            primary: "var(--primary)",
            secondary: "var(--secondary)",
            accent: "var(--accent)",
            dark: "var(--dark)",
            positive: "var(--positive)",
            negative: "var(--negative)",
            info: "var(--info)",
            warning: "var(--warning)",
          },
        },
        breakpoints: {
          xs: "320px",
          sm: "640px",
        },
      },
      shortcuts: [
        {
          center: "flex items-center justify-center",
          "center-x": "flex items-center",
          "center-y": "flex justify-center",
          between: "flex items-center justify-between",
          around: "flex items-center space-around",
          "absolute-x-center": "absolute left-50% -translate-x-50%",
          "absolute-y-center": "absolute top-50% -translate-y-50%",
          "absolute-center": "absolute left-50% top-50% -translate-x-50% -translate-y-50%",
          speed: "content-visibility-auto",
          "wh-full": "w-full h-full",
          "scroll-x": "overflow-y-hidden overflow-x-auto",
          "scroll-y": "overflow-x-hidden overflow-y-auto",
          "scrollbar-x": "scrollbar scrollbar-h-2 scrollbar-thumb-color-gray-400",
          "scrollbar-y": "scrollbar scrollbar-w-2 scrollbar-thumb-color-gray-400",
          "scrollbar-xy": "scrollbar-x scrollbar-y",
        },
        [/^btn-(.*)$/, ([, c]) => `bg-${c}-400 text-${c}-100 py-2 px-4 rounded-lg`],
      ],
      rules: [
        [/^wh-(\d+)$/, ([, d]) => ({ width: `${d}px`, height: `${d}px` })],
        [/^wh(\d+)$/, ([, d]) => ({ width: `${parseInt(d) / 4}rem`, height: `${parseInt(d) / 4}rem` })],
        [/^grid-auto-w-(\d+)$/, ([, d]) => ({ gridTemplateColumns: `repeat(auto-fill, ${d}px)` })],
        [/^grid-auto-h-(\d+)$/, ([, d]) => ({ gridTemplateRows: `repeat(auto-fill, ${d}px)` })],
      ],
    }),
    AutoImport({
      dts: resolve(process.cwd(), "typings/auto-imports.d.ts"), // dts: "./typings/auto-imports.d.ts",
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: [
        "vue",
        "vue-router",
        "pinia",
        "@vueuse/core",
        { "lodash-es": ["get", "set", "defaultsDeep", "lowerCase", "lowerFirst", "cloneDeep"] },
      ],
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: resolve(process.cwd(), "typings/components.d.ts"),
      resolvers: [ElementPlusResolver()],
    }),
    createStyleImportPlugin({
      resolves: [ElementPlusResolve()],
      libs: [],
    }),
  ],
});
