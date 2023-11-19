import { gte } from "semver";
import { Logger, logger } from "@imohuan-plus/log";
import chalk from "chalk";
import {
  isArray,
  isObject,
  isString,
  difference,
  pick,
  defaultsDeep
} from "@imohuan-plus/utils-common";
import { LOWEST_NODE_VERSION } from "./configs";
import { ProcessEnv, SpinnerOption } from "./typings";
import ora, { Ora } from "ora";

export * from "./typings";

interface Spinnering {
  instance: Ora;
  option: SpinnerOption;
  startTime: number;
}

export abstract class Command {
  /** commander的实例的序列化对象 */
  protected cmd: any = null;
  protected value: string = "";
  protected option: any = {};
  protected logger: Logger = logger;
  protected spinner: Spinnering | null = null;

  constructor(protected argv: string[]) {
    if (!argv) throw new Error("参数不能为空！");
    if (!isArray(argv)) throw new Error("参数必须为数组！");
    if (argv.length < 1) throw new Error("参数列表为空！");

    if (argv.length === 3 && isObject(argv[1])) {
      this.value = isString(argv[0]) ? argv[0].trim() : "";
      this.option = argv[1];
    }

    if (argv.length === 2 && isObject(argv[0])) {
      this.option = argv[0];
    }

    /** 该段代码会依次执行 checkNodeVersion,initArgs,init,exec，如果执行过程中出现了错误，则会调用catch方法来捕获错误  */
    new Promise(() => {
      let chain = Promise.resolve();
      chain = chain.then(() => this.checkNodeVersion());
      chain = chain.then(() => this.initArgs());
      chain = chain.then(() => this.initLog());
      chain = chain.then(() => this.init());
      chain = chain.then(() => this.exec());
      chain.catch((err: any) => this.logger.verbose(err.message));
    });
  }

  /** 初始化参数 */
  private initArgs() {
    this.cmd = this.argv[this.argv.length - 1];
    this.argv = this.argv.slice(0, this.argv.length - 1);
  }

  /** 初始化日志 */
  private initLog() {
    this.logger.debugger = process.env.LOG_DEBUGGER === "on";
    this.logger.setLable(process.env.LOG_LABAL || "");
  }

  /** 检测Node环境是否符合条件 */
  private checkNodeVersion() {
    if (!gte(process.version, LOWEST_NODE_VERSION)) {
      throw new Error(
        chalk.bold.red(`imooc-cli 需要安装 v${LOWEST_NODE_VERSION} 以上版本的 Node.js`)
      );
    }
  }

  /** 检查环境变量是否完整并且返回环境变量对象 */
  protected getEnv(): ProcessEnv {
    const arr = [
      "CLI_HOME",
      "CLI_HOME_PATH",
      "CLI_TARGET_PATH",
      "CLI_STORE_PATH",
      "LOG_LEVEL",
      "LOG_LABAL",
      "LOG_DEBUGGER"
    ];
    const diffEnv = difference(arr, Object.keys(process.env));
    if (diffEnv.length > 0) throw new Error("缺少环境变量: " + diffEnv.join(", "));
    this.logger.verbose("当前Cli使用的环境变量: ", pick(process.env, arr));
    return process.env as any;
  }

  protected startSpinner(ops: string | (Pick<SpinnerOption, "title"> & Partial<SpinnerOption>)) {
    const option: SpinnerOption = defaultsDeep(isString(ops) ? { title: ops } : ops, {
      minTime: 1000,
      timeout: 30000
    } as SpinnerOption);
    this.spinner = {
      instance: ora(option.title).start(),
      option,
      startTime: new Date().getTime()
    };
  }

  protected async endSpinner(): Promise<void> {
    if (!this.spinner) return;
    const { instance, startTime, option } = this.spinner;
    return new Promise((resolve) => {
      const diffTime = new Date().getTime() - startTime;
      const timeout = diffTime > option.minTime ? 0 : option.minTime - diffTime;
      setTimeout(() => {
        instance.stop();
        this.spinner = null;
        resolve();
      }, timeout);
    });
  }

  /** 初始化 */
  abstract init(): any;

  /** 执行命令 */
  abstract exec(): any;
}
