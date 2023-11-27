import { Node } from "prosemirror-model";
import { NodeSelection, Plugin, PluginKey } from "prosemirror-state";
import { ReplaceStep } from "prosemirror-transform";

import { schema } from "../schema";

const key = new PluginKey("ProseMirror_Test");

interface Item {
  id: string;
  name: string;
  from: number;
  to: number;
  node: Node;
}

type State = Record<string, Item>;

export const getTestPlugin = (): Plugin => {
  const idMap = new Map<string, boolean>();

  const meta = { isDelete: false, id: "" };

  return new Plugin({
    key,
    state: {
      init() {
        return {} as State;
      },

      apply(tr, value, oldState, newState) {
        const names = ["speed"];
        const result: State = {};

        const ids = Array.from(idMap.entries())
          .filter(([_, value]) => value)
          .map(([id]) => id);
        idMap.clear();

        tr.doc.descendants((node, from) => {
          const index = node.marks.findIndex((mark) => names.includes(mark.type.name));
          if (index === -1) return;
          const mark = node.marks[index];
          const name = mark.type.name;
          const id = mark.attrs.id;
          const to = from + node.nodeSize + 1;
          if (meta.isDelete && meta.id === id) return;

          result[id] = { name, from, to, node, id };
          idMap.set(id, ids.includes(id));
        });

        return result;
      }
    },

    appendTransaction(transactions, oldState, newState) {
      const tr = newState.tr;
      const nodeSize = 2;
      const itemRecord = key.getState(newState) as State;

      Array.from(idMap.entries()).forEach(([id, value]) => {
        if (value) return;
        const data = itemRecord[id];

        tr.insert(data.from, schema.nodes.speedLeft.create());
        tr.insert(data.to + 1, schema.nodes.speedRight.create());
        idMap.set(id, true);
      });

      // 判断 是否执行了删除
      const steps = transactions.map((_tr) => _tr.steps).flat();
      const isDelete =
        steps.findIndex(
          (step) => step instanceof ReplaceStep && step.slice.content.childCount === 0
        ) !== -1;
      if (!isDelete) return tr;

      Object.values(itemRecord).forEach(({ id, from: _from, to: _to, node }) => {
        const from = _from;
        const to = _to + 1;

        const fromIsTextNode = isText(tr.doc, from - nodeSize);
        const toIsTextNode = isText(tr.doc, to - nodeSize);

        if (fromIsTextNode && !toIsTextNode) {
          tr.delete(to - nodeSize, to - nodeSize + 1);
          tr.removeMark(from - nodeSize, to - nodeSize * 2 - 1, schema.marks.speed);
        } else if (!fromIsTextNode && toIsTextNode) {
          tr.delete(from - nodeSize, from - nodeSize + 1);
          tr.removeMark(from - nodeSize, to - nodeSize * 2 - 1, schema.marks.speed);
        }
      });
      return tr;
    }
  });
};

function isText(doc: Node, pos: number) {
  try {
    const selection = NodeSelection.create(doc, pos);
    return selection.node.type.name === "text";
  } catch {
    return true;
  }
}

/**
 * 未能解决
 * 历史记录 操作 bug
 * 文本首个字符串输出 bug
 */
