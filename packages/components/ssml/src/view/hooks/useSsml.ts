import { ref, useAttrs } from "vue";

import { Node } from "prosemirror-model";
import { EditorView } from "prosemirror-view";

export const useSsml = () => {
  const root = ref();
  const show = ref(false);

  const { node, view, getPos } = useAttrs() as {
    node: Node;
    view: EditorView;
    getPos: () => number | undefined;
  };

  const handleShow = (_show: boolean) => {
    show.value = _show;
  };

  /** 关闭弹出框 */
  const close = () => {
    root.value.setShow(false);
  };

  const handleEditor = (_attrs: any) => {
    const pos = getPos();
    if (!pos) return close();
    const attrs = { ...node.attrs, ..._attrs };
    let tr = view.state.tr;
    tr = tr.setNodeMarkup(pos, null, attrs);
    view.dispatch(tr);
    close();
  };

  const handleRemove = () => {
    const pos = getPos();
    if (!pos) return close();
    let tr = view.state.tr;
    tr = tr.delete(pos, pos + 1);
    view.dispatch(tr);
    close();
  };

  const popoverBind = {
    trigger: "click",
    placement: "bottom",
    class: "ssml-popover",
    "show-arrow": true,
    "on-update:show": handleShow
  };

  return { node, view, getPos, show, root, popoverBind, handleEditor, handleRemove };
};
