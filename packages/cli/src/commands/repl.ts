import { Command } from "commander";
import { initCommand } from "../helper/command";
import { VueParse } from "@imohuan/repl";
import { resolve } from "path";
import { writeFileSync } from "fs-extra";
import { get } from "../helper/i18n";
import chokidar from "chokidar";
import express from "express";
import { getCtx } from "../core/context";
import { openUrl } from "@imohuan/utils";
import ora from "ora";
import chalk from "chalk";

export function commandRepl(program: Command) {
  const ctx = getCtx();
  const repl = program.command("repl").description(get("repl-desc"));

  const startServer = (name?: string) => {
    return new Promise((_resolve) => {
      const app = express();
      app.use(express.static(process.cwd()));
      app.listen(3000, () => {
        ctx.logger.info(get("start-server"));
        ctx.logger.info(`${get("static")}: ${process.cwd()}`);
        ctx.logger.info(`${get("address")}: http://localhost:${3000}`);
        if (name) openUrl(`http://localhost:${3000}/${name}`);
        _resolve(true);
      });
    });
  };

  repl
    .command("build")
    .description(get("repl-build"))
    .argument("<path>", get("repl-build-desc"))
    .option("-o, --output", get("repl-path"))
    .action(async (path) => {
      try {
        const parse = new VueParse(resolve(process.cwd(), path), {});
        const { output } = repl.opts();
        const html = await parse.html();
        writeFileSync(resolve(process.cwd(), output || "output.html"), html);
      } catch (e) {
        ctx.logger.error(get("target-not-found"));
      }
    });

  repl
    .command("watch")
    .description(get("repl-watch-desc"))
    .argument("<dirname>", get("repl-build-desc"))
    .option("--start", get("repl-start"))
    .option("--open", get("repl-open"))
    .option("-o, --output", get("repl-path"))
    .action(async (dirname, { output, start, open }) => {
      const name = output || "output.html";
      const path = resolve(process.cwd(), name);
      if (start) await startServer(open ? name : null);

      const title = chalk.green.bold(get("repl-watch"));
      const spinner = ora(title).start();
      let timer: any = null;
      let index = 1;
      chokidar.watch(dirname).on("change", async () => {
        try {
          const startTime = new Date().getTime();
          const parse = new VueParse(resolve(process.cwd(), dirname), {});
          const html = await parse.html();
          writeFileSync(path, html);
          const time = new Date().getTime() - startTime;
          spinner.text =
            get("repl-build-ms", { time }) + (index > 1 ? chalk.red.bold(`x ${index}`) : "");
          index++;

          if (timer) clearTimeout();
          timer = setTimeout(() => {
            spinner.text = title;
            index = 1;
          }, 1000);
        } catch (e) {
          ctx.logger.error(get("target-not-found"));
        }
      });
    });

  repl
    .command("static")
    .description(get("repl-static"))
    .action(() => {
      startServer("");
    });

  repl
    .command("CDN")
    .description(get("cdn-desc"))
    .action(() => {
      // https://juejin.cn/post/7076724865083899935
    });

  initCommand(repl);
}
