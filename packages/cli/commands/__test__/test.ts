import { execa } from "execa";
import { resolve } from "path";

async function run() {
  await execa("npx", ["tsup", "src/index.ts", "--format", "cjs", "--minify"], {
    cwd: resolve(__dirname, "../../core"),
    stderr: "inherit",
    stdout: "inherit"
  });

  await execa("npx", ["tsup", "src/index.ts", "--format", "cjs", "--minify"], {
    cwd: resolve(__dirname, "../init"),
    stderr: "inherit",
    stdout: "inherit"
  });

  // G:\Project\imohuan-plus\packages\cli\core\bin\index.js init hhh -tp G:\Project\imohuan-plus\packages\cli\commands/__test__ -d
  const coreIndex = resolve(__dirname, "../../core/bin/index.js");
  const nodeModule = resolve(__dirname);
  execa("node", [coreIndex, "init", "test-name", "-d", "-tp", nodeModule], {
    // execa("node", [coreIndex, "-h"], {
    cwd: resolve(__dirname, "test"),
    stdio: "inherit"
    // stderr: "inherit",
    // stdout: "inherit"
  });
}
run();
