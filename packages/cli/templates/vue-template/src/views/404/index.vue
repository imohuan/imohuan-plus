<template>
  <div class="wh-full center text-20rem text-tw-primary font-mono flex-col">
    <span class="text-10rem">{{ random }}</span>
    404
  </div>
</template>

<script setup lang="ts">
const random = Math.random().toString().slice(3, 6);
</script>

<style scoped lang="scss"></style>
