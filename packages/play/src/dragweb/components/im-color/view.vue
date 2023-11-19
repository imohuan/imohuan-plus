<template>
  <div class="wh-full center flex-col space-y-10">
    <div class="p-2 shadow">
      <im-color v-model:color="color" :width="300" :height="240" />
    </div>
    <popover-color v-model:color="color" :width="300" :height="240">
      <span :style="`color:${color}`">Color</span>
    </popover-color>
    <!-- <div class="w-1/2 p-4 h-64 scroll-y">
      <div class="border-2" :style="cptGrid">
        <div v-for="item in 20" :key="item" class="wh-full bg-red-700" :style="`height: ${distance}px`">1</div>
      </div>
    </div>

    <div class="w-64">
      <el-slider v-model="width" :min="20" :max="300" />
    </div> -->
  </div>
</template>

<script setup lang="ts">
import PopoverColor from "./popover-color.vue";
import { computed, ref, watchEffect } from "vue";

const color = ref("#3c6685");
</script>

<style lang="scss" scoped></style>
