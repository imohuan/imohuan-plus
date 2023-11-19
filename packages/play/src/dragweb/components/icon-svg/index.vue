<template>
  <svg aria-hidden="true" :class="['fill-current', color]">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script setup lang="ts">
import { computed, withDefaults } from "vue";

interface Props {
  prefix?: string;
  name?: string;
  color?: string;
}

const props = withDefaults(defineProps<Props>(), {
  prefix: "icon",
  name: "",
  color: ""
});

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
