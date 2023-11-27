import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { getStateData } from "./state";

export const select = (): Plugin => {
  return new Plugin({
    props: {
      handleDOMEvents: {
        // 判断当前内容拖拽是否包含 单个组节点，如果存在单组节点则禁止拖拽
        drop: (view) => getStateData(view.state).isSelectGroupNodeError
      },
      decorations(state) {
        const { $from, $to } = state.tr.selection;
        const from = $from.pos;
        const to = $to.pos;
        const exclude = ["paragraph", "text"];
        const decorations: Decoration[] = [];
        if (from === to) return DecorationSet.empty;
        state.doc.nodesBetween(from, to, (node, pos) => {
          if (exclude.includes(node.type.name)) return;
          decorations.push(Decoration.node(pos, pos + node.nodeSize, { class: "ssml-selected" }));
        });
        console.groupEnd();
        if (decorations.length > 0) return DecorationSet.create(state.doc, decorations);
        return DecorationSet.empty;
      }
    }
  });
};
