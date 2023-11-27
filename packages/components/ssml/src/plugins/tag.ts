import { EditorState, Plugin, PluginKey, TextSelection } from "prosemirror-state";

import { groupNode, nestNode } from "../config";
import { schema } from "../schema";
import { Node } from "prosemirror-model";

const gourpNodeMap: any = {};
groupNode.forEach((node) => (gourpNodeMap[node.name] = node));

export const tagnodeKey = new PluginKey("TAG_Plugin");
/** 组节点同步删除, 限制组节点内不能出现另一个节点（content中有定义，因为该自定义节点特殊导致无法正常适配content中的内容） */

/** 获取 当前光标位置是在那些组节点内 */
const getGroupNode = (pos: number, state: EditorState) => {
  let halfCounts: any = {};
  const counts: any = {};
  state.doc.descendants((node, _pos) => {
    if (groupNode.includes(node.type)) {
      const { id, type } = node.attrs;
      if (!counts[id]) counts[id] = { id, node, pos: _pos, left: 0, right: 0 };
      if (type === "left" || type === "right") counts[id][type]++;
      if (_pos < pos) halfCounts = JSON.parse(JSON.stringify(counts));
    }
  });
  const hasErrorTag =
    Object.keys(counts).filter((id) => counts[id].left !== counts[id].right).length > 0;
  if (hasErrorTag) throw new Error("出现异常节点");

  return Object.keys(halfCounts)
    .filter((id) => halfCounts[id].left !== halfCounts[id].right)
    .map((id) => halfCounts[id]);
};

/** 删除当前组节点的另一个节点，并且实现节点组的Content匹配 */
export const tagnode = (): Plugin => {
  return new Plugin({
    key: tagnodeKey,
    appendTransaction(transactions, oldState, newState) {
      let tr = newState.tr;

      transactions.forEach((transaction) => {
        if (transaction.steps.length === 0) return;

        // 如果获取每个steps，会导致from位置错误，因为多个steps之后的from会增加长度，导致得出的结果错误
        const outSideNodeOptions = getGroupNode(transaction.steps[0].toJSON().from, oldState);

        // 撤销多步操作时，每次撤销都会改变文档的状态，导致后续的撤销操作可能引用了无效的位置。这是因为在 ProseMirror 中，文档的状态是不可变的，每个更改都会生成一个新的状态。
        // 1. 逆转步骤的顺序：由于每个步骤都基于之前的文档状态，因此应当从最后一个步骤开始撤销，并逆序向前处理每个步骤。
        // 2. 更新事务：在应用一个步骤的逆转之后，您需要用新的事务状态来应用下一个逆转步骤，以确保每一步的逆转都是基于当前的文档状态。
        for (let i = transaction.steps.length - 1; i >= 0; i--) {
          const step = transaction.steps[i];
          const { from, to, slice } = step.toJSON();
          if (slice && slice?.content?.length > 0) {
            // Add 或者 Replace 判断新增节点是否为gourpNode
            if (outSideNodeOptions.length === 0) return;
            const outNodeTypes = outSideNodeOptions.map((m) => schema.nodes[m.node.type]);
            const groupNames = groupNode.map((node) => node.name);
            slice.content.forEach((nodeOption: any) => {
              const { type } = nodeOption;
              const addNodeType = schema.nodes[type];
              // 判断当前新增节点是否包含节点组
              if (!groupNames.includes(type)) return;

              // 判断新增节点是否允许存在在组节点中
              const isAllowExist = outNodeTypes.some((node) =>
                node.contentMatch.matchType(addNodeType)
              );
              if (!isAllowExist) {
                // 不允许出现，则需要进行撤销
                tr.step(step.invert(transaction.docs[i]));
              }
            });
          } else {
            // Remove 监听删除元素，删除当前组节点的另一个节点，判断被删除的Node是否在Types中
            // 获取删除节点信息
            type Action = { type: "delete" | "replace"; pos: number; node: Node };
            const actions: Action[] = [];
            const deleteIds: string[] = [];
            // 获取删除位置中是否存在组节点
            oldState.doc.nodesBetween(from, to, (node, pos) => {
              // 判断是否包含组节点
              if (groupNode.includes(node.type) && node.attrs?.id) {
                deleteIds.push(node.attrs.id);
              }

              // 判断删除的是否是嵌套节点(前提：不是选中后删除，而是在编辑的时候删除， 判断光标)
              if (nestNode.includes(node.type) && node.attrs?.text && from + 1 === to) {
                // 追加内容 如果直接替换可能造成文档改变 导致之后的删除出现异常
                actions.push({ type: "replace", pos, node });
              }
            });

            newState.doc.descendants((node, pos) => {
              // 删除doc中和当前节点的id相同的节点（左右节点id相同，type不同）
              if (deleteIds.includes(node.attrs.id)) {
                actions.push({ type: "delete", pos, node });
              }
            });

            // 多个删除pos需要反过来进行删除
            actions
              .sort((a, b) => a.pos - b.pos)
              .forEach(({ type, node, pos }) => {
                if (type === "delete") tr.delete(pos, pos + 1);
                if (type === "replace") {
                  // 替换的前提是光标不是选中状态，所以可以直接修改光标位置
                  tr.replaceRangeWith(pos, pos, schema.text(node.attrs.text));
                  // 处理光标问题
                  tr = tr.setSelection(TextSelection.create(tr.doc, pos + node.attrs.text.length));
                }
              });
          }
        }
      });

      return tr.docChanged ? tr : null;
    }
  });
};
