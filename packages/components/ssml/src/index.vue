<template>
  <div ref="editorRef" spellcheck="false">
    <div class="flex space-x-2 mt-2">
      <n-button @click="onAddBreak">添加Break</n-button>
      <n-button @click="onAddVoice">添加Voice</n-button>
      <n-button @click="onAddWord">添加单词读法</n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import "./styles/index.scss";
import { NButton } from "naive-ui";
import { onMounted, onUnmounted, ref, shallowRef } from "vue";

import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
// import { DOMParser } from "prosemirror-model";

import { schema } from "./schema";
import { plugins } from "./plugins";
import { nodeViews } from "./view";

import { tagnodeKey } from "./plugins/tag";
import { randId } from "./helper";
import { getStateData, stateKey, State } from "./plugins/state";
import { SaveUtils } from "./helper/save";

const editorRef = ref();
const status = shallowRef<State>();
const saveUtils = new SaveUtils(schema);
let instance: { state: EditorState; view: EditorView };

onMounted(() => {
  // const doc = DOMParser.fromSchema(schema).parse(editorRef.value);
  const doc = saveUtils.load({
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [
          {
            type: "break",
            attrs: {
              time: 100,
              class: "ssml-break"
            }
          },
          {
            type: "break",
            attrs: {
              time: 100,
              class: "ssml-break"
            }
          },
          {
            type: "break",
            attrs: {
              time: 100,
              class: "ssml-break"
            }
          },
          {
            type: "voice",
            attrs: {
              type: "left",
              id: "lHLDc",
              class: "ssml-voice"
            }
          },
          {
            type: "text",
            text: "asdsa"
          },
          {
            type: "voice",
            attrs: {
              type: "right",
              id: "lHLDc",
              class: "ssml-voice"
            }
          },
          {
            type: "phoneme",
            attrs: {
              text: "asdfadsf",
              class: "ssml-phoneme"
            }
          },
          {
            type: "break",
            attrs: {
              time: 100,
              class: "ssml-break"
            }
          },
          {
            type: "text",
            text: "--------"
          }
        ]
      }
    ]
  });

  // const doc = saveUtils.load();

  const state = EditorState.create({ doc, plugins });
  const view = new EditorView(editorRef.value, {
    state,
    nodeViews,
    dispatchTransaction(tr) {
      const newState = view.state.apply(tr);
      view.updateState(newState);
      status.value = getStateData(newState);
      saveUtils.save(newState);
    }
  });
  instance = { state, view };
});

onUnmounted(() => {
  if (instance) instance.view.destroy();
});

const onAddBreak = (event: Event) => {
  event.preventDefault();
  const { view } = instance;
  view.focus();
  const { from } = view.state.selection;
  const node = schema.nodes.break.create();
  let tr = view.state.tr;
  tr = tr.insert(from, node);
  view.dispatch(tr);
};

const onAddVoice = (event: Event) => {
  event.preventDefault();
  const id = randId();
  const { view } = instance;
  view.focus();
  const { from, to } = view.state.selection;
  if (stateKey.getState(view.state).selectGroupNodes.length > 0) return;
  let tr = view.state.tr;
  tr = tr.insert(from, schema.nodes.voice.create({ type: "left", id }));
  tr = tr.insert(to + 2, schema.nodes.voice.create({ type: "right", id }));
  tr.setMeta(tagnodeKey, id);
  view.dispatch(tr);
};

const onAddWord = (event: Event) => {
  event.preventDefault();
  const { view } = instance;
  view.focus();

  if (!status.value) return;
  if (!status.value.isWord) return;

  const { from, to } = view.state.selection;
  let tr = view.state.tr;

  tr = tr.replaceRangeWith(from, to, schema.nodes.phoneme.create({ text: status.value.text }));
  view.dispatch(tr);

  // let tr = view.state.tr;
  // tr = tr.addMark(from, to, schema.marks.word.create());
  // view.dispatch(tr);
  // console.log("add Mark");
};
</script>

<style scoped lang="scss"></style>
