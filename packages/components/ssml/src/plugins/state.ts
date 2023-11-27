import { Plugin, PluginKey, EditorState } from "prosemirror-state";
import { groupNode } from "../config";
import { Node } from "prosemirror-model";

/** 获取指定from到to之间的单个组节点列表 */
const groupNodeBetween = (
  state: EditorState,
  from: number,
  to: number
): { id: string; node: Node }[] => {
  const counts: any = {};

  state.doc.nodesBetween(from, to, (node) => {
    if (!groupNode.includes(node.type) || !node.attrs?.id) return;
    const { id, type } = node.attrs;
    if (!counts[id]) counts[id] = { id, node, left: 0, right: 0 };
    counts[id][type]++;
  });

  return Object.keys(counts)
    .filter((id) => counts[id].left !== counts[id].right)
    .map((id) => counts[id]);
};

export interface State {
  /** 选中文字 */
  text: string;
  /** 选中节点 */
  nodes: Node[];
  /** 是否插入 */
  isInsert: boolean;
  /** 是否选中 */
  isSelect: boolean;
  /** 选中是否是数字 */
  isNum: boolean;
  /** 选中是否是单词 */
  isWord: boolean;
  /** 当前正在那些(组节点)内部进行编辑 */
  outGroupNodes: Node[];
  /** 当前选中的组节点 */
  selectGroupNodes: Node[];
  /** 当前选中的组节点是否缺失 */
  isSelectGroupNodeError: boolean;
}

export const stateKey = new PluginKey("state-key");

export const getStateData = (state: EditorState): State => {
  return stateKey.getState(state);
};

export const state = (): Plugin => {
  return new Plugin({
    key: stateKey,
    state: {
      init: () =>
        ({
          text: "",
          nodes: [],
          isInsert: true,
          isSelect: false,
          isNum: false,
          isWord: false,
          outGroupNodes: [],
          selectGroupNodes: [],
          isSelectGroupNodeError: false
        } as State),
      apply(tr, value, oldState, newState) {
        const { $from, $to } = tr.selection;
        const from = $from.pos;
        const to = $to.pos;

        const textContent = newState.doc.textBetween(from, to, " ");
        const nodes: any[] = [];
        const exclude = ["paragraph", "text"];
        newState.doc.nodesBetween(from, to, (node, pos) => {
          if (exclude.includes(node.type.name)) return;
          nodes.push({ node, pos });
        });

        // 是否为插入
        const isInsert = from === to;
        // 是否为选择
        const isSelect = !isInsert;
        // 是否包含节点
        const isHasNode = nodes.length > 0;
        // 是否是数字
        const isNum = !isHasNode && /^([0-9\.]+)$/.test(textContent);
        // 是否是单词
        const isWord = !isHasNode && /^[a-zA-Z]{1}\w+$/.test(textContent);

        // 当前正在那些(组节点)内部进行编辑
        const outGroupNodes: any[] = [];
        // 当前选中的组节点
        const selectGroupNodes: any[] = [];
        // 当前选中的组节点是否缺失
        let isSelectGroupNodeError = false;

        if (isInsert) {
          groupNodeBetween(newState, 0, from).forEach(({ node }) => outGroupNodes.push(node));
        } else {
          nodes.forEach(({ node }) => {
            if (groupNode.includes(node.type)) selectGroupNodes.push(node);
          });
          isSelectGroupNodeError = groupNodeBetween(newState, from, to).length > 0;
        }

        return {
          text: textContent,
          nodes,
          isInsert,
          isSelect,
          isNum,
          isWord,
          outGroupNodes,
          selectGroupNodes,
          isSelectGroupNodeError
        };
      }
    }
  });
};
