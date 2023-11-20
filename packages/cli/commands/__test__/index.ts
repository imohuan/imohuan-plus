import { Command } from "commander";
import init from "@imohuan-plus/init-command";

const program = new Command();
program
  .name("Test")
  .usage("[command] [options]")
  .option("-d, --debug", "是否开启调试模式", false)
  .option("-tp, --targetPath <targetPath>", "是否指定本地调试文件路径", "");

program
  .command("init [projectName]")
  .description("创建项目模板")
  // .option("--packagePath <packagePath>", "手动指定init包路径")
  .option("-f, --force", "是否强制初始化项目")
  .action(exec);

function exec() {
  const command: Command = arguments[arguments.length - 1];

  // const code = `require('${main.replace(/\\/g, "/")}').default.call(null, ${strArgs})`;
  // const child = execa("node", ["-e", code], { cwd: process.cwd(), stdio: "inherit" });
  // child.on("error", (e) => {
  //   logger.verboseError(e);
  //   process.exit(1);
  // });

  // child.on("exit", (e: number) => {
  //   if (e === 0) logger.verbose(`命令 ${name} 执行成功`);
  //   else logger.error(`命令 ${name} 执行失败`);
  //   process.exit(e);
  // });
}

program.parse();
