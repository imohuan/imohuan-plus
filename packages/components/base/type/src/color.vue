<template>
  <div class="py1 flex max-w-[16rem] items-center space-x-2">
    <div
      class="ml2 wh-19 p1 rounded border border-gray-300 shadow"
      :style="`background: ${modelValue}`"
    ></div>
    <span class="font-mono font-bold">{{ modelValue }}</span>
    <q-popup-proxy :offset="[0, 10]" transition-show="flip-up" transition-hide="flip-down">
      <q-color
        v-bind="$attrs"
        no-header
        no-footer
        :modelValue="modelValue"
        @update:model-value="emits('update:modelValue', $event)"
      />
    </q-popup-proxy>
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";

export interface Props {
  modelValue: any;
}

defineOptions({ inheritAttrs: false });
withDefaults(defineProps<Props>(), { modelValue: "rgb(0,0,0)" });
const emits = defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss"></style>
