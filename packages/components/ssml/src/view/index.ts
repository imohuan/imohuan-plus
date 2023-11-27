import { EditorView, NodeViewConstructor } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { h, render } from "vue";

import Voice from "./voice.vue";
import Break from "./break.vue";
import Phoneme from "./phoneme.vue";

const componentMap: any = {
  break: Break,
  voice: Voice,
  phoneme: Phoneme
};

const base = (node: Node, view: EditorView, getPos: () => number | undefined) => {
  const ob = document.createElement("b");
  ob.className = node.attrs?.class || "";
  render(h(componentMap[node.type.name], { node, view, getPos, ...node.attrs }), ob as any);
  return { dom: ob, update: () => false };
};

export const nodeViews: Record<string, NodeViewConstructor> = {
  voice: base,
  break: base,
  phoneme: base
};
