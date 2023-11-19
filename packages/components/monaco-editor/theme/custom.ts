import { monaco } from "../src/monaco";

// 自定义主题: https://microsoft.github.io/monaco-editor/playground.html#customizing-the-appearence-exposed-colors
monaco.editor.defineTheme("customTheme", {
  base: "vs", // 必须指定 vs | vs-dark | hc-black
  inherit: true, // 是否继承, 还可以用false来完全替换内置的规则
  rules: [
    // comment
    { token: "comment", foreground: "ffa500", fontStyle: "italic underline" },
    { token: "comment.js", foreground: "008800", fontStyle: "bold" },
    { token: "comment.css", foreground: "0000ff" } // will inherit fontStyle from `comment` above
  ],
  colors: {
    // "editor.foreground": "#000000"
  }
});

// 颜色名称列表:
// 整体的前景颜色。此颜色仅在组件未覆盖时使用。
("foreground");
// 错误消息的整体前景色。此颜色仅在组件未覆盖时使用。
("errorForeground");
// 提供附加信息的描述文本的前景色，例如标签。
("descriptionForeground");
// 聚焦元素的整体边框颜色。此颜色仅在组件未覆盖时使用。
("focusBorder");
//在元素周围添加边框，使它们与其他元素分隔开来，形成更大的对比。
("contrastBorder");
//活动元素周围的额外边界，使它们与其他元素分隔开来，形成更大的对比。
("contrastActiveBorder");
//工作台中文本选择的背景颜色(例如输入字段或文本区域)。注意，这不适用于编辑器中的选择。
("selection.background");
//文本分隔符的颜色。
("textSeparator.foreground");
//文本中链接的前景色。
("textLink.foreground");
//文本活动链接的前景色。
("textLink.activeForeground");
//预格式化文本段的前景色。
("textPreformat.foreground");
//文本块引号的背景颜色。
("textBlockQuote.background");
//文本块引号的边框颜色。
("textBlockQuote.border");
//文本中代码块的背景颜色。
("textCodeBlock.background");
//在编辑器中为查找/替换等小部件设置阴影颜色。
("widget.shadow");
//输入框背景。
("input.background");
//输入框前台。
("input.foreground");
//输入框边框。
("input.border");
//输入框中激活选项的边框颜色。
("inputOption.activeBorder");
//占位符文本的前景色。
("input.placeholderForeground");
//输入验证的背景颜色为信息的严重性。
("inputValidation.infoBackground");
//输入验证边界颜色的信息的严重性。
("inputValidation.infoBorder");
//信息警告的输入验证背景色。
("inputValidation.warningBackground");
//输入验证的边界颜色警告的严重性。
("inputValidation.warningBorder");
//输入验证的背景颜色为错误的严重性。
("inputValidation.errorBackground");
//输入验证边界颜色的错误严重程度。
("inputValidation.errorBorder");
//下拉的背景。
("dropdown.background");
//下拉前景。
("dropdown.foreground");
//下拉边境。
("dropdown.border");
//当列表/树激活时，聚焦项的列表/树背景颜色。活动列表/树有键盘焦点，非活动列表/树没有键盘焦点。
("list.focusBackground");
//当列表/树激活时，聚焦项目的列表/树前景色。活动列表/树有键盘焦点，非活动列表/树没有键盘焦点。
("list.focusForeground");
// 当列表 背景颜色
("list.activeSelectionBackground");
//当列表/树激活时，列表/树的背景颜色。活动列表/树有键盘焦点，非活动列表/树没有键盘焦点。
("list.activeSelectionForeground"); // List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
//当列表/树不活动时，列表/树背景颜色。活动列表/树有键盘焦点，非活动列表/树没有键盘焦点。
("list.inactiveSelectionBackground"); // List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
//当列表/树不活动时，列表/树前景色。活动列表/树有键盘焦点，非活动列表/树没有键盘焦点。
("list.inactiveSelectionForeground"); // List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
//当鼠标悬停在项目上时，列表/树背景
("list.hoverBackground"); // List/Tree background when hovering over items using the mouse.
//当鼠标悬停在项目上时，列表/树前景。
("list.hoverForeground"); // List/Tree foreground when hovering over items using the mouse.
//当使用鼠标移动项目时，列表/树拖放背景。
("list.dropBackground"); // List/Tree drag and drop background when moving items around using the mouse.
//在列表/树中搜索时，匹配的前景色突出显示。
("list.highlightForeground"); // List/Tree foreground color of the match highlights when searching inside the list/tree.
//快速选择颜色分组标签。
("pickerGroup.foreground"); // Quick picker color for grouping labels.
//快速选择颜色分组边界。
("pickerGroup.border"); // Quick picker color for grouping borders.
//按钮前景色。
("button.foreground"); // Button foreground color.
//按钮背景颜色。
("button.background"); // Button background color.
//鼠标悬停时按钮的背景颜色。
("button.hoverBackground"); // Button background color when hovering.
//徽章背景颜色。徽章是一种小的信息标签，例如用于搜索结果计数。
("badge.background"); // Badge background color. Badges are small information labels, e.g. for search results count.
//标识前景色。徽章是一种小的信息标签，例如用于搜索结果计数。
("badge.foreground"); // Badge foreground color. Badges are small information labels, e.g. for search results count.
//滚动条的阴影指示视图被滚动。
("scrollbar.shadow"); // Scrollbar shadow to indicate that the view is scrolled.
//滑块背景颜色。
("scrollbarSlider.background"); // Slider background color.
//鼠标悬停时滑块的背景颜色。
("scrollbarSlider.hoverBackground"); // Slider background color when hovering.
//活动时滑块的背景颜色。
("scrollbarSlider.activeBackground"); // Slider background color when active.
//进度条的背景颜色，可以显示长时间运行的操作。
("progressBar.background"); // Background color of the progress bar that can show for long running operations.
//编辑器背景颜色。
("editor.background"); // Editor background color.
//编辑器默认的前景色。
("editor.foreground"); // Editor default foreground color.
//编辑器小部件的背景颜色，如find/replace
("editorWidget.background"); // Background color of editor widgets, such as find/replace.
//编辑器窗口小部件的边框颜色。该颜色只在小部件选择有边框且该颜色没有被小部件覆盖的情况下使用。
("editorWidget.border"); // Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.
//编辑器选择的颜色。
("editor.selectionBackground"); // Color of the editor selection.
//选择高对比度文本的颜色。
("editor.selectionForeground"); // Color of the selected text for high contrast.
//在非活动编辑器中选择的颜色。
("editor.inactiveSelectionBackground"); // Color of the selection in an inactive editor.
//区域的颜色与选择相同的内容。
("editor.selectionHighlightBackground"); // Color for regions with the same content as the selection.
//当前搜索匹配的颜色。
("editor.findMatchBackground"); // Color f the current search match.
//其他匹配的颜色。
("editor.findMatchHighlightBackground"); // Color of the other search matches.
//为限制搜索的范围着色。
("editor.findRangeHighlightBackground"); // Color the range limiting the search.
//高亮显示鼠标悬停的单词
("editor.hoverHighlightBackground"); // Highlight below the word for which a hover is shown.
//编辑器悬停的背景颜色。
("editorHoverWidget.background"); // Background color of the editor hover.
//编辑器悬停的边框颜色。
("editorHoverWidget.border"); // Border color of the editor hover.
//活动链接的颜色。
("editorLink.activeForeground"); // Color of active links.
//插入文本的背景颜色。
("diffEditor.insertedTextBackground"); // Background color for text that got inserted.
//删除文本的背景颜色。
("diffEditor.removedTextBackground"); // Background color for text that got removed.
//插入文本的轮廓颜色。
("diffEditor.insertedTextBorder"); // Outline color for the text that got inserted.
//删除的文本的轮廓颜色。
("diffEditor.removedTextBorder"); // Outline color for text that got removed.
//当前概览标尺前景内联合并冲突。
("editorOverviewRuler.currentContentForeground"); // Current overview ruler foreground for inline merge-conflicts.
// 进入概述统治者的前景，用于内联合并冲突
("editorOverviewRuler.incomingContentForeground"); // Incoming overview ruler foreground for inline merge-conflicts.
//用于内联合并冲突的公共祖先概览标尺前景。
("editorOverviewRuler.commonContentForeground"); // Common ancestor overview ruler foreground for inline merge-conflicts.
//光标位置的线条高亮显示的背景颜色。
("editor.lineHighlightBackground"); // Background color for the highlight of line at the cursor position.
//在光标位置的线周围边框的背景色。
("editor.lineHighlightBorder"); // Background color for the border around the line at the cursor position.
//突出显示范围的背景颜色，如快速打开和查找功能。
("editor.rangeHighlightBackground"); // Background color of highlighted ranges, like by quick open and find features.
//编辑器光标的颜色。
("editorCursor.foreground"); // Color of the editor cursor.
//编辑器中空白字符的颜色。
("editorWhitespace.foreground"); // Color of whitespace characters in the editor.
//编辑器缩进的颜色。
("editorIndentGuide.background"); // Color of the editor indentation guides.
//编辑器行号的颜色。
("editorLineNumber.foreground"); // Color of editor line numbers.
//编辑器活动行号的颜色。
("editorLineNumber.activeForeground"); // Color of editor active line number.
//编辑器 rulers的颜色。
("editorRuler.foreground"); // Color of the editor rulers.
//编辑器代码镜头的前景色
("editorCodeLens.foreground"); // Foreground color of editor code lenses
//编辑器嵌入提示的前景色
("editorInlayHint.foreground"); // Foreground color of editor inlay hints
//编辑器嵌入提示的背景颜色
("editorInlayHint.background"); // Background color of editor inlay hints
//匹配括号后面的背景颜色
("editorBracketMatch.background"); // Background color behind matching brackets
//匹配方框的颜色
("editorBracketMatch.border"); // Color for matching brackets boxes
//概览标尺边框的颜色。
("editorOverviewRuler.border"); // Color of the overview ruler border.
//编辑器的背景颜色。gutter包含符号边距和行号。
("editorGutter.background"); // Background color of the editor gutter. The gutter contains the glyph margins and the line numbers.
//编辑器中错误的前景色。
("editorError.foreground"); // Foreground color of error squigglies in the editor.
//编辑器中错误的边框颜色。
("editorError.border"); // Border color of error squigglies in the editor.
//编辑器中警告的前景色
("editorWarning.foreground"); // Foreground color of warning squigglies in the editor.
//编辑器中警告标记的边框颜色。
("editorWarning.border"); // Border color of warning squigglies in the editor.
//编辑器标记导航小部件错误颜色。
("editorMarkerNavigationError.background"); // Editor marker navigation widget error color.
//编辑器标记导航小部件警告颜色。
("editorMarkerNavigationWarning.background"); // Editor marker navigation widget warning color.
//编辑器标记导航小部件的背景。
("editorMarkerNavigation.background"); // Editor marker navigation widget background.
//提示小部件的背景颜色。
("editorSuggestWidget.background"); // Background color of the suggest widget.
//提示窗口小部件的边框颜色。
("editorSuggestWidget.border"); // Border color of the suggest widget.
//建议小部件的前景色。
("editorSuggestWidget.foreground"); // Foreground color of the suggest widget.
//建议小部件中所选条目的背景颜色。
("editorSuggestWidget.selectedBackground"); // Background color of the selected entry in the suggest widget.
//在suggest小部件中突出显示匹配的颜色。
("editorSuggestWidget.highlightForeground"); // Color of the match highlights in the suggest widget.
//在读取过程中，例如读取变量，符号的背景颜色。
("editor.wordHighlightBackground"); // Background color of a symbol during read-access, like reading a variable.
//在写访问期间，符号的背景颜色，就像写变量一样。
("editor.wordHighlightStrongBackground"); // Background color of a symbol during write-access, like writing to a variable.
// peek视图标题区域的背景颜色
("peekViewTitle.background"); // Background color of the peek view title area.
// peek视图标题的颜色。
("peekViewTitleLabel.foreground"); // Color of the peek view title.
// peek视图标题信息的颜色。
("peekViewTitleDescription.foreground"); // Color of the peek view title info.
// peek视图边框和箭头的颜色。
("peekView.border"); // Color of the peek view borders and arrow.
// peek视图结果列表的背景颜色。
("peekViewResult.background"); // Background color of the peek view result list.
// peek视图结果列表中的线节点的前景色。
("peekViewResult.lineForeground"); // Foreground color for line nodes in the peek view result list.
// peek视图结果列表中文件节点的前景色。
("peekViewResult.fileForeground"); // Foreground color for file nodes in the peek view result list.
//在peek视图结果列表中选择条目的背景颜色。
("peekViewResult.selectionBackground"); // Background color of the selected entry in the peek view result list.
// peek视图结果列表中所选条目的前景色。
("peekViewResult.selectionForeground"); // Foreground color of the selected entry in the peek view result list.
// peek视图编辑器的背景颜色。
("peekViewEditor.background"); // Background color of the peek view editor.
//预览视图编辑器中gutter的背景颜色。
("peekViewEditorGutter.background"); // Background color of the gutter in the peek view editor.
//在peek视图结果列表中匹配高亮颜色。
("peekViewResult.matchHighlightBackground"); // Match highlight color in the peek view result list.
//在peek视图编辑器中匹配高亮颜色。
("peekViewEditor.matchHighlightBackground"); // Match highlight color in the peek view editor.
