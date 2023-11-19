import { execa } from "execa";
import { buildSync } from "esbuild";

// 1. 找到所有的依赖
async function main() {
  const code = `node -e "console.log(process.cwd())"`;
  const { stdout } = await execa("pnpm", ["-r", "exec", code], { stdout: "pipe" });
  const packagePaths = stdout.split("\n");
}

async function build(packagePath: string) {
  build;
}

main();
