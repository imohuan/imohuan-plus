import { ensureFileSync, readdirSync, readFileSync, writeFileSync, ensureDirSync } from "fs-extra";
import { resolve } from "path";

import { runSync } from "../helper/index";
import { buildHead, GmFunctions, RunAt } from "./src/user-script";

const configPath = resolve(__dirname, "src/vite.config.ts");
const main = async () => {
  await runSync(`vite build --config ${configPath}`, true);
  const distPath = resolve(process.cwd(), "dist");
  ensureDirSync(distPath);

  console.log(readdirSync(distPath));

  const outJsName = readdirSync(distPath)
    .filter((f) => f.startsWith("main.") && f.endsWith(".js"))
    .shift();

  if (!outJsName || !outJsName.trim()) {
    throw new Error("未找到对应文件");
  }

  const outFileString = readFileSync(resolve(distPath, outJsName)).toString();
  await runSync("rimraf dist");

  const head = buildHead({
    name: "Hello world",
    namespace: "",
    description: "",
    version: "1.0.0",
    includes: ["*://*"],
    grants: [GmFunctions.unsafeWindow],
    runAt: RunAt.document_start,
    requires: ["https://cdn.tailwindcss.com"]
  });
  const outJs = `${head}\n(async () => {\n${outFileString}\n})()`;
  const outFilePath = resolve(distPath, "index.js");
  ensureFileSync(outFilePath);
  writeFileSync(outFilePath, outJs);
};
main();
