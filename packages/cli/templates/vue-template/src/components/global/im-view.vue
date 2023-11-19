<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive>
      <component v-if="route.meta.cache" :is="Component" :key="route.path" />
    </keep-alive>
  </router-view>
  <router-view v-if="!route.meta.cache"></router-view>
</template>

<script setup lang="ts">
const route = useRoute();
</script>

<style scoped lang="scss"></style>
