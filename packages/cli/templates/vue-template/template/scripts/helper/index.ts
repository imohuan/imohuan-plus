import { ChildProcess, spawn } from "child_process";
import { build, BuildOptions } from "esbuild";
import { readdirSync } from "fs-extra";
import { isArray, defaultsDeep } from "lodash";
import { basename, resolve } from "path";
import { ConfigEnv, loadEnv, UserConfigExport } from "vite";

import defaultViteConfig from "../../vite.config";

type Env = NodeJS.ProcessEnv & ViteEnv & { [key: string]: any };

/** 延迟操作 */
export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(() => resolve(true), time));
};

/** 根据根目录进行resolve */
export const rootResolve = (...paths: string[]) => {
  return resolve(__dirname, "../..", ...paths);
};

/** 找目录中包含后缀的文件地址列表 */
export const findPaths = (path: string, ext: string = "ts") => {
  return readdirSync(path)
    .filter((p) => p.endsWith(`.${ext}`))
    .map((m) => resolve(path, m));
};

/** 合并 Vite 配置（自定义配置 + 根目录下的Vite配置） */
export const buildViteConfig = (
  configFn: (config: ConfigEnv & { env: Env }) => Partial<UserConfigExport>
) => {
  return ({ command, mode }: ConfigEnv): UserConfigExport => {
    const env = defaultsDeep(loadEnv(mode, process.cwd()), process.env);
    const defaultConfig = defaultViteConfig({ command, mode });
    return Object.assign(defaultConfig, configFn({ command, mode, env }));
  };
};

/** 运行命令 */
export const run = (cmd: string, print = false): ChildProcess => {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  console.log("执行命令: ", npx, cmd);
  return spawn(npx, cmd.split(" "), {
    stdio: print ? "inherit" : "pipe",
    cwd: process.cwd()
  });
};

/** 同步运行命令（Promise） */
export const runSync = (cmd: string, print = false): Promise<boolean> => {
  return new Promise((_resolve) => {
    const result = run(cmd, print);
    result.addListener("close", () => _resolve(true));
    result.addListener("exit", () => _resolve(false));
  });
};

/** 编译输入文件 */
export const buildInput = (inputFiles: string | string[]): Promise<any> => {
  inputFiles = isArray(inputFiles) ? inputFiles : [inputFiles];
  return Promise.all(
    inputFiles.map((inputFile) => {
      const name = basename(inputFile, ".ts");
      const option: BuildOptions = {
        entryPoints: [inputFile],
        outfile: rootResolve("dist/main", `${name}.js`),
        bundle: true,
        sourcemap: true,
        platform: "node",
        minify: true,
        external: ["electron", "vue"]
      };
      return build(option);
    })
  );
};
