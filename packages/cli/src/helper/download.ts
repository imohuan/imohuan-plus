import gitDownload from "download-git-repo";
import { existsSync, removeSync } from "fs-extra";
import inquirer from "inquirer";
import { defaultsDeep } from "lodash-es";
import { resolve } from "path";

interface DownloadOption {
  force: boolean;
  branch: string;
}

export const download = (gitUrl: string, dist: string, options?: Partial<DownloadOption>) => {
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
        const result = await inquirer.prompt([
          {
            type: "list",
            message: "项目已经存在，请选择处理方式",
            name: "isDelete",
            choices: ["删除", "取消"]
          }
        ]);

        if (result.isDelete === "删除") {
          removeSync(dirname);
        } else {
          return _resolve({ status: false, message: "取消了当前操作" });
        }
      }
    }

    gitDownload(`direct:${gitUrl}#${ops.branch}`, dirname, { clone: true }, (err: Error) => {
      if (err && err.message.indexOf("git checkout") === -1)
        _resolve({ status: false, message: err.message });
      else _resolve({ status: true });
    });
  });
};
