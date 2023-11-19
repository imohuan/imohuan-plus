<template>
  <div class="w-1/2 h-full">
    <tree :root="true" :list="store.data" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from "@/hooks/useStore";
const store = useStore("var", [
  {
    title: "普通容器",
    children: [
      {
        title: "普通容器",
        children: [
          { title: "按钮" },
          { title: "普通容器", children: [{ title: "普通容器", children: [{ title: "普通" }] }, { title: "按钮" }] }
        ]
      },
      { title: "文本" }
    ]
  },
  { title: "Disable", option: { disabled: true } },
  { title: "noChildren", option: { disabled: true, noChildren: true } },
  { title: "普通容器", children: [{ title: "按钮" }, { title: "按钮" }, { title: "按钮" }] }
]);
</script>

<style lang="scss" scoped></style>
