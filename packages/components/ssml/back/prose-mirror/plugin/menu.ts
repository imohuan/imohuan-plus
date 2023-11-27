import { Command, EditorState, Plugin, PluginKey, TextSelection } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { NodeType, MarkType, DOMSerializer } from "prosemirror-model";
import { schema } from "../schema";

const key = new PluginKey("ProseMirror_Menus");

export const getCustomMenuPlugin = (items: Items[]): Plugin => {
  return new Plugin({
    key,
    props: {},
    view(editorView) {
      let menuView = new MenuView(items, editorView);
      editorView.dom.parentNode.insertBefore(menuView.dom, editorView.dom);
      return menuView;
    }
  });
};

export type ItemEnableType = "none" | "select" | "word" | "number" | "char";

export interface Items {
  icon: string;
  label: string;
  type: NodeType | MarkType;
  enable: ItemEnableType;
  command: Command;
}

class MenuView {
  dom: HTMLElement;
  items: (Items & { dom: HTMLDivElement })[];
  editorView: any;

  constructor(items: Items[], editorView: any) {
    this.items = items as any;
    this.editorView = editorView;
    this.dom = document.createElement("div");
    this.dom.className = "menubar";
    this.items.forEach((item) => {
      item.dom = this.create(item.icon, item.label);
      this.dom.appendChild(item.dom);
    });
    this.update();

    /** 注册 点击事件 */
    this.dom.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      editorView.focus();
      this.items.forEach(({ command, dom, enable }) => {
        if (dom.contains(e.target as any) && this.enable(editorView.state, enable)) {
          command(editorView.state, editorView.dispatch, editorView);
        }
      });
    });
  }

  /** 判断该类型在当前选择状态下是否可行 */
  enable(state: EditorState, enableType: ItemEnableType): boolean {
    const { from, to } = state.selection;
    const cutDoc = state.doc.cut(from, to);
    const domSerializer = DOMSerializer.fromSchema(schema);
    const drag = domSerializer.serializeFragment(cutDoc.content);

    if (enableType === "none" && drag.childNodes.length === 0) return true;
    if (drag.childNodes.length === 1 && drag.childNodes[0].nodeName === "P") {
      const content = drag.childNodes[0].textContent;
      switch (enableType) {
        case "select":
          return drag.childNodes.length > 0;
        case "word":
          return /^[a-zA-Z]+$/.test(content);
        case "number":
          return /^\d+$/.test(content);
        case "char":
          return content.length === 1 ? /[\u4E00-\u9FFF]/.test(content) : false;
      }
      return false;
    }
  }

  /** 创建 Item DOM */
  create(icon: string, label: string): HTMLDivElement {
    const dom = document.createElement("div");
    dom.classList.add("menubar-item");
    const imgDom = document.createElement("img");
    imgDom.src = icon;
    const labelDom = document.createElement("span");
    labelDom.innerText = label;
    dom.appendChild(imgDom);
    dom.appendChild(labelDom);
    return dom;
  }

  /** 视图更新 */
  update() {
    this.items.forEach(({ command, dom, enable }) => {
      if (
        command(this.editorView.state, null, this.editorView) &&
        this.enable(this.editorView.state, enable)
      ) {
        dom.classList.remove("disable");
      } else {
        dom.classList.add("disable");
      }
    });
  }

  destroy() {
    this.dom.remove();
  }
}
