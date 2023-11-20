import _Inspect from "vite-plugin-inspect";
// 报错
// import _Inspector from "vite-plugin-vue-inspector";

//效果UI界面： localhost:3000/__inspect/
export function Inspect() {
  return _Inspect();
}

export function Inspector() {
  // return _Inspector();
}
