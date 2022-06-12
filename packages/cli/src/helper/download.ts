import chalk from "chalk";
import gitDownload from "download-git-repo";
import { existsSync, removeSync } from "fs-extra";
import inquirer from "inquirer";
import { defaultsDeep } from "lodash-es";
import ora from "ora";
import { resolve } from "path";
import { get } from "./i18n";

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
            message: get("download-exist"),
            name: "isDelete",
            choices: [get("delete"), get("cancel")]
          }
        ]);
        if (isDelete === get("cancel")) return;
        if (isDelete === get("delete")) {
          const spinner = ora(chalk.green.bold(get("remove-project"))).start();
          removeSync(dirname);
          spinner.stop();
        } else {
          return _resolve({ status: false, message: get("cancel-controller") });
        }
      }
    }

    const url = `direct:${gitUrl}#${ops.branch}`;
    console.log("url", url);
    const spinner = ora(chalk.green.bold(get("download-project"))).start();
    gitDownload(url, dirname, { clone: true }, (err: Error) => {
      if (err && err.message.indexOf("git checkout") === -1)
        _resolve({ status: false, message: err.message });
      else _resolve({ status: true, message: dirname });
      spinner.stop();
    });
  });
};
