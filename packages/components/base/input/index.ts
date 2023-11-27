import { withInstall } from "../utils/index";
import Input from "./src/input.vue";

export const IInput = withInstall(Input);
export default IInput;

export * from "./src/input.vue";
export type InputInstance = InstanceType<typeof Input>;
