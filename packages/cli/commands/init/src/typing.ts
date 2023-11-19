import { SearchPackage } from "@imohuan-plus/info";

export interface SelectInfo {
  /** 项目名称 */
  name: string;
  /** 项目描述 */
  description: string;
  /** 版本号 */
  version: string;
  /** 模板 */
  template: SearchPackage;
  /** 类名称 */
  className: string;
}

export interface TemplateOption {
  /** 忽略模板中需要进行Ejs渲染的Glob匹配 */
  ignore: string[];
  /** 安装依赖命令 */
  install: string;
  /** 开始运行命令 */
  start: string;
  [key: string]: any;
}
