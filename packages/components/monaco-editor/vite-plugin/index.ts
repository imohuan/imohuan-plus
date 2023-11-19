import monacoEditorNlsPlugin, {
  esbuildPluginMonacoEditorNls,
  Languages
} from "rollup-plugin-monaco-editor-nls";

export function MonacoEditor() {
  return monacoEditorNlsPlugin({ locale: Languages.zh_hans });
}

export function EsbuildMonacoEditor() {
  return esbuildPluginMonacoEditorNls({ locale: Languages.zh_hans });
}

export default function (isDev: boolean) { 
  const plugins = [esbuildPluginMonacoEditorNls()]
  if (!isDev) plugins.push(MonacoEditor());
  return plugins
}