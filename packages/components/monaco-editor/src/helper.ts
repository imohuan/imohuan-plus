import { clamp, defaultsDeep, difference, isArray, isFunction, isString } from "lodash";

import { ctx } from "@/helper/ctx";

import { CompletionItem, Editor, Model, monaco, SupportedActions } from "./monaco";

export * from "./files";

export function getLineContent(model: Model, position: monaco.Position) {
  try {
    return model.getLineContent(position.lineNumber);
  } catch {
    return "";
  }
}

/** 获取当前索引位置处的单词 */
export function getIndexCode(text: string, index: number) {
  try {
    const lw = text.slice(0, index).match(/[a-zA-Z0-9\/\(\)\[\]:\-_.]*$/)[0];
    const rw = text.slice(index).match(/[a-zA-Z0-9\/\(\)\[\]:\-_.]*/)[0];
    return lw + rw;
  } catch {
    return "";
  }
}

/** 获取编辑器光标 */
export function getCursorPosition(editor: Editor) {
  let line = editor.getPosition().lineNumber;
  let column = editor.getPosition().column;
  return { ln: line, col: column };
}

/** 设置编辑器光标 */
export function setCursorPosition(editor: Editor, ln: number, col: number) {
  let pos = { lineNumber: ln, column: col };
  editor.setPosition(pos);
}

/** 编辑器 聚焦 */
export function setFocus(editor: Editor) {
  editor.focus();
}

/** 设置是或否显示行 */
export function setLineNumberOnOff(editor: Editor, option: "on" | "off") {
  editor.updateOptions({ lineNumbers: option });
}

/** 设置小地图 */
export function setMinimapOnOff(editor: Editor, option: boolean) {
  editor.updateOptions({ minimap: { enabled: option } });
}

/** 设置文字大小 */
export function setFontSize(editor: Editor, size: number) {
  editor.updateOptions({ fontSize: size });
}

/** 修改editor的值，又不会 丢失编辑器 undo 的堆栈 */
export function setValueForUndo(pathOrEditor: string | Editor, value: string) {
  const model = isString(pathOrEditor)
    ? monaco.editor.getModels().find((model) => model.uri.path === pathOrEditor)
    : (pathOrEditor as any as Editor).getModel();

  if (model && model.getValue() !== value) {
    // 通过该方法，可以实现undo堆栈的保留
    model.pushEditOperations([], [{ range: model.getFullModelRange(), text: value }], () => []);
  }
}

/** 添加编辑器 快捷键 */
export function addCommand(
  editor: Editor,
  key: number | number[],
  action: (...args: any[]) => any | SupportedActions
) {
  const keys = isArray(key) ? key : [key];
  keys.forEach((k) => {
    editor.addCommand(k, (...args: any[]) => {
      if (isFunction(action)) return action(...args);
      editor.trigger("自定义Command", action as string, {});
    });
  });
}

/** 加载 .d.ts 声明，并且提供 引用 */
export function loadDts(_sources: string | string[]) {
  const sources: string[] = isArray(_sources) ? _sources : [_sources];
  sources.forEach((source) => {
    // 向语言服务添加额外的源文件。对于不会作为编辑器文档加载的typescript(定义)文件，比如jquery.d.ts。
    const name = ctx.uid();
    const uri = `ts:filename/${name}.d.ts`;
    monaco.languages.typescript.javascriptDefaults.addExtraLib(source);
    // 解析定义和引用时，编辑器将尝试使用已创建的模型。 创建一个模型的库允许“peek定义/引用”命令与库一起工作。
    monaco.editor.createModel(source, "typescript", monaco.Uri.parse(uri));
  });
}

/** 获取Range，显示提示位置 */
export function getRange(model: monaco.editor.ITextModel, position: monaco.Position) {
  const word = model.getWordUntilPosition(position);
  const range = {
    startLineNumber: position.lineNumber,
    endLineNumber: position.lineNumber,
    startColumn: word.startColumn,
    endColumn: word.endColumn
  };
  return range;
}

export function getMatch(option: {
  match: RegExp | RegExp[];
  model: monaco.editor.ITextModel;
  position: monaco.Position;
}) {
  const { match: _match, model, position } = option;
  const match = isArray(_match) ? _match : [_match];
  if (match.length > 0) {
    const textUntilPosition = model.getValueInRange({
      startLineNumber: clamp(position.lineNumber - 10, 0, position.lineNumber),
      startColumn: 1,
      endLineNumber: position.lineNumber + 1,
      endColumn: 1
    });
    const isOk = match.some((m) => m.test(textUntilPosition));
    if (!isOk) return null;
  }
  return true;
}

type CompletionItemOption = {
  model: Model;
  position: monaco.Position;
};

/** 添加代码片段. 核心：后面大多数都是使用类似的方法生成 suggestions 数组，通过内容判断是否返回*/
export function addCompletionItem(
  match: RegExp[],
  languages: monaco.languages.LanguageSelector | monaco.languages.LanguageSelector[],
  list: CompletionItem[],
  callback?: (suggestions: CompletionItem[], option: CompletionItemOption) => CompletionItem[]
) {
  const languageList = isArray(languages) ? languages : [languages];
  languageList.forEach((lang) => {
    monaco.languages.registerCompletionItemProvider(lang, {
      provideCompletionItems: function (model, position) {
        const isOk = getMatch({ match, model, position });
        if (!isOk) return { suggestions: [] };

        const range = getRange(model, position);
        const defaultSuggestion: Partial<monaco.languages.CompletionItem> = {
          documentation: "",
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        };

        let currentList: CompletionItem[] = list;
        if (isFunction(callback)) {
          currentList = callback(list, { model, position });
        }

        const suggestions: monaco.languages.CompletionItem[] = currentList.map((item) =>
          defaultsDeep({ range }, item, defaultSuggestion)
        );
        return { suggestions };
      }
    });
  });
}

/** 添加代码关键字 */
export function addCompletionKeyWord(languages: monaco.languages.LanguageSelector, keys: string[]) {
  const suggestions = keys.map((key) => ({
    label: key,
    kind: monaco.languages.CompletionItemKind.Keyword,
    insertText: key
  }));
  addCompletionItem([], languages, suggestions);
}

/** 添加关于全局匹配 match 到的关键字 */
export function addCompletionMatchKeyWord(
  editor: Editor,
  languages: monaco.languages.LanguageSelector,
  match: RegExp | RegExp[] = [],
  exclude: string[] = [],
  matchKeyword: boolean = true
) {
  addCompletionItem([], languages, [], () => {
    const value = editor.getValue();
    const regExpList: RegExp[] = isArray(match) ? match : [match];
    if (matchKeyword) regExpList.push(/[a-zA-Z_]\w*/g);

    let keys = regExpList.reduce((pre, regexp) => {
      return pre.concat(value.match(regexp));
    }, []);

    keys = Array.from(new Set(keys.filter((f) => f)));

    return difference(keys, exclude).map((key) => ({
      label: key,
      kind: monaco.languages.CompletionItemKind.Keyword,
      insertText: key
    }));
  });
}

interface HoverArgOption {
  lineCode: string;
  hoverCode: string;
  position: monaco.Position;
  model: monaco.editor.ITextModel;
}

/** match代码 - hover提示 */
export function keywordHover(
  languages: monaco.languages.LanguageSelector,
  callback: (
    option: HoverArgOption
  ) => null | monaco.languages.ProviderResult<monaco.languages.Hover>
) {
  monaco.languages.registerHoverProvider(languages, {
    provideHover: async function (model, position) {
      const line = model.getLineContent(position.lineNumber);
      const hoverCode = getIndexCode(line, position.column);
      const range = getRange(model, position);
      return defaultsDeep(await callback({ hoverCode, lineCode: line, model, position }), {
        range
      });
    }
  });
}

//
