import { Node } from "prosemirror-model";
import { DecorationSource, EditorView } from "prosemirror-view";

export class MarkTest {
  dom: HTMLSpanElement;
  constructor(node: Node, view: EditorView, getPos: () => number) {
    this.dom = document.createElement("span");
    this.dom.className = "text";
  }

  update(node: Node, decorations: any[], innerDecorations: DecorationSource) {
    console.log("MarkTest", node, decorations, innerDecorations);
    return false;
  }
}
