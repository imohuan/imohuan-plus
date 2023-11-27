<template>
  <div class="relative">
    <div class="center left-15 absolute top-0 bottom-0">
      <q-icon
        v-if="!$slots.prefix"
        :class="[focus ? 'text-tw-primary' : 'text-gray-500']"
        :size="size"
        :name="icon"
      />
      <slot v-else name="prefix" />
    </div>
    <input
      :type="inputType"
      :value="modelValue"
      :placeholder="props.placeholder"
      :class="[
        'h10 font w-full border pl-10 leading-8 outline-none ',
        inputClass,
        focus ? 'border-tw-primary' : 'border-gray-200',
        hidden ? 'pr-2' : props.type === 'password' ? 'pr-16' : 'pr-10'
      ]"
      @focus="focus = true"
      @blur="focus = false"
      @input="onInput"
      @keydown="onKeydown"
    />

    <div v-if="$slots.suffix" class="right-15 center absolute top-0 bottom-0">
      <slot name="suffix" />
    </div>
    <div v-else-if="!hidden && isInput" class="right-15 center absolute top-0 bottom-0 space-x-2">
      <template v-if="props.type === 'password'">
        <div @click="onChangeType">
          <i-controller-eye-slash-fill v-if="inputType !== 'password'" class="wh4!" />
          <i-controller-eye-fill v-else class="wh4!" />
        </div>
      </template>
      <q-icon v-if="isOk" class="scale-80 rounded-full bg-green-700 p-3 text-white" name="done" />
      <q-icon v-else class="scale-80 rounded-full bg-red-700 p-3 text-white" name="report_problem">
        <q-tooltip anchor="center right" self="center left"> {{ message }} </q-tooltip>
      </q-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
export interface Rule {
  min?: number;
  max?: number;
  rule: string;
  message?: string;
  replace?: string;
  maxReplace?: number;
}

export interface Props {
  icon?: string;
  type?: string;
  rules?: Rule[];
  size?: string;
  hidden?: boolean;
  ok?: any;
  modelValue?: string;
  placeholder?: string;
  inputClass?: string;
}

const focus = ref(false);
const message = ref("");
const isInput = ref(false);
const props = withDefaults(defineProps<Props>(), {
  type: "text",
  rules: () => [
    { min: 6, max: 15, rule: "[0-9a-zA-Z_.?&#]+", message: "不能填写字母数值之外的字符" }
  ],
  hidden: false,
  ok: false,
  size: "",
  placeholder: "",
  modelValue: ""
});
const emits = defineEmits(["update:modelValue", "update:ok", "enter"]);
const inputType = ref(props.type);

const check = () => {
  message.value = "";
  const value: string = props.modelValue;
  const length: number = value.length;

  for (let i = 0; i < props.rules.length; i++) {
    const rule = props.rules[i];
    if (rule.max && length > rule.max + 1) {
      message.value = `最大字符数量不能超过 ${rule.max}`;
      break;
    }

    if (rule.min && length < rule.min) {
      message.value = `最小字符数量需要超过 ${rule.min}`;
      break;
    }

    if (rule.rule.trim() && !new RegExp(rule.rule).test(value)) {
      message.value = rule?.message || "规则匹配失败";
      break;
    }
  }
  emits("update:ok", message.value);
};

const isOk = computed(() => {
  if (props.modelValue.trim().length === 0) message.value = "当前输入不能为空";
  return !message.value.trim();
});

const onChangeType = () => {
  inputType.value = inputType.value === "password" ? "text" : "password";
};

const onInput = (e: Event) => {
  isInput.value = true;
  const target = e.target as any;
  let value: string = target.value;

  props.rules.forEach((rule) => {
    if (!rule.replace) return;
    value = value.replace(new RegExp(rule.replace, "g"), "");
    if (rule.maxReplace) value = value.slice(0, rule.maxReplace);
  });

  emits("update:modelValue", value);
  target.value = value;
  setTimeout(() => check(), 60);
};

const onKeydown = (e: KeyboardEvent) => {
  if (e.code === "Enter") {
    emits("enter", e);
    e.stopPropagation();
    e.preventDefault();
  }
};

check();
emits("update:ok", message.value);
message.value = "";
</script>

<style scoped lang="scss"></style>
