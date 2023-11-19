import { defaultsDeep } from "lodash";
import mitt, { Emitter } from "mitt";
import { Ref, ref, unref } from "vue";
import { Editor, Model, monaco } from "./monaco";

export class Files {
  /** 虚拟: 文件地址 */
  path: string;
  /** URI */
  uri: monaco.Uri;
  /** 语言 */
  language: string;
  /** 内容 */
  content: string;
  /** 数据模型 */
  model: Model;

  constructor(path: string, language: string, uri: monaco.Uri, model: Model) {
    this.path = path;
    this.language = language;
    this.uri = uri;
    this.model = model;
    this.content = "";
  }
}

export class ActionFiles extends Files {
  listener: monaco.IDisposable;
}

type FileEvent = {
  "file-add": { file: Files };
  "file-remove": { index: number; file: Files };
  "file-change": { file: Files };
};

export class FileManager {
  emitter: Emitter<FileEvent>;

  private isReady: boolean;
  private editor: Ref<Editor>;
  private files: Files[];
  private preFile: Files | null;
  private editorStatus: Map<string, any>;
  private activeFile: Ref<ActionFiles> | null;

  constructor(editor: Ref<Editor>) {
    this.files = [];
    this.preFile = null;
    this.activeFile = null;
    this.editor = editor;
    this.emitter = mitt();
    this.isReady = false;
    this.editorStatus = new Map();

    let timer: any = null;
    timer = setInterval(() => {
      if (this.isReady) return clearInterval(timer);
      if (this.editor.value) {
        clearInterval(timer);
        this.init();
        this.isReady = true;
      }
    }, 100);
  }

  private init() {}

  getModel(path: string): null | Model {
    const model = monaco.editor.getModels().find((m) => m.uri.path === path);
    return !model ? null : model;
  }

  getFile(path: string): null | Files {
    // TODO 这里使用了find来查找对象，但是却意外的修改了this.files数据（不知道为什么）
    // const file = this.files.find((f) => (f.path = path));
    // return !file ? null : file;
    const index = this.files.findIndex((f) => f.path === path);
    return index === -1 ? null : this.files[index];
  }

  getFiles() {
    return this.files;
  }

  getCurrent(): null | ActionFiles {
    return this.activeFile?.value;
  }

  setValue(path: string, content: string) {
    this.getModel(path)?.setValue(content);
  }

  createFile(path: string, language: string, content: string = "") {
    if (!path.startsWith("/")) throw new Error("FileManager.createFile 中 path 必须以 / 开头");
    const uri = new monaco.Uri().with({ path });
    if (this.getModel(path) && this.files.length === 0) return location.reload();
    // 新建模型 到内存中，可以使用getModels来获取model列表
    const model = monaco.editor.createModel(path, language, uri);
    model.setValue(content);
    const file = new Files(path, language, uri, model);
    this.files.push(file);

    this.emitter.emit("file-add", { file });
    this.emitter.emit("file-change", { file });
    return file;
  }

  removeFile(path: string) {
    const index = this.files.findIndex((file) => file.path === path);
    if (index !== -1) {
      const file = this.files[index];
      this.editorStatus.delete(this.files[index].path);
      file.model.dispose();
      this.emitter.emit("file-remove", { index, file });
      this.emitter.emit("file-change", { file });
      this.files.splice(index, 1);
    }
  }

  openFile(path: string) {
    // 1. 找到对应文件Model
    const file = this.getFile(path);
    const model = file.model;
    const editor = this.editor.value;
    if (!file || !file.model) return null;

    if (editor) {
      if (this.activeFile) {
        this.activeFile.value.listener.dispose();
        delete this.activeFile.value.listener;
        this.preFile = this.activeFile.value;
        this.editorStatus.set(this.preFile.path, editor.saveViewState());
      }

      editor.setModel(model);
      // sendMessage(model, file);
      /** 回复之前的状态 */
      const editorState = this.editorStatus.get(path);
      if (editorState) editor.restoreViewState(editorState);
      editor.focus();
    }

    // 开启 eslint
    const listener = model.onDidChangeContent(() => {
      // sendMessage(model, file);
    });

    this.activeFile = ref(unref(defaultsDeep({ listener }, file)));
    this.emitter.emit("file-change", { file });
    return model;
  }
}
