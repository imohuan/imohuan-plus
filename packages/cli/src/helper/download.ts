import chalk from "chalk";
import gitDownload from "download-git-repo";
import { existsSync, removeSync } from "fs-extra";
import inquirer from "inquirer";
import { defaultsDeep } from "lodash";
import ora from "ora";
import { resolve } from "path";

interface DownloadOption {
  force: boolean;
  branch: string;
}

interface DownloadResult {
  status: boolean;
  message: any;
}

export const download = (
  gitUrl: string,
  dist: string,
  options?: Partial<DownloadOption>
): Promise<DownloadResult> => {
  const ops: DownloadOption = defaultsDeep(options || {}, {
    branch: "master",
    force: false
  } as DownloadOption);
  return new Promise(async (_resolve) => {
    const dirname = resolve(process.cwd(), dist);
    if (existsSync(dirname)) {
      if (ops.force) {
        removeSync(dirname);
      } else {
        const { isDelete } = await inquirer.prompt([
          {
            type: "list",
            message: "项目已经存在，请选择处理方式",
            name: "isDelete",
            choices: ["删除", "取消"]
          }
        ]);
        if (isDelete === "取消") return;
        if (isDelete === "删除") {
          const spinner = ora(chalk.green.bold("删除项目中")).start();
          removeSync(dirname);
          spinner.stop();
        } else {
          return _resolve({ status: false, message: "取消了当前操作" });
        }
      }
    }

    const url = `direct:${gitUrl}#${ops.branch}`;
    const spinner = ora(chalk.green.bold("正在下载模板")).start();
    gitDownload(url, dirname, { clone: true }, (err: Error) => {
      if (err && err.message.indexOf("git checkout") === -1 && !existsSync(dirname))
        _resolve({ status: false, message: err.message });
      else _resolve({ status: true, message: dirname });
      spinner.stop();
    });
  });
};
