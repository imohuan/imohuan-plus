import { Plugin } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

/** 解决一部分光标问题 */
export const cursor = (): Plugin => {
  return new Plugin({
    props: {
      decorations(state) {
        const from = state.selection.$from.pos;
        const to = state.selection.$to.pos;
        const decorations: Decoration[] = [];
        const { nodeBefore, nodeAfter } = state.doc.resolve(from);
        const isBeforeNode = nodeBefore && !nodeBefore?.isText;
        const isAfterNode = nodeAfter && !nodeAfter?.isText;
        const width = 0;

        const createWhiteNode = (pos: number, side = -1) => {
          const whiteNode = document.createElement("span");
          whiteNode.setAttribute("contenteditable", "false");
          whiteNode.setAttribute("style", `display: inline-block;width: ${width}px;`);
          const whiteText = document.createTextNode("\u200B");

          if (side <= 0) {
            decorations.push(Decoration.widget(pos, whiteNode, { side }));
            decorations.push(Decoration.widget(pos, whiteText, { side }));
          } else {
            decorations.push(Decoration.widget(pos, whiteText, { side }));
            decorations.push(Decoration.widget(pos, whiteNode, { side }));
          }
        };

        // 当光标处于一个节点左右两侧的时候，设置光标距离节点有一定距离
        // if (isBeforeNode) {
        //   console.log("修复左侧节点光标");
        //   createWhiteNode(pos, -1);
        // }

        // if (isAfterNode) {
        //   console.log("修复右侧节点光标");
        //   createWhiteNode(pos, 1);
        // }

        /** 全选 修复光标会凸显一小块, 通过css解决 br.ProseMirror-trailingBreak { display: none; } */

        if (from !== state.selection.$to.pos) return;

        // 光标处于文档开头，后面有一个Node节点
        if (!nodeBefore && isAfterNode) {
          // console.log("修复开头光标");
          createWhiteNode(from, 1);
        }

        // 光标处与2个节点之间
        if (isBeforeNode && isAfterNode) {
          // console.log("修复2个节点之间");
          createWhiteNode(from, -1);
          createWhiteNode(from, 1);
        }

        // 光标处于文档开头，后面有一个Node节点
        if (isBeforeNode && !nodeAfter) {
          console.log("修复结尾光标");
          createWhiteNode(from, -1);
        }

        if (decorations.length > 0) return DecorationSet.create(state.doc, decorations);
        return DecorationSet.empty;
      }
    }
  });
};
