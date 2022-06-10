import { ChildProcess, spawn } from "child_process";

export const run = (cmd: string, print = false): ChildProcess => {
  const npx = process.platform === "win32" ? "npx.cmd" : "npx";
  return spawn(npx, cmd.split(" "), {
    stdio: print ? "inherit" : "pipe",
    cwd: process.cwd()
  });
};

export const runSync = (cmd: string, print = false): Promise<boolean> => {
  return new Promise((_resolve) => {
    const result = run(cmd, print);
    result.addListener("close", () => _resolve(true));
    result.addListener("exit", () => _resolve(false));
  });
};
