import { Ref, onMounted } from "vue";
import { random, isObject } from "lodash-es";

/** 样式 */
import "./styles/index.scss";

/** ProseMirror 工具方法 */
import { findWrapping } from "prosemirror-transform";
import {
  EditorState,
  Plugin,
  Selection,
  NodeSelection,
  Transaction,
  PluginKey
} from "prosemirror-state";
import {
  Decoration,
  DecorationSet,
  DecorationSource,
  EditorView,
  NodeView
} from "prosemirror-view";
import { Schema, DOMParser, Fragment, DOMSerializer, Mark, Node } from "prosemirror-model";
// import { schema } from "prosemirror-schema-basic";
import { schema } from "./schema";
import { addListNodes } from "prosemirror-schema-list";
import { toggleMark, setBlockType, wrapIn } from "prosemirror-commands";
import { MenuItem } from "prosemirror-menu";
import { exampleSetup, buildMenuItems } from "prosemirror-example-setup";
import { keymap } from "prosemirror-keymap";

/** 插件 */
import { getMarkDecorationPlugin } from "./plugin/decoration";
import { getInlineNodesCursorPlugin } from "./plugin/cursor";
import { getCustomMenuPlugin } from "./plugin/menu";
import { menuList } from "./menu";

/** NodeView */
import { SpeedLeft } from "./views/speedLeft";
import { MarkTest } from "./views/mark-test";
import { getCursorEndPlugin } from "./plugin/cursor-end";
import { getTestPlugin } from "./plugin/test";
const key = new PluginKey("ProseMirror_handleDelete");
const deletePlugin: any = new Plugin({
  key,
  props: {
    handleDOMEvents: {
      keydown: (view, event) => {
        // 当用户按下删除键时
        if (event.key === "Backspace" || event.key === "Delete") {
          const { $from, $to } = view.state.selection;
          // 查找是否有特殊span节点
          let range = $from.blockRange($to);
          if (!range) return false;
          let wrapping = findWrapping(range, schema.nodes.special_span);
          if (wrapping) {
            event.preventDefault();
            // 如果有，删除整个span
            view.dispatch(view.state.tr.deleteRange(range.start, range.end));
            return true;
          }
        }
        return false;
      }
    }
  }
});

export function useProseMirror(el: Ref<HTMLDivElement>, content: Ref<HTMLDivElement>) {
  let instance: { state: EditorState; view: EditorView };

  onMounted(() => {
    const state = EditorState.create({
      doc: DOMParser.fromSchema(schema).parse(content.value),
      plugins: exampleSetup({ schema: schema, menuBar: false }).concat([
        getCursorEndPlugin(),
        getInlineNodesCursorPlugin(),
        getCustomMenuPlugin(menuList),
        getTestPlugin(),
        deletePlugin
        // getMarkDecorationPlugin()
      ])
    });

    const view = new EditorView(el.value, {
      state,
      nodeViews: {
        speedLeft: (node, view, getPos) => {
          return new SpeedLeft(node, view, getPos);
        }
        // speed(node, view, getPos) {
        //   return new MarkTest(node, view, getPos);
        // }
      },
      /** 监听Doc变化，如删除或者新增了某个Node */
      _dispatchTransaction(transaction) {
        const prevState = view.state;
        const tr = prevState.tr;
        let nextState = view.state.apply(transaction);

        if (prevState.doc !== nextState.doc) {
          // #region 动态ID获取
          const prevNodesById: Record<string, Node> = {};
          prevState.doc.descendants((node) => {
            if (node.attrs.id) {
              prevNodesById[node.attrs.id] = node;
            }
          });

          const nextNodesById: Record<string, Node> = {};
          nextState.doc.descendants((node) => {
            if (node.attrs.id) {
              nextNodesById[node.attrs.id] = node;
            }
          });

          const deletedIds = new Set<string>();
          const changedIds = new Set<string>();
          const addedIds = new Set<string>();

          for (const [id, node] of Object.entries(prevNodesById)) {
            if (nextNodesById[id] === undefined) {
              deletedIds.add(id);
            } else if (node !== nextNodesById[id]) {
              changedIds.add(id);
            }
          }

          for (const [id, node] of Object.entries(nextNodesById)) {
            if (prevNodesById[id] === undefined) {
              addedIds.add(id);
            } else if (node !== prevNodesById[id]) {
              changedIds.add(id);
            }
          }
          // #endregion
          // console.log({ deletedIds, changedIds, addedIds });
          if (deletedIds.size > 0) {
            deletedIds.forEach((item) => {
              const id = item.split("-")[0];
              deletedIds.add(id + "-l");
              deletedIds.add(id + "-r");
            });
            let index = 0;
            prevState.doc.descendants((node, pos) => {
              if (node?.attrs?.id && deletedIds.has(node.attrs.id)) {
                pos -= index;
                tr.delete(pos, pos + 1);
                index += 2;
              }
            });
            nextState = prevState.apply(tr);
          }
        }
        view.updateState(nextState);
      }
    });

    instance = { state, view };
  });

  onBeforeUnmount(() => instance.view?.destroy());
}
