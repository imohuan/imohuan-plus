<template>
  <div class="wh-full flex flex-col space-y-1">
    <div class="w-full h-80 flex items-center space-x-2">
      <div
        class="font-mono font-bold px3 py-2 rounded bg-gray-200"
        v-for="(item, index) in files"
        :key="index"
        @click="onOpenFile(item)"
      >
        {{ item }}
      </div>

      <loading :loading="layout.editorLoading" />
    </div>
    <div ref="el" class="flex flex-1 wh-full"></div>
  </div>
</template>

<script setup lang="ts">
import { FileManager, EditorOption, Language, monaco, PluginOption, Editor } from "./src/monaco";
import { TypeScriptPlugin, FormatPlugin, EsLintPlugin, HtmlPlugin, ClassPlugin } from "./plugin";
import { defaultOptions } from "./src/options";

import { Ref } from "vue";
import { debounce, defaultsDeep } from "lodash";
import { useLayout } from "@/store";

export interface Props {
  /** 虚拟 文件路径 */
  path?: string;
  /** 支持语言 */
  language?: Language;
  /** 主题 */
  theme?: string;
  /** 是否只读 */
  readOnly?: boolean;
  /** editor 其余配置 */
  options?: any;
  /** 代码  */
  modelValue?: string;
}

export interface EditorExport {
  file: FileManager;
  editor: Editor;
  setValue: Function;
}

const props = withDefaults(defineProps<Props>(), {
  path: "/src/index.ts",
  language: "typescript",
  theme: "vs",
  readOnly: false,
  options: {},
  modelValue: ""
});

const el = ref();
const layout = useLayout();
const editor: Ref<monaco.editor.IStandaloneCodeEditor> | null = shallowRef(null);
const fileManager = new FileManager(editor);
const plugins = [TypeScriptPlugin, FormatPlugin, EsLintPlugin, HtmlPlugin, ClassPlugin];

/** Layout 当前 文件列表 */
const files = ref<string[]>([]);

fileManager.emitter.on("file-change", () => {
  // console.log(fileManager.getFiles());
  files.value = fileManager.getFiles().map((f) => f.path);
});

const onOpenFile = (path: string) => {
  console.log("path", path);
  fileManager.openFile(path);
};
// ------------------------------------------------------------------------

onMounted(() => {
  const userOption: EditorOption = {
    theme: props.theme,
    language: props.language,
    readOnly: props.readOnly
  };

  const option: EditorOption = defaultsDeep(userOption, props.options, defaultOptions);
  editor.value = monaco.editor.create(el.value, option);

  // 加载 Plugin
  const pluginOption: PluginOption = {
    userOption: {
      "eslint.timeout": 300
    },
    fileManager,
    ...option
  };
  plugins.forEach((plugin) => plugin(editor.value, pluginOption));

  /** 打开 Model 文件 */
  fileManager.createFile(props.path, props.language, props.modelValue);
  editor.value.setModel(fileManager.openFile(props.path));
});

/** 修改窗口大小的时候, 重置 Editor 的宽高 */
const { width, height } = useWindowSize();
const resize = () => editor.value && editor.value.layout();
watch([width, height], debounce(resize, 60));

/** 关闭组件的时候 注销 Editor */
onUnmounted(() => editor.value && editor.value.dispose());

function setValue(code: string) {
  editor.value && editor.value.setValue(code);
}

defineExpose({ setValue, editor, file: fileManager });
</script>

<style lang="scss">
// 修复折叠图片大小错误
.codicon-folding-collapsed,
.codicon-folding-expanded {
  font-size: 1rem !important;
}

.monaco-action-bar {
  margin-right: 10px;
}
</style>
