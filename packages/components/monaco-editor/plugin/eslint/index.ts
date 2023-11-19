import { debounce, get } from "lodash";

import { monaco, Editor, Model, PluginOption } from "../../src/monaco";
import EslintWorker from "./eslint.ts?worker";

const worker = new EslintWorker();

export function EsLintPlugin(editor: Editor, option: PluginOption) {
  let model = editor.getModel();

  worker.onmessage = (e) => {
    const { markers, version, name } = e.data;
    if (!model.isDisposed() && model.getVersionId() === version) {
      monaco.editor.setModelMarkers(model, name, markers);
    }
  };

  const send = debounce((model: Model, path: string) => {
    worker.postMessage({ path, code: model.getValue(), version: model.getVersionId() });
  }, get(option.userOption, "eslint.timeout", 300));

  editor.onDidChangeModel(() => {
    model = editor.getModel();
    setTimeout(() => send(model, option.fileManager.getCurrent().path), 100);
  });

  editor.onDidChangeModelContent(() => {
    send(model, option.fileManager.getCurrent().path);
  });
}
