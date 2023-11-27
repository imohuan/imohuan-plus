import { Command, EditorState, Plugin, PluginKey, TextSelection } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { NodeType, MarkType, DOMSerializer } from "prosemirror-model";
import { schema } from "../schema";

const key = new PluginKey("ProseMirror_CursorEnd");

/** 解决在结尾插入Node的时候光标换行 */
export const getCursorEndPlugin = (): Plugin => {
  return new Plugin({
    key,
    state: {
      init() {
        return {
          posList: [],
          enable: false
        };
      },

      apply(tr, set) {
        const suffixPos = [];
        tr.doc.forEach((node) => {
          const isText = node.lastChild && node.lastChild.type.name === "text";
          if (isText) return;
          suffixPos.push(node.nodeSize - 1);
        });
        return { posList: suffixPos, enable: suffixPos.length > 0 };
      }
    },
    props: {
      handleDOMEvents: {
        beforeinput(view, e) {
          const { enable } = key.getState(view.state);
          if (!enable) return false;
          const from = view.state.selection.from;
          e.preventDefault();
          view.dispatch(view.state.tr.insertText(e.data || "", from));
          return true;
        }
      },
      decorations(state) {
        const { posList, enable } = key.getState(state);
        if (!enable) return;
        const suffixDecoration = [];
        const suffixDoms: HTMLSpanElement[] = [];
        posList.forEach((pos: number) => {
          const domLeft = document.createElement("span");
          const domRight = document.createElement("span");
          suffixDoms.push(domLeft);
          suffixDoms.push(domRight);
          suffixDecoration.push(Decoration.widget(pos, domLeft, { side: -1 }));
          suffixDecoration.push(Decoration.widget(pos, domRight, { side: -1 }));
        });
        setTimeout(() => suffixDoms.forEach((dom) => (dom.contentEditable = "true")));
        return DecorationSet.create(state.doc, suffixDecoration);
      }
    }
  });
};
