<template>
  <div class="flex space-x-2">
    <im-input
      :modelValue="modelValue"
      @update:modelValue="onUpdate"
      icon="fingerprint"
      placeholder="输入验证码"
      class="wh-full flex-1"
      :rules="[{ min: 0, max: 6, rule: '\\d+', replace: '[^0-9]+', maxReplace: max }]"
    >
      <template #suffix> </template>
    </im-input>
    <q-btn
      class="w-100! font"
      outline
      color="primary"
      :disable="disable || seconds > 0"
      :loading="loading"
      :label="seconds ? `${seconds} s` : '发送验证'"
      @click="onSend"
    >
      <template #loading>
        <q-spinner-facebook color="primary" />
      </template>
    </q-btn>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { debounce } from "lodash-es";

export interface Props {
  max?: number;
  wait?: number;
  disable?: boolean;
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  max: 6,
  wait: 60,
  disable: false,
  modelValue: ""
});
const emits = defineEmits(["update:modelValue", "click"]);

const seconds = ref(0);
const loading = ref(false);

const onUpdate = (value: any) => {
  emits("update:modelValue", value);
};

const onSend = debounce(() => {
  if (seconds.value !== 0) return;
  loading.value = true;
  seconds.value = props.wait;
  const next = (status = true) => {
    loading.value = false;
    if (status) {
      const timer = setInterval(() => {
        seconds.value--;
        if (seconds.value === 0) clearInterval(timer);
      }, 1000);
    } else {
      seconds.value = 0;
    }
  };

  emits("click", next);
}, 500);
</script>

<style scoped lang="scss"></style>
