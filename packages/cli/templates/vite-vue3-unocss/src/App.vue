<template>
  <div class="wh-full bg-green-300">
    {{ layout.count }}
    {{ $ctx.print(123) }}
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import { useLayout } from "@/store";

console.log(ctx);
const layout = useLayout();
</script>

<style scoped lang="scss"></style>
