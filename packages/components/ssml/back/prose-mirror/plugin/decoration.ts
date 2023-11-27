import {
  Command,
  EditorState,
  Plugin,
  PluginKey,
  TextSelection,
  Selection
} from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { NodeType, MarkType, DOMSerializer, Node } from "prosemirror-model";
import { schema } from "../schema";

const key = new PluginKey("ProseMirror_Decoration");

interface DecorationType {
  name: string;
  from: number;
  to: number;
  node: Node;
}

export const getMarkDecorationPlugin = (): Plugin => {
  return new Plugin({
    key,
    state: {
      init() {
        return [] as DecorationType[];
      },

      apply(tr) {
        const names = ["speed"];
        const result: DecorationType[] = [];
        tr.doc.descendants((node, pos) => {
          const index = node.marks.findIndex((mark) => names.includes(mark.type.name));
          if (index === -1) return;
          const name = node.marks[index].type.name;
          const to = pos + node.nodeSize;
          result.push({ name, from: pos, to, node });
        });
        return result;
      }
    },
    props: {
      handleKeyDown(view, event) {
        const types: DecorationType[] = key.getState(view.state);
        const tr = view.state.tr;
        const { from } = tr.selection;
        const posList = types.map((type) => [type.from, type.to]).flat();
        if (event.key === "Backspace" && posList.includes(from)) {
          console.log("删除了对应的Mark");
        }
      },
      decorations(state) {
        const types: DecorationType[] = key.getState(state);
        const doms: HTMLSpanElement[] = [];
        const decorationList = [];
        types.forEach(({ node, from, to, name }) => {
          const speedLeft = document.createElement("span");
          speedLeft.innerHTML = "[";
          speedLeft.className = `${name}-left`;
          const speedRight = document.createElement("span");
          speedRight.innerHTML = "<span>]</span><span class='button'>Button</span>";
          speedRight.className = `${name}-right`;
          doms.push(speedLeft, speedRight);
          decorationList.push(Decoration.widget(from, speedLeft, { side: -1 }));
          decorationList.push(Decoration.widget(to, speedRight, {}));
        });
        setTimeout(() => doms.forEach((dom) => (dom.contentEditable = "true")));
        return DecorationSet.create(state.doc, decorationList);
      }
    }
  });
};
