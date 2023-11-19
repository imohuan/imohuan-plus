import { ChildProcess, exec, spawn } from "child_process";
import { removeSync, writeFileSync } from "fs-extra";

/** 运行 npx 相关的命令 */
export const run = (cmd: string, print = false): ChildProcess => {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  return spawn(npx, cmd.split(" "), {
    stdio: print ? "inherit" : "pipe",
    cwd: process.cwd()
  });
};

/** run方法 的 异步 */
export const runSync = (cmd: string, print = false): Promise<boolean> => {
  return new Promise((_resolve) => {
    const result = run(cmd, print);
    result.addListener("close", () => _resolve(true));
    result.addListener("exit", () => _resolve(false));
  });
};

/** window 剪切板（内部使用clip指令） */
export function copy(text: string): Promise<{ status: boolean; message: any }> {
  const filename = `result-${Math.random().toString(36).slice(2, 10)}.txt`;
  return new Promise(async (_resolve) => {
    const commandPath = `${filename}.bat`;
    writeFileSync(filename, text);
    writeFileSync(commandPath, `clip < ${filename}`);
    exec(commandPath, function (err, stdout, stderr) {
      removeSync(filename);
      removeSync(commandPath);
      if (err || stderr) return _resolve({ status: false, message: { err, stdout, stderr } });
      _resolve({ status: true, message: text });
    });
  });
}

export function openUrl(url: string) {
  switch (process.platform) {
    case "darwin":
      exec(`open ${url}`);
      break;
    case "win32":
      exec(`start ${url}`);
      break;
    default:
      exec(`xdg-open ${url}`);
  }
}
