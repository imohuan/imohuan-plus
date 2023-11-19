import { monaco, Editor } from "../../src/monaco";

// 验证设置
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  // 没有语义验证
  noSemanticValidation: false,
  // 没有语法验证
  noSyntaxValidation: false
});

// 编译器选项
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ESNext,
  // 允许非Ts扩展
  allowNonTsExtensions: true
});

// 设置 TypeScript 编译器选项 (tsconfig.json中的内容)
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs
});

export function TypeScriptPlugin(editor: Editor) {}

// addCompletionKeyWord("typescript", ["space", "helloWord"]);
// addCompletionMatchKeyWord(editor.value, "typescript");

// var libSource = [
//   "declare class Facts {",
//   "    /**",
//   "     * Returns the next fact",
//   "     */",
//   "    static next():string",
//   "}"
// ].join("\n");

// loadDts(libSource);

// addCompletionItem([], "typescript", [
//   {
//     label: "list2d_basic", // 用户键入list2d_basic的任意前缀即可触发自动补全，选择该项即可触发添加代码片段
//     kind: monaco.languages.CompletionItemKind.Snippet,
//     insertText: "[[${1:0}]*${3:cols} for _ in range(${2:rows})]" // ${i:j}，其中i表示按tab切换的顺序编号，j表示默认串
//   }
// ]);

// keywordHover("typescript", async ({ hoverCode }) => {
//   const result = [
//     { value: "**SOURCE**" },
//     { value: "```html\n" + `<html><h2>11Hello</h2></html>` + "\n```" }
//   ];
//   return { contents: hoverCode === "html" ? result : [] };
// });
