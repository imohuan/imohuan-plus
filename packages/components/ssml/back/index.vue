<template>
  <div ref="prosemirrorEditor">
    <div>
      <n-button @click="onInsertElement">插入元素</n-button>
      <n-button @click="onToggleMark">标记元素</n-button>
      <n-button @click="onCustomNode">标记元素</n-button>
      <n-button @click="onSsml">输出SSML</n-button>
    </div>
  </div>
  <div ref="prosemirrorContent" class="content"></div>

  <div class="">ddddddddddddd</div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui";
import "./styles/index.scss";
import "prosemirror-view/style/prosemirror.css";
import "prosemirror-menu/style/menu.css";
import "prosemirror-example-setup/style/style.css";
import xmlFormat from "xml-formatter";
import { onMounted, ref } from "vue";
import { parseDoc } from "./helper/doc";
import { keymap } from "prosemirror-keymap";
import { EditorView } from "prosemirror-view";
import { Transform } from "prosemirror-transform";
import { toggleMark, baseKeymap } from "prosemirror-commands";
import { Schema, DOMParser } from "prosemirror-model";
import { EditorState, Plugin } from "prosemirror-state";
import { undo, redo, history } from "prosemirror-history";
import { PurplePlugin, TagPlugin, tagPluginKey, TooltipPlugin } from "./plugins/plugins";
import { MyCustomNodeView } from "./view/test";
import { getInlineNodesCursorPlugin } from "./plugins/cursor";

const prosemirrorEditor = ref();
const prosemirrorContent = ref();
let instance: { schema: Schema; plugins: Plugin<any>[]; state: EditorState; view: EditorView };

onMounted(() => {
  const schema = new Schema({
    nodes: {
      doc: { content: "block+" },
      paragraph: {
        group: "block",
        content: "(text|voice|placeholder|myNodeType)*",
        toDOM: () => ["p", 0]
      },
      myNodeType: {
        content: "text*",
        inline: true,
        selectable: false
        // parseDOM: [{ tag: "span.myNodeType" }]
      },
      voice: {
        content: "text*",
        inline: true,
        group: "voice",
        selectable: false,
        attrs: { class: { default: "voice" } },
        parseDOM: [{ tag: "span.voice" }],
        toDOM: (node) => ["span", { class: "voice" }, "11"]
      },
      placeholderL: {
        content: "text*",
        inline: true,
        group: "placeholder",
        selectable: false,
        attrs: { id: {}, class: { default: "placeholderL" } },
        parseDOM: [{ tag: "span.placeholderL" }],
        toDOM: (node) => ["span", { ...node.attrs, class: "placeholderL" }, "【"]
      },
      placeholderR: {
        content: "text*",
        inline: true,
        group: "placeholder",
        selectable: false,
        attrs: { id: {}, class: { default: "placeholderR" } },
        parseDOM: [{ tag: "span.placeholderR" }],
        toDOM: (node) => [
          "span",
          {
            ...node.attrs,
            class: "placeholderR",
            onclick: () => {
              console.log(123);
            }
          },
          "】"
        ]
      },
      text: { group: "text" }
    },
    marks: {
      em: {
        toDOM: () => ["em"]
      }
    }
  });

  const plugins: Plugin<any>[] = [];

  // plugins.push(TooltipPlugin);
  // plugins.push(PurplePlugin);
  // plugins.push(getInlineNodesCursorPlugin());
  plugins.push(history());
  plugins.push(keymap({ "Mod-z": undo, "Mod-y": redo }));
  plugins.push(keymap(baseKeymap));
  plugins.push(TagPlugin(schema));

  const state = EditorState.create({
    doc: DOMParser.fromSchema(schema).parse(prosemirrorContent.value),
    plugins
  });

  const view = new EditorView(prosemirrorEditor.value, {
    state,
    nodeViews: {
      // 对应于你的节点类型
      myNodeType: (node, view, getPos) => new MyCustomNodeView(node, view, getPos)
      // ...
    }
    // dispatchTransaction(transaction) {
    //   const newState = view.state.apply(transaction);
    //   view.updateState(newState);
    // }
  });

  instance = { state, view, plugins, schema };
});

function onInsertElement() {
  const { schema, view } = instance;
  const tr = view.state.tr;
  const from = view.state.selection.from;

  const node = schema.nodes.voice.create();
  const transaction = tr.insert(from, node);
  view.dispatch(transaction);
}

// function onToggleMark() {
//   const { schema, state, view } = instance;
//   const { from, to } = view.state.selection;
//   const tr = view.state.tr;
//   const transaction = tr.addMark(from, to, schema.marks.em.create());
//   view.dispatch(transaction);
// }

function onToggleMark() {
  const { schema, state, view } = instance;
  const { from, to } = view.state.selection;
  let tr = view.state.tr;

  const id = Math.random().toString();
  const leftId = "left-placeholder-" + id;
  const rightId = "right-placeholder-" + id;
  tr = tr.insert(from, schema.nodes.placeholderL.create({ id: leftId }));
  tr = tr.insert(to + 2, schema.nodes.placeholderR.create({ id: rightId }));

  // console.log("onToggleMark2", from, to, tr);
  // 为事务添加元数据，存储左右标识符节点的 ID
  tr.setMeta(tagPluginKey, { leftId, rightId });
  view.dispatch(tr);
}

function onCustomNode() {
  const { schema, view } = instance;
  const tr = view.state.tr;
  const from = view.state.selection.from;

  const node = schema.nodes.myNodeType.create();
  const transaction = tr.insert(from, node);
  view.dispatch(transaction);
}

function onSsml() {
  const { schema, state, view } = instance;
  const { from, to } = view.state.selection;
  const tr = view.state.tr;
  const doc = view.state.doc.toJSON();
  const docXml = parseDoc(doc);
  console.log(xmlFormat(docXml));
}
</script>

<style scoped lang="scss"></style>
