import { Node, Schema } from "prosemirror-model";
import { EditorState } from "prosemirror-state";

export class SaveUtils {
  constructor(private schema: Schema, private key = "doc") {}

  save(state: EditorState) {
    const doc = state.doc.toJSON();
    localStorage.setItem(this.key, JSON.stringify(doc));
  }

  load(doc: any = null): Node {
    if (!doc) {
      try {
        const docJson = JSON.parse(localStorage.getItem(this.key) || "{}");
        return Node.fromJSON(this.schema, docJson);
      } catch {
        return this.schema.topNodeType.createAndFill()!;
      }
    }
    return Node.fromJSON(this.schema, doc);
  }
}
