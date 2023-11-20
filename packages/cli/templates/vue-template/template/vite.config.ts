import moment from "moment";
import { resolve } from "path";
import { ConfigEnv, loadEnv, UserConfigExport } from "vite";

import pkg from "./package.json";
import { getPluginsList } from "./plugins/index";

// 当前执行node命令时文件夹的地址（工作目录）
const root: string = process.cwd();

// 路径查找
const pathResolve = (dir: string): string => {
  return resolve(__dirname, ".", dir);
};

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const env: ViteEnv = loadEnv(mode, root) as any;
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY_DOMAIN, VITE_PROXY_DOMAIN_REAL } = env;

  // 全局配置信息
  const { dependencies, devDependencies, name, version } = pkg;
  const __APP_INFO__ = {
    pkg: { dependencies, devDependencies, name, version },
    lastBuildTime: moment().format("YYYY-MM-DD HH:mm:ss")
  };

  // 设置别名
  const alias: Record<string, string> = {
    "@": pathResolve("src"),
    c: pathResolve("src/components")
  };

  // 配置代理服务
  const proxy: any = {};
  if (VITE_PROXY_DOMAIN_REAL.length > 0) {
    proxy[VITE_PROXY_DOMAIN] = {
      ws: true,
      target: VITE_PROXY_DOMAIN_REAL,
      changeOrigin: true,
      rewrite: (path: string) => path.replace(new RegExp(VITE_PROXY_DOMAIN, "g"), "")
    };
  }

  return {
    clearScreen: true,
    root,
    base: VITE_PUBLIC_PATH,
    resolve: { alias },
    css: {
      // https://github.com/vitejs/vite/issues/5833
      postcss: {
        plugins: [
          {
            postcssPlugin: "internal:charset-removal",
            AtRule: {
              charset: (atRule) => {
                if (atRule.name === "charset") {
                  atRule.remove();
                }
              }
            }
          }
        ]
      }
    },
    server: { https: false, port: parseInt(VITE_PORT), host: "0.0.0.0", proxy },
    plugins: getPluginsList(command, env),
    optimizeDeps: {
      include: ["vue-router", "pinia", "lodash-es", "@vueuse/core"]
    },
    build: {
      outDir: resolve(__dirname, "dist"),
      assetsDir: "assets",
      emptyOutDir: true,
      sourcemap: false,
      // 设置为false将禁用用于构建的brotli压缩大小报告。可以稍微提高构建速度。
      brotliSize: false,
      // 消除打包大小超过500kb警告
      chunkSizeWarningLimit: 2000,
      rollupOptions: { input: "index.html" }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
};
