<template>
  <div class="w-full relative">
    <input
      class="w-full outline-none text-xs font-thin px4 py2 border hover:border-gray-500 rounded leading-4"
      :type="type"
      v-bind="$attrs"
      :id="id"
      :value="modelValue"
      @input="handleInput"
    />
    <label v-show="label" :for="id" class="input-label">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits } from "vue";

interface Props {
  type?: "text" | "number";
  label?: string;
  modelValue?: string;
}
defineComponent({ inheritAttrs: false });
const props = withDefaults(defineProps<Props>(), { label: "", type: "text", modelValue: "" });
const emits = defineEmits(["update:modelValue"]);

const id = `input-${Math.random() * 10000 + 10000}`;
const handleInput = (event: any) => {
  emits("update:modelValue", event.target?.value || "");
};
</script>

<style scoped lang="scss">
.input-label {
  @apply absolute left-0 top-0 bg-white text-xs rounded m-8 px2 pt-2px scale-75 translate-x-1 -translate-y-4;
}
</style>
