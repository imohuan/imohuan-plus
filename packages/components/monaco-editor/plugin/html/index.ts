import { emmetCSS, emmetHTML, emmetJSX, expandAbbreviation } from "emmet-monaco-es";

import expand, { extract } from "emmet";
// import { autoTagPlugin } from "./index2";
import { Editor, LANGUAGE_MODES, monaco, CompletionItem, htmlData } from "../../src/monaco";
import { addCompletionKeyWord, getLineContent, getRange } from "../../src/helper";

export function HtmlPlugin(editor: Editor) {
  // 继承 Emmet 代码提示，代码片段
  emmetHTML(monaco, ["html", "php", "vue"]);
  emmetCSS(monaco, ["css", "scss", "less"]);
  emmetJSX(monaco, ["javascript", "typescript", "jsx"]);

  // Tag 补全 1. 输入标签 div 2. 输入左括号和右括号 <div>
  monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: LANGUAGE_MODES.html,
    provideCompletionItems: function (model, position) {
      const line = getLineContent(model, position);
      const word = model.getWordUntilPosition(position);

      let prefix = "";
      // extract 获取当前行和列前面出现的符合条件的内容
      let extractedAbbreviation = extract(line, position.column, { prefix });
      let abbreviation = extractedAbbreviation?.abbreviation;
      if (abbreviation && abbreviation.indexOf(">") !== -1) return { suggestions: [] };

      if (!abbreviation) {
        prefix = "<";
        extractedAbbreviation = extract(line, position.column, { prefix });
        abbreviation = extractedAbbreviation?.abbreviation;
        console.log("abbreviation", abbreviation);
        if (!abbreviation) return { suggestions: [] };
      }

      if (htmlData.tags.includes(abbreviation) && prefix === "") return { suggestions: [] };

      const expanded = expandAbbreviation(abbreviation, {
        type: "markup",
        syntax: "html",
        options: {
          "output.field": (index, placeholder) =>
            `\${${index}${placeholder ? ":" + placeholder : ""}}`
        }
      });

      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn - (prefix.length > 0 ? abbreviation.length + 1 : 0),
        endColumn: word.endColumn
      };

      const suggestion: monaco.languages.CompletionItem = {
        range,
        detail: "Emmet Abbreviation",
        filterText: prefix + abbreviation,
        label: abbreviation.slice(0, abbreviation.length - prefix.length),
        kind: 9,
        insertTextRules: 4,
        insertText: expanded
      };

      return { incomplete: true, suggestions: [suggestion] };
    }
  });

  // 关键字
  monaco.languages.registerCompletionItemProvider("html", {
    triggerCharacters: LANGUAGE_MODES.html,
    provideCompletionItems: function (model, position) {
      const range = getRange(model, position);

      const line = getLineContent(model, position);
      const lc = line.slice(0, position.column - 1);
      const rc = line.slice(position.column - 1);
      // 当前光标是否在 class="$" 中
      const isInClass =
        /class=[\"\'\`][a-zA-Z0-9\(\)\[\]:\-_.\s]*/.test(lc) &&
        /[a-zA-Z0-9\(\)\[\]:\-_.\s]*[\"\'\`]/.test(rc);

      if (isInClass) return { suggestions: [] };
      return {
        incomplete: true,
        suggestions: [
          { range, label: "lorem", kind: 17, insertText: "lorem", detail: "html 补全随机内容" }
        ]
      };
    }
  });
}
