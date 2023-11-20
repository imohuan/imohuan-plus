import { CompletionItem, Editor, Model, monaco, SupportedActions } from "./monaco";
export * from "./files";
export declare function getLineContent(model: Model, position: monaco.Position): any;
/** 获取当前索引位置处的单词 */
export declare function getIndexCode(text: string, index: number): string;
/** 获取编辑器光标 */
export declare function getCursorPosition(editor: Editor): {
    ln: any;
    col: any;
};
/** 设置编辑器光标 */
export declare function setCursorPosition(editor: Editor, ln: number, col: number): void;
/** 编辑器 聚焦 */
export declare function setFocus(editor: Editor): void;
/** 设置是或否显示行 */
export declare function setLineNumberOnOff(editor: Editor, option: "on" | "off"): void;
/** 设置小地图 */
export declare function setMinimapOnOff(editor: Editor, option: boolean): void;
/** 设置文字大小 */
export declare function setFontSize(editor: Editor, size: number): void;
/** 修改editor的值，又不会 丢失编辑器 undo 的堆栈 */
export declare function setValueForUndo(pathOrEditor: string | Editor, value: string): void;
/** 添加编辑器 快捷键 */
export declare function addCommand(editor: Editor, key: number | number[], action: (...args: any[]) => any | SupportedActions): void;
/** 加载 .d.ts 声明，并且提供 引用 */
export declare function loadDts(_sources: string | string[]): void;
/** 获取Range，显示提示位置 */
export declare function getRange(model: monaco.editor.ITextModel, position: monaco.Position): {
    startLineNumber: any;
    endLineNumber: any;
    startColumn: any;
    endColumn: any;
};
export declare function getMatch(option: {
    match: RegExp | RegExp[];
    model: monaco.editor.ITextModel;
    position: monaco.Position;
}): true | null;
type CompletionItemOption = {
    model: Model;
    position: monaco.Position;
};
/** 添加代码片段. 核心：后面大多数都是使用类似的方法生成 suggestions 数组，通过内容判断是否返回*/
export declare function addCompletionItem(match: RegExp[], languages: monaco.languages.LanguageSelector | monaco.languages.LanguageSelector[], list: CompletionItem[], callback?: (suggestions: CompletionItem[], option: CompletionItemOption) => CompletionItem[]): void;
/** 添加代码关键字 */
export declare function addCompletionKeyWord(languages: monaco.languages.LanguageSelector, keys: string[]): void;
/** 添加关于全局匹配 match 到的关键字 */
export declare function addCompletionMatchKeyWord(editor: Editor, languages: monaco.languages.LanguageSelector, match?: RegExp | RegExp[], exclude?: string[], matchKeyword?: boolean): void;
interface HoverArgOption {
    lineCode: string;
    hoverCode: string;
    position: monaco.Position;
    model: monaco.editor.ITextModel;
}
/** match代码 - hover提示 */
export declare function keywordHover(languages: monaco.languages.LanguageSelector, callback: (option: HoverArgOption) => null | monaco.languages.ProviderResult<monaco.languages.Hover>): void;
