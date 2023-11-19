## Monaco Editor

在 Monaco Editor 中，每个用户可见的编辑器均对应一个 IStandaloneCodeEditor。

在构造时可以指定一系列选项，如行号、minimap 等。
其中，每个编辑器的代码内容等信息存储在 ITextModel 中。
model 保存了文档内容、文档语言、文档路径等一系列信息，当 editor 关闭后 model 仍保留在内存中

因此可以说，editor 对应着用户看到的编辑器界面，是短期的、暂时的；
model 对应着当前网页历史上打开/创建过的所有代码文档，是长期的、保持的。

创建 model 时往往给出一个 URI，如 inmemory://model1、file://a.txt 等。
注意到，此处的 URI 只是一个对 model 的唯一标识符
不代表在编辑器中做的编辑将会实时自动保存在本地文件 a.txt 中！以下为样例：

## 目录介绍

- `language` 自定义新语言解析
- `theme` 主题配置
- `src` 资源目录
- `static` `js`, `json` 文件
- `worker` worker 脚本

## 工具函数

### `src/helper.ts`

- `setFocus` 编辑器 聚焦
- `getCursorPosition` 获取编辑器光标
- `setCursorPosition` 设置编辑器光标
- `setLineNumberOnOff` 设置是或否显示行
- `setMinimapOnOff` 设置小地图
- `setFontSize` 设置文字大小
- `setValueForUndo` 修改 editor 的值，又不会 丢失编辑器 undo 的堆栈

- `addCommand` 添加编辑器 快捷键

- `loadDts` 加载 .d.ts 声明，并且提供 引用

- `addCompletionItem` 添加代码片段. 核心：后面大多数都是使用类似的方法生成 suggestions 数组，通过内容判断是否返回

- `addCompletionKeyWord` 添加代码关键字

- `addCompletionMatchKeyWord` 添加关于全局匹配 match 到的关键字

- `keywordHover` match 代码 - hover 提示
