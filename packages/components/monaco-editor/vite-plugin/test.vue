<template>
  <div class="wh-full center">

    <monaco-editor ref="monaco" v-bind="option" :modelValue="tsCode" /> 
    <!--    <amap /> <div class="w-200 h-200 bg-red-400 animation"></div> -->
    <!-- <monaco-editor-scss path="/src/index.scss" /> -->
  </div>
</template>

<script setup lang="ts">
import { EditorExport } from "c/monaco-editor/index.vue";
import { generateClass, getStyleKeys, parseScss } from "@/helper/unocss";
import { debounce } from "lodash";

const monaco = ref();
const option = {
  path: "/src/index.html",
  language: "html",
  theme: "tw-light",
  readOnly: false
};

onMounted(() => {
  const e = monaco.value as EditorExport;
  e.file.createFile(
    "/src/index.ts",
    "typescript",
    `const a = 123;\nconst b = 456;const hello = () => {\nconsole.log(123);\n};`
  );

  e.file.createFile(
    "/src/index.scss",
    "scss",
    `.hello {\n  background: red;\n  @apply bg-amber-200;\n}`
  );

  e.file.createFile("/src/build.css", "css", ``);

  e.editor.onDidChangeModelContent(async () => {
    const file = e.file.getCurrent();
    if (file.path === "/src/index.scss") {
      const value = e.editor.getValue();
      const resultCss = getStyleKeys(value);
      const generateClassResult = await generateClass([resultCss.css]);
      e.file.setValue("/src/build.css", generateClassResult.css);
    }
  });
});

const tsCode = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
     <div id="app" class="    bg-amber-12  hover:bg-red-300     "></div>
</html>
`;
</script>

<style scoped lang="scss"></style>
