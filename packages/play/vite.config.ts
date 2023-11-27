import { defineConfig } from "vite";
import Vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from "unplugin-auto-import/vite";
import { ImohuanResolver } from "@imohuan-plus/components/resolver";
import Unocss from "unocss/vite";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Vue(),
    Unocss({ configFile: "./uno.config.ts" }),
    Components({ resolvers: [ImohuanResolver()] }),
    AutoImport({ resolvers: [ImohuanResolver()] })
  ]
});
