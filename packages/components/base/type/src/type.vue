<template>
  <!-- eslint-disable vue/no-v-html -->
  <div class="im-types markdown-body select-text">
    <q-input
      v-if="config.type === 'string' || config.type === 'number'"
      :modelValue="modelValue"
      :style="style"
      v-bind="defaultInputProps"
      @update:model-value="handleInput"
    />

    <template v-else-if="config.type === 'text'">
      <div class="font-custom font-bold">
        <span v-if="modelValue.startsWith('$')" v-html="marked(modelValue.slice(1))"></span>
        <span v-else>{{ modelValue }}</span>
      </div>
    </template>

    <q-checkbox
      v-else-if="config.type === 'boolean'"
      size="sm"
      indeterminate-value="maybe"
      :modelValue="modelValue"
      @update:model-value="handleInput"
    >
      <span
        v-if="attrs.label && attrs.label.startsWith('$')"
        v-html="marked(attrs.label.slice(1))"
      ></span>
    </q-checkbox>

    <q-select
      v-else-if="config.type === 'select'"
      v-bind="attrs"
      transition-show="scale"
      transition-hide="scale"
      filled
      :options="config.options || []"
      :style="style"
      :modelValue="modelValue"
      @update:model-value="handleInput"
    />

    <im-color
      v-bind="attrs"
      v-else-if="config.type === 'color'"
      :modelValue="modelValue"
      @update:model-value="handleInput"
    />

    <im-list
      v-bind="attrs"
      v-else-if="config.type === 'array'"
      :modelValue="modelValue"
      @update:model-value="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
import IInput from "./input.vue";

import { defaultsDeep } from "lodash-es";
import { marked } from "marked";
import { computed, getCurrentInstance, withDefaults } from "vue";

export type PluginConfig = {
  title: string;
  name?: string;
  desc?: string;
  type?: "text" | "string" | "number" | "boolean" | "select" | "color" | "array";
  options?: any;
  attrs?: any;
  default?: any;
  isHtml?: boolean;
  hidden?: boolean;
};

export interface Props {
  config: PluginConfig | any;
  modelValue: any;
}

defineOptions({ inheritAttrs: false });
const style = { width: "70%", maxWidth: "500px" };
const instance = getCurrentInstance();
const props = withDefaults(defineProps<Props>(), {
  config: null,
  modelValue: null
});

const emits = defineEmits(["change", "update:modelValue"]);
const attrs = computed(() => defaultsDeep({}, instance?.attrs, props.config.attrs));
const defaultInputProps = computed(() => {
  const input: any = defaultsDeep(
    { "stack-label": true, filled: true },
    props.config.attrs,
    instance?.attrs
  );
  if (props.config.type === "number") input.type = "number";
  return input;
});

const handleInput = (value: any) => {
  if (props.config.type === "number") value = parseInt(value);
  emits("change");
  emits("update:modelValue", value);
};
</script>

<style lang="scss"></style>
