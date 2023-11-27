import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";

const CommentsPluginKey = new PluginKey("ProseMirror_Decoration");

new Plugin({
  key: CommentsPluginKey,

  state: {
    init() {
      return {
        activeCommentId: null,
        maybeMouseSelecting: false
      };
    },

    apply(tr, pluginState, oldState, newState) {
      const { doc, selection } = tr;
      const { $from, to, empty } = selection;
      const $to = doc.resolve(empty ? to + 1 : to);
      const { name: markTypeName } = newState.schema.marks.comments;

      const fromMark = $from.marks().find((mark) => mark.type.name === markTypeName);
      const toMark = $to.marks().find((mark) => mark.type.name === markTypeName);

      let activeCommentId = null;

      if (fromMark && toMark && fromMark === toMark) {
        // 如果注释的两端都在注释上，检查它是否是标记的同一个实例，
        // 没有被分割或复制的标记，例如复制和粘贴
        activeCommentId = toMark.attrs.commentId;
      } else if (selection.empty && toMark) {
        //否则，如果选区是空的，在下一个位置有一个标记，然后选择那个
        activeCommentId = toMark.attrs.commentId;
      }

      const meta = tr.getMeta(CommentsPluginKey);

      let { maybeMouseSelecting } = pluginState;

      if (meta?.maybeMouseSelecting !== undefined) {
        maybeMouseSelecting = meta.maybeMouseSelecting;
      }

      return {
        activeCommentId,
        maybeMouseSelecting
      };
    }
  },

  props: {
    handleDOMEvents: {
      mousedown(view) {
        view.dispatch(view.state.tr.setMeta(CommentsPluginKey, { maybeMouseSelecting: true }));
      },

      mouseup(view) {
        view.dispatch(view.state.tr.setMeta(CommentsPluginKey, { maybeMouseSelecting: false }));
      }
    },

    decorations(state) {
      const { activeCommentId, maybeMouseSelecting } = this.getState(state);
      const { doc, schema } = state;
      const { name: markTypeName } = schema.marks.comments;

      if (activeCommentId === null || maybeMouseSelecting) {
        return DecorationSet.empty;
      }

      // If there is a comment, then find all its matches across the doc
      const activeMarks = [];
      doc.descendants((node, pos) => {
        node.marks.forEach((mark) => {
          if (mark.type.name === markTypeName && mark.attrs.commentId === activeCommentId) {
            activeMarks.push({
              mark,
              $pos: doc.resolve(pos)
            });
          }
        });
      });

      const decorations = [];
      activeMarks.forEach(({ mark, $pos }) => {
        // const markRange = ($pos, mark.type, mark.attrs);
        const markRange = null;

        if (markRange) {
          decorations.push(
            Decoration.inline(
              markRange.from,
              markRange.to,
              { class: "comment-highlight" },
              { ...mark.attrs }
            )
          );
        }
      });

      return DecorationSet.create(doc, decorations);
    }
  }
});
