<template>
  <span>HHHHH</span>
</template>

<script setup lang="ts">
export interface Props {
  text: string;
}
withDefaults(defineProps<Props>(), { text: "" });
</script>

<style scoped lang="scss"></style>
