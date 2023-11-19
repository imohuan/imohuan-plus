import { format, formatBase } from "@/helper/format";
import { cloneDeep } from "lodash";

import { setValueForUndo, setCursorPosition } from "../../src/helper";
import { Editor, PluginOption, Model, monaco } from "../../src/monaco";

// 修改自定义的格式化, 将其变成 prettier 格式化
function provideDocumentFormattingEdits(model: Model) {
  const text = formatBase(model.getValue(), {
    filepath: model.uri.path
  });
  return [{ range: model.getFullModelRange(), text }];
}

const languages = ["javascript", "typescript", "css", "less", "scss", "json", "vue", "html"];
languages.forEach((key) => {
  // 注册 对应语言 的格式化
  // TODO html测试格式化不进入当前 函数
  monaco.languages.registerDocumentFormattingEditProvider(key, {
    provideDocumentFormattingEdits
  });
});

/** HTML class 去除空格 格式化代码 */
function replaceClassSpace(editor: Editor) {
  const getSelections: any[] = cloneDeep(editor.getSelections());
  const cssRegExp = /class=[\"\'\`]([a-zA-Z0-9\|\\\/\(\)\[\]:\-_.\s]*)[\"\'\`]/g;
  const content = editor.getValue();

  let result = content;
  let value: any;
  while ((value = cssRegExp.exec(content))) {
    const line = content.slice(0, value.index).split("\n");
    const currentLine = line[line.length - 1];
    const startLine = line.length;
    const startCol = currentLine.length + value[0].indexOf(value[1]);

    const fn = (data: string) =>
      data
        .split(" ")
        .filter((f) => f.trim())
        .join(" ");

    const currentMatch = value[0];
    const newValue = fn(value[1]);
    getSelections.forEach((selection) => {
      if (selection.startLineNumber === startLine && selection.startColumn > startCol) {
        const v = (currentLine + currentMatch).slice(0, selection.startColumn - 1);
        const cv = v.slice(v.lastIndexOf('"') + 1);
        const newV = fn(cv);
        const rLen = cv.length - newV.length;
        // console.log({
        //   v,
        //   newV: newV,
        //   vLen: v.length,
        //   newVLen: newV.length,
        //   col: selection.startColumn,
        //   newCol: selection.startColumn - rLen
        // });
        selection.startColumn = selection.startColumn - rLen;
        selection.selectionStartColumn = selection.selectionStartColumn - rLen;
        selection.positionColumn = selection.positionColumn - rLen;
        selection.endColumn = selection.endColumn - rLen;
      }
    });
    result = result.replace(value[1], newValue);
  }
  // console.log(getSelections);
  editor.setSelections(getSelections);
  return result;
}

export function FormatPlugin(editor: Editor, option: PluginOption) {
  editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
    const model = editor.getModel();
    // 判断是否是 HTML 格式
    const isHtml = editor.getModel().uri.path.endsWith(".html");
    if (isHtml) {
      // 事先对html进行处理
      // TODO 时候需要完善： 1. 光标位置    2. class的排序
      const formatHtml = replaceClassSpace(editor);
      if (editor.getValue() !== formatHtml) {
        setValueForUndo(editor, formatHtml);
      }
    }

    if (option.readOnly) {
      const code = format(editor.getValue(), option.language as any);
      editor.setValue(code);
    } else {
      editor.trigger("绑定 Ctrl+S 格式化代码", "editor.action.formatDocument", {});
    }
  });
}
