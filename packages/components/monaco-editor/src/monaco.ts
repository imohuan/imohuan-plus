// 加载自定义的数据
import { setLocaleData } from "monaco-editor-nls";
import zh_CN from "monaco-editor-nls/locale/zh-hans.json";
setLocaleData(zh_CN);

import * as monaco from "monaco-editor";

import "../theme";
import DefaultWorker from "monaco-editor/esm/vs/editor/editor.worker?worker";
import CssWorker from "monaco-editor/esm/vs/language/css/css.worker?worker";
import HtmlWorker from "monaco-editor/esm/vs/language/html/html.worker?worker";
import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker?worker";
import TsWorker from "monaco-editor/esm/vs/language/typescript/ts.worker?worker";

import { FileManager } from "./files";

self.MonacoEnvironment = {
  getWorker(_workerId, label) {
    switch (label) {
      case "json":
        return new JsonWorker();
      case "css":
      case "scss":
      case "less":
        return new CssWorker();
      case "html":
      case "handlebars":
      case "razor":
        return new HtmlWorker();
      case "javascript":
      case "typescript":
        return new TsWorker();
      default:
        return new DefaultWorker();
    }
  }
};

export type Language =
  | "css"
  | "less"
  | "scss"
  | "html"
  | "json"
  | "json-stringify"
  | "typescript"
  | "javascript"
  | "vue";

const num = "0123456789".split("");
export const LANGUAGE_MODES = {
  html: ["!", ".", "}", ":", "*", "$", "]", "/", ">", ...num],
  jade: ["!", ".", "}", ":", "*", "$", "]", "/", ">", ...num],
  slim: ["!", ".", "}", ":", "*", "$", "]", "/", ">", ...num],
  haml: ["!", ".", "}", ":", "*", "$", "]", "/", ">", ...num],
  xml: [".", "}", "*", "$", "]", "/", ">", ...num],
  xsl: ["!", ".", "}", "*", "$", "/", "]", ">", ...num],
  css: [":", "!", "-", ...num],
  scss: [":", "!", "-", ...num],
  sass: [":", "!", ...num],
  less: [":", "!", "-", ...num],
  stylus: [":", "!", ...num],
  javascript: ["!", ".", "}", "*", "$", "]", "/", ">", ...num],
  typescript: ["!", ".", "}", "*", "$", "]", "/", ">", ...num]
};

export const htmlData = {
  tags: [
    "body",
    "head",
    "html",
    "address",
    "blockquote",
    "dd",
    "div",
    "section",
    "article",
    "aside",
    "header",
    "footer",
    "nav",
    "menu",
    "dl",
    "dt",
    "fieldset",
    "form",
    "frame",
    "frameset",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "iframe",
    "noframes",
    "object",
    "ol",
    "p",
    "ul",
    "applet",
    "center",
    "dir",
    "hr",
    "pre",
    "a",
    "abbr",
    "acronym",
    "area",
    "b",
    "base",
    "basefont",
    "bdo",
    "big",
    "br",
    "button",
    "caption",
    "cite",
    "code",
    "col",
    "colgroup",
    "del",
    "dfn",
    "em",
    "font",
    "i",
    "img",
    "input",
    "ins",
    "isindex",
    "kbd",
    "label",
    "legend",
    "li",
    "link",
    "map",
    "meta",
    "noscript",
    "optgroup",
    "option",
    "param",
    "q",
    "s",
    "samp",
    "script",
    "select",
    "small",
    "span",
    "strike",
    "strong",
    "style",
    "sub",
    "sup",
    "table",
    "tbody",
    "td",
    "textarea",
    "tfoot",
    "th",
    "thead",
    "title",
    "tr",
    "tt",
    "u",
    "var",
    "canvas",
    "main",
    "figure",
    "plaintext",
    "figcaption",
    "hgroup",
    "details",
    "summary"
  ]
};

export type Editor = monaco.editor.IStandaloneCodeEditor;
export type Model = monaco.editor.ITextModel;
export type EditorOption = monaco.editor.IStandaloneEditorConstructionOptions;

export type PluginOption = EditorOption & {
  userOption: any;
  fileManager: FileManager;
};

export type CompletionItem = Omit<monaco.languages.CompletionItem, "range">;

export { FileManager } from "./files";
export { monaco };

const supportedActions = [
  "editor.action.setSelectionAnchor",
  "editor.action.selectToBracket",
  "editor.action.jumpToBracket",
  "editor.action.moveCarretLeftAction",
  "editor.action.moveCarretRightAction",
  "editor.action.transposeLetters",
  "editor.action.clipboardCopyWithSyntaxHighlightingAction",
  "editor.action.quickFix",
  "editor.action.refactor",
  "editor.action.sourceAction",
  "editor.action.revealDefinition",
  "editor.action.revealDefinitionAside",
  "editor.action.peekDefinition",
  "editor.action.goToReferences",
  "editor.action.referenceSearch.trigger",
  "editor.action.marker.next",
  "editor.action.marker.prev",
  "editor.action.marker.nextInFiles",
  "editor.action.marker.prevInFiles",
  "editor.action.showHover",
  "editor.action.showDefinitionPreviewHover",
  "editor.action.commentLine",
  "editor.action.addCommentLine",
  "editor.action.removeCommentLine",
  "editor.action.blockComment",
  "editor.action.showContextMenu",
  "cursorUndo",
  "cursorRedo",
  "actions.find",
  "editor.action.startFindReplaceAction",
  "editor.actions.findWithArgs",
  "actions.findWithSelection",
  "editor.action.nextMatchFindAction",
  "editor.action.previousMatchFindAction",
  "editor.action.nextSelectionMatchFindAction",
  "editor.action.previousSelectionMatchFindAction",
  "editor.unfold",
  "editor.unfoldRecursively",
  "editor.fold",
  "editor.foldRecursively",
  "editor.foldAll",
  "editor.unfoldAll",
  "editor.foldAllBlockComments",
  "editor.foldAllMarkerRegions",
  "editor.unfoldAllMarkerRegions",
  "editor.foldAllExcept",
  "editor.unfoldAllExcept",
  "editor.toggleFold",
  "editor.gotoParentFold",
  "editor.gotoPreviousFold",
  "editor.gotoNextFold",
  "editor.foldLevel1",
  "editor.foldLevel2",
  "editor.foldLevel3",
  "editor.foldLevel4",
  "editor.foldLevel5",
  "editor.foldLevel6",
  "editor.foldLevel7",
  "editor.action.fontZoomIn",
  "editor.action.fontZoomOut",
  "editor.action.fontZoomReset",
  "vs.editor.ICodeEditor:2:editor.action.formatDocument",
  "editor.action.formatSelection",
  "editor.action.triggerSuggest",
  "editor.action.resetSuggestSize",
  "editor.action.inlineSuggest.trigger",
  "editor.action.indentationToSpaces",
  "editor.action.indentationToTabs",
  "editor.action.indentUsingTabs",
  "editor.action.indentUsingSpaces",
  "editor.action.detectIndentation",
  "editor.action.reindentlines",
  "editor.action.reindentselectedlines",
  "editor.action.inPlaceReplace.up",
  "editor.action.inPlaceReplace.down",
  "expandLineSelection",
  "editor.action.copyLinesUpAction",
  "editor.action.copyLinesDownAction",
  "editor.action.duplicateSelection",
  "editor.action.moveLinesUpAction",
  "editor.action.moveLinesDownAction",
  "editor.action.sortLinesAscending",
  "editor.action.sortLinesDescending",
  "editor.action.removeDuplicateLines",
  "editor.action.trimTrailingWhitespace",
  "editor.action.deleteLines",
  "editor.action.indentLines",
  "editor.action.outdentLines",
  "editor.action.insertLineBefore",
  "editor.action.insertLineAfter",
  "deleteAllLeft",
  "deleteAllRight",
  "editor.action.joinLines",
  "editor.action.transpose",
  "editor.action.transformToUppercase",
  "editor.action.transformToLowercase",
  "editor.action.transformToSnakecase",
  "editor.action.transformToTitlecase",
  "editor.action.linkedEditing",
  "editor.action.openLink",
  "editor.action.insertCursorAbove",
  "editor.action.insertCursorBelow",
  "editor.action.insertCursorAtEndOfEachLineSelected",
  "editor.action.addSelectionToNextFindMatch",
  "editor.action.addSelectionToPreviousFindMatch",
  "editor.action.moveSelectionToNextFindMatch",
  "editor.action.moveSelectionToPreviousFindMatch",
  "editor.action.selectHighlights",
  "editor.action.addCursorsToBottom",
  "editor.action.addCursorsToTop",
  "editor.action.triggerParameterHints",
  "editor.action.rename",
  "editor.action.smartSelect.expand",
  "editor.action.smartSelect.shrink",
  "editor.action.forceRetokenize",
  "editor.action.toggleTabFocusMode",
  "editor.action.unicodeHighlight.disableHighlightingOfAmbiguousCharacters",
  "editor.action.unicodeHighlight.disableHighlightingOfInvisibleCharacters",
  "editor.action.unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters",
  "editor.action.unicodeHighlight.showExcludeOptions",
  "editor.action.wordHighlight.trigger",
  "deleteInsideWord",
  "editor.action.showAccessibilityHelp",
  "editor.action.inspectTokens",
  "editor.action.gotoLine",
  "editor.action.quickOutline",
  "editor.action.quickCommand",
  "editor.action.toggleHighContrast"
] as const;

export type SupportedActions = typeof supportedActions[number];
