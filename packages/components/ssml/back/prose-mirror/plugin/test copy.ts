import {
  Command,
  EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
  TextSelection
} from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { NodeType, MarkType, DOMSerializer, Node } from "prosemirror-model";
import { schema } from "../schema";

const key = new PluginKey("ProseMirror_Test");

interface Item {
  name: string;
  from: number;
  to: number;
  node: Node;
}

interface State {
  items: Item[];
}

export const getTestPlugin = (): Plugin => {
  const idMap = new Map<string, boolean>();

  return new Plugin({
    key,
    state: {
      init() {
        return {} as State;
      },

      apply(tr, value, oldState, newState) {
        const names = ["speed"];
        const items: Item[] = [];
        tr.doc.descendants((node, from) => {
          const index = node.marks.findIndex((mark) => names.includes(mark.type.name));
          if (index === -1) return;
          const mark = node.marks[index];
          const name = mark.type.name;
          const id = mark.attrs.id;
          const to = from + node.nodeSize + 1;
          items.push({ name, from, to, node });
          if (!idMap.has(id)) idMap.set(id, false);
          // tr.insert(from, schema.nodes.speedLeft.create());
          // tr.insert(to + 1, schema.nodes.speedRight.create());
        });

        return { items };
      }
    },

    appendTransaction(transactions, oldState, newState) {
      Array.from(idMap.entries()).forEach(([id, value]) => {
        if(!value)
      });

      // console.log(
      //   "transactions",
      //   transactions.map((m) => m.doc.toString())
      // );
      // return newState.tr;
      // console.log("appendTransaction", transactions, oldState, newState);
      const { items } = key.getState(newState) as State;
      const tr = newState.tr;

      transactions.forEach((transaction) => {
        console.log(transaction.steps);
        // console.group();
        // transaction.steps.forEach((step, i) => {
        //   console.log(i, step?.slice, step);
        // });
        // console.groupEnd();
      });
      try {
        items.forEach(({ from, to, node }) => {
          console.log("from, to", from, to);
          const fromNode = NodeSelection.create(tr.doc, from);
          const toNode = NodeSelection.create(tr.doc, to);
          const fromIsTextNode = fromNode.node.type.name === "text";
          const toIsTextNode = toNode.node.type.name === "text";
          console.log({ fromNode, toNode, fromIsTextNode, toIsTextNode });
          if (fromIsTextNode && !toIsTextNode) {
            // 开头被删除
            tr.delete(to - 1, to);
            console.log("开头被删除，执行删除结尾 ");
          } else if (!fromIsTextNode && toIsTextNode) {
            // 结尾被删除
            tr.delete(from, from + 1);
            console.log("结尾被删除，执行删除开头");
          } else if (fromIsTextNode && toIsTextNode) {
            console.log("添加节点");
            tr.insert(from, schema.nodes.speedLeft.create());
            tr.insert(to + 1, schema.nodes.speedRight.create());
          } else {
            console.log("都是节点", { fromNode, toNode });
          }
        });
      } catch {}
      //需要处理两种不同的情况
      // 1。
      //检查左括号是否被删除。如果是，那就查一下
      //在状态中匹配右括号并删除它。
      // 2。
      //检查右括号是否被删除。如果是，那就查一下
      //在状态中匹配右括号并删除它。
      return tr;
    }
  });
};
