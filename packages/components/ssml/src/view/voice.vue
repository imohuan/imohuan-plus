<template>
  <n-popover ref="root" v-bind="popoverBind">
    <template #trigger>
      <!-- <span :class="['hover:bg-blue-200', show ? 'bg-blue-300' : 'bg-blue-500']">
        {{ strength }}
      </span> -->
      <span class="text-blue-500 hover:text-blue-200" :data-id="$attrs.id" v-if="type === 'left'"
        >[</span
      >
      <span class="text-blue-500 hover:text-blue-200" :data-id="$attrs.id" v-if="type === 'right'"
        >] xx</span
      >
    </template>
    <i-voice></i-voice>
  </n-popover>
</template>

<script setup lang="ts">
import { NPopover } from "naive-ui";
import IVoice from "./components/voice.vue";
import { useSsml } from "./hooks/useSsml";

export interface Props {
  type: "left" | "right";
}
withDefaults(defineProps<Props>(), { type: "left" });
const { root, show, popoverBind, handleRemove, handleEditor } = useSsml();
</script>

<style scoped lang="scss"></style>
