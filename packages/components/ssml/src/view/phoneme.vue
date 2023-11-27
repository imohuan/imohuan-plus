<template>
  <span>
    <span> {{ text }} </span>
    <span>asdf</span>
  </span>
</template>

<script setup lang="ts">
export interface Props {
  text: string;
}
defineOptions({ inheritAttrs: false });
withDefaults(defineProps<Props>(), { text: "" });
</script>

<style scoped lang="scss"></style>
