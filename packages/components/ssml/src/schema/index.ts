import { Schema } from "prosemirror-model";
import { nodes } from "./nodes";

export const schema = new Schema({
  nodes: {
    doc: { content: "block+" },
    paragraph: {
      group: "block",
      content: "(text|voice|break|express|silence|phoneme|audio|prosody)*",
      parseDOM: [{ tag: "p" }],
      toDOM: () => ["p", 0]
    },
    text: {},
    ...nodes
  },
  marks: {}
});
