// nodemon --watch 'src/index.ts' --exec 'rimraf dist && esbuild src/index.ts --bundle --platform=node --outfile=dist/index.js --external:'
import { build } from "esbuild";
import { resolve } from "path";
import { dependencies } from "../package.json";
import { statSync } from "fs-extra";

const input = rootResolve("src/index.ts");
const output = rootResolve("dist/index.js");
let startTime = new Date().getTime();

function rootResolve(...paths: string[]) {
  return resolve(__dirname, "..", ...paths);
}

function getInfo() {
  const stat = statSync(output);
  return {
    time: new Date().getTime() - startTime,
    size: formatFileSize(stat.size)
  };
}

function formatFileSize(fileSize: number) {
  if (fileSize < 1024) {
    return fileSize + "B";
  } else if (fileSize < 1024 * 1024) {
    return (fileSize / 1024).toFixed(2) + "KB";
  } else if (fileSize < 1024 * 1024 * 1024) {
    return (fileSize / (1024 * 1024)).toFixed(2) + "MB";
  } else {
    return (fileSize / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }
}

build({
  entryPoints: [input],
  outfile: output,
  bundle: true,
  watch: {
    onRebuild(error, result) {
      startTime = new Date().getTime();
      if (error) return console.error("监视构建失败：", error);
      console.log("监视构建成功：", getInfo());
    }
  },
  platform: "node",
  external: ["ejs", "fs-extra", "inquirer", "sevmer", "npminstall"]
}).then((res) => {
  console.log("编译成功: ", getInfo());
  if (process.argv.includes("--only-build")) process.exit(0);
});
