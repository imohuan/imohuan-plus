import * as monaco from "monaco-editor";
import "../theme";
import { FileManager } from "./files";
export type Language = "css" | "less" | "scss" | "html" | "json" | "json-stringify" | "typescript" | "javascript" | "vue";
export declare const LANGUAGE_MODES: {
    html: string[];
    jade: string[];
    slim: string[];
    haml: string[];
    xml: string[];
    xsl: string[];
    css: string[];
    scss: string[];
    sass: string[];
    less: string[];
    stylus: string[];
    javascript: string[];
    typescript: string[];
};
export declare const htmlData: {
    tags: string[];
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
declare const supportedActions: readonly ["editor.action.setSelectionAnchor", "editor.action.selectToBracket", "editor.action.jumpToBracket", "editor.action.moveCarretLeftAction", "editor.action.moveCarretRightAction", "editor.action.transposeLetters", "editor.action.clipboardCopyWithSyntaxHighlightingAction", "editor.action.quickFix", "editor.action.refactor", "editor.action.sourceAction", "editor.action.revealDefinition", "editor.action.revealDefinitionAside", "editor.action.peekDefinition", "editor.action.goToReferences", "editor.action.referenceSearch.trigger", "editor.action.marker.next", "editor.action.marker.prev", "editor.action.marker.nextInFiles", "editor.action.marker.prevInFiles", "editor.action.showHover", "editor.action.showDefinitionPreviewHover", "editor.action.commentLine", "editor.action.addCommentLine", "editor.action.removeCommentLine", "editor.action.blockComment", "editor.action.showContextMenu", "cursorUndo", "cursorRedo", "actions.find", "editor.action.startFindReplaceAction", "editor.actions.findWithArgs", "actions.findWithSelection", "editor.action.nextMatchFindAction", "editor.action.previousMatchFindAction", "editor.action.nextSelectionMatchFindAction", "editor.action.previousSelectionMatchFindAction", "editor.unfold", "editor.unfoldRecursively", "editor.fold", "editor.foldRecursively", "editor.foldAll", "editor.unfoldAll", "editor.foldAllBlockComments", "editor.foldAllMarkerRegions", "editor.unfoldAllMarkerRegions", "editor.foldAllExcept", "editor.unfoldAllExcept", "editor.toggleFold", "editor.gotoParentFold", "editor.gotoPreviousFold", "editor.gotoNextFold", "editor.foldLevel1", "editor.foldLevel2", "editor.foldLevel3", "editor.foldLevel4", "editor.foldLevel5", "editor.foldLevel6", "editor.foldLevel7", "editor.action.fontZoomIn", "editor.action.fontZoomOut", "editor.action.fontZoomReset", "vs.editor.ICodeEditor:2:editor.action.formatDocument", "editor.action.formatSelection", "editor.action.triggerSuggest", "editor.action.resetSuggestSize", "editor.action.inlineSuggest.trigger", "editor.action.indentationToSpaces", "editor.action.indentationToTabs", "editor.action.indentUsingTabs", "editor.action.indentUsingSpaces", "editor.action.detectIndentation", "editor.action.reindentlines", "editor.action.reindentselectedlines", "editor.action.inPlaceReplace.up", "editor.action.inPlaceReplace.down", "expandLineSelection", "editor.action.copyLinesUpAction", "editor.action.copyLinesDownAction", "editor.action.duplicateSelection", "editor.action.moveLinesUpAction", "editor.action.moveLinesDownAction", "editor.action.sortLinesAscending", "editor.action.sortLinesDescending", "editor.action.removeDuplicateLines", "editor.action.trimTrailingWhitespace", "editor.action.deleteLines", "editor.action.indentLines", "editor.action.outdentLines", "editor.action.insertLineBefore", "editor.action.insertLineAfter", "deleteAllLeft", "deleteAllRight", "editor.action.joinLines", "editor.action.transpose", "editor.action.transformToUppercase", "editor.action.transformToLowercase", "editor.action.transformToSnakecase", "editor.action.transformToTitlecase", "editor.action.linkedEditing", "editor.action.openLink", "editor.action.insertCursorAbove", "editor.action.insertCursorBelow", "editor.action.insertCursorAtEndOfEachLineSelected", "editor.action.addSelectionToNextFindMatch", "editor.action.addSelectionToPreviousFindMatch", "editor.action.moveSelectionToNextFindMatch", "editor.action.moveSelectionToPreviousFindMatch", "editor.action.selectHighlights", "editor.action.addCursorsToBottom", "editor.action.addCursorsToTop", "editor.action.triggerParameterHints", "editor.action.rename", "editor.action.smartSelect.expand", "editor.action.smartSelect.shrink", "editor.action.forceRetokenize", "editor.action.toggleTabFocusMode", "editor.action.unicodeHighlight.disableHighlightingOfAmbiguousCharacters", "editor.action.unicodeHighlight.disableHighlightingOfInvisibleCharacters", "editor.action.unicodeHighlight.disableHighlightingOfNonBasicAsciiCharacters", "editor.action.unicodeHighlight.showExcludeOptions", "editor.action.wordHighlight.trigger", "deleteInsideWord", "editor.action.showAccessibilityHelp", "editor.action.inspectTokens", "editor.action.gotoLine", "editor.action.quickOutline", "editor.action.quickCommand", "editor.action.toggleHighContrast"];
export type SupportedActions = typeof supportedActions[number];
