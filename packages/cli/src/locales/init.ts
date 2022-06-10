import { setLocals } from "../helper/generate-locales";

export function initLocalesData() {
  setLocals([
    ["usage", "🛷 使用", "🛷 Usage"],
    ["args", "🛠️  参数", "🛠️  Arguments"],
    ["options", "🪁 配置", "🪁 Options"],
    ["commands", "🐳 指令", "🐳 Commands"],
    ["help", "显示命令帮助", "display help for commands"],
    ["command-help", "指令帮助", "open help"],
    ["command-version", "查看版本", "look version"],
    ["command-create", "创建模板", "create template"],
    ["command-log", "获取日志", "get logs"],
    ["command-language", "更改语言", "change language"],
    ["language-list", "获取支持的语言", "get the supported language"],
    ["set-locals-error", "解析国家化失败", "parser i18n template error"],
    ["support-language", "支持的语言", "supported languages"],
    ["not-found", "没找找到对应的指令", "not found instruction"],
    ["use-language", "使用语言", "use language"],
    ["current-language", "当前语言", "current language"],
    ["select-language", "选择语言", "select language"],
    ["create-name", "创建项目名称", "create project name"],
    ["version", "版本号", "Version"],
    ["required-argument", "缺少所需的参数", "missing required argument"],
    ["", "", ""]
  ]);
}
