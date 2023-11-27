import { NodeSpec } from "prosemirror-model";
import { getAttrs, randId } from "../helper";

export const nodes: Record<string, NodeSpec> = {
  /** 说话 */
  voice: {
    content: "(text|break|express|silence|phoneme|audio|prosody)*",
    group: "voice",
    inline: true,
    selectable: false,
    attrs: { type: { default: "left" }, id: { default: "" }, class: { default: "ssml-voice" } },
    // TODO: 粘贴的时候ID会一同粘贴，这就导致了插件删除元素错误
    parseDOM: [{ tag: "b.ssml-voice", getAttrs: (dom) => getAttrs(dom, ["id", "type", "class"]) }],
    toDOM: (node) => ["b", { class: "ssml-voice", type: node.attrs.type, id: node.attrs.id }]
  },
  /** 停顿 */
  break: {
    group: "voice",
    inline: true,
    selectable: false,
    attrs: { time: { default: 100 }, class: { default: "ssml-break" } },
    parseDOM: [{ tag: "b.ssml-break", getAttrs: (dom) => getAttrs(dom, ["time"]) }],
    toDOM: (node) => ["b", { class: "ssml-break", time: node.attrs.time }]
  },
  /** 说话表达方式：说话风格（幽默风趣，愤怒），强度, 扮演角色（老人，小孩等等） */
  express: {
    group: "voice",
    inline: true,
    selectable: false,
    parseDOM: [{ tag: "span", attrs: { class: "express" } }],
    toDOM: () => ["span", 0]
  },
  /** 静音 */
  silence: {
    group: "voice",
    inline: true,
    selectable: false,
    parseDOM: [{ tag: "span", attrs: { class: "silence" } }],
    toDOM: () => ["span", 0]
  },
  /** 自定义发音 */
  phoneme: {
    group: "voice",
    inline: true,
    selectable: false,
    attrs: { text: { default: "" }, class: { default: "ssml-phoneme" } },
    parseDOM: [{ tag: "b.ssml-phoneme", getAttrs: (dom) => getAttrs(dom, ["text"]) }],
    toDOM: (node) => ["b", { class: "ssml-phoneme", time: node.attrs.time }]
  },
  /** 音频 */
  audio: {
    group: "voice",
    inline: true,
    selectable: false,
    attrs: { src: { default: "" } },
    parseDOM: [{ tag: "span", attrs: { class: "audio" } }],
    toDOM: () => ["span", 0]
  },
  /** 韵律 */
  prosody: {
    group: "voice",
    inline: true,
    selectable: false,
    parseDOM: [{ tag: "span", attrs: { class: "prosody" } }],
    toDOM: () => ["span", 0]
  }
};
