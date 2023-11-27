import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Plugin } from "prosemirror-state";

import { cursor } from "./cursor";
import { paste } from "./paste";
import { tagnode } from "./tag";
import { select } from "./select";
import { state } from "./state";

export const plugins: Plugin[] = [
  /** 历史记录 */
  history(),
  /** 历史记录的快捷键：Ctrl + Z 撤销 Ctrl + Y 前进 */
  keymap({ "Mod-z": undo, "Mod-y": redo, "Mod-Shift-Z": redo }),
  /** 绑定基础的快捷键，避免在编辑器中使用回车不能换行 */
  keymap(baseKeymap),
  /** 实现前后节点同步修改和删除，并且实现节点组的Content匹配(如组节点不能进行嵌套使用) */
  tagnode(),
  /** 自定义粘贴逻辑，将只有一半的节点补全（左右一组节点），并且实现替换组节点中的 id */
  paste(),
  /** 修复光标不显示：开头光标，两节点之间光标 */
  cursor(),
  /** 用户选择的时候添加光标背景，静止拖拽单组节点 */
  select(),
  /** 当前选择状态 */
  state()
];
