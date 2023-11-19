import { monaco } from "./monaco";

export const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
  // 字体设置
  tabSize: 2,
  fontWeight: "700",
  fontFamily: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono","Courier New"`,
  // ctrl + 鼠标滚轮 缩放代码
  mouseWheelZoom: true,
  // alt + 鼠标 滚动加倍
  mouseWheelScrollSensitivity: 1.5,
  // 滚动条样式
  scrollbar: {
    useShadows: false, // 左上角有微妙的阴影。默认值为true。
    arrowSize: 30, // 箭头大小
    verticalHasArrows: false, // 呈现垂直的箭头。默认值为false。
    horizontalHasArrows: false, // 呈现水平箭头。默认值为false。
    vertical: "auto", // 显示垂直滚动条。
    verticalScrollbarSize: 10, // 垂直滚动条宽度
    horizontal: "visible", // 显示纵向滚动条。
    horizontalScrollbarSize: 10 // 纵向滚动条宽度
  },
  // 编辑器设置
  selectOnLineNumbers: true, // 点击行号时是否要选择相应的行?默认值为true。
  autoClosingBrackets: "languageDefined", // 自动闭合括号
  autoClosingOvertype: "auto", // 自动闭合括号或引号
  autoIndent: "advanced" // 自动缩进
};
