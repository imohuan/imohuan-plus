<template>
  <div
    :class="[rootClass, 'wh8 center rounded-md hover:bg-gray-200 active:bg-gray-300']"
    @click="emits('click', $el)"
  >
    <q-icon
      class="transition-[transform] duration-300"
      size="xs"
      :style="cptStyle"
      :name="name"
      v-if="name.length > 0"
      v-bind="$attrs"
    />
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const iconProps = defineProps({
  name: { type: String, required: false, default: "" },
  rotate: { type: Number, required: false, default: 0 },
  rootClass: { type: [String, Object], required: false, default: "" }
});

const emits = defineEmits(["click"]);

const cptStyle = computed(() => ({
  transform: `rotate(${iconProps.rotate}deg)`
}));
</script>

<style scoped lang="scss"></style>
