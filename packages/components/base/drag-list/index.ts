import { withInstall } from "../utils/index";
import IDragList from "./src/drag-list.vue";

export const IInput = withInstall(IDragList);
export default IInput;

export * from "./src/drag-list.vue";
export type { IDragListInstance } from "./src/instance";
