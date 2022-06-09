import chalk from "chalk";
import { program } from "commander";
import { promisify } from "util";

import { Ctx } from "./context";

const figlet: any = promisify(require("figlet"));

export function main(ctx: Ctx) {
  const title = chalk.green.bold(
    figlet.textSync(name, {
      horizontalLayout: "Isometric1",
      verticalLayout: "default",
      width: 300,
      whitespaceBreak: true
    })
  );

  program.name(`\n${title}\n`).description("CL I to some JavaScript string utilities");
  program.version("0.0.1", "-v, --version");

  // program.option("--first");
  // program.option("-s, --separator <char>");

  program
    .command("split")
    .description("Split a string into substrings and display as an array")
    .argument("<string>", "string to split")
    .option("--first", "display just the first substring")
    .option("-s, --separator <char>", "separator character", ",")
    .action((str, options) => {
      const limit = options.first ? 1 : undefined;
      console.log(str.split(options.separator, limit));
    });

  program.command("duplicate").summary("make a copy")
    .description(`Make a copy of the current project.
  This may require additional disk space.
    `);

  program.parse();
  const options = program.opts();
  // const limit = options.first ? 1 : undefined;
  // console.log(program.args, options, program.args[0].split(options.separator, 1));

  // program.outputHelp({ error: false });
  // const msg = program.helpInformation();
  // console.log("11msg", msg);
  // console.log(options);

  // program.on("help", () => {});

  // const h = program.createHelp();
  // console.log("h", h);
}
