<template>
  <q-inner-loading class="wh-full z-10" :showing="loading">
    <q-spinner-audio size="50px" color="primary" />
  </q-inner-loading>
</template>

<script setup lang="ts">
defineProps({ loading: { type: Boolean, required: true } });
</script>

<style scoped lang="scss"></style>
