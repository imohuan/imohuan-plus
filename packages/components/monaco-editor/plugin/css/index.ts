import { debounce, get } from "lodash";

import { generateClass, parserClass } from "@/helper/unocss";
import { options } from "@/helper/unocss-option";

import { getIndexCode, getLineContent, getRange } from "../../src/helper";
import { Editor, Model, monaco, PluginOption } from "../../src/monaco";
import UniqueClassWorker from "./cls.worker.ts?worker";
import DecoratorWorker from "./decorator.worker.ts?worker";
import { addClass, addClassMap, classMap, ClassMapValue, getClass } from "./options";

let decorations = [];
let stylesheet: any = null;
let colorProvider: any = null;
const languages = ["scss", "less", "css", "html", "vue"];
const worker = new UniqueClassWorker();
const decorator = new DecoratorWorker();

export function ClassPlugin(editor: Editor, option: PluginOption) {
  let model = editor.getModel();

  worker.onmessage = (e) => {
    const { markers, version, name } = e.data;
    if (!model.isDisposed() && model.getVersionId() === version) {
      monaco.editor.setModelMarkers(model, name, markers);
    }
  };

  decorator.onmessage = (e) => {
    const { datas, version } = e.data;
    if (!model.isDisposed() && model.getVersionId() === version) {
      registerColorProvider(editor, datas);
    }
  };

  const send = debounce(async (model: Model, path: string) => {
    const code = model.getValue();
    const version = model.getVersionId();
    worker.postMessage({ path, code, version });
    if (stylesheet) stylesheet.innerHTML = "";
    registerColorProvider(editor, await getColorInformation(code));
  }, get(option.userOption, "eslint.timeout", 300));

  editor.onDidChangeModel(() => {
    model = editor.getModel();
    setTimeout(() => send(model, option.fileManager.getCurrent().path), 100);
  });

  editor.onDidChangeModelContent(() => {
    if (colorProvider) colorProvider.dispose();
    send(model, option.fileManager.getCurrent().path);
  });

  // 对 html, css,...语言配置hover，和代码补全
  languages.forEach((language) => {
    // class Hover
    monaco.languages.registerHoverProvider(language, {
      async provideHover(model, position) {
        const line = getLineContent(model, position);
        const hoverCode = getIndexCode(line, position.column);
        if (!classMap.has(hoverCode)) {
          const cur = await addClass(hoverCode);
          if (!cur) return null;
        }

        const firstIndex = line.indexOf(hoverCode, position.column - hoverCode.length) + 1;
        const range = new monaco.Range(
          position.lineNumber,
          firstIndex,
          position.lineNumber,
          firstIndex + hoverCode.length
        );
        return {
          range,
          contents: [{ value: "``` css\n" + getClass(hoverCode).content + "\n```" }]
        };
      }
    });
    /** class 补全提示  */
    monaco.languages.registerCompletionItemProvider(language, {
      triggerCharacters: [" ", ":"],
      async provideCompletionItems(model, position) {
        const line = getLineContent(model, position);
        const word = model.getWordAtPosition(position);
        const lc = line.slice(0, position.column - 1);
        const rc = line.slice(position.column - 1);
        // 当前光标是否在 class="$" 中
        const isInClass =
          /class=[\"\'\`][a-zA-Z0-9\(\)@|\/\\\[\]:\-_.\s]*/.test(lc) &&
          /[a-zA-Z0-9\(\)\[\]:\-_.\s]*[\"\'\`]/.test(rc);
        const isInApply = /@apply[a-zA-Z0-9\(\)@|\/\\\[\]:\-_.\s]*/.test(lc);
        if (!isInClass && !isInApply) return { incomplete: false, suggestions: [] };

        const range = getRange(model, position);
        const suggestions: monaco.languages.CompletionItem[] = Array.from(classMap.keys()).map(
          (m) => {
            const item = getClass(m);
            let filterText = m;
            let insertText = m;
            if (language !== "html") {
              filterText = ":" + filterText;
              insertText = ":" + insertText;
            }
            return {
              range,
              label: m,
              data: [m],
              detail: item?.detail,
              documentation: item?.color || "",
              kind: item?.color
                ? monaco.languages.CompletionItemKind.Color
                : monaco.languages.CompletionItemKind.Constant,
              insertText,
              filterText,
              sortText: m
            };
          }
        );

        // 添加:
        Array.from(new Set([].concat([], options.pseudo, options.responsive))).forEach(
          (k: string) => {
            suggestions.push({
              range,
              label: k + ":",
              detail: "伪类",
              kind: 9,
              insertText: k + ":",
              sortText: `0-${k}`
            });
          }
        );

        const matchText = lc.split(" ").pop();
        let value: any = /^([a-zA-Z\-\\(\)\[\]:_]*)[\-]?(\d*)?$/.exec(matchText);
        if (value && suggestions.findIndex((suggestion) => suggestion.label === matchText) === -1) {
          const word = String(value[1]).endsWith("-") ? String(value[1]).slice(0, -1) : value[1];
          // const num = parseInt(value[2]) || 1;
          // const is = matchText.indexOf("-") !== -1;
          if (options.quickSpace.includes(word) || options.quickSpace.includes(word + "-")) {
            suggestions.push({
              range,
              label: matchText,
              filterText: matchText,
              kind: 9,
              insertText: matchText + "${0}",
              insertTextRules: 4,
              sortText: "0"
            });
          }
        }

        return {
          incomplete: true,
          suggestions
        };
      },
      async resolveCompletionItem(item) {
        if (item.sortText !== "0") return item;
        const code = item.label.toString();
        let cur = getClass(code);
        if (cur) return { ...item, detail: cur.detail };
        cur = await addClass(code);
        if (!cur) return item;
        return { ...item, detail: cur.detail };
      }
    });

    monaco.languages.setMonarchTokensProvider("scss", {
      tokenizer: {
        body: [["[@]apply", { token: "keyword.css" }]]
      }
    });
  });

  editor.onDidChangeModel(() => {
    if (stylesheet) stylesheet.innerHTML = "";
  });
}

/** rgba(255,255,255,1) 转为 红绿蓝透明对象 */
function transformColor(rgba: string) {
  const rgbRegExp = /rgba?\((\d+),\s*(\d+),\s*(\d+),\s*(.+)\)/;
  const value = rgbRegExp.exec(rgba);
  const [red, green, blue] = value.slice(1, -1).map((m) => parseInt(m) / 255 || 1);
  return { red, green, blue, alpha: 1 };
}

/** 自定义颜色色块: 用于避免自带的颜色块hover会显示颜色选择器 */
function customDecorators(editor: Editor, newDecorations: { range: any; value: ClassMapValue }[]) {
  if (!stylesheet) {
    stylesheet = document.createElement("style");
    document.head.appendChild(stylesheet);
  }

  stylesheet.innerHTML = newDecorations
    .map((data, i) => {
      const color = data.value?.color;
      if (!color) return "";
      return `
        ._color-block-${i}::before {
          content: ' ';
          box-sizing: border-box;
          display: inline-block;
          width: 0.8em;
          height: 0.8em;
          margin: 0.1em 0.2em 0;
          border: 0.1em solid black;
          background-color: ${color}
        }
        .vs-dark ._color-block-${i}::before {
          border-color: rgb(238, 238, 238);
        }
      `;
    })
    .join("");

  decorations = editor.deltaDecorations(
    decorations,
    newDecorations.map(({ range }, i) => ({
      range,
      options: { beforeContentClassName: `_color-block-${i}` }
    }))
  );
}

/** 构建 Color Provider， 内部通过自定义颜色快class */
function registerColorProvider(editor: Editor, datas: { range: any; value: ClassMapValue }[]) {
  if (colorProvider) colorProvider.dispose();
  languages.forEach((language) => {
    colorProvider = monaco.languages.registerColorProvider(language, {
      provideDocumentColors: function (
        model: monaco.editor.ITextModel,
        token: monaco.CancellationToken
      ): monaco.languages.ProviderResult<monaco.languages.IColorInformation[]> {
        customDecorators(editor, datas);
        return [];
      },
      provideColorPresentations: function (
        model: monaco.editor.ITextModel,
        colorInfo: monaco.languages.IColorInformation,
        token: monaco.CancellationToken
      ): monaco.languages.ProviderResult<monaco.languages.IColorPresentation[]> {
        return [{ label: null }];
      }
    });
  });
}

/** 获取 Color Information | worker */
export async function getColorInformation(code: string) {
  const result: { range: any; value: ClassMapValue }[] = [];
  const cssRegExp = /class=[\"\'\`]([a-zA-Z0-9\(\)\[\]:\-_.\s]*)[\"\'\`]/g;
  const cssApply = /@apply (.+)/g;

  await Promise.all(
    [cssRegExp, cssApply].map(async (re) => {
      let value: any = null;
      while ((value = re.exec(code))) {
        let classList = String(value[1])
          .replace(";", "")
          .split(" ")
          .filter((f) => f.trim());
        await Promise.all(classList.map((cls) => addClass(cls)));

        // 1. 获取 对饮文字的 行和列
        let currentValue: string = value[0];
        classList.forEach((cls, index) => {
          if (!getClass(cls)) return;
          const contents = code.slice(0, value.index).split("\n");
          const current: string[] = currentValue.slice(0, currentValue.indexOf(cls)).split("\n");
          const position = { line: contents.length + current.length - 1, col: 0 };
          position.col =
            1 + current[current.length - 1].length + contents[contents.length - 1].length;

          currentValue = currentValue.replace(
            cls,
            Array.from({ length: cls.length }).fill("A").join("")
          );

          const data = {
            range: {
              startLineNumber: position.line,
              startColumn: position.col,
              endLineNumber: position.line,
              endColumn: position.col + cls.length
            },
            value: getClass(cls)
          };
          result.push(data);
        });
      }
      return true;
    })
  );

  // console.log(result);
  return result;
}
