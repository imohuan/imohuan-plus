import { Node } from "prosemirror-model";
import { EditorView } from "prosemirror-view";
export class SpeedLeft {
  dom: HTMLDivElement;
  constructor(node: Node, view: EditorView, getPos: () => number) {}
}

export class ImageView {
  dom: HTMLDivElement;

  constructor(node: Node, view: EditorView, getPos: () => number) {
    // this.dom = document.createElement("img");
    // this.dom.src = node.attrs.src;
    // this.dom.alt = node.attrs.alt;
    // this.dom.addEventListener("click", (e) => {
    //   e.preventDefault();
    //   let alt = prompt("New alt text:", "");
    //   if (alt)
    //     view.dispatch(
    //       view.state.tr.setNodeMarkup(getPos(), null, {
    //         src: node.attrs.src,
    //         alt
    //       })
    //     );
    // });
    this.dom = document.createElement("div");
    this.dom.contentEditable = "true";
    this.dom.innerHTML = "你好";
  }
}
