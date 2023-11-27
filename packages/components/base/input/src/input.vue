<template>
  <div class="i-input w-full relative">
    <input
      class="w-full outline-none text-xs font-thin px4 py2 border hover:border-gray-500 rounded leading-4"
      :id="id"
      :type="type"
      :value="modelValue"
      @input="handleInput"
      v-bind="$attrs"
    />
    <label v-show="label" :for="id" class="input-label">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { withDefaults } from "vue";
import { Props } from "./input";

defineOptions({ inheritAttrs: false });
withDefaults(defineProps<Props>(), { label: "", type: "text", modelValue: "" });
const emits = defineEmits(["update:modelValue"]);

const id = `input-${Math.random() * 10000 + 10000}`;
const handleInput = (event: any) => {
  emits("update:modelValue", event.target?.value || "");
};
</script>

<style scoped lang="scss">
@import url(./input.scss);
.input-label {
  @apply absolute left-0 top-0 bg-white text-xs rounded m-8 px2 pt-2px scale-75 translate-x-1 -translate-y-4;
}
</style>
