import chalk from "chalk";
import { copySync, readFileSync, writeFileSync } from "fs-extra";
import inquirer from "inquirer";
import { defaultsDeep } from "lodash-es";
import { resolve } from "path";
import { rootResolve } from "../helper/index";

const electronConfig = {
  main: "./dist/main/index.js",
  scripts: {
    ele: "esno ./scripts/electron/index.ts -w",
    "ele-build": "esno ./scripts/electron/index.ts",
    "build-icon":
      "electron-icon-builder --input=./public/android-chrome-512x512.png --output=./dist --flatten",
    pack: "electron-builder --win --x64",
    all: "rimraf dist && rimraf build && pnpm build && pnpm ele-build && pnpm build-icon && pnpm run pack"
  },
  dependencies: {
    "@electron/remote": "^2.0.8"
  },
  devDependencies: {
    chokidar: "^3.5.3",
    electron: "^18.2.3",
    "electron-builder": "^23.3.3",
    "electron-connect": "^0.6.3",
    "electron-icon-builder": "^2.0.1",
    "electron-is-dev": "^2.0.0",
    "electron-updater": "^5.0.1",
    "vite-plugin-electron": "^0.4.4"
  },
  build: {
    asar: false,
    appId: "com.imohuan.manhua",
    productName: "Crawler",
    copyright: "Copyright © 2021 Alaso",
    compression: "maximum",
    directories: {
      buildResources: "dist",
      output: "build"
    },
    publish: null,
    files: ["dist/icons/**", "dist/main/**", "dist/renderer/**"],
    electronDownload: {
      mirror: "https://npm.taobao.org/mirrors/electron/"
    },
    win: {
      icon: "dist/icons/icon.ico",
      target: [
        {
          target: "nsis",
          arch: ["x64"]
        }
      ],
      artifactName: "${productName}_setup_${version}.${ext}"
    },
    nsis: {
      oneClick: false,
      perMachine: false,
      allowToChangeInstallationDirectory: true,
      installerIcon: "dist/icons/icon.ico",
      uninstallerIcon: "dist/icons/icon.ico",
      installerHeaderIcon: "dist/icons/icon.ico",
      deleteAppDataOnUninstall: false,
      createDesktopShortcut: true,
      createStartMenuShortcut: true
    }
  }
};

console.log(chalk.red.bold("此操作会覆盖你的Package.json中的部分字段，请谨慎操作！"));

inquirer
  .prompt([
    {
      type: "input",
      message: "AppId 名称",
      name: "appid",
      default: "com.imohuan.project"
    },
    {
      type: "input",
      message: "软件 名称",
      name: "name",
      default: "无"
    }
  ])
  .then((res) => {
    electronConfig.build.appId = res.appid;
    electronConfig.build.productName = res.name;
    try {
      // const testPath = resolve(__dirname, "1.json");
      const packagePath = resolve(__dirname, "../../package.json");
      const packageJSON = JSON.parse(readFileSync(packagePath).toString());
      writeFileSync(
        packagePath,
        JSON.stringify(defaultsDeep(electronConfig, packageJSON), null, 2)
      );
      copySync(resolve(__dirname, "src-electron"), rootResolve("src-electron"));
      copySync(resolve(__dirname, "electron-plugin.txt"), rootResolve("plugins/electron/index.ts"));
      console.log(
        `
${chalk.green.bold("操作成功，请自行安装依赖！")}
  ${chalk.gray.bold("pnpm i")}

${chalk.red.bold(
  "请自己修改 plugins/index.ts， 添加Electron插件，直接导入 ./electon/index.ts 即可"
)}

${chalk.blue.bold("新增命令: ")}
  ${chalk.gray.bold("ele".padEnd(16, " "))}${chalk.white.bold("开启ELectron服务，并且监听文件变化")}
  ${chalk.gray.bold("ele-build".padEnd(16, " "))}${chalk.white.bold("编译Electron文件")}
  ${chalk.gray.bold("build-icon".padEnd(16, " "))}${chalk.white.bold("编译图标")}
  ${chalk.gray.bold("pack".padEnd(16, " "))}${chalk.white.bold("打包Electron软件")}
  ${chalk.gray.bold("all".padEnd(16, " "))}${chalk.white.bold("编译所有资源进行打包")}
`
      );
    } catch (err) {
      console.log(chalk.red.bold("初始化Electron失败: "), chalk.gray.bold(err.message));
    }
  });
