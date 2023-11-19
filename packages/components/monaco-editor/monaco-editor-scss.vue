<template>
  <monaco-editor ref="el" v-model="code" v-bind="option" />
</template>

<script setup lang="ts">
const el = ref();
const code = ref(`$color: #eeeeee;
body {
  div {
    .hello {
      &-what {
        color: $color;
      }
    }
  }
}`);

const option = {
  language: "scss",
  readOnly: false
};
</script>

<style scoped lang="scss"></style>
