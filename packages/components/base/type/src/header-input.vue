<template>
  <div class="relative">
    <div class="center w8 absolute left-0 top-0 bottom-0">
      <q-icon :class="[focus ? 'text-tw-primary' : 'text-gray-500']" :name="icon" />
    </div>
    <input
      type="text"
      :placeholder="placeholder"
      :class="[
        'center pl8 pr2 h8 border outline-none',
        focus ? 'border-tw-primary' : 'border-gray-200'
      ]"
      @focus="focus = true"
      @blur="focus = false"
      @input="onInput"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
export interface Props {
  icon?: string;
  placeholder?: string;
  modelValue?: string;
}
const focus = ref(false);
withDefaults(defineProps<Props>(), {
  icon: "search",
  placeholder: "",
  modelValue: ""
});
const emits = defineEmits(["update:modelValue", "input"]);

const onInput = (e: Event) => {
  const target = e.target as any;
  emits("input", target.value);
  emits("update:modelValue", target.value);
};
</script>

<style scoped lang="scss"></style>
