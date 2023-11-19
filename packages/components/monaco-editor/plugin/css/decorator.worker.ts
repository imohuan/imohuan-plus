import { ClassMapValue } from "./options";

self.addEventListener("message", (e) => {
  const { version, code, path, classMap } = e.data;

  // 功能同 ./index.ts => getColorInformation
  // self.postMessage({ datas: result, path, version, name: "Decorator Render" });
});
