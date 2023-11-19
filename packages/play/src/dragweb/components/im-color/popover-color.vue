<template>
  <el-popover placement="right" :width="width + 25" trigger="click" @show="handleShow">
    <template #reference>
      <el-button><slot></slot></el-button>
    </template>
    <im-color ref="colorRef" v-bind="$attrs" v-model:color="currentColor" :width="width" />
  </el-popover>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
const props = defineProps({
  color: { type: String, required: false, default: "#fd0b00" },
  width: { type: Number, default: 380 }
});

let init = false;
const colorRef = ref();
const currentColor = ref(props.color);
const emits = defineEmits(["update:color"]);

watchEffect(() => {
  emits("update:color", currentColor.value);
});

const handleShow = () => {
  if (init) return;
  colorRef.value.initColor();
  init = true;
};
</script>

<style lang="scss" scoped></style>
