import { generateClass, parserClass } from "@/helper/unocss";
import { useLayout } from "@/store";
import GenerateWorker from "./generate.worker?worker";

export let classMap = new Map<string, ClassMapValue>();
export const addClassMap = new Map<string, ClassMapValue>();

const worker = new GenerateWorker();
const layout = useLayout();

export interface ClassMapValue {
  cls: string;
  color?: string;
  detail: string;
  content: string;
}

worker.onmessage = (e) => {
  const { all, result } = e.data;
  if (all) {
    classMap = result;
  } else {
    (result as Map<string, any>).forEach((v, k) => !classMap.has(k) && classMap.set(k, v));
  }
  layout.setEditorLoading(false);
};

layout.setEditorLoading(true);
worker.postMessage({ text: "", all: true, classList: [] });

export async function addClass(className: string) {
  const result = await generateClass(className);
  const map = await parserClass(result);
  const cur = map.get(className);
  if (!cur) return null;
  addClassMap.set(className, cur);
  return cur;
}

export function getClass(className: string) {
  return classMap.get(className) || addClassMap.get(className);
}
