import { Schema } from "prosemirror-model";

export const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: { group: "block", content: "(text|inline|speed)*", toDOM: () => ["p", 0] },
    text: {},
    special_span: {
      content: "inline*",
      inline: true,
      group: "inline",
      attrs: {
        class: { default: "special-span" }
      },
      parseDOM: [{ tag: "span.special-span" }],
      toDOM: (node) => ["span", { class: node.attrs.class }, 0]
    },
    break: {
      inline: true,
      group: "inline",
      content: "text*",
      attrs: { time: { default: "100ms" } },
      toDOM: (node: any) => {
        return ["span", { class: "text" }, `${node.attrs.time}ms`];
      },
      parseDOM: [{ tag: "break" }, { tag: "b" }]
    },
    speedLeft: {
      inline: true,
      atom: true,
      selectable: false,
      group: "speed",
      content: "text*",
      attrs: { id: { default: "xxx" } },
      toDOM: (node: any) => ["span", { class: "speed-left", id: node.attrs.id }, "["],
      parseDOM: [
        { tag: "speed" },
        {
          getAttrs: (node: HTMLElement) => {
            if (!node.classList.contains("speed-left")) return false;
            return { id: node.getAttribute("id") };
          }
        }
      ]
    },
    speedRight: {
      inline: true,
      atom: true,
      selectable: false,
      group: "speed",
      content: "text*",
      attrs: { id: { default: "xxx" }, speed: { default: 1 } },
      toDOM: (node: any) => {
        const dom = document.createElement("span");
        dom.id = node.attrs.id;
        dom.className = "speed-right";
        dom.innerHTML = `]<span class="speed-text">${node.attrs.speed}</span>`;
        return dom;
      },
      parseDOM: [
        { tag: "speed" },
        {
          getAttrs: (node: HTMLElement) => {
            if (!node.classList.contains("speed-right")) return false;
            return { id: node.getAttribute("id") };
          }
        }
      ]
    }
  },
  marks: {
    speed: {
      // inclusive: false,
      attrs: { id: { default: "xxx" } },
      parseDOM: [
        { tag: "i" },
        {
          tag: "speed",
          getAttrs(em: HTMLEmbedElement) {
            return { id: em.getAttribute("dd") };
          }
        }
      ],
      toDOM(el) {
        console.log("Todom", { id: el.attrs.id, class: "text" });
        return ["speed", { id: el.attrs.id, class: "text" }, 0];
      }
    }
  }
});
