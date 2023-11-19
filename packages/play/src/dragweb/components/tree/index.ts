import { App } from "vue";
import TreeNode from "./tree-node.vue";
import Tree from "./tree.vue";

import "./index.scss";

export default function (app: App) {
  app.component("TreeNode", TreeNode);
  app.component("Tree", Tree);
}
