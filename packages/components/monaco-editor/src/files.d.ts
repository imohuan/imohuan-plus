import { Emitter } from "mitt";
import { Ref } from "vue";
import { Editor, Model, monaco } from "./monaco";
export declare class Files {
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
    constructor(path: string, language: string, uri: monaco.Uri, model: Model);
}
export declare class ActionFiles extends Files {
    listener: monaco.IDisposable;
}
type FileEvent = {
    "file-add": {
        file: Files;
    };
    "file-remove": {
        index: number;
        file: Files;
    };
    "file-change": {
        file: Files;
    };
};
export declare class FileManager {
    emitter: Emitter<FileEvent>;
    private isReady;
    private editor;
    private files;
    private preFile;
    private editorStatus;
    private activeFile;
    constructor(editor: Ref<Editor>);
    private init;
    getModel(path: string): null | Model;
    getFile(path: string): null | Files;
    getFiles(): Files[];
    getCurrent(): null | ActionFiles;
    setValue(path: string, content: string): void;
    createFile(path: string, language: string, content?: string): void | Files;
    removeFile(path: string): void;
    openFile(path: string): any;
}
export {};
